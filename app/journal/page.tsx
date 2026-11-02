import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { Reveal, Tilt } from '@/components/motion';
import { BrandMarquee, CommunityCTA } from '@/components/home-sections';
export const metadata: Metadata = { title: 'The journal', description: 'Style notes, fit guides, and vintage inspiration from Top9jaVintage.' };
const posts = [
  { tag: 'STYLE GUIDE', title: 'How to build a vintage rotation that lasts', text: 'Start with three anchors: a graphic tee, relaxed denim, and a layer with character. Here’s how to make them work together.', image: '/images/graphic-tee.webp', href: '/?category=Vintage%20Drops#collection' },
  { tag: 'FIT NOTES', title: 'Relaxed, oversized, or true to size?', text: 'A quick guide to choosing your fit across tees, cargos, and jackets — without the guesswork.', image: '/images/utility-cargo.webp', href: '/?category=Unisex%20Clothing#collection' },
  { tag: 'LOOKBOOK', title: 'The Lagos Edit: street-ready layers', text: 'Three ways to wear the season’s favourite pieces, from market runs to late-night hangs.', image: '/images/hero-editorial.webp', href: '/?edit=the-9ja-edit#collection' },
  { tag: 'CARE', title: 'Keep your prints looking fresh', text: 'Wash cold, inside out, and air dry. Small habits that keep your favourite pieces in rotation longer.', image: '/images/knit.webp', href: '/?category=Everything%20Clothes#collection' },
  { tag: 'DROP CULTURE', title: 'Why small drops feel better', text: 'Limited runs mean less noise and more intention. Here’s how we curate each release.', image: '/images/jacket.webp', href: '/?category=Vintage%20Drops#collection' },
  { tag: 'COMMUNITY', title: 'Worn and loved: your fits, your stories', text: 'A look at how the community styles their finds. Tag your fit and join the rotation.', image: '/images/retro-runner.webp', href: '/?category=Footwear#collection' },
];
export default function JournalPage() {
  return <main><section className="about-hero page-width"><Reveal><span className="eyebrow">THE TOP9JA VINTAGE JOURNAL</span><h1>Notes on style, fit, and good finds.</h1><p>Guides, lookbooks, and a little vintage inspiration to help you wear your story.</p></Reveal></section><BrandMarquee /><section className="section page-width"><Reveal><div style={{aspectRatio:"21/9"}}><Tilt className="lookbook-card" max={4}><Link href="/?edit=the-9ja-edit#collection"><Image src="/images/hero-editorial.webp" alt="The Lagos Edit" fill sizes="100vw" /><div className="lookbook-copy"><span className="eyebrow">FEATURED</span><h3>The Lagos Edit</h3><p>Street-ready layers with vintage energy. Shop the full look.</p><span>Explore the edit <ArrowUpRight size={13} /></span></div></Link></Tilt></div></Reveal></section><section className="section page-width" style={{ paddingTop: 0 }}><div className="journal-grid">{posts.map((p, i) => <Reveal key={p.title} delay={i * 80}><article className="journal-card"><Link href={p.href}><div className="journal-image"><Image src={p.image} alt={p.title} fill sizes="(max-width: 767px) 100vw, 33vw" /></div><div><span className="eyebrow">{p.tag}</span><h3>{p.title}</h3><p>{p.text}</p><span className="text-link" style={{ marginTop: 12, display: 'inline-flex' }}>Read & shop <ArrowUpRight size={14} /></span></div></Link></article></Reveal>)}</div></section><CommunityCTA /></main>;
}
