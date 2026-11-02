import { NextResponse } from 'next/server';
import { getOrders } from '@/lib/store';
import { requireStudio } from '@/lib/auth';
export const dynamic='force-dynamic';
export async function GET(){ const denied=await requireStudio(); if(denied)return denied; return NextResponse.json(await getOrders()); }
