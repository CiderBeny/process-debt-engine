// ═══════════════════════════════════════════════════════════════
// Export functions — Excel, PDF, font cache
// ═══════════════════════════════════════════════════════════════
window.PDE = window.PDE || {};
var PDE = window.PDE;

PDE.sanitizeCell = function sanitizeCell(v) {
    return typeof v === 'string' && /^[=+\-@\t\r]/.test(v) ? "'" + v : v;
};

PDE.exportExcel = function exportExcel() {
    const btn = document.getElementById('exportExcelBtn');
    btn.disabled = true;
    btn.textContent = PDE.t('exportExcelGenerating');

    setTimeout(() => {
        try {
            const L  = PDE.TRANSLATIONS[PDE.currentLang];
            const wb = XLSX.utils.book_new();

            const sanitizeSheetData = data =>
                data.map(row => Array.isArray(row)
                    ? row.map(cell => PDE.sanitizeCell(cell))
                    : PDE.sanitizeCell(row));

            var p = {
                manualPercent:  PDE.clamp('q1'),
                downCost:       PDE.currencyToUsd(PDE.clamp('q4')),
                failures:       PDE.clamp('q5'),
                mttr:           PDE.clamp('q11'),
                rate:           PDE.currencyToUsd(PDE.clamp('q6')),
                managerHrs:     PDE.clamp('q7'),
                opportunityVal: PDE.currencyToUsd(PDE.clamp('q8')),
                riskLevel:      PDE.clamp('q9'),
                capex:          PDE.currencyToUsd(PDE.clamp('capex')),
                autoLevel:      PDE.clamp('autoLevel'),
                teamSize:       PDE.clamp('teamSize'),
                turnover:       PDE.clamp('q10'),
                docStandard:    PDE.clamp('q3'),
                cascadeMult:    PDE.readAdvanced('cascadeMult',   PDE.COEFFICIENTS.CASCADE_MULTIPLIER_DEFAULT, 100),
                erosionRate:    PDE.readAdvanced('erosionRate',   PDE.COEFFICIENTS.PIPELINE_EROSION_RATE_DEFAULT, 100),
                discountRate:   PDE.readAdvanced('discountRate',  PDE.COEFFICIENTS.DISCOUNT_RATE_DEFAULT, 100),
                horizonYears:   PDE.readAdvanced('timeHorizon',   PDE.COEFFICIENTS.TIME_HORIZON_YEARS_DEFAULT, 1),
                leverAuto:      PDE.readAdvanced('leverAutomation', PDE.COEFFICIENTS.LEVER_AUTOMATION_DEFAULT, 100),
                leverRisk:      PDE.readAdvanced('leverRisk',     PDE.COEFFICIENTS.LEVER_RISK_DEFAULT, 100),
                scenCAutoLevel:  PDE.readAdvanced('scenCAutoLevel',  PDE.COEFFICIENTS.SCEN_C_AUTO_LEVEL, 100),
                scenCCapexMult:  PDE.readAdvanced('scenCCapexMult',  PDE.COEFFICIENTS.SCEN_C_CAPEX_MULTIPLIER, 10),
                annualHours:     PDE.readAdvanced('annualHours',     PDE.COEFFICIENTS.ANNUAL_HOURS_PER_ENGINEER, 1),
                leverInnovation: PDE.readAdvanced('leverInnovation', PDE.COEFFICIENTS.LEVER_INNOVATION, 100),
                leverManagement: PDE.readAdvanced('leverManagement', PDE.COEFFICIENTS.LEVER_MANAGEMENT, 100),
                leverTurnover:   PDE.readAdvanced('leverTurnover',   PDE.COEFFICIENTS.LEVER_TURNOVER, 100),
                riskSecurityWeight:   PDE.readAdvanced('riskSecurityWeight',   PDE.RISK_WEIGHT_DEFAULTS.securityWeight, 1),
                riskRegulatoryWeight: PDE.readAdvanced('riskRegulatoryWeight', PDE.RISK_WEIGHT_DEFAULTS.regulatoryWeight, 1),
                correlationsEnabled: document.getElementById('correlationsToggle') ? document.getElementById('correlationsToggle').checked : false,
                correlationMultiplier: PDE.readAdvanced('correlationStrength', PDE.CORRELATION_DEFAULTS.correlationMultiplier, 100),
                corrQ3Q1: PDE.readAdvanced('corrQ3Q1', PDE.CORRELATION_DEFAULTS.corrQ3Q1, 1),
                corrQ1Q5: PDE.readAdvanced('corrQ1Q5', PDE.CORRELATION_DEFAULTS.corrQ1Q5, 1),
                corrQ1Q7: PDE.readAdvanced('corrQ1Q7', PDE.CORRELATION_DEFAULTS.corrQ1Q7, 1),
                corrQ3Q7: PDE.readAdvanced('corrQ3Q7', PDE.CORRELATION_DEFAULTS.corrQ3Q7, 1),
                nonlinearEnabled: document.getElementById('nonlinearToggle') ? document.getElementById('nonlinearToggle').checked : false,
                probabilisticEnabled: document.getElementById('probabilisticToggle') ? document.getElementById('probabilisticToggle').checked : false,
                mcIterations:    PDE.readAdvanced('mcIterations',    PDE.MC_DEFAULTS.iterations, 1),
                mcConfidence:    PDE.readAdvanced('mcConfidence',    PDE.MC_DEFAULTS.confidenceLevel, 100),
                mcUncertaintyPct: PDE.readAdvanced('mcUncertaintyPct', PDE.MC_DEFAULTS.uncertaintyPct, 100),
                mcMttrUnc:       PDE.readAdvanced('mcMttrUncertaintyPct', PDE.MC_DEFAULTS.mttrUncertaintyPct, 100),
                advancedRiskEnabled: document.getElementById('advancedRiskToggle') ? document.getElementById('advancedRiskToggle').checked : false,
            };
            var r = PDE.computeModel(p);

            const leversRaw = [
                { title: L.leverAutomationTitle, recovery: r.leverRecoveryAuto, effort: L.effortMedium, timeline: '2\u20134 mo' },
                { title: L.leverRiskTitle,        recovery: r.leverRecoveryRisk,        effort: L.effortLow,    timeline: '1\u20132 mo' },
                { title: L.leverInnovationTitle,  recovery: r.leverRecoveryInnovation,  effort: L.effortHigh, timeline: '3\u20136 mo' },
                { title: L.leverMgmtTitle,        recovery: r.leverRecoveryMgmt,        effort: L.effortLow,  timeline: '1 mo'   },
                { title: L.leverTurnoverTitle,    recovery: r.leverRecoveryTurnover,    effort: L.effortMedium, timeline: '3\u20135 mo' },
            ];
            leversRaw.sort((a, b) => b.recovery - a.recovery);
            const top3 = leversRaw.slice(0, 3);
            const totalRecovery = top3.reduce((s, l) => s + l.recovery, 0);

            var annualRecurring = r.cWaste + r.cRisk + r.cCascade;
            var dr = p.discountRate;
            var ny = p.horizonYears;
            const scenA = PDE.scenCalc(0,    0,                            annualRecurring, dr, ny);
            const scenB = PDE.scenCalc(p.autoLevel / 100, p.capex,         annualRecurring, dr, ny);
            const scenC = PDE.scenCalc(r.scenCAutoLevel,  p.capex * r.scenCCapexMult, annualRecurring, dr, ny);

            var q1Raw = PDE.clamp('q1'), q2Raw = PDE.clamp('q2'), q3Raw = PDE.clamp('q3'),
                q4Raw = PDE.currencyToUsd(PDE.clamp('q4')), q5Raw = PDE.clamp('q5'), q11Raw = PDE.clamp('q11'),
                q6Raw = PDE.currencyToUsd(PDE.clamp('q6')), q7Raw = PDE.clamp('q7'), q8Raw = PDE.currencyToUsd(PDE.clamp('q8')),
                q9Raw = PDE.clamp('q9'), q10Raw = PDE.clamp('q10');
            var autoLvlRaw = PDE.clamp('autoLevel'), teamSizeRaw = PDE.clamp('teamSize'), capexRaw = PDE.currencyToUsd(PDE.clamp('capex'));

            const inputQValues = [q1Raw, q2Raw, q3Raw, q4Raw, q5Raw, q11Raw, q6Raw, q7Raw, q8Raw, q9Raw, q10Raw];
            var advancedRows = [
                [],
                [L.xlsAdvancedTitle],
                [L.cascadeMultLabel,    p.cascadeMult.toFixed(1), ''],
                [L.erosionRateLabel,    p.erosionRate.toFixed(2), ''],
                [L.discountRateLabel,   Math.round(p.discountRate * 100) + '%', ''],
                [L.timeHorizonLabel,    p.horizonYears + ' yr', ''],
                [L.leverAutomationLabel, Math.round(p.leverAuto * 100) + '%', ''],
                [L.leverRiskLabel,      Math.round(p.leverRisk * 100) + '%', ''],
                [L.scenCAutoLevelLabel, Math.round(p.scenCAutoLevel * 100) + '%', ''],
                [L.scenCCapexMultLabel, p.scenCCapexMult.toFixed(1), ''],
                [L.annualHoursLabel,    p.annualHours, ''],
                [L.leverInnovationLabel, Math.round(p.leverInnovation * 100) + '%', ''],
                [L.leverManagementLabel, Math.round(p.leverManagement * 100) + '%', ''],
                [L.leverTurnoverLabel,   Math.round(p.leverTurnover * 100) + '%', ''],
                [],
                [L.xlsToggleTitle],
                [L.toggleCorrelations,  p.correlationsEnabled ? 'ON' : 'OFF', ''],
                [L.toggleNonlinear,     p.nonlinearEnabled ? 'ON' : 'OFF', ''],
                ['Confidence Intervals (MC)', p.probabilisticEnabled ? 'ON' : 'OFF', ''],
                [L.toggleAdvancedRisk,  p.advancedRiskEnabled ? 'ON' : 'OFF', ''],
                [],
                [L.sectionCorrelations],
                [L.correlationStrengthLabel, p.correlationMultiplier.toFixed(2), ''],
                [L.corrQ3Q1Label, String(p.corrQ3Q1), ''],
                [L.corrQ1Q5Label, p.corrQ1Q5.toFixed(1), ''],
                [L.corrQ1Q7Label, String(p.corrQ1Q7), ''],
                [L.corrQ3Q7Label, String(p.corrQ3Q7), ''],
                [],
                [L.sectionRiskWeights],
                [L.riskSecurityWeightLabel,   p.riskSecurityWeight.toFixed(2), ''],
                [L.riskRegulatoryWeightLabel, p.riskRegulatoryWeight.toFixed(2), ''],
                [],
                [L.sectionMc],
                ['MC Iterations',    String(p.mcIterations), ''],
                ['Confidence Level', Math.round(p.mcConfidence * 100) + '%', ''],
                ['Input Uncertainty', Math.round(p.mcUncertaintyPct * 100) + '%', ''],
                ['MTTR Uncertainty', Math.round(p.mcMttrUnc * 100) + '%', ''],
            ];
            const inputsData = [
                [L.xlsInputsTitle],
                [L.xlsGenerated, new Date().toLocaleString()],
                [],
                L.xlsInputsHeaders,
                ...L.xlsInputsRows.map((row, i) => [row[0], row[1], inputQValues[i], row[3]]),
                [],
                [L.xlsSimParamsTitle],
                [L.xlsAutoLevel,  autoLvlRaw, '%'           ],
                [L.xlsTeamSize,   teamSizeRaw, L.xlsTeamSizeUnit],
                [L.xlsCapex,      capexRaw,   PDE.currentCurrency      ],
                ...advancedRows,
            ];
            const wsInputs = XLSX.utils.aoa_to_sheet(sanitizeSheetData(inputsData));
            wsInputs['!cols'] = [{wch:6},{wch:38},{wch:18},{wch:14}];
            XLSX.utils.book_append_sheet(wb, wsInputs, L.xlsSheetInputs);

            const resultValues = [
                Math.round(r.cWaste), Math.round(r.cRisk), Math.round(r.cOppDirect), Math.round(r.cCascade),
                Math.round(r.totalImpact), Math.round(p.capex), Math.round(r.netDebt),
                Math.round(r.potentialSavings), isFinite(r.paybackMonths) ? Math.round(r.paybackMonths * 10) / 10 : L.scenInfinity,
                r.irr !== null ? (r.irr * 100).toFixed(1) + '%' : '\u2014',
            ];
            const resultsData = [
                [L.xlsResultsTitle],
                [],
                L.xlsResultsHeaders,
                ...L.xlsResultsRows.map((row, i) => [row[0], row[1], resultValues[i]]),
                ['', '', L.xlsResultsMonths],
            ];
            const wsResults = XLSX.utils.aoa_to_sheet(sanitizeSheetData(resultsData));
            wsResults['!cols'] = [{wch:32},{wch:50},{wch:18}];
            XLSX.utils.book_append_sheet(wb, wsResults, L.xlsSheetResults);

            const leversData = [
                [L.xlsLeversTitle],
                [],
                L.xlsLeversHeaders,
                ...top3.map((l, i) => [L.rankLabels[i], l.title, l.recovery, l.effort, l.timeline]),
                [],
                [L.xlsLeversTotalLabel, '', totalRecovery, '', ''],
                [L.xlsLeversPayback,    '', isFinite(r.paybackMonths) ? Math.round(r.paybackMonths * 10) / 10 : L.scenInfinity, '', L.xlsResultsMonths],
            ];
            const wsLevers = XLSX.utils.aoa_to_sheet(sanitizeSheetData(leversData));
            wsLevers['!cols'] = [{wch:22},{wch:32},{wch:28},{wch:12},{wch:14}];
            XLSX.utils.book_append_sheet(wb, wsLevers, L.xlsSheetLevers);

            var scenC_cap = p.capex * PDE.COEFFICIENTS.SCEN_C_CAPEX_MULTIPLIER;
            var scenValues = [
                [Math.round(scenA.net), Math.round(r.totalImpact), Math.round(r.totalImpact)],
                [0,                     Math.round(p.capex),       Math.round(scenC_cap)  ],
                [0,                     Math.round(scenB.net),     Math.round(scenC.net)  ],
                ['\u221e',
                 isFinite(scenB.pb) ? Math.round(scenB.pb * 10)/10 : '\u221e',
                 isFinite(scenC.pb) ? Math.round(scenC.pb * 10)/10 : '\u221e'],
                [scenA.irr !== null ? (scenA.irr * 100).toFixed(1) + '%' : '\u2014',
                 scenB.irr !== null ? (scenB.irr * 100).toFixed(1) + '%' : '\u2014',
                 scenC.irr !== null ? (scenC.irr * 100).toFixed(1) + '%' : '\u2014'],
            ];
            const scenData = [
                [L.xlsScenariosTitle],
                [],
                L.xlsScenariosHeaders,
                ...L.xlsScenariosRows.map((row, i) => [row[0], scenValues[i][0], scenValues[i][1], scenValues[i][2]]),
            ];
            const wsScen = XLSX.utils.aoa_to_sheet(sanitizeSheetData(scenData));
            wsScen['!cols'] = [{wch:24},{wch:20},{wch:28},{wch:28}];
            XLSX.utils.book_append_sheet(wb, wsScen, L.xlsSheetScenarios);

            const doraValues = [q2Raw, p.manualPercent, p.failures];
            const doraData = [
                [L.xlsDoraTitle],
                [],
                L.xlsDoraHeaders,
                ...L.xlsDoraRows.map((row, i) => [row[0], doraValues[i], row[2], PDE.getDoraBand(['leadTime','manual','errors'][i], doraValues[i]).band]),
            ];
            const wsDora = XLSX.utils.aoa_to_sheet(sanitizeSheetData(doraData));
            wsDora['!cols'] = [{wch:28},{wch:14},{wch:52},{wch:20}];
            XLSX.utils.book_append_sheet(wb, wsDora, L.xlsSheetDora);

            XLSX.writeFile(wb, 'Process-Debt-Engine.xlsx');
        } catch(err) {
            console.error('Excel export error:', err);
            alert('Export failed: ' + err.message);
        } finally {
            btn.disabled = false;
            btn.textContent = PDE.t('exportExcelBtn');
        }
    }, 80);
};

