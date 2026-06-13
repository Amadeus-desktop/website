"use client";

import { createCharacter, type CharacterActionState } from "@/features/characters/actions/characters";
import { Button } from "@/shared/components/ui/Button";
import { Input } from "@/shared/components/ui/Input";
import { Textarea } from "@/shared/components/ui/Textarea";
import { useActionState } from "react";

export function CharacterForm() {
  const [state, formAction, isPending] = useActionState<
    CharacterActionState,
    FormData
  >(createCharacter, {});

  return (
    <form action={formAction} className="flex flex-col gap-5">
      <Input name="name" label="이름" placeholder="캐릭터 이름" required />
      <Input
        name="avatarUrl"
        label="아바타 URL (선택)"
        placeholder="https://example.com/avatar.png"
        type="url"
      />
      <div className="flex flex-col gap-1.5">
        <label htmlFor="gender" className="text-sm font-medium text-foreground">
          성별
        </label>
        <select
          id="gender"
          name="gender"
          className="h-10 rounded-xl border border-border bg-surface px-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
        >
          <option value="">선택 안 함</option>
          <option value="male">남성</option>
          <option value="female">여성</option>
          <option value="non-binary">논바이너리</option>
          <option value="other">기타</option>
        </select>
      </div>
      <Textarea
        name="personality"
        label="성격"
        placeholder="캐릭터의 성격과 말투를 설명해주세요"
        required
      />
      <Textarea
        name="backstory"
        label="배경 스토리"
        placeholder="캐릭터의 배경과 세계관을 설명해주세요"
        required
      />
      <Textarea
        name="greeting"
        label="첫 인사말"
        placeholder="대화를 시작할 때 캐릭터가 건네는 첫 마디"
        required
      />
      <label className="flex items-center gap-2 text-sm text-foreground">
        <input
          type="checkbox"
          name="isPublic"
          defaultChecked
          className="h-4 w-4 rounded border-border text-primary focus:ring-primary/20"
        />
        다른 사용자에게 공개
      </label>
      {state.error && <p className="text-sm text-red-500">{state.error}</p>}
      <Button type="submit" disabled={isPending}>
        {isPending ? "생성 중..." : "캐릭터 만들기"}
      </Button>
    </form>
  );
}
