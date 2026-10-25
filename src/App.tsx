'use client';

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  CategoryId,
  IconType,
  StoreService,
  WebToolItem,
  FaqCategoryId,
  CATEGORY_META,
  DEFAULT_STORE_SERVICES,
  DEFAULT_WEB_TOOLS,
  DEFAULT_FAQS
} from './data/defaultCatalog';
import { ShowcaseSections } from './components/ShowcaseSections';
import { WhatsAppChatWidget } from './components/WhatsAppChatWidget';
import { PromoAnnouncementModal } from './components/PromoAnnouncementModal';
import { MobileStepByStepDrawer } from './components/MobileStepByStepDrawer';
import { getActiveSocialPlatforms } from './types/siteConfig';
import { MarqueeAndPulseBanner, PanelToolsSection } from './components/PanelToolsSection';
import {
  SupportedLang,
  TRANSLATIONS,
  getInitialLanguage,
  saveLanguage
} from './lib/translations';
import {
  PaymentProofRequest,
  DEFAULT_PAYMENT_PROOFS,
  UserAddFundsExperience
} from './components/WalletAndAdminPayments';
import {
  WebsiteUiThemeMode,
  WebsiteFontMode,
  STORE_FONT_PACKS,
  STORE_THEMES_CATALOG
} from './components/AstroNeumorphicDeck';
import { deepMergeSiteConfig } from './types/siteConfig';
import {
  SiteSettingsConfig,
  DEFAULT_SITE_CONFIG,
  DEFAULT_SITE_VISIBILITY,
  DEFAULT_SITE_SEO,
  SITE_CONFIG_STORAGE_KEY,
  SitePromoBannerItem,
  DEFAULT_PROMO_BANNERS,
  getPromoBannerStyleClasses
} from './components/AdminStepByStepSettingsHub';

const AdminStepByStepSettingsHub = React.lazy(() =>
  import('./components/AdminStepByStepSettingsHub').then((m) => ({
    default: m.AdminStepByStepSettingsHub
  }))
);
import {
  BRAND_ICON_OPTIONS as ICON_OPTIONS,
  renderServiceIcon,
  renderOrbVisual,
  renderCategoryIcon,
  resolveSmartIconType,
  SiWhatsapp,
  SiTiktok,
  SiGooglegemini,
  FaSatelliteDish,
  FaSimCard,
  FaRocket,
  FaArrowUpRightFromSquare,
  FaTrashCan,
  FaPenToSquare,
  FaScrewdriverWrench,
  FaBagShopping,
  FaEye
} from './components/BrandIcons';

type TabId = 'store' | 'siminfo' | 'about' | 'faqs' | 'contact' | 'login' | 'saqibadmb';
type PaymentMethod = string;

interface CartItem {
  title: string;
  tier: string;
  target: string;
}

interface SimRecord {
  mobile?: string;
  Mobile?: string;
  number?: string;
  Number?: string;
  phone?: string;
  cnic?: string;
  CNIC?: string;
  nic?: string;
  id_card?: string;
  name?: string;
  Name?: string;
  full_name?: string;
  owner_name?: string;
  network?: string;
  Network?: string;
  operator?: string;
  address?: string;
  Address?: string;
  city?: string;
  location?: string;
}

interface ApiTier {
  id: number;
  name: string;
  badgeText: string;
  badgeClass: string;
  getUrls: (num: string) => string[];
}

const CATALOG_STORAGE_KEY = 'saqib_visuals_catalog_v2';
const TOOLS_STORAGE_KEY = 'saqib_visuals_tools_v1';
const WALLET_BALANCE_STORAGE_KEY = 'saqib_visuals_wallet_balance_v1';
const PAYMENT_PROOFS_STORAGE_KEY = 'saqib_visuals_payment_proofs_v1';
const PRIMARY_WA_NUMBER = '923478936242';

const PLUSH_OPTIONS = [
  { value: 'plush-capcut', label: 'CapCut Indigo Plush', orb: 'from-slate-800 via-indigo-900 to-black' },
  { value: 'plush-ai', label: 'AI Mint / Emerald Plush', orb: 'from-emerald-500 via-teal-500 to-cyan-600' },
  { value: 'plush-tiktok', label: 'TikTok Rose Pink Plush', orb: 'from-rose-500 via-pink-500 to-purple-600' },
  { value: 'plush-fb', label: 'Facebook Sky Blue Plush', orb: 'from-blue-500 to-indigo-600' },
  { value: 'plush-ig', label: 'Instagram Gold / Amber Plush', orb: 'from-amber-400 via-pink-500 to-purple-600' },
  { value: 'plush-snap', label: 'Lavender / Purple Plush', orb: 'from-purple-600 via-violet-600 to-indigo-800' },
  { value: 'plush-whatsapp', label: 'WhatsApp Green Plush', orb: 'from-emerald-500 to-green-700' },
  { value: 'plush-sim-search', label: 'SIM Rose Glass Plush', orb: 'from-pink-500 via-rose-500 to-purple-700' },
  { value: 'plush-srv-2', label: 'Warm Peach Plush', orb: 'from-orange-500 via-amber-600 to-rose-600' },
  { value: 'plush-srv-4', label: 'Ocean Blue Plush', orb: 'from-blue-600 via-sky-600 to-indigo-700' }
];

const API_TIERS: ApiTier[] = [
  {
    id: 1,
    name: 'Dev Shehryar Engine',
    badgeText: 'Server 1: Dev Shehryar (Workers)',
    badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    getUrls: (num) => [
      `https://ft-simdb.ftshehryar10044.workers.dev/ft/api?num=${encodeURIComponent(num)}`,
      `https://ft-nasa.ftshehryar10044.workers.dev/ft/api?q=${encodeURIComponent(num)}`
    ]
  },
  {
    id: 2,
    name: 'Ammar SIM Database',
    badgeText: 'Server 2: Ammar DB (Vercel)',
    badgeClass: 'bg-sky-100 text-sky-800 border-sky-300',
    getUrls: (num) => [
      `https://ammar-sim-database-api-786.vercel.app/api/database?number=${encodeURIComponent(num)}`
    ]
  },
  {
    id: 3,
    name: 'PakData Live Engine',
    badgeText: 'Server 3: PakData Live',
    badgeClass: 'bg-pink-100 text-pink-800 border-pink-300',
    getUrls: (num) => [
      `https://pakdataonline.site.je/sim.php?num=${encodeURIComponent(num)}`
    ]
  }
];

function renderNetworkBadge(network?: string) {
  const net = String(network || '').toLowerCase();
  if (net.includes('jazz') || net.includes('mobilink')) {
    return <span className="px-2.5 py-0.5 rounded-full bg-red-100 text-red-700 border border-red-200 text-[10px] font-extrabold uppercase">Jazz</span>;
  } else if (net.includes('telenor')) {
    return <span className="px-2.5 py-0.5 rounded-full bg-sky-100 text-sky-700 border border-sky-200 text-[10px] font-extrabold uppercase">Telenor</span>;
  } else if (net.includes('zong')) {
    return <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 border border-emerald-200 text-[10px] font-extrabold uppercase">Zong</span>;
  } else if (net.includes('ufone')) {
    return <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-700 border border-amber-200 text-[10px] font-extrabold uppercase">Ufone</span>;
  } else if (net.includes('warid')) {
    return <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-700 border border-blue-200 text-[10px] font-extrabold uppercase">Warid</span>;
  }
  return <span className="px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-700 border border-purple-200 text-[10px] font-extrabold uppercase">{network || 'GSM'}</span>;
}

function extractSimRecords(json: any): SimRecord[] {
  if (!json) return [];
  let list: any[] = [];
  if (Array.isArray(json)) list = json;
  else if (Array.isArray(json.sim_details)) list = json.sim_details;
  else if (Array.isArray(json.data)) list = json.data;
  else if (Array.isArray(json.result)) list = json.result;
  else if (Array.isArray(json.records)) list = json.records;
  else if (Array.isArray(json.results)) list = json.results;
  else if (json.data && typeof json.data === 'object' && !Array.isArray(json.data)) list = [json.data];
  else if (json.sim_details && typeof json.sim_details === 'object' && !Array.isArray(json.sim_details)) list = [json.sim_details];
  else if (json.result && typeof json.result === 'object' && !Array.isArray(json.result)) list = [json.result];
  else if (json.name || json.Name || json.cnic || json.CNIC || json.mobile || json.Mobile) list = [json];

  return list.filter((item) => {
    if (!item || typeof item !== 'object') return false;
    return Boolean(
      item.name || item.Name || item.full_name ||
      item.cnic || item.CNIC || item.nic ||
      item.mobile || item.Mobile || item.number || item.Number || item.phone
    );
  });
}

async function fetchWithTimeout(url: string, timeoutMs = 7000) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(id);
    return response;
  } catch (err) {
    clearTimeout(id);
    throw err;
  }
}

async function queryEndpoint(rawUrl: string) {
  const attempts = [
    rawUrl,
    `https://api.allorigins.win/raw?url=${encodeURIComponent(rawUrl)}`,
    `https://corsproxy.io/?url=${encodeURIComponent(rawUrl)}`
  ];
  for (const url of attempts) {
    try {
      const res = await fetchWithTimeout(url, 6500);
      if (!res.ok) continue;
      const text = await res.text();
      if (!text || text.includes('<html><body><script')) continue;
      try {
        const parsed = JSON.parse(text);
        if (parsed) return parsed;
      } catch {
        const match = text.match(/\{[\s\S]*\}/);
        if (match) {
          const parsed = JSON.parse(match[0]);
          if (parsed) return parsed;
        }
      }
    } catch {
      // Ignore and try next proxy
    }
  }
  return null;
}

export function formatTierToString(rawTier: unknown): string {
  if (!rawTier) return '';
  if (typeof rawTier === 'string') return rawTier;
  if (typeof rawTier === 'object' && rawTier !== null) {
    const obj = rawTier as { name?: string; title?: string; label?: string; price?: number | string };
    const name = obj.name || obj.title || obj.label || '';
    const price = obj.price !== undefined ? ` — Rs. ${Number(obj.price).toLocaleString()}` : '';
    return (name + price).trim() || JSON.stringify(rawTier);
  }
  return String(rawTier);
}

export interface AppProps {
  initialServices?: StoreService[];
  initialTools?: WebToolItem[];
  initialConfig?: SiteSettingsConfig;
  initialReviews?: any[];
  initialTab?: TabId;
  initialAdminToken?: string | null;
}

