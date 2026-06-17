import { StartChatButton } from "@/features/chat/components/StartChatButton";
import { getPersonaById } from "@/features/personas/queries/personas";
import { notFound } from "next/navigation";

type CharacterDetailPageProps = {
  params: Promise<{ id: string }>;
};

function getGradient(name: string) {
  return `linear-gradient(160deg, hsl(330 45% 28%), hsl(10 35% 18%))`;
}

export default async function CharacterDetailPage({
  params,
}: CharacterDetailPageProps) {
  const { id } = await params;
  const persona = await getPersonaById(id);

  if (!persona) {
    notFound();
  }

  const prompt = persona.static_prompt_json;

  return (
    <div className="mx-auto flex max-w-lg flex-col gap-6">
      <div
        className="relative aspect-[3/4] overflow-hidden rounded-2xl"
        style={{ background: getGradient(persona.name) }}
      >
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-6">
          <h1 className="text-2xl font-bold text-white">{persona.name}</h1>
          <p className="mt-1 text-sm text-white/70">{persona.world_type}</p>
        </div>
      </div>

      <div className="space-y-4 rounded-2xl bg-surface p-5">
        <p className="text-sm italic text-muted">
          &ldquo;{prompt.first_message}&rdquo;
        </p>
        <section>
          <h2 className="mb-2 text-sm font-bold text-foreground">성격</h2>
          <p className="text-sm leading-relaxed text-muted">
            {prompt.backstory?.summary ?? prompt.identity?.role}
          </p>
        </section>
        <section>
          <h2 className="mb-2 text-sm font-bold text-foreground">배경 스토리</h2>
          <p className="text-sm leading-relaxed text-muted">
            {prompt.backstory?.emotional_core ??
              prompt.scenario?.relationship_hook}
          </p>
        </section>
        <StartChatButton personaId={persona.id} />
      </div>
    </div>
  );
}
