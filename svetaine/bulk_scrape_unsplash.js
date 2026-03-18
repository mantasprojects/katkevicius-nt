const fs = require('fs');
const https = require('https');
const path = require('path');

const keywords = [
    'modern-house', 'cozy-interior', 'luxury-home', 'garden-design',
    'scandinavian-design', 'apartment', 'architecture', 'kitchen', 'bathroom', 'real-estate'
];
const pages = [1, 2, 3];

const pool = new Set();
const outputDir = 'c:\\Users\\manta\\OneDrive\\Desktop\\SVETAINĖ\\svetaine';
const outputPath = path.join(outputDir, 'scraped_urls_pool.json');

async function fetchPage(keyword, page) {
    const url = `https://unsplash.com/s/photos/${keyword}?page=${page}`;
    console.log(`Fetching: ${url}`);

    return new Promise((resolve) => {
        https.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            }
        }, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                // Regex to find image URLs
                // Format: https://images.unsplash.com/photo-... or plus.unsplash.com/premium_photo-...
                const regex = /https:\/\/(images|plus)\.unsplash\.com\/(photo|premium_photo)-[a-zA-Z0-9\-]{10,}/g;
                const matches = data.match(regex);

                if (matches) {
                    matches.forEach(match => {
                        // Append standard dimension/format parameters to make it high res
                        if (!match.includes('profile-') && !match.includes('placeholder')) {
                            const fullUrl = `${match}?q=80&w=1200&auto=format&fit=crop`;
                            pool.add(fullUrl);
                        }
                    });
                    console.log(`Found ${matches.length} matches for ${keyword} p.${page}`);
                } else {
                    console.log(`No matches for ${keyword} p.${page}`);
                }
                resolve();
            });
        }).on('error', (err) => {
            console.error(`Error fetching ${url}:`, err.message);
            resolve();
        });
    });
}

async function run() {
    for (const kw of keywords) {
        for (const p of pages) {
            await fetchPage(kw, p);
            await new Promise(r => setTimeout(r, 1000)); // Be respectful to rate limits
        }
    }

    const items = Array.from(pool);
    console.log(`\nTotal Unique Images Found: ${items.length}`);

    fs.writeFileSync(outputPath, JSON.stringify(items, null, 2));
    console.log(`Saved pool to scraped_urls_pool.json`);
}

run();
