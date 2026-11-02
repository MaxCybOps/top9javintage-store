import { NextResponse } from 'next/server';
import { createHmac, timingSafeEqual } from 'crypto';
import { findOrderByReference, updateOrder } from '@/lib/store';
import { verifyPayment } from '@/lib/payments';
export async function POST(request: Request) {
  const secret = process.env.PAYSTACK_SECRET_KEY;
  if (!secret) return NextResponse.json({ error: 'Not configured.' }, { status: 503 });
  const raw = await request.text();
  const signature = request.headers.get('x-paystack-signature') || '';
  const expected = createHmac('sha512', secret).update(raw).digest('hex');
  const a = Buffer.from(signature), b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return NextResponse.json({ error: 'Invalid signature.' }, { status: 401 });
  try {
    const event = JSON.parse(raw);
    if (event.event !== 'charge.success') return NextResponse.json({ ok: true });
    const reference = event.data?.reference;
    const order = reference ? await findOrderByReference(reference) : null;
    if (order && order.status !== 'Paid' && await verifyPayment(order, 'paystack')) {
      await updateOrder(order.id, { status: 'Paid', paidAt: new Date().toISOString(), gateway: 'paystack', gatewayReference: String(event.data?.id || reference) });
    }
    return NextResponse.json({ ok: true });
  } catch { return NextResponse.json({ error: 'Invalid payload.' }, { status: 400 }); }
}
