'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { StoreService, WebToolItem, CategoryId, CATEGORY_META } from '../data/defaultCatalog';
import { SiteSettingsConfig, AdminSettingsScreenId } from './AdminStepByStepSettingsHub';
import { PaymentProofRequest } from './WalletAndAdminPayments';
import { AdminVisitorTelemetryView } from './AdminVisitorTelemetryView';
import { AdminUserManagementView } from './AdminUserManagementView';
import { AdminSubAdminManagerView } from './AdminSubAdminManagerView';
import { AdminCouponManagerView } from './AdminCouponManagerView';
import { AdminPermissions } from '@/src/lib/serverSecurity';
import {
  FaChartPie,
  FaBolt,
  FaBagShopping,
  FaScrewdriverWrench,
  FaWallet,
  FaShieldHalved,
  FaEye,
  FaEyeSlash,
  FaCircleCheck,
  FaCircleXmark,
  FaArrowRight,
  FaMagnifyingGlass,
  FaLayerGroup,
  FaGlobe,
  FaPalette,
  FaFont,
  FaSliders,
  FaClock,
  FaMoneyBillWave,
  FaCreditCard,
  FaServer,
  FaCode,
  FaCopy,
} from 'react-icons/fa6';

export interface AdminAnalyticsDashboardProps {
  siteConfig: SiteSettingsConfig;
  onUpdateSiteConfig: React.Dispatch<React.SetStateAction<SiteSettingsConfig>>;
  servicesCatalog: StoreService[];
  webToolsCatalog: WebToolItem[];
  paymentProofs: PaymentProofRequest[];
  walletBalance: number;
  websiteUiMode: string;
  websiteFontMode: string;
  onOpenScreen: (screenId: AdminSettingsScreenId, initialStep?: number) => void;
  toggleServiceHidden?: (id: string) => void;
  toggleToolHidden?: (id: string) => void;
  toggleCategoryHidden: (id: string, name: string) => void;
  showToast: (msg: string) => void;
  playPopSound: (freq?: number) => void;
  copyText: (text: string, msg?: string) => void;
  exitSecretAdminPortal: () => void;
}

type FeatureCategory = 'all' | 'visuals' | 'navigation' | 'conversion' | 'payments' | 'seo_system';

interface SystemFeatureAuditItem {
  id: string;
  title: string;
  category: 'visuals' | 'navigation' | 'conversion' | 'payments' | 'seo_system';
  categoryLabel: string;
  description: string;
  isEnabled: boolean;
  targetScreen: AdminSettingsScreenId;
  targetStep?: number;
  onToggle: () => void;
}

