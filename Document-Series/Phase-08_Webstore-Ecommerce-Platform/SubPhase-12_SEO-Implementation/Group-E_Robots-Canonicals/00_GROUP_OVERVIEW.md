# Group E: Robots & Canonicals

> **Phase:** 08 - Webstore & E-Commerce Platform  
> **SubPhase:** 12 - SEO Implementation  
> **Group:** E of F  
> **Tasks Covered:** 71-82  
> **Group Goal:** Create robots.txt configuration and canonical URL management

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group-D_Sitemap-Generation](../Group-D_Sitemap-Generation/)
- **→ Next Group:** [Group-F_SEO-Utilities-Testing](../Group-F_SEO-Utilities-Testing/)

---

## Group Overview

This group creates robots.txt and canonical URLs. Creates robots.txt route in Next.js. Creates robots rules for Allow and Disallow. Creates sitemap reference in robots.txt. Creates crawler-specific rules for Googlebot. Creates disallow paths for account, cart, checkout, etc. Creates canonical URL helper for generating canonical links. Creates canonicals for homepage, products, paginated pages, and filtered pages. Creates alternate links for future internationalization. Verifies robots.txt and canonical setup.

### Key Outcomes

- Robots.txt route
- Robots rules (Allow/Disallow)
- Sitemap reference
- Crawler-specific rules
- Disallow paths (/account, /cart, etc.)
- Canonical URL helper
- Homepage canonical
- Product canonical
- Pagination canonical
- Filter canonical
- Alternate links (hreflang)
- Robots & canonical verified

### Technology Context

- **Route:** app/robots.ts
- **Canonical:** Link rel="canonical"
- **Alternate:** hreflang links
- **Crawlers:** Googlebot, Bingbot

---

## Documents in This Group

| # | Document | Description | Tasks Covered |
|---|----------|-------------|---------------|
| 01 | `01_Tasks-71-76_Robots-Canonical.md` | Create robots and canonical helper | 71-76 |
| 02 | `02_Tasks-77-82_Page-Canonicals-Verify.md` | Create page canonicals and verification | 77-82 |

---

## Task Summary

| Task # | Task Name | Complexity | Dependencies |
|--------|-----------|------------|--------------|
| 71 | Create Robots Route | Medium | Task 70 |
| 72 | Create Robots Rules | Low | Task 71 |
| 73 | Create Sitemap Reference | Low | Task 71 |
| 74 | Create Crawler Specific | Low | Task 72 |
| 75 | Create Disallow Paths | Low | Task 72 |
| 76 | Create Canonical URL Helper | Medium | Task 70 |
| 77 | Create Homepage Canonical | Low | Task 76 |
| 78 | Create Product Canonical | Low | Task 76 |
| 79 | Create Pagination Canonical | Medium | Task 76 |
| 80 | Create Filter Canonical | Medium | Task 76 |
| 81 | Create Alternate Links | Medium | Task 76 |
| 82 | Verify Robots & Canonical | Low | Task 81 |

---

## Execution Order

```
Task 71: Robots Route                Task 76: Canonical Helper
    │                                     │
    ├────────┬────────┐              ┌────┼────────┬────────┬────────┐
    ▼        ▼        ▼              ▼    ▼        ▼        ▼        ▼
T-72     T-73     T-74            T-77  T-78     T-79     T-80     T-81
(Rules)(Sitemap)(Crawler)        (Home)(Product)(Page)  (Filter)(Alter)
    │        │        │              │    │        │        │        │
    ▼        │        │              │    │        │        │        │
T-75        │        │              │    │        │        │        │
(Disallow)  │        │              │    │        │        │        │
    │        │        │              │    │        │        │        │
    └────────┴────────┴──────────────┴────┴────────┴────────┴────────┘
                              │
                              ▼
                        Task 82: Verify
```

---

## Expected Deliverables

```
frontend/
├── app/
│   └── robots.ts
└── lib/
    └── seo/
        └── canonical.ts
```

---

## Notes for AI Agents

### Robots Route (Task 71)
| File | Purpose |
|------|---------|
| app/robots.ts | Next.js robots route |
| Export | MetadataRoute.Robots |

### Robots Rules (Task 72)
| Rule | Path |
|------|------|
| Allow | / |
| Disallow | /account |
| Disallow | /cart |
| Disallow | /checkout |

### Sitemap Reference (Task 73)
| Field | Value |
|-------|-------|
| Sitemap | https://site.com/sitemap.xml |
| Position | End of robots.txt |

### Crawler Specific (Task 74)
| Crawler | Rules |
|---------|-------|
| Googlebot | Standard rules |
| Bingbot | Standard rules |
| GPTBot | Disallow (optional) |

### Disallow Paths (Task 75)
| Path | Reason |
|------|--------|
| /account | Private area |
| /cart | No index value |
| /checkout | Private process |
| /api | API endpoints |
| /admin | Admin area |

### Canonical URL Helper (Task 76)
| Function | Return |
|----------|--------|
| getCanonicalUrl | Absolute URL |
| Input | Path or params |
| Output | Full canonical URL |

### Homepage Canonical (Task 77)
| Value | URL |
|-------|-----|
| Homepage | https://site.com/ |
| No trailing | Remove trailing slash |

### Product Canonical (Task 78)
| Value | URL |
|-------|-----|
| Product | /products/{slug} |
| Ignore | Query params |

### Pagination Canonical (Task 79)
| Strategy | Value |
|----------|-------|
| Page 1 | Main URL (no ?page) |
| Page 2+ | Include ?page=N |
| Or | Self-referencing |

### Filter Canonical (Task 80)
| Strategy | Value |
|----------|-------|
| Filtered | Canonical to base |
| Or | Self-referencing |
| Exclude | Filter params |

### Alternate Links (Task 81)
| Tag | Value |
|-----|-------|
| rel | alternate |
| hreflang | en |
| href | Localized URL |
| Future | For multi-language |
