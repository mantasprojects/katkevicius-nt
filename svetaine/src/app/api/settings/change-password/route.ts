import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const filePath = path.join(process.cwd(), "src/data/website-settings.json");
const DEFAULT_PASSWORD = process.env.ADMIN_PASSWORD || "admin";

export async function POST(req: Request) {
  try {
    const { currentPassword, newPassword } = await req.json();

    if (!currentPassword || !newPassword) {
      return NextResponse.json({ error: "Užpildykite visus laukus" }, { status: 400 });
    }

    // Read current settings to find stored password
    let settings: any = {};
    if (fs.existsSync(filePath)) {
      settings = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    }

    const activePassword = settings.customPassword || DEFAULT_PASSWORD;

    if (currentPassword !== activePassword) {
      return NextResponse.json({ error: "Dabartinis slaptažodis neteisingas" }, { status: 400 });
    }

    // Update settings with new custom password
    settings.customPassword = newPassword;
    fs.writeFileSync(filePath, JSON.stringify(settings, null, 2), "utf-8");

    return NextResponse.json({ success: true, message: "Slaptažodis sėkmingai pakeistas" });
  } catch (err) {
    console.error("Change password error:", err);
    return NextResponse.json({ error: "Sistemos klaida keičiant slaptažodį" }, { status: 500 });
  }
}
