import type { SupabaseClient } from "@supabase/supabase-js";
import { SYNC_SURFACES } from "@/shared/config/sync";
import type { CloudMessage, ConversationWithPersona } from "@/shared/types/database";

type ConversationRow = {
  id: string;
  last_message_at: string | null;
  active_surface: string | null;
  created_at: string;
};

type CloudMessageRow = CloudMessage & {
  source_device_id?: string | null;
  client_sequence?: number | null;
  server_received_at?: string | null;
  idempotency_key?: string | null;
};

export type UpsertCloudMessageInput = {
  userId: string;
  conversationId: string;
  personaId: string;
  role: "user" | "assistant" | "system_summary";
  content: string;
  idempotencyKey: string;
  provider?: string | null;
  surface?: string;
  safetyGrade?: string;
  clientCreatedAt?: string;
};

function compareConversations(
  a: ConversationRow,
  b: ConversationRow,
  messageCounts: Map<string, number>,
): number {
  const countDiff = (messageCounts.get(b.id) ?? 0) - (messageCounts.get(a.id) ?? 0);
  if (countDiff !== 0) return countDiff;

  const aTime = a.last_message_at ? new Date(a.last_message_at).getTime() : 0;
  const bTime = b.last_message_at ? new Date(b.last_message_at).getTime() : 0;
  if (bTime !== aTime) return bTime - aTime;

  if (a.active_surface === SYNC_SURFACES.app && b.active_surface !== SYNC_SURFACES.app) {
    return -1;
  }
  if (b.active_surface === SYNC_SURFACES.app && a.active_surface !== SYNC_SURFACES.app) {
    return 1;
  }

  return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
}

function compareCloudMessages(a: CloudMessageRow, b: CloudMessageRow): number {
  const clientCreatedDiff =
    new Date(a.client_created_at).getTime() - new Date(b.client_created_at).getTime();
  if (clientCreatedDiff !== 0) return clientCreatedDiff;

  const deviceA = a.source_device_id ?? "";
  const deviceB = b.source_device_id ?? "";
  if (deviceA !== deviceB) return deviceA.localeCompare(deviceB);

  const sequenceDiff = (a.client_sequence ?? 0) - (b.client_sequence ?? 0);
  if (sequenceDiff !== 0) return sequenceDiff;

  const serverReceivedDiff =
    new Date(a.server_received_at ?? a.created_at).getTime() -
    new Date(b.server_received_at ?? b.created_at).getTime();
  if (serverReceivedDiff !== 0) return serverReceivedDiff;

  return a.id.localeCompare(b.id);
}

async function loadMessageCounts(
  supabase: SupabaseClient,
  conversationIds: string[],
): Promise<Map<string, number>> {
  const counts = new Map<string, number>();
  if (conversationIds.length === 0) return counts;

  const { data, error } = await supabase
    .from("cloud_conversation_messages")
    .select("conversation_id")
    .in("conversation_id", conversationIds);

  if (error) {
    console.error("loadMessageCounts error:", error);
    return counts;
  }

  for (const row of data ?? []) {
    counts.set(row.conversation_id, (counts.get(row.conversation_id) ?? 0) + 1);
  }

  return counts;
}

export async function mergeDuplicateConversations(
  supabase: SupabaseClient,
  userId: string,
  personaId: string,
): Promise<string | null> {
  const { data: conversations, error } = await supabase
    .from("cloud_conversations")
    .select("id, last_message_at, active_surface, created_at")
    .eq("user_id", userId)
    .eq("persona_id", personaId)
    .is("deleted_at", null);

  if (error) {
    console.error("mergeDuplicateConversations lookup:", error);
    return null;
  }

  if (!conversations || conversations.length <= 1) {
    return conversations?.[0]?.id ?? null;
  }

  const messageCounts = await loadMessageCounts(
    supabase,
    conversations.map((conversation) => conversation.id),
  );

  const ranked = [...conversations].sort((a, b) =>
    compareConversations(a, b, messageCounts),
  );
  const canonical = ranked[0];
  const duplicates = ranked.slice(1);
  const now = new Date().toISOString();

  const { data: canonicalMessages } = await supabase
    .from("cloud_conversation_messages")
    .select("idempotency_key")
    .eq("conversation_id", canonical.id);

  const seenKeys = new Set(
    (canonicalMessages ?? [])
      .map((message) => message.idempotency_key)
      .filter(Boolean),
  );

  for (const duplicate of duplicates) {
    const { data: duplicateMessages } = await supabase
      .from("cloud_conversation_messages")
      .select("id, idempotency_key")
      .eq("conversation_id", duplicate.id);

    for (const message of duplicateMessages ?? []) {
      if (message.idempotency_key && seenKeys.has(message.idempotency_key)) {
        await supabase
          .from("cloud_conversation_messages")
          .delete()
          .eq("id", message.id);
        continue;
      }

      await supabase
        .from("cloud_conversation_messages")
        .update({ conversation_id: canonical.id })
        .eq("id", message.id);

      if (message.idempotency_key) {
        seenKeys.add(message.idempotency_key);
      }
    }

    await supabase
      .from("cloud_conversations")
      .update({ deleted_at: now, updated_at: now })
      .eq("id", duplicate.id)
      .eq("user_id", userId);
  }

  await touchConversationLastMessage(supabase, canonical.id, userId);

  return canonical.id;
}

