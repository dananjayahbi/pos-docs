# Tasks 11-16: Warehouse Config, Inheritance & Admin

> **Phase:** 04 - ERP Core Modules Part 1  
> **SubPhase:** 10 - Stock Alerts & Reordering  
> **Group:** A - Stock Configuration Models  
> **Document:** 03 of 03  
> **Tasks Covered:** 11, 12, 13, 14, 15, 16

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [02_Tasks-06-10_Category-Product-Config.md](02_Tasks-06-10_Category-Product-Config.md)
- **→ Next Group:** [../Group-B_Stock-Alert-System/](../Group-B_Stock-Alert-System/)

---

## Document Overview

This document covers warehouse-specific configuration options, webstore behavior fields, the complete configuration inheritance chain resolution system, and admin interfaces for managing stock configurations.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 11 | Add warehouse-specific config | Medium |
| 12 | Add auto_hide_when_oos field | Low |
| 13 | Add allow_backorder field | Low |
| 14 | Create config inheritance chain | High |
| 15 | Add get_effective_config method | Medium |
| 16 | Create ProductStockConfig admin | Medium |

---

## Task 11: Add Warehouse-Specific Config

### Overview
Enable ProductStockConfig to support warehouse-specific threshold configurations, allowing different reorder points and alert thresholds per warehouse location.

### Dependencies
- Task 09: Create ProductStockConfig model
- Task 10: Add product config fields
- SubPhase-08: Warehouses (Warehouse model)

### Instructions

1. **Review warehouse FK relationship**
   - Verify warehouse ForeignKey already added in Task 09
   - Ensure null=True, blank=True for optional warehouse scope

2. **Add warehouse_specific helper property**
   - Add property that returns True if warehouse is set
   - Used to identify warehouse-specific configs

3. **Add get_warehouse_name method**
   - Return warehouse name if set
   - Return "All Warehouses" if None
   - Used in admin display and __str__

4. **Update __str__ method**
   - Include warehouse name in string representation
   - Format: "Config: {product} [{variant}] @ {warehouse}"
   - Handle None cases gracefully

5. **Add warehouse validation in clean method**
   - If warehouse is set, validate it's active
   - Validate warehouse belongs to same tenant as product
   - Prevent orphaned warehouse references

6. **Add get_other_warehouse_configs method**
   - Return queryset of other configs for same product
   - Exclude current instance
   - Filter by warehouse if applicable
   - Useful for comparing configs

7. **Add manager method for warehouse lookups**
   - Add custom manager with method: for_warehouse(warehouse)
   - Return configs for specific warehouse
   - Include generic (warehouse=None) configs

8. **Add indexing for warehouse queries**
   - Add database index on warehouse field
   - Composite index on (product, warehouse)
   - Improve query performance

### Warehouse Configuration Scenarios

#### Scenario 1: Single Warehouse Business
```
ProductStockConfig:
  product: "Coffee Beans"
  warehouse: None
  low_stock_threshold: 20
  
→ Applies to all warehouses
```

#### Scenario 2: Multi-Warehouse with Overrides
```
Global Config:
  product: "Laptop XYZ"
  warehouse: None
  low_stock_threshold: 10

Warehouse-Specific Config:
  product: "Laptop XYZ"
  warehouse: "Colombo Showroom"
  low_stock_threshold: 5
  
→ Colombo: threshold = 5
→ Kandy: threshold = 10 (uses global)
```

#### Scenario 3: Different Reorder Points
```
product: "Popular Item"
warehouse: "Main Warehouse"
reorder_point: 100
reorder_quantity: 500

product: "Popular Item"
warehouse: "Retail Outlet"
reorder_point: 10
reorder_quantity: 50

→ Main warehouse orders in bulk
→ Retail outlet orders smaller quantities
```

### Manager Methods
```python
# Get config for specific warehouse
config = ProductStockConfig.objects.for_warehouse(warehouse)

# Get all configs for a product
configs = ProductStockConfig.objects.filter(product=product)

# Get warehouse-specific only
specific = ProductStockConfig.objects.exclude(warehouse=None)
```

### Multi-Tenancy Considerations
- Warehouse FK ensures tenant isolation
- Can't reference warehouse from different tenant
- Validation in clean() prevents cross-tenant references

