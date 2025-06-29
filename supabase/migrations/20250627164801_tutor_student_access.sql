/*
  # Allow tutors to access student information

  This migration allows tutors to read student and user information
  needed for session management and tutoring activities.
*/

-- Allow tutors to read all user information
DROP POLICY IF EXISTS "Users can read own data and tutor profiles" ON users;
CREATE POLICY "Users can read own data and tutor profiles" ON users
  FOR SELECT TO authenticated
  USING (
    auth_id = auth.uid() 
    OR role = 'tutor'
    OR auth.uid() IN (
      SELECT u.auth_id FROM users u 
      JOIN tutors t ON t.user_id = u.id
    )
  );

-- Allow tutors to read student information
DROP POLICY IF EXISTS "Students can read own data" ON students;
CREATE POLICY "Students and tutors can read student data" ON students
  FOR SELECT TO authenticated
  USING (
    user_id = (SELECT id FROM users WHERE auth_id = auth.uid())
    OR auth.uid() IN (
      SELECT u.auth_id FROM users u 
      JOIN tutors t ON t.user_id = u.id
    )
  );