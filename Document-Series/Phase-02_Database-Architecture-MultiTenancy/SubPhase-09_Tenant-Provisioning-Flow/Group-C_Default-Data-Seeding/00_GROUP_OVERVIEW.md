# Group C: Default Data Seeding

> **Phase:** 02 - Database Architecture & Multi-Tenancy  
> **SubPhase:** 09 - Tenant Provisioning Flow  
> **Group:** C of F  
> **Tasks Covered:** 29-44  
> **Group Goal:** Seed default data for new tenants including categories, tax rates, and industry templates

---

## Navigation

- **↑ Parent:** [../00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [../Group-B_Schema-Creation-Migrations/](../Group-B_Schema-Creation-Migrations/)
- **→ Next Group:** [../Group-D_Domain-Setup/](../Group-D_Domain-Setup/)

---

## Group Overview

This group creates the data seeding service that populates new tenant schemas with default data. This includes product categories, tax rates, payment methods, units, settings, and industry-specific templates.

### Key Outcomes
- Create TenantDataSeeder class
- Define seeding interface
- Create default categories
- Create Sri Lankan tax rates
- Create payment methods (cash, card, bank)
- Create measurement units
- Create tenant settings
- Create invoice number sequence
- Create order number sequence
- Create default roles
- Create sample location
- Load industry templates
- Create retail template
- Create restaurant template
- Verify seeding complete
- Document data seeding

### Technology Context
- **Fixtures:** JSON data files
- **Templates:** Industry-specific presets
- **Sri Lanka:** LKR, VAT 18%, NBT
- **Sequences:** Auto-incrementing numbers

---

## Documents in This Group

| # | Document | Tasks | Description |
|---|----------|-------|-------------|
| 01 | 01_Tasks-29-34_Service-Categories-Tax.md | 29-34 | Seeder class, interface, categories, tax rates, payment methods, units |
| 02 | 02_Tasks-35-40_Settings-Sequences-Roles.md | 35-40 | Tenant settings, invoice/order sequences, roles, sample location, templates |
| 03 | 03_Tasks-41-44_Industry-Verify-Docs.md | 41-44 | Retail template, restaurant template, verify, documentation |

---

## Task Summary

| Task # | Task Name | Dependencies | Complexity |
|--------|-----------|--------------|------------|
| 29 | Create Data Seeding Service | Task 28 | Medium |
| 30 | Define Seeding Interface | Task 29 | Simple |
| 31 | Create Default Categories | Task 30 | Medium |
| 32 | Create Default Tax Rates | Task 30 | Simple |
| 33 | Create Default Payment Methods | Task 30 | Simple |
| 34 | Create Default Units | Task 30 | Simple |
| 35 | Create Default Tenant Settings | Task 30 | Medium |
| 36 | Create Invoice Number Sequence | Task 30 | Simple |
| 37 | Create Order Number Sequence | Task 30 | Simple |
| 38 | Create Default Roles | Task 30 | Medium |
| 39 | Create Sample Location | Task 38 | Simple |
| 40 | Load Industry Templates | Task 39 | Medium |
| 41 | Retail Template | Task 40 | Medium |
| 42 | Restaurant Template | Task 40 | Medium |
| 43 | Verify Seeding Complete | Task 42 | Simple |
| 44 | Document Data Seeding | Task 43 | Simple |

---

## Execution Order

```
01_Tasks-29-34_Service-Categories-Tax.md
        │
        ▼
02_Tasks-35-40_Settings-Sequences-Roles.md
        │
        ▼
03_Tasks-41-44_Industry-Verify-Docs.md
```

---

## Expected Deliverables

After completing this group:

```
backend/
└── apps/
    └── tenants/
        ├── services/
        │   └── seeding.py
        └── fixtures/
            ├── default_categories.json
            ├── default_tax_rates.json
            ├── default_payment_methods.json
            ├── default_units.json
            ├── default_roles.json
            └── industry_templates/
                ├── retail.json
                └── restaurant.json

docs/
└── provisioning/
    └── data-seeding.md
```

---

## Sri Lankan Tax Rates

```json
[
    {
        "name": "VAT",
        "code": "VAT",
        "rate": 18.00,
        "description": "Value Added Tax",
        "is_active": true
    },
    {
        "name": "No Tax",
        "code": "EXEMPT",
        "rate": 0.00,
        "description": "Tax Exempt",
        "is_active": true
    }
]
```

---

## Industry Templates

| Template | Categories | Payment Methods | Settings |
|----------|------------|-----------------|----------|
| Retail | Electronics, Clothing, Groceries | Cash, Card, Bank | Point-of-sale focused |
| Restaurant | Food, Beverages, Desserts | Cash, Card | Table service, takeaway |
| Wholesale | Bulk categories | Bank, Credit | B2B invoice terms |

---

## Notes for AI Agents

1. **Dependencies:** Requires Group B complete (schema exists)
2. **Sri Lanka:** Use LKR currency, local tax rates
3. **Industry:** Different templates for different businesses
4. **Roles:** Admin, Manager, Cashier, Inventory
5. **Sequences:** Start at 1001 for invoice/order numbers
6. **Git Commit:** Commit after completing this group

