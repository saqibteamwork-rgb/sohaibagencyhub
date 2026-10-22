-- =====================================================================
-- 🚀 MUHAMMAD SAQIB — SAQIB VISUALS HUB
-- 👑 MASTER DATABASE SETUP & MIGRATION SCRIPT (100% PRODUCTION READY)
-- =====================================================================
-- Description: Complete schema, storage buckets, RLS security policies, 
-- performance indexes, seed data for all 32+ services, 7+ web tools, 
-- reviews, admin vault, interactive WhatsApp widget, and 10+ social platforms.
-- Compatible with: Supabase SQL Editor / PostgreSQL 14+ / 15+ / 16+
-- =====================================================================

-- ---------------------------------------------------------------------
-- 1. EXTENSIONS
-- ---------------------------------------------------------------------
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ---------------------------------------------------------------------
-- 2. STORAGE BUCKETS & POLICIES (PAYMENT RECEIPTS & SITE ASSETS)
-- ---------------------------------------------------------------------
INSERT INTO storage.buckets (id, name, public)
VALUES 
  ('payment-proofs', 'payment-proofs', true),
  ('site-assets', 'site-assets', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Storage Policies for 'payment-proofs'
DROP POLICY IF EXISTS "Public Access Payment Proofs" ON storage.objects;
CREATE POLICY "Public Access Payment Proofs"
ON storage.objects FOR SELECT
USING (bucket_id = 'payment-proofs');

DROP POLICY IF EXISTS "Public Upload Payment Proofs" ON storage.objects;
CREATE POLICY "Public Upload Payment Proofs"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'payment-proofs');

-- Storage Policies for 'site-assets'
DROP POLICY IF EXISTS "Public Access Site Assets" ON storage.objects;
CREATE POLICY "Public Access Site Assets"
ON storage.objects FOR SELECT
USING (bucket_id = 'site-assets');

DROP POLICY IF EXISTS "Public Upload Site Assets" ON storage.objects;
CREATE POLICY "Public Upload Site Assets"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'site-assets');

-- ---------------------------------------------------------------------
-- 3. CORE DATABASE TABLES (DDL)
-- ---------------------------------------------------------------------

-- 3.1 SITE CONFIGURATION TABLE
CREATE TABLE IF NOT EXISTS public.site_config (
    id TEXT PRIMARY KEY DEFAULT 'default',
    config JSONB NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 3.2 DIGITAL & AI SERVICES CATALOG TABLE
CREATE TABLE IF NOT EXISTS public.services (
    id TEXT PRIMARY KEY,
    category TEXT NOT NULL,
    badge TEXT NOT NULL DEFAULT 'FEATURED',
    title TEXT NOT NULL,
    "desc" TEXT NOT NULL DEFAULT '',
    plush TEXT NOT NULL DEFAULT 'plush-srv-1',
    orb_grad TEXT NOT NULL DEFAULT 'from-pink-500 to-rose-600',
    icon_type TEXT NOT NULL DEFAULT 'wand',
    custom_icon_url TEXT,
    direct_tool_url TEXT,
    input_label TEXT NOT NULL DEFAULT 'Your Requirement',
    placeholder TEXT NOT NULL DEFAULT 'Enter details...',
    tiers JSONB NOT NULL DEFAULT '[]'::jsonb,
    hidden BOOLEAN NOT NULL DEFAULT false,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 3.3 LIVE ONLINE WEB TOOLS TABLE
CREATE TABLE IF NOT EXISTS public.web_tools (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    "desc" TEXT NOT NULL DEFAULT '',
    tool_url TEXT NOT NULL,
    icon_url TEXT,
    badge TEXT NOT NULL DEFAULT 'ONLINE',
    button_label TEXT NOT NULL DEFAULT 'Open Live Tool',
    icon_type TEXT NOT NULL DEFAULT 'wand',
    orb_grad TEXT NOT NULL DEFAULT 'from-indigo-600 to-purple-600',
    plush TEXT NOT NULL DEFAULT 'plush-website',
    open_mode TEXT NOT NULL DEFAULT 'new_tab',
    hidden BOOLEAN NOT NULL DEFAULT false,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 3.4 USER PROFILES & VIP WALLETS TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
    id TEXT PRIMARY KEY, -- Mobile Number or Email or UUID
    full_name TEXT NOT NULL DEFAULT 'VIP Member',
    email TEXT,
    phone TEXT,
    password_hash TEXT,
    role TEXT NOT NULL DEFAULT 'member', -- member, reseller, admin
    balance NUMERIC NOT NULL DEFAULT 0 CHECK (balance >= 0),
    status TEXT NOT NULL DEFAULT 'active', -- active, banned
    ban_reason TEXT DEFAULT '',
    last_login_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);
ALTER TABLE IF EXISTS public.profiles ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'active';
ALTER TABLE IF EXISTS public.profiles ADD COLUMN IF NOT EXISTS ban_reason TEXT DEFAULT '';
ALTER TABLE IF EXISTS public.profiles ADD COLUMN IF NOT EXISTS last_login_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now());

-- 3.5 ORDERS TABLE
CREATE TABLE IF NOT EXISTS public.orders (
    id TEXT PRIMARY KEY DEFAULT ('ORD-' || upper(substring(md5(random()::text) from 1 for 8))),
    user_id TEXT NOT NULL,
    service_id TEXT NOT NULL,
    service_title TEXT NOT NULL,
    package_tier TEXT NOT NULL,
    price NUMERIC NOT NULL DEFAULT 0,
    user_input TEXT NOT NULL DEFAULT '',
    status TEXT NOT NULL DEFAULT 'pending', -- pending, processing, completed, cancelled
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 3.6 PAYMENT PROOFS & MANUAL DEPOSITS TABLE
CREATE TABLE IF NOT EXISTS public.payment_proofs (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    amount NUMERIC NOT NULL CHECK (amount > 0),
    method TEXT NOT NULL,
    sender_account_name TEXT NOT NULL DEFAULT '',
    sender_account_number TEXT NOT NULL DEFAULT '',
    trx_id TEXT NOT NULL DEFAULT '',
    screenshot_url TEXT NOT NULL DEFAULT '',
    status TEXT NOT NULL DEFAULT 'pending', -- pending, approved, rejected
    user_note TEXT DEFAULT '',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    reviewed_at TIMESTAMPTZ
);

-- 3.7 CONTACT INQUIRIES & SUPPORT TICKETS TABLE
CREATE TABLE IF NOT EXISTS public.contact_inquiries (
    id TEXT PRIMARY KEY DEFAULT ('TKT-' || upper(substring(md5(random()::text) from 1 for 8))),
    name TEXT NOT NULL,
    phone TEXT NOT NULL DEFAULT '',
    department TEXT NOT NULL DEFAULT 'General Support',
    priority TEXT NOT NULL DEFAULT 'Normal',
    message TEXT NOT NULL DEFAULT '',
    status TEXT NOT NULL DEFAULT 'open', -- open, resolved, closed
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 3.8 VERIFIED CUSTOMER REVIEWS & TESTIMONIALS TABLE
CREATE TABLE IF NOT EXISTS public.reviews (
    id TEXT PRIMARY KEY DEFAULT ('REV-' || upper(substring(md5(random()::text) from 1 for 8))),
    name TEXT NOT NULL,
    service TEXT NOT NULL DEFAULT 'Digital Service',
    rating INTEGER NOT NULL DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
    comment TEXT NOT NULL,
    verified BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 3.9 ADMIN SECURITY VAULT TABLE (PBKDF2 SHA-512 + RBAC MULTI-ADMIN PROTECTED)
CREATE TABLE IF NOT EXISTS public.admin_vault (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    salt TEXT NOT NULL,
    iterations INTEGER NOT NULL DEFAULT 100000,
    algorithm TEXT NOT NULL DEFAULT 'sha512',
    role TEXT NOT NULL DEFAULT 'subadmin',
    permissions JSONB NOT NULL DEFAULT '{"manage_services":true,"manage_tools":true,"manage_orders":true,"manage_users":false,"view_telemetry":false,"manage_site_config":false,"manage_admins":false}'::jsonb,
    token_version INTEGER NOT NULL DEFAULT 1,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_by TEXT DEFAULT 'superadmin',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);
ALTER TABLE IF EXISTS public.admin_vault
  ADD COLUMN IF NOT EXISTS role TEXT NOT NULL DEFAULT 'subadmin',
  ADD COLUMN IF NOT EXISTS permissions JSONB NOT NULL DEFAULT '{"manage_services":true,"manage_tools":true,"manage_orders":true,"manage_users":false,"view_telemetry":false,"manage_site_config":false,"manage_admins":false}'::jsonb,
  ADD COLUMN IF NOT EXISTS token_version INTEGER NOT NULL DEFAULT 1,
  ADD COLUMN IF NOT EXISTS is_active BOOLEAN NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS created_by TEXT DEFAULT 'superadmin';

-- 3.10 SECURITY LOCKOUTS & BRUTE FORCE DEFENSE TABLE
CREATE TABLE IF NOT EXISTS public.security_lockouts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    identifier TEXT NOT NULL UNIQUE,
    failed_attempts INTEGER DEFAULT 1,
    locked_until TIMESTAMPTZ,
    last_attempt_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()),
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
);

-- 3.11 VISITOR FINGERPRINTS & DEVICE TELEMETRY TABLE
CREATE TABLE IF NOT EXISTS public.visitor_fingerprints (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    fingerprint TEXT NOT NULL UNIQUE,
    ip_address TEXT DEFAULT '127.0.0.1',
    country TEXT DEFAULT 'Pakistan',
    city TEXT DEFAULT '',
    device_type TEXT DEFAULT 'Desktop',
    os TEXT DEFAULT 'Unknown',
    browser TEXT DEFAULT 'Unknown',
    battery_level TEXT DEFAULT 'N/A',
    battery_raw INTEGER DEFAULT -1,
    battery_charging BOOLEAN DEFAULT false,
    screen_resolution TEXT DEFAULT '',
    hardware_specs TEXT DEFAULT '',
    language TEXT DEFAULT 'en',
    last_path TEXT DEFAULT '/',
    total_visits INTEGER DEFAULT 1,
    first_seen TIMESTAMPTZ DEFAULT timezone('utc'::text, now()),
    last_seen TIMESTAMPTZ DEFAULT timezone('utc'::text, now()),
    user_agent TEXT DEFAULT ''
);
CREATE INDEX IF NOT EXISTS idx_visitor_fp_fingerprint ON public.visitor_fingerprints (fingerprint);
CREATE INDEX IF NOT EXISTS idx_visitor_fp_ip ON public.visitor_fingerprints (ip_address);
CREATE INDEX IF NOT EXISTS idx_visitor_fp_last_seen ON public.visitor_fingerprints (last_seen DESC);

-- 3.12 COUPONS & PROMO DISCOUNTS TABLE
CREATE TABLE IF NOT EXISTS public.coupons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code TEXT UNIQUE NOT NULL,
    discount_type TEXT NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
    discount_value NUMERIC NOT NULL,
    max_discount_amount NUMERIC,
    min_order_amount NUMERIC DEFAULT 0,
    max_uses INTEGER,
    used_count INTEGER DEFAULT 0,
    expires_at TIMESTAMPTZ,
    is_active BOOLEAN NOT NULL DEFAULT true,
    applicable_category TEXT DEFAULT 'all',
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);
CREATE INDEX IF NOT EXISTS idx_coupons_code ON public.coupons (code);
CREATE INDEX IF NOT EXISTS idx_coupons_active ON public.coupons (is_active);

-- ---------------------------------------------------------------------
-- 4. AUTO-UPDATE TIMESTAMPS TRIGGER & TABLE SCHEMA UPGRADES
-- ---------------------------------------------------------------------
-- Ensure updated_at and legacy columns exist on all existing databases:
ALTER TABLE IF EXISTS public.site_config ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now());
ALTER TABLE IF EXISTS public.services ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now());
ALTER TABLE IF EXISTS public.web_tools ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now());
ALTER TABLE IF EXISTS public.profiles ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now());
ALTER TABLE IF EXISTS public.orders ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now());
ALTER TABLE IF EXISTS public.payment_proofs ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now());
ALTER TABLE IF EXISTS public.contact_inquiries ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now());
ALTER TABLE IF EXISTS public.reviews ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now());
ALTER TABLE IF EXISTS public.admin_vault ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now());
ALTER TABLE IF EXISTS public.coupons ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now());

