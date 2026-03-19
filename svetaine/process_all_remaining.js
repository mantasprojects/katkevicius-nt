const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // Naudojame Service Role raktą

const supabase = createClient(supabaseUrl, supabaseKey);

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
  "Home Office apšvietimas: Sveikos akys ir produktyvumas dirbant iš namų": "Home Office apšvietimas: Produktyvumas ir nauda būsto vertei",
  "Lubų aukštis interjere: 2.50m vs 2.80m ir kodėl 30 cm keičia absoliučiai viską": "Lubų aukštis interjere: Erdvesnis būstas ir įtaka pardavimo kainai",
  "Laiptų apšvietimas: Sieniniai šviestuvai prieš LED juostas pakopose": "Laiptų apšvietimas: Kaip pabrėžti dizainą ir kelti būsto vertę",
  "Buitinė technika virtuvėje: Integruota ar atskira spintelėse?": "Buitinė technika virtuvėje: Integruota technika ir būsto likvidumas",
  "Laiptų turėklai: Medis, Stiklas ar Metalas? Saugumo ir dizaino balansas": "Laiptų turėklai: Medis, Stiklas ar Metalas? Įtaka būsto vertei",
  "Vonios baldų medžiagos: Kodėl standartinė MDP plokštė išsipučia per 1 metus?": "Vonios baldų medžiagos: Drėgmės atsparumas ir būsto vertė",
  "Roletai su kreipiančiosiomis: Kodėl tai geriausias pasirinkimas varstomiems langams": "Roletai su kreipiančiosiomis: Langų paruošimas būsto pardavimui",
  "Virtuvės sienelė (Splashback): Grūdintas stiklas prieš plyteles": "Virtuvės sienelė (Splashback): Praktiški sprendimai būsto vertei kelti",
  "Elektra vonioje: Kokios IP apsaugos (IP44, IP65) šviestuvai būtini virš dušo?": "Elektra vonioje: Saugumo standartai ir būsto techninė kokybė",
  "Roletų tvirtinimas bez gręžimo: Užkabinami laikikliai išvengiant rėmo gręžimo": "Roletų tvirtinimas: Greitas būsto paruošimas pirkėjų apžiūrai",
  "Kriauklė ant stalviršio (Bowl): Gražu, bet ar patogu prižiūrėti kasdien?": "Kriauklė ant stalviršio: Dizaino sprendimai būsto likvidumui",
  "Maišytuvas iš sienos: Prabangūs dizainas ir montavimo klaidos plytelėse": "Maišytuvas iš sienos: Prabangos įspūdis parduodant būstą",
  "Vaikų saugumas prie langų: Apsauginės rankenėlės su užraktais (Mygtukai)": "Vaikų saugumas prie langų: Šeimos būsto paruošimas pardavimui"
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

  if (titleRewrites[title]) {
    title = titleRewrites[title];
  }

  for (const [key, value] of Object.entries(replacements)) {
    const regex = new RegExp(key, 'gi');
    content = content.replace(regex, value);
    title = title.replace(regex, value);
  }

  if (post.kategorija === 'Interjeras' && !content.includes('Home Staging')) {
    content = content.replace('</ul>', '</ul><p><strong>NT Eksperto patarimas:</strong> Tinkamas erdvių paruošimas ar apšvietimas ne tik kuria jaukumą, bet ir padidina būsto patrauklumą pirkėjams bent 5-10% (Home Staging efektas).</p>');
  }

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

async function processAll() {
  const remaining = require('./remaining_titles.json');
  const ids = remaining.map(item => item.id);
  const batchSize = 50;

  console.log(`Pradedamas masinis procesas. Iš viso apdoroti: ${ids.length} įrašų.`);

  for (let i = 0; i < ids.length; i += batchSize) {
    const batchIds = ids.slice(i, i + batchSize);
    console.log(`Apdorojamas etapas: ${i + 1} - ${Math.min(i + batchSize, ids.length)}`);

    // 1. Atsisiųsti pilnus įrašus
    const { data: fetchedPosts, error: fetchError } = await supabase
      .from('tinklarastis_irasai')
      .select('*')
      .in('id', batchIds);

    if (fetchError) {
      console.error(`Klaida parsiunčiant etapą ${i}:`, fetchError);
      continue;
    }

    // 2. Optimizuoti
    const optimizedPosts = fetchedPosts.map(optimizePost);

    // 3. Atnaujinti Supabase
    const { data, error: upsertError } = await supabase
      .from('tinklarastis_irasai')
      .upsert(optimizedPosts);

    if (upsertError) {
      console.error(`Klaida atnaujinant etapą ${i}:`, upsertError);
    } else {
      console.log(`Sėkmingai atnaujinta ${optimizedPosts.length} įrašų.`);
    }
  }

  console.log('Masinis procesas baigtas!');
}

processAll();
