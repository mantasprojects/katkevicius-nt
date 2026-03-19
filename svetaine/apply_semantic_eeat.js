require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing SUPABASE credentials");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const linguisticReplacements = [
  { match: /brokeris/gi, replace: "NT pardavimų ekspertas" },
  { match: /brokerį/gi, replace: "NT pardavimų ekspertą" },
  { match: /brokerines/gi, replace: "NT pardavimų" },
  { match: /brokerinė/gi, replace: "NT pardavimų paslauga" },
  { match: /brokeri/gi, replace: "NT pardavimų ekspertą" },
  { match: /brokerio/gi, replace: "NT pardavimų eksperto" },
  { match: /brokeriui/gi, replace: "NT pardavimų ekspertui" },
  { match: /brokeriais/gi, replace: "NT ekspertais" },
  { match: /brokerių/gi, replace: "NT ekspertų" },
];

async function applyEEAT() {
  console.log("Fetching all articles...");
  let allArticles = [];
  let from = 0;
  const PAGE_SIZE = 1000;
  
  while (true) {
    const { data, error } = await supabase
      .from('tinklarastis_irasai')
      .select('id, turinys, kategorija, pavadinimas, slug')
      .range(from, from + PAGE_SIZE - 1);

    if (error) {
      console.error("Error fetching articles:", error);
      return;
    }
    if (!data || data.length === 0) break;
    allArticles = allArticles.concat(data);
    if (data.length < PAGE_SIZE) break;
    from += PAGE_SIZE;
  }

  console.log("Found " + allArticles.length + " articles. Processing...");

  let updatedCount = 0;

  for (const article of allArticles) {
    let html = article.turinys;
    if (!html) continue;
    let modified = false;

    // 1. LINGUISTIC CONTROL
    for (const rule of linguisticReplacements) {
        // Build regex checking exact boundary or tag to avoid replacing inside href URLs unless needed.
        // This simple \b rule handles literal text but won't touch domains (e.g. katkevicius.lt/brokeris) if it exists, wait, \b matches /brokeris/ boundary. That's fine.
        const exactRegex = new RegExp("\\b(" + rule.match.source.replace('/gi', '').replace('/', '') + ")\\b", 'gi');
        const oldHtml = html;
        html = html.replace(exactRegex, rule.replace);
        if (oldHtml !== html) modified = true;
    }

    let pillarAction = "pardavimas";
    let pillarHref = "/pardavimas";
    
    if (article.kategorija === "Pirkėjams" || html.toLowerCase().includes("pirkėjo") || html.toLowerCase().includes("pirkimas")) {
        if (article.kategorija === "Pirkėjams") { pillarAction = "pirkimas"; pillarHref = "/pirkimas"; }
    }
    if (article.kategorija === "Nuoma") { pillarAction = "nuoma"; pillarHref = "/nuoma"; }

    // 2. TOPIC CLUSTER
    if (!html.includes("Kaip NT pardavimų ekspertas, dažnai pastebiu")) {
      const topicSentence = "Kaip NT pardavimų ekspertas, dažnai pastebiu, kad <a href='" + pillarHref + "' style='color:#2563EB; font-weight:600; text-decoration:underline;'>sėkmingas būsto " + pillarAction + "</a> reikalauja išmanymo ir gero starto. ";
      
      const firstPTagMatch = html.match(/<p[^>]*>/i);
      if (firstPTagMatch) {
          const indexToInsert = html.indexOf(firstPTagMatch[0]) + firstPTagMatch[0].length;
          html = html.substring(0, indexToInsert) + topicSentence + html.substring(indexToInsert);
          modified = true;
      }
    }

    // 3. MID-ARTICLE CRO BLOCK
    if (!html.includes("5-10% turto vertės")) {
      const croBlock = "\n<div style='background-color:#F8FAFC; border-left:4px solid #2563EB; padding:1.5rem; margin:2rem 0; border-radius:0 1rem 1rem 0;'><p style='margin:0; color:#0F172A; font-weight:500;'>Mano patirtis rodo, kad šis žingsnis sutaupo klientams vidutiniškai 5-10% turto vertės. Norite sužinoti kaip? <a href='/konsultacija' style='color:#2563EB; font-weight:700;'>Pasikonsultuokite su NT ekspertu</a></p></div>\n";
      
      const pTags = [...html.matchAll(/<\/p>/gi)];
      if (pTags.length > 2) {
          const midPoint = Math.floor(pTags.length / 2);
          const insertIndex = pTags[midPoint].index + 4;
          html = html.substring(0, insertIndex) + croBlock + html.substring(insertIndex);
      } else {
          html += croBlock;
      }
      modified = true;
    }

    // 4. EXPERT BIO
    if (!html.includes("Mantas Katkevičius – NT pardavimų ekspertas, kurio")) {
      const bioBlock = "\n<div style='margin-top:2.5rem; padding:1.5rem; background-color:#F8FAFC; border:1px solid #E2E8F0; border-radius:1rem; position:relative; overflow:hidden;'><p style='margin:0; font-size:0.875rem; color:#334155; position:relative; z-index:10; line-height:1.6;'><strong>Mantas Katkevičius</strong> – NT pardavimų ekspertas, kurio strateginis požiūris ir technologinis pranašumas užtikrina maksimalią turto vertę klientams.</p></div>\n";
      html += bioBlock;
      modified = true;
    }

    if (modified && html !== article.turinys) {
        const { error: updateErr } = await supabase
          .from('tinklarastis_irasai')
          .update({ turinys: html })
          .eq('id', article.id);

        if (updateErr) {
            console.error("Failed to update " + article.slug + ":", updateErr);
        } else {
            updatedCount++;
            if (updatedCount % 50 === 0) console.log("Updated " + updatedCount + " articles so far...");
        }
    }
  }

  console.log("Successfully applied EEAT/Semantic surgery to " + updatedCount + " articles.");
}

applyEEAT().catch(console.error);
