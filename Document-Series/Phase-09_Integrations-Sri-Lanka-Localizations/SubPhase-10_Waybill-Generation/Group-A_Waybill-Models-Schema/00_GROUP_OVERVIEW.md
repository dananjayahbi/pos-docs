# Group A: Waybill Models & Schema

> **Phase:** 09 - Integrations & Sri Lanka Localizations  
> **SubPhase:** 10 - Waybill Generation  
> **Group:** A of F  
> **Tasks Covered:** 01-16  
> **Group Goal:** Create waybill and template data models with all required fields

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** None (First Group)
- **→ Next Group:** [Group-B_PDF-Generation-Engine](../Group-B_PDF-Generation-Engine/)

---

## Group Overview

This group creates waybill models. Creates Waybill model with waybill_number unique field, order and shipment foreign keys, courier_type enum field, status field, generated_at timestamp, pdf_file FileField, barcode_data and qr_data fields, sender_address and recipient_address JSON fields. Creates WaybillTemplate model for custom templates with template_name identifier, template_html field for HTML content. Generates migrations for all models.

### Key Outcomes

- Waybill model
- waybill_number field
- order FK
- shipment FK
- courier_type field
- status field
- generated_at field
- pdf_file field
- barcode_data field
- qr_data field
- sender_address field
- recipient_address field
- WaybillTemplate model
- template_name field
- template_html field
- Waybill migrations

### Technology Context

- **Model:** Django ORM
- **Storage:** S3 for PDFs
- **JSON:** Address fields
- **Templates:** Per-tenant customization

---

## Documents in This Group

| # | Document | Description | Tasks Covered |
|---|----------|-------------|---------------|
| 01 | `01_Tasks-01-08_Waybill-Core-Fields.md` | Create waybill model core fields | 01-08 |
| 02 | `02_Tasks-09-16_Address-Template-Migration.md` | Create address and template | 09-16 |

---

## Task Summary

| Task # | Task Name | Complexity | Dependencies |
|--------|-----------|------------|--------------|
| 01 | Create Waybill Model | Medium | SubPhase-09 |
| 02 | Create waybill_number Field | Low | Task 01 |
| 03 | Create order FK | Low | Task 01 |
| 04 | Create shipment FK | Low | Task 01 |
| 05 | Create courier_type Field | Low | Task 01 |
| 06 | Create status Field | Low | Task 01 |
| 07 | Create generated_at Field | Low | Task 01 |
| 08 | Create pdf_file Field | Low | Task 01 |
| 09 | Create barcode_data Field | Low | Task 01 |
| 10 | Create qr_data Field | Low | Task 01 |
| 11 | Create sender_address Field | Low | Task 01 |
| 12 | Create recipient_address Field | Low | Task 01 |
| 13 | Create WaybillTemplate Model | Medium | Task 01 |
| 14 | Create template_name Field | Low | Task 13 |
| 15 | Create template_html Field | Low | Task 13 |
| 16 | Create Waybill Migrations | Low | Task 15 |

---

## Execution Order

```
Task 01: Waybill Model
    │
    ├───┬───┬───┬───┬───┬───┬───┬───┬───┬───┬───┐
    ▼   ▼   ▼   ▼   ▼   ▼   ▼   ▼   ▼   ▼   ▼   ▼
  T-02 T-03 T-04 T-05 T-06 T-07 T-08 T-09 T-10 T-11 T-12
(Num)(Ord)(Ship)(Cour)(Stat)(Gen)(PDF)(Bar)(QR)(Send)(Recv)
    │   │   │   │   │   │   │   │   │   │   │
    └───┴───┴───┴───┴───┴───┴───┴───┴───┴───┘
                        │
                        ▼
               Task 13: WaybillTemplate
                        │
                   ┌────┴────┐
                   ▼         ▼
                T-14      T-15
              (Name)    (HTML)
                   │         │
                   └────┬────┘
                        │
                        ▼
               Task 16: Migrations
```

---

## Expected Deliverables

```
backend/
└── apps/
    └── shipping/
        └── models/
            ├── waybill.py
            └── waybill_template.py
```

---

## Notes for AI Agents

### Waybill Model (Task 01)
| Class | Waybill |
|-------|---------|
| App | shipping |
| Purpose | Store waybill data |

### waybill_number Field (Task 02)
| Field | Type |
|-------|------|
| Name | waybill_number |
| Type | CharField(max_length=50) |
| Unique | Yes |
| Index | Yes |

### order FK (Task 03)
| Field | Type |
|-------|------|
| Name | order |
| Related | Order model |
| On delete | PROTECT |

### shipment FK (Task 04)
| Field | Type |
|-------|------|
| Name | shipment |
| Related | Shipment model |
| On delete | CASCADE |
| Nullable | Yes |

### courier_type Field (Task 05)
| Field | Type |
|-------|------|
| Name | courier_type |
| Type | CharField(choices) |
| Options | koombiyo, domex, promptx, royal_express, trance_express |

### status Field (Task 06)
| Status | Description |
|--------|-------------|
| PENDING | Not yet generated |
| GENERATED | PDF created |
| PRINTED | Label printed |
| SHIPPED | Package shipped |

### generated_at Field (Task 07)
| Field | Type |
|-------|------|
| Name | generated_at |
| Type | DateTimeField |
| Auto | On generation |

### pdf_file Field (Task 08)
| Field | Type |
|-------|------|
| Name | pdf_file |
| Type | FileField |
| Upload | waybills/{tenant}/{order}/ |

### barcode_data Field (Task 09)
| Field | Type |
|-------|------|
| Name | barcode_data |
| Type | CharField(max_length=100) |
| Use | Encoded barcode value |

### qr_data Field (Task 10)
| Field | Type |
|-------|------|
| Name | qr_data |
| Type | TextField |
| Use | QR tracking URL |

### sender_address Field (Task 11)
| Field | Type |
|-------|------|
| Name | sender_address |
| Type | JSONField |
| Contains | name, address, city, phone |

### recipient_address Field (Task 12)
| Field | Type |
|-------|------|
| Name | recipient_address |
| Type | JSONField |
| Contains | name, address, city, phone |

### WaybillTemplate Model (Task 13)
| Class | WaybillTemplate |
|-------|-----------------|
| Purpose | Custom label templates |
| Per-tenant | Yes |

### template_name Field (Task 14)
| Field | Type |
|-------|------|
| Name | template_name |
| Type | CharField(max_length=100) |
| Unique | Per tenant |

### template_html Field (Task 15)
| Field | Type |
|-------|------|
| Name | template_html |
| Type | TextField |
| Use | Jinja2 HTML template |
