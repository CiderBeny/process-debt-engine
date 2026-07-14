// ═══════════════════════════════════════════════════════════════
// URL hash state — encode, decode, copy share link
// ═══════════════════════════════════════════════════════════════
window.PDE = window.PDE || {};

PDE.encodeState = function encodeState() {
    const ids = [...PDE.ALLOWED_HASH_KEYS];
    const vals = ids.map(id => document.getElementById(id).value);
    const hash = ids.map((id,i) => id+'='+encodeURIComponent(vals[i])).join('&');
    history.replaceState(null, '', '#' + hash);
};

PDE.decodeState = function decodeState() {
    if (!location.hash || location.hash.length < 3) return;
    const pairs = location.hash.slice(1).split('&');
    pairs.forEach(pair => {
        const eqIdx = pair.indexOf('=');
        if (eqIdx === -1) return;
        const key = pair.slice(0, eqIdx);
        const raw = pair.slice(eqIdx + 1);

        if (!PDE.ALLOWED_HASH_KEYS.has(key)) return;

        const num = parseFloat(decodeURIComponent(raw));
        if (!isFinite(num)) return;

        const { min, max } = PDE.HASH_CONSTRAINTS[key];
        const safe = Math.min(max, Math.max(min, num));

        const el = document.getElementById(key);
        if (!el) return;
        const monetaryIds = ['q4', 'q6', 'q8', 'capex'];
        if (monetaryIds.includes(key)) {
            el.value = (safe * PDE.EXCHANGE_RATES[PDE.currentCurrency]).toFixed(2);
        } else {
            el.value = safe;
        }
    });
};

PDE.copyShareLink = function copyShareLink() {
    PDE.encodeState();
    const url = location.href;
    const btn = document.getElementById('copyLinkBtn');
    const orig = btn.textContent;

    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(url)
            .then(() => PDE.flashBtn(btn, orig))
            .catch(() => PDE.fallbackCopy(btn, orig, url));
    } else {
        PDE.fallbackCopy(btn, orig, url);
    }
};

PDE.fallbackCopy = function fallbackCopy(btn, orig, url) {
    try {
        const ta = document.createElement('textarea');
        ta.value = url;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        ta.remove();
        PDE.flashBtn(btn, orig);
    } catch (e) {
        prompt('Copy this link (Ctrl+C / \u2318+C):', url);
    }
};


