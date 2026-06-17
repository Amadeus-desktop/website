/** Sync contract shared with desktop app (see ARCHITECTURE.md § Web & Sync). */

export const SYNC_SURFACES = {
  web: "web",
  app: "app",
} as const;

export type SyncSurface = (typeof SYNC_SURFACES)[keyof typeof SYNC_SURFACES];

/** Canonical cloud conversation identity: one active row per user + persona. */
export const CONVERSATION_SYNC_KEY = ["user_id", "persona_id"] as const;

/** Message dedupe identity within a conversation (matches DB unique index). */
export const MESSAGE_SYNC_KEY = [
  "user_id",
  "conversation_id",
  "idempotency_key",
] as const;

export const WEB_MESSAGE_IDEMPOTENCY_PREFIX = "web";

export function buildWebIdempotencyKey(scope: string): string {
  return `${WEB_MESSAGE_IDEMPOTENCY_PREFIX}:${scope}:${crypto.randomUUID()}`;
}
