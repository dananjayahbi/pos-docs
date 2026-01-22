# Group E: Conflict Resolution

> **Phase:** 10 - AI Features & Advanced Capabilities  
> **SubPhase:** 08 - POS Offline Enhancement  
> **Group:** E of F  
> **Tasks Covered:** 69-80  
> **Group Goal:** Implement conflict detection and resolution

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group-D_Sync-Queue](../Group-D_Sync-Queue/)
- **→ Next Group:** [Group-F_UI-Testing](../Group-F_UI-Testing/)

---

## Group Overview

This group implements conflict resolution. Creates Conflict Detector with Version Tracking and Timestamp Compare for last modified. Creates Conflict Types enum including Stock Conflict for inventory mismatch and Price Conflict for changed prices. Creates Auto Resolution with merge rules. Creates Server Wins and Client Wins strategies. Creates Manual Resolution for user decisions. Creates Conflict Log. Verifies conflicts.

### Key Outcomes

- Conflict Detector
- Version Tracking
- Timestamp Compare
- Conflict Types
- Stock Conflict
- Price Conflict
- Auto Resolution
- Server Wins
- Client Wins
- Manual Resolution
- Conflict Log
- Conflicts verified

### Technology Context

- **Version:** Incrementing number
- **Timestamp:** ISO datetime
- **Default:** Server wins
- **Manual:** User decision UI

---

## Documents in This Group

| # | Document | Description | Tasks Covered |
|---|----------|-------------|---------------|
| 01 | `01_Tasks-69-80_Detection-Resolution.md` | Create detection and resolution | 69-80 |

---

## Task Summary

| Task # | Task Name | Complexity | Dependencies |
|--------|-----------|------------|--------------|
| 69 | Create Conflict Detector | Medium | Task 68 |
| 70 | Create Version Tracking | Low | Task 69 |
| 71 | Create Timestamp Compare | Low | Task 70 |
| 72 | Create Conflict Types | Low | Task 71 |
| 73 | Create Stock Conflict | Medium | Task 72 |
| 74 | Create Price Conflict | Low | Task 72 |
| 75 | Create Auto Resolution | Medium | Task 74 |
| 76 | Create Server Wins | Low | Task 75 |
| 77 | Create Client Wins | Low | Task 75 |
| 78 | Create Manual Resolution | Medium | Task 77 |
| 79 | Create Conflict Log | Low | Task 78 |
| 80 | Verify Conflicts | Low | Task 79 |

---

## Execution Order

```
Task 69: Conflict Detector
    │
    ▼
Task 70: Version Tracking
    │
    ▼
Task 71: Timestamp Compare
    │
    ▼
Task 72: Conflict Types
    │
    ├────────┐
    ▼        ▼
T-73      T-74
(Stock) (Price)
    │        │
    └────────┘
         │
         ▼
  Task 75: Auto Resolution
         │
    ┌────┴────┐
    ▼         ▼
 T-76       T-77
(Server)  (Client)
    │         │
    └────┬────┘
         │
         ▼
  Task 78: Manual Resolution
         │
         ▼
  Task 79: Conflict Log
         │
         ▼
  Task 80: Verify
```

---

## Expected Deliverables

```
frontend/
└── lib/
    └── offline/
        └── conflict-resolver.ts

└── components/
    └── offline/
        └── ConflictModal.tsx
```

---

## Notes for AI Agents

### Conflict Detector (Task 69)
| Class | ConflictDetector |
|-------|------------------|
| Purpose | Detect sync conflicts |

### Detection Method
| Method | detectConflict(local, remote) |
|--------|-------------------------------|
| Return | Conflict or null |

### Version Tracking (Task 70)
| Field | version |
|-------|---------|
| Type | number |
| Increment | On each update |

### Version Comparison
| Condition | Result |
|-----------|--------|
| local.version < remote.version | Server updated |
| local.version > remote.version | Client updated |
| local.version = remote.version | No conflict |

### Timestamp Compare (Task 71)
| Field | updated_at |
|-------|------------|
| Format | ISO 8601 |
| Compare | Date comparison |

### Conflict Types (Task 72)
| Enum | ConflictType |
|------|--------------|

### Conflict Type Values
| Type | Description |
|------|-------------|
| STOCK | Inventory mismatch |
| PRICE | Price changed |
| DELETED | Record deleted |
| MODIFIED | General update |

### Stock Conflict (Task 73)
| Type | STOCK |
|------|-------|
| Cause | Inventory changed |

### Stock Conflict Example
| State | Value |
|-------|-------|
| Local stock | 10 |
| Sold offline | 3 |
| Expected | 7 |
| Server stock | 5 |
| Conflict | True |

### Price Conflict (Task 74)
| Type | PRICE |
|------|-------|
| Cause | Price changed online |

### Price Conflict Example
| State | Value |
|-------|-------|
| Local price | Rs. 100 |
| Sale price | Rs. 100 |
| Server price | Rs. 120 |
| Impact | Sold at old price |

### Auto Resolution (Task 75)
| Class | AutoResolver |
|-------|--------------|
| Purpose | Automatic merge |

### Auto Resolution Rules
| Conflict | Resolution |
|----------|------------|
| STOCK | Server wins |
| PRICE | Log and accept sale |
| DELETED | Mark local deleted |

### Server Wins (Task 76)
| Strategy | SERVER_WINS |
|----------|-------------|
| Action | Use server value |

### Server Wins Example
| Field | Use |
|-------|-----|
| stock | server.stock |
| price | server.price |
| updated_at | server.updated_at |

### Client Wins (Task 77)
| Strategy | CLIENT_WINS |
|----------|-------------|
| Action | Use client value |
| Use | Manual override |

### Manual Resolution (Task 78)
| UI | ConflictModal |
|-----|---------------|
| Show | When manual needed |

### Manual Resolution Options
| Option | Action |
|--------|--------|
| Keep local | Use client value |
| Use server | Use server value |
| Merge | Custom merge |

### Conflict Log (Task 79)
| Purpose | Record conflicts |
|---------|------------------|
| Store | IndexedDB |

### Conflict Log Fields
| Field | Description |
|-------|-------------|
| id | Auto ID |
| type | ConflictType |
| entity_type | product, sale, etc |
| entity_id | Record ID |
| local_data | Client value |
| remote_data | Server value |
| resolution | How resolved |
| resolved_at | When resolved |
| resolved_by | auto/manual |
