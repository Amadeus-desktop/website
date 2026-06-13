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
      <div className="flex flex-col items-center justify-center rounded-card border border-dashed border-border py-16 text-center">
        <p className="text-muted">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {characters.map((character) => (
        <CharacterCard key={character.id} character={character} />
      ))}
    </div>
  );
}
