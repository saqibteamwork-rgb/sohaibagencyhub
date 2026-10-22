import { Metadata } from 'next';
import { getServerStoreData } from '@/src/lib/serverDataLoader';
import { DEFAULT_SITE_SEO } from '@/src/types/siteConfig';
import ClientStoreApp from '../ClientStoreApp';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Dynamic Server-Side Generated SEO Metadata for VIP Login & Wallet Portal
export async function generateMetadata(): Promise<Metadata> {
  const { siteConfig } = await getServerStoreData();
  const origin = process.env.APP_URL || 'https://sohaibagencyhub.vercel.app';
  const effectiveCanonical = `${origin}/login`;
  const portrait = siteConfig.banner?.portraitUrl || 'https://ik.imagekit.io/mrsaqib/mrsaqib242-img25_7oG52NZUY.png';
  const brandOwner = siteConfig.banner?.mainTitle?.trim() || 'Sohaib';
  const fullBrand = `${brandOwner} ${siteConfig.banner?.highlightTitle?.trim() || 'Agency Hub'}`.trim();
  const brand = siteConfig.footer?.brandName || fullBrand;

  return {
    title: `VIP Client Login & Wallet Portal | ${brand}`,
    description:
      `Log in to your ${brand} client portal to manage orders, top up your live wallet balance, upload payment proofs, and access premium subscriptions.`,
    alternates: {
      canonical: effectiveCanonical,
    },
    robots: {
      index: false,
      follow: false,
    },
    openGraph: {
      title: `VIP Client Login & Wallet Portal — ${brand}`,
      description: `Secure client login, order tracking, and live wallet balance management.`,
      url: effectiveCanonical,
      siteName: brand,
      images: [
        {
          url: portrait,
          width: 1200,
          height: 630,
          alt: `VIP Client Login — ${brand}`,
        },
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `VIP Client Login | ${brand}`,
      description: `Secure client login and live wallet balance management.`,
      images: [portrait],
    },
  };
}

// Next.js Server Component for /login
export default async function LoginPage() {
  const { services, webTools, siteConfig, reviews } = await getServerStoreData();

  return (
    <main className="min-h-screen">
      <ClientStoreApp
        initialServices={services}
        initialTools={webTools}
        initialConfig={siteConfig}
        initialReviews={reviews}
        initialTab="login"
      />
    </main>
  );
}