export default function App({
  initialServices,
  initialTools,
  initialConfig,
  initialReviews,
  initialTab,
  initialAdminToken,
}: AppProps = {}) {
  // Admin Cryptographic Session Token (Server Verified)
  const [adminToken, setAdminToken] = useState<string | null>(() => {
    if (initialAdminToken) return initialAdminToken;
    if (typeof window !== 'undefined') {
      return localStorage.getItem('saqib_admin_token');
    }
    return null;
  });
  const siteConfigSaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [isSavingSiteConfig, setIsSavingSiteConfig] = useState<boolean>(false);
  const isClientStorageReadyRef = useRef<boolean>(false);

  // Dynamic Reviews State (Real Database Connected)
  const [reviews, setReviews] = useState<any[]>(() => initialReviews || []);

  useEffect(() => {
    fetch('/api/reviews')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.success && Array.isArray(data.reviews)) {
          setReviews(data.reviews);
        }
      })
      .catch(() => {});
  }, []);

  const getAdminHeaders = (): Record<string, string> => {
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    const token =
      adminToken ||
      (typeof window !== 'undefined' ? localStorage.getItem('saqib_admin_token') : null);
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  };

  // Dynamic Catalog State (seeded from SSR initialServices or defaults)
  const [servicesCatalog, setServicesCatalog] = useState<StoreService[]>(() => {
    if (initialServices && initialServices.length > 0) {
      return initialServices.map((srv: StoreService) => ({
        ...srv,
        iconType: resolveSmartIconType(srv.iconType, `${srv.id} ${srv.title}`)
      }));
    }
    return DEFAULT_STORE_SERVICES;
  });

  useEffect(() => {
    if (!isClientStorageReadyRef.current) return;
    try {
      localStorage.setItem(CATALOG_STORAGE_KEY, JSON.stringify(servicesCatalog));
    } catch {
      // Ignore storage quota errors
    }
  }, [servicesCatalog]);

  // Dynamic Web Tools Catalog State (seeded from SSR initialTools or defaults)
  const [webToolsCatalog, setWebToolsCatalog] = useState<WebToolItem[]>(() => {
    if (initialTools && initialTools.length > 0) {
      return initialTools;
    }
    return DEFAULT_WEB_TOOLS;
  });

  useEffect(() => {
    if (!isClientStorageReadyRef.current) return;
    try {
      localStorage.setItem(TOOLS_STORAGE_KEY, JSON.stringify(webToolsCatalog));
    } catch {
      // Ignore storage quota errors
    }
  }, [webToolsCatalog]);

  // Global Site Settings Config (seeded from SSR initialConfig or defaults)
  const [siteConfig, setSiteConfig] = useState<SiteSettingsConfig>(() => {
    if (initialConfig) {
      return initialConfig;
    }
    return DEFAULT_SITE_CONFIG;
  });

  // Hydrate from browser localStorage if a customized config was saved locally
  useEffect(() => {
    try {
      const cached = localStorage.getItem(SITE_CONFIG_STORAGE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed && typeof parsed === 'object') {
          setSiteConfig((prev) => deepMergeSiteConfig({ ...prev, ...parsed }));
        }
      }
    } catch {}
  }, []);

  // Dynamic White-Label Brand & Owner Names (Synced automatically from Hero Title)
  const brandOwnerName = siteConfig.banner?.mainTitle?.trim() || 'Sohaib';
  const brandAccentName = siteConfig.banner?.highlightTitle?.trim().replace(/^[—\-\s]+/, '') || 'Saqib Visuals';
  const fullBrandTitle = `${brandOwnerName} ${siteConfig.banner?.highlightTitle?.trim() || ''}`.trim();

  // Check if owner name or accent was customized from default "Muhammad Saqib"
  const isCustomOwner = React.useMemo(() => {
    return Boolean(brandOwnerName && !/^(Muhammad\s+Saqib|Saqib)$/i.test(brandOwnerName));
  }, [brandOwnerName]);

  const isCustomAccent = React.useMemo(() => {
    return Boolean(brandAccentName && !/^(Saqib\s+Visuals|Visuals\s+Hub|Visuals)$/i.test(brandAccentName));
  }, [brandAccentName]);

  // Dynamic Top Strip Title: automatically mirrors the owner name & brand accent unless custom-overridden
  const effectiveTopStripTitle = React.useMemo(() => {
    const raw = (siteConfig.banner?.topStripTitle || '').trim();
    const isDefaultSaqib = !raw || /MUHAMMAD\s+SAQIB|VISUALS\s+HUB/i.test(raw);

    if ((isCustomOwner || isCustomAccent) && isDefaultSaqib) {
      if (brandOwnerName && brandAccentName) {
        return `${brandOwnerName.toUpperCase()} • ${brandAccentName.toUpperCase()}`;
      }
      return brandOwnerName.toUpperCase();
    }

    if (!raw) {
      return `${brandOwnerName.toUpperCase()} • ${brandAccentName.toUpperCase()}`;
    }

    return raw;
  }, [siteConfig.banner?.topStripTitle, brandOwnerName, brandAccentName, isCustomOwner, isCustomAccent]);

  const siteVisibility = {
    ...DEFAULT_SITE_VISIBILITY,
    ...(siteConfig.visibility || {})
  };

  const allStoreCategories =
    siteConfig.categories && siteConfig.categories.length > 0
      ? siteConfig.categories
      : CATEGORY_META;
  const visibleStoreCategories = allStoreCategories.filter((cat) => !cat.hidden);
  const hiddenCategoryIdSet = new Set(
    allStoreCategories.filter((cat) => cat.hidden).map((cat) => cat.id)
  );

  useEffect(() => {
    try {
      localStorage.setItem(SITE_CONFIG_STORAGE_KEY, JSON.stringify(siteConfig));
    } catch {
      // Ignore storage quota errors
    }
    const isRgbOn = siteConfig.banner.rgbBorderEnabled !== false;
    document.body.classList.toggle('rgb-light-on', isRgbOn);

    // Sync HTML Page Title, Meta Description, Keywords & Social OpenGraph Tags
    const seo = {
      ...DEFAULT_SITE_SEO,
      ...(siteConfig.seo || {})
    };

    if (seo.metaTitle) {
      document.title = seo.metaTitle;
    }

    const setMetaTag = (name: string, content: string, isProp = false) => {
      const attr = isProp ? 'property' : 'name';
      let el = document.querySelector(`meta[${attr}="${name}"]`);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr, name);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    setMetaTag('description', seo.metaDescription || '');
    setMetaTag('keywords', seo.keywords || '');
    setMetaTag('author', seo.author || 'Muhammad Saqib');
    setMetaTag(
      'robots',
      `${seo.robotsIndex !== false ? 'index' : 'noindex'}, ${seo.robotsFollow !== false ? 'follow' : 'nofollow'}`
    );

    // Canonical link tag
    const currentOrigin =
      typeof window !== 'undefined'
        ? window.location.origin
        : 'https://mrsaqib242.vercel.app';
    const effectiveCanonical = seo.canonicalUrl?.trim() || currentOrigin;
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', effectiveCanonical);

    // OpenGraph Tags
    setMetaTag('og:title', seo.ogTitle || seo.metaTitle || '', true);
    setMetaTag('og:description', seo.ogDescription || seo.metaDescription || '', true);
    setMetaTag('og:type', seo.ogType || 'website', true);
    setMetaTag('og:url', effectiveCanonical, true);
    setMetaTag('og:image', seo.ogImageUrl || siteConfig.banner.portraitUrl || '', true);
    setMetaTag('og:site_name', siteConfig.footer.brandName || 'Sohaib Agency Hub', true);

    // Twitter / X Tags
    setMetaTag('twitter:card', seo.twitterCard || 'summary_large_image');
    setMetaTag('twitter:title', seo.ogTitle || seo.metaTitle || '');
    setMetaTag('twitter:description', seo.ogDescription || seo.metaDescription || '');
    setMetaTag('twitter:image', seo.ogImageUrl || siteConfig.banner.portraitUrl || '');
    setMetaTag('twitter:creator', seo.twitterCreator || '@mrsaqib242');

    // Schema.org JSON-LD Structured Data script
    let scriptTag = document.getElementById('saqib-seo-jsonld') as HTMLScriptElement | null;
    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.id = 'saqib-seo-jsonld';
      scriptTag.type = 'application/ld+json';
      document.head.appendChild(scriptTag);
    }
    const schemaJson = {
      '@context': 'https://schema.org',
      '@type': seo.schemaType || 'WebApplication',
      name: seo.metaTitle || 'Sohaib Agency Hub',
      description: seo.metaDescription || '',
      url: effectiveCanonical,
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'All',
      author: {
        '@type': 'Person',
        name: seo.author || 'Sohaib Agency'
      }
    };
    scriptTag.text = JSON.stringify(schemaJson);
  }, [siteConfig]);

  const activeWaNumberClean =
    siteConfig.contact.whatsappNumberClean.replace(/[^0-9]/g, '') || PRIMARY_WA_NUMBER;
  const activeWaNumberDisplay =
    siteConfig.contact.whatsappNumberDisplay || '+92 347 8936242';

  const [activeTab, setActiveTab] = useState<TabId>(initialTab || 'store');
  const [currentCategory, setCurrentCategory] = useState<CategoryId>('all');
  const [storeSearchQuery, setStoreSearchQuery] = useState<string>('');
  const [selectedTiers, setSelectedTiers] = useState<Record<string, number>>({});
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [shoppingCart, setShoppingCart] = useState<CartItem[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Order Modal State
  const [activeOrderService, setActiveOrderService] = useState<StoreService | null>(null);
  const [modalTierValue, setModalTierValue] = useState<string>('');
  const [modalTargetInput, setModalTargetInput] = useState<string>('');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod>('EasyPaisa');

  // Coupon Code & Promo Discount State for Order Modal
  const [orderCouponInput, setOrderCouponInput] = useState<string>('');
  const [isApplyingOrderCoupon, setIsApplyingOrderCoupon] = useState<boolean>(false);
  const [appliedOrderCoupon, setAppliedOrderCoupon] = useState<{
    code: string;
    discountType: string;
    discountValue: number;
    discountAmount: number;
    originalAmount: number;
    finalAmount: number;
    description?: string;
  } | null>(null);
  const [orderCouponError, setOrderCouponError] = useState<string | null>(null);

  // Cart Coupon Code State
  const [cartCouponInput, setCartCouponInput] = useState<string>('');
  const [isApplyingCartCoupon, setIsApplyingCartCoupon] = useState<boolean>(false);
  const [appliedCartCoupon, setAppliedCartCoupon] = useState<{
    code: string;
    discountType: string;
    discountValue: number;
    discountAmount: number;
    originalAmount: number;
    finalAmount: number;
    description?: string;
  } | null>(null);
  const [cartCouponError, setCartCouponError] = useState<string | null>(null);

  // Other Modals & Mobile Grid Layout State (Defaults to 2-Column Mobile Grid)
  const [cartModalOpen, setCartModalOpen] = useState<boolean>(false);
  const [whatsAppWidgetOpen, setWhatsAppWidgetOpen] = useState<boolean>(false);

  // Internationalization: Language Switcher (English 'en' vs Urdu 'ur')
  const [siteLang, setSiteLang] = useState<SupportedLang>('en');

  useEffect(() => {
    const saved = getInitialLanguage();
    setSiteLang(saved);
  }, []);

  const toggleLanguage = () => {
    const nextLang = siteLang === 'en' ? 'ur' : 'en';
    setSiteLang(nextLang);
    saveLanguage(nextLang);
    showToast(nextLang === 'ur' ? '🇵🇰 اردو زبان فعال کر دی گئی!' : '🇬🇧 Switched to English mode!');
  };

  const t = TRANSLATIONS[siteLang];
  const [posterModalOpen, setPosterModalOpen] = useState<boolean>(false);
  const [mobileGridCols, setMobileGridCols] = useState<2 | 1>(2);

  // SIM Tool State
  const [simInput, setSimInput] = useState<string>('');
  const [simLoading, setSimLoading] = useState<boolean>(false);
  const [simProgress, setSimProgress] = useState<number>(15);
  const [simLoaderServerStatus, setSimLoaderServerStatus] = useState<string>('Initiating Server 1 (Dev Shehryar)...');
  const [simRecords, setSimRecords] = useState<SimRecord[]>([]);
  const [simLastQuery, setSimLastQuery] = useState<string>('');
  const [simActiveTier, setSimActiveTier] = useState<ApiTier | null>(null);
  const [simErrorMsg, setSimErrorMsg] = useState<string | null>(null);

  // FAQs State
  const [faqCategory, setFaqCategory] = useState<FaqCategoryId>('all');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // Contact Support Ticket State
  const [contactName, setContactName] = useState<string>('');
  const [contactPhone, setContactPhone] = useState<string>('');
  const [contactDept, setContactDept] = useState<string>('AI & Pro Apps (CapCut, Lovable, Gemini, ChatGPT)');
  const [contactPriority, setContactPriority] = useState<string>('⚡ Urgent (Instant Deal)');
  const [contactMsg, setContactMsg] = useState<string>('');

  // VIP Auth, Dashboard & Admin Service Manager State
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [authName, setAuthName] = useState<string>('');
  const [authIdentifier, setAuthIdentifier] = useState<string>('');
  const [authPassword, setAuthPassword] = useState<string>('');
  const [authRole, setAuthRole] = useState<string>('Regular Customer (Free)');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [vipUser, setVipUser] = useState<{ name: string; identifier: string } | null>(null);
  const [vipDashSubTab, setVipDashSubTab] = useState<'overview' | 'admin'>('admin');
  const [loginPortalSection, setLoginPortalSection] = useState<'auth' | 'wallet'>('auth');

  // Live User Wallet Balance & Submitted Payment Proofs State (persisted in localStorage)
  const [walletBalance, setWalletBalance] = useState<number>(0);
  const [paymentProofs, setPaymentProofs] = useState<PaymentProofRequest[]>([]);

  const [addFundsModalOpen, setAddFundsModalOpen] = useState<boolean>(false);
  const [themeModalOpen, setThemeModalOpen] = useState<boolean>(false);
  const [previewScreenshotProof, setPreviewScreenshotProof] =
    useState<PaymentProofRequest | null>(null);

  useEffect(() => {
    if (!isClientStorageReadyRef.current) return;
    try {
      localStorage.setItem(WALLET_BALANCE_STORAGE_KEY, String(walletBalance));
    } catch {
      // Ignore quota errors
    }
  }, [walletBalance]);

  useEffect(() => {
    if (!isClientStorageReadyRef.current) return;
    try {
      localStorage.setItem(PAYMENT_PROOFS_STORAGE_KEY, JSON.stringify(paymentProofs));
    } catch {
      // Ignore quota errors
    }
  }, [paymentProofs]);

  // Real-time Cloud Synchronization with Supabase
  useEffect(() => {
    // 1. Fetch Cloud Services
    fetch('/api/services')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.services) && data.services.length > 0) {
          setServicesCatalog(
            data.services.map((srv: StoreService) => ({
              ...srv,
              iconType: resolveSmartIconType(srv.iconType, `${srv.id} ${srv.title}`)
            }))
          );
        }
      })
      .catch(() => {});

    // 2. Fetch Cloud Site Config
    fetch('/api/site-config')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.config) {
          const localRaw = typeof window !== 'undefined' ? localStorage.getItem(SITE_CONFIG_STORAGE_KEY) : null;
          if (localRaw) {
            try {
              const localParsed = JSON.parse(localRaw);
              const localMain = localParsed.banner?.mainTitle?.trim();
              const serverMain = data.config.banner?.mainTitle?.trim();
              if (localMain && !/^(Muhammad\s+Saqib|Saqib)$/i.test(localMain) && (/^(Muhammad\s+Saqib|Saqib)$/i.test(serverMain || '') || !serverMain)) {
                const merged = deepMergeSiteConfig({ ...data.config, ...localParsed });
                setSiteConfig(merged);
                saveSiteConfigToCloud(merged, false);
                return;
              }
            } catch {}
          }
          setSiteConfig(data.config);
          try {
            localStorage.setItem(SITE_CONFIG_STORAGE_KEY, JSON.stringify(data.config));
          } catch {}
        }
      })
      .catch(() => {});

    // 3. Fetch Cloud Payment Proofs
    fetch('/api/payments')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.proofs)) {
          setPaymentProofs(data.proofs);
        }
      })
      .catch(() => {});

    // 4. Fetch Cloud Wallet Balance
    const targetUserId = vipUser?.identifier;
    if (targetUserId) {
    fetch(`/api/wallet?userId=${encodeURIComponent(targetUserId)}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && typeof data.balance === 'number') {
          setWalletBalance(data.balance);
        }
      })
      .catch(() => {});
    }

    // 5. Fetch Cloud Web Tools
    fetch('/api/tools')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.tools) && data.tools.length > 0) {
          setWebToolsCatalog(data.tools);
        }
      })
      .catch(() => {});
  }, [vipUser?.identifier]);

  // Admin Command Center Mode ('ui' | 'payments' | 'tools' | 'services')
  const [adminStudioMode, setAdminStudioMode] = useState<'ui' | 'payments' | 'tools' | 'services'>('ui');

  // Global Store UI Theme Mode ('astro-neu' | 'pink-acrylic' | 'liquid-champagne' | 'pastel-jelly' | 'neo-gray-dark' | 'neo-blue-dark')
  const [websiteUiMode, setWebsiteUiMode] = useState<WebsiteUiThemeMode>('astro-neu');

  useEffect(() => {
    if (!isClientStorageReadyRef.current) return;
    try {
      localStorage.setItem('saqib_visuals_ui_theme_v1', websiteUiMode);
    } catch {
      // Ignore storage quota errors
    }
    document.body.classList.remove(
      'theme-astro-neu',
      'theme-liquid-champagne',
      'theme-pastel-jelly',
      'theme-neo-gray-dark',
      'theme-neo-blue-dark'
    );
    if (websiteUiMode === 'astro-neu') {
      document.body.classList.add('theme-astro-neu');
    } else if (websiteUiMode === 'liquid-champagne') {
      document.body.classList.add('theme-liquid-champagne');
    } else if (websiteUiMode === 'pastel-jelly') {
      document.body.classList.add('theme-pastel-jelly');
    } else if (websiteUiMode === 'neo-gray-dark') {
      document.body.classList.add('theme-neo-gray-dark');
    } else if (websiteUiMode === 'neo-blue-dark') {
      document.body.classList.add('theme-neo-blue-dark');
    }
  }, [websiteUiMode]);

  // Global Store Font & Typography Pack Mode (Independent of the 4 UI Themes)
  const [websiteFontMode, setWebsiteFontMode] = useState<WebsiteFontMode>('tech-modern');

  useEffect(() => {
    if (!isClientStorageReadyRef.current) return;
    try {
      localStorage.setItem('saqib_website_font_mode_v1', websiteFontMode);
    } catch {
      // Ignore storage quota errors
    }
    document.body.classList.remove(
      'font-pack-tech-modern',
      'font-pack-cute-plush',
      'font-pack-luxury-serif',
      'font-pack-bold-syne',
      'font-pack-cyber-orbitron',
      'font-pack-clean-poppins'
    );
    document.body.classList.add(`font-pack-${websiteFontMode}`);
  }, [websiteFontMode]);

  // Client-Side Safe Hydration Mount: Synchronizes client localStorage after initial SSR mount
  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        const path = window.location.pathname.toLowerCase();
        const hash = window.location.hash.toLowerCase();
        const search = window.location.search.toLowerCase();
        if (path.includes('saqibadmb') || hash.includes('saqibadmb') || search.includes('saqibadmb') || path.includes('saqibadmin')) {
          setActiveTab('saqibadmb');
        } else if (path.includes('contact')) {
          setActiveTab('contact');
        } else if (path.includes('login')) {
          setActiveTab('login');
        } else if (path.includes('about')) {
          setActiveTab('about');
        } else if (path.includes('faqs') || path.includes('faq')) {
          setActiveTab('faqs');
        } else if (path.includes('siminfo')) {
          setActiveTab('siminfo');
        }

        const savedToken = localStorage.getItem('saqib_admin_token');
        if (savedToken) setAdminToken(savedToken);

        const savedBalance = localStorage.getItem(WALLET_BALANCE_STORAGE_KEY);
        if (savedBalance !== null) {
          const parsed = Number(savedBalance);
          if (!Number.isNaN(parsed) && parsed >= 0) setWalletBalance(parsed === 1800 ? 0 : parsed);
        }

        const savedProofs = localStorage.getItem(PAYMENT_PROOFS_STORAGE_KEY);
        if (savedProofs) {
          try {
            const parsed = JSON.parse(savedProofs);
            if (Array.isArray(parsed)) {
              const realOnly = parsed.filter((p) => p && p.id !== 'DEP-9042' && p.id !== 'DEP-9038');
              setPaymentProofs(realOnly);
              localStorage.setItem(PAYMENT_PROOFS_STORAGE_KEY, JSON.stringify(realOnly));
            }
          } catch {
            localStorage.removeItem(PAYMENT_PROOFS_STORAGE_KEY);
          }
        }

        const savedTheme = localStorage.getItem('saqib_visuals_ui_theme_v1') as WebsiteUiThemeMode;
        if (
          savedTheme &&
          ['astro-neu', 'pink-acrylic', 'liquid-champagne', 'pastel-jelly', 'neo-gray-dark', 'neo-blue-dark'].includes(savedTheme)
        ) {
          setWebsiteUiMode(savedTheme);
          document.body.classList.remove(
            'theme-astro-neu',
            'theme-liquid-champagne',
            'theme-pastel-jelly',
            'theme-neo-gray-dark',
            'theme-neo-blue-dark'
          );
          document.body.classList.add(`theme-${savedTheme}`);
        }

        const savedFont = localStorage.getItem('saqib_website_font_mode_v1') as WebsiteFontMode;
        if (
          savedFont &&
          ['tech-modern', 'cute-plush', 'luxury-serif', 'bold-syne', 'cyber-orbitron', 'clean-poppins', 'system'].includes(savedFont)
        ) {
          setWebsiteFontMode(savedFont);
          document.body.classList.remove(
            'font-pack-tech-modern',
            'font-pack-cute-plush',
            'font-pack-luxury-serif',
            'font-pack-bold-syne',
            'font-pack-cyber-orbitron',
            'font-pack-clean-poppins'
          );
          document.body.classList.add(`font-pack-${savedFont}`);
        }
      }
    } catch {
      // Storage unavailable or blocked
    } finally {
      isClientStorageReadyRef.current = true;
    }
  }, []);

  // Admin Service Manager Form State
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);
  const [adminTitle, setAdminTitle] = useState<string>('');
  const [adminCategory, setAdminCategory] = useState<Exclude<CategoryId, 'all'>>('capcut_ai');
  const [adminBadge, setAdminBadge] = useState<string>('🔥 HOT SERVICE');
  const [adminDesc, setAdminDesc] = useState<string>('');
  const [adminPlush, setAdminPlush] = useState<string>('plush-capcut');
  const [adminIconType, setAdminIconType] = useState<IconType>('wand');
  const [adminCustomIconUrl, setAdminCustomIconUrl] = useState<string>('');
  const [adminDirectToolUrl, setAdminDirectToolUrl] = useState<string>('');
  const [adminInputLabel, setAdminInputLabel] = useState<string>('Enter Your WhatsApp Number or Email:');
  const [adminPlaceholder, setAdminPlaceholder] = useState<string>('0300-1234567 or email@gmail.com');
  const [adminTiersText, setAdminTiersText] = useState<string>(
    '1 Month Package — Rs. 500\n6 Months Package — Rs. 2,200\n1 Year Full Warranty — Rs. 3,800'
  );
  const [adminSearchFilter, setAdminSearchFilter] = useState<string>('');

  // Admin Live Web Tool Manager Form State
  const [editingToolId, setEditingToolId] = useState<string | null>(null);
  const [toolTitle, setToolTitle] = useState<string>('');
  const [toolUrl, setToolUrl] = useState<string>('');
  const [toolIconUrl, setToolIconUrl] = useState<string>('');
  const [toolDesc, setToolDesc] = useState<string>('');
  const [toolBadge, setToolBadge] = useState<string>('⚡ LIVE WEB TOOL');
  const [toolButtonLabel, setToolButtonLabel] = useState<string>('Open Live Tool');
  const [toolPlush, setToolPlush] = useState<string>('plush-ai');
  const [toolIconType, setToolIconType] = useState<IconType>('wand');
  const [toolOpenMode, setToolOpenMode] = useState<'new_tab' | 'embed_modal' | 'sim_tab'>('new_tab');
  const [toolSearchFilter, setToolSearchFilter] = useState<string>('');
  const [activeEmbeddedTool, setActiveEmbeddedTool] = useState<WebToolItem | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const toastTimeoutRef = useRef<number | null>(null);
  const simInputRef = useRef<HTMLInputElement | null>(null);
  const modalInputRef = useRef<HTMLInputElement | null>(null);
  const scrollProgressBarRef = useRef<HTMLDivElement | null>(null);
  const scrollTopBtnRef = useRef<HTMLButtonElement | null>(null);

  const playPopSound = (freq = 520) => {
    if (!soundEnabled) return;
    try {
      if (!audioCtxRef.current) {
        const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        audioCtxRef.current = new AudioCtx();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.35, ctx.currentTime + 0.065);
      gain.gain.setValueAtTime(0.06, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.07);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.075);
    } catch {
      // Ignore audio errors on restricted autoplay
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    if (toastTimeoutRef.current) {
      window.clearTimeout(toastTimeoutRef.current);
    }
    toastTimeoutRef.current = window.setTimeout(() => {
      setToastMessage(null);
    }, 2600);
  };

  const handleAddReview = async (reviewData: {
    name: string;
    service: string;
    rating: number;
    comment: string;
    verified?: boolean;
  }) => {
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: getAdminHeaders(),
        body: JSON.stringify(reviewData),
      });
      const data = await res.json();
      if (data && data.success && data.review) {
        if (data.pendingApproval) {
          showToast('Shukriya! Review submit hogya hai aur admin approval ke baad live display hoga.');
        } else {
          setReviews((prev) => [data.review, ...prev]);
          showToast('Review submitted successfully! Shukriya!');
        }
        return true;
      } else {
        showToast(data.error || 'Failed to submit review');
        return false;
      }
    } catch {
      showToast('Network error submitting review');
      return false;
    }
  };

  const handleDeleteReview = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this review from the database?')) {
      return false;
    }
    try {
      const res = await fetch(`/api/reviews?id=${encodeURIComponent(id)}`, {
        method: 'DELETE',
        headers: getAdminHeaders(),
      });
      const data = await res.json();
      if (data && data.success) {
        setReviews((prev) => prev.filter((r) => r.id !== id));
        showToast('Review deleted from database');
        return true;
      } else {
        showToast(data.error || 'Failed to delete review');
        return false;
      }
    } catch {
      showToast('Network error deleting review');
      return false;
    }
  };

  const handleToggleVerifiedReview = async (id: string, currentStatus: boolean) => {
    try {
      const res = await fetch('/api/reviews', {
        method: 'PATCH',
        headers: getAdminHeaders(),
        body: JSON.stringify({ id, verified: !currentStatus }),
      });
      const data = await res.json();
      if (data && data.success && data.review) {
        setReviews((prev) =>
          prev.map((r) => (r.id === id ? { ...r, verified: !currentStatus } : r))
        );
        showToast(`Review marked as ${!currentStatus ? 'Verified ✓' : 'Pending ⏳'}`);
        return true;
      } else {
        showToast(data.error || 'Failed to update review status');
        return false;
      }
    } catch {
      showToast('Network error updating review');
      return false;
    }
  };

  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    showToast(next ? 'Tactile UI Sounds Enabled' : 'UI Sounds Muted');
    if (next) playPopSound(660);
  };

  const rgbBorderEnabled = siteConfig.banner.rgbBorderEnabled !== false;

  const toggleRgbBorderLight = () => {
    const next = !rgbBorderEnabled;
    playPopSound(next ? 740 : 500);
    setSiteConfig((prev) => ({
      ...prev,
      banner: { ...prev.banner, rgbBorderEnabled: next }
    }));
    showToast(
      next
        ? '🌈 Soft Light RGB Borders ON! (Portfolio & Cards)'
        : '⚪ Soft Light RGB Borders OFF!'
    );
  };

  const triggerConfettiBurst = () => {
    playPopSound(880);
    showToast(`🚀 ${fullBrandTitle} — ${servicesCatalog.length} Digital & Franchise Services`);
  };

  const allPromoBanners: SitePromoBannerItem[] =
    siteConfig.promoBanners && siteConfig.promoBanners.length > 0
      ? siteConfig.promoBanners
      : DEFAULT_PROMO_BANNERS;

  const handlePromoBannerAction = (
    action: string,
    customUrl?: string,
    bannerTitle?: string
  ) => {
    playPopSound(660);
    if (action === 'webtools') {
      switchTab('siminfo');
      showToast('🚀 Opened Web Tools Hub!');
    } else if (action === 'addfunds') {
      setAddFundsModalOpen(true);
      showToast('💳 Opened Add Funds Modal!');
    } else if (action === 'custom_url' && customUrl) {
      window.open(customUrl, '_blank', 'noopener,noreferrer');
    } else {
      // Default: WhatsApp
      const waMsg = encodeURIComponent(
        `Assalam-o-Alaikum ${brandOwnerName}! Mujhe is deal/service ki details chahiye: "${bannerTitle || 'Special Deal'}"`
      );
      window.open(`https://wa.me/${activeWaNumberClean}?text=${waMsg}`, '_blank', 'noopener,noreferrer');
    }
  };

  const renderPromoBanner = (banner: SitePromoBannerItem) => {
    if (banner.enabled === false) return null;
    const styleObj = getPromoBannerStyleClasses(banner.style);

    return (
      <div key={banner.id} data-scroll="zoom" className={`acrylic-frame mb-4 ${styleObj.frame}`}>
        <div className={styleObj.inner}>
          <div className="space-y-1 text-center md:text-left flex-grow">
            <div
              className={`inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[10px] font-extrabold ${styleObj.badge}`}
            >
              <i className={banner.badgeIcon || 'fa-solid fa-bolt'}></i>
              <span>{banner.badgeText || 'ALL SERVICES AVAILABLE HERE'}</span>
            </div>
            <h3 className={`text-lg sm:text-xl font-extrabold ${styleObj.title}`}>
              {banner.title}
            </h3>
            <p className={`text-xs font-medium ${styleObj.desc}`}>
              {banner.description}
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2 flex-shrink-0">
            {banner.secondaryBtnEnabled !== false && banner.secondaryBtnText && (
              <button
                type="button"
                onClick={() =>
                  handlePromoBannerAction(
                    banner.secondaryBtnAction || 'webtools',
                    banner.secondaryBtnCustomUrl,
                    banner.title
                  )
                }
                className={`px-4 py-2.5 rounded-full font-extrabold text-xs shadow-sm transition hover:scale-105 cursor-pointer flex items-center gap-1.5 ${styleObj.secondaryBtn}`}
              >
                {banner.secondaryBtnAction === 'webtools' ? (
                  <FaScrewdriverWrench className="w-3.5 h-3.5" />
                ) : banner.secondaryBtnAction === 'addfunds' ? (
                  <i className="fa-solid fa-wallet"></i>
                ) : (
                  <i className={banner.secondaryBtnIcon || 'fa-solid fa-arrow-up-right-from-square'}></i>
                )}
                <span>{banner.secondaryBtnText}</span>
              </button>
            )}

            {banner.primaryBtnEnabled !== false && banner.primaryBtnText && (
              <button
                type="button"
                onClick={() =>
                  handlePromoBannerAction(
                    banner.primaryBtnAction || 'whatsapp',
                    banner.primaryBtnCustomUrl,
                    banner.title
                  )
                }
                className={`px-5 py-2.5 rounded-full font-extrabold text-xs shadow-lg hover:scale-105 transition flex items-center gap-1.5 cursor-pointer ${styleObj.primaryBtn}`}
              >
                {banner.primaryBtnAction === 'whatsapp' ? (
                  <SiWhatsapp className="w-4 h-4" />
                ) : banner.primaryBtnAction === 'addfunds' ? (
                  <i className="fa-solid fa-wallet"></i>
                ) : (
                  <i className={banner.primaryBtnIcon || 'fa-solid fa-bolt'}></i>
                )}
                <span>{banner.primaryBtnText}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  const openSecretAdminPortal = () => {
    playPopSound(880);
    try {
      window.history.pushState({}, '', '/saqibadmb');
    } catch {
      // Ignore history errors in restricted iframes
    }
    setActiveTab('saqibadmb');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    showToast('🛡️ Secret Admin Command Center (/saqibadmb) Unlocked!');
  };

  const exitSecretAdminPortal = () => {
    playPopSound(520);
    try {
      window.history.pushState({}, '', '/');
    } catch {
      // Ignore history errors
    }
    setActiveTab('store');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    showToast('Returned to Public Storefront');
  };

  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname.toLowerCase();
      const hash = window.location.hash.toLowerCase();
      if (path.includes('saqibadmb') || hash.includes('saqibadmb') || path.includes('saqibadmin')) {
        setActiveTab('saqibadmb');
      } else if (path.includes('contact')) {
        setActiveTab('contact');
      } else if (path.includes('login')) {
        setActiveTab('login');
      } else if (path.includes('about')) {
        setActiveTab('about');
      } else if (path.includes('faqs') || path.includes('faq')) {
        setActiveTab('faqs');
      } else if (path.includes('siminfo')) {
        setActiveTab('siminfo');
      } else {
        setActiveTab('store');
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const switchTab = (tab: TabId, scroll = true) => {
    playPopSound(600);
    setMobileMenuOpen(false);
    if (tab === 'login') {
      setLoginPortalSection('auth');
    }
    try {
      if (tab === 'store') {
        window.history.pushState({}, '', '/');
      } else if (tab === 'saqibadmb') {
        window.history.pushState({}, '', '/saqibadmin');
      } else {
        window.history.pushState({}, '', '/' + tab);
      }
    } catch {
      // Ignore
    }
    setActiveTab(tab);
    // Tab Title Sync
    try {
      const titles: Record<string, string> = {
        store: `${fullBrandTitle} — Digital & AI Services, SMM Store & Web Tools`,
        about: `About ${brandOwnerName} — ${fullBrandTitle}`,
        contact: `Contact Us & WhatsApp Support — ${fullBrandTitle}`,
        faqs: `FAQs & Help Desk — ${fullBrandTitle}`,
        login: `VIP Client Login & Wallet Portal — ${fullBrandTitle}`,
        siminfo: `SIM Info & Telecommunication Records — ${fullBrandTitle}`,
        saqibadmb: `${fullBrandTitle} — Admin Security Vault`
      };
      if (titles[tab]) document.title = titles[tab];
    } catch {}
    if (scroll) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const filterStore = (cat: CategoryId, searchKeyword?: string) => {
    playPopSound(640);
    setMobileMenuOpen(false);
    setCurrentCategory(cat);
    if (searchKeyword !== undefined) {
      setStoreSearchQuery(searchKeyword);
    }
    setActiveTab('store');
  };

  const openOrderModal = (srv: StoreService) => {
    playPopSound(720);
    const tierIdx = selectedTiers[srv.id] ?? 0;
    setActiveOrderService(srv);
    const rawTier = srv.tiers?.[tierIdx] || srv.tiers?.[0] || '';
    setModalTierValue(formatTierToString(rawTier));
    setModalTargetInput('');
    setAppliedOrderCoupon(null);
    setOrderCouponInput('');
    setOrderCouponError(null);
    setTimeout(() => {
      modalInputRef.current?.focus();
    }, 100);
  };

  const closeOrderModal = () => {
    setActiveOrderService(null);
    setAppliedOrderCoupon(null);
    setOrderCouponInput('');
    setOrderCouponError(null);
  };

  const applyOrderCoupon = async (amount: number, categoryId?: string) => {
    if (!orderCouponInput.trim()) {
      setOrderCouponError('Please enter a coupon code');
      return;
    }
    setIsApplyingOrderCoupon(true);
    setOrderCouponError(null);
    try {
      const res = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: orderCouponInput.trim(),
          orderAmount: amount,
          categoryId: categoryId || 'all',
        }),
      });
      const data = await res.json();
      if (res.ok && data.valid && data.coupon) {
        setAppliedOrderCoupon(data.coupon);
        playPopSound(880);
        triggerConfettiBurst();
        showToast(`🎉 Coupon "${data.coupon.code}" applied: Saved Rs. ${data.coupon.discountAmount.toLocaleString()}!`);
      } else {
        playPopSound(420);
        setOrderCouponError(data.error || 'Invalid or expired coupon');
        setAppliedOrderCoupon(null);
      }
    } catch {
      setOrderCouponError('Network error checking coupon');
    } finally {
      setIsApplyingOrderCoupon(false);
    }
  };

  const removeOrderCoupon = () => {
    setAppliedOrderCoupon(null);
    setOrderCouponInput('');
    setOrderCouponError(null);
  };

  const applyCartCoupon = async (totalAmount: number) => {
    if (!cartCouponInput.trim()) {
      setCartCouponError('Please enter a coupon code');
      return;
    }
    setIsApplyingCartCoupon(true);
    setCartCouponError(null);
    try {
      const res = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: cartCouponInput.trim(),
          orderAmount: totalAmount,
          categoryId: 'all',
        }),
      });
      const data = await res.json();
      if (res.ok && data.valid && data.coupon) {
        setAppliedCartCoupon(data.coupon);
        playPopSound(880);
        triggerConfettiBurst();
        showToast(`🎉 Cart coupon "${data.coupon.code}" applied: Saved Rs. ${data.coupon.discountAmount.toLocaleString()}!`);
      } else {
        playPopSound(420);
        setCartCouponError(data.error || 'Invalid or expired coupon');
        setAppliedCartCoupon(null);
      }
    } catch {
      setCartCouponError('Network error checking coupon');
    } finally {
      setIsApplyingCartCoupon(false);
    }
  };

  const removeCartCoupon = () => {
    setAppliedCartCoupon(null);
    setCartCouponInput('');
    setCartCouponError(null);
  };

  const quickAddToCart = (srv: StoreService) => {
    playPopSound(760);
    const tierIdx = selectedTiers[srv.id] ?? 0;
    const rawTier = srv.tiers?.[tierIdx] || srv.tiers?.[0] || '';
    const tierText = formatTierToString(rawTier);
    setShoppingCart((prev) => [
      ...prev,
      {
        title: srv.title,
        tier: tierText,
        target: 'Provided in chat'
      }
    ]);
    showToast(`Added "${srv.title}" to Order Bag!`);
  };

  const addCurrentModalToCart = () => {
    if (!activeOrderService) return;
    playPopSound(760);
    setShoppingCart((prev) => [
      ...prev,
      {
        title: activeOrderService.title,
        tier: modalTierValue,
        target: modalTargetInput.trim() || 'Provided in chat'
      }
    ]);
    closeOrderModal();
    showToast('Added to your Order Bag!');
  };

  const getWhatsAppOrderUrl = () => {
    if (!activeOrderService) return `https://wa.me/${activeWaNumberClean}`;
    const targetLink = modalTargetInput.trim() || 'Will send in chat';

    const couponBreakdown = appliedOrderCoupon
      ? `\n🏷️ *Coupon Applied:* ${appliedOrderCoupon.code} (-Rs. ${appliedOrderCoupon.discountAmount.toLocaleString()} OFF)` +
        `\n💰 *Original Price:* Rs. ${appliedOrderCoupon.originalAmount.toLocaleString()} | *Discounted Total:* Rs. ${appliedOrderCoupon.finalAmount.toLocaleString()}`
      : '';

    // Cloud Order Record
    fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: vipUser?.identifier || '+92 347 8936242',
        serviceId: activeOrderService.id,
        serviceTitle: activeOrderService.title,
        packageTier: modalTierValue,
        price: appliedOrderCoupon ? appliedOrderCoupon.finalAmount : 0,
        userInput: targetLink,
        couponCode: appliedOrderCoupon ? appliedOrderCoupon.code : null,
      })
    }).catch((err) => console.error('Cloud order save error:', err));

    const message =
      `🚀 *New Service Order — ${fullBrandTitle}*\n\n` +
      `📦 *Service:* ${activeOrderService.title}\n` +
      `💎 *Package:* ${modalTierValue}\n` +
      `🔗 *Link / Details:* ${targetLink}\n` +
      `💳 *Payment Via:* ${selectedPaymentMethod}` +
      `${couponBreakdown}\n\n` +
      `Please share payment account details so I can send screenshot!`;
    return `https://wa.me/${activeWaNumberClean}?text=${encodeURIComponent(message)}`;
  };

  const getCartWhatsAppUrl = () => {
    let msg = `🚀 *Multi-Service Order — ${fullBrandTitle}*\n\n`;
    shoppingCart.forEach((item, i) => {
      msg += `*${i + 1}. ${item.title}*\n   • Package: ${item.tier}\n   • Link/Number: ${item.target}\n\n`;
    });

    if (appliedCartCoupon) {
      msg += `🏷️ *Coupon Applied:* ${appliedCartCoupon.code} (-Rs. ${appliedCartCoupon.discountAmount.toLocaleString()} OFF)\n`;
      msg += `💰 *Original Subtotal:* Rs. ${appliedCartCoupon.originalAmount.toLocaleString()} | *Discounted Total:* Rs. ${appliedCartCoupon.finalAmount.toLocaleString()}\n\n`;
    }

    msg += `Please share total bill & EasyPaisa/JazzCash details!`;
    return `https://wa.me/${activeWaNumberClean}?text=${encodeURIComponent(msg)}`;
  };

  const copyText = (text: string, toastMsg?: string) => {
    playPopSound(820);
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(
        () => showToast(toastMsg || 'Copied to clipboard!'),
        () => fallbackCopy(text, toastMsg)
      );
    } else {
      fallbackCopy(text, toastMsg);
    }
  };

  const fallbackCopy = (text: string, toastMsg?: string) => {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    try {
      document.execCommand('copy');
      showToast(toastMsg || 'Copied to clipboard!');
    } catch {
      showToast('Ready: ' + text);
    }
    document.body.removeChild(textarea);
  };

  const fillQuickNumber = (num: string) => {
    playPopSound(580);
    setSimInput(num);
    showToast('Number Selected: ' + num);
  };

  const clearSimInput = () => {
    playPopSound(420);
    setSimInput('');
    simInputRef.current?.focus();
  };

  const performSimSearch = async (overrideQuery?: string) => {
    playPopSound(720);
    const rawVal = overrideQuery !== undefined ? overrideQuery : simInput;
    const cleanVal = rawVal.replace(/[^0-9]/g, '').trim();

    if (!cleanVal) {
      showToast('Please enter a valid Phone number or CNIC');
      return;
    }

    setSimLoading(true);
    setSimRecords([]);
    setSimErrorMsg(null);
    setSimProgress(10);
    setSimLoaderServerStatus('Initiating Server 1 (Dev Shehryar)...');

    const progressTimer = window.setInterval(() => {
      setSimProgress((prev) => {
        const next = prev + Math.random() * 8;
        return next > 88 ? 88 : next;
      });
    }, 180);

    let successfulTier: ApiTier | null = null;
    let foundRecords: SimRecord[] = [];

    for (let i = 0; i < API_TIERS.length; i++) {
      const tier = API_TIERS[i];
      setSimLoaderServerStatus(`Attempting ${tier.name} (Tier ${i + 1}/${API_TIERS.length})...`);
      const urlsToTry = tier.getUrls(cleanVal);
      let tierSucceeded = false;

      for (const url of urlsToTry) {
        const json = await queryEndpoint(url);
        if (json) {
          const records = extractSimRecords(json);
          if (records.length > 0) {
            foundRecords = records;
            successfulTier = tier;
            tierSucceeded = true;
            break;
          }
        }
      }
      if (tierSucceeded) {
        break;
      } else if (i < API_TIERS.length - 1) {
        setSimLoaderServerStatus(`${tier.name} Failed ➔ Switching to ${API_TIERS[i + 1].name}...`);
        await new Promise((r) => setTimeout(r, 400));
      }
    }

    window.clearInterval(progressTimer);
    setSimProgress(100);
    await new Promise((r) => setTimeout(r, 300));
    setSimLoading(false);

    if (foundRecords.length > 0 && successfulTier) {
      playPopSound(880);
      setSimRecords(foundRecords);
      setSimLastQuery(cleanVal);
      setSimActiveTier(successfulTier);
      showToast(`Found ${foundRecords.length} Records via ${successfulTier.name}`);
    } else {
      playPopSound(340);
      const errMsg = 'Public database has no record for this number. Order our VIP Fresh 2026 SIM Lookup below!';
      setSimErrorMsg(errMsg);
      showToast(errMsg);
    }
  };

  const copyAllResults = () => {
    if (!simRecords.length) return;
    let text = `🚀 ${fullBrandTitle.toUpperCase()} — SIM INFO REPORT\n=================================\n`;
    simRecords.forEach((item, i) => {
      text += `\nRECORD #${i + 1}:\n`;
      text += `👤 Name: ${item.name || item.Name || item.full_name || 'N/A'}\n`;
      text += `📱 Mobile: ${item.mobile || item.Mobile || item.number || item.Number || 'N/A'}\n`;
      text += `🪪 CNIC: ${item.cnic || item.CNIC || item.nic || 'N/A'}\n`;
      text += `📡 Network: ${item.network || item.Network || 'N/A'}\n`;
      text += `📍 Address: ${item.address || item.Address || 'N/A'}\n`;
    });
    text += `\n=================================\nEngineered by Muhammad Saqib (+92 347 8936242)`;
    copyText(text, 'All SIM records copied!');
  };

  // Contact Support Ticket Submit
  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    playPopSound(820);
    const ticketId = 'SV-' + Math.floor(1000 + Math.random() * 9000);
    const waText =
      `🎫 *Support Ticket #${ticketId} — ${fullBrandTitle}*\n\n` +
      `👤 *Name:* ${contactName.trim()}\n` +
      `📱 *WhatsApp:* ${contactPhone.trim()}\n` +
      `📂 *Department:* ${contactDept}\n` +
      `🚨 *Priority:* ${contactPriority}\n\n` +
      `💬 *Message:* ${contactMsg.trim()}`;

    // Cloud Save to Supabase
    fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: contactName.trim(),
        phone: contactPhone.trim(),
        department: contactDept,
        priority: contactPriority,
        message: contactMsg.trim()
      }),
    }).catch((err) => console.error('Cloud ticket save error:', err));

    showToast(`Ticket #${ticketId} Saved! Opening WhatsApp...`);
    openExternalWhatsApp(waText);
  };

  // Auth Handlers (Real Supabase Auth & Cloud Profiles)
  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const id = authIdentifier.trim();
    if (id.toLowerCase() === '/saqibadmb' || id.toLowerCase() === 'saqibadmb') {
      const pass = authPassword.trim() || window.prompt('Enter Admin Password:') || '';
      if (!pass) return;
      try {
        const authRes = await fetch('/api/admin/auth', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username: 'saqib', password: pass }),
        });
        const authData = await authRes.json();
        if (authData.success && authData.token) {
          setAdminToken(authData.token);
          try {
            localStorage.setItem('saqib_admin_token', authData.token);
          } catch {}
          setAuthIdentifier('');
          setAuthPassword('');
          openSecretAdminPortal();
          showToast('🛡️ Admin Command Center Unlocked & Verified!');
          return;
        } else {
          showToast(authData.error || 'Access Denied: Invalid Admin Password!');
          return;
        }
      } catch {
        showToast('Admin server verification failed.');
        return;
      }
    }
    playPopSound(860);

    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: authMode,
          identifier: id,
          password: authPassword,
          fullName: authName,
          role: authRole
        })
      });
      const data = await res.json();
      if (data.success && data.profile) {
        setVipUser({
          name: data.profile.name || id.split('@')[0],
          identifier: data.profile.id
        });
        if (typeof data.profile.balance === 'number') {
          setWalletBalance(data.profile.balance);
        }
        setVipDashSubTab('overview');
        showToast(`Welcome ${data.profile.name}! Live Cloud Sync active.`);
        return;
      } else if (data.error) {
        showToast(data.error);
        return;
      }
    } catch {
      // Offline fallback
    }

    const rawName = authName.trim();
    const displayName = rawName || id.split('@')[0] || 'VIP Member';
    setVipUser({ name: displayName, identifier: id || '+92 347 8936242' });
    setVipDashSubTab('overview');
    showToast(`Welcome to VIP Portal, ${displayName}!`);
  };

  const triggerDemoVipLogin = () => {
    playPopSound(880);
    setVipUser({ name: 'VIP Reseller Member', identifier: '+92 347 8936242' });
    setVipDashSubTab('overview');
    showToast('Logged into VIP Member Wallet!');
  };

  const logoutVipUser = () => {
    playPopSound(480);
    setVipUser(null);
    showToast('Logged out of VIP Portal');
  };

  const openExternalWhatsApp = (text: string) => {
    const link = document.createElement('a');
    link.href = `https://wa.me/${activeWaNumberClean}?text=${encodeURIComponent(text)}`;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const saveSiteConfigToCloud = async (
    configToSave?: SiteSettingsConfig,
    showFeedbackToast = false
  ): Promise<boolean> => {
    const target = configToSave || siteConfig;
    setIsSavingSiteConfig(true);
    try {
      // 1. Cache in browser localStorage
      try {
        localStorage.setItem(SITE_CONFIG_STORAGE_KEY, JSON.stringify(target));
      } catch {}

      // 2. Transmit to backend Supabase database
      const headers = getAdminHeaders();
      const res = await fetch('/api/site-config', {
        method: 'POST',
        headers,
        credentials: 'include',
        body: JSON.stringify({ config: target }),
      });

      const data = await res.json().catch(() => ({}));
      setIsSavingSiteConfig(false);

      if (res.ok && data.success) {
        if (data.config) {
          try {
            localStorage.setItem(SITE_CONFIG_STORAGE_KEY, JSON.stringify(data.config));
          } catch {}
        }
        if (showFeedbackToast) {
          if (data.savedToSupabase) {
            showToast('☁️ Saved to Supabase Database successfully!');
          } else {
            showToast('💾 Saved to Server Storage! (Supabase sync in background)');
          }
        }
        return true;
      } else {
        const err = data.error || `HTTP ${res.status}`;
        console.error('[Cloud Save Error]', err, data);
        showToast(`❌ Database Save Failed: ${err}`);
        return false;
      }
    } catch (err: any) {
      console.error('[Cloud Save Network Error]', err);
      setIsSavingSiteConfig(false);
      if (showFeedbackToast) {
        showToast(`❌ Cloud Connection Error: ${err.message}`);
      }
      return false;
    }
  };

  const handleUpdateSiteConfig = (
    nextConfig: SiteSettingsConfig | ((prev: SiteSettingsConfig) => SiteSettingsConfig)
  ) => {
    setSiteConfig((prev) => {
      const resolved = typeof nextConfig === 'function' ? nextConfig(prev) : nextConfig;
      // Instant local persistence so page refresh immediately retains customized names
      try {
        localStorage.setItem(SITE_CONFIG_STORAGE_KEY, JSON.stringify(resolved));
      } catch {}

      // Debounce autosave to avoid flooding Supabase on rapid keystrokes
      if (siteConfigSaveTimeoutRef.current) {
        clearTimeout(siteConfigSaveTimeoutRef.current);
      }
      siteConfigSaveTimeoutRef.current = setTimeout(() => {
        saveSiteConfigToCloud(resolved, false);
      }, 500);
      return resolved;
    });
  };

  const resetSiteConfigToDefault = async () => {
    playPopSound(780);
    setSiteConfig(DEFAULT_SITE_CONFIG);
    await saveSiteConfigToCloud(DEFAULT_SITE_CONFIG, true);
    showToast('Restored all Banner, WhatsApp, Payment & Footer settings to default in Supabase!');
  };

  // Admin Service Manager CRUD Handlers
  const resetAdminForm = () => {
    setEditingServiceId(null);
    setAdminTitle('');
    setAdminCategory('capcut_ai');
    setAdminBadge('🔥 HOT SERVICE');
    setAdminDesc('');
    setAdminPlush('plush-capcut');
    setAdminIconType('wand');
    setAdminCustomIconUrl('');
    setAdminDirectToolUrl('');
    setAdminInputLabel('Enter Your WhatsApp Number or Email:');
    setAdminPlaceholder('0300-1234567 or email@gmail.com');
    setAdminTiersText('1 Month Package — Rs. 500\n6 Months Package — Rs. 2,200\n1 Year Full Warranty — Rs. 3,800');
  };

  const handleSaveAdminService = (e: React.FormEvent) => {
    e.preventDefault();
    playPopSound(840);
    const parsedTiers = adminTiersText
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean);

    if (!adminTitle.trim() || parsedTiers.length === 0) {
      showToast('Please enter a service title and at least 1 pricing tier!');
      return;
    }

    const chosenPlushObj = PLUSH_OPTIONS.find((p) => p.value === adminPlush) || PLUSH_OPTIONS[0];

    const existingService = editingServiceId
      ? servicesCatalog.find((s) => s.id === editingServiceId)
      : undefined;

    const newService: StoreService = {
      id: editingServiceId || 'srv-' + Date.now(),
      category: adminCategory,
      badge: adminBadge.trim() || '✨ VIP SERVICE',
      title: adminTitle.trim(),
      desc: adminDesc.trim() || 'Instant activation & 100% full warranty via WhatsApp.',
      plush: chosenPlushObj.value,
      orbGrad: chosenPlushObj.orb,
      iconType: adminIconType,
      customIconUrl: adminCustomIconUrl.trim() || undefined,
      directToolUrl: adminDirectToolUrl.trim() || undefined,
      hidden: existingService?.hidden ?? false,
      inputLabel: adminInputLabel.trim() || 'Enter Your WhatsApp Number or Link:',
      placeholder: adminPlaceholder.trim() || '0300-1234567',
      tiers: parsedTiers
    };

    if (editingServiceId) {
      setServicesCatalog((prev) => prev.map((s) => (s.id === editingServiceId ? newService : s)));
      showToast(`Updated "${newService.title}" in Store!`);
    } else {
      setServicesCatalog((prev) => [newService, ...prev]);
      showToast(`Added "${newService.title}" to Store!`);
    }

    // Cloud Sync to Supabase
    fetch('/api/services', {
      method: 'POST',
      headers: getAdminHeaders(),
      credentials: 'include',
      body: JSON.stringify({ service: newService }),
    }).catch((err) => console.error('Cloud save failed:', err));

    resetAdminForm();
  };

  const startEditService = (srv: StoreService) => {
    playPopSound(680);
    setAdminStudioMode('services');
    setEditingServiceId(srv.id);
    setAdminTitle(srv.title);
    setAdminCategory(srv.category);
    setAdminBadge(srv.badge);
    setAdminDesc(srv.desc);
    setAdminPlush(srv.plush);
    setAdminIconType(srv.iconType);
    setAdminCustomIconUrl(srv.customIconUrl || '');
    setAdminDirectToolUrl(srv.directToolUrl || '');
    setAdminInputLabel(srv.inputLabel);
    setAdminPlaceholder(srv.placeholder);
    setAdminTiersText((srv.tiers || []).map(formatTierToString).join('\n'));
    window.scrollTo({ top: 260, behavior: 'smooth' });
    showToast(`Editing "${srv.title}"`);
  };

  const deleteService = (id: string, title: string) => {
    playPopSound(440);
    setServicesCatalog((prev) => prev.filter((s) => s.id !== id));
    if (editingServiceId === id) {
      resetAdminForm();
    }
    // Cloud Sync to Supabase
    fetch(`/api/services?id=${encodeURIComponent(id)}`, {
      method: 'DELETE',
      headers: getAdminHeaders(),
      credentials: 'include',
    }).catch((err) => console.error('Cloud delete failed:', err));
    showToast(`Removed "${title}" from catalog`);
  };

  const toggleServiceHidden = (id: string) => {
    playPopSound(640);
    const target = servicesCatalog.find((s) => s.id === id);
    const nextHidden = !(target?.hidden ?? false);
    setServicesCatalog((prev) =>
      prev.map((s) => (s.id === id ? { ...s, hidden: nextHidden } : s))
    );
    if (target) {
      // Cloud Sync to Supabase
      fetch('/api/services', {
        method: 'POST',
        headers: getAdminHeaders(),
        credentials: 'include',
        body: JSON.stringify({ service: { ...target, hidden: nextHidden } }),
      }).catch((err) => console.error('Cloud toggle failed:', err));

      showToast(
        nextHidden
          ? `🙈 Hidden "${target.title}" from Storefront!`
          : `👁️ Shown "${target.title}" on Storefront!`
      );
    }
  };

  const setAllServicesHidden = (hidden: boolean, categoryFilter?: CategoryId) => {
    playPopSound(720);
    setServicesCatalog((prev) =>
      prev.map((s) => {
        if (!categoryFilter || categoryFilter === 'all' || s.category === categoryFilter) {
          return { ...s, hidden };
        }
        return s;
      })
    );
  };

  const resetCatalogToDefault = () => {
    playPopSound(780);
    setServicesCatalog(DEFAULT_STORE_SERVICES);
    resetAdminForm();
    showToast(`Restored all ${DEFAULT_STORE_SERVICES.length} default services!`);
  };

  // Admin Live Web Tools CRUD Handlers
  const resetToolForm = () => {
    setEditingToolId(null);
    setToolTitle('');
    setToolUrl('');
    setToolIconUrl('');
    setToolDesc('');
    setToolBadge('⚡ LIVE WEB TOOL');
    setToolButtonLabel('Open Live Tool');
    setToolPlush('plush-ai');
    setToolIconType('wand');
    setToolOpenMode('new_tab');
  };

  const handleSaveAdminTool = (e: React.FormEvent) => {
    e.preventDefault();
    playPopSound(860);
    if (!toolTitle.trim() || !toolUrl.trim()) {
      showToast('Please enter both Tool Name and Tool Link (URL)!');
      return;
    }

    const chosenPlushObj = PLUSH_OPTIONS.find((p) => p.value === toolPlush) || PLUSH_OPTIONS[1];
    let normalizedUrl = toolUrl.trim();
    if (
      normalizedUrl !== '#siminfo' &&
      !normalizedUrl.startsWith('http://') &&
      !normalizedUrl.startsWith('https://') &&
      !normalizedUrl.startsWith('/')
    ) {
      normalizedUrl = 'https://' + normalizedUrl;
    }

    const existingTool = editingToolId
      ? webToolsCatalog.find((t) => t.id === editingToolId)
      : undefined;

    const newTool: WebToolItem = {
      id: editingToolId || 'tool-' + Date.now(),
      title: toolTitle.trim(),
      desc: toolDesc.trim() || `Instant online digital utility powered by ${brandOwnerName}.`,
      toolUrl: normalizedUrl,
      iconUrl: toolIconUrl.trim(),
      iconType: toolIconType,
      badge: toolBadge.trim() || '⚡ LIVE WEB TOOL',
      buttonLabel: toolButtonLabel.trim() || 'Open Live Tool',
      plush: chosenPlushObj.value,
      orbGrad: chosenPlushObj.orb,
      openMode: toolOpenMode,
      hidden: existingTool?.hidden ?? false
    };

    if (editingToolId) {
      setWebToolsCatalog((prev) => prev.map((t) => (t.id === editingToolId ? newTool : t)));
      showToast(`Updated Tool "${newTool.title}"!`);
    } else {
      setWebToolsCatalog((prev) => [newTool, ...prev]);
      showToast(`Added New Tool "${newTool.title}" to Website!`);
    }

    // Cloud Sync to Supabase
    fetch('/api/tools', {
      method: 'POST',
      headers: getAdminHeaders(),
      credentials: 'include',
      body: JSON.stringify({ tool: newTool }),
    }).catch((err) => console.error('Cloud tool save failed:', err));

    resetToolForm();
  };

  const startEditTool = (tool: WebToolItem) => {
    playPopSound(680);
    setAdminStudioMode('tools');
    setEditingToolId(tool.id);
    setToolTitle(tool.title);
    setToolUrl(tool.toolUrl);
    setToolIconUrl(tool.iconUrl || '');
    setToolDesc(tool.desc);
    setToolBadge(tool.badge);
    setToolButtonLabel(tool.buttonLabel);
    setToolPlush(tool.plush);
    setToolIconType(tool.iconType);
    setToolOpenMode(tool.openMode || 'new_tab');
    window.scrollTo({ top: 260, behavior: 'smooth' });
    showToast(`Editing Tool "${tool.title}"`);
  };

  const deleteTool = (id: string, title: string) => {
    playPopSound(440);
    setWebToolsCatalog((prev) => prev.filter((t) => t.id !== id));
    if (editingToolId === id) {
      resetToolForm();
    }
    // Cloud Sync to Supabase
    fetch(`/api/tools?id=${encodeURIComponent(id)}`, {
      method: 'DELETE',
      headers: getAdminHeaders(),
      credentials: 'include',
    }).catch((err) => console.error('Cloud tool delete failed:', err));
    showToast(`Removed Tool "${title}"`);
  };

  const toggleToolHidden = (id: string) => {
    playPopSound(640);
    const target = webToolsCatalog.find((t) => t.id === id);
    const nextHidden = !(target?.hidden ?? false);
    setWebToolsCatalog((prev) =>
      prev.map((t) => (t.id === id ? { ...t, hidden: nextHidden } : t))
    );
    if (target) {
      // Cloud Sync to Supabase
      fetch('/api/tools', {
        method: 'POST',
        headers: getAdminHeaders(),
        credentials: 'include',
        body: JSON.stringify({ tool: { ...target, hidden: nextHidden } }),
      }).catch((err) => console.error('Cloud tool toggle failed:', err));

      showToast(
        nextHidden
          ? `🙈 Hidden Tool "${target.title}" from Website!`
          : `👁️ Shown Tool "${target.title}" on Website!`
      );
    }
  };

  const setAllToolsHidden = (hidden: boolean) => {
    playPopSound(720);
    setWebToolsCatalog((prev) => prev.map((t) => ({ ...t, hidden })));
  };

  const resetToolsToDefault = () => {
    playPopSound(780);
    setWebToolsCatalog(DEFAULT_WEB_TOOLS);
    resetToolForm();
    showToast(`Restored all ${DEFAULT_WEB_TOOLS.length} default web tools!`);
  };

  const launchWebTool = (tool: WebToolItem) => {
    playPopSound(720);
    if (tool.openMode === 'sim_tab' || tool.toolUrl === '#siminfo') {
      switchTab('siminfo');
      return;
    }
    if (tool.openMode === 'embed_modal') {
      setActiveEmbeddedTool(tool);
      return;
    }
    // Open external tool URL safely via anchor click
    const link = document.createElement('a');
    link.href = tool.toolUrl;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // ==================== USER PAYMENT PROOF & ADMIN BALANCE APPROVAL HANDLERS ====================
  const handleSubmitPaymentProof = (
    newProof: Omit<PaymentProofRequest, 'id' | 'status' | 'createdAt'>
  ) => {
    playPopSound(820);
    const id = `DEP-${Math.floor(1000 + Math.random() * 9000)}`;
    const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const entry: PaymentProofRequest = {
      ...newProof,
      id,
      status: 'pending',
      createdAt: `Today, ${nowStr}`
    };
    setPaymentProofs((prev) => [entry, ...prev]);
    triggerConfettiBurst();

    // Cloud Sync to Supabase Storage & Database
    fetch('/api/payments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        proof: entry,
        userId: vipUser?.identifier || '+92 347 8936242',
      }),
    })
      .then((res) => res.json())
      .then((resData) => {
        if (resData.success && resData.proof?.screenshot_url) {
          setPaymentProofs((prev) =>
            prev.map((p) =>
              p.id === id ? { ...p, screenshotUrl: resData.proof.screenshot_url } : p
            )
          );
        }
      })
      .catch((err) => console.error('Cloud payment proof submit failed:', err));

    showToast(`Payment Proof #${id} (Rs. ${newProof.amount.toLocaleString()}) Submitted for Admin Approval!`);
  };

  const handleApprovePaymentProof = (id: string) => {
    playPopSound(880);
    const target = paymentProofs.find((p) => p.id === id);
    if (!target) return;
    if (target.status === 'approved') {
      showToast('This payment proof is already approved!');
      return;
    }
    setPaymentProofs((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: 'approved' } : p))
    );
    const newBal = walletBalance + target.amount;
    setWalletBalance(newBal);
    triggerConfettiBurst();

    // Cloud Sync Approval to Supabase
    fetch('/api/payments', {
      method: 'PATCH',
      headers: getAdminHeaders(),
      credentials: 'include',
      body: JSON.stringify({
        proofId: id,
        status: 'approved',
        userId: target.senderAccountNumber || vipUser?.identifier || '+92 347 8936242',
      }),
    }).catch((err) => console.error('Cloud approve failed:', err));

    showToast(`✅ Approved! +Rs. ${target.amount.toLocaleString()} added to User Live Balance!`);
  };

  const handleRejectPaymentProof = (id: string) => {
    playPopSound(420);
    const target = paymentProofs.find((p) => p.id === id);
    if (!target) return;
    if (target.status === 'approved') {
      // Deduct back if previously approved
      setWalletBalance((prev) => Math.max(0, prev - target.amount));
    }
    setPaymentProofs((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: 'rejected' } : p))
    );

    // Cloud Sync Rejection to Supabase
    fetch('/api/payments', {
      method: 'PATCH',
      headers: getAdminHeaders(),
      credentials: 'include',
      body: JSON.stringify({
        proofId: id,
        status: 'rejected',
        userId: target.senderAccountNumber || vipUser?.identifier || '+92 347 8936242',
      }),
    }).catch((err) => console.error('Cloud reject failed:', err));

    showToast(`Marked Payment Proof #${id} as Rejected.`);
  };

  const handleDeletePaymentProof = (id: string) => {
    playPopSound(400);
    setPaymentProofs((prev) => prev.filter((p) => p.id !== id));

    // Cloud Sync Deletion to Supabase
    fetch(`/api/payments?id=${encodeURIComponent(id)}`, {
      method: 'DELETE',
      headers: getAdminHeaders(),
      credentials: 'include',
    }).catch((err) => console.error('Cloud delete proof failed:', err));

    showToast(`Deleted Payment Proof #${id}`);
  };

  const handleSetCustomBalance = (newBal: number) => {
    playPopSound(740);
    const finalBal = Math.max(0, Math.round(newBal));
    setWalletBalance(finalBal);

    // Cloud Sync Balance to Supabase
    fetch('/api/wallet', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: vipUser?.identifier || '+92 347 8936242',
        balance: finalBal,
      }),
    }).catch((err) => console.error('Cloud balance set failed:', err));

    showToast(`User Live Wallet Balance set to Rs. ${finalBal.toLocaleString()}!`);
  };

  const pendingProofsCount = paymentProofs.filter((p) => p.status === 'pending').length;

  // Visible Store Services & Web Tools (Filtered by Admin Hide/Show Switches)
  const visibleServicesCatalog = servicesCatalog.filter(
    (srv) => !srv.hidden && !hiddenCategoryIdSet.has(srv.category)
  );
  const visibleWebToolsCatalog = webToolsCatalog.filter((t) => !t.hidden);

  // Filtered Store Services (Category + Live Search)
  const filteredServices = visibleServicesCatalog.filter((srv) => {
    const matchesCategory = currentCategory === 'all' || srv.category === currentCategory;
    if (!matchesCategory) return false;
    const q = storeSearchQuery.trim().toLowerCase();
    if (!q) return true;
    return (
      srv.title.toLowerCase().includes(q) ||
      srv.desc.toLowerCase().includes(q) ||
      srv.badge.toLowerCase().includes(q) ||
      (srv.tiers || []).some((t) => formatTierToString(t).toLowerCase().includes(q))
    );
  });

  const getCategoryCount = (catId: CategoryId) => {
    if (catId === 'all') return visibleServicesCatalog.length;
    return visibleServicesCatalog.filter((s) => s.category === catId).length;
  };

  const filteredFaqs =
    faqCategory === 'all'
      ? DEFAULT_FAQS
      : DEFAULT_FAQS.filter((f) => f.cat === faqCategory);

  const adminFilteredCatalog = servicesCatalog.filter((s) => {
    const q = adminSearchFilter.trim().toLowerCase();
    if (!q) return true;
    return s.title.toLowerCase().includes(q) || s.category.toLowerCase().includes(q) || s.badge.toLowerCase().includes(q);
  });

  const adminFilteredTools = webToolsCatalog.filter((t) => {
    const q = toolSearchFilter.trim().toLowerCase();
    if (!q) return true;
    return (
      t.title.toLowerCase().includes(q) ||
      t.desc.toLowerCase().includes(q) ||
      t.toolUrl.toLowerCase().includes(q) ||
      t.badge.toLowerCase().includes(q)
    );
  });

  // 1. 120FPS Passive Scroll Engine (Zero React Re-render on Scroll)
  useEffect(() => {
    let ticking = false;
    const onWindowScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollTop = window.scrollY || document.documentElement.scrollTop;
          const docHeight =
            document.documentElement.scrollHeight - document.documentElement.clientHeight;
          const ratio = docHeight > 0 ? Math.min(1, Math.max(0, scrollTop / docHeight)) : 0;
          if (scrollProgressBarRef.current) {
            scrollProgressBarRef.current.style.transform = `scaleX(${ratio})`;
          }
          if (scrollTopBtnRef.current) {
            const shouldShow = scrollTop > 340;
            if (shouldShow) {
              scrollTopBtnRef.current.classList.remove('opacity-0', 'translate-y-6', 'scale-75', 'pointer-events-none');
              scrollTopBtnRef.current.classList.add('opacity-100', 'translate-y-0', 'scale-100');
            } else {
              scrollTopBtnRef.current.classList.add('opacity-0', 'translate-y-6', 'scale-75', 'pointer-events-none');
              scrollTopBtnRef.current.classList.remove('opacity-100', 'translate-y-0', 'scale-100');
            }
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', onWindowScroll, { passive: true });
    onWindowScroll();
    return () => window.removeEventListener('scroll', onWindowScroll);
  }, []);

  // 2. Hardware-Accelerated IntersectionObserver Scroll Reveal Engine
  useEffect(() => {
    const elements = Array.from(document.querySelectorAll<HTMLElement>('[data-scroll]'));
    if (elements.length === 0) return;

    if (!('IntersectionObserver' in window)) {
      elements.forEach((el) => el.classList.add('scroll-in-view'));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const target = entry.target as HTMLElement;
            target.classList.add('scroll-in-view');
            observer.unobserve(target);
          }
        });
      },
      {
        threshold: 0.01,
        rootMargin: '120px 0px 50px 0px'
      }
    );

    elements.forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, [
    activeTab,
    currentCategory,
    storeSearchQuery,
    mobileGridCols,
    servicesCatalog.length,
    webToolsCatalog.length,
    faqCategory,
    simRecords.length
  ]);

  return (
    <div
      className={`min-h-screen flex flex-col justify-between relative ${
        websiteUiMode !== 'pink-acrylic'
          ? 'selection:bg-sky-400 selection:text-slate-950'
          : 'selection:bg-pink-300 selection:text-slate-900'
      }`}
    >
      {/* Top 60FPS Neon Scroll Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-1 z-50 bg-white/30 pointer-events-none overflow-hidden">
        <div
          ref={scrollProgressBarRef}
          className="h-full w-full scroll-progress-bar"
          style={{ transform: 'scaleX(0)' }}
        />
      </div>

      {/* Ambient Floating 3D Plush Stars & Hearts (Only in Classic Pink Mode) */}
      <div
        className={`fixed inset-0 pointer-events-none overflow-hidden z-0 ${
          websiteUiMode !== 'pink-acrylic' ? 'hidden' : ''
        }`}
      >
        {/* Peach Star Left */}
        <div className="absolute top-[30%] left-[2%] md:left-[7%] float-slow drop-shadow-md">
          <svg width="42" height="42" viewBox="0 0 48 48" fill="none">
            <path
              d="M24 4L29.5 16.5L43 18.2L33 27.5L35.6 41L24 34.2L12.4 41L15 27.5L5 18.2L18.5 16.5L24 4Z"
              fill="url(#peachStar)"
              stroke="#fff"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
            <defs>
              <radialGradient
                id="peachStar"
                cx="0"
                cy="0"
                r="1"
                gradientUnits="userSpaceOnUse"
                gradientTransform="translate(18 14) scale(26)"
              >
                <stop stopColor="#FFE5D9" />
                <stop offset="1" stopColor="#F7A072" />
              </radialGradient>
            </defs>
          </svg>
        </div>
        {/* Plush Pink Heart Top Right */}
        <div className="absolute top-[12%] right-[3%] md:right-[8%] float-reverse drop-shadow-md">
          <svg width="44" height="44" viewBox="0 0 48 48" fill="none">
            <path
              d="M24 41C24 41 6 29.5 6 16.5C6 10.5 10.8 6 16.5 6C20 6 22.8 7.8 24 10.5C25.2 7.8 28 6 31.5 6C37.2 6 42 10.5 42 16.5C42 29.5 24 41 24 41Z"
              fill="url(#pinkHeart)"
              stroke="#fff"
              strokeWidth="1.5"
            />
            <defs>
              <radialGradient
                id="pinkHeart"
                cx="0"
                cy="0"
                r="1"
                gradientUnits="userSpaceOnUse"
                gradientTransform="translate(18 14) scale(26)"
              >
                <stop stopColor="#FFD6E8" />
                <stop offset="1" stopColor="#E57A9E" />
              </radialGradient>
            </defs>
          </svg>
        </div>
        {/* Blue Plush Star Bottom Left */}
        <div className="absolute bottom-[16%] left-[2%] md:left-[6%] float-reverse drop-shadow-md">
          <svg width="46" height="46" viewBox="0 0 48 48" fill="none">
            <path
              d="M24 4L29.5 16.5L43 18.2L33 27.5L35.6 41L24 34.2L12.4 41L15 27.5L5 18.2L18.5 16.5L24 4Z"
              fill="url(#blueStar)"
              stroke="#fff"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
            <defs>
              <radialGradient
                id="blueStar"
                cx="0"
                cy="0"
                r="1"
                gradientUnits="userSpaceOnUse"
                gradientTransform="translate(18 14) scale(26)"
              >
                <stop stopColor="#E0F2FE" />
                <stop offset="1" stopColor="#7BA7E1" />
              </radialGradient>
            </defs>
          </svg>
        </div>
        {/* Lavender Star Bottom Right */}
        <div className="absolute bottom-[28%] right-[3%] md:right-[8%] float-slow drop-shadow-md">
          <svg width="36" height="36" viewBox="0 0 48 48" fill="none">
            <path
              d="M24 2L28 19L45 24L28 29L24 46L20 29L3 24L20 19L24 2Z"
              fill="url(#lavStar)"
              stroke="#fff"
              strokeWidth="1.5"
            />
            <defs>
              <radialGradient
                id="lavStar"
                cx="0"
                cy="0"
                r="1"
                gradientUnits="userSpaceOnUse"
                gradientTransform="translate(20 18) scale(24)"
              >
                <stop stopColor="#F3E8FF" />
                <stop offset="1" stopColor="#B794F4" />
              </radialGradient>
            </defs>
          </svg>
        </div>
      </div>

      {/* ==================== STICKY UPPER NAVIGATION BAR + MOBILE 3-LINE BUTTON BAR ==================== */}
      <header className="sticky top-1.5 sm:top-3 z-40 mx-auto w-[96%] sm:w-[95%] max-w-6xl space-y-1.5">
        <nav className="px-2.5 sm:px-5 py-2 sm:py-2.5 rounded-2xl sm:rounded-full acrylic-frame flex items-center justify-between gap-1.5 sm:gap-2 flex-nowrap">
          {/* Left: 3-Line Mobile Menu Button + Brand Identity */}
          <div className="flex items-center gap-1.5 sm:gap-2 min-w-0 flex-shrink">
            {/* Mobile 3-Line Upper Hamburger Button (Left) */}
            <button
              type="button"
              onClick={() => {
                playPopSound(640);
                setMobileMenuOpen((prev) => !prev);
              }}
              aria-label="Open Mobile Menu"
              aria-expanded={mobileMenuOpen}
              className={`md:hidden relative w-9 h-9 rounded-xl flex flex-col items-center justify-center gap-1 transition-all cursor-pointer flex-shrink-0 border ${
                mobileMenuOpen
                  ? 'bg-gradient-to-br from-pink-500 to-purple-600 text-white border-white shadow-md scale-95'
                  : 'bg-white/95 hover:bg-white text-slate-900 border-pink-200/90 shadow-sm'
              }`}
            >
              <span
                className={`block w-4 h-0.5 rounded-full transition-all duration-200 ${
                  mobileMenuOpen ? 'bg-white rotate-45 translate-y-1.5' : 'bg-slate-900'
                }`}
              />
              <span
                className={`block w-4 h-0.5 rounded-full transition-all duration-200 ${
                  mobileMenuOpen ? 'opacity-0' : 'bg-pink-600'
                }`}
              />
              <span
                className={`block w-4 h-0.5 rounded-full transition-all duration-200 ${
                  mobileMenuOpen ? 'bg-white -rotate-45 -translate-y-1.5' : 'bg-slate-900'
                }`}
              />
            </button>

            <div
              className="flex items-center gap-1 sm:gap-2 min-w-0 cursor-pointer flex-shrink"
              onClick={() => {
                switchTab('store');
                triggerConfettiBurst();
              }}
            >
              <span className="text-base sm:text-2xl flex-shrink-0">🚀</span>
              <div className="flex flex-col leading-none min-w-0">
                <span className="font-extrabold text-slate-900 tracking-tight text-[11px] sm:text-sm truncate">
                  <span className="xs:hidden">{brandOwnerName.split(' ')[0].toUpperCase()}</span>
                  <span className="hidden xs:inline sm:hidden">{fullBrandTitle.toUpperCase()}</span>
                  <span className="hidden sm:inline">{fullBrandTitle.toUpperCase()}</span>
                </span>
                <span className="text-[7.5px] sm:text-[10px] font-semibold text-pink-600 truncate hidden xs:block">
                  {(brandAccentName || fullBrandTitle).toUpperCase()} • {visibleServicesCatalog.length} SERVICES
                </span>
              </div>
            </div>
          </div>

          {/* Center Navigation Links (Desktop) */}
          <div className="hidden md:flex items-center gap-1 bg-white/80 p-1 rounded-full border border-white shadow-inner">
            <button
              onClick={() => switchTab('store')}
              className={`px-3 py-1.5 rounded-full text-xs transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'store'
                  ? 'font-extrabold bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-sm'
                  : 'font-bold text-slate-800 hover:bg-white hover:text-slate-950'
              }`}
            >
              <i
                className={`fa-solid fa-fire-flame-curved mr-1 ${
                  activeTab === 'store' ? 'text-white' : 'text-pink-500'
                }`}
              ></i>
              {t.navStore} ({visibleServicesCatalog.length})
            </button>
            {siteVisibility.showToolsTab && (
              <button
                onClick={() => switchTab('siminfo')}
                className={`px-3 py-1.5 rounded-full text-xs transition-all whitespace-nowrap cursor-pointer ${
                  activeTab === 'siminfo'
                    ? 'font-extrabold bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-sm'
                    : 'font-bold text-slate-800 hover:bg-white hover:text-slate-950'
                }`}
              >
                <i
                  className={`fa-solid fa-screwdriver-wrench mr-1 ${
                    activeTab === 'siminfo' ? 'text-white' : 'text-emerald-600'
                  }`}
                ></i>
                {t.navTools} ({visibleWebToolsCatalog.length})
              </button>
            )}
            {siteVisibility.showAboutTab && (
              <button
                onClick={() => switchTab('about')}
                className={`px-3 py-1.5 rounded-full text-xs transition-all whitespace-nowrap cursor-pointer ${
                  activeTab === 'about'
                    ? 'font-extrabold bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-sm'
                    : 'font-bold text-slate-800 hover:bg-white hover:text-slate-950'
                }`}
              >
                <i
                  className={`fa-solid fa-user-astronaut mr-1 ${
                    activeTab === 'about' ? 'text-white' : 'text-sky-600'
                  }`}
                ></i>
                About
              </button>
            )}
            {siteVisibility.showFaqsTab && (
              <button
                onClick={() => switchTab('faqs')}
                className={`px-3 py-1.5 rounded-full text-xs transition-all whitespace-nowrap cursor-pointer ${
                  activeTab === 'faqs'
                    ? 'font-extrabold bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-sm'
                    : 'font-bold text-slate-800 hover:bg-white hover:text-slate-950'
                }`}
              >
                <i
                  className={`fa-solid fa-circle-question mr-1 ${
                    activeTab === 'faqs' ? 'text-white' : 'text-amber-600'
                  }`}
                ></i>
                FAQs
              </button>
            )}
            {siteVisibility.showContactTab && (
              <button
                onClick={() => switchTab('contact')}
                className={`px-3 py-1.5 rounded-full text-xs transition-all whitespace-nowrap cursor-pointer ${
                  activeTab === 'contact'
                    ? 'font-extrabold bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-sm'
                    : 'font-bold text-slate-800 hover:bg-white hover:text-slate-950'
                }`}
              >
                <i
                  className={`fa-solid fa-headset mr-1 ${
                    activeTab === 'contact' ? 'text-white' : 'text-blue-600'
                  }`}
                ></i>
                Contact
              </button>
            )}
            {siteVisibility.showLoginTab && (
              <button
                onClick={() => switchTab('login')}
                className={`px-3 py-1.5 rounded-full text-xs transition-all whitespace-nowrap cursor-pointer ${
                  activeTab === 'login'
                    ? 'font-extrabold bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-sm'
                    : 'font-bold text-slate-800 hover:bg-white hover:text-slate-950'
                }`}
              >
                <i
                  className={`fa-solid fa-wallet mr-1 ${
                    activeTab === 'login' ? 'text-white' : 'text-emerald-600'
                  }`}
                ></i>
                {vipUser ? t.navVipWallet : t.navWallet}
              </button>
            )}
          </div>

          {/* Right: Live Wallet Balance + Cart + Audio + Mobile 3-Line Menu Trigger */}
          <div className="flex items-center gap-1 sm:gap-1.5 flex-shrink-0">
            {activeTab === 'saqibadmb' && (
              <button
                onClick={exitSecretAdminPortal}
                title="Exit Secret Admin Mode"
                className="px-2 sm:px-2.5 py-1.5 rounded-full bg-slate-900 text-amber-300 border border-amber-400/50 font-extrabold text-[10px] sm:text-[11px] shadow-md flex items-center gap-1 transition hover:scale-105 cursor-pointer"
              >
                <i className="fa-solid fa-shield-halved"></i>
                <span className="hidden sm:inline">Exit Admin</span>
              </button>
            )}

            {/* LIVE USER WALLET BALANCE + ADD FUNDS PILL */}
            {(siteConfig.storeBars?.showHeaderWalletPill ?? siteVisibility.showHeaderWalletPill) && (
              <button
                type="button"
                onClick={() => {
                  playPopSound(680);
                  setAddFundsModalOpen(true);
                }}
                title="Your Live Wallet Balance — Click to Add Funds"
                className={
                  websiteUiMode === 'astro-neu'
                    ? 'space-navy-box px-2 sm:px-3.5 py-1.5 rounded-xl sm:rounded-full text-[10px] sm:text-xs font-extrabold text-sky-300 border border-sky-400/50 flex items-center gap-1 sm:gap-1.5 hover:scale-105 transition cursor-pointer'
                    : 'px-2 sm:px-3 py-1.5 rounded-xl sm:rounded-full bg-gradient-to-r from-emerald-500 via-teal-500 to-green-600 text-white font-extrabold text-[10px] sm:text-xs shadow-md flex items-center gap-1 sm:gap-1.5 hover:scale-105 transition cursor-pointer border border-white/80'
                }
                suppressHydrationWarning
              >
                <i className="fa-solid fa-wallet text-sky-200 sm:text-sky-400"></i>
                <span className="font-display tracking-wide whitespace-nowrap hidden sm:inline" suppressHydrationWarning>
                  {siteConfig.storeBars?.currencyPrefix || 'Rs.'} {walletBalance.toLocaleString()}
                </span>
                <span className="font-display tracking-wide whitespace-nowrap sm:hidden text-[10px]" suppressHydrationWarning>
                  {walletBalance >= 1000 ? `${(walletBalance / 1000).toFixed(walletBalance % 1000 === 0 ? 0 : 1)}k` : walletBalance}
                </span>
                <span className="hidden md:inline-block px-1.5 py-0.2 rounded-full bg-white/25 text-[8px] sm:text-[9px] font-extrabold">
                  {siteConfig.storeBars?.headerPillAddLabel || '+Add'}
                </span>
              </button>
            )}

            {siteVisibility.showHeaderCartButton && (
              <button
                onClick={() => {
                  playPopSound(660);
                  setCartModalOpen(true);
                }}
                title="View Selected Orders"
                className="relative px-2 sm:px-3 py-1.5 rounded-xl sm:rounded-full bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold text-[11px] sm:text-xs shadow-md flex items-center gap-1 hover:scale-105 transition cursor-pointer"
              >
                <i className="fa-solid fa-bag-shopping"></i>
                <span>{shoppingCart.length}</span>
              </button>
            )}

            {/* PROMINENT LANGUAGE SWITCHER PILL (URDU 🇵🇰 / ENGLISH 🇬🇧) */}
            <button
              type="button"
              onClick={() => {
                playPopSound(720);
                toggleLanguage();
              }}
              title={siteLang === 'en' ? 'Switch to Urdu (اردو زبان)' : 'Switch to English (انگریزی زبان)'}
              className={`px-2 sm:px-3 py-1.5 rounded-xl sm:rounded-full font-extrabold text-[10px] sm:text-xs shadow-sm border flex items-center gap-1 sm:gap-1.5 transition-all hover:scale-105 cursor-pointer flex-shrink-0 ${
                siteLang === 'ur'
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-700 text-white border-emerald-400 shadow-emerald-500/20'
                  : 'bg-white/95 hover:bg-white text-slate-900 border-pink-300 shadow-xs'
              }`}
            >
              <span className="text-xs sm:text-sm leading-none">{siteLang === 'en' ? '🇵🇰' : '🇬🇧'}</span>
              <span className="font-extrabold tracking-wide text-[10px] sm:text-xs">
                {siteLang === 'en' ? 'اردو' : 'English'}
              </span>
            </button>

            {/* SOFT LIGHT RGB BORDER ON/OFF TOGGLE (ADMIN MODE ONLY) */}
            {activeTab === 'saqibadmb' && (
              <button
                type="button"
                onClick={toggleRgbBorderLight}
                title={
                  rgbBorderEnabled
                    ? 'Admin: Soft Light RGB Borders ON — Click to turn OFF'
                    : 'Admin: Soft Light RGB Borders OFF — Click to turn ON'
                }
                className={`px-2 sm:px-2.5 py-1.5 rounded-xl sm:rounded-full font-extrabold text-[10px] sm:text-[11px] flex items-center gap-1 transition cursor-pointer ${
                  rgbBorderEnabled
                    ? 'rgb-pill-active text-slate-900'
                    : 'bg-white/90 text-slate-500 border border-slate-300/80 shadow-2xs'
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    rgbBorderEnabled
                      ? 'bg-gradient-to-r from-sky-400 via-pink-500 to-emerald-400 animate-spin'
                      : 'bg-slate-400'
                  }`}
                ></span>
                <span>RGB</span>
                <span className="hidden lg:inline">{rgbBorderEnabled ? 'ON' : 'OFF'}</span>
              </button>
            )}

            {/* THEME SWITCHER BUTTON (6 THEMES: NEO GRAY DARK, NEO BLUE DARK, ASTRO, PINK, GOLD, JELLY) */}
            <button
              type="button"
              onClick={() => {
                playPopSound(740);
                setThemeModalOpen(true);
              }}
              title="Switch Website Theme (6 Themes: Neo Gray Dark, Neo Blue Dark, Astro, Pink, Gold, Jelly)"
              className="hidden sm:flex px-2 sm:px-2.5 py-1.5 rounded-xl sm:rounded-full bg-white/90 hover:bg-white text-slate-800 text-[10px] sm:text-[11px] font-extrabold shadow-2xs border border-slate-300/80 items-center gap-1 sm:gap-1.5 hover:scale-105 transition cursor-pointer"
            >
              <i className="fa-solid fa-palette text-pink-500 text-xs"></i>
              <span className="hidden sm:inline font-bold">Theme:</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-100 font-black text-slate-800 uppercase tracking-tight" suppressHydrationWarning>
                {websiteUiMode === 'astro-neu'
                  ? 'Astro'
                  : websiteUiMode === 'pink-acrylic'
                  ? 'Pink'
                  : websiteUiMode === 'liquid-champagne'
                  ? 'Gold'
                  : websiteUiMode === 'pastel-jelly'
                  ? 'Jelly'
                  : websiteUiMode === 'neo-gray-dark'
                  ? 'Neo Gray'
                  : 'Neo Blue'}
              </span>
            </button>

            <button
              onClick={toggleSound}
              title="Toggle UI Sounds"
              className="hidden sm:flex neu-pill-sm w-8 h-8 rounded-full items-center justify-center text-slate-700 hover:text-sky-600 transition-transform active:scale-90 cursor-pointer"
            >
              <i
                className={
                  soundEnabled
                    ? 'fa-solid fa-volume-high text-xs text-slate-800'
                    : 'fa-solid fa-volume-xmark text-xs text-slate-400'
                }
              ></i>
            </button>
          </div>
        </nav>

        {/* ==================== MOBILE UPPER QUICK-BUTTON BAR (CATEGORIES + TOOLS + GRID) ==================== */}
        {siteVisibility.showMobileQuickBar && (
          <div className="md:hidden acrylic-frame rounded-2xl px-2.5 py-1.5 flex items-center gap-1.5 overflow-x-auto scrollbar-none pr-8 overscroll-x-contain">
            <button
              type="button"
              onClick={() => {
                playPopSound(640);
                setMobileMenuOpen((prev) => !prev);
              }}
              className={`px-2.5 py-1 rounded-xl text-[10px] font-extrabold whitespace-nowrap flex items-center gap-1 cursor-pointer flex-shrink-0 border ${
                mobileMenuOpen
                  ? 'bg-slate-900 text-white border-slate-900'
                  : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white border-white/80 shadow-xs'
              }`}
            >
              <i className="fa-solid fa-bars text-[10px]"></i>
              <span>All Menu</span>
            </button>

            {visibleStoreCategories.map((cat) => {
              const isActive = activeTab === 'store' && currentCategory === cat.id;
              return (
                <button
                  key={`mob-top-${cat.id}`}
                  type="button"
                  onClick={() => filterStore(cat.id)}
                  className={`px-2.5 py-1 rounded-xl text-[10px] font-extrabold whitespace-nowrap flex items-center gap-1 transition cursor-pointer flex-shrink-0 ${
                    isActive
                      ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-xs'
                      : 'bg-white/90 text-slate-800 border border-slate-200/80'
                  }`}
                >
                  {renderCategoryIcon(
                    cat.id,
                    `w-3 h-3 ${isActive ? 'text-white' : cat.iconColor}`,
                    cat
                  )}
                  <span>{cat.shortLabel}</span>
                </button>
              );
            })}

            {siteVisibility.showToolsTab && (
              <button
                type="button"
                onClick={() => switchTab('siminfo')}
                className={`px-2.5 py-1 rounded-xl text-[10px] font-extrabold whitespace-nowrap flex items-center gap-1 transition cursor-pointer flex-shrink-0 ${
                  activeTab === 'siminfo'
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-xs'
                    : 'bg-white/90 text-emerald-700 border border-emerald-200'
                }`}
              >
                <i className="fa-solid fa-screwdriver-wrench text-[9px]"></i>
                <span>Web Tools ({visibleWebToolsCatalog.length})</span>
              </button>
            )}
          </div>
        )}

      </header>

      {/* ==================== CLEAN STEP-BY-STEP MOBILE VERTICAL SLIDE-OVER DRAWER ==================== */}
      <MobileStepByStepDrawer
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        activeTab={activeTab}
        onSwitchTab={switchTab}
        servicesCount={visibleServicesCatalog.length}
        toolsCount={visibleWebToolsCatalog.length}
        walletBalance={walletBalance}
        currencyPrefix={siteConfig.storeBars?.currencyPrefix || 'Rs.'}
        onOpenAddFunds={() => setAddFundsModalOpen(true)}
        onOpenCart={() => setCartModalOpen(true)}
        cartCount={shoppingCart.length}
        categories={visibleStoreCategories}
        currentCategory={currentCategory}
        onFilterCategory={filterStore}
        siteLang={siteLang}
        onToggleLang={toggleLanguage}
        websiteUiMode={websiteUiMode}
        onSelectTheme={(th) => {
          setWebsiteUiMode(th);
          showToast(`🎨 Theme Applied: ${th}!`);
        }}
        soundEnabled={soundEnabled}
        onToggleSound={toggleSound}
        vipUser={vipUser}
        primaryWaNumber={activeWaNumberClean}
        brandOwnerName={brandOwnerName}
        brandAccentName={brandAccentName}
        portraitUrl={siteConfig.banner.portraitUrl}
      />

      <main className={`relative z-10 w-full max-w-6xl mx-auto px-2.5 sm:px-6 pt-2.5 sm:pt-5 ${activeTab === 'saqibadmb' ? 'pb-28 sm:pb-16' : 'pb-12'} flex-grow`}>
        {/* ==================== HERO SECTION (SHOWN ONLY ON MAIN SERVICES / STORE PAGE) ==================== */}
        {activeTab === 'store' &&
          (siteConfig.banner.showTopStrip || siteConfig.banner.showHeroBanner) && (
          <section className="mb-4 sm:mb-8">
            {/* Top Title Strip */}
            {siteConfig.banner.showTopStrip && (
              <div className="flex flex-row items-center justify-between gap-2 mb-2.5 sm:mb-3">
                <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
                  <span
                    className="text-base sm:text-3xl drop-shadow cursor-pointer hover:rotate-12 transition-transform flex-shrink-0"
                    onClick={triggerConfettiBurst}
                  >
                    ✨
                  </span>
                  <h1 className="title-3d-blue text-xs sm:text-3xl font-bold tracking-wider uppercase truncate">
                    {siteLang === 'ur' ? 'صہیب ایجنسی • آفیشل ہب' : effectiveTopStripTitle}
                  </h1>
                </div>
                {siteConfig.banner.showTopStripWhatsapp !== false && (
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    {/* Language Switcher in Top Strip */}
                    <button
                      type="button"
                      onClick={() => {
                        playPopSound(720);
                        toggleLanguage();
                      }}
                      title={siteLang === 'en' ? 'اردو زبان میں دیکھیں' : 'View in English'}
                      className="acrylic-frame acrylic-interactive rounded-full px-2.5 sm:px-3 py-1 sm:py-1.5 flex items-center gap-1.5 text-[10px] sm:text-xs font-extrabold text-slate-900 whitespace-nowrap cursor-pointer hover:scale-105 transition border border-pink-300"
                    >
                      <span className="text-sm">{siteLang === 'en' ? '🇵🇰' : '🇬🇧'}</span>
                      <span className="font-extrabold">{siteLang === 'en' ? 'اردو زبان' : 'English'}</span>
                    </button>
                    <a
                      href={`https://wa.me/${activeWaNumberClean}?text=${encodeURIComponent(
                        siteConfig.contact.whatsappDefaultMessage
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="acrylic-frame acrylic-interactive rounded-full px-2.5 sm:px-3.5 py-1 sm:py-1.5 flex items-center gap-1.5 text-[10px] sm:text-xs font-extrabold text-slate-900 whitespace-nowrap"
                    >
                      <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
                      <i className="fa-brands fa-whatsapp text-emerald-600 text-xs sm:text-sm"></i>
                      <span className="hidden xs:inline sm:inline">{activeWaNumberDisplay}</span>
                    </a>
                  </div>
                )}
              </div>
            )}

            {/* Main Hero Card: Left Circular 3D Portrait with Floating CapCut & AI Icons + Right Glass Bio */}
            {siteConfig.banner.showHeroBanner && (
              <div className={`relative flex flex-col ${siteConfig.banner.showPortraitPhoto !== false ? 'md:flex-row' : ''} items-center pt-1 sm:pt-2`}>
                {/* Left: 3D Thick Circular Glass Frame + Floating CapCut, AI, TikTok & SIM Badges */}
                {siteConfig.banner.showPortraitPhoto !== false && (
                  <div data-scroll="left" className="relative flex-shrink-0 my-6 sm:my-3 md:my-0 z-20 mx-auto">
                    {/* Main Portrait Lens */}
                    <div
                      onClick={() => {
                        playPopSound(640);
                        setPosterModalOpen(true);
                      }}
                      onMouseEnter={() => playPopSound(440)}
                      className="portrait-lens relative w-48 h-48 sm:w-60 sm:h-60 rounded-full acrylic-frame p-2 sm:p-2.5 cursor-pointer shadow-2xl group mx-auto"
                      title="Click to view full portrait"
                    >
                      <div className="w-full h-full rounded-full overflow-hidden relative border-2 border-white/90 shadow-inner bg-gradient-to-b from-pink-100 to-blue-100">
                        <div
                          className="saqib-portrait-crop"
                          style={
                            siteConfig.banner.portraitUrl
                              ? { backgroundImage: `url('${siteConfig.banner.portraitUrl}')` }
                              : undefined
                          }
                          role="img"
                          aria-label={`${siteConfig.banner.mainTitle} Portrait`}
                        ></div>
                        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/15 to-white/40 pointer-events-none rounded-full"></div>
                        <div className="absolute bottom-3 inset-x-0 flex justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <span className="bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-lg">
                            <i className="fa-solid fa-expand mr-1"></i>
                            {siteConfig.banner.mainTitle}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Floating Badges Around Portrait */}
                    {siteVisibility.showPortraitOrbitBadges &&
                      siteConfig.banner.showPortraitOrbitBadges !== false && (
                        <>
                          {/* Floating Badge 1: CapCut Pro Icon (Top-Left) */}
                          {siteConfig.banner.orbitBadge1Enabled !== false && (
                            <button
                              onClick={() => filterStore('capcut_ai', '')}
                              onMouseEnter={() => playPopSound(680)}
                              title={siteConfig.banner.orbitBadge1Title || 'CapCut & Lovable Pro'}
                              className="orbit-badge float-slow -top-5 -left-6 sm:-top-3 sm:-left-8 px-2 py-1 sm:px-3 sm:py-1.5 rounded-2xl flex items-center gap-1.5 cursor-pointer shadow-md"
                            >
                              <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-sm">
                                <svg
                                  className="w-3.5 h-3.5 sm:w-4 sm:h-4"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2.3"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                >
                                  <path d="M4 7l16 10" />
                                  <path d="M20 7L4 17" />
                                  <rect x="2" y="5" width="20" height="4" rx="1" fill="currentColor" stroke="none" />
                                  <rect x="2" y="15" width="20" height="4" rx="1" fill="currentColor" stroke="none" />
                                </svg>
                              </div>
                              <div className="text-left leading-none max-w-[80px] sm:max-w-none">
    <div className="text-[9px] sm:text-[10px] font-extrabold text-slate-900 truncate">
      {siteConfig.banner.orbitBadge1Title || 'CapCut & Lovable'}
    </div>
    <div className="text-[7px] sm:text-[8px] font-bold text-pink-600 uppercase truncate">
      {siteConfig.banner.orbitBadge1Sub || 'PRO UNLOCKED'}
    </div>
  </div>
                            </button>
                          )}

                          {/* Floating Badge 2: AI Tools / Gemini / ElevenLabs (Top-Right) */}
                          {siteConfig.banner.orbitBadge2Enabled !== false && (
                            <button
                              onClick={() => filterStore('capcut_ai', '')}
                              onMouseEnter={() => playPopSound(720)}
                              title={siteConfig.banner.orbitBadge2Title || 'AI Suite'}
                              className="orbit-badge float-reverse -top-5 -right-6 sm:-top-3 sm:-right-8 px-2 py-1 sm:px-3 sm:py-1.5 rounded-2xl flex items-center gap-1.5 cursor-pointer shadow-md"
                            >
                              <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-cyan-500 text-white flex items-center justify-center shadow-sm">
                                <i className="fa-solid fa-wand-magic-sparkles text-[10px] sm:text-xs"></i>
                              </div>
                              <div className="text-left leading-none max-w-[80px] sm:max-w-none">
    <div className="text-[9px] sm:text-[10px] font-extrabold text-slate-900 truncate">
      {siteConfig.banner.orbitBadge2Title || 'AI Suite'}
    </div>
    <div className="text-[7px] sm:text-[8px] font-bold text-emerald-600 uppercase truncate">
      {siteConfig.banner.orbitBadge2Sub || 'GEMINI • CLAUDE'}
    </div>
  </div>
                            </button>
                          )}

                          {/* Floating Badge 3: TikTok UK/USA & Ads (Bottom-Left) */}
                          {siteConfig.banner.orbitBadge3Enabled !== false && (
                            <button
                              onClick={() => filterStore('tiktok_fb', '')}
                              onMouseEnter={() => playPopSound(640)}
                              title={siteConfig.banner.orbitBadge3Title || 'TikTok UK/USA'}
                              className="orbit-badge float-reverse -bottom-5 -left-6 sm:-bottom-3 sm:-left-8 px-2 py-1 sm:px-3 sm:py-1.5 rounded-2xl flex items-center gap-1.5 cursor-pointer shadow-md"
                            >
                              <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-xl bg-gradient-to-tr from-rose-500 to-pink-500 text-white flex items-center justify-center shadow-sm">
                                <i className="fa-brands fa-tiktok text-[10px] sm:text-xs"></i>
                              </div>
                              <div className="text-left leading-none max-w-[80px] sm:max-w-none">
    <div className="text-[9px] sm:text-[10px] font-extrabold text-slate-900 truncate">
      {siteConfig.banner.orbitBadge3Title || 'TikTok UK/USA'}
    </div>
    <div className="text-[7px] sm:text-[8px] font-bold text-rose-600 uppercase truncate">
      {siteConfig.banner.orbitBadge3Sub || 'ADS & BOOST'}
    </div>
  </div>
                            </button>
                          )}

                          {/* Floating Badge 4: Franchise & NADRA Info (Bottom-Right) */}
                          {siteConfig.banner.orbitBadge4Enabled !== false && (
                            <button
                              onClick={() => filterStore('franchise_sim', '')}
                              onMouseEnter={() => playPopSound(760)}
                              title={siteConfig.banner.orbitBadge4Title || 'SIM & NADRA'}
                              className="orbit-badge float-slow -bottom-5 -right-6 sm:-bottom-3 sm:-right-8 px-2 py-1 sm:px-3 sm:py-1.5 rounded-2xl flex items-center gap-1.5 cursor-pointer shadow-md"
                            >
                              <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-sm">
                                <i className="fa-solid fa-satellite-dish text-[10px] sm:text-xs"></i>
                              </div>
                              <div className="text-left leading-none max-w-[80px] sm:max-w-none">
    <div className="text-[9px] sm:text-[10px] font-extrabold text-slate-900 truncate">
      {siteConfig.banner.orbitBadge4Title || 'SIM & NADRA'}
    </div>
    <div className="text-[7px] sm:text-[8px] font-bold text-blue-600 uppercase truncate">
      {siteConfig.banner.orbitBadge4Sub || 'CDR • FRC • LIVE'}
    </div>
  </div>
                            </button>
                          )}
                        </>
                      )}
                  </div>
                )}

                {/* Right: Soft Pink/Peach Plush Hero Bio & Feature Pills */}
                <div
                  data-scroll="right"
                  className={`hero-rgb-card relative z-10 w-full ${
                    siteConfig.banner.showPortraitPhoto !== false
                      ? 'md:-ml-10 mt-4 md:mt-0'
                      : 'mt-0'
                  } acrylic-frame rounded-[28px] sm:rounded-[38px] p-2 sm:p-3.5`}
                >
                  <div
                    className={`plush-pillow plush-hero rounded-[22px] sm:rounded-[30px] px-3.5 py-4 ${
                      siteConfig.banner.showPortraitPhoto !== false
                        ? 'sm:pl-14 sm:pr-7'
                        : 'sm:px-8'
                    } sm:py-6 text-center ${
                      siteConfig.banner.showPortraitPhoto !== false ? 'md:text-left' : 'text-center md:text-left'
                    }`}
                  >
                    {/* Top Status Promo Badge */}
                    {siteConfig.banner.showBadgeText !== false && siteConfig.banner.badgeText && (
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/80 border border-white text-[9px] sm:text-[10px] font-extrabold text-pink-600 shadow-sm mb-2">
                        <i className="fa-solid fa-circle-check text-emerald-500"></i>{' '}
                        {siteLang === 'ur' ? '✅ تمام ڈیجیٹل، اے آئی، اور ایس ایم ایم سروسز 24/7 لائیو اور ایکٹو ہیں' : siteConfig.banner.badgeText}
                      </div>
                    )}

                    {/* Main Title & Highlight */}
                    {siteConfig.banner.showMainTitle !== false && (
                      <h2 className="text-xl sm:text-2xl md:text-[26px] font-extrabold text-slate-900 tracking-tight leading-snug">
                        {siteLang === 'ur' ? 'صہیب — ایجنسی ہب' : siteConfig.banner.mainTitle}{' '}
                        {siteLang === 'ur' ? (
                          <span className="text-pink-600 font-display">
                            (پریمیم ڈیجیٹل سٹور)
                          </span>
                        ) : siteConfig.banner.highlightTitle && (
                          <span className="text-pink-600 font-display">
                            {siteConfig.banner.highlightTitle}
                          </span>
                        )}
                      </h2>
                    )}

                    {/* Bio Description */}
                    {siteConfig.banner.showDescription !== false && siteConfig.banner.description && (
                      <p className="mt-1.5 text-xs sm:text-sm font-semibold text-slate-800 leading-relaxed">
                        {siteLang === 'ur'
                          ? 'کینوا پرو، نیٹ فلکس، پرائم ویڈیو، ایڈوب، چیٹ جی پی ٹی، کلاڈ، وی پی این اور سوشل میڈیا سروسز فوری حاصل کریں — مکمل 100% ریپلیسمنٹ گارنٹی اور 24/7 فوری واٹس ایپ ڈیلیوری کے ساتھ!'
                          : siteConfig.banner.description}
                      </p>
                    )}

                    {/* Interactive Showcase Feature Badges */}
                    {siteVisibility.showHeroFeaturePills &&
                      siteConfig.banner.showHeroFeaturePills !== false && (
                      <div className={`mt-3.5 flex flex-wrap items-center justify-center ${siteConfig.banner.showPortraitPhoto !== false ? 'md:justify-start' : 'md:justify-start'} gap-1.5 sm:gap-2`}>
                        <button
                          onClick={() => filterStore('capcut_ai', '')}
                          className="px-3 py-1.5 rounded-xl bg-white/85 hover:bg-white text-slate-900 font-extrabold text-[11px] shadow-sm border border-purple-200 flex items-center gap-1.5 transition hover:scale-105 cursor-pointer"
                        >
                          <i className="fa-solid fa-wand-magic-sparkles text-purple-600"></i> AI &amp; Pro Apps
                        </button>
                        <button
                          onClick={() => filterStore('tiktok_fb', '')}
                          className="px-3 py-1.5 rounded-xl bg-white/85 hover:bg-white text-slate-900 font-extrabold text-[11px] shadow-sm border border-pink-200 flex items-center gap-1.5 transition hover:scale-105 cursor-pointer"
                        >
                          <i className="fa-brands fa-tiktok text-rose-500"></i> TikTok UK &amp; Ads
                        </button>
                        <button
                          onClick={() => filterStore('franchise_sim', '')}
                          className="px-3 py-1.5 rounded-xl bg-white/85 hover:bg-white text-slate-900 font-extrabold text-[11px] shadow-sm border border-emerald-200 flex items-center gap-1.5 transition hover:scale-105 cursor-pointer"
                        >
                          <i className="fa-solid fa-satellite-dish text-emerald-600"></i> Franchise &amp; CDR
                        </button>
                        <button
                          onClick={() => filterStore('nadra_records', '')}
                          className="px-3 py-1.5 rounded-xl bg-white/85 hover:bg-white text-slate-900 font-extrabold text-[11px] shadow-sm border border-blue-200 flex items-center gap-1.5 transition hover:scale-105 cursor-pointer"
                        >
                          <i className="fa-solid fa-id-card text-blue-600"></i> NADRA &amp; Records
                        </button>
                        <button
                          onClick={() => filterStore('creative_crypto', '')}
                          className="px-3 py-1.5 rounded-xl bg-white/85 hover:bg-white text-slate-900 font-extrabold text-[11px] shadow-sm border border-amber-200 flex items-center gap-1.5 transition hover:scale-105 cursor-pointer"
                        >
                          <i className="fa-brands fa-bitcoin text-amber-500"></i> USDT &amp; Editing
                        </button>
                        {siteVisibility.showToolsTab && (
                          <button
                            onClick={() => switchTab('siminfo')}
                            className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 text-white font-extrabold text-[11px] shadow-md flex items-center gap-1.5 transition hover:scale-105 cursor-pointer"
                          >
                            <i className="fa-solid fa-screwdriver-wrench"></i> Live Web Tools
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </section>
        )}

        {/* ==================== VIEW 1: DIGITAL SERVICES STORE (ALL 31+ SERVICES + LIVE SEARCH) ==================== */}
        {activeTab === 'store' && (
          <div className="space-y-5 transition-all duration-300">
            {/* Infinite 3D Brand Marquee & Live Server Pulse Strip */}
            {siteVisibility.showMarqueeBanner && (
              <MarqueeAndPulseBanner
                siteLang={siteLang}
                onQuickFilter={(cat, kw) => filterStore(cat, kw)}
                onPlayPop={playPopSound}
                onSelectServiceById={(id) => {
                  const found = visibleServicesCatalog.find((s) => s.id === id);
                  if (found) {
                    openOrderModal(found);
                  } else {
                    filterStore('all', '');
                  }
                }}
              />
            )}

            {/* ==================== STOREFRONT LIVE WALLET BALANCE & INSTANT ADD PAYMENT BAR ==================== */}
            {(siteConfig.storeBars?.showWalletBar ?? siteVisibility.showStoreWalletBar) && (
              <div data-scroll="up" className="acrylic-frame rounded-[28px] p-2.5 sm:p-3.5">
                <div className="rounded-[22px] bg-gradient-to-r from-slate-900 via-indigo-950 to-purple-950 text-white px-3.5 py-3 sm:px-5 sm:py-3.5 border border-white/80 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="flex items-center gap-3 text-center sm:text-left">
                    <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-600 text-white flex items-center justify-center text-lg shadow-md border border-white flex-shrink-0">
                      <i className="fa-solid fa-wallet"></i>
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center justify-center sm:justify-start gap-1.5">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-300">
                          {siteLang === 'ur' ? '● لائیو اکاؤنٹ بیلنس:' : (siteConfig.storeBars?.walletBalanceLabel || '● LIVE ACCOUNT BALANCE:')}
                        </span>
                        <span className="font-display font-bold text-lg sm:text-2xl text-white" suppressHydrationWarning>
                          {siteConfig.storeBars?.currencyPrefix || 'Rs.'} {walletBalance.toLocaleString()}
                        </span>
                        {(siteConfig.storeBars?.showPendingProofBadge ?? true) && pendingProofsCount > 0 && (
                          <span className="px-2 py-0.5 rounded-full bg-amber-500/25 border border-amber-400/50 text-amber-300 text-[9px] font-extrabold">
                            {siteLang === 'ur' ? `⏳ ${pendingProofsCount} زیرِ تصدیق رسید` : `⏳ ${pendingProofsCount} Pending Proof`}
                          </span>
                        )}
                      </div>
                      {(siteConfig.storeBars?.showWalletInstruction ?? true) && (
                        <p className="text-[10px] sm:text-xs font-medium text-pink-200">
                          {siteConfig.storeBars?.walletInstructionText ||
                            'Add balance via EasyPaisa / JazzCash / Bank (Enter Amount → Select Method → Upload SS → Instant Balance!)'}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0 w-full sm:w-auto justify-center">
                    {(siteConfig.storeBars?.showAddPaymentBtn ?? true) && (
                      <button
                        type="button"
                        onClick={() => {
                          playPopSound(680);
                          setAddFundsModalOpen(true);
                        }}
                        className="flex-1 sm:flex-initial px-4 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-extrabold text-xs shadow-lg flex items-center justify-center gap-1.5 transition hover:scale-105 cursor-pointer"
                      >
                        <i className="fa-solid fa-circle-plus text-amber-200"></i>
                        <span>{siteConfig.storeBars?.addPaymentBtnLabel || '+ Add Payment / Balance'}</span>
                      </button>
                    )}
                    {(siteConfig.storeBars?.showHistoryBtn ?? true) && (
                      <button
                        type="button"
                        onClick={() => switchTab('login')}
                        className="px-3.5 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white border border-white/20 font-extrabold text-xs transition cursor-pointer whitespace-nowrap"
                      >
                        <i className="fa-solid fa-receipt mr-1 text-pink-300"></i>
                        {siteConfig.storeBars?.historyBtnLabel || 'History'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* ==================== 2 NO PROMO & DEAL BANNERS (ABOVE SERVICES) ==================== */}
            {(siteVisibility.showPromoBanners ?? true) && (
              <>
                {allPromoBanners
                  .filter((b) => b.position === 'above_services' || b.position === 'both')
                  .map((b) => renderPromoBanner(b))}
              </>
            )}

            {/* Live Search Bar + Quick Service Tags in 3D Pink Glass */}
            {siteVisibility.showSearchAndCategoryBar && (
              <div data-scroll="up" className="acrylic-frame rounded-[30px] p-3 sm:p-4 space-y-3">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
                  <div className="sim-input-box flex-grow !py-2 !px-3.5 !rounded-2xl">
                    <i className="fa-solid fa-magnifying-glass text-pink-500 mr-2.5 text-sm"></i>
                    <input
                      type="text"
                      value={storeSearchQuery}
                      onChange={(e) => {
                        setStoreSearchQuery(e.target.value);
                      }}
                      placeholder={t.searchPlaceholder}
                      className="w-full bg-transparent border-none outline-none font-bold text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 placeholder:font-medium"
                    />
                    {storeSearchQuery && (
                      <button
                        type="button"
                        onClick={() => {
                          playPopSound(440);
                          setStoreSearchQuery('');
                        }}
                        className="text-slate-400 hover:text-pink-600 px-1.5 cursor-pointer"
                      >
                        <i className="fa-solid fa-circle-xmark"></i>
                      </button>
                    )}
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-2 flex-shrink-0">
                    <span className="px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-2xl bg-white/85 border border-pink-200 text-[10px] sm:text-[11px] font-extrabold text-pink-700 shadow-sm whitespace-nowrap">
                      <i className="fa-solid fa-sparkles mr-1 text-amber-500"></i>
                      {siteLang === "ur" ? `${visibleServicesCatalog.length} میں سے ${filteredServices.length} سروسز دستیاب ہیں` : `Showing ${filteredServices.length} of ${visibleServicesCatalog.length} Services`}
                    </span>

                    {/* Mobile 2-Grid / 1-Grid Instant Switcher */}
                    <div className="flex sm:hidden items-center bg-white/90 rounded-xl p-0.5 border border-pink-200 shadow-sm">
                      <button
                        type="button"
                        onClick={() => {
                          playPopSound(600);
                          setMobileGridCols(2);
                        }}
                        className={`px-2 py-1 rounded-lg text-[10px] font-extrabold flex items-center gap-1 transition cursor-pointer ${
                          mobileGridCols === 2
                            ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-xs'
                            : 'text-slate-600'
                        }`}
                      >
                        <i className="fa-solid fa-border-all text-[10px]"></i> 2-Grid
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          playPopSound(540);
                          setMobileGridCols(1);
                        }}
                        className={`px-2 py-1 rounded-lg text-[10px] font-extrabold flex items-center gap-1 transition cursor-pointer ${
                          mobileGridCols === 1
                            ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-xs'
                            : 'text-slate-600'
                        }`}
                      >
                        <i className="fa-solid fa-list text-[10px]"></i> 1-Grid
                      </button>
                    </div>
                  </div>
                </div>

                {/* Quick Filter Tags */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 scrollbar-none text-[11px] font-bold">
                  <span className="text-[10px] font-extrabold text-slate-500 uppercase pr-1 flex-shrink-0">
                    Hot Searches:
                  </span>
                  {[
                    { label: 'CapCut Pro', q: 'CapCut' },
                    { label: 'Lovable Pro', q: 'Lovable' },
                    { label: 'Gemini 18M', q: 'Gemini' },
                    { label: 'Muse AI 1B', q: 'Muse' },
                    { label: 'ElevenLabs 300k', q: 'ElevenLabs' },
                    { label: 'TikTok UK/USA', q: 'UK / USA' },
                    { label: 'Ad Agency', q: 'Agency' },
                    { label: 'Call CDR', q: 'CDR' },
                    { label: 'NADRA FRC', q: 'FRC' },
                    { label: 'Hostinger 12M', q: 'Hostinger' },
                    { label: 'BTC / USDT', q: 'USDT' }
                  ].map((chip) => (
                    <button
                      key={chip.label}
                      type="button"
                      onClick={() => {
                        playPopSound(580);
                        setCurrentCategory('all');
                        setStoreSearchQuery(storeSearchQuery === chip.q ? '' : chip.q);
                      }}
                      className={`px-2.5 py-1 rounded-full border transition whitespace-nowrap cursor-pointer ${
                        storeSearchQuery.toLowerCase() === chip.q.toLowerCase()
                          ? 'bg-pink-500 text-white border-pink-500 shadow-sm'
                          : 'bg-white/80 hover:bg-white text-slate-700 border-pink-200'
                      }`}
                    >
                      {chip.label}
                    </button>
                  ))}
                </div>

                {/* Category Filter Tabs (Dynamic from Admin Categories & Icons Studio) */}
                <div className="flex items-center justify-between gap-1.5 overflow-x-auto pt-1 border-t border-white/70 scrollbar-none">
                  {visibleStoreCategories.map((cat) => {
                    const isActive = currentCategory === cat.id;
                    return (
                      <button
                        key={cat.id}
                        onClick={() => filterStore(cat.id)}
                        className={`cat-pill px-3.5 py-2 rounded-2xl text-xs transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                          isActive
                            ? 'font-extrabold bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-md'
                            : 'font-bold bg-white/95 hover:bg-white text-slate-900 border border-slate-200/80 shadow-xs'
                        }`}
                      >
                        {renderCategoryIcon(
                          cat.id,
                          `w-3.5 h-3.5 ${isActive ? 'text-white' : cat.iconColor}`,
                          cat
                        )}
                        <span>{cat.shortLabel}</span>
                        <span
                          className={`text-[10px] px-1.5 py-0.2 rounded-full font-extrabold ${
                            isActive ? 'bg-black/25 text-white' : 'bg-slate-200 text-slate-800'
                          }`}
                        >
                          {getCategoryCount(cat.id)}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Storefront Grid */}
            {filteredServices.length === 0 ? (
              <div className="acrylic-frame rounded-[30px] p-6 text-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-pink-100 text-pink-600 flex items-center justify-center mx-auto text-xl">
                  <i className="fa-solid fa-magnifying-glass"></i>
                </div>
                <h3 className="text-base font-extrabold text-slate-900">
                  No service matched &ldquo;{storeSearchQuery}&rdquo;
                </h3>
                <p className="text-xs font-medium text-slate-600">
                  Clear the search filter or message {brandOwnerName} directly on WhatsApp for custom deals!
                </p>
                <div className="flex items-center justify-center gap-2">
                  <button
                    onClick={() => {
                      setStoreSearchQuery('');
                      setCurrentCategory('all');
                    }}
                    className="px-4 py-2 rounded-full bg-pink-500 text-white text-xs font-extrabold shadow cursor-pointer"
                  >
                    Show All {servicesCatalog.length} Services
                  </button>
                </div>
              </div>
            ) : (
              <div
                className={`grid ${
                  mobileGridCols === 2 ? 'grid-cols-2' : 'grid-cols-1'
                } sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-4`}
              >
                {filteredServices.map((srv, idx) => {
                  const activeTierIdx = selectedTiers[srv.id] ?? 0;
                  const rawActiveTier = srv.tiers?.[activeTierIdx] || srv.tiers?.[0] || '';
                  const activeTierText = formatTierToString(rawActiveTier);
                  const priceMatch = activeTierText.match(/Rs\.?\s*[\d,]+/i);
                  const quickPriceLabel = priceMatch ? priceMatch[0] : 'Best Rate';
                  const staggerClass =
                    idx % 3 === 1 ? 'scroll-delay-1' : idx % 3 === 2 ? 'scroll-delay-2' : '';

                  return (
                    <div
                      key={srv.id}
                      data-scroll="up"
                      className={`min-w-0 overflow-hidden acrylic-frame acrylic-interactive rounded-[20px] sm:rounded-[30px] p-1 sm:p-2.5 flex flex-col justify-between content-visibility-auto ${staggerClass}`}
                    >
                      <div
                        className={`min-w-0 plush-pillow ${srv.plush} rounded-[15px] sm:rounded-[23px] p-2.5 sm:p-4 flex flex-col h-full justify-between space-y-2 sm:space-y-3.5`}
                      >
                        <div className="min-w-0">
                          {/* Top Row: Fluffy 3D Icon + Badge */}
                          <div className="flex items-center justify-between gap-1.5 sm:gap-2 min-w-0">
                            <div
                              className={`fluffy-orb w-8 h-8 sm:w-12 sm:h-12 bg-gradient-to-br ${srv.orbGrad} flex items-center justify-center border-2 border-white shadow-md flex-shrink-0 overflow-hidden`}
                            >
                              {renderOrbVisual(srv.iconType, srv.customIconUrl, `${srv.id} ${srv.title}`)}
                            </div>
                            <span className="min-w-0 px-1.5 py-0.5 sm:px-2.5 sm:py-1 rounded-full bg-white/95 border border-slate-200/90 text-[7.5px] sm:text-[10px] font-extrabold text-slate-900 shadow-xs truncate">
                              {srv.badge}
                            </span>
                          </div>

                          {/* Title & Desc */}
                          <h3 className="mt-2 sm:mt-3 text-[11.5px] sm:text-[17px] font-extrabold text-slate-900 leading-snug line-clamp-2">
                            {srv.title}
                          </h3>
                          <p
                            className={`mt-1 text-[9.5px] sm:text-xs font-medium text-slate-700 leading-snug sm:leading-relaxed ${
                              mobileGridCols === 2 ? 'line-clamp-2 sm:line-clamp-none' : ''
                            }`}
                          >
                            {srv.desc}
                          </p>
                        </div>

                        {/* Package Selector & Order Buttons */}
                        <div className="min-w-0 w-full space-y-1.5 sm:space-y-2.5 pt-1.5 sm:pt-2 border-t border-slate-900/10">
                          <div className="min-w-0">
                            <div className="flex items-center justify-between gap-1 mb-1 min-w-0">
                              <label className="text-[8.5px] sm:text-[10px] font-extrabold uppercase text-slate-700 truncate">
                                {siteLang === "ur" ? "پیکج منتخب کریں:" : "Package:"}
                              </label>
                              <span className="text-[9.5px] sm:text-[11px] font-display font-bold text-pink-700 bg-white/85 px-1.5 py-0.2 rounded-md border border-pink-200/80 whitespace-nowrap flex-shrink-0">
                                {quickPriceLabel}
                              </span>
                            </div>
                            <select
                              value={activeTierIdx}
                              onChange={(e) =>
                                setSelectedTiers((prev) => ({
                                  ...prev,
                                  [srv.id]: Number(e.target.value)
                                }))
                              }
                              className="w-full min-w-0 px-1.5 py-1.5 sm:px-2.5 sm:py-2 rounded-lg sm:rounded-xl bg-white/95 border border-white text-[9.5px] sm:text-xs font-extrabold text-slate-900 shadow-xs focus:outline-none focus:ring-2 focus:ring-pink-400 cursor-pointer truncate"
                            >
                              {(srv.tiers || []).map((t, i) => (
                                <option key={i} value={i}>
                                  {formatTierToString(t)}
                                </option>
                              ))}
                            </select>
                          </div>

                          <div className="flex items-center gap-1 sm:gap-2 w-full min-w-0">
                            <button
                              onClick={() => openOrderModal(srv)}
                              className="flex-1 min-w-0 py-1.5 sm:py-2.5 px-2 sm:px-3 rounded-lg sm:rounded-xl bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-extrabold text-[10px] sm:text-xs shadow-md flex items-center justify-center gap-1 sm:gap-1.5 transition cursor-pointer overflow-hidden"
                            >
                              <SiWhatsapp className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                              <span className="truncate">{siteLang === "ur" ? "ابھی خریدیں" : "Buy Now"}</span>
                            </button>
                            {srv.directToolUrl && (
                              <a
                                href={srv.directToolUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                title="Open Direct Tool Link"
                                className="w-6 h-6 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white border border-white shadow-xs flex items-center justify-center transition flex-shrink-0"
                              >
                                <FaArrowUpRightFromSquare className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5" />
                              </a>
                            )}
                            <button
                              onClick={() => quickAddToCart(srv)}
                              title="Add to Order Bag"
                              className="w-6 h-6 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl bg-white/95 hover:bg-white text-slate-800 hover:text-pink-600 border border-white shadow-xs flex items-center justify-center transition cursor-pointer flex-shrink-0"
                            >
                              <FaBagShopping className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* ==================== LIVE WEB TOOLS & AI UTILITIES HUB (2-COLUMN MOBILE GRID) ==================== */}
            {siteVisibility.showWebToolsOnStore && visibleWebToolsCatalog.length > 0 && (
              <section data-scroll="up" className="acrylic-frame rounded-[24px] sm:rounded-[34px] p-1.5 sm:p-5 space-y-3">
                <div className="plush-pillow plush-capcut rounded-[18px] sm:rounded-[26px] p-2.5 sm:p-6 space-y-3.5 sm:space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-indigo-200/80 pb-2.5 sm:pb-3 text-center sm:text-left">
                    <div>
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/90 border border-indigo-200 text-[9.5px] sm:text-[10px] font-extrabold text-indigo-700 shadow-xs">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                        <span>LIVE WEB TOOLS &amp; AI LAUNCHER HUB</span>
                      </div>
                      <h2 className="text-base sm:text-2xl font-extrabold text-slate-900 mt-1">
                        Instant Online Tools &amp; Web Utilities 🛠️
                      </h2>
                      <p className="text-[10.5px] sm:text-xs font-semibold text-slate-700">
                        Launch free &amp; official web tools directly from {fullBrandTitle} with 1 tap.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => switchTab('siminfo')}
                      className="self-center sm:self-auto px-3.5 py-1.5 sm:py-2 rounded-full bg-gradient-to-r from-indigo-600 to-pink-500 text-white font-extrabold text-[10.5px] sm:text-xs shadow-md hover:scale-105 transition whitespace-nowrap cursor-pointer flex items-center gap-1.5"
                    >
                      <FaScrewdriverWrench className="w-3 h-3" />
                      <span>{siteLang === "ur" ? "تمام ٹولز اوپن کریں" : "Open All Web Tools"}</span>
                    </button>
                  </div>

                  {/* 2-Column Mobile Grid of Live Tools */}
                  <div
                    className={`grid ${
                      mobileGridCols === 2 ? 'grid-cols-2' : 'grid-cols-1'
                    } sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3.5`}
                  >
                    {visibleWebToolsCatalog.map((tool, idx) => {
                      const cleanDomain =
                        tool.toolUrl === '#siminfo'
                          ? 'Built-in Live SIM Engine'
                          : tool.toolUrl.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '');
                      return (
                        <div
                          key={tool.id}
                          data-scroll="zoom"
                          className={`min-w-0 overflow-hidden acrylic-frame acrylic-interactive rounded-[18px] sm:rounded-[26px] p-1 sm:p-2 flex flex-col justify-between bg-white/75 ${
                            idx % 3 === 1 ? 'scroll-delay-1' : idx % 3 === 2 ? 'scroll-delay-2' : ''
                          }`}
                        >
                          <div
                            className={`min-w-0 plush-pillow ${tool.plush} rounded-[14px] sm:rounded-[20px] p-2.5 sm:p-4 flex flex-col h-full justify-between space-y-2 sm:space-y-2.5`}
                          >
                            <div className="min-w-0 space-y-1.5 sm:space-y-2">
                              <div className="flex items-center justify-between gap-1.5 min-w-0">
                                <div
                                  className={`fluffy-orb w-8 h-8 sm:w-11 sm:h-11 bg-gradient-to-br ${tool.orbGrad} flex items-center justify-center border-2 border-white shadow-md flex-shrink-0 overflow-hidden`}
                                >
                                  {renderOrbVisual(tool.iconType, tool.iconUrl, `${tool.id} ${tool.title}`)}
                                </div>
                                <span className="min-w-0 px-1.5 py-0.5 sm:px-2.5 rounded-full bg-white/95 border border-white text-[7.5px] sm:text-[9px] font-extrabold text-slate-900 shadow-xs truncate">
                                  {tool.badge}
                                </span>
                              </div>

                              <h3 className="text-[11.5px] sm:text-base font-extrabold text-slate-900 leading-snug line-clamp-2">
                                {tool.title}
                              </h3>
                              <p className="text-[9.5px] sm:text-xs font-medium text-slate-700 leading-snug line-clamp-2">
                                {tool.desc}
                              </p>
                            </div>

                            <div className="min-w-0 w-full pt-1.5 sm:pt-2 border-t border-slate-900/10 space-y-1.5">
                              <div className="w-full min-w-0 flex items-center gap-1 text-[8.5px] sm:text-[10px] font-mono-code font-bold text-indigo-700 bg-white/80 px-2 py-0.5 rounded-md border border-white/90 overflow-hidden">
                                <FaArrowUpRightFromSquare className="w-2 h-2 sm:w-2.5 sm:h-2.5 text-pink-500 flex-shrink-0" />
                                <span className="truncate">{cleanDomain}</span>
                              </div>

                              <div className="flex items-center gap-1 sm:gap-1.5 w-full min-w-0">
                                <button
                                  type="button"
                                  onClick={() => launchWebTool(tool)}
                                  className="flex-1 min-w-0 py-1.5 sm:py-2 px-2 sm:px-2.5 rounded-lg sm:rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 hover:from-indigo-700 hover:to-pink-600 text-white font-extrabold text-[9.5px] sm:text-xs shadow-md flex items-center justify-center gap-1 transition cursor-pointer overflow-hidden"
                                >
                                  <FaRocket className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 flex-shrink-0" />
                                  <span className="truncate">{tool.buttonLabel}</span>
                                </button>
                                {tool.toolUrl !== '#siminfo' && (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      playPopSound(640);
                                      setActiveEmbeddedTool(tool);
                                    }}
                                    title="Preview Tool Inside Website"
                                    className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl bg-white/95 hover:bg-white text-indigo-700 border border-white shadow-xs flex items-center justify-center transition cursor-pointer flex-shrink-0"
                                  >
                                    <FaEye className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5" />
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </section>
            )}

            {/* Interactive SMM Panel Tools: Price & Profit Calculator + Live Order Tracker + Real-Time Activity Ticker */}
            {siteVisibility.showSimDatabaseTracker && (
              <PanelToolsSection
                siteConfig={siteConfig}
                primaryWaNumber={PRIMARY_WA_NUMBER}
                onQuickFilter={(cat, kw) => filterStore(cat, kw)}
                onPlayPop={playPopSound}
                servicesCatalog={visibleServicesCatalog}
                onSelectServiceById={(id) => {
                  const found = visibleServicesCatalog.find((s) => s.id === id);
                  if (found) {
                    openOrderModal(found);
                  } else {
                    filterStore('all', '');
                  }
                }}
              />
            )}

            {/* Flagship AI Pro Accounts Spotlight + 1-2-3 Steps + 100% Trusted Reviews Sections */}
            {siteVisibility.showReviewsSection && (
              <ShowcaseSections
                siteConfig={siteConfig}
                servicesCatalog={visibleServicesCatalog}
                onQuickFilter={(cat, kw) => filterStore(cat, kw)}
                onPlayPop={playPopSound}
                reviews={reviews}
                primaryWaNumber={siteConfig.contact.whatsappNumberClean}
                isAdmin={Boolean(adminToken)}
                currentUserName={vipUser?.name || ''}
                onAddReview={handleAddReview}
                onDeleteReview={handleDeleteReview}
                onToggleVerified={handleToggleVerifiedReview}
                onSelectServiceById={(id) => {
                  const found = visibleServicesCatalog.find((s) => s.id === id);
                  if (found) {
                    openOrderModal(found);
                  } else {
                    filterStore('capcut_ai', '');
                  }
                }}
              />
            )}

            {/* ==================== 2 NO PROMO & DEAL BANNERS (BELOW SERVICES) ==================== */}
            {(siteVisibility.showPromoBanners ?? true) && (
              <>
                {allPromoBanners
                  .filter(
                    (b) =>
                      !b.position ||
                      b.position === 'below_services' ||
                      b.position === 'both'
                  )
                  .map((b) => renderPromoBanner(b))}
              </>
            )}
          </div>
        )}

        {/* ==================== VIEW 2: LIVE WEB TOOLS & AI UTILITIES HUB ==================== */}
        {activeTab === 'siminfo' && (
          <div className="space-y-5 transition-all duration-300">
            {/* WEB TOOLS HERO BANNER */}
            <div data-scroll="up" className="text-center space-y-1">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/75 border border-white text-xs font-bold text-indigo-700 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>{fullBrandTitle.toUpperCase()} • LIVE WEB TOOLS &amp; AI LAUNCHER HUB</span>
              </div>
              <h2 className="title-3d-rose text-2xl sm:text-4xl font-extrabold tracking-tight">
                Instant Online Tools &amp; AI Studio 🛠️
              </h2>
              <p className="text-xs sm:text-sm font-semibold text-slate-700 max-w-md mx-auto">
                Launch official AI workspaces, design tools &amp; creator utilities directly with 1 tap.
              </p>
            </div>

            {visibleWebToolsCatalog.length > 0 && (
              <div data-scroll="up" className="acrylic-frame rounded-[24px] sm:rounded-[30px] p-2 sm:p-5 space-y-3.5">
                <div className="plush-pillow plush-about rounded-[18px] sm:rounded-[24px] p-3 sm:p-5 space-y-3.5">
                  <div className="flex items-center justify-between border-b border-pink-200 pb-2.5">
                    <div>
                      <span className="text-[10px] font-extrabold uppercase text-purple-700">
                        ⚡ ALL CONNECTED WEB TOOLS ({visibleWebToolsCatalog.length})
                      </span>
                      <h3 className="text-base sm:text-xl font-extrabold text-slate-900">
                        Live Tools &amp; Creator Utilities
                      </h3>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3.5">
                    {visibleWebToolsCatalog.map((tool, idx) => (
                      <div
                        key={tool.id}
                        data-scroll="zoom"
                        className={`min-w-0 overflow-hidden p-2.5 sm:p-3 rounded-2xl bg-white/90 border border-pink-100 shadow-xs flex flex-col justify-between space-y-2.5 content-visibility-auto ${
                          idx % 3 === 1 ? 'scroll-delay-1' : idx % 3 === 2 ? 'scroll-delay-2' : ''
                        }`}
                      >
                        <div className="min-w-0 space-y-1.5">
                          <div className="flex items-center justify-between gap-1.5 min-w-0">
                            <div
                              className={`w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br ${tool.orbGrad} flex items-center justify-center text-white shadow-xs overflow-hidden flex-shrink-0`}
                            >
                              {renderOrbVisual(tool.iconType, tool.iconUrl, `${tool.id} ${tool.title}`)}
                            </div>
                            <span className="min-w-0 px-1.5 py-0.5 rounded-full bg-pink-50 text-pink-700 text-[7.5px] sm:text-[9px] font-extrabold border border-pink-200 truncate">
                              {tool.badge}
                            </span>
                          </div>
                          <div className="text-[11.5px] sm:text-sm font-extrabold text-slate-900 line-clamp-2 leading-snug">
                            {tool.title}
                          </div>
                          <div className="text-[9.5px] sm:text-xs font-medium text-slate-600 line-clamp-2 leading-snug">
                            {tool.desc}
                          </div>
                        </div>
                        <div className="flex items-center gap-1 w-full min-w-0">
                          <button
                            type="button"
                            onClick={() => launchWebTool(tool)}
                            className="flex-1 min-w-0 py-1.5 sm:py-2 px-2 sm:px-2.5 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 text-white font-extrabold text-[9.5px] sm:text-xs shadow-xs cursor-pointer overflow-hidden flex items-center justify-center gap-1"
                          >
                            <FaArrowUpRightFromSquare className="w-2.5 h-2.5 sm:w-3 sm:h-3 flex-shrink-0" />
                            <span className="truncate">{tool.buttonLabel}</span>
                          </button>
                          {tool.toolUrl !== '#siminfo' && (
                            <button
                              type="button"
                              onClick={() => {
                                playPopSound(640);
                                setActiveEmbeddedTool(tool);
                              }}
                              title="Preview Tool Inside Website"
                              className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl bg-pink-50 hover:bg-pink-100 text-purple-700 border border-pink-200 shadow-xs flex items-center justify-center transition cursor-pointer flex-shrink-0"
                            >
                              <FaEye className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ==================== VIEW 3: MODERN 3D GLASS ABOUT US ==================== */}
        {activeTab === 'about' && (
          <div className="space-y-6 transition-all duration-300">
            {/* About Header */}
            <div data-scroll="up" className="text-center space-y-1">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/75 border border-white text-xs font-extrabold text-purple-700 shadow-sm">
                <i className="fa-solid fa-wand-magic-sparkles text-amber-500"></i>
                <span>ABOUT {brandOwnerName.toUpperCase()} &amp; {brandAccentName.toUpperCase()}</span>
              </div>
              <h2 className="title-3d-rose text-2xl sm:text-4xl font-extrabold tracking-tight">
                Pakistan&apos;s #1 3D Digital &amp; SMM Hub
              </h2>
              <p className="text-xs sm:text-sm font-semibold text-slate-700 max-w-xl mx-auto">
                Combining Full-Stack Web Engineering, AI Pro Subscriptions, Ad Agency Accounts, and Franchise/NADRA Verification under one trusted roof.
              </p>
            </div>

            {/* 4 Tactile 3D Plush Stat Counters */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div
                data-scroll="zoom"
                onMouseEnter={() => playPopSound(520)}
                className="acrylic-frame acrylic-interactive rounded-[28px] p-2 text-center"
              >
                <div className="plush-pillow plush-srv-1 rounded-[22px] py-4 px-2 space-y-1">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-600 text-white flex items-center justify-center mx-auto shadow-md">
                    <i className="fa-solid fa-rocket text-sm"></i>
                  </div>
                  <div className="font-display font-bold text-xl sm:text-2xl text-slate-900">18,500+</div>
                  <div className="text-[10px] sm:text-[11px] font-extrabold text-rose-800 uppercase">
                    Orders Completed
                  </div>
                </div>
              </div>

              <div
                data-scroll="zoom"
                onMouseEnter={() => playPopSound(560)}
                className="acrylic-frame acrylic-interactive rounded-[28px] p-2 text-center scroll-delay-1"
              >
                <div className="plush-pillow plush-srv-3 rounded-[22px] py-4 px-2 space-y-1">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center mx-auto shadow-md">
                    <i className="fa-solid fa-face-smile-beam text-sm"></i>
                  </div>
                  <div className="font-display font-bold text-xl sm:text-2xl text-slate-900">99.8%</div>
                  <div className="text-[10px] sm:text-[11px] font-extrabold text-emerald-800 uppercase">
                    Happy Clients
                  </div>
                </div>
              </div>

              <div
                data-scroll="zoom"
                onMouseEnter={() => playPopSound(600)}
                className="acrylic-frame acrylic-interactive rounded-[28px] p-2 text-center scroll-delay-2"
              >
                <div className="plush-pillow plush-srv-4 rounded-[22px] py-4 px-2 space-y-1">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center mx-auto shadow-md">
                    <i className="fa-solid fa-layer-group text-sm"></i>
                  </div>
                  <div className="font-display font-bold text-xl sm:text-2xl text-slate-900">
                    {servicesCatalog.length}+
                  </div>
                  <div className="text-[10px] sm:text-[11px] font-extrabold text-blue-800 uppercase">
                    Live Services
                  </div>
                </div>
              </div>

              <div
                data-scroll="zoom"
                onMouseEnter={() => playPopSound(640)}
                className="acrylic-frame acrylic-interactive rounded-[28px] p-2 text-center scroll-delay-3"
              >
                <div className="plush-pillow plush-srv-5 rounded-[22px] py-4 px-2 space-y-1">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-purple-500 to-fuchsia-600 text-white flex items-center justify-center mx-auto shadow-md">
                    <i className="fa-solid fa-headset text-sm"></i>
                  </div>
                  <div className="font-display font-bold text-xl sm:text-2xl text-slate-900">24/7</div>
                  <div className="text-[10px] sm:text-[11px] font-extrabold text-purple-800 uppercase">
                    WhatsApp Support
                  </div>
                </div>
              </div>
            </div>

            {/* Main Story & Developer Vision Card */}
            <div data-scroll="up" className="acrylic-frame rounded-[34px] p-3 sm:p-4">
              <div className="plush-pillow plush-about rounded-[26px] p-5 sm:p-7 space-y-5">
                <div className="flex flex-col md:flex-row items-center gap-5">
                  {/* Mini 3D Portrait & Role */}
                  <div className="flex flex-col items-center text-center flex-shrink-0 space-y-2">
                    <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl p-1.5 bg-white shadow-xl border-2 border-pink-300 relative">
                      <img
                        src={siteConfig.banner.portraitUrl || "https://ik.imagekit.io/mrsaqib/mrsaqib242-img25_7oG52NZUY.png"}
                        alt={brandOwnerName}
                        className="w-full h-full object-cover object-[center_15%] rounded-2xl"
                      />
                      <span className="absolute -bottom-2 -right-2 px-2.5 py-0.5 rounded-full bg-emerald-500 text-white text-[9px] font-extrabold border-2 border-white shadow">
                        FOUNDER
                      </span>
                    </div>
                    <div>
                      <h3 className="text-base font-extrabold text-slate-900">{brandOwnerName}</h3>
                      <p className="text-[11px] font-bold text-pink-600">Founder &amp; Digital Services Leader</p>
                    </div>
                  </div>

                  {/* Bio & Mission */}
                  <div className="space-y-3 text-center md:text-left">
                    <span className="px-3 py-1 rounded-full bg-white/80 border border-pink-200 text-[10px] font-extrabold text-pink-700 uppercase">
                      🏆 Our Story &amp; Mission
                    </span>
                    <h3 className="text-lg sm:text-2xl font-extrabold text-slate-900 leading-snug">
                      Empowering Creators, Agencies &amp; Everyday Users with Instant Digital Solutions
                    </h3>
                    <p className="text-xs sm:text-sm font-medium text-slate-700 leading-relaxed">
                      Assalam-o-Alaikum! Main <strong>{brandOwnerName}</strong> hoon — ek Digital Services Provider &amp; Developer.{' '}
                      <strong>{fullBrandTitle}</strong> par aapko milte hain{' '}
                      <strong>CapCut Pro, Lovable Pro, Gemini 18-Month Pro, ChatGPT Plus, Claude AI, Muse AI 1B Tokens, ElevenLabs 300k Credits, Hostinger 12M</strong>,{' '}
                      <strong>TikTok UK/USA &amp; Ad Agency Accounts</strong>, aur{' '}
                      <strong>Franchise SIM/CDR &amp; NADRA Verification</strong> services wholesale rates par!
                    </p>
                    {/* Skills / Tech Pills */}
                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-1.5 pt-1">
                      <span className="px-3 py-1 rounded-xl bg-white/85 border border-white text-[11px] font-extrabold text-slate-800 shadow-sm">
                        <i className="fa-solid fa-wand-magic-sparkles text-purple-600 mr-1"></i>AI &amp; Pro Subscriptions
                      </span>
                      <span className="px-3 py-1 rounded-xl bg-white/85 border border-white text-[11px] font-extrabold text-slate-800 shadow-sm">
                        <i className="fa-solid fa-bullhorn text-rose-500 mr-1"></i>TikTok &amp; FB Ad Agency
                      </span>
                      <span className="px-3 py-1 rounded-xl bg-white/85 border border-white text-[11px] font-extrabold text-slate-800 shadow-sm">
                        <i className="fa-solid fa-satellite-dish text-emerald-600 mr-1"></i>Franchise SIM &amp; CDR
                      </span>
                      <span className="px-3 py-1 rounded-xl bg-white/85 border border-white text-[11px] font-extrabold text-slate-800 shadow-sm">
                        <i className="fa-brands fa-bitcoin text-amber-500 mr-1"></i>USDT &amp; Creative Studio
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Why Choose Us 4-Card Grid (2-Column on Mobile & Desktop) */}
            <div className="grid grid-cols-2 gap-2.5 sm:gap-4">
              <div data-scroll="left" className="acrylic-frame acrylic-interactive rounded-[22px] sm:rounded-[28px] p-1.5 sm:p-2.5">
                <div className="plush-pillow plush-whatsapp rounded-[18px] sm:rounded-[22px] p-3 sm:p-4 flex flex-col sm:flex-row items-start gap-2 sm:gap-3.5 h-full">
                  <div className="fluffy-orb w-9 h-9 sm:w-12 sm:h-12 bg-gradient-to-br from-emerald-400 to-green-600 text-white flex items-center justify-center flex-shrink-0 border-2 border-white">
                    <i className="fa-solid fa-bolt text-sm sm:text-lg"></i>
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-base font-extrabold text-slate-900 leading-snug">5-Min Instant Delivery</h4>
                    <p className="text-[10px] sm:text-xs font-medium text-slate-700 mt-1 leading-snug sm:leading-relaxed">
                      Order lagate hi aapke AI Tools, TikTok Likes, ya SIM/NADRA reports chand minutes mein WhatsApp par deliver kiye jate hain.
                    </p>
                  </div>
                </div>
              </div>

              <div data-scroll="right" className="acrylic-frame acrylic-interactive rounded-[22px] sm:rounded-[28px] p-1.5 sm:p-2.5 scroll-delay-1">
                <div className="plush-pillow plush-website rounded-[18px] sm:rounded-[22px] p-3 sm:p-4 flex flex-col sm:flex-row items-start gap-2 sm:gap-3.5 h-full">
                  <div className="fluffy-orb w-9 h-9 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-400 to-indigo-600 text-white flex items-center justify-center flex-shrink-0 border-2 border-white">
                    <i className="fa-solid fa-shield-heart text-sm sm:text-lg"></i>
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-base font-extrabold text-slate-900 leading-snug">100% Full Warranty</h4>
                    <p className="text-[10px] sm:text-xs font-medium text-slate-700 mt-1 leading-snug sm:leading-relaxed">
                      Hamari tamam subscriptions (CapCut Pro, Gemini 18M, Hostinger 12M) aur followers full period warranty ke sath aate hain.
                    </p>
                  </div>
                </div>
              </div>

              <div data-scroll="left" className="acrylic-frame acrylic-interactive rounded-[22px] sm:rounded-[28px] p-1.5 sm:p-2.5 scroll-delay-1">
                <div className="plush-pillow plush-ig rounded-[18px] sm:rounded-[22px] p-3 sm:p-4 flex flex-col sm:flex-row items-start gap-2 sm:gap-3.5 h-full">
                  <div className="fluffy-orb w-9 h-9 sm:w-12 sm:h-12 bg-gradient-to-br from-amber-400 to-orange-500 text-white flex items-center justify-center flex-shrink-0 border-2 border-white">
                    <i className="fa-solid fa-wallet text-sm sm:text-lg"></i>
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-base font-extrabold text-slate-900 leading-snug">EasyPaisa &amp; JazzCash</h4>
                    <p className="text-[10px] sm:text-xs font-medium text-slate-700 mt-1 leading-snug sm:leading-relaxed">
                      Kisi international card ki zaroorat nahi! EasyPaisa, JazzCash, SadaPay, Bank ya USDT se payment karein.
                    </p>
                  </div>
                </div>
              </div>

              <div data-scroll="right" className="acrylic-frame acrylic-interactive rounded-[22px] sm:rounded-[28px] p-1.5 sm:p-2.5 scroll-delay-2">
                <div className="plush-pillow plush-snap rounded-[18px] sm:rounded-[22px] p-3 sm:p-4 flex flex-col sm:flex-row items-start gap-2 sm:gap-3.5 h-full">
                  <div className="fluffy-orb w-9 h-9 sm:w-12 sm:h-12 bg-gradient-to-br from-purple-500 to-pink-600 text-white flex items-center justify-center flex-shrink-0 border-2 border-white">
                    <i className="fa-solid fa-headset text-sm sm:text-lg"></i>
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-base font-extrabold text-slate-900 leading-snug">24/7 Live Support</h4>
                    <p className="text-[10px] sm:text-xs font-medium text-slate-700 mt-1 leading-snug sm:leading-relaxed">
                      {brandOwnerName} ki WhatsApp support team 24/7 active hai taake aapka har order foran mukammal ho.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==================== VIEW 4: MODERN INTERACTIVE 3D GLASS FAQS ==================== */}
        {activeTab === 'faqs' && (
          <div className="space-y-5 transition-all duration-300">
            <div data-scroll="up" className="text-center space-y-1">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/75 border border-white text-xs font-extrabold text-amber-600 shadow-sm">
                <i className="fa-solid fa-circle-question"></i>
                <span>FREQUENTLY ASKED QUESTIONS</span>
              </div>
              <h2 className="title-3d-rose text-2xl sm:text-4xl font-extrabold tracking-tight">
                Got Questions? We&apos;ve Got Answers!
              </h2>
              <p className="text-xs sm:text-sm font-semibold text-slate-700 max-w-lg mx-auto">
                Click on any question below to view details about AI tools, Ad Agency accounts, SIM/NADRA records, and payments.
              </p>
            </div>

            {/* FAQ Category Filter Pills */}
            <div data-scroll="zoom" className="acrylic-frame rounded-[26px] p-2">
              <div className="flex items-center justify-center gap-1.5 overflow-x-auto scrollbar-none">
                <button
                  onClick={() => {
                    playPopSound(580);
                    setFaqCategory('all');
                    setOpenFaqIndex(0);
                  }}
                  className={`px-3.5 py-1.5 rounded-xl text-xs whitespace-nowrap transition cursor-pointer ${
                    faqCategory === 'all'
                      ? 'font-extrabold bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-sm'
                      : 'font-bold bg-white/75 hover:bg-white text-slate-800'
                  }`}
                >
                  All Questions
                </button>
                <button
                  onClick={() => {
                    playPopSound(580);
                    setFaqCategory('tools');
                    setOpenFaqIndex(0);
                  }}
                  className={`px-3.5 py-1.5 rounded-xl text-xs whitespace-nowrap transition cursor-pointer ${
                    faqCategory === 'tools'
                      ? 'font-extrabold bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-sm'
                      : 'font-bold bg-white/75 hover:bg-white text-slate-800'
                  }`}
                >
                  <i className="fa-solid fa-wand-magic-sparkles text-purple-600 mr-1"></i>AI &amp; Pro Apps
                </button>
                <button
                  onClick={() => {
                    playPopSound(580);
                    setFaqCategory('smm');
                    setOpenFaqIndex(0);
                  }}
                  className={`px-3.5 py-1.5 rounded-xl text-xs whitespace-nowrap transition cursor-pointer ${
                    faqCategory === 'smm'
                      ? 'font-extrabold bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-sm'
                      : 'font-bold bg-white/75 hover:bg-white text-slate-800'
                  }`}
                >
                  <i className="fa-brands fa-tiktok text-rose-500 mr-1"></i>TikTok, UK &amp; Ads
                </button>
                <button
                  onClick={() => {
                    playPopSound(580);
                    setFaqCategory('sim');
                    setOpenFaqIndex(0);
                  }}
                  className={`px-3.5 py-1.5 rounded-xl text-xs whitespace-nowrap transition cursor-pointer ${
                    faqCategory === 'sim'
                      ? 'font-extrabold bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-sm'
                      : 'font-bold bg-white/75 hover:bg-white text-slate-800'
                  }`}
                >
                  <i className="fa-solid fa-sim-card text-emerald-600 mr-1"></i>Franchise &amp; NADRA
                </button>
                <button
                  onClick={() => {
                    playPopSound(580);
                    setFaqCategory('payment');
                    setOpenFaqIndex(0);
                  }}
                  className={`px-3.5 py-1.5 rounded-xl text-xs whitespace-nowrap transition cursor-pointer ${
                    faqCategory === 'payment'
                      ? 'font-extrabold bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-sm'
                      : 'font-bold bg-white/75 hover:bg-white text-slate-800'
                  }`}
                >
                  <i className="fa-solid fa-wallet text-amber-500 mr-1"></i>Payment &amp; USDT
                </button>
              </div>
            </div>

            {/* FAQ Accordion Container */}
            <div className="space-y-3">
              {filteredFaqs.map((item, idx) => {
                const isOpen = openFaqIndex === idx;
                return (
                  <div
                    key={idx}
                    data-scroll="up"
                    className={`faq-item acrylic-frame rounded-[26px] p-2 transition-all ${isOpen ? 'open' : ''}`}
                  >
                    <div className="plush-pillow plush-faq rounded-[20px] px-4 py-3.5">
                      <button
                        type="button"
                        onClick={() => {
                          playPopSound(620);
                          setOpenFaqIndex(isOpen ? null : idx);
                        }}
                        className="w-full flex items-center justify-between gap-3 text-left cursor-pointer"
                      >
                        <span className="text-xs sm:text-sm font-extrabold text-slate-900 flex items-center gap-2">
                          <span className="w-6 h-6 rounded-full bg-pink-500 text-white text-[11px] flex items-center justify-center flex-shrink-0 shadow-sm">
                            Q
                          </span>
                          <span>{item.q}</span>
                        </span>
                        <span className="faq-chevron w-7 h-7 rounded-full bg-white text-slate-700 flex items-center justify-center flex-shrink-0 shadow-sm transition-transform duration-300">
                          <i className="fa-solid fa-chevron-down text-xs"></i>
                        </span>
                      </button>
                      <div className="faq-answer">
                        <div className="pt-3 mt-2.5 border-t border-pink-200/70 text-xs sm:text-[13px] font-medium text-slate-700 leading-relaxed pl-8">
                          {item.a}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ==================== VIEW 5: MODERN CONTACT US & 3D SOCIAL HUB ==================== */}
        {activeTab === 'contact' && (
          <div className="space-y-6 transition-all duration-300">
            <div data-scroll="up" className="text-center space-y-1">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/75 border border-white text-xs font-extrabold text-blue-600 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                <span>24/7 LIVE CUSTOMER SUPPORT &amp; SOCIAL HUB</span>
              </div>
              <h2 className="title-3d-rose text-2xl sm:text-4xl font-extrabold tracking-tight">
                Get In Touch With {brandOwnerName}
              </h2>
              <p className="text-xs sm:text-sm font-semibold text-slate-700 max-w-lg mx-auto">
                Send a support ticket, inquire about custom orders, or connect across our official social channels.
              </p>
            </div>

            {/* 2-Column Modern Contact Form + Payment & Support Info */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              {/* Left (7 Cols): 3D Glass Direct Support Ticket Form */}
              <div data-scroll="left" className="lg:col-span-7 acrylic-frame rounded-[34px] p-3 sm:p-4">
                <div className="plush-pillow plush-sim-search rounded-[26px] p-4 sm:p-6 space-y-4 h-full flex flex-col justify-between">
                  <div className="flex items-center justify-between border-b border-pink-200 pb-3">
                    <div className="flex items-center gap-2.5">
                      <span className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-pink-500 to-purple-600 text-white flex items-center justify-center shadow-md">
                        <i className="fa-solid fa-paper-plane"></i>
                      </span>
                      <div>
                        <h3 className="text-sm sm:text-base font-extrabold text-slate-900">
                          Send Instant Support Ticket
                        </h3>
                        <p className="text-[10px] font-bold text-pink-600 uppercase">
                          Direct Dispatch to +92 347 8936242
                        </p>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-extrabold border border-emerald-300">
                      <i className="fa-solid fa-clock mr-1"></i>~2 Min Reply
                    </span>
                  </div>

                  <form onSubmit={handleContactSubmit} className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-extrabold text-slate-800 mb-1">
                          Your Full Name *
                        </label>
                        <div className="sim-input-box !py-1.5 !px-3 !rounded-2xl">
                          <i className="fa-solid fa-user text-pink-500 text-xs mr-2"></i>
                          <input
                            type="text"
                            value={contactName}
                            onChange={(e) => setContactName(e.target.value)}
                            required
                            placeholder="e.g. Ali Raza"
                            className="w-full bg-transparent border-none outline-none text-xs sm:text-sm font-bold text-slate-900"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-[11px] font-extrabold text-slate-800 mb-1">
                          Your WhatsApp Number *
                        </label>
                        <div className="sim-input-box !py-1.5 !px-3 !rounded-2xl">
                          <i className="fa-brands fa-whatsapp text-emerald-500 text-sm mr-2"></i>
                          <input
                            type="tel"
                            value={contactPhone}
                            onChange={(e) => setContactPhone(e.target.value)}
                            required
                            placeholder="0300-1234567"
                            className="w-full bg-transparent border-none outline-none text-xs sm:text-sm font-bold text-slate-900"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-extrabold text-slate-800 mb-1">
                          Select Service Category
                        </label>
                        <select
                          value={contactDept}
                          onChange={(e) => setContactDept(e.target.value)}
                          className="w-full px-3 py-2.5 rounded-2xl bg-white/90 border-2 border-pink-300 font-bold text-xs text-slate-900 focus:outline-none focus:border-pink-500"
                        >
                          <option value="AI & Pro Apps (CapCut, Lovable, Gemini, ChatGPT)">
                            🎬 AI &amp; Pro Apps (CapCut, Lovable, Gemini, ChatGPT)
                          </option>
                          <option value="TikTok UK/USA & Ad Agency Account">
                            🚀 TikTok UK/USA &amp; Ad Agency Account
                          </option>
                          <option value="Franchise SIM Info / CDR / Location">
                            📡 Franchise SIM Info / CDR / Location
                          </option>
                          <option value="NADRA FRC / Passport / Records Check">
                            🪪 NADRA FRC / Passport / Records Check
                          </option>
                          <option value="BTC/USDT / Video Editing / Graphics">
                            💲 BTC/USDT / Video Editing / Graphics
                          </option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[11px] font-extrabold text-slate-800 mb-1">
                          Priority Level
                        </label>
                        <select
                          value={contactPriority}
                          onChange={(e) => setContactPriority(e.target.value)}
                          className="w-full px-3 py-2.5 rounded-2xl bg-white/90 border-2 border-pink-300 font-bold text-xs text-slate-900 focus:outline-none focus:border-pink-500"
                        >
                          <option value="⚡ Urgent (Instant Deal)">⚡ Urgent (Instant Deal)</option>
                          <option value="📌 Normal Inquiry">📌 Normal Inquiry</option>
                          <option value="🤝 Bulk / Reseller Deal">🤝 Bulk / Reseller Deal</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-extrabold text-slate-800 mb-1">
                        Your Message / Order Details *
                      </label>
                      <textarea
                        rows={3}
                        value={contactMsg}
                        onChange={(e) => setContactMsg(e.target.value)}
                        required
                        placeholder="Write your message, package name, or question here..."
                        className="w-full p-3 rounded-2xl bg-white/90 border-2 border-pink-300 font-semibold text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-pink-500"
                      ></textarea>
                    </div>

                    <button
                      type="submit"
                      className="sim-btn-glow w-full py-3 px-4 font-display font-bold text-xs sm:text-sm tracking-wider flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <i className="fa-brands fa-whatsapp text-base"></i>
                      <span>SEND MESSAGE TO {brandOwnerName.toUpperCase()}</span>
                    </button>
                  </form>
                </div>
              </div>

              {/* Right (5 Cols): Payment Gateways & Direct Office Info */}
              <div className="lg:col-span-5 flex flex-col justify-between gap-4">
                {/* Accepted Payment Methods Card */}
                {(siteConfig.storeBars?.showAcceptedGatewaysCard ?? true) && (
                  <div className="acrylic-frame rounded-[30px] p-3">
                    <div className="plush-pillow plush-contact rounded-[24px] p-4 sm:p-5 space-y-3">
                      <div className="flex items-center gap-2">
                        <span className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow">
                          <i className="fa-solid fa-building-columns text-xs"></i>
                        </span>
                        <div>
                          <h4 className="text-sm font-extrabold text-slate-900">
                            {siteConfig.storeBars?.acceptedGatewaysTitle || 'Accepted Payment Gateways'}
                          </h4>
                          <p className="text-[10px] font-bold text-emerald-700">
                            {siteConfig.storeBars?.acceptedGatewaysSubtitle ||
                              '100% Secure Local & Crypto Verification'}
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs font-extrabold">
                        {siteConfig.paymentMethods
                          .filter((m) => m.enabled !== false)
                          .map((m) => (
                            <div
                              key={m.id}
                              className="bg-white/85 p-2.5 rounded-xl border border-white flex flex-col justify-between shadow-sm"
                            >
                              <div className="flex items-center gap-2">
                                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                                <span className="text-slate-900 truncate">{m.id}</span>
                              </div>
                              {(siteConfig.storeBars?.showAccountNumbersInCard ?? true) && (
                                <div className="text-[10px] font-mono-code text-pink-600 truncate mt-0.5">
                                  {m.accountNumber}
                                </div>
                              )}
                            </div>
                          ))}
                      </div>

                      {(siteConfig.storeBars?.showGatewaysWhatsappButton ?? true) && (
                        <button
                          onClick={() =>
                            copyText(activeWaNumberDisplay, 'Primary WhatsApp Number Copied!')
                          }
                          className="w-full py-2 rounded-xl bg-white hover:bg-emerald-50 text-emerald-800 border border-emerald-200 text-[11px] font-extrabold shadow-sm transition cursor-pointer"
                        >
                          <i className="fa-regular fa-copy mr-1"></i>Primary WhatsApp: {activeWaNumberDisplay}
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {/* Support Hours & Guarantee Card */}
                <div className="acrylic-frame rounded-[30px] p-3 flex-grow">
                  <div className="plush-pillow plush-hero rounded-[24px] p-4 sm:p-5 space-y-2.5 h-full flex flex-col justify-between">
                    <div className="space-y-1.5">
                      <span className="px-2.5 py-0.5 rounded-full bg-white/80 text-pink-700 text-[10px] font-extrabold border border-pink-200">
                        ⚡ FAST HELPDESK
                      </span>
                      <h4 className="text-sm sm:text-base font-extrabold text-slate-900">
                        Working Hours &amp; Response Time
                      </h4>
                      <p className="text-xs font-medium text-slate-700 leading-relaxed">
                        Hamari team rozana <strong>24 Ghante (Monday – Sunday)</strong> active rehti hai. WhatsApp par message karein aur fori jawab hasil karein.
                      </p>
                    </div>
                    <div className="pt-2 border-t border-pink-200/70 flex items-center justify-between text-[11px] font-extrabold text-slate-800">
                      <span>
                        <i className="fa-solid fa-location-dot text-pink-600 mr-1"></i>Pakistan (Online Nationwide)
                      </span>
                      <span className="text-emerald-700">● Online Now</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Official Social Hub Capsules */}
            <section className="pt-2 space-y-4">
              <h3 className="text-center text-lg sm:text-2xl font-extrabold text-slate-900 tracking-tight drop-shadow-sm">
                Official Direct Links &amp; Social Media
              </h3>

              {/* Primary 2-Column Contact Capsules: WhatsApp & Website */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                {/* WhatsApp Capsule */}
                <div
                  onMouseEnter={() => playPopSound(520)}
                  className="acrylic-frame acrylic-interactive rounded-[30px] sm:rounded-[36px] p-2 sm:p-2.5 cursor-pointer group relative"
                >
                  <div className="plush-pillow plush-whatsapp rounded-[24px] sm:rounded-[28px] p-3 sm:p-4 flex items-center gap-3 sm:gap-3.5">
                    <a
                      href={`https://wa.me/${activeWaNumberClean}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="fluffy-orb w-14 h-14 sm:w-[70px] sm:h-[70px] flex-shrink-0 bg-gradient-to-br from-[#9be89d] via-[#68c76b] to-[#46a749] flex items-center justify-center border-2 border-white/80"
                    >
                      <i className="fa-brands fa-whatsapp text-white text-2xl sm:text-4xl drop-shadow"></i>
                    </a>
                    <div className="flex-grow min-w-0">
                      <a href={`https://wa.me/${activeWaNumberClean}`} target="_blank" rel="noopener noreferrer" className="block">
                        <div className="text-lg sm:text-2xl font-extrabold text-slate-900 leading-tight group-hover:text-emerald-950">
                          WhatsApp
                        </div>
                        <div className="text-xs sm:text-base font-bold text-slate-800 tracking-tight truncate mt-0.5">
                          {activeWaNumberDisplay}
                        </div>
                      </a>
                      <div className="flex items-center gap-1.5 sm:gap-2 mt-1.5">
                        <a
                          href={`https://wa.me/${activeWaNumberClean}?text=${encodeURIComponent(
                            siteConfig.contact.whatsappDefaultMessage
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-600 text-white hover:bg-emerald-700 transition"
                        >
                          Chat Now
                        </a>
                        <button
                          onClick={() => copyText(activeWaNumberDisplay, 'WhatsApp number copied!')}
                          className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-white/80 hover:bg-white text-slate-700 border border-white transition cursor-pointer"
                        >
                          <i className="fa-regular fa-copy mr-1"></i>Copy
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Website Capsule */}
                <div
                  onMouseEnter={() => playPopSound(560)}
                  className="acrylic-frame acrylic-interactive rounded-[30px] sm:rounded-[36px] p-2 sm:p-2.5 cursor-pointer group relative"
                >
                  <div className="plush-pillow plush-website rounded-[24px] sm:rounded-[28px] p-3 sm:p-4 flex items-center gap-3 sm:gap-3.5">
                    <a
                      href={siteConfig.contact.officialWebsiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="fluffy-orb w-14 h-14 sm:w-[70px] sm:h-[70px] flex-shrink-0 bg-gradient-to-br from-[#8ec5fc] via-[#5b9bd5] to-[#3b78b5] flex items-center justify-center border-2 border-white/80"
                    >
                      <i className="fa-solid fa-globe text-white text-2xl sm:text-4xl drop-shadow"></i>
                    </a>
                    <div className="flex-grow min-w-0">
                      <a
                        href={siteConfig.contact.officialWebsiteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block"
                      >
                        <div className="text-lg sm:text-2xl font-extrabold text-slate-900 leading-tight group-hover:text-blue-950">
                          Website
                        </div>
                        <div className="text-xs sm:text-base font-bold text-slate-800 tracking-tight truncate mt-0.5">
                          {siteConfig.contact.officialWebsiteLabel}
                        </div>
                      </a>
                      <div className="flex items-center gap-1.5 sm:gap-2 mt-1.5">
                        <a
                          href={siteConfig.contact.officialWebsiteUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition"
                        >
                          Visit Site <i className="fa-solid fa-arrow-up-right-from-square ml-0.5 text-[9px]"></i>
                        </a>
                        <button
                          onClick={() =>
                            copyText(siteConfig.contact.officialWebsiteUrl, 'Website link copied!')
                          }
                          className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-white/80 hover:bg-white text-slate-700 border border-white transition cursor-pointer"
                        >
                          <i className="fa-regular fa-copy mr-1"></i>Copy
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Dynamic Tactile Plush Social Buttons (Up to 10+ Platforms Supported) */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2.5 sm:gap-3.5 pt-1">
                {getActiveSocialPlatforms(siteConfig.socials)
                  .filter((item) => item.enabled !== false && item.url)
                  .map((item) => (
                    <a
                      key={item.id}
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() =>
                        copyText(
                          item.handle,
                          `${item.label} (${item.handle}) copied! Opening...`
                        )
                      }
                      onMouseEnter={() => playPopSound(650)}
                      className="acrylic-frame acrylic-interactive rounded-[28px] sm:rounded-[34px] p-2 sm:p-2.5 group flex flex-col items-center justify-center cursor-pointer"
                    >
                      <div className="plush-pillow w-full h-24 sm:h-28 rounded-[22px] sm:rounded-[26px] flex flex-col items-center justify-center gap-1.5 relative py-2 sm:py-0 border border-white/60 bg-white/75 shadow-xs">
                        <div
                          className={`w-11 h-11 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-tr ${
                            item.colorGrad || 'from-indigo-500 to-purple-600'
                          } p-0.5 shadow-md group-hover:scale-110 transition-transform flex items-center justify-center`}
                        >
                          <div className="w-full h-full rounded-[14px] bg-white/15 flex items-center justify-center border border-white/40">
                            <i
                              className={`${
                                item.icon || 'fa-solid fa-link'
                              } text-xl sm:text-2xl text-white drop-shadow`}
                            ></i>
                          </div>
                        </div>
                        <div className="text-center px-1 max-w-full">
                          <div className="text-[11px] font-extrabold text-slate-900 truncate">
                            {item.label}
                          </div>
                          <div className="text-[9.5px] font-bold text-slate-600 truncate">
                            {item.handle}
                          </div>
                        </div>
                      </div>
                    </a>
                  ))}
              </div>
            </section>
          </div>
        )}

        {/* ==================== VIEW 6: CUSTOMER VIP LOGIN & WALLET PORTAL (FIXED TOP POSITION + RESPONSIVE ANIMATION UX) ==================== */}
        {activeTab === 'login' && (
          <div className="space-y-4 sm:space-y-5 transition-all duration-300">
            {/* TOP PORTAL NAVIGATION & LIVE WALLET BAR (CLEAN TOP POSITION, NO OVERLAP) */}
            <div className="relative z-10 acrylic-frame rounded-[24px] sm:rounded-[30px] p-1.5 sm:p-2 shadow-lg auth-portal-enter">
              <div className="plush-pillow plush-login rounded-[20px] sm:rounded-[24px] px-2.5 py-2 sm:px-4 sm:py-2.5 flex flex-wrap items-center justify-between gap-2">
                {/* Left: Segmented Switcher (VIP Login FIRST vs Add Balance) */}
                <div className="flex items-center gap-1.5 bg-white/85 p-1 rounded-2xl border border-pink-200/80 shadow-inner w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={() => {
                      playPopSound(640);
                      setLoginPortalSection('auth');
                    }}
                    className={`flex-1 sm:flex-initial px-3.5 py-2 rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all duration-200 cursor-pointer ${
                      loginPortalSection === 'auth'
                        ? 'bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 text-white shadow-md scale-[1.01]'
                        : 'text-slate-700 hover:text-slate-950 hover:bg-white/70'
                    }`}
                  >
                    <i className={`fa-solid ${vipUser ? 'fa-crown text-amber-300' : 'fa-right-to-bracket'}`}></i>
                    <span>{vipUser ? 'VIP Account Hub' : 'VIP Login / Sign Up'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      playPopSound(680);
                      setLoginPortalSection('wallet');
                    }}
                    className={`flex-1 sm:flex-initial px-3.5 py-2 rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all duration-200 cursor-pointer ${
                      loginPortalSection === 'wallet'
                        ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-md scale-[1.01]'
                        : 'text-slate-700 hover:text-slate-950 hover:bg-white/70'
                    }`}
                  >
                    <i className="fa-solid fa-wallet text-emerald-500"></i>
                    <span>Add Balance &amp; Proof</span>
                    {pendingProofsCount > 0 && (
                      <span className="px-1.5 py-0.2 rounded-full bg-amber-400 text-slate-950 text-[9px] font-extrabold">
                        {pendingProofsCount}
                      </span>
                    )}
                  </button>
                </div>

                {/* Right: Live Balance Pill + Instant Demo VIP / Back to Store */}
                <div className="flex items-center justify-between sm:justify-end gap-2 w-full sm:w-auto">
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 text-white text-[11px] font-extrabold shadow-sm">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                    <span className="text-slate-300">Balance:</span>
                    <span className="text-emerald-300 font-display" suppressHydrationWarning>Rs. {walletBalance.toLocaleString()}</span>
                  </div>

                  {!vipUser ? (
                    <button
                      type="button"
                      onClick={() => triggerDemoVipLogin()}
                      className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-400 via-orange-500 to-pink-500 text-white text-[11px] font-extrabold shadow-sm flex items-center gap-1 hover:scale-105 active:scale-95 transition cursor-pointer"
                    >
                      <i className="fa-solid fa-bolt"></i>
                      <span>1-Tap Demo Login</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={logoutVipUser}
                      className="px-3 py-1.5 rounded-xl bg-rose-100 hover:bg-rose-200 text-rose-700 text-[11px] font-extrabold transition cursor-pointer"
                    >
                      <i className="fa-solid fa-right-from-bracket mr-1"></i>Sign Out
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* ==================== SECTION A: TOP-POSITIONED VIP LOGIN / ACCOUNT PORTAL ==================== */}
            {loginPortalSection === 'auth' && (
              <>
                {!vipUser ? (
                  /* CUSTOMER VIP AUTHENTICATION CONTAINER — LOGIN CARD FIRST (ORDER-1) & ALIGNED SIDE-BY-SIDE */
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5 items-stretch">
                    {/* FIRST COLUMN (7 Cols, Order 1 on Mobile & Desktop): 3D Glass Login / Sign Up Form */}
                    <div className="lg:col-span-7 order-1 hero-rgb-card acrylic-frame rounded-[30px] sm:rounded-[34px] p-2.5 sm:p-4 flex flex-col justify-between auth-portal-enter">
                      <div className="plush-pillow plush-login rounded-[24px] sm:rounded-[26px] p-4 sm:p-6 space-y-4 h-full flex flex-col justify-between">
                        {/* Top Security & Instant Status Micro-Strip */}
                        <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-pink-200/70">
                          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/90 border border-pink-200 text-[10px] font-extrabold text-pink-700 shadow-2xs auth-float-badge">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                            <i className="fa-solid fa-shield-halved text-emerald-600"></i>
                            <span>SECURE VIP MEMBER &amp; RESELLER PORTAL</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => {
                                playPopSound(740);
                                setAuthIdentifier('03478936242');
                                setAuthPassword('vip2026');
                                if (authMode === 'signup') setAuthName(`${brandOwnerName} VIP`);
                                showToast('✨ Auto-filled Demo Credentials! Click Sign In below.');
                              }}
                              className="px-2.5 py-1 rounded-full bg-white/85 hover:bg-white text-purple-700 border border-purple-200 text-[10px] font-extrabold shadow-2xs transition hover:scale-105 cursor-pointer"
                            >
                              <i className="fa-solid fa-wand-magic-sparkles mr-1"></i>Auto-Fill
                            </button>
                          </div>
                        </div>

                        {/* Animated Mode Switcher: Sign In vs Create VIP Account */}
                        <div className="flex items-center justify-between gap-2 bg-white/80 p-1.5 rounded-2xl border border-white shadow-inner">
                          <button
                            type="button"
                            onClick={() => {
                              playPopSound(640);
                              setAuthMode('signin');
                            }}
                            className={`flex-1 py-2.5 rounded-xl text-xs transition-all duration-200 cursor-pointer flex items-center justify-center gap-1.5 ${
                              authMode === 'signin'
                                ? 'font-extrabold bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 text-white shadow-md scale-[1.01]'
                                : 'font-bold text-slate-700 hover:text-slate-900 hover:bg-white/60'
                            }`}
                          >
                            <i className="fa-solid fa-right-to-bracket"></i>
                            <span>Sign In to Account</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              playPopSound(640);
                              setAuthMode('signup');
                            }}
                            className={`flex-1 py-2.5 rounded-xl text-xs transition-all duration-200 cursor-pointer flex items-center justify-center gap-1.5 ${
                              authMode === 'signup'
                                ? 'font-extrabold bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 text-white shadow-md scale-[1.01]'
                                : 'font-bold text-slate-700 hover:text-slate-900 hover:bg-white/60'
                            }`}
                          >
                            <i className="fa-solid fa-user-plus"></i>
                            <span>Create VIP Account</span>
                          </button>
                        </div>

                        {/* Dynamic Header */}
                        <div className="flex items-center gap-3">
                          <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br from-pink-500 via-rose-500 to-purple-600 text-white flex items-center justify-center text-lg sm:text-xl shadow-md border-2 border-white flex-shrink-0">
                            <i className={`fa-solid ${authMode === 'signup' ? 'fa-rocket' : 'fa-crown text-amber-200'}`}></i>
                          </div>
                          <div>
                            <h3 className="text-lg sm:text-2xl font-extrabold text-slate-900 leading-tight">
                              {authMode === 'signup' ? 'Create Your VIP Account 🚀' : 'Welcome Back, Creator! 👋'}
                            </h3>
                            <p className="text-[11px] sm:text-xs font-semibold text-slate-600 mt-0.5">
                              {authMode === 'signup'
                                ? `Join ${fullBrandTitle} for 20% reseller SMM rates, AI tools & priority service delivery.`
                                : 'Sign in right here at the top to access your VIP Wallet & instant AI renewals.'}
                            </p>
                          </div>
                        </div>

                        {/* Interactive Animated Auth Form */}
                        <form key={authMode} onSubmit={handleAuthSubmit} className="space-y-3">
                          {authMode === 'signup' && (
                            <div className="auth-field-stagger-1">
                              <label className="block text-[11px] font-extrabold text-slate-800 mb-1">
                                Your Full Name *
                              </label>
                              <div className="sim-input-box auth-input-interactive !py-2.5 !px-3.5 !rounded-2xl">
                                <i className="fa-solid fa-user auth-input-icon text-pink-500 text-sm mr-2.5"></i>
                                <input
                                  type="text"
                                  value={authName}
                                  onChange={(e) => setAuthName(e.target.value)}
                                  placeholder="e.g. Ali Raza"
                                  className="w-full bg-transparent border-none outline-none text-xs sm:text-sm font-bold text-slate-900"
                                />
                                {authName && (
                                  <button
                                    type="button"
                                    onClick={() => setAuthName('')}
                                    className="text-slate-400 hover:text-rose-500 px-1.5 text-xs cursor-pointer"
                                  >
                                    <i className="fa-solid fa-circle-xmark"></i>
                                  </button>
                                )}
                              </div>
                            </div>
                          )}

                          <div className="auth-field-stagger-1">
                            <div className="flex items-center justify-between mb-1">
                              <label className="text-[11px] font-extrabold text-slate-800">
                                WhatsApp Number or Email Address *
                              </label>
                              <span className="text-[10px] font-bold text-emerald-700">
                                <i className="fa-solid fa-bolt mr-0.5"></i>Instant Verify
                              </span>
                            </div>
                            <div className="sim-input-box auth-input-interactive !py-2.5 !px-3.5 !rounded-2xl">
                              <i className="fa-solid fa-envelope auth-input-icon text-pink-500 text-sm mr-2.5"></i>
                              <input
                                type="text"
                                value={authIdentifier}
                                onChange={(e) => setAuthIdentifier(e.target.value)}
                                required
                                placeholder="03001234567 or name@email.com"
                                className="w-full bg-transparent border-none outline-none text-xs sm:text-sm font-bold text-slate-900"
                              />
                              {authIdentifier && (
                                <button
                                  type="button"
                                  onClick={() => setAuthIdentifier('')}
                                  className="text-slate-400 hover:text-rose-500 px-1.5 text-xs cursor-pointer"
                                >
                                  <i className="fa-solid fa-circle-xmark"></i>
                                </button>
                              )}
                            </div>
                          </div>

                          <div className="auth-field-stagger-2">
                            <div className="flex items-center justify-between mb-1">
                              <label className="text-[11px] font-extrabold text-slate-800">Password / Security PIN *</label>
                              <button
                                type="button"
                                onClick={() => {
                                  playPopSound(600);
                                  const id = authIdentifier.trim() || 'My VIP Account';
                                  openExternalWhatsApp(
                                    `🔑 *VIP Password Reset — ${fullBrandTitle}*\nHello ${brandOwnerName}, please reset the VIP Portal PIN/Password for: *${id}*`
                                  );
                                }}
                                className="text-[11px] font-extrabold text-pink-600 hover:underline cursor-pointer"
                              >
                                Forgot Password?
                              </button>
                            </div>
                            <div className="sim-input-box auth-input-interactive !py-2.5 !px-3.5 !rounded-2xl">
                              <i className="fa-solid fa-lock auth-input-icon text-pink-500 text-sm mr-2.5"></i>
                              <input
                                type={showPassword ? 'text' : 'password'}
                                value={authPassword}
                                onChange={(e) => setAuthPassword(e.target.value)}
                                required
                                placeholder="••••••••"
                                className="w-full bg-transparent border-none outline-none text-xs sm:text-sm font-bold text-slate-900"
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  playPopSound(520);
                                  setShowPassword((prev) => !prev);
                                }}
                                className="text-slate-500 hover:text-pink-600 px-2 py-0.5 rounded-lg bg-slate-100/80 hover:bg-pink-50 text-[10px] font-extrabold flex items-center gap-1 transition cursor-pointer"
                              >
                                <i
                                  className={
                                    showPassword
                                      ? 'fa-solid fa-eye-slash text-pink-600'
                                      : 'fa-solid fa-eye'
                                  }
                                ></i>
                                <span>{showPassword ? 'Hide' : 'Show'}</span>
                              </button>
                            </div>
                          </div>

                          

                          <div className="pt-1 auth-field-stagger-3">
                            <button
                              type="submit"
                              className="sim-btn-glow w-full py-3.5 px-4 font-display font-bold text-sm sm:text-base tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-lg hover:scale-[1.01] active:scale-[0.99] transition-transform"
                            >
                              <i className="fa-solid fa-key text-amber-300"></i>
                              <span>
                                {authMode === 'signup' ? 'CREATE VIP ACCOUNT NOW' : 'SIGN IN TO VIP PORTAL'}
                              </span>
                              <i className="fa-solid fa-arrow-right text-xs ml-1"></i>
                            </button>
                          </div>
                        </form>

                        {/* Quick WhatsApp OTP & 1-Tap Wallet Actions */}
                        <div className="space-y-2.5 pt-1">
                          <div className="flex items-center gap-2">
                            <div className="h-px bg-pink-200 flex-grow"></div>
                            <span className="text-[10px] font-extrabold uppercase text-slate-500">
                              Or 1-Tap Instant Access
                            </span>
                            <div className="h-px bg-pink-200 flex-grow"></div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            <button
                              type="button"
                              onClick={() => triggerDemoVipLogin()}
                              className="py-2.5 px-3 rounded-2xl bg-white/95 hover:bg-white text-slate-900 border border-pink-200 font-extrabold text-xs shadow-sm flex items-center justify-center gap-1.5 transition hover:scale-[1.02] active:scale-95 cursor-pointer"
                            >
                              <i className="fa-solid fa-bolt text-amber-500"></i> Demo VIP Login
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                playPopSound(680);
                                setLoginPortalSection('wallet');
                              }}
                              className="py-2.5 px-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-extrabold text-xs shadow-sm flex items-center justify-center gap-1.5 transition hover:scale-[1.02] active:scale-95 cursor-pointer"
                            >
                              <i className="fa-solid fa-wallet text-amber-300"></i> +Add Balance
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* SECOND COLUMN (5 Cols, Order 2): VIP Member Perks & Quick Deposit Card */}
                    <div className="lg:col-span-5 order-2 acrylic-frame rounded-[30px] sm:rounded-[34px] p-2.5 sm:p-3.5 flex flex-col justify-between auth-portal-enter">
                      <div className="plush-pillow plush-hero rounded-[24px] sm:rounded-[26px] p-4 sm:p-6 flex flex-col justify-between h-full space-y-4">
                        <div className="space-y-2.5">
                          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/85 border border-white text-[10px] font-extrabold text-pink-600 shadow-sm">
                            <i className="fa-solid fa-crown text-amber-500"></i> {fullBrandTitle.toUpperCase()} VIP MEMBER CLUB
                          </div>
                          <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 leading-tight">
                            Unlock Wholesale Reseller Rates, Instant AI Renewals &amp; Priority Support
                          </h2>
                          <p className="text-xs font-medium text-slate-700 leading-relaxed">
                            Sign in to your <strong>{fullBrandTitle} VIP Account</strong> to track active AI subscriptions, view order history, and get up to 20% reseller discounts.
                          </p>
                        </div>

                        {/* Interactive Animated VIP Benefits List */}
                        <div className="space-y-2.5">
                          <div className="auth-perk-card bg-white/85 p-3 rounded-2xl border border-white flex items-center gap-3 shadow-sm">
                            <span className="w-9 h-9 rounded-xl bg-gradient-to-br from-pink-500 to-rose-500 text-white flex items-center justify-center flex-shrink-0 shadow">
                              <i className="fa-solid fa-tags text-xs"></i>
                            </span>
                            <div>
                              <div className="text-xs font-extrabold text-slate-900">20% Wholesale Reseller Discount</div>
                              <div className="text-[10px] font-semibold text-slate-600">
                                Special bulk pricing on SMM, AI tools &amp; UK accounts
                              </div>
                            </div>
                          </div>

                          <div className="auth-perk-card bg-white/85 p-3 rounded-2xl border border-white flex items-center gap-3 shadow-sm">
                            <span className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 text-white flex items-center justify-center flex-shrink-0 shadow">
                              <i className="fa-solid fa-wand-magic-sparkles text-xs"></i>
                            </span>
                            <div>
                              <div className="text-xs font-extrabold text-slate-900">1-Click AI &amp; Pro Renewals</div>
                              <div className="text-[10px] font-semibold text-slate-600">
                                CapCut Pro, Lovable Pro, Gemini 18M &amp; ChatGPT Plus
                              </div>
                            </div>
                          </div>

                          <div className="auth-perk-card bg-white/85 p-3 rounded-2xl border border-white flex items-center gap-3 shadow-sm">
                            <span className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center flex-shrink-0 shadow">
                              <i className="fa-solid fa-sim-card text-xs"></i>
                            </span>
                            <div>
                              <div className="text-xs font-extrabold text-slate-900">Priority Franchise &amp; NADRA Desk</div>
                              <div className="text-[10px] font-semibold text-slate-600">
                                Fast-track SIM Owner, CDR, IMEI &amp; FRC reports
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Quick Jump to Add Wallet Balance & Payment Proof */}
                        <div className="pt-3 border-t border-pink-200/80 space-y-2">
                          <div className="flex items-center justify-between text-[11px] font-extrabold text-slate-800">
                            <span>Need to Top-Up Wallet Balance?</span>
                            <span className="text-emerald-700">EasyPaisa • JazzCash • Bank</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              playPopSound(680);
                              setLoginPortalSection('wallet');
                              window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                            className="w-full py-2.5 px-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-green-600 text-white text-xs font-extrabold shadow-md flex items-center justify-center gap-2 transition hover:scale-[1.02] cursor-pointer"
                          >
                            <i className="fa-solid fa-circle-plus text-amber-200"></i>
                            <span>Open Add Funds &amp; Payment Proof Studio</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* LOGGED-IN CUSTOMER VIP WALLET DASHBOARD (AT TOP) */
                  <div className="space-y-5 auth-portal-enter">
                    <div className="acrylic-frame rounded-[34px] p-3 sm:p-4">
                      <div className="plush-pillow plush-login rounded-[26px] p-4 sm:p-6 space-y-5">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-pink-200">
                          <div className="flex items-center gap-3">
                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-pink-500 to-purple-600 text-white flex items-center justify-center text-2xl font-display font-bold shadow-md border-2 border-white">
                              <span>{vipUser.name.charAt(0).toUpperCase()}</span>
                            </div>
                            <div>
                              <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-extrabold border border-emerald-300">
                                <i className="fa-solid fa-crown text-amber-500"></i> VERIFIED VIP MEMBER
                              </div>
                              <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 mt-0.5">
                                {vipUser.name}
                              </h3>
                              <p className="text-xs font-mono-code font-semibold text-slate-600">
                                WhatsApp: {vipUser.identifier} • 20% Reseller Discount Active
                              </p>
                            </div>
                          </div>

                          <div className="flex flex-wrap items-center gap-2">
                            <button
                              onClick={() => {
                                playPopSound(680);
                                setLoginPortalSection('wallet');
                              }}
                              className="px-4 py-2 rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-extrabold text-xs shadow-md cursor-pointer"
                            >
                              <i className="fa-solid fa-circle-plus mr-1.5"></i>+ Add Balance
                            </button>
                            <button
                              onClick={() => switchTab('store')}
                              className="px-4 py-2 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 text-white font-extrabold text-xs shadow-md cursor-pointer"
                            >
                              <i className="fa-solid fa-bag-shopping mr-1.5"></i>Browse Store
                            </button>
                            <button
                              onClick={logoutVipUser}
                              className="px-3.5 py-2 rounded-full bg-white/85 hover:bg-rose-50 text-rose-600 border border-rose-200 font-extrabold text-xs shadow-sm transition cursor-pointer"
                            >
                              <i className="fa-solid fa-right-from-bracket mr-1"></i>Sign Out
                            </button>
                          </div>
                        </div>

                        {/* 3 VIP Wallet & Status Cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <div className="auth-perk-card bg-white/85 p-4 rounded-2xl border border-white shadow-sm flex items-center justify-between">
                            <div>
                              <div className="text-[10px] font-extrabold uppercase text-slate-500">
                                VIP Wallet Balance
                              </div>
                              <div className="font-display font-bold text-2xl text-emerald-600 mt-0.5" suppressHydrationWarning>
                                Rs. {walletBalance.toLocaleString()}
                              </div>
                              <div className="text-[10px] font-bold text-slate-600 mt-0.5">
                                Ready for instant orders
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => setLoginPortalSection('wallet')}
                              className="w-11 h-11 rounded-2xl bg-emerald-100 hover:bg-emerald-200 text-emerald-600 flex items-center justify-center text-lg cursor-pointer"
                              title="Add Funds to Wallet"
                            >
                              <i className="fa-solid fa-plus"></i>
                            </button>
                          </div>

                          <div className="auth-perk-card bg-white/85 p-4 rounded-2xl border border-white shadow-sm flex items-center justify-between">
                            <div>
                              <div className="text-[10px] font-extrabold uppercase text-slate-500">
                                Active Subscriptions
                              </div>
                              <div className="font-display font-bold text-lg text-purple-700 mt-0.5">
                                CapCut + Lovable + Gemini
                              </div>
                              <div className="text-[10px] font-bold text-emerald-600 mt-0.5">
                                ● Full Warranty Active
                              </div>
                            </div>
                            <span className="w-11 h-11 rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center text-lg">
                              <i className="fa-solid fa-wand-magic-sparkles"></i>
                            </span>
                          </div>

                          <div className="auth-perk-card bg-white/85 p-4 rounded-2xl border border-white shadow-sm flex items-center justify-between">
                            <div>
                              <div className="text-[10px] font-extrabold uppercase text-slate-500">
                                Franchise &amp; SIM Quota
                              </div>
                              <div className="font-display font-bold text-2xl text-pink-600 mt-0.5">Unlimited</div>
                              <div className="text-[10px] font-bold text-slate-600 mt-0.5">
                                Priority CDR &amp; NADRA Desk
                              </div>
                            </div>
                            <span className="w-11 h-11 rounded-2xl bg-pink-100 text-pink-600 flex items-center justify-center text-lg">
                              <i className="fa-solid fa-sim-card"></i>
                            </span>
                          </div>
                        </div>

                        {/* Recent VIP Orders Table */}
                        <div className="bg-white/80 rounded-2xl p-4 border border-white space-y-2.5">
                          <div className="flex items-center justify-between">
                            <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-800">
                              <i className="fa-solid fa-clock-rotate-left text-pink-500 mr-1"></i>Recent Account Activity
                            </h4>
                            <button
                              onClick={() => setLoginPortalSection('wallet')}
                              className="text-[11px] font-extrabold text-emerald-700 hover:underline cursor-pointer"
                            >
                              + Add Funds &amp; Submit Proof
                            </button>
                          </div>
                          <div className="space-y-2 text-xs">
                            <div className="p-2.5 rounded-xl bg-white border border-pink-100 flex flex-wrap items-center justify-between gap-2">
                              <div className="font-bold text-slate-900">
                                <i className="fa-solid fa-wand-magic-sparkles text-purple-600 mr-1.5"></i>Google Gemini 18-Month Pro + ElevenLabs 300k
                              </div>
                              <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-extrabold">
                                Active License ✓
                              </span>
                            </div>
                            <div className="p-2.5 rounded-xl bg-white border border-pink-100 flex flex-wrap items-center justify-between gap-2">
                              <div className="font-bold text-slate-900">
                                <i className="fa-brands fa-tiktok text-rose-500 mr-1.5"></i>TikTok UK Monetizable Account + Ad Agency Setup
                              </div>
                              <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-extrabold">
                                Completed ✓
                              </span>
                            </div>
                            <div className="p-2.5 rounded-xl bg-white border border-pink-100 flex flex-wrap items-center justify-between gap-2">
                              <div className="font-bold text-slate-900">
                                <i className="fa-solid fa-satellite-dish text-blue-600 mr-1.5"></i>Fresh 2026 SIM Owner &amp; CDR Report
                              </div>
                              <span className="px-2.5 py-0.5 rounded-full bg-sky-100 text-sky-800 text-[10px] font-extrabold">
                                Delivered on WA ✓
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}

            {/* ==================== SECTION B: ADD FUNDS / PAYMENT PROOF SUBMISSION STUDIO ==================== */}
            {loginPortalSection === 'wallet' && (
              <div className="acrylic-frame rounded-[30px] sm:rounded-[34px] p-2.5 sm:p-4 auth-portal-enter">
                <div className="plush-pillow plush-login rounded-[24px] sm:rounded-[26px] p-3.5 sm:p-5 space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-pink-200/80">
                    <div className="flex items-center gap-2">
                      <span className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center text-xs shadow">
                        <i className="fa-solid fa-wallet"></i>
                      </span>
                      <div>
                        <h3 className="text-xs sm:text-sm font-extrabold text-slate-900">
                          Instant Wallet Deposit &amp; Screenshot Verification
                        </h3>
                        <p className="text-[10px] font-semibold text-slate-600">
                          Send payment via EasyPaisa / JazzCash / Bank and upload screenshot for instant balance
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        playPopSound(640);
                        setLoginPortalSection('auth');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="px-3 py-1.5 rounded-xl bg-white hover:bg-pink-50 text-pink-600 border border-pink-200 text-[11px] font-extrabold shadow-2xs transition cursor-pointer"
                    >
                      <i className="fa-solid fa-arrow-left mr-1"></i>Back to VIP Login
                    </button>
                  </div>

                  <UserAddFundsExperience
                    walletBalance={walletBalance}
                    paymentProofs={paymentProofs}
                    onSubmitProof={handleSubmitPaymentProof}
                    onCopyText={copyText}
                    onPlayPop={playPopSound}
                    onPreviewScreenshot={(proof) => setPreviewScreenshotProof(proof)}
                    depositMethods={siteConfig.paymentMethods}
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* ==================== VIEW 7: SECRET ADMIN COMMAND CENTER (/saqibadmb ONLY) ==================== */}
        {activeTab === 'saqibadmb' && (
          <React.Suspense
            fallback={
              <div className="acrylic-frame rounded-3xl p-12 text-center text-slate-800 font-extrabold flex flex-col items-center justify-center gap-3">
                <i className="fa-solid fa-circle-notch fa-spin text-3xl text-pink-500"></i>
                <span className="text-sm">Loading Muhammad Saqib Admin Command Center...</span>
              </div>
            }
          >
            <AdminStepByStepSettingsHub
            siteConfig={siteConfig}
            onUpdateSiteConfig={handleUpdateSiteConfig}
            onSaveSiteConfigToCloud={saveSiteConfigToCloud}
            isSavingSiteConfig={isSavingSiteConfig}
            onResetSiteConfig={resetSiteConfigToDefault}
            onReassignDeletedCategory={(deletedCatId, fallbackCatId) => {
              setServicesCatalog((prev) =>
                prev.map((srv) =>
                  srv.category === deletedCatId ? { ...srv, category: fallbackCatId } : srv
                )
              );
              if (currentCategory === deletedCatId) {
                setCurrentCategory('all');
              }
            }}
            servicesCatalog={servicesCatalog}
            editingServiceId={editingServiceId}
            adminTitle={adminTitle}
            setAdminTitle={setAdminTitle}
            adminCategory={adminCategory}
            setAdminCategory={setAdminCategory}
            adminBadge={adminBadge}
            setAdminBadge={setAdminBadge}
            adminDesc={adminDesc}
            setAdminDesc={setAdminDesc}
            adminPlush={adminPlush}
            setAdminPlush={setAdminPlush}
            adminIconType={adminIconType}
            setAdminIconType={setAdminIconType}
            adminCustomIconUrl={adminCustomIconUrl}
            setAdminCustomIconUrl={setAdminCustomIconUrl}
            adminDirectToolUrl={adminDirectToolUrl}
            setAdminDirectToolUrl={setAdminDirectToolUrl}
            adminInputLabel={adminInputLabel}
            setAdminInputLabel={setAdminInputLabel}
            adminPlaceholder={adminPlaceholder}
            setAdminPlaceholder={setAdminPlaceholder}
            adminTiersText={adminTiersText}
            setAdminTiersText={setAdminTiersText}
            adminSearchFilter={adminSearchFilter}
            setAdminSearchFilter={setAdminSearchFilter}
            adminFilteredCatalog={adminFilteredCatalog}
            handleSaveAdminService={handleSaveAdminService}
            startEditService={startEditService}
            deleteService={deleteService}
            toggleServiceHidden={toggleServiceHidden}
            setAllServicesHidden={setAllServicesHidden}
            resetAdminForm={resetAdminForm}
            resetCatalogToDefault={resetCatalogToDefault}
            webToolsCatalog={webToolsCatalog}
            editingToolId={editingToolId}
            toolTitle={toolTitle}
            setToolTitle={setToolTitle}
            toolUrl={toolUrl}
            setToolUrl={setToolUrl}
            toolIconUrl={toolIconUrl}
            setToolIconUrl={setToolIconUrl}
            toolDesc={toolDesc}
            setToolDesc={setToolDesc}
            toolBadge={toolBadge}
            setToolBadge={setToolBadge}
            toolButtonLabel={toolButtonLabel}
            setToolButtonLabel={setToolButtonLabel}
            toolPlush={toolPlush}
            setToolPlush={setToolPlush}
            toolIconType={toolIconType}
            setToolIconType={setToolIconType}
            toolOpenMode={toolOpenMode}
            setToolOpenMode={setToolOpenMode}
            toolSearchFilter={toolSearchFilter}
            setToolSearchFilter={setToolSearchFilter}
            adminFilteredTools={adminFilteredTools}
            handleSaveAdminTool={handleSaveAdminTool}
            startEditTool={startEditTool}
            deleteTool={deleteTool}
            toggleToolHidden={toggleToolHidden}
            setAllToolsHidden={setAllToolsHidden}
            resetToolForm={resetToolForm}
            resetToolsToDefault={resetToolsToDefault}
            launchWebTool={launchWebTool}
            walletBalance={walletBalance}
            paymentProofs={paymentProofs}
            pendingProofsCount={pendingProofsCount}
            handleApprovePaymentProof={handleApprovePaymentProof}
            handleRejectPaymentProof={handleRejectPaymentProof}
            handleDeletePaymentProof={handleDeletePaymentProof}
            handleSetCustomBalance={handleSetCustomBalance}
            onPreviewScreenshot={(proof) => setPreviewScreenshotProof(proof)}
            websiteUiMode={websiteUiMode}
            setWebsiteUiMode={setWebsiteUiMode}
            websiteFontMode={websiteFontMode}
            setWebsiteFontMode={setWebsiteFontMode}
            plushOptions={PLUSH_OPTIONS}
            soundEnabled={soundEnabled}
            toggleSound={toggleSound}
            playPopSound={playPopSound}
            showToast={showToast}
            copyText={copyText}
            exitSecretAdminPortal={exitSecretAdminPortal}
          />
          </React.Suspense>
        )}
      </main>

      {/* FOOTER */}
      <footer className="relative z-10 text-center pb-24 md:pb-6 px-3 sm:px-4 space-y-2">
        <div className="inline-flex flex-wrap items-center justify-center gap-2 sm:gap-3 px-4 sm:px-5 py-2.5 rounded-3xl sm:rounded-full bg-white/65 backdrop-blur-md border border-white/85 text-[11px] sm:text-xs font-bold text-slate-700 shadow-sm">
          <span>{siteConfig.footer.brandName || fullBrandTitle}</span>
          {siteConfig.footer.showQuickLinks && (
            <>
              <span>•</span>
              <button
                onClick={() => switchTab('store')}
                className="text-pink-600 hover:underline font-extrabold cursor-pointer"
              >
                All Services ({visibleServicesCatalog.length})
              </button>
              {siteVisibility.showToolsTab && (
                <>
                  <span>•</span>
                  <button
                    onClick={() => switchTab('siminfo')}
                    className="text-emerald-700 hover:underline font-extrabold cursor-pointer"
                  >
                    Web Tools
                  </button>
                </>
              )}
              {siteVisibility.showAboutTab && (
                <>
                  <span>•</span>
                  <button
                    onClick={() => switchTab('about')}
                    className="text-purple-700 hover:underline font-extrabold cursor-pointer"
                  >
                    About
                  </button>
                </>
              )}
              {siteVisibility.showFaqsTab && (
                <>
                  <span>•</span>
                  <button
                    onClick={() => switchTab('faqs')}
                    className="text-amber-700 hover:underline font-extrabold cursor-pointer"
                  >
                    FAQs
                  </button>
                </>
              )}
              {siteVisibility.showContactTab && (
                <>
                  <span>•</span>
                  <button
                    onClick={() => switchTab('contact')}
                    className="text-blue-700 hover:underline font-extrabold cursor-pointer"
                  >
                    Contact
                  </button>
                </>
              )}
              {siteVisibility.showLoginTab && (
                <>
                  <span>•</span>
                  <button
                    onClick={() => switchTab('login')}
                    className="text-rose-600 hover:underline font-extrabold cursor-pointer"
                  >
                    VIP Login
                  </button>
                </>
              )}
            </>
          )}
          {siteConfig.footer.copyrightTagline && (
            <>
              <span>•</span>
              <span className="text-[10px] font-semibold text-slate-600">
                {siteConfig.footer.copyrightTagline}
              </span>
            </>
          )}
        </div>

        {/* Permanent Developer Attribution — Made by Saqib */}
        <div className="text-[11px] text-slate-500 font-semibold flex items-center justify-center gap-1.5 select-none">
          <span>Made with</span>
          <span className="text-rose-500 animate-pulse text-xs">❤️</span>
          <span>by</span>
          <span className="font-extrabold text-slate-800 bg-white/70 px-2 py-0.5 rounded-full border border-slate-200 shadow-xs">
            Muhammad Saqib
          </span>
        </div>
      </footer>

      {/* ==================== FLOATING 3D ROCKET SCROLL-TO-TOP BUTTON ==================== */}
      {siteVisibility.showFloatingScrollTop && (
        <button
          ref={scrollTopBtnRef}
          type="button"
          onClick={() => {
            playPopSound(740);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          title="Scroll Back to Top"
          className={`fixed ${activeTab === 'saqibadmb' ? 'bottom-20 md:bottom-6' : 'bottom-34 md:bottom-22'} right-3 sm:right-5 z-40 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-gradient-to-tr from-pink-500 via-purple-600 to-indigo-600 text-white border-2 border-white shadow-xl flex items-center justify-center transition-all duration-300 cursor-pointer opacity-0 translate-y-6 scale-75 pointer-events-none`}
        >
          <FaRocket className="w-3.5 h-3.5 sm:w-4 sm:h-4 -rotate-45" />
        </button>
      )}

      {/* ==================== FLOATING INTERACTIVE WHATSAPP CHAT POPUP WIDGET ==================== */}
      {siteVisibility.showFloatingWhatsApp && activeTab !== 'saqibadmb' && (
        <WhatsAppChatWidget
          siteConfig={siteConfig}
          siteLang={siteLang}
          isOpen={whatsAppWidgetOpen}
          onToggle={() => setWhatsAppWidgetOpen((prev) => !prev)}
          onClose={() => setWhatsAppWidgetOpen(false)}
          onPlayPop={playPopSound}
        />
      )}

      {/* ==================== FIXED 3D GLASS MOBILE BOTTOM APP DOCK (MD:HIDDEN) ==================== */}
      {siteVisibility.showMobileBottomDock && (
        <div className="fixed bottom-2 inset-x-2 z-40 md:hidden rounded-[26px] mobile-bottom-dock px-1.5 pt-1.5">
          <div className="flex items-center justify-around gap-1">
            {[
              {
                id: 'store' as TabId,
                label: t.navStore,
                icon: 'fa-solid fa-fire-flame-curved',
                activeColor: 'from-pink-500 to-rose-500',
                show: true
              },
              {
                id: 'siminfo' as TabId,
                label: t.navTools,
                icon: 'fa-solid fa-screwdriver-wrench',
                activeColor: 'from-emerald-500 to-teal-600',
                show: siteVisibility.showToolsTab
              },
              {
                id: 'about' as TabId,
                label: t.navAbout,
                icon: 'fa-solid fa-user-astronaut',
                activeColor: 'from-purple-500 to-indigo-600',
                show: siteVisibility.showAboutTab
              },
              {
                id: 'faqs' as TabId,
                label: t.navFaqs,
                icon: 'fa-solid fa-circle-question',
                activeColor: 'from-amber-500 to-orange-500',
                show: siteVisibility.showFaqsTab
              },
              {
                id: 'contact' as TabId,
                label: t.navContact,
                icon: 'fa-solid fa-headset',
                activeColor: 'from-blue-500 to-cyan-600',
                show: siteVisibility.showContactTab
              },
              {
                id: 'login' as TabId,
                label: vipUser ? (siteLang === 'ur' ? 'وی آئی پی' : 'VIP') : (siteLang === 'ur' ? 'لاگ ان' : 'Login'),
                icon: 'fa-solid fa-crown',
                activeColor: 'from-rose-500 to-pink-600',
                show: siteVisibility.showLoginTab
              }
            ]
              .filter((tab) => tab.show)
              .map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => switchTab(tab.id)}
                    className={`flex-1 flex flex-col items-center justify-center py-1.5 rounded-2xl transition-all cursor-pointer ${
                      isActive
                        ? `bg-gradient-to-br ${tab.activeColor} text-white shadow-md scale-[1.03]`
                        : 'text-slate-700 hover:bg-white/60'
                    }`}
                  >
                    <i className={`${tab.icon} text-xs`}></i>
                    <span className="text-[9px] font-extrabold tracking-tight mt-0.5 leading-none">
                      {tab.label}
                    </span>
                  </button>
                );
              })}
          </div>
        </div>
      )}

      {/* ==================== QUICK ORDER / BUY MODAL (MOBILE BOTTOM-SHEET & 3D GLASS) ==================== */}
      {activeOrderService && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-2 sm:p-4 bg-slate-900/45 backdrop-blur-md"
          onClick={closeOrderModal}
        >
          <div
            className="acrylic-frame rounded-[30px] sm:rounded-[34px] p-2.5 sm:p-3 w-full max-w-md max-h-[90dvh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className={`plush-pillow ${activeOrderService.plush} rounded-[24px] sm:rounded-[26px] p-4 sm:p-6 relative space-y-4`}>
              <button
                onClick={closeOrderModal}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/85 hover:bg-white flex items-center justify-center text-slate-800 shadow cursor-pointer"
              >
                <i className="fa-solid fa-xmark"></i>
              </button>

              <div className="flex items-center gap-3 pr-8">
                <div
                  className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${activeOrderService.orbGrad} text-white flex items-center justify-center text-xl shadow-md border-2 border-white flex-shrink-0`}
                >
                  {renderServiceIcon(
                    activeOrderService.iconType,
                    `${activeOrderService.id} ${activeOrderService.title}`
                  )}
                </div>
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-pink-700">
                    {activeOrderService.badge}
                  </span>
                  <h3 className="text-base sm:text-xl font-extrabold text-slate-900 leading-tight">
                    {activeOrderService.title}
                  </h3>
                </div>
              </div>

              {/* Selected Tier Box */}
              <div className="bg-white/75 rounded-2xl p-3 border border-white space-y-2">
                <label className="block text-[11px] font-extrabold uppercase text-slate-700">
                  Select Package / Quantity:
                </label>
                <select
                  value={modalTierValue}
                  onChange={(e) => setModalTierValue(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-white border border-pink-300 font-bold text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-pink-400"
                >
                  {(activeOrderService.tiers || []).map((t, i) => {
                    const formatted = formatTierToString(t);
                    return (
                      <option key={i} value={formatted}>
                        {formatted}
                      </option>
                    );
                  })}
                </select>
              </div>

              {/* Target Link / Username / Phone Input */}
              <div className="space-y-1">
                <label className="block text-xs font-extrabold text-slate-800">
                  {activeOrderService.inputLabel}
                </label>
                <input
                  ref={modalInputRef}
                  type="text"
                  value={modalTargetInput}
                  onChange={(e) => setModalTargetInput(e.target.value)}
                  placeholder={activeOrderService.placeholder}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/90 border border-white font-semibold text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-pink-400"
                />
              </div>

              {/* Promo / Coupon Code Section */}
              <div className="bg-white/80 rounded-2xl p-3 border border-pink-200/80 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-extrabold uppercase text-slate-800 flex items-center gap-1.5">
                    <i className="fa-solid fa-tag text-pink-500"></i>
                    <span>Promo / Coupon Code:</span>
                  </label>
                  {appliedOrderCoupon && (
                    <span className="text-[10px] font-black text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-300">
                      Applied ✓
                    </span>
                  )}
                </div>

                {appliedOrderCoupon ? (
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-50 border border-emerald-200">
                    <div className="space-y-0.5 min-w-0">
                      <div className="text-xs font-black text-emerald-800 flex items-center gap-1.5 font-mono">
                        <i className="fa-solid fa-circle-check text-emerald-600"></i>
                        <span>{appliedOrderCoupon.code}</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-200 text-emerald-800 font-sans font-bold">
                          -Rs. {appliedOrderCoupon.discountAmount.toLocaleString()} OFF
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-600">
                        Original: <span className="line-through">Rs. {appliedOrderCoupon.originalAmount.toLocaleString()}</span> → Final: <span className="font-extrabold text-slate-900">Rs. {appliedOrderCoupon.finalAmount.toLocaleString()}</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={removeOrderCoupon}
                      className="text-xs font-extrabold text-rose-600 hover:text-rose-700 px-2 py-1 rounded-lg hover:bg-rose-50 cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={orderCouponInput}
                        onChange={(e) => {
                          setOrderCouponInput(e.target.value.toUpperCase().replace(/\s+/g, ''));
                          setOrderCouponError(null);
                        }}
                        placeholder="e.g. WELCOME10, SAQIB50"
                        className="flex-1 px-3 py-2 rounded-xl bg-white border border-pink-200 font-mono font-bold text-xs text-slate-900 placeholder:font-sans placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-pink-400 uppercase"
                      />
                      <button
                        type="button"
                        disabled={isApplyingOrderCoupon || !orderCouponInput.trim()}
                        onClick={() => {
                          const priceMatch = modalTierValue.match(/Rs\.?\s*([\d,]+)/i);
                          const currentTierPrice = priceMatch ? Number(priceMatch[1].replace(/,/g, '')) || 0 : 0;
                          applyOrderCoupon(currentTierPrice, activeOrderService.category);
                        }}
                        className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs shadow-sm cursor-pointer disabled:opacity-40 transition flex items-center gap-1.5"
                      >
                        {isApplyingOrderCoupon ? (
                          <>
                            <i className="fa-solid fa-circle-notch fa-spin text-xs"></i>
                            <span>Applying...</span>
                          </>
                        ) : (
                          <span>Apply</span>
                        )}
                      </button>
                    </div>
                    {orderCouponError && (
                      <p className="text-[11px] font-bold text-rose-600 flex items-center gap-1 mt-1">
                        <i className="fa-solid fa-circle-exclamation text-xs"></i>
                        <span>{orderCouponError}</span>
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Payment Method Selector */}
              <div className="space-y-1">
                <label className="block text-xs font-extrabold text-slate-800">Payment Method:</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-bold">
                  {siteConfig.paymentMethods
                    .filter((m) => m.enabled !== false)
                    .map((m) => (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => {
                          playPopSound(580);
                          setSelectedPaymentMethod(m.id);
                        }}
                        className={`py-2 px-2 rounded-xl border border-white cursor-pointer truncate ${
                          selectedPaymentMethod === m.id
                            ? 'bg-emerald-600 text-white shadow-sm'
                            : 'bg-white/80 text-slate-800'
                        }`}
                      >
                        {m.id === 'SadaPay / Bank' ? 'SadaPay/Bank' : m.id}
                      </button>
                    ))}
                </div>
              </div>

              {/* Action Buttons (Pay via Wallet Balance OR Order on WhatsApp) */}
              <div className="pt-2 space-y-2">
                {(() => {
                  const priceMatch = modalTierValue.match(/Rs\.?\s*([\d,]+)/i);
                  const tierPrice = priceMatch
                    ? Number(priceMatch[1].replace(/,/g, '')) || 0
                    : 0;
                  const effectivePrice =
                    appliedOrderCoupon && appliedOrderCoupon.originalAmount === tierPrice
                      ? appliedOrderCoupon.finalAmount
                      : tierPrice;
                  const canAfford = effectivePrice > 0 && walletBalance >= effectivePrice;

                  return (
                    <button
                      type="button"
                      onClick={() => {
                        if (canAfford) {
                          playPopSound(880);
                          setWalletBalance((prev) => Math.max(0, prev - effectivePrice));
                          triggerConfettiBurst();
                          const discountMsg = appliedOrderCoupon
                            ? ` (Coupon "${appliedOrderCoupon.code}" saved Rs. ${appliedOrderCoupon.discountAmount.toLocaleString()})`
                            : '';
                          showToast(
                            `✅ Paid Rs. ${effectivePrice.toLocaleString()}${discountMsg} from Wallet Balance! Sending order to WhatsApp...`
                          );
                          const couponMsgPart = appliedOrderCoupon
                            ? `\n🏷️ *Coupon Code Applied:* ${appliedOrderCoupon.code} (-Rs. ${appliedOrderCoupon.discountAmount.toLocaleString()} OFF)\n💰 *Original Bill:* Rs. ${appliedOrderCoupon.originalAmount.toLocaleString()} | *Discounted Total:* Rs. ${effectivePrice.toLocaleString()}`
                            : `\n💰 *Total Paid:* Rs. ${effectivePrice.toLocaleString()}`;

                          openExternalWhatsApp(
                            `Assalam-o-Alaikum ${brandOwnerName}! 💳 *PAID VIA WALLET BALANCE*\n\n📦 *Service:* ${activeOrderService.title}\n💎 *Package:* ${modalTierValue}\n🎯 *Target:* ${
                              modalTargetInput.trim() || 'Provided on chat'
                            }${couponMsgPart}\n✅ *Deducted from Approved Wallet Balance:* Rs. ${effectivePrice.toLocaleString()}`
                          );
                          closeOrderModal();
                        } else {
                          playPopSound(640);
                          closeOrderModal();
                          setAddFundsModalOpen(true);
                        }
                      }}
                      className={`w-full py-2.5 px-4 rounded-full font-extrabold text-xs shadow-md flex items-center justify-center gap-2 transition cursor-pointer ${
                        canAfford
                          ? 'bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white hover:scale-[1.01]'
                          : 'bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300'
                      }`}
                    >
                      <i className="fa-solid fa-wallet"></i>
                      <span suppressHydrationWarning>
                        {canAfford
                          ? appliedOrderCoupon
                            ? `Pay Discounted Rs. ${effectivePrice.toLocaleString()} (Saved Rs. ${appliedOrderCoupon.discountAmount.toLocaleString()}) from Wallet`
                            : `Pay Instantly from Wallet Balance (Rs. ${walletBalance.toLocaleString()} Available)`
                          : `Wallet Balance Low (Rs. ${walletBalance.toLocaleString()}) — Click to +Add Balance`}
                      </span>
                    </button>
                  );
                })()}

                <div className="flex flex-col sm:flex-row gap-2">
                  <a
                    href={getWhatsAppOrderUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => {
                      playPopSound(820);
                      setTimeout(closeOrderModal, 150);
                    }}
                    className="flex-1 py-3 px-4 rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-extrabold text-xs sm:text-sm shadow-lg flex items-center justify-center gap-2 transition"
                  >
                    <i className="fa-brands fa-whatsapp text-base"></i> {siteLang === 'ur' ? 'واٹس ایپ پر آرڈر بھیجیں' : 'Order Now on WhatsApp'}
                  </a>
                  <button
                    onClick={addCurrentModalToCart}
                    className="py-3 px-4 rounded-full bg-white/90 hover:bg-white text-pink-600 font-extrabold text-xs border border-pink-200 shadow-sm transition cursor-pointer"
                  >
                    <i className="fa-solid fa-cart-plus mr-1"></i>{siteLang === 'ur' ? 'ٹوکری میں شامل کریں' : 'Add to Bag'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================== 3D GLASS ADD FUNDS / WALLET DEPOSIT MODAL ==================== */}
      {addFundsModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/75 backdrop-blur-md"
          onClick={() => setAddFundsModalOpen(false)}
        >
          <div
            className="relative w-full max-w-2xl acrylic-frame rounded-t-[30px] sm:rounded-[34px] p-2.5 sm:p-3.5 max-h-[92dvh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="plush-pillow plush-login rounded-[24px] sm:rounded-[28px] p-3.5 sm:p-5 relative space-y-4">
              <div className="flex items-center justify-between border-b border-pink-200 pb-2.5">
                <div className="flex items-center gap-2">
                  <span className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center shadow">
                    <i className="fa-solid fa-wallet"></i>
                  </span>
                  <div>
                    <h3 className="text-sm sm:text-lg font-extrabold text-slate-900">
                      {siteConfig.storeBars?.depositModalTitle || 'Add Funds / Top-Up Wallet Balance'}
                    </h3>
                    <p className="text-[10px] font-semibold text-slate-600">
                      {siteConfig.storeBars?.depositModalSubtitle ||
                        'Enter Amount → Select EasyPaisa/JazzCash → Submit Account Name & Screenshot'}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setAddFundsModalOpen(false)}
                  className="w-8 h-8 rounded-full bg-white text-slate-800 shadow flex items-center justify-center font-bold cursor-pointer"
                >
                  <i className="fa-solid fa-xmark"></i>
                </button>
              </div>

              <UserAddFundsExperience
                walletBalance={walletBalance}
                paymentProofs={paymentProofs}
                onSubmitProof={handleSubmitPaymentProof}
                onCopyText={copyText}
                onPlayPop={playPopSound}
                onPreviewScreenshot={(proof) => setPreviewScreenshotProof(proof)}
                depositMethods={siteConfig.paymentMethods}
                currencyPrefix={siteConfig.storeBars?.currencyPrefix || 'Rs.'}
                minDepositAmount={siteConfig.storeBars?.minDepositAmount ?? 50}
              />
            </div>
          </div>
        </div>
      )}

      {/* ==================== FULL-SCREEN PAYMENT SCREENSHOT (SS) PROOF LIGHTBOX MODAL ==================== */}
      {previewScreenshotProof && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md"
          onClick={() => setPreviewScreenshotProof(null)}
        >
          <div
            className="relative max-w-md w-full acrylic-frame rounded-[28px] sm:rounded-[32px] p-3"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="plush-pillow plush-about rounded-[22px] p-4 space-y-3">
              <div className="flex items-center justify-between border-b border-pink-200 pb-2.5">
                <div>
                  <span className="text-[10px] font-mono-code font-extrabold text-indigo-700">
                    PAYMENT PROOF #{previewScreenshotProof.id} • {previewScreenshotProof.method}
                  </span>
                  <h4 className="text-sm sm:text-base font-extrabold text-slate-900">
                    {previewScreenshotProof.senderAccountName} — Rs.{' '}
                    {previewScreenshotProof.amount.toLocaleString()}
                  </h4>
                  <p className="text-[11px] font-mono-code font-bold text-slate-600">
                    Sender Number: {previewScreenshotProof.senderAccountNumber} • TID: #{previewScreenshotProof.trxId}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setPreviewScreenshotProof(null)}
                  className="w-8 h-8 rounded-full bg-white text-slate-900 shadow flex items-center justify-center font-bold cursor-pointer"
                >
                  <i className="fa-solid fa-xmark"></i>
                </button>
              </div>

              {/* Direct Screenshot URL Bar with Copy & Open */}
              {previewScreenshotProof.screenshotUrl && (
                <div className="p-2.5 rounded-xl bg-slate-100/90 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <i className="fa-solid fa-link text-indigo-600 text-xs flex-shrink-0"></i>
                    <span
                      className="text-[10px] font-mono-code text-slate-700 truncate max-w-full sm:max-w-xs"
                      title={previewScreenshotProof.screenshotUrl}
                    >
                      {previewScreenshotProof.screenshotUrl.startsWith('data:')
                        ? 'Direct Base64 Screenshot Image'
                        : previewScreenshotProof.screenshotUrl}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 flex-shrink-0 self-end sm:self-auto">
                    <button
                      type="button"
                      onClick={() =>
                        copyText(previewScreenshotProof.screenshotUrl, 'Screenshot URL Copied!')
                      }
                      className="px-2.5 py-1 rounded-lg bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 text-[10px] font-extrabold shadow-xs cursor-pointer flex items-center gap-1"
                    >
                      <i className="fa-regular fa-copy text-[9px]"></i> Copy URL
                    </button>
                    {previewScreenshotProof.screenshotUrl.startsWith('http') && (
                      <a
                        href={previewScreenshotProof.screenshotUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-2.5 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 text-[10px] font-extrabold shadow-xs flex items-center gap-1"
                      >
                        <i className="fa-solid fa-arrow-up-right-from-square text-[9px]"></i> Open
                      </a>
                    )}
                  </div>
                </div>
              )}

              <div className="overflow-hidden rounded-2xl max-h-[58vh] flex items-center justify-center bg-slate-900/10 border border-white">
                <img
                  src={previewScreenshotProof.screenshotUrl}
                  alt="Payment Proof Screenshot"
                  className="w-full h-auto max-h-[58vh] object-contain rounded-2xl shadow-inner"
                />
              </div>

              {previewScreenshotProof.userNote && (
                <div className="text-[11px] font-medium text-slate-700 px-3 py-1.5 rounded-xl bg-white/80 border border-pink-100">
                  User Note: &ldquo;{previewScreenshotProof.userNote}&rdquo;
                </div>
              )}

              {activeTab === 'saqibadmb' && previewScreenshotProof.status !== 'approved' && (
                <button
                  type="button"
                  onClick={() => {
                    handleApprovePaymentProof(previewScreenshotProof.id);
                    setPreviewScreenshotProof(null);
                  }}
                  className="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-extrabold text-xs sm:text-sm shadow-lg cursor-pointer"
                >
                  <i className="fa-solid fa-check-double mr-1.5"></i>
                  Approve Proof &amp; Add +Rs. {previewScreenshotProof.amount.toLocaleString()} to User Balance
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ==================== SHOPPING BAG / MULTI-ORDER MODAL ==================== */}
      {cartModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-2 sm:p-4 bg-slate-900/45 backdrop-blur-md"
          onClick={() => setCartModalOpen(false)}
        >
          <div
            className="acrylic-frame rounded-[30px] sm:rounded-[34px] p-2.5 sm:p-3 w-full max-w-md max-h-[90dvh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="plush-pillow plush-sim-search rounded-[24px] sm:rounded-[26px] p-4 sm:p-6 relative space-y-4">
              <button
                onClick={() => setCartModalOpen(false)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/85 hover:bg-white flex items-center justify-center text-slate-800 shadow cursor-pointer"
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
              <div className="flex items-center gap-2.5">
                <span className="w-9 h-9 rounded-2xl bg-pink-500 text-white flex items-center justify-center shadow">
                  <i className="fa-solid fa-bag-shopping"></i>
                </span>
                <div>
                  <h3 className="text-lg font-extrabold text-slate-900">Your Selected Services</h3>
                  <p className="text-[11px] font-semibold text-slate-600">Send all items together on WhatsApp</p>
                </div>
              </div>

              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {shoppingCart.length === 0 ? (
                  <div className="text-center py-6 text-xs font-bold text-slate-600">
                    Your order bag is empty. Select any AI, SMM, Franchise or NADRA package!
                  </div>
                ) : (
                  shoppingCart.map((item, i) => (
                    <div
                      key={i}
                      className="bg-white/85 p-3 rounded-2xl border border-white flex items-center justify-between gap-2"
                    >
                      <div>
                        <div className="text-xs font-extrabold text-slate-900">{item.title}</div>
                        <div className="text-[11px] font-bold text-pink-600">{item.tier}</div>
                        <div className="text-[10px] text-slate-600 truncate max-w-[210px]">
                          Target: {item.target}
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          playPopSound(480);
                          setShoppingCart((prev) => prev.filter((_, idx) => idx !== i));
                        }}
                        className="w-7 h-7 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center text-xs cursor-pointer"
                      >
                        <i className="fa-solid fa-trash"></i>
                      </button>
                    </div>
                  ))
                )}
              </div>

              {/* Cart Coupon Code Box */}
              {(() => {
                const cartSubtotal = shoppingCart.reduce((sum, item) => {
                  const match = item.tier.match(/Rs\.?\s*([\d,]+)/i);
                  return sum + (match ? Number(match[1].replace(/,/g, '')) || 0 : 0);
                }, 0);

                return (
                  shoppingCart.length > 0 && (
                    <div className="bg-white/80 rounded-2xl p-2.5 border border-pink-200/80 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-extrabold text-slate-800 flex items-center gap-1">
                          <i className="fa-solid fa-tag text-pink-500"></i> Have a Cart Promo Code?
                        </span>
                        {appliedCartCoupon && (
                          <span className="text-[10px] font-black text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-300">
                            Applied ✓
                          </span>
                        )}
                      </div>

                      {appliedCartCoupon ? (
                        <div className="flex items-center justify-between p-2 rounded-xl bg-emerald-50 border border-emerald-200">
                          <div className="text-xs font-black text-emerald-800 font-mono flex items-center gap-1.5">
                            <i className="fa-solid fa-circle-check text-emerald-600"></i>
                            <span>{appliedCartCoupon.code}</span>
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-200 text-emerald-800 font-sans font-bold">
                              -Rs. {appliedCartCoupon.discountAmount.toLocaleString()} OFF
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={removeCartCoupon}
                            className="text-xs font-extrabold text-rose-600 hover:text-rose-700 px-2 cursor-pointer"
                          >
                            Remove
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5">
                            <input
                              type="text"
                              value={cartCouponInput}
                              onChange={(e) => {
                                setCartCouponInput(e.target.value.toUpperCase().replace(/\s+/g, ''));
                                setCartCouponError(null);
                              }}
                              placeholder="e.g. WELCOME10, SAQIB50"
                              className="flex-1 px-3 py-1.5 rounded-xl bg-white border border-pink-200 font-mono font-bold text-xs text-slate-900 placeholder:font-sans uppercase"
                            />
                            <button
                              type="button"
                              disabled={isApplyingCartCoupon || !cartCouponInput.trim()}
                              onClick={() => applyCartCoupon(cartSubtotal)}
                              className="px-3 py-1.5 rounded-xl bg-slate-900 text-white font-extrabold text-xs shadow-xs cursor-pointer disabled:opacity-40"
                            >
                              {isApplyingCartCoupon ? '...' : 'Apply'}
                            </button>
                          </div>
                          {cartCouponError && (
                            <p className="text-[10px] font-bold text-rose-600">{cartCouponError}</p>
                          )}
                        </div>
                      )}

                      {cartSubtotal > 0 && (
                        <div className="flex items-center justify-between text-xs font-black pt-1 border-t border-slate-100">
                          <span className="text-slate-600">Order Subtotal:</span>
                          <span className="text-slate-900">
                            {appliedCartCoupon ? (
                              <>
                                <span className="line-through text-slate-400 font-normal mr-1.5">
                                  Rs. {cartSubtotal.toLocaleString()}
                                </span>
                                <span className="text-emerald-700">
                                  Rs. {appliedCartCoupon.finalAmount.toLocaleString()}
                                </span>
                              </>
                            ) : (
                              `Rs. ${cartSubtotal.toLocaleString()}`
                            )}
                          </span>
                        </div>
                      )}
                    </div>
                  )
                );
              })()}

              <div className="pt-3 border-t border-pink-200 flex items-center justify-between">
                <button
                  onClick={() => {
                    playPopSound(420);
                    setShoppingCart([]);
                  }}
                  className="text-xs font-bold text-rose-600 hover:underline cursor-pointer"
                >
                  Clear All
                </button>
                {shoppingCart.length > 0 ? (
                  <a
                    href={getCartWhatsAppUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-5 py-2.5 rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-extrabold text-xs shadow-lg flex items-center gap-1.5"
                  >
                    <i className="fa-brands fa-whatsapp text-sm"></i> Send Complete Order
                  </a>
                ) : (
                  <button
                    onClick={() => showToast('Add at least 1 service first!')}
                    className="px-5 py-2.5 rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-extrabold text-xs shadow-lg flex items-center gap-1.5 cursor-pointer"
                  >
                    <i className="fa-brands fa-whatsapp text-sm"></i> Send Complete Order
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================== 6-THEME INSTANT SWITCHER MODAL ==================== */}
      {themeModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/75 backdrop-blur-md"
          onClick={() => setThemeModalOpen(false)}
        >
          <div
            className="relative w-full max-w-3xl acrylic-frame rounded-t-[30px] sm:rounded-[34px] p-2.5 sm:p-3.5 max-h-[92dvh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="plush-pillow plush-login rounded-[24px] sm:rounded-[28px] p-3.5 sm:p-5 relative space-y-4">
              <div className="flex items-center justify-between border-b border-pink-200 pb-3">
                <div className="flex items-center gap-2.5">
                  <span className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 text-white flex items-center justify-center shadow-md">
                    <i className="fa-solid fa-palette text-base"></i>
                  </span>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm sm:text-lg font-extrabold text-slate-900">
                        Choose Website Theme
                      </h3>
                      <span className="px-2 py-0.5 rounded-full bg-pink-100 text-pink-700 text-[10px] font-extrabold uppercase">
                        6 Themes
                      </span>
                    </div>
                    <p className="text-[11px] font-semibold text-slate-600">
                      Tap any theme to instantly preview and switch the store styling!
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setThemeModalOpen(false)}
                  className="w-8 h-8 rounded-full bg-white text-slate-800 shadow flex items-center justify-center font-bold hover:scale-110 transition cursor-pointer"
                >
                  <i className="fa-solid fa-xmark text-sm"></i>
                </button>
              </div>

              {/* 6 Theme Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {STORE_THEMES_CATALOG.map((theme) => {
                  const isActive = websiteUiMode === theme.id;
                  return (
                    <div
                      key={`modal-theme-${theme.id}`}
                      onClick={() => {
                        playPopSound(760);
                        setWebsiteUiMode(theme.id);
                        showToast(`🎨 Theme Applied: ${theme.name}!`);
                      }}
                      className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between gap-3 ${
                        isActive
                          ? 'bg-slate-900 text-white border-sky-400 shadow-xl scale-[1.02]'
                          : 'bg-white/95 hover:bg-white text-slate-900 border-slate-200 shadow-xs'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <span
                            className={`px-2 py-0.5 rounded-md text-[9px] font-extrabold uppercase ${
                              isActive
                                ? 'bg-sky-500/20 text-sky-300 border border-sky-400/40'
                                : 'bg-slate-100 text-slate-700 border border-slate-200'
                            }`}
                          >
                            {theme.badge}
                          </span>
                          {isActive && (
                            <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-emerald-400 text-slate-950">
                              ● ACTIVE
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          <div
                            className={`w-8 h-8 rounded-xl bg-gradient-to-br ${theme.gradient} text-white flex items-center justify-center shadow-xs text-xs flex-shrink-0`}
                          >
                            <i className={theme.icon}></i>
                          </div>
                          <div className="min-w-0">
                            <h4 className="text-xs sm:text-sm font-extrabold truncate">
                              {theme.name}
                            </h4>
                          </div>
                        </div>

                        <p
                          className={`text-[11px] mt-2 line-clamp-2 leading-relaxed ${
                            isActive ? 'text-slate-300' : 'text-slate-600'
                          }`}
                        >
                          {theme.tagline}
                        </p>

                        {/* Swatches */}
                        <div className="mt-3 flex items-center gap-1.5">
                          <span
                            className="w-5 h-5 rounded-full border border-white shadow-xs"
                            style={{ background: theme.swatch1 }}
                          ></span>
                          <span
                            className="w-5 h-5 rounded-full border border-white shadow-xs"
                            style={{ background: theme.swatch2 }}
                          ></span>
                          <span
                            className={`text-[10px] font-mono-code font-bold ml-1 ${
                              isActive ? 'text-slate-300' : 'text-slate-500'
                            }`}
                          >
                            {theme.shortLabel}
                          </span>
                        </div>
                      </div>

                      <button
                        type="button"
                        className={`w-full py-2 rounded-xl text-xs font-extrabold transition cursor-pointer flex items-center justify-center gap-1.5 ${
                          isActive
                            ? 'bg-sky-400 text-slate-950 font-black shadow-md'
                            : 'bg-slate-900 text-white hover:bg-slate-800'
                        }`}
                      >
                        <i className={isActive ? 'fa-solid fa-check' : 'fa-solid fa-wand-magic-sparkles'}></i>
                        <span>{isActive ? 'Current Theme' : 'Apply Theme'}</span>
                      </button>
                    </div>
                  );
                })}
              </div>

              <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between text-xs font-bold text-slate-600">
                <span>All services, bag &amp; wallet remain 100% saved across themes.</span>
                <button
                  type="button"
                  onClick={() => setThemeModalOpen(false)}
                  className="px-4 py-1.5 rounded-xl bg-slate-900 text-white font-extrabold text-xs cursor-pointer"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Photo Lightbox Modal */}
      {posterModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/75 backdrop-blur-md"
          onClick={() => setPosterModalOpen(false)}
        >
          <div
            className="relative max-w-sm sm:max-w-md w-full acrylic-frame rounded-[28px] sm:rounded-[32px] p-2 sm:p-2.5"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setPosterModalOpen(false)}
              className="absolute -top-3 -right-3 z-30 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white text-slate-900 shadow-lg flex items-center justify-center font-bold hover:scale-110 transition cursor-pointer"
            >
              <i className="fa-solid fa-xmark text-sm"></i>
            </button>
            <div className="overflow-hidden rounded-[22px] sm:rounded-[24px] max-h-[78vh] flex items-center justify-center bg-black/20">
              <img
                src={siteConfig.banner.portraitUrl}
                alt={siteConfig.banner.mainTitle}
                className="w-full h-auto max-h-[78vh] object-contain rounded-[22px] sm:rounded-[24px]"
              />
            </div>
            <div className="mt-2 text-center text-xs font-bold text-slate-800">
              {siteConfig.banner.mainTitle} {siteConfig.banner.highlightTitle}
            </div>
          </div>
        </div>
      )}

      {/* 3D Glass In-App Live Tool Viewer Modal */}
      {activeEmbeddedTool && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/75 backdrop-blur-md"
          onClick={() => setActiveEmbeddedTool(null)}
        >
          <div
            className="relative w-full max-w-4xl acrylic-frame rounded-t-[30px] sm:rounded-[34px] p-2.5 sm:p-3.5 max-h-[92dvh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="plush-pillow plush-capcut rounded-[24px] sm:rounded-[28px] p-3.5 sm:p-5 flex flex-col space-y-3 h-full">
              <div className="flex items-center justify-between gap-2 border-b border-indigo-200 pb-2.5">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div
                    className={`w-10 h-10 rounded-xl bg-gradient-to-br ${activeEmbeddedTool.orbGrad} flex items-center justify-center text-white shadow overflow-hidden flex-shrink-0`}
                  >
                    {renderOrbVisual(activeEmbeddedTool.iconType, activeEmbeddedTool.iconUrl)}
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-sm sm:text-base font-extrabold text-slate-900 truncate">
                      {activeEmbeddedTool.title}
                    </h3>
                    <p className="text-[10px] font-mono-code font-bold text-indigo-700 truncate">
                      {activeEmbeddedTool.toolUrl}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <a
                    href={activeEmbeddedTool.toolUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-pink-500 text-white font-extrabold text-[11px] shadow flex items-center gap-1"
                  >
                    <i className="fa-solid fa-arrow-up-right-from-square"></i>
                    <span>Open Full Tab</span>
                  </a>
                  <button
                    type="button"
                    onClick={() => setActiveEmbeddedTool(null)}
                    className="w-8 h-8 rounded-full bg-white text-slate-800 shadow flex items-center justify-center font-bold cursor-pointer"
                  >
                    <i className="fa-solid fa-xmark"></i>
                  </button>
                </div>
              </div>

              <div className="w-full h-[62dvh] sm:h-[65vh] rounded-2xl overflow-hidden bg-white border-2 border-white shadow-inner relative">
                <iframe
                  src={activeEmbeddedTool.toolUrl}
                  title={activeEmbeddedTool.title}
                  className="w-full h-full border-0"
                  sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
                />
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] font-semibold text-slate-700">
                <span>
                  Agar external website iframe block kare to <strong>Open Full Tab</strong> button dabayein.
                </span>
                <a
                  href={activeEmbeddedTool.toolUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-pink-600 font-extrabold hover:underline"
                >
                  Launch Direct Link →
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

            {/* Storefront Promotional & Welcome Announcement Popup Modal */}
      <PromoAnnouncementModal
        config={siteConfig.promoPopup}
        contactConfig={siteConfig.contact}
        onOpenAddFunds={() => setAddFundsModalOpen(true)}
        showToast={showToast}
        playPopSound={playPopSound}
      />

      {/* Toast Notification Pill */}
      <div
        className={`fixed bottom-5 right-5 z-50 pointer-events-none transition-all duration-300 ${
          toastMessage ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}
      >
        <div
          className={
            websiteUiMode !== 'pink-acrylic'
              ? 'space-navy-box rounded-full px-5 py-2.5 text-sky-300 border border-sky-400/50 text-xs font-extrabold shadow-2xl flex items-center gap-2.5'
              : 'acrylic-frame rounded-full px-5 py-2.5 bg-slate-900/90 text-white text-xs font-bold shadow-xl flex items-center gap-2'
          }
        >
          <span
            className={
              websiteUiMode !== 'pink-acrylic'
                ? 'w-2 h-2 rounded-full bg-sky-400 animate-ping'
                : 'hidden'
            }
          ></span>
          {websiteUiMode === 'pink-acrylic' && (
            <i className="fa-solid fa-circle-check text-pink-400 text-sm"></i>
          )}
          <span>{toastMessage || 'Astro-OS Ready!'}</span>
        </div>
      </div>
    </div>
  );
}
