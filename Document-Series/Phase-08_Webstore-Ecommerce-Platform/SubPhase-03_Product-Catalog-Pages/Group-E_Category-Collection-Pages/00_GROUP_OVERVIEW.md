# Group E: Category & Collection Pages

> **Phase:** 08 - Webstore & E-Commerce Platform  
> **SubPhase:** 03 - Product Catalog Pages  
> **Group:** E of F  
> **Tasks Covered:** 71-84  
> **Group Goal:** Create category and collection specific pages with headers, banners, and data fetching

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group-D_Sort-Pagination](../Group-D_Sort-Pagination/)
- **→ Next Group:** [Group-F_Empty-States-Testing](../Group-F_Empty-States-Testing/)

---

## Group Overview

This group creates category and collection pages. Creates category page component with header (banner image, description). Creates subcategory navigation. Creates category data fetcher and SEO meta. Creates collection page component with header and description. Creates collection data fetcher and SEO meta. Creates featured collections section for homepage. Verifies both category and collection pages.

### Key Outcomes

- Category page component
- Category header
- Category banner image
- Category description
- Subcategory navigation
- Category data fetcher
- Category SEO meta
- Collection page component
- Collection header
- Collection description
- Collection data fetcher
- Collection SEO meta
- Featured collections section
- Category/Collection pages verified

### Technology Context

- **Data:** Server Components + SSR
- **SEO:** Dynamic meta generation
- **Images:** Next.js Image optimization
- **ISR:** Incremental Static Regeneration

---

## Documents in This Group

| # | Document | Description | Tasks Covered |
|---|----------|-------------|---------------|
| 01 | `01_Tasks-71-77_Category-Page.md` | Create category page with header and data | 71-77 |
| 02 | `02_Tasks-78-84_Collection-Page-Verify.md` | Create collection page and verification | 78-84 |

---

## Task Summary

| Task # | Task Name | Complexity | Dependencies |
|--------|-----------|------------|--------------|
| 71 | Create Category Page Component | Medium | Task 70 |
| 72 | Create Category Header | Medium | Task 71 |
| 73 | Create Category Banner Image | Low | Task 72 |
| 74 | Create Category Description | Low | Task 72 |
| 75 | Create Subcategory Navigation | Medium | Task 71 |
| 76 | Create Category Data Fetcher | Medium | Task 71 |
| 77 | Create Category SEO Meta | Low | Task 71 |
| 78 | Create Collection Page Component | Medium | Task 70 |
| 79 | Create Collection Header | Medium | Task 78 |
| 80 | Create Collection Description | Low | Task 79 |
| 81 | Create Collection Data Fetcher | Medium | Task 78 |
| 82 | Create Collection SEO Meta | Low | Task 78 |
| 83 | Create Featured Collections Section | Medium | Task 78 |
| 84 | Verify Category/Collection Pages | Low | Task 83 |

---

## Execution Order

```
Task 71: Category Page Component
    │
    ├──────────────────────────────────────────────────┐
    ▼                                                  │
Task 72: Category Header                               │
    │                                                  │
    ├──────────┬──────────┐                            │
    ▼          ▼          │                            │
Task 73    Task 74       │                            │
(Banner)   (Desc)        │                            │
    │          │          │                            │
    └──────────┘          │                            │
         │                │                            │
         ▼                │                            │
   Task 75: Subcategory Navigation                     │
         │                │                            │
         ▼                │                            │
   Task 76: Category Data Fetcher                      │
         │                │                            │
         ▼                │                            │
   Task 77: Category SEO Meta                          │
         │                │                            │
         └────────────────┘                            │
                   │                                   │
                   ▼                                   │
             Task 78: Collection Page Component        │
                   │                                   │
             ┌─────┴─────┐                             │
             ▼           │                             │
          Task 79: Collection Header                   │
             │           │                             │
             ▼           │                             │
          Task 80: Collection Description              │
             │           │                             │
             └─────┬─────┘                             │
                   │                                   │
             ┌─────┴─────┐                             │
             ▼           ▼                             │
          Task 81    Task 82                           │
         (Data)     (SEO)                              │
             │           │                             │
             └─────┬─────┘                             │
                   ▼                                   │
             Task 83: Featured Collections             │
                   │                                   │
                   ▼
             Task 84: Verify
```

---

## Expected Deliverables

```
frontend/
├── app/
│   └── (storefront)/
│       └── products/
│           ├── category/
│           │   └── [slug]/
│           │       └── page.tsx
│           └── collection/
│               └── [slug]/
│                   └── page.tsx
├── components/
│   └── storefront/
│       └── catalog/
│           ├── Category/
│           │   ├── CategoryPage.tsx
│           │   ├── CategoryHeader.tsx
│           │   ├── CategoryBanner.tsx
│           │   ├── CategoryDescription.tsx
│           │   ├── SubcategoryNav.tsx
│           │   └── index.ts
│           ├── Collection/
│           │   ├── CollectionPage.tsx
│           │   ├── CollectionHeader.tsx
│           │   ├── CollectionDescription.tsx
│           │   ├── FeaturedCollections.tsx
│           │   └── index.ts
│           └── index.ts
├── lib/
│   └── store/
│       ├── categories.ts
│       └── collections.ts
```

---

## Notes for AI Agents

### Category Page (Task 71)
| Section | Content |
|---------|---------|
| Header | Banner + title + description |
| Subcategories | Child category links |
| Products | Filtered product grid |
| Filters | Category-specific filters |

### Category Header (Task 72)
| Element | Description |
|---------|-------------|
| Banner | Full-width category image |
| Title | Category name (H1) |
| Description | Category description |
| Breadcrumb | Navigation path |

### Category Banner (Task 73)
| Property | Value |
|----------|-------|
| Height | 200-300px |
| Image | Category banner image |
| Overlay | Dark gradient for text |
| Fallback | Default category pattern |

### Subcategory Navigation (Task 75)
| Feature | Description |
|---------|-------------|
| Display | Horizontal scroll or grid |
| Items | Child categories |
| Style | Pill buttons |
| Count | Product count badge |

### Category Data Fetcher (Task 76)
| Data | Source |
|------|--------|
| Category | /api/categories/{slug} |
| Products | /api/products?category={id} |
| Subcategories | Included in category |
| Filters | Dynamic from products |

### Category SEO Meta (Task 77)
| Meta | Content |
|------|---------|
| Title | {Category} | Store Name |
| Description | Category description |
| OG Image | Category banner |
| Canonical | /products/category/{slug} |

### Collection Page (Task 78)
| Section | Content |
|---------|---------|
| Header | Banner + story |
| Description | Collection story |
| Products | Curated product grid |
| Related | Related collections |

### Collection Header (Task 79)
| Element | Description |
|---------|-------------|
| Banner | Collection hero image |
| Title | Collection name |
| Story | Collection narrative |
| Style | Editorial layout |

### Collection Data Fetcher (Task 81)
| Data | Source |
|------|--------|
| Collection | /api/collections/{slug} |
| Products | /api/collections/{id}/products |
| Related | Included in collection |

### Featured Collections (Task 83)
| Feature | Description |
|---------|-------------|
| Location | Homepage section |
| Display | Grid of collection cards |
| Limit | 4-6 collections |
| Style | Image + title overlay |
