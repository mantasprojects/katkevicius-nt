const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function count() {
  const { count, error } = await supabase
    .from('tinklarastis_irasai')
    .select('*', { count: 'exact', head: true });

  if (error) {
    console.error('Klaida:', error);
  } else {
    console.log('Įrašų kiekis Supabase:', count);
  }
}

count();
