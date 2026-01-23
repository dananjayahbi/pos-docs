# Tasks 53-59: Sync Engine & Push Operations

> **Phase:** 05 - ERP Core Modules Part 2  
> **SubPhase:** 02 - POS Offline Mode  
> **Group:** D - Sync Engine & Conflict Resolution  
> **Document:** 01 of 03  
> **Tasks Covered:** 53, 54, 55, 56, 57, 58, 59

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Group:** [../Group-C_Transaction-Queue-Management/](../Group-C_Transaction-Queue-Management/)
- **→ Next Document:** [02_Tasks-60-67_Pull-Conflict-Resolution.md](02_Tasks-60-67_Pull-Conflict-Resolution.md)

---

## Document Overview

This document covers the creation of the SyncEngine class and the implementation of push operations. These components handle connection detection, automatic synchronization triggers, and the transmission of queued transactions to the server.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 53 | Create SyncEngine class | High | 35 min |
| 54 | Implement connection detection | Medium | 25 min |
| 55 | Add connection event listeners | Medium | 20 min |
| 56 | Implement auto-sync trigger | Medium | 25 min |
| 57 | Create sync lock mechanism | Medium | 20 min |
| 58 | Implement push_transactions method | High | 30 min |
| 59 | Create batch sync optimization | Medium | 25 min |

---

## Task 53: Create SyncEngine Class

### Overview
Create the main SyncEngine class that orchestrates all synchronization operations between the offline POS terminal and the server. This class manages the lifecycle of sync operations, coordinates push and pull processes, and handles sync state management.

### Dependencies
- Transaction queue from Group C (Tasks 45-52)
- Offline storage infrastructure from Group B (Tasks 27-44)

### Instructions

1. **Create SyncEngine class file**
   - Create new TypeScript file: `frontend/lib/offline/sync-engine.ts`
   - Define SyncEngine as a singleton class
   - Include proper TypeScript interfaces and types

2. **Define SyncEngine configuration interface**
   - Server API endpoint URL
   - Sync interval (seconds between automatic syncs)
   - Max retry attempts
   - Batch size for transaction uploads
   - Timeout duration for network requests

3. **Create SyncEngine state properties**
   - Current sync status (idle, syncing, error)
   - Is currently online (boolean)
   - Last successful sync timestamp
   - Sync lock status (boolean)
   - Active sync operation reference

4. **Define sync status enumeration**
   - IDLE - No sync in progress
   - CONNECTING - Establishing connection
   - PUSHING - Uploading local changes
   - PULLING - Downloading server updates
   - RESOLVING_CONFLICTS - Handling conflicts
   - COMPLETED - Sync finished successfully
   - ERROR - Sync failed

5. **Implement SyncEngine constructor**
   - Accept configuration object
   - Initialize state properties
   - Set up event emitter for sync events
   - Initialize connection monitor
   - Do not start auto-sync in constructor

6. **Create initialize method**
   - Start connection monitoring
   - Register event listeners
   - Restore last sync timestamp from storage
   - Set up auto-sync timer if configured
   - Return initialization success status

7. **Implement cleanup/destroy method**
   - Stop auto-sync timer
   - Remove event listeners
   - Cancel any in-progress sync
   - Release sync lock
   - Clear state

8. **Add sync state getter methods**
   - `getCurrentStatus()` - returns current sync status
   - `isOnline()` - returns current online status
   - `isSyncing()` - returns true if sync in progress
   - `getLastSyncTime()` - returns last successful sync timestamp

9. **Create event emitter setup**
   - Emit events: sync:started, sync:progress, sync:completed, sync:error
   - Emit events: connection:changed
   - Allow external listeners to subscribe

10. **Add logging framework integration**
    - Log all sync lifecycle events
    - Log errors with full context
    - Log sync performance metrics
    - Include terminal ID in all logs

### SyncEngine Class Structure

