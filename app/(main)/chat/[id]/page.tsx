import { ChatRoom } from "@/features/chat/components/ChatRoom";
import { ConversationList } from "@/features/chat/components/ConversationList";
import {
  getConversation,
  getConversations,
  getMessages,
} from "@/features/chat/actions/chat";
import { getJamBalance } from "@/features/jam/actions/jam";
import { getMemories } from "@/features/memory/actions/memory";
import type { ChatMode } from "@/shared/types/database";
import { notFound } from "next/navigation";

type ChatPageProps = {
  params: Promise<{ id: string }>;
};

export default async function ChatPage({ params }: ChatPageProps) {
  const { id } = await params;
  const [conversation, messages, conversations, memories, jamBalance] =
    await Promise.all([
      getConversation(id),
      getMessages(id),
      getConversations(),
      getMemories(id),
      getJamBalance(),
    ]);

  if (!conversation) {
    notFound();
  }

  return (
    <div className="flex h-[calc(100vh-8rem)] lg:h-[calc(100vh-4rem)] gap-0 lg:gap-4">
      <aside className="hidden w-72 shrink-0 flex-col rounded-card border border-border bg-surface lg:flex">
        <div className="border-b border-border px-4 py-3">
          <h2 className="font-semibold text-foreground">대화 목록</h2>
        </div>
        <div className="flex-1 overflow-y-auto p-2">
          <ConversationList conversations={conversations} activeId={id} />
        </div>
      </aside>

      <div className="flex flex-1 flex-col overflow-hidden rounded-card border border-border bg-surface">
        <ChatRoom
          conversationId={id}
          character={conversation.characters}
          initialMessages={messages}
          initialIntimacy={conversation.intimacy_states}
          initialChatMode={(conversation.chat_mode as ChatMode) ?? "simple"}
          initialMemories={memories}
          initialJamBalance={jamBalance?.balance ?? 0}
        />
      </div>
    </div>
  );
}
