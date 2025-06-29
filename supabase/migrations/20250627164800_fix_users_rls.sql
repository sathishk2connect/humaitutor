/*
  # Fix Users RLS Policy

  Allow reading tutor profiles for the tutors listing
*/

-- Drop existing restrictive policy
DROP POLICY IF EXISTS "Users can read own data" ON users;

-- Create new policy that allows reading tutor profiles
CREATE POLICY "Users can read own data and tutor profiles" ON users
  FOR SELECT TO authenticated
  USING (
    auth_id = auth.uid() 
    OR role = 'tutor'
  );