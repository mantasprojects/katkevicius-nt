import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const filePath = path.join(process.cwd(), "src/data/team.json");

export async function GET() {
  try {
    const data = fs.readFileSync(filePath, "utf-8");
    return NextResponse.json(JSON.parse(data));
  } catch (err) {
    return NextResponse.json({ error: "Failed to read team" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action, id, member } = body;

    const data = fs.readFileSync(filePath, "utf-8");
    let members = JSON.parse(data);

    if (action === "add") {
      members.push({ id: Date.now().toString(), ...member });
    } else if (action === "update") {
      members = members.map((m: any) => m.id === id ? { ...m, ...member } : m);
    } else if (action === "delete") {
      members = members.filter((m: any) => m.id !== id);
    }

    fs.writeFileSync(filePath, JSON.stringify(members, null, 2), "utf-8");
    return NextResponse.json({ success: true, message: "Team updated" });
  } catch (err) {
    return NextResponse.json({ error: "Failed to update team" }, { status: 500 });
  }
}
