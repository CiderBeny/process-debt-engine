// Candidate release regression in an isolated static-host snapshot.
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const crypto = require('node:crypto');
const vm = require('node:vm');
const { execFileSync } = require('node:child_process');
const assert = require('node:assert/strict');
const { chromium } = require('playwright');
const { createServer } = require('./dev-server');
const root = path.resolve(__dirname, '..');
const reportRoot = path.join(root, 'reports', 'functional');
const environment = root;

function staticServer() {
    return http.createServer((req, res) => {
        try {
            const url = new URL(req.url, 'http://localhost');
            if (!url.pathname.startsWith('/process-debt-engine/')) throw new Error('prefix');
            const rel = decodeURIComponent(url.pathname.slice('/process-debt-engine/'.length)) || 'index.html';
            const file = path.resolve(environment, rel);
            if (!file.startsWith(environment + path.sep)) throw new Error('path');
            const mime = { '.html': 'text/html', '.js': 'application/javascript', '.css': 'text/css', '.ttf': 'font/ttf', '.png': 'image/png' };
            // Deliberately no dev CSP/X-Frame-Options: exercise production meta CSP.
            res.writeHead(200, { 'Content-Type': mime[path.extname(file)] || 'application/octet-stream' });
            res.end(fs.readFileSync(file));
        } catch { res.writeHead(404); res.end(); }
    });
}

function baselineModel() {
    const context = vm.createContext({ console, Intl });
    context.window = context;
    for (const file of ['config.js', 'i18n.js', 'utils.js', 'model.js']) {
        const source = execFileSync('git', ['show', 'main:src/' + file], { cwd: root, encoding: 'utf8' });
        vm.runInContext(source, context);
    }
    return context.PDE;
}

