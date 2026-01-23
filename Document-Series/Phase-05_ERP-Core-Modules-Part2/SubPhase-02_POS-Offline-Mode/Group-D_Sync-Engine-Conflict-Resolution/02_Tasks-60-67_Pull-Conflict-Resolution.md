# Tasks 60-67: Pull Updates & Conflict Resolution

> **Phase:** 05 - ERP Core Modules Part 2  
> **SubPhase:** 02 - POS Offline Mode  
> **Group:** D - Sync Engine & Conflict Resolution  
> **Document:** 02 of 03  
> **Tasks Covered:** 60, 61, 62, 63, 64, 65, 66, 67

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-53-59_Sync-Engine-Push.md](01_Tasks-53-59_Sync-Engine-Push.md)
- **→ Next Document:** [03_Tasks-68-72_Progress-Errors-Analytics.md](03_Tasks-68-72_Progress-Errors-Analytics.md)

---

## Document Overview

This document covers pulling updates from the server and resolving conflicts between local offline changes and server data. These components handle efficient delta synchronization and implement multiple conflict resolution strategies.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 60 | Implement pull_updates method | High | 30 min |
| 61 | Add delta sync support | Medium | 25 min |
| 62 | Create conflict detection | High | 30 min |
| 63 | Implement server-wins resolution | Medium | 20 min |
| 64 | Implement merge resolution | High | 30 min |
| 65 | Implement manual resolution flag | Medium | 25 min |
| 66 | Create stock conflict handler | High | 30 min |
| 67 | Create price conflict handler | Medium | 25 min |

---

## Task 60: Implement Pull Updates Method

### Overview
Implement the method that pulls updates from the server and applies them to the local database. This downloads server-side changes that occurred while the terminal was offline or since the last sync.

### Dependencies
- Task 53: Create SyncEngine class
- Task 58: Implement push_transactions method

### Instructions

1. **Create pullUpdates method**
   - Method signature: `async pullUpdates(): Promise<SyncResult>`
   - Main method for downloading server updates
   - Return sync result with details

2. **Determine data to pull**
   - Products (new/updated/deleted)
   - Prices (changes since last sync)
   - Stock levels (current quantities)
   - Customers (new/updated)
   - Configuration settings
   - Promotions/discounts

3. **Prepare pull request**
   - GET to `/api/sync/pull-updates/`
   - Include last sync timestamp
   - Include terminal ID
   - Include entity types to sync

4. **Add authentication headers**
   - Include JWT token
   - Include terminal credentials
   - Handle token expiration

5. **Set request timeout**
   - Default timeout: 45 seconds
   - Longer than push (more data expected)
   - Handle timeout gracefully

6. **Process server response**
   - Parse JSON response
   - Validate response structure
   - Extract entity updates
   - Extract deletion records

7. **Apply updates to local database**
   - Open database transaction
   - Apply in correct order (referential integrity)
   - Update products first, then stock, then prices
   - Handle foreign key dependencies

8. **Handle entity updates**
   - INSERT new entities
   - UPDATE existing entities
   - DELETE removed entities
   - Track which were modified

9. **Handle entity deletions**
   - Soft delete if possible (mark as deleted)
   - Hard delete if required
   - Check for local references before deleting
   - Log deletion warnings

10. **Validate pulled data**
    - Check data integrity
    - Validate required fields
    - Verify foreign key references
    - Skip invalid records with logging

11. **Update sync metadata**
    - Store new sync timestamp
    - Store sync token for next pull
    - Update entity last modified times
    - Track sync statistics

12. **Handle pull errors**
    - Network errors: retry with backoff
    - Data validation errors: log and skip
    - Database errors: rollback transaction
    - Partial success: commit what's valid

### Pull Request Format

```
GET /api/sync/pull-updates/
Headers:
  Authorization: Bearer <token>
  X-Terminal-ID: TERM-12345
  If-Modified-Since: 2026-01-23T10:00:00Z
  X-Entity-Types: products,prices,stock,customers
```

### Server Response Format

```json
{
  "success": true,
  "sync_timestamp": "2026-01-23T14:35:00Z",
  "sync_token": "token-for-next-sync",
  "updates": {
    "products": {
      "created": [
        {
          "id": "prod-123",
          "name": "New Product",
          "modified_at": "2026-01-23T14:30:00Z"
        }
      ],
      "updated": [
        {
          "id": "prod-456",
          "name": "Updated Product",
          "modified_at": "2026-01-23T14:32:00Z"
        }
      ],
      "deleted": ["prod-789"]
    },
    "prices": { /* ... */ },
    "stock": { /* ... */ },
    "customers": { /* ... */ }
  },
  "metadata": {
    "total_updates": 45,
    "server_time": "2026-01-23T14:35:00Z"
  }
}
```

### Entity Update Priority

```
Order of Application:
1. Configuration settings (affects everything else)
2. Customers (no dependencies)
3. Products (referenced by stock, prices)
4. Categories (referenced by products)
5. Stock levels (depends on products)
6. Prices (depends on products)
7. Promotions (depends on products, customers)
```

### Update Application Flow

```
Start Pull
    ↓
Fetch Updates from Server
    ↓
Validate Response
    ↓
Begin Database Transaction
    ↓
Apply Creates
    ↓
Apply Updates
    ↓
Apply Deletes
    ↓
Commit Transaction
    ↓
Update Sync Metadata
    ↓
Emit Completed Event
```

### Entity Update Strategies

| Entity Type | Create | Update | Delete |
|-------------|--------|--------|--------|
| Products | Insert new | Update if not modified locally | Soft delete |
| Prices | Insert new | Check for conflicts | Mark as inactive |
| Stock | Insert new | Resolve conflicts | Remove record |
| Customers | Insert new | Merge changes | Soft delete |

### Error Handling

| Error Type | Action | Rollback? |
|------------|--------|-----------|
| Network timeout | Retry | N/A |
| Invalid JSON | Log + skip | No |
| Database constraint | Log + skip entity | No |
| Critical error | Abort | Yes |

### Expected Outcome
```
frontend/
└── lib/
    └── offline/
        └── sync-engine.ts           # Now includes pull method (Task 60)
```

### Verification Checklist
- [ ] pullUpdates method created
- [ ] Data types to pull determined
- [ ] Pull request prepared correctly
- [ ] Authentication headers included
- [ ] Request timeout configured
- [ ] Response processing implemented
- [ ] Database updates applied
- [ ] Entity updates handled
- [ ] Entity deletions handled
- [ ] Data validation implemented
- [ ] Sync metadata updated
- [ ] Error handling complete

