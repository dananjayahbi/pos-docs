# Tasks 35-42: Queue Core Operations

> **Phase:** 05 - ERP Core Modules Part 2  
> **SubPhase:** 02 - POS Offline Mode  
> **Group:** C - Transaction Queue Management  
> **Document:** 01 of 03  
> **Tasks Covered:** 35, 36, 37, 38, 39, 40, 41, 42

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-43-48_Limits-Persistence-Recovery.md](02_Tasks-43-48_Limits-Persistence-Recovery.md)

---

## Document Overview

This document covers the core operations of the transaction queue system for offline mode. It establishes the TransactionQueue class, implements fundamental queue operations for adding, tracking, and updating transaction status, and creates the retry counter mechanism.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 35 | Create TransactionQueue class | High |
| 36 | Implement queue_transaction method | Medium |
| 37 | Generate offline transaction ID | Medium |
| 38 | Add queue position tracking | Low |
| 39 | Implement get_pending_transactions | Medium |
| 40 | Implement mark_as_synced | Medium |
| 41 | Implement mark_as_failed | Medium |
| 42 | Create retry counter | Low |

---

## Task 35: Create TransactionQueue class

### Overview
Create a TypeScript class that manages a queue of offline transactions stored in IndexedDB. This class provides the foundation for queuing, tracking, and syncing transactions when the POS terminal operates offline.

### Dependencies
- Task 18: Add offline_mode flag (SubPhase-01)
- Task 31: Create IndexedDB database (Group-B)
- Task 32: Create transactions store (Group-B)

### Instructions

1. **Create transaction queue file structure**
   - Create directory: `frontend/lib/offline/`
   - Create file: `transaction-queue.ts`
   - Create supporting file: `queue-types.ts` for type definitions

2. **Define queue configuration interface**
   - Max retry attempts setting
   - Retry delay intervals (exponential backoff)
   - Queue cleanup age threshold
   - Batch processing size

3. **Define QueuedTransaction interface**
   - `offline_id`: Unique offline transaction identifier
   - `terminal_id`: Terminal where transaction was created
   - `session_id`: POS session that created transaction
   - `created_at`: ISO timestamp of queue entry
   - `synced_at`: ISO timestamp when synced (null if not synced)
   - `status`: PENDING, SYNCING, SYNCED, or FAILED
   - `retry_count`: Number of sync attempts
   - `error_message`: Error details if failed (null otherwise)
   - `depends_on`: Offline ID of dependency transaction (null if none)
   - `payload`: Complete transaction data object

4. **Define TransactionPayload interface**
   - Cart items with products and quantities
   - Payment details and method
   - Customer information (if applicable)
   - Terminal and session metadata
   - Timestamp and currency
   - Tax and discount calculations
   - Grand total amount

5. **Create TransactionQueue class structure**
   - Private database connection property
   - Private configuration property
   - Constructor accepting configuration options
   - Private initialization method
   - Private database reference getter

6. **Implement class initialization**
   - Accept optional configuration in constructor
   - Set default configuration values if not provided
   - Store configuration in private property
   - Prepare database connection (lazy loading)

7. **Create database connection method**
   - Open IndexedDB connection to offline database
   - Reference the transactions object store
   - Handle connection errors gracefully
   - Cache connection for reuse

8. **Add transaction status enum**
   - PENDING: Waiting to be synced
   - SYNCING: Currently being synced to server
   - SYNCED: Successfully synced
   - FAILED: Sync failed after retries

9. **Create queue statistics interface**
   - Count of transactions by status
   - Oldest pending transaction timestamp
   - Last sync attempt timestamp
   - Total queue size

10. **Add error handling types**
    - Queue operation errors
    - Sync errors
    - Database access errors
    - Validation errors

### TransactionQueue Class Structure

| Component | Purpose |
|-----------|---------|
| **Configuration** | Queue behavior settings |
| **Database Connection** | IndexedDB access layer |
| **Transaction Types** | TypeScript interfaces for data |
| **Status Enum** | Transaction lifecycle states |
| **Error Types** | Structured error handling |

### Queue Configuration Settings

| Setting | Default Value | Description |
|---------|---------------|-------------|
| `maxRetries` | 5 | Maximum sync attempts before marking as failed |
| `retryDelays` | [1000, 2000, 5000, 10000, 30000] ms | Exponential backoff delays |
| `cleanupThreshold` | 86400000 ms (24 hours) | Age for cleaning synced transactions |
| `batchSize` | 10 | Number of transactions to process at once |

### Transaction Status Lifecycle

