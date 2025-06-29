-- Migration: Add start_time and end_time to sessions table
-- Description: Add start_time and end_time fields to track session duration

ALTER TABLE sessions 
ADD COLUMN start_time timestamptz,
ADD COLUMN end_time timestamptz;