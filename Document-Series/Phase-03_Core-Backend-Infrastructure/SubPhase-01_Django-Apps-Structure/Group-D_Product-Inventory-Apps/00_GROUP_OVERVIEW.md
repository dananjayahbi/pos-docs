# Group D: Product & Inventory Apps

> **Phase:** 03 - Core Backend Infrastructure  
> **SubPhase:** 01 - Django Apps Structure  
> **Group:** D of G  
> **Tasks Covered:** 37-50  
> **Group Goal:** Create products and inventory app structures

---

## Navigation

- **↑ Parent:** [../00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [../Group-C_Tenant-User-Apps/](../Group-C_Tenant-User-Apps/)
- **→ Next Group:** [../Group-E_Sales-Customer-Apps/](../Group-E_Sales-Customer-Apps/)

---

## Group Overview

This group creates the products and inventory apps. The products app manages the product catalog, categories, and variants. The inventory app handles stock levels, locations, and movements.

### Key Outcomes
- Create products app directory
- Create products __init__.py
- Create ProductsConfig apps.py
- Create products models.py placeholder
- Create products admin.py
- Create products urls.py
- Register products in TENANT_APPS
- Create inventory app directory
- Create inventory __init__.py
- Create InventoryConfig apps.py
- Create inventory models.py placeholder
- Create inventory admin.py
- Create inventory urls.py
- Register inventory in TENANT_APPS

### Technology Context
- **Products:** Product, Category, Variant models
- **Inventory:** Stock, Location, StockMovement models
- **Relations:** Inventory references Products

---

## Documents in This Group

| # | Document | Tasks | Description |
|---|----------|-------|-------------|
| 01 | 01_Tasks-37-43_Products-App.md | 37-43 | Products directory, __init__, apps.py, models, admin, urls, register |
| 02 | 02_Tasks-44-50_Inventory-App.md | 44-50 | Inventory directory, __init__, apps.py, models, admin, urls, register |

---

## Task Summary

| Task # | Task Name | Dependencies | Complexity |
|--------|-----------|--------------|------------|
| 37 | Create products App Directory | Task 36 | Simple |
| 38 | Create products __init__.py | Task 37 | Simple |
| 39 | Create products apps.py | Task 38 | Simple |
| 40 | Create products models.py | Task 39 | Simple |
| 41 | Create products admin.py | Task 40 | Simple |
| 42 | Create products urls.py | Task 41 | Simple |
| 43 | Register products in Settings | Task 42 | Simple |
| 44 | Create inventory App Directory | Task 43 | Simple |
| 45 | Create inventory __init__.py | Task 44 | Simple |
| 46 | Create inventory apps.py | Task 45 | Simple |
| 47 | Create inventory models.py | Task 46 | Simple |
| 48 | Create inventory admin.py | Task 47 | Simple |
| 49 | Create inventory urls.py | Task 48 | Simple |
| 50 | Register inventory in Settings | Task 49 | Simple |

---

## Execution Order

```
01_Tasks-37-43_Products-App.md
        │
        ▼
02_Tasks-44-50_Inventory-App.md
```

---

## Expected Deliverables

After completing this group:

```
backend/apps/
├── products/
│   ├── __init__.py
│   ├── apps.py
│   ├── models.py
│   ├── admin.py
│   ├── urls.py
│   └── tests/
│       └── __init__.py
└── inventory/
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
┌─────────────────┐
│   products      │
│                 │
│  Product        │◄──────────────┐
│  Category       │               │
│  Variant        │               │
└─────────────────┘               │
                                  │ ForeignKey
┌─────────────────┐               │
│   inventory     │───────────────┘
│                 │
│  Stock          │
│  Location       │
│  StockMovement  │
└─────────────────┘
```

---

## Model Placeholders

```python
# apps/products/models.py
"""
Product catalog models.

Models:
- Category: Product categories with hierarchy
- Product: Main product model
- ProductVariant: Size, color variations
- ProductImage: Product images
"""
pass  # Will be implemented in Phase-04

# apps/inventory/models.py
"""
Inventory management models.

Models:
- Location: Warehouse, store locations
- Stock: Stock levels per product/location
- StockMovement: Stock transactions
"""
pass  # Will be implemented in Phase-04
```

---

## Notes for AI Agents

1. **Dependencies:** Requires Group C complete
2. **Products First:** Inventory depends on Products
3. **Placeholders:** No model code yet
4. **TENANT_APPS:** Both are per-tenant apps
5. **Documentation:** Add docstrings to files
6. **Git Commit:** Commit after completing this group

