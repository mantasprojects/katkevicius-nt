require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function check() {
  const t1 = await supabase.from('nt_objektai').select('*', { count: 'exact', head: true });
  const t2 = await supabase.from('tinklarastis_irasai').select('*', { count: 'exact', head: true });
  const t3 = await supabase.from('atsiliepimai').select('*', { count: 'exact', head: true });
  
  console.log('nt_objektai:', t1.count);
  console.log('tinklarastis_irasai:', t2.count);
  console.log('atsiliepimai:', t3.count);
}

check();
