# Group C: Waybill Generation

> **Phase:** 09 - Integrations & Sri Lanka Localizations  
> **SubPhase:** 08 - Koombiyo Courier API  
> **Group:** C of F  
> **Tasks Covered:** 35-50  
> **Group Goal:** Implement waybill generation with PDF label creation and storage

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group-B_API-Client-Implementation](../Group-B_API-Client-Implementation/)
- **→ Next Group:** [Group-D_Tracking-Webhooks](../Group-D_Tracking-Webhooks/)

---

## Group Overview

This group implements waybill generation. Creates Waybill model with order foreign key, waybill number, barcode, status, and PDF URL fields. Creates create_waybill API call to Koombiyo with sender data, receiver data, package data (weight, dimensions), COD data if applicable, and items description. Creates waybill response parser. Creates label download to retrieve PDF. Creates local label storage for PDF files. Verifies waybill generation.

### Key Outcomes

- Waybill model
- Order foreign key
- Waybill number field
- Barcode field
- Status field
- PDF URL field
- create_waybill API
- Sender data builder
- Receiver data builder
- Package data builder
- COD data builder
- Items description
- Waybill response parser
- Label download
- Local label storage
- Waybill generation verified

### Technology Context

- **Waybill:** Unique shipment identifier
- **PDF:** Label for printing
- **Barcode:** Scannable tracking
- **Storage:** S3 or local

---

## Documents in This Group

| # | Document | Description | Tasks Covered |
|---|----------|-------------|---------------|
| 01 | `01_Tasks-35-43_Model-API.md` | Create model and API call | 35-43 |
| 02 | `02_Tasks-44-50_Payload-PDF-Verify.md` | Create payload and PDF handling | 44-50 |

---

## Task Summary

| Task # | Task Name | Complexity | Dependencies |
|--------|-----------|------------|--------------|
| 35 | Create Waybill Model | Medium | Task 34 |
| 36 | Create Order FK | Low | Task 35 |
| 37 | Create Waybill Number | Low | Task 35 |
| 38 | Create Barcode Field | Low | Task 35 |
| 39 | Create Status Field | Low | Task 35 |
| 40 | Create PDF URL Field | Low | Task 35 |
| 41 | Create create_waybill API | High | Task 35 |
| 42 | Create Sender Data | Medium | Task 41 |
| 43 | Create Receiver Data | Medium | Task 41 |
| 44 | Create Package Data | Low | Task 41 |
| 45 | Create COD Data | Low | Task 41 |
| 46 | Create Items Description | Low | Task 41 |
| 47 | Create Waybill Response | Medium | Task 41 |
| 48 | Create Label Download | Medium | Task 47 |
| 49 | Create Local Label Storage | Medium | Task 48 |
| 50 | Verify Waybill Generation | Low | Task 49 |

---

## Execution Order

```
Task 35: Waybill Model
    │
    ├────────┬────────┬────────┬────────┬────────┐
    ▼        ▼        ▼        ▼        ▼        ▼
T-36     T-37     T-38     T-39     T-40     T-41
(Order) (WayNo)(Barcode)(Status)(PDF) (API)
    │        │        │        │        │        │
    │        │        │        │        │   ┌────┼────┬────────┬────────┬────────┐
    │        │        │        │        │   ▼    ▼    ▼        ▼        ▼        ▼
    │        │        │        │        │ T-42  T-43  T-44    T-45    T-46    T-47
    │        │        │        │        │(Send)(Recv)(Pack)  (COD) (Items)(Resp)
    │        │        │        │        │   │    │    │        │        │        │
    └────────┴────────┴────────┴────────┴───┴────┴────┴────────┴────────┴────────┘
                                                            │
                                                            ▼
                                                      Task 48: Label Download
                                                            │
                                                            ▼
                                                      Task 49: Local Storage
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
        │   └── waybill.py
        └── services/
            └── waybill_service.py
```

---

## Notes for AI Agents

### Waybill Model (Task 35)
| Field | Type |
|-------|------|
| order | ForeignKey |
| waybill_number | CharField |
| barcode | CharField |
| status | CharField (choices) |
| pdf_url | URLField |

### Order FK (Task 36)
| Field | Type |
|-------|------|
| Name | order |
| Related | Order model |
| On delete | PROTECT |

### Waybill Number (Task 37)
| Field | Type |
|-------|------|
| Name | waybill_number |
| Source | Koombiyo API |
| Unique | Yes |

### Barcode Field (Task 38)
| Field | Type |
|-------|------|
| Name | barcode |
| Format | Koombiyo barcode |

### Status Field (Task 39)
| Status | Code |
|--------|------|
| PENDING | 1 |
| PICKED_UP | 2 |
| IN_TRANSIT | 3 |
| OUT_FOR_DELIVERY | 4 |
| DELIVERED | 5 |
| FAILED | 6 |
| RETURNED | 7 |

### PDF URL Field (Task 40)
| Field | Type |
|-------|------|
| Name | pdf_url |
| Use | Link to label PDF |

### create_waybill API (Task 41)
| Endpoint | POST /waybill/create |
|----------|----------------------|
| Auth | API key headers |
| Return | Waybill number, PDF URL |

### Sender Data (Task 42)
| Field | Source |
|-------|--------|
| name | Tenant config |
| address | Pickup address |
| city | Pickup city |
| phone | Contact phone |

### Receiver Data (Task 43)
| Field | Source |
|-------|--------|
| name | Order shipping name |
| address | Order shipping address |
| city | Order shipping city |
| phone | Customer phone |

### Package Data (Task 44)
| Field | Source |
|-------|--------|
| weight | Calculated or default |
| length | Optional |
| width | Optional |
| height | Optional |

### COD Data (Task 45)
| Field | Source |
|-------|--------|
| cod_amount | Order total (if COD) |
| cod_fee | COD fee |
| Include | Only if COD payment |

### Items Description (Task 46)
| Field | Source |
|-------|--------|
| description | Order items list |
| Format | "Item 1, Item 2, ..." |

### Waybill Response (Task 47)
| Field | Value |
|-------|-------|
| waybill_number | Koombiyo tracking |
| barcode | Barcode value |
| pdf_url | Label PDF URL |

### Label Download (Task 48)
| Action | Download PDF |
|--------|--------------|
| URL | From response |
| Timeout | 30 seconds |

### Local Label Storage (Task 49)
| Storage | S3 or local |
|---------|-------------|
| Path | waybills/{tenant}/{order}/ |
| Format | {waybill_number}.pdf |
