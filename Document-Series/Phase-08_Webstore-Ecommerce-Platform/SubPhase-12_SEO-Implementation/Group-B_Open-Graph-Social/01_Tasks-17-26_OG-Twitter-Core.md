# Tasks 17-26: Open Graph & Twitter Core Tags

> **Phase:** 08 - Webstore & E-Commerce Platform  
> **SubPhase:** 12 - SEO Implementation  
> **Group:** B - Open Graph & Social  
> **Tasks:** 17-26  
> **Goal:** implement core Open Graph and Twitter Card support for social sharing.

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](./00_GROUP_OVERVIEW.md)
- **← Previous:** None
- **→ Next:** [02_Tasks-27-34_Product-Blog-Verify.md](./02_Tasks-27-34_Product-Blog-Verify.md)

---

## 1. Task 17: Create OG Tags Helper

Update the SEO utility helper to support structured Open Graph object generation.

### Steps
1. Open the `utils.ts` in the `seo` directory.
2. Extend the `constructMetadata` function or create a dedicated `constructOpenGraph` helper.
3. It should accept: `title`, `description`, `url`, `images`, `type`, `siteName`.
4. Ensure it returns a `Metadata['openGraph']` object.
5. Setup defaults for `siteName` and `type` (default to 'website').

---

## 2. Task 18: Create OG Title

Ensure the Open Graph title falls back correctly and matches the page title.

### Steps
1. In the OG helper, map the `title` input.
2. If `title` is missing, use the default site title.
3. Note: OG titles often shouldn't include the " | Site Name" suffix if it makes them too long, but consistency is key.
4. Ensure the output is a string.

---

## 3. Task 19: Create OG Description

Ensure the Open Graph description is present for social snippets.

### Steps
1. In the OG helper, map the `description` input.
2. Fallback to site description if missing.
3. Validate that the description is plain text (no markdown/HTML).

---

## 4. Task 20: Create OG Image

Handle the creation of the `og:image` array, which is critical for social sharing.

### Steps
1. In the OG helper, accept an `image` url or object.
2. If an image is provided:
    - If it's a string, convert to an object `{ url: string }`.
    - If it's relative, prepend the `metadataBase` or site URL.
3. If no image is provided, fallback to the default site OG image (configured in `config.ts`).
4. Return an array of image objects.

---

## 5. Task 21: Create OG Image Size

Define the dimensions for the Open Graph images to ensure best display.

### Steps
1. In `config.ts`, define default OG image dimensions (1200x630).
2. In the OG helper, when processing the image:
    - Add `width: 1200`.
    - Add `height: 630`.
    - Add `alt` text (use title as fallback).
3. This helps platforms like Facebook and LinkedIn render the large image preview immediately without asynchronous fetching.

---

## 6. Task 22: Create OG Type

Allow specifying the content type (website, article, product).

### Steps
1. Add a `type` parameter to the helper.
2. Default to 'website'.
3. Allow values like 'article' for blog posts and 'book', 'profile' if needed.
4. Ensure the type aligns with the Open Graph protocol spec.

---

## 7. Task 23: Create OG URL

Set the canonical URL for the Open Graph object.

### Steps
1. Add a `url` parameter.
2. This should match the canonical URL of the page.
3. If not provided, it can be inferred from the current path (if utilizing a hook or context, otherwise pass explicitly from the page).
4. Ensure it is an absolute URL.

---

## 8. Task 24: Create OG Site Name

Identify the website name in the graph.

### Steps
1. Use the `siteName` from `config.ts`.
2. Assign it to the `siteName` property of the Open Graph object.
3. This is consistent across all pages.

---

## 9. Task 25: Create Twitter Card Tags

Implement specific support for Twitter/X cards.

### Steps
1. Update `constructMetadata` to include a `twitter` property.
2. Create/Call a `constructTwitter` helper.
3. Accept `title`, `description`, `images`, `creator`.
4. Ensure it returns a `Metadata['twitter']` object.

---

## 10. Task 26: Create Twitter Card Type

Define the card display type (summary, summary_large_image).

### Steps
1. In the Twitter helper, set `card` property.
2. Default to `summary_large_image` (best for e-commerce).
3. Set `creator` to the site's Twitter handle (from config).
4. Set `site` to the site's Twitter handle.

---
