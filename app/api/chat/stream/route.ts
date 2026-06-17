import { getLLMProvider } from "@/features/ai";
import { preparePersonaChat } from "@/features/chat/services/persona-chat-pipeline";
import { personaToChatContext } from "@/features/personas/lib/chat-context";
import { createClient } from "@/shared/lib/supabase/server";

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

  if (!conversationId || !content?.trim()) {
    return new Response("Bad Request", { status: 400 });
  }

  const prepared = await preparePersonaChat(user.id, conversationId, content.trim());
  if (!prepared) {
    return new Response("Forbidden", { status: 403 });
  }

  const chatContext = personaToChatContext(prepared.persona);
  const provider = getLLMProvider();

  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();
      try {
        for await (const chunk of provider.streamChat({
          systemPrompt: prepared.systemPrompt,
          messages: prepared.messages,
          character: {
            name: chatContext.name,
            personality: chatContext.personality,
            backstory: chatContext.backstory,
            greeting: chatContext.greeting,
          },
          intimacyLevel: prepared.intimacyLevel,
          chatMode: prepared.chatMode,
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