```
[PENDING] ──sync──> [SYNCING] ──success──> [SYNCED] ──cleanup──> [REMOVED]
    │                   │
    │                   └──fail──> [PENDING] (if retries remain)
    │                             or [FAILED] (if max retries)
    │
    └──export/import──> [PENDING]
```

### Expected Outcome
```
frontend/
├── lib/
│   └── offline/
│       ├── transaction-queue.ts   # TransactionQueue class
│       └── queue-types.ts         # Type definitions
```

### Verification Checklist
- [ ] `transaction-queue.ts` file created in correct location
- [ ] `queue-types.ts` file created with all interfaces
- [ ] TransactionQueue class defined with constructor
- [ ] Configuration interface defined with all settings
- [ ] QueuedTransaction interface includes all required fields
- [ ] TransactionPayload interface covers all transaction data
- [ ] Status enum includes all four states
- [ ] Database connection method defined
- [ ] Error types defined for queue operations
- [ ] Class follows TypeScript best practices

---

## Task 36: Implement queue_transaction method

### Overview
Implement the core method that adds a new transaction to the offline queue when the terminal is offline or connectivity is uncertain.

### Dependencies
- Task 35: Create TransactionQueue class
- Task 37: Generate offline transaction ID (can be implemented in parallel)

### Instructions

1. **Define method signature**
   - Method name: `queueTransaction`
   - Accept transaction payload parameter
   - Accept optional dependency offline_id parameter
   - Return Promise resolving to offline transaction ID

2. **Validate transaction payload**
   - Check that payload is not null or undefined
   - Verify required fields exist (terminal_id, session_id, items)
   - Validate cart has at least one item
   - Verify grand total is positive
   - Validate payment method is specified

3. **Generate offline transaction ID**
   - Call offline ID generator (Task 37)
   - Ensure ID is unique in queue
   - Handle ID collision (regenerate if needed)

4. **Create queued transaction object**
   - Set offline_id from generated ID
   - Set terminal_id from payload
   - Set session_id from payload
   - Set created_at to current ISO timestamp
   - Set synced_at to null
   - Set status to PENDING
   - Set retry_count to 0
   - Set error_message to null
   - Set depends_on from parameter (or null)
   - Set payload from parameter

5. **Determine queue position**
   - Query existing pending transactions
   - Count transactions ahead in queue
   - Calculate position for new transaction

6. **Store transaction in IndexedDB**
   - Open transactions object store with readwrite mode
   - Add queued transaction object
   - Handle storage quota errors
   - Handle duplicate key errors

7. **Update queue position tracking**
   - Store position metadata with transaction
   - Update queue order index
   - Ensure chronological ordering

8. **Emit queue status change event**
   - Notify listeners of new pending transaction
   - Include queue statistics in event
   - Allow UI components to update

9. **Handle errors gracefully**
   - Wrap entire operation in try-catch
   - Log errors with transaction context
   - Return meaningful error messages
   - Don't lose transaction data on error

10. **Return offline transaction ID**
    - Resolve promise with offline_id
    - Allow caller to reference queued transaction
    - Enable dependency tracking for subsequent transactions

### Validation Rules

| Field | Validation Rule |
|-------|----------------|
| **payload** | Not null, is object |
| **terminal_id** | Non-empty string, matches format |
| **session_id** | Non-empty string, valid session |
| **items** | Array with length > 0 |
| **grand_total** | Number > 0 |
| **payment_method** | Valid payment method string |
| **customer_id** | Optional, but valid format if present |

### Queue Position Calculation

```
position = count(PENDING transactions where created_at < this.created_at) + 1

Example:
- Existing queue: 3 PENDING, 2 SYNCING, 1 FAILED
- New transaction position: 4 (after the 3 pending)
```

### Error Handling

| Error Type | Handling Strategy |
|------------|------------------|
| **Validation Error** | Throw immediately with field details |
| **Storage Quota** | Attempt cleanup, then retry once |
| **Duplicate ID** | Regenerate ID, retry up to 3 times |
| **Database Error** | Log error, throw with context |

### Expected Outcome
- New transaction added to IndexedDB queue
- Offline transaction ID generated and returned
- Queue position assigned and tracked
- Status set to PENDING
- Queue event emitted to listeners

### Verification Checklist
- [ ] `queueTransaction` method implemented in TransactionQueue class
- [ ] Method accepts transaction payload parameter
- [ ] Method accepts optional depends_on parameter
- [ ] Payload validation includes all required fields
- [ ] Offline transaction ID is generated
- [ ] Queued transaction object created with all properties
- [ ] Transaction stored in IndexedDB transactions store
- [ ] Queue position calculated and tracked
- [ ] Error handling covers all failure scenarios
- [ ] Method returns Promise<string> with offline_id

