-- Create the table for partner applications if it doesn't exist
CREATE TABLE IF NOT EXISTS
  public.partner_applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone ('utc'::TEXT, NOW()) NOT NULL,
    -- Code of Conduct
    code_of_conduct_signature TEXT,
    code_of_conduct_date DATE,
    -- Partner Info
    partner_full_name TEXT,
    partner_email TEXT,
    partner_phone TEXT,
    partner_address TEXT,
    partner_city TEXT,
    partner_state TEXT,
    partner_zip TEXT,
    -- Business Info
    business_name TEXT,
    principal_name TEXT,
    business_address TEXT,
    business_city TEXT,
    business_state TEXT,
    business_zip TEXT,
    business_phone TEXT,
    federal_tax_id TEXT,
    business_type TEXT,
    website_url TEXT,
    -- W9 Info
    w9_name TEXT,
    w9_business_name TEXT,
    w9_tax_classification TEXT,
    w9_llc_classification TEXT,
    w9_other_classification TEXT,
    w9_exempt_payee_code TEXT,
    w9_fatca_code TEXT,
    w9_address TEXT,
    w9_city_state_zip TEXT,
    w9_tin_type TEXT,
    w9_tin TEXT,
    -- Signature
    signature_date DATE,
    signature_full_name TEXT,
    -- File Uploads
    drivers_license_url TEXT,
    voided_check_url TEXT,
    agent TEXT,
    status TEXT DEFAULT 'pending'
  );

-- Update existing records to have a default status
UPDATE public.partner_applications 
SET status = 'submitted' 
WHERE status IS NULL;

-- Create a storage bucket for uploads if it doesn't exist.
-- This bucket is set to public to allow easy access to the uploaded files via their URL.
INSERT INTO
  storage.buckets (id, name, public)
VALUES
  ('partner-uploads', 'partner-uploads', TRUE) ON CONFLICT (id) DO NOTHING;