-- Ensure other commonly missing columns from older schema versions exist:
ALTER TABLE IF EXISTS public.services ADD COLUMN IF NOT EXISTS custom_icon_url TEXT;
ALTER TABLE IF EXISTS public.services ADD COLUMN IF NOT EXISTS direct_tool_url TEXT;
ALTER TABLE IF EXISTS public.services ADD COLUMN IF NOT EXISTS input_label TEXT NOT NULL DEFAULT 'Your Requirement';
ALTER TABLE IF EXISTS public.services ADD COLUMN IF NOT EXISTS placeholder TEXT NOT NULL DEFAULT 'Enter details...';
ALTER TABLE IF EXISTS public.services ADD COLUMN IF NOT EXISTS tiers JSONB NOT NULL DEFAULT '[]'::jsonb;
ALTER TABLE IF EXISTS public.services ADD COLUMN IF NOT EXISTS hidden BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE IF EXISTS public.services ADD COLUMN IF NOT EXISTS sort_order INTEGER NOT NULL DEFAULT 0;
ALTER TABLE IF EXISTS public.services ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now());

ALTER TABLE IF EXISTS public.web_tools ADD COLUMN IF NOT EXISTS button_label TEXT NOT NULL DEFAULT 'Open Live Tool';
ALTER TABLE IF EXISTS public.web_tools ADD COLUMN IF NOT EXISTS open_mode TEXT NOT NULL DEFAULT 'new_tab';
ALTER TABLE IF EXISTS public.web_tools ADD COLUMN IF NOT EXISTS hidden BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE IF EXISTS public.web_tools ADD COLUMN IF NOT EXISTS sort_order INTEGER NOT NULL DEFAULT 0;
ALTER TABLE IF EXISTS public.web_tools ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now());

CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  BEGIN
    NEW.updated_at = timezone('utc'::text, now());
  EXCEPTION
    WHEN undefined_column THEN
      -- If the table lacks updated_at, safely continue without crashing
      NULL;
    WHEN OTHERS THEN
      NULL;
  END;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_timestamp_services ON public.services;
CREATE TRIGGER set_timestamp_services
BEFORE UPDATE ON public.services
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_timestamp_web_tools ON public.web_tools;
CREATE TRIGGER set_timestamp_web_tools
BEFORE UPDATE ON public.web_tools
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_timestamp_profiles ON public.profiles;
CREATE TRIGGER set_timestamp_profiles
BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_timestamp_orders ON public.orders;
CREATE TRIGGER set_timestamp_orders
BEFORE UPDATE ON public.orders
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_timestamp_site_config ON public.site_config;
CREATE TRIGGER set_timestamp_site_config
BEFORE UPDATE ON public.site_config
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ---------------------------------------------------------------------
-- 5. ULTRA-FAST PERFORMANCE INDEXES
-- ---------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_profiles_status ON public.profiles (status);
CREATE INDEX IF NOT EXISTS idx_profiles_last_login ON public.profiles (last_login_at DESC);
CREATE INDEX IF NOT EXISTS idx_services_category_hidden ON public.services(category, hidden, sort_order);
CREATE INDEX IF NOT EXISTS idx_services_sort ON public.services(sort_order);
CREATE INDEX IF NOT EXISTS idx_web_tools_hidden_sort ON public.web_tools(hidden, sort_order);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON public.orders(user_id, status);
CREATE INDEX IF NOT EXISTS idx_orders_created ON public.orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_payment_proofs_user_status ON public.payment_proofs(user_id, status);
CREATE INDEX IF NOT EXISTS idx_payment_proofs_created ON public.payment_proofs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_reviews_verified_created ON public.reviews(verified, created_at DESC);

-- ---------------------------------------------------------------------
-- 6. ROW LEVEL SECURITY (RLS) POLICIES — PRODUCTION HARDENED
-- ---------------------------------------------------------------------
ALTER TABLE public.site_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.web_tools ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_proofs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_vault ENABLE ROW LEVEL SECURITY;

-- Drop obsolete policies to prevent duplication
DROP POLICY IF EXISTS "Public Read Services" ON public.services;
DROP POLICY IF EXISTS "Public Read Web Tools" ON public.web_tools;
DROP POLICY IF EXISTS "Public Read Site Config" ON public.site_config;
DROP POLICY IF EXISTS "Public Read Approved Reviews" ON public.reviews;
DROP POLICY IF EXISTS "Public Insert Reviews" ON public.reviews;
DROP POLICY IF EXISTS "Public Insert Orders" ON public.orders;
DROP POLICY IF EXISTS "Users Read Own Orders" ON public.orders;
DROP POLICY IF EXISTS "Public Insert Payment Proofs" ON public.payment_proofs;
DROP POLICY IF EXISTS "Users Read Own Payment Proofs" ON public.payment_proofs;
DROP POLICY IF EXISTS "Public Insert Contact Inquiries" ON public.contact_inquiries;
DROP POLICY IF EXISTS "Users Read Own Profile" ON public.profiles;
DROP POLICY IF EXISTS "Users Insert Own Profile" ON public.profiles;
DROP POLICY IF EXISTS "No Direct Public Access to Admin Vault" ON public.admin_vault;

-- 6.1 Public Read Store Data
CREATE POLICY "Public Read Services" ON public.services FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Public Read Web Tools" ON public.web_tools FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Public Read Site Config" ON public.site_config FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "Allow All For Service Role and Admins" ON public.site_config;
CREATE POLICY "Allow All For Service Role and Admins" ON public.site_config FOR ALL TO anon, authenticated, service_role USING (true) WITH CHECK (true);
GRANT ALL ON public.site_config TO anon, authenticated, service_role;
CREATE POLICY "Public Read Approved Reviews" ON public.reviews FOR SELECT TO anon, authenticated USING (verified = true);
CREATE POLICY "Public Insert Reviews" ON public.reviews FOR INSERT TO anon, authenticated WITH CHECK (true);

-- 6.2 Public Insert Orders & Proofs
CREATE POLICY "Public Insert Orders" ON public.orders FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Users Read Own Orders" ON public.orders FOR SELECT TO anon, authenticated USING (
  user_id = coalesce(auth.uid()::text, '') OR user_id = current_setting('request.jwt.claim.sub', true)
);

CREATE POLICY "Public Insert Payment Proofs" ON public.payment_proofs FOR INSERT TO anon, authenticated WITH CHECK (status = 'pending');
CREATE POLICY "Users Read Own Payment Proofs" ON public.payment_proofs FOR SELECT TO anon, authenticated USING (
  user_id = coalesce(auth.uid()::text, '') OR user_id = current_setting('request.jwt.claim.sub', true)
);

