// Run with node --use-system-ca; never disable certificate validation.
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');

(async function () {
    const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
    const tags = [...html.matchAll(/<script\b[^>]*src="(https:[^"]+)"[^>]*>/g)];
    const results = await Promise.all(tags.map(async ([tag, url]) => {
        const pin = tag.match(/integrity="([^"]+)"/);
        if (!pin) return { url, status: 'unpinned', note: 'Mutable third-party executable script' };
        try {
            const response = await fetch(url, { signal: AbortSignal.timeout(20000) });
            if (!response.ok) throw new Error('HTTP ' + response.status);
            const bytes = Buffer.from(await response.arrayBuffer());
            const actual = 'sha384-' + crypto.createHash('sha384').update(bytes).digest('base64');
            return { url, status: actual === pin[1] ? 'verified' : 'mismatch', bytes: bytes.length, expected: pin[1], actual };
        } catch (error) { return { url, status: 'unverified', error: error.message }; }
    }));
    console.log(JSON.stringify(results, null, 2));
    if (results.some(result => result.status === 'mismatch' || result.status === 'unverified')) process.exitCode = 1;
})().catch(error => { console.error(error); process.exitCode = 1; });
