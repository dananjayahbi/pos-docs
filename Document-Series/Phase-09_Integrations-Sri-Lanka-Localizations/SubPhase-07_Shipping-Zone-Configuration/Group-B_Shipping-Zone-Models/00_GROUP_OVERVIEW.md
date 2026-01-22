# Group B: Shipping Zone Models

> **Phase:** 09 - Integrations & Sri Lanka Localizations  
> **SubPhase:** 07 - Shipping Zone Configuration  
> **Group:** B of F  
> **Tasks Covered:** 19-34  
> **Group Goal:** Create shipping zone models with district associations and zone types

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group-A_Location-Data-Models](../Group-A_Location-Data-Models/)
- **→ Next Group:** [Group-C_Rate-Calculation](../Group-C_Rate-Calculation/)

---

## Group Overview

This group creates shipping zone models. Creates ShippingZone model with zone name, zone code, and zone type choices (metro/province/remote). Creates zone districts many-to-many relationship and optional city-level association. Creates delivery days field for expected delivery time. Creates is_COD_available field and is_active toggle. Creates display order for sorting. Creates default zones including Colombo Metro (CMB, GMP, KLT), Western Province zone, Other Provinces zone, and Remote Areas zone. Verifies shipping zone configuration.

### Key Outcomes

- ShippingZone model
- Zone name field
- Zone code field
- Zone type choices
- Zone districts M2M
- Zone cities M2M
- Delivery days field
- Is COD available
- Is active field
- Display order field
- Default zones
- Colombo Metro zone
- Western Province zone
- Other Provinces zone
- Remote Areas zone
- Shipping zones verified

### Technology Context

- **Zone types:** Metro, Province, Remote
- **COD:** Per-zone availability
- **Districts:** Many-to-many link
- **Ordering:** Display order

---

## Documents in This Group

| # | Document | Description | Tasks Covered |
|---|----------|-------------|---------------|
| 01 | `01_Tasks-19-28_Zone-Model-Fields.md` | Create zone model and fields | 19-28 |
| 02 | `02_Tasks-29-34_Default-Zones-Verify.md` | Create default zones and verify | 29-34 |

---

## Task Summary

| Task # | Task Name | Complexity | Dependencies |
|--------|-----------|------------|--------------|
| 19 | Create ShippingZone Model | Medium | Task 18 |
| 20 | Create Zone Name Field | Low | Task 19 |
| 21 | Create Zone Code Field | Low | Task 19 |
| 22 | Create Zone Type Choices | Low | Task 19 |
| 23 | Create Zone Districts M2M | Medium | Task 19 |
| 24 | Create Zone Cities M2M | Medium | Task 19 |
| 25 | Create Delivery Days Field | Low | Task 19 |
| 26 | Create Is COD Available | Low | Task 19 |
| 27 | Create Is Active Field | Low | Task 19 |
| 28 | Create Display Order Field | Low | Task 19 |
| 29 | Create Default Zones | Medium | Task 19 |
| 30 | Create Colombo Metro Zone | Medium | Task 29 |
| 31 | Create Western Province Zone | Low | Task 29 |
| 32 | Create Other Provinces Zone | Low | Task 29 |
| 33 | Create Remote Areas Zone | Low | Task 29 |
| 34 | Verify Shipping Zones | Low | Task 33 |

---

## Execution Order

```
Task 19: ShippingZone Model
    │
    ├────────┬────────┬────────┬────────┬────────┬────────┬────────┬────────┬────────┐
    ▼        ▼        ▼        ▼        ▼        ▼        ▼        ▼        ▼        ▼
T-20     T-21     T-22     T-23     T-24     T-25     T-26     T-27     T-28     T-29
(Name)  (Code)  (Type) (Dist)  (City) (Days)  (COD) (Active)(Order)(Default)
    │        │        │        │        │        │        │        │        │        │
    │        │        │        │        │        │        │        │        │   ┌────┼────┬────────┬────────┐
    │        │        │        │        │        │        │        │        │   ▼    ▼    ▼        ▼
    │        │        │        │        │        │        │        │        │ T-30  T-31  T-32    T-33
    │        │        │        │        │        │        │        │        │(CMB) (West)(Other)(Remote)
    │        │        │        │        │        │        │        │        │   │    │    │        │
    └────────┴────────┴────────┴────────┴────────┴────────┴────────┴────────┴───┴────┴────┴────────┘
                                                            │
                                                            ▼
                                                      Task 34: Verify
```

---

## Expected Deliverables

```
backend/
└── apps/
    └── shipping/
        ├── models/
        │   └── zone.py
        └── fixtures/
            └── default_zones.json
```

---

## Notes for AI Agents

### ShippingZone Model (Task 19)
| Field | Type |
|-------|------|
| tenant | ForeignKey |
| name | CharField |
| code | CharField |
| zone_type | CharField (choices) |
| districts | ManyToManyField |

### Zone Name Field (Task 20)
| Field | Type |
|-------|------|
| Name | name |
| Max length | 100 |
| Examples | "Colombo Metro", "Western Province" |

### Zone Code Field (Task 21)
| Field | Type |
|-------|------|
| Name | code |
| Unique | Per tenant |
| Examples | CMB_METRO, WESTERN, REMOTE |

### Zone Type Choices (Task 22)
| Type | Description |
|------|-------------|
| METRO | Metropolitan (same day/next day) |
| PROVINCE | Province-wide (2-3 days) |
| REMOTE | Remote areas (4-7 days) |

### Zone Districts M2M (Task 23)
| Field | Type |
|-------|------|
| Name | districts |
| Related | District model |
| Use | Districts in zone |

### Zone Cities M2M (Task 24)
| Field | Type |
|-------|------|
| Name | cities |
| Related | City model |
| Use | Optional city-level |

### Delivery Days Field (Task 25)
| Field | Type |
|-------|------|
| Name | delivery_days |
| Type | IntegerField |
| Use | Expected delivery days |

### Is COD Available (Task 26)
| Field | Type |
|-------|------|
| Name | is_cod_available |
| Default | True |
| Use | COD in this zone |

### Is Active Field (Task 27)
| Field | Type |
|-------|------|
| Name | is_active |
| Default | True |
| Use | Zone active/inactive |

### Display Order Field (Task 28)
| Field | Type |
|-------|------|
| Name | display_order |
| Default | 0 |
| Use | Sort zones in checkout |

### Default Zones (Task 29)
| Zone | Districts |
|------|-----------|
| Colombo Metro | Colombo, Gampaha, Kalutara |
| Western Province | Rest of Western |
| Other Provinces | All other provinces |
| Remote Areas | Hard to reach |

### Colombo Metro Zone (Task 30)
| Setting | Value |
|---------|-------|
| Code | CMB_METRO |
| Type | METRO |
| Districts | Colombo, Gampaha, Kalutara |
| Delivery | 1 day |
| COD | Yes |

### Western Province Zone (Task 31)
| Setting | Value |
|---------|-------|
| Code | WESTERN |
| Type | PROVINCE |
| Delivery | 2-3 days |
| COD | Yes |

### Other Provinces Zone (Task 32)
| Setting | Value |
|---------|-------|
| Code | OTHER |
| Type | PROVINCE |
| Delivery | 3-5 days |
| COD | Yes |

### Remote Areas Zone (Task 33)
| Setting | Value |
|---------|-------|
| Code | REMOTE |
| Type | REMOTE |
| Delivery | 5-7 days |
| COD | Limited |