CREATE POLICY "Public Insert Contact Inquiries" ON public.contact_inquiries FOR INSERT TO anon, authenticated WITH CHECK (true);

-- 6.3 Profile RLS
CREATE POLICY "Users Read Own Profile" ON public.profiles FOR SELECT TO anon, authenticated USING (
  id = coalesce(auth.uid()::text, '') OR id = current_setting('request.jwt.claim.sub', true)
);
CREATE POLICY "Users Insert Own Profile" ON public.profiles FOR INSERT TO anon, authenticated WITH CHECK (
  id = coalesce(auth.uid()::text, '') OR id = current_setting('request.jwt.claim.sub', true)
);

-- 6.4 Admin Security Vault — ZERO Public / Client Access
CREATE POLICY "No Direct Public Access to Admin Vault" ON public.admin_vault FOR ALL TO anon, authenticated USING (false);
ALTER TABLE public.security_lockouts ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "No Public Access to Lockouts" ON public.security_lockouts;
CREATE POLICY "No Public Access to Lockouts" ON public.security_lockouts FOR ALL TO anon, authenticated USING (false);
ALTER TABLE public.visitor_fingerprints ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow Public Insert Visitor Telemetry" ON public.visitor_fingerprints;
CREATE POLICY "Allow Public Insert Visitor Telemetry" ON public.visitor_fingerprints FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "Allow Public Update Visitor Telemetry" ON public.visitor_fingerprints;
CREATE POLICY "Allow Public Update Visitor Telemetry" ON public.visitor_fingerprints FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "Deny Public Select Direct Telemetry" ON public.visitor_fingerprints;
CREATE POLICY "Deny Public Select Direct Telemetry" ON public.visitor_fingerprints FOR SELECT TO anon, authenticated USING (false);
GRANT ALL ON public.visitor_fingerprints TO service_role;

-- Coupons RLS
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public can view active coupons" ON public.coupons;
CREATE POLICY "Public can view active coupons" ON public.coupons FOR SELECT TO anon, authenticated USING (is_active = true);
DROP POLICY IF EXISTS "Service role full access to coupons" ON public.coupons;
CREATE POLICY "Service role full access to coupons" ON public.coupons FOR ALL TO service_role USING (true) WITH CHECK (true);


-- Grant privileges
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
GRANT SELECT ON public.services, public.web_tools, public.site_config, public.reviews TO anon, authenticated;
GRANT INSERT ON public.orders, public.payment_proofs, public.contact_inquiries, public.reviews TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO service_role;

