import type { LLMProvider, StreamChatParams } from "@/features/ai/types";

function calculateIntimacyDelta(userMessage: string): number {
  const affectionateKeywords = [
    "좋아",
    "사랑",
    "고마워",
    "보고싶",
    "그리워",
    "행복",
    "설레",
    "마음",
    "친해",
    "함께",
  ];
  const lower = userMessage.toLowerCase();
  const matches = affectionateKeywords.filter((kw) => lower.includes(kw)).length;
  if (matches >= 2) return 3;
  if (matches === 1) return 2;
  if (userMessage.length > 50) return 2;
  return 1;
}

function pickFromSystemPrompt(systemPrompt: string, label: string): string | null {
  const match = systemPrompt.match(
    new RegExp(`\\[${label}\\]\\n([\\s\\S]*?)(?=\\n\\[|$)`),
  );
  return match?.[1]?.trim() ?? null;
}

function generateMockResponse(params: StreamChatParams, userMessage: string): string {
  const register =
    pickFromSystemPrompt(params.systemPrompt, "CRITICAL — 말투/성격 — 가장 중요") ??
    params.character.personality;

  const signatureBlock = pickFromSystemPrompt(
    params.systemPrompt,
    "시그니처 표현 (자주 사용)",
  );
  const signature = signatureBlock
    ?.split("\n")
    .find((line) => line.startsWith("- "))
    ?.replace(/^- /, "")
    ?.replace(/^["']|["']$/g, "");

  const opener = signature ?? params.character.greeting;
  const name = params.character.name;

  if (userMessage.includes("?") || userMessage.includes("？")) {
    return `${name} (${register}) ${opener} … 네 질문, 다시 말해줄래?`;
  }

  return `${name}: ${opener}`;
}

export class MockProvider implements LLMProvider {
  getIntimacyDelta = calculateIntimacyDelta;

  async *streamChat(params: StreamChatParams): AsyncIterable<string> {
    const lastUserMessage =
      [...params.messages].reverse().find((message) => message.role === "user")
        ?.content ?? "";

    const fullResponse = generateMockResponse(params, lastUserMessage);
    const words = fullResponse.split(" ");

    for (const word of words) {
      await new Promise((resolve) => setTimeout(resolve, 60));
      yield `${word} `;
    }
  }
}
