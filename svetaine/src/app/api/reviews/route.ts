import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const getFilePath = () => path.join(process.cwd(), "src/data/reviews.json");

export async function GET() {
  try {
    const filePath = getFilePath();
    if (!fs.existsSync(filePath)) {
       return NextResponse.json([]);
    }
    const data = fs.readFileSync(filePath, "utf-8");
    return NextResponse.json(JSON.parse(data));
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
      const secret = isLocalhost ? "1x0000000000000000000000000000000AA" : process.env.TURNSTILE_SECRET_KEY;

      const verifyRes = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          secret: secret,
          response: turnstileToken,
        }),
      });

      const verifyData = await verifyRes.json();
      if (!verifyData.success) {
        return NextResponse.json(
          { error: "Atsiprašome, jūsų užklausa neperėjo saugumo patikros. Bandykite dar kartą." },
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

    const filePath = getFilePath();
    fs.writeFileSync(filePath, JSON.stringify(updatedReviews, null, 2), "utf-8");
    return NextResponse.json({ success: true, message: "Atsiliepimai atnaujinti" });
  } catch (error) {
    return NextResponse.json({ error: "Nepavyko išsaugoti atsiliepimų" }, { status: 500 });
  }
}
