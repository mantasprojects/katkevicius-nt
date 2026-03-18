const fs = require('fs');
const path = require('path');

const data = JSON.parse(fs.readFileSync(path.join(__dirname, 'src', 'data', 'blog-posts.json'), 'utf8'));

const keepKeywords = [
  'pardav', 'pirk', 'nuom', 'invest', 'nt', 'sklyp', 'kotedž', 'but', 
  'dokument', 'vertin', 'deryb', 'teis', 'komerc', 'vertė', 'nt', 'būstą'
];

const removeKeywords = [
  'montavim', 'įrengim', 'apšvietim', 'santechnik', 'protingų namų', 'stikl', 
  'komunalin', 'estetin', 'inžinerinė', 'serviso', 'remont', 'balda', 
  'termo', 'drenazo', 'hidroizolia', 'jungikl', 'latak', 'vėdinin', 'elektri'
];

const categorized = {
  keep: [],
  remove: [],
  uncertain: []
};

data.forEach(p => {
  if (p.content) {
    const matches = p.content.match(/<a[^>]*href=["']\/konsultacija["'][^>]*>(.*?)<\/a>/g);
    if (matches) {
      matches.forEach(m => {
        const text = m.replace(/<\/?[^>]+(>|$)/g, "");
        const lowerText = text.toLowerCase();
        
        let shouldKeep = keepKeywords.some(k => lowerText.includes(k));
        let shouldRemove = removeKeywords.some(k => lowerText.includes(k));

        if (shouldKeep && !shouldRemove) {
          categorized.keep.push({ id: p.id, text });
        } else if (shouldRemove) {
          categorized.remove.push({ id: p.id, text });
        } else {
          // If neither or both, mark uncertain
          categorized.uncertain.push({ id: p.id, text });
        }
      });
    }
  }
});

fs.writeFileSync(path.join(__dirname, 'categorized_links.json'), JSON.stringify(categorized, null, 2));
console.log(`Summary:`);
console.log(`Keep (NT): ${categorized.keep.length}`);
console.log(`Remove (Non-NT): ${categorized.remove.length}`);
console.log(`Uncertain: ${categorized.uncertain.length}`);
console.log(`Saved to categorized_links.json`);
