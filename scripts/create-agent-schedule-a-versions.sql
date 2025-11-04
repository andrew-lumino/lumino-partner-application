-- Create table for tracking Schedule A version history per agent
CREATE TABLE IF NOT EXISTS agent_schedule_a_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID NOT NULL REFERENCES partner_applications(id) ON DELETE CASCADE,
  schedule_a_data JSONB NOT NULL,
  effective_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by TEXT NOT NULL,
  notes TEXT,
  is_active BOOLEAN DEFAULT true,
  CONSTRAINT fk_application FOREIGN KEY (application_id) REFERENCES partner_applications(id)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_agent_schedule_versions_app_id ON agent_schedule_a_versions(application_id);
CREATE INDEX IF NOT EXISTS idx_agent_schedule_versions_effective_date ON agent_schedule_a_versions(effective_date);
CREATE INDEX IF NOT EXISTS idx_agent_schedule_versions_is_active ON agent_schedule_a_versions(is_active);

-- Enable Row Level Security
ALTER TABLE agent_schedule_a_versions ENABLE ROW LEVEL SECURITY;

-- Create policy for authenticated users to read
CREATE POLICY "Allow authenticated users to read schedule versions"
  ON agent_schedule_a_versions
  FOR SELECT
  TO authenticated
  USING (true);

-- Create policy for authenticated users to insert
CREATE POLICY "Allow authenticated users to insert schedule versions"
  ON agent_schedule_a_versions
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Create policy for authenticated users to update
CREATE POLICY "Allow authenticated users to update schedule versions"
  ON agent_schedule_a_versions
  FOR UPDATE
  TO authenticated
  USING (true);

COMMENT ON TABLE agent_schedule_a_versions IS 'Tracks version history of Schedule A terms for individual agents with audit trail';
COMMENT ON COLUMN agent_schedule_a_versions.schedule_a_data IS 'JSONB containing the Schedule A fee structure';
COMMENT ON COLUMN agent_schedule_a_versions.effective_date IS 'Date when these terms become effective';
COMMENT ON COLUMN agent_schedule_a_versions.created_by IS 'Email of admin who created this version';
COMMENT ON COLUMN agent_schedule_a_versions.is_active IS 'Whether this is the currently active version';
