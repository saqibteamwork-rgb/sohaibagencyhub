# 🤖 AI Master Prompt: Clone Website Feature Replication Specification
> **Instructions for the AI**: You are tasked with upgrading an existing Next.js + Tailwind CSS + Supabase digital agency web application. Follow every instruction, file structure, database schema, and component layout described below with zero deviation.

---

## 🎯 OBJECTIVES & SCOPE OF UPGRADES

You will implement five (5) high-end, production-grade systems into the repository:
1. **Hero Portrait & Orbit Badges Mobile Collision Fix**: Fix overlapping badges and expanding portrait circle.
2. **Dual-Direction Infinite Scrolling Reviews Marquee**: Row 1 scrolls left, Row 2 scrolls right, pause on hover.
3. **Customer Review Moderation Workflow**: Public reviews enter `pending` state; only admin-approved reviews display live.
4. **Real-Time Admin Notification Center**: Header bell with animated unread badge counter, audio chime, and event triggers (`new_review`, `new_order`, `payment_proof`).
5. **Product & Web Tools Sales, Revenue & Net Profit Dashboard (P&L Engine)**: Financial analytics tracking Gross Sales, Wholesale Cost, Net Profit, Margin %, and Tool Usage Clicks.

---

## 📦 SYSTEM 1: MOBILE AVATAR & FLOATING ORBIT BADGES FIX

### 1. The Problem
On small mobile screens (`< sm`), when the avatar lens is small (`w-36` / 144px) and badges are positioned at `-top-2 -left-4` and `-top-2 -right-4`, the two top badges collide and overlap horizontally in the center. The same happens with bottom badges, while both pairs intrude into the circle and cover the client's face and chest.

### 2. The Solution (Implementation)
In `src/App.tsx` (or your Hero Banner component):
1. **Outer Container**:
   Change `my-2 sm:my-3 md:my-0` to `my-6 sm:my-3 md:my-0` to give vertical clearance above and below.
2. **Portrait Lens Size**:
   Change `w-36 h-36 sm:w-60 sm:h-60` to `w-48 h-48 sm:w-60 sm:h-60` (192px on mobile) so the circle has ample breathing room.
3. **Badge Positions & Defensive Styling**:
   - **Badge 1 (Top-Left)**:
     `className="orbit-badge float-slow -top-5 -left-6 sm:-top-3 sm:-left-8 px-2 py-1 sm:px-3 sm:py-1.5 rounded-2xl flex items-center gap-1.5 cursor-pointer shadow-md"`
     Wrap text in: `<div className="text-left leading-none max-w-[80px] sm:max-w-none"><div className="... truncate">Title</div><div className="... truncate">Sub</div></div>`
   - **Badge 2 (Top-Right)**:
     `className="orbit-badge float-reverse -top-5 -right-6 sm:-top-3 sm:-right-8 px-2 py-1 sm:px-3 sm:py-1.5 rounded-2xl flex items-center gap-1.5 cursor-pointer shadow-md"`
     Wrap text with `max-w-[80px] sm:max-w-none` and `truncate`.
   - **Badge 3 (Bottom-Left)**:
     `className="orbit-badge float-reverse -bottom-5 -left-6 sm:-bottom-3 sm:-left-8 px-2 py-1 sm:px-3 sm:py-1.5 rounded-2xl flex items-center gap-1.5 cursor-pointer shadow-md"`
     Wrap text with `max-w-[80px] sm:max-w-none` and `truncate`.
   - **Badge 4 (Bottom-Right)**:
     `className="orbit-badge float-slow -bottom-5 -right-6 sm:-bottom-3 sm:-right-8 px-2 py-1 sm:px-3 sm:py-1.5 rounded-2xl flex items-center gap-1.5 cursor-pointer shadow-md"`
     Wrap text with `max-w-[80px] sm:max-w-none` and `truncate`.

---

## 🌟 SYSTEM 2: DUAL-DIRECTION INFINITE SCROLLING REVIEWS MARQUEE

### 1. Architecture
Instead of a static 3-column grid, transform the Customer Reviews section into a dual-direction continuous hardware-accelerated ticker.
- **Track 1 (Top Row)**: Scrolls Left (`marquee-track-left`).
- **Track 2 (Bottom Row)**: Scrolls Right (`marquee-track-right`).
- **Pause on Hover**: When mouse hovers or mobile screen is touched, the marquee pauses smoothly for effortless reading.

