const fs = require('fs');
const https = require('https');
const http = require('http');

const filePath = 'c:\\Users\\manta\\OneDrive\\Desktop\\SVETAINĖ\\svetaine\\src\\data\\blog-posts.json';
const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

console.log(`Throttled HTTP check for ${data.length} images...`);

async function checkUrl(url, id) {
    return new Promise((resolve) => {
        if (!url || !url.startsWith('http')) {
            resolve({ id, url, status: 'INVALID' });
            return;
        }

        const client = url.startsWith('https') ? https : http;
        const request = client.get(url, (res) => {
            if (res.statusCode >= 200 && res.statusCode < 400) {
                resolve({ id, url, status: 'OK', code: res.statusCode });
            } else {
                console.log(`[FAIL] ${id} -> Status: ${res.statusCode} | URL: ${url}`);
                resolve({ id, url, status: 'FAIL', code: res.statusCode });
            }
        });

        request.on('error', (err) => {
            resolve({ id, url, status: 'ERROR', message: err.message });
        });

        // 15 seconds timeout
        request.setTimeout(15000, () => {
            request.destroy();
            console.log(`[TIMEOUT] ${id}`);
            resolve({ id, url, status: 'TIMEOUT' });
        });
    });
}

const delay = ms => new Promise(res => setTimeout(res, ms));

async function run() {
    const results = [];
    const batchSize = 3; // Smaller batch size to prevent overwhelm
    for (let i = 0; i < data.length; i += batchSize) {
        const batch = data.slice(i, i + batchSize);
        console.log(`Processing batch ${i / batchSize + 1} of ${Math.ceil(data.length / batchSize)}...`);
        const promises = batch.map(p => checkUrl(p.image, p.id));
        const batchResults = await Promise.all(promises);
        results.push(...batchResults);
        await delay(300); // 300ms cooldown between batches
    }

    const failed = results.filter(r => r.status !== 'OK');
    console.log("\n=== SUMMARY ===");
    console.log(`Total: ${results.length}`);
    console.log(`Passed: ${results.length - failed.length}`);
    console.log(`Failed/Timeout: ${failed.length}`);

    fs.writeFileSync('failed_images_throttled.json', JSON.stringify(failed, null, 2));
    console.log("Results saved to failed_images_throttled.json");
}

run();
