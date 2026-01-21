# Group A: CMS Routes & Structure

> **Phase:** 08 - Webstore & E-Commerce Platform  
> **SubPhase:** 11 - Static Pages & CMS  
> **Group:** A of F  
> **Tasks Covered:** 01-16  
> **Group Goal:** Create route structure for CMS pages including dynamic routes and page layout components

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** None (First Group)
- **→ Next Group:** [Group-B_Static-Pages](../Group-B_Static-Pages/)

---

## Group Overview

This group creates CMS route structure. Creates pages directory and dynamic page route for CMS content. Creates dedicated routes for About, Contact, FAQ, and Blog pages. Creates page TypeScript types and API service. Creates shared page layout with header and content area. Creates page loading state and 404 not found component. Verifies all CMS routes work correctly.

### Key Outcomes

- Pages directory
- Dynamic page route [slug]
- About route
- Contact route
- FAQ route
- Blog directory
- Blog list route
- Blog detail route [slug]
- Page TypeScript types
- Page API service
- Shared page layout
- Page header component
- Page content area
- Page loading state
- Page not found (404)
- CMS routes verified

### Technology Context

- **Routes:** Next.js App Router
- **Dynamic:** [slug] for CMS pages
- **API:** REST service for pages
- **Types:** TypeScript interfaces

---

## Documents in This Group

| # | Document | Description | Tasks Covered |
|---|----------|-------------|---------------|
| 01 | `01_Tasks-01-08_Routes-Directory.md` | Create routes and directories | 01-08 |
| 02 | `02_Tasks-09-16_Types-Layout-Verify.md` | Create types, layout, and verification | 09-16 |

---

## Task Summary

| Task # | Task Name | Complexity | Dependencies |
|--------|-----------|------------|--------------|
| 01 | Create Pages Directory | Low | SubPhase-10 |
| 02 | Create Dynamic Page Route | Medium | Task 01 |
| 03 | Create About Route | Low | Task 01 |
| 04 | Create Contact Route | Low | Task 01 |
| 05 | Create FAQ Route | Low | Task 01 |
| 06 | Create Blog Directory | Low | Task 01 |
| 07 | Create Blog List Route | Low | Task 06 |
| 08 | Create Blog Detail Route | Medium | Task 06 |
| 09 | Create Page Types | Medium | Task 02 |
| 10 | Create Page API Service | Medium | Task 09 |
| 11 | Create Page Layout | Medium | Task 02 |
| 12 | Create Page Header | Low | Task 11 |
| 13 | Create Page Content Area | Low | Task 11 |
| 14 | Create Page Loading State | Low | Task 02 |
| 15 | Create Page Not Found | Low | Task 02 |
| 16 | Verify CMS Routes | Low | Task 15 |

---

## Execution Order

```
Task 01: Pages Directory
    │
    ├────────┬────────┬────────┬────────┐
    ▼        ▼        ▼        ▼        ▼
T-02     T-03     T-04     T-05     T-06
(Dynamic)(About)(Contact)(FAQ)   (Blog)
    │        │        │        │        │
    │        │        │        │   ┌────┴────┐
    │        │        │        │   ▼         ▼
    │        │        │        │  T-07     T-08
    │        │        │        │ (List)   (Detail)
    │        │        │        │   │         │
    └────────┴────────┴────────┴───┴─────────┘
                   │
         ┌─────────┴─────────┐
         ▼                   ▼
    Task 09: Types      Task 11: Layout
         │                   │
         ▼              ┌────┴────┐
    Task 10: API        ▼         ▼
         │           T-12      T-13
         │         (Header)  (Content)
         │              │         │
         └──────────────┴─────────┘
                   │
         ┌─────────┴─────────┐
         ▼                   ▼
    Task 14: Loading    Task 15: Not Found
         │                   │
         └─────────┬─────────┘
                   │
                   ▼
             Task 16: Verify
```

---

## Expected Deliverables

```
frontend/
├── app/
│   └── (storefront)/
│       ├── about/
│       │   └── page.tsx
│       ├── contact/
│       │   └── page.tsx
│       ├── faq/
│       │   └── page.tsx
│       ├── blog/
│       │   ├── page.tsx
│       │   └── [slug]/
│       │       └── page.tsx
│       └── [slug]/
│           └── page.tsx
├── components/
│   └── storefront/
│       └── cms/
│           └── Layout/
│               ├── PageLayout.tsx
│               ├── PageHeader.tsx
│               ├── PageContent.tsx
│               ├── PageLoading.tsx
│               ├── PageNotFound.tsx
│               └── index.ts
├── services/
│   └── storefront/
│       └── cms/
│           └── pageService.ts
└── types/
    └── storefront/
        └── cms.types.ts
```

---

## Notes for AI Agents

### Pages Directory (Task 01)
| Path | Purpose |
|------|---------|
| app/(storefront)/ | Storefront routes |
| [slug]/ | Dynamic CMS pages |

### Dynamic Page Route (Task 02)
| Feature | Value |
|---------|-------|
| Path | /[slug]/page.tsx |
| Params | { slug: string } |
| Data | Fetch from API |
| Fallback | 404 if not found |

### Page Types (Task 09)
| Interface | Properties |
|-----------|------------|
| CMSPage | id, slug, title, content, seo |
| PageContent | blocks, html, text |
| PageSEO | title, description, image |
| PageStatus | 'draft' or 'published' |

### Page API Service (Task 10)
| Function | Description |
|----------|-------------|
| getPageBySlug | Fetch page by slug |
| getPages | List all pages |
| getBlogPosts | List blog posts |
| getBlogPost | Single blog post |

### Page Layout (Task 11)
| Element | Description |
|---------|-------------|
| Container | Max width, centered |
| Header | Page title area |
| Content | Main content area |
| Padding | Consistent spacing |

### Page Header (Task 12)
| Element | Style |
|---------|-------|
| Title | H1, large |
| Subtitle | Optional |
| Breadcrumb | Navigation |

### Page Loading State (Task 14)
| Element | Style |
|---------|-------|
| Title | Skeleton bar |
| Content | Multiple skeleton lines |
| Animation | Pulse |

### Page Not Found (Task 15)
| Element | Content |
|---------|---------|
| Icon | 404 or sad face |
| Title | "Page Not Found" |
| Message | "The page you're looking for doesn't exist" |
| Link | "Return to Home" |
