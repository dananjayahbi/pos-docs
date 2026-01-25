# Tasks 09-16: ReportDefinition and ReportInstance Models

> **Phase:** 06 - ERP Advanced Modules  
> **SubPhase:** 14 - Analytics & Reports  
> **Group:** A - Report Framework  
> **Document:** 02 of 02  
> **Tasks Covered:** 09, 10, 11, 12, 13, 14, 15, 16

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-01-08_Analytics-App-Enums.md](01_Tasks-01-08_Analytics-App-Enums.md)
- **→ Next Group:** [Group-B_Sales-Reports](../Group-B_Sales-Reports/)

---

## Document Overview

This document covers the creation of the ReportDefinition and ReportInstance models. These models form the core of the analytics system: ReportDefinition defines available report types with their parameters and permissions, while ReportInstance tracks individual generated reports with their status and output files.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 09 | Create ReportDefinition model | Medium | 25 min |
| 10 | Add definition fields | Medium | 20 min |
| 11 | Add definition methods | Medium | 15 min |
| 12 | Run ReportDefinition migrations | Low | 5 min |
| 13 | Create ReportInstance model | Medium | 25 min |
| 14 | Add instance fields | Medium | 20 min |
| 15 | Add instance methods | Medium | 15 min |
| 16 | Run ReportInstance migrations | Low | 5 min |

---

## Task 09: Create ReportDefinition Model

### Overview
Create the ReportDefinition model that defines available report types in the system. Each definition specifies a report's name, category, available filters, required permissions, and default configuration. This model serves as a template for generating report instances.

### Dependencies
- Task 08: Verify enum implementation
- Enums defined (ReportCategory, ReportFormat, ReportStatus)
- TenantAwareMixin available
- TimestampMixin available

### Instructions

1. **Create report_definition.py file**
   - Create file at `apps/analytics/models/report_definition.py`
   - Import necessary Django components

2. **Import required modules**
   - Import Django model fields
   - Import base model mixins (TenantAwareMixin, TimestampMixin)
   - Import analytics enums
   - Import JSONField for filter parameters
   - Import User model for permission field

3. **Define ReportDefinition model class**
   - Inherit from TenantAwareMixin and TimestampMixin
   - Add comprehensive model docstring

4. **Add basic identification fields**
   - name: CharField(max_length=200) - Human-readable name
   - code: CharField(max_length=100, unique_per_tenant) - Unique identifier
   - description: TextField - Detailed report description
   - is_active: BooleanField(default=True) - Enable/disable report

5. **Add category field**
   - category: CharField with ReportCategory choices
   - Required field for report classification
   - Used for filtering and organization

6. **Add default_format field**
   - default_format: CharField with ReportFormat choices
   - Default to ReportFormat.PDF
   - Users can override when generating

7. **Add available_filters field**
   - available_filters: JSONField
   - Defines filter schema for this report
   - Structure: {filter_name: {type, options, required}}
   - Example: date range, product categories, locations

8. **Add required_permission field**
   - required_permission: CharField(max_length=255)
   - Permission codename required to generate
   - Example: "analytics.view_sales_reports"
   - Blank/null allowed for unrestricted reports

9. **Add configuration fields**
   - allows_scheduling: BooleanField(default=True)
   - allows_export: BooleanField(default=True)
   - max_date_range_days: IntegerField(null=True) - Limit date range

10. **Update models/__init__.py**
    - Import ReportDefinition
    - Add to __all__ list

### ReportDefinition Model Structure

```
┌─────────────────────────────────────────────────┐
│         ReportDefinition Model                  │
├─────────────────────────────────────────────────┤
│ Identification:                                 │
│  • name (CharField, 200)                        │
│  • code (CharField, 100, unique)                │
│  • description (TextField)                      │
│  • is_active (BooleanField)                     │
│                                                 │
│ Classification:                                 │
│  • category (ReportCategory enum)               │
│  • default_format (ReportFormat enum)           │
│                                                 │
│ Configuration:                                  │
│  • available_filters (JSONField)                │
│  • required_permission (CharField)              │
│  • allows_scheduling (BooleanField)             │
│  • allows_export (BooleanField)                 │
│  • max_date_range_days (IntegerField)           │
│                                                 │
│ Inherited from TenantAwareMixin:                │
│  • tenant (ForeignKey)                          │
│                                                 │
│ Inherited from TimestampMixin:                  │
│  • created_at (DateTimeField)                   │
│  • updated_at (DateTimeField)                   │
└─────────────────────────────────────────────────┘
```

### Model Relationships

```
┌──────────────┐         1:N          ┌──────────────────────┐
│    Tenant    │◄─────────────────────│  ReportDefinition    │
└──────────────┘                      └──────────────────────┘
                                               │
                                               │ 1:N
                                               ▼
                                      ┌──────────────────────┐
                                      │   ReportInstance     │
                                      └──────────────────────┘
```

### Available Filters Schema Examples

#### Sales Report Filters
```json
{
  "date_range": {
    "type": "date_range",
    "label": "Date Range",
    "required": true,
    "default": "last_30_days"
  },
  "location": {
    "type": "single_select",
    "label": "Location",
    "model": "Warehouse",
    "required": false,
    "allow_multiple": false
  },
  "product_category": {
    "type": "multi_select",
    "label": "Product Categories",
    "model": "ProductCategory",
    "required": false
  },
  "staff_member": {
    "type": "single_select",
    "label": "Staff Member",
    "model": "Staff",
    "required": false
  },
  "payment_method": {
    "type": "choice",
    "label": "Payment Method",
    "choices": ["CASH", "CARD", "MOBILE", "CREDIT"],
    "required": false
  }
}
```

#### Inventory Report Filters
```json
{
  "date": {
    "type": "single_date",
    "label": "Report Date",
    "required": true,
    "default": "today"
  },
  "warehouse": {
    "type": "multi_select",
    "label": "Warehouses",
    "model": "Warehouse",
    "required": false
  },
  "category": {
    "type": "multi_select",
    "label": "Product Categories",
    "model": "ProductCategory",
    "required": false
  },
  "stock_status": {
    "type": "choice",
    "label": "Stock Status",
    "choices": ["ALL", "IN_STOCK", "LOW_STOCK", "OUT_OF_STOCK"],
    "required": false,
    "default": "ALL"
  },
  "include_zero_stock": {
    "type": "boolean",
    "label": "Include Zero Stock Items",
    "required": false,
    "default": false
  }
}
```

#### Customer Report Filters
```json
{
  "date_range": {
    "type": "date_range",
    "label": "Analysis Period",
    "required": true
  },
  "customer_segment": {
    "type": "choice",
    "label": "Customer Segment",
    "choices": ["ALL", "NEW", "RETURNING", "VIP", "INACTIVE"],
    "required": false,
    "default": "ALL"
  },
  "min_purchases": {
    "type": "integer",
    "label": "Minimum Purchase Count",
    "required": false,
    "min_value": 0
  },
  "min_lifetime_value": {
    "type": "decimal",
    "label": "Minimum Lifetime Value (LKR)",
    "required": false,
    "min_value": 0
  }
}
```

