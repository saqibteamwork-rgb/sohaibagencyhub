import { StoreCategoryMeta, CATEGORY_META } from '../data/defaultCatalog';
import { DepositMethodMeta, DEPOSIT_METHODS } from './paymentProof';

export interface SiteBannerConfig {
  showHeroBanner: boolean;
  showTopStrip: boolean;
  showTopStripWhatsapp?: boolean;
  rgbBorderEnabled: boolean;
  topStripTitle: string;
  // Portrait Avatar & Orbit Badges
  showPortraitPhoto?: boolean;
  portraitUrl: string;
  showPortraitOrbitBadges?: boolean;
  orbitBadge1Enabled?: boolean;
  orbitBadge1Title?: string;
  orbitBadge1Sub?: string;
  orbitBadge2Enabled?: boolean;
  orbitBadge2Title?: string;
  orbitBadge2Sub?: string;
  orbitBadge3Enabled?: boolean;
  orbitBadge3Title?: string;
  orbitBadge3Sub?: string;
  orbitBadge4Enabled?: boolean;
  orbitBadge4Title?: string;
  orbitBadge4Sub?: string;
  // Content Texts & Granular Toggles
  showBadgeText?: boolean;
  badgeText: string;
  showMainTitle?: boolean;
  mainTitle: string;
  highlightTitle: string;
  showDescription?: boolean;
  description: string;
  showHeroFeaturePills?: boolean;
}

export interface SiteContactConfig {
  whatsappNumberClean: string;
  whatsappNumberDisplay: string;
  whatsappDefaultMessage: string;
  supportEmail: string;
  officialWebsiteUrl: string;
  officialWebsiteLabel: string;
  whatsappWidgetEnabled?: boolean;
  whatsappWidgetName?: string;
  whatsappWidgetAvatar?: string;
  whatsappWidgetGreeting?: string;
  whatsappWidgetGreetingUr?: string;
  whatsappWidgetStatus?: string;
}

export interface SocialPlatformItem {
  id: string;
  platform: string;
  label: string;
  handle: string;
  url: string;
  enabled: boolean;
  icon?: string;
  colorGrad?: string;
}

export interface SiteSocialsConfig {
  instagramUrl: string;
  instagramHandle: string;
  tiktokUrl: string;
  tiktokHandle: string;
  facebookUrl: string;
  facebookName: string;
  snapchatUrl: string;
  snapchatHandle: string;
  platforms?: SocialPlatformItem[];
}

