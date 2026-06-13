import type { IntimacyLevel } from "@/shared/types/database";

export function getLevelFromScore(score: number): IntimacyLevel {
  if (score >= 81) return "partner";
  if (score >= 51) return "close";
  if (score >= 21) return "acquaintance";
  return "stranger";
}

export function getLevelLabel(level: IntimacyLevel): string {
  const labels: Record<IntimacyLevel, string> = {
    stranger: "낯선 사이",
    acquaintance: "알아가는 사이",
    close: "가까운 사이",
    partner: "연인",
  };
  return labels[level];
}

export function calculateNewIntimacy(
  currentScore: number,
  delta: number,
): { score: number; level: IntimacyLevel } {
  const score = Math.min(100, Math.max(0, currentScore + delta));
  return { score, level: getLevelFromScore(score) };
}

export function estimateIntimacyDelta(userMessage: string): number {
  const affectionateKeywords = [
    "좋아",
    "사랑",
    "고마워",
    "보고싶",
    "그리워",
    "행복",
    "설레",
  ];
  const lower = userMessage.toLowerCase();
  const matches = affectionateKeywords.filter((kw) => lower.includes(kw)).length;
  if (matches >= 2) return 3;
  if (matches === 1) return 2;
  if (userMessage.length > 50) return 2;
  return 1;
}
