# Group D: Delivery Estimation

> **Phase:** 09 - Integrations & Sri Lanka Localizations  
> **SubPhase:** 07 - Shipping Zone Configuration  
> **Group:** D of F  
> **Tasks Covered:** 51-64  
> **Group Goal:** Implement delivery date estimation with business days and holiday handling

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group-C_Rate-Calculation](../Group-C_Rate-Calculation/)
- **→ Next Group:** [Group-E_Zone-APIs-Admin](../Group-E_Zone-APIs-Admin/)

---

## Group Overview

This group implements delivery estimation. Creates DeliveryEstimator service with zone-based delivery days calculation. Creates business days calculation that skips weekends and holidays. Creates Sri Lanka public holidays list. Creates Poya day handling for monthly full moon days. Creates cutoff time for same-day processing. Creates same-day delivery option for Colombo Metro. Creates next-day delivery option. Creates standard delivery for 2-5 business days. Creates express shipping option. Creates delivery range with min-max days. Creates estimated date API endpoint. Creates dispatch delay for processing time. Verifies delivery estimation.

### Key Outcomes

- DeliveryEstimator service
- Zone delivery days
- Business days calculation
- Sri Lanka holidays list
- Poya day handling
- Cutoff time (same-day)
- Same day delivery
- Next day delivery
- Standard delivery
- Express option
- Delivery range (min-max)
- Estimated date API
- Dispatch delay
- Delivery estimation verified

### Technology Context

- **Holidays:** Sri Lanka public holidays
- **Poya:** Monthly full moon holiday
- **Timezone:** Asia/Colombo
- **Business days:** Skip weekends/holidays

---

## Documents in This Group

| # | Document | Description | Tasks Covered |
|---|----------|-------------|---------------|
| 01 | `01_Tasks-51-58_Estimator-Delivery.md` | Create estimator and delivery options | 51-58 |
| 02 | `02_Tasks-59-64_Options-API-Verify.md` | Create options, API, and verify | 59-64 |

---

## Task Summary

| Task # | Task Name | Complexity | Dependencies |
|--------|-----------|------------|--------------|
| 51 | Create DeliveryEstimator | High | Task 50 |
| 52 | Create Zone Delivery Days | Low | Task 51 |
| 53 | Create Business Days Calc | Medium | Task 51 |
| 54 | Create Sri Lanka Holidays | Medium | Task 53 |
| 55 | Create Poya Day Handling | Medium | Task 54 |
| 56 | Create Cutoff Time | Low | Task 51 |
| 57 | Create Same Day Delivery | Medium | Task 56 |
| 58 | Create Next Day Delivery | Low | Task 56 |
| 59 | Create Standard Delivery | Low | Task 51 |
| 60 | Create Express Option | Medium | Task 51 |
| 61 | Create Delivery Range | Low | Task 51 |
| 62 | Create Estimated Date API | Medium | Task 61 |
| 63 | Create Dispatch Delay | Low | Task 51 |
| 64 | Verify Delivery Estimation | Low | Task 63 |

---

## Execution Order

```
Task 51: DeliveryEstimator
    │
    ├────────┬────────┬────────┬────────┬────────┬────────┐
    ▼        ▼        ▼        ▼        ▼        ▼        ▼
T-52     T-53     T-56     T-59     T-60     T-61     T-63
(Days) (BizDay)(Cutoff)(Std)  (Expr) (Range)(Delay)
    │        │        │        │        │        │        │
    │   ┌────┴────┐   ├────┐   │        │        │        │
    │   ▼         ▼   ▼    ▼   │        │        │        │
    │ T-54      T-57  T-58 │   │        │        │        │
    │(Holiday)(Same)(Next) │   │        │        │        │
    │   │         │    │   │   │        │        │        │
    │   ▼         │    │   │   │        │        │        │
    │ T-55       │    │   │   │        │        │        │
    │(Poya)      │    │   │   │        │        │        │
    │   │         │    │   │   │        │        │        │
    └───┴─────────┴────┴───┴───┴────────┴────────┴────────┘
                              │
                              ▼
                        Task 62: Estimated Date API
                              │
                              ▼
                        Task 64: Verify
```

---

## Expected Deliverables

```
backend/
└── apps/
    └── shipping/
        ├── services/
        │   └── delivery_estimator.py
        ├── data/
        │   └── holidays.py
        └── api/
            └── views.py
```

---

## Notes for AI Agents

### DeliveryEstimator (Task 51)
| Method | Description |
|--------|-------------|
| estimate | Calculate delivery date |
| Input | zone, order_date |
| Output | DeliveryEstimate |

### Zone Delivery Days (Task 52)
| Zone | Days |
|------|------|
| Colombo Metro | 1 |
| Western Province | 2-3 |
| Other Provinces | 3-5 |
| Remote Areas | 5-7 |

### Business Days Calc (Task 53)
| Skip | Days |
|------|------|
| Weekends | Saturday, Sunday |
| Holidays | Public holidays |
| Poya | Full moon days |

### Sri Lanka Holidays (Task 54)
| Holiday | Month |
|---------|-------|
| Independence Day | February 4 |
| Sinhala/Tamil New Year | April 13-14 |
| May Day | May 1 |
| Vesak | May (varies) |
| Christmas | December 25 |

### Poya Day Handling (Task 55)
| Poya | Description |
|------|-------------|
| Monthly | Full moon day |
| Calculate | Use ephem or fixed dates |
| Holiday | No delivery |

### Cutoff Time (Task 56)
| Setting | Value |
|---------|-------|
| Cutoff | 12:00 PM |
| Timezone | Asia/Colombo |
| After cutoff | Next business day |

### Same Day Delivery (Task 57)
| Zone | Colombo Metro only |
|------|-------------------|
| Condition | Before cutoff |
| Premium | Additional fee |

### Next Day Delivery (Task 58)
| Zone | Colombo Metro, Western |
|------|------------------------|
| Condition | After cutoff or next zone |

### Standard Delivery (Task 59)
| Days | 2-5 business days |
|------|-------------------|
| Default | Yes |
| Free shipping | If above threshold |

### Express Option (Task 60)
| Feature | Faster delivery |
|---------|-----------------|
| Premium | Additional fee |
| Days | Reduced by 1-2 |

### Delivery Range (Task 61)
| Display | "2-3 business days" |
|---------|---------------------|
| Format | min_days - max_days |

### Estimated Date API (Task 62)
| Endpoint | GET /api/shipping/estimate/ |
|----------|------------------------------|
| Params | zone, order_date |
| Return | estimated_date, range |

### Dispatch Delay (Task 63)
| Setting | Processing time |
|---------|-----------------|
| Default | 1 day |
| Custom | Per product/category |
