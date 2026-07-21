// ═══════════════════════════════════════════════════════════════
// Sensitivity Analysis — Tornado Chart
// Varies each input ±20% and measures impact on npvTotalDebt.
// Sorted by swing magnitude, rendered as horizontal tornado chart.
// ═══════════════════════════════════════════════════════════════
window.PDE = window.PDE || {};

PDE.tornadoChart = null;

PDE.SENSITIVITY_PARAMS = [
    { key: 'manualPercent',  labelKey: 'sensQ1',    min: 0,   max: 100,   pct: 0.20 },
    { key: 'rate',           labelKey: 'sensQ6',    min: 0,   max: 5000,  pct: 0.20 },
    { key: 'teamSize',       labelKey: 'sensTeam',  min: 1,   max: 10000, pct: 0.20 },
    { key: 'downCost',       labelKey: 'sensQ4',    min: 0,   max: 1e7,   pct: 0.20 },
    { key: 'failures',       labelKey: 'sensQ5',    min: 0,   max: 9999,  pct: 0.20 },
    { key: 'mttr',           labelKey: 'sensQ11',   min: 0,   max: 168,   pct: 0.20 },
    { key: 'managerHrs',     labelKey: 'sensQ7',    min: 0,   max: 744,   pct: 0.20 },
    { key: 'opportunityVal', labelKey: 'sensQ8',    min: 0,   max: 1e9,   pct: 0.20 },
    { key: 'autoLevel',      labelKey: 'sensAuto',  min: 0,   max: 100,   pct: 0.20 },
    { key: 'discountRate',   labelKey: 'sensDisc',  min: 0.05,max: 0.20,  pct: 0.20 },
];

PDE.runSensitivity = function runSensitivity(params) {
    const base = PDE.computeModel(params);
    const baseNpv = base.npvTotalDebt;

    const items = [];

    for (let i = 0; i < PDE.SENSITIVITY_PARAMS.length; i++) {
        const def = PDE.SENSITIVITY_PARAMS[i];
        const baseVal = params[def.key];
        if (baseVal === undefined || baseVal === null) continue;

        const low = Math.max(def.min, baseVal * (1 - def.pct));
        const high = Math.min(def.max, baseVal * (1 + def.pct));

        const pLow = Object.assign({}, params, { [def.key]: low });
        const pHigh = Object.assign({}, params, { [def.key]: high });

        const rLow = PDE.computeModel(pLow);
        const rHigh = PDE.computeModel(pHigh);

        items.push({
            key: def.key,
            labelKey: def.labelKey,
            base: baseVal,
            low: low,
            high: high,
            npvLow: rLow.npvTotalDebt,
            npvHigh: rHigh.npvTotalDebt,
            swing: Math.abs(rHigh.npvTotalDebt - rLow.npvTotalDebt),
        });
    }

    items.sort(function (a, b) { return b.swing - a.swing; });

    return { baseNpv: baseNpv, items: items };
};

PDE.createDiagPattern = function createDiagPattern(color, bgColor) {
    const c = document.createElement('canvas');
    c.width = 8;
    c.height = 8;
    const cx = c.getContext('2d');
    cx.fillStyle = bgColor || 'rgba(0,0,0,0)';
    cx.fillRect(0, 0, 8, 8);
    cx.strokeStyle = color;
    cx.lineWidth = 1.5;
    cx.beginPath();
    cx.moveTo(0, 8);
    cx.lineTo(8, 0);
    cx.stroke();
    return cx.createPattern(c, 'repeat');
};

PDE.renderTornado = function renderTornado(result) {
    const canvas = document.getElementById('tornadoChart');
    if (!canvas) return;
    const L = PDE.TRANSLATIONS[PDE.currentLang];

    const sizeCanvas = function (id) {
        const c = document.getElementById(id);
        const p = c.parentElement;
        c.width = p.clientWidth || 300;
        c.height = p.clientHeight || 200;
    };
    sizeCanvas('tornadoChart');
    const ctx = canvas.getContext('2d');
    if (PDE.tornadoChart) PDE.tornadoChart.destroy();

    const baseVal = result.baseNpv;
    const labels = [];
    const downData = [];
    const upData = [];
    const tooltipLabels = [];

    for (let i = 0; i < result.items.length; i++) {
        const item = result.items[i];
        const label = L[item.labelKey] || item.key;
        labels.push(label);

        const leftVal = Math.min(item.npvLow, item.npvHigh) - baseVal;
        const rightVal = Math.max(item.npvLow, item.npvHigh) - baseVal;

        downData.push(leftVal);
        upData.push(rightVal);

        tooltipLabels.push(
            label + '\n' +
            L.sensLow + ': ' + PDE.formatCurrency(item.npvLow) + '\n' +
            L.sensBase + ': ' + PDE.formatCurrency(baseVal) + '\n' +
            L.sensHigh + ': ' + PDE.formatCurrency(item.npvHigh)
        );
    }

    const referenceLinePlugin = {
        id: 'referenceLine',
        beforeDraw: function(chart) {
            const ctx = chart.ctx;
            const chartArea = chart.chartArea;
            const xScale = chart.scales.x;
            const zeroPixel = xScale.getPixelForValue(0);
            if (zeroPixel >= chartArea.left && zeroPixel <= chartArea.right) {
                ctx.save();
                ctx.beginPath();
                ctx.setLineDash([5, 5]);
                ctx.strokeStyle = '#4A3F35';
                ctx.lineWidth = 1.5;
                ctx.moveTo(zeroPixel, chartArea.top);
                ctx.lineTo(zeroPixel, chartArea.bottom);
                ctx.stroke();
                ctx.restore();
            }
        },
    };

    PDE.tornadoChart = new Chart(ctx, {
        type: 'bar',
        plugins: [referenceLinePlugin],
        data: {
            labels: labels,
            datasets: [
                {
                    label: L.sensDownside || 'Downside',
                    data: downData,
                    backgroundColor: PDE.createDiagPattern(PDE.DARK.red, '#FEF2F2'),
                    borderRadius: 4,
                    borderSkipped: false,
                },
                {
                    label: L.sensUpside || 'Upside',
                    data: upData,
                    backgroundColor: PDE.DARK.blue,
                    borderRadius: 4,
                    borderSkipped: false,
                },
            ],
        },
        options: {
            indexAxis: 'y',
            maintainAspectRatio: false,
            responsive: true,
            plugins: {
                legend: {
                    display: true,
                    labels: { color: PDE.DARK.text, usePointStyle: true, pointStyleWidth: 10 },
                },
                tooltip: {
                    callbacks: {
                        label: function (context) {
                            const idx = context.dataIndex;
                            const prefix = context.datasetIndex === 0
                                ? '\u2193 ' + (L.sensDownside || 'Downside')
                                : '\u2191 ' + (L.sensUpside || 'Upside');
                            return prefix + '\n' + tooltipLabels[idx];
                        },
                    },
                },
            },
            scales: {
                x: {
                    stacked: true,
                    grid: { color: PDE.DARK.grid },
                    ticks: {
                        color: PDE.DARK.text,
                        callback: function (value) {
                            return PDE.formatCurrency(baseVal + value);
                        },
                    },
                },
                y: {
                    stacked: true,
                    grid: { color: PDE.DARK.grid },
                    ticks: { color: PDE.DARK.text },
                },
            },
        },
    });
};
