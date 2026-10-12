# Functional test report — 2026-10-12

## Repair and validation outcome

All six planned stages were implemented on `dev` and advanced to `test` sequentially. Final code validation on `test`: **ESLint passed; 247 tests passed, 0 failed**. The `main` branch was not changed.

1. Currency-independent bounds: fixed; all constrained fields checked at their bounds in USD/EUR/PLN/GBP. Browser verification: q1=100 in EUR now means 1,800 manual hours.
2. Calibration currency: version 2 stores monetary actuals in USD and hours unchanged. Legacy actuals are preserved and disabled until the user explicitly chooses their original currency and converts them. Unit migration tests passed. Browser verification: a 100,000 PLN actual remains approximately 25,503.05 USD after reload and returns to 100,000 when PLN is selected.
3. Full reset: restores all 38 scenario fields, toggles, seed and US region selector. Defaults match the initial scenario (q1=25, q11=4). Monetary defaults convert to the active currency. Language, currency, view mode and calibration actuals are preserved. Browser verification: MTTR returned from 0 to 4; all four toggles cleared; PL/PLN/Full and actual=100000 stayed intact.
4. Signed calibration differences: negative money variances now show a minus sign; positive, zero and negative cases tested in both languages and all currencies. Browser verification showed a negative PLN variance matching its negative percentage.
5. DORA translations: corrected in the UI and both PDF rendering paths. PL/EN labels verified; generated Polish summary PDF contains Metryka and Twoja wartość.
6. Final regression and export validation: npm installation succeeded with Node's trusted Windows system certificates (`node --use-system-ca ...npm-cli.js ci --ignore-scripts`), without disabling TLS verification. `npm test` now discovers every `src/*.test.js` file. Browser console recorded no errors; Monte Carlo completed 1,000 iterations, and its toggle, seed and multiplier survived share/reload.

### Additional export corrections found during stage 6

- CSV/XLSX retain model-base USD numeric values and now label them explicitly as USD; unresolved `{C}` / `{CC}` tokens and the incorrectly labelled CAPEX unit were removed. UI translations are not mutated.
- The Do Nothing scenario exports annual operating drag correctly instead of zero.
- Scenario C CAPEX in exports uses the configured multiplier. XLSX content verified: multiplier 3.0 and base CAPEX 50,000 USD produce Scenario C CAPEX 150,000 USD.
- Executive summary PDF now paints its background before verdict text, wraps the complete note, and displays the actual combined top-three recovery amount.

### Final export checks

Read generated CSV and XLSX with CSV parsing and bundled openpyxl: labels, MTTR, monetary units and scenario values checked. Both exports contain no unresolved currency placeholders. Summary PDF: one page; complete verdict and note visible, Polish characters and headers correct. Detailed PDF: six pages; all pages rendered with Poppler and visually reviewed. No captured browser console errors.

These checks used the local server while the Git checkout was on `test`. No separate public test website exists. Cross-browser and mobile coverage remain outside this validation.

## Initial smoke test (before repairs)

Tested the local working tree through http://127.0.0.1:8080 in the Codex in-app browser. No application source was changed. This is a functional smoke test, not exhaustive browser/device coverage.

## Automated checks

- `node --test src/*.test.js`: **241 passed, 0 failed**, 48 suites.
- `npm test`: blocked before test execution because ESLint was unavailable. Both dependency-install attempts ended with npm's `Exit handler never called!` error. Lint is therefore unverified.

## Browser checks

| Flow | Result | Evidence |
| --- | --- | --- |
| Startup and charts | PASS | Results, scenarios, recommendations and chart descriptions populated; no captured console errors. |
| Live recalculation | PASS | Manual effort 25 → 50 raised USD OPEX waste from approximately 952.2K to 1.6M. |
| Quick / Full | PASS | Full exposes advanced questions, parameters, sensitivity and calibration. |
| EN / PL | PARTIAL | Main UI and generated results translate; two DORA headers remain English. |
| Currency switching | PARTIAL | Monetary inputs convert across USD/PLN/EUR/GBP; nonmonetary bounds have a defect below. |
| MTTR zero | PASS | Setting MTTR to zero makes risk exposure zero. |
| Advanced toggles / Monte Carlo | PASS | All four toggles operate; 1,000 iterations completed with intervals and seed. |
| Share / reload | PASS | Copied URL includes currency, full mode, togg=15 and seed; reload restores q1=50, MTTR=0 and toggles, converting PLN monetary inputs into default USD. |
| Calibration persistence / clear | PARTIAL | Input persists after reload and clears; currency and negative-difference defects below. |
| High Maturity profile | PASS | Sets q1=15, q2=24, q5=1. |
| Negative input validation | PASS | q1=-1 shows “Value must be between 0 and 100”; results remain finite. |
| Reset | PARTIAL | Core fields reset, but MTTR and advanced settings remain changed. |
| CSV / XLSX / summary PDF / detailed PDF | PASS for generation | All four downloads completed. Export contents and PDF pagination were not independently audited. |

## Confirmed findings

### High — Currency changes the bounds of nonmonetary inputs

`src/utils.js:240` multiplies every field's min/max by the exchange rate in `PDE.clamp`, including percentages, counts and hours.

Reproduction: disable Monte Carlo, select EUR, enter q1=100. No validation error appears, but the waterfall reports 1,602 manual hours out of 1,800 (89%). Switch to USD without changing q1: the chart reports 1,800 manual hours (100%). The financial model therefore changes beyond monetary conversion. Apply currency scaling only to q4, q6, q8 and capex.

### Medium — Calibration actuals lose currency meaning

Reproduction: enter calibration OPEX actual=100000 in PLN, then reload the PLN share URL. Startup uses USD and converts scenario inputs correctly, but the saved actual remains the number 100000 and is now interpreted as USD. Store actuals with a currency code or normalize them to USD and convert for display.

### Medium — Reset leaves scenario inputs active

`src/main.js:100` omits MTTR q11 and advanced parameters/toggles. Reproduction: set MTTR=0 and enable advanced toggles, then Reset. q1 becomes 40, but MTTR stays 0 and enabled toggles remain active. Clarify reset scope in the UI or restore all scenario defaults.

### Medium — Negative monetary calibration variance lacks a minus sign

`src/ui-renderers.js:529` formats the absolute value with an empty prefix for negative differences. Observed prediction $318,986.33 and actual $100,000 produce a displayed monetary difference $218,986.33, alongside -69%. Display -$218,986.33.

### Low — Incomplete Polish DORA headers

After switching to Polish, DORA table headers “Metric” and “Your Value” remain English. Add or correct their translation bindings.

## Limits

Tests cover the local checkout, not the deployed GitHub Pages site. Mobile layout, other browsers, export content accuracy and visual PDF layout remain unverified. Automated passing tests do not cover the browser findings above. No fixes were applied.