### Sri Lanka Context
- Main warehouses in Colombo, Kandy, Galle
- Different thresholds for tourist areas
- Seasonal adjustments for regional demand

### Expected Outcome
- Full warehouse-specific configuration support
- Flexible threshold management per location
- Efficient querying and validation
- Clear admin display of warehouse scope

### Verification Checklist
- [ ] Warehouse FK relationship verified
- [ ] warehouse_specific property added
- [ ] get_warehouse_name method implemented
- [ ] __str__ includes warehouse info
- [ ] Warehouse validation in clean()
- [ ] Manager methods for lookups
- [ ] Database indexes added

---

## Task 12: Add auto_hide_when_oos Field

### Overview
Add configuration field to control whether products should be automatically hidden from the webstore when out of stock.

### Dependencies
- Task 10: Add product config fields

### Instructions

1. **Add auto_hide_when_oos field**
   - Type: BooleanField
   - Default: False
   - Help text: "Automatically hide product from webstore when out of stock"

2. **Add auto_show_when_restocked field**
   - Type: BooleanField
   - Default: True
   - Help text: "Automatically show product when restocked"

3. **Add minimum_stock_for_display field**
   - Type: PositiveIntegerField
   - null=True, blank=True
   - Help text: "Minimum stock to display on webstore (None = show at any level)"

4. **Add hide_threshold_days field**
   - Type: PositiveIntegerField
   - Default: 0
   - Help text: "Days to wait before hiding (0 = hide immediately)"

5. **Add display_as_coming_soon field**
   - Type: BooleanField
   - Default: False
   - Help text: "Show as 'Coming Soon' instead of hiding"

6. **Add coming_soon_message field**
   - Type: CharField
   - Max length: 200
   - Default: "Coming Soon"
   - Help text: "Message to display when out of stock"

7. **Add webstore_visibility_override field**
   - Type: CharField
   - Choices: ALWAYS_SHOW, ALWAYS_HIDE, AUTO
   - Default: AUTO
   - Help text: "Manual override for webstore visibility"

8. **Add is_visible_on_webstore method**
   - Calculate current visibility based on stock level
   - Consider all visibility rules
   - Return boolean

9. **Add should_hide_now method**
   - Check if product should be hidden based on rules
   - Consider hide_threshold_days
   - Consider minimum_stock_for_display

10. **Add get_webstore_status method**
    - Return current webstore status as dict
    - Include: visible, reason, message
    - Used for API responses

### Webstore Visibility Logic
```
if webstore_visibility_override == ALWAYS_SHOW:
    return True
elif webstore_visibility_override == ALWAYS_HIDE:
    return False
else:  # AUTO
    if available_stock <= 0 and auto_hide_when_oos:
        if hide_threshold_days == 0:
            return False
        elif days_oos >= hide_threshold_days:
            return False
    if minimum_stock_for_display:
        if available_stock < minimum_stock_for_display:
            return False
    return True
```

### Visibility Scenarios
| Scenario | Stock | auto_hide | min_display | Override | Visible? |
|----------|-------|-----------|-------------|----------|----------|
| Normal | 100 | True | None | AUTO | ✓ Yes |
| Out of Stock | 0 | True | None | AUTO | ✗ No |
| Low Stock | 5 | True | 10 | AUTO | ✗ No |
| OOS + Override | 0 | True | None | ALWAYS_SHOW | ✓ Yes |
| In Stock + Hide | 50 | False | None | ALWAYS_HIDE | ✗ No |
| Coming Soon | 0 | True | None | AUTO | "Coming Soon" |

### Sri Lanka Webstore Considerations
- Display Sinhala "ඉක්මණින් එන්න පුළුවන්" for Coming Soon
- Show expected restock date if known
- Offer pre-order option if allow_backorder enabled
- Regional availability messages

### Expected Outcome
- Flexible webstore visibility control
- Automatic hide/show based on stock
- Manual override capability
- "Coming Soon" display option
- Clear visibility calculation methods

### Verification Checklist
- [ ] All visibility fields added
- [ ] Visibility choices defined
- [ ] is_visible_on_webstore method implemented
- [ ] should_hide_now logic correct
- [ ] get_webstore_status method added
- [ ] Coming soon message support
- [ ] Override functionality works

---

## Task 13: Add allow_backorder Field

