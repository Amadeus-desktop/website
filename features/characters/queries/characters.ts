import { createClient } from "@/shared/lib/supabase/server";
import type { Character } from "@/shared/types/database";

export async function getCharacters(search?: string): Promise<Character[]> {
  const supabase = await createClient();

  let query = supabase
    .from("characters")
    .select("*")
    .order("is_official", { ascending: false })
    .order("created_at", { ascending: false });

  if (search?.trim()) {
    query = query.ilike("name", `%${search.trim()}%`);
  }

  const { data, error } = await query;

  if (error) {
    console.error("getCharacters error:", error);
    return [];
  }

  return data ?? [];
}

export async function getCharacterById(id: string): Promise<Character | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("characters")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("getCharacterById error:", error);
    return null;
  }

  return data;
}
