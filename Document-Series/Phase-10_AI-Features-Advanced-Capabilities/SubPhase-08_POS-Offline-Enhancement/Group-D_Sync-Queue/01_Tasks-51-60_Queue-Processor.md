# Tasks 51-60: Queue Processor

> **Phase:** 10 - AI Features & Advanced Capabilities  
> **SubPhase:** 08 - POS Offline Enhancement  
> **Group:** D - Sync Queue  
> **Document:** 01 of 02  
> **Tasks Covered:** 51, 52, 53, 54, 55, 56, 57, 58, 59, 60

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Group:** [Group-C: Offline Manager - Sale Receipt Shift](../Group-C_Offline-Manager/02_Tasks-43-50_Sale-Receipt-Shift.md)
- **→ Next Document:** [02_Tasks-61-68_Retry-Webhook-Cleanup.md](02_Tasks-61-68_Retry-Webhook-Cleanup.md)

---

## Document Overview

This document covers the creation of the sync queue infrastructure for reliable offline data synchronization. It establishes the SyncQueue class, queue item type definitions, queue management methods, priority handling, queue ordering logic, sync processor implementation, batch synchronization, and retry logic with exponential backoff.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 51 | Create SyncQueue Class | Medium | 45 min |
| 52 | Create Queue Item Type | Low | 20 min |
| 53 | Create addToQueue | Low | 25 min |
| 54 | Create getQueue | Low | 25 min |
| 55 | Create removeFromQueue | Low | 20 min |
| 56 | Create Queue Priority | Low | 25 min |
| 57 | Create Queue Ordering | Low | 30 min |
| 58 | Create Sync Processor | High | 90 min |
| 59 | Create Batch Sync | Medium | 60 min |
| 60 | Create Retry Logic | Medium | 45 min |

---

## Task 51: Create SyncQueue Class

### Overview
Create the SyncQueue class as a singleton that manages the synchronization queue for offline operations. This class provides the foundation for queuing data changes that need to be synchronized with the server when the application comes back online. The singleton pattern ensures a single queue instance across the application.

### Dependencies
- Task 50: Create useOfflineManager Hook (from Group C)
- IndexedDB storage is available
- OfflineStorage class is implemented

### Instructions

1. **Create the sync-queue.ts file**
   - Navigate to `frontend/lib/offline/` directory
   - Create new file named `sync-queue.ts`
   - This file contains the SyncQueue class implementation

2. **Import required dependencies**
   - Import IndexedDB utilities from offline storage
   - Import type definitions for queue items
   - Import event emitter utilities for progress notifications
   - Import database connection helpers

3. **Define the SyncQueue class structure**
   - Declare class with private static instance property
   - Implement private constructor to prevent direct instantiation
   - Create public static getInstance() method for singleton access
   - Add private properties for database connection and queue state

4. **Implement singleton pattern**
   - Check if instance exists in getInstance()
   - Create new instance if none exists
   - Return existing instance if already created
   - Ensure thread-safe singleton implementation

5. **Initialize database connection**
   - Open IndexedDB database connection in constructor
   - Create object store for sync queue if not exists
   - Define indexes for efficient querying (status, priority, created_at)
   - Handle database upgrade events

6. **Add private helper properties**
   - Add isProcessing flag to track sync state
   - Add eventEmitter for progress notifications
   - Add dbConnection property for IndexedDB
   - Add queueName constant for object store

### Singleton Pattern Structure

```
┌─────────────────────────────────────┐
│         SyncQueue Class             │
├─────────────────────────────────────┤
│  - private static instance          │
│  - private constructor()            │
│  + static getInstance()             │
├─────────────────────────────────────┤
│  + addToQueue()                     │
│  + getQueue()                       │
│  + removeFromQueue()                │
│  + processQueue()                   │
│  - private helpers                  │
└─────────────────────────────────────┘
```

### Class Architecture

| Component | Type | Purpose |
|-----------|------|---------|
| instance | static property | Singleton instance |
| constructor | private | Prevent direct instantiation |
| getInstance() | static method | Get singleton instance |
| dbConnection | private property | IndexedDB connection |
| isProcessing | private property | Sync state flag |
| eventEmitter | private property | Progress events |

### Database Schema

| Store Name | Key Path | Indexes |
|------------|----------|---------|
| syncQueue | id | status, priority, created_at |

### Expected Outcome
- SyncQueue class created with singleton pattern
- IndexedDB connection established
- Object store for queue items created
- Foundation for queue management methods
- Ready to add queue operations

### Verification Checklist
- [ ] `frontend/lib/offline/sync-queue.ts` file created
- [ ] SyncQueue class defined with singleton pattern
- [ ] Private constructor prevents direct instantiation
- [ ] getInstance() method returns singleton instance
- [ ] IndexedDB connection established in constructor
- [ ] Object store 'syncQueue' created with proper indexes
- [ ] Class compiles without TypeScript errors

---

## Task 52: Create Queue Item Type

### Overview
Define the TypeScript interface for queue items that represent operations awaiting synchronization. This type ensures type safety across the queue system and defines the structure of data stored in IndexedDB. Each queue item represents a single operation (create, update, delete) that needs to be synced with the server.

### Dependencies
- Task 51: Create SyncQueue Class

### Instructions

1. **Create type definition file**
   - In `frontend/lib/offline/sync-queue.ts`
   - Define interface before the SyncQueue class
   - Export interface for use in other modules

2. **Define SyncQueueItem interface**
   - Create TypeScript interface named SyncQueueItem
   - Add all required fields with appropriate types
   - Include optional fields where applicable
   - Add JSDoc comments for documentation

3. **Define id field**
   - Type: number (auto-incrementing primary key)
   - Purpose: Unique identifier for queue item
   - Generated automatically by IndexedDB
   - Required field

4. **Define type field**
   - Type: string (union type of allowed values)
   - Values: 'sale', 'inventory', 'customer', 'payment', 'settings'
   - Purpose: Categorize the operation type
   - Required field

5. **Define action field**
   - Type: string (union type)
   - Values: 'create', 'update', 'delete'
   - Purpose: Specify the operation to perform
   - Required field