---

## Task 61: Add Delta Sync Support

### Overview
Implement delta sync to only download changes since the last sync, rather than full dataset. This uses ETags and timestamps for efficient synchronization.

### Dependencies
- Task 60: Implement pull_updates method

### Instructions

1. **Store last sync timestamp**
   - Save timestamp after each successful sync
   - Store in local storage: `last_sync_timestamp`
   - Include in next pull request

2. **Implement ETag support**
   - Store ETags for each entity type
   - Send ETags in pull request headers
   - Compare returned ETags with stored

3. **Add If-Modified-Since header**
   - Use last sync timestamp
   - Format: RFC 7231 HTTP date format
   - Example: `If-Modified-Since: Thu, 23 Jan 2026 10:00:00 GMT`

4. **Handle 304 Not Modified response**
   - Server returns 304 if no changes
   - Skip update process
   - Update last check timestamp
   - Emit "no changes" event

5. **Implement sync token support**
   - Server provides continuation token
   - Use token for paginated sync
   - Store token for next request
   - Handle token expiration

6. **Add entity-level timestamps**
   - Track last modified time per entity
   - Request only entities modified after timestamp
   - Reduce unnecessary data transfer

7. **Create checksum validation**
   - Calculate checksum of local data
   - Send checksum to server
   - Server compares and returns delta
   - Detect data corruption

8. **Implement partial entity updates**
   - Only sync changed fields, not entire entity
   - Use JSON Patch format
   - Apply patches to local entities
   - Reduce bandwidth usage

9. **Add sync watermarks**
   - Track sync progress per entity type
   - Resume from watermark on interruption
   - Store watermarks persistently

10. **Handle clock skew**
    - Server and client clocks may differ
    - Use server-provided timestamps
    - Don't rely on client clock
    - Handle time zone differences

### Delta Sync Headers

```
Request Headers:
  If-Modified-Since: Thu, 23 Jan 2026 10:00:00 GMT
  If-None-Match: "etag-products-v123"
  X-Sync-Token: continuation-token-abc
  X-Entity-Checksums: products=abc123,prices=def456

Response Headers:
  Last-Modified: Thu, 23 Jan 2026 14:35:00 GMT
  ETag: "etag-products-v124"
  X-Sync-Token: continuation-token-xyz
  X-Has-More: false
```

### Server Response Scenarios

| Status Code | Meaning | Client Action |
|-------------|---------|---------------|
| 200 OK | Changes available | Apply updates |
| 304 Not Modified | No changes | Skip update |
| 206 Partial Content | More data available | Request next page |
| 410 Gone | Token expired | Full sync required |

### Sync Token Flow

```
First Sync:
  Client → Server (no token)
  Server → Client (token-1, data page 1)
  Client stores token-1

Second Sync:
  Client → Server (token-1)
  Server → Client (token-2, data page 2)
  Client stores token-2

Completion:
  Server → Client (no more data, X-Has-More: false)
```

### JSON Patch Format

```json
{
  "entity_type": "products",
  "entity_id": "prod-456",
  "patches": [
    {
      "op": "replace",
      "path": "/price",
      "value": 150.00
    },
    {
      "op": "replace",
      "path": "/modified_at",
      "value": "2026-01-23T14:30:00Z"
    }
  ]
}
```

### Entity Checksum Calculation

```typescript
// Calculate checksum for products
const calculateChecksum = (entities: Product[]): string => {
  const data = entities
    .sort((a, b) => a.id.localeCompare(b.id))
    .map(e => `${e.id}:${e.modified_at}`)
    .join('|');
  
  return sha256(data).substring(0, 16);
};
```

### Sync Watermark Storage

```typescript
interface SyncWatermarks {
  products: {
    lastSyncedId: string;
    lastSyncedTime: string;
  };
  prices: {
    lastSyncedId: string;
    lastSyncedTime: string;
  };
  // ... other entities
}
```

### Clock Skew Handling

```
Client Time: 2026-01-23 14:00:00 +05:30
Server Time: 2026-01-23 08:30:00 UTC
    ↓
Use Server Time for All Comparisons
    ↓
Store: "last_sync_server_time": "2026-01-23T08:30:00Z"
```

### Expected Outcome
```
frontend/
└── lib/
    └── offline/
        └── sync-engine.ts           # Now includes delta sync (Task 61)
```

### Verification Checklist
- [ ] Last sync timestamp stored
- [ ] ETag support implemented
- [ ] If-Modified-Since header added
- [ ] 304 Not Modified handled
- [ ] Sync token support added
- [ ] Entity-level timestamps tracked
- [ ] Checksum validation created
- [ ] Partial updates implemented
- [ ] Sync watermarks added
- [ ] Clock skew handled

---

## Task 62: Create Conflict Detection

### Overview
Implement conflict detection to identify when local offline changes conflict with server changes. Detect various types of conflicts and prepare them for resolution.

### Dependencies
- Task 60: Implement pull_updates method

### Instructions

1. **Create ConflictResolver class**
   - Create new file: `frontend/lib/offline/conflict-resolver.ts`
   - Class to handle all conflict detection and resolution
   - Include TypeScript interfaces

2. **Define conflict types**
   - UPDATE_CONFLICT - Same entity updated locally and on server
   - DELETE_CONFLICT - Entity deleted on server but updated locally
   - STOCK_CONFLICT - Stock level mismatch
   - PRICE_CONFLICT - Price changed on server
   - DATA_INTEGRITY - Referential integrity issues

3. **Create Conflict interface**
   - Entity type (product, price, stock, etc.)
   - Entity ID
   - Local version with timestamp
   - Server version with timestamp
   - Conflict type
   - Conflict detected at timestamp

4. **Implement conflict detection method**
   - Method: `detectConflicts(localData, serverData): Conflict[]`
   - Compare local and server versions
   - Return array of detected conflicts

5. **Compare entity timestamps**
   - Check local modified_at vs server modified_at
   - Conflict if both modified since last sync
   - No conflict if only one side modified

6. **Detect field-level conflicts**
   - Compare individual fields
   - Identify which fields conflict
   - Which fields can be auto-merged
   - Which require manual resolution

7. **Check for delete conflicts**
   - Entity deleted on server but modified locally
   - Entity deleted locally but modified on server
   - Flag for manual review

