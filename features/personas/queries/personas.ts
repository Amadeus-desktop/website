import { createClient } from "@/shared/lib/supabase/server";
import type { Persona } from "@/shared/types/database";

export { getCatalogPersonas, getPersonaById } from "@/features/personas/queries/catalog";

export async function getPersonaBySlug(
  userId: string,
  slug: string,
): Promise<Persona | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("personas")
    .select("*")
    .eq("user_id", userId)
    .eq("slug", slug)
    .is("deleted_at", null)
    .maybeSingle();

  if (error) {
    console.error("getPersonaBySlug error:", error);
    return null;
  }

  return (data as Persona | null) ?? null;
}