export const DEFAULT_SOCIAL_PLATFORMS: SocialPlatformItem[] = [
  {
    id: 'instagram',
    platform: 'instagram',
    label: 'Instagram',
    handle: '@mrsaqib242',
    url: 'https://instagram.com/mrsaqib242',
    enabled: true,
    icon: 'fa-brands fa-instagram',
    colorGrad: 'from-amber-300 via-pink-500 to-purple-600'
  },
  {
    id: 'tiktok',
    platform: 'tiktok',
    label: 'TikTok',
    handle: '@mrsaqib242',
    url: 'https://tiktok.com/@mrsaqib242',
    enabled: true,
    icon: 'fa-brands fa-tiktok',
    colorGrad: 'from-slate-900 to-slate-800'
  },
  {
    id: 'facebook',
    platform: 'facebook',
    label: 'Facebook',
    handle: 'Muhammad Saqib',
    url: 'https://facebook.com/mrsaqib242',
    enabled: true,
    icon: 'fa-brands fa-facebook-f',
    colorGrad: 'from-blue-600 to-indigo-600'
  },
  {
    id: 'snapchat',
    platform: 'snapchat',
    label: 'Snapchat',
    handle: 'mrsaqib242',
    url: 'https://snapchat.com/add/mrsaqib242',
    enabled: true,
    icon: 'fa-brands fa-snapchat',
    colorGrad: 'from-amber-400 to-yellow-500'
  },
  {
    id: 'youtube',
    platform: 'youtube',
    label: 'YouTube',
    handle: '@saqibvisuals',
    url: 'https://youtube.com/@saqibvisuals',
    enabled: true,
    icon: 'fa-brands fa-youtube',
    colorGrad: 'from-red-500 to-rose-600'
  },
  {
    id: 'telegram',
    platform: 'telegram',
    label: 'Telegram',
    handle: '@saqibvisuals',
    url: 'https://t.me/saqibvisuals',
    enabled: true,
    icon: 'fa-brands fa-telegram',
    colorGrad: 'from-sky-400 to-blue-500'
  },
  {
    id: 'whatsapp_channel',
    platform: 'whatsapp_channel',
    label: 'WhatsApp Channel',
    handle: 'Saqib Visuals VIP',
    url: 'https://whatsapp.com/channel/saqibvisuals',
    enabled: true,
    icon: 'fa-brands fa-whatsapp',
    colorGrad: 'from-emerald-500 to-teal-600'
  },
  {
    id: 'github',
    platform: 'github',
    label: 'GitHub',
    handle: '@mrsaqib242',
    url: 'https://github.com/mrsaqib242',
    enabled: false,
    icon: 'fa-brands fa-github',
    colorGrad: 'from-slate-800 to-slate-950'
  },
  {
    id: 'twitter',
    platform: 'twitter',
    label: 'X (Twitter)',
    handle: '@mrsaqib242',
    url: 'https://x.com/mrsaqib242',
    enabled: false,
    icon: 'fa-brands fa-x-twitter',
    colorGrad: 'from-zinc-800 to-black'
  },
  {
    id: 'discord',
    platform: 'discord',
    label: 'Discord Server',
    handle: 'Saqib Community',
    url: 'https://discord.gg/saqibvisuals',
    enabled: false,
    icon: 'fa-brands fa-discord',
    colorGrad: 'from-indigo-500 to-purple-600'
  }
];

export function getActiveSocialPlatforms(socials?: SiteSocialsConfig): SocialPlatformItem[] {
  if (socials?.platforms && Array.isArray(socials.platforms) && socials.platforms.length > 0) {
    return socials.platforms;
  }
  return DEFAULT_SOCIAL_PLATFORMS;
}

export interface SiteFooterConfig {
  brandName: string;
  copyrightTagline: string;
  showQuickLinks: boolean;
}

export interface SiteVisibilityConfig {
  showMarqueeBanner: boolean;
  showStoreWalletBar: boolean;
  showSearchAndCategoryBar: boolean;
  showPortraitOrbitBadges: boolean;
  showHeroFeaturePills: boolean;
  showWebToolsOnStore: boolean;
  showReviewsSection: boolean;
  showFloatingWhatsApp: boolean;
  showFloatingScrollTop: boolean;
  showHeaderRgbToggle: boolean;
  showHeaderWalletPill: boolean;
  showHeaderCartButton: boolean;
  showMobileBottomDock: boolean;
  showMobileQuickBar: boolean;
  showSimDatabaseTracker: boolean;
  showToolsTab: boolean;
  showAboutTab: boolean;
  showFaqsTab: boolean;
  showContactTab: boolean;
  showLoginTab: boolean;
  showPromoBanners?: boolean;
}

export const DEFAULT_SITE_VISIBILITY: SiteVisibilityConfig = {
  showMarqueeBanner: true,
  showStoreWalletBar: true,
  showSearchAndCategoryBar: true,
  showPortraitOrbitBadges: true,
  showHeroFeaturePills: true,
  showWebToolsOnStore: true,
  showReviewsSection: true,
  showFloatingWhatsApp: true,
  showFloatingScrollTop: true,
  showHeaderRgbToggle: true,
  showHeaderWalletPill: true,
  showHeaderCartButton: true,
  showMobileBottomDock: true,
  showMobileQuickBar: true,
  showSimDatabaseTracker: true,
  showToolsTab: true,
  showAboutTab: true,
  showFaqsTab: true,
  showContactTab: true,
  showLoginTab: true,
  showPromoBanners: true
};

export interface SiteSeoConfig {
  metaTitle: string;
  metaDescription: string;
  keywords: string;
  author: string;
  canonicalUrl: string;
  robotsIndex: boolean;
  robotsFollow: boolean;
  ogType: string;
  ogTitle: string;
  ogDescription: string;
  ogImageUrl: string;
  twitterCard: string;
  twitterCreator: string;
  schemaType: string;
}

