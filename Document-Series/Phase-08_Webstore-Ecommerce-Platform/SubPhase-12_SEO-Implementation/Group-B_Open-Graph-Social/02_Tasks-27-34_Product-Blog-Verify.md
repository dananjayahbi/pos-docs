# Tasks 27-34: Extended Social Tags & Verification

> **Phase:** 08 - Webstore & E-Commerce Platform  
> **SubPhase:** 12 - SEO Implementation  
> **Group:** B - Open Graph & Social  
> **Tasks:** 27-34  
> **Goal:** Complete social meta tag implementation for Products and Blogs, and verify.

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](./00_GROUP_OVERVIEW.md)
- **← Previous:** [01_Tasks-17-26_OG-Twitter-Core.md](./01_Tasks-17-26_OG-Twitter-Core.md)
- **→ Next:** None

---

## 1. Task 27: Create Twitter Title

Map the page title to the Twitter card title.

### Steps
1. In the Twitter helper, map the `title` input.
2. Similar to OG, fallback to the site default if missing.
3. Twitter allows up to 70 characters before truncation; ensure the helper considers this (optional truncation logic).

---

## 2. Task 28: Create Twitter Description

Map the page description to the Twitter card description.

### Steps
1. In the Twitter helper, map the `description` input.
2. Twitter allows up to 200 characters.
3. Use the same sanitizer as OG to remove HTML.

---

## 3. Task 29: Create Twitter Image

Set the image for the Twitter card summary.

### Steps
1. Map the `image` input to the Twitter `images` property.
2. It can be a string (URL) or array of strings.
3. Ensure the URL is absolute.
4. Fallback to the same default OG image if no specific image is provided.

---

## 4. Task 30: Create Product OG Tags

Enhance Open Graph availability for Product pages.

### Steps
1. In the `constructMetadata` function, add an optional `product` parameter (interface `ProductSEO`).
2. Inside the logic, if `product` data is present, override the OG `type` to 'website' (or strictly 'product' if using legacy namespaces, but 'website' or 'article' is safer for general sharing unless using specific `product` namespace).
3. Actually, Facebook supports `og:type` = `product`.
4. If type is `product`, we need to add product-specific namespaces. Next.js `Metadata` has a dedicated `openGraph` > `type` = "product" structure.
5. Populate `product` namespace only if type is product.

---

## 5. Task 31: Create OG Price Tags

Add price and currency data to the Product OG tags.

### Steps
1. In the `product` logic branch:
    - Map `product.price` to `amount`.
    - Map `product.currency` to `currency` (LKR).
2. This allows rich pins on Pinterest and price display on some social feeds.

---

## 6. Task 32: Create Blog OG Tags

Enhance Open Graph for Blog Articles.

### Steps
1. In `constructMetadata`, support `article` parameter (interface `ArticleSEO`).
2. If present, set OG `type` to 'article'.
3. Populate `publishedTime`, `modifiedTime`, `authors` (array of URLs), and `tags`.
4. This helps social platforms understand the timeliness and authorship of the content.

---

## 7. Task 33: Create OG Locale

Define the language and territory for the content.

### Steps
1. In the global `config.ts` or base metadata, set `locale` to `en_US` (or `en_LK` given the region).
2. Add `alternateLocale` if supporting Sinhala (`si_LK`).
3. Ensure this is passed to the `openGraph` object in `constructMetadata`.

---

## 8. Task 34: Verify Social Tags

Validate the social implementations using debugging tools.

### Steps
1. Deploy a preview or use a tunneling tool (ngrok) to make localhost accessible publicly.
2. **Facebook:** Use the [Sharing Debugger](https://developers.facebook.com/tools/debug/). Enter a Product URL. Verify Image, Title, Price, and Description appear.
3. **Twitter/X:** Use the [Card Validator](https://cards-dev.twitter.com/validator). Verify the Large Image Card renders.
4. **LinkedIn:** Use the [Post Inspector](https://www.linkedin.com/post-inspector/). Verify the link preview.
5. Check that the `og:url` matches the canonical URL and not a redirect chain.

---
