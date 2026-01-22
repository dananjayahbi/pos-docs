# Group A: Location Data Models

> **Phase:** 09 - Integrations & Sri Lanka Localizations  
> **SubPhase:** 07 - Shipping Zone Configuration  
> **Group:** A of F  
> **Tasks Covered:** 01-18  
> **Group Goal:** Create Sri Lanka location data models with province, district, and city hierarchy

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** None (First Group)
- **→ Next Group:** [Group-B_Shipping-Zone-Models](../Group-B_Shipping-Zone-Models/)

---

## Group Overview

This group creates location data models for Sri Lanka. Creates Province model with Sinhala and English name fields and province code (WP, CP, SP, etc.). Creates District model with province foreign key, name fields, and district code. Creates City model with district foreign key, name field, postal code, and is_active toggle. Creates data seed commands for 9 provinces, 25 districts, major cities, and postal codes. Creates and runs migrations. Verifies seeded location data.

### Key Outcomes

- Province model
- Province name field (bilingual)
- Province code field
- District model
- District province FK
- District name field (bilingual)
- District code field
- City model
- City district FK
- City name field
- Postal code field
- Is active field
- Province data seed (9)
- District data seed (25)
- Major cities seed
- Postal codes seed
- Location migrations
- Location data verified

### Technology Context

- **Provinces:** 9 Sri Lanka provinces
- **Districts:** 25 districts
- **Bilingual:** Sinhala and English
- **Postal codes:** Sri Lanka format

---

## Documents in This Group

| # | Document | Description | Tasks Covered |
|---|----------|-------------|---------------|
| 01 | `01_Tasks-01-09_Province-District.md` | Create province and district models | 01-09 |
| 02 | `02_Tasks-10-18_City-Seed-Verify.md` | Create city model and seed data | 10-18 |

---

## Task Summary

| Task # | Task Name | Complexity | Dependencies |
|--------|-----------|------------|--------------|
| 01 | Create Province Model | Medium | SubPhase-01 |
| 02 | Create Province Name Field | Low | Task 01 |
| 03 | Create Province Code Field | Low | Task 01 |
| 04 | Create District Model | Medium | Task 01 |
| 05 | Create District Province FK | Low | Task 04 |
| 06 | Create District Name Field | Low | Task 04 |
| 07 | Create District Code Field | Low | Task 04 |
| 08 | Create City Model | Medium | Task 04 |
| 09 | Create City District FK | Low | Task 08 |
| 10 | Create City Name Field | Low | Task 08 |
| 11 | Create Postal Code Field | Low | Task 08 |
| 12 | Create Is Active Field | Low | Task 08 |
| 13 | Create Province Data Seed | Medium | Task 03 |
| 14 | Create District Data Seed | Medium | Task 07 |
| 15 | Create Major Cities Seed | Medium | Task 11 |
| 16 | Create Postal Codes Seed | Medium | Task 11 |
| 17 | Create Location Migrations | Low | Task 16 |
| 18 | Verify Location Data | Low | Task 17 |

---

## Execution Order

```
Task 01: Province Model
    │
    ├────────┬────────┐
    ▼        ▼        ▼
T-02     T-03     T-04
(Name)  (Code) (District)
    │        │        │
    │        │   ┌────┼────┬────────┐
    │        │   ▼    ▼    ▼        ▼
    │        │ T-05  T-06  T-07    T-08
    │        │ (FK) (Name)(Code) (City)
    │        │   │    │    │        │
    │        │   │    │    │   ┌────┼────┬────────┐
    │        │   │    │    │   ▼    ▼    ▼        ▼
    │        │   │    │    │ T-09  T-10  T-11    T-12
    │        │   │    │    │ (FK) (Name)(Post) (Active)
    │        │   │    │    │   │    │    │        │
    │        ▼   │    │    ▼   │    │    ├────────┘
    │      T-13  │    │  T-14  │    │    ▼
    │    (Prov)  │    │ (Dist) │    │  T-15     T-16
    │        │   │    │    │   │    │ (City)  (Postal)
    │        │   │    │    │   │    │    │        │
    └────────┴───┴────┴────┴───┴────┴────┴────────┘
                              │
                              ▼
                        Task 17: Migrations
                              │
                              ▼
                        Task 18: Verify
```

---

## Expected Deliverables

```
backend/
└── apps/
    └── locations/
        ├── models/
        │   ├── province.py
        │   ├── district.py
        │   └── city.py
        └── fixtures/
            ├── provinces.json
            ├── districts.json
            └── cities.json
```

---

## Notes for AI Agents

### Province Model (Task 01)
| Field | Type |
|-------|------|
| name_en | CharField |
| name_si | CharField |
| code | CharField |
| is_active | BooleanField |

### Province Name Field (Task 02)
| Field | Type |
|-------|------|
| name_en | English name |
| name_si | Sinhala name |
| Example | Western / බස්නාහිර |

### Province Code Field (Task 03)
| Code | Province |
|------|----------|
| WP | Western |
| CP | Central |
| SP | Southern |
| NP | Northern |
| EP | Eastern |
| NW | North Western |
| NC | North Central |
| UVA | Uva |
| SAB | Sabaragamuwa |

### District Model (Task 04)
| Field | Type |
|-------|------|
| province | ForeignKey |
| name_en | CharField |
| name_si | CharField |
| code | CharField |

### District Province FK (Task 05)
| Field | Type |
|-------|------|
| Name | province |
| Related | Province model |
| On delete | PROTECT |

### District Name Field (Task 06)
| Field | Type |
|-------|------|
| name_en | English name |
| name_si | Sinhala name |
| Example | Colombo / කොළඹ |

### District Code Field (Task 07)
| Examples | Value |
|----------|-------|
| CMB | Colombo |
| GMP | Gampaha |
| KLT | Kalutara |
| KDY | Kandy |
| GLE | Galle |

### City Model (Task 08)
| Field | Type |
|-------|------|
| district | ForeignKey |
| name | CharField |
| postal_code | CharField |
| is_active | BooleanField |

### City District FK (Task 09)
| Field | Type |
|-------|------|
| Name | district |
| Related | District model |
| On delete | PROTECT |

### Postal Code Field (Task 11)
| Format | 5 digits |
|--------|----------|
| Range | 00100-96000 |
| Example | 00700 (Colombo 7) |

### Province Data Seed (Task 13)
| Count | 9 provinces |
|-------|-------------|
| Format | JSON fixture |
| Include | Code, names (en/si) |

### District Data Seed (Task 14)
| Count | 25 districts |
|-------|--------------|
| Format | JSON fixture |
| Include | Province FK, names, code |

### Major Cities Seed (Task 15)
| Priority | Major cities first |
|----------|-------------------|
| Include | Colombo, Kandy, Galle, etc. |
