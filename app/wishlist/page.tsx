'use client';
import Link from 'next/link';
import { ArrowRight, Heart } from 'lucide-react';
import { useStore } from '@/components/store-provider';
import { ProductCard } from '@/components/product-card';
import { EmptyState } from '@/components/ui';
import { useClientReady } from '@/components/use-client-ready';
export default function WishlistPage() {
  const { wishlist, products } = useStore(); const ready = useClientReady(); const saved=ready ? products.filter(p=>wishlist.includes(p.id)) : [];
  return <main className="page-width wishlist-page"><div className="catalog-heading"><div><span className="eyebrow">GOOD TASTE, SAVED FOR LATER.</span><h1>Your saved pieces<span className="amber-text">.</span></h1><p className="muted mt-2">{saved.length} {saved.length===1?'find':'finds'} worth coming back for.</p></div><Heart size={28} strokeWidth={1.3} /></div>{saved.length ? <div className="product-grid">{saved.map(p=><ProductCard product={p} key={p.id} />)}</div> : <EmptyState title="See it. Save it. Make it yours." description="Tap the heart on any piece to keep your favourites together." action={<Link href="/#collection" className="btn btn-dark">Find your favourites <ArrowRight size={17} /></Link>} />}</main>;
}