### Filter Type Specifications

| Filter Type | Description | Example Use |
|-------------|-------------|-------------|
| date_range | Start and end date selection | Sales period, inventory period |
| single_date | Single date picker | Snapshot reports, specific date |
| single_select | Choose one from list | Location, staff member |
| multi_select | Choose multiple from list | Categories, products, warehouses |
| choice | Fixed set of options | Status, payment method |
| boolean | True/false toggle | Include inactive, show zero stock |
| integer | Numeric integer input | Minimum quantity, top N items |
| decimal | Numeric decimal input | Minimum value, threshold |
| text | Free text input | Search term, notes |

### Report Definition Examples

#### Daily Sales Summary
```python
{
    "name": "Daily Sales Summary",
    "code": "SALES_DAILY_SUMMARY",
    "description": "Comprehensive daily sales report with transactions, revenue, and payment methods.",
    "category": "SALES",
    "default_format": "PDF",
    "available_filters": {
        "date": {
            "type": "single_date",
            "label": "Report Date",
            "required": true
        },
        "location": {
            "type": "single_select",
            "label": "Location",
            "model": "Warehouse",
            "required": false
        }
    },
    "required_permission": "analytics.view_sales_reports",
    "allows_scheduling": True,
    "allows_export": True,
    "max_date_range_days": None
}
```

#### Stock Levels Report
```python
{
    "name": "Current Stock Levels",
    "code": "INVENTORY_STOCK_LEVELS",
    "description": "Real-time stock levels across all warehouses with valuation.",
    "category": "INVENTORY",
    "default_format": "EXCEL",
    "available_filters": {
        "warehouse": {
            "type": "multi_select",
            "label": "Warehouses",
            "model": "Warehouse",
            "required": False
        },
        "category": {
            "type": "multi_select",
            "label": "Categories",
            "model": "ProductCategory",
            "required": False
        },
        "stock_status": {
            "type": "choice",
            "label": "Stock Status",
            "choices": ["ALL", "IN_STOCK", "LOW_STOCK", "OUT_OF_STOCK"],
            "required": False
        }
    },
    "required_permission": "analytics.view_inventory_reports",
    "allows_scheduling": True,
    "allows_export": True,
    "max_date_range_days": None
}
```

### Permission Naming Convention

| Category | Permission Codename | Display Name |
|----------|-------------------|--------------|
| SALES | analytics.view_sales_reports | Can view sales reports |
| INVENTORY | analytics.view_inventory_reports | Can view inventory reports |
| PURCHASE | analytics.view_purchase_reports | Can view purchase reports |
| CUSTOMER | analytics.view_customer_reports | Can view customer reports |
| STAFF | analytics.view_staff_reports | Can view staff reports |
| FINANCIAL | analytics.view_financial_reports | Can view financial reports |
| TAX | analytics.view_tax_reports | Can view tax reports |

### Expected Outcome
- Functional ReportDefinition model
- Flexible filter configuration system
- Permission-based access control
- Foundation for report generation

### Verification Checklist
- [ ] report_definition.py file created
- [ ] ReportDefinition class defined
- [ ] name field added
- [ ] code field added (unique)
- [ ] description field added
- [ ] is_active field added
- [ ] category field with choices
- [ ] default_format field with choices
- [ ] available_filters JSONField added
- [ ] required_permission field added
- [ ] Configuration fields added
- [ ] Model imported in __init__.py

---

## Task 10: Add Definition Fields and Meta

### Overview
Add additional fields to ReportDefinition model including ordering, grouping, and metadata configuration. Configure the Meta class with proper constraints, indexes, and display options.

### Dependencies
- Task 09: Create ReportDefinition model

### Instructions

1. **Open report_definition.py file**
   - Navigate to `apps/analytics/models/report_definition.py`
   - Locate ReportDefinition model class

2. **Add display order field**
   - order: PositiveIntegerField(default=0)
   - Controls display order in UI
   - Lower numbers appear first

3. **Add icon field**
   - icon: CharField(max_length=50, blank=True)
   - Icon name for UI display
   - Example: "fa-chart-line", "fa-box"
   - Uses Font Awesome or similar

4. **Add help_text field**
   - help_text: TextField(blank=True)
   - User-facing help text
   - Explains report purpose and usage

5. **Add sample_output_url field**
   - sample_output_url: URLField(blank=True, null=True)
   - Link to sample report output
   - Helps users understand report format

6. **Add estimated_time_seconds field**
   - estimated_time_seconds: IntegerField(default=60)
   - Estimated generation time
   - Shown to users before generation

7. **Add tags field**
   - tags: JSONField(default=list)
   - Searchable tags for categorization
   - Example: ["daily", "summary", "management"]

8. **Configure Meta class**
   - Set verbose_name and verbose_name_plural
   - Add ordering by category, order, name
   - Add unique_together constraint (tenant, code)
   - Add indexes on category and is_active
   - Add permissions for report viewing

9. **Add __str__ method**
   - Return name field
   - Include category in string representation

10. **Add Meta permissions**
    - Define custom permissions for each category
    - Example: ("view_sales_reports", "Can view sales reports")

### Complete ReportDefinition Meta Class

```python
class Meta:
    verbose_name = "Report Definition"
    verbose_name_plural = "Report Definitions"
    ordering = ['category', 'order', 'name']
    unique_together = [['tenant', 'code']]
    indexes = [
        models.Index(fields=['tenant', 'category']),
        models.Index(fields=['tenant', 'is_active']),
        models.Index(fields=['code']),
    ]
    permissions = [
        ("view_sales_reports", "Can view sales reports"),
        ("view_inventory_reports", "Can view inventory reports"),
        ("view_purchase_reports", "Can view purchase reports"),
        ("view_customer_reports", "Can view customer reports"),
        ("view_staff_reports", "Can view staff reports"),
        ("view_financial_reports", "Can view financial reports"),
        ("view_tax_reports", "Can view tax reports"),
    ]
```

### Display Order Examples

```
Sales Category (order by order field):
  ├── Daily Sales Summary (order: 10)
  ├── Sales by Product (order: 20)
  ├── Sales by Staff (order: 30)
  ├── Sales Trends (order: 40)
  └── Payment Analysis (order: 50)

Inventory Category:
  ├── Stock Levels (order: 10)
  ├── Stock Movement (order: 20)
  ├── Low Stock Alert (order: 30)
  └── Valuation Report (order: 40)
```

### Icon Mapping Examples

| Report Type | Icon | Display |
|------------|------|---------|
| Sales Summary | fa-chart-line | 📈 |
| Inventory | fa-boxes | 📦 |
| Customer Analytics | fa-users | 👥 |
| Financial | fa-dollar-sign | 💰 |
| Tax Reports | fa-file-invoice | 📄 |
| Purchase Orders | fa-shopping-cart | 🛒 |

### Tags Structure Examples

