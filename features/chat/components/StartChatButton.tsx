import { createOrGetConversation } from "@/features/chat/actions/chat";
import { Button } from "@/shared/components/ui/Button";

type StartChatButtonProps = {
  personaId: string;
};

export function StartChatButton({ personaId }: StartChatButtonProps) {
  return (
    <form action={createOrGetConversation}>
      <input type="hidden" name="personaId" value={personaId} />
      <Button type="submit" className="w-full" size="lg">
        대화 시작하기
      </Button>
    </form>
  );
}
