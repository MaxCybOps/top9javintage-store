import { NextResponse } from 'next/server';
import { getProducts, mutateProducts } from '@/lib/store';
import { type Product } from '@/lib/types';
import { validateProduct, normalizeMedia } from '@/lib/product-validation';
import { requireStudio } from '@/lib/auth';
export const dynamic = 'force-dynamic';
export async function GET() { return NextResponse.json(await getProducts()); }
export async function POST(request: Request) {
 const denied = await requireStudio(); if (denied) return denied;
 try {
  const input = await request.json() as Product;
  const p = normalizeMedia(input);
  const error = validateProduct(p);
  if (error) return NextResponse.json({error},{status:400});
  const base = p.title.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'') || 'good-find';
  const id = `${base}-${crypto.randomUUID().slice(0,6)}`;
  const product: Product = {...p,id,slug:id,createdAt:new Date().toISOString(),rating:0,reviews:0,sold:0,featured:false};
  await mutateProducts(products => [product,...products]);
  return NextResponse.json(product,{status:201});
 } catch { return NextResponse.json({error:'Could not save this product. Please try again.'},{status:500}); }
}
