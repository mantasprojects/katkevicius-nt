const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkCRM() {
    const { data, error } = await supabase.from('crm_kontaktai').select('*').limit(1);
    console.log('crm_kontaktai exists:', !error);
    if (error) {
        console.error('Error:', error.message);
    } else {
        console.log('Sample row:', data[0] || 'Empty table');
    }
}

checkCRM();
