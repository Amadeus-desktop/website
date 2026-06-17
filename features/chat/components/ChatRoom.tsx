"use client";

import { sanitizePersonaReply } from "@/features/ai/prompts/persona-prompt";
import {
  saveAssistantMessage,
  saveUserMessage,
  updateChatMode,
  updateIntimacy,
} from "@/features/chat/actions/chat";
import { ChatModeSelector } from "@/features/chat/components/ChatModeSelector";
import { MessageBubble } from "@/features/chat/components/MessageBubble";
import { useChatStore } from "@/features/chat/stores/chat-store";
import { IntimacyBar } from "@/features/intimacy/components/IntimacyBar";
import { Avatar } from "@/shared/components/ui/Avatar";
import { Button } from "@/shared/components/ui/Button";
import type { PersonaChatContext } from "@/features/personas/lib/chat-context";
import type {
  CharacterMemory,
  ChatMode,
  CloudMessage,
  IntimacyLevel,
  IntimacyState,
} from "@/shared/types/database";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

type ChatRoomProps = {
  conversationId: string;
  character: PersonaChatContext;
  initialMessages: CloudMessage[];
  initialIntimacy: IntimacyState | null;
  initialChatMode: ChatMode;
  initialMemories: CharacterMemory[];
};

export function ChatRoom({
  conversationId,
  character,
  initialMessages,
  initialIntimacy,
  initialChatMode,
  initialMemories,
}: ChatRoomProps) {
  const router = useRouter();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [chatMode, setChatMode] = useState<ChatMode>(initialChatMode);
  const [memories, setMemories] = useState(initialMemories);
  const [error, setError] = useState<string | null>(null);

  const {
    messages,
    draft,
    isStreaming,
    intimacyScore,
    intimacyLevel,
    setMessages,
    addMessage,
    updateStreamingMessage,
    finalizeStreamingMessage,
    setDraft,
    setIsStreaming,
    setIntimacy,
  } = useChatStore();

  useEffect(() => {
    setMessages(
      initialMessages
        .filter((m) => m.role === "user" || m.role === "assistant")
        .map((m) => ({
          id: m.id,
          role: m.role as "user" | "assistant",
          content:
            m.role === "assistant"
              ? sanitizePersonaReply(m.content, character.name, character.slug)
              : m.content,
          created_at: m.created_at,
        })),
    );
    if (initialIntimacy) {
      setIntimacy(initialIntimacy.score, initialIntimacy.level);
    }
    setChatMode(initialChatMode);
    setMemories(initialMemories);
  }, [
    initialMessages,
    initialIntimacy,
    initialChatMode,
    initialMemories,
    character.name,
    character.slug,
    setMessages,
    setIntimacy,
  ]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleModeChange(mode: ChatMode) {
    const result = await updateChatMode(conversationId, mode);
    if ("error" in result) {
      setError(result.error);
    } else {
      setChatMode(mode);
      setError(null);
    }
  }

  async function handleSend() {
    const content = draft.trim();
    if (!content || isStreaming) return;

    setError(null);
    setDraft("");
    setIsStreaming(true);

    const userIdempotencyKey = `web:user:${conversationId}:${crypto.randomUUID()}`;
    const assistantIdempotencyKey = `web:assistant:${conversationId}:${userIdempotencyKey}`;

    addMessage({
      id: `temp-${Date.now()}`,
      role: "user",
      content,
    });

    const saveResult = await saveUserMessage(
      conversationId,
      content,
      userIdempotencyKey,
    );
    if ("error" in saveResult) {
      setError(saveResult.error);
      setIsStreaming(false);
      return;
    }

    addMessage({
      id: `stream-${Date.now()}`,
      role: "assistant",
      content: "",
      isStreaming: true,
    });

    try {
      const response = await fetch("/api/chat/stream", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ conversationId, content }),
      });

      if (!response.ok || !response.body) {
        throw new Error("스트리밍 응답 실패");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let fullContent = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6);
            if (data === "[DONE]") continue;
            try {
              const parsed = JSON.parse(data);
              if (parsed.content) {
                fullContent += parsed.content;
                updateStreamingMessage(fullContent);
              }
            } catch {
              // skip malformed chunks
            }
          }
        }
      }

      const reply = sanitizePersonaReply(
        fullContent.trim(),
        character.name,
        character.slug,
      );
      updateStreamingMessage(reply);
      finalizeStreamingMessage();
      await saveAssistantMessage(
        conversationId,
        reply,
        assistantIdempotencyKey,
      );

      const updatedIntimacy = await updateIntimacy(conversationId, content);
      if (updatedIntimacy) {
        setIntimacy(updatedIntimacy.score, updatedIntimacy.level);
      }

      router.refresh();
    } catch {
      updateStreamingMessage("응답을 받지 못했어요. 다시 시도해주세요.");
      finalizeStreamingMessage();
    } finally {
      setIsStreaming(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  return (
    <div className="flex h-full flex-col">
      <header className="flex flex-col gap-2 border-b border-border bg-surface px-4 py-3">
        <div className="flex items-center gap-3">
          <Avatar src={character.avatar_url} name={character.name} size="md" />
          <div className="flex-1 min-w-0">
            <h2 className="font-semibold text-foreground truncate">
              {character.name}
            </h2>
            <IntimacyBar
              score={intimacyScore}
              level={intimacyLevel as IntimacyLevel}
              compact
            />
          </div>
        </div>
        <ChatModeSelector
          mode={chatMode}
          onChange={handleModeChange}
          disabled={isStreaming}
        />
      </header>

      {memories.length > 0 && (
        <div className="border-b border-border bg-primary-soft/30 px-4 py-2">
          <p className="text-xs font-medium text-primary mb-1">캐릭터 기억</p>
          <div className="flex flex-wrap gap-1">
            {memories.slice(-5).map((m) => (
              <span
                key={m.id}
                className="rounded-full bg-white/80 px-2 py-0.5 text-xs text-muted"
              >
                {m.content}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {messages.map((msg) => (
          <MessageBubble
            key={msg.id}
            role={msg.role}
            content={msg.content}
            isStreaming={msg.isStreaming}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="border-t border-border bg-surface p-4">
        {error && (
          <p className="mb-2 text-xs text-red-500">{error}</p>
        )}
        <div className="flex gap-2">
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="메시지를 입력하세요..."
            disabled={isStreaming}
            rows={1}
            className="flex-1 resize-none rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:opacity-50"
          />
          <Button
            onClick={handleSend}
            disabled={!draft.trim() || isStreaming}
            className="shrink-0"
          >
            {isStreaming ? "..." : "전송"}
          </Button>
        </div>
      </div>
    </div>
  );
}
