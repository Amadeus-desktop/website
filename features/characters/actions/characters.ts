"use server";

import { characterSchema } from "@/features/characters/schemas/character";
import { createClient } from "@/shared/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export type CharacterActionState = {
  error?: string;
};

export async function createCharacter(
  _prevState: CharacterActionState,
  formData: FormData,
): Promise<CharacterActionState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "로그인이 필요합니다" };
  }

  const avatarUrl = formData.get("avatarUrl")?.toString() ?? "";
  const parsed = characterSchema.safeParse({
    name: formData.get("name"),
    avatarUrl: avatarUrl || undefined,
    personality: formData.get("personality"),
    backstory: formData.get("backstory"),
    greeting: formData.get("greeting"),
    gender: formData.get("gender") || undefined,
    isPublic: formData.get("isPublic") === "on",
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "입력값이 올바르지 않습니다" };
  }

  const { data, error } = await supabase
    .from("characters")
    .insert({
      creator_id: user.id,
      name: parsed.data.name,
      avatar_url: parsed.data.avatarUrl || null,
      personality: parsed.data.personality,
      backstory: parsed.data.backstory,
      greeting: parsed.data.greeting,
      gender: parsed.data.gender ?? null,
      is_public: parsed.data.isPublic,
      is_official: false,
    })
    .select("id")
    .single();

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/");
  revalidatePath("/characters");
  redirect(`/characters/${data.id}`);
}
