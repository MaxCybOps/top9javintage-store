import { NextResponse } from 'next/server';
import { getProduct, mutateProducts } from '@/lib/store';
import { type Product } from '@/lib/types';
import { validateProduct, normalizeMedia } from '@/lib/product-validation';
import { requireStudio } from '@/lib/auth';
export async function PATCH(request: Request,{params}:{params:Promise<{id:string}>}) {
 const denied = await requireStudio(); if (denied) return denied;
 const {id}=await params;
 const existing=await getProduct(id);
 if(!existing) return NextResponse.json({error:'Product not found.'},{status:404});
 try {
  const body=await request.json();
  const p=normalizeMedia({...existing,...body,id,slug:existing.slug,createdAt:existing.createdAt,rating:existing.rating,reviews:existing.reviews,sold:existing.sold,featured:existing.featured} as Product);
  const error=validateProduct(p);
  if(error) return NextResponse.json({error},{status:400});
  await mutateProducts(products=>products.map(x=>x.id===id?p:x));
  return NextResponse.json(p);
 } catch { return NextResponse.json({error:'Could not update product.'},{status:500}); }
}
export async function DELETE(_request: Request,{params}:{params:Promise<{id:string}>}) {
 const denied = await requireStudio(); if (denied) return denied;
 const {id}=await params;
 if(!await getProduct(id)) return NextResponse.json({error:'Product not found.'},{status:404});
 await mutateProducts(products=>products.filter(p=>p.id!==id));
 return NextResponse.json({ok:true});
}
