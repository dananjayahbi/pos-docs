# Tasks 17-22: Alert Constants & Stock Alert Model

> **Phase:** 04 - ERP Core Modules Part 1  
> **SubPhase:** 10 - Stock Alerts & Reordering  
> **Group:** B - Stock Alert System  
> **Document:** 01 of 03  
> **Tasks Covered:** 17, 18, 19, 20, 21, 22

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-23-28_Lifecycle-Manager-Deduplication.md](02_Tasks-23-28_Lifecycle-Manager-Deduplication.md)

---

## Document Overview

This document covers the foundation of the stock alert system: defining alert type and status constants, creating the StockAlert model, and adding core tracking fields.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 17 | Define alert type constants | Low |
| 18 | Define alert status constants | Low |
| 19 | Create StockAlert model | Medium |
| 20 | Add warehouse FK | Low |
| 21 | Add threshold fields | Low |
| 22 | Add current stock field | Low |

---

## Task 17: Define Alert Type Constants

### Overview
Create constants to identify different types of stock alerts based on severity and trigger conditions.

### Dependencies
- Group A, Task 01: Create alerts submodule

### Instructions

1. **Open constants.py file**
   - Navigate to `apps/inventory/alerts/constants.py`
   - Add new section for alert types

2. **Define LOW_STOCK alert constant**
   - Name: `ALERT_TYPE_LOW_STOCK`
   - Value: `'low_stock'`
   - Triggered when: stock ≤ low_stock_threshold

3. **Define CRITICAL_STOCK alert constant**
   - Name: `ALERT_TYPE_CRITICAL_STOCK`
   - Value: `'critical_stock'`
   - Triggered when: stock ≤ low_stock_threshold × 0.5

4. **Define OUT_OF_STOCK alert constant**
   - Name: `ALERT_TYPE_OUT_OF_STOCK`
   - Value: `'out_of_stock'`
   - Triggered when: available_quantity ≤ 0

5. **Define BACK_IN_STOCK alert constant**
   - Name: `ALERT_TYPE_BACK_IN_STOCK`
   - Value: `'back_in_stock'`
   - Triggered when: was OOS, now stock > 0

6. **Create alert type choices tuple**
   - Name: `ALERT_TYPE_CHOICES`
   - Include all four types with labels
   - Format: (value, display_name) pairs

7. **Add priority mapping dictionary**
   - Name: `ALERT_TYPE_PRIORITY`
   - Map each type to priority level
   - LOW_STOCK: 2, CRITICAL_STOCK: 3, OUT_OF_STOCK: 4, BACK_IN_STOCK: 1

8. **Add color mapping for UI**
   - Name: `ALERT_TYPE_COLORS`
   - Map types to color codes
   - For dashboard display

### Alert Types Specification

| Constant | Value | Trigger Condition | Priority | Color |
|----------|-------|-------------------|----------|-------|
| ALERT_TYPE_LOW_STOCK | `'low_stock'` | stock ≤ threshold | Medium | Yellow/Warning |
| ALERT_TYPE_CRITICAL_STOCK | `'critical_stock'` | stock ≤ threshold × 0.5 | High | Orange/Danger |
| ALERT_TYPE_OUT_OF_STOCK | `'out_of_stock'` | available_qty ≤ 0 | Critical | Red/Critical |
| ALERT_TYPE_BACK_IN_STOCK | `'back_in_stock'` | Was OOS, now > 0 | Info | Green/Success |

### Alert Escalation Flow
```
Stock Level Decreasing:
NORMAL → LOW_STOCK → CRITICAL_STOCK → OUT_OF_STOCK

Stock Level Increasing:
OUT_OF_STOCK → BACK_IN_STOCK → NORMAL
```

### Priority Levels Explained
- **Priority 4 (Critical)**: OUT_OF_STOCK - Immediate action required
- **Priority 3 (High)**: CRITICAL_STOCK - Order urgently
- **Priority 2 (Medium)**: LOW_STOCK - Plan to reorder
- **Priority 1 (Info)**: BACK_IN_STOCK - Informational only

### UI Color Scheme
```python
ALERT_TYPE_COLORS = {
    'low_stock': '#FFC107',      # Yellow/Amber
    'critical_stock': '#FF9800', # Orange
    'out_of_stock': '#F44336',   # Red
    'back_in_stock': '#4CAF50'   # Green
}
```

