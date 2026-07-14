// ═══════════════════════════════════════════════════════════════
// Financial model engine — pure computation, no DOM access
// ═══════════════════════════════════════════════════════════════
window.PDE = window.PDE || {};
var PDE = window.PDE;

PDE.discountedPayback = function discountedPayback(annualSavings, investment, rate, maxYears) {
    if (annualSavings <= 0 || investment <= 0) return Infinity;
    if (rate === undefined) rate = PDE.readAdvanced('discountRate', PDE.COEFFICIENTS.DISCOUNT_RATE_DEFAULT, 100);
    if (maxYears === undefined) maxYears = PDE.readAdvanced('timeHorizon', PDE.COEFFICIENTS.TIME_HORIZON_YEARS_DEFAULT, 1);
    var monthly = annualSavings / 12;
    var cumulative = 0;
    var maxMonths = maxYears * 12;
    for (var m = 1; m <= maxMonths; m++) {
        cumulative += monthly / Math.pow(1 + rate, m / 12);
        if (cumulative >= investment) return m;
    }
    return Infinity;
};

PDE.calculateIRR = function calculateIRR(cashFlows) {
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
};

PDE.computeModel = function computeModel(params) {
    var manualPercent  = params.manualPercent  || 0;
    var downCost       = params.downCost       || 0;
    var failures       = (params.failures      || 0) * PDE.COEFFICIENTS.QUARTERS_PER_YEAR;
    var mttr           = params.mttr           || 0;
    var rate           = params.rate           || 0;
    var managerHrs     = params.managerHrs     || 0;
    var opportunityVal = params.opportunityVal || 0;
    var riskLevel      = params.riskLevel      || 0;
    var capex          = params.capex          || 0;
    var autoLevel      = (params.autoLevel     || 0) / 100;
    var teamSize       = params.teamSize        || 0;
    var opexAdjMult    = params.opexAdjMult   || PDE.COEFFICIENTS.OPEX_ADJ_MULTIPLIER_DEFAULT;
    var erosionRate    = params.erosionRate    || PDE.COEFFICIENTS.PIPELINE_EROSION_RATE_DEFAULT;
    var discountRate   = params.discountRate   || PDE.COEFFICIENTS.DISCOUNT_RATE_DEFAULT;
    var horizonYears   = params.horizonYears   || PDE.COEFFICIENTS.TIME_HORIZON_YEARS_DEFAULT;
    var leverAuto      = params.leverAuto      || PDE.COEFFICIENTS.LEVER_AUTOMATION_DEFAULT;
    var leverRisk      = params.leverRisk      || PDE.COEFFICIENTS.LEVER_RISK_DEFAULT;
    var turnover        = params.turnover        || 0;
    var correlationsEnabled = params.correlationsEnabled || false;
    var docStandard     = params.docStandard     || 3;
    var scenCAutoLevel  = params.scenCAutoLevel  !== undefined ? params.scenCAutoLevel : PDE.COEFFICIENTS.SCEN_C_AUTO_LEVEL;
    var scenCCapexMult  = params.scenCCapexMult  !== undefined ? params.scenCCapexMult : PDE.COEFFICIENTS.SCEN_C_CAPEX_MULTIPLIER;
    var annualHours     = params.annualHours     || PDE.COEFFICIENTS.ANNUAL_HOURS_PER_ENGINEER;
    var leverInnovation = params.leverInnovation || PDE.COEFFICIENTS.LEVER_INNOVATION;
    var leverManagement = params.leverManagement || PDE.COEFFICIENTS.LEVER_MANAGEMENT;
    var leverTurnoverL  = params.leverTurnover   || PDE.COEFFICIENTS.LEVER_TURNOVER;
    var riskSecurityWeight = params.riskSecurityWeight !== undefined ? params.riskSecurityWeight : PDE.RISK_WEIGHT_DEFAULTS.securityWeight;
    var riskRegulatoryWeight = params.riskRegulatoryWeight !== undefined ? params.riskRegulatoryWeight : PDE.RISK_WEIGHT_DEFAULTS.regulatoryWeight;

    if (correlationsEnabled) {
        var cMult = params.correlationMultiplier || PDE.CORRELATION_DEFAULTS.correlationMultiplier;
        var corrQ3Q1 = params.corrQ3Q1 || PDE.CORRELATION_DEFAULTS.corrQ3Q1;
        var corrQ1Q5 = params.corrQ1Q5 || PDE.CORRELATION_DEFAULTS.corrQ1Q5;
        var corrQ1Q7 = params.corrQ1Q7 || PDE.CORRELATION_DEFAULTS.corrQ1Q7;
        var corrQ3Q7 = params.corrQ3Q7 || PDE.CORRELATION_DEFAULTS.corrQ3Q7;

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
    var manualAnnualHrs  = PDE.COEFFICIENTS.SPRINT_HOURS * PDE.COEFFICIENTS.SPRINTS_PER_YEAR * (manualPercent / 100);
    var chasingAnnualHrs = managerHrs * PDE.COEFFICIENTS.MONTHS_PER_YEAR;

    var effectiveTeamSize = teamSize;
    if (nonlinearEnabled) {
        effectiveTeamSize = Math.pow(teamSize, 0.9);
    }

    var cWaste     = (manualAnnualHrs + chasingAnnualHrs) * rate * effectiveTeamSize;
    var cRisk      = (failures * mttr * downCost) * (riskLevel / PDE.COEFFICIENTS.RISK_SCALE_MAX);
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
    var netDebt      = totalImpact - capex;

    var annualRecurring = cWaste + cRisk + cOpexAdj;
    var oneTimeCosts    = cOppDirect + capex;
    var dr = discountRate;
    var ny = horizonYears;
    var pvifa = dr > 0 ? (1 - Math.pow(1 + dr, -ny)) / dr : ny;
    var npvRecurring = annualRecurring * pvifa;
    var npvTotalDebt = oneTimeCosts + npvRecurring;

    var potentialSavings = (cWaste + cRisk + cOpexAdj) * autoLevel;
    var paybackMonths    = PDE.discountedPayback(potentialSavings, capex);

    var irrCashFlows = [-capex];
    for (var mi = 1; mi <= ny * 12; mi++) irrCashFlows.push(potentialSavings / 12);
    var irr = PDE.calculateIRR(irrCashFlows);

    var turnoverCost = (turnover / 100) * teamSize * rate * PDE.COEFFICIENTS.TURNOVER_REF_HOURS;

    var leverRecoveryAuto = Math.round(cWaste * leverAuto);
    var leverRecoveryRisk = Math.round(cRisk * leverRisk);
    var leverRecoveryInnovation = Math.round((cOppDirect + cOpexAdj) * leverInnovation);
    var leverRecoveryMgmt = Math.round(cWaste * leverManagement);
    var leverRecoveryTurnover = Math.round(turnoverCost * leverTurnoverL);

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
        manualAnnualHrs:   manualAnnualHrs,
        chasingAnnualHrs:  chasingAnnualHrs,
        totalAnnualHrs:    totalAnnualHrs,
        turnoverCost:      turnoverCost,
        leverAuto:         leverAuto,
        leverRisk:         leverRisk,
        riskOperational:   riskOperational,
        riskSecurity:      riskSecurity,
        riskRegulatory:    riskRegulatory,
        advancedRiskEnabled: advancedRiskEnabled,
        leverRecoveryAuto:        leverRecoveryAuto,
        leverRecoveryRisk:        leverRecoveryRisk,
        leverRecoveryInnovation:  leverRecoveryInnovation,
        leverRecoveryMgmt:        leverRecoveryMgmt,
        leverRecoveryTurnover:    leverRecoveryTurnover,
        scenCAutoLevel:   scenCAutoLevel,
        scenCCapexMult:   scenCCapexMult,
    };
};

