import { Avatar } from "@/shared/components/ui/Avatar";
import { Badge } from "@/shared/components/ui/Badge";
import { Card, CardContent } from "@/shared/components/ui/Card";
import type { Character } from "@/shared/types/database";
import Link from "next/link";

type CharacterCardProps = {
  character: Character;
};

export function CharacterCard({ character }: CharacterCardProps) {
  return (
    <Link href={`/characters/${character.id}`}>
      <Card className="group overflow-hidden transition-all hover:border-primary/40 hover:shadow-md">
        <CardContent className="flex flex-col items-center gap-3 p-4 text-center">
          <Avatar
            src={character.avatar_url}
            name={character.name}
            size="xl"
          />
          <div className="flex flex-col gap-1">
            <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
              {character.name}
            </h3>
            <p className="line-clamp-2 text-xs text-muted">
              {character.personality}
            </p>
          </div>
          <div className="flex gap-1.5">
            {character.is_official && (
              <Badge variant="primary">공식</Badge>
            )}
            {character.gender && (
              <Badge>{character.gender}</Badge>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
