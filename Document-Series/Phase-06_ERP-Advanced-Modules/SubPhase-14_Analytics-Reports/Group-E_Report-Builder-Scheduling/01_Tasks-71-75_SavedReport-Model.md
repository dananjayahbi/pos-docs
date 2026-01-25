# Tasks 71-75: SavedReport Model for User Report Configurations

> **Phase:** 06 - ERP Advanced Modules  
> **SubPhase:** 14 - Analytics & Reports  
> **Group:** E - Report Builder & Scheduling  
> **Document:** 01 of 02  
> **Tasks Covered:** 71, 72, 73, 74, 75

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-76-84_ScheduledReport-Celery.md](02_Tasks-76-84_ScheduledReport-Celery.md)

---

## Document Overview

This document covers the implementation of the SavedReport model, which enables users to save and reuse report configurations. The SavedReport model stores user-defined report templates with custom filters, output format preferences, and sharing options. This functionality allows users to quickly generate commonly-used reports without reconfiguring filters each time, significantly improving workflow efficiency.

### Tasks in This Document

| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 71 | Create SavedReport model | Medium | 40 min |
| 72 | Add saved report name and description | Low | 15 min |
| 73 | Add saved report configuration fields | Medium | 30 min |
| 74 | Add saved report owner and sharing | Low | 20 min |
| 75 | Run SavedReport migrations | Low | 10 min |

### Purpose

SavedReport acts as a template system for reports, allowing users to:
- **Save Time** - Store frequently-used report configurations
- **Maintain Consistency** - Ensure reports use same filters and format
- **Share Reports** - Make report templates available to other users
- **Quick Access** - Generate reports with one click
- **Customize Views** - Personalize report preferences per user

---

## Task 71: Create SavedReport Model

### Overview

Create the core SavedReport model within the analytics application. This model provides the foundation for storing user-defined report configurations. It inherits from TenantAwareModel to ensure proper multi-tenancy isolation, preventing cross-tenant data access. The model establishes the basic structure that will be enhanced with additional fields in subsequent tasks.

### Dependencies

- Analytics application (`apps/analytics/`) exists
- ReportDefinition model (Task 70) is complete
- TenantAwareModel base class is available
- Django ORM configured
- Tenant model exists

### Instructions

1. **Create saved_report.py model file**
   - Navigate to `apps/analytics/models/` directory
   - Create new file named `saved_report.py`
   - This file will contain the SavedReport model

2. **Import required Django modules**
   - Import `models` from `django.db`
   - Import `timezone` from `django.utils`
   - Import validation utilities from `django.core.validators`

3. **Import base model classes**
   - Import `TenantAwareModel` from core models
   - This provides automatic tenant scoping
   - Ensures saved reports are isolated per tenant

4. **Import related models**
   - Import `ReportDefinition` from same models package
   - Import `User` model (via get_user_model or direct import)
   - These establish foreign key relationships

5. **Define SavedReport model class**
   - Create class named `SavedReport`
   - Inherit from `TenantAwareModel`
   - Add comprehensive model docstring

6. **Add model docstring**
   - Explain purpose: Store user report configurations
   - Document key features: Filters, format, sharing
   - Note tenant awareness
   - Include example usage scenario

7. **Define initial Meta class**
   - Set `db_table = 'analytics_saved_report'`
   - Set `verbose_name = 'Saved Report'`
   - Set `verbose_name_plural = 'Saved Reports'`
   - Add `ordering = ['-created_at', 'name']`

8. **Add created_at timestamp field**
   - DateTimeField with `auto_now_add=True`
   - Automatically set on creation
   - Immutable after creation

9. **Add updated_at timestamp field**
   - DateTimeField with `auto_now=True`
   - Automatically updated on save
   - Tracks last modification time

10. **Add placeholder __str__ method**
    - Return string representation
    - Will be enhanced in subsequent tasks
    - Format: "SavedReport: {id}"

11. **Update models/__init__.py**
    - Import SavedReport from saved_report module
    - Add to `__all__` list for proper exports
    - Ensure model is discoverable

### Model Structure Overview

```
SavedReport
├── Inherits: TenantAwareModel
├── Purpose: Store user report configurations
├── Relationships: Links to ReportDefinition and User
└── Features: Filters, format, sharing, timestamps
```

### Tenant Awareness

| Aspect | Implementation | Benefit |
|--------|----------------|---------|
| Data Isolation | Via TenantAwareModel | Reports private to tenant |
| Automatic Scoping | Manager filters by tenant | No cross-tenant access |
| Schema Separation | Per tenant schemas | Enhanced security |
| Query Simplification | Transparent filtering | Cleaner code |

### Expected Outcome

- SavedReport model file created
- Model inherits from TenantAwareModel
- Basic structure with timestamps
- Meta configuration complete
- Model registered in package __init__

### Verification Checklist

- [ ] File `apps/analytics/models/saved_report.py` created
- [ ] SavedReport class defined
- [ ] Inherits from TenantAwareModel
- [ ] Model docstring comprehensive
- [ ] created_at field added
- [ ] updated_at field added
- [ ] Meta class configured
- [ ] __str__ method implemented
- [ ] Model imported in __init__.py
- [ ] Added to __all__ list

