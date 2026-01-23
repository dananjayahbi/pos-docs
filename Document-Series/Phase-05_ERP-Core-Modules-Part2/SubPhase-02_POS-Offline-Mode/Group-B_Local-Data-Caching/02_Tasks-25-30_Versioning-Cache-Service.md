# Tasks 25-30: Versioning & Cache Service

> **Phase:** 05 - ERP Core Modules Part 2  
> **SubPhase:** 02 - POS Offline Mode  
> **Group:** B - Local Data Caching  
> **Document:** 02 of 03  
> **Tasks Covered:** 25, 26, 27, 28, 29, 30

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-17-24_IndexedDB-Object-Stores.md](01_Tasks-17-24_IndexedDB-Object-Stores.md)
- **→ Next Document:** [03_Tasks-31-34_Service-Worker-Cache.md](03_Tasks-31-34_Service-Worker-Cache.md)

---

## Document Overview

This document covers the implementation of data versioning, cache population service, incremental sync mechanism, and cache size management. These features ensure that offline data stays synchronized with the server efficiently.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 25 | Implement Data Versioning | Medium |
| 26 | Create Cache Population Service | High |
| 27 | Implement Incremental Sync | High |
| 28 | Add Last Modified Tracking | Medium |
| 29 | Create Cache Size Management | Medium |
| 30 | Implement Cache Invalidation | Medium |

---

## Task 25: Implement Data Versioning

### Overview
Create a versioning system to track cache versions for each entity type, enabling cache invalidation when server data changes significantly.

### Dependencies
- Task 17: Create IndexedDB Service
- Task 18: Define Database Schema

### Instructions

1. **Create versioning service file**
   - Create `frontend/lib/offline/versioning.ts`
   - Import IDBService and SyncMeta interface

2. **Define version tracking structure**
   - Entity type (products, categories, customers, settings)
   - Version number or hash
   - Last sync timestamp
   - Record count
   - Sync token for pagination

3. **Implement getEntityVersion method**
   - Accept entity_type parameter
   - Query sync_meta store by entity_type
   - Return current version info or null
   - Return Promise with version metadata

4. **Implement setEntityVersion method**
   - Accept entity_type and version info
   - Store version, timestamp, count in sync_meta
   - Update existing record or insert new
   - Return Promise with success status

5. **Implement compareVersions method**
   - Accept entity_type and server version
   - Get local version from sync_meta
   - Compare local vs server version
   - Return comparison result (match, outdated, missing)

6. **Create version hash calculation**
   - Calculate hash from version string or timestamp
   - Use simple hash algorithm (FNV-1a or similar)
   - Consistent hash for same input
   - Use for quick version comparison

7. **Implement isStale method**
   - Accept entity_type and staleness threshold
   - Get last_sync_at from sync_meta
   - Calculate time since last sync
   - Return true if older than threshold

8. **Create bulkUpdateVersions method**
   - Accept map of entity_type to version info
   - Update multiple entity versions in single transaction
   - Return Promise with success status

9. **Implement resetEntityVersion method**
   - Accept entity_type parameter
   - Delete version record from sync_meta
   - Forces full resync on next cache population
   - Return Promise with success status

10. **Add version metadata storage**
    - Store server-provided ETag
    - Store sync token for pagination
    - Store has_more flag for chunked sync
    - Store error count for failed syncs

11. **Create getAllVersions method**
    - Query all records from sync_meta store
    - Return Map of entity_type to version info
    - Include all metadata

12. **Export versioning service**
    - Export VersioningService class instance
    - Export version comparison constants
    - Export TypeScript interfaces

### Version Metadata Structure

| Field | Type | Description |
|-------|------|-------------|
| entity_type | string | Entity identifier (key path) |
| version | string | Version string or hash |
| last_sync_at | string | ISO timestamp of last sync |
| record_count | number | Number of cached records |
| sync_token | string | Continuation token for pagination |
| has_more | boolean | More records available on server |
| etag | string | Server-provided ETag |
| error_count | number | Failed sync attempts |
| last_error | string | Last sync error message |

### Version Comparison Results