```python
# Sales reports
tags = ["daily", "sales", "revenue", "transactions", "management"]

# Inventory reports
tags = ["stock", "inventory", "warehouse", "valuation", "operations"]

# Customer reports
tags = ["customers", "crm", "loyalty", "segmentation", "marketing"]

# Tax reports
tags = ["tax", "vat", "compliance", "regulatory", "accounting"]
```

### Help Text Examples

#### Daily Sales Summary Help Text
```
This report provides a comprehensive overview of sales for a specific day, 
including:
- Total revenue and transaction count
- Sales breakdown by hour
- Payment method distribution
- Top-selling products
- Staff performance metrics

Use this report for daily operational review and management briefings.
Typically takes 1-2 minutes to generate.
```

#### Stock Levels Help Text
```
Current stock levels across all warehouses with valuation information.

This report shows:
- Current quantity on hand for each product
- Stock value at cost and retail price
- Low stock warnings
- Overstock indicators
- Stock age analysis

Use this report for inventory management and ordering decisions.
Generates immediately for standard catalogs (under 30 seconds).
```

### Database Indexes Strategy

```
┌─────────────────────────────────────────────────┐
│          ReportDefinition Indexes               │
├─────────────────────────────────────────────────┤
│                                                 │
│  Index 1: (tenant, category)                    │
│  Purpose: Fast category filtering               │
│  Query: "Show all sales reports"                │
│                                                 │
│  Index 2: (tenant, is_active)                   │
│  Purpose: Filter active reports                 │
│  Query: "Show only active reports"              │
│                                                 │
│  Index 3: (code)                                │
│  Purpose: Fast lookup by code                   │
│  Query: "Get report by code"                    │
│                                                 │
└─────────────────────────────────────────────────┘
```

### Expected Outcome
- Complete ReportDefinition model structure
- Proper database constraints and indexes
- UI-friendly metadata fields
- Permission system configured

### Verification Checklist
- [ ] order field added
- [ ] icon field added
- [ ] help_text field added
- [ ] sample_output_url field added
- [ ] estimated_time_seconds field added
- [ ] tags field added
- [ ] Meta class configured
- [ ] Ordering defined
- [ ] unique_together constraint set
- [ ] Indexes created
- [ ] Permissions defined
- [ ] __str__ method implemented

---

## Task 11: Add Definition Methods

### Overview
Add utility methods to the ReportDefinition model for validation, filter processing, and permission checking. These methods provide business logic for report generation and access control.

### Dependencies
- Task 10: Add definition fields and Meta

### Instructions

1. **Add get_available_filters method**
   - Returns processed available_filters
   - Resolves model references
   - Adds choice options
   - Used by UI to build filter forms

2. **Add validate_filter_parameters method**
   - Validates user-provided filter parameters
   - Checks required filters present
   - Validates filter value types
   - Returns validation errors if any

3. **Add has_permission method**
   - Checks if user has required permission
   - Takes user object as parameter
   - Returns boolean
   - Handles null permission (unrestricted)

4. **Add get_estimated_time_display method**
   - Formats estimated_time_seconds for display
   - Returns human-readable string
   - Example: "2 minutes", "30 seconds", "5 minutes"

5. **Add get_filter_summary method**
   - Creates human-readable summary of applied filters
   - Takes filter_parameters dictionary
   - Returns formatted string
   - Used for display in UI and reports

6. **Add save method override**
   - Auto-generate code from name if not provided
   - Ensure code is uppercase with underscores
   - Validate category and format values
   - Call parent save method

7. **Add clean method**
   - Validate available_filters JSON structure
   - Validate max_date_range_days is positive
   - Check permission codename format
   - Raise ValidationError if issues found

### Method Implementation Examples

#### get_available_filters Method
```python
def get_available_filters(self):
    """
    Get processed available filters with resolved options.
    
    Returns:
        dict: Processed filters with choices and options.
    """
    filters = self.available_filters.copy()
    
    for filter_name, filter_config in filters.items():
        filter_type = filter_config.get('type')
        
        # Resolve model references for select filters
        if filter_type in ['single_select', 'multi_select']:
            model_name = filter_config.get('model')
            if model_name:
                # Get model choices from database
                model_class = apps.get_model('app_name', model_name)
                choices = model_class.objects.filter(
                    tenant=self.tenant,
                    is_active=True
                ).values_list('id', 'name')
                filter_config['choices'] = list(choices)
        
        # Add default values if not present
        if 'required' not in filter_config:
            filter_config['required'] = False
    
    return filters
```

#### validate_filter_parameters Method
```python
def validate_filter_parameters(self, filter_params):
    """
    Validate provided filter parameters against available filters.
    
    Args:
        filter_params (dict): User-provided filter parameters.
        
    Returns:
        tuple: (is_valid, errors_dict)
    """
    errors = {}
    available = self.available_filters
    
    # Check required filters
    for filter_name, filter_config in available.items():
        if filter_config.get('required', False):
            if filter_name not in filter_params:
                errors[filter_name] = "This filter is required."
    
    # Validate filter values
    for filter_name, filter_value in filter_params.items():
        if filter_name not in available:
            errors[filter_name] = "Unknown filter."
            continue
        
        filter_config = available[filter_name]
        filter_type = filter_config.get('type')
        
        # Type-specific validation
        if filter_type == 'date_range':
            if not isinstance(filter_value, dict):
                errors[filter_name] = "Date range must be a dictionary."
            elif 'start_date' not in filter_value or 'end_date' not in filter_value:
                errors[filter_name] = "Date range must have start_date and end_date."
        
        elif filter_type == 'integer':
            if not isinstance(filter_value, int):
                errors[filter_name] = "Must be an integer."
            min_value = filter_config.get('min_value')
            if min_value is not None and filter_value < min_value:
                errors[filter_name] = f"Must be at least {min_value}."
        
        elif filter_type == 'boolean':
            if not isinstance(filter_value, bool):
                errors[filter_name] = "Must be true or false."
    
    return len(errors) == 0, errors
```

#### has_permission Method
```python
def has_permission(self, user):
    """
    Check if user has permission to generate this report.
    
    Args:
        user: User object.
        
    Returns:
        bool: True if user has permission, False otherwise.
    """
    # No permission required
    if not self.required_permission:
        return True
    
    # Superusers always have access
    if user.is_superuser:
        return True
    
    # Check specific permission
    return user.has_perm(self.required_permission)
```

#### get_estimated_time_display Method
```python
def get_estimated_time_display(self):
    """
    Get human-readable estimated generation time.
    
    Returns:
        str: Formatted time estimate.
    """
    seconds = self.estimated_time_seconds
    
    if seconds < 60:
        return f"{seconds} seconds"
    elif seconds < 3600:
        minutes = seconds // 60
        return f"{minutes} minute{'s' if minutes != 1 else ''}"
    else:
        hours = seconds // 3600
        minutes = (seconds % 3600) // 60
        if minutes > 0:
            return f"{hours}h {minutes}m"
        return f"{hours} hour{'s' if hours != 1 else ''}"
```

