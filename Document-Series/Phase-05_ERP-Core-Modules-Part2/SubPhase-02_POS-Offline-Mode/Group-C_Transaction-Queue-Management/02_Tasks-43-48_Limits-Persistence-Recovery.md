# Tasks 43-48: Limits, Persistence, and Recovery

> **Phase:** 05 - ERP Core Modules Part 2  
> **SubPhase:** 02 - POS Offline Mode  
> **Group:** C - Transaction Queue Management  
> **Document:** 02 of 03  
> **Tasks Covered:** 43, 44, 45, 46, 47, 48

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-35-42_Queue-Core-Operations.md](01_Tasks-35-42_Queue-Core-Operations.md)
- **→ Next Document:** [03_Tasks-49-52_Ordering-Dependencies-Cleanup.md](03_Tasks-49-52_Ordering-Dependencies-Cleanup.md)

---

## Document Overview

This document covers retry limits, queue statistics, persistence mechanisms, data integrity validation, and backup/recovery operations. These features ensure the queue is reliable, survives browser restarts, and can be recovered in case of data loss or corruption.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 43 | Define max retry limit | Low |
| 44 | Create queue status summary | Medium |
| 45 | Implement queue persistence | Medium |
| 46 | Add transaction integrity check | Medium |
| 47 | Create queue export functionality | Medium |
| 48 | Create queue import functionality | Medium |

---

## Task 43: Define max retry limit

### Overview
Establish a configurable maximum retry limit that determines when a transaction should stop retry attempts and be marked as permanently failed.

### Dependencies
- Task 35: Create TransactionQueue class
- Task 42: Create retry counter

### Instructions

1. **Add max retry configuration field**
   - Field name: `maxRetries`
   - Location: QueueConfig interface
   - Type: number
   - Default value: 5

2. **Document retry limit rationale**
   - Explain purpose: Prevent infinite retry loops
   - Explain impact: Balance between persistence and resource usage
   - Provide guidance for adjusting value

3. **Create configuration validation**
   - Ensure maxRetries is positive integer
   - Minimum value: 1
   - Recommended maximum: 10
   - Throw error if invalid

4. **Add configuration getter**
   - Method: `getMaxRetries()`
   - Returns current max retry limit
   - No parameters required

5. **Add configuration setter**
   - Method: `setMaxRetries(limit: number)`
   - Validates new limit value
   - Updates configuration
   - Logs configuration change

6. **Document retry scenarios**
   - Network timeouts: Use default (5)
   - Server errors (5xx): Use higher limit (8-10)
   - Client errors (4xx): Use lower limit (2-3)
   - Validation errors: No retry (0)

7. **Create per-terminal override option**
   - Allow different limits for different terminals
   - Store in terminal configuration
   - Fall back to global default if not set

8. **Add retry limit to queue statistics**
   - Include configured max_retries in stats
   - Show how many transactions are at limit
   - Enable monitoring of retry effectiveness

9. **Create retry limit warning system**
   - Warn when transaction reaches 80% of limit
   - Alert when transaction reaches max limit
   - Notify user/admin of permanent failures

10. **Document impact on sync strategy**
    - Lower limit: Faster failure detection, less network usage
    - Higher limit: More resilient, but longer recovery time
    - Provide recommendations based on use case

### Max Retry Configuration

| Setting | Default | Range | Use Case |
|---------|---------|-------|----------|
| `maxRetries` | 5 | 1-10 | General sync failures |
| `networkTimeoutRetries` | 5 | 3-8 | Network connectivity issues |
| `serverErrorRetries` | 8 | 5-10 | Temporary server problems |
| `clientErrorRetries` | 2 | 0-3 | Data validation issues |

### Retry Limit Decision Tree

```
Sync Attempt Failed
       │
       ▼
Check Error Type
       │
       ├─Network Error────> Use networkTimeoutRetries (5)
       │
       ├─Server Error (5xx)─> Use serverErrorRetries (8)
       │
       ├─Client Error (4xx)─> Use clientErrorRetries (2)
       │
       └─Unknown Error────> Use default maxRetries (5)
```

### Configuration Example

```typescript
// Default configuration
const queueConfig: QueueConfig = {
  maxRetries: 5,
  retryDelays: [1000, 2000, 5000, 10000, 30000],
  cleanupThreshold: 86400000,
  batchSize: 10
};

// Terminal-specific override
const terminal01Config = {
  ...queueConfig,
  maxRetries: 8  // More retries for unreliable network
};
```

### Retry Limit Warning Thresholds

| Threshold | Action | Notification |
|-----------|--------|--------------|
| 80% (e.g., 4/5) | Log warning | Toast notification |
| 100% (e.g., 5/5) | Mark as FAILED | Alert banner + sound |
| After FAILED | Require manual action | Dashboard notification |

