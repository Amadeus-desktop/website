import { Suspense } from "react";
import { CharacterSearch } from "@/features/characters/components/CharacterSearch";
import { CharacterGrid } from "@/features/characters/components/CharacterGrid";
import { getCharacters } from "@/features/characters/queries/characters";
import { Button } from "@/shared/components/ui/Button";
import Link from "next/link";

type HomePageProps = {
  searchParams: Promise<{ q?: string }>;
};

export default async function HomePage({ searchParams }: HomePageProps) {
  const { q } = await searchParams;
  const characters = await getCharacters(q);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">캐릭터 탐색</h1>
          <p className="text-sm text-muted">
            마음에 드는 캐릭터를 찾아 특별한 대화를 시작하세요
          </p>
        </div>
        <Link href="/characters/new">
          <Button>+ 캐릭터 만들기</Button>
        </Link>
      </div>
      <Suspense fallback={<div className="h-10 rounded-xl bg-surface-elevated animate-pulse" />}>
        <CharacterSearch defaultValue={q} />
      </Suspense>
      <CharacterGrid
        characters={characters}
        emptyMessage="검색 결과가 없습니다"
      />
    </div>
  );
}
