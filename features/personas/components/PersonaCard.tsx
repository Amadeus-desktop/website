"use client";

import { TYPO } from "@/shared/config/layout";
import { getPersonaTagKeys } from "@/features/personas/lib/display";
import type { PersonaCardView } from "@/features/personas/lib/display";
import { useT } from "@/shared/i18n/use-translate";
import Link from "next/link";
import { useRouter } from "next/navigation";

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

type PersonaCardProps = {
  persona: PersonaCardView;
};

export function PersonaCard({ persona }: PersonaCardProps) {
  const t = useT();
  const router = useRouter();
  const tagKeys = getPersonaTagKeys(persona);
  const href = `/characters/${persona.id}`;

  return (
    <Link
      href={href}
      prefetch
      onMouseEnter={() => router.prefetch(href)}
      onFocus={() => router.prefetch(href)}
      className="interactive-link group block min-w-0"
    >
      <div className="relative aspect-[3/4] min-h-[200px] overflow-hidden rounded-xl md:rounded-2xl md:min-h-[260px]">
        <div
          className="flex h-full w-full items-end justify-center pb-10 transition-transform duration-200 group-hover:scale-[1.02]"
          style={{ background: getGradient(persona.name) }}
        >
          <span className="text-6xl font-bold text-white/20 md:text-7xl">
            {persona.name[0]}
          </span>
        </div>
      </div>

      <div className="mt-3 space-y-1.5">
        <h3
          className={`truncate transition-colors group-hover:text-primary ${TYPO.cardTitle}`}
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
