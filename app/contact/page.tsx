import { Metadata } from 'next';
import { getServerStoreData } from '@/src/lib/serverDataLoader';
import { DEFAULT_SITE_SEO } from '@/src/types/siteConfig';
import ClientStoreApp from '../ClientStoreApp';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Dynamic Server-Side Generated SEO Metadata for Contact Page
export async function generateMetadata(): Promise<Metadata> {
  const { siteConfig } = await getServerStoreData();
  const seo = { ...DEFAULT_SITE_SEO, ...(siteConfig.seo || {}) };
  const origin = process.env.APP_URL || 'https://sohaibagencyhub.vercel.app';
  const effectiveCanonical = `${origin}/contact`;
  const portrait = siteConfig.banner?.portraitUrl || 'https://ik.imagekit.io/mrsaqib/mrsaqib242-img25_7oG52NZUY.png';
  const brandOwner = siteConfig.banner?.mainTitle?.trim() || 'Sohaib';
  const fullBrand = `${brandOwner} ${siteConfig.banner?.highlightTitle?.trim() || 'Agency Hub'}`.trim();
  const brand = siteConfig.footer?.brandName || fullBrand;
  const waDisplay = siteConfig.contact?.whatsappNumberDisplay || '+92 347 8936242';

  return {
    title: `Contact Us — 24/7 WhatsApp & Live Support | ${brand}`,
    description:
      `Get in direct contact with ${brandOwner} on official WhatsApp (${waDisplay}), or submit a direct customer support ticket for AI Tools, SMM orders, and subscriptions.`,
    alternates: {
      canonical: effectiveCanonical,
    },
    robots: {
      index: seo.robotsIndex !== false,
      follow: seo.robotsFollow !== false,
    },
    openGraph: {
      title: `Contact ${brandOwner} — 24/7 WhatsApp & Live Support`,
      description: `Official direct customer support ticket dispatch and WhatsApp assistance for ${fullBrand}.`,
      url: effectiveCanonical,
      siteName: brand,
      images: [
        {
          url: seo.ogImageUrl || portrait,
          width: 1200,
          height: 630,
          alt: `Contact ${brand}`,
        },
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `Contact Us | ${brand}`,
      description: `Official direct customer support ticket dispatch and WhatsApp assistance for ${fullBrand}.`,
      images: [seo.ogImageUrl || portrait],
    },
  };
}

// Next.js Server Component for /contact
export default async function ContactPage() {
  const { services, webTools, siteConfig, reviews } = await getServerStoreData();

  return (
    <main className="min-h-screen">
      <ClientStoreApp
        initialServices={services}
        initialTools={webTools}
        initialConfig={siteConfig}
        initialReviews={reviews}
        initialTab="contact"
      />
    </main>
  );
}