### Expected Outcome
- maxRetries configuration field defined
- Default value set to 5
- Configuration validation implemented
- Getter and setter methods created
- Documentation includes usage guidance

### Verification Checklist
- [ ] maxRetries field added to QueueConfig interface
- [ ] Default value set to 5
- [ ] Configuration validation ensures positive integer
- [ ] `getMaxRetries()` method implemented
- [ ] `setMaxRetries(limit)` method implemented with validation
- [ ] Per-terminal override option available
- [ ] Retry limit included in queue statistics
- [ ] Warning system triggers at 80% of limit
- [ ] Documentation explains retry limit usage
- [ ] Impact on sync strategy documented

---

## Task 44: Create queue status summary

### Overview
Implement a method that provides a comprehensive summary of the queue state, including transaction counts by status, timing information, and health metrics.

### Dependencies
- Task 35: Create TransactionQueue class
- Task 39: Implement get_pending_transactions

### Instructions

1. **Define QueueStatusSummary interface**
   - Count of PENDING transactions
   - Count of SYNCING transactions
   - Count of SYNCED transactions
   - Count of FAILED transactions
   - Total transaction count
   - Oldest pending transaction timestamp
   - Last sync attempt timestamp
   - Last successful sync timestamp

2. **Create getQueueStatus method**
   - Method name: `getQueueStatus`
   - No parameters required
   - Return Promise<QueueStatusSummary>

3. **Query transaction counts by status**
   - Use IndexedDB to count transactions
   - Group by status field
   - Optimize with indexes
   - Handle empty queue gracefully

4. **Calculate total transaction count**
   - Sum all status counts
   - Include all statuses
   - Exclude deleted transactions

5. **Find oldest pending transaction**
   - Query PENDING transactions
   - Sort by created_at ascending
   - Get first result
   - Return timestamp or null if none

6. **Track last sync attempt**
   - Store timestamp when sync operation starts
   - Update in queue metadata
   - Persist across page refreshes

7. **Track last successful sync**
   - Store timestamp when any transaction syncs successfully
   - Update after markAsSynced
   - Display to user as "last sync"

8. **Add retry statistics**
   - Average retry count across all transactions
   - Maximum retry count in queue
   - Count of transactions at max retries
   - Total retry attempts made

9. **Add timing statistics**
   - Average time from queue to sync
   - Oldest pending age in seconds
   - Estimated time to clear queue

10. **Create health score calculation**
    - Based on failed transaction percentage
    - Based on average retry count
    - Based on oldest pending age
    - Return score 0-100 (100 = healthy)

11. **Add error summary**
    - Most common error messages
    - Error type distribution
    - Failed transaction details

12. **Cache status summary**
    - Cache results for 5 seconds
    - Invalidate on queue modifications
    - Balance accuracy and performance

### QueueStatusSummary Interface

```typescript
interface QueueStatusSummary {
  // Transaction counts
  pending: number;
  syncing: number;
  synced: number;
  failed: number;
  total: number;
  
  // Timing information
  oldest_pending: string | null;          // ISO timestamp
  last_sync_attempt: string | null;       // ISO timestamp
  last_successful_sync: string | null;    // ISO timestamp
  
  // Retry statistics
  average_retry_count: number;
  max_retry_count: number;
  at_max_retries: number;
  
  // Health metrics
  health_score: number;                   // 0-100
  estimated_clear_time: number | null;    // seconds
  oldest_pending_age: number | null;      // seconds
  
  // Error summary
  error_summary: {
    most_common_error: string | null;
    error_count: number;
  };
}
```

### Health Score Calculation

```
Health Score Formula:
  base_score = 100
  
  // Deduct for failed transactions
  failed_penalty = (failed_count / total_count) * 30
  
  // Deduct for high retry counts
  retry_penalty = (average_retry_count / max_retries) * 30
  
  // Deduct for old pending transactions
  age_penalty = min(oldest_pending_age / 3600, 1) * 20  // 1 hour = max penalty
  
  // Deduct for pending backlog
  backlog_penalty = min(pending_count / 100, 1) * 20  // 100+ = max penalty
  
  health_score = max(0, base_score - failed_penalty - retry_penalty - age_penalty - backlog_penalty)

Interpretation:
  90-100: Excellent (green)
  70-89:  Good (yellow)
  50-69:  Poor (orange)
  0-49:   Critical (red)
```

### Estimated Clear Time Calculation

```
Estimated Clear Time:
  pending_count = number of PENDING transactions
  average_sync_time = historical average (e.g., 2 seconds)
  batch_size = number processed in parallel (e.g., 5)
  
  estimated_seconds = (pending_count / batch_size) * average_sync_time
  
Example:
  50 pending / 5 batch * 2 seconds = 20 seconds
```

### Error Summary Example

```typescript
{
  error_summary: {
    most_common_error: "Network timeout",
    error_count: 12,
    error_distribution: [
      { error: "Network timeout", count: 12 },
      { error: "Server unavailable", count: 5 },
      { error: "Invalid payload", count: 2 }
    ]
  }
}
```