```
SyncEngine
├── Configuration
│   ├── API endpoint
│   ├── Sync interval
│   ├── Retry settings
│   └── Batch size
├── State
│   ├── Sync status
│   ├── Online status
│   ├── Last sync time
│   └── Lock status
├── Methods
│   ├── initialize()
│   ├── destroy()
│   ├── startSync()
│   ├── push()
│   ├── pull()
│   └── resolve()
└── Events
    ├── sync:*
    └── connection:*
```

### Sync Status Flow

```
IDLE → CONNECTING → PUSHING → PULLING → RESOLVING_CONFLICTS → COMPLETED
                       ↓           ↓              ↓
                    ERROR ←────────┴──────────────┘
                       ↓
                    IDLE (after backoff)
```

### Expected Outcome
```
frontend/
└── lib/
    └── offline/
        └── sync-engine.ts           # SyncEngine class (Tasks 53-59)
```

### Verification Checklist
- [ ] SyncEngine class created as singleton
- [ ] Configuration interface defined
- [ ] State properties initialized
- [ ] Sync status enum defined
- [ ] Constructor accepts configuration
- [ ] Initialize method sets up monitoring
- [ ] Cleanup method releases resources
- [ ] State getter methods implemented
- [ ] Event emitter configured
- [ ] Logging integrated

---

## Task 54: Implement Connection Detection

### Overview
Implement connection detection functionality to determine whether the POS terminal has active internet connectivity. This includes both initial connection checks and periodic monitoring.

### Dependencies
- Task 53: Create SyncEngine class

### Instructions

1. **Create ConnectionMonitor class**
   - Create new file: `frontend/lib/offline/connection-monitor.ts`
   - Define class to handle connection detection
   - Include TypeScript interfaces

2. **Implement connection check methods**
   - `checkConnection()` - primary connection test
   - Return online/offline status
   - Include timeout handling

3. **Add multiple detection strategies**
   - Browser `navigator.onLine` API check
   - Ping server endpoint (HEAD request)
   - Check for successful response from known endpoint
   - Fallback to multiple strategies if one fails

4. **Create ping endpoint method**
   - Use HEAD request to minimize data transfer
   - Target lightweight server endpoint (e.g., `/api/health/ping`)
   - Set timeout (5 seconds recommended)
   - Handle network errors gracefully

5. **Implement connection quality detection**
   - Measure response time
   - Categorize connection: offline, slow, normal, fast
   - Store quality metric for sync optimization

6. **Add connection test retry logic**
   - Retry failed checks 2-3 times
   - Use short intervals between retries
   - Return offline if all retries fail

7. **Create periodic monitoring**
   - Check connection every 30 seconds when offline
   - Check every 5 minutes when online
   - Adjust intervals based on battery status (mobile)

8. **Implement connection state caching**
   - Cache last known connection state
   - Cache last successful connection timestamp
   - Avoid excessive server pings

9. **Add battery-aware monitoring**
   - Reduce check frequency on low battery
   - Disable background checks if battery critical
   - Use Battery Status API if available

10. **Integrate with SyncEngine**
    - Export ConnectionMonitor from module
    - Use in SyncEngine initialization
    - Expose connection status to SyncEngine

### Connection Detection Strategies

| Strategy | Priority | Pros | Cons |
|----------|----------|------|------|
| `navigator.onLine` | 1st | Instant, no network cost | False positives |
| Server ping | 2nd | Reliable, confirms backend | Network cost |
| Recent API success | 3rd | No extra request | May be stale |

### Connection Quality Levels

| Level | Response Time | Sync Strategy |
|-------|---------------|---------------|
| OFFLINE | No response | Queue only |
| SLOW | > 2000ms | Small batches |
| NORMAL | 500-2000ms | Normal batches |
| FAST | < 500ms | Large batches |

### Ping Endpoint Requirements

```
Endpoint: GET /api/health/ping
Response: 200 OK
Headers:
  - X-Server-Time: <timestamp>
  - X-Sync-Version: <version>
Body: {"status": "ok"}
```