---

## Task 37: Generate offline transaction ID

### Overview
Create a utility function that generates unique offline transaction IDs following the format: `OFFLINE-{TERMINAL}-{TIMESTAMP}-{SEQUENCE}`.

### Dependencies
- Task 35: Create TransactionQueue class

### Instructions

1. **Create ID generator utility file**
   - Create file: `frontend/lib/offline/id-generator.ts`
   - Export function: `generateOfflineTransactionId`

2. **Define function signature**
   - Accept terminal ID parameter
   - Accept optional sequence number parameter
   - Return string (offline transaction ID)

3. **Validate terminal ID format**
   - Ensure terminal ID is provided
   - Validate format (alphanumeric, 2-4 characters)
   - Convert to uppercase
   - Pad to 3 characters if needed

4. **Generate timestamp component**
   - Get current Unix timestamp in seconds
   - Convert to string
   - Use as middle component of ID

5. **Handle sequence number**
   - If sequence provided, use it
   - If not provided, default to 001
   - Format as 3-digit zero-padded string (001, 002, etc.)

6. **Construct offline transaction ID**
   - Format: `OFFLINE-{TERMINAL}-{TIMESTAMP}-{SEQUENCE}`
   - Use hyphens as separators
   - All components uppercase

7. **Add ID validation function**
   - Create `isValidOfflineId` helper function
   - Check format matches expected pattern
   - Return boolean

8. **Add ID parsing function**
   - Create `parseOfflineId` helper function
   - Extract terminal, timestamp, sequence components
   - Return parsed object or null if invalid

9. **Create sequence generator helper**
   - Track sequence numbers for same second
   - Reset sequence when second changes
   - Ensure uniqueness within same second

10. **Add collision detection**
    - Check if generated ID already exists in queue
    - Increment sequence and retry if collision detected
    - Max retry attempts: 999 (sequence limit)

### Offline Transaction ID Format

| Component | Format | Example | Description |
|-----------|--------|---------|-------------|
| **Prefix** | OFFLINE | OFFLINE | Static identifier |
| **Terminal** | 3 chars | T01 | Terminal code (padded) |
| **Timestamp** | Unix seconds | 1704067200 | Creation time |
| **Sequence** | 3 digits | 001 | Counter for same second |

**Complete Example:** `OFFLINE-T01-1704067200-001`

### Terminal ID Formatting Rules

| Input | Formatted Output | Rule Applied |
|-------|------------------|--------------|
| `T1` | `T01` | Left-pad with zero |
| `abc` | `ABC` | Convert to uppercase |
| `T100` | `T100` | Use as-is (within limit) |
| `terminal-01` | Error | Invalid format |

### Sequence Counter Logic

```
If current timestamp == last timestamp:
  sequence++
Else:
  sequence = 1
  last_timestamp = current_timestamp

Return formatted sequence (e.g., 001, 002, ...)
```

### ID Parsing Result

```typescript
interface ParsedOfflineId {
  prefix: string;        // "OFFLINE"
  terminal: string;      // "T01"
  timestamp: number;     // 1704067200
  sequence: number;      // 1
  isValid: boolean;      // true
}
```

### Expected Outcome
```
frontend/
├── lib/
│   └── offline/
│       ├── id-generator.ts        # ID generation utilities
│       ├── queue-types.ts
│       └── transaction-queue.ts
```

### Verification Checklist
- [ ] `id-generator.ts` file created
- [ ] `generateOfflineTransactionId` function implemented
- [ ] Function accepts terminal_id parameter
- [ ] Terminal ID formatted to 3 characters
- [ ] Timestamp generated in Unix seconds
- [ ] Sequence number formatted as 3-digit string
- [ ] ID follows format: OFFLINE-{TERMINAL}-{TIMESTAMP}-{SEQUENCE}
- [ ] `isValidOfflineId` validation function implemented
- [ ] `parseOfflineId` parsing function implemented
- [ ] Sequence counter prevents collisions within same second

---

## Task 38: Add queue position tracking

### Overview
Implement functionality to track and retrieve the position of each transaction in the queue, enabling users and the system to understand the order of processing.

### Dependencies
- Task 35: Create TransactionQueue class
- Task 36: Implement queue_transaction method

### Instructions

1. **Define position metadata interface**
   - Position number in queue
   - Total transactions in queue
   - Estimated wait time (optional)

2. **Add position tracking to QueuedTransaction**
   - Add optional `position` property to interface
   - Store position when transaction is queued
   - Update position when queue changes

