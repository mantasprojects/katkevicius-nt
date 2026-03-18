import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import fs from "fs";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const files = formData.getAll("files") as File[];
    
    if (!files || files.length === 0) {
      return NextResponse.json({ error: "No files uploaded" }, { status: 400 });
    }

    const MAX_SIZE = 100 * 1024 * 1024; // 100MB

    // Ensure upload directory exists
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    if (!fs.existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    const savedUrls: string[] = [];

    for (const file of files) {
      if (file.size === 0) continue;
      
      // Enforce 100MB limit
      if (file.size > MAX_SIZE) {
        return NextResponse.json({ error: "File too large" }, { status: 413 });
      }
      
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Clean filename
      const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
      const filename = `${Date.now()}-${sanitizedName}`;
      const filepath = path.join(uploadDir, filename);
      
      await writeFile(filepath, buffer);
      savedUrls.push(`/uploads/${filename}`);
    }

    return NextResponse.json({ urls: savedUrls });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