#### get_filter_summary Method
```python
def get_filter_summary(self, filter_params):
    """
    Create human-readable summary of applied filters.
    
    Args:
        filter_params (dict): Applied filter parameters.
        
    Returns:
        str: Formatted filter summary.
    """
    if not filter_params:
        return "No filters applied"
    
    summary_parts = []
    available = self.available_filters
    
    for filter_name, filter_value in filter_params.items():
        if filter_name not in available:
            continue
        
        filter_config = available[filter_name]
        label = filter_config.get('label', filter_name)
        filter_type = filter_config.get('type')
        
        if filter_type == 'date_range':
            start = filter_value.get('start_date')
            end = filter_value.get('end_date')
            summary_parts.append(f"{label}: {start} to {end}")
        
        elif filter_type in ['single_select', 'choice']:
            summary_parts.append(f"{label}: {filter_value}")
        
        elif filter_type == 'multi_select':
            count = len(filter_value) if isinstance(filter_value, list) else 1
            summary_parts.append(f"{label}: {count} selected")
        
        elif filter_type == 'boolean':
            value_text = "Yes" if filter_value else "No"
            summary_parts.append(f"{label}: {value_text}")
        
        else:
            summary_parts.append(f"{label}: {filter_value}")
    
    return " | ".join(summary_parts)
```

### Method Usage Examples

```python
# Example 1: Check permission
definition = ReportDefinition.objects.get(code='SALES_DAILY_SUMMARY')
if definition.has_permission(request.user):
    # Allow report generation
    pass
else:
    # Show permission denied message
    pass

# Example 2: Validate filters
filter_params = {
    'date_range': {
        'start_date': '2026-01-01',
        'end_date': '2026-01-31'
    },
    'location': 123
}

is_valid, errors = definition.validate_filter_parameters(filter_params)
if not is_valid:
    return Response({'errors': errors}, status=400)

# Example 3: Get filter summary
summary = definition.get_filter_summary(filter_params)
# Output: "Date Range: 2026-01-01 to 2026-01-31 | Location: Colombo"

# Example 4: Display estimated time
time_display = definition.get_estimated_time_display()
# Output: "2 minutes"
```

### Expected Outcome
- Comprehensive validation methods
- Permission checking logic
- User-friendly display methods
- Robust business logic

### Verification Checklist
- [ ] get_available_filters method added
- [ ] validate_filter_parameters method added
- [ ] has_permission method added
- [ ] get_estimated_time_display method added
- [ ] get_filter_summary method added
- [ ] save method overridden
- [ ] clean method added
- [ ] All methods have docstrings
- [ ] Methods handle edge cases

---

## Task 12: Run ReportDefinition Migrations

### Overview
Create and run Django migrations for the ReportDefinition model. This will create the necessary database table with all fields, constraints, and indexes.

### Dependencies
- Task 11: Add definition methods

### Instructions

1. **Verify model is complete**
   - Review ReportDefinition model
   - Ensure all fields defined
   - Verify Meta class complete
   - Check imports correct

2. **Create migration file**
   - Run `python manage.py makemigrations analytics`
   - Django will detect new ReportDefinition model
   - Migration file created in migrations/ directory

3. **Review migration file**
   - Open generated migration file
   - Verify all fields included
   - Check indexes created
   - Review constraints

4. **Run migrations**
   - Run `python manage.py migrate analytics`
   - Applies migration to database
   - Creates report_definition table in tenant schemas

5. **Verify table creation**
   - Check database for new table
   - Verify all columns present
   - Check indexes created
   - Confirm constraints applied

6. **Test model in shell**
   - Run `python manage.py shell`
   - Import ReportDefinition model
   - Create test instance
   - Verify save and retrieval

### Migration Commands

```bash
# Create migration
python manage.py makemigrations analytics

# Expected output:
# Migrations for 'analytics':
#   apps/analytics/migrations/0001_initial.py
#     - Create model ReportDefinition

# Review migration (optional)
python manage.py sqlmigrate analytics 0001

# Run migration
python manage.py migrate analytics

# Expected output:
# Running migrations:
#   Applying analytics.0001_initial... OK
```

### Migration File Structure

```python
# Generated migration file example
from django.db import migrations, models
import django.db.models.deletion

class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('tenants', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='ReportDefinition',
            fields=[
                ('id', models.BigAutoField(primary_key=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('name', models.CharField(max_length=200)),
                ('code', models.CharField(max_length=100)),
                ('description', models.TextField()),
                ('is_active', models.BooleanField(default=True)),
                ('category', models.CharField(max_length=20)),
                ('default_format', models.CharField(max_length=20)),
                ('available_filters', models.JSONField()),
                ('required_permission', models.CharField(max_length=255)),
                # ... more fields
                ('tenant', models.ForeignKey(
                    on_delete=django.db.models.deletion.CASCADE,
                    to='tenants.tenant'
                )),
            ],
            options={
                'verbose_name': 'Report Definition',
                'verbose_name_plural': 'Report Definitions',
                'ordering': ['category', 'order', 'name'],
            },
        ),
        migrations.AddIndex(
            model_name='reportdefinition',
            index=models.Index(fields=['tenant', 'category']),
        ),
        # ... more indexes
    ]
```

### Verification Shell Test

```python
# Test in Django shell
from apps.analytics.models import ReportDefinition
from apps.analytics.enums import ReportCategory, ReportFormat
from apps.tenants.models import Tenant

# Get a tenant
tenant = Tenant.objects.first()

# Create test definition
definition = ReportDefinition.objects.create(
    tenant=tenant,
    name="Test Report",
    code="TEST_REPORT",
    description="Test report definition",
    category=ReportCategory.SALES,
    default_format=ReportFormat.PDF,
    available_filters={
        "date": {
            "type": "single_date",
            "required": True
        }
    },
    required_permission="analytics.view_sales_reports"
)

print(f"Created: {definition}")
print(f"ID: {definition.id}")

# Test retrieval
retrieved = ReportDefinition.objects.get(code="TEST_REPORT")
print(f"Retrieved: {retrieved.name}")

# Clean up
definition.delete()
print("Test successful!")
```

### Expected Outcome
- Migration file created successfully
- Database table created
- All fields and constraints applied
- Model functional and testable

### Verification Checklist
- [ ] makemigrations command successful
- [ ] Migration file generated
- [ ] Migration file reviewed
- [ ] migrate command successful
- [ ] Table exists in database
- [ ] Test instance created successfully
- [ ] No migration errors or warnings

---

## Task 13: Create ReportInstance Model

### Overview
Create the ReportInstance model that tracks individual generated reports. Each instance represents a specific report generation with its filter parameters, output file, generation status, and metadata. This model enables report history tracking and status monitoring.

### Dependencies
- Task 12: Run ReportDefinition migrations
- ReportDefinition model exists
- User model available

### Instructions

1. **Create report_instance.py file**
   - Create file at `apps/analytics/models/report_instance.py`
   - Import necessary Django components