export const DEFAULT_SITE_SEO: SiteSeoConfig = {
  metaTitle: 'Sohaib Agency Hub — Digital & AI Services, SMM Store & Web Tools',
  metaDescription: 'Instant CapCut Pro, Lovable Pro, Gemini 18M, ChatGPT Plus, TikTok UK/USA Agency Accounts, Franchise SIM Records & SMM Services by Muhammad Saqib.',
  keywords: 'Muhammad Saqib, Saqib Visuals, CapCut Pro Pakistan, SMM Panel Pakistan, Lovable Pro Account, Gemini 18M Pro, ChatGPT Plus & Claude, Pak SIM Database Live, SIM Tracker 2026, NADRA Verification FRC, TikTok Agency Accounts UK USA, Fast USDT EasyPaisa Delivery',
  author: 'Sohaib Agency',
  canonicalUrl: 'https://sohaibagencyhub.vercel.app',
  robotsIndex: true,
  robotsFollow: true,
  ogType: 'website',
  ogTitle: 'Sohaib Agency Hub — Digital & AI Services & SMM Store',
  ogDescription: 'Instant CapCut Pro, Lovable Pro, Gemini 18M, ChatGPT Plus, TikTok UK/USA Agency Accounts, Franchise SIM Records & SMM Services by Muhammad Saqib.',
  ogImageUrl: 'https://ik.imagekit.io/mrsaqib/mrsaqib242-img25_7oG52NZUY.png',
  twitterCard: 'summary_large_image',
  twitterCreator: '@mrsaqib242',
  schemaType: 'WebApplication'
};

export interface SiteStoreBarsConfig {
  showStatusPulseBar?: boolean;
  statusPanelTitle?: string;
  statusPanelBadge?: string;
  chip1Enabled?: boolean;
  chip1Label?: string;
  chip1Value?: string;
  chip2Enabled?: boolean;
  chip2Label?: string;
  chip2Value?: string;
  chip3Enabled?: boolean;
  chip3Label?: string;
  chip3Value?: string;

  showMarquee?: boolean;

  showWalletBar?: boolean;
  walletBalanceLabel?: string;
  walletInstructionText?: string;
  showWalletInstruction?: boolean;
  addPaymentBtnLabel?: string;
  showAddPaymentBtn?: boolean;
  historyBtnLabel?: string;
  showHistoryBtn?: boolean;
  showPendingProofBadge?: boolean;
  currencyPrefix?: string;
  headerPillAddLabel?: string;
  showHeaderWalletPill?: boolean;

  showAcceptedGatewaysCard?: boolean;
  acceptedGatewaysTitle?: string;
  acceptedGatewaysSubtitle?: string;
  showGatewaysWhatsappButton?: boolean;
  showAccountNumbersInCard?: boolean;

  minDepositAmount?: number;
  depositModalTitle?: string;
  depositModalSubtitle?: string;

  showSearchBox?: boolean;
  searchPlaceholder?: string;
  showServicesCountBadge?: boolean;
  showHotSearches?: boolean;
  hotSearchesList?: string;
  showCategoryTabs?: boolean;
}

