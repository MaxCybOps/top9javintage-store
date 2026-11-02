import { Suspense } from 'react';
import { Hero, Benefits, QuickCategories, Catalog, EditorialBreak } from '@/components/home';
import { BrandMarquee, BrandStory, Lookbook, FitFilmSection, Testimonials, HomeFAQ, CommunityCTA } from '@/components/home-sections';
export default function Home() {
  return <main><Hero /><Benefits /><QuickCategories /><Suspense fallback={<div className="page-width catalog-loading">Finding the good stuff…</div>}><Catalog /></Suspense><EditorialBreak /><BrandMarquee /><BrandStory /><Lookbook /><FitFilmSection /><Testimonials /><HomeFAQ /><CommunityCTA /></main>;
}