-- ---------------------------------------------------------------------
-- 7. SEED DATA: COMPLETE SITE CONFIGURATION
-- (Includes WhatsApp Popup Widget, 10+ Social Platforms, All Payment Methods, Categories & SEO)
-- ---------------------------------------------------------------------
INSERT INTO public.site_config (id, config, updated_at)
VALUES (
  'default',
  '{
  "seo": {
    "author": "Sohaib Agency",
    "ogType": "website",
    "ogTitle": "Muhammad Saqib — Saqib Visuals | AI Accounts & SMM Services",
    "keywords": "Muhammad Saqib, Saqib Visuals, CapCut Pro Pakistan, SMM Panel Pakistan, Lovable Pro Account, Gemini 18M Pro, ChatGPT Plus & Claude, Pak SIM Database Live, SIM Tracker 2026, NADRA Verification FRC, TikTok Agency Accounts UK USA, Fast USDT EasyPaisa Delivery",
    "metaTitle": "Muhammad Saqib — Saqib Visuals | AI Accounts, SMM & Digital Services",
    "ogImageUrl": "https://ik.imagekit.io/mrsaqib/mrsaqib242-img25_7oG52NZUY.png",
    "schemaType": "WebApplication",
    "robotsIndex": true,
    "twitterCard": "summary_large_image",
    "canonicalUrl": "https://sohaibagencyhub.vercel.app",
    "robotsFollow": true,
    "ogDescription": "Instant CapCut Pro, Lovable Pro, Gemini 18M, ChatGPT Plus, TikTok UK/USA Agency Accounts, Franchise SIM Records & SMM Services by Muhammad Saqib.",
    "twitterCreator": "@mrsaqib242",
    "metaDescription": "Instant CapCut Pro, Lovable Pro, Gemini 18M, ChatGPT Plus, TikTok UK/USA Agency Accounts, Franchise SIM Records & SMM Services by Muhammad Saqib."
  },
  "banner": {
    "badgeText": "🔥 ALL DIGITAL, AI, SMM & NADRA SERVICES LIVE 24/7 (VERIFIED ACTIVE)",
    "mainTitle": "Sohaib ",
    "description": "Get Instant CapCut Pro, Lovable Pro, Gemini 18M, ChatGPT, Claude, Muse AI 1B & ElevenLabs, TikTok UK/USA & Ad Agency Accounts, Franchise SIM/CDR/IMEI Tracking, NADRA FRC/Passport Records & USDT/Video/Graphics!",
    "portraitUrl": "https://ik.imagekit.io/mrsaqib/mrsaqib242-img25_7oG52NZUY.png",
    "showTopStrip": true,
    "showBadgeText": true,
    "showMainTitle": true,
    "topStripTitle": "SOHAIB AGENCY • OFFICIAL HUB",
    "highlightTitle": "Agency Hub",
    "orbitBadge1Sub": "PRO UNLOCKED",
    "orbitBadge2Sub": "GEMINI • CLAUDE",
    "orbitBadge3Sub": "ADS & BOOST",
    "orbitBadge4Sub": "CDR • FRC • LIVE",
    "showHeroBanner": true,
    "showDescription": true,
    "orbitBadge1Title": "CapCut & Lovable",
    "orbitBadge2Title": "AI Suite",
    "orbitBadge3Title": "TikTok UK/USA",
    "orbitBadge4Title": "SIM & NADRA",
    "rgbBorderEnabled": true,
    "showPortraitPhoto": true,
    "orbitBadge1Enabled": true,
    "orbitBadge2Enabled": true,
    "orbitBadge3Enabled": true,
    "orbitBadge4Enabled": true,
    "showHeroFeaturePills": true,
    "showTopStripWhatsapp": true,
    "showPortraitOrbitBadges": true
  },
  "footer": {
    "brandName": "🚀 Sohaib Agency Hub",
    "showQuickLinks": true,
    "copyrightTagline": "24/7 Instant Delivery • 100% Full Replacement Warranty"
  },
  "contact": {
    "supportEmail": "support@saqibvisuals.com",
    "officialWebsiteUrl": "https://sohaibagencyhub.vercel.app",
    "whatsappWidgetName": "Muhammad Saqib",
    "whatsappNumberClean": "923478936242",
    "officialWebsiteLabel": "sohaibagencyhub.vercel.app",
    "whatsappWidgetAvatar": "https://sohaibagencyhub.vercel.app/saqib-pic.png",
    "whatsappNumberDisplay": "+92 347 8936242",
    "whatsappDefaultMessage": "Assalam-o-Alaikum Muhammad Saqib! Mujhe apki services chahiye.",
    "whatsappWidgetGreeting": "Assalam-o-Alaikum! 👋 Welcome to Sohaib Agency Hub.<br/>How can I help you today with CapCut Pro, AI Tools, TikTok Ads or Nadra services?"
  },
  "socials": {
    "platforms": [
      {
        "id": "instagram",
        "url": "https://instagram.com/mrsaqib242",
        "icon": "fa-brands fa-instagram",
        "label": "Instagram",
        "handle": "@mrsaqib242",
        "enabled": true,
        "platform": "instagram",
        "colorGrad": "from-amber-300 via-pink-500 to-purple-600"
      },
      {
        "id": "tiktok",
        "url": "https://tiktok.com/@mrsaqib242",
        "icon": "fa-brands fa-tiktok",
        "label": "TikTok",
        "handle": "@mrsaqib242",
        "enabled": true,
        "platform": "tiktok",
        "colorGrad": "from-slate-900 to-slate-800"
      },
      {
        "id": "facebook",
        "url": "https://facebook.com/mrsaqib242",
        "icon": "fa-brands fa-facebook-f",
        "label": "Facebook",
        "handle": "Muhammad Saqib",
        "enabled": true,
        "platform": "facebook",
        "colorGrad": "from-blue-600 to-indigo-600"
      },
      {
        "id": "snapchat",
        "url": "https://snapchat.com/add/mrsaqib242",
        "icon": "fa-brands fa-snapchat",
        "label": "Snapchat",
        "handle": "mrsaqib242",
        "enabled": true,
        "platform": "snapchat",
        "colorGrad": "from-amber-400 to-yellow-500"
      },
      {
        "id": "youtube",
        "url": "https://youtube.com/mrsaqib242",
        "icon": "fa-brands fa-youtube",
        "label": "YouTube",
        "handle": "@saqibvisuals",
        "enabled": true,
        "platform": "youtube",
        "colorGrad": "from-red-500 to-rose-600"
      },
      {
        "id": "telegram",
        "url": "https://t.me/mrsaqib242",
        "icon": "fa-brands fa-telegram",
        "label": "Telegram",
        "handle": "@mrsaqib242",
        "enabled": true,
        "platform": "telegram",
        "colorGrad": "from-sky-400 to-blue-500"
      },
      {
        "id": "whatsapp_channel",
        "url": "https://whatsapp.com/channel/saqibvisuals",
        "icon": "fa-brands fa-whatsapp",
        "label": "WhatsApp Channel",
        "handle": "Saqib Visuals VIP",
        "enabled": true,
        "platform": "whatsapp_channel",
        "colorGrad": "from-emerald-500 to-teal-600"
      },
      {
        "id": "github",
        "url": "https://github.com/mrsaqib242",
        "icon": "fa-brands fa-github",
        "label": "GitHub",
        "handle": "@mrsaqib242",
        "enabled": false,
        "platform": "github",
        "colorGrad": "from-slate-800 to-slate-950"
      },
      {
        "id": "twitter",
        "url": "https://x.com/mrsaqib242",
        "icon": "fa-brands fa-x-twitter",
        "label": "X (Twitter)",
        "handle": "@mrsaqib242",
        "enabled": false,
        "platform": "twitter",
        "colorGrad": "from-zinc-800 to-black"
      },
      {
        "id": "discord",
        "url": "https://discord.gg/saqibvisuals",
        "icon": "fa-brands fa-discord",
        "label": "Discord Server",
        "handle": "Saqib Community",
        "enabled": false,
        "platform": "discord",
        "colorGrad": "from-indigo-500 to-purple-600"
      }
    ],
    "tiktokUrl": "https://tiktok.com/",
    "facebookUrl": "https://facebook.com/",
    "snapchatUrl": "https://snapchat.com/",
    "facebookName": "Muhammad Saqib",
    "instagramUrl": "https://instagram.com/",
    "tiktokHandle": "@mrsaqib242",
    "snapchatHandle": "mrsaqib242",
    "instagramHandle": "@mrsaqib242"
  },
  "branding": {
    "brandName": "Sohaib Agency Hub"
  },
  "storeBars": {
    "chip1Label": "AI Pro Server:",
    "chip1Value": "3 Min Avg",
    "chip2Label": "SMM Turbo API:",
    "chip2Value": "Instant Start",
    "chip3Label": "2026 SIM/NADRA Desk:",
    "chip3Value": "15 Min PDF",
    "showMarquee": true,
    "chip1Enabled": true,
    "chip2Enabled": true,
    "chip3Enabled": true,
    "showSearchBox": true,
    "showWalletBar": true,
    "currencyPrefix": "Rs.",
    "showHistoryBtn": true,
    "historyBtnLabel": "History",
    "hotSearchesList": "CapCut Pro, Lovable Pro, Gemini 18M, Muse AI 1B, ElevenLabs 300k, TikTok UK/USA, Ad Agency, Call CDR, NADRA FRC, Hostinger 12M, BTC / USDT",
    "showHotSearches": true,
    "minDepositAmount": 50,
    "showCategoryTabs": true,
    "statusPanelBadge": "ALL 3 SERVERS 99.9% ONLINE",
    "statusPanelTitle": "SOHAIB AGENCY LIVE PANEL STATUS:",
    "depositModalTitle": "Add Funds / Top-Up Wallet Balance",
    "searchPlaceholder": "Search any service (e.g. Lovable Pro, Gemini 18M, ElevenLabs, CDR, NADRA, Hostinger, USDT)...",
    "showAddPaymentBtn": true,
    "addPaymentBtnLabel": "+ Add Payment / Balance",
    "headerPillAddLabel": "+Add",
    "showStatusPulseBar": true,
    "walletBalanceLabel": "● LIVE ACCOUNT BALANCE:",
    "depositModalSubtitle": "Enter Amount → Select EasyPaisa/JazzCash → Submit Account Name & Screenshot",
    "showHeaderWalletPill": true,
    "acceptedGatewaysTitle": "Accepted Payment Gateways",
    "showPendingProofBadge": true,
    "showWalletInstruction": true,
    "walletInstructionText": "Add balance via EasyPaisa / JazzCash / Bank (Enter Amount → Select Method → Upload SS → Instant Balance!)",
    "showServicesCountBadge": true,
    "acceptedGatewaysSubtitle": "100% Secure Local & Crypto Verification",
    "showAcceptedGatewaysCard": true,
    "showAccountNumbersInCard": true,
    "showGatewaysWhatsappButton": true
  },
  "categories": [
    {
      "id": "all",
      "label": "All Services",
      "iconType": "layer-group",
      "iconClass": "fa-solid fa-layer-group",
      "iconColor": "text-pink-500",
      "shortLabel": "All"
    },
    {
      "id": "capcut_ai",
      "label": "AI, Pro Apps & Hosting",
      "iconType": "gemini",
      "iconClass": "fa-solid fa-wand-magic-sparkles",
      "iconColor": "text-purple-600",
      "shortLabel": "AI & Pro Apps"
    },
    {
      "id": "tiktok_fb",
      "label": "Social Media & Ad Agency",
      "iconType": "tiktok",
      "iconClass": "fa-brands fa-tiktok",
      "iconColor": "text-rose-500",
      "shortLabel": "SMM & Ads"
    },
    {
      "id": "franchise_sim",
      "label": "Franchise & SIM Services",
      "iconType": "satellite",
      "iconClass": "fa-solid fa-satellite-dish",
      "iconColor": "text-emerald-600",
      "shortLabel": "Franchise & SIM"
    },
    {
      "id": "nadra_records",
      "label": "NADRA & Official Records",
      "iconType": "id-card",
      "iconClass": "fa-solid fa-id-card",
      "iconColor": "text-blue-600",
      "shortLabel": "NADRA & Records"
    },
    {
      "id": "creative_crypto",
      "label": "Editing, Design & Crypto",
      "iconType": "binance",
      "iconClass": "fa-solid fa-palette",
      "iconColor": "text-amber-500",
      "shortLabel": "Creative & Crypto"
    }
  ],
  "visibility": {
    "showFaqsTab": true,
    "showAboutTab": true,
    "showLoginTab": true,
    "showToolsTab": true,
    "showContactTab": true,
    "showPromoBanners": true,
    "showMarqueeBanner": true,
    "showMobileQuickBar": true,
    "showReviewsSection": true,
    "showStoreWalletBar": true,
    "showHeaderRgbToggle": true,
    "showWebToolsOnStore": true,
    "showFloatingWhatsApp": true,
    "showHeaderCartButton": true,
    "showHeaderWalletPill": true,
    "showHeroFeaturePills": true,
    "showMobileBottomDock": true,
    "showFloatingScrollTop": true,
    "showSimDatabaseTracker": true,
    "showPortraitOrbitBadges": true,
    "showSearchAndCategoryBar": true
  },
  "promoBanners": [
    {
      "id": "promo-deal-1",
      "style": "rose",
      "title": "Need Custom AI Credits, Ad Agency Accounts, NADRA/CDR Info, or USDT?",
      "enabled": true,
      "position": "below_services",
      "badgeIcon": "fa-solid fa-bolt",
      "badgeText": "ALL SERVICES AVAILABLE HERE",
      "description": "Message Muhammad Saqib directly on WhatsApp (+92 347 8936242) for wholesale reseller rates, JazzCash / EasyPaisa payment, and instant delivery.",
      "primaryBtnIcon": "fa-brands fa-whatsapp",
      "primaryBtnText": "Deal on WhatsApp",
      "primaryBtnAction": "whatsapp",
      "secondaryBtnIcon": "fa-solid fa-screwdriver-wrench",
      "secondaryBtnText": "Open Web Tools Hub",
      "primaryBtnEnabled": true,
      "secondaryBtnAction": "webtools",
      "secondaryBtnEnabled": true
    }
  ],
  "paymentMethods": [
    {
      "id": "EasyPaisa",
      "grad": "from-emerald-500 to-green-600",
      "icon": "fa-solid fa-mobile-screen-button",
      "label": "EasyPaisa Mobile Account",
      "badgeBg": "bg-emerald-100 text-emerald-800 border-emerald-300",
      "enabled": true,
      "shortTag": "⚡ Instant Auto-Verify",
      "extraInfo": "Send via EasyPaisa App or *786# and take screenshot",
      "accountTitle": "Muhammad Saqib",
      "accountNumber": "0347-8936242"
    },
    {
      "id": "JazzCash",
      "grad": "from-rose-500 to-red-600",
      "icon": "fa-solid fa-wallet",
      "label": "JazzCash Mobile Account",
      "badgeBg": "bg-rose-100 text-rose-800 border-rose-300",
      "enabled": true,
      "shortTag": "🔥 Fast Approval",
      "extraInfo": "Send via JazzCash App or Raast ID (03478936242)",
      "accountTitle": "Muhammad Saqib",
      "accountNumber": "0347-8936242"
    },
    {
      "id": "SadaPay / Bank",
      "grad": "from-teal-500 to-cyan-600",
      "icon": "fa-solid fa-building-columns",
      "label": "SadaPay / NayaPay / Raast IBFT",
      "badgeBg": "bg-cyan-100 text-cyan-800 border-cyan-300",
      "enabled": true,
      "shortTag": "🏦 0% Fee Raast",
      "extraInfo": "Transfer from any Bank App via Raast / SadaPay / NayaPay",
      "accountTitle": "Muhammad Saqib",
      "accountNumber": "0347-8936242"
    },
    {
      "id": "Binance / USDT",
      "grad": "from-amber-500 to-orange-600",
      "icon": "fa-brands fa-bitcoin",
      "label": "Binance Pay / USDT (TRC20)",
      "badgeBg": "bg-amber-100 text-amber-800 border-amber-300",
      "enabled": true,
      "shortTag": "💲 Crypto Top-Up",
      "extraInfo": "Send USDT via Binance Pay UID or TRC20 & upload receipt SS",
      "accountTitle": "Sohaib Agency Official",
      "accountNumber": "WhatsApp +92 347 8936242 (Ask UID)"
    }
  ],
  "authorizedDomains": [
    "localhost",
    "127.0.0.1",
    "sohaibagencyhub.vercel.app",
    "sohaibagencyhub.vercel.app",
    "mrsaqib242.vercel.app"
  ]
}'::jsonb,
  timezone('utc'::text, now())
)
ON CONFLICT (id) DO UPDATE SET
  config = EXCLUDED.config,
  updated_at = timezone('utc'::text, now());

