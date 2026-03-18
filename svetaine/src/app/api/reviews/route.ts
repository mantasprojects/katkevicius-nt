import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('atsiliepimai')
      .select('*')
      .eq('patvirtinta', true)
      .order('created_at', { ascending: false });

    if (error) {
       return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const mapped = data.map((r: any) => ({
       id: r.id,
       name: r.vardas,
       comment: r.komentaras,
       rating: r.reitingas,
       date: r.created_at ? r.created_at.split('T')[0] : '',
       status: 'approved' as const
    }));

    return NextResponse.json(mapped);
  } catch (error) {
    return NextResponse.json({ error: "Nepavyko nuskaityti atsiliepimų" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { updatedReviews, turnstileToken } = body;

    // Turnstile Validacija
    if (!turnstileToken) {
      return NextResponse.json(
        { error: "Atsiprašome, jūsų užklausa neperėjo saugumo patikros. Bandykite dar kartą." },
        { status: 400 }
      );
    }

    try {
      const isLocalhost = req.headers.get("host")?.includes("localhost");
      const secret = isLocalhost 
        ? "1x0000000000000000000000000000000AA" 
        : (process.env.CLOUDFLARE_TURNSTILE_SECRET_KEY || 
           process.env.TURNSTILE_SECRET_KEY || 
           process.env.NEXT_CLOUDFLARE_TURNSTILE_SECRET_KEY);

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
        return NextResponse.json(
          { error: `Atsiprašome, jūsų užklausa neperėjo saugumo patikros (Kodas: ${verifyData['error-codes']?.join(', ') || 'n/a'}).` },
          { status: 400 }
        );
      }
    } catch (err) {
      console.error("Turnstile verification error:", err);
      return NextResponse.json(
        { error: "Saugumo patikros klaida. Bandykite dar kartą." },
        { status: 500 }
      );
    }

    const supabase = await createClient();
    
    // updatedReviews incorporates the full list of reviews including the latest item.
    // Index position length - 1 represents the newly appended review from the client.
    const lastReview = updatedReviews[updatedReviews.length - 1];

    if (!lastReview) {
       return NextResponse.json({ error: "Nerastas naujas atsiliepimas" }, { status: 400 });
    }

    const { error: insertError } = await supabase
      .from('atsiliepimai')
      .insert({
         vardas: lastReview.name,
         komentaras: lastReview.comment,
         reitingas: lastReview.rating,
         patvirtinta: false // Requires Admin approval to show publicly
      });

    if (insertError) {
       return NextResponse.json({ error: `Nepavyko išsaugoti: ${insertError.message}` }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: "Atsiliepimai atnaujinti" });
  } catch (error) {
    return NextResponse.json({ error: "Nepavyko išsaugoti atsiliepimų" }, { status: 500 });
  }
}
