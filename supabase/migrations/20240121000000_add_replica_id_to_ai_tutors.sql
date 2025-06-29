-- Migration: Add replica_id field to ai_tutors table
-- Description: Add replica_id field to store Tavus replica ID

ALTER TABLE ai_tutors 
ADD COLUMN replica_id text;