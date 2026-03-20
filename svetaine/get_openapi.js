require('dotenv').config({ path: '.env.local' });
const fetch = require('node-fetch');

async function getSpec() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/?apikey=${process.env.SUPABASE_SERVICE_ROLE_KEY}`);
  const json = await res.json();
  const table = json.definitions['tinklarastis_irasai'];
  console.log(JSON.stringify(table.properties, null, 2));
}

getSpec().catch(console.error);
