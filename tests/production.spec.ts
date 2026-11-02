import { test, expect } from '@playwright/test';

test('public config, SEO, and PWA routes respond', async ({ request, page }) => {
  const config = await (await request.get('/api/config')).json();
  expect(config.payments).toEqual({ paystack: false, flutterwave: false });
  expect(config.studioAuth).toBe(false);
  const manifest = await (await request.get('/manifest.webmanifest')).json();
  expect(manifest.name).toBe('Top9javintage');
  const robots = await (await request.get('/robots.txt')).text();
  expect(robots).toContain('Disallow: /studio');
  const sitemap = await (await request.get('/sitemap.xml')).text();
  expect(sitemap).toContain('/product/archive-graphic-tee');
  await page.goto('/product/archive-graphic-tee');
  await expect(page).toHaveTitle(/Archive Graphic Tee/);
  expect(await page.locator('script[type="application/ld+json"]').count()).toBeGreaterThan(0);
});

test('demo checkout creates an order and studio can update its status', async ({ request }) => {
  const checkout = await request.post('/api/checkout', { data: {
    customer: { name: 'Status Test', email: 'status@example.com', phone: '08012345678', state: 'Lagos', city: 'Ikeja', address: '12 Test Street, Ikeja' },
    items: [{ productId: 'archive-graphic-tee', color: 'Washed Black', size: 'S', quantity: 1 }],
    payment: 'Paystack (demo)',
  }});
  expect(checkout.status()).toBe(201);
  const order = await checkout.json();
  expect(order.status).toBe('Demo order');
  const patch = await request.patch(`/api/orders/${order.id}`, { data: { status: 'Processing' } });
  expect(patch.status()).toBe(200);
  expect((await patch.json()).status).toBe('Processing');
  const orders = await (await request.get('/api/orders')).json();
  expect(orders.find((o: { id: string }) => o.id === order.id).status).toBe('Processing');
});

test('webhooks reject unconfigured or unsigned requests', async ({ request }) => {
  const paystack = await request.post('/api/webhooks/paystack', { data: { event: 'charge.success' }, headers: { 'x-paystack-signature': 'bad' } });
  expect([401, 503]).toContain(paystack.status());
  const flutterwave = await request.post('/api/webhooks/flutterwave', { data: { data: { status: 'successful' } }, headers: { 'verif-hash': 'bad' } });
  expect([401, 503]).toContain(flutterwave.status());
});

test('brand pages and logo assets are available', async ({ request }) => {
  for (const path of ['/about', '/journal', '/brand/logo-mark.png', '/brand/logo-wordmark.png', '/brand/logo-full.png']) {
    expect((await request.get(path)).status()).toBe(200);
  }
});
