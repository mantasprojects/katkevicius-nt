const { createClient } = require('@supabase/supabase-js');

// Since we are in Node, let's load envs. Next.js usually has it in .env.local
const fs = require('fs');
const dotenv = require('dotenv');

if (fs.existsSync('.env.local')) {
    const envConfig = dotenv.parse(fs.readFileSync('.env.local'));
    for (const k in envConfig) {
        process.env[k] = envConfig[k];
    }
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error("Missing SUPABASE env vars.");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkProperty() {
    const { data, error } = await supabase
        .from('nt_objektai')
        .select('*')
        .or('pavadinimas.ilike.%baragin%,aprasymas.ilike.%baragin%,address.ilike.%baragin%');

    if (error) {
        console.error("Query Error:", error.message);
        return;
    }

    if (!data || data.length === 0) {
        console.log("No property found containing 'baragin'");
        return;
    }

    console.log(`Found ${data.length} matches:`);
    data.forEach(p => {
        console.log({
            id: p.id,
            pavadinimas: p.pavadinimas,
            miestas: p.miestas,
            address: p.address,
            latitude: p.latitude,
            longitude: p.longitude,
            is_exact_location: p.is_exact_location
        });
    });
}

checkProperty();
