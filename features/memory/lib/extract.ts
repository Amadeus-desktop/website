const MEMORY_PATTERNS: { pattern: RegExp; template: (match: string) => string }[] = [
  {
    pattern: /내\s*이름은\s*(.+?)[이다\.!?\s]*$/i,
    template: (m) => `사용자 이름은 ${m.trim()}`,
  },
  {
    pattern: /나는\s*(.+?)\s*(좋아해|좋아한다|좋아함)/i,
    template: (m) => `사용자는 ${m.trim()}을(를) 좋아함`,
  },
  {
    pattern: /나는\s*(.+?)\s*(싫어해|싫어한다|싫어함)/i,
    template: (m) => `사용자는 ${m.trim()}을(를) 싫어함`,
  },
  {
    pattern: /내\s*생일은\s*(.+?)[이다\.!?\s]*$/i,
    template: (m) => `사용자 생일은 ${m.trim()}`,
  },
  {
    pattern: /나는\s*(.+?)(이야|이다|입니다|예요)[\.!?\s]*$/i,
    template: (m) => `사용자는 ${m.trim()}`,
  },
  {
    pattern: /(.+?)에서\s*(일해|공부해|살아)/i,
    template: (m) => `사용자는 ${m.trim()}에 관련됨`,
  },
];

const MAX_MEMORIES = 20;

export function extractMemories(userMessage: string): string[] {
  const memories: string[] = [];

  for (const { pattern, template } of MEMORY_PATTERNS) {
    const match = userMessage.match(pattern);
    if (match?.[1]) {
      const memory = template(match[1]);
      if (!memories.includes(memory)) {
        memories.push(memory);
      }
    }
  }

  if (userMessage.length > 80 && memories.length === 0) {
    const snippet = userMessage.slice(0, 60).trim();
    memories.push(`사용자가 말함: "${snippet}..."`);
  }

  return memories;
}

export function formatMemoriesForPrompt(memories: string[]): string {
  if (memories.length === 0) return "";
  return memories.map((m) => `- ${m}`).join("\n");
}

export { MAX_MEMORIES };
