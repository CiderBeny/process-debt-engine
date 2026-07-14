// ═══════════════════════════════════════════════════════════════
// Monte Carlo simulation — Web Worker (migrated from model.js)
// Self-contained: no dependency on PDE namespace or DOM
// ═══════════════════════════════════════════════════════════════

// ── Constants (mirrors PDE.COEFFICIENTS) ──
var C = {
    ANNUAL_HOURS_PER_ENGINEER: 1800,
    MONTHS_PER_YEAR: 12,
    QUARTERS_PER_YEAR: 4,
    PIPELINE_EROSION_RATE_DEFAULT: 0.1,
    OPEX_ADJ_MULTIPLIER_DEFAULT: 0.15,
    SCEN_C_AUTO_LEVEL: 0.8,
    SCEN_C_CAPEX_MULTIPLIER: 1.5,
    LEVER_AUTOMATION_DEFAULT: 0.3,
    LEVER_RISK_DEFAULT: 0.6,
    LEVER_INNOVATION: 0.5,
    LEVER_MANAGEMENT: 0.15,
    LEVER_TURNOVER: 0.3,
    TURNOVER_REF_HOURS: 1800,
    RISK_SCALE_MAX: 5,
    AUTOMATABLE_SHARE: 0.6,
    DISCOUNT_RATE_DEFAULT: 0.10,
    TIME_HORIZON_YEARS_DEFAULT: 5,
};

var RD = { securityWeight: 0.4, regulatoryWeight: 0.25 };
var CD = { correlationMultiplier: 0.3, corrQ3Q1: 15, corrQ1Q5: 3, corrQ1Q7: 20, corrQ3Q7: 10 };

// ── Seeded PRNG (LCG) ──
function seededRandom(seed) {
    var s = seed || Date.now();
    return function () {
        s = (s * 1664525 + 1013904223) & 0xFFFFFFFF;
        return (s >>> 0) / 0xFFFFFFFF;
    };
}

