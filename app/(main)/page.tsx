import { Suspense } from "react";
import { CategoryFilters } from "@/features/characters/components/CategoryFilters";
import { SortTabs } from "@/features/characters/components/SortTabs";
import { PersonaGrid } from "@/features/personas/components/PersonaGrid";
import { getCurrentUser } from "@/features/auth/actions/auth";
import {
  matchesPersonaCategory,
  toPersonaCardView,
} from "@/features/personas/lib/display";
import { getCatalogPersonas } from "@/features/personas/queries/personas";
import { getServerLocale } from "@/shared/i18n/server";
import { translate } from "@/shared/i18n";
import type { PersonaCardView } from "@/features/personas/lib/display";

export const revalidate = 300;

type HomePageProps = {
  searchParams: Promise<{ q?: string; category?: string; sort?: string }>;
};

function sortPersonas(personas: PersonaCardView[], sort: string) {
  const list = [...personas];
  switch (sort) {
    case "best":
      return list.sort((a, b) => a.name.localeCompare(b.name, "ko"));
    case "new":
      return list.reverse();
    default:
      return list;
  }
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const { q, category = "all", sort = "trending" } = await searchParams;
  const [locale, user] = await Promise.all([getServerLocale(), getCurrentUser()]);
  const personas = (await getCatalogPersonas(q, user?.id))
    .map(toPersonaCardView)
    .filter((persona) => matchesPersonaCategory(persona, category));
  const sorted = sortPersonas(personas, sort);

  return (
    <div className="flex flex-col gap-5 md:gap-6">
      <Suspense fallback={<div className="h-10 animate-pulse rounded-full bg-surface-elevated" />}>
        <CategoryFilters />
      </Suspense>
      <Suspense fallback={<div className="h-6" />}>
        <SortTabs />
      </Suspense>
      <PersonaGrid
        personas={sorted}
        emptyMessage={translate(locale, "common.empty")}
      />
      {sorted.length > 0 && (
        <div className="flex justify-center pt-2">
          <button
            type="button"
            className="rounded-full bg-surface-elevated px-10 py-3 text-sm font-medium text-muted md:text-base"
          >
            {translate(locale, "common.more")}
          </button>
        </div>
      )}
    </div>
  );
}
