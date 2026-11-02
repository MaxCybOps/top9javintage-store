import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
export default function NotFound() { return <main className="page-width not-found"><span className="eyebrow">404 — A LITTLE OFF THE RACK</span><h1>This find got away.</h1><p>That piece may have moved, but your next favourite is still out there.</p><Link href="/#collection" className="btn btn-dark">Back to the good stuff <ArrowRight size={17} /></Link></main>; }
