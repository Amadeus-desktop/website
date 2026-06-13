import { cn } from "@/shared/lib/cn";

type MessageBubbleProps = {
  role: "user" | "assistant";
  content: string;
  isStreaming?: boolean;
};

export function MessageBubble({ role, content, isStreaming }: MessageBubbleProps) {
  const isUser = role === "user";

  return (
    <div className={cn("flex w-full", isUser ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed",
          isUser
            ? "rounded-br-md bg-primary text-white"
            : "rounded-bl-md bg-surface-elevated text-foreground",
        )}
      >
        {content}
        {isStreaming && (
          <span className="ml-1 inline-block h-4 w-1 animate-pulse bg-primary/60" />
        )}
      </div>
    </div>
  );
}
