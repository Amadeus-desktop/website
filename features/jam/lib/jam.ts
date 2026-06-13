export type ChatMode = "simple" | "long" | "exciting";

export const CHAT_MODE_COSTS: Record<ChatMode, number> = {
  simple: 1,
  long: 2,
  exciting: 3,
};

export const CHAT_MODE_LABELS: Record<ChatMode, string> = {
  simple: "심플",
  long: "롱",
  exciting: "설렘",
};

export const CHAT_MODE_DESCRIPTIONS: Record<ChatMode, string> = {
  simple: "짧고 가벼운 대화 (1 Jam)",
  long: "깊고 긴 대화 (2 Jam)",
  exciting: "로맨틱하고 감성적인 대화 (3 Jam)",
};

export const DAILY_JAM_REWARD = 20;
export const DAILY_CLAIM_COOLDOWN_MS = 24 * 60 * 60 * 1000;

export function getJamCost(mode: ChatMode): number {
  return CHAT_MODE_COSTS[mode];
}

export function canClaimDaily(lastClaim: string | null): boolean {
  if (!lastClaim) return true;
  return Date.now() - new Date(lastClaim).getTime() >= DAILY_CLAIM_COOLDOWN_MS;
}
