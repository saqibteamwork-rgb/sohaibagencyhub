import { Metadata } from 'next';
import { getServerStoreData } from '@/src/lib/serverDataLoader';
import { DEFAULT_SITE_SEO } from '@/src/types/siteConfig';
import ClientStoreApp from './ClientStoreApp';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Dynamic Server-Side Generated SEO Metadata
export async function generateMetadata(): Promise<Metadata> {
  const { siteConfig } = await getServerStoreData();
  const seo = { ...DEFAULT_SITE_SEO, ...(siteConfig.seo || {}) };
  const origin = process.env.APP_URL || 'https://sohaibagencyhub.vercel.app';
  const effectiveCanonical = seo.canonicalUrl?.trim() || origin;
  const portrait = siteConfig.banner?.portraitUrl || 'https://ik.imagekit.io/mrsaqib/mrsaqib242-img25_7oG52NZUY.png';

  return {
    title: seo.metaTitle || 'Sohaib Agency Hub — Digital & AI Services, SMM Store & Web Tools',
    description:
      seo.metaDescription ||
      'Instant CapCut Pro, Lovable Pro, Gemini 18M, ChatGPT Plus, TikTok UK/USA Agency Accounts, Franchise SIM Records & SMM Services by Muhammad Saqib.',
    keywords:
      seo.keywords ||
      'Muhammad Saqib, Saqib Visuals, CapCut Pro Pakistan, SMM Panel Pakistan, Lovable Pro Account, Gemini 18M Pro, ChatGPT Plus, SIM Database Live, NADRA Verification, TikTok Agency Accounts',
    authors: [{ name: seo.author || 'Muhammad Saqib' }],
    alternates: {
      canonical: effectiveCanonical,
    },
    robots: {
      index: seo.robotsIndex !== false,
      follow: seo.robotsFollow !== false,
    },
    openGraph: {
      title: seo.ogTitle || seo.metaTitle || 'Sohaib Agency Hub',
      description: seo.ogDescription || seo.metaDescription,
      url: effectiveCanonical,
      siteName: siteConfig.footer?.brandName || 'Sohaib Agency Hub',
      images: [
        {
          url: seo.ogImageUrl || portrait,
          width: 1200,
          height: 630,
          alt: seo.ogTitle || 'Sohaib Agency Hub',
        },
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: seo.ogTitle || seo.metaTitle,
      description: seo.ogDescription || seo.metaDescription,
      creator: seo.twitterCreator || '@mrsaqib242',
      images: [seo.ogImageUrl || portrait],
    },
  };
}

// Next.js Server Component (Full Server-Side Rendering - SSR)
export default async function HomePage() {
  const { services, webTools, siteConfig, reviews } = await getServerStoreData();

  return (
    <main className="min-h-screen">
      <ClientStoreApp
        initialServices={services}
        initialTools={webTools}
        initialConfig={siteConfig}
        initialReviews={reviews}
      />
    </main>
  );
}
