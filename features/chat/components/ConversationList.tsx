import { Avatar } from "@/shared/components/ui/Avatar";
import { getLevelFromScore, getLevelLabel } from "@/features/intimacy/lib/intimacy";
import type { ConversationWithPersona } from "@/shared/types/database";
import Link from "next/link";
import { cn } from "@/shared/lib/cn";

type ConversationListProps = {
  conversations: ConversationWithPersona[];
  activeId?: string;
};

export function ConversationList({
  conversations,
  activeId,
}: ConversationListProps) {
  if (conversations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <p className="text-sm text-muted">아직 대화가 없어요</p>
        <p className="mt-1 text-xs text-muted">페르소나를 찾아 대화를 시작해보세요</p>
      </div>
    );
  }

  return (
    <ul className="flex flex-col gap-1">
      {conversations.map((conv) => {
        const state = conv.persona_states;
        const isActive = conv.id === activeId;
        const level = state ? getLevelFromScore(state.affinity) : "stranger";

        return (
          <li key={conv.id}>
            <Link
              href={`/chat/${conv.id}`}
              className={cn(
                "interactive-link flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors",
                isActive
                  ? "bg-primary-soft text-primary"
                  : "hover:bg-surface-elevated text-foreground",
              )}
            >
              <Avatar
                src={null}
                name={conv.personas.name}
                size="md"
              />
              <div className="flex-1 min-w-0">
                <p className="truncate text-sm font-medium">
                  {conv.personas.name}
                </p>
                {state && (
                  <p className="text-xs text-muted">
                    {getLevelLabel(level)} · {state.affinity}%
                  </p>
                )}
              </div>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