---

## Task 72: Add Saved Report Name and Description

### Overview

Add user-facing fields for identifying and documenting saved reports. The name field serves as the primary identifier visible in the UI, while the description field allows users to add detailed notes about the report's purpose, filters, or usage context. These fields enhance report organization and make it easier for users to find and understand their saved reports.

### Dependencies

- Task 71: Create SavedReport model

### Instructions

1. **Open saved_report.py model file**
   - Navigate to `apps/analytics/models/saved_report.py`
   - Locate the SavedReport model class

2. **Add name field after timestamps**
   - Field type: CharField
   - Set `max_length=150`
   - Set `blank=False, null=False` (required)
   - Add `help_text='User-defined name for this report configuration'`

3. **Add field validation for name**
   - Import MinLengthValidator
   - Set `validators=[MinLengthValidator(3)]`
   - Prevents too-short names
   - Ensures meaningful naming

4. **Add database index on name**
   - Set `db_index=True` on name field
   - Improves search performance
   - Enables fast filtering by name

5. **Add description field**
   - Field type: TextField
   - Set `blank=True, null=True` (optional)
   - Add `help_text='Optional description or notes about this report'`

6. **Add max_length constraint to description**
   - Set `max_length=1000`
   - Prevents excessively long descriptions
   - Maintains reasonable database performance

7. **Update __str__ method**
   - Change return value to use name field
   - Format: `f"{self.name}"`
   - Provides readable string representation

8. **Update model docstring**
   - Document the name and description fields
   - Include examples of good names
   - Note optional vs required fields

9. **Add Meta constraint for name uniqueness**
   - Add constraint: `unique_together = ['tenant', 'owner', 'name']`
   - Prevents duplicate names per user per tenant
   - Note: owner field will be added in Task 74

### Field Specifications

| Field | Type | Required | Max Length | Indexed | Purpose |
|-------|------|----------|------------|---------|---------|
| name | CharField | Yes | 150 | Yes | Report identifier |
| description | TextField | No | 1000 | No | Usage notes |

### Naming Guidelines

#### Good Report Names
- "Monthly Sales by Product Category"
- "Weekly Customer Purchase Frequency"
- "Top 20 Revenue-Generating Products"
- "Daily Inventory Levels by Location"
- "Quarterly Staff Performance Metrics"

#### Poor Report Names (Avoid)
- "Report 1" ❌ (Too generic)
- "R" ❌ (Too short)
- "aaaa" ❌ (Not meaningful)
- "Sales sales sales sales sales..." ❌ (Repetitive)

### Description Examples

#### Detailed Description
```
Name: Monthly Sales Trends
Description: Analyzes sales performance across all product categories 
for the current month. Includes comparisons with previous month and 
year-over-year trends. Filters out voided transactions. Used for 
monthly management review meetings.
```

#### Concise Description
```
Name: Low Stock Alert Report
Description: Products with inventory below reorder point. 
Run daily by warehouse manager.
```

#### No Description (Valid)
```
Name: Daily Sales Summary
Description: [Empty - self-explanatory name]
```

### Name Length Recommendations

| Character Count | Suitability | Example Use Case |
|-----------------|-------------|------------------|
| 3-25 chars | Short | Dashboard widget labels |
| 26-60 chars | Medium | Standard report lists |
| 61-100 chars | Long | Detailed report archives |
| 101-150 chars | Very Long | Complex multi-parameter reports |

### UI Display Considerations

```
Report List View:
┌──────────────────────────────────────────────┐
│ ● Monthly Sales by Product                  │  ← 30 chars
│   Last run: 2 hours ago                      │
│                                              │
│ ● Weekly Customer Purchase Frequency Report │  ← 45 chars
│   Last run: Yesterday                        │
│                                              │
│ ● Top 20 Revenue-Generating Products This   │  ← 50 chars (truncated)
│   Last run: 3 days ago                       │
└──────────────────────────────────────────────┘
```

### Expected Outcome

- Name field with validation
- Optional description field
- Updated string representation
- Database indexing for performance
- Proper length constraints

### Verification Checklist

- [ ] name field added (CharField)
- [ ] name max_length = 150
- [ ] name required (blank=False)
- [ ] name has MinLengthValidator(3)
- [ ] name has db_index=True
- [ ] description field added (TextField)
- [ ] description optional (blank=True, null=True)
- [ ] description max_length = 1000
- [ ] __str__ method returns name
- [ ] Model docstring updated

---

## Task 73: Add Saved Report Configuration Fields

### Overview

Implement the core configuration fields that define how a saved report should be generated. These fields store the report type reference, user-defined filter parameters, and preferred output format. The filters_config field uses JSONField to provide flexible storage for diverse filter combinations without requiring schema changes.

### Dependencies

- Task 71: Create SavedReport model
- Task 72: Add name and description
- ReportDefinition model exists

### Instructions

1. **Open saved_report.py model file**
   - Continue in `apps/analytics/models/saved_report.py`
   - Add configuration fields after description

