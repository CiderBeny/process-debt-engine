#!/usr/bin/env node
/**
 * download-fonts.js — run once, then commit style.css
 * ──────────────────────────────────────────────────────────────────────────
 * Usage:  node download-fonts.js
 *
 * What it does:
 *   1. Fetches the Google Fonts CSS for Space Grotesk + Inter (woff2).
 *   2. Downloads each woff2 binary and converts it to a base64 data: URI.
 *   3. Writes the @font-face blocks directly into style.css, replacing
 *      everything between the sentinel comments:
 *        /* FONT-EMBED-START *\/  …  /* FONT-EMBED-END *\/
 *      Those sentinels are present in style.css (added by this update).
 *
 * After running, style.css is self-contained — no CDN, no separate fonts.css,
 * no network required on any load, first or subsequent, online or offline.
 *
 * Re-run any time you want to pick up a new weight or refreshed binaries.
 * Requirements: Node 18+. No npm install needed.
 */

'use strict';

const fs    = require('fs');
const path  = require('path');
const https = require('https');

const GOOGLE_FONTS_URL =
    'https://fonts.googleapis.com/css2' +
    '?family=Space+Grotesk:wght@400;500;600;700' +
    '&family=Inter:wght@300;400;600;700;900' +
    '&display=swap';

const FAMILIES      = ['Space Grotesk', 'Inter'];
const STYLE_FILE    = path.join(__dirname, 'style.css');
const FONTS_FILE    = path.join(__dirname, 'fonts.css');
const SENTINEL_START = '/* FONT-EMBED-START */';
const SENTINEL_END   = '/* FONT-EMBED-END */';

// ── HTTP helpers ─────────────────────────────────────────────────────────────

function httpsGet(url) {
    return new Promise((resolve, reject) => {
        https.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 ' +
                              '(KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
            },
        }, res => {
            if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location)
                return resolve(httpsGet(res.headers.location));
            const chunks = [];
            res.on('data', c => chunks.push(c));
            res.on('end',  () => resolve({ status: res.statusCode, body: Buffer.concat(chunks) }));
        }).on('error', reject);
    });
}

async function getText(url) {
    const r = await httpsGet(url);
    if (r.status !== 200) throw new Error(`HTTP ${r.status} — ${url}`);
    return r.body.toString('utf8');
}

async function getBinary(url) {
    const r = await httpsGet(url);
    if (r.status !== 200) throw new Error(`HTTP ${r.status} — ${url}`);
    return r.body;
}

// ── Parser ────────────────────────────────────────────────────────────────────

function parseFontFaceBlocks(css) {
    const blocks = [];
    const re = /@font-face\s*\{([^}]+)\}/g;
    let m;
    while ((m = re.exec(css)) !== null) {
        const b      = m[1];
        const family = (b.match(/font-family:\s*['"]?([^;'"]+)['"]?;/) || [])[1]?.trim();
        const weight = (b.match(/font-weight:\s*([^;]+);/)             || [])[1]?.trim() || '400';
        const style  = (b.match(/font-style:\s*([^;]+);/)              || [])[1]?.trim() || 'normal';
        const woff2  = b.match(/url\((https:\/\/fonts\.gstatic\.com[^)]+\.woff2)\)/)?.[1];
        const anyUrl = b.match(/url\((https:\/\/fonts\.gstatic\.com[^)]+)\)/)?.[1];
        const url    = woff2 ?? anyUrl;
        const fmt    = url?.endsWith('.woff2') ? 'woff2'
                     : url?.endsWith('.woff')  ? 'woff' : 'truetype';
        if (family && url && FAMILIES.includes(family))
            blocks.push({ family, weight, style, url, fmt });
    }
    return blocks;
}

// ── Builder ───────────────────────────────────────────────────────────────────

function buildBlock({ family, weight, style, fmt, b64 }) {
    return `@font-face {\n` +
           `    font-family: '${family}';\n` +
           `    font-style:  ${style};\n` +
           `    font-weight: ${weight};\n` +
           `    font-display: swap;\n` +
           `    src: url('data:font/${fmt};base64,${b64}') format('${fmt}');\n` +
           `}`;
}

// ── style.css patcher ─────────────────────────────────────────────────────────

function patchStyleCSS(embedCSS) {
    if (!fs.existsSync(STYLE_FILE)) {
        console.warn(`  ⚠  ${STYLE_FILE} not found — skipping style.css patch.`);
        return false;
    }
    const src = fs.readFileSync(STYLE_FILE, 'utf8');
    const si  = src.indexOf(SENTINEL_START);
    const ei  = src.indexOf(SENTINEL_END);
    if (si === -1 || ei === -1 || ei <= si) {
        console.warn('  ⚠  Sentinel comments not found in style.css.');
        console.warn(`     Add these to style.css where fonts should live:`);
        console.warn(`       ${SENTINEL_START}`);
        console.warn(`       ${SENTINEL_END}`);
        return false;
    }
    const patched = src.slice(0, si) +
                    SENTINEL_START + '\n' +
                    embedCSS + '\n' +
                    SENTINEL_END +
                    src.slice(ei + SENTINEL_END.length);
    fs.writeFileSync(STYLE_FILE, patched, 'utf8');
    return true;
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
    console.log('\n⬇  Fetching font list from Google Fonts…');
    const css    = await getText(GOOGLE_FONTS_URL);
    const blocks = parseFontFaceBlocks(css);

    if (blocks.length === 0) {
        console.error('✗  No matching @font-face blocks found.');
        process.exit(1);
    }
    console.log(`   ${blocks.length} face(s): ${[...new Set(blocks.map(b => b.family))].join(', ')}`);

    const results = [];
    for (const face of blocks) {
        process.stdout.write(`   ↓  ${face.family} ${face.weight} ${face.style}… `);
        try {
            const buf = await getBinary(face.url);
            results.push({ ...face, b64: buf.toString('base64') });
            console.log(`✓  (${Math.round(buf.length / 1024)} KB)`);
        } catch (e) {
            console.log(`✗  skipped: ${e.message}`);
        }
    }

    if (results.length === 0) {
        console.error('\n✗  All downloads failed — aborting.');
        process.exit(1);
    }

    const embedCSS = '\n' + results.map(buildBlock).join('\n\n') + '\n';

    // Primary: embed directly into style.css between sentinel comments
    if (patchStyleCSS(embedCSS)) {
        console.log(`\n✅  style.css updated — ${results.length} @font-face blocks embedded.`);
        console.log('    Fonts ship with the file. Zero network needed on any load.\n');
    }

    // Secondary: also write standalone fonts.css
    fs.writeFileSync(FONTS_FILE,
        `/* fonts.css — auto-generated by download-fonts.js\n` +
        `   Same blocks are embedded in style.css.\n` +
        `   Only needed if you deploy style.css without the embed patch. */\n` +
        embedCSS, 'utf8');
    console.log(`    Also wrote fonts.css (${Math.round(fs.statSync(FONTS_FILE).size / 1024)} KB) as a standalone fallback.`);
}

main().catch(e => { console.error('\n✗', e.message); process.exit(1); });
