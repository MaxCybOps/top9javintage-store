'use client';
import { useEffect, useRef, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import { X, Star, ChevronDown, LoaderCircle, ShoppingBag } from 'lucide-react';
import { cx, money } from '@/lib/utils';
import { type Product } from '@/lib/types';

export function Modal({ children, title, onClose, className = '', drawer = false }: { children: ReactNode; title: string; onClose: () => void; className?: string; drawer?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const closeRef = useRef(onClose); closeRef.current = onClose;
  useEffect(() => {
    const previous = document.activeElement as HTMLElement;
    const original = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const timer = setTimeout(() => { const target = ref.current?.querySelector<HTMLElement>('[autofocus], input, button, [href], select, textarea, [tabindex="0"]'); (target || ref.current)?.focus(); }, 40);
    function keydown(e: KeyboardEvent) {
      if (e.key === 'Escape') closeRef.current();
      if (e.key === 'Tab') {
        const items = Array.from(ref.current?.querySelectorAll<HTMLElement>('button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex="0"]') || []).filter(el => el.offsetParent !== null);
        const first = items[0], last = items[items.length - 1];
        if (!first) { e.preventDefault(); return; }
        if (e.shiftKey && (document.activeElement === first || document.activeElement === ref.current)) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    }
    document.addEventListener('keydown', keydown);
    return () => { clearTimeout(timer); document.body.style.overflow = original; document.removeEventListener('keydown', keydown); previous?.focus?.(); };
  }, []);
  if (typeof document === 'undefined') return null;
  return createPortal(<div className={cx('modal-overlay', drawer && 'drawer-overlay')} onMouseDown={e => { if (e.target === e.currentTarget) onClose(); }}><div className={cx(drawer ? 'drawer' : 'modal', className)} role="dialog" aria-modal="true" aria-label={title} ref={ref} tabIndex={-1}><div className="modal-header"><h2>{title}</h2><button className="icon-button" onClick={onClose} aria-label={`Close ${title}`}><X size={21} /></button></div>{children}</div></div>, document.body);
}
export function Price({ product, large = false }: { product: Product; large?: boolean }) {
  return <div className={cx('price-row', large && 'price-large')}><span className="price">{money(product.price)}</span>{product.compareAt && product.compareAt > product.price && <><del>{money(product.compareAt)}</del>{!large && <span className="discount">−{Math.round((1 - product.price / product.compareAt) * 100)}%</span>}</>}</div>;
}
export function Rating({ product, compact = false }: { product: Product; compact?: boolean }) {
  return <span className={cx('rating', compact && 'rating-compact')} aria-label={`${product.rating} out of 5, ${product.reviews} sample reviews`}><Star size={compact ? 11 : 14} fill="currentColor" strokeWidth={0} /><strong>{product.rating ? product.rating.toFixed(1) : 'New'}</strong>{!compact && <span>({product.reviews || 'No'} reviews)</span>}</span>;
}
export function ProductBadge({ product }: { product: Product }) {
  if (!product.badge) return null;
  return <span className={cx('product-badge', product.badge === 'Flash Sale' ? 'badge-sale' : product.badge === 'Hot Drop' ? 'badge-hot' : 'badge-limited')}>{product.badge === 'Flash Sale' && <svg width="10" height="12" viewBox="0 0 10 12" fill="currentColor"><path d="M6 0 0 7h4l-1 5 7-8H6l1-4Z" /></svg>}{product.badge}</span>;
}
export function Accordion({ title, children, defaultOpen = false }: { title: string; children: ReactNode; defaultOpen?: boolean }) {
  return <details className="accordion" open={defaultOpen || undefined}><summary>{title}<ChevronDown size={17} /></summary><div>{children}</div></details>;
}
export function Spinner({ label = 'Loading' }: { label?: string }) { return <span className="inline-flex items-center gap-2"><LoaderCircle size={17} className="spin" />{label}</span>; }
export function EmptyState({ title, description, action }: { title: string; description: string; action?: ReactNode }) { return <div className="empty-state"><div className="round-icon"><ShoppingBag size={29} strokeWidth={1.3} /></div><h3>{title}</h3><p>{description}</p>{action}</div>; }
export function Logo({ light = false, full = false }: { light?: boolean; full?: boolean }) {
  if (full) return <span className={cx('logo-full', light && 'logo-light')}><Image src={light ? '/brand/logo-full-light.png' : '/brand/logo-full.png'} alt="Top9jaVintage" width={310} height={320} /></span>;
  return <span className={cx('logo', light && 'logo-light')}><Image className="logo-mark" src={light ? '/brand/logo-mark-light.png' : '/brand/logo-mark.png'} alt="" width={231} height={257} /><Image className="logo-wordmark" src={light ? '/brand/logo-wordmark-light.png' : '/brand/logo-wordmark.png'} alt="Top9jaVintage" width={287} height={45} /></span>;
}