### 2. CSS Animations (`src/index.css`)
```css
@keyframes marqueeLeft {
  0% { transform: translate3d(0, 0, 0); }
  100% { transform: translate3d(-50%, 0, 0); }
}

@keyframes marqueeRight {
  0% { transform: translate3d(-50%, 0, 0); }
  100% { transform: translate3d(0, 0, 0); }
}

.marquee-track-left {
  display: flex;
  width: max-content;
  will-change: transform;
  transform: translateZ(0);
  backface-visibility: hidden;
  animation: marqueeLeft 34s linear infinite;
}

.marquee-track-right {
  display: flex;
  width: max-content;
  will-change: transform;
  transform: translateZ(0);
  backface-visibility: hidden;
  animation: marqueeRight 38s linear infinite;
}

.marquee-wrapper:hover .marquee-track-left,
.marquee-wrapper:hover .marquee-track-right {
  animation-play-state: paused;
}
```

### 3. Component Rendering (`src/components/ShowcaseSections.tsx`)
```tsx
const effectiveReviews = reviews && reviews.length > 0 ? reviews : DEFAULT_REVIEWS;
const row1 = effectiveReviews.filter((_: any, i: number) => i % 2 === 0);
const row2 = effectiveReviews.filter((_: any, i: number) => i % 2 !== 0);
const safeRow1 = row1.length > 0 ? row1 : effectiveReviews;
const safeRow2 = row2.length > 0 ? row2 : effectiveReviews;

// Card Width: w-[280px] sm:w-[350px] flex-shrink-0
// Duplication for seamless loop: [...safeRow1, ...safeRow1, ...safeRow1]
```

### 4. Seed Reviews File (`src/data/defaultReviews.ts`)
Create a pure TypeScript data file (not in `app/api/**` to avoid client-side bundling issues) containing 9 verified default reviews covering CapCut Pro, Gemini 18M, TikTok UK, Lovable Pro, SIM Tracker, ChatGPT Plus, Canva Pro, ElevenLabs, and SMM Growth.

---

## 🛡️ SYSTEM 3: CUSTOMER REVIEW MODERATION WORKFLOW

### 1. Database Schema
Add `status` column to `public.reviews`:
```sql
ALTER TABLE public.reviews 
ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'approved' 
CHECK (status IN ('pending', 'approved', 'rejected'));

UPDATE public.reviews SET status = 'approved' WHERE status IS NULL OR status = '';
ALTER TABLE public.reviews ALTER COLUMN status SET DEFAULT 'pending';

CREATE INDEX IF NOT EXISTS idx_reviews_status ON public.reviews(status);
```

### 2. API Logic (`app/api/reviews/route.ts`)
- **`GET`**: 
  - If public: filter `.or('status.eq.approved,status.is.null')`.
  - If admin authorized (`?all=true`): return all reviews.
- **`POST`**:
  - Public submission: enforce `status: 'pending'`, `verified: false`.
  - Trigger admin notification in `public.admin_notifications` (`type: 'new_review'`).
  - Response returns `{ success: true, review, pendingApproval: true }`.
- **`PATCH`**:
  - Admin can update `status` to `'approved'` (sets `verified: true`) or `'rejected'`.
- **`DELETE`**:
  - Admin can delete review permanently.

### 3. Storefront Toast (`src/App.tsx`)
When a user submits a review:
Show toast: `"Shukriya! Review submit hogya hai aur admin approval ke baad live display hoga."`
Do NOT immediately push to public `reviews` state.

### 4. Admin Studio (`src/components/AdminReviewModerationStudio.tsx`)
- Status tabs: `Pending Approval`, `Approved & Live`, `Rejected / Spam`, `All Reviews`.
- Actions on cards: **✅ Approve & Publish**, **❌ Reject**, **🗑️ Delete**.
- Modal: **Add Official Review** (published with `status: 'approved'` directly).

---

## 🔔 SYSTEM 4: REAL-TIME ADMIN NOTIFICATION CENTER

### 1. Database Schema
```sql
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

CREATE INDEX IF NOT EXISTS idx_admin_notif_unread ON public.admin_notifications(is_read) WHERE is_read = false;
CREATE INDEX IF NOT EXISTS idx_admin_notif_created ON public.admin_notifications(created_at DESC);
```

### 2. Backend Notification Endpoint (`app/api/admin/notifications/route.ts`)
- **`GET`**: Returns latest 50 notifications + unread count.
- **`PATCH`**: Marks single ID or `{ markAll: true }` as read.
- **`DELETE`**: Clears read notifications.
- Include in-memory fallback so UI never crashes if DB table is unmigrated.

### 3. Automatic Event Triggers
- When `POST /api/reviews` is called ➡️ insert `new_review` notification.
- When `POST /api/orders` is called ➡️ insert `new_order` notification.
- When `POST /api/payments` is called ➡️ insert `payment_proof` notification.

### 4. UI Component (`src/components/AdminNotificationBell.tsx`)
- Placed in top header next to "Save to Cloud DB" / "View Live Store".
- Red pulsating unread badge (`🔴 3`) with audio chime alert when new notifications arrive.
- Interactive dropdown popover with color-coded icons:
  - ⭐ Review (Amber) ➡️ Click jumps to `reviews` screen.
  - 🛍️ Order (Emerald) ➡️ Click jumps to `dashboard` screen.
  - 💳 Payment Proof (Cyan) ➡️ Click jumps to `payments` screen.