6. **Define data field**
   - Type: any (flexible JSON data)
   - Purpose: Store the actual payload to sync
   - Contains operation-specific data
   - Required field

7. **Define priority field**
   - Type: number (1-3)
   - Values: 1 (high), 2 (medium), 3 (low)
   - Purpose: Determine sync order
   - Required field with default

8. **Define retries field**
   - Type: number (0 or positive integer)
   - Purpose: Track number of sync attempts
   - Starts at 0, increments on each failure
   - Required field

9. **Define status field**
   - Type: string (union type)
   - Values: 'pending', 'syncing', 'failed', 'synced'
   - Purpose: Track sync state
   - Required field

10. **Define created_at field**
    - Type: Date (timestamp)
    - Purpose: Record when item was queued
    - Used for FIFO ordering
    - Required field

11. **Define last_attempt field**
    - Type: Date | null
    - Purpose: Track last sync attempt
    - Used for retry logic
    - Optional field (null for new items)

12. **Define error field**
    - Type: string | null
    - Purpose: Store error message on failure
    - Helps with debugging
    - Optional field

### Queue Item Structure

```
SyncQueueItem
├── id: number (auto)
├── type: 'sale' | 'inventory' | 'customer' | 'payment' | 'settings'
├── action: 'create' | 'update' | 'delete'
├── data: any (JSON payload)
├── priority: 1 | 2 | 3
├── retries: number
├── status: 'pending' | 'syncing' | 'failed' | 'synced'
├── created_at: Date
├── last_attempt: Date | null
└── error: string | null
```

### Field Types and Constraints

| Field | Type | Required | Default | Constraints |
|-------|------|----------|---------|-------------|
| id | number | Yes | Auto | Primary key |
| type | string | Yes | - | Specific values |
| action | string | Yes | - | Specific values |
| data | any | Yes | - | Valid JSON |
| priority | number | Yes | 2 | 1-3 range |
| retries | number | Yes | 0 | >= 0 |
| status | string | Yes | 'pending' | Specific values |
| created_at | Date | Yes | now() | Valid date |
| last_attempt | Date | No | null | Valid date |
| error | string | No | null | - |

### Priority Levels

| Priority | Value | Use Case |
|----------|-------|----------|
| High | 1 | Sales, payments |
| Medium | 2 | Inventory updates |
| Low | 3 | Settings, logs |

### Status States

| Status | Description |
|--------|-------------|
| pending | Waiting to be synced |
| syncing | Currently being synced |
| failed | Sync failed after retries |
| synced | Successfully synchronized |

### Expected Outcome
- SyncQueueItem interface defined with all fields
- Type safety enforced for queue operations
- Clear documentation via JSDoc comments
- Union types for specific string values
- Ready to use in queue methods

### Verification Checklist
- [ ] SyncQueueItem interface exported
- [ ] All required fields defined with correct types
- [ ] Union types used for type, action, and status
- [ ] Priority constrained to 1-3 range
- [ ] Optional fields marked as nullable
- [ ] JSDoc comments added for documentation
- [ ] Interface compiles without TypeScript errors

---

## Task 53: Create addToQueue

### Overview
Implement the addToQueue method that adds new items to the synchronization queue. This method validates the input, sets default values, assigns priority based on operation type, and stores the item in IndexedDB. It returns the assigned queue ID for tracking purposes.

### Dependencies
- Task 52: Create Queue Item Type

### Instructions

1. **Define method signature**
   - Add public method addToQueue to SyncQueue class
   - Accept parameters: type, action, data
   - Optional parameters: priority (auto-assigned if not provided)
   - Return Promise<number> (queue item ID)

2. **Validate input parameters**
   - Check type is one of allowed values
   - Check action is valid (create, update, delete)
   - Verify data is not null or undefined
   - Throw error if validation fails

3. **Auto-assign priority if not provided**
   - If priority not specified, determine from type
   - Sales and payments: priority 1 (high)
   - Inventory updates: priority 2 (medium)
   - Settings and logs: priority 3 (low)
   - Use provided priority if valid (1-3)

4. **Create queue item object**
   - Build SyncQueueItem object with all fields
   - Set id to undefined (auto-generated by IndexedDB)
   - Set status to 'pending'
   - Set retries to 0
   - Set created_at to current timestamp
   - Set last_attempt to null
   - Set error to null

5. **Store item in IndexedDB**
   - Open transaction on syncQueue object store
   - Use 'readwrite' mode for transaction
   - Add item using transaction.add()
   - Wait for transaction to complete

6. **Handle storage success**
   - Retrieve auto-generated ID from add operation
   - Emit event for UI updates (optional)
   - Return the queue item ID

7. **Handle storage errors**
   - Catch any IndexedDB errors
   - Log error details for debugging
   - Throw meaningful error to caller
   - Ensure transaction is properly closed

8. **Add convenience wrapper methods**
   - Create addSale(data) helper
   - Create addInventoryUpdate(data) helper
   - Create addPayment(data) helper
   - These call addToQueue with preset type

### Add to Queue Flow

```
Input (type, action, data)
    │
    ▼
Validate Parameters
    │
    ▼
Auto-assign Priority (if not provided)
    │
    ▼
Create Queue Item Object
    │
    ▼
Store in IndexedDB
    │
    ▼
Return Queue ID
```

### Method Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| type | string | Yes | Operation category |
| action | string | Yes | Operation type |
| data | any | Yes | Payload to sync |
| priority | number | No | Queue priority (1-3) |

### Auto-priority Rules

| Type | Default Priority | Reason |
|------|-----------------|--------|
| sale | 1 | Revenue critical |
| payment | 1 | Financial data |
| inventory | 2 | Stock accuracy |
| customer | 2 | Customer data |
| settings | 3 | Non-critical |

### Usage Examples

| Operation | Type | Action | Priority |
|-----------|------|--------|----------|
| New sale | sale | create | 1 (auto) |
| Update stock | inventory | update | 2 (auto) |
| Delete customer | customer | delete | 2 (auto) |
| Update settings | settings | update | 3 (auto) |

### Error Scenarios

