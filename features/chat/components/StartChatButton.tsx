import { createOrGetConversation } from "@/features/chat/actions/chat";
import { Button } from "@/shared/components/ui/Button";

type StartChatButtonProps = {
  characterId: string;
};

export function StartChatButton({ characterId }: StartChatButtonProps) {
  return (
    <form action={createOrGetConversation}>
      <input type="hidden" name="characterId" value={characterId} />
      <Button type="submit" className="w-full" size="lg">
        대화 시작하기
      </Button>
    </form>
  );
}
