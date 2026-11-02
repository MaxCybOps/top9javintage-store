import Link from 'next/link';
import { Check, AlertCircle } from 'lucide-react';
import { findOrderByReference, updateOrder } from '@/lib/store';
import { verifyPayment, type Gateway } from '@/lib/payments';
import { money } from '@/lib/utils';
export const dynamic = 'force-dynamic';
export const metadata = { title: 'Payment verification — Top9javintage', robots: { index: false, follow: false } };
export default async function VerifyPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const params = await searchParams;
  const reference = String(params.reference || params.tx_ref || '');
  const gateway = (String(params.gateway || '') as Gateway) || (params.tx_ref ? 'flutterwave' : 'paystack');
  const order = reference ? await findOrderByReference(reference) : null;
  let paid = order?.status === 'Paid';
  if (order && !paid && (gateway === 'paystack' || gateway === 'flutterwave')) {
    const ok = await verifyPayment(order, gateway);
    if (ok) { await updateOrder(order.id, { status: 'Paid', paidAt: new Date().toISOString(), gateway }); paid = true; }
  }
  return <main className="page-width confirmation-page"><div className="confirmation-card"><div className="confirmation-check">{paid ? <Check size={33} /> : <AlertCircle size={33} />}</div><span className="eyebrow">TOP9JAVINTAGE CHECKOUT</span><h1>{paid ? 'Payment confirmed.' : 'We’re checking your payment.'}</h1><p>{paid ? 'Your order is paid and ready for the next step. Keep your reference handy.' : 'If you completed payment, it may take a moment to confirm. You can contact the store with your reference.'}</p>{order && <div className="confirmation-details"><div><span>Order reference</span><strong>{order.reference}</strong></div><div><span>Total</span><strong>{money(order.total)}</strong></div><div><span>Status</span><strong>{paid ? 'Paid' : order.status}</strong></div></div>}<Link href="/#collection" className="btn btn-dark w-full mt-4">Keep finding good things</Link></div></main>;
}
