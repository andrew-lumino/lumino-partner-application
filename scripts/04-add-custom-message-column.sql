-- Add custom_message column to partner_applications table
-- This column will store custom welcome messages in JSONB format

ALTER TABLE partner_applications 
ADD COLUMN IF NOT EXISTS custom_message JSONB;

-- Add a comment to document the column
COMMENT ON COLUMN partner_applications.custom_message IS 'Stores custom welcome message data with flexible structure for headers and paragraphs';

-- Create an index on custom_message for faster queries (optional but recommended)
CREATE INDEX IF NOT EXISTS idx_partner_applications_custom_message 
ON partner_applications USING GIN (custom_message);

-- Verify the column was added
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'partner_applications' 
AND column_name = 'custom_message';
