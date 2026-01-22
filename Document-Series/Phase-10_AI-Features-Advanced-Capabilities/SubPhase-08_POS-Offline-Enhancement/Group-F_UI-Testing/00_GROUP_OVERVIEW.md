# Group F: UI & Testing

> **Phase:** 10 - AI Features & Advanced Capabilities  
> **SubPhase:** 08 - POS Offline Enhancement  
> **Group:** F of F  
> **Tasks Covered:** 81-92  
> **Group Goal:** Create offline UI components and tests

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group-E_Conflict-Resolution](../Group-E_Conflict-Resolution/)
- **→ Next SubPhase:** [SubPhase-09_Real-time-Sync-Engine](../../SubPhase-09_Real-time-Sync-Engine/)

---

## Group Overview

This group creates UI and tests. Creates Offline Indicator status bar with Sync Status Icon syncing/synced states. Creates Pending Count badge and Sync Button for manual sync. Creates Sync Progress Modal and Conflict Modal for resolution. Creates Error Toast for sync errors. Creates Offline Banner as mode indicator. Creates Storage Stats for usage display and Prefetch Button for manual prefetch. Creates Integration Tests for E2E offline and Stress Test for large queue.

### Key Outcomes

- Offline Indicator
- Sync Status Icon
- Pending Count
- Sync Button
- Sync Progress Modal
- Conflict Modal
- Error Toast
- Offline Banner
- Storage Stats
- Prefetch Button
- Integration Tests
- Stress Test

### Technology Context

- **UI:** React + Shadcn/UI
- **Testing:** Jest + Playwright
- **Animation:** Framer Motion
- **Toast:** Sonner

---

## Documents in This Group

| # | Document | Description | Tasks Covered |
|---|----------|-------------|---------------|
| 01 | `01_Tasks-81-92_UI-Components-Tests.md` | Create UI components and tests | 81-92 |

---

## Task Summary

| Task # | Task Name | Complexity | Dependencies |
|--------|-----------|------------|--------------|
| 81 | Create Offline Indicator | Low | Task 80 |
| 82 | Create Sync Status Icon | Low | Task 81 |
| 83 | Create Pending Count | Low | Task 82 |
| 84 | Create Sync Button | Low | Task 83 |
| 85 | Create Sync Progress Modal | Medium | Task 84 |
| 86 | Create Conflict Modal | Medium | Task 85 |
| 87 | Create Error Toast | Low | Task 86 |
| 88 | Create Offline Banner | Low | Task 87 |
| 89 | Create Storage Stats | Low | Task 88 |
| 90 | Create Prefetch Button | Low | Task 89 |
| 91 | Create Integration Tests | High | Task 90 |
| 92 | Create Stress Test | Medium | Task 91 |

---

## Execution Order

```
Task 81: Offline Indicator
    │
    ▼
Task 82: Sync Status Icon
    │
    ▼
Task 83: Pending Count
    │
    ▼
Task 84: Sync Button
    │
    ▼
Task 85: Sync Progress Modal
    │
    ▼
Task 86: Conflict Modal
    │
    ▼
Task 87: Error Toast
    │
    ▼
Task 88: Offline Banner
    │
    ▼
Task 89: Storage Stats
    │
    ▼
Task 90: Prefetch Button
    │
    ▼
Task 91: Integration Tests
    │
    ▼
Task 92: Stress Test
```

---

## Expected Deliverables

```
frontend/
└── components/
    └── offline/
        ├── OfflineIndicator.tsx
        ├── SyncStatus.tsx
        ├── SyncProgressModal.tsx
        ├── ConflictModal.tsx
        ├── OfflineBanner.tsx
        └── StorageStats.tsx

tests/
└── offline/
    ├── offline.spec.ts
    └── stress.spec.ts
```

---

## Notes for AI Agents

### Offline Indicator (Task 81)
| Component | OfflineIndicator |
|-----------|------------------|
| Position | Status bar |

### Indicator States
| State | Icon | Color |
|-------|------|-------|
| Online | Wifi | green |
| Offline | WifiOff | red |
| Syncing | Loader | yellow |

### Sync Status Icon (Task 82)
| Component | SyncStatus |
|-----------|------------|
| Purpose | Show sync state |

### Sync Status States
| State | Icon | Animation |
|-------|------|-----------|
| synced | Check | None |
| syncing | Loader | Spin |
| pending | Clock | None |
| error | AlertTriangle | None |

### Pending Count (Task 83)
| Component | PendingCount |
|-----------|--------------|
| Show | When count > 0 |

### Badge Display
| Count | Display |
|-------|---------|
| 0 | Hidden |
| 1-99 | Number |
| 100+ | 99+ |

### Sync Button (Task 84)
| Component | SyncButton |
|-----------|------------|
| Action | Manual sync trigger |

### Button States
| State | Enabled | Text |
|-------|---------|------|
| Online + pending | Yes | Sync now |
| Online + syncing | No | Syncing... |
| Offline | No | Offline |

### Sync Progress Modal (Task 85)
| Component | SyncProgressModal |
|-----------|-------------------|
| Show | During sync |

### Progress Content
| Element | Description |
|---------|-------------|
| Progress bar | % complete |
| Current item | Type + ID |
| Count | X of Y |
| Cancel | Stop sync |

### Conflict Modal (Task 86)
| Component | ConflictModal |
|-----------|---------------|
| Show | On conflict |

### Conflict Modal Content
| Element | Description |
|---------|-------------|
| Title | Conflict detected |
| Details | Local vs server |
| Options | Keep/Use server/Merge |

### Error Toast (Task 87)
| Component | Toast |
|-----------|-------|
| Library | Sonner |
| Type | Error |

### Error Toast Content
| Field | Value |
|-------|-------|
| title | Sync failed |
| description | Error message |
| action | Retry |

### Offline Banner (Task 88)
| Component | OfflineBanner |
|-----------|---------------|
| Position | Top of screen |
| Show | When offline |

### Banner Content
| Element | Value |
|---------|-------|
| Icon | WifiOff |
| Text | You are offline |
| Style | Yellow background |

### Storage Stats (Task 89)
| Component | StorageStats |
|-----------|--------------|
| Show | In settings |

### Stats Display
| Metric | Display |
|--------|---------|
| Used | XX MB |
| Total | YY MB |
| Percent | Progress bar |
| Warning | When > 80% |

### Prefetch Button (Task 90)
| Component | PrefetchButton |
|-----------|----------------|
| Action | Manual prefetch |

### Integration Tests (Task 91)
| Framework | Playwright |
|-----------|------------|

### Test Cases
| Test | Description |
|------|-------------|
| test_offline_detection | Detect offline |
| test_offline_sale | Process sale offline |
| test_sync_queue | Queue and sync |
| test_conflict | Handle conflict |
| test_prefetch | Prefetch data |

### Stress Test (Task 92)
| Purpose | Large queue testing |
|---------|---------------------|

### Stress Scenarios
| Scenario | Size |
|----------|------|
| Large queue | 1000 items |
| Rapid add | 100/second |
| Concurrent | 10 parallel |
| Memory | Monitor usage |