PDE.resolveCSSVarsOnElement = function resolveCSSVarsOnElement(el) {
    const cs = getComputedStyle(document.documentElement);
    const varMap = {
        '--bg-base':       cs.getPropertyValue('--bg-base').trim()       || '#F5F0E8',
        '--bg-surface':    cs.getPropertyValue('--bg-surface').trim()    || '#FDFAF5',
        '--bg-elevated':   cs.getPropertyValue('--bg-elevated').trim()   || '#FFFFFF',
        '--bg-hover':      cs.getPropertyValue('--bg-hover').trim()      || '#F0EAE0',
        '--bg-input':      cs.getPropertyValue('--bg-input').trim()      || '#FAF7F2',
        '--border':        cs.getPropertyValue('--border').trim()        || '#D6C9B8',
        '--border-focus':  cs.getPropertyValue('--border-focus').trim()  || '#B45309',
        '--text-primary':  cs.getPropertyValue('--text-primary').trim()  || '#1C1410',
        '--text-secondary':cs.getPropertyValue('--text-secondary').trim()|| '#4A3F35',
        '--text-muted':    cs.getPropertyValue('--text-muted').trim()    || '#8C7B6E',
        '--text-label':    cs.getPropertyValue('--text-label').trim()    || '#7C4F22',
        '--accent':        cs.getPropertyValue('--accent').trim()        || '#B45309',
        '--accent-bright': cs.getPropertyValue('--accent-bright').trim() || '#92400E',
        '--accent-glow':   cs.getPropertyValue('--accent-glow').trim()   || 'rgba(180,83,9,0.12)',
        '--accent-dim':    cs.getPropertyValue('--accent-dim').trim()    || 'rgba(180,83,9,0.07)',
        '--red':           cs.getPropertyValue('--red').trim()           || '#DC2626',
        '--orange':        cs.getPropertyValue('--orange').trim()        || '#EA580C',
        '--purple':        cs.getPropertyValue('--purple').trim()        || '#7C3AED',
        '--green':         cs.getPropertyValue('--green').trim()         || '#16A34A',
        '--yellow':        cs.getPropertyValue('--yellow').trim()        || '#CA8A04',
    };

    const PROPS_TO_INLINE = [
        'backgroundColor', 'color', 'borderColor',
        'borderLeftColor', 'borderTopColor', 'borderRightColor', 'borderBottomColor',
        'boxShadow', 'outlineColor',
    ];

    el.querySelectorAll('*').forEach(node => {
        if (!(node instanceof HTMLElement)) return;
        const computed = getComputedStyle(node);
        PROPS_TO_INLINE.forEach(prop => {
            const val = computed[prop];
            if (val && val.includes('var(')) {
                let resolved = val;
                for (const [token, hex] of Object.entries(varMap)) {
                    resolved = resolved.replaceAll(`var(${token})`, hex);
                }
                node.style[prop] = resolved;
            } else if (val && val !== node.style[prop]) {
                node.style[prop] = val;
            }
        });
    });
};

