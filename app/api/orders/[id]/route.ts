import { NextResponse } from 'next/server';
import { updateOrder } from '@/lib/store';
import { requireStudio } from '@/lib/auth';
import { ORDER_STATUSES, type OrderStatus } from '@/lib/types';
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const denied = await requireStudio(); if (denied) return denied;
  const { id } = await params;
  try {
    const { status } = await request.json();
    if (!ORDER_STATUSES.includes(status as OrderStatus)) return NextResponse.json({ error: 'Choose a valid order status.' }, { status: 400 });
    const order = await updateOrder(id, { status, statusUpdatedAt: new Date().toISOString() });
    if (!order) return NextResponse.json({ error: 'Order not found.' }, { status: 404 });
    return NextResponse.json(order);
  } catch { return NextResponse.json({ error: 'Could not update this order.' }, { status: 500 }); }
}
