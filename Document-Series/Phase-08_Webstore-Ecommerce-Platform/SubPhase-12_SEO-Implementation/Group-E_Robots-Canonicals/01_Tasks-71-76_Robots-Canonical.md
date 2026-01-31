# Tasks 71-76: Robots Configuration & Canonical Setup

> **Phase:** 08 - Webstore & E-Commerce Platform  
> **SubPhase:** 12 - SEO Implementation  
> **Group:** E - Robots & Canonicals  
> **Tasks:** 71-76  
> **Goal:** Configure crawler access via robots.txt and establish canonicalization logic.

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](./00_GROUP_OVERVIEW.md)
- **← Previous:** None
- **→ Next:** [02_Tasks-77-82_Page-Canonicals-Verify.md](./02_Tasks-77-82_Page-Canonicals-Verify.md)

---

## 1. Task 71: Create Robots Route

Establish the endpoint for serving the `robots.txt` file using Next.js conventions.

### Steps
1. In the `app` directory, create a file named `robots.ts`.
2. Import the `MetadataRoute` type.
3. Export the default async function `robots(): MetadataRoute.Robots`.
4. This allows dynamic generation of robots rules based on environment (e.g., disallow all on staging).

---

## 2. Task 72: Create Robots Rules

Define the base Allow and Disallow directives.

### Steps
1. Return an object with `rules`.
2. Set `userAgent: '*'`.
3. Set `allow: '/'` to default to open crawling.
4. Set `disallow: '/private/'` (or any known private assets).

---

## 3. Task 73: Create Sitemap Reference

Link the sitemap in the robots file so crawlers can find it.

### Steps
1. In the return object of `robots()`, add the `sitemap` property.
2. Set it to the full absolute URL: `https://site.com/sitemap.xml`.
3. If using a sitemap index, point to that index URL.

---

## 4. Task 74: Create Crawler Specific

Define rules for specific bots if needed (e.g., GPTBot).

### Steps
1. The `rules` property can be an array.
2. Add a rule for `userAgent: 'GPTBot'` (example).
3. `disallow: ['/']` to prevent AI scraping if desired (or allow logic).
4. Add `userAgent: 'Googlebot'` if needing specific directives different from `*`.

---

## 5. Task 75: Create Disallow Paths

Explicitly block crawling of sensitive or low-value user-specific pages.

### Steps
1. Define a list of private paths:
   - `/account/`, `/cart/`, `/checkout/`, `/auth/verify`, `/search` (often wise to block search result pages to save crawl budget).
   - `/api/` (unless public API docs are indexed).
2. Add these to the `disallow` array for the `*` user agent.
3. Ensure these paths do not contain SEO-valuable content.

---

## 6. Task 76: Create Canonical URL Helper

Develop a utility to generate clean self-referencing URLs.

### Steps
1. Open `utils.ts` in the `seo` directory.
2. Create a function `getCanonicalUrl`.
3. It should accept a path (e.g., `/products/slug`) or use current context.
4. It should join with `NEXT_PUBLIC_SITE_URL`.
5. IMPORTANT: It must strip standard tracking parameters (Like `fbclid`, `gclid`) if implementing logic to handle incoming requests, though usually, this helper generates the `<link rel="canonical">` tag which is static.
6. Return the clean, absolute string.

---
