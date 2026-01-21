# Group B: Open Graph & Social

> **Phase:** 08 - Webstore & E-Commerce Platform  
> **SubPhase:** 12 - SEO Implementation  
> **Group:** B of F  
> **Tasks Covered:** 17-34  
> **Group Goal:** Create Open Graph and Twitter Card meta tags for social sharing

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group-A_Meta-Tags-Infrastructure](../Group-A_Meta-Tags-Infrastructure/)
- **→ Next Group:** [Group-C_Structured-Data-Schemas](../Group-C_Structured-Data-Schemas/)

---

## Group Overview

This group creates social sharing tags. Creates OG tags helper for generating Open Graph meta tags. Creates individual OG tags for title, description, image, image dimensions, type, URL, and site name. Creates Twitter card tags helper with card type, title, description, and image. Creates product-specific OG tags with price information. Creates blog article OG tags. Creates OG locale tag. Verifies social share previews work correctly.

### Key Outcomes

- OG tags helper
- og:title tag
- og:description tag
- og:image tag
- og:image dimensions
- og:type tag
- og:url tag
- og:site_name tag
- Twitter card helper
- twitter:card type
- twitter:title tag
- twitter:description tag
- twitter:image tag
- Product OG tags
- OG price tags (product:price)
- Blog OG tags (article)
- og:locale tag
- Social tags verified

### Technology Context

- **Open Graph:** Facebook sharing
- **Twitter Cards:** Twitter sharing
- **Image Size:** 1200x630 recommended
- **Validation:** Facebook Debugger

---

## Documents in This Group

| # | Document | Description | Tasks Covered |
|---|----------|-------------|---------------|
| 01 | `01_Tasks-17-26_OG-Twitter-Core.md` | Create OG and Twitter core tags | 17-26 |
| 02 | `02_Tasks-27-34_Product-Blog-Verify.md` | Create product/blog tags and verification | 27-34 |

---

## Task Summary

| Task # | Task Name | Complexity | Dependencies |
|--------|-----------|------------|--------------|
| 17 | Create OG Tags Helper | Medium | Task 16 |
| 18 | Create OG Title | Low | Task 17 |
| 19 | Create OG Description | Low | Task 17 |
| 20 | Create OG Image | Medium | Task 17 |
| 21 | Create OG Image Size | Low | Task 20 |
| 22 | Create OG Type | Low | Task 17 |
| 23 | Create OG URL | Low | Task 17 |
| 24 | Create OG Site Name | Low | Task 17 |
| 25 | Create Twitter Card Tags | Medium | Task 16 |
| 26 | Create Twitter Card Type | Low | Task 25 |
| 27 | Create Twitter Title | Low | Task 25 |
| 28 | Create Twitter Description | Low | Task 25 |
| 29 | Create Twitter Image | Low | Task 25 |
| 30 | Create Product OG Tags | Medium | Task 17 |
| 31 | Create OG Price Tags | Low | Task 30 |
| 32 | Create Blog OG Tags | Medium | Task 17 |
| 33 | Create OG Locale | Low | Task 17 |
| 34 | Verify Social Tags | Low | Task 33 |

---

## Execution Order

```
Task 17: OG Tags Helper              Task 25: Twitter Card Tags
    │                                     │
    ├────────┬────────┬────────┬────────┐ │
    ▼        ▼        ▼        ▼        │ │
T-18     T-19     T-20     T-22     T-23 │ T-24 T-33
(Title)(Descrip)(Image)  (Type)  (URL)  │ (Site)(Locale)
    │        │        │        │        │ │    │    │
    │        │        ▼        │        │ │    │    │
    │        │     T-21       │        │ │    │    │
    │        │   (Size)       │        │ │    │    │
    │        │        │        │        │ │    │    │
    └────────┴────────┴────────┴────────┴─┴────┴────┘
                   │                      │
              ┌────┴────────┐        ┌────┴────┬────────┐
              ▼             ▼        ▼         ▼        ▼
           T-30          T-32     T-26      T-27     T-28
         (Product)      (Blog) (CardType)(Title) (Descrip)
              │             │        │         │        │
              ▼             │        │         │        ▼
           T-31            │        │         │     T-29
         (Price)           │        │         │   (Image)
              │             │        │         │        │
              └─────────────┴────────┴─────────┴────────┘
                                   │
                                   ▼
                             Task 34: Verify
```

---

## Expected Deliverables

```
frontend/
└── lib/
    └── seo/
        ├── openGraph.ts
        └── twitterCard.ts
```

---

## Notes for AI Agents

### OG Tags Helper (Task 17)
| Function | Return |
|----------|--------|
| generateOG | OG metadata object |
| Input | PageMeta |
| Output | Next.js openGraph |

### OG Title (Task 18)
| Tag | Value |
|-----|-------|
| og:title | Page title |
| Max | 60 chars |
| Same | As <title> |

### OG Description (Task 19)
| Tag | Value |
|-----|-------|
| og:description | Page description |
| Max | 160 chars |
| Same | As meta description |

### OG Image (Task 20)
| Tag | Value |
|-----|-------|
| og:image | Absolute URL |
| Size | 1200x630 minimum |
| Format | JPG, PNG |

### OG Image Size (Task 21)
| Tag | Value |
|-----|-------|
| og:image:width | 1200 |
| og:image:height | 630 |

### OG Type (Task 22)
| Page | Type |
|------|------|
| Product | product |
| Blog | article |
| Other | website |

### OG URL (Task 23)
| Tag | Value |
|-----|-------|
| og:url | Canonical URL |
| Absolute | Full URL |

### Twitter Card Type (Task 26)
| Type | Use |
|------|-----|
| summary | Small image |
| summary_large_image | Large image (use this) |

### Product OG Tags (Task 30)
| Tag | Value |
|-----|-------|
| og:type | product |
| product:price:amount | Price |
| product:price:currency | LKR |

### OG Price Tags (Task 31)
| Tag | Value |
|-----|-------|
| product:price:amount | 1999.00 |
| product:price:currency | LKR |
| product:availability | instock |

### Blog OG Tags (Task 32)
| Tag | Value |
|-----|-------|
| og:type | article |
| article:published_time | ISO date |
| article:author | Author name |
| article:section | Category |

### OG Locale (Task 33)
| Tag | Value |
|-----|-------|
| og:locale | en_US |
| Alternate | en_LK (future) |
