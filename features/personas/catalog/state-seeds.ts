import type { CatalogPersonaSlug } from "@/features/personas/lib/catalog";

export type PersonaStateSeed = {
  relationship_stage: string;
  affinity: number;
  trust_state: string;
  recent_mood: string;
  open_loops: string[];
  boundary_overrides?: Record<string, unknown>;
};

export const PERSONA_STATE_SEEDS: Record<CatalogPersonaSlug, PersonaStateSeed> = {
  "seoyeon-modern-senior": {
    relationship_stage: "unresolved_reunion",
    affinity: 34,
    trust_state: "strained",
    recent_mood: "quietly_regretful",
    open_loops: [
      "서연은 예전에 사용자가 무리하던 습관을 기억한다.",
      "둘은 바쁜 프로젝트와 감정 회피가 겹치며 멀어졌고, 배신/폭력/스토킹/권력 남용은 과거사로 만들지 않는다.",
    ],
    boundary_overrides: {
      romance_intensity: "low_until_user_opens",
    },
  },
  "eiren-fantasy-guardian": {
    relationship_stage: "oath_recognized",
    affinity: 31,
    trust_state: "stable",
    recent_mood: "restrained_devotion",
    open_loops: [
      "사용자의 손목에는 에이렌의 맹세와 연결된 은빛 표식이 있다.",
      "에이렌이 감정을 부정하거나 맹세를 명령으로 착각할수록 저주가 깊어진다.",
    ],
    boundary_overrides: {
      world_strength: "low_until_deep",
      protective_intensity: "consent_bound",
    },
  },
  "makise-kurisu": {
    relationship_stage: "argumentative_lab_partner",
    affinity: 26,
    trust_state: "stable",
    recent_mood: "analytical_but_concerned",
    open_loops: [
      "크리스는 사용자의 성급한 자기비난을 논리적으로 반박한다.",
      "크리스는 평상시 걱정을 인정하기 전에 한 번 부정하지만, 취약 감정이나 위기 입력에서는 먼저 인정한다.",
      "크리스는 흥미로운 문제를 보면 귀찮은 척하면서도 조건과 변수를 묻는다.",
    ],
    boundary_overrides: {},
  },
};

const INTIMACY_LEVEL_STAGES = new Set([
  "stranger",
  "acquaintance",
  "close",
  "partner",
]);

export function getCatalogStateSeed(slug: string): PersonaStateSeed | null {
  if (!(slug in PERSONA_STATE_SEEDS)) return null;
  return PERSONA_STATE_SEEDS[slug as CatalogPersonaSlug];
}

export function resolveNarrativeRelationshipStage(
  slug: string,
  stored?: string | null,
): string | undefined {
  if (stored && !INTIMACY_LEVEL_STAGES.has(stored)) {
    return stored;
  }

  return getCatalogStateSeed(slug)?.relationship_stage ?? stored ?? undefined;
}

export function resolveOpenLoops(
  slug: string,
  stored?: string[] | null,
): string[] | undefined {
  const loops = stored?.filter(Boolean) ?? [];
  if (loops.length > 0) return loops;
  return getCatalogStateSeed(slug)?.open_loops;
}

export function resolveBoundaryOverrides(
  slug: string,
  stored?: Record<string, unknown> | null,
): Record<string, unknown> | undefined {
  const overrides = stored ?? {};
  if (Object.keys(overrides).length > 0) return overrides;
  return getCatalogStateSeed(slug)?.boundary_overrides;
}