| Result | Meaning | Action Required |
|--------|---------|-----------------|
| `match` | Local and server versions match | No sync needed |
| `outdated` | Local version is older | Incremental sync |
| `missing` | No local version exists | Full sync required |
| `ahead` | Local version newer (error state) | Force resync |

### Staleness Thresholds

| Entity Type | Threshold | Rationale |
|-------------|-----------|-----------|
| products | 30 minutes | Product data changes frequently |
| categories | 4 hours | Categories rarely change |
| customers | 1 hour | Customer data moderately dynamic |
| settings | 6 hours | Settings change infrequently |

### Expected Outcome
```
frontend/
└── lib/
    └── offline/
        ├── indexeddb.ts
        ├── schema.ts
        ├── versioning.ts      # Version tracking service
        └── stores/
            └── ...
```

### Verification Checklist
- [ ] Versioning service file created
- [ ] Version metadata structure defined
- [ ] Get/set entity version methods implemented
- [ ] Version comparison method implemented
- [ ] Staleness check method implemented
- [ ] Bulk version update implemented
- [ ] Version reset method implemented
- [ ] All metadata fields supported
- [ ] TypeScript interfaces defined
- [ ] Service instance exported

---

## Task 26: Create Cache Population Service

### Overview
Create a service to download data from the server and populate IndexedDB cache, supporting both full and incremental sync operations.

### Dependencies
- Task 17: Create IndexedDB Service
- Task 19-24: All Object Stores
- Task 25: Implement Data Versioning

### Instructions

1. **Create cache service file**
   - Create `frontend/lib/offline/cache-service.ts`
   - Import all store services and versioning service

2. **Define sync configuration**
   - API endpoints for each entity type
   - Batch size for fetching records
   - Retry configuration (attempts, delays)
   - Timeout settings

3. **Implement syncProducts method**
   - Accept sync mode parameter (full or incremental)
   - Determine sync strategy based on mode and version
   - Fetch products from API in batches
   - Store products in IndexedDB
   - Update version metadata
   - Return sync result with stats

4. **Implement syncCategories method**
   - Fetch categories from API
   - Build category tree to validate hierarchy
   - Store categories in IndexedDB
   - Update version metadata
   - Return sync result

5. **Implement syncCustomers method**
   - Fetch customers from API in batches
   - Normalize phone and email fields
   - Store customers in IndexedDB
   - Update version metadata
   - Return sync result

6. **Implement syncSettings method**
   - Fetch terminal settings from API
   - Fetch tax rates configuration
   - Fetch payment methods configuration
   - Store all settings in IndexedDB
   - Update version metadata
   - Return sync result

7. **Create syncAll method**
   - Sync all entity types in sequence
   - Settings → Categories → Products → Customers
   - Continue on partial failure
   - Collect results from all syncs
   - Return combined sync report

8. **Implement batch fetching**
   - Fetch records in configurable batch size (100-500)
   - Use pagination with offset/limit or cursor
   - Process each batch before fetching next
   - Show progress updates during sync

9. **Add progress tracking**
   - Calculate progress percentage
   - Emit progress events for UI updates
   - Track: current entity, records processed, total records
   - Provide estimated time remaining

10. **Implement error handling**
    - Catch network errors
    - Catch API errors (4xx, 5xx)
    - Catch IndexedDB errors
    - Retry failed requests with exponential backoff
    - Log errors for debugging

11. **Create retry mechanism**
    - Configurable retry attempts (default: 3)
    - Exponential backoff delay (1s, 2s, 4s)
    - Abort after max retries
    - Distinguish between retryable and non-retryable errors

12. **Add sync result reporting**
    - Success/failure status per entity
    - Records inserted, updated, deleted
    - Errors encountered
    - Duration of sync operation
    - Next sync timestamp

13. **Export cache service**
    - Export CacheService class instance
    - Export sync mode constants
    - Export TypeScript interfaces

### Sync Configuration

