-- =====================================================================
-- 🚀 SOHAIB AGENCY HUB (Engineered by Muhammad Saqib)
-- 🌐 1-CLICK DOMAIN AUTHORIZATION QUERY
-- =====================================================================
-- Run this in Supabase SQL Editor to authorize your domain:
-- =====================================================================

UPDATE public.site_config
SET config = jsonb_set(
  config,
  '{authorizedDomains}',
  COALESCE(config->'authorizedDomains', '["localhost", "127.0.0.1"]'::jsonb) || '["sohaibagencyhub.vercel.app", "localhost", "127.0.0.1"]'::jsonb
)
WHERE id = 'default';

-- Verify:
SELECT 
  id, 
  config->'authorizedDomains' AS authorized_domains,
  updated_at
FROM public.site_config 
WHERE id = 'default';
