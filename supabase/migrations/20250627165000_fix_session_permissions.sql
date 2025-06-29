/*
  # Fix Session and Session Messages Permissions

  Updates RLS policies to allow students and tutors to create sessions and messages
*/

-- Drop existing restrictive policies for sessions
DROP POLICY IF EXISTS "Users can create sessions" ON sessions;
DROP POLICY IF EXISTS "Users can create session messages" ON session_messages;

-- Create new policies for sessions
CREATE POLICY "Students and tutors can create sessions" ON sessions
  FOR INSERT TO authenticated
  WITH CHECK (
    student_id IN (SELECT id FROM students WHERE user_id IN (SELECT id FROM users WHERE auth_id = auth.uid()))
    OR tutor_id IN (SELECT id FROM tutors WHERE user_id IN (SELECT id FROM users WHERE auth_id = auth.uid()))
  );

CREATE POLICY "Students and tutors can update own sessions" ON sessions
  FOR UPDATE TO authenticated
  USING (
    student_id IN (SELECT id FROM students WHERE user_id IN (SELECT id FROM users WHERE auth_id = auth.uid()))
    OR tutor_id IN (SELECT id FROM tutors WHERE user_id IN (SELECT id FROM users WHERE auth_id = auth.uid()))
  );

-- Create new policies for session messages
CREATE POLICY "Students and tutors can create messages" ON session_messages
  FOR INSERT TO authenticated
  WITH CHECK (
    session_id IN (
      SELECT id FROM sessions WHERE 
      student_id IN (SELECT id FROM students WHERE user_id IN (SELECT id FROM users WHERE auth_id = auth.uid()))
      OR tutor_id IN (SELECT id FROM tutors WHERE user_id IN (SELECT id FROM users WHERE auth_id = auth.uid()))
    )
  );

CREATE POLICY "Students and tutors can read messages" ON session_messages
  FOR SELECT TO authenticated
  USING (
    session_id IN (
      SELECT id FROM sessions WHERE 
      student_id IN (SELECT id FROM students WHERE user_id IN (SELECT id FROM users WHERE auth_id = auth.uid()))
      OR tutor_id IN (SELECT id FROM tutors WHERE user_id IN (SELECT id FROM users WHERE auth_id = auth.uid()))
    )
  );