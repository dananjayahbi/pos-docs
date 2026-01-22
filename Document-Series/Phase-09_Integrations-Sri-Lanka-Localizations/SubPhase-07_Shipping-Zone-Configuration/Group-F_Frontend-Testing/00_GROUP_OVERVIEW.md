# Group F: Frontend & Testing

> **Phase:** 09 - Integrations & Sri Lanka Localizations  
> **SubPhase:** 07 - Shipping Zone Configuration  
> **Group:** F of F  
> **Tasks Covered:** 79-92  
> **Group Goal:** Create frontend location and shipping components with integration testing

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group-E_Zone-APIs-Admin](../Group-E_Zone-APIs-Admin/)
- **→ Next Group:** None (Last Group) | **Next SubPhase:** [SubPhase-08_Koombiyo-Courier-API](../../SubPhase-08_Koombiyo-Courier-API/)

---

## Group Overview

This group creates frontend location and shipping components. Creates Location and Shipping TypeScript types. Creates Location and Shipping API clients. Creates Province, District, and City dropdown components with cascading filter. Creates full Address form combining all dropdowns. Creates Shipping Options display with multiple options. Creates Delivery Estimate display component. Creates Free Shipping progress bar. Creates useZoneDetection hook for automatic zone detection. Creates integration tests. Creates shipping zone documentation.

### Key Outcomes

- Location types (TypeScript)
- Shipping types (TypeScript)
- Location API client
- Shipping API client
- Province dropdown
- District dropdown (filtered)
- City dropdown (filtered)
- Address form
- Shipping options display
- Delivery estimate display
- Free shipping progress bar
- useZoneDetection hook
- Integration tests
- Shipping zone documentation

### Technology Context

- **Frontend:** Next.js, TypeScript
- **Dropdowns:** Cascading filter
- **Hook:** Zone detection
- **Progress:** Free shipping bar

---

## Documents in This Group

| # | Document | Description | Tasks Covered |
|---|----------|-------------|---------------|
| 01 | `01_Tasks-79-86_Types-Components.md` | Create types and components | 79-86 |
| 02 | `02_Tasks-87-92_Display-Testing-Docs.md` | Create display, testing, and docs | 87-92 |

---

## Task Summary

| Task # | Task Name | Complexity | Dependencies |
|--------|-----------|------------|--------------|
| 79 | Create Location Types | Low | Task 78 |
| 80 | Create Shipping Types | Low | Task 79 |
| 81 | Create Location API Client | Medium | Task 80 |
| 82 | Create Shipping API Client | Medium | Task 80 |
| 83 | Create Province Dropdown | Medium | Task 81 |
| 84 | Create District Dropdown | Medium | Task 83 |
| 85 | Create City Dropdown | Medium | Task 84 |
| 86 | Create Address Form | Medium | Task 85 |
| 87 | Create Shipping Options | Medium | Task 82 |
| 88 | Create Delivery Estimate | Low | Task 87 |
| 89 | Create Free Shipping Bar | Low | Task 87 |
| 90 | Create Zone Detection Hook | Medium | Task 82 |
| 91 | Create Integration Tests | Medium | Task 78 |
| 92 | Create Documentation | Medium | Task 91 |

---

## Execution Order

```
Task 79: Location Types
    │
    ▼
Task 80: Shipping Types
    │
    ├────────┐
    ▼        ▼
T-81     T-82
(LocAPI)(ShipAPI)
    │        │
    ▼        ├────────┬────────┐
T-83     ▼        ▼        ▼
(Prov)  T-87     T-90
    │   (Options)(Hook)
    ▼        │        │
T-84     ├────┐   │
(Dist)   ▼    ▼   │
    │   T-88  T-89 │
    ▼  (Est)(Free) │
T-85     │    │    │
(City)   │    │    │
    │    │    │    │
    ▼    │    │    │
T-86     │    │    │
(Form)   │    │    │
    │    │    │    │
    └────┴────┴────┘
              │
              ▼
        Task 91: Integration Tests
              │
              ▼
        Task 92: Documentation
```

---

## Expected Deliverables

```
frontend/
├── lib/
│   └── shipping/
│       ├── types.ts
│       ├── location-client.ts
│       └── shipping-client.ts
├── components/
│   └── checkout/
│       ├── ProvinceDropdown.tsx
│       ├── DistrictDropdown.tsx
│       ├── CityDropdown.tsx
│       ├── AddressForm.tsx
│       ├── ShippingOptions.tsx
│       ├── DeliveryEstimate.tsx
│       └── FreeShippingBar.tsx
├── hooks/
│   └── useZoneDetection.ts
└── __tests__/
    └── shipping/
        └── shipping.test.ts
```

---

## Notes for AI Agents

### Location Types (Task 79)
| Type | Fields |
|------|--------|
| Province | id, code, name_en, name_si |
| District | id, code, name_en, province_id |
| City | id, name, district_id, postal_code |

### Shipping Types (Task 80)
| Type | Fields |
|------|--------|
| ShippingZone | id, name, zone_type, delivery_days |
| ShippingRate | zone_id, weight_from, weight_to, rate |
| DeliveryEstimate | min_days, max_days, estimated_date |

### Location API Client (Task 81)
| Method | Endpoint |
|--------|----------|
| getProvinces | GET /api/locations/provinces/ |
| getDistricts | GET /api/locations/districts/?province_id= |
| getCities | GET /api/locations/cities/?district_id= |

### Shipping API Client (Task 82)
| Method | Endpoint |
|--------|----------|
| calculateRate | POST /api/shipping/calculate/ |
| getEstimate | GET /api/shipping/estimate/ |

### Province Dropdown (Task 83)
| Component | ProvinceDropdown |
|-----------|------------------|
| Props | value, onChange |
| Options | All provinces |

### District Dropdown (Task 84)
| Component | DistrictDropdown |
|-----------|------------------|
| Props | provinceId, value, onChange |
| Filter | By province |

### City Dropdown (Task 85)
| Component | CityDropdown |
|-----------|--------------|
| Props | districtId, value, onChange |
| Filter | By district |

### Address Form (Task 86)
| Component | AddressForm |
|-----------|-------------|
| Include | Province, District, City |
| Flow | Cascading dropdowns |

### Shipping Options (Task 87)
| Component | ShippingOptions |
|-----------|-----------------|
| Props | districtId, cartWeight, cartTotal |
| Display | Available options with prices |

### Delivery Estimate (Task 88)
| Component | DeliveryEstimate |
|-----------|------------------|
| Props | zone, orderDate |
| Display | "Delivery by: Dec 15-17" |

### Free Shipping Bar (Task 89)
| Component | FreeShippingBar |
|-----------|-----------------|
| Props | cartTotal, threshold |
| Display | Progress bar + "₨X more for free shipping" |

### Zone Detection Hook (Task 90)
| Hook | useZoneDetection |
|------|------------------|
| Input | districtId |
| Return | zone, deliveryDays |

### Integration Tests (Task 91)
| Test | Flow |
|------|------|
| 1 | Select province → district → city |
| 2 | Calculate shipping rate |
| 3 | Get delivery estimate |
| 4 | Free shipping threshold |

### Documentation (Task 92)
| Section | Content |
|---------|---------|
| Setup | Zone configuration |
| Data | Province/district data |
| APIs | API endpoints |
| Frontend | Components usage |
