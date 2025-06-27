/*
  # Seed Initial Data for AI Tutor Platform

  1. Subjects
  2. Badges
  3. Demo Users (students, tutors, admin)
  4. Sample sessions and content
*/

-- Insert subjects
INSERT INTO subjects (name, description) VALUES
  ('Mathematics', 'Algebra, Calculus, Geometry, Statistics'),
  ('Physics', 'Classical Mechanics, Quantum Physics, Thermodynamics'),
  ('Chemistry', 'Organic Chemistry, Inorganic Chemistry, Biochemistry'),
  ('Biology', 'Molecular Biology, Genetics, Ecology'),
  ('Computer Science', 'Programming, Algorithms, Data Structures'),
  ('History', 'World History, American History, European History'),
  ('Literature', 'Classic Literature, Poetry, Creative Writing'),
  ('Economics', 'Microeconomics, Macroeconomics, Finance');

-- Insert badges
INSERT INTO badges (name, description, icon, criteria) VALUES
  ('Quick Learner', 'Completed 10 sessions', '⚡', '{"sessions_completed": 10}'),
  ('Math Wizard', 'Mastered 15 math concepts', '🧮', '{"subject": "Mathematics", "concepts_mastered": 15}'),
  ('Science Explorer', 'Studied 3 science subjects', '🔬', '{"science_subjects": 3}'),
  ('Streak Master', '7-day learning streak', '🔥', '{"streak_days": 7}'),
  ('Knowledge Seeker', 'Asked 50 questions', '❓', '{"questions_asked": 50}'),
  ('Einstein Level', 'Master all physics concepts', '🎓', '{"subject": "Physics", "mastery_level": "expert"}'),
  ('Dedicated Student', 'Completed 50 sessions', '📚', '{"sessions_completed": 50}'),
  ('AI Collaborator', 'Had 25 AI tutor sessions', '🤖', '{"ai_sessions": 25}');

-- Note: Demo users will be created through the application's registration process
-- This ensures proper integration with Supabase Auth

-- Insert sample AI tutor configurations (will be linked to tutors after they're created)
-- These will be inserted via the application after demo tutors are created