-- ---------------------------------------------------------------------
-- 8. SEED DATA: ALL 32+ DIGITAL & PRO SERVICES
-- ---------------------------------------------------------------------
INSERT INTO public.services (
  id, category, badge, title, "desc", plush, orb_grad, icon_type, custom_icon_url, direct_tool_url, input_label, placeholder, tiers, hidden, sort_order
)
VALUES
('capcut-pro', 'capcut_ai', '🎬 #1 CREATOR APP', 'CapCut Pro Official (iOS / Android / PC)', 'Unlock all Pro effects, auto-captions, 4K 60fps export, AI background remover & 100GB cloud storage.', 'plush-capcut', 'from-slate-800 via-indigo-900 to-black', 'capcut', NULL, NULL, 'Enter Your WhatsApp Number or Email:', '0300-1234567 or email@gmail.com', '["CapCut Pro 1 Month (Full Warranty) — Rs. 350","CapCut Pro 1 Month Private Account — Rs. 650","CapCut Pro 6 Months Premium — Rs. 1,500","CapCut Pro 1 Year Full Warranty — Rs. 2,500"]'::jsonb, false, 1),
('remini-ai-pro', 'capcut_ai', '📸 ULTRA HD 4K', 'Remini AI Pro (Web / Android / iOS)', 'Enhance old, blurry, pixelated photos to crystal-clear 4K Ultra HD. AI Face Restoration, Video Unblur & Unlimited Exports.', 'plush-snap', 'from-rose-500 via-red-600 to-amber-600', 'wand', NULL, NULL, 'Enter Your Email or WhatsApp Number:', '0300-1234567 or email@gmail.com', '["Remini Pro 1 Month Web/Mobile — Rs. 400","Remini Pro 3 Months Personal — Rs. 950","Remini Pro 12 Months Full Pro (Full Warranty) — Rs. 2,200"]'::jsonb, false, 2),
('lovable-pro', 'capcut_ai', '💜 AI WEB BUILDER', 'Lovable Pro Subscription (AI App Builder)', 'Build full-stack web apps & UI with Lovable Pro AI. High message limits, private projects & custom domains.', 'plush-snap', 'from-pink-500 via-purple-600 to-indigo-700', 'lovable', NULL, NULL, 'Enter Your Email or WhatsApp Number:', 'developer@gmail.com', '["Lovable Pro 1 Month (Shared Workspace) — Rs. 1,200","Lovable Pro 1 Month (Private Account) — Rs. 3,500","Lovable Pro High-Credits Pack — Rs. 5,500"]'::jsonb, false, 3),
('gemini-18m-pro', 'capcut_ai', '✨ 18 MONTHS PRO', 'Google Gemini 18-Month Pro + 2TB One', 'Official 18-Month Google Gemini Advanced Pro subscription on your own email with 2TB Google One Cloud.', 'plush-website', 'from-blue-500 via-indigo-500 to-purple-600', 'gemini', NULL, NULL, 'Enter Your Gmail Address for Activation:', 'yourname@gmail.com', '["Gemini Advanced Pro 18 Months (On Your Mail) — Rs. 1,800","Gemini Advanced Pro 12 Months Private — Rs. 1,350","Gemini Advanced Pro 1 Month Trial Pack — Rs. 350"]'::jsonb, false, 4),
('muse-ai-1b', 'capcut_ai', '🧠 1 BILLION TOKENS', 'Muse AI — 1 Billion Tokens Pro Plan', 'Massive 1 Billion Tokens quota for AI generation, coding, writing, and unlimited creative workflows.', 'plush-ai', 'from-emerald-500 via-teal-600 to-cyan-700', 'wand', NULL, NULL, 'Enter Your Email or WhatsApp Number:', '0300-1234567 or email@gmail.com', '["Muse AI 1 Billion Tokens Account — Rs. 1,500","Muse AI Unlimited Creator Access (3 Months) — Rs. 2,800","Muse AI Reseller 5-Accounts Pack — Rs. 6,000"]'::jsonb, false, 5),
('elevenlabs-300k', 'capcut_ai', '🎙️ NO EXPIRY CREDITS', 'ElevenLabs 300k Credits (No Expiry)', 'Ultra-realistic AI voice cloning & text-to-speech for YouTube automation & TikTok faceless channels.', 'plush-srv-2', 'from-amber-500 via-orange-500 to-rose-600', 'elevenlabs', NULL, NULL, 'Enter Your Email or WhatsApp Number:', 'creator@gmail.com', '["ElevenLabs 300,000 Credits (No Expiry) — Rs. 1,650","ElevenLabs Creator 100k Credits (1 Month) — Rs. 750","ElevenLabs 1 Million Credits Agency Pack — Rs. 4,500"]'::jsonb, false, 6),
('chatgpt-plus', 'capcut_ai', '🤖 GPT-4o & o3 PRO', 'ChatGPT Plus Official Subscription', 'Full access to GPT-4o, DALL-E 3 image generation, voice mode, deep research & custom GPTs.', 'plush-ai', 'from-teal-500 via-emerald-600 to-green-700', 'openai', NULL, NULL, 'Enter Your Email or WhatsApp Number:', 'yourname@gmail.com', '["ChatGPT Plus 1 Month (Shared Pro) — Rs. 550","ChatGPT Plus 1 Month (Private Account) — Rs. 2,200","ChatGPT Plus 3 Months Private Warranty — Rs. 6,000"]'::jsonb, false, 7),
('claude-ai-pro', 'capcut_ai', '⚡ CLAUDE 3.7 SONNET', 'Claude AI Pro Official Subscription', 'Best AI for coding, scriptwriting & long documents with 5x more usage and Claude 3.7 Sonnet.', 'plush-srv-2', 'from-orange-500 via-amber-600 to-stone-800', 'claude', NULL, NULL, 'Enter Your Email or WhatsApp Number:', 'yourname@gmail.com', '["Claude AI Pro 1 Month (Shared Workspace) — Rs. 750","Claude AI Pro 1 Month (Private Mail) — Rs. 2,500","Claude AI API Credits Pack — Rs. 3,200"]'::jsonb, false, 8),
('canva-pro', 'capcut_ai', '🎨 DESIGN SUITE', 'Canva Pro Official (On Your Email)', 'Unlock 100M+ premium templates, Magic Studio AI, background remover & brand kits on your own email.', 'plush-srv-4', 'from-cyan-500 via-blue-500 to-purple-600', 'canva', NULL, NULL, 'Enter Your Canva Email Address:', 'design@gmail.com', '["Canva Pro 1 Year (On Your Personal Email) — Rs. 250","Canva Pro Lifetime Edu Warranty — Rs. 450","Canva Pro Admin Panel (500 Seats) — Rs. 2,500"]'::jsonb, false, 9),
('proton-vpn-pro', 'capcut_ai', '🛡️ HIGH-SPEED VPN', 'Proton VPN Plus (10 Devices / All Countries)', 'Ultra-fast Swiss privacy VPN for UK/USA TikTok targeting, streaming & secure browsing with zero logs.', 'plush-srv-6', 'from-indigo-500 via-purple-600 to-slate-900', 'protonvpn', NULL, NULL, 'Enter Your WhatsApp Number or Email:', '0300-1234567', '["Proton VPN Plus 1 Month (1 Device) — Rs. 300","Proton VPN Plus 1 Month (Private 10 Devices) — Rs. 850","Proton VPN Plus 1 Year Full Warranty — Rs. 2,800"]'::jsonb, false, 10),
('hostinger-12m', 'capcut_ai', '🌐 12M WEB HOSTING', 'Hostinger Unlimited Plan (12 Months FW)', 'Hostinger Business/Premium 12-Month Unlimited Hosting with Free SSL, NVMe SSD & AI Website Builder.', 'plush-snap', 'from-purple-600 via-violet-600 to-indigo-800', 'hostinger', NULL, NULL, 'Enter Your Email or Domain Name:', 'mywebsite.com or email@gmail.com', '["Hostinger Unlimited Hosting 12 Months (Full Warranty) — Rs. 3,500","Hostinger Hosting 12M + .com Domain Bundle — Rs. 5,200","Single Website Hosting Slot (1 Year) — Rs. 1,200"]'::jsonb, false, 11),
('youtube-amazon-ott', 'capcut_ai', '🍿 4K STREAMING', 'YouTube Premium & Amazon Prime 6M', 'Ad-free YouTube Premium + YouTube Music on your email, plus Amazon Prime Video 6-Month & Netflix 4K.', 'plush-srv-1', 'from-red-500 via-rose-600 to-pink-700', 'youtube', NULL, NULL, 'Enter Your Email or WhatsApp Number:', 'yourmail@gmail.com', '["YouTube Premium 1 Month (On Your Mail) — Rs. 250","YouTube Premium 6 Months (On Your Mail) — Rs. 1,100","Amazon Prime Video 6 Months (Full Warranty) — Rs. 850","Netflix 4K UHD 1 Screen (1 Month) — Rs. 420"]'::jsonb, false, 12),
('adobe-ms365-suite', 'capcut_ai', '💼 OFFICE & ADOBE', 'Adobe Express 12M & Microsoft 365 Pro', 'Official 12-Month Adobe Express Premium & Microsoft 365 (Word, Excel, PowerPoint + 1TB OneDrive).', 'plush-srv-4', 'from-blue-600 via-sky-600 to-indigo-700', 'adobe', NULL, NULL, 'Enter Your Email Address for Activation:', 'office@gmail.com', '["Adobe Express Premium 12 Months (On Your Mail) — Rs. 1,200","Microsoft 365 Official 1 Year + 1TB OneDrive — Rs. 950","Adobe Creative Cloud All Apps (1 Month) — Rs. 2,200"]'::jsonb, false, 13),
('tiktok-uk-usa-acc', 'tiktok_fb', '🇬🇧🇺🇸 MONETIZATION', 'TikTok UK / USA Monetizable Account', 'Fresh UK or USA region TikTok account with Creator Rewards Program & TikTok Shop eligibility without VPN.', 'plush-tiktok', 'from-slate-900 via-rose-600 to-pink-500', 'tiktok', NULL, NULL, 'Enter Your Email or Preferred @Username:', 'yourname@gmail.com', '["Fresh TikTok UK / USA Account (On Your Email) — Rs. 600","TikTok UK Account + 1,000 Followers (Live Ready) — Rs. 1,450","Monetized TikTok UK Account (10K Followers + 100K Views) — Rs. 5,500"]'::jsonb, false, 14),
('tiktok-ad-agency', 'tiktok_fb', '📈 AD AGENCY VIP', 'TikTok Ad Agency Account (No Tax / Global)', 'Verified TikTok Business Ad Agency Account with worldwide targeting, instant ad approval & low CPM.', 'plush-srv-1', 'from-rose-600 via-pink-600 to-purple-700', 'bullhorn', NULL, NULL, 'Enter Your Business Name or WhatsApp Number:', 'My Store / 0300-1234567', '["TikTok Ad Agency Account (Self Top-Up) — Rs. 2,500","TikTok Ad Agency Account + $20 Ad Balance — Rs. 8,500","Complete TikTok Shop / E-Commerce Ad Setup — Rs. 4,000"]'::jsonb, false, 15),
('facebook-ads-service', 'tiktok_fb', '🚀 META ADS PRO', 'Facebook & Instagram Ads Agency Service', 'Run high-converting Facebook & Instagram sponsored ads for your business, page, or WhatsApp sales.', 'plush-fb', 'from-blue-600 via-indigo-600 to-sky-500', 'meta', NULL, NULL, 'Paste Your FB Page Link or WhatsApp Number:', 'https://facebook.com/yourpage', '["2-Day Trial Ad Campaign (With Budget) — Rs. 1,500","7-Day Sponsored WhatsApp / Leads Campaign — Rs. 5,000","Verified Meta Business Manager / Ad Account — Rs. 3,200"]'::jsonb, false, 16),
('tt-likes-views-followers', 'tiktok_fb', '🔥 VIRAL BOOST', 'TikTok Real Followers, Likes & ForYou Views', 'Instant non-drop TikTok followers to unlock Live Studio, plus viral likes & millions of video views.', 'plush-tiktok', 'from-rose-500 via-pink-500 to-purple-600', 'tiktok', NULL, NULL, 'Paste TikTok Video Link or @Username:', 'https://www.tiktok.com/@username/video/...', '["1,000 TikTok Likes + 10K Free Views — Rs. 150","1,000 TikTok Permanent Followers (Unlock Live) — Rs. 350","10,000 TikTok Followers (Monetization Pack) — Rs. 2,800","100,000 (1 Lakh) TikTok Viral Video Views — Rs. 450"]'::jsonb, false, 17),
('fb-monetization-boost', 'tiktok_fb', '👍 FB MONETIZATION', 'Facebook Page Likes, Followers & WatchTime', 'Grow your Facebook page with organic-style followers, post reactions ❤️, and 60K watch time.', 'plush-fb', 'from-blue-500 to-indigo-700', 'thumbs-up', NULL, NULL, 'Paste Facebook Page or Post Link:', 'https://facebook.com/yourpage', '["1,000 FB Page Likes + Followers — Rs. 300","5,000 FB Followers + 60K Watch Time Complete — Rs. 2,800","1,000 FB Post Likes / Love ❤️ Reactions — Rs. 180"]'::jsonb, false, 18),
('ig-yt-social-all', 'tiktok_fb', '📢 ALL SMM SERVICES', 'Instagram, YouTube & Poll Votes Boost', 'All social media services: IG followers/reels, YouTube 1K subs + 4K watch hours, & contest votes.', 'plush-ig', 'from-amber-400 via-pink-500 to-purple-600', 'instagram', NULL, NULL, 'Paste Profile / Channel / Contest Link:', 'https://instagram.com/... or youtube.com/...', '["1,000 Instagram Non-Drop Followers — Rs. 320","1,000 YouTube Subscribers (Non-Drop) — Rs. 1,200","YouTube 4,000 Hours Watch Time Complete — Rs. 3,500","1,000 Contest / Poll Votes (Any Platform) — Rs. 450"]'::jsonb, false, 19),
('sim-owner-details', 'franchise_sim', '📶 2026 FRESH SIM', 'Fresh SIM Owner Details & All Numbers on CNIC', 'Instant franchise lookup for latest 2026 SIM owner name, CNIC, exact address & all active SIMs list.', 'plush-srv-3', 'from-emerald-500 to-green-700', 'sim', NULL, NULL, 'Enter Target Mobile Number or 13-Digit CNIC:', '03001234567 or 3520212345671', '["Single Fresh SIM Owner + Address Details — Rs. 250","All Active Numbers on CNIC List (Fresh 2026) — Rs. 350","PTCL Landline Number Owner & Address Details — Rs. 400"]'::jsonb, false, 20),
('cdr-call-history', 'franchise_sim', '📊 CALL HISTORY CDR', 'Call History Details (CDR) & SMS Record', 'Complete incoming/outgoing call history (CDR), tower locations, and top-contacted numbers report.', 'plush-sim-search', 'from-pink-500 via-rose-500 to-purple-700', 'satellite', NULL, NULL, 'Enter Target Mobile Number (Jazz/Zong/Telenor/Ufone):', '03XX-XXXXXXX', '["Last 1 Month Call History (CDR PDF) — Rs. 2,200","Last 3 Months Complete CDR + Tower Logs — Rs. 3,500","Last 6 Months Full Franchise CDR Report — Rs. 5,000"]'::jsonb, false, 21),
('live-location-imei', 'franchise_sim', '📍 LIVE PINPOINT', 'Live Location Tracking & Mobile IMEI Trace', 'Real-time active SIM tower pinpoint location on Google Maps and stolen mobile IMEI number tracking.', 'plush-srv-1', 'from-rose-500 via-red-500 to-amber-600', 'satellite', NULL, NULL, 'Enter Mobile Number or 15-Digit IMEI Number:', '03001234567 or 358901234567890', '["Current Live Location Pinpoint (Google Maps) — Rs. 1,500","Mobile IMEI Tracking (Find Active SIM in Phone) — Rs. 2,000","Live Location + 30-Day Movement History — Rs. 3,200"]'::jsonb, false, 22),
('easypaisa-jazzcash-help', 'franchise_sim', '💸 WALLET SERVICES', 'EasyPaisa & JazzCash Account / Limit Setup', 'Assistance with new EasyPaisa / JazzCash account opening, biometric verification & limit upgrades.', 'plush-whatsapp', 'from-emerald-500 via-teal-500 to-cyan-600', 'phone', NULL, NULL, 'Enter Your Mobile Number for Wallet Setup:', '0347-8936242', '["Open New EasyPaisa Account Setup — Rs. 600","Open New JazzCash Account Setup — Rs. 600","Merchant / Level-2 Limit Upgrade Guidance — Rs. 1,200"]'::jsonb, false, 23),
('nadra-cnic-frc', 'nadra_records', '🪪 NADRA RECORDS', 'CNIC Copy, Family Tree (FRC) & Pic Details', 'Check NADRA CNIC front/back record, Family Registration Certificate (FRC) tree, and family members list.', 'plush-srv-4', 'from-blue-600 via-indigo-600 to-slate-800', 'id-card', NULL, NULL, 'Enter 13-Digit CNIC Number:', '35202-1234567-1', '["CNIC Record Verification & Details — Rs. 500","CNIC Color Copy / Verification Print — Rs. 800","Family Members Details (Full Family Tree) — Rs. 1,200","Family Members Pic (FRC Record) — Rs. 1,800"]'::jsonb, false, 24),
('certificates-nadra', 'nadra_records', '📄 CERTIFICATES', 'Marriage, Birth & Vaccination Certificates', 'Record check and documentation assistance for Marriage, Birth, Divorce, Polio & Corona vaccination.', 'plush-srv-3', 'from-teal-500 to-emerald-700', 'id-card', NULL, NULL, 'Enter CNIC Number or Applicant Name:', '35202-1234567-1', '["Marriage Status Check on CNIC — Rs. 600","Birth / Marriage / Death Certificate Record Check — Rs. 1,200","Polio / Corona Vaccination Record Check — Rs. 800"]'::jsonb, false, 25),
('passport-travel-history', 'nadra_records', '🛂 PASSPORT & TRAVEL', 'Passport Details, Copy & Travel History', 'Check passport number, expiry details, international travel history (FIA entry/exit) & status.', 'plush-website', 'from-sky-600 via-blue-700 to-indigo-900', 'passport', NULL, NULL, 'Enter CNIC Number or Passport Number:', '35202-1234567-1 or AB1234567', '["Passport Details Check via CNIC — Rs. 1,200","Passport Page Copy Record — Rs. 2,000","International Travel History Details — Rs. 3,000","ECL / Travel Status Check — Rs. 2,500"]'::jsonb, false, 26),
('vehicle-land-fir-check', 'nadra_records', '🚗 VEHICLE & RECORDS', 'Car Owner, Land Records & FIR Details Check', 'Excise vehicle ownership verification (Punjab/Sindh/KPK/ISB), land record lookup & FIR copy check.', 'plush-srv-6', 'from-slate-700 via-indigo-700 to-blue-900', 'car', NULL, NULL, 'Enter Vehicle Plate Number or CNIC Number:', 'LEA-2024 or 35202-1234567-1', '["Car / Bike Owner & Excise Details — Rs. 450","FIR Details / Copy Record Check — Rs. 1,200","Land Record / Property Ownership Check — Rs. 1,500"]'::jsonb, false, 27),
('btc-usdt-crypto', 'creative_crypto', '💲 CRYPTO P2P DESK', 'BTC / USDT Available (Buy & Sell Instant)', 'Buy or sell USDT (TRC20/BEP20/Binance) and BTC safely via EasyPaisa, JazzCash, SadaPay or Bank Transfer.', 'plush-ig', 'from-amber-500 via-yellow-500 to-orange-600', 'binance', NULL, NULL, 'Enter USDT/BTC Amount You Want to Buy or Sell:', 'e.g. Buy 50 USDT via EasyPaisa', '["Buy 10 USDT – 50 USDT (Instant Binance Transfer) — Market Rate","Buy 50 USDT – 500 USDT (Wholesale VIP Rate) — Market Rate","Sell Your USDT / BTC for EasyPaisa / JazzCash — Instant Cash"]'::jsonb, false, 28),
('video-editing-service', 'creative_crypto', '🎬 SAQIB VISUALS EDIT', 'Pro Video Editing Service (Reels, TikTok, YT)', 'High-retention video editing with 3D captions, colour grading, sound FX & viral transitions.', 'plush-srv-5', 'from-purple-600 via-pink-500 to-rose-500', 'video', NULL, NULL, 'Describe Your Video Project or Paste Sample Link:', 'TikTok Reel / YouTube Documentary...', '["1 Viral TikTok / Instagram Reel Edit (Up to 60s) — Rs. 600","5 Viral Reels / Shorts Bundle Pack — Rs. 2,500","Full YouTube Video Edit (8–12 Mins Faceless/Vlog) — Rs. 2,200"]'::jsonb, false, 29),
('graphics-design-docs', 'creative_crypto', '🎨 GRAPHICS & DOCS', 'Graphics Designing & Document Editing', 'Custom logos, social media posts, certificates, business cards, banners, thumbnails & PDF document edits.', 'plush-srv-2', 'from-pink-500 via-fuchsia-500 to-indigo-600', 'palette', NULL, NULL, 'Describe What You Need Designed or Edited:', 'Logo Design / Certificate / PDF Edit...', '["Custom Logo or 3 Social Media Posts — Rs. 800","Document / Certificate / PDF Clean Editing — Rs. 500","Complete Brand Identity + Banner Pack — Rs. 2,200"]'::jsonb, false, 30),
('virtual-whatsapp-num', 'creative_crypto', '⚡ VIRTUAL NUMBER', 'International WhatsApp Virtual Number (UK/US)', 'Get a clean UK (+44), USA (+1), or Canada virtual number for WhatsApp Business & account verification.', 'plush-whatsapp', 'from-green-500 to-emerald-700', 'whatsapp', NULL, NULL, 'Enter Your Contact Number to Receive OTP:', '0300-1234567', '["USA / Canada (+1) WhatsApp Number — Rs. 450","UK (+44) Permanent WhatsApp Number — Rs. 750","Private Calling / Virtual Number App Setup — Rs. 1,200"]'::jsonb, false, 31),
('custom-web-smm-panel', 'creative_crypto', '💎 FULL-STACK DEV', 'Custom 3D Glass Website & SMM Panel Setup', 'Get your own 3D Acrylic Glass website, SIM Tracker portal, or automated SMM store built by Muhammad Saqib.', 'plush-srv-5', 'from-indigo-600 via-purple-600 to-pink-600', 'code', NULL, NULL, 'Enter Your Brand Name & WhatsApp Number:', 'My Brand / 0300-1234567', '["3D Glass Portfolio + SIM Tracker Website — Rs. 2,500","Full Services Store Website (Like Saqib Visuals) — Rs. 3,800","Automated SMM Reseller Panel + Backend Setup — Rs. 8,500"]'::jsonb, false, 32)
ON CONFLICT (id) DO UPDATE SET
  badge = EXCLUDED.badge,
  title = EXCLUDED.title,
  "desc" = EXCLUDED."desc",
  tiers = EXCLUDED.tiers,
  sort_order = EXCLUDED.sort_order;

