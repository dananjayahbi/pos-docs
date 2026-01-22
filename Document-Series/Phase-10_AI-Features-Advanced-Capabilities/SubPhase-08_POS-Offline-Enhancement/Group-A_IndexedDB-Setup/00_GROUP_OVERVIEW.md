# Group A: IndexedDB Setup

> **Phase:** 10 - AI Features & Advanced Capabilities  
> **SubPhase:** 08 - POS Offline Enhancement  
> **Group:** A of F  
> **Tasks Covered:** 01-16  
> **Group Goal:** Set up IndexedDB for local offline storage

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous SubPhase:** [SubPhase-07_AI-Chatbot-Frontend](../../SubPhase-07_AI-Chatbot-Frontend/)
- **→ Next Group:** [Group-B_Service-Worker](../Group-B_Service-Worker/)

---

## Group Overview

This group sets up IndexedDB. Installs Dexie.js as IndexedDB wrapper. Creates Database Schema with tables for Products, Customers, Sales, SaleItems, Inventory, Settings, and SyncQueue. Creates Indexes for query optimization. Creates Migration System for schema versioning. Creates Seed Data for initial load. Creates Data Compression using LZ-String. Creates Storage Quota checker and Data Cleanup for old records. Verifies IndexedDB.

### Key Outcomes

- Install Dexie.js
- Database Schema
- Products Table
- Customers Table
- Sales Table
- SaleItems Table
- Inventory Table
- Settings Table
- SyncQueue Table
- Indexes
- Migration System
- Seed Data
- Data Compression
- Storage Quota
- Data Cleanup
- IndexedDB verified

### Technology Context

- **Library:** Dexie.js
- **Compression:** LZ-String
- **Quota:** Navigator Storage API
- **Max:** ~200 MB total

---

## Documents in This Group

| # | Document | Description | Tasks Covered |
|---|----------|-------------|---------------|
| 01 | `01_Tasks-01-09_Dexie-Tables.md` | Create Dexie and tables | 01-09 |
| 02 | `02_Tasks-10-16_Indexes-Compression.md` | Create indexes, compression | 10-16 |

---

## Task Summary

| Task # | Task Name | Complexity | Dependencies |
|--------|-----------|------------|--------------|
| 01 | Install Dexie.js | Low | None |
| 02 | Create Database Schema | Medium | Task 01 |
| 03 | Create Products Table | Low | Task 02 |
| 04 | Create Customers Table | Low | Task 02 |
| 05 | Create Sales Table | Medium | Task 02 |
| 06 | Create SaleItems Table | Low | Task 05 |
| 07 | Create Inventory Table | Low | Task 02 |
| 08 | Create Settings Table | Low | Task 02 |
| 09 | Create SyncQueue Table | Medium | Task 02 |
| 10 | Create Indexes | Low | Task 09 |
| 11 | Create Migration System | Medium | Task 10 |
| 12 | Create Seed Data | Low | Task 11 |
| 13 | Create Data Compression | Medium | Task 12 |
| 14 | Create Storage Quota | Low | Task 13 |
| 15 | Create Data Cleanup | Low | Task 14 |
| 16 | Verify IndexedDB | Low | Task 15 |

---

## Execution Order

```
Task 01: Install Dexie.js
    │
    ▼
Task 02: Database Schema
    │
    ├────────┬────────┬────────┬────────┬────────┬────────┐
    ▼        ▼        ▼        ▼        ▼        ▼        ▼
T-03     T-04     T-05     T-07     T-08     T-09
(Prod)  (Cust)  (Sales) (Inv)  (Set)  (Queue)
    │        │        │        │        │        │
    │        │        ▼        │        │        │
    │        │     T-06       │        │        │
    │        │   (Items)      │        │        │
    │        │        │        │        │        │
    └────────┴────────┴────────┴────────┴────────┘
                          │
                          ▼
                   Task 10: Indexes
                          │
                          ▼
                   Task 11: Migration System
                          │
                          ▼
                   Task 12: Seed Data
                          │
                          ▼
                   Task 13: Data Compression
                          │
                          ▼
                   Task 14: Storage Quota
                          │
                          ▼
                   Task 15: Data Cleanup
                          │
                          ▼
                   Task 16: Verify
```