### Expected Outcome
- Four alert type constants defined
- Priority and color mappings created
- Ready for use in StockAlert model
- Clear escalation path documented

### Verification Checklist
- [ ] All four alert types defined
- [ ] ALERT_TYPE_CHOICES tuple created
- [ ] ALERT_TYPE_PRIORITY mapping added
- [ ] ALERT_TYPE_COLORS mapping added
- [ ] Docstrings explain trigger conditions
- [ ] Priority levels documented

---

## Task 18: Define Alert Status Constants

### Overview
Create constants to represent the lifecycle status of stock alerts, from creation to resolution.

### Dependencies
- Group A, Task 01: Create alerts submodule

### Instructions

1. **Add alert status constants section**
   - Add comment header in constants.py
   - Separate from alert type constants

2. **Define ACTIVE status constant**
   - Name: `ALERT_STATUS_ACTIVE`
   - Value: `'active'`
   - Alert is current and unresolved

3. **Define ACKNOWLEDGED status constant**
   - Name: `ALERT_STATUS_ACKNOWLEDGED`
   - Value: `'acknowledged'`
   - Staff has seen and acknowledged alert

4. **Define RESOLVED status constant**
   - Name: `ALERT_STATUS_RESOLVED`
   - Value: `'resolved'`
   - Stock replenished, issue resolved

5. **Define SNOOZED status constant**
   - Name: `ALERT_STATUS_SNOOZED`
   - Value: `'snoozed'`
   - Temporarily hidden until specified time

6. **Create alert status choices tuple**
   - Name: `ALERT_STATUS_CHOICES`
   - Include all four statuses with labels
   - Format for Django model choices

7. **Add status transition rules**
   - Document valid transitions
   - ACTIVE can transition to: ACKNOWLEDGED, SNOOZED, RESOLVED
   - ACKNOWLEDGED can transition to: SNOOZED, RESOLVED
   - SNOOZED automatically returns to: ACTIVE (when expires)

8. **Add status icons mapping**
   - Name: `ALERT_STATUS_ICONS`
   - Map statuses to icon names
   - For UI display

### Alert Status Lifecycle

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
      │           │           │
      │           │ (expires) │
      │           ▼           │
      │      ┌─────────┐     │
      └──────→  ACTIVE  ←────┘
             └─────────┘
                  │
                  ▼
             [RESOLVED]
              (final)
