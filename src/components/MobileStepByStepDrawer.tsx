'use client';

import React, { useEffect } from 'react';
import {
  FaXmark,
  FaFire,
  FaScrewdriverWrench,
  FaWallet,
  FaUserAstronaut,
  FaCircleQuestion,
  FaHeadset,
  FaArrowRight,
  FaCheck,
  FaChevronRight,
  FaCirclePlus,
  FaBagShopping,
  FaGlobe,
  FaPalette,
  FaVolumeHigh,
  FaVolumeXmark,
  FaShieldHalved
} from 'react-icons/fa6';
import { SiWhatsapp } from 'react-icons/si';
import { StoreCategoryMeta, CategoryId } from '../data/defaultCatalog';
import { WebsiteUiThemeMode, STORE_THEMES_CATALOG } from './AstroNeumorphicDeck';

export type DrawerTabId = 'store' | 'siminfo' | 'about' | 'faqs' | 'contact' | 'login' | 'saqibadmb';

interface MobileStepByStepDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: DrawerTabId;
  onSwitchTab: (tab: DrawerTabId) => void;
  servicesCount: number;
  toolsCount: number;
  walletBalance: number;
  currencyPrefix?: string;
  onOpenAddFunds: () => void;
  onOpenCart: () => void;
  cartCount: number;
  categories: StoreCategoryMeta[];
  currentCategory: CategoryId;
  onFilterCategory: (cat: CategoryId) => void;
  siteLang: 'en' | 'ur';
  onToggleLang: () => void;
  websiteUiMode: WebsiteUiThemeMode;
  onSelectTheme: (theme: WebsiteUiThemeMode) => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  vipUser?: any;
  primaryWaNumber: string;
  portraitUrl?: string;
  brandOwnerName?: string;
  brandAccentName?: string;
}