---

## Expected Deliverables

```
frontend/
└── lib/
    └── offline/
        ├── database.ts
        ├── schema.ts
        ├── tables/
        │   ├── products.ts
        │   ├── customers.ts
        │   ├── sales.ts
        │   ├── inventory.ts
        │   └── sync-queue.ts
        └── compression.ts
```

---

## Notes for AI Agents

### Install Dexie.js (Task 01)
| Package | dexie |
|---------|-------|
| Version | ^4.x |
| Command | npm install dexie |

### Database Schema (Task 02)
| Class | POSDatabase |
|-------|-------------|
| Extends | Dexie |

### Database Version
| Version | 1 |
|---------|---|
| Name | pos-offline-db |

### Products Table (Task 03)
| Table | products |
|-------|----------|
| Key | id |

### Products Fields
| Field | Type | Index |
|-------|------|-------|
| id | string | Primary |
| sku | string | Yes |
| barcode | string | Yes |
| name | string | Yes |
| price | number | No |
| category_id | string | Yes |
| stock | number | No |
| updated_at | Date | No |

### Customers Table (Task 04)
| Table | customers |
|-------|-----------|
| Key | id |

### Customers Fields
| Field | Type | Index |
|-------|------|-------|
| id | string | Primary |
| phone | string | Yes |
| email | string | Yes |
| name | string | Yes |
| loyalty_points | number | No |

### Sales Table (Task 05)
| Table | sales |
|-------|-------|
| Key | id |

### Sales Fields
| Field | Type | Index |
|-------|------|-------|
| id | string | Primary |
| temp_id | string | Yes |
| customer_id | string | Yes |
| total | number | No |
| status | string | Yes |
| synced | boolean | Yes |
| created_at | Date | Yes |

### SaleItems Table (Task 06)
| Table | sale_items |
|-------|------------|
| Key | id |

### SaleItems Fields
| Field | Type | Index |
|-------|------|-------|
| id | string | Primary |
| sale_id | string | Yes |
| product_id | string | Yes |
| quantity | number | No |
| price | number | No |

### Inventory Table (Task 07)
| Table | inventory |
|-------|-----------|
| Key | product_id |

### Settings Table (Task 08)
| Table | settings |
|-------|----------|
| Key | key |

### SyncQueue Table (Task 09)
| Table | sync_queue |
|-------|------------|
| Key | ++id (auto) |

### SyncQueue Fields
| Field | Type | Description |
|-------|------|-------------|
| id | number | Auto-increment |
| type | string | sale, inventory, etc |
| data | object | Payload |
| priority | number | 1=high, 3=low |
| retries | number | Attempt count |
| status | string | pending/syncing/failed |
| created_at | Date | Queue time |

### Indexes (Task 10)
| Purpose | Query optimization |
|---------|-------------------|

### Index Definitions
| Table | Indexes |
|-------|---------|
| products | sku, barcode, category_id |
| sales | temp_id, synced, created_at |
| sync_queue | status, priority |

### Data Compression (Task 13)
| Library | lz-string |
|---------|-----------|
| Use | Large text fields |

### Compression Methods
| Method | Use |
|--------|-----|
| compress | Before store |
| decompress | After retrieve |

### Storage Quota (Task 14)
| API | navigator.storage.estimate() |
|-----|------------------------------|

### Quota Response
| Field | Description |
|-------|-------------|
| quota | Total available |
| usage | Currently used |
| percentage | usage/quota * 100 |

### Data Cleanup (Task 15)
| Action | Purge old data |
|--------|----------------|
| Sales | Keep 30 days |
| Synced | Remove after 7 days |
