"use client";

import { startConversation } from "@/features/chat/actions/chat";
import { Button } from "@/shared/components/ui/Button";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

type StartChatButtonProps = {
  personaId: string;
};

export function StartChatButton({ personaId }: StartChatButtonProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleStart() {
    setError(null);
    startTransition(async () => {
      const result = await startConversation(personaId);

      if ("loginRequired" in result) {
        router.push(`/login?redirect=/characters/${personaId}`);
        return;
      }

      if ("error" in result) {
        setError(result.error);
        return;
      }

      router.push(`/chat/${result.conversationId}`);
    });
  }

  return (
    <div className="space-y-2">
      <Button
        type="button"
        className="w-full"
        size="lg"
        disabled={isPending}
        onClick={handleStart}
      >
        {isPending ? "로딩 중입니다..." : "대화 시작하기"}
      </Button>
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}
