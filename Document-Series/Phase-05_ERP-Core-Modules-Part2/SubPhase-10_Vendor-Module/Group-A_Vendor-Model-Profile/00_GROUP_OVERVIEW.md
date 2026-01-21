# Group A: Vendor Model & Profile

> **Phase:** 05 - ERP Core Modules Part 2  
> **SubPhase:** 10 - Vendor Module  
> **Group:** A of F  
> **Tasks Covered:** 01-18  
> **Group Goal:** Create vendors Django app with comprehensive vendor model

---

## Navigation

- **↑ Parent:** [SubPhase-10 Summary](../00_TASKS_SUMMARY.md)
- **→ Next Group:** [Group B: Contacts & Bank Details](../Group-B_Contacts-Bank-Details/)

---

## Group Overview

### Key Outcomes

1. **Vendors Django App** - New Django app for vendors module
2. **App Registration** - Register vendors in TENANT_APPS
3. **VendorStatus Choices** - ACTIVE, INACTIVE, BLOCKED, PENDING_APPROVAL
4. **VendorType Choices** - MANUFACTURER, DISTRIBUTOR, WHOLESALER, IMPORTER, SERVICE
5. **Vendor Core Fields** - vendor_code, company_name, display_name
6. **Vendor Type Fields** - vendor_type, business_registration, tax_id
7. **Vendor Address Fields** - address_line_1, city, district, province
8. **Vendor Contact Fields** - primary_email, primary_phone, website, fax
9. **Vendor Terms Fields** - payment_terms_days, credit_limit, currency
10. **Vendor Lead Time Fields** - default_lead_time_days, minimum_order_value
11. **Vendor Notes Fields** - notes, internal_notes, tags JSONField
12. **Vendor Rating Fields** - rating, total_orders, total_spend
13. **Vendor Date Fields** - created_at, updated_at, first_order_date
14. **Vendor Code Generator** - Auto-generate VND-{SEQUENCE}
15. **Vendor Logo Field** - Image upload for branding
16. **Model Indexes** - Database indexes for performance
17. **Model Constraints** - Unique constraints, validation
18. **Initial Migrations** - Generate and apply migrations

### Technology Context

| Technology | Purpose |
|------------|---------|
| Django ORM | Vendor model definition |
| PostgreSQL | Indexes and constraints |
| ImageField | Vendor logo storage |
| Sequence Generator | Vendor code generation |

---

## Documents in This Group

| # | Document | Tasks | Description |
|---|----------|-------|-------------|
| 01 | `01_Tasks-01-06_App-Setup-Model-Core.md` | 01-06 | Django app, registration, status/type choices, core/type fields |
| 02 | `02_Tasks-07-12_Address-Contact-Terms-Rating.md` | 07-12 | Address, contact, terms, lead time, notes, rating fields |
| 03 | `03_Tasks-13-18_Dates-Code-Logo-Index-Migration.md` | 13-18 | Date fields, code generator, logo, indexes, constraints, migrations |

---

## Task Summary

| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 01 | Create vendors Django App | Low | 15 min |
| 02 | Register vendors App | Low | 10 min |
| 03 | Define VendorStatus Choices | Low | 15 min |
| 04 | Define VendorType Choices | Low | 15 min |
| 05 | Create Vendor Model Core Fields | Medium | 25 min |
| 06 | Add Vendor Type Fields | Medium | 20 min |
| 07 | Add Vendor Address Fields | Medium | 20 min |
| 08 | Add Vendor Contact Fields | Medium | 20 min |
| 09 | Add Vendor Terms Fields | Medium | 20 min |
| 10 | Add Vendor Lead Time Fields | Medium | 20 min |
| 11 | Add Vendor Notes Fields | Low | 15 min |
| 12 | Add Vendor Rating Fields | Medium | 20 min |
| 13 | Add Vendor Date Fields | Medium | 20 min |
| 14 | Create Vendor Code Generator | Medium | 25 min |
| 15 | Add Vendor Logo Field | Low | 15 min |
| 16 | Create Vendor Model Indexes | Medium | 20 min |
| 17 | Create Vendor Model Constraints | Medium | 20 min |
| 18 | Run Initial Vendor Migrations | Low | 15 min |

---

## Execution Order

```
[Tasks 01-06: Django app setup, status/type, core fields]
         │
         ▼
[Tasks 07-12: Address, contact, terms, notes, rating]
         │
         ▼
[Tasks 13-18: Dates, code generator, logo, indexes, migrations]
```

---

## Expected Deliverables

```
apps/vendors/
├── __init__.py
├── apps.py                       # Tasks 01-02
├── models/
│   ├── __init__.py
│   └── vendor.py                 # Tasks 05-17
├── constants.py                  # Tasks 03-04
├── services/
│   └── code_generator.py         # Task 14
└── migrations/
    └── 0001_initial.py           # Task 18
```

---

## Notes for AI Agents

### VendorStatus Choices
- **ACTIVE**: Vendor is active and can receive orders
- **INACTIVE**: Vendor is inactive, no new orders
- **BLOCKED**: Blocked due to issues
- **PENDING_APPROVAL**: Awaiting approval

### VendorType Choices
- **MANUFACTURER**: Produces goods directly
- **DISTRIBUTOR**: Authorized distribution of brands
- **WHOLESALER**: Bulk supplier with competitive pricing
- **IMPORTER**: Imports goods from overseas
- **SERVICE**: Service provider (not goods)

### Vendor Code Format
```
VND-{SEQUENCE}
Example: VND-00001

Alternative with type prefix:
MFR-00001 (Manufacturer)
DIS-00001 (Distributor)
WHS-00001 (Wholesaler)
```

### Payment Terms Options
| Term | Days | Description |
|------|------|-------------|
| CIA | 0 | Cash in Advance |
| COD | 0 | Cash on Delivery |
| Net 15 | 15 | Payment within 15 days |
| Net 30 | 30 | Payment within 30 days |
| Net 45 | 45 | Payment within 45 days |
| Net 60 | 60 | Payment within 60 days |

### Rating Fields
- rating: Decimal (1.0-5.0)
- total_orders: Integer (count of POs)
- total_spend: Decimal (sum of PO amounts)
- These are denormalized for performance

### Database Indexes
- vendor_code (unique)
- company_name
- status
- vendor_type
- (status, vendor_type) composite
- created_at

### Required Fields
| Field | Required |
|-------|----------|
| vendor_code | Auto-generated |
| company_name | ✅ Yes |
| vendor_type | ✅ Yes |
| primary_email | Recommended |
| primary_phone | Recommended |
