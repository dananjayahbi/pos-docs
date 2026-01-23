# Tasks 85-88: Unit & Integration Tests

> **Phase:** 05 - ERP Core Modules Part 2  
> **SubPhase:** 02 - POS Offline Mode  
> **Group:** F - Testing & Documentation  
> **Document:** 01 of 02  
> **Tasks Covered:** 85, 86, 87, 88

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Group:** [../Group-E_Frontend-Offline-Components/](../Group-E_Frontend-Offline-Components/)
- **→ Next Document:** [02_Tasks-89-90_Documentation.md](02_Tasks-89-90_Documentation.md)

---

## Document Overview

This document covers comprehensive testing of the offline mode functionality, including IndexedDB operations, transaction queue management, sync engine behavior, and end-to-end offline scenarios. These tests ensure reliability and data integrity in offline/online transitions.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 85 | Create IndexedDB Service Tests | High |
| 86 | Create Transaction Queue Tests | High |
| 87 | Create Sync Engine Tests | High |
| 88 | Create Offline Scenario Tests | High |

---

## Task 85: Create IndexedDB Service Tests

### Overview
Create comprehensive unit tests for the IndexedDB service covering database initialization, CRUD operations, index queries, versioning, cache management, and error handling.

### Dependencies
- Task 72: Create IndexedDB service
- Task 73: Create data cache manager

### Instructions

1. **Set up test environment**
   - Install fake-indexeddb package for testing
   - Configure Jest to use fake-indexeddb
   - Set up test database initialization
   - Create helper functions for test data generation

2. **Create database initialization tests**
   - Test database creation with correct name and version
   - Test all required object stores are created
   - Test all indexes are created correctly
   - Test version upgrade scenarios
   - Test initialization failure handling

3. **Create product CRUD operation tests**
   - Test add_product creates entry with correct structure
   - Test get_product retrieves correct product
   - Test update_product modifies existing entry
   - Test delete_product removes entry
   - Test operations with invalid data fail gracefully

4. **Create customer CRUD operation tests**
   - Test add_customer creates entry correctly
   - Test get_customer retrieves correct customer
   - Test update_customer modifies existing entry
   - Test delete_customer removes entry
   - Test duplicate customer handling

5. **Create index query tests**
   - Test get_product_by_barcode returns correct product
   - Test get_product_by_sku returns correct product
   - Test get_customer_by_phone finds customer
   - Test get_customer_by_email finds customer
   - Test queries with non-existent values return null

6. **Create batch operation tests**
   - Test bulk_add_products adds multiple products
   - Test bulk_add_customers adds multiple customers
   - Test batch operations maintain data integrity
   - Test partial failure handling in batch operations

7. **Create cache size limit tests**
   - Test cache enforces maximum product count
   - Test cache enforces maximum customer count
   - Test LRU (Least Recently Used) eviction strategy
   - Test cache size calculation accuracy

8. **Create cache invalidation tests**
   - Test clear_product_cache removes all products
   - Test clear_customer_cache removes all customers
   - Test clear_all_cache removes all data
   - Test selective cache clearing by criteria

9. **Create versioning and upgrade tests**
   - Test schema upgrade from version 1 to 2
   - Test data migration during upgrade
   - Test rollback on upgrade failure
   - Test version compatibility checking

10. **Create error handling tests**
    - Test quota exceeded error handling
    - Test database locked scenarios
    - Test corrupted data recovery
    - Test transaction abort handling

11. **Create search functionality tests**
    - Test product search by name (partial match)
    - Test customer search by name
    - Test search performance with large datasets
    - Test search with special characters

12. **Organize test file structure**
    - Group related tests in describe blocks
    - Use beforeEach for common setup
    - Use afterEach for cleanup
    - Add descriptive test names

### Test Structure

| Test Category | Purpose |
|---------------|---------|
| **Initialization** | Database setup and schema validation |
| **CRUD Operations** | Data manipulation correctness |
| **Index Queries** | Efficient data retrieval |
| **Batch Operations** | Bulk data handling |
| **Cache Limits** | Storage management |
| **Versioning** | Schema evolution |
| **Error Handling** | Resilience and recovery |

### Expected Test Coverage

| Component | Target Coverage |
|-----------|-----------------|
| IndexedDB Service | 90%+ |
| CRUD Operations | 100% |
| Index Queries | 95%+ |
| Error Paths | 85%+ |