export const AdminAnalyticsDashboard: React.FC<AdminAnalyticsDashboardProps> = ({
  siteConfig,
  onUpdateSiteConfig,
  servicesCatalog,
  webToolsCatalog,
  paymentProofs,
  walletBalance,
  websiteUiMode,
  websiteFontMode,
  onOpenScreen,
  toggleServiceHidden,
  toggleToolHidden,
  toggleCategoryHidden,
  showToast,
  playPopSound,
  copyText,
  exitSecretAdminPortal,
}) => {
  const [activeTab, setActiveTab] = useState<'matrix' | 'products' | 'tools' | 'financials' | 'tech' | 'visitors' | 'users' | 'admins' | 'coupons'>('users');
  const [featureFilter, setFeatureFilter] = useState<FeatureCategory>('all');
  const [featureSearch, setFeatureSearch] = useState<string>('');

  // Current Admin Identity & Permissions State
  const [currentAdminRole, setCurrentAdminRole] = useState<'superadmin' | 'subadmin' | 'admin'>('superadmin');
  const [currentAdminUser, setCurrentAdminUser] = useState<string>('saqib');
  const [adminPermissions, setAdminPermissions] = useState<AdminPermissions>({
    manage_services: true,
    manage_tools: true,
    manage_orders: true,
    manage_users: true,
    view_telemetry: true,
    manage_site_config: true,
    manage_admins: true,
  });

  const [dbStatus, setDbStatus] = useState<{ database_url: string; project_id: string; status: string } | null>(null);

  useEffect(() => {
    fetch('/api/database-status')
      .then((r) => r.json())
      .then((data) => setDbStatus(data))
      .catch(() => {});
  }, []);

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

  // 1. CALCULATE CORE CATALOG METRICS
  const totalProducts = servicesCatalog.length;
  const liveProducts = servicesCatalog.filter((s) => !s.hidden).length;
  const hiddenProducts = servicesCatalog.filter((s) => s.hidden).length;
  const totalPlans = servicesCatalog.reduce((sum, s) => sum + (s.tiers?.length || 0), 0);

  const totalTools = webToolsCatalog.length;
  const liveTools = webToolsCatalog.filter((t) => !t.hidden).length;
  const hiddenTools = webToolsCatalog.filter((t) => t.hidden).length;

  const activeCategories = siteConfig.categories && siteConfig.categories.length > 0 ? siteConfig.categories : CATEGORY_META;
  const totalCategories = activeCategories.length;
  const liveCategories = activeCategories.filter((c) => !c.hidden).length;
  const hiddenCategories = activeCategories.filter((c) => c.hidden).length;

  const paymentMethods = siteConfig.paymentMethods || [];
  const activePaymentMethods = paymentMethods.filter((m) => m.enabled !== false).length;

  // 2. CALCULATE FINANCIALS & PROOFS METRICS
  const totalProofs = paymentProofs.length;
  const pendingProofs = paymentProofs.filter((p) => p.status === 'pending').length;
  const approvedProofs = paymentProofs.filter((p) => p.status === 'approved').length;
  const rejectedProofs = paymentProofs.filter((p) => p.status === 'rejected').length;
  const approvedVolume = paymentProofs
    .filter((p) => p.status === 'approved')
    .reduce((sum, p) => sum + (Number(p.amount) || 0), 0);
  const pendingVolume = paymentProofs
    .filter((p) => p.status === 'pending')
    .reduce((sum, p) => sum + (Number(p.amount) || 0), 0);

  // 3. MASTER 26-FEATURE SYSTEM AUDIT MATRIX
  const systemFeatures: SystemFeatureAuditItem[] = useMemo(() => {
    return [
      // VISUALS & BANNERS (5)
      {
        id: 'hero_banner',
        title: 'Top 3D Hero Banner',
        category: 'visuals',
        categoryLabel: 'Banners & Visuals',
        description: 'Main flagship 3D hero showcase card with portrait, headline & WhatsApp trigger.',
        isEnabled: siteConfig.banner.showHeroBanner !== false,
        targetScreen: 'banner',
        onToggle: () => {
          onUpdateSiteConfig((prev) => ({
            ...prev,
            banner: { ...prev.banner, showHeroBanner: !prev.banner.showHeroBanner },
          }));
          showToast('Hero Banner visibility toggled!');
        },
      },
      {
        id: 'top_strip',
        title: 'Top Announcement Strip',
        category: 'visuals',
        categoryLabel: 'Banners & Visuals',
        description: 'Store announcement bar at the very top of the storefront.',
        isEnabled: siteConfig.banner.showTopStrip !== false,
        targetScreen: 'banner',
        onToggle: () => {
          onUpdateSiteConfig((prev) => ({
            ...prev,
            banner: { ...prev.banner, showTopStrip: !prev.banner.showTopStrip },
          }));
          showToast('Top Strip visibility toggled!');
        },
      },
      {
        id: 'top_strip_wa',
        title: 'Top Strip Direct WhatsApp Button',
        category: 'visuals',
        categoryLabel: 'Banners & Visuals',
        description: 'Direct WhatsApp pill inside the top title strip for instant inquiries.',
        isEnabled: siteConfig.banner.showTopStripWhatsapp !== false,
        targetScreen: 'banner',
        onToggle: () => {
          onUpdateSiteConfig((prev) => ({
            ...prev,
            banner: { ...prev.banner, showTopStripWhatsapp: !prev.banner.showTopStripWhatsapp },
          }));
          showToast('Top WhatsApp pill toggled!');
        },
      },
      {
        id: 'promo_banner_1',
        title: 'Promotional Banner 1 (Top / Special)',
        category: 'visuals',
        categoryLabel: 'Banners & Visuals',
        description: 'Gradient alert card above services showcasing flash deals or notices.',
        isEnabled: siteConfig.promoBanners?.[0]?.enabled !== false,
        targetScreen: 'promo_banners',
        onToggle: () => {
          onUpdateSiteConfig((prev) => {
            const list = [...(prev.promoBanners || [])];
            if (list[0]) {
              list[0] = { ...list[0], enabled: list[0].enabled === false ? true : false };
            }
            return { ...prev, promoBanners: list };
          });
          showToast('Promo Banner 1 toggled!');
        },
      },
      {
        id: 'promo_banner_2',
        title: 'Promotional Banner 2 (Secondary / Guarantee)',
        category: 'visuals',
        categoryLabel: 'Banners & Visuals',
        description: 'Secondary marquee card for customer reviews, delivery times & guarantees.',
        isEnabled: siteConfig.promoBanners?.[1]?.enabled !== false,
        targetScreen: 'promo_banners',
        onToggle: () => {
          onUpdateSiteConfig((prev) => {
            const list = [...(prev.promoBanners || [])];
            if (list[1]) {
              list[1] = { ...list[1], enabled: list[1].enabled === false ? true : false };
            }
            return { ...prev, promoBanners: list };
          });
          showToast('Promo Banner 2 toggled!');
        },
      },

      // NAVIGATION & TABS (6)
      {
        id: 'tab_contact',
        title: 'Dedicated Contact & 24/7 Support Page (/contact)',
        category: 'navigation',
        categoryLabel: 'Navigation & Routes',
        description: '24/7 customer support ticket form & direct WhatsApp dispatch page.',
        isEnabled: siteConfig.visibility?.showContactTab !== false,
        targetScreen: 'contact_footer',
        onToggle: () => {
          onUpdateSiteConfig((prev) => ({
            ...prev,
            visibility: { ...prev.visibility, showContactTab: !(prev.visibility?.showContactTab !== false) },
          }));
          showToast('Contact Page route toggled!');
        },
      },
      {
        id: 'tab_login',
        title: 'VIP Client Login & Wallet Portal (/login)',
        category: 'navigation',
        categoryLabel: 'Navigation & Routes',
        description: 'Customer account authentication, wallet balance top-up & payment receipts.',
        isEnabled: siteConfig.visibility?.showLoginTab !== false,
        targetScreen: 'visibility',
        onToggle: () => {
          onUpdateSiteConfig((prev) => ({
            ...prev,
            visibility: { ...prev.visibility, showLoginTab: !(prev.visibility?.showLoginTab !== false) },
          }));
          showToast('VIP Login Tab toggled!');
        },
      },
      {
        id: 'tab_siminfo',
        title: 'SIM Info & Telecommunication Tracker (/siminfo)',
        category: 'navigation',
        categoryLabel: 'Navigation & Routes',
        description: 'Franchise network lookup, CNIC ownership verification & family tree search tab.',
        isEnabled: siteConfig.visibility?.showSimDatabaseTracker !== false,
        targetScreen: 'visibility',
        onToggle: () => {
          onUpdateSiteConfig((prev) => ({
            ...prev,
            visibility: { ...prev.visibility, showSimDatabaseTracker: !(prev.visibility?.showSimDatabaseTracker !== false) },
          }));
          showToast('SIM Info Tab toggled!');
        },
      },
      {
        id: 'tab_about',
        title: 'About Sohaib Agency Page (/about)',
        category: 'navigation',
        categoryLabel: 'Navigation & Routes',
        description: 'Official biography, badges, and background of Sohaib Agency Hub.',
        isEnabled: siteConfig.visibility?.showAboutTab !== false,
        targetScreen: 'visibility',
        onToggle: () => {
          onUpdateSiteConfig((prev) => ({
            ...prev,
            visibility: { ...prev.visibility, showAboutTab: !(prev.visibility?.showAboutTab !== false) },
          }));
          showToast('About Tab toggled!');
        },
      },
      {
        id: 'tab_faqs',
        title: 'Frequently Asked Questions & Help Desk (/faqs)',
        category: 'navigation',
        categoryLabel: 'Navigation & Routes',
        description: 'Accordion answers to payment, account delivery, warranty, and replacement policies.',
        isEnabled: siteConfig.visibility?.showFaqsTab !== false,
        targetScreen: 'visibility',
        onToggle: () => {
          onUpdateSiteConfig((prev) => ({
            ...prev,
            visibility: { ...prev.visibility, showFaqsTab: !(prev.visibility?.showFaqsTab !== false) },
          }));
          showToast('FAQs Tab toggled!');
        },
      },
      {
        id: 'category_tabs',
        title: 'Store Category Filter Pills Bar',
        category: 'navigation',
        categoryLabel: 'Navigation & Routes',
        description: 'Scrollable category filter tabs (All, AI Tools, OTT, SMM, Tools, SIM, Software).',
        isEnabled: siteConfig.visibility?.showSearchAndCategoryBar !== false,
        targetScreen: 'categories',
        onToggle: () => {
          onUpdateSiteConfig((prev) => ({
            ...prev,
            visibility: { ...prev.visibility, showSearchAndCategoryBar: !(prev.visibility?.showSearchAndCategoryBar !== false) },
          }));
          showToast('Category Tabs bar toggled!');
        },
      },

      // CONVERSION & TRUST (5)
      {
        id: 'floating_whatsapp',
        title: 'Floating WhatsApp Quick Action Button (FAB)',
        category: 'conversion',
        categoryLabel: 'Conversion & Trust',
        description: 'Fixed bottom-right pulsating WhatsApp button for 1-tap customer chat.',
        isEnabled: siteConfig.visibility?.showFloatingWhatsApp !== false,
        targetScreen: 'contact_footer',
        onToggle: () => {
          onUpdateSiteConfig((prev) => ({
            ...prev,
            visibility: { ...prev.visibility, showFloatingWhatsApp: !(prev.visibility?.showFloatingWhatsApp !== false) },
          }));
          showToast('Floating WhatsApp toggled!');
        },
      },
      {
        id: 'header_cart',
        title: 'Header Shopping Cart Order Counter',
        category: 'conversion',
        categoryLabel: 'Conversion & Trust',
        description: 'Header order basket pill allowing multi-item checkout & cumulative order dispatch.',
        isEnabled: siteConfig.visibility?.showHeaderCartButton !== false,
        targetScreen: 'store_bars',
        onToggle: () => {
          onUpdateSiteConfig((prev) => ({
            ...prev,
            visibility: { ...prev.visibility, showHeaderCartButton: !(prev.visibility?.showHeaderCartButton !== false) },
          }));
          showToast('Header Cart button toggled!');
        },
      },
      {
        id: 'header_wallet_pill',
        title: 'Live Header User Wallet Balance Pill',
        category: 'conversion',
        categoryLabel: 'Conversion & Trust',
        description: 'Shows user live balance (e.g. Rs. 0) with 1-tap +Add Funds trigger in header.',
        isEnabled: siteConfig.storeBars?.showHeaderWalletPill !== false,
        targetScreen: 'store_bars',
        onToggle: () => {
          onUpdateSiteConfig((prev) => ({
            ...prev,
            storeBars: { ...prev.storeBars, showHeaderWalletPill: !(prev.storeBars?.showHeaderWalletPill !== false) },
          }));
          showToast('Live Wallet pill toggled!');
        },
      },
      {
        id: 'reviews_showcase',
        title: 'Customer Reviews & Star Ratings Showcase',
        category: 'conversion',
        categoryLabel: 'Conversion & Trust',
        description: 'Testimonial cards with customer avatars, verified badges, and 5-star ratings.',
        isEnabled: siteConfig.visibility?.showReviewsSection !== false,
        targetScreen: 'visibility',
        onToggle: () => {
          onUpdateSiteConfig((prev) => ({
            ...prev,
            visibility: { ...prev.visibility, showReviewsSection: !(prev.visibility?.showReviewsSection !== false) },
          }));
          showToast('Customer Reviews showcase toggled!');
        },
      },
      {
        id: 'trust_badges',
        title: 'Storefront Trust & Security Badges',
        category: 'conversion',
        categoryLabel: 'Conversion & Trust',
        description: 'Badges for 100% Guaranteed Delivery, 24/7 WhatsApp Assistance, and Safe SSL Payments.',
        isEnabled: siteConfig.visibility?.showHeroFeaturePills !== false,
        targetScreen: 'visibility',
        onToggle: () => {
          onUpdateSiteConfig((prev) => ({
            ...prev,
            visibility: { ...prev.visibility, showHeroFeaturePills: !(prev.visibility?.showHeroFeaturePills !== false) },
          }));
          showToast('Trust Badges toggled!');
        },
      },

      // PAYMENT GATEWAYS (4)
      {
        id: 'pay_easypaisa',
        title: 'EasyPaisa Instant Mobile Money Gateway',
        category: 'payments',
        categoryLabel: 'Payment Gateways',
        description: 'EasyPaisa account details, 1-tap copy account number, and instant QR/screenshot proof.',
        isEnabled: siteConfig.paymentMethods?.some((m) => m.id.toLowerCase().includes('easypaisa') && m.enabled !== false),
        targetScreen: 'payment_methods',
        onToggle: () => {
          onUpdateSiteConfig((prev) => {
            const methods = prev.paymentMethods.map((m) =>
              m.id.toLowerCase().includes('easypaisa') ? { ...m, enabled: m.enabled === false ? true : false } : m
            );
            return { ...prev, paymentMethods: methods };
          });
          showToast('EasyPaisa payment method toggled!');
        },
      },
      {
        id: 'pay_jazzcash',
        title: 'JazzCash Instant Mobile Money Gateway',
        category: 'payments',
        categoryLabel: 'Payment Gateways',
        description: 'JazzCash account details, title verification, and receipt upload support.',
        isEnabled: siteConfig.paymentMethods?.some((m) => m.id.toLowerCase().includes('jazzcash') && m.enabled !== false),
        targetScreen: 'payment_methods',
        onToggle: () => {
          onUpdateSiteConfig((prev) => {
            const methods = prev.paymentMethods.map((m) =>
              m.id.toLowerCase().includes('jazzcash') ? { ...m, enabled: m.enabled === false ? true : false } : m
            );
            return { ...prev, paymentMethods: methods };
          });
          showToast('JazzCash payment method toggled!');
        },
      },
      {
        id: 'pay_bank',
        title: 'Direct Bank Account Wire Transfer (Meezan/HBL)',
        category: 'payments',
        categoryLabel: 'Payment Gateways',
        description: 'Official Pakistani bank account details with IBAN and automated proof receipt.',
        isEnabled: siteConfig.paymentMethods?.some((m) => m.id.toLowerCase().includes('bank') && m.enabled !== false),
        targetScreen: 'payment_methods',
        onToggle: () => {
          onUpdateSiteConfig((prev) => {
            const methods = prev.paymentMethods.map((m) =>
              m.id.toLowerCase().includes('bank') ? { ...m, enabled: m.enabled === false ? true : false } : m
            );
            return { ...prev, paymentMethods: methods };
          });
          showToast('Bank transfer payment method toggled!');
        },
      },
      {
        id: 'pay_crypto',
        title: 'USDT / Binance Pay / Crypto Gateway',
        category: 'payments',
        categoryLabel: 'Payment Gateways',
        description: 'Cryptocurrency USDT TRC-20 wallet address and QR code for overseas clients.',
        isEnabled: siteConfig.paymentMethods?.some((m) => m.id.toLowerCase().includes('usdt') && m.enabled !== false),
        targetScreen: 'payment_methods',
        onToggle: () => {
          onUpdateSiteConfig((prev) => {
            const methods = prev.paymentMethods.map((m) =>
              m.id.toLowerCase().includes('usdt') ? { ...m, enabled: m.enabled === false ? true : false } : m
            );
            return { ...prev, paymentMethods: methods };
          });
          showToast('USDT payment method toggled!');
        },
      },

      // SEO & SYSTEM ENGINE (6)
      {
        id: 'seo_google_robots',
        title: 'Google Search Engine Indexing (Robots Index)',
        category: 'seo_system',
        categoryLabel: 'SEO & Performance',
        description: 'Allows Google, Bing & Yahoo search spiders to index your catalog and products.',
        isEnabled: siteConfig.seo?.robotsIndex !== false,
        targetScreen: 'seo',
        onToggle: () => {
          onUpdateSiteConfig((prev) => ({
            ...prev,
            seo: { ...prev.seo, robotsIndex: !(prev.seo?.robotsIndex !== false) },
          }));
          showToast('Google Robots Indexing toggled!');
        },
      },
      {
        id: 'seo_schema_jsonld',
        title: 'Schema.org JSON-LD Structured Data Engine',
        category: 'seo_system',
        categoryLabel: 'SEO & Performance',
        description: 'Generates Google Rich Snippets for WebApplication, Product prices, and owner credentials.',
        isEnabled: Boolean(siteConfig.seo?.schemaType),
        targetScreen: 'seo',
        onToggle: () => {
          onUpdateSiteConfig((prev) => ({
            ...prev,
            seo: { ...prev.seo, schemaType: prev.seo?.schemaType ? '' : 'WebApplication' },
          }));
          showToast('Schema.org JSON-LD toggled!');
        },
      },
      {
        id: 'rgb_border_glow',
        title: 'Soft Ambient RGB Light Outer Border',
        category: 'seo_system',
        categoryLabel: 'SEO & Performance',
        description: 'Futuristic glowing RGB multi-color border outlining the container on desktop & mobile.',
        isEnabled: siteConfig.banner.rgbBorderEnabled !== false,
        targetScreen: 'banner',
        onToggle: () => {
          onUpdateSiteConfig((prev) => ({
            ...prev,
            banner: { ...prev.banner, rgbBorderEnabled: !(prev.banner.rgbBorderEnabled !== false) },
          }));
          showToast('Soft RGB Border Glow toggled!');
        },
      },
      {
        id: 'web_tools_section',
        title: 'Live Web Tools & Quick Launch Deck Section',
        category: 'seo_system',
        categoryLabel: 'SEO & Performance',
        description: 'Interactive web tools grid displaying SIM lookup, IMEI tools, and AI utilities.',
        isEnabled: siteConfig.visibility?.showWebToolsOnStore !== false,
        targetScreen: 'tools',
        onToggle: () => {
          onUpdateSiteConfig((prev) => ({
            ...prev,
            visibility: { ...prev.visibility, showWebToolsOnStore: !(prev.visibility?.showWebToolsOnStore !== false) },
          }));
          showToast('Web Tools Section toggled!');
        },
      },
      {
        id: 'store_search_filter',
        title: 'Real-Time Catalog Search & Filter Engine',
        category: 'seo_system',
        categoryLabel: 'SEO & Performance',
        description: 'Instant live keyboard search bar filtering products by title, tag, or plan in 0ms.',
        isEnabled: siteConfig.visibility?.showToolsTab !== false,
        targetScreen: 'visibility',
        onToggle: () => {
          onUpdateSiteConfig((prev) => ({
            ...prev,
            visibility: { ...prev.visibility, showToolsTab: !(prev.visibility?.showToolsTab !== false) },
          }));
          showToast('Store Search Filter toggled!');
        },
      },
      {
        id: 'footer_quick_links',
        title: 'Footer Branding & Social Media Links Bar',
        category: 'seo_system',
        categoryLabel: 'SEO & Performance',
        description: 'Displays brand copyright, WhatsApp direct, TikTok, Telegram, and developer credit.',
        isEnabled: siteConfig.visibility?.showMarqueeBanner !== false,
        targetScreen: 'contact_footer',
        onToggle: () => {
          onUpdateSiteConfig((prev) => ({
            ...prev,
            visibility: { ...prev.visibility, showMarqueeBanner: !(prev.visibility?.showMarqueeBanner !== false) },
          }));
          showToast('Footer Socials bar toggled!');
        },
      },
    ];
  }, [siteConfig, onUpdateSiteConfig, showToast]);

  const totalFeaturesCount = systemFeatures.length;
  const activeFeaturesCount = systemFeatures.filter((f) => f.isEnabled).length;
  const disabledFeaturesCount = totalFeaturesCount - activeFeaturesCount;
  const healthScore = Math.round((activeFeaturesCount / totalFeaturesCount) * 100);

  // Filtered list of features
  const filteredFeatures = useMemo(() => {
    return systemFeatures.filter((f) => {
      const matchCat = featureFilter === 'all' ? true : f.category === featureFilter;
      const matchSearch =
        !featureSearch.trim() ||
        f.title.toLowerCase().includes(featureSearch.toLowerCase()) ||
        f.description.toLowerCase().includes(featureSearch.toLowerCase()) ||
        f.categoryLabel.toLowerCase().includes(featureSearch.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [systemFeatures, featureFilter, featureSearch]);

  return (
    <div className="space-y-5 animate-fade-in">
      {/* ==================== 1. EXECUTIVE HERO COMMAND BANNER ==================== */}
      <div className="rounded-[30px] bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 border-2 border-indigo-500/40 p-4 sm:p-6 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-pink-500/15 via-indigo-500/15 to-teal-500/15 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/40 text-[11px] font-extrabold text-sky-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              <span>LIVE SYSTEM DIAGNOSTICS &amp; ANALYTICS RADAR</span>
            </div>
            <h2 className="text-xl sm:text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-indigo-100 to-sky-300">
              📊 Store Master Dashboard &amp; Feature Audit
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 font-medium">
              Real-time reactive audit of all <strong>{totalFeaturesCount} core functions</strong>, products, web tools,
              payment gateways, and operational health.
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => {
                playPopSound(720);
                copyText(
                  JSON.stringify(
                    {
                      auditDate: new Date().toISOString(),
                      healthScore: `${healthScore}%`,
                      activeFeaturesCount,
                      totalFeaturesCount,
                      totalProducts,
                      liveProducts,
                      hiddenProducts,
                      totalTools,
                      totalProofs,
                      approvedVolume,
                      siteConfig,
                    },
                    null,
                    2
                  ),
                  'System Health JSON Copied!'
                );
              }}
              className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs font-extrabold cursor-pointer flex items-center gap-1.5 transition shadow-sm"
            >
              <FaCopy className="w-3.5 h-3.5 text-sky-300" />
              <span>Export Audit JSON</span>
            </button>
            <button
              type="button"
              onClick={exitSecretAdminPortal}
              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-xs font-extrabold shadow-md cursor-pointer flex items-center gap-1.5 transition hover:scale-105"
            >
              <FaEye className="w-3.5 h-3.5" />
              <span>View Public Store</span>
            </button>
          </div>
        </div>

        {/* Operational Health Capacity Bar */}
        <div className="mt-5 pt-4 border-t border-white/15 space-y-2">
          <div className="flex flex-wrap items-center justify-between text-xs font-extrabold gap-2">
            <span className="flex items-center gap-1.5 text-sky-300">
              <FaBolt className="text-amber-400" />
              <span>Overall Operational Capacity:</span>
            </span>
            <span className="text-white font-mono-code">
              {healthScore}% Active ({activeFeaturesCount} of {totalFeaturesCount} Functions ON • {disabledFeaturesCount} OFF)
            </span>
          </div>
          <div className="w-full h-3 rounded-full bg-slate-900 border border-white/10 overflow-hidden p-0.5">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                healthScore >= 85
                  ? 'bg-gradient-to-r from-emerald-500 via-teal-400 to-sky-400'
                  : healthScore >= 60
                  ? 'bg-gradient-to-r from-amber-500 to-orange-400'
                  : 'bg-gradient-to-r from-rose-500 to-red-600'
              }`}
              style={{ width: `${healthScore}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* ==================== 2. FOUR HIGH-IMPACT KPI METRIC CARDS ==================== */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
        {/* Card 1: Products Catalog */}
        <div
          onClick={() => onOpenScreen('services', 1)}
          className="rounded-2xl p-3.5 sm:p-5 bg-white border-2 border-pink-200 hover:border-pink-500 shadow-md transition cursor-pointer hover:scale-[1.02] flex flex-col justify-between space-y-3"
        >
          <div className="flex items-center justify-between">
            <span className="w-10 h-10 rounded-xl bg-pink-100 text-pink-700 flex items-center justify-center font-bold text-lg shadow-xs">
              <FaBagShopping />
            </span>
            <span className="px-2 py-0.5 rounded-full bg-pink-50 text-pink-700 text-[10px] font-extrabold border border-pink-200">
              {liveProducts} Live
            </span>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display">
              {totalProducts}
            </div>
            <div className="text-xs font-extrabold text-slate-700 mt-0.5">Total Store Products</div>
            <div className="text-[10px] sm:text-[11px] text-slate-500 font-semibold truncate mt-1">
              {totalPlans} Pricing Plans • {hiddenProducts} Hidden
            </div>
          </div>
          <div className="flex items-center justify-between text-[11px] font-extrabold text-pink-600 pt-2 border-t border-slate-100">
            <span>Manage Catalog</span>
            <FaArrowRight className="w-3 h-3" />
          </div>
        </div>

        {/* Card 2: Web Tools Deck */}
        <div
          onClick={() => onOpenScreen('tools', 1)}
          className="rounded-2xl p-3.5 sm:p-5 bg-white border-2 border-indigo-200 hover:border-indigo-500 shadow-md transition cursor-pointer hover:scale-[1.02] flex flex-col justify-between space-y-3"
        >
          <div className="flex items-center justify-between">
            <span className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-lg shadow-xs">
              <FaScrewdriverWrench />
            </span>
            <span className="px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-[10px] font-extrabold border border-indigo-200">
              {liveTools} Active
            </span>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display">
              {totalTools}
            </div>
            <div className="text-xs font-extrabold text-slate-700 mt-0.5">Live Web Tools</div>
            <div className="text-[10px] sm:text-[11px] text-slate-500 font-semibold truncate mt-1">
              Fast URL Launchers • {hiddenTools} Hidden
            </div>
          </div>
          <div className="flex items-center justify-between text-[11px] font-extrabold text-indigo-600 pt-2 border-t border-slate-100">
            <span>Manage Web Tools</span>
            <FaArrowRight className="w-3 h-3" />
          </div>
        </div>

        {/* Card 3: Payment Verification & Proofs */}
        <div
          onClick={() => onOpenScreen('payments')}
          className="rounded-2xl p-3.5 sm:p-5 bg-white border-2 border-emerald-200 hover:border-emerald-500 shadow-md transition cursor-pointer hover:scale-[1.02] flex flex-col justify-between space-y-3"
        >
          <div className="flex items-center justify-between">
            <span className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-lg shadow-xs">
              <FaWallet />
            </span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold border ${
              pendingProofs > 0 ? 'bg-amber-100 text-amber-800 border-amber-300 animate-pulse' : 'bg-emerald-50 text-emerald-700 border-emerald-200'
            }`}>
              {pendingProofs} Pending
            </span>
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-extrabold text-slate-900 font-display">
              Rs. {approvedVolume.toLocaleString()}
            </div>
            <div className="text-xs font-extrabold text-slate-700 mt-0.5">Approved Sales Volume</div>
            <div className="text-[10px] sm:text-[11px] text-slate-500 font-semibold truncate mt-1">
              {approvedProofs} Approved • {rejectedProofs} Rejected
            </div>
          </div>
          <div className="flex items-center justify-between text-[11px] font-extrabold text-emerald-600 pt-2 border-t border-slate-100">
            <span>Review Proofs</span>
            <FaArrowRight className="w-3 h-3" />
          </div>
        </div>

        {/* Card 4: System Functions Audit */}
        <div
          onClick={() => onOpenScreen('visibility')}
          className="rounded-2xl p-3.5 sm:p-5 bg-white border-2 border-purple-200 hover:border-purple-500 shadow-md transition cursor-pointer hover:scale-[1.02] flex flex-col justify-between space-y-3"
        >
          <div className="flex items-center justify-between">
            <span className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-lg shadow-xs">
              <FaSliders />
            </span>
            <span className="px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 text-[10px] font-extrabold border border-purple-200">
              {healthScore}% Active
            </span>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display">
              {activeFeaturesCount}/{totalFeaturesCount}
            </div>
            <div className="text-xs font-extrabold text-slate-700 mt-0.5">Core System Functions</div>
            <div className="text-[10px] sm:text-[11px] text-slate-500 font-semibold truncate mt-1">
              {disabledFeaturesCount} Disabled • 0 Errors
            </div>
          </div>
          <div className="flex items-center justify-between text-[11px] font-extrabold text-purple-600 pt-2 border-t border-slate-100">
            <span>Audit Master Switch</span>
            <FaArrowRight className="w-3 h-3" />
          </div>
        </div>
      </div>

      {/* ==================== 3. DASHBOARD SUB-NAVIGATION TABS ==================== */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {[
          ...(isSuperadmin
            ? [{ id: 'admins' as const, label: '🛡️ Admin Team & RBAC', badge: 'Superadmin' }]
            : []),
          ...(isSuperadmin || adminPermissions.manage_users
            ? [{ id: 'users' as const, label: '👥 User Accounts & Wallets', badge: 'Users & Bans' }]
            : []),
          ...(isSuperadmin || adminPermissions.view_telemetry
            ? [{ id: 'visitors' as const, label: '🕵️ Live Visitors & Devices', badge: 'Live Telemetry' }]
            : []),
          ...(isSuperadmin || adminPermissions.manage_site_config
            ? [{ id: 'matrix' as const, label: `⚡ Live Feature Matrix (${totalFeaturesCount})`, badge: `${activeFeaturesCount} ON` }]
            : []),
          ...(isSuperadmin || adminPermissions.manage_services
            ? [{ id: 'products' as const, label: `🛍️ Products Catalog (${totalProducts})`, badge: `${liveProducts} Live` }]
            : []),
          ...(isSuperadmin || adminPermissions.manage_tools
            ? [{ id: 'tools' as const, label: `🛠️ Web Tools Deck (${totalTools})`, badge: `${liveTools} Live` }]
            : []),
          ...(isSuperadmin || adminPermissions.manage_orders
            ? [{ id: 'financials' as const, label: `💳 Financials & Proofs (${totalProofs})`, badge: `${pendingProofs} New` }]
            : []),
          ...(isSuperadmin || adminPermissions.manage_orders || adminPermissions.manage_site_config
            ? [{ id: 'coupons' as const, label: '🏷️ Coupons & Discounts', badge: 'Active Deals' }]
            : []),
          { id: 'tech' as const, label: '🚀 Tech Stack & SEO Specs', badge: 'Next.js 16' },
        ].map((tab) => {
          const isAct = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                playPopSound(540);
                setActiveTab(tab.id);
              }}
              className={`px-3 sm:px-4 py-2 rounded-xl text-xs font-extrabold whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 ${
                isAct
                  ? 'bg-slate-900 text-white shadow-md scale-[1.02]'
                  : 'bg-white/90 hover:bg-white text-slate-700 border border-slate-200'
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold ${
                  isAct ? 'bg-pink-500 text-white' : 'bg-slate-100 text-slate-600'
                }`}
              >
                {tab.badge}
              </span>
            </button>
          );
        })}
      </div>

      {/* ==================== TAB: SUPERADMIN TEAM & RBAC MANAGEMENT ==================== */}
      {activeTab === 'admins' && (
        <AdminSubAdminManagerView
          showToast={showToast}
          copyText={copyText}
          playPopSound={playPopSound}
        />
      )}

      {/* ==================== TAB: PROMOTIONAL COUPONS & DISCOUNTS ==================== */}
      {activeTab === 'coupons' && (
        <AdminCouponManagerView
          showToast={showToast}
          copyText={copyText}
          playPopSound={playPopSound}
        />
      )}

      {/* ==================== TAB: USER ACCOUNTS & VIP WALLETS ==================== */}
      {activeTab === 'users' && (
        <AdminUserManagementView
          showToast={showToast}
          copyText={copyText}
          playPopSound={playPopSound}
        />
      )}

      {/* ==================== TAB 0: LIVE VISITORS & DEVICE TELEMETRY ==================== */}
      {activeTab === 'visitors' && (
        <AdminVisitorTelemetryView
          showToast={showToast}
          copyText={copyText}
          playPopSound={playPopSound}
        />
      )}

      {/* ==================== TAB 1: MASTER 26-FEATURE SYSTEM AUDIT ==================== */}
      {activeTab === 'matrix' && (
        <div className="space-y-4">
          {/* Controls: Search + Category Filters */}
          <div className="p-3 sm:p-4 rounded-2xl bg-white/95 border border-slate-200 shadow-xs space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="sim-input-box !py-2 !px-3.5 !rounded-xl flex-1">
                <FaMagnifyingGlass className="text-slate-400 mr-2 w-3.5 h-3.5" />
                <input
                  type="text"
                  value={featureSearch}
                  onChange={(e) => setFeatureSearch(e.target.value)}
                  placeholder="Search system functions (e.g. Hero Banner, EasyPaisa, Contact, Reviews, Google)..."
                  className="w-full bg-transparent border-none outline-none font-bold text-xs text-slate-900 placeholder:text-slate-400"
                />
                {featureSearch && (
                  <button
                    type="button"
                    onClick={() => setFeatureSearch('')}
                    className="text-xs font-extrabold text-rose-500 px-1 cursor-pointer"
                  >
                    Clear
                  </button>
                )}
              </div>

              <div className="text-xs font-bold text-slate-500 self-end sm:self-auto">
                Showing <strong>{filteredFeatures.length}</strong> of <strong>{totalFeaturesCount}</strong> functions
              </div>
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {[
                { id: 'all' as const, label: 'All Functions', count: totalFeaturesCount },
                { id: 'visuals' as const, label: '🎨 Banners & Visuals', count: 5 },
                { id: 'navigation' as const, label: '🧭 Navigation & Routes', count: 6 },
                { id: 'conversion' as const, label: '🛡️ Conversion & Trust', count: 5 },
                { id: 'payments' as const, label: '🏦 Payment Gateways', count: 4 },
                { id: 'seo_system' as const, label: '🌐 SEO & System', count: 6 },
              ].map((pill) => {
                const isSelected = featureFilter === pill.id;
                return (
                  <button
                    key={pill.id}
                    type="button"
                    onClick={() => {
                      playPopSound(580);
                      setFeatureFilter(pill.id);
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-extrabold whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                    }`}
                  >
                    <span>{pill.label}</span>
                    <span
                      className={`px-1.5 py-0.2 rounded-full text-[9px] font-extrabold ${
                        isSelected ? 'bg-white/20 text-white' : 'bg-white text-slate-700'
                      }`}
                    >
                      {pill.count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Feature Audit Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {filteredFeatures.map((item) => (
              <div
                key={item.id}
                className={`p-3.5 sm:p-4 rounded-2xl border-2 transition-all flex flex-col justify-between gap-3 shadow-xs ${
                  item.isEnabled
                    ? 'bg-white/95 border-emerald-200 hover:border-emerald-400'
                    : 'bg-slate-50/90 border-slate-300 opacity-75'
                }`}
              >
                <div className="space-y-1.5 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-extrabold text-[9px] uppercase tracking-wider">
                      {item.categoryLabel}
                    </span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold flex items-center gap-1 border ${
                        item.isEnabled
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                          : 'bg-rose-50 text-rose-700 border-rose-300'
                      }`}
                    >
                      {item.isEnabled ? (
                        <>
                          <FaCircleCheck className="w-3 h-3 text-emerald-600" />
                          <span>● LIVE / ON</span>
                        </>
                      ) : (
                        <>
                          <FaCircleXmark className="w-3 h-3 text-rose-500" />
                          <span>○ DISABLED</span>
                        </>
                      )}
                    </span>
                  </div>

                  <h4 className="text-sm font-extrabold text-slate-900 truncate">{item.title}</h4>
                  <p className="text-xs text-slate-600 leading-relaxed font-medium line-clamp-2">
                    {item.description}
                  </p>
                </div>

                {/* Bottom Action Bar */}
                <div className="flex items-center justify-between pt-2.5 border-t border-slate-100 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      playPopSound(item.isEnabled ? 460 : 700);
                      item.onToggle();
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-extrabold cursor-pointer transition flex items-center gap-1.5 border shadow-2xs ${
                      item.isEnabled
                        ? 'bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-700'
                        : 'bg-slate-200 hover:bg-slate-300 text-slate-800 border-slate-300'
                    }`}
                  >
                    <span>{item.isEnabled ? 'Turn OFF' : 'Turn ON'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onOpenScreen(item.targetScreen, item.targetStep)}
                    className="text-xs font-extrabold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
                  >
                    <span>Edit Settings</span>
                    <FaArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ==================== TAB 2: PRODUCTS & CATEGORY AUDIT ==================== */}
      {activeTab === 'products' && (
        <div className="space-y-4">
          {/* Category Distribution Header */}
          <div className="p-4 rounded-2xl bg-white/95 border border-pink-200 shadow-xs space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                  <FaLayerGroup className="text-pink-600" />
                  <span>Category Distribution &amp; Catalog Breadth</span>
                </h3>
                <p className="text-xs text-slate-600 font-medium">
                  {totalProducts} products mapped across {totalCategories} store categories with {totalPlans} pricing plans.
                </p>
              </div>

              <button
                type="button"
                onClick={() => onOpenScreen('services', 1)}
                className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 text-white text-xs font-extrabold shadow cursor-pointer self-start sm:self-auto"
              >
                + Add New Product
              </button>
            </div>

            {/* Category Pills Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
              {activeCategories.map((cat) => {
                const count =
                  cat.id === 'all'
                    ? servicesCatalog.length
                    : servicesCatalog.filter((s) => s.category === cat.id).length;
                return (
                  <div
                    key={cat.id}
                    className={`p-3 rounded-xl border flex flex-col justify-between gap-1 shadow-2xs ${
                      cat.hidden ? 'bg-slate-100 border-slate-300 opacity-60' : 'bg-white border-pink-100'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-extrabold text-slate-900 truncate">{cat.shortLabel}</span>
                      <span className="px-1.5 py-0.2 rounded-full bg-pink-50 text-pink-700 text-[9px] font-extrabold border border-pink-200">
                        {count}
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-500 truncate">{cat.label}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Products Catalog Summary List */}
          <div className="rounded-2xl bg-white/95 border border-slate-200 p-4 space-y-3 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold uppercase tracking-wider text-slate-700">
                📦 Catalog Services ({servicesCatalog.length} Total • {liveProducts} Live)
              </span>
              <button
                type="button"
                onClick={() => onOpenScreen('services')}
                className="text-xs font-extrabold text-pink-600 hover:text-pink-700 flex items-center gap-1 cursor-pointer"
              >
                <span>View Full Wizard</span>
                <FaArrowRight className="w-3 h-3" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 max-h-96 overflow-y-auto pr-1">
              {servicesCatalog.map((srv) => (
                <div
                  key={srv.id}
                  className={`p-3 rounded-xl border flex items-center justify-between gap-3 ${
                    srv.hidden ? 'bg-slate-100/90 border-slate-300 opacity-75' : 'bg-white border-slate-200'
                  }`}
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs sm:text-sm font-extrabold text-slate-900 truncate">
                        {srv.title}
                      </span>
                      <span className="px-1.5 py-0.2 rounded bg-pink-50 text-pink-700 text-[9px] font-extrabold border border-pink-200 whitespace-nowrap">
                        {srv.badge}
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-500 font-semibold truncate mt-0.5">
                      {srv.tiers?.length || 0} Plans • ID: <span className="font-mono-code">{srv.id}</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => toggleServiceHidden && toggleServiceHidden(srv.id)}
                    className={`px-2.5 py-1.5 rounded-xl text-[10px] font-extrabold border cursor-pointer whitespace-nowrap flex items-center gap-1 ${
                      srv.hidden
                        ? 'bg-amber-100 text-amber-900 border-amber-300'
                        : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    }`}
                  >
                    {srv.hidden ? <FaEyeSlash className="w-3 h-3" /> : <FaEye className="w-3 h-3" />}
                    <span>{srv.hidden ? 'Hidden' : 'Live'}</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ==================== TAB 3: WEB TOOLS DECK ==================== */}
      {activeTab === 'tools' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-white/95 border border-indigo-200 shadow-xs space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                  <FaScrewdriverWrench className="text-indigo-600" />
                  <span>Web Tools &amp; Telecommunication Utility Deck</span>
                </h3>
                <p className="text-xs text-slate-600 font-medium">
                  {totalTools} web tools configured. Instant one-click launcher for external portals and SIM lookups.
                </p>
              </div>

              <button
                type="button"
                onClick={() => onOpenScreen('tools', 1)}
                className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs font-extrabold shadow cursor-pointer self-start sm:self-auto"
              >
                + Add Web Tool
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
              {webToolsCatalog.map((tool) => (
                <div
                  key={tool.id}
                  className={`p-3.5 rounded-2xl border flex items-center justify-between gap-3 shadow-xs ${
                    tool.hidden ? 'bg-slate-100 border-slate-300 opacity-75' : 'bg-white border-indigo-100'
                  }`}
                >
                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-extrabold text-slate-900 truncate">{tool.title}</span>
                      <span className="px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-[9px] font-extrabold border border-indigo-200">
                        {tool.badge}
                      </span>
                    </div>
                    <div className="text-[11px] font-mono-code text-pink-600 truncate">{tool.toolUrl}</div>
                    <div className="text-[11px] text-slate-500 line-clamp-1">{tool.desc}</div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      type="button"
                      onClick={() => toggleToolHidden && toggleToolHidden(tool.id)}
                      className={`px-2.5 py-1.5 rounded-xl text-xs font-extrabold border cursor-pointer flex items-center gap-1 ${
                        tool.hidden
                          ? 'bg-amber-100 text-amber-900 border-amber-300'
                          : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      }`}
                    >
                      {tool.hidden ? <FaEyeSlash className="w-3 h-3" /> : <FaEye className="w-3 h-3" />}
                      <span>{tool.hidden ? 'Hidden' : 'Live'}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ==================== TAB 4: FINANCIALS & WALLET RADAR ==================== */}
      {activeTab === 'financials' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="p-4 rounded-2xl bg-white border border-emerald-200 shadow-xs space-y-2">
              <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
                <FaMoneyBillWave className="text-emerald-600" />
                <span>Verified Volume</span>
              </span>
              <div className="text-2xl font-extrabold text-slate-900 font-display">
                Rs. {approvedVolume.toLocaleString()}
              </div>
              <div className="text-xs text-slate-500 font-semibold">{approvedProofs} approved client receipts</div>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-amber-200 shadow-xs space-y-2">
              <span className="text-xs font-extrabold uppercase tracking-wider text-amber-800 flex items-center gap-1.5">
                <FaClock className="text-amber-600" />
                <span>Pending Approvals</span>
              </span>
              <div className="text-2xl font-extrabold text-slate-900 font-display">
                Rs. {pendingVolume.toLocaleString()}
              </div>
              <div className="text-xs text-slate-500 font-semibold">{pendingProofs} receipts awaiting review</div>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-indigo-200 shadow-xs space-y-2">
              <span className="text-xs font-extrabold uppercase tracking-wider text-indigo-800 flex items-center gap-1.5">
                <FaCreditCard className="text-indigo-600" />
                <span>Active Payment Gateways</span>
              </span>
              <div className="text-2xl font-extrabold text-slate-900 font-display">
                {activePaymentMethods} / {paymentMethods.length}
              </div>
              <div className="text-xs text-slate-500 font-semibold">EasyPaisa, JazzCash &amp; Bank</div>
            </div>
          </div>

          {/* Payment Gateways List */}
          <div className="p-4 rounded-2xl bg-white/95 border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold uppercase tracking-wider text-slate-800">
                🏦 Configured Payment Channels ({paymentMethods.length})
              </span>
              <button
                type="button"
                onClick={() => onOpenScreen('payment_methods')}
                className="text-xs font-extrabold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
              >
                <span>Edit Accounts</span>
                <FaArrowRight className="w-3 h-3" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {paymentMethods.map((m) => (
                <div
                  key={m.id}
                  className={`p-3.5 rounded-2xl border flex items-center justify-between gap-3 ${
                    m.enabled !== false ? 'bg-white border-emerald-200' : 'bg-slate-50 border-slate-300 opacity-60'
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-extrabold text-slate-900">{m.label}</span>
                      <span className="text-[10px] font-mono-code bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded font-bold">
                        {m.id}
                      </span>
                    </div>
                    <div className="text-xs font-mono-code font-bold text-emerald-700 mt-0.5">
                      {m.accountTitle} • {m.accountNumber}
                    </div>
                  </div>

                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold border ${
                      m.enabled !== false
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                        : 'bg-rose-50 text-rose-700 border-rose-300'
                    }`}
                  >
                    {m.enabled !== false ? '● Active' : '○ Off'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ==================== TAB 5: TECH STACK & SYSTEM SPECS ==================== */}
      {activeTab === 'tech' && (
        <div className="space-y-4">
          <div className="p-4 sm:p-5 rounded-2xl bg-white/95 border border-indigo-200 shadow-xs space-y-4">
            <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <FaServer className="text-indigo-600" />
              <span>System Specs, Architecture &amp; Performance</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <div className="text-xs font-extrabold text-slate-700">App Framework</div>
                <div className="text-sm font-black text-slate-900">Next.js 16.4.2</div>
                <div className="text-[11px] text-slate-500">Turbopack SSR + React 19 Client Hydration</div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <div className="text-xs font-extrabold text-slate-700">Database Layer</div>
                <div className="text-sm font-black text-slate-900 flex items-center gap-1.5">
                  <span className={`w-2 h-2 rounded-full ${dbStatus?.status === 'CONNECTED_OK' ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`}></span>
                  <span>Supabase PostgreSQL</span>
                </div>
                <div className="text-[11px] font-mono text-slate-600 break-all">
                  {dbStatus?.project_id && dbStatus.project_id !== 'none'
                    ? `Connected: ${dbStatus.project_id}.supabase.co`
                    : 'Awaiting .env.local configuration'}
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <div className="text-xs font-extrabold text-slate-700">Styling &amp; Engine</div>
                <div className="text-sm font-black text-slate-900">Tailwind CSS v4</div>
                <div className="text-[11px] text-slate-500">Neumorphic 3D glass, zero npm build bloat</div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <div className="text-xs font-extrabold text-slate-700">Active Theme</div>
                <div className="text-sm font-black text-indigo-700 capitalize">{websiteUiMode}</div>
                <div className="text-[11px] text-slate-500">6 Curated UI Themes with 1-click switcher</div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <div className="text-xs font-extrabold text-slate-700">Active Typography</div>
                <div className="text-sm font-black text-purple-700 capitalize">{websiteFontMode}</div>
                <div className="text-[11px] text-slate-500">6 Google Font Packs dynamically loaded</div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <div className="text-xs font-extrabold text-slate-700">SEO &amp; Microdata</div>
                <div className="text-sm font-black text-emerald-700">Schema.org JSON-LD</div>
                <div className="text-[11px] text-slate-500">Full OpenGraph, Twitter Cards &amp; Google Snippets</div>
              </div>
            </div>

            {/* Static Routes Prerendered Status */}
            <div className="p-3.5 rounded-xl bg-slate-950 text-white space-y-2">
              <div className="text-xs font-extrabold text-sky-300 flex items-center gap-1.5">
                <FaCode />
                <span>19 Prerendered Static &amp; Dynamic Endpoints</span>
              </div>
              <div className="flex flex-wrap gap-1.5 text-[11px] font-mono-code">
                <span className="px-2 py-0.5 rounded bg-white/10 text-emerald-300">/</span>
                <span className="px-2 py-0.5 rounded bg-white/10 text-emerald-300">/contact</span>
                <span className="px-2 py-0.5 rounded bg-white/10 text-emerald-300">/login</span>
                <span className="px-2 py-0.5 rounded bg-white/10 text-emerald-300">/about</span>
                <span className="px-2 py-0.5 rounded bg-white/10 text-emerald-300">/faqs</span>
                <span className="px-2 py-0.5 rounded bg-white/10 text-emerald-300">/siminfo</span>
                <span className="px-2 py-0.5 rounded bg-white/10 text-sky-300">/saqibadmin</span>
                <span className="px-2 py-0.5 rounded bg-white/10 text-amber-300">/api/admin/auth</span>
                <span className="px-2 py-0.5 rounded bg-white/10 text-amber-300">/api/services</span>
                <span className="px-2 py-0.5 rounded bg-white/10 text-amber-300">/api/tools</span>
                <span className="px-2 py-0.5 rounded bg-white/10 text-amber-300">/api/site-config</span>
                <span className="px-2 py-0.5 rounded bg-white/10 text-amber-300">/api/payments</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