2. **Add report_definition foreign key**
   - Field type: ForeignKey
   - Related model: ReportDefinition
   - Set `on_delete=models.PROTECT`
   - Set `related_name='saved_reports'`
   - Add `help_text='The report definition this saved report is based on'`

3. **Add database index on report_definition**
   - Set `db_index=True`
   - Enables fast filtering by report type
   - Improves query performance

4. **Import JSONField**
   - Import from `django.db.models`
   - Required for filters_config storage
   - Stores structured filter data

5. **Add filters_config field**
   - Field type: JSONField
   - Set `default=dict` (empty dictionary)
   - Set `blank=True`
   - Add comprehensive help_text

6. **Document filters_config structure**
   - Add inline comment explaining expected JSON structure
   - Note common filter types
   - Include example structure

7. **Add output_format field**
   - Field type: CharField
   - Set `max_length=20`
   - Set `default='PDF'`
   - Add choices tuple

8. **Define OUTPUT_FORMAT_CHOICES**
   - Create constant tuple above model
   - Include: PDF, EXCEL, CSV, JSON
   - Format: `(value, display_name)` pairs

9. **Add output_format validation**
   - Set `choices=OUTPUT_FORMAT_CHOICES`
   - Ensures only valid formats stored
   - Prevents invalid configuration

10. **Create helper method get_filters_display()**
    - Returns human-readable filter summary
    - Parses filters_config JSON
    - Formats for UI display

11. **Create helper method validate_filters_config()**
    - Validates filters_config structure
    - Checks required filter keys
    - Ensures compatibility with report_definition

12. **Update model docstring**
    - Document configuration fields
    - Include filters_config examples
    - Note validation requirements

### Output Format Options

| Format | Value | File Extension | Use Case | MIME Type |
|--------|-------|----------------|----------|-----------|
| PDF | 'PDF' | .pdf | Printed reports, archival | application/pdf |
| Excel | 'EXCEL' | .xlsx | Data analysis, editing | application/vnd.openxmlformats-officedocument.spreadsheetml.sheet |
| CSV | 'CSV' | .csv | Import/export, simple data | text/csv |
| JSON | 'JSON' | .json | API consumption, integration | application/json |

### Filters Config Structure

#### Basic Structure
```json
{
  "date_range": "current_month",
  "category": ["groceries", "beverages"],
  "limit": 20,
  "sort_by": "revenue_desc"
}
```

#### Date Range Filters
```json
{
  "date_range": "custom",
  "date_from": "2026-01-01",
  "date_to": "2026-01-31"
}
```

#### Complex Multi-Filter
```json
{
  "date_range": "last_90_days",
  "locations": ["colombo_01", "kandy_02"],
  "product_categories": ["electronics", "accessories"],
  "min_revenue": 50000,
  "max_revenue": 500000,
  "customer_types": ["retail", "wholesale"],
  "payment_methods": ["cash", "card"],
  "limit": 50,
  "sort_by": "revenue_desc"
}
```

#### Predefined Periods
```json
{
  "date_range": "current_month",     // or:
  "date_range": "last_month",        // Previous month
  "date_range": "current_quarter",   // Q1, Q2, etc.
  "date_range": "current_year",      // YTD
  "date_range": "last_7_days",       // Rolling window
  "date_range": "last_30_days"       // Rolling window
}
```

### Filter Configuration Examples by Report Type

#### Sales Report Filters
```json
{
  "date_range": "last_30_days",
  "locations": ["all"],
  "product_categories": ["all"],
  "min_transaction_value": 0,
  "include_refunds": false,
  "group_by": "day"
}
```

#### Inventory Report Filters
```json
{
  "locations": ["warehouse_01"],
  "categories": ["electronics"],
  "stock_level": "below_reorder",
  "sort_by": "quantity_asc"
}
```

#### Customer Report Filters
```json
{
  "date_range": "current_year",
  "customer_type": "retail",
  "min_purchase_count": 5,
  "loyalty_tier": ["gold", "platinum"],
  "sort_by": "total_spent_desc",
  "limit": 100
}
```

#### Staff Performance Filters
```json
{
  "date_range": "current_month",
  "department": "sales",
  "location": "colombo_01",
  "metrics": ["sales_count", "average_sale", "customer_satisfaction"],
  "sort_by": "sales_count_desc"
}
```

### Report Definition Relationship

```
ReportDefinition (Template)
├── Code: "SALES_BY_PRODUCT"
├── Available Filters: date_range, category, limit
└── Default Values: {...}
         │
         ▼
SavedReport (User Instance)
├── Name: "Monthly Top 20 Products"
├── Report Definition: → SALES_BY_PRODUCT
├── Filters Config:
│   ├── date_range: "current_month"
│   ├── category: ["all"]
│   └── limit: 20
└── Output Format: "PDF"
```

### Filter Validation Logic

```
Validation Steps:
1. Check report_definition.available_filters
2. Ensure filters_config only uses allowed filters
3. Validate data types for each filter
4. Check value constraints (min/max, enums)
5. Apply default values for missing filters
6. Verify filter combinations are valid
```

### Filter Display Formatting