### Status Summary Display Example

```
Queue Status:
  ✓ Synced: 145
  ⟳ Pending: 8
  ↻ Syncing: 2
  ✗ Failed: 3
  ━━━━━━━━━━━━━━━━━━━━
  Total: 158

Health: 85/100 (Good)

Last Sync: 2 minutes ago
Oldest Pending: 15 minutes ago
Estimated Clear Time: 16 seconds
```

### Expected Outcome
- QueueStatusSummary interface defined with all metrics
- `getQueueStatus` method returns comprehensive summary
- Health score calculated based on multiple factors
- Error summary includes most common issues
- Timing statistics provide insight into queue performance

### Verification Checklist
- [ ] QueueStatusSummary interface defined with all fields
- [ ] `getQueueStatus` method implemented
- [ ] Transaction counts by status calculated correctly
- [ ] oldest_pending timestamp found correctly
- [ ] last_sync_attempt timestamp tracked
- [ ] last_successful_sync timestamp tracked
- [ ] Retry statistics calculated (average, max, at limit)
- [ ] Health score calculation implemented (0-100)
- [ ] Estimated clear time calculated
- [ ] Error summary includes most common errors
- [ ] Status summary cached for performance
- [ ] Empty queue handled gracefully (returns zeros/nulls)

---

## Task 45: Implement queue persistence

### Overview
Ensure the transaction queue survives browser refreshes, crashes, and restarts by persisting all queue state in IndexedDB and implementing automatic recovery mechanisms.

### Dependencies
- Task 35: Create TransactionQueue class
- Task 31: Create IndexedDB database (Group-B)

### Instructions

1. **Verify IndexedDB persistence**
   - Confirm IndexedDB stores persist across browser restarts
   - Verify persistence is enabled (not in-memory mode)
   - Test with browser developer tools

2. **Create queue metadata store**
   - Store name: `queue_metadata`
   - Key: Single record with key "metadata"
   - Contains: Last sync timestamp, configuration, session info

3. **Store queue configuration**
   - Save maxRetries setting
   - Save retryDelays array
   - Save cleanupThreshold
   - Save batchSize
   - Persist on configuration change

4. **Implement automatic queue initialization**
   - On TransactionQueue instantiation
   - Load queue metadata from IndexedDB
   - Resume any SYNCING transactions (set to PENDING)
   - Validate queue integrity

5. **Handle interrupted sync operations**
   - Find transactions with status SYNCING
   - Reset status to PENDING (sync was interrupted)
   - Reset last_error_at timestamp
   - Add note about interruption in error_details

6. **Create queue recovery method**
   - Method: `recoverQueue()`
   - Scans all transactions
   - Fixes inconsistent states
   - Validates data integrity
   - Returns recovery report

7. **Track active sessions**
   - Store current session ID in metadata
   - On initialization, check if different session
   - Mark previous session as interrupted
   - Resume queue processing

8. **Implement browser close handling**
   - Use window.beforeunload event
   - Mark SYNCING transactions as interrupted
   - Save metadata with clean shutdown flag
   - Don't block browser close (async operation)

9. **Add crash detection**
   - On initialization, check for clean_shutdown flag
   - If false, queue crashed last time
   - Run full recovery process
   - Log crash for monitoring

10. **Create persistence health check**
    - Method: `checkPersistence()`
    - Verifies IndexedDB is accessible
    - Checks storage quota
    - Tests write and read operations
    - Returns boolean (healthy or not)

11. **Handle storage quota exceeded**
    - Detect QuotaExceededError
    - Trigger emergency cleanup
    - Remove oldest SYNCED transactions
    - Retry failed operation
    - Alert user if still failing

12. **Document persistence guarantees**
    - Queue survives browser restart
    - Queue survives browser crash
    - Queue survives device restart (if browser persists IndexedDB)
    - Queue does NOT survive browser data clear

### Queue Metadata Structure

```typescript
interface QueueMetadata {
  version: string;                    // Queue schema version
  session_id: string;                 // Current session ID
  last_sync_attempt: string | null;   // ISO timestamp
  last_successful_sync: string | null;
  clean_shutdown: boolean;            // Was last shutdown clean?
  configuration: QueueConfig;         // Current configuration
  created_at: string;                 // Queue creation timestamp
  updated_at: string;                 // Last metadata update
}
```

### Queue Recovery Process

```
1. Initialize TransactionQueue
        │
        ▼
2. Load queue_metadata from IndexedDB
        │
        ├─ Metadata found ────────────┐
        │                              │
        └─ No metadata ──> First run ─┘
                                       │
                                       ▼
3. Check clean_shutdown flag
        │
        ├─ true ──> Normal recovery
        │              │
        │              └─> Find SYNCING → Set to PENDING
        │
        └─ false ─> Crash recovery
                       │
                       ├─> Find SYNCING → Set to PENDING
                       ├─> Validate all transactions
                       ├─> Fix inconsistencies
                       └─> Log crash event

4. Resume queue processing
```

