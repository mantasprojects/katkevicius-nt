const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkProperty() {
  const { data, error } = await supabase.from('nt_objektai').select('*');
  if (error) {
    console.error("Error fetching:", error);
    return;
  }
  
  const matched = data.find(p => {
    const mappedSlug = (p.pavadinimas || "").toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    return mappedSlug === 'namas---kauno-r-sav-babt-mstl-ilo-g';
  });

  if (!matched) {
    console.log("Property not found");
    return;
  }

  const gallery = typeof matched.nuotraukos_urls === 'string' ? JSON.parse(matched.nuotraukos_urls) : matched.nuotraukos_urls;
  
  console.log(`Gallery array length: ${gallery.length}`);
  gallery.forEach((url, index) => {
    if (index >= 20 && index <= 30) {
      console.log(`[${index}] ${url}`);
    }
  });
}

checkProperty();
