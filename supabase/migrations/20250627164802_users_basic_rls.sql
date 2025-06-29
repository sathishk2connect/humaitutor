/*
  # Basic RLS policy for users table

  Allow authenticated users to read their own information
*/

-- Drop existing policies to start fresh
DROP POLICY IF EXISTS "Users can read own data and tutor profiles" ON users;

-- Create policy for users to read their own data and students to read tutor data
CREATE POLICY "Users can read own data and students can read tutors" ON users
  FOR SELECT TO authenticated
  USING (
    auth_id = auth.uid() 
    OR (
      role = 'tutor' 
      AND EXISTS (
        SELECT 1 FROM users current_user 
        WHERE current_user.auth_id = auth.uid() 
        AND current_user.role = 'student'
      )
    )
  );