| Setting | Value | Description |
|---------|-------|-------------|
| BATCH_SIZE | 500 | Records per API request |
| MAX_RETRIES | 3 | Max retry attempts |
| RETRY_DELAY_MS | 1000 | Initial retry delay |
| TIMEOUT_MS | 30000 | Request timeout |
| CONCURRENT_REQUESTS | 1 | Parallel sync operations |

### API Endpoints

| Entity Type | Endpoint | Method |
|-------------|----------|--------|
| products | /api/pos/cache/products/ | GET |
| categories | /api/pos/cache/categories/ | GET |
| customers | /api/pos/cache/customers/ | GET |
| settings | /api/pos/cache/settings/ | GET |

### Sync Result Structure
```typescript
{
  entity_type: string,
  success: boolean,
  mode: 'full' | 'incremental',
  stats: {
    inserted: number,
    updated: number,
    deleted: number,
    total: number
  },
  duration_ms: number,
  error?: string,
  next_sync_at: string
}
```

### Sync Sequence Diagram
```
User → CacheService.syncAll()
  │
  ├→ syncSettings()
  │   ├→ API: GET /cache/settings/
  │   ├→ IDB: Store settings
  │   └→ Versioning: Update version
  │
  ├→ syncCategories()
  │   ├→ API: GET /cache/categories/
  │   ├→ IDB: Store categories
  │   └→ Versioning: Update version
  │
  ├→ syncProducts()
  │   ├→ API: GET /cache/products/?limit=500&offset=0
  │   ├→ IDB: Bulk insert products batch 1
  │   ├→ API: GET /cache/products/?limit=500&offset=500
  │   ├→ IDB: Bulk insert products batch 2
  │   └→ Versioning: Update version
  │
  └→ syncCustomers()
      ├→ API: GET /cache/customers/?limit=500&offset=0
      ├→ IDB: Bulk insert customers batch 1
      └→ Versioning: Update version
```

### Expected Outcome
```
frontend/
└── lib/
    └── offline/
        ├── indexeddb.ts
        ├── schema.ts
        ├── versioning.ts
        ├── cache-service.ts   # Cache population service
        └── stores/
            └── ...
```

### Verification Checklist
- [ ] Cache service file created
- [ ] Sync methods for all entities implemented
- [ ] Batch fetching implemented
- [ ] Progress tracking implemented
- [ ] Error handling for network failures
- [ ] Retry mechanism with backoff
- [ ] Sync result reporting implemented
- [ ] SyncAll method orchestrates all syncs
- [ ] API endpoints configured
- [ ] TypeScript interfaces defined

---

## Task 27: Implement Incremental Sync

### Overview
Implement incremental sync to download only changed records since last sync, reducing bandwidth and sync time.

### Dependencies
- Task 25: Implement Data Versioning
- Task 26: Create Cache Population Service
- Task 28: Add Last Modified Tracking

### Instructions

1. **Update cache service with incremental sync**
   - Add incremental sync mode to all sync methods
   - Check last_sync_at timestamp before sync
   - Pass timestamp to API requests

2. **Implement getLastSyncTimestamp method**
   - Accept entity_type parameter
   - Query sync_meta for last_sync_at
   - Return ISO timestamp or null if never synced
   - Use as If-Modified-Since header

3. **Add incremental sync request headers**
   - Add `If-Modified-Since` header with last_sync_at
   - Add `X-Sync-Token` header for pagination continuation
   - Server returns 304 Not Modified if no changes

4. **Handle 304 Not Modified response**
   - No records to sync
   - Update last_sync_at to current time
   - Keep existing data unchanged
   - Return sync result with 0 records

5. **Process incremental response**
   - Server returns only changed records
   - Each record includes operation: insert, update, delete
   - Process inserts/updates with bulkPut
   - Process deletes by removing from store

6. **Implement handleDeletedRecords method**
   - Server includes deleted_ids array
   - Bulk delete records by IDs
   - Update record_count in sync_meta
   - Return count of deleted records

7. **Add sync token handling**
   - Server provides sync_token in response header
   - Store sync_token in sync_meta
   - Include in next request to continue pagination
   - Clear token when sync completes

