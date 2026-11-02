import { CATEGORIES, variantKey, type Product } from './types';
const localMedia = (value: unknown, folders: string[]) => typeof value === 'string' && !value.includes('..') && folders.some(folder => value.startsWith(folder));
export function validateProduct(p: Product): string | null {
  if (typeof p.title !== 'string' || !p.title.trim() || p.title.length > 140) return 'Add a product title of up to 140 characters.';
  if (typeof p.description !== 'string' || !p.description.trim() || p.description.length > 3000) return 'Add a product description of up to 3,000 characters.';
  if (!Number.isSafeInteger(p.price) || p.price <= 0 || p.price > 100000000) return 'Enter a valid selling price in whole Naira.';
  if (p.compareAt !== undefined && (!Number.isSafeInteger(p.compareAt) || p.compareAt <= p.price)) return 'Original price must be higher than the selling price.';
  if (!CATEGORIES.includes(p.category) || !['Men','Women','Unisex'].includes(p.gender)) return 'Choose a valid category and gender.';
  if (p.badge && !['Flash Sale','Hot Drop','Limited Stock'].includes(p.badge)) return 'Choose a valid product badge.';
  if (!Array.isArray(p.images) || !p.images.length || p.images.length > 12 || p.images.some(x => !localMedia(x,['/images/','/uploads/images/']))) return 'Add between 1 and 12 product photos through the uploader.';
  if (p.videos && (!Array.isArray(p.videos) || p.videos.length > 4 || p.videos.some(x => !localMedia(x,['/videos/','/uploads/videos/'])))) return 'Add up to 4 fit films through the uploader.';
  if (!Array.isArray(p.colors) || !p.colors.length || p.colors.length > 8 || p.colors.some(c => !c.name?.trim() || c.name.length > 40 || !/^#[0-9a-f]{6}$/i.test(c.hex)) || new Set(p.colors.map(c => c.name.trim())).size !== p.colors.length) return 'Give each colour a unique name and a valid swatch.';
  if (!Array.isArray(p.sizes) || !p.sizes.length || p.sizes.length > 20 || p.sizes.some(s => typeof s !== 'string' || !s.trim() || s.length > 20) || new Set(p.sizes).size !== p.sizes.length) return 'Choose at least one valid size.';
  if (!p.inventory || typeof p.inventory !== 'object' || Array.isArray(p.inventory)) return 'Add variant stock quantities.';
  for (const c of p.colors) for (const s of p.sizes) { const n = p.inventory[variantKey(c.name.trim(),s)]; if (!Number.isInteger(n) || n < 0 || n > 100000) return 'Every colour / size variant needs a stock quantity between 0 and 100,000.'; }
  if (Object.values(p.inventory).reduce((a,b) => a+b,0) > 1000000) return 'Total stock cannot exceed 1,000,000 units.';
  return null;
}
export function normalizeMedia(p: Product) { p.videos = p.videos?.length ? p.videos : p.video ? [p.video] : []; p.video = p.videos[0]; return p; }
