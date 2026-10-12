const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const http = require('node:http');
const { createServer, serveAllowedPath } = require('../scripts/dev-server');

function sandbox(storage = null) {
    const elements = {};
    const context = vm.createContext({
        console: { error() {} },
        document: { getElementById(id) { return elements[id] || null; } },
        localStorage: { getItem() { return storage; } },
        location: { hash: '' },
        setTimeout, clearTimeout, URL, Intl,
    });
    context.window = context;
    for (const file of ['config.js', 'i18n.js', 'utils.js', 'state.js', 'exports.js', 'ui-renderers.js']) {
        vm.runInContext(fs.readFileSync(path.join(__dirname, file), 'utf8'), context, { filename: file });
    }
    return { context, elements, PDE: context.PDE };
}

test('production HTML escaping protects text and attribute contexts', () => {
    const { PDE } = sandbox();
    for (const value of ['<script>alert(1)</script>', '"><img src=x onerror=alert(1)>', "' autofocus onfocus='alert(1)", '&quot;<svg/onload=alert(1)>']) {
        assert.doesNotMatch(PDE.esc(value), /[<>"']/);
    }
});

test('production spreadsheet guard neutralizes formulas and leading controls', () => {
    const { PDE } = sandbox();
    for (const value of ['=1+1', '+cmd', '-1+2', '@SUM(A1)', '\t=1', '\r=1', '\n=1', '  =1', '\u0000=1']) {
        assert.equal(PDE.sanitizeCell(value), "'" + value);
    }
    for (const value of [42, -42, null, 'ordinary text']) assert.equal(PDE.sanitizeCell(value), value);
});

test('both production font cache paths reject inherited allowlist keys and CSS injection', () => {
    const valid = { family: 'Inter', weight: '400', style: 'normal', fmt: 'woff2', b64: 'dGVzdA==' };
    const poisoned = [];
    for (const key of ['family', 'style', 'fmt']) {
        for (const value of ['constructor', '__proto__', 'toString', "Inter';}body{display:none}/*"] ) {
            poisoned.push({ ...valid, [key]: value });
        }
    }
    const { PDE } = sandbox(JSON.stringify(poisoned));
    poisoned.forEach(face => assert.equal(PDE.validateFontFace(face), null));
    assert.equal(PDE.buildFontFaceCSS(), '');
    assert.ok(PDE.validateFontFace(valid));
    const inserted = [];
    const c = vm.createContext({ localStorage: { getItem() { return JSON.stringify(poisoned); } },
        document: { getElementById() { return null; }, createElement() { return {}; },
            currentScript: { parentNode: { insertBefore(el) { inserted.push(el); } } } } });
    c.top = c; c.self = c;
    vm.runInContext(fs.readFileSync(path.join(__dirname, 'font-bootstrap.js'), 'utf8'), c);
    assert.equal(inserted.length, 0);
});

test('production hash decoder rejects unknown keys and keeps all numeric writes bounded', () => {
    const { context, elements, PDE } = sandbox();
    PDE.currentCurrency = 'USD';
    for (const key of PDE.ALLOWED_HASH_KEYS) elements[key] = { value: 'unchanged' };
    for (const payload of ['NaN', 'Infinity', '-Infinity', '%zz', '%3Csvg%2Fonload%3Dalert(1)%3E']) {
        context.location.hash = '#q1=' + payload + '&__proto__=1&constructor=1&unknown=1&cur=__proto__';
        assert.doesNotThrow(() => PDE.decodeState());
        assert.equal(elements.q1.value, 'unchanged');
    }
    for (const key of PDE.ALLOWED_HASH_KEYS) {
        for (const value of [-1e100, 1e100, 0]) {
            context.location.hash = '#' + key + '=' + value;
            PDE.decodeState();
            const num = Number(elements[key].value);
            assert.ok(Number.isFinite(num) && num >= PDE.HASH_CONSTRAINTS[key].min && num <= PDE.HASH_CONSTRAINTS[key].max, key);
        }
    }
});

test('poisoned calibration storage is escaped in generated input markup', () => {
    const payload = '"><img src=x onerror=alert(1)>';
    const { PDE, elements } = sandbox(JSON.stringify({ version: 2, currency: 'USD', actuals: { cWaste: payload } }));
    elements.calibrationGrid = { innerHTML: '' };
    PDE.updateCalibration({ cWaste: 100 });
    assert.doesNotMatch(elements.calibrationGrid.innerHTML, /<img|onerror="/);
    assert.ok(elements.calibrationGrid.innerHTML.includes('&lt;img'));
});

test('invalid external exchange rates never overwrite fallback rates', async () => {
    for (const bad of [0, -1, Infinity, '4.2', null, 1e100]) {
        const { context, PDE } = sandbox();
        const original = JSON.stringify(PDE.EXCHANGE_RATES);
        context.fetch = async () => ({ ok: true, json: async () => [{ effectiveDate: '2026-10-12', rates: [
            { code: 'USD', mid: bad }, { code: 'EUR', mid: 4.3 }, { code: 'GBP', mid: 5.1 },
        ] }] });
        await PDE.fetchNbpRates();
        assert.equal(JSON.stringify(PDE.EXCHANGE_RATES), original);
        assert.equal(PDE.nbpFetching, false);
    }
});

test('worker rejects excessive, nonfinite and malformed simulation options before running', () => {
    for (const iterations of [Infinity, NaN, -1, 0, 10001, 1.5, '100']) {
        const messages = [];
        const c = vm.createContext({ self: { postMessage(message) { messages.push(message); } } });
        vm.runInContext(fs.readFileSync(path.join(__dirname, 'mc-worker.js'), 'utf8'), c);
        c.self.onmessage({ data: { baseParams: {}, opts: { iterations } } });
        assert.equal(messages.length, 1);
        assert.equal(messages[0].type, 'error');
        assert.equal(messages[0].message, 'Invalid simulation options');
    }
});

test('server rejects Windows aliases, encoded traversal and repository tooling', () => {
    for (const resource of ['PACKAGE.JSON', 'AGENTS.MD', 'src/STATE-ROUNDTRIP.TEST.JS', 'src/main.js.map', '.git/config',
        '%2e%2e%2fpackage.json', 'src%5c..%5cpackage.json', 'index.html::$DATA', 'package.json.', 'index.html%00',
        'NODE_MODULES/foo.js', 'scripts/dev-server.js', 'src/gen-og-image.js', 'reports/security/security-test-results.txt']) {
        assert.equal(serveAllowedPath(resource), null, resource);
    }
});

function request(port, resource, options = {}) {
    return new Promise((resolve, reject) => {
        const req = http.request({ hostname: '127.0.0.1', port, path: resource, ...options }, res => {
            let body = '';
            res.setEncoding('utf8'); res.on('data', chunk => { body += chunk; });
            res.on('end', () => resolve({ status: res.statusCode, headers: res.headers, body }));
        });
        req.on('error', reject); req.end();
    });
}

test('real HTTP server enforces headers, Host, methods and resource isolation', async () => {
    const server = createServer();
    await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
    const port = server.address().port;
    try {
        const ok = await request(port, '/index.html?cache=1', { headers: { Origin: 'https://attacker.example' } });
        assert.equal(ok.status, 200);
        assert.ok(ok.body.trimStart().startsWith('<!DOCTYPE html>'));
        assert.equal(ok.headers['access-control-allow-origin'], undefined);
        for (const resource of ['/.git/config', '/PACKAGE.JSON', '/src/security-runtime.test.js', '/%2e%2e/package.json', '/missing']) {
            const res = await request(port, resource);
            assert.equal(res.status, 404, resource);
            assert.equal(res.headers['x-content-type-options'], 'nosniff');
            assert.equal(res.headers['x-frame-options'], 'DENY');
        }
        assert.equal((await request(port, '/', { headers: { Host: 'attacker.example' } })).status, 403);
        assert.equal((await request(port, '/', { method: 'POST' })).status, 405);
        const head = await request(port, '/src/model.js', { method: 'HEAD' });
        assert.equal(head.status, 200); assert.equal(head.body, '');
        assert.match(ok.headers['content-security-policy'], /frame-ancestors 'none'/);
        assert.equal(ok.headers['referrer-policy'], 'no-referrer');
    } finally {
        await new Promise(resolve => server.close(resolve));
    }
});
