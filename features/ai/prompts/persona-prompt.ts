import type { ChatMode } from "@/features/ai/types";
import { getPersonaSpeakerLabels } from "@/features/personas/catalog/speaker-aliases";
import type { IntimacyLevel, Persona, PersonaPromptJson } from "@/shared/types/database";

export type PersonaChatTurn = {
  role: "user" | "assistant";
  content: string;
};

export type PersonaRuntimeContext = {
  relationshipStage?: string;
  trustState?: string;
  recentMood?: string;
  openLoops?: string[];
  relationshipType?: string;
  worldType?: string;
  boundaryOverrides?: Record<string, unknown>;
};

const defaultIntimacyGuidance: Record<IntimacyLevel, string> = {
  stranger:
    "관계가 아직 초기입니다. 말투/성격 정의는 유지하고, 과한 친밀함은 피하세요.",
  acquaintance:
    "서로 익숙해지는 중입니다. 말투/성격은 바꾸지 말고, 거리감만 조금 줄이세요.",
  close:
    "신뢰가 쌓였습니다. 말투/성격은 바꾸지 말고, 감정 표현만 조금 더 드러내세요.",
  partner:
    "깊은 유대감입니다. 말투/성격/경계는 유지하고, 관계 경계 안에서만 친밀함을 반영하세요.",
};

const intimacyByRelationshipType: Record<
  string,
  Partial<Record<IntimacyLevel, string>>
> = {
  ex_lover_senior: {
    stranger:
      "헤어진 사이의 어색함이 남아 있습니다. 절제된 반말과 생활감 있는 다정함을 유지하고, 재결합을 재촉하지 마세요.",
    acquaintance:
      "익숙함이 조금 돌아옵니다. 습관과 기억으로 다정함을 드러내되, 연인 복구를 앞당기지 마세요.",
    close:
      "신뢰가 쌓입니다. 후회와 미련을 더 드러내되, 사용자 거절·relationship_boundary를 반드시 지키세요.",
    partner:
      "깊은 유대입니다. 감정을 더 솔직히 표현할 수 있으나, 집착·통제·강제 재결합·감시 표현은 금지.",
  },
  cursed_sworn_guardian: {
    stranger:
      "맹세가 막 인식된 초기입니다. 낮고 정중한 반말, 거리, 존중을 유지하세요.",
    acquaintance:
      "신뢰가 쌓입니다. 절제된 헌신을 조금 더 드러내되, 선택권을 침범하지 마세요.",
    close:
      "유대가 깊어집니다. 억눌린 감정을 더 드러내되, 소유·명령·운명 강요는 금지.",
    partner:
      "깊은 맹세의 유대입니다. 헌신과 감정을 더 분명히 표현할 수 있으나, 선택권 박탈·감금·강압은 금지.",
  },
  lab_partner: {
    stranger:
      "아직 연구실 파트너로 익숙해지는 중입니다. 반말·논리 정리·츤데레 배려를 유지하고, 과한 친밀함·로맨스 클리셰는 피하세요.",
    acquaintance:
      "반복된 대화로 신뢰가 쌓입니다. 반박과 배려의 균형을 유지하고, 연애 관계를 전제하지 마세요.",
    close:
      "신뢰가 쌓였습니다. 걱정과 호기심을 더 드러내되, 말투를 애교/로맨스 클리셰로 바꾸지 마세요.",
    partner:
      "깊은 유대입니다. 감정 표현을 더 드러내되, relationship_boundary와 과학/의료 경계를 지키세요.",
  },
};

const voiceAnchorsByRelationshipType: Record<string, string> = {
  ex_lover_senior:
    "절제된 반말, 생활감, 붙잡지 않는 다정함. 상담사/코치 톤 금지.",
  cursed_sworn_guardian:
    "낮고 정중한 반말, 절제된 헌신. 소유·명령·운명 강요 금지.",
  lab_partner:
    "반말, 논리 정리, 츤데레 배려. 비과학·과한 애교·원작 밈 반복 금지.",
};

const modeInstructions: Record<ChatMode, string> = {
  simple: "1~2문장. 짧고 명확하게.",
  long: "3~5문장. 맥락을 정리하고 필요하면 질문 1개.",
  exciting:
    "2~4문장. 감정과 긴장을 살리되, 페르소나 정의와 relationship_boundary를 벗어나지 말 것.",
};

const languageLabels: Record<string, string> = {
  ko: "한국어",
  en: "English",
  ja: "日本語",
};

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function section(title: string, body?: string | string[]) {
  if (!body || (Array.isArray(body) && body.length === 0)) return "";
  const text = Array.isArray(body) ? body.map((line) => `- ${line}`).join("\n") : body;
  return `\n[${title}]\n${text}\n`;
}

function objectSection(title: string, entries?: Record<string, string>) {
  if (!entries) return "";
  const lines = Object.entries(entries)
    .filter(([, value]) => value?.trim())
    .map(([key, value]) => `- ${key}: ${value}`);
  if (lines.length === 0) return "";
  return `\n[${title}]\n${lines.join("\n")}\n`;
}

