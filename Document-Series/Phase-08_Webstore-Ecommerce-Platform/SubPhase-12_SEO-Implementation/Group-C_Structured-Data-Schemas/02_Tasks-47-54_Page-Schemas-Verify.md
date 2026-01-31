# Tasks 47-54: Page Schemas & Verification

> **Phase:** 08 - Webstore & E-Commerce Platform  
> **SubPhase:** 12 - SEO Implementation  
> **Group:** C - Structured Data Schemas  
> **Tasks:** 47-54  
> **Goal:** Implement specific page schemas and validate full structured data implementation.

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](./00_GROUP_OVERVIEW.md)
- **← Previous:** [01_Tasks-35-46_Core-Schemas.md](./01_Tasks-35-46_Core-Schemas.md)
- **→ Next:** None

---

## 1. Task 47: Create FAQPage Schema

Implement schema for FAQ pages to gain "People also ask" real estate.

### Steps
1. Create `getFAQSchema(faqs)`.
2. Return `FAQPage` type.
3. Map each FAQ item to `mainEntity` array.
4. Each entity is `@type`: `Question`, `name`: Question text.
5. `acceptedAnswer`: `@type`: `Answer`, `text`: Answer text (HTML allowed).

---

## 2. Task 48: Create ContactPage Schema

Define the contact page formally.

### Steps
1. Create `getContactPageSchema()`.
2. Return `ContactPage` type.
3. Link mainEntity to the `Organization` or `LocalBusiness` schema defined later.
4. Helps search engines purpose-classify the page.

---

## 3. Task 49: Create LocalBusiness Schema

Crucial for local SEO (Sri Lanka context) - store location, hours.

### Steps
1. Create `getLocalBusinessSchema()`.
2. Return `Store` or `LocalBusiness`.
3. Fields: `name`, `image`, `telephone`, `address` (Street, City, Postal, Country: LK).
4. `geo`: Coordinates (Latitude, Longitude).
5. `openingHoursSpecification`: Structure for open/close times.
6. `priceRange`: "₨₨" (LKR symbol representation).

---

## 4. Task 50: Create CollectionPage Schema

Define product listing pages.

### Steps
1. Create `getCollectionPageSchema(collection)`.
2. Return `CollectionPage`.
3. `name`: Collection title.
4. `description`: Collection description.
5. `hasPart`: Can list individual products in the collection (optional but helpful).

---

## 5. Task 51: Create Schema Script Tag

Integrate the generated schemas into the Next.js pages.

### Steps
1. Open the page components (e.g., `ProductPage`).
2. Generate the specific schema object (e.g., `const productSchema = getProductSchema(product)`).
3. Use the `<JsonLd script={productSchema} />` component created in Task 35.
4. Place it inside the return statement (It will render in the body but validate fine) or inject via a Head component if using an older pattern (App Router prefers rendering component or using `script` tag directly, often better to just put it in the JSX).

---

## 6. Task 52: Create Multiple Schemas

Handle pages that need multiple schemas (e.g., Breadcrumb + Product).

### Steps
1. Update `JsonLd` component or usage to accept an array.
2. If passing an array, the helper should wrap them in a `@graph` array or output multiple script tags.
3. Common pattern: Product Page has `BreadcrumbList`, `Product`, and potentially `FAQPage`.
4. Ensure valid graph connections (using `@id` references) if linking them, or keep them independent.

---

## 7. Task 53: Create Schema Validation

Add runtime checks during development to catch schema errors.

### Steps
1. In the `toJsonLd` helper, check environment (if `NODE_ENV === 'development'`).
2. Validate strict requirements (e.g., `price` must be number/string, images must be URLs).
3. `console.warn` if keys are missing that are mandatory for Google Rich Results.

---

## 8. Task 54: Verify Structured Data

Test the implementation with Google's tools.

### Steps
1. Start the app.
2. Navigate to a Product Page. View Source. Copy the JSON-LD script content.
3. Paste into [Google Rich Results Test](https://search.google.com/test/rich-results).
4. Verify "Product" and "Breadcrumbs" are detected.
5. Check for Warnings (Non-critical) vs Errors (Critical - e.g., missing price/currency).
6. Repeat for Blog Post (Article), Home (Organization/Website), and Contact (LocalBusiness).

---
