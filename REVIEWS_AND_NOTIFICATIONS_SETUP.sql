-- =========================================================================
-- SOHAIB AGENCY HUB: REVIEWS MODERATION & ADMIN NOTIFICATIONS MIGRATION
-- Execute this script directly in your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/yxrtmnnndhroqbyhmnyl/sql/new
-- =========================================================================

-- 1. UPGRADE REVIEWS TABLE TO SUPPORT MODERATION STATUS
-- Add status column if it does not exist (pending, approved, rejected)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'reviews' 
        AND column_name = 'status'
    ) THEN
        ALTER TABLE public.reviews 
        ADD COLUMN status TEXT NOT NULL DEFAULT 'approved' 
        CHECK (status IN ('pending', 'approved', 'rejected'));
    END IF;
END $$;

-- Ensure all existing reviews are marked as 'approved' so they remain visible
UPDATE public.reviews 
SET status = 'approved' 
WHERE status IS NULL OR status = '';

-- Alter default status for all future reviews submitted by users to 'pending'
ALTER TABLE public.reviews 
ALTER COLUMN status SET DEFAULT 'pending';

-- Add index on reviews status and creation date
CREATE INDEX IF NOT EXISTS idx_reviews_status ON public.reviews(status);
CREATE INDEX IF NOT EXISTS idx_reviews_created_at ON public.reviews(created_at DESC);


-- 2. CREATE ADMIN NOTIFICATIONS TABLE
CREATE TABLE IF NOT EXISTS public.admin_notifications (
    id TEXT PRIMARY KEY DEFAULT ('notif-' || extract(epoch from now())::bigint || '-' || upper(substring(md5(random()::text) from 1 for 6))),
    type TEXT NOT NULL CHECK (type IN ('new_review', 'new_order', 'payment_proof', 'contact_inquiry', 'system_alert')),
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    reference_id TEXT DEFAULT '',
    data JSONB DEFAULT '{}'::jsonb,
    is_read BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Indexes for lightning fast notification queries & unread count
CREATE INDEX IF NOT EXISTS idx_admin_notif_unread ON public.admin_notifications(is_read) WHERE is_read = false;
CREATE INDEX IF NOT EXISTS idx_admin_notif_created ON public.admin_notifications(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_admin_notif_type ON public.admin_notifications(type);

-- Enable Row Level Security (RLS)
ALTER TABLE public.admin_notifications ENABLE ROW LEVEL SECURITY;

-- Allow service_role (used by Next.js backend) full access to admin_notifications
DROP POLICY IF EXISTS "Allow service_role full access to admin_notifications" ON public.admin_notifications;
CREATE POLICY "Allow service_role full access to admin_notifications" 
ON public.admin_notifications 
FOR ALL 
TO service_role 
USING (true) 
WITH CHECK (true);
