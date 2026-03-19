const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });
const fs = require('fs');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function fetchBatch() {
  const { data, error } = await supabase
    .from('tinklarastis_irasai')
    .select('*')
    .order('created_at', { ascending: false })
    .range(50, 99); // Straipsniai 51-100

  if (error) {
    console.error('Klaida:', error);
  } else {
    fs.writeFileSync('batch_2.json', JSON.stringify(data, null, 2));
    console.log(`Gauta ${data.length} įrašų ir išsaugota į batch_2.json`);
  }
}

fetchBatch();
