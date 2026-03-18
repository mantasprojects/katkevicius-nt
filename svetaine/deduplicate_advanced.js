const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function deduplicate() {
    console.log("Fetching reviews for advanced sanitization...");
    const { data: reviews, error } = await supabase.from('atsiliepimai').select('id, vardas, komentaras');
    if (error) {
        console.error("Error fetching:", error.message);
        return;
    }

    console.log(`Found ${reviews.length} reviews.`);
    const seen = new Set();
    const duplicateIds = [];

    for (const r of reviews) {
        // Sanitize: trim, lowercase, remove double spaces
        const nameClean = (r.vardas || '').trim().toLowerCase().replace(/\s+/g, ' ');
        const commentClean = (r.komentaras || '').trim().toLowerCase().replace(/\s+/g, ' ');
        
        const key = `${nameClean}::${commentClean}`;
        if (seen.has(key)) {
            duplicateIds.push(r.id);
        } else {
            seen.add(key);
        }
    }

    console.log(`Found ${duplicateIds.length} non-exact duplicate entries to remove.`);

    if (duplicateIds.length === 0) {
        console.log("No further duplicates found.");
        return;
    }

    // Delete
    for (let i = 0; i < duplicateIds.length; i += 100) {
        const batch = duplicateIds.slice(i, i + 100);
        const { error: deleteError } = await supabase
            .from('atsiliepimai')
            .delete()
            .in('id', batch);

        if (deleteError) {
             console.error("Delete error:", deleteError.message);
        } else {
             console.log(`Deleted batch of ${batch.length}`);
        }
    }
    console.log("Advanced Deduplication complete!");
}

deduplicate();