### Expected Outcome
```
frontend/
├── __tests__/
│   └── offline/
│       └── indexeddb.test.ts    # IndexedDB service tests
└── __mocks__/
    └── offline/
        └── indexeddb.ts         # IndexedDB test utilities
```

### Verification Checklist
- [ ] Test file created in correct location
- [ ] fake-indexeddb configured properly
- [ ] All CRUD operations tested for products
- [ ] All CRUD operations tested for customers
- [ ] Index queries tested
- [ ] Batch operations tested
- [ ] Cache limits tested
- [ ] Versioning scenarios tested
- [ ] Error handling tested
- [ ] Test coverage meets targets
- [ ] All tests pass successfully
- [ ] No console warnings or errors

---

## Task 86: Create Transaction Queue Tests

### Overview
Create comprehensive tests for the transaction queue service covering queue operations, persistence, offline ID generation, retry logic, dependency tracking, and data export/import functionality.

### Dependencies
- Task 74: Create transaction queue service

### Instructions

1. **Set up test environment**
   - Configure test storage (localStorage mock or fake-indexeddb)
   - Create test transaction generators
   - Set up time mocking for timestamps
   - Create queue state verification helpers

2. **Create queue_transaction tests**
   - Test adding sale transaction to queue
   - Test adding customer creation to queue
   - Test adding inventory adjustment to queue
   - Test transaction includes all required fields
   - Test timestamp generation

3. **Create offline_id generation tests**
   - Test offline_id format (PREFIX_TIMESTAMP_RANDOM)
   - Test offline_id uniqueness (generate 1000+ IDs)
   - Test offline_id collision prevention
   - Test offline_id parsing and validation

4. **Create get_pending_transactions tests**
   - Test returns all pending transactions
   - Test filters by transaction type
   - Test returns transactions in correct order (FIFO)
   - Test excludes synced transactions
   - Test excludes failed transactions (unless specified)

5. **Create mark_as_synced tests**
   - Test updates transaction status to synced
   - Test stores server_id from response
   - Test updates synced_at timestamp
   - Test marks dependent transactions as ready
   - Test removes transaction from pending queue

6. **Create mark_as_failed tests**
   - Test updates transaction status to failed
   - Test stores error message
   - Test increments retry_count
   - Test calculates next_retry_at with exponential backoff
   - Test max retry limit enforcement

7. **Create retry mechanism tests**
   - Test get_transactions_ready_for_retry filters correctly
   - Test retry_count increments on each attempt
   - Test exponential backoff timing (1min, 2min, 4min, etc.)
   - Test max retry limit stops retries
   - Test manual retry resets retry_count

8. **Create queue persistence tests**
   - Test queue survives page refresh
   - Test queue survives browser restart (if using IndexedDB)
   - Test queue integrity after storage failure
   - Test queue restoration on app restart

9. **Create export functionality tests**
   - Test export_queue creates valid JSON
   - Test export includes all transaction data
   - Test export includes metadata (version, timestamp)
   - Test export file can be downloaded

10. **Create import functionality tests**
    - Test import_queue restores transactions
    - Test import validates JSON structure
    - Test import handles version mismatches
    - Test import merges with existing queue
    - Test import prevents duplicate offline_ids

11. **Create dependency tracking tests**
    - Test transaction with depends_on references
    - Test dependent transactions wait for parent
    - Test dependent transactions sync after parent
    - Test circular dependency detection
    - Test orphaned dependency handling

12. **Create cleanup operation tests**
    - Test cleanup_old_transactions removes synced transactions older than threshold
    - Test cleanup preserves recent transactions
    - Test cleanup preserves failed transactions
    - Test cleanup returns count of removed transactions

### Queue State Verification

| State | Conditions |
|-------|-----------|
| **Pending** | status = 'pending', synced_at = null |
| **Synced** | status = 'synced', synced_at != null, server_id != null |
| **Failed** | status = 'failed', retry_count > 0, error_message != null |
| **Ready for Retry** | status = 'failed', next_retry_at <= now, retry_count < max |

### Offline ID Format
```
SALE_1737674400000_a1b2c3d4
CUST_1737674401000_e5f6g7h8
INVADJ_1737674402000_i9j0k1l2

Format: {TYPE}_{TIMESTAMP}_{RANDOM}
```

### Expected Outcome
```
frontend/
├── __tests__/
│   └── offline/
│       └── queue.test.ts        # Transaction queue tests
```

