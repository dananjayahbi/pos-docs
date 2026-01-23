# Tasks 49-52: Ordering, Dependencies, and Cleanup

> **Phase:** 05 - ERP Core Modules Part 2  
> **SubPhase:** 02 - POS Offline Mode  
> **Group:** C - Transaction Queue Management  
> **Document:** 03 of 03  
> **Tasks Covered:** 49, 50, 51, 52

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [02_Tasks-43-48_Limits-Persistence-Recovery.md](02_Tasks-43-48_Limits-Persistence-Recovery.md)
- **→ Next Group:** [../Group-D_Sync-Engine-Conflict-Resolution/](../Group-D_Sync-Engine-Conflict-Resolution/)

---

## Document Overview

This document covers queue ordering strategies, dependency tracking between transactions, user notification systems, and automatic cleanup mechanisms. These features ensure transactions are processed in the correct order, dependencies are respected, users are informed of queue status, and the queue doesn't grow indefinitely.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 49 | Implement queue ordering | Medium |
| 50 | Add dependency tracking | Medium |
| 51 | Create queue notifications | Medium |
| 52 | Implement queue cleanup | Medium |

---

## Task 49: Implement queue ordering

### Overview
Implement a queue ordering strategy that ensures transactions are processed in the correct order (typically FIFO - First In, First Out), while respecting dependencies and priorities.

### Dependencies
- Task 35: Create TransactionQueue class
- Task 38: Add queue position tracking
- Task 39: Implement get_pending_transactions

### Instructions

1. **Define ordering strategy enum**
   - FIFO: First In, First Out (default)
   - LIFO: Last In, First Out
   - PRIORITY: Based on transaction priority
   - DEPENDENCY_AWARE: Respects dependencies first

2. **Add ordering configuration**
   - Configuration field: `orderingStrategy`
   - Default value: FIFO
   - Store in queue configuration
   - Allow runtime change

3. **Create getNextTransaction method**
   - Method: `getNextTransaction()`
   - Returns Promise<QueuedTransaction | null>
   - Applies ordering strategy
   - Respects dependencies (never return if dependency pending)

4. **Implement FIFO ordering**
   - Query PENDING transactions
   - Sort by created_at ascending
   - Filter out transactions with unmet dependencies
   - Return oldest eligible transaction

5. **Implement LIFO ordering (optional)**
   - Query PENDING transactions
   - Sort by created_at descending
   - Filter out transactions with unmet dependencies
   - Return newest eligible transaction

6. **Implement priority-based ordering**
   - Add priority field to QueuedTransaction
   - High priority: Process first
   - Low priority: Process last
   - Within priority: Use FIFO

7. **Implement dependency-aware ordering**
   - Build dependency graph
   - Process transactions with no dependencies first
   - Process dependent transactions after dependencies sync
   - Detect circular dependencies

8. **Create transaction priority levels**
   - CRITICAL: Process immediately (e.g., cash sales)
   - HIGH: Process before normal (e.g., customer orders)
   - NORMAL: Standard transactions (default)
   - LOW: Can wait (e.g., analytics events)

9. **Add batch ordering**
   - Method: `getNextBatch(batchSize: number)`
   - Returns multiple transactions for parallel processing
   - Respects ordering strategy
   - Ensures no dependency conflicts within batch

10. **Handle ordering with retries**
    - Failed transactions go to back of queue
    - Optionally: Reduce priority after failure
    - Prevent starvation of failed transactions
    - Exponential backoff affects ordering

11. **Create re-ordering method**
    - Method: `reorderQueue(strategy: OrderingStrategy)`
    - Changes ordering strategy
    - Recalculates positions
    - Updates next_transaction pointer

12. **Optimize ordering queries**
    - Use IndexedDB indexes on created_at
    - Use indexes on status field
    - Cache ordering results briefly
    - Invalidate cache on queue changes

### Ordering Strategies

| Strategy | Sort Order | Use Case |
|----------|-----------|----------|
| **FIFO** | created_at ASC | Default, fair processing |
| **LIFO** | created_at DESC | Recent data more important |
| **PRIORITY** | priority DESC, created_at ASC | Mixed importance levels |
| **DEPENDENCY_AWARE** | Dependency graph topological sort | Related transactions |

### FIFO Ordering Logic

```
1. Query transactions WHERE status = 'PENDING'
2. Filter WHERE depends_on IS NULL OR depends_on IN (SYNCED transactions)
3. Sort by created_at ASC
4. Return first result
```

### Priority-Based Ordering Logic

