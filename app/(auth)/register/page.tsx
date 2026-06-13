import { RegisterForm } from "@/features/auth/components/RegisterForm";
import { Card, CardContent, CardHeader } from "@/shared/components/ui/Card";

export default function RegisterPage() {
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <h1 className="text-2xl font-bold text-foreground">새로운 이야기 시작</h1>
        <p className="text-sm text-muted">나만의 캐릭터와 특별한 대화를 만들어보세요</p>
      </CardHeader>
      <CardContent>
        <RegisterForm />
      </CardContent>
    </Card>
  );
}