### Expected Outcome
```
frontend/
└── lib/
    └── offline/
        ├── sync-engine.ts
        └── connection-monitor.ts    # Connection detection (Task 54)
```

### Verification Checklist
- [ ] ConnectionMonitor class created
- [ ] Multiple detection strategies implemented
- [ ] Ping endpoint method created
- [ ] Connection quality detection added
- [ ] Retry logic implemented
- [ ] Periodic monitoring configured
- [ ] State caching implemented
- [ ] Battery awareness added
- [ ] SyncEngine integration complete

---

## Task 55: Add Connection Event Listeners

### Overview
Add event listeners to detect real-time changes in network connectivity status using browser APIs. These listeners enable immediate response to connection state changes.

### Dependencies
- Task 54: Implement connection detection

### Instructions

1. **Add browser online event listener**
   - Listen to `window.addEventListener('online')`
   - Trigger connection verification on event
   - Update connection state

2. **Add browser offline event listener**
   - Listen to `window.addEventListener('offline')`
   - Immediately update connection state to offline
   - Cancel any in-progress network requests

3. **Implement visibility change listener**
   - Listen to `document.visibilityState` changes
   - Check connection when page becomes visible
   - Handle tab switching scenarios

4. **Add focus event listener**
   - Listen to `window.addEventListener('focus')`
   - Verify connection when window gains focus
   - Handle app switching scenarios

5. **Create custom connection change event**
   - Define `ConnectionChangeEvent` interface
   - Include: online status, previous status, timestamp, quality
   - Emit event on state changes

6. **Implement event listener cleanup**
   - Store listener references
   - Remove all listeners on cleanup
   - Prevent memory leaks

7. **Add event debouncing**
   - Debounce rapid connection state changes
   - Wait 1-2 seconds before confirming state change
   - Prevent sync trigger spam

8. **Create connection change callback**
   - Accept callback function in ConnectionMonitor
   - Call callback on verified state change
   - Pass new connection state to callback

9. **Implement connection state verification**
   - Don't trust browser events blindly
   - Verify with actual ping after online event
   - Confirm offline state with multiple checks

10. **Integrate with SyncEngine events**
    - Emit connection:changed event from SyncEngine
    - Include full connection details
    - Allow components to react to changes

### Browser Events Reference

| Event | Trigger | Reliability | Action |
|-------|---------|-------------|--------|
| `online` | Network connected | Low | Verify with ping |
| `offline` | Network disconnected | High | Trust immediately |
| `visibilitychange` | Tab visible/hidden | High | Check on visible |
| `focus` | Window focused | Medium | Verify connection |

### Event Flow Diagram

```
Browser Event → Debounce → Verify → Update State → Emit Custom Event
                   ↓          ↓          ↓              ↓
               (1-2 sec)  (Ping)  (Cache + Store)  (Notify listeners)
```

### Connection Change Event Structure

```typescript
interface ConnectionChangeEvent {
  online: boolean;
  previouslyOnline: boolean;
  timestamp: number;
  quality: 'offline' | 'slow' | 'normal' | 'fast';
  verified: boolean;
}
```

### Debouncing Logic

```
Online Event → Wait 2s → Ping → Confirmed Online
Offline Event → Immediate → Confirmed Offline
Multiple Events in 2s → Process Last Only
```

### Expected Outcome
```
frontend/
└── lib/
    └── offline/
        ├── sync-engine.ts
        └── connection-monitor.ts    # Now includes event listeners (Task 55)
```

### Verification Checklist
- [ ] Online event listener added
- [ ] Offline event listener added
- [ ] Visibility change listener added
- [ ] Focus event listener added
- [ ] Custom event defined
- [ ] Listener cleanup implemented
- [ ] Event debouncing added
- [ ] Connection callbacks created
- [ ] State verification implemented
- [ ] SyncEngine event integration complete

---

## Task 56: Implement Auto-Sync Trigger

