# Group A: Redis Pub/Sub Setup

> **Phase:** 10 - AI Features & Advanced Capabilities  
> **SubPhase:** 09 - Real-time Sync Engine  
> **Group:** A of F  
> **Tasks Covered:** 01-16  
> **Group Goal:** Set up Redis Pub/Sub for real-time messaging

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous SubPhase:** [SubPhase-08_POS-Offline-Enhancement](../../SubPhase-08_POS-Offline-Enhancement/)
- **→ Next Group:** [Group-B_ERP-Sync-Publisher](../Group-B_ERP-Sync-Publisher/)

---

## Group Overview

This group sets up Redis Pub/Sub. Creates Redis Config with connection settings. Creates Channel Naming for tenant-aware channels. Creates Inventory Channel, Price Channel, Order Channel, Product Channel, and Customer Channel. Creates Message Schema and Event Types. Creates Publisher Class and Subscriber Class. Creates Message Serializer and Message Validator. Creates Retry Handler and Dead Letter Queue. Verifies Redis setup.

### Key Outcomes

- Redis Config
- Channel Naming
- Inventory Channel
- Price Channel
- Order Channel
- Product Channel
- Customer Channel
- Message Schema
- Event Types
- Publisher Class
- Subscriber Class
- Message Serializer
- Message Validator
- Retry Handler
- Dead Letter Queue
- Redis verified

### Technology Context

- **Messaging:** Redis Pub/Sub
- **Channels:** Tenant-isolated
- **Events:** CREATED/UPDATED/DELETED
- **Format:** JSON serialization

---

## Documents in This Group

| # | Document | Description | Tasks Covered |
|---|----------|-------------|---------------|
| 01 | `01_Tasks-01-08_Redis-Channels.md` | Create Redis config and channels | 01-08 |
| 02 | `02_Tasks-09-16_Publisher-Subscriber.md` | Create pub/sub classes | 09-16 |

---

## Task Summary

| Task # | Task Name | Complexity | Dependencies |
|--------|-----------|------------|--------------|
| 01 | Create Redis Config | Low | None |
| 02 | Create Channel Naming | Low | Task 01 |
| 03 | Create Inventory Channel | Low | Task 02 |
| 04 | Create Price Channel | Low | Task 02 |
| 05 | Create Order Channel | Low | Task 02 |
| 06 | Create Product Channel | Low | Task 02 |
| 07 | Create Customer Channel | Low | Task 02 |
| 08 | Create Message Schema | Medium | Task 07 |
| 09 | Create Event Types | Low | Task 08 |
| 10 | Create Publisher Class | Medium | Task 09 |
| 11 | Create Subscriber Class | Medium | Task 10 |
| 12 | Create Message Serializer | Low | Task 11 |
| 13 | Create Message Validator | Low | Task 12 |
| 14 | Create Retry Handler | Medium | Task 13 |
| 15 | Create Dead Letter Queue | Low | Task 14 |
| 16 | Verify Redis Setup | Low | Task 15 |

---

## Execution Order

```
Task 01: Redis Config
    │
    ▼
Task 02: Channel Naming
    │
    ├───┬───┬───┬───┐
    ▼   ▼   ▼   ▼   ▼
  T-03 T-04 T-05 T-06 T-07
(Inv)(Price)(Order)(Prod)(Cust)
    │   │   │   │   │
    └───┴───┴───┴───┘
            │
            ▼
     Task 08: Message Schema
            │
            ▼
     Task 09: Event Types
            │
            ▼
     Task 10: Publisher Class
            │
            ▼
     Task 11: Subscriber Class
            │
            ▼
     Task 12: Message Serializer
            │
            ▼
     Task 13: Message Validator
            │
            ▼
     Task 14: Retry Handler
            │
            ▼
     Task 15: Dead Letter Queue
            │
            ▼
     Task 16: Verify
```

---

## Expected Deliverables

```
backend/
└── apps/
    └── sync/
        ├── config.py
        ├── channels.py
        ├── schemas.py
        ├── events.py
        ├── publisher/
        │   └── base.py
        └── consumer/
            └── base.py
```

---

## Notes for AI Agents

### Redis Config (Task 01)
| Setting | Value |
|---------|-------|
| Host | REDIS_HOST |
| Port | 6379 |
| DB | 1 (separate from cache) |
| Password | REDIS_PASSWORD |

### Channel Naming (Task 02)
| Pattern | {type}:{tenant_id} |
|---------|-------------------|
| Example | inventory:tenant_001 |

### Channel List
| Channel | Pattern |
|---------|---------|
| Inventory | inventory:{tenant_id} |
| Price | prices:{tenant_id} |
| Order | orders:{tenant_id} |
| Product | products:{tenant_id} |
| Customer | customers:{tenant_id} |

### Message Schema (Task 08)
| Field | Type | Description |
|-------|------|-------------|
| event_id | string | UUID |
| event_type | string | Event type |
| entity_type | string | product, order, etc |
| entity_id | string | Record ID |
| tenant_id | string | Tenant ID |
| data | object | Payload |
| timestamp | datetime | ISO format |
| version | number | Data version |

### Event Types (Task 09)
| Event | Use |
|-------|-----|
| CREATED | New entity |
| UPDATED | Modified |
| DELETED | Removed |

### Entity Event Types
| Entity | Events |
|--------|--------|
| INVENTORY | INVENTORY_UPDATED |
| PRICE | PRICE_UPDATED |
| PRODUCT | PRODUCT_CREATED, PRODUCT_UPDATED, PRODUCT_DELETED |
| ORDER | ORDER_CREATED, ORDER_UPDATED |
| CUSTOMER | CUSTOMER_CREATED, CUSTOMER_UPDATED |

### Publisher Class (Task 10)
| Class | BasePublisher |
|-------|---------------|
| Method | publish(channel, message) |

### Subscriber Class (Task 11)
| Class | BaseSubscriber |
|-------|----------------|
| Method | subscribe(channel, callback) |
| Method | unsubscribe(channel) |

### Message Serializer (Task 12)
| Method | serialize(message) |
|--------|-------------------|
| Return | JSON string |
| Method | deserialize(data) |
| Return | Message object |

### Message Validator (Task 13)
| Method | validate(message) |
|--------|-------------------|
| Check | Required fields |
| Check | Data types |
| Raise | ValidationError |

### Retry Handler (Task 14)
| Strategy | Exponential backoff |
|----------|---------------------|
| Max Retries | 3 |
| Initial Delay | 1s |

### Dead Letter Queue (Task 15)
| Channel | dlq:{tenant_id} |
|---------|-----------------|
| Store | Failed messages |
| TTL | 7 days |
