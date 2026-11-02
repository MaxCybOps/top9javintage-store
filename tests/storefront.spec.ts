import { test, expect } from '@playwright/test';
import path from 'path';

test('search, collection filters, sorting, and infinite scroll work', async ({ page }) => {
  await page.goto('/');
  const search = page.locator('.desktop-search input');
  await search.fill('vintage tee'); await search.press('Enter');
  await expect(page.locator('.catalog-heading h2')).toContainText('vintage tee');
  await expect(page.locator('.product-card').first()).toBeVisible();
  await page.getByRole('button', { name: 'Clear all', exact: true }).click();
  await page.getByRole('tab', { name: 'Fit videos' }).click();
  await expect(page.getByRole('tab', { name: 'Fit videos' })).toHaveAttribute('aria-selected','true');
  await expect(page.locator('.product-card').first()).toBeVisible();
  expect(await page.locator('.product-card .video-badge').count()).toBe(await page.locator('.product-card').count());
  await page.getByRole('tab', { name: 'All pieces' }).click();
  await page.getByLabel('Sort products').selectOption('price-low');
  const prices = await page.locator('.product-card .price').allTextContents();
  const values = prices.map(x => Number(x.replace(/[^\d]/g,'')));
  expect(values).toEqual([...values].sort((a,b)=>a-b));
  await page.locator('.catalog-end').scrollIntoViewIfNeeded();
  await expect(page.locator('.product-card')).toHaveCount(12);
  await page.locator('.catalog-end').scrollIntoViewIfNeeded();
  await expect(page.locator('.product-card')).toHaveCount(16);
});

test('quick add, variant stock, cart quantities, and Nigerian demo checkout work', async ({ page }) => {
  await page.goto('/product/archive-graphic-tee');
  await page.getByRole('button', { name: 'Colour: Chalk' }).click();
  await expect(page.getByRole('button', { name: 'Size XXL, sold out' })).toBeDisabled();
  await page.getByRole('button', { name: 'Size M', exact: true }).click();
  await page.getByRole('button', { name: 'Add to bag', exact: true }).click();
  await expect(page.getByRole('dialog', { name: 'Your bag (1)' })).toBeVisible();
  await page.getByRole('button', { name: 'Increase Archive Graphic Tee quantity' }).click();
  await expect(page.locator('.cart-subtotal strong')).toHaveText('₦37,000');
  await page.getByRole('link', { name: 'Let’s check out' }).click();
  await page.getByLabel('Full name').fill('Ada Test');
  await page.getByLabel('Email address', { exact: true }).fill('ada@example.com');
  await page.getByLabel('Phone number').fill('08012345678');
  await page.getByLabel('Delivery state').selectOption('Lagos');
  await page.getByLabel('City / town').fill('Ikeja');
  await page.getByLabel('Street address').fill('12 Test Street, Ikeja');
  await page.getByRole('button', { name: /Place demo order/ }).click();
  await expect(page.getByRole('heading', { name: 'That’s a good look.' })).toBeVisible();
  await expect(page.locator('.confirmation-card')).toContainText('No payment was taken');
  await expect(page.locator('.bag-count')).toHaveText('0');
  await expect(page.locator('.confirmation-details')).toContainText('₦40,500');
});

test('wishlist and cart persist across reloads', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Save Archive Graphic Tee', exact: true }).click();
  await page.reload();
  await expect(page.getByRole('button', { name: 'Unsave Archive Graphic Tee', exact: true })).toHaveAttribute('aria-pressed','true');
  await page.getByRole('button', { name: 'Quick add Archive Graphic Tee', exact: true }).click();
  await page.getByRole('button', { name: 'Add to bag', exact: true }).click();
  await page.getByRole('button', { name: 'Close Your bag (1)' }).click();
  await page.reload();
  await expect(page.locator('.bag-count')).toHaveText('1');
});

test('native fit film plays in view and supports mute controls', async ({ page }) => {
  await page.goto('/product/archive-graphic-tee?media=video');
  const video = page.locator('.gallery-main video');
  await expect(video).toBeVisible();
  await expect.poll(() => video.evaluate((v: HTMLVideoElement) => v.readyState)).toBeGreaterThan(1);
  await expect.poll(() => video.evaluate((v: HTMLVideoElement) => v.paused)).toBe(false);
  expect(await video.evaluate((v: HTMLVideoElement) => v.muted)).toBe(true);
  await page.getByRole('button', { name: 'Unmute video', exact: true }).click();
  expect(await video.evaluate((v: HTMLVideoElement) => v.muted)).toBe(false);
  await page.getByRole('button', { name: 'Pause video', exact: true }).click();
  expect(await video.evaluate((v: HTMLVideoElement) => v.paused)).toBe(true);
});

test('studio bulk uploads, publishes, edits, and deletes a product', async ({ page }) => {
  await page.goto('/studio');
  await page.locator('.studio-quick-add').click();
  const title = `QA Archive Tee ${Date.now()}`;
  await page.getByLabel('Product title').fill(title);
  await page.getByLabel('The story / description').fill('A test product with photos, a fit film, and size variants.');
  await page.getByLabel('Selling price (₦)').fill('15000');
  await page.getByLabel('Original price (₦, optional)').fill('20000');
  await page.locator('input[type=file]').setInputFiles([
    path.join(process.cwd(),'public/images/graphic-tee.webp'),
    path.join(process.cwd(),'public/images/graphic-tee-detail.webp'),
    path.join(process.cwd(),'public/videos/fit-film.mp4'),
  ]);
  await expect(page.locator('.media-tile')).toHaveCount(3);
  await page.getByRole('button', { name: 'Publish this find' }).click();
  await expect(page.getByRole('heading', { name: 'Your good finds.' })).toBeVisible();
  await expect(page.locator('.inventory-table')).toContainText(title);
  await page.getByRole('button', { name: `Edit ${title}`, exact: true }).click();
  await page.getByLabel('Selling price (₦)').fill('16000');
  await page.getByRole('button', { name: 'Save changes' }).click();
  await expect(page.locator('.inventory-table tr').filter({hasText:title})).toContainText('₦16,000');
  await page.getByRole('button', { name: `Delete ${title}`, exact: true }).click();
  await page.getByRole('button', { name: 'Remove product', exact: true }).click();
  await expect(page.locator('.inventory-table')).not.toContainText(title);
});

test('mobile navigation and key pages have no horizontal overflow', async ({ page }) => {
  await page.setViewportSize({width:390,height:844});
  for (const route of ['/', '/product/archive-graphic-tee', '/wishlist', '/checkout', '/studio']) {
    await page.goto(route);
    await expect(page.locator('body')).toBeVisible();
    const dimensions = await page.evaluate(() => ({scroll:document.documentElement.scrollWidth,viewport:innerWidth}));
    expect(dimensions.scroll, route).toBeLessThanOrEqual(dimensions.viewport);
  }
  await page.goto('/');
  await page.waitForLoadState('networkidle');
  await page.getByRole('button', {name:'Open navigation'}).click();
  await expect(page.getByRole('dialog', {name:'Find your next favourite'})).toBeVisible();
  await page.locator('.navigation-drawer').getByRole('link', {name:'Footwear',exact:true}).click();
  await expect(page.locator('.catalog-heading h2')).toHaveText('Footwear');
});