export async function mergeDuplicateConversationsForUser(
  supabase: SupabaseClient,
  userId: string,
  personaIds: string[],
): Promise<void> {
  const uniquePersonaIds = [...new Set(personaIds)];
  await Promise.all(
    uniquePersonaIds.map((personaId) =>
      mergeDuplicateConversations(supabase, userId, personaId),
    ),
  );
}

export function dedupeConversationsBySlug(
  conversations: ConversationWithPersona[],
): ConversationWithPersona[] {
  const bySlug = new Map<string, ConversationWithPersona>();

  for (const conversation of conversations) {
    const slug = conversation.personas.slug;
    const existing = bySlug.get(slug);

    if (!existing) {
      bySlug.set(slug, conversation);
      continue;
    }

    const existingTime = existing.last_message_at
      ? new Date(existing.last_message_at).getTime()
      : 0;
    const nextTime = conversation.last_message_at
      ? new Date(conversation.last_message_at).getTime()
      : 0;

    if (nextTime >= existingTime) {
      bySlug.set(slug, conversation);
    }
  }

  return [...bySlug.values()].sort((a, b) => {
    const aTime = a.last_message_at ? new Date(a.last_message_at).getTime() : 0;
    const bTime = b.last_message_at ? new Date(b.last_message_at).getTime() : 0;
    return bTime - aTime;
  });
}

export function sortCloudMessages(messages: CloudMessageRow[]): CloudMessage[] {
  return [...messages].sort(compareCloudMessages) as CloudMessage[];
}

export async function upsertCloudMessage(
  supabase: SupabaseClient,
  input: UpsertCloudMessageInput,
): Promise<{ id: string } | { error: string }> {
  const now = input.clientCreatedAt ?? new Date().toISOString();

  const { data, error } = await supabase
    .from("cloud_conversation_messages")
    .upsert(
      {
        user_id: input.userId,
        conversation_id: input.conversationId,
        persona_id: input.personaId,
        role: input.role,
        content: input.content,
        provider: input.provider ?? null,
        surface: input.surface ?? SYNC_SURFACES.web,
        idempotency_key: input.idempotencyKey,
        safety_grade: input.safetyGrade ?? "green",
        client_created_at: now,
      },
      { onConflict: "user_id,conversation_id,idempotency_key" },
    )
    .select("id")
    .single();

  if (error || !data) {
    return { error: error?.message ?? "메시지 저장에 실패했습니다" };
  }

  return { id: data.id };
}

export async function touchConversationLastMessage(
  supabase: SupabaseClient,
  conversationId: string,
  userId: string,
): Promise<void> {
  const { data: latestMessage } = await supabase
    .from("cloud_conversation_messages")
    .select("client_created_at, created_at")
    .eq("conversation_id", conversationId)
    .order("client_created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  const lastMessageAt = latestMessage?.client_created_at ?? latestMessage?.created_at;
  if (!lastMessageAt) return;

  await supabase
    .from("cloud_conversations")
    .update({
      last_message_at: lastMessageAt,
      updated_at: new Date().toISOString(),
    })
    .eq("id", conversationId)
    .eq("user_id", userId);
}

export async function conversationHasMessages(
  supabase: SupabaseClient,
  conversationId: string,
): Promise<boolean> {
  const { count, error } = await supabase
    .from("cloud_conversation_messages")
    .select("*", { count: "exact", head: true })
    .eq("conversation_id", conversationId);

  if (error) {
    console.error("conversationHasMessages error:", error);
    return false;
  }

  return (count ?? 0) > 0;
}

export async function resolveCanonicalConversationId(
  supabase: SupabaseClient,
  userId: string,
  personaId: string,
): Promise<string | null> {
  return mergeDuplicateConversations(supabase, userId, personaId);
}
