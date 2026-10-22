'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export function PwaInstallPrompt() {
  const pathname = usePathname();
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [isInstalled, setIsInstalled] = useState<boolean>(false);
  const [isIos, setIsIos] = useState<boolean>(false);
  const [showIosGuide, setShowIosGuide] = useState<boolean>(false);
  const [showFloatingPill, setShowFloatingPill] = useState<boolean>(false);
  const [pillDismissed, setPillDismissed] = useState<boolean>(false);

  useEffect(() => {
    // 1. Register Service Worker
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register('/sw.js')
          .then((registration) => {
            console.log('[PWA] ServiceWorker registered with scope:', registration.scope);
          })
          .catch((error) => {
            console.warn('[PWA] ServiceWorker registration failed:', error);
          });
      });
    }

    // 2. Check if already running in standalone / installed PWA mode
    if (typeof window !== 'undefined') {
      const isStandalone =
        window.matchMedia('(display-mode: standalone)').matches ||
        (window.navigator as unknown as { standalone?: boolean }).standalone === true ||
        document.referrer.includes('android-app://');

      if (isStandalone) {
        setIsInstalled(true);
        return; // Don't show prompts if already installed
      }

      // Check iOS device
      const userAgent = window.navigator.userAgent.toLowerCase();
      const isIosDevice = /iphone|ipad|ipod/.test(userAgent) && !(window as unknown as { MSStream?: unknown }).MSStream;
      setIsIos(isIosDevice);

      // Check if user dismissed recently (within 48 hours)
      const lastDismissed = localStorage.getItem('saqib_pwa_dismissed');
      const isRecentlyDismissed =
        lastDismissed && Date.now() - parseInt(lastDismissed, 10) < 48 * 60 * 60 * 1000;

      // 3. Listen for browser native install prompt
      const handleBeforeInstallPrompt = (e: Event) => {
        e.preventDefault();
        const promptEvent = e as BeforeInstallPromptEvent;
        setDeferredPrompt(promptEvent);
        setShowFloatingPill(true);

        if (!isRecentlyDismissed) {
          // Trigger popup after 2.5 seconds so user first sees the site
          const timer = setTimeout(() => {
            setShowModal(true);
          }, 2500);
          return () => clearTimeout(timer);
        }
      };

      window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

      // Listen for app installed event
      const handleAppInstalled = () => {
        setIsInstalled(true);
        setShowModal(false);
        setShowFloatingPill(false);
        setDeferredPrompt(null);
        console.log('[PWA] App successfully installed!');
      };

      window.addEventListener('appinstalled', handleAppInstalled);

      // For iOS devices without beforeinstallprompt support:
      if (isIosDevice && !isRecentlyDismissed) {
        setShowFloatingPill(true);
        const timer = setTimeout(() => {
          setShowModal(true);
        }, 3000);
        return () => clearTimeout(timer);
      }

      return () => {
        window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        window.removeEventListener('appinstalled', handleAppInstalled);
      };
    }
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      try {
        await deferredPrompt.prompt();
        const choice = await deferredPrompt.userChoice;
        if (choice.outcome === 'accepted') {
          console.log('[PWA] User accepted installation');
          setIsInstalled(true);
          setShowModal(false);
          setShowFloatingPill(false);
        } else {
          console.log('[PWA] User dismissed installation');
          localStorage.setItem('saqib_pwa_dismissed', Date.now().toString());
        }
      } catch (err) {
        console.error('[PWA] Prompt error:', err);
      }
      setDeferredPrompt(null);
    } else if (isIos) {
      setShowIosGuide(true);
    } else {
      // Fallback for browsers that don't trigger prompt event
      setShowModal(false);
      alert('To install: Tap your browser menu (⋮ or share icon) and select "Install app" or "Add to Home screen".');
    }
  };

  const handleDismiss = () => {
    setShowModal(false);
    setShowIosGuide(false);
    setShowFloatingPill(true);
    localStorage.setItem('saqib_pwa_dismissed', Date.now().toString());
  };

  // If already installed or neither modal nor floating pill is visible, render nothing
  if (isInstalled || (!showModal && !showFloatingPill)) {
    return null;
  }

  return (
    <>
      {/* ==================== 1. FLOATING QUICK INSTALL BUTTON (WITH DISMISS ✕) ==================== */}
      {!showModal && showFloatingPill && !pillDismissed && !pathname?.includes('saqibadmin') && (
        <div className="fixed bottom-6 left-6 z-[990] animate-bounce-subtle flex items-center gap-1.5">
          <button
            onClick={() => setShowModal(true)}
            aria-label="Install Sohaib Agency Web App"
            className="group flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-gradient-to-r from-cyan-500 via-purple-600 to-pink-500 text-white font-semibold text-xs sm:text-sm shadow-xl shadow-cyan-500/20 hover:shadow-cyan-500/40 hover:scale-105 active:scale-95 transition-all duration-300 border border-white/20 backdrop-blur-md cursor-pointer"
          >
            <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center group-hover:rotate-12 transition-transform">
              <i className="fa-solid fa-download text-xs text-white"></i>
            </div>
            <span>Install App</span>
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-300 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-100"></span>
            </span>
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setPillDismissed(true);
            }}
            title="Dismiss Install App badge"
            aria-label="Close Install App badge"
            className="w-7 h-7 rounded-full bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-white border border-white/25 flex items-center justify-center text-xs transition-all shadow-lg cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* ==================== 2. MAIN PWA INSTALL DOWNLOAD MODAL ==================== */}
      {showModal && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 sm:p-6 bg-black/75 backdrop-blur-md animate-fade-in">
          <div
            className="relative w-full max-w-md bg-gradient-to-b from-[#131a2e] via-[#0d1322] to-[#0a0e18] border border-cyan-500/30 rounded-3xl p-6 sm:p-7 shadow-2xl shadow-cyan-500/10 text-white overflow-hidden animate-scale-up"
            role="dialog"
            aria-modal="true"
          >
            {/* Ambient Cyber Light Effects */}
            <div className="absolute -top-24 -left-24 w-48 h-48 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-pink-500/20 rounded-full blur-3xl pointer-events-none"></div>

            {/* Close / Dismiss Button */}
            <button
              onClick={handleDismiss}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-gray-400 hover:text-white flex items-center justify-center transition-all"
              aria-label="Close download popup"
            >
              <i className="fa-solid fa-xmark text-sm"></i>
            </button>

            {/* App Icon + Pulsing Ring */}
            <div className="flex flex-col items-center text-center mt-1">
              <div className="relative mb-4">
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-cyan-500 via-purple-500 to-pink-500 blur-md opacity-70 animate-pulse"></div>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/icons/icon-192.png"
                  alt="Sohaib Agency Hub App Icon"
                  className="relative w-20 h-20 rounded-2xl border border-white/20 shadow-lg object-cover"
                />
                <span className="absolute -bottom-1.5 -right-1.5 px-2 py-0.5 rounded-full bg-cyan-500 text-[10px] font-bold tracking-wider text-black uppercase shadow">
                  PRO
                </span>
              </div>

              {/* Title & Tagline */}
              <h3 className="text-xl sm:text-2xl font-extrabold tracking-tight bg-gradient-to-r from-white via-cyan-100 to-cyan-400 bg-clip-text text-transparent">
                Install Sohaib Agency App
              </h3>
              <p className="text-xs sm:text-sm text-gray-300 mt-1.5 max-w-xs leading-relaxed">
                Direct mobile &amp; desktop installation with 1-click access, instant loading, and zero app store required.
              </p>
            </div>

            {/* Benefits Feature Badges */}
            <div className="grid grid-cols-3 gap-2 my-5">
              <div className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-center">
                <i className="fa-solid fa-bolt-lightning text-cyan-400 text-sm mb-1"></i>
                <span className="text-[11px] font-bold text-gray-200">1-Sec Speed</span>
                <span className="text-[9px] text-gray-400">Cached Locally</span>
              </div>
              <div className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-center">
                <i className="fa-solid fa-wifi text-pink-400 text-sm mb-1"></i>
                <span className="text-[11px] font-bold text-gray-200">Offline Safe</span>
                <span className="text-[9px] text-gray-400">Always Ready</span>
              </div>
              <div className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-center">
                <i className="fa-solid fa-mobile-screen-button text-purple-400 text-sm mb-1"></i>
                <span className="text-[11px] font-bold text-gray-200">Zero MB</span>
                <span className="text-[9px] text-gray-400">Lightweight</span>
              </div>
            </div>

            {/* iOS Guide Section (When on iPhone/iPad) */}
            {isIos && showIosGuide ? (
              <div className="p-4 rounded-2xl bg-cyan-950/40 border border-cyan-500/30 mb-4 animate-fade-in">
                <h4 className="text-xs font-bold text-cyan-300 flex items-center gap-1.5 mb-2">
                  <i className="fa-brands fa-apple"></i> How to Install on iOS (Safari):
                </h4>
                <ol className="text-xs text-gray-300 space-y-1.5 list-decimal list-inside">
                  <li>
                    Tap the <strong className="text-white">Share</strong> button at the bottom of Safari (<i className="fa-solid fa-arrow-up-from-bracket text-cyan-400"></i>).
                  </li>
                  <li>
                    Scroll down and tap <strong className="text-white">&quot;Add to Home Screen&quot;</strong> (<i className="fa-regular fa-square-plus text-pink-400"></i>).
                  </li>
                  <li>
                    Tap <strong className="text-white">&quot;Add&quot;</strong> in top-right corner. Done! 🎉
                  </li>
                </ol>
              </div>
            ) : null}

            {/* Action Buttons */}
            <div className="flex flex-col gap-2.5 mt-2">
              <button
                onClick={handleInstallClick}
                className="w-full py-3.5 px-5 rounded-2xl bg-gradient-to-r from-cyan-500 via-indigo-600 to-pink-500 hover:from-cyan-400 hover:via-indigo-500 hover:to-pink-400 text-white font-bold text-sm tracking-wide shadow-lg shadow-cyan-500/25 active:scale-[0.98] transition-all flex items-center justify-center gap-2 group"
              >
                <i className="fa-solid fa-download group-hover:translate-y-0.5 transition-transform"></i>
                <span>Download &amp; Install App Now</span>
              </button>

              <button
                onClick={handleDismiss}
                className="w-full py-2.5 text-xs text-gray-400 hover:text-gray-200 transition-colors"
              >
                Maybe Later (Continue on Web)
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default PwaInstallPrompt;
