import {
  buildPersonaChatMessages,
  buildPersonaSystemPrompt,
  sanitizePersonaReply,
  type PersonaChatTurn,
} from "@/features/ai/prompts/persona-prompt";
import { getConversation, getMessages } from "@/features/chat/actions/chat";
import {
  getCatalogStateSeed,
  resolveBoundaryOverrides,
  resolveNarrativeRelationshipStage,
  resolveOpenLoops,
} from "@/features/personas/catalog/state-seeds";
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
  const personaState = conversation.persona_states;
  const stateSeed = getCatalogStateSeed(persona.slug);

  const systemPrompt = buildPersonaSystemPrompt(
    persona,
    intimacyLevel,
    chatMode,
    [],
    {
      relationshipStage: resolveNarrativeRelationshipStage(
        persona.slug,
        personaState?.relationship_stage,
      ),
      trustState:
        personaState?.trust_state === "neutral" && stateSeed
          ? stateSeed.trust_state
          : (personaState?.trust_state ?? stateSeed?.trust_state),
      recentMood:
        personaState?.recent_mood ??
        stateSeed?.recent_mood ??
        persona.base_tone,
      openLoops: resolveOpenLoops(persona.slug, personaState?.open_loops),
      relationshipType: persona.relationship_type,
      worldType: persona.world_type,
      boundaryOverrides: resolveBoundaryOverrides(
        persona.slug,
        personaState?.boundary_overrides,
      ),
    },
  );

  const history: PersonaChatTurn[] = storedMessages
    .filter((message) => message.role === "user" || message.role === "assistant")
    .map((message) => ({
      role: message.role as "user" | "assistant",
      content:
        message.role === "assistant"
          ? sanitizePersonaReply(message.content, persona.name, persona.slug)
          : message.content,
    }));

  const messages = buildPersonaChatMessages({
    history,
    userMessage,
    personaName: persona.name,
    personaSlug: persona.slug,
    firstMessage: persona.static_prompt_json.first_message,
  });

  return {
    persona,
    systemPrompt,
    messages,
    intimacyLevel,
    chatMode,
  };
}

export { sanitizePersonaReply };
