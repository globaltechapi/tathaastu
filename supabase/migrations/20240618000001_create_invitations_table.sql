-- Create invitations table if it doesn't exist already
CREATE TABLE IF NOT EXISTS invitations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  registry_id UUID NOT NULL REFERENCES registries(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  name TEXT,
  message TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  rsvp_status TEXT,
  token TEXT,
  design_data TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE
);

-- Add index for faster lookups
CREATE INDEX IF NOT EXISTS invitations_registry_id_idx ON invitations(registry_id);
CREATE INDEX IF NOT EXISTS invitations_token_idx ON invitations(token);

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE invitations;

-- Disable RLS for now
-- ALTER TABLE invitations ENABLE ROW LEVEL SECURITY;
