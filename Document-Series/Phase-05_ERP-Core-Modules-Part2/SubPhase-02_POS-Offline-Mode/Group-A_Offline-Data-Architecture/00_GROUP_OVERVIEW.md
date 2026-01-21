# Group A: Offline Data Architecture

> **Phase:** 05 - ERP Core Modules Part 2  
> **SubPhase:** 02 - POS Offline Mode  
> **Group:** A of F  
> **Tasks Covered:** 01-16  
> **Group Goal:** Define offline storage schema and server-side sync architecture

---

## Navigation

- **↑ Parent:** [SubPhase-02 Summary](../00_TASKS_SUMMARY.md)
- **→ Next Group:** [Group B: Local Data Caching](../Group-B_Local-Data-Caching/)

---

## Group Overview

### Key Outcomes

1. **Offline Submodule** - Organized `apps/pos/offline/` package structure
2. **Offline Mode Constants** - ONLINE, OFFLINE, SYNCING, SYNC_ERROR
3. **Sync Status Constants** - PENDING, IN_PROGRESS, COMPLETED, FAILED, CONFLICT
4. **Offline Data Schema Design** - Document cacheable entities and relationships
5. **Cacheable Entities List** - Products, variants, prices, categories, customers
6. **Offline Transaction Schema** - Structure for offline cart, items, payments
7. **OfflineSyncConfig Model** - Tenant-level sync configuration
8. **Sync Frequency Settings** - Auto sync interval, max transactions, cache TTL
9. **Conflict Resolution Settings** - Default resolution strategy per entity
10. **SyncLog Model** - Track all sync operations with timestamps and results
11. **OfflineTransaction Model** - Server-side record of queued transactions
12. **Sync Priority Logic** - Priority order for syncing entity types
13. **Data Freshness Requirements** - Acceptable staleness per entity type

### Technology Context

| Technology | Purpose |
|------------|---------|
| Django ORM | SyncConfig, SyncLog, OfflineTransaction models |
| JSONField | Store complete transaction payloads |
| PostgreSQL | Efficient querying of sync logs and transactions |
| Celery | Background sync processing |

---

## Documents in This Group

| # | Document | Tasks | Description |
|---|----------|-------|-------------|
| 01 | `01_Tasks-01-06_Submodule-Schema-Design.md` | 01-06 | Offline submodule, constants, data schema, cacheable entities, transaction schema |
| 02 | `02_Tasks-07-11_Sync-Config-Log-Models.md` | 07-11 | OfflineSyncConfig model, sync settings, SyncLog model |
| 03 | `03_Tasks-12-16_Offline-Transaction-Priority.md` | 12-16 | OfflineTransaction model, metadata, priority logic, freshness requirements |

---

## Task Summary

| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 01 | Create offline submodule | Low | 10 min |
| 02 | Define offline mode constants | Low | 10 min |
| 03 | Define sync status constants | Low | 10 min |
| 04 | Design offline data schema | High | 35 min |
| 05 | Define cacheable entities list | Medium | 20 min |
| 06 | Define offline transaction schema | Medium | 25 min |
| 07 | Create OfflineSyncConfig model | Medium | 30 min |
| 08 | Add sync frequency settings | Medium | 20 min |
| 09 | Add conflict resolution settings | Medium | 20 min |
| 10 | Create SyncLog model | Medium | 30 min |
| 11 | Add sync log fields | Medium | 20 min |
| 12 | Create OfflineTransaction model | Medium | 30 min |
| 13 | Add transaction metadata | Medium | 20 min |
| 14 | Add transaction payload field | Low | 15 min |
| 15 | Create sync priority logic | Medium | 25 min |
| 16 | Document data freshness requirements | Medium | 20 min |

---

## Execution Order

```
[Tasks 01-03: Offline submodule and constants]
         │
         ▼
[Tasks 04-06: Data schema design]
         │
         ▼
[Tasks 07-09: OfflineSyncConfig model with settings]
         │
         ▼
[Tasks 10-11: SyncLog model]
         │
         ▼
[Tasks 12-14: OfflineTransaction model]
         │
         ▼
[Tasks 15-16: Priority logic and freshness requirements]
```

---

## Expected Deliverables

```
apps/pos/offline/
├── __init__.py
├── models/
│   ├── __init__.py
│   ├── sync_config.py            # Tasks 07-09
│   ├── sync_log.py               # Tasks 10-11
│   └── offline_transaction.py    # Tasks 12-14
├── constants.py                  # Tasks 02-03
└── docs/
    ├── data_schema.md            # Task 04
    ├── cacheable_entities.md     # Task 05
    └── freshness_requirements.md # Task 16
```

---

## Notes for AI Agents

### Offline Mode States
- **ONLINE**: Normal operation with server connection
- **OFFLINE**: No server connection, using local cache
- **SYNCING**: Actively syncing data with server
- **SYNC_ERROR**: Sync failed, manual intervention may be needed

### Sync Status
- **PENDING**: Transaction waiting to be synced
- **IN_PROGRESS**: Currently syncing
- **COMPLETED**: Successfully synced
- **FAILED**: Sync failed after retries
- **CONFLICT**: Requires manual conflict resolution

### Cacheable Entities & Priority
| Entity | Priority | Freshness |
|--------|----------|-----------|
| Products | High | 1 hour |
| Variants | High | 1 hour |
| Prices | High | 30 min |
| Categories | Medium | 24 hours |
| Customers | Medium | 1 hour |
| Tax Rates | High | 24 hours |
| Settings | High | On login |

### OfflineSyncConfig Fields
- tenant FK: Link to tenant
- auto_sync_interval: Minutes between auto-syncs
- max_offline_transactions: Max queued transactions
- cache_ttl_products: Product cache duration
- cache_ttl_customers: Customer cache duration
- default_conflict_resolution: SERVER_WINS, MERGE, MANUAL

### SyncLog Fields
- sync_type: PUSH, PULL, FULL
- started_at, completed_at
- entities_synced: Count per entity type
- errors: JSON array of error details
- duration_ms: Sync duration

### OfflineTransaction Fields
- offline_id: Unique offline ID
- terminal_id: Source terminal
- offline_timestamp: When created offline
- sync_status: Current status
- retry_count: Number of sync attempts
- payload: Complete transaction JSON
- error_message: Last error if failed
