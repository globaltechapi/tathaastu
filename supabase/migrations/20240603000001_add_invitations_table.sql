-- Create invitations table
CREATE TABLE IF NOT EXISTS invitations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  registry_id UUID NOT NULL REFERENCES registries(id) ON DELETE CASCADE,
  email VARCHAR NOT NULL,
  name VARCHAR,
  status VARCHAR NOT NULL DEFAULT 'pending',
  rsvp_status VARCHAR,
  message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  token UUID DEFAULT uuid_generate_v4()
);

-- Enable realtime
alter publication supabase_realtime add table invitations;
