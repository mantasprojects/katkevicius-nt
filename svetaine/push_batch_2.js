const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // Naudojame Service Role raktą

const supabase = createClient(supabaseUrl, supabaseKey);

async function pushUpdates() {
  const posts = require('./batch_2_optimized.json');

  if (!posts || posts.length === 0) {
    console.error('Nėra įrašų optimizuotame faile.');
    return;
  }

  const { data, error } = await supabase
    .from('tinklarastis_irasai')
    .upsert(posts);

  if (error) {
    console.error('Klaida atnaujinant duomenis:', error);
  } else {
    console.log(`Sėkmingai atnaujinta ${posts.length} įrašų Supabase (Batch 2)!`);
  }
}

pushUpdates();
