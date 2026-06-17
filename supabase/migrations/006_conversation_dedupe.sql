-- Merge duplicate active conversations per user + persona, then enforce uniqueness.

UPDATE public.cloud_conversation_messages AS message
SET conversation_id = pair.canonical_id
FROM (
  WITH ranked AS (
    SELECT
      cc.id,
      cc.user_id,
      cc.persona_id,
      ROW_NUMBER() OVER (
        PARTITION BY cc.user_id, cc.persona_id
        ORDER BY
          (
            SELECT count(*)
            FROM public.cloud_conversation_messages m
            WHERE m.conversation_id = cc.id
          ) DESC,
          cc.last_message_at DESC NULLS LAST,
          CASE WHEN cc.active_surface = 'app' THEN 0 ELSE 1 END,
          cc.created_at DESC
      ) AS rn
    FROM public.cloud_conversations cc
    WHERE cc.deleted_at IS NULL
  )
  SELECT
    duplicate.id AS duplicate_id,
    canonical.id AS canonical_id
  FROM ranked duplicate
  JOIN ranked canonical
    ON canonical.user_id = duplicate.user_id
   AND canonical.persona_id = duplicate.persona_id
   AND canonical.rn = 1
  WHERE duplicate.rn > 1
) AS pair
WHERE message.conversation_id = pair.duplicate_id
  AND NOT EXISTS (
    SELECT 1
    FROM public.cloud_conversation_messages AS existing
    WHERE existing.conversation_id = pair.canonical_id
      AND existing.idempotency_key = message.idempotency_key
  );

DELETE FROM public.cloud_conversation_messages AS message
USING (
  WITH ranked AS (
    SELECT
      cc.id,
      cc.user_id,
      cc.persona_id,
      ROW_NUMBER() OVER (
        PARTITION BY cc.user_id, cc.persona_id
        ORDER BY
          (
            SELECT count(*)
            FROM public.cloud_conversation_messages m
            WHERE m.conversation_id = cc.id
          ) DESC,
          cc.last_message_at DESC NULLS LAST,
          CASE WHEN cc.active_surface = 'app' THEN 0 ELSE 1 END,
          cc.created_at DESC
      ) AS rn
    FROM public.cloud_conversations cc
    WHERE cc.deleted_at IS NULL
  )
  SELECT duplicate.id AS duplicate_id
  FROM ranked duplicate
  WHERE duplicate.rn > 1
) AS pair
WHERE message.conversation_id = pair.duplicate_id;

UPDATE public.cloud_conversations AS conversation
SET
  deleted_at = now(),
  updated_at = now()
FROM (
  WITH ranked AS (
    SELECT
      cc.id,
      cc.user_id,
      cc.persona_id,
      ROW_NUMBER() OVER (
        PARTITION BY cc.user_id, cc.persona_id
        ORDER BY
          (
            SELECT count(*)
            FROM public.cloud_conversation_messages m
            WHERE m.conversation_id = cc.id
          ) DESC,
          cc.last_message_at DESC NULLS LAST,
          CASE WHEN cc.active_surface = 'app' THEN 0 ELSE 1 END,
          cc.created_at DESC
      ) AS rn
    FROM public.cloud_conversations cc
    WHERE cc.deleted_at IS NULL
  )
  SELECT duplicate.id AS duplicate_id
  FROM ranked duplicate
  WHERE duplicate.rn > 1
) AS pair
WHERE conversation.id = pair.duplicate_id;

UPDATE public.cloud_conversations AS conversation
SET
  last_message_at = latest.last_message_at,
  updated_at = now()
FROM (
  SELECT
    conversation.id AS conversation_id,
    max(message.created_at) AS last_message_at
  FROM public.cloud_conversations AS conversation
  JOIN public.cloud_conversation_messages AS message
    ON message.conversation_id = conversation.id
  WHERE conversation.deleted_at IS NULL
  GROUP BY conversation.id
) AS latest
WHERE conversation.id = latest.conversation_id;

CREATE UNIQUE INDEX IF NOT EXISTS cloud_conversations_user_persona_active_key
  ON public.cloud_conversations (user_id, persona_id)
  WHERE deleted_at IS NULL;
