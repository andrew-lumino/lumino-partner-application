-- Create partner_invites table for storing invitation templates
CREATE TABLE IF NOT EXISTS public.partner_invites (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT timezone('utc'::text, now()),
  agent_name TEXT NULL,
  agent_email TEXT NULL,
  custom_schedule_a JSONB NULL,
  custom_message JSONB NULL,
  custom_code_of_conduct JSONB NULL,
  created_by TEXT NULL,
  CONSTRAINT partner_invites_pkey PRIMARY KEY (id)
) TABLESPACE pg_default;

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_partner_invites_created_at 
  ON public.partner_invites USING btree (created_at) TABLESPACE pg_default;

CREATE INDEX IF NOT EXISTS idx_partner_invites_agent_email 
  ON public.partner_invites USING btree (agent_email) TABLESPACE pg_default;

CREATE INDEX IF NOT EXISTS idx_partner_invites_custom_schedule_a 
  ON public.partner_invites USING gin (custom_schedule_a) TABLESPACE pg_default;

CREATE INDEX IF NOT EXISTS idx_partner_invites_custom_message 
  ON public.partner_invites USING gin (custom_message) TABLESPACE pg_default;

CREATE INDEX IF NOT EXISTS idx_partner_invites_custom_code_of_conduct 
  ON public.partner_invites USING gin (custom_code_of_conduct) TABLESPACE pg_default;
