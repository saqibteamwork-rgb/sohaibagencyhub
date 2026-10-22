/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { CategoryId, StoreService } from '../data/defaultCatalog';
import {
  renderMarqueeIcon,
  SiGooglegemini,
  SiTiktok,
  FaSatelliteDish
} from './BrandIcons';
import { SiteStoreBarsConfig } from './AdminStepByStepSettingsHub';
import { SiteSettingsConfig } from '../types/siteConfig';

interface MarqueeItem {
  id: string;
  label: string;
  sub: string;
  icon: string;
  color: string;
  category: CategoryId;
  serviceId?: string;
}

const MARQUEE_ROW_1: MarqueeItem[] = [
  {
    id: 'm-chatgpt',
    label: 'ChatGPT Plus (GPT-4o / o3)',
    sub: 'Rs. 550 • Official Workspace',
    icon: 'fa-solid fa-robot',
    color: 'from-emerald-500 to-teal-600',
    category: 'capcut_ai',
    serviceId: 'chatgpt-plus'
  },
  {
    id: 'm-gemini',
    label: 'Google Gemini 18-Month Pro',
    sub: 'Rs. 1,800 • 2TB Google Cloud',
    icon: 'fa-solid fa-wand-magic-sparkles',
    color: 'from-blue-500 to-indigo-600',
    category: 'capcut_ai',
    serviceId: 'gemini-18m-pro'
  },
  {
    id: 'm-capcut',
    label: 'CapCut Pro (Mobile & PC)',
    sub: 'Rs. 350 • 4K Export & AI',
    icon: 'fa-solid fa-clapperboard',
    color: 'from-pink-500 to-purple-600',
    category: 'capcut_ai',
    serviceId: 'capcut-pro'
  },
  {
    id: 'm-lovable',
    label: 'Lovable Pro AI App Builder',
    sub: 'Rs. 1,450 • Full-Stack AI',
    icon: 'fa-solid fa-code',
    color: 'from-rose-500 to-pink-600',
    category: 'capcut_ai',
    serviceId: 'lovable-pro'
  },
  {
    id: 'm-elevenlabs',
    label: 'ElevenLabs 300k Credits',
    sub: 'No Expiry • Voice Cloning',
    icon: 'fa-solid fa-microphone-lines',
    color: 'from-violet-600 to-purple-700',
    category: 'capcut_ai',
    serviceId: 'elevenlabs-300k'
  },
  {
    id: 'm-muse',
    label: 'Muse AI — 1 Billion Tokens',
    sub: 'Rs. 1,950 • Unlimited Gen',
    icon: 'fa-solid fa-brain',
    color: 'from-fuchsia-500 to-pink-600',
    category: 'capcut_ai',
    serviceId: 'muse-ai-1b'
  },
  {
    id: 'm-claude',
    label: 'Claude 3.7 Sonnet Pro',
    sub: 'Rs. 1,100 • Coding & Writing',
    icon: 'fa-solid fa-bolt',
    color: 'from-amber-500 to-orange-600',
    category: 'capcut_ai',
    serviceId: 'claude-ai-pro'
  }
];

const MARQUEE_ROW_2: MarqueeItem[] = [
  {
    id: 'm-tt-uk',
    label: 'TikTok UK / USA Account',
    sub: 'Rs. 450 • No VPN Monetized',
    icon: 'fa-brands fa-tiktok',
    color: 'from-slate-900 to-rose-600',
    category: 'tiktok_fb',
    serviceId: 'tiktok-uk-usa-acc'
  },
  {
    id: 'm-tt-agency',
    label: 'TikTok & FB Ad Agency Acc',
    sub: 'Rs. 1,600 • Zero Tax Spend',
    icon: 'fa-solid fa-bullhorn',
    color: 'from-blue-600 to-cyan-600',
    category: 'tiktok_fb',
    serviceId: 'tiktok-ad-agency'
  },
  {
    id: 'm-sim-cdr',
    label: '2026 SIM Owner & CDR Call History',
    sub: 'Rs. 250 • 15 Min PDF Report',
    icon: 'fa-solid fa-satellite-dish',
    color: 'from-emerald-600 to-teal-700',
    category: 'franchise_sim',
    serviceId: 'sim-owner-details'
  },
  {
    id: 'm-nadra-frc',
    label: 'NADRA Family Tree (FRC) & CNIC',
    sub: 'Rs. 500 • Verified Record',
    icon: 'fa-solid fa-id-card',
    color: 'from-indigo-600 to-blue-700',
    category: 'nadra_records',
    serviceId: 'nadra-cnic-frc'
  },
  {
    id: 'm-canva-host',
    label: 'Canva Pro + Hostinger 12M',
    sub: 'Rs. 200 • Lifetime / 1 Year',
    icon: 'fa-solid fa-palette',
    color: 'from-cyan-500 to-blue-600',
    category: 'capcut_ai',
    serviceId: 'canva-pro'
  },
  {
    id: 'm-usdt',
    label: 'USDT / BTC P2P & Video Editing',
    sub: 'Instant JazzCash / EasyPaisa',
    icon: 'fa-brands fa-bitcoin',
    color: 'from-amber-500 to-yellow-600',
    category: 'creative_crypto',
    serviceId: 'crypto-btc-usdt'
  }
];

