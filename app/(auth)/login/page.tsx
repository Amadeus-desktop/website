import { LoginForm } from "@/features/auth/components/LoginForm";
import Link from "next/link";

type LoginPageProps = {
  searchParams: Promise<{ redirect?: string }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { redirect: redirectTo } = await searchParams;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
      <Link href="/" className="mb-8 text-2xl font-bold text-primary">
        LoveyDovey
      </Link>
      <div className="w-full max-w-md rounded-2xl bg-surface p-6">
        <h1 className="text-xl font-bold text-foreground">로그인</h1>
        <p className="mt-1 mb-6 text-sm text-muted">
          러비더비에 로그인하고 대화를 시작하세요
        </p>
        <LoginForm redirectTo={redirectTo} />
      </div>
    </div>
  );
}