export const DEFAULT_STORE_BARS_CONFIG: SiteStoreBarsConfig = {
  showStatusPulseBar: true,
  statusPanelTitle: 'SOHAIB AGENCY LIVE PANEL STATUS:',
  statusPanelBadge: 'ALL 3 SERVERS 99.9% ONLINE',
  chip1Enabled: true,
  chip1Label: 'AI Pro Server:',
  chip1Value: '3 Min Avg',
  chip2Enabled: true,
  chip2Label: 'SMM Turbo API:',
  chip2Value: 'Instant Start',
  chip3Enabled: true,
  chip3Label: '2026 SIM/NADRA Desk:',
  chip3Value: '15 Min PDF',

  showMarquee: true,

  showWalletBar: true,
  walletBalanceLabel: '● LIVE ACCOUNT BALANCE:',
  walletInstructionText: 'Add balance via EasyPaisa / JazzCash / Bank (Enter Amount → Select Method → Upload SS → Instant Balance!)',
  showWalletInstruction: true,
  addPaymentBtnLabel: '+ Add Payment / Balance',
  showAddPaymentBtn: true,
  historyBtnLabel: 'History',
  showHistoryBtn: true,
  showPendingProofBadge: true,
  currencyPrefix: 'Rs.',
  headerPillAddLabel: '+Add',
  showHeaderWalletPill: true,

  showAcceptedGatewaysCard: true,
  acceptedGatewaysTitle: 'Accepted Payment Gateways',
  acceptedGatewaysSubtitle: '100% Secure Local & Crypto Verification',
  showGatewaysWhatsappButton: true,
  showAccountNumbersInCard: true,

  minDepositAmount: 50,
  depositModalTitle: 'Add Funds / Top-Up Wallet Balance',
  depositModalSubtitle: 'Enter Amount → Select EasyPaisa/JazzCash → Submit Account Name & Screenshot',

  showSearchBox: true,
  searchPlaceholder: 'Search any service (e.g. Lovable Pro, Gemini 18M, ElevenLabs, CDR, NADRA, Hostinger, USDT)...',
  showServicesCountBadge: true,
  showHotSearches: true,
  hotSearchesList: 'CapCut Pro, Lovable Pro, Gemini 18M, Muse AI 1B, ElevenLabs 300k, TikTok UK/USA, Ad Agency, Call CDR, NADRA FRC, Hostinger 12M, BTC / USDT',
  showCategoryTabs: true
};

export type PromoBannerStyle = 'rose' | 'dark' | 'emerald' | 'amber' | 'cyan' | 'purple';

export interface SitePromoBannerItem {
  id: string;
  enabled: boolean;
  badgeIcon?: string;
  badgeText: string;
  title: string;
  description: string;
  style: PromoBannerStyle;
  position?: 'below_services' | 'above_services' | 'both';
  
  primaryBtnEnabled: boolean;
  primaryBtnText: string;
  primaryBtnAction: 'whatsapp' | 'webtools' | 'addfunds' | 'custom_url';
  primaryBtnCustomUrl?: string;
  primaryBtnIcon?: string;
  
  secondaryBtnEnabled: boolean;
  secondaryBtnText: string;
  secondaryBtnAction: 'webtools' | 'whatsapp' | 'addfunds' | 'custom_url';
  secondaryBtnCustomUrl?: string;
  secondaryBtnIcon?: string;

  imageUrl?: string;
}

export const DEFAULT_PROMO_BANNERS: SitePromoBannerItem[] = [
  {
    id: 'promo-deal-1',
    enabled: true,
    badgeIcon: 'fa-solid fa-bolt',
    badgeText: 'ALL SERVICES AVAILABLE HERE',
    title: 'Need Custom AI Credits, Ad Agency Accounts, NADRA/CDR Info, or USDT?',
    description: 'Message Muhammad Saqib directly on WhatsApp (+92 347 8936242) for wholesale reseller rates, JazzCash / EasyPaisa payment, and instant delivery.',
    style: 'rose',
    position: 'below_services',
    primaryBtnEnabled: true,
    primaryBtnText: 'Deal on WhatsApp',
    primaryBtnAction: 'whatsapp',
    primaryBtnIcon: 'fa-brands fa-whatsapp',
    secondaryBtnEnabled: true,
    secondaryBtnText: 'Open Web Tools Hub',
    secondaryBtnAction: 'webtools',
    secondaryBtnIcon: 'fa-solid fa-screwdriver-wrench'
  }
];

export interface SitePromoPopupConfig {
  enabled: boolean;
  popupType?: 'discount' | 'welcome' | 'notice' | 'custom';
  badgeText: string;
  title: string;
  description: string;
  imageUrl?: string;
  showImage?: boolean;
  couponCode?: string;
  showCoupon?: boolean;
  countdownMinutes?: number;
  showCountdown?: boolean;
  primaryBtnText: string;
  primaryBtnAction: 'whatsapp' | 'addfunds' | 'custom_url';
  primaryBtnUrl?: string;
  secondaryBtnText?: string;
  showOncePerSession: boolean;
}

