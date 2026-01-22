# Group D: Bi-directional Sync

> **Phase:** 10 - AI Features & Advanced Capabilities  
> **SubPhase:** 09 - Real-time Sync Engine  
> **Group:** D of F  
> **Tasks Covered:** 51-66  
> **Group Goal:** Implement bi-directional sync between Webstore and ERP

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group-C_Webstore-Sync-Consumer](../Group-C_Webstore-Sync-Consumer/)
- **→ Next Group:** [Group-E_Sync-Monitoring](../Group-E_Sync-Monitoring/)

---

## Group Overview

This group implements bi-directional sync. Creates Order Sync (Webstore → ERP) with Order Publisher, Order Created Event, and Order Updated Event. Creates ERP Order Consumer with Order Import Logic. Creates Payment Sync with Payment Event. Creates Refund Sync. Creates Shipment Sync (ERP → Webstore) with Tracking Event and Delivery Event. Creates Conflict Handler with Version Vector and Resolution Strategy. Verifies bi-directional sync.

### Key Outcomes

- Order Sync
- Order Publisher
- Order Created Event
- Order Updated Event
- ERP Order Consumer
- Order Import Logic
- Payment Sync
- Payment Event
- Refund Sync
- Shipment Sync
- Tracking Event
- Delivery Event
- Conflict Handler
- Version Vector
- Resolution Strategy
- Bi-directional verified

### Technology Context

- **Order Flow:** Webstore → ERP
- **Shipment Flow:** ERP → Webstore
- **Conflict:** Version vectors
- **Resolution:** Server wins default

---

## Documents in This Group

| # | Document | Description | Tasks Covered |
|---|----------|-------------|---------------|
| 01 | `01_Tasks-51-62_Order-Shipment.md` | Create order and shipment sync | 51-62 |
| 02 | `02_Tasks-63-66_Conflict-Resolution.md` | Create conflict resolution | 63-66 |

---

## Task Summary

| Task # | Task Name | Complexity | Dependencies |
|--------|-----------|------------|--------------|
| 51 | Create Order Sync | High | Task 50 |
| 52 | Create Order Publisher | Medium | Task 51 |
| 53 | Create Order Created Event | Low | Task 52 |
| 54 | Create Order Updated Event | Low | Task 53 |
| 55 | Create ERP Order Consumer | Medium | Task 54 |
| 56 | Create Order Import Logic | High | Task 55 |
| 57 | Create Payment Sync | Medium | Task 56 |
| 58 | Create Payment Event | Low | Task 57 |
| 59 | Create Refund Sync | Medium | Task 58 |
| 60 | Create Shipment Sync | Medium | Task 59 |
| 61 | Create Tracking Event | Low | Task 60 |
| 62 | Create Delivery Event | Low | Task 61 |
| 63 | Create Conflict Handler | High | Task 62 |
| 64 | Create Version Vector | Medium | Task 63 |
| 65 | Create Resolution Strategy | Medium | Task 64 |
| 66 | Verify Bi-directional | Low | Task 65 |

---

## Execution Order

```
Task 51: Order Sync
    │
    ▼
Task 52: Order Publisher
    │
    ├────────┐
    ▼        ▼
T-53      T-54
(Created)(Updated)
    │        │
    └────────┘
         │
         ▼
  Task 55: ERP Order Consumer
         │
         ▼
  Task 56: Order Import Logic
         │
         ▼
  Task 57: Payment Sync
         │
         ▼
  Task 58: Payment Event
         │
         ▼
  Task 59: Refund Sync
         │
         ▼
  Task 60: Shipment Sync
         │
         ├────────┐
         ▼        ▼
       T-61     T-62
     (Track)  (Deliver)
         │        │
         └────────┘
              │
              ▼
       Task 63: Conflict Handler
              │
              ▼
       Task 64: Version Vector
              │
              ▼
       Task 65: Resolution Strategy
              │
              ▼
       Task 66: Verify
```

