'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LockKeyhole, ArrowRight } from 'lucide-react';
import { Logo, Spinner } from './ui';
export function StudioLogin() {
  const router = useRouter(); const [password, setPassword] = useState(''); const [error, setError] = useState(''); const [busy, setBusy] = useState(false);
  async function submit(e: React.FormEvent) {
    e.preventDefault(); setBusy(true); setError('');
    try { const res = await fetch('/api/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password }) }); const data = await res.json(); if (!res.ok) throw new Error(data.error || 'Could not sign in.'); router.refresh(); }
    catch (err) { setError(err instanceof Error ? err.message : 'Could not sign in.'); }
    finally { setBusy(false); }
  }
  return <main className="studio-login-page"><form className="studio-login-card" onSubmit={submit}><Logo /><div className="round-icon amber-soft" style={{ margin: '26px 0 18px' }}><LockKeyhole size={24} /></div><h1>Store studio</h1><p>Sign in to manage your good finds, orders, and store settings.</p><label className="field">Studio password<input type="password" required autoFocus value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter your studio password" autoComplete="current-password" /></label>{error && <p className="form-error" role="alert">{error}</p>}<button className="btn btn-dark w-full" disabled={busy}>{busy ? <Spinner label="Signing in…" /> : <>Enter studio <ArrowRight size={16} /></>}</button><a href="/" className="text-link" style={{ marginTop: 20 }}>Back to storefront</a></form></main>;
}
