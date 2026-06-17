import { getLLMProvider } from "@/features/ai";
import { buildPersonaSystemPrompt } from "@/features/ai/prompts/persona-prompt";
import { getConversation, getMessages } from "@/features/chat/actions/chat";
import { personaToChatContext } from "@/features/personas/lib/chat-context";
import { getLevelFromScore } from "@/features/intimacy/lib/intimacy";
import { createClient } from "@/shared/lib/supabase/server";
import type { ChatMode, IntimacyLevel } from "@/shared/types/database";

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return new Response("Unauthorized", { status: 401 });
  }

  const body = await request.json();
  const { conversationId, content } = body as {
    conversationId: string;
    content: string;
  };

  if (!conversationId || !content) {
    return new Response("Bad Request", { status: 400 });
  }

  const conversation = await getConversation(conversationId);
  if (!conversation || conversation.user_id !== user.id) {
    return new Response("Forbidden", { status: 403 });
  }

  const messages = await getMessages(conversationId);
  const persona = conversation.personas;
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
  const provider = getLLMProvider();
  const chatContext = personaToChatContext(persona);

  const chatMessages = [
    ...messages.map((m) => ({
      role: m.role as "user" | "assistant",
      content: m.content,
    })),
    { role: "user" as const, content },
  ];

  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();
      try {
        for await (const chunk of provider.streamChat({
          systemPrompt,
          messages: chatMessages,
          character: {
            name: chatContext.name,
            personality: chatContext.personality,
            backstory: chatContext.backstory,
            greeting: chatContext.greeting,
          },
          intimacyLevel,
          chatMode,
          memories: [],
        })) {
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ content: chunk })}\n\n`),
          );
        }
        controller.enqueue(encoder.encode("data: [DONE]\n\n"));
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "오류가 발생했습니다.";
        controller.enqueue(
          encoder.encode(
            `data: ${JSON.stringify({ content: message })}\n\n`,
          ),
        );
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