8. **Implement pagination for incremental sync**
   - Check X-Has-More response header
   - Continue fetching while has_more is true
   - Use sync_token for continuation
   - Aggregate results from all pages

9. **Create detectConflicts method**
   - Compare local updated_at with server updated_at
   - Identify records modified locally while offline
   - Resolve conflicts (server wins strategy)
   - Log conflicts for review

10. **Add incremental sync optimization**
    - Skip sync if last sync was recent (< threshold)
    - Only sync entities marked as stale
    - Prioritize products over other entities
    - Batch commits to IndexedDB

11. **Implement sync scheduling**
    - Calculate next_sync_at based on entity staleness
    - Store next_sync_at in sync_meta
    - Use for automatic background sync
    - Allow manual sync override

12. **Create sync statistics tracking**
    - Track network bytes transferred
    - Track sync duration
    - Track records processed
    - Store statistics for monitoring

### Incremental Sync Request Headers

| Header | Value | Purpose |
|--------|-------|---------|
| If-Modified-Since | ISO timestamp | Get records changed after |
| X-Sync-Token | Opaque token | Continue pagination |
| X-Entity-Version | Version string | Detect breaking changes |

### Incremental Sync Response Headers

| Header | Value | Purpose |
|--------|-------|---------|
| X-Has-More | true/false | More records available |
| X-Sync-Token | Opaque token | Token for next request |
| X-Deleted-Count | number | Records deleted on server |
| X-Total-Changed | number | Total changed records |

### Incremental vs Full Sync Decision

```
┌─────────────────────────────┐
│ Check last_sync_at          │
└──────────┬──────────────────┘
           │
    ┌──────▼──────┐
    │ Never synced? │
    └──────┬───────┘
           │
      ┌────▼────┐
      │ Yes     │ No
      │         │
  ┌───▼────┐ ┌─▼──────────┐
  │ Full   │ │ Check age  │
  │ Sync   │ │ of sync    │
  └────────┘ └─┬──────────┘
               │
          ┌────▼─────┐
          │ Age > 24h? │
          └────┬──────┘
               │
          ┌────▼────┬────┐
          │ Yes     │ No │
          │         │    │
      ┌───▼────┐ ┌──▼──────────┐
      │ Full   │ │ Incremental │
      │ Sync   │ │ Sync        │
      └────────┘ └─────────────┘
```

### Expected Outcome
```
frontend/
└── lib/
    └── offline/
        ├── indexeddb.ts
        ├── schema.ts
        ├── versioning.ts
        ├── cache-service.ts   # Updated with incremental sync
        └── stores/
            └── ...
```

### Verification Checklist
- [ ] Incremental sync mode added to cache service
- [ ] Last sync timestamp retrieval implemented
- [ ] If-Modified-Since header sent to API
- [ ] 304 Not Modified response handled
- [ ] Deleted records processing implemented
- [ ] Sync token handling implemented
- [ ] Pagination for incremental sync implemented
- [ ] Conflict detection implemented
- [ ] Sync scheduling logic implemented
- [ ] Statistics tracking implemented
- [ ] Full vs incremental decision logic implemented

---

## Task 28: Add Last Modified Tracking

### Overview
Enhance entity tracking with last_modified timestamps to support accurate incremental sync and conflict detection.

### Dependencies
- Task 17: Create IndexedDB Service
- Task 19-24: All Object Stores

### Instructions

1. **Update entity interfaces**
   - Add updated_at field to all entity interfaces
   - Ensure updated_at is ISO 8601 string
   - Server provides updated_at in all responses

2. **Create timestamp utilities file**
   - Create `frontend/lib/offline/utils.ts`
   - Implement getCurrentTimestamp() - returns ISO string
   - Implement parseTimestamp(iso) - parse to Date object
   - Implement isTimestampNewer(ts1, ts2) - comparison

3. **Update all store services**
   - Set updated_at on all insert operations
   - Update updated_at on all update operations
   - Preserve server-provided updated_at on sync
   - Never overwrite server timestamp with local

4. **Implement getMostRecentUpdate method**
   - Accept entity_type parameter
   - Query entity store using updated_at index
   - Get record with latest updated_at
   - Return most recent timestamp
   - Use for incremental sync If-Modified-Since