3. **Create getTransactionPosition method**
   - Accept offline transaction ID parameter
   - Query IndexedDB for transaction
   - Calculate current position in PENDING queue
   - Return position number or null if not found

4. **Implement position calculation logic**
   - Count PENDING transactions created before target
   - Add 1 to get 1-based position
   - Exclude SYNCING, SYNCED, and FAILED from count
   - Sort by created_at timestamp

5. **Create getAllPositions method**
   - Query all PENDING transactions
   - Sort by created_at ascending
   - Assign position numbers (1, 2, 3, ...)
   - Return map of offline_id to position

6. **Update positions after queue changes**
   - Recalculate positions after sync completes
   - Recalculate positions after transaction marked as failed
   - Recalculate positions after cleanup removes transactions

7. **Create getQueueLength method**
   - Count all PENDING transactions
   - Return total number waiting to sync
   - Exclude other statuses

8. **Add position to queue events**
   - Include position in transaction queued event
   - Include position changes in status update events
   - Allow UI to display position to user

9. **Create position lookup optimization**
   - Cache position calculations
   - Invalidate cache on queue modifications
   - Balance accuracy vs performance

10. **Handle edge cases**
    - Position for non-existent transaction (return null)
    - Position for non-PENDING transaction (return null or 0)
    - Empty queue (return 0)

### Position Calculation Example

```
Queue State:
- OFFLINE-T01-1704067200-001 (PENDING, created 10:00:00)
- OFFLINE-T01-1704067210-001 (PENDING, created 10:00:10)
- OFFLINE-T01-1704067205-001 (SYNCING, created 10:00:05)
- OFFLINE-T01-1704067220-001 (PENDING, created 10:00:20)

Positions:
- OFFLINE-T01-1704067200-001 → Position 1
- OFFLINE-T01-1704067210-001 → Position 2
- OFFLINE-T01-1704067205-001 → Not in queue (SYNCING)
- OFFLINE-T01-1704067220-001 → Position 3
```

### Position Metadata Interface

| Property | Type | Description |
|----------|------|-------------|
| `position` | number | 1-based position in PENDING queue |
| `totalPending` | number | Total PENDING transactions |
| `estimatedWait` | number or null | Estimated seconds until sync (optional) |

### Queue Position Events

| Event | Trigger | Data Included |
|-------|---------|---------------|
| **transaction_queued** | New transaction added | offline_id, position, totalPending |
| **transaction_synced** | Transaction completed | offline_id, positions_updated |
| **position_updated** | Queue order changed | affected_transaction_ids, new_positions |

### Expected Outcome
- Position tracking implemented in TransactionQueue class
- `getTransactionPosition` method returns accurate position
- `getAllPositions` method returns position map
- Positions recalculated after queue modifications
- Position included in queue events

### Verification Checklist
- [ ] Position metadata interface defined
- [ ] `getTransactionPosition` method implemented
- [ ] Method accepts offline_id parameter
- [ ] Position calculated based on PENDING transactions only
- [ ] Position sorted by created_at timestamp
- [ ] `getAllPositions` method returns position map
- [ ] `getQueueLength` method returns PENDING count
- [ ] Positions recalculated after sync/failure
- [ ] Position included in queue events
- [ ] Edge cases handled (not found, empty queue)

---

## Task 39: Implement get_pending_transactions

### Overview
Implement a method to retrieve all transactions that are pending synchronization, providing visibility into the offline queue state.

### Dependencies
- Task 35: Create TransactionQueue class
- Task 36: Implement queue_transaction method

### Instructions

1. **Define method signature**
   - Method name: `getPendingTransactions`
   - No required parameters
   - Accept optional filters (terminal_id, date range)
   - Return Promise<QueuedTransaction[]>

2. **Create query for PENDING transactions**
   - Open IndexedDB transactions store
   - Create index on status field if not exists
   - Query where status equals PENDING
   - Handle database errors

3. **Sort results by created_at**
   - Order ascending (oldest first)
   - Maintain FIFO queue order
   - Use IndexedDB cursor for efficiency

4. **Apply optional filters**
   - Filter by terminal_id if provided
   - Filter by date range if provided
   - Filter by depends_on status if specified

5. **Include position information**
   - Calculate position for each transaction
   - Add position to result objects
   - Use position tracking from Task 38

6. **Create result transformation**
   - Convert database records to QueuedTransaction objects
   - Include all properties
   - Ensure payload is properly deserialized

7. **Add pagination support (optional)**
   - Accept limit and offset parameters
   - Return subset of results
   - Include total count in metadata

