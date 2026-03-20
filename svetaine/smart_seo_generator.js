require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

function fixCapitals(text) {
    const exceptions = ['mantas', 'katkevičius', 'vilnius', 'kaunas', 'klaipėda', 'nt', 'seo', 'vmi', 'gpm'];
    return text.replace(/(:\s+)([A-ZŽĄĘĖĮŠŲŪČ])([a-zžąęėįšųūč]+)/g, (match, prefix, firstLetter, restOfWord) => {
        const fullWord = firstLetter + restOfWord;
        if (exceptions.includes(fullWord.toLowerCase())) return match;
        return prefix + firstLetter.toLowerCase() + restOfWord;
    });
}

function buildTitle(keyword, action) {
    const intrigues = ["15% brangiau", "greičiau", "išvenkite klaidų", "maksimali kaina", "Kaune", "patarimai"];
    let intrigue = intrigues[Math.floor(Math.random() * intrigues.length)];
    
    let shortKey = keyword;
    if (shortKey.length > 25) {
        shortKey = shortKey.substring(0, 25).trim();
    }
    
    let candidate = `${shortKey}: ${intrigue} | Mantas Katkevičius`;
    if (candidate.length > 60) {
        candidate = `${shortKey} Kaune | M. Katkevičius`;
        if (candidate.length > 60) {
            candidate = `${shortKey.substring(0,20)}... | M. Katkevičius`;
        }
    }
    return fixCapitals(candidate);
}

function buildDesc(title, action) {
    const templates = [
        `Skaudi klaida? Sėkmingas NT {action} Kaune reikalauja specifinių žinių. M. Katkevičius dalinasi patarimais. Spauskite ir sužinokite detales!`,
        `NT {action} Kaune kelia stresą? Apsaugokite savo pinigus naudodami Manto Katkevičiaus strategijas. Atidarykite šį straipsnį ir skaitykite iškart!`,
        `Saugus NT {action} neįmanomas be plano. Atraskite ekspertines įžvalgas, užtikrinančias ramybę ir geresnę vertę. Spauskite čia ir sužinokite daugiau!`
    ];
    let tpl = templates[Math.floor(Math.random() * templates.length)];
    return tpl.replace(/{action}/g, action);
}

async function processSeo() {
  console.log("Fetching articles...");
  const { data: allRecords, error } = await supabase.from('tinklarastis_irasai').select('id, pavadinimas, kategorija');
  if (error) {
      console.error(error); return;
  }
  
  let updatedCount = 0;
  for (const record of allRecords) {
      const pav = record.pavadinimas || "";
      let action = "pardavimas";
      if (pav.toLowerCase().includes("pirkim") || (record.kategorija && record.kategorija.toLowerCase() === 'pirkėjams')) action = "pirkimas";
      if (pav.toLowerCase().includes("nuom") || (record.kategorija && record.kategorija.toLowerCase() === 'nuoma')) action = "nuoma";
      if (pav.toLowerCase().includes("invest")) action = "investavimas";

      const newTitle = buildTitle(pav, action);
      const newDesc = buildDesc(newTitle, action);

      const payload = {
          seo_title: newTitle,
          seo_description: newDesc
      };

      const { error: updateErr } = await supabase
        .from('tinklarastis_irasai')
        .update(payload)
        .eq('id', record.id);

      if (updateErr) {
          console.error(`Error ID ${record.id}:`, updateErr.message);
      } else {
          updatedCount++;
      }
  }
  console.log(`Successfully generated Top Tier SEO for ${updatedCount} articles!`);
}

processSeo().catch(console.error);