PDE.exportPDF = async function exportPDF(mode) {
    if (PDE.isMobileBrowser()) {
        const msg = PDE.currentLang === 'pl'
            ? 'Eksport PDF nie jest obs�ugiwany na urz�dzeniach mobilnych (iOS Safari / Android WebView nie obs�uguj� renderowania CSS). Otw�rz t� stron� na komputerze, aby wygenerowa� raport.'
            : 'PDF export is not supported on mobile browsers (iOS Safari / Android WebView cannot reliably render CSS custom properties). Please open this page on a desktop browser to generate the report.';
        alert(msg);
        return;
    }

    var btnId = mode === 'full' ? 'exportBtnFull' : 'exportBtnSimple';
    var generatingKey = mode === 'full' ? 'exportGeneratingFull' : 'exportGeneratingSimple';
    var finishedKey = mode === 'full' ? 'exportBtnFull' : 'exportBtnSimple';
    var filename = mode === 'full' ? 'Strategic_Detailed_Report.pdf' : 'Strategic_Summary_Report.pdf';

    const { jsPDF } = window.jspdf;
    const btn = document.getElementById(btnId);
    btn.disabled = true;
    btn.textContent = PDE.t(generatingKey);
    await new Promise(r => setTimeout(r, 120));

    try {
        const pdf    = new jsPDF('p', 'mm', 'a4');
        const PW     = 210, PH = 297;
        const ML     = 14, MR = 14, MT = 14;
        const UW     = PW - ML - MR;
        let   cy     = MT;
        const L      = PDE.TRANSLATIONS[PDE.currentLang];

        let pdfFont = 'helvetica';
        try {
            const [regResp, bldResp] = await Promise.all([
                fetch('fonts/Inter-Regular.ttf'),
                fetch('fonts/Inter-Bold.ttf')
            ]);
            if (regResp.ok && bldResp.ok) {
                const [regBuf, bldBuf] = await Promise.all([
                    regResp.arrayBuffer(),
                    bldResp.arrayBuffer()
                ]);
                function bufToB64(buf) {
                    let binary = '';
                    const bytes = new Uint8Array(buf);
                    for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
                    return btoa(binary);
                }
                pdf.addFileToVFS('Inter-Regular.ttf', bufToB64(regBuf));
                pdf.addFont('Inter-Regular.ttf', 'Inter', 'normal');
                pdf.addFileToVFS('Inter-Bold.ttf', bufToB64(bldBuf));
                pdf.addFont('Inter-Bold.ttf', 'Inter', 'bold');
                pdfFont = 'Inter';
            }
        } catch (e) {
            console.warn('Could not load Inter font for PDF:', e.message);
        }

        function newPage() { pdf.addPage(); cy = MT; }
        function needSpace(h) { if (cy + h > PH - 10) newPage(); }

        function drawRect(x, y, w, h, fill, stroke) {
            if (fill)   { pdf.setFillColor(...fill);   pdf.rect(x, y, w, h, 'F'); }
            if (stroke) { pdf.setDrawColor(...stroke); pdf.setLineWidth(0.3); pdf.rect(x, y, w, h, 'S'); }
        }

        function wrapText(text, x, maxW, lineH) {
            const words = String(text).split(' ');
            const lines = [];
            let cur = '';
            words.forEach(w => {
                const test = cur ? cur + ' ' + w : w;
                if (pdf.getTextWidth(test) <= maxW) { cur = test; }
                else { if (cur) lines.push(cur); cur = w; }
            });
            if (cur) lines.push(cur);
            return lines;
        }

        function textBlock(text, x, y, maxW, fontSize, color, bold) {
            pdf.setFontSize(fontSize);
            pdf.setFont(pdfFont, bold ? 'bold' : 'normal');
            pdf.setTextColor(...color);
            const lines = wrapText(text, x, maxW, fontSize * 0.3528);
            lines.forEach((line, i) => { pdf.text(line, x, y + i * (fontSize * 0.3528 * 1.35)); });
            return lines.length * (fontSize * 0.3528 * 1.35);
        }

        drawRect(0, 0, PW, 12, [92, 64, 18]);
        pdf.setFontSize(9); pdf.setFont(pdfFont, 'bold');
        pdf.setTextColor(253, 245, 230);
        pdf.text('STRATEGIC BUSINESS CASE ENGINE', ML, 8);
        pdf.setTextColor(214, 201, 184); pdf.setFont(pdfFont, 'normal');
        pdf.text(L.navSubtitle.toUpperCase(), PW - MR, 8, { align: 'right' });

        cy = 20;
        drawRect(ML - 2, cy - 4, UW + 4, 10, [180, 83, 9]);
        pdf.setFontSize(11); pdf.setFont(pdfFont, 'bold'); pdf.setTextColor(255, 255, 255);
        pdf.text(L.phase1Title.toUpperCase(), ML + 2, cy + 3);
        cy += 14;

        const qKeys = [
            { label: PDE.t('q1label'),  desc: L.q1desc,  id: 'q1',  type: 'number' },
            { label: PDE.t('q2label'),  desc: L.q2desc,  id: 'q2',  type: 'number' },
            { label: PDE.t('q3label'),  desc: L.q3desc,  id: 'q3',  type: 'slider', valId: 'q3Val', min: L.q3min, max: L.q3max },
            { label: PDE.t('q4label'),  desc: L.q4desc,  id: 'q4',  type: 'number' },
            { label: PDE.t('q5label'),  desc: L.q5desc,  id: 'q5',  type: 'number' },
            { label: PDE.t('q11label'), desc: L.q11desc, id: 'q11', type: 'number' },
            { label: PDE.t('q6label'),  desc: L.q6desc,  id: 'q6',  type: 'number' },
            { label: PDE.t('q7label'),  desc: L.q7desc,  id: 'q7',  type: 'number' },
            { label: PDE.t('q8label'),  desc: L.q8desc,  id: 'q8',  type: 'number' },
            { label: PDE.t('q9label'),  desc: L.q9desc,  id: 'q9',  type: 'slider', valId: 'q9Val' },
            { label: PDE.t('q10label'), desc: L.q10desc, id: 'q10', type: 'number' },
        ];

        const colW = UW / 2 - 4;
        let col1 = ML, col2 = ML + colW + 8;
        function drawQuestion(q, x) {
            const el = document.getElementById(q.id);
            const val = el ? el.value : '0';
            let displayVal = val;
            if (q.valId) {
                const valEl = document.getElementById(q.valId);
                if (valEl) displayVal = valEl.textContent;
            }
            const isCur = ['q4','q6','q8'].includes(q.id);
            const suffix = q.id === 'capex' ? '' : (q.id === 'q2' ? ' hrs' : (q.id === 'q4' ? ' /h' : (q.id === 'q7' ? ' h/m' : (q.id === 'q10' ? '%' : (q.id === 'autoLevel' ? '%' : '')))));
            const prefix = isCur ? PDE.CURRENCY_SYMBOLS[PDE.currentCurrency] : '';
            const fullVal = prefix + (isCur ? parseFloat(val).toLocaleString(PDE.currentLang === 'pl' ? 'pl-PL' : 'en-US', {minimumFractionDigits:2}) : displayVal) + suffix;
            const qName = q.label.replace(/\d+\.\s*/, '');
            needSpace(10);
            drawRect(x - 1, cy - 1, colW + 2, 8, null, [92, 64, 18]);
            pdf.setFontSize(7); pdf.setFont(pdfFont, 'normal'); pdf.setTextColor(140, 123, 110);
            pdf.text(qName, x, cy + 2.5);
            pdf.setFont(pdfFont, 'bold'); pdf.setFontSize(7); pdf.setTextColor(92, 64, 18);
            pdf.text(fullVal, x + colW - 2, cy + 2.5, { align: 'right' });
            cy += 11;
        }

        qKeys.forEach((q, i) => {
            if (i < 6) drawQuestion(q, col1);
            else drawQuestion(q, col2);
        });

        cy = Math.max(cy, MT + 4);
        needSpace(10);
        cy += 4;

        drawRect(ML - 2, cy - 4, UW + 4, 10, [92, 64, 18]);
        pdf.setFontSize(11); pdf.setFont(pdfFont, 'bold'); pdf.setTextColor(255, 255, 255);
        pdf.text(L.phase2Title.toUpperCase(), ML + 2, cy + 3);
        cy += 14;

        const paramKeys = [
            { label: PDE.t('autoLabel'),  id: 'autoLevel',  suffix: '%', prefix: '' },
            { label: PDE.t('teamSizeLabel'), id: 'teamSize', suffix: '', prefix: '' },
            { label: PDE.t('capexLabel'),   id: 'capex',    suffix: '', prefix: PDE.CURRENCY_SYMBOLS[PDE.currentCurrency] },
            { label: PDE.t('cascadeMultLabel'), id: 'cascadeMult', suffix: '', prefix: '' },
            { label: PDE.t('erosionRateLabel'), id: 'erosionRate', suffix: '', prefix: '' },
            { label: PDE.t('discountRateLabel'),id: 'discountRate',suffix: '%', prefix: '' },
            { label: PDE.t('timeHorizonLabel'), id: 'timeHorizon', suffix: ' yr', prefix: '' },
            { label: PDE.t('leverAutomationLabel'), id: 'leverAutomation', suffix: '%', prefix: '' },
            { label: PDE.t('leverRiskLabel'),    id: 'leverRisk',    suffix: '%', prefix: '' },
        ];
        const pColW = UW / 3 - 4;
        paramKeys.forEach((p, i) => {
            const x = ML + (i % 3) * (pColW + 6);
            if (i % 3 === 0 && i > 0) { cy += 2; needSpace(10); }
            const el = document.getElementById(p.id);
            let val = el ? el.value : '0';
            if (p.id === 'discountRate' || p.id === 'leverAutomation' || p.id === 'leverRisk') {
                val = Math.round(parseFloat(val) * 100) + '%';
            } else if (p.id === 'cascadeMult') { val = parseFloat(val).toFixed(1); }
            else if (p.id === 'erosionRate') { val = parseFloat(val).toFixed(2); }
            else if (p.id === 'capex') {
                val = PDE.CURRENCY_SYMBOLS[PDE.currentCurrency] + parseFloat(val).toLocaleString(PDE.currentLang === 'pl' ? 'pl-PL' : 'en-US', {minimumFractionDigits:2});
            }
            drawRect(x - 1, cy - 1, pColW + 2, 8, null, [92, 64, 18]);
            pdf.setFontSize(6); pdf.setFont(pdfFont, 'normal'); pdf.setTextColor(140, 123, 110);
            pdf.text(p.label, x, cy + 2.5);
            pdf.setFont(pdfFont, 'bold'); pdf.setFontSize(6); pdf.setTextColor(92, 64, 18);
            pdf.text(val + p.suffix, x + pColW - 2, cy + 2.5, { align: 'right' });
            cy += 10;
        });

        cy += 6;
        const BLOCK_HEIGHT = 8;
        const footerH = 6;
        needSpace(BLOCK_HEIGHT + footerH);
        drawRect(ML - 2, cy - 2, UW + 4, 4, [180, 83, 9]);
        pdf.setFontSize(6); pdf.setFont(pdfFont, 'bold'); pdf.setTextColor(255, 255, 255);
        pdf.text('Page 1 / 2 \u2013 Strategic Diagnostic Data', ML + 2, cy + 1.5);
        cy += 6;

        async function captureBlock(id) {
            const el = document.getElementById(id);
            if (!el) return;
            const swaps = [];
            el.querySelectorAll('input, select, textarea').forEach(input => {
                const rect = input.getBoundingClientRect();
                if (rect.width === 0 && rect.height === 0) return;
                const proxy = document.createElement('div');
                proxy.style.cssText = 'display:inline-block;white-space:pre-wrap;overflow:hidden;';
                proxy.style.width = input.offsetWidth + 'px';
                proxy.style.height = input.offsetHeight + 'px';
                proxy.style.minHeight = '36px';
                proxy.textContent = input.value;
                input.parentNode.insertBefore(proxy, input);
                input.style.display = 'none';
                swaps.push({ input, proxy });
            });

            const savedPb = el.style.paddingBottom;
            el.style.paddingBottom = '3px';

            const nodeList = Array.from(el.querySelectorAll('*'));
            const savedStyles = nodeList.map(n =>
                n instanceof HTMLElement ? n.style.cssText : undefined
            );
            PDE.resolveCSSVarsOnElement(el);

            const canvas = await html2canvas(el, {
                scale: 2,
                useCORS: true,
                logging: false,
                backgroundColor: '#F5F0E8',
                windowWidth: 1400,
                windowHeight: document.documentElement.scrollHeight,
                onclone: async (clonedDoc) => {
                    const cs = getComputedStyle(document.documentElement);
                    const vars = [
                        '--bg-base','--bg-surface','--bg-elevated','--bg-hover',
                        '--bg-input','--border','--border-focus','--border-subtle',
                        '--text-primary','--text-secondary','--text-muted','--text-label',
                        '--accent','--accent-bright','--accent-glow','--accent-dim',
                        '--red','--orange','--purple','--green','--yellow',
                    ];
                    const decls = vars
                        .map(v => `${v}:${cs.getPropertyValue(v).trim() || 'inherit'}`)
                        .join(';');

                    const fontFaceCSS = PDE.buildFontFaceCSS();

                    const style = clonedDoc.createElement('style');
                    style.textContent = `:root{${decls}}\n${fontFaceCSS}`;
                    clonedDoc.head.insertBefore(style, clonedDoc.head.firstChild);

                    for (const sheet of clonedDoc.styleSheets) {
                        try {
                            for (let i = sheet.cssRules.length - 1; i >= 0; i--) {
                                const rule = sheet.cssRules[i];
                                if (rule.type === CSSRule.IMPORT_RULE &&
                                    rule.href?.includes('fonts.googleapis.com')) {
                                    sheet.deleteRule(i);
                                }
                            }
                        } catch { }
                    }
                }
            });

            nodeList.forEach((node, i) => {
                if (node instanceof HTMLElement && savedStyles[i] !== undefined) {
                    node.style.cssText = savedStyles[i];
                }
            });
            swaps.forEach(({ input, proxy }) => {
                input.style.display = '';
                proxy.remove();
            });
            el.style.paddingBottom = savedPb;

            const imgData = canvas.toDataURL('image/png');
            const bH = (canvas.height * UW) / canvas.width;

            if (bH > PH - MT - 10) {
                if (cy > MT) newPage();
                const sH = PH - MT - 10;
                const sW = (canvas.width * sH) / canvas.height;
                pdf.addImage(imgData, 'PNG', ML + (UW - sW) / 2, cy, sW, sH);
                newPage();
                cy = MT;
            } else {
                if (cy + bH > PH - 10) { newPage(); cy = MT; }
                pdf.addImage(imgData, 'PNG', ML, cy, UW, bH);
                cy += bH + 5;
            }
        }

        var mainIds = ['pdf-block-3', 'scenario-compare'];
        if (mode === 'full') {
            mainIds = ['pdf-block-2', 'pdf-block-3', 'scenario-compare', 'pdf-block-5', 'pdf-block-6', 'pdf-block-7'];
        }
        for (const id of mainIds) await captureBlock(id);

        if (mode === 'full') {
            newPage();
            const methodologySection = document.getElementById('methodologySection');
            const wasOpen = methodologySection ? methodologySection.open : false;
            if (methodologySection) methodologySection.open = true;
            await new Promise(r => requestAnimationFrame(r));
            const methodologyIds = ['methodology-header','methodology-1','methodology-2','methodology-3','methodology-4','methodology-5','methodology-6','methodology-7','methodology-8','methodology-9','methodology-10','methodology-11','methodology-12','methodology-13','methodology-14','methodology-15','methodology-footer'];
            for (const id of methodologyIds) await captureBlock(id);
            if (methodologySection) methodologySection.open = wasOpen;
        }

        pdf.save(filename);
    } catch (err) {
        console.error('PDF export error:', err);
        const msg = PDE.currentLang === 'pl'
            ? 'Eksport PDF nie powi�d� si�: ' + err.message
            : 'PDF export failed: ' + err.message;
        alert(msg);
    } finally {
        btn.disabled = false;
        btn.textContent = PDE.t(finishedKey);
    }
};

