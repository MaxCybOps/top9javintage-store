'use client';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, Plus, Play, ArrowUpRight } from 'lucide-react';
import { type Product } from '@/lib/types';
import { useStore } from './store-provider';
import { Price, Rating, ProductBadge } from './ui';
import { cx } from '@/lib/utils';
import { useClientReady } from './use-client-ready';
export function ProductCard({ product, priority = false }: { product: Product; priority?: boolean }) {
  const { wishlist, toggleWishlist, setQuickView } = useStore(); const ready = useClientReady(); const saved = ready && wishlist.includes(product.id);
  return <article className="product-card"><div className="product-image-wrap"><Link href={`/product/${product.slug}`} className="product-image-link" aria-label={`View ${product.title}`}><Image src={product.images[0]} alt={product.title} fill sizes="(max-width: 639px) 50vw, (max-width: 1023px) 33vw, 25vw" priority={priority} className="product-image" />{product.images[1] && <Image src={product.images[1]} alt="" fill sizes="(max-width: 639px) 50vw, 25vw" className="product-image-hover" aria-hidden="true" />}</Link><ProductBadge product={product} /><button className={cx('card-heart', saved && 'is-saved')} onClick={() => toggleWishlist(product.id)} aria-label={`${saved ? 'Unsave' : 'Save'} ${product.title}`} aria-pressed={saved}><Heart size={18} strokeWidth={1.5} fill={saved ? 'currentColor' : 'none'} /></button>{product.video && <Link href={`/product/${product.slug}?media=video`} className="video-badge"><Play size={10} fill="currentColor" /> Fit video</Link>}<button className="quick-add" onClick={() => setQuickView(product)} aria-label={`Quick add ${product.title}`}><span>Quick add</span><Plus size={18} /></button></div><div className="product-card-info"><div className="product-title-row"><Link href={`/product/${product.slug}`} className="product-title">{product.title}</Link><Rating product={product} compact /></div><Price product={product} /><div className="card-variants"><div className="color-swatches">{product.colors.slice(0, 4).map(c => <button key={c.name} style={{ '--swatch': c.hex } as React.CSSProperties} className="color-dot" title={`View ${c.name} options`} aria-label={`Select ${product.title} in ${c.name}`} onClick={() => setQuickView(product)} />)}{product.colors.length > 4 && <span>+{product.colors.length - 4}</span>}</div><span>{product.sizes.length === 1 ? 'One size' : product.category === 'Footwear' ? 'EU 38–45' : `${product.sizes[0]}–${product.sizes[product.sizes.length - 1]}`}</span></div></div></article>;
}
