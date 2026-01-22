# Group F: Frontend & Testing

> **Phase:** 09 - Integrations & Sri Lanka Localizations  
> **SubPhase:** 09 - Domex & Other Couriers  
> **Group:** F of F  
> **Tasks Covered:** 83-88  
> **Group Goal:** Create frontend components, API client, and integration tests

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group-E_Fallback-Reliability](../Group-E_Fallback-Reliability/)
- **→ Next Group:** None (Last Group) | **Next SubPhase:** [SubPhase-10_Waybill-Generation](../../SubPhase-10_Waybill-Generation/)

---

## Group Overview

This group creates frontend and testing. Creates TypeScript interfaces for courier types including Courier, CourierRate, and CourierComparison. Creates frontend API client for courier endpoints (getProviders, compareRates, selectCourier). Creates CourierSelection UI component as dropdown with courier options. Creates RateComparison UI component showing all courier rates with price and speed indicators. Creates integration tests covering all couriers. Creates multi-courier documentation.

### Key Outcomes

- Courier TypeScript types
- Courier API client
- CourierSelection component
- RateComparison component
- Integration tests
- Multi-courier documentation

### Technology Context

- **Frontend:** Next.js + TypeScript
- **UI:** Shadcn/UI components
- **Testing:** pytest + jest
- **Docs:** OpenAPI + Markdown

---

## Documents in This Group

| # | Document | Description | Tasks Covered |
|---|----------|-------------|---------------|
| 01 | `01_Tasks-83-88_Types-UI-Testing.md` | Create types, UI, and tests | 83-88 |

---

## Task Summary

| Task # | Task Name | Complexity | Dependencies |
|--------|-----------|------------|--------------|
| 83 | Create Courier Types | Low | Task 82 |
| 84 | Create Courier API Client | Medium | Task 83 |
| 85 | Create Courier Selection UI | Medium | Task 84 |
| 86 | Create Rate Comparison UI | Medium | Task 84 |
| 87 | Create Integration Tests | Medium | Task 82 |
| 88 | Create Documentation | Medium | Task 87 |

---

## Execution Order

```
Task 83: Courier Types
    │
    ▼
Task 84: Courier API Client
    │
    ├─────────┐
    ▼         ▼
T-85       T-86
(Select)  (Compare)
    │         │
    └────┬────┘
         │
         ▼
   Task 87: Integration Tests
         │
         ▼
   Task 88: Documentation
```

---

## Expected Deliverables

```
frontend/
├── lib/
│   └── shipping/
│       └── courier/
│           ├── types.ts
│           └── client.ts
└── components/
    └── checkout/
        ├── CourierSelection.tsx
        └── RateComparison.tsx

backend/
└── tests/
    └── shipping/
        └── test_couriers.py

docs/
└── shipping/
    └── multi-courier.md
```

---

## Notes for AI Agents

### Courier Types (Task 83)
| Type | Fields |
|------|--------|
| Courier | id, name, logo, description |
| CourierRate | courier, price, delivery_days |
| CourierComparison | rates, cheapest, fastest |

### Courier Type Interface
| Field | Type |
|-------|------|
| id | string |
| name | string |
| logo | string (URL) |
| is_active | boolean |
| supports_cod | boolean |

### CourierRate Interface
| Field | Type |
|-------|------|
| courier | string |
| price | number (LKR) |
| delivery_days | number |
| delivery_estimate | string |
| available | boolean |

### Courier API Client (Task 84)
| Method | Endpoint |
|--------|----------|
| getProviders | GET /api/shipping/providers/ |
| compareRates | GET /api/shipping/compare/ |
| selectCourier | POST /api/orders/{id}/courier/ |

### Courier Selection UI (Task 85)
| Component | CourierSelection |
|-----------|------------------|
| Type | Dropdown/Select |
| Props | onChange, value, destination |
| Display | Courier name + logo |

### CourierSelection Features
| Feature | Description |
|---------|-------------|
| Dropdown | List of active couriers |
| Logo | Courier logo icon |
| Price | Show estimated price |
| Recommended | Mark cheapest/fastest |

### Rate Comparison UI (Task 86)
| Component | RateComparison |
|-----------|----------------|
| Type | Table/Cards |
| Props | destination, weight |
| Display | All rates with comparison |

### RateComparison Features
| Feature | Description |
|---------|-------------|
| Table view | All couriers side-by-side |
| Price badge | ₨ amount |
| Speed badge | Delivery days |
| Cheapest tag | Highlight cheapest |
| Fastest tag | Highlight fastest |
| Select button | Choose courier |

### Integration Tests (Task 87)
| Test | Coverage |
|------|----------|
| Koombiyo | Full flow |
| Domex | Full flow |
| PromptX | Full flow |
| Royal Express | Full flow |
| Trance Express | Full flow |
| Comparison | Rate comparison |
| Fallback | Fallback logic |

### Integration Test Cases
| Test Case | Description |
|-----------|-------------|
| test_create_shipment | Create shipment with each courier |
| test_track_shipment | Track shipment status |
| test_compare_rates | Get rates from all couriers |
| test_fallback | Verify fallback on failure |

### Documentation (Task 88)
| Section | Content |
|---------|---------|
| Overview | Multi-courier architecture |
| Setup | Configuration for each courier |
| API | All endpoints documented |
| Webhooks | Webhook setup for each |
| Fallback | Fallback configuration |
| Troubleshooting | Common issues |

### Courier Comparison Table (Docs)
| Courier | Speed | Cost | COD | Coverage |
|---------|-------|------|-----|----------|
| Koombiyo | Fast | Medium | Yes | Island-wide |
| Domex | Medium | Low | Yes | Island-wide |
| Prompt X | Same-day | High | Yes | Colombo Metro |
| Royal Express | Standard | Low | Yes | Island-wide |
| Trance Express | Express | High | Yes | Major cities |
