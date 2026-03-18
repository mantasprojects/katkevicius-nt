import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const INQUIRIES_FILE = path.join(process.cwd(), "src", "data", "inquiries.json");

function readInquiries() {
  try {
    const data = fs.readFileSync(INQUIRIES_FILE, "utf-8");
    return JSON.parse(data);
  } catch {
    return [];
  }
}

function writeInquiries(data: unknown[]) {
  fs.writeFileSync(INQUIRIES_FILE, JSON.stringify(data, null, 2), "utf-8");
}

export async function GET() {
  try {
    const inquiries = readInquiries();
    // Sort by date and time descending (newest first)
    inquiries.sort((a: any, b: any) => {
      const dateA = new Date(`${a.date}T${a.time || "00:00"}`);
      const dateB = new Date(`${b.date}T${b.time || "00:00"}`);
      return dateB.getTime() - dateA.getTime();
    });
    return NextResponse.json(inquiries);
  } catch (error) {
    return NextResponse.json([], { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, status, name, phone, message } = body;

    const inquiries = readInquiries();
    const index = inquiries.findIndex((i: any) => i.id === id);

    if (index >= 0) {
      if (status !== undefined) inquiries[index].status = status;
      if (name !== undefined) inquiries[index].name = name;
      if (phone !== undefined) inquiries[index].phone = phone;
      if (message !== undefined) inquiries[index].message = message;
      
      writeInquiries(inquiries);
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Užklausa nerasta" }, { status: 404 });
  } catch (error) {
    return NextResponse.json({ error: "Nepavyko atnaujinti" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const body = await req.json();
    const { id } = body;

    const inquiries = readInquiries();
    const updated = inquiries.filter((i: any) => i.id !== id);

    if (updated.length !== inquiries.length) {
      writeInquiries(updated);
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Užklausa nerasta" }, { status: 404 });
  } catch (error) {
    return NextResponse.json({ error: "Nepavyko ištrinti" }, { status: 500 });
  }
}