```

### Status Constants Specification

| Constant | Value | Description | Next States |
|----------|-------|-------------|-------------|
| ALERT_STATUS_ACTIVE | `'active'` | Unresolved, needs attention | ACKNOWLEDGED, SNOOZED, RESOLVED |
| ALERT_STATUS_ACKNOWLEDGED | `'acknowledged'` | Seen by staff | SNOOZED, RESOLVED |
| ALERT_STATUS_RESOLVED | `'resolved'` | Issue resolved | None (final) |
| ALERT_STATUS_SNOOZED | `'snoozed'` | Hidden temporarily | ACTIVE (auto) |

### Status Transition Rules
```python
VALID_TRANSITIONS = {
    'active': ['acknowledged', 'snoozed', 'resolved'],
    'acknowledged': ['snoozed', 'resolved'],
    'snoozed': ['active'],  # Automatic when snooze expires
    'resolved': []  # Final state
}
```

### Status Icons
```python
ALERT_STATUS_ICONS = {
    'active': 'alert-circle',
    'acknowledged': 'check-circle',
    'resolved': 'check-circle-fill',
    'snoozed': 'clock'
}
```

### Snooze Behavior
- When status set to SNOOZED, snoozed_until timestamp required
- Celery task checks for expired snoozes
- Auto-transition SNOOZED → ACTIVE when time reached
- User can manually un-snooze early

### Expected Outcome
- Four alert status constants defined
- Status lifecycle documented
- Transition rules clear
- Icon mapping for UI

### Verification Checklist
- [ ] All four statuses defined
- [ ] ALERT_STATUS_CHOICES tuple created
- [ ] Status lifecycle diagram documented
- [ ] Transition rules defined
- [ ] Icon mapping added
- [ ] Snooze behavior explained

---

## Task 19: Create StockAlert Model

### Overview
Create the StockAlert model to track and manage stock alert occurrences with comprehensive tracking of product, type, status, and related information.

### Dependencies
- Task 17: Define alert type constants
- Task 18: Define alert status constants
- SubPhase-03: Products (Product model)
- SubPhase-04: Product Variants (Variant model)

### Instructions

1. **Create stock_alert.py model file**
   - Create file in `apps/inventory/alerts/models/`
   - Name: `stock_alert.py`

2. **Import required modules**
   - Import Django model classes
   - Import Product, Variant models
   - Import User model (for acknowledged_by)
   - Import alert constants
   - Import timezone utilities

3. **Define StockAlert model class**
   - Inherit from models.Model (tenant-scoped via Product FK)
   - Add comprehensive docstring

4. **Add product relationship**
   - Type: ForeignKey to Product
   - on_delete: CASCADE
   - related_name: 'stock_alerts'
   - Help text: "Product that triggered this alert"

5. **Add variant relationship**
   - Type: ForeignKey to Variant
   - on_delete: CASCADE
   - null=True, blank=True
   - related_name: 'stock_alerts'
   - Help text: "Optional specific variant"

6. **Add alert_type field**
   - Type: CharField
   - Max length: 30
   - Choices: ALERT_TYPE_CHOICES
   - Help text: "Type of stock alert"

7. **Add status field**
   - Type: CharField
   - Max length: 30
   - Choices: ALERT_STATUS_CHOICES
   - Default: ALERT_STATUS_ACTIVE
   - Help text: "Current status of alert"

8. **Add priority field**
   - Type: PositiveSmallIntegerField
   - Auto-calculated from alert_type
   - Help text: "Priority level (1=Info, 4=Critical)"

9. **Add message field**
   - Type: TextField
   - blank=True
   - Help text: "Auto-generated alert message"

10. **Add timestamps placeholder**
    - created_at, resolved_at, acknowledged_at (added in Task 23)

11. **Add save method override**
    - Auto-set priority based on alert_type
    - Auto-generate message from template
    - Call super().save()

12. **Add __str__ method**
    - Return: f"{alert_type} - {product.name} ({status})"

13. **Add model Meta class (basic)**
    - verbose_name: "Stock Alert"
    - verbose_name_plural: "Stock Alerts"
    - db_table: "inventory_stock_alert"

14. **Register model in models/__init__.py**
    - Import StockAlert
    - Add to `__all__` list

### Model Structure
```python
class StockAlert(models.Model):
    """
    Tracks stock alert occurrences with lifecycle management.
    Alerts are created when stock thresholds breached.
    Supports acknowledgment, snoozing, and resolution.
    """
    product = ForeignKey(Product, ...)
    variant = ForeignKey(Variant, null=True, ...)
    alert_type = CharField(choices=ALERT_TYPE_CHOICES, ...)
    status = CharField(choices=ALERT_STATUS_CHOICES, ...)
    priority = PositiveSmallIntegerField(...)
    message = TextField(...)
    
    # Additional fields in Tasks 20-22, 23-25
    
    def save(self, *args, **kwargs):
        # Auto-set priority from type
        if not self.priority:
            self.priority = ALERT_TYPE_PRIORITY.get(self.alert_type, 2)
        # Auto-generate message if not set
        if not self.message:
            self.message = self._generate_message()
        super().save(*args, **kwargs)
```

### Message Generation
```python
def _generate_message(self):
    """Generate human-readable alert message."""
    templates = {
        'low_stock': f"{self.product.name} is running low ({self.current_stock} units remaining)",
        'critical_stock': f"CRITICAL: {self.product.name} stock critically low ({self.current_stock} units)",
        'out_of_stock': f"OUT OF STOCK: {self.product.name} is unavailable",
        'back_in_stock': f"{self.product.name} is back in stock ({self.current_stock} units)"
    }
    return templates.get(self.alert_type, "Stock alert")
