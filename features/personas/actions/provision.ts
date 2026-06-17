"use server";

import {
  CATALOG_PERSONA_SLUGS,
  isCatalogSlug,
} from "@/features/personas/lib/catalog";
import { PERSONA_SELECT } from "@/features/personas/lib/columns";
import { getCanonicalTemplateBySlug } from "@/features/personas/lib/resolve-template";
import { createClient } from "@/shared/lib/supabase/server";
import type { Persona } from "@/shared/types/database";

async function syncUserPersonaFromTemplate(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string,
  existing: Persona,
  template: Persona,
): Promise<Persona> {
  if (template.version <= existing.version) {
    return existing;
  }

  const { data, error } = await supabase
    .from("personas")
    .update({
      name: template.name,
      slug: template.slug,
      base_tone: template.base_tone,
      relationship_type: template.relationship_type,
      world_type: template.world_type,
      static_prompt_json: template.static_prompt_json,
      version: template.version,
    })
    .eq("id", existing.id)
    .eq("user_id", userId)
    .select(PERSONA_SELECT)
    .single();

  if (error || !data) {
    console.error("syncUserPersonaFromTemplate error:", error);
    return existing;
  }

  return data as Persona;
}

export async function ensureUserPersona(
  userId: string,
  catalogPersonaId: string,
): Promise<Persona | null> {
  const supabase = await createClient();

  const { data: catalogPersona, error: catalogError } = await supabase
    .from("personas")
    .select(PERSONA_SELECT)
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

  const template =
    (await getCanonicalTemplateBySlug(supabase, catalogPersona.slug)) ??
    (catalogPersona as Persona);

  if (catalogPersona.user_id === userId) {
    return syncUserPersonaFromTemplate(
      supabase,
      userId,
      catalogPersona as Persona,
      template,
    );
  }

  const { data: existing } = await supabase
    .from("personas")
    .select(PERSONA_SELECT)
    .eq("user_id", userId)
    .eq("slug", catalogPersona.slug)
    .is("deleted_at", null)
    .maybeSingle();

  if (existing) {
    return syncUserPersonaFromTemplate(
      supabase,
      userId,
      existing as Persona,
      template,
    );
  }

  const { data: created, error: insertError } = await supabase
    .from("personas")
    .insert({
      user_id: userId,
      name: template.name,
      slug: template.slug,
      base_tone: template.base_tone,
      relationship_type: template.relationship_type,
      world_type: template.world_type,
      static_prompt_json: template.static_prompt_json,
      version: template.version,
    })
    .select(PERSONA_SELECT)
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
    recent_mood: template.base_tone,
    open_loops: [],
    state_source: "web",
    version: 1,
    is_current: true,
  });

  return created as Persona;
}

export async function ensureUserPersonas(userId: string): Promise<void> {
  for (const slug of CATALOG_PERSONA_SLUGS) {
    const supabase = await createClient();
    const template = await getCanonicalTemplateBySlug(supabase, slug);
    if (!template) continue;

    const { data: existing } = await supabase
      .from("personas")
      .select("id")
      .eq("user_id", userId)
      .eq("slug", slug)
      .is("deleted_at", null)
      .maybeSingle();

    if (existing) {
      await ensureUserPersona(userId, existing.id);
      continue;
    }

    await ensureUserPersona(userId, template.id);
  }
}
