# Group D: Label Templates

> **Phase:** 09 - Integrations & Sri Lanka Localizations  
> **SubPhase:** 10 - Waybill Generation  
> **Group:** D of F  
> **Tasks Covered:** 51-66  
> **Group Goal:** Create HTML label templates for all couriers and formats

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group-C_Barcode-QR-Generation](../Group-C_Barcode-QR-Generation/)
- **→ Next Group:** [Group-E_Batch-Printing-Archive](../Group-E_Batch-Printing-Archive/)

---

## Group Overview

This group creates label templates. Creates Jinja2 template engine for HTML templates. Creates base label template with common structure. Creates courier-specific templates for Koombiyo, Domex, PromptX, Royal Express, and Trance Express. Creates thermal 4x6 template and A4 template with packing slip. Creates template sections for packing slip items, address (sender/recipient), COD amount display, and delivery instructions. Creates custom template UI for admin editing. Creates template preview functionality. Verifies all templates.

### Key Outcomes

- Template engine
- Base template
- Koombiyo template
- Domex template
- PromptX template
- RoyalExpress template
- TranceExpress template
- Thermal template
- A4 template
- Packing slip section
- Address section
- COD section
- Instructions section
- Custom template UI
- Template preview
- Templates verified

### Technology Context

- **Template:** Jinja2 engine
- **Format:** HTML with CSS
- **Courier:** Specific layouts
- **Print:** Optimized for printing

---

## Documents in This Group

| # | Document | Description | Tasks Covered |
|---|----------|-------------|---------------|
| 01 | `01_Tasks-51-58_Courier-Templates.md` | Create courier templates | 51-58 |
| 02 | `02_Tasks-59-66_Sections-Custom-Verify.md` | Create sections and custom | 59-66 |

---

## Task Summary

| Task # | Task Name | Complexity | Dependencies |
|--------|-----------|------------|--------------|
| 51 | Create Template Engine | Medium | Task 50 |
| 52 | Create Base Template | Medium | Task 51 |
| 53 | Create Koombiyo Template | Medium | Task 52 |
| 54 | Create Domex Template | Medium | Task 52 |
| 55 | Create PromptX Template | Medium | Task 52 |
| 56 | Create RoyalExpress Template | Medium | Task 52 |
| 57 | Create TranceExpress Template | Medium | Task 52 |
| 58 | Create Thermal Template | Medium | Task 52 |
| 59 | Create A4 Template | Medium | Task 52 |
| 60 | Create Packing Slip Section | Low | Task 59 |
| 61 | Create Address Section | Low | Task 52 |
| 62 | Create COD Section | Low | Task 52 |
| 63 | Create Instructions Section | Low | Task 52 |
| 64 | Create Custom Template UI | Medium | Task 52 |
| 65 | Create Template Preview | Medium | Task 64 |
| 66 | Verify Templates | Low | Task 65 |

---

## Execution Order

```
Task 51: Template Engine
    │
    ▼
Task 52: Base Template
    │
    ├───────┬───────┬───────┬───────┬───────┬───────┬───────┐
    ▼       ▼       ▼       ▼       ▼       ▼       ▼       ▼
T-53    T-54    T-55    T-56    T-57    T-58    T-59    T-61
(Koom) (Dom)  (Prmt) (Royal)(Tran)(Therm) (A4)  (Addr)
    │       │       │       │       │       │       │       │
    │       │       │       │       │       │       ▼       │
    │       │       │       │       │       │    T-60      │
    │       │       │       │       │       │   (Pack)     │
    │       │       │       │       │       │       │       │
    │       │       │       │       │       │       │       │
    └───────┴───────┴───────┴───────┴───────┴───────┴───────┤
                                                            │
                         ┌──────────────────────────────────┤
                         ▼                                  ▼
                      T-62                              T-63
                     (COD)                            (Instr)
                         │                                  │
                         └──────────────────────────────────┘
                                        │
                                        ▼
                               Task 64: Custom Template UI
                                        │
                                        ▼
                               Task 65: Template Preview
                                        │
                                        ▼
                               Task 66: Verify
```

---

## Expected Deliverables

```
backend/
└── apps/
    └── shipping/
        └── generators/
            └── templates/
                ├── engine.py
                ├── base.html
                ├── koombiyo.html
                ├── domex.html
                ├── promptx.html
                ├── royal_express.html
                ├── trance_express.html
                ├── thermal.html
                └── a4_with_slip.html
```

---

## Notes for AI Agents

### Template Engine (Task 51)
| Engine | Jinja2 |
|--------|--------|
| Filters | Custom date, currency filters |
| Globals | Company info, courier logos |

### Base Template (Task 52)
| Content | Value |
|---------|-------|
| Header | Logo, waybill number |
| Body | Content block |
| Footer | Barcode, info |

### Koombiyo Template (Task 53)
| Layout | Koombiyo-specific |
|--------|-------------------|
| Logo | Koombiyo logo |
| Color | Brand colors |

### Domex Template (Task 54)
| Layout | Domex-specific |
|--------|----------------|
| Logo | Domex logo |
| Color | Brand colors |

### PromptX Template (Task 55)
| Layout | PromptX-specific |
|--------|------------------|
| Logo | PromptX logo |
| Feature | Same-day badge |

### RoyalExpress Template (Task 56)
| Layout | RoyalExpress-specific |
|--------|----------------------|
| Logo | Royal Express logo |

### TranceExpress Template (Task 57)
| Layout | TranceExpress-specific |
|--------|-----------------------|
| Logo | Trance Express logo |
| Feature | Express badge |

### Thermal Template (Task 58)
| Size | 4x6 inch (100x150mm) |
|------|----------------------|
| Layout | Compact, no packing slip |
| Print | Direct thermal |

### A4 Template (Task 59)
| Size | A4 (210x297mm) |
|------|----------------|
| Layout | With packing slip |
| Print | Standard printer |

### Packing Slip Section (Task 60)
| Content | Value |
|---------|-------|
| Items | Product list |
| Quantity | Per item |
| Price | Optional |

### Address Section (Task 61)
| Sender | Name, address, phone |
|--------|----------------------|
| Recipient | Name, address, phone |
| Layout | Side by side |

### COD Section (Task 62)
| Display | COD amount |
|---------|------------|
| Currency | LKR (₨) |
| Style | Highlighted |

### Instructions Section (Task 63)
| Content | Delivery notes |
|---------|----------------|
| Example | "Call before delivery" |

### Custom Template UI (Task 64)
| Feature | Admin template editor |
|---------|----------------------|
| Editor | HTML/CSS editor |
| Variables | Template variables list |

### Template Preview (Task 65)
| Feature | Preview before print |
|---------|---------------------|
| Display | PDF preview |
| Sample | Sample data |
