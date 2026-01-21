# Group C: Structured Data Schemas

> **Phase:** 08 - Webstore & E-Commerce Platform  
> **SubPhase:** 12 - SEO Implementation  
> **Group:** C of F  
> **Tasks Covered:** 35-54  
> **Group Goal:** Create JSON-LD structured data schemas for rich search results

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group-B_Open-Graph-Social](../Group-B_Open-Graph-Social/)
- **→ Next Group:** [Group-D_Sitemap-Generation](../Group-D_Sitemap-Generation/)

---

## Group Overview

This group creates structured data schemas. Creates JSON-LD helper for generating Schema.org structured data. Creates TypeScript schema types. Creates Organization and Website schemas with SearchAction. Creates Product schema with offers, availability, and reviews. Creates BreadcrumbList schema with ListItem entries. Creates Article schema for blog posts. Creates FAQPage and ContactPage schemas. Creates LocalBusiness schema. Creates CollectionPage schema for categories. Creates script tag injector and handles multiple schemas per page. Creates schema validation. Verifies with Google Rich Results Test.

### Key Outcomes

- JSON-LD helper
- Schema TypeScript types
- Organization schema
- Website schema
- SearchAction schema
- Product schema
- Product offers
- Product availability
- Product reviews (AggregateRating)
- BreadcrumbList schema
- Breadcrumb items
- Article schema
- FAQPage schema
- ContactPage schema
- LocalBusiness schema
- CollectionPage schema
- Schema script tag
- Multiple schemas support
- Schema validation
- Structured data verified

### Technology Context

- **Format:** JSON-LD
- **Standard:** Schema.org
- **Tag:** script type="application/ld+json"
- **Validation:** Google Rich Results Test

---

## Documents in This Group

| # | Document | Description | Tasks Covered |
|---|----------|-------------|---------------|
| 01 | `01_Tasks-35-46_Core-Schemas.md` | Create core schemas (Org, Product, Breadcrumb) | 35-46 |
| 02 | `02_Tasks-47-54_Page-Schemas-Verify.md` | Create page schemas and verification | 47-54 |

---

## Task Summary

| Task # | Task Name | Complexity | Dependencies |
|--------|-----------|------------|--------------|
| 35 | Create JSON-LD Helper | Medium | Task 34 |
| 36 | Create Schema Types | Medium | Task 35 |
| 37 | Create Organization Schema | Medium | Task 35 |
| 38 | Create Website Schema | Medium | Task 35 |
| 39 | Create SearchAction Schema | Low | Task 38 |
| 40 | Create Product Schema | High | Task 35 |
| 41 | Create Product Offers | Medium | Task 40 |
| 42 | Create Product Availability | Low | Task 40 |
| 43 | Create Product Reviews | Medium | Task 40 |
| 44 | Create BreadcrumbList Schema | Medium | Task 35 |
| 45 | Create Breadcrumb Items | Low | Task 44 |
| 46 | Create Article Schema | Medium | Task 35 |
| 47 | Create FAQPage Schema | Medium | Task 35 |
| 48 | Create ContactPage Schema | Low | Task 35 |
| 49 | Create LocalBusiness Schema | Medium | Task 37 |
| 50 | Create CollectionPage Schema | Medium | Task 35 |
| 51 | Create Schema Script Tag | Medium | Task 35 |
| 52 | Create Multiple Schemas | Low | Task 51 |
| 53 | Create Schema Validation | Medium | Task 52 |
| 54 | Verify Structured Data | Low | Task 53 |

---

## Execution Order

```
Task 35: JSON-LD Helper
    │
    ├────────────────────────────────────────────────────────────────┐
    ▼                                                                │
Task 36: Schema Types                                                │
    │                                                                │
    ├──────────┬──────────┬──────────┬──────────┬──────────┐         │
    ▼          ▼          ▼          ▼          ▼          │         │
T-37       T-38       T-40       T-44       T-46       T-47  T-48 T-50
(Org)    (Website) (Product) (Bread)   (Article) (FAQ)(Contact)(Coll)
    │          │          │          │          │       │     │    │
    ▼          ▼     ┌────┼────┬────┐     ▼          │       │     │
T-49       T-39    ▼    ▼    ▼    │   T-45        │       │     │
(Local)  (Search) T-41  T-42  T-43   (Items)      │       │     │
    │          │ (Offer)(Avail)(Reviews)│          │       │     │
    │          │    │    │    │    │     │          │       │     │
    └──────────┴────┴────┴────┴────┴─────┴──────────┴───────┴─────┘
                              │
                              ▼
                        Task 51: Script Tag
                              │
                              ▼
                        Task 52: Multiple Schemas
                              │
                              ▼
                        Task 53: Validation
                              │
                              ▼
                        Task 54: Verify
```

