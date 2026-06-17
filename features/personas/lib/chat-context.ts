import type { Persona } from "@/shared/types/database";

export type PersonaChatContext = {
  id: string;
  slug: string;
  name: string;
  avatar_url: string | null;
  personality: string;
  backstory: string;
  greeting: string;
};

export function personaToChatContext(persona: Persona): PersonaChatContext {
  const prompt = persona.static_prompt_json;

  return {
    id: persona.id,
    slug: persona.slug,
    name: persona.name,
    avatar_url: null,
    personality:
      prompt.backstory?.summary ??
      prompt.identity?.role ??
      persona.base_tone,
    backstory:
      prompt.backstory?.emotional_core ??
      prompt.scenario?.relationship_hook ??
      "",
    greeting: prompt.first_message,
  };
}