### Verification Checklist
- [ ] Test file created in correct location
- [ ] Queue operations tested
- [ ] Offline ID generation tested for uniqueness
- [ ] Pending transactions retrieval tested
- [ ] Mark as synced tested
- [ ] Mark as failed tested
- [ ] Retry logic tested with exponential backoff
- [ ] Queue persistence tested
- [ ] Export functionality tested
- [ ] Import functionality tested
- [ ] Dependency tracking tested
- [ ] Cleanup operations tested
- [ ] Test coverage meets targets (90%+)
- [ ] All tests pass successfully

---

## Task 87: Create Sync Engine Tests

### Overview
Create comprehensive tests for the sync engine covering connection detection, sync flow orchestration, conflict resolution, batch optimization, error handling, and exponential backoff retry logic.

### Dependencies
- Task 75: Create sync engine
- Task 76: Create conflict resolver
- Task 77: Create offline/online transition handlers

### Instructions

1. **Set up test environment**
   - Install Mock Service Worker (MSW) for API mocking
   - Configure connection status mocking
   - Create sync state verification helpers
   - Set up test data generators

2. **Create connection detection tests**
   - Test detects online status correctly
   - Test detects offline status correctly
   - Test handles navigator.onLine state changes
   - Test validates connection with ping request
   - Test handles ping timeout as offline

3. **Create auto-sync trigger tests**
   - Test sync starts automatically on reconnection
   - Test sync does not start if already syncing
   - Test sync waits for connection validation
   - Test sync respects sync_interval setting
   - Test manual sync override

4. **Create sync lock mechanism tests**
   - Test prevents concurrent sync operations
   - Test releases lock on sync completion
   - Test releases lock on sync error
   - Test timeout-based lock release
   - Test lock status query

5. **Create push_transactions tests**
   - Test sends pending transactions to server
   - Test sends transactions in batches
   - Test includes offline_id for server reference
   - Test handles successful response with server_id
   - Test updates queue on successful sync
   - Test retains transaction on sync failure

6. **Create batch optimization tests**
   - Test groups multiple sales into one request
   - Test groups multiple customers into one request
   - Test respects max batch size limit
   - Test maintains transaction order within batch
   - Test separates different transaction types

7. **Create pull_updates tests**
   - Test fetches updates since last sync
   - Test uses last_sync_timestamp parameter
   - Test handles paginated responses
   - Test updates local cache with new data
   - Test merges remote changes with local data

8. **Create conflict detection tests**
   - Test detects version mismatch conflicts
   - Test detects concurrent modification conflicts
   - Test identifies field-level conflicts
   - Test generates conflict metadata

9. **Create conflict resolution tests**
   - Test server-wins strategy overwrites local
   - Test client-wins strategy retains local
   - Test merge strategy combines changes
   - Test manual resolution presents choices
   - Test resolution applies to local cache

10. **Create error handling tests**
    - Test handles network timeout
    - Test handles 500 server error
    - Test handles 401 authentication error
    - Test handles 409 conflict error
    - Test handles malformed response data

11. **Create exponential backoff tests**
    - Test first retry after 1 minute
    - Test second retry after 2 minutes
    - Test third retry after 4 minutes
    - Test backoff caps at maximum interval
    - Test successful sync resets backoff

12. **Create sync state management tests**
    - Test isSyncing flag updates correctly
    - Test lastSyncTime updates on success
    - Test pendingCount updates after sync
    - Test failedCount updates on errors
    - Test state persistence across sessions

### Sync Flow Diagram

```
┌──────────────┐
│ Connection   │
│ Detected     │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ Acquire      │
│ Sync Lock    │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ Push         │
│ Transactions │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ Pull         │
│ Updates      │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ Resolve      │
│ Conflicts    │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ Update       │
│ Cache        │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ Release      │
│ Lock         │
└──────────────┘
```

### Conflict Resolution Strategies

| Strategy | Behavior | Use Case |
|----------|----------|----------|
| **Server Wins** | Discard local, accept remote | Default for most fields |
| **Client Wins** | Keep local, reject remote | User preferences |
| **Merge** | Combine both changes | Non-conflicting fields |
| **Manual** | Prompt user to choose | Critical business data |

### Expected Test Coverage

| Component | Target Coverage |
|-----------|-----------------|
| Sync Engine | 90%+ |
| Connection Detection | 100% |
| Push Operations | 95%+ |
| Pull Operations | 95%+ |
| Conflict Resolution | 100% |
| Error Handling | 90%+ |

