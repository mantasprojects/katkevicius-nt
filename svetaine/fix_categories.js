const fs = require('fs');
const path = require('path');

const projectDir = 'c:\\Users\\manta\\OneDrive\\Desktop\\SVETAINĖ\\svetaine';
const postsPath = path.join(projectDir, 'src', 'data', 'blog-posts.json');
const catsPath = path.join(projectDir, 'src', 'data', 'blog-categories.json');

const posts = JSON.parse(fs.readFileSync(postsPath, 'utf8'));
const categories = JSON.parse(fs.readFileSync(catsPath, 'utf8'));

// 1. Find distinct categories from posts
const postCats = [...new Set(posts.map(p => p.category).filter(Boolean))];

console.log("Current articles categories:", postCats);
console.log("Current index categories:", categories.map(c => c.name));

const colors = {
    "Mokesčiai": "#EF4444",
    "Marketingas": "#3B82F6",
    "Vertinimas": "#10B981",
    "Inovacijos": "#8B5CF6",
    "Remontas": "#F59E0B",
    "Saugumas": "#14B8A6",
    "Investavimas": "#D97706"
};

let updated = false;

postCats.forEach(name => {
    if (!categories.find(c => c.name === name)) {
        console.log(`[ADD] Missing category: ${name}`);
        categories.push({
            id: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
            name: name,
            color: colors[name] || "#6B7280"
        });
        updated = true;
    }
});

if (updated) {
    fs.writeFileSync(catsPath, JSON.stringify(categories, null, 2));
    console.log(`\nSuccessfully updated blog-categories.json!`);
} else {
    console.log(`\nAll categories are already in sync.`);
}