```
Priority Levels (highest to lowest):
1. CRITICAL (priority = 4)
2. HIGH (priority = 3)
3. NORMAL (priority = 2)
4. LOW (priority = 1)

Query:
1. Get PENDING transactions
2. Filter eligible (no unmet dependencies)
3. Sort by: priority DESC, created_at ASC
4. Return first result

Example:
  - Transaction A: NORMAL, created 10:00:00 → Position 3
  - Transaction B: HIGH, created 10:00:05 → Position 1 (higher priority)
  - Transaction C: NORMAL, created 10:00:02 → Position 2 (same priority, older)
```

### Dependency-Aware Ordering Example

```
Transaction Graph:
  A (no dependencies) → created 10:00:00
  B (depends on A) → created 10:00:05
  C (no dependencies) → created 10:00:10
  D (depends on B) → created 10:00:15

Processing Order:
1. A (no dependencies, oldest)
2. C (no dependencies, second oldest)
3. B (dependency A synced)
4. D (dependency B synced)
```

### Batch Ordering

```typescript
// Get next batch of 5 transactions
const batch = await queue.getNextBatch(5);

// Batch respects:
// 1. No transaction with unmet dependency
// 2. All transactions are PENDING
// 3. Ordered by strategy (FIFO, priority, etc.)
// 4. No circular dependencies within batch

Result:
[
  {offline_id: "...-001", depends_on: null},
  {offline_id: "...-002", depends_on: null},
  {offline_id: "...-003", depends_on: null},
  {offline_id: "...-004", depends_on: "...-001"}, // OK, -001 in same batch
  {offline_id: "...-005", depends_on: null}
]
```

### Ordering with Retry Backoff

```
Transaction fails:
1. Increment retry_count
2. Calculate next_retry_at (exponential backoff)
3. Status remains PENDING
4. In getNextTransaction:
   - Skip if current_time < next_retry_at
   - Process others first
   - Come back when backoff expires
```

### Circular Dependency Detection

```
Scenario:
  A depends_on B
  B depends_on A

Detection:
  1. Build dependency graph
  2. Perform topological sort
  3. If cycle detected, log error
  4. Mark both as FAILED with error: "Circular dependency"
  5. Require manual intervention
```

### Expected Outcome
- Queue ordering strategy implemented
- `getNextTransaction` returns transactions in correct order
- Dependencies respected (never return if dependency unmet)
- Batch processing retrieves multiple ordered transactions
- Retry backoff integrated with ordering

### Verification Checklist
- [ ] Ordering strategy enum defined (FIFO, LIFO, PRIORITY, DEPENDENCY_AWARE)
- [ ] orderingStrategy configuration field added
- [ ] `getNextTransaction` method implemented
- [ ] FIFO ordering implemented (created_at ASC)
- [ ] Priority levels defined (CRITICAL, HIGH, NORMAL, LOW)
- [ ] Priority-based ordering implemented
- [ ] Dependency-aware ordering respects dependencies
- [ ] `getNextBatch` method returns multiple transactions
- [ ] Transactions with unmet dependencies filtered out
- [ ] Retry backoff (next_retry_at) integrated
- [ ] Circular dependency detection implemented
- [ ] Ordering queries optimized with indexes

---

## Task 50: Add dependency tracking

### Overview
Implement dependency tracking to ensure that transactions with dependencies on other transactions (e.g., creating a customer before creating a sale) are processed in the correct order.

### Dependencies
- Task 35: Create TransactionQueue class
- Task 36: Implement queue_transaction method
- Task 49: Implement queue ordering

### Instructions

1. **Add depends_on field to QueuedTransaction**
   - Field: `depends_on`
   - Type: string | null
   - Contains offline_id of dependency transaction
   - Null if no dependency

2. **Update queueTransaction to accept dependency**
   - Add optional parameter: `dependsOn?: string`
   - Validate dependency exists in queue
   - Set depends_on field when creating transaction
   - Warn if dependency already synced

3. **Create dependency validation**
   - Verify depends_on offline_id exists
   - Verify depends_on is not same as current transaction
   - Detect circular dependencies
   - Throw error if invalid

4. **Implement getDependency method**
   - Method: `getDependency(offlineId: string)`
   - Returns Promise<QueuedTransaction | null>
   - Retrieves the transaction that current one depends on
   - Returns null if no dependency or not found

5. **Implement getDependents method**
   - Method: `getDependents(offlineId: string)`
   - Returns Promise<QueuedTransaction[]>
   - Retrieves all transactions that depend on this one
   - Returns empty array if none

