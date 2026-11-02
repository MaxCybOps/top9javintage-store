import { NextResponse } from 'next/server';
import { paymentConfig } from '@/lib/payments';
import { studioAuthEnabled } from '@/lib/auth';
export const dynamic = 'force-dynamic';
export async function GET() {
  return NextResponse.json({ payments: paymentConfig(), studioAuth: studioAuthEnabled(), whatsapp: Boolean(process.env.NEXT_PUBLIC_WHATSAPP_NUMBER) });
}
