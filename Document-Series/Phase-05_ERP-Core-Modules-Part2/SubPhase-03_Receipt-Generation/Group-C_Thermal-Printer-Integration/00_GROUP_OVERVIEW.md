# Group C: Thermal Printer Integration

> **Phase:** 05 - ERP Core Modules Part 2  
> **SubPhase:** 03 - Receipt Generation  
> **Group:** C of F  
> **Tasks Covered:** 35-52  
> **Group Goal:** Implement ESC/POS thermal printer support

---

## Navigation

- **↑ Parent:** [SubPhase-03 Summary](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group B: Receipt Data Generation](../Group-B_Receipt-Data-Generation/)
- **→ Next Group:** [Group D: PDF & Email Receipts](../Group-D_PDF-Email-Receipts/)

---

## Group Overview

### Key Outcomes

1. **Thermal Printer Service** - Service for ESC/POS command generation
2. **ESC/POS Command Constants** - Initialize, cut, text modes, alignment
3. **Text Formatting** - Bold, underline, double-width, double-height
4. **Alignment Commands** - Left, center, right text alignment
5. **Line Spacing Control** - Configurable line spacing
6. **Paper Cutting** - Full cut and partial cut commands
7. **Logo Printing** - Print logo images via ESC/POS graphics
8. **Barcode Printing** - Print scannable receipt barcodes
9. **QR Code Printing** - Print QR codes via ESC/POS
10. **80mm Layout Formatter** - 48-character width formatting
11. **58mm Layout Formatter** - 32-character width formatting
12. **Separator Lines** - Dashed separator line printing
13. **Cash Drawer Command** - Trigger cash drawer open
14. **ThermalPrintRenderer** - Render receipt to ESC/POS bytes
15. **Network Printer Support** - TCP/IP network printing
16. **USB Printer Support** - WebUSB API printing
17. **Print Job Queue** - Queued printing for reliability
18. **Print Retry Logic** - Retry failed prints with notification

### Technology Context

| Technology | Purpose |
|------------|---------|
| ESC/POS | Thermal printer command protocol |
| TypeScript | Frontend printer service |
| WebUSB API | USB printer communication |
| TCP/IP Socket | Network printer communication |

---

## Documents in This Group

| # | Document | Tasks | Description |
|---|----------|-------|-------------|
| 01 | `01_Tasks-35-42_ESC-POS-Commands.md` | 35-42 | Printer service, commands, formatting, alignment, cut, logo, barcode |
| 02 | `02_Tasks-43-48_QR-Layout-Renderer.md` | 43-48 | QR code, layouts, separators, cash drawer, ThermalPrintRenderer |
| 03 | `03_Tasks-49-52_Network-USB-Queue.md` | 49-52 | Network printer, USB printer, print queue, retry logic |

---

## Task Summary

| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 35 | Create thermal printer service | Medium | 30 min |
| 36 | Define ESC/POS command constants | Medium | 25 min |
| 37 | Implement text formatting | Medium | 30 min |
| 38 | Implement alignment commands | Medium | 20 min |
| 39 | Implement line spacing | Low | 15 min |
| 40 | Implement paper cutting | Low | 15 min |
| 41 | Implement logo printing | High | 35 min |
| 42 | Implement barcode printing | Medium | 30 min |
| 43 | Implement QR code printing | Medium | 30 min |
| 44 | Create 80mm layout formatter | Medium | 30 min |
| 45 | Create 58mm layout formatter | Medium | 25 min |
| 46 | Implement separator lines | Low | 15 min |
| 47 | Create cash drawer command | Medium | 20 min |
| 48 | Create ThermalPrintRenderer | High | 35 min |
| 49 | Implement network printer support | Medium | 30 min |
| 50 | Implement USB printer support | High | 35 min |
| 51 | Add print job queue | Medium | 25 min |
| 52 | Add print retry logic | Medium | 20 min |

---

## Execution Order

```
[Tasks 35-40: Service, constants, basic commands]
         │
         ▼
[Tasks 41-43: Logo, barcode, QR code printing]
         │
         ▼
[Tasks 44-47: Layout formatters, separators, cash drawer]
         │
         ▼
[Task 48: ThermalPrintRenderer]
         │
         ▼
[Tasks 49-52: Network/USB support, queue, retry]
```

---

## Expected Deliverables

```
frontend/
├── lib/
│   └── printing/
│       ├── escpos.ts             # Tasks 35-43
│       ├── layout-80mm.ts        # Task 44
│       ├── layout-58mm.ts        # Task 45
│       ├── renderer.ts           # Task 48
│       ├── network-printer.ts    # Task 49
│       ├── usb-printer.ts        # Task 50
│       └── print-queue.ts        # Tasks 51-52
└── types/
    └── printing.ts               # Type definitions
```

---

## Notes for AI Agents

### ESC/POS Command Constants
```
INIT: 0x1B 0x40          // Initialize printer
CUT_FULL: 0x1D 0x56 0x00 // Full paper cut
CUT_PARTIAL: 0x1D 0x56 0x01 // Partial cut
ALIGN_LEFT: 0x1B 0x61 0x00
ALIGN_CENTER: 0x1B 0x61 0x01
ALIGN_RIGHT: 0x1B 0x61 0x02
BOLD_ON: 0x1B 0x45 0x01
BOLD_OFF: 0x1B 0x45 0x00
UNDERLINE_ON: 0x1B 0x2D 0x01
UNDERLINE_OFF: 0x1B 0x2D 0x00
DOUBLE_WIDTH: 0x1B 0x21 0x20
DOUBLE_HEIGHT: 0x1B 0x21 0x10
NORMAL: 0x1B 0x21 0x00
```

### Paper Width Formatting
| Width | Characters | Use Case |
|-------|------------|----------|
| 80mm | 48 chars | Standard POS |
| 58mm | 32 chars | Portable POS |

### 80mm Layout Example
```
------------------------------------------------
            ABC RETAIL STORE
    123 Main Street, Colombo 01
           Tel: 011-234-5678
------------------------------------------------
Date: 2024-01-15      Time: 14:30
Receipt: REC20240115-00042
Cashier: John         Terminal: POS-01
------------------------------------------------
ITEM                          QTY    AMOUNT
Rice 5kg                        2   2,500.00
Milk 1L x2                      1     850.00
------------------------------------------------
Subtotal:                         3,350.00
VAT (15%):                          502.50
TOTAL:                  LKR     3,852.50
------------------------------------------------
CASH:                           4,000.00
CHANGE:                           147.50
------------------------------------------------
        Thank you for shopping!
      Return within 7 days with receipt
------------------------------------------------
```

### Logo Printing
- Convert image to bitmap
- Use GS v 0 command for raster graphics
- Max width: 576 dots (80mm) or 384 dots (58mm)

### Cash Drawer Trigger
```
0x1B 0x70 0x00 0x19 0xFA
// Pin 2, 25ms on, 250ms off
```

### WebUSB Filter
```typescript
const usbFilters = [
  { vendorId: 0x0416 }, // BIXOLON
  { vendorId: 0x04b8 }, // EPSON
  { vendorId: 0x0519 }, // Star Micronics
];
```

### Print Queue States
- QUEUED: Waiting to print
- PRINTING: Currently printing
- COMPLETED: Successfully printed
- FAILED: Print failed
- RETRY: Waiting for retry
