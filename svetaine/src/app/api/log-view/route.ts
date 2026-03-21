import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const { objectId } = await req.json();
    if (!objectId) {
      return NextResponse.json({ error: "Missing objectId" }, { status: 400 });
    }

    const supabase = await createClient();
    const { error } = await supabase
      .from('nt_objektai_perziuros')
      .insert({ object_id: objectId });

    if (error) {
      // It's possible the table doesn't exist yet if user didn't run SQL correctly, 
      // but let's assume it does. Logs are good anyway.
      throw error;
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("API /api/log-view Error:", err);
    return NextResponse.json({ error: "Failed to log view" }, { status: 500 });
  }
}