- "Mark all as read" button.

---

## 💰 SYSTEM 5: SALES, REVENUE & NET PROFIT ENGINE (P&L DASHBOARD)

### 1. Database Schema
```sql
ALTER TABLE public.orders 
ADD COLUMN IF NOT EXISTS wholesale_cost NUMERIC DEFAULT 0,
ADD COLUMN IF NOT EXISTS profit NUMERIC DEFAULT 0,
ADD COLUMN IF NOT EXISTS currency TEXT NOT NULL DEFAULT 'PKR';

CREATE TABLE IF NOT EXISTS public.tool_usage_analytics (
    id TEXT PRIMARY KEY DEFAULT ('tool-use-' || extract(epoch from now())::bigint || '-' || upper(substring(md5(random()::text) from 1 for 6))),
    tool_id TEXT NOT NULL,
    tool_title TEXT NOT NULL,
    user_id TEXT DEFAULT 'guest',
    action_type TEXT NOT NULL DEFAULT 'launch',
    revenue NUMERIC DEFAULT 0,
    cost NUMERIC DEFAULT 0,
    profit NUMERIC DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);
CREATE INDEX IF NOT EXISTS idx_tool_usage_tool_id ON public.tool_usage_analytics(tool_id);
```

### 2. Backend Profit Route (`app/api/admin/sales-profit/route.ts`)
Calculates:
- **Total Gross Sales**: Sum of all order prices + paid tool lookups.
- **Total Wholesale Cost**: Sum of supplier costs.
- **Net Pure Profit**: Gross Sales - Wholesale Cost.
- **Net Margin %**: `(Net Profit / Gross Sales) * 100`.
- **Product Breakdown**: Units sold, revenue, profit, margin % per service.
- **Web Tools Radar**: Total clicks/launches, usage count, revenue contribution.

### 3. Studio UI (`src/components/AdminSalesProfitStudio.tsx`)
- Embedded in `AdminAnalyticsDashboard.tsx` under the tab **"💰 Sales & Profit Engine"**.
- 4 Top Glowing KPI Cards (Gross Sales, Wholesale Cost, Net Profit, Margin %).
- Products Profit Table with profit percentage bars.
- Web Tools Click & Usage Radar.
- Time Filters: Today, 7 Days, 30 Days, All Time.
- "Copy P&L Report" button for instant sharing.

---

## ⚡ FULL MASTER SQL MIGRATION SCRIPT

