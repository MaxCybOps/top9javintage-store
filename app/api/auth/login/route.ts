import { NextResponse } from 'next/server';
import { createSessionToken, passwordMatches, sessionCookieOptions, STUDIO_COOKIE, studioAuthEnabled } from '@/lib/auth';
const attempts = new Map<string, { count: number; reset: number }>();
export async function POST(request: Request) {
  if (!studioAuthEnabled()) return NextResponse.json({ ok: true, demo: true });
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'local';
  const now = Date.now(); const entry = attempts.get(ip);
  if (entry && entry.reset > now && entry.count >= 8) return NextResponse.json({ error: 'Too many attempts. Try again in a few minutes.' }, { status: 429 });
  try {
    const { password } = await request.json();
    if (typeof password !== 'string' || !passwordMatches(password)) {
      attempts.set(ip, { count: (entry && entry.reset > now ? entry.count : 0) + 1, reset: now + 15 * 60 * 1000 });
      return NextResponse.json({ error: 'That password doesn’t match.' }, { status: 401 });
    }
    attempts.delete(ip);
    const res = NextResponse.json({ ok: true });
    res.cookies.set(STUDIO_COOKIE, createSessionToken(), sessionCookieOptions);
    return res;
  } catch { return NextResponse.json({ error: 'Could not sign in.' }, { status: 400 }); }
}
