# Group D: Customer & Supplier Models

> **Phase:** 02 - Database Architecture & Multi-Tenancy  
> **SubPhase:** 05 - Tenant Schema Template  
> **Group:** D of G  
> **Tasks Covered:** 45-56  
> **Group Goal:** Create customer and supplier management models

---

## Navigation

- **↑ Parent:** [../00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [../Group-C_Inventory-Stock-Models/](../Group-C_Inventory-Stock-Models/)
- **→ Next Group:** [../Group-E_Order-Invoice-Models/](../Group-E_Order-Invoice-Models/)

---

## Group Overview

This group creates the Customer and Supplier models for managing business relationships. Customers can be individuals or businesses with credit limits, while suppliers have payment terms and tax information.

### Key Outcomes
- Customer model created
- Customer name fields (first, last, business)
- Customer contact fields (phone, email, mobile)
- Customer address fields (billing, shipping)
- Customer type field (individual, business, wholesale)
- Customer credit limit field
- Supplier model created
- Supplier name field
- Supplier contact fields
- Supplier address fields
- Supplier tax ID field
- Supplier payment terms field

### Technology Context
- **Customer Types:** Individual, business, wholesale
- **Credit:** Credit limit for business customers
- **Payment Terms:** Net 30, Net 60, etc.
- **Addresses:** Separate billing and shipping

---

## Documents in This Group

| # | Document | Tasks | Description |
|---|----------|-------|-------------|
| 01 | 01_Tasks-45-50_Customer-Model.md | 45-50 | Customer model, name, contact, address, type, credit limit |
| 02 | 02_Tasks-51-56_Supplier-Model.md | 51-56 | Supplier model, name, contact, address, tax ID, payment terms |

---

## Task Summary

| Task # | Task Name | Dependencies | Complexity |
|--------|-----------|--------------|------------|
| 45 | Create Customer Model | Task 11 | Medium |
| 46 | Add Customer Name Fields | Task 45 | Simple |
| 47 | Add Customer Contact Fields | Task 45 | Simple |
| 48 | Add Customer Address Fields | Task 45 | Medium |
| 49 | Add Customer Type Field | Task 45 | Simple |
| 50 | Add Customer Credit Limit | Task 45 | Simple |
| 51 | Create Supplier Model | Task 45 | Medium |
| 52 | Add Supplier Name Field | Task 51 | Simple |
| 53 | Add Supplier Contact Fields | Task 51 | Simple |
| 54 | Add Supplier Address Fields | Task 51 | Medium |
| 55 | Add Supplier Tax ID Field | Task 51 | Simple |
| 56 | Add Supplier Payment Terms | Task 51 | Simple |

---

## Execution Order

```
01_Tasks-45-50_Customer-Model.md
        │
        ▼
02_Tasks-51-56_Supplier-Model.md
```

---

## Expected Deliverables

After completing this group:

```
backend/
└── apps/
    ├── customers/
    │   ├── models/
    │   │   ├── __init__.py
    │   │   └── customer.py      # Customer model
    │   └── constants.py         # Customer types
    └── suppliers/
        ├── models/
        │   ├── __init__.py
        │   └── supplier.py      # Supplier model
        └── constants.py         # Payment terms
```

---

## Customer Types

| Type | Description |
|------|-------------|
| INDIVIDUAL | Walk-in individual customer |
| BUSINESS | Business/corporate customer |
| WHOLESALE | Wholesale buyer |
| VIP | VIP customer |

---

## Payment Terms

| Term | Description |
|------|-------------|
| IMMEDIATE | Payment due immediately |
| NET_15 | Payment due in 15 days |
| NET_30 | Payment due in 30 days |
| NET_60 | Payment due in 60 days |
| COD | Cash on delivery |

---

## Notes for AI Agents

1. **Dependencies:** Requires Group C complete (inventory exists)
2. **Address Model:** Consider separate Address model
3. **Credit Limit:** Use DecimalField for currency
4. **Tax ID:** Sri Lankan business registration format
5. **Contact Person:** Suppliers need contact person field
6. **Git Commit:** Commit after completing this group

