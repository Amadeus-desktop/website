import { GeminiProvider } from "@/features/ai/providers/gemini";
import { MockProvider } from "@/features/ai/providers/mock";
import { OpenAIProvider } from "@/features/ai/providers/openai";
import type { LLMProvider } from "@/features/ai/types";

function resolveProviderName(): string {
  const configured = process.env.LLM_PROVIDER?.trim().toLowerCase();

  if (configured) {
    return configured;
  }

  if (process.env.GEMINI_API_KEY?.trim()) {
    return "gemini";
  }

  if (process.env.OPENAI_API_KEY?.trim()) {
    return "openai";
  }

  return "mock";
}

export function getLLMProvider(): LLMProvider {
  switch (resolveProviderName()) {
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
  return resolveProviderName();
}