// ── Box-Muller transform → standard normal variate ──
function randn(rng) {
    var u = 0, v = 0;
    while (u === 0) u = rng();
    while (v === 0) v = rng();
    return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

// ── Discounted payback (mirrors PDE.discountedPayback) ──
function discountedPayback(annualSavings, investment, rate, maxYears) {
    if (annualSavings <= 0 || investment <= 0) return Infinity;
    if (rate === undefined) rate = C.DISCOUNT_RATE_DEFAULT;
    if (maxYears === undefined) maxYears = C.TIME_HORIZON_YEARS_DEFAULT;
    var monthly = annualSavings / 12;
    var cumulative = 0;
    var maxMonths = maxYears * 12;
    for (var m = 1; m <= maxMonths; m++) {
        cumulative += monthly / Math.pow(1 + rate, m / 12);
        if (cumulative >= investment) return m;
    }
    return Infinity;
}

// ── IRR (mirrors PDE.calculateIRR) ──
function calculateIRR(cashFlows) {
    var precision = 1e-6;
    var maxIter = 1000;
    var low = -0.99;
    var high = 1;
    for (var i = 0; i < maxIter; i++) {
        var rate = (low + high) / 2;
        var npv = 0;
        for (var t = 0; t < cashFlows.length; t++) {
            npv += cashFlows[t] / Math.pow(1 + rate, t / 12);
        }
        if (Math.abs(npv) < precision) return rate;
        if (npv > 0) low = rate; else high = rate;
        if (high - low < precision) return (low + high) / 2;
    }
    return null;
}

// ── Core model (mirrors PDE.computeModel) ──
function computeModel(params, coeffs) {
    var manualPercent  = params.manualPercent  || 0;
    var downCost       = params.downCost       || 0;
    var failures       = (params.failures      || 0) * coeffs.QUARTERS_PER_YEAR;
    var mttr           = params.mttr           || 0;
    var rate           = params.rate           || 0;
    var managerHrs     = params.managerHrs     || 0;
    var opportunityVal = params.opportunityVal || 0;
    var riskLevel      = params.riskLevel      || 0;
    var capex          = params.capex          || 0;
    var autoLevel      = (params.autoLevel     || 0) / 100;
    var teamSize       = params.teamSize       || 0;
    var opexAdjMult    = params.opexAdjMult    !== undefined ? params.opexAdjMult    : coeffs.OPEX_ADJ_MULTIPLIER_DEFAULT;
    var erosionRate    = params.erosionRate    !== undefined ? params.erosionRate    : coeffs.PIPELINE_EROSION_RATE_DEFAULT;
    var discountRate   = params.discountRate   !== undefined ? params.discountRate   : coeffs.DISCOUNT_RATE_DEFAULT;
    var horizonYears   = params.horizonYears   || coeffs.TIME_HORIZON_YEARS_DEFAULT;
    var leverAuto      = params.leverAuto      !== undefined ? params.leverAuto      : coeffs.LEVER_AUTOMATION_DEFAULT;
    var leverRisk      = params.leverRisk      !== undefined ? params.leverRisk      : coeffs.LEVER_RISK_DEFAULT;
    var turnover       = params.turnover       || 0;
    var correlationsEnabled = params.correlationsEnabled || false;
    var docStandard    = params.docStandard    || 3;
    var scenCAutoLevel = params.scenCAutoLevel !== undefined ? params.scenCAutoLevel : coeffs.SCEN_C_AUTO_LEVEL;
    var scenCCapexMult = params.scenCCapexMult !== undefined ? params.scenCCapexMult : coeffs.SCEN_C_CAPEX_MULTIPLIER;
    var annualHours    = params.annualHours    || coeffs.ANNUAL_HOURS_PER_ENGINEER;
    var leverInnovation= params.leverInnovation!== undefined ? params.leverInnovation: coeffs.LEVER_INNOVATION;
    var leverManagement= params.leverManagement!== undefined ? params.leverManagement: coeffs.LEVER_MANAGEMENT;
    var leverTurnoverL = params.leverTurnover  !== undefined ? params.leverTurnover  : coeffs.LEVER_TURNOVER;
    var riskSecurityWeight   = params.riskSecurityWeight   !== undefined ? params.riskSecurityWeight   : RD.securityWeight;
    var riskRegulatoryWeight = params.riskRegulatoryWeight !== undefined ? params.riskRegulatoryWeight : RD.regulatoryWeight;

    if (correlationsEnabled) {
        var cMult = params.correlationMultiplier !== undefined ? params.correlationMultiplier : CD.correlationMultiplier;
        var corrQ3Q1 = params.corrQ3Q1 || CD.corrQ3Q1;
        var corrQ1Q5 = params.corrQ1Q5 || CD.corrQ1Q5;
        var corrQ1Q7 = params.corrQ1Q7 || CD.corrQ1Q7;
        var corrQ3Q7 = params.corrQ3Q7 || CD.corrQ3Q7;

        var q1Base = manualPercent / 100;
        var q5Base = failures;
        var q7Base = managerHrs;
        var q3Base = docStandard / 5;
        var q9Base = riskLevel / 5;

        var q1FromQ3 = manualPercent + (0.5 - q3Base) * cMult * corrQ3Q1;
        manualPercent = Math.round(Math.min(100, Math.max(0, q1FromQ3)));

        var q5FromQ1 = q5Base + q1Base * cMult * corrQ1Q5;
        failures = Math.round(Math.min(9999, Math.max(0, q5FromQ1)));

        var q7FromQ1 = q7Base + q1Base * cMult * corrQ1Q7;
        managerHrs = Math.round(Math.min(744, Math.max(0, q7FromQ1)));

        var q7FromQ3 = managerHrs - (1 - q3Base) * cMult * corrQ3Q7;
        managerHrs = Math.round(Math.min(744, Math.max(0, q7FromQ3)));
    }

    var nonlinearEnabled = params.nonlinearEnabled || false;

    var totalAnnualHrs   = annualHours;
    var manualAnnualHrs  = totalAnnualHrs * (manualPercent / 100);
    var chasingAnnualHrs = managerHrs * coeffs.MONTHS_PER_YEAR;

    var effectiveTeamSize = teamSize;
    if (nonlinearEnabled) {
        effectiveTeamSize = Math.pow(teamSize, 0.9);
    }

    var cWaste     = (manualAnnualHrs + chasingAnnualHrs) * rate * effectiveTeamSize;
    var cRisk      = (failures * mttr * downCost) * (riskLevel / coeffs.RISK_SCALE_MAX);
    var cOppDirect = opportunityVal * erosionRate;
    var cOpexAdj   = cWaste * opexAdjMult;

    var riskOperational = cRisk;
    var riskSecurity    = 0;
    var riskRegulatory  = 0;
    var advancedRiskEnabled = params.advancedRiskEnabled || false;

    if (advancedRiskEnabled) {
        var manualRatio = manualPercent / 100;
        var docRatio = docStandard / 5;
        var scaleRatio = riskLevel / 5;
        riskSecurity = cRisk * manualRatio * riskSecurityWeight;
        riskRegulatory = cRisk * (1 - docRatio) * riskRegulatoryWeight;
        cRisk = riskOperational + riskSecurity + riskRegulatory;
    }

    if (nonlinearEnabled) {
        var cWasteRatio = cWaste / 1e6;
        var sigmoidMult = 2 / (1 + Math.exp(-cWasteRatio * 2)) - 1;
        cOpexAdj = cWaste * opexAdjMult * (0.5 + sigmoidMult * 0.5);
        autoLevel = 1 - Math.pow(1 - autoLevel, 1.2);
    }

    var totalImpact = cWaste + cRisk + cOppDirect + cOpexAdj;
    var netDebt     = totalImpact - capex;

    var annualRecurring = cWaste + cRisk + cOpexAdj;
    var oneTimeCosts    = cOppDirect + capex;
    var dr = discountRate;
    var ny = horizonYears;
    var pvifa = dr > 0 ? (1 - Math.pow(1 + dr, -ny)) / dr : ny;
    var npvRecurring = annualRecurring * pvifa;
    var npvTotalDebt = oneTimeCosts + npvRecurring;

    var potentialSavings = (cWaste + cRisk + cOpexAdj) * autoLevel;
    var paybackMonths    = discountedPayback(potentialSavings, capex);

    var irrCashFlows = [-capex];
    for (var mi = 1; mi <= ny * 12; mi++) irrCashFlows.push(potentialSavings / 12);
    var irr = calculateIRR(irrCashFlows);

    var turnoverCost = (turnover / 100) * teamSize * rate * coeffs.TURNOVER_REF_HOURS;

    return {
        cWaste:            cWaste,
        cRisk:             cRisk,
        cOppDirect:        cOppDirect,
        cOpexAdj:          cOpexAdj,
        totalImpact:       totalImpact,
        netDebt:           netDebt,
        annualRecurring:   annualRecurring,
        oneTimeCosts:      oneTimeCosts,
        npvRecurring:      npvRecurring,
        npvTotalDebt:      npvTotalDebt,
        potentialSavings:  potentialSavings,
        paybackMonths:     paybackMonths,
        irr:               irr,
    };
}

// ── Statistics computation ──
function computeStats(results, cl) {
    var keys = ['cWaste','cRisk','cOppDirect','cOpexAdj','totalImpact','netDebt',
                'npvTotalDebt','potentialSavings','paybackMonths','irr'];
    var output = {};
    keys.forEach(function (key) {
        var sorted = results.map(function (r) { return r[key]; }).sort(function (a, b) { return a - b; });
        var mean = sorted.reduce(function (s, v) { return s + v; }, 0) / sorted.length;
        var loIdx = Math.floor((1 - cl) / 2 * sorted.length);
        var hiIdx = Math.ceil((1 - (1 - cl) / 2) * sorted.length) - 1;
        if (loIdx < 0) loIdx = 0;
        if (hiIdx >= sorted.length) hiIdx = sorted.length - 1;
        var median = sorted.length % 2 === 1
            ? sorted[Math.floor(sorted.length / 2)]
            : (sorted[sorted.length / 2 - 1] + sorted[sorted.length / 2]) / 2;
        output[key] = {
            mean:   mean,
            median: median,
            p5:     sorted[Math.max(0, Math.floor(0.05 * sorted.length))],
            p25:    sorted[Math.max(0, Math.floor(0.25 * sorted.length))],
            p75:    sorted[Math.min(sorted.length - 1, Math.floor(0.75 * sorted.length))],
            p95:    sorted[Math.min(sorted.length - 1, Math.floor(0.95 * sorted.length))],
            min:    sorted[0],
            max:    sorted[sorted.length - 1],
        };
    });
    output._allResults = results;
    return output;
}

// ── Worker message handler ──
self.onmessage = function (e) {
    try {
        var baseParams = e.data.baseParams;
        var opts = e.data.opts || {};
        var seed = e.data.seed || 42;

        var iters = opts.iterations || 1000;
        var cl = opts.confidenceLevel || 0.9;
        var uncPct = opts.uncertaintyPct || 0.15;
        var mttrUnc = opts.mttrUncertaintyPct || 0.25;
        var rng = seededRandom(seed);

        var reportEvery = Math.max(1, Math.floor(iters / 20));
        var results = [];
        var i;

        for (i = 0; i < iters; i++) {
            var p = {};
            Object.keys(baseParams).forEach(function (k) { p[k] = baseParams[k]; });

            p.manualPercent  = Math.max(0, Math.min(100, p.manualPercent  * (1 + (rng() - 0.5) * 2 * uncPct)));
            p.downCost       = Math.max(0, p.downCost       * (1 + (rng() - 0.5) * 2 * uncPct));
            p.failures       = Math.max(0, Math.min(9999, Math.round(p.failures + (rng() - 0.5) * uncPct * 4)));
            p.mttr           = Math.max(0, Math.min(168, p.mttr * (1 + randn(rng) * mttrUnc)));
            p.rate           = Math.max(0, p.rate           * (1 + (rng() - 0.5) * 2 * uncPct));
            p.managerHrs     = Math.max(0, Math.min(744, Math.round(p.managerHrs + (rng() - 0.5) * uncPct * p.managerHrs)));
            p.opportunityVal = Math.max(0, p.opportunityVal * (1 + (rng() - 0.5) * 2 * uncPct));
            p.riskLevel      = p.riskLevel;
            p.capex          = Math.max(0, p.capex          * (1 + (rng() - 0.5) * 2 * uncPct * 0.5));

            var r = computeModel(p, C);
            results.push({
                cWaste: r.cWaste, cRisk: r.cRisk, cOppDirect: r.cOppDirect,
                cOpexAdj: r.cOpexAdj, totalImpact: r.totalImpact,
                netDebt: r.netDebt, npvTotalDebt: r.npvTotalDebt,
                potentialSavings: r.potentialSavings, paybackMonths: r.paybackMonths,
                irr: r.irr,
            });

            if (i % reportEvery === 0 || i === iters - 1) {
                self.postMessage({ type: 'progress', current: i + 1, total: iters });
            }
        }

        var stats = computeStats(results, cl);
        self.postMessage({ type: 'result', data: stats });
    } catch (err) {
        self.postMessage({ type: 'error', message: err.message });
    }
};
