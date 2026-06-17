import type { SupabaseClient } from "@supabase/supabase-js";
import { PERSONA_SELECT } from "@/features/personas/lib/columns";
import type { Persona } from "@/shared/types/database";

/** Canonical catalog row for a slug (highest version wins). */
export async function getCanonicalTemplateBySlug(
  supabase: SupabaseClient,
  slug: string,
): Promise<Persona | null> {
  const { data, error } = await supabase
    .from("personas")
    .select(PERSONA_SELECT)
    .eq("slug", slug)
    .is("deleted_at", null)
    .order("version", { ascending: false })
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error("getCanonicalTemplateBySlug error:", error);
    return null;
  }

  return (data as Persona | null) ?? null;
}