async function run() {
    const evidence = { started: new Date().toISOString(), checks: [], pageErrors: [], dialogs: [], dependencies: [] };
    const remote = new Map();
    const html = fs.readFileSync(path.join(environment, 'index.html'), 'utf8');
    for (const [tag, url] of html.matchAll(/<script\b[^>]*src="(https:[^"]+)"[^>]*>/g)) {
        const pin = tag.match(/integrity="([^"]+)"/);
        if (!pin) continue;
        const bytes = execFileSync('curl.exe', ['--fail', '--silent', '--show-error', '--location', '--max-time', '40', url], { maxBuffer: 10000000 });
        assert.equal('sha384-' + crypto.createHash('sha384').update(bytes).digest('base64'), pin[1]);
        remote.set(url, bytes); evidence.dependencies.push({ url, sri: 'verified', bytes: bytes.length });
    }
    const nbpUrl = 'https://api.nbp.pl/api/exchangerates/tables/A/last?format=json';
    const nbp = JSON.parse(execFileSync('curl.exe', ['--fail', '--silent', '--show-error', '--max-time', '40', nbpUrl], { encoding: 'utf8' }));
    evidence.nbpDate = nbp[0].effectiveDate;
    const baseline = baselineModel();
    const servers = [createServer(environment), staticServer()];
    let browser;
    try {
        for (const server of servers) await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
        browser = await chromium.launch({ channel: 'msedge', headless: true, timeout: 20000 });
        evidence.browser = await browser.version();
        for (const [i, server] of servers.entries()) {
            const label = i === 0 ? 'hardened-server' : 'production-subpath-meta-CSP';
            const origin = 'http://127.0.0.1:' + server.address().port;
            const url = origin + (i === 0 ? '/' : '/process-debt-engine/');
            const context = await browser.newContext({ acceptDownloads: true });
            await context.route('**/*', async route => {
                const target = route.request().url();
                if (remote.has(target)) return route.fulfill({ body: remote.get(target), contentType: 'application/javascript', headers: { 'access-control-allow-origin': '*' } });
                if (target === nbpUrl) return route.fulfill({ json: nbp, headers: { 'access-control-allow-origin': '*' } });
                if (target.startsWith(origin)) return route.continue();
                // Keep analytics and optional online font fetching out of test traffic.
                return route.abort();
            });
            const page = await context.newPage();
            page.on('console', msg => { if (msg.type() === 'error' || msg.type() === 'warning') (evidence.console ||= []).push({ label, type: msg.type(), message: msg.text() }); }); page.on('pageerror', error => evidence.pageErrors.push({ label, message: error.message }));
            page.on('dialog', async dialog => { evidence.dialogs.push({ label, message: dialog.message() }); await dialog.dismiss(); });
            await page.goto(url, { waitUntil: 'load' });
            await page.waitForFunction(() => PDE._lastResult && !PDE.nbpFetching);
            assert.equal(await page.evaluate(() => typeof Chart + '/' + typeof XLSX + '/' + typeof jspdf.jsPDF + '/' + typeof html2canvas), 'function/object/function/function');
            evidence.checks.push(label + ': startup and real CDN libraries'); await require('./functional-extra')(page, context, url, evidence, label, reportRoot);
            for (const lang of ['en', 'pl']) {
                if (await page.evaluate(() => PDE.currentLang) !== lang) await page.locator('#langBtn').click();
                for (const currency of ['USD', 'EUR', 'PLN', 'GBP']) {
                    await page.locator('#currencySelect').selectOption(currency);
                    const state = await page.evaluate(() => ({ params: PDE.getParams(), result: PDE._lastResult, rate: PDE.EXCHANGE_RATES[PDE.currentCurrency] }));
                    const expected = JSON.parse(JSON.stringify(baseline.computeModel(state.params)));
                    assert.deepEqual(state.result, expected, label + ':' + lang + ':' + currency + ' model parity');
                    assert.ok(state.rate > 0 && Number.isFinite(state.result.totalImpact));
                    assert.ok(await page.locator('#totalImpact').textContent());
                    evidence.checks.push(label + ': ' + lang + '/' + currency + ' baseline model parity');
                }
            }
            await page.locator('[data-mode="full"]').click();
            assert.equal(await page.evaluate(() => PDE.currentMode), 'full');
            await page.locator('#q1').fill('35');
            const input = await page.evaluate(() => ({ q1: document.getElementById('q1').value, result: PDE._lastResult.totalImpact }));
            assert.equal(input.q1, '35'); assert.ok(Number.isFinite(input.result));
            const shared = await page.evaluate(() => { PDE.encodeState(); return { url: location.href, hash: location.hash, value: document.getElementById('q4').value }; });
            await page.goto(shared.url, { waitUntil: 'load' });
            // A hash-only navigation does not rerun startup; force a receiver reload.
            await page.reload({ waitUntil: 'load' });
            await page.waitForFunction(() => PDE._lastResult && !PDE.nbpFetching);
            assert.equal(await page.locator('#q1').inputValue(), '35');
            assert.equal(await page.evaluate(() => PDE.currentMode), 'full');
            assert.equal(await page.evaluate(() => PDE._hashCurrency), 'GBP');
            evidence.checks.push(label + ': full mode, input updates and cross-currency share reload');
            await page.locator('[data-tab="advanced"]').click();
            await page.locator('#probabilisticToggle').evaluate(el => {
                for (let parent = el.parentElement; parent; parent = parent.parentElement) {
                    if (parent.tagName === 'DETAILS') parent.open = true;
                }
            });
            await page.locator('#probabilisticToggle').check();
            await page.waitForFunction(() => document.getElementById('mcProgress').style.display === 'none' && document.getElementById('totalImpact').textContent.includes('['), { timeout: 20000 });
            evidence.checks.push(label + ': real Monte Carlo worker result rendered');
            await page.locator('#probabilisticToggle').uncheck();
            const rates = await page.evaluate(() => JSON.stringify(PDE.EXCHANGE_RATES));
            await page.route(nbpUrl, route => route.fulfill({ status: 503, body: '{}' }));
            await page.evaluate(() => PDE.fetchNbpRates());
            assert.equal(await page.evaluate(() => JSON.stringify(PDE.EXCHANGE_RATES)), rates);
            evidence.checks.push(label + ': NBP failure preserves rates');
            if (i === 1) {
                await page.locator('#langBtn').click();
                await page.locator('#currencySelect').selectOption('PLN');
                await page.evaluate(() => { document.getElementById('calibrationBody').style.display = 'block'; });
                await page.locator('#calibActual_cWaste').fill('1234,50');
                await page.locator('#calibActual_cWaste').blur();
                assert.ok(await page.evaluate(() => PDE.readCalibration().actuals.cWaste > 0));
                evidence.checks.push(label + ': Polish calibration save');
                fs.mkdirSync(path.join(reportRoot, 'downloads'), { recursive: true });
                for (const format of ['xlsx', 'csv', 'pdf-simple', 'pdf-full']) {
                    const pending = page.waitForEvent('download', { timeout: 90000 });
                    await page.evaluate(format => {
                        if (format === 'xlsx') PDE.exportExcel();
                        else if (format === 'csv') PDE.exportCsv();
                        else PDE.exportPDF(format === 'pdf-full' ? 'full' : 'simple');
                    }, format);
                    const download = await pending;
                    const file = path.join(reportRoot, 'downloads', format + path.extname(download.suggestedFilename()));
                    await download.saveAs(file);
                    const bytes = fs.readFileSync(file);
                    assert.ok(bytes.length > 100);
                    if (format === 'xlsx') {
                        const workbook = await page.evaluate(data => {
                            const wb = XLSX.read(new Uint8Array(data), { type: 'array' });
                            return { sheets: wb.SheetNames, first: XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]], { header: 1 }) };
                        }, [...bytes]);
                        assert.ok(workbook.sheets.length >= 3 && workbook.first.length > 10);
                        const financial = await page.evaluate(data => {
                            const wb = XLSX.read(new Uint8Array(data), { type: 'array' });
                            const rows = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[1]], {header:1});
                            const r = PDE._lastResult, p = PDE.getParams();
                            return {rows:rows.slice(3,12), expected:[Math.round(r.cWaste),Math.round(r.cRisk),Math.round(r.cOppDirect),Math.round(r.totalImpact),Math.round(p.capex),Math.round(r.netDebt),Math.round(r.potentialSavings),Math.round(r.paybackMonths*10)/10,PDE.formatIRR(r.irr)]};
                        }, [...bytes]);
                        assert.deepEqual(financial.rows.map(row=>row[2]),financial.expected);
                        assert.equal(financial.rows[3][0],await page.evaluate(()=>PDE.TRANSLATIONS[PDE.currentLang].xlsResultsRows[3][0]));
                        evidence.xlsxFinancial = financial;
                    } else if (format === 'csv') assert.ok(bytes.toString('utf8').includes('totalImpact'));
                    else { assert.equal(bytes.subarray(0, 5).toString(), '%PDF-'); assert.ok(bytes.toString('latin1').includes('%%EOF')); }
                    evidence.checks.push(label + ': ' + format + ' actual download validated (' + bytes.length + ' bytes)');
                }
                await page.locator('#resetBtn').click();
                assert.ok(Number.isFinite(await page.evaluate(() => PDE._lastResult.totalImpact)));
                evidence.checks.push(label + ': reset remains functional');
                await page.screenshot({ path: path.join(reportRoot, 'test-app.png'), fullPage: true });
            }
            await context.close();
        }
        assert.deepEqual(evidence.pageErrors, []);
        assert.deepEqual(evidence.dialogs, []);
        evidence.status = 'PASS';
    } catch (error) {
        evidence.status = 'FAIL'; evidence.error = error.stack; throw error;
    } finally {
        fs.writeFileSync(path.join(reportRoot, 'browser-regression-results.json'), JSON.stringify(evidence, null, 2));
        if (browser) await browser.close();
        for (const server of servers) await new Promise(resolve => server.close(resolve));
    }
    console.log(JSON.stringify(evidence, null, 2));
}
run().catch(error => { console.error(error); process.exitCode = 1; });