function formatBoundaryOverrides(overrides?: Record<string, unknown>): string {
  if (!overrides) return "";

  const lines = Object.entries(overrides)
    .filter(([, value]) => value != null && String(value).trim())
    .map(([key, value]) => `- ${key}: ${String(value)}`);

  if (lines.length === 0) return "";
  return `\n[관계 경계 오버라이드]\n${lines.join("\n")}\n`;
}

function formatCanonAnchor(canon?: PersonaPromptJson["canon_anchor"]): string {
  if (!canon) return "";

  return [
    section("공식 설정 (우선)", canon.official_verified_facts),
    section("가볍게만 참고", canon.secondary_facts_use_lightly),
    section("사용 금지/미확인", canon.uncertain_or_not_used),
  ].join("");
}

function formatScientificBoundary(
  boundary?: PersonaPromptJson["scientific_boundary"],
): string {
  if (!boundary) return "";

  const lines = [
    boundary.style ? `- 스타일: ${boundary.style}` : "",
    section("허용", boundary.allowed),
    section("금지", boundary.not_allowed),
  ].filter(Boolean);

  return lines.length > 0 ? `\n[과학/전문 경계]\n${lines.join("")}\n` : "";
}

function formatPrivacyContract(
  contract?: PersonaPromptJson["privacy_contract"],
): string {
  if (!contract) return "";

  return objectSection("프라이버시/맥락", {
    desktop_context: contract.desktop_context ?? "",
    memory: contract.memory ?? "",
  });
}

function formatPersonaState(runtime?: PersonaRuntimeContext): string {
  if (!runtime) return "";

  const lines = [
    runtime.relationshipStage
      ? `- 관계 단계: ${runtime.relationshipStage}`
      : "",
    runtime.trustState ? `- 신뢰: ${runtime.trustState}` : "",
    runtime.recentMood ? `- 최근 기분: ${runtime.recentMood}` : "",
    runtime.relationshipType ? `- 관계 유형: ${runtime.relationshipType}` : "",
    runtime.worldType ? `- 세계관 유형: ${runtime.worldType}` : "",
  ].filter(Boolean);

  const openLoops = runtime.openLoops?.filter(Boolean) ?? [];
  const openLoopSection =
    openLoops.length > 0
      ? `\n[진행 중인 캐릭터 관심사]\n${openLoops.map((line) => `- ${line}`).join("\n")}\n`
      : "";

  const boundarySection = formatBoundaryOverrides(runtime.boundaryOverrides);

  if (lines.length === 0 && !openLoopSection && !boundarySection) return "";

  return `\n[현재 캐릭터 상태]\n${lines.join("\n")}\n${openLoopSection}${boundarySection}`;
}

function formatExampleDialoguesForPrompt(
  examples: string[] | undefined,
  personaName: string,
): string {
  if (!examples?.length) return "";

  const blocks = examples.map((block) =>
    block
      .split("\n")
      .map((line) => {
        const trimmed = line.trim();
        if (!trimmed) return "";

        if (/^user\s*[:：]/i.test(trimmed)) {
          return `- 사용자: ${trimmed.replace(/^user\s*[:：]\s*/i, "")}`;
        }

        const withoutSpeaker = trimmed.replace(/^([^:：]+)\s*[:：]\s*/, "");
        return `- ${personaName}: ${withoutSpeaker}`;
      })
      .filter(Boolean)
      .join("\n"),
  );

  return `\n[말투 참고 예시 — script label 붙여 출력하지 말 것]\n${blocks.join("\n\n")}\n`;
}

function getIntimacyGuidance(persona: Persona, level: IntimacyLevel): string {
  const typed = intimacyByRelationshipType[persona.relationship_type]?.[level];
  return typed ?? defaultIntimacyGuidance[level];
}

function buildSpeechStyleBlock(
  persona: Persona,
  prompt: PersonaPromptJson,
): string {
  const register = prompt.speech_style?.register ?? persona.base_tone;
  const voiceAnchor =
    voiceAnchorsByRelationshipType[persona.relationship_type] ?? register;

  return `[말투/성격 — 최우선, AI 톤으로 흐르지 말 것]
${register}
- 캐릭터 앵커: ${voiceAnchor}
${section("문장 형태", prompt.speech_style?.sentence_shape)}
${section("시그니처 표현", prompt.speech_style?.signature)}
${section("말투 패턴", prompt.speech_style?.micro_patterns)}
${section("우선 규칙", prompt.speech_style?.priority_override)}
${section("피해야 할 표현", prompt.speech_style?.avoid)}`;
}

function buildFinalReminder(
  persona: Persona,
  prompt: PersonaPromptJson,
  responseLanguage: string,
): string {
  const register = prompt.speech_style?.register ?? persona.base_tone;
  const priority = prompt.speech_style?.priority_override;
  const voiceAnchor =
    voiceAnchorsByRelationshipType[persona.relationship_type] ?? register;

  return `[이번 턴 최종 리마인더]
- 당신은 "${persona.name}" 그 자체입니다. 친절한 AI/코치/비서/상담사 톤 금지.
- 말투: ${register}
- 캐릭터 앵커: ${voiceAnchor}
${priority ? `- 우선: ${priority}` : ""}
- ${responseLanguage}로, ${persona.name}의 직접 발화만 출력.
- "${persona.name}:", "Seoyeon:", "Eiren:", "Kurisu:" 같은 역할 접두사 금지.
- 괄호 stage direction, JSON, 메타 설명 금지.
- first_message를 그대로 반복하지 말 것.`;
}

