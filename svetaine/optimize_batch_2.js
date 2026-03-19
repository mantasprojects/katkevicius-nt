const fs = require('fs');

const replacements = {
  "ofesus": "pasiūlymus",
  "ofeso": "pasiūlymo",
  "listingas": "skelbimas",
  "listingo": "skelbimo",
  "penthouse": "viršutinio aukšto rezidencija",
  "smart": "išmanus",
  "full-service": "pilno aptarnavimo",
  "Mlada": "Jauna",
  "parodyze": "parodyti",
  "vizualus": "vizualus",
  "Storytelling": "Emocinis pasakojimas"
};

const titleRewrites = {
  "Krosnelė kotedže: Jaukumas prieš priešgaisrinį saugumą ir instaliavimą": "Krosnelė kotedže: Įrengimo taisyklės ir įtaka būsto vertei",
  "Lauko apšvietimas: Nuo vaizdo kamerų aklųjų zonų iki kiemo estetikos": "Lauko apšvietimas: Saugumas ir sklypo vertės didinimas"
};

function generateSeoTitle(title, category) {
  let clean = title.replace(/<[^>]+>/g, '').trim();
  let base = clean.split(':')[0]; 
  let seo = `${base} | NT Kaunas`;
  if (seo.length > 60) {
    seo = `${clean.substring(0, 45)} | NT Kaunas`; // 45 + 12 = 57 chars
  }
  return seo;
}

function generateSeoDescription(content) {
  if (!content) return '';
  let text = content.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  text = text.split('.')[0] + '.'; 
  if (text.length > 155) {
    return text.substring(0, 150) + '...';
  }
  return text;
}

function generateKeywords(title, category) {
  const base = ['nekilnojamasis turtas', 'Kaunas', 'pardavimas', 'būstas'];
  if (category) base.push(category.toLowerCase());
  const words = title.toLowerCase().split(/\s+/).filter(w => w.length > 4);
  const extra = words.slice(0, 3).map(w => w.replace(/[:.,]/g, ''));
  return [...new Set([...base, ...extra])].join(', ');
}

function optimizePost(post) {
  let content = post.turinys || '';
  let title = post.pavadinimas || '';

  // 1. Pavadinimo pritaikymas
  if (titleRewrites[title]) {
    title = titleRewrites[title];
  }

  // 1. Klaidos ir Anglicizmai
  for (const [key, value] of Object.entries(replacements)) {
    const regex = new RegExp(key, 'gi');
    content = content.replace(regex, value);
    title = title.replace(regex, value);
  }

  // 1b. Papildomas tekstinis pritaikymas
  if (post.kategorija === 'Interjeras' && !content.includes('Home Staging')) {
    content = content.replace('</ul>', '</ul><p><strong>NT Eksperto patarimas:</strong> Tinkamas erdvių paruošimas ar apšvietimas ne tik kuria jaukumą, bet ir padidina būsto patrauklumą pirkėjams bent 5-10%.</p>');
  }

  // 2. SEO Meta duomenys
  const seo_title = generateSeoTitle(title, post.kategorija);
  const seo_description = generateSeoDescription(content);
  const focus_keywords = generateKeywords(title, post.kategorija);

  return {
    ...post,
    pavadinimas: title,
    turinys: content,
    seo_title,
    seo_description,
    focus_keywords
  };
}

function run() {
  const posts = require('./batch_2.json');
  const optimized = posts.map(optimizePost);
  fs.writeFileSync('batch_2_optimized.json', JSON.stringify(optimized, null, 2));
  console.log(`Optimizuota ${optimized.length} įrašų. Išsaugota į batch_2_optimized.json`);
}

run();