8. **Detect stock conflicts**
   - Local stock differs from server stock
   - Both changed since last sync
   - Account for pending transactions
   - Calculate expected vs actual stock

9. **Detect price conflicts**
   - Price changed on server while offline
   - Offline transactions used old price
   - Flag transactions for review
   - Calculate price difference impact

10. **Create conflict metadata**
    - Who made local change (user/terminal)
    - Who made server change (user/terminal)
    - Timestamps of both changes
    - Business impact assessment

11. **Prioritize conflicts**
    - CRITICAL - Data integrity issues
    - HIGH - Stock/price conflicts
    - MEDIUM - Entity update conflicts
    - LOW - Mergeable field conflicts

12. **Store detected conflicts**
    - Save conflicts to local database
    - Table: `sync_conflicts`
    - Status: DETECTED, RESOLVED, MANUAL
    - Allow later review

### Conflict Types Reference

| Conflict Type | Trigger Condition | Auto-Resolve? |
|---------------|-------------------|---------------|
| UPDATE_CONFLICT | Both sides updated same entity | Sometimes |
| DELETE_CONFLICT | One deleted, one updated | No |
| STOCK_CONFLICT | Stock levels diverged | Yes (with logic) |
| PRICE_CONFLICT | Price changed on server | Yes (server wins) |
| DATA_INTEGRITY | Missing foreign keys | No |

### Conflict Detection Logic

```
For each entity in server updates:
    ↓
Does entity exist locally?
    ↓ YES
Was it modified locally since last sync?
    ↓ YES
Compare timestamps
    ↓
Server modified after local last sync?
    ↓ YES
CONFLICT DETECTED
    ↓
Analyze conflict type
    ↓
Store for resolution
```

### Field-Level Conflict Analysis

```typescript
interface FieldConflict {
  field: string;
  localValue: any;
  serverValue: any;
  canAutoMerge: boolean;
  mergeStrategy?: string;
}

Example:
Product 'prod-123':
  - name: local="Red Shirt", server="Red T-Shirt" → UPDATE_CONFLICT
  - price: local=100, server=100 → NO CONFLICT
  - stock: local=45, server=48 → STOCK_CONFLICT
```

### Conflict Interface Definition

```typescript
interface Conflict {
  id: string;                    // Unique conflict ID
  type: ConflictType;            // UPDATE, DELETE, STOCK, PRICE
  entityType: string;            // products, prices, etc.
  entityId: string;              // Entity identifier
  localData: any;                // Local version
  serverData: any;               // Server version
  localModifiedAt: string;       // Local timestamp
  serverModifiedAt: string;      // Server timestamp
  detectedAt: string;            // When detected
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  status: 'DETECTED' | 'RESOLVED' | 'MANUAL';
  resolutionStrategy?: string;   // How to resolve
  resolvedAt?: string;           // When resolved
  resolvedBy?: string;           // Who/what resolved
}
```

### Stock Conflict Example

```
Scenario:
  Last Sync: Stock = 50
  Local Change: Sold 5 → Stock = 45
  Server Change: Sold 2 on another terminal → Stock = 48
  
Detection:
  Expected local: 50 - 5 = 45 ✓
  Server: 48 (someone else sold 2)
  Conflict: Local (45) ≠ Server (48)
  
Analysis:
  Local transactions: -5
  Server state: 48
  Resolution: 48 - 5 = 43 (apply local transactions to server state)
```

### Price Conflict Example

```
Scenario:
  Last Sync: Price = 100.00
  Local: Sold item at 100.00 (offline)
  Server: Price updated to 110.00
  
Detection:
  Local transaction used: 100.00
  Current server price: 110.00
  Conflict: Price changed during offline period
  
Analysis:
  Transaction already completed at old price
  Flag for review
  Adjust future pricing
```

### Conflict Priority Matrix

| Conflict Type | Data Loss Risk | Business Impact | Priority |
|---------------|----------------|-----------------|----------|
| DATA_INTEGRITY | High | High | CRITICAL |
| DELETE_CONFLICT | High | Medium | CRITICAL |
| STOCK_CONFLICT | Medium | High | HIGH |
| PRICE_CONFLICT | Low | High | HIGH |
| UPDATE_CONFLICT | Low | Medium | MEDIUM |

### Expected Outcome
```
frontend/
└── lib/
    └── offline/
        ├── sync-engine.ts
        └── conflict-resolver.ts     # Conflict detection (Task 62)
```

### Verification Checklist
- [ ] ConflictResolver class created
- [ ] Conflict types defined
- [ ] Conflict interface created
- [ ] Detection method implemented
- [ ] Timestamp comparison added
- [ ] Field-level detection implemented
- [ ] Delete conflict detection added
- [ ] Stock conflict detection added
- [ ] Price conflict detection added
- [ ] Conflict metadata created
- [ ] Conflict prioritization implemented
- [ ] Conflict storage added

---

## Task 63: Implement Server-Wins Resolution

### Overview
Implement the server-wins conflict resolution strategy where the server version always takes precedence over local changes. This is the simplest and safest resolution for most conflicts.

### Dependencies
- Task 62: Create conflict detection

### Instructions

1. **Create serverWinsResolution method**
   - Method: `resolveServerWins(conflict: Conflict): ResolutionResult`
   - Apply server version to local database
   - Discard local changes

2. **Override local entity**
   - Replace local entity with server version
   - Update all fields
   - Preserve local metadata if needed
   - Update modified timestamp

3. **Handle related entities**
   - Update entities that depend on resolved entity
   - Recalculate computed values
   - Update foreign key references

4. **Log discarded changes**
   - Record what local changes were lost
   - Include in conflict resolution log
   - Available for audit trail
   - Notify user if significant

5. **Update sync status**
   - Mark conflict as resolved
   - Update resolution timestamp
   - Record resolution strategy used
   - Store resolver (auto/manual)

6. **Handle transactions using old data**
   - Identify transactions that used conflicted data
   - Flag for review if necessary
   - Update transaction metadata
   - Calculate impact

7. **Emit resolution event**
   - Event: conflict:resolved
   - Include conflict details
   - Include resolution strategy
   - Allow UI to update

8. **Create resolution audit trail**
   - Store before/after snapshots
   - Record resolution reason
   - Track resolver identity
   - Enable rollback if needed

9. **Handle resolution errors**
   - Database errors during resolution
   - Invalid server data
   - Missing dependencies
   - Fallback to manual resolution

