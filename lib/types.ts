export type Category = 'Unisex Clothing' | 'Footwear' | 'Accessories' | 'Vintage Drops' | 'Everything Clothes';
export type Gender = 'Men' | 'Women' | 'Unisex';
export type Color = { name: string; hex: string };
export type Product = {
  id: string; slug: string; title: string; description: string; category: Category; gender: Gender;
  price: number; compareAt?: number; images: string[]; video?: string; videos?: string[]; colors: Color[]; sizes: string[];
  inventory: Record<string, number>; badge?: 'Flash Sale' | 'Hot Drop' | 'Limited Stock';
  rating: number; reviews: number; sold: number; createdAt: string; featured?: boolean;
};
export type CartItem = { productId: string; color: string; size: string; quantity: number };
export type CartLine = CartItem & { product: Product; key: string };
export const ORDER_STATUSES = ['Demo order','Awaiting confirmation','Awaiting payment','Paid','Processing','Shipped','Delivered','Cancelled'] as const;
export type OrderStatus = typeof ORDER_STATUSES[number];
export type Order = {
  id: string; reference: string; createdAt: string; status: OrderStatus; statusUpdatedAt?: string;
  customer: { name: string; email: string; phone: string; state: string; city: string; address: string };
  items: { productId: string; title: string; image: string; color: string; size: string; quantity: number; price: number }[];
  subtotal: number; shipping: number; total: number; payment: string;
  gateway?: 'paystack' | 'flutterwave'; gatewayReference?: string; paidAt?: string;
};
export const CATEGORIES: Category[] = ['Unisex Clothing', 'Footwear', 'Accessories', 'Vintage Drops', 'Everything Clothes'];
export const CLOTHING_SIZES = ['S', 'M', 'L', 'XL', 'XXL'];
export const SHOE_SIZES = ['38', '39', '40', '41', '42', '43', '44', '45'];
export const variantKey = (color: string, size: string) => `${color}:${size}`;
export const totalStock = (p: Product) => Object.values(p.inventory).reduce((a, b) => a + b, 0);
