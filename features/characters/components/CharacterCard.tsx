"use client";

import { TYPO } from "@/shared/config/layout";
import { useT } from "@/shared/i18n/use-translate";
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


function getGradient(name: string) {
  const hues = [330, 280, 200, 160, 40, 10];
  const h = hues[hashCode(name) % hues.length];
  return `linear-gradient(160deg, hsl(${h} 45% 28%), hsl(${(h + 40) % 360} 35% 18%))`;
}

function getTagKeys(character: Character): string[] {
  const keys: string[] = [];
  if (character.is_official) keys.push("tag.official");
  if (character.gender === "male") keys.push("tag.handsome");
  if (character.gender === "female") keys.push("tag.beautiful");
  if (character.personality.includes("따뜻")) keys.push("tag.warm");
  if (character.personality.includes("차분")) keys.push("tag.calm");
  if (character.personality.includes("밝")) keys.push("tag.cheerful");
  if (character.personality.includes("쿨")) keys.push("tag.cool");
  if (character.personality.includes("신비")) keys.push("tag.mysterious");
  if (keys.length < 2) keys.push("tag.ai");
  return keys.slice(0, 3);
}

type CharacterCardProps = {
  character: Character;
};

export function CharacterCard({ character }: CharacterCardProps) {
  const t = useT();
  const tagKeys = getTagKeys(character);
  return (
    <Link
      href={`/characters/${character.id}`}
      className="interactive-link group block min-w-0"
    >
      <div className="relative aspect-[3/4] min-h-[200px] overflow-hidden rounded-xl md:rounded-2xl md:min-h-[260px]">
        {character.avatar_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={character.avatar_url}
            alt={character.name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div
            className="flex h-full w-full items-end justify-center pb-10 transition-transform duration-300 group-hover:scale-[1.02]"
            style={{ background: getGradient(character.name) }}
          >
            <span className="text-6xl font-bold text-white/20 md:text-7xl">
              {character.name[0]}
            </span>
          </div>
        )}
      </div>

      <div className="mt-3 space-y-1.5">
        <h3
          className={`truncate group-hover:text-primary transition-colors ${TYPO.cardTitle}`}
        >
          {character.name}
        </h3>
        <p className={`line-clamp-2 leading-snug ${TYPO.cardSubtitle} text-muted`}>
          {character.greeting}
        </p>
        <div className="flex flex-wrap gap-1.5 pt-0.5">
          {tagKeys.map((key) => (
            <span key={key} className={`${TYPO.cardTag} text-tag`}>
              #{t(key)}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}
