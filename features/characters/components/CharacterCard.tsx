import type { Character } from "@/shared/types/database";
import Link from "next/link";

function hashCode(str: string) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function formatViews(id: string) {
  const n = (hashCode(id) % 900 + 100) / 10;
  return n >= 100 ? `${(n / 10).toFixed(1)}K` : `${n.toFixed(1)}K`;
}

function getGradient(name: string) {
  const hues = [330, 280, 200, 160, 40, 10];
  const h = hues[hashCode(name) % hues.length];
  return `linear-gradient(160deg, hsl(${h} 45% 28%), hsl(${(h + 40) % 360} 35% 18%))`;
}

function getTags(character: Character): string[] {
  const tags: string[] = [];
  if (character.is_official) tags.push("Official");
  if (character.gender === "male") tags.push("Handsome");
  if (character.gender === "female") tags.push("Beautiful");
  if (character.personality.includes("따뜻")) tags.push("Warm");
  if (character.personality.includes("차분")) tags.push("Calm");
  if (character.personality.includes("밝")) tags.push("Cheerful");
  if (character.personality.includes("쿨")) tags.push("Cool");
  if (character.personality.includes("신비")) tags.push("Mysterious");
  if (tags.length < 2) tags.push("AI Character");
  return tags.slice(0, 3);
}

type CharacterCardProps = {
  character: Character;
};

export function CharacterCard({ character }: CharacterCardProps) {
  const tags = getTags(character);
  const views = formatViews(character.id);

  return (
    <Link href={`/characters/${character.id}`} className="group block">
      <div className="relative aspect-[3/4] overflow-hidden rounded-xl">
        {character.avatar_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={character.avatar_url}
            alt={character.name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div
            className="flex h-full w-full items-end justify-center pb-8"
            style={{ background: getGradient(character.name) }}
          >
            <span className="text-5xl font-bold text-white/20">
              {character.name[0]}
            </span>
          </div>
        )}
        <div className="absolute left-2 top-2 flex items-center gap-1 rounded-full bg-black/50 px-2 py-0.5 text-xs text-white backdrop-blur-sm">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 12a5 5 0 100-10 5 5 0 000 10zm0 2c-4.42 0-8 2.24-8 5v1h16v-1c0-2.76-3.58-5-8-5z" />
          </svg>
          {views}
        </div>
      </div>

      <div className="mt-2 space-y-1">
        <h3 className="truncate text-sm font-bold text-foreground group-hover:text-primary transition-colors">
          {character.name}
        </h3>
        <p className="line-clamp-1 text-xs text-muted">
          {character.greeting}
        </p>
        <div className="flex flex-wrap gap-1">
          {tags.map((tag) => (
            <span key={tag} className="text-xs text-tag">
              #{tag}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}
