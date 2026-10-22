<div align="center">

# 💎 SOHAIB AGENCY HUB
### Next.js 16 (Turbopack) • Tailwind CSS • Supabase • 3D Glassmorphism UI
**Ultra-Fast, Secure Digital & AI Services eCommerce & Web Tools Platform**

[![Next.js](https://img.shields.io/badge/Next.js-16.4.2-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Database-emerald?style=for-the-badge&logo=supabase)](https://supabase.com/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-3D_Glass-blue?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Author](https://img.shields.io/badge/Made_with_%E2%9D%A4%EF%B8%8F_by-Muhammad_Saqib-rose?style=for-the-badge)](https://wa.me/923478936242)

> 🤖 **AI Agents & Developers**: Read [`AGENT_SETUP_CHANGELOG.md`](./AGENT_SETUP_CHANGELOG.md) for the complete architecture overview, changelog, and database setup instructions.

</div>

---

## 🌟 Overview & Key Features

**Sohaib Agency Hub** is a full-stack, enterprise-grade digital services marketplace, AI tools portal, and automated admin management ecosystem:

1. **🎨 3D Acrylic Glassmorphism Storefront**:
   - Modern, high-retention responsive design with interactive glow orbs and plush badges.
   - 32+ Pre-seeded services across AI Pro Tools, SMM Boost, NADRA & SIM Records, Crypto P2P, Graphics & Video Editing.
   - 7+ Integrated online web tools (ChatGPT Plus, Canva Studio, Gemini Pro, CapCut Cloud, Lovable Builder, ElevenLabs, Remini AI).

2. **⚡ Dual-Layer Bulletproof Persistence**:
   - Live Supabase Cloud PostgreSQL with automatic local server disk backup (`data/site_config.json`).
   - Zero-downtime SSR fallback: Site renders immediately with full config even if cloud database connection is momentarily delayed.

3. **🛡️ Enterprise Multi-Admin RBAC Security Vault**:
   - PBKDF2 SHA-512 cryptographic password hashing + unique per-admin salts (100,000 iterations).
   - Dedicated route: `/saqibadmin` with fine-grained granular permissions (Super Admin vs Sub-Admins).
   - Anti-brute-force rate limiting and security lockouts (`security_lockouts`).
   - Anti-tampering DRM & bot scraper protection (`proxy.ts`).

4. **🎟️ Promo Coupons & Checkout Engine**:
   - Percentage & Fixed discounts with minimum order and max discount limits.
   - Real-time coupon validation (`/api/coupons/validate`) and instant savings calculations.

5. **📊 Real-Time Visitor Telemetry & Hardware Fingerprinting**:
   - Client battery level, charging status, OS, browser, screen resolution, IP address, and location.

---

## 🚀 1-Click Setup & Cloning Guide

### 1. Clone the Repository
```bash
git clone https://github.com/saqibteamwork-rgb/sohaibagencyhub.git sohaibagencyhub
cd sohaibagencyhub
npm install
```

### 2. Configure Environment Variables
Create `.env.local` based on `.env.example`:
```bash
cp .env.example .env.local
```

Fill in your Supabase project credentials in `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL="https://yxrtmnnndhroqbyhmnyl.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"

# ImageKit (Optional for asset uploads)
NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY="public_hAsIn5Rl4yEptvRhS++GoJeO9ck="
NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT="https://ik.imagekit.io/ws9mlpwdsj"
IMAGEKIT_PRIVATE_KEY="private_XiedF7mU8mxbGCLOnLcvgyTByE8="

# Admin JWT Secret & Domain Whitelist
ADMIN_JWT_SECRET="super_secure_random_jwt_secret_token_here_2026"
ALLOWED_DOMAINS="localhost,sohaibagencyhub.vercel.app"
DISABLE_KILLSWITCH="true"
```

### 3. Run Database Migration (1-Click SQL)
Open your **Supabase Dashboard** -> **SQL Editor** -> Click **New Query**:
1. Copy the entire contents of [`master_query.sql`](./master_query.sql) (or [`MASTER_DATABASE_COMPLETE.sql`](./MASTER_DATABASE_COMPLETE.sql)).
2. Paste and click **RUN**.
3. It creates all tables, triggers, indexes, RLS policies, seed catalog (32+ services, 7 web tools), and admin accounts idempotently.

### 4. Start Local Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) (or [http://localhost:3001](http://localhost:3001)) in your browser.

---

## 🔐 Default Admin Credentials

- **Admin Login Route**: `/saqibadmin`
- **Default Super Admin**:
  - **Username**: `saqib` or `saqibadmin`
  - **Password**: `password123` (or hashed in database)
  - **Email**: `admin@gmail.com`

---

## 📦 Production Deployment (Vercel)

1. Push your repository to GitHub / GitLab.
2. Import project into [Vercel](https://vercel.com).
3. Set the Environment Variables from your `.env.local`.
4. Deploy! Builds in under 60 seconds with Turbopack.

---

## 👨‍💻 Developer & Credits

- **Developer**: Muhammad Saqib
- **Platform**: Sohaib Agency Hub
- **WhatsApp Support**: [+92 347 8936242](https://wa.me/923478936242)
- **Attribution**: Permanent Developer Signature — `Made with ❤️ by Muhammad Saqib`
