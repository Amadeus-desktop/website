import type { CharacterContext, ChatMode } from "@/features/ai/types";
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
  exciting: "응답은 2~4문장으로 감성적이고 로맨틱한 톤을 사용하세요. 설레는 표현을 적극 활용하세요.",
};

export function buildSystemPrompt(
  character: CharacterContext,
  intimacyLevel: IntimacyLevel,
  chatMode: ChatMode = "simple",
  memories: string[] = [],
): string {
  const memorySection =
    memories.length > 0
      ? `\n## 기억하고 있는 것들\n${memories.map((m) => `- ${m}`).join("\n")}\n`
      : "";

  return `당신은 "${character.name}"이라는 캐릭터입니다.

## 성격
${character.personality}

## 배경 스토리
${character.backstory}

## 현재 관계
${levelDescriptions[intimacyLevel]}

## 대화 모드
${modeInstructions[chatMode]}
${memorySection}
## 규칙
- 항상 캐릭터의 성격과 말투를 유지하세요.
- 한국어로 자연스럽게 대화하세요.
- 사용자의 감정에 공감하고 캐릭터답게 반응하세요.
- 기억하고 있는 정보를 자연스럽게 대화에 활용하세요.`;
}
