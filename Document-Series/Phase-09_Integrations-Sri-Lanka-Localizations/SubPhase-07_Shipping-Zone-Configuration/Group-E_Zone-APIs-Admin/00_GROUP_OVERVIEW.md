# Group E: Zone APIs & Admin

> **Phase:** 09 - Integrations & Sri Lanka Localizations  
> **SubPhase:** 07 - Shipping Zone Configuration  
> **Group:** E of F  
> **Tasks Covered:** 65-78  
> **Group Goal:** Create location and shipping APIs with Django admin configuration

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group-D_Delivery-Estimation](../Group-D_Delivery-Estimation/)
- **→ Next Group:** [Group-F_Frontend-Testing](../Group-F_Frontend-Testing/)

---

## Group Overview

This group creates APIs and admin. Creates Province, District, and City API endpoints for location lookup. Creates Shipping Rate API for available rates. Creates Rate Calculation API for calculating shipping cost. Creates Delivery Estimate API for date estimation. Creates Django admin for Province, District, and City models. Creates Zone admin with district inline. Creates Rate admin with zone inline. Verifies all APIs and admin.

### Key Outcomes

- Province API
- District API
- City API
- Shipping Rate API
- Rate Calculation API
- Delivery Estimate API
- Province admin
- District admin
- City admin
- Zone admin
- Zone district inline
- Rate admin
- Rate zone inline
- APIs & Admin verified

### Technology Context

- **APIs:** DRF ViewSets
- **Admin:** Django admin
- **Inline:** Related objects
- **Filtering:** Province → District → City

---

## Documents in This Group

| # | Document | Description | Tasks Covered |
|---|----------|-------------|---------------|
| 01 | `01_Tasks-65-71_Location-APIs-Admin.md` | Create location APIs and admin | 65-71 |
| 02 | `02_Tasks-72-78_Shipping-Admin-Verify.md` | Create shipping admin and verify | 72-78 |

---

## Task Summary

| Task # | Task Name | Complexity | Dependencies |
|--------|-----------|------------|--------------|
| 65 | Create Province API | Medium | Task 64 |
| 66 | Create District API | Medium | Task 65 |
| 67 | Create City API | Medium | Task 66 |
| 68 | Create Shipping Rate API | Medium | Task 67 |
| 69 | Create Rate Calculation API | Medium | Task 68 |
| 70 | Create Delivery Estimate API | Medium | Task 69 |
| 71 | Create Province Admin | Low | Task 64 |
| 72 | Create District Admin | Low | Task 71 |
| 73 | Create City Admin | Low | Task 72 |
| 74 | Create Zone Admin | Medium | Task 73 |
| 75 | Create Zone District Inline | Low | Task 74 |
| 76 | Create Rate Admin | Medium | Task 74 |
| 77 | Create Rate Zone Inline | Low | Task 76 |
| 78 | Verify APIs & Admin | Low | Task 77 |

---

## Execution Order

```
Task 65: Province API
    │
    ▼
Task 66: District API
    │
    ▼
Task 67: City API
    │
    ▼
Task 68: Shipping Rate API
    │
    ▼
Task 69: Rate Calculation API
    │
    ▼
Task 70: Delivery Estimate API
    │
    │        Task 71: Province Admin
    │               │
    │               ▼
    │        Task 72: District Admin
    │               │
    │               ▼
    │        Task 73: City Admin
    │               │
    │               ▼
    │        Task 74: Zone Admin
    │               │
    │          ┌────┴────┐
    │          ▼         ▼
    │       T-75      T-76
    │    (DistInl) (RateAdm)
    │          │         │
    │          │         ▼
    │          │       T-77
    │          │    (RateInl)
    │          │         │
    └──────────┴─────────┘
                    │
                    ▼
              Task 78: Verify
```

---

## Expected Deliverables

```
backend/
└── apps/
    ├── locations/
    │   ├── admin.py
    │   └── api/
    │       ├── serializers.py
    │       ├── views.py
    │       └── urls.py
    └── shipping/
        ├── admin.py
        └── api/
            ├── serializers.py
            ├── views.py
            └── urls.py
```

---

## Notes for AI Agents

### Province API (Task 65)
| Endpoint | GET /api/locations/provinces/ |
|----------|-------------------------------|
| Return | List of provinces |
| Fields | id, name_en, name_si, code |

### District API (Task 66)
| Endpoint | GET /api/locations/districts/ |
|----------|-------------------------------|
| Filter | ?province_id=X |
| Return | Filtered districts |

### City API (Task 67)
| Endpoint | GET /api/locations/cities/ |
|----------|----------------------------|
| Filter | ?district_id=X |
| Return | Filtered cities |

### Shipping Rate API (Task 68)
| Endpoint | GET /api/shipping/rates/ |
|----------|--------------------------|
| Filter | ?zone_id=X |
| Return | Rate tiers for zone |

### Rate Calculation API (Task 69)
| Endpoint | POST /api/shipping/calculate/ |
|----------|--------------------------------|
| Body | { district_id, weight, cart_total } |
| Return | Calculated rate |

### Delivery Estimate API (Task 70)
| Endpoint | GET /api/shipping/estimate/ |
|----------|------------------------------|
| Params | ?district_id=X |
| Return | Estimated delivery date, range |

### Province Admin (Task 71)
| Model | Province |
|-------|----------|
| List display | code, name_en, name_si |
| Search | name_en, code |

### District Admin (Task 72)
| Model | District |
|-------|----------|
| List display | code, name_en, province |
| Filter | province |
| Search | name_en, code |

### City Admin (Task 73)
| Model | City |
|-------|------|
| List display | name, district, postal_code |
| Filter | district, is_active |
| Search | name, postal_code |

### Zone Admin (Task 74)
| Model | ShippingZone |
|-------|--------------|
| List display | name, zone_type, delivery_days |
| Filter | zone_type, is_active |

### Zone District Inline (Task 75)
| Inline | Districts in zone |
|--------|-------------------|
| Model | Zone-District M2M |
| Type | TabularInline |

### Rate Admin (Task 76)
| Model | ShippingRate |
|-------|--------------|
| List display | zone, weight range, rate |
| Filter | zone |

### Rate Zone Inline (Task 77)
| Inline | Rates in zone admin |
|--------|---------------------|
| Model | ShippingRate |
| Type | TabularInline |