export const DEFAULT_PROMO_POPUP_CONFIG: SitePromoPopupConfig = {
  enabled: false,
  popupType: 'discount',
  badgeText: '🔥 SPECIAL 20% DISCOUNT',
  title: 'Limited Time Flash Offer — Save 20% Today!',
  description: 'Order any AI Pro Tool, CapCut Pro, or TikTok Agency Account right now and enjoy an instant 20% discount on your first order. WhatsApp Saqib directly!',
  imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
  showImage: true,
  couponCode: 'SAQIB20',
  showCoupon: true,
  countdownMinutes: 15,
  showCountdown: true,
  primaryBtnText: 'Claim 20% Off on WhatsApp',
  primaryBtnAction: 'whatsapp',
  secondaryBtnText: 'Maybe Later',
  showOncePerSession: true,
};

export interface SiteSettingsConfig {
  promoPopup?: SitePromoPopupConfig;
  banner: SiteBannerConfig;
  promoBanners?: SitePromoBannerItem[];
  storeBars?: SiteStoreBarsConfig;
  contact: SiteContactConfig;
  socials: SiteSocialsConfig;
  footer: SiteFooterConfig;
  paymentMethods: DepositMethodMeta[];
  categories: StoreCategoryMeta[];
  visibility?: SiteVisibilityConfig;
  seo?: SiteSeoConfig;
  authorizedDomains?: string[];
}

export const SITE_CONFIG_STORAGE_KEY = 'saqib_visuals_site_config_v1';

export const DEFAULT_SITE_CONFIG: SiteSettingsConfig = {
  banner: {
    showHeroBanner: true,
    showTopStrip: true,
    showTopStripWhatsapp: true,
    rgbBorderEnabled: true,
    topStripTitle: 'SOHAIB AGENCY • OFFICIAL HUB',
    showPortraitPhoto: true,
    portraitUrl: 'https://ik.imagekit.io/mrsaqib/mrsaqib242-img25_7oG52NZUY.png',
    showPortraitOrbitBadges: true,
    orbitBadge1Enabled: true,
    orbitBadge1Title: 'CapCut & Lovable',
    orbitBadge1Sub: 'PRO UNLOCKED',
    orbitBadge2Enabled: true,
    orbitBadge2Title: 'AI Suite',
    orbitBadge2Sub: 'GEMINI • CLAUDE',
    orbitBadge3Enabled: true,
    orbitBadge3Title: 'TikTok UK/USA',
    orbitBadge3Sub: 'ADS & BOOST',
    orbitBadge4Enabled: true,
    orbitBadge4Title: 'SIM & NADRA',
    orbitBadge4Sub: 'CDR • FRC • LIVE',
    showBadgeText: true,
    badgeText: 'ALL DIGITAL, AI, SMM, FRANCHISE & NADRA SERVICES AVAILABLE',
    showMainTitle: true,
    mainTitle: 'Sohaib ',
    highlightTitle: 'Agency Hub',
    showDescription: true,
    description:
      'Get Instant CapCut Pro, Lovable Pro, Gemini 18M, ChatGPT, Claude, Muse AI 1B & ElevenLabs, TikTok UK/USA & Ad Agency Accounts, Franchise SIM/CDR/IMEI Tracking, NADRA FRC/Passport Records & USDT/Video/Graphics!',
    showHeroFeaturePills: true
  },
  promoBanners: DEFAULT_PROMO_BANNERS,
  promoPopup: DEFAULT_PROMO_POPUP_CONFIG,
  storeBars: DEFAULT_STORE_BARS_CONFIG,
  contact: {
    whatsappNumberClean: '923478936242',
    whatsappNumberDisplay: '+92 347 8936242',
    whatsappDefaultMessage: 'Assalam-o-Alaikum Muhammad Saqib! Mujhe apki services chahiye.',
    supportEmail: 'support@saqibvisuals.com',
    officialWebsiteUrl: 'https://sohaibagencyhub.vercel.app',
    officialWebsiteLabel: 'sohaibagencyhub.vercel.app',
    whatsappWidgetEnabled: true,
    whatsappWidgetName: 'Muhammad Saqib',
    whatsappWidgetAvatar: 'https://sohaibagencyhub.vercel.app/saqib-pic.png',
    whatsappWidgetGreeting: 'Assalam-o-Alaikum! 👋 Welcome to Sohaib Agency Hub.<br/>How can I help you today with CapCut Pro, AI Tools, TikTok Ads or Nadra services?',
    whatsappWidgetGreetingUr: 'السلام علیکم! 👋 صہیب ایجنسی ہب میں خوش آمدید۔<br/>آج میں کیپ کٹ پرو، اے آئی ٹولز، ٹک ٹاک ایڈز یا نادرا سروسز میں آپ کی کیا مدد کر سکتا ہوں؟',
    whatsappWidgetStatus: 'Typically replies in ~2 minutes ⚡'
  },
  socials: {
    instagramUrl: 'https://instagram.com/',
    instagramHandle: '@mrsaqib242',
    tiktokUrl: 'https://tiktok.com/',
    tiktokHandle: '@mrsaqib242',
    facebookUrl: 'https://facebook.com/',
    facebookName: 'Muhammad Saqib',
    snapchatUrl: 'https://snapchat.com/',
    snapchatHandle: 'mrsaqib242',
    platforms: DEFAULT_SOCIAL_PLATFORMS
  },
  footer: {
    brandName: '🚀 Sohaib Agency Hub',
    copyrightTagline: '24/7 Instant Delivery • 100% Full Replacement Warranty',
    showQuickLinks: true
  },
  paymentMethods: DEPOSIT_METHODS,
  categories: CATEGORY_META,
  visibility: DEFAULT_SITE_VISIBILITY,
  seo: DEFAULT_SITE_SEO
};


