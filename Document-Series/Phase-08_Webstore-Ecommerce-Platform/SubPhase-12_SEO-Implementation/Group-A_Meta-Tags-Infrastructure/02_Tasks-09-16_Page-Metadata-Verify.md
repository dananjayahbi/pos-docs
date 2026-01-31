# Tasks 09-16: Page Metadata & Verification

> **Phase:** 08 - Webstore & E-Commerce Platform  
> **SubPhase:** 12 - SEO Implementation  
> **Group:** A - Meta Tags Infrastructure  
> **Tasks:** 09-16  
> **Goal:** Implement dynamic metadata for various page types and verify SEO output.

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](./00_GROUP_OVERVIEW.md)
- **← Previous:** [01_Tasks-01-08_Setup-Helpers.md](./01_Tasks-01-08_Setup-Helpers.md)
- **→ Next:** None

---

## 1. Task 09: Create Product Metadata

Implement dynamic metadata generation for individual product detail pages (`/products/[slug]`).

### Steps
1. Open the product detail `page.tsx`.
2. Export the `generateMetadata` async function.
3. Fetch product details using the slug param.
4. If product not found, return empty object (let 404 page handle it).
5. Use `constructMetadata` helper.
6. Pass product name as title.
7. Pass product short description as meta description.
8. Pass product main image as the OG image.
9. Ensure canonical URL points to the product slug.

---

## 2. Task 10: Create Category Metadata

Implement metadata for product category listing pages (`/categories/[slug]`).

### Steps
1. Open the category `page.tsx`.
2. Export `generateMetadata`.
3. Fetch category details via API.
4. Use `constructMetadata`.
5. Set title to "Category Name | Site Name".
6. Set description to category description or fallback.
7. Set Open Graph image to category banner if available.

---

## 3. Task 11: Create Collection Metadata

Implement metadata for curated collection pages (e.g., "New Arrivals", "Best Sellers").

### Steps
1. Open the collection `page.tsx` (if dynamic) or the specific static page.
2. For dynamic collections, fetch collection details.
3. Utilize `constructMetadata` to set:
    - Title: Collection Name.
    - Description: Collection marketing summary.
    - Image: Collection feature image.

---

## 4. Task 12: Create Search Metadata

Implement metadata for the search results page (`/search`).

### Steps
1. Open the search `page.tsx`.
2. Extract the search query `q` from search params.
3. Export `generateMetadata` using the query.
4. Use `constructMetadata`.
5. Set title dynamically: "Search results for 'query' | Site Name".
6. Set `noIndex` to `true` to prevent indexing of internal search results (SEO best practice).
7. Fallback title if no query is present: "Search Products".

---

## 5. Task 13: Create Blog Metadata

Implement dynamic metadata for blog post pages.

### Steps
1. Open the blog post `page.tsx`.
2. Fetch post data inside `generateMetadata`.
3. Use `constructMetadata`.
4. Map post title to SEO title.
5. Map post excerpt/summary to meta description.
6. Map featured image to `og:image`.
7. Add `publishedTime` and `authors` if `constructMetadata` supports it (or extend it).

---

## 6. Task 14: Create CMS Page Metadata

Implement metadata for generic CMS content pages (About, Terms, Privacy).

### Steps
1. Open the Catch-all CMS route `[...slug]/page.tsx` or individual files.
2. If dynamic, fetch page content based on slug.
3. Use `constructMetadata`.
4. Set title and description from the CMS page content fields.
5. Ensure `noIndex` is respected if the CMS page is marked as draft or private.

---

## 7. Task 15: Create Noindex Handler

Create a mechanism to explicitly prevent indexing for specific utility pages (Cart, Checkout, Account).

### Steps
1. Identify utility routes: `/cart`, `/checkout`, `/account`, `/auth/*`.
2. In the `layout.tsx` or `page.tsx` for these routes, export `metadata`.
3. Use `constructMetadata` with the `noIndex: true` option (or manually set `robots: { index: false, follow: false }`).
4. Ensure this overrides the default indexable setting from the root layout.

---

## 8. Task 16: Verify Meta Tags

Test and validate the rendered meta tags across the application.

### Steps
1. Build and start the production server (or use dev mode).
2. Visit the Homepage and inspect the `<head>`. Verify Title, Description, and Canonical.
3. Visit a Product page. Verify dynamic Title, Price, Description, and Image.
4. Visit the Search page. Verify `noindex` tag is present.
5. Use a browser extension or validator (like a Meta Tag Checker) to simulate social sharing previews.
6. Confirm `metadataBase` resolves all relative URLs (images, canonicals) to absolute URLs correctly.

---