8. **Handle empty queue**
   - Return empty array if no pending transactions
   - Don't throw error for empty result
   - Log informational message

9. **Create helper method for dependencies**
   - `getPendingWithDependencies`: Returns transactions with their dependencies
   - Include depends_on transaction details
   - Show dependency chain if multi-level

10. **Add error handling**
    - Wrap database operations in try-catch
    - Return empty array on database errors (with logging)
    - Handle cursor iteration errors

### Query Filters

| Filter | Type | Purpose |
|--------|------|---------|
| `terminal_id` | string (optional) | Filter by specific terminal |
| `created_after` | ISO timestamp (optional) | Only transactions after date |
| `created_before` | ISO timestamp (optional) | Only transactions before date |
| `has_dependencies` | boolean (optional) | Only transactions with/without dependencies |

### Sort Order Logic

```
Primary Sort: status (PENDING first)
Secondary Sort: depends_on (null first, then by dependency)
Tertiary Sort: created_at (ascending)

This ensures:
1. PENDING transactions are prioritized
2. Independent transactions come before dependent ones
3. Older transactions are processed first
```

### Pagination Example

```typescript
// Get first 10 pending transactions
const page1 = await queue.getPendingTransactions({ limit: 10, offset: 0 });

// Get next 10
const page2 = await queue.getPendingTransactions({ limit: 10, offset: 10 });
```

### Result with Dependencies

```typescript
[
  {
    offline_id: "OFFLINE-T01-1704067200-001",
    status: "PENDING",
    depends_on: null,
    position: 1,
    // ... other fields
  },
  {
    offline_id: "OFFLINE-T01-1704067210-001",
    status: "PENDING",
    depends_on: "OFFLINE-T01-1704067200-001",
    dependency_status: "PENDING",
    position: 2,
    // ... other fields
  }
]
```

### Expected Outcome
- `getPendingTransactions` method returns all PENDING transactions
- Transactions sorted by created_at ascending
- Optional filters applied correctly
- Position information included
- Empty array returned for empty queue

### Verification Checklist
- [ ] `getPendingTransactions` method implemented
- [ ] Method returns Promise<QueuedTransaction[]>
- [ ] IndexedDB query filters by status PENDING
- [ ] Results sorted by created_at ascending
- [ ] Optional terminal_id filter works
- [ ] Optional date range filters work
- [ ] Position information included in results
- [ ] Empty queue returns empty array (no error)
- [ ] Database errors handled gracefully
- [ ] `getPendingWithDependencies` helper method created (optional)

---

## Task 40: Implement mark_as_synced

### Overview
Implement a method to mark a transaction as successfully synced to the server, updating its status and recording the sync timestamp.

### Dependencies
- Task 35: Create TransactionQueue class
- Task 36: Implement queue_transaction method

### Instructions

1. **Define method signature**
   - Method name: `markAsSynced`
   - Accept offline transaction ID parameter
   - Accept server transaction ID parameter (for reference)
   - Return Promise<boolean> indicating success

2. **Validate parameters**
   - Check offline_id is provided and valid format
   - Check server_transaction_id is provided
   - Throw error if invalid

3. **Retrieve transaction from queue**
   - Query IndexedDB by offline_id
   - Check transaction exists
   - Verify transaction is in SYNCING or PENDING status

4. **Update transaction status**
   - Set status to SYNCED
   - Set synced_at to current ISO timestamp
   - Clear error_message (set to null)
   - Preserve retry_count for analytics

5. **Store server transaction reference**
   - Add server_transaction_id field to queued transaction
   - Allow mapping from offline ID to server ID
   - Enable reconciliation and auditing

6. **Update transaction in IndexedDB**
   - Open transactions store with readwrite mode
   - Put updated transaction object
   - Handle update errors

7. **Emit sync success event**
   - Create event: `transaction_synced`
   - Include offline_id and server_transaction_id
   - Include updated queue statistics
   - Notify UI components

8. **Update dependent transactions**
   - Find transactions with depends_on = this offline_id
   - Update their dependency status metadata
   - Allow dependent transactions to proceed

9. **Trigger cleanup if threshold reached**
   - Check if SYNCED transaction count exceeds threshold
   - Queue cleanup operation if needed
   - Don't block on cleanup

10. **Handle errors**
    - Transaction not found: Return false
    - Already synced: Log warning, return true
    - Database error: Log and throw
    - Return true on success

### Status Transition Rules

| Current Status | Allowed Transition | Notes |
|---------------|-------------------|-------|
| **PENDING** | → SYNCED | Valid (skip SYNCING) |
| **SYNCING** | → SYNCED | Valid (expected flow) |
| **SYNCED** | → SYNCED | Idempotent (log warning) |
| **FAILED** | → SYNCED | Invalid (should retry first) |

