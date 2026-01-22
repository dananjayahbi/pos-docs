# Group F: Admin & Testing

> **Phase:** 09 - Integrations & Sri Lanka Localizations  
> **SubPhase:** 08 - Koombiyo Courier API  
> **Group:** F of F  
> **Tasks Covered:** 81-94  
> **Group Goal:** Create admin interfaces, REST APIs, frontend client, and integration testing

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group-E_Pickup-COD](../Group-E_Pickup-COD/)
- **→ Next Group:** None (Last Group) | **Next SubPhase:** [SubPhase-09_Domex-Other-Couriers](../../SubPhase-09_Domex-Other-Couriers/)

---

## Group Overview

This group creates admin and testing. Creates Django admin for Waybill with bulk print labels action. Creates admin for Tracking events, Pickup, and COD Report. Creates REST API for waybills, tracking, and pickup scheduling. Creates TypeScript types and frontend API client for Koombiyo. Creates Tracking UI component for order tracking display. Creates integration tests. Creates Koombiyo documentation.

### Key Outcomes

- Waybill admin
- Waybill bulk actions
- Tracking admin
- Pickup admin
- COD Report admin
- Waybill REST API
- Generate Waybill API
- Tracking API
- Pickup API
- Koombiyo types (TypeScript)
- Frontend client
- Tracking UI
- Integration tests
- Koombiyo documentation

### Technology Context

- **Admin:** Django admin
- **API:** DRF ViewSets
- **Frontend:** Next.js components
- **Testing:** Full flow tests

---

## Documents in This Group

| # | Document | Description | Tasks Covered |
|---|----------|-------------|---------------|
| 01 | `01_Tasks-81-89_Admin-API.md` | Create admin and APIs | 81-89 |
| 02 | `02_Tasks-90-94_Frontend-Testing-Docs.md` | Create frontend and testing | 90-94 |

---

## Task Summary

| Task # | Task Name | Complexity | Dependencies |
|--------|-----------|------------|--------------|
| 81 | Create Waybill Admin | Medium | Task 80 |
| 82 | Create Waybill Actions | Medium | Task 81 |
| 83 | Create Tracking Admin | Low | Task 81 |
| 84 | Create Pickup Admin | Low | Task 81 |
| 85 | Create COD Report Admin | Low | Task 81 |
| 86 | Create Waybill API | Medium | Task 80 |
| 87 | Create Generate Waybill API | Medium | Task 86 |
| 88 | Create Tracking API | Medium | Task 86 |
| 89 | Create Pickup API | Medium | Task 86 |
| 90 | Create Koombiyo Types | Low | Task 80 |
| 91 | Create Frontend Client | Medium | Task 90 |
| 92 | Create Tracking UI | Medium | Task 91 |
| 93 | Create Integration Tests | Medium | Task 80 |
| 94 | Create Documentation | Medium | Task 93 |

---

## Execution Order

```
Task 81: Waybill Admin
    │
    ├────────┬────────┬────────┬────────┐
    ▼        ▼        ▼        ▼        ▼
T-82     T-83     T-84     T-85     T-86
(Act)  (Track) (Pick)  (COD)   (API)
    │        │        │        │        │
    │        │        │        │   ┌────┼────┬────────┐
    │        │        │        │   ▼    ▼    ▼        ▼
    │        │        │        │ T-87  T-88  T-89
    │        │        │        │(GenWB)(Track)(Pick)
    │        │        │        │   │    │    │
    └────────┴────────┴────────┴───┴────┴────┘
                              │
                              ▼
                        Task 90: Koombiyo Types
                              │
                              ▼
                        Task 91: Frontend Client
                              │
                              ▼
                        Task 92: Tracking UI
                              │
                              ▼
                        Task 93: Integration Tests
                              │
                              ▼
                        Task 94: Documentation
```

---

## Expected Deliverables

```
backend/
└── apps/
    └── shipping/
        ├── admin.py
        └── api/
            ├── serializers.py
            ├── views.py
            └── urls.py
frontend/
├── lib/
│   └── shipping/
│       └── koombiyo/
│           ├── types.ts
│           └── client.ts
└── components/
    └── orders/
        └── TrackingTimeline.tsx
```

---

## Notes for AI Agents

### Waybill Admin (Task 81)
| Model | Waybill |
|-------|---------|
| List display | order, waybill_number, status |
| Filter | status, created_at |
| Search | waybill_number, order |

### Waybill Actions (Task 82)
| Action | Bulk print labels |
|--------|-------------------|
| Select | Multiple waybills |
| Output | Combined PDF |

### Tracking Admin (Task 83)
| Model | TrackingEvent |
|-------|---------------|
| List display | waybill, status, timestamp |
| Filter | status |
| Inline | In Waybill admin |

### Pickup Admin (Task 84)
| Model | Pickup |
|-------|--------|
| List display | date, time_slot, status |
| Filter | status, date |

### COD Report Admin (Task 85)
| Model | CODReport |
|-------|-----------|
| List display | date_range, total_collected |
| Filter | date_range |

### Waybill API (Task 86)
| ViewSet | WaybillViewSet |
|---------|----------------|
| Actions | list, retrieve, create |

### Generate Waybill API (Task 87)
| Endpoint | POST /api/orders/{id}/waybill/ |
|----------|--------------------------------|
| Action | Generate waybill for order |
| Return | Waybill details |

### Tracking API (Task 88)
| Endpoint | GET /api/waybills/{id}/tracking/ |
|----------|-----------------------------------|
| Return | List of tracking events |

### Pickup API (Task 89)
| Endpoint | POST /api/pickups/schedule/ |
|----------|------------------------------|
| Body | { date, time_slot, waybill_ids } |
| Return | Pickup confirmation |

### Koombiyo Types (Task 90)
| Type | Fields |
|------|--------|
| Waybill | id, waybill_number, status, pdf_url |
| TrackingEvent | status, timestamp, location |
| Pickup | date, time_slot, status |

### Frontend Client (Task 91)
| Method | Endpoint |
|--------|----------|
| generateWaybill | POST /api/orders/{id}/waybill/ |
| getTracking | GET /api/waybills/{id}/tracking/ |
| schedulePickup | POST /api/pickups/schedule/ |

### Tracking UI (Task 92)
| Component | TrackingTimeline |
|-----------|------------------|
| Props | waybillId |
| Display | Timeline of events |
| Icons | Status-specific icons |

### Integration Tests (Task 93)
| Test | Flow |
|------|------|
| 1 | Generate waybill |
| 2 | Download PDF |
| 3 | Track shipment |
| 4 | Receive webhook |
| 5 | Schedule pickup |
| 6 | Get COD report |

### Documentation (Task 94)
| Section | Content |
|---------|---------|
| Setup | Configuration |
| Waybills | Generation flow |
| Tracking | Webhooks setup |
| COD | Collection reports |
| Troubleshooting | Common issues |