### Overview
Implement automatic synchronization triggers that start the sync process when the terminal comes online. This ensures data is synchronized as soon as possible without manual intervention.

### Dependencies
- Task 53: Create SyncEngine class
- Task 55: Add connection event listeners

### Instructions

1. **Create auto-sync trigger method**
   - Method name: `triggerAutoSync()`
   - Check if auto-sync is enabled in configuration
   - Verify terminal is online before triggering

2. **Add connection state change handler**
   - Listen for connection:changed events
   - Trigger sync when status changes from offline to online
   - Ignore online-to-online changes

3. **Implement sync conditions check**
   - Terminal must be online
   - No sync currently in progress
   - Minimum time elapsed since last sync (e.g., 60 seconds)
   - Pending transactions exist in queue

4. **Add immediate sync on reconnection**
   - When coming online after offline period
   - Check if offline period exceeded threshold (e.g., 5 minutes)
   - Trigger full sync if threshold exceeded

5. **Create scheduled sync timer**
   - Set up interval timer for periodic sync
   - Default interval: every 5 minutes when online
   - Clear timer when going offline

6. **Implement sync priority levels**
   - IMMEDIATE - trigger within 5 seconds (after reconnection)
   - HIGH - trigger within 1 minute (after user action)
   - NORMAL - trigger at next scheduled interval
   - LOW - trigger when idle

7. **Add user action triggers**
   - Trigger sync after successful offline transaction
   - Trigger after significant data changes
   - Trigger after session close

8. **Create sync cooldown mechanism**
   - Prevent syncing too frequently
   - Minimum interval between syncs: 60 seconds
   - Track last sync attempt timestamp

9. **Implement background sync support**
   - Use Background Sync API if available
   - Register sync task when going offline
   - Browser triggers sync when online

10. **Add manual sync trigger**
    - Method: `manualSync()`
    - Allow user-initiated sync
    - Bypass some automatic restrictions
    - Return Promise with sync result

### Auto-Sync Trigger Scenarios

| Scenario | Trigger Type | Priority | Cooldown |
|----------|--------------|----------|----------|
| Reconnection after 10+ min offline | Immediate | IMMEDIATE | None |
| Reconnection after 2 min offline | Scheduled | HIGH | 60s |
| Every 5 minutes when online | Timer | NORMAL | N/A |
| After offline transaction | Event | HIGH | 30s |
| User clicks sync button | Manual | IMMEDIATE | None |

### Sync Conditions Flowchart

```
Connection Online?
    ↓ YES
Sync Lock Free?
    ↓ YES
Cooldown Expired?
    ↓ YES
Pending Transactions?
    ↓ YES
START SYNC
```

### Background Sync API Usage

```
Register on Offline:
  navigator.serviceWorker.ready
    .then(reg => reg.sync.register('sync-transactions'))

Service Worker Handles:
  self.addEventListener('sync', event => {
    if (event.tag === 'sync-transactions') {
      event.waitUntil(syncEngine.startSync())
    }
  })
```

### Sync Priority Queue

```
Priority Queue:
├── IMMEDIATE: [reconnection sync, manual sync]
├── HIGH: [post-transaction, session end]
├── NORMAL: [scheduled interval]
└── LOW: [idle sync, background]
```

### Expected Outcome
```
frontend/
└── lib/
    └── offline/
        └── sync-engine.ts           # Now includes auto-sync triggers (Task 56)
```

### Verification Checklist
- [ ] Auto-sync trigger method created
- [ ] Connection change handler added
- [ ] Sync conditions check implemented
- [ ] Immediate sync on reconnection
- [ ] Scheduled sync timer created
- [ ] Sync priority levels defined
- [ ] User action triggers added
- [ ] Cooldown mechanism implemented
- [ ] Background Sync API integration
- [ ] Manual sync trigger added

---

## Task 57: Create Sync Lock Mechanism

### Overview
Create a synchronization lock mechanism to prevent multiple concurrent sync operations. This ensures data integrity and prevents race conditions during synchronization.

