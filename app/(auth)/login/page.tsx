import { LoginForm } from "@/features/auth/components/LoginForm";
import { Card, CardContent, CardHeader } from "@/shared/components/ui/Card";

type LoginPageProps = {
  searchParams: Promise<{ redirect?: string }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { redirect: redirectTo } = await searchParams;

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <h1 className="text-2xl font-bold text-foreground">다시 만나서 반가워요</h1>
        <p className="text-sm text-muted">러비더비에 로그인하고 대화를 시작하세요</p>
      </CardHeader>
      <CardContent>
        <LoginForm redirectTo={redirectTo} />
      </CardContent>
    </Card>
  );
}