export function deepMergeSiteConfig(raw: unknown): SiteSettingsConfig {
  if (!raw || typeof raw !== 'object') {
    return DEFAULT_SITE_CONFIG;
  }
  const obj = raw as Partial<SiteSettingsConfig>;

  return {
    banner: {
      ...DEFAULT_SITE_CONFIG.banner,
      ...(obj.banner || {}),
    },
        promoPopup: {
      ...DEFAULT_PROMO_POPUP_CONFIG,
      ...(obj.promoPopup || {}),
    },
    promoBanners: Array.isArray(obj.promoBanners) && obj.promoBanners.length > 0 
      ? obj.promoBanners 
      : DEFAULT_SITE_CONFIG.promoBanners,
    storeBars: {
      ...DEFAULT_SITE_CONFIG.storeBars,
      ...(obj.storeBars || {}),
    },
    contact: {
      ...DEFAULT_SITE_CONFIG.contact,
      ...(obj.contact || {}),
    },
    socials: {
      ...DEFAULT_SITE_CONFIG.socials,
      ...(obj.socials || {}),
      platforms: Array.isArray(obj.socials?.platforms) && obj.socials.platforms.length > 0
        ? obj.socials.platforms
        : DEFAULT_SOCIAL_PLATFORMS,
    },
    footer: {
      ...DEFAULT_SITE_CONFIG.footer,
      ...(obj.footer || {}),
    },
    paymentMethods: Array.isArray(obj.paymentMethods) && obj.paymentMethods.length > 0
      ? obj.paymentMethods
      : DEFAULT_SITE_CONFIG.paymentMethods,
    categories: Array.isArray(obj.categories) && obj.categories.length > 0
      ? obj.categories
      : DEFAULT_SITE_CONFIG.categories,
    visibility: {
      ...DEFAULT_SITE_CONFIG.visibility,
      ...(obj.visibility || {}),
    },
    seo: {
      ...DEFAULT_SITE_CONFIG.seo,
      ...(obj.seo || {}),
    },
    authorizedDomains: Array.isArray(obj.authorizedDomains) && obj.authorizedDomains.length > 0
      ? obj.authorizedDomains
      : ['localhost', '127.0.0.1', 'sohaibagencyhub.vercel.app', 'mrsaqib242.vercel.app'],
  };
}