6. **Create dependency chain resolver**
   - Method: `getDependencyChain(offlineId: string)`
   - Returns Promise<QueuedTransaction[]>
   - Retrieves full chain of dependencies
   - Ordered from root to final dependent

7. **Implement dependency status check**
   - Method: `canProcess(offlineId: string)`
   - Returns Promise<boolean>
   - Checks if all dependencies are SYNCED
   - Returns true if ready to process

8. **Build dependency graph**
   - Method: `buildDependencyGraph()`
   - Returns Promise<DependencyGraph>
   - Maps all transactions and their dependencies
   - Used for visualization and validation

9. **Detect circular dependencies**
   - Method: `detectCircularDependencies()`
   - Returns Promise<CircularDependency[]>
   - Uses graph traversal (DFS)
   - Marks involved transactions as FAILED

10. **Update markAsSynced to notify dependents**
    - When transaction synced
    - Find all dependents
    - Check if now eligible for processing
    - Emit dependency_resolved event

11. **Handle dependency failures**
    - If dependency marked as FAILED
    - Mark all dependents as FAILED
    - Set error: "Dependency failed"
    - Prevent cascade of failures

12. **Create dependency mapping types**
    - Interface for dependency metadata
    - Interface for dependency graph structure
    - Interface for circular dependency report

### Dependency Field Usage

| Transaction Type | Depends On | Example |
|-----------------|------------|---------|
| **New Customer + Sale** | Sale depends on Customer | Customer created offline → Sale uses customer offline_id |
| **Refund** | Refund depends on Original Sale | Original sale → Refund transaction |
| **Inventory Adjustment** | None typically | Standalone adjustment |
| **Payment Split** | Second payment depends on first | First payment → Second payment |

### Dependency Chain Example

```
Chain: Create Customer → Create Sale → Issue Refund

Transaction A (Customer):
  offline_id: OFFLINE-T01-1704067200-001
  depends_on: null
  status: SYNCED

Transaction B (Sale):
  offline_id: OFFLINE-T01-1704067205-001
  depends_on: OFFLINE-T01-1704067200-001
  status: SYNCING

Transaction C (Refund):
  offline_id: OFFLINE-T01-1704067210-001
  depends_on: OFFLINE-T01-1704067205-001
  status: PENDING

getDependencyChain("OFFLINE-T01-1704067210-001") returns:
[
  Transaction A (Customer),
  Transaction B (Sale),
  Transaction C (Refund)
]
```

### Dependency Graph Structure

```typescript
interface DependencyGraph {
  nodes: Map<string, QueuedTransaction>;  // offline_id → transaction
  edges: Map<string, string[]>;           // offline_id → [dependent_ids]
  roots: string[];                        // offline_ids with no dependencies
  leaves: string[];                       // offline_ids with no dependents
}
```

### Circular Dependency Detection Algorithm

```
1. For each PENDING transaction:
   2. Create visited set (empty)
   3. Create recursion stack (empty)
   4. Call DFS(transaction, visited, stack)
   
DFS(transaction, visited, stack):
   1. Add transaction to visited
   2. Add transaction to stack
   3. If transaction.depends_on:
      4. If depends_on in stack → CIRCULAR DEPENDENCY FOUND
      5. If depends_on not in visited → DFS(depends_on, visited, stack)
   6. Remove transaction from stack
```

### Circular Dependency Report

```typescript
interface CircularDependency {
  transactions: string[];              // offline_ids in cycle
  detected_at: string;                 // ISO timestamp
  resolution: 'MARK_FAILED' | 'MANUAL';
}

Example:
{
  transactions: [
    "OFFLINE-T01-1704067200-001",
    "OFFLINE-T01-1704067205-001",
    "OFFLINE-T01-1704067200-001"      // Cycle back
  ],
  detected_at: "2024-01-01T10:05:00Z",
  resolution: "MARK_FAILED"
}
```

### Dependency Status Check

```typescript
// Check if transaction can be processed
const canProcess = await queue.canProcess("OFFLINE-T01-1704067210-001");

Logic:
1. Get transaction
2. If depends_on is null → return true
3. Get dependency transaction
4. If dependency status is SYNCED → return true
5. Otherwise → return false
```

### Dependency Failure Cascade

```
Scenario:
  Transaction A (depends_on: null) → FAILED
  Transaction B (depends_on: A) → PENDING
  Transaction C (depends_on: B) → PENDING

When A marked as FAILED:
  1. Find all dependents: [B, C]
  2. Mark B as FAILED (error: "Dependency OFFLINE-...-A failed")
  3. Mark C as FAILED (error: "Dependency OFFLINE-...-B failed")
  4. Emit events for each failure
  5. Notify user of cascade
```

