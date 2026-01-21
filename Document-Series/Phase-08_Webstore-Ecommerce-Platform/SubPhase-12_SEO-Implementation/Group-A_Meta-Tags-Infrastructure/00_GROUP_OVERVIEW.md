# Group A: Meta Tags Infrastructure

> **Phase:** 08 - Webstore & E-Commerce Platform  
> **SubPhase:** 12 - SEO Implementation  
> **Group:** A of F  
> **Tasks Covered:** 01-16  
> **Group Goal:** Create metadata infrastructure with helpers and page-specific SEO

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** None (First Group)
- **→ Next Group:** [Group-B_Open-Graph-Social](../Group-B_Open-Graph-Social/)

---

## Group Overview

This group creates meta tags infrastructure. Creates SEO directory and TypeScript SEO interfaces. Creates base metadata with default site values and metadata config. Creates generateMetadata helper function for reusable metadata generation. Creates title template with "Page Title | Site Name" format and description helper for truncation. Creates page-specific metadata for homepage, product, category, collection, search, blog, and CMS pages. Creates noindex handler for pages that should not be indexed. Verifies meta tags output correctly.

### Key Outcomes

- SEO directory
- SEO TypeScript types
- Base metadata defaults
- Metadata config
- generateMetadata helper
- Title template
- Description helper
- Homepage metadata
- Product metadata
- Category metadata
- Collection metadata
- Search metadata
- Blog metadata
- CMS page metadata
- Noindex handler
- Meta tags verified

### Technology Context

- **API:** Next.js Metadata API
- **Function:** generateMetadata export
- **Template:** Title template
- **Types:** TypeScript interfaces

---

## Documents in This Group

| # | Document | Description | Tasks Covered |
|---|----------|-------------|---------------|
| 01 | `01_Tasks-01-08_Setup-Helpers.md` | Create directory, types, helpers | 01-08 |
| 02 | `02_Tasks-09-16_Page-Metadata-Verify.md` | Create page metadata and verification | 09-16 |

---

## Task Summary

| Task # | Task Name | Complexity | Dependencies |
|--------|-----------|------------|--------------|
| 01 | Create SEO Directory | Low | SubPhase-11 |
| 02 | Create SEO Types | Medium | Task 01 |
| 03 | Create Base Metadata | Low | Task 02 |
| 04 | Create Metadata Config | Low | Task 03 |
| 05 | Create generateMetadata Helper | Medium | Task 04 |
| 06 | Create Title Template | Low | Task 05 |
| 07 | Create Description Helper | Low | Task 05 |
| 08 | Create Homepage Metadata | Low | Task 05 |
| 09 | Create Product Metadata | Medium | Task 05 |
| 10 | Create Category Metadata | Medium | Task 05 |
| 11 | Create Collection Metadata | Medium | Task 05 |
| 12 | Create Search Metadata | Low | Task 05 |
| 13 | Create Blog Metadata | Medium | Task 05 |
| 14 | Create CMS Page Metadata | Medium | Task 05 |
| 15 | Create Noindex Handler | Low | Task 05 |
| 16 | Verify Meta Tags | Low | Task 15 |

---

## Execution Order

```
Task 01: SEO Directory
    │
    ▼
Task 02: SEO Types
    │
    ▼
Task 03: Base Metadata
    │
    ▼
Task 04: Metadata Config
    │
    ▼
Task 05: generateMetadata Helper
    │
    ├────────┬────────┐
    ▼        ▼        │
T-06      T-07       │
(Title) (Descrip)    │
    │        │        │
    └────────┘        │
         │            │
         ├────────────┴──────────────────────────────────┐
         │                                               │
    ┌────┼────┬────────┬────────┬────────┬────────┬────────┐
    ▼    ▼    ▼        ▼        ▼        ▼        ▼        ▼
T-08  T-09  T-10    T-11    T-12    T-13    T-14    T-15
(Home)(Prod)(Cat)  (Coll) (Search)(Blog)  (CMS) (Noindex)
    │    │    │        │        │        │        │        │
    └────┴────┴────────┴────────┴────────┴────────┴────────┘
                              │
                              ▼
                        Task 16: Verify
```

---

## Expected Deliverables

```
frontend/
├── lib/
│   └── seo/
│       ├── index.ts
│       ├── metadata.ts
│       ├── constants.ts
│       └── helpers.ts
├── types/
│   └── seo/
│       └── metadata.types.ts
└── app/
    └── (storefront)/
        ├── page.tsx (generateMetadata)
        ├── products/
        │   └── [slug]/page.tsx (generateMetadata)
        ├── categories/
        │   └── [slug]/page.tsx (generateMetadata)
        └── blog/
            └── [slug]/page.tsx (generateMetadata)
```

---

## Notes for AI Agents

### SEO Directory (Task 01)
| Path | Purpose |
|------|---------|
| lib/seo/ | SEO utilities |
| types/seo/ | TypeScript types |

### SEO Types (Task 02)
| Interface | Properties |
|-----------|------------|
| SEOConfig | siteName, siteUrl, defaults |
| PageMeta | title, description, image |
| MetadataParams | page, product, category |

### Base Metadata (Task 03)
| Field | Default |
|-------|---------|
| title | "Store Name" |
| description | Site description |
| keywords | Main keywords |

### Metadata Config (Task 04)
| Field | Value |
|-------|-------|
| siteName | "Store Name" |
| siteUrl | process.env.SITE_URL |
| twitterHandle | @storename |

### generateMetadata Helper (Task 05)
| Input | Output |
|-------|--------|
| PageMeta | Metadata object |
| Merge | With defaults |
| Template | Apply title template |

### Title Template (Task 06)
| Format | Example |
|--------|---------|
| Template | "%s | Store Name" |
| Page | "Product Name | Store Name" |
| Max | 60 characters |

### Description Helper (Task 07)
| Feature | Value |
|---------|-------|
| Max length | 160 chars |
| Truncate | Add ellipsis |
| Strip HTML | Remove tags |

### Product Metadata (Task 09)
| Field | Source |
|-------|--------|
| title | product.name |
| description | product.shortDescription |
| image | product.images[0] |

### Category Metadata (Task 10)
| Field | Source |
|-------|--------|
| title | "Shop {category.name}" |
| description | category.description |
| image | category.image |

### Blog Metadata (Task 13)
| Field | Source |
|-------|--------|
| title | post.title |
| description | post.excerpt |
| image | post.featuredImage |
| author | post.author |

### Noindex Handler (Task 15)
| Page | Noindex |
|------|---------|
| Search results | Yes |
| Account pages | Yes |
| Cart/Checkout | Yes |
| Filter results | Optional |