| Error | Cause | Action |
|-------|-------|--------|
| Invalid type | Type not in allowed list | Throw validation error |
| Invalid action | Action not create/update/delete | Throw validation error |
| Null data | Data is null or undefined | Throw validation error |
| Storage error | IndexedDB failure | Log and throw error |

### Expected Outcome
- addToQueue method implemented and functional
- Input validation prevents invalid data
- Priority auto-assigned based on operation type
- Items successfully stored in IndexedDB
- Queue ID returned for tracking
- Helper methods for common operations

### Verification Checklist
- [ ] addToQueue method defined with correct signature
- [ ] Input validation implemented
- [ ] Priority auto-assignment logic works
- [ ] SyncQueueItem object created with all fields
- [ ] Item stored in IndexedDB successfully
- [ ] Auto-generated ID returned
- [ ] Error handling implemented
- [ ] Helper methods created (addSale, etc.)
- [ ] Method tested with sample data

---

## Task 54: Create getQueue

### Overview
Implement the getQueue method that retrieves items from the synchronization queue based on optional status filter. This method queries IndexedDB, supports filtering by status, and returns items ordered by priority and creation time. It's essential for displaying queue contents and processing pending items.

### Dependencies
- Task 53: Create addToQueue

### Instructions

1. **Define method signature**
   - Add public method getQueue to SyncQueue class
   - Accept optional status parameter (string or string array)
   - Return Promise<SyncQueueItem[]>
   - Allow filtering by single or multiple statuses

2. **Implement status filtering logic**
   - If status parameter provided, filter by that status
   - If array of statuses, filter by any matching status
   - If no status parameter, return all items
   - Support filtering: 'pending', 'syncing', 'failed', 'synced'

3. **Open IndexedDB transaction**
   - Open transaction on syncQueue object store
   - Use 'readonly' mode (no modifications)
   - Get reference to object store
   - Prepare cursor for iteration

4. **Query with status filter**
   - If status provided, use index query on status field
   - Use IDBKeyRange for status matching
   - If multiple statuses, query each and merge results
   - If no filter, get all records

5. **Collect matching items**
   - Iterate through cursor results
   - Add matching items to results array
   - Convert stored dates from ISO strings to Date objects
   - Maintain order from cursor iteration

6. **Sort results by priority and time**
   - Sort array by priority (ascending: 1, 2, 3)
   - Within same priority, sort by created_at (ascending - FIFO)
   - Use Array.sort with custom comparator
   - Ensure stable sort for predictable ordering

7. **Return sorted results**
   - Return complete array of SyncQueueItem objects
   - Items are ready for processing or display
   - Empty array if no matching items

8. **Handle query errors**
   - Catch IndexedDB errors
   - Log error details
   - Return empty array on error (graceful degradation)
   - Or throw error if critical

9. **Add convenience methods**
   - Create getPendingQueue() → getQueue('pending')
   - Create getFailedQueue() → getQueue('failed')
   - Create getSyncedQueue() → getQueue('synced')
   - Create getAllQueue() → getQueue()

### Get Queue Flow

```
getQueue(status?)
    │
    ▼
Open Transaction (readonly)
    │
    ▼
Filter by Status (if provided)
    │
    ▼
Query IndexedDB
    │
    ▼
Collect Results
    │
    ▼
Sort by Priority & Time
    │
    ▼
Return SyncQueueItem[]
```

### Method Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| status | string or string[] | No | Filter by status |

### Supported Status Filters

| Filter | Returns |
|--------|---------|
| 'pending' | Items awaiting sync |
| 'syncing' | Items currently syncing |
| 'failed' | Items that failed |
| 'synced' | Successfully synced items |
| undefined | All items |
| ['pending', 'syncing'] | Multiple statuses |

### Sort Order

| Primary | Secondary | Result |
|---------|-----------|--------|
| Priority ASC | created_at ASC | High priority first, FIFO within priority |

### Sort Example

```
Result Order:
1. Sale (priority 1, created 10:00)
2. Payment (priority 1, created 10:05)
3. Inventory (priority 2, created 09:50)
4. Settings (priority 3, created 09:00)
```

### Usage Scenarios

| Scenario | Method Call | Result |
|----------|-------------|--------|
| Get pending items | getQueue('pending') | Items ready to sync |
| Get failed items | getQueue('failed') | Items for retry |
| Get all items | getQueue() | Complete queue |
| Get processing | getQueue(['pending', 'syncing']) | Active items |

### Return Value Structure

| Return | Type | Description |
|--------|------|-------------|
| Success | SyncQueueItem[] | Array of queue items |
| No items | [] | Empty array |
| Error | [] or throw | Based on error handling |

### Expected Outcome
- getQueue method retrieves items from IndexedDB
- Status filtering works correctly
- Items returned in priority and FIFO order
- Convenience methods for common queries
- Error handling prevents crashes
- Ready for sync processor to use

### Verification Checklist
- [ ] getQueue method defined with correct signature
- [ ] Status filtering implemented
- [ ] Multiple status filters supported
- [ ] IndexedDB query works correctly
- [ ] Results sorted by priority and time
- [ ] Convenience methods created
- [ ] Error handling implemented
- [ ] Method returns correct type
- [ ] Method tested with various filters

---

## Task 55: Create removeFromQueue

### Overview
Implement the removeFromQueue method that deletes items from the synchronization queue. This method is used to clean up successfully synced items or remove items that should no longer be processed. It accepts a queue item ID and removes the corresponding item from IndexedDB.

### Dependencies
- Task 54: Create getQueue

### Instructions

1. **Define method signature**
   - Add public method removeFromQueue to SyncQueue class
   - Accept queueId parameter (number)
   - Return Promise<boolean> (true if deleted, false if not found)
   - Use async/await pattern

2. **Validate queue ID parameter**
   - Check queueId is a valid number
   - Check queueId is positive integer
   - Throw error if invalid
   - Log warning if ID format unexpected

3. **Open IndexedDB transaction**
   - Open transaction on syncQueue object store
   - Use 'readwrite' mode for deletion
   - Get reference to object store
   - Prepare for delete operation

4. **Check if item exists**
   - Use transaction.get(queueId) to verify existence
   - If item not found, return false
   - If item found, proceed with deletion
   - Avoid deleting non-existent items

