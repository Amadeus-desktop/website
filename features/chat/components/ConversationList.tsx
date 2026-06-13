import { Avatar } from "@/shared/components/ui/Avatar";
import { getLevelLabel } from "@/features/intimacy/lib/intimacy";
import type { ConversationWithCharacter } from "@/shared/types/database";
import Link from "next/link";
import { cn } from "@/shared/lib/cn";

type ConversationListProps = {
  conversations: ConversationWithCharacter[];
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
        <p className="mt-1 text-xs text-muted">캐릭터를 찾아 대화를 시작해보세요</p>
      </div>
    );
  }

  return (
    <ul className="flex flex-col gap-1">
      {conversations.map((conv) => {
        const intimacy = conv.intimacy_states;
        const isActive = conv.id === activeId;

        return (
          <li key={conv.id}>
            <Link
              href={`/chat/${conv.id}`}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors",
                isActive
                  ? "bg-primary-soft text-primary"
                  : "hover:bg-surface-elevated text-foreground",
              )}
            >
              <Avatar
                src={conv.characters.avatar_url}
                name={conv.characters.name}
                size="md"
              />
              <div className="flex-1 min-w-0">
                <p className="truncate text-sm font-medium">
                  {conv.characters.name}
                </p>
                {intimacy && (
                  <p className="text-xs text-muted">
                    {getLevelLabel(intimacy.level)} · {intimacy.score}%
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