### Overview
Add configuration to control whether products can be ordered when out of stock (backorder functionality).

### Dependencies
- Task 10: Add product config fields

### Instructions

1. **Add allow_backorder field**
   - Type: BooleanField
   - Default: False
   - Help text: "Allow orders when out of stock"

2. **Add max_backorder_quantity field**
   - Type: PositiveIntegerField
   - null=True, blank=True
   - Help text: "Maximum units available for backorder (None = unlimited)"

3. **Add backorder_lead_time_days field**
   - Type: PositiveIntegerField
   - Default: 14
   - Help text: "Expected days until backordered item ships"

4. **Add backorder_message field**
   - Type: CharField
   - Max length: 200
   - Default: "Available for backorder"
   - Help text: "Message shown when product is on backorder"

5. **Add show_expected_ship_date field**
   - Type: BooleanField
   - Default: True
   - Help text: "Display estimated ship date for backorders"

6. **Add backorder_notification_email field**
   - Type: BooleanField
   - Default: True
   - Help text: "Email customer when backorder ships"

7. **Add is_available_for_backorder method**
   - Check if backorders allowed
   - Check max_backorder_quantity not exceeded
   - Return boolean

8. **Add get_backorder_capacity method**
   - Calculate remaining backorder capacity
   - Consider current backorders
   - Return available units or None (unlimited)

9. **Add calculate_expected_ship_date method**
   - Calculate ship date based on lead time
   - Consider current date + backorder_lead_time_days
   - Return date object

10. **Add get_backorder_info method**
    - Return dict with backorder details
    - Include: allowed, capacity, lead_time, ship_date, message
    - Used for API and webstore display

### Backorder Logic Flow
```
Customer adds OOS product to cart
         │
         ▼
    Check allow_backorder
         │
         ├─→ False: Show "Out of Stock"
         │
         ▼ True
    Check backorder capacity
         │
         ├─→ Exceeded: Show "Backorder Limit Reached"
         │
         ▼ Available
    Show "Add to Cart (Backorder)"
         │
         ▼
    Display lead time & expected ship date
         │
         ▼
    Order placed → Tagged as BACKORDER
         │
         ▼
    When restocked → Email customer
```

### Backorder Scenarios
| Scenario | allow_backorder | max_qty | current_backorders | Result |
|----------|-----------------|---------|-------------------|---------|
| Standard | False | - | 0 | Not available |
| Unlimited | True | None | 50 | Available (unlimited) |
| Limited | True | 100 | 80 | Available (20 remaining) |
| Maxed Out | True | 50 | 50 | Not available (limit reached) |

### Integration Points
- **Cart/Checkout**: Check backorder status
- **Order Processing**: Tag as BACKORDER status
- **Inventory Management**: Allocate when restocked
- **Notifications**: Email when ready to ship

### Sri Lanka Considerations
- Clear communication about lead times
- Display in Sinhala: "ඇණවුම් කළ හැකිය" (Can be ordered)
- Expected dates in Asia/Colombo timezone
- Consider import lead times for overseas products

### Expected Outcome
- Complete backorder functionality
- Quantity limits and capacity tracking
- Lead time calculation and display
- Customer notification support
- Clear messaging for customers

### Verification Checklist
- [ ] All backorder fields added
- [ ] is_available_for_backorder method works
- [ ] get_backorder_capacity calculates correctly
- [ ] calculate_expected_ship_date implemented
- [ ] get_backorder_info returns complete data
- [ ] Max quantity enforced
- [ ] Default values appropriate

---

## Task 14: Create Config Inheritance Chain

### Overview
Implement the complete configuration inheritance chain resolution system that determines effective config values from Product → Category → Global levels.

### Dependencies
- Task 08: Add category threshold inheritance
- Task 10: Add product config fields
- Task 05: Add global threshold fields

### Instructions

1. **Create config_resolver.py service file**
   - Create file in `apps/inventory/alerts/services/`
   - Name: `config_resolver.py`

2. **Import required models**
   - Import GlobalStockSettings, CategoryStockConfig, ProductStockConfig
   - Import Product, Category models
   - Import typing utilities

3. **Define ConfigResolver service class**
   - Static methods for resolution
   - No instance state needed

4. **Add resolve_for_product static method**
   - Parameters: product, warehouse=None
   - Return resolved configuration dict
   - Follow inheritance chain

