-- Migration: Seed AI Tutors
-- Description: Create AI tutor entries for each human tutor

-- Create AI tutor entries for each human tutor
INSERT INTO ai_tutors (
  tutor_id,
  name,
  personality,
  teaching_context,
  confidence_threshold,
  total_interactions,
  success_rate,
  created_at,
  updated_at
)
SELECT 
  t.id as tutor_id,
  CONCAT(u.name, ' (AI Assistant)') as name,
  'Friendly, patient, and encouraging AI tutor that adapts to student learning pace' as personality,
  CONCAT('AI Assistant for ', u.name, ' - Specialized in ', 
    COALESCE(
      (SELECT STRING_AGG(s.name, ', ') 
       FROM tutor_subjects ts 
       JOIN subjects s ON ts.subject_id = s.id 
       WHERE ts.tutor_id = t.id), 
      'General Studies'
    ),
    '. Available 24/7 to provide personalized tutoring based on ', u.name, '''s teaching methodology.'
  ) as teaching_context,
  70 as confidence_threshold,
  0 as total_interactions,
  0 as success_rate,
  NOW() as created_at,
  NOW() as updated_at
FROM tutors t
JOIN users u ON t.user_id = u.id
WHERE u.role = 'tutor'
AND NOT EXISTS (
  SELECT 1 FROM ai_tutors at WHERE at.tutor_id = t.id
);