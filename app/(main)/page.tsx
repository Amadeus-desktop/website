import { Suspense } from "react";
import { CategoryFilters } from "@/features/characters/components/CategoryFilters";
import { CharacterGrid } from "@/features/characters/components/CharacterGrid";
import { SortTabs } from "@/features/characters/components/SortTabs";
import { getCharacters } from "@/features/characters/queries/characters";
import { getServerLocale } from "@/shared/i18n/server";
import { translate } from "@/shared/i18n";
import type { Character } from "@/shared/types/database";

type HomePageProps = {
  searchParams: Promise<{ q?: string; category?: string; sort?: string }>;
};

function filterByCategory(characters: Character[], category: string) {
  if (!category || category === "all") return characters;

  const rules: Record<string, (c: Character) => boolean> = {
    romance: (c) =>
      /로맨|사랑|설레|다정|애정/.test(c.personality + c.backstory),
    fantasy: (c) =>
      /신|마법|판타지|세계|달빛|별/.test(c.personality + c.backstory),
    school: (c) =>
      /학교|대학|학생|캠퍼스/.test(c.personality + c.backstory),
    fantasy2: (c) =>
      /수호|밤|도시|카페/.test(c.personality + c.backstory),
    slice: (c) =>
      /일상|친구|함께|웃/.test(c.personality + c.backstory),
    other: (c) => !c.is_official,
  };

  const rule = rules[category];
  return rule ? characters.filter(rule) : characters;
}

function sortCharacters(characters: Character[], sort: string) {
  const list = [...characters];
  switch (sort) {
    case "best":
      return list.sort((a, b) => Number(b.is_official) - Number(a.is_official));
    case "new":
      return list.sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
      );
    default:
      return list;
  }
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const { q, category = "all", sort = "trending" } = await searchParams;
  const locale = await getServerLocale();
  const all = await getCharacters(q);
  const characters = sortCharacters(filterByCategory(all, category), sort);

  return (
    <div className="flex flex-col gap-5 md:gap-6">
      <Suspense fallback={<div className="h-10 animate-pulse rounded-full bg-surface-elevated" />}>
        <CategoryFilters />
      </Suspense>
      <Suspense fallback={<div className="h-6" />}>
        <SortTabs />
      </Suspense>
      <CharacterGrid
        characters={characters}
        emptyMessage={translate(locale, "common.empty")}
      />
      {characters.length > 0 && (
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