### Expected Outcome
```
frontend/
├── __tests__/
│   └── offline/
│       └── sync-engine.test.ts  # Sync engine tests
└── __mocks__/
    └── offline/
        └── sync-api.ts          # API mock handlers
```

### Verification Checklist
- [ ] Test file created in correct location
- [ ] MSW configured for API mocking
- [ ] Connection detection tested
- [ ] Auto-sync trigger tested
- [ ] Sync lock mechanism tested
- [ ] Push transactions tested
- [ ] Batch optimization tested
- [ ] Pull updates tested
- [ ] Conflict detection tested
- [ ] Conflict resolution strategies tested
- [ ] Error handling tested
- [ ] Exponential backoff tested
- [ ] Sync state management tested
- [ ] Test coverage meets targets
- [ ] All tests pass successfully

---

## Task 88: Create Offline Scenario Tests

### Overview
Create end-to-end integration tests simulating real-world offline scenarios including complete transaction flows, reconnection behavior, conflict resolution UI, and data consistency verification.

### Dependencies
- Task 85: Create IndexedDB service tests
- Task 86: Create transaction queue tests
- Task 87: Create sync engine tests
- Task 78-84: All frontend components

### Instructions

1. **Set up test environment**
   - Configure React Testing Library
   - Set up MSW for API mocking
   - Configure fake-indexeddb
   - Create test user session
   - Set up component rendering helpers

2. **Create offline transaction flow test**
   - Render POS terminal component
   - Simulate going offline
   - Add products to cart
   - Complete sale transaction
   - Verify transaction added to queue
   - Verify UI shows offline indicator
   - Verify transaction stored in IndexedDB

3. **Create reconnection and sync test**
   - Start with queued transactions
   - Simulate coming online
   - Verify sync automatically starts
   - Verify sync progress indicator appears
   - Verify transactions sent to server
   - Verify successful sync notification
   - Verify queue cleared after sync

4. **Create multiple transactions queue test**
   - Go offline
   - Create 5 different sale transactions
   - Create 2 customer records
   - Verify all transactions queued in order
   - Verify queue count displayed correctly
   - Come back online
   - Verify all transactions sync in order
   - Verify all transactions receive server IDs

5. **Create failed transaction retry test**
   - Queue transaction while offline
   - Come online
   - Mock server to return 500 error
   - Verify transaction marked as failed
   - Verify retry scheduled with backoff
   - Advance time to retry interval
   - Mock server to succeed
   - Verify transaction retried and synced

6. **Create conflict resolution UI test**
   - Create product with offline_id
   - Queue for sync
   - Mock server returns conflict (409)
   - Verify conflict dialog appears
   - Verify shows local and remote versions
   - Select conflict resolution option
   - Verify resolution applied
   - Verify conflict resolved

7. **Create data freshness after sync test**
   - Start with cached product data
   - Mock server has updated product
   - Trigger sync
   - Verify pull_updates fetches changes
   - Verify local cache updated
   - Verify UI reflects updated data

8. **Create offline search functionality test**
   - Populate IndexedDB with products
   - Go offline
   - Use search component
   - Verify search returns results from cache
   - Verify search performance acceptable
   - Verify "cached data" indicator shown

9. **Create offline customer creation test**
   - Go offline
   - Open customer creation form
   - Fill in customer details
   - Submit form
   - Verify customer saved with offline_id
   - Verify customer available for sale
   - Come online and sync
   - Verify customer synced to server
   - Verify customer receives server ID

10. **Create sync progress reporting test**
    - Queue 10 transactions
    - Come online to trigger sync
    - Verify progress bar appears
    - Verify progress updates (e.g., "Syncing 3/10")
    - Verify progress bar completes
    - Verify success message shown

11. **Create emergency export scenario test**
    - Create transactions while offline
    - Use export functionality
    - Verify export downloads JSON file
    - Verify JSON contains all transactions
    - Clear local storage
    - Import JSON file
    - Verify transactions restored

12. **Create data consistency verification test**
    - Perform complex offline operations
    - Create sale with new customer
    - Add products to inventory
    - Process multiple sales
    - Come online and sync
    - Verify all data consistent on server
    - Verify no data loss or corruption

### Offline Scenarios to Test

