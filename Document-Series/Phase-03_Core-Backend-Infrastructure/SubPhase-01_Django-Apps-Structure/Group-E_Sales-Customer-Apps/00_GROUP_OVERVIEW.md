# Group E: Sales & Customer Apps

> **Phase:** 03 - Core Backend Infrastructure  
> **SubPhase:** 01 - Django Apps Structure  
> **Group:** E of G  
> **Tasks Covered:** 51-64  
> **Group Goal:** Create sales and customers app structures

---

## Navigation

- **↑ Parent:** [../00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [../Group-D_Product-Inventory-Apps/](../Group-D_Product-Inventory-Apps/)
- **→ Next Group:** [../Group-F_Supporting-Module-Apps/](../Group-F_Supporting-Module-Apps/)

---

## Group Overview

This group creates the sales and customers apps. The sales app handles orders, invoices, and payments. The customers app manages customer profiles and purchase history.

### Key Outcomes
- Create sales app directory
- Create sales __init__.py
- Create SalesConfig apps.py
- Create sales models.py placeholder
- Create sales admin.py
- Create sales urls.py
- Register sales in TENANT_APPS
- Create customers app directory
- Create customers __init__.py
- Create CustomersConfig apps.py
- Create customers models.py placeholder
- Create customers admin.py
- Create customers urls.py
- Register customers in TENANT_APPS

### Technology Context
- **Sales:** Order, Invoice, Payment models
- **Customers:** Customer, Address, LoyaltyPoints models
- **Relations:** Sales references Customers and Products

---

## Documents in This Group

| # | Document | Tasks | Description |
|---|----------|-------|-------------|
| 01 | 01_Tasks-51-57_Sales-App.md | 51-57 | Sales directory, __init__, apps.py, models, admin, urls, register |
| 02 | 02_Tasks-58-64_Customers-App.md | 58-64 | Customers directory, __init__, apps.py, models, admin, urls, register |

---

## Task Summary

| Task # | Task Name | Dependencies | Complexity |
|--------|-----------|--------------|------------|
| 51 | Create sales App Directory | Task 50 | Simple |
| 52 | Create sales __init__.py | Task 51 | Simple |
| 53 | Create sales apps.py | Task 52 | Simple |
| 54 | Create sales models.py | Task 53 | Simple |
| 55 | Create sales admin.py | Task 54 | Simple |
| 56 | Create sales urls.py | Task 55 | Simple |
| 57 | Register sales in Settings | Task 56 | Simple |
| 58 | Create customers App Directory | Task 57 | Simple |
| 59 | Create customers __init__.py | Task 58 | Simple |
| 60 | Create customers apps.py | Task 59 | Simple |
| 61 | Create customers models.py | Task 60 | Simple |
| 62 | Create customers admin.py | Task 61 | Simple |
| 63 | Create customers urls.py | Task 62 | Simple |
| 64 | Register customers in Settings | Task 63 | Simple |

---

## Execution Order

```
01_Tasks-51-57_Sales-App.md
        │
        ▼
02_Tasks-58-64_Customers-App.md
```

---

## Expected Deliverables

After completing this group:

```
backend/apps/
├── sales/
│   ├── __init__.py
│   ├── apps.py
│   ├── models.py
│   ├── admin.py
│   ├── urls.py
│   └── tests/
│       └── __init__.py
└── customers/
    ├── __init__.py
    ├── apps.py
    ├── models.py
    ├── admin.py
    ├── urls.py
    └── tests/
        └── __init__.py
```

---

## App Relationships

```
┌─────────────────┐     ┌─────────────────┐
│   customers     │◄────│      sales      │
│                 │     │                 │
│  Customer       │     │  Order          │
│  Address        │     │  OrderItem      │
│  LoyaltyPoints  │     │  Invoice        │
└─────────────────┘     │  Payment        │
                        └─────────────────┘
                               │
                               │ ForeignKey
                               ▼
                        ┌─────────────────┐
                        │   products      │
                        └─────────────────┘
```

---

## Model Placeholders

```python
# apps/sales/models.py
"""
Sales and order management models.

Models:
- Order: Customer orders
- OrderItem: Individual line items
- Invoice: Generated invoices
- Payment: Payment records
- Return: Product returns
"""
pass  # Will be implemented in Phase-04

# apps/customers/models.py
"""
Customer management models.

Models:
- Customer: Customer profiles
- Address: Customer addresses
- CustomerGroup: Customer segments
- LoyaltyPoints: Loyalty program
"""
pass  # Will be implemented in Phase-04
```

---

## Notes for AI Agents

1. **Dependencies:** Requires Group D complete
2. **Customers First:** Sales references Customers
3. **Products Link:** Sales items reference Products
4. **TENANT_APPS:** Both are per-tenant apps
5. **Sri Lanka:** Address model for local format
6. **Git Commit:** Commit after completing this group

