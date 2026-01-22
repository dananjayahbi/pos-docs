# Group C: Barcode & QR Generation

> **Phase:** 09 - Integrations & Sri Lanka Localizations  
> **SubPhase:** 10 - Waybill Generation  
> **Group:** C of F  
> **Tasks Covered:** 35-50  
> **Group Goal:** Implement barcode and QR code generation for waybill labels

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group-B_PDF-Generation-Engine](../Group-B_PDF-Generation-Engine/)
- **→ Next Group:** [Group-D_Label-Templates](../Group-D_Label-Templates/)

---

## Group Overview

This group implements barcode and QR generation. Installs python-barcode and qrcode libraries. Creates BarcodeGenerator class with Code128, Code39, and EAN13 generators. Creates barcode to image and barcode to SVG methods. Creates QRCodeGenerator class with data encoder, error correction level configuration. Creates QR to image and QR to SVG methods. Creates barcode and QR placement on labels. Creates scan validation to ensure readability. Verifies barcode and QR generation.

### Key Outcomes

- Barcode libraries installed
- BarcodeGenerator class
- Code128 generator
- Code39 generator
- EAN13 generator
- Barcode to image
- Barcode to SVG
- QRCodeGenerator class
- QR data encoder
- QR error correction
- QR to image
- QR to SVG
- Barcode placement
- QR placement
- Scan validation
- Generation verified

### Technology Context

- **Barcode:** python-barcode library
- **QR Code:** qrcode library
- **Format:** PNG and SVG output
- **Code128:** Most common for shipping

---

## Documents in This Group

| # | Document | Description | Tasks Covered |
|---|----------|-------------|---------------|
| 01 | `01_Tasks-35-43_Barcode-QR-Classes.md` | Create barcode and QR classes | 35-43 |
| 02 | `02_Tasks-44-50_Placement-Validate.md` | Create placement and validation | 44-50 |

---

## Task Summary

| Task # | Task Name | Complexity | Dependencies |
|--------|-----------|------------|--------------|
| 35 | Install Barcode Libs | Low | Task 34 |
| 36 | Create BarcodeGenerator | Medium | Task 35 |
| 37 | Create Code128 Generator | Low | Task 36 |
| 38 | Create Code39 Generator | Low | Task 36 |
| 39 | Create EAN13 Generator | Low | Task 36 |
| 40 | Create Barcode to Image | Low | Task 39 |
| 41 | Create Barcode to SVG | Low | Task 39 |
| 42 | Create QRCodeGenerator | Medium | Task 35 |
| 43 | Create QR Data Encoder | Low | Task 42 |
| 44 | Create QR Error Correction | Low | Task 42 |
| 45 | Create QR to Image | Low | Task 44 |
| 46 | Create QR to SVG | Low | Task 44 |
| 47 | Create Barcode Placement | Low | Task 41 |
| 48 | Create QR Placement | Low | Task 46 |
| 49 | Create Scan Validation | Medium | Task 48 |
| 50 | Verify Barcode/QR | Low | Task 49 |

---

## Execution Order

```
Task 35: Install Barcode Libs
    │
    ├─────────────────────────────┐
    ▼                             ▼
Task 36: BarcodeGenerator     Task 42: QRCodeGenerator
    │                             │
    ├────────┬────────┐           ├────────┐
    ▼        ▼        ▼           ▼        ▼
T-37     T-38     T-39        T-43     T-44
(128)   (39)   (EAN13)       (Data)   (Error)
    │        │        │           │        │
    └────────┴────────┘           └────────┘
             │                         │
        ┌────┴────┐               ┌────┴────┐
        ▼         ▼               ▼         ▼
     T-40      T-41            T-45      T-46
    (Img)     (SVG)           (Img)     (SVG)
        │         │               │         │
        │         ▼               │         ▼
        │      T-47              │       T-48
        │    (Place)             │     (Place)
        │         │               │         │
        └─────────┴───────────────┴─────────┘
                          │
                          ▼
                   Task 49: Scan Validation
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
        └── generators/
            └── barcode/
                ├── __init__.py
                ├── barcode_gen.py
                └── qr_gen.py
```

---

## Notes for AI Agents

### Install Barcode Libs (Task 35)
| Library | Use |
|---------|-----|
| python-barcode | Barcode generation |
| qrcode | QR code generation |
| Pillow | Image handling |

### BarcodeGenerator (Task 36)
| Class | BarcodeGenerator |
|-------|------------------|
| Purpose | Generate shipping barcodes |

### Code128 Generator (Task 37)
| Type | Code128 |
|------|---------|
| Use | Most common for shipping |
| Data | Alphanumeric |

### Code39 Generator (Task 38)
| Type | Code39 |
|------|--------|
| Use | Alternative format |
| Data | Alphanumeric uppercase |

### EAN13 Generator (Task 39)
| Type | EAN13 |
|------|-------|
| Use | Product barcodes |
| Data | 13 digits |

### Barcode to Image (Task 40)
| Method | to_image(data, type) |
|--------|---------------------|
| Output | PNG bytes |
| Format | PNG |

### Barcode to SVG (Task 41)
| Method | to_svg(data, type) |
|--------|-------------------|
| Output | SVG string |
| Format | SVG |

### QRCodeGenerator (Task 42)
| Class | QRCodeGenerator |
|-------|-----------------|
| Purpose | Generate QR codes |

### QR Data Encoder (Task 43)
| Encode | Tracking URL |
|--------|--------------|
| Format | https://track.lcc.lk/{waybill} |

### QR Error Correction (Task 44)
| Level | Value |
|-------|-------|
| L | 7% recovery |
| M | 15% recovery |
| Q | 25% recovery |
| H | 30% recovery |
| Default | M |

### QR to Image (Task 45)
| Method | to_image(data) |
|--------|----------------|
| Output | PNG bytes |
| Size | 150x150 px |

### QR to SVG (Task 46)
| Method | to_svg(data) |
|--------|--------------|
| Output | SVG string |

### Barcode Placement (Task 47)
| Position | Bottom center |
|----------|---------------|
| Width | 80% of label width |
| Height | 30mm |

### QR Placement (Task 48)
| Position | Top right |
|----------|-----------|
| Size | 25x25mm |

### Scan Validation (Task 49)
| Test | Scan readability |
|------|------------------|
| Method | Validate barcode/QR |
| Library | pyzbar optional |