5. **Delete item from IndexedDB**
   - Use transaction.delete(queueId)
   - Wait for delete operation to complete
   - Handle transaction commit
   - Ensure operation is atomic

6. **Handle deletion success**
   - Emit event for UI updates (optional)
   - Log successful deletion for debugging
   - Return true to indicate success
   - Update any in-memory cache if present

7. **Handle deletion errors**
   - Catch IndexedDB errors
   - Log error details
   - Return false on error
   - Ensure transaction is rolled back

8. **Add batch deletion method**
   - Create removeBatch(queueIds: number[])
   - Accept array of IDs to delete
   - Delete multiple items in single transaction
   - Return count of deleted items

9. **Add status-based deletion method**
   - Create removeByStatus(status: string)
   - Delete all items with specified status
   - Use getQueue to find items first
   - Delete in batch for efficiency

### Remove from Queue Flow

```
removeFromQueue(queueId)
    │
    ▼
Validate Queue ID
    │
    ▼
Open Transaction (readwrite)
    │
    ▼
Check if Item Exists
    │
    ▼
Delete from IndexedDB
    │
    ▼
Return boolean (success/failure)
```

### Method Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| queueId | number | Yes | ID of item to remove |

### Return Values

| Return | Meaning |
|--------|---------|
| true | Item successfully deleted |
| false | Item not found or error |

### Batch Deletion

| Method | Parameters | Return |
|--------|------------|--------|
| removeBatch | queueIds: number[] | Promise<number> (count deleted) |
| removeByStatus | status: string | Promise<number> (count deleted) |

### Usage Scenarios

| Scenario | Method Call | Purpose |
|----------|-------------|---------|
| Remove synced item | removeFromQueue(123) | Clean up after sync |
| Remove failed items | removeByStatus('failed') | Clear dead letters |
| Batch cleanup | removeBatch([1, 2, 3]) | Multiple deletions |

### Transaction Safety

| Aspect | Implementation |
|--------|---------------|
| Atomicity | Single transaction per operation |
| Rollback | Auto-rollback on error |
| Isolation | readwrite lock during delete |

### Error Handling

| Error | Action |
|-------|--------|
| Invalid ID | Throw validation error |
| Item not found | Return false |
| Transaction error | Log and return false |
| Database closed | Throw error |

### Expected Outcome
- removeFromQueue deletes items by ID
- Validation prevents invalid operations
- Transaction ensures atomic deletion
- Boolean return indicates success/failure
- Batch methods for efficiency
- Status-based deletion available
- Error handling prevents crashes

### Verification Checklist
- [ ] removeFromQueue method defined
- [ ] Queue ID validation implemented
- [ ] Item existence checked before deletion
- [ ] IndexedDB delete operation works
- [ ] Success/failure boolean returned
- [ ] Error handling implemented
- [ ] removeBatch method created
- [ ] removeByStatus method created
- [ ] Methods tested with valid and invalid IDs

---

## Task 56: Create Queue Priority

### Overview
Implement the priority system for the synchronization queue. This system assigns priority levels to different operation types, ensuring critical operations (like sales and payments) are synced before less critical ones (like settings). The priority system uses numeric values where lower numbers indicate higher priority.

### Dependencies
- Task 55: Create removeFromQueue

### Instructions

1. **Define priority level constants**
   - Create enum or constant object for priority levels
   - HIGH = 1 (critical operations)
   - MEDIUM = 2 (normal operations)
   - LOW = 3 (non-critical operations)
   - Export for use throughout application

2. **Create priority configuration map**
   - Map operation types to default priorities
   - Define object with type as key, priority as value
   - Include all supported operation types
   - Make configurable for customization

3. **Define high priority operations**
   - Sales: priority 1 (revenue critical)
   - Payments: priority 1 (financial transactions)
   - Refunds: priority 1 (customer service)
   - Cash register: priority 1 (accounting)

4. **Define medium priority operations**
   - Inventory updates: priority 2 (stock accuracy)
   - Customer data: priority 2 (CRM updates)
   - Product updates: priority 2 (catalog changes)
   - Purchase orders: priority 2 (procurement)

5. **Define low priority operations**
   - Settings: priority 3 (configuration)
   - Logs: priority 3 (audit trail)
   - Reports: priority 3 (analytics)
   - UI preferences: priority 3 (user settings)

6. **Create getPriorityForType method**
   - Add method to SyncQueue class
   - Accept operation type parameter
   - Return corresponding priority level
   - Fall back to MEDIUM if type not found

7. **Update addToQueue to use priorities**
   - Modify addToQueue from Task 53
   - Use getPriorityForType if priority not provided
   - Allow manual priority override
   - Validate priority is in range 1-3

8. **Add priority validation method**
   - Create validatePriority(priority: number)
   - Check priority is 1, 2, or 3
   - Throw error if invalid
   - Return validated priority

9. **Create priority display helpers**
   - Add getPriorityLabel(priority: number): string
   - Return 'High', 'Medium', or 'Low'
   - Use for UI display
   - Export for components

### Priority Level Constants

```
Priority Levels
├── HIGH = 1
│   ├── sale
│   ├── payment
│   ├── refund
│   └── cash_register
├── MEDIUM = 2
│   ├── inventory
│   ├── customer
│   ├── product
│   └── purchase_order
└── LOW = 3
    ├── settings
    ├── logs
    ├── reports
    └── ui_preferences
```

### Priority Configuration Map

| Type | Priority | Reason |
|------|----------|--------|
| sale | 1 | Revenue critical |
| payment | 1 | Financial data |
| refund | 1 | Customer service |
| cash_register | 1 | Accounting |
| inventory | 2 | Stock accuracy |
| customer | 2 | CRM important |
| product | 2 | Catalog updates |
| purchase_order | 2 | Procurement |
| settings | 3 | Can wait |
| logs | 3 | Non-critical |
| reports | 3 | Analytics |
| ui_preferences | 3 | User comfort |

### Priority Impact on Sync Order

| Scenario | Queue Items | Sync Order |
|----------|-------------|------------|
| Mixed priorities | Sale(1), Log(3), Inventory(2) | Sale → Inventory → Log |
| Same priority | Sale A(1), Sale B(1) | FIFO: A → B |
| Override priority | Urgent log(1) | Syncs before normal logs(3) |

