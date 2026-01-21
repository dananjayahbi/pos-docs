# Group A: Route & Page Structure

> **Phase:** 08 - Webstore & E-Commerce Platform  
> **SubPhase:** 04 - Product Detail Page  
> **Group:** A of F  
> **Tasks Covered:** 01-16  
> **Group Goal:** Create product detail route with layout, loading/error states, and data fetching

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** None (First Group)
- **→ Next Group:** [Group-B_Image-Gallery](../Group-B_Image-Gallery/)

---

## Group Overview

This group creates the product detail route structure. Creates product detail directory and page route. Creates product page layout and loading/error states. Creates product not found page. Creates generateStaticParams and generateMetadata for SEO. Creates product page container with breadcrumb. Creates two-column layout (gallery left, info right) and mobile stack layout. Creates product data fetcher, TypeScript types, and API service. Verifies route and data flow.

### Key Outcomes

- Product detail directory
- Product page route (/products/[slug])
- Product page layout
- Product loading state
- Product error state
- Product not found page
- generateStaticParams
- generateMetadata
- Product page container
- Product breadcrumb
- Two-column layout
- Mobile stack layout
- Product data fetcher
- Product TypeScript types
- Product API service
- Route and data flow verified

### Technology Context

- **Routing:** Next.js App Router with [slug]
- **Data:** Server Components + SSR
- **SEO:** Dynamic metadata generation
- **ISR:** Incremental Static Regeneration

---

## Documents in This Group

| # | Document | Description | Tasks Covered |
|---|----------|-------------|---------------|
| 01 | `01_Tasks-01-08_Route-Layout-Meta.md` | Create route, layout, and metadata | 01-08 |
| 02 | `02_Tasks-09-16_Container-Data-Verify.md` | Create container, data fetcher, and verification | 09-16 |

---

## Task Summary

| Task # | Task Name | Complexity | Dependencies |
|--------|-----------|------------|--------------|
| 01 | Create Product Detail Directory | Low | SubPhase-03 |
| 02 | Create Product Page Route | Low | Task 01 |
| 03 | Create Product Page Layout | Low | Task 01 |
| 04 | Create Product Loading State | Low | Task 02 |
| 05 | Create Product Error State | Low | Task 02 |
| 06 | Create Product Not Found Page | Low | Task 05 |
| 07 | Create generateStaticParams | Medium | Task 02 |
| 08 | Create generateMetadata | Medium | Task 02 |
| 09 | Create Product Page Container | Medium | Task 02 |
| 10 | Create Product Breadcrumb | Low | Task 09 |
| 11 | Create Two-Column Layout | Low | Task 09 |
| 12 | Create Mobile Stack Layout | Low | Task 11 |
| 13 | Create Product Data Fetcher | Medium | Task 09 |
| 14 | Create Product Types | Low | Task 13 |
| 15 | Create Product API Service | Medium | Task 14 |
| 16 | Verify Route and Data Flow | Low | Task 15 |

---

## Execution Order

```
Task 01: Product Detail Directory
    │
    ├──────────┬──────────┐
    ▼          ▼          │
Task 02    Task 03       │
(Route)    (Layout)      │
    │          │          │
    ├──────────┘          │
    │                     │
    ├──────────┬──────────┬──────────┬──────────┐
    ▼          ▼          ▼          ▼          │
Task 04    Task 05    Task 07    Task 08       │
(Loading)  (Error)    (Static)   (Meta)        │
    │          │          │          │          │
    │          ▼          │          │          │
    │     Task 06        │          │          │
    │    (Not Found)     │          │          │
    │          │          │          │          │
    └──────────┴──────────┴──────────┘          │
               │                                │
               ▼                                │
         Task 09: Product Page Container        │
               │                                │
         ┌─────┴─────┐                          │
         ▼           ▼                          │
      Task 10    Task 11                        │
    (Breadcrumb)(Two-Column)                    │
         │           │                          │
         │           ▼                          │
         │     Task 12 (Mobile)                 │
         │           │                          │
         └─────┬─────┘                          │
               ▼                                │
         Task 13: Product Data Fetcher          │
               │                                │
               ▼                                │
         Task 14: Product Types                 │
               │                                │
               ▼                                │
         Task 15: Product API Service           │
               │                                │
               ▼
         Task 16: Verify
```

---

## Expected Deliverables

```
frontend/
├── app/
│   └── (storefront)/
│       └── products/
│           └── [slug]/
│               ├── page.tsx
│               ├── layout.tsx
│               ├── loading.tsx
│               ├── error.tsx
│               └── not-found.tsx
├── components/
│   └── storefront/
│       └── product/
│           └── ProductPage/
│               ├── ProductPage.tsx
│               ├── ProductBreadcrumb.tsx
│               ├── ProductLayout.tsx
│               └── index.ts
├── lib/
│   └── store/
│       └── product.ts
├── services/
│   └── store/
│       └── product.ts
└── types/
    └── store/
        └── product.ts
```

---

## Notes for AI Agents

### Route Structure (Task 01-02)
| Route | Path | Description |
|-------|------|-------------|
| Product Detail | /products/[slug] | Single product page |
| Dynamic Param | slug | Product URL slug |

### Loading State (Task 04)
| Section | Skeleton |
|---------|----------|
| Breadcrumb | Text line |
| Gallery | Large image |
| Thumbnails | Small squares |
| Title | Text lines |
| Price | Price block |
| Variants | Button row |
| Actions | Button block |

### Error State (Task 05)
| Element | Content |
|---------|---------|
| Message | "Something went wrong" |
| Retry | Try again button |
| Home | Back to products link |

### Not Found (Task 06)
| Element | Content |
|---------|---------|
| Code | 404 |
| Message | "Product not found" |
| Search | Search products |
| Home | Browse all products |

### generateStaticParams (Task 07)
| Feature | Description |
|---------|-------------|
| Fetch | Top N products |
| Limit | 100 popular products |
| Fallback | 'blocking' for others |

### generateMetadata (Task 08)
| Meta | Source |
|------|--------|
| title | Product name + Store |
| description | Short description |
| openGraph | Product image |
| canonical | /products/[slug] |

### Two-Column Layout (Task 11)
| Column | Width | Content |
|--------|-------|---------|
| Left | 50% | Image gallery |
| Right | 50% | Product info |
| Gap | 32px | Between columns |

### Mobile Stack Layout (Task 12)
| Order | Content |
|-------|---------|
| 1 | Image gallery |
| 2 | Product info |
| 3 | Tabs |
| 4 | Related products |

### Product Data Fetcher (Task 13)
| Data | Endpoint |
|------|----------|
| Product | /api/products/{slug} |
| Related | /api/products/{id}/related |
| Reviews | /api/products/{id}/reviews |
