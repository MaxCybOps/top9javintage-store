'use client';
import { useEffect, useRef, useState, type ReactNode, type CSSProperties } from 'react';
import { cx } from '@/lib/utils';

export function Reveal({ children, className = '', delay = 0, as: Tag = 'div' }: { children: ReactNode; className?: string; delay?: number; as?: 'div' | 'section' | 'article' | 'li' }) {
  const ref = useRef<HTMLDivElement>(null); const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { setSeen(true); return; }
    const io = new IntersectionObserver(entries => { if (entries[0].isIntersecting) { setSeen(true); io.disconnect(); } }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    io.observe(el); return () => io.disconnect();
  }, []);
  return <Tag ref={ref as never} className={cx('reveal', seen && 'is-visible', className)} style={{ '--reveal-delay': `${delay}ms` } as CSSProperties}>{children}</Tag>;
}

export function Tilt({ children, className = '', max = 7 }: { children: ReactNode; className?: string; max?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  function move(e: React.PointerEvent) {
    const el = ref.current; if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const r = el.getBoundingClientRect(); const x = (e.clientX - r.left) / r.width - 0.5; const y = (e.clientY - r.top) / r.height - 0.5;
    el.style.setProperty('--rx', `${(-y * max).toFixed(2)}deg`); el.style.setProperty('--ry', `${(x * max).toFixed(2)}deg`); el.style.setProperty('--mx', `${(x + 0.5) * 100}%`); el.style.setProperty('--my', `${(y + 0.5) * 100}%`);
  }
  function leave() { const el = ref.current; if (!el) return; el.style.setProperty('--rx', '0deg'); el.style.setProperty('--ry', '0deg'); }
  return <div ref={ref} className={cx('tilt', className)} onPointerMove={move} onPointerLeave={leave}>{children}<span className="tilt-glare" aria-hidden="true" /></div>;
}

export function Marquee({ items, className = '' }: { items: string[]; className?: string }) {
  const row = [...items, ...items];
  return <div className={cx('marquee', className)} aria-hidden="true"><div className="marquee-track">{row.map((t, i) => <span key={i}>{t}<i>✦</i></span>)}</div></div>;
}

export function CountUp({ value, suffix = '', label }: { value: number; suffix?: string; label: string }) {
  const ref = useRef<HTMLSpanElement>(null); const [n, setN] = useState(0);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { setN(value); return; }
    const io = new IntersectionObserver(entries => {
      if (!entries[0].isIntersecting) return; io.disconnect();
      const start = performance.now(); const dur = 1200;
      function tick(t: number) { const p = Math.min(1, (t - start) / dur); setN(Math.round(value * (1 - Math.pow(1 - p, 3)))); if (p < 1) requestAnimationFrame(tick); }
      requestAnimationFrame(tick);
    }, { threshold: 0.4 });
    io.observe(el); return () => io.disconnect();
  }, [value]);
  return <span className="countup" ref={ref}><strong>{n}{suffix}</strong><small>{label}</small></span>;
}

export function ScrollProgress() {
  const [width, setWidth] = useState(0);
  useEffect(() => {
    function update() { const h = document.documentElement; const max = h.scrollHeight - h.clientHeight; setWidth(max > 0 ? (h.scrollTop / max) * 100 : 0); }
    update(); window.addEventListener('scroll', update, { passive: true }); window.addEventListener('resize', update);
    return () => { window.removeEventListener('scroll', update); window.removeEventListener('resize', update); };
  }, []);
  return <div className="scroll-progress" style={{ width: `${width}%` }} aria-hidden="true" />;
}

export function Magnetic({ children, className = '' }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  function move(e: React.PointerEvent) { const el = ref.current; if (!el) return; const r = el.getBoundingClientRect(); el.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * 0.12}px, ${(e.clientY - r.top - r.height / 2) * 0.18}px)`; }
  function leave() { if (ref.current) ref.current.style.transform = ''; }
  return <span ref={ref} className={cx('magnetic', className)} onPointerMove={move} onPointerLeave={leave}>{children}</span>;
}
