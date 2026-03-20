require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function testLimits() {
  const { data: bData } = await supabase.from('tinklarastis_irasai').select('id, seo_title').limit(1);
  if (!bData || bData.length === 0) return process.exit(0);

  const testTitle = `Testuojame 85 simboliu riba. Top Tier SEO antraščių generavimo strateginis sprendimas | Mantas Katkev`; // ~104 chars

  const { error } = await supabase.from('tinklarastis_irasai').update({ seo_title: testTitle }).eq('id', bData[0].id);

  if (error) {
    if (error.code === '22001') {
       console.log("LIMIT ERROR: The user didn't extend the database columns.");
    } else {
       console.error("OTHER ERROR:", error);
    }
  } else {
    console.log("SUCCESS LIMIT TEST");
    // revert
    await supabase.from('tinklarastis_irasai').update({ seo_title: bData[0].seo_title }).eq('id', bData[0].id);
  }
}

testLimits().catch(console.error);
