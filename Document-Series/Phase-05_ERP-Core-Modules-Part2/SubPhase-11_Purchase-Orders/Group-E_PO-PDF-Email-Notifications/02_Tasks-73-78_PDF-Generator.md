# Tasks 73-78: PDF Generator Service

> **Phase:** 05 - ERP Core Modules Part 2  
> **SubPhase:** 11 - Purchase Orders  
> **Group:** E - PO PDF, Email & Notifications  
> **Document:** 02 of 03  
> **Tasks Covered:** 73, 74, 75, 76, 77, 78

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-69-72_Template-Model.md](01_Tasks-69-72_Template-Model.md)
- **→ Next Document:** [03_Tasks-79-82_Email-Notifications.md](03_Tasks-79-82_Email-Notifications.md)

---

## Document Overview

This document implements the POPDFGenerator service that creates professional PDF purchase orders using templates, including all sections: header, vendor info, line items, totals, terms, and signatures.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 73 | Create POPDFGenerator Class | High | 30 min |
| 74 | Implement PDF Header Section | Medium | 25 min |
| 75 | Implement Vendor & Shipping Section | Medium | 25 min |
| 76 | Implement Line Items Table | High | 30 min |
| 77 | Implement Totals & Tax Section | Medium | 25 min |
| 78 | Implement Terms & Signatures | Medium | 25 min |

---

## Task 73: Create POPDFGenerator Class

### Instructions
1. Create `pdf_generator.py` in services
2. Install reportlab library
3. Define POPDFGenerator class
4. Add constructor accepting po_id, template_id
5. Add generate_pdf method (main entry point)
6. Add helper methods for each section
7. Configure PDF canvas and page settings
8. Return PDF file/buffer

### PDF Library Setup
```
# requirements.txt
reportlab==4.0.7
```

### Service Structure
```
POPDFGenerator:
├── __init__(po_id, template_id=None)
├── generate_pdf() → BytesIO
├── _draw_header()
├── _draw_vendor_section()
├── _draw_line_items()
├── _draw_totals()
├── _draw_terms()
└── _draw_signatures()
```

---

## Task 74: Implement PDF Header Section

### Instructions
1. Add _draw_header method
2. Load template or use default
3. Draw company logo (if exists)
4. Draw company name (large font)
5. Draw company address
6. Draw contact info (phone, email, website)
7. Draw "PURCHASE ORDER" title
8. Draw PO number (large, prominent)
9. Draw PO date and expected delivery date
10. Add horizontal line separator

### Header Layout
```
+----------------------------------+
| [LOGO]  COMPANY NAME             |
|         Address Line 1           |
|         City, Country            |
|         Phone: +1234567890       |
|         Email: info@company.com  |
+----------------------------------+
|                                  |
|      PURCHASE ORDER              |
|      PO-2026-00001               |
|                                  |
| Date: 2026-01-15                 |
| Expected Delivery: 2026-02-15    |
+----------------------------------+
```

---

## Task 75: Implement Vendor & Shipping Section

### Instructions
1. Add _draw_vendor_section method
2. Create two-column layout (vendor left, shipping right)
3. Draw "VENDOR" label
4. Draw vendor name (bold)
5. Draw vendor contact person
6. Draw vendor address
7. Draw vendor phone and email
8. Draw "SHIP TO" label
9. Draw shipping address
10. Draw shipping contact

### Vendor & Shipping Layout
```
+-------------------+-----------------+
| VENDOR:           | SHIP TO:        |
| ABC Suppliers     | Main Warehouse  |
| Contact: John Doe | 123 Storage St  |
| 456 Supply Rd     | Colombo         |
| Phone: +9411...   | Phone: +9411... |
| vendor@abc.com    | warehouse@...   |
+-------------------+-----------------+
```

---

## Task 76: Implement Line Items Table

### Instructions
1. Add _draw_line_items method
2. Create table headers (Item #, Code, Description, Qty, Unit Price, Tax, Total)
3. Loop through PO line_items
4. Draw each line with proper alignment
5. Handle long descriptions (wrap or truncate)
6. Show line numbers if template enabled
7. Show item codes if template enabled
8. Alternate row colors for readability
9. Handle page breaks for many items
10. Calculate column widths dynamically

### Line Items Table
```
+----+-------+--------------------+-----+-----------+------+------------+
| #  | Code  | Description        | Qty | Unit Price| Tax  | Total      |
+----+-------+--------------------+-----+-----------+------+------------+
| 1  | TV001 | Samsung 55" LED TV | 10  | 85,000.00 | 8.5% | 935,000.00 |
| 2  | AC002 | LG 1.5 Ton AC      | 5   | 120,000.0 | 8.5% | 651,000.00 |
+----+-------+--------------------+-----+-----------+------+------------+
```

### Column Configuration
| Column | Width % | Alignment |
|--------|---------|-----------|
| # | 5% | Center |
| Code | 10% | Left |
| Description | 35% | Left |
| Qty | 10% | Right |
| Unit Price | 15% | Right |
| Tax | 10% | Right |
| Total | 15% | Right |

---

## Task 77: Implement Totals & Tax Section

### Instructions
1. Add _draw_totals method
2. Position section at bottom-right
3. Draw Subtotal row
4. Draw Tax breakdown (if template enabled)
5. Draw Discount row (if applicable)
6. Draw Shipping Cost row (if applicable)
7. Draw Grand Total (bold, larger font)
8. Use template colors for total box
9. Format currency properly

### Totals Section Layout
```
                        +----------------------+
                        | Subtotal: 1,586,000  |
                        | Tax (8.5%): 134,810  |
                        | Discount: -50,000    |
                        | Shipping: 5,000      |
                        |----------------------|
                        | TOTAL: 1,675,810 LKR |
                        +----------------------+
```

### Tax Breakdown (if enabled)
```
Tax Details:
├── Items @ 8.5%: 134,810
├── Items @ 15%: 0
└── Total Tax: 134,810
```

---

## Task 78: Implement Terms & Signatures

### Instructions
1. Add _draw_terms method
2. Draw "Terms & Conditions" heading
3. Draw template footer_text or default terms
4. Add payment terms from POSettings
5. Add delivery terms
6. Draw signature section
7. Add "Prepared By" with user name and date
8. Add "Approved By" signature line (if approved)
9. Add "Vendor Acknowledgment" signature line
10. Add page numbers (Page X of Y)

### Terms Section
```
Terms & Conditions:
- Payment within 30 days
- Prices are in Sri Lankan Rupees (LKR)
- Goods must be delivered by expected date
- Quality inspection upon receipt
- Returns accepted within 7 days


Signatures:
_____________________     _____________________
Prepared By:              Approved By:
[User Name]               [Approver Name]
Date: 2026-01-15         Date: 2026-01-16


_____________________
Vendor Acknowledgment
Date: ____________
```

### Footer
```
                Page 1 of 1
          Generated: 2026-01-15 14:30:25
```

---

## Summary

PDF Generator complete:
- ✅ POPDFGenerator service class
- ✅ Professional header with branding
- ✅ Vendor and shipping sections
- ✅ Line items table with formatting
- ✅ Totals and tax breakdown
- ✅ Terms and signature sections
- ✅ Page numbering

### PDF Generation Flow
```
PurchaseOrder → POPDFGenerator → PDF File
                      ↓
                  Template
                      ↓
          ┌───────────┴───────────┐
          ↓           ↓           ↓
       Header    Line Items    Totals
                      ↓
                Save to PO.pdf_file
```

### Next Steps
- **Document 03**: Implement email service and notifications
