const { test } = require('node:test');
const assert = require('node:assert/strict');
global.window = global;
const elements = {};
global.document = { getElementById: function (id) { return elements[id] || null; } };
require('./config.js');
require('./i18n.js');
require('./utils.js');
require('./ui-renderers.js');
require('./exports.js');
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

test('reset covers every shareable field, toggles and seed, preserving preferences and actuals', function () {
    assert.deepEqual(Object.keys(PDE.SCENARIO_DEFAULTS).sort(), [...PDE.ALLOWED_HASH_KEYS].sort());
    const original = { calculate: PDE.calculate, validateField: PDE.validateField, encodeState: PDE.encodeState };
    PDE.calculate = function () {};
    PDE.validateField = function () {};
    PDE.encodeState = function () {};
    PDE.TOGGLE_IDS = ['correlationsToggle', 'nonlinearToggle', 'probabilisticToggle', 'advancedRiskToggle'];
    PDE.applyToggleVisibility = function () {};
    PDE.saveToggleStates = function () {};
    const saved = stored;
    try {
        for (const currency of Object.keys(PDE.EXCHANGE_RATES)) {
            PDE.currentCurrency = currency;
            PDE.currentLang = 'pl';
            PDE.currentMode = 'full';
            for (const id of PDE.ALLOWED_HASH_KEYS) elements[id] = { value: '0' };
            PDE.TOGGLE_IDS.forEach(function (id) { elements[id] = { checked: true }; });
            PDE._mcSeed = 123;
            PDE.resetScenario();
            for (const [id, value] of Object.entries(PDE.SCENARIO_DEFAULTS)) {
                const rate = ['q4', 'q6', 'q8', 'capex'].includes(id) ? PDE.EXCHANGE_RATES[currency] : 1;
                assert.equal(Number(elements[id].value), value * rate, currency + ': ' + id);
            }
            assert.ok(PDE.TOGGLE_IDS.every(function (id) { return !elements[id].checked; }));
            assert.equal(PDE._mcSeed, undefined);
            assert.equal(PDE.currentLang, 'pl');
            assert.equal(PDE.currentMode, 'full');
            assert.equal(PDE.currentCurrency, currency);
            assert.equal(stored, saved);
        }
    } finally { Object.assign(PDE, original); }
});

test('calibration renders signed monetary differences and converted input values', function () {
    elements.calibrationGrid = { innerHTML: '' };
    elements.calibrationScore = { innerHTML: '' };
    for (const currency of Object.keys(PDE.EXCHANGE_RATES)) {
        PDE.currentCurrency = currency;
        for (const lang of ['pl', 'en']) {
            PDE.currentLang = lang;
            for (const actual of [50, 100, 150]) {
                stored = JSON.stringify({ version: 2, currency: 'USD', actuals: { cWaste: actual } });
                PDE.updateCalibration({ cWaste: 400 });
                const expected = (actual >= 100 ? '+' : '-') + PDE.formatCurrency(Math.abs(actual - 100));
                assert.ok(elements.calibrationGrid.innerHTML.includes('<span class="calib-variance">' + expected + '</span>'));
                assert.ok(elements.calibrationGrid.innerHTML.includes('value="' + Math.round(actual * PDE.EXCHANGE_RATES[currency] * 100) / 100 + '"'));
            }
        }
    }
});

test('export money labels resolve to USD without changing UI translations', function () {
    for (const lang of ['en', 'pl']) {
        PDE.currentLang = lang;
        const exported = PDE.exportTranslations();
        assert.ok(!JSON.stringify(exported).includes('{C}'));
        assert.ok(!JSON.stringify(exported).includes('{CC}'));
        assert.equal(exported.xlsInputsRows.find(function (row) { return row[0] === 'Q4'; })[3], lang === 'en' ? 'USD/hr' : 'USD/godz.');
        assert.ok(JSON.stringify(PDE.TRANSLATIONS[lang]).includes('{C}'));
    }
});
