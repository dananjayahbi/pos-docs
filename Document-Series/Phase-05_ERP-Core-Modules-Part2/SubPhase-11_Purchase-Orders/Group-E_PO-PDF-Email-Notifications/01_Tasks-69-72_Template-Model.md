# Tasks 69-72: PO Template Model

> **Phase:** 05 - ERP Core Modules Part 2  
> **SubPhase:** 11 - Purchase Orders  
> **Group:** E - PO PDF, Email & Notifications  
> **Document:** 01 of 03  
> **Tasks Covered:** 69, 70, 71, 72

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-73-78_PDF-Generator.md](02_Tasks-73-78_PDF-Generator.md)

---

## Document Overview

This document creates the POTemplate model that stores customizable PDF template settings including header information, styling, and branding for purchase order PDFs.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 69 | Create POTemplate Model | Medium | 25 min |
| 70 | Add Template Header Fields | Medium | 20 min |
| 71 | Add Template Styling Fields | Medium | 20 min |
| 72 | Run Template Migrations | Low | 15 min |

---

## Task 69: Create POTemplate Model

### Instructions
1. Create `po_template.py` in models directory
2. Add TenantMixin for multi-tenancy
3. Add UUID primary key
4. Add template_name CharField
5. Add is_default BooleanField
6. Add is_active BooleanField
7. Add timestamps
8. Configure Meta class (unique constraint on template_name per tenant)
9. Add __str__ method

### POTemplate Purpose
- Allow multiple PO PDF templates per tenant
- Support branding customization
- Enable A/B testing of formats
- Maintain template versions

---

## Task 70: Add Template Header Fields

### Instructions
1. Add company_name CharField
2. Add company_address TextField
3. Add company_phone CharField
4. Add company_email EmailField
5. Add company_website URLField (optional)
6. Add tax_id CharField (optional)
7. Add logo ImageField/FileField (optional)
8. Add header_text TextField (optional)
9. Add footer_text TextField (optional)

### Header Field Usage
| Field | Purpose |
|-------|---------|
| company_name | PDF top header |
| company_address | Under company name |
| company_phone | Contact info section |
| company_email | Contact info section |
| company_website | Bottom footer link |
| tax_id | Tax registration number |
| logo | Top-left branding |
| header_text | Custom message |
| footer_text | Terms & conditions |

---

## Task 71: Add Template Styling Fields

### Instructions
1. Add primary_color CharField (hex code)
2. Add secondary_color CharField (hex code)
3. Add font_family CharField
4. Add font_size_header IntegerField (default=16)
5. Add font_size_body IntegerField (default=10)
6. Add show_line_numbers BooleanField
7. Add show_item_codes BooleanField
8. Add show_tax_breakdown BooleanField
9. Add page_size CharField (A4/Letter)
10. Add paper_orientation CharField (Portrait/Landscape)

### Styling Options
```
Colors:
├── primary_color: #1976D2 (headers, lines)
└── secondary_color: #FFC107 (accents)

Typography:
├── font_family: Helvetica, Arial, Times
├── font_size_header: 14-20pt
└── font_size_body: 8-12pt

Layout:
├── page_size: A4, Letter, Legal
└── orientation: Portrait, Landscape

Visibility:
├── show_line_numbers: Yes/No
├── show_item_codes: Yes/No
└── show_tax_breakdown: Yes/No
```

---

## Task 72: Run Template Migrations

### Instructions
1. Update `models/__init__.py` with POTemplate import
2. Run makemigrations purchases
3. Review migration file (0005_template.py)
4. Apply to public schema
5. Apply to tenant schemas
6. Create default template via data migration
7. Test template creation

### Default Template Setup
```python
# Data migration
POTemplate.objects.create(
    template_name='Default Template',
    is_default=True,
    is_active=True,
    company_name='Your Company',
    primary_color='#1976D2',
    secondary_color='#FFC107',
    font_family='Helvetica',
    font_size_header=16,
    font_size_body=10,
    page_size='A4',
    paper_orientation='Portrait',
    show_line_numbers=True,
    show_item_codes=True,
    show_tax_breakdown=True
)
```

---

## Summary

POTemplate model created:
- ✅ Template model foundation
- ✅ Header/company fields (9 fields)
- ✅ Styling/layout fields (10 fields)
- ✅ Default template
- ✅ Multi-tenant support

### Next Steps
- **Document 02**: Implement PDF generator service