```

### Multi-Tenancy Considerations
- Tenant-scoped through Product FK
- All queries automatically filtered by tenant schema
- Alerts never leak across tenants

### Expected Outcome
```
apps/inventory/alerts/models/
├── __init__.py
├── global_settings.py
├── category_config.py
├── product_config.py
└── stock_alert.py            # StockAlert model
```

### Verification Checklist
- [ ] StockAlert model created
- [ ] Product and Variant FKs added
- [ ] alert_type and status fields with choices
- [ ] priority field with auto-calculation
- [ ] message field with auto-generation
- [ ] save() override works correctly
- [ ] __str__ method implemented
- [ ] Model registered in __init__.py

---

## Task 20: Add Warehouse FK

### Overview
Add warehouse relationship to StockAlert to track which warehouse location the alert pertains to, supporting multi-warehouse scenarios.

### Dependencies
- Task 19: Create StockAlert model
- SubPhase-08: Warehouses (Warehouse model)

### Instructions

1. **Import Warehouse model**
   - Add import in stock_alert.py
   - Import from apps.inventory.models

2. **Add warehouse field**
   - Type: ForeignKey to Warehouse
   - on_delete: CASCADE
   - null=True, blank=True
   - related_name: 'stock_alerts'
   - Help text: "Warehouse where alert occurred (None = all warehouses)"

3. **Update unique constraint consideration**
   - Note: Same product can have alerts in different warehouses
   - Note: Same product can have multiple alert types simultaneously
   - No unique constraint needed (handled by deduplication logic)

4. **Add warehouse_name property**
   - Return warehouse.name if set
   - Return "All Warehouses" if None

5. **Update __str__ method**
   - Include warehouse in string representation
   - Format: f"{alert_type} - {product.name} @ {warehouse_name} ({status})"

6. **Update _generate_message method**
   - Include warehouse in message if set
   - Example: "Product X is low at Colombo warehouse"

7. **Add get_warehouse_stock_level method**
   - Query StockLevel for product + warehouse
   - Return current stock for that location
   - Used for alert validation

8. **Update Meta indexes**
   - Add index on warehouse field
   - Add composite index: (product, warehouse, alert_type)

### Warehouse Alert Scenarios

#### Scenario 1: All-Warehouse Alert
```python
StockAlert:
  product: "Coffee Beans"
  warehouse: None
  alert_type: OUT_OF_STOCK
  
→ Product out of stock globally
```

#### Scenario 2: Specific Warehouse Alert
```python
StockAlert:
  product: "Laptop"
  warehouse: "Colombo Showroom"
  alert_type: LOW_STOCK
  
→ Low stock at Colombo only
→ Other warehouses may have adequate stock
```

#### Scenario 3: Multiple Warehouse Alerts
```python
Alert 1:
  product: "Monitor"
  warehouse: "Warehouse A"
  alert_type: CRITICAL_STOCK

Alert 2:
  product: "Monitor"
  warehouse: "Warehouse B"
  alert_type: LOW_STOCK

→ Same product, different severity at different locations
```

### Multi-Warehouse Alert Logic
```
When checking stock levels:
1. If warehouse specified in config → Create alert for that warehouse
2. If warehouse=None in config → Check all warehouses
   - If ANY warehouse breaches threshold → Create alert for that warehouse
   - If ALL warehouses breach → Create separate alerts for each
```

### Message Template Updates
```python
def _generate_message(self):
    warehouse_str = f" at {self.warehouse.name}" if self.warehouse else ""
    templates = {
        'low_stock': f"{self.product.name}{warehouse_str} is running low",
        'critical_stock': f"CRITICAL: {self.product.name}{warehouse_str} critically low",
        'out_of_stock': f"OUT OF STOCK: {self.product.name}{warehouse_str}",
        'back_in_stock': f"{self.product.name}{warehouse_str} back in stock"
    }
    return templates.get(self.alert_type, "Stock alert")
