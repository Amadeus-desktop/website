import type { CatalogPersonaSlug } from "@/features/personas/lib/catalog";

const SPEAKER_ALIASES: Record<CatalogPersonaSlug, string[]> = {
  "seoyeon-modern-senior": ["Seoyeon", "서연", "한서연"],
  "eiren-fantasy-guardian": ["Eiren", "에이렌"],
  "makise-kurisu": ["Kurisu", "Christina", "크리스", "크리스티나", "마키세 크리스"],
};

export function getPersonaSpeakerLabels(
  personaName: string,
  slug?: string,
): string[] {
  const labels = new Set<string>([
    personaName,
    ...personaName.split(/\s+/),
    "assistant",
    "ai",
    "페르소나",
  ]);

  if (slug && slug in SPEAKER_ALIASES) {
    for (const alias of SPEAKER_ALIASES[slug as CatalogPersonaSlug]) {
      labels.add(alias);
    }
  }

  return [...labels].filter(Boolean);
}
