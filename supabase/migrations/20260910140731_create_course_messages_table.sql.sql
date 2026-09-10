CREATE TABLE IF NOT EXISTS course_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id text NOT NULL,
  sender_role text NOT NULL DEFAULT 'student',
  content text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_course_messages_user_course ON course_messages(user_id, course_id);

ALTER TABLE course_messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_course_messages" ON course_messages;
CREATE POLICY "select_own_course_messages"
ON course_messages FOR SELECT
TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_course_messages" ON course_messages;
CREATE POLICY "insert_own_course_messages"
ON course_messages FOR INSERT
TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_course_messages" ON course_messages;
CREATE POLICY "delete_own_course_messages"
ON course_messages FOR DELETE
TO authenticated USING (auth.uid() = user_id);
