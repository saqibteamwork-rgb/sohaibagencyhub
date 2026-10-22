# 🤖 AGENT SETUP, CHANGELOG & ARCHITECTURE GUIDE
### Project: **Sohaib Agency Hub** (`saqibteamwork-rgb/sohaibagencyhub`)
> **Target Audience**: AI Agents (Antigravity, Cursor, Claude, GPT) & Developers working on this codebase after cloning.

---

## 📌 1. Project Overview & Quick Summary

| Property | Value |
|---|---|
| **Project Name** | Sohaib Agency Hub |
| **Brand Identity** | Sohaib Agency Hub — Digital & AI Services, SMM Store & Web Tools |
| **Developer Attribution** | Permanent Footer Attribution: `Made with ❤️ by Muhammad Saqib` |
| **Framework** | Next.js 16.4.2 (App Router + Turbopack) |
| **Language & Styling** | TypeScript 7 + React 19 + Tailwind CSS 4 |
| **Database** | Supabase Cloud PostgreSQL (Project ID: `yxrtmnnndhroqbyhmnyl`) |
| **CDN / Uploads** | ImageKit CDN (`https://ik.imagekit.io/ws9mlpwdsj`) |
| **Live Production Domain**| `https://sohaibagencyhub.vercel.app/` |
| **GitHub Repository** | `https://github.com/saqibteamwork-rgb/sohaibagencyhub` |

---

## 🔄 2. Complete Changelog (What Was Modified & Why)

### A. Branding Rebranding (Saqib Visuals Hub ➡️ Sohaib Agency Hub)
Per client instructions, all client-facing branding was updated to **Sohaib Agency Hub**, while preserving the developer attribution in the footer:
- **`data/site_config.json`**:
  - `topStripTitle` set to `"SOHAIB AGENCY • OFFICIAL HUB"`.
  - `mainTitle` set to `"Sohaib "`, `highlightTitle` set to `"Agency Hub"`.
  - `footer.brandName` set to `"🚀 Sohaib Agency Hub"`.
  - `seo.metaTitle` and `seo.ogTitle` set to `"Sohaib Agency Hub — Digital & AI Services, SMM Store & Web Tools"`.
  - WhatsApp widget greetings updated to Sohaib Agency.
  - Payment method accounts updated to `"Sohaib Agency"`.
- **`src/types/siteConfig.ts`**:
  - Default fallbacks for `DEFAULT_SITE_SEO`, `DEFAULT_SITE_CONFIG`, and `DEFAULT_STORE_BARS_CONFIG` updated to Sohaib Agency Hub.
- **`src/App.tsx`**:
  - Default fallback for `brandOwnerName` set to `'Sohaib'` and `brandAccentName` set to `'Agency Hub'`.
  - Permanent developer attribution kept in footer: `Made with ❤️ by Muhammad Saqib`.
- **`app/layout.tsx` & `app/page.tsx`**:
  - Metadata title, OpenGraph tags, Apple web app, and application-name updated to Sohaib Agency Hub.
- **`public/manifest.json`**:
  - `name`: `"Sohaib Agency Hub"`, `short_name`: `"Sohaib Agency"`.
- **`app/saqibadmin/page.tsx` & `AdminPortalClient.tsx`**:
  - Admin header and title updated to `"Sohaib Agency — Admin Security Vault"`.
- **`src/lib/translations.ts`**:
  - Bilingual taglines updated to Sohaib Agency Hub.
- **`src/components/ShowcaseSections.tsx`, `WhatsAppChatWidget.tsx`, `PwaInstallPrompt.tsx`**:
  - All occurrences updated to Sohaib Agency Hub.

---

### B. Domain Whitelisting & DRM Killswitch Configuration
The template contains an anti-clone / anti-scraper DRM system (`proxy.ts` and `AntiCloneSecurityKillswitch.tsx`):
- **`sohaibagencyhub.vercel.app`** was explicitly added to:
  - `authorizedDomains` in `data/site_config.json`.
  - `authorizedDomains` in `src/types/siteConfig.ts`.
  - Whitelist in `src/components/AntiCloneSecurityKillswitch.tsx`.
  - Environment whitelist in `proxy.ts`.
  - `ALLOWED_DOMAINS` in `.env.local`.
- **`DISABLE_KILLSWITCH="true"`** was set in `.env.local` to permanently prevent any unauthorized clone warnings on legitimate deployments.
- **Content Security Policy (CSP)** in `proxy.ts` was expanded to allow `https://*.imagekit.io` and `https://upload.imagekit.io`.

---

### C. Database Migration & SQL Seeds
- **`master_query.sql`**, **`MASTER_DATABASE_COMPLETE.sql`**, and **`database_schema.sql`**:
  - Updated the initial seed for `public.site_config` so that upon execution in Supabase SQL Editor, the database is populated directly with **Sohaib Agency Hub** data and whitelists `sohaibagencyhub.vercel.app`.
