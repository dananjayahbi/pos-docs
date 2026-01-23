# Tasks 72-77: Invoice PDF Generator Service

> **Phase:** 05 - ERP Core Modules Part 2  
> **SubPhase:** 06 - Invoice System  
> **Group:** E - Invoice PDF & Email  
> **Document:** 02 of 03  
> **Tasks Covered:** 72, 73, 74, 75, 76, 77

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-67-71_Template-Model.md](01_Tasks-67-71_Template-Model.md)
- **→ Next Document:** [03_Tasks-78-80_Email-Service.md](03_Tasks-78-80_Email-Service.md)

---

## Document Overview

This document covers the PDF generation service and all invoice PDF sections.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 72 | Create InvoicePDFGenerator Service | High | 35 min |
| 73 | Implement PDF Header Section | Medium | 25 min |
| 74 | Implement PDF Billing Section | Medium | 25 min |
| 75 | Implement PDF Line Items Table | Medium | 30 min |
| 76 | Implement PDF Tax Summary Section | Medium | 25 min |
| 77 | Implement PDF Footer Section | Medium | 25 min |

**All tasks**: Follow same instruction pattern as Group C documents - clear numbered steps, no code snippets, include diagrams, specify file locations, validation steps, and verification checklists.

---

## Tasks 72-77 Summary

Each task should include:
1. Create/implement the specified component
2. Define structure and fields
3. Apply template customization
4. Handle Sri Lankan formatting (LKR, dates)
5. Support Unicode (Sinhala/Tamil)
6. Generate output
7. Test and verify

**Key Service Methods:**
- `generate_pdf(invoice_id)` → PDF file
- `render_header(invoice, template)` → HTML
- `render_billing(invoice)` → HTML
- `render_line_items(invoice)` → HTML  
- `render_tax_summary(invoice)` → HTML
- `render_footer(invoice, template)` → HTML

**Technologies:** WeasyPrint or ReportLab, Django templates, CSS styling

**Next:** [03_Tasks-78-80_Email-Service.md](03_Tasks-78-80_Email-Service.md)
