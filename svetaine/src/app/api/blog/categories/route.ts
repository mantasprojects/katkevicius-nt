import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const DATA_FILE = path.join(process.cwd(), "src", "data", "blog-categories.json");

interface Category {
  id: string;
  name: string;
  color: string;
}

function readCategories(): Category[] {
  try {
    const data = fs.readFileSync(DATA_FILE, "utf-8");
    return JSON.parse(data);
  } catch {
    return [];
  }
}

function writeCategories(categories: Category[]) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(categories, null, 2), "utf-8");
}

// GET all categories
export async function GET() {
  const categories = readCategories();
  return NextResponse.json(categories);
}

// POST — create or update a category
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const categories = readCategories();

    if (!body.name || !body.name.trim()) {
      return NextResponse.json({ error: "Kategorijos pavadinimas privalomas." }, { status: 400 });
    }

    // Generate id from name if not provided
    if (!body.id) {
      body.id = body.name
        .toLowerCase()
        .replace(/[ąčęėįšųūž]/g, (c: string) => {
          const map: Record<string, string> = { ą: "a", č: "c", ę: "e", ė: "e", į: "i", š: "s", ų: "u", ū: "u", ž: "z" };
          return map[c] || c;
        })
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
    }

    if (!body.color) {
      body.color = "#6B7280";
    }

    const existingIndex = categories.findIndex((c) => c.id === body.id);
    if (existingIndex >= 0) {
      categories[existingIndex] = { id: body.id, name: body.name.trim(), color: body.color };
    } else {
      categories.push({ id: body.id, name: body.name.trim(), color: body.color });
    }

    writeCategories(categories);
    return NextResponse.json({ success: true, category: body });
  } catch (error) {
    console.error("Categories API error:", error);
    return NextResponse.json({ error: "Klaida tvarkant kategoriją." }, { status: 500 });
  }
}

// DELETE — remove category by id
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Trūksta ID." }, { status: 400 });
    }

    const categories = readCategories();
    const filtered = categories.filter((c) => c.id !== id);
    writeCategories(filtered);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Categories DELETE error:", error);
    return NextResponse.json({ error: "Klaida trinant kategoriją." }, { status: 500 });
  }
}
