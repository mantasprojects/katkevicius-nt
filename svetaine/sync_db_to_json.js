require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing SUPABASE credentials");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const jsonFilePath = path.join(process.cwd(), 'src', 'data', 'blog-posts.json');

async function syncDbToJson() {
  console.log("Fetching all articles from Supabase...");
  let allArticles = [];
  let from = 0;
  const PAGE_SIZE = 1000;
  
  while (true) {
    const { data, error } = await supabase
      .from('tinklarastis_irasai')
      .select('id, turinys, slug, seo_title, seo_description')
      .range(from, from + PAGE_SIZE - 1);

    if (error) {
      console.error("Error fetching articles:", error);
      return;
    }
    if (!data || data.length === 0) break;
    allArticles = allArticles.concat(data);
    if (data.length < PAGE_SIZE) break;
    from += PAGE_SIZE;
  }

  console.log("Found " + allArticles.length + " articles in DB.");

  let localPosts = [];
  try {
    localPosts = JSON.parse(fs.readFileSync(jsonFilePath, 'utf8'));
  } catch (err) {
    console.error("Could not read local JSON", err);
    return;
  }

  let updatedCount = 0;

  for (let i = 0; i < localPosts.length; i++) {
    const post = localPosts[i];
    const dbRecord = allArticles.find(a => a.slug === post.slug || a.id === post.id);
    
    if (dbRecord) {
      let isModified = false;
      if (dbRecord.turinys && post.content !== dbRecord.turinys) {
        post.content = dbRecord.turinys;
        isModified = true;
      }
      if (dbRecord.seo_description && post.excerpt !== dbRecord.seo_description) {
        post.excerpt = dbRecord.seo_description;
        isModified = true;
      }
      if (dbRecord.seo_title && post.seo_title !== dbRecord.seo_title) {
        post.seo_title = dbRecord.seo_title;
        isModified = true;
      }
      if (isModified) updatedCount++;
    }
  }

  if (updatedCount > 0) {
    fs.writeFileSync(jsonFilePath, JSON.stringify(localPosts, null, 2), 'utf8');
    console.log("Successfully synchronized " + updatedCount + " articles back to blog-posts.json!");
  } else {
    console.log("Nothing to sync. They are already identical.");
  }
}

syncDbToJson().catch(console.error);
