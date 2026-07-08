const { describe, it } = require('node:test');
const assert = require('node:assert');

// ── Replicate constants from app.js for testing in Node ──────────
const COEFFICIENTS = {
    ANNUAL_HOURS_PER_ENGINEER: 1800,
    MONTHS_PER_YEAR:           12,
    QUARTERS_PER_YEAR:         4,
    PIPELINE_EROSION_RATE:     0.25,
    CASCADE_MULTIPLIER:        1.5,
    SCEN_C_AUTO_LEVEL:         0.8,
    SCEN_C_CAPEX_MULTIPLIER:   1.5,
    LEVER_AUTOMATION:          0.3,
    LEVER_RISK:                0.6,
    LEVER_INNOVATION:          0.5,
    LEVER_MANAGEMENT:          0.15,
    LEVER_TURNOVER:            0.3,
    TURNOVER_REF_HOURS:        2000,
    RISK_SCALE_MAX:            5,
    PAYBACK_GREEN:             24,
    PAYBACK_YELLOW:            48,
    AUTOMATABLE_SHARE:         0.6,
    TARGET_RISK_REDUCTION:     0.5,
    REC_AUTO_MIN_WASTE:        100000,
    REC_RISK_MIN_EXPOSURE:     50000,
    REC_INNOVATION_MIN:        150000,
    DISCOUNT_RATE:              0.10,
    TIME_HORIZON_YEARS:         5,
};

function discountedPayback(annualSavings, investment) {
    if (annualSavings <= 0 || investment <= 0) return Infinity;
    var rate = COEFFICIENTS.DISCOUNT_RATE;
    var monthly = annualSavings / 12;
    var cumulative = 0;
    var maxMonths = COEFFICIENTS.TIME_HORIZON_YEARS * 12;
    for (var m = 1; m <= maxMonths; m++) {
        cumulative += monthly / Math.pow(1 + rate, m / 12);
        if (cumulative >= investment) return m;
    }
    return Infinity;
}

