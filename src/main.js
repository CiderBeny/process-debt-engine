// ═══════════════════════════════════════════════════════════════
// Main entry — DOMContentLoaded + window.onload
// ═══════════════════════════════════════════════════════════════
window.PDE = window.PDE || {};

document.addEventListener('DOMContentLoaded', () => {
    const gFont = document.getElementById('googleFontsSheet');
    if (gFont) gFont.media = 'all';

    document.querySelectorAll('.formula-tip').forEach(el => {
        el.addEventListener('click', e => {
            e.stopPropagation();
            const isOpen = el.classList.contains('tip-open');
            document.querySelectorAll('.formula-tip').forEach(t => t.classList.remove('tip-open'));
            if (!isOpen) el.classList.add('tip-open');
        });
        el.addEventListener('keydown', e => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                const isOpen = el.classList.contains('tip-open');
                document.querySelectorAll('.formula-tip').forEach(t => t.classList.remove('tip-open'));
                if (!isOpen) el.classList.add('tip-open');
            }
            if (e.key === 'Escape') {
                el.classList.remove('tip-open');
            }
        });
    });

    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', function () {
            document.querySelectorAll('.tab-btn').forEach(b => {
                b.style.borderBottomColor = 'transparent';
                b.style.color = 'var(--text-muted)';
            });
            this.style.borderBottomColor = 'var(--accent)';
            this.style.color = 'var(--accent)';
            document.querySelectorAll('.tab-content').forEach(tc => tc.style.display = 'none');
            const tabId = 'tab-' + this.getAttribute('data-tab');
            const target = document.getElementById(tabId);
            if (target) target.style.display = '';
        });
    });

    const calcIds = ['q1','q2','q3','q4','q5','q11','q6','q7','q8','q9','q10','autoLevel','teamSize','capex','opexAdjMult','erosionRate','discountRate','timeHorizon','leverAutomation','leverRisk'];
    calcIds.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.addEventListener('input', PDE.calculate);
    });

    const copyBtn = document.getElementById('copyLinkBtn');
    if (copyBtn) copyBtn.addEventListener('click', PDE.copyShareLink);

    const langButton = document.getElementById('langBtn');
    if (langButton) langButton.addEventListener('click', PDE.toggleLang);

    const currencySelect = document.getElementById('currencySelect');
    if (currencySelect) currencySelect.addEventListener('change', e => PDE.toggleCurrency(e.target.value));

    const excelBtn = document.getElementById('exportExcelBtn');
    if (excelBtn) excelBtn.addEventListener('click', PDE.exportExcel);

    const pdfBtnSimple = document.getElementById('exportBtnSimple');
    if (pdfBtnSimple) pdfBtnSimple.addEventListener('click', function () { PDE.exportPDF('simple'); });
    const pdfBtnFull = document.getElementById('exportBtnFull');
    if (pdfBtnFull) pdfBtnFull.addEventListener('click', function () { PDE.exportPDF('full'); });

    const sliderIds = [
        'scenCAutoLevel','scenCCapexMult','annualHours',
        'leverInnovation','leverManagement','leverTurnover',
        'correlationStrength','corrQ3Q1','corrQ1Q5','corrQ1Q7','corrQ3Q7',
        'riskSecurityWeight','riskRegulatoryWeight',
        'mcIterations','mcConfidence','mcUncertaintyPct','mcMttrUncertaintyPct',
    ];
    sliderIds.forEach(function (id) {
        const el = document.getElementById(id);
        if (el) {
            el.addEventListener('input', PDE.calculate);
        }
    });

    ['correlationsToggle','nonlinearToggle','probabilisticToggle','advancedRiskToggle'].forEach(function (id) {
        const el = document.getElementById(id);
        if (el) {
            el.addEventListener('change', function () { PDE.applyToggleVisibility(id); PDE.saveToggleStates(); PDE.calculate(); });
        }
        PDE.applyToggleVisibility(id);
    });
    PDE.loadToggleStates();

    document.addEventListener('click', e => {
        if (!e.target.classList.contains('formula-tip')) {
            document.querySelectorAll('.formula-tip').forEach(t => t.classList.remove('tip-open'));
        }
    });
});

window.onload = () => {
    if (typeof Chart !== 'undefined') {
        const cs = getComputedStyle(document.documentElement);
        Chart.defaults.color           = cs.getPropertyValue('--text-secondary').trim() || PDE.DARK.text;
        Chart.defaults.borderColor     = cs.getPropertyValue('--border').trim() || PDE.DARK.grid;
        Chart.defaults.backgroundColor = cs.getPropertyValue('--border').trim() || PDE.DARK.navy;
    }
    document.getElementById('currencySelect').value = PDE.currentCurrency;
    PDE.applyTranslations();
    PDE.nbpFetching = true;
    document.getElementById('nbpFooter').textContent = PDE.TRANSLATIONS[PDE.currentLang].nbpFetching;
    PDE.decodeState();
    PDE.calculate();
    requestAnimationFrame(() => { PDE.calculate(); });
    PDE.fetchNbpRates();

    if (PDE.isMobileBrowser()) {
        ['exportBtnSimple','exportBtnFull'].forEach(function (id) {
            const btn = document.getElementById(id);
            if (btn) {
                btn.disabled = true;
                btn.title = PDE.currentLang === 'pl'
                    ? 'Eksport PDF niedost\u0119pny na urz\u0105dzeniach mobilnych — otwórz na komputerze'
                    : 'PDF export unavailable on mobile — open on a desktop browser';
                btn.style.opacity = '0.45';
                btn.style.cursor  = 'not-allowed';
                btn.textContent = '\uD83D\uDDA5 PDF (DESKTOP ONLY)';
            }
        });
    }

    PDE.prefetchFontsToBase64();

    window.addEventListener('beforeunload', function () {
        if (PDE._mcWorker) PDE._mcWorker.terminate();
    });
};
