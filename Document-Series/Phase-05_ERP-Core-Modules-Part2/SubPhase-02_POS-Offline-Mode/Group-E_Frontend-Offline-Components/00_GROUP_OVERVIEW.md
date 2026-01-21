# Group E: Frontend Offline Components

> **Phase:** 05 - ERP Core Modules Part 2  
> **SubPhase:** 02 - POS Offline Mode  
> **Group:** E of F  
> **Tasks Covered:** 73-84  
> **Group Goal:** Create UI components for offline status and sync management

---

## Navigation

- **↑ Parent:** [SubPhase-02 Summary](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group D: Sync Engine & Conflict Resolution](../Group-D_Sync-Engine-Conflict-Resolution/)
- **→ Next Group:** [Group F: Testing & Documentation](../Group-F_Testing-Documentation/)

---

## Group Overview

### Key Outcomes

1. **OfflineIndicator Component** - Visual online/offline status indicator
2. **Connection Status Icon** - Color-coded icon (green/red/yellow)
3. **SyncStatusBar Component** - Show sync progress and pending count
4. **Pending Transaction Badge** - Show count of unsynced transactions
5. **SyncConflictModal Component** - Modal for resolving manual conflicts
6. **OfflineBanner Component** - Banner warning when operating offline
7. **Offline Mode Restrictions UI** - Disable unavailable features
8. **SyncLogViewer Component** - View sync history and errors
9. **ManualSyncButton Component** - Button to trigger manual sync
10. **Sync Error Toast Notifications** - Toast for sync errors
11. **Offline Data Status Page** - Page showing cache status, last sync
12. **Cache Refresh Button** - Button to force refresh cached data

### Technology Context

| Technology | Purpose |
|------------|---------|
| React/Next.js | UI components |
| TypeScript | Type-safe component props |
| Tailwind CSS | Component styling |
| Shadcn/UI | UI component library |
| React Query | Data fetching and caching |

---

## Documents in This Group

| # | Document | Tasks | Description |
|---|----------|-------|-------------|
| 01 | `01_Tasks-73-78_Status-Indicators.md` | 73-78 | OfflineIndicator, SyncStatusBar, SyncConflictModal, OfflineBanner |
| 02 | `02_Tasks-79-84_Management-Components.md` | 79-84 | Restrictions UI, SyncLogViewer, ManualSyncButton, toasts, status page |

---

## Task Summary

| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 73 | Create OfflineIndicator component | Medium | 25 min |
| 74 | Add connection status icon | Medium | 20 min |
| 75 | Create SyncStatusBar component | High | 30 min |
| 76 | Add pending transaction badge | Medium | 20 min |
| 77 | Create SyncConflictModal component | High | 35 min |
| 78 | Create OfflineBanner component | Medium | 25 min |
| 79 | Add offline mode restrictions UI | Medium | 25 min |
| 80 | Create SyncLogViewer component | High | 30 min |
| 81 | Create ManualSyncButton component | Medium | 20 min |
| 82 | Add sync error toast notifications | Medium | 20 min |
| 83 | Create offline data status page | High | 30 min |
| 84 | Add cache refresh button | Medium | 20 min |

---

## Execution Order

```
[Tasks 73-74: OfflineIndicator with status icon]
         │
         ▼
[Tasks 75-76: SyncStatusBar with pending badge]
         │
         ▼
[Tasks 77-78: SyncConflictModal and OfflineBanner]
         │
         ▼
[Tasks 79-82: Restrictions, log viewer, sync button, toasts]
         │
         ▼
[Tasks 83-84: Status page and cache refresh]
```

---

## Expected Deliverables

```
frontend/
├── components/
│   └── pos/
│       └── offline/
│           ├── OfflineIndicator.tsx    # Tasks 73-74
│           ├── SyncStatusBar.tsx       # Tasks 75-76
│           ├── SyncConflictModal.tsx   # Task 77
│           ├── OfflineBanner.tsx       # Task 78
│           ├── OfflineRestrictions.tsx # Task 79
│           ├── SyncLogViewer.tsx       # Task 80
│           ├── ManualSyncButton.tsx    # Task 81
│           └── CacheRefreshButton.tsx  # Task 84
├── app/
│   └── pos/
│       └── settings/
│           └── offline/
│               └── page.tsx            # Task 83
└── hooks/
    ├── useOfflineStatus.ts
    └── useSyncToasts.ts                # Task 82
```

---

## Notes for AI Agents

### OfflineIndicator States
| State | Icon Color | Text |
|-------|------------|------|
| ONLINE | Green | "Online" |
| OFFLINE | Red | "Offline" |
| SYNCING | Yellow (animated) | "Syncing..." |
| SYNC_ERROR | Orange | "Sync Error" |

### SyncStatusBar Display
```
┌────────────────────────────────────────┐
│ 🔄 Syncing... 45%  │  📋 3 pending     │
└────────────────────────────────────────┘
```

### SyncConflictModal Sections
1. Entity info (what entity has conflict)
2. Side-by-side comparison (local vs server)
3. Conflict resolution options
4. Apply button

### OfflineBanner Message
```
⚠️ You are currently offline. Transactions will be saved locally and synced when connection is restored.
```

### Offline Mode Restrictions
| Feature | Online | Offline |
|---------|--------|---------|
| Reports | ✅ | ❌ Disabled |
| Settings | ✅ | ❌ Read-only |
| New Users | ✅ | ❌ Disabled |
| Card Payments | ✅ | ⚠️ Queue only |

### SyncLogViewer Columns
- Timestamp
- Type (Push/Pull/Full)
- Status (Success/Failed)
- Entities synced
- Duration
- Error details (expandable)

### Offline Data Status Page
- Connection status indicator
- Last sync time per entity
- Cache size per entity
- Pending transactions count
- Failed transactions list
- Manual sync trigger
- Cache refresh options
