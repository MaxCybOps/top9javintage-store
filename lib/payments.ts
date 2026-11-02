import { type Order } from './types';
export type Gateway = 'paystack' | 'flutterwave';
export function paymentConfig() {
  return { paystack: Boolean(process.env.PAYSTACK_SECRET_KEY), flutterwave: Boolean(process.env.FLUTTERWAVE_SECRET_KEY) };
}
export function gatewayForPayment(payment: string): Gateway | null {
  const p = payment.toLowerCase();
  if (p.startsWith('paystack')) return 'paystack';
  if (p.startsWith('flutterwave')) return 'flutterwave';
  return null;
}
export function siteUrlFromRequest(request: Request) {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, '');
  const host = request.headers.get('x-forwarded-host') || request.headers.get('host') || 'localhost:3000';
  const proto = request.headers.get('x-forwarded-proto') || 'http';
  return `${proto}://${host}`;
}
export async function initializePayment(order: Order, gateway: Gateway, baseUrl: string): Promise<string> {
  const callback = `${baseUrl}/checkout/verify?gateway=${gateway}&reference=${encodeURIComponent(order.reference)}`;
  if (gateway === 'paystack') {
    const res = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST', headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: order.customer.email, amount: order.total * 100, currency: 'NGN', reference: order.reference, callback_url: callback, metadata: { order_id: order.id, cart_items: order.items.length } }),
    });
    const data = await res.json();
    if (!res.ok || !data.status || !data.data?.authorization_url) throw new Error(data.message || 'Paystack could not start this payment.');
    return data.data.authorization_url as string;
  }
  const res = await fetch('https://api.flutterwave.com/v3/payments', {
    method: 'POST', headers: { Authorization: `Bearer ${process.env.FLUTTERWAVE_SECRET_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ tx_ref: order.reference, amount: order.total, currency: 'NGN', redirect_url: callback, customer: { email: order.customer.email, name: order.customer.name, phonenumber: order.customer.phone }, customizations: { title: 'Top9javintage', description: `Order ${order.reference}` } }),
  });
  const data = await res.json();
  if (!res.ok || data.status !== 'success' || !data.data?.link) throw new Error(data.message || 'Flutterwave could not start this payment.');
  return data.data.link as string;
}
export async function verifyPayment(order: Order, gateway: Gateway): Promise<boolean> {
  try {
    if (gateway === 'paystack') {
      const res = await fetch(`https://api.paystack.co/transaction/verify/${encodeURIComponent(order.reference)}`, { headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}` }, cache: 'no-store' });
      const data = await res.json();
      return Boolean(res.ok && data.status && data.data?.status === 'success' && data.data?.currency === 'NGN' && data.data?.amount === order.total * 100);
    }
    const res = await fetch(`https://api.flutterwave.com/v3/transactions/verify_by_reference?tx_ref=${encodeURIComponent(order.reference)}`, { headers: { Authorization: `Bearer ${process.env.FLUTTERWAVE_SECRET_KEY}` }, cache: 'no-store' });
    const data = await res.json();
    return Boolean(res.ok && data.status === 'success' && data.data?.status === 'successful' && data.data?.currency === 'NGN' && Number(data.data?.amount) === order.total);
  } catch { return false; }
}