---

## Expected Deliverables

```
webstore/
└── lib/
    └── sync/
        └── publishers/
            └── order.ts

backend/
└── apps/
    └── sync/
        └── consumer/
            ├── order.py
            ├── payment.py
            └── conflict.py
```

---

## Notes for AI Agents

### Order Sync (Task 51)
| Direction | Webstore → ERP |
|-----------|----------------|
| Channel | orders:{tenant_id} |

### Order Flow
| Step | System | Action |
|------|--------|--------|
| 1 | Webstore | Customer places order |
| 2 | Webstore | Publish ORDER_CREATED |
| 3 | ERP | Consume event |
| 4 | ERP | Import order |
| 5 | ERP | Process fulfillment |

### Order Publisher (Task 52)
| Class | OrderPublisher |
|-------|----------------|
| Location | Webstore |
| Events | ORDER_CREATED, ORDER_UPDATED |

### Order Created Event (Task 53)
| Event | ORDER_CREATED |
|-------|---------------|
| Trigger | Order placed |

### Order Created Payload
| Field | Type | Description |
|-------|------|-------------|
| order_id | string | Order ID |
| order_number | string | Display number |
| customer_id | string | Customer |
| items | array | Line items |
| subtotal | decimal | Before tax |
| tax | decimal | Tax amount |
| total | decimal | Grand total |
| shipping_address | object | Address |
| payment_method | string | Method |
| status | string | pending |

### Order Updated Event (Task 54)
| Event | ORDER_UPDATED |
|-------|---------------|
| Trigger | Status change |

### ERP Order Consumer (Task 55)
| Handler | handleOrderEvent(event) |
|---------|------------------------|
| Location | ERP Backend |

### Order Import Logic (Task 56)
| Action | Create order in ERP |
|--------|---------------------|
| Map | Webstore → ERP fields |

### Import Steps
| Step | Action |
|------|--------|
| 1 | Validate order |
| 2 | Find/create customer |
| 3 | Create sales order |
| 4 | Reserve inventory |
| 5 | Trigger fulfillment |

### Payment Sync (Task 57)
| Direction | Webstore → ERP |
|-----------|----------------|
| Event | PAYMENT_RECEIVED |

### Payment Event (Task 58)
| Event | PAYMENT_RECEIVED |
|-------|------------------|

### Payment Payload
| Field | Type | Description |
|-------|------|-------------|
| order_id | string | Order |
| payment_id | string | Payment ID |
| amount | decimal | Amount |
| method | string | card, cod, etc |
| gateway | string | Stripe, etc |
| status | string | completed |

### Refund Sync (Task 59)
| Event | REFUND_PROCESSED |
|-------|------------------|
| Direction | ERP → Webstore |

### Shipment Sync (Task 60)
| Direction | ERP → Webstore |
|-----------|----------------|
| Channel | orders:{tenant_id} |

### Tracking Event (Task 61)
| Event | TRACKING_UPDATED |
|-------|------------------|

### Tracking Payload
| Field | Type | Description |
|-------|------|-------------|
| order_id | string | Order |
| carrier | string | DHL, etc |
| tracking_number | string | Number |
| tracking_url | string | URL |
| estimated_delivery | date | ETA |

### Delivery Event (Task 62)
| Event | ORDER_DELIVERED |
|-------|-----------------|

### Conflict Handler (Task 63)
| Class | ConflictHandler |
|-------|-----------------|
| Purpose | Detect and resolve |

### Version Vector (Task 64)
| Format | { entity_id: version } |
|--------|------------------------|
| Compare | Vector comparison |

### Resolution Strategy (Task 65)
| Default | Server wins |
|---------|-------------|
| Option | Last write wins |
| Option | Manual resolution |

### Resolution Rules
| Conflict | Resolution |
|----------|------------|
| Stock | ERP wins |
| Price | ERP wins |
| Order | Webstore wins |
| Customer | Merge |
