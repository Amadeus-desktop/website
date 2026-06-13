import { CharacterGrid } from "@/features/characters/components/CharacterGrid";
import { getCharacters } from "@/features/characters/queries/characters";
import { Button } from "@/shared/components/ui/Button";
import Link from "next/link";

export default async function CharactersPage() {
  const characters = await getCharacters();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">모든 캐릭터</h1>
          <p className="text-sm text-muted">공식 및 커뮤니티 캐릭터</p>
        </div>
        <Link href="/characters/new">
          <Button size="sm">+ 만들기</Button>
        </Link>
      </div>
      <CharacterGrid characters={characters} />
    </div>
  );
}
