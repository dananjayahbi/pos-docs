# Group A: COD Configuration

> **Phase:** 09 - Integrations & Sri Lanka Localizations  
> **SubPhase:** 06 - Cash on Delivery (COD)  
> **Group:** A of F  
> **Tasks Covered:** 01-16  
> **Group Goal:** Set up COD configuration for tenant-specific COD payment settings

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** None (First Group)
- **→ Next Group:** [Group-B_COD-Processor-Implementation](../Group-B_COD-Processor-Implementation/)

---

## Group Overview

This group sets up COD configuration. Creates CODConfig model with is_enabled toggle, fee type (flat/percentage), fee amount, minimum and maximum order amounts. Creates OTP required field for verification. Creates first order limit for new customers. Creates CODZones model for zone-based availability with district links. Creates zone COD available toggle and zone-specific maximum order. Creates Django admin for COD and zone configuration. Creates default COD settings. Verifies configuration.

### Key Outcomes

- CODConfig model
- Is enabled field
- COD fee type (flat/percentage)
- COD fee amount
- Minimum order amount
- Maximum order amount
- OTP required field
- First order limit
- CODZones model
- Zone district link
- Zone COD available
- Zone-specific max order
- COD config admin
- Zone config admin
- Default COD settings
- Configuration verified

### Technology Context

- **Fee types:** Flat amount or percentage
- **Zones:** District-based availability
- **OTP:** Optional verification
- **Limits:** New customer restrictions

---

## Documents in This Group

| # | Document | Description | Tasks Covered |
|---|----------|-------------|---------------|
| 01 | `01_Tasks-01-08_Config-Fields.md` | Create model and config fields | 01-08 |
| 02 | `02_Tasks-09-16_Zones-Admin-Verify.md` | Create zones and admin | 09-16 |

---

## Task Summary

| Task # | Task Name | Complexity | Dependencies |
|--------|-----------|------------|--------------|
| 01 | Create CODConfig Model | Medium | SubPhase-01 |
| 02 | Create Is Enabled Field | Low | Task 01 |
| 03 | Create COD Fee Type | Low | Task 01 |
| 04 | Create COD Fee Amount | Low | Task 03 |
| 05 | Create Minimum Order | Low | Task 01 |
| 06 | Create Maximum Order | Low | Task 01 |
| 07 | Create OTP Required Field | Low | Task 01 |
| 08 | Create First Order Limit | Low | Task 01 |
| 09 | Create COD Zones Model | Medium | Task 01 |
| 10 | Create Zone District Link | Low | Task 09 |
| 11 | Create Zone COD Available | Low | Task 09 |
| 12 | Create Zone COD Max | Low | Task 09 |
| 13 | Create COD Config Admin | Medium | Task 01 |
| 14 | Create Zone Config Admin | Medium | Task 09 |
| 15 | Create Default COD Settings | Low | Task 01 |
| 16 | Verify COD Configuration | Low | Task 15 |

---

## Execution Order

```
Task 01: CODConfig Model
    │
    ├────────┬────────┬────────┬────────┬────────┬────────┬────────┐
    ▼        ▼        ▼        ▼        ▼        ▼        ▼        ▼
T-02     T-03     T-05     T-06     T-07     T-08     T-09    T-13
(Enabled)(FeeType)(Min)  (Max)   (OTP) (1stLim)(Zones)(Admin)
    │        │        │        │        │        │        │        │
    │        ▼        │        │        │        │        │        │
    │      T-04     │        │        │        │   ┌────┼────┬────┘
    │    (FeeAmt)   │        │        │        │   ▼    ▼    ▼
    │        │        │        │        │        │ T-10  T-11  T-12
    │        │        │        │        │        │(Dist)(Avail)(Max)
    │        │        │        │        │        │   │    │    │
    │        │        │        │        │        │   │    │    ▼
    │        │        │        │        │        │   │    │  T-14
    │        │        │        │        │        │   │    │(ZnAdmin)
    │        │        │        │        │        │   │    │    │
    └────────┴────────┴────────┴────────┴────────┴───┴────┴────┘
                              │
                              ▼
                        Task 15: Default Settings
                              │
                              ▼
                        Task 16: Verify
```

---

## Expected Deliverables

```
backend/
└── apps/
    └── payments/
        ├── models/
        │   ├── cod_config.py
        │   └── cod_zones.py
        └── admin/
            └── cod_admin.py
```

---

## Notes for AI Agents

### CODConfig Model (Task 01)
| Field | Type |
|-------|------|
| tenant | ForeignKey |
| is_enabled | BooleanField |
| fee_type | CharField (choices) |
| fee_amount | DecimalField |
| min_order | DecimalField |
| max_order | DecimalField |

### Is Enabled Field (Task 02)
| Field | Type |
|-------|------|
| Name | is_enabled |
| Default | True |
| Use | Enable/disable COD |

### COD Fee Type (Task 03)
| Choices | Value |
|---------|-------|
| FLAT | Flat amount |
| PERCENTAGE | Percentage |
| Default | FLAT |

### COD Fee Amount (Task 04)
| Field | Value |
|-------|-------|
| Name | fee_amount |
| Default | 100.00 (LKR) |
| Use | Fee for COD orders |

### Minimum Order (Task 05)
| Field | Value |
|-------|-------|
| Name | min_order |
| Default | 500.00 (LKR) |
| Use | Minimum order for COD |

### Maximum Order (Task 06)
| Field | Value |
|-------|-------|
| Name | max_order |
| Default | 50000.00 (LKR) |
| Use | Maximum order for COD |

### OTP Required Field (Task 07)
| Field | Type |
|-------|------|
| Name | otp_required |
| Default | True |
| Use | Require OTP for COD |

### First Order Limit (Task 08)
| Field | Value |
|-------|-------|
| Name | first_order_limit |
| Default | 10000.00 (LKR) |
| Use | Lower limit for new customers |

### CODZones Model (Task 09)
| Field | Type |
|-------|------|
| tenant | ForeignKey |
| district | ForeignKey |
| is_cod_available | BooleanField |
| max_order_amount | DecimalField |

### Zone District Link (Task 10)
| Field | Type |
|-------|------|
| Name | district |
| Link | Sri Lanka districts |
| Use | Zone-based settings |

### Zone COD Available (Task 11)
| Field | Type |
|-------|------|
| Name | is_cod_available |
| Default | True |
| Use | Enable COD in zone |

### Zone COD Max (Task 12)
| Field | Type |
|-------|------|
| Name | max_order_amount |
| Override | Zone-specific max |
| Null | Use default max |

### Default COD Settings (Task 15)
| Setting | Value |
|---------|-------|
| COD fee | ₨100 flat |
| Min order | ₨500 |
| Max order | ₨50,000 |
| First order max | ₨10,000 |
| OTP required | Yes |
