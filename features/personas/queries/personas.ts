import { ensureUserPersona } from "@/features/personas/actions/provision";
import { PERSONA_SELECT } from "@/features/personas/lib/columns";
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
    .select(PERSONA_SELECT)
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

/** Resolve catalog/detail id to the signed-in user's persona row with full JSON. */
export async function resolvePersonaForUser(
  userId: string,
  personaId: string,
): Promise<Persona | null> {
  return ensureUserPersona(userId, personaId);
}
