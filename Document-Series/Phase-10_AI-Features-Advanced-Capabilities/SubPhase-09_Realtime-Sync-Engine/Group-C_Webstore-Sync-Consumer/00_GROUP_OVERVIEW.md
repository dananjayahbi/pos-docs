# Group C: Webstore Sync Consumer

> **Phase:** 10 - AI Features & Advanced Capabilities  
> **SubPhase:** 09 - Real-time Sync Engine  
> **Group:** C of F  
> **Tasks Covered:** 33-50  
> **Group Goal:** Implement Webstore-side event consumption

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group-B_ERP-Sync-Publisher](../Group-B_ERP-Sync-Publisher/)
- **→ Next Group:** [Group-D_Bidirectional-Sync](../Group-D_Bidirectional-Sync/)

---

## Group Overview

This group implements Webstore consumers. Creates SyncConsumer Service with Redis Subscriber. Creates Inventory Handler with Stock Update Logic and Out of Stock Handler. Creates Price Handler with Price Update Logic. Creates Product Handler with Product Sync Logic. Creates Customer Handler with Customer Sync. Creates WebSocket Broadcast with WS Channel Group and Client Notification. Creates Consumer Logging, Error Handler, and Consumer Health. Verifies Consumer.

### Key Outcomes

- SyncConsumer Service
- Redis Subscriber
- Inventory Handler
- Stock Update Logic
- Out of Stock Handler
- Price Handler
- Price Update Logic
- Product Handler
- Product Sync Logic
- Customer Handler
- Customer Sync
- WebSocket Broadcast
- WS Channel Group
- Client Notification
- Consumer Logging
- Error Handler
- Consumer Health
- Consumer verified

### Technology Context

- **Direction:** ERP → Webstore
- **WebSocket:** Socket.io
- **Handler:** Async processing
- **Broadcast:** Push to clients

---

## Documents in This Group

| # | Document | Description | Tasks Covered |
|---|----------|-------------|---------------|
| 01 | `01_Tasks-33-43_Entity-Handlers.md` | Create entity handlers | 33-43 |
| 02 | `02_Tasks-44-50_WebSocket-Health.md` | Create WebSocket and health | 44-50 |

---

## Task Summary

| Task # | Task Name | Complexity | Dependencies |
|--------|-----------|------------|--------------|
| 33 | Create SyncConsumer Service | Medium | Task 32 |
| 34 | Create Redis Subscriber | Medium | Task 33 |
| 35 | Create Inventory Handler | Medium | Task 34 |
| 36 | Create Stock Update Logic | Medium | Task 35 |
| 37 | Create Out of Stock Handler | Low | Task 36 |
| 38 | Create Price Handler | Medium | Task 34 |
| 39 | Create Price Update Logic | Medium | Task 38 |
| 40 | Create Product Handler | Medium | Task 34 |
| 41 | Create Product Sync Logic | Medium | Task 40 |
| 42 | Create Customer Handler | Medium | Task 34 |
| 43 | Create Customer Sync | Medium | Task 42 |
| 44 | Create WebSocket Broadcast | Medium | Task 43 |
| 45 | Create WS Channel Group | Low | Task 44 |
| 46 | Create Client Notification | Low | Task 45 |
| 47 | Create Consumer Logging | Low | Task 46 |
| 48 | Create Error Handler | Medium | Task 47 |
| 49 | Create Consumer Health | Low | Task 48 |
| 50 | Verify Consumer | Low | Task 49 |

---

## Execution Order

```
Task 33: SyncConsumer Service
    │
    ▼
Task 34: Redis Subscriber
    │
    ├────────┬────────┬────────┐
    ▼        ▼        ▼        ▼
T-35      T-38      T-40      T-42
(Inv)    (Price)   (Prod)   (Cust)
    │        │        │        │
    ▼        ▼        ▼        ▼
T-36      T-39      T-41      T-43
(Update) (Update)  (Sync)   (Sync)
    │        │        │        │
    ▼        │        │        │
T-37      │        │        │
(OOS)      │        │        │
    │        │        │        │
    └────────┴────────┴────────┘
                  │
                  ▼
           Task 44: WebSocket Broadcast
                  │
                  ▼
           Task 45: WS Channel Group
                  │
                  ▼
           Task 46: Client Notification
                  │
                  ▼
           Task 47: Consumer Logging
                  │
                  ▼
           Task 48: Error Handler
                  │
                  ▼
           Task 49: Consumer Health
                  │
                  ▼
           Task 50: Verify
```

---

## Expected Deliverables

```
webstore/
└── lib/
    └── sync/
        ├── consumer.ts
        ├── subscriber.ts
        ├── handlers/
        │   ├── inventory.ts
        │   ├── price.ts
        │   ├── product.ts
        │   └── customer.ts
        └── websocket.ts
```

---

## Notes for AI Agents

### SyncConsumer Service (Task 33)
| Class | SyncConsumer |
|-------|--------------|
| Start | On app start |
| Method | start(), stop() |

### Redis Subscriber (Task 34)
| Method | subscribe(channels) |
|--------|---------------------|
| Callback | Handler per channel |

### Inventory Handler (Task 35)
| Handler | handleInventoryEvent(event) |
|---------|----------------------------|
| Events | INVENTORY_UPDATED |

### Stock Update Logic (Task 36)
| Action | Update webstore stock |
|--------|----------------------|
| Table | webstore_products |
| Field | stock_quantity |

### Stock Update Flow
| Step | Action |
|------|--------|
| 1 | Parse event |
| 2 | Find product by SKU |
| 3 | Update stock |
| 4 | Broadcast to clients |

### Out of Stock Handler (Task 37)
| Condition | stock <= 0 |
|-----------|------------|
| Action | Set unavailable |
| Notify | Customers viewing |

### Price Handler (Task 38)
| Handler | handlePriceEvent(event) |
|---------|------------------------|
| Events | PRICE_UPDATED |

### Price Update Logic (Task 39)
| Action | Update webstore price |
|--------|----------------------|
| Table | webstore_products |
| Field | price |

### Product Handler (Task 40)
| Handler | handleProductEvent(event) |
|---------|--------------------------|
| Events | PRODUCT_CREATED, UPDATED, DELETED |

### Product Sync Logic (Task 41)
| Action | Sync product to webstore |
|--------|-------------------------|
| Create | Insert new product |
| Update | Modify existing |
| Delete | Remove or archive |

### Customer Handler (Task 42)
| Handler | handleCustomerEvent(event) |
|---------|---------------------------|
| Events | CUSTOMER_CREATED, UPDATED |

### Customer Sync (Task 43)
| Action | Sync customer data |
|--------|-------------------|
| Use | Unified customer profile |

### WebSocket Broadcast (Task 44)
| Method | broadcast(room, event, data) |
|--------|------------------------------|
| Library | Socket.io |

### WS Channel Group (Task 45)
| Pattern | tenant:{tenant_id} |
|---------|-------------------|
| Join | On connect |

### Client Notification (Task 46)
| Event | sync:update |
|-------|-------------|
| Data | { type, entity, data } |

### Notification Types
| Type | Description |
|------|-------------|
| stock | Stock changed |
| price | Price changed |
| product | Product update |
| order | Order status |

### Consumer Logging (Task 47)
| Log | Event consumed |
|-----|----------------|
| Level | INFO |
| Fields | channel, event_type, latency |

### Error Handler (Task 48)
| Action | Catch and log errors |
|--------|---------------------|
| Retry | 3 attempts |
| DLQ | On failure |

### Consumer Health (Task 49)
| Endpoint | /health/sync |
|----------|--------------|
| Check | Redis connection |
| Check | Consumer running |
