/** Centralized layout tokens — single source for responsive behavior */

export const LAYOUT = {
  contentMaxWidth: "1280px",
  contentPadding: "1.5rem",
  headerHeight: "56px",
  sidebarWidth: "72px",
  sidebarWidthLg: "80px",
} as const;

/** Tailwind grid class strings — avoid scattering breakpoints */
export const GRID = {
  characters:
    "grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-5",
  gap: "gap-4 md:gap-5",
} as const;

export const TYPO = {
  cardTitle: "text-base md:text-lg font-bold",
  cardSubtitle: "text-sm md:text-base",
  cardTag: "text-xs md:text-sm",
  tab: "text-sm md:text-base",
  header: "text-xl md:text-2xl",
} as const;
