// ═══════════════════════════════════════════════════════════════
// Utility functions — XSS guard, i18n, currency, sliders, IO
// ═══════════════════════════════════════════════════════════════
window.PDE = window.PDE || {};
var PDE = window.PDE;

// seededRandom + randn migrated to src/mc-worker.js (Web Worker)

PDE.esc = function esc(str) {
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
};

PDE.t = function t(key) {
    let val = PDE.TRANSLATIONS[PDE.currentLang][key] ?? PDE.TRANSLATIONS.en[key] ?? key;
    if (typeof val === 'string') {
        val = val.replace('{C}', PDE.CURRENCY_SYMBOLS[PDE.currentCurrency])
                 .replace('{CC}', PDE.currentCurrency);
    }
    return val;
};

PDE.applyTranslations = function applyTranslations() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        const val = PDE.t(key);
        if (val && typeof val === 'string') el.textContent = val;
    });
    document.querySelectorAll('[data-i18n-formula]').forEach(el => {
        const key = el.getAttribute('data-i18n-formula');
        const val = PDE.t(key);
        if (val && typeof val === 'string') {
            el.setAttribute('data-formula', val);
            el.setAttribute('aria-label', 'Formula: ' + val);
        }
    });
    document.documentElement.lang = PDE.currentLang;
};

PDE.toggleLang = function toggleLang() {
    PDE.currentLang = PDE.currentLang === 'en' ? 'pl' : 'en';
    const btn = document.getElementById('langBtn');
    document.getElementById('langFlag').textContent = PDE.currentLang === 'en' ? '🇵🇱' : '🇬🇧';
    document.getElementById('langLabel').textContent = PDE.currentLang === 'en' ? 'PL' : 'EN';
    PDE.applyTranslations();
    PDE.updateSliderFills();
    PDE.calculate();
    const footerEl = document.getElementById('nbpFooter');
    if (footerEl) {
        const t = PDE.TRANSLATIONS[PDE.currentLang];
        footerEl.textContent = PDE.nbpDate
            ? t.nbpFooter(new Date(PDE.nbpDate).toLocaleDateString(PDE.currentLang === 'pl' ? 'pl-PL' : 'en-US'))
            : t.nbpUnavailable;
    }
};

PDE.formatCurrency = function formatCurrency(amountUSD) {
    const converted = amountUSD * PDE.EXCHANGE_RATES[PDE.currentCurrency];
    const locale = PDE.currentLang === 'pl' ? 'pl-PL' : 'en-US';
    return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: PDE.currentCurrency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(converted);
};

PDE.usdToCurrency = function usdToCurrency(amountUSD) {
    return amountUSD * PDE.EXCHANGE_RATES[PDE.currentCurrency];
};

PDE.currencyToUsd = function currencyToUsd(amount) {
    return amount / PDE.EXCHANGE_RATES[PDE.currentCurrency];
};

PDE.toggleCurrency = function toggleCurrency(currency) {
    if (currency === PDE.currentCurrency) return;
    const prevCurrency = PDE.currentCurrency;
    const monetaryIds = ['q4', 'q6', 'q8', 'capex'];
    const prevRate = PDE.EXCHANGE_RATES[prevCurrency];
    const newRate = PDE.EXCHANGE_RATES[currency];
    monetaryIds.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            const valInPrev = parseFloat(el.value) || 0;
            const valInUSD = valInPrev / prevRate;
            const valInNew = valInUSD * newRate;
            el.value = (Math.round(valInNew * 100) / 100).toFixed(2);
        }
    });
    PDE.currentCurrency = currency;
    document.getElementById('currencySelect').value = currency;
    PDE.applyTranslations();
    PDE.calculate();
    const footerEl = document.getElementById('nbpFooter');
    if (footerEl) {
        const t = PDE.TRANSLATIONS[PDE.currentLang];
        footerEl.textContent = PDE.nbpDate
            ? t.nbpFooter(new Date(PDE.nbpDate).toLocaleDateString(PDE.currentLang === 'pl' ? 'pl-PL' : 'en-US'))
            : t.nbpUnavailable;
    }
};