### Dependencies
- Task 53: Create SyncEngine class

### Instructions

1. **Create sync lock property**
   - Add private boolean property: `_syncLock`
   - Initialize to false in constructor
   - Track lock acquisition timestamp

2. **Implement lock acquisition method**
   - Method name: `acquireSyncLock()`
   - Check if lock is available
   - Set lock to true if available
   - Return success/failure boolean

3. **Implement lock release method**
   - Method name: `releaseSyncLock()`
   - Set lock to false
   - Clear lock timestamp
   - Emit lock released event

4. **Add lock timeout mechanism**
   - Maximum lock duration: 5 minutes
   - Auto-release lock after timeout
   - Log warning if timeout occurs

5. **Create lock status check method**
   - Method name: `isSyncLocked()`
   - Return current lock status
   - Include lock duration in response

6. **Implement lock waiting queue**
   - Queue pending sync requests when locked
   - Process queue when lock released
   - Maximum queue size: 5 requests

7. **Add force unlock method**
   - Method name: `forceUnlockSync()`
   - Administrative override for stuck locks
   - Log force unlock event
   - Use only in error recovery

8. **Create lock conflict handling**
   - Reject new sync if locked
   - Return clear error message
   - Include estimated wait time

9. **Implement lock persistence**
   - Store lock status in memory only
   - Clear lock on app reload/crash
   - Lock should not persist across sessions

10. **Add lock monitoring and logging**
    - Log lock acquisition and release
    - Track lock hold duration
    - Alert if lock held too long

### Lock State Management

| State | Lock Status | Actions Allowed |
|-------|-------------|-----------------|
| UNLOCKED | false | Acquire lock, start sync |
| LOCKED | true | Queue request, reject sync |
| TIMED_OUT | true (stale) | Force unlock, start sync |

### Lock Acquisition Flow

```
Request Sync
    ↓
Lock Available? → NO → Queue Request
    ↓ YES              (or Reject if queue full)
Acquire Lock
    ↓
Start Sync
    ↓
Sync Completes
    ↓
Release Lock
    ↓
Process Queue
```

### Lock Timeout Handling

```
Lock Acquired at T0
    ↓
Check at T0 + 5min
    ↓
Still Locked? → YES → Force Release + Log Error
    ↓ NO
Normal Release
```

### Lock Error Scenarios

| Scenario | Error Code | Action |
|----------|------------|--------|
| Already locked | SYNC_LOCKED | Queue or reject |
| Lock timeout | SYNC_TIMEOUT | Force unlock + retry |
| Force unlock | FORCE_UNLOCK | Log + release |

### Lock Metrics to Track

```
Metrics:
├── Total lock acquisitions
├── Average lock duration
├── Lock timeouts count
├── Force unlocks count
├── Queue length (current)
└── Queue rejections count
```

### Expected Outcome
```
frontend/
└── lib/
    └── offline/
        └── sync-engine.ts           # Now includes lock mechanism (Task 57)
```

### Verification Checklist
- [ ] Sync lock property created
- [ ] Lock acquisition method implemented
- [ ] Lock release method implemented
- [ ] Lock timeout mechanism added
- [ ] Lock status check method created
- [ ] Lock waiting queue implemented
- [ ] Force unlock method added
- [ ] Lock conflict handling created
- [ ] Lock persistence handled correctly
- [ ] Lock monitoring and logging added

---

## Task 58: Implement Push Transactions Method

### Overview
Implement the method that pushes queued transactions from the local database to the server. This is the core push operation that uploads offline changes.

### Dependencies
- Task 53: Create SyncEngine class
- Task 57: Create sync lock mechanism
- Transaction queue from Group C

### Instructions

1. **Create pushTransactions method**
   - Method signature: `async pushTransactions(): Promise<SyncResult>`
   - Main method for uploading queued transactions
   - Return sync result with success/failure details