5. **Add tracking to products store**
   - Index on updated_at field
   - Update timestamp on product updates
   - getMostRecentProductUpdate() method

6. **Add tracking to categories store**
   - Index on updated_at field
   - Update timestamp on category updates
   - getMostRecentCategoryUpdate() method

7. **Add tracking to customers store**
   - Index on updated_at field
   - Update timestamp on customer updates
   - getMostRecentCustomerUpdate() method

8. **Add tracking to settings store**
   - Store updated_at in setting metadata
   - Update on setting changes
   - getMostRecentSettingUpdate() method

9. **Implement local modification detection**
   - Compare local updated_at with sync_meta last_sync_at
   - Identify records modified since last sync
   - Flag for conflict resolution
   - Return list of locally modified records

10. **Create timestamp comparison utilities**
    - isOlderThan(timestamp, duration) - check age
    - getDuration(start, end) - calculate duration
    - formatDuration(ms) - human-readable format

11. **Add server time synchronization**
    - Get server timestamp from API response header
    - Calculate client-server time offset
    - Adjust local timestamps for comparison
    - Store offset in sync_meta

12. **Document timestamp handling**
    - Document timezone handling (all UTC)
    - Document timestamp precision (milliseconds)
    - Document clock skew handling
    - Provide examples

### Timestamp Field Requirements

| Entity | Field | Format | Source | Indexed |
|--------|-------|--------|--------|---------|
| products | updated_at | ISO 8601 | Server | Yes |
| categories | updated_at | ISO 8601 | Server | Yes |
| customers | updated_at | ISO 8601 | Server | Yes |
| settings | updated_at | ISO 8601 | Server | No |
| transactions | created_at | ISO 8601 | Client | Yes |

### Timestamp Utilities

| Function | Purpose | Example |
|----------|---------|---------|
| getCurrentTimestamp() | Get current UTC time | "2026-01-23T12:00:00.000Z" |
| parseTimestamp(iso) | Parse to Date object | Date object |
| isTimestampNewer(ts1, ts2) | Compare timestamps | true/false |
| isOlderThan(ts, duration) | Check if older than duration | true/false |
| getDuration(start, end) | Calculate duration | 3600000 (ms) |

### Server Time Synchronization

```
Client Request:
  GET /api/pos/cache/products/

Server Response:
  Headers:
    X-Server-Time: 2026-01-23T12:00:00.000Z
    
Client:
  client_time = Date.now()
  server_time = parse(X-Server-Time)
  offset = server_time - client_time
  
For Comparisons:
  adjusted_local_time = local_time + offset
```

### Expected Outcome
```
frontend/
└── lib/
    └── offline/
        ├── indexeddb.ts
        ├── schema.ts
        ├── versioning.ts
        ├── cache-service.ts
        ├── utils.ts           # Timestamp utilities
        └── stores/
            └── ...            # All updated with tracking
```

### Verification Checklist
- [ ] Updated_at field added to all entities
- [ ] Timestamp utilities file created
- [ ] All store services set updated_at
- [ ] getMostRecentUpdate methods implemented
- [ ] Updated_at indexes created
- [ ] Local modification detection implemented
- [ ] Timestamp comparison utilities created
- [ ] Server time synchronization implemented
- [ ] All timestamps in UTC ISO 8601 format
- [ ] Documentation for timestamp handling

---

## Task 29: Create Cache Size Management

### Overview
Implement cache size monitoring and management to prevent excessive storage usage, including automatic pruning of old data.

### Dependencies
- Task 17: Create IndexedDB Service
- Task 19-24: All Object Stores
- Task 25: Implement Data Versioning

### Instructions

1. **Create cache management file**
   - Create `frontend/lib/offline/cache-manager.ts`
   - Import all store services

2. **Define cache size limits**
   - Products: 10,000 records max
   - Customers: 5,000 records max
   - Transactions: 100 pending max
   - Total storage: 50 MB recommended limit
   - Configurable per deployment