2. **Import required modules**
   - Import Django model fields
   - Import base model mixins (TenantAwareMixin, TimestampMixin)
   - Import analytics enums (ReportFormat, ReportStatus)
   - Import ReportDefinition model
   - Import User model
   - Import FileField for output storage

3. **Define ReportInstance model class**
   - Inherit from TenantAwareMixin and TimestampMixin
   - Add comprehensive model docstring

4. **Add relationship fields**
   - report_definition: ForeignKey to ReportDefinition
   - user: ForeignKey to User (who requested report)
   - Both with appropriate on_delete behavior

5. **Add filter parameters field**
   - filter_parameters: JSONField
   - Stores actual filter values used
   - Example: {"date_range": {"start": "2026-01-01", "end": "2026-01-31"}}

6. **Add output fields**
   - output_format: CharField with ReportFormat choices
   - output_file: FileField for generated file
   - file_size: BigIntegerField for file size in bytes
   - All nullable until generation completes

7. **Add status tracking fields**
   - status: CharField with ReportStatus choices
   - Default to ReportStatus.PENDING
   - Tracks generation lifecycle

8. **Add timing fields**
   - started_at: DateTimeField (null=True) - When generation started
   - generated_at: DateTimeField (null=True) - When completed
   - generation_time_seconds: IntegerField (null=True) - Duration

9. **Add error tracking field**
   - error_message: TextField (blank=True) - Error details if failed

10. **Update models/__init__.py**
    - Import ReportInstance
    - Add to __all__ list

### ReportInstance Model Structure

```
┌─────────────────────────────────────────────────┐
│          ReportInstance Model                   │
├─────────────────────────────────────────────────┤
│ Relationships:                                  │
│  • report_definition (FK to ReportDefinition)   │
│  • user (FK to User)                            │
│                                                 │
│ Filter Data:                                    │
│  • filter_parameters (JSONField)                │
│                                                 │
│ Output:                                         │
│  • output_format (ReportFormat enum)            │
│  • output_file (FileField)                      │
│  • file_size (BigIntegerField)                  │
│                                                 │
│ Status:                                         │
│  • status (ReportStatus enum)                   │
│                                                 │
│ Timing:                                         │
│  • started_at (DateTimeField)                   │
│  • generated_at (DateTimeField)                 │
│  • generation_time_seconds (IntegerField)       │
│                                                 │
│ Error Tracking:                                 │
│  • error_message (TextField)                    │
│                                                 │
│ Inherited from TenantAwareMixin:                │
│  • tenant (ForeignKey)                          │
│                                                 │
│ Inherited from TimestampMixin:                  │
│  • created_at (DateTimeField, request time)     │
│  • updated_at (DateTimeField)                   │
└─────────────────────────────────────────────────┘
```

### Model Relationships

```
┌──────────────────────┐
│  ReportDefinition    │
│  (Template)          │
└──────────┬───────────┘
           │ 1:N
           │
           ▼
┌──────────────────────┐         ┌──────────────┐
│   ReportInstance     │ N:1     │     User     │
│   (Generated)        │◄────────│ (Requested)  │
└──────────┬───────────┘         └──────────────┘
           │
           │ Has
           ▼
┌──────────────────────┐
│   Generated File     │
│   (PDF/Excel/CSV)    │
└──────────────────────┘
```

### Filter Parameters Examples

#### Sales Report Instance
```json
{
  "date_range": {
    "start_date": "2026-01-01",
    "end_date": "2026-01-31"
  },
  "location": 123,
  "product_category": [45, 67, 89],
  "payment_method": "CASH"
}
```

#### Inventory Report Instance
```json
{
  "date": "2026-01-25",
  "warehouse": [1, 2, 3],
  "category": [10, 15, 20],
  "stock_status": "LOW_STOCK",
  "include_zero_stock": false
}
```

#### Customer Report Instance
```json
{
  "date_range": {
    "start_date": "2025-01-01",
    "end_date": "2026-01-31"
  },
  "customer_segment": "VIP",
  "min_purchases": 10,
  "min_lifetime_value": 100000.00
}
```

### Report Instance Lifecycle

```
User Request
     │
     ▼
Create ReportInstance
(status: PENDING)
     │
     ▼
Queue Celery Task
     │
     ▼
Task Starts
Update: status → GENERATING
Update: started_at
     │
     ├──────────────────┐
     │                  │
     ▼                  ▼
Success            Failure
     │                  │
     ▼                  ▼
Update:           Update:
- status → COMPLETED  - status → FAILED
- generated_at        - error_message
- output_file         - generated_at
- file_size
- generation_time_seconds
```

### File Storage Structure

```
media/
└── reports/
    ├── 2026/
    │   └── 01/
    │       ├── SALES_DAILY_SUMMARY_20260125_143025_abc123.pdf
    │       ├── INVENTORY_STOCK_20260125_150000_def456.xlsx
    │       └── CUSTOMER_ANALYSIS_20260125_160000_ghi789.csv
    └── [year]/
        └── [month]/
            └── [report_files]
```

### File Naming Convention

```
Pattern:
{REPORT_CODE}_{DATE}_{TIME}_{RANDOM}.{EXT}

Examples:
- SALES_DAILY_SUMMARY_20260125_143025_a1b2c3.pdf
- INVENTORY_STOCK_20260125_150000_d4e5f6.xlsx
- CUSTOMER_LTV_20260125_160000_g7h8i9.csv

Components:
- REPORT_CODE: From ReportDefinition.code
- DATE: Generation date (YYYYMMDD)
- TIME: Generation time (HHMMSS)
- RANDOM: 6-character random string
- EXT: File extension based on format
```

### Field Details

| Field | Type | Null | Default | Purpose |
|-------|------|------|---------|---------|
| report_definition | ForeignKey | No | - | Links to report template |
| user | ForeignKey | No | - | User who requested |
| filter_parameters | JSONField | No | {} | Applied filters |
| output_format | CharField | No | - | Selected format |
| output_file | FileField | Yes | null | Generated file |
| file_size | BigIntegerField | Yes | null | File size in bytes |
| status | CharField | No | PENDING | Current status |
| started_at | DateTimeField | Yes | null | When generation began |
| generated_at | DateTimeField | Yes | null | When completed |
| generation_time_seconds | IntegerField | Yes | null | Duration |
| error_message | TextField | No | '' | Error details |

### Expected Outcome
- Functional ReportInstance model
- Complete status tracking
- File storage configured
- Foundation for report history

### Verification Checklist
- [ ] report_instance.py file created
- [ ] ReportInstance class defined
- [ ] report_definition FK added
- [ ] user FK added
- [ ] filter_parameters field added
- [ ] output_format field added
- [ ] output_file field added
- [ ] file_size field added
- [ ] status field added
- [ ] Timing fields added
- [ ] error_message field added
- [ ] Model imported in __init__.py

---

## Task 14: Add Instance Fields and Meta

### Overview
Add additional fields to ReportInstance model for better tracking, UI display, and management. Configure the Meta class with proper constraints, indexes, and ordering.

### Dependencies
- Task 13: Create ReportInstance model

### Instructions

