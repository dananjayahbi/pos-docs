# SubPhase-02: POS Offline Mode - Tasks Summary

> **Phase:** 05 - ERP Core Modules Part 2  
> **SubPhase:** 02 of 12  
> **SubPhase Goal:** Enable POS operation without internet connectivity with automatic sync  
> **Total Tasks:** 90 | **Status:** Planning

---

## Navigation

- **↑ Parent:** [Phase-05 Summary](../00_SUBPHASES_SUMMARY.md)
- **← Previous SubPhase:** [SubPhase-01: POS Terminal Core](../SubPhase-01_POS-Terminal-Core/)
- **→ Next SubPhase:** [SubPhase-03: Receipt Generation](../SubPhase-03_Receipt-Generation/)

---

## SubPhase Overview

This sub-phase implements offline capability for the POS system in LankaCommerce Cloud. The offline mode ensures business continuity during internet outages by caching essential data locally, queuing transactions for later sync, and implementing robust conflict resolution when reconnecting. This is a critical differentiator for Sri Lankan retail environments where connectivity can be unreliable.

### Key Outcomes
- IndexedDB-based local data storage on frontend
- Service Worker for offline asset caching
- Transaction queue with persistent storage
- Automatic sync engine with retry logic
- Conflict resolution strategies (server-wins, merge)
- Real-time connection status monitoring
- Sync status dashboard and logs

### Dependencies
- SubPhase-01: POS Terminal Core (Cart, Payment models)
- Phase-03: API infrastructure, WebSocket support

---

## Execution Flow Diagram

```
[Group A: Offline Data Architecture]
         │
         ▼
[Group B: Local Data Caching]
         │
         ▼
[Group C: Transaction Queue Management]
         │
         ▼
[Group D: Sync Engine & Conflict Resolution]
         │
         ▼
[Group E: Frontend Offline Components]
         │
         ▼
[Group F: Testing & Documentation]
```

---

## Task Index

### Group A: Offline Data Architecture (Tasks 01-16)

Define offline storage schema and architecture.

| Task # | Task Name | Description | Est. Time |
|--------|-----------|-------------|-----------|
| 01 | Create offline submodule | Create `apps/pos/offline/` package with __init__.py | 10 min |
| 02 | Define offline mode constants | Create constants: ONLINE, OFFLINE, SYNCING, SYNC_ERROR | 10 min |
| 03 | Define sync status constants | Create constants: PENDING, IN_PROGRESS, COMPLETED, FAILED, CONFLICT | 10 min |
| 04 | Design offline data schema | Document which entities are cached offline and their relationships | 35 min |
| 05 | Define cacheable entities list | Products, variants, prices, categories, customers, settings | 20 min |
| 06 | Define offline transaction schema | Structure for offline cart, items, payments | 25 min |
| 07 | Create OfflineSyncConfig model | Tenant-level sync configuration settings | 30 min |
| 08 | Add sync frequency settings | Add auto_sync_interval, max_offline_transactions, cache_ttl | 20 min |
| 09 | Add conflict resolution settings | Add default_resolution_strategy per entity type | 20 min |
| 10 | Create SyncLog model | Track all sync operations with timestamps and results | 30 min |
| 11 | Add sync log fields | Add sync_type, entities_synced, errors, duration | 20 min |
| 12 | Create OfflineTransaction model | Server-side record of queued offline transactions | 30 min |
| 13 | Add transaction metadata | Add terminal_id, offline_timestamp, sync_status | 20 min |
| 14 | Add transaction payload field | JSONField for complete transaction data | 15 min |
| 15 | Create sync priority logic | Define priority order for syncing different entity types | 25 min |
| 16 | Document data freshness requirements | Define acceptable staleness for each entity type | 20 min |

---

### Group B: Local Data Caching (Tasks 17-34)

Frontend local storage using IndexedDB.

