# SubPhase 07: Shipping Zone Configuration - Tasks Summary

> **Phase:** 09 - Integrations & Sri Lanka Localizations  
> **SubPhase Index:** 07 of 12  
> **SubPhase Goal:** Implement district-based shipping zones with rate calculation and delivery estimates  
> **Total Tasks:** 92 | **Status:** Planning  
> **Estimated Duration:** 11-13 hours

---

## Navigation

- **↑ Parent:** [00_SUBPHASES_SUMMARY.md](../00_SUBPHASES_SUMMARY.md)
- **← Previous SubPhase:** [SubPhase-06_Cash-On-Delivery-COD](../SubPhase-06_Cash-On-Delivery-COD/)
- **→ Next SubPhase:** [SubPhase-08_Koombiyo-Courier-API](../SubPhase-08_Koombiyo-Courier-API/)

---

## SubPhase Overview

This sub-phase implements Sri Lanka's district-based shipping zone system for accurate rate calculation and delivery time estimation.

### Key Outcomes
- Province/District/City data structure
- Shipping zone configuration
- Weight-based rate calculation
- Free shipping thresholds
- Delivery time estimation
- COD availability per zone

### Sri Lanka Location Hierarchy
```
Province (9)
└── District (25)
    └── City/Town (many)
```

### Zone Types
- Colombo Metro (Same day/Next day)
- Western Province
- Other Provinces
- Remote Areas (additional charges)

### Technology Context
- **Backend:** Django 5.x, DRF
- **Data:** Seeded Sri Lanka location data
- **Rates:** Weight-based, zone-based
- **Currency:** LKR (Sri Lankan Rupees)

---

## Task Execution Order

```
TASK GROUP A: Location Data Models (Tasks 01-18)
        │
        ▼
TASK GROUP B: Shipping Zone Models (Tasks 19-34)
        │
        ▼
TASK GROUP C: Rate Calculation (Tasks 35-50)
        │
        ▼
TASK GROUP D: Delivery Estimation (Tasks 51-64)
        │
        ▼
TASK GROUP E: Zone APIs & Admin (Tasks 65-78)
        │
        ▼
TASK GROUP F: Frontend & Testing (Tasks 79-92)
```

---

## Task Index

### Group A: Location Data Models (Tasks 01-18)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 01 | **Create Province Model** | 9 Sri Lanka provinces | SubPhase-01 | 🔴 Not Created |
| 02 | **Create Province Name Field** | Sinhala/English names | Task 01 | 🔴 Not Created |
| 03 | **Create Province Code Field** | WP, CP, SP, etc. | Task 01 | 🔴 Not Created |
| 04 | **Create District Model** | 25 Sri Lanka districts | Task 01 | 🔴 Not Created |
| 05 | **Create District Province FK** | Link to province | Task 04 | 🔴 Not Created |
| 06 | **Create District Name Field** | Sinhala/English names | Task 04 | 🔴 Not Created |
| 07 | **Create District Code Field** | CMB, GMP, KDY, etc. | Task 04 | 🔴 Not Created |
| 08 | **Create City Model** | Towns/cities within district | Task 04 | 🔴 Not Created |
| 09 | **Create City District FK** | Link to district | Task 08 | 🔴 Not Created |
| 10 | **Create City Name Field** | City/town name | Task 08 | 🔴 Not Created |
| 11 | **Create Postal Code Field** | Sri Lanka postal code | Task 08 | 🔴 Not Created |
| 12 | **Create Is Active Field** | Active locations | Task 08 | 🔴 Not Created |
| 13 | **Create Province Data Seed** | Seed 9 provinces | Task 03 | 🔴 Not Created |
| 14 | **Create District Data Seed** | Seed 25 districts | Task 07 | 🔴 Not Created |
| 15 | **Create Major Cities Seed** | Seed major cities | Task 11 | 🔴 Not Created |
| 16 | **Create Postal Codes Seed** | Seed postal codes | Task 11 | 🔴 Not Created |
| 17 | **Create Location Migrations** | Run migrations | Task 16 | 🔴 Not Created |
| 18 | **Verify Location Data** | Test seed data | Task 17 | 🔴 Not Created |

