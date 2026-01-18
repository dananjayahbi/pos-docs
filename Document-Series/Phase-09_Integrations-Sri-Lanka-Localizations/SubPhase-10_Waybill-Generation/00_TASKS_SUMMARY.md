# SubPhase 10: Waybill Generation - Tasks Summary

> **Phase:** 09 - Integrations & Sri Lanka Localizations  
> **SubPhase Index:** 10 of 12  
> **SubPhase Goal:** Implement automated shipping label and waybill generation for all integrated couriers  
> **Total Tasks:** 90 | **Status:** Planning  
> **Estimated Duration:** 12-14 hours

---

## Navigation

- **↑ Parent:** [00_SUBPHASES_SUMMARY.md](../00_SUBPHASES_SUMMARY.md)
- **← Previous SubPhase:** [SubPhase-09_Domex-Other-Couriers](../SubPhase-09_Domex-Other-Couriers/)
- **→ Next SubPhase:** [SubPhase-11_WhatsApp-Business-API](../SubPhase-11_WhatsApp-Business-API/)

---

## SubPhase Overview

This sub-phase implements unified waybill and shipping label generation across all courier providers, supporting multiple formats (PDF, thermal, A4) with barcode and QR code encoding.

### Key Outcomes
- Unified waybill generation service
- Multi-format label support (PDF, thermal, A4)
- Barcode and QR code generation
- Batch waybill printing
- Label customization per tenant
- Waybill archive and history

### Label Formats Supported
- **Thermal Labels** - 4x6 inch (100x150mm)
- **A4 Standard** - Full page with packing slip
- **A5 Half Page** - Compact format
- **Custom Size** - Tenant-defined dimensions

### Technology Context
- **PDF Generation:** ReportLab, WeasyPrint
- **Barcode:** python-barcode, pylibdmtx
- **QR Code:** qrcode library
- **Templates:** Jinja2 for HTML templates

---

## Task Execution Order

```
TASK GROUP A: Waybill Models & Schema (Tasks 01-16)
        │
        ▼
TASK GROUP B: PDF Generation Engine (Tasks 17-34)
        │
        ▼
TASK GROUP C: Barcode & QR Generation (Tasks 35-50)
        │
        ▼
TASK GROUP D: Label Templates (Tasks 51-66)
        │
        ▼
TASK GROUP E: Batch Printing & Archive (Tasks 67-80)
        │
        ▼
TASK GROUP F: API & Frontend (Tasks 81-90)
```

---

## Task Index

### Group A: Waybill Models & Schema (Tasks 01-16)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 01 | **Create Waybill Model** | Core waybill data model | SubPhase-09 | 🔴 Not Created |
| 02 | **Create waybill_number Field** | Unique waybill identifier | Task 01 | 🔴 Not Created |
| 03 | **Create order FK** | Link to order | Task 01 | 🔴 Not Created |
| 04 | **Create shipment FK** | Link to shipment | Task 01 | 🔴 Not Created |
| 05 | **Create courier_type Field** | Courier enum | Task 01 | 🔴 Not Created |
| 06 | **Create status Field** | Waybill status | Task 01 | 🔴 Not Created |
| 07 | **Create generated_at Field** | Generation timestamp | Task 01 | 🔴 Not Created |
| 08 | **Create pdf_file Field** | FileField for PDF | Task 01 | 🔴 Not Created |
| 09 | **Create barcode_data Field** | Encoded barcode | Task 01 | 🔴 Not Created |
| 10 | **Create qr_data Field** | Encoded QR | Task 01 | 🔴 Not Created |
| 11 | **Create sender_address Field** | JSON sender details | Task 01 | 🔴 Not Created |
| 12 | **Create recipient_address Field** | JSON recipient details | Task 01 | 🔴 Not Created |
| 13 | **Create WaybillTemplate Model** | Custom templates | Task 01 | 🔴 Not Created |
| 14 | **Create template_name Field** | Template identifier | Task 13 | 🔴 Not Created |
| 15 | **Create template_html Field** | HTML template | Task 13 | 🔴 Not Created |
| 16 | **Create Waybill Migrations** | Generate migrations | Task 15 | 🔴 Not Created |

