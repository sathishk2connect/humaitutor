/*
  # Demo Student Data

  Creates sample student profiles
*/

-- Insert demo student users
INSERT INTO users (name, email, role, avatar_url) VALUES
  ('Alex Johnson', 'alex.johnson@demo.com', 'student', 'https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg'),
  ('Maria Garcia', 'maria.garcia@demo.com', 'student', 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg'),
  ('John Smith', 'john.smith@demo.com', 'student', 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg'),
  ('Sarah Wilson', 'sarah.wilson@demo.com', 'student', 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg');

-- Insert student profiles
INSERT INTO students (user_id, total_sessions, hours_learned, concepts_mastered, current_streak, total_xp, current_level, learning_style) VALUES
  ((SELECT id FROM users WHERE email = 'alex.johnson@demo.com'), 15, 25.5, 12, 5, 1250, 3, 'visual'),
  ((SELECT id FROM users WHERE email = 'maria.garcia@demo.com'), 8, 12.0, 6, 3, 800, 2, 'auditory'),
  ((SELECT id FROM users WHERE email = 'john.smith@demo.com'), 22, 35.0, 18, 7, 1800, 4, 'kinesthetic'),
  ((SELECT id FROM users WHERE email = 'sarah.wilson@demo.com'), 5, 8.5, 4, 2, 500, 1, 'mixed');