```
UI Display:
┌────────────────────────────────────────┐
│ Report: Monthly Sales by Category     │
│                                        │
│ Filters Applied:                       │
│  • Period: Current Month (Jan 2026)   │
│  • Categories: Groceries, Beverages    │
│  • Limit: Top 20 products              │
│  • Sort: Revenue (Descending)          │
│                                        │
│ Output Format: PDF                     │
└────────────────────────────────────────┘
```

### Expected Outcome

- Report definition foreign key
- Flexible filters_config JSON field
- Output format with validation
- Helper methods for validation and display
- Proper documentation

### Verification Checklist

- [ ] report_definition ForeignKey added
- [ ] report_definition uses PROTECT on_delete
- [ ] report_definition has db_index=True
- [ ] filters_config JSONField added
- [ ] filters_config default=dict
- [ ] OUTPUT_FORMAT_CHOICES constant defined
- [ ] output_format field added
- [ ] output_format has choices validation
- [ ] output_format default='PDF'
- [ ] get_filters_display() method created
- [ ] validate_filters_config() method created
- [ ] Model docstring updated with examples

---

## Task 74: Add Saved Report Owner and Sharing

### Overview

Implement ownership and sharing functionality for saved reports. The owner field establishes report ownership, linking each saved report to the user who created it. The is_public flag enables report sharing within a tenant, allowing users to make their report configurations available to colleagues. This supports both personal report libraries and shared organizational templates.

### Dependencies

- Task 71: Create SavedReport model
- Task 72: Add name and description
- Task 73: Add configuration fields
- User model available

### Instructions

1. **Import User model**
   - Add `from django.contrib.auth import get_user_model`
   - Call `User = get_user_model()`
   - Ensures compatibility with custom user models

2. **Add owner foreign key field**
   - Field type: ForeignKey
   - Related model: User
   - Set `on_delete=models.CASCADE`
   - Set `related_name='saved_reports'`
   - Add `help_text='User who created this saved report'`

3. **Add owner field index**
   - Set `db_index=True`
   - Enables fast filtering by owner
   - Improves "My Reports" queries

4. **Add is_public boolean field**
   - Field type: BooleanField
   - Set `default=False`
   - Add `help_text='Whether this report is visible to other users in the tenant'`

5. **Add is_public field index**
   - Set `db_index=True`
   - Improves public report queries
   - Enables efficient filtering

6. **Update Meta class constraints**
   - Add `unique_together = [['tenant', 'owner', 'name']]`
   - Prevents duplicate names per user
   - Allows same name across different users

7. **Add Meta indexes**
   - Create `indexes` list in Meta
   - Add compound index: `['tenant', 'is_public', 'owner']`
   - Add compound index: `['tenant', 'report_definition', 'is_public']`
   - Optimizes common query patterns

8. **Create property is_shared**
   - Returns True if is_public is True
   - Provides semantic naming
   - Alternative property name for clarity

9. **Create method can_access(user)**
   - Parameter: user object
   - Returns: boolean
   - Logic: owner match OR is_public=True
   - Used for permission checking

10. **Create method make_public()**
    - Sets is_public=True
    - Saves model
    - Optional: Add audit logging

11. **Create method make_private()**
    - Sets is_public=False
    - Saves model
    - Optional: Add audit logging

12. **Update __str__ method**
    - Include owner username
    - Format: `f"{self.name} (by {self.owner.username})"`
    - Shows ownership in admin/logs

13. **Add permissions property**
    - Returns dict of user permissions
    - Keys: 'can_edit', 'can_delete', 'can_share'
    - Used by frontend for UI controls

### Ownership Model

```
SavedReport Ownership Hierarchy
├── Owner (Creator)
│   ├── Full permissions: Edit, Delete, Share
│   └── Always has access
│
├── Public Reports (is_public=True)
│   ├── Viewable by: All tenant users
│   ├── Permissions: Read-only, Copy to own library
│   └── Cannot edit or delete
│
└── Private Reports (is_public=False)
    ├── Viewable by: Owner only
    └── Invisible to other users
```

### Sharing Scenarios

#### Scenario 1: Private Personal Report
```
Report: "My Daily Sales Summary"
Owner: john@example.com
is_public: False

Access:
✓ john@example.com - Full access
✗ jane@example.com - No access
✗ admin@example.com - No access (unless superuser)
```

#### Scenario 2: Shared Team Report
```
Report: "Weekly Department Performance"
Owner: manager@example.com
is_public: True

Access:
✓ manager@example.com - Full access (owner)
✓ jane@example.com - Read-only
✓ john@example.com - Read-only
✓ All tenant users - Read-only
```

#### Scenario 3: Copying Shared Report
```
User jane@example.com views shared report:
"Weekly Department Performance" (by manager@example.com)

Action: Click "Copy to My Reports"

Result: New SavedReport created
├── Name: "Weekly Department Performance (Copy)"
├── Owner: jane@example.com
├── is_public: False
├── Same filters_config as original
└── jane can now edit and customize
```

### Permission Matrix

| User Type | View | Edit | Delete | Share | Copy |
|-----------|------|------|--------|-------|------|
| Owner | ✓ | ✓ | ✓ | ✓ | ✓ |
| Tenant User (Public Report) | ✓ | ✗ | ✗ | ✗ | ✓ |
| Tenant User (Private Report) | ✗ | ✗ | ✗ | ✗ | ✗ |
| Superuser | ✓ | ✓ | ✓ | ✓ | ✓ |

