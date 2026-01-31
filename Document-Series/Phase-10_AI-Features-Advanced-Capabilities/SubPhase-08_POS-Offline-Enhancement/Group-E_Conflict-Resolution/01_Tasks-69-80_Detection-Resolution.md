# Tasks 69-80: Detection and Resolution

> **Phase:** 10 - AI Features & Advanced Capabilities  
> **SubPhase:** 08 - POS Offline Enhancement  
> **Group:** E - Conflict Resolution  
> **Document:** 01 of 01  
> **Tasks Covered:** 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Group:** [Group-D: Sync Queue - Task 68](../Group-D_Sync-Queue/02_Tasks-61-68_Retry-Webhook-Cleanup.md)
- **→ Next Group:** [Group-F: UI & Testing](../Group-F_UI-Testing/00_GROUP_OVERVIEW.md)

---

## Document Overview

This document covers the complete conflict resolution system for the POS offline enhancement. When data is modified both offline and online, conflicts can occur during synchronization. This system detects conflicts using version tracking and timestamps, categorizes them by type (stock, price, deleted, modified), and resolves them automatically using server-wins strategy or manually through user interaction. All conflicts are logged for audit purposes.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 69 | Create Conflict Detector | Medium | 60 min |
| 70 | Create Version Tracking | Low | 30 min |
| 71 | Create Timestamp Compare | Low | 25 min |
| 72 | Create Conflict Types | Low | 20 min |
| 73 | Create Stock Conflict | Medium | 45 min |
| 74 | Create Price Conflict | Low | 30 min |
| 75 | Create Auto Resolution | Medium | 55 min |
| 76 | Create Server Wins | Low | 25 min |
| 77 | Create Client Wins | Low | 25 min |
| 78 | Create Manual Resolution | Medium | 70 min |
| 79 | Create Conflict Log | Low | 40 min |
| 80 | Verify Conflicts | Low | 50 min |

---

## Task 69: Create Conflict Detector

### Overview
Create the ConflictDetector class that serves as the core conflict detection system. This class compares local and remote data to identify synchronization conflicts. The detector uses version numbers and timestamps to determine if data has diverged between client and server, returning conflict objects when discrepancies are found.

### Dependencies
- Task 68: Verify Sync Queue (from Group D)
- IndexedDB schema with version and timestamp fields
- Sync engine operational

### Instructions

1. **Create conflict resolver file structure**
   - Navigate to `frontend/lib/offline/` directory
   - Create new file `conflict-resolver.ts`
   - This file will contain all conflict detection and resolution logic

2. **Define conflict data interface**
   - Create `ConflictData` interface to represent conflicting records
   - Include fields: id, entity_type, local_data, remote_data, local_version, remote_version, local_timestamp, remote_timestamp
   - Add detected_at timestamp field
   - Include optional resolution field for tracking

3. **Create ConflictDetector class structure**
   - Export class named `ConflictDetector`
   - Initialize with constructor
   - Include private methods for detection logic
   - Prepare for version and timestamp comparison methods

4. **Implement main detection method**
   - Create public method `detectConflict(local: any, remote: any)`
   - Accept local record and remote record as parameters
   - Return `ConflictData | null` (null if no conflict)
   - Method should be the primary entry point

5. **Add basic conflict check logic**
   - Compare existence of both records
   - Check if IDs match
   - Verify entity types are the same
   - Return null if basic checks fail

6. **Implement version comparison check**
   - Check if version fields exist on both records
   - Compare local.version with remote.version
   - If versions match, no conflict exists
   - Prepare for version-based detection (completed in Task 70)

7. **Implement timestamp comparison check**
   - Check if updated_at or last_modified fields exist
   - Compare timestamps to determine which is newer
   - Use as fallback if version tracking unavailable
   - Prepare for timestamp-based detection (completed in Task 71)

8. **Build conflict data object**
   - Create ConflictData object when conflict detected
   - Populate all required fields from local and remote records
   - Set detected_at to current timestamp
   - Include full data snapshots for resolution

9. **Add entity type extraction**
   - Extract entity_type from records (product, sale, payment, etc.)
   - Use metadata or record structure to determine type
   - Include in conflict data for categorization
   - Support different entity structures

10. **Implement conflict detection logic flow**
    - First check: Version mismatch
    - Second check: Timestamp mismatch with same version
    - Third check: Data content mismatch
    - Return conflict if any check fails

### Conflict Detection Flow

```
┌─────────────────────────────────────┐
│    Local Record    Remote Record    │
│         │               │            │
│         └───────┬───────┘            │
│                 ▼                    │
│        ConflictDetector              │
│                 │                    │
│      ┌──────────┼──────────┐        │
│      ▼          ▼          ▼        │
│   Version   Timestamp   Content     │
│   Compare    Compare    Compare     │
│      │          │          │        │
│      └──────────┼──────────┘        │
│                 ▼                    │
│         Conflict Detected?          │
│           │           │              │
│          Yes         No              │
│           ▼           ▼              │
│    ConflictData     null             │
└─────────────────────────────────────┘
```

### Conflict Detection Criteria

| Condition | Result |
|-----------|--------|
| local.version ≠ remote.version | Conflict detected |
| local.version = remote.version AND timestamps differ | Potential conflict |
| Both updated, no version tracking | Timestamp-based detection |
| Data fields differ significantly | Content conflict |
| Remote deleted, local modified | Deletion conflict |

### ConflictData Structure

```
ConflictData
├── id: string
├── entity_type: 'product' | 'sale' | 'payment' | etc.
├── entity_id: string
├── local_data: object (full record)
├── remote_data: object (full record)
├── local_version: number
├── remote_version: number
├── local_timestamp: ISO string
├── remote_timestamp: ISO string
├── detected_at: ISO string
├── conflict_type: ConflictType (from Task 72)
└── resolution?: ResolutionResult
```

### Expected Outcome
- ConflictDetector class created and functional
- Detects conflicts based on version and timestamp
- Returns structured conflict data for resolution
- Handles different entity types
- Serves as foundation for resolution system

### Verification Checklist
- [ ] `frontend/lib/offline/conflict-resolver.ts` file exists
- [ ] ConflictDetector class exported
- [ ] ConflictData interface defined
- [ ] detectConflict method implemented
- [ ] Version comparison logic present
- [ ] Timestamp comparison logic present
- [ ] Returns null when no conflict
- [ ] Returns ConflictData when conflict detected
- [ ] Handles missing version/timestamp fields gracefully

---

## Task 70: Create Version Tracking

### Overview
Implement version tracking mechanism that assigns and increments version numbers for each record update. Version tracking provides a reliable way to detect conflicts by comparing version numbers between local and remote records. This system works in conjunction with optimistic locking to prevent lost updates.

### Dependencies
- Task 69: Create Conflict Detector

### Instructions

1. **Define version field structure**
   - Add `version` field to all syncable entities
   - Initialize version to 1 for new records
   - Type as number (integer, starting from 1)
   - Make field required for conflict detection

2. **Update entity interfaces**
   - Add version field to Product interface
   - Add version field to Sale interface
   - Add version field to Payment interface
   - Add to all other syncable entities

3. **Implement version initialization**
   - Set version = 1 when creating new records
   - Apply during IndexedDB insert operations
   - Include in offline creation logic
   - Ensure consistency across all entity types

4. **Create version increment logic**
   - Increment version on every update operation
   - Apply before saving to IndexedDB
   - Formula: new_version = old_version + 1
   - Maintain atomic operation

5. **Add version to IndexedDB schema**
   - Include version field in object store definitions
   - Index version field for query performance
   - Update schema version if needed
   - Run migration for existing records

6. **Implement version increment function**
   - Create helper function `incrementVersion(record)`
   - Extract current version
   - Increment by 1
   - Return updated record
   - Handle missing version field

7. **Integrate with save operations**
   - Call incrementVersion before all updates
   - Apply in offline save handlers
   - Include in sync queue item creation
   - Maintain version continuity

8. **Add version to sync payload**
   - Include version in sync queue items
   - Send version to server during sync
   - Receive server version in response
   - Use for conflict detection

9. **Implement optimistic locking**
   - Send current version with update requests
   - Server validates version matches
   - Return conflict if version mismatch
   - Trigger conflict resolution flow

10. **Handle version conflicts**
    - Compare local version with remote version
    - If local.version < remote.version: server updated first
    - If local.version > remote.version: impossible (logic error)
    - If local.version = remote.version: no conflict
    - Feed comparison result to ConflictDetector

### Version Lifecycle

```
┌──────────────────────────────────────────┐
│           Record Creation                │
│              version = 1                 │
└─────────────┬────────────────────────────┘
              │
              ▼
┌──────────────────────────────────────────┐
│          First Update                    │
│       version = 1 → 2                    │
└─────────────┬────────────────────────────┘
              │
              ▼
┌──────────────────────────────────────────┐
│          Second Update                   │
│       version = 2 → 3                    │
└─────────────┬────────────────────────────┘
              │
              ▼
┌──────────────────────────────────────────┐
│      Offline: version = 3 → 4           │
│      Online:  version = 3 → 4           │
│      (Both increment from same base)    │
└─────────────┬────────────────────────────┘
              │
              ▼
┌──────────────────────────────────────────┐
│        Sync Attempt                      │
│    local.version = 4                     │
│    remote.version = 4                    │
│    → CONFLICT DETECTED                   │
└──────────────────────────────────────────┘
```

### Version Comparison Logic

