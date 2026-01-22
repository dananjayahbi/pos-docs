# Group C: Offline Manager

> **Phase:** 10 - AI Features & Advanced Capabilities  
> **SubPhase:** 08 - POS Offline Enhancement  
> **Group:** C of F  
> **Tasks Covered:** 33-50  
> **Group Goal:** Create offline manager for POS operations

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group-B_Service-Worker](../Group-B_Service-Worker/)
- **→ Next Group:** [Group-D_Sync-Queue](../Group-D_Sync-Queue/)

---

## Group Overview

This group creates the offline manager. Creates OfflineManager Class with Online Detection using navigator.onLine and events. Creates Offline Event and Online Event dispatchers. Creates Mode Toggle for forced offline testing. Creates Data Prefetch with Product Prefetch, Customer Prefetch, Inventory Prefetch, and Prefetch Progress. Creates Offline Sale processing with Temp Receipt ID format. Creates Local Stock Update, Offline Receipt printing, Cash Management, and Shift Offline handling. Creates Error Boundary. Verifies Offline Manager.

### Key Outcomes

- OfflineManager Class
- Online Detection
- Offline Event
- Online Event
- Mode Toggle
- Data Prefetch
- Product Prefetch
- Customer Prefetch
- Inventory Prefetch
- Prefetch Progress
- Offline Sale
- Temp Receipt ID
- Local Stock Update
- Offline Receipt
- Cash Management
- Shift Offline
- Error Boundary
- Manager verified

### Technology Context

- **Detection:** Navigator API
- **Events:** Custom events
- **Prefetch:** Batch loading
- **Temp ID:** UUID format

---

## Documents in This Group

| # | Document | Description | Tasks Covered |
|---|----------|-------------|---------------|
| 01 | `01_Tasks-33-42_Manager-Prefetch.md` | Create manager and prefetch | 33-42 |
| 02 | `02_Tasks-43-50_Sale-Receipt-Shift.md` | Create sale, receipt, shift | 43-50 |

---

## Task Summary

| Task # | Task Name | Complexity | Dependencies |
|--------|-----------|------------|--------------|
| 33 | Create OfflineManager Class | Medium | Task 32 |
| 34 | Create Online Detection | Low | Task 33 |
| 35 | Create Offline Event | Low | Task 34 |
| 36 | Create Online Event | Low | Task 34 |
| 37 | Create Mode Toggle | Low | Task 36 |
| 38 | Create Data Prefetch | High | Task 37 |
| 39 | Create Product Prefetch | Medium | Task 38 |
| 40 | Create Customer Prefetch | Medium | Task 38 |
| 41 | Create Inventory Prefetch | Medium | Task 38 |
| 42 | Create Prefetch Progress | Low | Task 41 |
| 43 | Create Offline Sale | High | Task 42 |
| 44 | Create Temp Receipt ID | Low | Task 43 |
| 45 | Create Local Stock Update | Medium | Task 44 |
| 46 | Create Offline Receipt | Medium | Task 45 |
| 47 | Create Cash Management | Medium | Task 46 |
| 48 | Create Shift Offline | Medium | Task 47 |
| 49 | Create Error Boundary | Low | Task 48 |
| 50 | Verify Offline Manager | Low | Task 49 |

---

## Execution Order

```
Task 33: OfflineManager Class
    │
    ▼
Task 34: Online Detection
    │
    ├────────┐
    ▼        ▼
T-35      T-36
(Off)    (On)
    │        │
    └────────┘
         │
         ▼
  Task 37: Mode Toggle
         │
         ▼
  Task 38: Data Prefetch
         │
    ┌────┼────┬────┐
    ▼    ▼    ▼    ▼
 T-39  T-40  T-41
(Prod)(Cust)(Inv)
    │    │    │
    └────┴────┘
         │
         ▼
  Task 42: Prefetch Progress
         │
         ▼
  Task 43: Offline Sale
         │
         ▼
  Task 44: Temp Receipt ID
         │
         ▼
  Task 45: Local Stock Update
         │
         ▼
  Task 46: Offline Receipt
         │
         ▼
  Task 47: Cash Management
         │
         ▼
  Task 48: Shift Offline
         │
         ▼
  Task 49: Error Boundary
         │
         ▼
  Task 50: Verify
```

