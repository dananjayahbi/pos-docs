# Tasks 55-65: Core Sitemap & URLs

> **Phase:** 08 - Webstore & E-Commerce Platform  
> **SubPhase:** 12 - SEO Implementation  
> **Group:** D - Sitemap Generation  
> **Tasks:** 55-65  
> **Goal:** Create a dynamic XML sitemap to help search engines discover and crawl pages.

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](./00_GROUP_OVERVIEW.md)
- **← Previous:** None
- **→ Next:** [02_Tasks-66-70_Index-Cache-Verify.md](./02_Tasks-66-70_Index-Cache-Verify.md)

---

## 1. Task 55: Create Sitemap Route

Establish the endpoint for the sitemap using Next.js App Router conventions.

### Steps
1. In the `app` directory, create a file named `sitemap.ts`.
2. This special file name automatically generates a `sitemap.xml` route.
3. Import the `MetadataRoute` type from `next`.
4. Define the default export `async function sitemap(): Promise<MetadataRoute.Sitemap>`.

---

## 2. Task 56: Create Sitemap Generator

Implement the logic to return the array of sitemap URLs.

### Steps
1. The generator function needs to collect URLs from various sources.
2. It must return an array of objects shaped: `{ url, lastModified, changeFrequency, priority }`.
3. Concatenate static routes and dynamic routes into a single array.
4. Use the site URL from config to build absolute paths.

---

## 3. Task 57: Create Static URLs

Add fixed pages like Home, About, and Contact.

### Steps
1. Define an array of static paths: `['', '/about', '/contact', '/privacy', '/terms']`.
2. Map this array to the sitemap object structure.
3. Prepend the `NEXT_PUBLIC_SITE_URL` to each path.
4. Set static pages `lastModified` to current date (or a specific build date).

---

## 4. Task 58: Create Product URLs

Fetch and map all active products to the sitemap.

### Steps
1. Import the product fetching utility (e.g., `getProducts`).
2. Fetch all products (limit fields to `slug` and `updatedAt` for performance).
3. Map each product to a sitemap entry:
   - URL: `/products/${product.slug}`.
   - lastModified: `product.updatedAt`.
4. Ensure inactive/draft products are excluded.

---

## 5. Task 59: Create Category URLs

Add product category pages.

### Steps
1. Fetch all categories.
2. Map to sitemap entries:
   - URL: `/categories/${category.slug}`.
   - lastModified: `category.updatedAt`.

---

## 6. Task 60: Create Collection URLs

Add curated collection pages.

### Steps
1. Fetch collections.
2. Map to `/collections/${collection.slug}`.
3. Ensure the sitemap reflects the correct URL structure used in the frontend.

---

## 7. Task 61: Create Blog URLs

Add article pages to the sitemap.

### Steps
1. Fetch blog posts.
2. Map to `/blog/${post.slug}`.
3. Use the `publishedAt` or `updatedAt` date for `lastModified`.

---

## 8. Task 62: Create CMS Page URLs

Add dynamic pages managed by the CMS.

### Steps
1. Fetch dynamic pages.
2. Map urls based on their slug structure (e.g., `/${page.slug}`).
3. Ensure these do not collide with static routes.

---

## 9. Task 63: Create URL Priority

Assign priority levels to different page types.

### Steps
1. In the mapping logic, assign `priority` (0.0 to 1.0).
2. Homepage: `1.0`.
3. Products and Collections: `0.8` or `0.9`.
4. Categories: `0.7`.
5. Blog Posts: `0.6` or `0.7`.
6. Static Pages (Terms/Privacy): `0.3`.
7. This signals relative importance to search engines.

---

## 10. Task 64: Create URL Changefreq

Indicate how often pages are likely to change.

### Steps
1. Assign `changeFrequency` values.
2. Homepage: `daily`.
3. Products: `weekly` (price/inventory updates).
4. Blog Posts: `monthly` or `never` (if archival).
5. Static Pages: `yearly`.
6. Collections (New Arrivals): `daily`.

---

## 11. Task 65: Create URL Lastmod

Ensure the last modified date is accurate.

### Steps
1. Use the ISO 8601 format (YYYY-MM-DD) for `lastModified`.
2. For database content, use the `updated_at` timestamp.
3. For code-based static pages, use `new Date()` or a fixed deployment date.
4. Accurate dates help search engines crawl only updated content.

---
