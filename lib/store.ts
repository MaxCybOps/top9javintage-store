import { promises as fs } from 'fs';
import path from 'path';
import { seedProducts } from './seed';
import { type Product, type Order } from './types';
const dataDir = path.join(process.cwd(), 'data');
let productQueue: Promise<unknown> = Promise.resolve();
let orderQueue: Promise<unknown> = Promise.resolve();
async function readJson<T>(name: string, fallback: T): Promise<T> {
 try { return JSON.parse(await fs.readFile(path.join(dataDir, name), 'utf8')); } catch { return fallback; }
}
async function writeJson(name: string, value: unknown) {
 await fs.mkdir(dataDir, { recursive: true });
 const file = path.join(dataDir, name);
 await fs.writeFile(`${file}.tmp`, JSON.stringify(value, null, 2));
 await fs.rename(`${file}.tmp`, file);
}
export async function getProducts(): Promise<Product[]> { return readJson('products.json', seedProducts); }
export async function getProduct(id: string) { return (await getProducts()).find(p => p.id === id || p.slug === id); }
export async function mutateProducts(fn: (products: Product[]) => Product[]) {
 const task = productQueue.then(async () => { const products = fn(await getProducts()); await writeJson('products.json', products); return products; });
 productQueue = task.catch(() => {});
 return task;
}
export async function getOrders(): Promise<Order[]> { return readJson('orders.json', []); }
export async function findOrderByReference(reference: string) { return (await getOrders()).find(o => o.reference === reference || o.gatewayReference === reference); }
export async function saveOrder(order: Order) {
 const task = orderQueue.then(async () => { await writeJson('orders.json', [order, ...(await getOrders())]); return order; });
 orderQueue = task.catch(() => {});
 return task;
}
export async function updateOrder(id: string, patch: Partial<Order>) {
 const task = orderQueue.then(async () => {
  const orders = await getOrders(); const index = orders.findIndex(o => o.id === id);
  if (index < 0) return null;
  const next = { ...orders[index], ...patch, id: orders[index].id, reference: orders[index].reference };
  orders[index] = next; await writeJson('orders.json', orders); return next;
 });
 orderQueue = task.catch(() => {});
 return task;
}
