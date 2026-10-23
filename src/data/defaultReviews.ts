export interface ReviewData {
  id: string;
  name: string;
  service: string;
  rating: number;
  comment: string;
  verified: boolean;
  status?: 'pending' | 'approved' | 'rejected';
  created_at?: string;
}

export const DEFAULT_REVIEWS: ReviewData[] = [
  {
    id: 'rev-seed-01',
    name: 'Hamza Tariq (Lahore)',
    service: 'CapCut Pro (1-Year Unlimited)',
    rating: 5,
    comment:
      'Bhai sirf 2 minute mein CapCut Pro activate hogya! 4K HDR export aur AI captions bilkul smooth chal rahe hain PC aur mobile dono par. Highly recommended!',
    verified: true,
    status: 'approved',
    created_at: new Date(Date.now() - 3600000).toISOString()
  },
  {
    id: 'rev-seed-02',
    name: 'Bilal Ahmed (Karachi)',
    service: 'Google Gemini 18-Month Pro',
    rating: 5,
    comment:
      'Direct mere personal Gmail par 1.5 years ka Google One 2TB storage + Gemini Advanced AI activate hua. No VPN needed, best pricing in Pakistan.',
    verified: true,
    status: 'approved',
    created_at: new Date(Date.now() - 3600000 * 3).toISOString()
  },
  {
    id: 'rev-seed-03',
    name: 'Usman Ali (Rawalpindi)',
    service: 'TikTok UK Monetized Account',
    rating: 5,
    comment:
      'Bina kisi VPN ke UK monetized TikTok account mila with zero tax ad agency access. Account clean hai aur views bhi organically aana shuru hogaye hain.',
    verified: true,
    status: 'approved',
    created_at: new Date(Date.now() - 3600000 * 6).toISOString()
  },
  {
    id: 'rev-seed-04',
    name: 'Zeeshan Khan (Faisalabad)',
    service: 'Lovable Pro & Claude 3.7',
    rating: 5,
    comment:
      'Full-stack web apps develop karne ke liye Lovable Pro aur Claude Sonnet account liya. Super fast delivery aur replacement guarantee ke sath mila.',
    verified: true,
    status: 'approved',
    created_at: new Date(Date.now() - 3600000 * 10).toISOString()
  },
  {
    id: 'rev-seed-05',
    name: 'Kashif Mehmood (Islamabad)',
    service: '2026 SIM Owner & CDR Report',
    rating: 5,
    comment:
      'Urgent emergency thi, 15 minute ke andar verified franchise official PDF report WhatsApp par mil gayi. 100% authentic aur confidential records hain.',
    verified: true,
    status: 'approved',
    created_at: new Date(Date.now() - 3600000 * 15).toISOString()
  },
  {
    id: 'rev-seed-06',
    name: 'Daniyal Sheikh (Multan)',
    service: 'ChatGPT Plus (GPT-4o / o3)',
    rating: 5,
    comment:
      'Official workspace login mila, koi account ban ya captcha issue nahi aya. Sohaib Agency ka customer support bohat fast aur cooperative hai. Shukriya!',
    verified: true,
    status: 'approved',
    created_at: new Date(Date.now() - 86400000).toISOString()
  },
  {
    id: 'rev-seed-07',
    name: 'Arham Raza (Peshawar)',
    service: 'Canva Pro (Lifetime Access)',
    rating: 5,
    comment:
      'Graphic designing ke liye Canva Pro lifetime access activate karwaya. Premium templates, brand kits aur background remover sab smoothly unlocked hain.',
    verified: true,
    status: 'approved',
    created_at: new Date(Date.now() - 86400000 * 1.2).toISOString()
  },
  {
    id: 'rev-seed-08',
    name: 'Farhan Siddiqui (Sialkot)',
    service: 'ElevenLabs 300k Voice Credits',
    rating: 5,
    comment:
      'Faceless YouTube channel ke liye ElevenLabs voice cloning credits liye. Credits expire nahi hote aur audio quality studio-grade hai. Best investment!',
    verified: true,
    status: 'approved',
    created_at: new Date(Date.now() - 86400000 * 2).toISOString()
  },
  {
    id: 'rev-seed-09',
    name: 'Saad Malik (Gujranwala)',
    service: 'SMM YouTube & Insta Growth',
    rating: 5,
    comment:
      'Non-drop organic engagement service, safe drop guarantee aur instant start. Sohaib Agency Hub Pakistan ka sab se trusted platform hai!',
    verified: true,
    status: 'approved',
    created_at: new Date(Date.now() - 86400000 * 2.5).toISOString()
  }
];
