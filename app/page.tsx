import { Suspense } from 'react';
import { Hero, Benefits, QuickCategories, Catalog, EditorialBreak } from '@/components/home';
export default function Home() {
  return <main><Hero /><Benefits /><QuickCategories /><Suspense fallback={<div className="page-width catalog-loading">Finding the good stuff…</div>}><Catalog /></Suspense><EditorialBreak /></main>;
}
