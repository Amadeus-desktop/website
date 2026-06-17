import { unstable_cache } from "next/cache";
import { CATALOG_PERSONA_SLUGS } from "@/features/personas/lib/catalog";
import {
  CACHE_TAGS,
  CATALOG_REVALIDATE_SECONDS,
  PERSONA_DETAIL_REVALIDATE_SECONDS,
} from "@/shared/config/cache";
import { createPublicClient } from "@/shared/lib/supabase/public";
import type { Persona } from "@/shared/types/database";

const PERSONA_LIST_COLUMNS =
  "id, name, slug, world_type, base_tone, relationship_type, static_prompt_json, version, created_at, updated_at, deleted_at, user_id";

function dedupeCatalogPersonas(rows: Persona[]): Persona[] {
  const bySlug = new Map<string, Persona>();
  for (const persona of rows) {
    if (!bySlug.has(persona.slug)) {
      bySlug.set(persona.slug, persona);
    }
  }

  return CATALOG_PERSONA_SLUGS.map((slug) => bySlug.get(slug)).filter(
    (persona): persona is Persona => Boolean(persona),
  );
}

async function fetchCatalogPersonas(search?: string): Promise<Persona[]> {
  const supabase = createPublicClient();

  let query = supabase
    .from("personas")
    .select(PERSONA_LIST_COLUMNS)
    .in("slug", [...CATALOG_PERSONA_SLUGS])
    .is("deleted_at", null)
    .order("created_at", { ascending: true });

  if (search?.trim()) {
    query = query.ilike("name", `%${search.trim()}%`);
  }

  const { data, error } = await query;

  if (error) {
    console.error("fetchCatalogPersonas error:", error);
    return [];
  }

  return dedupeCatalogPersonas((data ?? []) as Persona[]);
}

async function fetchPersonaById(id: string): Promise<Persona | null> {
  const supabase = createPublicClient();

  const { data, error } = await supabase
    .from("personas")
    .select(PERSONA_LIST_COLUMNS)
    .eq("id", id)
    .is("deleted_at", null)
    .maybeSingle();

  if (error) {
    console.error("fetchPersonaById error:", error);
    return null;
  }

  return (data as Persona | null) ?? null;
}

const getCachedCatalogPersonasBase = unstable_cache(
  async () => fetchCatalogPersonas(),
  [CACHE_TAGS.catalogPersonas],
  {
    revalidate: CATALOG_REVALIDATE_SECONDS,
    tags: [CACHE_TAGS.catalogPersonas],
  },
);

export async function getCatalogPersonas(search?: string): Promise<Persona[]> {
  if (search?.trim()) {
    return fetchCatalogPersonas(search);
  }

  return getCachedCatalogPersonasBase();
}

export async function getPersonaById(id: string): Promise<Persona | null> {
  const cached = unstable_cache(
    async () => fetchPersonaById(id),
    [CACHE_TAGS.persona(id)],
    {
      revalidate: PERSONA_DETAIL_REVALIDATE_SECONDS,
      tags: [CACHE_TAGS.persona(id), CACHE_TAGS.catalogPersonas],
    },
  );

  return cached();
}
