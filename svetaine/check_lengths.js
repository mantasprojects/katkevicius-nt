const fs = require('fs');

const posts = require('./batch_2_optimized.json');

posts.forEach((post, index) => {
  const fields = ['seo_title', 'focus_keywords', 'slug', 'pavadinimas', 'kategorija'];
  fields.forEach(field => {
    if (post[field] && post[field].length > 60) {
      console.log(`[Item ${index}] ${field} length: ${post[field].length}`);
      console.log(`Value: "${post[field]}"`);
      console.log('---');
    }
  });
});
