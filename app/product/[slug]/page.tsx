import { notFound } from 'next/navigation';
import { getProduct, getProducts } from '@/lib/store';
import { ProductDetail } from '@/components/product-detail';
import { ProductExtras } from '@/components/product-extras';
import { totalStock } from '@/lib/types';
export const dynamic = 'force-dynamic';
export async function generateMetadata({ params }: { params: Promise<{slug:string}> }) {
  const {slug}=await params; const p=await getProduct(slug);
  if(!p) return {title:'Piece not found'};
  return { title:p.title, description:p.description.slice(0,160), openGraph:{title:p.title,description:p.description.slice(0,160),images:p.images.slice(0,1)}, twitter:{card:'summary_large_image',title:p.title,images:p.images.slice(0,1)} };
}
export default async function ProductPage({ params }: { params: Promise<{slug:string}> }) {
  const {slug}=await params; const product=await getProduct(slug); if(!product) notFound();
  const products=await getProducts(); const related=products.filter(p=>p.id!==product.id).sort((a,b)=>Number(b.category===product.category)-Number(a.category===product.category));
  const jsonLd={'@context':'https://schema.org','@type':'Product',name:product.title,description:product.description,image:product.images,sku:product.id,brand:{'@type':'Brand',name:'Top9javintage'},offers:{'@type':'Offer',priceCurrency:'NGN',price:product.price,availability:totalStock(product)>0?'https://schema.org/InStock':'https://schema.org/OutOfStock'}};
  return <main><script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(jsonLd)}} /><ProductDetail product={product} related={related} /><div className="page-width"><ProductExtras product={product} /></div></main>;
}