10. **Verify data integrity**
    - Check foreign key constraints
    - Validate data after resolution
    - Ensure consistency
    - Rollback if validation fails

### Server-Wins Use Cases

| Scenario | Local Change | Server Change | Resolution |
|----------|--------------|---------------|------------|
| Product name | "Red Shirt" | "Red T-Shirt" | Use "Red T-Shirt" |
| Product price | 100.00 | 110.00 | Use 110.00 |
| Stock level | 45 | 48 | Use 48 (then apply pending txs) |
| Product deleted | Updated locally | Deleted on server | Delete locally |

### Resolution Flow

```
Conflict Detected
    ↓
Server-Wins Strategy Selected
    ↓
Backup Local Version
    ↓
Replace with Server Version
    ↓
Update Dependencies
    ↓
Validate Data Integrity
    ↓
Mark Conflict Resolved
    ↓
Emit Resolution Event
    ↓
Log in Audit Trail
```

### Resolution Result Interface

```typescript
interface ResolutionResult {
  success: boolean;
  conflictId: string;
  strategy: 'SERVER_WINS' | 'MERGE' | 'MANUAL';
  resolvedAt: string;
  discardedLocalChanges: any;
  appliedServerChanges: any;
  affectedEntities: string[];
  requiresReview: boolean;
  errors?: string[];
}
```

### Transaction Impact Handling

```
Scenario: Price changed from 100 to 110
  
Find affected transactions:
  SELECT * FROM offline_transactions
  WHERE product_id = 'prod-123'
  AND status = 'PENDING'
  AND created_at > last_sync_time
  
For each transaction:
  - Flag: price_changed_after_creation = true
  - Old price: 100
  - New price: 110
  - Difference: +10
  - Action: Flag for manager review
```

### Audit Trail Format

```json
{
  "conflict_id": "conflict-001",
  "resolved_at": "2026-01-23T14:40:00Z",
  "strategy": "SERVER_WINS",
  "entity_type": "products",
  "entity_id": "prod-123",
  "before": {
    "name": "Red Shirt",
    "price": 100.00,
    "modified_at": "2026-01-23T12:00:00Z",
    "modified_by": "terminal-1"
  },
  "after": {
    "name": "Red T-Shirt",
    "price": 110.00,
    "modified_at": "2026-01-23T13:00:00Z",
    "modified_by": "admin-user"
  },
  "discarded_fields": ["name"],
  "impact": {
    "transactions_affected": 2,
    "requires_review": true
  }
}
```

### Resolution Priority

```
Server-Wins Applied To:
  1. Configuration changes (always)
  2. Price updates (usually)
  3. Product information (usually)
  4. Category changes (usually)
  5. Stock levels (with adjustment)
  
Not Applied To:
  1. Completed transactions (never overwrite)
  2. Customer data (prefer merge)
  3. User preferences (prefer local)
```

### Expected Outcome
```
frontend/
└── lib/
    └── offline/
        └── conflict-resolver.ts     # Now includes server-wins (Task 63)
```

### Verification Checklist
- [ ] serverWinsResolution method created
- [ ] Local entity override implemented
- [ ] Related entities handled
- [ ] Discarded changes logged
- [ ] Sync status updated
- [ ] Transaction handling added
- [ ] Resolution event emitted
- [ ] Audit trail created
- [ ] Error handling implemented
- [ ] Data integrity verification added

---

## Task 64: Implement Merge Resolution

### Overview
Implement intelligent merge resolution that combines non-conflicting changes from both local and server versions. This preserves as much data as possible from both sides.

### Dependencies
- Task 62: Create conflict detection
- Task 63: Implement server-wins resolution

### Instructions

1. **Create mergeResolution method**
   - Method: `resolveMerge(conflict: Conflict): ResolutionResult`
   - Merge non-conflicting fields
   - Identify conflicting fields for manual resolution

2. **Identify non-conflicting fields**
   - Compare each field independently
   - Field conflict if changed on both sides
   - No conflict if changed on one side only
   - No conflict if both have same value

3. **Merge non-conflicting changes**
   - Take local value if only local changed
   - Take server value if only server changed
   - Take either if both have same value

4. **Handle conflicting fields**
   - Apply field-specific resolution rules
   - Flag for manual resolution if can't auto-resolve
   - Use server value as default for conflicts

5. **Define field priority rules**
   - Some fields always prefer server (prices, status)
   - Some fields prefer local (notes, preferences)
   - Some fields can be combined (tags, arrays)

6. **Implement array field merging**
   - Merge array fields (tags, categories)
   - Remove duplicates
   - Preserve order where possible
   - Handle deleted items

7. **Handle timestamp fields**
   - Use most recent timestamp
   - Preserve both timestamps in metadata
   - Don't create timestamp conflicts

8. **Create merged entity**
   - Combine all resolved fields
   - Set merged_at timestamp
   - Mark as merged in metadata
   - Validate result

9. **Store merge metadata**
   - Record which fields came from where
   - Track manual resolutions needed
   - Enable explaining merge to user

10. **Handle partial merge failure**
    - Some fields merge successfully
    - Others fail validation
    - Fallback to server-wins for failed fields
    - Log all decisions

### Merge Strategy Matrix

| Field Type | Both Changed | Resolution |
|------------|--------------|------------|
| Price | Yes | Server wins |
| Stock | Yes | Calculate (special logic) |
| Name | Yes | Manual or server wins |
| Description | Yes | Manual or merge text |
| Tags | Yes | Union of both sets |
| Notes | Yes | Concatenate with separator |
| Image URL | Yes | Server wins |
| Status | Yes | Server wins |

### Merge Resolution Flow

```
Conflict Detected
    ↓
Merge Strategy Selected
    ↓
Compare Field by Field
    ↓
For Each Field:
    ↓
    Changed on Both? → YES → Apply Field Priority Rule
    ↓ NO                         ↓
    Changed Local? → YES → Use Local
    ↓ NO                         ↓
    Changed Server? → YES → Use Server
    ↓ NO
    No Change → Keep Current
    ↓
Validate Merged Entity
    ↓
Apply to Database
    ↓
Mark Resolved
```

### Field-Level Merge Example

