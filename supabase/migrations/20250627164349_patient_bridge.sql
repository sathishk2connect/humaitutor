/*
  # Initial Schema Setup for AI Tutor Platform

  1. New Tables
    - `users` - Store user accounts (students, tutors, admins)
    - `tutors` - Extended tutor information
    - `students` - Extended student information  
    - `subjects` - Available subjects
    - `tutor_subjects` - Many-to-many relationship between tutors and subjects
    - `sessions` - Tutoring sessions
    - `ai_tutors` - AI tutor configurations
    - `content_library` - Educational content uploaded by tutors
    - `student_progress` - Track student learning progress
    - `badges` - Available badges/achievements
    - `student_badges` - Badges earned by students
    - `payments` - Payment records
    - `video_replicas` - Tavus AI video replicas
    - `session_messages` - Chat messages within sessions

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users based on roles
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  auth_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  email text UNIQUE NOT NULL,
  role text NOT NULL CHECK (role IN ('student', 'tutor', 'admin')),
  avatar_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Subjects table
CREATE TABLE IF NOT EXISTS subjects (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text UNIQUE NOT NULL,
  description text,
  created_at timestamptz DEFAULT now()
);

-- Tutors table
CREATE TABLE IF NOT EXISTS tutors (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  experience_years integer DEFAULT 0,
  hourly_rate decimal(10,2) DEFAULT 0,
  rating decimal(3,2) DEFAULT 0,
  total_sessions integer DEFAULT 0,
  total_earnings decimal(10,2) DEFAULT 0,
  bio text,
  is_available boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Students table
CREATE TABLE IF NOT EXISTS students (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  total_sessions integer DEFAULT 0,
  hours_learned decimal(8,2) DEFAULT 0,
  concepts_mastered integer DEFAULT 0,
  current_streak integer DEFAULT 0,
  total_xp integer DEFAULT 0,
  current_level integer DEFAULT 1,
  learning_style text CHECK (learning_style IN ('visual', 'auditory', 'kinesthetic', 'mixed')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Tutor subjects junction table
CREATE TABLE IF NOT EXISTS tutor_subjects (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  tutor_id uuid REFERENCES tutors(id) ON DELETE CASCADE,
  subject_id uuid REFERENCES subjects(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(tutor_id, subject_id)
);

-- AI Tutors table
CREATE TABLE IF NOT EXISTS ai_tutors (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  tutor_id uuid REFERENCES tutors(id) ON DELETE CASCADE,
  name text NOT NULL,
  personality text,
  teaching_context text,
  confidence_threshold integer DEFAULT 70,
  total_interactions integer DEFAULT 0,
  success_rate decimal(5,2) DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Video replicas table (for Tavus integration)
CREATE TABLE IF NOT EXISTS video_replicas (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  tutor_id uuid REFERENCES tutors(id) ON DELETE CASCADE,
  name text NOT NULL,
  tavus_replica_id text,
  video_file_name text,
  status text DEFAULT 'processing' CHECK (status IN ('uploading', 'processing', 'ready', 'error')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Sessions table
CREATE TABLE IF NOT EXISTS sessions (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id uuid REFERENCES students(id) ON DELETE CASCADE,
  tutor_id uuid REFERENCES tutors(id) ON DELETE SET NULL,
  ai_tutor_id uuid REFERENCES ai_tutors(id) ON DELETE SET NULL,
  subject_id uuid REFERENCES subjects(id) ON DELETE SET NULL,
  type text NOT NULL CHECK (type IN ('ai', 'human', 'hybrid')),
  status text DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'active', 'completed', 'cancelled')),
  title text,
  duration_minutes integer,
  scheduled_at timestamptz,
  started_at timestamptz,
  ended_at timestamptz,
  transcript text,
  video_url text,
  audio_url text,
  whiteboard_data jsonb,
  student_rating integer CHECK (student_rating >= 1 AND student_rating <= 5),
  student_feedback text,
  tutor_notes text,
  ai_confidence_avg decimal(5,2),
  amount decimal(10,2),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Session messages table
CREATE TABLE IF NOT EXISTS session_messages (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id uuid REFERENCES sessions(id) ON DELETE CASCADE,
  sender_type text NOT NULL CHECK (sender_type IN ('student', 'tutor', 'ai', 'system')),
  sender_id uuid,
  content text NOT NULL,
  message_type text DEFAULT 'text' CHECK (message_type IN ('text', 'image', 'file', 'system')),
  ai_confidence decimal(5,2),
  created_at timestamptz DEFAULT now()
);

-- Content library table
CREATE TABLE IF NOT EXISTS content_library (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  tutor_id uuid REFERENCES tutors(id) ON DELETE CASCADE,
  subject_id uuid REFERENCES subjects(id) ON DELETE SET NULL,
  title text NOT NULL,
  description text,
  file_name text NOT NULL,
  file_type text NOT NULL,
  file_size bigint,
  file_url text,
  content_type text CHECK (content_type IN ('pdf', 'video', 'audio', 'image', 'document')),
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  rejection_reason text,
  download_count integer DEFAULT 0,
  tags text[],
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Badges table
CREATE TABLE IF NOT EXISTS badges (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text UNIQUE NOT NULL,
  description text NOT NULL,
  icon text NOT NULL,
  criteria jsonb,
  created_at timestamptz DEFAULT now()
);

-- Student badges junction table
CREATE TABLE IF NOT EXISTS student_badges (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id uuid REFERENCES students(id) ON DELETE CASCADE,
  badge_id uuid REFERENCES badges(id) ON DELETE CASCADE,
  earned_at timestamptz DEFAULT now(),
  UNIQUE(student_id, badge_id)
);

-- Payments table
CREATE TABLE IF NOT EXISTS payments (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id uuid REFERENCES sessions(id) ON DELETE SET NULL,
  tutor_id uuid REFERENCES tutors(id) ON DELETE SET NULL,
  student_id uuid REFERENCES students(id) ON DELETE SET NULL,
  amount decimal(10,2) NOT NULL,
  platform_fee decimal(10,2) DEFAULT 0,
  tutor_earnings decimal(10,2) NOT NULL,
  payment_type text CHECK (payment_type IN ('session', 'ai_revenue')),
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'failed', 'refunded')),
  payment_method text,
  transaction_id text,
  processed_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE tutors ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE tutor_subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_tutors ENABLE ROW LEVEL SECURITY;
ALTER TABLE video_replicas ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE session_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_library ENABLE ROW LEVEL SECURITY;
ALTER TABLE badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Users policies
CREATE POLICY "Users can read own data" ON users
  FOR SELECT TO authenticated
  USING (auth_id = auth.uid());

CREATE POLICY "Users can update own data" ON users
  FOR UPDATE TO authenticated
  USING (auth_id = auth.uid());

-- Tutors policies
CREATE POLICY "Tutors can read own data" ON tutors
  FOR SELECT TO authenticated
  USING (user_id IN (SELECT id FROM users WHERE auth_id = auth.uid()));

CREATE POLICY "Anyone can read tutor profiles" ON tutors
  FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Tutors can update own data" ON tutors
  FOR UPDATE TO authenticated
  USING (user_id IN (SELECT id FROM users WHERE auth_id = auth.uid()));

-- Students policies
CREATE POLICY "Students can read own data" ON students
  FOR SELECT TO authenticated
  USING (user_id IN (SELECT id FROM users WHERE auth_id = auth.uid()));

CREATE POLICY "Students can update own data" ON students
  FOR UPDATE TO authenticated
  USING (user_id IN (SELECT id FROM users WHERE auth_id = auth.uid()));

-- Subjects policies (public read)
CREATE POLICY "Anyone can read subjects" ON subjects
  FOR SELECT TO authenticated
  USING (true);

-- Tutor subjects policies
CREATE POLICY "Anyone can read tutor subjects" ON tutor_subjects
  FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Tutors can manage own subjects" ON tutor_subjects
  FOR ALL TO authenticated
  USING (tutor_id IN (SELECT id FROM tutors WHERE user_id IN (SELECT id FROM users WHERE auth_id = auth.uid())));

-- AI tutors policies
CREATE POLICY "Tutors can manage own AI tutors" ON ai_tutors
  FOR ALL TO authenticated
  USING (tutor_id IN (SELECT id FROM tutors WHERE user_id IN (SELECT id FROM users WHERE auth_id = auth.uid())));

CREATE POLICY "Anyone can read AI tutors" ON ai_tutors
  FOR SELECT TO authenticated
  USING (true);

-- Video replicas policies
CREATE POLICY "Tutors can manage own video replicas" ON video_replicas
  FOR ALL TO authenticated
  USING (tutor_id IN (SELECT id FROM tutors WHERE user_id IN (SELECT id FROM users WHERE auth_id = auth.uid())));

-- Sessions policies
CREATE POLICY "Users can read own sessions" ON sessions
  FOR SELECT TO authenticated
  USING (
    student_id IN (SELECT id FROM students WHERE user_id IN (SELECT id FROM users WHERE auth_id = auth.uid()))
    OR tutor_id IN (SELECT id FROM tutors WHERE user_id IN (SELECT id FROM users WHERE auth_id = auth.uid()))
  );

CREATE POLICY "Users can create sessions" ON sessions
  FOR INSERT TO authenticated
  WITH CHECK (
    student_id IN (SELECT id FROM students WHERE user_id IN (SELECT id FROM users WHERE auth_id = auth.uid()))
    OR tutor_id IN (SELECT id FROM tutors WHERE user_id IN (SELECT id FROM users WHERE auth_id = auth.uid()))
  );

CREATE POLICY "Users can update own sessions" ON sessions
  FOR UPDATE TO authenticated
  USING (
    student_id IN (SELECT id FROM students WHERE user_id IN (SELECT id FROM users WHERE auth_id = auth.uid()))
    OR tutor_id IN (SELECT id FROM tutors WHERE user_id IN (SELECT id FROM users WHERE auth_id = auth.uid()))
  );

-- Session messages policies
CREATE POLICY "Users can read session messages" ON session_messages
  FOR SELECT TO authenticated
  USING (
    session_id IN (
      SELECT id FROM sessions WHERE 
      student_id IN (SELECT id FROM students WHERE user_id IN (SELECT id FROM users WHERE auth_id = auth.uid()))
      OR tutor_id IN (SELECT id FROM tutors WHERE user_id IN (SELECT id FROM users WHERE auth_id = auth.uid()))
    )
  );

CREATE POLICY "Users can create session messages" ON session_messages
  FOR INSERT TO authenticated
  WITH CHECK (
    session_id IN (
      SELECT id FROM sessions WHERE 
      student_id IN (SELECT id FROM students WHERE user_id IN (SELECT id FROM users WHERE auth_id = auth.uid()))
      OR tutor_id IN (SELECT id FROM tutors WHERE user_id IN (SELECT id FROM users WHERE auth_id = auth.uid()))
    )
  );

-- Content library policies
CREATE POLICY "Tutors can manage own content" ON content_library
  FOR ALL TO authenticated
  USING (tutor_id IN (SELECT id FROM tutors WHERE user_id IN (SELECT id FROM users WHERE auth_id = auth.uid())));

CREATE POLICY "Anyone can read approved content" ON content_library
  FOR SELECT TO authenticated
  USING (status = 'approved');

-- Badges policies (public read)
CREATE POLICY "Anyone can read badges" ON badges
  FOR SELECT TO authenticated
  USING (true);

-- Student badges policies
CREATE POLICY "Students can read own badges" ON student_badges
  FOR SELECT TO authenticated
  USING (student_id IN (SELECT id FROM students WHERE user_id IN (SELECT id FROM users WHERE auth_id = auth.uid())));

-- Payments policies
CREATE POLICY "Users can read own payments" ON payments
  FOR SELECT TO authenticated
  USING (
    student_id IN (SELECT id FROM students WHERE user_id IN (SELECT id FROM users WHERE auth_id = auth.uid()))
    OR tutor_id IN (SELECT id FROM tutors WHERE user_id IN (SELECT id FROM users WHERE auth_id = auth.uid()))
  );

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_auth_id ON users(auth_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_tutors_user_id ON tutors(user_id);
CREATE INDEX IF NOT EXISTS idx_students_user_id ON students(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_student_id ON sessions(student_id);
CREATE INDEX IF NOT EXISTS idx_sessions_tutor_id ON sessions(tutor_id);
CREATE INDEX IF NOT EXISTS idx_sessions_status ON sessions(status);
CREATE INDEX IF NOT EXISTS idx_session_messages_session_id ON session_messages(session_id);
CREATE INDEX IF NOT EXISTS idx_content_library_tutor_id ON content_library(tutor_id);
CREATE INDEX IF NOT EXISTS idx_content_library_status ON content_library(status);