2. **Acquire sync lock**
   - Call `acquireSyncLock()` at method start
   - Return error if lock not available
   - Ensure lock released in finally block

3. **Fetch pending transactions**
   - Query transaction queue for pending items
   - Filter by status: PENDING
   - Sort by creation timestamp (oldest first)
   - Limit to batch size from configuration

4. **Validate transactions before push**
   - Check required fields are present
   - Validate data integrity
   - Check for corrupted transactions
   - Skip invalid transactions with logging

5. **Prepare transaction payload**
   - Convert transactions to server format
   - Include metadata: terminal_id, offline_timestamp
   - Add transaction signatures if security enabled
   - Compress payload if large

6. **Send transactions to server**
   - POST to `/api/sync/push-transactions/`
   - Include authentication headers
   - Set timeout (30 seconds)
   - Handle network errors

7. **Process server response**
   - Parse response JSON
   - Extract successful transaction IDs
   - Extract failed transaction IDs with reasons
   - Extract conflict indicators

8. **Update local transaction status**
   - Mark successful transactions as SYNCED
   - Mark failed transactions as ERROR
   - Mark conflicted transactions as CONFLICT
   - Update sync timestamp

9. **Handle partial success**
   - Some transactions succeed, others fail
   - Continue with successful ones
   - Retry failed ones in next sync
   - Log all outcomes

10. **Emit progress events**
    - Emit sync:progress during upload
    - Include: total, completed, failed counts
    - Update progress percentage
    - Allow UI to show progress

11. **Handle push errors**
    - Network errors: retry with backoff
    - Authentication errors: refresh token
    - Server errors: log and skip
    - Validation errors: mark transaction as failed

12. **Clean up after push**
    - Release sync lock
    - Update last sync timestamp
    - Emit sync:completed event
    - Return result summary

### Push Transaction Payload Format

```json
{
  "terminal_id": "TERM-12345",
  "transactions": [
    {
      "local_id": "offline-tx-001",
      "type": "sale",
      "timestamp": "2026-01-23T14:30:00Z",
      "data": { /* transaction details */ },
      "signature": "sha256-hash"
    }
  ],
  "sync_token": "last-sync-token"
}
```

### Server Response Format

```json
{
  "success": true,
  "results": {
    "successful": [
      {
        "local_id": "offline-tx-001",
        "server_id": "tx-67890",
        "synced_at": "2026-01-23T14:31:00Z"
      }
    ],
    "failed": [
      {
        "local_id": "offline-tx-002",
        "error": "Invalid product ID"
      }
    ],
    "conflicts": [
      {
        "local_id": "offline-tx-003",
        "reason": "Stock already depleted"
      }
    ]
  },
  "next_sync_token": "new-sync-token"
}
```

### Transaction Status Updates

| Original Status | Push Result | New Status |
|-----------------|-------------|------------|
| PENDING | Success | SYNCED |
| PENDING | Failed | ERROR |
| PENDING | Conflict | CONFLICT |
| ERROR | Success (retry) | SYNCED |

### Push Flow Diagram

```
Start Push
    ↓
Acquire Lock
    ↓
Fetch Pending Transactions
    ↓
Validate Transactions
    ↓
Prepare Payload
    ↓
Send to Server
    ↓
Process Response
    ↓
Update Local Status
    ↓
Release Lock
    ↓
Emit Completed Event
```

### Error Handling Matrix

| Error Type | Retry? | Action |
|------------|--------|--------|
| Network timeout | Yes | Backoff + retry |
| 401 Unauthorized | Yes | Refresh token + retry |
| 400 Bad Request | No | Mark as failed |
| 409 Conflict | No | Mark for resolution |
| 500 Server Error | Yes | Retry with backoff |

### Expected Outcome
```
frontend/
└── lib/
    └── offline/
        └── sync-engine.ts           # Now includes push method (Task 58)
```

