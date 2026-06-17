import { CATALOG_PERSONA_SLUGS } from "@/features/personas/lib/catalog";
import { createClient } from "@/shared/lib/supabase/server";
import type { Persona } from "@/shared/types/database";

export async function getCatalogPersonas(search?: string): Promise<Persona[]> {
  const supabase = await createClient();

  let query = supabase
    .from("personas")
    .select("*")
    .in("slug", [...CATALOG_PERSONA_SLUGS])
    .is("deleted_at", null)
    .order("created_at", { ascending: true });

  if (search?.trim()) {
    query = query.ilike("name", `%${search.trim()}%`);
  }

  const { data, error } = await query;

  if (error) {
    console.error("getCatalogPersonas error:", error);
    return [];
  }

  const bySlug = new Map<string, Persona>();
  for (const persona of (data ?? []) as Persona[]) {
    if (!bySlug.has(persona.slug)) {
      bySlug.set(persona.slug, persona);
    }
  }

  return CATALOG_PERSONA_SLUGS.map((slug) => bySlug.get(slug)).filter(
    (persona): persona is Persona => Boolean(persona),
  );
}

export async function getPersonaById(id: string): Promise<Persona | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("personas")
    .select("*")
    .eq("id", id)
    .is("deleted_at", null)
    .maybeSingle();

  if (error) {
    console.error("getPersonaById error:", error);
    return null;
  }

  return (data as Persona | null) ?? null;
}

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
