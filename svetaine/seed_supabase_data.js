require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

const dummyProperties = [
  {
    pavadinimas: "Prabangus Butas Senamiestyje",
    miestas: "Kaunas",
    kaina: 145000,
    statusas: "parduodama",
    aprasymas: "Išskirtinis 3 kambarių butas Kauno senamiestyje su panoraminiu vaizdu į Nemuną. A++ klasė, pilnas įrengimas.",
    nuotraukos_urls: JSON.stringify(["https://images.unsplash.com/photo-1560518883-ce09059eeffa", "https://images.unsplash.com/photo-1512917774080-9991f1c4c750"]),
    address: "Karaliaus Mindaugo pr. 1"
  },
  {
    pavadinimas: "Modernus Namas Ringauduose",
    miestas: "Kauno raj.",
    kaina: 210000,
    statusas: "parduodama",
    aprasymas: "Pusiau įrengtas 4 kambarių namas su 6 arų žemės sklypu. Nuosavas kiemas, didelė terasa, garažas.",
    nuotraukos_urls: JSON.stringify(["https://images.unsplash.com/photo-1580587771525-78b9dba3b914"]),
    address: "Svajonių g. 12"
  },
  {
    pavadinimas: "Nuoma - Kotedžas Romainiuose",
    miestas: "Kaunas",
    kaina: 850,
    statusas: "nuomojama",
    aprasymas: "Ilgalaikė naujo kotedžo nuoma šeimai. 3 miegamieji, autonominis šildymas, A+ energetinė klasė.",
    nuotraukos_urls: JSON.stringify(["https://images.unsplash.com/photo-1600585154340-be6161a56a0c"]),
    address: "Romainių g. 45"
  }
];

async function seed() {
  console.log('--- Seeding NT Objektai ---');
  for (const p of dummyProperties) {
     const { data, error } = await supabase.from('nt_objektai').insert(p);
     if (error) console.error('Error inserting property:', p.pavadinimas, error.message);
     else console.log('Successfully inserted property:', p.pavadinimas);
  }

  console.log('--- Seeding Blog Posts ---');
  try {
    const blogData = JSON.parse(fs.readFileSync('c:\\Users\\manta\\OneDrive\\Desktop\\SVETAINĖ\\svetaine\\src\\data\\blog-posts.json', 'utf-8'));
    for (const post of blogData) {
       const mapped = {
         pavadinimas: post.title,
         slug: post.slug,
         turinys: post.content,
         kategorija: post.category,
         nuotrauka_url: post.image,
         perziuros: post.views || 0,
         created_at: post.date ? `${post.date}T12:00:00Z` : new Date().toISOString()
       };
       const { error } = await supabase.from('tinklarastis_irasai').insert(mapped);
       if (error) console.error('Error inserting post:', post.title, error.message);
    }
    console.log(`Inserted ${blogData.length} blog posts`);
  } catch (err) {
    console.error('Failed to read / seed blog posts:', err.message);
  }

  console.log('--- Seeding Reviews ---');
  try {
    const reviewsData = JSON.parse(fs.readFileSync('c:\\Users\\manta\\OneDrive\\Desktop\\SVETAINĖ\\svetaine\\src\\data\\reviews.json', 'utf-8'));
    for (const r of reviewsData) {
       const mapped = {
         vardas: r.name,
         reitingas: r.rating,
         komentaras: r.comment,
         patvirtinta: r.status === "approved",
         created_at: r.date ? `${r.date}T12:00:00Z` : new Date().toISOString()
       };
       const { error } = await supabase.from('atsiliepimai').insert(mapped);
       if (error) console.error('Error inserting review:', r.name, error.message);
    }
    console.log(`Inserted ${reviewsData.length} reviews`);
  } catch (err) {
     console.error('Failed to read / seed reviews:', err.message);
  }
}

seed();