### Dependency Resolution Event

```typescript
{
  type: "dependency_resolved",
  offline_id: "OFFLINE-T01-1704067200-001",  // Synced transaction
  dependents: [
    "OFFLINE-T01-1704067205-001",
    "OFFLINE-T01-1704067210-001"
  ],
  now_eligible_count: 1  // B is now eligible, C still waiting for B
}
```

### Expected Outcome
- Transactions can declare dependencies
- Dependencies validated before queuing
- Dependency chains tracked and retrievable
- Circular dependencies detected and prevented
- Dependent transactions only process after dependencies sync

### Verification Checklist
- [ ] depends_on field added to QueuedTransaction interface
- [ ] queueTransaction accepts optional dependsOn parameter
- [ ] Dependency validation checks offline_id exists
- [ ] Circular dependency validation prevents cycles
- [ ] `getDependency` method returns dependency transaction
- [ ] `getDependents` method returns all dependent transactions
- [ ] `getDependencyChain` method returns full chain
- [ ] `canProcess` method checks if dependencies met
- [ ] `buildDependencyGraph` method creates graph structure
- [ ] `detectCircularDependencies` method finds cycles
- [ ] markAsSynced notifies dependents via event
- [ ] Failed dependencies cause dependents to fail

---

## Task 51: Create queue notifications

### Overview
Implement a notification system to inform users about queue status changes, such as transactions synced, failures, queue size warnings, and dependency resolutions.

### Dependencies
- Task 35: Create TransactionQueue class
- Task 40: Implement mark_as_synced
- Task 41: Implement mark_as_failed

### Instructions

1. **Define notification types**
   - TRANSACTION_QUEUED: New transaction added
   - TRANSACTION_SYNCED: Transaction synced successfully
   - TRANSACTION_FAILED: Transaction failed permanently
   - QUEUE_SIZE_WARNING: Queue getting large
   - DEPENDENCY_RESOLVED: Dependency synced, dependents can proceed
   - SYNC_STARTED: Sync operation started
   - SYNC_COMPLETED: All pending transactions synced
   - EXPORT_COMPLETE: Queue exported successfully

2. **Create QueueNotification interface**
   - type: Notification type enum
   - title: Short notification title
   - message: Detailed message
   - severity: INFO, WARNING, ERROR, SUCCESS
   - timestamp: ISO timestamp
   - metadata: Additional context object

3. **Implement event emitter pattern**
   - Use EventEmitter or custom implementation
   - Method: `on(eventType, callback)`
   - Method: `off(eventType, callback)`
   - Method: `emit(eventType, data)`

4. **Create addNotificationListener method**
   - Method: `addNotificationListener(callback: (notification: QueueNotification) => void)`
   - Register callback for all notifications
   - Returns unsubscribe function
   - Multiple listeners supported

5. **Emit notifications on queue events**
   - On queueTransaction: Emit TRANSACTION_QUEUED
   - On markAsSynced: Emit TRANSACTION_SYNCED
   - On markAsFailed: Emit TRANSACTION_FAILED
   - On dependency resolved: Emit DEPENDENCY_RESOLVED

6. **Implement queue size monitoring**
   - Check pending count periodically
   - Thresholds: 10, 25, 50, 100+ pending
   - Emit WARNING at each threshold
   - Don't repeat same warning

7. **Create notification formatter**
   - Method: `formatNotification(notification: QueueNotification)`
   - Returns user-friendly string
   - Includes relevant details
   - Handles pluralization

8. **Add notification filtering**
   - Method: `setNotificationLevel(level: 'ALL' | 'WARNING' | 'ERROR')`
   - Only emit notifications at or above level
   - Default: ALL
   - Allow per-type filtering

9. **Create React hook for notifications**
   - Hook: `useQueueNotifications(queue: TransactionQueue)`
   - Returns array of recent notifications
   - Auto-subscribes and unsubscribes
   - Maintains notification history

10. **Build notification UI component**
    - Component: `QueueNotificationToast`
    - Shows notifications as toast/snackbar
    - Auto-dismiss after timeout
    - Click to dismiss manually
    - Queue multiple notifications

11. **Add notification persistence (optional)**
    - Store notifications in IndexedDB
    - Keep last 100 notifications
    - Show notification history to user
    - Clear old notifications

12. **Create notification badge**
    - Component: `QueueStatusBadge`
    - Shows pending count
    - Changes color based on status (green/yellow/red)
    - Shows icon for errors
    - Clickable to show details