3. **Implement getCacheSize method**
   - Calculate size of each object store
   - Sum total IndexedDB database size
   - Use navigator.storage.estimate() for quota
   - Return size in bytes and percentage of quota

4. **Implement getCacheStats method**
   - Count records in each object store
   - Calculate average record size
   - Identify largest object stores
   - Return statistics object

5. **Create checkCacheLimits method**
   - Check record count per store against limits
   - Check total storage size against quota
   - Return warnings for stores approaching limits
   - Return errors for stores exceeding limits

6. **Implement pruneProducts method**
   - Remove oldest inactive products when limit exceeded
   - Keep only recently accessed products
   - Prioritize products with recent sales
   - Keep minimum set of essential products
   - Return count of products pruned

7. **Implement pruneCustomers method**
   - Remove customers with no recent purchases
   - Keep VIP customers (high tier)
   - Keep customers with pending transactions
   - Return count of customers pruned

8. **Implement pruneSyncedTransactions method**
   - Remove synced transactions older than threshold
   - Default: remove after 30 days
   - Keep failed transactions for manual review
   - Return count of transactions pruned

9. **Create automatic pruning scheduler**
   - Run pruning check on cache population
   - Run pruning on app startup
   - Configurable automatic pruning threshold
   - Log pruning operations

10. **Implement clearCache method**
    - Clear all object stores except settings
    - Reset all version metadata
    - Preserve terminal configuration
    - Return success status

11. **Add storage quota monitoring**
    - Monitor available storage quota
    - Warn when approaching quota limit
    - Prevent cache population if quota exceeded
    - Provide user-friendly warning messages

12. **Create cache health check**
    - Verify database integrity
    - Check for corrupted records
    - Validate indexes
    - Return health report

13. **Export cache manager**
    - Export CacheManager class instance
    - Export cache limit constants
    - Export TypeScript interfaces

### Cache Size Limits Configuration

| Object Store | Max Records | Max Size | Pruning Strategy |
|--------------|-------------|----------|------------------|
| products | 10,000 | ~30 MB | Remove oldest inactive |
| variants | 20,000 | ~15 MB | Remove with parent product |
| categories | 1,000 | ~500 KB | No pruning (small) |
| customers | 5,000 | ~5 MB | Remove inactive customers |
| transactions | 100 | ~1 MB | Remove old synced |
| settings | 100 | ~100 KB | No pruning |

### Pruning Priority Rules

**Products:**
1. Keep products sold in last 30 days
2. Keep products in active categories
3. Keep products with stock > 0
4. Remove oldest inactive products

**Customers:**
1. Keep customers with purchases in last 90 days
2. Keep Gold/Silver tier customers
3. Keep customers with pending transactions
4. Remove Bronze tier with no recent activity

**Transactions:**
1. Keep all pending transactions
2. Keep all failed transactions
3. Remove synced transactions > 30 days old

### Cache Statistics Structure
```typescript
{
  total_size_bytes: number,
  quota_bytes: number,
  quota_usage_percent: number,
  stores: {
    products: { count: number, size_bytes: number },
    customers: { count: number, size_bytes: number },
    transactions: { count: number, size_bytes: number },
    // ... other stores
  },
  warnings: string[],
  errors: string[]
}
```

### Expected Outcome
```
frontend/
└── lib/
    └── offline/
        ├── indexeddb.ts
        ├── schema.ts
        ├── versioning.ts
        ├── cache-service.ts
        ├── cache-manager.ts   # Cache size management
        └── stores/
            └── ...
```

### Verification Checklist
- [ ] Cache manager file created
- [ ] Cache size limits configured
- [ ] getCacheSize method implemented
- [ ] getCacheStats method implemented
- [ ] Cache limits checking implemented
- [ ] Product pruning implemented
- [ ] Customer pruning implemented
- [ ] Transaction pruning implemented
- [ ] Automatic pruning scheduler implemented
- [ ] Clear cache method implemented
- [ ] Storage quota monitoring implemented
- [ ] Cache health check implemented

---

## Task 30: Implement Cache Invalidation

