// Deterministic security checks: third-party networking is intentionally blocked.
const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const { createServer } = require('./dev-server');

(async function () {
    const server = createServer();
    await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
    let browser;
    try {
        browser = await chromium.launch({ channel: 'msedge', headless: true, timeout: 20000 });
        const page = await browser.newPage();
        const origin = 'http://127.0.0.1:' + server.address().port;
        await page.route('**/*', route => route.request().url().startsWith(origin) ? route.continue() : route.abort());
        await page.goto(origin, { waitUntil: 'load' });
        assert.equal(await page.locator('body').evaluate(el => getComputedStyle(el).display !== 'none'), true);
        const result = await page.evaluate(async () => {
            const violations = [];
            document.addEventListener('securitypolicyviolation', event => violations.push(event.effectiveDirective));
            const script = document.createElement('script');
            script.textContent = 'window.securityProbeExecuted = true';
            document.head.appendChild(script);
            const object = document.createElement('object');
            object.data = '/index.html'; document.body.appendChild(object);
            try { await fetch('https://attacker.invalid/probe'); } catch { /* expected CSP rejection */ }
            localStorage.setItem(PDE.CALIBRATION.STORAGE_KEY, JSON.stringify({ version: 2, currency: 'USD', actuals: { cWaste: '"><img src=x onerror="window.securityProbeExecuted=true">' } }));
            PDE.updateCalibration({ cWaste: 100 });
            location.hash = '#q1=%3Csvg%2Fonload%3Dalert(1)%3E&cur=__proto__';
            PDE.decodeState();
            const worker = new Worker('/src/mc-worker.js');
            const reply = await new Promise((resolve, reject) => {
                const timer = setTimeout(() => reject(new Error('worker timeout')), 5000);
                worker.onmessage = event => { clearTimeout(timer); resolve(event.data); };
                worker.postMessage({ baseParams: {}, opts: { iterations: 10001 } });
            });
            worker.terminate();
            await new Promise(resolve => setTimeout(resolve, 100));
            return { executed: !!window.securityProbeExecuted, violations, imageCount: document.querySelectorAll('#calibrationGrid img').length, reply };
        });
        assert.equal(result.executed, false);
        assert.equal(result.imageCount, 0);
        assert.equal(result.reply.type, 'error');
        for (const directive of ['script-src-elem', 'object-src', 'connect-src']) assert.ok(result.violations.includes(directive), directive);
        console.log(JSON.stringify({ browser: await browser.version(), checks: ['top-level visibility', 'inline script CSP', 'object CSP', 'external connection CSP', 'stored calibration XSS', 'malformed hash', 'worker iteration ceiling'], result }, null, 2));
    } finally {
        if (browser) await browser.close();
        await new Promise(resolve => server.close(resolve));
    }
})().catch(error => { console.error(error); process.exitCode = 1; });
