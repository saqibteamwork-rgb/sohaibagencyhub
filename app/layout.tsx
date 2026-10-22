import type { Metadata, Viewport } from 'next';
import '../src/index.css';
import { AntiScrapeProtectionShield } from '@/src/components/AntiScrapeProtectionShield';
import { AntiCloneSecurityKillswitch } from '@/src/components/AntiCloneSecurityKillswitch';
import { PwaInstallPrompt } from '@/src/components/PwaInstallPrompt';
import { VisitorTelemetryTracker } from '@/src/components/VisitorTelemetryTracker';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.APP_URL || 'https://sohaibagencyhub.vercel.app'),
  title: 'Sohaib Agency Hub — Digital & AI Services, SMM Store & Web Tools',
  description: 'Digital & AI Services, CapCut Pro, SMM Store & Web Tools by Sohaib Agency Hub.',
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon-32x32.png',
    shortcut: '/favicon-16x16.png',
    apple: '/icons/apple-touch-icon.png',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Sohaib Agency',
  },
  openGraph: {
    title: 'Sohaib Agency Hub — Digital & AI Services, SMM Store & Web Tools',
    description: 'Digital & AI Services, CapCut Pro, SMM Store & Web Tools by Sohaib Agency Hub.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#0e1220',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const envAllowedDomains = [
    'sohaibagencyhub.vercel.app',
  ];
  const extraDomains = (
    process.env.ALLOWED_DOMAINS ||
    process.env.NEXT_PUBLIC_ALLOWED_DOMAINS ||
    ''
  )
    .split(',')
    .map((d) => d.trim().toLowerCase())
    .filter(Boolean);
  envAllowedDomains.push(...extraDomains);

  const appUrl = process.env.APP_URL || process.env.NEXT_PUBLIC_APP_URL || '';
  if (appUrl) {
    try {
      const parsed = new URL(appUrl.startsWith('http') ? appUrl : `https://${appUrl}`);
      envAllowedDomains.push(parsed.hostname.toLowerCase());
    } catch {}
  }

  if (process.env.VERCEL_URL) {
    envAllowedDomains.push(process.env.VERCEL_URL.replace(/https?:\/\//, '').split('/')[0].toLowerCase());
  }

  const disableKillswitch =
    process.env.DISABLE_KILLSWITCH === 'true' ||
    process.env.NEXT_PUBLIC_DISABLE_KILLSWITCH === 'true';

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* PWA Core Configuration */}
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="application-name" content="Sohaib Agency Hub" />

        {/* Sonic-speed preconnect & dns-prefetch to zero out network latency */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://cdnjs.cloudflare.com" />
        <link rel="dns-prefetch" href="https://ik.imagekit.io" />
        <link rel="preconnect" href="https://ik.imagekit.io" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://images.unsplash.com" />

        {/* Instant LCP Priority Preload for Flagship Portrait Image */}
        <link
          rel="preload"
          as="image"
          href="https://ik.imagekit.io/mrsaqib/mrsaqib242-img25_7oG52NZUY.png"
          fetchPriority="high"
        />

        {/* 1. Core Default Fonts (Optimized & Non-blocking with display=swap) */}
        <link
          href="https://fonts.googleapis.com/css2?family=Caveat:wght@600;700&family=JetBrains+Mono:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Space+Grotesk:wght@500;600;700&display=swap"
          rel="stylesheet"
        />

        {/* 2. Extended Font Packs */}
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@500;700&family=Fredoka:wght@600;700&family=Orbitron:wght@600;800&family=Outfit:wght@600;700&family=Playfair+Display:ital,wght@0,700;1,600&family=Poppins:wght@600;700&family=Quicksand:wght@600;700&family=Rajdhani:wght@600;700&family=Share+Tech+Mono&family=Space+Mono:wght@700&family=Syne:wght@700;800&display=swap"
          rel="stylesheet"
        />

        {/* Font Awesome Icons */}
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
          crossOrigin="anonymous"
        />
      </head>
      <body suppressHydrationWarning className="overflow-x-hidden antialiased selection:bg-pink-500 selection:text-white">
        <AntiCloneSecurityKillswitch
          authorizedDomains={envAllowedDomains}
          disableKillswitch={disableKillswitch}
        />
        <AntiScrapeProtectionShield />
        <PwaInstallPrompt />
        <VisitorTelemetryTracker />
        {children}
      </body>
    </html>
  );
}
