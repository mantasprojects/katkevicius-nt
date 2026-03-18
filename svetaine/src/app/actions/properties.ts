"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

/**
 * Ištrina NT objektą iš DB ir automatiškai išvalo jo nuotraukas iš Supabase Storage.
 */
export async function deleteProperty(id: string) {
  const supabase = await createClient();

  try {
    // 1. Gauti objekto nuotraukų URL adresus
    const { data: property, error: fetchError } = await supabase
      .from("nt_objektai")
      .select("nuotraukos_urls")
      .eq("id", id)
      .single();

    if (fetchError) throw fetchError;

    // 2. Išvalyti nuotraukas iš Supabase Storage
    if (property?.nuotraukos_urls) {
      const urls: string[] = typeof property.nuotraukos_urls === "string" 
        ? JSON.parse(property.nuotraukos_urls) 
        : property.nuotraukos_urls;

      const pathsToDelete = urls
        .map(url => {
          // Ištraukia kelią (pvz., 'uploads/filename.png') iš publicUrl
          const parts = url.split("/properties/");
          return parts.length > 1 ? parts[1] : null;
        })
        .filter(path => path !== null) as string[];

      if (pathsToDelete.length > 0) {
        const { error: storageError } = await supabase.storage
          .from("properties")
          .remove(pathsToDelete);

        if (storageError) {
          console.error("Storage cleanup error:", storageError);
        }
      }
    }

    // 3. Ištrinti patį įrašą
    const { error: dbError } = await supabase
      .from("nt_objektai")
      .delete()
      .eq("id", id);

    if (dbError) throw dbError;

    revalidatePath("/admin/nt-objektai");
    return { success: true, message: "Objektas sėkmingai ištrintas" };
  } catch (error: any) {
    console.error("Failed to delete property:", error);
    return { success: false, error: error.message || "Nepavyko ištrinti objekto" };
  }
}

/**
 * Atnaujina NT objekto duomenis
 */
export async function updateProperty(id: string, payload: any) {
  const supabase = await createClient();

  try {
    const { error } = await supabase
      .from("nt_objektai")
      .update(payload)
      .eq("id", id);

    if (error) throw error;

    revalidatePath("/admin/nt-objektai");
    revalidatePath(`/objektai`);
    return { success: true, message: "Duomenys atnaujinti sėkmingai" };
  } catch (error: any) {
    console.error("Failed to update property:", error);
    return { success: false, error: error.message || "Nepavyko atnaujinti duomenų" };
  }
}
