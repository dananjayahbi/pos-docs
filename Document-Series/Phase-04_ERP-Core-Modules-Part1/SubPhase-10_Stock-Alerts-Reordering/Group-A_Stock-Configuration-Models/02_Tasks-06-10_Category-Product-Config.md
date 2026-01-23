# Tasks 06-10: Global Alert Settings & Configuration Models

> **Phase:** 04 - ERP Core Modules Part 1  
> **SubPhase:** 10 - Stock Alerts & Reordering  
> **Group:** A - Stock Configuration Models  
> **Document:** 02 of 03  
> **Tasks Covered:** 06, 07, 08, 09, 10

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-01-05_Submodule-Global-Settings.md](01_Tasks-01-05_Submodule-Global-Settings.md)
- **→ Next Document:** [03_Tasks-11-16_Warehouse-Inheritance-Admin.md](03_Tasks-11-16_Warehouse-Inheritance-Admin.md)

---

## Document Overview

This document covers adding alert notification settings to GlobalStockSettings, creating category-level configuration overrides with inheritance, and implementing product-specific stock configuration.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 06 | Add global alert settings | Low |
| 07 | Create CategoryStockConfig model | Medium |
| 08 | Add category threshold inheritance | Medium |
| 09 | Create ProductStockConfig model | Medium |
| 10 | Add product config fields | Medium |

---

## Task 06: Add Global Alert Settings

### Overview
Add notification channel configuration fields to GlobalStockSettings to control how alerts are delivered (email, dashboard, SMS).

### Dependencies
- Task 05: Add global threshold fields

### Instructions

1. **Add email_alerts_enabled field**
   - Type: BooleanField
   - Description: Enable email notifications for stock alerts
   - Default: True
   - Help text: "Send email notifications when alerts trigger"

2. **Add email_recipients field**
   - Type: TextField
   - Description: Email addresses for alert notifications
   - Blank: True
   - Help text: "Comma-separated email addresses (e.g., manager@store.lk, owner@store.lk)"

3. **Add dashboard_alerts_enabled field**
   - Type: BooleanField
   - Description: Enable in-app dashboard notifications
   - Default: True
   - Help text: "Show alerts in admin dashboard"

4. **Add sms_alerts_enabled field**
   - Type: BooleanField
   - Description: Enable SMS notifications (optional)
   - Default: False
   - Help text: "Send SMS for critical alerts (requires SMS gateway)"

5. **Add sms_recipients field**
   - Type: CharField
   - Max length: 500
   - Description: Phone numbers for SMS alerts
   - Blank: True
   - Help text: "Comma-separated phone numbers (+94 format)"

6. **Add alert_on_low_stock field**
   - Type: BooleanField
   - Description: Trigger alerts when low threshold reached
   - Default: True
   - Help text: "Send alerts for LOW_STOCK status"

7. **Add alert_on_critical_stock field**
   - Type: BooleanField
   - Description: Trigger alerts for critical stock levels
   - Default: True
   - Help text: "Send alerts for CRITICAL_STOCK status"

8. **Add alert_on_out_of_stock field**
   - Type: BooleanField
   - Description: Trigger alerts when out of stock
   - Default: True
   - Help text: "Send alerts for OUT_OF_STOCK status"

9. **Add alert_on_back_in_stock field**
   - Type: BooleanField
   - Description: Notify when previously OOS product restocked
   - Default: False
   - Help text: "Send notification when stock replenished"

10. **Add webhook_url field**
    - Type: URLField
    - Description: External webhook for alert notifications
    - Blank: True, Null: True
    - Help text: "POST alerts to external system (optional)"

11. **Add alert_throttle_hours field**
    - Type: PositiveIntegerField
    - Description: Minimum hours between repeat alerts
    - Default: 24
    - Validators: MinValueValidator(1), MaxValueValidator(168)
    - Help text: "Prevent alert spam (1-168 hours)"

12. **Add clean method validation**
    - If email_alerts_enabled, validate email_recipients format
    - If sms_alerts_enabled, validate sms_recipients format
    - Validate phone numbers follow Sri Lankan format

