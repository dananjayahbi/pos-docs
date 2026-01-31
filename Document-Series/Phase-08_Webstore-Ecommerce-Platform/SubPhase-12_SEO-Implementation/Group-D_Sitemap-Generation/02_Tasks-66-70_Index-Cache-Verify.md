# Tasks 66-70: Sitemap Index, Optimization & Verify

> **Phase:** 08 - Webstore & E-Commerce Platform  
> **SubPhase:** 12 - SEO Implementation  
> **Group:** D - Sitemap Generation  
> **Tasks:** 66-70  
> **Goal:** Scale the sitemap for large catalogs and optimize serving performance.

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](./00_GROUP_OVERVIEW.md)
- **← Previous:** [01_Tasks-55-65_Core-URLs.md](./01_Tasks-55-65_Core-URLs.md)
- **→ Next:** None

---

## 1. Task 66: Create Sitemap Index

Split the sitemap if the URL count exceeds 50,000 or to organize logically.

### Steps
1. Instead of a single `sitemap.ts`, create `sitemap-index.xml/route.ts` (if manual) or use Next.js [generateSitemaps](https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config#generatesitemaps) feature.
2. Or typically in Next.js App Router, you can export `generateSitemaps` from `sitemap.ts` to create localized or split sitemaps.
3. For this task, if the inventory is manageable (< 50k), standard sitemap is fine. If larger, split by ID ranges.
4. Return an array from `generateSitemaps` like `[{ id: 0 }, { id: 1 }]` and use the ID to fetch a slice of products.

---

## 2. Task 67: Create Product Sitemap

Isolate products into their own sitemap partition if using splitting.

### Steps
1. Modify `sitemap.ts` to handle logic: if `id === 'products'`, fetch and return only product URLs.
2. This helps in tracking indexation status specifically for products in Google Search Console.
3. Keep static and blog pages in the main or separate chunks.

---

## 3. Task 68: Create Image Sitemap

Include image information for Google Images indexing.

### Steps
1. The `sitemap.xml` standard allows an `<image:image>` extension.
2. Note: Next.js's built-in `MetadataRoute.Sitemap` type might not fully support the image extension out of the box without type augmentation or using a custom XML generator response instead of the typed array.
3. **Alternative:** If strict types limit this, create a `product-sitemap.xml/route.ts` that manually returns a `Response` with XML string including the `xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"` namespace.
4. For each product URL, add `<image:image>` with `<image:loc>` (image URL) and `<image:title>` (product name).

---

## 4. Task 69: Create Sitemap Caching

Prevent database overload by caching the sitemap response.

### Steps
1. In `sitemap.ts`, export the revalidation constant: `export const revalidate = 3600;` (1 hour).
2. This ensures the sitemap is generated statically or cached ISR-style, rather than hitting the DB on every bot request.
3. If using a manual Route Handler (`route.ts`), implement `next: { revalidate: 3600 }` in the fetch calls or use appropriate caching headers.

---

## 5. Task 70: Verify Sitemap

Ensure the sitemap is valid XML and discoverable.

### Steps
1. Build and run the app.
2. Visit `/sitemap.xml`.
3. Verify it renders valid XML without errors.
4. Check that all URLs are absolute (start with `https://`).
5. Check that `lastModified` dates are correctly formatted.
6. Validate using a tool like [XML Sitemap Validator](https://www.xml-sitemaps.com/validate-xml-sitemap.html).
7. Submit the sitemap URL to Google Search Console for initial testing.

---
