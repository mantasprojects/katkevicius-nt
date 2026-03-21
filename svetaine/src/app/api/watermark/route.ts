import { NextResponse } from "next/server";
import sharp from "sharp";
import path from "path";
import fs from "fs";
import { createClient } from "@/utils/supabase/server";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file || file.size === 0) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Read the uploaded image into a buffer
    const arrayBuffer = await file.arrayBuffer();
    const imageBuffer = Buffer.from(arrayBuffer);

    // Read the watermark logo
    const logoPath = path.join(process.cwd(), "public", "logomantas.png");
    if (!fs.existsSync(logoPath)) {
      return NextResponse.json({ error: "Logo not found" }, { status: 500 });
    }
    const logoBuffer = fs.readFileSync(logoPath);

    // Get image metadata
    const imageMeta = await sharp(imageBuffer).metadata();
    const imgWidth = imageMeta.width || 1920;
    const imgHeight = imageMeta.height || 1080;

    // Watermark sizing: reduced to ~80% of previous size (~16% horizontal, ~28% vertical)
    const isHorizontal = imgWidth >= imgHeight;
    const watermarkWidth = isHorizontal ? Math.round(imgWidth * 0.16) : Math.round(imgWidth * 0.28);
    // Padding from edges: slightly closer to edges (3% instead of 5%)
    const paddingX = Math.round(Math.min(imgWidth, imgHeight) * 0.03);
    const paddingY = paddingX;

    // Resize the logo to desired watermark size, maintain aspect ratio
    const resizedLogo = await sharp(logoBuffer)
      .resize({ width: watermarkWidth, withoutEnlargement: true })
      .ensureAlpha()
      .toBuffer();

    // The logo will be placed at 100% opacity, so we just pass the resized buffer
    const logoMeta = await sharp(resizedLogo).metadata();
    const logoW = logoMeta.width || watermarkWidth;
    const logoH = logoMeta.height || Math.round(watermarkWidth * 0.4);

    const finalWatermarkBuffer = resizedLogo;

    // Calculate position: bottom-right with padding
    const left = Math.max(0, imgWidth - logoW - paddingX);
    const top = Math.max(0, imgHeight - logoH - paddingY);

    // Composite: overlay logo on image, then convert to WebP
    const processedBuffer = await sharp(imageBuffer)
      .composite([
        {
          input: finalWatermarkBuffer,
          left,
          top,
          blend: "over",
        },
      ])
      .webp({ quality: 80, effort: 6 })
      .toBuffer();

    // Upload processed image to Supabase Storage
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.webp`;
    const filePath = `uploads/${fileName}`;

    const supabase = await createClient();
    const { data, error } = await supabase.storage
      .from("properties")
      .upload(filePath, processedBuffer, {
        contentType: "image/webp",
        cacheControl: "31536000",
      });

    if (error) {
      console.error("Supabase upload error:", error);
      return NextResponse.json({ error: "Upload failed" }, { status: 500 });
    }

    const { data: urlData } = supabase.storage
      .from("properties")
      .getPublicUrl(filePath);

    return NextResponse.json({ url: urlData.publicUrl });
  } catch (error) {
    console.error("Watermark processing error:", error);
    return NextResponse.json(
      { error: "Image processing failed" },
      { status: 500 }
    );
  }
}
