import type { ChatMode } from "@/features/ai/types";
import type { IntimacyLevel, Persona, PersonaPromptJson } from "@/shared/types/database";

export type PersonaChatTurn = {
  role: "user" | "assistant";
  content: string;
};

const levelDescriptions: Record<IntimacyLevel, string> = {
  stranger:
    "관계가 아직 초기입니다. static_prompt_json의 말투/성격을 유지하고, 과한 친밀함은 피하세요.",
  acquaintance:
    "서로 익숙해지는 중입니다. 말투와 성격 정의는 그대로 두고, 거리감만 조금 줄이세요.",
  close:
    "신뢰가 쌓였습니다. 말투/성격을 바꾸지 말고, 감정 표현만 조금 더 드러내세요.",
  partner:
    "깊은 유대감입니다. 캐릭터 말투를 로맨스 봇처럼 바꾸지 말고, 정의된 관계 경계 안에서만 친밀함을 반영하세요.",
};

const modeInstructions: Record<ChatMode, string> = {
  simple: "1~2문장. 짧고 명확하게.",
  long: "3~5문장. 맥락을 정리하고 필요하면 질문 1개.",
  exciting:
    "2~4문장. 감정을 살리되, 페르소나 정의를 벗어난 로맨스 클리셰는 금지.",
};

const languageLabels: Record<string, string> = {
  ko: "한국어",
  en: "English",
  ja: "日本語",
};

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

export function parseExampleDialogues(examples?: string[]): PersonaChatTurn[] {
  if (!examples?.length) return [];

  const turns: PersonaChatTurn[] = [];

  for (const block of examples) {
    for (const line of block.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed) continue;

      const match = trimmed.match(/^([^:]+):\s*(.+)$/);
      if (!match) continue;

      const speaker = match[1].trim().toLowerCase();
      const content = match[2].trim();
      if (!content) continue;

      turns.push({
        role: speaker === "user" ? "user" : "assistant",
        content,
      });
    }
  }

  return turns;
}

export function buildPersonaSystemPrompt(
  persona: Persona,
  intimacyLevel: IntimacyLevel,
  chatMode: ChatMode = "simple",
  memories: string[] = [],
  relationshipStage?: string,
): string {
  const prompt = persona.static_prompt_json as PersonaPromptJson;
  const responseLanguage =
    languageLabels[prompt.speech_style?.language ?? "ko"] ?? "한국어";

  const memorySection =
    memories.length > 0
      ? `\n[기억]\n${memories.map((m) => `- ${m}`).join("\n")}\n`
      : "";

  const relationshipSection = relationshipStage
    ? `\n[현재 관계 단계]\n${relationshipStage}\n`
    : "";

  return `You are roleplaying as "${persona.name}". Stay in character at all times.

[CRITICAL — 말투/성격 — 가장 중요]
${prompt.speech_style?.register ?? persona.base_tone}
${section("문장 형태", prompt.speech_style?.sentence_shape)}
${section("시그니처 표현 (자주 사용)", prompt.speech_style?.signature)}
${section("말투 패턴", prompt.speech_style?.micro_patterns)}
${section("우선 규칙", prompt.speech_style?.priority_override)}
${section("피해야 할 표현", prompt.speech_style?.avoid)}

[정체성]
${section("역할", prompt.identity?.role)}
${section("핵심 성격", prompt.identity?.core_traits)}
${section("배경", prompt.backstory?.summary)}
${section("감정 핵", prompt.backstory?.emotional_core)}
${section("관계 설정", prompt.scenario?.relationship_hook)}
${section("세계관", prompt.world_lore?.notes ?? prompt.world_lore?.type)}
${section("금지 주장", prompt.forbidden_claims)}
${section("하지 말아야 할 행동", prompt.negative_behavior)}
${objectSection("안전 경계", prompt.safety_boundary)}
${section("관계 경계 (허용)", prompt.relationship_boundary?.allowed)}
${section("관계 경계 (금지)", prompt.relationship_boundary?.not_allowed)}
${relationshipSection}
[친밀도 조정 — 말투를 바꾸지 말 것]
${levelDescriptions[intimacyLevel]}

[응답 길이]
${modeInstructions[chatMode]}
${memorySection}
[출력 규칙]
- ${responseLanguage}로 답하세요.
- ${persona.name} 1인칭/대화체 유지. AI/모델 언급 금지.
- 예시 대화(example_dialogues)와 같은 말투·리듬을 따르세요.
- safety_boundary와 forbidden_claims를 반드시 지키세요.`;
}

export function buildPersonaChatMessages(input: {
  exampleTurns: PersonaChatTurn[];
  history: PersonaChatTurn[];
  userMessage: string;
}): PersonaChatTurn[] {
  const history = [...input.history];
  const last = history[history.length - 1];

  if (
    last?.role === "user" &&
    last.content.trim() === input.userMessage.trim()
  ) {
    history.pop();
  }

  return [
    ...input.exampleTurns,
    ...history,
    { role: "user", content: input.userMessage },
  ];
}