### Priority Methods

| Method | Parameters | Return | Purpose |
|--------|------------|--------|---------|
| getPriorityForType | type: string | number | Get default priority |
| validatePriority | priority: number | number | Validate range |
| getPriorityLabel | priority: number | string | Display name |

### Priority Constants Export

| Constant | Value | Usage |
|----------|-------|-------|
| PRIORITY_HIGH | 1 | Critical operations |
| PRIORITY_MEDIUM | 2 | Normal operations |
| PRIORITY_LOW | 3 | Non-critical operations |

### Configuration Object Structure

```
QueuePriorities = {
  sale: 1,
  payment: 1,
  refund: 1,
  cash_register: 1,
  inventory: 2,
  customer: 2,
  product: 2,
  purchase_order: 2,
  settings: 3,
  logs: 3,
  reports: 3,
  ui_preferences: 3
}
```

### Expected Outcome
- Priority constants defined and exported
- Priority configuration map created
- Operation types mapped to priorities
- getPriorityForType method works correctly
- addToQueue uses priority system
- Priority validation prevents invalid values
- Display helpers for UI components
- Critical operations synced first

### Verification Checklist
- [ ] Priority constants defined (HIGH, MEDIUM, LOW)
- [ ] Priority configuration map created
- [ ] All operation types have assigned priorities
- [ ] getPriorityForType method implemented
- [ ] addToQueue updated to use priorities
- [ ] validatePriority method works
- [ ] getPriorityLabel method implemented
- [ ] Priority system tested with mixed operations
- [ ] Constants exported for external use

---

## Task 57: Create Queue Ordering

### Overview
Implement the queue ordering logic that determines the sequence in which items are processed during synchronization. The ordering system uses a two-level sort: first by priority (ascending), then by creation time (FIFO within each priority level). This ensures critical operations are processed first while maintaining fairness within priority levels.

### Dependencies
- Task 56: Create Queue Priority

### Instructions

1. **Define ordering criteria**
   - Primary sort: priority (1, 2, 3 ascending)
   - Secondary sort: created_at (oldest first - FIFO)
   - Tertiary sort: id (ascending for deterministic order)
   - Document ordering rules clearly

2. **Create compareQueueItems function**
   - Add private method to SyncQueue class
   - Accept two SyncQueueItem parameters
   - Return number (-1, 0, 1) for sorting
   - Implement multi-level comparison

3. **Implement priority comparison**
   - First compare priority values
   - Lower priority number = higher priority
   - If priorities equal, proceed to time comparison
   - Return -1 if a has higher priority, 1 if b does

4. **Implement time-based comparison**
   - Compare created_at timestamps
   - Earlier timestamp = higher priority (FIFO)
   - If times equal, proceed to ID comparison
   - Convert dates to timestamps for comparison

5. **Implement ID-based comparison**
   - Compare queue item IDs as tiebreaker
   - Lower ID = earlier in queue
   - Ensures deterministic ordering
   - Return -1 if a.id < b.id, 1 otherwise

6. **Update getQueue method**
   - Modify getQueue from Task 54
   - Apply compareQueueItems to sort results
   - Use Array.sort with comparison function
   - Ensure stable sort behavior

7. **Create getNextBatch method**
   - Add method to get next N items to process
   - Accept batchSize parameter (default 50)
   - Filter for 'pending' status only
   - Sort using ordering rules
   - Return first N items

8. **Add ordering visualization helper**
   - Create method to explain item position
   - Return string explaining why item is at position
   - Include priority level, queue position
   - Use for debugging and UI display

### Queue Ordering Algorithm

```
Compare Items (A, B):
    │
    ▼
Compare Priority
    │
    ├─ A.priority < B.priority → A comes first
    ├─ A.priority > B.priority → B comes first
    └─ A.priority = B.priority → Continue
         │
         ▼
    Compare created_at
         │
         ├─ A.created_at < B.created_at → A comes first
         ├─ A.created_at > B.created_at → B comes first
         └─ A.created_at = B.created_at → Continue
              │
              ▼
         Compare ID
              │
              ├─ A.id < B.id → A comes first
              └─ A.id > B.id → B comes first
```

### Sort Levels

| Level | Field | Order | Purpose |
|-------|-------|-------|---------|
| 1 | priority | ASC | Critical first |
| 2 | created_at | ASC | FIFO within priority |
| 3 | id | ASC | Deterministic tiebreaker |

### Ordering Examples

| Scenario | Items | Result Order |
|----------|-------|--------------|
| Different priorities | Sale(1), Log(3), Inv(2) | Sale, Inv, Log |
| Same priority | Sale A(1, 10:00), Sale B(1, 10:05) | Sale A, Sale B |
| Same time | Sale A(1, 10:00, id=5), Sale B(1, 10:00, id=3) | Sale B, Sale A |

### Comparison Function Return Values

| Return | Meaning |
|--------|---------|
| -1 | A comes before B |
| 0 | A and B are equal (rare) |
| 1 | B comes before A |

### getNextBatch Method

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| batchSize | number | 50 | Items to retrieve |
| status | string | 'pending' | Filter by status |

### Batch Selection Flow

```
getNextBatch(size)
    │
    ▼
Get pending items
    │
    ▼
Sort by priority & time
    │
    ▼
Take first N items
    │
    ▼
Return batch
```

### Ordering Guarantees

| Guarantee | Implementation |
|-----------|---------------|
| Priority respected | Always sort by priority first |
| FIFO within priority | Timestamp secondary sort |
| Deterministic | ID tiebreaker ensures consistency |
| Stable | Array.sort maintains relative order |

### Expected Outcome
- Queue ordering rules implemented
- compareQueueItems function works correctly
- Multi-level sorting (priority, time, ID)
- getQueue returns sorted items
- getNextBatch retrieves items in correct order
- FIFO maintained within priority levels
- Deterministic ordering for consistency

