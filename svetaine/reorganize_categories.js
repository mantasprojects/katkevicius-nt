const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

// 1. Pagrindinės apjungimo taisyklės
const categoryMerges = {
  "Investicijos": "Investavimas",
  "Mokesčiai": "Teisė",
  "Saugumas": "Inovacijos",
  "Vertinimas": "Rinkos Analizė",
  "Projektai": "Patarimai",
  "Marketingas": "Patarimai"
};

// 2. Raktiniai žodžiai perkėlimui iš "Patarimai"
const keywordMappings = {
  "Rinkos Analizė": ["rinka", "kainos", "mikrorajonas", "šančiai", "aleksotas", "žaliakalnis", "vičiūnai", "dainava", "eiguliai", "vilijampolė", "vytėnai", "panemunė"],
  "Teisė": ["sutartis", "notaras", "paveldėjimas", "rankpinigiai", "mokesčiai", "gpm", "servitutas", "apsaugos zona", "baigtumas", "kadastriniai", "teisiniai"],
  "Investavimas": ["nuoma", "investavimas", "atsipirkimas", "pajamingumas", "flipas", "subnuoma"],
  "Remontas": ["remontas", "sienos", "glaistas", "dažymas", "trinkelės", "drenažas", "veja", "izoliacija"]
};

function determineCategory(post) {
  let cat = post.kategorija || 'Patarimai';
  const title = (post.pavadinimas || '').toLowerCase();

  // A. Apjungimas
  if (categoryMerges[cat]) {
    return categoryMerges[cat];
  }

  // B. Šalutinis perkėlimas tik jei kategorija yra "Patarimai" (bendrinė)
  if (cat === 'Patarimai' || !cat) {
    for (const [targetCat, keywords] of Object.entries(keywordMappings)) {
      const match = keywords.some(keyword => title.includes(keyword));
      if (match) {
        // console.log(`[Reclassify] "${post.pavadinimas}" -> ${targetCat}`);
        return targetCat;
      }
    }
  }

  return cat;
}

async function run() {
  console.log('--- Pradedamas Kategorijų Reorganizavimas ---');

  // 1. Atsisiunčiame VISUS įrašus (kad matytume pilną vaizdą ir neprarastume stulpelių)
  const { data: posts, error } = await supabase
    .from('tinklarastis_irasai')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Klaida parsiunčiant:', error);
    return;
  }

  console.log(`Parsiųsta įrašų: ${posts.length}`);

  let changedCount = 0;
  const updatedPosts = posts.map(post => {
    const newCat = determineCategory(post);
    if (newCat !== post.kategorija) {
      changedCount++;
      return { ...post, kategorija: newCat };
    }
    return post;
  });

  console.log(`Rasta pakeitimų: ${changedCount}`);

  if (changedCount === 0) {
    console.log('Nėra ką keisti.');
    return;
  }

  // 2. Subalansuota statistika prieš siuntimą
  const stats = {};
  updatedPosts.forEach(p => {
    stats[p.kategorija] = (stats[p.kategorija] || 0) + 1;
  });
  console.log('\n--- Naujas Pasiskirstymas ---');
  console.log(stats);

  // 3. Atnaujinti etapais po 50
  const batchSize = 50;
  for (let i = 0; i < updatedPosts.length; i += batchSize) {
    const batch = updatedPosts.slice(i, i + batchSize);
    console.log(`Siunčiama partija: ${i + 1} - ${Math.min(i + batchSize, updatedPosts.length)}`);

    const { error: upsertError } = await supabase
      .from('tinklarastis_irasai')
      .upsert(batch);

    if (upsertError) {
      console.error('Klaida siunčiant partiją:', upsertError);
      break;
    }
  }

  console.log('Kategorijų reorganizavimas baigtas sėkmingai!');
}

run();
