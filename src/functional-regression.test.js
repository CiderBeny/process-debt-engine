const { test } = require('node:test');
const assert = require('node:assert/strict');
global.window = global;
const elements = {};
global.document = { getElementById: function (id) { return elements[id] || null; } };
require('./config.js');
require('./i18n.js');
require('./utils.js');

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