### Verification Checklist
- [ ] compareQueueItems method implemented
- [ ] Priority comparison works correctly
- [ ] Time-based FIFO comparison works
- [ ] ID-based tiebreaker implemented
- [ ] getQueue uses ordering function
- [ ] getNextBatch method created
- [ ] Batch respects ordering rules
- [ ] Ordering tested with mixed data
- [ ] Results are deterministic and repeatable

---

## Task 58: Create Sync Processor

### Overview
Implement the sync processor that orchestrates the synchronization of queued items with the server. This is the core component that monitors online status, retrieves pending items, groups them by type, processes them in batches, handles results, and emits progress events. The processor ensures reliable data synchronization when the application is online.

### Dependencies
- Task 57: Create Queue Ordering

### Instructions

1. **Define processor state properties**
   - Add isProcessing boolean flag to class
   - Add currentBatch array for tracking
   - Add processedCount for progress tracking
   - Add totalCount for progress calculation
   - Initialize all flags in constructor

2. **Create processQueue method**
   - Add public async method processQueue()
   - Entry point for sync operations
   - Check if already processing (prevent concurrent runs)
   - Check online status before proceeding
   - Return early if offline or already processing

3. **Implement processing flag management**
   - Set isProcessing = true at start
   - Use try-finally to ensure flag reset
   - Prevents multiple simultaneous syncs
   - Log processing start and end

4. **Retrieve pending queue items**
   - Call getQueue('pending') to get items
   - Store total count for progress tracking
   - Exit early if queue is empty
   - Log queue size for monitoring

5. **Group items by type**
   - Create Map or object to group items
   - Group by type field (sale, inventory, etc.)
   - Maintain order within each group
   - Prepare for batch processing

6. **Process each group sequentially**
   - Iterate through type groups
   - Process one type at a time
   - Await completion before next type
   - Handle errors per group

7. **Call batch processing for each group**
   - For each group, call processBatch (Task 59)
   - Pass items of same type together
   - Wait for batch to complete
   - Handle batch results

8. **Update item statuses during processing**
   - Before processing: set status to 'syncing'
   - After success: set status to 'synced'
   - After failure: increment retries
   - After max retries: set status to 'failed'

9. **Emit progress events**
   - Calculate progress percentage
   - Emit sync:progress event with data
   - Include: processed count, total count, percent
   - Update UI in real-time

10. **Handle processing errors**
    - Wrap processing in try-catch
    - Log errors for debugging
    - Continue with remaining items
    - Don't let one failure stop entire sync

11. **Clean up after processing**
    - Remove successfully synced items (optional)
    - Or leave for cleanup task (Task 67)
    - Reset processing flag
    - Emit completion event

12. **Create auto-sync trigger methods**
    - Add startAutoSync() method
    - Listen to online event
    - Call processQueue when online
    - Add stopAutoSync() for cleanup

### Sync Processor Flow

```
processQueue()
    │
    ▼
Check if already processing → Return if true
    │
    ▼
Check online status → Return if offline
    │
    ▼
Set isProcessing = true
    │
    ▼
Get pending items from queue
    │
    ▼
Group items by type
    │
    ▼
For each type group:
    │
    ├─ Update status to 'syncing'
    ├─ Process batch
    ├─ Handle results
    ├─ Update statuses
    └─ Emit progress
    │
    ▼
Clean up
    │
    ▼
Set isProcessing = false
    │
    ▼
Emit completion event
```

### Processor State

| Property | Type | Purpose |
|----------|------|---------|
| isProcessing | boolean | Prevent concurrent syncs |
| currentBatch | SyncQueueItem[] | Track current items |
| processedCount | number | Progress tracking |
| totalCount | number | Progress calculation |

### Type Grouping

| Type | Items | Batch Endpoint |
|------|-------|----------------|
| sale | All sale items | POST /api/sales/batch/ |
| inventory | All inventory items | POST /api/inventory/batch/ |
| customer | All customer items | POST /api/customers/batch/ |
| payment | All payment items | POST /api/payments/batch/ |

### Processing States

| State | Status | Action |
|-------|--------|--------|
| Before | pending | Change to 'syncing' |
| Success | syncing | Change to 'synced' |
| Failure | syncing | Increment retries, back to 'pending' |
| Max retries | syncing | Change to 'failed' |

### Progress Event Data

| Field | Type | Description |
|-------|------|-------------|
| processed | number | Items synced |
| total | number | Total items |
| percent | number | Progress percentage |
| currentType | string | Current type being processed |

### Auto-sync Triggers

| Trigger | Method | Action |
|---------|--------|--------|
| Online event | startAutoSync() | Begin processing |
| Manual call | processQueue() | Begin processing |
| Periodic | Timer-based | Optional periodic sync |

### Error Handling

| Error Type | Action |
|------------|--------|
| Network error | Retry with backoff (Task 60) |
| Server error | Mark item for retry |
| Validation error | Move to failed queue |
| Unexpected error | Log and continue |

### Concurrency Control

| Scenario | Handling |
|----------|----------|
| Multiple calls | isProcessing flag prevents |
| Offline during sync | Abort current batch |
| User logout | Stop auto-sync |

### Expected Outcome
- Sync processor orchestrates queue synchronization
- Items grouped by type for batch processing
- Progress tracked and reported
- Status updates reflect processing state
- Error handling prevents sync failures
- Auto-sync triggers on online event
- Concurrent processing prevented
- Ready for batch processing implementation

### Verification Checklist
- [ ] processQueue method implemented
- [ ] isProcessing flag prevents concurrent syncs
- [ ] Online status checked before processing
- [ ] Pending items retrieved correctly
- [ ] Items grouped by type
- [ ] Each group processed sequentially
- [ ] Status updates during processing
- [ ] Progress events emitted
- [ ] Error handling implemented
- [ ] Auto-sync triggers created
- [ ] Method tested with sample queue

---

## Task 59: Create Batch Sync

### Overview
Implement batch synchronization that sends multiple queue items to the server in a single API request. Batching improves sync performance by reducing HTTP overhead and allows the server to process related operations atomically. This method groups items by type and sends them to type-specific batch endpoints.

### Dependencies
- Task 58: Create Sync Processor

### Instructions

1. **Define batch size constant**
   - Set maximum batch size to 50 items
   - Prevent overly large requests
   - Export as configuration constant
   - Allow override via settings

