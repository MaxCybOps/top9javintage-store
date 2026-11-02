'use client';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight, ArrowRight, Check, MessageCircle, Sparkles, Truck, ShieldCheck, RotateCcw } from 'lucide-react';
import { Reveal, Tilt, Marquee, CountUp, Magnetic } from './motion';
import { MediaVideo } from './media-player';
import { Accordion } from './ui';
import { useStore } from './store-provider';

export function BrandMarquee() {
  return <Marquee items={['Good style. No expiry.', 'Rooted in Lagos', 'Vintage soul', 'Worn everywhere', 'New drops weekly', 'Top9jaVintage']} />;
}

export function BrandStory() {
  return <section className="section page-width"><div className="story-grid"><Reveal><Tilt className="story-visual" max={5}><Image src="/brand/logo-full.png" alt="Top9jaVintage logo" width={310} height={320} /><span className="story-badge">EST. LAGOS · ONLINE STORE</span></Tilt></Reveal><Reveal className="story-copy" delay={120}><span className="eyebrow">THE TOP9JA VINTAGE STORY</span><h2>Old-school soul.<br />New-school energy.</h2><p>We curate pieces with character — archive-inspired graphics, lived-in denim, and the little details that make a fit feel like you. No fast-fashion noise. Just good finds, chosen with intention.</p><p>From Lagos to everywhere, we’re building a wardrobe that moves with you: expressive, comfortable, and a little unexpected.</p><div className="stats-row"><CountUp value={16} suffix="+" label="Curated demo pieces" /><CountUp value={37} label="States + FCT delivery" /><CountUp value={7} suffix="-day" label="Return request window" /></div><Magnetic><Link href="/about" className="btn btn-dark" style={{ marginTop: 26 }}>Meet the brand <ArrowUpRight size={16} /></Link></Magnetic></Reveal></div></section>;
}

const looks = [
  { title: 'The Lagos Edit', text: 'Street-ready layers with vintage energy.', image: '/images/hero-editorial.webp', href: '/?edit=the-9ja-edit#collection' },
  { title: 'Archive Layers', text: 'Jackets and denim with a lived-in soul.', image: '/images/jacket.webp', href: '/?category=Vintage%20Drops#collection' },
  { title: 'Utility Season', text: 'Cargo, sneakers, and everyday movement.', image: '/images/utility-cargo.webp', href: '/?category=Unisex%20Clothing#collection' },
];
export function Lookbook() {
  return <section className="section page-width"><Reveal className="section-head"><div><span className="eyebrow">LOOKBOOK</span><h2>Style it your way.</h2><p>Three moods, one wardrobe. Tap a look to shop the edit.</p></div><Link href="/journal" className="text-link">Read the journal <ArrowUpRight size={15} /></Link></Reveal><div className="lookbook-grid">{looks.map((l, i) => <Reveal key={l.title} delay={i * 100}><Tilt className="lookbook-card" max={6}><Link href={l.href}><Image src={l.image} alt={l.title} fill sizes="(max-width: 767px) 100vw, 33vw" /><div className="lookbook-copy"><h3>{l.title}</h3><p>{l.text}</p><span>Shop the look <ArrowRight size={13} /></span></div></Link></Tilt></Reveal>)}</div></section>;
}

export function FitFilmSection() {
  const { products } = useStore(); const film = products.find(p => p.video)?.video || '/videos/fit-film.mp4'; const poster = products.find(p => p.video)?.images[0] || '/images/graphic-tee.webp';
  return <section className="section page-width"><div className="film-grid"><Reveal><Tilt className="film-frame" max={4}><MediaVideo src={film} poster={poster} /></Tilt></Reveal><Reveal className="film-copy" delay={120}><span className="eyebrow">SEE IT IN MOTION</span><h2>Feel the fit before you commit.</h2><p>Photos show the piece. Film shows the movement. Our fit films help you see drape, texture, and proportion — so your next favourite arrives with fewer surprises.</p><ul className="film-points"><li><Check size={16} /> Silent autoplay that respects your data</li><li><Check size={16} /> Tap to unmute and hear the details</li><li><Check size={16} /> Multi-angle galleries on every product</li></ul><Magnetic><Link href="/?tab=video#collection" className="btn btn-dark" style={{ marginTop: 24 }}>Watch fit films <ArrowUpRight size={16} /></Link></Magnetic></Reveal></div></section>;
}

