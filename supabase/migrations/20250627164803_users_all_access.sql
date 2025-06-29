/*
  # Allow all authenticated users to read users table

  This migration allows any authenticated user to read all user information
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Users can read own data" ON users;
DROP POLICY IF EXISTS "Users can read own data and students can read tutors" ON users;

-- Create policy allowing all authenticated users to read users table
CREATE POLICY "All authenticated users can read users" ON users
  FOR SELECT TO authenticated
  USING (true);