5. **Implement resolution algorithm**
   - Step 1: Check ProductStockConfig (specific warehouse)
   - Step 2: Check ProductStockConfig (no warehouse)
   - Step 3: Check CategoryStockConfig (recursive parents)
   - Step 4: Fall back to GlobalStockSettings

6. **Add get_config_source static method**
   - Determine source of each config value
   - Return dict with field → source mapping
   - Sources: 'product', 'product_global', 'category', 'parent_category', 'global'

7. **Add resolve_field static method**
   - Resolve single field value through chain
   - Parameters: field_name, product, warehouse
   - Return: (value, source) tuple

8. **Add get_all_configs_for_product method**
   - Return all applicable configs in order
   - Product-specific (warehouse) → Product-global → Category chain → Global
   - Used for debugging and admin display

9. **Add validate_inheritance_chain method**
   - Check for circular references in categories
   - Validate all FKs exist
   - Return validation errors list

10. **Add build_effective_config method**
    - Combine all resolved values into single dict
    - Include metadata (sources, timestamps)
    - Return complete configuration object

### Inheritance Resolution Algorithm

```
def resolve_for_product(product, warehouse=None):
    config = {}
    sources = {}
    
    # 1. Try ProductStockConfig (warehouse-specific)
    if warehouse:
        prod_config = ProductStockConfig.objects.filter(
            product=product, warehouse=warehouse
        ).first()
        if prod_config:
            apply_config(config, prod_config, sources, 'product_warehouse')
    
    # 2. Try ProductStockConfig (all warehouses)
    prod_config_global = ProductStockConfig.objects.filter(
        product=product, warehouse=None
    ).first()
    if prod_config_global:
        apply_config(config, prod_config_global, sources, 'product')
    
    # 3. Try CategoryStockConfig (walk up tree)
    category = product.category
    while category and not all_fields_set(config):
        cat_config = CategoryStockConfig.objects.filter(
            category=category
        ).first()
        if cat_config:
            apply_config(config, cat_config, sources, f'category:{category.name}')
        category = category.parent if cat_config.inherit_from_parent else None
    
    # 4. Fall back to GlobalStockSettings
    global_settings = GlobalStockSettings.get_for_tenant()
    apply_config(config, global_settings, sources, 'global')
    
    return build_effective_config(config, sources)
```

### Configuration Resolution Example

**Product:** Laptop XYZ (Category: Electronics > Laptops)

```
ProductStockConfig (warehouse: Colombo):
  low_stock_threshold: 5
  reorder_point: None
  reorder_quantity: None

ProductStockConfig (warehouse: None):
  low_stock_threshold: 10
  reorder_point: 15
  reorder_quantity: None

CategoryStockConfig (Laptops):
  low_stock_threshold: None
  reorder_point: None
  reorder_quantity: 30

CategoryStockConfig (Electronics):
  low_stock_threshold: 20
  reorder_point: 25
  reorder_quantity: 50

GlobalStockSettings:
  default_low_threshold: 10
  default_reorder_point: 15
  default_reorder_qty: 50

RESULT for Colombo warehouse:
  low_stock_threshold: 5 (from ProductStockConfig @ Colombo)
  reorder_point: 15 (from ProductStockConfig global)
  reorder_quantity: 30 (from CategoryStockConfig: Laptops)
```

### Performance Optimization
- Cache global settings (rarely changes)
- Cache category configs with TTL
- Use select_related for FK queries
- Consider Redis caching for high-volume stores

### Expected Outcome
```
apps/inventory/alerts/services/
├── __init__.py
└── config_resolver.py        # ConfigResolver service
```

### Verification Checklist
- [ ] ConfigResolver service created
- [ ] resolve_for_product method works
- [ ] Follows correct inheritance order
- [ ] get_config_source tracks sources
- [ ] resolve_field handles single values
- [ ] Validation prevents errors
- [ ] Performance optimized

---

## Task 15: Add get_effective_config Method

### Overview
Add the get_effective_config method to ProductStockConfig model that uses the ConfigResolver service to return the complete effective configuration for a product.

### Dependencies
- Task 14: Create config inheritance chain
- Task 09: Create ProductStockConfig model

### Instructions

