"use client";

import { register, type AuthActionState } from "@/features/auth/actions/auth";
import { Button } from "@/shared/components/ui/Button";
import { Input } from "@/shared/components/ui/Input";
import Link from "next/link";
import { useActionState } from "react";

export function RegisterForm() {
  const [state, formAction, isPending] = useActionState<AuthActionState, FormData>(
    register,
    {},
  );

  return (
    <form action={formAction} className="flex w-full flex-col gap-4">
      <Input
        name="displayName"
        label="닉네임"
        placeholder="러비"
        required
        autoComplete="nickname"
      />
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
        placeholder="6자 이상"
        required
        autoComplete="new-password"
      />
      {state.error && (
        <p className="text-sm text-red-500">{state.error}</p>
      )}
      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? "가입 중..." : "회원가입"}
      </Button>
      <p className="text-center text-sm text-muted">
        이미 계정이 있으신가요?{" "}
        <Link href="/login" className="font-medium text-primary hover:underline">
          로그인
        </Link>
      </p>
    </form>
  );
}
