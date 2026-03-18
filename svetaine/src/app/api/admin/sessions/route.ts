import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { jwtVerify } from "jose";

const filePath = path.join(process.cwd(), "src/data/sessions.json");
const JWT_SECRET = process.env.JWT_SECRET || "default_secret";

// Helper to get current session ID from token
async function getCurrentSessionId(req: NextRequest) {
  const token = req.cookies.get("admin_token")?.value;
  if (!token) return null;
  try {
    const secret = new TextEncoder().encode(JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    return payload.jti as string;
  } catch {
    return null;
  }
}

export async function GET(req: NextRequest) {
  try {
    if (!fs.existsSync(filePath)) {
      return NextResponse.json([]);
    }
    const data = fs.readFileSync(filePath, "utf-8");
    let sessions = JSON.parse(data);

    const currentSessionId = await getCurrentSessionId(req);

    // Mark current session
    sessions = sessions.map((s: any) => ({
      ...s,
      current: s.id === currentSessionId
    }));

    return NextResponse.json(sessions);
  } catch (err) {
    return NextResponse.json({ error: "Nepavyko nuskaityti sesijų" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { action, id } = await req.json();
    const currentSessionId = await getCurrentSessionId(req);

    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ success: true });
    }

    let sessions = JSON.parse(fs.readFileSync(filePath, "utf-8"));

    if (action === "delete" && id) {
      if (id === currentSessionId) {
        return NextResponse.json({ error: "Negalite atjungti dabartinės sesijos šiuo būdu" }, { status: 400 });
      }
      sessions = sessions.filter((s: any) => s.id !== id);
    } 
    else if (action === "delete_others") {
      sessions = sessions.filter((s: any) => s.id === currentSessionId);
    }

    fs.writeFileSync(filePath, JSON.stringify(sessions, null, 2), "utf-8");
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: "Klaida valdant sesijas" }, { status: 500 });
  }
}
