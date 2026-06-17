import { PersonaGrid } from "@/features/personas/components/PersonaGrid";
import { toPersonaCardView } from "@/features/personas/lib/display";
import { getCatalogPersonas } from "@/features/personas/queries/personas";

export default async function CharactersPage() {
  const personas = (await getCatalogPersonas()).map(toPersonaCardView);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">페르소나</h1>
        <p className="text-sm text-muted">Amadeus 공식 페르소나</p>
      </div>
      <PersonaGrid personas={personas} />
    </div>
  );
}