const voices = [
  { name: 'Adaeze O.', city: 'Lagos', text: 'The cargo pants fit exactly like the video. The fabric feels sturdy, and the colour is even better in person.' },
  { name: 'Tunde A.', city: 'Abuja', text: 'Finally a vintage store that shows the fit properly. The fit film made me confident enough to order.' },
  { name: 'Zainab M.', city: 'Port Harcourt', text: 'Love the curated drops. It feels personal, not like scrolling through a thousand random items.' },
];
export function Testimonials() {
  return <section className="section testimonials"><div className="page-width"><Reveal className="section-head"><div><span className="eyebrow">COMMUNITY VOICES</span><h2>Worn and loved.</h2><p>Sample feedback from the demo community.</p></div></Reveal><div className="testimonial-grid">{voices.map((v, i) => <Reveal key={v.name} delay={i * 100}><article className="testimonial-card"><div className="stars">★★★★★</div><p>“{v.text}”</p><footer><span className="testimonial-avatar">{v.name[0]}</span><span><strong>{v.name}</strong><br /><small className="muted">{v.city}</small></span></footer></article></Reveal>)}</div></div></section>;
}

export function HomeFAQ() {
  return <section className="section page-width"><div className="faq-grid"><Reveal><span className="eyebrow">GOOD TO KNOW</span><h2 style={{ fontSize: 30, fontWeight: 600, letterSpacing: '-1px', marginTop: 10 }}>Questions, answered.</h2><p style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.9, marginTop: 12 }}>Everything you need to feel good about your next find.</p></Reveal><Reveal className="faq-list" delay={100}><Accordion title="How long does delivery take?" defaultOpen><p>Lagos delivery is typically 1–3 business days. Other states and FCT are typically 3–7 business days. Free delivery on orders over ₦75,000.</p></Accordion><Accordion title="Can I return a piece?"><p>Yes. Request a return within 7 days of delivery. Items must be unworn with original tags. Message the store with your order reference.</p></Accordion><Accordion title="How do I choose my size?"><p>Check the size guide on each product. Most pieces are relaxed unisex fits. Between sizes? Size down for a regular fit, or up for oversized.</p></Accordion><Accordion title="Can I order via WhatsApp?"><p>Absolutely. Add pieces to your bag and tap “Order via WhatsApp” to send a pre-filled order request to the store.</p></Accordion></Reveal></div></section>;
}

export function CommunityCTA() {
  const { openWhatsApp } = useStore();
  return <section className="section page-width"><Reveal><div className="community-card"><div><span className="eyebrow" style={{ color: '#a8bba2' }}>JOIN THE ROTATION</span><h2>Your next favourite is a chat away.</h2><p>Ask about a fit, request a drop, or get styling help. Real people, real quick.</p><Magnetic><button className="btn" style={{ marginTop: 22 }} onClick={() => openWhatsApp('Hi Top9jaVintage! I’d love some help finding my next fit.')}><MessageCircle size={17} /> Chat with us <ArrowUpRight size={16} /></button></Magnetic></div><Image className="community-mark float-slow" src="/brand/logo-mark-light.png" alt="" width={120} height={134} /></div></Reveal></section>;
}

export function TrustStrip() {
  const items = [{ Icon: Truck, title: 'Nationwide delivery', text: '36 states + FCT' }, { Icon: ShieldCheck, title: 'Curated quality', text: 'Every piece checked' }, { Icon: RotateCcw, title: '7-day returns', text: 'Request with ease' }, { Icon: Sparkles, title: 'Fresh drops', text: 'New finds weekly' }];
  return <div className="trust-strip">{items.map(({ Icon, title, text }) => <Reveal key={title}><div className="trust-item"><Icon size={19} style={{ color: 'var(--sage-deep)', marginBottom: 10 }} /><strong>{title}</strong>{text}</div></Reveal>)}</div>;
}
