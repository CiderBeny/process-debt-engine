// Additional independent assertions; shared runner only supplies hosting/CDN/export infrastructure.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
module.exports = async function extra(page, context, url, evidence, label, reportRoot) {
    const record = (name, data) => { evidence.checks.push({ label, name, data }); console.log(label + ': ' + name); };
    const finite = async () => assert.ok(await page.evaluate(() => Number.isFinite(PDE._lastResult.totalImpact)));
    for (const mode of ['quick', 'full']) {
        await page.locator('[data-mode="' + mode + '"]').click();
        assert.equal(await page.evaluate(() => PDE.currentMode), mode);
        for (const preset of ['low', 'medium', 'high']) {
            await page.locator('[data-preset="' + preset + '"]').click();
            await finite();
            const q1 = await page.locator('#q1').inputValue();
            assert.equal(q1, {low:'70', medium:'25', high:'15'}[preset]);
            record('mode/preset ' + mode + '/' + preset, await page.evaluate(() => PDE._lastResult.totalImpact));
        }
        for (const region of await page.locator('#regionSelect option').evaluateAll(els => els.map(el => el.value))) {
            await page.locator('#regionSelect').selectOption(region);
            const actual = await page.evaluate(() => {
                const r = PDE.REGION_DEFAULTS[document.getElementById('regionSelect').value];
                return Object.entries(r).map(([id, value]) => ({id, expected: ['q4','q6','q8','capex'].includes(id) ? +(value * PDE.EXCHANGE_RATES[PDE.currentCurrency]).toFixed(2) : value, actual: +document.getElementById(id).value}));
            });
            actual.forEach(item => assert.equal(item.actual, item.expected));
            await finite(); record('region ' + mode + '/' + region, actual);
        }
    }
    await page.locator('#resetBtn').click();
    await page.locator('#toggleAdvancedQuestions').click();
    const inputs = await page.locator('input[type=number], input[type=range]').evaluateAll(els => els.filter(el => el.id && !el.disabled).map(el => ({id:el.id,min:el.min,max:el.max,value:el.value,type:el.type})));
    for (const input of inputs) {
        for (const value of [input.min,input.max]) {
            if (value === '') continue;
            await page.locator('#' + input.id).evaluate((el,value) => { el.value=value; el.dispatchEvent(new Event('input',{bubbles:true})); }, value);
            await finite();
            assert.equal(await page.locator('#' + input.id).inputValue(), value);
        }
        await page.locator('#' + input.id).evaluate((el,value) => {el.value=value;el.dispatchEvent(new Event('input',{bubbles:true}));},input.value);
        record('legal input boundaries ' + input.id);
    }
    for (const value of ['-1','101','','1e100']) {
        await page.locator('#q1').fill(value); await finite();
        record('invalid q1 ' + value, await page.evaluate(() => ({value:document.getElementById('q1').value,params:PDE.getParams().q1,error:document.getElementById('q1').classList.contains('input-error')})));
    }
    await page.locator('#resetBtn').click();
    await page.locator('[data-tab="advanced"]').click();
    await page.locator('details').evaluateAll(els => els.forEach(el => el.open=true));
    for (const id of ['correlationsToggle','nonlinearToggle','advancedRiskToggle']) {
        await page.locator('#'+id).check(); await finite();
        await page.locator('#'+id).uncheck(); await finite(); record('toggle ' + id);
    }
    for (const values of [[100,50,5,10],[10000,99,30,50]]) {
        await page.locator('#probabilisticToggle').check();
        for (const [i,id] of ['mcIterations','mcConfidence','mcUncertaintyPct','mcMttrUncertaintyPct'].entries()) {
            await page.locator('#'+id).evaluate((el,value) => {el.value=value;el.dispatchEvent(new Event('input',{bubbles:true}));},String(values[i]));
        }
        await page.waitForFunction(() => document.getElementById('mcProgress').style.display==='none' && document.getElementById('totalImpact').textContent.includes('['));
        const first = await page.locator('#totalImpact').textContent();
        await page.evaluate(() => PDE.calculate());
        await page.waitForFunction(() => document.getElementById('mcProgress').style.display==='none');
        assert.equal(await page.locator('#totalImpact').textContent(),first);
        await page.locator('#mcRerollBtn').click();
        await page.waitForFunction(() => document.getElementById('mcProgress').style.display==='none');
        record('MC boundary / stable repeat / reroll', {values,result:await page.locator('#totalImpact').textContent()});
        await page.locator('#probabilisticToggle').uncheck();
    }
    const charts = await page.evaluate(() => Object.entries(Chart.instances).map(([id,c]) => ({id,type:c.config.type,width:c.width,datasets:c.data.datasets.length,data:c.data.datasets.map(d=>d.data)})));
    assert.ok(charts.length>=4); assert.ok(charts.every(c=>c.width>0 && c.datasets>0)); record('real charts and sensitivity', charts);
    for (const currency of ['USD','EUR','PLN','GBP']) {
        await page.locator('#currencySelect').selectOption(currency);
        await page.locator('#q1').fill('37');
        const share = await page.evaluate(() => {PDE.encodeState();return {url:location.href,params:PDE.getParams()};});
        await page.goto(share.url); await page.reload();
        await page.waitForFunction(() => PDE._lastResult && !PDE.nbpFetching);
        assert.equal(await page.locator('#q1').inputValue(),'37');
        const current = await page.evaluate(() => PDE.getParams());
        for (const key of ['downCost','rate','opportunityVal','capex']) assert.ok(Math.abs(current[key]-share.params[key])<0.02,key);
        record('share actual reload ' + currency);
    }
    await page.locator('#resetBtn').click();
    await page.locator('#calibrationBody').evaluate(el => el.style.display='block');
    await page.locator('#calibActual_cWaste').fill('1234.5');
    await page.locator('#calibActual_cWaste').blur();
    const stored = await page.evaluate(()=>PDE.readCalibration());
    assert.ok(stored.actuals.cWaste>0);
    await page.locator('#resetBtn').click();
    assert.deepEqual(await page.evaluate(()=>PDE.readCalibration()), stored);
    await page.reload(); await page.waitForFunction(()=>PDE._lastResult && !PDE.nbpFetching);
    assert.deepEqual(await page.evaluate(()=>PDE.readCalibration()),stored);
    await page.locator('#calibResetBtn').click();
    assert.equal(await page.locator('#calibActual_cWaste').inputValue(),'');
    record('calibration persist / scenario reset preserves / actuals reset');
    await page.setViewportSize({width:390,height:844});
    await page.locator('[data-mode="quick"]').click();
    await page.locator('#q1').fill('33'); await finite();
    await page.screenshot({path:path.join(reportRoot,label+'-mobile.png'),fullPage:true});
    record('mobile 390x844',await page.evaluate(() => ({width:innerWidth,scrollWidth:document.documentElement.scrollWidth})));
    await page.setViewportSize({width:1440,height:900});
    await page.locator('[data-mode="full"]').click();
    await page.locator('#resetBtn').click();
    // Invalid exchange-rate responses must preserve the previous rates.
    const rates = await page.evaluate(()=>JSON.stringify(PDE.EXCHANGE_RATES));
    await page.route('https://api.nbp.pl/**',route=>route.fulfill({json:[{effectiveDate:'bad',rates:[]}]}));
    await page.evaluate(()=>PDE.fetchNbpRates());
    assert.equal(await page.evaluate(()=>JSON.stringify(PDE.EXCHANGE_RATES)),rates);
    await finite(); record('malformed NBP preserves rates');
    await page.unroute('https://api.nbp.pl/**');
    // A fresh receiver without API access must start using validated fallback rates.
    const offline = await context.newPage();
    await offline.route('https://api.nbp.pl/**',route=>route.abort());
    await offline.goto(url); await offline.waitForFunction(()=>PDE._lastResult && !PDE.nbpFetching);
    assert.ok(await offline.evaluate(()=>Number.isFinite(PDE._lastResult.totalImpact)));
    record('fresh NBP network failure fallback',await offline.evaluate(()=>PDE.EXCHANGE_RATES));
    await offline.close();
    fs.writeFileSync(path.join(reportRoot,label+'-extra.json'),JSON.stringify(evidence.checks,null,2));
};