- **`ALLOW_CLIENT_DOMAIN.sql`**:
  - Updated to provide a 1-click SQL query specifically for `sohaibagencyhub.vercel.app`.

---

## 🗄️ 3. Database Architecture & Supabase Connection

### Dual-Layer Fallback Architecture
The project uses a dual-layer persistence system:
1. **Primary Layer**: Live Supabase PostgreSQL database (`yxrtmnnndhroqbyhmnyl.supabase.co`).
2. **Fallback Layer**: Server disk JSON (`data/site_config.json`) and in-memory static catalog (`src/data/defaultCatalog.ts`).
   - If Supabase tables have not been created yet or connection is slow, Next.js SSR serves the site from `data/site_config.json` without failing.

### How to Check Database Connection Status
You can check the live database health anytime by querying:
```
GET /api/database-status
```
Example Response:
```json
{
  "status": "CONNECTED_OK",
  "is_configured": true,
  "project_id": "yxrtmnnndhroqbyhmnyl",
  "database_url": "https://yxrtmnnndhroqbyhmnyl.supabase.co",
  "has_anon_key": true,
  "has_service_role_key": true
}
```

### ⚠️ IMPORTANT: How to Initialize Tables in Supabase (1-Click SQL)
If Supabase shows error `PGRST205` (*"Could not find the table 'public.services' in the schema cache"*), it means the tables have not been created yet.
**To fix this**:
1. Open the [Supabase Dashboard](https://supabase.com/dashboard/project/yxrtmnnndhroqbyhmnyl).
2. Go to **SQL Editor** -> Click **New Query**.
3. Copy the entire contents of [`master_query.sql`](./master_query.sql) and paste it.
4. Click **Run**.
5. All 10+ tables, storage buckets, RLS policies, 32+ services, 7 web tools, and admin vault will be created instantly.

---

## 🔑 4. Environment Variables Reference (`.env.local`)

```env
# ==================== SUPABASE DATABASE CONFIG ====================
NEXT_PUBLIC_SUPABASE_URL="https://yxrtmnnndhroqbyhmnyl.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="sb_publishable_zxWbdEwa9TLZ64JYA0roxw_fqVf0OuQ"
SUPABASE_SERVICE_ROLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

# ==================== IMAGEKIT CDN CONFIG ====================
NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY="public_hAsIn5Rl4yEptvRhS++GoJeO9ck="
NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT="https://ik.imagekit.io/ws9mlpwdsj"
IMAGEKIT_PRIVATE_KEY="private_XiedF7mU8mxbGCLOnLcvgyTByE8="

# ==================== APP URL & AI ====================
APP_URL="https://sohaibagencyhub.vercel.app"
NEXT_PUBLIC_APP_URL="https://sohaibagencyhub.vercel.app"

# ==================== ADMIN SECURITY VAULT ====================
ADMIN_JWT_SECRET="super_secure_random_jwt_secret_token_here_2026"
ADMIN_USERNAME="saqib"

# ==================== CLIENT CLONE & DOMAIN PERMISSIONS ====================
ALLOWED_DOMAINS="sohaibagencyhub.vercel.app,localhost,127.0.0.1"
DISABLE_KILLSWITCH="true"
```

---

## 🔐 5. Admin Panel Credentials & Routes

- **Admin Login Route**: `/saqibadmin` (or `/saqibadmb`)
- **Default Username**: `saqib` or `saqibadmin`
- **Default Email**: `admin@gmail.com`
- **Default Password**: `password123`
- **Password Security**: PBKDF2 SHA-512 with unique salt (100,000 iterations), verified in `src/lib/serverSecurity.ts`.

---

## 🚀 6. Next Agent Clone & Run Quickstart

When cloning this repo into a fresh directory:

1. **Install dependencies**:
   ```bash
   npm install
   ```
2. **Verify `.env.local` exists**:
   Ensure `.env.local` contains the Supabase keys, ImageKit keys, and `DISABLE_KILLSWITCH="true"`.
3. **Run TypeScript check & build verification**:
   ```bash
   npx tsc --noEmit
   npm run build
   ```
4. **Start local development server**:
   ```bash
   npm run dev
   # Or on a custom port if 3000 is occupied:
   npx next dev -p 3001
   ```
5. **Verify live database**:
   Visit `http://localhost:3000/api/database-status` to verify Supabase connection.

---

## 📝 7. Permanent Rules for Future Edits
1. **Developer Attribution**: NEVER remove the footer attribution (`Made with ❤️ by Muhammad Saqib`). It must stay in the footer as requested by the client.
2. **Branding**: Keep all customer-facing store branding as **Sohaib Agency Hub**.
3. **Killswitch**: Always ensure `DISABLE_KILLSWITCH="true"` or that any new custom domain is added to `ALLOWED_DOMAINS` and `authorizedDomains` in `data/site_config.json`.