---

## Expected Deliverables

```
frontend/
└── lib/
    └── offline/
        ├── manager.ts
        ├── prefetch.ts
        └── offline-sale.ts

└── hooks/
    └── useOffline.ts
```

---

## Notes for AI Agents

### OfflineManager Class (Task 33)
| Class | OfflineManager |
|-------|----------------|
| Pattern | Singleton |

### Online Detection (Task 34)
| Property | navigator.onLine |
|----------|------------------|
| Events | online, offline |

### Detection Methods
| Method | Source |
|--------|--------|
| Initial | navigator.onLine |
| Listen | window events |
| Ping | Optional health check |

### Offline Event (Task 35)
| Event | app:offline |
|-------|-------------|
| Dispatch | On network loss |

### Online Event (Task 36)
| Event | app:online |
|-------|------------|
| Dispatch | On network restore |
| Action | Trigger sync |

### Mode Toggle (Task 37)
| Method | setForceOffline(boolean) |
|--------|--------------------------|
| Use | Testing, demo |

### Data Prefetch (Task 38)
| Method | prefetchAll() |
|--------|---------------|
| Trigger | On app start, manual |

### Product Prefetch (Task 39)
| Data | Products |
|------|----------|
| Limit | 10,000 |
| Fields | id, sku, name, price, stock |

### Customer Prefetch (Task 40)
| Data | Customers |
|------|-----------|
| Limit | 5,000 |
| Fields | id, name, phone, loyalty |

### Inventory Prefetch (Task 41)
| Data | Inventory |
|------|-----------|
| Limit | 10,000 |
| Fields | product_id, stock, location |

### Prefetch Progress (Task 42)
| Event | prefetch:progress |
|-------|-------------------|
| Data | { loaded, total, percent } |

### Offline Sale (Task 43)
| Method | processOfflineSale(items) |
|--------|---------------------------|
| Store | IndexedDB sales table |
| Queue | Add to sync queue |

### Offline Sale Flow
| Step | Action |
|------|--------|
| 1 | Validate items |
| 2 | Generate temp ID |
| 3 | Calculate totals |
| 4 | Save to IndexedDB |
| 5 | Update local stock |
| 6 | Add to sync queue |
| 7 | Print receipt |

### Temp Receipt ID (Task 44)
| Format | OFF-{uuid} |
|--------|------------|
| Example | OFF-a1b2c3d4-... |

### Temp ID Fields
| Field | Value |
|-------|-------|
| Prefix | OFF- |
| UUID | uuid v4 |
| Replace | On sync with server ID |

### Local Stock Update (Task 45)
| Method | updateLocalStock(items) |
|--------|-------------------------|
| Action | Decrement quantities |

### Stock Update Flow
| Step | Action |
|------|--------|
| 1 | Get current stock |
| 2 | Subtract quantities |
| 3 | Update IndexedDB |
| 4 | Emit stock:updated |

### Offline Receipt (Task 46)
| Feature | Print offline receipt |
|---------|----------------------|
| Header | "OFFLINE SALE" |
| ID | Temp receipt ID |

### Receipt Indicators
| Element | Description |
|---------|-------------|
| Header | "OFFLINE SALE" |
| Footer | "Pending sync" |
| ID | OFF-xxxxxx |

### Cash Management (Task 47)
| Feature | Offline cash tracking |
|---------|----------------------|
| Store | In IndexedDB |

### Shift Offline (Task 48)
| Feature | Offline shifts |
|---------|----------------|
| Store | Local shift data |
| Sync | On reconnect |
