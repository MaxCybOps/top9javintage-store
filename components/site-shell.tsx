'use client';
import { usePathname } from 'next/navigation';
import { MessageCircle } from 'lucide-react';
import { Header } from './header';
import { Footer } from './footer';
import { CartDrawer, QuickView } from './cart-drawer';
import { useStore } from './store-provider';
export function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname=usePathname(); const studio=pathname.startsWith('/studio'); const {openWhatsApp}=useStore();
  return <>{!studio&&<Header />}{children}{!studio&&<Footer />}<CartDrawer /><QuickView />{!studio&&!pathname.startsWith('/checkout')&&<button className="floating-whatsapp" onClick={()=>openWhatsApp('Hi Top9javintage! I’m looking for my next favourite. Can you help?')} aria-label="Chat with Top9javintage on WhatsApp"><MessageCircle size={25} strokeWidth={1.6}/><span>Let’s talk fits</span></button>}</>;
}
