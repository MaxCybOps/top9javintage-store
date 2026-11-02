import { type CartItem, type Product, variantKey } from './types';
export const money = (amount: number) => `₦${amount.toLocaleString('en-NG')}`;
export const cx = (...values: (string | false | undefined | null)[]) => values.filter(Boolean).join(' ');
export const cartKey = (item: Pick<CartItem, 'productId' | 'color' | 'size'>) => `${item.productId}:${item.color}:${item.size}`;
export const available = (p: Product, color: string, size: string) => p.inventory[variantKey(color, size)] || 0;
export function matchesSearch(p: Product, query: string) {
  const haystack = `${p.title} ${p.description} ${p.category} ${p.gender} ${p.colors.map(c => c.name).join(' ')} vintage streetwear ${p.category === 'Footwear' ? 'shoes sneakers kicks' : ''}`.toLowerCase();
  return query.toLowerCase().split(/\s+/).filter(Boolean).every(word => haystack.includes(word));
}
export const deliveryFee = (state: string, subtotal: number) => subtotal >= 75000 ? 0 : state === 'Lagos' ? 3500 : 5500;
export const NIGERIAN_STATES = ['Abia','Adamawa','Akwa Ibom','Anambra','Bauchi','Bayelsa','Benue','Borno','Cross River','Delta','Ebonyi','Edo','Ekiti','Enugu','FCT — Abuja','Gombe','Imo','Jigawa','Kaduna','Kano','Katsina','Kebbi','Kogi','Kwara','Lagos','Nasarawa','Niger','Ogun','Ondo','Osun','Oyo','Plateau','Rivers','Sokoto','Taraba','Yobe','Zamfara'];
export function readLocal<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try { const value = localStorage.getItem(key); return value ? JSON.parse(value) : fallback; } catch { return fallback; }
}
export function saveLocal(key: string, value: unknown) { try { localStorage.setItem(key, JSON.stringify(value)); } catch {} }
