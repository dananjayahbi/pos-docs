# Group B: Service Worker

> **Phase:** 10 - AI Features & Advanced Capabilities  
> **SubPhase:** 08 - POS Offline Enhancement  
> **Group:** B of F  
> **Tasks Covered:** 17-32  
> **Group Goal:** Implement Service Worker for caching and offline

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group-A_IndexedDB-Setup](../Group-A_IndexedDB-Setup/)
- **→ Next Group:** [Group-C_Offline-Manager](../Group-C_Offline-Manager/)

---

## Group Overview

This group implements Service Worker. Installs Workbox toolkit. Creates SW Registration. Creates Install Handler for cache on install and Activate Handler for cleaning old caches. Creates Fetch Handler to intercept requests. Creates Cache Strategies using StaleWhileRevalidate. Creates API Cache for responses and Static Cache for assets. Creates Image Cache for product images. Creates Offline Fallback pages. Creates Cache Versioning, Cache Expiry TTL, and Cache Size Limit. Creates Background Sync and Push Handler. Verifies Service Worker.

### Key Outcomes

- Install Workbox
- SW Registration
- Install Handler
- Activate Handler
- Fetch Handler
- Cache Strategies
- API Cache
- Static Cache
- Image Cache
- Offline Fallback
- Cache Versioning
- Cache Expiry
- Cache Size Limit
- Background Sync
- Push Handler
- Service Worker verified

### Technology Context

- **Library:** Workbox
- **Strategy:** StaleWhileRevalidate
- **Sync:** Background Sync API
- **Push:** Push API

---

## Documents in This Group

| # | Document | Description | Tasks Covered |
|---|----------|-------------|---------------|
| 01 | `01_Tasks-17-26_Workbox-Caching.md` | Create Workbox and caching | 17-26 |
| 02 | `02_Tasks-27-32_Versioning-Sync.md` | Create versioning, sync | 27-32 |

---

## Task Summary

| Task # | Task Name | Complexity | Dependencies |
|--------|-----------|------------|--------------|
| 17 | Install Workbox | Low | Task 16 |
| 18 | Create SW Registration | Low | Task 17 |
| 19 | Create Install Handler | Medium | Task 18 |
| 20 | Create Activate Handler | Low | Task 19 |
| 21 | Create Fetch Handler | Medium | Task 20 |
| 22 | Create Cache Strategies | Medium | Task 21 |
| 23 | Create API Cache | Medium | Task 22 |
| 24 | Create Static Cache | Low | Task 22 |
| 25 | Create Image Cache | Low | Task 24 |
| 26 | Create Offline Fallback | Low | Task 25 |
| 27 | Create Cache Versioning | Low | Task 26 |
| 28 | Create Cache Expiry | Low | Task 27 |
| 29 | Create Cache Size Limit | Low | Task 28 |
| 30 | Create Background Sync | Medium | Task 29 |
| 31 | Create Push Handler | Medium | Task 30 |
| 32 | Verify Service Worker | Low | Task 31 |

---

## Execution Order

```
Task 17: Install Workbox
    │
    ▼
Task 18: SW Registration
    │
    ▼
Task 19: Install Handler
    │
    ▼
Task 20: Activate Handler
    │
    ▼
Task 21: Fetch Handler
    │
    ▼
Task 22: Cache Strategies
    │
    ├────────┬────────┐
    ▼        ▼        ▼
T-23     T-24     T-25
(API)  (Static)(Image)
    │        │        │
    └────────┴────────┘
              │
              ▼
       Task 26: Offline Fallback
              │
              ▼
       Task 27: Cache Versioning
              │
              ▼
       Task 28: Cache Expiry
              │
              ▼
       Task 29: Cache Size Limit
              │
              ▼
       Task 30: Background Sync
              │
              ▼
       Task 31: Push Handler
              │
              ▼
       Task 32: Verify
```

---

## Expected Deliverables

```
frontend/
└── public/
    └── sw.js

└── lib/
    └── offline/
        └── service-worker.ts
```

---

## Notes for AI Agents

### Install Workbox (Task 17)
| Package | workbox-webpack-plugin |
|---------|------------------------|
| Also | workbox-window |

### SW Registration (Task 18)
| File | Register in app |
|------|-----------------|
| Check | 'serviceWorker' in navigator |

### Registration Options
| Option | Value |
|--------|-------|
| scope | '/' |
| updateViaCache | 'none' |

### Install Handler (Task 19)
| Event | install |
|-------|---------|
| Action | Precache assets |

### Precache Assets
| Asset | Priority |
|-------|----------|
| index.html | High |
| app.js | High |
| styles.css | High |
| offline.html | High |

### Activate Handler (Task 20)
| Event | activate |
|-------|----------|
| Action | Clean old caches |

### Fetch Handler (Task 21)
| Event | fetch |
|-------|-------|
| Action | Route to strategy |

### Cache Strategies (Task 22)
| Strategy | Use Case |
|----------|----------|
| CacheFirst | Static assets |
| NetworkFirst | API calls |
| StaleWhileRevalidate | Images |

### API Cache (Task 23)
| Route | /api/* |
|-------|--------|
| Strategy | NetworkFirst |
| Fallback | Cached response |

### API Cache Options
| Option | Value |
|--------|-------|
| cacheName | api-cache-v1 |
| networkTimeout | 3000ms |
| maxEntries | 100 |

### Static Cache (Task 24)
| Route | *.js, *.css, *.html |
|-------|---------------------|
| Strategy | CacheFirst |

### Image Cache (Task 25)
| Route | /images/*, /products/* |
|-------|------------------------|
| Strategy | StaleWhileRevalidate |

### Image Cache Options
| Option | Value |
|--------|-------|
| cacheName | image-cache-v1 |
| maxEntries | 500 |
| maxAgeSeconds | 7 days |

### Offline Fallback (Task 26)
| Page | offline.html |
|------|--------------|
| Show | When network fails |

### Cache Versioning (Task 27)
| Pattern | cache-name-v{n} |
|---------|-----------------|
| Increment | On deploy |

### Cache Expiry (Task 28)
| Cache | TTL |
|-------|-----|
| API | 1 hour |
| Static | 30 days |
| Images | 7 days |

### Cache Size Limit (Task 29)
| Cache | Max Size |
|-------|----------|
| API | 50 entries |
| Images | 500 entries |
| Total | 100 MB |

### Background Sync (Task 30)
| Plugin | workbox-background-sync |
|--------|-------------------------|
| Queue | sync-queue |

### Background Sync Options
| Option | Value |
|--------|-------|
| maxRetentionTime | 24 hours |
| onSync | Process queue |

### Push Handler (Task 31)
| Event | push |
|-------|------|
| Action | Show notification |

### Push Notification
| Field | Source |
|-------|--------|
| title | event.data.title |
| body | event.data.body |
| icon | /icons/icon-192.png |
