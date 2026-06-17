"use server";

import { getLLMProviderName } from "@/features/ai";
import { ensureUserPersona } from "@/features/personas/actions/provision";
import {
  calculateNewIntimacy,
  estimateIntimacyDelta,
  getLevelFromScore,
} from "@/features/intimacy/lib/intimacy";
import { sendMessageSchema } from "@/features/chat/schemas/chat";
import { createClient } from "@/shared/lib/supabase/server";
import type {
  ChatMode,
  CloudMessage,
  ConversationWithPersona,
  IntimacyState,
  PersonaState,
} from "@/shared/types/database";
import { revalidatePath } from "next/cache";
import { randomUUID } from "crypto";

export type StartConversationResult =
  | { conversationId: string }
  | { error: string }
  | { loginRequired: true };

function personaStateToIntimacy(state: PersonaState | null): IntimacyState | null {
  if (!state) return null;

  return {
    conversation_id: state.persona_id,
    score: state.affinity,
    level: getLevelFromScore(state.affinity),
    updated_at: state.updated_at,
  };
}

async function insertCloudMessage(input: {
  userId: string;
  conversationId: string;
  personaId: string;
  role: "user" | "assistant";
  content: string;
}) {
  const supabase = await createClient();
  const now = new Date().toISOString();

  return supabase.from("cloud_conversation_messages").insert({
    user_id: input.userId,
    conversation_id: input.conversationId,
    persona_id: input.personaId,
    role: input.role,
    content: input.content,
    provider: getLLMProviderName(),
    surface: "web",
    idempotency_key: randomUUID(),
    safety_grade: "green",
    client_created_at: now,
  });
}

export async function startConversation(
  personaId: string,
): Promise<StartConversationResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { loginRequired: true };
  }

  const userPersona = await ensureUserPersona(user.id, personaId);
  if (!userPersona) {
    return { error: "페르소나를 불러오지 못했습니다" };
  }

  const [{ data: existing }, firstMessage] = await Promise.all([
    supabase
      .from("cloud_conversations")
      .select("id")
      .eq("user_id", user.id)
      .eq("persona_id", userPersona.id)
      .is("deleted_at", null)
      .maybeSingle(),
    Promise.resolve(userPersona.static_prompt_json.first_message),
  ]);

  if (existing) {
    return { conversationId: existing.id };
  }

  const { data: conversation, error } = await supabase
    .from("cloud_conversations")
    .insert({
      user_id: user.id,
      persona_id: userPersona.id,
      title: userPersona.name,
      active_surface: "web",
      last_message_at: new Date().toISOString(),
    })
    .select("id")
    .single();

  if (error || !conversation) {
    return { error: error?.message ?? "대화 생성에 실패했습니다" };
  }

  if (firstMessage) {
    await insertCloudMessage({
      userId: user.id,
      conversationId: conversation.id,
      personaId: userPersona.id,
      role: "assistant",
      content: firstMessage,
    });
  }

  return { conversationId: conversation.id };
}

/** @deprecated Use startConversation from client for loading UX */
export async function createOrGetConversation(formData: FormData) {
  const personaId = formData.get("personaId")?.toString();
  if (!personaId) {
    throw new Error("페르소나 ID가 필요합니다");
  }

  const result = await startConversation(personaId);
  const { redirect } = await import("next/navigation");

  if ("conversationId" in result) {
    redirect(`/chat/${result.conversationId}`);
  }

  if ("loginRequired" in result) {
    redirect("/login");
  }

  if ("error" in result) {
    throw new Error(result.error);
  }

  throw new Error("대화를 시작하지 못했습니다");
}

export async function getConversation(
  conversationId: string,
): Promise<ConversationWithPersona | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data, error } = await supabase
    .from("cloud_conversations")
    .select("*, personas(*)")
    .eq("id", conversationId)
    .eq("user_id", user.id)
    .is("deleted_at", null)
    .single();

  if (error) {
    console.error("getConversation error:", error);
    return null;
  }

  const { data: personaState } = await supabase
    .from("persona_states")
    .select("*")
    .eq("user_id", user.id)
    .eq("persona_id", data.persona_id)
    .eq("is_current", true)
    .maybeSingle();

  return {
    ...(data as ConversationWithPersona),
    persona_states: (personaState as PersonaState | null) ?? null,
  };
}

