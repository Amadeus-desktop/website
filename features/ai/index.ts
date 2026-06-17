import { GeminiProvider } from "@/features/ai/providers/gemini";
import { MockProvider } from "@/features/ai/providers/mock";
import { OpenAIProvider } from "@/features/ai/providers/openai";
import type { LLMProvider } from "@/features/ai/types";

export function getLLMProvider(): LLMProvider {
  const provider = (process.env.LLM_PROVIDER ?? "mock").toLowerCase();

  switch (provider) {
    case "openai":
      return new OpenAIProvider();
    case "gemini":
      return new GeminiProvider();
    case "mock":
    default:
      return new MockProvider();
  }
}

export function getLLMProviderName(): string {
  return (process.env.LLM_PROVIDER ?? "mock").toLowerCase();
}