Run this entire script in the [Supabase SQL Editor](https://supabase.com/dashboard):

```sql
-- =========================================================================
-- MASTER SQL MIGRATION: REVIEWS, NOTIFICATIONS & PROFIT ENGINE
-- =========================================================================

-- 1. REVIEWS TABLE MODERATION UPGRADE
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

UPDATE public.reviews SET status = 'approved' WHERE status IS NULL OR status = '';
ALTER TABLE public.reviews ALTER COLUMN status SET DEFAULT 'pending';

CREATE INDEX IF NOT EXISTS idx_reviews_status ON public.reviews(status);
CREATE INDEX IF NOT EXISTS idx_reviews_created_at ON public.reviews(created_at DESC);

-- 2. ADMIN NOTIFICATIONS TABLE
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

CREATE INDEX IF NOT EXISTS idx_admin_notif_unread ON public.admin_notifications(is_read) WHERE is_read = false;
CREATE INDEX IF NOT EXISTS idx_admin_notif_created ON public.admin_notifications(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_admin_notif_type ON public.admin_notifications(type);

ALTER TABLE public.admin_notifications ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow service_role full access to admin_notifications" ON public.admin_notifications;
CREATE POLICY "Allow service_role full access to admin_notifications" 
ON public.admin_notifications FOR ALL TO service_role USING (true) WITH CHECK (true);

-- 3. ORDERS TABLE PROFIT & COST UPGRADE
ALTER TABLE public.orders 
ADD COLUMN IF NOT EXISTS wholesale_cost NUMERIC DEFAULT 0,
ADD COLUMN IF NOT EXISTS profit NUMERIC DEFAULT 0,
ADD COLUMN IF NOT EXISTS currency TEXT NOT NULL DEFAULT 'PKR';

-- 4. TOOL USAGE ANALYTICS TABLE
CREATE TABLE IF NOT EXISTS public.tool_usage_analytics (
    id TEXT PRIMARY KEY DEFAULT ('tool-use-' || extract(epoch from now())::bigint || '-' || upper(substring(md5(random()::text) from 1 for 6))),
    tool_id TEXT NOT NULL,
    tool_title TEXT NOT NULL,
    user_id TEXT DEFAULT 'guest',
    action_type TEXT NOT NULL DEFAULT 'launch',
    revenue NUMERIC DEFAULT 0,
    cost NUMERIC DEFAULT 0,
    profit NUMERIC DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_tool_usage_tool_id ON public.tool_usage_analytics(tool_id);
CREATE INDEX IF NOT EXISTS idx_tool_usage_created_at ON public.tool_usage_analytics(created_at DESC);

ALTER TABLE public.tool_usage_analytics ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow service_role full access to tool_usage_analytics" ON public.tool_usage_analytics;
CREATE POLICY "Allow service_role full access to tool_usage_analytics" 
ON public.tool_usage_analytics FOR ALL TO service_role USING (true) WITH CHECK (true);

-- 5. SEED 9 VERIFIED REVIEWS
INSERT INTO public.reviews (id, name, service, rating, comment, verified, status, created_at)
VALUES
('rev-seed-01', 'Hamza Tariq (Lahore)', 'CapCut Pro (1-Year Unlimited)', 5, 'Bhai sirf 2 minute mein CapCut Pro activate hogya! 4K HDR export aur AI captions bilkul smooth chal rahe hain PC aur mobile dono par. Highly recommended!', true, 'approved', now() - interval '1 hour'),
('rev-seed-02', 'Bilal Ahmed (Karachi)', 'Google Gemini 18-Month Pro', 5, 'Direct mere personal Gmail par 1.5 years ka Google One 2TB storage + Gemini Advanced AI activate hua. No VPN needed, best pricing in Pakistan.', true, 'approved', now() - interval '3 hours'),
('rev-seed-03', 'Usman Ali (Rawalpindi)', 'TikTok UK Monetized Account', 5, 'Bina kisi VPN ke UK monetized TikTok account mila with zero tax ad agency access. Account clean hai aur views bhi organically aana shuru hogaye hain.', true, 'approved', now() - interval '6 hours'),
('rev-seed-04', 'Zeeshan Khan (Faisalabad)', 'Lovable Pro & Claude 3.7', 5, 'Full-stack web apps develop karne ke liye Lovable Pro aur Claude Sonnet account liya. Super fast delivery aur replacement guarantee ke sath mila.', true, 'approved', now() - interval '10 hours'),
('rev-seed-05', 'Kashif Mehmood (Islamabad)', '2026 SIM Owner & CDR Report', 5, 'Urgent emergency thi, 15 minute ke andar verified franchise official PDF report WhatsApp par mil gayi. 100% authentic aur confidential records hain.', true, 'approved', now() - interval '15 hours'),
('rev-seed-06', 'Daniyal Sheikh (Multan)', 'ChatGPT Plus (GPT-4o / o3)', 5, 'Official workspace login mila, koi account ban ya captcha issue nahi aya. Customer support bohat fast aur cooperative hai. Shukriya!', true, 'approved', now() - interval '1 day'),
('rev-seed-07', 'Arham Raza (Peshawar)', 'Canva Pro (Lifetime Access)', 5, 'Graphic designing ke liye Canva Pro lifetime access activate karwaya. Premium templates, brand kits aur background remover sab smoothly unlocked hain.', true, 'approved', now() - interval '1 day 4 hours'),
('rev-seed-08', 'Farhan Siddiqui (Sialkot)', 'ElevenLabs 300k Voice Credits', 5, 'Faceless YouTube channel ke liye ElevenLabs voice cloning credits liye. Credits expire nahi hote aur audio quality studio-grade hai. Best investment!', true, 'approved', now() - interval '2 days'),
('rev-seed-09', 'Saad Malik (Gujranwala)', 'SMM YouTube & Insta Growth', 5, 'Non-drop organic engagement service, safe drop guarantee aur instant start. Sohaib Agency Hub Pakistan ka sab se trusted platform hai!', true, 'approved', now() - interval '2 days 6 hours')
ON CONFLICT (id) DO UPDATE 
SET name = EXCLUDED.name, service = EXCLUDED.service, rating = EXCLUDED.rating, comment = EXCLUDED.comment, verified = EXCLUDED.verified, status = EXCLUDED.status;
```

---

## 🚀 VERIFICATION & ACCEPTANCE CRITERIA
1. **Type Safety**: Run `npx tsc --noEmit` — 0 TypeScript errors.
2. **Build Test**: Run `npm run build` — compiles cleanly in < 3 seconds with Turbopack.
3. **Mobile Layout**: Check portrait on iPhone/Android viewport; verify that badges do not overlap each other and do not obscure avatar face/chest.
4. **Marquee**: Verify dual scrolling rows (top scrolls left, bottom scrolls right) with smooth pause on hover.
5. **Admin Gates**: Verify that submitting a review from `/` creates a notification and does NOT appear on the home page until approved via `/saqibadmin`.