### Browser Close Handling

```typescript
// Register beforeunload handler
window.addEventListener('beforeunload', async (event) => {
  // Mark any SYNCING transactions as PENDING
  await queue.handleShutdown();
  
  // Set clean_shutdown flag to true
  await queue.saveMetadata({ clean_shutdown: true });
  
  // Don't block close (no event.preventDefault)
});
```

### Storage Quota Management

| Scenario | Action |
|----------|--------|
| **< 50% quota used** | Normal operation |
| **50-80% quota used** | Warning logged, cleanup scheduled |
| **80-95% quota used** | Aggressive cleanup, alert user |
| **> 95% quota used** | Emergency: Remove oldest SYNCED, block new queues |
| **Quota exceeded** | Remove oldest SYNCED, retry operation, alert user |

### Persistence Verification Test

```typescript
async function testPersistence() {
  // 1. Queue a transaction
  const offlineId = await queue.queueTransaction(payload);
  
  // 2. Simulate browser close
  await queue.handleShutdown();
  
  // 3. Recreate queue (simulate browser restart)
  const newQueue = new TransactionQueue(config);
  await newQueue.initialize();
  
  // 4. Verify transaction still exists
  const pending = await newQueue.getPendingTransactions();
  assert(pending.find(t => t.offline_id === offlineId));
  
  // 5. Success: Queue persisted
}
```

### Expected Outcome
- Queue state persists across browser restarts
- Interrupted sync operations resume correctly
- Crash detection and recovery works
- Storage quota monitored and managed
- Clean shutdown handling implemented

### Verification Checklist
- [ ] IndexedDB persistence verified for transactions store
- [ ] queue_metadata store created
- [ ] Queue configuration saved to metadata
- [ ] Automatic initialization loads metadata
- [ ] SYNCING transactions reset to PENDING on recovery
- [ ] `recoverQueue()` method implemented
- [ ] Session tracking identifies interrupted sessions
- [ ] window.beforeunload handler saves clean shutdown flag
- [ ] Crash detection checks clean_shutdown flag
- [ ] `checkPersistence()` health check implemented
- [ ] Storage quota exceeded handling implemented
- [ ] Persistence test passes (queue survives restart)

---

## Task 46: Add transaction integrity check

### Overview
Implement validation logic to verify transaction data integrity before queuing, ensuring that corrupted or invalid data does not enter the queue and cause sync failures.

### Dependencies
- Task 35: Create TransactionQueue class
- Task 36: Implement queue_transaction method

### Instructions

1. **Define validation rules interface**
   - Required fields list
   - Field type validations
   - Value range validations
   - Business rule validations

2. **Create validateTransaction method**
   - Method: `validateTransaction(payload: TransactionPayload)`
   - Returns validation result object
   - Does not throw errors (returns validation errors)
   - Can be called before queueTransaction

3. **Validate required fields**
   - terminal_id must exist and be non-empty string
   - session_id must exist and be non-empty string
   - items array must exist and have length > 0
   - grand_total must exist and be a number
   - payment_method must exist and be non-empty string
   - timestamp must exist and be valid ISO format

4. **Validate field types**
   - terminal_id: string
   - session_id: string
   - items: array
   - grand_total: number
   - subtotal: number
   - tax_amount: number
   - discount_amount: number
   - payment_method: string
   - customer_id: string or null

5. **Validate value ranges**
   - grand_total > 0
   - subtotal > 0
   - tax_amount >= 0
   - discount_amount >= 0
   - items.length > 0 and <= 1000
   - Each item quantity > 0
   - Each item price >= 0

6. **Validate cart items structure**
   - Each item has product_id
   - Each item has quantity (number > 0)
   - Each item has price (number >= 0)
   - Each item has subtotal
   - Product IDs are not duplicated

7. **Validate calculation accuracy**
   - Sum of item subtotals equals cart subtotal
   - subtotal + tax - discount = grand_total
   - Tolerance for rounding: 0.01 LKR

8. **Validate payment details**
   - Payment method is in allowed list
   - Payment amount equals grand_total
   - If cash: change amount calculated correctly
   - If card: Card details present

9. **Validate customer information (if present)**
   - customer_id format is valid
   - customer_name is non-empty if provided
   - customer_phone matches format if provided

10. **Validate timestamp**
    - Timestamp is valid ISO 8601 format
    - Timestamp is not in future (allow 5 min tolerance)
    - Timestamp is not too old (> 30 days warning)

11. **Create validation result object**
    - `isValid` boolean
    - `errors` array of error objects
    - `warnings` array of warning objects
    - Each error/warning has field, code, message