### Overview
Implement cache invalidation mechanisms to clear outdated or corrupted data, supporting both automatic and manual invalidation.

### Dependencies
- Task 25: Implement Data Versioning
- Task 26: Create Cache Population Service
- Task 29: Create Cache Size Management

### Instructions

1. **Add invalidation methods to cache service**
   - Update `cache-service.ts` with invalidation logic
   - Support entity-specific and full invalidation

2. **Implement invalidateEntity method**
   - Accept entity_type parameter
   - Clear all records from specified object store
   - Reset version metadata for entity
   - Mark entity for full resync
   - Return Promise with success status

3. **Implement invalidateAll method**
   - Clear all object stores except settings
   - Reset all version metadata
   - Preserve terminal configuration
   - Force full resync on next cache population
   - Return Promise with success status

4. **Create version-based invalidation**
   - Accept breaking_version parameter from server
   - Compare with local entity version
   - Invalidate if server version is breaking change
   - Trigger automatic full resync

5. **Implement selective invalidation**
   - Accept array of record IDs to invalidate
   - Remove specified records from store
   - Update record_count in sync_meta
   - Useful for targeted cache updates

6. **Add time-based invalidation**
   - Accept entity_type and max_age parameter
   - Remove records older than max_age
   - Use updated_at or created_at timestamp
   - Return count of invalidated records

7. **Create server-triggered invalidation**
   - Listen for invalidation signals from server
   - Server sends X-Cache-Invalidate header
   - Parse entity list from header
   - Trigger invalidation for specified entities

8. **Implement integrity check invalidation**
   - Detect corrupted records in IndexedDB
   - Detect missing required fields
   - Detect orphaned records (foreign key violations)
   - Invalidate corrupted data automatically

9. **Add manual invalidation UI hook**
   - Provide method for user-triggered invalidation
   - Show confirmation dialog before clearing
   - Display progress during invalidation
   - Show success/error feedback

10. **Create invalidation event system**
    - Emit event when invalidation occurs
    - Include entity_type and reason
    - Allow components to react to invalidation
    - Update UI to reflect cache state

11. **Implement cascade invalidation**
    - Invalidating categories invalidates products
    - Invalidating products invalidates variants
    - Document cascade rules
    - Prevent partial data states

12. **Add invalidation logging**
    - Log all invalidation events
    - Include timestamp, entity, reason
    - Store invalidation history
    - Useful for debugging cache issues

13. **Export invalidation utilities**
    - Export invalidation methods
    - Export invalidation reason constants
    - Export TypeScript interfaces

### Invalidation Triggers

| Trigger | Type | Action |
|---------|------|--------|
| Server Breaking Change | Automatic | Invalidate affected entity |
| Data Corruption | Automatic | Invalidate corrupted records |
| User Request | Manual | Invalidate selected entities |
| Age Threshold | Automatic | Invalidate old records |
| Storage Quota | Automatic | Invalidate to free space |
| Server Signal | Server | Invalidate specified entities |

### Server Invalidation Header
```
Response Headers:
  X-Cache-Invalidate: products,categories
  X-Cache-Version: 2.0.0
  X-Breaking-Changes: true

Client Action:
  Parse X-Cache-Invalidate header
  Invalidate products and categories
  Trigger full resync
```

### Cascade Invalidation Rules

```
Categories Invalidated
    ↓
Products in those categories invalidated
    ↓
Variants of those products invalidated
```

### Invalidation Reasons Constants
```typescript
enum InvalidationReason {
  MANUAL = 'manual',
  BREAKING_CHANGE = 'breaking_change',
  CORRUPTION = 'corruption',
  QUOTA_EXCEEDED = 'quota_exceeded',
  TOO_OLD = 'too_old',
  SERVER_SIGNAL = 'server_signal'
}
```

### Invalidation Event Structure
```typescript
{
  entity_type: string,
  reason: InvalidationReason,
  timestamp: string,
  records_affected: number,
  trigger: 'automatic' | 'manual' | 'server'
}
```

