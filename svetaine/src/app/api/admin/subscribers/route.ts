import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET(req: NextRequest) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
       return NextResponse.json({ error: "Sistemos konfigūracijos klaida." }, { status: 500 });
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
       auth: { autoRefreshToken: false, persistSession: false }
    });

    // 1. Fetch from primary table 'naujienlaiskiai'
    const { data: pData, error: pError } = await supabase
      .from('naujienlaiskiai')
      .select('*')
      .order('sukuriama_data', { ascending: false });

    if (pError) console.error("naujienlaiskiai fetch error:", pError.message);

    // 2. Fetch from backup 'crm_kontaktai'
    const { data: bData } = await supabase
      .from('crm_kontaktai')
      .select('*')
      .filter('zinute', 'ilike', '%[Naujienlaiškis]%')
      .order('created_at', { ascending: false });

    return NextResponse.json({ 
      naujienlaiskiai: pData || [], 
      crm: bData || [] 
    });

  } catch (error) {
    console.error("Subscribers GET crash:", error);
    return NextResponse.json({ error: "Sistemos klaida." }, { status: 500 });
  }
}
