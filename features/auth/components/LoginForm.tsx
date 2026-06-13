"use client";

import { login, type AuthActionState } from "@/features/auth/actions/auth";
import { Button } from "@/shared/components/ui/Button";
import { Input } from "@/shared/components/ui/Input";
import Link from "next/link";
import { useActionState } from "react";

type LoginFormProps = {
  redirectTo?: string;
};

export function LoginForm({ redirectTo }: LoginFormProps) {
  const [state, formAction, isPending] = useActionState<AuthActionState, FormData>(
    login,
    {},
  );

  return (
    <form action={formAction} className="flex w-full flex-col gap-4">
      {redirectTo && (
        <input type="hidden" name="redirect" value={redirectTo} />
      )}
      <Input
        name="email"
        type="email"
        label="이메일"
        placeholder="you@example.com"
        required
        autoComplete="email"
      />
      <Input
        name="password"
        type="password"
        label="비밀번호"
        placeholder="••••••••"
        required
        autoComplete="current-password"
      />
      {state.error && (
        <p className="text-sm text-red-500">{state.error}</p>
      )}
      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? "로그인 중..." : "로그인"}
      </Button>
      <p className="text-center text-sm text-muted">
        계정이 없으신가요?{" "}
        <Link href="/register" className="font-medium text-primary hover:underline">
          회원가입
        </Link>
      </p>
    </form>
  );
}
