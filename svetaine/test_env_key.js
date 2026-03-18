require('dotenv').config({ path: '.env.local' });
console.log("SUPABASE_SERVICE_ROLE_KEY exists:", !!process.env.SUPABASE_SERVICE_ROLE_KEY);
console.log("NEXT_SUPABASE_SERVICE_ROLE_KEY exists:", !!process.env.NEXT_SUPABASE_SERVICE_ROLE_KEY);