### Updated Transaction Fields

| Field | Update |
|-------|--------|
| `status` | Set to SYNCED |
| `synced_at` | Set to current ISO timestamp |
| `error_message` | Clear (set to null) |
| `retry_count` | Keep current value |
| `server_transaction_id` | Set from parameter |

### Sync Success Event

```typescript
{
  type: "transaction_synced",
  offline_id: "OFFLINE-T01-1704067200-001",
  server_transaction_id: "TXN-12345",
  synced_at: "2024-01-01T10:00:30Z",
  queue_stats: {
    pending: 5,
    synced: 15,
    failed: 1
  }
}
```

### Dependency Update Logic

```
When Transaction A is marked as synced:
1. Find all transactions where depends_on = A.offline_id
2. For each dependent transaction B:
   - Check if B's status is still PENDING
   - If yes, B is now eligible for sync
   - Emit dependency_resolved event
```

### Expected Outcome
- Transaction status updated to SYNCED
- Sync timestamp recorded
- Server transaction ID stored
- Event emitted for UI updates
- Dependent transactions notified

### Verification Checklist
- [ ] `markAsSynced` method implemented
- [ ] Method accepts offline_id parameter
- [ ] Method accepts server_transaction_id parameter
- [ ] Transaction retrieved from IndexedDB
- [ ] Status updated to SYNCED
- [ ] synced_at timestamp set to current time
- [ ] error_message cleared
- [ ] server_transaction_id stored
- [ ] Transaction updated in IndexedDB
- [ ] Sync success event emitted
- [ ] Dependent transactions updated
- [ ] Idempotent (safe to call multiple times)

---

## Task 41: Implement mark_as_failed

### Overview
Implement a method to mark a transaction as failed when synchronization attempts are unsuccessful, recording error details for debugging and potential manual intervention.

### Dependencies
- Task 35: Create TransactionQueue class
- Task 36: Implement queue_transaction method
- Task 42: Create retry counter

### Instructions

1. **Define method signature**
   - Method name: `markAsFailed`
   - Accept offline transaction ID parameter
   - Accept error message parameter
   - Accept optional error details object
   - Return Promise<boolean> indicating success

2. **Validate parameters**
   - Check offline_id is provided and valid
   - Check error_message is provided and non-empty
   - Validate error details object if provided

3. **Retrieve transaction from queue**
   - Query IndexedDB by offline_id
   - Check transaction exists
   - Verify transaction is in SYNCING or PENDING status

4. **Check retry limit**
   - Get current retry_count
   - Get max_retries from configuration
   - Determine if max retries reached

5. **Update status based on retry count**
   - If retry_count < max_retries: Set status to PENDING (will retry)
   - If retry_count >= max_retries: Set status to FAILED (no more retries)
   - Increment retry_count in both cases

6. **Record error information**
   - Set error_message to provided message
   - Store error details object if provided
   - Set last_error_at timestamp
   - Preserve error history for analysis

7. **Calculate next retry time (if applicable)**
   - Use exponential backoff formula
   - Get delay from configuration retry delays array
   - Store next_retry_at timestamp
   - Allow sync engine to schedule retry

8. **Update transaction in IndexedDB**
   - Set all updated fields
   - Put updated transaction back to store
   - Handle database errors

9. **Emit failure event**
   - Create event: `transaction_failed` or `transaction_retry_scheduled`
   - Include offline_id, error_message, status
   - Include next_retry_at if status is PENDING
   - Notify UI and logging systems

10. **Create error analytics entry**
    - Log error to analytics/monitoring system
    - Include error type, terminal, timestamp
    - Enable error pattern detection

11. **Handle permanent failure**
    - If status set to FAILED (max retries)
    - Create notification for manual intervention
    - Optionally export failed transaction for recovery

12. **Handle errors in marking failed**
    - Transaction not found: Return false
    - Database error: Log and throw
    - Return true on success

### Status Transition Rules

| Current Status | Retry Count | New Status | Next Action |
|---------------|-------------|------------|-------------|
| **SYNCING** | < max | PENDING | Schedule retry |
| **SYNCING** | >= max | FAILED | Manual intervention |
| **PENDING** | < max | PENDING | Schedule retry |
| **PENDING** | >= max | FAILED | Manual intervention |

### Updated Transaction Fields

