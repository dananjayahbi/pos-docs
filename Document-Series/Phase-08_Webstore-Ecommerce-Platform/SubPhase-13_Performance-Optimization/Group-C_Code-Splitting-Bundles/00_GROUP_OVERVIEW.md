# Group C: Code Splitting & Bundles

> **Phase:** 08 - Webstore & E-Commerce Platform  
> **SubPhase:** 13 - Performance Optimization  
> **Group:** C of F  
> **Tasks Covered:** 37-52  
> **Group Goal:** Reduce bundle size with dynamic imports, tree shaking, and chunk optimization

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group-B_Font-Loading-Optimization](../Group-B_Font-Loading-Optimization/)
- **→ Next Group:** [Group-D_Static-Generation-ISR](../Group-D_Static-Generation-ISR/)

---

## Group Overview

This group reduces bundle sizes. Creates bundle analyzer setup to analyze current bundle. Creates dynamic imports for lazy loading components like modals, galleries, charts, and rich text editors. Creates route-based code splitting. Creates vendor chunking for separate vendor bundle and common chunk for shared components. Creates tree shaking configuration and module aliases for import optimization. Creates package optimization for specific libraries like Lodash and date-fns. Creates build analysis scripts. Verifies bundle sizes meet targets.

### Key Outcomes

- Bundle analyzer setup
- Dynamic imports helper
- Lazy modal loading
- Lazy gallery loading
- Lazy charts loading
- Lazy rich text editor
- Route-based splitting
- Vendor chunking
- Common chunk
- Tree shaking
- Module aliases
- Package optimization
- Lodash tree shake
- date-fns optimization
- Build analysis
- Bundle sizes verified

### Technology Context

- **Analyzer:** @next/bundle-analyzer
- **Dynamic:** next/dynamic
- **Chunks:** Webpack splitChunks
- **Tree shake:** ES modules

---

## Documents in This Group

| # | Document | Description | Tasks Covered |
|---|----------|-------------|---------------|
| 01 | `01_Tasks-37-46_Analyze-Dynamic-Tree.md` | Create analyzer and dynamic imports | 37-46 |
| 02 | `02_Tasks-47-52_Packages-Build-Verify.md` | Create package optimization and verification | 47-52 |

---

## Task Summary

| Task # | Task Name | Complexity | Dependencies |
|--------|-----------|------------|--------------|
| 37 | Analyze Bundle Size | Medium | Task 36 |
| 38 | Create Dynamic Imports | Medium | Task 37 |
| 39 | Create Lazy Modal | Low | Task 38 |
| 40 | Create Lazy Gallery | Low | Task 38 |
| 41 | Create Lazy Charts | Low | Task 38 |
| 42 | Create Lazy Rich Text | Low | Task 38 |
| 43 | Create Route-based Splitting | Medium | Task 38 |
| 44 | Create Vendor Chunking | Medium | Task 37 |
| 45 | Create Common Chunk | Medium | Task 44 |
| 46 | Create Tree Shaking | Medium | Task 37 |
| 47 | Create Module Aliases | Low | Task 46 |
| 48 | Create Package Optimization | Medium | Task 46 |
| 49 | Create Lodash Tree Shake | Low | Task 48 |
| 50 | Create Date-fns Optimization | Low | Task 48 |
| 51 | Create Build Analysis | Medium | Task 37 |
| 52 | Verify Bundle Sizes | Low | Task 51 |

---

## Execution Order

```
Task 37: Analyze Bundle Size
    │
    ├────────────────────────────────────────────────┐
    ▼                                                ▼
Task 38: Dynamic Imports                        T-44  T-46  T-51
    │                                         (Vendor)(Tree)(Build)
    ├────────┬────────┬────────┬────────┐          │    │    │
    ▼        ▼        ▼        ▼        ▼          │    │    │
T-39     T-40     T-41     T-42     T-43          ▼    │    │
(Modal)(Gallery)(Charts)(Rich)   (Route)       T-45   │    │
    │        │        │        │        │      (Common) │    │
    │        │        │        │        │          │    │    │
    └────────┴────────┴────────┴────────┘          │    │    │
                   │                               │    │    │
                   └───────────────────────────────┴────┘    │
                                   │                         │
                                   ▼                         │
                             Task 47: Module Aliases         │
                                   │                         │
                                   ▼                         │
                             Task 48: Package Optimization   │
                                   │                         │
                              ┌────┴────┐                    │
                              ▼         ▼                    │
                           T-49      T-50                   │
                         (Lodash) (date-fns)                │
                              │         │                    │
                              └────┬────┘                    │
                                   │                         │
                                   └─────────────────────────┘
                                              │
                                              ▼
                                        Task 52: Verify
```

---

## Expected Deliverables

```
frontend/
├── next.config.js (bundle analyzer, chunks)
├── lib/
│   └── performance/
│       ├── bundleAnalyzer.ts
│       ├── dynamicImports.ts
│       └── lazyComponents.ts
├── scripts/
│   └── analyze-bundle.js
└── package.json (dev scripts)
```

---

## Notes for AI Agents

### Analyze Bundle Size (Task 37)
| Tool | Package |
|------|---------|
| Analyzer | @next/bundle-analyzer |
| Script | ANALYZE=true next build |
| Output | Visual bundle report |

### Dynamic Imports (Task 38)
| Function | Usage |
|----------|-------|
| dynamic | next/dynamic |
| Loading | Custom fallback |
| SSR | ssr: false for client-only |

### Lazy Modal (Task 39)
| Component | Load |
|-----------|------|
| Modal | On open trigger |
| SSR | false |
| Fallback | Loading spinner |

### Lazy Gallery (Task 40)
| Component | Load |
|-----------|------|
| ImageGallery | On view |
| SSR | true (SEO) |
| Fallback | Skeleton |

### Lazy Charts (Task 41)
| Component | Load |
|-----------|------|
| Charts | Dashboard only |
| SSR | false |
| Heavy | Recharts, etc. |

### Route-based Splitting (Task 43)
| Feature | Value |
|---------|-------|
| Default | Next.js automatic |
| Result | Per-page bundles |
| Check | Network waterfall |

### Vendor Chunking (Task 44)
| Config | Value |
|--------|-------|
| Location | next.config.js |
| Split | node_modules |
| Cache | Long-term |

### Common Chunk (Task 45)
| Content | Value |
|---------|-------|
| Shared | Common components |
| Threshold | 2+ pages |
| Name | common chunk |

### Tree Shaking (Task 46)
| Requirement | Value |
|-------------|-------|
| Modules | ES modules (import/export) |
| Side effects | sideEffects in package.json |
| Mode | production |

### Lodash Tree Shake (Task 49)
| Bad | Good |
|-----|------|
| import _ from 'lodash' | import debounce from 'lodash/debounce' |
| Full library | Single function |

### date-fns Optimization (Task 50)
| Method | Import |
|--------|--------|
| Specific | import { format } from 'date-fns' |
| Locale | Only needed locales |

### Build Analysis (Task 51)
| Check | Target |
|-------|--------|
| Main bundle | < 100KB gzipped |
| First load | < 200KB |
| Per route | < 50KB added |