---

### Group B: PDF Generation Engine (Tasks 17-34)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 17 | **Install PDF Libraries** | ReportLab, WeasyPrint | Task 16 | 🔴 Not Created |
| 18 | **Create PDFGenerator ABC** | Abstract PDF generator | Task 17 | 🔴 Not Created |
| 19 | **Create generate Method** | Abstract generate | Task 18 | 🔴 Not Created |
| 20 | **Create ReportLabGenerator** | ReportLab implementation | Task 19 | 🔴 Not Created |
| 21 | **Create WeasyPrintGenerator** | WeasyPrint implementation | Task 19 | 🔴 Not Created |
| 22 | **Create PDF Page Size** | Define page sizes | Task 20 | 🔴 Not Created |
| 23 | **Create Thermal Size** | 4x6 inch config | Task 22 | 🔴 Not Created |
| 24 | **Create A4 Size** | A4 page config | Task 22 | 🔴 Not Created |
| 25 | **Create A5 Size** | A5 page config | Task 22 | 🔴 Not Created |
| 26 | **Create PDF Fonts** | Embed custom fonts | Task 20 | 🔴 Not Created |
| 27 | **Create Sinhala Font** | Sinhala Unicode | Task 26 | 🔴 Not Created |
| 28 | **Create Tamil Font** | Tamil Unicode | Task 26 | 🔴 Not Created |
| 29 | **Create PDF Margins** | Configure margins | Task 22 | 🔴 Not Created |
| 30 | **Create PDF Header** | Header section | Task 29 | 🔴 Not Created |
| 31 | **Create PDF Footer** | Footer section | Task 29 | 🔴 Not Created |
| 32 | **Create Tenant Logo** | Include tenant logo | Task 30 | 🔴 Not Created |
| 33 | **Create Courier Logo** | Include courier logo | Task 30 | 🔴 Not Created |
| 34 | **Verify PDF Generation** | Test PDF output | Task 33 | 🔴 Not Created |

---

### Group C: Barcode & QR Generation (Tasks 35-50)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 35 | **Install Barcode Libs** | python-barcode, qrcode | Task 34 | 🔴 Not Created |
| 36 | **Create BarcodeGenerator** | Barcode generator class | Task 35 | 🔴 Not Created |
| 37 | **Create Code128 Generator** | Code128 barcode | Task 36 | 🔴 Not Created |
| 38 | **Create Code39 Generator** | Code39 barcode | Task 36 | 🔴 Not Created |
| 39 | **Create EAN13 Generator** | EAN13 barcode | Task 36 | 🔴 Not Created |
| 40 | **Create Barcode to Image** | Generate barcode image | Task 39 | 🔴 Not Created |
| 41 | **Create Barcode to SVG** | Generate barcode SVG | Task 39 | 🔴 Not Created |
| 42 | **Create QRCodeGenerator** | QR code generator class | Task 35 | 🔴 Not Created |
| 43 | **Create QR Data Encoder** | Encode tracking URL | Task 42 | 🔴 Not Created |
| 44 | **Create QR Error Correction** | Configure error level | Task 42 | 🔴 Not Created |
| 45 | **Create QR to Image** | Generate QR image | Task 44 | 🔴 Not Created |
| 46 | **Create QR to SVG** | Generate QR SVG | Task 44 | 🔴 Not Created |
| 47 | **Create Barcode Placement** | Position on label | Task 41 | 🔴 Not Created |
| 48 | **Create QR Placement** | Position on label | Task 46 | 🔴 Not Created |
| 49 | **Create Scan Validation** | Validate readability | Task 48 | 🔴 Not Created |
| 50 | **Verify Barcode/QR** | Test generation | Task 49 | 🔴 Not Created |

---