| Field | Update |
|-------|--------|
| `status` | PENDING (retry) or FAILED (no retry) |
| `retry_count` | Increment by 1 |
| `error_message` | Set from parameter |
| `last_error_at` | Set to current ISO timestamp |
| `error_details` | Set from optional parameter |
| `next_retry_at` | Set if status is PENDING |

### Exponential Backoff Calculation

```
Retry delays (from config): [1000, 2000, 5000, 10000, 30000] ms

Retry 1: Wait 1 second
Retry 2: Wait 2 seconds
Retry 3: Wait 5 seconds
Retry 4: Wait 10 seconds
Retry 5: Wait 30 seconds
Retry 6+: Status = FAILED (if max_retries = 5)
```

### Error Details Object

```typescript
interface ErrorDetails {
  error_code?: string;        // HTTP status or error code
  error_type?: string;        // Network, validation, server, etc.
  request_id?: string;        // Server request ID for debugging
  stack_trace?: string;       // Error stack trace
  retry_after?: number;       // Server suggested retry delay
}
```

### Failure Event Types

**Retry Scheduled Event:**
```typescript
{
  type: "transaction_retry_scheduled",
  offline_id: "OFFLINE-T01-1704067200-001",
  retry_count: 2,
  next_retry_at: "2024-01-01T10:00:35Z",
  error_message: "Network timeout"
}
```

**Permanent Failure Event:**
```typescript
{
  type: "transaction_failed",
  offline_id: "OFFLINE-T01-1704067200-001",
  retry_count: 5,
  error_message: "Max retries exceeded",
  requires_manual_intervention: true
}
```

### Expected Outcome
- Transaction status updated to PENDING (retry) or FAILED (no retry)
- Retry count incremented
- Error message and details recorded
- Next retry time calculated if applicable
- Event emitted for monitoring

### Verification Checklist
- [ ] `markAsFailed` method implemented
- [ ] Method accepts offline_id, error_message, error_details parameters
- [ ] Transaction retrieved from IndexedDB
- [ ] Retry count checked against max_retries
- [ ] Status set to PENDING if retries remain
- [ ] Status set to FAILED if max retries exceeded
- [ ] retry_count incremented
- [ ] error_message and error_details stored
- [ ] last_error_at timestamp set
- [ ] next_retry_at calculated for PENDING status
- [ ] Transaction updated in IndexedDB
- [ ] Appropriate event emitted (retry or permanent failure)
- [ ] Manual intervention triggered for FAILED status

---

## Task 42: Create retry counter

### Overview
Implement retry counter functionality to track the number of synchronization attempts for each transaction and enforce retry limits.

### Dependencies
- Task 35: Create TransactionQueue class
- Task 36: Implement queue_transaction method

### Instructions

1. **Add retry counter field to QueuedTransaction**
   - Field name: `retry_count`
   - Type: number
   - Initial value: 0
   - Increments with each sync attempt

2. **Define max retry configuration**
   - Configuration field: `maxRetries`
   - Default value: 5
   - Allow customization via constructor
   - Store in configuration object

3. **Create incrementRetryCount method**
   - Accept offline transaction ID parameter
   - Retrieve transaction from IndexedDB
   - Increment retry_count by 1
   - Update transaction in database
   - Return new retry count value

4. **Create getRetryCount method**
   - Accept offline transaction ID parameter
   - Retrieve transaction from IndexedDB
   - Return current retry_count value
   - Return -1 if transaction not found

5. **Create canRetry method**
   - Accept offline transaction ID parameter
   - Retrieve transaction's retry_count
   - Compare with max_retries configuration
   - Return boolean (true if retry_count < max_retries)

6. **Integrate with mark_as_failed**
   - Call incrementRetryCount before marking failed
   - Call canRetry to determine if status should be FAILED
   - Use result to set appropriate status

7. **Add retry count to queue statistics**
   - Include average retry count in stats
   - Include max retry count seen in stats
   - Include count of transactions at max retries

8. **Create resetRetryCount method**
   - Accept offline transaction ID parameter
   - Set retry_count back to 0
   - Used for manual retry requests
   - Update transaction in database

9. **Add retry count to event payloads**
   - Include retry_count in transaction_failed event
   - Include retry_count in transaction_retry_scheduled event
   - Allow UI to display retry information

10. **Create retry counter validation**
    - Ensure retry_count never goes negative
    - Ensure retry_count is always a valid number
    - Handle edge cases (undefined, null)

### Retry Counter Configuration

| Setting | Default | Description |
|---------|---------|-------------|
| `maxRetries` | 5 | Maximum number of sync attempts |
| `resetOnSuccess` | false | Reset counter when transaction syncs (usually not needed) |
| `trackRetryHistory` | true | Keep history of retry timestamps |