### Verification Checklist
- [ ] pushTransactions method created
- [ ] Sync lock acquired and released
- [ ] Pending transactions fetched
- [ ] Transaction validation implemented
- [ ] Payload preparation added
- [ ] Server API call implemented
- [ ] Response processing added
- [ ] Local status updates implemented
- [ ] Partial success handling added
- [ ] Progress events emitted
- [ ] Error handling complete
- [ ] Cleanup logic implemented

---

## Task 59: Create Batch Sync Optimization

### Overview
Implement batch sync optimization to efficiently upload multiple transactions in a single request. This reduces network overhead and improves sync performance.

### Dependencies
- Task 58: Implement push_transactions method

### Instructions

1. **Configure batch size**
   - Add configuration option: `batchSize`
   - Default: 50 transactions per batch
   - Adjustable based on network quality
   - Maximum: 100 transactions per batch

2. **Implement batch creation logic**
   - Group pending transactions into batches
   - Each batch limited by configured size
   - Preserve transaction order within batch
   - Create multiple batches if needed

3. **Add intelligent batch sizing**
   - Adjust batch size based on connection quality
   - Fast connection: 100 transactions
   - Normal connection: 50 transactions
   - Slow connection: 20 transactions
   - Very slow connection: 10 transactions

4. **Implement payload size limiting**
   - Calculate payload size before sending
   - Maximum payload size: 5MB
   - Split batch if payload too large
   - Consider compression for large payloads

5. **Create batch progress tracking**
   - Track which batch is currently uploading
   - Calculate overall progress across all batches
   - Emit progress events per batch

6. **Implement batch retry logic**
   - Retry entire batch on network failure
   - Split batch in half on persistent failure
   - Retry individual transactions after batch splits
   - Maximum 3 retries per batch

7. **Add batch timeout handling**
   - Set timeout per batch based on size
   - Base timeout: 30 seconds
   - Add 1 second per transaction
   - Maximum timeout: 120 seconds

8. **Implement parallel batch processing**
   - Option to send multiple batches in parallel
   - Default: sequential processing
   - Parallel mode: 2-3 batches at once
   - Monitor server load indicators

9. **Create batch result aggregation**
   - Collect results from all batches
   - Aggregate success/failure counts
   - Combine server-returned IDs
   - Generate comprehensive sync report

10. **Add batch optimization metrics**
    - Track average batch size used
    - Monitor batch processing time
    - Calculate optimal batch size over time
    - Adjust configuration based on metrics

### Batch Size Optimization Table

| Connection Quality | Batch Size | Timeout | Parallel Batches |
|-------------------|------------|---------|------------------|
| Fast (< 500ms) | 100 | 130s | 3 |
| Normal (500-2000ms) | 50 | 80s | 2 |
| Slow (2000-5000ms) | 20 | 50s | 1 |
| Very Slow (> 5000ms) | 10 | 40s | 1 |

### Batch Processing Flow

```
Fetch All Pending (e.g., 150 transactions)
    ↓
Determine Batch Size (e.g., 50)
    ↓
Create Batches (3 batches: 50, 50, 50)
    ↓
Process Batch 1 → Success → Mark 50 as synced
    ↓
Process Batch 2 → Success → Mark 50 as synced
    ↓
Process Batch 3 → Failure → Retry with smaller size (25, 25)
    ↓
Aggregate Results
    ↓
Return Final Report
```

### Batch Retry Strategy

```
Initial Batch: 50 transactions
    ↓ FAILURE
Retry Attempt 1: Same batch (50)
    ↓ FAILURE
Retry Attempt 2: Split in half (25 + 25)
    ↓
Process 25 → SUCCESS
Process 25 → FAILURE
    ↓
Retry Attempt 3: Split again (12 + 13)
    ↓
Process individually if still failing
```

### Payload Size Calculation

```typescript
interface BatchMetrics {
  transactionCount: number;
  estimatedSize: number; // bytes
  actualSize?: number;   // after serialization
  compressionRatio?: number;
}

// Calculate before sending
const estimateSize = (transactions) => {
  return JSON.stringify(transactions).length;
};

// Split if too large
if (estimatedSize > 5_000_000) { // 5MB
  splitBatch(batch);
}
```

