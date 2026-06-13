import { RegisterForm } from "@/features/auth/components/RegisterForm";
import Link from "next/link";

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
      <Link href="/" className="mb-8 text-2xl font-bold text-primary">
        LoveyDovey
      </Link>
      <div className="w-full max-w-md rounded-2xl bg-surface p-6">
        <h1 className="text-xl font-bold text-foreground">회원가입</h1>
        <p className="mt-1 mb-6 text-sm text-muted">
          나만의 캐릭터와 특별한 대화를 만들어보세요
        </p>
        <RegisterForm />
      </div>
    </div>
  );
}