12. **Integrate with queueTransaction**
    - Call validateTransaction before adding to queue
    - If validation fails, throw ValidationError
    - Include validation errors in exception
    - Log validation failures for analysis

13. **Create integrity check for queued transactions**
    - Method: `checkQueueIntegrity()`
    - Validates all PENDING and FAILED transactions
    - Returns report of invalid transactions
    - Allows manual cleanup of corrupt data

### Validation Rules Table

| Rule | Type | Validation | Error Code |
|------|------|------------|------------|
| **Required Fields** | Required | Field exists and non-null | ERR_REQUIRED |
| **Terminal ID** | Format | Alphanumeric, 2-10 chars | ERR_INVALID_TERMINAL |
| **Session ID** | Format | Non-empty string | ERR_INVALID_SESSION |
| **Grand Total** | Range | > 0 and <= 10000000 | ERR_INVALID_AMOUNT |
| **Items** | Length | 1-1000 items | ERR_INVALID_ITEMS |
| **Item Quantity** | Range | > 0 and <= 1000 | ERR_INVALID_QUANTITY |
| **Subtotal Calc** | Calculation | Sum(items) = subtotal | ERR_CALC_MISMATCH |
| **Total Calc** | Calculation | subtotal+tax-discount=total | ERR_TOTAL_MISMATCH |
| **Timestamp** | Format | ISO 8601, not future | ERR_INVALID_TIME |

### Validation Result Structure

```typescript
interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
}

interface ValidationError {
  field: string;
  code: string;
  message: string;
  value?: any;
}

interface ValidationWarning {
  field: string;
  code: string;
  message: string;
}
```

### Calculation Validation Example

```typescript
// Validate item subtotals
const itemsTotal = payload.items.reduce((sum, item) => {
  return sum + (item.quantity * item.price);
}, 0);

const tolerance = 0.01;
if (Math.abs(itemsTotal - payload.subtotal) > tolerance) {
  errors.push({
    field: 'subtotal',
    code: 'ERR_CALC_MISMATCH',
    message: `Item total ${itemsTotal} != subtotal ${payload.subtotal}`
  });
}

// Validate grand total
const calculatedTotal = payload.subtotal + payload.tax_amount - payload.discount_amount;
if (Math.abs(calculatedTotal - payload.grand_total) > tolerance) {
  errors.push({
    field: 'grand_total',
    code: 'ERR_TOTAL_MISMATCH',
    message: `Calculated ${calculatedTotal} != grand_total ${payload.grand_total}`
  });
}
```

### Payment Method Validation

| Payment Method | Required Fields | Validation |
|---------------|-----------------|------------|
| **CASH** | amount_paid, change | amount_paid >= grand_total |
| **CARD** | card_type, last_4_digits | card_type in [VISA, MASTERCARD, AMEX] |
| **MOBILE** | provider, transaction_id | provider in [PayHere, FriMi] |
| **CREDIT** | customer_id | customer_id exists and valid |

### Integrity Check Report

```typescript
interface IntegrityReport {
  total_checked: number;
  valid: number;
  invalid: number;
  warnings: number;
  invalid_transactions: Array<{
    offline_id: string;
    errors: ValidationError[];
  }>;
}
```

### Expected Outcome
- Transaction validation implemented before queuing
- All validation rules enforced
- Calculation accuracy verified
- Invalid transactions rejected with clear error messages
- Queue integrity check available for existing transactions

### Verification Checklist
- [ ] Validation rules interface defined
- [ ] `validateTransaction` method implemented
- [ ] Required fields validation checks all mandatory fields
- [ ] Field type validation ensures correct data types
- [ ] Value range validation enforces min/max limits
- [ ] Cart items structure validated
- [ ] Calculation accuracy verified (subtotals, totals)
- [ ] Payment details validated based on method
- [ ] Customer information validated if present
- [ ] Timestamp validated (format, not future, not too old)
- [ ] ValidationResult object returned with errors/warnings
- [ ] Integration with queueTransaction throws on validation failure
- [ ] `checkQueueIntegrity()` method validates queued transactions

---

## Task 47: Create queue export functionality

### Overview
Implement functionality to export the transaction queue to a JSON file, enabling backup, transfer, and recovery of offline transactions.

### Dependencies
- Task 35: Create TransactionQueue class
- Task 39: Implement get_pending_transactions

### Instructions

1. **Define export format specification**
   - Export file format: JSON
   - File extension: .json
   - Schema version number
   - Metadata section
   - Transactions array

2. **Create exportQueue method**
   - Method: `exportQueue(options?: ExportOptions)`
   - Returns Promise<string> with JSON string
   - Accepts optional filters (status, date range)

3. **Define ExportOptions interface**
   - include_statuses: Array of statuses to include (default: all)
   - include_synced: boolean (default: false)
   - date_from: ISO timestamp (optional)
   - date_to: ISO timestamp (optional)
   - terminal_id: Filter by terminal (optional)

