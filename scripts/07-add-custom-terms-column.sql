-- Add custom_terms column to partner_applications table
ALTER TABLE public.partner_applications 
ADD COLUMN IF NOT EXISTS custom_terms JSONB;

-- Add comment
COMMENT ON COLUMN public.partner_applications.custom_terms IS 'Custom Terms in JSON format with sections array';