| Task # | Task Name | Description | Est. Time |
|--------|-----------|-------------|-----------|
| 17 | Create IndexedDB service | Initialize IndexedDB wrapper service in frontend | 30 min |
| 18 | Define database schema | Define object stores for products, customers, settings | 25 min |
| 19 | Create products object store | Store products with variants, prices, stock | 25 min |
| 20 | Add product indexes | Create indexes on barcode, sku, name for fast search | 20 min |
| 21 | Create categories object store | Store category hierarchy for navigation | 20 min |
| 22 | Create customers object store | Store customer data for offline lookup | 25 min |
| 23 | Create settings object store | Store terminal settings, tax rates, payment methods | 20 min |
| 24 | Create transactions object store | Store pending offline transactions | 25 min |
| 25 | Implement data versioning | Track cache version for invalidation | 20 min |
| 26 | Create cache population service | Service to download and cache data from server | 30 min |
| 27 | Implement incremental sync | Only download changed records since last sync | 35 min |
| 28 | Add last_modified tracking | Track sync timestamps per entity type | 20 min |
| 29 | Create cache size management | Monitor and limit cache size, prune old data | 25 min |
| 30 | Implement cache invalidation | Clear specific caches on demand | 20 min |
| 31 | Create Service Worker setup | Configure Service Worker for asset caching | 30 min |
| 32 | Define cache strategies | Network-first for API, cache-first for assets | 25 min |
| 33 | Implement background sync registration | Register for Background Sync API | 25 min |
| 34 | Create cache warmup on login | Pre-populate cache when user logs in | 25 min |

---

### Group C: Transaction Queue Management (Tasks 35-52)

Queue offline transactions for later sync.

| Task # | Task Name | Description | Est. Time |
|--------|-----------|-------------|-----------|
| 35 | Create TransactionQueue class | Frontend class for managing offline transactions | 30 min |
| 36 | Implement queue_transaction method | Add transaction to IndexedDB queue | 25 min |
| 37 | Generate offline transaction ID | Create unique ID: OFFLINE-{terminal}-{timestamp}-{seq} | 20 min |
| 38 | Add queue position tracking | Track order of transactions in queue | 15 min |
| 39 | Implement get_pending_transactions | Retrieve all pending transactions from queue | 20 min |
| 40 | Implement mark_as_synced | Mark transaction as successfully synced | 20 min |
| 41 | Implement mark_as_failed | Mark transaction as failed with error details | 20 min |
| 42 | Create retry counter | Track retry attempts per transaction | 15 min |
| 43 | Define max retry limit | Configure maximum sync attempts before manual intervention | 15 min |
| 44 | Create queue status summary | Return count of pending, syncing, failed transactions | 20 min |
| 45 | Implement queue persistence | Ensure queue survives browser refresh/restart | 25 min |
| 46 | Add transaction integrity check | Validate transaction data before queuing | 25 min |
| 47 | Create queue export functionality | Export queue to file for emergency recovery | 25 min |
| 48 | Create queue import functionality | Import queue from backup file | 25 min |
| 49 | Implement queue ordering | Process transactions in chronological order | 20 min |
| 50 | Add dependency tracking | Track if transaction depends on another (e.g., customer creation) | 25 min |
| 51 | Create queue notifications | Notify user of queue status changes | 20 min |
| 52 | Implement queue cleanup | Remove old synced transactions after retention period | 20 min |

---

### Group D: Sync Engine & Conflict Resolution (Tasks 53-72)

Automatic synchronization with conflict handling.