---

### Group B: Shipping Zone Models (Tasks 19-34)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 19 | **Create ShippingZone Model** | Tenant shipping zones | Task 18 | 🔴 Not Created |
| 20 | **Create Zone Name Field** | Zone name | Task 19 | 🔴 Not Created |
| 21 | **Create Zone Code Field** | Zone identifier | Task 19 | 🔴 Not Created |
| 22 | **Create Zone Type Choices** | metro/province/remote | Task 19 | 🔴 Not Created |
| 23 | **Create Zone Districts M2M** | Link to districts | Task 19 | 🔴 Not Created |
| 24 | **Create Zone Cities M2M** | Optional city-level | Task 19 | 🔴 Not Created |
| 25 | **Create Delivery Days Field** | Expected delivery days | Task 19 | 🔴 Not Created |
| 26 | **Create Is COD Available** | COD in this zone | Task 19 | 🔴 Not Created |
| 27 | **Create Is Active Field** | Zone active/inactive | Task 19 | 🔴 Not Created |
| 28 | **Create Display Order Field** | Sort order | Task 19 | 🔴 Not Created |
| 29 | **Create Default Zones** | Colombo Metro, Western, etc. | Task 19 | 🔴 Not Created |
| 30 | **Create Colombo Metro Zone** | CMB, GMP, KLT districts | Task 29 | 🔴 Not Created |
| 31 | **Create Western Province Zone** | Rest of Western | Task 29 | 🔴 Not Created |
| 32 | **Create Other Provinces Zone** | All other provinces | Task 29 | 🔴 Not Created |
| 33 | **Create Remote Areas Zone** | Hard to reach areas | Task 29 | 🔴 Not Created |
| 34 | **Verify Shipping Zones** | Test zone config | Task 33 | 🔴 Not Created |

---

### Group C: Rate Calculation (Tasks 35-50)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 35 | **Create ShippingRate Model** | Zone-based rates | Task 34 | 🔴 Not Created |
| 36 | **Create Rate Zone FK** | Link to zone | Task 35 | 🔴 Not Created |
| 37 | **Create Weight From Field** | Min weight (kg) | Task 35 | 🔴 Not Created |
| 38 | **Create Weight To Field** | Max weight (kg) | Task 35 | 🔴 Not Created |
| 39 | **Create Base Rate Field** | Base shipping rate | Task 35 | 🔴 Not Created |
| 40 | **Create Per KG Rate Field** | Additional per kg | Task 35 | 🔴 Not Created |
| 41 | **Create Free Shipping Threshold** | Free above amount | Task 35 | 🔴 Not Created |
| 42 | **Create RateCalculator Service** | Calculate shipping | Task 41 | 🔴 Not Created |
| 43 | **Create Zone Detection** | Detect zone from address | Task 42 | 🔴 Not Created |
| 44 | **Create Weight Calculation** | Calculate cart weight | Task 42 | 🔴 Not Created |
| 45 | **Create Rate Lookup** | Find applicable rate | Task 44 | 🔴 Not Created |
| 46 | **Create Free Shipping Check** | Check threshold | Task 45 | 🔴 Not Created |
| 47 | **Create Rate Response** | Format rate response | Task 46 | 🔴 Not Created |
| 48 | **Create Multiple Zone Rates** | Multiple rate options | Task 42 | 🔴 Not Created |
| 49 | **Create Rate Comparison** | Compare courier rates | Task 48 | 🔴 Not Created |
| 50 | **Verify Rate Calculation** | Test calculations | Task 49 | 🔴 Not Created |

---

