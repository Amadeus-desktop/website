import { MockProvider } from "@/features/ai/providers/mock";
import type { LLMProvider } from "@/features/ai/types";

export function getLLMProvider(): LLMProvider {
  const provider = process.env.LLM_PROVIDER ?? "mock";

  switch (provider) {
    case "mock":
    default:
      return new MockProvider();
  }
}
