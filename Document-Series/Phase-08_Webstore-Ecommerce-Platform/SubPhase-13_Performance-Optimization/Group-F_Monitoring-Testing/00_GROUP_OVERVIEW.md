# Group F: Monitoring & Testing

> **Phase:** 08 - Webstore & E-Commerce Platform  
> **SubPhase:** 13 - Performance Optimization  
> **Group:** F of F  
> **Tasks Covered:** 83-94  
> **Group Goal:** Set up performance monitoring and run comprehensive Lighthouse tests

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group-E_Caching-CDN](../Group-E_Caching-CDN/)
- **→ Next Group:** None (Last Group) | **Next SubPhase:** [SubPhase-14_Marketing-Features](../SubPhase-14_Marketing-Features/)

---

## Group Overview

This group sets up performance monitoring and testing. Creates performance budget with bundle size limits. Creates Lighthouse CI for automated testing. Creates Web Vitals tracking with LCP, FID/INP, and CLS monitoring. Creates analytics integration to report metrics. Performs comprehensive testing: homepage performance, product page, category page, and mobile performance. Creates final performance report documenting all optimizations.

### Key Outcomes

- Performance budget
- Lighthouse CI setup
- Web Vitals tracking
- LCP monitoring
- FID/INP monitoring
- CLS monitoring
- Analytics integration
- Homepage performance test
- Product page test
- Category page test
- Mobile performance test
- Performance report

### Technology Context

- **Metrics:** Core Web Vitals
- **Testing:** Lighthouse CI
- **Tracking:** web-vitals library
- **Analytics:** Custom or GA

---

## Documents in This Group

| # | Document | Description | Tasks Covered |
|---|----------|-------------|---------------|
| 01 | `01_Tasks-83-89_Budget-Vitals-Analytics.md` | Create budget and monitoring | 83-89 |
| 02 | `02_Tasks-90-94_Testing-Report.md` | Perform testing and report | 90-94 |

---

## Task Summary

| Task # | Task Name | Complexity | Dependencies |
|--------|-----------|------------|--------------|
| 83 | Create Performance Budget | Medium | Task 82 |
| 84 | Create Lighthouse CI | Medium | Task 83 |
| 85 | Create Web Vitals Tracking | Medium | Task 83 |
| 86 | Create LCP Monitoring | Low | Task 85 |
| 87 | Create FID Monitoring | Low | Task 85 |
| 88 | Create CLS Monitoring | Low | Task 85 |
| 89 | Create Analytics Integration | Medium | Task 85 |
| 90 | Test Homepage Performance | Low | Task 84 |
| 91 | Test Product Page | Low | Task 84 |
| 92 | Test Category Page | Low | Task 84 |
| 93 | Test Mobile Performance | Low | Task 84 |
| 94 | Create Performance Report | Medium | Task 93 |

---

## Execution Order

```
Task 83: Performance Budget
    │
    ├────────┐
    ▼        ▼
T-84     T-85
(LHCI)  (Vitals)
    │        │
    │   ┌────┼────┬────────┐
    │   ▼    ▼    ▼        ▼
    │ T-86  T-87  T-88   T-89
    │ (LCP) (FID) (CLS) (Analytics)
    │   │    │    │        │
    │   └────┴────┴────────┘
    │              │
    ├──────────────┘
    │
    ├────────┬────────┬────────┐
    ▼        ▼        ▼        ▼
T-90     T-91     T-92     T-93
(Home)  (Product)(Cat)   (Mobile)
    │        │        │        │
    └────────┴────────┴────────┘
                   │
                   ▼
             Task 94: Report
```

---

## Expected Deliverables

```
frontend/
├── lib/
│   └── performance/
│       └── webVitals.ts
├── config/
│   └── performance.config.ts
├── scripts/
│   └── lighthouse-ci.js
├── .lighthouserc.js
└── docs/
    └── PERFORMANCE_REPORT.md
```

---

## Notes for AI Agents

### Performance Budget (Task 83)
| Metric | Budget |
|--------|--------|
| Main bundle | < 100KB gzip |
| First load | < 200KB |
| LCP | < 2.5s |
| FID | < 100ms |
| CLS | < 0.1 |

### Lighthouse CI (Task 84)
| Config | Value |
|--------|-------|
| File | .lighthouserc.js |
| CI | GitHub Actions |
| Assert | Score thresholds |

### Web Vitals Tracking (Task 85)
| Library | web-vitals |
|---------|------------|
| Import | getCLS, getFID, getLCP |
| Report | To analytics |
| When | Page load |

### LCP Monitoring (Task 86)
| Metric | Target |
|--------|--------|
| LCP | < 2.5s |
| Good | < 2.5s (green) |
| Needs work | 2.5-4s (orange) |
| Poor | > 4s (red) |

### FID Monitoring (Task 87)
| Metric | Target |
|--------|--------|
| FID/INP | < 100ms |
| Good | < 100ms |
| Needs work | 100-300ms |
| Poor | > 300ms |

### CLS Monitoring (Task 88)
| Metric | Target |
|--------|--------|
| CLS | < 0.1 |
| Good | < 0.1 |
| Needs work | 0.1-0.25 |
| Poor | > 0.25 |

### Analytics Integration (Task 89)
| Service | Method |
|---------|--------|
| Google Analytics | sendToGoogleAnalytics |
| Custom | POST to endpoint |
| Data | Metric name, value, id |

### Test Homepage Performance (Task 90)
| Check | Target |
|-------|--------|
| Performance | > 90 |
| LCP | < 2.5s |
| TTI | < 3.5s |
| CLS | < 0.1 |

### Test Product Page (Task 91)
| Check | Target |
|-------|--------|
| Performance | > 90 |
| Images | Optimized |
| LCP | Main product image |

### Test Category Page (Task 92)
| Check | Target |
|-------|--------|
| Performance | > 85 |
| Grid | Lazy loaded |
| Pagination | No CLS |

### Test Mobile Performance (Task 93)
| Check | Target |
|-------|--------|
| Device | Mobile simulation |
| Network | 4G throttled |
| Score | > 85 |

### Performance Report (Task 94)
| Section | Content |
|---------|---------|
| Before | Initial metrics |
| After | Optimized metrics |
| Changes | List of optimizations |
| Scores | All Lighthouse scores |