### Group D: Delivery Estimation (Tasks 51-64)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 51 | **Create DeliveryEstimator** | Estimate delivery date | Task 50 | 🔴 Not Created |
| 52 | **Create Zone Delivery Days** | Days per zone | Task 51 | 🔴 Not Created |
| 53 | **Create Business Days Calc** | Skip weekends/holidays | Task 51 | 🔴 Not Created |
| 54 | **Create Sri Lanka Holidays** | Public holidays list | Task 53 | 🔴 Not Created |
| 55 | **Create Poya Day Handling** | Monthly poya days | Task 54 | 🔴 Not Created |
| 56 | **Create Cutoff Time** | Same-day cutoff time | Task 51 | 🔴 Not Created |
| 57 | **Create Same Day Delivery** | Colombo Metro same day | Task 56 | 🔴 Not Created |
| 58 | **Create Next Day Delivery** | Next business day | Task 56 | 🔴 Not Created |
| 59 | **Create Standard Delivery** | 2-5 business days | Task 51 | 🔴 Not Created |
| 60 | **Create Express Option** | Express shipping option | Task 51 | 🔴 Not Created |
| 61 | **Create Delivery Range** | Min-max days range | Task 51 | 🔴 Not Created |
| 62 | **Create Estimated Date API** | GET delivery estimate | Task 61 | 🔴 Not Created |
| 63 | **Create Dispatch Delay** | Processing time | Task 51 | 🔴 Not Created |
| 64 | **Verify Delivery Estimation** | Test estimates | Task 63 | 🔴 Not Created |

---

### Group E: Zone APIs & Admin (Tasks 65-78)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 65 | **Create Province API** | GET /api/locations/provinces/ | Task 64 | 🔴 Not Created |
| 66 | **Create District API** | GET /api/locations/districts/ | Task 65 | 🔴 Not Created |
| 67 | **Create City API** | GET /api/locations/cities/ | Task 66 | 🔴 Not Created |
| 68 | **Create Shipping Rate API** | GET /api/shipping/rates/ | Task 67 | 🔴 Not Created |
| 69 | **Create Rate Calculation API** | POST /api/shipping/calculate/ | Task 68 | 🔴 Not Created |
| 70 | **Create Delivery Estimate API** | GET /api/shipping/estimate/ | Task 69 | 🔴 Not Created |
| 71 | **Create Province Admin** | Django admin for provinces | Task 64 | 🔴 Not Created |
| 72 | **Create District Admin** | Django admin for districts | Task 71 | 🔴 Not Created |
| 73 | **Create City Admin** | Django admin for cities | Task 72 | 🔴 Not Created |
| 74 | **Create Zone Admin** | Django admin for zones | Task 73 | 🔴 Not Created |
| 75 | **Create Zone District Inline** | Districts in zone admin | Task 74 | 🔴 Not Created |
| 76 | **Create Rate Admin** | Django admin for rates | Task 74 | 🔴 Not Created |
| 77 | **Create Rate Zone Inline** | Rates in zone admin | Task 76 | 🔴 Not Created |
| 78 | **Verify APIs & Admin** | Test all APIs | Task 77 | 🔴 Not Created |

---

### Group F: Frontend & Testing (Tasks 79-92)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 79 | **Create Location Types** | TypeScript interfaces | Task 78 | 🔴 Not Created |
| 80 | **Create Shipping Types** | Shipping TypeScript types | Task 79 | 🔴 Not Created |
| 81 | **Create Location API Client** | Frontend location API | Task 80 | 🔴 Not Created |
| 82 | **Create Shipping API Client** | Frontend shipping API | Task 80 | 🔴 Not Created |
| 83 | **Create Province Dropdown** | Province select component | Task 81 | 🔴 Not Created |
| 84 | **Create District Dropdown** | District select (filtered) | Task 83 | 🔴 Not Created |
| 85 | **Create City Dropdown** | City select (filtered) | Task 84 | 🔴 Not Created |
| 86 | **Create Address Form** | Full address form | Task 85 | 🔴 Not Created |
| 87 | **Create Shipping Options** | Display shipping options | Task 82 | 🔴 Not Created |
| 88 | **Create Delivery Estimate** | Show delivery estimate | Task 87 | 🔴 Not Created |
| 89 | **Create Free Shipping Bar** | Progress to free shipping | Task 87 | 🔴 Not Created |
| 90 | **Create Zone Detection Hook** | useZoneDetection hook | Task 82 | 🔴 Not Created |
| 91 | **Create Integration Tests** | Test shipping flow | Task 78 | 🔴 Not Created |
| 92 | **Create Documentation** | Shipping zone docs | Task 91 | 🔴 Not Created |

