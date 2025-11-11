-- Add custom_code_of_conduct column to partner_applications table
ALTER TABLE partner_applications
ADD COLUMN IF NOT EXISTS custom_code_of_conduct JSONB;

-- Add comment to describe the column
COMMENT ON COLUMN partner_applications.custom_code_of_conduct IS 'Custom Partner Code of Conduct sections (array of {id, type, content})';
