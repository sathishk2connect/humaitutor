/*
  # Student-Tutor Association Table

  Creates a many-to-many relationship between students and tutors
  for managing preferred tutors, regular students, etc.
*/

-- Student-Tutor association table
CREATE TABLE IF NOT EXISTS student_tutors (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id uuid REFERENCES students(id) ON DELETE CASCADE,
  tutor_id uuid REFERENCES tutors(id) ON DELETE CASCADE,
  relationship_type text DEFAULT 'preferred' CHECK (relationship_type IN ('preferred', 'regular', 'blocked')),
  created_at timestamptz DEFAULT now(),
  UNIQUE(student_id, tutor_id)
);

-- Enable RLS
ALTER TABLE student_tutors ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can read own associations" ON student_tutors
  FOR SELECT TO authenticated
  USING (
    student_id IN (SELECT id FROM students WHERE user_id IN (SELECT id FROM users WHERE auth_id = auth.uid()))
    OR tutor_id IN (SELECT id FROM tutors WHERE user_id IN (SELECT id FROM users WHERE auth_id = auth.uid()))
  );

CREATE POLICY "Users can manage own associations" ON student_tutors
  FOR ALL TO authenticated
  USING (
    student_id IN (SELECT id FROM students WHERE user_id IN (SELECT id FROM users WHERE auth_id = auth.uid()))
    OR tutor_id IN (SELECT id FROM tutors WHERE user_id IN (SELECT id FROM users WHERE auth_id = auth.uid()))
  );

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_student_tutors_student_id ON student_tutors(student_id);
CREATE INDEX IF NOT EXISTS idx_student_tutors_tutor_id ON student_tutors(tutor_id);
CREATE INDEX IF NOT EXISTS idx_student_tutors_relationship_type ON student_tutors(relationship_type);