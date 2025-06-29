/*
  # Fix Foreign Key Relationships

  Ensures proper foreign key constraints exist between tables
*/

-- Add foreign key constraint for tutors -> users if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'tutors_user_id_fkey' 
        AND table_name = 'tutors'
    ) THEN
        ALTER TABLE tutors 
        ADD CONSTRAINT tutors_user_id_fkey 
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
    END IF;
END $$;

-- Add foreign key constraint for students -> users if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'students_user_id_fkey' 
        AND table_name = 'students'
    ) THEN
        ALTER TABLE students 
        ADD CONSTRAINT students_user_id_fkey 
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
    END IF;
END $$;