### Group D: Label Templates (Tasks 51-66)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 51 | **Create Template Engine** | Jinja2 template engine | Task 50 | 🔴 Not Created |
| 52 | **Create Base Template** | Base label template | Task 51 | 🔴 Not Created |
| 53 | **Create Koombiyo Template** | Koombiyo waybill | Task 52 | 🔴 Not Created |
| 54 | **Create Domex Template** | Domex waybill | Task 52 | 🔴 Not Created |
| 55 | **Create PromptX Template** | PromptX waybill | Task 52 | 🔴 Not Created |
| 56 | **Create RoyalExpress Template** | RoyalExpress waybill | Task 52 | 🔴 Not Created |
| 57 | **Create TranceExpress Template** | TranceExpress waybill | Task 52 | 🔴 Not Created |
| 58 | **Create Thermal Template** | 4x6 thermal template | Task 52 | 🔴 Not Created |
| 59 | **Create A4 Template** | A4 with packing slip | Task 52 | 🔴 Not Created |
| 60 | **Create Packing Slip Section** | Item list section | Task 59 | 🔴 Not Created |
| 61 | **Create Address Section** | Sender/recipient | Task 52 | 🔴 Not Created |
| 62 | **Create COD Section** | COD amount display | Task 52 | 🔴 Not Created |
| 63 | **Create Instructions Section** | Delivery instructions | Task 52 | 🔴 Not Created |
| 64 | **Create Custom Template UI** | Admin template editor | Task 52 | 🔴 Not Created |
| 65 | **Create Template Preview** | Preview before print | Task 64 | 🔴 Not Created |
| 66 | **Verify Templates** | Test all templates | Task 65 | 🔴 Not Created |

---

### Group E: Batch Printing & Archive (Tasks 67-80)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 67 | **Create WaybillService** | Main waybill service | Task 66 | 🔴 Not Created |
| 68 | **Create generate_single** | Single waybill | Task 67 | 🔴 Not Created |
| 69 | **Create generate_batch** | Batch generation | Task 67 | 🔴 Not Created |
| 70 | **Create BatchWaybillJob** | Celery batch job | Task 69 | 🔴 Not Created |
| 71 | **Create Batch Progress** | Track batch progress | Task 70 | 🔴 Not Created |
| 72 | **Create Batch Download** | Download all as ZIP | Task 70 | 🔴 Not Created |
| 73 | **Create Print Queue** | Queue for printing | Task 69 | 🔴 Not Created |
| 74 | **Create Print Order** | Print sequence | Task 73 | 🔴 Not Created |
| 75 | **Create Archive Service** | Archive old waybills | Task 67 | 🔴 Not Created |
| 76 | **Create S3 Storage** | Store in S3/Spaces | Task 75 | 🔴 Not Created |
| 77 | **Create Archive Retention** | 90-day retention | Task 76 | 🔴 Not Created |
| 78 | **Create Archive Cleanup** | Celery cleanup task | Task 77 | 🔴 Not Created |
| 79 | **Create Reprint Service** | Reprint existing | Task 67 | 🔴 Not Created |
| 80 | **Verify Batch & Archive** | Test batch flow | Task 79 | 🔴 Not Created |

---

### Group F: API & Frontend (Tasks 81-90)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 81 | **Create Waybill API Views** | DRF ViewSet | Task 80 | 🔴 Not Created |
| 82 | **Create generate Endpoint** | POST /api/waybills/ | Task 81 | 🔴 Not Created |
| 83 | **Create batch Endpoint** | POST /api/waybills/batch/ | Task 81 | 🔴 Not Created |
| 84 | **Create download Endpoint** | GET /api/waybills/{id}/pdf/ | Task 81 | 🔴 Not Created |
| 85 | **Create Waybill Types** | TypeScript interfaces | Task 81 | 🔴 Not Created |
| 86 | **Create Waybill API Client** | Frontend API client | Task 85 | 🔴 Not Created |
| 87 | **Create WaybillPrintButton** | Single print button | Task 86 | 🔴 Not Created |
| 88 | **Create BatchPrintDialog** | Batch print dialog | Task 86 | 🔴 Not Created |
| 89 | **Create Waybill History UI** | View past waybills | Task 86 | 🔴 Not Created |
| 90 | **Create Integration Tests** | E2E waybill tests | Task 89 | 🔴 Not Created |