### Alert Settings Fields Summary
| Field | Type | Default | Purpose |
|-------|------|---------|---------|
| email_alerts_enabled | BooleanField | True | Enable email notifications |
| email_recipients | TextField | Empty | Email addresses list |
| dashboard_alerts_enabled | BooleanField | True | Enable dashboard alerts |
| sms_alerts_enabled | BooleanField | False | Enable SMS (optional) |
| sms_recipients | CharField | Empty | Phone numbers list |
| alert_on_low_stock | BooleanField | True | Alert on LOW status |
| alert_on_critical_stock | BooleanField | True | Alert on CRITICAL status |
| alert_on_out_of_stock | BooleanField | True | Alert on OOS status |
| alert_on_back_in_stock | BooleanField | False | Alert on restock |
| webhook_url | URLField | Null | External webhook |
| alert_throttle_hours | PositiveIntegerField | 24 | Spam prevention |

### Multi-Channel Notification Strategy
```
Alert Triggered
      │
      ├─→ [Dashboard] (if enabled)
      ├─→ [Email] (if enabled)
      ├─→ [SMS] (if enabled + critical)
      └─→ [Webhook] (if configured)
```

### Sri Lanka-Specific Considerations
- Phone numbers in +94 XX XXX XXXX format
- Email addresses use .lk or international domains
- SMS integration with local providers (e.g., Dialog, Mobitel)
- Consider timezone (Asia/Colombo) for alert scheduling

### Expected Outcome
- Complete notification configuration in GlobalStockSettings
- Multiple channel support (email, dashboard, SMS, webhook)
- Alert type granularity (low, critical, OOS, back in stock)
- Throttling to prevent alert spam

### Verification Checklist
- [ ] All alert setting fields added
- [ ] Appropriate defaults set
- [ ] Validation in clean() method
- [ ] Help text explains each setting
- [ ] Sri Lankan phone format supported

---

## Task 07: Create CategoryStockConfig Model

### Overview
Create the CategoryStockConfig model to allow category-level threshold overrides. Categories can override the global defaults, and child categories can inherit from parent categories.

### Dependencies
- Task 01: Create alerts submodule
- SubPhase-01: Categories (Category model)
- Task 04: GlobalStockSettings model

### Instructions

1. **Create category_config.py model file**
   - Create file in `apps/inventory/alerts/models/`
   - Name: `category_config.py`

2. **Import required modules**
   - Import Django model classes
   - Import Category model from inventory app
   - Import validators
   - Import Optional from typing

3. **Define CategoryStockConfig model class**
   - Inherit from models.Model (tenant-scoped via Category FK)
   - Add docstring explaining category-level overrides

4. **Add category relationship**
   - Type: OneToOneField to Category
   - on_delete: CASCADE
   - related_name: 'stock_config'
   - Help text: "Category for these threshold settings"

5. **Add threshold override fields**
   - low_stock_threshold: PositiveIntegerField, null=True, blank=True
   - reorder_point: PositiveIntegerField, null=True, blank=True
   - reorder_quantity: PositiveIntegerField, null=True, blank=True
   - All nullable to allow inheritance from parent/global

6. **Add inherit_from_parent field**
   - Type: BooleanField
   - Default: True
   - Help text: "Inherit unset values from parent category"

7. **Add alert override fields**
   - alert_on_low_stock: BooleanField, null=True, blank=True
   - alert_on_critical_stock: BooleanField, null=True, blank=True
   - alert_on_out_of_stock: BooleanField, null=True, blank=True

8. **Add timestamps**
   - created_at: Auto-now-add
   - updated_at: Auto-now

9. **Add model Meta class**
   - verbose_name: "Category Stock Configuration"
   - verbose_name_plural: "Category Stock Configurations"
   - db_table: "inventory_category_stock_config"
   - indexes on category for lookups

10. **Add __str__ method**
    - Return: f"Stock Config - {self.category.name}"

11. **Register model in models/__init__.py**
    - Import CategoryStockConfig
    - Add to `__all__` list

