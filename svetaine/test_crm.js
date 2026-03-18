const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkCRM() {
    const tables = ['uzklausos', 'inquiries', 'crm', 'kontaktai', 'klientai'];
    for (const t of tables) {
       const { data, error } = await supabase.from(t).select('*').limit(1);
       console.log(`Table '${t}' exists:`, !error);
       if (error) {
           // console.log(`Error for ${t}:`, error.message);
       } else {
           console.log(`Table '${t}' columns:`, Object.keys(data[0] || {}).join(', '));
       }
    }
}

checkCRM();