```

### Expected Outcome
- Warehouse FK added to StockAlert
- Support for warehouse-specific and global alerts
- Updated string representations and messages
- Improved querying with indexes

### Verification Checklist
- [ ] warehouse ForeignKey added
- [ ] Nullable (supports all-warehouse alerts)
- [ ] warehouse_name property implemented
- [ ] __str__ includes warehouse info
- [ ] _generate_message includes warehouse
- [ ] get_warehouse_stock_level method added
- [ ] Indexes updated for performance

---

## Task 21: Add Threshold Fields

### Overview
Add fields to store the threshold values that triggered the alert, providing context for why the alert was created.

### Dependencies
- Task 19: Create StockAlert model

### Instructions

1. **Add threshold_value field**
   - Type: PositiveIntegerField
   - Help text: "Threshold that was breached to trigger alert"
   - Example: If low_stock_threshold=10, store 10

2. **Add threshold_type field**
   - Type: CharField
   - Max length: 50
   - Help text: "Type of threshold (low_stock, reorder_point, etc.)"

3. **Add threshold_source field**
   - Type: CharField
   - Max length: 50
   - Choices: 'product', 'category', 'global'
   - Help text: "Where the threshold came from in config chain"

4. **Add expected_restock_date field**
   - Type: DateField
   - null=True, blank=True
   - Help text: "Expected date when stock will be replenished"

5. **Add reorder_suggested field**
   - Type: BooleanField
   - Default: False
   - Help text: "Whether reorder suggestion was created"

6. **Add days_until_critical field**
   - Type: PositiveIntegerField
   - null=True, blank=True
   - Help text: "Estimated days until stock becomes critical"

7. **Add velocity_at_alert field**
   - Type: DecimalField
   - Max digits: 10, Decimal places: 2
   - null=True, blank=True
   - Help text: "Daily sales velocity when alert created"

8. **Update save method**
   - Auto-populate threshold_value from effective config
   - Auto-populate threshold_source
   - Calculate days_until_critical from velocity

9. **Add get_threshold_info method**
   - Return dict with threshold details
   - Include value, type, source
   - Used for API responses

10. **Add calculate_days_until_critical method**
    - Use current stock and velocity
    - Calculate days until critical threshold reached
    - Return integer or None

### Threshold Fields Purpose

| Field | Purpose | Example Value |
|-------|---------|---------------|
| threshold_value | Value that was breached | 10 |
| threshold_type | Which threshold | "low_stock_threshold" |
| threshold_source | Config source | "product" |
| expected_restock_date | When restock coming | 2024-01-25 |
| reorder_suggested | Suggestion created | True |
| days_until_critical | Time to critical | 5 days |
| velocity_at_alert | Sales rate | 2.5 units/day |

### Threshold Tracking Example
```python
Alert created for "Coffee Beans":
  threshold_value: 20 (low_stock_threshold)
  threshold_type: "low_stock_threshold"
  threshold_source: "category"  # Came from category config
  current_stock: 18  # Below threshold of 20
  velocity_at_alert: 3.2  # Selling 3.2 units/day
  days_until_critical: 3  # Will hit critical in 3 days at current rate
```

### Days Until Critical Calculation
```python
def calculate_days_until_critical(self):
    """Calculate days until stock becomes critical."""
    if not self.velocity_at_alert or self.velocity_at_alert <= 0:
        return None
    
    critical_threshold = self.threshold_value * 0.5
    stock_to_critical = self.current_stock - critical_threshold
    
    if stock_to_critical <= 0:
        return 0  # Already critical
    
    days = stock_to_critical / float(self.velocity_at_alert)
    return max(0, int(days))