// ── Font cache ──
const FONT_CACHE_KEY = 'fontCache_v1';
const _fontCache = new Map();

const _FONT_ALLOWED_FAMILIES = { 'Space Grotesk': true, 'Inter': true };
const _FONT_ALLOWED_STYLES   = { 'normal': true, 'italic': true, 'oblique': true };
const _FONT_ALLOWED_FMTS     = { 'woff2': true, 'woff': true, 'truetype': true };
const _FONT_B64_RE           = /^[A-Za-z0-9+/]+=*$/;
const _FONT_B64_MAX_LEN      = 700000;

PDE.validateFontFace = function validateFontFace(f) {
    if (!f || typeof f !== 'object')                          return null;
    if (!_FONT_ALLOWED_FAMILIES[f.family])                    return null;
    if (!/^\d+$/.test(String(f.weight)))                      return null;
    var w = parseInt(f.weight, 10);
    if (w < 100 || w > 900 || w % 100 !== 0)                  return null;
    if (!_FONT_ALLOWED_STYLES[f.style])                       return null;
    if (!_FONT_ALLOWED_FMTS[f.fmt])                           return null;
    if (typeof f.b64 !== 'string')                            return null;
    if (f.b64.length === 0 || f.b64.length > _FONT_B64_MAX_LEN) return null;
    if (!_FONT_B64_RE.test(f.b64))                            return null;
    return { family: f.family, weight: String(w), style: f.style,
             fmt: f.fmt, b64: f.b64 };
};

