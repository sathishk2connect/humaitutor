/*
  # Add Video Call Status to Sessions

  Adds video call status tracking to sessions table
*/

-- Add video call status column
ALTER TABLE sessions 
ADD COLUMN IF NOT EXISTS video_call_status text 
CHECK (video_call_status IN ('idle', 'waiting', 'active', 'ended'))
DEFAULT 'idle';