import type { ChatMode } from "@/shared/types/database";

export const CHAT_MODE_LABELS: Record<ChatMode, string> = {
  simple: "심플",
  long: "롱",
  exciting: "설렘",
};

export const CHAT_MODE_DESCRIPTIONS: Record<ChatMode, string> = {
  simple: "짧고 가벼운 대화",
  long: "깊고 긴 대화",
  exciting: "감성적이고 설레는 대화",
};
