export const CATALOG_PERSONA_SLUGS = [
  "seoyeon-modern-senior",
  "eiren-fantasy-guardian",
  "makise-kurisu",
] as const;

export type CatalogPersonaSlug = (typeof CATALOG_PERSONA_SLUGS)[number];

export function isCatalogSlug(slug: string): slug is CatalogPersonaSlug {
  return (CATALOG_PERSONA_SLUGS as readonly string[]).includes(slug);
}
