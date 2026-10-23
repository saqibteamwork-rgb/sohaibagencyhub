-- =========================================================================
-- SOHAIB AGENCY HUB: 9 DEFAULT VERIFIED CUSTOMER REVIEWS
-- Execute this script in your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/yxrtmnnndhroqbyhmnyl/sql/new
-- =========================================================================

-- Ensure reviews table has status column
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

-- Insert 9 High-Quality Verified Default Reviews
INSERT INTO public.reviews (id, name, service, rating, comment, verified, status, created_at)
VALUES
(
    'rev-seed-01',
    'Hamza Tariq (Lahore)',
    'CapCut Pro (1-Year Unlimited)',
    5,
    'Bhai sirf 2 minute mein CapCut Pro activate hogya! 4K HDR export aur AI captions bilkul smooth chal rahe hain PC aur mobile dono par. Highly recommended!',
    true,
    'approved',
    now() - interval '1 hour'
),
(
    'rev-seed-02',
    'Bilal Ahmed (Karachi)',
    'Google Gemini 18-Month Pro',
    5,
    'Direct mere personal Gmail par 1.5 years ka Google One 2TB storage + Gemini Advanced AI activate hua. No VPN needed, best pricing in Pakistan.',
    true,
    'approved',
    now() - interval '3 hours'
),
(
    'rev-seed-03',
    'Usman Ali (Rawalpindi)',
    'TikTok UK Monetized Account',
    5,
    'Bina kisi VPN ke UK monetized TikTok account mila with zero tax ad agency access. Account clean hai aur views bhi organically aana shuru hogaye hain.',
    true,
    'approved',
    now() - interval '6 hours'
),
(
    'rev-seed-04',
    'Zeeshan Khan (Faisalabad)',
    'Lovable Pro & Claude 3.7',
    5,
    'Full-stack web apps develop karne ke liye Lovable Pro aur Claude Sonnet account liya. Super fast delivery aur replacement guarantee ke sath mila.',
    true,
    'approved',
    now() - interval '10 hours'
),
(
    'rev-seed-05',
    'Kashif Mehmood (Islamabad)',
    '2026 SIM Owner & CDR Report',
    5,
    'Urgent emergency thi, 15 minute ke andar verified franchise official PDF report WhatsApp par mil gayi. 100% authentic aur confidential records hain.',
    true,
    'approved',
    now() - interval '15 hours'
),
(
    'rev-seed-06',
    'Daniyal Sheikh (Multan)',
    'ChatGPT Plus (GPT-4o / o3)',
    5,
    'Official workspace login mila, koi account ban ya captcha issue nahi aya. Sohaib Agency ka customer support bohat fast aur cooperative hai. Shukriya!',
    true,
    'approved',
    now() - interval '1 day'
),
(
    'rev-seed-07',
    'Arham Raza (Peshawar)',
    'Canva Pro (Lifetime Access)',
    5,
    'Graphic designing ke liye Canva Pro lifetime access activate karwaya. Premium templates, brand kits aur background remover sab smoothly unlocked hain.',
    true,
    'approved',
    now() - interval '1 day 4 hours'
),
(
    'rev-seed-08',
    'Farhan Siddiqui (Sialkot)',
    'ElevenLabs 300k Voice Credits',
    5,
    'Faceless YouTube channel ke liye ElevenLabs voice cloning credits liye. Credits expire nahi hote aur audio quality studio-grade hai. Best investment!',
    true,
    'approved',
    now() - interval '2 days'
),
(
    'rev-seed-09',
    'Saad Malik (Gujranwala)',
    'SMM YouTube & Insta Growth',
    5,
    'Non-drop organic engagement service, safe drop guarantee aur instant start. Sohaib Agency Hub Pakistan ka sab se trusted platform hai!',
    true,
    'approved',
    now() - interval '2 days 6 hours'
)
ON CONFLICT (id) DO UPDATE 
SET 
    name = EXCLUDED.name,
    service = EXCLUDED.service,
    rating = EXCLUDED.rating,
    comment = EXCLUDED.comment,
    verified = EXCLUDED.verified,
    status = EXCLUDED.status;