### Notification Types

| Type | Severity | When | Example Message |
|------|----------|------|-----------------|
| **TRANSACTION_QUEUED** | INFO | Transaction added | "Transaction queued for sync" |
| **TRANSACTION_SYNCED** | SUCCESS | Transaction synced | "Transaction synced successfully" |
| **TRANSACTION_FAILED** | ERROR | Max retries exceeded | "Transaction failed after 5 retries" |
| **QUEUE_SIZE_WARNING** | WARNING | 25+ pending | "25 transactions waiting to sync" |
| **DEPENDENCY_RESOLVED** | INFO | Dependency synced | "Dependent transaction ready" |
| **SYNC_STARTED** | INFO | Sync begins | "Syncing 8 transactions..." |
| **SYNC_COMPLETED** | SUCCESS | All synced | "All transactions synced" |
| **EXPORT_COMPLETE** | SUCCESS | Export finished | "Queue exported to file" |

### QueueNotification Interface

```typescript
interface QueueNotification {
  id: string;                      // Unique notification ID
  type: NotificationType;
  title: string;
  message: string;
  severity: 'INFO' | 'WARNING' | 'ERROR' | 'SUCCESS';
  timestamp: string;               // ISO format
  metadata?: {
    offline_id?: string;
    transaction_count?: number;
    error_message?: string;
    [key: string]: any;
  };
}
```

### Notification Examples

**Transaction Queued:**
```typescript
{
  id: "notif-123",
  type: "TRANSACTION_QUEUED",
  title: "Transaction Queued",
  message: "Sale transaction added to offline queue (position 3)",
  severity: "INFO",
  timestamp: "2024-01-01T10:00:00Z",
  metadata: {
    offline_id: "OFFLINE-T01-1704067200-001",
    position: 3
  }
}
```

**Queue Size Warning:**
```typescript
{
  id: "notif-456",
  type: "QUEUE_SIZE_WARNING",
  title: "Queue Growing",
  message: "25 transactions waiting to sync. Please check connection.",
  severity: "WARNING",
  timestamp: "2024-01-01T10:15:00Z",
  metadata: {
    transaction_count: 25
  }
}
```

**Transaction Failed:**
```typescript
{
  id: "notif-789",
  type: "TRANSACTION_FAILED",
  title: "Transaction Failed",
  message: "Transaction failed permanently after 5 retries: Network timeout",
  severity: "ERROR",
  timestamp: "2024-01-01T10:20:00Z",
  metadata: {
    offline_id: "OFFLINE-T01-1704067200-001",
    retry_count: 5,
    error_message: "Network timeout"
  }
}
```

### Queue Size Warning Thresholds

| Pending Count | Severity | Message | Action Hint |
|---------------|----------|---------|-------------|
| **10-24** | INFO | "10 transactions in queue" | Normal operation |
| **25-49** | WARNING | "Queue growing: 25 transactions" | Check connection |
| **50-99** | WARNING | "Large queue: 50 transactions" | Consider manual sync |
| **100+** | ERROR | "Critical: 100+ transactions" | Immediate attention needed |

### React Hook Example

```typescript
// Hook implementation
function useQueueNotifications(queue: TransactionQueue) {
  const [notifications, setNotifications] = useState<QueueNotification[]>([]);
  
  useEffect(() => {
    const unsubscribe = queue.addNotificationListener((notification) => {
      setNotifications(prev => [notification, ...prev].slice(0, 10));
    });
    
    return unsubscribe;
  }, [queue]);
  
  return notifications;
}

// Usage in component
function QueueMonitor() {
  const notifications = useQueueNotifications(queue);
  
  return (
    <div>
      {notifications.map(notif => (
        <Toast key={notif.id} notification={notif} />
      ))}
    </div>
  );
}
```

### Notification UI Component

```
┌─────────────────────────────────────┐
│ ✓ Transaction Synced                │
│ Sale transaction synced successfully │
│ 2 seconds ago                    [×]│
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ ⚠ Queue Growing                     │
│ 25 transactions waiting to sync     │
│ 1 minute ago                     [×]│
└─────────────────────────────────────┘
```

### QueueStatusBadge Component

```
Normal state:
  [⟳ 3]  (yellow badge, 3 pending)

Error state:
  [✗ 2]  (red badge, 2 failed)

Syncing state:
  [↻ 5]  (blue badge, 5 syncing)

All synced:
  [✓ 0]  (green badge, 0 pending)
```

### Expected Outcome
- Notification system emits events for queue changes
- Users receive toast notifications for important events
- Queue size warnings alert users to growing backlog
- Status badge shows current queue state
- React hook enables easy integration in components

