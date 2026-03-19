"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

/**
 * Ištrina Tinklaraščio įrašą
 */
export async function deletePost(id: string) {
  const supabase = await createClient();

  try {
    const { error } = await supabase
      .from("tinklarastis_irasai")
      .delete()
      .eq("id", id);

    if (error) throw error;

    revalidatePath("/admin/blog");
    revalidatePath("/");
    return { success: true, message: "Įrašas sėkmingai ištrintas" };
  } catch (error: any) {
    console.error("Failed to delete post:", error);
    return { success: false, error: error.message || "Nepavyko ištrinti įrašo" };
  }
}

/**
 * Atnaujina arba Sukuria Tinklaraščio įrašą (Upsert)
 */
export async function savePost(payload: any) {
  const supabase = await createClient();

  try {
    // Map frontend fields (title, content, image) to DB columns (pavadinimas, turinys, nuotrauka_url)
    const dbPayload: any = {
      id: payload.id,
      slug: payload.slug,
      kategorija: payload.category || "Naujienos",
      created_at: payload.date ? `${payload.date}T12:00:00Z` : undefined, // fallback or formatting
    };

    if (payload.title !== undefined) dbPayload.pavadinimas = payload.title;
    if (payload.content !== undefined) dbPayload.turinys = payload.content;
    if (payload.image !== undefined) dbPayload.nuotrauka_url = payload.image;
    
    // SEO fields
    if (payload.seo_title !== undefined) dbPayload.seo_title = payload.seo_title;
    if (payload.seo_description !== undefined) dbPayload.seo_description = payload.seo_description;
    if (payload.focus_keywords !== undefined) dbPayload.focus_keywords = payload.focus_keywords;

    // Handle ID for new items
    if (!dbPayload.id) {
      delete dbPayload.id; // Let Supabase generate or handle
    }

    const { data, error } = await supabase
      .from("tinklarastis_irasai")
      .upsert(dbPayload)
      .select('id')
      .single();

    if (error) throw error;

    revalidatePath("/admin/blog");
    revalidatePath("/");
    return { success: true, message: "Įrašas išsaugotas sėkmingai", post: { id: data?.id || payload.id } };
  } catch (error: any) {
    console.error("Failed to save post:", error);
    return { success: false, error: error.message || "Nepavyko išsaugoti įrašo" };
  }
}
