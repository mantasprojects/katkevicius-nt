"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

/**
 * Ištrina atsiliepimą
 */
export async function deleteReview(id: string) {
  const supabase = await createClient();

  try {
    const { error } = await supabase
      .from("atsiliepimai")
      .delete()
      .eq("id", id);

    if (error) throw error;

    revalidatePath("/admin/atsiliepimai");
    revalidatePath("/");
    return { success: true };
  } catch (error: any) {
    console.error("Failed to delete review:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Atnaujina atsiliepimo statusą (patvirtinti / paslėpti)
 */
export async function updateReview(id: string, payload: any) {
  const supabase = await createClient();

  try {
    const { error } = await supabase
      .from("atsiliepimai")
      .update(payload)
      .eq("id", id);

    if (error) throw error;

    revalidatePath("/admin/atsiliepimai");
    revalidatePath("/");
    return { success: true };
  } catch (error: any) {
    console.error("Failed to update review:", error);
    return { success: false, error: error.message };
  }
}
