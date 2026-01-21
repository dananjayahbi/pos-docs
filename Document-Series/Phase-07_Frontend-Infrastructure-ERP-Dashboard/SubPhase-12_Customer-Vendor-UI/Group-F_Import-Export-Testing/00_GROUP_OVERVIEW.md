# Group F: Import/Export & Testing

> **Phase:** 07 - Frontend Infrastructure & ERP Dashboard  
> **SubPhase:** 12 - Customer & Vendor UI  
> **Group:** F of F  
> **Tasks Covered:** 83-94  
> **Group Goal:** Build import/export functionality, customer form, and final testing

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group-E_Purchase-Orders](../Group-E_Purchase-Orders/)
- **→ Next Group:** None (Last Group) | **Next SubPhase:** [SubPhase-13_HR-Payroll-UI](../../SubPhase-13_HR-Payroll-UI/)

---

## Group Overview

This group creates import/export functionality and performs final testing. Creates customer import modal with file upload. Creates column mapping interface to map CSV columns to customer fields. Creates import preview to review before importing. Creates customer export action for CSV/Excel download. Creates vendor import modal and export action. Creates new customer form page with Zod validation schema. Builds customer contact fields (name, phone, email) and address fields. Creates CRM module documentation. Performs final verification testing.

### Key Outcomes

- Customer import modal
- Customer import column mapping
- Customer import preview
- Customer export action
- Vendor import modal
- Vendor export action
- Customer form page
- Customer form schema
- Customer contact fields
- Customer address fields
- CRM module documentation
- Final verification complete

### Technology Context

- **Import:** CSV file upload
- **Mapping:** Column mapping UI
- **Export:** CSV/Excel download
- **Form:** React Hook Form + Zod

---

## Documents in This Group

| # | Document | Description | Tasks Covered |
|---|----------|-------------|---------------|
| 01 | `01_Tasks-83-88_Import-Export.md` | Create import and export functionality | 83-88 |
| 02 | `02_Tasks-89-94_Form-Testing.md` | Create customer form and final testing | 89-94 |

---

## Task Summary

| Task # | Task Name | Complexity | Dependencies |
|--------|-----------|------------|--------------|
| 83 | Create Customer Import Modal | Medium | Task 30 |
| 84 | Create Customer Import Mapping | Medium | Task 83 |
| 85 | Create Customer Import Preview | Medium | Task 84 |
| 86 | Create Customer Export Action | Low | Task 30 |
| 87 | Create Vendor Import Modal | Medium | Task 66 |
| 88 | Create Vendor Export Action | Low | Task 66 |
| 89 | Create Customer Form Page | Medium | Task 14 |
| 90 | Create Customer Form Schema | Medium | Task 89 |
| 91 | Create Customer Contact Fields | Low | Task 90 |
| 92 | Create Customer Address Fields | Low | Task 90 |
| 93 | Create CRM Module Documentation | Low | Task 92 |
| 94 | Final Verification & Testing | Low | Task 93 |

---

## Execution Order

```
Task 83: Customer Import Modal
    │
    ▼
Task 84: Import Mapping
    │
    ▼
Task 85: Import Preview
    │
    ▼
Task 86: Customer Export
    │
    ▼
Task 87: Vendor Import Modal
    │
    ▼
Task 88: Vendor Export
    │
    ▼
Task 89: Customer Form Page
    │
    ▼
Task 90: Form Schema
    │
    ├──────────┬──────────┐
    ▼          ▼          │
Task 91    Task 92       │
(Contact)  (Address)     │
    │          │          │
    └──────────┴──────────┘
               │
               ▼
         Task 93: Documentation
               │
               ▼
         Task 94: Testing
```

---

## Expected Deliverables

```
frontend/
├── app/
│   └── (dashboard)/
│       └── customers/
│           └── new/
│               └── page.tsx
├── components/
│   └── modules/
│       └── crm/
│           ├── Import/
│           │   ├── CustomerImport.tsx
│           │   ├── ImportMapping.tsx
│           │   ├── ImportPreview.tsx
│           │   ├── VendorImport.tsx
│           │   └── index.ts
│           ├── Export/
│           │   ├── CustomerExport.tsx
│           │   ├── VendorExport.tsx
│           │   └── index.ts
│           ├── Customers/
│           │   ├── CustomerForm.tsx
│           │   ├── CustomerContactFields.tsx
│           │   ├── CustomerAddressFields.tsx
│           │   └── index.ts
│           └── index.ts
├── lib/
│   └── validations/
│       └── customer.ts
└── docs/
    └── CRM_MODULE.md
```

---

## Notes for AI Agents

### Customer Import Modal (Task 83)
| Step | Content |
|------|---------|
| 1 | File upload (CSV) |
| 2 | Column mapping |
| 3 | Preview & validate |
| 4 | Import action |

### Import Mapping (Task 84)
| System Field | Map From CSV |
|--------------|--------------|
| Name | Dropdown select |
| Phone | Dropdown select |
| Email | Dropdown select |
| Address | Dropdown select |
| Type | Dropdown select |

### Import Preview (Task 85)
| Display | Content |
|---------|---------|
| Total Rows | Count |
| Valid | Count (green) |
| Errors | Count (red) |
| Warnings | Count (yellow) |
| Sample | First 5 rows |

### Customer Export (Task 86)
| Format | Extension |
|--------|-----------|
| CSV | .csv |
| Excel | .xlsx |

### Customer Form Schema (Task 90)
| Field | Type | Validation |
|-------|------|------------|
| name | string | Required, 2-200 chars |
| phone | string | Sri Lankan format |
| email | string | Valid email |
| type | enum | individual/business |
| address | object | Optional |
| credit_limit | number | Optional, >= 0 |
| tax_id | string | Optional |
| notes | string | Optional |

### Contact Fields (Task 91)
| Field | Type |
|-------|------|
| Name | Text input |
| Phone | Phone input (+94) |
| Email | Email input |
| Type | Select |

### Address Fields (Task 92)
| Field | Type |
|-------|------|
| Line 1 | Text input |
| Line 2 | Text input |
| City | Text input |
| District | Select (Sri Lankan) |
| Postal Code | Text input |

### Documentation (Task 93)
| Section | Content |
|---------|---------|
| Components | All CRM components |
| Hooks | Custom hooks |
| API | Endpoints used |
| Forms | Validation schemas |

### Final Testing (Task 94)
| Test Case | Scenario |
|-----------|----------|
| Customers | List, profile, create |
| Vendors | List, profile, create |
| POs | List, details, create |
| Import | CSV import flow |
| Export | Download files |