```typescript
Local Product:
{
  id: 'prod-123',
  name: 'Red Shirt',          // Changed locally
  price: 100,                 // No change
  stock: 45,                  // Changed locally (-5)
  tags: ['shirt', 'red'],     // Added 'red'
  description: 'Original',    // No change
  modified_at: '2026-01-23T12:00:00Z'
}

Server Product:
{
  id: 'prod-123',
  name: 'Red Shirt',          // No change
  price: 110,                 // Changed on server
  stock: 48,                  // Changed on server (-2)
  tags: ['shirt', 'cotton'],  // Added 'cotton'
  description: 'Updated',     // Changed on server
  modified_at: '2026-01-23T13:00:00Z'
}

Merged Product:
{
  id: 'prod-123',
  name: 'Red Shirt',          // No conflict (same)
  price: 110,                 // Server wins (field priority)
  stock: 43,                  // Special logic: 48 - 5 = 43
  tags: ['shirt', 'red', 'cotton'],  // Union
  description: 'Updated',     // Server wins (field priority)
  modified_at: '2026-01-23T14:00:00Z',
  merged_at: '2026-01-23T14:00:00Z',
  merge_metadata: {
    strategy: 'MERGE',
    local_changes: ['name', 'stock', 'tags'],
    server_changes: ['price', 'stock', 'tags', 'description'],
    conflicts: ['stock'],
    resolutions: {
      stock: 'calculated',
      price: 'server_wins',
      tags: 'union'
    }
  }
}
```

### Array Field Merge Logic

```typescript
const mergeArrays = (localArray: string[], serverArray: string[], baseArray: string[]) => {
  const added = {
    local: localArray.filter(x => !baseArray.includes(x)),
    server: serverArray.filter(x => !baseArray.includes(x))
  };
  
  const removed = {
    local: baseArray.filter(x => !localArray.includes(x)),
    server: baseArray.filter(x => !serverArray.includes(x))
  };
  
  // Start with server array
  let merged = [...serverArray];
  
  // Add local additions not removed by server
  added.local.forEach(item => {
    if (!removed.server.includes(item)) {
      merged.push(item);
    }
  });
  
  // Remove items removed by local not added by server
  removed.local.forEach(item => {
    if (!added.server.includes(item)) {
      merged = merged.filter(x => x !== item);
    }
  });
  
  return [...new Set(merged)]; // Remove duplicates
};
```

### Text Field Merge

```
Scenario: Description field

Local: "Original description. Added local note."
Server: "Original description updated by admin."
Base (last sync): "Original description."

Strategy:
  1. Both modified
  2. No clear winner
  3. Options:
     a) Concatenate: "Original description updated by admin. Added local note."
     b) Server wins: "Original description updated by admin."
     c) Manual resolution required

Decision: Server wins (default), flag for review
```

### Merge Metadata Structure

```typescript
interface MergeMetadata {
  strategy: 'MERGE';
  mergedAt: string;
  localChangedFields: string[];
  serverChangedFields: string[];
  conflictingFields: string[];
  resolutions: {
    [field: string]: 'local' | 'server' | 'union' | 'calculated' | 'manual';
  };
  manualReviewRequired: boolean;
  confidenceScore: number;  // 0-100
}
```

### Expected Outcome
```
frontend/
└── lib/
    └── offline/
        └── conflict-resolver.ts     # Now includes merge resolution (Task 64)
```

### Verification Checklist
- [ ] mergeResolution method created
- [ ] Non-conflicting fields identified
- [ ] Non-conflicting changes merged
- [ ] Conflicting fields handled
- [ ] Field priority rules defined
- [ ] Array field merging implemented
- [ ] Timestamp handling added
- [ ] Merged entity created
- [ ] Merge metadata stored
- [ ] Partial merge failure handled

---

## Task 65: Implement Manual Resolution Flag

### Overview
Implement functionality to flag conflicts that cannot be automatically resolved and require manual intervention. Create a system for tracking and presenting these conflicts to users.

### Dependencies
- Task 62: Create conflict detection
- Task 64: Implement merge resolution

### Instructions

1. **Create manual resolution flag field**
   - Add to Conflict interface: `requiresManualResolution: boolean`
   - Default to false
   - Set to true when auto-resolution fails

2. **Define manual resolution criteria**
   - Critical data integrity issues
   - Business-significant conflicts
   - Ambiguous merge scenarios
   - User preference conflicts
   - Delete conflicts

3. **Flag conflicts during detection**
   - Mark DELETE conflicts as manual
   - Mark DATA_INTEGRITY conflicts as manual
   - Mark high-value transactions as manual
   - Mark ambiguous merges as manual

4. **Create manual resolution queue**
   - Table: `manual_resolution_queue`
   - Store conflicts requiring manual review
   - Priority ordering
   - Assignment to users/managers

5. **Implement resolution UI data**
   - Prepare data for UI presentation
   - Include before/after views
   - Suggest resolution options
   - Provide context for decision

6. **Add notification system**
   - Notify managers of manual resolutions
   - Email/SMS alerts for critical conflicts
   - Dashboard notifications
   - Summary reports

7. **Create resolution options**
   - Keep local version
   - Keep server version
   - Merge both (custom)
   - Reject and revert
   - Each with explanation

8. **Implement manual resolution API**
   - Endpoint for fetching pending resolutions
   - Endpoint for submitting resolution decision
   - Validate resolution choices
   - Apply resolution

9. **Track resolution status**
   - PENDING - awaiting review
   - ASSIGNED - assigned to user
   - IN_REVIEW - being reviewed
   - RESOLVED - decision made
   - ESCALATED - needs higher authority

10. **Create resolution timeout**
    - Auto-escalate if not resolved within timeframe
    - Default timeout: 24 hours
    - Reminder notifications
    - Automatic server-wins after timeout

11. **Add resolution history**
    - Track who resolved conflict
    - Record resolution decision
    - Timestamp resolution
    - Enable audit and analysis

12. **Implement resolution preview**
    - Show impact of each resolution option
    - Calculate financial impact
    - Show affected transactions
    - Help user make informed decision

### Manual Resolution Criteria

| Conflict Type | Auto-Resolve? | Manual If... |
|---------------|---------------|--------------|
| Price change with pending tx | Sometimes | Transaction value > $1000 |
| Stock conflict | Yes | Result would be negative |
| Delete conflict | No | Always manual |
| Data integrity | No | Always manual |
| Customer data | Sometimes | VIP customer |

### Manual Resolution Queue Schema

```typescript
interface ManualResolution {
  id: string;
  conflictId: string;
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  entityType: string;
  entityId: string;
  conflictType: string;
  localData: any;
  serverData: any;
  suggestedResolution: string;
  status: 'PENDING' | 'ASSIGNED' | 'IN_REVIEW' | 'RESOLVED' | 'ESCALATED';
  assignedTo?: string;
  createdAt: string;
  dueBy: string;
  resolvedAt?: string;
  resolvedBy?: string;
  resolution?: string;
  notes?: string;
}
```