PDE.updateSliderFills = function updateSliderFills() {
    function setSliderFill(inputId, fillId, min, max) {
        const input = document.getElementById(inputId);
        const fill  = document.getElementById(fillId);
        if (!input || !fill) return;
        const pct = ((input.value - min) / (max - min) * 100).toFixed(1) + '%';
        fill.style.width = pct;
    }
    setSliderFill('q3',            'q3Fill',            1, 5);
    setSliderFill('q9',            'q9Fill',            1, 5);
    setSliderFill('autoLevel',     'autoLevelFill',     0, 100);
    setSliderFill('opexAdjMult',   'opexAdjMultFill',   0, 30);
    setSliderFill('erosionRate',   'erosionRateFill',   0, 100);
    setSliderFill('discountRate',  'discountRateFill',  5, 20);
    setSliderFill('timeHorizon',   'timeHorizonFill',   3, 10);
    setSliderFill('leverAutomation','leverAutomationFill',10, 60);
    setSliderFill('leverRisk',     'leverRiskFill',     20, 80);
};

PDE.readAdvanced = function readAdvanced(id, defaultVal, divisor) {
    var el = document.getElementById(id);
    if (!el) return defaultVal;
    var raw = parseFloat(el.value);
    return isFinite(raw) ? raw / (divisor || 1) : defaultVal;
};

PDE.isMobileBrowser = function isMobileBrowser() {
    const ua = navigator.userAgent || '';
    return /iPhone|iPad|iPod|Android|webOS|BlackBerry|Windows Phone|IEMobile|Opera Mini/i.test(ua)
        || (navigator.maxTouchPoints > 1 && /Macintosh/i.test(ua));
};

PDE.clamp = function clamp(id) {
    const c = PDE.HASH_CONSTRAINTS[id];
    const raw = parseFloat(document.getElementById(id)?.value);
    if (!c) return isFinite(raw) ? raw : 0;
    if (!isFinite(raw)) return c.min;
    const minInCurrency = c.min * PDE.EXCHANGE_RATES[PDE.currentCurrency];
    const maxInCurrency = c.max * PDE.EXCHANGE_RATES[PDE.currentCurrency];
    return Math.round(Math.min(maxInCurrency, Math.max(minInCurrency, raw)) * 100) / 100;
};

PDE.flashBtn = function flashBtn(btn, orig) {
    btn.textContent = '✓ COPIED';
    setTimeout(() => btn.textContent = orig, 2000);
};

PDE.fetchNbpRates = async function fetchNbpRates() {
    try {
        const res = await fetch('https://api.nbp.pl/api/exchangerates/tables/A/today?format=json');
        const data = await res.json();
        const rates = data[0].rates;
        const getMid = (code) => rates.find(r => r.code === code).mid;

        const plnPerUsd = getMid('USD');
        const plnPerEur = getMid('EUR');
        const plnPerGbp = getMid('GBP');

        PDE.EXCHANGE_RATES['PLN'] = plnPerUsd;
        PDE.EXCHANGE_RATES['EUR'] = plnPerUsd / plnPerEur;
        PDE.EXCHANGE_RATES['GBP'] = plnPerUsd / plnPerGbp;
        PDE.EXCHANGE_RATES['USD'] = 1;

        PDE.nbpDate = data[0].effectiveDate;
        const footerEl = document.getElementById('nbpFooter');
        if (footerEl) footerEl.textContent = PDE.TRANSLATIONS[PDE.currentLang].nbpFooter(new Date(PDE.nbpDate).toLocaleDateString(PDE.currentLang === 'pl' ? 'pl-PL' : 'en-US'));

        if (PDE.currentCurrency !== 'USD') PDE.calculate();
    } catch (e) {
        console.error('NBP API fetch failed:', e);
        const footerEl = document.getElementById('nbpFooter');
        if (footerEl) footerEl.textContent = PDE.TRANSLATIONS[PDE.currentLang].nbpUnavailable;
    }
};
