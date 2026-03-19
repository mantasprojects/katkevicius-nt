const fs = require('fs');

// Žodynas klaidų taisymui ir anglicizmų keitimui
const replacements = {
  'Mlada': 'Jauna', // Pvz: Mlada šeimos
  'parodyze': 'parodyti',
  'miegamajasis': 'miegamasis',
  'reikalauja tobulas pagrindo': 'reikalauja tobulai paruošto pagrindo',
  'listingas': 'skelbimas',
  'penthouse': 'viršutinio aukšto rezidencija',
  'developeris': 'vystytojas',
  'parkingas': 'parkavimas',
  'ofesus': 'pasiūlymus', // "teikti oficialius pasiūlymus (ofesus)"
};

function stripHtml(html) {
  return html.replace(/<[^>]*>?/gm, '');
}

function generateSeoTitle(title, category) {
  let seoTitle = `${title} | NT Kaunas`;
  if (seoTitle.length > 60) {
    seoTitle = title.substring(0, 50) + '... | NT';
  }
  return seoTitle;
}

function generateSeoDescription(content) {
  const text = stripHtml(content);
  // Paimti pirmus 150 simbolių, nukirpti iki sakinio galo arba tarpo
  let desc = text.substring(0, 150);
  if (text.length > 150) {
    desc += '...';
  }
  return desc.trim();
}

function generateKeywords(title, category) {
  const base = ['nekilnojamasis turtas', 'Kaunas', 'pardavimas'];
  if (category) base.push(category.toLowerCase());
  
  // Pridėti žodžius iš pavadinimo (išvalius)
  const words = title.toLowerCase()
    .replace(/[.,/#!$%^&*;:{}=\-_`~()]/g,"")
    .split(' ')
    .filter(w => w.length > 4); // tik ilgesni žodžiai
    
  // Paimti 2 papildomus žodžius
  const extra = words.slice(0, 2);
  
  return [...new Set([...base, ...extra])].join(', ');
}

// Titulinių pavadinimų pritaikymas NT rėmams (Interjeras -> Home Staging / Būsto Vertė)
const titleRewrites = {
  "Veidrodžiai interjere: 5 taisyklės, kaip vizualiai padvigubinti kambario plotą": "Veidrodžiai interjere: Kaip vizualiai padidinti būsto erdvę pardavimui",
  "Virtuvės sala: Ergonomikos taisyklės ir įtaka bendrai namų erdvei": "Virtuvės sala: Ergonomika ir įtaka būsto vertei",
  "Vonios kambario apšvietimas: Trys zonos, garantuojančios SPA pojūtį": "Vonios kambario apšvietimas: Kaip pabrėžti prabangą parduodant",
  "Vaiko kambarys, kuris „auga“ kartu: Kaip sutaupyti baldų sąskaita ateityje": "Vaiko kambarys: Kaip įrengti universalią erdvę būsto vertei didinti",
  "Miego kokybė ir interjeras: Trūkstantis deguonis bei teisingas patamsinimas": "Miego kokybė: Miegamojo paruošimas būsto pirkėjams",
  "Prieškambaris be netvarkos: Kaip suprojektuoti batinę ir drabužių zonas": "Prieškambaris: Pirmojo įspūdžio kūrimas parduodant būstą",
  "Atviros lentynos vs Uždaros spintos: Estetika vs Praktinė priežiūra": "Atviros lentynos vs Uždaros spintos: Įtaka būsto vertei",
  "Epoksidinės grindys namuose: Nuo rūsio iki modernios svetainės": "Epoksidinės grindys: Šiuolaikiškas sprendimas būsto vertei kelti",
  "Spalvų temperatūra (Kelvinai): Kaip nepadaryti svetainės panašios į ligoninę": "Spalvų temperatūra: Būsto apšvietimas prieš fotosesiją",
  "Terasos įrengimas: Medis vs Termomediena vs WPC kompozitas": "Terasos įrengimas: Nuosavo kiemo privalumai parduodant būstą"
};

function optimizePost(post) {
  let content = post.turinys || '';
  let title = post.pavadinimas || '';

  // 1. Pavadinimo pritaikymas griežtesniam NT rėmui (Rewrite)
  if (titleRewrites[title]) {
    title = titleRewrites[title];
  }

  // 1. Klaidos ir Anglicizmai
  for (const [key, value] of Object.entries(replacements)) {
    const regex = new RegExp(key, 'gi'); // case insensitive
    content = content.replace(regex, value);
    title = title.replace(regex, value);
  }

  // 1b. Papildomas tekstinis pritaikymas (jei reikia)
  if (post.kategorija === 'Interjeras' && !content.includes('Home Staging')) {
    content = content.replace('</ul>', '</ul><p><strong>NT Eksperto patarimas:</strong> Tinkamas interjero paruošimas (Home Staging) gali padidinti būsto vertę bent 5-10% ir pagreitinti pardavimą.</p>');
  }

  // 2. SEO Meta duomenys
  const seo_title = generateSeoTitle(title, post.kategorija);
  const seo_description = generateSeoDescription(content);
  const focus_keywords = generateKeywords(title, post.kategorija);

  return {
    ...post,
    pavadinimas: title,
    turinys: content,
    seo_title: post.seo_title || seo_title, // nekeisti jei jau yra (nors dabar null)
    seo_description: post.seo_description || seo_description,
    focus_keywords: post.focus_keywords || focus_keywords
  };
}

function main() {
  const posts = require('./batch_1.json');
  const optimizedPosts = posts.map(optimizePost);
  
  fs.writeFileSync('batch_1_optimized.json', JSON.stringify(optimizedPosts, null, 2));
  console.log(`Optimizuota ${optimizedPosts.length} įrašų. Išsaugota į batch_1_optimized.json`);
}

main();