interface CalcPreset {
  id: string;
  name: string;
  unitLabel: string;
  minUnits: number;
  maxUnits: number;
  step: number;
  defaultUnits: number;
  wholesalePerUnit: number;
  retailPerUnit: number;
  badge: string;
  deliveryTime: string;
  serviceId: string;
}

const CALCULATOR_PRESETS: CalcPreset[] = [
  {
    id: 'calc-chatgpt',
    name: 'ChatGPT Plus (GPT-4o) Accounts',
    unitLabel: 'Accounts / Months',
    minUnits: 1,
    maxUnits: 25,
    step: 1,
    defaultUnits: 3,
    wholesalePerUnit: 500,
    retailPerUnit: 1500,
    badge: '🤖 High Reseller Demand',
    deliveryTime: '5 Mins on WhatsApp',
    serviceId: 'chatgpt-plus'
  },
  {
    id: 'calc-gemini',
    name: 'Google Gemini 18M Pro + 2TB Storage',
    unitLabel: 'Gmail Activations',
    minUnits: 1,
    maxUnits: 20,
    step: 1,
    defaultUnits: 2,
    wholesalePerUnit: 1700,
    retailPerUnit: 4500,
    badge: '✨ 1.5 Years Official',
    deliveryTime: '10 Mins Direct Gmail',
    serviceId: 'gemini-18m-pro'
  },
  {
    id: 'calc-capcut',
    name: 'CapCut Pro 4K (Mobile + PC Login)',
    unitLabel: 'Pro Accounts',
    minUnits: 1,
    maxUnits: 30,
    step: 1,
    defaultUnits: 5,
    wholesalePerUnit: 320,
    retailPerUnit: 900,
    badge: '🎬 #1 Best Seller',
    deliveryTime: 'Instant 3 Mins',
    serviceId: 'capcut-pro'
  },
  {
    id: 'calc-tiktok-flw',
    name: 'TikTok Real Non-Drop Followers',
    unitLabel: 'Thousand (K) Followers',
    minUnits: 1,
    maxUnits: 50,
    step: 1,
    defaultUnits: 10,
    wholesalePerUnit: 290,
    retailPerUnit: 750,
    badge: '🔥 Monetization Ready',
    deliveryTime: 'Instant Start • Refill Warranty',
    serviceId: 'tiktok-smm-boost'
  },
  {
    id: 'calc-tiktok-uk',
    name: 'TikTok UK / USA Monetizable Accounts',
    unitLabel: 'UK/USA Accounts',
    minUnits: 1,
    maxUnits: 20,
    step: 1,
    defaultUnits: 3,
    wholesalePerUnit: 400,
    retailPerUnit: 1200,
    badge: '🇬🇧 No VPN Required',
    deliveryTime: '5 Mins Full Email Access',
    serviceId: 'tiktok-uk-usa-acc'
  },
  {
    id: 'calc-elevenlabs',
    name: 'ElevenLabs 300k Credits (No Expiry)',
    unitLabel: '300k Credit Packs',
    minUnits: 1,
    maxUnits: 15,
    step: 1,
    defaultUnits: 2,
    wholesalePerUnit: 1500,
    retailPerUnit: 3800,
    badge: '🎙️ YouTube Automation',
    deliveryTime: '10 Mins Private Login',
    serviceId: 'elevenlabs-300k'
  },
  {
    id: 'calc-sim-cdr',
    name: 'Fresh 2026 SIM Owner / Call CDR Report',
    unitLabel: 'Verified Reports',
    minUnits: 1,
    maxUnits: 20,
    step: 1,
    defaultUnits: 2,
    wholesalePerUnit: 250,
    retailPerUnit: 800,
    badge: '📡 2026 Live Telecom',
    deliveryTime: '15 Mins Confidential PDF',
    serviceId: 'sim-owner-details'
  }
];

interface TrackedOrderData {
  orderId: string;
  clientName: string;
  city: string;
  serviceTitle: string;
  packageTier: string;
  paymentMethod: string;
  amount: string;
  statusStep: 1 | 2 | 3 | 4;
  statusLabel: string;
  serverNode: string;
  updatedAt: string;
  warrantyTag: string;
}

interface PanelToolsProps {
  siteConfig?: SiteSettingsConfig;
  onSelectServiceById: (id: string) => void;
  onQuickFilter: (category: CategoryId, keyword?: string) => void;
  onPlayPop: (freq?: number) => void;
  primaryWaNumber: string;
  servicesCatalog?: StoreService[];
}

