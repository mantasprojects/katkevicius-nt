require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing SUPABASE credentials");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const bioBlock = "\n<div style='margin-top:2.5rem; padding:1.5rem; background-color:#F8FAFC; border:1px solid #E2E8F0; border-radius:1rem; position:relative; overflow:hidden;'><p style='margin:0; font-size:0.875rem; color:#334155; position:relative; z-index:10; line-height:1.6;'><strong>Mantas Katkevičius</strong> – NT pardavimų ekspertas, kurio strateginis požiūris ir technologinis pranašumas užtikrina maksimalią turto vertę klientams.</p></div>\n";

async function removeBio() {
  console.log("Fetching all articles...");
  let allArticles = [];
  let from = 0;
  const PAGE_SIZE = 1000;
  
  while (true) {
    const { data, error } = await supabase
      .from('tinklarastis_irasai')
      .select('id, turinys, slug')
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

  let updatedCount = 0;

  for (const article of allArticles) {
    if (article.turinys && article.turinys.includes(bioBlock)) {
        const newTurinys = article.turinys.replace(bioBlock, '');
        
        const { error: updateErr } = await supabase
          .from('tinklarastis_irasai')
          .update({ turinys: newTurinys })
          .eq('id', article.id);

        if (updateErr) {
            console.error("Failed to update " + article.slug + ":", updateErr);
        } else {
            updatedCount++;
        }
    }
  }

  console.log("Successfully removed Bio block from " + updatedCount + " articles.");
}

removeBio().catch(console.error);
