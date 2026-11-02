import type { MetadataRoute } from 'next';
import { getProducts } from '@/lib/store';
const base = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await getProducts();
  return [
    { url: base, changeFrequency: 'daily', priority: 1 },
    { url: `${base}/wishlist`, changeFrequency: 'weekly', priority: 0.3 },
    ...products.map(p => ({ url: `${base}/product/${p.slug}`, lastModified: p.createdAt, changeFrequency: 'weekly' as const, priority: 0.8 })),
  ];
}