1. **Open report_instance.py file**
   - Navigate to `apps/analytics/models/report_instance.py`
   - Locate ReportInstance model class

2. **Add title field**
   - title: CharField(max_length=300)
   - User-friendly report title
   - Auto-generated from definition name and filters
   - Example: "Daily Sales Summary - January 25, 2026"

3. **Add description field**
   - description: TextField(blank=True)
   - Optional user notes about report
   - Explains why report was generated

4. **Add celery_task_id field**
   - celery_task_id: CharField(max_length=255, null=True)
   - Stores Celery task ID
   - Used to check task status and cancel

5. **Add is_scheduled field**
   - is_scheduled: BooleanField(default=False)
   - Indicates if generated by scheduled job
   - vs. manual user request

6. **Add schedule_instance field**
   - schedule_instance: ForeignKey to ReportSchedule (null=True)
   - Links to schedule if generated by schedule
   - Null for manual reports

7. **Add accessed_at field**
   - accessed_at: DateTimeField(null=True)
   - Last time report was downloaded
   - Updated on each download

8. **Add access_count field**
   - access_count: PositiveIntegerField(default=0)
   - Number of times downloaded
   - Incremented on each access

9. **Add expires_at field**
   - expires_at: DateTimeField(null=True)
   - When report file will be deleted
   - Based on retention policy

10. **Configure Meta class**
    - Set verbose_name and verbose_name_plural
    - Add ordering by created_at (descending)
    - Add indexes on status, user, created_at
    - Add index on report_definition and status

### Complete ReportInstance Meta Class

```python
class Meta:
    verbose_name = "Report Instance"
    verbose_name_plural = "Report Instances"
    ordering = ['-created_at']
    indexes = [
        models.Index(fields=['tenant', 'status']),
        models.Index(fields=['tenant', 'user', '-created_at']),
        models.Index(fields=['tenant', 'report_definition', 'status']),
        models.Index(fields=['celery_task_id']),
        models.Index(fields=['expires_at']),
    ]
```

### Title Generation Examples

```
Format: {Report Name} - {Key Filter Info}

Examples:
- "Daily Sales Summary - January 25, 2026"
- "Stock Levels - All Warehouses - January 25, 2026"
- "Customer Analysis - VIP Segment - Jan 2026"
- "Purchase Orders - December 2025"
- "Staff Performance - Colombo Branch - Q4 2025"
```

### Report Expiration Strategy

```
┌─────────────────────────────────────────────────┐
│         Report Retention Policy                 │
├─────────────────────────────────────────────────┤
│                                                 │
│  Manual Reports:                                │
│  ├── Expiry: 30 days after generation           │
│  └── User can download anytime before expiry    │
│                                                 │
│  Scheduled Reports:                             │
│  ├── Expiry: 90 days after generation           │
│  └── Auto-emailed on generation                 │
│                                                 │
│  Accessed Reports:                              │
│  ├── Expiry extended on each access             │
│  └── +30 days from last access                  │
│                                                 │
│  Cleanup Job:                                   │
│  ├── Runs daily                                 │
│  ├── Deletes expired reports                    │
│  └── Updates status to EXPIRED (optional)       │
│                                                 │
└─────────────────────────────────────────────────┘
```

### Access Tracking Usage

```python
# When user downloads report
instance = ReportInstance.objects.get(id=report_id)

# Update access tracking
instance.accessed_at = timezone.now()
instance.access_count += 1
instance.save(update_fields=['accessed_at', 'access_count'])

# Optionally extend expiry
if instance.expires_at:
    # Extend by 30 days from now
    instance.expires_at = timezone.now() + timedelta(days=30)
    instance.save(update_fields=['expires_at'])
```

### Celery Task Integration

```python
# When queueing report generation
from apps.analytics.tasks import generate_report_task

# Create instance
instance = ReportInstance.objects.create(
    tenant=tenant,
    report_definition=definition,
    user=user,
    filter_parameters=filters,
    output_format=format,
    status=ReportStatus.PENDING
)

# Queue task
task = generate_report_task.delay(instance.id)

# Store task ID
instance.celery_task_id = task.id
instance.save(update_fields=['celery_task_id'])

# Later: Check task status
from celery.result import AsyncResult
result = AsyncResult(instance.celery_task_id)
print(f"Task state: {result.state}")
```

### Database Indexes Strategy

```
┌─────────────────────────────────────────────────┐
│          ReportInstance Indexes                 │
├─────────────────────────────────────────────────┤
│                                                 │
│  Index 1: (tenant, status)                      │
│  Purpose: List reports by status                │
│  Query: "Show all completed reports"            │
│                                                 │
│  Index 2: (tenant, user, -created_at)           │
│  Purpose: User's report history                 │
│  Query: "Show my recent reports"                │
│                                                 │
│  Index 3: (tenant, report_definition, status)   │
│  Purpose: Reports for specific definition       │
│  Query: "All instances of daily sales report"   │
│                                                 │
│  Index 4: (celery_task_id)                      │
│  Purpose: Fast task lookup                      │
│  Query: "Find instance by task ID"              │
│                                                 │
│  Index 5: (expires_at)                          │
│  Purpose: Cleanup job                           │
│  Query: "Find expired reports"                  │
│                                                 │
└─────────────────────────────────────────────────┘
```

### Expected Outcome
- Complete ReportInstance model structure
- Access tracking functionality
- Expiration management
- Celery integration support

### Verification Checklist
- [ ] title field added
- [ ] description field added
- [ ] celery_task_id field added
- [ ] is_scheduled field added
- [ ] schedule_instance field added
- [ ] accessed_at field added
- [ ] access_count field added
- [ ] expires_at field added
- [ ] Meta class configured
- [ ] Ordering defined
- [ ] Indexes created

---

## Task 15: Add Instance Methods

### Overview
Add utility methods to the ReportInstance model for status management, file handling, and display formatting. These methods encapsulate business logic for report lifecycle management.

### Dependencies
- Task 14: Add instance fields and Meta

### Instructions

1. **Add generate_title method**
   - Auto-generates title from definition and filters
   - Called in save method if title not provided
   - Returns formatted string

2. **Add get_file_url method**
   - Returns public URL to download file
   - Returns None if file not yet generated
   - Handles signed URLs if required

3. **Add get_file_size_display method**
   - Formats file size in human-readable format
   - Returns "1.2 MB", "345 KB", etc.
   - Returns "N/A" if not yet generated

4. **Add get_generation_time_display method**
   - Formats generation time as human-readable string
   - Returns "2 minutes 30 seconds", etc.
   - Returns "N/A" if not yet generated

5. **Add mark_as_started method**
   - Updates status to GENERATING
   - Sets started_at timestamp
   - Called when Celery task begins

6. **Add mark_as_completed method**
   - Updates status to COMPLETED
   - Sets generated_at timestamp
   - Calculates generation_time_seconds
   - Sets expires_at based on retention policy

7. **Add mark_as_failed method**
   - Updates status to FAILED
   - Sets generated_at timestamp
   - Stores error message
   - Calculates generation_time_seconds

