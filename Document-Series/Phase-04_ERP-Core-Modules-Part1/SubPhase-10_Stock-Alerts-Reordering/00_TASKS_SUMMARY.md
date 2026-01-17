# SubPhase-10: Stock Alerts & Reordering - Tasks Summary

> **Phase:** 04 - ERP Core Modules Part 1  
> **SubPhase:** 10 of 10  
> **SubPhase Goal:** Implement automated stock monitoring, alerts, and reorder suggestions  
> **Total Tasks:** 86 | **Status:** Planning

---

## Navigation

- **↑ Parent:** [Phase-04 Summary](../00_SUBPHASES_SUMMARY.md)
- **← Previous SubPhase:** [SubPhase-09: Inventory Management](../SubPhase-09_Inventory-Management/)
- **→ Next Phase:** [Phase-05: ERP Core Modules Part 2](../../Phase-05_ERP-Core-Modules-Part2/)

---

## SubPhase Overview

This sub-phase implements the automated inventory monitoring and alerting system for LankaCommerce Cloud. The system provides configurable low stock thresholds, automatic alert notifications (email, dashboard, SMS), reorder point management with suggested quantities, and automated handling of out-of-stock products on the webstore. This completes the inventory module by adding proactive stock management capabilities.

### Key Outcomes
- ProductStockConfig model for per-product threshold settings
- StockAlert model for tracking and managing alerts
- Automated Celery tasks for stock level monitoring
- Multi-channel notifications (email, dashboard, optional SMS)
- Reorder suggestion calculations based on sales velocity
- Webstore visibility management for out-of-stock products

### Dependencies
- SubPhase-04: Product Variants (Product/Variant FKs)
- SubPhase-08: Warehouse & Locations (Warehouse FK)
- SubPhase-09: Inventory Management (StockLevel model)
- Phase-03: Celery for scheduled tasks, notification system

---

## Execution Flow Diagram

```
[Group A: Stock Configuration Models]
         │
         ▼
[Group B: Stock Alert System]
         │
         ▼
[Group C: Scheduled Monitoring Tasks]
         │
         ▼
[Group D: Reorder Suggestions & Automation]
         │
         ▼
[Group E: Serializers & API Views]
         │
         ▼
[Group F: Testing & Documentation]
```

---

## Task Index

### Group A: Stock Configuration Models (Tasks 01-16)

Configuration models for stock thresholds and settings.

| Task # | Task Name | Description | Est. Time |
|--------|-----------|-------------|-----------|
| 01 | Create alerts submodule | Create `apps/inventory/alerts/` package with __init__.py | 10 min |
| 02 | Define threshold type constants | Create constants for GLOBAL, CATEGORY, PRODUCT level thresholds | 10 min |
| 03 | Define stock status constants | Create constants: NORMAL, LOW, CRITICAL, OUT_OF_STOCK | 10 min |
| 04 | Create GlobalStockSettings model | Tenant-level default thresholds for all products | 25 min |
| 05 | Add global threshold fields | Add default_low_threshold, default_reorder_point, default_reorder_qty | 15 min |
| 06 | Add global alert settings | Add email_alerts_enabled, dashboard_alerts_enabled, sms_enabled | 15 min |
| 07 | Create CategoryStockConfig model | Category-level threshold overrides | 25 min |
| 08 | Add category threshold inheritance | Categories inherit from parent if not set | 20 min |
| 09 | Create ProductStockConfig model | Product-level threshold settings | 30 min |
| 10 | Add product config fields | Add low_stock_threshold, reorder_point, reorder_quantity fields | 20 min |
| 11 | Add warehouse-specific config | Optional warehouse FK for per-warehouse thresholds | 20 min |
| 12 | Add auto_hide_when_oos field | Auto-hide product from webstore when out of stock | 15 min |
| 13 | Add allow_backorder field | Allow orders when out of stock (backorder) | 15 min |
| 14 | Create config inheritance chain | Global → Category → Product config resolution | 30 min |
| 15 | Add get_effective_config method | Return effective config for product/warehouse | 25 min |
| 16 | Create ProductStockConfig admin | Admin with inline config, bulk update actions | 25 min |

