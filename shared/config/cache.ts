/** Shared cache policy for Amadeus web routes and queries. */

export const CACHE_TAGS = {
  catalogPersonas: "catalog-personas",
  persona: (id: string) => `persona-${id}`,
} as const;

/** Catalog personas change infrequently — safe to cache at the edge. */
export const CATALOG_REVALIDATE_SECONDS = 300;

/** Persona detail pages (public catalog entries). */
export const PERSONA_DETAIL_REVALIDATE_SECONDS = 300;

/** Home / character list ISR-style revalidation. */
export const LIST_PAGE_REVALIDATE_SECONDS = 300;
