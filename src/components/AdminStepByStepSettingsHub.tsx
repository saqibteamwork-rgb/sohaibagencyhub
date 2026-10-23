'use client';
import { uploadImageToImageKit } from '../lib/clientImageUpload';
import { ImageKitUploadField } from './ImageKitUploadField';

import React, { useState, useEffect } from 'react';
import {
  CategoryId,
  IconType,
  StoreService,
  WebToolItem,
  StoreCategoryMeta,
  CATEGORY_META
} from '../data/defaultCatalog';
import {
  DepositMethodMeta,
  DEPOSIT_METHODS,
  PaymentProofRequest,
  AdminPaymentApprovalStudio
} from './WalletAndAdminPayments';
import {
  WebsiteUiThemeMode,
  WebsiteFontMode,
  STORE_FONT_PACKS,
  AdminUiThemeSwitcherStudio
} from './AstroNeumorphicDeck';
import {
  BRAND_ICON_OPTIONS as ICON_OPTIONS,
  renderOrbVisual,
  renderServiceIcon,
  renderCategoryIcon,
  renderPaymentMethodIcon,
  SiWhatsapp,
  SiTiktok,
  FaRocket,
  FaArrowUpRightFromSquare,
  FaTrashCan,
  FaPenToSquare,
  FaScrewdriverWrench
} from './BrandIcons';
import {
  FaChevronRight,
  FaArrowLeft,
  FaMagnifyingGlass,
  FaBagShopping,
  FaCreditCard,
  FaBuildingColumns,
  FaWandMagicSparkles,
  FaPanorama,
  FaGlobe,
  FaShareNodes,
  FaSliders,
  FaPlus,
  FaCheck,
  FaRotateLeft,
  FaCopy,
  FaEye,
  FaEyeSlash,
  FaVolumeHigh,
  FaCircleCheck,
  FaLayerGroup,
  FaLock,
  FaFont,
  FaShieldHalved,
  FaUserShield,
  FaBolt,
  FaImages,
  FaTags,
  FaBullhorn,
  FaArrowUp,
  FaArrowRight,
  FaArrowDown,
  FaClone,
  FaPalette,
  FaStar
} from 'react-icons/fa6';
import { AdminSeoStudio } from './AdminSeoStudio';
import { AdminSecurityCredentialsStudio } from './AdminSecurityCredentialsStudio';
import { AdminAnalyticsDashboard } from './AdminAnalyticsDashboard';
import { AdminPromoPopupStudio } from './AdminPromoPopupStudio';
import { AdminNotificationBell } from './AdminNotificationBell';
import { AdminReviewModerationStudio } from './AdminReviewModerationStudio';

export {
  type SiteBannerConfig,
  type SiteContactConfig,
  type SiteSocialsConfig,
  type SiteFooterConfig,
  type SiteVisibilityConfig,
  DEFAULT_SITE_VISIBILITY,
  type SiteSeoConfig,
  DEFAULT_SITE_SEO,
  type SiteStoreBarsConfig,
  DEFAULT_STORE_BARS_CONFIG,
  type PromoBannerStyle,
  type SitePromoBannerItem,
  DEFAULT_PROMO_BANNERS,
  type SiteSettingsConfig,
  SITE_CONFIG_STORAGE_KEY,
  DEFAULT_SITE_CONFIG
} from '../types/siteConfig';
import {
  SiteBannerConfig,
  SiteContactConfig,
  SiteSocialsConfig,
  SiteFooterConfig,
  SocialPlatformItem,
  DEFAULT_SOCIAL_PLATFORMS,
  getActiveSocialPlatforms,
  SiteVisibilityConfig,
  DEFAULT_SITE_VISIBILITY,
  SiteSeoConfig,
  DEFAULT_SITE_SEO,
  SiteStoreBarsConfig,
  DEFAULT_STORE_BARS_CONFIG,
  PromoBannerStyle,
  SitePromoBannerItem,
  DEFAULT_PROMO_BANNERS,
  SiteSettingsConfig,
  SITE_CONFIG_STORAGE_KEY,
  DEFAULT_SITE_CONFIG
} from '../types/siteConfig';



function formatTierToString(rawTier: unknown): string {
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

export function getPromoBannerStyleClasses(style: PromoBannerStyle) {
  switch (style) {
    case 'dark':
      return {
        frame:
          'rounded-[30px] p-2 sm:p-3.5 bg-slate-950/60 backdrop-blur-md border border-indigo-500/40 shadow-2xl',
        inner:
          'rounded-[22px] p-4 sm:p-6 bg-gradient-to-r from-slate-950 via-indigo-950 to-purple-950 flex flex-col md:flex-row items-center justify-between gap-4 border border-indigo-400/30 text-white shadow-inner',
        badge: 'bg-indigo-500/25 text-sky-300 border border-indigo-400/40',
        title: 'text-white drop-shadow-sm',
        desc: 'text-slate-300',
        primaryBtn:
          'bg-gradient-to-r from-sky-500 via-indigo-500 to-purple-600 hover:from-sky-600 hover:to-purple-700 text-white shadow-lg shadow-indigo-500/30',
        secondaryBtn:
          'bg-white/10 hover:bg-white/20 text-white border border-white/25 shadow-sm',
        themeLabel: '🌌 Cyber Dark',
        pillBg: 'bg-indigo-900/60 text-sky-300 border-indigo-700'
      };
    case 'emerald':
      return {
        frame:
          'rounded-[30px] p-2 sm:p-3.5 bg-emerald-950/40 backdrop-blur-md border border-emerald-500/40 shadow-2xl',
        inner:
          'rounded-[22px] p-4 sm:p-6 bg-gradient-to-r from-emerald-950 via-teal-950 to-slate-950 flex flex-col md:flex-row items-center justify-between gap-4 border border-emerald-400/30 text-white shadow-inner',
        badge: 'bg-emerald-500/25 text-emerald-300 border border-emerald-400/40',
        title: 'text-white',
        desc: 'text-emerald-100',
        primaryBtn:
          'bg-gradient-to-r from-emerald-400 via-teal-500 to-green-500 text-slate-950 font-black shadow-lg shadow-emerald-500/30',
        secondaryBtn:
          'bg-white/10 hover:bg-white/20 text-white border border-white/25 shadow-sm',
        themeLabel: '💚 Emerald WhatsApp',
        pillBg: 'bg-emerald-900/60 text-emerald-300 border-emerald-700'
      };
    case 'amber':
      return {
        frame:
          'rounded-[30px] p-2 sm:p-3.5 bg-amber-950/40 backdrop-blur-md border border-amber-500/40 shadow-2xl',
        inner:
          'rounded-[22px] p-4 sm:p-6 bg-gradient-to-r from-amber-950 via-orange-950 to-slate-950 flex flex-col md:flex-row items-center justify-between gap-4 border border-amber-400/30 text-white shadow-inner',
        badge: 'bg-amber-500/25 text-amber-300 border border-amber-400/40',
        title: 'text-white',
        desc: 'text-amber-100',
        primaryBtn:
          'bg-gradient-to-r from-amber-400 via-yellow-400 to-orange-500 text-slate-950 font-black shadow-lg shadow-amber-500/30',
        secondaryBtn:
          'bg-white/10 hover:bg-white/20 text-white border border-white/25 shadow-sm',
        themeLabel: '👑 Gold Luxury',
        pillBg: 'bg-amber-900/60 text-amber-300 border-amber-700'
      };
    case 'cyan':
      return {
        frame:
          'rounded-[30px] p-2 sm:p-3.5 bg-cyan-950/40 backdrop-blur-md border border-cyan-500/40 shadow-2xl',
        inner:
          'rounded-[22px] p-4 sm:p-6 bg-gradient-to-r from-cyan-950 via-blue-950 to-slate-950 flex flex-col md:flex-row items-center justify-between gap-4 border border-cyan-400/30 text-white shadow-inner',
        badge: 'bg-cyan-500/25 text-cyan-300 border border-cyan-400/40',
        title: 'text-white',
        desc: 'text-cyan-100',
        primaryBtn:
          'bg-gradient-to-r from-cyan-400 via-sky-500 to-blue-600 text-slate-950 font-black shadow-lg shadow-cyan-500/30',
        secondaryBtn:
          'bg-white/10 hover:bg-white/20 text-white border border-white/25 shadow-sm',
        themeLabel: '💎 Ice Cyan',
        pillBg: 'bg-cyan-900/60 text-cyan-300 border-cyan-700'
      };
    case 'purple':
      return {
        frame:
          'rounded-[30px] p-2 sm:p-3.5 bg-purple-950/40 backdrop-blur-md border border-purple-500/40 shadow-2xl',
        inner:
          'rounded-[22px] p-4 sm:p-6 bg-gradient-to-r from-purple-950 via-fuchsia-950 to-slate-950 flex flex-col md:flex-row items-center justify-between gap-4 border border-purple-400/30 text-white shadow-inner',
        badge: 'bg-purple-500/25 text-purple-300 border border-purple-400/40',
        title: 'text-white',
        desc: 'text-purple-100',
        primaryBtn:
          'bg-gradient-to-r from-fuchsia-500 via-purple-500 to-pink-500 text-white font-black shadow-lg shadow-purple-500/30',
        secondaryBtn:
          'bg-white/10 hover:bg-white/20 text-white border border-white/25 shadow-sm',
        themeLabel: '🔮 Royal Purple',
        pillBg: 'bg-purple-900/60 text-purple-300 border-purple-700'
      };
    case 'rose':
    default:
      return {
        frame: 'acrylic-frame rounded-[30px] p-2.5 sm:p-3.5 shadow-xl',
        inner:
          'plush-pillow plush-sim-search rounded-[22px] p-4 sm:p-6 flex flex-col md:flex-row items-center justify-between gap-4 border border-pink-200/80',
        badge: 'bg-pink-100 text-pink-700 border border-pink-300',
        title: 'text-slate-900',
        desc: 'text-slate-700',
        primaryBtn:
          'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-lg shadow-emerald-500/25',
        secondaryBtn:
          'bg-white hover:bg-pink-50 text-pink-700 border border-pink-300 shadow-sm',
        themeLabel: '🌸 Plush Rose',
        pillBg: 'bg-pink-100 text-pink-700 border-pink-300'
      };
  }
}

export type AdminSettingsScreenId =
  | 'dashboard'
  | 'home'
  | 'visibility'
  | 'categories'
  | 'services'
  | 'tools'
  | 'banner'
  | 'promo_banners'
  | 'store_bars'
  | 'payment_methods'
  | 'payments'
  | 'contact_footer'
  | 'ui'
  | 'seo'
  | 'security'
  | 'promo_popup'
  | 'reviews';

interface PlushOption {
  value: string;
  label: string;
  orb: string;
}

interface PlanRowItem {
  name: string;
  price: string;
}

function parseTiersToPlanRows(tiersText: string): PlanRowItem[] {
  const lines = tiersText
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean);
  if (lines.length === 0) {
    return [{ name: '1 Month Package', price: '500' }];
  }
  return lines.map((line) => {
    const dashParts = line.split(/\s*[—–-]\s*Rs\.?\s*/i);
    if (dashParts.length >= 2) {
      return {
        name: dashParts[0].trim(),
        price: dashParts.slice(1).join(' ').replace(/[^0-9,]/g, '').trim() || '500'
      };
    }
    const rsMatch = line.match(/^(.*?)\s*Rs\.?\s*([\d,]+)(.*)$/i);
    if (rsMatch) {
      const cleanName = rsMatch[1].replace(/[—–-]\s*$/, '').trim() || 'Standard Plan';
      return {
        name: cleanName,
        price: rsMatch[2].trim()
      };
    }
    return { name: line, price: '' };
  });
}

function formatPlanRowsToTiersText(rows: PlanRowItem[]): string {
  return rows
    .filter((r) => r.name.trim() || r.price.trim())
    .map((r) => {
      const cleanName = r.name.trim() || 'Package';
      const cleanPrice = r.price.trim();
      if (!cleanPrice) return cleanName;
      const hasRs = /^rs\.?/i.test(cleanPrice);
      return `${cleanName} — ${hasRs ? cleanPrice : `Rs. ${cleanPrice}`}`;
    })
    .join('\n');
}

interface AdminStepByStepSettingsHubProps {
  siteConfig: SiteSettingsConfig;
  onUpdateSiteConfig: React.Dispatch<React.SetStateAction<SiteSettingsConfig>>;
  onSaveSiteConfigToCloud?: (configToSave?: SiteSettingsConfig, showFeedbackToast?: boolean) => Promise<boolean>;
  isSavingSiteConfig?: boolean;
  onResetSiteConfig: () => void;
  onReassignDeletedCategory?: (
    deletedCatId: CategoryId,
    fallbackCatId: Exclude<CategoryId, 'all'>
  ) => void;
  // Store Services Props
  servicesCatalog: StoreService[];
  editingServiceId: string | null;
  adminTitle: string;
  setAdminTitle: (v: string) => void;
  adminCategory: Exclude<CategoryId, 'all'>;
  setAdminCategory: (v: Exclude<CategoryId, 'all'>) => void;
  adminBadge: string;
  setAdminBadge: (v: string) => void;
  adminDesc: string;
  setAdminDesc: (v: string) => void;
  adminPlush: string;
  setAdminPlush: (v: string) => void;
  adminIconType: IconType;
  setAdminIconType: (v: IconType) => void;
  adminCustomIconUrl: string;
  setAdminCustomIconUrl: (v: string) => void;
  adminDirectToolUrl: string;
  setAdminDirectToolUrl: (v: string) => void;
  adminInputLabel: string;
  setAdminInputLabel: (v: string) => void;
  adminPlaceholder: string;
  setAdminPlaceholder: (v: string) => void;
  adminTiersText: string;
  setAdminTiersText: (v: string) => void;
  adminSearchFilter: string;
  setAdminSearchFilter: (v: string) => void;
  adminFilteredCatalog: StoreService[];
  handleSaveAdminService: (e: React.FormEvent) => void;
  startEditService: (srv: StoreService) => void;
  deleteService: (id: string, title: string) => void;
  toggleServiceHidden?: (id: string) => void;
  setAllServicesHidden?: (hidden: boolean, categoryFilter?: CategoryId) => void;
  resetAdminForm: () => void;
  resetCatalogToDefault: () => void;
  // Web Tools Props
  webToolsCatalog: WebToolItem[];
  editingToolId: string | null;
  toolTitle: string;
  setToolTitle: (v: string) => void;
  toolUrl: string;
  setToolUrl: (v: string) => void;
  toolIconUrl: string;
  setToolIconUrl: (v: string) => void;
  toolDesc: string;
  setToolDesc: (v: string) => void;
  toolBadge: string;
  setToolBadge: (v: string) => void;
  toolButtonLabel: string;
  setToolButtonLabel: (v: string) => void;
  toolPlush: string;
  setToolPlush: (v: string) => void;
  toolIconType: IconType;
  setToolIconType: (v: IconType) => void;
  toolOpenMode: 'new_tab' | 'embed_modal' | 'sim_tab';
  setToolOpenMode: (v: 'new_tab' | 'embed_modal' | 'sim_tab') => void;
  toolSearchFilter: string;
  setToolSearchFilter: (v: string) => void;
  adminFilteredTools: WebToolItem[];
  handleSaveAdminTool: (e: React.FormEvent) => void;
  startEditTool: (tool: WebToolItem) => void;
  deleteTool: (id: string, title: string) => void;
  toggleToolHidden?: (id: string) => void;
  setAllToolsHidden?: (hidden: boolean) => void;
  resetToolForm: () => void;
  resetToolsToDefault: () => void;
  launchWebTool: (tool: WebToolItem) => void;
  // Payments & Wallet Props
  walletBalance: number;
  paymentProofs: PaymentProofRequest[];
  pendingProofsCount: number;
  handleApprovePaymentProof: (id: string) => void;
  handleRejectPaymentProof: (id: string) => void;
  handleDeletePaymentProof: (id: string) => void;
  handleSetCustomBalance: (newBal: number) => void;
  onPreviewScreenshot: (proof: PaymentProofRequest) => void;
  // Theme & Font Props
  websiteUiMode: WebsiteUiThemeMode;
  setWebsiteUiMode: (mode: WebsiteUiThemeMode) => void;
  websiteFontMode: WebsiteFontMode;
  setWebsiteFontMode: (font: WebsiteFontMode) => void;
  // Shared Utilities
  plushOptions: PlushOption[];
  soundEnabled: boolean;
  toggleSound: () => void;
  playPopSound: (freq?: number) => void;
  showToast: (msg: string) => void;
  copyText: (text: string, msg?: string) => void;
  exitSecretAdminPortal: () => void;
}

export const AdminStepByStepSettingsHub: React.FC<AdminStepByStepSettingsHubProps> = ({
  siteConfig,
  onUpdateSiteConfig,
  onSaveSiteConfigToCloud,
  isSavingSiteConfig = false,
  onResetSiteConfig,
  onReassignDeletedCategory,
  servicesCatalog,
  editingServiceId,
  adminTitle,
  setAdminTitle,
  adminCategory,
  setAdminCategory,
  adminBadge,
  setAdminBadge,
  adminDesc,
  setAdminDesc,
  adminPlush,
  setAdminPlush,
  adminIconType,
  setAdminIconType,
  adminCustomIconUrl,
  setAdminCustomIconUrl,
  adminDirectToolUrl,
  setAdminDirectToolUrl,
  adminInputLabel,
  setAdminInputLabel,
  adminPlaceholder,
  setAdminPlaceholder,
  adminTiersText,
  setAdminTiersText,
  adminSearchFilter,
  setAdminSearchFilter,
  adminFilteredCatalog,
  handleSaveAdminService,
  startEditService,
  deleteService,
  toggleServiceHidden,
  setAllServicesHidden,
  resetAdminForm,
  resetCatalogToDefault,
  webToolsCatalog,
  editingToolId,
  toolTitle,
  setToolTitle,
  toolUrl,
  setToolUrl,
  toolIconUrl,
  setToolIconUrl,
  toolDesc,
  setToolDesc,
  toolBadge,
  setToolBadge,
  toolButtonLabel,
  setToolButtonLabel,
  toolPlush,
  setToolPlush,
  toolIconType,
  setToolIconType,
  toolOpenMode,
  setToolOpenMode,
  toolSearchFilter,
  setToolSearchFilter,
  adminFilteredTools,
  handleSaveAdminTool,
  startEditTool,
  deleteTool,
  toggleToolHidden,
  setAllToolsHidden,
  resetToolForm,
  resetToolsToDefault,
  launchWebTool,
  walletBalance,
  paymentProofs,
  pendingProofsCount,
  handleApprovePaymentProof,
  handleRejectPaymentProof,
  handleDeletePaymentProof,
  handleSetCustomBalance,
  onPreviewScreenshot,
  websiteUiMode,
  setWebsiteUiMode,
  websiteFontMode,
  setWebsiteFontMode,
  plushOptions,
  soundEnabled,
  toggleSound,
  playPopSound,
  showToast,
  copyText,
  exitSecretAdminPortal
}) => {
  // Active Settings Screen ('home' shows WhatsApp/TikTok style grouped menu)
  const [activeScreen, setActiveScreen] = useState<AdminSettingsScreenId>('dashboard');
  const [securityStep, setSecurityStep] = useState<number>(1);

  // Sub-Admin RBAC Identity & Granular Permissions State
  const [currentAdminRole, setCurrentAdminRole] = useState<'superadmin' | 'subadmin' | 'admin'>('superadmin');
  const [currentAdminUser, setCurrentAdminUser] = useState<string>('saqib');
  const [adminPermissions, setAdminPermissions] = useState<{
    manage_services: boolean;
    manage_tools: boolean;
    manage_orders: boolean;
    manage_users: boolean;
    view_telemetry: boolean;
    manage_site_config: boolean;
    manage_admins?: boolean;
  }>({
    manage_services: true,
    manage_tools: true,
    manage_orders: true,
    manage_users: true,
    view_telemetry: true,
    manage_site_config: true,
    manage_admins: true,
  });

  useEffect(() => {
    async function loadAdminSession() {
      try {
        const storedToken = localStorage.getItem('saqib_admin_token');
        const headers: Record<string, string> = {};
        if (storedToken) headers['Authorization'] = `Bearer ${storedToken}`;
        const res = await fetch('/api/admin/auth', { headers });
        const data = await res.json();
        if (data.authenticated) {
          if (data.role) setCurrentAdminRole(data.role);
          if (data.username) setCurrentAdminUser(data.username);
          if (data.permissions) setAdminPermissions(data.permissions);
        }
      } catch {
        // Fallback default
      }
    }
    loadAdminSession();
  }, []);

  const isSuperadmin = currentAdminRole === 'superadmin' || currentAdminUser.toLowerCase() === 'saqib';
  const canManageServices = isSuperadmin || Boolean(adminPermissions.manage_services);
  const canManageTools = isSuperadmin || Boolean(adminPermissions.manage_tools);
  const canManageOrders = isSuperadmin || Boolean(adminPermissions.manage_orders);
  const canManageUsers = isSuperadmin || Boolean(adminPermissions.manage_users);
  const canViewTelemetry = isSuperadmin || Boolean(adminPermissions.view_telemetry);
  const canManageSiteConfig = isSuperadmin || Boolean(adminPermissions.manage_site_config);
  const canManageAdmins = isSuperadmin || Boolean(adminPermissions.manage_admins);

  const hasScreenPermission = (screen: AdminSettingsScreenId): boolean => {
    switch (screen) {
      case 'dashboard':
      case 'home':
        return true;
      case 'categories':
      case 'services':
        return canManageServices;
      case 'tools':
        return canManageTools;
      case 'payment_methods':
      case 'payments':
        return canManageOrders;
      case 'visibility':
      case 'banner':
      case 'promo_banners':
      case 'promo_popup':
      case 'store_bars':
      case 'contact_footer':
      case 'ui':
      case 'seo':
        return canManageSiteConfig;
      case 'security':
        return canManageAdmins;
      case 'reviews':
        return true;
      default:
        return true;
    }
  };

  const handleRestrictedAccess = (featureName: string) => {
    playPopSound(200);
    showToast(`🔒 Access Restricted: Aapke sub-admin account ko "${featureName}" manage karne ki permission nahi hai.`);
  };
  const [settingsSearchQuery, setSettingsSearchQuery] = useState<string>('');
  const [visibilitySubTab, setVisibilitySubTab] = useState<
    'sections' | 'products' | 'categories' | 'tools'
  >('sections');
  const [visibilitySearch, setVisibilitySearch] = useState<string>('');
  const [visibilityCatFilter, setVisibilityCatFilter] = useState<CategoryId>('all');

  const activeVisibility: SiteVisibilityConfig = {
    ...DEFAULT_SITE_VISIBILITY,
    ...(siteConfig.visibility || {})
  };

  const toggleSiteVisibilityKey = (key: keyof SiteVisibilityConfig, label: string) => {
    const nextVal = !activeVisibility[key];
    onUpdateSiteConfig((prev) => ({
      ...prev,
      visibility: {
        ...DEFAULT_SITE_VISIBILITY,
        ...(prev.visibility || {}),
        [key]: nextVal
      }
    }));
    showToast(nextVal ? `👁️ Shown: ${label}` : `🙈 Hidden: ${label}`);
  };

  const toggleCategoryHidden = (catId: CategoryId, shortLabel: string) => {
    if (catId === 'all') return;
    onUpdateSiteConfig((prev) => {
      const currentList =
        prev.categories && prev.categories.length > 0 ? prev.categories : CATEGORY_META;
      const target = currentList.find((c) => c.id === catId);
      const nextHidden = !target?.hidden;
      const nextList = currentList.map((c) =>
        c.id === catId ? { ...c, hidden: nextHidden } : c
      );
      showToast(
        nextHidden
          ? `🙈 Category "${shortLabel}" Hidden from Storefront!`
          : `👁️ Category "${shortLabel}" Shown on Storefront!`
      );
      return {
        ...prev,
        categories: nextList
      };
    });
  };

  const hiddenServicesCount = servicesCatalog.filter((s) => s.hidden).length;
  const hiddenToolsCount = webToolsCatalog.filter((t) => t.hidden).length;

  // Dynamic Categories List (always falls back cleanly to CATEGORY_META)
  const activeCategories: StoreCategoryMeta[] =
    siteConfig.categories && siteConfig.categories.length > 0
      ? siteConfig.categories
      : CATEGORY_META;
  const hiddenCategoriesCount = activeCategories.filter((c) => c.hidden).length;

  // Step-by-Step Category Wizard State
  const [catStep, setCatStep] = useState<1 | 2 | 3>(1);
  const [editingCatId, setEditingCatId] = useState<string | null>(null);
  const [catLabel, setCatLabel] = useState<string>('');
  const [catShortLabel, setCatShortLabel] = useState<string>('');
  const [catIconType, setCatIconType] = useState<IconType>('gamepad');
  const [catCustomIconUrl, setCatCustomIconUrl] = useState<string>('');
  const [catIconColor, setCatIconColor] = useState<string>('text-purple-600');
  const [iconPickerSearch, setIconPickerSearch] = useState<string>('');

  // Step-by-Step Wizard States
  const [productStep, setProductStep] = useState<1 | 2 | 3 | 4>(1);
  const [planBuilderMode, setPlanBuilderMode] = useState<'visual' | 'raw'>('visual');
  const [planRows, setPlanRows] = useState<PlanRowItem[]>(() =>
    parseTiersToPlanRows(adminTiersText)
  );

  const [toolStep, setToolStep] = useState<1 | 2 | 3 | 4>(1);
  const [bannerStep, setBannerStep] = useState<1 | 2 | 3 | 4>(1);
  const [storeBarsStep, setStoreBarsStep] = useState<1 | 2 | 3>(1);
  const [contactStep, setContactStep] = useState<1 | 2 | 3>(1);
  const [activePayMethodIdx, setActivePayMethodIdx] = useState<number>(0);
  const [payStep, setPayStep] = useState<1 | 2 | 3 | 4>(1);
  const [editingPromoBannerId, setEditingPromoBannerId] = useState<string | null>(null);
  const [promoBannerStep, setPromoBannerStep] = useState<1 | 2 | 3 | 4>(1);

  // Sync planRows whenever editingServiceId or adminTiersText changes externally
  useEffect(() => {
    setPlanRows(parseTiersToPlanRows(adminTiersText));
  }, [editingServiceId]);

  const syncPlanRowsToTiers = (nextRows: PlanRowItem[]) => {
    setPlanRows(nextRows);
    setAdminTiersText(formatPlanRowsToTiersText(nextRows));
  };

  const resetCategoryWizardForm = () => {
    setEditingCatId(null);
    setCatLabel('');
    setCatShortLabel('');
    setCatIconType('gamepad');
    setCatCustomIconUrl('');
    setCatIconColor('text-purple-600');
    setCatStep(1);
  };

  const startEditCategoryInWizard = (cat: StoreCategoryMeta) => {
    playPopSound(660);
    setEditingCatId(cat.id);
    setCatLabel(cat.label);
    setCatShortLabel(cat.shortLabel);
    setCatIconType(cat.iconType || 'layer-group');
    setCatCustomIconUrl(cat.customIconUrl || '');
    setCatIconColor(cat.iconColor || 'text-pink-500');
    setActiveScreen('categories');
    setCatStep(1);
    window.scrollTo({ top: 120, behavior: 'smooth' });
  };

  const handleSaveCategory = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanFull = catLabel.trim();
    const cleanShort = catShortLabel.trim() || cleanFull;
    if (!cleanFull) {
      showToast('Please enter a Category Name!');
      return;
    }

    if (editingCatId) {
      onUpdateSiteConfig((prev) => {
        const currentList =
          prev.categories && prev.categories.length > 0 ? prev.categories : CATEGORY_META;
        return {
          ...prev,
          categories: currentList.map((c) =>
            c.id === editingCatId
              ? {
                  ...c,
                  label: cleanFull,
                  shortLabel: cleanShort,
                  iconColor: catIconColor,
                  iconType: catIconType,
                  customIconUrl: catCustomIconUrl.trim() || undefined
                }
              : c
          )
        };
      });
      playPopSound(820);
      showToast(`✅ Category "${cleanShort}" Updated!`);
      resetCategoryWizardForm();
      return;
    }

    const baseSlug = cleanShort
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '_')
      .replace(/^_+|_+$/g, '')
      .slice(0, 24);
    const newId: CategoryId =
      !baseSlug || activeCategories.some((c) => c.id === baseSlug)
        ? `cat_${Date.now().toString(36)}`
        : baseSlug;

    const newCat: StoreCategoryMeta = {
      id: newId,
      label: cleanFull,
      shortLabel: cleanShort,
      iconClass: 'fa-solid fa-layer-group',
      iconColor: catIconColor,
      iconType: catIconType,
      customIconUrl: catCustomIconUrl.trim() || undefined
    };

    onUpdateSiteConfig((prev) => {
      const currentList =
        prev.categories && prev.categories.length > 0 ? prev.categories : CATEGORY_META;
      return {
        ...prev,
        categories: [...currentList, newCat]
      };
    });
    playPopSound(860);
    showToast(`🎉 New Category "${cleanShort}" Added to Storefront!`);
    resetCategoryWizardForm();
  };

  const handleDeleteCategory = (cat: StoreCategoryMeta) => {
    if (cat.id === 'all') {
      showToast('The "All Services" tab cannot be deleted, but you can edit its name & icon!');
      return;
    }
    const remainingNonAll = activeCategories.filter((c) => c.id !== 'all' && c.id !== cat.id);
    if (remainingNonAll.length === 0) {
      showToast('At least 1 store category must remain active!');
      return;
    }
    const fallbackCat = remainingNonAll[0].id as Exclude<CategoryId, 'all'>;
    onUpdateSiteConfig((prev) => {
      const currentList =
        prev.categories && prev.categories.length > 0 ? prev.categories : CATEGORY_META;
      return {
        ...prev,
        categories: currentList.filter((c) => c.id !== cat.id)
      };
    });
    if (onReassignDeletedCategory) {
      onReassignDeletedCategory(cat.id, fallbackCat);
    }
    if (adminCategory === cat.id) {
      setAdminCategory(fallbackCat);
    }
    if (editingCatId === cat.id) {
      resetCategoryWizardForm();
    }
    playPopSound(480);
    showToast(`🗑️ Category "${cat.shortLabel}" Deleted!`);
  };

  const handleMoveCategory = (index: number, direction: -1 | 1) => {
    const targetIdx = index + direction;
    if (targetIdx < 0 || targetIdx >= activeCategories.length) return;
    playPopSound(640);
    onUpdateSiteConfig((prev) => {
      const list = [
        ...(prev.categories && prev.categories.length > 0 ? prev.categories : CATEGORY_META)
      ];
      const temp = list[index];
      list[index] = list[targetIdx];
      list[targetIdx] = temp;
      return {
        ...prev,
        categories: list
      };
    });
  };

  // Reusable Visual Icon & Custom Image Upload Studio for Categories, Web Tools & Store Products
  const renderVisualIconStudio = (
    selectedIconType: IconType,
    onSelectIconType: (ic: IconType) => void,
    customIconUrlValue: string,
    onChangeCustomIconUrl: (url: string) => void,
    sourceLinkUrl?: string
  ) => {
    const filteredIcons = ICON_OPTIONS.filter((opt) => {
      const q = iconPickerSearch.trim().toLowerCase();
      if (!q) return true;
      return opt.label.toLowerCase().includes(q) || opt.value.toLowerCase().includes(q);
    });

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      playPopSound(780);
      showToast('⚡ Uploading icon directly to ImageKit CDN...');
      try {
        const res = await uploadImageToImageKit(
          file,
          '/saqib-hub/icons',
          `icon-${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`
        );
        if (res.success && res.url) {
          onChangeCustomIconUrl(res.url);
          showToast('✓ Icon saved & hosted on ImageKit CDN!');
          return;
        }
      } catch {
        // Fallback
      }

      // Offline fallback
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          onChangeCustomIconUrl(reader.result);
          showToast('🖼️ Custom Icon Loaded Locally!');
        }
      };
      reader.readAsDataURL(file);
    };

    const handleAutoFetchFavicon = () => {
      const rawUrl = (sourceLinkUrl || '').trim();
      if (!rawUrl || rawUrl === '#siminfo') {
        showToast('Enter a website URL first to auto-fetch its official logo!');
        return;
      }
      try {
        const normalized = /^https?:\/\//i.test(rawUrl) ? rawUrl : `https://${rawUrl}`;
        const parsed = new URL(normalized);
        const faviconUrl = `https://www.google.com/s2/favicons?sz=128&domain=${parsed.hostname}`;
        playPopSound(760);
        onChangeCustomIconUrl(faviconUrl);
        showToast(`✨ Official Logo Fetched from ${parsed.hostname}!`);
      } catch {
        showToast('Could not parse website domain for logo.');
      }
    };

    return (
      <div className="p-3.5 rounded-2xl bg-white/95 border-2 border-pink-200 space-y-3 shadow-xs">
        {/* Top Row: Live Selected Icon Orb + Upload & Auto-Logo Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-2.5 pb-2.5 border-b border-slate-200/80">
          <div className="flex items-center gap-2.5">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-pink-500 via-purple-600 to-indigo-700 text-white flex items-center justify-center shadow-md border-2 border-white overflow-hidden flex-shrink-0">
              {renderOrbVisual(selectedIconType, customIconUrlValue)}
            </div>
            <div>
              <div className="text-xs font-extrabold text-slate-900">
                {customIconUrlValue.trim()
                  ? '🖼️ Custom Image / Logo Active'
                  : `✨ 3D Vector Icon: ${selectedIconType.toUpperCase()}`}
              </div>
              <div className="text-[10px] font-semibold text-slate-600">
                Tap any 3D icon below, upload a PNG/SVG logo, or paste an image link
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            <label className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white text-[10px] sm:text-xs font-extrabold shadow-sm cursor-pointer flex items-center gap-1.5 transition">
              <FaImages className="w-3.5 h-3.5" />
              <span>Upload Icon</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>

            {sourceLinkUrl !== undefined && (
              <button
                type="button"
                onClick={handleAutoFetchFavicon}
                className="px-2.5 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 text-[10px] sm:text-xs font-extrabold cursor-pointer flex items-center gap-1"
              >
                <FaWandMagicSparkles className="w-3 h-3" />
                <span>Auto Logo from URL</span>
              </button>
            )}

            {customIconUrlValue.trim() && (
              <button
                type="button"
                onClick={() => {
                  playPopSound(520);
                  onChangeCustomIconUrl('');
                  showToast('Switched back to 3D Vector Icon!');
                }}
                className="px-2.5 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-[10px] font-extrabold cursor-pointer"
              >
                Use 3D Vector
              </button>
            )}
          </div>
        </div>

        {/* Search Bar for 50+ Vector Icons */}
        <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5">
          <FaMagnifyingGlass className="w-3.5 h-3.5 text-pink-500 flex-shrink-0" />
          <input
            type="text"
            value={iconPickerSearch}
            onChange={(e) => setIconPickerSearch(e.target.value)}
            placeholder="Search 50+ icons (e.g. TikTok, Gemini, ChatGPT, Canva, SIM, Gaming, Crown, Rocket)..."
            className="w-full bg-transparent border-none outline-none text-xs font-bold text-slate-900 placeholder:text-slate-400"
          />
          {iconPickerSearch && (
            <button
              type="button"
              onClick={() => setIconPickerSearch('')}
              className="text-[10px] font-extrabold text-rose-600 cursor-pointer"
            >
              Clear
            </button>
          )}
        </div>

        {/* Visual Clickable Grid of 50+ Real Brand & Utility Icons */}
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-1.5 max-h-52 overflow-y-auto pr-1">
          {filteredIcons.map((ic) => {
            const isSelected = selectedIconType === ic.value && !customIconUrlValue.trim();
            const cleanName = ic.label.replace(/^[^\w\s]+\s*/, '');
            return (
              <button
                key={ic.value}
                type="button"
                onClick={() => {
                  playPopSound(660);
                  onSelectIconType(ic.value);
                  if (customIconUrlValue.trim()) {
                    onChangeCustomIconUrl('');
                  }
                }}
                className={`p-2 rounded-xl border text-center flex flex-col items-center justify-center gap-1.5 transition cursor-pointer ${
                  isSelected
                    ? 'bg-gradient-to-br from-pink-500 to-purple-600 text-white border-pink-500 shadow-md scale-[1.02]'
                    : 'bg-slate-50/90 hover:bg-pink-50 text-slate-800 border-slate-200/80'
                }`}
              >
                <span
                  className={`w-8 h-8 rounded-xl flex items-center justify-center shadow-2xs ${
                    isSelected
                      ? 'bg-white/20 text-white'
                      : 'bg-gradient-to-br from-slate-800 to-indigo-950 text-white'
                  }`}
                >
                  {renderServiceIcon(ic.value, undefined, 'w-4 h-4 text-white')}
                </span>
                <span className="text-[10px] font-extrabold leading-tight line-clamp-1 w-full">
                  {cleanName}
                </span>
              </button>
            );
          })}
        </div>

        {/* Direct Custom Image URL Input */}
        <div className="pt-1">
          <label className="block text-[10px] font-extrabold uppercase text-slate-600 mb-1">
            Or Paste Custom Icon Image URL (PNG / SVG / WebP):
          </label>
          <input
            type="text"
            value={customIconUrlValue}
            onChange={(e) => onChangeCustomIconUrl(e.target.value)}
            placeholder="https://.../custom-icon.png (or click Upload Icon above)"
            className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 font-mono-code text-xs text-slate-900 focus:outline-none focus:border-pink-500"
          />
        </div>
      </div>
    );
  };

  const openSettingsScreen = (screen: AdminSettingsScreenId, initialStep?: number) => {
    if (!hasScreenPermission(screen)) {
      handleRestrictedAccess(screen);
      return;
    }
    playPopSound(660);
    setActiveScreen(screen);
    if (screen === 'categories' && initialStep) {
      setCatStep(initialStep as 1 | 2 | 3);
    }
    if (screen === 'services' && initialStep) {
      setProductStep(initialStep as 1 | 2 | 3 | 4);
    }
    if (screen === 'tools' && initialStep) {
      setToolStep(initialStep as 1 | 2 | 3 | 4);
    }
    if (screen === 'banner' && initialStep) {
      setBannerStep(initialStep as 1 | 2 | 3 | 4);
    }
    if (screen === 'store_bars' && initialStep) {
      setStoreBarsStep(initialStep as 1 | 2 | 3);
    }
    if (screen === 'contact_footer' && initialStep) {
      setContactStep(initialStep as 1 | 2 | 3);
    }
    if (screen === 'payment_methods' && initialStep) {
      setPayStep(initialStep as 1 | 2 | 3 | 4);
    }
    if (screen === 'promo_banners' && initialStep) {
      setPromoBannerStep(initialStep as 1 | 2 | 3 | 4);
    }
    if (screen === 'security' && initialStep) {
      setSecurityStep(initialStep);
    } else if (screen === 'security') {
      setSecurityStep(1);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleEditServiceInWizard = (srv: StoreService) => {
    if (!canManageServices) {
      handleRestrictedAccess('Add/Edit Products');
      return;
    }
    startEditService(srv);
    setPlanRows(parseTiersToPlanRows((srv.tiers || []).map(formatTierToString).join('\n')));
    setActiveScreen('services');
    setProductStep(1);
    window.scrollTo({ top: 140, behavior: 'smooth' });
  };

  const handleEditToolInWizard = (tool: WebToolItem) => {
    if (!canManageTools) {
      handleRestrictedAccess('Add/Edit Web Tools');
      return;
    }
    startEditTool(tool);
    setActiveScreen('tools');
    setToolStep(1);
    window.scrollTo({ top: 140, behavior: 'smooth' });
  };

  // Toggle helper for iOS / TikTok style switch
  const renderToggleSwitch = (
    checked: boolean,
    onToggle: () => void,
    label?: string
  ) => (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label || 'Toggle setting'}
      onClick={(e) => {
        e.stopPropagation();
        playPopSound(checked ? 520 : 720);
        onToggle();
      }}
      className={`relative inline-flex h-7 w-12 flex-shrink-0 cursor-pointer rounded-full border-2 transition-colors duration-200 ease-in-out focus:outline-none ${
        checked
          ? 'bg-emerald-500 border-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.45)]'
          : 'bg-slate-300 border-slate-300'
      }`}
    >
      <span
        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out mt-0.5 ${
          checked ? 'translate-x-5.5' : 'translate-x-0.5'
        }`}
      />
    </button>
  );

  const activeFontObj =
    STORE_FONT_PACKS.find((f) => f.id === websiteFontMode) || STORE_FONT_PACKS[0];

  const themeDisplayName =
    websiteUiMode === 'astro-neu'
      ? 'Astro-OS Slate'
      : websiteUiMode === 'pink-acrylic'
      ? 'Pink Acrylic 3D'
      : websiteUiMode === 'liquid-champagne'
      ? 'Liquid Gold'
      : websiteUiMode === 'pastel-jelly'
      ? 'Pastel Jelly 3D'
      : websiteUiMode === 'neo-gray-dark'
      ? 'Neo Gray Dark'
      : 'Neo Blue Dark';

  const matchesSearch = (keywords: string) => {
    const q = settingsSearchQuery.trim().toLowerCase();
    if (!q) return true;
    return keywords.toLowerCase().includes(q);
  };

  const updatePaymentMethodField = (
    index: number,
    field: keyof DepositMethodMeta,
    value: string | boolean
  ) => {
    onUpdateSiteConfig((prev) => {
      const nextMethods = prev.paymentMethods.map((m, idx) =>
        idx === index ? { ...m, [field]: value } : m
      );
      return {
        ...prev,
        paymentMethods: nextMethods
      };
    });
  };

  const handleAddPaymentMethod = (presetName = 'New Payment Method') => {
    const isNayapay = presetName.toLowerCase().includes('nayapay');
    const isMeezan =
      presetName.toLowerCase().includes('meezan') ||
      presetName.toLowerCase().includes('bank') ||
      presetName.toLowerCase().includes('hbl');
    const isCrypto =
      presetName.toLowerCase().includes('usdt') ||
      presetName.toLowerCase().includes('crypto') ||
      presetName.toLowerCase().includes('binance');

    const newMethod: DepositMethodMeta = {
      id: presetName,
      label: `${presetName} Account`,
      shortTag: isCrypto
        ? '💲 Crypto Top-Up'
        : isMeezan
        ? '🏦 0% Raast IBFT'
        : '⚡ Instant Auto-Verify',
      accountTitle: 'Muhammad Saqib',
      accountNumber: isCrypto ? 'TRC20: WhatsApp for UID' : '0347-8936242',
      extraInfo: isCrypto
        ? 'Send USDT via TRC20 and upload receipt screenshot'
        : 'Send payment and upload screenshot for instant verification',
      icon: isCrypto
        ? 'fa-brands fa-bitcoin'
        : isMeezan
        ? 'fa-solid fa-building-columns'
        : 'fa-solid fa-wallet',
      grad: isCrypto
        ? 'from-amber-500 to-yellow-600'
        : isNayapay
        ? 'from-orange-500 to-amber-600'
        : isMeezan
        ? 'from-teal-600 to-emerald-700'
        : 'from-blue-600 to-indigo-700',
      badgeBg: 'bg-emerald-100 text-emerald-800 border-emerald-300',
      enabled: true
    };
    onUpdateSiteConfig((prev) => ({
      ...prev,
      paymentMethods: [...prev.paymentMethods, newMethod]
    }));
    setActivePayMethodIdx(siteConfig.paymentMethods.length);
    showToast(`✅ Added ${presetName} gateway!`);
  };

  const handleDeletePaymentMethod = (index: number) => {
    if (siteConfig.paymentMethods.length <= 1) {
      showToast('⚠️ At least one payment method is required!');
      return;
    }
    const deletedName = siteConfig.paymentMethods[index]?.id || 'Method';
    onUpdateSiteConfig((prev) => ({
      ...prev,
      paymentMethods: prev.paymentMethods.filter((_, idx) => idx !== index)
    }));
    setActivePayMethodIdx((prev) => Math.max(0, prev - 1));
    showToast(`🗑️ Removed ${deletedName}`);
  };

  const updateStoreBarsField = (
    field: keyof SiteStoreBarsConfig,
    value: any
  ) => {
    onUpdateSiteConfig((prev) => ({
      ...prev,
      storeBars: {
        ...(prev.storeBars || DEFAULT_STORE_BARS_CONFIG),
        [field]: value
      }
    }));
  };

  const currentPromoBanners: SitePromoBannerItem[] =
    siteConfig.promoBanners && siteConfig.promoBanners.length > 0
      ? siteConfig.promoBanners
      : DEFAULT_PROMO_BANNERS;

  const PROMO_BANNER_PRESETS: Array<{
    name: string;
    label: string;
    desc: string;
    style: PromoBannerStyle;
    banner: Omit<SitePromoBannerItem, 'id'>;
  }> = [
    {
      name: 'deal',
      label: '⚡ Custom Deal / Reseller',
      desc: 'AI Credits, Agency Accounts, NADRA & USDT Wholesale',
      style: 'rose',
      banner: {
        enabled: true,
        badgeIcon: 'fa-solid fa-bolt',
        badgeText: 'ALL SERVICES AVAILABLE HERE',
        title: 'Need Custom AI Credits, Ad Agency Accounts, NADRA/CDR Info, or USDT?',
        description:
          'Message Muhammad Saqib directly on WhatsApp (+92 347 8936242) for wholesale reseller rates, JazzCash / EasyPaisa payment, and instant delivery.',
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
    },
    {
      name: 'usdt',
      label: '💰 Crypto & USDT / Binance Pay',
      desc: 'Instant PKR to USDT / Binance Pay conversion & deals',
      style: 'amber',
      banner: {
        enabled: true,
        badgeIcon: 'fa-solid fa-coins',
        badgeText: 'CRYPTO & USDT DESK ACTIVE',
        title: 'Looking for USDT TRC20, Binance Pay, or Crypto Top-Up in Pakistan?',
        description:
          'Get instant live rate conversion via EasyPaisa & JazzCash. 100% verified, fast delivery within 5 minutes directly to your wallet.',
        style: 'amber',
        position: 'below_services',
        primaryBtnEnabled: true,
        primaryBtnText: 'Trade USDT on WhatsApp',
        primaryBtnAction: 'whatsapp',
        primaryBtnIcon: 'fa-brands fa-whatsapp',
        secondaryBtnEnabled: true,
        secondaryBtnText: 'Add Funds via Binance',
        secondaryBtnAction: 'addfunds',
        secondaryBtnIcon: 'fa-solid fa-wallet'
      }
    },
    {
      name: 'nadra',
      label: '🛡️ SIM & NADRA Live Records Desk',
      desc: 'Call CDR, Family Tree, FRC & Location Tracker',
      style: 'dark',
      banner: {
        enabled: true,
        badgeIcon: 'fa-solid fa-shield-halved',
        badgeText: 'OFFICIAL FRANCHISE VERIFIED DESK',
        title: 'Need Instant SIM Ownership, Live Call CDR, or NADRA FRC Verification?',
        description:
          'Direct franchise server access with verified PDF reports sent straight to your WhatsApp in 15 minutes. 100% confidential & authentic.',
        style: 'dark',
        position: 'below_services',
        primaryBtnEnabled: true,
        primaryBtnText: 'Request NADRA / SIM PDF',
        primaryBtnAction: 'whatsapp',
        primaryBtnIcon: 'fa-brands fa-whatsapp',
        secondaryBtnEnabled: true,
        secondaryBtnText: 'Launch Live Web Tools',
        secondaryBtnAction: 'webtools',
        secondaryBtnIcon: 'fa-solid fa-screwdriver-wrench'
      }
    },
    {
      name: 'tiktok',
      label: '🚀 TikTok UK/USA Agency Accounts',
      desc: 'Tax-free, Beta Program & Worldwide Ads targeting',
      style: 'cyan',
      banner: {
        enabled: true,
        badgeIcon: 'fa-solid fa-fire',
        badgeText: 'VIRAL MONETIZATION & ADS READY',
        title: 'Scale Globally with TikTok UK / USA Agency Accounts & Ads Credit',
        description:
          'Instant login delivery with 0% Tax, Worldwide targeting & Creativity Program Beta enabled. Wholesale discounts on bulk orders.',
        style: 'cyan',
        position: 'above_services',
        primaryBtnEnabled: true,
        primaryBtnText: 'Order Agency Account',
        primaryBtnAction: 'whatsapp',
        primaryBtnIcon: 'fa-brands fa-whatsapp',
        secondaryBtnEnabled: true,
        secondaryBtnText: 'Top-Up Store Balance',
        secondaryBtnAction: 'addfunds',
        secondaryBtnIcon: 'fa-solid fa-wallet'
      }
    },
    {
      name: 'support',
      label: '💬 24/7 VIP WhatsApp Priority Support',
      desc: 'Direct hotline for urgent orders, replacements & custom plans',
      style: 'emerald',
      banner: {
        enabled: true,
        badgeIcon: 'fa-brands fa-whatsapp',
        badgeText: '24/7 ONLINE • AVERAGE 2 MIN REPLY',
        title: 'Have a Special Request, Need Fast Replacement, or Custom AI Plan?',
        description:
          'Muhammad Saqib is online right now! Message directly for custom enterprise bundles, special bulk pricing, or instant assistance.',
        style: 'emerald',
        position: 'below_services',
        primaryBtnEnabled: true,
        primaryBtnText: 'Chat on WhatsApp',
        primaryBtnAction: 'whatsapp',
        primaryBtnIcon: 'fa-brands fa-whatsapp',
        secondaryBtnEnabled: false,
        secondaryBtnText: 'Open Web Tools',
        secondaryBtnAction: 'webtools'
      }
    },
    {
      name: 'aipro',
      label: '🔮 AI Mega Bundle & CapCut Pro',
      desc: 'Gemini 18M, Claude 3.7, Lovable Pro & ElevenLabs',
      style: 'purple',
      banner: {
        enabled: true,
        badgeIcon: 'fa-solid fa-wand-magic-sparkles',
        badgeText: 'EXCLUSIVE CREATOR AI PRO SUITE',
        title: 'Unlock Full Power: Gemini 18M, Claude 3.7, Lovable Pro & CapCut Pro',
        description:
          'Private 1-month & 1-year subscriptions with warranty. No VPN required, works on all devices with instant activation.',
        style: 'purple',
        position: 'above_services',
        primaryBtnEnabled: true,
        primaryBtnText: 'Get AI Pro Bundle',
        primaryBtnAction: 'whatsapp',
        primaryBtnIcon: 'fa-brands fa-whatsapp',
        secondaryBtnEnabled: true,
        secondaryBtnText: 'Add Balance to Wallet',
        secondaryBtnAction: 'addfunds',
        secondaryBtnIcon: 'fa-solid fa-wallet'
      }
    }
  ];

  const handleAddPromoBanner = (presetName?: string) => {
    const foundPreset = PROMO_BANNER_PRESETS.find((p) => p.name === presetName);
    const newBanner: SitePromoBannerItem = foundPreset
      ? { ...foundPreset.banner, id: `promo-${Date.now()}` }
      : {
          id: `promo-${Date.now()}`,
          enabled: true,
          badgeIcon: 'fa-solid fa-bolt',
          badgeText: 'NEW PROMOTIONAL DEAL',
          title: 'Special Custom Offer & Exclusive Wholesale Deals',
          description:
            'Message Muhammad Saqib directly on WhatsApp (+92 347 8936242) for wholesale reseller rates, instant activation, and replacement warranty.',
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
        };

    onUpdateSiteConfig((prev) => ({
      ...prev,
      promoBanners: [...(prev.promoBanners || DEFAULT_PROMO_BANNERS), newBanner]
    }));
    setEditingPromoBannerId(newBanner.id);
    setPromoBannerStep(1);
    playPopSound(720);
    showToast('✨ New Promo Banner Added! Customize Title, Style & Buttons below.');
  };

  const handleDeletePromoBanner = (id: string) => {
    if (currentPromoBanners.length <= 1) {
      showToast('⚠️ At least one banner must remain. You can toggle it OFF (Hide) instead!');
      return;
    }
    onUpdateSiteConfig((prev) => ({
      ...prev,
      promoBanners: (prev.promoBanners || DEFAULT_PROMO_BANNERS).filter((b) => b.id !== id)
    }));
    if (editingPromoBannerId === id) {
      setEditingPromoBannerId(null);
    }
    playPopSound(420);
    showToast('🗑️ Promo Banner Deleted successfully!');
  };

  const handleTogglePromoBanner = (id: string) => {
    onUpdateSiteConfig((prev) => {
      const list = prev.promoBanners || DEFAULT_PROMO_BANNERS;
      const target = list.find((b) => b.id === id);
      const nextEnabled = target ? target.enabled === false : false;
      const updated = list.map((b) => (b.id === id ? { ...b, enabled: nextEnabled } : b));
      showToast(
        nextEnabled
          ? '👁️ Banner Enabled on Storefront!'
          : '🙈 Banner Hidden from Storefront!'
      );
      return {
        ...prev,
        promoBanners: updated
      };
    });
  };

  const handleDuplicatePromoBanner = (id: string) => {
    const list = siteConfig.promoBanners || DEFAULT_PROMO_BANNERS;
    const target = list.find((b) => b.id === id);
    if (!target) return;
    const duplicated: SitePromoBannerItem = {
      ...target,
      id: `promo-${Date.now()}`,
      title: `${target.title} (Copy)`
    };
    onUpdateSiteConfig((prev) => ({
      ...prev,
      promoBanners: [...(prev.promoBanners || DEFAULT_PROMO_BANNERS), duplicated]
    }));
    setEditingPromoBannerId(duplicated.id);
    playPopSound(760);
    showToast('📋 Banner Duplicated! Now editing the copy.');
  };

  const handleMovePromoBanner = (id: string, direction: 'up' | 'down') => {
    const list = [...(siteConfig.promoBanners || DEFAULT_PROMO_BANNERS)];
    const idx = list.findIndex((b) => b.id === id);
    if (idx === -1) return;
    if (direction === 'up' && idx > 0) {
      const temp = list[idx - 1];
      list[idx - 1] = list[idx];
      list[idx] = temp;
      onUpdateSiteConfig((prev) => ({ ...prev, promoBanners: list }));
      playPopSound(600);
      showToast('⬆️ Banner moved up!');
    } else if (direction === 'down' && idx < list.length - 1) {
      const temp = list[idx + 1];
      list[idx + 1] = list[idx];
      list[idx] = temp;
      onUpdateSiteConfig((prev) => ({ ...prev, promoBanners: list }));
      playPopSound(600);
      showToast('⬇️ Banner moved down!');
    }
  };

  const handleUpdatePromoBannerField = <K extends keyof SitePromoBannerItem>(
    id: string,
    field: K,
    value: SitePromoBannerItem[K]
  ) => {
    onUpdateSiteConfig((prev) => {
      const list = prev.promoBanners || DEFAULT_PROMO_BANNERS;
      return {
        ...prev,
        promoBanners: list.map((b) => (b.id === id ? { ...b, [field]: value } : b))
      };
    });
  };

  return (
    <div className="space-y-5 transition-all duration-300">
      {/* ==================== TOP WHATSAPP / TIKTOK ADMIN COMMAND HEADER ==================== */}
      <div className="acrylic-frame rounded-[32px] p-2.5 sm:p-3.5">
        <div className="rounded-[24px] bg-gradient-to-r from-slate-950 via-indigo-950 to-purple-950 text-white p-4 sm:p-6 border border-white/80 shadow-2xl space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-2xl overflow-hidden border-2 border-emerald-400 shadow-lg flex-shrink-0 bg-slate-900">
                <img
                  src={siteConfig.banner.portraitUrl}
                  alt="Sohaib Admin"
                  className="w-full h-full object-cover"
                />
                <span className="absolute bottom-1 right-1 w-3 h-3 rounded-full bg-emerald-400 border-2 border-slate-950"></span>
              </div>
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-[10px] font-mono-code font-extrabold">
                  <FaShieldHalved className="w-3 h-3 text-emerald-400" />
                  <span>ADMIN SETTINGS STUDIO • /saqibadmb</span>
                </div>
                <h2 className="text-lg sm:text-2xl font-extrabold text-white mt-0.5 tracking-tight">
                  {siteConfig.banner.mainTitle} — Step-by-Step Settings
                </h2>
                <p className="text-[11px] sm:text-xs text-pink-200 font-semibold">
                  WhatsApp &amp; TikTok Style Control Center • Tap any setting to edit step by step
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-2 w-full sm:w-auto">
              {activeScreen !== 'home' && (
                <button
                  type="button"
                  onClick={() => openSettingsScreen('home')}
                  className="col-span-2 sm:col-span-1 px-3.5 py-2 rounded-xl bg-sky-400 hover:bg-sky-300 text-slate-950 font-extrabold text-xs shadow-md flex items-center justify-center gap-1.5 cursor-pointer transition w-full sm:w-auto"
                >
                  <FaArrowLeft className="w-3.5 h-3.5" />
                  <span>All Settings Menu</span>
                </button>
              )}

              {/* ADMIN-ONLY 1-TAP SOFT LIGHT RGB BORDER ON/OFF BUTTON */}
              <button
                type="button"
                onClick={() => {
                  const next = siteConfig.banner.rgbBorderEnabled === false;
                  playPopSound(next ? 740 : 500);
                  onUpdateSiteConfig((prev) => ({
                    ...prev,
                    banner: { ...prev.banner, rgbBorderEnabled: next }
                  }));
                  showToast(
                    next
                      ? '🌈 Soft Light RGB Borders Turned ON for Storefront!'
                      : '⚪ Soft Light RGB Borders Turned OFF for Storefront!'
                  );
                }}
                title="Admin Control: Turn Soft Light RGB Borders ON or OFF across the entire website"
                className={`px-3.5 py-2 rounded-xl text-xs font-extrabold cursor-pointer flex items-center justify-center gap-2 transition shadow-md w-full sm:w-auto ${
                  siteConfig.banner.rgbBorderEnabled !== false
                    ? 'rgb-pill-active text-slate-900'
                    : 'bg-white/15 hover:bg-white/25 text-slate-200 border border-white/25'
                }`}
              >
                <span
                  className={`w-2.5 h-2.5 rounded-full ${
                    siteConfig.banner.rgbBorderEnabled !== false
                      ? 'bg-gradient-to-r from-sky-400 via-pink-500 to-emerald-400 animate-spin'
                      : 'bg-slate-400'
                  }`}
                ></span>
                <span>
                  RGB Light: {siteConfig.banner.rgbBorderEnabled !== false ? 'ON' : 'OFF'}
                </span>
              </button>

              <button
                type="button"
                onClick={() =>
                  copyText(
                    JSON.stringify(
                      {
                        siteConfig,
                        services: servicesCatalog,
                        tools: webToolsCatalog
                      },
                      null,
                      2
                    ),
                    'Full Website Backup JSON Copied!'
                  )
                }
                className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs font-extrabold cursor-pointer flex items-center justify-center gap-1.5 w-full sm:w-auto"
              >
                <FaCopy className="w-3 h-3 text-sky-300" />
                <span>Backup JSON</span>
              </button>
              <button
                type="button"
                onClick={async () => {
                  playPopSound(840);
                  if (onSaveSiteConfigToCloud) {
                    await onSaveSiteConfigToCloud(siteConfig, true);
                  }
                }}
                disabled={isSavingSiteConfig}
                title="Save all configuration to Supabase Cloud Database"
                className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white text-xs font-extrabold shadow-md hover:scale-105 transition cursor-pointer flex items-center justify-center gap-1.5 w-full sm:w-auto border border-blue-400/40"
              >
                {isSavingSiteConfig ? (
                  <>
                    <i className="fa-solid fa-spinner animate-spin"></i>
                    <span>Saving to DB...</span>
                  </>
                ) : (
                  <>
                    <i className="fa-solid fa-cloud-arrow-up text-amber-300"></i>
                    <span>Save to Cloud DB</span>
                  </>
                )}
              </button>
              <AdminNotificationBell
                onNavigateScreen={openSettingsScreen}
                playPopSound={playPopSound}
                showToast={showToast}
              />
              <button
                type="button"
                onClick={exitSecretAdminPortal}
                className={`px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-xs font-extrabold shadow-md cursor-pointer flex items-center justify-center gap-1.5 w-full sm:w-auto ${
                  activeScreen === 'home' ? 'col-span-2 sm:col-span-1' : ''
                }`}
              >
                <FaEye className="w-3.5 h-3.5" />
                <span>View Live Store</span>
              </button>
            </div>
          </div>

          {/* Quick Pill Navigation Strip (Always accessible like TikTok top tabs) */}
          <div className="flex items-center gap-1.5 overflow-x-auto pt-2 border-t border-white/15 scrollbar-none pr-8 overscroll-x-contain pb-1">
            {[
              { id: 'dashboard' as const, label: '📊 System Dashboard', badge: 'Live Radar' },
              { id: 'reviews' as const, label: '⭐ Reviews Moderation', badge: 'Live' },
              { id: 'home' as const, label: '⚙️ Settings Menu', badge: 'Home' },
              {
                id: 'visibility' as const,
                label: '👁️ Hide / Show Anything',
                badge:
                  hiddenServicesCount + hiddenToolsCount + hiddenCategoriesCount > 0
                    ? `${hiddenServicesCount + hiddenToolsCount + hiddenCategoriesCount} Hidden`
                    : 'All Live'
              },
              {
                id: 'categories' as const,
                label: '🗂️ Categories & Icons',
                badge: String(activeCategories.length)
              },
              {
                id: 'services' as const,
                label: '🛍️ Add / Edit Products',
                badge: String(servicesCatalog.length)
              },
              {
                id: 'tools' as const,
                label: '🛠️ Add / Edit Web Tools',
                badge: String(webToolsCatalog.length)
              },
              {
                id: 'banner' as const,
                label: '🖼️ Hero Banner (1 no)',
                badge: siteConfig.banner.showHeroBanner ? 'ON' : 'OFF'
              },
              {
                id: 'promo_banners' as const,
                label: '🎯 2 No Promo Banners',
                badge: `${currentPromoBanners.filter((b) => b.enabled !== false).length} Active`
              },
              {
                id: 'store_bars' as const,
                label: '🏪 Store Bars & Wallet',
                badge: 'Live'
              },
              {
                id: 'payment_methods' as const,
                label: '🏦 Payment Numbers',
                badge: String(siteConfig.paymentMethods.filter((m) => m.enabled !== false).length)
              },
              {
                id: 'contact_footer' as const,
                label: '📱 WhatsApp & Footer',
                badge: 'Links'
              },
              {
                id: 'payments' as const,
                label: '💳 Payment Proofs',
                badge: `${pendingProofsCount} New`
              },
              {
                id: 'ui' as const,
                label: '🎨 Themes & Fonts',
                badge: '6+6'
              },
              {
                id: 'seo' as const,
                label: '🌐 SEO & Meta Tags',
                badge: 'Google'
              },
              {
                id: 'security' as const,
                label: '🔐 Security & Sub-Admins',
                badge: 'RBAC Team'
              }
            ].map((item) => {
              const isAct = activeScreen === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => openSettingsScreen(item.id)}
                  className={`px-3 py-1.5 rounded-xl text-[11px] font-extrabold whitespace-nowrap transition flex items-center gap-1.5 cursor-pointer ${
                    isAct
                      ? 'bg-sky-400 text-slate-950 shadow-md scale-[1.02]'
                      : 'bg-white/10 hover:bg-white/20 text-white border border-white/15'
                  }`}
                >
                  <span>{item.label}</span>
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[9px] font-extrabold ${
                      isAct ? 'bg-slate-950 text-sky-300' : 'bg-black/30 text-sky-200'
                    }`}
                  >
                    {item.badge}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ==================== SCREEN -1: MASTER ANALYTICS & 26-FEATURE DASHBOARD ==================== */}
      {activeScreen === 'dashboard' && (
        <AdminAnalyticsDashboard
          siteConfig={siteConfig}
          onUpdateSiteConfig={onUpdateSiteConfig}
          servicesCatalog={servicesCatalog}
          webToolsCatalog={webToolsCatalog}
          paymentProofs={paymentProofs}
          walletBalance={walletBalance}
          websiteUiMode={websiteUiMode}
          websiteFontMode={websiteFontMode}
          onOpenScreen={openSettingsScreen}
          toggleServiceHidden={toggleServiceHidden}
          toggleToolHidden={toggleToolHidden}
          toggleCategoryHidden={toggleCategoryHidden}
          showToast={showToast}
          playPopSound={playPopSound}
          copyText={copyText}
          exitSecretAdminPortal={exitSecretAdminPortal}
        />
      )}

      {/* ==================== SCREEN 0: WHATSAPP & TIKTOK STYLE SETTINGS HOME MENU ==================== */}
      {activeScreen === 'home' && (
        <div className="space-y-5">
          {/* Quick Jump to Dashboard Pill */}
          <div
            onClick={() => openSettingsScreen('dashboard')}
            className="rounded-2xl p-3.5 bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-900 border border-indigo-400/50 text-white flex items-center justify-between gap-3 cursor-pointer shadow-md hover:scale-[1.01] transition"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="w-8 h-8 rounded-xl bg-indigo-500/30 text-sky-300 flex items-center justify-center font-bold text-sm">
                📊
              </span>
              <div className="min-w-0">
                <div className="text-xs sm:text-sm font-extrabold truncate">
                  Open Master System Dashboard &amp; 26-Feature Audit
                </div>
                <div className="text-[10px] text-sky-200 truncate">
                  View real-time functions ON/OFF, products breakdown, web tools &amp; verified sales volume
                </div>
              </div>
            </div>
            <span className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-extrabold flex items-center gap-1.5 whitespace-nowrap shadow-sm">
              <span>View Dashboard</span>
              <FaArrowRight className="w-3 h-3" />
            </span>
          </div>

          {/* Search Bar + 4 Quick Wizard Launch Tiles */}
          <div className="acrylic-frame rounded-[30px] p-3 sm:p-4 space-y-3.5">
            <div className="sim-input-box !py-2.5 !px-4 !rounded-2xl">
              <FaMagnifyingGlass className="text-pink-500 mr-2.5 w-4 h-4 flex-shrink-0" />
              <input
                type="text"
                value={settingsSearchQuery}
                onChange={(e) => setSettingsSearchQuery(e.target.value)}
                placeholder="Search settings (e.g. Add Product, Price, Banner, WhatsApp Number, JazzCash, Footer, Font)..."
                className="w-full bg-transparent border-none outline-none font-bold text-xs sm:text-sm text-slate-900 placeholder:text-slate-400"
              />
              {settingsSearchQuery && (
                <button
                  type="button"
                  onClick={() => setSettingsSearchQuery('')}
                  className="text-xs font-extrabold text-rose-600 px-2 cursor-pointer"
                >
                  Clear
                </button>
              )}
            </div>

            {/* 8 Step-by-Step Quick Action Cards with Sub-Admin RBAC Locks */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
              {/* Card 1: Hide / Show Anything */}
              <button
                type="button"
                onClick={() => {
                  if (!canManageSiteConfig) {
                    handleRestrictedAccess('Hide / Show Anything');
                    return;
                  }
                  openSettingsScreen('visibility');
                }}
                className={`p-3.5 rounded-2xl bg-gradient-to-br from-slate-900 via-indigo-950 to-purple-900 text-white text-left shadow-md hover:scale-[1.01] transition flex flex-col justify-between gap-2 border border-sky-400/40 relative ${
                  !canManageSiteConfig ? 'opacity-65 cursor-not-allowed !border-rose-500/50' : 'cursor-pointer'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`w-9 h-9 rounded-xl flex items-center justify-center ${!canManageSiteConfig ? 'bg-rose-500/20 text-rose-400' : 'bg-sky-400/20 text-sky-300'}`}>
                    {!canManageSiteConfig ? <FaLock className="w-4 h-4 text-rose-400" /> : <FaEyeSlash className="w-4 h-4 text-sky-300" />}
                  </span>
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase flex items-center gap-1 ${
                    !canManageSiteConfig ? 'bg-rose-500 text-white shadow-sm' : 'bg-sky-400/25 text-sky-200'
                  }`}>
                    {!canManageSiteConfig ? <>🔒 LOCKED</> : '1-Tap Hide'}
                  </span>
                </div>
                <div>
                  <div className="text-xs sm:text-sm font-extrabold flex items-center gap-1.5">
                    <span>Hide / Show Anything</span>
                    {!canManageSiteConfig && <FaLock className="text-[10px] text-rose-400" />}
                  </div>
                  <div className={`text-[10px] font-semibold ${!canManageSiteConfig ? 'text-rose-300 font-bold' : 'text-sky-200'}`}>
                    {!canManageSiteConfig ? '🔒 Restricted by Superadmin' : 'Services, Sections, Tabs & Tools'}
                  </div>
                </div>
              </button>

              {/* Card 2: Add / Edit Category */}
              <button
                type="button"
                onClick={() => {
                  if (!canManageServices) {
                    handleRestrictedAccess('Category Management');
                    return;
                  }
                  resetCategoryWizardForm();
                  openSettingsScreen('categories', 1);
                }}
                className={`p-3.5 rounded-2xl bg-gradient-to-br from-purple-600 via-fuchsia-600 to-pink-600 text-white text-left shadow-md hover:scale-[1.01] transition flex flex-col justify-between gap-2 relative ${
                  !canManageServices ? 'opacity-65 cursor-not-allowed !border-rose-500/50' : 'cursor-pointer'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`w-9 h-9 rounded-xl flex items-center justify-center ${!canManageServices ? 'bg-rose-500/20 text-rose-400' : 'bg-white/20 text-white'}`}>
                    {!canManageServices ? <FaLock className="w-4 h-4 text-rose-400" /> : <FaLayerGroup className="w-4 h-4 text-white" />}
                  </span>
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase flex items-center gap-1 ${
                    !canManageServices ? 'bg-rose-500 text-white shadow-sm' : 'bg-white/25 text-white'
                  }`}>
                    {!canManageServices ? <>🔒 LOCKED</> : `${activeCategories.length} Tabs`}
                  </span>
                </div>
                <div>
                  <div className="text-xs sm:text-sm font-extrabold flex items-center gap-1.5">
                    <span>+ Add / Edit Category</span>
                    {!canManageServices && <FaLock className="text-[10px] text-rose-300" />}
                  </div>
                  <div className={`text-[10px] font-semibold ${!canManageServices ? 'text-rose-200 font-bold' : 'text-pink-100'}`}>
                    {!canManageServices ? '🔒 Restricted by Superadmin' : 'Create, Hide & Custom Icons'}
                  </div>
                </div>
              </button>

              {/* Card 3: Add New Product */}
              <button
                type="button"
                onClick={() => {
                  if (!canManageServices) {
                    handleRestrictedAccess('Product Management');
                    return;
                  }
                  resetAdminForm();
                  openSettingsScreen('services', 1);
                }}
                className={`p-3.5 rounded-2xl bg-gradient-to-br from-pink-500 via-rose-500 to-purple-600 text-white text-left shadow-md hover:scale-[1.01] transition flex flex-col justify-between gap-2 relative ${
                  !canManageServices ? 'opacity-65 cursor-not-allowed !border-rose-500/50' : 'cursor-pointer'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`w-9 h-9 rounded-xl flex items-center justify-center ${!canManageServices ? 'bg-rose-500/20 text-rose-400' : 'bg-white/20 text-white'}`}>
                    {!canManageServices ? <FaLock className="w-4 h-4 text-rose-400" /> : <FaBagShopping className="w-4 h-4 text-white" />}
                  </span>
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase flex items-center gap-1 ${
                    !canManageServices ? 'bg-rose-500 text-white shadow-sm' : 'bg-white/25 text-white'
                  }`}>
                    {!canManageServices ? <>🔒 LOCKED</> : '4 Steps'}
                  </span>
                </div>
                <div>
                  <div className="text-xs sm:text-sm font-extrabold flex items-center gap-1.5">
                    <span>+ Add New Product</span>
                    {!canManageServices && <FaLock className="text-[10px] text-rose-300" />}
                  </div>
                  <div className={`text-[10px] font-semibold ${!canManageServices ? 'text-rose-200 font-bold' : 'text-pink-100'}`}>
                    {!canManageServices ? '🔒 Restricted by Superadmin' : 'Title, Plans, Prices & Icon'}
                  </div>
                </div>
              </button>

              {/* Card 4: Add Web Tool */}
              <button
                type="button"
                onClick={() => {
                  if (!canManageTools) {
                    handleRestrictedAccess('Web Tools Deck');
                    return;
                  }
                  resetToolForm();
                  openSettingsScreen('tools', 1);
                }}
                className={`p-3.5 rounded-2xl bg-gradient-to-br from-indigo-600 via-blue-600 to-cyan-600 text-white text-left shadow-md hover:scale-[1.01] transition flex flex-col justify-between gap-2 relative ${
                  !canManageTools ? 'opacity-65 cursor-not-allowed !border-rose-500/50' : 'cursor-pointer'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`w-9 h-9 rounded-xl flex items-center justify-center ${!canManageTools ? 'bg-rose-500/20 text-rose-400' : 'bg-white/20 text-white'}`}>
                    {!canManageTools ? <FaLock className="w-4 h-4 text-rose-400" /> : <FaScrewdriverWrench className="w-4 h-4 text-white" />}
                  </span>
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase flex items-center gap-1 ${
                    !canManageTools ? 'bg-rose-500 text-white shadow-sm' : 'bg-white/25 text-white'
                  }`}>
                    {!canManageTools ? <>🔒 LOCKED</> : '4 Steps'}
                  </span>
                </div>
                <div>
                  <div className="text-xs sm:text-sm font-extrabold flex items-center gap-1.5">
                    <span>+ Add Web Tool</span>
                    {!canManageTools && <FaLock className="text-[10px] text-rose-300" />}
                  </div>
                  <div className={`text-[10px] font-semibold ${!canManageTools ? 'text-rose-200 font-bold' : 'text-sky-100'}`}>
                    {!canManageTools ? '🔒 Restricted by Superadmin' : 'Link, Icon, Badge & Mode'}
                  </div>
                </div>
              </button>

              {/* Card 5: Payment Methods */}
              <button
                type="button"
                onClick={() => {
                  if (!canManageOrders) {
                    handleRestrictedAccess('Payment Methods');
                    return;
                  }
                  openSettingsScreen('payment_methods');
                }}
                className={`p-3.5 rounded-2xl bg-gradient-to-br from-emerald-500 via-teal-500 to-green-600 text-white text-left shadow-md hover:scale-[1.01] transition flex flex-col justify-between gap-2 relative ${
                  !canManageOrders ? 'opacity-65 cursor-not-allowed !border-rose-500/50' : 'cursor-pointer'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`w-9 h-9 rounded-xl flex items-center justify-center ${!canManageOrders ? 'bg-rose-500/20 text-rose-400' : 'bg-white/20 text-white'}`}>
                    {!canManageOrders ? <FaLock className="w-4 h-4 text-rose-400" /> : <FaBuildingColumns className="w-4 h-4 text-white" />}
                  </span>
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase flex items-center gap-1 ${
                    !canManageOrders ? 'bg-rose-500 text-white shadow-sm' : 'bg-white/25 text-white'
                  }`}>
                    {!canManageOrders ? <>🔒 LOCKED</> : 'Accounts'}
                  </span>
                </div>
                <div>
                  <div className="text-xs sm:text-sm font-extrabold flex items-center gap-1.5">
                    <span>Payment Methods</span>
                    {!canManageOrders && <FaLock className="text-[10px] text-rose-300" />}
                  </div>
                  <div className={`text-[10px] font-semibold ${!canManageOrders ? 'text-rose-200 font-bold' : 'text-emerald-100'}`}>
                    {!canManageOrders ? '🔒 Restricted by Superadmin' : 'EasyPaisa, JazzCash & Bank'}
                  </div>
                </div>
              </button>

              {/* Card 6: WhatsApp & Footer */}
              <button
                type="button"
                onClick={() => {
                  if (!canManageSiteConfig) {
                    handleRestrictedAccess('WhatsApp & Footer');
                    return;
                  }
                  openSettingsScreen('contact_footer', 1);
                }}
                className={`p-3.5 rounded-2xl bg-gradient-to-br from-amber-500 via-orange-500 to-rose-500 text-white text-left shadow-md hover:scale-[1.01] transition flex flex-col justify-between gap-2 relative ${
                  !canManageSiteConfig ? 'opacity-65 cursor-not-allowed !border-rose-500/50' : 'cursor-pointer'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`w-9 h-9 rounded-xl flex items-center justify-center ${!canManageSiteConfig ? 'bg-rose-500/20 text-rose-400' : 'bg-white/20 text-white'}`}>
                    {!canManageSiteConfig ? <FaLock className="w-4 h-4 text-rose-400" /> : <SiWhatsapp className="w-4 h-4 text-white" />}
                  </span>
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase flex items-center gap-1 ${
                    !canManageSiteConfig ? 'bg-rose-500 text-white shadow-sm' : 'bg-white/25 text-white'
                  }`}>
                    {!canManageSiteConfig ? <>🔒 LOCKED</> : '3 Steps'}
                  </span>
                </div>
                <div>
                  <div className="text-xs sm:text-sm font-extrabold flex items-center gap-1.5">
                    <span>WhatsApp &amp; Footer</span>
                    {!canManageSiteConfig && <FaLock className="text-[10px] text-rose-300" />}
                  </div>
                  <div className={`text-[10px] font-semibold ${!canManageSiteConfig ? 'text-rose-200 font-bold' : 'text-amber-100'}`}>
                    {!canManageSiteConfig ? '🔒 Restricted by Superadmin' : 'Number, Socials & Links'}
                  </div>
                </div>
              </button>

              {/* Card 7: Sub-Admins & Roles */}
              <button
                type="button"
                onClick={() => {
                  if (!canManageAdmins) {
                    handleRestrictedAccess('Sub-Admins & Roles');
                    return;
                  }
                  openSettingsScreen('security', 2);
                }}
                className={`p-3.5 rounded-2xl bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 text-white text-left shadow-md hover:scale-[1.01] transition flex flex-col justify-between gap-2 relative ${
                  !canManageAdmins ? 'opacity-65 cursor-not-allowed !border-rose-500/50' : 'cursor-pointer'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`w-9 h-9 rounded-xl flex items-center justify-center ${!canManageAdmins ? 'bg-rose-500/20 text-rose-400' : 'bg-white/20 text-white'}`}>
                    {!canManageAdmins ? <FaLock className="w-4 h-4 text-rose-400" /> : <FaUserShield className="w-4 h-4 text-white" />}
                  </span>
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase flex items-center gap-1 ${
                    !canManageAdmins ? 'bg-rose-500 text-white shadow-sm' : 'bg-white/25 text-white'
                  }`}>
                    {!canManageAdmins ? <>🔒 LOCKED</> : 'RBAC Team'}
                  </span>
                </div>
                <div>
                  <div className="text-xs sm:text-sm font-extrabold flex items-center gap-1.5">
                    <span>Sub-Admins &amp; Roles</span>
                    {!canManageAdmins && <FaLock className="text-[10px] text-rose-300" />}
                  </div>
                  <div className={`text-[10px] font-semibold ${!canManageAdmins ? 'text-rose-200 font-bold' : 'text-purple-100'}`}>
                    {!canManageAdmins ? '🔒 Superadmin Only' : 'Create Admin & Granular Permissions'}
                  </div>
                </div>
              </button>

                            {/* Card 9: Welcome & Promo Popup Modal */}
              <button
                type="button"
                onClick={() => {
                  if (!canManageSiteConfig) {
                    handleRestrictedAccess('Promo Popup Modal');
                    return;
                  }
                  openSettingsScreen('promo_popup');
                }}
                className={`p-3.5 rounded-2xl bg-gradient-to-br from-rose-600 via-pink-600 to-indigo-700 text-white text-left shadow-md hover:scale-[1.01] transition flex flex-col justify-between gap-2 relative ${
                  !canManageSiteConfig ? 'opacity-65 cursor-not-allowed !border-rose-500/50' : 'cursor-pointer'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`w-9 h-9 rounded-xl flex items-center justify-center ${!canManageSiteConfig ? 'bg-rose-500/20 text-rose-400' : 'bg-white/20 text-white'}`}>
                    <FaBullhorn className="w-4 h-4 text-white" />
                  </span>
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase flex items-center gap-1 ${
                    !canManageSiteConfig ? 'bg-rose-500 text-white shadow-sm' : (siteConfig.promoPopup?.enabled ? 'bg-emerald-400 text-slate-950 font-black shadow-sm animate-pulse' : 'bg-white/25 text-white')
                  }`}>
                    {!canManageSiteConfig ? <>🔒 LOCKED</> : (siteConfig.promoPopup?.enabled ? '● LIVE ON' : '○ OFF')}
                  </span>
                </div>
                <div>
                  <div className="text-xs sm:text-sm font-extrabold flex items-center gap-1.5">
                    <span>Welcome &amp; Promo Popup</span>
                    {!canManageSiteConfig && <FaLock className="text-[10px] text-rose-300" />}
                  </div>
                  <div className={`text-[10px] font-semibold ${!canManageSiteConfig ? 'text-rose-200 font-bold' : 'text-pink-100'}`}>
                    {!canManageSiteConfig ? '🔒 Restricted by Superadmin' : '20% Off, Announcement & Image'}
                  </div>
                </div>
              </button>

              {/* Card 8: SEO & Meta Tags */}
              <button
                type="button"
                onClick={() => {
                  if (!canManageSiteConfig) {
                    handleRestrictedAccess('SEO & Meta Tags');
                    return;
                  }
                  openSettingsScreen('seo');
                }}
                className={`p-3.5 rounded-2xl bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 text-white text-left shadow-md hover:scale-[1.01] transition flex flex-col justify-between gap-2 col-span-2 sm:col-span-1 relative ${
                  !canManageSiteConfig ? 'opacity-65 cursor-not-allowed !border-rose-500/50' : 'cursor-pointer'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`w-9 h-9 rounded-xl flex items-center justify-center ${!canManageSiteConfig ? 'bg-rose-500/20 text-rose-400' : 'bg-white/20 text-white'}`}>
                    {!canManageSiteConfig ? <FaLock className="w-4 h-4 text-rose-400" /> : <FaGlobe className="w-4 h-4 text-white" />}
                  </span>
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase flex items-center gap-1 ${
                    !canManageSiteConfig ? 'bg-rose-500 text-white shadow-sm' : 'bg-white/25 text-white'
                  }`}>
                    {!canManageSiteConfig ? <>🔒 LOCKED</> : 'SEO Hub'}
                  </span>
                </div>
                <div>
                  <div className="text-xs sm:text-sm font-extrabold flex items-center gap-1.5">
                    <span>SEO &amp; Meta Tags</span>
                    {!canManageSiteConfig && <FaLock className="text-[10px] text-rose-300" />}
                  </div>
                  <div className={`text-[10px] font-semibold ${!canManageSiteConfig ? 'text-rose-200 font-bold' : 'text-blue-100'}`}>
                    {!canManageSiteConfig ? '🔒 Restricted by Superadmin' : 'Open Graph, Twitter & Keywords'}
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* GROUPED WHATSAPP / TIKTOK SETTINGS MENU LISTS */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* GROUP 1: STORE CATALOG, CATEGORIES, PRODUCTS & WEB TOOLS */}
            {matchesSearch('store categories category icons products services plans prices packages web tools links utilities add edit delete') && (
              <div className="acrylic-frame rounded-[30px] p-3">
                <div className="plush-pillow plush-login rounded-[24px] p-4 sm:p-5 space-y-3">
                  <div className="flex items-center justify-between px-1">
                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-pink-700 flex items-center gap-1.5">
                      <FaLayerGroup className="w-3.5 h-3.5" />
                      <span>1. Categories, Products, Plans &amp; Web Tools</span>
                    </span>
                    <span className="text-[10px] font-bold text-slate-500">Tap row to open</span>
                  </div>

                  <div className="rounded-2xl bg-white/90 border border-pink-100 divide-y divide-slate-200/70 overflow-hidden shadow-xs">
                    {/* Row: 1-Tap Hide / Show Anything Master Studio */}
                    <div
                      onClick={() => openSettingsScreen('visibility')}
                      className="p-3.5 sm:p-4 bg-gradient-to-r from-slate-900/5 via-indigo-50/70 to-pink-50/70 hover:bg-pink-50 transition flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-3 cursor-pointer"
                    >
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-slate-900 via-indigo-800 to-purple-700 text-white flex items-center justify-center shadow-sm flex-shrink-0">
                          <FaEyeSlash className="w-4 h-4 text-sky-300" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="text-xs sm:text-sm font-extrabold text-slate-900 leading-snug break-words">
                            👁️ Hide / Show Anything (Services, Sections, Categories &amp; Tabs)
                          </div>
                          <div className="text-[11px] font-semibold text-slate-600 truncate">
                            1-Tap Hide or Show any Service, Category, Web Tool, Banner, Button or Section without deleting
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between sm:justify-end gap-2 flex-shrink-0 pl-13 sm:pl-0 w-full sm:w-auto">
                        <span className="px-2.5 py-1 rounded-full bg-slate-900 text-sky-300 text-[10px] font-extrabold">
                          {hiddenServicesCount + hiddenToolsCount + hiddenCategoriesCount > 0
                            ? `${hiddenServicesCount + hiddenToolsCount + hiddenCategoriesCount} Hidden`
                            : 'Master Switch'}
                        </span>
                        <FaChevronRight className="w-3.5 h-3.5 text-slate-400" />
                      </div>
                    </div>

                    {/* Row: Store Categories & Custom Icons Manager */}
                    <div
                      onClick={() => openSettingsScreen('categories', 1)}
                      className="p-3.5 sm:p-4 hover:bg-pink-50/60 transition flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-3 cursor-pointer"
                    >
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-fuchsia-600 to-purple-600 text-white flex items-center justify-center shadow-sm flex-shrink-0">
                          <FaLayerGroup className="w-4 h-4" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="text-xs sm:text-sm font-extrabold text-slate-900 leading-snug break-words">
                            Store Categories &amp; Tab Icons (Add / Edit / Delete)
                          </div>
                          <div className="text-[11px] font-semibold text-slate-600 truncate">
                            {activeCategories.length} Categories • Create new category tabs, rename, delete or attach 3D / custom icons
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between sm:justify-end gap-2 flex-shrink-0 pl-13 sm:pl-0 w-full sm:w-auto">
                        <span className="px-2.5 py-1 rounded-full bg-fuchsia-100 text-fuchsia-800 text-[10px] font-extrabold">
                          {activeCategories.length} Tabs
                        </span>
                        <FaChevronRight className="w-3.5 h-3.5 text-slate-400" />
                      </div>
                    </div>

                    {/* Row: Store Services / Products */}
                    <div
                      onClick={() => openSettingsScreen('services', 1)}
                      className="p-3.5 sm:p-4 hover:bg-pink-50/60 transition flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-3 cursor-pointer"
                    >
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-600 text-white flex items-center justify-center shadow-sm flex-shrink-0">
                          <FaBagShopping className="w-4 h-4" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="text-xs sm:text-sm font-extrabold text-slate-900 leading-snug break-words">
                            Store Products, Descriptions &amp; Pricing Plans
                          </div>
                          <div className="text-[11px] font-semibold text-slate-600 truncate">
                            {servicesCatalog.length} Active Products • Add/Edit Title, Plans &amp; Prices Step-by-Step
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between sm:justify-end gap-2 flex-shrink-0 pl-13 sm:pl-0 w-full sm:w-auto">
                        <span className="px-2.5 py-1 rounded-full bg-pink-100 text-pink-800 text-[10px] font-extrabold">
                          {servicesCatalog.length} Items
                        </span>
                        <FaChevronRight className="w-3.5 h-3.5 text-slate-400" />
                      </div>
                    </div>

                    {/* Row: Jump directly to Pricing Plans Builder */}
                    <div
                      onClick={() => openSettingsScreen('services', 2)}
                      className="p-3.5 sm:p-4 hover:bg-pink-50/60 transition flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-3 cursor-pointer"
                    >
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 text-white flex items-center justify-center shadow-sm flex-shrink-0">
                          <FaSliders className="w-4 h-4" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="text-xs sm:text-sm font-extrabold text-slate-900 leading-snug break-words">
                            Package Plans &amp; Price List Builder
                          </div>
                          <div className="text-[11px] font-semibold text-slate-600 truncate">
                            Add 1 Month, 6 Months, 1 Year plans &amp; custom Rs. prices easily
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between sm:justify-end gap-2 flex-shrink-0 pl-13 sm:pl-0 w-full sm:w-auto">
                        <span className="px-2.5 py-1 rounded-full bg-purple-100 text-purple-800 text-[10px] font-extrabold">
                          Step 2
                        </span>
                        <FaChevronRight className="w-3.5 h-3.5 text-slate-400" />
                      </div>
                    </div>

                    {/* Row: Live Web Tools */}
                    <div
                      onClick={() => openSettingsScreen('tools', 1)}
                      className="p-3.5 sm:p-4 hover:bg-pink-50/60 transition flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-3 cursor-pointer"
                    >
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-500 to-cyan-600 text-white flex items-center justify-center shadow-sm flex-shrink-0">
                          <FaScrewdriverWrench className="w-4 h-4" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="text-xs sm:text-sm font-extrabold text-slate-900 leading-snug break-words">
                            Live Web Tools &amp; Custom Tool Icons
                          </div>
                          <div className="text-[11px] font-semibold text-slate-600 truncate">
                            {webToolsCatalog.length} Active Tools • Add Tool Link, Upload/Pick Icon, Description &amp; Mode
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between sm:justify-end gap-2 flex-shrink-0 pl-13 sm:pl-0 w-full sm:w-auto">
                        <span className="px-2.5 py-1 rounded-full bg-indigo-100 text-indigo-800 text-[10px] font-extrabold">
                          {webToolsCatalog.length} Tools
                        </span>
                        <FaChevronRight className="w-3.5 h-3.5 text-slate-400" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* GROUP 2: HERO BANNER, THEME & FONT APPEARANCE */}
            {matchesSearch('hero banner show hide headline badge description portrait photo theme font style appearance') && (
              <div className="acrylic-frame rounded-[30px] p-3">
                <div className="plush-pillow plush-hero rounded-[24px] p-4 sm:p-5 space-y-3">
                  <div className="flex items-center justify-between px-1">
                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-rose-700 flex items-center gap-1.5">
                      <FaPanorama className="w-3.5 h-3.5" />
                      <span>2. Banner, Visibility &amp; Appearance</span>
                    </span>
                    <span className="text-[10px] font-bold text-slate-500">Live Toggles</span>
                  </div>

                  <div className="rounded-2xl bg-white/90 border border-pink-100 divide-y divide-slate-200/70 overflow-hidden shadow-xs">
                    {/* Row: Show / Hide Hero Banner + Drilldown */}
                    <div
                      onClick={() => openSettingsScreen('banner', 1)}
                      className="p-3.5 sm:p-4 hover:bg-pink-50/60 transition flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-3 cursor-pointer"
                    >
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-rose-500 to-amber-500 text-white flex items-center justify-center shadow-sm flex-shrink-0">
                          <FaPanorama className="w-4 h-4" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="text-xs sm:text-sm font-extrabold text-slate-900 leading-snug break-words">
                            Show Hero Banner &amp; Edit Banner Text
                          </div>
                          <div className="text-[11px] font-semibold text-slate-600 truncate">
                            {siteConfig.banner.showHeroBanner ? 'Visible on Storefront' : 'Hidden on Storefront'} • Edit Title, Badge &amp; Bio
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between sm:justify-end gap-2.5 flex-shrink-0 pl-13 sm:pl-0 w-full sm:w-auto">
                        {renderToggleSwitch(
                          siteConfig.banner.showHeroBanner,
                          () => {
                            const next = !siteConfig.banner.showHeroBanner;
                            onUpdateSiteConfig((prev) => ({
                              ...prev,
                              banner: { ...prev.banner, showHeroBanner: next }
                            }));
                            showToast(
                              next
                                ? '🖼️ Hero Banner Enabled on Storefront!'
                                : '🙈 Hero Banner Hidden on Storefront!'
                            );
                          },
                          'Toggle Hero Banner'
                        )}
                        <FaChevronRight className="w-3.5 h-3.5 text-slate-400" />
                      </div>
                    </div>

                    {/* Row: Top Header Strip Toggle */}
                    <div
                      onClick={() => openSettingsScreen('banner', 1)}
                      className="p-3.5 sm:p-4 hover:bg-pink-50/60 transition flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-3 cursor-pointer"
                    >
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-sky-500 to-blue-600 text-white flex items-center justify-center shadow-sm flex-shrink-0">
                          <FaBolt className="w-4 h-4" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="text-xs sm:text-sm font-extrabold text-slate-900 leading-snug break-words">
                            Top Header Strip &amp; WhatsApp Pill
                          </div>
                          <div className="text-[11px] font-semibold text-slate-600 truncate">
                            {siteConfig.banner.topStripTitle}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between sm:justify-end gap-2.5 flex-shrink-0 pl-13 sm:pl-0 w-full sm:w-auto">
                        {renderToggleSwitch(
                          siteConfig.banner.showTopStrip,
                          () => {
                            const next = !siteConfig.banner.showTopStrip;
                            onUpdateSiteConfig((prev) => ({
                              ...prev,
                              banner: { ...prev.banner, showTopStrip: next }
                            }));
                            showToast(
                              next ? 'Top Header Strip Shown!' : 'Top Header Strip Hidden!'
                            );
                          },
                          'Toggle Top Strip'
                        )}
                        <FaChevronRight className="w-3.5 h-3.5 text-slate-400" />
                      </div>
                    </div>

                    {/* Row: 🎯 2 No Promo & Deal Banners Manager */}
                    <div
                      onClick={() => openSettingsScreen('promo_banners', 1)}
                      className="p-3.5 sm:p-4 hover:bg-pink-50/60 transition flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-3 cursor-pointer"
                    >
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-fuchsia-500 to-pink-600 text-white flex items-center justify-center shadow-sm flex-shrink-0">
                          <FaBullhorn className="w-4 h-4" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="text-xs sm:text-sm font-extrabold text-slate-900 flex items-center gap-1.5 leading-snug">
                            <span>🎯 2 No Promo Banners Manager</span>
                            <span className="px-1.5 py-0.2 rounded-full bg-pink-100 text-pink-700 text-[9px] font-black">
                              {currentPromoBanners.length} Banners
                            </span>
                          </div>
                          <div className="text-[11px] font-semibold text-slate-600 truncate">
                            Add, Delete, Edit, Change Colors/Styles (Plush, Dark, Gold, Emerald) &amp; Actions
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between sm:justify-end gap-2.5 flex-shrink-0 pl-13 sm:pl-0 w-full sm:w-auto">
                        {renderToggleSwitch(
                          activeVisibility.showPromoBanners ?? true,
                          () => toggleSiteVisibilityKey('showPromoBanners', '2 No Promo Banners'),
                          'Toggle 2 No Promo Banners'
                        )}
                        <FaChevronRight className="w-3.5 h-3.5 text-slate-400" />
                      </div>
                    </div>

                    {/* Row: Soft Light RGB Border Around Portfolio & Cards Toggle */}
                    <div
                      onClick={() => {
                        const next = siteConfig.banner.rgbBorderEnabled === false;
                        onUpdateSiteConfig((prev) => ({
                          ...prev,
                          banner: { ...prev.banner, rgbBorderEnabled: next }
                        }));
                        showToast(
                          next
                            ? '🌈 Soft Light RGB Borders Turned ON!'
                            : '⚪ Soft Light RGB Borders Turned OFF!'
                        );
                      }}
                      className="p-3.5 sm:p-4 hover:bg-pink-50/60 transition flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-3 cursor-pointer"
                    >
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-sky-400 via-purple-500 to-pink-500 text-white flex items-center justify-center shadow-sm flex-shrink-0">
                          <FaWandMagicSparkles className="w-4 h-4" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="text-xs sm:text-sm font-extrabold text-slate-900 flex items-center gap-2 leading-snug">
                            <span>Soft Light RGB Borders</span>
                            <span
                              className={`px-1.5 py-0.2 rounded-full text-[9px] font-black ${
                                siteConfig.banner.rgbBorderEnabled !== false
                                  ? 'bg-sky-100 text-sky-800'
                                  : 'bg-slate-200 text-slate-600'
                              }`}
                            >
                              {siteConfig.banner.rgbBorderEnabled !== false ? 'ON' : 'OFF'}
                            </span>
                          </div>
                          <div className="text-[11px] font-semibold text-slate-600 truncate">
                            Soft animated cyan/pink ambient light around cards &amp; showcase frames
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2.5 flex-shrink-0 pl-13 sm:pl-0">
                        {renderToggleSwitch(
                          siteConfig.banner.rgbBorderEnabled !== false,
                          () => {
                            const next = siteConfig.banner.rgbBorderEnabled === false;
                            onUpdateSiteConfig((prev) => ({
                              ...prev,
                              banner: { ...prev.banner, rgbBorderEnabled: next }
                            }));
                            showToast(
                              next
                                ? '🌈 Soft Light RGB Borders Turned ON!'
                                : '⚪ Soft Light RGB Borders Turned OFF!'
                            );
                          },
                          'Toggle Soft Light RGB Borders'
                        )}
                      </div>
                    </div>

                    {/* Row: Storefront Bars & Live Wallet */}
                    <div
                      onClick={() => openSettingsScreen('store_bars', 1)}
                      className="p-3.5 sm:p-4 hover:bg-pink-50/60 transition flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-3 cursor-pointer"
                    >
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-500 text-white flex items-center justify-center shadow-sm flex-shrink-0">
                          <i className="fa-solid fa-store text-sm"></i>
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="text-xs sm:text-sm font-extrabold text-slate-900 leading-snug break-words">
                            Storefront Bars, Live Wallet &amp; Status Telemetry
                          </div>
                          <div className="text-[11px] font-semibold text-slate-600 truncate">
                            Live Account Balance, Server Pulse, Marquee, Search &amp; Hot Searches
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between sm:justify-end gap-2 flex-shrink-0 pl-13 sm:pl-0 w-full sm:w-auto">
                        <span className="px-2.5 py-1 rounded-full bg-indigo-100 text-indigo-800 text-[10px] font-extrabold">
                          Customize
                        </span>
                        <FaChevronRight className="w-3.5 h-3.5 text-slate-400" />
                      </div>
                    </div>

                    {/* Row: Themes & Font Studio */}
                    <div
                      onClick={() => openSettingsScreen('ui')}
                      className="p-3.5 sm:p-4 hover:bg-pink-50/60 transition flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-3 cursor-pointer"
                    >
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-600 text-white flex items-center justify-center shadow-sm flex-shrink-0">
                          <FaWandMagicSparkles className="w-4 h-4" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="text-xs sm:text-sm font-extrabold text-slate-900 leading-snug break-words">
                            UI Theme &amp; Font Typography Studio
                          </div>
                          <div className="text-[11px] font-semibold text-slate-600 truncate">
                            {themeDisplayName} • Font: {activeFontObj.displayFontName}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between sm:justify-end gap-2 flex-shrink-0 pl-13 sm:pl-0 w-full sm:w-auto">
                        <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-extrabold">
                          6 Themes • 6 Fonts
                        </span>
                        <FaChevronRight className="w-3.5 h-3.5 text-slate-400" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* GROUP 3: PAYMENT METHODS, JAZZCASH/EASYPAISA NUMBERS & WALLET PROOFS */}
            {matchesSearch('payment methods easypaisa jazzcash sadapay bank binance usdt account number title wallet balance proofs') && (
              <div className="acrylic-frame rounded-[30px] p-3">
                <div className="plush-pillow plush-contact rounded-[24px] p-4 sm:p-5 space-y-3">
                  <div className="flex items-center justify-between px-1">
                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
                      <FaBuildingColumns className="w-3.5 h-3.5" />
                      <span>3. Payment Methods &amp; User Wallet</span>
                    </span>
                    <span className="text-[10px] font-bold text-slate-500">Accounts &amp; Proofs</span>
                  </div>

                  <div className="rounded-2xl bg-white/90 border border-emerald-100 divide-y divide-slate-200/70 overflow-hidden shadow-xs">
                    {/* Row: Edit Payment Methods */}
                    <div
                      onClick={() => openSettingsScreen('payment_methods')}
                      className="p-3.5 sm:p-4 hover:bg-emerald-50/60 transition flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-3 cursor-pointer"
                    >
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-500 to-green-600 text-white flex items-center justify-center shadow-sm flex-shrink-0">
                          <FaBuildingColumns className="w-4 h-4" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="text-xs sm:text-sm font-extrabold text-slate-900 leading-snug break-words">
                            Payment Methods &amp; Account Numbers
                          </div>
                          <div className="text-[11px] font-semibold text-slate-600 truncate">
                            Edit EasyPaisa, JazzCash, SadaPay/Bank &amp; USDT Name &amp; Number
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between sm:justify-end gap-2 flex-shrink-0 pl-13 sm:pl-0 w-full sm:w-auto">
                        <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-extrabold">
                          {siteConfig.paymentMethods[0]?.accountNumber || '0347-8936242'}
                        </span>
                        <FaChevronRight className="w-3.5 h-3.5 text-slate-400" />
                      </div>
                    </div>

                    {/* Row: Customer Reviews Moderation */}
                    <div
                      onClick={() => openSettingsScreen('reviews')}
                      className="p-3.5 sm:p-4 hover:bg-amber-50/60 transition flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-3 cursor-pointer border-b border-slate-100"
                    >
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-400 to-yellow-600 text-white flex items-center justify-center shadow-sm flex-shrink-0">
                          <FaStar className="w-4 h-4" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="text-xs sm:text-sm font-extrabold text-slate-900 leading-snug break-words">
                            Customer Reviews Moderation Studio
                          </div>
                          <div className="text-[11px] font-semibold text-slate-600 truncate">
                            Approve or reject client testimonials before displaying live • Discard spam
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between sm:justify-end gap-2 flex-shrink-0 pl-13 sm:pl-0 w-full sm:w-auto">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-amber-100 text-amber-800 border border-amber-300">
                          Moderate
                        </span>
                        <FaChevronRight className="w-3.5 h-3.5 text-slate-400" />
                      </div>
                    </div>

                    {/* Row: Verify Payment Proofs & User Balance */}
                    <div
                      onClick={() => openSettingsScreen('payments')}
                      className="p-3.5 sm:p-4 hover:bg-emerald-50/60 transition flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-3 cursor-pointer"
                    >
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 text-white flex items-center justify-center shadow-sm flex-shrink-0">
                          <FaCreditCard className="w-4 h-4" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="text-xs sm:text-sm font-extrabold text-slate-900 leading-snug break-words">
                            User Payment Proofs &amp; Wallet Balance
                          </div>
                          <div className="text-[11px] font-semibold text-slate-600 truncate">
                            Live User Balance: Rs. {walletBalance.toLocaleString()} • Approve Screenshots
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between sm:justify-end gap-2 flex-shrink-0 pl-13 sm:pl-0 w-full sm:w-auto">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold ${
                            pendingProofsCount > 0
                              ? 'bg-amber-100 text-amber-800 border border-amber-300'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {pendingProofsCount} Pending
                        </span>
                        <FaChevronRight className="w-3.5 h-3.5 text-slate-400" />
                      </div>
                    </div>

                    {/* Row: Sound Toggle */}
                    <div
                      onClick={toggleSound}
                      className="p-3.5 sm:p-4 hover:bg-emerald-50/60 transition flex items-center justify-between gap-3 cursor-pointer"
                    >
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-slate-700 to-slate-900 text-white flex items-center justify-center shadow-sm flex-shrink-0">
                          <FaVolumeHigh className="w-4 h-4" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="text-xs sm:text-sm font-extrabold text-slate-900 leading-snug break-words">
                            Tactile UI Sound Effects
                          </div>
                          <div className="text-[11px] font-semibold text-slate-600 truncate">
                            Play subtle pop sound on button taps &amp; order actions
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        {renderToggleSwitch(soundEnabled, toggleSound, 'Toggle UI Sounds')}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* GROUP 4: WHATSAPP NUMBER, SOCIAL MEDIA & FOOTER LINKS */}
            {matchesSearch('whatsapp number phone contact email website instagram tiktok facebook snapchat footer links brand') && (
              <div className="acrylic-frame rounded-[30px] p-3">
                <div className="plush-pillow plush-about rounded-[24px] p-4 sm:p-5 space-y-3">
                  <div className="flex items-center justify-between px-1">
                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-indigo-800 flex items-center gap-1.5">
                      <SiWhatsapp className="w-3.5 h-3.5 text-emerald-600" />
                      <span>4. WhatsApp, Socials &amp; Footer Links</span>
                    </span>
                    <span className="text-[10px] font-bold text-slate-500">Global Sync</span>
                  </div>

                  <div className="rounded-2xl bg-white/90 border border-indigo-100 divide-y divide-slate-200/70 overflow-hidden shadow-xs">
                    {/* Row: Primary WhatsApp Number */}
                    <div
                      onClick={() => openSettingsScreen('contact_footer', 1)}
                      className="p-3.5 sm:p-4 hover:bg-indigo-50/60 transition flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-3 cursor-pointer"
                    >
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center shadow-sm flex-shrink-0">
                          <SiWhatsapp className="w-5 h-5" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="text-xs sm:text-sm font-extrabold text-slate-900 leading-snug break-words">
                            Primary WhatsApp Number &amp; Contact Info
                          </div>
                          <div className="text-[11px] font-semibold text-slate-600 truncate">
                            {siteConfig.contact.whatsappNumberDisplay} • {siteConfig.contact.officialWebsiteLabel}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between sm:justify-end gap-2 flex-shrink-0 pl-13 sm:pl-0 w-full sm:w-auto">
                        <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-mono-code font-extrabold">
                          Edit WA
                        </span>
                        <FaChevronRight className="w-3.5 h-3.5 text-slate-400" />
                      </div>
                    </div>

                    {/* Row: Social Media Links */}
                    <div
                      onClick={() => openSettingsScreen('contact_footer', 2)}
                      className="p-3.5 sm:p-4 hover:bg-indigo-50/60 transition flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-3 cursor-pointer"
                    >
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-600 text-white flex items-center justify-center shadow-sm flex-shrink-0">
                          <FaShareNodes className="w-4 h-4" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="text-xs sm:text-sm font-extrabold text-slate-900 leading-snug break-words">
                            Social Media Links &amp; Handles
                          </div>
                          <div className="text-[11px] font-semibold text-slate-600 truncate">
                            IG: {siteConfig.socials.instagramHandle} • TikTok: {siteConfig.socials.tiktokHandle} • FB &amp; Snap
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between sm:justify-end gap-2 flex-shrink-0 pl-13 sm:pl-0 w-full sm:w-auto">
                        <span className="px-2.5 py-1 rounded-full bg-pink-100 text-pink-800 text-[10px] font-extrabold">
                          4 Socials
                        </span>
                        <FaChevronRight className="w-3.5 h-3.5 text-slate-400" />
                      </div>
                    </div>

                    {/* Row: Footer Links & Branding */}
                    <div
                      onClick={() => openSettingsScreen('contact_footer', 3)}
                      className="p-3.5 sm:p-4 hover:bg-indigo-50/60 transition flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-3 cursor-pointer"
                    >
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white flex items-center justify-center shadow-sm flex-shrink-0">
                          <FaGlobe className="w-4 h-4" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="text-xs sm:text-sm font-extrabold text-slate-900 leading-snug break-words">
                            Footer Brand Name &amp; Quick Links
                          </div>
                          <div className="text-[11px] font-semibold text-slate-600 truncate">
                            {siteConfig.footer.brandName} • {siteConfig.footer.copyrightTagline}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between sm:justify-end gap-2.5 flex-shrink-0 pl-13 sm:pl-0 w-full sm:w-auto">
                        {renderToggleSwitch(
                          siteConfig.footer.showQuickLinks,
                          () => {
                            const next = !siteConfig.footer.showQuickLinks;
                            onUpdateSiteConfig((prev) => ({
                              ...prev,
                              footer: { ...prev.footer, showQuickLinks: next }
                            }));
                            showToast(
                              next ? 'Footer Quick Links Enabled!' : 'Footer Quick Links Hidden!'
                            );
                          },
                          'Toggle Footer Quick Links'
                        )}
                        <FaChevronRight className="w-3.5 h-3.5 text-slate-400" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* GROUP 5: SEO, OPEN GRAPH TAGS & CUSTOM KEYWORDS */}
            {matchesSearch('seo opengraph og tags meta description keywords search google twitter social snippet robots') && (
              <div className="acrylic-frame rounded-[30px] p-3 col-span-1 lg:col-span-2">
                <div className="plush-pillow plush-hero rounded-[24px] p-4 sm:p-5 space-y-3">
                  <div className="flex items-center justify-between px-1">
                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-blue-700 flex items-center gap-1.5">
                      <FaGlobe className="w-3.5 h-3.5 text-blue-600" />
                      <span>5. Search Engine Optimization (SEO) &amp; OpenGraph Social Cards</span>
                    </span>
                    <span className="text-[10px] font-bold text-slate-500">Live Google Preview</span>
                  </div>

                  <div className="rounded-2xl bg-white/90 border border-blue-100 divide-y divide-slate-200/70 overflow-hidden shadow-xs">
                    {/* Row 1: Manage SEO Title & Meta Description */}
                    <div
                      onClick={() => openSettingsScreen('seo')}
                      className="p-3.5 sm:p-4 hover:bg-blue-50/60 transition flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-3 cursor-pointer"
                    >
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white flex items-center justify-center shadow-sm flex-shrink-0">
                          <FaGlobe className="w-4 h-4" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="text-xs sm:text-sm font-extrabold text-slate-900 leading-snug break-words">
                            Google Meta Title, Description &amp; Canonical URL
                          </div>
                          <div className="text-[11px] font-semibold text-slate-600 truncate">
                            {siteConfig.seo?.metaTitle || DEFAULT_SITE_SEO.metaTitle}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between sm:justify-end gap-2 flex-shrink-0 pl-13 sm:pl-0 w-full sm:w-auto">
                        <span className="px-2.5 py-1 rounded-full bg-blue-100 text-blue-800 text-[10px] font-extrabold">
                          Manage SEO
                        </span>
                        <FaChevronRight className="w-3.5 h-3.5 text-slate-400" />
                      </div>
                    </div>

                    {/* Row 2: Open Graph & Twitter Social Share Cards */}
                    <div
                      onClick={() => openSettingsScreen('seo')}
                      className="p-3.5 sm:p-4 hover:bg-blue-50/60 transition flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-3 cursor-pointer"
                    >
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-500 via-teal-600 to-cyan-600 text-white flex items-center justify-center shadow-sm flex-shrink-0">
                          <FaShareNodes className="w-4 h-4" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="text-xs sm:text-sm font-extrabold text-slate-900 leading-snug break-words">
                            OpenGraph (WhatsApp/Facebook) &amp; Twitter / X Cards
                          </div>
                          <div className="text-[11px] font-semibold text-slate-600 truncate">
                            Share image, title, card preview &amp; social branding
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between sm:justify-end gap-2 flex-shrink-0 pl-13 sm:pl-0 w-full sm:w-auto">
                        <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-extrabold">
                          Cards &amp; Previews
                        </span>
                        <FaChevronRight className="w-3.5 h-3.5 text-slate-400" />
                      </div>
                    </div>

                    {/* Row 3: Custom SEO Keywords & Schema.org JSON-LD */}
                    <div
                      onClick={() => openSettingsScreen('seo')}
                      className="p-3.5 sm:p-4 hover:bg-blue-50/60 transition flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-3 cursor-pointer"
                    >
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-purple-600 via-fuchsia-600 to-indigo-600 text-white flex items-center justify-center shadow-sm flex-shrink-0">
                          <FaTags className="w-4 h-4" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="text-xs sm:text-sm font-extrabold text-slate-900 leading-snug break-words">
                            Custom Keywords &amp; Schema.org Structured Data (JSON-LD)
                          </div>
                          <div className="text-[11px] font-semibold text-slate-600 truncate">
                            {(siteConfig.seo?.keywords || DEFAULT_SITE_SEO.keywords).split(',').filter(Boolean).length} Targeted Keywords for Pakistan SMM &amp; AI
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between sm:justify-end gap-2 flex-shrink-0 pl-13 sm:pl-0 w-full sm:w-auto">
                        <span className="px-2.5 py-1 rounded-full bg-purple-100 text-purple-800 text-[10px] font-extrabold">
                          Keywords &amp; JSON-LD
                        </span>
                        <FaChevronRight className="w-3.5 h-3.5 text-slate-400" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Instant Font & Reset Footer Bar */}
          <div className="acrylic-frame rounded-[28px] p-3">
            <div className="rounded-[22px] bg-white/85 p-3.5 sm:p-4 border border-white flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-xs font-extrabold text-slate-800 flex items-center gap-1.5 mr-1">
                  <FaFont className="text-pink-600" />
                  <span>Quick Font Switch:</span>
                </span>
                {STORE_FONT_PACKS.map((pack) => {
                  const isFontAct = websiteFontMode === pack.id;
                  return (
                    <button
                      key={pack.id}
                      type="button"
                      onClick={() => {
                        playPopSound(760);
                        setWebsiteFontMode(pack.id);
                        showToast(`🔤 Font Switched to ${pack.title}`);
                      }}
                      style={{ fontFamily: pack.displayCss }}
                      className={`px-2.5 py-1 rounded-xl text-[11px] font-bold transition cursor-pointer ${
                        isFontAct
                          ? 'bg-slate-900 text-sky-300 shadow-sm'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                      }`}
                    >
                      {pack.shortLabel}
                    </button>
                  );
                })}
              </div>

              <button
                type="button"
                onClick={onResetSiteConfig}
                className="px-3.5 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-extrabold cursor-pointer flex items-center justify-center gap-1.5 self-start sm:self-auto"
              >
                <FaRotateLeft className="w-3 h-3" />
                <span>Reset Site Settings to Default</span>
              </button>
            </div>
          </div>
        </div>
      )}

            {/* ==================== SCREEN PERMISSION GUARD (WHEN SUBADMIN LACKS ACCESS) ==================== */}
      {activeScreen !== 'home' && activeScreen !== 'dashboard' && !hasScreenPermission(activeScreen) && (
        <div className="acrylic-frame rounded-3xl p-8 sm:p-12 text-center max-w-xl mx-auto my-8">
          <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-500 flex items-center justify-center mx-auto mb-4 text-3xl">
            <FaLock />
          </div>
          <h3 className="text-xl font-black text-slate-900 mb-2">🔒 Permission Restricted</h3>
          <p className="text-xs sm:text-sm text-slate-600 mb-6 leading-relaxed">
            Aapka sub-admin account (<code className="font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded">{currentAdminUser}</code>) is system ko manage karne ki permission nahi rakhta.
            Ise open ya edit karne ke liye Superadmin (<b className="text-indigo-600">Sohaib</b>) se access enable karwayein.
          </p>
          <button
            type="button"
            onClick={() => openSettingsScreen('home')}
            className="px-6 py-2.5 rounded-xl bg-slate-900 text-white font-extrabold text-xs hover:bg-slate-800 transition cursor-pointer shadow-md"
          >
            ← Back to Settings Menu
          </button>
        </div>
      )}

{/* ==================== SCREEN 0.5: 3-STEP STORE CATEGORIES & ICONS STUDIO ==================== */}
      {activeScreen === 'categories' && hasScreenPermission('categories') && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
            {/* Left (7 Cols): 3-Step Category Builder & Icon Studio */}
            <div className="lg:col-span-7 acrylic-frame rounded-[34px] p-3 sm:p-4">
              <div className="plush-pillow plush-login rounded-[26px] p-4 sm:p-6 space-y-5">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-pink-200 pb-3.5">
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-fuchsia-700">
                      {editingCatId
                        ? '✏️ STEP-BY-STEP CATEGORY & ICON EDITOR'
                        : '➕ STEP-BY-STEP NEW CATEGORY WIZARD'}
                    </span>
                    <h3 className="text-base sm:text-xl font-extrabold text-slate-900">
                      {editingCatId
                        ? `Editing Category: ${catShortLabel || catLabel}`
                        : 'Create New Store Category & Attach Icon'}
                    </h3>
                  </div>

                  {editingCatId && (
                    <button
                      type="button"
                      onClick={resetCategoryWizardForm}
                      className="px-3 py-1.5 rounded-xl bg-rose-100 hover:bg-rose-200 text-rose-800 text-xs font-extrabold cursor-pointer"
                    >
                      Cancel Edit / + New
                    </button>
                  )}
                </div>

                {/* 3-Step Progress Bar */}
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { step: 1 as const, label: '1. Category Name', short: '1. Name' },
                    { step: 2 as const, label: '2. Category Icon & Color', short: '2. Icon' },
                    { step: 3 as const, label: '3. Preview & Save', short: '3. Save' }
                  ].map((s) => {
                    const isCurr = catStep === s.step;
                    const isDone = catStep > s.step;
                    return (
                      <button
                        key={s.step}
                        type="button"
                        onClick={() => {
                          playPopSound(620);
                          setCatStep(s.step);
                        }}
                        className={`py-2.5 px-2.5 rounded-xl text-[11px] sm:text-xs font-extrabold transition cursor-pointer flex items-center justify-center gap-1 border ${
                          isCurr
                            ? 'bg-gradient-to-r from-fuchsia-600 to-pink-500 text-white border-white shadow-md scale-[1.02]'
                            : isDone
                            ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                            : 'bg-white/85 text-slate-700 border-pink-200 hover:bg-white'
                        }`}
                      >
                        {isDone && <FaCheck className="w-2.5 h-2.5 text-emerald-600" />}
                        <span className="hidden sm:inline truncate">{s.label}</span>
                        <span className="sm:hidden truncate">{s.short}</span>
                      </button>
                    );
                  })}
                </div>

                <form onSubmit={handleSaveCategory} className="space-y-4">
                  {/* STEP 1: CATEGORY NAMES & QUICK PRESETS */}
                  {catStep === 1 && (
                    <div className="space-y-4">
                      {!editingCatId && (
                        <div className="p-3 rounded-2xl bg-white/85 border border-pink-200 space-y-2">
                          <span className="block text-[11px] font-extrabold text-slate-700">
                            ⚡ 1-Tap Category Templates:
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {[
                              {
                                label: 'Gaming, PUBG UC & Steam Keys',
                                short: 'Gaming & UC',
                                icon: 'gamepad' as IconType,
                                color: 'text-purple-600'
                              },
                              {
                                label: 'Netflix, Prime & OTT Streaming',
                                short: 'OTT & Streaming',
                                icon: 'netflix' as IconType,
                                color: 'text-rose-600'
                              },
                              {
                                label: 'Web Hosting, Domains & VPS',
                                short: 'Domains & VPS',
                                icon: 'hostinger' as IconType,
                                color: 'text-indigo-600'
                              },
                              {
                                label: 'WhatsApp & Automation Bots',
                                short: 'WA & Bots',
                                icon: 'whatsapp' as IconType,
                                color: 'text-emerald-600'
                              },
                              {
                                label: 'VIP Royal Deals & Bundles',
                                short: 'VIP Bundles',
                                icon: 'crown' as IconType,
                                color: 'text-amber-500'
                              }
                            ].map((tpl) => (
                              <button
                                key={tpl.short}
                                type="button"
                                onClick={() => {
                                  playPopSound(680);
                                  setCatLabel(tpl.label);
                                  setCatShortLabel(tpl.short);
                                  setCatIconType(tpl.icon);
                                  setCatIconColor(tpl.color);
                                }}
                                className="px-2.5 py-1.5 rounded-xl bg-fuchsia-50 hover:bg-fuchsia-100 text-fuchsia-900 border border-fuchsia-200 text-[10px] font-extrabold cursor-pointer transition"
                              >
                                + {tpl.short}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      <div>
                        <label className="block text-xs font-extrabold text-slate-900 mb-1">
                          1. Short Category Tab Name (Shown on Storefront Filter Button) *
                        </label>
                        <input
                          type="text"
                          value={catShortLabel}
                          onChange={(e) => {
                            setCatShortLabel(e.target.value);
                            if (!catLabel.trim()) {
                              setCatLabel(e.target.value);
                            }
                          }}
                          required
                          placeholder="e.g. Gaming & UC or OTT Streaming"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-white border-2 border-pink-300 font-bold text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-pink-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-extrabold text-slate-900 mb-1">
                          2. Full Category Title / Description *
                        </label>
                        <input
                          type="text"
                          value={catLabel}
                          onChange={(e) => setCatLabel(e.target.value)}
                          required
                          placeholder="e.g. Gaming, PUBG UC & Steam Keys"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-white border-2 border-pink-300 font-bold text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-pink-500"
                        />
                      </div>

                      <div className="flex justify-end pt-2">
                        <button
                          type="button"
                          onClick={() => {
                            if (!catShortLabel.trim() && !catLabel.trim()) {
                              showToast('Please enter a Category Name first!');
                              return;
                            }
                            playPopSound(700);
                            setCatStep(2);
                          }}
                          className="px-5 py-3 rounded-2xl bg-gradient-to-r from-fuchsia-600 to-pink-500 text-white font-extrabold text-xs sm:text-sm shadow-lg flex items-center gap-2 cursor-pointer"
                        >
                          <span>Next Step: Choose Category Icon</span>
                          <FaChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* STEP 2: VISUAL CATEGORY ICON PICKER, IMAGE UPLOAD & COLOR */}
                  {catStep === 2 && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-extrabold text-slate-900 mb-1.5">
                          1. Select 3D Category Icon or Upload Custom Image *
                        </label>
                        {renderVisualIconStudio(
                          catIconType,
                          setCatIconType,
                          catCustomIconUrl,
                          setCatCustomIconUrl
                        )}
                      </div>

                      <div>
                        <label className="block text-xs font-extrabold text-slate-900 mb-1.5">
                          2. Category Icon Accent Color
                        </label>
                        <div className="grid grid-cols-4 sm:grid-cols-8 gap-1.5">
                          {[
                            { cls: 'text-pink-500', bg: 'bg-pink-500', name: 'Pink' },
                            { cls: 'text-purple-600', bg: 'bg-purple-600', name: 'Purple' },
                            { cls: 'text-rose-500', bg: 'bg-rose-500', name: 'Rose' },
                            { cls: 'text-emerald-600', bg: 'bg-emerald-600', name: 'Emerald' },
                            { cls: 'text-blue-600', bg: 'bg-blue-600', name: 'Blue' },
                            { cls: 'text-amber-500', bg: 'bg-amber-500', name: 'Gold' },
                            { cls: 'text-indigo-600', bg: 'bg-indigo-600', name: 'Indigo' },
                            { cls: 'text-cyan-600', bg: 'bg-cyan-600', name: 'Cyan' }
                          ].map((col) => {
                            const isColAct = catIconColor === col.cls;
                            return (
                              <button
                                key={col.cls}
                                type="button"
                                onClick={() => {
                                  playPopSound(600);
                                  setCatIconColor(col.cls);
                                }}
                                className={`p-2 rounded-xl border text-center flex flex-col items-center gap-1 cursor-pointer transition ${
                                  isColAct
                                    ? 'bg-slate-900 text-white border-slate-900 shadow-sm scale-105'
                                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                                }`}
                              >
                                <span className={`w-4 h-4 rounded-full ${col.bg} border border-white shadow-2xs`} />
                                <span className="text-[9px] font-extrabold">{col.name}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-2">
                        <button
                          type="button"
                          onClick={() => setCatStep(1)}
                          className="px-4 py-2.5 rounded-xl bg-white text-slate-700 border border-slate-300 font-extrabold text-xs cursor-pointer"
                        >
                          ← Back
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            playPopSound(740);
                            setCatStep(3);
                          }}
                          className="px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-extrabold text-xs sm:text-sm shadow-lg flex items-center gap-2 cursor-pointer"
                        >
                          <span>Final Step: Preview &amp; Save</span>
                          <FaChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* STEP 3: PREVIEW & SAVE CATEGORY */}
                  {catStep === 3 && (
                    <div className="space-y-4">
                      <div className="p-4 rounded-2xl bg-emerald-50 border-2 border-emerald-300 space-y-2 text-xs">
                        <div className="font-extrabold text-emerald-900 flex items-center gap-1.5">
                          <FaCircleCheck className="text-emerald-600 w-4 h-4" />
                          <span>Category Ready to Save to Live Storefront!</span>
                        </div>
                        <div>
                          <strong>Tab Button Name:</strong> {catShortLabel || catLabel || 'New Category'}
                        </div>
                        <div>
                          <strong>Full Category Title:</strong> {catLabel || catShortLabel || 'New Category'}
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row items-center gap-2.5">
                        <button
                          type="button"
                          onClick={() => setCatStep(2)}
                          className="w-full sm:w-auto px-4 py-3 rounded-2xl bg-white text-slate-700 border border-slate-300 font-extrabold text-xs cursor-pointer"
                        >
                          ← Back
                        </button>
                        <button
                          type="submit"
                          className="sim-btn-glow w-full flex-1 py-3.5 px-5 font-display font-bold text-xs sm:text-sm tracking-wider flex items-center justify-center gap-2 cursor-pointer"
                        >
                          <FaRocket className="w-4 h-4 text-amber-300" />
                          <span>
                            {editingCatId
                              ? 'SAVE UPDATED CATEGORY & ICON'
                              : 'CREATE NEW STORE CATEGORY'}
                          </span>
                        </button>
                      </div>
                    </div>
                  )}
                </form>
              </div>
            </div>

            {/* Right (5 Cols): Live Storefront Category Tab Preview */}
            <div className="lg:col-span-5 space-y-4">
              <div className="acrylic-frame rounded-[32px] p-3">
                <div className="bg-white/90 rounded-[24px] p-4 sm:p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-fuchsia-700 flex items-center gap-1">
                      <FaEye className="w-3 h-3" />
                      <span>LIVE CATEGORY TAB PREVIEW</span>
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-extrabold">
                      Step {catStep} of 3
                    </span>
                  </div>

                  {(() => {
                    const previewCatMeta: StoreCategoryMeta = {
                      id: editingCatId || 'preview_cat',
                      label: catLabel || 'Gaming, PUBG & Steam Keys',
                      shortLabel: catShortLabel || catLabel || 'Gaming & UC',
                      iconClass: 'fa-solid fa-layer-group',
                      iconColor: catIconColor,
                      iconType: catIconType,
                      customIconUrl: catCustomIconUrl.trim() || undefined
                    };
                    return (
                      <div className="space-y-3">
                        <div className="p-3.5 rounded-2xl bg-slate-100/90 border border-slate-200 space-y-2">
                          <div className="text-[10px] font-extrabold uppercase text-slate-500">
                            When Selected (Active Tab):
                          </div>
                          <div className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl font-extrabold text-xs bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-md">
                            {renderCategoryIcon(previewCatMeta.id, 'w-4 h-4 text-white', previewCatMeta)}
                            <span>{previewCatMeta.shortLabel}</span>
                            <span className="text-[10px] px-1.5 py-0.2 rounded-full font-extrabold bg-black/25 text-white">
                              12
                            </span>
                          </div>
                        </div>

                        <div className="p-3.5 rounded-2xl bg-slate-100/90 border border-slate-200 space-y-2">
                          <div className="text-[10px] font-extrabold uppercase text-slate-500">
                            When Unselected (Storefront Bar):
                          </div>
                          <div className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl font-bold text-xs bg-white text-slate-900 border border-slate-200 shadow-xs">
                            {renderCategoryIcon(
                              previewCatMeta.id,
                              `w-4 h-4 ${previewCatMeta.iconColor}`,
                              previewCatMeta
                            )}
                            <span>{previewCatMeta.shortLabel}</span>
                            <span className="text-[10px] px-1.5 py-0.2 rounded-full font-extrabold bg-slate-200 text-slate-800">
                              12
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              </div>
            </div>
          </div>

          {/* Manage All Store Categories List (Edit / Reorder / Delete) */}
          <div className="acrylic-frame rounded-[34px] p-3 sm:p-4">
            <div className="plush-pillow plush-about rounded-[26px] p-4 sm:p-6 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h4 className="text-base sm:text-lg font-extrabold text-slate-900">
                    All Storefront Categories ({activeCategories.length})
                  </h4>
                  <p className="text-xs font-semibold text-slate-600">
                    Edit any category name or icon, reorder tabs, or delete categories you don&apos;t need.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    playPopSound(540);
                    onUpdateSiteConfig((prev) => ({
                      ...prev,
                      categories: CATEGORY_META
                    }));
                    resetCategoryWizardForm();
                    showToast('Default Store Categories Restored!');
                  }}
                  className="px-3.5 py-2 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 text-xs font-extrabold cursor-pointer self-start sm:self-auto"
                >
                  Restore Default Categories
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                {activeCategories.map((cat, idx) => {
                  const count =
                    cat.id === 'all'
                      ? servicesCatalog.length
                      : servicesCatalog.filter((s) => s.category === cat.id).length;
                  const isHidden = Boolean(cat.hidden);
                  return (
                    <div
                      key={cat.id}
                      className={`p-3 sm:p-3.5 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-3 shadow-xs transition ${
                        isHidden
                          ? 'bg-slate-100/90 border-slate-300 opacity-75'
                          : 'bg-white/95 border-pink-100 hover:border-pink-400'
                      }`}
                    >
                      {/* Top Details (Full width on mobile) */}
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center flex-shrink-0 shadow-2xs overflow-hidden">
                          {renderCategoryIcon(cat.id, `w-5 h-5 ${cat.iconColor}`, cat)}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-1.5">
                            <span className="text-xs sm:text-sm font-extrabold text-slate-900 truncate">
                              {cat.shortLabel}
                            </span>
                            <span className="px-2 py-0.5 rounded-full bg-pink-50 text-pink-700 border border-pink-200 text-[10px] font-extrabold whitespace-nowrap">
                              {count} Products
                            </span>
                            {isHidden && (
                              <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-300 text-[10px] font-extrabold whitespace-nowrap">
                                🙈 HIDDEN
                              </span>
                            )}
                          </div>
                          <div className="text-[10px] sm:text-[11px] font-semibold text-slate-500 truncate mt-0.5">
                            {cat.label} • ID: <span className="font-mono-code">{cat.id}</span>
                          </div>
                        </div>
                      </div>

                      {/* Bottom Actions Toolbar on mobile, Right aligned on desktop */}
                      <div className="flex items-center justify-end sm:justify-start gap-1.5 flex-wrap sm:flex-nowrap pt-2 sm:pt-0 border-t border-slate-100 sm:border-0 w-full sm:w-auto">
                        {cat.id !== 'all' && (
                          <button
                            type="button"
                            onClick={() => toggleCategoryHidden(cat.id, cat.shortLabel)}
                            title={isHidden ? 'Unhide / Show Category on Storefront' : 'Hide Category from Storefront'}
                            className={`px-2.5 py-1.5 rounded-xl text-[11px] font-extrabold cursor-pointer flex items-center gap-1 border transition ${
                              isHidden
                                ? 'bg-amber-100 hover:bg-amber-200 text-amber-900 border-amber-300'
                                : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border-emerald-200'
                            }`}
                          >
                            {isHidden ? (
                              <>
                                <FaEyeSlash className="w-3 h-3" />
                                <span>Hidden</span>
                              </>
                            ) : (
                              <>
                                <FaEye className="w-3 h-3" />
                                <span>Visible</span>
                              </>
                            )}
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => handleMoveCategory(idx, -1)}
                          disabled={idx === 0}
                          title="Move Category Left / Up"
                          className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 disabled:opacity-40 text-slate-700 text-xs font-extrabold cursor-pointer"
                        >
                          ↑
                        </button>
                        <button
                          type="button"
                          onClick={() => handleMoveCategory(idx, 1)}
                          disabled={idx === activeCategories.length - 1}
                          title="Move Category Right / Down"
                          className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 disabled:opacity-40 text-slate-700 text-xs font-extrabold cursor-pointer"
                        >
                          ↓
                        </button>
                        <button
                          type="button"
                          onClick={() => startEditCategoryInWizard(cat)}
                          className="px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 text-xs font-extrabold cursor-pointer flex items-center gap-1"
                        >
                          <FaPenToSquare className="w-3 h-3" />
                          <span>Edit</span>
                        </button>
                        {cat.id !== 'all' && (
                          <button
                            type="button"
                            onClick={() => handleDeleteCategory(cat)}
                            title="Delete Category"
                            className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 text-xs font-extrabold cursor-pointer flex items-center justify-center"
                          >
                            <FaTrashCan className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================== SCREEN 1: 4-STEP PRODUCT / SERVICE WIZARD & CATALOG MANAGER ==================== */}
      {activeScreen === 'services' && hasScreenPermission('services') && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
            {/* Left (7 Cols): 4-Step Guided Product Wizard */}
            <div className="lg:col-span-7 acrylic-frame rounded-[34px] p-3 sm:p-4">
              <div className="plush-pillow plush-login rounded-[26px] p-4 sm:p-6 space-y-5">
                {/* Wizard Header */}
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-pink-200 pb-3.5">
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-pink-600">
                      {editingServiceId
                        ? '✏️ STEP-BY-STEP PRODUCT EDITOR'
                        : '➕ STEP-BY-STEP NEW PRODUCT WIZARD'}
                    </span>
                    <h3 className="text-base sm:text-xl font-extrabold text-slate-900">
                      {editingServiceId
                        ? `Editing: ${adminTitle || 'Service'}`
                        : 'Add New Product / Service Step by Step'}
                    </h3>
                  </div>
                  {editingServiceId && (
                    <button
                      type="button"
                      onClick={() => {
                        resetAdminForm();
                        setPlanRows(
                          parseTiersToPlanRows(
                            '1 Month Package — Rs. 500\n6 Months Package — Rs. 2,200\n1 Year Full Warranty — Rs. 3,800'
                          )
                        );
                        setProductStep(1);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-rose-100 hover:bg-rose-200 text-rose-800 text-xs font-extrabold cursor-pointer"
                    >
                      Cancel Edit / New
                    </button>
                  )}
                </div>

                {/* 4-Step Progress Bar */}
                <div className="grid grid-cols-4 gap-1.5">
                  {[
                    { step: 1 as const, label: '1. Info & Desc', short: '1. Info' },
                    { step: 2 as const, label: '2. Plans & Price', short: '2. Plans' },
                    { step: 3 as const, label: '3. Icon & Badge', short: '3. Icon' },
                    { step: 4 as const, label: '4. Publish', short: '4. Save' }
                  ].map((s) => {
                    const isCurrent = productStep === s.step;
                    const isDone = productStep > s.step;
                    return (
                      <button
                        key={s.step}
                        type="button"
                        onClick={() => {
                          playPopSound(620);
                          setProductStep(s.step);
                        }}
                        className={`py-2 px-2 rounded-xl text-[10px] sm:text-xs font-extrabold transition cursor-pointer flex items-center justify-center gap-1 border ${
                          isCurrent
                            ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white border-white shadow-md scale-[1.02]'
                            : isDone
                            ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                            : 'bg-white/80 text-slate-700 border-pink-200 hover:bg-white'
                        }`}
                      >
                        {isDone && <FaCheck className="w-2.5 h-2.5 text-emerald-600" />}
                        <span className="hidden sm:inline truncate">{s.label}</span>
                        <span className="sm:hidden truncate">{s.short}</span>
                      </button>
                    );
                  })}
                </div>

                <form onSubmit={handleSaveAdminService} className="space-y-4">
                  {/* STEP 1: BASIC INFO, CATEGORY & DESCRIPTION */}
                  {productStep === 1 && (
                    <div className="space-y-4">
                      <div className="p-3 rounded-2xl bg-white/80 border border-pink-200 flex flex-wrap items-center justify-between gap-2">
                        <span className="text-[11px] font-extrabold text-slate-700">
                          Quick Auto-Fill Template:
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          <button
                            type="button"
                            onClick={() => {
                              playPopSound(680);
                              setAdminTitle('CapCut Pro Private 2026');
                              setAdminCategory('capcut_ai');
                              setAdminBadge('🔥 BESTSELLER');
                              setAdminDesc(
                                '100% Private Account • Works on Mobile, PC & Mac with Full Warranty.'
                              );
                              const rows = [
                                { name: '1 Month Private Pro', price: '500' },
                                { name: '6 Months Private Pro', price: '2,200' },
                                { name: '1 Year Full Warranty', price: '3,800' }
                              ];
                              syncPlanRowsToTiers(rows);
                            }}
                            className="px-2.5 py-1 rounded-lg bg-purple-100 hover:bg-purple-200 text-purple-800 text-[10px] font-extrabold cursor-pointer"
                          >
                            + AI / Pro App
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              playPopSound(680);
                              setAdminTitle('TikTok UK Monetizable Account');
                              setAdminCategory('tiktok_fb');
                              setAdminBadge('🇬🇧 UK OFFICIAL');
                              setAdminDesc(
                                'Creator Rewards Program Eligible • No VPN Needed • Instant Delivery.'
                              );
                              const rows = [
                                { name: 'Fresh TikTok UK Account', price: '1,200' },
                                { name: '10k Followers Monetized UK', price: '8,500' }
                              ];
                              syncPlanRowsToTiers(rows);
                            }}
                            className="px-2.5 py-1 rounded-lg bg-pink-100 hover:bg-pink-200 text-pink-800 text-[10px] font-extrabold cursor-pointer"
                          >
                            + TikTok / SMM
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              playPopSound(680);
                              setAdminTitle('Fresh 2026 SIM Owner & CDR Report');
                              setAdminCategory('franchise_sim');
                              setAdminBadge('📡 LIVE DATABASE');
                              setAdminDesc(
                                'Verified Franchise SIM Ownership, CNIC, Active Numbers & Call History.'
                              );
                              const rows = [
                                { name: 'Fresh SIM Ownership Check', price: '350' },
                                { name: 'Complete 3-Month CDR Call History', price: '2,500' }
                              ];
                              syncPlanRowsToTiers(rows);
                            }}
                            className="px-2.5 py-1 rounded-lg bg-emerald-100 hover:bg-emerald-200 text-emerald-800 text-[10px] font-extrabold cursor-pointer"
                          >
                            + SIM / NADRA
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-extrabold text-slate-900 mb-1">
                          1. Product / Service Name *
                        </label>
                        <input
                          type="text"
                          value={adminTitle}
                          onChange={(e) => setAdminTitle(e.target.value)}
                          required
                          placeholder="e.g. ChatGPT Plus Shared / Private or TikTok Followers"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-white border-2 border-pink-300 font-bold text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-pink-500"
                        />
                      </div>

                      <div>
                        <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                          <label className="block text-xs font-extrabold text-slate-900">
                            2. Choose Store Category *
                          </label>
                          <button
                            type="button"
                            onClick={() => openSettingsScreen('categories', 1)}
                            className="px-2.5 py-1 rounded-lg bg-fuchsia-100 hover:bg-fuchsia-200 text-fuchsia-800 text-[10px] font-extrabold cursor-pointer flex items-center gap-1"
                          >
                            <FaPlus className="w-2.5 h-2.5" />
                            <span>Add / Edit Categories &amp; Icons</span>
                          </button>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {activeCategories
                            .filter((c) => c.id !== 'all')
                            .map((cat) => {
                              const isSelected = adminCategory === cat.id;
                              return (
                                <button
                                  key={cat.id}
                                  type="button"
                                  onClick={() => {
                                    playPopSound(600);
                                    setAdminCategory(cat.id as Exclude<CategoryId, 'all'>);
                                  }}
                                  className={`p-2.5 rounded-xl border-2 text-left flex items-center gap-2.5 transition cursor-pointer ${
                                    isSelected
                                      ? 'bg-pink-50 border-pink-500 text-slate-900 shadow-xs'
                                      : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
                                  }`}
                                >
                                  <span className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0 overflow-hidden">
                                    {renderCategoryIcon(cat.id, `w-4 h-4 ${cat.iconColor}`, cat)}
                                  </span>
                                  <div className="min-w-0">
                                    <div className="text-xs font-extrabold truncate">
                                      {cat.shortLabel}
                                    </div>
                                    <div className="text-[10px] text-slate-500 truncate">
                                      {cat.label}
                                    </div>
                                  </div>
                                </button>
                              );
                            })}
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-extrabold text-slate-900 mb-1">
                          3. Short Service Description (Warranty, Speed, Features) *
                        </label>
                        <textarea
                          rows={3}
                          value={adminDesc}
                          onChange={(e) => setAdminDesc(e.target.value)}
                          required
                          placeholder="e.g. Instant activation on your email or WhatsApp with 100% replacement warranty..."
                          className="w-full p-3 rounded-xl bg-white border-2 border-pink-300 font-semibold text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-pink-500"
                        />
                      </div>

                      <div className="flex justify-end pt-2">
                        <button
                          type="button"
                          onClick={() => {
                            if (!adminTitle.trim()) {
                              showToast('Please enter a Product Name first!');
                              return;
                            }
                            playPopSound(700);
                            setProductStep(2);
                          }}
                          className="px-5 py-3 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-600 text-white font-extrabold text-xs sm:text-sm shadow-lg flex items-center gap-2 cursor-pointer"
                        >
                          <span>Next Step: Plans &amp; Prices</span>
                          <FaChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* STEP 2: INTERACTIVE PRICING PLANS & CUSTOMER CHECKOUT INPUT */}
                  {productStep === 2 && (
                    <div className="space-y-4">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div>
                          <label className="block text-xs font-extrabold text-slate-900">
                            Add Pricing Plans &amp; Packages (Step-by-Step) *
                          </label>
                          <p className="text-[11px] font-semibold text-slate-600">
                            Add each plan name and its Rs. price below. Customers will choose from these in a dropdown!
                          </p>
                        </div>

                        <div className="flex items-center gap-1 bg-white rounded-xl p-1 border border-pink-200">
                          <button
                            type="button"
                            onClick={() => {
                              setPlanRows(parseTiersToPlanRows(adminTiersText));
                              setPlanBuilderMode('visual');
                            }}
                            className={`px-2.5 py-1 rounded-lg text-[10px] font-extrabold cursor-pointer ${
                              planBuilderMode === 'visual'
                                ? 'bg-pink-500 text-white'
                                : 'text-slate-700'
                            }`}
                          >
                            Step Builder
                          </button>
                          <button
                            type="button"
                            onClick={() => setPlanBuilderMode('raw')}
                            className={`px-2.5 py-1 rounded-lg text-[10px] font-extrabold cursor-pointer ${
                              planBuilderMode === 'raw'
                                ? 'bg-pink-500 text-white'
                                : 'text-slate-700'
                            }`}
                          >
                            Text Lines
                          </button>
                        </div>
                      </div>

                      {planBuilderMode === 'visual' ? (
                        <div className="space-y-2.5">
                          {planRows.map((row, idx) => (
                            <div
                              key={idx}
                              className="p-2.5 rounded-2xl bg-white/95 border border-pink-200 flex flex-col sm:flex-row items-stretch sm:items-center gap-2 shadow-2xs"
                            >
                              <div className="flex items-center gap-2 flex-1">
                                <span className="w-6 h-6 rounded-full bg-pink-100 text-pink-700 text-[10px] font-extrabold flex items-center justify-center flex-shrink-0">
                                  #{idx + 1}
                                </span>
                                <input
                                  type="text"
                                  value={row.name}
                                  onChange={(e) => {
                                    const next = planRows.map((r, i) =>
                                      i === idx ? { ...r, name: e.target.value } : r
                                    );
                                    syncPlanRowsToTiers(next);
                                  }}
                                  placeholder="Plan Name (e.g. 1 Month Package)"
                                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 font-bold text-xs text-slate-900 focus:outline-none focus:border-pink-500"
                                />
                              </div>

                              <div className="flex items-center gap-2">
                                <div className="flex items-center bg-emerald-50 border border-emerald-300 rounded-xl px-2.5 py-1.5 sm:w-36">
                                  <span className="text-[11px] font-extrabold text-emerald-700 mr-1">
                                    Rs.
                                  </span>
                                  <input
                                    type="text"
                                    value={row.price}
                                    onChange={(e) => {
                                      const next = planRows.map((r, i) =>
                                        i === idx ? { ...r, price: e.target.value } : r
                                      );
                                      syncPlanRowsToTiers(next);
                                    }}
                                    placeholder="500"
                                    className="w-full bg-transparent border-none outline-none font-display font-bold text-xs sm:text-sm text-slate-900"
                                  />
                                </div>

                                {planRows.length > 1 && (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      playPopSound(460);
                                      const next = planRows.filter((_, i) => i !== idx);
                                      syncPlanRowsToTiers(next);
                                    }}
                                    className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 cursor-pointer"
                                    title="Remove Plan"
                                  >
                                    <FaTrashCan className="w-3.5 h-3.5" />
                                  </button>
                                )}
                              </div>
                            </div>
                          ))}

                          <button
                            type="button"
                            onClick={() => {
                              playPopSound(680);
                              syncPlanRowsToTiers([
                                ...planRows,
                                { name: `${planRows.length + 1} Months Package`, price: '1,500' }
                              ]);
                            }}
                            className="w-full py-2.5 rounded-2xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border-2 border-dashed border-emerald-300 text-xs font-extrabold flex items-center justify-center gap-1.5 cursor-pointer transition"
                          >
                            <FaPlus className="w-3.5 h-3.5" />
                            <span>+ Add Another Plan / Price Tier</span>
                          </button>
                        </div>
                      ) : (
                        <div>
                          <textarea
                            rows={4}
                            value={adminTiersText}
                            onChange={(e) => {
                              setAdminTiersText(e.target.value);
                              setPlanRows(parseTiersToPlanRows(e.target.value));
                            }}
                            placeholder="1 Month Package — Rs. 500&#10;6 Months Package — Rs. 2,200"
                            className="w-full p-3 rounded-xl bg-white border-2 border-pink-300 font-mono-code font-bold text-xs text-slate-900 focus:outline-none"
                          />
                        </div>
                      )}

                      {/* Customer Checkout Input Label & Placeholder */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-pink-200/70">
                        <div>
                          <label className="block text-[11px] font-extrabold text-slate-800 mb-1">
                            Customer Checkout Question Label
                          </label>
                          <input
                            type="text"
                            value={adminInputLabel}
                            onChange={(e) => setAdminInputLabel(e.target.value)}
                            placeholder="Enter Your WhatsApp Number or Email:"
                            className="w-full px-3 py-2 rounded-xl bg-white border border-pink-300 font-bold text-xs text-slate-900"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-extrabold text-slate-800 mb-1">
                            Input Box Placeholder
                          </label>
                          <input
                            type="text"
                            value={adminPlaceholder}
                            onChange={(e) => setAdminPlaceholder(e.target.value)}
                            placeholder="0300-1234567 or email@gmail.com"
                            className="w-full px-3 py-2 rounded-xl bg-white border border-pink-300 font-bold text-xs text-slate-900"
                          />
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-2">
                        <button
                          type="button"
                          onClick={() => setProductStep(1)}
                          className="px-4 py-2.5 rounded-xl bg-white text-slate-700 border border-slate-300 font-extrabold text-xs cursor-pointer"
                        >
                          ← Back to Info
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            playPopSound(700);
                            setProductStep(3);
                          }}
                          className="px-5 py-3 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-600 text-white font-extrabold text-xs sm:text-sm shadow-lg flex items-center gap-2 cursor-pointer"
                        >
                          <span>Next Step: Icon &amp; Style</span>
                          <FaChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* STEP 3: ICON, BADGE & VISUAL CARD THEME */}
                  {productStep === 3 && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-extrabold text-slate-900 mb-1">
                          1. Top Promo Badge Text
                        </label>
                        <input
                          type="text"
                          value={adminBadge}
                          onChange={(e) => setAdminBadge(e.target.value)}
                          placeholder="🔥 HOT SERVICE"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-white border-2 border-pink-300 font-bold text-xs sm:text-sm text-slate-900"
                        />
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {[
                            '🔥 BESTSELLER',
                            '⚡ INSTANT DELIVERY',
                            '👑 100% WARRANTY',
                            '🇬🇧 UK OFFICIAL',
                            '📡 LIVE DATABASE',
                            '💎 VIP PRO'
                          ].map((b) => (
                            <button
                              key={b}
                              type="button"
                              onClick={() => {
                                playPopSound(600);
                                setAdminBadge(b);
                              }}
                              className="px-2.5 py-1 rounded-full bg-white hover:bg-pink-50 text-slate-800 border border-pink-200 text-[10px] font-extrabold cursor-pointer"
                            >
                              {b}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-extrabold text-slate-900 mb-1.5">
                          2. Choose Product Icon (50+ 3D Icons, Upload Logo, or Paste Link)
                        </label>
                        {renderVisualIconStudio(
                          adminIconType,
                          setAdminIconType,
                          adminCustomIconUrl,
                          setAdminCustomIconUrl,
                          adminDirectToolUrl
                        )}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] font-extrabold text-slate-800 mb-1">
                            3. 3D Card Color Style
                          </label>
                          <select
                            value={adminPlush}
                            onChange={(e) => setAdminPlush(e.target.value)}
                            className="w-full px-3 py-2.5 rounded-xl bg-white border-2 border-pink-300 font-bold text-xs text-slate-900"
                          >
                            {plushOptions.map((p) => (
                              <option key={p.value} value={p.value}>
                                {p.label}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-[11px] font-extrabold text-slate-800 mb-1">
                            4. Direct Tool / Website Link (Optional)
                          </label>
                          <input
                            type="text"
                            value={adminDirectToolUrl}
                            onChange={(e) => setAdminDirectToolUrl(e.target.value)}
                            placeholder="https://... (adds Launch button)"
                            className="w-full px-3 py-2.5 rounded-xl bg-white border border-pink-300 font-mono-code text-xs text-slate-900"
                          />
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-2">
                        <button
                          type="button"
                          onClick={() => setProductStep(2)}
                          className="px-4 py-2.5 rounded-xl bg-white text-slate-700 border border-slate-300 font-extrabold text-xs cursor-pointer"
                        >
                          ← Back to Plans
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            playPopSound(740);
                            setProductStep(4);
                          }}
                          className="px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-extrabold text-xs sm:text-sm shadow-lg flex items-center gap-2 cursor-pointer"
                        >
                          <span>Final Step: Review &amp; Publish</span>
                          <FaChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* STEP 4: FINAL REVIEW & 1-CLICK PUBLISH */}
                  {productStep === 4 && (
                    <div className="space-y-4">
                      <div className="p-4 rounded-2xl bg-emerald-50 border-2 border-emerald-300 space-y-2">
                        <div className="flex items-center gap-2 text-emerald-900 font-extrabold text-xs sm:text-sm">
                          <FaCircleCheck className="text-emerald-600 w-4 h-4" />
                          <span>Ready to Publish to Live Storefront!</span>
                        </div>
                        <div className="text-xs font-semibold text-slate-700 space-y-1">
                          <div>
                            <strong>Title:</strong> {adminTitle || 'Untitled Service'} (
                            {adminCategory})
                          </div>
                          <div>
                            <strong>Badge:</strong> {adminBadge}
                          </div>
                          <div>
                            <strong>Plans ({planRows.length}):</strong>{' '}
                            {adminTiersText.split('\n').filter(Boolean).join(' • ')}
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row items-center gap-2.5">
                        <button
                          type="button"
                          onClick={() => setProductStep(3)}
                          className="w-full sm:w-auto px-4 py-3 rounded-2xl bg-white text-slate-700 border border-slate-300 font-extrabold text-xs cursor-pointer"
                        >
                          ← Back
                        </button>
                        <button
                          type="submit"
                          onClick={() => setTimeout(() => setProductStep(1), 250)}
                          className="sim-btn-glow w-full flex-1 py-3.5 px-5 font-display font-bold text-xs sm:text-sm tracking-wider flex items-center justify-center gap-2 cursor-pointer"
                        >
                          <FaRocket className="w-4 h-4 text-amber-300" />
                          <span>
                            {editingServiceId
                              ? 'SAVE UPDATED PRODUCT TO STORE'
                              : 'PUBLISH NEW PRODUCT TO STOREFRONT'}
                          </span>
                        </button>
                      </div>
                    </div>
                  )}
                </form>
              </div>
            </div>

            {/* Right (5 Cols): Always-Live 3D Service Card Preview */}
            <div className="lg:col-span-5 space-y-4">
              <div className="acrylic-frame rounded-[32px] p-3">
                <div className="bg-white/85 rounded-[24px] p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-purple-700 flex items-center gap-1">
                      <FaEye className="w-3 h-3" />
                      <span>LIVE 3D PRODUCT CARD PREVIEW</span>
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-extrabold">
                      Step {productStep} of 4
                    </span>
                  </div>

                  {(() => {
                    const previewPlushObj =
                      plushOptions.find((p) => p.value === adminPlush) || plushOptions[0];
                    const previewTiers = adminTiersText
                      .split('\n')
                      .map((l) => l.trim())
                      .filter(Boolean);
                    return (
                      <div className="acrylic-frame rounded-[28px] p-2">
                        <div
                          className={`plush-pillow ${previewPlushObj.value} rounded-[22px] p-4 flex flex-col justify-between space-y-4`}
                        >
                          <div className="space-y-2.5">
                            <div className="flex items-center justify-between gap-2">
                              <div
                                className={`fluffy-orb w-12 h-12 bg-gradient-to-br ${previewPlushObj.orb} flex items-center justify-center border-2 border-white shadow-md overflow-hidden`}
                              >
                                {renderOrbVisual(adminIconType, adminCustomIconUrl, adminTitle)}
                              </div>
                              <span className="px-2.5 py-1 rounded-full bg-white/90 border border-white text-[10px] font-extrabold text-slate-900 shadow-xs">
                                {adminBadge || '🔥 HOT SERVICE'}
                              </span>
                            </div>
                            <div>
                              <h4 className="text-base font-extrabold text-slate-900">
                                {adminTitle || 'Your New Product Title'}
                              </h4>
                              <p className="text-xs font-medium text-slate-700 mt-1">
                                {adminDesc ||
                                  'Instant activation & 100% full replacement warranty via WhatsApp.'}
                              </p>
                            </div>
                          </div>

                          <div className="space-y-2 pt-2 border-t border-slate-900/10">
                            <select className="w-full px-2.5 py-2 rounded-xl bg-white/90 border border-white text-xs font-extrabold text-slate-900">
                              {(previewTiers.length > 0
                                ? previewTiers
                                : ['1 Month Package — Rs. 500']
                              ).map((t, i) => (
                                <option key={i}>{t}</option>
                              ))}
                            </select>
                            <div className="py-2 px-3 rounded-xl bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 text-white font-extrabold text-xs text-center shadow flex items-center justify-center gap-1.5">
                              <SiWhatsapp className="w-3.5 h-3.5" /> Buy Now (Live Preview)
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              </div>
            </div>
          </div>

          {/* Searchable Store Products Catalog List */}
          <div className="acrylic-frame rounded-[34px] p-3 sm:p-4">
            <div className="plush-pillow plush-about rounded-[26px] p-4 sm:p-6 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h4 className="text-base sm:text-lg font-extrabold text-slate-900">
                    Manage All Store Products ({adminFilteredCatalog.length} • {hiddenServicesCount} Hidden)
                  </h4>
                  <p className="text-xs font-semibold text-slate-600">
                    Tap <strong>Visible / Hidden</strong> to hide or show any product on the storefront without deleting it!
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <input
                    type="text"
                    value={adminSearchFilter}
                    onChange={(e) => setAdminSearchFilter(e.target.value)}
                    placeholder="Search products..."
                    className="px-3.5 py-2 rounded-2xl bg-white border-2 border-pink-200 text-xs font-bold text-slate-900 focus:outline-none focus:border-pink-500 sm:w-52"
                  />
                  {setAllServicesHidden && (
                    <>
                      <button
                        type="button"
                        onClick={() => setAllServicesHidden(false)}
                        className="px-2.5 py-2 rounded-xl bg-emerald-100 hover:bg-emerald-200 text-emerald-900 text-xs font-extrabold cursor-pointer"
                      >
                        👁️ Show All
                      </button>
                      <button
                        type="button"
                        onClick={() => setAllServicesHidden(true)}
                        className="px-2.5 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-extrabold cursor-pointer"
                      >
                        🙈 Hide All
                      </button>
                    </>
                  )}
                  <button
                    type="button"
                    onClick={resetCatalogToDefault}
                    className="px-3 py-2 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 text-xs font-extrabold cursor-pointer"
                  >
                    Restore Defaults
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 max-h-[460px] overflow-y-auto pr-1">
                {adminFilteredCatalog.map((srv) => {
                  const isHidden = Boolean(srv.hidden);
                  return (
                    <div
                      key={srv.id}
                      className={`p-3.5 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-3 shadow-xs transition ${
                        isHidden
                          ? 'bg-slate-100/90 border-slate-300 opacity-75'
                          : 'bg-white/90 border-pink-100 hover:border-pink-400'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <div
                          className={`w-10 h-10 rounded-xl bg-gradient-to-br ${srv.orbGrad} text-white flex items-center justify-center flex-shrink-0 shadow overflow-hidden`}
                        >
                          {renderOrbVisual(srv.iconType, srv.customIconUrl, `${srv.id} ${srv.title}`)}
                        </div>
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-1">
                            <span className="px-2 py-0.5 rounded-md bg-pink-50 text-pink-700 text-[9px] font-extrabold border border-pink-200">
                              {srv.badge}
                            </span>
                            {isHidden && (
                              <span className="px-2 py-0.5 rounded-md bg-rose-100 text-rose-800 text-[9px] font-extrabold border border-rose-300">
                                🙈 HIDDEN FROM STORE
                              </span>
                            )}
                          </div>
                          <div className="text-xs sm:text-sm font-extrabold text-slate-900 truncate mt-0.5">
                            {srv.title}
                          </div>
                          <div className="text-[10px] font-bold text-slate-500 truncate">
                            {(srv.tiers || []).length} Plans • {formatTierToString(srv.tiers?.[0])}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-end sm:justify-start gap-1.5 flex-wrap sm:flex-nowrap pt-2 sm:pt-0 border-t border-slate-100 sm:border-0 w-full sm:w-auto">
                        {toggleServiceHidden && (
                          <button
                            type="button"
                            onClick={() => toggleServiceHidden(srv.id)}
                            title={isHidden ? 'Click to Show on Storefront' : 'Click to Hide from Storefront'}
                            className={`px-2.5 py-1.5 rounded-xl text-[11px] font-extrabold cursor-pointer flex items-center gap-1 border transition ${
                              isHidden
                                ? 'bg-amber-100 hover:bg-amber-200 text-amber-900 border-amber-300'
                                : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border-emerald-200'
                            }`}
                          >
                            {isHidden ? (
                              <>
                                <FaEyeSlash className="w-3 h-3" />
                                <span>Hidden</span>
                              </>
                            ) : (
                              <>
                                <FaEye className="w-3 h-3" />
                                <span>Visible</span>
                              </>
                            )}
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => handleEditServiceInWizard(srv)}
                          className="px-2.5 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 text-xs font-extrabold cursor-pointer flex items-center gap-1"
                        >
                          <FaPenToSquare className="w-3 h-3" />
                          <span>Edit</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteService(srv.id, srv.title)}
                          className="px-2.5 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 text-xs font-extrabold cursor-pointer"
                        >
                          <FaTrashCan className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================== SCREEN 2: 4-STEP LIVE WEB TOOL WIZARD & MANAGER ==================== */}
      {activeScreen === 'tools' && hasScreenPermission('tools') && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
            {/* Left (7 Cols): 4-Step Web Tool Wizard */}
            <div className="lg:col-span-7 acrylic-frame rounded-[34px] p-3 sm:p-4">
              <div className="plush-pillow plush-capcut rounded-[26px] p-4 sm:p-6 space-y-5">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-indigo-200 pb-3.5">
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-700">
                      {editingToolId
                        ? '✏️ STEP-BY-STEP WEB TOOL EDITOR'
                        : '➕ STEP-BY-STEP NEW WEB TOOL WIZARD'}
                    </span>
                    <h3 className="text-base sm:text-xl font-extrabold text-slate-900">
                      {editingToolId
                        ? `Editing Tool: ${toolTitle}`
                        : 'Add New Live Web Tool Step by Step'}
                    </h3>
                  </div>
                  {editingToolId && (
                    <button
                      type="button"
                      onClick={() => {
                        resetToolForm();
                        setToolStep(1);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-rose-100 text-rose-800 text-xs font-extrabold cursor-pointer"
                    >
                      Cancel Edit
                    </button>
                  )}
                </div>

                {/* 4-Step Progress Pills */}
                <div className="grid grid-cols-4 gap-1.5">
                  {[
                    { step: 1 as const, label: '1. Tool Info', short: '1. Info' },
                    { step: 2 as const, label: '2. URL & Mode', short: '2. URL' },
                    { step: 3 as const, label: '3. Icon & Style', short: '3. Icon' },
                    { step: 4 as const, label: '4. Publish', short: '4. Save' }
                  ].map((s) => {
                    const isCurr = toolStep === s.step;
                    const isDone = toolStep > s.step;
                    return (
                      <button
                        key={s.step}
                        type="button"
                        onClick={() => {
                          playPopSound(620);
                          setToolStep(s.step);
                        }}
                        className={`py-2 px-2 rounded-xl text-[10px] sm:text-xs font-extrabold transition cursor-pointer flex items-center justify-center gap-1 border ${
                          isCurr
                            ? 'bg-gradient-to-r from-indigo-600 to-pink-500 text-white border-white shadow-md'
                            : isDone
                            ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                            : 'bg-white/80 text-slate-700 border-indigo-200'
                        }`}
                      >
                        {isDone && <FaCheck className="w-2.5 h-2.5 text-emerald-600" />}
                        <span className="hidden sm:inline truncate">{s.label}</span>
                        <span className="sm:hidden truncate">{s.short}</span>
                      </button>
                    );
                  })}
                </div>

                <form onSubmit={handleSaveAdminTool} className="space-y-4">
                  {toolStep === 1 && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-extrabold text-slate-900 mb-1">
                          1. Web Tool Name / Title *
                        </label>
                        <input
                          type="text"
                          value={toolTitle}
                          onChange={(e) => setToolTitle(e.target.value)}
                          required
                          placeholder="e.g. TikTok HD Downloader or Temp Mail Generator"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-white border-2 border-indigo-300 font-bold text-xs sm:text-sm text-slate-900"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-extrabold text-slate-900 mb-1">
                          2. Tool Description *
                        </label>
                        <textarea
                          rows={3}
                          value={toolDesc}
                          onChange={(e) => setToolDesc(e.target.value)}
                          required
                          placeholder="Describe what users can do with this live web tool..."
                          className="w-full p-3 rounded-xl bg-white border-2 border-indigo-300 font-semibold text-xs sm:text-sm text-slate-900"
                        />
                      </div>

                      <div className="flex justify-end pt-2">
                        <button
                          type="button"
                          onClick={() => {
                            if (!toolTitle.trim()) {
                              showToast('Please enter a Tool Name first!');
                              return;
                            }
                            playPopSound(700);
                            setToolStep(2);
                          }}
                          className="px-5 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-pink-500 text-white font-extrabold text-xs sm:text-sm shadow-lg flex items-center gap-2 cursor-pointer"
                        >
                          <span>Next Step: Link &amp; Launch Mode</span>
                          <FaChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  )}

                  {toolStep === 2 && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-extrabold text-slate-900 mb-1">
                          1. Tool Website URL / Link *
                        </label>
                        <input
                          type="text"
                          value={toolUrl}
                          onChange={(e) => setToolUrl(e.target.value)}
                          required
                          placeholder="https://example.com"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-white border-2 border-indigo-300 font-mono-code font-bold text-xs sm:text-sm text-slate-900"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-extrabold text-slate-900 mb-1">
                            2. Launch Button Label
                          </label>
                          <input
                            type="text"
                            value={toolButtonLabel}
                            onChange={(e) => setToolButtonLabel(e.target.value)}
                            placeholder="Open Live Tool"
                            className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-indigo-300 font-bold text-xs text-slate-900"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-extrabold text-slate-900 mb-1">
                            3. How Should This Tool Open?
                          </label>
                          <select
                            value={toolOpenMode}
                            onChange={(e) =>
                              setToolOpenMode(
                                e.target.value as 'new_tab' | 'embed_modal' | 'sim_tab'
                              )
                            }
                            className="w-full px-3 py-2.5 rounded-xl bg-white border border-indigo-300 font-bold text-xs text-slate-900"
                          >
                            <option value="new_tab">🌐 Open in New Browser Tab</option>
                            <option value="embed_modal">🖼️ Open Inside 3D Popup Viewer</option>
                            <option value="sim_tab">📡 Open SIM &amp; CNIC Tracker</option>
                          </select>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-2">
                        <button
                          type="button"
                          onClick={() => setToolStep(1)}
                          className="px-4 py-2.5 rounded-xl bg-white text-slate-700 border border-slate-300 font-extrabold text-xs cursor-pointer"
                        >
                          ← Back
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (!toolUrl.trim()) {
                              showToast('Please enter the Tool URL first!');
                              return;
                            }
                            playPopSound(700);
                            setToolStep(3);
                          }}
                          className="px-5 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-pink-500 text-white font-extrabold text-xs sm:text-sm shadow-lg flex items-center gap-2 cursor-pointer"
                        >
                          <span>Next Step: Icon &amp; Badge</span>
                          <FaChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  )}

                  {toolStep === 3 && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-extrabold text-slate-900 mb-1.5">
                          1. Choose Tool Icon (50+ 3D Icons, Auto-Grab Website Logo, or Upload PNG/SVG)
                        </label>
                        {renderVisualIconStudio(
                          toolIconType,
                          setToolIconType,
                          toolIconUrl,
                          setToolIconUrl,
                          toolUrl
                        )}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-extrabold text-slate-900 mb-1">
                            2. Top Badge Text
                          </label>
                          <input
                            type="text"
                            value={toolBadge}
                            onChange={(e) => setToolBadge(e.target.value)}
                            placeholder="⚡ LIVE WEB TOOL"
                            className="w-full px-3 py-2 rounded-xl bg-white border border-indigo-300 font-bold text-xs text-slate-900"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-extrabold text-slate-900 mb-1">
                            3. 3D Card Theme
                          </label>
                          <select
                            value={toolPlush}
                            onChange={(e) => setToolPlush(e.target.value)}
                            className="w-full px-3 py-2 rounded-xl bg-white border border-indigo-300 font-bold text-xs text-slate-900"
                          >
                            {plushOptions.map((p) => (
                              <option key={p.value} value={p.value}>
                                {p.label}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-2">
                        <button
                          type="button"
                          onClick={() => setToolStep(2)}
                          className="px-4 py-2.5 rounded-xl bg-white text-slate-700 border border-slate-300 font-extrabold text-xs cursor-pointer"
                        >
                          ← Back
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            playPopSound(740);
                            setToolStep(4);
                          }}
                          className="px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-extrabold text-xs sm:text-sm shadow-lg flex items-center gap-2 cursor-pointer"
                        >
                          <span>Final Step: Preview &amp; Publish</span>
                          <FaChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  )}

                  {toolStep === 4 && (
                    <div className="space-y-4">
                      <div className="p-4 rounded-2xl bg-emerald-50 border-2 border-emerald-300 space-y-1.5 text-xs">
                        <div className="font-extrabold text-emerald-900 flex items-center gap-1.5">
                          <FaCircleCheck className="text-emerald-600" />
                          <span>Web Tool Ready to Publish!</span>
                        </div>
                        <div>
                          <strong>Tool Name:</strong> {toolTitle || 'Untitled Tool'}
                        </div>
                        <div>
                          <strong>Target Link:</strong> {toolUrl || 'https://...'}
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row items-center gap-2.5">
                        <button
                          type="button"
                          onClick={() => setToolStep(3)}
                          className="w-full sm:w-auto px-4 py-3 rounded-2xl bg-white text-slate-700 border border-slate-300 font-extrabold text-xs cursor-pointer"
                        >
                          ← Back
                        </button>
                        <button
                          type="submit"
                          onClick={() => setTimeout(() => setToolStep(1), 250)}
                          className="sim-btn-glow w-full flex-1 py-3.5 px-5 font-display font-bold text-xs sm:text-sm tracking-wider flex items-center justify-center gap-2 cursor-pointer"
                        >
                          <FaRocket className="w-4 h-4 text-amber-300" />
                          <span>
                            {editingToolId
                              ? 'SAVE UPDATED WEB TOOL'
                              : 'PUBLISH NEW WEB TOOL TO WEBSITE'}
                          </span>
                        </button>
                      </div>
                    </div>
                  )}
                </form>
              </div>
            </div>

            {/* Right (5 Cols): Live 3D Tool Card Preview */}
            <div className="lg:col-span-5 space-y-4">
              <div className="acrylic-frame rounded-[32px] p-3">
                <div className="bg-white/85 rounded-[24px] p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-700">
                      LIVE 3D WEB TOOL PREVIEW
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-extrabold">
                      Step {toolStep} of 4
                    </span>
                  </div>

                  {(() => {
                    const previewPlushObj =
                      plushOptions.find((p) => p.value === toolPlush) || plushOptions[1];
                    return (
                      <div className="acrylic-frame rounded-[26px] p-2">
                        <div
                          className={`plush-pillow ${previewPlushObj.value} rounded-[20px] p-4 flex flex-col justify-between space-y-3.5`}
                        >
                          <div className="space-y-2">
                            <div className="flex items-start justify-between gap-2">
                              <div
                                className={`fluffy-orb w-12 h-12 bg-gradient-to-br ${previewPlushObj.orb} flex items-center justify-center border-2 border-white shadow-md overflow-hidden`}
                              >
                                {renderOrbVisual(toolIconType, toolIconUrl, toolTitle)}
                              </div>
                              <span className="px-2.5 py-1 rounded-full bg-white/90 border border-white text-[10px] font-extrabold text-slate-900 shadow-xs">
                                {toolBadge || '⚡ LIVE WEB TOOL'}
                              </span>
                            </div>
                            <h4 className="text-base font-extrabold text-slate-900">
                              {toolTitle || 'Your New Tool Name'}
                            </h4>
                            <p className="text-xs font-medium text-slate-700">
                              {toolDesc ||
                                'Instant online digital utility powered by Sohaib.'}
                            </p>
                          </div>

                          <div className="pt-2 border-t border-slate-900/10 space-y-2">
                            <div className="text-[10px] font-mono-code font-bold text-indigo-700 truncate bg-white/80 px-2.5 py-1 rounded-lg border border-white">
                              {toolUrl || 'https://your-tool-link.com'}
                            </div>
                            <div className="py-2.5 px-3 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 text-white font-extrabold text-xs text-center shadow">
                              {toolButtonLabel || 'Open Live Tool'}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              </div>
            </div>
          </div>

          {/* Manage All Web Tools List */}
          <div className="acrylic-frame rounded-[34px] p-3 sm:p-4">
            <div className="plush-pillow plush-about rounded-[26px] p-4 sm:p-6 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h4 className="text-base sm:text-lg font-extrabold text-slate-900">
                    Manage All Live Web Tools ({adminFilteredTools.length} • {hiddenToolsCount} Hidden)
                  </h4>
                  <p className="text-xs font-semibold text-slate-600">
                    Tap <strong>Visible / Hidden</strong> to hide or show any web tool without deleting it!
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <input
                    type="text"
                    value={toolSearchFilter}
                    onChange={(e) => setToolSearchFilter(e.target.value)}
                    placeholder="Filter tools..."
                    className="px-3.5 py-2 rounded-2xl bg-white border-2 border-indigo-200 text-xs font-bold text-slate-900 sm:w-52"
                  />
                  {setAllToolsHidden && (
                    <>
                      <button
                        type="button"
                        onClick={() => setAllToolsHidden(false)}
                        className="px-2.5 py-2 rounded-xl bg-emerald-100 hover:bg-emerald-200 text-emerald-900 text-xs font-extrabold cursor-pointer"
                      >
                        👁️ Show All
                      </button>
                      <button
                        type="button"
                        onClick={() => setAllToolsHidden(true)}
                        className="px-2.5 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-extrabold cursor-pointer"
                      >
                        🙈 Hide All
                      </button>
                    </>
                  )}
                  <button
                    type="button"
                    onClick={resetToolsToDefault}
                    className="px-3 py-2 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 text-xs font-extrabold cursor-pointer"
                  >
                    Restore Defaults
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 max-h-[460px] overflow-y-auto pr-1">
                {adminFilteredTools.map((tool) => {
                  const isHidden = Boolean(tool.hidden);
                  return (
                    <div
                      key={tool.id}
                      className={`p-3.5 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-3 shadow-xs transition ${
                        isHidden
                          ? 'bg-slate-100/90 border-slate-300 opacity-75'
                          : 'bg-white/90 border-indigo-100 hover:border-indigo-400'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <div
                          className={`w-10 h-10 rounded-xl bg-gradient-to-br ${tool.orbGrad} text-white flex items-center justify-center flex-shrink-0 shadow overflow-hidden`}
                        >
                          {renderOrbVisual(tool.iconType, tool.iconUrl, `${tool.id} ${tool.title}`)}
                        </div>
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-1">
                            <span className="px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 text-[9px] font-extrabold border border-indigo-200">
                              {tool.badge}
                            </span>
                            {isHidden && (
                              <span className="px-2 py-0.5 rounded-md bg-rose-100 text-rose-800 text-[9px] font-extrabold border border-rose-300">
                                🙈 HIDDEN
                              </span>
                            )}
                          </div>
                          <div className="text-xs sm:text-sm font-extrabold text-slate-900 truncate mt-0.5">
                            {tool.title}
                          </div>
                          <div className="text-[10px] font-mono-code font-bold text-pink-600 truncate">
                            {tool.toolUrl}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-end sm:justify-start gap-1.5 flex-wrap sm:flex-nowrap pt-2 sm:pt-0 border-t border-slate-100 sm:border-0 w-full sm:w-auto">
                        {toggleToolHidden && (
                          <button
                            type="button"
                            onClick={() => toggleToolHidden(tool.id)}
                            title={isHidden ? 'Click to Show Tool on Website' : 'Click to Hide Tool from Website'}
                            className={`px-2.5 py-1.5 rounded-xl text-[11px] font-extrabold cursor-pointer flex items-center gap-1 border transition ${
                              isHidden
                                ? 'bg-amber-100 hover:bg-amber-200 text-amber-900 border-amber-300'
                                : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border-emerald-200'
                            }`}
                          >
                            {isHidden ? (
                              <>
                                <FaEyeSlash className="w-3 h-3" />
                                <span>Hidden</span>
                              </>
                            ) : (
                              <>
                                <FaEye className="w-3 h-3" />
                                <span>Visible</span>
                              </>
                            )}
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => launchWebTool(tool)}
                          className="px-2.5 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 text-xs font-extrabold cursor-pointer"
                        >
                          <FaArrowUpRightFromSquare className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleEditToolInWizard(tool)}
                          className="px-2.5 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 text-xs font-extrabold cursor-pointer flex items-center gap-1"
                        >
                          <FaPenToSquare className="w-3 h-3" />
                          <span>Edit</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteTool(tool.id, tool.title)}
                          className="px-2.5 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 text-xs font-extrabold cursor-pointer"
                        >
                          <FaTrashCan className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================== SCREEN 3: HERO BANNER & VISIBILITY STUDIO (4 STEPS) ==================== */}
      {activeScreen === 'banner' && hasScreenPermission('banner') && (
        <div className="acrylic-frame rounded-[34px] p-3 sm:p-4">
          <div className="plush-pillow plush-hero rounded-[26px] p-4 sm:p-6 space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-pink-200 pb-3.5">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-pink-600">
                  🖼️ STEP-BY-STEP HERO BANNER &amp; VISUALS STUDIO
                </span>
                <h3 className="text-base sm:text-xl font-extrabold text-slate-900">
                  Full Customizer: Section, Photo, Floating Badges, Headings &amp; Bio
                </h3>
                <p className="text-xs font-semibold text-slate-600">
                  Har cheez ko Admin Panel se ON / OFF aur customize karein — Agar photo nahi lagani to direct hide kar dein!
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    onUpdateSiteConfig((prev) => ({
                      ...prev,
                      banner: DEFAULT_SITE_CONFIG.banner
                    }));
                    showToast('Hero Banner restored to default!');
                  }}
                  className="px-3 py-1.5 rounded-xl bg-white text-rose-700 border border-rose-200 text-xs font-extrabold cursor-pointer hover:bg-rose-50 transition"
                >
                  Reset Banner
                </button>
              </div>
            </div>

            {/* Top Switcher: Hero Banner (1 no) vs Promo Banners (2 no) */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 p-1.5 rounded-2xl bg-white/70 border border-pink-200">
              <button
                type="button"
                onClick={() => setBannerStep(1)}
                className="flex-1 py-2 px-3 rounded-xl bg-gradient-to-r from-pink-500 to-rose-600 text-white font-extrabold text-xs shadow-md flex items-center justify-center gap-1.5 cursor-default"
              >
                <span>🖼️ Banner 1: Top Hero Banner &amp; Portrait</span>
                <span className="px-1.5 py-0.5 rounded-full bg-white/20 text-white text-[9px] font-black">
                  {siteConfig.banner.showHeroBanner ? 'ON' : 'OFF'}
                </span>
              </button>
              <button
                type="button"
                onClick={() => openSettingsScreen('promo_banners', 1)}
                className="flex-1 py-2 px-3 rounded-xl bg-white hover:bg-pink-50 text-slate-700 font-extrabold text-xs border border-pink-200 flex items-center justify-center gap-1.5 transition cursor-pointer"
              >
                <span>🎯 Banner 2: 2 No Promo Banners</span>
                <span className="px-1.5 py-0.5 rounded-full bg-pink-100 text-pink-700 text-[9px] font-black">
                  {currentPromoBanners.length}
                </span>
              </button>
            </div>

            {/* Quick 1-Click Presets */}
            <div className="p-3 rounded-2xl bg-white/80 border border-pink-200 flex flex-wrap items-center justify-between gap-2.5">
              <span className="text-xs font-extrabold text-slate-800 flex items-center gap-1.5">
                ⚡ Quick Presets:
              </span>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    onUpdateSiteConfig((prev) => ({
                      ...prev,
                      banner: {
                        ...prev.banner,
                        showHeroBanner: false,
                        showTopStrip: false
                      }
                    }));
                    showToast('🚀 Direct Bar & Tools Mode Activated! (Hero Hidden)');
                  }}
                  className="px-2.5 py-1.5 rounded-xl bg-slate-900 text-white text-[11px] font-extrabold shadow-sm hover:scale-105 transition cursor-pointer"
                  title="Hides Hero Banner and starts directly with Tools & Products"
                >
                  🚀 Direct Bar &amp; Tools (Hide Hero)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onUpdateSiteConfig((prev) => ({
                      ...prev,
                      banner: {
                        ...prev.banner,
                        showHeroBanner: true,
                        showPortraitPhoto: false
                      }
                    }));
                    showToast('👤 Text-Only Mode Activated! (Photo Hidden, Bio Full Width)');
                  }}
                  className="px-2.5 py-1.5 rounded-xl bg-purple-100 text-purple-800 border border-purple-200 text-[11px] font-extrabold shadow-sm hover:scale-105 transition cursor-pointer"
                  title="Keeps bio headline & text but hides profile photo"
                >
                  👤 Text-Only Mode (No Photo)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onUpdateSiteConfig((prev) => ({
                      ...prev,
                      banner: {
                        ...prev.banner,
                        showHeroBanner: true,
                        showTopStrip: true,
                        showPortraitPhoto: true,
                        showPortraitOrbitBadges: true,
                        orbitBadge1Enabled: true,
                        orbitBadge2Enabled: true,
                        orbitBadge3Enabled: true,
                        orbitBadge4Enabled: true,
                        showBadgeText: true,
                        showMainTitle: true,
                        showDescription: true,
                        showHeroFeaturePills: true,
                        rgbBorderEnabled: true
                      }
                    }));
                    showToast('✨ Full Visuals Deluxe Enabled!');
                  }}
                  className="px-2.5 py-1.5 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 text-white text-[11px] font-extrabold shadow-sm hover:scale-105 transition cursor-pointer"
                >
                  ✨ Full Visuals Deluxe
                </button>
              </div>
            </div>

            {/* 4-Step Selector */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { step: 1 as const, label: '1. Layout & Toggles', icon: '🎛️' },
                { step: 2 as const, label: '2. Heading & Bio', icon: '✍️' },
                { step: 3 as const, label: '3. Floating Badges', icon: '🪐' },
                { step: 4 as const, label: '4. Photo & Preview', icon: '🖼️' }
              ].map((s) => (
                <button
                  key={s.step}
                  type="button"
                  onClick={() => {
                    playPopSound(620);
                    setBannerStep(s.step);
                  }}
                  className={`py-2.5 px-3 rounded-xl text-xs font-extrabold transition cursor-pointer flex items-center justify-center gap-1.5 ${
                    bannerStep === s.step
                      ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-md'
                      : 'bg-white/85 text-slate-700 border border-pink-200 hover:bg-white'
                  }`}
                >
                  <span>{s.icon}</span>
                  <span>{s.label}</span>
                </button>
              ))}
            </div>

            {/* STEP 1: MASTER LAYOUT & SECTION TOGGLES */}
            {bannerStep === 1 && (
              <div className="space-y-4">
                <div className="rounded-2xl bg-white/90 border border-pink-200 divide-y divide-slate-200/70 shadow-xs">
                  {/* Master Section Toggle */}
                  <div className="p-4 flex items-center justify-between gap-3">
                    <div>
                      <div className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                        <span>🌟 Show Main 3D Hero Banner Section</span>
                        {siteConfig.banner.showHeroBanner ? (
                          <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-extrabold">
                            ON (Visible)
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 text-[10px] font-extrabold">
                            OFF (Hidden — Direct Bar &amp; Tools Start)
                          </span>
                        )}
                      </div>
                      <div className="text-xs font-semibold text-slate-600">
                        Turn OFF if you want visitors to see the Store Products &amp; Tools immediately at the top without any hero card
                      </div>
                    </div>
                    {renderToggleSwitch(
                      siteConfig.banner.showHeroBanner,
                      () =>
                        onUpdateSiteConfig((prev) => ({
                          ...prev,
                          banner: {
                            ...prev.banner,
                            showHeroBanner: !prev.banner.showHeroBanner
                          }
                        })),
                      'Show Hero Banner'
                    )}
                  </div>

                  {/* Profile Photo Toggle */}
                  <div className="p-4 flex items-center justify-between gap-3">
                    <div>
                      <div className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                        <span>📸 Show Profile Photo / Portrait Lens</span>
                        {siteConfig.banner.showPortraitPhoto !== false ? (
                          <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-extrabold">
                            Photo Shown
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-extrabold">
                            Photo Hidden (Bio Full Width)
                          </span>
                        )}
                      </div>
                      <div className="text-xs font-semibold text-slate-600">
                        Admin agar apni pic nahi lagana chahta to isko OFF kar dein — Picture aur floating badges hide ho kar bio card automatically clean full width me adjust ho jayega!
                      </div>
                    </div>
                    {renderToggleSwitch(
                      siteConfig.banner.showPortraitPhoto !== false,
                      () =>
                        onUpdateSiteConfig((prev) => ({
                          ...prev,
                          banner: {
                            ...prev.banner,
                            showPortraitPhoto: prev.banner.showPortraitPhoto === false
                          }
                        })),
                      'Show Portrait Photo'
                    )}
                  </div>

                  {/* Top Strip Toggle */}
                  <div className="p-4 flex items-center justify-between gap-3">
                    <div>
                      <div className="text-sm font-extrabold text-slate-900">
                        ✨ Show Top Title Strip
                      </div>
                      <div className="text-xs font-semibold text-slate-600">
                        Displays &ldquo;{siteConfig.banner.topStripTitle}&rdquo; headline above the hero card
                      </div>
                    </div>
                    {renderToggleSwitch(
                      siteConfig.banner.showTopStrip,
                      () =>
                        onUpdateSiteConfig((prev) => ({
                          ...prev,
                          banner: {
                            ...prev.banner,
                            showTopStrip: !prev.banner.showTopStrip
                          }
                        })),
                      'Show Top Strip'
                    )}
                  </div>

                  {/* Top Strip WhatsApp Button Toggle */}
                  <div className="p-4 flex items-center justify-between gap-3">
                    <div>
                      <div className="text-sm font-extrabold text-slate-900">
                        💬 Show WhatsApp Pill in Top Strip
                      </div>
                      <div className="text-xs font-semibold text-slate-600">
                        Displays the live pulsing WhatsApp quick button in the top headline strip
                      </div>
                    </div>
                    {renderToggleSwitch(
                      siteConfig.banner.showTopStripWhatsapp !== false,
                      () =>
                        onUpdateSiteConfig((prev) => ({
                          ...prev,
                          banner: {
                            ...prev.banner,
                            showTopStripWhatsapp: prev.banner.showTopStripWhatsapp === false
                          }
                        })),
                      'Show WhatsApp in Top Strip'
                    )}
                  </div>

                  {/* RGB Lighting Halo Ring */}
                  <div className="p-4 flex items-center justify-between gap-3">
                    <div>
                      <div className="text-sm font-extrabold text-slate-900">
                        🌈 Soft Light RGB Halo Border (ON / OFF)
                      </div>
                      <div className="text-xs font-semibold text-slate-600">
                        Illuminates the circular portrait frame and cards with a smooth rotating RGB rim
                      </div>
                    </div>
                    {renderToggleSwitch(
                      siteConfig.banner.rgbBorderEnabled !== false,
                      () =>
                        onUpdateSiteConfig((prev) => ({
                          ...prev,
                          banner: {
                            ...prev.banner,
                            rgbBorderEnabled: prev.banner.rgbBorderEnabled === false
                          }
                        })),
                      'Show Soft Light RGB Borders'
                    )}
                  </div>
                </div>

                {/* Top Strip Text Input */}
                {siteConfig.banner.showTopStrip && (
                  <div className="p-3.5 rounded-2xl bg-white/85 border border-pink-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="block text-xs font-extrabold text-slate-900">
                        Top Strip Heading Text
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          const main = siteConfig.banner.mainTitle?.trim() || 'Muhammad Saqib';
                          const accent = siteConfig.banner.highlightTitle?.trim().replace(/^[—\-\s]+/, '') || 'Visuals Hub';
                          onUpdateSiteConfig((prev) => ({
                            ...prev,
                            banner: {
                              ...prev.banner,
                              topStripTitle: `${main.toUpperCase()} • ${accent.toUpperCase()}`
                            }
                          }));
                          showToast('✨ Top Strip auto-synced from Hero Name!');
                        }}
                        className="text-[10px] text-pink-600 hover:text-pink-800 font-bold cursor-pointer hover:underline flex items-center gap-1"
                      >
                        <i className="fa-solid fa-wand-magic-sparkles"></i>
                        <span>Auto-Fill from Hero Title</span>
                      </button>
                    </div>
                    <input
                      type="text"
                      value={siteConfig.banner.topStripTitle}
                      onChange={(e) =>
                        onUpdateSiteConfig((prev) => ({
                          ...prev,
                          banner: { ...prev.banner, topStripTitle: e.target.value }
                        }))
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border-2 border-pink-300 font-bold text-xs sm:text-sm text-slate-900 shadow-inner"
                      placeholder="e.g. SOHAIB AGENCY • OFFICIAL HUB"
                    />
                  </div>
                )}

                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => setBannerStep(2)}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 text-white font-extrabold text-xs cursor-pointer shadow-md"
                  >
                    Next: Heading, Badge &amp; Bio →
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: HEADINGS, BADGE & BIO TEXT CUSTOMIZER */}
            {bannerStep === 2 && (
              <div className="space-y-4">
                <div className="rounded-2xl bg-white/90 border border-pink-200 divide-y divide-slate-200/70 shadow-xs">
                  {/* Status Promo Badge Toggle & Input */}
                  <div className="p-4 space-y-2">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <div className="text-sm font-extrabold text-slate-900">
                          🏷️ Top Status Promo Badge
                        </div>
                        <div className="text-xs font-semibold text-slate-600">
                          Small pill tag above headline (e.g. ALL DIGITAL, AI, SMM SERVICES...)
                        </div>
                      </div>
                      {renderToggleSwitch(
                        siteConfig.banner.showBadgeText !== false,
                        () =>
                          onUpdateSiteConfig((prev) => ({
                            ...prev,
                            banner: {
                              ...prev.banner,
                              showBadgeText: prev.banner.showBadgeText === false
                            }
                          })),
                        'Show Status Badge'
                      )}
                    </div>
                    {siteConfig.banner.showBadgeText !== false && (
                      <input
                        type="text"
                        value={siteConfig.banner.badgeText}
                        onChange={(e) =>
                          onUpdateSiteConfig((prev) => ({
                            ...prev,
                            banner: { ...prev.banner, badgeText: e.target.value }
                          }))
                        }
                        className="w-full px-3.5 py-2 rounded-xl bg-white border-2 border-pink-300 font-bold text-xs text-slate-900 shadow-inner"
                        placeholder="Enter badge text..."
                      />
                    )}
                  </div>

                  {/* Main Title & Highlight Toggle & Inputs */}
                  <div className="p-4 space-y-2">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <div className="text-sm font-extrabold text-slate-900">
                          ✍️ Main Hero Name &amp; Highlighted Brand Title
                        </div>
                        <div className="text-xs font-semibold text-slate-600">
                          Large headline displayed prominently in the Bio card
                        </div>
                      </div>
                      {renderToggleSwitch(
                        siteConfig.banner.showMainTitle !== false,
                        () =>
                          onUpdateSiteConfig((prev) => ({
                            ...prev,
                            banner: {
                              ...prev.banner,
                              showMainTitle: prev.banner.showMainTitle === false
                            }
                          })),
                        'Show Main Title'
                      )}
                    </div>
                    {siteConfig.banner.showMainTitle !== false && (
                      <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                          <div>
                            <label className="block text-[11px] font-bold text-slate-700 mb-1">
                              Main Name / Title
                            </label>
                            <input
                              type="text"
                              value={siteConfig.banner.mainTitle}
                              onChange={(e) => {
                                const newMain = e.target.value;
                                const accent = siteConfig.banner.highlightTitle?.trim().replace(/^[—\-\s]+/, '') || 'Visuals Hub';
                                onUpdateSiteConfig((prev) => ({
                                  ...prev,
                                  banner: { 
                                    ...prev.banner, 
                                    mainTitle: newMain,
                                    topStripTitle: accent ? `${newMain.trim().toUpperCase()} • ${accent.toUpperCase()}` : newMain.trim().toUpperCase()
                                  },
                                  contact: {
                                    ...prev.contact,
                                    whatsappWidgetName: newMain.trim()
                                  },
                                  footer: {
                                    ...prev.footer,
                                    brandName: `🚀 ${newMain.trim()}`
                                  }
                                }));
                              }}
                              onBlur={() => {
                                  if (onSaveSiteConfigToCloud) {
                                    onSaveSiteConfigToCloud(siteConfig, false);
                                  }
                                }}
                                className="w-full px-3.5 py-2 rounded-xl bg-white border-2 border-pink-300 font-bold text-xs sm:text-sm text-slate-900 shadow-inner"
                              placeholder="e.g. Sohaib"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-bold text-slate-700 mb-1">
                              Highlighted Accent Title
                            </label>
                            <input
                              type="text"
                              value={siteConfig.banner.highlightTitle}
                              onChange={(e) => {
                                const newAccent = e.target.value;
                                const cleanAccent = newAccent.trim().replace(/^[—\-\s]+/, '');
                                const main = siteConfig.banner.mainTitle?.trim() || 'Muhammad Saqib';
                                onUpdateSiteConfig((prev) => ({
                                  ...prev,
                                  banner: { 
                                    ...prev.banner, 
                                    highlightTitle: newAccent,
                                    topStripTitle: cleanAccent ? `${main.toUpperCase()} • ${cleanAccent.toUpperCase()}` : main.toUpperCase()
                                  }
                                }));
                              }}
                              onBlur={() => {
                                  if (onSaveSiteConfigToCloud) {
                                    onSaveSiteConfigToCloud(siteConfig, false);
                                  }
                                }}
                                className="w-full px-3.5 py-2 rounded-xl bg-white border-2 border-pink-300 font-bold text-xs sm:text-sm text-slate-900 shadow-inner"
                              placeholder="e.g. Agency Hub"
                            />
                          </div>
                        </div>

                        {/* White-Label Dynamic Sync Notice & 1-Click Sync Button */}
                        
                          <div className="mt-2.5 flex flex-wrap items-center justify-between gap-2 p-2.5 bg-pink-50/70 border border-pink-200/80 rounded-xl">
                            <button
                              type="button"
                              onClick={async () => {
                                if (onSaveSiteConfigToCloud) {
                                  await onSaveSiteConfigToCloud(siteConfig, true);
                                }
                              }}
                              disabled={isSavingSiteConfig}
                              className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-extrabold text-xs shadow-md hover:scale-105 active:scale-95 transition flex items-center gap-1.5 cursor-pointer"
                            >
                              <i className="fa-solid fa-cloud-arrow-up"></i>
                              <span>{isSavingSiteConfig ? 'Saving...' : '💾 Save Name Changes to Database'}</span>
                            </button>
                            <span className="text-[11px] text-slate-500 font-medium">Autosaves on click / enter</span>
                          </div>

                        <div className="mt-2.5 p-3 rounded-2xl bg-gradient-to-r from-pink-50 via-purple-50 to-indigo-50 border border-pink-200/80 text-[11px] text-slate-700 space-y-2 shadow-xs">
                          <div className="flex items-start gap-2.5">
                            <div className="w-6 h-6 rounded-xl bg-pink-500 text-white flex items-center justify-center flex-shrink-0 text-xs shadow-xs mt-0.5">
                              <i className="fa-solid fa-wand-magic-sparkles"></i>
                            </div>
                            <div className="space-y-0.5">
                              <div className="font-extrabold text-slate-900 flex items-center gap-1.5">
                                <span>Global White-Label Sync Active</span>
                                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[9px] font-black uppercase">Live</span>
                              </div>
                              <p className="text-[10.5px] font-medium text-slate-600 leading-relaxed">
                                Jab aap yahan Name change karenge, poori website ka <strong>Navbar, Hero Heading, WhatsApp Widget, Order Checkout, Web Tools Hub aur About section</strong> automatically is naye name par switch ho jayega! (Footer developer credit &ldquo;Made by Muhammad Saqib&rdquo; hamesha secure rahega).
                              </p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              const main = siteConfig.banner.mainTitle?.trim() || 'Muhammad Saqib';
                              const accent = siteConfig.banner.highlightTitle?.trim().replace(/^[—\-\s]+/, '') || 'Visuals Hub';
                              onUpdateSiteConfig((prev) => ({
                                ...prev,
                                banner: {
                                  ...prev.banner,
                                  topStripTitle: `${main.toUpperCase()} • ${accent.toUpperCase()}`
                                },
                                contact: {
                                  ...prev.contact,
                                  whatsappWidgetName: main
                                },
                                footer: {
                                  ...prev.footer,
                                  brandName: `🚀 ${main}`
                                }
                              }));
                              showToast('✨ Top Strip, WhatsApp Widget & Footer Brand synchronized!');
                            }}
                            className="w-full sm:w-auto px-3.5 py-1.5 rounded-xl bg-white hover:bg-pink-50 border border-pink-300 text-pink-700 font-extrabold text-[11px] flex items-center justify-center gap-1.5 shadow-xs transition hover:scale-[1.01] cursor-pointer"
                          >
                            <i className="fa-solid fa-arrows-rotate"></i>
                            <span>1-Click Sync: Top Strip &amp; WhatsApp Widget Name</span>
                          </button>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Bio Paragraph Description Toggle & Textarea */}
                  <div className="p-4 space-y-2">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <div className="text-sm font-extrabold text-slate-900">
                          📝 Hero Bio &amp; Services Description Paragraph
                        </div>
                        <div className="text-xs font-semibold text-slate-600">
                          Summary description of your CapCut, AI accounts &amp; SMM services
                        </div>
                      </div>
                      {renderToggleSwitch(
                        siteConfig.banner.showDescription !== false,
                        () =>
                          onUpdateSiteConfig((prev) => ({
                            ...prev,
                            banner: {
                              ...prev.banner,
                              showDescription: prev.banner.showDescription === false
                            }
                          })),
                        'Show Bio Description'
                      )}
                    </div>
                    {siteConfig.banner.showDescription !== false && (
                      <textarea
                        rows={3}
                        value={siteConfig.banner.description}
                        onChange={(e) =>
                          onUpdateSiteConfig((prev) => ({
                            ...prev,
                            banner: { ...prev.banner, description: e.target.value }
                          }))
                        }
                        className="w-full p-3 rounded-xl bg-white border-2 border-pink-300 font-semibold text-xs sm:text-sm text-slate-900 shadow-inner"
                        placeholder="Write your bio text here..."
                      />
                    )}
                  </div>

                  {/* Interactive Feature Pills Inside Hero */}
                  <div className="p-4 flex items-center justify-between gap-3">
                    <div>
                      <div className="text-sm font-extrabold text-slate-900">
                        💊 Interactive Filter Pills Underneath Bio
                      </div>
                      <div className="text-xs font-semibold text-slate-600">
                        Buttons like &ldquo;AI &amp; Pro Apps&rdquo;, &ldquo;TikTok UK&rdquo;, &ldquo;Franchise &amp; CDR&rdquo;, &ldquo;NADRA&rdquo;, &ldquo;USDT&rdquo;, &ldquo;Live Web Tools&rdquo;
                      </div>
                    </div>
                    {renderToggleSwitch(
                      siteConfig.banner.showHeroFeaturePills !== false,
                      () =>
                        onUpdateSiteConfig((prev) => ({
                          ...prev,
                          banner: {
                            ...prev.banner,
                            showHeroFeaturePills: prev.banner.showHeroFeaturePills === false
                          }
                        })),
                      'Show Feature Pills'
                    )}
                  </div>
                </div>

                <div className="flex justify-between">
                  <button
                    type="button"
                    onClick={() => setBannerStep(1)}
                    className="px-4 py-2.5 rounded-xl bg-white text-slate-700 border border-slate-300 font-extrabold text-xs cursor-pointer"
                  >
                    ← Back
                  </button>
                  <button
                    type="button"
                    onClick={() => setBannerStep(3)}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 text-white font-extrabold text-xs cursor-pointer shadow-md"
                  >
                    Next: Floating Orbit Badges →
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: FLOATING ORBIT BADGES (CHOTE CHOTE FLOATING COMPONENTS) */}
            {bannerStep === 3 && (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-white/90 border border-pink-200 space-y-3 shadow-xs">
                  {/* Master Orbit Badges Switch */}
                  <div className="flex items-center justify-between gap-3 border-b border-pink-100 pb-3">
                    <div>
                      <div className="text-sm font-extrabold text-slate-900 flex items-center gap-1.5">
                        <span>🪐 All Floating Orbit Badges (Pic Floating Components)</span>
                        {siteConfig.banner.showPortraitOrbitBadges !== false ? (
                          <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-extrabold">
                            ON
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 text-[10px] font-extrabold">
                            OFF
                          </span>
                        )}
                      </div>
                      <div className="text-xs font-semibold text-slate-600">
                        Pic ke 4 corners par jo chote chote floating badges hain, unko ek click me ON ya OFF karein
                      </div>
                    </div>
                    {renderToggleSwitch(
                      siteConfig.banner.showPortraitOrbitBadges !== false,
                      () =>
                        onUpdateSiteConfig((prev) => ({
                          ...prev,
                          banner: {
                            ...prev.banner,
                            showPortraitOrbitBadges: prev.banner.showPortraitOrbitBadges === false
                          }
                        })),
                      'Toggle All Orbit Badges'
                    )}
                  </div>

                  <p className="text-xs font-bold text-slate-700">
                    Individual Floating Badges Customizer (Turn ON / OFF &amp; Edit Labels):
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    {/* Badge 1: CapCut Pro (Top-Left) */}
                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-lg bg-slate-900 text-white flex items-center justify-center text-xs font-bold">
                            🎬
                          </span>
                          <span className="text-xs font-extrabold text-slate-900">
                            Badge 1: Top-Left
                          </span>
                        </div>
                        {renderToggleSwitch(
                          siteConfig.banner.orbitBadge1Enabled !== false,
                          () =>
                            onUpdateSiteConfig((prev) => ({
                              ...prev,
                              banner: {
                                ...prev.banner,
                                orbitBadge1Enabled: prev.banner.orbitBadge1Enabled === false
                              }
                            })),
                          'Toggle Badge 1'
                        )}
                      </div>
                      <div className="space-y-1.5">
                        <input
                          type="text"
                          value={siteConfig.banner.orbitBadge1Title ?? 'CapCut & Lovable'}
                          onChange={(e) =>
                            onUpdateSiteConfig((prev) => ({
                              ...prev,
                              banner: { ...prev.banner, orbitBadge1Title: e.target.value }
                            }))
                          }
                          className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-slate-300 text-xs font-bold text-slate-900"
                          placeholder="Title (e.g. CapCut & Lovable)"
                        />
                        <input
                          type="text"
                          value={siteConfig.banner.orbitBadge1Sub ?? 'PRO UNLOCKED'}
                          onChange={(e) =>
                            onUpdateSiteConfig((prev) => ({
                              ...prev,
                              banner: { ...prev.banner, orbitBadge1Sub: e.target.value }
                            }))
                          }
                          className="w-full px-2.5 py-1 rounded-lg bg-white border border-pink-200 text-[11px] font-bold text-pink-600"
                          placeholder="Subtitle (e.g. PRO UNLOCKED)"
                        />
                      </div>
                    </div>

                    {/* Badge 2: AI Suite (Top-Right) */}
                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-lg bg-gradient-to-tr from-emerald-500 to-cyan-500 text-white flex items-center justify-center text-xs font-bold">
                            ✨
                          </span>
                          <span className="text-xs font-extrabold text-slate-900">
                            Badge 2: Top-Right
                          </span>
                        </div>
                        {renderToggleSwitch(
                          siteConfig.banner.orbitBadge2Enabled !== false,
                          () =>
                            onUpdateSiteConfig((prev) => ({
                              ...prev,
                              banner: {
                                ...prev.banner,
                                orbitBadge2Enabled: prev.banner.orbitBadge2Enabled === false
                              }
                            })),
                          'Toggle Badge 2'
                        )}
                      </div>
                      <div className="space-y-1.5">
                        <input
                          type="text"
                          value={siteConfig.banner.orbitBadge2Title ?? 'AI Suite'}
                          onChange={(e) =>
                            onUpdateSiteConfig((prev) => ({
                              ...prev,
                              banner: { ...prev.banner, orbitBadge2Title: e.target.value }
                            }))
                          }
                          className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-slate-300 text-xs font-bold text-slate-900"
                          placeholder="Title (e.g. AI Suite)"
                        />
                        <input
                          type="text"
                          value={siteConfig.banner.orbitBadge2Sub ?? 'GEMINI • CLAUDE'}
                          onChange={(e) =>
                            onUpdateSiteConfig((prev) => ({
                              ...prev,
                              banner: { ...prev.banner, orbitBadge2Sub: e.target.value }
                            }))
                          }
                          className="w-full px-2.5 py-1 rounded-lg bg-white border border-emerald-200 text-[11px] font-bold text-emerald-600"
                          placeholder="Subtitle (e.g. GEMINI • CLAUDE)"
                        />
                      </div>
                    </div>

                    {/* Badge 3: TikTok UK/USA (Bottom-Left) */}
                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-lg bg-rose-500 text-white flex items-center justify-center text-xs font-bold">
                            🎵
                          </span>
                          <span className="text-xs font-extrabold text-slate-900">
                            Badge 3: Bottom-Left
                          </span>
                        </div>
                        {renderToggleSwitch(
                          siteConfig.banner.orbitBadge3Enabled !== false,
                          () =>
                            onUpdateSiteConfig((prev) => ({
                              ...prev,
                              banner: {
                                ...prev.banner,
                                orbitBadge3Enabled: prev.banner.orbitBadge3Enabled === false
                              }
                            })),
                          'Toggle Badge 3'
                        )}
                      </div>
                      <div className="space-y-1.5">
                        <input
                          type="text"
                          value={siteConfig.banner.orbitBadge3Title ?? 'TikTok UK/USA'}
                          onChange={(e) =>
                            onUpdateSiteConfig((prev) => ({
                              ...prev,
                              banner: { ...prev.banner, orbitBadge3Title: e.target.value }
                            }))
                          }
                          className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-slate-300 text-xs font-bold text-slate-900"
                          placeholder="Title (e.g. TikTok UK/USA)"
                        />
                        <input
                          type="text"
                          value={siteConfig.banner.orbitBadge3Sub ?? 'ADS & BOOST'}
                          onChange={(e) =>
                            onUpdateSiteConfig((prev) => ({
                              ...prev,
                              banner: { ...prev.banner, orbitBadge3Sub: e.target.value }
                            }))
                          }
                          className="w-full px-2.5 py-1 rounded-lg bg-white border border-rose-200 text-[11px] font-bold text-rose-600"
                          placeholder="Subtitle (e.g. ADS & BOOST)"
                        />
                      </div>
                    </div>

                    {/* Badge 4: SIM & NADRA (Bottom-Right) */}
                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-lg bg-blue-600 text-white flex items-center justify-center text-xs font-bold">
                            📡
                          </span>
                          <span className="text-xs font-extrabold text-slate-900">
                            Badge 4: Bottom-Right
                          </span>
                        </div>
                        {renderToggleSwitch(
                          siteConfig.banner.orbitBadge4Enabled !== false,
                          () =>
                            onUpdateSiteConfig((prev) => ({
                              ...prev,
                              banner: {
                                ...prev.banner,
                                orbitBadge4Enabled: prev.banner.orbitBadge4Enabled === false
                              }
                            })),
                          'Toggle Badge 4'
                        )}
                      </div>
                      <div className="space-y-1.5">
                        <input
                          type="text"
                          value={siteConfig.banner.orbitBadge4Title ?? 'SIM & NADRA'}
                          onChange={(e) =>
                            onUpdateSiteConfig((prev) => ({
                              ...prev,
                              banner: { ...prev.banner, orbitBadge4Title: e.target.value }
                            }))
                          }
                          className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-slate-300 text-xs font-bold text-slate-900"
                          placeholder="Title (e.g. SIM & NADRA)"
                        />
                        <input
                          type="text"
                          value={siteConfig.banner.orbitBadge4Sub ?? 'CDR • FRC • LIVE'}
                          onChange={(e) =>
                            onUpdateSiteConfig((prev) => ({
                              ...prev,
                              banner: { ...prev.banner, orbitBadge4Sub: e.target.value }
                            }))
                          }
                          className="w-full px-2.5 py-1 rounded-lg bg-white border border-blue-200 text-[11px] font-bold text-blue-600"
                          placeholder="Subtitle (e.g. CDR • FRC • LIVE)"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between">
                  <button
                    type="button"
                    onClick={() => setBannerStep(2)}
                    className="px-4 py-2.5 rounded-xl bg-white text-slate-700 border border-slate-300 font-extrabold text-xs cursor-pointer"
                  >
                    ← Back
                  </button>
                  <button
                    type="button"
                    onClick={() => setBannerStep(4)}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 text-white font-extrabold text-xs cursor-pointer shadow-md"
                  >
                    Next: Photo &amp; Live Preview →
                  </button>
                </div>
              </div>
            )}

            {/* STEP 4: PORTRAIT PHOTO URL & LIVE REAL-TIME PREVIEW */}
            {bannerStep === 4 && (
              <div className="space-y-4">
                {/* Photo Upload & Preview Card */}
                <div className="p-4 sm:p-5 rounded-2xl bg-white/95 border border-pink-200 space-y-4 shadow-sm">
                  <div className="flex items-center justify-between gap-2 border-b border-pink-100 pb-3">
                    <div>
                      <h4 className="text-xs sm:text-sm font-extrabold text-slate-900 flex items-center gap-1.5">
                        <i className="fa-solid fa-camera text-pink-500"></i>
                        <span>Hero Circular Portrait Photo</span>
                      </h4>
                      <p className="text-[11px] font-semibold text-slate-600 mt-0.5">
                        Direct ImageKit CDN Upload • Auto-saves to your store profile without copying links
                      </p>
                    </div>
                    <span className="text-[11px] font-bold text-pink-600">
                      {siteConfig.banner.showPortraitPhoto !== false ? '✅ Photo is ON' : '🙈 Photo is HIDDEN'}
                    </span>
                  </div>

                  <ImageKitUploadField
                    value={siteConfig.banner.portraitUrl}
                    onChange={(url) =>
                      onUpdateSiteConfig((prev) => ({
                        ...prev,
                        banner: { ...prev.banner, portraitUrl: url }
                      }))
                    }
                    folder="/saqib-hub/portrait"
                    label="Portrait Photo"
                    shape="circle"
                    presets={[
                      {
                        label: 'Sohaib Official Pic',
                        url: 'https://ik.imagekit.io/mrsaqib/mrsaqib242-img25_7oG52NZUY.png',
                      },
                      {
                        label: 'Creative Studio Avatar',
                        url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
                      },
                    ]}
                    showToast={showToast}
                    playPop={playPopSound}
                  />
                </div>

                {/* Real-Time Live Preview of How Hero Looks */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold uppercase tracking-wider text-slate-700">
                      👀 Real-Time Live Storefront Preview:
                    </span>
                    <span className="text-[11px] font-bold text-emerald-600">
                      ● Live Sync Active
                    </span>
                  </div>

                  {/* Section Hidden Alert */}
                  {!siteConfig.banner.showHeroBanner && (
                    <div className="p-4 rounded-2xl bg-amber-50 border-2 border-amber-300 text-amber-900 text-xs font-bold text-center">
                      ⚠️ Main Hero Banner is currently <span className="underline">TURNED OFF</span>.
                      Visitors will immediately see the Category Search Bar, Marquee and Tools directly at the top of the storefront!
                    </div>
                  )}

                  {/* Render simulated hero card preview */}
                  {siteConfig.banner.showHeroBanner && (
                    <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-pink-50 via-rose-50 to-purple-50 border-2 border-pink-200 shadow-md">
                      {/* Top Strip Preview */}
                      {siteConfig.banner.showTopStrip && (
                        <div className="flex items-center justify-between pb-3 mb-3 border-b border-pink-200/80">
                          <span className="text-xs sm:text-sm font-extrabold text-slate-900 tracking-wide uppercase">
                            ✨ {siteConfig.banner.topStripTitle}
                          </span>
                          {siteConfig.banner.showTopStripWhatsapp !== false && (
                            <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                              💬 WhatsApp Pill ON
                            </span>
                          )}
                        </div>
                      )}

                      {/* Main Card Preview */}
                      <div className={`flex flex-col ${siteConfig.banner.showPortraitPhoto !== false ? 'sm:flex-row' : ''} items-center gap-4`}>
                        {/* Portrait Photo Preview */}
                        {siteConfig.banner.showPortraitPhoto !== false ? (
                          <div className="relative flex-shrink-0">
                            <img
                              src={siteConfig.banner.portraitUrl}
                              alt="Portrait Preview"
                              className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover border-4 border-white shadow-xl bg-slate-100"
                            />
                            {siteConfig.banner.showPortraitOrbitBadges !== false && (
                              <div className="absolute -bottom-1 -right-1 px-2 py-0.5 rounded-full bg-slate-900 text-white text-[9px] font-extrabold shadow">
                                4 Badges ON
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="w-full text-center sm:text-left">
                            <span className="inline-block px-2.5 py-1 rounded-lg bg-purple-100 text-purple-800 text-[11px] font-extrabold mb-1">
                              👤 Photo Hidden — Bio Card displayed full width
                            </span>
                          </div>
                        )}

                        {/* Bio Text Preview */}
                        <div className="flex-1 space-y-1.5 text-center sm:text-left min-w-0">
                          {siteConfig.banner.showBadgeText !== false && siteConfig.banner.badgeText && (
                            <span className="inline-block px-2.5 py-0.5 rounded-full bg-white/90 border border-pink-200 text-pink-700 text-[9px] font-extrabold shadow-xs">
                              ✓ {siteConfig.banner.badgeText}
                            </span>
                          )}
                          {siteConfig.banner.showMainTitle !== false && (
                            <div className="text-base sm:text-lg font-extrabold text-slate-900 leading-snug">
                              {siteConfig.banner.mainTitle}{' '}
                              <span className="text-pink-600">{siteConfig.banner.highlightTitle}</span>
                            </div>
                          )}
                          {siteConfig.banner.showDescription !== false && (
                            <p className="text-xs font-semibold text-slate-700 line-clamp-2">
                              {siteConfig.banner.description}
                            </p>
                          )}
                          {siteConfig.banner.showHeroFeaturePills !== false && (
                            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-1 pt-1">
                              <span className="px-2 py-0.5 rounded-md bg-white text-[10px] font-bold text-slate-800 shadow-xs border border-purple-200">
                                ✨ AI &amp; Pro Apps
                              </span>
                              <span className="px-2 py-0.5 rounded-md bg-white text-[10px] font-bold text-slate-800 shadow-xs border border-pink-200">
                                🎵 TikTok
                              </span>
                              <span className="px-2 py-0.5 rounded-md bg-white text-[10px] font-bold text-slate-800 shadow-xs border border-blue-200">
                                📡 SIM Tracker
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex justify-between pt-2">
                  <button
                    type="button"
                    onClick={() => setBannerStep(3)}
                    className="px-4 py-2.5 rounded-xl bg-white text-slate-700 border border-slate-300 font-extrabold text-xs cursor-pointer"
                  >
                    ← Back: Floating Badges
                  </button>
                  <button
                    type="button"
                    onClick={async () => {
                      playPopSound(840);
                      if (onSaveSiteConfigToCloud) {
                        await onSaveSiteConfigToCloud(siteConfig, true);
                      }
                      setActiveScreen('home');
                    }}
                    disabled={isSavingSiteConfig}
                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-extrabold text-xs sm:text-sm shadow-lg hover:scale-105 transition cursor-pointer flex items-center gap-2"
                  >
                    {isSavingSiteConfig ? (
                      <>
                        <i className="fa-solid fa-spinner animate-spin"></i>
                        <span>Saving to Database...</span>
                      </>
                    ) : (
                      <>
                        <i className="fa-solid fa-cloud-arrow-up"></i>
                        <span>✓ Save to Database &amp; Return</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ==================== SCREEN: 2 NO PROMO & DEAL BANNERS STUDIO ==================== */}
      {activeScreen === 'promo_banners' && hasScreenPermission('promo_banners') && (
        <div className="acrylic-frame rounded-[34px] p-3 sm:p-4">
          <div className="plush-pillow plush-hero rounded-[26px] p-4 sm:p-6 space-y-5">
            {/* Top Navigation & Breadcrumbs */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-pink-200 pb-3.5">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveScreen('home')}
                    className="text-xs font-extrabold text-slate-700 hover:text-pink-600 flex items-center gap-1 cursor-pointer transition"
                  >
                    <FaArrowLeft className="w-3 h-3" />
                    <span>Settings Menu</span>
                  </button>
                  <span className="text-slate-400">/</span>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-pink-600 bg-pink-100 px-2 py-0.5 rounded-full border border-pink-200">
                    🎯 2 NO PROMO BANNERS STUDIO
                  </span>
                </div>
                <h3 className="text-base sm:text-2xl font-extrabold text-slate-900">
                  Full Customizer: 2 No Banner, Deals, Themes, Buttons &amp; Visibility
                </h3>
                <p className="text-xs font-semibold text-slate-600">
                  Storefront par dikhne wale 2 Number Promotional Banners ko manage karein — Naye banners add karein, delete karein, colors/style change karein, WhatsApp/Tools links set karein ya hide karein!
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    onUpdateSiteConfig((prev) => ({
                      ...prev,
                      promoBanners: DEFAULT_PROMO_BANNERS
                    }));
                    setEditingPromoBannerId(null);
                    showToast('2 No Banners restored to default!');
                  }}
                  className="px-3 py-1.5 rounded-xl bg-white text-rose-700 border border-rose-200 text-xs font-extrabold cursor-pointer hover:bg-rose-50 transition"
                >
                  Reset to Default
                </button>
                <button
                  type="button"
                  onClick={() => handleAddPromoBanner()}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white text-xs font-extrabold shadow-md flex items-center gap-1.5 cursor-pointer hover:scale-105 transition"
                >
                  <FaPlus className="w-3.5 h-3.5" />
                  <span>+ Add New Banner</span>
                </button>
              </div>
            </div>

            {/* Top Switcher: Hero Banner (1 no) vs Promo Banners (2 no) */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 p-1.5 rounded-2xl bg-white/70 border border-pink-200">
              <button
                type="button"
                onClick={() => openSettingsScreen('banner', 1)}
                className="flex-1 py-2 px-3 rounded-xl bg-white hover:bg-pink-50 text-slate-700 font-extrabold text-xs border border-pink-200 flex items-center justify-center gap-1.5 transition cursor-pointer"
              >
                <span>🖼️ Banner 1: Top Hero Banner &amp; Portrait</span>
                <span className="px-1.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[9px] font-black">
                  {siteConfig.banner.showHeroBanner ? 'ON' : 'OFF'}
                </span>
              </button>
              <button
                type="button"
                onClick={() => {}}
                className="flex-1 py-2 px-3 rounded-xl bg-gradient-to-r from-pink-500 to-rose-600 text-white font-extrabold text-xs shadow-md flex items-center justify-center gap-1.5 cursor-default"
              >
                <span>🎯 Banner 2: 2 No Promo Banners (ACTIVE)</span>
                <span className="px-1.5 py-0.5 rounded-full bg-white/20 text-white text-[9px] font-black">
                  {currentPromoBanners.length} Banners
                </span>
              </button>
            </div>

            {/* Master Show / Hide Toggle Card */}
            <div className="p-4 rounded-2xl bg-white/90 border border-pink-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-600 text-white flex items-center justify-center text-base shadow-sm flex-shrink-0">
                  <FaBullhorn className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs sm:text-sm font-extrabold text-slate-900 flex items-center gap-2">
                    <span>Show 2 No Promo Banners on Storefront</span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase ${
                        (activeVisibility.showPromoBanners ?? true)
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : 'bg-rose-100 text-rose-800 border border-rose-300'
                      }`}
                    >
                      {(activeVisibility.showPromoBanners ?? true) ? 'Visible' : 'Hidden'}
                    </span>
                  </div>
                  <div className="text-[11px] font-medium text-slate-600">
                    Master Switch: 1-Tap se saare 2 number promo banners ko storefront par show ya hide karein.
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {renderToggleSwitch(
                  activeVisibility.showPromoBanners ?? true,
                  () => toggleSiteVisibilityKey('showPromoBanners', '2 No Promo Banners'),
                  'Toggle 2 No Promo Banners'
                )}
              </div>
            </div>

            {/* 1-Click Quick Preset Templates */}
            <div className="p-3.5 rounded-2xl bg-white/80 border border-pink-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-slate-900 flex items-center gap-1.5">
                  <FaWandMagicSparkles className="text-amber-500 w-3.5 h-3.5" />
                  <span>1-Click Quick Templates to Add:</span>
                </span>
                <span className="text-[10px] font-bold text-slate-500">Tap to instantly add a pre-styled banner</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
                {PROMO_BANNER_PRESETS.map((preset) => (
                  <button
                    key={preset.name}
                    type="button"
                    onClick={() => handleAddPromoBanner(preset.name)}
                    className="p-2.5 rounded-xl bg-white hover:bg-pink-50/80 border border-pink-200 text-left transition shadow-xs hover:scale-[1.02] cursor-pointer flex flex-col justify-between gap-1.5"
                  >
                    <div className="text-[11px] font-extrabold text-slate-900 line-clamp-1">
                      {preset.label}
                    </div>
                    <div className="text-[9.5px] text-slate-500 line-clamp-2 leading-tight">
                      {preset.desc}
                    </div>
                    <span className="self-start mt-0.5 px-1.5 py-0.2 rounded-full text-[8.5px] font-black uppercase bg-pink-100 text-pink-700 border border-pink-200">
                      + Add {preset.style}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* ==================== ACTIVE BANNER EDITOR (WHEN A BANNER IS BEING EDITED) ==================== */}
            {editingPromoBannerId !== null ? (
              (() => {
                const activeBanner =
                  currentPromoBanners.find((b) => b.id === editingPromoBannerId) ||
                  currentPromoBanners[0];
                if (!activeBanner) return null;
                const activeBannerIdx = currentPromoBanners.findIndex((b) => b.id === activeBanner.id);
                const styleObj = getPromoBannerStyleClasses(activeBanner.style);

                return (
                  <div className="rounded-2xl bg-white/95 border border-pink-200 p-4 sm:p-5 space-y-5 shadow-sm">
                    {/* Editor Header */}
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-pink-100 pb-3">
                      <div className="flex items-center gap-2.5">
                        <span className="w-8 h-8 rounded-xl bg-pink-500 text-white font-extrabold text-xs flex items-center justify-center shadow-xs">
                          #{activeBannerIdx + 1}
                        </span>
                        <div>
                          <div className="text-sm sm:text-base font-extrabold text-slate-900 flex items-center gap-2">
                            <span>Editing Banner: {activeBanner.title || 'Untitled Banner'}</span>
                            <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase border ${styleObj.pillBg}`}>
                              {styleObj.themeLabel}
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-500 font-medium">
                            {activeBanner.enabled !== false ? '✅ Active on Storefront' : '🙈 Currently Hidden'} • {activeBanner.position === 'above_services' ? 'Top of Store' : 'Below Services Catalog'}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleTogglePromoBanner(activeBanner.id)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition cursor-pointer flex items-center gap-1.5 border ${
                            activeBanner.enabled !== false
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                              : 'bg-slate-100 text-slate-600 border-slate-300'
                          }`}
                        >
                          {activeBanner.enabled !== false ? (
                            <>
                              <FaEye className="w-3.5 h-3.5" />
                              <span>Active (Visible)</span>
                            </>
                          ) : (
                            <>
                              <FaEyeSlash className="w-3.5 h-3.5" />
                              <span>Hidden (Off)</span>
                            </>
                          )}
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingPromoBannerId(null)}
                          className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-extrabold transition cursor-pointer shadow-xs"
                        >
                          Done Editing
                        </button>
                      </div>
                    </div>

                    {/* Step Tabs */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {[
                        { step: 1 as const, label: '🏷️ 1. Badge & Text' },
                        { step: 2 as const, label: '🎨 2. Style Theme' },
                        { step: 3 as const, label: '🔘 3. Buttons & Links' },
                        { step: 4 as const, label: '👁️ 4. Live Preview' }
                      ].map((tab) => {
                        const isCurrent = promoBannerStep === tab.step;
                        return (
                          <button
                            key={tab.step}
                            type="button"
                            onClick={() => {
                              playPopSound(600);
                              setPromoBannerStep(tab.step);
                            }}
                            className={`py-2 px-2.5 rounded-xl text-xs font-extrabold transition cursor-pointer flex items-center justify-center gap-1.5 border ${
                              isCurrent
                                ? 'bg-gradient-to-r from-pink-500 to-rose-600 text-white border-pink-600 shadow-sm'
                                : 'bg-slate-50 hover:bg-pink-50 text-slate-700 border-slate-200'
                            }`}
                          >
                            <span>{tab.label}</span>
                          </button>
                        );
                      })}
                    </div>

                    {/* ==================== STEP 1: CONTENT & HEADLINES ==================== */}
                    {promoBannerStep === 1 && (
                      <div className="space-y-4">
                        {/* Badge Tag & Icon */}
                        <div className="p-3.5 rounded-2xl bg-pink-50/60 border border-pink-200 space-y-3">
                          <label className="block text-xs font-extrabold uppercase text-slate-800">
                            1. Top Badge Tag Text &amp; Icon:
                          </label>
                          <div className="flex flex-col sm:flex-row gap-2">
                            <input
                              type="text"
                              value={activeBanner.badgeText || ''}
                              onChange={(e) =>
                                handleUpdatePromoBannerField(activeBanner.id, 'badgeText', e.target.value)
                              }
                              placeholder="e.g. ALL SERVICES AVAILABLE HERE, SPECIAL RAMADAN DEAL..."
                              className="flex-grow px-3.5 py-2.5 rounded-xl bg-white border border-pink-300 font-extrabold text-xs text-slate-900 focus:outline-none focus:border-pink-500 shadow-xs"
                            />
                            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-pink-300 shadow-xs">
                              <span className="text-[10px] font-bold text-slate-500">Preview:</span>
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-pink-100 text-pink-700 text-[10px] font-extrabold border border-pink-300">
                                <i className={activeBanner.badgeIcon || 'fa-solid fa-bolt'}></i>
                                <span>{activeBanner.badgeText || 'BADGE PREVIEW'}</span>
                              </span>
                            </div>
                          </div>

                          <div>
                            <span className="text-[10px] font-extrabold text-slate-600 uppercase mb-1.5 block">
                              Select Badge Icon:
                            </span>
                            <div className="flex flex-wrap gap-1.5">
                              {[
                                { icon: 'fa-solid fa-bolt', label: '⚡ Bolt' },
                                { icon: 'fa-solid fa-fire', label: '🔥 Fire' },
                                { icon: 'fa-solid fa-gift', label: '🎁 Gift' },
                                { icon: 'fa-solid fa-wand-magic-sparkles', label: '✨ Sparkles' },
                                { icon: 'fa-solid fa-shield-halved', label: '🛡️ Shield' },
                                { icon: 'fa-solid fa-star', label: '⭐ Star' },
                                { icon: 'fa-solid fa-rocket', label: '🚀 Rocket' },
                                { icon: 'fa-brands fa-whatsapp', label: '💬 WhatsApp' },
                                { icon: 'fa-solid fa-coins', label: '💰 Coins' },
                                { icon: 'fa-solid fa-crown', label: '👑 Crown' },
                                { icon: 'fa-solid fa-bag-shopping', label: '🛍️ Shop' },
                                { icon: 'fa-solid fa-screwdriver-wrench', label: '🛠️ Tools' }
                              ].map((ic) => {
                                const isSel = (activeBanner.badgeIcon || 'fa-solid fa-bolt') === ic.icon;
                                return (
                                  <button
                                    key={ic.icon}
                                    type="button"
                                    onClick={() =>
                                      handleUpdatePromoBannerField(activeBanner.id, 'badgeIcon', ic.icon)
                                    }
                                    className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer border ${
                                      isSel
                                        ? 'bg-pink-500 text-white border-pink-600 shadow-xs'
                                        : 'bg-white hover:bg-pink-50 text-slate-700 border-slate-200'
                                    }`}
                                  >
                                    <i className={ic.icon}></i>
                                    <span className="text-[10px]">{ic.label}</span>
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        </div>

                        {/* Main Title / Headline */}
                        <div className="p-3.5 rounded-2xl bg-white border border-slate-200 space-y-1.5 shadow-xs">
                          <label className="block text-xs font-extrabold text-slate-800">
                            2. Main Banner Headline / Title:
                          </label>
                          <textarea
                            rows={2}
                            value={activeBanner.title || ''}
                            onChange={(e) =>
                              handleUpdatePromoBannerField(activeBanner.id, 'title', e.target.value)
                            }
                            placeholder="Need Custom AI Credits, Ad Agency Accounts, NADRA/CDR Info, or USDT?"
                            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 font-extrabold text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-pink-500"
                          />
                        </div>

                        {/* Description / Subtitle */}
                        <div className="p-3.5 rounded-2xl bg-white border border-slate-200 space-y-1.5 shadow-xs">
                          <label className="block text-xs font-extrabold text-slate-800">
                            3. Subtitle / Description Text:
                          </label>
                          <textarea
                            rows={3}
                            value={activeBanner.description || ''}
                            onChange={(e) =>
                              handleUpdatePromoBannerField(activeBanner.id, 'description', e.target.value)
                            }
                            placeholder="Message Muhammad Saqib directly on WhatsApp (+92 347 8936242) for wholesale reseller rates, JazzCash / EasyPaisa payment, and instant delivery."
                            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 font-medium text-xs text-slate-900 focus:outline-none focus:border-pink-500"
                          />
                        </div>

                        {/* Optional Illustration / Image URL */}
                        <div className="p-3.5 rounded-2xl bg-white border border-slate-200 space-y-2 shadow-xs">
                          <div className="flex items-center justify-between">
                            <label className="block text-xs font-extrabold text-slate-800">
                              4. Optional Banner Illustration / Photo URL:
                            </label>
                            {activeBanner.imageUrl && (
                              <button
                                type="button"
                                onClick={() =>
                                  handleUpdatePromoBannerField(activeBanner.id, 'imageUrl', '')
                                }
                                className="text-[10px] font-extrabold text-rose-600 hover:underline cursor-pointer"
                              >
                                Remove Image
                              </button>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="flex items-center gap-2 flex-grow">
                              <input
                                type="text"
                                value={activeBanner.imageUrl || ''}
                                onChange={(e) =>
                                  handleUpdatePromoBannerField(activeBanner.id, 'imageUrl', e.target.value)
                                }
                                placeholder="https://.../banner-badge.png (or Upload to ImageKit)"
                                className="flex-grow px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-300 font-mono-code text-xs text-slate-900 focus:outline-none focus:border-pink-500"
                              />
                              <label className="px-3 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs shadow-sm cursor-pointer flex items-center gap-1.5 transition flex-shrink-0">
                                <i className="fa-solid fa-cloud-arrow-up"></i>
                                <span>Upload</span>
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={async (e) => {
                                    const file = e.target.files?.[0];
                                    if (!file) return;
                                    showToast('⚡ Uploading banner illustration to ImageKit...');
                                    const res = await uploadImageToImageKit(file, '/saqib-hub/banners');
                                    if (res.success && res.url) {
                                      handleUpdatePromoBannerField(activeBanner.id, 'imageUrl', res.url);
                                      playPopSound(780);
                                      showToast('✓ Banner saved to ImageKit CDN!');
                                    } else {
                                      showToast('Upload failed: ' + (res.error || 'Unknown error'));
                                    }
                                  }}
                                  className="hidden"
                                />
                              </label>
                              {activeBanner.imageUrl && (
                                <img
                                  src={activeBanner.imageUrl}
                                  alt="Banner preview"
                                  className="w-9 h-9 rounded-lg object-contain bg-slate-100 border border-slate-300 p-0.5 flex-shrink-0"
                                />
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex justify-end pt-2">
                          <button
                            type="button"
                            onClick={() => {
                              playPopSound(660);
                              setPromoBannerStep(2);
                            }}
                            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-pink-500 to-rose-600 text-white font-extrabold text-xs shadow-md hover:scale-105 transition cursor-pointer"
                          >
                            Next: Style Theme &amp; Placement →
                          </button>
                        </div>
                      </div>
                    )}

                    {/* ==================== STEP 2: STYLE THEME & PLACEMENT ==================== */}
                    {promoBannerStep === 2 && (
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <label className="block text-xs font-extrabold uppercase text-slate-800">
                            1. Select Visual Banner Style / Color Theme:
                          </label>
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                            {[
                              {
                                style: 'rose' as const,
                                label: '🌸 Plush Rose',
                                desc: 'Soft pink plush pillow with dark text & emerald WhatsApp button',
                                previewClass: 'bg-gradient-to-r from-pink-100 to-rose-200 border-pink-300 text-slate-900'
                              },
                              {
                                style: 'dark' as const,
                                label: '🌌 Cyber Dark',
                                desc: 'Deep cosmic slate/indigo/purple matrix with cyan glow',
                                previewClass: 'bg-gradient-to-r from-slate-950 via-indigo-950 to-purple-950 border-indigo-500/50 text-white'
                              },
                              {
                                style: 'emerald' as const,
                                label: '💚 Emerald Cash',
                                desc: 'WhatsApp emerald green gradient with mint neon badges',
                                previewClass: 'bg-gradient-to-r from-emerald-950 via-teal-950 to-slate-950 border-emerald-500/50 text-white'
                              },
                              {
                                style: 'amber' as const,
                                label: '👑 Gold Luxury',
                                desc: 'VIP sunset amber & gold luxury with bright yellow accents',
                                previewClass: 'bg-gradient-to-r from-amber-950 via-orange-950 to-slate-950 border-amber-500/50 text-white'
                              },
                              {
                                style: 'cyan' as const,
                                label: '💎 Ice Cyan',
                                desc: 'Futuristic electric blue & cyan glass with ice neon',
                                previewClass: 'bg-gradient-to-r from-cyan-950 via-blue-950 to-slate-950 border-cyan-500/50 text-white'
                              },
                              {
                                style: 'purple' as const,
                                label: '🔮 Royal Purple',
                                desc: 'Royal fuchsia & violet matrix with bright pink gradients',
                                previewClass: 'bg-gradient-to-r from-purple-950 via-fuchsia-950 to-slate-950 border-purple-500/50 text-white'
                              }
                            ].map((thm) => {
                              const isSelected = activeBanner.style === thm.style;
                              return (
                                <button
                                  key={thm.style}
                                  type="button"
                                  onClick={() => {
                                    playPopSound(660);
                                    handleUpdatePromoBannerField(activeBanner.id, 'style', thm.style);
                                  }}
                                  className={`p-3.5 rounded-2xl border text-left transition cursor-pointer flex flex-col justify-between gap-2 shadow-xs ${
                                    thm.previewClass
                                  } ${
                                    isSelected
                                      ? 'ring-3 ring-pink-500 scale-[1.02] shadow-md'
                                      : 'hover:opacity-90 opacity-80'
                                  }`}
                                >
                                  <div className="flex items-center justify-between">
                                    <span className="text-xs font-black">{thm.label}</span>
                                    {isSelected && (
                                      <span className="w-5 h-5 rounded-full bg-pink-500 text-white text-[10px] flex items-center justify-center font-black">
                                        ✓
                                      </span>
                                    )}
                                  </div>
                                  <div className="text-[10px] font-semibold opacity-85 leading-tight">
                                    {thm.desc}
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {/* Storefront Placement / Position */}
                        <div className="p-3.5 rounded-2xl bg-white border border-slate-200 space-y-2 shadow-xs">
                          <label className="block text-xs font-extrabold uppercase text-slate-800">
                            2. Banner Placement on Storefront:
                          </label>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                            {[
                              {
                                pos: 'below_services' as const,
                                title: '📍 Below Services Catalog',
                                desc: 'Standard 2 No Banner (underneath the 31+ service cards)'
                              },
                              {
                                pos: 'above_services' as const,
                                title: '📍 Above Services Catalog',
                                desc: 'Shows near top right after the wallet balance bar'
                              },
                              {
                                pos: 'both' as const,
                                title: '📍 Both Positions',
                                desc: 'Shows both at top of store and bottom of store'
                              }
                            ].map((p) => {
                              const isSel = (activeBanner.position || 'below_services') === p.pos;
                              return (
                                <button
                                  key={p.pos}
                                  type="button"
                                  onClick={() =>
                                    handleUpdatePromoBannerField(activeBanner.id, 'position', p.pos)
                                  }
                                  className={`p-3 rounded-xl border text-left transition cursor-pointer flex flex-col gap-1 ${
                                    isSel
                                      ? 'bg-pink-50 text-pink-900 border-pink-400 font-extrabold shadow-xs'
                                      : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
                                  }`}
                                >
                                  <span className="text-xs font-extrabold">{p.title}</span>
                                  <span className="text-[10px] text-slate-500 font-medium leading-tight">
                                    {p.desc}
                                  </span>
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        <div className="flex justify-between pt-2">
                          <button
                            type="button"
                            onClick={() => setPromoBannerStep(1)}
                            className="px-4 py-2.5 rounded-xl bg-white text-slate-700 border border-slate-300 font-extrabold text-xs cursor-pointer"
                          >
                            ← Back: Badge &amp; Text
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              playPopSound(660);
                              setPromoBannerStep(3);
                            }}
                            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-pink-500 to-rose-600 text-white font-extrabold text-xs shadow-md hover:scale-105 transition cursor-pointer"
                          >
                            Next: Buttons &amp; Actions →
                          </button>
                        </div>
                      </div>
                    )}

                    {/* ==================== STEP 3: BUTTONS & ACTIONS ==================== */}
                    {promoBannerStep === 3 && (
                      <div className="space-y-4">
                        {/* Primary Button */}
                        <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-3 shadow-xs">
                          <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                            <div className="flex items-center gap-2">
                              <span className="w-6 h-6 rounded-lg bg-emerald-500 text-white text-xs flex items-center justify-center font-black">
                                1
                              </span>
                              <span className="text-xs sm:text-sm font-extrabold text-slate-900">
                                Primary Action Button (Main Right Button)
                              </span>
                            </div>
                            {renderToggleSwitch(
                              activeBanner.primaryBtnEnabled !== false,
                              () =>
                                handleUpdatePromoBannerField(
                                  activeBanner.id,
                                  'primaryBtnEnabled',
                                  activeBanner.primaryBtnEnabled === false
                                ),
                              'Toggle Primary Button'
                            )}
                          </div>

                          {activeBanner.primaryBtnEnabled !== false && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                              <div>
                                <label className="block text-[10px] font-extrabold uppercase text-slate-600 mb-1">
                                  Button Text:
                                </label>
                                <input
                                  type="text"
                                  value={activeBanner.primaryBtnText || ''}
                                  onChange={(e) =>
                                    handleUpdatePromoBannerField(activeBanner.id, 'primaryBtnText', e.target.value)
                                  }
                                  placeholder="Deal on WhatsApp"
                                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 font-extrabold text-xs text-slate-900 focus:outline-none focus:border-pink-500"
                                />
                              </div>

                              <div>
                                <label className="block text-[10px] font-extrabold uppercase text-slate-600 mb-1">
                                  Click Action:
                                </label>
                                <select
                                  value={activeBanner.primaryBtnAction || 'whatsapp'}
                                  onChange={(e) =>
                                    handleUpdatePromoBannerField(
                                      activeBanner.id,
                                      'primaryBtnAction',
                                      e.target.value as any
                                    )
                                  }
                                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 font-extrabold text-xs text-slate-900 focus:outline-none focus:border-pink-500"
                                >
                                  <option value="whatsapp">💬 Deal on WhatsApp (Opens direct chat)</option>
                                  <option value="webtools">🛠️ Open Live Web Tools Hub</option>
                                  <option value="addfunds">💳 Open Add Funds / Deposit Modal</option>
                                  <option value="custom_url">🔗 External Custom Website Link</option>
                                </select>
                              </div>

                              {activeBanner.primaryBtnAction === 'custom_url' && (
                                <div className="sm:col-span-2">
                                  <label className="block text-[10px] font-extrabold uppercase text-slate-600 mb-1">
                                    Custom Link URL:
                                  </label>
                                  <input
                                    type="text"
                                    value={activeBanner.primaryBtnCustomUrl || ''}
                                    onChange={(e) =>
                                      handleUpdatePromoBannerField(activeBanner.id, 'primaryBtnCustomUrl', e.target.value)
                                    }
                                    placeholder="https://example.com/custom-offer"
                                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 font-mono-code text-xs text-slate-900 focus:outline-none focus:border-pink-500"
                                  />
                                </div>
                              )}
                            </div>
                          )}
                        </div>

                        {/* Secondary Button */}
                        <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-3 shadow-xs">
                          <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                            <div className="flex items-center gap-2">
                              <span className="w-6 h-6 rounded-lg bg-pink-500 text-white text-xs flex items-center justify-center font-black">
                                2
                              </span>
                              <span className="text-xs sm:text-sm font-extrabold text-slate-900">
                                Secondary Button (Left / Alternative Button)
                              </span>
                            </div>
                            {renderToggleSwitch(
                              activeBanner.secondaryBtnEnabled !== false,
                              () =>
                                handleUpdatePromoBannerField(
                                  activeBanner.id,
                                  'secondaryBtnEnabled',
                                  activeBanner.secondaryBtnEnabled === false
                                ),
                              'Toggle Secondary Button'
                            )}
                          </div>

                          {activeBanner.secondaryBtnEnabled !== false && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                              <div>
                                <label className="block text-[10px] font-extrabold uppercase text-slate-600 mb-1">
                                  Button Text:
                                </label>
                                <input
                                  type="text"
                                  value={activeBanner.secondaryBtnText || ''}
                                  onChange={(e) =>
                                    handleUpdatePromoBannerField(activeBanner.id, 'secondaryBtnText', e.target.value)
                                  }
                                  placeholder="Open Web Tools Hub"
                                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 font-extrabold text-xs text-slate-900 focus:outline-none focus:border-pink-500"
                                />
                              </div>

                              <div>
                                <label className="block text-[10px] font-extrabold uppercase text-slate-600 mb-1">
                                  Click Action:
                                </label>
                                <select
                                  value={activeBanner.secondaryBtnAction || 'webtools'}
                                  onChange={(e) =>
                                    handleUpdatePromoBannerField(
                                      activeBanner.id,
                                      'secondaryBtnAction',
                                      e.target.value as any
                                    )
                                  }
                                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 font-extrabold text-xs text-slate-900 focus:outline-none focus:border-pink-500"
                                >
                                  <option value="webtools">🛠️ Open Live Web Tools Hub</option>
                                  <option value="whatsapp">💬 Deal on WhatsApp</option>
                                  <option value="addfunds">💳 Open Add Funds / Deposit Modal</option>
                                  <option value="custom_url">🔗 External Custom Website Link</option>
                                </select>
                              </div>

                              {activeBanner.secondaryBtnAction === 'custom_url' && (
                                <div className="sm:col-span-2">
                                  <label className="block text-[10px] font-extrabold uppercase text-slate-600 mb-1">
                                    Custom Link URL:
                                  </label>
                                  <input
                                    type="text"
                                    value={activeBanner.secondaryBtnCustomUrl || ''}
                                    onChange={(e) =>
                                      handleUpdatePromoBannerField(activeBanner.id, 'secondaryBtnCustomUrl', e.target.value)
                                    }
                                    placeholder="https://example.com/custom-offer"
                                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 font-mono-code text-xs text-slate-900 focus:outline-none focus:border-pink-500"
                                  />
                                </div>
                              )}
                            </div>
                          )}
                        </div>

                        <div className="flex justify-between pt-2">
                          <button
                            type="button"
                            onClick={() => setPromoBannerStep(2)}
                            className="px-4 py-2.5 rounded-xl bg-white text-slate-700 border border-slate-300 font-extrabold text-xs cursor-pointer"
                          >
                            ← Back: Style Theme
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              playPopSound(660);
                              setPromoBannerStep(4);
                            }}
                            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-pink-500 to-rose-600 text-white font-extrabold text-xs shadow-md hover:scale-105 transition cursor-pointer"
                          >
                            Next: Live Preview →
                          </button>
                        </div>
                      </div>
                    )}

                    {/* ==================== STEP 4: LIVE STOREFRONT PREVIEW ==================== */}
                    {promoBannerStep === 4 && (
                      <div className="space-y-4">
                        <div className="p-3 rounded-2xl bg-slate-100 border border-slate-200">
                          <span className="text-xs font-extrabold text-slate-700 flex items-center gap-1.5">
                            <FaEye className="w-3.5 h-3.5 text-pink-600" />
                            <span>Live Storefront Visual Preview (Exact rendering on store):</span>
                          </span>
                        </div>

                        {/* THE RENDERED BANNER */}
                        <div className={styleObj.frame}>
                          <div className={styleObj.inner}>
                            <div className="space-y-1.5 text-center md:text-left flex-grow">
                              <div className={`inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[10px] font-extrabold ${styleObj.badge}`}>
                                <i className={activeBanner.badgeIcon || 'fa-solid fa-bolt'}></i>
                                <span>{activeBanner.badgeText || 'ALL SERVICES AVAILABLE HERE'}</span>
                              </div>
                              <h3 className={`text-base sm:text-xl font-extrabold leading-snug ${styleObj.title}`}>
                                {activeBanner.title || 'Banner Title'}
                              </h3>
                              <p className={`text-xs font-medium leading-relaxed max-w-2xl ${styleObj.desc}`}>
                                {activeBanner.description || 'Banner Description'}
                              </p>
                            </div>

                            <div className="flex flex-wrap items-center justify-center gap-2 flex-shrink-0">
                              {activeBanner.secondaryBtnEnabled !== false && activeBanner.secondaryBtnText && (
                                <button
                                  type="button"
                                  onClick={() => showToast(`Preview Click: ${activeBanner.secondaryBtnText}`)}
                                  className={`px-4 py-2.5 rounded-full font-extrabold text-xs cursor-pointer transition ${styleObj.secondaryBtn}`}
                                >
                                  {activeBanner.secondaryBtnText}
                                </button>
                              )}
                              {activeBanner.primaryBtnEnabled !== false && activeBanner.primaryBtnText && (
                                <button
                                  type="button"
                                  onClick={() => showToast(`Preview Click: ${activeBanner.primaryBtnText}`)}
                                  className={`px-5 py-2.5 rounded-full font-extrabold text-xs cursor-pointer transition flex items-center gap-1.5 ${styleObj.primaryBtn}`}
                                >
                                  <SiWhatsapp className="w-4 h-4" />
                                  <span>{activeBanner.primaryBtnText}</span>
                                </button>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex justify-between pt-2">
                          <button
                            type="button"
                            onClick={() => setPromoBannerStep(3)}
                            className="px-4 py-2.5 rounded-xl bg-white text-slate-700 border border-slate-300 font-extrabold text-xs cursor-pointer"
                          >
                            ← Back: Buttons
                          </button>
                          <button
                            type="button"
                            onClick={async () => {
                              playPopSound(840);
                              if (onSaveSiteConfigToCloud) {
                                await onSaveSiteConfigToCloud(siteConfig, true);
                              }
                              setEditingPromoBannerId(null);
                            }}
                            disabled={isSavingSiteConfig}
                            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-extrabold text-xs shadow-lg hover:scale-105 transition cursor-pointer flex items-center gap-2"
                          >
                            {isSavingSiteConfig ? (
                              <>
                                <i className="fa-solid fa-spinner animate-spin"></i>
                                <span>Saving...</span>
                              </>
                            ) : (
                              <>
                                <i className="fa-solid fa-cloud-arrow-up"></i>
                                <span>✓ Save to Database &amp; Finish</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })()
            ) : (
              /* ==================== BANNER LIST (ALL BANNERS OVERVIEW) ==================== */
              <div className="space-y-3.5">
                <div className="flex items-center justify-between px-1">
                  <span className="text-xs font-extrabold uppercase text-slate-800 flex items-center gap-1.5">
                    <FaTags className="w-3.5 h-3.5 text-pink-600" />
                    <span>All Configured 2 No Promo Banners ({currentPromoBanners.length}):</span>
                  </span>
                  <span className="text-[11px] font-bold text-slate-500">
                    Drag / Reorder, Edit, Toggle or Delete
                  </span>
                </div>

                <div className="space-y-3">
                  {currentPromoBanners.map((banner, idx) => {
                    const isFirst = idx === 0;
                    const isLast = idx === currentPromoBanners.length - 1;
                    const styleObj = getPromoBannerStyleClasses(banner.style);

                    return (
                      <div
                        key={banner.id}
                        className={`rounded-2xl border transition-all p-3.5 sm:p-4 shadow-xs ${
                          banner.enabled !== false
                            ? 'bg-white border-pink-200'
                            : 'bg-slate-50/80 border-slate-300 opacity-60'
                        }`}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div className="flex items-start gap-3 min-w-0">
                            <span className="w-8 h-8 rounded-xl bg-gradient-to-br from-pink-500 to-rose-600 text-white font-extrabold text-xs flex items-center justify-center flex-shrink-0 shadow-2xs mt-0.5">
                              #{idx + 1}
                            </span>
                            <div className="min-w-0 space-y-1">
                              <div className="flex flex-wrap items-center gap-1.5">
                                <span className="inline-flex items-center gap-1 px-2 py-0.2 rounded-full text-[9px] font-black uppercase bg-pink-100 text-pink-700 border border-pink-200">
                                  <i className={banner.badgeIcon || 'fa-solid fa-bolt'}></i>
                                  <span>{banner.badgeText || 'PROMO'}</span>
                                </span>
                                <span className={`px-2 py-0.2 rounded-full text-[9px] font-black uppercase border ${styleObj.pillBg}`}>
                                  {styleObj.themeLabel}
                                </span>
                                <span className="px-2 py-0.2 rounded-full text-[9px] font-extrabold bg-slate-100 text-slate-600 border border-slate-200">
                                  {banner.position === 'above_services' ? 'Top of Store' : 'Below Services'}
                                </span>
                                {banner.enabled === false && (
                                  <span className="px-2 py-0.2 rounded-full text-[9px] font-black bg-rose-100 text-rose-700 border border-rose-200">
                                    HIDDEN (OFF)
                                  </span>
                                )}
                              </div>
                              <div className="text-xs sm:text-sm font-extrabold text-slate-900 line-clamp-1">
                                {banner.title || 'Untitled Banner'}
                              </div>
                              <div className="text-[11px] text-slate-600 line-clamp-1 font-medium">
                                {banner.description || 'No description entered'}
                              </div>
                            </div>
                          </div>

                          {/* Action Buttons Toolbar */}
                          <div className="flex flex-wrap items-center gap-1.5 flex-shrink-0 self-end sm:self-center">
                            {/* Reorder Buttons */}
                            <button
                              type="button"
                              disabled={isFirst}
                              onClick={() => handleMovePromoBanner(banner.id, 'up')}
                              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition cursor-pointer"
                              title="Move Up"
                            >
                              <FaArrowUp className="w-3 h-3" />
                            </button>
                            <button
                              type="button"
                              disabled={isLast}
                              onClick={() => handleMovePromoBanner(banner.id, 'down')}
                              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition cursor-pointer"
                              title="Move Down"
                            >
                              <FaArrowDown className="w-3 h-3" />
                            </button>

                            {/* Clone / Duplicate */}
                            <button
                              type="button"
                              onClick={() => handleDuplicatePromoBanner(banner.id)}
                              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition cursor-pointer"
                              title="Duplicate Banner"
                            >
                              <FaClone className="w-3 h-3" />
                            </button>

                            {/* Show / Hide Toggle */}
                            <button
                              type="button"
                              onClick={() => handleTogglePromoBanner(banner.id)}
                              className={`px-2.5 py-1.5 rounded-xl text-xs font-extrabold transition cursor-pointer flex items-center gap-1 border ${
                                banner.enabled !== false
                                  ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                                  : 'bg-rose-50 text-rose-700 border-rose-300'
                              }`}
                              title={banner.enabled !== false ? 'Hide Banner' : 'Show Banner'}
                            >
                              {banner.enabled !== false ? (
                                <>
                                  <FaEye className="w-3 h-3" />
                                  <span className="text-[10px]">Active</span>
                                </>
                              ) : (
                                <>
                                  <FaEyeSlash className="w-3 h-3" />
                                  <span className="text-[10px]">Hidden</span>
                                </>
                              )}
                            </button>

                            {/* Edit Button */}
                            <button
                              type="button"
                              onClick={() => {
                                playPopSound(660);
                                setEditingPromoBannerId(banner.id);
                                setPromoBannerStep(1);
                              }}
                              className="px-3 py-1.5 rounded-xl bg-pink-500 hover:bg-pink-600 text-white font-extrabold text-xs shadow-xs transition cursor-pointer flex items-center gap-1"
                            >
                              <FaPenToSquare className="w-3 h-3" />
                              <span>Edit</span>
                            </button>

                            {/* Delete Button */}
                            <button
                              type="button"
                              onClick={() => handleDeletePromoBanner(banner.id)}
                              className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 transition cursor-pointer"
                              title="Delete Banner"
                            >
                              <FaTrashCan className="w-3 h-3" />
                            </button>
                          </div>
                        </div>

                        {/* Mini live preview strip */}
                        <div className="mt-3 pt-2.5 border-t border-slate-100">
                          <div className={`p-3 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-2.5 ${styleObj.inner}`}>
                            <div className="space-y-0.5 text-center sm:text-left min-w-0">
                              <div className="text-[11.5px] font-extrabold truncate max-w-xl">
                                {banner.title || 'Banner Title'}
                              </div>
                              <div className="text-[10px] line-clamp-1 opacity-80">
                                {banner.description || 'Description'}
                              </div>
                            </div>
                            <div className="flex items-center gap-1.5 flex-shrink-0">
                              {banner.secondaryBtnEnabled !== false && banner.secondaryBtnText && (
                                <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold ${styleObj.secondaryBtn}`}>
                                  {banner.secondaryBtnText}
                                </span>
                              )}
                              {banner.primaryBtnEnabled !== false && banner.primaryBtnText && (
                                <span className={`px-3 py-1 rounded-full text-[10px] font-extrabold flex items-center gap-1 ${styleObj.primaryBtn}`}>
                                  <SiWhatsapp className="w-3 h-3" />
                                  <span>{banner.primaryBtnText}</span>
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ==================== SCREEN: STOREFRONT BARS, WALLET & TELEMETRY STUDIO (3 STEPS) ==================== */}
      {activeScreen === 'store_bars' && hasScreenPermission('store_bars') && (
        <div className="acrylic-frame rounded-[34px] p-3 sm:p-4">
          <div className="plush-pillow plush-hero rounded-[26px] p-4 sm:p-6 space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-indigo-200 pb-3.5">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-700">
                  🏪 STEP-BY-STEP STOREFRONT BARS &amp; WALLET STUDIO
                </span>
                <h3 className="text-base sm:text-xl font-extrabold text-slate-900">
                  Customize Live Wallet Bar, Server Pulse, Marquee &amp; Search Box
                </h3>
                <p className="text-xs font-semibold text-slate-600">
                  Storefront par dikhne wali har bar (Balance bar, Server status, Search placeholder, Hot searches) ko customize karein!
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    onUpdateSiteConfig((prev) => ({
                      ...prev,
                      storeBars: DEFAULT_STORE_BARS_CONFIG
                    }));
                    showToast('Storefront Bars restored to default!');
                  }}
                  className="px-3 py-1.5 rounded-xl bg-white text-rose-700 border border-rose-200 text-xs font-extrabold cursor-pointer hover:bg-rose-50 transition"
                >
                  Reset Bars
                </button>
              </div>
            </div>

            {/* 3-Step Selector */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {[
                { step: 1 as const, label: '1. Wallet & Payment Bar', icon: '💳' },
                { step: 2 as const, label: '2. Server Status Strip', icon: '⚡' },
                { step: 3 as const, label: '3. Search & Hot Searches', icon: '🔍' }
              ].map((s) => (
                <button
                  key={s.step}
                  type="button"
                  onClick={() => {
                    playPopSound(620);
                    setStoreBarsStep(s.step);
                  }}
                  className={`py-2.5 px-3 rounded-xl text-xs font-extrabold transition cursor-pointer flex items-center justify-center gap-1.5 ${
                    storeBarsStep === s.step
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
                      : 'bg-white/85 text-slate-700 border border-indigo-200 hover:bg-white'
                  }`}
                >
                  <span>{s.icon}</span>
                  <span>{s.label}</span>
                </button>
              ))}
            </div>

            {/* STEP 1: WALLET & PAYMENT BAR */}
            {storeBarsStep === 1 && (
              <div className="space-y-4">
                <div className="rounded-2xl bg-white/90 border border-indigo-200 divide-y divide-slate-200/70 shadow-xs">
                  {/* Master Wallet Bar Switch */}
                  <div className="p-4 flex items-center justify-between gap-3">
                    <div>
                      <div className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                        <span>💳 Show Storefront Live Account Balance Bar</span>
                        {(siteConfig.storeBars?.showWalletBar !== false) ? (
                          <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-extrabold">
                            ON (Visible)
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 text-[10px] font-extrabold">
                            OFF (Hidden)
                          </span>
                        )}
                      </div>
                      <div className="text-xs font-semibold text-slate-600">
                        Dark balance bar with Live Account Balance, +Add Payment button &amp; History
                      </div>
                    </div>
                    {renderToggleSwitch(
                      siteConfig.storeBars?.showWalletBar !== false,
                      () =>
                        onUpdateSiteConfig((prev) => ({
                          ...prev,
                          storeBars: {
                            ...(prev.storeBars || DEFAULT_STORE_BARS_CONFIG),
                            showWalletBar: prev.storeBars?.showWalletBar === false
                          }
                        })),
                      'Show Wallet Bar'
                    )}
                  </div>

                  {/* Balance Label Input */}
                  <div className="p-4 space-y-2">
                    <label className="block text-xs font-extrabold text-slate-900">
                      Balance Header Label
                    </label>
                    <input
                      type="text"
                      value={siteConfig.storeBars?.walletBalanceLabel ?? '● LIVE ACCOUNT BALANCE:'}
                      onChange={(e) =>
                        onUpdateSiteConfig((prev) => ({
                          ...prev,
                          storeBars: {
                            ...(prev.storeBars || DEFAULT_STORE_BARS_CONFIG),
                            walletBalanceLabel: e.target.value
                          }
                        }))
                      }
                      className="w-full px-3.5 py-2 rounded-xl bg-white border-2 border-indigo-300 font-bold text-xs text-slate-900 shadow-inner"
                      placeholder="e.g. ● LIVE ACCOUNT BALANCE:"
                    />
                  </div>

                  {/* Instruction Subtext Toggle & Textarea */}
                  <div className="p-4 space-y-2">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <div className="text-sm font-extrabold text-slate-900">
                          📝 Payment Deposit Instructions Subtext
                        </div>
                        <div className="text-xs font-semibold text-slate-600">
                          Small text under balance (e.g. Add balance via EasyPaisa / JazzCash / Bank...)
                        </div>
                      </div>
                      {renderToggleSwitch(
                        siteConfig.storeBars?.showWalletInstruction !== false,
                        () =>
                          onUpdateSiteConfig((prev) => ({
                            ...prev,
                            storeBars: {
                              ...(prev.storeBars || DEFAULT_STORE_BARS_CONFIG),
                              showWalletInstruction: prev.storeBars?.showWalletInstruction === false
                            }
                          })),
                        'Show Instructions'
                      )}
                    </div>
                    {siteConfig.storeBars?.showWalletInstruction !== false && (
                      <textarea
                        rows={2}
                        value={siteConfig.storeBars?.walletInstructionText ?? 'Add balance via EasyPaisa / JazzCash / Bank (Enter Amount → Select Method → Upload SS → Instant Balance!)'}
                        onChange={(e) =>
                          onUpdateSiteConfig((prev) => ({
                            ...prev,
                            storeBars: {
                              ...(prev.storeBars || DEFAULT_STORE_BARS_CONFIG),
                              walletInstructionText: e.target.value
                            }
                          }))
                        }
                        className="w-full p-2.5 rounded-xl bg-white border-2 border-indigo-300 font-medium text-xs text-slate-900 shadow-inner"
                        placeholder="Enter instructions..."
                      />
                    )}
                  </div>

                  {/* Buttons Settings */}
                  <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-2 p-3 rounded-xl bg-slate-50 border border-slate-200">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-extrabold text-slate-900">+ Add Payment Button</span>
                        {renderToggleSwitch(
                          siteConfig.storeBars?.showAddPaymentBtn !== false,
                          () =>
                            onUpdateSiteConfig((prev) => ({
                              ...prev,
                              storeBars: {
                                ...(prev.storeBars || DEFAULT_STORE_BARS_CONFIG),
                                showAddPaymentBtn: prev.storeBars?.showAddPaymentBtn === false
                              }
                            })),
                          'Show Add Payment Button'
                        )}
                      </div>
                      <input
                        type="text"
                        value={siteConfig.storeBars?.addPaymentBtnLabel ?? '+ Add Payment / Balance'}
                        onChange={(e) =>
                          onUpdateSiteConfig((prev) => ({
                            ...prev,
                            storeBars: {
                              ...(prev.storeBars || DEFAULT_STORE_BARS_CONFIG),
                              addPaymentBtnLabel: e.target.value
                            }
                          }))
                        }
                        className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-slate-300 text-xs font-bold text-slate-900"
                        placeholder="Button Label"
                      />
                    </div>

                    <div className="space-y-2 p-3 rounded-xl bg-slate-50 border border-slate-200">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-extrabold text-slate-900">History Button</span>
                        {renderToggleSwitch(
                          siteConfig.storeBars?.showHistoryBtn !== false,
                          () =>
                            onUpdateSiteConfig((prev) => ({
                              ...prev,
                              storeBars: {
                                ...(prev.storeBars || DEFAULT_STORE_BARS_CONFIG),
                                showHistoryBtn: prev.storeBars?.showHistoryBtn === false
                              }
                            })),
                          'Show History Button'
                        )}
                      </div>
                      <input
                        type="text"
                        value={siteConfig.storeBars?.historyBtnLabel ?? 'History'}
                        onChange={(e) =>
                          onUpdateSiteConfig((prev) => ({
                            ...prev,
                            storeBars: {
                              ...(prev.storeBars || DEFAULT_STORE_BARS_CONFIG),
                              historyBtnLabel: e.target.value
                            }
                          }))
                        }
                        className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-slate-300 text-xs font-bold text-slate-900"
                        placeholder="Button Label"
                      />
                    </div>
                  </div>
                </div>

                {/* Real-time Preview */}
                <div className="space-y-2">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-slate-700">
                    👀 Real-Time Live Preview (Wallet Balance Bar):
                  </span>
                  <div className="rounded-[22px] bg-gradient-to-r from-slate-900 via-indigo-950 to-purple-950 text-white px-4 py-3 border border-white/80 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-3">
                    <div className="flex items-center gap-3 text-center sm:text-left">
                      <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-600 text-white flex items-center justify-center text-lg shadow-md border border-white flex-shrink-0">
                        <i className="fa-solid fa-wallet"></i>
                      </div>
                      <div>
                        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-1.5">
                          <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-300">
                            {siteConfig.storeBars?.walletBalanceLabel ?? '● LIVE ACCOUNT BALANCE:'}
                          </span>
                          <span className="font-display font-bold text-lg text-white">
                            Rs. 1,800
                          </span>
                          <span className="px-2 py-0.5 rounded-full bg-amber-500/25 border border-amber-400/50 text-amber-300 text-[9px] font-extrabold">
                            ⏳ 1 Pending Proof
                          </span>
                        </div>
                        {siteConfig.storeBars?.showWalletInstruction !== false && (
                          <p className="text-[10px] font-medium text-pink-200">
                            {siteConfig.storeBars?.walletInstructionText ?? 'Add balance via EasyPaisa / JazzCash / Bank (Enter Amount → Select Method → Upload SS → Instant Balance!)'}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {siteConfig.storeBars?.showAddPaymentBtn !== false && (
                        <span className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 text-white font-extrabold text-xs shadow">
                          {siteConfig.storeBars?.addPaymentBtnLabel ?? '+ Add Payment / Balance'}
                        </span>
                      )}
                      {siteConfig.storeBars?.showHistoryBtn !== false && (
                        <span className="px-3 py-1.5 rounded-xl bg-white/10 text-white border border-white/20 font-extrabold text-xs">
                          {siteConfig.storeBars?.historyBtnLabel ?? 'History'}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => setStoreBarsStep(2)}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-extrabold text-xs cursor-pointer shadow-md"
                  >
                    Next: Server Status Strip →
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: SERVER STATUS STRIP */}
            {storeBarsStep === 2 && (
              <div className="space-y-4">
                <div className="rounded-2xl bg-white/90 border border-indigo-200 divide-y divide-slate-200/70 shadow-xs">
                  {/* Master Server Status Strip Switch */}
                  <div className="p-4 flex items-center justify-between gap-3">
                    <div>
                      <div className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                        <span>⚡ Show Live Server Pulse &amp; Panel Status Strip</span>
                        {(siteConfig.storeBars?.showStatusPulseBar !== false) ? (
                          <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-extrabold">
                            ON (Visible)
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 text-[10px] font-extrabold">
                            OFF (Hidden)
                          </span>
                        )}
                      </div>
                      <div className="text-xs font-semibold text-slate-600">
                        Top status bar above storefront showing green pulse dot &amp; 3 server speed telemetry chips
                      </div>
                    </div>
                    {renderToggleSwitch(
                      siteConfig.storeBars?.showStatusPulseBar !== false,
                      () =>
                        onUpdateSiteConfig((prev) => ({
                          ...prev,
                          storeBars: {
                            ...(prev.storeBars || DEFAULT_STORE_BARS_CONFIG),
                            showStatusPulseBar: prev.storeBars?.showStatusPulseBar === false
                          }
                        })),
                      'Show Server Status Strip'
                    )}
                  </div>

                  {/* Panel Title & Uptime Badge Inputs */}
                  <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-extrabold text-slate-900 mb-1">
                        Panel Status Title
                      </label>
                      <input
                        type="text"
                        value={siteConfig.storeBars?.statusPanelTitle ?? 'SOHAIB AGENCY LIVE PANEL STATUS:'}
                        onChange={(e) =>
                          onUpdateSiteConfig((prev) => ({
                            ...prev,
                            storeBars: {
                              ...(prev.storeBars || DEFAULT_STORE_BARS_CONFIG),
                              statusPanelTitle: e.target.value
                            }
                          }))
                        }
                        className="w-full px-3 py-2 rounded-xl bg-white border-2 border-indigo-300 font-bold text-xs text-slate-900 shadow-inner"
                        placeholder="e.g. SOHAIB AGENCY LIVE PANEL STATUS:"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-extrabold text-slate-900 mb-1">
                        Status Uptime Badge
                      </label>
                      <input
                        type="text"
                        value={siteConfig.storeBars?.statusPanelBadge ?? 'ALL 3 SERVERS 99.9% ONLINE'}
                        onChange={(e) =>
                          onUpdateSiteConfig((prev) => ({
                            ...prev,
                            storeBars: {
                              ...(prev.storeBars || DEFAULT_STORE_BARS_CONFIG),
                              statusPanelBadge: e.target.value
                            }
                          }))
                        }
                        className="w-full px-3 py-2 rounded-xl bg-white border-2 border-indigo-300 font-bold text-xs text-slate-900 shadow-inner"
                        placeholder="e.g. ALL 3 SERVERS 99.9% ONLINE"
                      />
                    </div>
                  </div>

                  {/* 3 Speed Telemetry Chips */}
                  <div className="p-4 space-y-3">
                    <span className="text-xs font-extrabold text-slate-800 block">
                      3 Speed Telemetry Chips (Turn ON / OFF &amp; Edit Labels / Speeds):
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {/* Chip 1: AI Pro Server */}
                      <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-extrabold text-slate-900">Chip 1: Gemini AI</span>
                          {renderToggleSwitch(
                            siteConfig.storeBars?.chip1Enabled !== false,
                            () =>
                              onUpdateSiteConfig((prev) => ({
                                ...prev,
                                storeBars: {
                                  ...(prev.storeBars || DEFAULT_STORE_BARS_CONFIG),
                                  chip1Enabled: prev.storeBars?.chip1Enabled === false
                                }
                              })),
                            'Toggle Chip 1'
                          )}
                        </div>
                        <input
                          type="text"
                          value={siteConfig.storeBars?.chip1Label ?? 'AI Pro Server:'}
                          onChange={(e) =>
                            onUpdateSiteConfig((prev) => ({
                              ...prev,
                              storeBars: {
                                ...(prev.storeBars || DEFAULT_STORE_BARS_CONFIG),
                                chip1Label: e.target.value
                              }
                            }))
                          }
                          className="w-full px-2 py-1.5 rounded-lg bg-white border border-slate-300 text-xs font-bold text-slate-900"
                          placeholder="Label (AI Pro Server:)"
                        />
                        <input
                          type="text"
                          value={siteConfig.storeBars?.chip1Value ?? '3 Min Avg'}
                          onChange={(e) =>
                            onUpdateSiteConfig((prev) => ({
                              ...prev,
                              storeBars: {
                                ...(prev.storeBars || DEFAULT_STORE_BARS_CONFIG),
                                chip1Value: e.target.value
                              }
                            }))
                          }
                          className="w-full px-2 py-1 rounded-lg bg-white border border-purple-200 text-xs font-extrabold text-emerald-700"
                          placeholder="Value (3 Min Avg)"
                        />
                      </div>

                      {/* Chip 2: SMM Turbo API */}
                      <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-extrabold text-slate-900">Chip 2: TikTok SMM</span>
                          {renderToggleSwitch(
                            siteConfig.storeBars?.chip2Enabled !== false,
                            () =>
                              onUpdateSiteConfig((prev) => ({
                                ...prev,
                                storeBars: {
                                  ...(prev.storeBars || DEFAULT_STORE_BARS_CONFIG),
                                  chip2Enabled: prev.storeBars?.chip2Enabled === false
                                }
                              })),
                            'Toggle Chip 2'
                          )}
                        </div>
                        <input
                          type="text"
                          value={siteConfig.storeBars?.chip2Label ?? 'SMM Turbo API:'}
                          onChange={(e) =>
                            onUpdateSiteConfig((prev) => ({
                              ...prev,
                              storeBars: {
                                ...(prev.storeBars || DEFAULT_STORE_BARS_CONFIG),
                                chip2Label: e.target.value
                              }
                            }))
                          }
                          className="w-full px-2 py-1.5 rounded-lg bg-white border border-slate-300 text-xs font-bold text-slate-900"
                          placeholder="Label (SMM Turbo API:)"
                        />
                        <input
                          type="text"
                          value={siteConfig.storeBars?.chip2Value ?? 'Instant Start'}
                          onChange={(e) =>
                            onUpdateSiteConfig((prev) => ({
                              ...prev,
                              storeBars: {
                                ...(prev.storeBars || DEFAULT_STORE_BARS_CONFIG),
                                chip2Value: e.target.value
                              }
                            }))
                          }
                          className="w-full px-2 py-1 rounded-lg bg-white border border-rose-200 text-xs font-extrabold text-emerald-700"
                          placeholder="Value (Instant Start)"
                        />
                      </div>

                      {/* Chip 3: SIM & NADRA */}
                      <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-extrabold text-slate-900">Chip 3: SIM Tracker</span>
                          {renderToggleSwitch(
                            siteConfig.storeBars?.chip3Enabled !== false,
                            () =>
                              onUpdateSiteConfig((prev) => ({
                                ...prev,
                                storeBars: {
                                  ...(prev.storeBars || DEFAULT_STORE_BARS_CONFIG),
                                  chip3Enabled: prev.storeBars?.chip3Enabled === false
                                }
                              })),
                            'Toggle Chip 3'
                          )}
                        </div>
                        <input
                          type="text"
                          value={siteConfig.storeBars?.chip3Label ?? '2026 SIM/NADRA Desk:'}
                          onChange={(e) =>
                            onUpdateSiteConfig((prev) => ({
                              ...prev,
                              storeBars: {
                                ...(prev.storeBars || DEFAULT_STORE_BARS_CONFIG),
                                chip3Label: e.target.value
                              }
                            }))
                          }
                          className="w-full px-2 py-1.5 rounded-lg bg-white border border-slate-300 text-xs font-bold text-slate-900"
                          placeholder="Label (2026 SIM/NADRA Desk:)"
                        />
                        <input
                          type="text"
                          value={siteConfig.storeBars?.chip3Value ?? '15 Min PDF'}
                          onChange={(e) =>
                            onUpdateSiteConfig((prev) => ({
                              ...prev,
                              storeBars: {
                                ...(prev.storeBars || DEFAULT_STORE_BARS_CONFIG),
                                chip3Value: e.target.value
                              }
                            }))
                          }
                          className="w-full px-2 py-1 rounded-lg bg-white border border-blue-200 text-xs font-extrabold text-emerald-700"
                          placeholder="Value (15 Min PDF)"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Real-time Preview */}
                <div className="space-y-2">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-slate-700">
                    👀 Real-Time Live Preview (Server Status Strip):
                  </span>
                  <div className="rounded-[20px] bg-white px-3.5 py-2.5 border-2 border-indigo-200 shadow-md flex flex-wrap items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 server-pulse-dot"></span>
                      <span className="font-display font-bold text-slate-900 uppercase tracking-wider text-[11px]">
                        {siteConfig.storeBars?.statusPanelTitle ?? 'SOHAIB AGENCY LIVE PANEL STATUS:'}
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-extrabold text-[10px] border border-emerald-300">
                        {siteConfig.storeBars?.statusPanelBadge ?? 'ALL 3 SERVERS 99.9% ONLINE'}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 text-[11px] font-bold text-slate-700">
                      {siteConfig.storeBars?.chip1Enabled !== false && (
                        <span className="inline-flex items-center gap-1 bg-slate-100 px-2.5 py-1 rounded-full border border-slate-200">
                          <span>{siteConfig.storeBars?.chip1Label ?? 'AI Pro Server:'}</span>
                          <strong className="text-emerald-700">{siteConfig.storeBars?.chip1Value ?? '3 Min Avg'}</strong>
                        </span>
                      )}
                      {siteConfig.storeBars?.chip2Enabled !== false && (
                        <span className="inline-flex items-center gap-1 bg-slate-100 px-2.5 py-1 rounded-full border border-slate-200">
                          <span>{siteConfig.storeBars?.chip2Label ?? 'SMM Turbo API:'}</span>
                          <strong className="text-emerald-700">{siteConfig.storeBars?.chip2Value ?? 'Instant Start'}</strong>
                        </span>
                      )}
                      {siteConfig.storeBars?.chip3Enabled !== false && (
                        <span className="inline-flex items-center gap-1 bg-slate-100 px-2.5 py-1 rounded-full border border-slate-200">
                          <span>{siteConfig.storeBars?.chip3Label ?? '2026 SIM/NADRA Desk:'}</span>
                          <strong className="text-emerald-700">{siteConfig.storeBars?.chip3Value ?? '15 Min PDF'}</strong>
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex justify-between">
                  <button
                    type="button"
                    onClick={() => setStoreBarsStep(1)}
                    className="px-4 py-2.5 rounded-xl bg-white text-slate-700 border border-slate-300 font-extrabold text-xs cursor-pointer"
                  >
                    ← Back: Wallet Bar
                  </button>
                  <button
                    type="button"
                    onClick={() => setStoreBarsStep(3)}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-extrabold text-xs cursor-pointer shadow-md"
                  >
                    Next: Search &amp; Hot Searches →
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: SEARCH BOX, HOT SEARCHES & MARQUEE */}
            {storeBarsStep === 3 && (
              <div className="space-y-4">
                <div className="rounded-2xl bg-white/90 border border-indigo-200 divide-y divide-slate-200/70 shadow-xs">
                  {/* Marquee Switch */}
                  <div className="p-4 flex items-center justify-between gap-3">
                    <div>
                      <div className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                        <span>🌟 Show Infinite Brand &amp; AI Tools Marquee</span>
                        {(siteConfig.storeBars?.showMarquee !== false) ? (
                          <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-extrabold">
                            ON
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 text-[10px] font-extrabold">
                            OFF
                          </span>
                        )}
                      </div>
                      <div className="text-xs font-semibold text-slate-600">
                        Top scrolling ticker featuring ChatGPT, Gemini, CapCut, Lovable, ElevenLabs, TikTok, SIM...
                      </div>
                    </div>
                    {renderToggleSwitch(
                      siteConfig.storeBars?.showMarquee !== false,
                      () =>
                        onUpdateSiteConfig((prev) => ({
                          ...prev,
                          storeBars: {
                            ...(prev.storeBars || DEFAULT_STORE_BARS_CONFIG),
                            showMarquee: prev.storeBars?.showMarquee === false
                          }
                        })),
                      'Toggle Marquee'
                    )}
                  </div>

                  {/* Search Box Master Switch */}
                  <div className="p-4 flex items-center justify-between gap-3">
                    <div>
                      <div className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                        <span>🔍 Show Search Input &amp; Category Filters Bar</span>
                        {(siteConfig.storeBars?.showSearchBox !== false) ? (
                          <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-extrabold">
                            ON
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 text-[10px] font-extrabold">
                            OFF
                          </span>
                        )}
                      </div>
                      <div className="text-xs font-semibold text-slate-600">
                        The search input box, Hot Searches chips and Category filter tabs above the product grid
                      </div>
                    </div>
                    {renderToggleSwitch(
                      siteConfig.storeBars?.showSearchBox !== false,
                      () =>
                        onUpdateSiteConfig((prev) => ({
                          ...prev,
                          storeBars: {
                            ...(prev.storeBars || DEFAULT_STORE_BARS_CONFIG),
                            showSearchBox: prev.storeBars?.showSearchBox === false
                          }
                        })),
                      'Toggle Search Box'
                    )}
                  </div>

                  {/* Search Placeholder Input */}
                  <div className="p-4 space-y-2">
                    <label className="block text-xs font-extrabold text-slate-900">
                      Search Box Placeholder Text
                    </label>
                    <input
                      type="text"
                      value={siteConfig.storeBars?.searchPlaceholder ?? 'Search any service (e.g. Lovable Pro, Gemini 18M, ElevenLabs, CDR, NADRA, Hostinger, USDT)...'}
                      onChange={(e) =>
                        onUpdateSiteConfig((prev) => ({
                          ...prev,
                          storeBars: {
                            ...(prev.storeBars || DEFAULT_STORE_BARS_CONFIG),
                            searchPlaceholder: e.target.value
                          }
                        }))
                      }
                      className="w-full px-3.5 py-2 rounded-xl bg-white border-2 border-indigo-300 font-bold text-xs text-slate-900 shadow-inner"
                      placeholder="e.g. Search any service..."
                    />
                  </div>

                  {/* Hot Searches Tags Toggle & Comma-Separated Input */}
                  <div className="p-4 space-y-2">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <div className="text-sm font-extrabold text-slate-900">
                          🔥 Show &ldquo;HOT SEARCHES:&rdquo; Tags Row
                        </div>
                        <div className="text-xs font-semibold text-slate-600">
                          Clickable quick search chips under the search bar
                        </div>
                      </div>
                      {renderToggleSwitch(
                        siteConfig.storeBars?.showHotSearches !== false,
                        () =>
                          onUpdateSiteConfig((prev) => ({
                            ...prev,
                            storeBars: {
                              ...(prev.storeBars || DEFAULT_STORE_BARS_CONFIG),
                              showHotSearches: prev.storeBars?.showHotSearches === false
                            }
                          })),
                        'Show Hot Searches'
                      )}
                    </div>
                    {siteConfig.storeBars?.showHotSearches !== false && (
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">
                          Hot Searches List (Comma-Separated):
                        </label>
                        <textarea
                          rows={2}
                          value={siteConfig.storeBars?.hotSearchesList ?? 'CapCut Pro, Lovable Pro, Gemini 18M, Muse AI 1B, ElevenLabs 300k, TikTok UK/USA, Ad Agency, Call CDR, NADRA FRC, Hostinger 12M, BTC / USDT'}
                          onChange={(e) =>
                            onUpdateSiteConfig((prev) => ({
                              ...prev,
                              storeBars: {
                                ...(prev.storeBars || DEFAULT_STORE_BARS_CONFIG),
                                hotSearchesList: e.target.value
                              }
                            }))
                          }
                          className="w-full p-2.5 rounded-xl bg-white border-2 border-indigo-300 font-medium text-xs text-slate-900 shadow-inner"
                          placeholder="e.g. CapCut Pro, Lovable Pro, Gemini 18M, TikTok UK/USA..."
                        />
                        <span className="text-[10px] text-slate-500 font-semibold">
                          💡 Comma (,) se separate karein — Har keyword storefront par clickable chip button ban jayega!
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Category Tabs & Count Badge Toggles */}
                  <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
                      <div>
                        <span className="text-xs font-extrabold text-slate-900 block">Category Filter Tabs Bar</span>
                        <span className="text-[10px] text-slate-600">All, AI, SMM, SIM tabs row</span>
                      </div>
                      {renderToggleSwitch(
                        siteConfig.storeBars?.showCategoryTabs !== false,
                        () =>
                          onUpdateSiteConfig((prev) => ({
                            ...prev,
                            storeBars: {
                              ...(prev.storeBars || DEFAULT_STORE_BARS_CONFIG),
                              showCategoryTabs: prev.storeBars?.showCategoryTabs === false
                            }
                          })),
                        'Show Category Tabs'
                      )}
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
                      <div>
                        <span className="text-xs font-extrabold text-slate-900 block">&ldquo;Showing X of X&rdquo; Badge</span>
                        <span className="text-[10px] text-slate-600">Product count indicator</span>
                      </div>
                      {renderToggleSwitch(
                        siteConfig.storeBars?.showServicesCountBadge !== false,
                        () =>
                          onUpdateSiteConfig((prev) => ({
                            ...prev,
                            storeBars: {
                              ...(prev.storeBars || DEFAULT_STORE_BARS_CONFIG),
                              showServicesCountBadge: prev.storeBars?.showServicesCountBadge === false
                            }
                          })),
                        'Show Services Count Badge'
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex justify-between pt-2">
                  <button
                    type="button"
                    onClick={() => setStoreBarsStep(2)}
                    className="px-4 py-2.5 rounded-xl bg-white text-slate-700 border border-slate-300 font-extrabold text-xs cursor-pointer"
                  >
                    ← Back: Server Status Strip
                  </button>
                  <button
                    type="button"
                    onClick={async () => {
                      playPopSound(840);
                      if (onSaveSiteConfigToCloud) {
                        await onSaveSiteConfigToCloud(siteConfig, true);
                      }
                      setActiveScreen('home');
                    }}
                    disabled={isSavingSiteConfig}
                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-extrabold text-xs sm:text-sm shadow-lg hover:scale-105 transition cursor-pointer flex items-center gap-2"
                  >
                    {isSavingSiteConfig ? (
                      <>
                        <i className="fa-solid fa-spinner animate-spin"></i>
                        <span>Saving to Database...</span>
                      </>
                    ) : (
                      <>
                        <i className="fa-solid fa-cloud-arrow-up"></i>
                        <span>✓ Save to Database &amp; Return</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ==================== SCREEN 4: PAYMENT METHODS, WALLET BARS & GATEWAYS STUDIO (4 STEPS) ==================== */}
      {activeScreen === 'payment_methods' && hasScreenPermission('payment_methods') && (
        <div className="acrylic-frame rounded-[34px] p-3 sm:p-4">
          <div className="plush-pillow plush-contact rounded-[26px] p-4 sm:p-6 space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-emerald-200 pb-3.5">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-700">
                  🏦 STEP-BY-STEP PAYMENT METHODS, WALLET BARS &amp; GATEWAYS STUDIO
                </span>
                <h3 className="text-base sm:text-xl font-extrabold text-slate-900">
                  Full Payment Gateways, Upper Bar &amp; Live Balance Customizer
                </h3>
                <p className="text-xs font-semibold text-slate-600">
                  Easily add/remove payment accounts, customize upper header pill, storefront wallet bar &amp; accepted gateways card.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    onUpdateSiteConfig((prev) => ({
                      ...prev,
                      paymentMethods: DEPOSIT_METHODS,
                      storeBars: {
                        ...(prev.storeBars || DEFAULT_STORE_BARS_CONFIG),
                        showWalletBar: true,
                        showHeaderWalletPill: true,
                        showAcceptedGatewaysCard: true,
                        currencyPrefix: 'Rs.',
                        headerPillAddLabel: '+Add',
                        walletBalanceLabel: '● LIVE ACCOUNT BALANCE:',
                        walletInstructionText:
                          'Add balance via EasyPaisa / JazzCash / Bank (Enter Amount → Select Method → Upload SS → Instant Balance!)',
                        showWalletInstruction: true,
                        addPaymentBtnLabel: '+ Add Payment / Balance',
                        showAddPaymentBtn: true,
                        historyBtnLabel: 'History',
                        showHistoryBtn: true,
                        showPendingProofBadge: true,
                        acceptedGatewaysTitle: 'Accepted Payment Gateways',
                        acceptedGatewaysSubtitle: '100% Secure Local & Crypto Verification',
                        showGatewaysWhatsappButton: true,
                        showAccountNumbersInCard: true,
                        minDepositAmount: 50
                      }
                    }));
                    showToast('Payment methods & wallet bars restored to default!');
                  }}
                  className="px-3 py-1.5 rounded-xl bg-white text-rose-700 border border-rose-200 text-xs font-extrabold cursor-pointer hover:bg-rose-50 transition"
                >
                  Reset Defaults
                </button>
              </div>
            </div>

            {/* 4 Step Navigation Pills */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                {
                  step: 1 as const,
                  title: '1. Gateways & Accounts',
                  sub: `${siteConfig.paymentMethods.length} Methods (${siteConfig.paymentMethods.filter((m) => m.enabled !== false).length} Active)`,
                  icon: 'fa-solid fa-building-columns'
                },
                {
                  step: 2 as const,
                  title: '2. Upper & Store Bar',
                  sub: 'Pill, Heading & Buttons',
                  icon: 'fa-solid fa-wallet'
                },
                {
                  step: 3 as const,
                  title: '3. Accepted Cards',
                  sub: 'Sidebar, Min SS & Modal',
                  icon: 'fa-solid fa-credit-card'
                },
                {
                  step: 4 as const,
                  title: '4. Live Preview',
                  sub: 'Real-Time Storefront Test',
                  icon: 'fa-solid fa-eye'
                }
              ].map((s) => {
                const isActive = payStep === s.step;
                return (
                  <button
                    key={s.step}
                    type="button"
                    onClick={() => {
                      playPopSound(620);
                      setPayStep(s.step);
                    }}
                    className={`p-3 rounded-2xl border text-left transition cursor-pointer flex items-center gap-2.5 ${
                      isActive
                        ? 'bg-gradient-to-r from-emerald-600 to-teal-700 text-white border-emerald-500 shadow-md scale-[1.02]'
                        : 'bg-white/90 text-slate-800 border-emerald-200 hover:bg-white'
                    }`}
                  >
                    <span
                      className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${
                        isActive ? 'bg-white/20 text-white' : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      <i className={`${s.icon} text-sm`}></i>
                    </span>
                    <div className="min-w-0">
                      <div className="text-xs font-extrabold truncate">{s.title}</div>
                      <div
                        className={`text-[10px] truncate ${
                          isActive ? 'text-emerald-100' : 'text-slate-500 font-medium'
                        }`}
                      >
                        {s.sub}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* ==================== STEP 1: PAYMENT GATEWAYS & ACCOUNTS ==================== */}
            {payStep === 1 && (
              <div className="space-y-4">
                {/* Quick Add Presets Bar */}
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-emerald-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-extrabold text-slate-800">
                      ⚡ Quick Add Popular Payment Gateway Presets:
                    </span>
                    <span className="text-[10px] font-semibold text-slate-500">
                      Click any preset to add instantly
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleAddPaymentMethod('NayaPay')}
                      className="px-2.5 py-1.5 rounded-xl bg-orange-100 hover:bg-orange-200 text-orange-900 border border-orange-300 text-xs font-extrabold transition cursor-pointer flex items-center gap-1"
                    >
                      <i className="fa-solid fa-plus text-[10px]"></i> + NayaPay
                    </button>
                    <button
                      type="button"
                      onClick={() => handleAddPaymentMethod('Meezan Bank')}
                      className="px-2.5 py-1.5 rounded-xl bg-teal-100 hover:bg-teal-200 text-teal-900 border border-teal-300 text-xs font-extrabold transition cursor-pointer flex items-center gap-1"
                    >
                      <i className="fa-solid fa-plus text-[10px]"></i> + Meezan Bank
                    </button>
                    <button
                      type="button"
                      onClick={() => handleAddPaymentMethod('Bank Alfalah / HBL')}
                      className="px-2.5 py-1.5 rounded-xl bg-blue-100 hover:bg-blue-200 text-blue-900 border border-blue-300 text-xs font-extrabold transition cursor-pointer flex items-center gap-1"
                    >
                      <i className="fa-solid fa-plus text-[10px]"></i> + Bank Alfalah / HBL
                    </button>
                    <button
                      type="button"
                      onClick={() => handleAddPaymentMethod('USDT TRC20')}
                      className="px-2.5 py-1.5 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 text-xs font-extrabold transition cursor-pointer flex items-center gap-1"
                    >
                      <i className="fa-solid fa-plus text-[10px]"></i> + USDT TRC20 / Crypto
                    </button>
                    <button
                      type="button"
                      onClick={() => handleAddPaymentMethod('Custom Bank / Gateway')}
                      className="px-2.5 py-1.5 rounded-xl bg-emerald-100 hover:bg-emerald-200 text-emerald-900 border border-emerald-300 text-xs font-extrabold transition cursor-pointer flex items-center gap-1"
                    >
                      <i className="fa-solid fa-plus text-[10px]"></i> + Custom Gateway
                    </button>
                  </div>
                </div>

                {/* Gateway Cards Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {siteConfig.paymentMethods.map((m, idx) => {
                    const isSelected = activePayMethodIdx === idx;
                    const isEnabled = m.enabled !== false;
                    return (
                      <div
                        key={`${m.id}-${idx}`}
                        className={`p-3 rounded-2xl border-2 transition flex flex-col justify-between gap-2.5 ${
                          isSelected
                            ? 'bg-emerald-600 text-white border-white shadow-md scale-[1.02]'
                            : 'bg-white/95 text-slate-800 border-emerald-200 hover:bg-white'
                        }`}
                      >
                        <div
                          onClick={() => {
                            playPopSound(620);
                            setActivePayMethodIdx(idx);
                          }}
                          className="cursor-pointer min-w-0"
                        >
                          <div className="flex items-center justify-between gap-1 mb-1.5">
                            <span
                              className={`w-7 h-7 rounded-xl bg-gradient-to-br ${m.grad} text-white flex items-center justify-center flex-shrink-0 text-xs shadow-xs`}
                            >
                              {renderPaymentMethodIcon(m.id, 'w-3.5 h-3.5 text-white')}
                            </span>
                            <span
                              className={`px-1.5 py-0.5 rounded-full text-[9px] font-extrabold ${
                                isEnabled
                                  ? isSelected
                                    ? 'bg-white/20 text-emerald-100'
                                    : 'bg-emerald-100 text-emerald-800'
                                  : 'bg-rose-100 text-rose-700'
                              }`}
                            >
                              {isEnabled ? '● Active' : '○ Hidden'}
                            </span>
                          </div>
                          <div className="text-xs font-extrabold truncate">{m.id}</div>
                          <div
                            className={`text-[10px] font-mono-code truncate ${
                              isSelected ? 'text-emerald-100' : 'text-slate-500'
                            }`}
                          >
                            {m.accountNumber}
                          </div>
                          <div
                            className={`text-[9px] truncate mt-0.5 ${
                              isSelected ? 'text-white/80' : 'text-slate-600 font-semibold'
                            }`}
                          >
                            {m.accountTitle}
                          </div>
                        </div>

                        <div className="flex items-center justify-between border-t border-slate-200/40 pt-2">
                          <button
                            type="button"
                            onClick={() => updatePaymentMethodField(idx, 'enabled', !isEnabled)}
                            className={`text-[10px] font-extrabold px-2 py-0.5 rounded-lg cursor-pointer ${
                              isEnabled
                                ? isSelected
                                  ? 'bg-white/20 hover:bg-white/30 text-white'
                                  : 'bg-emerald-100 hover:bg-emerald-200 text-emerald-800'
                                : 'bg-slate-200 hover:bg-slate-300 text-slate-700'
                            }`}
                          >
                            {isEnabled ? 'Turn Off' : 'Turn On'}
                          </button>

                          {siteConfig.paymentMethods.length > 1 && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeletePaymentMethod(idx);
                              }}
                              title={`Delete ${m.id}`}
                              className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs cursor-pointer ${
                                isSelected
                                  ? 'bg-rose-500/80 hover:bg-rose-600 text-white'
                                  : 'bg-rose-100 hover:bg-rose-200 text-rose-700'
                              }`}
                            >
                              <i className="fa-solid fa-trash-can text-[10px]"></i>
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Active Payment Method Step Form */}
                {(() => {
                  const currentMethod =
                    siteConfig.paymentMethods[activePayMethodIdx] || siteConfig.paymentMethods[0];
                  if (!currentMethod) return null;

                  return (
                    <div className="p-4 sm:p-5 rounded-2xl bg-white/95 border-2 border-emerald-200 space-y-4 shadow-xs">
                      <div className="flex flex-wrap items-center justify-between border-b border-slate-200 pb-3 gap-2">
                        <div className="flex items-center gap-3">
                          <span
                            className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${currentMethod.grad} text-white flex items-center justify-center shadow`}
                          >
                            {renderPaymentMethodIcon(currentMethod.id, 'w-5 h-5 text-white')}
                          </span>
                          <div>
                            <h4 className="text-sm sm:text-base font-extrabold text-slate-900">
                              Editing: {currentMethod.id}
                            </h4>
                            <p className="text-[11px] font-semibold text-slate-500">
                              Method {activePayMethodIdx + 1} of {siteConfig.paymentMethods.length} Payment Gateways
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-xs font-extrabold text-slate-700">
                            {currentMethod.enabled !== false ? 'Enabled on Store' : 'Hidden from Store'}
                          </span>
                          {renderToggleSwitch(
                            currentMethod.enabled !== false,
                            () =>
                              updatePaymentMethodField(
                                activePayMethodIdx,
                                'enabled',
                                currentMethod.enabled === false
                              ),
                            `Toggle ${currentMethod.id}`
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                        <div>
                          <label className="block text-xs font-extrabold text-slate-900 mb-1">
                            1. Gateway Name / ID *
                          </label>
                          <input
                            type="text"
                            value={currentMethod.id}
                            onChange={(e) =>
                              updatePaymentMethodField(
                                activePayMethodIdx,
                                'id',
                                e.target.value
                              )
                            }
                            placeholder="e.g. EasyPaisa, JazzCash, Nayapay"
                            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border-2 border-emerald-300 font-bold text-xs sm:text-sm text-slate-900"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-extrabold text-slate-900 mb-1">
                            2. Account Holder Name (Title) *
                          </label>
                          <input
                            type="text"
                            value={currentMethod.accountTitle}
                            onChange={(e) =>
                              updatePaymentMethodField(
                                activePayMethodIdx,
                                'accountTitle',
                                e.target.value
                              )
                            }
                            placeholder="e.g. Sohaib"
                            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border-2 border-emerald-300 font-bold text-xs sm:text-sm text-slate-900"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-extrabold text-slate-900 mb-1">
                            3. Account Number / IBAN / UID *
                          </label>
                          <input
                            type="text"
                            value={currentMethod.accountNumber}
                            onChange={(e) =>
                              updatePaymentMethodField(
                                activePayMethodIdx,
                                'accountNumber',
                                e.target.value
                              )
                            }
                            placeholder="e.g. 0347-8936242"
                            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border-2 border-emerald-300 font-mono-code font-bold text-xs sm:text-sm text-slate-900"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                        <div>
                          <label className="block text-xs font-extrabold text-slate-900 mb-1">
                            4. Full Method Display Title
                          </label>
                          <input
                            type="text"
                            value={currentMethod.label}
                            onChange={(e) =>
                              updatePaymentMethodField(activePayMethodIdx, 'label', e.target.value)
                            }
                            placeholder="e.g. EasyPaisa Mobile Account"
                            className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-300 font-bold text-xs text-slate-900"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-extrabold text-slate-900 mb-1">
                            5. Top Badge Tag
                          </label>
                          <input
                            type="text"
                            value={currentMethod.shortTag}
                            onChange={(e) =>
                              updatePaymentMethodField(activePayMethodIdx, 'shortTag', e.target.value)
                            }
                            placeholder="e.g. ⚡ Instant Auto-Verify"
                            className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-300 font-bold text-xs text-slate-900"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-extrabold text-slate-900 mb-1">
                          6. Customer Payment Instructions Note
                        </label>
                        <input
                          type="text"
                          value={currentMethod.extraInfo}
                          onChange={(e) =>
                            updatePaymentMethodField(activePayMethodIdx, 'extraInfo', e.target.value)
                          }
                          placeholder="e.g. Send via EasyPaisa App or *786# and take screenshot"
                          className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-300 font-semibold text-xs text-slate-900"
                        />
                      </div>

                      {/* Color Theme Selector */}
                      <div>
                        <label className="block text-xs font-extrabold text-slate-900 mb-1">
                          7. Card &amp; Icon Color Gradient:
                        </label>
                        <div className="flex flex-wrap items-center gap-2">
                          {[
                            { name: 'Emerald Green', grad: 'from-emerald-500 to-green-600' },
                            { name: 'Rose Red', grad: 'from-rose-500 to-red-600' },
                            { name: 'Teal Cyan', grad: 'from-teal-500 to-cyan-600' },
                            { name: 'Amber Gold', grad: 'from-amber-500 to-yellow-600' },
                            { name: 'Blue Indigo', grad: 'from-blue-600 to-indigo-700' },
                            { name: 'Purple Violet', grad: 'from-purple-600 to-pink-600' },
                            { name: 'Orange Amber', grad: 'from-orange-500 to-amber-600' }
                          ].map((c) => (
                            <button
                              key={c.grad}
                              type="button"
                              onClick={() => updatePaymentMethodField(activePayMethodIdx, 'grad', c.grad)}
                              className={`px-3 py-1.5 rounded-xl text-xs font-extrabold text-white bg-gradient-to-r ${c.grad} shadow-xs cursor-pointer flex items-center gap-1.5 border-2 ${
                                currentMethod.grad === c.grad ? 'border-slate-900 scale-105' : 'border-transparent'
                              }`}
                            >
                              <span>{c.name}</span>
                              {currentMethod.grad === c.grad && <i className="fa-solid fa-check text-[10px]"></i>}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-2">
                        <button
                          type="button"
                          onClick={() =>
                            setActivePayMethodIdx((prev) =>
                              prev > 0 ? prev - 1 : siteConfig.paymentMethods.length - 1
                            )
                          }
                          className="px-4 py-2.5 rounded-xl bg-slate-100 text-slate-700 font-extrabold text-xs cursor-pointer"
                        >
                          ← Previous Method
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            playPopSound(820);
                            showToast(`✅ ${currentMethod.id} Account Details Saved!`);
                            if (activePayMethodIdx < siteConfig.paymentMethods.length - 1) {
                              setActivePayMethodIdx(activePayMethodIdx + 1);
                            } else {
                              setPayStep(2);
                            }
                          }}
                          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-extrabold text-xs shadow-md cursor-pointer"
                        >
                          {activePayMethodIdx < siteConfig.paymentMethods.length - 1
                            ? 'Save & Next Method →'
                            : 'Save & Proceed to Upper/Store Bars →'}
                        </button>
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}

            {/* ==================== STEP 2: UPPER BAR & STOREFRONT LIVE BALANCE BAR ==================== */}
            {payStep === 2 && (
              <div className="p-4 sm:p-5 rounded-2xl bg-white/95 border-2 border-emerald-200 space-y-5 shadow-xs">
                {/* 1. Header Upper Navigation Wallet Pill */}
                <div className="space-y-3 border-b border-slate-200 pb-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <h4 className="text-sm sm:text-base font-extrabold text-slate-900">
                        1. Header Upper Bar Wallet Balance Pill
                      </h4>
                      <p className="text-[11px] font-semibold text-slate-500">
                        Top header navigation bar wallet button with live user balance and +Add funds trigger.
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-extrabold text-slate-700">
                        {(siteConfig.storeBars?.showHeaderWalletPill ?? activeVisibility.showHeaderWalletPill)
                          ? 'Pill Visible'
                          : 'Pill Hidden'}
                      </span>
                      {renderToggleSwitch(
                        siteConfig.storeBars?.showHeaderWalletPill ?? activeVisibility.showHeaderWalletPill,
                        () => {
                          const currentVal =
                            siteConfig.storeBars?.showHeaderWalletPill ?? activeVisibility.showHeaderWalletPill;
                          updateStoreBarsField('showHeaderWalletPill', !currentVal);
                          toggleSiteVisibilityKey('showHeaderWalletPill', 'Header Wallet Pill');
                        },
                        'Toggle Header Wallet Pill'
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-xs font-extrabold text-slate-900 mb-1">
                        Currency Symbol / Prefix (Rs. / PKR / $ / USDT)
                      </label>
                      <input
                        type="text"
                        value={siteConfig.storeBars?.currencyPrefix || 'Rs.'}
                        onChange={(e) => updateStoreBarsField('currencyPrefix', e.target.value)}
                        placeholder="e.g. Rs. or PKR or $"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border-2 border-emerald-300 font-bold text-xs sm:text-sm text-slate-900"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-extrabold text-slate-900 mb-1">
                        Header Pill Action Badge Text (+Add / Top-Up / Deposit)
                      </label>
                      <input
                        type="text"
                        value={siteConfig.storeBars?.headerPillAddLabel || '+Add'}
                        onChange={(e) => updateStoreBarsField('headerPillAddLabel', e.target.value)}
                        placeholder="e.g. +Add or Deposit"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border-2 border-emerald-300 font-bold text-xs sm:text-sm text-slate-900"
                      />
                    </div>
                  </div>
                </div>

                {/* 2. Storefront Live Wallet Balance Bar */}
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-3">
                    <div>
                      <h4 className="text-sm sm:text-base font-extrabold text-slate-900">
                        2. Storefront Live Wallet Balance &amp; Payment Bar
                      </h4>
                      <p className="text-[11px] font-semibold text-slate-500">
                        The prominent gradient bar directly above the store tools and products feed.
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-extrabold text-slate-700">
                        {(siteConfig.storeBars?.showWalletBar ?? activeVisibility.showStoreWalletBar)
                          ? 'Bar Active'
                          : 'Bar Hidden'}
                      </span>
                      {renderToggleSwitch(
                        siteConfig.storeBars?.showWalletBar ?? activeVisibility.showStoreWalletBar,
                        () => {
                          const currentVal =
                            siteConfig.storeBars?.showWalletBar ?? activeVisibility.showStoreWalletBar;
                          updateStoreBarsField('showWalletBar', !currentVal);
                          toggleSiteVisibilityKey('showStoreWalletBar', 'Storefront Wallet Bar');
                        },
                        'Toggle Storefront Wallet Bar'
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-xs font-extrabold text-slate-900 mb-1">
                        Live Balance Heading Label:
                      </label>
                      <input
                        type="text"
                        value={siteConfig.storeBars?.walletBalanceLabel || '● LIVE ACCOUNT BALANCE:'}
                        onChange={(e) => updateStoreBarsField('walletBalanceLabel', e.target.value)}
                        placeholder="e.g. ● LIVE ACCOUNT BALANCE:"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 font-bold text-xs sm:text-sm text-slate-900"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-extrabold text-slate-900 mb-1">
                        Add Payment Button Label:
                      </label>
                      <input
                        type="text"
                        value={siteConfig.storeBars?.addPaymentBtnLabel || '+ Add Payment / Balance'}
                        onChange={(e) => updateStoreBarsField('addPaymentBtnLabel', e.target.value)}
                        placeholder="e.g. + Add Payment / Balance"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 font-bold text-xs sm:text-sm text-slate-900"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs font-extrabold text-slate-900">
                        Customer Instruction Note Text:
                      </label>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-bold text-slate-600">
                          {(siteConfig.storeBars?.showWalletInstruction ?? true) ? 'Visible' : 'Hidden'}
                        </span>
                        {renderToggleSwitch(
                          siteConfig.storeBars?.showWalletInstruction ?? true,
                          () =>
                            updateStoreBarsField(
                              'showWalletInstruction',
                              !(siteConfig.storeBars?.showWalletInstruction ?? true)
                            ),
                          'Toggle Instruction Note'
                        )}
                      </div>
                    </div>
                    <textarea
                      rows={2}
                      value={
                        siteConfig.storeBars?.walletInstructionText ||
                        'Add balance via EasyPaisa / JazzCash / Bank (Enter Amount → Select Method → Upload SS → Instant Balance!)'
                      }
                      onChange={(e) => updateStoreBarsField('walletInstructionText', e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-300 font-semibold text-xs text-slate-900"
                    />
                  </div>

                  {/* Secondary Toggles in Wallet Bar */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                      <div>
                        <div className="text-xs font-extrabold text-slate-900">+ Add Button</div>
                        <div className="text-[10px] text-slate-500">Opens Add Funds modal</div>
                      </div>
                      {renderToggleSwitch(
                        siteConfig.storeBars?.showAddPaymentBtn ?? true,
                        () =>
                          updateStoreBarsField(
                            'showAddPaymentBtn',
                            !(siteConfig.storeBars?.showAddPaymentBtn ?? true)
                          ),
                        'Toggle Add Button'
                      )}
                    </div>

                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                      <div>
                        <div className="text-xs font-extrabold text-slate-900">History Button</div>
                        <div className="text-[10px] text-slate-500">Opens transaction tab</div>
                      </div>
                      {renderToggleSwitch(
                        siteConfig.storeBars?.showHistoryBtn ?? true,
                        () =>
                          updateStoreBarsField(
                            'showHistoryBtn',
                            !(siteConfig.storeBars?.showHistoryBtn ?? true)
                          ),
                        'Toggle History Button'
                      )}
                    </div>

                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                      <div>
                        <div className="text-xs font-extrabold text-slate-900">Pending Proofs Badge</div>
                        <div className="text-[10px] text-slate-500">Shows pending count</div>
                      </div>
                      {renderToggleSwitch(
                        siteConfig.storeBars?.showPendingProofBadge ?? true,
                        () =>
                          updateStoreBarsField(
                            'showPendingProofBadge',
                            !(siteConfig.storeBars?.showPendingProofBadge ?? true)
                          ),
                        'Toggle Pending Proofs Badge'
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <button
                      type="button"
                      onClick={() => setPayStep(1)}
                      className="px-4 py-2.5 rounded-xl bg-slate-100 text-slate-700 font-extrabold text-xs cursor-pointer"
                    >
                      ← Back to Gateways
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        playPopSound(720);
                        setPayStep(3);
                      }}
                      className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-extrabold text-xs shadow-md cursor-pointer"
                    >
                      Save &amp; Go to Accepted Cards →
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ==================== STEP 3: ACCEPTED PAYMENT GATEWAYS CARDS & MODALS ==================== */}
            {payStep === 3 && (
              <div className="p-4 sm:p-5 rounded-2xl bg-white/95 border-2 border-emerald-200 space-y-5 shadow-xs">
                {/* 1. Accepted Payment Gateways Card */}
                <div className="space-y-4 border-b border-slate-200 pb-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <h4 className="text-sm sm:text-base font-extrabold text-slate-900">
                        1. Accepted Payment Gateways Showcase Card
                      </h4>
                      <p className="text-[11px] font-semibold text-slate-500">
                        Displayed in the contact section and sidebars showing accepted payment logos and account numbers.
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-extrabold text-slate-700">
                        {(siteConfig.storeBars?.showAcceptedGatewaysCard ?? true)
                          ? 'Card Active'
                          : 'Card Hidden'}
                      </span>
                      {renderToggleSwitch(
                        siteConfig.storeBars?.showAcceptedGatewaysCard ?? true,
                        () =>
                          updateStoreBarsField(
                            'showAcceptedGatewaysCard',
                            !(siteConfig.storeBars?.showAcceptedGatewaysCard ?? true)
                          ),
                        'Toggle Accepted Gateways Card'
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-xs font-extrabold text-slate-900 mb-1">
                        Card Section Heading:
                      </label>
                      <input
                        type="text"
                        value={siteConfig.storeBars?.acceptedGatewaysTitle || 'Accepted Payment Gateways'}
                        onChange={(e) => updateStoreBarsField('acceptedGatewaysTitle', e.target.value)}
                        placeholder="e.g. Accepted Payment Gateways"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 font-bold text-xs sm:text-sm text-slate-900"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-extrabold text-slate-900 mb-1">
                        Card Subtitle / Security Guarantee:
                      </label>
                      <input
                        type="text"
                        value={
                          siteConfig.storeBars?.acceptedGatewaysSubtitle ||
                          '100% Secure Local & Crypto Verification'
                        }
                        onChange={(e) => updateStoreBarsField('acceptedGatewaysSubtitle', e.target.value)}
                        placeholder="e.g. 100% Secure Local & Crypto Verification"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 font-bold text-xs sm:text-sm text-slate-900"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                      <div>
                        <div className="text-xs font-extrabold text-slate-900">
                          Show Account Numbers Directly on Card
                        </div>
                        <div className="text-[10px] text-slate-500">
                          Displays 0347-8936242 in the preview blocks
                        </div>
                      </div>
                      {renderToggleSwitch(
                        siteConfig.storeBars?.showAccountNumbersInCard ?? true,
                        () =>
                          updateStoreBarsField(
                            'showAccountNumbersInCard',
                            !(siteConfig.storeBars?.showAccountNumbersInCard ?? true)
                          ),
                        'Toggle Account Numbers on Card'
                      )}
                    </div>

                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                      <div>
                        <div className="text-xs font-extrabold text-slate-900">
                          WhatsApp Direct Copy Button
                        </div>
                        <div className="text-[10px] text-slate-500">
                          Shows &ldquo;Primary WhatsApp: +92 347...&rdquo; button
                        </div>
                      </div>
                      {renderToggleSwitch(
                        siteConfig.storeBars?.showGatewaysWhatsappButton ?? true,
                        () =>
                          updateStoreBarsField(
                            'showGatewaysWhatsappButton',
                            !(siteConfig.storeBars?.showGatewaysWhatsappButton ?? true)
                          ),
                        'Toggle WhatsApp Button on Card'
                      )}
                    </div>
                  </div>
                </div>

                {/* 2. Add Funds & Checkout Modals Settings */}
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm sm:text-base font-extrabold text-slate-900">
                      2. Add Funds &amp; Deposit Modal Settings
                    </h4>
                    <p className="text-[11px] font-semibold text-slate-500">
                      Controls minimum deposit amount and instructions presented when users top-up wallet.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                    <div>
                      <label className="block text-xs font-extrabold text-slate-900 mb-1">
                        Minimum Deposit Amount ({siteConfig.storeBars?.currencyPrefix || 'Rs.'})
                      </label>
                      <input
                        type="number"
                        min={10}
                        step={10}
                        value={siteConfig.storeBars?.minDepositAmount ?? 50}
                        onChange={(e) =>
                          updateStoreBarsField('minDepositAmount', Number(e.target.value) || 50)
                        }
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border-2 border-emerald-300 font-bold text-xs sm:text-sm text-slate-900"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs font-extrabold text-slate-900 mb-1">
                        Deposit Modal Subtitle / Instructions:
                      </label>
                      <input
                        type="text"
                        value={
                          siteConfig.storeBars?.depositModalSubtitle ||
                          'Enter Amount → Select EasyPaisa/JazzCash → Submit Account Name & Screenshot'
                        }
                        onChange={(e) => updateStoreBarsField('depositModalSubtitle', e.target.value)}
                        placeholder="e.g. Enter Amount → Select Method → Upload Screenshot"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 font-bold text-xs sm:text-sm text-slate-900"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <button
                      type="button"
                      onClick={() => setPayStep(2)}
                      className="px-4 py-2.5 rounded-xl bg-slate-100 text-slate-700 font-extrabold text-xs cursor-pointer"
                    >
                      ← Back to Upper/Store Bars
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        playPopSound(720);
                        setPayStep(4);
                      }}
                      className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-extrabold text-xs shadow-md cursor-pointer"
                    >
                      Save &amp; View Live Preview →
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ==================== STEP 4: INTERACTIVE REAL-TIME LIVE PREVIEW ==================== */}
            {payStep === 4 && (
              <div className="p-4 sm:p-5 rounded-2xl bg-white/95 border-2 border-emerald-200 space-y-5 shadow-xs">
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-700">
                    👀 REAL-TIME LIVE PREVIEW
                  </span>
                  <h4 className="text-base sm:text-lg font-extrabold text-slate-900">
                    Live Storefront Payment Bars &amp; Cards Preview
                  </h4>
                  <p className="text-xs font-semibold text-slate-600">
                    Here is exactly how your live payment buttons, bars, and accepted gateways appear to customers right now.
                  </p>
                </div>

                {/* 1. Header Pill Preview */}
                <div className="p-3.5 rounded-2xl bg-slate-900 text-white space-y-2">
                  <div className="text-[10px] font-extrabold uppercase text-slate-400">
                    Top Header Navigation Preview:
                  </div>
                  <div className="flex items-center justify-between bg-slate-950/80 p-3 rounded-xl border border-white/10">
                    <div className="flex items-center gap-2">
                      <span className="w-7 h-7 rounded-lg bg-pink-600 text-white flex items-center justify-center text-xs font-bold">
                        MS
                      </span>
                      <span className="text-xs font-extrabold text-white">Sohaib Agency</span>
                    </div>

                    {(siteConfig.storeBars?.showHeaderWalletPill ?? activeVisibility.showHeaderWalletPill) ? (
                      <div className="px-3 py-1.5 rounded-full bg-gradient-to-r from-emerald-500 via-teal-500 to-green-600 text-white font-extrabold text-xs shadow-md flex items-center gap-1.5 border border-white/80 animate-pulse">
                        <i className="fa-solid fa-wallet text-sky-200"></i>
                        <span>
                          {siteConfig.storeBars?.currencyPrefix || 'Rs.'} 12,500
                        </span>
                        <span className="px-1.5 py-0.2 rounded-full bg-white/25 text-[9px] font-extrabold">
                          {siteConfig.storeBars?.headerPillAddLabel || '+Add'}
                        </span>
                      </div>
                    ) : (
                      <span className="text-[11px] font-bold text-rose-400 italic">
                        [Header Wallet Pill is Hidden]
                      </span>
                    )}
                  </div>
                </div>

                {/* 2. Storefront Live Balance Bar Preview */}
                <div className="space-y-2">
                  <div className="text-[10px] font-extrabold uppercase text-slate-700">
                    Storefront Live Wallet Balance Bar Preview:
                  </div>

                  {(siteConfig.storeBars?.showWalletBar ?? activeVisibility.showStoreWalletBar) ? (
                    <div className="rounded-[22px] bg-gradient-to-r from-slate-900 via-indigo-950 to-purple-950 text-white px-4 py-3.5 border border-white/80 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-3">
                      <div className="flex items-center gap-3 text-center sm:text-left">
                        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-600 text-white flex items-center justify-center text-lg shadow-md border border-white flex-shrink-0">
                          <i className="fa-solid fa-wallet"></i>
                        </div>
                        <div>
                          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-1.5">
                            <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-300">
                              {siteConfig.storeBars?.walletBalanceLabel || '● LIVE ACCOUNT BALANCE:'}
                            </span>
                            <span className="font-display font-bold text-lg text-white">
                              {siteConfig.storeBars?.currencyPrefix || 'Rs.'} 12,500
                            </span>
                            {(siteConfig.storeBars?.showPendingProofBadge ?? true) && (
                              <span className="px-2 py-0.5 rounded-full bg-amber-500/25 border border-amber-400/50 text-amber-300 text-[9px] font-extrabold">
                                ⏳ 1 Pending Proof
                              </span>
                            )}
                          </div>
                          {(siteConfig.storeBars?.showWalletInstruction ?? true) && (
                            <p className="text-[10px] font-medium text-pink-200">
                              {siteConfig.storeBars?.walletInstructionText ||
                                'Add balance via EasyPaisa / JazzCash / Bank (Enter Amount → Select Method → Upload SS → Instant Balance!)'}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {(siteConfig.storeBars?.showAddPaymentBtn ?? true) && (
                          <button
                            type="button"
                            className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 text-white font-extrabold text-xs shadow cursor-pointer flex items-center gap-1"
                          >
                            <i className="fa-solid fa-circle-plus text-amber-200"></i>
                            <span>
                              {siteConfig.storeBars?.addPaymentBtnLabel || '+ Add Payment / Balance'}
                            </span>
                          </button>
                        )}
                        {(siteConfig.storeBars?.showHistoryBtn ?? true) && (
                          <button
                            type="button"
                            className="px-3 py-2 rounded-xl bg-white/10 text-white border border-white/20 font-extrabold text-xs"
                          >
                            <i className="fa-solid fa-receipt mr-1 text-pink-300"></i>
                            {siteConfig.storeBars?.historyBtnLabel || 'History'}
                          </button>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 rounded-xl bg-slate-100 text-slate-500 text-center text-xs font-bold border border-dashed border-slate-300">
                      🚫 Storefront Live Wallet Balance Bar is Currently Hidden
                    </div>
                  )}
                </div>

                {/* 3. Accepted Gateways Card Preview */}
                <div className="space-y-2">
                  <div className="text-[10px] font-extrabold uppercase text-slate-700">
                    Accepted Payment Gateways Card Preview:
                  </div>

                  {(siteConfig.storeBars?.showAcceptedGatewaysCard ?? true) ? (
                    <div className="plush-pillow plush-contact rounded-[24px] p-4 space-y-3 max-w-md">
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
                              className="bg-white/85 p-2.5 rounded-xl border border-white flex flex-col justify-between shadow-xs"
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
                        <div className="w-full py-2 rounded-xl bg-white text-emerald-800 border border-emerald-200 text-[11px] font-extrabold shadow-xs text-center">
                          <i className="fa-regular fa-copy mr-1"></i>Primary WhatsApp: +92 347 8936242
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="p-4 rounded-xl bg-slate-100 text-slate-500 text-center text-xs font-bold border border-dashed border-slate-300">
                      🚫 Accepted Payment Gateways Card is Currently Hidden
                    </div>
                  )}
                </div>

                {/* Return Buttons */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-200">
                  <button
                    type="button"
                    onClick={() => setPayStep(3)}
                    className="px-4 py-2.5 rounded-xl bg-slate-100 text-slate-700 font-extrabold text-xs cursor-pointer"
                  >
                    ← Back to Step 3
                  </button>

                  <button
                    type="button"
                    onClick={async () => {
                      playPopSound(880);
                      if (onSaveSiteConfigToCloud) {
                        await onSaveSiteConfigToCloud(siteConfig, true);
                      }
                      setActiveScreen('home');
                    }}
                    disabled={isSavingSiteConfig}
                    className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-green-600 text-white font-extrabold text-xs shadow-lg cursor-pointer hover:scale-105 transition flex items-center gap-2"
                  >
                    {isSavingSiteConfig ? (
                      <>
                        <i className="fa-solid fa-spinner animate-spin"></i>
                        <span>Saving to Database...</span>
                      </>
                    ) : (
                      <>
                        <i className="fa-solid fa-cloud-arrow-up"></i>
                        <span>✓ Save to Database &amp; Return</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ==================== SCREEN 5: WHATSAPP NUMBER, SOCIALS & FOOTER LINKS (3 STEPS) ==================== */}
      {activeScreen === 'contact_footer' && hasScreenPermission('contact_footer') && (
        <div className="acrylic-frame rounded-[34px] p-3 sm:p-4">
          <div className="plush-pillow plush-about rounded-[26px] p-4 sm:p-6 space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-indigo-200 pb-3.5">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-700">
                  📱 STEP-BY-STEP WHATSAPP, SOCIALS &amp; FOOTER STUDIO
                </span>
                <h3 className="text-base sm:text-xl font-extrabold text-slate-900">
                  Update Primary WhatsApp Number, Social Links &amp; Footer Branding
                </h3>
              </div>
              <button
                type="button"
                onClick={() => {
                  onUpdateSiteConfig((prev) => ({
                    ...prev,
                    contact: DEFAULT_SITE_CONFIG.contact,
                    socials: DEFAULT_SITE_CONFIG.socials,
                    footer: DEFAULT_SITE_CONFIG.footer
                  }));
                  showToast('Contact & Footer settings restored to default!');
                }}
                className="px-3 py-1.5 rounded-xl bg-white text-rose-700 border border-rose-200 text-xs font-extrabold cursor-pointer"
              >
                Reset Contact &amp; Footer
              </button>
            </div>

            {/* 3-Step Selector */}
            <div className="grid grid-cols-3 gap-2">
              {[
                { step: 1 as const, label: '1. WhatsApp & Website', short: '1. WhatsApp' },
                { step: 2 as const, label: '2. Social Media Links', short: '2. Socials' },
                { step: 3 as const, label: '3. Footer & Tagline', short: '3. Footer' }
              ].map((s) => (
                <button
                  key={s.step}
                  type="button"
                  onClick={() => {
                    playPopSound(620);
                    setContactStep(s.step);
                  }}
                  className={`py-2.5 px-3 rounded-xl text-xs font-extrabold transition cursor-pointer ${
                    contactStep === s.step
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-md'
                      : 'bg-white/85 text-slate-700 border border-indigo-200'
                  }`}
                >
                  <span className="hidden sm:inline truncate">{s.label}</span>
                  <span className="sm:hidden truncate">{s.short}</span>
                </button>
              ))}
            </div>

            {contactStep === 1 && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-extrabold text-slate-900 mb-1">
                      1. Primary WhatsApp Display Number (Shown on Buttons) *
                    </label>
                    <input
                      type="text"
                      value={siteConfig.contact.whatsappNumberDisplay}
                      onChange={(e) => {
                        const displayVal = e.target.value;
                        const digits = displayVal.replace(/[^0-9]/g, '');
                        const normalizedClean = digits.startsWith('03')
                          ? '92' + digits.slice(1)
                          : digits || siteConfig.contact.whatsappNumberClean;
                        onUpdateSiteConfig((prev) => ({
                          ...prev,
                          contact: {
                            ...prev.contact,
                            whatsappNumberDisplay: displayVal,
                            whatsappNumberClean: normalizedClean
                          }
                        }));
                      }}
                      placeholder="+92 347 8936242"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border-2 border-emerald-400 font-mono-code font-bold text-xs sm:text-sm text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-extrabold text-slate-900 mb-1">
                      2. WhatsApp Direct Link Number (Country Code, No + or Spaces) *
                    </label>
                    <input
                      type="text"
                      value={siteConfig.contact.whatsappNumberClean}
                      onChange={(e) =>
                        onUpdateSiteConfig((prev) => ({
                          ...prev,
                          contact: {
                            ...prev.contact,
                            whatsappNumberClean: e.target.value.replace(/[^0-9]/g, '')
                          }
                        }))
                      }
                      placeholder="923478936242"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border-2 border-emerald-400 font-mono-code font-bold text-xs sm:text-sm text-slate-900"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-extrabold text-slate-900 mb-1">
                      3. Official Website URL
                    </label>
                    <input
                      type="text"
                      value={siteConfig.contact.officialWebsiteUrl}
                      onChange={(e) =>
                        onUpdateSiteConfig((prev) => ({
                          ...prev,
                          contact: { ...prev.contact, officialWebsiteUrl: e.target.value }
                        }))
                      }
                      placeholder="https://testuisaqib.vercel.app"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-indigo-300 font-mono-code text-xs text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-extrabold text-slate-900 mb-1">
                      4. Website Display Label / Support Email
                    </label>
                    <input
                      type="text"
                      value={siteConfig.contact.officialWebsiteLabel}
                      onChange={(e) =>
                        onUpdateSiteConfig((prev) => ({
                          ...prev,
                          contact: { ...prev.contact, officialWebsiteLabel: e.target.value }
                        }))
                      }
                      placeholder="testuisaqib.vercel.app"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-indigo-300 font-bold text-xs text-slate-900"
                    />
                  </div>
                </div>

                {/* WhatsApp Interactive Popup Chat Widget Customizer */}
                <div className="p-4 rounded-2xl bg-emerald-50/80 border-2 border-emerald-300 space-y-3.5">
                  <div className="flex items-center justify-between border-b border-emerald-200 pb-2">
                    <div className="flex items-center gap-2">
                      <span className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-600 text-white flex items-center justify-center text-sm shadow">
                        <i className="fa-brands fa-whatsapp"></i>
                      </span>
                      <div>
                        <h4 className="text-xs font-extrabold text-slate-900">
                          WhatsApp Interactive Popup Chat Widget (Live Frontend)
                        </h4>
                        <p className="text-[10px] font-bold text-emerald-700">
                          Customize Widget Name, Avatar (DP), Online Status, and Greeting Messages
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] font-extrabold text-slate-800 mb-1">
                        Widget Agent Name
                      </label>
                      <input
                        type="text"
                        value={siteConfig.contact.whatsappWidgetName || ''}
                        onChange={(e) =>
                          onUpdateSiteConfig((prev) => ({
                            ...prev,
                            contact: { ...prev.contact, whatsappWidgetName: e.target.value }
                          }))
                        }
                        placeholder="Sohaib"
                        className="w-full px-3 py-2 rounded-xl bg-white border border-emerald-300 font-bold text-xs text-slate-900"
                      />
                    </div>

                    <div className="sm:col-span-2 space-y-2">
                      <label className="block text-[11px] font-extrabold text-slate-800">
                        WhatsApp Widget Avatar / DP Photo
                      </label>
                      <ImageKitUploadField
                        value={siteConfig.contact.whatsappWidgetAvatar || ''}
                        onChange={(url) =>
                          onUpdateSiteConfig((prev) => ({
                            ...prev,
                            contact: { ...prev.contact, whatsappWidgetAvatar: url }
                          }))
                        }
                        folder="/saqib-hub/whatsapp"
                        label="WhatsApp DP"
                        shape="circle"
                        presets={[
                          {
                            label: 'Sohaib Official Pic',
                            url: 'https://testuisaqib.vercel.app/saqib-pic.png',
                          },
                        ]}
                        showToast={showToast}
                        playPop={playPopSound}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-extrabold text-slate-800 mb-1">
                      Online Subtitle Status
                    </label>
                    <input
                      type="text"
                      value={siteConfig.contact.whatsappWidgetStatus || ''}
                      onChange={(e) =>
                        onUpdateSiteConfig((prev) => ({
                          ...prev,
                          contact: { ...prev.contact, whatsappWidgetStatus: e.target.value }
                        }))
                      }
                      placeholder="Typically replies in ~2 minutes ⚡"
                      className="w-full px-3 py-2 rounded-xl bg-white border border-emerald-300 font-bold text-xs text-slate-900"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-extrabold text-slate-800 mb-1">
                        Welcome Greeting Message (English)
                      </label>
                      <textarea
                        rows={2}
                        value={siteConfig.contact.whatsappWidgetGreeting || ''}
                        onChange={(e) =>
                          onUpdateSiteConfig((prev) => ({
                            ...prev,
                            contact: { ...prev.contact, whatsappWidgetGreeting: e.target.value }
                          }))
                        }
                        placeholder="Assalam-o-Alaikum! Welcome to Sohaib Agency Hub..."
                        className="w-full px-3 py-2 rounded-xl bg-white border border-emerald-300 font-medium text-xs text-slate-900"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-extrabold text-slate-800 mb-1">
                        Welcome Greeting Message (Urdu اردو)
                      </label>
                      <textarea
                        rows={2}
                        dir="rtl"
                        value={siteConfig.contact.whatsappWidgetGreetingUr || ''}
                        onChange={(e) =>
                          onUpdateSiteConfig((prev) => ({
                            ...prev,
                            contact: { ...prev.contact, whatsappWidgetGreetingUr: e.target.value }
                          }))
                        }
                        placeholder="السلام علیکم! ثاقب ویژولز ہب میں خوش آمدید..."
                        className="w-full px-3 py-2 rounded-xl bg-white border border-emerald-300 font-medium text-xs text-slate-900"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => setContactStep(2)}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-extrabold text-xs cursor-pointer"
                  >
                    Next: Social Media Links →
                  </button>
                </div>
              </div>
            )}

            {contactStep === 2 && (() => {
              const platformsList = getActiveSocialPlatforms(siteConfig.socials);
              const activeCount = platformsList.filter((p) => p.enabled !== false).length;

              const handleUpdatePlatform = (id: string, updates: Partial<SocialPlatformItem>) => {
                onUpdateSiteConfig((prev) => {
                  const current = getActiveSocialPlatforms(prev.socials);
                  const updated = current.map((p) => (p.id === id ? { ...p, ...updates } : p));
                  const legacyUpdates: Partial<SiteSocialsConfig> = { platforms: updated };

                  if (id === 'instagram') {
                    if (updates.url !== undefined) legacyUpdates.instagramUrl = updates.url;
                    if (updates.handle !== undefined) legacyUpdates.instagramHandle = updates.handle;
                  } else if (id === 'tiktok') {
                    if (updates.url !== undefined) legacyUpdates.tiktokUrl = updates.url;
                    if (updates.handle !== undefined) legacyUpdates.tiktokHandle = updates.handle;
                  } else if (id === 'facebook') {
                    if (updates.url !== undefined) legacyUpdates.facebookUrl = updates.url;
                    if (updates.handle !== undefined) legacyUpdates.facebookName = updates.handle;
                  } else if (id === 'snapchat') {
                    if (updates.url !== undefined) legacyUpdates.snapchatUrl = updates.url;
                    if (updates.handle !== undefined) legacyUpdates.snapchatHandle = updates.handle;
                  }

                  return {
                    ...prev,
                    socials: {
                      ...prev.socials,
                      ...legacyUpdates
                    }
                  };
                });
              };

              const handleTogglePlatform = (id: string) => {
                const target = platformsList.find((p) => p.id === id);
                if (!target) return;
                const nextState = !target.enabled;
                handleUpdatePlatform(id, { enabled: nextState });
                showToast(
                  nextState
                    ? `✅ ${target.label} enabled! Showing on Contact page.`
                    : `⏸️ ${target.label} disabled. Hidden from website.`
                );
              };

              const handleAddPlatform = (presetKey: string) => {
                const presets: Record<string, Omit<SocialPlatformItem, 'id'>> = {
                  youtube: {
                    platform: 'youtube',
                    label: 'YouTube Channel',
                    handle: '@saqibvisuals',
                    url: 'https://youtube.com/@saqibvisuals',
                    enabled: true,
                    icon: 'fa-brands fa-youtube',
                    colorGrad: 'from-red-500 to-rose-600'
                  },
                  telegram: {
                    platform: 'telegram',
                    label: 'Telegram Channel',
                    handle: '@saqibvisuals',
                    url: 'https://t.me/saqibvisuals',
                    enabled: true,
                    icon: 'fa-brands fa-telegram',
                    colorGrad: 'from-sky-400 to-blue-500'
                  },
                  whatsapp_channel: {
                    platform: 'whatsapp_channel',
                    label: 'WhatsApp Channel',
                    handle: 'Saqib Visuals VIP',
                    url: 'https://whatsapp.com/channel/saqibvisuals',
                    enabled: true,
                    icon: 'fa-brands fa-whatsapp',
                    colorGrad: 'from-emerald-500 to-teal-600'
                  },
                  github: {
                    platform: 'github',
                    label: 'GitHub Profile',
                    handle: '@mrsaqib242',
                    url: 'https://github.com/mrsaqib242',
                    enabled: true,
                    icon: 'fa-brands fa-github',
                    colorGrad: 'from-slate-800 to-slate-950'
                  },
                  twitter: {
                    platform: 'twitter',
                    label: 'X (Twitter)',
                    handle: '@mrsaqib242',
                    url: 'https://x.com/mrsaqib242',
                    enabled: true,
                    icon: 'fa-brands fa-x-twitter',
                    colorGrad: 'from-zinc-800 to-black'
                  },
                  discord: {
                    platform: 'discord',
                    label: 'Discord Community',
                    handle: 'Saqib Visuals Server',
                    url: 'https://discord.gg/saqibvisuals',
                    enabled: true,
                    icon: 'fa-brands fa-discord',
                    colorGrad: 'from-indigo-500 to-purple-600'
                  },
                  linkedin: {
                    platform: 'linkedin',
                    label: 'LinkedIn Profile',
                    handle: 'Muhammad Saqib',
                    url: 'https://linkedin.com/in/mrsaqib242',
                    enabled: true,
                    icon: 'fa-brands fa-linkedin-in',
                    colorGrad: 'from-blue-700 to-sky-700'
                  },
                  custom: {
                    platform: 'custom',
                    label: 'Custom Website Link',
                    handle: 'My Link',
                    url: 'https://',
                    enabled: true,
                    icon: 'fa-solid fa-globe',
                    colorGrad: 'from-teal-500 to-emerald-600'
                  }
                };

                const preset = presets[presetKey] || presets.custom;
                const newId = `${presetKey}_${Date.now()}`;

                onUpdateSiteConfig((prev) => {
                  const current = getActiveSocialPlatforms(prev.socials);
                  return {
                    ...prev,
                    socials: {
                      ...prev.socials,
                      platforms: [...current, { id: newId, ...preset }]
                    }
                  };
                });
                showToast(`Added ${preset.label}! Remember to save changes.`);
              };

              const handleRemovePlatform = (id: string) => {
                onUpdateSiteConfig((prev) => {
                  const current = getActiveSocialPlatforms(prev.socials);
                  return {
                    ...prev,
                    socials: {
                      ...prev.socials,
                      platforms: current.filter((p) => p.id !== id)
                    }
                  };
                });
                showToast('Platform link removed!');
              };

              return (
                <div className="space-y-4">
                  {/* Top Bar with Stats & Add Preset Dropdown */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3.5 rounded-2xl bg-white/95 border border-indigo-200 shadow-xs">
                    <div>
                      <div className="text-xs font-extrabold text-slate-900 flex items-center gap-2">
                        <span>🌐 10+ Social Platforms &amp; Community Channels</span>
                        <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-mono-code font-extrabold">
                          {activeCount} of {platformsList.length} Active
                        </span>
                      </div>
                      <p className="text-[10px] font-semibold text-slate-600 mt-0.5">
                        Toggle any platform ON or OFF with 1-click. Only enabled platforms appear on the Contact page.
                      </p>
                    </div>

                    {/* Quick Add Platform Menu */}
                    <div className="flex items-center gap-1.5 w-full sm:w-auto">
                      <select
                        onChange={(e) => {
                          if (e.target.value) {
                            handleAddPlatform(e.target.value);
                            e.target.value = '';
                          }
                        }}
                        defaultValue=""
                        className="flex-1 sm:flex-initial px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-extrabold text-xs shadow-sm cursor-pointer border-none outline-none"
                      >
                        <option value="" disabled className="text-slate-900 bg-white">
                          + Add New Platform...
                        </option>
                        <option value="youtube" className="text-slate-900 bg-white">
                          🔴 YouTube Channel
                        </option>
                        <option value="telegram" className="text-slate-900 bg-white">
                          🔵 Telegram Channel / Group
                        </option>
                        <option value="whatsapp_channel" className="text-slate-900 bg-white">
                          🟢 WhatsApp VIP Channel
                        </option>
                        <option value="github" className="text-slate-900 bg-white">
                          🐙 GitHub Profile
                        </option>
                        <option value="discord" className="text-slate-900 bg-white">
                          💜 Discord Community
                        </option>
                        <option value="twitter" className="text-slate-900 bg-white">
                          ✖️ X (Twitter)
                        </option>
                        <option value="linkedin" className="text-slate-900 bg-white">
                          💼 LinkedIn Profile
                        </option>
                        <option value="custom" className="text-slate-900 bg-white">
                          🌐 Custom Website Link
                        </option>
                      </select>
                    </div>
                  </div>

                  {/* Dynamic 10+ Platforms Cards Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {platformsList.map((item) => (
                      <div
                        key={item.id}
                        className={`p-3.5 rounded-2xl border-2 transition-all space-y-2.5 ${
                          item.enabled !== false
                            ? 'bg-white border-emerald-400 shadow-sm'
                            : 'bg-slate-50/90 border-slate-200 opacity-70'
                        }`}
                      >
                        {/* Platform Header: Icon + Name + ON/OFF Switch */}
                        <div className="flex items-center justify-between gap-2 border-b border-slate-200 pb-2">
                          <div className="flex items-center gap-2 min-w-0">
                            <span
                              className={`w-7 h-7 rounded-xl bg-gradient-to-tr ${
                                item.colorGrad || 'from-indigo-600 to-purple-600'
                              } text-white flex items-center justify-center text-xs shadow-xs flex-shrink-0`}
                            >
                              <i className={item.icon || 'fa-solid fa-link'}></i>
                            </span>
                            <div className="min-w-0">
                              <span className="font-extrabold text-xs text-slate-900 block truncate">
                                {item.label}
                              </span>
                              <span
                                className={`text-[9.5px] font-bold px-1.5 py-0.2 rounded-full inline-block uppercase ${
                                  item.enabled !== false
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : 'bg-slate-200 text-slate-600'
                                }`}
                              >
                                {item.enabled !== false ? '● Showing on Site' : '○ Hidden'}
                              </span>
                            </div>
                          </div>

                          {/* Toggle ON / OFF Button */}
                          <div className="flex items-center gap-1.5 flex-shrink-0">
                            <button
                              type="button"
                              onClick={() => handleTogglePlatform(item.id)}
                              className={`px-2.5 py-1 rounded-xl font-extrabold text-[11px] transition cursor-pointer flex items-center gap-1 shadow-2xs ${
                                item.enabled !== false
                                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                                  : 'bg-slate-200 hover:bg-slate-300 text-slate-700'
                              }`}
                            >
                              <span>{item.enabled !== false ? 'Active' : 'Hidden'}</span>
                              <i
                                className={`fa-solid ${
                                  item.enabled !== false ? 'fa-toggle-on' : 'fa-toggle-off'
                                } text-xs`}
                              ></i>
                            </button>

                            {/* Remove button (for added platforms) */}
                            {item.id !== 'instagram' &&
                              item.id !== 'tiktok' &&
                              item.id !== 'facebook' &&
                              item.id !== 'snapchat' && (
                                <button
                                  type="button"
                                  onClick={() => handleRemovePlatform(item.id)}
                                  title="Delete platform"
                                  className="w-7 h-7 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs flex items-center justify-center cursor-pointer transition"
                                >
                                  <i className="fa-solid fa-trash-can"></i>
                                </button>
                              )}
                          </div>
                        </div>

                        {/* Platform Inputs: Handle & URL */}
                        <div className="space-y-1.5">
                          <div>
                            <label className="block text-[10px] font-bold text-slate-600 uppercase">
                              Display Username / Handle
                            </label>
                            <input
                              type="text"
                              value={item.handle || ''}
                              onChange={(e) =>
                                handleUpdatePlatform(item.id, { handle: e.target.value })
                              }
                              placeholder="@username"
                              className="w-full px-3 py-1.5 rounded-xl bg-white border border-slate-300 font-bold text-xs text-slate-900 focus:border-indigo-400 focus:outline-none"
                            />
                          </div>

                          <div>
                            <div className="flex items-center justify-between">
                              <label className="block text-[10px] font-bold text-slate-600 uppercase">
                                Direct URL Link
                              </label>
                              {item.url && (
                                <a
                                  href={item.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-[10px] font-bold text-indigo-600 hover:underline flex items-center gap-0.5"
                                >
                                  <span>Test</span>
                                  <i className="fa-solid fa-arrow-up-right-from-square text-[9px]"></i>
                                </a>
                              )}
                            </div>
                            <input
                              type="text"
                              value={item.url || ''}
                              onChange={(e) =>
                                handleUpdatePlatform(item.id, { url: e.target.value })
                              }
                              placeholder="https://..."
                              className="w-full px-3 py-1.5 rounded-xl bg-white border border-slate-300 font-mono-code text-[11px] text-slate-900 focus:border-indigo-400 focus:outline-none"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Navigation Buttons */}
                  <div className="flex justify-between pt-2">
                    <button
                      type="button"
                      onClick={() => setContactStep(1)}
                      className="px-4 py-2.5 rounded-xl bg-white text-slate-700 border border-slate-300 font-extrabold text-xs cursor-pointer hover:bg-slate-50 transition"
                    >
                      ← Back
                    </button>
                    <button
                      type="button"
                      onClick={() => setContactStep(3)}
                      className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-extrabold text-xs cursor-pointer hover:scale-105 transition shadow-sm"
                    >
                      Next: Footer Branding →
                    </button>
                  </div>
                </div>
              );
            })()}

            {contactStep === 3 && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-extrabold text-slate-900 mb-1">
                      1. Footer Brand Name
                    </label>
                    <input
                      type="text"
                      value={siteConfig.footer.brandName}
                      onChange={(e) =>
                        onUpdateSiteConfig((prev) => ({
                          ...prev,
                          footer: { ...prev.footer, brandName: e.target.value }
                        }))
                      }
                      placeholder="🚀 Sohaib Agency Hub"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border-2 border-indigo-300 font-bold text-xs sm:text-sm text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-extrabold text-slate-900 mb-1">
                      2. Footer Warranty / Copyright Tagline
                    </label>
                    <input
                      type="text"
                      value={siteConfig.footer.copyrightTagline}
                      onChange={(e) =>
                        onUpdateSiteConfig((prev) => ({
                          ...prev,
                          footer: { ...prev.footer, copyrightTagline: e.target.value }
                        }))
                      }
                      placeholder="24/7 Instant Delivery • 100% Full Replacement Warranty"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border-2 border-indigo-300 font-bold text-xs sm:text-sm text-slate-900"
                    />
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-white/90 border border-indigo-200 flex items-center justify-between gap-3">
                  <div>
                    <div className="text-sm font-extrabold text-slate-900">
                      Show Footer Quick Navigation Links
                    </div>
                    <div className="text-xs font-semibold text-slate-600">
                      Displays Store, Web Tools, About, FAQs, Contact, and VIP Login links in the footer bar
                    </div>
                  </div>
                  {renderToggleSwitch(
                    siteConfig.footer.showQuickLinks,
                    () =>
                      onUpdateSiteConfig((prev) => ({
                        ...prev,
                        footer: {
                          ...prev.footer,
                          showQuickLinks: !prev.footer.showQuickLinks
                        }
                      })),
                    'Show Footer Quick Links'
                  )}
                </div>

                <div className="flex justify-between">
                  <button
                    type="button"
                    onClick={() => setContactStep(2)}
                    className="px-4 py-2.5 rounded-xl bg-white text-slate-700 border border-slate-300 font-extrabold text-xs cursor-pointer"
                  >
                    ← Back
                  </button>
                  <button
                    type="button"
                    onClick={async () => {
                      playPopSound(840);
                      if (onSaveSiteConfigToCloud) {
                        await onSaveSiteConfigToCloud(siteConfig, true);
                      }
                      setActiveScreen('home');
                    }}
                    disabled={isSavingSiteConfig}
                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-extrabold text-xs sm:text-sm shadow-lg cursor-pointer flex items-center gap-2"
                  >
                    {isSavingSiteConfig ? (
                      <>
                        <i className="fa-solid fa-spinner animate-spin"></i>
                        <span>Saving to Database...</span>
                      </>
                    ) : (
                      <>
                        <i className="fa-solid fa-cloud-arrow-up"></i>
                        <span>✓ Save to Database &amp; Return</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ==================== SCREEN 6: PAYMENT PROOFS & USER BALANCE STUDIO ==================== */}
      {activeScreen === 'payments' && hasScreenPermission('payments') && (
        <AdminPaymentApprovalStudio
          walletBalance={walletBalance}
          paymentProofs={paymentProofs}
          onApproveProof={handleApprovePaymentProof}
          onRejectProof={handleRejectPaymentProof}
          onDeleteProof={handleDeletePaymentProof}
          onSetCustomBalance={handleSetCustomBalance}
          onPreviewScreenshot={onPreviewScreenshot}
          onCopyText={copyText}
        />
      )}

      {/* ==================== SCREEN 7: WEBSITE UI THEME & FONT STUDIO ==================== */}
      {activeScreen === 'ui' && hasScreenPermission('ui') && (
        <AdminUiThemeSwitcherStudio
          uiMode={websiteUiMode}
          onChangeUiMode={(mode) => setWebsiteUiMode(mode)}
          fontMode={websiteFontMode}
          onChangeFontMode={(font) => setWebsiteFontMode(font)}
          playClick={playPopSound}
          showToast={showToast}
        />
      )}

      {/* ==================== SCREEN 8: 1-TAP HIDE / SHOW ANYTHING MASTER SWITCHBOARD ==================== */}
      {activeScreen === 'visibility' && hasScreenPermission('visibility') && (
        <div className="space-y-5">
          <div className="acrylic-frame rounded-[34px] p-3 sm:p-4">
            <div className="plush-pillow plush-login rounded-[26px] p-4 sm:p-6 space-y-5">
              {/* Top Header */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-pink-200 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-800 text-sky-300 flex items-center justify-center text-xl shadow-md border-2 border-white">
                    <FaEyeSlash />
                  </div>
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-pink-600">
                      👁️ MASTER VISIBILITY CONTROL CENTER • 1-TAP HIDE OR SHOW
                    </span>
                    <h3 className="text-base sm:text-xl font-extrabold text-slate-900">
                      Hide or Show Any Website Section, Service, Category, Tool or Button
                    </h3>
                    <p className="text-xs font-semibold text-slate-600">
                      Turn any switch OFF to hide that item from customers without deleting your data! Turn it back ON anytime.
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      playPopSound(780);
                      onUpdateSiteConfig((prev) => ({
                        ...prev,
                        banner: {
                          ...prev.banner,
                          showHeroBanner: true,
                          showTopStrip: true
                        },
                        footer: {
                          ...prev.footer,
                          showQuickLinks: true
                        },
                        categories: (prev.categories && prev.categories.length > 0
                          ? prev.categories
                          : CATEGORY_META
                        ).map((c) => ({ ...c, hidden: false })),
                        paymentMethods: prev.paymentMethods.map((m) => ({
                          ...m,
                          enabled: true
                        })),
                        visibility: DEFAULT_SITE_VISIBILITY
                      }));
                      if (setAllServicesHidden) setAllServicesHidden(false);
                      if (setAllToolsHidden) setAllToolsHidden(false);
                      showToast('👁️ Everything Unhidden & Restored to Visible!');
                    }}
                    className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-xs font-extrabold shadow-md cursor-pointer flex items-center gap-1.5"
                  >
                    <FaEye className="w-3.5 h-3.5" />
                    <span>Show Everything (Unhide All)</span>
                  </button>
                </div>
              </div>

              {/* 4 Sub-Tab Pills inside Visibility Studio */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  {
                    id: 'sections' as const,
                    label: '🌐 Website Sections & Tabs',
                    sub: 'Banners, Bars, Buttons & Pages'
                  },
                  {
                    id: 'products' as const,
                    label: `🛍️ Store Services (${servicesCatalog.length})`,
                    sub: `${hiddenServicesCount} Currently Hidden`
                  },
                  {
                    id: 'categories' as const,
                    label: `🗂️ Categories (${activeCategories.length - 1})`,
                    sub: `${hiddenCategoriesCount} Currently Hidden`
                  },
                  {
                    id: 'tools' as const,
                    label: `🛠️ Tools & Payments`,
                    sub: `${hiddenToolsCount} Tools Hidden`
                  }
                ].map((tab) => {
                  const isAct = visibilitySubTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => {
                        playPopSound(640);
                        setVisibilitySubTab(tab.id);
                      }}
                      className={`p-3 rounded-2xl border text-left transition cursor-pointer ${
                        isAct
                          ? 'bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 text-white border-white shadow-md scale-[1.01]'
                          : 'bg-white/90 hover:bg-white text-slate-800 border-pink-200'
                      }`}
                    >
                      <div className="text-xs font-extrabold truncate">{tab.label}</div>
                      <div
                        className={`text-[10px] font-semibold truncate mt-0.5 ${
                          isAct ? 'text-pink-100' : 'text-slate-500'
                        }`}
                      >
                        {tab.sub}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* TAB 1: WEBSITE SECTIONS, BUTTONS & NAVIGATION TABS */}
              {visibilitySubTab === 'sections' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {/* Column A: Storefront Sections & Hero Elements */}
                  <div className="rounded-2xl bg-white/95 border border-pink-200 divide-y divide-slate-200/70 overflow-hidden shadow-xs">
                    <div className="px-4 py-2.5 bg-pink-50/80 text-[11px] font-extrabold uppercase tracking-wider text-pink-800">
                      🖼️ Hero Banner &amp; Storefront Sections
                    </div>

                    <div className="p-3.5 flex items-center justify-between gap-3">
                      <div>
                        <div className="text-xs sm:text-sm font-extrabold text-slate-900">
                          Main 3D Hero Banner &amp; Portrait Card
                        </div>
                        <div className="text-[11px] font-semibold text-slate-600">
                          Show or hide the large circular portrait &amp; bio card on the Storefront
                        </div>
                      </div>
                      {renderToggleSwitch(
                        siteConfig.banner.showHeroBanner,
                        () => {
                          const next = !siteConfig.banner.showHeroBanner;
                          onUpdateSiteConfig((prev) => ({
                            ...prev,
                            banner: { ...prev.banner, showHeroBanner: next }
                          }));
                          showToast(next ? '👁️ Hero Banner Shown!' : '🙈 Hero Banner Hidden!');
                        },
                        'Show Hero Banner'
                      )}
                    </div>

                    <div className="p-3.5 flex items-center justify-between gap-3">
                      <div>
                        <div className="text-xs sm:text-sm font-extrabold text-slate-900">
                          Top Headline Strip &amp; WhatsApp Pill
                        </div>
                        <div className="text-[11px] font-semibold text-slate-600">
                          {siteConfig.banner.topStripTitle}
                        </div>
                      </div>
                      {renderToggleSwitch(
                        siteConfig.banner.showTopStrip,
                        () => {
                          const next = !siteConfig.banner.showTopStrip;
                          onUpdateSiteConfig((prev) => ({
                            ...prev,
                            banner: { ...prev.banner, showTopStrip: next }
                          }));
                          showToast(next ? '👁️ Top Strip Shown!' : '🙈 Top Strip Hidden!');
                        },
                        'Show Top Strip'
                      )}
                    </div>

                    {[
                      {
                        key: 'showPortraitOrbitBadges' as const,
                        title: '4 Floating Badges Around Portfolio Portrait',
                        desc: 'CapCut & Lovable, AI Suite, TikTok UK/USA & SIM/NADRA badges'
                      },
                      {
                        key: 'showHeroFeaturePills' as const,
                        title: 'Hero Bio Quick Filter Buttons',
                        desc: 'AI & Pro Apps, TikTok UK, Franchise, NADRA & Live Web Tools buttons inside Hero card'
                      },
                      {
                        key: 'showMarqueeBanner' as const,
                        title: 'Scrolling Brand Marquee & Live Server Pulse Strip',
                        desc: 'Animated brand strip above the storefront'
                      },
                      {
                        key: 'showStoreWalletBar' as const,
                        title: 'Storefront Live Wallet Balance & +Add Payment Bar',
                        desc: 'Dark wallet balance bar with +Add Payment button on Storefront'
                      },
                      {
                        key: 'showSearchAndCategoryBar' as const,
                        title: 'Store Search Box & Category Filter Tabs Bar',
                        desc: 'Search input and category filter buttons above the product grid'
                      },
                      {
                        key: 'showWebToolsOnStore' as const,
                        title: 'Live Web Tools Section on Storefront',
                        desc: 'Show or hide the Live Web Tools showcase block below Store products'
                      },
                      {
                        key: 'showReviewsSection' as const,
                        title: 'Customer Reviews & Trust Badges Showcase',
                        desc: 'Verified buyer reviews and statistics section'
                      }
                    ].map((row) => (
                      <div key={row.key} className="p-3.5 flex items-center justify-between gap-3">
                        <div>
                          <div className="text-xs sm:text-sm font-extrabold text-slate-900">
                            {row.title}
                          </div>
                          <div className="text-[11px] font-semibold text-slate-600">{row.desc}</div>
                        </div>
                        {renderToggleSwitch(
                          activeVisibility[row.key],
                          () => toggleSiteVisibilityKey(row.key, row.title),
                          row.title
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Column B: Navigation Tabs, Header Buttons & Floating Widgets */}
                  <div className="rounded-2xl bg-white/95 border border-indigo-200 divide-y divide-slate-200/70 overflow-hidden shadow-xs">
                    <div className="px-4 py-2.5 bg-indigo-50/80 text-[11px] font-extrabold uppercase tracking-wider text-indigo-800">
                      🧭 Navigation Tabs, Header Pills &amp; Floating Buttons
                    </div>

                    {[
                      {
                        key: 'showToolsTab' as const,
                        title: 'Navigation Tab: Web Tools',
                        desc: 'Show or hide Web Tools tab in Header & Mobile menu'
                      },
                      {
                        key: 'showAboutTab' as const,
                        title: 'Navigation Tab: About Sohaib',
                        desc: 'Show or hide About tab in Header & Mobile menu'
                      },
                      {
                        key: 'showFaqsTab' as const,
                        title: 'Navigation Tab: FAQs & Help',
                        desc: 'Show or hide FAQs tab in Header & Mobile menu'
                      },
                      {
                        key: 'showContactTab' as const,
                        title: 'Navigation Tab: Contact Support',
                        desc: 'Show or hide Contact tab in Header & Mobile menu'
                      },
                      {
                        key: 'showLoginTab' as const,
                        title: 'Navigation Tab: VIP Login / Wallet',
                        desc: 'Show or hide VIP Login tab in Header & Mobile menu'
                      },
                      {
                        key: 'showSimDatabaseTracker' as const,
                        title: 'Pakistan SIM & CNIC Live Database Tracker',
                        desc: 'Built-in SIM/CNIC search box inside the Web Tools tab'
                      },
                      {
                        key: 'showHeaderWalletPill' as const,
                        title: 'Header Bar: Live Wallet Balance (+Add) Pill',
                        desc: 'Green Rs. Balance button in the top navigation bar'
                      },
                      {
                        key: 'showHeaderCartButton' as const,
                        title: 'Header Bar: Shopping Bag / Multi-Order Button',
                        desc: 'Pink shopping bag counter button in the top navigation bar'
                      },
                      {
                        key: 'showHeaderRgbToggle' as const,
                        title: 'Header Bar: RGB Light ON/OFF Toggle Button',
                        desc: 'Allow visitors to toggle RGB borders ON/OFF from the header'
                      },
                      {
                        key: 'showMobileQuickBar' as const,
                        title: 'Mobile Upper Quick-Category Scroll Bar',
                        desc: 'Horizontal quick-filter bar below the top navbar on mobile'
                      },
                      {
                        key: 'showMobileBottomDock' as const,
                        title: 'Mobile Bottom App Navigation Dock',
                        desc: 'Fixed bottom 6-icon app bar on mobile phones'
                      },
                      {
                        key: 'showFloatingWhatsApp' as const,
                        title: 'Floating Bottom-Right WhatsApp Quick Chat Orb',
                        desc: 'Green floating WhatsApp button in the bottom-right corner'
                      },
                      {
                        key: 'showFloatingScrollTop' as const,
                        title: 'Floating Rocket Scroll-to-Top Button',
                        desc: 'Rocket button that appears when scrolling down'
                      }
                    ].map((row) => (
                      <div key={row.key} className="p-3.5 flex items-center justify-between gap-3">
                        <div>
                          <div className="text-xs sm:text-sm font-extrabold text-slate-900">
                            {row.title}
                          </div>
                          <div className="text-[11px] font-semibold text-slate-600">{row.desc}</div>
                        </div>
                        {renderToggleSwitch(
                          activeVisibility[row.key],
                          () => toggleSiteVisibilityKey(row.key, row.title),
                          row.title
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 2: HIDE / SHOW INDIVIDUAL STORE PRODUCTS */}
              {visibilitySubTab === 'products' && (
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2 bg-white/90 p-3 rounded-2xl border border-pink-200">
                    <div className="flex flex-wrap items-center gap-1.5">
                      {activeCategories.map((cat) => (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => setVisibilityCatFilter(cat.id)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-extrabold cursor-pointer transition ${
                            visibilityCatFilter === cat.id
                              ? 'bg-slate-900 text-white shadow-xs'
                              : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                          }`}
                        >
                          {cat.shortLabel}
                        </button>
                      ))}
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <input
                        type="text"
                        value={visibilitySearch}
                        onChange={(e) => setVisibilitySearch(e.target.value)}
                        placeholder="Search service to hide/show..."
                        className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-300 text-xs font-bold text-slate-900"
                      />
                      {setAllServicesHidden && (
                        <>
                          <button
                            type="button"
                            onClick={() => setAllServicesHidden(false, visibilityCatFilter)}
                            className="px-3 py-1.5 rounded-xl bg-emerald-500 text-white text-xs font-extrabold cursor-pointer"
                          >
                            👁️ Show All
                          </button>
                          <button
                            type="button"
                            onClick={() => setAllServicesHidden(true, visibilityCatFilter)}
                            className="px-3 py-1.5 rounded-xl bg-rose-500 text-white text-xs font-extrabold cursor-pointer"
                          >
                            🙈 Hide All
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 max-h-[520px] overflow-y-auto pr-1">
                    {servicesCatalog
                      .filter((s) =>
                        visibilityCatFilter === 'all' ? true : s.category === visibilityCatFilter
                      )
                      .filter((s) =>
                        !visibilitySearch.trim()
                          ? true
                          : s.title.toLowerCase().includes(visibilitySearch.toLowerCase()) ||
                            s.badge.toLowerCase().includes(visibilitySearch.toLowerCase())
                      )
                      .map((srv) => {
                        const isHidden = Boolean(srv.hidden);
                        return (
                          <div
                            key={srv.id}
                            onClick={() => toggleServiceHidden && toggleServiceHidden(srv.id)}
                            className={`p-3.5 rounded-2xl border flex items-center justify-between gap-3 cursor-pointer transition ${
                              isHidden
                                ? 'bg-slate-100/90 border-slate-300 opacity-75'
                                : 'bg-white/95 border-pink-100 hover:border-pink-400 shadow-2xs'
                            }`}
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <div
                                className={`w-10 h-10 rounded-xl bg-gradient-to-br ${srv.orbGrad} text-white flex items-center justify-center flex-shrink-0 shadow overflow-hidden`}
                              >
                                {renderOrbVisual(srv.iconType, srv.customIconUrl, srv.title)}
                              </div>
                              <div className="min-w-0">
                                <div className="flex items-center gap-1.5">
                                  <span className="text-xs sm:text-sm font-extrabold text-slate-900 truncate">
                                    {srv.title}
                                  </span>
                                  {isHidden ? (
                                    <span className="px-2 py-0.2 rounded-full bg-rose-100 text-rose-800 text-[9px] font-extrabold">
                                      🙈 HIDDEN
                                    </span>
                                  ) : (
                                    <span className="px-2 py-0.2 rounded-full bg-emerald-100 text-emerald-800 text-[9px] font-extrabold">
                                      👁️ LIVE
                                    </span>
                                  )}
                                </div>
                                <div className="text-[10px] font-semibold text-slate-500 truncate">
                                  {srv.badge} • {formatTierToString(srv.tiers?.[0])}
                                </div>
                              </div>
                            </div>

                            {renderToggleSwitch(
                              !isHidden,
                              () => toggleServiceHidden && toggleServiceHidden(srv.id),
                              `Toggle ${srv.title}`
                            )}
                          </div>
                        );
                      })}
                  </div>
                </div>
              )}

              {/* TAB 3: HIDE / SHOW STORE CATEGORIES */}
              {visibilitySubTab === 'categories' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {activeCategories
                    .filter((c) => c.id !== 'all')
                    .map((cat) => {
                      const isHidden = Boolean(cat.hidden);
                      const count = servicesCatalog.filter((s) => s.category === cat.id).length;
                      return (
                        <div
                          key={cat.id}
                          onClick={() => toggleCategoryHidden(cat.id, cat.shortLabel)}
                          className={`p-4 rounded-2xl border flex items-center justify-between gap-3 cursor-pointer transition ${
                            isHidden
                              ? 'bg-slate-100/90 border-slate-300 opacity-75'
                              : 'bg-white/95 border-pink-200 hover:border-pink-400 shadow-xs'
                          }`}
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="w-11 h-11 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center flex-shrink-0 overflow-hidden">
                              {renderCategoryIcon(cat.id, `w-5 h-5 ${cat.iconColor}`, cat)}
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-1.5">
                                <span className="text-sm font-extrabold text-slate-900 truncate">
                                  {cat.shortLabel}
                                </span>
                                <span className="px-2 py-0.2 rounded-full bg-pink-50 text-pink-700 text-[9px] font-extrabold">
                                  {count} Services
                                </span>
                                {isHidden && (
                                  <span className="px-2 py-0.2 rounded-full bg-rose-100 text-rose-800 text-[9px] font-extrabold">
                                    🙈 HIDDEN
                                  </span>
                                )}
                              </div>
                              <div className="text-xs font-semibold text-slate-500 truncate">
                                {cat.label} (Hiding this hides its tab &amp; {count} services)
                              </div>
                            </div>
                          </div>

                          {renderToggleSwitch(
                            !isHidden,
                            () => toggleCategoryHidden(cat.id, cat.shortLabel),
                            `Toggle ${cat.shortLabel}`
                          )}
                        </div>
                      );
                    })}
                </div>
              )}

              {/* TAB 4: HIDE / SHOW WEB TOOLS & PAYMENT METHODS */}
              {visibilitySubTab === 'tools' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {/* Web Tools */}
                  <div className="rounded-2xl bg-white/95 border border-indigo-200 p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-extrabold uppercase tracking-wider text-indigo-800">
                        🛠️ Live Web Tools ({webToolsCatalog.length})
                      </span>
                      {setAllToolsHidden && (
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => setAllToolsHidden(false)}
                            className="px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-800 text-[10px] font-extrabold cursor-pointer"
                          >
                            Show All
                          </button>
                          <button
                            type="button"
                            onClick={() => setAllToolsHidden(true)}
                            className="px-2.5 py-1 rounded-lg bg-rose-100 text-rose-800 text-[10px] font-extrabold cursor-pointer"
                          >
                            Hide All
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
                      {webToolsCatalog.map((tool) => {
                        const isHidden = Boolean(tool.hidden);
                        return (
                          <div
                            key={tool.id}
                            onClick={() => toggleToolHidden && toggleToolHidden(tool.id)}
                            className={`p-3 rounded-xl border flex items-center justify-between gap-3 cursor-pointer ${
                              isHidden
                                ? 'bg-slate-100 border-slate-300 opacity-75'
                                : 'bg-white border-indigo-100 hover:border-indigo-300'
                            }`}
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <div
                                className={`w-9 h-9 rounded-xl bg-gradient-to-br ${tool.orbGrad} text-white flex items-center justify-center flex-shrink-0 overflow-hidden`}
                              >
                                {renderOrbVisual(tool.iconType, tool.iconUrl, tool.title)}
                              </div>
                              <div className="min-w-0">
                                <div className="text-xs font-extrabold text-slate-900 truncate">
                                  {tool.title}
                                </div>
                                <div className="text-[10px] font-mono-code text-slate-500 truncate">
                                  {tool.toolUrl}
                                </div>
                              </div>
                            </div>
                            {renderToggleSwitch(
                              !isHidden,
                              () => toggleToolHidden && toggleToolHidden(tool.id),
                              tool.title
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Payment Methods */}
                  <div className="rounded-2xl bg-white/95 border border-emerald-200 p-4 space-y-3">
                    <div className="text-xs font-extrabold uppercase tracking-wider text-emerald-800">
                      🏦 Payment Methods ({siteConfig.paymentMethods.length})
                    </div>
                    <div className="space-y-2">
                      {siteConfig.paymentMethods.map((m, idx) => {
                        const isEnabled = m.enabled !== false;
                        return (
                          <div
                            key={m.id}
                            onClick={() =>
                              updatePaymentMethodField(idx, 'enabled', !isEnabled)
                            }
                            className={`p-3 rounded-xl border flex items-center justify-between gap-3 cursor-pointer ${
                              !isEnabled
                                ? 'bg-slate-100 border-slate-300 opacity-75'
                                : 'bg-white border-emerald-100 hover:border-emerald-300'
                            }`}
                          >
                            <div>
                              <div className="text-xs font-extrabold text-slate-900">
                                {m.label} ({m.id})
                              </div>
                              <div className="text-[10px] font-mono-code font-bold text-emerald-700">
                                {m.accountTitle} • {m.accountNumber}
                              </div>
                            </div>
                            {renderToggleSwitch(
                              isEnabled,
                              () => updatePaymentMethodField(idx, 'enabled', !isEnabled),
                              m.label
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ==================== SCREEN 9: SEO & OPEN GRAPH METADATA STUDIO ==================== */}
      {activeScreen === 'seo' && hasScreenPermission('seo') && (
        <AdminSeoStudio
          siteConfig={siteConfig}
          onUpdateSiteConfig={onUpdateSiteConfig}
          playPopSound={playPopSound}
          showToast={showToast}
          copyText={copyText}
          onReturnHome={() => openSettingsScreen('home')}
        />
      )}

      
      {/* ==================== SCREEN 11: STOREFRONT PROMO & WELCOME POPUP STUDIO ==================== */}
      {activeScreen === 'promo_popup' && hasScreenPermission('promo_popup') && (
        <AdminPromoPopupStudio
          siteConfig={siteConfig}
          onUpdateSiteConfig={onUpdateSiteConfig}
          playPopSound={playPopSound}
          showToast={showToast}
          copyText={copyText}
          onReturnHome={() => openSettingsScreen('home')}
        />
      )}
      {/* ==================== SCREEN 12: CUSTOMER REVIEWS MODERATION STUDIO ==================== */}
      {activeScreen === 'reviews' && hasScreenPermission('reviews') && (
        <AdminReviewModerationStudio
          showToast={showToast}
          playPopSound={playPopSound}
          onExit={() => openSettingsScreen('home')}
        />
      )}

      {/* ==================== SCREEN 10: ADMIN SECURITY & ANTI-CLONE KILLSWITCH ==================== */}
      {activeScreen === 'security' && hasScreenPermission('security') && (
        <AdminSecurityCredentialsStudio
          siteConfig={siteConfig}
          onUpdateSiteConfig={onUpdateSiteConfig}
          playPopSound={playPopSound}
          showToast={showToast}
          copyText={copyText}
          onReturnHome={() => openSettingsScreen('home')}
          onNavigateToScreen={(scr) => openSettingsScreen(scr)}
          initialTab={securityStep === 2 ? 'subadmins' : 'credentials'}
        />
      )}
    </div>
  );
};
