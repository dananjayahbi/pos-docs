# Tasks 35-46: Core Structured Data Schemas

> **Phase:** 08 - Webstore & E-Commerce Platform  
> **SubPhase:** 12 - SEO Implementation  
> **Group:** C - Structured Data Schemas  
> **Tasks:** 35-46  
> **Goal:** Implement essential Schema.org JSON-LD structures for Organization, Product, and Articles.

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](./00_GROUP_OVERVIEW.md)
- **← Previous:** None
- **→ Next:** [02_Tasks-47-54_Page-Schemas-Verify.md](./02_Tasks-47-54_Page-Schemas-Verify.md)

---

## 1. Task 35: Create JSON-LD Helper

Set up the foundation for injecting JSON-LD scripts into pages.

### Steps
1. In the `seo` directory, create a `schemas.ts` or `json-ld.ts` file.
2. Define a generic function `toJsonLd` or `serializeSchema`.
3. It should accept a schema object and return a string (JSON.stringify with security escaping for script tags).
4. Create a React component `<JsonLd script={...} />` that renders safely:
   - `<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: ... }} />`.

---

## 2. Task 36: Create Schema Types

Define TypeScript interfaces for the used Schema.org types to ensure validity.

### Steps
1. Use the `schema-dts` package or define interfaces manually in `types.ts`.
2. Define types for `Organization`, `WebSite`, `Product`, `breadcrumbList`, `Article`.
3. Ensure types match the [Schema.org](https://schema.org) specifications and Google's requirements (required fields).

---

## 3. Task 37: Create Organization Schema

Define the schema representing the brand or company.

### Steps
1. Create a function `getOrganizationSchema`.
2. Return an object of type `Organization`.
3. Fields: `@context`, `@type` ('Organization'), `name` (Site Name), `url` (Site URL), `logo` (Logo URL), `sameAs` (Array of social profile URLs).
4. Use the `config.ts` data to populate this.

---

## 4. Task 38: Create Website Schema

Define the schema for the website itself, usually placed on the homepage.

### Steps
1. Create `getWebsiteSchema`.
2. Return object of type `WebSite`.
3. Fields: `@context`, `@type` ('WebSite'), `name`, `url`.
4. This signals to Google that this entity is a Website.

---

## 5. Task 39: Create SearchAction Schema

Implement the Sitelinks Search Box feature.

### Steps
1. Inside `getWebsiteSchema`, add the `potentialAction` property.
2. Define it as `SearchAction`.
3. set `target`: `{template: "https://site.com/search?q={search_term_string}"}`.
4. set `query-input`: "required name=search_term_string".
5. This enables Google to show a search box for your site in the search results.

---

## 6. Task 40: Create Product Schema

Structure the product data for Rich Snippets (Star ratings, Price, Availability).

### Steps
1. Create `getProductSchema(product)`.
2. Return `Product` type.
3. Map fields: `name`, `description`, `image`, `sku`, `brand`.
4. Handle the `brand` as a nested `Brand` or `Organization` object.

---

## 7. Task 41: Create Product Offers

Define pricing and buying options within the product schema.

### Steps
1. In `getProductSchema`, add `offers` property.
2. Define as `Offer` type.
3. Fields: `url` (product permalink), `priceCurrency` (LKR), `price` (numeric).
4. Ensure the price is the final selling price.

---

## 8. Task 42: Create Product Availability

Map text availability status to Schema.org enumeration.

### Steps
1. In `offers`, add `availability`.
2. Map internal inventory status (In Stock, Out of Stock) to schema URLs:
   - `https://schema.org/InStock`
   - `https://schema.org/OutOfStock`
   - `https://schema.org/PreOrder`
3. This is critical for the "In stock" label in Google Shopping/Results.

---

## 9. Task 43: Create Product Reviews

If reviews exist, add them to the schema for star ratings in SERPs.

### Steps
1. In `getProductSchema`, add `aggregateRating`.
2. Map `ratingValue` (average score) and `reviewCount` (total reviews).
3. Optionally add `review` array for individual top reviews.
4. Ensure data consistency; if no reviews, omit validation errors by checking count > 0.

---

## 10. Task 44: Create BreadcrumbList Schema

Show the page hierarchy in search results.

### Steps
1. Create `getBreadcrumbSchema(items)`.
2. Return `BreadcrumbList`.
3. `@type`: `BreadcrumbList`.
4. `itemListElement`: Array of `ListItem`.

---

## 11. Task 45: Create Breadcrumb Items

Map individual breadcrumb links to ListItems.

### Steps
1. For each item in the breadcrumb path:
   - `@type`: `ListItem`.
   - `position`: Index (1-based).
   - `name`: Link text.
   - `item`: Absolute URL.
2. Position 1 is usually Home.

---

## 12. Task 46: Create Article Schema

Define schema for blog posts.

### Steps
1. Create `getArticleSchema(post)`.
2. Return `Article` or `BlogPosting` type.
3. Fields: `headline`, `image`, `datePublished`, `dateModified`.
4. `author`: Person or Organization object.
5. `publisher`: Organization object (Usually the site itself).

---