export async function getConversations(): Promise<ConversationWithPersona[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return [];

  const { data, error } = await supabase
    .from("cloud_conversations")
    .select("*, personas(*)")
    .eq("user_id", user.id)
    .is("deleted_at", null)
    .order("last_message_at", { ascending: false });

  if (error) {
    console.error("getConversations error:", error);
    return [];
  }

  const conversations = (data ?? []) as ConversationWithPersona[];

  const personaIds = [...new Set(conversations.map((c) => c.persona_id))];
  if (personaIds.length === 0) return conversations;

  const { data: states } = await supabase
    .from("persona_states")
    .select("*")
    .eq("user_id", user.id)
    .in("persona_id", personaIds)
    .eq("is_current", true);

  const stateMap = new Map(
    (states ?? []).map((state) => [state.persona_id, state as PersonaState]),
  );

  return conversations.map((conversation) => ({
    ...conversation,
    persona_states: stateMap.get(conversation.persona_id) ?? null,
  }));
}

export async function getMessages(conversationId: string): Promise<CloudMessage[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("cloud_conversation_messages")
    .select("*")
    .eq("conversation_id", conversationId)
    .in("role", ["user", "assistant"])
    .order("created_at", { ascending: true });

  if (error) {
    console.error("getMessages error:", error);
    return [];
  }

  return (data ?? []) as CloudMessage[];
}

export async function updateChatMode(
  conversationId: string,
  chatMode: ChatMode,
): Promise<{ success: true } | { error: string }> {
  const validModes: ChatMode[] = ["simple", "long", "exciting"];
  if (!validModes.includes(chatMode)) {
    return { error: "유효하지 않은 채팅 모드입니다" };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "로그인이 필요합니다" };

  const { error } = await supabase
    .from("cloud_conversations")
    .update({ chat_mode: chatMode, updated_at: new Date().toISOString() })
    .eq("id", conversationId)
    .eq("user_id", user.id);

  if (error) return { error: error.message };

  revalidatePath(`/chat/${conversationId}`);
  return { success: true };
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

  const { data: conversation } = await supabase
    .from("cloud_conversations")
    .select("persona_id")
    .eq("id", conversationId)
    .eq("user_id", user.id)
    .single();

  if (!conversation) {
    return { error: "대화를 찾을 수 없습니다" };
  }

  const { data, error } = await supabase
    .from("cloud_conversation_messages")
    .insert({
      user_id: user.id,
      conversation_id: conversationId,
      persona_id: conversation.persona_id,
      role: "user",
      content: parsed.data.content,
      provider: getLLMProviderName(),
      surface: "web",
      idempotency_key: randomUUID(),
      safety_grade: "green",
      client_created_at: new Date().toISOString(),
    })
    .select("id")
    .single();

  if (error) {
    return { error: error.message };
  }

  await supabase
    .from("cloud_conversations")
    .update({
      last_message_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq("id", conversationId);

  return { messageId: data.id };
}

export async function saveAssistantMessage(
  conversationId: string,
  content: string,
): Promise<void> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return;

  const { data: conversation } = await supabase
    .from("cloud_conversations")
    .select("persona_id")
    .eq("id", conversationId)
    .eq("user_id", user.id)
    .single();

  if (!conversation) return;

  await insertCloudMessage({
    userId: user.id,
    conversationId,
    personaId: conversation.persona_id,
    role: "assistant",
    content,
  });

  await supabase
    .from("cloud_conversations")
    .update({
      last_message_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq("id", conversationId);
}

export async function updateIntimacy(
  conversationId: string,
  userMessage: string,
): Promise<IntimacyState | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: conversation } = await supabase
    .from("cloud_conversations")
    .select("persona_id")
    .eq("id", conversationId)
    .eq("user_id", user.id)
    .single();

  if (!conversation) return null;

  const { data: current } = await supabase
    .from("persona_states")
    .select("*")
    .eq("user_id", user.id)
    .eq("persona_id", conversation.persona_id)
    .eq("is_current", true)
    .maybeSingle();

  if (!current) return null;

  const delta = estimateIntimacyDelta(userMessage);
  const { score, level } = calculateNewIntimacy(current.affinity, delta);

  const { data, error } = await supabase
    .from("persona_states")
    .update({
      affinity: score,
      relationship_stage: level,
      updated_at: new Date().toISOString(),
    })
    .eq("id", current.id)
    .select("*")
    .single();

  if (error) {
    console.error("updateIntimacy error:", error);
    return null;
  }

  revalidatePath(`/chat/${conversationId}`);
  return personaStateToIntimacy(data as PersonaState);
}

export async function getConversationIntimacy(
  conversationId: string,
): Promise<IntimacyState | null> {
  const conversation = await getConversation(conversationId);
  return personaStateToIntimacy(conversation?.persona_states ?? null);
}
