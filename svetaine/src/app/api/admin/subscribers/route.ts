import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Helper to init supabase with service role
const getSupabase = () => {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
       throw new Error("Missing Supabase Service Role configuration!");
    }

    return createClient(supabaseUrl, supabaseServiceKey, {
       auth: { autoRefreshToken: false, persistSession: false }
    });
};

export async function GET(req: NextRequest) {
  try {
    const supabase = getSupabase();

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

  } catch (error: any) {
    console.error("Subscribers GET crash:", error);
    return NextResponse.json({ error: "Sistemos klaida." }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { id, source } = await req.json();
    const supabase = getSupabase();
    
    if (source.includes("Backup") || source === "Manualinis") {
       await supabase.from('crm_kontaktai').delete().eq('id', id);
    } else {
       await supabase.from('naujienlaiskiai').delete().eq('id', id);
    }
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Subscribers DELETE crash:", error.message);
    return NextResponse.json({ error: "Ištrynimas nepavyko." }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { id, source, notes } = await req.json();
    const supabase = getSupabase();

    if (source.includes("Backup") || source === "Manualinis") {
       const newZinute = `[Naujienlaiškis] | Notes: ${notes}`;
       await supabase.from('crm_kontaktai').update({ zinute: newZinute }).eq('id', id);
    } else {
       await supabase.from('naujienlaiskiai').update({ pastabos: notes }).eq('id', id);
    }
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Subscribers PUT crash:", error.message);
    return NextResponse.json({ error: "Redagavimas nepavyko." }, { status: 500 });
  }
}