---

## Expected Final Structure

```
backend/
└── apps/
    └── locations/
        ├── __init__.py
        ├── admin.py                          # Location admin (Task 71)
        ├── apps.py
        ├── models/
        │   ├── __init__.py
        │   ├── province.py                   # Province model (Task 01)
        │   ├── district.py                   # District model (Task 04)
        │   └── city.py                       # City model (Task 08)
        ├── api/
        │   ├── serializers.py
        │   ├── views.py                      # Location APIs (Task 65)
        │   └── urls.py
        └── fixtures/
            ├── provinces.json                # Province seed (Task 13)
            ├── districts.json                # District seed (Task 14)
            └── cities.json                   # City seed (Task 15)
└── apps/
    └── shipping/
        ├── __init__.py
        ├── admin.py                          # Shipping admin (Task 74)
        ├── apps.py
        ├── models/
        │   ├── __init__.py
        │   ├── zone.py                       # ShippingZone (Task 19)
        │   └── rate.py                       # ShippingRate (Task 35)
        ├── services/
        │   ├── rate_calculator.py            # RateCalculator (Task 42)
        │   └── delivery_estimator.py         # DeliveryEstimator (Task 51)
        ├── api/
        │   ├── serializers.py
        │   ├── views.py                      # Shipping APIs (Task 68)
        │   └── urls.py
        └── data/
            └── holidays.py                   # Sri Lanka holidays (Task 54)

frontend/
└── lib/
    └── shipping/
        ├── types.ts                          # Types (Task 79)
        ├── location-client.ts                # Location API (Task 81)
        └── shipping-client.ts                # Shipping API (Task 82)
└── components/
    └── checkout/
        ├── ProvinceDropdown.tsx              # Province (Task 83)
        ├── DistrictDropdown.tsx              # District (Task 84)
        ├── CityDropdown.tsx                  # City (Task 85)
        ├── AddressForm.tsx                   # Full form (Task 86)
        ├── ShippingOptions.tsx               # Options (Task 87)
        ├── DeliveryEstimate.tsx              # Estimate (Task 88)
        └── FreeShippingBar.tsx               # Progress (Task 89)
```

---

## Progress Tracking

| Group | Name | Tasks | Completed | Progress |
|-------|------|-------|-----------|----------|
| A | Location Data Models | 18 | 0 | 0% |
| B | Shipping Zone Models | 16 | 0 | 0% |
| C | Rate Calculation | 16 | 0 | 0% |
| D | Delivery Estimation | 14 | 0 | 0% |
| E | Zone APIs & Admin | 14 | 0 | 0% |
| F | Frontend & Testing | 14 | 0 | 0% |
| **Total** | | **92** | **0** | **0%** |

---

## Sri Lanka Provinces Reference

| Code | Province (English) | Province (Sinhala) |
|------|-------------------|-------------------|
| WP | Western | බස්නාහිර |
| CP | Central | මධ්‍යම |
| SP | Southern | දකුණු |
| NP | Northern | උතුරු |
| EP | Eastern | නැගෙනහිර |
| NW | North Western | වයඹ |
| NC | North Central | උතුරු මැද |
| UVA | Uva | ඌව |
| SAB | Sabaragamuwa | සබරගමුව |

---

## Notes for AI Agents

1. **Execute tasks in order** - Follow Group A → F sequence
2. **Seed data required** - All 25 districts must be seeded
3. **Poya days** - Handle monthly poya holidays
4. **Cascading dropdowns** - Province → District → City
5. **Weight-based rates** - Calculate per kg after base
6. **Free shipping** - Check threshold per zone
7. **Same-day delivery** - Only Colombo Metro
8. **Business days** - Skip weekends and holidays
9. **Bilingual** - Support Sinhala/English names
