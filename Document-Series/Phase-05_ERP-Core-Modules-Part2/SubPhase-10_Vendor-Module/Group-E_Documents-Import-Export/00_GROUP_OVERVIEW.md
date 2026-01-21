# Group E: Documents & Import/Export

> **Phase:** 05 - ERP Core Modules Part 2  
> **SubPhase:** 10 - Vendor Module  
> **Group:** E of F  
> **Tasks Covered:** 67-78  
> **Group Goal:** Implement document management and CSV import/export

---

## Navigation

- **↑ Parent:** [SubPhase-10 Summary](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group D: Performance & Communication](../Group-D_Performance-Communication/)
- **→ Next Group:** [Group F: API, Testing & Documentation](../Group-F_API-Testing-Documentation/)

---

## Group Overview

### Key Outcomes

1. **VendorDocument Model** - Store vendor documents
2. **DocumentType Choices** - CONTRACT, CERTIFICATE, PRICE_LIST, LICENSE, OTHER
3. **Document Fields** - type, name, file, expiry_date, uploaded_by
4. **Document Migrations** - Apply migrations
5. **Document Upload** - Service to upload and store documents
6. **Document Expiry Alert** - Celery task for expiring alerts
7. **Vendor CSV Importer** - Import vendors from CSV
8. **Column Mapping** - Map CSV columns to fields
9. **Import Validation** - Validate data, skip/flag invalid
10. **Vendor CSV Exporter** - Export vendors to CSV
11. **VendorHistory Model** - Track profile changes
12. **History Migrations** - Apply migrations

### Technology Context

| Technology | Purpose |
|------------|---------|
| Django ORM | Document and history models |
| File Storage | Document file storage |
| Celery | Expiry alert tasks |
| pandas | CSV processing |

---

## Documents in This Group

| # | Document | Tasks | Description |
|---|----------|-------|-------------|
| 01 | `01_Tasks-67-72_Document-Model-Service.md` | 67-72 | VendorDocument model, upload service, expiry alerts |
| 02 | `02_Tasks-73-78_Import-Export-History.md` | 73-78 | CSV import/export, validation, VendorHistory |

---

## Task Summary

| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 67 | Create VendorDocument Model | Medium | 25 min |
| 68 | Define DocumentType Choices | Low | 15 min |
| 69 | Add Document Fields | Medium | 20 min |
| 70 | Run Document Migrations | Low | 15 min |
| 71 | Implement Document Upload | Medium | 25 min |
| 72 | Implement Document Expiry Alert | Medium | 25 min |
| 73 | Create Vendor CSV Importer | High | 35 min |
| 74 | Implement Column Mapping | Medium | 25 min |
| 75 | Implement Import Validation | Medium | 30 min |
| 76 | Create Vendor CSV Exporter | Medium | 25 min |
| 77 | Create VendorHistory Model | Medium | 25 min |
| 78 | Run History Migrations | Low | 15 min |

---

## Execution Order

```
[Tasks 67-72: Document model and services]
         │
         ▼
[Tasks 73-78: Import/export and history]
```

---

## Expected Deliverables

```
apps/vendors/
├── models/
│   ├── __init__.py
│   ├── vendor_document.py        # Tasks 67-69
│   └── vendor_history.py         # Task 77
├── services/
│   ├── __init__.py
│   ├── document_service.py       # Task 71
│   ├── import_service.py         # Tasks 73-75
│   └── export_service.py         # Task 76
├── tasks/
│   ├── __init__.py
│   └── document_tasks.py         # Task 72
└── migrations/
    ├── 0009_document.py          # Task 70
    └── 0010_history.py           # Task 78
```

---

## Notes for AI Agents

### DocumentType Choices
- **CONTRACT**: Supply contract/agreement
- **CERTIFICATE**: Quality/ISO certificates
- **PRICE_LIST**: Price list document
- **LICENSE**: Business/trade license
- **OTHER**: Other document type

### VendorDocument Fields
- vendor: FK to Vendor
- document_type: Choice field
- name: CharField
- file: FileField
- expiry_date: Date (nullable)
- notes: TextField
- uploaded_by: FK to User
- uploaded_at: DateTime

### Document Storage Path
```
vendors/{vendor_id}/documents/{filename}
```

### Document Expiry Alert Schedule
| Days Before | Action |
|-------------|--------|
| 30 days | First reminder email |
| 14 days | Second reminder |
| 7 days | Urgent reminder |
| 1 day | Final reminder |
| Expired | Document marked expired |

### CSV Import Column Mapping
| CSV Column | Field | Required |
|------------|-------|----------|
| company_name | company_name | Yes |
| vendor_type | vendor_type | Yes |
| business_registration | business_registration | No |
| tax_id | tax_id | No |
| email | primary_email | No |
| phone | primary_phone | No |
| address | address_line_1 | No |
| city | city | No |
| district | district | No |
| province | province | No |
| payment_terms | payment_terms_days | No |
| credit_limit | credit_limit | No |

### Import Validation Rules
- Company name required
- Valid vendor_type value
- Valid email format (if provided)
- Valid phone format (if provided)
- Valid district-province mapping
- Check for duplicates (by company_name + tax_id)

### CSV Export Columns
```
vendor_code,company_name,vendor_type,business_registration,
tax_id,primary_email,primary_phone,address_line_1,city,
district,province,payment_terms_days,credit_limit,rating,
total_orders,total_spend,status,created_at
```

### VendorHistory Fields
- vendor: FK to Vendor
- changed_by: FK to User
- changed_at: DateTime
- field_name: CharField
- old_value: TextField
- new_value: TextField
- change_type: CREATE, UPDATE, DELETE

### History Tracking Fields
Fields to track changes:
- company_name
- vendor_type
- status
- payment_terms_days
- credit_limit
- rating
- All contact fields
- All address fields
