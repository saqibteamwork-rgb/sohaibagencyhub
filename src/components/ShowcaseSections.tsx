import { DEFAULT_REVIEWS } from '../data/defaultReviews';
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { StoreService } from '../data/defaultCatalog';
import { SiteSettingsConfig } from '../types/siteConfig';
import {
  RiOpenaiFill,
  SiGooglegemini,
  FaScissors,
  SiWhatsapp
} from './BrandIcons';

export interface ShowcaseBannerPill {
  id: string;
  icon: string;
  title: string;
  sub: string;
  tag: string;
  grad?: string;
}

export interface ShowcaseBannerButton {
  label: string;
  icon: string;
  actionType: 'service' | 'category' | 'whatsapp' | 'url';
  targetValue: string;
  variant: 'primary' | 'secondary' | 'emerald' | 'amber';
}

export interface ShowcaseBannerItem {
  id: string;
  enabled: boolean;
  layout: 'image-right' | 'image-left';
  themeStyle: 'sim-search' | 'about' | 'hero' | 'contact' | 'dark-neon' | 'capcut';
  badgeCategory: string;
  badgeCategoryColor: string;
  subtitleInfo: string;
  title: string;
  paragraph1: string;
  paragraph2?: string;
  buttons: ShowcaseBannerButton[];
  imageUrl: string;
  imageAlt: string;
  topBadgeLeft: string;
  topBadgeRight: string;
  pills?: ShowcaseBannerPill[];
}

export const DEFAULT_SHOWCASE_BANNERS: ShowcaseBannerItem[] = [
  {
    id: 'banner-creator-ai',
    enabled: true,
    layout: 'image-left',
    themeStyle: 'capcut',
    badgeCategory: 'FEATURED ARTICLE',
    badgeCategoryColor: 'bg-indigo-100 text-indigo-800',
    subtitleInfo: 'AI & Creator Guide · 3 Min Read · By Muhammad Saqib',
    title:
      'How Pakistani Creators & Freelancers Save 85% on Official ChatGPT Plus, Gemini 18M Pro & CapCut Pro',
    paragraph1:
      'Buying international subscriptions like ChatGPT Plus ($20/mo), Lovable Pro, or CapCut Pro directly with a bank card costs over Rs. 6,000+ per month with heavy taxes. At Sohaib Agency, we provide 100% genuine, official workspace and personal email activations starting from just Rs. 350!',
    paragraph2:
      'Whether you are running a faceless YouTube automation channel using ElevenLabs 300k Credits (No Expiry) & CapCut Pro 4K, building apps with Lovable Pro & Claude 3.7 Sonnet, or upgrading your personal Gmail with Google Gemini 18-Month Pro + 2TB Storage, every subscription comes with our Full Period Replacement Warranty.',
    buttons: [
      {
        label: 'Activate Gemini 18M (Rs. 1,800)',
        icon: 'fa-solid fa-wand-magic-sparkles',
        actionType: 'service',
        targetValue: 'gemini-18m-pro',
        variant: 'primary'
      },
      {
        label: 'Get ChatGPT Plus (Rs. 550)',
        icon: 'fa-solid fa-robot',
        actionType: 'service',
        targetValue: 'chatgpt-plus',
        variant: 'secondary'
      }
    ],
    imageUrl:
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1000&q=85',
    imageAlt: 'AI & Creator Pro Workstation',
    topBadgeLeft: '✨ CREATOR BLOG #01',
    topBadgeRight: '● 85% OFF RETAIL',
    pills: [
      {
        id: 'p1',
        icon: 'fa-solid fa-cloud',
        title: 'Google One Cloud',
        sub: '2,000 GB + Gemini',
        tag: 'Gemini 18M • ChatGPT',
        grad: 'from-emerald-500 to-teal-600'
      },
      {
        id: 'p2',
        icon: 'fa-solid fa-microphone',
        title: 'AI Voice & Tokens',
        sub: '1B Muse + 300k',
        tag: 'ElevenLabs & Muse',
        grad: 'from-pink-500 to-purple-600'
      }
    ]
  },
  {
    id: 'banner-tiktok-franchise',
    enabled: true,
    layout: 'image-right',
    themeStyle: 'sim-search',
    badgeCategory: 'INSIDER BLOG',
    badgeCategoryColor: 'bg-rose-100 text-rose-800',
    subtitleInfo: 'Monetization & Telecom Insights · 4 Min Read · Sohaib Agency VIP Desk',
    title:
      'Unlock TikTok UK/USA Creator Rewards, Global Ad Agency Accounts & 2026 Franchise Verification',
    paragraph1:
      'Want to earn in Dollars/Pounds from Pakistan on TikTok? Our Fresh TikTok UK & USA Monetizable Accounts work smoothly without any VPN so you can qualify for the Creator Rewards Program and TikTok Shop. Pair it with our Verified TikTok & Facebook Ad Agency Accounts to run high-converting ads with zero ban risk.',
    paragraph2:
      'Need urgent telecom or official verification? Alongside our free public SIM tool, our 24/7 VIP Franchise & NADRA Desk provides 100% confidential 2026 Fresh SIM Owner Details, Call History (CDR), Live Location Pinpoint, Family Tree (FRC), and Passport Travel History directly to your WhatsApp within 15–30 minutes.',
    buttons: [
      {
        label: 'Get TikTok UK/USA Account',
        icon: 'fa-brands fa-tiktok',
        actionType: 'service',
        targetValue: 'tiktok-uk-usa-acc',
        variant: 'primary'
      },
      {
        label: 'Order Fresh SIM / CDR Info',
        icon: 'fa-solid fa-satellite-dish',
        actionType: 'service',
        targetValue: 'sim-owner-details',
        variant: 'emerald'
      }
    ],
    imageUrl:
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1000&q=85',
    imageAlt: 'TikTok Monetization & Telecom Analytics',
    topBadgeLeft: '🚀 INSIDER GUIDE #02',
    topBadgeRight: 'UK • USA • PAK',
    pills: [
      {
        id: 'p1',
        icon: 'fa-brands fa-tiktok',
        title: 'UK Creator Rewards',
        sub: 'No VPN Needed • Tax-Free',
        tag: '$1.20+ RPM',
        grad: 'from-rose-500 to-pink-600'
      },
      {
        id: 'p2',
        icon: 'fa-solid fa-satellite-dish',
        title: '2026 Franchise & NADRA',
        sub: 'Live SIM • CDR • FRC • Passport',
        tag: '15 MIN PDF',
        grad: 'from-emerald-500 to-teal-600'
      }
    ]
  }
];

