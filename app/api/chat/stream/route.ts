import { getLLMProvider } from "@/features/ai";
import { buildSystemPrompt } from "@/features/ai/prompts/system-prompt";
import { getConversation, getMessages } from "@/features/chat/actions/chat";
import { getMemories } from "@/features/memory/actions/memory";
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

  const [messages, memories] = await Promise.all([
    getMessages(conversationId),
    getMemories(conversationId),
  ]);

  const intimacyLevel =
    (conversation.intimacy_states?.level as IntimacyLevel) ?? "stranger";
  const chatMode = (conversation.chat_mode as ChatMode) ?? "simple";
  const memoryContents = memories.map((m) => m.content);

  const character = conversation.characters;
  const systemPrompt = buildSystemPrompt(
    character,
    intimacyLevel,
    chatMode,
    memoryContents,
  );
  const provider = getLLMProvider();

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
            name: character.name,
            personality: character.personality,
            backstory: character.backstory,
            greeting: character.greeting,
          },
          intimacyLevel,
          chatMode,
          memories: memoryContents,
        })) {
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ content: chunk })}\n\n`),
          );
        }
        controller.enqueue(encoder.encode("data: [DONE]\n\n"));
      } catch {
        controller.enqueue(
          encoder.encode(
            `data: ${JSON.stringify({ content: "오류가 발생했습니다." })}\n\n`,
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
