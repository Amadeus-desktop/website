import type { Character, IntimacyLevel } from "@/shared/types/database";

export type ChatMode = "simple" | "long" | "exciting";

export type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

export type CharacterContext = Pick<
  Character,
  "name" | "personality" | "backstory" | "greeting"
>;

export type StreamChatParams = {
  systemPrompt: string;
  messages: ChatMessage[];
  character: CharacterContext;
  intimacyLevel: IntimacyLevel;
  chatMode: ChatMode;
  memories?: string[];
};

export type StreamChatResult = {
  content: string;
  intimacyDelta: number;
};

export interface LLMProvider {
  streamChat(params: StreamChatParams): AsyncIterable<string>;
  getIntimacyDelta?(userMessage: string): number;
}