8. **Add can_cancel method**
   - Returns True if report can be cancelled
   - Only PENDING or GENERATING status can cancel
   - Used to show/hide cancel button

9. **Add cancel method**
   - Cancels Celery task
   - Updates status to CANCELLED
   - Sets generated_at timestamp

10. **Add is_expired method**
    - Checks if report has expired
    - Compares expires_at with current time
    - Returns boolean

11. **Add increment_access method**
    - Increments access_count
    - Updates accessed_at timestamp
    - Called on each download

12. **Add delete_file method**
    - Deletes the physical file
    - Clears output_file field
    - Used by cleanup job

13. **Add save method override**
    - Auto-generate title if not provided
    - Set expires_at based on retention policy
    - Validate status transitions
    - Call parent save method

14. **Add __str__ method**
    - Return title
    - Include status in representation

### Method Implementation Examples

#### generate_title Method
```python
def generate_title(self):
    """
    Auto-generate title from definition and filters.
    
    Returns:
        str: Generated title.
    """
    base_title = self.report_definition.name
    filter_summary = self.report_definition.get_filter_summary(
        self.filter_parameters
    )
    
    if filter_summary and filter_summary != "No filters applied":
        return f"{base_title} - {filter_summary}"
    
    return base_title
```

#### mark_as_started Method
```python
def mark_as_started(self):
    """Mark report generation as started."""
    self.status = ReportStatus.GENERATING
    self.started_at = timezone.now()
    self.save(update_fields=['status', 'started_at'])
```

#### mark_as_completed Method
```python
def mark_as_completed(self, output_file, file_size):
    """
    Mark report generation as completed.
    
    Args:
        output_file: Generated file object.
        file_size: File size in bytes.
    """
    now = timezone.now()
    
    self.status = ReportStatus.COMPLETED
    self.generated_at = now
    self.output_file = output_file
    self.file_size = file_size
    
    # Calculate generation time
    if self.started_at:
        delta = now - self.started_at
        self.generation_time_seconds = int(delta.total_seconds())
    
    # Set expiry date (30 days for manual, 90 for scheduled)
    expiry_days = 90 if self.is_scheduled else 30
    self.expires_at = now + timedelta(days=expiry_days)
    
    self.save(update_fields=[
        'status', 'generated_at', 'output_file', 'file_size',
        'generation_time_seconds', 'expires_at'
    ])
```

#### mark_as_failed Method
```python
def mark_as_failed(self, error_message):
    """
    Mark report generation as failed.
    
    Args:
        error_message: Error description.
    """
    now = timezone.now()
    
    self.status = ReportStatus.FAILED
    self.generated_at = now
    self.error_message = error_message
    
    # Calculate generation time if started
    if self.started_at:
        delta = now - self.started_at
        self.generation_time_seconds = int(delta.total_seconds())
    
    self.save(update_fields=[
        'status', 'generated_at', 'error_message',
        'generation_time_seconds'
    ])
```

#### cancel Method
```python
def cancel(self):
    """Cancel report generation."""
    if not self.can_cancel():
        raise ValueError("Report cannot be cancelled in current status")
    
    # Cancel Celery task if exists
    if self.celery_task_id:
        from celery import current_app
        current_app.control.revoke(self.celery_task_id, terminate=True)
    
    # Update status
    self.status = ReportStatus.CANCELLED
    self.generated_at = timezone.now()
    self.save(update_fields=['status', 'generated_at'])
```

#### increment_access Method
```python
def increment_access(self):
    """Increment access count and update timestamp."""
    self.accessed_at = timezone.now()
    self.access_count += 1
    
    # Optionally extend expiry
    if self.expires_at:
        # Extend by 30 days from now
        self.expires_at = timezone.now() + timedelta(days=30)
    
    self.save(update_fields=['accessed_at', 'access_count', 'expires_at'])
```

#### get_file_size_display Method
```python
def get_file_size_display(self):
    """
    Get human-readable file size.
    
    Returns:
        str: Formatted file size.
    """
    if not self.file_size:
        return "N/A"
    
    size = self.file_size
    
    for unit in ['B', 'KB', 'MB', 'GB']:
        if size < 1024.0:
            return f"{size:.1f} {unit}"
        size /= 1024.0
    
    return f"{size:.1f} TB"
```

### Method Usage Examples

```python
# Example 1: Start generation
instance = ReportInstance.objects.get(id=123)
instance.mark_as_started()

# Example 2: Complete generation
with open('report.pdf', 'rb') as f:
    file_obj = File(f)
    file_size = os.path.getsize('report.pdf')
    instance.mark_as_completed(file_obj, file_size)

# Example 3: Handle failure
try:
    # Generation logic
    pass
except Exception as e:
    instance.mark_as_failed(str(e))

# Example 4: Download report
if instance.status == ReportStatus.COMPLETED:
    instance.increment_access()
    return FileResponse(instance.output_file)

# Example 5: Check expiration
if instance.is_expired():
    instance.delete_file()
    # Optionally delete instance or mark as expired
```

### Expected Outcome
- Complete lifecycle management methods
- File handling utilities
- Status transition logic
- Display formatting methods

### Verification Checklist
- [ ] generate_title method added
- [ ] get_file_url method added
- [ ] get_file_size_display method added
- [ ] get_generation_time_display method added
- [ ] mark_as_started method added
- [ ] mark_as_completed method added
- [ ] mark_as_failed method added
- [ ] can_cancel method added
- [ ] cancel method added
- [ ] is_expired method added
- [ ] increment_access method added
- [ ] delete_file method added
- [ ] save method overridden
- [ ] __str__ method implemented
- [ ] All methods have docstrings

---

## Task 16: Run ReportInstance Migrations

### Overview
Create and run Django migrations for the ReportInstance model. This will create the necessary database table with all fields, relationships, constraints, and indexes.

### Dependencies
- Task 15: Add instance methods

### Instructions

1. **Verify model is complete**
   - Review ReportInstance model
   - Ensure all fields defined
   - Verify Meta class complete
   - Check imports correct
   - Verify relationships to ReportDefinition and User

2. **Create migration file**
   - Run `python manage.py makemigrations analytics`
   - Django will detect new ReportInstance model
   - Migration file created in migrations/ directory

3. **Review migration file**
   - Open generated migration file
   - Verify all fields included
   - Check foreign keys correct
   - Review indexes created
   - Verify file field storage path

4. **Run migrations**
   - Run `python manage.py migrate analytics`
   - Applies migration to database
   - Creates report_instance table in tenant schemas

5. **Verify table creation**
   - Check database for new table
   - Verify all columns present
   - Check indexes created
   - Confirm foreign key constraints
   - Verify file upload directory

6. **Test model in shell**
   - Run `python manage.py shell`
   - Import both models
   - Create test instances
   - Test relationships
   - Verify methods work

7. **Create sample fixture**
   - Create fixture file with sample definitions
   - Useful for development and testing
   - Place in analytics/fixtures/

### Migration Commands

