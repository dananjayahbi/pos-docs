# Group B: Index Management

> **Phase:** 10 - AI Features & Advanced Capabilities  
> **SubPhase:** 04 - Smart Search Backend  
> **Group:** B of F  
> **Tasks Covered:** 17-34  
> **Group Goal:** Implement product indexing and synchronization

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group-A_Search-Engine-Setup](../Group-A_Search-Engine-Setup/)
- **→ Next Group:** [Group-C_Search-Features](../Group-C_Search-Features/)

---

## Group Overview

This group manages indexing. Creates ProductIndexer with to_document to convert product to document, index_product for single product, bulk_index for batch, delete_product to remove, and update_product to update. Creates IndexSettings with searchable_attributes, filterable_attributes, and sortable_attributes. Creates IndexSyncTask for full sync, Incremental Sync for delta updates, and Sync Schedule for hourly sync. Creates Product Signals with on_product_save and on_product_delete. Creates Index Admin. Verifies indexing.

### Key Outcomes

- ProductIndexer
- to_document method
- index_product method
- bulk_index method
- delete_product method
- update_product method
- IndexSettings
- searchable_attributes
- filterable_attributes
- sortable_attributes
- IndexSyncTask
- Incremental Sync
- Sync Schedule
- Product Signals
- on_product_save
- on_product_delete
- Index Admin
- Indexing verified

### Technology Context

- **Indexing:** MeiliSearch documents
- **Sync:** Celery tasks
- **Signals:** Django post_save/delete
- **Schedule:** Hourly full sync

---

## Documents in This Group

| # | Document | Description | Tasks Covered |
|---|----------|-------------|---------------|
| 01 | `01_Tasks-17-26_Indexer-Settings.md` | Create indexer and settings | 17-26 |
| 02 | `02_Tasks-27-34_Sync-Signals-Admin.md` | Create sync, signals, admin | 27-34 |

---

## Task Summary

| Task # | Task Name | Complexity | Dependencies |
|--------|-----------|------------|--------------|
| 17 | Create ProductIndexer | High | Task 16 |
| 18 | Create to_document Method | Medium | Task 17 |
| 19 | Create index_product Method | Low | Task 18 |
| 20 | Create bulk_index Method | Medium | Task 19 |
| 21 | Create delete_product Method | Low | Task 20 |
| 22 | Create update_product Method | Low | Task 21 |
| 23 | Create IndexSettings | Medium | Task 22 |
| 24 | Create searchable_attributes | Low | Task 23 |
| 25 | Create filterable_attributes | Low | Task 23 |
| 26 | Create sortable_attributes | Low | Task 23 |
| 27 | Create IndexSyncTask | Medium | Task 26 |
| 28 | Create Incremental Sync | Medium | Task 27 |
| 29 | Create Sync Schedule | Low | Task 28 |
| 30 | Create Product Signals | Medium | Task 22 |
| 31 | Create on_product_save | Low | Task 30 |
| 32 | Create on_product_delete | Low | Task 30 |
| 33 | Create Index Admin | Medium | Task 10 |
| 34 | Verify Indexing | Low | Task 33 |

---

## Execution Order

```
Task 17: ProductIndexer
    │
    ▼
Task 18: to_document
    │
    ▼
Task 19: index_product
    │
    ▼
Task 20: bulk_index
    │
    ▼
Task 21: delete_product
    │
    ▼
Task 22: update_product
    │
    ├─────────────────────────┐
    ▼                         ▼
Task 23: IndexSettings    Task 30: Signals
    │                         │
    ├────────┬────────┐  ┌────┴────┐
    ▼        ▼        ▼  ▼         ▼
T-24      T-25      T-26 T-31     T-32
(Search)(Filter)  (Sort)(Save)  (Delete)
    │        │        │  │         │
    └────────┴────────┘  └────┬────┘
              │               │
              ▼               │
       Task 27: IndexSyncTask │
              │               │
              ▼               │
       Task 28: Incremental   │
              │               │
              ▼               │
       Task 29: Schedule      │
              │               │
       ┌──────┴───────────────┘
       │               │
       │        Task 33: Admin
       │               │
       └───────────────┘
                │
                ▼
         Task 34: Verify
```

---

## Expected Deliverables

```
backend/
└── apps/
    └── search/
        └── indexing/
            ├── __init__.py
            ├── product_indexer.py
            ├── settings.py
            └── signals.py
        └── tasks/
            └── sync_tasks.py
```

---

## Notes for AI Agents

### ProductIndexer (Task 17)
| Class | ProductIndexer |
|-------|----------------|
| Purpose | Index products |
| Index | products |

### to_document Method (Task 18)
| Method | to_document(product) |
|--------|----------------------|
| Return | Dict document |
| Fields | id, name, sku, description, price, category, brand |

### Document Format
| Field | Source |
|-------|--------|
| id | product.id |
| name | product.name |
| sku | product.sku |
| description | product.description |
| price | float(product.price) |
| category_id | product.category_id |
| category_name | product.category.name |
| brand | product.brand |
| stock | product.stock_quantity |
| sales_count | product.sales_count |
| is_active | product.is_active |

### index_product Method (Task 19)
| Method | index_product(product) |
|--------|------------------------|
| Action | Add single document |

### bulk_index Method (Task 20)
| Method | bulk_index(products, batch_size=1000) |
|--------|--------------------------------------|
| Action | Batch add documents |
| Use | Initial/full sync |

### delete_product Method (Task 21)
| Method | delete_product(product_id) |
|--------|----------------------------|
| Action | Remove document |

### update_product Method (Task 22)
| Method | update_product(product) |
|--------|-------------------------|
| Action | Update document |

### IndexSettings (Task 23)
| Class | IndexSettings |
|-------|---------------|
| Purpose | Configure index |

### searchable_attributes (Task 24)
| Attributes | Order |
|------------|-------|
| name | 1 (highest) |
| sku | 2 |
| description | 3 |
| category_name | 4 |
| brand | 5 |

### filterable_attributes (Task 25)
| Attributes | Use |
|------------|-----|
| category_id | Category filter |
| brand | Brand filter |
| price | Price range |
| is_active | Active only |
| stock | In-stock filter |

### sortable_attributes (Task 26)
| Attributes | Use |
|------------|-----|
| price | Sort by price |
| created_at | Sort by new |
| sales_count | Sort by popularity |

### IndexSyncTask (Task 27)
| Task | full_sync_task |
|------|----------------|
| Type | Celery task |
| Action | Full reindex |

### Incremental Sync (Task 28)
| Method | incremental_sync(since) |
|--------|------------------------|
| Action | Index changed products |
| Track | updated_at field |

### Sync Schedule (Task 29)
| Schedule | Hourly |
|----------|--------|
| Full sync | Daily at 3:00 AM |
| Delta sync | Every hour |

### Product Signals (Task 30)
| Signal | Trigger |
|--------|---------|
| post_save | Product saved |
| post_delete | Product deleted |

### on_product_save (Task 31)
| Signal | post_save |
|--------|----------|
| Action | index_product or update_product |
| Async | Via Celery |

### on_product_delete (Task 32)
| Signal | post_delete |
|--------|-------------|
| Action | delete_product |
| Async | Via Celery |
