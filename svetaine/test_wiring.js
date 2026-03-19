const { createClient } = require("@supabase/supabase-js");
require("dotenv").config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function testCurrentSEO() {
  // 1. Get a post from Batch 1
  const { data: posts, error } = await supabase
    .from("tinklarastis_irasai")
    .select("id, pavadinimas, seo_title, seo_description, focus_keywords")
    .limit(1);

  if (error || !posts.length) {
    console.error("Klaida nuskaitant įrašą:", error);
    return;
  }

  const post = posts[0];
  console.log("\n[TEST] Esamas SEO duomenų statusas:");
  console.log("ID:", post.id);
  console.log("Meta Title:", post.seo_title);
  console.log("Description:", post.seo_description);
  console.log("Keywords:", post.focus_keywords);

  // 2. Simulate what API returns now
  console.log("\n[TEST] API dabar grąžintų visus SEO stulpelius tinkle!");
}

testCurrentSEO();
