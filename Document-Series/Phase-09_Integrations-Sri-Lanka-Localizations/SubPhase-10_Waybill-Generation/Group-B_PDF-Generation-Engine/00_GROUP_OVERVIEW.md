# Group B: PDF Generation Engine

> **Phase:** 09 - Integrations & Sri Lanka Localizations  
> **SubPhase:** 10 - Waybill Generation  
> **Group:** B of F  
> **Tasks Covered:** 17-34  
> **Group Goal:** Implement PDF generation engine with multiple page sizes and font support

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group-A_Waybill-Models-Schema](../Group-A_Waybill-Models-Schema/)
- **→ Next Group:** [Group-C_Barcode-QR-Generation](../Group-C_Barcode-QR-Generation/)

---

## Group Overview

This group implements PDF generation. Installs ReportLab and WeasyPrint libraries. Creates PDFGenerator abstract base class with generate method. Creates ReportLabGenerator and WeasyPrintGenerator implementations. Creates page size configurations for thermal (4x6 inch), A4, and A5 formats. Creates font embedding for Sinhala and Tamil Unicode fonts. Creates margin configuration, header section with tenant logo, and footer section with courier logo. Verifies PDF generation.

### Key Outcomes

- PDF libraries installed
- PDFGenerator ABC
- generate method
- ReportLabGenerator
- WeasyPrintGenerator
- PDF page sizes
- Thermal size config
- A4 size config
- A5 size config
- PDF fonts embedded
- Sinhala font support
- Tamil font support
- PDF margins
- PDF header section
- PDF footer section
- Tenant logo
- Courier logo
- PDF generation verified

### Technology Context

- **ReportLab:** Fast, programmatic PDF
- **WeasyPrint:** HTML to PDF conversion
- **Fonts:** Unicode for Sinhala/Tamil
- **Sizes:** Thermal, A4, A5

---

## Documents in This Group

| # | Document | Description | Tasks Covered |
|---|----------|-------------|---------------|
| 01 | `01_Tasks-17-25_Libraries-Sizes.md` | Install libraries and sizes | 17-25 |
| 02 | `02_Tasks-26-34_Fonts-Layout-Verify.md` | Create fonts and layout | 26-34 |

---

## Task Summary

| Task # | Task Name | Complexity | Dependencies |
|--------|-----------|------------|--------------|
| 17 | Install PDF Libraries | Low | Task 16 |
| 18 | Create PDFGenerator ABC | Medium | Task 17 |
| 19 | Create generate Method | Low | Task 18 |
| 20 | Create ReportLabGenerator | High | Task 19 |
| 21 | Create WeasyPrintGenerator | High | Task 19 |
| 22 | Create PDF Page Size | Low | Task 20 |
| 23 | Create Thermal Size | Low | Task 22 |
| 24 | Create A4 Size | Low | Task 22 |
| 25 | Create A5 Size | Low | Task 22 |
| 26 | Create PDF Fonts | Medium | Task 20 |
| 27 | Create Sinhala Font | Medium | Task 26 |
| 28 | Create Tamil Font | Medium | Task 26 |
| 29 | Create PDF Margins | Low | Task 22 |
| 30 | Create PDF Header | Medium | Task 29 |
| 31 | Create PDF Footer | Medium | Task 29 |
| 32 | Create Tenant Logo | Low | Task 30 |
| 33 | Create Courier Logo | Low | Task 30 |
| 34 | Verify PDF Generation | Low | Task 33 |

---

## Execution Order

```
Task 17: Install PDF Libraries
    │
    ▼
Task 18: PDFGenerator ABC
    │
    ▼
Task 19: generate Method
    │
    ├─────────────────────┐
    ▼                     ▼
Task 20: ReportLab    Task 21: WeasyPrint
    │                     │
    ▼                     │
Task 22: Page Size        │
    │                     │
    ├────────┬────────┐   │
    ▼        ▼        ▼   │
T-23     T-24     T-25   │
(Therm)  (A4)    (A5)    │
    │        │        │   │
    └────────┴────────┘   │
         │                │
         ▼                │
Task 26: PDF Fonts        │
    │                     │
    ├────────┐            │
    ▼        ▼            │
T-27     T-28            │
(Sinh)  (Tamil)          │
    │        │            │
    │        │            │
    └────────┤            │
             │            │
Task 29: Margins          │
    │                     │
    ├────────┐            │
    ▼        ▼            │
T-30     T-31            │
(Head)  (Foot)           │
    │        │            │
    ├────────┤            │
    ▼        ▼            │
T-32     T-33            │
(Tenant)(Courier)        │
    │        │            │
    └────────┴────────────┘
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
        └── generators/
            └── pdf/
                ├── __init__.py
                ├── base.py
                ├── reportlab_gen.py
                ├── weasyprint_gen.py
                └── fonts/
                    ├── sinhala.ttf
                    └── tamil.ttf
```

---

## Notes for AI Agents

### Install PDF Libraries (Task 17)
| Library | Use |
|---------|-----|
| reportlab | Programmatic PDF |
| weasyprint | HTML to PDF |
| Pillow | Image handling |

### PDFGenerator ABC (Task 18)
| Class | PDFGenerator |
|-------|--------------|
| Type | Abstract base class |
| Method | generate() abstract |

### generate Method (Task 19)
| Method | generate(waybill, template, size) |
|--------|-----------------------------------|
| Input | Waybill, template, page size |
| Output | bytes (PDF content) |

### ReportLabGenerator (Task 20)
| Class | ReportLabGenerator |
|-------|-------------------|
| Extends | PDFGenerator |
| Use | Fast generation |

### WeasyPrintGenerator (Task 21)
| Class | WeasyPrintGenerator |
|-------|---------------------|
| Extends | PDFGenerator |
| Use | HTML templates |

### Thermal Size (Task 23)
| Size | 100 x 150 mm |
|------|--------------|
| Inches | 4 x 6 |
| Use | Courier labels |

### A4 Size (Task 24)
| Size | 210 x 297 mm |
|------|--------------|
| Use | With packing slip |

### A5 Size (Task 25)
| Size | 148 x 210 mm |
|------|--------------|
| Use | Compact format |

### Sinhala Font (Task 27)
| Font | Noto Sans Sinhala |
|------|-------------------|
| Embed | Required |
| Use | Sinhala addresses |

### Tamil Font (Task 28)
| Font | Noto Sans Tamil |
|------|-----------------|
| Embed | Required |
| Use | Tamil addresses |

### PDF Margins (Task 29)
| Margin | Value |
|--------|-------|
| Top | 10mm |
| Bottom | 10mm |
| Left | 10mm |
| Right | 10mm |

### PDF Header (Task 30)
| Content | Value |
|---------|-------|
| Tenant logo | Left |
| Waybill number | Center |
| Date | Right |

### PDF Footer (Task 31)
| Content | Value |
|---------|-------|
| Courier logo | Left |
| Barcode | Center |
| Page number | Right |

### Tenant Logo (Task 32)
| Size | 150x50 px max |
|------|---------------|
| Position | Header left |
| Format | PNG/SVG |

### Courier Logo (Task 33)
| Size | 100x40 px max |
|------|---------------|
| Position | Footer left |
| Format | PNG/SVG |