---

### Group B: Stock Alert System (Tasks 17-34)

Alert models and notification delivery.

| Task # | Task Name | Description | Est. Time |
|--------|-----------|-------------|-----------|
| 17 | Define alert type constants | Create constants: LOW_STOCK, CRITICAL_STOCK, OUT_OF_STOCK, BACK_IN_STOCK | 10 min |
| 18 | Define alert status constants | Create constants: ACTIVE, ACKNOWLEDGED, RESOLVED, SNOOZED | 10 min |
| 19 | Create StockAlert model | Define model with product FK, alert_type, status fields | 30 min |
| 20 | Add warehouse FK | Alert specific to warehouse or all warehouses (null) | 15 min |
| 21 | Add threshold fields | Store threshold values that triggered alert | 15 min |
| 22 | Add current stock field | Store stock level at time of alert creation | 15 min |
| 23 | Add created/resolved timestamps | Track alert lifecycle timing | 15 min |
| 24 | Add acknowledged_by FK | Track who acknowledged alert | 10 min |
| 25 | Add snooze functionality | Snooze alert until specific datetime | 20 min |
| 26 | Create StockAlert Meta class | Indexes on product, status, created_at | 15 min |
| 27 | Add StockAlert manager | Methods: get_active(), get_by_product(), get_unacknowledged() | 25 min |
| 28 | Create alert deduplication | Prevent duplicate alerts for same product/type | 25 min |
| 29 | Create AlertNotificationService | Service to send notifications across channels | 30 min |
| 30 | Implement email alert | Send stock alert email to configured recipients | 25 min |
| 31 | Implement dashboard notification | Create in-app notification for dashboard | 20 min |
| 32 | Implement SMS alert (optional) | Send SMS for critical stock alerts | 25 min |
| 33 | Create alert templates | Email/notification templates for each alert type | 25 min |
| 34 | Create StockAlert admin | Admin with filters, bulk acknowledge action | 25 min |

---

### Group C: Scheduled Monitoring Tasks (Tasks 35-50)

Celery tasks for automated stock monitoring.

| Task # | Task Name | Description | Est. Time |
|--------|-----------|-------------|-----------|
| 35 | Create stock monitoring task | Celery task to check all product stock levels | 30 min |
| 36 | Add batch processing | Process products in batches to avoid memory issues | 25 min |
| 37 | Implement low stock check | Compare stock level to low_stock_threshold | 20 min |
| 38 | Implement critical stock check | Compare to critical threshold (50% of low) | 20 min |
| 39 | Implement out of stock check | Check for zero/negative available quantity | 15 min |
| 40 | Create alert generation logic | Create StockAlert if threshold breached | 25 min |
| 41 | Create alert resolution logic | Resolve alerts when stock replenished | 25 min |
| 42 | Implement back in stock detection | Detect and alert when OOS product restocked | 20 min |
| 43 | Schedule monitoring task | Configure Celery Beat for periodic execution | 20 min |
| 44 | Add configurable frequency | Tenant-configurable check frequency (hourly/daily) | 20 min |
| 45 | Create monitoring log | Log each monitoring run with stats | 20 min |
| 46 | Add monitoring exclusions | Option to exclude products from monitoring | 20 min |
| 47 | Create warehouse-specific checks | Run checks per warehouse for multi-warehouse | 25 min |
| 48 | Add alert throttling | Limit notifications to prevent spam | 25 min |
| 49 | Create monitoring dashboard data | Provide stats for dashboard widget | 25 min |
| 50 | Add webhook notifications | Send alerts to external systems via webhook | 30 min |

---

### Group D: Reorder Suggestions & Automation (Tasks 51-68)

Reorder point calculations and suggestions.

