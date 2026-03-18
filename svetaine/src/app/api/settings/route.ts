import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const filePath = path.join(process.cwd(), "src/data/website-settings.json");

export async function GET() {
  try {
    const data = fs.readFileSync(filePath, "utf-8");
    return NextResponse.json(JSON.parse(data));
  } catch (err) {
    return NextResponse.json({ error: "Failed to read settings" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    fs.writeFileSync(filePath, JSON.stringify(body, null, 2), "utf-8");
    return NextResponse.json({ success: true, message: "Settings saved" });
  } catch (err) {
    return NextResponse.json({ error: "Failed to save settings" }, { status: 500 });
  }
}
