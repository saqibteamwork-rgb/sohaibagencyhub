import { Metadata } from 'next';
import { getServerStoreData } from '@/src/lib/serverDataLoader';
import ClientStoreApp from '../ClientStoreApp';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function generateMetadata(): Promise<Metadata> {
  const { siteConfig } = await getServerStoreData();
  const origin = process.env.APP_URL || 'https://sohaibagencyhub.vercel.app';
  const canonical = `${origin}/about`;
  const portrait = siteConfig.banner?.portraitUrl || 'https://ik.imagekit.io/mrsaqib/mrsaqib242-img25_7oG52NZUY.png';
  const brandOwner = siteConfig.banner?.mainTitle?.trim() || 'Sohaib';
  const fullBrand = `${brandOwner} ${siteConfig.banner?.highlightTitle?.trim() || 'Agency Hub'}`.trim();
  const brand = siteConfig.footer?.brandName || fullBrand;

  return {
    title: `About ${brandOwner} — ${fullBrand}`,
    description:
      `Learn about ${brandOwner}, certified digital creator, AI tools supplier, SMM provider, and telecommunication data consultant.`,
    alternates: {
      canonical,
    },
    openGraph: {
      title: `About ${brandOwner} — ${fullBrand}`,
      description: `Official biography, credentials, and digital services offered by ${brandOwner}.`,
      url: canonical,
      siteName: brand,
      images: [
        {
          url: portrait,
          width: 1200,
          height: 630,
          alt: `About ${brandOwner}`,
        },
      ],
      type: 'website',
    },
  };
}

export default async function AboutPage() {
  const { services, webTools, siteConfig, reviews } = await getServerStoreData();

  return (
    <main className="min-h-screen">
      <ClientStoreApp
        initialServices={services}
        initialTools={webTools}
        initialConfig={siteConfig}
        initialReviews={reviews}
        initialTab="about"
      />
    </main>
  );
}