| Task # | Task Name | Description | Est. Time |
|--------|-----------|-------------|-----------|
| 53 | Create SyncEngine class | Main sync orchestration service | 35 min |
| 54 | Implement connection detection | Detect online/offline status changes | 25 min |
| 55 | Add connection event listeners | Listen for online/offline browser events | 20 min |
| 56 | Implement auto-sync trigger | Start sync automatically when coming online | 25 min |
| 57 | Create sync lock mechanism | Prevent multiple concurrent syncs | 20 min |
| 58 | Implement push_transactions method | Send queued transactions to server | 30 min |
| 59 | Create batch sync optimization | Send multiple transactions in single request | 25 min |
| 60 | Implement pull_updates method | Download server changes since last sync | 30 min |
| 61 | Add delta sync support | Use ETags or timestamps for efficient sync | 25 min |
| 62 | Create conflict detection | Detect when local and server data conflict | 30 min |
| 63 | Implement server-wins resolution | Server version overwrites local on conflict | 20 min |
| 64 | Implement merge resolution | Attempt to merge non-conflicting fields | 30 min |
| 65 | Implement manual resolution flag | Flag conflicts requiring user decision | 25 min |
| 66 | Create stock conflict handler | Handle stock level conflicts specially | 30 min |
| 67 | Create price conflict handler | Handle price conflicts with flagging | 25 min |
| 68 | Implement sync progress tracking | Track and report sync progress percentage | 25 min |
| 69 | Create sync error handling | Handle network errors, timeouts gracefully | 30 min |
| 70 | Implement exponential backoff | Increase delay between retry attempts | 20 min |
| 71 | Create sync completion callbacks | Notify frontend components when sync completes | 20 min |
| 72 | Add sync analytics | Track sync frequency, duration, error rates | 25 min |

---

### Group E: Frontend Offline Components (Tasks 73-84)

UI components for offline status and sync.

| Task # | Task Name | Description | Est. Time |
|--------|-----------|-------------|-----------|
| 73 | Create OfflineIndicator component | Visual indicator showing online/offline status | 25 min |
| 74 | Add connection status icon | Color-coded icon (green=online, red=offline, yellow=syncing) | 20 min |
| 75 | Create SyncStatusBar component | Show sync progress and pending count | 30 min |
| 76 | Add pending transaction badge | Show count of unsynced transactions | 20 min |
| 77 | Create SyncConflictModal component | Modal for resolving manual conflicts | 35 min |
| 78 | Create OfflineBanner component | Banner warning when operating offline | 25 min |
| 79 | Add offline mode restrictions UI | Disable unavailable features when offline | 25 min |
| 80 | Create SyncLogViewer component | View sync history and errors | 30 min |
| 81 | Create ManualSyncButton component | Button to trigger manual sync | 20 min |
| 82 | Add sync error toast notifications | Show toast for sync errors | 20 min |
| 83 | Create offline data status page | Page showing cache status, last sync times | 30 min |
| 84 | Add cache refresh button | Button to force refresh cached data | 20 min |

---

### Group F: Testing & Documentation (Tasks 85-90)

Comprehensive testing and documentation.

| Task # | Task Name | Description | Est. Time |
|--------|-----------|-------------|-----------|
| 85 | Create IndexedDB service tests | Test CRUD operations, indexes, versioning | 35 min |
| 86 | Create transaction queue tests | Test queue operations, persistence, recovery | 35 min |
| 87 | Create sync engine tests | Test sync flow, conflict resolution, retries | 40 min |
| 88 | Create offline scenario tests | End-to-end tests simulating offline usage | 45 min |
| 89 | Write offline module documentation | Document architecture, APIs, configuration | 45 min |
| 90 | Create offline operations guide | User guide for handling offline scenarios | 35 min |

---

## Expected File Structure

