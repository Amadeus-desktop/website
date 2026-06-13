import { StartChatButton } from "@/features/chat/components/StartChatButton";
import { getCharacterById } from "@/features/characters/queries/characters";
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
  const character = await getCharacterById(id);

  if (!character) {
    notFound();
  }

  return (
    <div className="mx-auto flex max-w-lg flex-col gap-6">
      <div
        className="relative aspect-[3/4] overflow-hidden rounded-2xl"
        style={
          character.avatar_url
            ? undefined
            : { background: getGradient(character.name) }
        }
      >
        {character.avatar_url && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={character.avatar_url}
            alt={character.name}
            className="h-full w-full object-cover"
          />
        )}
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-6">
          <h1 className="text-2xl font-bold text-white">{character.name}</h1>
          {character.gender && (
            <p className="mt-1 text-sm text-white/70">{character.gender}</p>
          )}
        </div>
      </div>

      <div className="space-y-4 rounded-2xl bg-surface p-5">
        <p className="text-sm italic text-muted">&ldquo;{character.greeting}&rdquo;</p>
        <section>
          <h2 className="mb-2 text-sm font-bold text-foreground">성격</h2>
          <p className="text-sm leading-relaxed text-muted">
            {character.personality}
          </p>
        </section>
        <section>
          <h2 className="mb-2 text-sm font-bold text-foreground">배경 스토리</h2>
          <p className="text-sm leading-relaxed text-muted">
            {character.backstory}
          </p>
        </section>
        <StartChatButton characterId={character.id} />
      </div>
    </div>
  );
}
