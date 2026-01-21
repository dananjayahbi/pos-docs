# Group A: Image Optimization

> **Phase:** 08 - Webstore & E-Commerce Platform  
> **SubPhase:** 13 - Performance Optimization  
> **Group:** A of F  
> **Tasks Covered:** 01-18  
> **Group Goal:** Optimize images with WebP/AVIF, lazy loading, and responsive sizes

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** None (First Group)
- **→ Next Group:** [Group-B_Font-Loading-Optimization](../Group-B_Font-Loading-Optimization/)

---

## Group Overview

This group optimizes images for performance. Creates image configuration in next.config.js with allowed domains, WebP/AVIF formats, and device sizes. Creates reusable OptimizedImage component with lazy loading, priority for above-fold images, blur placeholder, loading skeleton, and error fallback. Creates size configurations for product images, thumbnails, and hero banners. Creates background image handling. Creates upload compression and CDN configuration. Creates srcSet generation for responsive images. Verifies image optimization works correctly.

### Key Outcomes

- Image config (next.config.js)
- Image domains whitelist
- WebP/AVIF format support
- Device size breakpoints
- OptimizedImage component
- Lazy loading default
- Priority loading (above-fold)
- Blur placeholder
- Image skeleton
- Error fallback
- Product image sizes
- Thumbnail sizes
- Hero image config
- Background images handling
- Upload compression
- CDN image config
- srcSet generation
- Image optimization verified

### Technology Context

- **Component:** Next.js Image
- **Formats:** WebP, AVIF
- **Loading:** Lazy by default
- **Placeholder:** Blur data URL

---

## Documents in This Group

| # | Document | Description | Tasks Covered |
|---|----------|-------------|---------------|
| 01 | `01_Tasks-01-10_Config-Component.md` | Create config and component | 01-10 |
| 02 | `02_Tasks-11-18_Sizes-CDN-Verify.md` | Create sizes, CDN, and verification | 11-18 |

---

## Task Summary

| Task # | Task Name | Complexity | Dependencies |
|--------|-----------|------------|--------------|
| 01 | Create Image Config | Medium | SubPhase-12 |
| 02 | Create Image Domains | Low | Task 01 |
| 03 | Create Image Formats | Low | Task 01 |
| 04 | Create Device Sizes | Low | Task 01 |
| 05 | Create OptimizedImage Component | Medium | Task 01 |
| 06 | Create Image Lazy Loading | Low | Task 05 |
| 07 | Create Image Priority | Low | Task 05 |
| 08 | Create Image Blur Placeholder | Medium | Task 05 |
| 09 | Create Image Skeleton | Low | Task 05 |
| 10 | Create Image Error Fallback | Low | Task 05 |
| 11 | Create Product Image Sizes | Low | Task 05 |
| 12 | Create Thumbnail Sizes | Low | Task 05 |
| 13 | Create Hero Image Config | Medium | Task 05 |
| 14 | Create Background Images | Medium | Task 05 |
| 15 | Create Image Upload Compression | High | Task 01 |
| 16 | Create Image CDN Config | Medium | Task 01 |
| 17 | Create srcSet Generation | Medium | Task 05 |
| 18 | Verify Image Optimization | Low | Task 17 |

---

## Execution Order

```
Task 01: Image Config
    │
    ├────────┬────────┐
    ▼        ▼        ▼
T-02     T-03     T-04
(Domains)(Formats)(Sizes)
    │        │        │
    └────────┴────────┘
         │
         ├─────────────────────────────────────────────────────┐
         ▼                                                     ▼
    Task 05: OptimizedImage                               T-15  T-16
         │                                              (Upload)(CDN)
    ┌────┼────┬────────┬────────┐                            │    │
    ▼    ▼    ▼        ▼        ▼                            │    │
T-06  T-07  T-08    T-09    T-10                            │    │
(Lazy)(Prio)(Blur)(Skel)  (Error)                           │    │
    │    │    │        │        │                            │    │
    └────┴────┴────────┴────────┘                            │    │
                   │                                         │    │
    ┌──────────────┼──────────────┬────────┬────────┐        │    │
    ▼              ▼              ▼        ▼        ▼        │    │
T-11           T-12           T-13     T-14     T-17        │    │
(Product)    (Thumb)        (Hero)   (BG)    (srcSet)       │    │
    │              │              │        │        │        │    │
    └──────────────┴──────────────┴────────┴────────┴────────┴────┘
                                   │
                                   ▼
                             Task 18: Verify
```

---

## Expected Deliverables

```
frontend/
├── next.config.js (image section)
├── components/
│   └── common/
│       └── OptimizedImage/
│           ├── OptimizedImage.tsx
│           ├── ImageSkeleton.tsx
│           ├── ImageFallback.tsx
│           └── index.ts
├── config/
│   └── images.config.ts
└── lib/
    └── images/
        ├── compression.ts
        └── srcset.ts
```

---

## Notes for AI Agents

### Image Config (Task 01)
| Setting | Value |
|---------|-------|
| File | next.config.js |
| Section | images |
| Domains | Allowed external |

### Image Domains (Task 02)
| Domain | Purpose |
|--------|---------|
| cdn.example.com | CDN images |
| api.example.com | API uploads |
| images.unsplash.com | Stock images |

### Image Formats (Task 03)
| Format | Priority |
|--------|----------|
| AVIF | First |
| WebP | Second |
| Original | Fallback |

### Device Sizes (Task 04)
| Breakpoint | Width |
|------------|-------|
| Mobile | 640 |
| Tablet | 768 |
| Desktop | 1024 |
| Large | 1280 |
| XL | 1536 |

### OptimizedImage Component (Task 05)
| Prop | Type |
|------|------|
| src | string |
| alt | string |
| width | number |
| height | number |
| priority | boolean |
| sizes | string |

### Image Lazy Loading (Task 06)
| Default | Value |
|---------|-------|
| loading | lazy |
| Exception | priority=true |

### Image Priority (Task 07)
| Use | When |
|-----|------|
| priority | Above the fold |
| Examples | Hero, first product |

### Image Blur Placeholder (Task 08)
| Type | Value |
|------|-------|
| placeholder | blur |
| blurDataURL | Base64 string |
| Generate | At build or upload |

### Product Image Sizes (Task 11)
| Context | Size |
|---------|------|
| Grid card | 300x300 |
| Detail main | 600x600 |
| Detail gallery | 100x100 |
| Cart | 80x80 |

### Thumbnail Sizes (Task 12)
| Context | Size |
|---------|------|
| Small | 50x50 |
| Medium | 100x100 |
| Large | 150x150 |

### Hero Image Config (Task 13)
| Setting | Value |
|---------|-------|
| Width | Full width |
| Height | 400-600px |
| Priority | true |
| Size | 1920px max |

### Image CDN Config (Task 16)
| Setting | Value |
|---------|-------|
| Loader | CDN custom |
| URL | CDN base URL |
| Quality | 80 default |
