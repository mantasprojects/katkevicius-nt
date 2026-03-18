import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Trūksta Supabase kintamųjų .env.local faile.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
  const { data, error } = await supabase
    .from('tinklarastis_irasai')
    .select('count', { count: 'exact', head: true });

  if (error) {
    console.log("KLAIDA: 'tinklarastis_irasai' lentelė neegzistuoja arba nepasiekiama.", error.message);
  } else {
    console.log("SĖKMĖ: 'tinklarastis_irasai' lentelė egzistuoja! Įrašų kiekis:", data?.[0]?.count || 0);
  }
}

test();
