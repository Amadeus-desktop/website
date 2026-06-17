import {
  buildPersonaChatMessages,
  buildPersonaSystemPrompt,
  parseExampleDialogues,
  type PersonaChatTurn,
} from "@/features/ai/prompts/persona-prompt";
import { getConversation, getMessages } from "@/features/chat/actions/chat";
import { resolvePersonaForUser } from "@/features/personas/queries/personas";
import { getLevelFromScore } from "@/features/intimacy/lib/intimacy";
import type { ChatMode, IntimacyLevel, Persona } from "@/shared/types/database";

export type PreparedPersonaChat = {
  persona: Persona;
  systemPrompt: string;
  messages: PersonaChatTurn[];
  intimacyLevel: IntimacyLevel;
  chatMode: ChatMode;
};

export async function preparePersonaChat(
  userId: string,
  conversationId: string,
  userMessage: string,
): Promise<PreparedPersonaChat | null> {
  const conversation = await getConversation(conversationId);
  if (!conversation || conversation.user_id !== userId) {
    return null;
  }

  const persona = await resolvePersonaForUser(userId, conversation.persona_id);
  if (!persona?.static_prompt_json) {
    return null;
  }

  const storedMessages = await getMessages(conversationId);
  const affinity = conversation.persona_states?.affinity ?? 0;
  const intimacyLevel = getLevelFromScore(affinity) as IntimacyLevel;
  const chatMode = (conversation.chat_mode as ChatMode) ?? "simple";
  const relationshipStage = conversation.persona_states?.relationship_stage;

  const systemPrompt = buildPersonaSystemPrompt(
    persona,
    intimacyLevel,
    chatMode,
    [],
    relationshipStage,
  );

  const exampleTurns = parseExampleDialogues(
    persona.static_prompt_json.example_dialogues,
  );

  const history: PersonaChatTurn[] = storedMessages
    .filter((message) => message.role === "user" || message.role === "assistant")
    .map((message) => ({
      role: message.role as "user" | "assistant",
      content: message.content,
    }));

  const messages = buildPersonaChatMessages({
    exampleTurns,
    history,
    userMessage,
  });

  return {
    persona,
    systemPrompt,
    messages,
    intimacyLevel,
    chatMode,
  };
}
