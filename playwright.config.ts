import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir: './tests', timeout: 60000, expect: { timeout: 10000 }, fullyParallel: false, workers: 1,
  use: { baseURL: 'http://localhost:3000', headless: true, viewport: { width: 1440, height: 1000 }, screenshot: 'only-on-failure', trace: 'retain-on-failure' },
  webServer: { command: 'npm run dev -- -p 3000', url: 'http://localhost:3000', reuseExistingServer: true, timeout: 120000 },
});
