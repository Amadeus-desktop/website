"use server";

import {
  calculateNewIntimacy,
  estimateIntimacyDelta,
} from "@/features/intimacy/lib/intimacy";
import { sendMessageSchema } from "@/features/chat/schemas/chat";
import { createClient } from "@/shared/lib/supabase/server";
import type {
  ConversationWithCharacter,
  IntimacyState,
  Message,
} from "@/shared/types/database";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createOrGetConversation(formData: FormData) {
  const characterId = formData.get("characterId")?.toString();
  if (!characterId) {
    throw new Error("캐릭터 ID가 필요합니다");
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: existing } = await supabase
    .from("conversations")
    .select("id")
    .eq("user_id", user.id)
    .eq("character_id", characterId)
    .maybeSingle();

  if (existing) {
    redirect(`/chat/${existing.id}`);
  }

  const { data: character } = await supabase
    .from("characters")
    .select("greeting")
    .eq("id", characterId)
    .single();

  const { data: conversation, error } = await supabase
    .from("conversations")
    .insert({
      user_id: user.id,
      character_id: characterId,
    })
    .select("id")
    .single();

  if (error || !conversation) {
    throw new Error(error?.message ?? "대화 생성에 실패했습니다");
  }

  await supabase.from("intimacy_states").insert({
    conversation_id: conversation.id,
    score: 0,
    level: "stranger",
  });

  if (character?.greeting) {
    await supabase.from("messages").insert({
      conversation_id: conversation.id,
      role: "assistant",
      content: character.greeting,
    });
  }

  redirect(`/chat/${conversation.id}`);
}

export async function getConversation(
  conversationId: string,
): Promise<ConversationWithCharacter | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("conversations")
    .select("*, characters(*), intimacy_states(*)")
    .eq("id", conversationId)
    .single();

  if (error) {
    console.error("getConversation error:", error);
    return null;
  }

  return data as ConversationWithCharacter;
}

export async function getConversations(): Promise<ConversationWithCharacter[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return [];

  const { data, error } = await supabase
    .from("conversations")
    .select("*, characters(*), intimacy_states(*)")
    .eq("user_id", user.id)
    .order("last_message_at", { ascending: false });

  if (error) {
    console.error("getConversations error:", error);
    return [];
  }

  return (data ?? []) as ConversationWithCharacter[];
}

export async function getMessages(conversationId: string): Promise<Message[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("messages")
    .select("*")
    .eq("conversation_id", conversationId)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("getMessages error:", error);
    return [];
  }

  return data ?? [];
}

export async function saveUserMessage(
  conversationId: string,
  content: string,
): Promise<{ messageId: string } | { error: string }> {
  const parsed = sendMessageSchema.safeParse({ conversationId, content });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "입력값이 올바르지 않습니다" };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "로그인이 필요합니다" };
  }

  const { data, error } = await supabase
    .from("messages")
    .insert({
      conversation_id: conversationId,
      role: "user",
      content: parsed.data.content,
    })
    .select("id")
    .single();

  if (error) {
    return { error: error.message };
  }

  await supabase
    .from("conversations")
    .update({ last_message_at: new Date().toISOString() })
    .eq("id", conversationId);

  return { messageId: data.id };
}

export async function saveAssistantMessage(
  conversationId: string,
  content: string,
): Promise<void> {
  const supabase = await createClient();

  await supabase.from("messages").insert({
    conversation_id: conversationId,
    role: "assistant",
    content,
  });

  await supabase
    .from("conversations")
    .update({ last_message_at: new Date().toISOString() })
    .eq("id", conversationId);
}

export async function updateIntimacy(
  conversationId: string,
  userMessage: string,
): Promise<IntimacyState | null> {
  const supabase = await createClient();

  const { data: current } = await supabase
    .from("intimacy_states")
    .select("*")
    .eq("conversation_id", conversationId)
    .single();

  if (!current) return null;

  const delta = estimateIntimacyDelta(userMessage);
  const { score, level } = calculateNewIntimacy(current.score, delta);

  const { data, error } = await supabase
    .from("intimacy_states")
    .update({ score, level, updated_at: new Date().toISOString() })
    .eq("conversation_id", conversationId)
    .select("*")
    .single();

  if (error) {
    console.error("updateIntimacy error:", error);
    return null;
  }

  revalidatePath(`/chat/${conversationId}`);
  return data;
}
