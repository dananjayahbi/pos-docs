# Group A: Receipt Template Models

> **Phase:** 05 - ERP Core Modules Part 2  
> **SubPhase:** 03 - Receipt Generation  
> **Group:** A of F  
> **Tasks Covered:** 01-16  
> **Group Goal:** Create customizable receipt template configuration system

---

## Navigation

- **↑ Parent:** [SubPhase-03 Summary](../00_TASKS_SUMMARY.md)
- **→ Next Group:** [Group B: Receipt Data Generation](../Group-B_Receipt-Data-Generation/)

---

## Group Overview

### Key Outcomes

1. **Receipts Submodule** - Organized `apps/pos/receipts/` package structure
2. **Receipt Type Constants** - SALE, REFUND, VOID, REPRINT types
3. **Paper Size Constants** - THERMAL_80MM, THERMAL_58MM, A4 formats
4. **ReceiptTemplate Model** - Core template with name, paper_size, is_default
5. **Header Configuration** - Logo settings, business name override options
6. **Header Text Fields** - Custom header lines (3 configurable lines)
7. **Address Display Settings** - Flags for address, phone, email visibility
8. **Item Display Settings** - SKU, barcode, per-item tax display flags
9. **Totals Display Settings** - Subtotal, tax breakdown, savings visibility
10. **Payment Display Settings** - Payment method, change, balance due flags
11. **Footer Configuration** - Custom footer lines (3 configurable lines)
12. **Return Policy Field** - Return policy text with default template
13. **QR Code Settings** - QR code visibility and content type
14. **Font Settings** - Font size, bold options, separator lines
15. **Template Inheritance** - Default template with tenant overrides
16. **Admin Interface** - Template preview and clone functionality

### Technology Context

| Technology | Purpose |
|------------|---------|
| Django ORM | ReceiptTemplate model definition |
| JSONField | Store complex configuration objects |
| Django Admin | Template management interface |
| Tenant Schema | Per-tenant template customization |

---

## Documents in This Group

| # | Document | Tasks | Description |
|---|----------|-------|-------------|
| 01 | `01_Tasks-01-06_Submodule-Constants-Header.md` | 01-06 | Receipts submodule, constants, ReceiptTemplate model, header config |
| 02 | `02_Tasks-07-12_Display-Settings.md` | 07-12 | Address, item, totals, payment settings, footer, return policy |
| 03 | `03_Tasks-13-16_QR-Font-Inheritance-Admin.md` | 13-16 | QR code settings, fonts, template inheritance, admin interface |

---

## Task Summary

| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 01 | Create receipt submodule | Low | 10 min |
| 02 | Define receipt type constants | Low | 10 min |
| 03 | Define paper size constants | Low | 10 min |
| 04 | Create ReceiptTemplate model | Medium | 30 min |
| 05 | Add header configuration | Medium | 25 min |
| 06 | Add header text fields | Medium | 20 min |
| 07 | Add address display settings | Low | 15 min |
| 08 | Add item display settings | Medium | 20 min |
| 09 | Add totals display settings | Medium | 20 min |
| 10 | Add payment display settings | Low | 15 min |
| 11 | Add footer configuration | Medium | 20 min |
| 12 | Add return policy field | Low | 15 min |
| 13 | Add QR code settings | Medium | 20 min |
| 14 | Add font settings | Low | 15 min |
| 15 | Create template inheritance | Medium | 25 min |
| 16 | Create ReceiptTemplate admin | Medium | 30 min |

---

## Execution Order

```
[Tasks 01-03: Submodule and constants]
         │
         ▼
[Tasks 04-06: ReceiptTemplate model with header]
         │
         ▼
[Tasks 07-12: Display settings and footer]
         │
         ▼
[Tasks 13-14: QR code and font settings]
         │
         ▼
[Tasks 15-16: Inheritance and admin]
```

---

## Expected Deliverables

```
apps/pos/receipts/
├── __init__.py
├── models/
│   ├── __init__.py
│   └── template.py               # Tasks 04-15
├── constants.py                  # Tasks 02-03
└── admin.py                      # Task 16
```

---

## Notes for AI Agents

### Receipt Type Constants
- **SALE**: Normal sale transaction
- **REFUND**: Return/refund transaction
- **VOID**: Voided transaction
- **REPRINT**: Duplicate/reprint of original

### Paper Size Constants
| Constant | Width | Characters |
|----------|-------|------------|
| THERMAL_80MM | 80mm | 48 chars |
| THERMAL_58MM | 58mm | 32 chars |
| A4 | A4 paper | Full width |

### ReceiptTemplate Key Fields
- name: Template identifier
- paper_size: One of paper size constants
- is_default: Boolean for tenant default
- is_active: Boolean for availability

### Header Configuration Fields
- show_logo: Boolean
- logo_size: SMALL, MEDIUM, LARGE
- business_name_override: Override tenant name
- header_line_1, header_line_2, header_line_3

### Display Setting Flags
- show_sku: Show product SKU
- show_barcode: Show product barcode
- show_tax_per_item: Show tax on each line item
- show_subtotal: Show pre-tax subtotal
- show_tax_breakdown: Show VAT breakdown
- show_savings: Show total customer savings

### Template Inheritance Pattern
```
System Default Template
       │
       ▼
Tenant Default Template (inherits, can override)
       │
       ▼
Custom Templates (inherit from tenant default)
```

### Admin Features
- Live preview of template
- Clone template action
- Activate/deactivate templates
- Set as default action
