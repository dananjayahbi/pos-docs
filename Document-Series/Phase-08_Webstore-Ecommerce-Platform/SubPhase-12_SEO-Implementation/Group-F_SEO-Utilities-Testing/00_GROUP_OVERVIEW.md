# Group F: SEO Utilities & Testing

> **Phase:** 08 - Webstore & E-Commerce Platform  
> **SubPhase:** 12 - SEO Implementation  
> **Group:** F of F  
> **Tasks Covered:** 83-92  
> **Group Goal:** Create SEO preview tools and perform comprehensive SEO testing

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group-E_Robots-Canonicals](../Group-E_Robots-Canonicals/)
- **→ Next Group:** None (Last Group) | **Next SubPhase:** [SubPhase-13_Performance-Optimization](../SubPhase-13_Performance-Optimization/)

---

## Group Overview

This group creates SEO utilities and testing. Creates SEO preview component for admin use. Creates title length check with 60 character limit warning and description length check with 160 character limit. Creates Google SERP preview showing how page appears in search results. Creates social preview for Facebook and Twitter. Performs comprehensive testing: product schema validation with Google Rich Results Test, sitemap access test, robots blocking verification, social sharing test with Facebook Debugger, and Lighthouse SEO audit.

### Key Outcomes

- SEO preview component
- Title length check (60 chars)
- Description length check (160 chars)
- Google SERP preview
- Social preview (Facebook/Twitter)
- Product schema tested
- Sitemap access tested
- Robots blocking tested
- Social sharing tested
- Lighthouse SEO audit

### Technology Context

- **Preview:** Admin tool
- **Validation:** Character limits
- **Testing:** Google tools, Lighthouse
- **Debugging:** Facebook Debugger

---

## Documents in This Group

| # | Document | Description | Tasks Covered |
|---|----------|-------------|---------------|
| 01 | `01_Tasks-83-87_Preview-Tools.md` | Create preview tools | 83-87 |
| 02 | `02_Tasks-88-92_Testing.md` | Perform comprehensive testing | 88-92 |

---

## Task Summary

| Task # | Task Name | Complexity | Dependencies |
|--------|-----------|------------|--------------|
| 83 | Create SEO Preview Component | Medium | Task 82 |
| 84 | Create Title Length Check | Low | Task 83 |
| 85 | Create Description Length | Low | Task 83 |
| 86 | Create Google Preview | Medium | Task 83 |
| 87 | Create Social Preview | Medium | Task 83 |
| 88 | Test Product Schema | Low | Task 54 |
| 89 | Test Sitemap Access | Low | Task 70 |
| 90 | Test Robots Blocking | Low | Task 82 |
| 91 | Test Social Sharing | Low | Task 34 |
| 92 | Test SEO Audit | Low | Task 91 |

---

## Execution Order

```
Task 83: SEO Preview Component
    │
    ├────────┬────────┬────────┐
    ▼        ▼        ▼        ▼
T-84     T-85     T-86     T-87
(Title)(Descrip)(Google)(Social)
    │        │        │        │
    └────────┴────────┴────────┘
              │
    ┌─────────┼─────────┬─────────┬─────────┐
    ▼         ▼         ▼         ▼         ▼
T-88      T-89      T-90      T-91
(Schema) (Sitemap) (Robots) (Social)
    │         │         │         │
    └─────────┴─────────┴─────────┘
                   │
                   ▼
             Task 92: SEO Audit
```

---

## Expected Deliverables

```
frontend/
├── components/
│   └── seo/
│       └── SEOPreview/
│           ├── SEOPreview.tsx
│           ├── TitleCheck.tsx
│           ├── DescriptionCheck.tsx
│           ├── GooglePreview.tsx
│           ├── SocialPreview.tsx
│           └── index.ts
└── tests/
    └── e2e/
        └── seo/
            ├── schema.spec.ts
            ├── sitemap.spec.ts
            ├── robots.spec.ts
            └── social.spec.ts
```

---

## Notes for AI Agents

### SEO Preview Component (Task 83)
| Feature | Description |
|---------|-------------|
| Location | Admin/CMS panel |
| Input | Title, description, image |
| Output | Preview panels |

### Title Length Check (Task 84)
| Check | Value |
|-------|-------|
| Max | 60 characters |
| Warning | Yellow 50-60 |
| Error | Red > 60 |
| Counter | "45/60" format |

### Description Length (Task 85)
| Check | Value |
|-------|-------|
| Max | 160 characters |
| Warning | Yellow 140-160 |
| Error | Red > 160 |
| Counter | "120/160" format |

### Google Preview (Task 86)
| Element | Style |
|---------|-------|
| Title | Blue link |
| URL | Green URL |
| Description | Gray text |
| Truncate | As Google does |

### Social Preview (Task 87)
| Platform | Preview |
|----------|---------|
| Facebook | Card with image |
| Twitter | Large image card |
| Show | Title, description, image |

### Test Product Schema (Task 88)
| Tool | URL |
|------|-----|
| Google Rich Results | https://search.google.com/test/rich-results |
| Input | Product page URL |
| Check | No errors |

### Test Sitemap Access (Task 89)
| Test | Expected |
|------|----------|
| URL | /sitemap.xml |
| Response | 200 OK |
| Content | Valid XML |
| URLs | All products listed |

### Test Robots Blocking (Task 90)
| Test | Expected |
|------|----------|
| URL | /robots.txt |
| Disallow | /account blocked |
| Disallow | /cart blocked |
| Allow | /products allowed |

### Test Social Sharing (Task 91)
| Tool | URL |
|------|-----|
| Facebook Debugger | https://developers.facebook.com/tools/debug |
| Input | Page URL |
| Check | Image, title, description |

### Test SEO Audit (Task 92)
| Tool | Metric |
|------|--------|
| Lighthouse | SEO score |
| Target | 90+ score |
| Check | Meta, mobile, crawlable |