export const MobileStepByStepDrawer: React.FC<MobileStepByStepDrawerProps> = ({
  isOpen,
  onClose,
  activeTab,
  onSwitchTab,
  servicesCount,
  toolsCount,
  walletBalance,
  currencyPrefix = 'Rs.',
  onOpenAddFunds,
  onOpenCart,
  cartCount,
  categories,
  currentCategory,
  onFilterCategory,
  siteLang,
  onToggleLang,
  websiteUiMode,
  onSelectTheme,
  soundEnabled,
  onToggleSound,
  vipUser,
  primaryWaNumber,
  portraitUrl = 'https://ik.imagekit.io/mrsaqib/mrsaqib242-img25_7oG52NZUY.png',
  brandOwnerName,
  brandAccentName
}) => {
  // Lock body scroll when mobile drawer is open to prevent page jumping
  useEffect(() => {
    if (typeof document === 'undefined') return;
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.touchAction = 'none';
    } else {
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleNavClick = (tab: DrawerTabId) => {
    onSwitchTab(tab);
    onClose();
  };

  const navSteps = [
    {
      step: '01',
      id: 'store' as DrawerTabId,
      title: siteLang === 'ur' ? 'ڈیجیٹل پرو سروسز' : 'All Digital Store Services',
      sub: siteLang === 'ur' ? `${servicesCount} سروسز • کیپ کٹ، اے آئی، ایس ایم ایم` : `${servicesCount} Services • CapCut, Lovable, Gemini, Ads`,
      icon: FaFire,
      color: 'from-pink-500 to-rose-600',
      badge: `${servicesCount} Active`,
      badgeColor: 'bg-rose-100 text-rose-700 border-rose-300'
    },
    {
      step: '02',
      id: 'siminfo' as DrawerTabId,
      title: siteLang === 'ur' ? 'لائیو ویب ٹولز حب' : 'Live Web Tools Hub',
      sub: siteLang === 'ur' ? `${toolsCount} ٹولز • سم ٹریکر، نادرا، آئی ایم ای آئی` : `${toolsCount} Tools • SIM Tracker, NADRA, IMEI`,
      icon: FaScrewdriverWrench,
      color: 'from-emerald-500 to-teal-600',
      badge: `${toolsCount} Tools`,
      badgeColor: 'bg-emerald-100 text-emerald-700 border-emerald-300'
    },
    {
      step: '03',
      id: 'login' as DrawerTabId,
      title: vipUser
        ? (siteLang === 'ur' ? 'وی آئی پی والٹ ڈیش بورڈ' : 'VIP Wallet Dashboard')
        : (siteLang === 'ur' ? 'والٹ بیلنس اور لاگ ان' : 'Wallet Balance & Login'),
      sub: siteLang === 'ur' ? `بیلنس: ${currencyPrefix} ${walletBalance.toLocaleString()} • ایزی پیسہ، جاز کیش` : `Balance: ${currencyPrefix} ${walletBalance.toLocaleString()} • EasyPaisa, JazzCash`,
      icon: FaWallet,
      color: 'from-amber-500 to-orange-600',
      badge: `${currencyPrefix} ${walletBalance >= 1000 ? `${(walletBalance / 1000).toFixed(1)}k` : walletBalance}`,
      badgeColor: 'bg-amber-100 text-amber-800 border-amber-300'
    },
    {
      step: '04',
      id: 'about' as DrawerTabId,
      title: siteLang === 'ur' ? `${brandOwnerName || 'صہیب'} کے بارے میں` : `About ${brandOwnerName || 'Sohaib'}`,
      sub: siteLang === 'ur' ? 'سرٹیفائیڈ ڈیجیٹل ایجنسی اور کریڈینشلز' : 'Certified Digital Agency, Founder & Verification',
      icon: FaUserAstronaut,
      color: 'from-indigo-500 to-purple-600',
      badge: 'Verified',
      badgeColor: 'bg-indigo-100 text-indigo-700 border-indigo-300'
    },
    {
      step: '05',
      id: 'faqs' as DrawerTabId,
      title: siteLang === 'ur' ? 'سوالات اور گائیڈ' : 'FAQs & Help Knowledgebase',
      sub: siteLang === 'ur' ? 'فوری رہنمائی، ترسیل کا طریقہ اور گارنٹی' : 'Instant answers, warranty policies & delivery guides',
      icon: FaCircleQuestion,
      color: 'from-sky-500 to-blue-600',
      badge: 'Help Desk',
      badgeColor: 'bg-sky-100 text-sky-700 border-sky-300'
    },
    {
      step: '06',
      id: 'contact' as DrawerTabId,
      title: siteLang === 'ur' ? '24/7 واٹس ایپ سپورٹ' : '24/7 WhatsApp Customer Support',
      sub: siteLang === 'ur' ? `${brandOwnerName || 'ثاقب بھائی'} سے براہِ راست رابطہ کریں` : `Live WhatsApp chat with ${brandOwnerName || 'Saqib'} for fast orders`,
      icon: SiWhatsapp,
      color: 'from-green-500 to-emerald-600',
      badge: 'Replies in ~2m',
      badgeColor: 'bg-green-100 text-green-700 border-green-300'
    }
  ];

  return (
    <div className="fixed inset-0 z-[9999] md:hidden flex">
      {/* 1. Dark Backdrop Overlay with Smooth Fade */}
      <div
        className="fixed inset-0 bg-slate-950/75 backdrop-blur-xs transition-opacity duration-300 cursor-pointer"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* 2. Slide-In Vertical Step-by-Step Drawer Container */}
      <div className="relative w-[86%] max-w-[350px] h-full bg-white text-slate-900 shadow-2xl flex flex-col z-10 overflow-hidden border-r border-slate-200 animate-drawer-slide-left">
        {/* Drawer Header with Saqib Portrait & Online Status */}
        <div className="p-4 bg-gradient-to-br from-slate-900 via-indigo-950 to-purple-950 text-white flex-shrink-0 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-pink-500/10 rounded-full blur-2xl pointer-events-none" />

          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center gap-3">
              <div className="relative">
                <img
                  src={portraitUrl}
                  alt="Muhammad Saqib"
                  className="w-12 h-12 rounded-full object-cover border-2 border-white/80 shadow-md"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src =
                      'https://ik.imagekit.io/mrsaqib/mrsaqib242-img25_7oG52NZUY.png';
                  }}
                />
                <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-slate-900" />
              </div>
              <div className="leading-tight">
                <div className="flex items-center gap-1.5">
                  <h3 className="text-sm font-extrabold text-white truncate max-w-[130px]">{brandOwnerName || 'Sohaib'}</h3>
                  <span className="px-1.5 py-0.2 rounded-full bg-emerald-500/25 border border-emerald-400 text-emerald-300 text-[8.5px] font-bold">
                    ONLINE
                  </span>
                </div>
                <p className="text-[10px] text-pink-300 font-medium truncate max-w-[150px]">{brandAccentName ? `${brandAccentName} Hub Official` : 'Sohaib Agency Hub Official'}</p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-sm transition cursor-pointer border border-white/20 active:scale-90"
              aria-label="Close Mobile Menu"
            >
              <FaXmark />
            </button>
          </div>

          {/* Quick Wallet Bar inside Drawer Header */}
          <div className="mt-3.5 p-2.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 flex items-center justify-between">
            <div>
              <div className="text-[9px] font-extrabold uppercase tracking-wider text-emerald-300">
                {siteLang === 'ur' ? 'والٹ بیلنس:' : 'WALLET BALANCE:'}
              </div>
              <div className="text-sm font-bold text-white font-display">
                {currencyPrefix} {walletBalance.toLocaleString()}
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenAddFunds();
                }}
                className="px-2.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-[10.5px] font-extrabold shadow flex items-center gap-1 cursor-pointer active:scale-95"
              >
                <FaCirclePlus className="text-xs" />
                <span>+ Add</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenCart();
                }}
                className="px-2.5 py-1.5 rounded-xl bg-white/15 text-white text-[10.5px] font-extrabold border border-white/20 flex items-center gap-1 cursor-pointer active:scale-95"
              >
                <FaBagShopping className="text-xs" />
                <span>({cartCount})</span>
              </button>
            </div>
          </div>
        </div>

        {/* Scrollable Step-by-Step Vertical Menu Body */}
        <div className="flex-1 overflow-y-auto overscroll-contain p-3.5 space-y-4">
          {/* STEP-BY-STEP VERTICAL MENU LIST */}
          <div>
            <div className="text-[10px] font-black uppercase tracking-wider text-slate-600 mb-2 px-1 flex items-center justify-between">
              <span>{siteLang === 'ur' ? '📌 مرحلہ وار مینو' : '📌 Step-by-Step Navigation'}</span>
              <span className="text-[9px] text-pink-700 font-extrabold">Instant Jump</span>
            </div>

            <div className="space-y-1.5">
              {navSteps.map((step) => {
                const isActive = activeTab === step.id;
                const IconComponent = step.icon;

                return (
                  <button
                    key={`step-nav-${step.id}`}
                    type="button"
                    onClick={() => handleNavClick(step.id)}
                    className={`w-full text-left p-2.5 rounded-2xl transition-all duration-150 flex items-center justify-between gap-2.5 cursor-pointer border ${
                      isActive
                        ? 'bg-slate-900 text-white border-slate-900 shadow-md'
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-900 border-slate-200/90 active:scale-[0.99]'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      {/* Step Number & Colorful Rounded Icon */}
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm text-white bg-gradient-to-br ${step.color}`}
                      >
                        <IconComponent className="text-sm" />
                      </div>

                      <div className="min-w-0 leading-tight">
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`text-[9px] font-mono font-black ${
                              isActive ? 'text-pink-300' : 'text-slate-600'
                            }`}
                          >
                            #{step.step}
                          </span>
                          <span className="text-xs font-bold truncate">
                            {step.title}
                          </span>
                        </div>
                        <p
                          className={`text-[10px] font-medium truncate mt-0.5 ${
                            isActive ? 'text-slate-300' : 'text-slate-600'
                          }`}
                        >
                          {step.sub}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <span
                        className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full border ${
                          isActive
                            ? 'bg-white/20 text-white border-white/30'
                            : step.badgeColor
                        }`}
                      >
                        {step.badge}
                      </span>
                      <FaChevronRight
                        className={`text-[10px] ${
                          isActive ? 'text-pink-400' : 'text-slate-400'
                        }`}
                      />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* STORE CATEGORIES FAST SHORTCUTS */}
          <div className="pt-2 border-t border-slate-200">
            <div className="text-[10px] font-black uppercase tracking-wider text-slate-600 mb-2 px-1">
              {siteLang === 'ur' ? '🏷️ کیٹیگری فلٹرز' : '🏷️ Store Categories'}
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              {categories.map((cat) => {
                const isCatActive = activeTab === 'store' && currentCategory === cat.id;
                return (
                  <button
                    key={`mob-drawer-cat-${cat.id}`}
                    type="button"
                    onClick={() => {
                      onFilterCategory(cat.id);
                      onClose();
                    }}
                    className={`p-2 rounded-xl text-[11px] font-bold text-left transition cursor-pointer border flex items-center gap-2 truncate ${
                      isCatActive
                        ? 'bg-pink-600 text-white border-pink-600 shadow-xs'
                        : 'bg-white text-slate-800 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <span className="w-2 h-2 rounded-full bg-pink-500 flex-shrink-0" />
                    <span className="truncate">{cat.shortLabel}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* QUICK THEME SWITCHER */}
          <div className="pt-2 border-t border-slate-200">
            <div className="text-[10px] font-black uppercase tracking-wider text-slate-600 mb-2 px-1 flex items-center justify-between">
              <span>{siteLang === 'ur' ? '🎨 ویب سائٹ تھیمز' : '🎨 Website Theme'}</span>
              <span className="text-[9px] font-extrabold text-pink-700 uppercase">
                {websiteUiMode}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-1.5">
              {STORE_THEMES_CATALOG.map((theme) => {
                const isThemeActive = websiteUiMode === theme.id;
                return (
                  <button
                    key={`mob-drawer-theme-${theme.id}`}
                    type="button"
                    onClick={() => onSelectTheme(theme.id)}
                    className={`p-1.5 rounded-xl text-center text-[10px] font-bold transition cursor-pointer border flex flex-col items-center justify-center gap-0.5 ${
                      isThemeActive
                        ? 'bg-slate-900 text-white border-pink-500 shadow-sm'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <i className={`${theme.icon} ${isThemeActive ? 'text-pink-400' : 'text-slate-600'} text-xs`} />
                    <span className="truncate w-full">{theme.shortLabel}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Drawer Bottom Controls: Language Toggle + Sound Toggle */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 flex-shrink-0 flex items-center justify-between gap-2">
          {/* Language Switcher */}
          <button
            type="button"
            onClick={onToggleLang}
            className="flex-1 py-2 px-3 rounded-xl bg-white border border-slate-200 shadow-2xs font-extrabold text-xs text-slate-900 flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
          >
            <span className="text-sm">{siteLang === 'en' ? '🇵🇰' : '🇬🇧'}</span>
            <span>{siteLang === 'en' ? 'اردو زبان' : 'English Mode'}</span>
          </button>

          {/* UI Sound Toggle */}
          <button
            type="button"
            onClick={onToggleSound}
            className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center gap-1.5 cursor-pointer active:scale-95 ${
              soundEnabled
                ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                : 'bg-white text-slate-600 border-slate-200'
            }`}
            title="Toggle UI Audio Sounds"
          >
            {soundEnabled ? (
              <>
                <FaVolumeHigh className="text-emerald-600 text-xs" />
                <span className="text-[11px] font-bold">Sound ON</span>
              </>
            ) : (
              <>
                <FaVolumeXmark className="text-slate-400 text-xs" />
                <span className="text-[11px] font-bold">Sound OFF</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
