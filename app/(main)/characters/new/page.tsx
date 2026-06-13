import { CharacterForm } from "@/features/characters/components/CharacterForm";
import { Card, CardContent, CardHeader } from "@/shared/components/ui/Card";

export default function NewCharacterPage() {
  return (
    <div className="mx-auto max-w-2xl">
      <Card>
        <CardHeader>
          <h1 className="text-2xl font-bold text-foreground">새 캐릭터 만들기</h1>
          <p className="text-sm text-muted">
            나만의 캐릭터를 설정하고 대화를 시작하세요
          </p>
        </CardHeader>
        <CardContent>
          <CharacterForm />
        </CardContent>
      </Card>
    </div>
  );
}