interface ShowcaseSectionsProps {
  siteConfig?: SiteSettingsConfig;
  onSelectServiceById: (id: string) => void;
  onQuickFilter: (category: any, keyword?: string) => void;
  onPlayPop: (freq?: number) => void;
  servicesCatalog: StoreService[];
  showcaseBanners?: ShowcaseBannerItem[];
  primaryWaNumber?: string;
  reviews?: any[];
  isAdmin?: boolean;
  onAddReview?: (review: { name: string; service: string; rating: number; comment: string; verified?: boolean }) => Promise<boolean>;
  onDeleteReview?: (id: string) => Promise<boolean>;
  onToggleVerified?: (id: string, currentStatus: boolean) => Promise<boolean>;
  currentUserName?: string;
}

export const ShowcaseSections: React.FC<ShowcaseSectionsProps> = ({
  siteConfig,
  onSelectServiceById,
  onQuickFilter,
  onPlayPop,
  servicesCatalog = [],
  showcaseBanners,
  primaryWaNumber,
  reviews = [],
  isAdmin = false,
  onAddReview,
  onDeleteReview,
  onToggleVerified,
  currentUserName = ''
}) => {
  const brandOwner = siteConfig?.banner?.mainTitle?.trim() || 'Muhammad Saqib';
  const brandAccent = siteConfig?.banner?.highlightTitle?.trim().replace(/^[—\-\s]+/, '') || 'Sohaib Agency';
  const fullBrand = `${brandOwner} ${siteConfig?.banner?.highlightTitle?.trim() || ''}`.trim();

  const [showWriteModal, setShowWriteModal] = React.useState(false);
  const [authorName, setAuthorName] = React.useState(currentUserName || '');
  const [selectedService, setSelectedService] = React.useState(
    servicesCatalog[0]?.title || 'CapCut Pro 1 Year'
  );
  const [rating, setRating] = React.useState(5);
  const [comment, setComment] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [visibleCount, setVisibleCount] = React.useState(6);

  React.useEffect(() => {
    if (currentUserName && !authorName) {
      setAuthorName(currentUserName);
    }
  }, [currentUserName]);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authorName.trim() || !comment.trim()) {
      alert('Please enter your name and review feedback.');
      return;
    }
    setIsSubmitting(true);
    try {
      if (onAddReview) {
        const ok = await onAddReview({
          name: authorName.trim(),
          service: selectedService,
          rating,
          comment: comment.trim(),
          verified: true
        });
        if (ok) {
          setShowWriteModal(false);
          setComment('');
          if (onPlayPop) onPlayPop(700);
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  const banners =
    showcaseBanners && showcaseBanners.length > 0 ? showcaseBanners : DEFAULT_SHOWCASE_BANNERS;
  const activeBanners = banners.filter((b) => b.enabled !== false);
  return (
    <div className="space-y-7 pt-2">
      {/* ==================== SECTION 1: FLAGSHIP AI PRO ACCOUNTS SPOTLIGHT (CHATGPT PRO, GEMINI 18M PRO, CAPCUT & LOVABLE) ==================== */}
      <section data-scroll="up" className="acrylic-frame rounded-[34px] p-3 sm:p-5 space-y-4 content-visibility-auto">
        <div className="plush-pillow plush-about rounded-[26px] p-4 sm:p-6 space-y-5">
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-pink-200/80 pb-4 text-center md:text-left">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-white/90 border border-pink-200 text-[10px] font-extrabold text-purple-700 shadow-sm">
                <i className="fa-solid fa-crown text-amber-500"></i> OFFICIAL AI &amp; CREATOR PRO ACCOUNTS
              </div>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
                ChatGPT Plus, Gemini 18M Pro &amp; AI Suite 🔥
              </h2>
              <p className="text-xs sm:text-sm font-semibold text-slate-700">
                100% Official Subscriptions activated on your own Gmail or private workspace with Full Replacement Warranty.
              </p>
            </div>
            <button
              type="button"
              onClick={() => onQuickFilter('capcut_ai', '')}
              className="self-center md:self-auto px-4 py-2 rounded-full bg-gradient-to-r from-purple-600 to-pink-500 text-white font-extrabold text-xs shadow-md hover:scale-105 transition whitespace-nowrap cursor-pointer"
            >
              <i className="fa-solid fa-wand-magic-sparkles mr-1.5"></i>View All 12+ AI Tools
            </button>
          </div>

          {/* 3 Flagship Spotlight Cards: ChatGPT Plus/Pro, Gemini 18M Pro, Lovable + CapCut + ElevenLabs */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Flagship 1: ChatGPT Plus / Pro */}
            <div
              data-scroll="zoom"
              onMouseEnter={() => onPlayPop(580)}
              className="acrylic-frame acrylic-interactive rounded-[28px] p-2.5 flex flex-col justify-between bg-white/70"
            >
              <div className="plush-pillow plush-ai rounded-[22px] p-4 flex flex-col justify-between h-full space-y-4">
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="fluffy-orb w-12 h-12 bg-gradient-to-br from-emerald-500 via-teal-600 to-green-700 text-white flex items-center justify-center border-2 border-white shadow-md">
                      <RiOpenaiFill className="w-6 h-6 text-white" />
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-emerald-600 text-white text-[10px] font-extrabold shadow-sm">
                      🤖 MOST POPULAR AI
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base sm:text-lg font-extrabold text-slate-900">
                      ChatGPT Plus &amp; Pro (GPT-4o / o3)
                    </h3>
                    <p className="text-[11px] font-semibold text-emerald-900 mt-0.5">
                      Official OpenAI Plus access with image generation, voice &amp; coding.
                    </p>
                  </div>

                  <div className="space-y-1.5 pt-1 text-xs font-bold text-slate-800">
                    <div className="flex items-center gap-2">
                      <i className="fa-solid fa-circle-check text-emerald-600"></i>
                      <span>Unlimited GPT-4o, o3-mini &amp; Deep Research</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <i className="fa-solid fa-circle-check text-emerald-600"></i>
                      <span>DALL·E 3 HD Image &amp; File Analysis</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <i className="fa-solid fa-circle-check text-emerald-600"></i>
                      <span>Shared (Rs. 550) &amp; Private Mail (Rs. 2,200)</span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-emerald-900/10 flex items-center justify-between gap-2">
                  <div>
                    <span className="block text-[9px] font-extrabold uppercase text-slate-600">Starting From</span>
                    <span className="font-display font-bold text-lg text-emerald-800">Rs. 550 / mo</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => onSelectServiceById('chatgpt-plus')}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-extrabold text-xs shadow-md hover:scale-105 transition cursor-pointer flex items-center gap-1.5"
                  >
                    <SiWhatsapp className="w-3.5 h-3.5" />Get ChatGPT
                  </button>
                </div>
              </div>
            </div>

            {/* Flagship 2: Google Gemini 18-Month Pro */}
            <div
              data-scroll="zoom"
              onMouseEnter={() => onPlayPop(620)}
              className="scroll-delay-1 acrylic-frame acrylic-interactive rounded-[28px] p-2.5 flex flex-col justify-between bg-white/70"
            >
              <div className="plush-pillow plush-website rounded-[22px] p-4 flex flex-col justify-between h-full space-y-4">
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="fluffy-orb w-12 h-12 bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 text-white flex items-center justify-center border-2 border-white shadow-md">
                      <SiGooglegemini className="w-6 h-6 text-white" />
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-indigo-600 text-white text-[10px] font-extrabold shadow-sm">
                      ✨ 18 MONTHS + 2TB
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base sm:text-lg font-extrabold text-slate-900">
                      Google Gemini 18-Month Pro Plan
                    </h3>
                    <p className="text-[11px] font-semibold text-blue-900 mt-0.5">
                      Activated directly on your personal Gmail account with 2TB Cloud!
                    </p>
                  </div>

                  <div className="space-y-1.5 pt-1 text-xs font-bold text-slate-800">
                    <div className="flex items-center gap-2">
                      <i className="fa-solid fa-circle-check text-blue-600"></i>
                      <span>1.5 Years (18 Months) Official Validity</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <i className="fa-solid fa-circle-check text-blue-600"></i>
                      <span>2,000 GB (2TB) Google Drive &amp; Photos Storage</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <i className="fa-solid fa-circle-check text-blue-600"></i>
                      <span>Gemini Advanced in Docs, Gmail &amp; Veo Video</span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-blue-900/10 flex items-center justify-between gap-2">
                  <div>
                    <span className="block text-[9px] font-extrabold uppercase text-slate-600">18-Month Deal</span>
                    <span className="font-display font-bold text-lg text-indigo-800">Rs. 1,800 Only</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => onSelectServiceById('gemini-18m-pro')}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-extrabold text-xs shadow-md hover:scale-105 transition cursor-pointer flex items-center gap-1.5"
                  >
                    <SiWhatsapp className="w-3.5 h-3.5" />Get Gemini Pro
                  </button>
                </div>
              </div>
            </div>

            {/* Flagship 3: CapCut Pro, Lovable Pro & ElevenLabs */}
            <div
              data-scroll="zoom"
              onMouseEnter={() => onPlayPop(660)}
              className="scroll-delay-2 acrylic-frame acrylic-interactive rounded-[28px] p-2.5 flex flex-col justify-between bg-white/70"
            >
              <div className="plush-pillow plush-snap rounded-[22px] p-4 flex flex-col justify-between h-full space-y-4">
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="fluffy-orb w-12 h-12 bg-gradient-to-br from-pink-500 via-purple-600 to-slate-900 text-white flex items-center justify-center border-2 border-white shadow-md">
                      <FaScissors className="w-5 h-5 text-white" />
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-pink-600 text-white text-[10px] font-extrabold shadow-sm">
                      🔥 CREATOR BUNDLE
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base sm:text-lg font-extrabold text-slate-900">
                      CapCut Pro, Lovable &amp; ElevenLabs
                    </h3>
                    <p className="text-[11px] font-semibold text-purple-900 mt-0.5">
                      Complete toolkit for TikTok/YouTube creators &amp; AI developers.
                    </p>
                  </div>

                  <div className="space-y-1.5 pt-1 text-xs font-bold text-slate-800">
                    <div className="flex items-center gap-2">
                      <i className="fa-solid fa-circle-check text-purple-600"></i>
                      <span>CapCut Pro (iOS/Android/PC) — Rs. 350</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <i className="fa-solid fa-circle-check text-purple-600"></i>
                      <span>Lovable Pro AI Builder &amp; Claude 3.7 Pro</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <i className="fa-solid fa-circle-check text-purple-600"></i>
                      <span>ElevenLabs 300k Credits (No Expiry) &amp; Muse 1B</span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-purple-900/10 flex items-center justify-between gap-2">
                  <div>
                    <span className="block text-[9px] font-extrabold uppercase text-slate-600">CapCut Pro</span>
                    <span className="font-display font-bold text-lg text-purple-900">Rs. 350 / mo</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => onSelectServiceById('capcut-pro')}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 text-white font-extrabold text-xs shadow-md hover:scale-105 transition cursor-pointer flex items-center gap-1.5"
                  >
                    <SiWhatsapp className="w-3.5 h-3.5" />Order Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== DYNAMIC EDITORIAL SHOWCASE BANNERS (SPOTLIGHTS #1, #2, & CUSTOM) ==================== */}
      {activeBanners.map((banner, bannerIdx) => {
        const isImageLeft = banner.layout === 'image-left';

        // Theme plush background mapping
        const plushClass =
          banner.themeStyle === 'sim-search'
            ? 'plush-sim-search'
            : banner.themeStyle === 'about'
            ? 'plush-about'
            : banner.themeStyle === 'hero'
            ? 'plush-hero'
            : banner.themeStyle === 'contact'
            ? 'plush-contact'
            : banner.themeStyle === 'dark-neon'
            ? 'space-navy-box !text-white'
            : 'plush-capcut';

        const imageCol = (
          <div
            data-scroll={isImageLeft ? 'left' : 'right'}
            onMouseEnter={() => onPlayPop(560 + bannerIdx * 30)}
            className={`lg:col-span-5 relative rounded-[24px] overflow-hidden border-2 border-white shadow-xl bg-slate-950 group ${
              isImageLeft ? 'order-1 lg:order-1' : 'order-1 lg:order-2'
            }`}
          >
            {/* High-Resolution Featured Blog Image */}
            <div className="relative h-64 sm:h-72 w-full overflow-hidden">
              <img
                src={banner.imageUrl}
                alt={banner.imageAlt || banner.title}
                loading="lazy"
                decoding="async"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent"></div>

              {/* Top Floating Badges */}
              {(banner.topBadgeLeft || banner.topBadgeRight) && (
                <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between gap-2">
                  {banner.topBadgeLeft && (
                    <span className="px-3 py-1 rounded-full bg-slate-900/80 backdrop-blur-md border border-white/30 text-[10px] font-extrabold tracking-wider uppercase text-amber-300 shadow">
                      {banner.topBadgeLeft}
                    </span>
                  )}
                  {banner.topBadgeRight && (
                    <span className="px-2.5 py-1 rounded-full bg-rose-600/90 text-white text-[10px] font-mono-code font-extrabold shadow">
                      {banner.topBadgeRight}
                    </span>
                  )}
                </div>
              )}

              {/* Bottom Overlay Pills */}
              {banner.pills && banner.pills.length > 0 && (
                <div className="absolute bottom-3.5 left-3.5 right-3.5 space-y-2">
                  {banner.pills.map((pill) => (
                    <div
                      key={pill.id}
                      className="bg-slate-900/80 backdrop-blur-md rounded-2xl p-2.5 border border-white/25 flex items-center justify-between gap-2"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div
                          className={`w-9 h-9 rounded-xl bg-gradient-to-br ${
                            pill.grad || 'from-rose-500 to-pink-600'
                          } flex items-center justify-center text-white text-base shadow flex-shrink-0`}
                        >
                          <i className={pill.icon}></i>
                        </div>
                        <div className="min-w-0">
                          <div className="text-xs font-extrabold text-white truncate">
                            {pill.title}
                          </div>
                          <div className="text-[10px] text-emerald-300 font-bold truncate">
                            {pill.sub}
                          </div>
                        </div>
                      </div>
                      {pill.tag && (
                        <span className="font-mono-code font-bold text-xs text-amber-300 bg-amber-400/20 px-2 py-0.5 rounded-lg border border-amber-300/30 whitespace-nowrap flex-shrink-0">
                          {pill.tag}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        );

        const textCol = (
          <div
            data-scroll={isImageLeft ? 'right' : 'left'}
            className={`lg:col-span-7 space-y-3.5 text-center lg:text-left ${
              isImageLeft ? 'order-2 lg:order-2' : 'order-2 lg:order-1'
            }`}
          >
            {(banner.badgeCategory || banner.subtitleInfo) && (
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 text-xs font-bold text-rose-700">
                {banner.badgeCategory && (
                  <span
                    className={`px-2.5 py-0.5 rounded-full font-extrabold text-[10px] ${
                      banner.badgeCategoryColor || 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    {banner.badgeCategory}
                  </span>
                )}
                {banner.subtitleInfo && (
                  <span className="text-slate-600">{banner.subtitleInfo}</span>
                )}
              </div>
            )}

            <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 leading-snug">
              {banner.title}
            </h3>

            {banner.paragraph1 && (
              <p className="text-xs sm:text-sm font-medium text-slate-700 leading-relaxed whitespace-pre-line">
                {banner.paragraph1}
              </p>
            )}

            {banner.paragraph2 && (
              <p className="text-xs sm:text-sm font-medium text-slate-700 leading-relaxed whitespace-pre-line">
                {banner.paragraph2}
              </p>
            )}

            {/* Action Buttons */}
            {banner.buttons && banner.buttons.length > 0 && (
              <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-2.5">
                {banner.buttons.map((btn, bIdx) => {
                  const btnClass =
                    btn.variant === 'primary'
                      ? 'bg-gradient-to-r from-rose-500 to-pink-600 text-white font-extrabold text-xs shadow-md hover:scale-105'
                      : btn.variant === 'emerald'
                      ? 'bg-white hover:bg-emerald-50 text-emerald-800 border border-emerald-300 font-extrabold text-xs shadow-sm hover:scale-105'
                      : btn.variant === 'amber'
                      ? 'bg-gradient-to-r from-amber-500 to-yellow-600 text-slate-950 font-extrabold text-xs shadow-md hover:scale-105'
                      : 'bg-white hover:bg-pink-50 text-slate-900 border border-indigo-200 font-extrabold text-xs shadow-sm hover:scale-105';

                  return (
                    <button
                      key={bIdx}
                      type="button"
                      onClick={() => {
                        onPlayPop(640);
                        if (btn.actionType === 'service') {
                          onSelectServiceById(btn.targetValue);
                        } else if (btn.actionType === 'category') {
                          onQuickFilter(btn.targetValue, '');
                        } else if (btn.actionType === 'whatsapp') {
                          const wa = (primaryWaNumber || '923478936242').replace(/[^0-9]/g, '');
                          const msg = encodeURIComponent(
                            btn.targetValue || 'Assalam-o-Alaikum! Mujhe details chahiye.'
                          );
                          window.open(`https://wa.me/${wa}?text=${msg}`, '_blank');
                        } else if (btn.actionType === 'url') {
                          window.open(btn.targetValue, '_blank');
                        } else {
                          onSelectServiceById(btn.targetValue);
                        }
                      }}
                      className={`px-4 py-2.5 rounded-full transition cursor-pointer flex items-center gap-1.5 ${btnClass}`}
                    >
                      {btn.icon && <i className={`${btn.icon} mr-0.5`}></i>}
                      <span>{btn.label}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        );

        return (
          <section
            key={banner.id}
            data-scroll="up"
            className="acrylic-frame rounded-[34px] p-3 sm:p-4 content-visibility-auto"
          >
            <div className={`plush-pillow ${plushClass} rounded-[26px] p-4 sm:p-6`}>
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                {isImageLeft ? (
                  <>
                    {imageCol}
                    {textCol}
                  </>
                ) : (
                  <>
                    {textCol}
                    {imageCol}
                  </>
                )}
              </div>
            </div>
          </section>
        );
      })}

      {/* ==================== SECTION 4: 1 - 2 - 3 HOW IT WORKS (EASY 3-STEP ORDER FLOW) ==================== */}
      <section data-scroll="up" className="space-y-3.5">
        <div className="text-center space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-white/80 border border-white text-[10px] font-extrabold text-pink-600 shadow-sm">
            <i className="fa-solid fa-bolt text-amber-500"></i> SUPER EASY 3-STEP PROCESS
          </div>
          <h2 className="text-xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            How To Order Any Service in <span className="text-pink-600 font-display">1 – 2 – 3 Steps</span> 🚀
          </h2>
          <p className="text-xs sm:text-sm font-semibold text-slate-700 max-w-xl mx-auto">
            No complicated forms or credit cards needed—get your account, boost, or report on WhatsApp in 5 minutes!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* STEP 1 */}
          <div
            data-scroll="zoom"
            onMouseEnter={() => onPlayPop(540)}
            className="acrylic-frame acrylic-interactive rounded-[30px] p-2.5 relative"
          >
            <div className="plush-pillow plush-srv-1 rounded-[24px] p-5 h-full flex flex-col justify-between space-y-3">
              <div className="flex items-center justify-between">
                <div className="fluffy-orb w-12 h-12 bg-gradient-to-br from-pink-500 to-rose-600 text-white font-display font-bold text-xl flex items-center justify-center border-2 border-white shadow-lg">
                  1
                </div>
                <span className="px-3 py-1 rounded-full bg-white/85 border border-white text-[10px] font-extrabold text-rose-700 uppercase">
                  STEP 01 • CHOOSE
                </span>
              </div>
              <div className="space-y-1">
                <h3 className="text-base sm:text-lg font-extrabold text-slate-900">
                  1. Select Your Package
                </h3>
                <p className="text-xs font-medium text-slate-700 leading-relaxed">
                  Browse our 31+ services (ChatGPT Plus, Gemini 18M, CapCut Pro, TikTok Likes, or SIM/NADRA Info), pick your package tier, and click <strong>Buy Now</strong>.
                </p>
              </div>
              <div className="pt-2 border-t border-rose-900/10 flex items-center gap-1.5 text-[11px] font-extrabold text-rose-700">
                <i className="fa-solid fa-hand-pointer"></i>
                <span>Takes only 10 seconds</span>
              </div>
            </div>
          </div>

          {/* STEP 2 */}
          <div
            data-scroll="zoom"
            onMouseEnter={() => onPlayPop(600)}
            className="scroll-delay-1 acrylic-frame acrylic-interactive rounded-[30px] p-2.5 relative"
          >
            <div className="plush-pillow plush-srv-4 rounded-[24px] p-5 h-full flex flex-col justify-between space-y-3">
              <div className="flex items-center justify-between">
                <div className="fluffy-orb w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-display font-bold text-xl flex items-center justify-center border-2 border-white shadow-lg">
                  2
                </div>
                <span className="px-3 py-1 rounded-full bg-white/85 border border-white text-[10px] font-extrabold text-blue-700 uppercase">
                  STEP 02 • PAYMENT
                </span>
              </div>
              <div className="space-y-1">
                <h3 className="text-base sm:text-lg font-extrabold text-slate-900">
                  2. Pay via EasyPaisa / JazzCash
                </h3>
                <p className="text-xs font-medium text-slate-700 leading-relaxed">
                  Your order opens directly in <strong>{brandOwner}&apos;s WhatsApp ({primaryWaNumber || '+92 347 8936242'})</strong>. Send payment via EasyPaisa, JazzCash, SadaPay, Bank, or USDT.
                </p>
              </div>
              <div className="pt-2 border-t border-blue-900/10 flex items-center gap-1.5 text-[11px] font-extrabold text-blue-700">
                <i className="fa-solid fa-shield-halved"></i>
                <span>100% Safe &amp; Verified Accounts</span>
              </div>
            </div>
          </div>

          {/* STEP 3 */}
          <div
            data-scroll="zoom"
            onMouseEnter={() => onPlayPop(660)}
            className="scroll-delay-2 acrylic-frame acrylic-interactive rounded-[30px] p-2.5 relative"
          >
            <div className="plush-pillow plush-srv-3 rounded-[24px] p-5 h-full flex flex-col justify-between space-y-3">
              <div className="flex items-center justify-between">
                <div className="fluffy-orb w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 text-white font-display font-bold text-xl flex items-center justify-center border-2 border-white shadow-lg">
                  3
                </div>
                <span className="px-3 py-1 rounded-full bg-white/85 border border-white text-[10px] font-extrabold text-emerald-700 uppercase">
                  STEP 03 • DELIVERY
                </span>
              </div>
              <div className="space-y-1">
                <h3 className="text-base sm:text-lg font-extrabold text-slate-900">
                  3. Instant 5-Minute Delivery
                </h3>
                <p className="text-xs font-medium text-slate-700 leading-relaxed">
                  Within <strong>5 to 15 minutes</strong>, receive your Pro login credentials, Gmail activation, viral SMM boost, or confidential PDF report with full warranty!
                </p>
              </div>
              <div className="pt-2 border-t border-emerald-900/10 flex items-center gap-1.5 text-[11px] font-extrabold text-emerald-800">
                <i className="fa-solid fa-circle-check"></i>
                <span>Full Period Warranty Included</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== SECTION 5: 100% TRUSTED SELLER & VERIFIED REVIEWS PROOF ==================== */}
      <section data-scroll="up" className="acrylic-frame rounded-[34px] p-3 sm:p-5 space-y-4 content-visibility-auto relative">
        <div className="plush-pillow plush-hero rounded-[26px] p-4 sm:p-6 space-y-5">
          {/* Top Trust Shield Header */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-b border-pink-200/80 pb-4 text-center md:text-left">
            <div className="flex flex-col sm:flex-row items-center gap-3.5">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center text-2xl shadow-lg border-2 border-white flex-shrink-0">
                <i className="fa-solid fa-shield-check"></i>
              </div>
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-extrabold border border-emerald-300">
                  <i className="fa-solid fa-certificate"></i> 100% VERIFIED PAKISTANI DIGITAL STORE
                </div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-0.5">
                  Why 18,500+ Creators &amp; Clients Trust {brandOwner}
                </h2>
                <p className="text-xs font-semibold text-slate-700">
                  Real WhatsApp Deal History • Zero Scam Guarantee • Instant Replacement Warranty
                </p>
              </div>
            </div>

            {/* Right Buttons: Rating Summary Box + Write a Review Button */}
            <div className="flex flex-wrap items-center justify-center md:justify-end gap-2.5 flex-shrink-0">
              <div className="bg-white/85 px-4 py-2.5 rounded-2xl border border-white shadow-sm text-center flex-shrink-0">
                <div className="text-amber-500 text-sm tracking-wider">
                  <i className="fa-solid fa-star"></i>
                  <i className="fa-solid fa-star"></i>
                  <i className="fa-solid fa-star"></i>
                  <i className="fa-solid fa-star"></i>
                  <i className="fa-solid fa-star"></i>
                </div>
                <div className="text-xs font-extrabold text-slate-900 mt-0.5">4.98 / 5.0 Rating</div>
                <div className="text-[10px] font-bold text-emerald-700">Based on 3,400+ WA Reviews</div>
              </div>

              <button
                type="button"
                onClick={() => {
                  if (onPlayPop) onPlayPop(550);
                  setShowWriteModal(true);
                }}
                className="px-3.5 py-2.5 rounded-2xl bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 hover:from-pink-600 hover:to-indigo-700 text-white font-extrabold text-xs shadow-md hover:scale-105 transition flex items-center gap-1.5 cursor-pointer"
              >
                <i className="fa-solid fa-pen-to-square"></i>
                <span>Write a Review</span>
              </button>
            </div>
          </div>

          {/* 4 Trust Pillars Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div className="bg-white/80 p-3 rounded-2xl border border-white text-center space-y-1 shadow-sm">
              <i className="fa-solid fa-award text-pink-600 text-lg"></i>
              <div className="text-xs font-extrabold text-slate-900">Full Warranty</div>
              <div className="text-[10px] font-semibold text-slate-600">Instant replacement if any issue</div>
            </div>
            <div className="bg-white/80 p-3 rounded-2xl border border-white text-center space-y-1 shadow-sm">
              <i className="fa-solid fa-lock text-emerald-600 text-lg"></i>
              <div className="text-xs font-extrabold text-slate-900">No Password Needed</div>
              <div className="text-[10px] font-semibold text-slate-600">Only link/username for SMM</div>
            </div>
            <div className="bg-white/80 p-3 rounded-2xl border border-white text-center space-y-1 shadow-sm">
              <i className="fa-solid fa-user-shield text-blue-600 text-lg"></i>
              <div className="text-xs font-extrabold text-slate-900">100% Privacy</div>
              <div className="text-[10px] font-semibold text-slate-600">Confidential SIM &amp; CDR reports</div>
            </div>
            <div className="bg-white/80 p-3 rounded-2xl border border-white text-center space-y-1 shadow-sm">
              <i className="fa-brands fa-whatsapp text-teal-600 text-lg"></i>
              <div className="text-xs font-extrabold text-slate-900">Live WA Support</div>
              <div className="text-[10px] font-semibold text-slate-600">Direct chat with {brandOwner}</div>
            </div>
          </div>

          {/* Verified Client Testimonials Infinite Continuous Marquee (Left & Right Scrolling) */}
          {(() => {
            const effectiveReviews = reviews && reviews.length > 0 ? reviews : DEFAULT_REVIEWS;
            const row1 = effectiveReviews.filter((_: any, i: number) => i % 2 === 0);
            const row2 = effectiveReviews.filter((_: any, i: number) => i % 2 !== 0);
            const safeRow1 = row1.length > 0 ? row1 : effectiveReviews;
            const safeRow2 = row2.length > 0 ? row2 : effectiveReviews;

            return (
              <div className="space-y-4 pt-2">
                <div className="space-y-3 overflow-hidden marquee-wrapper pt-1 pb-1">
                  {/* Row 1: Left-scrolling Reviews */}
                  <div className="marquee-track-left gap-3.5">
                    {[...safeRow1, ...safeRow1, ...safeRow1].map((rev: any, idx: number) => {
                      const name = rev.name || 'Verified Client';
                      const initials =
                        name
                          .split(' ')
                          .filter(Boolean)
                          .map((w: string) => w[0])
                          .slice(0, 2)
                          .join('')
                          .toUpperCase() || 'VC';
                      const ratingCount = Math.max(1, Math.min(5, Number(rev.rating) || 5));
                      const stars = '★'.repeat(ratingCount);

                      return (
                        <div
                          key={`rev-row1-${rev.id || idx}-${idx}`}
                          className="w-[280px] sm:w-[350px] bg-white/90 backdrop-blur-md p-4 rounded-2xl border border-white/90 shadow-sm hover:shadow-md transition flex flex-col justify-between space-y-3 flex-shrink-0 text-left select-none"
                        >
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-amber-500 text-xs tracking-wider font-black">{stars}</span>
                              {rev.verified !== false ? (
                                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[9px] font-extrabold flex items-center gap-1">
                                  <i className="fa-solid fa-circle-check text-emerald-600"></i> Verified Buyer ✓
                                </span>
                              ) : (
                                <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[9px] font-extrabold">
                                  Customer Review
                                </span>
                              )}
                            </div>
                            <p className="text-xs font-medium text-slate-700 leading-relaxed line-clamp-3">
                              &ldquo;{rev.comment}&rdquo;
                            </p>
                          </div>

                          <div className="flex items-center gap-2.5 pt-2 border-t border-pink-100/80">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-500 via-purple-600 to-indigo-600 text-white font-black text-xs flex items-center justify-center flex-shrink-0 shadow-sm">
                              {initials}
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="text-xs font-extrabold text-slate-900 truncate">{name}</div>
                              <div className="text-[10px] font-bold text-pink-600 truncate">{rev.service || 'Verified Service'}</div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Row 2: Right-scrolling Reviews */}
                  <div className="marquee-track-right gap-3.5">
                    {[...safeRow2, ...safeRow2, ...safeRow2].map((rev: any, idx: number) => {
                      const name = rev.name || 'Verified Client';
                      const initials =
                        name
                          .split(' ')
                          .filter(Boolean)
                          .map((w: string) => w[0])
                          .slice(0, 2)
                          .join('')
                          .toUpperCase() || 'VC';
                      const ratingCount = Math.max(1, Math.min(5, Number(rev.rating) || 5));
                      const stars = '★'.repeat(ratingCount);

                      return (
                        <div
                          key={`rev-row2-${rev.id || idx}-${idx}`}
                          className="w-[280px] sm:w-[350px] bg-white/90 backdrop-blur-md p-4 rounded-2xl border border-white/90 shadow-sm hover:shadow-md transition flex flex-col justify-between space-y-3 flex-shrink-0 text-left select-none"
                        >
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-amber-500 text-xs tracking-wider font-black">{stars}</span>
                              {rev.verified !== false ? (
                                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[9px] font-extrabold flex items-center gap-1">
                                  <i className="fa-solid fa-circle-check text-emerald-600"></i> Verified Buyer ✓
                                </span>
                              ) : (
                                <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[9px] font-extrabold">
                                  Customer Review
                                </span>
                              )}
                            </div>
                            <p className="text-xs font-medium text-slate-700 leading-relaxed line-clamp-3">
                              &ldquo;{rev.comment}&rdquo;
                            </p>
                          </div>

                          <div className="flex items-center gap-2.5 pt-2 border-t border-pink-100/80">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 via-sky-600 to-emerald-600 text-white font-black text-xs flex items-center justify-center flex-shrink-0 shadow-sm">
                              {initials}
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="text-xs font-extrabold text-slate-900 truncate">{name}</div>
                              <div className="text-[10px] font-bold text-indigo-600 truncate">{rev.service || 'Verified Service'}</div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Subtext info */}
                <div className="flex items-center justify-center gap-2 text-center text-[11px] font-bold text-slate-500 pt-1">
                  <i className="fa-solid fa-circle-info text-pink-500"></i>
                  <span>Hover or touch any review to pause • Real WhatsApp deal history</span>
                </div>
              </div>
            );
          })()}
        </div>

        {/* ==================== INTERACTIVE WRITE A REVIEW MODAL ==================== */}
        {showWriteModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-3xl p-5 sm:p-6 w-full max-w-md shadow-2xl border border-pink-100 space-y-4 relative">
              {/* Close Button */}
              <button
                type="button"
                onClick={() => setShowWriteModal(false)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 flex items-center justify-center text-xs font-bold transition cursor-pointer"
              >
                ✕
              </button>

              <div className="space-y-1 text-center sm:text-left">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-pink-100 text-pink-700 text-[10px] font-extrabold">
                  <i className="fa-solid fa-star"></i> VERIFIED CLIENT FEEDBACK
                </div>
                <h3 className="text-lg font-extrabold text-slate-900">Share Your Experience</h3>
                <p className="text-xs text-slate-600">
                  Your feedback helps other creators and clients choose genuine services.
                </p>
              </div>

              <form onSubmit={handleSubmitReview} className="space-y-3.5 pt-1">
                {/* Name & City */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Your Name &amp; City:
                  </label>
                  <input
                    type="text"
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    placeholder="e.g. Ali Raza — Lahore"
                    required
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500"
                  />
                </div>

                {/* Service */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Service Purchased / Used:
                  </label>
                  <input
                    type="text"
                    value={selectedService}
                    onChange={(e) => setSelectedService(e.target.value)}
                    placeholder="e.g. CapCut Pro 1 Year, Gemini 18M, TikTok UK"
                    required
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500"
                  />
                </div>

                {/* Rating Selector */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Your Rating:
                  </label>
                  <div className="flex items-center gap-1.5">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => {
                          if (onPlayPop) onPlayPop(400 + s * 50);
                          setRating(s);
                        }}
                        className={`text-2xl transition-transform hover:scale-125 cursor-pointer ${
                          s <= rating ? 'text-amber-400' : 'text-slate-300'
                        }`}
                      >
                        ★
                      </button>
                    ))}
                    <span className="ml-2 text-xs font-bold text-slate-700">
                      {rating === 5 ? '5/5 — 100% Exceptional' : `${rating}/5 Stars`}
                    </span>
                  </div>
                </div>

                {/* Review Comment */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Your Review Feedback:
                  </label>
                  <textarea
                    rows={3}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder={`Share your genuine experience with ${brandOwner} (e.g. delivery time, account quality, support)...`}
                    required
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 resize-none"
                  />
                </div>

                {/* Submit & Cancel Buttons */}
                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowWriteModal(false)}
                    className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-5 py-2 rounded-xl bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 hover:from-pink-600 hover:to-indigo-700 text-white font-extrabold text-xs shadow-md transition hover:scale-105 cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <i className="fa-solid fa-spinner fa-spin"></i>
                        <span>Submitting...</span>
                      </>
                    ) : (
                      <>
                        <i className="fa-solid fa-paper-plane"></i>
                        <span>Submit Review</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </section>
    </div>
  );
};
