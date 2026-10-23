'use client';
import { uploadImageToImageKit } from '../lib/clientImageUpload';
import { ImageKitUploadField } from './ImageKitUploadField';

import React, { useState } from 'react';
import {
  FaGlobe,
  FaGoogle,
  FaShareNodes,
  FaXTwitter,
  FaCode,
  FaCopy,
  FaCheck,
  FaRotateLeft,
  FaWandMagicSparkles,
  FaImage,
  FaTags,
  FaArrowLeft,
  FaShieldHalved
} from 'react-icons/fa6';
import { SiteSeoConfig, SiteSettingsConfig, DEFAULT_SITE_SEO } from './AdminStepByStepSettingsHub';

interface AdminSeoStudioProps {
  siteConfig: SiteSettingsConfig;
  onUpdateSiteConfig: React.Dispatch<React.SetStateAction<SiteSettingsConfig>>;
  playPopSound: (freq?: number) => void;
  showToast: (msg: string) => void;
  copyText: (text: string, msg?: string) => void;
  onReturnHome: () => void;
}

const POPULAR_KEYWORD_SUGGESTIONS = [
  'Muhammad Saqib',
  'Saqib Visuals',
  'CapCut Pro Pakistan',
  'SMM Panel Pakistan',
  'Lovable Pro Account',
  'Gemini 18M Pro',
  'ChatGPT Plus & Claude',
  'Pak SIM Database Live',
  'SIM Tracker 2026',
  'NADRA Verification FRC',
  'TikTok Agency Accounts UK USA',
  'Fast USDT EasyPaisa Delivery',
  'Social Media Marketing Services',
  'AI Subscriptions Store'
];