| Task # | Task Name | Description | Est. Time |
|--------|-----------|-------------|-----------|
| 51 | Create ReorderSuggestion model | Store generated reorder suggestions | 30 min |
| 52 | Add suggestion fields | Add product FK, suggested_qty, suggested_supplier, urgency | 20 min |
| 53 | Add status field | Status: PENDING, CONVERTED_TO_PO, DISMISSED | 15 min |
| 54 | Create SalesVelocityService | Calculate average sales rate for products | 30 min |
| 55 | Implement daily_velocity calculation | Average units sold per day over N days | 25 min |
| 56 | Implement weekly_velocity calculation | Average units sold per week | 20 min |
| 57 | Add seasonality adjustment | Adjust velocity based on seasonal patterns | 30 min |
| 58 | Create ReorderCalculator service | Calculate optimal reorder quantity | 30 min |
| 59 | Implement EOQ calculation | Economic Order Quantity formula | 30 min |
| 60 | Implement safety stock calculation | Safety stock based on lead time variability | 25 min |
| 61 | Create days_until_stockout calculation | Estimate when product will run out | 25 min |
| 62 | Generate reorder suggestions task | Celery task to create suggestions | 30 min |
| 63 | Add suggestion to PO conversion | Create purchase order from suggestion | 30 min |
| 64 | Implement auto-reorder (optional) | Auto-create PO when hitting reorder point | 35 min |
| 65 | Add supplier lead time tracking | Track typical lead time per supplier | 25 min |
| 66 | Create reorder report | Generate report of pending reorder needs | 30 min |
| 67 | Add demand forecasting (basic) | Simple forecast based on historical sales | 35 min |
| 68 | Create reorder calendar view | Calendar showing expected stockouts | 30 min |

---

### Group E: Serializers & API Views (Tasks 69-80)

DRF serializers and viewsets for alerts and reordering.

| Task # | Task Name | Description | Est. Time |
|--------|-----------|-------------|-----------|
| 69 | Create ProductStockConfigSerializer | Serializer for config with inheritance info | 25 min |
| 70 | Create StockAlertSerializer | Serializer with product info, alert details | 25 min |
| 71 | Create ReorderSuggestionSerializer | Serializer with velocity, days until stockout | 25 min |
| 72 | Create AlertDashboardSerializer | Summary serializer for dashboard widget | 20 min |
| 73 | Create ProductStockConfigViewSet | ViewSet for config CRUD operations | 25 min |
| 74 | Create StockAlertViewSet | ViewSet with acknowledge, snooze, resolve actions | 30 min |
| 75 | Create ReorderSuggestionViewSet | ViewSet with convert-to-po action | 30 min |
| 76 | Add alert dashboard endpoint | GET /alerts/dashboard/ for summary stats | 25 min |
| 77 | Add product alerts endpoint | GET /products/{id}/alerts/ for product's alerts | 20 min |
| 78 | Add bulk config update endpoint | PATCH /stock-config/bulk/ for mass updates | 25 min |
| 79 | Add reorder report endpoint | GET /reorder/report/ with filters | 25 min |
| 80 | Add stock health endpoint | GET /inventory/health/ for overall health score | 25 min |

---

### Group F: Testing & Documentation (Tasks 81-86)

Comprehensive testing and documentation.

| Task # | Task Name | Description | Est. Time |
|--------|-----------|-------------|-----------|
| 81 | Create config model tests | Test inheritance chain, effective config | 30 min |
| 82 | Create alert system tests | Test alert creation, deduplication, resolution | 35 min |
| 83 | Create monitoring task tests | Test threshold checks, alert generation | 35 min |
| 84 | Create reorder calculation tests | Test velocity, EOQ, safety stock calculations | 35 min |
| 85 | Create API endpoint tests | Test all ViewSet actions with authentication | 35 min |
| 86 | Write alerts module documentation | Document all models, services, API, configuration | 45 min |

---

## Expected File Structure

