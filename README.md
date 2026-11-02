# Top9javintage

A mobile-first, image/video-led vintage streetwear storefront built with **Next.js 15, React 19, TypeScript, Tailwind CSS, and Lucide**.

> **Demo by default; live payments optional.** Catalog, prices, ratings, policies, and campaign media are illustrative. Without gateway keys, no payments are charged. With Paystack/Flutterwave keys configured, checkout redirects to the gateway and verifies payment server-side.

## Run locally

```bash
npm install
npm run dev -- -p 3000
```

Open `http://localhost:3000`.

```bash
npm run typecheck   # TypeScript
npm test            # Playwright end-to-end tests (starts/reuses dev server)
npm run build       # Production build
npm start           # Serve production build
```

For Playwright on a fresh machine: `npx playwright install --with-deps chromium`.

## Routes

| Route | Purpose |
| --- | --- |
| `/` | Campaign carousel, flash edit, category quick-nav, searchable/filterable infinite-scroll catalog |
| `/product/[slug]` | Multi-photo gallery, zoom lightbox, native fit films, variant/stock selection, delivery & returns |
| `/wishlist` | Saved pieces, persisted in the browser |
| `/checkout` | Nigerian delivery form, demo Paystack/Flutterwave selection, WhatsApp order request |
| `/studio` | Vendor dashboard: overview, inventory CRUD, bulk media upload, order status management, settings. Optional password protection. |
| `/checkout/verify` | Server-side payment verification callback page |
| `/api/webhooks/paystack` | Signed Paystack webhook receiver |
| `/api/webhooks/flutterwave` | Flutterwave webhook receiver (verif-hash) |

## What works

- Sticky header, mega menu, mobile navigation, live search suggestions, keyboard `/` search focus.
- Category, gender, size, price, video-availability, and stock filters; newest/price/best-seller sorting.
- Finite catalog infinite scroll with a manual load-more fallback.
- Quick-add modal and product detail variant selectors. Sold-out colour/size combinations are disabled.
- Persistent cart and wishlist (`localStorage`), quantity controls, variant-level stock limits, free-delivery progress.
- Native HTML5 video: lazy source loading, muted autoplay in view, loop, play/pause, tap-to-unmute, expand.
- Checkout validates Nigerian phone numbers and all 36 states + FCT. Orders are saved server-side and appear in the studio with editable fulfillment status.
- Optional live Paystack/Flutterwave checkout: activates only when secret keys are present; otherwise stays in demo mode.
- Optional studio login: set `STUDIO_PASSWORD` to protect `/studio` and mutating studio APIs with a signed, httpOnly session cookie.
- WhatsApp cart/order prefill. If no business number is configured, the UI asks for one instead of inventing a contact.
- Studio product create/edit/delete, bulk photo/video upload, drag or button media reorder, cover selection, variant stock grid, and order status updates.
- SEO/PWA basics: metadata, Open Graph, product JSON-LD, sitemap, robots, manifest, icons, and skip-to-content link.
- Uploaded photos are converted to WebP (max 1,600 px) with `sharp`; videos are stored as MP4/WebM.
- Responsive 2-column mobile / 4-column desktop product grid, reduced-motion support, focus-trapped dialogs, Escape-to-close.

## Configuration

Copy `.env.example` to `.env.local` and set:

```env
NEXT_PUBLIC_WHATSAPP_NUMBER=234XXXXXXXXXX
```

Use the real business number in international format, digits only. The studio settings screen can also save a number for the current browser. For all shoppers, set the environment variable and rebuild.

Optional studio protection and live payments:

```env
STUDIO_PASSWORD=
STUDIO_SESSION_SECRET=
PAYSTACK_SECRET_KEY=
FLUTTERWAVE_SECRET_KEY=
FLUTTERWAVE_WEBHOOK_HASH=
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

- If `STUDIO_PASSWORD` is blank, the studio remains an open demo. If set, login is required.
- Paystack activates when `PAYSTACK_SECRET_KEY` is set. Configure webhook URL: `/api/webhooks/paystack`.
- Flutterwave activates when `FLUTTERWAVE_SECRET_KEY` is set. Configure webhook URL `/api/webhooks/flutterwave` and matching `FLUTTERWAVE_WEBHOOK_HASH`.
- Always set `NEXT_PUBLIC_SITE_URL` in production so payment callbacks return to the correct domain.

## Architecture

```text
app/                    Next.js App Router pages and API routes
  api/products          Catalog GET/POST/PATCH/DELETE
  api/upload            Multipart photo/video upload + image optimisation
  api/checkout          Server-side order validation and demo order creation
  api/orders            Demo order list
components/             Storefront, cart, media, variant, and studio UI
lib/types.ts            Product, variant, cart, and order contracts
lib/seed.ts             16 illustrative catalog pieces
lib/store.ts            Local JSON persistence for demo catalog/orders
lib/product-validation.ts
public/images           Optimised demo photography (WebP)
public/videos           Short demo style films (MP4)
public/uploads          Vendor-uploaded media (created at runtime)
data/                   Runtime JSON catalog/orders (created at runtime)
tests/                  Playwright end-to-end coverage
```

The demo uses local JSON files and local uploads so it runs without external credentials. This is **not** a production data layer.

## Production launch checklist

1. **Authentication & authorization:** optional password login is included. For production, add proper user accounts, roles, MFA, and audit logs; the single-password demo is not a full identity system.
2. **Database:** replace JSON storage with PostgreSQL/MySQL (e.g. Prisma/Drizzle). Model products, variants, inventory, media, orders, order items, and customers. Use transactions/row locks for stock reservation.
3. **Object storage/CDN:** move uploads to S3/R2/Cloudinary or equivalent; serve via CDN. Add signed upload URLs, malware/MIME validation, quotas, and video transcoding.
4. **Payments:** server-side initialization, callback verification, and signed webhooks are included. Before launch, test with gateway test keys, reconcile amounts, make fulfillment idempotent, and never trust client-side payment success.
5. **WhatsApp:** set the real business number; consider WhatsApp Business API for automated confirmations.
6. **Policies & content:** replace sample prices, ratings, delivery rates, return terms, and demo media with verified store data and licensed product photography/fit clips.
7. **Performance:** the demo optimises images and lazy-loads video, but sub-2-second 3G/4G loads are a target, not a measured guarantee. Audit with Lighthouse/WebPageTest on real devices and networks; add CDN caching, adaptive video, and monitoring.
8. **Privacy/security:** add rate limiting, CSRF/session protections, input sanitization, audit logs, backups, consent/privacy notices, and secure secret management.
9. **Operations:** error tracking, uptime checks, transactional email, analytics consent, and deployment CI.

## Demo media notes

- Hero campaign image: AI-generated for this project.
- Product photography: illustrative demo assets sourced from Unsplash and image search; replace with your own inventory photos before commercial launch.
- Fit films: short excerpts of Pexels video 855563 (Pixabay), used as style inspiration, not exact product try-ons.
- Fonts: DM Sans and Barlow Condensed, served locally.

## Test coverage

Playwright verifies search/filter/sort/infinite scroll, variant stock + cart + Nigerian demo checkout, wishlist/cart persistence, native video autoplay/mute, studio bulk upload + publish/edit/delete, mobile navigation, order status updates, SEO/PWA routes, and webhook rejection of unconfigured/unsigned requests.
