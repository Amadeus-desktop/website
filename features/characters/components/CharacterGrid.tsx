import { CharacterCard } from "@/features/characters/components/CharacterCard";
import { GRID } from "@/shared/config/layout";
import type { Character } from "@/shared/types/database";

type CharacterGridProps = {
  characters: Character[];
  emptyMessage?: string;
};

export function CharacterGrid({
  characters,
  emptyMessage = "",
}: CharacterGridProps) {
  if (characters.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <p className="text-base text-muted md:text-lg">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className={GRID.characters}>
      {characters.map((character) => (
        <CharacterCard key={character.id} character={character} />
      ))}
    </div>
  );
}
