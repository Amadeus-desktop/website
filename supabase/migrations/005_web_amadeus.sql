-- Web: remove legacy seed characters, expose catalog personas, add web chat mode

DELETE FROM public.characters;

DROP POLICY IF EXISTS "personas_select_catalog" ON public.personas;
CREATE POLICY "personas_select_catalog"
  ON public.personas FOR SELECT
  USING (
    deleted_at IS NULL
    AND slug IN (
      'seoyeon-modern-senior',
      'eiren-fantasy-guardian',
      'makise-kurisu'
    )
  );

ALTER TABLE public.cloud_conversations
  ADD COLUMN IF NOT EXISTS chat_mode text NOT NULL DEFAULT 'simple'
  CHECK (chat_mode IN ('simple', 'long', 'exciting'));
