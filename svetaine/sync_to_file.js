const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });
const fs = require('fs');
const path = require('path');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function sync() {
  console.log('--- Pradedamas Duomenų Sinchronizavimas į JSON ---');

  // 1. Atsisiunčiame visus įrašus iš Supabase
  const { data: posts, error } = await supabase
    .from('tinklarastis_irasai')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Klaida parsiunčiant iš Supabase:', error);
    return;
  }

  console.log(`Parsiųsta iš Supabase: ${posts.length} įrašų.`);

  // 2. Mapiname į duomenų modelį, kurį naudoja failas
  const mappedPosts = posts.map(post => {
    return {
      id: post.id,
      title: post.pavadinimas,
      slug: post.slug,
      excerpt: post.seo_description || '',
      content: post.turinys || '',
      category: post.kategorija || 'Patarimai',
      author: 'Mantas Katkevičius', // Hardcoded, nes nėra DB
      image: post.nuotrauka_url || '',
      date: post.created_at ? post.created_at.substring(0, 10) : new Date().toISOString().substring(0, 10),
      status: 'published',
      views: post.perziuros || 0
    };
  });

  // 3. Išsaugome į failą
  const filePath = path.join(process.cwd(), 'src', 'data', 'blog-posts.json');
  fs.writeFileSync(filePath, JSON.stringify(mappedPosts, null, 2), 'utf-8');

  console.log(`Sėkmingai sinchronizuota ir išsaugota į ${filePath}`);
}

sync();
