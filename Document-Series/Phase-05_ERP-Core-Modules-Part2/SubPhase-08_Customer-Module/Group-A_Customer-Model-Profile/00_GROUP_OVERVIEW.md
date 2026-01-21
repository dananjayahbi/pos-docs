# Group A: Customer Model & Profile

> **Phase:** 05 - ERP Core Modules Part 2  
> **SubPhase:** 08 - Customer Module  
> **Group:** A of F  
> **Tasks Covered:** 01-18  
> **Group Goal:** Create Customer model with profile and Sri Lanka business support

---

## Navigation

- **↑ Parent:** [SubPhase-08 Summary](../00_TASKS_SUMMARY.md)
- **→ Next Group:** [Group B: Addresses & Contact Information](../Group-B_Addresses-Contact-Information/)

---

## Group Overview

### Key Outcomes

1. **Customers Django App** - New Django app for customers module
2. **App Registration** - Register customers in TENANT_APPS
3. **CustomerType Choices** - INDIVIDUAL, BUSINESS, GOVERNMENT, NONPROFIT
4. **CustomerStatus Choices** - ACTIVE, INACTIVE, BLOCKED, ARCHIVED
5. **Customer Core Fields** - customer_code, first_name, last_name, display_name
6. **Customer Type Fields** - customer_type, company_name, company_registration
7. **Customer Contact Fields** - email, primary_phone, secondary_phone
8. **Customer Tax Fields** - tax_id, vat_number for business
9. **Customer Date Fields** - created_at, updated_at, purchase dates
10. **Customer Financial Summary** - total_purchases, payments, balance
11. **Customer Marketing Fields** - accepts_marketing, email sent tracking
12. **Customer Notes Fields** - notes, internal_notes
13. **Customer Source Field** - MANUAL, POS, WEBSTORE, IMPORT
14. **Customer Code Generator** - Auto-generate CUST-{SEQUENCE}
15. **Customer Profile Image** - Image upload support
16. **Model Indexes** - Database indexes for performance
17. **Model Constraints** - Unique constraints, validation
18. **Initial Migrations** - Generate and apply migrations

### Technology Context

| Technology | Purpose |
|------------|---------|
| Django ORM | Customer model definition |
| PostgreSQL | Indexes and constraints |
| ImageField | Profile image storage |
| Sequence Generator | Customer code generation |

---

## Documents in This Group

| # | Document | Tasks | Description |
|---|----------|-------|-------------|
| 01 | `01_Tasks-01-06_App-Setup-Model-Core.md` | 01-06 | Django app, registration, type/status choices, core fields, type fields |
| 02 | `02_Tasks-07-12_Contact-Tax-Dates-Financial-Marketing.md` | 07-12 | Contact, tax, dates, financial summary, marketing, notes |
| 03 | `03_Tasks-13-18_Source-Code-Image-Index-Migration.md` | 13-18 | Source, code generator, profile image, indexes, constraints, migrations |

---

## Task Summary

| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 01 | Create customers Django App | Low | 15 min |
| 02 | Register customers App | Low | 10 min |
| 03 | Define CustomerType Choices | Low | 15 min |
| 04 | Define CustomerStatus Choices | Low | 15 min |
| 05 | Create Customer Model Core Fields | Medium | 25 min |
| 06 | Add Customer Type Fields | Medium | 20 min |
| 07 | Add Customer Contact Fields | Medium | 20 min |
| 08 | Add Customer Tax Fields | Medium | 20 min |
| 09 | Add Customer Date Fields | Medium | 20 min |
| 10 | Add Customer Financial Summary | Medium | 25 min |
| 11 | Add Customer Marketing Fields | Low | 15 min |
| 12 | Add Customer Notes Fields | Low | 15 min |
| 13 | Add Customer Source Field | Low | 15 min |
| 14 | Create Customer Code Generator | Medium | 25 min |
| 15 | Add Customer Profile Image | Medium | 20 min |
| 16 | Create Customer Model Indexes | Medium | 20 min |
| 17 | Create Customer Model Constraints | Medium | 20 min |
| 18 | Run Initial Customer Migrations | Low | 15 min |

---

## Execution Order

```
[Tasks 01-04: Django app setup and choice enums]
         │
         ▼
[Tasks 05-08: Core fields, type, contact, tax]
         │
         ▼
[Tasks 09-12: Dates, financial, marketing, notes]
         │
         ▼
[Tasks 13-18: Source, code gen, image, indexes, migrations]
```

---

## Expected Deliverables

```
apps/customers/
├── __init__.py
├── apps.py                       # Tasks 01-02
├── models/
│   ├── __init__.py
│   └── customer.py               # Tasks 05-17
├── constants.py                  # Tasks 03-04, 13
├── services/
│   └── code_generator.py         # Task 14
└── migrations/
    └── 0001_initial.py           # Task 18
```

---

## Notes for AI Agents

### CustomerType Choices
- **INDIVIDUAL**: Personal customer (first_name, last_name)
- **BUSINESS**: Company/business (company_name, company_registration, tax_id)
- **GOVERNMENT**: Government entity (department_name, budget_code)
- **NONPROFIT**: NGO/Charity (organization_name, registration_number)

### CustomerStatus Choices
- **ACTIVE**: Active customer, can place orders
- **INACTIVE**: Inactive, cannot place orders
- **BLOCKED**: Blocked due to issues (debt, fraud)
- **ARCHIVED**: Archived, hidden from searches

### Customer Code Format
```
CUST-{SEQUENCE}
Example: CUST-00001
```

### CustomerSource Choices
- **MANUAL**: Manually created by staff
- **POS**: Created from POS transaction
- **WEBSTORE**: Registered via webstore
- **IMPORT**: Imported from CSV/external system

### Financial Summary Fields
- total_purchases: Sum of all order totals
- total_payments: Sum of all payments
- outstanding_balance: total_purchases - total_payments
- These are denormalized for performance

### Database Indexes
- customer_code (unique)
- email (unique, nullable)
- primary_phone
- (first_name, last_name) composite
- status
- customer_type
- created_at

### Business Customer Requirements
| Field | Required for BUSINESS |
|-------|----------------------|
| company_name | ✅ Yes |
| company_registration | ✅ Yes |
| tax_id | Optional |
| vat_number | Optional |

### Display Name Logic
```
if customer_type == INDIVIDUAL:
    display_name = f"{first_name} {last_name}"
elif customer_type == BUSINESS:
    display_name = company_name
```
