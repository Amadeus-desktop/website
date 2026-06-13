import { CharacterCard } from "@/features/characters/components/CharacterCard";
import type { Character } from "@/shared/types/database";

type CharacterGridProps = {
  characters: Character[];
  emptyMessage?: string;
};

export function CharacterGrid({
  characters,
  emptyMessage = "캐릭터가 없습니다",
}: CharacterGridProps) {
  if (characters.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <p className="text-muted">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
      {characters.map((character) => (
        <CharacterCard key={character.id} character={character} />
      ))}
    </div>
  );
}
