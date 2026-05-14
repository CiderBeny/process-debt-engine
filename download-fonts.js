#!/usr/bin/env node
/**
 * download-fonts.js
 * Run once: node download-fonts.js
 *
 * Downloads Space Grotesk and Inter woff2 files from Google Fonts CDN,
 * converts them to base64, and writes fonts.css — a self-contained stylesheet
 * with @font-face rules using data: URIs.
 *
 * Output: fonts.css  (referenced by index.html instead of Google Fonts CDN)
 *
 * Requirements: Node 18+ (built-in fetch). No npm install needed.
 */

const fs   = require('fs');
const path = require('path');
const https = require('https');

// ── Helpers ──────────────────────────────────────────────────────────────────

function httpsGet(url) {
    return new Promise((resolve, reject) => {
        const req = https.get(url, {
            headers: {
                // Must send a modern UA — Google Fonts returns woff2 only for
                // browsers that support it; older UAs get ttf.
                'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 ' +
                              '(KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
            }
        }, res => {
            if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
                return resolve(httpsGet(res.headers.location)); // follow redirect
            }
            const chunks = [];
            res.on('data', c => chunks.push(c));
            res.on('end', () => resolve({
                status: res.statusCode,
                headers: res.headers,
                body: Buffer.concat(chunks),
            }));
        });
        req.on('error', reject);
    });
}

async function fetchText(url) {
    const r = await httpsGet(url);
    if (r.status !== 200) throw new Error(`HTTP ${r.status} for ${url}`);
    return r.body.toString('utf8');
}

async function fetchBinary(url) {
    const r = await httpsGet(url);
    if (r.status !== 200) throw new Error(`HTTP ${r.status} for ${url}`);
    return r.body; // Buffer
}

// ── Main ─────────────────────────────────────────────────────────────────────

async function main() {
    const GOOGLE_CSS_URL =
        'https://fonts.googleapis.com/css2' +
        '?family=Space+Grotesk:wght@400;500;600;700' +
        '&family=Inter:wght@300;400;600;700;900' +
        '&display=swap';

    console.log('Fetching font CSS from Google Fonts…');
    const css = await fetchText(GOOGLE_CSS_URL);

    // Extract all url(...) tokens from the CSS
    const urlRe = /url\((https:\/\/fonts\.gstatic\.com[^)]+)\)/g;
    const srcRe  = /src:\s*([^;]+);/g;

    // Parse each @font-face block so we keep family/weight/style metadata
    const blockRe = /@font-face\s*\{([^}]+)\}/g;
    const blocks  = [];
    let m;
    while ((m = blockRe.exec(css)) !== null) {
        const block    = m[1];
        const family   = (block.match(/font-family:\s*['"]?([^;'"]+)['"]?;/) || [])[1]?.trim();
        const weight   = (block.match(/font-weight:\s*([^;]+);/)            || [])[1]?.trim();
        const style    = (block.match(/font-style:\s*([^;]+);/)             || [])[1]?.trim() || 'normal';
        const urlMatch = block.match(/url\((https:\/\/fonts\.gstatic\.com[^)]+)\)/);
        const fmtMatch = block.match(/format\(['"]?(\w+)['"]?\)/);
        if (family && urlMatch) {
            blocks.push({
                family,
                weight: weight || '400',
                style,
                url:    urlMatch[1],
                fmt:    fmtMatch?.[1] || 'woff2',
            });
        }
    }

    // Only keep the two families we use
    const wanted = blocks.filter(b =>
        ['Space Grotesk', 'Inter'].includes(b.family)
    );

    if (wanted.length === 0) {
        console.error('No matching font faces found — check the Google Fonts URL.');
        process.exit(1);
    }

    console.log(`Found ${wanted.length} font face(s) to download.`);

    let fontCSS = `/* ============================================================
   fonts.css — Self-hosted font faces (auto-generated)
   Run: node download-fonts.js   to regenerate.
   
   These @font-face rules use base64-encoded data: URIs so the
   page renders correctly with no external network dependency,
   including on corporate networks that block fonts.gstatic.com.
   ============================================================ */\n\n`;

    for (const face of wanted) {
        console.log(`  Downloading ${face.family} ${face.weight} ${face.style}…`);
        try {
            const buf = await fetchBinary(face.url);
            const b64 = buf.toString('base64');
            fontCSS +=
`@font-face {
    font-family: '${face.family}';
    font-style:  ${face.style};
    font-weight: ${face.weight};
    font-display: swap;
    src: url('data:font/${face.fmt};base64,${b64}') format('${face.fmt}');
}\n\n`;
            console.log(`    ✓ ${face.family} ${face.weight} (${Math.round(buf.length/1024)} KB)`);
        } catch (e) {
            console.warn(`    ✗ Skipped: ${e.message}`);
        }
    }

    fs.writeFileSync(path.join(__dirname, 'fonts.css'), fontCSS, 'utf8');
    console.log('\n✅  fonts.css written. Replace the Google Fonts <link> in index.html with:');
    console.log('    <link rel="stylesheet" href="fonts.css">');
}

main().catch(e => { console.error(e); process.exit(1); });