```
apps/inventory/alerts/
├── __init__.py
├── models/
│   ├── __init__.py
│   ├── global_settings.py        # Tasks 04-06
│   ├── category_config.py        # Tasks 07-08
│   ├── product_config.py         # Tasks 09-15
│   ├── stock_alert.py            # Tasks 19-28
│   └── reorder_suggestion.py     # Tasks 51-53
├── services/
│   ├── __init__.py
│   ├── config_resolver.py        # Task 14-15
│   ├── notification.py           # Tasks 29-33
│   ├── sales_velocity.py         # Tasks 54-57
│   ├── reorder_calculator.py     # Tasks 58-61
│   └── forecasting.py            # Task 67
├── tasks/
│   ├── __init__.py
│   ├── stock_monitor.py          # Tasks 35-50
│   └── reorder_suggestions.py    # Task 62
├── serializers/
│   ├── __init__.py
│   ├── config.py                 # Task 69
│   ├── alert.py                  # Tasks 70, 72
│   └── reorder.py                # Task 71
├── views/
│   ├── __init__.py
│   ├── config.py                 # Tasks 73, 78
│   ├── alert.py                  # Tasks 74, 76-77
│   └── reorder.py                # Tasks 75, 79-80
├── admin.py                      # Tasks 16, 34
├── urls.py
├── constants.py                  # Tasks 02, 03, 17, 18
└── templates/
    └── emails/
        ├── low_stock_alert.html  # Task 33
        ├── critical_stock.html
        └── back_in_stock.html
```

---

## Progress Tracking

| Group | Description | Tasks | Completed | Status |
|-------|-------------|-------|-----------|--------|
| A | Stock Configuration Models | 16 | 0 | 🔴 Not Started |
| B | Stock Alert System | 18 | 0 | 🔴 Not Started |
| C | Scheduled Monitoring Tasks | 16 | 0 | 🔴 Not Started |
| D | Reorder Suggestions & Automation | 18 | 0 | 🔴 Not Started |
| E | Serializers & API Views | 12 | 0 | 🔴 Not Started |
| F | Testing & Documentation | 6 | 0 | 🔴 Not Started |
| **Total** | | **86** | **0** | 🔴 |

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

### Alert Types
| Type | Trigger Condition | Priority |
|------|-------------------|----------|
| LOW_STOCK | stock ≤ low_stock_threshold | Medium |
| CRITICAL_STOCK | stock ≤ low_stock_threshold × 0.5 | High |
| OUT_OF_STOCK | available_quantity ≤ 0 | Critical |
| BACK_IN_STOCK | Was OOS, now stock > 0 | Info |

### Alert Status Flow
```
         ┌──────────────────┐
         │      ACTIVE      │ ← Alert created
         └────────┬─────────┘
                  │
      ┌───────────┼───────────┐
      │           │           │
      ▼           ▼           ▼
┌──────────┐ ┌──────────┐ ┌──────────┐
│ACKNOWLEDGED│ │ SNOOZED │ │ RESOLVED │
└──────────┘ └──────────┘ └──────────┘
      │           │
      │           │ (snooze expires)
      │           │
      ▼           ▼
    Stays → Back to ACTIVE
```

### Stock Health Score Calculation
```python
def calculate_health_score(tenant):
    total_products = Product.objects.filter(tenant=tenant).count()
    
    oos_count = StockLevel.objects.filter(
        tenant=tenant, available_quantity__lte=0
    ).count()
    
    low_count = StockAlert.objects.filter(
        tenant=tenant, status='ACTIVE', alert_type='LOW_STOCK'
    ).count()
    
    # Health score: 100 = perfect, 0 = critical
    oos_penalty = (oos_count / total_products) * 50
    low_penalty = (low_count / total_products) * 30
    
    score = 100 - oos_penalty - low_penalty
    return max(0, min(100, score))
```

