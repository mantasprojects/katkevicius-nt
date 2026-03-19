import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Parse .env.local manually to ensure variables exist in Node process
try {
  const envPath = path.join(process.cwd(), '.env.local');
  if (fs.existsSync(envPath)) {
    const env = fs.readFileSync(envPath, 'utf8');
    env.split('\n').forEach(line => {
      const parts = line.split('=');
      if (parts.length >= 2) {
        const key = parts[0].trim();
        const value = parts.slice(1).join('=').trim().replace(/^"|"$/g, '');
        process.env[key] = value;
      }
    });
  }
} catch (e) {
  console.log("Failed to parse .env.local:", e.message);
}

async function testInsert() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  console.log("Creating client for:", url);
  
  if (!url || !key) {
     console.error("❌ ERROR: Missing Supabase Env Variables setup in .env.local!");
     return;
  }

  const supabase = createClient(url, key);

  try {
    console.log("Testing insert to 'naujienlaiskiai'...");
    const { data, error } = await supabase.from('naujienlaiskiai').insert({
      email: `test_${Date.now()}@test.com`,
      saltinis: 'test_script'
    }).select();

    if (error) {
      console.error("❌ Insert Error:", error.message);
    } else {
      console.log("✅ Insert Success:", data);
    }
  } catch (err) {
    console.error("💥 Crash:", err.message);
  }
}

testInsert();
