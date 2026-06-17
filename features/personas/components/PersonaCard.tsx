"use client";

import { HiUser } from "@/shared/components/icons";
import { TYPO } from "@/shared/config/layout";
import { getPersonaTagKeys } from "@/features/personas/lib/display";
import type { PersonaCardView } from "@/features/personas/lib/display";
import { useT } from "@/shared/i18n/use-translate";
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

type PersonaCardProps = {
  persona: PersonaCardView;
};

export function PersonaCard({ persona }: PersonaCardProps) {
  const t = useT();
  const tagKeys = getPersonaTagKeys(persona);
  const views = formatViews(persona.id);

  return (
    <Link href={`/characters/${persona.id}`} className="group block min-w-0">
      <div className="relative aspect-[3/4] min-h-[200px] overflow-hidden rounded-xl md:rounded-2xl md:min-h-[260px]">
        <div
          className="flex h-full w-full items-end justify-center pb-10"
          style={{ background: getGradient(persona.name) }}
        >
          <span className="text-6xl font-bold text-white/20 md:text-7xl">
            {persona.name[0]}
          </span>
        </div>
        <div className="absolute left-2.5 top-2.5 flex items-center gap-1 rounded-full bg-black/55 px-2.5 py-1 text-xs text-white backdrop-blur-sm md:text-sm">
          <HiUser className="h-3.5 w-3.5 shrink-0" aria-hidden />
          {views}
        </div>
      </div>

      <div className="mt-3 space-y-1.5">
        <h3
          className={`truncate group-hover:text-primary transition-colors ${TYPO.cardTitle}`}
        >
          {persona.name}
        </h3>
        <p className={`line-clamp-2 leading-snug ${TYPO.cardSubtitle} text-muted`}>
          {persona.tagline}
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
