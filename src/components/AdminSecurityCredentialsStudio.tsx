'use client';

import React, { useState } from 'react';
import {
  FaShieldHalved,
  FaKey,
  FaUserShield,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaCheck,
  FaCopy,
  FaDatabase,
  FaArrowLeft,
  FaArrowRight,
  FaCircleCheck,
  FaCircleExclamation,
  FaRotateLeft,
  FaGlobe,
  FaPenToSquare
} from 'react-icons/fa6';
import { SiteSettingsConfig } from './AdminStepByStepSettingsHub';
import { AdminSubAdminManagerView } from './AdminSubAdminManagerView';

interface Props {
  siteConfig: SiteSettingsConfig;
  onUpdateSiteConfig?: React.Dispatch<React.SetStateAction<SiteSettingsConfig>>;
  playPopSound: (freq?: number) => void;
  showToast: (msg: string) => void;
  copyText: (text: string, msg?: string) => void;
  onReturnHome: () => void;
  onNavigateToScreen: (screen: any) => void;
  initialTab?: 'credentials' | 'subadmins' | 'website_identity' | 'domains' | 'sql_queries';
}

export const AdminSecurityCredentialsStudio: React.FC<Props> = ({
  siteConfig,
  playPopSound,
  showToast,
  copyText,
  onReturnHome,
  onNavigateToScreen,
  onUpdateSiteConfig,
  initialTab,
}) => {
  const [newDomainInput, setNewDomainInput] = useState('');
  const [activeTab, setActiveTab] = useState<'credentials' | 'subadmins' | 'website_identity' | 'domains' | 'sql_queries'>(
    initialTab || 'credentials'
  );

  // Form states
  const [currentPassword, setCurrentPassword] = useState('');
  const [newUsername, setNewUsername] = useState('saqib');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Password visibility toggles
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  // Status & loading
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Calculate password strength
  const getPasswordStrength = (pass: string) => {
    if (!pass) return { score: 0, label: 'Empty', color: 'bg-slate-700' };
    let score = 0;
    if (pass.length >= 6) score += 1;
    if (pass.length >= 10) score += 1;
    if (/[A-Z]/.test(pass) && /[a-z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;

    if (score <= 2) return { score: 1, label: 'Weak (Min 6 chars)', color: 'bg-rose-500' };
    if (score === 3 || score === 4) return { score: 2, label: 'Good & Secure', color: 'bg-amber-500' };
    return { score: 3, label: 'Super Strong PBKDF2 Vault', color: 'bg-emerald-500' };
  };

  const strength = getPasswordStrength(newPassword);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage(null);

    if (!currentPassword) {
      setStatusMessage({ type: 'error', text: 'Please enter your current admin password.' });
      playPopSound(250);
      return;
    }

    if (!newUsername.trim() || newUsername.trim().length < 3) {
      setStatusMessage({ type: 'error', text: 'New username must be at least 3 characters long.' });
      playPopSound(250);
      return;
    }

    if (!newPassword || newPassword.length < 6) {
      setStatusMessage({ type: 'error', text: 'New password must be at least 6 characters long.' });
      playPopSound(250);
      return;
    }

    if (newPassword !== confirmPassword) {
      setStatusMessage({ type: 'error', text: 'New password and Confirm password do not match.' });
      playPopSound(250);
      return;
    }

    setIsSubmitting(true);
    playPopSound(500);

    try {
      const res = await fetch('/api/admin/auth', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword,
          newUsername: newUsername.trim(),
          newPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setStatusMessage({
          type: 'error',
          text: data.error || 'Failed to update credentials. Please check your current password.',
        });
        playPopSound(200);
      } else {
        setStatusMessage({
          type: 'success',
          text: `🎉 ${data.message || 'Admin credentials updated successfully in Supabase!'}`,
        });
        showToast(`✅ Admin Credentials Updated: Username is now "${data.username || newUsername}"`);
        playPopSound(800);
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Network error';
      setStatusMessage({ type: 'error', text: `Connection error: ${msg}` });
      playPopSound(200);
    } finally {
      setIsSubmitting(false);
    }
  };

  const sqlWebsiteNameQuery = `-- 🏷️ CHANGE WEBSITE NAME & BRAND TITLE IN DATABASE
UPDATE public.site_config
SET config = jsonb_set(
  jsonb_set(
    jsonb_set(
      config,
      '{banner,mainTitle}',
      '"Muhammad Saqib"'
    ),
    '{banner,highlightTitle}',
    '"— Saqib Visuals"'
  ),
  '{footer,brandName}',
  '"🚀 Muhammad Saqib"'
)
WHERE id = 'default';`;

  const sqlResetAdminQuery = `-- 🔐 RESET ADMIN CREDENTIALS TO DEFAULT IN DATABASE
-- (Username: saqib | Password: saqibadmin)
UPDATE public.admin_vault
SET 
  password_hash = 'f195d908c20941fc855a591ebb1f51c35bfc901443149fe091cb7201c924dbf7c7e88e68c629b5dddc612e843e10a4d6dec320e0961c849699604be04c2074b7',
  salt = 'b9ab35f668716cb292036849d0d0b7a705e456f4d58a65c80f5c3f6459fc4ba2',
  iterations = 100000,
  algorithm = 'sha512',
  updated_at = now()
WHERE username = 'saqib';`;

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16">
      {/* Header bar */}
      <div className="bg-slate-900/80 border border-white/10 rounded-2xl p-4 sm:p-6 backdrop-blur-xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-rose-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-rose-500/20">
            <FaShieldHalved className="text-2xl" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black text-white tracking-wide">
                Admin Security & Credentials Vault
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                PBKDF2 SHA-512
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Change admin username, password, website name, and inspect direct SQL queries.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onReturnHome}
          className="px-3.5 py-2 rounded-xl text-xs font-bold text-slate-300 bg-white/5 hover:bg-white/10 border border-white/10 transition flex items-center gap-2"
        >
          <FaArrowLeft />
          <span>Back to Menu</span>
        </button>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="bg-slate-900/90 border border-white/15 rounded-2xl p-2 sm:p-2.5 backdrop-blur-2xl shadow-xl flex flex-wrap gap-2 sm:gap-2.5">
        <button
          type="button"
          onClick={() => {
            setActiveTab('credentials');
            playPopSound(450);
          }}
          className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'credentials'
              ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/40 ring-1 ring-white/30 scale-[1.02]'
              : 'bg-slate-800/95 hover:bg-slate-700 text-slate-200 hover:text-white border border-white/10 hover:border-white/25 shadow-sm'
          }`}
        >
          <FaKey className={activeTab === 'credentials' ? 'text-white' : 'text-rose-400'} />
          <span>Change Password & Username</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveTab('subadmins');
            playPopSound(450);
          }}
          className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'subadmins'
              ? 'bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500 text-white shadow-lg shadow-indigo-500/40 ring-1 ring-white/30 scale-[1.02]'
              : 'bg-slate-800/95 hover:bg-slate-700 text-slate-200 hover:text-white border border-white/10 hover:border-white/25 shadow-sm'
          }`}
        >
          <FaUserShield className={activeTab === 'subadmins' ? 'text-white' : 'text-indigo-400'} />
          <span>👥 Add & Manage Sub-Admins</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveTab('website_identity');
            playPopSound(450);
          }}
          className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'website_identity'
              ? 'bg-sky-500 text-slate-950 shadow-lg shadow-sky-500/40 ring-1 ring-white/30 scale-[1.02]'
              : 'bg-slate-800/95 hover:bg-slate-700 text-slate-200 hover:text-white border border-white/10 hover:border-white/25 shadow-sm'
          }`}
        >
          <FaGlobe className={activeTab === 'website_identity' ? 'text-slate-950' : 'text-sky-400'} />
          <span>Website Name & Brand Identity</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveTab('domains');
            playPopSound(450);
          }}
          className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'domains'
              ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/40 ring-1 ring-white/30 scale-[1.02]'
              : 'bg-slate-800/95 hover:bg-slate-700 text-slate-200 hover:text-white border border-white/10 hover:border-white/25 shadow-sm'
          }`}
        >
          <FaShieldHalved className={activeTab === 'domains' ? 'text-slate-950' : 'text-amber-400'} />
          <span>Anti-Clone Whitelist Domains</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveTab('sql_queries');
            playPopSound(450);
          }}
          className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'sql_queries'
              ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/40 ring-1 ring-white/30 scale-[1.02]'
              : 'bg-slate-800/95 hover:bg-slate-700 text-slate-200 hover:text-white border border-white/10 hover:border-white/25 shadow-sm'
          }`}
        >
          <FaDatabase className={activeTab === 'sql_queries' ? 'text-slate-950' : 'text-emerald-400'} />
          <span>Master SQL Cheat-Sheet</span>
        </button>
      </div>

      {/* TAB 1: CHANGE CREDENTIALS */}
      {activeTab === 'credentials' && (
        <div className="bg-slate-900/95 border border-white/15 rounded-2xl p-5 sm:p-7 backdrop-blur-2xl shadow-2xl">
          <div className="flex items-center gap-2.5 mb-3">
            <div className="w-8 h-8 rounded-lg bg-rose-500/20 text-rose-400 flex items-center justify-center">
              <FaUserShield className="text-base" />
            </div>
            <h3 className="text-base sm:text-lg font-black text-white">Update Admin Login Credentials</h3>
          </div>
          <p className="text-xs sm:text-sm text-slate-300 mb-6 leading-relaxed">
            Naye username aur password ko yahan enter karein. Server automatically ise 100,000 rounds of PBKDF2 SHA-512 cryptographic salt ke sath encrypt karke Supabase table <code className="text-rose-300 bg-black/60 px-2 py-0.5 rounded font-mono">admin_vault</code> mein store kar dega.
          </p>

          {statusMessage && (
            <div
              className={`p-4 rounded-xl text-xs font-bold mb-6 flex items-start gap-3 border ${
                statusMessage.type === 'success'
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                  : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
              }`}
            >
              {statusMessage.type === 'success' ? (
                <FaCircleCheck className="text-base shrink-0 mt-0.5" />
              ) : (
                <FaCircleExclamation className="text-base shrink-0 mt-0.5" />
              )}
              <span>{statusMessage.text}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5 max-w-xl">
            {/* Current Password */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                Current Admin Password <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <input
                  type={showCurrentPass ? 'text' : 'password'}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter your current password (e.g. saqibadmin)"
                  className="w-full bg-slate-950/80 border border-white/15 focus:border-rose-500 focus:ring-1 focus:ring-rose-500 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 pr-10 outline-none transition"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPass(!showCurrentPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1 text-xs"
                >
                  {showCurrentPass ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            {/* New Username */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                New Admin Username <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_.-]/g, ''))}
                placeholder="e.g. saqib or admin"
                className="w-full bg-slate-950/80 border border-white/15 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 outline-none transition"
                required
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                Lowercase letters, numbers, and hyphens only (minimum 3 characters).
              </span>
            </div>

            {/* New Password */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                New Admin Password <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <input
                  type={showNewPass ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter strong new password (min 6 characters)"
                  className="w-full bg-slate-950/80 border border-white/15 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 pr-10 outline-none transition"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowNewPass(!showNewPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1 text-xs"
                >
                  {showNewPass ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>

              {/* Strength indicator */}
              {newPassword && (
                <div className="mt-2 flex items-center gap-2">
                  <div className="h-1.5 flex-1 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${strength.color} transition-all duration-300`}
                      style={{ width: `${(strength.score / 3) * 100}%` }}
                    />
                  </div>
                  <span className="text-[10px] font-bold text-slate-300">{strength.label}</span>
                </div>
              )}
            </div>

            {/* Confirm New Password */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                Confirm New Password <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <input
                  type={showConfirmPass ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-type new password"
                  className="w-full bg-slate-950/80 border border-white/15 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 pr-10 outline-none transition"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPass(!showConfirmPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1 text-xs"
                >
                  {showConfirmPass ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {confirmPassword && confirmPassword !== newPassword && (
                <span className="text-[10px] text-rose-400 mt-1 block">Passwords do not match</span>
              )}
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto px-6 py-3 rounded-xl text-xs font-black text-white bg-gradient-to-r from-rose-500 via-pink-600 to-indigo-600 hover:opacity-90 shadow-xl shadow-rose-500/25 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <FaRotateLeft className="animate-spin" />
                    <span>Encrypting & Updating Vault...</span>
                  </>
                ) : (
                  <>
                    <FaLock />
                    <span>Save & Update Admin Credentials</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 1.5: SUB-ADMINS & RBAC ACCESS CONTROL */}
      {activeTab === 'subadmins' && (
        <AdminSubAdminManagerView
          showToast={showToast}
          copyText={copyText}
          playPopSound={playPopSound}
        />
      )}

      {/* TAB 2: WEBSITE NAME & BRAND IDENTITY QUICK LINKS */}
      {activeTab === 'website_identity' && (
        <div className="space-y-6">
          <div className="bg-slate-900/95 border border-white/15 rounded-2xl p-6 sm:p-7 backdrop-blur-2xl shadow-2xl">
            <h3 className="text-base sm:text-lg font-black text-white mb-2 flex items-center gap-2">
              <FaGlobe className="text-sky-400" />
              <span>Where to Change Website Name & Brand Identity</span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-6">
              Website ka naam 3 mukhtalif jagah use hota hai aur har ek ko aap Admin Panel se bina code touch kiye 1-click mein change kar sakte hain:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Card 1: Hero Banner */}
              <div className="bg-slate-950/60 border border-white/10 rounded-xl p-4 flex flex-col justify-between">
                <div>
                  <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center mb-3">
                    <FaPenToSquare />
                  </div>
                  <h4 className="text-sm font-bold text-white mb-1">1. Hero Banner Titles</h4>
                  <p className="text-[11px] text-slate-400 leading-relaxed mb-3">
                    Storefront ke main hero section par jo naam ata hai:
                  </p>
                  <div className="bg-black/50 p-2 rounded-lg text-[11px] space-y-1 mb-4 font-mono text-slate-300">
                    <div>Main: <span className="text-pink-400">{siteConfig.banner.mainTitle || 'Sohaib'}</span></div>
                    <div>Highlight: <span className="text-indigo-400">{siteConfig.banner.highlightTitle || 'Agency Hub'}</span></div>
                    <div>Top Strip: <span className="text-emerald-400">{siteConfig.banner.topStripTitle || 'SOHAIB AGENCY • OFFICIAL HUB'}</span></div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onNavigateToScreen('banner')}
                  className="w-full px-3 py-2 rounded-lg text-xs font-bold text-sky-300 bg-sky-500/10 hover:bg-sky-500/20 border border-sky-500/30 transition flex items-center justify-center gap-1.5"
                >
                  <span>Edit in Hero Banner Screen</span>
                  <FaArrowRight className="text-[10px]" />
                </button>
              </div>

              {/* Card 2: Footer & Brand Name */}
              <div className="bg-slate-950/60 border border-white/10 rounded-xl p-4 flex flex-col justify-between">
                <div>
                  <div className="w-8 h-8 rounded-lg bg-pink-500/20 text-pink-400 flex items-center justify-center mb-3">
                    <FaPenToSquare />
                  </div>
                  <h4 className="text-sm font-bold text-white mb-1">2. Footer & Copyright</h4>
                  <p className="text-[11px] text-slate-400 leading-relaxed mb-3">
                    Website ke footer aur official copyright tagline ka brand naam:
                  </p>
                  <div className="bg-black/50 p-2 rounded-lg text-[11px] space-y-1 mb-4 font-mono text-slate-300">
                    <div>Brand: <span className="text-pink-400">{siteConfig.footer.brandName || '🚀 Sohaib Agency Hub'}</span></div>
                    <div>Tagline: <span className="text-slate-400 text-[10px] line-clamp-1">{siteConfig.footer.copyrightTagline}</span></div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onNavigateToScreen('contact_footer')}
                  className="w-full px-3 py-2 rounded-lg text-xs font-bold text-pink-300 bg-pink-500/10 hover:bg-pink-500/20 border border-pink-500/30 transition flex items-center justify-center gap-1.5"
                >
                  <span>Edit in Footer & WhatsApp Screen</span>
                  <FaArrowRight className="text-[10px]" />
                </button>
              </div>

              {/* Card 3: SEO Google Title */}
              <div className="bg-slate-950/60 border border-white/10 rounded-xl p-4 flex flex-col justify-between">
                <div>
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-3">
                    <FaGlobe />
                  </div>
                  <h4 className="text-sm font-bold text-white mb-1">3. Google SEO & Meta Title</h4>
                  <p className="text-[11px] text-slate-400 leading-relaxed mb-3">
                    Browser tab, Google Search aur WhatsApp link share preview ka naam:
                  </p>
                  <div className="bg-black/50 p-2 rounded-lg text-[11px] space-y-1 mb-4 font-mono text-slate-300">
                    <div>SEO: <span className="text-emerald-400 text-[10px] line-clamp-2">{siteConfig.seo?.metaTitle}</span></div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onNavigateToScreen('seo')}
                  className="w-full px-3 py-2 rounded-lg text-xs font-bold text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 transition flex items-center justify-center gap-1.5"
                >
                  <span>Edit in SEO Studio</span>
                  <FaArrowRight className="text-[10px]" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2.5: ANTI-CLONE DOMAIN WHITELIST */}
      {activeTab === 'domains' && (
        <div className="space-y-6">
          <div className="bg-slate-900/95 border border-white/15 rounded-2xl p-6 sm:p-7 backdrop-blur-2xl shadow-2xl">
            <div className="flex items-center gap-2.5 mb-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
                <FaShieldHalved className="text-base" />
              </div>
              <h3 className="text-base sm:text-lg font-black text-white">Anti-Clone & Domain-Locking Killswitch</h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-6 font-normal">
              Yeh system ensure karta hai ke agar koi hacker ya competitor aapki website ka code ya rendered pages chura bhi le, to wo isay kisi doosre domain ya hosting par run na kar sake.
              Sirf neechay diye gaye <b className="text-amber-400 font-bold">Authorized Domains</b> par website chalegi, baqi har domain par Killswitch trigger ho kar code ko self-destruct kar dega!
            </p>

            {/* Base Protected Domains */}
            <div className="mb-6">
              <h4 className="text-xs font-black text-slate-200 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                <span>🔒 Permanent Core Whitelist (Built-in)</span>
              </h4>
              <div className="flex flex-wrap gap-2.5">
                <span className="px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-2 shadow-sm">
                  <FaCircleCheck className="text-[11px] text-emerald-400" />
                  <span>localhost (Development)</span>
                </span>
                <span className="px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-2 shadow-sm">
                  <FaCircleCheck className="text-[11px] text-emerald-400" />
                  <span>127.0.0.1 (Loopback)</span>
                </span>
                <span className="px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-2 shadow-sm">
                  <FaCircleCheck className="text-[11px] text-emerald-400" />
                  <span>testuisaqib.vercel.app (Official Verified Hub)</span>
                </span>
              </div>
            </div>

            {/* Custom Whitelisted Domains */}
            <div className="mb-6 pt-5 border-t border-white/10">
              <h4 className="text-xs font-black text-slate-200 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                <span>🌐 Custom Authorized Domains</span>
              </h4>
              <div className="flex flex-wrap gap-2.5 mb-4">
                {(siteConfig.authorizedDomains || ['testuisaqib.vercel.app', 'mrsaqib242.vercel.app']).map((dom) => (
                  <span
                    key={dom}
                    className="px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold bg-sky-500/20 text-sky-200 border border-sky-400/40 flex items-center gap-2 shadow-sm"
                  >
                    <span>{dom}</span>
                    {dom !== 'localhost' && dom !== '127.0.0.1' && dom !== 'testuisaqib.vercel.app' && dom !== 'mrsaqib242.vercel.app' && onUpdateSiteConfig && (
                      <button
                        type="button"
                        onClick={() => {
                          onUpdateSiteConfig((prev) => ({
                            ...prev,
                            authorizedDomains: (prev.authorizedDomains || []).filter((d) => d !== dom),
                          }));
                          showToast(`Removed ${dom} from whitelist`);
                          playPopSound(200);
                        }}
                        className="text-rose-400 hover:text-rose-300 ml-1.5 font-black cursor-pointer"
                        title={`Remove ${dom}`}
                      >
                        ✕
                      </button>
                    )}
                  </span>
                ))}
              </div>

              {/* Add Custom Domain Form */}
              {onUpdateSiteConfig && (
                <div className="flex flex-wrap gap-2.5 max-w-md">
                  <input
                    type="text"
                    value={newDomainInput}
                    onChange={(e) => setNewDomainInput(e.target.value.toLowerCase().trim())}
                    placeholder="e.g. saqibvisuals.com"
                    className="flex-1 bg-slate-950 border border-white/20 focus:border-amber-400 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-400 outline-none transition"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (!newDomainInput || newDomainInput.length < 3) return;
                      const cleanDom = newDomainInput.replace(/^https?:\/\//, '').replace(/\/.*$/, '');
                      onUpdateSiteConfig((prev) => ({
                        ...prev,
                        authorizedDomains: Array.from(new Set([...(prev.authorizedDomains || []), cleanDom])),
                      }));
                      showToast(`✅ Whitelisted new domain: ${cleanDom}`);
                      playPopSound(600);
                      setNewDomainInput('');
                    }}
                    className="px-4 py-2.5 rounded-xl text-xs font-black bg-amber-500 hover:bg-amber-400 text-slate-950 transition cursor-pointer shadow-md shadow-amber-500/25 active:scale-95"
                  >
                    + Add Domain
                  </button>
                </div>
              )}
            </div>

            {/* What happens on unauthorized domain */}
            <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-rose-950/80 via-slate-950/90 to-rose-950/80 border border-rose-500/40 text-xs text-rose-200 space-y-2 shadow-xl">
              <div className="font-black text-rose-300 flex items-center gap-2 text-xs sm:text-sm">
                <FaCircleExclamation className="text-rose-400 text-sm shrink-0" />
                <span>Unauthorized Mirror Par Kiya Hoga?</span>
              </div>
              <p className="text-xs text-rose-100/90 leading-relaxed font-normal">
                Agar koi shakhs yeh code kisi doosri hosting ya domain par upload karega to script foran screen lock kar ke <b className="text-white font-black underline decoration-rose-500">"🛑 UNLICENSED CLONE DETECTED"</b> ka banner show karegi, tamam buttons tod degi, aur 3 second baad viewer ko direct aapki official website par redirect kar degi!
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: MASTER SQL CHEAT-SHEET */}
      {activeTab === 'sql_queries' && (
        <div className="space-y-6">
          <div className="bg-slate-900/95 border border-white/15 rounded-2xl p-6 sm:p-7 backdrop-blur-2xl shadow-2xl">
            <h3 className="text-base sm:text-lg font-black text-white mb-2 flex items-center gap-2">
              <FaDatabase className="text-emerald-400" />
              <span>Direct Database SQL Queries (Supabase SQL Editor)</span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-6">
              Agar aap Supabase SQL Editor mein direct queries run karna chahte hain, to yeh ready-to-run queries use karein:
            </p>

            {/* Query 1: Website Name */}
            <div className="space-y-2 mb-6">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white">1. Update Website Name & Brand Title</span>
                <button
                  type="button"
                  onClick={() => copyText(sqlWebsiteNameQuery, 'SQL Query copied to clipboard!')}
                  className="px-2.5 py-1 rounded-lg text-[11px] font-bold text-sky-300 bg-sky-500/15 hover:bg-sky-500/25 border border-sky-500/30 flex items-center gap-1.5 transition"
                >
                  <FaCopy />
                  <span>Copy SQL</span>
                </button>
              </div>
              <pre className="bg-black/70 border border-white/10 p-3.5 rounded-xl text-xs font-mono text-emerald-300 overflow-x-auto leading-relaxed">
                {sqlWebsiteNameQuery}
              </pre>
            </div>

            {/* Query 2: Admin Reset */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white">2. Reset Admin Credentials to Default (saqib / saqibadmin)</span>
                <button
                  type="button"
                  onClick={() => copyText(sqlResetAdminQuery, 'Reset Query copied to clipboard!')}
                  className="px-2.5 py-1 rounded-lg text-[11px] font-bold text-rose-300 bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 flex items-center gap-1.5 transition"
                >
                  <FaCopy />
                  <span>Copy SQL</span>
                </button>
              </div>
              <pre className="bg-black/70 border border-white/10 p-3.5 rounded-xl text-xs font-mono text-pink-300 overflow-x-auto leading-relaxed">
                {sqlResetAdminQuery}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