### Query Optimization Patterns

#### User's Own Reports
```
Query: SavedReport.objects.filter(
    tenant=current_tenant,
    owner=current_user
)

Index Used: ['tenant', 'owner']
```

#### All Accessible Reports (Own + Public)
```
Query: SavedReport.objects.filter(
    Q(owner=current_user) | Q(is_public=True),
    tenant=current_tenant
)

Index Used: ['tenant', 'is_public', 'owner']
```

#### Public Reports by Type
```
Query: SavedReport.objects.filter(
    tenant=current_tenant,
    report_definition=sales_report_def,
    is_public=True
)

Index Used: ['tenant', 'report_definition', 'is_public']
```

### UI Display Patterns

#### My Reports View
```
┌──────────────────────────────────────────┐
│ My Reports                               │
├──────────────────────────────────────────┤
│ 🔒 Daily Sales Summary                   │  ← Private
│    Created: 2 days ago                   │
│                                          │
│ 🌐 Weekly Team Report                    │  ← Public (shared)
│    Created: 1 week ago • 3 users using   │
│                                          │
│ 🔒 Monthly Analysis                      │  ← Private
│    Created: 1 month ago                  │
└──────────────────────────────────────────┘
```

#### Public Reports Library
```
┌──────────────────────────────────────────┐
│ Shared Reports                           │
├──────────────────────────────────────────┤
│ 🌐 Sales by Product (by manager)         │
│    Used by 12 users • [Copy to My]      │
│                                          │
│ 🌐 Inventory Levels (by warehouse)       │
│    Used by 8 users • [Copy to My]       │
│                                          │
│ 🌐 Customer Analysis (by marketing)      │
│    Used by 15 users • [Copy to My]      │
└──────────────────────────────────────────┘
```

### Access Control Implementation

```
View/API Endpoint Logic:
1. Get current_user from request
2. Get current_tenant from request
3. Apply filter:
   - User is owner, OR
   - Report is_public=True
4. Check action permission:
   - Edit/Delete: Only if owner
   - View/Copy: If accessible
5. Return filtered queryset
```

### Expected Outcome

- Owner field links reports to users
- is_public enables report sharing
- Proper permission checking methods
- Optimized database indexes
- Clear ownership display

### Verification Checklist

- [ ] User model imported via get_user_model()
- [ ] owner ForeignKey field added
- [ ] owner uses CASCADE on_delete
- [ ] owner has db_index=True
- [ ] is_public BooleanField added
- [ ] is_public default=False
- [ ] is_public has db_index=True
- [ ] unique_together constraint set
- [ ] Compound indexes created in Meta
- [ ] is_shared property implemented
- [ ] can_access(user) method created
- [ ] make_public() method created
- [ ] make_private() method created
- [ ] __str__ method includes owner
- [ ] permissions property implemented

---

## Task 75: Run SavedReport Migrations

### Overview

Generate and apply Django migrations for the SavedReport model. Migrations create the database schema based on the model definition, establishing tables, columns, indexes, and constraints. This task finalizes the SavedReport implementation and makes it ready for use in the application.

### Dependencies

- Task 71: Create SavedReport model
- Task 72: Add name and description
- Task 73: Add configuration fields
- Task 74: Add owner and sharing
- PostgreSQL database configured
- Django migrations system configured

### Instructions

1. **Verify model completeness**
   - Open `apps/analytics/models/saved_report.py`
   - Review all fields are defined
   - Check Meta class configuration
   - Ensure imports are complete

2. **Check model registration**
   - Open `apps/analytics/models/__init__.py`
   - Verify SavedReport is imported
   - Confirm __all__ includes SavedReport

3. **Verify analytics app in INSTALLED_APPS**
   - Open Django settings file
   - Confirm 'apps.analytics' in INSTALLED_APPS
   - Ensure correct ordering (after dependencies)

4. **Create migration file**
   - Navigate to project root directory
   - Run makemigrations command
   - Specify analytics app explicitly
   - Review generated migration file

5. **Review migration operations**
   - Open generated migration in `apps/analytics/migrations/`
   - Verify CreateModel operation present
   - Check all fields included
   - Confirm indexes created
   - Verify constraints defined

6. **Check migration dependencies**
   - Review dependencies list in migration
   - Ensure previous migrations listed
   - Confirm ReportDefinition migration dependency
   - Check User model dependency

7. **Validate migration SQL (optional)**
   - Run sqlmigrate command
   - Review generated SQL
   - Check for potential issues
   - Verify index creation SQL

8. **Apply migration to database**
   - Run migrate command
   - Specify analytics app
   - Monitor for errors
   - Verify successful completion

9. **Verify database schema**
   - Connect to PostgreSQL
   - Check table created: `analytics_saved_report`
   - Verify all columns present
   - Confirm indexes created
   - Check foreign key constraints

10. **Test model in Django shell**
    - Open Django shell
    - Import SavedReport model
    - Create test instance
    - Verify save successful
    - Check __str__ method output
    - Delete test instance

