# Group B: ERP Sync Publisher

> **Phase:** 10 - AI Features & Advanced Capabilities  
> **SubPhase:** 09 - Real-time Sync Engine  
> **Group:** B of F  
> **Tasks Covered:** 17-32  
> **Group Goal:** Implement ERP-side event publishing

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group-A_Redis-PubSub-Setup](../Group-A_Redis-PubSub-Setup/)
- **→ Next Group:** [Group-C_Webstore-Sync-Consumer](../Group-C_Webstore-Sync-Consumer/)

---

## Group Overview

This group implements ERP publishers. Creates SyncPublisher Service. Creates Inventory Publisher with Stock Changed Signal and Stock Event Payload. Creates Price Publisher with Price Changed Signal and Price Event Payload. Creates Product Publisher with Product Signal and Product Payload. Creates Customer Publisher with Customer Signal. Creates Batch Publisher for bulk events. Creates Throttle Logic and Publisher Logging. Verifies ERP Publisher.

### Key Outcomes

- SyncPublisher Service
- Inventory Publisher
- Stock Changed Signal
- Stock Event Payload
- Price Publisher
- Price Changed Signal
- Price Event Payload
- Product Publisher
- Product Signal
- Product Payload
- Customer Publisher
- Customer Signal
- Batch Publisher
- Throttle Logic
- Publisher Logging
- Publisher verified

### Technology Context

- **Framework:** Django signals
- **Direction:** ERP → Webstore
- **Trigger:** Model save/delete
- **Throttle:** Rate limiting

---

## Documents in This Group

| # | Document | Description | Tasks Covered |
|---|----------|-------------|---------------|
| 01 | `01_Tasks-17-26_Entity-Publishers.md` | Create entity publishers | 17-26 |
| 02 | `02_Tasks-27-32_Batch-Throttle.md` | Create batch and throttle | 27-32 |

---

## Task Summary

| Task # | Task Name | Complexity | Dependencies |
|--------|-----------|------------|--------------|
| 17 | Create SyncPublisher Service | Medium | Task 16 |
| 18 | Create Inventory Publisher | Medium | Task 17 |
| 19 | Create Stock Changed Signal | Low | Task 18 |
| 20 | Create Stock Event Payload | Low | Task 19 |
| 21 | Create Price Publisher | Medium | Task 17 |
| 22 | Create Price Changed Signal | Low | Task 21 |
| 23 | Create Price Event Payload | Low | Task 22 |
| 24 | Create Product Publisher | Medium | Task 17 |
| 25 | Create Product Signal | Low | Task 24 |
| 26 | Create Product Payload | Low | Task 25 |
| 27 | Create Customer Publisher | Medium | Task 17 |
| 28 | Create Customer Signal | Low | Task 27 |
| 29 | Create Batch Publisher | Medium | Task 28 |
| 30 | Create Throttle Logic | Medium | Task 29 |
| 31 | Create Publisher Logging | Low | Task 30 |
| 32 | Verify ERP Publisher | Low | Task 31 |

---

## Execution Order

```
Task 17: SyncPublisher Service
    │
    ├────────┬────────┬────────┐
    ▼        ▼        ▼        ▼
T-18      T-21      T-24      T-27
(Inv)    (Price)   (Prod)   (Cust)
    │        │        │        │
    ▼        ▼        ▼        ▼
T-19      T-22      T-25      T-28
(Signal) (Signal) (Signal) (Signal)
    │        │        │        │
    ▼        ▼        ▼        │
T-20      T-23      T-26      │
(Payload)(Payload)(Payload)   │
    │        │        │        │
    └────────┴────────┴────────┘
                  │
                  ▼
           Task 29: Batch Publisher
                  │
                  ▼
           Task 30: Throttle Logic
                  │
                  ▼
           Task 31: Publisher Logging
                  │
                  ▼
           Task 32: Verify
```

---

## Expected Deliverables

```
backend/
└── apps/
    └── sync/
        ├── publisher/
        │   ├── __init__.py
        │   ├── service.py
        │   ├── inventory.py
        │   ├── price.py
        │   ├── product.py
        │   ├── customer.py
        │   └── batch.py
        └── signals.py
```

---

## Notes for AI Agents

### SyncPublisher Service (Task 17)
| Class | SyncPublisher |
|-------|---------------|
| Pattern | Singleton |
| Method | publish(channel, event) |

### Inventory Publisher (Task 18)
| Class | InventoryPublisher |
|-------|-------------------|
| Channel | inventory:{tenant_id} |
| Trigger | Stock change |

### Stock Changed Signal (Task 19)
| Signal | inventory_changed |
|--------|-------------------|
| Sender | InventoryMovement |
| Args | product_id, old_qty, new_qty |

### Stock Event Payload (Task 20)
| Field | Type | Description |
|-------|------|-------------|
| product_id | string | Product ID |
| sku | string | SKU |
| old_quantity | number | Before |
| new_quantity | number | After |
| location_id | string | Warehouse |
| reason | string | sale, adjustment, etc |

### Price Publisher (Task 21)
| Class | PricePublisher |
|-------|----------------|
| Channel | prices:{tenant_id} |
| Trigger | Price update |

### Price Changed Signal (Task 22)
| Signal | price_changed |
|--------|---------------|
| Sender | Product |
| Args | product_id, old_price, new_price |

### Price Event Payload (Task 23)
| Field | Type | Description |
|-------|------|-------------|
| product_id | string | Product ID |
| sku | string | SKU |
| old_price | decimal | Before |
| new_price | decimal | After |
| currency | string | LKR |
| effective_from | datetime | Start date |

### Product Publisher (Task 24)
| Class | ProductPublisher |
|-------|------------------|
| Channel | products:{tenant_id} |
| Events | CREATED, UPDATED, DELETED |

### Product Signal (Task 25)
| Signal | product_changed |
|--------|-----------------|
| Sender | Product |
| Events | post_save, post_delete |

### Product Payload (Task 26)
| Field | Type | Description |
|-------|------|-------------|
| product_id | string | Product ID |
| sku | string | SKU |
| name | string | Name |
| name_si | string | Sinhala name |
| price | decimal | Price |
| category_id | string | Category |
| is_active | boolean | Status |
| images | array | Image URLs |

### Customer Publisher (Task 27)
| Class | CustomerPublisher |
|-------|-------------------|
| Channel | customers:{tenant_id} |

### Customer Signal (Task 28)
| Signal | customer_changed |
|--------|------------------|
| Sender | Customer |
| Events | post_save |

### Batch Publisher (Task 29)
| Method | publish_batch(events) |
|--------|----------------------|
| Limit | 100 events per batch |
| Use | Bulk sync |

### Throttle Logic (Task 30)
| Rate | 100 events/second |
|------|-------------------|
| Strategy | Token bucket |
| Overflow | Queue |

### Publisher Logging (Task 31)
| Log | Event published |
|-----|-----------------|
| Level | INFO |
| Fields | channel, event_type, entity_id |
