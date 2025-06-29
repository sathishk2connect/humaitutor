/*
  # Fix Student and Session Messages Permissions

  Allow students to read their own data and both students/tutors to create session messages
*/

-- Fix students table policies
DROP POLICY IF EXISTS "Students can read own data" ON students;
DROP POLICY IF EXISTS "Students can update own data" ON students;

CREATE POLICY "Students can read own data" ON students
  FOR SELECT TO authenticated
  USING (user_id IN (SELECT id FROM users WHERE auth_id = auth.uid()));

CREATE POLICY "Students can update own data" ON students
  FOR UPDATE TO authenticated
  USING (user_id IN (SELECT id FROM users WHERE auth_id = auth.uid()));

-- Fix session_messages policies
DROP POLICY IF EXISTS "Students and tutors can create messages" ON session_messages;
DROP POLICY IF EXISTS "Students and tutors can read messages" ON session_messages;

CREATE POLICY "Students and tutors can create messages" ON session_messages
  FOR INSERT TO authenticated
  WITH CHECK (true);

CREATE POLICY "Students and tutors can read messages" ON session_messages
  FOR SELECT TO authenticated
  USING (true);