---

## Expected Deliverables

```
frontend/
├── lib/
│   └── seo/
│       └── jsonLd.ts
├── types/
│   └── seo/
│       └── schema.types.ts
└── components/
    └── seo/
        └── JsonLdScript/
            ├── JsonLdScript.tsx
            └── schemas/
                ├── OrganizationSchema.tsx
                ├── WebsiteSchema.tsx
                ├── ProductSchema.tsx
                ├── BreadcrumbSchema.tsx
                ├── ArticleSchema.tsx
                ├── FAQSchema.tsx
                ├── ContactSchema.tsx
                ├── LocalBusinessSchema.tsx
                ├── CollectionSchema.tsx
                └── index.ts
```

---

## Notes for AI Agents

### JSON-LD Helper (Task 35)
| Function | Purpose |
|----------|---------|
| generateJsonLd | Create JSON-LD object |
| serializeSchema | Convert to string |
| injectScript | Add to head |

### Schema Types (Task 36)
| Interface | Based On |
|-----------|----------|
| Organization | Schema.org/Organization |
| Product | Schema.org/Product |
| BreadcrumbList | Schema.org/BreadcrumbList |
| Article | Schema.org/Article |

### Organization Schema (Task 37)
| Property | Value |
|----------|-------|
| @type | Organization |
| name | Store name |
| url | Site URL |
| logo | Logo URL |
| contactPoint | Contact info |

### Website Schema (Task 38)
| Property | Value |
|----------|-------|
| @type | WebSite |
| name | Site name |
| url | Site URL |
| potentialAction | SearchAction |

### SearchAction Schema (Task 39)
| Property | Value |
|----------|-------|
| @type | SearchAction |
| target | /search?q={search_term_string} |
| query-input | required name=search_term_string |

### Product Schema (Task 40)
| Property | Value |
|----------|-------|
| @type | Product |
| name | Product name |
| image | Product images |
| description | Product description |
| sku | Product SKU |
| brand | Brand name |

### Product Offers (Task 41)
| Property | Value |
|----------|-------|
| @type | Offer |
| price | Price value |
| priceCurrency | LKR |
| availability | InStock/OutOfStock |
| url | Product URL |

### Product Availability (Task 42)
| Value | URL |
|-------|-----|
| InStock | https://schema.org/InStock |
| OutOfStock | https://schema.org/OutOfStock |
| PreOrder | https://schema.org/PreOrder |

### Product Reviews (Task 43)
| Property | Value |
|----------|-------|
| @type | AggregateRating |
| ratingValue | Average rating |
| reviewCount | Number of reviews |
| bestRating | 5 |
| worstRating | 1 |

### BreadcrumbList Schema (Task 44)
| Property | Value |
|----------|-------|
| @type | BreadcrumbList |
| itemListElement | Array of ListItem |

### Breadcrumb Items (Task 45)
| Property | Value |
|----------|-------|
| @type | ListItem |
| position | 1, 2, 3... |
| name | Crumb name |
| item | Crumb URL |

### FAQPage Schema (Task 47)
| Property | Value |
|----------|-------|
| @type | FAQPage |
| mainEntity | Array of Question |
| Question.name | Question text |
| Question.acceptedAnswer | Answer text |

### LocalBusiness Schema (Task 49)
| Property | Value |
|----------|-------|
| @type | LocalBusiness |
| name | Business name |
| address | Address object |
| telephone | +94 phone |
| openingHours | Hours |

### Schema Script Tag (Task 51)
| Element | Value |
|---------|-------|
| Tag | script |
| Type | application/ld+json |
| Content | JSON string |
| Position | head |
