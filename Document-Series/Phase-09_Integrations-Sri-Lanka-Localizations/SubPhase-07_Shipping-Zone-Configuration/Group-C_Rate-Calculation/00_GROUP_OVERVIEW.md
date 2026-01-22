# Group C: Rate Calculation

> **Phase:** 09 - Integrations & Sri Lanka Localizations  
> **SubPhase:** 07 - Shipping Zone Configuration  
> **Group:** C of F  
> **Tasks Covered:** 35-50  
> **Group Goal:** Implement weight-based shipping rate calculation with free shipping thresholds

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group-B_Shipping-Zone-Models](../Group-B_Shipping-Zone-Models/)
- **→ Next Group:** [Group-D_Delivery-Estimation](../Group-D_Delivery-Estimation/)

---

## Group Overview

This group implements rate calculation. Creates ShippingRate model with zone foreign key, weight range fields (from/to in kg), base rate field, and per-kg additional rate. Creates free shipping threshold per zone. Creates RateCalculator service with zone detection from address, cart weight calculation, rate lookup, and free shipping check. Creates rate response format. Creates multiple zone rates support for showing options. Creates rate comparison for courier rates. Verifies rate calculation.

### Key Outcomes

- ShippingRate model
- Rate zone FK
- Weight from field
- Weight to field
- Base rate field
- Per KG rate field
- Free shipping threshold
- RateCalculator service
- Zone detection
- Weight calculation
- Rate lookup
- Free shipping check
- Rate response format
- Multiple zone rates
- Rate comparison
- Rate calculation verified

### Technology Context

- **Weight:** Kilograms (kg)
- **Currency:** LKR
- **Free shipping:** Per-zone threshold
- **Rates:** Tiered by weight

---

## Documents in This Group

| # | Document | Description | Tasks Covered |
|---|----------|-------------|---------------|
| 01 | `01_Tasks-35-42_Rate-Model-Service.md` | Create rate model and service | 35-42 |
| 02 | `02_Tasks-43-50_Calculation-Verify.md` | Create calculation and verify | 43-50 |

---

## Task Summary

| Task # | Task Name | Complexity | Dependencies |
|--------|-----------|------------|--------------|
| 35 | Create ShippingRate Model | Medium | Task 34 |
| 36 | Create Rate Zone FK | Low | Task 35 |
| 37 | Create Weight From Field | Low | Task 35 |
| 38 | Create Weight To Field | Low | Task 35 |
| 39 | Create Base Rate Field | Low | Task 35 |
| 40 | Create Per KG Rate Field | Low | Task 35 |
| 41 | Create Free Shipping Threshold | Low | Task 35 |
| 42 | Create RateCalculator Service | High | Task 41 |
| 43 | Create Zone Detection | Medium | Task 42 |
| 44 | Create Weight Calculation | Medium | Task 42 |
| 45 | Create Rate Lookup | Medium | Task 44 |
| 46 | Create Free Shipping Check | Low | Task 45 |
| 47 | Create Rate Response | Low | Task 46 |
| 48 | Create Multiple Zone Rates | Medium | Task 42 |
| 49 | Create Rate Comparison | Medium | Task 48 |
| 50 | Verify Rate Calculation | Low | Task 49 |

---

## Execution Order

```
Task 35: ShippingRate Model
    │
    ├────────┬────────┬────────┬────────┬────────┬────────┐
    ▼        ▼        ▼        ▼        ▼        ▼        ▼
T-36     T-37     T-38     T-39     T-40     T-41
(Zone)(WtFrom)(WtTo) (Base) (PerKG) (Free)
    │        │        │        │        │        │
    └────────┴────────┴────────┴────────┴────────┘
                              │
                              ▼
                   Task 42: RateCalculator Service
                              │
              ┌───────────────┼───────────────┬────────┐
              ▼               ▼               ▼        ▼
           T-43            T-44            T-48
          (Zone)        (Weight)        (Multi)
              │               │               │
              │               ▼               ▼
              │            T-45            T-49
              │          (Lookup)        (Compare)
              │               │               │
              │               ▼               │
              │            T-46             │
              │          (FreeCk)           │
              │               │               │
              │               ▼               │
              │            T-47             │
              │          (Response)         │
              │               │               │
              └───────────────┴───────────────┘
                              │
                              ▼
                        Task 50: Verify
```

---

## Expected Deliverables

```
backend/
└── apps/
    └── shipping/
        ├── models/
        │   └── rate.py
        └── services/
            └── rate_calculator.py
```

---

## Notes for AI Agents

### ShippingRate Model (Task 35)
| Field | Type |
|-------|------|
| zone | ForeignKey |
| weight_from | DecimalField |
| weight_to | DecimalField |
| base_rate | DecimalField |
| per_kg_rate | DecimalField |

### Rate Zone FK (Task 36)
| Field | Type |
|-------|------|
| Name | zone |
| Related | ShippingZone |
| On delete | CASCADE |

### Weight From Field (Task 37)
| Field | Type |
|-------|------|
| Name | weight_from |
| Unit | kg |
| Example | 0, 1, 5, 10 |

### Weight To Field (Task 38)
| Field | Type |
|-------|------|
| Name | weight_to |
| Unit | kg |
| Example | 1, 5, 10, 999 |

### Base Rate Field (Task 39)
| Field | Type |
|-------|------|
| Name | base_rate |
| Currency | LKR |
| Example | 250.00, 350.00 |

### Per KG Rate Field (Task 40)
| Field | Type |
|-------|------|
| Name | per_kg_rate |
| Currency | LKR |
| Use | Additional per kg after base |

### Free Shipping Threshold (Task 41)
| Field | Type |
|-------|------|
| Name | free_shipping_threshold |
| Currency | LKR |
| Example | 5000.00 (free shipping above ₨5,000) |

### RateCalculator Service (Task 42)
| Method | Description |
|--------|-------------|
| calculate | Calculate shipping rate |
| Input | cart, address |
| Output | ShippingRateResponse |

### Zone Detection (Task 43)
| Input | Address |
|-------|---------|
| Detect | District → Zone |
| Fallback | Default zone |

### Weight Calculation (Task 44)
| Input | Cart items |
|-------|------------|
| Calculate | Sum of item weights |
| Round | Ceiling to 0.5 kg |

### Rate Lookup (Task 45)
| Input | zone, weight |
|-------|--------------|
| Find | Matching rate tier |
| Calculate | base + (extra_kg × per_kg) |

### Free Shipping Check (Task 46)
| Check | cart_total >= threshold |
|-------|-------------------------|
| Result | Zero shipping if qualified |

### Rate Response (Task 47)
| Field | Value |
|-------|-------|
| zone | Zone name |
| rate | Calculated rate |
| delivery_days | Estimated days |
| free_shipping | Boolean |

### Multiple Zone Rates (Task 48)
| Feature | Multiple options |
|---------|------------------|
| Show | Standard, Express |
| Options | Different zones |

### Rate Comparison (Task 49)
| Compare | Multiple couriers |
|---------|-------------------|
| Show | Cheapest, fastest |
| Sort | By price or speed |
