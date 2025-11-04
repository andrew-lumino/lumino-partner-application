-- Update the partner_applications table to ensure all required columns exist
ALTER TABLE partner_applications 
ADD COLUMN IF NOT EXISTS agreement_text TEXT,
ADD COLUMN IF NOT EXISTS custom_schedule_a JSONB,
ADD COLUMN IF NOT EXISTS drivers_license_url TEXT,
ADD COLUMN IF NOT EXISTS voided_check_url TEXT,
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'submitted',
ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Update existing records to have a status if they don't have one
UPDATE partner_applications 
SET status = 'submitted' 
WHERE status IS NULL;

-- Create an index on created_at for better performance
CREATE INDEX IF NOT EXISTS idx_partner_applications_created_at ON partner_applications(created_at);

-- Create an index on status for filtering
CREATE INDEX IF NOT EXISTS idx_partner_applications_status ON partner_applications(status);
