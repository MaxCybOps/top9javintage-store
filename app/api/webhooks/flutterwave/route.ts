import { NextResponse } from 'next/server';
import { findOrderByReference, updateOrder } from '@/lib/store';
import { verifyPayment } from '@/lib/payments';
export async function POST(request: Request) {
  const hash = process.env.FLUTTERWAVE_WEBHOOK_HASH;
  if (!hash) return NextResponse.json({ error: 'Not configured.' }, { status: 503 });
  if (request.headers.get('verif-hash') !== hash) return NextResponse.json({ error: 'Invalid signature.' }, { status: 401 });
  try {
    const event = await request.json();
    const data = event.data || event;
    const reference = data.tx_ref || data.txRef;
    const order = reference ? await findOrderByReference(reference) : null;
    if (order && order.status !== 'Paid' && (data.status === 'successful' || event.event === 'charge.completed') && await verifyPayment(order, 'flutterwave')) {
      await updateOrder(order.id, { status: 'Paid', paidAt: new Date().toISOString(), gateway: 'flutterwave', gatewayReference: String(data.id || reference) });
    }
    return NextResponse.json({ ok: true });
  } catch { return NextResponse.json({ error: 'Invalid payload.' }, { status: 400 }); }
}
