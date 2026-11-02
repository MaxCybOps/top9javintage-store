import { createHash, createHmac, timingSafeEqual } from 'crypto';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export const STUDIO_COOKIE = 't9j_studio_session';
const SESSION_MS = 1000 * 60 * 60 * 24 * 7;

export function studioAuthEnabled() { return Boolean(process.env.STUDIO_PASSWORD); }
function sessionSecret() {
  return process.env.STUDIO_SESSION_SECRET || createHash('sha256').update(`top9javintage:${process.env.STUDIO_PASSWORD || ''}`).digest('hex');
}
function sign(payload: string) { return createHmac('sha256', sessionSecret()).update(payload).digest('base64url'); }
export function createSessionToken() {
  const payload = Buffer.from(JSON.stringify({ exp: Date.now() + SESSION_MS })).toString('base64url');
  return `${payload}.${sign(payload)}`;
}
export function verifySessionToken(token?: string) {
  if (!token) return false;
  const [payload, signature] = token.split('.');
  if (!payload || !signature) return false;
  const expected = sign(payload);
  const a = Buffer.from(signature), b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return false;
  try { const data = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8')); return typeof data.exp === 'number' && data.exp > Date.now(); } catch { return false; }
}
export function passwordMatches(input: string) {
  const expected = process.env.STUDIO_PASSWORD || '';
  if (!expected) return false;
  const a = Buffer.from(input), b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}
export async function isStudioAuthed() {
  if (!studioAuthEnabled()) return true; // open demo mode when no password is configured
  const jar = await cookies();
  return verifySessionToken(jar.get(STUDIO_COOKIE)?.value);
}
export async function requireStudio() {
  if (await isStudioAuthed()) return null;
  return NextResponse.json({ error: 'Studio login required.' }, { status: 401 });
}
export const sessionCookieOptions = {
  httpOnly: true, sameSite: 'lax' as const, path: '/',
  secure: process.env.NODE_ENV === 'production', maxAge: SESSION_MS / 1000,
};
