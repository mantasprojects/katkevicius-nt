import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import fs from "fs";
import path from "path";

const INQUIRIES_FILE = path.join(process.cwd(), "src", "data", "inquiries.json");

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, phone, message, property, pageUrl, b_name, turnstileToken } = body;

    // 1. Honeypot Spamo spąstai
    if (b_name) {
      console.log("🤖 BLOCKING SPAM: Honeypot field was filled.");
      return NextResponse.json(
        { error: "Atsiprašome, jūsų užklausa neperėjo saugumo patikros. Bandykite dar kartą." },
        { status: 400 }
      );
    }

    // 2. Cloudflare Turnstile Validacija
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
        console.log("🤖 BLOCKING SPAM: Turnstile validation failed.", verifyData);
        return NextResponse.json(
          { error: "Atsiprašome, jūsų užklausa neperėjo saugumo patikros. Bandykite dar kartą." },
          { status: 400 }
        );
      }
    } catch (err) {
      console.error("Turnstile verification error:", err);
      // In case of API failures, blocking might be safer or allowing? Usually enforcing.
      return NextResponse.json(
        { error: "Atsiprašome, jūsų užklausa neperėjo saugumo patikros. Bandykite dar kartą." },
        { status: 400 }
      );
    }

    // Validate required fields
    if (!name || !phone) {
      return NextResponse.json(
        { error: "Vardas ir telefonas yra privalomi." },
        { status: 400 }
      );
    }

    // Save to Supabase CRM
    try {
       const { createClient } = await import("@/utils/supabase/server"); 
       const supabase = await createClient();
       const { error: insertError } = await supabase.from('crm_kontaktai').insert({
          vardas: name,
          telefonas: phone,
          zinute: message ? `${message} | URL: ${pageUrl || ''} | Obj: ${property || ''}` : `Užklausa iš: ${property || 'Puslapio'}`
       });
       if (insertError) console.error("CRM Insert failed:", insertError.message);
    } catch (err) {
       console.error("Failed to save inquiry to Supabase:", err);
    }


    // Create transporter — uses environment variables for SMTP config
    // If SMTP env vars are not set, falls back to a mailto: link approach
    const smtpHost = process.env.SMTP_HOST;
    const smtpPort = Number(process.env.SMTP_PORT || 587);
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;
    const recipientEmail = process.env.RECIPIENT_EMAIL || "info@katkevicius.lt";

    if (!smtpHost || !smtpUser || !smtpPass) {
      console.warn("⚠️ [Inquiry API] Trūksta SMTP kintamųjų Vercel! El. pašto siuntimas praleidžiamas (log'inama į konsolę).");
      // If SMTP is not configured, log the inquiry and return success
      // This allows local development without email setup
      console.log("═══════════════════════════════════════════════════");
      console.log("📧 NAUJA UŽKLAUSA (SMTP nenustatytas — loginama į konsolę)");
      console.log("═══════════════════════════════════════════════════");
      console.log(`🏠 Objektas: ${property || "Nenurodyta"}`);
      console.log(`🔗 Puslapis: ${pageUrl || "Nenurodyta"}`);
      console.log(`👤 Vardas:   ${name}`);
      console.log(`📞 Telefonas: ${phone}`);
      console.log(`💬 Žinutė:   ${message || "—"}`);
      console.log(`📅 Data:     ${new Date().toLocaleString("lt-LT")}`);
      console.log("═══════════════════════════════════════════════════");

      return NextResponse.json({ success: true, method: "console" });
    }

    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465,
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });

    // Compose a beautiful HTML email
    const htmlContent = `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f8fafc; border-radius: 16px; overflow: hidden; border: 1px solid #e2e8f0;">
        <div style="background: linear-gradient(135deg, #1E3A8A 0%, #2563EB 100%); padding: 32px 24px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 22px; font-weight: 700; letter-spacing: -0.5px;">
            📩 Nauja NT Užklausa
          </h1>
          <p style="color: rgba(255,255,255,0.8); margin: 8px 0 0; font-size: 14px;">
            Gauta iš katkevicius.lt svetainės
          </p>
        </div>
        
        <div style="padding: 32px 24px;">
          ${property ? `
          <div style="background: white; border-radius: 12px; padding: 20px; margin-bottom: 16px; border: 1px solid #e2e8f0;">
            <p style="margin: 0 0 4px; font-size: 12px; color: #64748b; text-transform: uppercase; letter-spacing: 1px; font-weight: 600;">🏠 Objektas</p>
            <p style="margin: 0; font-size: 18px; color: #111827; font-weight: 700;">${property}</p>
          </div>
          ` : ''}

          ${pageUrl ? `
          <div style="background: white; border-radius: 12px; padding: 20px; margin-bottom: 16px; border: 1px solid #e2e8f0;">
            <p style="margin: 0 0 4px; font-size: 12px; color: #64748b; text-transform: uppercase; letter-spacing: 1px; font-weight: 600;">🔗 Puslapio nuoroda</p>
            <p style="margin: 0; font-size: 14px; color: #2563EB; font-weight: 600;">
              <a href="${pageUrl}" style="color: #2563EB; word-break: break-all;">${pageUrl}</a>
            </p>
          </div>
          ` : ''}
          
          <div style="background: white; border-radius: 12px; padding: 20px; margin-bottom: 16px; border: 1px solid #e2e8f0;">
            <p style="margin: 0 0 4px; font-size: 12px; color: #64748b; text-transform: uppercase; letter-spacing: 1px; font-weight: 600;">👤 Kontaktinė informacija</p>
            <p style="margin: 8px 0 4px; font-size: 16px; color: #111827; font-weight: 600;">${name}</p>
            <p style="margin: 0; font-size: 16px; color: #2563EB; font-weight: 600;">
              <a href="tel:${phone}" style="color: #2563EB; text-decoration: none;">${phone}</a>
            </p>
          </div>
          
          ${message ? `
          <div style="background: white; border-radius: 12px; padding: 20px; margin-bottom: 16px; border: 1px solid #e2e8f0;">
            <p style="margin: 0 0 8px; font-size: 12px; color: #64748b; text-transform: uppercase; letter-spacing: 1px; font-weight: 600;">💬 Žinutė</p>
            <p style="margin: 0; font-size: 15px; color: #374151; line-height: 1.6; white-space: pre-wrap;">${message}</p>
          </div>
          ` : ''}
          
          <div style="background: #EFF6FF; border-radius: 12px; padding: 16px; text-align: center; border: 1px solid #BFDBFE;">
            <p style="margin: 0; font-size: 13px; color: #1E3A8A; font-weight: 500;">
              📅 Gauta: ${new Date().toLocaleString("lt-LT")} | Šaltinis: katkevicius.lt
            </p>
          </div>
        </div>
      </div>
    `;

    await transporter.sendMail({
      from: `"Katkevicius.lt Svetainė" <${smtpUser}>`,
      to: recipientEmail,
      replyTo: `"${name}" <noreply@katkevicius.lt>`,
      subject: `📩 Nauja užklausa${property ? `: ${property}` : ""} — ${name}`,
      html: htmlContent,
      text: `Nauja NT užklausa\n\nObjektas: ${property || "Nenurodyta"}\nNuoroda: ${pageUrl || "Nenurodyta"}\nVardas: ${name}\nTelefonas: ${phone}\nŽinutė: ${message || "—"}\nData: ${new Date().toLocaleString("lt-LT")}`,
    });

    return NextResponse.json({ success: true, method: "email" });
  } catch (error) {
    console.error("Klaida siunčiant el. laišką:", error);
    return NextResponse.json(
      { error: "Nepavyko išsiųsti užklausos. Bandykite dar kartą." },
      { status: 500 }
    );
  }
}
