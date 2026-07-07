        // ═══════════════════════════════════════════════════════════════
        // i18n — full translation dictionary
        // ═══════════════════════════════════════════════════════════════
        const TRANSLATIONS = {
            en: {
                navSubtitle:      'IT Process Efficiency & Financial Strategy Engine',
                exportBtn:        'EXPORT STRATEGIC REPORT (PDF)',
                exportGenerating: 'Generating PDF…',
                phase1Title:      'Phase 1: Strategic Diagnostic Questionnaire',
                q1label:  '1. Manual Effort (%)',
                q1desc:   'What percentage of the sprint capacity is consumed by repetitive manual tasks such as deployments, regression testing, or environment configuration?',
                q2label:  '2. Lead Time (Hrs)',
                q2desc:   "What is the average 'Lead Time' for a single change, measured from the initial request or code commit to successful production deployment?",
                q3label:  '3. Documentation Standard (1–5)',
                q3desc:   'Does the organization maintain a unified process documentation standard, or is critical knowledge fragmented across tribal silos?',
                q3min:    '1 — Fragmented',
                q3max:    '5 — Unified',
                q4label:  '4. Downtime Cost ({C}/h)',
                q4desc:   'What is the estimated hourly revenue loss or operational penalty during a critical business system outage?',
                q5label:  '5. Human Errors / Quarter',
                q5desc:   'How many production incidents or rollbacks in the last quarter were directly caused by human error during manual execution steps?',
                q6label:  '6. Blended Rate ({C}/h)',
                q6desc:   'What is the average hourly cost (Blended Rate) of an engineer, including gross salary, benefits, hardware, and overhead?',
                q7label:  '7. Management Overhead (h/m)',
                q7desc:   'How many hours per month do managers spend coordinating communication and "chasing people" due to siloed processes?',
                q8label:  '8. Opportunity Margin ({C})',
                q8desc:   'What is the projected gross margin from new projects or features that are currently delayed due to technical or process debt?',
                q9label:  '9. Scalability Bottleneck (1–5)',
                q9desc:   'Impact on ability to scale growth?',
                q10label: '10. Employee Turnover (%)',
                q10desc:  'What is the annual turnover rate in teams heavily burdened by manual, repetitive work (burnout indicator)?',
                q11label: '11. MTTR ({C})',
                q11desc:  'What is the average time (in hours) to restore a critical service after a production incident (Mean Time To Repair)?',
                simTitle:       'Investment & Simulation Parameters',
                autoLabel:      'Target Automation Level (%)',
                efficiencyGain: 'Efficiency Gain',
                teamSizeLabel:  'Team Size (engineers)',
                teamSizeHelper: 'Total number of engineers affected by process debt.',
                capexLabel:     'One-Time CAPEX Investment ({C})',
                capexHelper:    'Licenses, Implementation, and Training costs.',
                statWasteLabel:   'Annual OPEX Waste',
                statRiskLabel:    'Risk Exposure',
                statOppLabel:     'Pipeline Margin Erosion',
                statCascadeLabel: 'Cascade Impact',
                statTotalLabel:   'Total Debt Impact',
                statNetLabel:   'Net Debt After Investment',
                statNetHelper:  'Total impact minus CAPEX',
                formulaWaste: '(Manual hrs/yr + Manager chase hrs/yr) × Blended Rate × Team Size',
                formulaRisk:  'Annual failures × MTTR × Downtime cost/hr × (Risk level / 5)',
                formulaOpp:     '(Opportunity margin × 0.25)',
                formulaCascade: 'OPEX Waste × 1.5 (pipeline cascade multiplier)',
                formulaTotal:   'OPEX Waste + Risk Exposure + Pipeline Margin Erosion + Cascade Impact',
                formulaNet:   'Total Debt Impact − CAPEX Investment',
                chart1Title: '1. Waterfall: Capacity Erosion',
                chart1Sub:   'hrs / year',
                chart2Title: '2. Strategic Debt Bridge',
                chart2Sub:   'financial ({C})',
                chart3Title: '3. Risk Heatmap',
                chart3Sub:   'shift analysis',
                execTitle:    'Executive Summary & Top Levers',
                execSubtitle: 'Strategic recommendations based on diagnostic data.',
                block6Title:    'Executive Summary — Top 3 Financial Levers',
                block6Subtitle: 'Ranked by estimated recoverable value · updated in real-time from diagnostic inputs',
                // chart labels
                chartWaterfallLabels: ['Max Capacity', 'Manual Work', 'Silo Chasing', 'Value Delivery'],
                chartBridgeLabels:    ['OPEX Waste', 'CAPEX Investment', 'Year 1 Net Gain'],
                chartCurrentState:    'Current State',
                chartTargetState:     'Target State',
                chartEffortAxis:      'Effort Leakage %',
                chartRiskAxis:        'Risk Level',
                // rec engine
                recAutomation: (val) => `<strong style="color:var(--red)">Automation Lever:</strong> High manual overhead. A Self-Service Portal could recover <strong>${formatCurrency(val)}</strong> in labor costs.`,
                recRisk:        () => `<strong style="color:var(--orange)">Risk Lever:</strong> Critical risk exposure. Auto-Discovery (CMDB) reduces MTTR and safeguards revenue.`,
                recInnovation: (val) => `<strong style="color:var(--purple)">Innovation Lever:</strong> Debt backlog is blocking roadmap. Resolving it unlocks <strong>${formatCurrency(val)}</strong> in project margin.`,
                recVerdict:    (pb)  => `Financial Verdict: Payback period — ${pb} months.`,
                // lever titles & details
                leverAutomationTitle:  'Process Automation',
                leverAutomationDetail: (pct) => `Automating ${pct}% of manual sprint work with CI/CD pipelines and self-service portals eliminates repetitive overhead and accelerates delivery.`,
                leverRiskTitle:        'Risk & Incident Reduction',
                leverRiskDetail:       () => `Deploying Auto-Discovery and a CMDB reduces MTTR by up to 60%, directly protecting the revenue exposed to downtime incidents.`,
                leverInnovationTitle:  'Innovation Runway',
                leverInnovationDetail: () => `Clearing the technical debt backlog frees engineering capacity for new product margin, unlocking deferred roadmap value currently trapped behind legacy dependencies.`,
                leverMgmtTitle:        'Management Efficiency',
                leverMgmtDetail:       () => `Reducing silo-chasing overhead through shared tooling and dashboards reclaims high-cost manager hours for strategic work.`,
                leverTurnoverTitle:    'Retention & Burnout',
                leverTurnoverDetail:   () => `Reducing repetitive manual burden lowers burnout-driven attrition. Each retained engineer avoids ~2× annual salary in replacement costs.`,
                effortLow:    'Low',
                effortMedium: 'Medium',
                effortHigh:   'High',
                effortLabel:  'Effort',
                rankLabels:   ['#1 Highest ROI', '#2 Quick Win', '#3 Strategic'],
                estRecovery:  'estimated annual recovery',
                verdictRecoveryLabel: 'Combined Recovery Potential (Top 3)',
                verdictPaybackLabel:  'Investment Payback',
                verdictPaybackUnit:   'months',
                verdictNote: 'Prioritising the top 3 levers above delivers the fastest path to ROI. Begin with the lowest-effort items to build momentum before tackling strategic initiatives.',
                roadmapTitle:    'Generated 90-Day Delivery Roadmap',
                roadmapPhase1:   'Phase 1 — Month 1',
                roadmapPhase1Sub:'Foundation & Quick Wins',
                roadmapPhase2:   'Phase 2 — Month 2–3',
                roadmapPhase2Sub:'Core Implementation',
                roadmapPhase3:   'Phase 3 — Month 4–6',
                roadmapPhase3Sub:'Scale & Optimise',
                // Roadmap tasks — automation
                rmAutomation_p1: ['Audit all manual deployment steps', 'Define CI/CD pipeline blueprint', 'Identify top 5 automation candidates', 'Baseline cycle time measurement'],
                rmAutomation_p2: ['Implement first automated pipeline', 'Deploy self-service portal MVP', 'Automate regression test suite', 'Integrate with ticketing system'],
                rmAutomation_p3: ['Extend automation to 80% of workflows', 'Measure cycle time reduction', 'Publish automation ROI report', 'Train all squads on new pipelines'],
                // Roadmap tasks — risk
                rmRisk_p1: ['Inventory all production systems', 'Define CMDB schema & ownership', 'Map critical failure blast radius', 'Baseline current MTTR metric'],
                rmRisk_p2: ['Deploy Auto-Discovery tooling', 'Set alert thresholds & runbooks', 'Conduct first Game Day exercise', 'Integrate monitoring dashboards'],
                rmRisk_p3: ['Achieve full CMDB coverage', 'Run MTTR reduction review', 'Automate incident response flows', 'Publish risk posture scorecard'],
                // Roadmap tasks — innovation
                rmInnovation_p1: ['Prioritise technical debt backlog', 'Map roadmap items blocked by debt', 'Estimate capacity freed per quarter', 'Align stakeholders on priority order'],
                rmInnovation_p2: ['Retire top 3 legacy dependencies', 'Ship first deferred roadmap feature', 'Establish debt-prevention guidelines', 'Track opportunity recovery weekly'],
                rmInnovation_p3: ['Achieve 50%+ backlog reduction', 'Launch 2 new revenue-generating features', 'Establish quarterly debt review cadence', 'Report innovation runway gained'],
                // Roadmap tasks — mgmt
                rmMgmt_p1: ['Survey managers on coordination pain', 'Map silo-chasing hotspots', 'Evaluate shared tooling options', 'Define cross-team communication charter'],
                rmMgmt_p2: ['Deploy shared dashboards & wikis', 'Establish weekly cross-team standups', 'Reduce coordination meetings by 30%', 'Pilot inner-source documentation'],
                rmMgmt_p3: ['Measure manager hours reclaimed', 'Roll out tooling org-wide', 'Publish efficiency benchmarks', 'Celebrate quick-win milestones'],
                // Roadmap tasks — turnover
                rmTurnover_p1: ['Run burnout risk survey by team', 'Identify highest toil workflows', 'Benchmark turnover vs. industry', 'Define retention KPIs'],
                rmTurnover_p2: ['Eliminate top 3 toil sources', 'Launch engineering experience programme', 'Introduce on-call rotation fairness audit', 'Offer internal mobility pathways'],
                rmTurnover_p3: ['Track monthly turnover delta', 'Calculate retention cost savings', 'Extend programme to all engineering', 'Publish culture & health report'],
                doraTitle:    'DORA Benchmark Context',
                doraSubtitle: 'Where your inputs sit vs. industry research',
                doraMetricLeadTime:   'Lead Time',
                doraMetricManual:     'Manual Effort',
                doraMetricErrors:     'Human Error Rate (quarterly)',
                doraBandElite:  'Elite',
                doraBandHigh:   'High',
                doraBandMedium: 'Medium',
                doraBandLow:    'Low',
                doraLeadTimeDesc:  (v) => `${v} hrs`,
                doraManualDesc:    (v) => `${v}%`,
                doraErrorsDesc:    (v) => `${v} incidents`,
                doraLeadTimeBand:  'Elite <1h · High <24h · Medium <168h · Low >168h',
                doraManualBand:    'Elite <5% · High <15% · Medium <30% · Low >30%',
                doraErrorsBand:    'Elite 0 · High ≤1 · Medium ≤3 · Low >3',
                // Scenario comparison
                scenarioTitle:       'Investment Scenario Comparison',
                scenarioSubtitle:    'Three strategic paths — same debt, different outcomes',
                scenarioATitle:      'Do Nothing',
                scenarioADesc:       'Status quo maintained. No investment, no automation.',
                scenarioBTitle:      'Targeted Investment',
                scenarioBDesc:       'Current automation level applied with your CAPEX budget.',
                scenarioCTitle:      'Full Automation (80%)',
                scenarioCDesc:       'Maximum recommended automation with scaled CAPEX.',
                scenRecommended:     'RECOMMENDED',
                scenLabelDebt:       'Total Debt Impact',
                scenLabelInvestment: 'Investment (CAPEX)',
                scenLabelNet:        'Net Recovery',
                scenLabelPayback:    'Payback Period',
                scenMonths:          'months',
                scenInfinity:        '∞ No return',
                scenNoInvestment:    'No investment',
                copyLinkBtn:         '⧉ COPY LINK',
                exportExcelBtn:      '⬇ EXPORT TO EXCEL',
                exportExcelGenerating: '⏳ GENERATING...',
                // Excel sheet titles & headers
                xlsInputsTitle:      'Process Debt Engine — Diagnostic Inputs',
                xlsGenerated:        'Generated',
                xlsInputsHeaders:    ['#', 'Question', 'Value', 'Unit'],
                xlsInputsRows: [
                    ['Q1',  'Manual Effort',                  null, '%'        ],
                    ['Q2',  'Lead Time',                      null, 'hrs'      ],
                    ['Q3',  'Documentation Standard (1–5)',   null, '/5'       ],
                    ['Q4',  'Downtime Cost',                  null, '{C}/hr'   ],
                    ['Q5',  'Human Errors / Quarter',         null, 'incidents'],
                    ['Q11', 'MTTR',                           null, 'hrs'      ],
                    ['Q6',  'Blended Rate',                   null, '{C}/hr'   ],
                    ['Q7',  'Management Overhead',            null, 'hrs/mo'   ],
                    ['Q8',  'Opportunity Margin',             null, '{C}'      ],
                    ['Q9',  'Scalability Bottleneck (1–5)',   null, '/5'       ],
                    ['Q10', 'Employee Turnover',              null, '%/yr'     ],
                ],
                xlsSimParamsTitle:   'Simulation Parameters',
                xlsAutoLevel:        'Target Automation Level',
                xlsTeamSize:         'Team Size',
                xlsTeamSizeUnit:     'engineers',
                xlsCapex:            'One-Time CAPEX Investment',
                xlsResultsTitle:     'Process Debt Engine — Financial Results',
                xlsResultsHeaders:   ['Metric', 'Formula', 'Value ({CC})'],
                xlsResultsRows: [
                    ['Annual OPEX Waste',        '(Manual hrs/yr + Chase hrs/yr) × Rate × Team',        null],
                    ['Risk Exposure',             'Annual failures × MTTR × Downtime {C}/hr × (Risk/5)', null],
                    ['Pipeline Margin Erosion',   'Opportunity margin × 0.25',                          null],
                    ['Cascade Impact',             'OPEX Waste × 1.5 (pipeline cascade multiplier)',     null],
                    ['Total Debt Impact',          'OPEX + Risk + Pipeline Erosion + Cascade',           null],
                    ['CAPEX Investment',          'User input',                                          null],
                    ['Net Debt After Investment', 'Total Impact − CAPEX',                               null],
                    ['Potential Annual Savings',  '(OPEX Waste + Risk) × Automation Level',            null],
                    ['Payback Period',            'CAPEX / (Monthly Savings)',                           null],
                ],
                xlsResultsMonths:    'months',
                xlsLeversTitle:      'Top 3 Financial Levers (sorted by estimated annual recovery)',
                xlsLeversHeaders:    ['Rank', 'Lever', 'Est. Annual Recovery ({CC})', 'Effort', 'Timeline'],
                xlsLeversTotalLabel: 'Total Recovery Potential',
                xlsLeversPayback:    'Payback Period',
                xlsScenariosTitle:   'Scenario Comparison',
                xlsScenariosHeaders: ['Metric', 'A — No Action', 'B — Targeted Investment', 'C — Full Automation (80%)'],
                xlsScenariosRows: [
                    ['Total Debt ({CC})',       null, null, null],
                    ['CAPEX Investment ({CC})', null, null, null],
                    ['Net Recovery ({CC})',     null, null, null],
                    ['Payback Period (mo)', null, null, null],
                ],
                xlsDoraTitle:    'DORA Benchmark Context',
                xlsDoraHeaders:  ['Metric', 'Your Value', 'DORA Band (Reference)', 'Your Classification'],
                xlsDoraRows: [
                    ['Lead Time (hrs)',         null, 'Elite <1h · High <24h · Medium <168h · Low >168h', null],
                    ['Manual Effort (%)',        null, 'Elite <5% · High <15% · Medium <30% · Low >30%',   null],
                    ['Human Errors / Quarter',  null, 'Elite 0 · High ≤1 · Medium ≤3 · Low >3',            null],
                ],
                xlsSheetInputs:   'Inputs',
                xlsSheetResults:  'Financial Results',
                xlsSheetLevers:   'Top 3 Levers',
                xlsSheetScenarios:'Scenarios',
                xlsSheetDora:     'DORA Benchmark',
                // ── Methodology & Sources (EN) ──
                methodologyTitle:              'Methodology & Sources',
                methodologyFormulaLabel:       'Formula:',
                methodologyAssumptionsLabel:   'Assumptions:',
                methodologySourceLabel:        'Source:',
                methodologyWasteTitle:         '1. Annual OPEX Waste',
                methodologyWasteAssumptions:   '1,800 productive hours per engineer per year — derived from U.S. Bureau of Labor Statistics American Time Use Survey (2024), which reports full-time employees average 8.1 hours on workdays, and OECD data (2024) calculating ~1,811 actual hours worked per US worker annually after accounting for paid leave, holidays, and sick time.',
                methodologyWasteSource:        'BLS American Time Use Survey 2024 (bls.gov); OECD Average Annual Hours Actually Worked 2024 (oecd.org).',
                methodologyRiskTitle:          '2. Risk Exposure',
                methodologyRiskSource:         'Standard actuarial risk exposure formula (probability × impact) consistent with COSO Enterprise Risk Management framework (2017) and NIST Special Publication 800-30 Rev. 1 — Guide for Conducting Risk Assessments.',
                methodologyOppTitle:           '3. Pipeline Margin Erosion',
                methodologyOppFactor1:         'Reflects the portion of pipeline project margin conservatively estimated as eroded during the first year of delay due to competitive response, customer churn, or SLA penalties. No single authoritative study isolates this fraction; 0.25 is a conservative floor.',
                methodologyOppFactor2:         'Accounts for compounding pipeline effects — each delayed project pushes downstream work, multiplying total cost. Exepron ("The True Cost of Delay," 2026) demonstrates that a pipeline cascade multiplier can reach 6× where multiple projects share dependent resources. This tool applies 1.5× as a conservative minimum.',
                methodologyOppSource:          'Exepron — "The True Cost of Delay" (2026). exepron.com.',
                methodologyCascadeTitle:      '4. Cascade Impact',
                methodologyLeverTitle:         '5. Lever Recovery Rates',
                methodologyLeverColLever:      'Lever',
                methodologyLeverColRate:       'Rate',
                methodologyLeverColSource:     'Source',
                methodologyLeverAutomation:    'Process Automation',
                methodologyLeverAutomationSrc: 'GitLab Forrester Total Economic Impact Study (July 2024): 483% ROI, 400% improvement in developer productivity, 305 hrs/yr saved per developer via testing automation. about.gitlab.com. CircleCI State of Software Delivery 2025/2026: 59% throughput increase driven by automation.',
                methodologyLeverRisk:          'Risk & Incident Reduction',
                methodologyLeverRiskSrc:       'DPR Solutions ServiceNow CMDB Implementation Case Study (2025): 43% MTTR reduction. BMC Helix Discovery Forrester TEI Study: 20% MTTR improvement. Device42 CMDB: 30% faster root-cause identification. Composite: a well-run CMDB + Auto-Discovery programme eliminates ~60% of the premium.',
                methodologyLeverInnovation:    'Innovation Runway',
                methodologyLeverInnovationSrc: 'DORA Accelerate State of DevOps Report 2024 (Google Cloud): teams practising continuous delivery with loosely-coupled architectures achieve 40% higher organisational performance. Conservative midpoint estimate.',
                methodologyLeverMgmt:          'Management Efficiency',
                methodologyLeverMgmtSrc:       'PanDev Metrics (2026): 42% of engineering coding time lost to context switching. TheTab 2025 research: 40% productivity loss, $450B/yr globally, 23 min recovery per interruption. Gerald Weinberg, Quality Software Management (1992): 3 concurrent projects = 40% overhead. These studies establish context-switching loss at 15–40%; the conservative 15% is applied to management coordination overhead.',
                methodologyLeverTurnover:      'Retention & Burnout',
                methodologyLeverTurnoverSrc:   'SHRM Foundation — "Retaining Talent" (2025): total cost of replacing an employee ranges from 50% to 200% of annual salary. SHRM 2025 Benchmarking Reports confirm cost-per-hire averages $5,475 (nonexecutive) and $35,879 (executive). The 30% recovery reflects the portion of turnover cost deemed preventable by reducing manual-toil burnout.',
                methodologyTurnoverTitle:      '6. Turnover Cost Model',
                methodologyTurnoverAssumptions:'Uses your actual Team Size and Blended Rate (Q6) multiplied by 2,000 annual hours (SHRM framework). The $150/hr and 50-engineer defaults are no longer hardcoded — the model reads your diagnostic inputs in real time.',
                methodologyTurnoverSource:     'SHRM Foundation — "Retaining Talent: A Guide to Analyzing and Managing Employee Turnover" (2025 update). SHRM 2025 Benchmarking Reports, shrm.org/benchmarking.',
                methodologyDoraTitle:          '7. DORA Benchmark Thresholds',
                methodologyDoraBody:           'The four software delivery performance clusters (Elite, High, Medium, Low) correspond to the 2024 Accelerate State of DevOps Report published by Google Cloud\'s DORA team. Lead time thresholds: Elite <1 day, High 1 day–1 week, Medium 1 week–1 month, Low >1 month. Deployment frequency: Elite On-demand, High daily–weekly, Medium weekly–monthly, Low monthly–biannually. Note: DORA\'s four official metrics are Deployment Frequency, Lead Time for Changes, Change Failure Rate, and Failed Deployment Recovery Time. The manual-effort and human-error mappings in this tool are an adaptation, not official DORA categories.',
                methodologyDoraSource:         'Google Cloud DORA — Accelerate State of DevOps Report 2024. dora.dev/research/2024/dora-report/',
                methodologyFxTitle:            '8. Exchange Rates',
                methodologyFxBody:             'Live mid rates are fetched from Narodowy Bank Polski (NBP) Table A via api.nbp.pl on page load. Fallback rates if the API is unavailable: 1 USD = 0.87 EUR / 3.67 PLN / 0.75 GBP.',
                methodologyFxSource:         'Narodowy Bank Polski — Table A mid exchange rates. api.nbp.pl.',
                methodologyTotalTitle:       '9. Total Debt Impact',
                methodologyTotalFormula:     'OPEX Waste + Risk Exposure + Pipeline Margin Erosion + Cascade Impact',
                methodologyTotalNote:        'Pipeline Margin Erosion (cOppDirect) is a one-time estimate reflecting margin lost in the first year of delay. All other components recur annually. Cascade Impact is proportional to OPEX Waste — reducing manual waste automatically reduces cascade costs.',
                methodologyTotalSource:      'Economic model synthesised from BLS ATUS (2024), OECD Annual Hours (2024), Exepron "True Cost of Delay" (2026), COSO ERM (2017), and SHRM Retention Framework (2025).',
                methodologyFooter:           'Methodology references last updated July 2026. All estimates labelled "tool estimate" should be calibrated against your organisation\'s own data for greatest accuracy.',
                nbpFooter:        (date) => `NBP exchange rates table A (as of ${date})`,
                nbpUnavailable:   'NBP exchange rates table A (unavailable — using fallback rates)',
            },
            pl: {
                navSubtitle:      'Silnik Efektywności Procesów IT i Strategii Finansowej',
                exportBtn:        'EKSPORTUJ RAPORT STRATEGICZNY (PDF)',
                exportGenerating: 'Generowanie PDF…',
                phase1Title:      'Faza 1: Strategiczny Kwestionariusz Diagnostyczny',
                q1label:  '1. Wysiłek Manualny (%)',
                q1desc:   'Jaki procent pojemności sprintu jest pochłaniany przez powtarzalne zadania manualne, takie jak wdrożenia, testy regresji lub konfiguracja środowisk?',
                q2label:  '2. Czas Realizacji (godz.)',
                q2desc:   'Jaki jest średni „Czas Realizacji" jednej zmiany, mierzony od zgłoszenia lub commita do wdrożenia produkcyjnego?',
                q3label:  '3. Standard Dokumentacji (1–5)',
                q3desc:   'Czy organizacja utrzymuje jednolity standard dokumentacji procesów, czy wiedza kluczowa jest rozproszona w silosach?',
                q3min:    '1 — Fragmentaryczna',
                q3max:    '5 — Zunifikowana',
                q4label:  '4. Koszt Przestoju ({C}/h)',
                q4desc:   'Jaka jest szacowana strata przychodów lub kara operacyjna za godzinę awarii krytycznego systemu biznesowego?',
                q5label:  '5. Błędy Ludzkie / Kwartał',
                q5desc:   'Ile incydentów produkcyjnych lub wycofań zmian w ostatnim kwartale było bezpośrednio spowodowanych błędami ludzkimi?',
                q6label:  '6. Stawka Łączona ({C}/h)',
                q6desc:   'Jaki jest średni koszt godzinowy (stawka łączona) inżyniera, uwzględniając wynagrodzenie brutto, benefity, sprzęt i koszty ogólne?',
                q7label:  '7. Narzut Zarządzania (godz./mies.)',
                q7desc:   'Ile godzin miesięcznie menedżerowie poświęcają na koordynację i „gonienie ludzi" z powodu silosowych procesów?',
                q8label:  '8. Marża Szans ({C})',
                q8desc:   'Jaka jest prognozowana marża brutto z nowych projektów lub funkcji, które są opóźnione z powodu długu technicznego lub procesowego?',
                q9label:  '9. Wąskie Gardło Skalowalności (1–5)',
                q9desc:   'Wpływ na zdolność do skalowania wzrostu?',
                q10label: '10. Rotacja Pracowników (%)',
                q10desc:  'Jaki jest roczny wskaźnik rotacji w zespołach przeciążonych manualną, powtarzalną pracą (wskaźnik wypalenia)?',
                q11label: '11. MTTR ({C})',
                q11desc:  'Jaki jest średni czas (w godzinach) przywracania krytycznej usługi po awarii produkcyjnej (Mean Time To Repair)?',
                simTitle:       'Parametry Inwestycji i Symulacji',
                autoLabel:      'Docelowy Poziom Automatyzacji (%)',
                efficiencyGain: 'Wzrost Efektywności',
                teamSizeLabel:  'Liczba Inżynierów',
                teamSizeHelper: 'Łączna liczba inżynierów dotkniętych długiem procesowym.',
                capexLabel:     'Jednorazowa Inwestycja CAPEX ({C})',
                capexHelper:    'Licencje, wdrożenie i koszty szkoleń.',
                statWasteLabel:   'Roczne Marnotrawstwo OPEX',
                statRiskLabel:    'Ekspozycja na Ryzyko',
                statOppLabel:     'Erozja Marży Pipeline',
                statCascadeLabel: 'Efekt Kaskadowy',
                statTotalLabel:   'Całkowity Wpływ Długu',
                statNetLabel:   'Dług Netto po Inwestycji',
                statNetHelper:  'Całkowity wpływ minus CAPEX',
                formulaWaste: '(Godz. manualne/rok + Godz. koordynacji/rok) × Stawka łączona × Liczba inżynierów',
                formulaRisk:  'Roczne awarie × MTTR × Koszt przestoju/godz. × (Poziom ryzyka / 5)',
                formulaOpp:     '(Marża szans × 0,25)',
                formulaCascade: 'Marnotrawstwo OPEX × 1,5 (mnożnik kaskady pipeline)',
                formulaTotal:   'Marnotrawstwo OPEX + Ekspozycja na ryzyko + Erozja Marży Pipeline + Efekt Kaskadowy',
                formulaNet:   'Całkowity wpływ długu − Inwestycja CAPEX',
                chart1Title: '1. Wodospad: Erozja Pojemności',
                chart1Sub:   'godz. / rok',
                chart2Title: '2. Most Długu Strategicznego',
                chart2Sub:   'finanse ({C})',
                chart3Title: '3. Mapa Ryzyka',
                chart3Sub:   'analiza przesunięcia',
                execTitle:    'Podsumowanie Wykonawcze i Dźwignie',
                execSubtitle: 'Rekomendacje strategiczne na podstawie danych diagnostycznych.',
                block6Title:    'Podsumowanie Wykonawcze — 3 Główne Dźwignie Finansowe',
                block6Subtitle: 'Posortowane według szacowanej odzyskiwalnej wartości · aktualizowane w czasie rzeczywistym',
                chartWaterfallLabels: ['Maks. Pojemność', 'Praca Manualna', 'Gonienie Silosów', 'Dostarczona Wartość'],
                chartBridgeLabels:    ['Marnotrawstwo OPEX', 'Inwestycja CAPEX', 'Zysk Netto Rok 1'],
                chartCurrentState:    'Stan Obecny',
                chartTargetState:     'Stan Docelowy',
                chartEffortAxis:      'Wyciek Wysiłku %',
                chartRiskAxis:        'Poziom Ryzyka',
                recAutomation: (val) => `<strong style="color:var(--red)">Dźwignia Automatyzacji:</strong> Wysoki narzut manualny. Portal samoobsługowy może odzyskać <strong>${formatCurrency(val)}</strong> kosztów pracy.`,
                recRisk:        () => `<strong style="color:var(--orange)">Dźwignia Ryzyka:</strong> Krytyczna ekspozycja na ryzyko. Auto-Discovery (CMDB) skraca MTTR i chroni przychody.`,
                recInnovation: (val) => `<strong style="color:var(--purple)">Dźwignia Innowacji:</strong> Zaległości blokują roadmapę. Ich usunięcie odblokowuje <strong>${formatCurrency(val)}</strong> marży projektowej.`,
                recVerdict:    (pb)  => `Werdykt Finansowy: Zwrot z inwestycji w ciągu — ${pb} miesięcy.`,
                leverAutomationTitle:  'Automatyzacja Procesów',
                leverAutomationDetail: (pct) => `Automatyzacja ${pct}% manualnej pracy w sprincie za pomocą pipeline'ów CI/CD i portali samoobsługowych eliminuje powtarzalne zadania i przyspiesza dostarczanie.`,
                leverRiskTitle:        'Redukcja Ryzyka i Incydentów',
                leverRiskDetail:       () => `Wdrożenie Auto-Discovery i CMDB skraca MTTR o nawet 60%, bezpośrednio chroniąc przychody narażone na awarie.`,
                leverInnovationTitle:  'Przestrzeń na Innowacje',
                leverInnovationDetail: () => `Likwidacja zaległości technicznych zwalnia pojemność inżynieryjną dla nowych produktów, odblokowując wartość roadmapy zablokowaną przez legacy.`,
                leverMgmtTitle:        'Efektywność Zarządzania',
                leverMgmtDetail:       () => `Redukcja narzutu koordynacyjnego przez wspólne narzędzia i dashboardy odzyskuje drogie godziny menedżerów na pracę strategiczną.`,
                leverTurnoverTitle:    'Retencja i Wypalenie',
                leverTurnoverDetail:   () => `Zmniejszenie powtarzalnych zadań manualnych obniża rotację spowodowaną wypaleniem. Każdy zatrzymany inżynier oszczędza ~2× roczne wynagrodzenie na kosztach rekrutacji.`,
                effortLow:    'Niski',
                effortMedium: 'Średni',
                effortHigh:   'Wysoki',
                effortLabel:  'Wysiłek',
                rankLabels:   ['#1 Najwyższe ROI', '#2 Szybki Zysk', '#3 Strategiczna'],
                estRecovery:  'szacowane roczne odzyski',
                verdictRecoveryLabel: 'Łączny Potencjał Odzysku (Top 3)',
                verdictPaybackLabel:  'Zwrot z Inwestycji',
                verdictPaybackUnit:   'miesięcy',
                verdictNote: 'Priorytetyzacja 3 powyższych dźwigni zapewnia najszybszą drogę do ROI. Zacznij od elementów o najniższym wysiłku, aby zbudować momentum przed podjęciem inicjatyw strategicznych.',
                roadmapTitle:    'Wygenerowany Plan Dostawy 90-Dniowy',
                roadmapPhase1:   'Faza 1 — Miesiąc 1',
                roadmapPhase1Sub:'Fundamenty i Szybkie Zwycięstwa',
                roadmapPhase2:   'Faza 2 — Miesiąc 2–3',
                roadmapPhase2Sub:'Główna Implementacja',
                roadmapPhase3:   'Faza 3 — Miesiąc 4–6',
                roadmapPhase3Sub:'Skalowanie i Optymalizacja',
                // Roadmap tasks — automation (PL)
                rmAutomation_p1: ['Zinwentaryzuj ręczne etapy wdrożeń', 'Zdefiniuj schemat pipeline\'u CI/CD', 'Wyznacz top 5 kandydatów do automatyzacji', 'Ustal bazowy pomiar czasu cyklu'],
                rmAutomation_p2: ['Wdróż pierwszy automatyczny pipeline', 'Uruchom MVP portalu samoobsługowego', 'Zautomatyzuj zestaw testów regresji', 'Zintegruj z systemem ticketów'],
                rmAutomation_p3: ['Rozszerz automatyzację na 80% procesów', 'Zmierz redukcję czasu cyklu', 'Opublikuj raport ROI automatyzacji', 'Przeszkol wszystkie zespoły z nowych pipeline\'ów'],
                // Roadmap tasks — risk (PL)
                rmRisk_p1: ['Zinwentaryzuj wszystkie systemy produkcyjne', 'Zdefiniuj schemat CMDB i właścicieli', 'Zmapuj zasięg awarii krytycznych', 'Ustal bazowy wskaźnik MTTR'],
                rmRisk_p2: ['Wdróż narzędzie Auto-Discovery', 'Ustaw progi alertów i runbooki', 'Przeprowadź pierwsze ćwiczenie Game Day', 'Zintegruj dashboardy monitoringu'],
                rmRisk_p3: ['Osiągnij pełne pokrycie CMDB', 'Przeprowadź przegląd redukcji MTTR', 'Zautomatyzuj przepływy reagowania na incydenty', 'Opublikuj kartę wyników pozycji ryzyka'],
                // Roadmap tasks — innovation (PL)
                rmInnovation_p1: ['Priorytetyzuj zaległości techniczne', 'Zmapuj elementy roadmapy zablokowane przez dług', 'Oszacuj uwolnioną pojemność na kwartał', 'Uzgodnij kolejność priorytetów z interesariuszami'],
                rmInnovation_p2: ['Wycofaj 3 najważniejsze zależności legacy', 'Dostarcz pierwszą odłożoną funkcję roadmapy', 'Ustal wytyczne zapobiegania długowi', 'Śledź odzysk szans tygodniowo'],
                rmInnovation_p3: ['Osiągnij redukcję zaległości o 50%+', 'Uruchom 2 nowe funkcje generujące przychód', 'Ustaw kwartalny cykl przeglądu długu', 'Raportuj zyskaną przestrzeń na innowacje'],
                // Roadmap tasks — mgmt (PL)
                rmMgmt_p1: ['Przeprowadź ankietę bólu koordynacyjnego wśród menedżerów', 'Zmapuj punkty zapalne silosów', 'Oceń opcje wspólnych narzędzi', 'Zdefiniuj kartę komunikacji między zespołami'],
                rmMgmt_p2: ['Wdróż wspólne dashboardy i wiki', 'Ustal cotygodniowe spotkania cross-teamowe', 'Zredukuj spotkania koordynacyjne o 30%', 'Pilotuj wewnętrzną dokumentację open-source'],
                rmMgmt_p3: ['Zmierz odzyskane godziny menedżerów', 'Wdróż narzędzia w całej organizacji', 'Opublikuj benchmarki efektywności', 'Świętuj osiągnięte kamienie milowe'],
                // Roadmap tasks — turnover (PL)
                rmTurnover_p1: ['Przeprowadź ankietę ryzyka wypalenia w zespołach', 'Zidentyfikuj najbardziej uciążliwe procesy', 'Porównaj rotację z branżą', 'Zdefiniuj KPI retencji'],
                rmTurnover_p2: ['Wyeliminuj 3 główne źródła uciążliwości', 'Uruchom program doświadczeń inżynierskich', 'Przeprowadź audyt sprawiedliwości dyżurów', 'Zaoferuj ścieżki mobilności wewnętrznej'],
                rmTurnover_p3: ['Śledź miesięczny wskaźnik rotacji', 'Oblicz oszczędności z retencji', 'Rozszerz program na całą inżynierię', 'Opublikuj raport kultury i zdrowia organizacji'],
                doraTitle:    'Kontekst Benchmarku DORA',
                doraSubtitle: 'Gdzie są Twoje dane vs. badania branżowe',
                doraMetricLeadTime:   'Czas Realizacji',
                doraMetricManual:     'Wysiłek Manualny',
                doraMetricErrors:     'Błędy Ludzkie (kwartalnie)',
                doraBandElite:  'Elita',
                doraBandHigh:   'Wysoki',
                doraBandMedium: 'Średni',
                doraBandLow:    'Niski',
                doraLeadTimeDesc:  (v) => `${v} godz.`,
                doraManualDesc:    (v) => `${v}%`,
                doraErrorsDesc:    (v) => `${v} incydentów`,
                doraLeadTimeBand:  'Elita <1h · Wysoki <24h · Średni <168h · Niski >168h',
                doraManualBand:    'Elita <5% · Wysoki <15% · Średni <30% · Niski >30%',
                doraErrorsBand:    'Elita 0 · Wysoki ≤1 · Średni ≤3 · Niski >3',
                // Scenario comparison
                scenarioTitle:       'Porównanie Scenariuszy Inwestycyjnych',
                scenarioSubtitle:    'Trzy ścieżki strategiczne — ten sam dług, różne rezultaty',
                scenarioATitle:      'Brak Działań',
                scenarioADesc:       'Status quo. Brak inwestycji, brak automatyzacji.',
                scenarioBTitle:      'Celowana Inwestycja',
                scenarioBDesc:       'Obecny poziom automatyzacji z aktualnym budżetem CAPEX.',
                scenarioCTitle:      'Pełna Automatyzacja (80%)',
                scenarioCDesc:       'Maksymalna zalecana automatyzacja ze skalowanym CAPEX.',
                scenRecommended:     'ZALECANE',
                scenLabelDebt:       'Całkowity Dług',
                scenLabelInvestment: 'Inwestycja (CAPEX)',
                scenLabelNet:        'Odzysk Netto',
                scenLabelPayback:    'Okres Zwrotu',
                scenMonths:          'miesięcy',
                scenInfinity:        '∞ Brak zwrotu',
                scenNoInvestment:    'Brak inwestycji',
                copyLinkBtn:         '⧉ KOPIUJ LINK',
                exportExcelBtn:      '⬇ EKSPORTUJ DO EXCEL',
                exportExcelGenerating: '⏳ GENEROWANIE...',
                xlsInputsTitle:      'Process Debt Engine — Dane Wejściowe Diagnostyki',
                xlsGenerated:        'Wygenerowano',
                xlsInputsHeaders:    ['#', 'Pytanie', 'Wartość', 'Jednostka'],
                xlsInputsRows: [
                    ['Q1',  'Wysiłek Manualny',                   null, '%'           ],
                    ['Q2',  'Czas Realizacji',                    null, 'godz.'       ],
                    ['Q3',  'Standard Dokumentacji (1–5)',        null, '/5'          ],
                    ['Q4',  'Koszt Przestoju',                    null, '{C}/godz.'   ],
                    ['Q5',  'Błędy Ludzkie / Kwartał',           null, 'incydenty'   ],
                    ['Q11', 'MTTR',                              null, 'godz.'       ],
                    ['Q6',  'Stawka Łączona',                    null, '{C}/godz.'   ],
                    ['Q7',  'Narzut Zarządzania',                null, 'godz./mies.' ],
                    ['Q8',  'Marża Szans',                       null, '{C}'         ],
                    ['Q9',  'Wąskie Gardło Skalowalności (1–5)', null, '/5'          ],
                    ['Q10', 'Rotacja Pracowników',                null, '%/rok'       ],
                ],
                xlsSimParamsTitle:   'Parametry Symulacji',
                xlsAutoLevel:        'Docelowy Poziom Automatyzacji',
                xlsTeamSize:         'Liczba Inżynierów',
                xlsTeamSizeUnit:     'inżynierów',
                xlsCapex:            'Jednorazowa Inwestycja CAPEX',
                xlsResultsTitle:     'Process Debt Engine — Wyniki Finansowe',
                xlsResultsHeaders:   ['Metryka', 'Formuła', 'Wartość ({CC})'],
                xlsResultsRows: [
                    ['Roczne Marnotrawstwo OPEX',      '(Godz. manualne/rok + Godz. koordynacji/rok) × Stawka × Zespół', null],
                    ['Ekspozycja na Ryzyko',            'Roczne awarie × MTTR × Koszt przestoju/godz. × (Ryzyko/5)',      null],
                    ['Erozja Marży Pipeline',           'Marża szans × 0,25',                                             null],
                    ['Efekt Kaskadowy',                 'Marnotrawstwo OPEX × 1,5 (mnożnik kaskady)',                     null],
                    ['Całkowity Wpływ Długu',           'OPEX + Ryzyko + Erozja + Kaskada',                               null],
                    ['Inwestycja CAPEX',                'Dane użytkownika',                                                null],
                    ['Dług Netto po Inwestycji',        'Całkowity wpływ − CAPEX',                                        null],
                    ['Potencjalne Roczne Oszczędności', '(Marnotrawstwo OPEX + Ryzyko) × Poziom Automatyzacji',          null],
                    ['Okres Zwrotu',                    'CAPEX / (Miesięczne Oszczędności)',                               null],
                ],
                xlsResultsMonths:    'miesięcy',
                xlsLeversTitle:      'Top 3 Dźwigni Finansowych (posortowane wg szacowanego rocznego odzysku)',
                xlsLeversHeaders:    ['Pozycja', 'Dźwignia', 'Szac. Roczny Odzysk ({CC})', 'Wysiłek', 'Harmonogram'],
                xlsLeversTotalLabel: 'Łączny Potencjał Odzysku',
                xlsLeversPayback:    'Okres Zwrotu',
                xlsScenariosTitle:   'Porównanie Scenariuszy',
                xlsScenariosHeaders: ['Metryka', 'A — Brak Działań', 'B — Celowana Inwestycja', 'C — Pełna Automatyzacja (80%)'],
                xlsScenariosRows: [
                    ['Całkowity Dług ({CC})',   null, null, null],
                    ['Inwestycja CAPEX ({CC})', null, null, null],
                    ['Odzysk Netto ({CC})',     null, null, null],
                    ['Okres Zwrotu (mies.)', null, null, null],
                ],
                xlsDoraTitle:    'Kontekst Benchmarku DORA',
                xlsDoraHeaders:  ['Metryka', 'Twoja Wartość', 'Pasmo DORA (Odniesienie)', 'Twoja Klasyfikacja'],
                xlsDoraRows: [
                    ['Czas Realizacji (godz.)', null, 'Elita <1h · Wysoki <24h · Średni <168h · Niski >168h', null],
                    ['Wysiłek Manualny (%)',    null, 'Elita <5% · Wysoki <15% · Średni <30% · Niski >30%',   null],
                    ['Błędy Ludzkie / Kwartał',null, 'Elita 0 · Wysoki ≤1 · Średni ≤3 · Niski >3',            null],
                ],
                xlsSheetInputs:    'Dane Wejściowe',
                xlsSheetResults:   'Wyniki Finansowe',
                xlsSheetLevers:    'Top 3 Dźwignie',
                xlsSheetScenarios: 'Scenariusze',
                xlsSheetDora:      'Benchmark DORA',
                // ── Methodology & Sources (PL) ──
                methodologyTitle:              'Metodologia i Źródła',
                methodologyFormulaLabel:       'Wzór:',
                methodologyAssumptionsLabel:   'Założenia:',
                methodologySourceLabel:        'Źródło:',
                methodologyWasteTitle:         '1. Roczne Marnotrawstwo OPEX',
                methodologyWasteAssumptions:   '1 800 godzin produktywnych na inżyniera rocznie — na podstawie badania American Time Use Survey 2024 (U.S. Bureau of Labor Statistics), które podaje, że pełnoetatowi pracownicy pracują średnio 8,1 godziny dziennie, oraz danych OECD (2024) obliczających ~1 811 faktycznie przepracowanych godzin rocznie po uwzględnieniu urlopów, świąt i zwolnień lekarskich.',
                methodologyWasteSource:        'BLS American Time Use Survey 2024 (bls.gov); OECD Average Annual Hours Actually Worked 2024 (oecd.org).',
                methodologyRiskTitle:          '2. Ekspozycja na Ryzyko',
                methodologyRiskSource:         'Standardowy wzór na ekspozycję na ryzyko aktuarialne (prawdopodobieństwo × wpływ) zgodny z ramami COSO Enterprise Risk Management (2017) i NIST Special Publication 800-30 Rev. 1 — Guide for Conducting Risk Assessments.',
                methodologyOppTitle:           '3. Erozja Marży Pipeline',
                methodologyOppFactor1:         'Odzwierciedla część marży projektowej, która według konserwatywnych szacunków ulega erozji w pierwszym roku opóźnienia z powodu reakcji konkurencji, utraty klientów lub kar SLA. Żadne pojedyncze autorytatywne badanie nie określa tego ułamka; 0,25 to konserwatywne minimum.',
                methodologyOppFactor2:         'Uwzględnia kaskadowe efekty w pipeline — każdy opóźniony projekt przesuwa pracę w dół strumienia, mnożąc całkowity koszt. Exepron ("The True Cost of Delay," 2026) pokazuje, że mnożnik kaskady może osiągnąć 6×, gdy wiele projektów współdzieli zasoby. To narzędzie stosuje 1,5× jako konserwatywne minimum.',
                methodologyOppSource:          'Exepron — "The True Cost of Delay" (2026). exepron.com.',
                methodologyCascadeTitle:      '4. Efekt Kaskadowy',
                methodologyLeverTitle:         '5. Współczynniki Dźwigni',
                methodologyLeverColLever:      'Dźwignia',
                methodologyLeverColRate:       'Współczynnik',
                methodologyLeverColSource:     'Źródło',
                methodologyLeverAutomation:    'Automatyzacja Procesów',
                methodologyLeverAutomationSrc: 'GitLab Forrester Total Economic Impact Study (lipiec 2024): 483% ROI, 400% wzrost produktywności deweloperów, 305 godz./rok zaoszczędzonych na automatyzacji testów. about.gitlab.com. CircleCI State of Software Delivery 2025/2026: 59% wzrost przepustowości dzięki automatyzacji.',
                methodologyLeverRisk:          'Redukcja Ryzyka i Incydentów',
                methodologyLeverRiskSrc:       'DPR Solutions ServiceNow CMDB Case Study (2025): 43% redukcja MTTR. BMC Helix Discovery Forrester TEI: 20% poprawa MTTR. Device42 CMDB: 30% szybsza identyfikacja przyczyn źródłowych. Złożenie: dobrze zarządzany CMDB + Auto-Discovery eliminuje ~60% składek ryzyka.',
                methodologyLeverInnovation:    'Przestrzeń na Innowacje',
                methodologyLeverInnovationSrc: 'DORA Accelerate State of DevOps Report 2024 (Google Cloud): zespoły stosujące ciągłe dostarczanie z luźno powiązanymi architekturami osiągają 40% wyższą wydajność organizacyjną. Konserwatywna estymacja środkowa.',
                methodologyLeverMgmt:          'Efektywność Zarządzania',
                methodologyLeverMgmtSrc:       'PanDev Metrics (2026): 42% czasu programistów tracone na przełączanie kontekstu. TheTab 2025: 40% utrata produktywności, 450 mld $/r globalnie, 23 min odzysku na przerwę. Gerald Weinberg, Quality Software Management (1992): 3 projekty równocześnie = 40% narzutu. Konserwatywne 15% zastosowane do narzutu koordynacji zarządzania.',
                methodologyLeverTurnover:      'Retencja i Wypalenie',
                methodologyLeverTurnoverSrc:   'SHRM Foundation — "Retaining Talent" (2025): całkowity koszt zastąpienia pracownika wynosi od 50% do 200% rocznego wynagrodzenia. SHRM 2025 Benchmarking Reports: średni koszt zatrudnienia to $5 475 (niekierowniczy) i $35 879 (kierowniczy). 30% odzysku odzwierciedla część kosztów rotacji możliwą do uniknięcia poprzez redukcję wypalenia spowodowanego pracą manualną.',
                methodologyTurnoverTitle:      '6. Model Kosztów Rotacji',
                methodologyTurnoverAssumptions:'Wykorzystuje rzeczywistą liczbę członków zespołu oraz stawkę godzinową (Q6) pomnożone przez 2 000 godzin rocznych (ramy SHRM). Domyślne wartości $150/godz. i 50 inżynierów nie są już sztywno zakodowane — model odczytuje dane diagnostyczne w czasie rzeczywistym.',
                methodologyTurnoverSource:     'SHRM Foundation — "Retaining Talent: A Guide to Analyzing and Managing Employee Turnover" (aktualizacja 2025). SHRM 2025 Benchmarking Reports, shrm.org/benchmarking.',
                methodologyDoraTitle:          '7. Progi Benchmarku DORA',
                methodologyDoraBody:           'Cztery klastry wydajności dostarczania oprogramowania (Elita, Wysoki, Średni, Niski) odpowiadają raportowi Accelerate State of DevOps 2024 opublikowanemu przez zespół DORA Google Cloud. Progi czasu realizacji: Elita <1 dzień, Wysoki 1 dzień–1 tydzień, Średni 1 tydzień–1 miesiąc, Niski >1 miesiąc. Częstotliwość wdrożeń: Elita na żądanie, Wysoki codziennie–tygodniowo, Średni tygodniowo–miesięcznie, Niski miesięcznie–półrocznie. Uwaga: cztery oficjalne metryki DORA to częstotliwość wdrożeń, czas realizacji zmian, wskaźnik awaryjności zmian i czas odtworzenia po awarii. Mapowanie wysiłku manualnego i błędów ludzkich w tym narzędziu jest adaptacją, a nie oficjalnymi kategoriami DORA.',
                methodologyDoraSource:         'Google Cloud DORA — Accelerate State of DevOps Report 2024. dora.dev/research/2024/dora-report/',
                methodologyFxTitle:            '8. Kursy Walut',
                methodologyFxBody:             'Kursy średnie są pobierane z tabeli A Narodowego Banku Polskiego (NBP) przez api.nbp.pl przy ładowaniu strony. Kursy zastępcze w przypadku braku API: 1 USD = 0,87 EUR / 3,67 PLN / 0,75 GBP.',
                methodologyFxSource:           'Narodowy Bank Polski — Tabela A kursów średnich. api.nbp.pl.',
                methodologyTotalTitle:         '9. Łączny Wpływ Długu',
                methodologyTotalFormula:       'OPEX Waste + Risk Exposure + Pipeline Margin Erosion + Cascade Impact',
                methodologyTotalNote:          'Pipeline Margin Erosion (cOppDirect) to szacunek jednorazowy — marża utracona w pierwszym roku opóźnienia. Pozostałe składniki są cykliczne rocznie. Cascade Impact jest proporcjonalny do OPEX Waste — redukcja strat manualnych automatycznie obniża koszty kaskadowe.',
                methodologyTotalSource:        'Model ekonomiczny zsyntetyzowany z BLS ATUS (2024), OECD Annual Hours (2024), Exepron "True Cost of Delay" (2026), COSO ERM (2017) i SHRM Retention Framework (2025).',
                methodologyFooter:             'Źródła metodologiczne aktualizowane w lipcu 2026. Wszystkie szacunki oznaczone "tool estimate" należy skalibrować na podstawie danych własnej organizacji dla największej dokładności.',
                nbpFooter:         (date) => `Kursy walut NBP tabela A (z dnia ${date})`,
                nbpUnavailable:    'Kursy walut NBP tabela A (niedostępna — użyto kursów zastępczych)',
            }
        };

        let currentLang = 'en';
        let currentCurrency = 'USD';
        let nbpDate = null;
        const EXCHANGE_RATES = { USD: 1, EUR: 0.87, PLN: 3.67, GBP: 0.75 };
        const CURRENCY_SYMBOLS = { USD: '$', EUR: '€', PLN: 'zł', GBP: '£' };

        /* ── Centralised financial coefficients ───────────────────────────────────
           All hardcoded multipliers, rates, and thresholds live in one place so
           they are auditable, documented, and not duplicated across functions.
           Sources referenced where available.
        ─────────────────────────────────────────────────────────────────────── */
        const COEFFICIENTS = {
            // ── Annualised conversions ──
            ANNUAL_HOURS_PER_ENGINEER: 1800,   // BLS ATUS 2024 / OECD (~1,811 rounded)
            MONTHS_PER_YEAR:           12,
            QUARTERS_PER_YEAR:         4,

            // ── Opportunity & Cascade ──
            PIPELINE_EROSION_RATE:     0.25,   // conservative floor — Exepron 2026
            CASCADE_MULTIPLIER:        1.5,    // conservative minimum — Exepron 2026

            // ── Scenario C thresholds ──
            SCEN_C_AUTO_LEVEL:         0.8,    // 80 % full automation
            SCEN_C_CAPEX_MULTIPLIER:   1.5,    // +50 % CAPEX for full automation

            // ── Lever recovery rates ──
            LEVER_AUTOMATION:          0.3,    // Forrester TEI GitLab Jul 2024
            LEVER_RISK:                0.6,    // CMDB case studies composite
            LEVER_INNOVATION:          0.5,    // DORA 2024 midpoint
            LEVER_MANAGEMENT:          0.15,   // Context-switch studies (PanDev 2026)
            LEVER_TURNOVER:            0.3,    // SHRM Foundation 2025

            // ── Turnover default annual hours ──
            TURNOVER_REF_HOURS:        2000,   // hrs/yr (SHRM framework)

            // ── Risk normalisation ──
            RISK_SCALE_MAX:            5,      // q9 is 1–5 scale

            // ── Payback colour thresholds (months) ──
            PAYBACK_GREEN:             24,
            PAYBACK_YELLOW:            48,

            // ── Automation — share of manual work that is automatable ──
            AUTOMATABLE_SHARE:         0.6,    // 60% — cited in DevOps literature

            // ── Risk heatmap — target-state risk reduction ──
            TARGET_RISK_REDUCTION:     0.5,    // 50% reduction post-automation

            // ── Recommendation gate thresholds ──
            REC_AUTO_MIN_WASTE:        100000, // $
            REC_RISK_MIN_EXPOSURE:     50000,  // $
            REC_INNOVATION_MIN:        150000, // $
        };

        /* ── XSS guard ──────────────────────────────────────────────────────────
           esc() escapes the five HTML-special characters before any string-typed
           translation value is interpolated into an innerHTML template.
           Numeric values (toLocaleString, toFixed) are inherently safe and do
           not need escaping.  SVG icon literals are also excluded — they are
           hardcoded constants, not user or translation input.
           This closes the innerHTML XSS pattern flagged in Round 12 audit.
        ─────────────────────────────────────────────────────────────────────── */
        function esc(str) {
            return String(str)
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&#39;');
        }

        function t(key) {
            let val = TRANSLATIONS[currentLang][key] ?? TRANSLATIONS.en[key] ?? key;
            if (typeof val === 'string') {
                val = val.replace('{C}', CURRENCY_SYMBOLS[currentCurrency])
                         .replace('{CC}', currentCurrency);
            }
            return val;
        }

        function applyTranslations() {
            document.querySelectorAll('[data-i18n]').forEach(el => {
                const key = el.getAttribute('data-i18n');
                const val = t(key);
                if (val && typeof val === 'string') el.textContent = val;
            });
            document.querySelectorAll('[data-i18n-formula]').forEach(el => {
                const key = el.getAttribute('data-i18n-formula');
                const val = t(key);
                if (val && typeof val === 'string') {
                    el.setAttribute('data-formula', val);
                    el.setAttribute('aria-label', 'Formula: ' + val);
                }
            });
            document.documentElement.lang = currentLang;
        }

        function toggleLang() {
            currentLang = currentLang === 'en' ? 'pl' : 'en';
            const btn = document.getElementById('langBtn');
            document.getElementById('langFlag').textContent = currentLang === 'en' ? '🇵🇱' : '🇬🇧';
            document.getElementById('langLabel').textContent = currentLang === 'en' ? 'PL' : 'EN';
            applyTranslations();
            updateSliderFills();
            calculate(); // re-render dynamic content (charts labels, levers, rec engine)
            const footerEl = document.getElementById('nbpFooter');
            if (footerEl) {
                const t = TRANSLATIONS[currentLang];
                footerEl.textContent = nbpDate
                    ? t.nbpFooter(new Date(nbpDate).toLocaleDateString(currentLang === 'pl' ? 'pl-PL' : 'en-US'))
                    : t.nbpUnavailable;
            }
        }

        function formatCurrency(amountUSD) {
            const converted = amountUSD * EXCHANGE_RATES[currentCurrency];
            const locale = currentLang === 'pl' ? 'pl-PL' : 'en-US';
            return new Intl.NumberFormat(locale, {
                style: 'currency',
                currency: currentCurrency,
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            }).format(converted);
        }

        function usdToCurrency(amountUSD) {
            return amountUSD * EXCHANGE_RATES[currentCurrency];
        }

        function currencyToUsd(amount) {
            return amount / EXCHANGE_RATES[currentCurrency];
        }

        function toggleCurrency(currency) {
            if (currency === currentCurrency) return;
            const prevCurrency = currentCurrency;
            const monetaryIds = ['q4', 'q6', 'q8', 'capex'];
            const prevRate = EXCHANGE_RATES[prevCurrency];
            const newRate = EXCHANGE_RATES[currency];
            monetaryIds.forEach(id => {
                const el = document.getElementById(id);
                if (el) {
                    const valInPrev = parseFloat(el.value) || 0;
                    const valInUSD = valInPrev / prevRate;
                    const valInNew = valInUSD * newRate;
                    el.value = (Math.round(valInNew * 100) / 100).toFixed(2);
                }
            });
            currentCurrency = currency;
            document.getElementById('currencySelect').value = currency;
            applyTranslations();
            calculate();
            const footerEl = document.getElementById('nbpFooter');
            if (footerEl) {
                const t = TRANSLATIONS[currentLang];
                footerEl.textContent = nbpDate
                    ? t.nbpFooter(new Date(nbpDate).toLocaleDateString(currentLang === 'pl' ? 'pl-PL' : 'en-US'))
                    : t.nbpUnavailable;
            }
        }

        // ═══════════════════════════════════════════════════════════════
        // Chart colour palette (warm theme)
        // ═══════════════════════════════════════════════════════════════
        const DARK = {
            text:   '#4A3F35',
            grid:   'rgba(214,201,184,0.4)',
            red:    '#DC2626',
            orange: '#EA580C',
            amber:  '#D97706',
            green:  '#16A34A',
            cyan:   '#0891B2',
            blue:   '#2563EB',
            purple: '#7C3AED',
            navy:   '#D6C9B8',
        };

        

        let waterfallChart, bridgeChart, heatmapChart;

        function updateSliderFills() {
            // Cross-browser fix: directly set the width of the .slider-track-fill
            // overlay div instead of updating a CSS custom property on the input.
            // Firefox does not reliably repaint input backgrounds when custom
            // properties change, so the old --val gradient approach was broken there.
            function setSliderFill(inputId, fillId, min, max) {
                const input = document.getElementById(inputId);
                const fill  = document.getElementById(fillId);
                if (!input || !fill) return;
                const pct = ((input.value - min) / (max - min) * 100).toFixed(1) + '%';
                fill.style.width = pct;
            }
            setSliderFill('q3',        'q3Fill',        1, 5);
            setSliderFill('q9',        'q9Fill',        1, 5);
            setSliderFill('autoLevel', 'autoLevelFill', 0, 100);
        }

        function calculate() {
            const manualPercent  = clamp('q1');
            const downCost       = currencyToUsd(clamp('q4'));
            const failures       = clamp('q5') * COEFFICIENTS.QUARTERS_PER_YEAR;
            const mttr           = clamp('q11');
            const rate           = currencyToUsd(clamp('q6'));
            const managerHrs     = clamp('q7');
            const opportunityVal = currencyToUsd(clamp('q8'));
            const riskLevel      = clamp('q9');
            const capex          = currencyToUsd(clamp('capex'));
            const autoLevel      = clamp('autoLevel') / 100;
            const teamSize       = clamp('teamSize');

            document.getElementById('autoLevelVal').textContent = Math.round(autoLevel * 100);

            const totalAnnualHrs   = COEFFICIENTS.ANNUAL_HOURS_PER_ENGINEER;
            const manualAnnualHrs  = totalAnnualHrs * (manualPercent / 100);
            const chasingAnnualHrs = managerHrs * COEFFICIENTS.MONTHS_PER_YEAR;

            const cWaste     = (manualAnnualHrs + chasingAnnualHrs) * rate * teamSize;
            const cRisk      = (failures * mttr * downCost) * (riskLevel / COEFFICIENTS.RISK_SCALE_MAX);
            const cOppDirect = opportunityVal * COEFFICIENTS.PIPELINE_EROSION_RATE;
            const cCascade   = cWaste * COEFFICIENTS.CASCADE_MULTIPLIER;

            const totalImpact = cWaste + cRisk + cOppDirect + cCascade;
            const netDebt     = totalImpact - capex;

            const potentialSavings = (cWaste + cRisk) * autoLevel;
            // Guard: floor monthly savings at $1 to prevent IEEE 754 underflow
            // producing Infinity when potentialSavings is a subnormal positive float.
            const paybackMonths    = potentialSavings > 0
                ? capex / Math.max(1, potentialSavings / 12)
                : Infinity;

            document.getElementById('statWaste').textContent   = formatCurrency(cWaste);
            document.getElementById('statRisk').textContent    = formatCurrency(cRisk);
            document.getElementById('statOpp').textContent     = formatCurrency(cOppDirect);
            document.getElementById('statCascade').textContent = formatCurrency(cCascade);
            document.getElementById('totalImpact').textContent = formatCurrency(totalImpact);
            document.getElementById('statNet').textContent     = formatCurrency(netDebt);
            document.getElementById('q9Val').textContent       = document.getElementById('q9').value;
            document.getElementById('q3Val').textContent       = document.getElementById('q3').value;

            // Update slider track fill (overlay div width approach — works in all browsers)
            updateSliderFills();

            updateCharts(totalAnnualHrs, manualAnnualHrs, chasingAnnualHrs, cWaste, capex, potentialSavings, riskLevel, manualPercent, autoLevel);
            updateRecs(cWaste, cRisk, cOppDirect, cCascade, paybackMonths);
            updateDoraBenchmark();
            updateScenarios(cWaste, cRisk, cCascade, capex, autoLevel, totalImpact);
        }

        const CHART_OPTS = {
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
                x: { grid: { color: DARK.grid }, ticks: { color: DARK.text } },
                y: { grid: { color: DARK.grid }, ticks: { color: DARK.text } }
            }
        };

        function updateCharts(total, manual, chase, waste, capex, savings, risk, effort, auto) {
            const valDelivery = total - manual - chase;
            const L = TRANSLATIONS[currentLang];

            const sizeCanvas = (id) => {
                const c = document.getElementById(id);
                const p = c.parentElement;
                c.width = p.clientWidth || 300;
                c.height = p.clientHeight || 200;
            };
            sizeCanvas('waterfallChart');
            const ctx1 = document.getElementById('waterfallChart').getContext('2d');
            if (waterfallChart) waterfallChart.destroy();
            waterfallChart = new Chart(ctx1, {
                type: 'bar',
                data: {
                    labels: L.chartWaterfallLabels,
                    datasets: [{
                        data: [total, -manual, -chase, valDelivery],
                        backgroundColor: [DARK.navy, DARK.red, DARK.orange, DARK.green],
                        borderRadius: 6, borderSkipped: false
                    }]
                },
                options: { ...CHART_OPTS, indexAxis: 'y' }
            });

            sizeCanvas('bridgeChart');
            const ctx2 = document.getElementById('bridgeChart').getContext('2d');
            if (bridgeChart) bridgeChart.destroy();
            bridgeChart = new Chart(ctx2, {
                type: 'bar',
                data: {
                    labels: L.chartBridgeLabels,
                    datasets: [{
                        data: [waste, -capex, (waste * auto) - capex],
                        backgroundColor: [DARK.red, DARK.cyan, DARK.green],
                        borderRadius: 6, borderSkipped: false
                    }]
                },
                options: { ...CHART_OPTS }
            });

            sizeCanvas('heatmapChart');
            const ctx3 = document.getElementById('heatmapChart').getContext('2d');
            if (heatmapChart) heatmapChart.destroy();
            heatmapChart = new Chart(ctx3, {
                type: 'scatter',
                data: {
                    datasets: [
                        { label: L.chartCurrentState, data: [{x: effort, y: risk}], backgroundColor: DARK.red, pointRadius: 14, pointHoverRadius: 18 },
                        { label: L.chartTargetState,  data: [{x: effort*(1-auto), y: risk * COEFFICIENTS.TARGET_RISK_REDUCTION}], backgroundColor: DARK.green, pointRadius: 14, pointHoverRadius: 18 }
                    ]
                },
                options: {
                    maintainAspectRatio: false,
                    plugins: { legend: { display: true, labels: { color: DARK.text, usePointStyle: true, pointStyleWidth: 10 } } },
                    scales: {
                        x: { min: 0, max: 100, grid: { color: DARK.grid }, ticks: { color: DARK.text }, title: { display: true, text: L.chartEffortAxis, color: DARK.text } },
                        y: { min: 0, max: 5,   grid: { color: DARK.grid }, ticks: { color: DARK.text }, title: { display: true, text: L.chartRiskAxis,  color: DARK.text } }
                    }
                }
            });
        }

        function updateRecs(cw, cr, co, cc, pb) {
            const L = TRANSLATIONS[currentLang];

            // ── Block 5: compact rec list ────────────────────────────────────
            const engine = document.getElementById('recEngine');
            let html = `<ul class="list-disc ml-5 space-y-2">`;
            if (cw > COEFFICIENTS.REC_AUTO_MIN_WASTE)  html += `<li>${L.recAutomation(Math.round(cw * COEFFICIENTS.LEVER_AUTOMATION))}</li>`;
            if (cr > COEFFICIENTS.REC_RISK_MIN_EXPOSURE) html += `<li>${L.recRisk()}</li>`;
            if (co + cc > COEFFICIENTS.REC_INNOVATION_MIN) html += `<li>${L.recInnovation(Math.round((co + cc) * COEFFICIENTS.LEVER_INNOVATION))}</li>`;
            html += `<li class="mt-3 p-3 font-bold italic" style="background:var(--accent-dim);border-left:4px solid var(--accent);color:var(--accent);border-radius:0 6px 6px 0;">${esc(L.recVerdict(!isFinite(pb) || pb <= 0 ? L.scenInfinity : (pb < 1 ? '< 1' : pb.toFixed(1))))}</li>`;
            engine.innerHTML = html + `</ul>`;

            // ── Block 6: Top 3 Financial Levers ─────────────────────────────
            const ICONS = {
                automation: `<svg style="width:20px;height:20px" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><circle cx="12" cy="12" r="3"/></svg>`,
                risk:       `<svg style="width:20px;height:20px" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>`,
                innovation: `<svg style="width:20px;height:20px" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>`,
                mgmt:       `<svg style="width:20px;height:20px" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0"/></svg>`,
                turnover:   `<svg style="width:20px;height:20px" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>`,
            };

            const turnover     = parseFloat(document.getElementById('q10').value) || 0;
            const manualPct    = parseFloat(document.getElementById('q1').value)  || 0;
            const teamSize     = parseFloat(document.getElementById('teamSize').value) || 1;
            const rate         = currencyToUsd(parseFloat(document.getElementById('q6').value) || 0);
            const turnoverCost = (turnover / 100) * teamSize * rate * COEFFICIENTS.TURNOVER_REF_HOURS;

            const effortMap = {
                [L.effortLow]:    'var(--green)',
                [L.effortMedium]: 'var(--amber)',
                [L.effortHigh]:   'var(--red)',
            };

            const levers = [
                { key:'automation', title: L.leverAutomationTitle, recovery: Math.round(cw * COEFFICIENTS.LEVER_AUTOMATION),  effort: L.effortMedium, timeline: '2–4 ' + L.verdictPaybackUnit, color:'var(--red)',    icon: ICONS.automation, detail: L.leverAutomationDetail(Math.round(manualPct * COEFFICIENTS.AUTOMATABLE_SHARE)) },
                { key:'risk',       title: L.leverRiskTitle,       recovery: Math.round(cr * COEFFICIENTS.LEVER_RISK),        effort: L.effortLow,    timeline: '1–2 ' + L.verdictPaybackUnit, color:'var(--orange)', icon: ICONS.risk,       detail: L.leverRiskDetail() },
                { key:'innovation', title: L.leverInnovationTitle, recovery: Math.round((co + cc) * COEFFICIENTS.LEVER_INNOVATION), effort: L.effortHigh, timeline: '3–6 ' + L.verdictPaybackUnit, color:'var(--purple)', icon: ICONS.innovation, detail: L.leverInnovationDetail() },
                { key:'mgmt',       title: L.leverMgmtTitle,       recovery: Math.round(cw * COEFFICIENTS.LEVER_MANAGEMENT), effort: L.effortLow,    timeline: '1 '   + L.verdictPaybackUnit,  color:'var(--cyan)',   icon: ICONS.mgmt,       detail: L.leverMgmtDetail() },
                { key:'turnover',   title: L.leverTurnoverTitle,   recovery: Math.round(turnoverCost * COEFFICIENTS.LEVER_TURNOVER), effort: L.effortMedium,timeline: '3–5 ' + L.verdictPaybackUnit, color:'var(--green)',  icon: ICONS.turnover,   detail: L.leverTurnoverDetail() },
            ];

            levers.sort((a, b) => b.recovery - a.recovery);
            const top3 = levers.slice(0, 3);
            const totalRecovery = top3.reduce((s, l) => s + l.recovery, 0);
            const rankLabels = L.rankLabels;

            // Generate roadmap for top 3 levers
            updateRoadmap(top3);

            let cards = '';
            top3.forEach((l, i) => {
                const badgeColor = effortMap[l.effort] || 'var(--green)';
                cards += `
                <div style="background:var(--bg-elevated);border:1px solid var(--border);border-top:3px solid ${l.color};border-radius:10px;padding:1.1rem;display:flex;flex-direction:column;gap:0.6rem;">
                    <div style="display:flex;align-items:center;gap:8px;">
                        <span style="color:${l.color}">${l.icon}</span>
                        <span style="font-size:0.6rem;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:${l.color};">${esc(rankLabels[i])}</span>
                    </div>
                    <p style="font-family:'Space Grotesk',sans-serif;font-size:0.85rem;font-weight:700;color:var(--text-primary);margin:0;">${esc(l.title)}</p>
                    <p style="font-size:1.6rem;font-weight:900;color:${l.color};margin:0;line-height:1;">${formatCurrency(l.recovery)}</p>
                    <p style="font-size:0.6rem;color:var(--text-muted);margin:0;">${esc(L.estRecovery)}</p>
                    <p style="font-size:0.7rem;color:var(--text-secondary);line-height:1.4;margin:0;">${esc(l.detail)}</p>
                    <div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:auto;padding-top:6px;">
                        <span style="font-size:0.58rem;font-weight:700;padding:2px 8px;border-radius:999px;background:var(--bg-input);color:${badgeColor};border:1px solid ${badgeColor};">${esc(L.effortLabel)}: ${esc(l.effort)}</span>
                        <span style="font-size:0.58rem;font-weight:700;padding:2px 8px;border-radius:999px;background:var(--bg-input);color:var(--text-secondary);border:1px solid var(--border);">⏱ ${esc(l.timeline)}</span>
                    </div>
                </div>`;
            });
            document.getElementById('leverCards').innerHTML = cards;

            document.getElementById('verdictBar').innerHTML = `
                <div style="display:flex;flex-wrap:wrap;justify-content:space-between;align-items:center;gap:1rem;">
                    <div>
                        <p style="font-size:0.65rem;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:var(--accent);margin:0 0 4px;">${esc(L.verdictRecoveryLabel)}</p>
                        <p style="font-size:1.5rem;font-weight:900;color:var(--text-primary);margin:0;">${formatCurrency(totalRecovery)}</p>
                    </div>
                    <div style="text-align:right;">
                        <p style="font-size:0.65rem;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:var(--accent);margin:0 0 4px;">${esc(L.verdictPaybackLabel)}</p>
                        <p style="font-size:1.5rem;font-weight:900;color:var(--text-primary);margin:0;">${!isFinite(pb) || pb <= 0 ? esc(L.scenInfinity) : (pb < 1 ? '< 1' : pb.toFixed(1))} ${esc(L.verdictPaybackUnit)}</p>
                    </div>
                    <div style="flex:1;min-width:200px;">
                        <p style="font-size:0.7rem;color:var(--text-secondary);margin:0;font-style:italic;">${esc(L.verdictNote)}</p>
                    </div>
                </div>`;
        }

        // ═══════════════════════════════════════════════════════════════
        // 90-Day Roadmap
        // ═══════════════════════════════════════════════════════════════
        function getRoadmapTasks() {
            const L = TRANSLATIONS[currentLang];
            return {
                automation: {
                    phase1: L.rmAutomation_p1,
                    phase2: L.rmAutomation_p2,
                    phase3: L.rmAutomation_p3,
                },
                risk: {
                    phase1: L.rmRisk_p1,
                    phase2: L.rmRisk_p2,
                    phase3: L.rmRisk_p3,
                },
                innovation: {
                    phase1: L.rmInnovation_p1,
                    phase2: L.rmInnovation_p2,
                    phase3: L.rmInnovation_p3,
                },
                mgmt: {
                    phase1: L.rmMgmt_p1,
                    phase2: L.rmMgmt_p2,
                    phase3: L.rmMgmt_p3,
                },
                turnover: {
                    phase1: L.rmTurnover_p1,
                    phase2: L.rmTurnover_p2,
                    phase3: L.rmTurnover_p3,
                },
            };
        }

        function updateRoadmap(top3) {
            const L  = TRANSLATIONS[currentLang];
            const MAX_PER_PHASE = 4;
            const ROADMAP_TASKS = getRoadmapTasks();

            // Collect merged tasks for each phase from top3 levers (in rank order)
            const phases = ['phase1', 'phase2', 'phase3'];
            const merged = { phase1: [], phase2: [], phase3: [] };

            top3.forEach(lever => {
                const tasks = ROADMAP_TASKS[lever.key];
                if (!tasks) return;
                phases.forEach(ph => {
                    tasks[ph].forEach(task => {
                        if (merged[ph].length < MAX_PER_PHASE) {
                            merged[ph].push({ task, color: lever.color });
                        }
                    });
                });
            });

            const phasesMeta = [
                { id: 'phase1', titleKey: 'roadmapPhase1', subKey: 'roadmapPhase1Sub', accent: 'var(--accent)'  },
                { id: 'phase2', titleKey: 'roadmapPhase2', subKey: 'roadmapPhase2Sub', accent: 'var(--purple)' },
                { id: 'phase3', titleKey: 'roadmapPhase3', subKey: 'roadmapPhase3Sub', accent: 'var(--green)'  },
            ];

            let html = '';
            phasesMeta.forEach(meta => {
                const tasks = merged[meta.id];
                const taskRows = tasks.map(({ task, color }) =>
                    `<li style="display:flex;align-items:flex-start;gap:6px;margin-bottom:0.45rem;">
                        <span style="color:${color};font-size:0.75rem;line-height:1.4;flex-shrink:0;">☐</span>
                        <span style="font-size:0.72rem;color:var(--text-secondary);line-height:1.4;">${esc(task)}</span>
                    </li>`
                ).join('');

                html += `
                <div style="background:var(--bg-elevated);border:1px solid var(--border);border-top:3px solid ${meta.accent};border-radius:var(--radius-md);padding:1rem;">
                    <p style="font-family:'Space Grotesk',sans-serif;font-size:0.62rem;font-weight:800;text-transform:uppercase;letter-spacing:0.1em;color:${meta.accent};margin:0 0 2px;">${esc(L[meta.titleKey])}</p>
                    <p style="font-family:'Space Grotesk',sans-serif;font-size:0.8rem;font-weight:700;color:var(--text-primary);margin:0 0 0.75rem;">${esc(L[meta.subKey])}</p>
                    <ul style="list-style:none;margin:0;padding:0;">${taskRows || '<li style="font-size:0.72rem;color:var(--text-muted);">No tasks for selected levers.</li>'}</ul>
                </div>`;
            });

            document.getElementById('roadmapGrid').innerHTML = html;
        }

        // ═══════════════════════════════════════════════════════════════
        // DORA Benchmark helpers
        // ═══════════════════════════════════════════════════════════════
        function getDoraBand(metric, value) {
            const L = TRANSLATIONS[currentLang];
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
        }

        function updateScenarios(cWaste, cRisk, cCascade, capex, autoLevel, totalImpact) {
            const L = TRANSLATIONS[currentLang];
            const fmt = (n) => formatCurrency(Math.abs(n));

            // Helper: compute net recovery and payback for a given autoLevel + capex
            function scenCalc(al, cx) {
                const savings = (cWaste + cRisk + cCascade) * al;
                const net     = savings - cx;
                const pb      = savings > 0 ? (cx / (savings / COEFFICIENTS.MONTHS_PER_YEAR)) : Infinity;
                return { savings, net, pb };
            }

            const scenA = scenCalc(0,    0);
            const scenB = scenCalc(autoLevel, capex);
            const scenC = scenCalc(COEFFICIENTS.SCEN_C_AUTO_LEVEL,  capex * COEFFICIENTS.SCEN_C_CAPEX_MULTIPLIER);

            function netColor(val) { return val >= 0 ? 'var(--green)' : 'var(--red)'; }
            function netSign(val)  { return val >= 0 ? '+' : '-'; }
            function pbStr(pb) {
                if (!isFinite(pb) || pb <= 0) return L.scenInfinity;
                if (pb < 1) return '< 1 ' + L.scenMonths;
                return pb.toFixed(1) + ' ' + L.scenMonths;
            }
            function pbColor(pb) {
                if (!isFinite(pb) || pb <= 0) return 'var(--red)';
                if (pb < COEFFICIENTS.PAYBACK_GREEN) return 'var(--green)';
                if (pb < COEFFICIENTS.PAYBACK_YELLOW) return 'var(--yellow)';
                return 'var(--orange)';
            }

            function scenCard({ title, desc, accentColor, capexAmt, calcResult, showBadge, badgeText }) {
                const recColor = netColor(calcResult.net);
                const pb       = calcResult.pb;
                const recLabel = calcResult.net >= 0 ? `${netSign(calcResult.net)}${fmt(calcResult.net)}` : `-${fmt(calcResult.net)}`;
                const badgeHtml = showBadge
                    ? `<span style="display:inline-block;font-size:0.55rem;font-weight:800;padding:2px 8px;border-radius:999px;border:1px solid ${accentColor};color:${accentColor};letter-spacing:0.1em;text-transform:uppercase;margin-bottom:4px;">${esc(badgeText)}</span>`
                    : '';

                return `
                <div style="
                    background:var(--bg-elevated);
                    border:1px solid var(--border);
                    border-top:3px solid ${accentColor};
                    border-radius:var(--radius-lg);
                    padding:1.2rem;
                    display:flex;
                    flex-direction:column;
                    gap:0.7rem;
                    position:relative;
                    overflow:hidden;
                    transition:box-shadow 0.2s;
                ">
                    <div style="position:absolute;top:0;left:0;right:0;height:40px;background:linear-gradient(to bottom,${accentColor}10,transparent);pointer-events:none;border-radius:var(--radius-lg) var(--radius-lg) 0 0;"></div>
                    <div>
                        ${badgeHtml}
                        <p style="font-family:'Space Grotesk',sans-serif;font-size:0.85rem;font-weight:800;color:var(--text-primary);margin:0;text-transform:uppercase;letter-spacing:-0.01em;">${esc(title)}</p>
                        <p style="font-size:0.62rem;color:var(--text-muted);margin:3px 0 0;line-height:1.4;">${esc(desc)}</p>
                    </div>
                    <div style="border-top:1px solid var(--border-subtle);padding-top:0.7rem;display:flex;flex-direction:column;gap:0.55rem;">
                        <div style="display:flex;justify-content:space-between;align-items:baseline;">
                            <span style="font-size:0.6rem;font-weight:700;text-transform:uppercase;letter-spacing:0.07em;color:var(--text-muted);">${esc(L.scenLabelDebt)}</span>
                            <span style="font-size:1rem;font-weight:900;color:var(--red);font-family:'Space Grotesk',sans-serif;">${fmt(totalImpact)}</span>
                        </div>
                        <div style="display:flex;justify-content:space-between;align-items:baseline;">
                            <span style="font-size:0.6rem;font-weight:700;text-transform:uppercase;letter-spacing:0.07em;color:var(--text-muted);">${esc(L.scenLabelInvestment)}</span>
                            <span style="font-size:0.85rem;font-weight:700;color:var(--accent);">${capexAmt > 0 ? fmt(capexAmt) : esc(L.scenNoInvestment)}</span>
                        </div>
                        <div style="display:flex;justify-content:space-between;align-items:baseline;">
                            <span style="font-size:0.6rem;font-weight:700;text-transform:uppercase;letter-spacing:0.07em;color:var(--text-muted);">${esc(L.scenLabelNet)}</span>
                            <span style="font-size:1.05rem;font-weight:900;color:${recColor};font-family:'Space Grotesk',sans-serif;">${calcResult.savings <= 0 ? '—' : recLabel}</span>
                        </div>
                        <div style="display:flex;justify-content:space-between;align-items:baseline;border-top:1px dashed var(--border-subtle);padding-top:0.5rem;margin-top:0.1rem;">
                            <span style="font-size:0.6rem;font-weight:700;text-transform:uppercase;letter-spacing:0.07em;color:var(--text-muted);">${esc(L.scenLabelPayback)}</span>
                            <span style="font-size:1rem;font-weight:900;color:${pbColor(pb)};font-family:'Space Grotesk',sans-serif;">${esc(pbStr(pb))}</span>
                        </div>
                    </div>
                </div>`;
            }

            const isRecommendedB = isFinite(scenB.pb) && scenB.pb < COEFFICIENTS.PAYBACK_GREEN && autoLevel > 0;
            const isRecommendedC = !isRecommendedB && isFinite(scenC.pb) && scenC.pb < COEFFICIENTS.PAYBACK_GREEN;

            document.getElementById('scenarioGrid').innerHTML =
                scenCard({
                    title: L.scenarioATitle, desc: L.scenarioADesc,
                    accentColor: 'var(--red)', capexAmt: 0,
                    calcResult: scenA, showBadge: false, badgeText: ''
                }) +
                scenCard({
                    title: L.scenarioBTitle, desc: L.scenarioBDesc,
                    accentColor: 'var(--accent)', capexAmt: capex,
                    calcResult: scenB, showBadge: isRecommendedB, badgeText: L.scenRecommended
                }) +
                scenCard({
                    title: L.scenarioCTitle, desc: L.scenarioCDesc,
                    accentColor: 'var(--green)', capexAmt: capex * 1.5,
                    calcResult: scenC, showBadge: isRecommendedC, badgeText: L.scenRecommended
                });

            encodeState();
        }

        function updateDoraBenchmark() {
            const L = TRANSLATIONS[currentLang];
            const q1 = clamp('q1');
            const q2 = clamp('q2');
            const q5 = clamp('q5');

            const rows = [
                {
                    metric:   L.doraMetricLeadTime,
                    value:    L.doraLeadTimeDesc(q2),
                    bandDesc: L.doraLeadTimeBand,
                    result:   getDoraBand('leadTime', q2),
                },
                {
                    metric:   L.doraMetricManual,
                    value:    L.doraManualDesc(q1),
                    bandDesc: L.doraManualBand,
                    result:   getDoraBand('manual', q1),
                },
                {
                    metric:   L.doraMetricErrors,
                    value:    L.doraErrorsDesc(q5),
                    bandDesc: L.doraErrorsBand,
                    result:   getDoraBand('errors', q5),
                },
            ];

            const tbody = document.getElementById('doraTableBody');
            tbody.innerHTML = rows.map((r, i) => `
                <tr style="border-bottom:1px solid var(--border-subtle);${i % 2 === 0 ? 'background:var(--bg-elevated);' : ''}">
                    <td style="padding:0.65rem 0.75rem;font-size:0.75rem;font-weight:600;color:var(--text-primary);">${esc(r.metric)}</td>
                    <td style="padding:0.65rem 0.75rem;font-size:0.75rem;font-family:'Space Grotesk',sans-serif;font-weight:700;color:var(--accent);">${esc(r.value)}</td>
                    <td style="padding:0.65rem 0.75rem;font-size:0.6rem;color:var(--text-muted);line-height:1.5;">${esc(r.bandDesc)}</td>
                    <td style="padding:0.65rem 0.75rem;">
                        <span class="dora-badge" style="color:${r.result.color};border-color:${r.result.color};">${esc(r.result.band)}</span>
                    </td>
                </tr>
            `).join('');
        }

        function exportExcel() {
            const btn = document.getElementById('exportExcelBtn');
            btn.disabled = true;
            btn.textContent = t('exportExcelGenerating');

            setTimeout(() => {
                try {
                    const L  = TRANSLATIONS[currentLang];
                    const wb = XLSX.utils.book_new();

                    // ── helpers ──────────────────────────────────────────────
                    // clamp() reads each field and enforces the same HASH_CONSTRAINTS
                    // bounds used by calculate() — prevents Infinity / NaN in cells.
                    // q2, q3 are display-only in this export but still clamped for
                    // consistency (they appear verbatim in the Inputs sheet).

                    // sanitizeCell — defence-in-depth against Excel formula injection.
                    // Any string starting with =, +, -, @, tab, or CR is prefixed
                    // with a single quote so Excel treats it as literal text.
                    const sanitizeCell = v =>
                        typeof v === 'string' && /^[=+\-@\t\r]/.test(v) ? "'" + v : v;

                    // sanitizeSheetData — recursively walk array-of-arrays and
                    // sanitize every leaf cell.
                    const sanitizeSheetData = data =>
                        data.map(row => Array.isArray(row)
                            ? row.map(cell => sanitizeCell(cell))
                            : sanitizeCell(row));

                    // ── raw inputs ───────────────────────────────────────────
                    const q1  = clamp('q1'),  q2  = clamp('q2'),  q3  = clamp('q3'),
                          q4  = currencyToUsd(clamp('q4')),
                          q5  = clamp('q5'),
                          q11 = clamp('q11'),
                          q6  = currencyToUsd(clamp('q6')),
                          q7  = clamp('q7'),
                          q8  = currencyToUsd(clamp('q8')),
                          q9  = clamp('q9'),
                          q10 = clamp('q10');
                    const autoLvl  = clamp('autoLevel') / 100;
                    const capex    = currencyToUsd(clamp('capex'));
                    const teamSize = clamp('teamSize');

                    // ── derived financials ───────────────────────────────────
                    const manualAnnualHrs = COEFFICIENTS.ANNUAL_HOURS_PER_ENGINEER * (q1 / 100);
                    const chasingAnnualHrs= q7 * COEFFICIENTS.MONTHS_PER_YEAR;
                    const annualFailures  = q5 * COEFFICIENTS.QUARTERS_PER_YEAR;

                    const mttr       = q11;
                    const cWaste     = (manualAnnualHrs + chasingAnnualHrs) * q6 * teamSize;
                    const cRisk      = (annualFailures * mttr * q4) * (q9 / COEFFICIENTS.RISK_SCALE_MAX);
                    const cOppDirect = q8 * COEFFICIENTS.PIPELINE_EROSION_RATE;
                    const cCascade   = cWaste * COEFFICIENTS.CASCADE_MULTIPLIER;
                    const totalImpact = cWaste + cRisk + cOppDirect + cCascade;
                    const netDebt     = totalImpact - capex;
                    const potSavings  = (cWaste + cRisk) * autoLvl;
                    const paybackMo   = potSavings > 0
                        ? capex / Math.max(1, potSavings / COEFFICIENTS.MONTHS_PER_YEAR)
                        : Infinity;

                    // ── turnover / lever calcs (Bug 2 fix: use L for titles & effort) ──
                    const turnoverCost = (q10 / 100) * teamSize * q6 * COEFFICIENTS.TURNOVER_REF_HOURS;
                    const leversRaw = [
                        { title: L.leverAutomationTitle, recovery: Math.round(cWaste * COEFFICIENTS.LEVER_AUTOMATION), effort: L.effortMedium, timeline: '2–4 mo' },
                        { title: L.leverRiskTitle,        recovery: Math.round(cRisk  * COEFFICIENTS.LEVER_RISK),       effort: L.effortLow,    timeline: '1–2 mo' },
                        { title: L.leverInnovationTitle,  recovery: Math.round((cOppDirect + cCascade) * COEFFICIENTS.LEVER_INNOVATION), effort: L.effortHigh, timeline: '3–6 mo' },
                        { title: L.leverMgmtTitle,        recovery: Math.round(cWaste * COEFFICIENTS.LEVER_MANAGEMENT), effort: L.effortLow,  timeline: '1 mo'   },
                        { title: L.leverTurnoverTitle,    recovery: Math.round(turnoverCost * COEFFICIENTS.LEVER_TURNOVER), effort: L.effortMedium, timeline: '3–5 mo' },
                    ];
                    leversRaw.sort((a, b) => b.recovery - a.recovery);
                    const top3 = leversRaw.slice(0, 3);
                    const totalRecovery = top3.reduce((s, l) => s + l.recovery, 0);

                    // ── scenario calcs ───────────────────────────────────────
                    const scenA_net  = totalImpact;
                    const scenB_sav  = (cWaste + cRisk + cCascade) * autoLvl;
                    const scenB_net  = scenB_sav - capex;
                    const scenB_pb   = scenB_sav > 0 ? (capex / (scenB_sav / COEFFICIENTS.MONTHS_PER_YEAR)) : Infinity;
                    const scenC_sav  = (cWaste + cRisk + cCascade) * COEFFICIENTS.SCEN_C_AUTO_LEVEL;
                    const scenC_cap  = capex * COEFFICIENTS.SCEN_C_CAPEX_MULTIPLIER;
                    const scenC_net  = scenC_sav - scenC_cap;
                    const scenC_pb   = scenC_sav > 0 ? (scenC_cap / (scenC_sav / COEFFICIENTS.MONTHS_PER_YEAR)) : Infinity;

                    // ── DORA band classification (uses translated band labels) ──
                    const doraBandFn = (metric, val) => {
                        const bands = { elite: L.doraBandElite, high: L.doraBandHigh, medium: L.doraBandMedium, low: L.doraBandLow };
                        if (metric === 'leadTime')
                            return val < 1 ? bands.elite : val < 24 ? bands.high : val < 168 ? bands.medium : bands.low;
                        if (metric === 'manual')
                            return val < 5 ? bands.elite : val < 15 ? bands.high : val < 30 ? bands.medium : bands.low;
                        return val === 0 ? bands.elite : val <= 1 ? bands.high : val <= 3 ? bands.medium : bands.low;
                    };

                    // ── Sheet 1: Inputs (Bug 1 fix: all labels from L) ───────
                    const inputQValues = [q1, q2, q3, q4, q5, q11, q6, q7, q8, q9, q10];
                    const inputsData = [
                        [L.xlsInputsTitle],
                        [L.xlsGenerated, new Date().toLocaleString()],
                        [],
                        L.xlsInputsHeaders,
                        ...L.xlsInputsRows.map((row, i) => [row[0], row[1], inputQValues[i], row[3]]),
                        [],
                        [L.xlsSimParamsTitle],
                        [L.xlsAutoLevel,  autoLvl * 100, '%'              ],
                        [L.xlsTeamSize,   teamSize,       L.xlsTeamSizeUnit],
                        [L.xlsCapex,      capex,          currentCurrency              ],
                    ];
                    const wsInputs = XLSX.utils.aoa_to_sheet(sanitizeSheetData(inputsData));
                    wsInputs['!cols'] = [{wch:6},{wch:38},{wch:18},{wch:14}];
                    XLSX.utils.book_append_sheet(wb, wsInputs, L.xlsSheetInputs);

                    // ── Sheet 2: Financial Results ───────────────────────────
                    const resultValues = [
                        Math.round(cWaste), Math.round(cRisk), Math.round(cOppDirect), Math.round(cCascade),
                        Math.round(totalImpact), Math.round(capex), Math.round(netDebt),
                        Math.round(potSavings), isFinite(paybackMo) ? Math.round(paybackMo * 10) / 10 : L.scenInfinity,
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

                    // ── Sheet 3: Top 3 Financial Levers ─────────────────────
                    const leversData = [
                        [L.xlsLeversTitle],
                        [],
                        L.xlsLeversHeaders,
                        ...top3.map((l, i) => [L.rankLabels[i], l.title, l.recovery, l.effort, l.timeline]),
                        [],
                        [L.xlsLeversTotalLabel, '', totalRecovery, '', ''],
                        [L.xlsLeversPayback,    '', isFinite(paybackMo) ? Math.round(paybackMo * 10) / 10 : L.scenInfinity, '', L.xlsResultsMonths],
                    ];
                    const wsLevers = XLSX.utils.aoa_to_sheet(sanitizeSheetData(leversData));
                    wsLevers['!cols'] = [{wch:22},{wch:32},{wch:28},{wch:12},{wch:14}];
                    XLSX.utils.book_append_sheet(wb, wsLevers, L.xlsSheetLevers);

                    // ── Sheet 4: Scenario Comparison ─────────────────────────
                    const scenValues = [
                        [Math.round(scenA_net), Math.round(totalImpact), Math.round(totalImpact)],
                        [0,                     Math.round(capex),       Math.round(scenC_cap)  ],
                        [0,                     Math.round(scenB_net),   Math.round(scenC_net)  ],
                        ['∞',
                         isFinite(scenB_pb) ? Math.round(scenB_pb * 10)/10 : '∞',
                         isFinite(scenC_pb) ? Math.round(scenC_pb * 10)/10 : '∞'],
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

                    // ── Sheet 5: DORA Benchmark ──────────────────────────────
                    const doraValues = [q2, q1, q5];
                    const doraData = [
                        [L.xlsDoraTitle],
                        [],
                        L.xlsDoraHeaders,
                        ...L.xlsDoraRows.map((row, i) => [row[0], doraValues[i], row[2], doraBandFn(['leadTime','manual','errors'][i], doraValues[i])]),
                    ];
                    const wsDora = XLSX.utils.aoa_to_sheet(sanitizeSheetData(doraData));
                    wsDora['!cols'] = [{wch:28},{wch:14},{wch:52},{wch:20}];
                    XLSX.utils.book_append_sheet(wb, wsDora, L.xlsSheetDora);

                    // ── write & download ─────────────────────────────────────
                    XLSX.writeFile(wb, 'Process-Debt-Engine.xlsx');
                } catch(err) {
                    console.error('Excel export error:', err);
                    alert('Export failed: ' + err.message);
                } finally {
                    btn.disabled = false;
                    btn.textContent = t('exportExcelBtn');  // Bug 3 fix: use translated label
                }
            }, 80);
        }

        /* ── Mobile / WebView detection ────────────────────────────────────────
           iOS Safari and Android WebView cannot reliably resolve CSS custom
           properties or capture cross-origin (Google) fonts via html2canvas.
           We detect these environments and offer a graceful fallback instead
           of silently producing a black-block PDF.
        ────────────────────────────────────────────────────────────────────── */
        function isMobileBrowser() {
            const ua = navigator.userAgent || '';
            return /iPhone|iPad|iPod|Android|webOS|BlackBerry|Windows Phone|IEMobile|Opera Mini/i.test(ua)
                || (navigator.maxTouchPoints > 1 && /Macintosh/i.test(ua)); // iPadOS
        }

        /* Pre-resolve every CSS custom property used by html2canvas targets to
           their computed hex/rgb values so WebKit/Blink on desktop always
           renders solid colours even when getPropertyValue() would otherwise
           return an empty string inside the canvas context.              */
        function resolveCSSVarsOnElement(el) {
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

            // Walk every element in the subtree and inline computed styles
            // for the properties html2canvas is known to struggle with.
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
                        // Replace any var(--xxx) tokens with resolved values
                        let resolved = val;
                        for (const [token, hex] of Object.entries(varMap)) {
                            resolved = resolved.replaceAll(`var(${token})`, hex);
                        }
                        node.style[prop] = resolved;
                    } else if (val && val !== node.style[prop]) {
                        // Inline computed value so html2canvas sees explicit colours,
                        // not inherited/cascade values it may mis-read.
                        node.style[prop] = val;
                    }
                });
            });
        }

        async function exportPDF() {
            // ── Mobile guard ────────────────────────────────────────────────────
            if (isMobileBrowser()) {
                const msg = currentLang === 'pl'
                    ? 'Eksport PDF nie jest obsługiwany na urządzeniach mobilnych (iOS Safari / Android WebView nie obsługują renderowania CSS). Otwórz tę stronę na komputerze, aby wygenerować raport.'
                    : 'PDF export is not supported on mobile browsers (iOS Safari / Android WebView cannot reliably render CSS custom properties). Please open this page on a desktop browser to generate the report.';
                alert(msg);
                return;
            }

            const { jsPDF } = window.jspdf;
            const btn = document.getElementById('exportBtn');
            btn.disabled = true;
            btn.textContent = t('exportGenerating');
            await new Promise(r => setTimeout(r, 120));

            try {
                const pdf    = new jsPDF('p', 'mm', 'a4');
                const PW     = 210, PH = 297;
                const ML     = 14, MR = 14, MT = 14;
                const UW     = PW - ML - MR;
                let   cy     = MT;
                const L      = TRANSLATIONS[currentLang];

                // ── register Inter font (Polish character support) ──────────────
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

                // ── helpers ────────────────────────────────────────────────────────
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

                // ── PAGE 1: Phase 1 header + all 10 questions ─────────────────────
                // Colour palette matching the webpage's warm amber/cream theme:
                // --bg-base: #F5F0E8, --bg-surface: #FDFAF5, --bg-elevated: #FFFFFF
                // --accent: #B45309 (amber-700), --text-primary: #1C1410
                // --text-label: #7C4F22, --text-secondary: #4A3F35, --text-muted: #8C7B6E
                // --border: #D6C9B8

                // Header bar — warm amber-brown
                drawRect(0, 0, PW, 12, [92, 64, 18]);
                pdf.setFontSize(9); pdf.setFont(pdfFont, 'bold');
                pdf.setTextColor(253, 245, 230);  // warm cream text
                pdf.text('STRATEGIC BUSINESS CASE ENGINE', ML, 8);
                pdf.setTextColor(214, 201, 184); pdf.setFont(pdfFont, 'normal');
                pdf.text(L.navSubtitle.toUpperCase(), PW - MR, 8, { align: 'right' });

                cy = 20;
                // Section title — amber-700 accent bar
                drawRect(ML - 2, cy - 4, UW + 4, 10, [180, 83, 9]);
                pdf.setFontSize(11); pdf.setFont(pdfFont, 'bold'); pdf.setTextColor(255, 255, 255);
                pdf.text(L.phase1Title.toUpperCase(), ML + 2, cy + 3);
                cy += 14;

                // Gather all questions
                const qKeys = [
                    { label: t('q1label'),  desc: L.q1desc,  id: 'q1',  type: 'number' },
                    { label: t('q2label'),  desc: L.q2desc,  id: 'q2',  type: 'number' },
                    { label: t('q3label'),  desc: L.q3desc,  id: 'q3',  type: 'slider', valId: 'q3Val', min: L.q3min, max: L.q3max },
                    { label: t('q4label'),  desc: L.q4desc,  id: 'q4',  type: 'number' },
                    { label: t('q5label'),  desc: L.q5desc,  id: 'q5',  type: 'number' },
                    { label: t('q11label'), desc: L.q11desc, id: 'q11', type: 'number' },
                    { label: t('q6label'),  desc: L.q6desc,  id: 'q6',  type: 'number' },
                    { label: t('q7label'),  desc: L.q7desc,  id: 'q7',  type: 'number' },
                    { label: t('q8label'),  desc: L.q8desc,  id: 'q8',  type: 'number' },
                    { label: t('q9label'),  desc: L.q9desc,  id: 'q9',  type: 'slider', valId: 'q9Val' },
                    { label: t('q10label'), desc: L.q10desc, id: 'q10', type: 'number' },
                ];

                // 2-column layout: left col x=ML, right col x=ML+UW/2+3
                const colW  = UW / 2 - 3;
                const cols  = [ML, ML + UW / 2 + 3];
                const rowH  = 38;

                for (let i = 0; i < qKeys.length; i++) {
                    const q   = qKeys[i];
                    const col = i % 2;
                    const x   = cols[col];

                    if (col === 0 && i > 0) { cy += rowH + 3; }
                    if (col === 0) { needSpace(rowH + 3); }

                    const val = document.getElementById(q.id).value;
                    const monetaryIds = ['q4', 'q6', 'q8'];
                    const displayVal = q.type === 'slider'
                        ? document.getElementById(q.valId).textContent
                        : monetaryIds.includes(q.id)
                            ? new Intl.NumberFormat(currentLang === 'pl' ? 'pl-PL' : 'en-US', {
                                style: 'currency',
                                currency: currentCurrency,
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2
                              }).format(parseFloat(val) || 0)
                            : val;

                    drawRect(x, cy, colW, rowH, [255, 255, 255], [214, 201, 184]);
                    drawRect(x, cy, 2, rowH, [180, 83, 9]);

                    pdf.setFontSize(7); pdf.setFont(pdfFont, 'bold'); pdf.setTextColor(124, 79, 34);
                    pdf.text(q.label.toUpperCase(), x + 5, cy + 6);

                    pdf.setFontSize(6.2); pdf.setFont(pdfFont, 'normal'); pdf.setTextColor(140, 123, 110);
                    const descLines = wrapText(q.desc, x + 5, colW - 10, 6.2 * 0.3528);
                    const maxDescLines = 3;
                    descLines.slice(0, maxDescLines).forEach((line, li) => {
                        pdf.text(line, x + 5, cy + 12 + li * 4);
                    });

                    const vBoxY = cy + rowH - 11;
                    drawRect(x + 5, vBoxY, colW - 10, 8, [250, 247, 242], [214, 201, 184]);
                    pdf.setFontSize(8); pdf.setFont(pdfFont, 'bold'); pdf.setTextColor(28, 20, 16);
                    pdf.text(String(displayVal), x + 8, vBoxY + 5.5);

                    if (q.type === 'slider' && q.min) {
                        pdf.setFontSize(5.5); pdf.setFont(pdfFont, 'normal'); pdf.setTextColor(140, 123, 110);
                        pdf.text(q.min, x + 5, vBoxY + 5.5);
                        pdf.text(q.max, x + colW - 5, vBoxY + 5.5, { align: 'right' });
                    }
                }

                cy += rowH + 8;

                // ── Screenshot blocks: investment, stats, charts, exec summary ─────
                const mainIds = ['pdf-block-2','pdf-block-3','scenario-compare','pdf-block-4','pdf-block-5','pdf-block-6'];

                async function captureBlock(id) {
                    const el = document.getElementById(id);
                    if (!el || !el.offsetHeight) return;

                    const swaps = [];
                    el.querySelectorAll('input').forEach(input => {
                        const proxy = document.createElement('div');
                        proxy.style.cssText = window.getComputedStyle(input).cssText;
                        proxy.style.display = 'flex';
                        proxy.style.alignItems = 'center';
                        proxy.style.boxSizing = 'border-box';
                        proxy.style.color = '#1C1410';
                        proxy.style.fontWeight = '700';
                        proxy.style.fontSize = '0.875rem';
                        proxy.style.background = '#FAF7F2';
                        proxy.style.border = '1px solid #D6C9B8';
                        proxy.style.borderRadius = '6px';
                        proxy.style.padding = '0.5rem 0.75rem';
                        proxy.style.width = input.offsetWidth + 'px';
                        proxy.style.height = input.offsetHeight + 'px';
                        proxy.style.minHeight = '36px';
                        proxy.textContent = input.value;
                        input.parentNode.insertBefore(proxy, input);
                        input.style.display = 'none';
                        swaps.push({ input, proxy });
                    });

                    const nodeList = Array.from(el.querySelectorAll('*'));
                    const savedStyles = nodeList.map(n =>
                        n instanceof HTMLElement ? n.style.cssText : undefined
                    );
                    resolveCSSVarsOnElement(el);

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

                            const fontFaceCSS = buildFontFaceCSS();

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
                                } catch { /* cross-origin sheet — skip */ }
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

                    const imgData = canvas.toDataURL('image/png');
                    const bH = (canvas.height * UW) / canvas.width;

                    if (bH > PH - MT - 10) {
                        if (cy > MT) newPage();
                        const sH = PH - MT - 10;
                        const sW = (canvas.width * sH) / canvas.height;
                        pdf.addImage(imgData, 'PNG', ML + (UW - sW) / 2, cy, sW, sH);
                        newPage();
                    } else {
                        if (cy + bH > PH - 10) newPage();
                        pdf.addImage(imgData, 'PNG', ML, cy, UW, bH);
                        cy += bH + 5;
                    }
                }

                for (const id of mainIds) await captureBlock(id);

                // ── Methodology & Sources on fresh page ─────
                newPage();
                const methodologySection = document.getElementById('methodologySection');
                if (methodologySection) methodologySection.open = true;
                const methodologyIds = ['methodology-header','methodology-1','methodology-2','methodology-3','methodology-4','methodology-5','methodology-6','methodology-7','methodology-footer'];
                for (const id of methodologyIds) await captureBlock(id);

                pdf.save('Process-Debt-Engine.pdf');
            } catch (err) {
                console.error('PDF export error:', err);
                const msg = currentLang === 'pl'
                    ? 'Eksport PDF nie powiódł się: ' + err.message
                    : 'PDF export failed: ' + err.message;
                alert(msg);
            } finally {
                btn.disabled = false;
                btn.textContent = t('exportBtn');
            }
        }

        /* ── Hash state security constraints ───────────────────────────────────
           ALLOWED_HASH_KEYS:  explicit allowlist — any key not in this set is
                               silently dropped, preventing arbitrary-ID targeting.
           HASH_CONSTRAINTS:   numeric min/max per field — non-finite values and
                               out-of-range payloads are rejected before touching
                               the DOM, closing the URL-hash injection vector.
        ────────────────────────────────────────────────────────────────────── */
        const ALLOWED_HASH_KEYS = new Set(
            ['q1','q2','q3','q4','q5','q11','q6','q7','q8','q9','q10','autoLevel','capex','teamSize']
        );

        const HASH_CONSTRAINTS = {
            q1:        { min: 0,   max: 100   },  // manual effort %
            q2:        { min: 0,   max: 8760  },  // lead time hours (≤ 1 year)
            q3:        { min: 1,   max: 5     },  // documentation scale
            q4:        { min: 0,   max: 1e7   },  // downtime cost $/h
            q5:        { min: 0,   max: 9999  },  // human errors / quarter
            q11:       { min: 0,   max: 168   },  // MTTR hours (≤ 1 week)
            q6:        { min: 0,   max: 5000  },  // blended rate $/h
            q7:        { min: 0,   max: 744   },  // management overhead h/m (≤ 1 month)
            q8:        { min: 0,   max: 1e9   },  // opportunity margin $
            q9:        { min: 1,   max: 5     },  // scalability bottleneck scale
            q10:       { min: 0,   max: 100   },  // turnover %
            autoLevel: { min: 0,   max: 100   },  // automation level %
            capex:     { min: 0,   max: 1e9   },  // CAPEX investment $
            teamSize:  { min: 1,   max: 10000 },  // F9 fix: was missing, allowing unbounded values
        };

        /* ── clamp(id) ──────────────────────────────────────────────────────────
           Reads a field by element ID, validates it is a finite number, and
           clamps it to the bounds defined in HASH_CONSTRAINTS.
           Used by both calculate() and exportExcel() so every numeric input
           is sanitised before it participates in any financial formula.

           - Non-finite results (NaN, Infinity) from parseFloat fall back to min,
             preventing Infinity / NaN from propagating into chart data or exports.
           - Negative values and out-of-range extremes are silently clamped rather
             than thrown, keeping the UX non-disruptive while blocking corrupt output.
        ────────────────────────────────────────────────────────────────────── */
        function clamp(id) {
            const c = HASH_CONSTRAINTS[id];
            const raw = parseFloat(document.getElementById(id)?.value);
            if (!c) return isFinite(raw) ? raw : 0;
            if (!isFinite(raw)) return c.min;
            const minInCurrency = c.min * EXCHANGE_RATES[currentCurrency];
            const maxInCurrency = c.max * EXCHANGE_RATES[currentCurrency];
            return Math.round(Math.min(maxInCurrency, Math.max(minInCurrency, raw)) * 100) / 100;
        }

        function encodeState() {
            const ids = [...ALLOWED_HASH_KEYS];
            const vals = ids.map(id => document.getElementById(id).value);
            const hash = ids.map((id,i) => id+'='+encodeURIComponent(vals[i])).join('&');
            history.replaceState(null, '', '#' + hash);
        }

        function decodeState() {
            if (!location.hash || location.hash.length < 3) return;
            const pairs = location.hash.slice(1).split('&');
            pairs.forEach(pair => {
                // Guard: split on first '=' only so values containing '=' are safe
                const eqIdx = pair.indexOf('=');
                if (eqIdx === -1) return;
                const key = pair.slice(0, eqIdx);
                const raw = pair.slice(eqIdx + 1);

                // 1. Allowlist check — reject any key not explicitly permitted
                if (!ALLOWED_HASH_KEYS.has(key)) return;

                // 2. Numeric validation — reject non-finite and non-numeric payloads
                const num = parseFloat(decodeURIComponent(raw));
                if (!isFinite(num)) return;

                // 3. Range clamping — silently clamp to the field's valid bounds
                const { min, max } = HASH_CONSTRAINTS[key];
                const safe = Math.min(max, Math.max(min, num));

                const el = document.getElementById(key);
                if (!el) return;
                const monetaryIds = ['q4', 'q6', 'q8', 'capex'];
                el.value = monetaryIds.includes(key) ? safe.toFixed(2) : safe;

                // Update companion display spans (textContent only — never innerHTML)
                if (key === 'q3')        document.getElementById('q3Val').textContent        = safe;
                if (key === 'q9')        document.getElementById('q9Val').textContent        = safe;
                if (key === 'autoLevel') document.getElementById('autoLevelVal').textContent = safe;
            });
        }

        function copyShareLink() {
            const btn  = document.getElementById('copyLinkBtn');
            const orig = btn.textContent;
            const url  = location.href;

            // Tier 1 — Modern Clipboard API.
            // Only available in secure contexts (HTTPS or localhost).
            // Safari 13.0 and older also lack it; all modern browsers support it.
            if (navigator.clipboard && window.isSecureContext) {
                navigator.clipboard.writeText(url)
                    .then(() => flashBtn(btn, orig))
                    .catch(() => fallbackCopy(btn, orig, url));
                return;
            }

            // Tier 2 & 3 handled by fallback for HTTP / file:// / older Safari.
            fallbackCopy(btn, orig, url);
        }

        function fallbackCopy(btn, orig, url) {
            // Tier 2 — execCommand('copy').
            // Deprecated but still widely supported. Requires a real DOM text node
            // that can be selected; we create a temporary <textarea> off-screen.
            try {
                const ta = document.createElement('textarea');
                ta.value = url;
                // Place off-screen so it doesn't cause a visible scroll jump.
                ta.style.cssText = 'position:fixed;top:-9999px;left:-9999px;opacity:0;';
                document.body.appendChild(ta);
                ta.focus();
                ta.select();
                const ok = document.execCommand('copy');
                document.body.removeChild(ta);
                if (ok) { flashBtn(btn, orig); return; }
            } catch (_) {
                // execCommand may throw in some sandboxed environments — fall through.
            }

            // Tier 3 — prompt() dialog.
            // Works everywhere, including file://, HTTP, and very old browsers.
            // The user can manually copy the pre-selected URL from the dialog.
            prompt('Copy this link (Ctrl+C / ⌘+C):', url);
        }

        function flashBtn(btn, orig) {
            btn.textContent = '✓ COPIED';
            setTimeout(() => btn.textContent = orig, 2000);
        }

        /* ── Font cache ──────────────────────────────────────────────────────────
           _fontCache: in-memory Map used by buildFontFaceCSS() → onclone() for PDF export.
           localStorage key 'fontCache_v1': persisted array of the same entries,
           read at page-load by the inline bootstrap script above to inject fonts
           before first paint — making every load after the first fully offline-capable.
        ────────────────────────────────────────────────────────────────────── */
        const FONT_CACHE_KEY = 'fontCache_v1';
        const _fontCache = new Map();

        const _FONT_ALLOWED_FAMILIES = { 'Space Grotesk': true, 'Inter': true };
        const _FONT_ALLOWED_STYLES   = { 'normal': true, 'italic': true, 'oblique': true };
        const _FONT_ALLOWED_FMTS     = { 'woff2': true, 'woff': true, 'truetype': true };
        const _FONT_B64_RE           = /^[A-Za-z0-9+/]+=*$/;
        const _FONT_B64_MAX_LEN      = 700000;

        function validateFontFace(f) {
            if (!f || typeof f !== 'object')                          return null;
            if (!_FONT_ALLOWED_FAMILIES[f.family])                    return null;
            if (!/^\d+$/.test(String(f.weight)))                      return null;
            var w = parseInt(f.weight, 10);
            if (w < 100 || w > 900 || w % 100 !== 0)                 return null;
            if (!_FONT_ALLOWED_STYLES[f.style])                       return null;
            if (!_FONT_ALLOWED_FMTS[f.fmt])                           return null;
            if (typeof f.b64 !== 'string')                            return null;
            if (f.b64.length === 0 || f.b64.length > _FONT_B64_MAX_LEN) return null;
            if (!_FONT_B64_RE.test(f.b64))                            return null;
            return { family: f.family, weight: String(w), style: f.style,
                     fmt: f.fmt, b64: f.b64 };
        }

        /* Seed _fontCache from localStorage on startup so PDF export works
           immediately even before prefetchFontsToBase64() finishes.
           Each entry is passed through validateFontFace() before being stored —
           the in-memory Map therefore only ever contains validated data.       */
        (function seedFontCacheFromStorage() {
            try {
                const stored = localStorage.getItem(FONT_CACHE_KEY);
                if (!stored) return;
                const faces = JSON.parse(stored);
                if (!Array.isArray(faces)) return;
                let seeded = 0;
                faces.forEach(raw => {
                    const f = validateFontFace(raw);
                    if (!f) return;
                    _fontCache.set(`${f.family}||${f.weight}||${f.style}`, f);
                    seeded++;
                });
            } catch(e) { /* localStorage unavailable — silent */ }
        })();

        async function prefetchFontsToBase64() {
            if (isMobileBrowser()) return;

            await document.fonts.ready;

            // Collect @font-face URLs from the live CSSOM.
            // Skip any face already in _fontCache (seeded from localStorage above).
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
                    if (_fontCache.has(key)) continue; // already cached — skip fetch
                    const srcVal = rule.style.getPropertyValue('src');
                    const woff2M = srcVal.match(/url\(["']?([^"')]+\.woff2)["']?\)/);
                    const anyM   = srcVal.match(/url\(["']?([^"')]+)["']?\)/);
                    const url    = (woff2M || anyM)?.[1];
                    if (url) urlsByRule.push({ family, weight, style, url });
                }
            }

            if (urlsByRule.length === 0) {
                return;
            }

            // Fetch each URL and store as base64.
            await Promise.allSettled(urlsByRule.map(async ({ family, weight, style, url }) => {
                const key = `${family}||${weight}||${style}`;
                try {
                    const resp = await fetch(url, { mode: 'cors', cache: 'force-cache' });
                    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
                    const buf = await resp.arrayBuffer();
                    // Chunked base64 encoding — avoids call-stack overflow on large
                    // font buffers (>100 KB) that blow up btoa(Uint8Array.reduce…)
                    // on mobile Safari and low-memory Android WebViews.
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
                } catch (e) {
                }
            }));

            // Persist the full cache to localStorage so future loads inject
            // fonts before first paint with no network request at all.
            try {
                const faces = Array.from(_fontCache.values());
                localStorage.setItem(FONT_CACHE_KEY, JSON.stringify(faces));
            } catch(e) {
                // Quota exceeded or private browsing — in-memory cache still works for PDF.
            }

        }

        /* Build a complete @font-face CSS block from the cache for injection
           into the html2canvas clone document.
           Entries are re-validated here as defence-in-depth: _fontCache should
           only ever hold validated data (written by prefetchFontsToBase64 from
           live CSSOM, or by seedFontCacheFromStorage via validateFontFace), but
           an explicit check at the CSS-generation site means a future write path
           that skips validation cannot silently introduce a CSS injection.     */
        function buildFontFaceCSS() {
            let css = '';
            for (const raw of _fontCache.values()) {
                const f = validateFontFace(raw);
                if (!f) continue; // skip any entry that fails re-validation
                css += `@font-face{font-family:'${f.family}';font-weight:${f.weight};`
                     + `font-style:${f.style};`
                     + `src:url('data:font/${f.fmt};base64,${f.b64}') format('${f.fmt}');}\n`;
            }
            return css;
        }

        /* ── Formula tooltip: click / touch / keyboard access ───────────────
           Adds .tip-open class on click or Enter/Space, removes it when the
           user clicks elsewhere — making tooltips work on touch & keyboard.
        ─────────────────────────────────────────────────────────────────── */
        document.addEventListener('DOMContentLoaded', () => {
            // Activate Google Fonts stylesheet (loaded with media="print")
            const gFont = document.getElementById('googleFontsSheet');
            if (gFont) gFont.media = 'all';

            document.querySelectorAll('.formula-tip').forEach(el => {
                el.addEventListener('click', e => {
                    e.stopPropagation();
                    const isOpen = el.classList.contains('tip-open');
                    // close all others first
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

            
            // -- Input event listeners -> recalculate (input)
            const calcIds = ['q1','q2','q3','q4','q5','q11','q6','q7','q8','q9','q10','autoLevel','teamSize','capex'];
            calcIds.forEach(id => {
                const el = document.getElementById(id);
                if (el) el.addEventListener('input', calculate);
            });

            // -- Button click listeners (click)
            const copyBtn = document.getElementById('copyLinkBtn');
            if (copyBtn) copyBtn.addEventListener('click', copyShareLink);

            const langButton = document.getElementById('langBtn');
            if (langButton) langButton.addEventListener('click', toggleLang);

            const currencySelect = document.getElementById('currencySelect');
            if (currencySelect) currencySelect.addEventListener('change', e => toggleCurrency(e.target.value));

            const excelBtn = document.getElementById('exportExcelBtn');
            if (excelBtn) excelBtn.addEventListener('click', exportExcel);

            const pdfBtn = document.getElementById('exportBtn');
            if (pdfBtn) pdfBtn.addEventListener('click', exportPDF);
            // Dismiss open tooltip when clicking anywhere outside
            document.addEventListener('click', e => {
                if (!e.target.classList.contains('formula-tip')) {
                    document.querySelectorAll('.formula-tip').forEach(t => t.classList.remove('tip-open'));
                }
            });
        });

        async function fetchNbpRates() {
            try {
                const res = await fetch('https://api.nbp.pl/api/exchangerates/tables/A/today?format=json');
                const data = await res.json();
                const rates = data[0].rates;
                const getMid = (code) => rates.find(r => r.code === code).mid;

                const plnPerUsd = getMid('USD');
                const plnPerEur = getMid('EUR');
                const plnPerGbp = getMid('GBP');

                EXCHANGE_RATES['PLN'] = plnPerUsd;
                EXCHANGE_RATES['EUR'] = plnPerUsd / plnPerEur;
                EXCHANGE_RATES['GBP'] = plnPerUsd / plnPerGbp;
                EXCHANGE_RATES['USD'] = 1;

                nbpDate = data[0].effectiveDate;
                const footerEl = document.getElementById('nbpFooter');
                if (footerEl) footerEl.textContent = TRANSLATIONS[currentLang].nbpFooter(new Date(nbpDate).toLocaleDateString(currentLang === 'pl' ? 'pl-PL' : 'en-US'));

                if (currentCurrency !== 'USD') calculate();
            } catch (e) {
                console.error('NBP API fetch failed:', e);
                const footerEl = document.getElementById('nbpFooter');
                if (footerEl) footerEl.textContent = TRANSLATIONS[currentLang].nbpUnavailable;
            }
        }

        window.onload = () => {
            if (typeof Chart !== 'undefined') {
                const cs = getComputedStyle(document.documentElement);
                Chart.defaults.color           = cs.getPropertyValue('--text-secondary').trim() || DARK.text;
                Chart.defaults.borderColor     = cs.getPropertyValue('--border').trim() || DARK.grid;
                Chart.defaults.backgroundColor = cs.getPropertyValue('--border').trim() || DARK.navy;
            }
            document.getElementById('currencySelect').value = currentCurrency;
            applyTranslations();
            document.getElementById('nbpFooter').textContent = TRANSLATIONS[currentLang].nbpUnavailable;
            decodeState();
            calculate();
            requestAnimationFrame(() => { calculate(); });
            fetchNbpRates();

            // ── Mobile PDF export guard (visual) ──────────────────────────────
            if (isMobileBrowser()) {
                const btn = document.getElementById('exportBtn');
                if (btn) {
                    btn.disabled = true;
                    btn.title = currentLang === 'pl'
                        ? 'Eksport PDF niedostępny na urządzeniach mobilnych — otwórz na komputerze'
                        : 'PDF export unavailable on mobile — open on a desktop browser';
                    btn.style.opacity = '0.45';
                    btn.style.cursor  = 'not-allowed';
                    btn.textContent = '🖥 PDF (DESKTOP ONLY)';
                }
            }

            // ── Eager font prefetch (desktop only) ────────────────────────────
            // Kick off immediately so fonts are cached long before the user
            // clicks Export.  Runs in the background — no await needed here.
            prefetchFontsToBase64();
        };
