import { unstable_cache } from "next/cache";
import { CATALOG_PERSONA_SLUGS } from "@/features/personas/lib/catalog";
import { PERSONA_SELECT } from "@/features/personas/lib/columns";
import { getCanonicalTemplateBySlug } from "@/features/personas/lib/resolve-template";
import {
  CACHE_TAGS,
  CATALOG_REVALIDATE_SECONDS,
  PERSONA_DETAIL_REVALIDATE_SECONDS,
} from "@/shared/config/cache";
import { createPublicClient } from "@/shared/lib/supabase/public";
import { createClient } from "@/shared/lib/supabase/server";
import type { Persona } from "@/shared/types/database";

function orderCatalogPersonas(rows: Persona[]): Persona[] {
  const bySlug = new Map<string, Persona>();

  for (const persona of rows) {
    const current = bySlug.get(persona.slug);
    if (!current || persona.version > current.version) {
      bySlug.set(persona.slug, persona);
    }
  }

  return CATALOG_PERSONA_SLUGS.map((slug) => bySlug.get(slug)).filter(
    (persona): persona is Persona => Boolean(persona),
  );
}

async function fetchPublicCatalogPersonas(search?: string): Promise<Persona[]> {
  const supabase = createPublicClient();

  let query = supabase
    .from("personas")
    .select(PERSONA_SELECT)
    .in("slug", [...CATALOG_PERSONA_SLUGS])
    .is("deleted_at", null)
    .order("version", { ascending: false });

  if (search?.trim()) {
    query = query.ilike("name", `%${search.trim()}%`);
  }

  const { data, error } = await query;

  if (error) {
    console.error("fetchPublicCatalogPersonas error:", error);
    return [];
  }

  return orderCatalogPersonas((data ?? []) as Persona[]);
}

async function fetchUserCatalogPersonas(
  userId: string,
  search?: string,
): Promise<Persona[]> {
  const supabase = await createClient();

  let query = supabase
    .from("personas")
    .select(PERSONA_SELECT)
    .eq("user_id", userId)
    .in("slug", [...CATALOG_PERSONA_SLUGS])
    .is("deleted_at", null)
    .order("slug", { ascending: true });

  if (search?.trim()) {
    query = query.ilike("name", `%${search.trim()}%`);
  }

  const { data, error } = await query;

  if (error) {
    console.error("fetchUserCatalogPersonas error:", error);
    return fetchPublicCatalogPersonas(search);
  }

  const userPersonas = (data ?? []) as Persona[];
  if (userPersonas.length === CATALOG_PERSONA_SLUGS.length) {
    return orderCatalogPersonas(userPersonas);
  }

  const merged: Persona[] = [];

  for (const slug of CATALOG_PERSONA_SLUGS) {
    const owned = userPersonas.find((persona) => persona.slug === slug);
    if (owned) {
      merged.push(owned);
      continue;
    }

    const template = await getCanonicalTemplateBySlug(supabase, slug);
    if (template) merged.push(template);
  }

  return search?.trim()
    ? merged.filter((persona) =>
        persona.name.toLowerCase().includes(search.trim().toLowerCase()),
      )
    : merged;
}

async function fetchPersonaById(id: string): Promise<Persona | null> {
  const supabase = createPublicClient();

  const { data, error } = await supabase
    .from("personas")
    .select(PERSONA_SELECT)
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
  async () => fetchPublicCatalogPersonas(),
  [CACHE_TAGS.catalogPersonas],
  {
    revalidate: CATALOG_REVALIDATE_SECONDS,
    tags: [CACHE_TAGS.catalogPersonas],
  },
);

export async function getCatalogPersonas(
  search?: string,
  userId?: string | null,
): Promise<Persona[]> {
  if (userId) {
    return fetchUserCatalogPersonas(userId, search);
  }

  if (search?.trim()) {
    return fetchPublicCatalogPersonas(search);
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
