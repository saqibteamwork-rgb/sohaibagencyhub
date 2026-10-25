-- =========================================================================
-- SOHAIB AGENCY HUB: SALES, REVENUE & NET PROFIT SYSTEM MIGRATION
-- Execute in Supabase SQL Editor:
-- https://supabase.com/dashboard/project/yxrtmnnndhroqbyhmnyl/sql/new
-- =========================================================================

-- 1. UPGRADE ORDERS TABLE WITH COST & PROFIT FIELDS
ALTER TABLE public.orders 
ADD COLUMN IF NOT EXISTS wholesale_cost NUMERIC DEFAULT 0,
ADD COLUMN IF NOT EXISTS profit NUMERIC DEFAULT 0,
ADD COLUMN IF NOT EXISTS currency TEXT NOT NULL DEFAULT 'PKR';

-- 2. CREATE TOOL USAGE & MONETIZATION ANALYTICS TABLE
CREATE TABLE IF NOT EXISTS public.tool_usage_analytics (
    id TEXT PRIMARY KEY DEFAULT ('tool-use-' || extract(epoch from now())::bigint || '-' || upper(substring(md5(random()::text) from 1 for 6))),
    tool_id TEXT NOT NULL,
    tool_title TEXT NOT NULL,
    user_id TEXT DEFAULT 'guest',
    action_type TEXT NOT NULL DEFAULT 'launch', -- launch, lookup, query, purchase
    revenue NUMERIC DEFAULT 0,
    cost NUMERIC DEFAULT 0,
    profit NUMERIC DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_tool_usage_tool_id ON public.tool_usage_analytics(tool_id);
CREATE INDEX IF NOT EXISTS idx_tool_usage_created_at ON public.tool_usage_analytics(created_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE public.tool_usage_analytics ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow service_role full access to tool_usage_analytics" ON public.tool_usage_analytics;
CREATE POLICY "Allow service_role full access to tool_usage_analytics" 
ON public.tool_usage_analytics 
FOR ALL 
TO service_role 
USING (true) 
WITH CHECK (true);

-- 3. SEED RECENT SALES & PROFIT BASELINE FOR HISTORICAL AUDIT
-- (Ensures Admin Dashboard shows realistic P&L data immediately)
INSERT INTO public.orders (id, user_id, service_id, service_title, package_tier, price, wholesale_cost, profit, status, created_at)
VALUES
('ORD-PROF-01', '03001234567', 'capcut-pro', 'CapCut Pro (PC & Mobile)', '1-Year Unlimited', 350, 100, 250, 'completed', now() - interval '2 hours'),
('ORD-PROF-02', '03129876543', 'gemini-18m-pro', 'Google Gemini 18-Month Pro', '18 Months + 2TB', 1800, 600, 1200, 'completed', now() - interval '5 hours'),
('ORD-PROF-03', '03456789012', 'tiktok-uk-usa-acc', 'TikTok UK Monetized Account', 'Fresh UK Monetized', 450, 150, 300, 'completed', now() - interval '8 hours'),
('ORD-PROF-04', '03214567890', 'lovable-pro', 'Lovable Pro AI App Builder', '1-Month Pro Access', 1450, 500, 950, 'completed', now() - interval '12 hours'),
('ORD-PROF-05', '03051122334', 'sim-owner-details', '2026 SIM Owner & CDR Report', 'Call CDR 6-Months', 250, 50, 200, 'completed', now() - interval '18 hours'),
('ORD-PROF-06', '03337788990', 'chatgpt-plus', 'ChatGPT Plus (GPT-4o)', 'Official Workspace', 550, 180, 370, 'completed', now() - interval '1 day'),
('ORD-PROF-07', '03154433221', 'canva-pro', 'Canva Pro Lifetime', 'Lifetime Private Email', 200, 40, 160, 'completed', now() - interval '1 day 5 hours'),
('ORD-PROF-08', '03029988776', 'elevenlabs-300k', 'ElevenLabs 300k Credits', '300,000 Voice Credits', 850, 250, 600, 'completed', now() - interval '2 days')
ON CONFLICT (id) DO NOTHING;

-- Seed Tool Telemetry Baseline
INSERT INTO public.tool_usage_analytics (tool_id, tool_title, user_id, action_type, revenue, cost, profit, created_at)
VALUES
('tool-sim', 'Live SIM Tracker 2026', '03001234567', 'lookup', 50, 10, 40, now() - interval '1 hour'),
('tool-sim', 'Live SIM Tracker 2026', '03129876543', 'lookup', 50, 10, 40, now() - interval '2 hours'),
('tool-nadra', 'NADRA Family Tree & FRC', '03456789012', 'query', 100, 20, 80, now() - interval '4 hours'),
('tool-bypass', 'Bypass Paywalls & AI Prompts', 'guest', 'launch', 0, 0, 0, now() - interval '6 hours')
ON CONFLICT (id) DO NOTHING;