PDE.scenCalc = function scenCalc(al, cx, annualRecurring, dr, ny) {
    var annualSavings = annualRecurring * al;
    var pvifa = dr > 0 ? (1 - Math.pow(1 + dr, -ny)) / dr : ny;
    var npvSavings = annualSavings * pvifa;
    var net = npvSavings - cx;
    var pb = PDE.discountedPayback(annualSavings, cx, dr, ny);
    var irrVal = null;
    if (annualSavings > 0 && cx > 0) {
        var cf = [-cx];
        for (var m = 1; m <= ny * 12; m++) cf.push(annualSavings / 12);
        irrVal = PDE.calculateIRR(cf);
    } else if (al === 0) {
        irrVal = 0;
    }
    return { savings: annualSavings, npvSavings: npvSavings, net: net, pb: pb, irr: irrVal };
};

// runMonteCarlo migrated to src/mc-worker.js (Web Worker)

PDE.getDoraBand = function getDoraBand(metric, value) {
    const L = PDE.TRANSLATIONS[PDE.currentLang];
    const bands = {
        leadTime: [
            { max: 1,        band: L.doraBandElite,  color: 'var(--green)'  },
            { max: 24,       band: L.doraBandHigh,   color: 'var(--accent)' },
            { max: 168,      band: L.doraBandMedium, color: 'var(--orange)' },
            { max: Infinity, band: L.doraBandLow,    color: 'var(--red)'    },
        ],
        manual: [
            { max: 5,        band: L.doraBandElite,  color: 'var(--green)'  },
            { max: 15,       band: L.doraBandHigh,   color: 'var(--accent)' },
            { max: 30,       band: L.doraBandMedium, color: 'var(--orange)' },
            { max: Infinity, band: L.doraBandLow,    color: 'var(--red)'    },
        ],
        errors: [
            { max: 0,        band: L.doraBandElite,  color: 'var(--green)'  },
            { max: 1,        band: L.doraBandHigh,   color: 'var(--accent)' },
            { max: 3,        band: L.doraBandMedium, color: 'var(--orange)' },
            { max: Infinity, band: L.doraBandLow,    color: 'var(--red)'    },
        ],
    };
    const thresholds = bands[metric];
    for (const t of thresholds) {
        if (value <= t.max) return { band: t.band, color: t.color };
    }
    return { band: L.doraBandLow, color: 'var(--red)' };
};
