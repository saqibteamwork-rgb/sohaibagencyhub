'use client';
import { uploadImageToImageKit } from '../lib/clientImageUpload';
import { ImageKitUploadField } from './ImageKitUploadField';

import React, { useState } from 'react';
import {
  FaBullhorn,
  FaBolt,
  FaCheck,
  FaArrowLeft,
  FaImage,
  FaClock,
  FaGift,
  FaRotateLeft,
  FaEye,
  FaToggleOn,
  FaToggleOff,
  FaPenToSquare,
  FaWandMagicSparkles,
  FaRegCopy
} from 'react-icons/fa6';
import { SiWhatsapp } from 'react-icons/si';
import {
  SiteSettingsConfig,
  SitePromoPopupConfig,
  DEFAULT_PROMO_POPUP_CONFIG,
} from '../types/siteConfig';

interface Props {
  siteConfig: SiteSettingsConfig;
  onUpdateSiteConfig: (updater: (prev: SiteSettingsConfig) => SiteSettingsConfig) => void;
  playPopSound: (freq?: number) => void;
  showToast: (msg: string) => void;
  copyText: (text: string, msg?: string) => void;
  onReturnHome: () => void;
}

export const AdminPromoPopupStudio: React.FC<Props> = ({
  siteConfig,
  onUpdateSiteConfig,
  playPopSound,
  showToast,
  copyText,
  onReturnHome,
}) => {
  const popupConfig: SitePromoPopupConfig = siteConfig.promoPopup || DEFAULT_PROMO_POPUP_CONFIG;

  const [form, setForm] = useState<SitePromoPopupConfig>({
    ...DEFAULT_PROMO_POPUP_CONFIG,
    ...(siteConfig.promoPopup || {}),
  });

  const [isSaving, setIsSaving] = useState<boolean>(false);

  // Template Presets
  const applyPreset = (preset: '20off' | 'welcome' | 'notice' | 'vip') => {
    if (playPopSound) playPopSound(650);

    if (preset === '20off') {
      setForm((prev) => ({
        ...prev,
        enabled: true,
        popupType: 'discount',
        badgeText: '🔥 SPECIAL 20% DISCOUNT',
        title: 'Limited Time Flash Offer — Save 20% Today!',
        description:
          'Order any AI Pro Tool, CapCut Pro, or TikTok Agency Account right now and enjoy an instant 20% discount on your first order. WhatsApp Saqib directly!',
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
      }));
      showToast('⚡ Applied "20% Off Flash Sale" Template!');
    } else if (preset === 'welcome') {
      setForm((prev) => ({
        ...prev,
        enabled: true,
        popupType: 'welcome',
        badgeText: '👋 WELCOME TO SAQIB VISUALS',
        title: 'Welcome! Get an Instant Bonus on Your 1st Order',
        description:
          'Explore Pakistan’s trusted digital hub for AI Pro Accounts, Nadra/SIM records, and TikTok USA/UK accounts with 100% warranty.',
        imageUrl: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=800&q=80',
        showImage: true,
        couponCode: 'WELCOME10',
        showCoupon: true,
        countdownMinutes: 30,
        showCountdown: false,
        primaryBtnText: 'Explore & Chat on WhatsApp',
        primaryBtnAction: 'whatsapp',
        secondaryBtnText: 'Browse Store',
        showOncePerSession: true,
      }));
      showToast('👋 Applied "Welcome Bonus" Template!');
    } else if (preset === 'notice') {
      setForm((prev) => ({
        ...prev,
        enabled: true,
        popupType: 'notice',
        badgeText: '📢 OFFICIAL SYSTEM NOTICE',
        title: 'Instant Delivery & Service Updates',
        description:
          'All EasyPaisa, JazzCash, and Crypto payments are active 24/7. Average delivery time for CapCut Pro and Gemini 18M is under 3 minutes.',
        imageUrl: '',
        showImage: false,
        couponCode: '',
        showCoupon: false,
        showCountdown: false,
        primaryBtnText: 'Contact Sohaib Agency',
        primaryBtnAction: 'whatsapp',
        secondaryBtnText: 'Close Notice',
        showOncePerSession: true,
      }));
      showToast('📢 Applied "Important Notice" Template!');
    } else if (preset === 'vip') {
      setForm((prev) => ({
        ...prev,
        enabled: true,
        popupType: 'custom',
        badgeText: '👑 VIP RESELLER WHOLESALE',
        title: 'Bulk Reseller & Agency Discount Rates',
        description:
          'Looking for wholesale bulk prices for CapCut, TikTok Agency Ads, or ElevenLabs credits for your agency? Contact Saqib for reseller wallet rates.',
        imageUrl: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=800&q=80',
        showImage: true,
        couponCode: 'VIPWHOLESALE',
        showCoupon: true,
        showCountdown: true,
        countdownMinutes: 20,
        primaryBtnText: 'Get VIP Reseller Rates',
        primaryBtnAction: 'whatsapp',
        secondaryBtnText: 'Dismiss',
        showOncePerSession: true,
      }));
      showToast('👑 Applied "VIP Reseller" Template!');
    }
  };

  // Save changes to siteConfig & API
  const handleSave = async () => {
    setIsSaving(true);
    if (playPopSound) playPopSound(800);

    onUpdateSiteConfig((prev) => ({
      ...prev,
      promoPopup: form,
    }));

    try {
      const storedToken = localStorage.getItem('saqib_admin_token');
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (storedToken) headers['Authorization'] = `Bearer ${storedToken}`;

      const res = await fetch('/api/site-config', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          config: {
            ...siteConfig,
            promoPopup: form,
          },
        }),
      });

      const data = await res.json();
      if (data.success) {
        showToast('✅ Promo Popup Settings Saved to Cloud & Storefront!');
      } else {
        showToast('⚠️ Saved locally. Server response: ' + (data.error || 'Saved locally'));
      }
    } catch {
      showToast('✅ Promo Popup Settings Saved Locally!');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16">
      {/* Top Header Card */}
      <div className="bg-slate-900/95 border border-white/15 rounded-2xl p-4 sm:p-6 backdrop-blur-2xl shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-pink-500 via-rose-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-pink-500/25">
            <FaBullhorn className="text-2xl" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black text-white tracking-wide">
                Storefront Promo &amp; Welcome Popup Modal
              </h2>
              <span
                className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase border ${
                  form.enabled
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 animate-pulse'
                    : 'bg-slate-800 text-slate-400 border-slate-700'
                }`}
              >
                {form.enabled ? '● ACTIVE ON STOREFRONT' : '○ DISABLED (OFF)'}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Customize the automatic announcement / 20% discount popup that opens for website visitors.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onReturnHome}
            className="px-3.5 py-2 rounded-xl text-xs font-bold text-slate-300 bg-white/5 hover:bg-white/10 border border-white/10 transition flex items-center gap-2 cursor-pointer"
          >
            <FaArrowLeft />
            <span>Back to Menu</span>
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="px-5 py-2 rounded-xl text-xs font-black text-white bg-gradient-to-r from-pink-500 via-rose-600 to-indigo-600 hover:opacity-90 shadow-lg shadow-pink-500/30 transition flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isSaving ? (
              <>
                <FaRotateLeft className="animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <FaCheck />
                <span>Save &amp; Publish Popup</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Preset Templates Quick Bar */}
      <div className="bg-slate-900/90 border border-white/10 rounded-2xl p-4 backdrop-blur-xl shadow-lg">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-black text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
            <FaWandMagicSparkles className="text-pink-400" />
            <span>1-Click Ready Templates (Fill &amp; Customize)</span>
          </span>
          <span className="text-[10px] text-slate-400">Click any preset to auto-fill</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          <button
            type="button"
            onClick={() => applyPreset('20off')}
            className="p-3 rounded-xl bg-gradient-to-br from-rose-500/20 to-pink-600/20 hover:from-rose-500/30 hover:to-pink-600/30 border border-rose-500/40 text-left transition cursor-pointer group"
          >
            <div className="text-xs font-black text-rose-300 group-hover:text-rose-200">
              ⚡ 20% Off Flash Sale
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5 line-clamp-1">
              Urgency clock + SAQIB20 coupon
            </div>
          </button>

          <button
            type="button"
            onClick={() => applyPreset('welcome')}
            className="p-3 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-600/20 hover:from-indigo-500/30 hover:to-purple-600/30 border border-indigo-500/40 text-left transition cursor-pointer group"
          >
            <div className="text-xs font-black text-indigo-300 group-hover:text-indigo-200">
              👋 Welcome Bonus
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5 line-clamp-1">
              Store introduction + Welcome deal
            </div>
          </button>

          <button
            type="button"
            onClick={() => applyPreset('notice')}
            className="p-3 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-600/20 hover:from-amber-500/30 hover:to-orange-600/30 border border-amber-500/40 text-left transition cursor-pointer group"
          >
            <div className="text-xs font-black text-amber-300 group-hover:text-amber-200">
              📢 Important Notice
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5 line-clamp-1">
              Maintenance or timing updates
            </div>
          </button>

          <button
            type="button"
            onClick={() => applyPreset('vip')}
            className="p-3 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-600/20 hover:from-emerald-500/30 hover:to-teal-600/30 border border-emerald-500/40 text-left transition cursor-pointer group"
          >
            <div className="text-xs font-black text-emerald-300 group-hover:text-emerald-200">
              👑 VIP Reseller Deal
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5 line-clamp-1">
              Wholesale rates &amp; wallet discount
            </div>
          </button>
        </div>
      </div>

      {/* Main Grid: Left Controls (7 cols) + Right Live Preview (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Form Controls */}
        <div className="lg:col-span-7 space-y-5">
          <div className="bg-slate-900/95 border border-white/15 rounded-2xl p-5 sm:p-6 backdrop-blur-2xl shadow-xl space-y-5">
            {/* 1. Master Enable/Disable Toggle */}
            <div className="p-4 rounded-xl bg-slate-950/80 border border-white/10 flex items-center justify-between gap-4">
              <div>
                <div className="text-sm font-black text-white flex items-center gap-2">
                  <span>Storefront Popup Status</span>
                  {form.enabled ? (
                    <span className="text-[10px] font-black text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30">
                      ENABLED
                    </span>
                  ) : (
                    <span className="text-[10px] font-black text-slate-400 bg-slate-800 px-2 py-0.5 rounded-full">
                      DISABLED
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Jab ON hoga to koi bhi visitor website kholega to popup automatic samne aayega.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setForm((prev) => ({ ...prev, enabled: !prev.enabled }));
                  if (playPopSound) playPopSound(form.enabled ? 300 : 700);
                }}
                className={`text-3xl transition-transform active:scale-90 cursor-pointer ${
                  form.enabled ? 'text-emerald-400' : 'text-slate-600'
                }`}
              >
                {form.enabled ? <FaToggleOn /> : <FaToggleOff />}
              </button>
            </div>

            {/* 2. Badge & Title */}
            <div className="space-y-4 pt-2 border-t border-white/10">
              <div>
                <label className="block text-xs font-bold text-slate-200 mb-1.5">
                  Offer Badge Text (e.g. 20% OFF or Welcome)
                </label>
                <input
                  type="text"
                  value={form.badgeText}
                  onChange={(e) => setForm((prev) => ({ ...prev, badgeText: e.target.value }))}
                  placeholder="e.g. 🔥 SPECIAL 20% DISCOUNT"
                  className="w-full bg-slate-950 border border-white/20 focus:border-pink-500 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 outline-none transition font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-200 mb-1.5">
                  Main Heading / Title
                </label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
                  placeholder="e.g. Limited Time Flash Offer — Save 20% Today!"
                  className="w-full bg-slate-950 border border-white/20 focus:border-pink-500 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 outline-none transition font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-200 mb-1.5">
                  Description / Offer Message
                </label>
                <textarea
                  rows={3}
                  value={form.description}
                  onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe your offer, how to claim, and why they should buy now..."
                  className="w-full bg-slate-950 border border-white/20 focus:border-pink-500 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 outline-none transition leading-relaxed"
                />
              </div>
            </div>

            {/* 3. Image URL & Toggle */}
            <div className="space-y-3 pt-3 border-t border-white/10">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                  <FaImage className="text-pink-400" />
                  <span>Banner Image (Photo URL)</span>
                </label>
                <button
                  type="button"
                  onClick={() => setForm((prev) => ({ ...prev, showImage: !prev.showImage }))}
                  className="text-xs font-bold text-pink-400 hover:text-pink-300 cursor-pointer"
                >
                  {form.showImage ? '✓ Showing Image' : '✕ Image Hidden'}
                </button>
              </div>

              {form.showImage && (
                <div>
                  <ImageKitUploadField
                    value={form.imageUrl || ''}
                    onChange={(url) => setForm((prev) => ({ ...prev, imageUrl: url, showImage: Boolean(url) }))}
                    folder="/saqib-hub/popups"
                    label="Popup Banner Image"
                    shape="banner"
                    presets={[
                      {
                        label: 'Neon Wave',
                        url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
                      },
                      {
                        label: 'Cyber Pink',
                        url: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=800&q=80',
                      },
                      {
                        label: 'Purple 3D',
                        url: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=800&q=80',
                      },
                    ]}
                    showToast={showToast}
                    playPop={playPopSound}
                  />
                </div>
              )}
            </div>

            {/* 4. Coupon Code & Countdown Urgency */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-white/10">
              {/* Coupon Box */}
              <div className="p-3.5 rounded-xl bg-slate-950/80 border border-white/10 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                    <FaGift className="text-indigo-400" />
                    <span>Coupon Voucher</span>
                  </span>
                  <input
                    type="checkbox"
                    checked={form.showCoupon !== false}
                    onChange={(e) => setForm((prev) => ({ ...prev, showCoupon: e.target.checked }))}
                    className="accent-pink-500 cursor-pointer"
                  />
                </div>
                {form.showCoupon !== false && (
                  <input
                    type="text"
                    value={form.couponCode || ''}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        couponCode: e.target.value.toUpperCase().replace(/\s+/g, ''),
                      }))
                    }
                    placeholder="e.g. SAQIB20"
                    className="w-full bg-slate-900 border border-white/20 focus:border-indigo-400 rounded-lg px-2.5 py-1.5 text-xs text-emerald-300 font-mono font-bold tracking-wider outline-none"
                  />
                )}
              </div>

              {/* Countdown Urgency Clock */}
              <div className="p-3.5 rounded-xl bg-slate-950/80 border border-white/10 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                    <FaClock className="text-rose-400" />
                    <span>Countdown Timer</span>
                  </span>
                  <input
                    type="checkbox"
                    checked={form.showCountdown !== false}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, showCountdown: e.target.checked }))
                    }
                    className="accent-rose-500 cursor-pointer"
                  />
                </div>
                {form.showCountdown !== false && (
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min={1}
                      max={120}
                      value={form.countdownMinutes || 15}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          countdownMinutes: Math.max(1, parseInt(e.target.value) || 15),
                        }))
                      }
                      className="w-20 bg-slate-900 border border-white/20 focus:border-rose-400 rounded-lg px-2.5 py-1.5 text-xs text-rose-300 font-mono font-bold outline-none"
                    />
                    <span className="text-[11px] text-slate-400">Minutes</span>
                  </div>
                )}
              </div>
            </div>

            {/* 5. Primary CTA Action */}
            <div className="space-y-3 pt-3 border-t border-white/10">
              <label className="block text-xs font-bold text-slate-200">
                Primary Button Text &amp; Destination Action
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  value={form.primaryBtnText}
                  onChange={(e) => setForm((prev) => ({ ...prev, primaryBtnText: e.target.value }))}
                  placeholder="e.g. Claim 20% Off on WhatsApp"
                  className="bg-slate-950 border border-white/20 focus:border-pink-500 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 outline-none font-bold"
                />

                <select
                  value={form.primaryBtnAction}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      primaryBtnAction: e.target.value as 'whatsapp' | 'addfunds' | 'custom_url',
                    }))
                  }
                  className="bg-slate-950 border border-white/20 focus:border-pink-500 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none cursor-pointer"
                >
                  <option value="whatsapp">💬 Direct WhatsApp Chat</option>
                  <option value="addfunds">💳 Open Wallet Deposit Modal</option>
                  <option value="custom_url">🔗 Custom Link / External URL</option>
                </select>
              </div>

              {form.primaryBtnAction === 'custom_url' && (
                <input
                  type="url"
                  value={form.primaryBtnUrl || ''}
                  onChange={(e) => setForm((prev) => ({ ...prev, primaryBtnUrl: e.target.value }))}
                  placeholder="https://... (Enter external link)"
                  className="w-full bg-slate-950 border border-white/20 focus:border-pink-500 rounded-xl px-3.5 py-2 text-xs text-white font-mono outline-none"
                />
              )}
            </div>

            {/* 6. Session Frequency Toggle */}
            <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold text-slate-200 block">
                  Show Once Per Session (Recommended)
                </span>
                <span className="text-[10px] text-slate-400">
                  ON: Ek visit me sirf 1 baar popup aayega taake customer bar bar irritate na ho.
                </span>
              </div>
              <input
                type="checkbox"
                checked={form.showOncePerSession !== false}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, showOncePerSession: e.target.checked }))
                }
                className="accent-pink-500 cursor-pointer w-4 h-4"
              />
            </div>
          </div>
        </div>

        {/* Right Column: Live Interactive Mock Preview */}
        <div className="lg:col-span-5 sticky top-6 space-y-3">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-black text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
              <FaEye className="text-sky-400" />
              <span>Live Storefront Preview</span>
            </span>
            <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30">
              Interactive
            </span>
          </div>

          {/* Mock Screen Shell */}
          <div className="relative rounded-3xl p-5 bg-gradient-to-b from-[#131a2e] via-[#0d1322] to-[#0a0e18] border border-pink-500/40 shadow-2xl shadow-pink-500/20 text-white overflow-hidden space-y-4">
            {/* Ambient Glow */}
            <div className="absolute -top-16 -left-16 w-36 h-36 bg-pink-500/20 rounded-full blur-2xl pointer-events-none"></div>
            <div className="absolute -bottom-16 -right-16 w-36 h-36 bg-indigo-500/20 rounded-full blur-2xl pointer-events-none"></div>

            {/* Header Badge */}
            <div className="flex items-center justify-between z-10 relative">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black bg-gradient-to-r from-pink-500 via-rose-500 to-indigo-600 text-white shadow-md shadow-pink-500/30">
                <FaBolt className="text-[10px] animate-pulse" />
                <span>{form.badgeText || '🔥 SPECIAL 20% DISCOUNT'}</span>
              </span>
              <span className="w-6 h-6 rounded-full bg-white/10 text-slate-400 flex items-center justify-center text-xs">
                ✕
              </span>
            </div>

            {/* Optional Banner Image */}
            {form.showImage !== false && form.imageUrl && (
              <div className="w-full h-32 rounded-xl overflow-hidden border border-white/15 relative shadow-md">
                <img
                  src={form.imageUrl}
                  alt="Preview Banner"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              </div>
            )}

            {/* Title & Desc */}
            <div className="relative z-10">
              <h4 className="text-base sm:text-lg font-black text-white leading-snug">
                {form.title || 'Limited Time Flash Offer — Save 20% Today!'}
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed mt-1 font-medium whitespace-pre-line">
                {form.description ||
                  'Order any AI Pro Tool, CapCut Pro, or TikTok Agency Account right now and enjoy an instant 20% discount on your first order. WhatsApp Saqib directly!'}
              </p>
            </div>

            {/* Countdown Strip */}
            {form.showCountdown !== false && (
              <div className="p-2.5 rounded-xl bg-gradient-to-r from-rose-950/70 via-slate-950/90 to-rose-950/70 border border-rose-500/40 flex items-center justify-between text-xs shadow-md relative z-10">
                <div className="flex items-center gap-1.5 text-rose-300 font-extrabold text-[10px]">
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
                  <FaClock className="text-xs" />
                  <span>Offer Ends In:</span>
                </div>
                <span className="font-mono font-black text-xs text-rose-200 bg-rose-950/90 px-2 py-0.5 rounded-lg border border-rose-500/50">
                  {String(form.countdownMinutes || 15).padStart(2, '0')}:00
                </span>
              </div>
            )}

            {/* Coupon Box */}
            {form.showCoupon !== false && form.couponCode && (
              <div className="p-2.5 rounded-xl bg-slate-950/80 border border-indigo-500/40 flex items-center justify-between gap-2 relative z-10">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-xs">
                    <FaGift />
                  </div>
                  <div>
                    <div className="text-[9px] text-slate-400 font-bold uppercase">Voucher Code</div>
                    <div className="font-mono font-black text-xs text-emerald-300">
                      {form.couponCode}
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => copyText(form.couponCode || '', 'Coupon code copied!')}
                  className="px-2.5 py-1 rounded-lg text-[10px] font-black bg-indigo-500 hover:bg-indigo-400 text-white transition flex items-center gap-1 cursor-pointer"
                >
                  <FaRegCopy />
                  <span>Copy</span>
                </button>
              </div>
            )}

            {/* Primary Button */}
            <div className="pt-2 relative z-10 space-y-1.5">
              <button
                type="button"
                className="w-full py-3 rounded-xl font-black text-xs text-white bg-gradient-to-r from-pink-500 via-rose-600 to-indigo-600 shadow-lg shadow-pink-500/25 flex items-center justify-center gap-2 cursor-pointer"
              >
                {form.primaryBtnAction === 'whatsapp' ? (
                  <SiWhatsapp className="text-sm" />
                ) : (
                  <FaBolt className="text-xs" />
                )}
                <span>{form.primaryBtnText || 'Claim 20% Off on WhatsApp'}</span>
              </button>
              <div className="text-center text-[10px] text-slate-400">
                {form.secondaryBtnText || 'Maybe Later'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