---

## Expected Final Structure

```
backend/
└── apps/
    └── shipping/
        ├── models/
        │   ├── waybill.py                    # Waybill model (Task 01)
        │   └── waybill_template.py           # WaybillTemplate (Task 13)
        ├── services/
        │   ├── waybill_service.py            # WaybillService (Task 67)
        │   ├── batch_waybill.py              # Batch generation (Task 69)
        │   └── archive_service.py            # Archive service (Task 75)
        ├── generators/
        │   ├── __init__.py
        │   ├── pdf/
        │   │   ├── base.py                   # PDFGenerator ABC (Task 18)
        │   │   ├── reportlab_gen.py          # ReportLab (Task 20)
        │   │   └── weasyprint_gen.py         # WeasyPrint (Task 21)
        │   ├── barcode/
        │   │   ├── barcode_gen.py            # BarcodeGenerator (Task 36)
        │   │   └── qr_gen.py                 # QRCodeGenerator (Task 42)
        │   └── templates/
        │       ├── engine.py                 # Template engine (Task 51)
        │       ├── base.html                 # Base template (Task 52)
        │       ├── koombiyo.html             # Koombiyo (Task 53)
        │       ├── domex.html                # Domex (Task 54)
        │       ├── promptx.html              # PromptX (Task 55)
        │       ├── thermal.html              # Thermal 4x6 (Task 58)
        │       └── a4_with_slip.html         # A4 template (Task 59)
        ├── tasks/
        │   ├── batch_waybill_task.py         # Celery task (Task 70)
        │   └── archive_cleanup_task.py       # Cleanup task (Task 78)
        └── api/
            └── waybill_views.py              # API views (Task 81)

frontend/
└── lib/
    └── shipping/
        └── waybill/
            ├── types.ts                      # Types (Task 85)
            └── client.ts                     # API client (Task 86)
└── components/
    └── orders/
        ├── WaybillPrintButton.tsx            # Print button (Task 87)
        ├── BatchPrintDialog.tsx              # Batch dialog (Task 88)
        └── WaybillHistory.tsx                # History (Task 89)
```

---

## Progress Tracking

| Group | Name | Tasks | Completed | Progress |
|-------|------|-------|-----------|----------|
| A | Waybill Models & Schema | 16 | 0 | 0% |
| B | PDF Generation Engine | 18 | 0 | 0% |
| C | Barcode & QR Generation | 16 | 0 | 0% |
| D | Label Templates | 16 | 0 | 0% |
| E | Batch Printing & Archive | 14 | 0 | 0% |
| F | API & Frontend | 10 | 0 | 0% |
| **Total** | | **90** | **0** | **0%** |

---

## Label Size Reference

| Format | Size (mm) | Size (inch) | Use Case |
|--------|-----------|-------------|----------|
| Thermal | 100 x 150 | 4 x 6 | Courier standard |
| A4 | 210 x 297 | 8.27 x 11.69 | With packing slip |
| A5 | 148 x 210 | 5.83 x 8.27 | Compact |
| Custom | Variable | Variable | Tenant-defined |

---

## Notes for AI Agents

1. **Execute tasks in order** - Follow Group A → F sequence
2. **PDF libraries** - ReportLab for speed, WeasyPrint for HTML
3. **Multi-language** - Sinhala/Tamil font embedding required
4. **Courier templates** - Each courier has specific format
5. **Barcode types** - Code128 most common for shipping
6. **QR tracking** - Encode tracking URL for mobile scan
7. **Batch processing** - Use Celery for large batches
8. **Archive strategy** - S3 storage with 90-day retention
9. **Thermal printing** - ZPL support optional (advanced)