11. **Verify tenant schema creation**
    - If using django-tenants
    - Check migration applied to public schema
    - Verify tenant schemas updated
    - Test model access with tenant context

12. **Update migration documentation**
    - Document migration number
    - Note what was created
    - Add to project changelog
    - Update deployment notes

### Migration Command Examples

#### Create Migration
```bash
# Standard approach
python manage.py makemigrations analytics

# With custom migration name
python manage.py makemigrations analytics --name add_saved_report_model

# Dry run (preview without creating)
python manage.py makemigrations analytics --dry-run
```

#### Review Migration SQL
```bash
# View SQL for migration
python manage.py sqlmigrate analytics 0002

# Check for issues
python manage.py makemigrations --check
```

#### Apply Migration
```bash
# Apply all pending
python manage.py migrate

# Apply specific app
python manage.py migrate analytics

# Apply specific migration
python manage.py migrate analytics 0002
```

### Migration File Structure

```python
# apps/analytics/migrations/0002_savedreport.py

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion

class Migration(migrations.Migration):
    dependencies = [
        ('analytics', '0001_initial'),
        ('tenants', '0001_initial'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='SavedReport',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, ...)),
                ('name', models.CharField(max_length=150, db_index=True, ...)),
                ('description', models.TextField(max_length=1000, blank=True, null=True, ...)),
                ('filters_config', models.JSONField(default=dict, blank=True, ...)),
                ('output_format', models.CharField(max_length=20, default='PDF', ...)),
                ('is_public', models.BooleanField(default=False, db_index=True, ...)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('tenant', models.ForeignKey(...)),
                ('owner', models.ForeignKey(...)),
                ('report_definition', models.ForeignKey(...)),
            ],
            options={
                'verbose_name': 'Saved Report',
                'verbose_name_plural': 'Saved Reports',
                'db_table': 'analytics_saved_report',
                'ordering': ['-created_at', 'name'],
            },
        ),
        migrations.AddIndex(...),
        migrations.AlterUniqueTogether(...),
    ]
```

### Database Schema Result

```sql
-- Table creation
CREATE TABLE analytics_saved_report (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    description TEXT,
    filters_config JSONB NOT NULL DEFAULT '{}',
    output_format VARCHAR(20) NOT NULL DEFAULT 'PDF',
    is_public BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL,
    tenant_id BIGINT NOT NULL REFERENCES tenants_tenant(id) ON DELETE CASCADE,
    owner_id BIGINT NOT NULL REFERENCES auth_user(id) ON DELETE CASCADE,
    report_definition_id BIGINT NOT NULL REFERENCES analytics_reportdefinition(id) ON DELETE PROTECT
);

-- Indexes
CREATE INDEX idx_saved_report_name ON analytics_saved_report(name);
CREATE INDEX idx_saved_report_tenant ON analytics_saved_report(tenant_id);
CREATE INDEX idx_saved_report_owner ON analytics_saved_report(owner_id);
CREATE INDEX idx_saved_report_report_def ON analytics_saved_report(report_definition_id);
CREATE INDEX idx_saved_report_public ON analytics_saved_report(is_public);
CREATE INDEX idx_saved_report_composite_1 ON analytics_saved_report(tenant_id, is_public, owner_id);
CREATE INDEX idx_saved_report_composite_2 ON analytics_saved_report(tenant_id, report_definition_id, is_public);

-- Unique constraint
CREATE UNIQUE INDEX idx_saved_report_unique ON analytics_saved_report(tenant_id, owner_id, name);
```

### Testing in Django Shell

```python
# Start shell
# python manage.py shell

# Import models
from apps.analytics.models import SavedReport, ReportDefinition
from django.contrib.auth import get_user_model
from apps.tenants.models import Tenant

User = get_user_model()

# Get or create test data
tenant = Tenant.objects.first()
user = User.objects.first()
report_def = ReportDefinition.objects.first()

# Create SavedReport instance
saved_report = SavedReport.objects.create(
    tenant=tenant,
    name="Test Monthly Sales Report",
    description="Test report for migration verification",
    report_definition=report_def,
    filters_config={
        "date_range": "current_month",
        "limit": 20
    },
    output_format="PDF",
    owner=user,
    is_public=False
)

# Verify creation
print(saved_report)  # Should print name
print(saved_report.id)  # Should have ID
print(saved_report.created_at)  # Should have timestamp

# Test methods
print(saved_report.can_access(user))  # Should be True
print(saved_report.is_shared)  # Should be False

# Clean up
saved_report.delete()
print("Migration verified successfully!")
```

### Common Migration Issues

| Issue | Symptom | Solution |
|-------|---------|----------|
| Missing dependency | Migration fails on foreign key | Add dependency to migrations.dependencies |
| Circular dependency | Migrations deadlock | Reorder migrations or split into separate |
| Missing default | Migration asks for default value | Add default to field or use nullable |
| Index name conflict | "Relation already exists" | Drop old index or use custom name |
| JSONField not supported | Import error | Ensure PostgreSQL version 9.4+ |

### Rollback Procedures

#### Rollback Last Migration
```bash
# Undo last migration
python manage.py migrate analytics 0001

# Completely remove migration
python manage.py migrate analytics zero
```

