const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function inspect() {
  const { data, error } = await supabase.from('tinklarastis_irasai').select('*').limit(1);
  if (error) {
    console.error('Klaida:', error);
  } else if (data && data.length > 0) {
    console.log('Lentelės stulpeliai:', Object.keys(data[0]));
    console.log('Pavyzdinis įrašas:', JSON.stringify(data[0], null, 2));
  } else {
    console.log('Lentelė tuščia.');
  }
}

inspect();
