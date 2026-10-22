'use client';

import React, { useState, useEffect, useRef } from 'react';
import { FaWhatsapp, FaPaperPlane } from 'react-icons/fa';
import { IoClose } from 'react-icons/io5';
import { SiteSettingsConfig } from '@/src/types/siteConfig';

interface WhatsAppChatWidgetProps {
  siteConfig: SiteSettingsConfig;
  siteLang: 'en' | 'ur';
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
  onPlayPop?: (freq?: number) => void;
}

export function WhatsAppChatWidget({
  siteConfig,
  siteLang,
  isOpen,
  onToggle,
  onClose,
  onPlayPop
}: WhatsAppChatWidgetProps) {
  const [message, setMessage] = useState('');
  const [currentTime, setCurrentTime] = useState('12:00 PM');
  const inputRef = useRef<HTMLInputElement>(null);

  // Dynamic values with clean fallbacks
  const rawNumber = siteConfig?.contact?.whatsappNumberClean || '923478936242';
  const phoneNumber = rawNumber.replace(/[^0-9]/g, '');
  const widgetName =
    siteConfig?.contact?.whatsappWidgetName ||
    siteConfig?.banner?.mainTitle ||
    'Muhammad Saqib';

  const widgetAvatar =
    siteConfig?.contact?.whatsappWidgetAvatar ||
    siteConfig?.banner?.portraitUrl ||
    'https://testuisaqib.vercel.app/saqib-pic.png';

  const widgetStatus =
    siteConfig?.contact?.whatsappWidgetStatus ||
    (siteLang === 'ur'
      ? 'آن لائن • فوری جواب ~2 منٹ ⚡'
      : 'Online • Typically replies in ~2 mins ⚡');

  const brandOwner = siteConfig?.banner?.mainTitle?.trim() || 'Muhammad Saqib';
  const fullBrand = `${brandOwner} ${siteConfig?.banner?.highlightTitle?.trim() || ''}`.trim();

  const rawGreeting =
    siteLang === 'ur'
      ? (siteConfig?.contact?.whatsappWidgetGreetingUr ||
        'السلام علیکم! 👋 ثاقب ویژولز ہب میں خوش آمدید۔<br/>آج میں کیپ کٹ پرو، اے آئی ٹولز، ٹک ٹاک ایڈز یا نادرا سروسز میں آپ کی کیا مدد کر سکتا ہوں؟')
      : (siteConfig?.contact?.whatsappWidgetGreeting ||
        'Assalam-o-Alaikum! 👋 Welcome to <b>Sohaib Agency Hub</b>.<br/>How can I help you today with CapCut Pro, AI Tools, TikTok Ads or Franchise/NADRA records?');

  const defaultGreeting = rawGreeting
    .replace(/Saqib Visuals Hub/gi, fullBrand)
    .replace(/ثاقب ویژولز ہب/g, fullBrand)
    .replace(/Muhammad Saqib/gi, brandOwner);

  useEffect(() => {
    try {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      );
    } catch {
      // fallback
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 150);
    }
  }, [isOpen]);

  const handleSend = (textToSend?: string) => {
    const finalMsg = (textToSend || message).trim();
    if (!finalMsg) return;

    if (onPlayPop) onPlayPop(750);
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(finalMsg)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
    setMessage('');
    onClose();
  };

  const quickPrompts = [
    { label: '⚡ CapCut Pro', text: `Assalam-o-Alaikum ${brandOwner}! Mujhe CapCut Pro subscription chahiye, kya price hai?` },
    { label: '🤖 AI Tools', text: `Assalam-o-Alaikum ${brandOwner}! Mujhe ChatGPT / Claude / Gemini AI suite lena hai.` },
    { label: '📱 TikTok Ads', text: 'Assalam-o-Alaikum! Mujhe TikTok UK Agency Account & Verification chahiye.' },
    { label: '🪪 NADRA & SIM', text: 'Assalam-o-Alaikum! Mujhe SIM owner / CDR / NADRA record check karwana hai.' },
    { label: '💳 Add Balance', text: 'Assalam-o-Alaikum! Mujhe apne VIP wallet mein balance top-up karwana hai.' }
  ];

  return (
    <div className="fixed bottom-20 md:bottom-6 right-3 sm:right-6 z-50 flex flex-col items-end pointer-events-none">
      {/* ==================== WHATSAPP POPUP CHAT MODAL ==================== */}
      {isOpen && (
        <div
          className="pointer-events-auto mb-3 w-[calc(100vw-24px)] max-w-[340px] sm:w-[360px] bg-white rounded-[26px] shadow-2xl overflow-hidden border border-emerald-400/40 flex flex-col transition-all duration-300 origin-bottom-right animate-scaleUp"
          style={{
            boxShadow: '0 20px 50px -10px rgba(7, 94, 84, 0.35), 0 0 0 1px rgba(18, 140, 126, 0.15)'
          }}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-[#075e54] to-[#128c7e] text-white p-3.5 sm:p-4 flex items-center justify-between shadow-md">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="relative flex-shrink-0">
                {widgetAvatar ? (
                  <img
                    src={widgetAvatar}
                    alt={widgetName}
                    className="w-10 h-10 sm:w-11 sm:h-11 rounded-full object-cover border-2 border-white/40 shadow-sm"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src =
                        'https://testuisaqib.vercel.app/saqib-pic.png';
                    }}
                  />
                ) : (
                  <div className="w-10 h-10 sm:w-11 sm:h-11 bg-white/20 rounded-full flex items-center justify-center border-2 border-white/30">
                    <FaWhatsapp className="w-6 h-6 text-white" />
                  </div>
                )}
                <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-400 border-2 border-[#075e54] shadow-xs"></span>
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <h3 className="font-extrabold text-sm sm:text-base text-white truncate leading-tight">
                    {widgetName}
                  </h3>
                  <span className="text-[9px] bg-white/20 text-emerald-100 font-bold px-1.5 py-0.2 rounded-full uppercase">
                    Official
                  </span>
                </div>
                <p className="text-[11px] text-emerald-100 truncate flex items-center gap-1 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-ping inline-block"></span>
                  {widgetStatus}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                if (onPlayPop) onPlayPop(500);
                onClose();
              }}
              title="Close chat"
              className="text-white/80 hover:text-white hover:bg-white/20 w-8 h-8 rounded-full flex items-center justify-center transition-colors cursor-pointer flex-shrink-0"
            >
              <IoClose className="w-5 h-5" />
            </button>
          </div>

          {/* Chat Body */}
          <div
            className="p-3.5 h-64 overflow-y-auto space-y-2.5 flex flex-col justify-between"
            style={{
              backgroundColor: '#efeae2',
              backgroundImage:
                'radial-gradient(#cbd5e1 0.75px, transparent 0.75px), radial-gradient(#cbd5e1 0.75px, #efeae2 0.75px)',
              backgroundSize: '20px 20px',
              backgroundPosition: '0 0, 10px 10px'
            }}
          >
            <div className="space-y-2">
              {/* Date divider badge */}
              <div className="flex justify-center">
                <span className="bg-white/80 text-slate-500 text-[10px] font-bold px-3 py-0.5 rounded-full shadow-2xs">
                  {siteLang === 'ur' ? 'آج' : 'TODAY'}
                </span>
              </div>

              {/* Verified Sohaib Agency Incoming Bubble */}
              <div className="flex items-start gap-1.5">
                <div className="bg-white p-3 rounded-2xl rounded-tl-xs shadow-sm max-w-[90%] text-xs sm:text-[13px] text-slate-800 leading-relaxed border border-slate-200/50">
                  <div
                    dangerouslySetInnerHTML={{ __html: defaultGreeting }}
                    className="space-y-1 font-medium"
                  />
                  <div className="flex items-center justify-end gap-1 mt-1.5 text-[9.5px] text-slate-400 font-semibold">
                    <span>{currentTime}</span>
                    <span className="text-sky-500 font-bold">✓✓</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Action Interactive Chips */}
            <div className="pt-1">
              <div className="text-[10px] font-extrabold text-slate-600 mb-1 flex items-center gap-1">
                <span>💬 {siteLang === 'ur' ? 'فوری منتخب کریں:' : 'Tap to ask instantly:'}</span>
              </div>
              <div className="flex flex-wrap gap-1">
                {quickPrompts.map((p, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSend(p.text)}
                    className="text-[10px] sm:text-[10.5px] font-bold bg-white/95 hover:bg-emerald-50 text-slate-800 hover:text-emerald-700 border border-slate-200 hover:border-emerald-300 rounded-full px-2.5 py-1 shadow-2xs transition-all active:scale-95 cursor-pointer text-left"
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Input Area */}
          <div className="p-2.5 bg-[#f0f2f5] border-t border-slate-200 flex items-center gap-1.5">
            <input
              ref={inputRef}
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder={
                siteLang === 'ur'
                  ? 'اپنا میسج ٹائپ کریں...'
                  : 'Type your message to Saqib...'
              }
              className="flex-1 bg-white border border-slate-300/80 rounded-full px-3.5 py-2 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#25d366] focus:ring-2 focus:ring-[#25d366]/20 transition-all"
            />
            <button
              type="button"
              onClick={() => handleSend()}
              disabled={!message.trim()}
              title="Send to WhatsApp"
              className="w-9 h-9 bg-gradient-to-tr from-[#25d366] to-[#128c7e] text-white rounded-full flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-sm disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex-shrink-0"
            >
              <FaPaperPlane className="w-3.5 h-3.5 translate-x-[-1px] translate-y-[1px]" />
            </button>
          </div>
        </div>
      )}

      {/* ==================== FLOATING LAUNCHER BUTTON ==================== */}
      <button
        type="button"
        onClick={() => {
          if (onPlayPop) onPlayPop(isOpen ? 480 : 700);
          onToggle();
        }}
        title={isOpen ? 'Close WhatsApp Chat' : `Chat on WhatsApp with ${widgetName}`}
        aria-label="WhatsApp Chat Widget"
        className="pointer-events-auto relative w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-gradient-to-tr from-[#25d366] via-emerald-500 to-[#128c7e] text-white border-2 border-white shadow-xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all duration-300 cursor-pointer group"
      >
        <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-white animate-ping"></span>
        <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-300 border-2 border-white"></span>
        {isOpen ? (
          <IoClose className="w-7 h-7 text-white animate-fadeIn" />
        ) : (
          <FaWhatsapp className="w-7 h-7 sm:w-8 sm:h-8 text-white group-hover:rotate-12 transition-transform" />
        )}
      </button>
    </div>
  );
}
export default WhatsAppChatWidget;
