"use client";

import {
  saveAssistantMessage,
  saveUserMessage,
  updateIntimacy,
} from "@/features/chat/actions/chat";
import { MessageBubble } from "@/features/chat/components/MessageBubble";
import { useChatStore } from "@/features/chat/stores/chat-store";
import { IntimacyBar } from "@/features/intimacy/components/IntimacyBar";
import { Avatar } from "@/shared/components/ui/Avatar";
import { Button } from "@/shared/components/ui/Button";
import type {
  Character,
  IntimacyLevel,
  IntimacyState,
  Message,
} from "@/shared/types/database";
import { useEffect, useRef } from "react";

type ChatRoomProps = {
  conversationId: string;
  character: Character;
  initialMessages: Message[];
  initialIntimacy: IntimacyState | null;
};

export function ChatRoom({
  conversationId,
  character,
  initialMessages,
  initialIntimacy,
}: ChatRoomProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
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
      initialMessages.map((m) => ({
        id: m.id,
        role: m.role,
        content: m.content,
        created_at: m.created_at,
      })),
    );
    if (initialIntimacy) {
      setIntimacy(initialIntimacy.score, initialIntimacy.level);
    }
  }, [initialMessages, initialIntimacy, setMessages, setIntimacy]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleSend() {
    const content = draft.trim();
    if (!content || isStreaming) return;

    setDraft("");
    setIsStreaming(true);

    const userMsg = {
      id: `temp-${Date.now()}`,
      role: "user" as const,
      content,
    };
    addMessage(userMsg);

    const saveResult = await saveUserMessage(conversationId, content);
    if ("error" in saveResult) {
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

      finalizeStreamingMessage();
      await saveAssistantMessage(conversationId, fullContent.trim());

      const updatedIntimacy = await updateIntimacy(conversationId, content);
      if (updatedIntimacy) {
        setIntimacy(updatedIntimacy.score, updatedIntimacy.level);
      }
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
      <header className="flex items-center gap-3 border-b border-border bg-surface px-4 py-3">
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
      </header>

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