-- ---------------------------------------------------------------------
-- 9. SEED DATA: 7 LIVE WEB TOOLS
-- ---------------------------------------------------------------------
INSERT INTO public.web_tools (
  id, title, "desc", tool_url, icon_url, badge, icon_type, orb_grad, plush, hidden, sort_order
)
VALUES
('tool-chatgpt-web', 'ChatGPT Plus & o3 AI Workspace', 'Launch OpenAI ChatGPT web studio for coding, viral scripts, DALL·E 3 images & deep research.', 'https://chatgpt.com/', NULL, '🤖 AI WORKSPACE', 'openai', 'from-emerald-500 via-teal-600 to-green-700', 'plush-ai', false, 1),
('tool-canva-studio', 'Canva Pro Visual & Thumbnail Studio', 'Create viral YouTube thumbnails, social media posts, logos, presentations & brand kits.', 'https://www.canva.com/', NULL, '🎨 DESIGN STUDIO', 'canva', 'from-pink-500 via-rose-500 to-purple-600', 'plush-srv-2', false, 2),
('tool-gemini-studio', 'Google Gemini Pro & Veo AI Studio', 'Access Google Gemini Advanced 2.5 Pro workspace & AI Studio for prompts, docs & video.', 'https://gemini.google.com/', NULL, '✨ GOOGLE AI', 'gemini', 'from-blue-500 via-indigo-500 to-purple-600', 'plush-website', false, 3),
('tool-capcut-cloud', 'CapCut Pro Web Editor & Templates', 'Open CapCut online video editor, viral TikTok templates, auto-captions & 4K export studio.', 'https://www.capcut.com/', NULL, '🎬 CREATOR TOOL', 'capcut', 'from-slate-900 via-indigo-900 to-purple-700', 'plush-capcut', false, 4),
('tool-lovable-builder', 'Lovable AI Full-Stack App Builder', 'Build & deploy full-stack React, Supabase & Tailwind web apps from a single prompt.', 'https://lovable.dev/', NULL, '💻 AI DEV TOOL', 'lovable', 'from-pink-500 via-fuchsia-600 to-indigo-600', 'plush-snap', false, 5),
('tool-elevenlabs-voice', 'ElevenLabs AI Voice & Dubbing Studio', 'Generate ultra-realistic Urdu, Hindi & English AI voiceovers for TikTok & YouTube Automation.', 'https://elevenlabs.io/', NULL, '🎙️ VOICE AI TOOL', 'elevenlabs', 'from-amber-500 via-orange-500 to-pink-600', 'plush-ig', false, 6),
('tool-remini-web', 'Remini AI Ultra 4K Photo Enhancer', 'AI Photo enhancer, unblur faces and 4K upscale directly in web browser.', 'https://remini.ai', NULL, '⚡ ULTRA HD 4K', 'wand', 'from-rose-500 via-red-600 to-amber-600', 'plush-snap', false, 7)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  "desc" = EXCLUDED."desc",
  tool_url = EXCLUDED.tool_url,
  badge = EXCLUDED.badge;