#### Recreate Migration
```bash
# Delete migration file
rm apps/analytics/migrations/0002_savedreport.py

# Regenerate
python manage.py makemigrations analytics

# Reapply
python manage.py migrate analytics
```

### Expected Outcome

- Migration file generated
- Database table created
- All indexes applied
- Constraints established
- Model functional and tested

### Verification Checklist

- [ ] Model code complete and saved
- [ ] Model registered in __init__.py
- [ ] Analytics app in INSTALLED_APPS
- [ ] makemigrations command run successfully
- [ ] Migration file created in migrations/
- [ ] Migration operations reviewed
- [ ] Dependencies correct in migration
- [ ] migrate command run successfully
- [ ] Database table exists
- [ ] All columns present in table
- [ ] Indexes created in database
- [ ] Foreign key constraints exist
- [ ] Unique constraints applied
- [ ] Test instance created successfully
- [ ] __str__ method works correctly
- [ ] Methods functional (can_access, etc.)
- [ ] Tenant schema updated (if using django-tenants)

---

## Summary

This document established the SavedReport model foundation for user-defined report configurations:

### Completed Infrastructure

- ✅ SavedReport model with tenant awareness
- ✅ Name and description fields for identification
- ✅ Configuration fields (report_definition, filters_config, output_format)
- ✅ Ownership and sharing system (owner, is_public)
- ✅ Database migrations applied

### Key Achievements

1. **Flexible Configuration** - JSONField for diverse filter combinations
2. **User Ownership** - Clear owner relationships and permissions
3. **Report Sharing** - Public/private report visibility control
4. **Format Options** - Support for PDF, Excel, CSV, JSON outputs
5. **Query Optimization** - Strategic database indexes for performance

### Model Summary

| Component | Implementation | Purpose |
|-----------|----------------|---------|
| Tenant Awareness | TenantAwareModel | Multi-tenant isolation |
| Identification | name, description | User-friendly labeling |
| Configuration | report_definition, filters_config | Report parameters |
| Format | output_format choices | Output preferences |
| Ownership | owner ForeignKey | Permission control |
| Sharing | is_public flag | Collaboration support |
| Timestamps | created_at, updated_at | Audit trail |

### Database Schema

```
analytics_saved_report
├── id (PK)
├── tenant_id (FK) → tenants_tenant
├── name (indexed)
├── description
├── report_definition_id (FK) → analytics_reportdefinition
├── filters_config (JSONB)
├── output_format
├── owner_id (FK) → auth_user
├── is_public (indexed)
├── created_at
└── updated_at

Indexes:
├── Primary key: id
├── Single: name, tenant, owner, report_definition, is_public
├── Composite: (tenant, is_public, owner)
└── Composite: (tenant, report_definition, is_public)

Constraints:
└── Unique: (tenant, owner, name)
```

### Next Steps

Proceed to [02_Tasks-76-84_ScheduledReport-Celery.md](02_Tasks-76-84_ScheduledReport-Celery.md) to implement scheduled report generation with:
- ScheduledReport model for automation
- Schedule frequency configuration (daily, weekly, monthly)
- Email recipient management
- Celery task for report processing
- Email distribution with attachments
- Schedule execution history tracking

---

## Notes for AI Agents

### SavedReport Model Complete Definition

**Location:** `apps/analytics/models/saved_report.py`

**Inheritance:** TenantAwareModel (provides tenant field and filtering)

**Core Fields:**
```
name: CharField(max_length=150, db_index=True)
  - User-defined report name
  - Min length 3 characters
  - Indexed for search performance
  - Required field

description: TextField(max_length=1000, blank=True, null=True)
  - Optional usage notes
  - Max 1000 characters
  - Helps users remember report purpose

report_definition: ForeignKey(ReportDefinition, on_delete=PROTECT)
  - Links to report template
  - PROTECT prevents deletion if saved reports exist
  - Indexed for filtering by type

filters_config: JSONField(default=dict, blank=True)
  - Stores filter parameters as JSON
  - Structure varies by report_definition
  - Examples: date ranges, categories, limits
  - Flexible schema for diverse reports

output_format: CharField(max_length=20, default='PDF', choices=OUTPUT_FORMAT_CHOICES)
  - User's preferred output format
  - Choices: PDF, EXCEL, CSV, JSON
  - Default: PDF

owner: ForeignKey(User, on_delete=CASCADE)
  - User who created the saved report
  - CASCADE deletes report when user deleted
  - Indexed for "my reports" queries

is_public: BooleanField(default=False, db_index=True)
  - Controls visibility to other tenant users
  - False: Only owner can see
  - True: All tenant users can view (read-only)
  - Indexed for public report lists

created_at: DateTimeField(auto_now_add=True)
  - Timestamp of creation
  - Immutable

updated_at: DateTimeField(auto_now=True)
  - Timestamp of last modification
  - Auto-updates on save
```

