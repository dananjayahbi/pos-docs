# Group D: Tracking & Webhooks

> **Phase:** 09 - Integrations & Sri Lanka Localizations  
> **SubPhase:** 08 - Koombiyo Courier API  
> **Group:** D of F  
> **Tasks Covered:** 51-66  
> **Group Goal:** Implement shipment tracking and webhook event handling

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group-C_Waybill-Generation](../Group-C_Waybill-Generation/)
- **→ Next Group:** [Group-E_Pickup-COD](../Group-E_Pickup-COD/)

---

## Group Overview

This group implements tracking and webhooks. Creates TrackingEvent model with waybill foreign key, event status, timestamp, and location fields. Creates track_shipment API call to get tracking from Koombiyo. Creates tracking response parser and save events logic. Creates webhook view at /api/webhooks/koombiyo/ with signature verification. Creates webhook parser and handlers for picked up, in transit, delivered, and failed events. Updates order status on delivery events.

### Key Outcomes

- TrackingEvent model
- Event waybill FK
- Event status field
- Event timestamp
- Event location
- track_shipment API
- Tracking response parser
- Save events logic
- Webhook view
- Webhook URL
- Signature verification
- Webhook parser
- Picked up event handler
- In transit event handler
- Delivered event handler
- Failed event handler

### Technology Context

- **Tracking:** Real-time updates
- **Webhook:** Push notifications
- **Signature:** HMAC verification
- **Events:** Status transitions

---

## Documents in This Group

| # | Document | Description | Tasks Covered |
|---|----------|-------------|---------------|
| 01 | `01_Tasks-51-58_Tracking-Model-API.md` | Create tracking model and API | 51-58 |
| 02 | `02_Tasks-59-66_Webhook-Events.md` | Create webhook and event handlers | 59-66 |

---

## Task Summary

| Task # | Task Name | Complexity | Dependencies |
|--------|-----------|------------|--------------|
| 51 | Create TrackingEvent Model | Medium | Task 50 |
| 52 | Create Event Waybill FK | Low | Task 51 |
| 53 | Create Event Status | Low | Task 51 |
| 54 | Create Event Timestamp | Low | Task 51 |
| 55 | Create Event Location | Low | Task 51 |
| 56 | Create track_shipment API | Medium | Task 51 |
| 57 | Create Tracking Response | Medium | Task 56 |
| 58 | Create Save Events | Medium | Task 57 |
| 59 | Create Webhook View | High | Task 50 |
| 60 | Create Webhook URL | Low | Task 59 |
| 61 | Create Signature Verify | Medium | Task 59 |
| 62 | Create Webhook Parser | Medium | Task 59 |
| 63 | Create Picked Up Event | Medium | Task 62 |
| 64 | Create In Transit Event | Low | Task 62 |
| 65 | Create Delivered Event | Medium | Task 62 |
| 66 | Create Failed Event | Medium | Task 62 |

---

## Execution Order

```
Task 51: TrackingEvent Model
    │
    ├────────┬────────┬────────┬────────┐
    ▼        ▼        ▼        ▼        ▼
T-52     T-53     T-54     T-55     T-56
(FK)  (Status)(Time) (Loc)   (API)
    │        │        │        │        │
    │        │        │        │        ▼
    │        │        │        │      T-57
    │        │        │        │    (Response)
    │        │        │        │        │
    │        │        │        │        ▼
    │        │        │        │      T-58
    │        │        │        │     (Save)
    │        │        │        │        │
    └────────┴────────┴────────┴────────┘
                    │
                    ▼
           Task 59: Webhook View
                    │
              ┌─────┼─────┬────────┐
              ▼     ▼     ▼        ▼
           T-60   T-61   T-62
          (URL) (Sign)(Parse)
              │     │     │
              │     │     ├────────┬────────┬────────┐
              │     │     ▼        ▼        ▼        ▼
              │     │   T-63     T-64     T-65     T-66
              │     │ (Picked)(Transit)(Deliver)(Fail)
              │     │     │        │        │        │
              └─────┴─────┴────────┴────────┴────────┘
```

---

## Expected Deliverables

```
backend/
└── apps/
    └── shipping/
        ├── models/
        │   └── tracking_event.py
        ├── providers/
        │   └── koombiyo/
        │       └── webhooks.py
        └── services/
            └── tracking_service.py
```

---

## Notes for AI Agents

### TrackingEvent Model (Task 51)
| Field | Type |
|-------|------|
| waybill | ForeignKey |
| status | CharField |
| timestamp | DateTimeField |
| location | CharField |

### Event Waybill FK (Task 52)
| Field | Type |
|-------|------|
| Name | waybill |
| Related | Waybill model |
| On delete | CASCADE |

### Event Status (Task 53)
| Field | Type |
|-------|------|
| Name | status |
| Description | Koombiyo status |

### Event Timestamp (Task 54)
| Field | Type |
|-------|------|
| Name | timestamp |
| Source | Koombiyo event time |

### Event Location (Task 55)
| Field | Type |
|-------|------|
| Name | location |
| Example | "Colombo Hub", "Kandy Branch" |

### track_shipment API (Task 56)
| Endpoint | GET /waybill/track/{waybill_number} |
|----------|--------------------------------------|
| Return | List of tracking events |

### Tracking Response (Task 57)
| Parse | Array of events |
|-------|-----------------|
| Fields | status, timestamp, location |

### Save Events (Task 58)
| Action | Store new events |
|--------|------------------|
| Check | Avoid duplicates |
| Order | By timestamp |

### Webhook View (Task 59)
| Class | KoombiyoWebhookView |
|-------|---------------------|
| Method | POST |
| Auth | Signature verification |

### Webhook URL (Task 60)
| URL | /api/webhooks/koombiyo/ |
|-----|-------------------------|
| Public | No auth required |

### Signature Verify (Task 61)
| Algorithm | HMAC-SHA256 |
|-----------|-------------|
| Secret | Webhook secret |
| Header | X-Koombiyo-Signature |

### Webhook Parser (Task 62)
| Parse | Event type and data |
|-------|---------------------|
| Route | To appropriate handler |

### Picked Up Event (Task 63)
| Event | Package collected |
|-------|-------------------|
| Update | Waybill status = PICKED_UP |
| Update | Order status |

### In Transit Event (Task 64)
| Event | Package in transit |
|-------|-------------------|
| Update | Waybill status = IN_TRANSIT |

### Delivered Event (Task 65)
| Event | Package delivered |
|-------|-------------------|
| Update | Waybill status = DELIVERED |
| Update | Order status = COMPLETED |
| COD | Mark COD collected |

### Failed Event (Task 66)
| Event | Delivery failed |
|-------|-----------------|
| Update | Waybill status = FAILED |
| Reason | Store failure reason |
| Retry | Schedule retry if attempts remain |
