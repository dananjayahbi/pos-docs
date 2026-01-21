# Group B: Font & Loading Optimization

> **Phase:** 08 - Webstore & E-Commerce Platform  
> **SubPhase:** 13 - Performance Optimization  
> **Group:** B of F  
> **Tasks Covered:** 19-36  
> **Group Goal:** Optimize fonts and loading states with display swap, subsets, and skeletons

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group-A_Image-Optimization](../Group-A_Image-Optimization/)
- **→ Next Group:** [Group-C_Code-Splitting-Bundles](../Group-C_Code-Splitting-Bundles/)

---

## Group Overview

This group optimizes fonts and loading states. Creates font configuration using next/font with primary body font and heading font. Creates font display swap to prevent FOIT. Creates font subset for Latin only and font preloading. Creates CSS font variables. Creates icon font optimization with tree shaking. Creates critical CSS inlining and CSS loading strategy. Creates global loading spinner and smooth page transitions. Creates skeleton components for products, grids, and content. Creates React Suspense boundaries. Verifies font loading performance.

### Key Outcomes

- Font configuration (next/font)
- Primary body font
- Heading font
- Font display swap
- Font subset (Latin)
- Font preload
- CSS font variable
- Icon font optimization
- Critical CSS inline
- CSS loading strategy
- Loading spinner
- Page transitions
- Skeleton components
- ProductSkeleton
- GridSkeleton
- ContentSkeleton
- Suspense boundaries
- Font loading verified

### Technology Context

- **Fonts:** next/font (Google or local)
- **Display:** swap (no FOIT)
- **Icons:** Lucide tree-shaking
- **Loading:** React Suspense

---

## Documents in This Group

| # | Document | Description | Tasks Covered |
|---|----------|-------------|---------------|
| 01 | `01_Tasks-19-28_Fonts-CSS.md` | Create font config and CSS | 19-28 |
| 02 | `02_Tasks-29-36_Loading-Skeletons-Verify.md` | Create loading states and verification | 29-36 |

---

## Task Summary

| Task # | Task Name | Complexity | Dependencies |
|--------|-----------|------------|--------------|
| 19 | Create Font Configuration | Medium | Task 18 |
| 20 | Create Primary Font | Low | Task 19 |
| 21 | Create Heading Font | Low | Task 19 |
| 22 | Create Font Display Swap | Low | Task 19 |
| 23 | Create Font Subset | Low | Task 19 |
| 24 | Create Font Preload | Medium | Task 19 |
| 25 | Create Font Variable | Low | Task 20 |
| 26 | Create Icon Font Optimization | Medium | Task 19 |
| 27 | Create Critical CSS | High | Task 18 |
| 28 | Create CSS Loading Strategy | Medium | Task 27 |
| 29 | Create Loading Spinner | Low | Task 18 |
| 30 | Create Page Transition | Medium | Task 29 |
| 31 | Create Skeleton Components | Medium | Task 18 |
| 32 | Create ProductSkeleton | Low | Task 31 |
| 33 | Create GridSkeleton | Low | Task 31 |
| 34 | Create ContentSkeleton | Low | Task 31 |
| 35 | Create Suspense Boundaries | Medium | Task 31 |
| 36 | Verify Font Loading | Low | Task 35 |

---

## Execution Order

```
Task 19: Font Configuration
    │
    ├────────┬────────┬────────┬────────┐
    ▼        ▼        ▼        ▼        ▼
T-20     T-21     T-22     T-23     T-24  T-26
(Primary)(Heading)(Swap) (Subset)(Preload)(Icons)
    │        │        │        │        │    │
    ▼        │        │        │        │    │
T-25        │        │        │        │    │
(Variable)  │        │        │        │    │
    │        │        │        │        │    │
    └────────┴────────┴────────┴────────┴────┘
                   │
              ┌────┴────┐
              ▼         ▼
         T-27       T-29
       (Critical) (Spinner)
              │         │
              ▼         ▼
         T-28       T-30
        (CSS)    (Transition)
              │         │
              └────┬────┘
                   │
                   ▼
             Task 31: Skeleton Components
                   │
              ┌────┼────┬────────┐
              ▼    ▼    ▼        ▼
           T-32  T-33  T-34   T-35
         (Prod)(Grid)(Content)(Suspense)
              │    │    │        │
              └────┴────┴────────┘
                        │
                        ▼
                  Task 36: Verify
```

---

## Expected Deliverables

```
frontend/
├── styles/
│   └── fonts/
│       ├── fonts.ts
│       └── fontVariables.css
├── components/
│   └── common/
│       ├── Loading/
│       │   ├── LoadingSpinner.tsx
│       │   ├── PageTransition.tsx
│       │   └── index.ts
│       └── Skeleton/
│           ├── ProductSkeleton.tsx
│           ├── GridSkeleton.tsx
│           ├── ContentSkeleton.tsx
│           ├── BaseSkeleton.tsx
│           └── index.ts
└── app/
    └── layout.tsx (font variables)
```

---

## Notes for AI Agents

### Font Configuration (Task 19)
| Method | Package |
|--------|---------|
| Google | next/font/google |
| Local | next/font/local |
| Config | In layout.tsx |

### Primary Font (Task 20)
| Setting | Value |
|---------|-------|
| Font | Inter or Open Sans |
| Weights | 400, 500, 600, 700 |
| Variable | --font-body |

### Heading Font (Task 21)
| Setting | Value |
|---------|-------|
| Font | Same or different |
| Weights | 600, 700 |
| Variable | --font-heading |

### Font Display Swap (Task 22)
| Property | Value |
|----------|-------|
| display | swap |
| Effect | Show fallback first |
| Prevent | FOIT (Flash of Invisible Text) |

### Font Subset (Task 23)
| Subset | Value |
|--------|-------|
| subsets | ['latin'] |
| Reduce | File size |

### Font Preload (Task 24)
| Method | Value |
|--------|-------|
| Link | rel="preload" |
| As | font |
| Crossorigin | anonymous |

### Icon Font Optimization (Task 26)
| Library | Method |
|---------|--------|
| Lucide | Import specific icons |
| Bad | import * from lucide-react |
| Good | import { Home } from lucide-react |

### Critical CSS (Task 27)
| Method | Description |
|--------|-------------|
| Inline | In <head> |
| Content | Above-fold styles |
| Defer | Rest of CSS |

### Loading Spinner (Task 29)
| Style | Value |
|-------|-------|
| Type | Spinner or dots |
| Position | Center screen |
| Overlay | Optional |

### Page Transition (Task 30)
| Method | Description |
|--------|-------------|
| Next.js | loading.tsx files |
| Animation | Fade or slide |
| Progress | Optional bar |

### Skeleton Components (Task 31)
| Base | Features |
|------|----------|
| Animation | Pulse |
| Color | Gray 200/300 |
| Shape | Match content |

### ProductSkeleton (Task 32)
| Element | Shape |
|---------|-------|
| Image | Square |
| Title | Bar 60% |
| Price | Bar 30% |

### Suspense Boundaries (Task 35)
| Location | Fallback |
|----------|----------|
| Route | loading.tsx |
| Component | <Suspense> wrapper |
| Fallback | Skeleton component |