### Retry Count Lifecycle

```
Transaction created → retry_count = 0
                           │
                           ▼
                     Sync attempt 1
                           │
                           ├─success─> retry_count = 0 (if resetOnSuccess)
                           │           or keep current value
                           │
                           └─fail────> retry_count = 1
                                            │
                                            ▼
                                      Sync attempt 2
                                            │
                                            └─fail────> retry_count = 2
                                                            │
                                                            ⋮
                                                (continues until max_retries)
                                                            │
                                                            ▼
                                                   retry_count = 5
                                                   status = FAILED
```

### Retry Statistics

```typescript
interface RetryStatistics {
  average_retry_count: number;      // Mean retries across all transactions
  max_retry_count: number;          // Highest retry count in queue
  at_max_retries: number;           // Count of transactions at limit
  total_retries: number;            // Sum of all retry counts
  failed_count: number;             // Transactions marked FAILED
}
```

### Integration Points

| Component | Integration |
|-----------|-------------|
| **queueTransaction** | Initialize retry_count to 0 |
| **markAsFailed** | Increment counter, check limit |
| **markAsSynced** | Preserve counter for analytics |
| **sync engine** | Check canRetry before attempt |
| **UI components** | Display retry count to user |

### Expected Outcome
- retry_count field added to QueuedTransaction interface
- Counter initialized to 0 when transaction queued
- Counter increments with each failed sync
- Max retries enforced
- Retry methods integrated with mark_as_failed

### Verification Checklist
- [ ] retry_count field added to QueuedTransaction interface
- [ ] maxRetries configuration option defined (default: 5)
- [ ] `incrementRetryCount` method implemented
- [ ] `getRetryCount` method implemented
- [ ] `canRetry` method implemented
- [ ] retry_count initialized to 0 in queueTransaction
- [ ] retry_count incremented in markAsFailed
- [ ] canRetry checked to determine PENDING vs FAILED status
- [ ] `resetRetryCount` method implemented for manual retry
- [ ] retry_count included in queue statistics
- [ ] retry_count included in failure events

---

## Summary

### Tasks Completed in This Document
| Task # | Task Name | Key Deliverable |
|--------|-----------|-----------------|
| 35 | Create TransactionQueue class | TransactionQueue class with configuration |
| 36 | Implement queue_transaction method | Method to add transactions to queue |
| 37 | Generate offline transaction ID | ID generator utility function |
| 38 | Add queue position tracking | Position calculation methods |
| 39 | Implement get_pending_transactions | Method to retrieve pending transactions |
| 40 | Implement mark_as_synced | Method to mark successful sync |
| 41 | Implement mark_as_failed | Method to mark failed sync |
| 42 | Create retry counter | Retry tracking functionality |

### Core Queue Operations Established
- **TransactionQueue Class**: Foundation for queue management
- **Queue Operations**: Add, retrieve, and update transactions
- **Status Management**: Track PENDING, SYNCING, SYNCED, FAILED states
- **Retry Mechanism**: Automatic retry with exponential backoff
- **Position Tracking**: Order and position awareness

### Key Data Structures

```typescript
// Queued Transaction
interface QueuedTransaction {
  offline_id: string;
  terminal_id: string;
  session_id: string;
  created_at: string;
  synced_at: string | null;
  status: 'PENDING' | 'SYNCING' | 'SYNCED' | 'FAILED';
  retry_count: number;
  error_message: string | null;
  depends_on: string | null;
  position?: number;
  payload: TransactionPayload;
}

// Queue Configuration
interface QueueConfig {
  maxRetries: 5;
  retryDelays: [1000, 2000, 5000, 10000, 30000];
  cleanupThreshold: 86400000;
  batchSize: 10;
}
```

### Next Steps
Proceed to [02_Tasks-43-48_Limits-Persistence-Recovery.md](02_Tasks-43-48_Limits-Persistence-Recovery.md) to implement:
- Max retry limit enforcement
- Queue status summary
- Queue persistence across restarts
- Transaction integrity checks
- Queue export/import functionality

---

## Notes for AI Agents

1. **Execution Order:** Tasks 35-37 should be completed first, then 38-42 can be done in parallel
2. **IndexedDB Usage:** All queue operations use IndexedDB for persistent storage
3. **Event System:** Implement event emitters for queue status changes
4. **Type Safety:** Use TypeScript interfaces throughout
5. **Error Handling:** All methods should handle errors gracefully
6. **Testing:** Each method should have unit tests verifying functionality
7. **Performance:** Use IndexedDB indexes for efficient queries
8. **Offline-First:** Queue operations must work without network connection
