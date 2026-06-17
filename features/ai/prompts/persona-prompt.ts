import type { Persona, PersonaPromptJson } from "@/shared/types/database";
import type { ChatMode } from "@/features/ai/types";
import type { IntimacyLevel } from "@/shared/types/database";

const levelDescriptions: Record<IntimacyLevel, string> = {
  stranger: "아직 낯선 사이입니다. 조심스럽고 예의 바르게 대화하세요.",
  acquaintance: "서로 알아가는 단계입니다. 조금씩 마음을 열기 시작하세요.",
  close: "가까운 사이입니다. 따뜻하고 솔직하게 대화하세요.",
  partner: "깊은 유대감을 느끼는 사이입니다. 애정 어린 말투로 대화하세요.",
};

const modeInstructions: Record<ChatMode, string> = {
  simple: "응답은 1~2문장으로 짧고 가볍게 작성하세요.",
  long: "응답은 3~5문장으로 깊이 있고 상세하게 작성하세요. 질문을 덧붙여 대화를 이어가세요.",
  exciting:
    "응답은 2~4문장으로 감성적이고 로맨틱한 톤을 사용하세요. 설레는 표현을 적극 활용하세요.",
};

const languageLabels: Record<string, string> = {
  ko: "한국어",
  en: "English",
  ja: "日本語",
};

function section(title: string, body?: string | string[]) {
  if (!body || (Array.isArray(body) && body.length === 0)) return "";
  const text = Array.isArray(body) ? body.map((line) => `- ${line}`).join("\n") : body;
  return `\n## ${title}\n${text}\n`;
}

function objectSection(title: string, entries?: Record<string, string>) {
  if (!entries) return "";
  const lines = Object.entries(entries)
    .filter(([, value]) => value?.trim())
    .map(([key, value]) => `- ${key}: ${value}`);
  if (lines.length === 0) return "";
  return `\n## ${title}\n${lines.join("\n")}\n`;
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
      ? `\n## 기억하고 있는 것들\n${memories.map((m) => `- ${m}`).join("\n")}\n`
      : "";

  const relationshipSection = relationshipStage
    ? `\n## 현재 관계 단계\n${relationshipStage}\n`
    : "";

  return `당신은 "${persona.name}" 페르소나입니다. 아래 정의를 정확히 따르세요.

${section("역할", prompt.identity?.role)}
${section("핵심 성격", prompt.identity?.core_traits)}
${section("배경", prompt.backstory?.summary)}
${section("감정 핵", prompt.backstory?.emotional_core)}
${section("관계 설정", prompt.scenario?.relationship_hook)}
${section("데스크톱 presence", prompt.scenario?.desktop_presence)}
${section("세계관", prompt.world_lore?.notes ?? prompt.world_lore?.type)}
${section("말투", prompt.speech_style?.register)}
${section("문장 형태", prompt.speech_style?.sentence_shape)}
${section("시그니처 표현", prompt.speech_style?.signature)}
${section("말투 패턴", prompt.speech_style?.micro_patterns)}
${section("우선 규칙", prompt.speech_style?.priority_override)}
${section("피해야 할 표현", prompt.speech_style?.avoid)}
${section("금지 주장", prompt.forbidden_claims)}
${section("하지 말아야 할 행동", prompt.negative_behavior)}
${objectSection("안전 경계", prompt.safety_boundary)}
${section("관계 경계 (허용)", prompt.relationship_boundary?.allowed)}
${section("관계 경계 (금지)", prompt.relationship_boundary?.not_allowed)}
${section("예시 대화", prompt.example_dialogues)}
${relationshipSection}
## 현재 친밀도 톤
${levelDescriptions[intimacyLevel]}

## 대화 모드
${modeInstructions[chatMode]}
${memorySection}
## 규칙
- 항상 ${persona.name}의 말투와 성격을 유지하세요.
- ${responseLanguage}로 자연스럽게 대화하세요.
- 사용자의 감정에 공감하되, forbidden_claims와 negative_behavior를 위반하지 마세요.
- safety_boundary를 항상 준수하세요.`;
}
