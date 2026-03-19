const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });
const fs = require('fs');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function fetchAll() {
  // Parsiunčiame visus įrašus, kad matytume pilną vaizdą
  const { data, error } = await supabase
    .from('tinklarastis_irasai')
    .select('id, pavadinimas, kategorija')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Klaida:', error);
  } else {
    fs.writeFileSync('all_titles.json', JSON.stringify(data, null, 2));
    console.log(`Gauta ${data.length} įrašų ir išsaugota į all_titles.json`);

    // Padarome trumpą breakdown
    const breakdown = {};
    data.forEach(item => {
      const cat = item.kategorija || ' Be kategorijos';
      breakdown[cat] = (breakdown[cat] || 0) + 1;
    });

    console.log('\n--- Kategorijų pasiskirstymas ---');
    console.log(breakdown);
    fs.writeFileSync('category_breakdown.json', JSON.stringify(breakdown, null, 2));
  }
}

fetchAll();