-- ---------------------------------------------------------------------
-- 10. SEED DATA: ADMIN & VIP PROFILES (DISABLED: Clean database for real users)
-- ---------------------------------------------------------------------
-- INSERT INTO public.profiles (id, full_name, email, phone, role, balance)
-- VALUES 
--   ('+92 347 8936242', 'Muhammad Saqib (Official Admin)', 'support@saqibvisuals.com', '+92 347 8936242', 'admin', 50000),
--   ('03478936242', 'Muhammad Saqib', 'admin@saqibvisuals.com', '03478936242', 'admin', 50000),
--   ('vip_member', 'VIP Reseller Partner', 'reseller@saqibvisuals.com', '03120000000', 'reseller', 5000)
-- ON CONFLICT (id) DO NOTHING;

-- ---------------------------------------------------------------------
-- 11. SEED DATA: VERIFIED CUSTOMER REVIEWS
-- ---------------------------------------------------------------------
-- Clean up any legacy dummy / demo reviews to ensure 100% real database records:
DELETE FROM public.reviews WHERE id IN ('rev-1', 'rev-2', 'rev-3', 'rev-4');
-- Note: Real customer reviews submitted through the website or admin panel will be stored directly in this table.

-- ---------------------------------------------------------------------
-- 12. SEED DATA: ADMIN SECURITY VAULT
-- (Pass: saqibadmin / deleefue - PBKDF2 SHA-512)
-- ---------------------------------------------------------------------
INSERT INTO public.admin_vault (username, password_hash, salt, iterations, algorithm, role, permissions, token_version, is_active, created_by)
VALUES 
(
  'saqib',
  'f195d908c20941fc855a591ebb1f51c35bfc901443149fe091cb7201c924dbf7c7e88e68c629b5dddc612e843e10a4d6dec320e0961c849699604be04c2074b7',
  'b9ab35f668716cb292036849d0d0b7a705e456f4d58a65c80f5c3f6459fc4ba2',
  100000,
  'sha512',
  'superadmin',
  '{"manage_services":true,"manage_tools":true,"manage_orders":true,"manage_users":true,"view_telemetry":true,"manage_site_config":true,"manage_admins":true}'::jsonb,
  1,
  true,
  'system'
),
(
  'saqibadmin',
  '3642eaba715b6694284a57ad3cb1821772189998788f4691da77a4893a90a584c4f5c54922f66b8362e14590b9e1b24a61003185c23a3dd2c1bf22f800696e52',
  '7d9d759b0d4f90db22f8e1431fd6a2f8108bee697ad551a386964df3e2ce789c',
  100000,
  'sha512',
  'superadmin',
  '{"manage_services":true,"manage_tools":true,"manage_orders":true,"manage_users":true,"view_telemetry":true,"manage_site_config":true,"manage_admins":true}'::jsonb,
  1,
  true,
  'system'
)
ON CONFLICT (username) DO UPDATE SET
  password_hash = EXCLUDED.password_hash,
  salt = EXCLUDED.salt,
  iterations = EXCLUDED.iterations,
  algorithm = EXCLUDED.algorithm,
  role = EXCLUDED.role,
  permissions = EXCLUDED.permissions,
  is_active = true,
  updated_at = timezone('utc'::text, now());

