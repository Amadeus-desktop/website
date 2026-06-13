"use client";

import { Input } from "@/shared/components/ui/Input";
import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";

type CharacterSearchProps = {
  defaultValue?: string;
};

export function CharacterSearch({ defaultValue }: CharacterSearchProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  function handleSearch(value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set("q", value);
    } else {
      params.delete("q");
    }
    startTransition(() => {
      router.replace(`/?${params.toString()}`);
    });
  }

  return (
    <Input
      placeholder="캐릭터 이름 검색..."
      defaultValue={defaultValue}
      onChange={(e) => handleSearch(e.target.value)}
      className={isPending ? "opacity-70" : ""}
    />
  );
}
