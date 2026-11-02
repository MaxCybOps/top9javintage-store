import type { Metadata, Viewport } from 'next';
import { StoreProvider } from '@/components/store-provider';
import { SiteShell } from '@/components/site-shell';
import './globals.css';
import './brand.css';
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: 'Top9javintage — Good Style. No Expiry.', template: '%s — Top9javintage' },
  description: 'Old-school soul. New-school energy. Shop curated vintage streetwear, fresh kicks, and everyday statement pieces. Delivery from Lagos to everywhere in Nigeria.',
  applicationName: 'Top9javintage', manifest: '/manifest.webmanifest',
  icons: { icon: [{ url: '/icon.svg', type: 'image/svg+xml' }, { url: '/icon-192.png', sizes: '192x192', type: 'image/png' }], apple: '/icon-192.png' },
  openGraph: { type: 'website', siteName: 'Top9javintage', title: 'Top9javintage — Good Style. No Expiry.', description: 'Curated vintage streetwear and everyday statement pieces. From Lagos to everywhere.', images: ['/images/hero-editorial.webp'] },
  twitter: { card: 'summary_large_image', title: 'Top9javintage — Good Style. No Expiry.', description: 'Curated vintage streetwear and everyday statement pieces. From Lagos to everywhere.', images: ['/images/hero-editorial.webp'] },
  robots: { index: true, follow: true },
};
export const viewport: Viewport = { width: 'device-width', initialScale: 1, themeColor: '#24251f' };
export default function RootLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = { '@context': 'https://schema.org', '@type': 'ClothingStore', name: 'Top9javintage', description: 'Curated vintage streetwear, footwear, and accessories.', url: siteUrl, areaServed: 'NG', currenciesAccepted: 'NGN' };
  return <html lang="en"><body><a href="#main-content" className="skip-link">Skip to content</a><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} /><StoreProvider><SiteShell><div id="main-content">{children}</div></SiteShell></StoreProvider></body></html>;
}
