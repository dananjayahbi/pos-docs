# Group D: Courier Comparison

> **Phase:** 09 - Integrations & Sri Lanka Localizations  
> **SubPhase:** 09 - Domex & Other Couriers  
> **Group:** D of F  
> **Tasks Covered:** 61-72  
> **Group Goal:** Create courier factory and rate comparison service

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group-C_RoyalExpress-TranceExpress](../Group-C_RoyalExpress-TranceExpress/)
- **→ Next Group:** [Group-E_Fallback-Reliability](../Group-E_Fallback-Reliability/)

---

## Group Overview

This group creates comparison functionality. Creates CourierFactory class with get_provider method to get provider by courier type. Creates get_all_providers method to get all active providers for a tenant. Creates RateComparisonService with get_all_rates to fetch rates from all couriers concurrently. Creates sort_by_price and sort_by_speed methods. Creates get_cheapest and get_fastest convenience methods. Creates rate comparison API endpoint at GET /api/shipping/compare/. Creates preferred courier setting per tenant. Verifies comparison functionality.

### Key Outcomes

- CourierFactory class
- get_provider method
- get_all_providers method
- RateComparisonService
- get_all_rates method
- sort_by_price method
- sort_by_speed method
- Cheapest option helper
- Fastest option helper
- Rate comparison API
- Preferred courier setting
- Comparison verified

### Technology Context

- **Factory:** Provider selection
- **Comparison:** Parallel API calls
- **Sorting:** Price or speed
- **Default:** Tenant preferred courier

---

## Documents in This Group

| # | Document | Description | Tasks Covered |
|---|----------|-------------|---------------|
| 01 | `01_Tasks-61-66_Factory-Rates.md` | Create factory and rate methods | 61-66 |
| 02 | `02_Tasks-67-72_Options-API-Verify.md` | Create options and API | 67-72 |

---

## Task Summary

| Task # | Task Name | Complexity | Dependencies |
|--------|-----------|------------|--------------|
| 61 | Create CourierFactory | Medium | Task 60 |
| 62 | Create get_provider Method | Low | Task 61 |
| 63 | Create get_all_providers | Low | Task 61 |
| 64 | Create RateComparisonService | High | Task 63 |
| 65 | Create get_all_rates | Medium | Task 64 |
| 66 | Create sort_by_price | Low | Task 65 |
| 67 | Create sort_by_speed | Low | Task 65 |
| 68 | Create Cheapest Option | Low | Task 66 |
| 69 | Create Fastest Option | Low | Task 67 |
| 70 | Create Rate Comparison API | Medium | Task 69 |
| 71 | Create Preferred Courier | Low | Task 61 |
| 72 | Verify Comparison | Low | Task 71 |

---

## Execution Order

```
Task 61: CourierFactory
    │
    ├─────────┬─────────┐
    ▼         ▼         ▼
T-62       T-63       T-71
(get)   (getAll)   (Pref)
    │         │         │
    │         ▼         │
    │      Task 64: RateComparisonService
    │         │         │
    │         ▼         │
    │      Task 65: get_all_rates
    │         │         │
    │    ┌────┴────┐    │
    │    ▼         ▼    │
    │  T-66      T-67   │
    │ (price)  (speed)  │
    │    │         │    │
    │    ▼         ▼    │
    │  T-68      T-69   │
    │(Cheap)   (Fast)   │
    │    │         │    │
    │    └────┬────┘    │
    │         │         │
    │         ▼         │
    │      Task 70: Rate Comparison API
    │         │         │
    └─────────┴─────────┘
                    │
                    ▼
              Task 72: Verify
```

---

## Expected Deliverables

```
backend/
└── apps/
    └── shipping/
        ├── providers/
        │   └── factory.py
        ├── services/
        │   └── rate_comparison.py
        └── api/
            └── comparison_views.py
```

---

## Notes for AI Agents

### CourierFactory (Task 61)
| Class | CourierFactory |
|-------|----------------|
| Purpose | Provider selection |
| Pattern | Factory pattern |

### get_provider Method (Task 62)
| Input | courier_type: str |
|-------|-------------------|
| Return | ShippingProvider |
| Example | get_provider("koombiyo") |

### get_all_providers (Task 63)
| Input | tenant: Tenant |
|-------|----------------|
| Return | List[ShippingProvider] |
| Filter | Active only |

### RateComparisonService (Task 64)
| Class | RateComparisonService |
|-------|----------------------|
| Purpose | Compare rates across couriers |
| Async | Parallel API calls |

### get_all_rates (Task 65)
| Input | destination, weight |
|-------|---------------------|
| Return | List[CourierRate] |
| Concurrent | All active couriers |

### sort_by_price (Task 66)
| Input | List[CourierRate] |
|-------|-------------------|
| Return | Sorted by price (asc) |

### sort_by_speed (Task 67)
| Input | List[CourierRate] |
|-------|-------------------|
| Return | Sorted by delivery time |

### Cheapest Option (Task 68)
| Method | get_cheapest_rate() |
|--------|---------------------|
| Return | Lowest price option |

### Fastest Option (Task 69)
| Method | get_fastest_rate() |
|--------|---------------------|
| Return | Shortest delivery time |

### Rate Comparison API (Task 70)
| Endpoint | GET /api/shipping/compare/ |
|----------|----------------------------|
| Params | destination, weight |
| Return | All rates with sorting options |

### Rate Comparison Response
| Field | Type |
|-------|------|
| rates | List of courier rates |
| cheapest | Cheapest option |
| fastest | Fastest option |

### Preferred Courier (Task 71)
| Setting | Per tenant |
|---------|------------|
| Field | preferred_courier |
| Use | Default selection |

### Courier Rate Object
| Field | Type |
|-------|------|
| courier | String (courier name) |
| price | Decimal (LKR) |
| delivery_days | Integer |
| delivery_estimate | String |
| available | Boolean |
