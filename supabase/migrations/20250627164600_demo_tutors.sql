/*
  # Demo Tutor Profiles

  Creates sample tutor profiles with Pexels images and subject associations
*/

-- Insert demo tutor users
INSERT INTO users (name, email, role, avatar_url) VALUES
  ('Dr. Sarah Chen', 'sarah.chen@demo.com', 'tutor', 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg'),
  ('Prof. Michael Rodriguez', 'michael.rodriguez@demo.com', 'tutor', 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg'),
  ('Emma Thompson', 'emma.thompson@demo.com', 'tutor', 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg'),
  ('Dr. James Wilson', 'james.wilson@demo.com', 'tutor', 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg'),
  ('Lisa Park', 'lisa.park@demo.com', 'tutor', 'https://images.pexels.com/photos/1181519/pexels-photo-1181519.jpeg'),
  ('David Kumar', 'david.kumar@demo.com', 'tutor', 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg');

-- Insert tutor profiles
INSERT INTO tutors (user_id, experience_years, hourly_rate, rating, bio, is_available) VALUES
  ((SELECT id FROM users WHERE email = 'sarah.chen@demo.com'), 8, 45.00, 4.9, 'PhD in Mathematics with 8 years of teaching experience. Specializes in calculus and algebra.', true),
  ((SELECT id FROM users WHERE email = 'michael.rodriguez@demo.com'), 12, 55.00, 4.8, 'Physics professor with expertise in quantum mechanics and thermodynamics.', true),
  ((SELECT id FROM users WHERE email = 'emma.thompson@demo.com'), 6, 40.00, 4.7, 'Chemistry expert focusing on organic and biochemistry for high school and college students.', true),
  ((SELECT id FROM users WHERE email = 'james.wilson@demo.com'), 10, 50.00, 4.9, 'Computer Science professional with industry experience in algorithms and data structures.', true),
  ((SELECT id FROM users WHERE email = 'lisa.park@demo.com'), 5, 35.00, 4.6, 'History teacher passionate about world history and American history.', true),
  ((SELECT id FROM users WHERE email = 'david.kumar@demo.com'), 7, 42.00, 4.8, 'Literature professor specializing in classic literature and creative writing.', true);

-- Associate tutors with subjects
INSERT INTO tutor_subjects (tutor_id, subject_id) VALUES
  -- Sarah Chen - Mathematics
  ((SELECT id FROM tutors WHERE user_id = (SELECT id FROM users WHERE email = 'sarah.chen@demo.com')), 
   (SELECT id FROM subjects WHERE name = 'Mathematics')),
  
  -- Michael Rodriguez - Physics
  ((SELECT id FROM tutors WHERE user_id = (SELECT id FROM users WHERE email = 'michael.rodriguez@demo.com')), 
   (SELECT id FROM subjects WHERE name = 'Physics')),
  
  -- Emma Thompson - Chemistry & Biology
  ((SELECT id FROM tutors WHERE user_id = (SELECT id FROM users WHERE email = 'emma.thompson@demo.com')), 
   (SELECT id FROM subjects WHERE name = 'Chemistry')),
  ((SELECT id FROM tutors WHERE user_id = (SELECT id FROM users WHERE email = 'emma.thompson@demo.com')), 
   (SELECT id FROM subjects WHERE name = 'Biology')),
  
  -- James Wilson - Computer Science & Mathematics
  ((SELECT id FROM tutors WHERE user_id = (SELECT id FROM users WHERE email = 'james.wilson@demo.com')), 
   (SELECT id FROM subjects WHERE name = 'Computer Science')),
  ((SELECT id FROM tutors WHERE user_id = (SELECT id FROM users WHERE email = 'james.wilson@demo.com')), 
   (SELECT id FROM subjects WHERE name = 'Mathematics')),
  
  -- Lisa Park - History
  ((SELECT id FROM tutors WHERE user_id = (SELECT id FROM users WHERE email = 'lisa.park@demo.com')), 
   (SELECT id FROM subjects WHERE name = 'History')),
  
  -- David Kumar - Literature
  ((SELECT id FROM tutors WHERE user_id = (SELECT id FROM users WHERE email = 'david.kumar@demo.com')), 
   (SELECT id FROM subjects WHERE name = 'Literature'));