```
apps/pos/offline/
├── __init__.py
├── models/
│   ├── __init__.py
│   ├── sync_config.py            # Tasks 07-09
│   ├── sync_log.py               # Tasks 10-11
│   └── offline_transaction.py    # Tasks 12-14
├── services/
│   ├── __init__.py
│   └── sync_api.py               # Server-side sync endpoints
├── serializers/
│   ├── __init__.py
│   ├── sync_config.py
│   ├── sync_log.py
│   └── offline_transaction.py
├── views/
│   ├── __init__.py
│   └── sync_views.py
├── admin.py
├── urls.py
└── constants.py                  # Tasks 02-03

# Frontend (Next.js)
frontend/
├── lib/
│   └── offline/
│       ├── indexeddb.ts          # Tasks 17-25
│       ├── cache-service.ts      # Tasks 26-30
│       ├── service-worker.ts     # Tasks 31-33
│       ├── transaction-queue.ts  # Tasks 35-52
│       ├── sync-engine.ts        # Tasks 53-72
│       └── connection-monitor.ts # Tasks 54-55
├── components/
│   └── pos/
│       └── offline/
│           ├── OfflineIndicator.tsx   # Tasks 73-74
│           ├── SyncStatusBar.tsx      # Tasks 75-76
│           ├── SyncConflictModal.tsx  # Task 77
│           ├── OfflineBanner.tsx      # Task 78
│           ├── SyncLogViewer.tsx      # Task 80
│           └── ManualSyncButton.tsx   # Task 81
└── hooks/
    └── useOfflineStatus.ts
```

---

## Progress Tracking

| Group | Description | Tasks | Completed | Status |
|-------|-------------|-------|-----------|--------|
| A | Offline Data Architecture | 16 | 0 | 🔴 Not Started |
| B | Local Data Caching | 18 | 0 | 🔴 Not Started |
| C | Transaction Queue Management | 18 | 0 | 🔴 Not Started |
| D | Sync Engine & Conflict Resolution | 20 | 0 | 🔴 Not Started |
| E | Frontend Offline Components | 12 | 0 | 🔴 Not Started |
| F | Testing & Documentation | 6 | 0 | 🔴 Not Started |
| **Total** | | **90** | **0** | 🔴 |

---

## Notes for AI Agents

### Offline Mode State Machine
```
┌─────────────────────────────────────────────────────────────┐
│                       ONLINE                                 │
│    - Real-time operations                                    │
│    - Immediate sync                                          │
│    - Full feature availability                               │
└────────────────────────┬────────────────────────────────────┘
                         │ (connection lost)
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                       OFFLINE                                │
│    - Local cache operations                                  │
│    - Queue transactions                                      │
│    - Limited features                                        │
└────────────────────────┬────────────────────────────────────┘
                         │ (connection restored)
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                       SYNCING                                │
│    - Push queued transactions                                │
│    - Pull server updates                                     │
│    - Resolve conflicts                                       │
└────────────────────────┬────────────────────────────────────┘
                         │ (sync complete/error)
                         ▼
                    ONLINE or SYNC_ERROR
```

### Cacheable Entities & Priority
| Entity | Priority | Cache Strategy | Freshness |
|--------|----------|----------------|-----------|
| Products | High | Full + Incremental | 1 hour |
| Variants | High | Full + Incremental | 1 hour |
| Prices | High | Full + Incremental | 30 min |
| Categories | Medium | Full | 24 hours |
| Customers | Medium | Incremental | 1 hour |
| Tax Rates | High | Full | 24 hours |
| Settings | High | Full | On login |
| Quick Buttons | Low | Full | 24 hours |

### IndexedDB Schema
```javascript
// Database: lcc_pos_cache
// Version: 1

objectStores: {
  products: {
    keyPath: 'id',
    indexes: ['barcode', 'sku', 'name', 'category_id', 'updated_at']
  },
  variants: {
    keyPath: 'id',
    indexes: ['product_id', 'barcode', 'sku']
  },
  categories: {
    keyPath: 'id',
    indexes: ['parent_id', 'slug']
  },
  customers: {
    keyPath: 'id',
    indexes: ['phone', 'email', 'name']
  },
  transactions: {
    keyPath: 'offline_id',
    indexes: ['status', 'created_at', 'terminal_id']
  },
  sync_meta: {
    keyPath: 'entity_type',
    // stores: last_sync, version, count
  }
}
```

