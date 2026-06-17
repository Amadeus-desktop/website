"use server";

import {
  CATALOG_PERSONA_SLUGS,
  isCatalogSlug,
} from "@/features/personas/lib/catalog";
import { createClient } from "@/shared/lib/supabase/server";
import type { Persona } from "@/shared/types/database";

async function getCatalogTemplate(slug: string): Promise<Persona | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("personas")
    .select("*")
    .eq("slug", slug)
    .is("deleted_at", null)
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error("getCatalogTemplate error:", error);
    return null;
  }

  return (data as Persona | null) ?? null;
}

export async function ensureUserPersona(
  userId: string,
  catalogPersonaId: string,
): Promise<Persona | null> {
  const supabase = await createClient();

  const { data: catalogPersona, error: catalogError } = await supabase
    .from("personas")
    .select("*")
    .eq("id", catalogPersonaId)
    .is("deleted_at", null)
    .maybeSingle();

  if (catalogError || !catalogPersona) {
    console.error("ensureUserPersona catalog lookup:", catalogError);
    return null;
  }

  if (!isCatalogSlug(catalogPersona.slug)) {
    return catalogPersona as Persona;
  }

  if (catalogPersona.user_id === userId) {
    return catalogPersona as Persona;
  }

  const { data: existing } = await supabase
    .from("personas")
    .select("*")
    .eq("user_id", userId)
    .eq("slug", catalogPersona.slug)
    .is("deleted_at", null)
    .maybeSingle();

  if (existing) {
    return existing as Persona;
  }

  const { data: created, error: insertError } = await supabase
    .from("personas")
    .insert({
      user_id: userId,
      name: catalogPersona.name,
      slug: catalogPersona.slug,
      base_tone: catalogPersona.base_tone,
      relationship_type: catalogPersona.relationship_type,
      world_type: catalogPersona.world_type,
      static_prompt_json: catalogPersona.static_prompt_json,
      version: catalogPersona.version,
    })
    .select("*")
    .single();

  if (insertError || !created) {
    console.error("ensureUserPersona insert:", insertError);
    return null;
  }

  await supabase.from("persona_states").insert({
    user_id: userId,
    persona_id: created.id,
    relationship_stage: "stranger",
    affinity: 0,
    trust_state: "neutral",
    recent_mood: catalogPersona.base_tone,
    open_loops: [],
    state_source: "web",
    version: 1,
    is_current: true,
  });

  return created as Persona;
}

export async function ensureUserPersonas(userId: string): Promise<void> {
  for (const slug of CATALOG_PERSONA_SLUGS) {
    const template = await getCatalogTemplate(slug);
    if (!template) continue;

    if (template.user_id === userId) continue;

    const { data: existing } = await createClient()
      .then((sb) =>
        sb
          .from("personas")
          .select("id")
          .eq("user_id", userId)
          .eq("slug", slug)
          .is("deleted_at", null)
          .maybeSingle(),
      );

    if (existing) continue;

    await ensureUserPersona(userId, template.id);
  }
}