2. **Create processBatch method**
   - Add private async method processBatch()
   - Accept items array parameter
   - Accept type parameter for endpoint selection
   - Return Promise<BatchResult>

3. **Validate batch input**
   - Check items array is not empty
   - Verify all items are same type
   - Check batch size doesn't exceed limit
   - Split into multiple batches if needed

4. **Transform items for API**
   - Extract data payload from each item
   - Include queue ID for tracking
   - Add metadata (timestamp, retries)
   - Build batch request payload

5. **Determine batch endpoint**
   - Map type to API endpoint
   - sale → POST /api/sales/batch/
   - inventory → POST /api/inventory/batch/
   - customer → POST /api/customers/batch/
   - payment → POST /api/payments/batch/

6. **Send batch request to server**
   - Use fetch or axios for HTTP request
   - Set proper headers (auth, content-type)
   - Include tenant context in headers
   - Set reasonable timeout (30 seconds)

7. **Handle successful batch response**
   - Parse response JSON
   - Extract results for each item
   - Update item statuses based on results
   - Return success count

8. **Handle partial batch success**
   - Server may succeed some, fail others
   - Parse individual results from response
   - Update statuses per item
   - Failed items stay in queue for retry

9. **Handle batch failure**
   - Network errors, server errors
   - All items remain in queue
   - Increment retry count for all items
   - Return failure result

10. **Update queue items after batch**
    - Successful items: set status 'synced'
    - Failed items: increment retries
    - Update last_attempt timestamp
    - Store error message if provided

11. **Implement batch splitting**
    - If batch > 50 items, split into chunks
    - Process chunks sequentially
    - Aggregate results from all chunks
    - Maintain order within chunks

12. **Add batch progress tracking**
    - Emit batch:start event
    - Emit batch:progress during processing
    - Emit batch:complete with results
    - Include batch metadata

### Batch Sync Flow

```
processBatch(items, type)
    │
    ▼
Validate batch
    │
    ▼
Split if > 50 items
    │
    ▼
For each chunk:
    │
    ├─ Transform items to API format
    ├─ Determine endpoint
    ├─ Send POST request
    ├─ Parse response
    ├─ Update item statuses
    └─ Track progress
    │
    ▼
Aggregate results
    │
    ▼
Return BatchResult
```

### Batch Configuration

| Setting | Value | Purpose |
|---------|-------|---------|
| MAX_BATCH_SIZE | 50 | Prevent large requests |
| BATCH_TIMEOUT | 30s | Request timeout |
| RETRY_ON_TIMEOUT | Yes | Retry timeout errors |

### Batch Request Format

| Field | Type | Description |
|-------|------|-------------|
| items | Array | Item payloads |
| metadata | Object | Batch info |
| queue_ids | Array | Track queue items |

### Batch Endpoints

| Type | Endpoint | Method |
|------|----------|--------|
| sale | /api/sales/batch/ | POST |
| inventory | /api/inventory/batch/ | POST |
| customer | /api/customers/batch/ | POST |
| payment | /api/payments/batch/ | POST |
| settings | /api/settings/batch/ | POST |

### Batch Response Format

| Field | Type | Description |
|-------|------|-------------|
| success | boolean | Overall success |
| results | Array | Per-item results |
| count | number | Items processed |
| errors | Array | Error details |

### Per-Item Result

| Field | Type | Description |
|-------|------|-------------|
| queue_id | number | Queue item ID |
| success | boolean | Item success |
| error | string | Error message |
| data | Object | Created/updated data |

### Batch Result Type

| Field | Type | Description |
|-------|------|-------------|
| totalItems | number | Items in batch |
| successCount | number | Successful items |
| failedCount | number | Failed items |
| errors | Array | Error details |

### Error Handling

| Error Type | Action |
|------------|--------|
| Network error | Return all failed |
| Timeout | Return all failed for retry |
| 4xx error | Inspect per-item results |
| 5xx error | Return all failed for retry |
| Partial success | Update statuses individually |

### Batch Splitting Example

```
Input: 125 items
Split into:
  - Batch 1: 50 items
  - Batch 2: 50 items
  - Batch 3: 25 items
Process sequentially
Aggregate: 125 total, X success, Y failed
```

### Expected Outcome
- Batch processing sends multiple items together
- Maximum 50 items per batch request
- Type-specific endpoints called correctly
- Response parsed for per-item results
- Statuses updated based on results
- Large batches split automatically
- Progress events emitted
- Error handling for network/server issues
- Performance improved vs individual requests

### Verification Checklist
- [ ] processBatch method implemented
- [ ] Batch size limited to 50 items
- [ ] Items transformed to API format
- [ ] Correct endpoints called per type
- [ ] HTTP request sent successfully
- [ ] Response parsed correctly
- [ ] Item statuses updated based on results
- [ ] Batch splitting works for large queues
- [ ] Error handling implemented
- [ ] Progress events emitted
- [ ] Method tested with sample batches

---

## Task 60: Create Retry Logic

### Overview
Implement retry logic with exponential backoff for failed synchronization attempts. This ensures transient failures (network issues, temporary server problems) don't result in permanent data loss. The retry system uses increasing delays between attempts and respects maximum retry limits before moving items to the failed queue.

### Dependencies
- Task 59: Create Batch Sync

### Instructions

1. **Define retry configuration constants**
   - MAX_RETRIES = 5 attempts
   - INITIAL_DELAY = 1000ms (1 second)
   - BACKOFF_FACTOR = 2 (exponential)
   - MAX_DELAY = 300000ms (5 minutes)
   - Export as configuration

2. **Create calculateRetryDelay function**
   - Add private method to SyncQueue class
   - Accept retries count parameter
   - Calculate delay using exponential backoff
   - Return delay in milliseconds

3. **Implement exponential backoff formula**
   - delay = INITIAL_DELAY * (BACKOFF_FACTOR ^ retries)
   - Example: 1s, 2s, 4s, 8s, 16s
   - Cap at MAX_DELAY (5 minutes)
   - Add jitter for distributed retries (optional)

