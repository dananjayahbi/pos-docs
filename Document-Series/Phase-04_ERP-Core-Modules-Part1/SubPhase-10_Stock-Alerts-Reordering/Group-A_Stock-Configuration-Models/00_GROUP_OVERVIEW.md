# Group A: Stock Configuration Models

> **Phase:** 04 - ERP Core Modules Part 1  
> **SubPhase:** 10 - Stock Alerts & Reordering  
> **Group:** A of F  
> **Tasks Covered:** 01-16  
> **Group Goal:** Create configuration models for stock thresholds and settings with inheritance

---

## Navigation

- **↑ Parent:** [SubPhase-10 Summary](../00_TASKS_SUMMARY.md)
- **→ Next Group:** [Group B: Stock Alert System](../Group-B_Stock-Alert-System/)

---

## Group Overview

### Key Outcomes

1. **Alerts Submodule Package** - Organized `apps/inventory/alerts/` package structure
2. **Threshold Type Constants** - GLOBAL, CATEGORY, PRODUCT level thresholds
3. **Stock Status Constants** - NORMAL, LOW, CRITICAL, OUT_OF_STOCK statuses
4. **GlobalStockSettings Model** - Tenant-level default thresholds for all products
5. **CategoryStockConfig Model** - Category-level threshold overrides
6. **ProductStockConfig Model** - Product-level threshold settings
7. **Warehouse-Specific Config** - Per-warehouse threshold support
8. **Configuration Inheritance Chain** - Global → Category → Product resolution
9. **get_effective_config Method** - Resolve effective config for product/warehouse
10. **ProductStockConfig Admin** - Admin with inline config, bulk update actions

### Technology Context

| Technology | Purpose |
|------------|---------|
| Django ORM | Configuration models with ForeignKey relationships |
| PostgreSQL | Indexes for efficient config lookups |
| Django Admin | Inline editing with bulk update actions |
| Model Methods | Inheritance chain resolution logic |

---

## Documents in This Group

| # | Document | Tasks | Description |
|---|----------|-------|-------------|
| 01 | `01_Tasks-01-05_Submodule-Global-Settings.md` | 01-05 | Alerts submodule, constants, GlobalStockSettings model |
| 02 | `02_Tasks-06-10_Category-Product-Config.md` | 06-10 | Global alert settings, CategoryStockConfig, ProductStockConfig |
| 03 | `03_Tasks-11-16_Warehouse-Inheritance-Admin.md` | 11-16 | Warehouse-specific config, inheritance chain, admin |

---

## Task Summary

| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 01 | Create alerts submodule | Low | 10 min |
| 02 | Define threshold type constants | Low | 10 min |
| 03 | Define stock status constants | Low | 10 min |
| 04 | Create GlobalStockSettings model | Medium | 25 min |
| 05 | Add global threshold fields | Low | 15 min |
| 06 | Add global alert settings | Low | 15 min |
| 07 | Create CategoryStockConfig model | Medium | 25 min |
| 08 | Add category threshold inheritance | Medium | 20 min |
| 09 | Create ProductStockConfig model | Medium | 30 min |
| 10 | Add product config fields | Medium | 20 min |
| 11 | Add warehouse-specific config | Medium | 20 min |
| 12 | Add auto_hide_when_oos field | Low | 15 min |
| 13 | Add allow_backorder field | Low | 15 min |
| 14 | Create config inheritance chain | High | 30 min |
| 15 | Add get_effective_config method | Medium | 25 min |
| 16 | Create ProductStockConfig admin | Medium | 25 min |

---

## Execution Order

```
[Task 01: Alerts submodule package]
         │
         ▼
[Tasks 02-03: Threshold type and stock status constants]
         │
         ▼
[Tasks 04-06: GlobalStockSettings model with threshold/alert fields]
         │
         ▼
[Tasks 07-08: CategoryStockConfig with inheritance]
         │
         ▼
[Tasks 09-13: ProductStockConfig with all fields]
         │
         ▼
[Tasks 14-15: Config inheritance chain and resolution]
         │
         ▼
[Task 16: Admin interface]
```

---

## Expected Deliverables

```
apps/inventory/alerts/
├── __init__.py
├── models/
│   ├── __init__.py
│   ├── global_settings.py        # Tasks 04-06
│   ├── category_config.py        # Tasks 07-08
│   └── product_config.py         # Tasks 09-15
├── services/
│   ├── __init__.py
│   └── config_resolver.py        # Tasks 14-15
├── constants.py                  # Tasks 02-03
└── admin.py                      # Task 16
```

---

## Notes for AI Agents

### Configuration Inheritance Chain
```
GlobalStockSettings (Tenant-wide defaults)
         │
         ▼
CategoryStockConfig (Category overrides)
         │
         ▼
ProductStockConfig (Product overrides)
         │
         ▼
ProductStockConfig + Warehouse (Warehouse-specific)
```

### GlobalStockSettings Fields
- default_low_threshold: Default low stock threshold
- default_reorder_point: Default reorder point
- default_reorder_qty: Default reorder quantity
- email_alerts_enabled: Enable email notifications
- dashboard_alerts_enabled: Enable dashboard notifications
- sms_enabled: Enable SMS alerts

### ProductStockConfig Fields
- product FK: Link to product
- warehouse FK (optional): For warehouse-specific config
- low_stock_threshold: Custom low stock threshold
- reorder_point: Custom reorder point
- reorder_quantity: Custom reorder quantity
- auto_hide_when_oos: Hide from webstore when out of stock
- allow_backorder: Allow orders when out of stock

### get_effective_config Logic
1. Check ProductStockConfig with specific warehouse
2. Fall back to ProductStockConfig without warehouse
3. Fall back to CategoryStockConfig
4. Fall back to parent CategoryStockConfig (recursively)
5. Fall back to GlobalStockSettings

### Dependencies
- SubPhase-04: Product Variants (Product FK)
- SubPhase-08: Warehouse & Locations (Warehouse FK)
- SubPhase-01: Categories (Category FK)