### Model Structure
```python
class CategoryStockConfig(models.Model):
    """
    Category-level stock threshold overrides.
    Allows categories to override global settings.
    Supports inheritance from parent categories.
    """
    category = OneToOneField(Category, ...)
    
    # Threshold overrides (nullable)
    low_stock_threshold = ...
    reorder_point = ...
    reorder_quantity = ...
    
    # Inheritance control
    inherit_from_parent = BooleanField(default=True)
    
    # Alert overrides (nullable)
    alert_on_low_stock = ...
    ...
```

### Inheritance Chain
```
GlobalStockSettings (Fallback)
         │
         ▼
Parent CategoryStockConfig
         │
         ▼
Child CategoryStockConfig
```

### Expected Outcome
```
apps/inventory/alerts/models/
├── __init__.py
├── global_settings.py
└── category_config.py        # CategoryStockConfig model
```

### Verification Checklist
- [ ] CategoryStockConfig model created
- [ ] OneToOne relationship with Category
- [ ] Nullable threshold fields for inheritance
- [ ] inherit_from_parent field added
- [ ] Meta class and __str__ method
- [ ] Model registered in __init__.py

---

## Task 08: Add Category Threshold Inheritance

### Overview
Implement the inheritance logic for CategoryStockConfig to resolve effective threshold values from parent categories and global settings.

### Dependencies
- Task 07: Create CategoryStockConfig model

### Instructions

1. **Add get_effective_low_threshold method**
   - Check if low_stock_threshold is set on this config
   - If not and inherit_from_parent=True, check parent category
   - Recursively walk up category tree
   - Fall back to GlobalStockSettings.default_low_threshold

2. **Add get_effective_reorder_point method**
   - Similar inheritance logic for reorder_point
   - Walk up category tree if not set
   - Fall back to global default

3. **Add get_effective_reorder_quantity method**
   - Similar inheritance logic for reorder_quantity
   - Walk up category tree if not set
   - Fall back to global default

4. **Add get_effective_config method**
   - Return dictionary with all effective values
   - Keys: 'low_stock_threshold', 'reorder_point', 'reorder_quantity'
   - Include source: 'category', 'parent_category', or 'global'

5. **Add get_parent_config method**
   - Helper method to get parent category's config
   - Return None if no parent or parent has no config
   - Handle circular reference prevention

6. **Add resolve_inheritance_chain method**
   - Build list of all configs in inheritance chain
   - Start with self, walk up parents, end with global
   - Return ordered list for debugging

7. **Add clean method validation**
   - If reorder_point and low_stock_threshold both set
   - Validate reorder_point >= low_stock_threshold
   - Consider inherited values in validation

8. **Add admin display methods**
   - effective_low_threshold_display: Show effective value + source
   - effective_reorder_point_display: Show effective value + source
   - For better admin UI clarity

### Inheritance Resolution Algorithm
```
def get_effective_low_threshold(self):
    # 1. Check own value
    if self.low_stock_threshold is not None:
        return self.low_stock_threshold
    
    # 2. Check parent if inheritance enabled
    if self.inherit_from_parent:
        parent_config = self.get_parent_config()
        if parent_config:
            return parent_config.get_effective_low_threshold()
    
    # 3. Fall back to global
    global_settings = GlobalStockSettings.get_for_tenant()
    return global_settings.default_low_threshold
```

### Inheritance Examples
| Category | Own Value | Parent Value | Global | Effective | Source |
|----------|-----------|--------------|--------|-----------|--------|
| Electronics | 20 | - | 10 | 20 | Category |
| Laptops | None | 20 | 10 | 20 | Parent |
| Gaming | 5 | 20 | 10 | 5 | Category |
| Accessories | None | None | 10 | 10 | Global |

### Circular Reference Prevention
- Track visited categories during resolution
- Raise error if circular reference detected
- Maximum depth limit (e.g., 10 levels)

### Expected Outcome
- Complete inheritance resolution logic
- Methods return effective values with source tracking
- Prevents infinite loops in category tree
- Clear admin display of inherited values

