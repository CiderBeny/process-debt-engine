#!/usr/bin/env node
/**
 * download-fonts.js — run once, then commit style.css
 * ──────────────────────────────────────────────────────────────────────────
 * Usage:  node download-fonts.js
 *
 * What it does:
 *   1. Downloads Space Grotesk + Inter woff2 files from @fontsource on npm
 *      (registry.npmjs.org — widely accessible, no Google dependency).
 *      Falls back to Google Fonts CDN if npm is unreachable.
 *   2. Base64-encodes each woff2 file.
 *   3. Patches style.css in-place, replacing everything between:
 *        /* FONT-EMBED-START *\/   and   /* FONT-EMBED-END *\/
 *      with self-contained @font-face blocks using data: URIs.
 *
 * After running once and committing style.css, the page has zero external
 * font dependency — correct fonts render on any load, any network, offline.
 *
 * Re-run to pick up new weights or refresh binaries.
 * Requirements: Node 18+. No npm install needed.
 */

'use strict';

const fs    = require('fs');
const path  = require('path');
const https = require('https');
const zlib  = require('zlib');

const STYLE_FILE     = path.join(__dirname, 'style.css');
const FONTS_FILE     = path.join(__dirname, 'fonts.css');
const SENTINEL_START = '/* FONT-EMBED-START */';
const SENTINEL_END   = '/* FONT-EMBED-END */';

// Weights we use in the app
const INTER_WEIGHTS         = [300, 400, 600, 700, 900];
const SPACE_GROTESK_WEIGHTS = [400, 500, 600, 700];

// ── HTTP helpers ─────────────────────────────────────────────────────────────

function httpsGet(url) {
    return new Promise((resolve, reject) => {
        https.get(url, {
            headers: { 'User-Agent': 'download-fonts/1.0 (node.js)',
                       'Accept-Encoding': 'gzip,deflate' }
        }, res => {
            if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location)
                return resolve(httpsGet(res.headers.location));
            const chunks = [];
            const stream = (res.headers['content-encoding'] === 'gzip')
                ? res.pipe(zlib.createGunzip()) : res;
            stream.on('data', c => chunks.push(c));
            stream.on('end',  () => resolve({ status: res.statusCode, body: Buffer.concat(chunks) }));
            stream.on('error', reject);
        }).on('error', reject);
    });
}

async function getJSON(url) {
    const r = await httpsGet(url);
    if (r.status !== 200) throw new Error(`HTTP ${r.status} — ${url}`);
    return JSON.parse(r.body.toString('utf8'));
}

async function getBinary(url) {
    const r = await httpsGet(url);
    if (r.status !== 200) throw new Error(`HTTP ${r.status} — ${url}`);
    return r.body;
}

async function getText(url, ua) {
    const r = await httpsGet(url, ua);
    if (r.status !== 200) throw new Error(`HTTP ${r.status} — ${url}`);
    return r.body.toString('utf8');
}

// ── @fontsource npm strategy ─────────────────────────────────────────────────

async function downloadViaFontsource(family, weights) {
    const pkg  = '@fontsource/' + family.toLowerCase().replace(/ /g, '-');
    const meta = await getJSON(`https://registry.npmjs.org/${pkg}/latest`);
    const tgz  = meta.dist.tarball;

    process.stdout.write(`   ↓  ${family} (${pkg} ${meta.version}) from npm… `);
    const tarBuf = await getBinary(tgz);
    console.log(`✓  (${Math.round(tarBuf.length / 1024)} KB tgz)`);

    // Extract woff2 files for latin subset at requested weights
    const tar    = require('zlib');
    const files  = {};
    let   offset = 0;

    // Simple streaming tar parser — no dependencies needed
    function readTar(buf) {
        const entries = {};
        let pos = 0;
        while (pos + 512 <= buf.length) {
            const header = buf.slice(pos, pos + 512);
            if (header.every(b => b === 0)) break;
            const name = header.slice(0, 100).toString('utf8').replace(/\0/g, '');
            const size = parseInt(header.slice(124, 136).toString('utf8').trim(), 8) || 0;
            const data = buf.slice(pos + 512, pos + 512 + size);
            entries[name] = data;
            pos += 512 + Math.ceil(size / 512) * 512;
        }
        return entries;
    }

    // Decompress tgz
    const tarBufDecompressed = await new Promise((res, rej) =>
        zlib.gunzip(tarBuf, (e, d) => e ? rej(e) : res(d))
    );
    const entries = readTar(tarBufDecompressed);

    const results = [];
    for (const weight of weights) {
        // fontsource filenames: package/files/inter-latin-400-normal.woff2
        const fname = `package/files/${family.toLowerCase().replace(/ /g, '-')}-latin-${weight}-normal.woff2`;
        const data  = entries[fname];
        if (!data || data.length < 100) {
            console.warn(`     ⚠  ${fname} not found in tarball — skipped`);
            continue;
        }
        results.push({ family, weight: String(weight), style: 'normal', fmt: 'woff2',
                       b64: data.toString('base64') });
        console.log(`     ✓  ${family} ${weight} — ${Math.round(data.length / 1024)} KB`);
    }
    return results;
}

