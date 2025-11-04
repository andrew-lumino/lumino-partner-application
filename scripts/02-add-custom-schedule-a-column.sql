-- Add custom_schedule_a column to partner_applications table
ALTER TABLE public.partner_applications 
ADD COLUMN IF NOT EXISTS custom_schedule_a JSONB;

-- Add an index on custom_schedule_a for better query performance
CREATE INDEX IF NOT EXISTS idx_partner_applications_custom_schedule_a 
ON public.partner_applications USING GIN (custom_schedule_a);

-- Add a comment to document the column
COMMENT ON COLUMN public.partner_applications.custom_schedule_a IS 'Custom Schedule A terms in JSON format. NULL means default Schedule A is used.';