```

### Expected Restock Date Logic
- If reorder suggestion created → Use PO expected delivery
- If supplier lead time known → current_date + lead_time
- Otherwise → null (unknown)

### Expected Outcome
- Complete threshold context stored with alert
- Historical tracking of why alert created
- Urgency calculation (days until critical)
- Reorder tracking

### Verification Checklist
- [ ] All 7 threshold fields added
- [ ] Auto-population in save() method
- [ ] get_threshold_info method returns dict
- [ ] calculate_days_until_critical implemented
- [ ] Expected restock date calculation
- [ ] Velocity tracking for urgency
- [ ] Help text on all fields

---

## Task 22: Add Current Stock Field

### Overview
Add field to store the stock level at the time the alert was created, providing historical context and tracking stock changes over time.

### Dependencies
- Task 19: Create StockAlert model

### Instructions

1. **Add current_stock field**
   - Type: IntegerField (can be negative for overselling scenarios)
   - Help text: "Stock level when alert was created"

2. **Add available_quantity field**
   - Type: IntegerField
   - Help text: "Available quantity (stock - reserved) when alert created"

3. **Add reserved_quantity field**
   - Type: PositiveIntegerField
   - Default: 0
   - Help text: "Quantity reserved in orders when alert created"

4. **Add incoming_quantity field**
   - Type: PositiveIntegerField
   - Default: 0
   - Help text: "Quantity in open purchase orders when alert created"

5. **Add stock_change_since_alert field**
   - Type: IntegerField
   - Default: 0
   - Editable: False
   - Help text: "Stock change since alert created (calculated)"

6. **Add last_stock_check field**
   - Type: DateTimeField
   - null=True, blank=True
   - Help text: "Last time stock level was checked for this alert"

7. **Update save method**
   - Auto-populate current_stock from StockLevel
   - Auto-populate available_quantity
   - Query reserved and incoming quantities

8. **Add get_current_stock_level method**
   - Query current stock from StockLevel
   - Compare to stock when alert created
   - Return dict with current vs. alert-time stock

9. **Add update_stock_change method**
   - Calculate current_stock - alert_time_stock
   - Update stock_change_since_alert field
   - Update last_stock_check timestamp

10. **Add has_stock_improved property**
    - Return True if current stock > alert-time stock
    - Used to trigger auto-resolution

11. **Add stock_status_emoji property**
    - Return emoji based on stock level
    - For dashboard display

### Stock Tracking Fields

| Field | Type | Purpose | Auto-Populated |
|-------|------|---------|----------------|
| current_stock | IntegerField | Stock when alert created | Yes |
| available_quantity | IntegerField | Available (not reserved) | Yes |
| reserved_quantity | PositiveIntegerField | Reserved in orders | Yes |
| incoming_quantity | PositiveIntegerField | In purchase orders | Yes |
| stock_change_since_alert | IntegerField | Change since creation | Calculated |
| last_stock_check | DateTimeField | Last check time | Updated |

### Stock Level Snapshot Example
```python
Alert created:
  current_stock: 8
  available_quantity: 5
  reserved_quantity: 3
  incoming_quantity: 50
  
After 2 days:
  current_stock: 12 (increased)
  stock_change_since_alert: +4
  
After PO received:
  current_stock: 58 (50 units received)
  stock_change_since_alert: +50
  → Trigger auto-resolution
```

### Stock Change Tracking
```python
def update_stock_change(self):
    """Update stock change calculation."""
    from apps.inventory.models import StockLevel
    
    current_level = StockLevel.objects.filter(
        product=self.product,
        warehouse=self.warehouse
    ).first()
    
    if current_level:
        current_stock = current_level.quantity
        self.stock_change_since_alert = current_stock - self.current_stock
        self.last_stock_check = timezone.now()
        self.save(update_fields=['stock_change_since_alert', 'last_stock_check'])
```

### has_stock_improved Property
```python
@property
def has_stock_improved(self):
    """Check if stock has improved since alert created."""
    if self.alert_type == 'out_of_stock':
        return self.stock_change_since_alert > 0
    elif self.alert_type == 'critical_stock':
        return self.stock_change_since_alert > (self.threshold_value * 0.5)
    elif self.alert_type == 'low_stock':
        return self.stock_change_since_alert > self.threshold_value
    return False
```

### Stock Status Emoji (Dashboard Display)
```python
@property
def stock_status_emoji(self):
    """Emoji representation of stock status."""
    if self.alert_type == 'out_of_stock':
        return '🔴'  # Red circle
    elif self.alert_type == 'critical_stock':
        return '🟠'  # Orange circle
    elif self.alert_type == 'low_stock':
        return '🟡'  # Yellow circle
    elif self.alert_type == 'back_in_stock':
        return '🟢'  # Green circle
    return '⚪'  # White circle
```

### Auto-Resolution Trigger
- Monitoring task checks has_stock_improved
- If True and status=ACTIVE → Auto-resolve alert
- Create BACK_IN_STOCK alert if configured

### Expected Outcome
- Complete stock snapshot at alert creation
- Tracking of stock changes over time
- Auto-resolution capability
- Historical stock level data

### Verification Checklist
- [ ] All 6 stock tracking fields added
- [ ] Auto-population in save() method
- [ ] get_current_stock_level method works
- [ ] update_stock_change calculates correctly
- [ ] has_stock_improved property implemented
- [ ] stock_status_emoji for UI
- [ ] Negative stock values supported
- [ ] Stock change tracking functional