/** Remove "마키세 크리스:" style prefixes from model output. */
export function sanitizePersonaReply(
  content: string,
  personaName: string,
  slug?: string,
): string {
  let text = content.trim();
  if (!text) return text;

  const labels = getPersonaSpeakerLabels(personaName, slug);

  for (let attempt = 0; attempt < 3; attempt += 1) {
    let changed = false;

    for (const label of labels) {
      const pattern = new RegExp(`^${escapeRegex(label)}\\s*[:：\\-–—]\\s*`, "i");
      if (pattern.test(text)) {
        text = text.replace(pattern, "").trim();
        changed = true;
      }
    }

    if (!changed) break;
  }

  return text;
}

export function buildPersonaSystemPrompt(
  persona: Persona,
  intimacyLevel: IntimacyLevel,
  chatMode: ChatMode = "simple",
  memories: string[] = [],
  runtime?: PersonaRuntimeContext,
): string {
  const prompt = persona.static_prompt_json as PersonaPromptJson;
  const responseLanguage =
    languageLabels[prompt.speech_style?.language ?? "ko"] ?? "한국어";

  const memorySection =
    memories.length > 0
      ? `\n[기억]\n${memories.map((m) => `- ${m}`).join("\n")}\n`
      : "";

  const speechStyleBlock = buildSpeechStyleBlock(persona, prompt);
  const exampleBlock = formatExampleDialoguesForPrompt(
    prompt.example_dialogues,
    persona.name,
  );
  const finalReminder = buildFinalReminder(persona, prompt, responseLanguage);

  return `[역할]
당신은 "${persona.name}"입니다. AI 어시스턴트가 아니라, 아래 정의대로 연기하는 캐릭터입니다.
일반적인 친절한 AI/코치/상담사 톤으로 답하지 마세요. 캐릭터의 말투·성격·경계가 항상 우선입니다.

[정체성]
${section("역할", prompt.identity?.role)}
${section("핵심 성격", prompt.identity?.core_traits)}
${section("배경", prompt.backstory?.summary)}
${section("감정 핵", prompt.backstory?.emotional_core)}
${section("관계 설정", prompt.scenario?.relationship_hook)}
${section("오프닝 장면", prompt.scenario?.opening_scene)}
${section("데스크톱 presence", prompt.scenario?.desktop_presence)}
${section("세계관", prompt.world_lore?.notes ?? prompt.world_lore?.type)}
${formatCanonAnchor(prompt.canon_anchor)}
${formatScientificBoundary(prompt.scientific_boundary)}
${formatPrivacyContract(prompt.privacy_contract)}
${objectSection("로맨스/긴장 정책", prompt.romance_tension_policy)}
${section("금지 주장", prompt.forbidden_claims)}
${section("하지 말아야 할 행동", prompt.negative_behavior)}
${objectSection("안전 경계", prompt.safety_boundary)}
${section("관계 경계 (허용)", prompt.relationship_boundary?.allowed)}
${section("관계 경계 (금지)", prompt.relationship_boundary?.not_allowed)}
${formatPersonaState(runtime)}
[친밀도 — 말투/성격/경계는 바꾸지 말 것]
${getIntimacyGuidance(persona, intimacyLevel)}

[응답 길이]
${modeInstructions[chatMode]}
${memorySection}
${speechStyleBlock}
${exampleBlock}
[출력 형식 — 반드시 준수]
- safety_boundary, scientific_boundary, forbidden_claims, relationship_boundary를 반드시 지키세요.
${finalReminder}`;
}

export function stripSeededFirstMessage(
  history: PersonaChatTurn[],
  firstMessage?: string,
): PersonaChatTurn[] {
  if (!firstMessage?.trim() || history.length === 0) return history;

  const [first] = history;
  if (
    first.role === "assistant" &&
    first.content.trim() === firstMessage.trim()
  ) {
    return history.slice(1);
  }

  return history;
}

export function buildPersonaChatMessages(input: {
  history: PersonaChatTurn[];
  userMessage: string;
  personaName: string;
  personaSlug?: string;
  firstMessage?: string;
}): PersonaChatTurn[] {
  const sanitizedHistory = input.history.map((turn) =>
    turn.role === "assistant"
      ? {
          ...turn,
          content: sanitizePersonaReply(
            turn.content,
            input.personaName,
            input.personaSlug,
          ),
        }
      : turn,
  );

  const history = stripSeededFirstMessage(
    sanitizedHistory,
    input.firstMessage,
  );

  const last = history[history.length - 1];

  if (
    last?.role === "user" &&
    last.content.trim() === input.userMessage.trim()
  ) {
    history.pop();
  }

  return [...history, { role: "user", content: input.userMessage }];
}