| Scenario | Test Focus |
|----------|------------|
| **Simple Sale** | Basic offline transaction |
| **Reconnection** | Automatic sync trigger |
| **Multiple Transactions** | Queue management |
| **Retry Logic** | Failed transaction recovery |
| **Conflicts** | UI conflict resolution |
| **Data Freshness** | Cache update after sync |
| **Search** | Offline search functionality |
| **Customer Creation** | Offline entity creation |
| **Progress Reporting** | UI feedback during sync |
| **Export/Import** | Data portability |
| **Consistency** | Data integrity verification |

### Test User Journey

```
1. User opens POS terminal (online)
2. Network disconnects (offline)
3. User completes 3 sales
4. Transactions queue locally
5. User creates 1 new customer
6. Network reconnects (online)
7. Sync automatically starts
8. Progress shows "Syncing 4/4"
9. All transactions sync successfully
10. UI shows success notification
11. Queue clears
12. User continues normal operation
```

### Expected Test Coverage

| Component | Target Coverage |
|-----------|-----------------|
| Offline Scenarios | 85%+ |
| User Flows | 90%+ |
| Error Scenarios | 80%+ |
| UI Feedback | 95%+ |

### Expected Outcome
```
frontend/
├── __tests__/
│   └── offline/
│       └── offline-scenarios.test.ts  # E2E offline tests
```

### Verification Checklist
- [ ] Test file created in correct location
- [ ] React Testing Library configured
- [ ] MSW API mocking configured
- [ ] Offline transaction flow tested
- [ ] Reconnection and sync tested
- [ ] Multiple transactions queue tested
- [ ] Failed transaction retry tested
- [ ] Conflict resolution UI tested
- [ ] Data freshness after sync tested
- [ ] Offline search tested
- [ ] Offline customer creation tested
- [ ] Sync progress reporting tested
- [ ] Export/import scenario tested
- [ ] Data consistency verified
- [ ] Test coverage meets targets
- [ ] All tests pass successfully

---

## Summary

### Tasks Completed in This Document
| Task # | Task Name | Key Deliverable |
|--------|-----------|-----------------|
| 85 | Create IndexedDB Service Tests | IndexedDB CRUD and cache tests |
| 86 | Create Transaction Queue Tests | Queue operations and retry tests |
| 87 | Create Sync Engine Tests | Sync flow and conflict resolution tests |
| 88 | Create Offline Scenario Tests | E2E offline scenario tests |

### Final Test Structure
```
frontend/
├── __tests__/
│   └── offline/
│       ├── indexeddb.test.ts           # Task 85
│       ├── queue.test.ts               # Task 86
│       ├── sync-engine.test.ts         # Task 87
│       └── offline-scenarios.test.ts   # Task 88
└── __mocks__/
    └── offline/
        ├── indexeddb.ts                # IndexedDB test utilities
        └── sync-api.ts                 # API mock handlers
```

### Overall Test Coverage Targets

| Layer | Target Coverage |
|-------|-----------------|
| Unit Tests | 90%+ |
| Integration Tests | 85%+ |
| E2E Scenarios | 80%+ |
| Critical Paths | 100% |

### Test Execution Strategy

1. **Unit Tests First** - Tasks 85-87 test individual components
2. **Integration Tests** - Task 88 tests complete flows
3. **Run in CI/CD** - All tests run on every commit
4. **Coverage Reports** - Generate and track coverage
5. **Performance Tests** - Monitor test execution time

### Next Steps
1. **Run all tests** with `npm test` or `yarn test`
2. **Generate coverage report** with `npm run test:coverage`
3. **Fix any failing tests** before proceeding
4. Proceed to [02_Tasks-89-90_Documentation.md](02_Tasks-89-90_Documentation.md) to create documentation

---

## Notes for AI Agents

1. **Execution Order:** Tasks 85-87 can be executed in parallel, Task 88 should run after 85-87
2. **Test Framework:** Use Jest with React Testing Library for frontend tests
3. **Mocking Strategy:** Use fake-indexeddb for IndexedDB, MSW for API calls
4. **No Implementation:** These are instructions only; test code generation is AI's responsibility
5. **Coverage Targets:** Aim for 90%+ coverage on unit tests, 85%+ on integration tests
6. **Test Data:** Generate realistic test data reflecting Sri Lankan business scenarios
7. **Performance:** Tests should run in under 30 seconds for entire suite
8. **CI/CD Integration:** Tests should be integrated into GitHub Actions workflow