export const MarqueeAndPulseBanner: React.FC<{
  siteConfig?: SiteSettingsConfig;
  onSelectServiceById: (id: string) => void;
  onQuickFilter: (category: CategoryId, keyword?: string) => void;
  onPlayPop: (freq?: number) => void;
  storeBarsConfig?: SiteStoreBarsConfig;
  siteLang?: 'en' | 'ur';
}> = ({ siteConfig, onSelectServiceById, onQuickFilter, onPlayPop, storeBarsConfig, siteLang = 'en' }) => {
  const brandOwner = siteConfig?.banner?.mainTitle?.trim() || 'Saqib Bhai';
  const brandAccent = siteConfig?.banner?.highlightTitle?.trim().replace(/^[—\-\s]+/, '') || 'Visuals';
  const fullBrand = `${brandOwner} ${siteConfig?.banner?.highlightTitle?.trim() || ''}`.trim();
  const bars = storeBarsConfig;
  return (
    <div className="space-y-3">
      {/* Live Server Uptime & Speed Telemetry Pulse Bar */}
      {bars?.showStatusPulseBar !== false && (
        <div className="acrylic-frame rounded-[26px] p-2 sm:p-2.5">
          <div className="plush-pillow plush-contact rounded-[20px] px-3.5 py-2.5 flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 server-pulse-dot"></span>
              <span className="font-display font-bold text-slate-900 uppercase tracking-wider text-[11px]">
                {siteLang === 'ur' ? 'ثاقب ویژولز لائیو سروس پینل:' : (bars?.statusPanelTitle ?? 'SOHAIB AGENCY LIVE PANEL STATUS:')}
              </span>
              {(bars?.statusPanelBadge ?? 'ALL 3 SERVERS 99.9% ONLINE') && (
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-extrabold text-[10px] border border-emerald-300">
                  {siteLang === 'ur' ? 'تمام 3 سرورز 99.9% آن لائن' : (bars?.statusPanelBadge ?? 'ALL 3 SERVERS 99.9% ONLINE')}
                </span>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-[11px] font-bold text-slate-700">
              {bars?.chip1Enabled !== false && (
                <span className="inline-flex items-center gap-1 bg-white/80 px-2.5 py-1 rounded-full border border-white shadow-sm">
                  <SiGooglegemini className="w-3.5 h-3.5 text-purple-600" />
                  <span>{siteLang === 'ur' ? 'اے آئی سرور:' : (bars?.chip1Label ?? 'AI Pro Server:')}</span>
                  <strong className="text-emerald-700">{siteLang === 'ur' ? '3 منٹ اوسط' : (bars?.chip1Value ?? '3 Min Avg')}</strong>
                </span>
              )}
              {bars?.chip2Enabled !== false && (
                <span className="inline-flex items-center gap-1 bg-white/80 px-2.5 py-1 rounded-full border border-white shadow-sm">
                  <SiTiktok className="w-3.5 h-3.5 text-rose-500" />
                  <span>{siteLang === 'ur' ? 'ایس ایم ایم سروس:' : (bars?.chip2Label ?? 'SMM Turbo API:')}</span>
                  <strong className="text-emerald-700">{siteLang === 'ur' ? 'فوری سٹارٹ' : (bars?.chip2Value ?? 'Instant Start')}</strong>
                </span>
              )}
              {bars?.chip3Enabled !== false && (
                <span className="inline-flex items-center gap-1 bg-white/80 px-2.5 py-1 rounded-full border border-white shadow-sm">
                  <FaSatelliteDish className="w-3.5 h-3.5 text-blue-600" />
                  <span>{siteLang === 'ur' ? 'سم اور نادرا ڈیسک:' : (bars?.chip3Label ?? '2026 SIM/NADRA Desk:')}</span>
                  <strong className="text-emerald-700">{siteLang === 'ur' ? '15 منٹ میں' : (bars?.chip3Value ?? '15 Min PDF')}</strong>
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Infinite 3D Brand & Tool Ecosystem Marquee */}
      {bars?.showMarquee !== false && (
        <div data-scroll="zoom" className="acrylic-frame rounded-[28px] p-2.5 overflow-hidden marquee-wrapper">
        <div className="space-y-2 overflow-hidden">
          {/* Row 1: Left-scrolling AI & Creator Pro Ecosystem */}
          <div className="marquee-track-left gap-2.5">
            {[...MARQUEE_ROW_1, ...MARQUEE_ROW_1].map((item, idx) => (
              <button
                key={`${item.id}-${idx}`}
                type="button"
                onMouseEnter={() => onPlayPop(600)}
                onClick={() => {
                  if (item.serviceId) {
                    onSelectServiceById(item.serviceId);
                  } else {
                    onQuickFilter(item.category);
                  }
                }}
                className="flex items-center gap-2.5 px-3.5 py-2 rounded-2xl bg-white/85 hover:bg-white border border-white shadow-sm hover:shadow-md transition transform hover:-translate-y-0.5 cursor-pointer flex-shrink-0"
              >
                <div
                  className={`w-8 h-8 rounded-xl bg-gradient-to-br ${item.color} text-white flex items-center justify-center shadow-sm flex-shrink-0`}
                >
                  {renderMarqueeIcon(item.id, 'w-4 h-4 text-white')}
                </div>
                <div className="text-left leading-tight">
                  <div className="text-xs font-extrabold text-slate-900 whitespace-nowrap">
                    {item.label}
                  </div>
                  <div className="text-[10px] font-bold text-pink-600 whitespace-nowrap">
                    {item.sub}
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Row 2: Right-scrolling SMM, Ad Agency, Franchise & Crypto Ecosystem */}
          <div className="marquee-track-right gap-2.5">
            {[...MARQUEE_ROW_2, ...MARQUEE_ROW_2].map((item, idx) => (
              <button
                key={`${item.id}-${idx}`}
                type="button"
                onMouseEnter={() => onPlayPop(540)}
                onClick={() => {
                  if (item.serviceId) {
                    onSelectServiceById(item.serviceId);
                  } else {
                    onQuickFilter(item.category);
                  }
                }}
                className="flex items-center gap-2.5 px-3.5 py-2 rounded-2xl bg-white/85 hover:bg-white border border-white shadow-sm hover:shadow-md transition transform hover:-translate-y-0.5 cursor-pointer flex-shrink-0"
              >
                <div
                  className={`w-8 h-8 rounded-xl bg-gradient-to-br ${item.color} text-white flex items-center justify-center shadow-sm flex-shrink-0`}
                >
                  {renderMarqueeIcon(item.id, 'w-4 h-4 text-white')}
                </div>
                <div className="text-left leading-tight">
                  <div className="text-xs font-extrabold text-slate-900 whitespace-nowrap">
                    {item.label}
                  </div>
                  <div className="text-[10px] font-bold text-indigo-600 whitespace-nowrap">
                    {item.sub}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    )}
  </div>
);
};

export const PanelToolsSection: React.FC<PanelToolsProps> = ({
  siteConfig,
  onSelectServiceById,
  onPlayPop,
  primaryWaNumber,
  servicesCatalog = []
}) => {
  const brandOwner = siteConfig?.banner?.mainTitle?.trim() || 'Saqib Bhai';
  const brandAccent = siteConfig?.banner?.highlightTitle?.trim().replace(/^[—\-\s]+/, '') || 'Visuals';
  const fullBrand = `${brandOwner} ${siteConfig?.banner?.highlightTitle?.trim() || ''}`.trim();
  // 1. State for Interactive SMM & AI Reseller Calculator
  const [selectedPresetId, setSelectedPresetId] = useState<string>(CALCULATOR_PRESETS[0].id);
  const [calcUnits, setCalcUnits] = useState<number>(CALCULATOR_PRESETS[0].defaultUnits);

  const activePreset =
    CALCULATOR_PRESETS.find((p) => p.id === selectedPresetId) || CALCULATOR_PRESETS[0];

  const handleSelectPreset = (preset: CalcPreset) => {
    onPlayPop(600);
    setSelectedPresetId(preset.id);
    setCalcUnits(preset.defaultUnits);
  };

  // Bulk discount: 5+ units get 5% extra off, 10+ units get 10% extra off
  const discountRate = calcUnits >= 10 ? 0.9 : calcUnits >= 5 ? 0.95 : 1;
  const totalWholesale = Math.round(activePreset.wholesalePerUnit * calcUnits * discountRate);
  const totalRetail = Math.round(activePreset.retailPerUnit * calcUnits);
  const netProfitOrSavings = Math.max(0, totalRetail - totalWholesale);
  const savingsPercent = Math.round((netProfitOrSavings / totalRetail) * 100);

  // 2. State for Live Order Status Tracker (Real Database Connected)
  const [orderInput, setOrderInput] = useState<string>('');
  const [trackedOrder, setTrackedOrder] = useState<TrackedOrderData | null>(null);
  const [isSearchingOrder, setIsSearchingOrder] = useState<boolean>(false);
  const [trackError, setTrackError] = useState<string | null>(null);

  const handleTrackOrder = async (e?: React.FormEvent, customCode?: string) => {
    if (e) e.preventDefault();
    onPlayPop(650);
    const raw = (customCode ?? orderInput).trim().replace(/^#/, '');
    if (!raw) return;

    setIsSearchingOrder(true);
    setTrackError(null);

    try {
      const res = await fetch(`/api/orders?orderId=${encodeURIComponent(raw)}`);
      const data = await res.json();

      if (data.success && Array.isArray(data.orders) && data.orders.length > 0) {
        const o = data.orders[0];
        let step: 1 | 2 | 3 | 4 = 1;
        let label = 'VERIFICATION & PAYMENT REVIEW';
        const st = String(o.status || '').toLowerCase();
        if (st === 'processing') {
          step = 2;
          label = 'PROCESSING ON SERVER CLUSTER';
        } else if (st === 'quality_check') {
          step = 3;
          label = 'QUALITY & WARRANTY VERIFICATION (90%)';
        } else if (st === 'completed') {
          step = 4;
          label = 'COMPLETED & DELIVERED ON WHATSAPP';
        } else if (st === 'rejected' || st === 'cancelled') {
          step = 1;
          label = 'ORDER CANCELLED / REJECTED (CONTACT SUPPORT)';
        }

        const dateStr = o.created_at
          ? new Date(o.created_at).toLocaleDateString('en-PK', {
              day: 'numeric',
              month: 'short',
              hour: '2-digit',
              minute: '2-digit'
            })
          : 'Just now';

        setTrackedOrder({
          orderId: `#${o.id}`,
          clientName: o.user_id ? `${o.user_id}` : 'Verified Client',
          city: 'Pakistan Verified Desk',
          serviceTitle: o.service_title || 'Digital Service Activation',
          packageTier: o.package_tier || 'Official Lifetime / Period Plan',
          paymentMethod: 'Verified Payment Gateway',
          amount: o.price ? `Rs. ${Number(o.price).toLocaleString()}` : 'Custom Deal',
          statusStep: step,
          statusLabel: label,
          serverNode: 'Saqib-Cloud-Node-01',
          updatedAt: dateStr,
          warrantyTag: 'Active Guarantee & Support'
        });
        setTrackError(null);
      } else {
        setTrackedOrder(null);
        setTrackError(
          `Database me Order #${raw} ka record nahi mila. Barah-e-karam apna sahi Order ID ya WhatsApp number darj karein ya WhatsApp support par rabta karein.`
        );
      }
    } catch {
      setTrackedOrder(null);
      setTrackError('Network request failed. Please check your connection and try again.');
    } finally {
      setIsSearchingOrder(false);
    }
  };

  // 3. Top Store Highlights (100% Real Database Products from servicesCatalog)
  const catalogList = (servicesCatalog && servicesCatalog.length > 0 ? servicesCatalog : [])
    .filter((s) => !s.hidden)
    .slice(0, 7);

  const [highlightedCatalogIndex, setHighlightedCatalogIndex] = useState<number>(0);
  const [isFeedPaused, setIsFeedPaused] = useState<boolean>(false);

  useEffect(() => {
    if (isFeedPaused || catalogList.length === 0) return;
    const timer = setInterval(() => {
      setHighlightedCatalogIndex((prev) => (prev + 1) % catalogList.length);
    }, 3500);
    return () => clearInterval(timer);
  }, [isFeedPaused, catalogList.length]);

  const activeHighlightService = catalogList[highlightedCatalogIndex] || catalogList[0];

  return (
    <div className="space-y-7 pt-2">
      {/* ==================== INTERACTIVE SMM & AI PRICE + RESELLER PROFIT CALCULATOR ==================== */}
      <section data-scroll="up" className="acrylic-frame rounded-[34px] p-3 sm:p-5">
        <div className="plush-pillow plush-login rounded-[26px] p-4 sm:p-6 space-y-5">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-pink-200/80 pb-4 text-center md:text-left">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-white/90 border border-pink-200 text-[10px] font-extrabold text-pink-600 shadow-sm">
                <i className="fa-solid fa-calculator text-purple-600"></i> INTERACTIVE SMM PANEL &amp; RESELLER TOOL
              </div>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
                Live Price, Bulk Discount &amp; Reseller Profit Calculator 🧮
              </h2>
              <p className="text-xs sm:text-sm font-semibold text-slate-700">
                Calculate your exact wholesale price, bulk discount (5%–10% extra off), and reseller profit margin in real time!
              </p>
            </div>
            <div className="self-center md:self-auto px-3.5 py-2 rounded-2xl bg-white/85 border border-white shadow-sm text-center">
              <div className="text-[10px] font-extrabold uppercase text-purple-700">Reseller Bonus</div>
              <div className="text-xs font-extrabold text-slate-900">Up to 10% Extra Bulk Discount</div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
            {/* Left (7 Cols): Service Selector & Interactive Quantity Slider */}
            <div data-scroll="left" className="lg:col-span-7 bg-white/75 rounded-[24px] p-4 sm:p-5 border border-white shadow-sm flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700">
                  1. Select Service or Reseller Package:
                </label>
                <div className="grid grid-cols-2 gap-1.5 sm:gap-2">
                  {CALCULATOR_PRESETS.map((preset) => {
                    const isSelected = preset.id === activePreset.id;
                    return (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => handleSelectPreset(preset)}
                        className={`p-2 sm:p-2.5 rounded-2xl border text-left transition cursor-pointer flex items-center justify-between gap-1.5 sm:gap-2 ${
                          isSelected
                            ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white border-pink-400 shadow-md scale-[1.01]'
                            : 'bg-white/90 hover:bg-pink-50/70 text-slate-800 border-pink-100'
                        }`}
                      >
                        <div className="min-w-0">
                          <div className="text-[11px] sm:text-xs font-extrabold truncate">{preset.name}</div>
                          <div
                            className={`text-[9px] sm:text-[10px] font-bold ${
                              isSelected ? 'text-pink-100' : 'text-pink-600'
                            }`}
                          >
                            Rs. {preset.wholesalePerUnit.toLocaleString()} / unit
                          </div>
                        </div>
                        <i
                          className={`fa-solid ${
                            isSelected ? 'fa-circle-check text-white' : 'fa-chevron-right text-slate-400'
                          } text-[10px] sm:text-xs flex-shrink-0`}
                        ></i>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Quantity / Units Slider */}
              <div className="space-y-2.5 pt-2 border-t border-pink-100">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-extrabold uppercase tracking-wider text-slate-700">
                    2. Adjust Quantity ({activePreset.unitLabel}):
                  </label>
                  <span className="px-3 py-1 rounded-full bg-purple-600 text-white font-display font-bold text-xs shadow">
                    {calcUnits} {activePreset.unitLabel}
                  </span>
                </div>

                <input
                  type="range"
                  min={activePreset.minUnits}
                  max={activePreset.maxUnits}
                  step={activePreset.step}
                  value={calcUnits}
                  onChange={(e) => setCalcUnits(Number(e.target.value))}
                  className="w-full h-2.5 bg-pink-200 rounded-lg appearance-none cursor-pointer accent-pink-600"
                />

                {/* Quick Quantity Multiplier Chips */}
                <div className="flex flex-wrap items-center justify-between gap-1.5 pt-1">
                  <span className="text-[10px] font-extrabold text-slate-600 uppercase">
                    Quick Quantity:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {[1, 3, 5, 10, 15, 20]
                      .filter((n) => n <= activePreset.maxUnits)
                      .map((qty) => (
                        <button
                          key={qty}
                          type="button"
                          onClick={() => {
                            onPlayPop(600);
                            setCalcUnits(qty);
                          }}
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold transition cursor-pointer ${
                            calcUnits === qty
                              ? 'bg-pink-600 text-white shadow-sm'
                              : 'bg-white hover:bg-pink-100 text-slate-700 border border-pink-200'
                          }`}
                        >
                          {qty} {activePreset.unitLabel.includes('Account') ? 'Acc' : qty >= 1000 ? `${qty / 1000}k` : 'Units'}
                        </button>
                      ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Right (5 Cols): Live Price, Profit Summary & 1-Click WhatsApp Deal Lock */}
            <div data-scroll="right" className="lg:col-span-5 bg-gradient-to-br from-slate-900 via-indigo-950 to-purple-950 rounded-[24px] p-4 sm:p-5 text-white shadow-md flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-pink-300">
                    Live Wholesale Quote
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[10px] font-extrabold">
                    {savingsPercent}% Margin
                  </span>
                </div>

                {/* Big Total Wholesale Price */}
                <div>
                  <div className="text-[11px] font-bold text-slate-300">Total Reseller Wholesale:</div>
                  <div className="font-display font-extrabold text-2xl sm:text-3xl text-emerald-400 mt-0.5">
                    Rs. {totalWholesale.toLocaleString()}
                  </div>
                  {calcUnits >= 5 && (
                    <div className="text-[10px] font-bold text-amber-300 mt-0.5">
                      🎉 Bulk Discount Applied ({calcUnits >= 10 ? '10%' : '5%'} Extra Off Wholesale)
                    </div>
                  )}
                </div>

                {/* Breakdown Boxes */}
                <div className="grid grid-cols-2 gap-2.5 pt-2">
                  <div className="bg-white/10 rounded-2xl p-3 border border-white/15">
                    <div className="text-[10px] font-bold text-slate-300 uppercase">
                      Market Retail Value
                    </div>
                    <div className="font-display font-bold text-base text-white mt-0.5">
                      Rs. {totalRetail.toLocaleString()}
                    </div>
                  </div>
                  <div className="bg-emerald-500/20 rounded-2xl p-3 border border-emerald-400/40">
                    <div className="text-[10px] font-extrabold text-emerald-300 uppercase">
                      Your Reseller Profit
                    </div>
                    <div className="font-display font-bold text-base text-emerald-300 mt-0.5">
                      +Rs. {netProfitOrSavings.toLocaleString()}
                    </div>
                  </div>
                </div>

                <div className="text-[11px] font-semibold text-slate-300 flex items-center justify-between pt-1">
                  <span>
                    <i className="fa-solid fa-bolt text-amber-300 mr-1"></i>
                    Delivery: <strong>{activePreset.deliveryTime}</strong>
                  </span>
                  <span>Full Warranty ✓</span>
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-white/15">
                <a
                  href={`https://wa.me/${primaryWaNumber}?text=${encodeURIComponent(
                    `Assalam-o-Alaikum ${brandOwner}! 🧮 *CALCULATOR DEAL ORDER*\n\n📦 *Service:* ${activePreset.name}\n🔢 *Quantity:* ${calcUnits} (${activePreset.unitLabel})\n💰 *Calculated Wholesale Total:* Rs. ${totalWholesale.toLocaleString()}\n\nPlease share EasyPaisa / JazzCash details for instant activation!`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-display font-bold text-xs sm:text-sm tracking-wider shadow-lg flex items-center justify-center gap-2 transition hover:scale-[1.02]"
                >
                  <i className="fa-brands fa-whatsapp text-base"></i>
                  <span>LOCK THIS DEAL ON WHATSAPP (Rs. {totalWholesale.toLocaleString()})</span>
                </a>
                <button
                  type="button"
                  onClick={() => onSelectServiceById(activePreset.serviceId)}
                  className="w-full py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-extrabold text-[11px] transition cursor-pointer"
                >
                  Or Open Standard Store Checkout Modal →
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== LIVE ORDER TRACKER + VERIFIED CATALOG HIGHLIGHTS ==================== */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* Left (7 Cols): Real-Time Database Order Status Tracker */}
        <div data-scroll="left" className="lg:col-span-7 acrylic-frame rounded-[34px] p-3 sm:p-4 flex flex-col justify-between">
          <div className="plush-pillow plush-about rounded-[26px] p-4 sm:p-6 h-full flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-white/90 border border-indigo-200 text-[10px] font-extrabold text-indigo-700 shadow-sm">
                  <i className="fa-solid fa-satellite-dish text-pink-600"></i> LIVE DATABASE ORDER TRACKER
                </div>
                <span className="text-[11px] font-mono-code font-bold text-emerald-700">
                  ● Real-Time Supabase Telemetry
                </span>
              </div>

              <h3 className="text-lg sm:text-2xl font-extrabold text-slate-900">
                Track Your Order Status Live 📦
              </h3>
              <p className="text-xs font-semibold text-slate-700">
                Enter your Order ID (e.g. <code className="font-mono-code text-pink-600">ORD-XXXX</code>) or registered phone number to view real-time delivery status directly from our database.
              </p>

              {/* Search Form */}
              <form onSubmit={(e) => handleTrackOrder(e)} className="flex flex-col sm:flex-row gap-2">
                <div className="relative flex-1">
                  <i className="fa-solid fa-hashtag absolute left-3.5 top-1/2 -translate-y-1/2 text-pink-500 text-xs"></i>
                  <input
                    type="text"
                    value={orderInput}
                    onChange={(e) => setOrderInput(e.target.value)}
                    placeholder="Enter Order ID (e.g. ORD-...) or phone number"
                    className="w-full pl-9 pr-3 py-2.5 rounded-2xl bg-white/95 border-2 border-pink-200 font-mono-code font-bold text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-pink-500"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSearchingOrder || !orderInput.trim()}
                  className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 disabled:opacity-50 text-white font-extrabold text-xs shadow-md hover:scale-105 transition cursor-pointer whitespace-nowrap"
                >
                  {isSearchingOrder ? (
                    <span><i className="fa-solid fa-spinner fa-spin mr-1"></i>Checking...</span>
                  ) : (
                    <span><i className="fa-solid fa-magnifying-glass mr-1.5"></i>Track Order</span>
                  )}
                </button>
              </form>

              {/* Notice */}
              <div className="flex items-center gap-1.5 text-[11px] text-slate-600">
                <i className="fa-solid fa-circle-check text-emerald-600 text-xs"></i>
                <span>Direct Supabase connection • Instant lookup for all verified customer orders</span>
              </div>
            </div>

            {/* Error State */}
            {trackError && (
              <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 text-xs space-y-2">
                <div className="flex items-center gap-2 font-bold">
                  <i className="fa-solid fa-triangle-exclamation text-rose-600"></i>
                  <span>Record Not Found</span>
                </div>
                <p>{trackError}</p>
                <a
                  href={`https://wa.me/${primaryWaNumber}?text=${encodeURIComponent(
                    `Assalam-o-Alaikum ${brandOwner}! I am checking status for Order: ${orderInput}. Please check manually.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-extrabold text-emerald-700 hover:underline"
                >
                  <i className="fa-brands fa-whatsapp text-sm"></i> WhatsApp Support par Puchhein →
                </a>
              </div>
            )}

            {/* Tracked Order Telemetry Card (When Found) */}
            {trackedOrder && (
              <div className="bg-white/90 rounded-[22px] p-4 border border-white shadow-sm space-y-3.5">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-pink-100 pb-2.5">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono-code font-extrabold text-sm text-indigo-700">
                        {trackedOrder.orderId}
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-extrabold">
                        {trackedOrder.paymentMethod}
                      </span>
                    </div>
                    <div className="text-xs font-extrabold text-slate-900 mt-0.5">
                      {trackedOrder.serviceTitle}
                    </div>
                    <div className="text-[10px] font-semibold text-slate-600">
                      Tier: {trackedOrder.packageTier}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-display font-bold text-sm text-pink-600">
                      {trackedOrder.amount}
                    </div>
                    <div className="text-[10px] font-bold text-slate-500">
                      {trackedOrder.updatedAt}
                    </div>
                  </div>
                </div>

                {/* 4-Stage Visual Progress Pipeline */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[10px] font-extrabold uppercase tracking-wider text-emerald-700">
                    <span>{trackedOrder.statusLabel}</span>
                    <span>{trackedOrder.statusStep * 25}%</span>
                  </div>

                  <div className="grid grid-cols-4 gap-1.5">
                    {[
                      { step: 1, label: '1. Verified' },
                      { step: 2, label: '2. Server Node' },
                      { step: 3, label: '3. Quality' },
                      { step: 4, label: '4. Delivered' }
                    ].map((s) => {
                      const active = trackedOrder.statusStep >= s.step;
                      return (
                        <div key={s.step} className="space-y-1 text-center">
                          <div
                            className={`h-2 rounded-full transition-all duration-500 ${
                              active
                                ? 'bg-gradient-to-r from-emerald-500 to-teal-500 shadow-sm'
                                : 'bg-slate-200'
                            }`}
                          ></div>
                          <div
                            className={`text-[10px] font-extrabold ${
                              active ? 'text-slate-900' : 'text-slate-400'
                            }`}
                          >
                            {s.label}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="pt-2 border-t border-pink-100 flex flex-wrap items-center justify-between gap-2 text-[11px]">
                  <span className="font-bold text-slate-600">
                    <i className="fa-solid fa-shield-halved text-emerald-600 mr-1"></i>
                    Status: <strong className="text-slate-900">{trackedOrder.warrantyTag}</strong>
                  </span>
                  <a
                    href={`https://wa.me/${primaryWaNumber}?text=${encodeURIComponent(
                      `Assalam-o-Alaikum ${brandOwner}! Please share priority status update for my Order ID: ${trackedOrder.orderId} (${trackedOrder.serviceTitle}).`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-emerald-700 hover:underline font-extrabold flex items-center gap-1"
                  >
                    <i className="fa-brands fa-whatsapp"></i> Ping WhatsApp Support →
                  </a>
                </div>
              </div>
            )}

            {/* Empty State (When no order searched yet) */}
            {!trackedOrder && !trackError && (
              <div className="bg-white/80 rounded-[22px] p-5 border border-pink-100 text-center space-y-2">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto text-xl shadow-sm">
                  <i className="fa-solid fa-satellite-dish"></i>
                </div>
                <div className="text-sm font-extrabold text-slate-900">Live Database Order Telemetry</div>
                <p className="text-xs text-slate-600 max-w-sm mx-auto">
                  Have you placed an order? Enter your Order ID (generated at checkout) or your WhatsApp number to view real-time server dispatch progress and delivery steps directly from the database.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right (5 Cols): Real Store Packages & Verified Service Deals (From Database Catalog) */}
        <div data-scroll="right" className="lg:col-span-5 acrylic-frame rounded-[34px] p-3 sm:p-4 flex flex-col justify-between">
          <div
            onMouseEnter={() => setIsFeedPaused(true)}
            onMouseLeave={() => setIsFeedPaused(false)}
            className="plush-pillow plush-faq rounded-[26px] p-4 sm:p-6 h-full flex flex-col justify-between space-y-4"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100 border border-emerald-300 text-[10px] font-extrabold text-emerald-800">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                  <span>ACTIVE CATALOG PACKAGES</span>
                </div>
                <span className="text-[10px] font-bold text-slate-600">
                  {isFeedPaused ? '⏸ Paused' : '⚡ Auto-Rotating'}
                </span>
              </div>

              <h3 className="text-lg sm:text-xl font-extrabold text-slate-900">
                Official Deals &amp; Featured Digital Packages 🇵🇰
              </h3>

              {/* Spotlight Live Pop Banner */}
              {activeHighlightService && (
                <div className="p-3 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-purple-900 text-white shadow-md border border-white transition-all duration-300">
                  <div className="flex items-center justify-between text-[10px] text-pink-300 font-extrabold uppercase">
                    <span>⚡ FEATURED PACKAGE</span>
                    <span className="text-emerald-300">{activeHighlightService.badge || 'VERIFIED DEAL'}</span>
                  </div>
                  <div className="text-xs sm:text-sm font-extrabold text-white mt-1 truncate">
                    {activeHighlightService.title}
                  </div>
                  <div className="flex items-center justify-between mt-1.5 text-[11px]">
                    <span className="text-slate-300 truncate max-w-[200px]">
                      {activeHighlightService.tiers && activeHighlightService.tiers[0]
                        ? activeHighlightService.tiers[0]
                        : 'Official Activation'}
                    </span>
                    <button
                      type="button"
                      onClick={() => onSelectServiceById(activeHighlightService.id)}
                      className="px-2.5 py-0.5 rounded-full bg-white text-slate-900 font-extrabold text-[10px] hover:bg-pink-100 transition cursor-pointer flex-shrink-0"
                    >
                      View / Order →
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Scrollable List of Verified Active Packages from Catalog */}
            <div className="space-y-2 max-h-[235px] overflow-y-auto pr-1">
              {catalogList.map((srv, idx) => {
                const firstTier = (srv.tiers && srv.tiers[0]) || '';
                const priceMatch = firstTier.match(/Rs\.?\s*([\d,]+)/i);
                const displayPrice = priceMatch ? priceMatch[0] : (srv.badge || 'Official');

                return (
                  <div
                    key={srv.id}
                    onClick={() => onSelectServiceById(srv.id)}
                    className={`p-2.5 rounded-2xl border transition cursor-pointer flex items-center justify-between gap-2 ${
                      idx === highlightedCatalogIndex
                        ? 'bg-white border-pink-400 shadow-md scale-[1.01]'
                        : 'bg-white/75 hover:bg-white border-white shadow-sm'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 text-white font-extrabold text-xs flex items-center justify-center flex-shrink-0 shadow-sm">
                        <i className="fa-solid fa-cube text-xs"></i>
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-extrabold text-slate-900 truncate">
                          {srv.title}
                        </div>
                        <div className="text-[10px] font-bold text-slate-600 truncate">
                          {srv.category ? srv.category.toUpperCase().replace('_', ' ') : 'VERIFIED'} • <span className="text-emerald-700">Instant Dispatch</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="font-display font-bold text-xs text-pink-600">{displayPrice}</div>
                      <div className="text-[9px] font-bold text-slate-500">In Stock ✓</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
