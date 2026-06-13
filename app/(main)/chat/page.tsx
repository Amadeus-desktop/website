import { ConversationList } from "@/features/chat/components/ConversationList";
import { getConversations } from "@/features/chat/actions/chat";
import { Card, CardContent } from "@/shared/components/ui/Card";
import Link from "next/link";

export default async function ChatListPage() {
  const conversations = await getConversations();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">대화</h1>
        <p className="text-sm text-muted">진행 중인 대화 목록</p>
      </div>

      {conversations.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-4 py-16 text-center">
            <p className="text-muted">아직 대화가 없어요</p>
            <Link
              href="/"
              className="text-sm font-medium text-primary hover:underline"
            >
              캐릭터 탐색하러 가기
            </Link>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-2">
            <ConversationList conversations={conversations} />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
