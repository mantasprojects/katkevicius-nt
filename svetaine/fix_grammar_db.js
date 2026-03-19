const { createClient } = require("@supabase/supabase-js");
require("dotenv").config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

function fixTitleCase(text) {
  if (!text) return text;
  
  const segments = text.split(/(\? |\! |\.\s?)/);
  
  const fixedSegments = segments.map((seg, idx) => {
    if (idx % 2 === 1) return seg; 
    if (!seg.trim()) return seg;

    const words = seg.split(' ');
    const fixedWords = words.map((word, wIdx) => {
      if (wIdx === 0) return word; 
      
      const cleanWord = word.replace(/[,.!?:;()"-]/g, '');
      const properNouns = ["Kaunas", "Kaune", "Kauno", "Kauną", "Vilnius", "Vilniuje", "Klaipėda", "Lietuva", "Lietuvoje", "Mantas", "Katkevičius", "NT"];
      if (properNouns.includes(cleanWord)) return word;
      
      if (cleanWord === cleanWord.toUpperCase() && cleanWord.length > 1 && cleanWord.match(/[A-Z]/)) {
         return word; 
      }
      return word.toLowerCase();
    });
    return fixedWords.join(' ');
  });
  
  return fixedSegments.join('');
}

async function runUpdate() {
  try {
    const { data: posts, error } = await supabase
      .from("tinklarastis_irasai")
      .select("id, pavadinimas, seo_title");

    if (error) throw error;

    let count = 0;
    for (const p of posts) {
      const fixedTitle = fixTitleCase(p.pavadinimas);
      const fixedSeo = fixTitleCase(p.seo_title);

      if (fixedTitle !== p.pavadinimas || (p.seo_title && fixedSeo !== p.seo_title)) {
        const payload = {
          pavadinimas: fixedTitle
        };
        if (p.seo_title) payload.seo_title = fixedSeo;

        const { error: uError } = await supabase
          .from("tinklarastis_irasai")
          .update(payload)
          .eq("id", p.id);

        if (uError) {
          console.error(`Klaida atnaujinant įrašą ${p.id}:`, uError);
        } else {
          count++;
        }
      }
    }
    console.log(`\n✅ Sėkmingai sutvarkyta gramatika ir didžiosios raidės ${count} straipsniuose!`);

  } catch (err) {
    console.error("Update error:", err);
  }
}

runUpdate();
