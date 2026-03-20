require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const exceptionsLower = [
    'mantas', 'katkevičius', 'vilnius', 'kaunas', 'klaipėda', 'šiauliai', 
    'panevėžys', 'palanga', 'lietuva', 'lietuvos', 'registrų', 'centras', 
    'google', 'facebook', 'instagram', 'youtube', 'tiktok', 'vmi', 'nt', 'seo'
];

function fixGrammar(text) {
    if (!text) return text;
    return text.replace(/(:\s+)([A-ZŽĄĘĖĮŠŲŪČ])([a-zžąęėįšųūč]+)/g, (match, prefix, firstLetter, restOfWord) => {
        const fullWord = firstLetter + restOfWord;
        if (exceptionsLower.includes(fullWord.toLowerCase())) {
            return match; 
        }
        return prefix + firstLetter.toLowerCase() + restOfWord;
    });
}

async function processFaq() {
  const { data: faqSample } = await supabase.from('faq_irasai').select('*').limit(1);
  if (!faqSample || faqSample.length === 0) {
      console.log("faq_irasai is empty or does not exist.");
      return;
  }
  
  const textFields = ['klausimas', 'atsakymas'];
  const { data: allRecords } = await supabase.from('faq_irasai').select(`id, ${textFields.join(', ')}`);
  
  let updatedCount = 0;
  for (const record of allRecords) {
    let payload = {};
    let isModified = false;
    for (const field of textFields) {
        if (record[field]) {
            const fixed = fixGrammar(record[field]);
            if (fixed !== record[field]) {
                payload[field] = fixed;
                isModified = true;
            }
        }
    }
    if (isModified) {
        await supabase.from('faq_irasai').update(payload).eq('id', record.id);
        updatedCount++;
    }
  }
  console.log(`Successfully fixed grammar in ${updatedCount} rows from faq_irasai.`);
}

processFaq().catch(console.error);
