# Group B: Local Data Caching

> **Phase:** 05 - ERP Core Modules Part 2  
> **SubPhase:** 02 - POS Offline Mode  
> **Group:** B of F  
> **Tasks Covered:** 17-34  
> **Group Goal:** Implement frontend local storage using IndexedDB

---

## Navigation

- **↑ Parent:** [SubPhase-02 Summary](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group A: Offline Data Architecture](../Group-A_Offline-Data-Architecture/)
- **→ Next Group:** [Group C: Transaction Queue Management](../Group-C_Transaction-Queue-Management/)

---

## Group Overview

### Key Outcomes

1. **IndexedDB Service** - Wrapper service for IndexedDB operations
2. **Database Schema** - Object stores for products, customers, settings
3. **Products Object Store** - Store products with variants, prices, stock
4. **Product Indexes** - Fast search on barcode, SKU, name
5. **Categories Object Store** - Category hierarchy for navigation
6. **Customers Object Store** - Customer data for offline lookup
7. **Settings Object Store** - Terminal settings, tax rates, payment methods
8. **Transactions Object Store** - Pending offline transactions
9. **Data Versioning** - Track cache version for invalidation
10. **Cache Population Service** - Download and cache data from server
11. **Incremental Sync** - Only download changed records
12. **Cache Size Management** - Monitor and limit cache size
13. **Service Worker Setup** - Asset caching with Workbox
14. **Cache Strategies** - Network-first for API, cache-first for assets
15. **Background Sync** - Background Sync API registration
16. **Cache Warmup** - Pre-populate cache on login

### Technology Context

| Technology | Purpose |
|------------|---------|
| IndexedDB | Client-side structured data storage |
| Workbox | Service Worker and cache management |
| TypeScript | Type-safe IndexedDB wrapper |
| Background Sync API | Queue sync requests when offline |

---

## Documents in This Group

| # | Document | Tasks | Description |
|---|----------|-------|-------------|
| 01 | `01_Tasks-17-24_IndexedDB-Object-Stores.md` | 17-24 | IndexedDB service, database schema, all object stores |
| 02 | `02_Tasks-25-30_Versioning-Cache-Service.md` | 25-30 | Data versioning, cache population, incremental sync, size management |
| 03 | `03_Tasks-31-34_Service-Worker-Cache.md` | 31-34 | Service Worker setup, cache strategies, background sync, warmup |

---

## Task Summary

| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 17 | Create IndexedDB service | High | 30 min |
| 18 | Define database schema | Medium | 25 min |
| 19 | Create products object store | Medium | 25 min |
| 20 | Add product indexes | Medium | 20 min |
| 21 | Create categories object store | Medium | 20 min |
| 22 | Create customers object store | Medium | 25 min |
| 23 | Create settings object store | Medium | 20 min |
| 24 | Create transactions object store | Medium | 25 min |
| 25 | Implement data versioning | Medium | 20 min |
| 26 | Create cache population service | High | 30 min |
| 27 | Implement incremental sync | High | 35 min |
| 28 | Add last_modified tracking | Medium | 20 min |
| 29 | Create cache size management | Medium | 25 min |
| 30 | Implement cache invalidation | Medium | 20 min |
| 31 | Create Service Worker setup | High | 30 min |
| 32 | Define cache strategies | Medium | 25 min |
| 33 | Implement background sync registration | Medium | 25 min |
| 34 | Create cache warmup on login | Medium | 25 min |

---

## Execution Order

```
[Tasks 17-18: IndexedDB service and schema]
         │
         ▼
[Tasks 19-24: All object stores with indexes]
         │
         ▼
[Tasks 25-28: Versioning and incremental sync]
         │
         ▼
[Tasks 29-30: Cache size and invalidation]
         │
         ▼
[Tasks 31-34: Service Worker and cache warmup]
```

---

## Expected Deliverables

```
frontend/
├── lib/
│   └── offline/
│       ├── indexeddb.ts          # Tasks 17-25
│       ├── cache-service.ts      # Tasks 26-30
│       └── service-worker.ts     # Tasks 31-33
├── public/
│   └── sw.js                     # Service Worker entry
└── hooks/
    └── useCacheWarmup.ts         # Task 34
```

---

## Notes for AI Agents

### IndexedDB Database Schema
```
Database: lcc_pos_cache
Version: 1

Object Stores:
├── products (keyPath: 'id')
│   └── indexes: barcode, sku, name, category_id, updated_at
├── variants (keyPath: 'id')
│   └── indexes: product_id, barcode, sku
├── categories (keyPath: 'id')
│   └── indexes: parent_id, slug
├── customers (keyPath: 'id')
│   └── indexes: phone, email, name
├── transactions (keyPath: 'offline_id')
│   └── indexes: status, created_at, terminal_id
└── sync_meta (keyPath: 'entity_type')
    └── stores: last_sync, version, count
```

### Cache Population Flow
1. Check last sync timestamp per entity
2. Request changes since last sync
3. Upsert records to IndexedDB
4. Update sync_meta with new timestamp
5. Prune deleted records if signaled

### Incremental Sync Headers
- `If-Modified-Since`: Last sync timestamp
- `X-Sync-Token`: Sync continuation token
- Response includes `X-Has-More` for pagination

### Service Worker Cache Strategies
- **Static Assets**: Cache First
- **API Requests**: Network First with 3s timeout
- **POS Products**: Stale While Revalidate
- **Images**: Cache First with expiry

### Cache Size Limits
- Products: 10,000 records max
- Customers: 5,000 records max
- Transactions: 100 pending max
- Total: ~50MB recommended limit

### Cache Warmup Priority
1. Tax rates and settings
2. Active products and variants
3. Categories
4. Recent customers
5. Quick buttons