### Verification Checklist
- [ ] Notification types enum defined (8+ types)
- [ ] QueueNotification interface defined
- [ ] Event emitter pattern implemented (on, off, emit)
- [ ] `addNotificationListener` method implemented
- [ ] Notifications emitted on queueTransaction
- [ ] Notifications emitted on markAsSynced
- [ ] Notifications emitted on markAsFailed
- [ ] Queue size monitoring checks thresholds (10, 25, 50, 100)
- [ ] `formatNotification` method creates user-friendly messages
- [ ] Notification filtering by level (ALL, WARNING, ERROR)
- [ ] React hook `useQueueNotifications` implemented
- [ ] `QueueNotificationToast` component created
- [ ] `QueueStatusBadge` component shows count and status
- [ ] Notifications auto-dismiss after timeout

---

## Task 52: Implement queue cleanup

### Overview
Implement automatic cleanup of old successfully synced transactions to prevent the queue from growing indefinitely and consuming excessive storage space.

### Dependencies
- Task 35: Create TransactionQueue class
- Task 40: Implement mark_as_synced
- Task 45: Implement queue persistence

### Instructions

1. **Define cleanup configuration**
   - Field: `cleanupThreshold`
   - Type: number (milliseconds)
   - Default: 86400000 ms (24 hours)
   - Determines age for cleanup

2. **Add cleanup strategy enum**
   - AGE_BASED: Remove based on synced_at age
   - COUNT_BASED: Keep only last N synced transactions
   - STORAGE_BASED: Remove when storage quota reached
   - MANUAL: Only cleanup on explicit call

3. **Create cleanup method**
   - Method: `cleanupQueue(strategy?: CleanupStrategy)`
   - Removes eligible transactions
   - Returns Promise<CleanupResult>
   - Never removes PENDING or FAILED

4. **Implement age-based cleanup**
   - Find SYNCED transactions where synced_at older than threshold
   - Delete from IndexedDB
   - Keep recent synced transactions
   - Default: Remove after 24 hours

5. **Implement count-based cleanup**
   - Configuration: `maxSyncedTransactions`
   - Default: 1000
   - Keep only N most recent synced transactions
   - Delete oldest synced beyond limit

6. **Implement storage-based cleanup**
   - Monitor IndexedDB storage usage
   - If > 80% quota: Trigger cleanup
   - Remove oldest synced until < 70%
   - Preserve pending and failed

7. **Create automatic cleanup scheduling**
   - Run cleanup periodically (e.g., every hour)
   - Use setInterval or similar
   - Only if transactions exist
   - Clear interval on queue destroy

8. **Add manual cleanup method**
   - Method: `cleanupNow()`
   - Forces immediate cleanup
   - Uses configured strategy
   - Returns cleanup report

9. **Define CleanupResult interface**
   - total_scanned: Count of transactions checked
   - removed: Count of transactions deleted
   - kept: Count of transactions preserved
   - freed_space: Estimated bytes freed (optional)
   - duration_ms: Cleanup execution time

10. **Preserve important synced transactions**
    - Configuration: `preserveSyncedDays`
    - Default: 1 (keep for 1 day)
    - Option to preserve specific transactions (flag)
    - Never delete if marked as important

11. **Create cleanup safety checks**
    - Never delete PENDING transactions
    - Never delete FAILED transactions
    - Never delete transactions with dependents (unless dependents also synced)
    - Confirm before deleting large batches (> 100)

12. **Add cleanup logging**
    - Log cleanup events
    - Include count removed
    - Include space freed
    - Include strategy used
    - Enable analytics

13. **Implement cleanup on initialization**
    - Run cleanup when TransactionQueue created
    - Clean up old transactions from previous sessions
    - Don't block initialization
    - Run asynchronously

### Cleanup Configuration

| Setting | Default | Description |
|---------|---------|-------------|
| `cleanupThreshold` | 86400000 ms (24 hours) | Age for automatic cleanup |
| `cleanupStrategy` | AGE_BASED | Default cleanup strategy |
| `maxSyncedTransactions` | 1000 | Max synced transactions to keep (COUNT_BASED) |
| `cleanupInterval` | 3600000 ms (1 hour) | How often to run auto-cleanup |
| `preserveSyncedDays` | 1 | Days to keep synced transactions |

### Cleanup Strategies

