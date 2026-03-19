const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });
const fs = require('fs');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function fetchTitles() {
  const { data, error } = await supabase
    .from('tinklarastis_irasai')
    .select('id, pavadinimas, kategorija')
    .order('created_at', { ascending: false })
    .range(100, 1000); // Visi likę (iki 1000, tikėtina ~300)

  if (error) {
    console.error('Klaida:', error);
  } else {
    fs.writeFileSync('remaining_titles.json', JSON.stringify(data, null, 2));
    console.log(`Gauta ${data.length} likusių įrašų ir išsaugota į remaining_titles.json`);
  }
}

fetchTitles();
