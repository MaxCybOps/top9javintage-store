import { NextResponse } from 'next/server';
import { getProduct, saveOrder } from '@/lib/store';
import { type CartItem, type Order, variantKey } from '@/lib/types';
import { deliveryFee, NIGERIAN_STATES } from '@/lib/utils';
import { gatewayForPayment, initializePayment, paymentConfig, siteUrlFromRequest } from '@/lib/payments';
export async function POST(request: Request) {
  try {
    const body = await request.json(); const { customer, items, payment } = body as { customer: Order['customer']; items: CartItem[]; payment: string };
    if (!customer || !items?.length || items.length > 50) return NextResponse.json({ error: 'Your bag is empty or the order is invalid.' }, { status: 400 });
    for (const key of ['name','email','phone','state','city','address'] as const) if (!customer[key]?.trim()) return NextResponse.json({ error: 'Please complete your contact and delivery details.' }, { status: 400 });
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer.email) || !/^\+?[\d\s()-]{10,18}$/.test(customer.phone) || !NIGERIAN_STATES.includes(customer.state)) return NextResponse.json({ error: 'Please check your email, phone number, and Nigerian delivery state.' }, { status: 400 });
    const gateway = gatewayForPayment(payment || '');
    if (!gateway && payment !== 'WhatsApp') return NextResponse.json({ error: 'Choose a valid order method.' }, { status: 400 });
    const config = paymentConfig();
    const live = Boolean(gateway && config[gateway]);
    const lines = [];
    for (const item of items) {
      const p = await getProduct(item.productId);
      if (!p || !Number.isInteger(item.quantity) || item.quantity < 1 || item.quantity > 20 || (p.inventory[variantKey(item.color, item.size)] || 0) < item.quantity) return NextResponse.json({ error: 'An item or variant is no longer available in that quantity. Please update your bag.' }, { status: 409 });
      lines.push({ productId: p.id, title: p.title, image: p.images[0], color: item.color, size: item.size, quantity: item.quantity, price: p.price });
    }
    const subtotal = lines.reduce((sum, l) => sum + l.price * l.quantity, 0); const shipping = deliveryFee(customer.state, subtotal);
    const order: Order = {
      id: crypto.randomUUID(), reference: `T9J-${Date.now().toString(36).toUpperCase()}`, createdAt: new Date().toISOString(),
      status: payment === 'WhatsApp' ? 'Awaiting confirmation' : live ? 'Awaiting payment' : 'Demo order',
      customer, items: lines, subtotal, shipping, total: subtotal + shipping,
      payment: gateway ? (live ? (gateway === 'paystack' ? 'Paystack' : 'Flutterwave') : `${gateway === 'paystack' ? 'Paystack' : 'Flutterwave'} (demo)`) : 'WhatsApp',
      gateway: live && gateway ? gateway : undefined,
    };
    await saveOrder(order);
    if (live && gateway) {
      try { const redirectUrl = await initializePayment(order, gateway, siteUrlFromRequest(request)); return NextResponse.json({ ...order, redirectUrl }, { status: 201 }); }
      catch (err) { return NextResponse.json({ error: err instanceof Error ? err.message : 'Could not start payment. Your order was saved as awaiting payment.' }, { status: 502 }); }
    }
    return NextResponse.json(order, { status: 201 });
  } catch { return NextResponse.json({ error: 'We could not create your order. Please try again.' }, { status: 500 }); }
}