// ── Google Fonts fallback strategy ───────────────────────────────────────────

async function downloadViaGoogleFonts(family, weights) {
    const param = encodeURIComponent(family) + ':wght@' + weights.join(';');
    const cssUrl = `https://fonts.googleapis.com/css2?family=${param}&display=swap`;

    process.stdout.write(`   ↓  ${family} from Google Fonts… `);
    const css = await getText(cssUrl);
    console.log('✓ (got CSS)');

    const blockRe = /@font-face\s*\{([^}]+)\}/g;
    const results = [];
    let m;
    while ((m = blockRe.exec(css)) !== null) {
        const b      = m[1];
        const fam    = (b.match(/font-family:\s*['"]?([^;'"]+)['"]?;/) || [])[1]?.trim();
        const w      = (b.match(/font-weight:\s*([^;]+);/)             || [])[1]?.trim();
        const style  = (b.match(/font-style:\s*([^;]+);/)              || [])[1]?.trim() || 'normal';
        const woff2  = b.match(/url\((https:\/\/fonts\.gstatic\.com[^)]+\.woff2)\)/)?.[1];
        if (fam !== family || !woff2 || !weights.includes(Number(w))) continue;

        const data = await getBinary(woff2);
        results.push({ family: fam, weight: w, style, fmt: 'woff2',
                       b64: data.toString('base64') });
        console.log(`     ✓  ${fam} ${w} — ${Math.round(data.length / 1024)} KB`);
    }
    return results;
}

async function downloadFamily(family, weights) {
    try {
        return await downloadViaFontsource(family, weights);
    } catch (e) {
        console.log(`\n   npm strategy failed (${e.message}), trying Google Fonts…`);
        return await downloadViaGoogleFonts(family, weights);
    }
}

// ── CSS builder ───────────────────────────────────────────────────────────────

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
        console.warn(`  ⚠  ${STYLE_FILE} not found — skipping patch.`);
        return false;
    }
    const src = fs.readFileSync(STYLE_FILE, 'utf8');
    const si  = src.indexOf(SENTINEL_START);
    const ei  = src.indexOf(SENTINEL_END);
    if (si === -1 || ei === -1 || ei <= si) {
        console.warn('  ⚠  Sentinel comments not found in style.css.');
        console.warn(`     Add these two lines to style.css:\n     ${SENTINEL_START}\n     ${SENTINEL_END}`);
        return false;
    }
    const patched = src.slice(0, si) + SENTINEL_START + '\n' +
                    embedCSS + '\n' + SENTINEL_END +
                    src.slice(ei + SENTINEL_END.length);
    fs.writeFileSync(STYLE_FILE, patched, 'utf8');
    return true;
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
    console.log('\n📥  Downloading fonts…\n');

    const interFaces = await downloadFamily('Inter', INTER_WEIGHTS);
    const sgFaces    = await downloadFamily('Space Grotesk', SPACE_GROTESK_WEIGHTS);
    const all        = [...interFaces, ...sgFaces];

    if (all.length === 0) {
        console.error('\n✗  All downloads failed. Check your network connection.');
        process.exit(1);
    }

    const embedCSS = '\n' + all.map(buildBlock).join('\n\n') + '\n';

    // Primary: patch style.css
    if (patchStyleCSS(embedCSS)) {
        const kb = Math.round(fs.statSync(STYLE_FILE).size / 1024);
        console.log(`\n✅  style.css patched — ${all.length} @font-face blocks embedded (style.css now ${kb} KB).`);
        console.log('    Fonts ship with the stylesheet. Zero network needed on any load.\n');
    }

    // Secondary: also write fonts.css
    fs.writeFileSync(FONTS_FILE,
        `/* fonts.css — auto-generated by download-fonts.js\n` +
        `   Same blocks are embedded in style.css.\n` +
        `   Only needed if deploying style.css without the embed. */\n` + embedCSS, 'utf8');
    const fkb = Math.round(fs.statSync(FONTS_FILE).size / 1024);
    console.log(`    Also wrote fonts.css (${fkb} KB) as standalone fallback.`);
}

main().catch(e => { console.error('\n✗', e.message); process.exit(1); });
