const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testUpdate() {
    // 1. Find a pending review
    const { data: pending } = await supabase.from('atsiliepimai').select('*').eq('patvirtinta', false).limit(1);
    if (!pending || pending.length === 0) {
        console.log("No pending reviews found in Supabase.");
        return;
    }

    const item = pending[0];
    console.log(`Found pending review: ID=${item.id}, Name=${item.vardas}, status=${item.patvirtinta}`);

    // 2. Perform update
    const { data, error, status, statusText } = await supabase
        .from('atsiliepimai')
        .update({ patvirtinta: true })
        .eq('id', item.id)
        .select();

    console.log("Update response status:", status, statusText);
    if (error) {
        console.error("Update Error:", error.message);
    } else {
        console.log("Updated data:", data);
    }
}

testUpdate();
