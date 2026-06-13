"use server";

import {
  extractMemories,
  MAX_MEMORIES,
} from "@/features/memory/lib/extract";
import { createClient } from "@/shared/lib/supabase/server";
import type { CharacterMemory } from "@/shared/types/database";

export async function getMemories(
  conversationId: string,
): Promise<CharacterMemory[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("character_memories")
    .select("*")
    .eq("conversation_id", conversationId)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("getMemories error:", error);
    return [];
  }

  return data ?? [];
}

export async function saveMemoriesFromMessage(
  conversationId: string,
  userMessage: string,
): Promise<void> {
  const extracted = extractMemories(userMessage);
  if (extracted.length === 0) return;

  const supabase = await createClient();

  const { data: existing } = await supabase
    .from("character_memories")
    .select("content")
    .eq("conversation_id", conversationId);

  const existingContents = new Set(existing?.map((m) => m.content) ?? []);
  const newMemories = extracted.filter((m) => !existingContents.has(m));

  if (newMemories.length === 0) return;

  const { count } = await supabase
    .from("character_memories")
    .select("*", { count: "exact", head: true })
    .eq("conversation_id", conversationId);

  const currentCount = count ?? 0;
  const toInsert = newMemories.slice(0, MAX_MEMORIES - currentCount);

  if (toInsert.length === 0) return;

  await supabase.from("character_memories").insert(
    toInsert.map((content) => ({
      conversation_id: conversationId,
      content,
    })),
  );
}
