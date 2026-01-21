# Group C: Transaction Queue Management

> **Phase:** 05 - ERP Core Modules Part 2  
> **SubPhase:** 02 - POS Offline Mode  
> **Group:** C of F  
> **Tasks Covered:** 35-52  
> **Group Goal:** Implement transaction queue for offline transactions

---

## Navigation

- **↑ Parent:** [SubPhase-02 Summary](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group B: Local Data Caching](../Group-B_Local-Data-Caching/)
- **→ Next Group:** [Group D: Sync Engine & Conflict Resolution](../Group-D_Sync-Engine-Conflict-Resolution/)

---

## Group Overview

### Key Outcomes

1. **TransactionQueue Class** - Manage offline transactions in frontend
2. **Queue Transaction Method** - Add transaction to IndexedDB queue
3. **Offline Transaction ID** - Unique ID: OFFLINE-{terminal}-{timestamp}-{seq}
4. **Queue Position Tracking** - Track order of transactions
5. **Get Pending Transactions** - Retrieve all pending transactions
6. **Mark as Synced** - Mark transaction as successfully synced
7. **Mark as Failed** - Mark transaction as failed with error details
8. **Retry Counter** - Track retry attempts per transaction
9. **Max Retry Limit** - Configure maximum sync attempts
10. **Queue Status Summary** - Count of pending, syncing, failed
11. **Queue Persistence** - Survive browser refresh/restart
12. **Transaction Integrity Check** - Validate data before queuing
13. **Queue Export** - Export queue to file for recovery
14. **Queue Import** - Import queue from backup file
15. **Queue Ordering** - Process in chronological order
16. **Dependency Tracking** - Track transaction dependencies
17. **Queue Notifications** - Notify user of status changes
18. **Queue Cleanup** - Remove old synced transactions

### Technology Context

| Technology | Purpose |
|------------|---------|
| IndexedDB | Persistent queue storage |
| TypeScript | Type-safe queue operations |
| JSON | Transaction serialization |
| File API | Export/import queue backup |

---

## Documents in This Group

| # | Document | Tasks | Description |
|---|----------|-------|-------------|
| 01 | `01_Tasks-35-42_Queue-Core-Operations.md` | 35-42 | TransactionQueue class, queue/mark methods, retry counter |
| 02 | `02_Tasks-43-48_Limits-Persistence-Recovery.md` | 43-48 | Max retry, status summary, persistence, integrity, export/import |
| 03 | `03_Tasks-49-52_Ordering-Dependencies-Cleanup.md` | 49-52 | Queue ordering, dependency tracking, notifications, cleanup |

---

## Task Summary

| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 35 | Create TransactionQueue class | High | 30 min |
| 36 | Implement queue_transaction method | Medium | 25 min |
| 37 | Generate offline transaction ID | Medium | 20 min |
| 38 | Add queue position tracking | Low | 15 min |
| 39 | Implement get_pending_transactions | Medium | 20 min |
| 40 | Implement mark_as_synced | Medium | 20 min |
| 41 | Implement mark_as_failed | Medium | 20 min |
| 42 | Create retry counter | Low | 15 min |
| 43 | Define max retry limit | Low | 15 min |
| 44 | Create queue status summary | Medium | 20 min |
| 45 | Implement queue persistence | Medium | 25 min |
| 46 | Add transaction integrity check | Medium | 25 min |
| 47 | Create queue export functionality | Medium | 25 min |
| 48 | Create queue import functionality | Medium | 25 min |
| 49 | Implement queue ordering | Medium | 20 min |
| 50 | Add dependency tracking | Medium | 25 min |
| 51 | Create queue notifications | Medium | 20 min |
| 52 | Implement queue cleanup | Medium | 20 min |

---

## Execution Order

```
[Tasks 35-38: TransactionQueue class and ID generation]
         │
         ▼
[Tasks 39-42: Get/mark methods and retry counter]
         │
         ▼
[Tasks 43-46: Limits, persistence, integrity]
         │
         ▼
[Tasks 47-48: Export/import functionality]
         │
         ▼
[Tasks 49-52: Ordering, dependencies, notifications, cleanup]
```

---

## Expected Deliverables

```
frontend/
├── lib/
│   └── offline/
│       ├── transaction-queue.ts  # Tasks 35-52
│       └── queue-types.ts        # Type definitions
├── hooks/
│   └── useTransactionQueue.ts    # React hook wrapper
└── components/
    └── pos/
        └── QueueStatusBadge.tsx  # Task 51
```

---

## Notes for AI Agents

### Offline Transaction ID Format
```
OFFLINE-{TERMINAL}-{TIMESTAMP}-{SEQUENCE}
Example: OFFLINE-T01-1704067200-001

Where:
- TERMINAL: 3-char terminal code
- TIMESTAMP: Unix timestamp (seconds)
- SEQUENCE: 3-digit counter for same second
```

### Transaction Queue Structure
```typescript
interface QueuedTransaction {
  offline_id: string;
  terminal_id: string;
  session_id: string;
  created_at: string; // ISO timestamp
  synced_at: string | null;
  status: 'PENDING' | 'SYNCING' | 'SYNCED' | 'FAILED';
  retry_count: number;
  error_message: string | null;
  depends_on: string | null; // offline_id of dependency
  payload: TransactionPayload;
}
```

### Queue Status Summary
```typescript
interface QueueStatus {
  pending: number;
  syncing: number;
  synced: number;
  failed: number;
  total: number;
  oldest_pending: string | null; // ISO timestamp
  last_sync_attempt: string | null;
}
```

### Retry Logic
- Max retries: 5 (configurable)
- After max retries: Status = FAILED
- Manual retry available for FAILED transactions
- Exponential backoff between retries

### Dependency Tracking
- New customer created offline → customer ID pending
- Transaction uses offline customer → depends_on = customer offline_id
- Process dependencies first during sync

### Queue Cleanup Rules
- Keep SYNCED transactions for 24 hours
- Keep FAILED transactions indefinitely (until manual action)
- Keep PENDING transactions indefinitely
- Auto-cleanup runs on queue initialization

### Export File Format
```json
{
  "export_version": "1.0",
  "exported_at": "2024-01-01T10:00:00Z",
  "terminal_id": "T01",
  "transactions": [...]
}
```
