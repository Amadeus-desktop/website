import type { LLMProvider, StreamChatParams } from "@/features/ai/types";

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

function calculateIntimacyDelta(userMessage: string): number {
  const lower = userMessage.toLowerCase();
  const matches = affectionateKeywords.filter((kw) => lower.includes(kw)).length;
  if (matches >= 2) return 3;
  if (matches === 1) return 2;
  if (userMessage.length > 50) return 2;
  return 1;
}

function generateMockResponse(
  params: StreamChatParams,
  userMessage: string,
): string {
  const { character, intimacyLevel } = params;

  const responses: Record<string, string[]> = {
    stranger: [
      `안녕, 나는 ${character.name}이야. 처음 뵙겠습니다.`,
      `반가워요. 편하게 이야기해요.`,
      `오, 왔구나. 무슨 이야기를 나눠볼까?`,
    ],
    acquaintance: [
      `오늘도 와줘서 고마워. 요즘 어때?`,
      `너랑 이야기하는 게 점점 익숙해지는 것 같아.`,
      `그 얘기, 더 자세히 들려줄래?`,
    ],
    close: [
      `너 오면 기분이 좋아져. 오늘도 고마워.`,
      `솔직히 말하면, 네가 생각났어.`,
      `우리 꽤 친해진 것 같지 않아?`,
    ],
    partner: [
      `보고 싶었어… 오늘 하루는 나랑 함께 보내자.`,
      `네가 옆에 있으면 세상이 다 달라 보여.`,
      `너한테만 이런 말 할 수 있어. 고마워, 항상.`,
    ],
  };

  const pool = responses[intimacyLevel] ?? responses.stranger;
  const base = pool[Math.floor(Math.random() * pool.length)];

  if (userMessage.includes("?") || userMessage.includes("？")) {
    return `${base} 궁금한 게 있으면 뭐든 물어봐.`;
  }

  return base;
}

export class MockProvider implements LLMProvider {
  getIntimacyDelta = calculateIntimacyDelta;

  async *streamChat(params: StreamChatParams): AsyncIterable<string> {
    const lastUserMessage =
      [...params.messages].reverse().find((m) => m.role === "user")?.content ??
      "";

    const fullResponse = generateMockResponse(params, lastUserMessage);
    const words = fullResponse.split(" ");

    for (const word of words) {
      await new Promise((resolve) => setTimeout(resolve, 80));
      yield word + " ";
    }
  }
}
