import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, source, turnstileToken } = body;

    if (!email) {
      return NextResponse.json({ error: "El. paštas yra privalomas." }, { status: 400 });
    }

    // 1. Turnstile Verification (Optional for FOMO, skips validation)
    if (turnstileToken !== "fomo_bypass") {
      if (!turnstileToken) {
        return NextResponse.json({ error: "Saugumo patikra nepavyko." }, { status: 400 });
      }

      const isLocalhost = req.headers.get("host")?.includes("localhost");
      const secret = isLocalhost 
        ? "1x0000000000000000000000000000000AA" 
        : (process.env.CLOUDFLARE_TURNSTILE_SECRET_KEY || process.env.TURNSTILE_SECRET_KEY);

      const formData = new URLSearchParams();
      if (secret) formData.append("secret", secret);
      formData.append("response", turnstileToken);

      const verifyRes = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: formData,
      });

      const verifyData = await verifyRes.json();
      if (!verifyData.success) {
        return NextResponse.json({ error: "Saugumo patikra nepavyko." }, { status: 400 });
      }
    }

    // 2. Insert into Supabase using Service Role Key to bypass RLS
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
       console.error("Missing Supabase Service Role configuration!");
       return NextResponse.json({ error: "Sistemos konfigūracijos klaida." }, { status: 500 });
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
       auth: { autoRefreshToken: false, persistSession: false }
    });

    const { error: insertError } = await supabase.from('naujienlaiskiai').insert({
      email: email.trim().toLowerCase(),
      saltinis: source || "pirkimas_fomo"
    });

    if (insertError) {
      console.error("Subscription failed:", insertError.message);
      
      // If table truly still doesn't exist for some reason, use fallback
      if (insertError.message.includes("does not exist") || insertError.message.includes("42P01")) {
         await supabase.from('crm_kontaktai').insert({
            vardas: "Prenumeratorius",
            email: email,
            telefonas: "-",
            zinute: `[Naujienlaiškis] Šaltinis: ${source || "—"}`
         });
         return NextResponse.json({ success: true, message: "Saved to backup CRM" });
      }
      return NextResponse.json({ error: `Klaida išsaugant prenumeratą: ${insertError.message}` }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Subscription API crash:", error);
    return NextResponse.json({ error: "Sistemos klaida." }, { status: 500 });
  }
}