### Resolution UI Data Format

```json
{
  "conflict_id": "conflict-001",
  "title": "Price Conflict: Red T-Shirt",
  "description": "Price changed on server while offline transactions were created",
  "priority": "HIGH",
  "impact": {
    "affected_transactions": 3,
    "total_value": 300.00,
    "potential_loss": 30.00
  },
  "options": [
    {
      "id": "keep_local",
      "label": "Honor offline price (100.00)",
      "impact": "Loss of 30.00 in revenue",
      "recommendation": false
    },
    {
      "id": "keep_server",
      "label": "Apply new price (110.00)",
      "impact": "Charge customers additional 30.00",
      "recommendation": true
    },
    {
      "id": "split_difference",
      "label": "Split difference (105.00)",
      "impact": "Loss of 15.00 in revenue",
      "recommendation": false
    }
  ],
  "context": {
    "local_version": { "price": 100.00, "modified_by": "cashier-1" },
    "server_version": { "price": 110.00, "modified_by": "admin" },
    "offline_transactions": [
      { "id": "tx-001", "amount": 100.00, "customer": "Customer A" }
    ]
  }
}
```

### Resolution Flow

```
Conflict Detected
    ↓
Can Auto-Resolve? → YES → Apply Auto-Resolution
    ↓ NO
Create Manual Resolution Record
    ↓
Add to Queue
    ↓
Notify Manager
    ↓
Manager Reviews
    ↓
Manager Selects Resolution
    ↓
Validate Selection
    ↓
Apply Resolution
    ↓
Update Records
    ↓
Notify Stakeholders
```

### Notification Rules

| Priority | Notify | Method | Timing |
|----------|--------|--------|--------|
| CRITICAL | Immediately | SMS + Email + Push | Real-time |
| HIGH | Within 1 hour | Email + Push | Batched |
| MEDIUM | Within 4 hours | Email | Batched |
| LOW | Daily summary | Email | End of day |

### Resolution Timeout Escalation

```
Created → 1 hour → Reminder to assignee
         ↓
      4 hours → Escalate to supervisor
         ↓
      24 hours → Auto-resolve (server-wins)
         ↓
      Log escalation and auto-resolution
```

### Expected Outcome
```
frontend/
└── lib/
    └── offline/
        └── conflict-resolver.ts     # Now includes manual flagging (Task 65)
```

### Verification Checklist
- [ ] Manual resolution flag field added
- [ ] Manual resolution criteria defined
- [ ] Conflicts flagged during detection
- [ ] Manual resolution queue created
- [ ] Resolution UI data prepared
- [ ] Notification system added
- [ ] Resolution options created
- [ ] Manual resolution API implemented
- [ ] Resolution status tracking added
- [ ] Resolution timeout created
- [ ] Resolution history added
- [ ] Resolution preview implemented

---

## Task 66: Create Stock Conflict Handler

### Overview
Create specialized handling for stock level conflicts. Stock conflicts are critical and require careful calculation to prevent overselling or incorrect inventory.

### Dependencies
- Task 62: Create conflict detection
- Task 64: Implement merge resolution

### Instructions

1. **Create stockConflictHandler method**
   - Method: `resolveStockConflict(conflict: Conflict): ResolutionResult`
   - Specialized logic for stock conflicts
   - Calculate correct stock level

2. **Gather stock movement data**
   - Fetch offline transactions affecting stock
   - Fetch server stock movements since last sync
   - Identify all stock changes from both sides

3. **Calculate expected local stock**
   - Start with last synced stock level
   - Apply all offline transactions
   - Result = expected local stock

4. **Analyze server stock**
   - Server current stock level
   - Difference from last synced level
   - Server stock movements

5. **Implement resolution formula**
   - Formula: `FinalStock = ServerStock - LocalTransactions`
   - Where LocalTransactions = sum of offline sales
   - Accounts for both server and local changes

6. **Handle negative stock result**
   - If calculated stock < 0, flag for review
   - Possible oversell scenario
   - Require manual intervention
   - Block further sales

7. **Validate stock calculation**
   - Check for reasonable values
   - Flag if stock delta too large
   - Verify against transaction history
   - Detect data corruption

8. **Apply stock reservation rules**
   - Check for reserved stock
   - Ensure reserved stock not oversold
   - Adjust available stock accordingly

9. **Handle multi-location stock**
   - If product in multiple locations
   - Resolve per-location conflicts
   - Aggregate total stock
   - Update location allocations

10. **Create stock audit trail**
    - Log all stock movements
    - Record resolution calculation
    - Enable reconciliation
    - Support inventory audit

11. **Emit stock update events**
    - Notify inventory management
    - Update UI displays
    - Trigger reorder if low stock
    - Alert if out of stock

12. **Handle variant stock**
    - If product has variants (size, color)
    - Resolve per-variant conflicts
    - Ensure variant integrity
    - Update parent product stock

### Stock Conflict Resolution Formula

```
Last Sync Stock: 50
Server Current: 48 (sold 2 on another terminal)
Local Offline: 45 (sold 5)

Calculation:
  Server Stock = 48
  Local Delta = 50 - 45 = -5 (sold 5)
  Final Stock = 48 + (-5) = 43

Verification:
  Starting: 50
  Server sold: 2 → 48
  Local sold: 5 → 43
  Result: 43 ✓
```

### Stock Conflict Scenarios

| Scenario | Last Sync | Server | Local | Resolution |
|----------|-----------|--------|-------|------------|
| Both sold | 50 | 48 (-2) | 45 (-5) | 43 |
| Local sold, server received | 50 | 60 (+10) | 45 (-5) | 55 |
| Server adjusted | 50 | 45 (adjusted) | 45 (-5) | Flag for review |
| Oversell | 5 | 3 (-2) | 0 (-5) | -2 → Flag |

### Stock Movement Analysis

```typescript
interface StockMovement {
  productId: string;
  type: 'SALE' | 'RETURN' | 'ADJUSTMENT' | 'RECEIVE' | 'TRANSFER';
  quantity: number;
  timestamp: string;
  source: 'local' | 'server';
  terminalId?: string;
}

const calculateStockDelta = (movements: StockMovement[]): number => {
  return movements.reduce((sum, movement) => {
    switch (movement.type) {
      case 'SALE':
      case 'TRANSFER_OUT':
        return sum - movement.quantity;
      case 'RETURN':
      case 'RECEIVE':
      case 'TRANSFER_IN':
        return sum + movement.quantity;
      case 'ADJUSTMENT':
        return sum + movement.quantity; // Can be positive or negative
      default:
        return sum;
    }
  }, 0);
};
```