### Offline Transaction Structure
```javascript
{
  offline_id: 'OFFLINE-T01-1704067200-001',
  terminal_id: 'T01',
  session_id: 'local-session-uuid',
  created_at: '2024-01-01T10:00:00Z',
  synced_at: null,
  status: 'PENDING', // PENDING, SYNCING, SYNCED, FAILED
  retry_count: 0,
  error_message: null,
  
  payload: {
    cart: {
      reference: 'POS-2024-T01-000123',
      customer_id: 456, // or null
      items: [
        { product_id: 1, variant_id: 2, quantity: 3, unit_price: 100.00 }
      ],
      discount: { type: 'PERCENT', value: 10 },
      subtotal: 300.00,
      tax_total: 36.00,
      grand_total: 306.00
    },
    payments: [
      { method: 'CASH', amount: 350.00, tendered: 350.00, change: 44.00 }
    ]
  }
}
```

### Conflict Resolution Strategy
```
STRATEGY: SERVER_WINS (default)
┌─────────────────────────────────────────────────────────────┐
│  Local Data        Server Data        Resolution            │
├─────────────────────────────────────────────────────────────┤
│  Price: 100        Price: 110         Use 110 (server)      │
│  Stock: 50         Stock: 45          Use 45 (server)       │
│  Customer: John    Customer: John D.  Use John D. (server)  │
└─────────────────────────────────────────────────────────────┘

STRATEGY: MERGE (for non-conflicting fields)
┌─────────────────────────────────────────────────────────────┐
│  Local: {name: 'A', notes: 'New note'}                      │
│  Server: {name: 'A Updated', notes: null}                   │
│  Merged: {name: 'A Updated', notes: 'New note'}             │
└─────────────────────────────────────────────────────────────┘

STOCK CONFLICT (special handling)
┌─────────────────────────────────────────────────────────────┐
│  Scenario: Offline sale of 5 units                          │
│  Local Stock: 50 → 45 (after offline sale)                  │
│  Server Stock: 48 (another terminal sold 2)                 │
│  Resolution: Server stock (48) - offline sale (5) = 43      │
│  Flag if result would be negative                           │
└─────────────────────────────────────────────────────────────┘
```

### Sync API Endpoints
| Endpoint | Method | Description |
|----------|--------|-------------|
| /api/pos/sync/push/ | POST | Submit offline transactions |
| /api/pos/sync/pull/ | GET | Get updates since timestamp |
| /api/pos/sync/status/ | GET | Get sync status for terminal |
| /api/pos/sync/conflicts/ | GET | Get unresolved conflicts |
| /api/pos/sync/resolve/ | POST | Submit conflict resolution |

### Service Worker Cache Strategy
```javascript
// Static assets: Cache First
workbox.routing.registerRoute(
  /\.(js|css|woff2|png|jpg)$/,
  new workbox.strategies.CacheFirst()
);

// API requests: Network First with offline fallback
workbox.routing.registerRoute(
  /\/api\//,
  new workbox.strategies.NetworkFirst({
    cacheName: 'api-cache',
    networkTimeoutSeconds: 3
  })
);

// POS essential data: Stale While Revalidate
workbox.routing.registerRoute(
  /\/api\/pos\/products/,
  new workbox.strategies.StaleWhileRevalidate({
    cacheName: 'pos-products'
  })
);
```

### Offline Feature Availability
| Feature | Online | Offline |
|---------|--------|---------|
| Product Search | ✅ Full | ✅ Cached only |
| Barcode Scan | ✅ Full | ✅ Cached only |
| Create Transaction | ✅ Full | ✅ Queued |
| Cash Payment | ✅ Full | ✅ Full |
| Card Payment | ✅ Full | ⚠️ Queue for later |
| Customer Lookup | ✅ Full | ✅ Cached only |
| New Customer | ✅ Full | ✅ Queued |
| Price Override | ✅ Full | ✅ Full |
| Reports | ✅ Full | ❌ Unavailable |
| Refunds | ✅ Full | ⚠️ Limited |

---

## Changelog

| Date | Author | Changes |
|------|--------|---------|
| TBD | AI Agent | Initial task summary creation |
