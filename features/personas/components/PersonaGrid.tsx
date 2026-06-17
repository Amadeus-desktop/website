import { PersonaCard } from "@/features/personas/components/PersonaCard";
import type { PersonaCardView } from "@/features/personas/lib/display";
import { GRID } from "@/shared/config/layout";

type PersonaGridProps = {
  personas: PersonaCardView[];
  emptyMessage?: string;
};

export function PersonaGrid({
  personas,
  emptyMessage = "",
}: PersonaGridProps) {
  if (personas.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <p className="text-base text-muted md:text-lg">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className={GRID.characters}>
      {personas.map((persona) => (
        <PersonaCard key={persona.id} persona={persona} />
      ))}
    </div>
  );
}