(function seedFontCacheFromStorage() {
    try {
        const stored = localStorage.getItem(FONT_CACHE_KEY);
        if (!stored) return;
        const faces = JSON.parse(stored);
        if (!Array.isArray(faces)) return;
        let seeded = 0;
        faces.forEach(raw => {
            const f = PDE.validateFontFace(raw);
            if (!f) return;
            _fontCache.set(`${f.family}||${f.weight}||${f.style}`, f);
            seeded++;
        });
    } catch(e) { }
})();

PDE.prefetchFontsToBase64 = async function prefetchFontsToBase64() {
    if (PDE.isMobileBrowser()) return;

    await document.fonts.ready;

    const urlsByRule = [];
    for (const sheet of document.styleSheets) {
        let rules;
        try { rules = sheet.cssRules; } catch { continue; }
        for (const rule of rules) {
            if (rule.type !== CSSRule.FONT_FACE_RULE) continue;
            const family = rule.style.getPropertyValue('font-family')
                               .replace(/['"]/g, '').trim();
            if (!['Space Grotesk', 'Inter'].includes(family)) continue;
            const weight = rule.style.getPropertyValue('font-weight').trim();
            const style  = rule.style.getPropertyValue('font-style').trim() || 'normal';
            const key    = `${family}||${weight}||${style}`;
            if (_fontCache.has(key)) continue;
            const srcVal = rule.style.getPropertyValue('src');
            const woff2M = srcVal.match(/url\(["']?([^"')]+\.woff2)["']?\)/);
            const anyM   = srcVal.match(/url\(["']?([^"')]+)["']?\)/);
            const url    = (woff2M || anyM)?.[1];
            if (url) urlsByRule.push({ family, weight, style, url });
        }
    }

    if (urlsByRule.length === 0) return;

    await Promise.allSettled(urlsByRule.map(async ({ family, weight, style, url }) => {
        const key = `${family}||${weight}||${style}`;
        try {
            const resp = await fetch(url, { mode: 'cors', cache: 'force-cache' });
            if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
            const buf = await resp.arrayBuffer();
            const bytes = new Uint8Array(buf);
            const CHUNK = 8192;
            let binary = '';
            for (let i = 0; i < bytes.length; i += CHUNK) {
                binary += String.fromCharCode.apply(null, bytes.subarray(i, i + CHUNK));
            }
            const b64 = btoa(binary);
            const fmt = url.endsWith('.woff2') ? 'woff2'
                      : url.endsWith('.woff')  ? 'woff' : 'truetype';
            _fontCache.set(key, { b64, fmt, family, weight, style });
        } catch (e) { }
    }));

    try {
        const faces = Array.from(_fontCache.values());
        localStorage.setItem(FONT_CACHE_KEY, JSON.stringify(faces));
    } catch(e) { }
};

PDE.buildFontFaceCSS = function buildFontFaceCSS() {
    let css = '';
    for (const raw of _fontCache.values()) {
        const f = PDE.validateFontFace(raw);
        if (!f) continue;
        css += `@font-face{font-family:'${f.family}';font-weight:${f.weight};`
             + `font-style:${f.style};`
             + `src:url('data:font/${f.fmt};base64,${f.b64}') format('${f.fmt}');}\n`;
    }
    return css;
};
