import { NextRequest, NextResponse } from "next/server"
import { SignJWT } from "jose"
import fs from "fs"
import path from "path"

const JWT_SECRET = process.env.JWT_SECRET || "default_secret"
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || "admin"
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin"

export async function POST(req: NextRequest) {
  try {
    const { username, password, turnstileToken } = await req.json()

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
        console.log("🤖 BLOCKING LOGIN: Turnstile validation failed.");
        return NextResponse.json(
          { error: "Atsiprašome, jūsų užklausa neperėjo saugumo patikros. Bandykite dar kartą." },
          { status: 400 }
        );
      }
    } catch (err) {
      console.error("Turnstile verification error:", err);
      return NextResponse.json(
        { error: "Saugumo patikros klaida. Bandykite dar kartą." },
        { status: 400 }
      );
    }

    // Patikriname ar yra pakeistas slaptažodis settings.json
    let storedPassword = ADMIN_PASSWORD;
    try {
      const settingsPath = path.join(process.cwd(), "src/data/website-settings.json");
      const settings = JSON.parse(fs.readFileSync(settingsPath, "utf-8"));
      if (settings.customPassword) {
        storedPassword = settings.customPassword;
      }
    } catch (e) {
      // Ignoruojame jei failo nėra ar kita klaida
    }

    if (username === ADMIN_USERNAME && password === storedPassword) {

      
      // Sukuriame JWT žetoną
      const secret = new TextEncoder().encode(JWT_SECRET)
      const alg = 'HS256'
      
      const sessionId = Math.random().toString(36).substr(2, 9);
      const userAgent = req.headers.get("user-agent") || "Chrome / Windows";
      const forwardFor = req.headers.get("x-forwarded-for");
      const ip = forwardFor ? forwardFor.split(',')[0] : "127.0.0.1";

      // Save session to data/sessions.json
      try {
        const sessionsPath = path.join(process.cwd(), "src/data/sessions.json");
        let sessions: any[] = [];
        if (fs.existsSync(sessionsPath)) {
          sessions = JSON.parse(fs.readFileSync(sessionsPath, "utf-8"));
        }
        sessions.push({
          id: sessionId,
          device: userAgent.includes("iPhone") ? "Safari / iPhone" : "Chrome / Windows", // Simplify for mockup look or keep raw UA
          ip: ip,
          location: "Vilnius, Lietuva", // Placeholder lookup
          timestamp: Date.now()
        });
        fs.writeFileSync(sessionsPath, JSON.stringify(sessions, null, 2), "utf-8");
      } catch (e) {
        console.error("Failed to save session:", e);
      }
      
      const jwt = await new SignJWT({ user: username, role: "admin", jti: sessionId })
        .setProtectedHeader({ alg })
        .setIssuedAt()
        .setExpirationTime('24h') // Galioja 24 valandas
        .sign(secret)

      // Nustatome atsakymą ir priskiriame Cookie
      const response = NextResponse.json({ success: true }, { status: 200 })
      
      response.cookies.set({
        name: "admin_token",
        value: jwt,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
        maxAge: 60 * 60 * 24 // 1 diena sekundėmis
      })

      return response
    }

    return NextResponse.json(
      { error: "Neteisingas vartotojo vardas arba slaptažodis." },
      { status: 401 }
    )
  } catch (error) {
    return NextResponse.json(
      { error: "Sistemos klaida." },
      { status: 500 }
    )
  }
}
