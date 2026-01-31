# Tasks 88-92: Comprehensive SEO Testing

> **Phase:** 08 - Webstore & E-Commerce Platform  
> **SubPhase:** 12 - SEO Implementation  
> **Group:** F - SEO Utilities & Testing  
> **Tasks:** 88-92  
> **Goal:** Validate the entire SEO suite to ensure maximum discoverability and compliance.

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](./00_GROUP_OVERVIEW.md)
- **← Previous:** [01_Tasks-83-87_Preview-Tools.md](./01_Tasks-83-87_Preview-Tools.md)
- **→ Next:** None

---

## 1. Task 88: Test Product Schema

Final validation of the rich snippet implementation.

### Steps
1. Navigate to a complex product page (Variant + Reviews + Discount).
2. Copy HTML source (or use the URL if deployed).
3. Run through [Google Rich Results Test](https://search.google.com/test/rich-results).
4. **Pass Criteria:**
   - "Product" detected.
   - "Merchant Listings" detected (if eligible).
   - "Breadcrumbs" detected.
   - Price, Availability, Image, and Rating are correctly parsed.
   - No Critical Errors.

---

## 2. Task 89: Test Sitemap Access

Verify the automated sitemap generation pipeline.

### Steps
1. Request `/sitemap.xml`.
2. Inspect headers: `Content-Type` should be `application/xml` or `text/xml`.
3. Check `Cache-Control` headers (ensure they match the revalidation strategy).
4. Verify new content appears: Create a dummy product, refresh (wait for revalidation), and confirm its URL appears in the XML.

---

## 3. Task 90: Test Robots Blocking

Ensure private routes are effectively gated from crawlers.

### Steps
1. Attempt to fetch a private URL (e.g., `/account`) with a User-Agent spoofer set to `Googlebot`.
2. Generally, the page will technically load (status 200) unless middleware blocks it, but check the `robots.txt` compliance using Google's tester.
3. Check pages intended for `noindex`: View source and confirm `<meta name="robots" content="noindex,nofollow" />`.
4. Verify search results pages `/search?q=...` have `noindex` to prevent "Soft 404" or low-quality indexation penalties.

---

## 4. Task 91: Test Social Sharing

Validate the "virality" factors.

### Steps
1. **Facebook:** Scrape the home page and a product page using [Faceook Debugger](https://developers.facebook.com/tools/debug/).
   - Confirm App ID is present (if configured).
   - Confirm Image aspect ratio is preserved.
2. **Linked/Slack:** Paste the link in a private channel.
   - Confirm the preview unrolls with title, description, and image.
3. **WhatsApp:** Paste link on mobile. Confirm thumbnail generation.

---

## 5. Task 92: Test SEO Audit

Perform a holistic health check using Lighthouse.

### Steps
1. Open Chrome DevTools > Lighthouse.
2. Select "SEO" category.
3. Run analysis on Homepage, Product Page, and Blog Post.
4. **Target Score:** 100/100.
5. Common fixes:
   - Ensure `alt` text on all images.
   - Ensure tap targets are large enough (Mobile Friendly).
   - Ensure font sizes are legible.
   - Ensure `<title>` and `<meta name="description">` are present.
   - Ensure link text is descriptive ("click here" vs "view product").
6. Document any regressions and assign fixes.

---
