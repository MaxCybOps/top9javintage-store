import { type Product, type Category, type Gender, type Color, CLOTHING_SIZES, SHOE_SIZES, variantKey } from './types';
const black: Color = { name: 'Washed Black', hex: '#353532' };
const white: Color = { name: 'Chalk', hex: '#eeece5' };
const olive: Color = { name: 'Olive', hex: '#666c49' };
const brown: Color = { name: 'Tan', hex: '#b58250' };
const blue: Color = { name: 'Vintage Blue', hex: '#6c8497' };
type SeedInput = { id: string; title: string; price: number; compareAt?: number; image: string; category: Category; gender?: Gender; colors?: Color[]; sizes?: string[]; badge?: Product['badge']; video?: string; rating?: number; reviews?: number; sold?: number; description?: string };
function make(p: SeedInput, index: number): Product {
 const sizes = p.sizes || (p.category === 'Footwear' ? SHOE_SIZES : p.category === 'Accessories' ? ['One size'] : CLOTHING_SIZES);
 const colors = p.colors || [black, white];
 const inventory: Record<string, number> = {};
 colors.forEach((c, ci) => sizes.forEach((s, si) => { inventory[variantKey(c.name, s)] = (ci === 1 && si === sizes.length - 1) || (p.badge === 'Limited Stock' && si > 2) ? 0 : 3 + ((index + si) % 7); }));
 return { id: p.id, slug: p.id, title: p.title, price: p.price, compareAt: p.compareAt, category: p.category, gender: p.gender || 'Unisex', images: [`/images/${p.image}.webp`, `/images/${p.image}-detail.webp`], video: p.video, colors, sizes, inventory, badge: p.badge, rating: p.rating || 4.8, reviews: p.reviews || 24 + index * 7, sold: p.sold || 70 + index * 23, createdAt: new Date(Date.UTC(2026, 9, 30 - index)).toISOString(), featured: index < 8, description: p.description || 'A future favourite for your everyday rotation. Easy to style, made to stand out, and selected for that perfectly lived-in feel. Thoughtful details, a relaxed silhouette, and endless ways to make it your own.' };
}
export const seedProducts: Product[] = [
 { id:'archive-graphic-tee', title:'Archive Graphic Tee', price:18500, compareAt:25000, image:'graphic-tee', category:'Unisex Clothing', colors:[black,white,blue], badge:'Flash Sale', video:'/videos/fit-film.mp4', rating:4.9, reviews:128, sold:340, description:'The tee that starts a conversation. Our archive-inspired graphic tee brings a perfectly boxy silhouette, soft cotton feel, and a print with main-character energy. Wear it oversized, tuck it in, or layer it your way.' },
 { id:'retro-court-sneakers', title:'Retro Court Sneakers', price:42000, image:'retro-runner', category:'Footwear', colors:[brown,black,white], badge:'Hot Drop', rating:4.8, reviews:96, sold:280 },
 { id:'utility-cargo-pants', title:'Utility Cargo Pants', price:28500, compareAt:36000, image:'utility-cargo', category:'Unisex Clothing', colors:[olive,black], badge:'Flash Sale', video:'/videos/street-film.mp4', rating:4.9, reviews:84, sold:250 },
 { id:'vintage-leather-jacket', title:'Vintage Leather Jacket', price:48000, image:'jacket', category:'Vintage Drops', colors:[black,brown], badge:'Limited Stock', rating:4.9, reviews:42, sold:98 },
 { id:'essential-boxy-tee', title:'Essential Boxy Tee', price:14500, image:'oversized-tee', category:'Unisex Clothing', colors:[white,black], badge:'Hot Drop', video:'/videos/fit-film.mp4', rating:4.7, reviews:67 },
 { id:'off-duty-hoodie', title:'Off-Duty Hoodie', price:26500, compareAt:32000, image:'hoodie', category:'Unisex Clothing', colors:[{name:'Heather Grey',hex:'#aaa9a4'},black], badge:'Flash Sale', rating:4.8, reviews:53 },
 { id:'straight-leg-denim', title:'Straight-Leg Denim', price:32000, image:'denim', category:'Everything Clothes', gender:'Men', colors:[blue,black], rating:4.8, reviews:76 },
 { id:'city-daypack', title:'The City Daypack', price:22500, image:'bag', category:'Accessories', colors:[{name:'Midnight',hex:'#303846'},black], badge:'Hot Drop', rating:4.7, reviews:39 },
 { id:'amber-bomber-jacket', title:'Amber Bomber Jacket', price:38500, compareAt:45000, image:'jacket-detail', category:'Vintage Drops', colors:[brown,olive], badge:'Flash Sale', rating:4.8, reviews:31 },
 { id:'gold-tone-chain-set', title:'Gold-Tone Chain Set', price:12500, image:'chain', category:'Accessories', gender:'Women', colors:[{name:'Gold',hex:'#c7a659'}], badge:'Limited Stock', rating:4.6, reviews:22 },
 { id:'classic-trucker-cap', title:'Classic Trucker Cap', price:9500, image:'cap', category:'Accessories', colors:[white,black,olive], rating:4.7, reviews:46 },
 { id:'retro-round-sunglasses', title:'Retro Round Sunglasses', price:15000, image:'sunglasses', category:'Accessories', colors:[{name:'Gold / Green',hex:'#787b5c'}], badge:'Hot Drop', rating:4.8, reviews:29 },
 { id:'heritage-leather-boots', title:'Heritage Leather Boots', price:45000, image:'boots', category:'Footwear', colors:[brown,black], badge:'Limited Stock', rating:4.9, reviews:36 },
 { id:'everyday-leather-shoes', title:'Everyday Leather Shoes', price:35000, compareAt:42000, image:'loafers', category:'Footwear', gender:'Men', colors:[brown], badge:'Flash Sale', rating:4.7, reviews:18 },
 { id:'fringe-knit-poncho', title:'Fringe Knit Poncho', price:24000, image:'knit', category:'Everything Clothes', gender:'Women', colors:[white,brown], rating:4.8, reviews:21 },
 { id:'heritage-chronograph', title:'Heritage Chronograph', price:32500, image:'watch', category:'Accessories', gender:'Men', colors:[brown,black], badge:'Limited Stock', rating:4.9, reviews:17 },
].map((p, i) => make(p as SeedInput, i));