export const AdminSeoStudio: React.FC<AdminSeoStudioProps> = ({
  siteConfig,
  onUpdateSiteConfig,
  playPopSound,
  showToast,
  copyText,
  onReturnHome
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'google' | 'opengraph' | 'twitter' | 'keywords' | 'code'>('google');
  const [customKeywordInput, setCustomKeywordInput] = useState<string>('');

  const seo: SiteSeoConfig = {
    ...DEFAULT_SITE_SEO,
    ...(siteConfig.seo || {})
  };

  const updateSeoField = <K extends keyof SiteSeoConfig>(field: K, value: SiteSeoConfig[K]) => {
    onUpdateSiteConfig((prev) => ({
      ...prev,
      seo: {
        ...DEFAULT_SITE_SEO,
        ...(prev.seo || {}),
        [field]: value
      }
    }));
  };

  const currentOrigin =
    typeof window !== 'undefined'
      ? window.location.origin
      : 'https://testuisaqib.vercel.app';
  const effectiveCanonical = seo.canonicalUrl.trim() || currentOrigin;

  const currentKeywordsList = seo.keywords
    .split(',')
    .map((k: string) => k.trim())
    .filter(Boolean);

  const addKeyword = (kw: string) => {
    const clean = kw.trim();
    if (!clean) return;
    if (currentKeywordsList.some((k: string) => k.toLowerCase() === clean.toLowerCase())) {
      showToast(`Keyword "${clean}" already exists!`);
      return;
    }
    const nextList = [...currentKeywordsList, clean];
    updateSeoField('keywords', nextList.join(', '));
    playPopSound(720);
    showToast(`🏷️ Added keyword: "${clean}"`);
  };

  const removeKeyword = (idx: number) => {
    const nextList = currentKeywordsList.filter((_: string, i: number) => i !== idx);
    updateSeoField('keywords', nextList.join(', '));
    playPopSound(540);
  };

  const titleLength = seo.metaTitle.length;
  const descLength = seo.metaDescription.length;

  // Schema.org Structured Data Object
  const schemaJsonObj = {
    '@context': 'https://schema.org',
    '@type': seo.schemaType || 'WebApplication',
    name: seo.metaTitle,
    description: seo.metaDescription,
    url: effectiveCanonical,
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'All',
    author: {
      '@type': 'Person',
      name: seo.author || 'Muhammad Saqib'
    },
    offers: {
      '@type': 'AggregateOffer',
      priceCurrency: 'PKR',
      lowPrice: '250',
      highPrice: '50000',
      offerCount: '31'
    }
  };

  // Full HTML Header snippet generator
  const generatedHeadHtml = `<!-- Primary Meta Tags -->
<title>${seo.metaTitle}</title>
<meta name="title" content="${seo.metaTitle}" />
<meta name="description" content="${seo.metaDescription}" />
<meta name="keywords" content="${seo.keywords}" />
<meta name="author" content="${seo.author || 'Muhammad Saqib'}" />
<meta name="robots" content="${seo.robotsIndex ? 'index' : 'noindex'}, ${seo.robotsFollow ? 'follow' : 'nofollow'}" />
<link rel="canonical" href="${effectiveCanonical}" />

<!-- Open Graph / Facebook / WhatsApp -->
<meta property="og:type" content="${seo.ogType || 'website'}" />
<meta property="og:url" content="${effectiveCanonical}" />
<meta property="og:title" content="${seo.ogTitle || seo.metaTitle}" />
<meta property="og:description" content="${seo.ogDescription || seo.metaDescription}" />
<meta property="og:image" content="${seo.ogImageUrl || siteConfig.banner.portraitUrl}" />
<meta property="og:site_name" content="${siteConfig.footer.brandName || 'Sohaib Agency Hub'}" />

<!-- Twitter / X -->
<meta name="twitter:card" content="${seo.twitterCard || 'summary_large_image'}" />
<meta name="twitter:url" content="${effectiveCanonical}" />
<meta name="twitter:title" content="${seo.ogTitle || seo.metaTitle}" />
<meta name="twitter:description" content="${seo.ogDescription || seo.metaDescription}" />
<meta name="twitter:image" content="${seo.ogImageUrl || siteConfig.banner.portraitUrl}" />
<meta name="twitter:creator" content="${seo.twitterCreator || '@mrsaqib242'}" />

<!-- Schema.org JSON-LD Structured Data -->
<script type="application/ld+json">
${JSON.stringify(schemaJsonObj, null, 2)}
</script>`;

  return (
    <div className="space-y-5 animate-fadeIn">
      <div className="acrylic-frame rounded-[34px] p-3 sm:p-4">
        <div className="plush-pillow plush-hero rounded-[26px] p-4 sm:p-6 space-y-6">
          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-indigo-200 pb-4">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 text-white flex items-center justify-center text-xl shadow-md border-2 border-white flex-shrink-0">
                <FaGlobe />
              </div>
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-700 flex items-center gap-1.5">
                  <FaShieldHalved className="w-3 h-3 text-blue-600" />
                  <span>SEARCH ENGINE OPTIMIZATION (SEO) &amp; SOCIAL CARDS STUDIO</span>
                </span>
                <h3 className="text-base sm:text-xl font-extrabold text-slate-900 mt-0.5">
                  Manage Google SEO, OpenGraph Tags &amp; Custom Keywords
                </h3>
                <p className="text-xs font-semibold text-slate-600 mt-0.5">
                  Configure real-time meta descriptions, social sharing banners, and JSON-LD structured data for top Google ranking.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => {
                  playPopSound(740);
                  updateSeoField('metaTitle', `${siteConfig.banner.mainTitle} ${siteConfig.banner.highlightTitle} — SMM Store & AI Hub`);
                  updateSeoField('metaDescription', siteConfig.banner.description);
                  updateSeoField('ogTitle', `${siteConfig.banner.mainTitle} ${siteConfig.banner.highlightTitle}`);
                  updateSeoField('ogDescription', siteConfig.banner.description);
                  updateSeoField('ogImageUrl', siteConfig.banner.portraitUrl);
                  showToast('✨ Auto-filled SEO tags from Hero Banner!');
                }}
                className="px-3 py-2 rounded-xl bg-white hover:bg-blue-50 text-blue-700 border border-blue-200 text-xs font-extrabold flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs w-full sm:w-auto"
              >
                <FaWandMagicSparkles className="w-3.5 h-3.5 text-blue-600" />
                <span>Auto-Fill from Hero</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  playPopSound(580);
                  onUpdateSiteConfig((prev) => ({
                    ...prev,
                    seo: DEFAULT_SITE_SEO
                  }));
                  showToast('↺ SEO settings restored to defaults!');
                }}
                className="px-3 py-2 rounded-xl bg-white hover:bg-rose-50 text-rose-600 border border-rose-200 text-xs font-extrabold flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs w-full sm:w-auto"
              >
                <FaRotateLeft className="w-3.5 h-3.5" />
                <span>Restore Defaults</span>
              </button>

              <button
                type="button"
                onClick={onReturnHome}
                className="col-span-2 sm:col-span-1 px-3.5 py-2 rounded-xl bg-slate-900 text-white text-xs font-extrabold flex items-center justify-center gap-1.5 cursor-pointer shadow-md w-full sm:w-auto"
              >
                <FaArrowLeft className="w-3.5 h-3.5" />
                <span>Settings Menu</span>
              </button>
            </div>
          </div>

          {/* 5 Sub-Tab Switcher Pills */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {[
              {
                id: 'google' as const,
                label: 'Google Search Snippet',
                sub: 'Title & Meta Description',
                icon: <FaGoogle className="w-3.5 h-3.5 text-blue-600" />
              },
              {
                id: 'opengraph' as const,
                label: 'OpenGraph Tags',
                sub: 'WhatsApp / Facebook Card',
                icon: <FaShareNodes className="w-3.5 h-3.5 text-emerald-600" />
              },
              {
                id: 'twitter' as const,
                label: 'Twitter / X Cards',
                sub: 'Summary Large Image',
                icon: <FaXTwitter className="w-3.5 h-3.5 text-slate-800" />
              },
              {
                id: 'keywords' as const,
                label: 'Keywords & Schema',
                sub: `${currentKeywordsList.length} Tags & JSON-LD`,
                icon: <FaTags className="w-3.5 h-3.5 text-purple-600" />
              },
              {
                id: 'code' as const,
                label: 'Export Head HTML',
                sub: 'Copy <head> tags',
                icon: <FaCode className="w-3.5 h-3.5 text-amber-600" />
              }
            ].map((tab) => {
              const isAct = activeSubTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => {
                    playPopSound(620);
                    setActiveSubTab(tab.id);
                  }}
                  className={`p-3 rounded-2xl border text-left transition cursor-pointer flex flex-col justify-between ${tab.id === 'code' ? 'col-span-2 sm:col-span-1' : ''} ${
                    isAct
                      ? 'bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white border-white shadow-md scale-[1.01]'
                      : 'bg-white/90 hover:bg-white text-slate-800 border-indigo-100 shadow-2xs'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs ${
                        isAct ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {tab.icon}
                    </span>
                    <span className="text-xs font-extrabold truncate">{tab.label}</span>
                  </div>
                  <div
                    className={`text-[10px] font-semibold truncate mt-1 ${
                      isAct ? 'text-blue-100' : 'text-slate-500'
                    }`}
                  >
                    {tab.sub}
                  </div>
                </button>
              );
            })}
          </div>

          {/* ==================== SUB-TAB 1: GOOGLE SEARCH SNIPPET & META DESCRIPTION ==================== */}
          {activeSubTab === 'google' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {/* Left Column: Form Inputs */}
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-extrabold text-slate-900">
                      1. SEO Page Title (<code className="text-blue-600 font-mono-code">&lt;title&gt;</code>) *
                    </label>
                    <span
                      className={`text-[10px] font-mono-code font-bold ${
                        titleLength >= 30 && titleLength <= 60
                          ? 'text-emerald-600 font-extrabold'
                          : titleLength > 60
                          ? 'text-amber-600 font-extrabold'
                          : 'text-slate-500'
                      }`}
                    >
                      {titleLength}/60 chars {titleLength >= 30 && titleLength <= 60 ? '✓ Optimal' : titleLength > 60 ? '⚠️ Truncated' : '(Recommended 30-60)'}
                    </span>
                  </div>
                  <input
                    type="text"
                    value={seo.metaTitle}
                    onChange={(e) => updateSeoField('metaTitle', e.target.value)}
                    placeholder="Sohaib Agency Hub — Digital & AI Services, SMM Store & Web Tools"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border-2 border-indigo-200 font-bold text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-extrabold text-slate-900">
                      2. Meta Description (<code className="text-blue-600 font-mono-code">&lt;meta name=&quot;description&quot;&gt;</code>) *
                    </label>
                    <span
                      className={`text-[10px] font-mono-code font-bold ${
                        descLength >= 120 && descLength <= 160
                          ? 'text-emerald-600 font-extrabold'
                          : descLength > 160
                          ? 'text-amber-600 font-extrabold'
                          : 'text-slate-500'
                      }`}
                    >
                      {descLength}/160 chars {descLength >= 120 && descLength <= 160 ? '✓ Optimal' : descLength > 160 ? '⚠️ Truncated' : '(Recommended 120-160)'}
                    </span>
                  </div>
                  <textarea
                    rows={4}
                    value={seo.metaDescription}
                    onChange={(e) => updateSeoField('metaDescription', e.target.value)}
                    placeholder="Instant CapCut Pro, Lovable Pro, Gemini 18M, ChatGPT Plus, TikTok UK/USA Agency Accounts, Franchise SIM Records & SMM Services by Sohaib Agency Hub."
                    className="w-full p-3 rounded-xl bg-white border-2 border-indigo-200 font-semibold text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-extrabold text-slate-900 mb-1">
                      3. Website Author
                    </label>
                    <input
                      type="text"
                      value={seo.author}
                      onChange={(e) => updateSeoField('author', e.target.value)}
                      placeholder="Sohaib Agency"
                      className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-300 font-bold text-xs text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-extrabold text-slate-900 mb-1">
                      4. Canonical URL (Optional)
                    </label>
                    <input
                      type="text"
                      value={seo.canonicalUrl}
                      onChange={(e) => updateSeoField('canonicalUrl', e.target.value)}
                      placeholder="https://testuisaqib.vercel.app"
                      className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-300 font-mono-code text-xs text-slate-900"
                    />
                  </div>
                </div>

                {/* Search Engine Robots Indexing */}
                <div className="p-3.5 rounded-2xl bg-white/95 border border-indigo-200 space-y-3">
                  <div className="text-xs font-extrabold text-slate-900">
                    Search Engine Crawling &amp; Indexing Directives
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <div className="text-xs font-bold text-slate-800">
                        Allow Search Engines to Index (robots: index)
                      </div>
                      <div className="text-[10px] text-slate-500">
                        When enabled, Google, Bing &amp; Yahoo index this store for search results
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => updateSeoField('robotsIndex', !seo.robotsIndex)}
                      className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 transition-colors duration-200 ease-in-out ${
                        seo.robotsIndex ? 'bg-emerald-500 border-emerald-500' : 'bg-slate-300 border-slate-300'
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                          seo.robotsIndex ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between gap-3 pt-2 border-t border-slate-100">
                    <div>
                      <div className="text-xs font-bold text-slate-800">
                        Allow Search Engines to Follow Links (robots: follow)
                      </div>
                      <div className="text-[10px] text-slate-500">
                        Allows search bots to discover all your service categories and live web tools
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => updateSeoField('robotsFollow', !seo.robotsFollow)}
                      className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 transition-colors duration-200 ease-in-out ${
                        seo.robotsFollow ? 'bg-emerald-500 border-emerald-500' : 'bg-slate-300 border-slate-300'
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                          seo.robotsFollow ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Column: Live Google Snippet Simulation */}
              <div className="space-y-4">
                <div className="rounded-2xl bg-white p-4 sm:p-5 border-2 border-indigo-100 shadow-md space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                      <FaGoogle className="text-blue-500" />
                      <span>Google Search Result Snippet Preview</span>
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                      Live Simulation
                    </span>
                  </div>

                  {/* Google Card */}
                  <div className="space-y-1 py-1">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center text-[10px]">
                        🌐
                      </div>
                      <div className="text-[12px] text-slate-700 leading-tight">
                        <span className="font-semibold">{siteConfig.footer.brandName || 'Sohaib Agency Hub'}</span>
                        <span className="text-slate-400 mx-1">›</span>
                        <span className="text-slate-500 font-mono-code text-[11px] truncate">{effectiveCanonical.replace(/^https?:\/\//, '')}</span>
                      </div>
                    </div>

                    <h4 className="text-base sm:text-lg font-normal text-[#1a0dab] hover:underline cursor-pointer leading-snug">
                      {seo.metaTitle || 'Sohaib Agency Hub'}
                    </h4>

                    <p className="text-xs sm:text-sm text-[#4d5156] leading-relaxed line-clamp-3">
                      {seo.metaDescription || 'Instant AI Subscriptions, CapCut Pro, SMM Agency & SIM Info Hub.'}
                    </p>
                  </div>

                  <div className="rounded-xl bg-slate-50 p-3 text-[11px] text-slate-600 space-y-1 border border-slate-200">
                    <div className="font-extrabold text-slate-800 flex items-center gap-1">
                      <FaCheck className="text-emerald-600" />
                      <span>SEO Checklist Status:</span>
                    </div>
                    <div>• Title is {titleLength >= 30 && titleLength <= 60 ? 'optimal length (30-60 chars)' : `${titleLength} chars (Recommended 30-60)`}</div>
                    <div>• Description is {descLength >= 120 && descLength <= 160 ? 'optimal length (120-160 chars)' : `${descLength} chars (Recommended 120-160)`}</div>
                    <div>• Canonical URL: <code className="font-mono-code text-blue-700">{effectiveCanonical}</code></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ==================== SUB-TAB 2: OPENGRAPH SOCIAL SHARE CARDS ==================== */}
          {activeSubTab === 'opengraph' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {/* Form Inputs */}
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-extrabold text-slate-900 mb-1">
                    1. OpenGraph Social Title (<code className="text-emerald-700 font-mono-code">og:title</code>)
                  </label>
                  <input
                    type="text"
                    value={seo.ogTitle}
                    onChange={(e) => updateSeoField('ogTitle', e.target.value)}
                    placeholder={seo.metaTitle}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border-2 border-emerald-200 font-bold text-xs sm:text-sm text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-slate-900 mb-1">
                    2. OpenGraph Description (<code className="text-emerald-700 font-mono-code">og:description</code>)
                  </label>
                  <textarea
                    rows={3}
                    value={seo.ogDescription}
                    onChange={(e) => updateSeoField('ogDescription', e.target.value)}
                    placeholder={seo.metaDescription}
                    className="w-full p-3 rounded-xl bg-white border-2 border-emerald-200 font-semibold text-xs text-slate-900"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-extrabold text-slate-900">
                      3. Social Share Banner Image URL (<code className="text-emerald-700 font-mono-code">og:image</code>)
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        updateSeoField('ogImageUrl', siteConfig.banner.portraitUrl);
                        playPopSound(720);
                        showToast('🖼️ Copied Hero Portrait URL to Social Banner!');
                      }}
                      className="text-[11px] font-bold text-emerald-700 hover:underline cursor-pointer"
                    >
                      Use Hero Portrait
                    </button>
                  </div>
                  <div>
                    <ImageKitUploadField
                      value={seo.ogImageUrl || ''}
                      onChange={(url) => updateSeoField('ogImageUrl', url)}
                      folder="/saqib-hub/seo"
                      label="Social Share Card (og:image)"
                      shape="banner"
                      presets={[
                        {
                          label: 'Hero Portrait Photo',
                          url: siteConfig.banner.portraitUrl,
                        },
                      ]}
                      showToast={showToast}
                      playPop={playPopSound}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-extrabold text-slate-900 mb-1">
                      4. OpenGraph Type (<code className="text-emerald-700 font-mono-code">og:type</code>)
                    </label>
                    <select
                      value={seo.ogType}
                      onChange={(e) => updateSeoField('ogType', e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 font-bold text-xs text-slate-900"
                    >
                      <option value="website">website</option>
                      <option value="product">product</option>
                      <option value="profile">profile</option>
                      <option value="article">article</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-extrabold text-slate-900 mb-1">
                      5. Site Brand Name (<code className="text-emerald-700 font-mono-code">og:site_name</code>)
                    </label>
                    <input
                      type="text"
                      value={siteConfig.footer.brandName}
                      disabled
                      className="w-full px-3 py-2 rounded-xl bg-slate-100 border border-slate-300 font-bold text-xs text-slate-600 cursor-not-allowed"
                    />
                  </div>
                </div>
              </div>

              {/* WhatsApp / Facebook Card Preview */}
              <div className="space-y-4">
                <div className="rounded-2xl bg-white p-4 border-2 border-emerald-100 shadow-md space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                      <FaShareNodes className="text-emerald-600" />
                      <span>WhatsApp &amp; Facebook Social Share Card Preview</span>
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-extrabold">
                      og:image Card
                    </span>
                  </div>

                  {/* Simulated Card Frame */}
                  <div className="rounded-2xl overflow-hidden border border-slate-300 shadow-md bg-slate-50">
                    <div className="h-44 sm:h-52 w-full bg-slate-900 overflow-hidden relative flex items-center justify-center">
                      {seo.ogImageUrl ? (
                        <img
                          src={seo.ogImageUrl}
                          alt="OpenGraph Banner"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="text-slate-400 text-xs font-bold flex flex-col items-center gap-2">
                          <FaImage className="w-8 h-8 opacity-50" />
                          <span>No social image set. Enter an image URL on the left.</span>
                        </div>
                      )}
                      <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md text-white text-[9px] font-mono-code">
                        1200 × 630 OG Banner
                      </span>
                    </div>

                    <div className="p-3.5 space-y-1 bg-white">
                      <div className="text-[10px] font-mono-code uppercase font-bold text-slate-400 truncate">
                        {effectiveCanonical.replace(/^https?:\/\//, '')}
                      </div>
                      <div className="text-xs sm:text-sm font-extrabold text-slate-900 leading-snug line-clamp-1">
                        {seo.ogTitle || seo.metaTitle}
                      </div>
                      <div className="text-[11px] text-slate-600 line-clamp-2">
                        {seo.ogDescription || seo.metaDescription}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ==================== SUB-TAB 3: TWITTER / X CARDS ==================== */}
          {activeSubTab === 'twitter' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-extrabold text-slate-900 mb-1">
                    1. Twitter Card Type (<code className="font-mono-code text-blue-700">twitter:card</code>)
                  </label>
                  <select
                    value={seo.twitterCard}
                    onChange={(e) =>
                      updateSeoField('twitterCard', e.target.value as 'summary' | 'summary_large_image')
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border-2 border-slate-300 font-bold text-xs text-slate-900"
                  >
                    <option value="summary_large_image">summary_large_image (Full Width Photo Card)</option>
                    <option value="summary">summary (Small Square Thumbnail Card)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-slate-900 mb-1">
                    2. Twitter Creator / Handle (<code className="font-mono-code text-blue-700">twitter:creator</code>)
                  </label>
                  <input
                    type="text"
                    value={seo.twitterCreator}
                    onChange={(e) => updateSeoField('twitterCreator', e.target.value)}
                    placeholder="@mrsaqib242"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border-2 border-slate-300 font-mono-code text-xs text-slate-900"
                  />
                </div>

                <div className="p-4 rounded-2xl bg-white/90 border border-slate-200 text-xs text-slate-700 space-y-2">
                  <div className="font-extrabold text-slate-900 flex items-center gap-1.5">
                    <FaXTwitter className="text-slate-900 text-sm" />
                    <span>How Twitter / X Displays Your Links:</span>
                  </div>
                  <p className="text-[11px] leading-relaxed">
                    When you or a customer posts your link on Twitter/X, it automatically generates a prominent clickable card with your custom headline, description and high-resolution banner photo.
                  </p>
                </div>
              </div>

              {/* Twitter Card Live Mockup */}
              <div className="space-y-4">
                <div className="rounded-2xl bg-slate-950 text-white p-4 sm:p-5 border-2 border-slate-800 shadow-xl space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                      <FaXTwitter className="text-white" />
                      <span>X / Twitter Card Preview</span>
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-400 text-[10px] font-bold">
                      {seo.twitterCard}
                    </span>
                  </div>

                  <div className="rounded-2xl overflow-hidden border border-slate-800 bg-slate-900">
                    <div className="h-44 w-full bg-slate-950 overflow-hidden relative flex items-center justify-center">
                      <img
                        src={seo.ogImageUrl || siteConfig.banner.portraitUrl}
                        alt="X Card Banner"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-3 space-y-1">
                      <div className="text-[10px] text-slate-400 font-mono-code truncate">
                        {effectiveCanonical.replace(/^https?:\/\//, '')}
                      </div>
                      <div className="text-xs sm:text-sm font-bold text-white truncate">
                        {seo.ogTitle || seo.metaTitle}
                      </div>
                      <div className="text-[11px] text-slate-400 line-clamp-2">
                        {seo.ogDescription || seo.metaDescription}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ==================== SUB-TAB 4: KEYWORDS & SCHEMA.ORG JSON-LD ==================== */}
          {activeSubTab === 'keywords' && (
            <div className="space-y-5">
              {/* Keywords Input & Tag Cloud */}
              <div className="p-4 rounded-2xl bg-white/95 border-2 border-indigo-200 space-y-3 shadow-xs">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-extrabold text-slate-900 flex items-center gap-1.5">
                    <FaTags className="text-indigo-600" />
                    <span>Custom SEO Keywords ({currentKeywordsList.length} Active Tags)</span>
                  </label>
                  <span className="text-[10px] text-slate-500 font-semibold">Comma-separated</span>
                </div>

                {/* Add keyword bar */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={customKeywordInput}
                    onChange={(e) => setCustomKeywordInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addKeyword(customKeywordInput);
                        setCustomKeywordInput('');
                      }
                    }}
                    placeholder="Type keyword and press Enter or click +Add (e.g. CapCut Pro Discount, SIM Database)..."
                    className="flex-1 px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-300 font-semibold text-xs text-slate-900"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      addKeyword(customKeywordInput);
                      setCustomKeywordInput('');
                    }}
                    className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs cursor-pointer"
                  >
                    + Add Tag
                  </button>
                </div>

                {/* Active Keyword Chips */}
                <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-100">
                  {currentKeywordsList.map((kw: string, i: number) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-900 text-[11px] font-bold flex items-center gap-1.5 shadow-2xs"
                    >
                      <span>{kw}</span>
                      <button
                        type="button"
                        onClick={() => removeKeyword(i)}
                        className="text-rose-500 hover:text-rose-700 font-black cursor-pointer text-xs"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>

                {/* 1-Tap Suggestions */}
                <div className="pt-2">
                  <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 mb-1.5">
                    💡 1-Tap Recommended Keyword Suggestions:
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {POPULAR_KEYWORD_SUGGESTIONS.map((sug: string, i: number) => {
                      const alreadyAdded = currentKeywordsList.some(
                        (k: string) => k.toLowerCase() === sug.toLowerCase()
                      );
                      return (
                        <button
                          key={i}
                          type="button"
                          onClick={() => addKeyword(sug)}
                          disabled={alreadyAdded}
                          className={`px-2.5 py-1 rounded-xl text-[10px] font-bold transition cursor-pointer border ${
                            alreadyAdded
                              ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-default'
                              : 'bg-white hover:bg-pink-50 text-slate-800 border-pink-200 shadow-2xs'
                          }`}
                        >
                          {alreadyAdded ? `✓ ${sug}` : `+ ${sug}`}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Schema.org Structured Data */}
              <div className="p-4 rounded-2xl bg-white/95 border-2 border-indigo-200 space-y-3 shadow-xs">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <h4 className="text-xs sm:text-sm font-extrabold text-slate-900 flex items-center gap-1.5">
                      <FaCode className="text-purple-600" />
                      <span>Schema.org JSON-LD Structured Data Generator</span>
                    </h4>
                    <p className="text-[11px] text-slate-600">
                      Helps Google understand your store entity, services, price ranges, and owner credentials.
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                    <select
                      value={seo.schemaType}
                      onChange={(e) =>
                        updateSeoField('schemaType', e.target.value as 'WebApplication' | 'Product' | 'Organization')
                      }
                      className="flex-1 sm:flex-initial px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-300 font-bold text-xs text-slate-900"
                    >
                      <option value="WebApplication">Schema: WebApplication</option>
                      <option value="Product">Schema: Product</option>
                      <option value="Organization">Schema: Organization</option>
                    </select>

                    <button
                      type="button"
                      onClick={() => copyText(JSON.stringify(schemaJsonObj, null, 2), 'Schema.org JSON-LD Copied!')}
                      className="px-3 py-1.5 rounded-xl bg-purple-600 text-white font-extrabold text-xs cursor-pointer flex items-center justify-center gap-1 shadow-2xs flex-shrink-0"
                    >
                      <FaCopy className="w-3 h-3" />
                      <span>Copy JSON-LD</span>
                    </button>
                  </div>
                </div>

                <pre className="p-3 rounded-xl bg-slate-900 text-sky-300 font-mono-code text-[11px] overflow-x-auto max-h-48 border border-slate-800">
                  {JSON.stringify(schemaJsonObj, null, 2)}
                </pre>
              </div>
            </div>
          )}

          {/* ==================== SUB-TAB 5: EXPORT FULL HEAD HTML TAGS ==================== */}
          {activeSubTab === 'code' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-white/95 border-2 border-amber-200 space-y-3 shadow-xs">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <h4 className="text-xs sm:text-sm font-extrabold text-slate-900 flex items-center gap-1.5">
                      <FaCode className="text-amber-600" />
                      <span>Export All SEO &amp; OpenGraph HTML Head Tags</span>
                    </h4>
                    <p className="text-[11px] text-slate-600">
                      Instantly copy the complete bundle of verified HTML tags to paste into your domain or share with web developers.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => copyText(generatedHeadHtml, 'Full SEO HTML Head Tags Copied!')}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-white font-extrabold text-xs cursor-pointer flex items-center gap-1.5 shadow-md hover:scale-[1.02] transition"
                  >
                    <FaCopy className="w-3.5 h-3.5" />
                    <span>Copy Full HTML Tags</span>
                  </button>
                </div>

                <pre className="p-4 rounded-xl bg-slate-950 text-emerald-400 font-mono-code text-[11px] overflow-x-auto max-h-96 border border-slate-800 leading-relaxed">
                  {generatedHeadHtml}
                </pre>
              </div>
            </div>
          )}

          {/* Bottom Action Bar */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-indigo-200">
            <span className="text-[11px] font-semibold text-slate-600">
              Changes apply instantly to live document <code className="font-mono-code text-blue-700">&lt;head&gt;</code> and persist in storage.
            </span>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  playPopSound(840);
                  showToast('✅ SEO & Social Meta Tags Saved & Live on Website!');
                  onReturnHome();
                }}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-extrabold text-xs sm:text-sm shadow-md cursor-pointer hover:scale-[1.01] transition"
              >
                ✓ Save &amp; Return to Settings
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
