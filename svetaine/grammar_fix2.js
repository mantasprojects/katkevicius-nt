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
  // Use shorter replacement to avoid hitting 60/160 char limits of SEO fields
  return text
    .replace(/\bbrokerio\b/gi, 'NT eksperto')
    .replace(/\bbrokeriui\b/gi, 'NT ekspertui')
    .replace(/\bbrokerį\b/gi, 'NT ekspertą')
    .replace(/\bbrokeriu\b/gi, 'NT ekspertu')
    .replace(/\bbrokeryje\b/gi, 'NT eksperte')
    .replace(/\bbrokeriai\b/gi, 'NT ekspertai')
    .replace(/\bbrokerių\b/gi, 'NT ekspertų')
    .replace(/\bbrokeriams\b/gi, 'NT ekspertams')
    .replace(/\bbrokerius\b/gi, 'NT ekspertus')
    .replace(/\bbrokeriais\b/gi, 'NT ekspertais')
    .replace(/\bbrokeriuose\b/gi, 'NT ekspertuose')
    .replace(/\bbrokeris\b/gi, 'NT ekspertas');
}

const exceptionsLower = [
    'mantas', 'katkevičius', 'vilnius', 'kaunas', 'klaipėda', 'šiauliai', 
    'panevėžys', 'palanga', 'lietuva', 'lietuvos', 'registrų', 'centras', 
    'google', 'facebook', 'instagram', 'youtube', 'tiktok', 'vmi', 'nt', 'seo'
];

function forceLimit(text, limit) {
    if (!text || text.length <= limit) return text;
    // Extremely safe string truncation without breaking words
    let truncated = text.substring(0, limit);
    const lastSpace = truncated.lastIndexOf(' ');
    if (lastSpace > 20) {
        truncated = truncated.substring(0, lastSpace);
    }
    return truncated.trim();
}

function fixGrammar(text, fieldName) {
    if (!text) return text;
    let newText = removeBroker(text);

    newText = newText.replace(/(:\s+)([A-ZŽĄĘĖĮŠŲŪČ])([a-zžąęėįšųūč]+)/g, (match, prefix, firstLetter, restOfWord) => {
        const fullWord = firstLetter + restOfWord;
        if (exceptionsLower.includes(fullWord.toLowerCase())) {
            return match; 
        }
        return prefix + firstLetter.toLowerCase() + restOfWord;
    });

    if (fieldName === 'seo_title') {
        newText = forceLimit(newText, 60);
    } else if (fieldName === 'seo_description') {
        newText = forceLimit(newText, 160);
    }

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
            const fixed = fixGrammar(record[field], field);
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
}

main().catch(console.error);