| Local Version | Remote Version | Interpretation |
|---------------|----------------|----------------|
| 3 | 5 | Server updated twice while offline |
| 5 | 5 | Both updated once from v4 - conflict |
| 4 | 4 | Both updated from v3 - conflict |
| 6 | 4 | Local updated more (shouldn't happen) |
| 1 | 1 | No updates on either side |

### Version Increment Example

| Operation | Version Before | Version After | Action |
|-----------|----------------|---------------|--------|
| Create Product | - | 1 | Initialize |
| Update Price | 1 | 2 | Increment |
| Update Stock | 2 | 3 | Increment |
| Go Offline | 3 | 3 | No change |
| Update Price (Offline) | 3 | 4 | Increment |
| Server Update (Online) | 3 | 4 | Increment |
| Sync Attempt | 4 (local) | 4 (remote) | Conflict! |

### Expected Outcome
- Version field added to all syncable entities
- Automatic version increment on updates
- Version comparison in conflict detection
- Optimistic locking implemented
- Foundation for reliable conflict detection

### Verification Checklist
- [ ] Version field added to entity interfaces
- [ ] New records initialized with version = 1
- [ ] Version increments on every update
- [ ] Version included in IndexedDB schema
- [ ] Version sent with sync operations
- [ ] Version comparison works in ConflictDetector
- [ ] Optimistic locking prevents lost updates
- [ ] Version field indexed for performance

---

## Task 71: Create Timestamp Compare

### Overview
Implement timestamp-based conflict detection as a fallback mechanism when version tracking is unavailable or as a supplementary check. Timestamps provide temporal ordering information that helps determine which record was modified most recently, useful for breaking ties and providing context for conflict resolution.

### Dependencies
- Task 70: Create Version Tracking

### Instructions

1. **Define timestamp field requirements**
   - Use `updated_at` field for last modification time
   - Use `created_at` field for creation time
   - Format as ISO 8601 string (e.g., "2026-01-31T14:30:00.000Z")
   - Store in UTC timezone

2. **Update entity interfaces for timestamps**
   - Add updated_at field to all syncable entities
   - Add created_at field to all syncable entities
   - Make both fields required
   - Type as string (ISO format)

3. **Implement timestamp initialization**
   - Set created_at = new Date().toISOString() on creation
   - Set updated_at = new Date().toISOString() on creation
   - Apply in IndexedDB insert operations
   - Ensure consistency across all entity types

4. **Create timestamp update logic**
   - Update updated_at on every record modification
   - Set to current timestamp: new Date().toISOString()
   - Apply before saving to IndexedDB
   - Do not modify created_at after creation

5. **Implement timestamp comparison function**
   - Create helper function `compareTimestamps(ts1: string, ts2: string)`
   - Parse ISO strings to Date objects
   - Return -1 if ts1 < ts2, 0 if equal, 1 if ts1 > ts2
   - Handle invalid timestamp formats

6. **Add timestamp comparison to ConflictDetector**
   - Enhance detectConflict method
   - Compare local.updated_at with remote.updated_at
   - Use as secondary check after version comparison
   - Provide temporal context for conflict

7. **Implement conflict detection with timestamps**
   - If versions equal but timestamps differ: conflict
   - If versions differ AND timestamps differ: confirm conflict
   - Timestamp provides ordering information
   - Helps determine which change is newer

8. **Create timestamp difference calculator**
   - Calculate time difference between timestamps
   - Express in seconds, minutes, or hours
   - Use for conflict priority assessment
   - Show age of conflict to user

9. **Handle timestamp edge cases**
   - Clock skew between client and server
   - Different timezone offsets (mitigated by UTC)
   - Missing timestamp fields
   - Invalid timestamp formats
   - Fallback to version-only comparison

10. **Integrate with conflict data**
    - Include both timestamps in ConflictData
    - Add time_difference field
    - Include timezone information if relevant
    - Use for conflict resolution decisions

### Timestamp Comparison Flow

```
┌───────────────────────────────────────┐
│   Local Record    Remote Record       │
│   updated_at      updated_at          │
│      │               │                │
│      └───────┬───────┘                │
│              ▼                        │
│    compareTimestamps()                │
│              │                        │
│      ┌───────┼───────┐               │
│      ▼       ▼       ▼               │
│   ts1 <   ts1 =   ts1 >               │
│    ts2     ts2      ts2               │
│      │       │       │                │
│  Local   Equal   Remote               │
│  Older          Older                 │
│      │       │       │                │
│      └───────┼───────┘                │
│              ▼                        │
│      Conflict Context                 │
└───────────────────────────────────────┘
```

### Timestamp Conflict Scenarios

| Local Timestamp | Remote Timestamp | Time Diff | Interpretation |
|-----------------|------------------|-----------|----------------|
| 2026-01-31T10:00:00Z | 2026-01-31T10:30:00Z | -30 min | Remote is newer |
| 2026-01-31T11:00:00Z | 2026-01-31T10:30:00Z | +30 min | Local is newer |
| 2026-01-31T10:00:00Z | 2026-01-31T10:00:00Z | 0 min | Same time (rare) |
| 2026-01-30T14:00:00Z | 2026-01-31T14:00:00Z | -24 hrs | Remote much newer |

### Combined Version and Timestamp Detection

| Scenario | Local Ver | Remote Ver | Local TS | Remote TS | Conflict? |
|----------|-----------|------------|----------|-----------|-----------|
| 1 | 4 | 4 | 10:00 | 10:30 | Yes (same ver, diff time) |
| 2 | 3 | 5 | 10:00 | 11:00 | Yes (diff ver, remote newer) |
| 3 | 5 | 5 | 10:30 | 10:30 | No (same ver, same time) |
| 4 | 4 | 4 | 10:00 | 10:00 | Possible (investigate content) |

### Timestamp Format Requirements

```
Format:      ISO 8601
Example:     2026-01-31T14:30:00.000Z
Components:
├── 2026        Year
├── 01          Month (01-12)
├── 31          Day (01-31)
├── T           Separator
├── 14          Hour (00-23, 24-hour format)
├── 30          Minute (00-59)
├── 00.000      Seconds and milliseconds
└── Z           UTC timezone
```

### Expected Outcome
- Timestamp fields added to all entities
- Automatic timestamp updates on modifications
- Timestamp comparison in conflict detection
- Combined version and timestamp checking
- Temporal context for conflict resolution

### Verification Checklist
- [ ] created_at field added to entity interfaces
- [ ] updated_at field added to entity interfaces
- [ ] New records initialized with current timestamp
- [ ] updated_at updates on every modification
- [ ] Timestamps in ISO 8601 format
- [ ] Timestamps stored in UTC
- [ ] compareTimestamps function implemented
- [ ] Timestamp comparison integrated in ConflictDetector
- [ ] Time difference calculated correctly
- [ ] Edge cases handled (clock skew, missing fields)

---

## Task 72: Create Conflict Types

### Overview
Define a comprehensive enumeration of conflict types to categorize different kinds of synchronization conflicts. This classification system enables specific handling strategies for different conflict scenarios, making the resolution process more intelligent and context-aware. Conflict types guide both automatic and manual resolution logic.

### Dependencies
- Task 71: Create Timestamp Compare

### Instructions

1. **Create ConflictType enumeration**
   - Define enum or union type named `ConflictType`
   - Include all possible conflict categories
   - Use SCREAMING_SNAKE_CASE for enum values
   - Make it exhaustive for all scenarios

2. **Define STOCK conflict type**
   - Type: `STOCK`
   - Represents inventory quantity conflicts
   - Occurs when stock changed both offline and online
   - Critical for inventory accuracy

3. **Define PRICE conflict type**
   - Type: `PRICE`
   - Represents price change conflicts
   - Occurs when price updated while offline sale in progress
   - Impacts sale transactions

4. **Define DELETED conflict type**
   - Type: `DELETED`
   - Represents deletion conflicts
   - Occurs when record deleted on server but modified locally
   - Or deleted locally but modified on server
   - Requires special handling

5. **Define MODIFIED conflict type**
   - Type: `MODIFIED`
   - General modification conflict
   - Any field changed on both sides
   - Default category for unclassified conflicts

6. **Define CREATED conflict type**
   - Type: `CREATED`
   - Duplicate creation conflict
   - Same entity created offline and online
   - May involve temporary ID conflicts

7. **Add conflict type determination logic**
   - Create function `determineConflictType(local, remote)`
   - Analyze which fields differ
   - Check for deletion flags
   - Return appropriate ConflictType

8. **Implement type-specific detection**
   - Check stock field: if differs → STOCK
   - Check price field: if differs → PRICE
   - Check deleted flag: if set → DELETED
   - Otherwise: MODIFIED
   - Handle multiple field changes

9. **Add conflict type to ConflictData**
   - Include conflict_type field in ConflictData interface
   - Set during conflict detection
   - Use for routing to appropriate resolver
   - Include in conflict logs

10. **Document conflict type characteristics**
    - Define severity level for each type
    - Specify default resolution strategy
    - Note which types allow auto-resolution
    - Identify types requiring manual resolution

### Conflict Type Enumeration

```
enum ConflictType {
  STOCK = 'STOCK',
  PRICE = 'PRICE',
  DELETED = 'DELETED',
  MODIFIED = 'MODIFIED',
  CREATED = 'CREATED'
}
```

### Conflict Type Characteristics

| Type | Severity | Auto-Resolve? | Default Strategy |
|------|----------|---------------|------------------|
| STOCK | High | Yes | Server Wins |
| PRICE | Medium | Partial | Log + Accept Sale |
| DELETED | High | No | Manual Required |
| MODIFIED | Low | Yes | Server Wins |
| CREATED | Medium | No | Manual/Merge |

### Conflict Type Detection Logic

```
┌────────────────────────────────────┐
│    Analyze Field Differences       │
└────────────┬───────────────────────┘
             │
    ┌────────┼────────┐
    ▼        ▼        ▼
┌────────┐ ┌──────┐ ┌──────────┐
│ Stock  │ │Price │ │Deleted   │
│Changed?│ │Chg?  │ │Flag Set? │
└───┬────┘ └──┬───┘ └────┬─────┘
    │ Yes     │ Yes      │ Yes
    ▼         ▼          ▼
┌────────┐ ┌──────┐ ┌──────────┐
│ STOCK  │ │PRICE │ │ DELETED  │
└────────┘ └──────┘ └──────────┘
    │         │          │
    └─────────┼──────────┘
              │ No specific type
              ▼
        ┌──────────┐
        │ MODIFIED │
        └──────────┘
```

### Conflict Type Examples

#### STOCK Conflict
```
Scenario: Product sold offline while stock updated online
Local:  stock = 7 (sold 3 from original 10)
Remote: stock = 12 (restocked +2)
Type:   STOCK
Impact: Inventory discrepancy
```

#### PRICE Conflict
```
Scenario: Price changed online during offline sale
Local:  price = Rs. 100 (sale at old price)
Remote: price = Rs. 120 (price increase)
Type:   PRICE
Impact: Sale at outdated price
```

#### DELETED Conflict
```
Scenario: Product deleted online but sold offline
Local:  status = active, sold 1 unit
Remote: deleted = true
Type:   DELETED
Impact: Sale of non-existent product
```

#### MODIFIED Conflict
```
Scenario: Description updated on both sides
Local:  description = "Updated description A"
Remote: description = "Updated description B"
Type:   MODIFIED
Impact: Content merge needed
```

### Multi-Field Conflict Handling

| Changed Fields | Primary Type | Secondary Type | Resolution |
|----------------|--------------|----------------|------------|
| stock + price | STOCK | PRICE | Handle stock first |
| price + description | PRICE | MODIFIED | Price takes priority |
| stock + deleted | DELETED | STOCK | Deletion takes priority |
| Multiple non-critical | MODIFIED | - | Standard resolution |

### Expected Outcome
- ConflictType enum defined with all categories
- Type determination logic implemented
- Each conflict categorized during detection
- Type guides resolution strategy selection
- Foundation for type-specific handlers

### Verification Checklist
- [ ] ConflictType enum created with all types
- [ ] STOCK type defined
- [ ] PRICE type defined
- [ ] DELETED type defined
- [ ] MODIFIED type defined
- [ ] CREATED type defined
- [ ] determineConflictType function implemented
- [ ] Conflict type added to ConflictData
- [ ] Type detection logic handles all scenarios
- [ ] Multiple field changes handled correctly

---

## Task 73: Create Stock Conflict

### Overview
Implement specialized handling for stock (inventory) conflicts, which are critical for business operations. Stock conflicts occur when inventory quantities are modified both offline and online, leading to discrepancies that must be resolved to maintain accurate inventory levels. This task creates detection and resolution logic specifically for stock-related conflicts.

### Dependencies
- Task 72: Create Conflict Types

### Instructions

1. **Create stock conflict detector function**
   - Create function `detectStockConflict(local, remote)`
   - Check if entity is a product or inventory item
   - Compare stock quantity fields
   - Return boolean indicating stock conflict

2. **Define stock field identification**
   - Identify stock-related fields: stock, quantity, inventory_count
   - Support different field names across entities
   - Handle nested stock data structures
   - Account for variant-specific stock

3. **Implement stock difference calculation**
   - Calculate local_stock - remote_stock
   - Calculate expected vs actual stock
   - Determine magnitude of discrepancy
   - Track stock movement direction (increase/decrease)

4. **Create stock conflict data structure**
   - Extend ConflictData with stock-specific fields
   - Include: expected_stock, actual_stock, difference
   - Add stock_movement_local and stock_movement_remote
   - Track sales, purchases, adjustments

5. **Implement offline stock tracking**
   - Track all stock changes made offline
   - Record sales reducing stock
   - Record returns increasing stock
   - Maintain transaction log for reconciliation

6. **Implement online stock tracking**
   - Fetch remote stock changes during sync
   - Identify restocks, sales, adjustments
   - Compare with local expectations
   - Detect divergence points

7. **Create stock conflict scenario analysis**
   - Scenario 1: Both sold units (different quantities)
   - Scenario 2: Local sold, remote restocked
   - Scenario 3: Local restocked, remote sold
   - Scenario 4: Both restocked (different quantities)
   - Categorize scenario for appropriate resolution

8. **Implement stock reconciliation logic**
   - Calculate base stock (last sync value)
   - Apply local changes: base + local_delta
   - Apply remote changes: base + remote_delta
   - Identify conflict: local_result ≠ remote_result

9. **Add critical stock threshold checking**
   - Check if conflict causes negative stock
   - Check if conflict exceeds maximum stock
   - Flag critical conflicts for immediate attention
   - Escalate to manual resolution if critical

10. **Integrate with auto-resolution**
    - Default strategy: Server Wins for stock
    - Server stock is source of truth
    - Log local stock change for audit
    - Update local to match server

### Stock Conflict Scenarios

```
Scenario 1: Offline Sale vs Online Sale
┌─────────────────────────────────────┐
│ Initial Stock: 10                   │
├─────────────────────────────────────┤
│ Offline: Sold 3 → 7                │
│ Online:  Sold 2 → 8                │
├─────────────────────────────────────┤
│ Expected Outcome: 5 (10 - 3 - 2)   │
│ Conflict: Local=7, Remote=8        │
│ Resolution: Merge (use 5) or       │
│             Server Wins (use 8)     │
└─────────────────────────────────────┘

Scenario 2: Offline Sale vs Online Restock
┌─────────────────────────────────────┐
│ Initial Stock: 10                   │
├─────────────────────────────────────┤
│ Offline: Sold 3 → 7                │
│ Online:  Restocked +5 → 15          │
├─────────────────────────────────────┤
│ Expected Outcome: 12 (15 - 3)      │
│ Conflict: Local=7, Remote=15       │
│ Resolution: Apply offline sale to   │
│             online stock            │
└─────────────────────────────────────┘
```

### Stock Conflict Detection Logic

| Base Stock | Local Change | Remote Change | Local Result | Remote Result | Conflict? |
|------------|--------------|---------------|--------------|---------------|-----------|
| 10 | -3 | -2 | 7 | 8 | Yes |
| 10 | +5 | +3 | 15 | 13 | Yes |
| 10 | -3 | +5 | 7 | 15 | Yes |
| 10 | -5 | -5 | 5 | 5 | No |
| 10 | 0 | -2 | 10 | 8 | No |

### Stock Conflict Data Structure

```
StockConflict extends ConflictData {
  conflict_type: 'STOCK',
  entity_type: 'product',
  
  stock_data: {
    base_stock: number,
    local_stock: number,
    remote_stock: number,
    expected_stock: number,
    difference: number,
    
    local_movement: {
      sales: number,
      returns: number,
      adjustments: number,
      net_change: number
    },
    
    remote_movement: {
      sales: number,
      restocks: number,
      adjustments: number,
      net_change: number
    },
    
    severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  }
}
```

### Stock Conflict Severity Levels

| Difference | Severity | Action |
|------------|----------|--------|
| ≤ 2 units | LOW | Auto-resolve |
| 3-5 units | MEDIUM | Log warning, auto-resolve |
| 6-10 units | HIGH | Log alert, consider manual |
| > 10 units | CRITICAL | Require manual review |
| Negative result | CRITICAL | Immediate attention |

### Stock Reconciliation Example

```
Step 1: Establish Base
  Last Synced Stock: 20 units
  
Step 2: Apply Local Changes
  - Sold 5 units offline
  - Returned 1 unit offline
  Local Stock: 20 - 5 + 1 = 16 units
  
Step 3: Check Remote Changes
  - Sold 3 units online
  - Restocked 10 units online
  Remote Stock: 20 - 3 + 10 = 27 units
  
Step 4: Detect Conflict
  Local (16) ≠ Remote (27)
  Difference: 11 units
  Severity: CRITICAL (> 10)
  
Step 5: Resolution
  Strategy: Manual Review Required
  Reason: Large discrepancy
  Action: Present to user for decision
```

### Expected Outcome
- Stock conflicts detected accurately
- Stock discrepancies calculated correctly
- Severity assessed appropriately
- Critical conflicts flagged for manual review
- Integration with auto-resolution strategy

### Verification Checklist
- [ ] detectStockConflict function implemented
- [ ] Stock field identification works for all entities
- [ ] Stock difference calculation accurate
- [ ] StockConflict data structure defined
- [ ] Offline stock tracking implemented
- [ ] Online stock comparison implemented
- [ ] Conflict scenarios categorized correctly
- [ ] Stock reconciliation logic works
- [ ] Critical thresholds enforced
- [ ] Integration with auto-resolution complete

---

## Task 74: Create Price Conflict

### Overview
Implement detection and handling for price conflicts that occur when product prices change on the server while offline sales are being made at the old price. Price conflicts are less critical than stock conflicts but still require proper handling to maintain accurate financial records and ensure business rules are followed.

### Dependencies
- Task 72: Create Conflict Types

### Instructions

1. **Create price conflict detector function**
   - Create function `detectPriceConflict(local, remote)`
   - Check if entity has price fields
   - Compare price values
   - Return boolean indicating price conflict

2. **Define price field identification**
   - Identify price-related fields: price, unit_price, sale_price, cost
   - Support multiple currency representations
   - Handle decimal precision
   - Account for tax-inclusive vs exclusive prices

3. **Implement price difference calculation**
   - Calculate price_difference = remote_price - local_price
   - Calculate percentage change
   - Determine price increase or decrease
   - Flag significant price changes

4. **Create price conflict data structure**
   - Extend ConflictData with price-specific fields
   - Include: old_price, new_price, difference, percentage_change
   - Add transaction_count (sales at old price)
   - Track revenue impact

5. **Implement offline sale price tracking**
   - Record price used for each offline sale
   - Track number of transactions at old price
   - Calculate total revenue at old price
   - Store for reconciliation

6. **Detect price conflict scenarios**
   - Scenario 1: Price increased while offline
   - Scenario 2: Price decreased while offline
   - Scenario 3: Sale price activated/deactivated
   - Scenario 4: Promotional pricing changed

7. **Calculate financial impact**
   - Calculate revenue difference (expected vs actual)
   - Determine if business lost or gained revenue
   - Calculate per-transaction impact
   - Total impact across all affected sales

8. **Implement price conflict policy**
   - Policy: Accept offline sales at old price
   - Rationale: Sale already completed
   - Log price discrepancy for accounting
   - Update price for future transactions

9. **Create price audit trail**
   - Record old price and new price
   - Log when price changed on server
   - Record when conflict detected
   - Track which sales affected

10. **Integrate with auto-resolution**
    - Strategy: Accept offline sales, update price
    - Log financial impact for reconciliation
    - Update local price to match server
    - Flag for accounting review if impact significant

### Price Conflict Scenarios

```
Scenario 1: Price Increase During Offline Sales
┌─────────────────────────────────────────┐
│ Timeline                                │
├─────────────────────────────────────────┤
│ 10:00 AM - Go Offline                  │
│            Price: Rs. 100               │
│                                         │
│ 10:15 AM - Sell 3 units (Offline)     │
│            @ Rs. 100 each               │
│                                         │
│ 10:30 AM - Online: Price → Rs. 120    │
│            (Manager increased price)    │
│                                         │
│ 11:00 AM - Come Online (Sync)         │
│            Conflict Detected:           │
│            Local: Rs. 100               │
│            Remote: Rs. 120              │
│            Sales: 3 @ Rs. 100          │
│                                         │
│ Resolution:                             │
│   - Accept 3 sales @ Rs. 100           │
│   - Revenue Impact: -Rs. 60            │
│   - Update price to Rs. 120            │
│   - Log for accounting review          │
└─────────────────────────────────────────┘
```

### Price Conflict Detection Logic

| Old Price | New Price | Change | % Change | Impact |
|-----------|-----------|--------|----------|--------|
| Rs. 100 | Rs. 120 | +Rs. 20 | +20% | Lost revenue |
| Rs. 100 | Rs. 80 | -Rs. 20 | -20% | Gained revenue |
| Rs. 500 | Rs. 550 | +Rs. 50 | +10% | Lost revenue |
| Rs. 1000 | Rs. 900 | -Rs. 100 | -10% | Gained revenue |

### Price Conflict Data Structure

```
PriceConflict extends ConflictData {
  conflict_type: 'PRICE',
  entity_type: 'product',
  
  price_data: {
    old_price: number,
    new_price: number,
    price_difference: number,
    percentage_change: number,
    change_direction: 'INCREASE' | 'DECREASE',
    
    affected_sales: {
      count: number,
      transactions: string[], // Sale IDs
      total_revenue_old_price: number,
      total_revenue_new_price: number,
      revenue_impact: number
    },
    
    severity: 'LOW' | 'MEDIUM' | 'HIGH',
    requires_accounting_review: boolean
  }
}
```

### Revenue Impact Calculation

```
Example: Price Increased from Rs. 100 to Rs. 120
  Offline Sales: 5 units @ Rs. 100
  
  Revenue at Old Price: 5 × Rs. 100 = Rs. 500
  Revenue at New Price: 5 × Rs. 120 = Rs. 600
  Revenue Impact: Rs. 500 - Rs. 600 = -Rs. 100
  
  Interpretation: Business lost Rs. 100 in potential revenue
  
  Decision: Accept sales at Rs. 100 (already completed)
  Action: Log Rs. 100 discrepancy for accounting
  Update: Set price to Rs. 120 for future sales
```

### Price Conflict Severity Assessment

| % Change | Units Sold | Severity | Accounting Review? |
|----------|------------|----------|--------------------|
| ≤ 5% | Any | LOW | No |
| 6-15% | ≤ 10 | MEDIUM | Optional |
| 6-15% | > 10 | HIGH | Yes |
| > 15% | Any | HIGH | Yes |

### Price Conflict Resolution Policy

```
┌─────────────────────────────────────┐
│      Price Conflict Detected        │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│   Were sales made at old price?    │
├────────────┬────────────────────────┤
│    Yes     │         No             │
▼            ▼                        │
┌─────────────────────────────────────┤
│ Accept Sales│ Update Price          │
│ Log Impact  │ No Impact             │
│ Update Price│                       │
└─────────────┴───────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│  Check Revenue Impact Threshold     │
├────────────┬────────────────────────┤
│   High     │         Low            │
▼            ▼                        │
┌─────────────────────────────────────┤
│ Flag for   │ Auto-Log              │
│ Accounting │ Continue              │
│ Review     │                       │
└────────────┴────────────────────────┘
```

### Expected Outcome
- Price conflicts detected accurately
- Financial impact calculated correctly
- Offline sales accepted at old price
- Price discrepancies logged for accounting
- Local price updated to match server
- Audit trail maintained

### Verification Checklist
- [ ] detectPriceConflict function implemented
- [ ] Price field identification works
- [ ] Price difference calculation accurate
- [ ] PriceConflict data structure defined
- [ ] Offline sale price tracking implemented
- [ ] Financial impact calculation works
- [ ] Revenue impact calculated correctly
- [ ] Price conflict policy implemented
- [ ] Audit trail created
- [ ] Integration with auto-resolution complete
- [ ] Accounting review flagging works

---

## Task 75: Create Auto Resolution

### Overview
Implement the automatic conflict resolution system that applies predefined rules to resolve conflicts without user intervention. Auto-resolution handles common conflict scenarios using business logic and established policies, reducing manual work and ensuring consistent resolution outcomes. The system uses conflict type to determine the appropriate resolution strategy.

### Dependencies
- Task 74: Create Price Conflict

### Instructions

1. **Create AutoResolver class**
   - Export class named `AutoResolver`
   - Initialize with resolution policies
   - Include methods for each conflict type
   - Provide fallback resolution strategy

2. **Define resolution strategy interface**
   - Create `ResolutionStrategy` type
   - Include: SERVER_WINS, CLIENT_WINS, MERGE, MANUAL
   - Define when each strategy applies
   - Document strategy selection logic

3. **Implement canAutoResolve method**
   - Create method `canAutoResolve(conflict: ConflictData)`
   - Check conflict type
   - Check conflict severity
   - Return boolean indicating if auto-resolvable

4. **Create resolution rules configuration**
   - Define rules for each conflict type
   - STOCK → Server Wins
   - PRICE → Accept client sales, update price
   - MODIFIED → Server Wins
   - DELETED → Manual (cannot auto-resolve)
   - CREATED → Manual (cannot auto-resolve)

5. **Implement main auto-resolve method**
   - Create method `resolve(conflict: ConflictData)`
   - Check if auto-resolvable
   - Route to appropriate resolver based on type
   - Return resolution result
   - Handle errors gracefully

6. **Create resolution result structure**
   - Define `ResolutionResult` interface
   - Include: strategy, resolved_data, success, message
   - Add timestamp and resolution_method
   - Include any warnings or notes

7. **Implement stock auto-resolution**
   - Apply SERVER_WINS strategy
   - Update local stock to match remote
   - Log stock adjustment
   - Return resolution result

8. **Implement price auto-resolution**
   - Accept completed offline sales
   - Update local price to match remote
   - Log revenue impact
   - Flag for accounting if needed
   - Return resolution result

9. **Implement modified auto-resolution**
   - Apply SERVER_WINS strategy for general modifications
   - Merge non-conflicting fields if possible
   - Update local record to match remote
   - Return resolution result

10. **Add resolution logging**
    - Log every auto-resolution attempt
    - Record strategy used
    - Include before and after states
    - Track success/failure rate
    - Generate audit trail

### Auto-Resolution Decision Tree

```
┌────────────────────────────────┐
│    Conflict Detected           │
└──────────────┬─────────────────┘
               │
               ▼
┌────────────────────────────────┐
│  Determine Conflict Type       │
└──────┬─────────────────────────┘
       │
  ┌────┼─────┬─────┬─────┬──────┐
  ▼    ▼     ▼     ▼     ▼      ▼
STOCK PRICE MOD  DEL  CREATE   ?
  │    │     │     │     │      │
  │    │     │     │     │      │
  │    │     │     └─────┴──────┘
  │    │     │           │
  │    │     │      MANUAL ONLY
  │    │     │
  │    │     └─── SERVER_WINS
  │    │
  │    └───── ACCEPT_SALES +
  │            UPDATE_PRICE
  │
  └────────── SERVER_WINS
```

### Auto-Resolution Strategy Matrix

| Conflict Type | Can Auto-Resolve? | Strategy | Reason |
|---------------|-------------------|----------|--------|
| STOCK | Yes | SERVER_WINS | Server is source of truth |
| PRICE | Yes | ACCEPT + UPDATE | Sales completed, update going forward |
| MODIFIED | Yes | SERVER_WINS | Server has latest approved changes |
| DELETED | No | MANUAL | Requires user decision |
| CREATED | No | MANUAL | Requires deduplication logic |

### Auto-Resolution Rules

| Rule # | Condition | Action | Strategy |
|--------|-----------|--------|----------|
| 1 | Type = STOCK | Use remote.stock | SERVER_WINS |
| 2 | Type = PRICE | Keep sales, update price | ACCEPT + UPDATE |
| 3 | Type = MODIFIED, severity LOW | Use remote data | SERVER_WINS |
| 4 | Type = MODIFIED, severity HIGH | Escalate to manual | MANUAL |
| 5 | Type = DELETED | Always manual | MANUAL |
| 6 | Type = CREATED | Always manual | MANUAL |
| 7 | Unknown type | Escalate to manual | MANUAL |

### Resolution Result Structure

```
ResolutionResult {
  success: boolean,
  strategy: ResolutionStrategy,
  resolution_method: 'AUTO' | 'MANUAL',
  
  resolved_data: object, // Final merged/selected data
  
  changes_applied: {
    fields_changed: string[],
    old_values: Record<string, any>,
    new_values: Record<string, any>
  },
  
  metadata: {
    resolved_at: ISO timestamp,
    conflict_type: ConflictType,
    severity: string,
    requires_review: boolean
  },
  
  logs: string[],
  warnings: string[],
  notes: string[]
}
```

### Auto-Resolution Example Flow

```
Example: Stock Conflict Auto-Resolution

Input Conflict:
  Type: STOCK
  Local: { id: 'P123', stock: 7, version: 4 }
  Remote: { id: 'P123', stock: 12, version: 4 }

Step 1: Check if auto-resolvable
  canAutoResolve(conflict) → true
  Reason: STOCK conflicts can be auto-resolved

Step 2: Select strategy
  Strategy: SERVER_WINS
  Reason: Server stock is source of truth

Step 3: Apply resolution
  Action: Update local.stock = remote.stock
  Result: { id: 'P123', stock: 12, version: 5 }

Step 4: Create resolution result
  Success: true
  Strategy: SERVER_WINS
  Changes: stock (7 → 12)
  Logs: ["Stock updated from 7 to 12", "Server value used"]

Step 5: Return result
  Return resolution result to caller
  Log resolution for audit
```

### Expected Outcome
- AutoResolver class implemented
- Auto-resolution rules configured
- Conflict types routed to appropriate strategies
- Resolution results structured and logged
- Audit trail maintained
- Fallback to manual resolution when needed

### Verification Checklist
- [ ] AutoResolver class created
- [ ] ResolutionStrategy types defined
- [ ] canAutoResolve method implemented
- [ ] Resolution rules configured for each type
- [ ] Main resolve method implemented
- [ ] ResolutionResult structure defined
- [ ] Stock auto-resolution works
- [ ] Price auto-resolution works
- [ ] Modified auto-resolution works
- [ ] Resolution logging implemented
- [ ] Audit trail created
- [ ] Fallback to manual resolution works

---

## Task 76: Create Server Wins

### Overview
Implement the SERVER_WINS resolution strategy that unconditionally adopts the server's version of data as the authoritative source. This strategy is the safest and most commonly used for conflict resolution, ensuring consistency by treating the server as the single source of truth. It's particularly appropriate for stock conflicts and general data modifications.

### Dependencies
- Task 75: Create Auto Resolution

### Instructions

1. **Create serverWinsResolver function**
   - Create function `resolveServerWins(conflict: ConflictData)`
   - Accept conflict data as parameter
   - Return ResolutionResult
   - Implement as pure function for testability

2. **Extract remote data**
   - Get remote_data from conflict object
   - Validate remote data structure
   - Ensure all required fields present
   - Handle missing or null values

3. **Discard local changes**
   - Identify which fields were modified locally
   - Log all discarded changes for audit
   - Preserve change history for reference
   - Note conflicts in logs

4. **Apply server data to local store**
   - Update IndexedDB record with remote data
   - Overwrite all conflicting fields
   - Maintain local-only metadata (if any)
   - Update version and timestamp

5. **Handle version increment**
   - Do not increment version (accept server's version)
   - Update local.version = remote.version
   - Ensure version consistency
   - Prevent future conflicts on same record

6. **Update timestamp**
   - Set local.updated_at = remote.updated_at
   - Maintain server's timestamp
   - Ensure chronological consistency
   - Sync temporal metadata

7. **Create change log entry**
   - Document what was overwritten
   - Record old local values
   - Record new server values
   - Include reason for server wins

8. **Generate resolution result**
   - Set success = true
   - Set strategy = SERVER_WINS
   - Set resolved_data = remote_data
   - Include change details
   - Add audit information

9. **Handle special fields**
   - Preserve local-only computed fields
   - Keep UI state that doesn't sync
   - Maintain local timestamps for analytics
   - Exclude sync metadata from overwrite

10. **Integrate with auto-resolver**
    - Export as strategy function
    - Register with AutoResolver
    - Use for STOCK conflicts
    - Use for MODIFIED conflicts
    - Use as default strategy

### Server Wins Strategy Flow

```
┌────────────────────────────────────┐
│      Conflict Detected             │
│   Strategy: SERVER_WINS            │
└──────────────┬─────────────────────┘
               │
               ▼
┌────────────────────────────────────┐
│  Extract Remote Data               │
│  { ...remote fields }              │
└──────────────┬─────────────────────┘
               │
               ▼
┌────────────────────────────────────┐
│  Log Local Changes Being Discarded │
│  - field1: old → new (discarded)   │
│  - field2: old → new (discarded)   │
└──────────────┬─────────────────────┘
               │
               ▼
┌────────────────────────────────────┐
│  Update IndexedDB                  │
│  localRecord = remoteData          │
└──────────────┬─────────────────────┘
               │
               ▼
┌────────────────────────────────────┐
│  Generate Resolution Result        │
│  success: true                     │
│  strategy: SERVER_WINS             │
└────────────────────────────────────┘
```

### Server Wins Application Examples

#### Example 1: Stock Conflict
```
Conflict:
  Type: STOCK
  Local:  { id: 'P123', stock: 7, version: 4, updated_at: '2026-01-31T10:00:00Z' }
  Remote: { id: 'P123', stock: 12, version: 4, updated_at: '2026-01-31T10:30:00Z' }

Server Wins Resolution:
  Discard: local.stock = 7
  Apply:   local.stock = 12
  Result:  { id: 'P123', stock: 12, version: 4, updated_at: '2026-01-31T10:30:00Z' }
  
  Log: "Stock conflict resolved using SERVER_WINS: 7 → 12"
```

#### Example 2: Modified Conflict
```
Conflict:
  Type: MODIFIED
  Local:  { id: 'P456', description: 'Updated desc A', version: 3 }
  Remote: { id: 'P456', description: 'Updated desc B', version: 3 }

Server Wins Resolution:
  Discard: local.description = 'Updated desc A'
  Apply:   local.description = 'Updated desc B'
  Result:  { id: 'P456', description: 'Updated desc B', version: 3 }
  
  Log: "Description conflict resolved using SERVER_WINS"
  Note: "Local description 'Updated desc A' discarded"
```

### Server Wins Advantages and Trade-offs

| Aspect | Advantage | Trade-off |
|--------|-----------|-----------|
| Simplicity | Easy to implement and understand | May lose valid local changes |
| Consistency | Ensures server is single source of truth | Local work may be discarded |
| Safety | Prevents data corruption | User frustration if local work lost |
| Performance | Fast resolution, no merging needed | No attempt to preserve local changes |
| Reliability | Always succeeds (no merge conflicts) | One-sided resolution |

### Server Wins Use Cases

| Scenario | Appropriate? | Reason |
|----------|--------------|--------|
| Stock update conflict | Yes | Server has authoritative inventory count |
| Price change conflict | Partial | Accept sales, then server wins on price |
| Product description update | Yes | Server likely has approved content |
| Customer data update | Yes | Server has most recent verified data |
| Offline sale transaction | No | Client wins - sale already completed |
| Configuration change | Yes | Server has administrator-approved settings |

### Resolution Result for Server Wins

```
ResolutionResult {
  success: true,
  strategy: 'SERVER_WINS',
  resolution_method: 'AUTO',
  
  resolved_data: {
    ...remote_data
  },
  
  changes_applied: {
    fields_changed: ['stock', 'updated_at'],
    old_values: { stock: 7, updated_at: '2026-01-31T10:00:00Z' },
    new_values: { stock: 12, updated_at: '2026-01-31T10:30:00Z' }
  },
  
  metadata: {
    resolved_at: '2026-01-31T11:00:00Z',
    conflict_type: 'STOCK',
    severity: 'MEDIUM',
    requires_review: false
  },
  
  logs: [
    'Conflict resolved using SERVER_WINS strategy',
    'Local stock (7) replaced with server stock (12)',
    'Version and timestamp synchronized with server'
  ],
  
  warnings: [],
  notes: ['Local changes discarded in favor of server data']
}
```

### Expected Outcome
- Server wins strategy implemented
- Remote data unconditionally adopted
- Local changes logged before discard
- Version and timestamp synchronized
- Resolution result generated
- Integration with auto-resolver complete

### Verification Checklist
- [ ] serverWinsResolver function implemented
- [ ] Remote data extracted correctly
- [ ] Local changes logged before discard
- [ ] IndexedDB updated with server data
- [ ] Version synchronized with server
- [ ] Timestamp synchronized with server
- [ ] Change log entry created
- [ ] Resolution result generated correctly
- [ ] Special fields handled appropriately
- [ ] Integration with AutoResolver works
- [ ] Used as default strategy for appropriate conflict types

---

## Task 77: Create Client Wins

### Overview
Implement the CLIENT_WINS resolution strategy that preserves the local (client) version of data when resolving conflicts. This strategy is used in specific scenarios where the client's changes should take precedence, such as when offline transactions have already been completed and cannot be undone. Client wins is used sparingly and only for well-defined use cases.

### Dependencies
- Task 75: Create Auto Resolution

### Instructions

1. **Create clientWinsResolver function**
   - Create function `resolveClientWins(conflict: ConflictData)`
   - Accept conflict data as parameter
   - Return ResolutionResult
   - Implement as pure function for testability

2. **Extract local data**
   - Get local_data from conflict object
   - Validate local data structure
   - Ensure all required fields present
   - Handle missing or null values

3. **Preserve local changes**
   - Keep all locally modified fields
   - Maintain local version and timestamp
   - Ensure local data integrity
   - Validate data before applying

4. **Merge non-conflicting server fields**
   - Identify fields only changed on server
   - Merge non-conflicting updates
   - Preserve critical local changes
   - Create hybrid record when appropriate

5. **Handle version conflict**
   - Increment version to indicate new state
   - Set version = max(local.version, remote.version) + 1
   - Ensure version progression
   - Prevent version ambiguity

6. **Update timestamp to current**
   - Set updated_at = new Date().toISOString()
   - Mark record as recently modified
   - Ensure proper sync ordering
   - Trigger re-sync to server

7. **Create change log entry**
   - Document that client data preserved
   - Record server data that was discarded
   - Include justification for client wins
   - Log for audit and troubleshooting

8. **Generate resolution result**
   - Set success = true
   - Set strategy = CLIENT_WINS
   - Set resolved_data = local_data (with updates)
   - Include change details
   - Add audit information

9. **Mark for server sync**
   - Add resolved record to sync queue
   - Push client changes back to server
   - Ensure server eventually matches client
   - Handle potential re-conflict

10. **Integrate with manual resolution**
    - Make available for user selection
    - Not used for auto-resolution (typically)
    - Present as option in ConflictModal
    - Allow user override to client wins

### Client Wins Strategy Flow

```
┌────────────────────────────────────┐
│      Conflict Detected             │
│   Strategy: CLIENT_WINS            │
└──────────────┬─────────────────────┘
               │
               ▼
┌────────────────────────────────────┐
│  Extract Local Data                │
│  { ...local fields }               │
└──────────────┬─────────────────────┘
               │
               ▼
┌────────────────────────────────────┐
│  Log Server Changes Being Ignored  │
│  - field1: remote (ignored)        │
│  - field2: remote (ignored)        │
└──────────────┬─────────────────────┘
               │
               ▼
┌────────────────────────────────────┐
│  Merge Non-Conflicting Fields      │
│  (Optional)                        │
└──────────────┬─────────────────────┘
               │
               ▼
┌────────────────────────────────────┐
│  Increment Version                 │
│  version = max(local, remote) + 1  │
└──────────────┬─────────────────────┘
               │
               ▼
┌────────────────────────────────────┐
│  Add to Sync Queue                 │
│  Push client data to server        │
└──────────────┬─────────────────────┘
               │
               ▼
┌────────────────────────────────────┐
│  Generate Resolution Result        │
│  success: true                     │
│  strategy: CLIENT_WINS             │
└────────────────────────────────────┘
```

### Client Wins Use Cases

| Scenario | Appropriate? | Reason |
|----------|--------------|--------|
| Offline sale completed | Yes | Cannot undo transaction |
| Payment received offline | Yes | Money already collected |
| Offline inventory adjustment | Maybe | Depends on business rules |
| Configuration change | No | Server should be authoritative |
| Stock update | No | Server is source of truth |
| Customer contact info | Maybe | If client verified data |

### Client Wins Application Example

```
Conflict:
  Type: MODIFIED
  Scenario: Sale completed offline, product modified online
  
  Local:  {
    id: 'SALE123',
    product_id: 'P456',
    quantity: 2,
    price: Rs. 100,
    total: Rs. 200,
    status: 'completed',
    version: 3
  }
  
  Remote: {
    id: 'SALE123',
    product_id: 'P456',
    quantity: 2,
    price: Rs. 120, // Price updated online
    total: Rs. 240,
    status: 'completed',
    version: 3
  }

Client Wins Resolution:
  Decision: Sale already completed at Rs. 100
  Preserve: local.price = Rs. 100, local.total = Rs. 200
  Ignore:   remote.price = Rs. 120
  Reason:   Cannot retroactively change completed transaction
  
  Result: {
    id: 'SALE123',
    product_id: 'P456',
    quantity: 2,
    price: Rs. 100,  // Local price kept
    total: Rs. 200,  // Local total kept
    status: 'completed',
    version: 4,      // Incremented
    updated_at: '2026-01-31T11:00:00Z' // Current time
  }
  
  Action: Push to server, log price discrepancy for accounting
```

### Version Increment Logic

```
Scenario 1: Equal Versions
  local.version = 4
  remote.version = 4
  Result: new_version = max(4, 4) + 1 = 5

Scenario 2: Remote Newer
  local.version = 3
  remote.version = 5
  Result: new_version = max(3, 5) + 1 = 6

Scenario 3: Local Newer (Edge Case)
  local.version = 6
  remote.version = 4
  Result: new_version = max(6, 4) + 1 = 7
```

### Resolution Result for Client Wins

```
ResolutionResult {
  success: true,
  strategy: 'CLIENT_WINS',
  resolution_method: 'MANUAL', // Typically user-selected
  
  resolved_data: {
    ...local_data,
    version: incremented_version,
    updated_at: current_timestamp
  },
  
  changes_applied: {
    fields_changed: ['version', 'updated_at'],
    old_values: { version: 3, updated_at: '2026-01-31T10:00:00Z' },
    new_values: { version: 4, updated_at: '2026-01-31T11:00:00Z' }
  },
  
  metadata: {
    resolved_at: '2026-01-31T11:00:00Z',
    conflict_type: 'MODIFIED',
    severity: 'MEDIUM',
    requires_review: false,
    synced_to_server: false // Will be synced
  },
  
  logs: [
    'Conflict resolved using CLIENT_WINS strategy',
    'Local data preserved, server data discarded',
    'Version incremented to 4',
    'Added to sync queue for server update'
  ],
  
  warnings: [
    'Server data discarded - server will be updated with client data'
  ],
  
  notes: [
    'Completed transaction cannot be modified',
    'Price discrepancy logged for accounting review'
  ]
}
```

### Client Wins Warnings

| Warning | Description | Action |
|---------|-------------|--------|
| Server Override | Server data will be overwritten | Ensure intentional |
| Re-conflict Risk | May cause new conflict if server rejects | Monitor sync result |
| Data Loss | Server changes lost | Verify server data not critical |
| Audit Required | May need manual review | Flag for review |

### Expected Outcome
- Client wins strategy implemented
- Local data preserved
- Non-conflicting server fields merged
- Version incremented appropriately
- Resolution queued for server sync
- Available for manual resolution selection

### Verification Checklist
- [ ] clientWinsResolver function implemented
- [ ] Local data extracted correctly
- [ ] Local changes preserved
- [ ] Non-conflicting fields merged (if applicable)
- [ ] Version incremented correctly
- [ ] Timestamp updated to current time
- [ ] Change log entry created
- [ ] Resolution result generated correctly
- [ ] Record added to sync queue
- [ ] Available in manual resolution options
- [ ] Server sync handling implemented

---

## Task 78: Create Manual Resolution

### Overview
Implement the manual conflict resolution system that presents conflicts to users through a UI modal, allowing them to make informed decisions about how to resolve conflicts. Manual resolution is required for complex conflicts, deletion conflicts, and any scenario where automatic rules cannot safely determine the correct resolution. This task creates the UI component and the supporting logic for user-driven resolution.

### Dependencies
- Task 77: Create Client Wins

### Instructions

1. **Create ConflictModal component file**
   - Navigate to `frontend/components/offline/` directory
   - Create file `ConflictModal.tsx`
   - Set up React component with TypeScript
   - Import necessary dependencies

2. **Define modal props interface**
   - Create `ConflictModalProps` interface
   - Include: conflict (ConflictData), onResolve callback, onClose callback
   - Add isOpen boolean for modal state
   - Support multiple conflicts queue

3. **Design modal layout structure**
   - Header: Conflict type and severity indicator
   - Body: Side-by-side comparison of local vs remote data
   - Footer: Resolution action buttons
   - Use accessible modal design patterns

4. **Create conflict data comparison view**
   - Display local data on left side
   - Display remote data on right side
   - Highlight differing fields
   - Use color coding: local (blue), remote (green), different (yellow)
   - Show version and timestamp for each

5. **Implement field-level comparison**
   - List all fields in conflict
   - Show old value and new value side by side
   - Allow field-by-field selection (for merge)
   - Use checkboxes or radio buttons for selection
   - Support scrolling for large objects

6. **Add resolution action buttons**
   - "Use Server Data" button → SERVER_WINS
   - "Keep Local Data" button → CLIENT_WINS
   - "Custom Merge" button → Enable field selection
   - "Cancel" button → Close without resolving
   - Keyboard shortcuts for accessibility

7. **Implement resolution handlers**
   - Create `handleServerWins()` function
   - Create `handleClientWins()` function
   - Create `handleCustomMerge()` function
   - Each calls appropriate resolver
   - Pass result to onResolve callback

8. **Add custom merge functionality**
   - Enable field-by-field selection mode
   - Track selected fields from local and remote
   - Build merged object from selections
   - Validate merged data for completeness
   - Apply merge and resolve conflict

9. **Create conflict context display**
   - Show conflict metadata (type, detected_at, severity)
   - Display entity type and entity ID
   - Show version and timestamp comparison
   - Add explanatory text about conflict cause
   - Provide resolution recommendations

10. **Implement manual resolution workflow**
    - Queue multiple conflicts for sequential resolution
    - Show progress: "Conflict 1 of 5"
    - Allow skipping to next conflict
    - Save resolution decisions
    - Log all manual resolutions

### ConflictModal UI Structure

```
┌────────────────────────────────────────────────────────┐
│ ⚠️  Conflict Resolution Required                       │
│                                                     [X] │
├────────────────────────────────────────────────────────┤
│                                                        │
│ Type: STOCK CONFLICT          Detected: 2 minutes ago │
│ Entity: Product #P123         Severity: HIGH          │
│                                                        │
├────────────────────────────────────────────────────────┤
│                                                        │
│  Local Data (Your Device)    Remote Data (Server)     │
│  ┌────────────────────┐     ┌────────────────────┐   │
│  │ Stock: 7           │     │ Stock: 12          │   │
│  │ Version: 4         │     │ Version: 4         │   │
│  │ Updated: 10:00 AM  │     │ Updated: 10:30 AM  │   │
│  └────────────────────┘     └────────────────────┘   │
│                                                        │
│  Changes:                                             │
│  • You sold 3 units offline                           │
│  • Server restocked +2 units online                   │
│                                                        │
├────────────────────────────────────────────────────────┤
│                                                        │
│  Recommendation: Use server stock (most recent)       │
│                                                        │
│  [Use Server Data]  [Keep Local Data]  [Custom Merge] │
│                                          [Cancel]      │
│                                                        │
└────────────────────────────────────────────────────────┘
```

### Field-Level Comparison Display

```
Field Comparison View (for MODIFIED conflicts):

┌──────────────────────────────────────────────────────┐
│ Field         Local Value      Remote Value    Select│
├──────────────────────────────────────────────────────┤
│ Name          Widget Pro       Widget Pro 2      ⦿ ○ │
│ Description   Updated desc A   Updated desc B    ○ ⦿ │
│ Price         Rs. 100          Rs. 100           - - │
│ Stock         7                12                ○ ⦿ │
│ Category      Electronics      Electronics       - - │
└──────────────────────────────────────────────────────┘

⦿ = Selected for merge
○ = Not selected
- = No conflict (same value)
```

### Manual Resolution Decision Flow

```
┌────────────────────────────────────┐
│    User Opens Conflict Modal       │
└──────────────┬─────────────────────┘
               │
               ▼
┌────────────────────────────────────┐
│  Review Conflict Information       │
│  - Compare local vs remote         │
│  - Check timestamps                │
│  - Read recommendation             │
└──────────────┬─────────────────────┘
               │
        ┌──────┼──────┬─────────┐
        ▼      ▼      ▼         ▼
   ┌────────┐ ┌────┐ ┌──────┐ ┌────┐
   │Server  │ │Local│ │Custom│ │Skip│
   │Wins    │ │Wins │ │Merge │ │    │
   └───┬────┘ └──┬──┘ └──┬───┘ └─┬──┘
       │         │        │       │
       │         │        │       │
       │         │        ▼       │
       │         │   ┌─────────┐  │
       │         │   │ Select  │  │
       │         │   │ Fields  │  │
       │         │   └────┬────┘  │
       │         │        │       │
       └─────────┴────────┼───────┘
                          ▼
              ┌───────────────────┐
              │ Apply Resolution  │
              └─────────┬─────────┘
                        │
                        ▼
              ┌───────────────────┐
              │  Log Resolution   │
              │  Update IndexedDB │
              │  Sync to Server   │
              └───────────────────┘
```

### Resolution Recommendations by Type

| Conflict Type | Recommendation | Reason |
|---------------|----------------|--------|
| STOCK | Use Server Data | Server is inventory authority |
| PRICE (no sales) | Use Server Data | Apply new pricing |
| PRICE (with sales) | Keep Local Data | Sales already completed |
| DELETED | Manual Decision | Depends on context |
| MODIFIED (low severity) | Use Server Data | Server likely correct |
| MODIFIED (high severity) | Custom Merge | Review all changes |

### Manual Resolution Data Structure

```
ManualResolutionRecord {
  conflict_id: string,
  conflict_type: ConflictType,
  entity_type: string,
  entity_id: string,
  
  user_decision: {
    strategy: ResolutionStrategy,
    selected_at: ISO timestamp,
    user_id: string,
    
    // For custom merge
    field_selections?: {
      [field_name]: 'local' | 'remote' | custom_value
    }
  },
  
  result: ResolutionResult,
  
  context: {
    conflicts_in_queue: number,
    time_to_decide: number, // seconds
    recommendation_shown: string
  }
}
```

### Accessibility Considerations

| Feature | Implementation |
|---------|----------------|
| Keyboard Navigation | Tab through options, Enter to select |
| Screen Reader | Announce conflict details, read comparison |
| Focus Management | Trap focus in modal, return on close |
| High Contrast | Ensure color coding has sufficient contrast |
| Font Size | Respect user font size preferences |
| Escape Key | Close modal (with confirmation) |

### Expected Outcome
- ConflictModal component created and functional
- Side-by-side data comparison displayed
- Resolution action buttons working
- Custom merge functionality implemented
- All resolutions logged properly
- Accessible and user-friendly interface

### Verification Checklist
- [ ] ConflictModal.tsx file created
- [ ] Modal props interface defined
- [ ] Modal layout implemented
- [ ] Local vs remote data comparison displays correctly
- [ ] Differing fields highlighted
- [ ] Version and timestamp shown
- [ ] Resolution action buttons present
- [ ] "Use Server Data" button works (SERVER_WINS)
- [ ] "Keep Local Data" button works (CLIENT_WINS)
- [ ] "Custom Merge" button enables field selection
- [ ] Field-by-field selection works
- [ ] Merged data validated before apply
- [ ] Conflict context displayed (type, severity, etc.)
- [ ] Multiple conflicts queue properly
- [ ] Progress indicator shows ("1 of 5")
- [ ] All resolutions logged
- [ ] Keyboard navigation works
- [ ] Screen reader compatible
- [ ] High contrast mode supported

---

## Task 79: Create Conflict Log

### Overview
Implement a comprehensive conflict logging system that records all conflict detection, resolution attempts, and outcomes to IndexedDB. The conflict log serves as an audit trail for troubleshooting, compliance, and analytics. It enables review of past conflicts, analysis of conflict patterns, and debugging of synchronization issues.

### Dependencies
- Task 78: Create Manual Resolution

### Instructions

1. **Create conflict log object store schema**
   - Add `conflict_log` object store to IndexedDB schema
   - Define indexes for querying
   - Set up auto-incrementing primary key
   - Plan for log retention and cleanup

2. **Define ConflictLogEntry interface**
   - Create comprehensive interface for log entries
   - Include all conflict metadata
   - Add resolution details
   - Support searching and filtering

3. **Implement log entry creation**
   - Create function `logConflict(conflict: ConflictData, result: ResolutionResult)`
   - Build complete log entry object
   - Include timestamps, versions, data snapshots
   - Assign unique log ID

4. **Add conflict detection logging**
   - Log when conflict first detected
   - Record detection timestamp
   - Include detection method (version, timestamp, content)
   - Capture initial conflict state

5. **Add resolution attempt logging**
   - Log every resolution attempt (auto or manual)
   - Record strategy used
   - Capture resolution timestamp
   - Include success/failure status

6. **Implement data snapshot storage**
   - Store full local_data snapshot
   - Store full remote_data snapshot
   - Store final resolved_data
   - Enable data reconstruction from log

7. **Add user interaction logging**
   - For manual resolutions, log user ID
   - Record time taken to resolve
   - Log which button clicked
   - Track field selections for custom merge

8. **Create log retrieval functions**
   - Function `getConflictLogs(filters)` to query logs
   - Support filtering by: entity_type, entity_id, conflict_type, date range, resolution_method
   - Return paginated results
   - Sort by most recent first

9. **Implement log statistics**
   - Count conflicts by type
   - Calculate resolution success rate
   - Track average resolution time
   - Identify most conflicted entities

10. **Add log cleanup and retention**
    - Implement automatic log cleanup after retention period
    - Default retention: 90 days
    - Keep critical conflicts longer
    - Provide manual export before deletion

### Conflict Log Schema

```
ConflictLogEntry {
  id: number (auto-increment),
  
  // Conflict Identification
  conflict_id: string,
  entity_type: string,
  entity_id: string,
  conflict_type: ConflictType,
  
  // Detection
  detected_at: ISO timestamp,
  detection_method: 'VERSION' | 'TIMESTAMP' | 'CONTENT',
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL',
  
  // Data Snapshots
  local_data: object,
  remote_data: object,
  resolved_data: object,
  
  // Versioning
  local_version: number,
  remote_version: number,
  final_version: number,
  
  // Timestamps
  local_timestamp: ISO string,
  remote_timestamp: ISO string,
  
  // Resolution
  resolution_method: 'AUTO' | 'MANUAL',
  resolution_strategy: ResolutionStrategy,
  resolved_at: ISO timestamp,
  resolution_time_seconds: number,
  
  // User (for manual resolution)
  resolved_by_user_id?: string,
  user_decision_details?: object,
  
  // Outcome
  success: boolean,
  error_message?: string,
  
  // Metadata
  synced_to_server: boolean,
  requires_review: boolean,
  reviewed: boolean,
  reviewed_at?: ISO timestamp,
  notes: string[]
}
```

### IndexedDB Conflict Log Store

```
Object Store: conflict_log
  Key Path: id
  Auto Increment: true
  
  Indexes:
    - entity_type
    - entity_id
    - conflict_type
    - detected_at
    - resolution_method
    - success
    - compound: [entity_type, entity_id]
    - compound: [conflict_type, detected_at]
```

### Log Entry Creation Flow

```
┌────────────────────────────────────┐
│   Conflict Detected                │
└──────────────┬─────────────────────┘
               │
               ▼
┌────────────────────────────────────┐
│   Create Initial Log Entry         │
│   - detected_at                    │
│   - conflict details               │
│   - data snapshots                 │
└──────────────┬─────────────────────┘
               │
               ▼
┌────────────────────────────────────┐
│   Attempt Resolution               │
│   (Auto or Manual)                 │
└──────────────┬─────────────────────┘
               │
               ▼
┌────────────────────────────────────┐
│   Update Log Entry                 │
│   - resolution strategy            │
│   - resolved_data                  │
│   - success status                 │
│   - resolved_at                    │
└──────────────┬─────────────────────┘
               │
               ▼
┌────────────────────────────────────┐
│   Save to IndexedDB                │
│   conflict_log object store        │
└────────────────────────────────────┘
```

### Log Query Examples

```
Example 1: Get All Stock Conflicts
  getConflictLogs({ conflict_type: 'STOCK' })
  
Example 2: Get Conflicts for Specific Product
  getConflictLogs({ entity_type: 'product', entity_id: 'P123' })
  
Example 3: Get Manual Resolutions
  getConflictLogs({ resolution_method: 'MANUAL' })
  
Example 4: Get Recent Conflicts (Last 7 Days)
  getConflictLogs({ 
    date_range: { 
      start: '2026-01-24T00:00:00Z', 
      end: '2026-01-31T23:59:59Z' 
    } 
  })
  
Example 5: Get Failed Resolutions
  getConflictLogs({ success: false })
```

### Conflict Log Statistics

```
Statistics Functions:

1. getConflictCountByType()
   Returns: { STOCK: 15, PRICE: 8, MODIFIED: 22, DELETED: 3 }

2. getResolutionSuccessRate()
   Returns: { total: 48, successful: 45, failed: 3, rate: 93.75% }

3. getAverageResolutionTime()
   Returns: { 
     auto: 0.5 seconds, 
     manual: 45 seconds, 
     overall: 12 seconds 
   }

4. getMostConflictedEntities()
   Returns: [
     { entity_id: 'P123', entity_type: 'product', count: 8 },
     { entity_id: 'P456', entity_type: 'product', count: 5 },
     ...
   ]

5. getConflictTrends(days: 30)
   Returns: Daily conflict counts for last 30 days
```

### Log Retention and Cleanup

| Log Type | Retention Period | Reason |
|----------|------------------|--------|
| Standard conflicts | 90 days | Sufficient for analysis |
| Critical conflicts | 180 days | Extended review period |
| Failed resolutions | 180 days | Need troubleshooting |
| Manual resolutions | 365 days | Compliance and audit |

### Cleanup Process
```
1. Run daily cleanup job
2. Identify logs older than retention period
3. Exclude logs marked for extended retention
4. Archive to export file (optional)
5. Delete from IndexedDB
6. Log cleanup action
```

### Expected Outcome
- Conflict log object store created in IndexedDB
- All conflicts logged with complete details
- Log retrieval functions working
- Statistics and analytics available
- Log cleanup and retention implemented
- Comprehensive audit trail maintained

### Verification Checklist
- [ ] conflict_log object store added to IndexedDB schema
- [ ] ConflictLogEntry interface defined
- [ ] Indexes created for efficient querying
- [ ] logConflict function implemented
- [ ] Conflict detection logged
- [ ] Resolution attempts logged
- [ ] Data snapshots stored (local, remote, resolved)
- [ ] User interactions logged for manual resolutions
- [ ] getConflictLogs function works with filters
- [ ] Pagination implemented for large result sets
- [ ] Log statistics functions implemented
- [ ] Conflict count by type works
- [ ] Resolution success rate calculated
- [ ] Average resolution time tracked
- [ ] Most conflicted entities identified
- [ ] Log retention policy implemented
- [ ] Automatic cleanup runs
- [ ] Export functionality available
- [ ] Logs searchable and filterable

---

## Task 80: Verify Conflicts

### Overview
Implement comprehensive verification and testing for the entire conflict resolution system. This task ensures all components work together correctly, covers edge cases, validates data integrity, and confirms the system behaves as expected under various conflict scenarios. Verification includes unit tests, integration tests, and manual testing procedures.

### Dependencies
- Task 79: Create Conflict Log

### Instructions

1. **Create verification test suite**
   - Set up test file structure for conflict resolution
   - Use testing framework (Jest, Vitest, or similar)
   - Create test utilities and helpers
   - Prepare test data fixtures

2. **Test conflict detection**
   - Verify version-based detection works
   - Verify timestamp-based detection works
   - Test content-based detection
   - Ensure null returned when no conflict
   - Test with missing version/timestamp fields

3. **Test conflict type determination**
   - Verify STOCK conflicts detected correctly
   - Verify PRICE conflicts detected correctly
   - Verify DELETED conflicts detected correctly
   - Verify MODIFIED conflicts detected correctly
   - Test with multiple field changes

4. **Test auto-resolution**
   - Verify canAutoResolve logic
   - Test SERVER_WINS strategy
   - Test auto-resolution for STOCK conflicts
   - Test auto-resolution for PRICE conflicts
   - Ensure DELETED conflicts not auto-resolved

5. **Test manual resolution**
   - Verify ConflictModal displays correct data
   - Test "Use Server Data" button
   - Test "Keep Local Data" button
   - Test custom merge functionality
   - Verify resolution result structure

6. **Test conflict logging**
   - Verify all conflicts logged to IndexedDB
   - Test log retrieval with various filters
   - Verify log statistics calculations
   - Test log cleanup functionality
   - Ensure data snapshots stored correctly

7. **Test version tracking**
   - Verify version initializes to 1
   - Test version increments on updates
   - Verify version comparison logic
   - Test optimistic locking
   - Ensure version conflicts detected

8. **Test timestamp comparison**
   - Verify timestamps set correctly
   - Test timestamp parsing and comparison
   - Verify UTC timezone handling
   - Test with clock skew scenarios
   - Ensure timestamp conflicts detected

9. **Test edge cases**
   - Null or undefined data
   - Missing required fields
   - Extremely large data objects
   - Rapid successive conflicts
   - Network interruption during resolution
   - Simultaneous conflicts on same record

10. **Perform end-to-end testing**
    - Simulate offline operation
    - Create conflicting changes
    - Trigger sync
    - Verify conflict detection
    - Resolve conflicts
    - Confirm data consistency
    - Check logs for completeness

### Test Scenarios

#### Scenario 1: Stock Conflict Detection and Resolution
```
Setup:
  1. Create product with stock = 10, version = 1
  2. Sync to establish baseline
  3. Go offline
  4. Sell 3 units offline → stock = 7, version = 2
  5. Online: Restock +5 units → stock = 15, version = 2
  6. Come online and sync

Expected:
  ✓ Conflict detected (both version 2)
  ✓ Conflict type = STOCK
  ✓ Auto-resolution with SERVER_WINS
  ✓ Local stock updated to 15
  ✓ Conflict logged
  ✓ Version synchronized

Verification:
  [ ] Conflict detected correctly
  [ ] SERVER_WINS applied
  [ ] Local stock = 15
  [ ] Log entry created
  [ ] No data loss or corruption
```

#### Scenario 2: Price Conflict with Offline Sales
```
Setup:
  1. Create product with price = Rs. 100
  2. Go offline
  3. Sell 2 units @ Rs. 100 offline
  4. Online: Update price to Rs. 120
  5. Come online and sync

Expected:
  ✓ Conflict detected
  ✓ Conflict type = PRICE
  ✓ Sales accepted at Rs. 100
  ✓ Price updated to Rs. 120 for future sales
  ✓ Revenue impact logged (Rs. 40 loss)
  ✓ Conflict logged with financial details

Verification:
  [ ] Price conflict detected
  [ ] Sales preserved at Rs. 100
  [ ] Price updated to Rs. 120
  [ ] Revenue impact calculated
  [ ] Accounting flag set if needed
  [ ] Log entry complete
```

#### Scenario 3: Deletion Conflict
```
Setup:
  1. Create product
  2. Go offline
  3. Sell 1 unit offline
  4. Online: Delete product (discontinued)
  5. Come online and sync

Expected:
  ✓ Conflict detected
  ✓ Conflict type = DELETED
  ✓ Cannot auto-resolve
  ✓ ConflictModal shown
  ✓ User makes decision
  ✓ Resolution logged as manual

Verification:
  [ ] Deletion conflict detected
  [ ] Auto-resolution blocked
  [ ] Modal displayed to user
  [ ] Both resolution options work
  [ ] Final decision applied correctly
  [ ] Manual resolution logged
```

#### Scenario 4: Multiple Conflicts in Queue
```
Setup:
  1. Go offline
  2. Modify 5 products offline
  3. Online: Modify same 5 products
  4. Come online and sync

Expected:
  ✓ All 5 conflicts detected
  ✓ Conflicts queued for resolution
  ✓ Progress shown (1 of 5, 2 of 5, etc.)
  ✓ Each resolved individually
  ✓ All resolutions logged
  ✓ Final state consistent

Verification:
  [ ] All 5 conflicts detected
  [ ] Queue management works
  [ ] Progress indicator accurate
  [ ] All resolved successfully
  [ ] 5 log entries created
  [ ] Data consistent after resolution
```

### Verification Checklist Matrix

| Component | Test Coverage | Status |
|-----------|---------------|--------|
| ConflictDetector | Version, Timestamp, Content detection | [ ] |
| Version Tracking | Init, Increment, Comparison | [ ] |
| Timestamp Compare | Set, Update, Compare, Edge cases | [ ] |
| Conflict Types | All types detected correctly | [ ] |
| Stock Conflict | Detection, Severity, Resolution | [ ] |
| Price Conflict | Detection, Impact calc, Resolution | [ ] |
| Auto Resolution | Rules, Strategies, Logging | [ ] |
| Server Wins | Data override, Version sync | [ ] |
| Client Wins | Data preserve, Version increment | [ ] |
| Manual Resolution | Modal display, User actions, Merge | [ ] |
| Conflict Log | Create, Retrieve, Statistics, Cleanup | [ ] |
| End-to-End | Full offline-to-online cycle | [ ] |

### Performance Testing

| Test | Target | Measurement |
|------|--------|-------------|
| Conflict detection time | < 10ms per conflict | Avg time |
| Auto-resolution time | < 50ms per conflict | Avg time |
| Log write time | < 20ms per entry | Avg time |
| Log query time | < 100ms for 1000 entries | Query time |
| Modal render time | < 100ms | First render |
| Large data conflict | < 500ms for 10KB objects | Total time |

### Data Integrity Checks

```
Verification Points:

1. No Data Loss
   - All local changes accounted for
   - All remote changes considered
   - Resolution preserves critical data

2. Version Consistency
   - Versions increment correctly
   - No version regression
   - Version matches data state

3. Timestamp Accuracy
   - Timestamps in chronological order
   - UTC timezone consistent
   - Resolution timestamps accurate

4. Log Completeness
   - All conflicts logged
   - All resolutions logged
   - Data snapshots complete

5. Sync Queue Integrity
   - Resolved items added to queue
   - Queue processes correctly
   - No duplicate syncs
```

### Manual Testing Checklist

```
Manual Test Procedure:

Setup:
1. [ ] Clear IndexedDB
2. [ ] Initialize offline system
3. [ ] Create test products
4. [ ] Verify sync working

Conflict Generation:
5. [ ] Go offline
6. [ ] Modify product A (stock)
7. [ ] Modify product B (price)
8. [ ] Online: Modify same products
9. [ ] Come online

Resolution:
10. [ ] Verify conflicts detected
11. [ ] Check auto-resolution for stock
12. [ ] Check price conflict handling
13. [ ] Test manual resolution modal
14. [ ] Try each resolution button
15. [ ] Test custom merge

Verification:
16. [ ] Check IndexedDB for resolved data
17. [ ] Verify conflict logs created
18. [ ] Check sync queue populated
19. [ ] Confirm data consistency
20. [ ] Review log statistics

Edge Cases:
21. [ ] Test with no internet during resolution
22. [ ] Test rapid offline-online transitions
23. [ ] Test with extremely large objects
24. [ ] Test with null/undefined fields
25. [ ] Test cleanup after resolution
```

### Expected Outcome
- All conflict resolution components verified
- Edge cases tested and handled
- Performance meets targets
- Data integrity maintained
- Logging complete and accurate
- System ready for production use

### Final Verification Checklist
- [ ] Unit tests written and passing
- [ ] Integration tests written and passing
- [ ] All test scenarios executed successfully
- [ ] Edge cases identified and tested
- [ ] Performance targets met
- [ ] Data integrity verified
- [ ] Conflict detection working 100%
- [ ] Version tracking reliable
- [ ] Timestamp comparison accurate
- [ ] All conflict types detected
- [ ] Stock conflicts resolved correctly
- [ ] Price conflicts handled properly
- [ ] Auto-resolution reliable
- [ ] SERVER_WINS strategy works
- [ ] CLIENT_WINS strategy works
- [ ] Manual resolution functional
- [ ] ConflictModal displays correctly
- [ ] All resolution buttons working
- [ ] Custom merge functional
- [ ] Conflict logging complete
- [ ] Log retrieval working
- [ ] Log statistics accurate
- [ ] Log cleanup functioning
- [ ] End-to-end flow verified
- [ ] Documentation updated
- [ ] Code reviewed and approved
- [ ] Ready for production deployment

---

## Document Summary

This document has covered the complete implementation of the conflict resolution system for POS offline enhancement (Tasks 69-80). The system includes:

### Key Components Implemented

1. **Conflict Detection** (Tasks 69-71)
   - ConflictDetector class with version and timestamp comparison
   - Version tracking for optimistic locking
   - Timestamp-based fallback detection

2. **Conflict Classification** (Tasks 72-74)
   - ConflictType enumeration (STOCK, PRICE, DELETED, MODIFIED, CREATED)
   - Specialized stock conflict handling with severity levels
   - Price conflict handling with revenue impact calculation

3. **Automatic Resolution** (Tasks 75-77)
   - AutoResolver with configurable rules
   - SERVER_WINS strategy for inventory and modifications
   - CLIENT_WINS strategy for completed transactions
   - Fallback to manual resolution for complex cases

4. **Manual Resolution** (Tasks 78)
   - ConflictModal UI component for user decisions
   - Side-by-side data comparison
   - Field-level custom merge capability
   - Accessible interface with keyboard navigation

5. **Audit and Logging** (Task 79)
   - Comprehensive conflict log in IndexedDB
   - Resolution tracking and statistics
   - Log retention and cleanup policies
   - Query and analysis capabilities

6. **Verification** (Task 80)
   - Complete test coverage
   - Edge case handling
   - Performance validation
   - Data integrity assurance

### System Flow Overview

```
Offline Mode
    │
    ▼
Local Changes Made
    │
    ▼
Come Online
    │
    ▼
Sync Initiated
    │
    ▼
Conflict Detected?
    │
    ├─── No ──→ Sync Successfully
    │
    └─── Yes ──→ ConflictDetector
                      │
                      ▼
                 Classify Type
                      │
                 ┌────┴────┐
                 ▼         ▼
            Auto-Resolve  Manual
                 │         │
                 │    ConflictModal
                 │         │
                 └────┬────┘
                      ▼
               Apply Resolution
                      │
                      ▼
                Log to IndexedDB
                      │
                      ▼
              Update Local Store
                      │
                      ▼
             Sync to Server
```

### Files Created

- `frontend/lib/offline/conflict-resolver.ts` - Detection and resolution logic
- `frontend/components/offline/ConflictModal.tsx` - Manual resolution UI

### Next Steps

Proceed to **Group F: UI & Testing** to complete the POS offline enhancement with user interface improvements and comprehensive testing.

---

**Document Status:** ✅ Complete  
**Tasks Covered:** 69-80 (12 tasks)  
**Estimated Implementation Time:** 8-10 hours  
**Complexity:** Medium-High

---

## Additional Resources

### Related Documentation
- Group D: Sync Queue - For understanding sync queue integration
- Group F: UI & Testing - For UI integration and testing procedures
- SubPhase-07: Offline Storage - For IndexedDB schema reference

### External References
- Optimistic Locking Patterns
- Conflict-Free Replicated Data Types (CRDTs)
- IndexedDB Best Practices
- React Modal Accessibility Guidelines

---

*End of Document*