### Parallel Batch Processing

```
Batch Queue: [Batch1, Batch2, Batch3, Batch4]
    ↓
Start: Batch1 | Batch2 (parallel)
    ↓
Complete: Batch1 ✓
Start: Batch3
    ↓
Complete: Batch2 ✓
Start: Batch4
    ↓
Complete: Batch3 ✓, Batch4 ✓
```

### Batch Metrics to Track

```
Metrics per Sync:
├── Total transactions
├── Number of batches
├── Average batch size
├── Total upload time
├── Time per batch
├── Retry count
├── Success rate
└── Optimal batch size (calculated)
```

### Expected Outcome
```
frontend/
└── lib/
    └── offline/
        └── sync-engine.ts           # Now includes batch optimization (Task 59)
```

### Verification Checklist
- [ ] Batch size configuration added
- [ ] Batch creation logic implemented
- [ ] Intelligent batch sizing added
- [ ] Payload size limiting implemented
- [ ] Batch progress tracking created
- [ ] Batch retry logic implemented
- [ ] Batch timeout handling added
- [ ] Parallel processing option added
- [ ] Result aggregation implemented
- [ ] Optimization metrics added

---

## Summary

### Tasks Completed in This Document
| Task # | Task Name | Key Deliverable |
|--------|-----------|-----------------|
| 53 | Create SyncEngine class | Core sync orchestration class |
| 54 | Implement connection detection | ConnectionMonitor with multiple strategies |
| 55 | Add connection event listeners | Real-time connection state monitoring |
| 56 | Implement auto-sync trigger | Automatic sync on reconnection |
| 57 | Create sync lock mechanism | Prevent concurrent syncs |
| 58 | Implement push_transactions method | Upload queued transactions |
| 59 | Create batch sync optimization | Efficient batch processing |

### Files Created
```
frontend/
└── lib/
    └── offline/
        ├── sync-engine.ts          # Main sync orchestration
        └── connection-monitor.ts   # Connection detection
```

### Key Concepts Implemented

#### Sync Engine Architecture
- Singleton pattern for SyncEngine
- Event-driven architecture
- State machine for sync status
- Lock mechanism for concurrency control

#### Connection Management
- Multiple detection strategies
- Real-time event listeners
- Connection quality assessment
- Battery-aware monitoring

#### Push Operations
- Transaction validation
- Batch processing
- Partial success handling
- Comprehensive error handling

### Next Steps
Proceed to [02_Tasks-60-67_Pull-Conflict-Resolution.md](02_Tasks-60-67_Pull-Conflict-Resolution.md) to implement:
1. Pull updates from server
2. Delta sync support
3. Conflict detection
4. Conflict resolution strategies

---

## Notes for AI Agents

### Implementation Guidelines
1. **Singleton Pattern:** Ensure SyncEngine is a true singleton with proper instance management
2. **Event Emitter:** Use strongly-typed event emitter for type safety
3. **Error Handling:** Every async operation should have try-catch with proper error logging
4. **Lock Management:** Always release locks in finally blocks to prevent deadlocks
5. **Network Requests:** Always include timeouts and retry logic
6. **Progress Tracking:** Emit progress events frequently for responsive UI

### Connection Detection Best Practices
- Never trust `navigator.onLine` alone
- Always verify online status with actual server ping
- Implement exponential backoff for connection checks
- Consider battery status for mobile devices
- Cache connection state to avoid excessive checks

### Batch Processing Optimization
- Start with conservative batch sizes
- Adjust based on actual performance metrics
- Monitor server response times
- Implement circuit breaker for server overload
- Consider network bandwidth limitations

### Testing Considerations
- Test with simulated network failures
- Test with various batch sizes
- Test concurrent sync attempts
- Test lock timeout scenarios
- Test partial success scenarios