### Sales Velocity Calculation
```python
def calculate_daily_velocity(product, days=30):
    """Average units sold per day over the last N days."""
    start_date = timezone.now() - timedelta(days=days)
    
    total_sold = StockMovement.objects.filter(
        product=product,
        movement_type='STOCK_OUT',
        movement_reason='SALE',
        created_at__gte=start_date
    ).aggregate(total=Sum('quantity'))['total'] or 0
    
    return Decimal(total_sold) / Decimal(days)
```

### Days Until Stockout
```python
def days_until_stockout(product, warehouse=None):
    """Estimate days until product runs out of stock."""
    velocity = calculate_daily_velocity(product)
    
    if velocity <= 0:
        return None  # No sales, infinite days
    
    stock_query = StockLevel.objects.filter(product=product)
    if warehouse:
        stock_query = stock_query.filter(warehouse=warehouse)
    
    available = stock_query.aggregate(
        total=Sum('available_quantity')
    )['total'] or 0
    
    return int(available / velocity)
```

### Economic Order Quantity (EOQ)
```python
def calculate_eoq(annual_demand, ordering_cost, holding_cost_per_unit):
    """
    EOQ = sqrt((2 × D × S) / H)
    
    Where:
    D = Annual demand (units)
    S = Ordering cost per order (LKR)
    H = Holding cost per unit per year (LKR)
    """
    from math import sqrt
    
    return sqrt((2 * annual_demand * ordering_cost) / holding_cost_per_unit)
```

### Safety Stock Formula
```python
def calculate_safety_stock(avg_lead_time_days, lead_time_std_dev, 
                           daily_demand, demand_std_dev, service_level=0.95):
    """
    Safety Stock = Z × sqrt(LT × σ_d² + D² × σ_LT²)
    
    Where:
    Z = Service level factor (1.65 for 95%)
    LT = Average lead time
    σ_d = Standard deviation of demand
    D = Average daily demand
    σ_LT = Standard deviation of lead time
    """
    from math import sqrt
    from scipy.stats import norm
    
    z = norm.ppf(service_level)
    
    variance = (avg_lead_time_days * demand_std_dev ** 2) + \
               (daily_demand ** 2 * lead_time_std_dev ** 2)
    
    return z * sqrt(variance)
```

### Monitoring Task Schedule
```python
# Celery Beat schedule configuration
CELERY_BEAT_SCHEDULE = {
    'stock-monitor-hourly': {
        'task': 'apps.inventory.alerts.tasks.run_stock_monitoring',
        'schedule': crontab(minute=0),  # Every hour
    },
    'generate-reorder-suggestions': {
        'task': 'apps.inventory.alerts.tasks.generate_reorder_suggestions',
        'schedule': crontab(hour=6, minute=0),  # Daily at 6 AM
    },
}
```

### Alert Email Template Variables
```python
email_context = {
    'product_name': alert.product.name,
    'product_sku': alert.product.sku,
    'warehouse': alert.warehouse.name if alert.warehouse else 'All',
    'current_stock': alert.current_stock,
    'threshold': alert.threshold_value,
    'alert_type': alert.get_alert_type_display(),
    'created_at': alert.created_at,
    'days_until_stockout': calculate_days_until_stockout(),
    'suggested_reorder_qty': suggestion.suggested_qty if suggestion else None,
}
```

---

## Phase 04 Completion Summary

With SubPhase-10 complete, **Phase 04: ERP Core Modules Part 1** provides:

| SubPhase | Module | Key Deliverables |
|----------|--------|------------------|
| 01 | Categories | Hierarchical categories with MPTT |
| 02 | Attributes | Flexible product attributes |
| 03 | Products | Core product model with types |
| 04 | Variants | Variable products with SKU |
| 05 | Bundles | Bundle and composite products |
| 06 | Pricing | Multi-tier pricing with tax |
| 07 | Media | Image processing and galleries |
| 08 | Warehouses | Multi-warehouse with locations |
| 09 | Inventory | Stock levels and movements |
| 10 | Alerts | Monitoring and reordering |

---

## Changelog

| Date | Author | Changes |
|------|--------|---------|
| TBD | AI Agent | Initial task summary creation |