1. **Add get_effective_config method to ProductStockConfig**
   - Instance method on ProductStockConfig model
   - Return complete resolved configuration
   - Use ConfigResolver service

2. **Import ConfigResolver service**
   - Add import at top of product_config.py
   - Import from services.config_resolver

3. **Implement method logic**
   - Call ConfigResolver.resolve_for_product()
   - Pass self.product and self.warehouse
   - Return resolved configuration dict

4. **Add effective_* properties**
   - effective_low_threshold property
   - effective_reorder_point property
   - effective_reorder_quantity property
   - Each uses get_effective_config()

5. **Add get_effective_value helper**
   - Get specific field from effective config
   - Parameters: field_name
   - Return: (value, source) tuple

6. **Add display methods for admin**
   - effective_low_threshold_display: Show value + source
   - effective_reorder_point_display: Show value + source
   - Mark as display methods for admin

7. **Add to_dict method**
   - Convert config to dictionary
   - Include own values and effective values
   - Include sources for each field

8. **Add refresh_effective_config method**
   - Recalculate effective configuration
   - Update calculated fields if auto-calculation enabled
   - Save timestamps

9. **Add compare_to_effective method**
   - Compare own values to effective values
   - Highlight differences
   - Useful for admin and debugging

10. **Add signal handler for cache invalidation**
    - When ProductStockConfig saved, clear related caches
    - When CategoryStockConfig changed, clear product caches
    - When GlobalStockSettings changed, clear all caches

### Method Implementations

```python
def get_effective_config(self):
    """
    Get complete effective configuration with inheritance resolution.
    Returns dict with all threshold values and their sources.
    """
    from apps.inventory.alerts.services.config_resolver import ConfigResolver
    return ConfigResolver.resolve_for_product(
        product=self.product,
        warehouse=self.warehouse
    )

@property
def effective_low_threshold(self):
    """Get effective low stock threshold value."""
    config = self.get_effective_config()
    return config.get('low_stock_threshold')

@property
def effective_reorder_point(self):
    """Get effective reorder point value."""
    config = self.get_effective_config()
    return config.get('reorder_point')

def effective_low_threshold_display(self):
    """Display for admin showing value and source."""
    config = self.get_effective_config()
    value = config.get('low_stock_threshold')
    source = config.get('sources', {}).get('low_stock_threshold', 'unknown')
    return f"{value} (from {source})"
```

### Effective Config Structure
```json
{
    "low_stock_threshold": 10,
    "reorder_point": 15,
    "reorder_quantity": 50,
    "safety_stock_days": 7,
    "lead_time_days": 14,
    "sources": {
        "low_stock_threshold": "product",
        "reorder_point": "category:Laptops",
        "reorder_quantity": "global",
        "safety_stock_days": "global",
        "lead_time_days": "product"
    },
    "metadata": {
        "resolved_at": "2024-01-15T10:30:00Z",
        "cache_key": "config:product:123:warehouse:5"
    }
}
```

### Admin Display Integration
- Show effective values in list display
- Show sources in tooltips or separate column
- Highlight when own value differs from effective
- Add action to "View Inheritance Chain"

### Caching Strategy
- Cache effective configs with key: `config:product:{id}:warehouse:{id}`
- TTL: 1 hour (configurable)
- Invalidate on related model saves
- Consider tenant-specific cache keys

### Expected Outcome
- Easy access to effective configuration
- Clear source tracking
- Admin-friendly display methods
- Efficient caching
- Cache invalidation on changes

### Verification Checklist
- [ ] get_effective_config method added
- [ ] effective_* properties implemented
- [ ] display methods for admin created
- [ ] to_dict method serializes config
- [ ] refresh_effective_config works
- [ ] compare_to_effective highlights differences
- [ ] Caching implemented
- [ ] Signal handlers for invalidation

---

## Task 16: Create ProductStockConfig Admin

### Overview
Create comprehensive Django admin interface for ProductStockConfig with inline editing, bulk actions, and effective configuration display.

### Dependencies
- Task 15: Add get_effective_config method
- Task 09: Create ProductStockConfig model

### Instructions

1. **Update admin.py file**
   - Import ProductStockConfig, CategoryStockConfig, GlobalStockSettings
   - Import admin utilities

2. **Create ProductStockConfigAdmin class**
   - Register with admin.site
   - Inherit from admin.ModelAdmin

