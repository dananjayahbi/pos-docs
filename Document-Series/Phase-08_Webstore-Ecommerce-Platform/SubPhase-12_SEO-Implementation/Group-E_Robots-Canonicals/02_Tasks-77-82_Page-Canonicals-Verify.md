# Tasks 77-82: Page Canonicals & Verification

> **Phase:** 08 - Webstore & E-Commerce Platform  
> **SubPhase:** 12 - SEO Implementation  
> **Group:** E - Robots & Canonicals  
> **Tasks:** 77-82  
> **Goal:** Implement canonical tags across all page types to prevent duplicate content issues.

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](./00_GROUP_OVERVIEW.md)
- **← Previous:** [01_Tasks-71-76_Robots-Canonical.md](./01_Tasks-71-76_Robots-Canonical.md)
- **→ Next:** None

---

## 1. Task 77: Create Homepage Canonical

Establish the definitive URL for the homepage.

### Steps
1. In the root `layout.tsx` or `page.tsx` metadata.
2. Set `alternates: { canonical: '/' }`.
3. Next.js resolves this relative to `metadataBase`.
4. Ensure it resolves to `https://site.com` without trailing slash (or with, depending on site convention) consistently.

---

## 2. Task 78: Create Product Canonical

Ensure product variants point to the main product URL.

### Steps
1. In `generateMetadata` for Products.
2. Set `alternates: { canonical: \`/products/${params.slug}\` }`.
3. If the URL has variant query params (`?color=red`), valid canonical prevents self-competition.
4. The canonical tag should explicitly ignore these query parameters unless each variant has unique SEO content.

---

## 3. Task 79: Create Pagination Canonical

Handle SEO for paginated sequences (e.g., Blog or Category pages).

### Steps
1. For `/blog?page=2`.
2. The canonical logic is debated; generally, self-referencing is preferred (`/blog?page=2`).
3. Update metadata generation to include the page parameter in the canonical URL if it exists.
4. Alternatively, use `rel="prev"` and `rel="next"` links, though Google says they no longer use them for ranking (but still good for discovery).

---

## 4. Task 80: Create Filter Canonical

Consolidate filtered views to the main category page.

### Steps
1. For `/category/shoes?sort=price_asc&color=black`.
2. Set the canonical to `/category/shoes`.
3. This tells Google that the sorted/filtered view is just a variation of the main category, consolidating ranking signals to the main URL.
4. Exception: If a filter combination is highly searched (e.g. "Black Nike Shoes"), you might want indexable distinct URLs, but usually, parameterized URLs should canonicalize to the root.

---

## 5. Task 81: Create Alternate Links

Setup for multi-language support (hreflang).

### Steps
1. Using the `alternates` property in metadata.
2. Add `languages` object.
3. Map locales:
   - `'en-US': '/en-US/path...'`
   - `'si-LK': '/si-LK/path...'`
4. If not currently multi-lingual, set up the structure or skip. If using single domain, ensure `x-default` is set.

---

## 6. Task 82: Verify Robots & Canonical

Test the configuration.

### Steps
1. **Robots:** Visit `/robots.txt`. Confirm syntax. Use Google Robots Testing Tool.
2. **Canonical:** Visit a product page with random query params (`?test=123`).
3. View source and find `<link rel="canonical" ... />`.
4. Confirm it points to the clean URL without `?test=123`.
5. Check `/category/shoes?sort=price`. Confirm canonical points to `/category/shoes`.

---