```bash
# Create migration
python manage.py makemigrations analytics

# Expected output:
# Migrations for 'analytics':
#   apps/analytics/migrations/0002_reportinstance.py
#     - Create model ReportInstance

# Review migration (optional)
python manage.py sqlmigrate analytics 0002

# Run migration
python manage.py migrate analytics

# Expected output:
# Running migrations:
#   Applying analytics.0002_reportinstance... OK
```

### Comprehensive Shell Test

```python
"""
Complete model verification script.
Run: python manage.py shell < verify_models.py
"""

from django.utils import timezone
from apps.analytics.models import ReportDefinition, ReportInstance
from apps.analytics.enums import ReportCategory, ReportFormat, ReportStatus
from apps.tenants.models import Tenant
from django.contrib.auth import get_user_model

User = get_user_model()

print("=" * 60)
print("Analytics Models Verification")
print("=" * 60)

# Setup
tenant = Tenant.objects.first()
user = User.objects.filter(tenant=tenant).first()

# Test 1: Create ReportDefinition
print("\n1. Testing ReportDefinition...")
definition = ReportDefinition.objects.create(
    tenant=tenant,
    name="Daily Sales Summary",
    code="SALES_DAILY_SUMMARY",
    description="Daily sales report with transactions and revenue",
    category=ReportCategory.SALES,
    default_format=ReportFormat.PDF,
    available_filters={
        "date": {
            "type": "single_date",
            "label": "Report Date",
            "required": True
        },
        "location": {
            "type": "single_select",
            "label": "Location",
            "model": "Warehouse",
            "required": False
        }
    },
    required_permission="analytics.view_sales_reports",
    estimated_time_seconds=120,
    order=10
)
print(f"   Created: {definition}")
print(f"   Estimated time: {definition.get_estimated_time_display()}")

# Test 2: Validate filters
print("\n2. Testing filter validation...")
test_filters = {
    "date": "2026-01-25",
    "location": 123
}
is_valid, errors = definition.validate_filter_parameters(test_filters)
print(f"   Valid: {is_valid}")
if errors:
    print(f"   Errors: {errors}")

# Test 3: Filter summary
print("\n3. Testing filter summary...")
summary = definition.get_filter_summary(test_filters)
print(f"   Summary: {summary}")

# Test 4: Create ReportInstance
print("\n4. Testing ReportInstance...")
instance = ReportInstance.objects.create(
    tenant=tenant,
    report_definition=definition,
    user=user,
    filter_parameters=test_filters,
    output_format=ReportFormat.PDF,
    status=ReportStatus.PENDING
)
print(f"   Created: {instance}")
print(f"   Title: {instance.title}")

# Test 5: Status transitions
print("\n5. Testing status transitions...")
print(f"   Initial status: {instance.status}")

instance.mark_as_started()
print(f"   After start: {instance.status}")

instance.mark_as_completed(
    output_file=None,  # Would be actual file in production
    file_size=1024000  # 1 MB
)
print(f"   After completion: {instance.status}")
print(f"   File size: {instance.get_file_size_display()}")
print(f"   Generation time: {instance.get_generation_time_display()}")

# Test 6: Access tracking
print("\n6. Testing access tracking...")
print(f"   Access count before: {instance.access_count}")
instance.increment_access()
print(f"   Access count after: {instance.access_count}")
print(f"   Last accessed: {instance.accessed_at}")

# Test 7: Query tests
print("\n7. Testing queries...")
instances = ReportInstance.objects.filter(
    tenant=tenant,
    report_definition=definition,
    status=ReportStatus.COMPLETED
)
print(f"   Completed reports: {instances.count()}")

# Test 8: Relationships
print("\n8. Testing relationships...")
print(f"   Definition name: {instance.report_definition.name}")
print(f"   Requested by: {instance.user.username}")
print(f"   Definition has {instance.report_definition.reportinstance_set.count()} instances")

# Cleanup
print("\n9. Cleanup...")
instance.delete()
definition.delete()
print("   Test data deleted")

print("\n" + "=" * 60)
print("Verification Complete - All Tests Passed!")
print("=" * 60)
```

### Sample Fixture File

```json
[
  {
    "model": "analytics.reportdefinition",
    "pk": 1,
    "fields": {
      "tenant": 1,
      "name": "Daily Sales Summary",
      "code": "SALES_DAILY_SUMMARY",
      "description": "Comprehensive daily sales report",
      "category": "SALES",
      "default_format": "PDF",
      "available_filters": {
        "date": {
          "type": "single_date",
          "label": "Report Date",
          "required": true
        }
      },
      "required_permission": "analytics.view_sales_reports",
      "is_active": true,
      "order": 10,
      "estimated_time_seconds": 120
    }
  },
  {
    "model": "analytics.reportdefinition",
    "pk": 2,
    "fields": {
      "tenant": 1,
      "name": "Current Stock Levels",
      "code": "INVENTORY_STOCK_LEVELS",
      "description": "Real-time inventory levels",
      "category": "INVENTORY",
      "default_format": "EXCEL",
      "available_filters": {
        "warehouse": {
          "type": "multi_select",
          "label": "Warehouses",
          "required": false
        }
      },
      "required_permission": "analytics.view_inventory_reports",
      "is_active": true,
      "order": 10,
      "estimated_time_seconds": 60
    }
  }
]
```

### Expected Outcome
- Migration file created successfully
- Database table created
- All fields, relationships, and indexes applied
- Models fully functional and tested
- Sample fixture available

### Verification Checklist
- [ ] makemigrations command successful
- [ ] Migration file generated
- [ ] Migration file reviewed
- [ ] migrate command successful
- [ ] Both tables exist in database
- [ ] Foreign keys correct
- [ ] Test instances created successfully
- [ ] Relationships work correctly
- [ ] Methods function as expected
- [ ] Fixture file created
- [ ] No migration errors or warnings

---

## Summary

This document completed the core analytics models:

### Completed Infrastructure
- ✅ ReportDefinition model with complete fields
- ✅ Filter schema system for dynamic parameters
- ✅ Permission-based access control
- ✅ ReportInstance model for tracking generated reports
- ✅ Status lifecycle management (PENDING → GENERATING → COMPLETED/FAILED)
- ✅ File storage and access tracking
- ✅ Expiration and retention policies
- ✅ Celery task integration
- ✅ Utility methods for both models
- ✅ Database migrations completed

### Key Achievements
1. **Report Definitions** - Template system for available reports
2. **Dynamic Filters** - JSONField-based flexible filter configuration
3. **Status Tracking** - Complete lifecycle from request to completion
4. **File Management** - Storage, access tracking, and expiration
5. **Permission System** - Category-based permission requirements
6. **Access Analytics** - Download tracking and usage metrics
7. **Error Handling** - Comprehensive error tracking and retry support

### Next Steps
Proceed to [Group-B_Sales-Reports](../Group-B_Sales-Reports/) to implement specific sales report definitions and generation logic.

---

**Document Status:** ✅ Complete  
**Total Tasks:** 8  
**Total Lines:** ~983