| Strategy | Logic | Use Case |
|----------|-------|----------|
| **AGE_BASED** | Remove synced > 24 hours old | Default, time-based retention |
| **COUNT_BASED** | Keep only last 1000 synced | Fixed-size queue |
| **STORAGE_BASED** | Remove when quota > 80% | Storage-constrained devices |
| **MANUAL** | Only cleanup on explicit call | Testing, debugging |

### Age-Based Cleanup Logic

```
Current time: 2024-01-02T10:00:00Z
Threshold: 24 hours (86400000 ms)
Cutoff: 2024-01-01T10:00:00Z

Query:
  SELECT * FROM transactions
  WHERE status = 'SYNCED'
    AND synced_at < '2024-01-01T10:00:00Z'

Result:
  Transaction A: synced_at = 2024-01-01T09:00:00Z → DELETE
  Transaction B: synced_at = 2024-01-01T11:00:00Z → KEEP
  Transaction C: synced_at = 2024-01-02T09:00:00Z → KEEP
```

### Count-Based Cleanup Logic

```
Current synced count: 1200
Max synced transactions: 1000
To delete: 200 oldest

Query:
  SELECT * FROM transactions
  WHERE status = 'SYNCED'
  ORDER BY synced_at ASC
  LIMIT 200

Action:
  Delete the 200 oldest synced transactions
```

### Storage-Based Cleanup Logic

```
Check storage quota:
  Used: 450 MB
  Total: 500 MB
  Percentage: 90%

If > 80%:
  1. Find oldest SYNCED transactions
  2. Delete in batches of 50
  3. Check quota after each batch
  4. Stop when < 70% (350 MB)
```

### CleanupResult Interface

```typescript
interface CleanupResult {
  total_scanned: number;        // Transactions checked
  removed: number;              // Transactions deleted
  kept: number;                 // Transactions preserved
  freed_space?: number;         // Bytes freed (estimated)
  duration_ms: number;          // Execution time
  strategy: CleanupStrategy;    // Strategy used
  timestamp: string;            // ISO timestamp
}
```

### Cleanup Safety Rules

| Rule | Check | Action if Violated |
|------|-------|-------------------|
| **Never delete PENDING** | status != 'PENDING' | Skip transaction |
| **Never delete FAILED** | status != 'FAILED' | Skip transaction |
| **Never delete recent** | synced_at > cutoff | Skip transaction |
| **Never delete with dependents** | No PENDING dependents | Skip transaction |
| **Confirm large batch** | count > 100 | Request user confirmation |

### Automatic Cleanup Scheduling

```typescript
class TransactionQueue {
  private cleanupIntervalId?: number;
  
  constructor(config: QueueConfig) {
    // ...
    
    // Schedule automatic cleanup
    this.cleanupIntervalId = setInterval(
      () => this.cleanupQueue(),
      config.cleanupInterval || 3600000  // 1 hour
    );
  }
  
  destroy() {
    // Clear cleanup interval
    if (this.cleanupIntervalId) {
      clearInterval(this.cleanupIntervalId);
    }
  }
}
```

### Cleanup Example Results

**Age-Based Cleanup:**
```typescript
{
  total_scanned: 500,
  removed: 180,
  kept: 320,
  freed_space: 2400000,  // ~2.4 MB
  duration_ms: 234,
  strategy: "AGE_BASED",
  timestamp: "2024-01-02T10:00:00Z"
}
```

**Storage-Based Cleanup:**
```typescript
{
  total_scanned: 1200,
  removed: 450,
  kept: 750,
  freed_space: 18000000,  // ~18 MB
  duration_ms: 567,
  strategy: "STORAGE_BASED",
  timestamp: "2024-01-02T10:00:00Z"
}
```

### Cleanup Logging

```
[2024-01-02 10:00:00] Cleanup started (AGE_BASED)
[2024-01-02 10:00:00] Scanned 500 transactions
[2024-01-02 10:00:00] Removing 180 transactions older than 24 hours
[2024-01-02 10:00:01] Cleanup complete: 180 removed, 320 kept
[2024-01-02 10:00:01] Freed ~2.4 MB of storage
[2024-01-02 10:00:01] Duration: 234 ms
```

### Expected Outcome
- Old synced transactions automatically cleaned up
- Queue doesn't grow indefinitely
- Storage space freed periodically
- Cleanup runs on schedule without user intervention
- Manual cleanup available when needed

