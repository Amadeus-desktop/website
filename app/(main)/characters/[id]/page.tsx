import { StartChatButton } from "@/features/chat/components/StartChatButton";
import { getCharacterById } from "@/features/characters/queries/characters";
import { Avatar } from "@/shared/components/ui/Avatar";
import { Badge } from "@/shared/components/ui/Badge";
import { Card, CardContent } from "@/shared/components/ui/Card";
import { notFound } from "next/navigation";

type CharacterDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function CharacterDetailPage({
  params,
}: CharacterDetailPageProps) {
  const { id } = await params;
  const character = await getCharacterById(id);

  if (!character) {
    notFound();
  }

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6">
      <Card>
        <CardContent className="flex flex-col items-center gap-4 p-8 text-center sm:flex-row sm:text-left">
          <Avatar
            src={character.avatar_url}
            name={character.name}
            size="xl"
          />
          <div className="flex flex-1 flex-col gap-2">
            <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
              <h1 className="text-2xl font-bold text-foreground">
                {character.name}
              </h1>
              {character.is_official && <Badge variant="primary">공식</Badge>}
              {character.gender && <Badge>{character.gender}</Badge>}
            </div>
            <p className="text-sm text-muted italic">&ldquo;{character.greeting}&rdquo;</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="flex flex-col gap-4 p-6">
          <section>
            <h2 className="mb-2 font-semibold text-foreground">성격</h2>
            <p className="text-sm leading-relaxed text-muted">
              {character.personality}
            </p>
          </section>
          <section>
            <h2 className="mb-2 font-semibold text-foreground">배경 스토리</h2>
            <p className="text-sm leading-relaxed text-muted">
              {character.backstory}
            </p>
          </section>
          <StartChatButton characterId={character.id} />
        </CardContent>
      </Card>
    </div>
  );
}
