# Group D: Sitemap Generation

> **Phase:** 08 - Webstore & E-Commerce Platform  
> **SubPhase:** 12 - SEO Implementation  
> **Group:** D of F  
> **Tasks Covered:** 55-70  
> **Group Goal:** Create dynamic sitemap.xml generation with all page URLs

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group-C_Structured-Data-Schemas](../Group-C_Structured-Data-Schemas/)
- **→ Next Group:** [Group-E_Robots-Canonicals](../Group-E_Robots-Canonicals/)

---

## Group Overview

This group creates sitemap generation. Creates sitemap route in Next.js App Router. Creates sitemap generator function to produce XML. Creates URL entries for static pages, products, categories, collections, blog posts, and CMS pages. Creates priority and changefreq settings per URL type. Creates lastmod date for each URL. Creates sitemap index for large sites with multiple sitemap files. Creates separate product sitemap and image sitemap entries. Creates sitemap caching for performance. Verifies sitemap.xml loads correctly.

### Key Outcomes

- Sitemap route
- Sitemap generator
- Static URLs
- Product URLs
- Category URLs
- Collection URLs
- Blog URLs
- CMS page URLs
- URL priority
- URL changefreq
- URL lastmod
- Sitemap index
- Product sitemap
- Image sitemap entries
- Sitemap caching
- Sitemap verified

### Technology Context

- **Route:** app/sitemap.ts
- **Format:** XML sitemap protocol
- **Index:** Sitemap index for large sites
- **Caching:** Revalidate periodically

---

## Documents in This Group

| # | Document | Description | Tasks Covered |
|---|----------|-------------|---------------|
| 01 | `01_Tasks-55-65_Core-URLs.md` | Create core sitemap and URLs | 55-65 |
| 02 | `02_Tasks-66-70_Index-Cache-Verify.md` | Create index, cache, and verification | 66-70 |

---

## Task Summary

| Task # | Task Name | Complexity | Dependencies |
|--------|-----------|------------|--------------|
| 55 | Create Sitemap Route | Medium | Task 54 |
| 56 | Create Sitemap Generator | Medium | Task 55 |
| 57 | Create Static URLs | Low | Task 56 |
| 58 | Create Product URLs | Medium | Task 56 |
| 59 | Create Category URLs | Low | Task 56 |
| 60 | Create Collection URLs | Low | Task 56 |
| 61 | Create Blog URLs | Low | Task 56 |
| 62 | Create CMS Page URLs | Low | Task 56 |
| 63 | Create URL Priority | Low | Task 56 |
| 64 | Create URL Changefreq | Low | Task 56 |
| 65 | Create URL Lastmod | Low | Task 56 |
| 66 | Create Sitemap Index | Medium | Task 56 |
| 67 | Create Product Sitemap | Medium | Task 66 |
| 68 | Create Image Sitemap | Medium | Task 67 |
| 69 | Create Sitemap Caching | Medium | Task 56 |
| 70 | Verify Sitemap | Low | Task 69 |

---

## Execution Order

```
Task 55: Sitemap Route
    │
    ▼
Task 56: Sitemap Generator
    │
    ├────────┬────────┬────────┬────────┬────────┬────────┬────────┬────────┐
    ▼        ▼        ▼        ▼        ▼        ▼        ▼        ▼        ▼
T-57     T-58     T-59     T-60     T-61     T-62     T-63     T-64     T-65
(Static)(Prod)   (Cat)   (Coll)  (Blog)   (CMS) (Priority)(Freq) (Lastmod)
    │        │        │        │        │        │        │        │        │
    └────────┴────────┴────────┴────────┴────────┴────────┴────────┴────────┘
                                   │
                              ┌────┴────┐
                              ▼         ▼
                           T-66      T-69
                         (Index)   (Cache)
                              │         │
                              ▼         │
                           T-67        │
                        (Products)     │
                              │         │
                              ▼         │
                           T-68        │
                         (Images)      │
                              │         │
                              └────┬────┘
                                   │
                                   ▼
                             Task 70: Verify
```

---

## Expected Deliverables

```
frontend/
└── app/
    ├── sitemap.ts
    ├── sitemap/
    │   └── [id]/route.ts (for index)
    └── robots.ts
└── lib/
    └── seo/
        └── sitemap.ts
```

---

## Notes for AI Agents

### Sitemap Route (Task 55)
| File | Purpose |
|------|---------|
| app/sitemap.ts | Next.js sitemap route |
| Export | MetadataRoute.Sitemap |

### Sitemap Generator (Task 56)
| Function | Return |
|----------|--------|
| generateSitemap | Array of URLs |
| Format | { url, lastModified, priority, changeFrequency } |

### Static URLs (Task 57)
| Page | URL |
|------|-----|
| Home | / |
| About | /about |
| Contact | /contact |
| FAQ | /faq |
| Blog | /blog |

### Product URLs (Task 58)
| Source | URL |
|--------|-----|
| All products | /products/{slug} |
| Fetch | From API |
| Include | Only published |

### Category URLs (Task 59)
| Source | URL |
|--------|-----|
| All categories | /categories/{slug} |
| Fetch | From API |
| Include | Active only |

### URL Priority (Task 63)
| Page Type | Priority |
|-----------|----------|
| Homepage | 1.0 |
| Categories | 0.9 |
| Products | 0.8 |
| Blog posts | 0.7 |
| Static pages | 0.6 |

### URL Changefreq (Task 64)
| Page Type | Frequency |
|-----------|-----------|
| Homepage | daily |
| Products | weekly |
| Categories | weekly |
| Blog | monthly |
| Static | monthly |

### URL Lastmod (Task 65)
| Source | Value |
|--------|-------|
| Products | updatedAt |
| Blog | publishedAt |
| Static | Hard-coded |

### Sitemap Index (Task 66)
| Sitemap | URL |
|---------|-----|
| Main | /sitemap.xml |
| Products | /sitemap/products.xml |
| Blog | /sitemap/blog.xml |

### Product Sitemap (Task 67)
| Content | URLs |
|---------|------|
| Products | All product URLs |
| Limit | 50,000 per file |
| Split | Multiple files if needed |

### Image Sitemap (Task 68)
| Tag | Content |
|-----|---------|
| image:loc | Image URL |
| image:title | Product name |
| Include | Main product images |

### Sitemap Caching (Task 69)
| Strategy | Value |
|----------|-------|
| Revalidate | 3600 (1 hour) |
| Cache | Response level |
| Invalidate | On product update |
