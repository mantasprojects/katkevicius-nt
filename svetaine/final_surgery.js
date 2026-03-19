import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Trūksta Supabase kintamųjų .env.local faile.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Raktiniai žodžiai temų nustatymui
const pardavimasKeywords = ['pardavimas', 'parduoti', 'kaina', 'vertė', 'pasiutimas', 'pelnas', 'greitai', 'strategija'];
const pirkimasKeywords = ['pirkimas', 'pirkti', 'ieško', 'investuoti', 'paskola', 'euribor', 'palūkanos'];
const nuomaKeywords = ['nuoma', 'nuomoti', 'nuomininkai', 'nuomojamas'];

function cleanAndAppendContextualLink(content, title, category) {
    if (!content) return content;
    let text = content;

    // 1. Pašalinti seną generic konsultacijos tekstą (ir visus susijusius a, p tagus)
    const badRegexLink = /(?:\s|<br\/?>)*<a [^>]*>Konsultacija dėl nekilnojamojo turto vertės kėlimo\.?<\/a>\.?/gi;
    const badRegexText = /(?:\s|<br\/?>)*Konsultacija dėl nekilnojamojo turto vertės kėlimo\.?/gi;
    
    text = text.replace(badRegexLink, '');
    text = text.replace(badRegexText, '');

    // 2. Išvalyti tuščius paragrafus ar break'us, atsiradusius po valymo
    text = text.replace(/<p>\s*<\/p>/gi, '');
    text = text.replace(/<p>&nbsp;<\/p>/gi, '');
    text = text.replace(/(<br\/?>\s*)+$/gi, '');
    text = text.trim();

    // 3. Kontekstinis nustatymas
    const fullText = (title + ' ' + text).toLowerCase();
    
    let topic = 'pardavimas'; // Manto pagrindinė specializacija
    let countPardavimas = pardavimasKeywords.filter(k => fullText.includes(k)).length;
    let countPirkimas = pirkimasKeywords.filter(k => fullText.includes(k)).length;
    let countNuoma = nuomaKeywords.filter(k => fullText.includes(k)).length;

    if (countNuoma > countPardavimas && countNuoma > countPirkimas) {
        topic = 'nuoma';
    } else if (countPirkimas > countPardavimas && countPirkimas > countNuoma) {
        topic = 'pirkimas';
    } else if (countPardavimas > 0) {
        topic = 'pardavimas';
    } else {
        if (category === 'Investavimas') topic = 'pirkimas';
    }

    // Patikrinti, ar jau neįdėta tokia nuoroda (jei skriptą leisime kelis kartus)
    if (text.includes("NT pardavimo strategiją čia") || 
        text.includes("pirkimo atstovavimo procesu") || 
        text.includes("NT nuomos valdymą")) {
        return text;
    }

    // 4. Įterpimas pagal temą
    let appendedText = "";
    if (topic === 'pardavimas') {
        appendedText = '<p>Sužinokite daugiau apie mano taikomą <a href="/pardavimas">NT pardavimo strategiją čia</a>.</p>';
    } else if (topic === 'pirkimas') {
        appendedText = '<p>Susipažinkite su <a href="/pirkimas">pirkimo atstovavimo procesu</a>.</p>';
    } else if (topic === 'nuoma') {
        appendedText = '<p>Sužinokite daugiau apie <a href="/nuoma">NT nuomos valdymą</a>.</p>';
    }

    text += `\n\n${appendedText}`;
    return text;
}

async function performSurgery() {
  console.log("Pradedamas Database Surgery...");

  // --- TINKLARASTIS_IRASAI ---
  const { data: blogPosts, error: blogErr } = await supabase.from('tinklarastis_irasai').select('*');
  if (blogErr) {
      console.error("Klaida nuskaitant tinklarastis_irasai:", blogErr.message);
  } else {
      console.log(`Rasta ${blogPosts.length} įrašų "tinklarastis_irasai" lentelėje.`);
      for (let post of blogPosts) {
          const newContent = cleanAndAppendContextualLink(post.turinys, post.pavadinimas, post.kategorija);
          if (newContent !== post.turinys) {
              const { error: updateErr } = await supabase
                .from('tinklarastis_irasai')
                .update({ turinys: newContent })
                .eq('id', post.id);
              if (updateErr) console.error(`Nepavyko atnaujinti ${post.id}:`, updateErr.message);
          }
      }
      console.log("Lentelė tinklarastis_irasai atnaujinta.");
  }

  // --- FAQ_IRASAI ---
  const { data: faqPosts, error: faqErr } = await supabase.from('faq_irasai').select('*');
  if (faqErr) {
      // It's possible the table has a different name or doesn't exist, handle gracefull
      console.error("Klaida nuskaitant faq_irasai:", faqErr.message);
  } else if (faqPosts && faqPosts.length > 0) {
      console.log(`Rasta ${faqPosts.length} įrašų "faq_irasai" lentelėje.`);
      for (let faq of faqPosts) {
          // FAQ records might use answering column instead of turinys
          const contentCol = faq.atsakymas ? 'atsakymas' : (faq.turinys ? 'turinys' : null);
          if (contentCol) {
            const newContent = cleanAndAppendContextualLink(faq[contentCol], faq.klausimas || faq.pavadinimas, '');
            if (newContent !== faq[contentCol]) {
                const { error: updateErr } = await supabase
                  .from('faq_irasai')
                  .update({ [contentCol]: newContent })
                  .eq('id', faq.id);
                if (updateErr) console.error(`Nepavyko atnaujinti FAQ ${faq.id}:`, updateErr.message);
            }
          }
      }
      console.log("Lentelė faq_irasai atnaujinta.");
  } else {
      console.log("Lentelė faq_irasai tuščia arba nerasta.");
  }

  // --- LOCAL blog-posts.json update to stay in sync ---
  const JSON_FILE = path.join(process.cwd(), "src", "data", "blog-posts.json");
  if (fs.existsSync(JSON_FILE)) {
      const data = JSON.parse(fs.readFileSync(JSON_FILE, "utf-8"));
      let updatedCount = 0;
      data.forEach(p => {
          const newContent = cleanAndAppendContextualLink(p.content, p.title, p.category);
          if (newContent !== p.content) {
              p.content = newContent;
              updatedCount++;
          }
      });
      fs.writeFileSync(JSON_FILE, JSON.stringify(data, null, 2), "utf-8");
      console.log(`Atnaujinta JSON faile: ${updatedCount} straipsnių.`);
  }

  console.log("Operacija baigta!");
}

performSurgery();
