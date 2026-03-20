require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function check() {
  const { data: bData } = await supabase.from('tinklarastis_irasai').select('*').limit(1);
  console.log("Blog columns:", bData ? Object.keys(bData[0]) : "None");
}
check().catch(console.error);
