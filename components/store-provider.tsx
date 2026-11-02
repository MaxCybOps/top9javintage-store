'use client';
import { createContext, useContext, useEffect, useMemo, useState, useCallback, useSyncExternalStore, type ReactNode } from 'react';
import { Check, X, AlertCircle } from 'lucide-react';
import { seedProducts } from '@/lib/seed';
import { type Product, type CartItem, type CartLine, variantKey } from '@/lib/types';
import { cartKey, readLocal, saveLocal, money } from '@/lib/utils';

type Store = {
  products: Product[]; refreshProducts: () => Promise<void>; cart: CartItem[]; lines: CartLine[];
  count: number; subtotal: number; cartOpen: boolean; setCartOpen: (v: boolean) => void;
  addToCart: (p: Product, color: string, size: string, quantity?: number, open?: boolean) => boolean;
  updateQuantity: (key: string, quantity: number) => void; removeFromCart: (key: string) => void; clearCart: () => void;
  wishlist: string[]; toggleWishlist: (id: string) => void;
  quickView: Product | null; setQuickView: (p: Product | null) => void;
  notify: (message: string, type?: 'success' | 'error') => void;
  whatsappNumber: string; setWhatsappNumber: (v: string) => void; openWhatsApp: (text?: string) => void;
  whatsappSetup: boolean; setWhatsappSetup: (v: boolean) => void;
};
const StoreContext = createContext<Store | null>(null);
const emptySubscribe = () => () => {};
export function useStore() { const value = useContext(StoreContext); if (!value) throw new Error('StoreProvider is required'); return value; }
export function StoreProvider({ children }: { children: ReactNode }) {
  const mounted = useSyncExternalStore(emptySubscribe, () => true, () => false);
  const [products, setProducts] = useState<Product[]>(seedProducts);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [quickView, setQuickView] = useState<Product | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error'; id: number } | null>(null);
  const [whatsappNumber, setNumber] = useState(process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '');
  const [whatsappSetup, setWhatsappSetup] = useState(false);
  const [pendingMessage, setPendingMessage] = useState('');
  const refreshProducts = useCallback(async () => {
    try { const res = await fetch('/api/products', { cache: 'no-store' }); if (res.ok) setProducts(await res.json()); } catch {}
  }, []);
  useEffect(() => {
    const stored = readLocal<CartItem[]>('t9j-cart-v1', []);
    if (Array.isArray(stored)) setCart(stored.filter(x => x && typeof x.productId === 'string' && typeof x.color === 'string' && typeof x.size === 'string' && Number.isInteger(x.quantity) && x.quantity > 0));
    const saved = readLocal<string[]>('t9j-wishlist-v1', []); if (Array.isArray(saved)) setWishlist(saved);
    const number = readLocal<string>('t9j-whatsapp-v1', ''); if (number) setNumber(number);
    setHydrated(true); void refreshProducts();
  }, [refreshProducts]);
  useEffect(() => { if (hydrated) saveLocal('t9j-cart-v1', cart); }, [cart, hydrated]);
  useEffect(() => { if (hydrated) saveLocal('t9j-wishlist-v1', wishlist); }, [wishlist, hydrated]);
  useEffect(() => { if (!toast) return; const timer = setTimeout(() => setToast(null), 4200); return () => clearTimeout(timer); }, [toast]);
  const notify = useCallback((message: string, type: 'success' | 'error' = 'success') => setToast({ message, type, id: Date.now() }), []);
  const activeCart = mounted ? cart : [];
  const activeWishlist = mounted ? wishlist : [];
  const lines = useMemo(() => activeCart.flatMap(item => { const product = products.find(p => p.id === item.productId); return product ? [{ ...item, product, key: cartKey(item) }] : []; }), [activeCart, products]);
  const count = lines.reduce((sum, l) => sum + l.quantity, 0);
  const subtotal = lines.reduce((sum, l) => sum + l.quantity * l.product.price, 0);
  function addToCart(p: Product, color: string, size: string, quantity = 1, open = true) {
    const stock = p.inventory[variantKey(color, size)] || 0;
    const existing = cart.find(i => i.productId === p.id && i.color === color && i.size === size)?.quantity || 0;
    if (!stock || existing + quantity > Math.min(stock, 20)) { notify(stock ? `Only ${stock} available in this variant.` : 'This variant is sold out. Try another size or colour.', 'error'); return false; }
    setCart(current => { const key = cartKey({ productId: p.id, color, size }); const found = current.find(i => cartKey(i) === key); return found ? current.map(i => cartKey(i) === key ? { ...i, quantity: i.quantity + quantity } : i) : [...current, { productId: p.id, color, size, quantity }]; });
    if (open) { setQuickView(null); setCartOpen(true); } else notify(`${p.title} added to your bag`);
    return true;
  }
  function updateQuantity(key: string, quantity: number) {
    if (quantity < 1) { removeFromCart(key); return; }
    const line = lines.find(l => l.key === key); if (!line) return;
    const max = Math.min(20, line.product.inventory[variantKey(line.color, line.size)] || 0);
    if (quantity > max) { notify(`Only ${max} available in this variant.`, 'error'); return; }
    setCart(current => current.map(i => cartKey(i) === key ? { ...i, quantity } : i));
  }
  function removeFromCart(key: string) { setCart(current => current.filter(i => cartKey(i) !== key)); }
  function toggleWishlist(id: string) { const saved = wishlist.includes(id); setWishlist(current => saved ? current.filter(x => x !== id) : [...current, id]); notify(saved ? 'Removed from your saved pieces' : 'A good find. Saved to your wishlist.'); }
  function setWhatsappNumber(value: string) { const clean = value.replace(/\D/g, ''); setNumber(clean); saveLocal('t9j-whatsapp-v1', clean); }
  function openWhatsApp(text?: string) {
    const message = text || `Hello Top9javintage! I'd like to order:\n\n${lines.map(l => `• ${l.quantity} × ${l.product.title} (${l.color}, ${l.size}) — ${money(l.product.price * l.quantity)}`).join('\n')}\n\nSubtotal: ${money(subtotal)}\nDelivery: to be confirmed\n\nName:\nDelivery address:\nPlease confirm availability and delivery. Thank you!`;
    if (!whatsappNumber) { setPendingMessage(message); setWhatsappSetup(true); return; }
    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
  }
  return <StoreContext.Provider value={{ products, refreshProducts, cart: activeCart, lines, count, subtotal, cartOpen, setCartOpen, addToCart, updateQuantity, removeFromCart, clearCart: () => setCart([]), wishlist: activeWishlist, toggleWishlist, quickView, setQuickView, notify, whatsappNumber, setWhatsappNumber, openWhatsApp, whatsappSetup, setWhatsappSetup }}>
    {children}
    {toast && <div className={cxToast(toast.type)} role="status" key={toast.id}>{toast.type === 'success' ? <Check size={17} /> : <AlertCircle size={17} />}<span>{toast.message}</span><button aria-label="Dismiss notification" onClick={() => setToast(null)}><X size={15} /></button></div>}
    {whatsappSetup && <WhatsAppSetup onClose={() => setWhatsappSetup(false)} onContinue={(number) => { setWhatsappNumber(number); setWhatsappSetup(false); window.open(`https://wa.me/${number.replace(/\D/g, '')}?text=${encodeURIComponent(pendingMessage)}`, '_blank', 'noopener,noreferrer'); }} />}
  </StoreContext.Provider>;
}
function cxToast(type: string) { return `toast ${type === 'error' ? 'toast-error' : ''}`; }
import { Modal } from './ui';
function WhatsAppSetup({ onClose, onContinue }: { onClose: () => void; onContinue: (number: string) => void }) {
  const { whatsappNumber, setWhatsappNumber } = useStore();
  const [number, setNumber] = useState(whatsappNumber);
  const valid = /^\d{10,15}$/.test(number.replace(/\D/g, ''));
  return <Modal title="Let’s talk on WhatsApp" onClose={onClose} className="small-modal"><div className="modal-body"><div className="round-icon amber-soft"><svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M21 11.5a8.4 8.4 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.4 8.4 0 0 1-3.8-.9L3 21l1.9-5.7a8.4 8.4 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.4 8.4 0 0 1 3.8-.9h.5a8.5 8.5 0 0 1 8 8v.5Z" /></svg></div><h3>Your next fit is a chat away.</h3><p className="muted mt-3">This demo doesn’t assume a business phone number. Add your store’s WhatsApp number to send your bag directly to chat.</p><label className="field mt-6">Store WhatsApp number<input value={number} onChange={e => setNumber(e.target.value)} placeholder="e.g. 234 + your business number" inputMode="tel" autoFocus /></label><p className="field-help">International format, without + or spaces. Saved only on this device.</p><button className="btn btn-dark w-full mt-5" disabled={!valid} onClick={() => { setWhatsappNumber(number); onContinue(number); }}>Save & continue to WhatsApp</button><button className="text-link mt-4 mx-auto" onClick={onClose}>Keep browsing</button></div></Modal>;
}
