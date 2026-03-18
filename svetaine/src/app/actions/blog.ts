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
    const { error } = await supabase
      .from("tinklarastis_irasai")
      .upsert(payload);

    if (error) throw error;

    revalidatePath("/admin/blog");
    revalidatePath("/");
    return { success: true, message: "Įrašas išsaugotas sėkmingai" };
  } catch (error: any) {
    console.error("Failed to save post:", error);
    return { success: false, error: error.message || "Nepavyko išsaugoti įrašo" };
  }
}