-- ---------------------------------------------------------------------
-- 13. SEED DATA: OFFICIAL PROMO COUPONS
-- ---------------------------------------------------------------------
INSERT INTO public.coupons (
  code, 
  discount_type, 
  discount_value, 
  min_order_amount, 
  max_discount_amount, 
  max_uses, 
  description
)
VALUES 
  ('WELCOME10', 'percentage', 10, 200, 300, 500, 'Welcome Special: 10% OFF on all orders over Rs. 200 (Max Rs. 300 discount)'),
  ('SAQIB50', 'fixed', 50, 300, NULL, 200, 'VIP Flat Discount: Rs. 50 OFF on orders over Rs. 300'),
  ('SAQIB20', 'percentage', 20, 500, 500, 1000, 'Special Promo: 20% OFF on orders over Rs. 500 (Max Rs. 500 discount)'),
  ('EID20', 'percentage', 20, 500, 500, 1000, 'Festive Special: 20% OFF on orders over Rs. 500 (Max Rs. 500 discount)')
ON CONFLICT (code) DO NOTHING;

-- =====================================================================
-- 🛠️ USEFUL ADMIN MAINTENANCE CHEAT-SHEET QUERIES
-- =====================================================================

-- [A] WhatsApp DP, Name, Status & Greetings Update:
-- UPDATE public.site_config
-- SET config = jsonb_set(
--   jsonb_set(
--     jsonb_set(
--       config,
--       '{contact,whatsappWidgetAvatar}',
--       '"https://your-domain.com/new-dp.jpg"'
--     ),
--     '{contact,whatsappWidgetName}',
--     '"Muhammad Saqib"'
--   ),
--   '{contact,whatsappWidgetStatus}',
--   '"Online • Typically replies in ~2 mins ⚡"'
-- )
-- WHERE id = 'default';

-- [B] Social Platform Toggle Query (e.g. Turn YouTube or Telegram ON/OFF):
-- UPDATE public.site_config
-- SET config = jsonb_set(
--   config,
--   '{socials,platforms}',
--   (
--     SELECT jsonb_agg(
--       CASE 
--         WHEN elem->>'id' = 'youtube' THEN jsonb_set(elem, '{enabled}', 'true')
--         ELSE elem
--       END
--     )
--     FROM jsonb_array_elements(config->'socials'->'platforms') AS elem
--   )
-- )
-- WHERE id = 'default';

-- [C] Approve Payment Proof & Credit User Wallet:
-- UPDATE public.payment_proofs SET status = 'approved', reviewed_at = now() WHERE id = 'YOUR_PROOF_ID';
-- UPDATE public.profiles SET balance = balance + 1000 WHERE id = 'USER_PHONE_OR_ID';

-- [D] Check Latest Orders with Customer Details:
-- SELECT id, user_id, service_title, package_tier, price, status, created_at
-- FROM public.orders
-- ORDER BY created_at DESC
-- LIMIT 20;

-- [E] Check Pending Payment Proofs:
-- SELECT id, user_id, amount, method, sender_account_name, trx_id, status, created_at
-- FROM public.payment_proofs
-- WHERE status = 'pending'
-- ORDER BY created_at DESC;


-- [F] Change Website Name, Brand Title & Top Strip Announcement:
-- UPDATE public.site_config
-- SET config = jsonb_set(
--   jsonb_set(
--     jsonb_set(
--       config,
--       '{banner,mainTitle}',
--       '"Muhammad Saqib"'
--     ),
--     '{banner,highlightTitle}',
--     '"— Saqib Visuals"'
--   ),
--   '{footer,brandName}',
--   '"🚀 Muhammad Saqib"'
-- )
-- WHERE id = 'default';

-- [G] Reset or Change Admin Password & Username (PBKDF2 SHA-512):
-- -- To set Username = 'saqib' and Password = 'saqibadmin':
-- UPDATE public.admin_vault
-- SET 
--   password_hash = 'f195d908c20941fc855a591ebb1f51c35bfc901443149fe091cb7201c924dbf7c7e88e68c629b5dddc612e843e10a4d6dec320e0961c849699604be04c2074b7',
--   salt = 'b9ab35f668716cb292036849d0d0b7a705e456f4d58a65c80f5c3f6459fc4ba2',
--   iterations = 100000,
--   algorithm = 'sha512',
--   updated_at = now()
-- WHERE username = 'saqib';


-- [H] Whitelist New Domain for Client Clones / Resales:
-- UPDATE public.site_config
-- SET config = jsonb_set(
--   config,
--   '{authorizedDomains}',
--   COALESCE(config->'authorizedDomains', '["localhost", "127.0.0.1", "mrsaqib242.vercel.app"]'::jsonb) || '["clientdomain.com"]'::jsonb
-- )
-- WHERE id = 'default';

-- [I] Storefront Promo & Welcome 20% Discount Popup Modal Controls:
-- -- 1. Turn ON 20% Discount Promo Popup:
-- UPDATE public.site_config
-- SET config = jsonb_set(
--   config,
--   '{promoPopup}',
--   jsonb_build_object(
--     'enabled', true,
--     'popupType', 'discount',
--     'badgeText', '🔥 SPECIAL 20% DISCOUNT',
--     'title', 'Limited Time Flash Offer — Save 20% Today!',
--     'description', 'Order any AI Pro Tool, CapCut Pro, or TikTok Agency Account right now and enjoy an instant 20% discount on your first order. WhatsApp Saqib directly!',
--     'imageUrl', 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
--     'showImage', true,
--     'couponCode', 'SAQIB20',
--     'showCoupon', true,
--     'countdownMinutes', 15,
--     'showCountdown', true,
--     'primaryBtnText', 'Claim 20% Off on WhatsApp',
--     'primaryBtnAction', 'whatsapp',
--     'secondaryBtnText', 'Maybe Later',
--     'showOncePerSession', true
--   ),
--   true
-- ),
-- updated_at = now()
-- WHERE id = 'default';

-- -- 2. Turn OFF / Disable Popup:
-- UPDATE public.site_config
-- SET config = jsonb_set(config, '{promoPopup,enabled}', 'false', true),
-- updated_at = now()
-- WHERE id = 'default';


-- [J] Ban / Suspend a User Account:
-- UPDATE public.profiles
-- SET status = 'banned', ban_reason = 'Suspended: Suspicious activity', updated_at = now()
-- WHERE id = 'TARGET_USER_ID_OR_PHONE';

-- [K] Unban / Restore User Account:
-- UPDATE public.profiles
-- SET status = 'active', ban_reason = '', updated_at = now()
-- WHERE id = 'TARGET_USER_ID_OR_PHONE';

-- [L] Add New Sub-Admin Account:
-- INSERT INTO public.admin_vault (username, password_hash, salt, iterations, algorithm, role, permissions, token_version, is_active)
-- VALUES (
--   'staff_ali',
--   'f195d908c20941fc855a591ebb1f51c35bfc901443149fe091cb7201c924dbf7c7e88e68c629b5dddc612e843e10a4d6dec320e0961c849699604be04c2074b7',
--   'b9ab35f668716cb292036849d0d0b7a705e456f4d58a65c80f5c3f6459fc4ba2',
--   100000,
--   'sha512',
--   'subadmin',
--   '{"manage_services":true,"manage_tools":true,"manage_orders":true,"manage_users":false,"view_telemetry":false,"manage_site_config":false,"manage_admins":false}'::jsonb,
--   1,
--   true
-- );

-- [M] View Real Visitor Telemetry & Hardware Fingerprints:
-- SELECT fingerprint, ip_address, country, device_type, os, browser, battery_level, last_seen
-- FROM public.visitor_fingerprints
-- ORDER BY last_seen DESC
-- LIMIT 25;

-- =====================================================================
-- ✅ MASTER DATABASE SETUP COMPLETED SUCCESSFULLY!
-- =====================================================================
