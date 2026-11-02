'use client';
import { usePathname } from 'next/navigation';
import { MessageCircle } from 'lucide-react';
import { Header } from './header';
import { Footer } from './footer';
import { CartDrawer, QuickView } from './cart-drawer';
import { useStore } from './store-provider';
import { ScrollProgress } from './motion';
export function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname(); const studio = pathname.startsWith('/studio'); const { openWhatsApp } = useStore();
  return <><ScrollProgress />{!studio && <Header />}<div key={pathname} className="page-transition">{children}</div>{!studio && <Footer />}<CartDrawer /><QuickView />{!studio && !pathname.startsWith('/checkout') && <button className="floating-whatsapp" onClick={() => openWhatsApp('Hi Top9jaVintage! I’m looking for my next favourite. Can you help?')} aria-label="Chat with Top9jaVintage on WhatsApp"><MessageCircle size={25} strokeWidth={1.6} /><span>Let’s talk fits</span></button>}</>;
}
