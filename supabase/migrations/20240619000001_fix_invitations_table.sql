-- This migration fixes the issue with the invitations table already being a member of the publication
-- We'll just add some indexes to improve performance

-- Add index for faster lookups if they don't exist
CREATE INDEX IF NOT EXISTS invitations_email_idx ON invitations(email);
CREATE INDEX IF NOT EXISTS invitations_status_idx ON invitations(status);
