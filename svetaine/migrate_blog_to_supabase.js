import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Trūksta Supabase kintamųjų .env.local faile.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);
const JSON_FILE = path.join(process.cwd(), "src", "data", "blog-posts.json");

async function migrate() {
  try {
    if (!fs.existsSync(JSON_FILE)) {
      console.log("JSON failas nerastas:", JSON_FILE);
      return;
    }

    const data = fs.readFileSync(JSON_FILE, "utf-8");
    const posts = JSON.parse(data);

    console.log(`Rasta ${posts.length} straipsnių JSON faile.`);

    for (const post of posts) {
      // Map English keys (JSON) to Lithuanian columns (Supabase)
      const mappedPost = {
        pavadinimas: post.title,
        slug: post.slug,
        turinys: post.content || post.excerpt || "", // Fallback
        kategorija: post.category,
        nuotrauka_url: post.image,
        created_at: post.date ? `${post.date}T00:00:00Z` : new Date().toISOString()
      };

      console.log(`Keliamas: ${mappedPost.pavadinimas}...`);

      const { error } = await supabase
        .from('tinklarastis_irasai')
        .upsert(mappedPost, { onConflict: 'slug' });

      if (error) {
        console.error(`Klaida keliant '${mappedPost.pavadinimas}':`, error.message);
      } else {
        console.log(`Sėkmingai įkeltas: ${mappedPost.pavadinimas}`);
      }
    }

    console.log("Migracija baigta!");
  } catch (err) {
    console.error("Migracijos klaida:", err);
  }
}

migrate();
