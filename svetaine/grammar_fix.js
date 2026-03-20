require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing SUPABASE credentials");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

function removeBroker(text) {
  if (!text) return text;
  return text
    .replace(/\bbrokerio\b/gi, 'NT pardavimų eksperto')
    .replace(/\bbrokeriui\b/gi, 'NT pardavimų ekspertui')
    .replace(/\bbrokerį\b/gi, 'NT pardavimų ekspertą')
    .replace(/\bbrokeriu\b/gi, 'NT pardavimų ekspertu')
    .replace(/\bbrokeryje\b/gi, 'NT pardavimų eksperte')
    .replace(/\bbrokeriai\b/gi, 'NT pardavimų ekspertai')
    .replace(/\bbrokerių\b/gi, 'NT pardavimų ekspertų')
    .replace(/\bbrokeriams\b/gi, 'NT pardavimų ekspertams')
    .replace(/\bbrokerius\b/gi, 'NT pardavimų ekspertus')
    .replace(/\bbrokeriais\b/gi, 'NT pardavimų ekspertais')
    .replace(/\bbrokeriuose\b/gi, 'NT pardavimų ekspertuose')
    .replace(/\bbrokeris\b/gi, 'NT pardavimų ekspertas');
}

const exceptionsLower = [
    'mantas', 'katkevičius', 'vilnius', 'kaunas', 'klaipėda', 'šiauliai', 
    'panevėžys', 'palanga', 'lietuva', 'lietuvos', 'registrų', 'centras', 
    'google', 'facebook', 'instagram', 'youtube', 'tiktok', 'vmi'
];

function fixGrammar(text) {
    if (!text) return text;
    let newText = removeBroker(text);

    // Fix colon caps logic
    newText = newText.replace(/(:\s+)([A-ZŽĄĘĖĮŠŲŪČ])([a-zžąęėįšųūč]+)/g, (match, prefix, firstLetter, restOfWord) => {
        const fullWord = firstLetter + restOfWord;
        if (exceptionsLower.includes(fullWord.toLowerCase())) {
            return match; 
        }
        return prefix + firstLetter.toLowerCase() + restOfWord;
    });

    return newText;
}

async function processTable(tableName, textFields) {
  console.log(`Fetching ${tableName}...`);
  let allRecords = [];
  let from = 0;
  const PAGE_SIZE = 1000;
  
  while (true) {
    const { data, error } = await supabase
      .from(tableName)
      .select(`id, ${textFields.join(', ')}`)
      .range(from, from + PAGE_SIZE - 1);

    if (error) {
      console.error(`Error fetching ${tableName}:`, error);
      return;
    }
    if (!data || data.length === 0) break;
    allRecords = allRecords.concat(data);
    if (data.length < PAGE_SIZE) break;
    from += PAGE_SIZE;
  }

  let updatedCount = 0;

  for (const record of allRecords) {
    let isModified = false;
    let payload = {};

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
        const { error: updateErr } = await supabase
          .from(tableName)
          .update(payload)
          .eq('id', record.id);

        if (updateErr) {
            console.error(`Failed to update ${tableName} ID ${record.id}:`, updateErr);
        } else {
            updatedCount++;
        }
    }
  }

  console.log(`Successfully fixed grammar in ${updatedCount} rows from ${tableName}.`);
}

async function main() {
    await processTable('tinklarastis_irasai', ['pavadinimas', 'seo_title', 'seo_description', 'turinys']);
    // Try to get fields for faq_irasai
    const { data: faqSample } = await supabase.from('faq_irasai').select('*').limit(1);
    const faqFields = [];
    if (faqSample && faqSample.length > 0) {
        const keys = Object.keys(faqSample[0]);
        if (keys.includes('klausimas')) faqFields.push('klausimas');
        if (keys.includes('atsakymas')) faqFields.push('atsakymas');
        if (faqFields.length > 0) {
            await processTable('faq_irasai', faqFields);
        }
    }
}

main().catch(console.error);