### Expected Outcome
```
frontend/
└── lib/
    └── offline/
        ├── indexeddb.ts
        ├── schema.ts
        ├── versioning.ts
        ├── cache-service.ts   # Updated with invalidation
        ├── cache-manager.ts
        └── stores/
            └── ...
```

### Verification Checklist
- [ ] Entity-specific invalidation implemented
- [ ] Full cache invalidation implemented
- [ ] Version-based invalidation implemented
- [ ] Selective record invalidation implemented
- [ ] Time-based invalidation implemented
- [ ] Server-triggered invalidation implemented
- [ ] Integrity check invalidation implemented
- [ ] Manual invalidation hook implemented
- [ ] Invalidation event system implemented
- [ ] Cascade invalidation rules implemented
- [ ] Invalidation logging implemented
- [ ] All invalidation reasons documented

---

## Summary

### Tasks Completed in This Document
| Task # | Task Name | Key Deliverable |
|--------|-----------|-----------------|
| 25 | Implement Data Versioning | `versioning.ts` - Version tracking service |
| 26 | Create Cache Population Service | `cache-service.ts` - Data sync service |
| 27 | Implement Incremental Sync | Enhanced cache service with incremental sync |
| 28 | Add Last Modified Tracking | Timestamp utilities and tracking |
| 29 | Create Cache Size Management | `cache-manager.ts` - Size monitoring and pruning |
| 30 | Implement Cache Invalidation | Invalidation mechanisms and triggers |

### Final Directory Structure
```
frontend/
└── lib/
    └── offline/
        ├── indexeddb.ts           # IndexedDB wrapper service
        ├── schema.ts              # Database schema definitions
        ├── versioning.ts          # Version tracking service
        ├── cache-service.ts       # Cache population and sync
        ├── cache-manager.ts       # Size management and pruning
        ├── utils.ts               # Timestamp utilities
        └── stores/
            ├── products.ts        # Products store service
            ├── categories.ts      # Categories store service
            ├── customers.ts       # Customers store service
            ├── settings.ts        # Settings store service
            └── transactions.ts    # Transactions store service
```

### Cache Management Features Summary

| Feature | Purpose | Key Methods |
|---------|---------|-------------|
| **Versioning** | Track data versions | getEntityVersion, setEntityVersion, isStale |
| **Cache Population** | Download and store data | syncProducts, syncCategories, syncAll |
| **Incremental Sync** | Sync only changes | Last-Modified checks, sync tokens |
| **Timestamp Tracking** | Detect modifications | getMostRecentUpdate, timestamp utilities |
| **Size Management** | Control storage usage | getCacheSize, pruning methods |
| **Invalidation** | Clear outdated data | invalidateEntity, invalidateAll |

### Sync Flow Summary
```
User Action (Login / Manual Sync)
    ↓
Check Entity Versions
    ↓
Determine Sync Strategy (Full vs Incremental)
    ↓
Fetch Data from Server (Batched)
    ↓
Store in IndexedDB (Bulk Operations)
    ↓
Update Version Metadata
    ↓
Check Cache Size Limits
    ↓
Prune if Necessary
    ↓
Sync Complete
```

### Group Completion Status
Tasks 25-30 complete. Cache versioning, population, sync, size management, and invalidation are fully implemented.

### Next Steps
Proceed to [03_Tasks-31-34_Service-Worker-Cache.md](03_Tasks-31-34_Service-Worker-Cache.md) to implement Service Worker for asset caching and background sync.

---

## Notes for AI Agents

1. **Execution Order:** Task 25 first, then 26, then 27-30 can be parallel
2. **No Code Generation:** These are instructions only; implementation is developer's responsibility
3. **Incremental Sync:** Critical for performance; reduces bandwidth significantly
4. **Version Tracking:** Essential for cache invalidation decisions
5. **Batch Size:** Balance between API performance and memory usage
6. **Error Handling:** Robust retry logic required for unstable networks
7. **Storage Quotas:** Monitor actively to prevent cache failures
8. **Timestamp Precision:** Use ISO 8601 format consistently
9. **Cascade Rules:** Understand entity relationships for invalidation
10. **Testing:** Test with poor network conditions and quota limits