**Methods:**
```
__str__() → str
  Returns: f"{self.name} (by {self.owner.username})"
  
can_access(user: User) → bool
  Returns: True if user is owner or report is public
  Used for: Permission checking before display/execution
  
make_public() → None
  Sets: is_public = True
  Saves: model
  Used for: Sharing reports with team
  
make_private() → None
  Sets: is_public = False
  Saves: model
  Used for: Restricting report access
  
get_filters_display() → str
  Returns: Human-readable filter summary
  Example: "Period: Current Month, Category: Groceries, Limit: 20"
  Used for: UI display of active filters
  
validate_filters_config() → bool
  Validates: filters_config structure
  Checks: Compatible with report_definition
  Raises: ValidationError if invalid
  Used for: Pre-save validation
```

**Properties:**
```
is_shared → bool
  Returns: self.is_public
  Semantic alias for is_public
  
permissions → dict
  Returns: {
    'can_edit': user == owner,
    'can_delete': user == owner,
    'can_share': user == owner,
    'can_view': can_access(user),
    'can_copy': can_access(user)
  }
  Used for: Frontend UI control
```

**Meta Configuration:**
```
db_table = 'analytics_saved_report'
verbose_name = 'Saved Report'
verbose_name_plural = 'Saved Reports'
ordering = ['-created_at', 'name']
unique_together = [['tenant', 'owner', 'name']]
indexes = [
  Index(fields=['tenant', 'is_public', 'owner']),
  Index(fields=['tenant', 'report_definition', 'is_public'])
]
```

### Integration Points

**With ReportDefinition:**
- SavedReport references ReportDefinition via FK
- ReportDefinition defines available filters
- SavedReport.filters_config must match ReportDefinition.available_filters
- Validation ensures compatibility

**With User Model:**
- Each SavedReport owned by one User
- User can have multiple SavedReports
- Access via user.saved_reports.all()

**With Tenant System:**
- Inherits TenantAwareModel
- Automatic tenant filtering on queries
- Reports isolated per tenant
- No cross-tenant access

**With ScheduledReport (Next Task):**
- ScheduledReport will reference SavedReport
- Schedule automated execution of saved configurations
- Email distribution using saved settings

### Common Query Patterns

```python
# Get user's own reports
SavedReport.objects.filter(owner=user)

# Get public reports (shared)
SavedReport.objects.filter(is_public=True)

# Get all accessible reports for user
SavedReport.objects.filter(
    Q(owner=user) | Q(is_public=True)
)

# Get reports for specific definition
SavedReport.objects.filter(
    report_definition__code='SALES_BY_PRODUCT'
)

# Get popular public reports
SavedReport.objects.filter(
    is_public=True
).annotate(
    usage_count=Count('scheduled_reports')
).order_by('-usage_count')

# Search by name
SavedReport.objects.filter(
    name__icontains='sales'
)
```

### API Endpoint Patterns

```
GET /api/saved-reports/
  Returns: List of accessible reports (own + public)
  Filters: ?report_definition=X, ?is_public=true, ?owner=me

POST /api/saved-reports/
  Creates: New saved report
  Sets: owner = request.user automatically
  Validates: filters_config against report_definition

GET /api/saved-reports/{id}/
  Returns: Report details if accessible
  Permission: Owner or is_public=True

PATCH /api/saved-reports/{id}/
  Updates: Report configuration
  Permission: Owner only

DELETE /api/saved-reports/{id}/
  Deletes: Report
  Permission: Owner only

POST /api/saved-reports/{id}/make-public/
  Action: Sets is_public=True
  Permission: Owner only

POST /api/saved-reports/{id}/make-private/
  Action: Sets is_public=False
  Permission: Owner only

POST /api/saved-reports/{id}/copy/
  Action: Creates copy for current user
  Permission: Can access (owner or public)
  Result: New SavedReport owned by request.user

POST /api/saved-reports/{id}/execute/
  Action: Generates report using saved config
  Permission: Can access (owner or public)
  Result: ReportInstance created
```

### Validation Rules

1. **Name Validation:**
   - Min length: 3 characters
   - Max length: 150 characters
   - Unique per (tenant, owner) combination

2. **Filters Config Validation:**
   - Must be valid JSON
   - Keys must match report_definition.available_filters
   - Values must match expected types
   - Date ranges must be valid
   - Numeric limits must be positive

3. **Output Format Validation:**
   - Must be one of: PDF, EXCEL, CSV, JSON
   - Case-insensitive matching allowed
   - Default: PDF if not specified

4. **Ownership Validation:**
   - Owner must be active user
   - Owner must belong to same tenant
   - Cannot transfer ownership after creation

### Performance Considerations

**Indexes:**
- Single indexes: name, owner, report_definition, is_public
- Composite indexes for common query patterns
- Unique constraint on (tenant, owner, name)

**Query Optimization:**
- Use select_related for owner, report_definition, tenant
- Use prefetch_related for related scheduled_reports
- Filter by tenant automatically via TenantAwareModel
- Limit result sets with pagination

**JSON Field:**
- filters_config stored as JSONB in PostgreSQL
- Supports indexing and querying within JSON
- Efficient storage and retrieval
- Consider JSON field indexes for frequent searches

---

**Document Status:** ✅ Complete  
**Total Tasks:** 5  
**Estimated Implementation Time:** ~2 hours  
**Total Lines:** 982