4. **Create shouldRetry method**
   - Accept queue item parameter
   - Check if retries < MAX_RETRIES
   - Check if appropriate time has passed since last attempt
   - Return boolean indicating if retry allowed

5. **Implement retry scheduling**
   - After batch failure, calculate next retry time
   - Store next_retry_at timestamp on item
   - Don't include item in next batch until time passes
   - Use IndexedDB to persist retry times

6. **Update getQueue to respect retry delays**
   - Modify getQueue from Task 54
   - Filter out items with future next_retry_at
   - Only return items ready for retry
   - Maintain priority ordering

7. **Increment retry counter on failure**
   - In processBatch error handling
   - Increment item.retries by 1
   - Update last_attempt timestamp
   - Calculate and store next_retry_at

8. **Move to failed queue after max retries**
   - Check if retries >= MAX_RETRIES
   - Change status to 'failed'
   - Store final error message
   - Emit failed:max_retries event

9. **Add retry reset capability**
   - Create resetRetries(queueId) method
   - Reset retries to 0
   - Clear error message
   - Set status back to 'pending'
   - Allow manual retry of failed items

10. **Implement intelligent retry**
    - Different retry strategies per error type
    - Network errors: full backoff
    - 429 Rate limit: longer delay
    - 503 Service unavailable: standard backoff
    - 4xx Client errors: minimal retries (1-2)

11. **Add retry metrics**
    - Track retry statistics
    - Count items by retry attempt
    - Calculate average retry delay
    - Expose via getRetryStats method

### Retry Logic Flow

```
Batch Fails
    │
    ▼
For each failed item:
    │
    ├─ Increment retries count
    ├─ Update last_attempt
    ├─ Calculate retry delay
    ├─ Set next_retry_at
    │
    ▼
Check retries < MAX_RETRIES
    │
    ├─ Yes → Status = 'pending', wait for retry
    └─ No → Status = 'failed', move to dead letter
```

### Exponential Backoff Schedule

| Attempt | Calculation | Delay | Total Wait |
|---------|-------------|-------|------------|
| 1 | 1000 * 2^0 | 1s | 1s |
| 2 | 1000 * 2^1 | 2s | 3s |
| 3 | 1000 * 2^2 | 4s | 7s |
| 4 | 1000 * 2^3 | 8s | 15s |
| 5 | 1000 * 2^4 | 16s | 31s |
| Max | Cap at MAX_DELAY | 5m | - |

### Retry Configuration

| Setting | Value | Purpose |
|---------|-------|---------|
| MAX_RETRIES | 5 | Prevent infinite retries |
| INITIAL_DELAY | 1000ms | Start delay |
| BACKOFF_FACTOR | 2 | Exponential growth |
| MAX_DELAY | 300000ms | Cap delay at 5 min |

### Queue Item Retry Fields

| Field | Type | Purpose |
|-------|------|---------|
| retries | number | Attempt count |
| last_attempt | Date | Last try time |
| next_retry_at | Date | Next eligible time |
| error | string | Last error message |

### Retry Eligibility Logic

| Condition | Result |
|-----------|--------|
| retries < MAX_RETRIES AND now >= next_retry_at | Eligible |
| retries >= MAX_RETRIES | Move to failed |
| now < next_retry_at | Wait |

### Error-Specific Retry Strategies

| Error Type | Strategy |
|------------|----------|
| Network timeout | Full exponential backoff |
| 429 Rate limit | 2x normal delay |
| 503 Service unavailable | Standard backoff |
| 500 Server error | Standard backoff |
| 4xx Client error | Max 2 retries, then fail |

### Retry Statistics

| Metric | Description |
|--------|-------------|
| itemsByRetry | Count per retry level |
| avgRetryDelay | Average delay time |
| failedAfterRetries | Items that hit max |
| successAfterRetries | Items that eventually succeeded |

### Jitter Implementation (Optional)

| Purpose | Formula |
|---------|---------|
| Distribute retries | delay * (0.5 + random(0, 0.5)) |
| Prevent thundering herd | Add randomness to delay |

### Expected Outcome
- Retry logic with exponential backoff implemented
- Failed items automatically retried with delays
- Maximum retry limit prevents infinite loops
- Retry delays increase exponentially
- Items move to failed queue after max retries
- getQueue respects retry timing
- Retry counters tracked accurately
- Manual retry reset available
- Intelligent retry per error type

### Verification Checklist
- [ ] Retry configuration constants defined
- [ ] calculateRetryDelay method implemented
- [ ] Exponential backoff formula correct
- [ ] shouldRetry method works
- [ ] Retry scheduling implemented
- [ ] getQueue filters by next_retry_at
- [ ] Retry counter incremented on failure
- [ ] Items moved to failed after max retries
- [ ] resetRetries method created
- [ ] Error-specific strategies implemented
- [ ] Retry statistics tracked
- [ ] Logic tested with simulated failures

---

## Summary

This document covered the foundational components of the sync queue system:

### Completed Tasks
- **Task 51:** SyncQueue class with singleton pattern
- **Task 52:** Queue item type definition
- **Task 53:** addToQueue method for enqueueing operations
- **Task 54:** getQueue method for retrieving items
- **Task 55:** removeFromQueue for cleanup
- **Task 56:** Priority system for operation types
- **Task 57:** Queue ordering with FIFO within priorities
- **Task 58:** Sync processor orchestration
- **Task 59:** Batch synchronization for efficiency
- **Task 60:** Retry logic with exponential backoff

### Key Achievements
- Reliable queue infrastructure established
- Priority-based processing implemented
- Batch sync for performance
- Automatic retry with backoff
- Status tracking throughout lifecycle

### Next Steps
Proceed to [02_Tasks-61-68_Retry-Webhook-Cleanup.md](02_Tasks-61-68_Retry-Webhook-Cleanup.md) to implement:
- Maximum retry limits
- Failed queue (dead letter)
- Queue statistics
- Sync progress events
- Sync webhooks
- Queue persistence
- Queue cleanup
- Verification testing

---

**Document Status:** Complete  
**Last Updated:** 2026-01-31  
**Next Document:** [02_Tasks-61-68_Retry-Webhook-Cleanup.md](02_Tasks-61-68_Retry-Webhook-Cleanup.md)
