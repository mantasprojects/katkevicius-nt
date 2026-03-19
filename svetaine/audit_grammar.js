const { createClient } = require("@supabase/supabase-js");
require("dotenv").config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

function isTitleCase(text) {
  if (!text) return false;
  const words = text.split(' ').filter(w => w.length > 2);
  if (words.length <= 1) return false;
  let caps = 0;
  words.forEach(w => {
    if (w[0] === w[0].toUpperCase() && w[0].match(/[A-ZĄČĘĖĮŠŲŪŽ]/)) caps++;
  });
  return caps / words.length > 0.6; // strict 60%
}

function fixTitleCase(text) {
  if (!text) return text;
  const words = text.split(' ');
  const fixed = words.map((word, index) => {
    if (index === 0) return word;
    const cleanWord = word.replace(/[,.!?:;]/g, '');
    const properNouns = ["Kaunas", "Kaune", "Kauno", "Vilnius", "Vilniuje", "Klaipėda", "Lietuva", "Lietuvoje", "Mantas", "Katkevičius", "NT"];
    if (properNouns.includes(cleanWord)) return word;
    if (cleanWord === cleanWord.toUpperCase() && cleanWord.length > 1) return word; // PVM, UAB
    return word.toLowerCase();
  });
  return fixed.join(' ');
}

async function runAudit() {
  try {
    // 1. Audit tinklarastis_irasai
    const { data: posts, error: pError } = await supabase
      .from("tinklarastis_irasai")
      .select("id, pavadinimas, seo_title");

    if (pError) throw pError;

    console.log("=== TINLARASTIS_IRASAI AUDIT ===");
    let pCount = 0;
    posts.forEach(p => {
      const showTitleCase = isTitleCase(p.pavadinimas) || isTitleCase(p.seo_title);
      if (showTitleCase) {
        console.log(`\n[ID: ${p.id}]`);
        console.log(`Prieš (Title):  ${p.pavadinimas}`);
        console.log(`Po (Title):     ${fixTitleCase(p.pavadinimas)}`);
        if (p.seo_title) {
          console.log(`Prieš (SEO):    ${p.seo_title}`);
          console.log(`Po (SEO):       ${fixTitleCase(p.seo_title)}`);
        }
        pCount++;
      }
    });
    console.log(`\nViso įtariamų Title Case įrašų Bloge: ${pCount}`);

    // 2. Lookup other tables names
    const { data: tables, error: tError } = await supabase
      .from('faq')
      .select('*')
      .limit(1)
      .maybeSingle();

    console.log("\n[Info] Ar egizstuoja 'faq' lentelė:", !tError && tables ? "Taip" : "Ne/Klaida");

  } catch (err) {
    console.error("Audit error:", err);
  }
}

runAudit();