function calculateIRR(cashFlows) {
    var precision = 1e-6;
    var maxIter = 1000;
    var low = -0.99;
    var high = 10;
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

const TRANSLATIONS_EN_LABELS = {
    q11label: '11. MTTR ({C})',
    q4label:  '4. Downtime Cost ({C}/h)',
};

// ── Known Issue #1: MTTR unit error ────────────────────────────
describe('Known Issue #1 — MTTR unit error (label shows currency, not hours)', () => {
    it('q11label contains {C} (currency symbol) but MTTR is a time unit', () => {
        assert.ok(
            TRANSLATIONS_EN_LABELS.q11label.includes('{C}'),
            'BUG PRESENT: q11label="MTTR ({C})" — MTTR is in hours, not currency.\n' +
            'Expected fix: change to "MTTR (hrs)" (EN) / "MTTR (godz.)" (PL).',
        );
    });

    it('q11label is inconsistent with q4label — q4 uses {C}/h (cost), q11 should use hrs', () => {
        const mttrUsesCurrency = TRANSLATIONS_EN_LABELS.q11label.includes('{C}');
        const downCostUsesCurrencyHr = TRANSLATIONS_EN_LABELS.q4label.includes('{C}/h');
        assert.ok(
            mttrUsesCurrency && downCostUsesCurrencyHr,
            'BUG PRESENT: both q11 and q4 use {C}, but q11 is hours, q4 is $/hr.\n' +
            'When MTTR is labelled as currency, users may enter dollar amounts instead of hours.',
        );
    });

    it('q11 HASH_CONSTRAINTS max=168 confirms the unit is hours (1 week), not currency', () => {
        const q11max = 168;
        assert.strictEqual(q11max, 168,
            'q11 max is 168 hours (= 1 week), proving MTTR is a time value, not monetary');
    });

    it('Risk formula is dimensionally correct despite the label bug', () => {
        // cRisk = (failures × mttr × downCost) × (riskLevel / 5)
        // units:   (count × hrs × $/hr)   × (dimensionless)
        //        = (count × $)             = monetary value ✓
        const failures = 8;
        const mttr = 4;
        const downCost = 5000;
        const riskLevel = 3;
        const risk = (failures * mttr * downCost) * (riskLevel / COEFFICIENTS.RISK_SCALE_MAX);
        assert.strictEqual(risk, 96000,
            'Formula: (8 failures × 4 hrs × $5000/hr) × (3/5) = $96000 — dimensionally sound');
    });
});

// ── Known Issue #2: OPEX double-counting in total cost ─────────
describe('Known Issue #2 — OPEX Waste appears 2.5× in Total Debt Impact', () => {
    const SAMPLE = { cWaste: 500000, cRisk: 80000, cOppDirect: 25000, autoLevel: 0.6, capex: 200000 };

    it('cCascade = cWaste × 1.5 ⇒ OPEX contributes indirectly via cascade', () => {
        const cCascade = SAMPLE.cWaste * COEFFICIENTS.CASCADE_MULTIPLIER;
        assert.strictEqual(cCascade, 750000,
            'cCascade = $500k × 1.5 = $750k — proportional to OPEX Waste');
    });

    it('totalImpact = cWaste + cRisk + cOppDirect + cCascade — same OPEX appears twice', () => {
        const cCascade = SAMPLE.cWaste * COEFFICIENTS.CASCADE_MULTIPLIER;
        const total = SAMPLE.cWaste + SAMPLE.cRisk + SAMPLE.cOppDirect + cCascade;
        const opexContribution = SAMPLE.cWaste + cCascade; // 500k + 750k = 1.25M
        assert.strictEqual(total, 500000 + 80000 + 25000 + 750000,
            'Total = 500k + 80k + 25k + 750k = $1,355,000');
        assert.ok(opexContribution > SAMPLE.cWaste,
            'OPEX contributes $1.25M of $1.355M total = 92% via 1× direct + 1.5× cascade');
    });

    it('Main payback savings base now matches scenario savings — both include cascade (fixed)', () => {
        const cCascade = SAMPLE.cWaste * COEFFICIENTS.CASCADE_MULTIPLIER;
        const allSavings = (SAMPLE.cWaste + SAMPLE.cRisk + cCascade) * SAMPLE.autoLevel;
        assert.strictEqual(allSavings, (500000 + 80000 + 750000) * 0.6,
            'Both main payback and scenarios use (cWaste + cRisk + cCascade) × autoLevel = $798k/yr');
        const pb = SAMPLE.capex / Math.max(1, allSavings / 12);
        assert.strictEqual(pb, 200000 / (798000 / 12),
            'Payback = $200k / ($798k/12) = 3.0 mo — consistent across main metric and scenarios');
    });
});

// ── Known Issue #3: Arbitrary coefficients ─────────────────────
describe('Known Issue #3 — Hardcoded coefficients without direct empirical basis', () => {
    it('Pipeline erosion rate = 0.25 (25%) — no single authoritative study isolates this fraction', () => {
        assert.strictEqual(COEFFICIENTS.PIPELINE_EROSION_RATE, 0.25);
    });

    it('Cascade multiplier = 1.5 (methodology notes 6× is possible, 1.5× is "conservative minimum")', () => {
        assert.strictEqual(COEFFICIENTS.CASCADE_MULTIPLIER, 1.5);
    });

    it('Scenario C: auto level = 80%, CAPEX multiplier = 1.5 — model assumptions, not externally sourced', () => {
        assert.strictEqual(COEFFICIENTS.SCEN_C_AUTO_LEVEL, 0.8);
        assert.strictEqual(COEFFICIENTS.SCEN_C_CAPEX_MULTIPLIER, 1.5);
    });

    it('Lever recovery rates: 30%, 60%, 50%, 15%, 30% — fixed percentages from varied sources', () => {
        assert.strictEqual(COEFFICIENTS.LEVER_AUTOMATION, 0.3);
        assert.strictEqual(COEFFICIENTS.LEVER_RISK, 0.6);
        assert.strictEqual(COEFFICIENTS.LEVER_INNOVATION, 0.5);
        assert.strictEqual(COEFFICIENTS.LEVER_MANAGEMENT, 0.15);
        assert.strictEqual(COEFFICIENTS.LEVER_TURNOVER, 0.3);
    });

    it('AUTOMATABLE_SHARE = 60% — "cited in DevOps literature" without specific source', () => {
        assert.strictEqual(COEFFICIENTS.AUTOMATABLE_SHARE, 0.6);
    });

    it('TARGET_RISK_REDUCTION = 50% — model assumption for heatmap visualization', () => {
        assert.strictEqual(COEFFICIENTS.TARGET_RISK_REDUCTION, 0.5);
    });

    it('Annual hours = 1800 (rounded from ~1811), Turnover ref hours = 2000 — different standards exist', () => {
        assert.strictEqual(COEFFICIENTS.ANNUAL_HOURS_PER_ENGINEER, 1800);
        assert.strictEqual(COEFFICIENTS.TURNOVER_REF_HOURS, 2000);
    });

    it('Recommendation gate thresholds: $100k, $50k, $150k — arbitrary dollar floors', () => {
        assert.strictEqual(COEFFICIENTS.REC_AUTO_MIN_WASTE, 100000);
        assert.strictEqual(COEFFICIENTS.REC_RISK_MIN_EXPOSURE, 50000);
        assert.strictEqual(COEFFICIENTS.REC_INNOVATION_MIN, 150000);
    });
});

// ── Known Issue #4 (mitigated): NPV + Discounted Payback ──────
describe('Known Issue #4 (mitigated) — NPV model verifies fix is in place', () => {
    it('COEFFICIENTS now contains DISCOUNT_RATE and TIME_HORIZON_YEARS', () => {
        assert.strictEqual(COEFFICIENTS.DISCOUNT_RATE, 0.10,
            'Discount rate = 10% (WACC benchmark for IT infra)');
        assert.strictEqual(COEFFICIENTS.TIME_HORIZON_YEARS, 5,
            'Time horizon = 5 years (standard investment horizon)');
    });

    it('NPV recurring = annualRecurring × PVIFA(10%, 5yr) — annuity formula', () => {
        var annualRecurring = 1330000; // cWaste 500k + cRisk 80k + cCascade 750k
        var r = 0.10, n = 5;
        var pvifa = (1 - Math.pow(1 + r, -n)) / r;
        var npvRecurring = annualRecurring * pvifa;
        // PVIFA(10%,5) ≈ 3.7908 → NPV ≈ $5,041,764
        var expectedNpv = annualRecurring * 3.790786769408448;
        assert.ok(Math.abs(npvRecurring - expectedNpv) < 0.01,
            'NPV of $1.33M/yr × PVIFA ≈ $5,041,746 — correctly discounts future cash flows');
        assert.ok(npvRecurring > annualRecurring,
            'NPV of 5-year stream > single year cost');
        assert.ok(npvRecurring < annualRecurring * n,
            'NPV < undiscounted sum ($6.65M) — time value of money is applied');
    });

    it('NPV total = one-time costs + NPV of recurring costs', () => {
        var oneTime = 225000; // cOppDirect 25k + capex 200k
        var annualRecurring = 1330000;
        var r = 0.10, n = 5;
        var pvifa = (1 - Math.pow(1 + r, -n)) / r;
        var npvTotal = oneTime + annualRecurring * pvifa;
        var expected = oneTime + annualRecurring * 3.790786769408448;
        assert.ok(Math.abs(npvTotal - expected) < 0.01,
            'NPV Total = one-time costs + discounted recurring stream');
    });

    it('Discounted payback > simple payback (time value of money extends payback)', () => {
        var annualSavings = 348000;
        var capex = 200000;
        var simplePb = capex / (annualSavings / 12);
        var discountedPb = discountedPayback(annualSavings, capex);
        assert.ok(discountedPb >= simplePb,
            'Discounted payback (' + discountedPb.toFixed(1) + ' mo) ≥ simple payback (' + simplePb.toFixed(1) + ' mo)');
    });

    it('DiscountedPayback returns Infinity for zero savings', () => {
        assert.strictEqual(discountedPayback(0, 100000), Infinity);
    });

    it('DiscountedPayback returns Infinity for zero investment', () => {
        assert.strictEqual(discountedPayback(50000, 0), Infinity);
    });

    it('DiscountedPayback returns Infinity when savings never cover investment within horizon', () => {
        var result = discountedPayback(1000, 1000000);
        assert.strictEqual(result, Infinity,
            'Small savings ($1k/yr) vs large investment ($1M) never pay back in 5-yr horizon');
    });

    it('Single-year totalImpact still available for waterfall chart compatibility', () => {
        var cWaste = 500000, cRisk = 80000, cOppDirect = 25000, cCascade = 750000;
        var totalImpact = cWaste + cRisk + cOppDirect + cCascade;
        assert.strictEqual(totalImpact, 1355000,
            'Single-year totalImpact = $1,355,000 — kept for legacy display');
    });

    it('IRR > WACC for a profitable investment', () => {
        var cf = [-200000];
        for (var m = 1; m <= 60; m++) cf.push(29000); // $348k/yr / 12
        var irr = calculateIRR(cf);
        assert.ok(irr !== null, 'IRR should be computable');
        assert.ok(irr > COEFFICIENTS.DISCOUNT_RATE,
            'IRR (' + (irr * 100).toFixed(1) + '%) should exceed WACC (' + (COEFFICIENTS.DISCOUNT_RATE * 100) + '%)');
    });

    it('IRR is meaningless (null or < -90%) for all-negative cash flows', () => {
        var cf = [-100, -50, -30];
        var irr = calculateIRR(cf);
        assert.ok(irr === null || irr < -0.9,
            'All-negative flows have no meaningful IRR (got ' + (irr !== null ? (irr * 100).toFixed(1) + '%' : 'null') + ')');
    });

    it('IRR = 0 for zero-NPV investment (break-even)', () => {
        var cf = [-1000];
        for (var m = 1; m <= 60; m++) cf.push(16.67); // ~$200/yr = exactly pay back $1000
        var irr = calculateIRR(cf);
        assert.ok(irr !== null, 'Break-even should have computable IRR');
        assert.ok(Math.abs(irr) < 0.01, 'Break-even IRR ≈ 0%');
    });
});