### Verification Checklist
- [ ] Cleanup configuration fields defined (threshold, strategy)
- [ ] Cleanup strategy enum defined (AGE_BASED, COUNT_BASED, STORAGE_BASED, MANUAL)
- [ ] `cleanupQueue` method implemented
- [ ] Age-based cleanup removes transactions older than threshold
- [ ] Count-based cleanup keeps only max N synced transactions
- [ ] Storage-based cleanup triggers on quota usage
- [ ] Automatic cleanup scheduled (runs every hour)
- [ ] `cleanupNow` method forces immediate cleanup
- [ ] CleanupResult interface defined with statistics
- [ ] Cleanup never deletes PENDING or FAILED transactions
- [ ] Cleanup never deletes transactions with pending dependents
- [ ] Cleanup logging records events and statistics
- [ ] Cleanup runs asynchronously on queue initialization

---

## Summary

### Tasks Completed in This Document
| Task # | Task Name | Key Deliverable |
|--------|-----------|-----------------|
| 49 | Implement queue ordering | FIFO/priority ordering strategies |
| 50 | Add dependency tracking | Transaction dependency management |
| 51 | Create queue notifications | User notification system |
| 52 | Implement queue cleanup | Automatic removal of old transactions |

### Final Queue Management Features
- **Ordering**: FIFO, LIFO, priority-based, dependency-aware strategies
- **Dependencies**: Track and enforce transaction dependencies
- **Notifications**: Real-time updates on queue status
- **Cleanup**: Automatic removal of old synced transactions

### Complete TransactionQueue API

```typescript
class TransactionQueue {
  // Core operations (Tasks 35-42)
  queueTransaction(payload, dependsOn?): Promise<string>;
  getPendingTransactions(filters?): Promise<QueuedTransaction[]>;
  markAsSynced(offlineId, serverTxnId): Promise<boolean>;
  markAsFailed(offlineId, error, details?): Promise<boolean>;
  
  // Retry management (Tasks 42-43)
  getRetryCount(offlineId): Promise<number>;
  canRetry(offlineId): Promise<boolean>;
  getMaxRetries(): number;
  
  // Status and health (Task 44)
  getQueueStatus(): Promise<QueueStatusSummary>;
  
  // Persistence (Task 45)
  recoverQueue(): Promise<RecoveryReport>;
  checkPersistence(): Promise<boolean>;
  handleShutdown(): Promise<void>;
  
  // Integrity (Task 46)
  validateTransaction(payload): ValidationResult;
  checkQueueIntegrity(): Promise<IntegrityReport>;
  
  // Backup/Restore (Tasks 47-48)
  exportQueue(options?): Promise<string>;
  downloadExportFile(filename?): Promise<void>;
  importQueue(content, options?): Promise<ImportResult>;
  importFromFile(file, options?): Promise<ImportResult>;
  
  // Ordering (Task 49)
  getNextTransaction(): Promise<QueuedTransaction | null>;
  getNextBatch(size): Promise<QueuedTransaction[]>;
  reorderQueue(strategy): Promise<void>;
  
  // Dependencies (Task 50)
  getDependency(offlineId): Promise<QueuedTransaction | null>;
  getDependents(offlineId): Promise<QueuedTransaction[]>;
  getDependencyChain(offlineId): Promise<QueuedTransaction[]>;
  canProcess(offlineId): Promise<boolean>;
  detectCircularDependencies(): Promise<CircularDependency[]>;
  
  // Notifications (Task 51)
  addNotificationListener(callback): () => void;
  setNotificationLevel(level): void;
  
  // Cleanup (Task 52)
  cleanupQueue(strategy?): Promise<CleanupResult>;
  cleanupNow(): Promise<CleanupResult>;
}
```

### Group C Complete!
All 18 tasks (35-52) in Group C: Transaction Queue Management are now documented. The queue system provides:
- Reliable offline transaction storage
- Intelligent ordering and processing
- Dependency management
- User notifications
- Automatic cleanup
- Backup and recovery

### Next Steps
Proceed to [../Group-D_Sync-Engine-Conflict-Resolution/](../Group-D_Sync-Engine-Conflict-Resolution/) to implement:
- Sync engine that processes the queue
- Network detection and automatic sync
- Conflict detection and resolution
- Server communication and error handling

---

## Notes for AI Agents

1. **Execution Order:** Task 49 first, then 50-52 can be done in parallel
2. **Dependency Graph:** Task 50 is critical for related transactions (customer + sale)
3. **User Experience:** Task 51 notifications are essential for user awareness
4. **Storage Management:** Task 52 cleanup prevents unbounded growth
5. **Testing:** Test circular dependency detection thoroughly
6. **Performance:** Optimize ordering queries with proper indexes
7. **UI Integration:** Notifications should integrate with existing toast/snackbar system
8. **Cleanup Timing:** Run cleanup during low-activity periods if possible