3. **Configure list display**
   - product name
   - variant (if applicable)
   - warehouse name
   - low_stock_threshold with effective value
   - reorder_point with effective value
   - monitoring_enabled
   - auto_hide_when_oos
   - allow_backorder

4. **Add list filters**
   - monitoring_enabled
   - auto_hide_when_oos
   - allow_backorder
   - use_auto_calculation
   - warehouse (with None option)
   - product__category

5. **Add search fields**
   - product__name
   - product__sku
   - variant__sku
   - warehouse__name
   - notes

6. **Configure fieldsets**
   - Product Information: product, variant, warehouse
   - Threshold Settings: low_stock_threshold, reorder_point, reorder_quantity
   - Auto-Calculation: use_auto_calculation, safety_stock_days, lead_time_days
   - Webstore Behavior: auto_hide_when_oos, webstore_visibility_override
   - Backorder Settings: allow_backorder, max_backorder_quantity
   - Advanced: monitoring_enabled, preferred_supplier, notes

7. **Add readonly fields**
   - effective_low_threshold_display
   - effective_reorder_point_display
   - effective_reorder_quantity_display
   - calculated_reorder_point
   - calculated_at
   - created_at, updated_at

8. **Add bulk actions**
   - Enable monitoring
   - Disable monitoring
   - Enable auto-hide when OOS
   - Disable auto-hide when OOS
   - Recalculate effective configs

9. **Add custom actions**
   - "View Inheritance Chain" - Show full resolution
   - "Bulk Update Thresholds" - Mass update form
   - "Apply Category Defaults" - Copy from category config
   - "Sync to All Warehouses" - Duplicate config

10. **Add inline for Product admin**
    - ProductStockConfigInline
    - Show existing configs for product
    - Allow adding new warehouse-specific configs

11. **Add list select related**
    - Optimize queries with select_related
    - Include product, variant, warehouse, preferred_supplier

12. **Add custom admin methods**
    - get_effective_display: Show effective vs actual
    - has_overrides: Highlight custom configs
    - inheritance_status: Show inheritance chain link

### Admin List Display Layout
| Product | Variant | Warehouse | Low Threshold | Reorder Point | Monitoring | Auto-Hide | Backorder |
|---------|---------|-----------|---------------|---------------|------------|-----------|-----------|
| Coffee Beans | 1kg | All | 20 (20) | 30 (30) | ✓ | ✗ | ✗ |
| Laptop | 15" | Colombo | 5 (10) | None (15) | ✓ | ✓ | ✗ |

*Values in parentheses show effective values when different from set value*

### Bulk Actions
```python
@admin.action(description="Enable stock monitoring")
def enable_monitoring(modeladmin, request, queryset):
    updated = queryset.update(monitoring_enabled=True)
    modeladmin.message_user(
        request, 
        f"Enabled monitoring for {updated} configs."
    )

@admin.action(description="Recalculate effective configs")
def recalculate_configs(modeladmin, request, queryset):
    for config in queryset:
        config.refresh_effective_config()
    modeladmin.message_user(
        request,
        f"Recalculated {queryset.count()} configurations."
    )
```

### CategoryStockConfig Admin
- Simpler admin interface
- Show category tree hierarchy
- Inline edit of thresholds
- "Inherit from Parent" toggle visible
- List affected products count

### GlobalStockSettings Admin
- Singleton-like editing (one per tenant)
- Organized fieldsets for thresholds and alerts
- Test notification buttons
- Show statistics (products using defaults)
- Email/SMS validation

### Sri Lanka Admin Enhancements
- Phone number formatting for SMS recipients
- Email validation for .lk domains
- Warehouse names in Sinhala (optional display)
- Currency display as LKR ₨

### Expected Outcome
```
apps/inventory/alerts/
└── admin.py                  # Complete admin interfaces
```

### Verification Checklist
- [ ] ProductStockConfigAdmin registered
- [ ] List display with effective values
- [ ] Filters and search working
- [ ] Fieldsets organized logically
- [ ] Bulk actions implemented
- [ ] Custom actions added
- [ ] Inline for Product admin
- [ ] CategoryStockConfig admin created
- [ ] GlobalStockSettings admin created
- [ ] Query optimization with select_related
- [ ] Help text and descriptions clear
- [ ] Sri Lankan formatting applied