### Negative Stock Handling

```
Calculated Stock: -2

Actions:
  1. Flag conflict as CRITICAL
  2. Require manual resolution
  3. Block further sales of product
  4. Notify inventory manager
  5. Suggest resolutions:
     a) Accept negative (backorder)
     b) Cancel some transactions
     c) Adjust server stock
  6. Log oversell incident
```

### Stock Reservation Logic

```
Product Stock: 50
Reserved Stock: 10 (for online orders)
Available Stock: 40

Offline sold: 5
New Available: 35

Server stock: 48 (someone added 8)
Resolution:
  Total Stock: 48 + 8 = 56
  Minus offline sales: 56 - 5 = 51
  Reserved: 10
  Available: 41
```

### Multi-Location Stock

```typescript
interface LocationStock {
  locationId: string;
  locationName: string;
  quantity: number;
  reserved: number;
  available: number;
}

// Resolve per location
locations.forEach(location => {
  const localDelta = getLocalDelta(productId, location.locationId);
  const serverStock = getServerStock(productId, location.locationId);
  location.quantity = serverStock + localDelta;
});

// Aggregate total
const totalStock = locations.reduce((sum, loc) => sum + loc.quantity, 0);
```

### Stock Audit Trail

```json
{
  "conflict_id": "conflict-stock-001",
  "product_id": "prod-123",
  "resolution_type": "STOCK_CONFLICT",
  "calculation": {
    "last_sync_stock": 50,
    "server_current": 48,
    "server_delta": -2,
    "local_current": 45,
    "local_delta": -5,
    "final_stock": 43,
    "formula": "48 + (-5) = 43"
  },
  "movements": [
    {
      "source": "server",
      "type": "SALE",
      "quantity": -2,
      "terminal": "TERM-002"
    },
    {
      "source": "local",
      "type": "SALE",
      "quantity": -5,
      "terminal": "TERM-001"
    }
  ],
  "validation": {
    "is_negative": false,
    "exceeds_threshold": false,
    "requires_review": false
  },
  "resolved_at": "2026-01-23T14:45:00Z"
}
```

### Expected Outcome
```
frontend/
└── lib/
    └── offline/
        └── conflict-resolver.ts     # Now includes stock handler (Task 66)
```

### Verification Checklist
- [ ] stockConflictHandler method created
- [ ] Stock movement data gathered
- [ ] Expected local stock calculated
- [ ] Server stock analyzed
- [ ] Resolution formula implemented
- [ ] Negative stock handling added
- [ ] Stock calculation validated
- [ ] Reservation rules applied
- [ ] Multi-location support added
- [ ] Stock audit trail created
- [ ] Stock update events emitted
- [ ] Variant stock handling added

---

## Task 67: Create Price Conflict Handler

### Overview
Create specialized handling for price conflicts when prices change on the server while offline transactions use the old price. This ensures appropriate handling of pricing discrepancies.

### Dependencies
- Task 62: Create conflict detection
- Task 65: Implement manual resolution flag

### Instructions

1. **Create priceConflictHandler method**
   - Method: `resolvePriceConflict(conflict: Conflict): ResolutionResult`
   - Handle price change scenarios
   - Determine impact on transactions

2. **Identify affected transactions**
   - Find offline transactions using old price
   - Filter by product and timeframe
   - Calculate number of transactions
   - Calculate total value affected

3. **Calculate price difference impact**
   - Old price vs new price
   - Per-transaction impact
   - Total financial impact
   - Percentage change

4. **Determine auto-resolution threshold**
   - Small changes (< 5%): auto-resolve
   - Medium changes (5-15%): flag for review
   - Large changes (> 15%): require manual resolution
   - Configurable thresholds

5. **Apply resolution strategy**
   - Minor changes: accept new price for future
   - Major changes: flag transactions for review
   - All cases: update product with server price

6. **Flag transactions for review**
   - Add flag: `price_changed_after_transaction`
   - Include old and new price
   - Calculate difference
   - Manager can approve/adjust

7. **Handle price decrease**
   - Price decreased: generally no issue
   - Customer paid more than current price
   - Log for analytics
   - No action typically needed

8. **Handle price increase**
   - Price increased: potential revenue loss
   - Customer paid less than current price
   - Calculate loss per transaction
   - Decide if adjustment needed

9. **Create price change notification**
   - Notify of price changes applied
   - Include affected transaction count
   - Show financial impact
   - Allow manager review

10. **Update pricing going forward**
    - Always use server price for new transactions
    - Update cached prices immediately
    - Clear old price from cache
    - Ensure consistency

11. **Log price conflict resolution**
    - Record old and new prices
    - Record affected transactions
    - Record decision made
    - Enable audit

12. **Handle special pricing rules**
    - Promotions that ended
    - Customer-specific pricing
    - Volume discounts
    - Preserve special rules where applicable

### Price Change Threshold Matrix

| Price Change | Threshold | Auto-Resolve? | Action |
|--------------|-----------|---------------|--------|
| Decrease any% | Any | Yes | Accept new price |
| Increase 0-5% | < $5 | Yes | Accept, log |
| Increase 5-15% | < $50 | No | Flag for review |
| Increase > 15% | Any | No | Manual resolution |
| Any | > $100 impact | No | Manual resolution |

### Price Conflict Resolution Flow

```
Price Conflict Detected
    ↓
Calculate Price Change %
    ↓
Find Affected Transactions
    ↓
Calculate Financial Impact
    ↓
Is Change Small? → YES → Auto-Resolve (Accept New Price)
    ↓ NO                      ↓
Is Impact Low? → YES → Flag for Review
    ↓ NO                      ↓
Require Manual Resolution
    ↓
Update Product Price
    ↓
Log Resolution
```

### Affected Transaction Analysis

