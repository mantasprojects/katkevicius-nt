require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function check() {
  const { data } = await supabase.from('tinklarastis_irasai').select('pavadinimas, kategorija, seo_title, seo_description').limit(10);
  console.log(JSON.stringify(data, null, 2));
}

check().catch(console.error);
