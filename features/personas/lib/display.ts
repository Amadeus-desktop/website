import type { Persona } from "@/shared/types/database";

export type PersonaCardView = {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  summary: string;
  worldType: string;
  baseTone: string;
  relationshipType: string;
  isOfficial: true;
};

export function toPersonaCardView(persona: Persona): PersonaCardView {
  const prompt = persona.static_prompt_json;

  return {
    id: persona.id,
    slug: persona.slug,
    name: persona.name,
    tagline: prompt.first_message,
    summary:
      prompt.backstory?.summary ??
      prompt.identity?.role ??
      prompt.scenario?.relationship_hook ??
      "",
    worldType: persona.world_type,
    baseTone: persona.base_tone,
    relationshipType: persona.relationship_type,
    isOfficial: true,
  };
}

export function getPersonaTagKeys(persona: PersonaCardView): string[] {
  const keys: string[] = ["tag.official"];

  if (persona.worldType.includes("romance")) keys.push("tag.warm");
  if (persona.worldType.includes("fantasy")) keys.push("tag.mysterious");
  if (persona.worldType.includes("sci_fi")) keys.push("tag.cool");
  if (persona.baseTone.includes("tsundere")) keys.push("tag.calm");

  if (keys.length < 2) keys.push("tag.ai");
  return keys.slice(0, 3);
}

export function matchesPersonaCategory(
  persona: PersonaCardView,
  category: string,
): boolean {
  if (!category || category === "all") return true;

  const rules: Record<string, (p: PersonaCardView) => boolean> = {
    romance: (p) => p.worldType.includes("romance"),
    fantasy: (p) => p.worldType.includes("fantasy"),
    school: (p) => /school|lab|학/.test(p.summary + p.relationshipType),
    fantasy2: (p) => p.worldType.includes("fantasy"),
    slice: (p) => p.worldType.includes("sci_fi") || p.worldType.includes("modern"),
    other: () => true,
  };

  const rule = rules[category];
  return rule ? rule(persona) : true;
}