### Verification Checklist
- [ ] get_effective_* methods implemented
- [ ] Recursive parent lookup working
- [ ] Falls back to global settings
- [ ] Circular reference prevention
- [ ] Validation considers inherited values
- [ ] Admin display methods added

---

## Task 09: Create ProductStockConfig Model

### Overview
Create the ProductStockConfig model for product-specific stock thresholds and alert settings. This is the most specific configuration level, overriding both category and global settings.

### Dependencies
- Task 01: Create alerts submodule
- SubPhase-03: Products (Product model)
- SubPhase-04: Product Variants (Variant model)
- SubPhase-08: Warehouses (Warehouse model)

### Instructions

1. **Create product_config.py model file**
   - Create file in `apps/inventory/alerts/models/`
   - Name: `product_config.py`

2. **Import required modules**
   - Import Django model classes
   - Import Product, Variant models
   - Import Warehouse model
   - Import validators, Optional

3. **Define ProductStockConfig model class**
   - Inherit from models.Model
   - Add comprehensive docstring

4. **Add product relationship**
   - Type: ForeignKey to Product
   - on_delete: CASCADE
   - related_name: 'stock_configs'
   - Help text: "Product for these settings"

5. **Add variant relationship**
   - Type: ForeignKey to Variant
   - on_delete: CASCADE
   - null=True, blank=True
   - related_name: 'stock_config'
   - Help text: "Optional specific variant"

6. **Add warehouse relationship**
   - Type: ForeignKey to Warehouse
   - on_delete: CASCADE
   - null=True, blank=True
   - related_name: 'product_stock_configs'
   - Help text: "Optional warehouse-specific settings"

7. **Add unique constraint in Meta**
   - unique_together: ('product', 'variant', 'warehouse')
   - Ensures one config per product/variant/warehouse combo

8. **Add model Meta class**
   - verbose_name: "Product Stock Configuration"
   - verbose_name_plural: "Product Stock Configurations"
   - db_table: "inventory_product_stock_config"
   - Indexes on product, variant, warehouse

9. **Add __str__ method**
   - Include product name
   - Include variant if set
   - Include warehouse if set
   - Format: "Stock Config - Product [Variant] @ Warehouse"

10. **Add timestamps**
    - created_at: Auto-now-add
    - updated_at: Auto-now
    - last_calculated_at: For reorder calculations

11. **Register model in models/__init__.py**
    - Import ProductStockConfig
    - Add to `__all__` list

### Model Structure
```python
class ProductStockConfig(models.Model):
    """
    Product-specific stock configuration.
    Overrides category and global settings.
    Supports warehouse-specific configurations.
    """
    product = ForeignKey(Product, ...)
    variant = ForeignKey(Variant, null=True, ...)
    warehouse = ForeignKey(Warehouse, null=True, ...)
    
    # Threshold fields (Task 10)
    # Behavior fields (Tasks 12-13)
    # Timestamps
    
    class Meta:
        unique_together = ('product', 'variant', 'warehouse')
```

### Configuration Scope Combinations
| Product | Variant | Warehouse | Scope |
|---------|---------|-----------|-------|
| Set | None | None | All variants, all warehouses |
| Set | Set | None | Specific variant, all warehouses |
| Set | None | Set | All variants, specific warehouse |
| Set | Set | Set | Specific variant, specific warehouse |

### Multi-Warehouse Support
- Each product can have different thresholds per warehouse
- Useful for distributed inventory
- Main warehouse vs retail locations
- Allows location-specific reorder strategies

### Expected Outcome
```
apps/inventory/alerts/models/
├── __init__.py
├── global_settings.py
├── category_config.py
└── product_config.py         # ProductStockConfig model
```

### Verification Checklist
- [ ] ProductStockConfig model created
- [ ] ForeignKeys to Product, Variant, Warehouse
- [ ] unique_together constraint set
- [ ] Meta class with proper names
- [ ] __str__ method handles all cases
- [ ] Model registered in __init__.py

---

## Task 10: Add Product Config Fields