```typescript
interface AffectedTransaction {
  id: string;
  productId: string;
  quantity: number;
  priceUsed: number;
  currentPrice: number;
  difference: number;
  totalDifference: number;
  createdAt: string;
  status: 'PENDING' | 'SYNCED' | 'FLAGGED';
}

const analyzeTransactions = (product, oldPrice, newPrice) => {
  const transactions = getOfflineTransactions(product.id);
  
  return transactions.map(tx => ({
    ...tx,
    priceUsed: oldPrice,
    currentPrice: newPrice,
    difference: newPrice - oldPrice,
    totalDifference: (newPrice - oldPrice) * tx.quantity,
    percentChange: ((newPrice - oldPrice) / oldPrice) * 100
  }));
};
```

### Price Conflict Example

```
Product: Red T-Shirt (prod-123)

Last Sync Price: 100.00
Server Price: 110.00 (increased by 10%)
Offline Transactions: 3 sales @ 100.00

Analysis:
  Price Change: +10.00 (+10%)
  Transactions Affected: 3
  Units Sold: 5
  Total Impact: 5 × 10.00 = 50.00
  
Resolution:
  Change % (10%) > Threshold (5%)
  Impact (50.00) < Review Threshold (100.00)
  Action: Flag for review
  
Applied:
  - Update product price to 110.00
  - Flag transactions with metadata
  - Notify manager
  - Manager can:
    a) Accept (take 50.00 loss)
    b) Adjust invoices (charge customers)
    c) Split difference
```

### Resolution Metadata

```typescript
interface PriceConflictMetadata {
  conflictId: string;
  productId: string;
  oldPrice: number;
  newPrice: number;
  priceChange: number;
  percentChange: number;
  affectedTransactions: {
    count: number;
    ids: string[];
    totalImpact: number;
  };
  resolutionStrategy: 'AUTO_ACCEPT' | 'FLAGGED' | 'MANUAL';
  managerDecision?: {
    decision: 'ACCEPT_LOSS' | 'ADJUST_INVOICES' | 'SPLIT' | 'OTHER';
    notes: string;
    decidedBy: string;
    decidedAt: string;
  };
}
```

### Transaction Flagging

```json
{
  "transaction_id": "offline-tx-001",
  "flags": {
    "price_changed_after_transaction": true,
    "price_conflict_metadata": {
      "price_at_sale": 100.00,
      "current_price": 110.00,
      "difference": 10.00,
      "conflict_id": "conflict-price-001",
      "requires_manager_review": true,
      "auto_approved": false
    }
  },
  "review_status": "PENDING_REVIEW"
}
```

### Special Pricing Handling

```
Scenario: Customer has special pricing agreement

Last Sync: Regular price 100, Customer price 90
Server: Regular price increased to 110
Offline: Sale at customer price 90

Resolution:
  1. Check if customer pricing still valid
  2. If valid, use customer price (90) - no conflict
  3. If expired, calculate with regular price
  4. If special price needs adjustment, flag for review
  
Customer pricing overrides regular price conflicts
```

### Promotion Handling

```
Scenario: Promotion ended during offline period

Last Sync: Promotional price 80 (regular 100)
Server: Promotion ended, price back to 100
Offline: Sales at promotional price 80

Resolution:
  1. Verify promotion end date
  2. Check transaction timestamps
  3. Transactions during promo: honor 80
  4. Transactions after promo: should be 100, flag
  5. Manager decides on late transactions
```

### Expected Outcome
```
frontend/
└── lib/
    └── offline/
        └── conflict-resolver.ts     # Now includes price handler (Task 67)
```

### Verification Checklist
- [ ] priceConflictHandler method created
- [ ] Affected transactions identified
- [ ] Price difference impact calculated
- [ ] Auto-resolution threshold determined
- [ ] Resolution strategy applied
- [ ] Transactions flagged for review
- [ ] Price decrease handling added
- [ ] Price increase handling added
- [ ] Price change notification created
- [ ] Forward pricing updated
- [ ] Conflict resolution logged
- [ ] Special pricing rules handled

---

## Summary

### Tasks Completed in This Document
| Task # | Task Name | Key Deliverable |
|--------|-----------|-----------------|
| 60 | Implement pull_updates method | Download and apply server updates |
| 61 | Add delta sync support | Efficient ETag/timestamp-based sync |
| 62 | Create conflict detection | Identify data conflicts |
| 63 | Implement server-wins resolution | Server precedence strategy |
| 64 | Implement merge resolution | Intelligent field merging |
| 65 | Implement manual resolution flag | Flag conflicts for human review |
| 66 | Create stock conflict handler | Specialized stock calculations |
| 67 | Create price conflict handler | Specialized price conflict handling |

### Files Created
```
frontend/
└── lib/
    └── offline/
        ├── sync-engine.ts          # Pull operations
        └── conflict-resolver.ts    # Conflict detection and resolution
```

### Key Concepts Implemented

#### Pull Operations
- Delta sync with ETags and timestamps
- Entity update prioritization
- Database transaction management
- Error handling and rollback

#### Conflict Resolution
- Multi-strategy resolution
- Field-level conflict analysis
- Automatic vs manual resolution
- Specialized domain handlers

#### Domain-Specific Handlers
- Stock calculation with transaction history
- Price change impact analysis
- Financial impact assessment
- Business rule enforcement

### Next Steps
Proceed to [03_Tasks-68-72_Progress-Errors-Analytics.md](03_Tasks-68-72_Progress-Errors-Analytics.md) to implement:
1. Sync progress tracking
2. Error handling and recovery
3. Exponential backoff
4. Completion callbacks
5. Sync analytics

---

## Notes for AI Agents

### Pull Operation Best Practices
1. **Transaction Management:** Always use database transactions for consistency
2. **Update Order:** Apply updates in dependency order (parents before children)
3. **Validation:** Validate all server data before applying
4. **Error Recovery:** Rollback on critical errors, log and skip on minor errors
5. **Performance:** Batch updates for efficiency

### Conflict Resolution Guidelines
1. **Prioritize Safety:** When in doubt, flag for manual resolution
2. **Business Rules:** Understand business impact of each decision
3. **Audit Trail:** Log all resolution decisions for accountability
4. **User Communication:** Provide clear explanations for all resolutions
5. **Reversibility:** Enable undoing resolutions when possible

### Stock Conflict Special Considerations
- Never allow negative stock without explicit approval
- Account for reservations and multi-location inventory
- Consider stock movements from both sides
- Validate against physical inventory when possible
- Enable emergency stock adjustments

### Price Conflict Business Impact
- Small price changes are usually acceptable
- Large changes or high-volume sales require review
- Consider customer satisfaction in decisions
- Honor valid promotions and special pricing
- Track revenue impact for reporting
