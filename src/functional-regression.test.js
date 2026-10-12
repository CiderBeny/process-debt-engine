const { test } = require('node:test');
const assert = require('node:assert/strict');
global.window = global;
const elements = {};
global.document = { getElementById: function (id) { return elements[id] || null; } };
require('./config.js');
require('./i18n.js');
require('./utils.js');
require('./ui-renderers.js');
let stored = null;
global.localStorage = {
    getItem: function () { return stored; },
    setItem: function (key, value) { stored = value; },
    removeItem: function () { stored = null; }
};

test('nonmonetary bounds stay identical in every currency; money uses currency bounds', function () {
    for (const currency of Object.keys(PDE.EXCHANGE_RATES)) {
        PDE.currentCurrency = currency;
        for (const [id, bounds] of Object.entries(PDE.HASH_CONSTRAINTS)) {
            const rate = ['q4', 'q6', 'q8', 'capex'].includes(id) ? PDE.EXCHANGE_RATES[currency] : 1;
            elements[id] = { value: String(bounds.max * rate) };
            assert.equal(PDE.clamp(id), Math.round(bounds.max * rate * 100) / 100, currency + ': ' + id);
            elements[id].value = '-100';
            assert.equal(PDE.clamp(id), Math.round(bounds.min * rate * 100) / 100);
        }
    }
});

test('calibration saves USD money and unchanged hours across currencies', function () {
    stored = null;
    for (const currency of Object.keys(PDE.EXCHANGE_RATES)) {
        PDE.currentCurrency = currency;
        PDE.CALIBRATION.METRICS.forEach(function (m) {
            elements['calibActual_' + m.key] = { value: m.format === 'currency' ? String(1000 * PDE.EXCHANGE_RATES[currency]) : '123' };
        });
        PDE.saveCalibrationActuals();
        const saved = JSON.parse(stored);
        assert.equal(saved.version, 2);
        assert.equal(saved.currency, 'USD');
        assert.equal(saved.actuals.cWaste, 1000);
        assert.equal(saved.actuals.manualAnnualHrs, 123);
    }
});

test('legacy calibration is preserved until explicit currency migration', function () {
    stored = JSON.stringify({ cWaste: '3670', manualAnnualHrs: '123' });
    const original = stored;
    PDE.saveCalibrationActuals();
    assert.equal(stored, original);
    PDE.migrateCalibration('invalid');
    assert.equal(stored, original);
    PDE.migrateCalibration('PLN');
    assert.equal(JSON.parse(stored).actuals.cWaste, 1000);
    assert.equal(JSON.parse(stored).actuals.manualAnnualHrs, 123);
    assert.equal(PDE.parseCalibrationNumber('123,45'), 123.45);
    assert.ok(Number.isNaN(PDE.parseCalibrationNumber('')));
    assert.ok(Number.isNaN(PDE.parseCalibrationNumber('12oops')));
});
