import { Metadata } from 'next';
import { getServerStoreData } from '@/src/lib/serverDataLoader';
import ClientStoreApp from '../ClientStoreApp';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function generateMetadata(): Promise<Metadata> {
  const { siteConfig } = await getServerStoreData();
  const origin = process.env.APP_URL || 'https://sohaibagencyhub.vercel.app';
  const canonical = `${origin}/faqs`;
  const portrait = siteConfig.banner?.portraitUrl || 'https://ik.imagekit.io/mrsaqib/mrsaqib242-img25_7oG52NZUY.png';
  const brandOwner = siteConfig.banner?.mainTitle?.trim() || 'Sohaib';
  const fullBrand = `${brandOwner} ${siteConfig.banner?.highlightTitle?.trim() || 'Agency Hub'}`.trim();
  const brand = siteConfig.footer?.brandName || fullBrand;

  return {
    title: `Frequently Asked Questions (FAQs) — Help & Support | ${brand}`,
    description:
      `Answers to frequently asked questions about account delivery times, payment methods (EasyPaisa, JazzCash, Banks), wallet top-ups, and warranty policies for ${brand}.`,
    alternates: {
      canonical,
    },
    openGraph: {
      title: `FAQs & Help Desk — ${brand}`,
      description: `Delivery guarantees, payment answers, and customer policies.`,
      url: canonical,
      siteName: brand,
      images: [
        {
          url: portrait,
          width: 1200,
          height: 630,
          alt: `FAQs — ${brand}`,
        },
      ],
      type: 'website',
    },
  };
}

export default async function FaqsPage() {
  const { services, webTools, siteConfig, reviews } = await getServerStoreData();

  return (
    <main className="min-h-screen">
      <ClientStoreApp
        initialServices={services}
        initialTools={webTools}
        initialConfig={siteConfig}
        initialReviews={reviews}
        initialTab="faqs"
      />
    </main>
  );
}