### Overview
Add threshold override fields, calculated fields, and configuration options to the ProductStockConfig model.

### Dependencies
- Task 09: Create ProductStockConfig model

### Instructions

1. **Add low_stock_threshold field**
   - Type: PositiveIntegerField
   - null=True, blank=True
   - Help text: "Low stock alert threshold (overrides category/global)"

2. **Add reorder_point field**
   - Type: PositiveIntegerField
   - null=True, blank=True
   - Help text: "Stock level to trigger reorder (overrides category/global)"

3. **Add reorder_quantity field**
   - Type: PositiveIntegerField
   - null=True, blank=True
   - Help text: "Quantity to suggest when reordering"

4. **Add use_auto_calculation field**
   - Type: BooleanField
   - Default: False
   - Help text: "Calculate reorder point from sales velocity"

5. **Add safety_stock_days field**
   - Type: PositiveIntegerField
   - Default: 7
   - Validators: MinValueValidator(1), MaxValueValidator(90)
   - Help text: "Days of safety stock to maintain"

6. **Add lead_time_days field**
   - Type: PositiveIntegerField
   - null=True, blank=True
   - Help text: "Supplier lead time for this product (days)"

7. **Add preferred_supplier field**
   - Type: ForeignKey to Supplier
   - on_delete: SET_NULL
   - null=True, blank=True
   - Help text: "Preferred supplier for reorders"

8. **Add monitoring_enabled field**
   - Type: BooleanField
   - Default: True
   - Help text: "Include in automated stock monitoring"

9. **Add alert_override fields**
   - alert_on_low_stock: BooleanField, null=True, blank=True
   - alert_on_critical_stock: BooleanField, null=True, blank=True
   - alert_on_out_of_stock: BooleanField, null=True, blank=True

10. **Add calculated_reorder_point field**
    - Type: PositiveIntegerField
    - null=True, blank=True
    - Editable: False
    - Help text: "Auto-calculated reorder point (read-only)"

11. **Add calculated_at timestamp**
    - Type: DateTimeField
    - null=True, blank=True
    - Help text: "When calculations were last updated"

12. **Add notes field**
    - Type: TextField
    - blank=True
    - Help text: "Internal notes about this configuration"

13. **Add clean method validation**
    - Validate reorder_point >= low_stock_threshold (if both set)
    - Validate safety_stock_days reasonable
    - Validate lead_time_days reasonable

### Product Config Fields Summary
| Field | Type | Nullable | Purpose |
|-------|------|----------|---------|
| low_stock_threshold | PositiveIntegerField | Yes | Low stock trigger |
| reorder_point | PositiveIntegerField | Yes | Reorder trigger |
| reorder_quantity | PositiveIntegerField | Yes | Order quantity |
| use_auto_calculation | BooleanField | No | Enable auto calculations |
| safety_stock_days | PositiveIntegerField | No | Safety buffer days |
| lead_time_days | PositiveIntegerField | Yes | Delivery time |
| preferred_supplier | ForeignKey | Yes | Reorder supplier |
| monitoring_enabled | BooleanField | No | Include in monitoring |
| calculated_reorder_point | PositiveIntegerField | Yes | Auto-calculated value |
| calculated_at | DateTimeField | Yes | Calculation timestamp |
| notes | TextField | Yes | Internal notes |

### Auto-Calculation Logic
```
If use_auto_calculation = True:
    daily_velocity = calculate from sales history
    calculated_reorder_point = (daily_velocity × lead_time_days) 
                               + (daily_velocity × safety_stock_days)
```

### Field Priority
1. ProductStockConfig fields (if set)
2. CategoryStockConfig fields (if inherit)
3. GlobalStockSettings defaults

### Expected Outcome
- Complete product configuration model
- Support for manual and auto-calculated thresholds
- Warehouse-specific configuration capability
- Supplier preference for reordering

### Verification Checklist
- [ ] All 13 fields added to model
- [ ] Appropriate validators on fields
- [ ] Auto-calculation support added
- [ ] clean() method validates relationships
- [ ] Help text on all fields
- [ ] Supplier FK relationship works