4. **Gather export metadata**
   - Export version (schema version)
   - Exported at timestamp
   - Exporting terminal ID
   - Source session ID
   - Queue configuration used
   - Transaction count

5. **Query transactions for export**
   - Apply status filters
   - Apply date range filters
   - Apply terminal filters
   - Sort by created_at ascending

6. **Serialize transactions**
   - Convert to plain JavaScript objects
   - Ensure payload is properly serialized
   - Handle special types (Date, undefined)
   - Remove sensitive information if configured

7. **Create export file structure**
   - Root object with metadata and transactions
   - metadata: Export information object
   - transactions: Array of QueuedTransaction objects
   - checksum: MD5 or SHA256 of transactions (for integrity)

8. **Generate checksum**
   - Create hash of transactions array
   - Use MD5 or SHA256 algorithm
   - Store in metadata section
   - Used for verification on import

9. **Create downloadExportFile method**
   - Method: `downloadExportFile(filename?: string)`
   - Calls exportQueue internally
   - Creates Blob from JSON string
   - Triggers browser download
   - Default filename: `queue-export-{terminal}-{timestamp}.json`

10. **Add export to clipboard option**
    - Method: `copyExportToClipboard()`
    - Exports queue to JSON
    - Copies to system clipboard
    - Shows success/error notification

11. **Handle large exports**
    - Warn if export > 10 MB
    - Option to split into multiple files
    - Compress if supported by browser
    - Progress indicator for large exports

12. **Create selective export**
    - Export only PENDING transactions
    - Export only FAILED transactions
    - Export specific date range
    - Export specific terminal

13. **Add export logging**
    - Log export events
    - Include transaction count
    - Include file size
    - Include export options used

### Export File Format

```typescript
interface QueueExportFile {
  export_version: string;              // "1.0"
  schema_version: string;              // "1.0"
  exported_at: string;                 // ISO timestamp
  terminal_id: string;                 // Exporting terminal
  session_id: string;                  // Current session
  configuration: QueueConfig;          // Queue settings
  metadata: {
    transaction_count: number;
    included_statuses: string[];
    date_range: {
      from: string | null;
      to: string | null;
    };
  };
  transactions: QueuedTransaction[];
  checksum: string;                    // MD5/SHA256 of transactions
}
```

### Export File Example

```json
{
  "export_version": "1.0",
  "schema_version": "1.0",
  "exported_at": "2024-01-01T10:30:00Z",
  "terminal_id": "T01",
  "session_id": "SESSION-123",
  "configuration": {
    "maxRetries": 5,
    "retryDelays": [1000, 2000, 5000, 10000, 30000],
    "cleanupThreshold": 86400000,
    "batchSize": 10
  },
  "metadata": {
    "transaction_count": 8,
    "included_statuses": ["PENDING", "FAILED"],
    "date_range": {
      "from": null,
      "to": null
    }
  },
  "transactions": [
    {
      "offline_id": "OFFLINE-T01-1704067200-001",
      "terminal_id": "T01",
      "status": "PENDING",
      "created_at": "2024-01-01T10:00:00Z",
      // ... full transaction data
    }
  ],
  "checksum": "a1b2c3d4e5f6..."
}
```

### Export Options Examples

```typescript
// Export only pending transactions
await queue.exportQueue({ 
  include_statuses: ['PENDING'] 
});

// Export failed transactions from last week
await queue.exportQueue({ 
  include_statuses: ['FAILED'],
  date_from: '2024-01-15T00:00:00Z',
  date_to: '2024-01-22T00:00:00Z'
});

// Export all transactions for terminal T02
await queue.exportQueue({ 
  terminal_id: 'T02'
});
```

### Download Filename Format

```
queue-export-{terminal}-{date}-{time}.json

Examples:
  queue-export-T01-20240101-103000.json
  queue-export-T02-20240115-154530.json
```

### Large Export Handling

| Export Size | Action |
|-------------|--------|
| **< 1 MB** | Direct export, no warning |
| **1-10 MB** | Show size warning, continue |
| **10-50 MB** | Suggest splitting, offer continuation |
| **> 50 MB** | Force split into multiple files |

### Expected Outcome
- Queue can be exported to JSON file
- Export includes metadata and transactions
- Checksum generated for integrity verification
- Browser download triggered with appropriate filename
- Large exports handled gracefully

### Verification Checklist
- [ ] Export file format specification defined
- [ ] `exportQueue` method implemented
- [ ] ExportOptions interface defined with filters
- [ ] Export metadata gathered and included
- [ ] Transactions queried based on filters
- [ ] Transactions serialized to JSON
- [ ] Export file structure matches specification
- [ ] Checksum generated for transactions array
- [ ] `downloadExportFile` method triggers browser download
- [ ] Default filename follows format: queue-export-{terminal}-{timestamp}.json
- [ ] `copyExportToClipboard` method implemented
- [ ] Large exports show warning and handle gracefully
- [ ] Selective export options work (PENDING only, FAILED only, etc.)
- [ ] Export events logged

---

## Task 48: Create queue import functionality

### Overview
Implement functionality to import a transaction queue from a JSON file, enabling recovery from backup, transfer between terminals, and restoration after data loss.

### Dependencies
- Task 35: Create TransactionQueue class
- Task 47: Create queue export functionality

### Instructions

1. **Create importQueue method**
   - Method: `importQueue(fileContent: string, options?: ImportOptions)`
   - Accepts JSON string from export file
   - Returns Promise<ImportResult>
   - Validates file before importing

2. **Define ImportOptions interface**
   - merge_mode: 'replace' | 'merge' | 'skip_existing' (default: merge)
   - reset_retry_counts: boolean (default: false)
   - change_terminal_id: string | null (reassign to different terminal)
   - preserve_synced: boolean (default: false)

3. **Parse and validate JSON**
   - Parse JSON string
   - Validate root structure
   - Check export_version compatibility
   - Check schema_version compatibility
   - Throw error if invalid

4. **Verify checksum**
   - Calculate checksum of transactions array
   - Compare with checksum in metadata
   - Warn if mismatch (possible corruption)
   - Allow user to proceed or cancel

5. **Validate transaction data**
   - Run integrity check on each transaction (Task 46)
   - Collect validation errors
   - Option to skip invalid transactions
   - Option to abort on any error

6. **Handle merge modes**
   - **replace**: Clear existing queue, import all
   - **merge**: Import all, keep existing
   - **skip_existing**: Import only new offline_ids

7. **Check for duplicate offline IDs**
   - Query existing transactions
   - Find overlaps with import
   - Apply merge mode rules
   - Log conflicts

8. **Apply import options**
   - If reset_retry_counts: Set all retry_count to 0
   - If change_terminal_id: Update terminal_id for all transactions
   - If preserve_synced: Include SYNCED transactions, otherwise skip

9. **Insert transactions into IndexedDB**
   - Open transactions store with readwrite
   - Batch insert for performance
   - Handle storage quota errors
   - Commit transaction

10. **Update queue metadata**
    - Update last_import timestamp
    - Store import source information
    - Update queue statistics

11. **Create ImportResult object**
    - total_in_file: Count from file
    - imported: Count successfully imported
    - skipped: Count skipped (duplicates, etc.)
    - failed: Count that failed validation
    - errors: Array of error objects

12. **Create importFromFile method**
    - Method: `importFromFile(file: File, options?: ImportOptions)`
    - Accepts File object from file input
    - Reads file content
    - Calls importQueue internally
    - Shows progress for large files

13. **Create importFromClipboard method**
    - Method: `importFromClipboard(options?: ImportOptions)`
    - Reads from system clipboard
    - Parses and imports
    - Shows success/error notification

14. **Handle errors gracefully**
    - Parse errors: Show clear message
    - Validation errors: List invalid transactions
    - Storage errors: Suggest cleanup
    - Allow partial import if some transactions valid

### Import Options

| Option | Values | Default | Description |
|--------|--------|---------|-------------|
| `merge_mode` | replace, merge, skip_existing | merge | How to handle duplicates |
| `reset_retry_counts` | boolean | false | Reset all retry counts to 0 |
| `change_terminal_id` | string or null | null | Reassign to different terminal |
| `preserve_synced` | boolean | false | Import SYNCED transactions |

### Merge Mode Behavior

```
Scenario: Importing 10 transactions, 3 have duplicate offline_ids

merge_mode = 'replace':
  - Delete all existing transactions
  - Import all 10 transactions
  - Result: 10 transactions in queue

merge_mode = 'merge':
  - Keep all existing transactions
  - Import 10 new transactions
  - Update 3 existing with imported data
  - Result: existing + 7 new transactions

merge_mode = 'skip_existing':
  - Keep all existing transactions
  - Import only 7 new transactions
  - Skip 3 duplicates
  - Result: existing + 7 new transactions
```

### Checksum Verification

```typescript
// Calculate checksum of imported transactions
const calculatedChecksum = calculateChecksum(importFile.transactions);

// Compare with stored checksum
if (calculatedChecksum !== importFile.checksum) {
  console.warn('Checksum mismatch! File may be corrupted.');
  
  // Ask user to confirm
  const proceed = await confirmDialog(
    'Import file checksum does not match. Continue anyway?'
  );
  
  if (!proceed) {
    throw new Error('Import cancelled due to checksum mismatch');
  }
}
```

### ImportResult Structure

```typescript
interface ImportResult {
  total_in_file: number;
  imported: number;
  skipped: number;
  failed: number;
  errors: ImportError[];
  warnings: ImportWarning[];
  duration_ms: number;
}

interface ImportError {
  offline_id: string;
  reason: string;
  details?: string;
}

interface ImportWarning {
  message: string;
  count?: number;
}
```

### Import Result Example

```typescript
{
  total_in_file: 10,
  imported: 7,
  skipped: 2,      // Duplicates (skip_existing mode)
  failed: 1,       // Validation error
  errors: [
    {
      offline_id: "OFFLINE-T01-1704067200-999",
      reason: "Validation failed",
      details: "grand_total is negative"
    }
  ],
  warnings: [
    {
      message: "Checksum mismatch detected",
      count: 1
    }
  ],
  duration_ms: 234
}
```

### File Input Example

```typescript
// HTML
<input type="file" id="importFile" accept=".json" />

// JavaScript
const fileInput = document.getElementById('importFile');
fileInput.addEventListener('change', async (e) => {
  const file = e.target.files[0];
  if (file) {
    const result = await queue.importFromFile(file, {
      merge_mode: 'merge',
      reset_retry_counts: true
    });
    
    console.log(`Imported ${result.imported} transactions`);
  }
});
```

### Expected Outcome
- Queue can be imported from JSON file
- Import validates file structure and data
- Checksum verified for integrity
- Merge modes handle duplicates correctly
- Import options applied (retry counts, terminal change)
- Import result provides detailed feedback

### Verification Checklist
- [ ] `importQueue` method implemented
- [ ] ImportOptions interface defined
- [ ] JSON parsing validates file structure
- [ ] export_version and schema_version compatibility checked
- [ ] Checksum verified against transactions
- [ ] Transaction validation performed (using Task 46)
- [ ] Merge mode 'replace' clears queue and imports all
- [ ] Merge mode 'merge' keeps existing and adds new
- [ ] Merge mode 'skip_existing' only imports new offline_ids
- [ ] reset_retry_counts option resets all retry counts
- [ ] change_terminal_id option updates terminal IDs
- [ ] preserve_synced option includes/excludes SYNCED transactions
- [ ] Transactions inserted into IndexedDB in batches
- [ ] ImportResult object returned with statistics
- [ ] `importFromFile` method accepts File object
- [ ] `importFromClipboard` method reads from clipboard
- [ ] Errors handled gracefully with clear messages

---

## Summary

### Tasks Completed in This Document
| Task # | Task Name | Key Deliverable |
|--------|-----------|-----------------|
| 43 | Define max retry limit | Max retry configuration and enforcement |
| 44 | Create queue status summary | Comprehensive queue statistics method |
| 45 | Implement queue persistence | Queue survives browser restarts |
| 46 | Add transaction integrity check | Validation before queuing |
| 47 | Create queue export functionality | Export queue to JSON file |
| 48 | Create queue import functionality | Import queue from JSON file |

### Queue Reliability Features
- **Retry Management**: Configurable max retries with enforcement
- **Status Monitoring**: Comprehensive queue health metrics
- **Persistence**: Survives browser crashes and restarts
- **Data Integrity**: Validation prevents corrupt data
- **Backup/Recovery**: Export and import for disaster recovery

### Key Methods Implemented

```typescript
class TransactionQueue {
  // Retry limits
  getMaxRetries(): number;
  setMaxRetries(limit: number): void;
  
  // Status summary
  getQueueStatus(): Promise<QueueStatusSummary>;
  
  // Persistence
  recoverQueue(): Promise<RecoveryReport>;
  checkPersistence(): Promise<boolean>;
  handleShutdown(): Promise<void>;
  
  // Integrity
  validateTransaction(payload: TransactionPayload): ValidationResult;
  checkQueueIntegrity(): Promise<IntegrityReport>;
  
  // Export/Import
  exportQueue(options?: ExportOptions): Promise<string>;
  downloadExportFile(filename?: string): Promise<void>;
  importQueue(fileContent: string, options?: ImportOptions): Promise<ImportResult>;
  importFromFile(file: File, options?: ImportOptions): Promise<ImportResult>;
}
```

### Next Steps
Proceed to [03_Tasks-49-52_Ordering-Dependencies-Cleanup.md](03_Tasks-49-52_Ordering-Dependencies-Cleanup.md) to implement:
- Queue ordering and FIFO processing
- Dependency tracking for related transactions
- User notifications for queue status changes
- Automatic cleanup of old synced transactions

---

## Notes for AI Agents

1. **Execution Order:** Tasks 43-44 first, then 45-46 can be parallel, then 47-48 can be parallel
2. **IndexedDB Storage:** All persistence relies on IndexedDB, ensure it's properly configured
3. **Validation:** Task 46 is critical - prevents corrupt data from entering queue
4. **Export Format:** Keep export format versioned for future compatibility
5. **Import Safety:** Always validate and verify checksums before importing
6. **Error Handling:** All methods should handle edge cases gracefully
7. **User Notifications:** Inform users about backup/restore operations
8. **Testing:** Test persistence by actually closing/reopening browser
