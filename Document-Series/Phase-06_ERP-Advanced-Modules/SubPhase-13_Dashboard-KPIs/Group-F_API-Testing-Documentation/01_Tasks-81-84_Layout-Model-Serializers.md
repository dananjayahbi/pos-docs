# Tasks 81-84: Layout Model and Serializers

> **Phase:** 06 - ERP Advanced Modules  
> **SubPhase:** 13 - Dashboard KPIs  
> **Group:** F - API, Testing & Documentation  
> **Document:** 01 of 04  
> **Tasks Covered:** 81, 82, 83, 84

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-85-86_ViewSet-All-KPIs.md](02_Tasks-85-86_ViewSet-All-KPIs.md)

---

## Document Overview

This document covers the foundation of the dashboard API infrastructure, including the DashboardLayout model for user customization, JSON widget configuration, database migrations, and serializers for data transformation.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 81 | Create DashboardLayout model | Medium | 30 min |
| 82 | Add layout widgets JSON | Medium | 25 min |
| 83 | Run layout migrations | Low | 5 min |
| 84 | Create dashboard serializers | Medium | 35 min |

---

## Task 81: Create DashboardLayout Model

### Overview
Create the DashboardLayout model to store user-specific dashboard widget configurations. This model persists widget positions, types, and display preferences, allowing each user to customize their dashboard experience independently.

### Dependencies
- Dashboard app exists (`apps/dashboard/`)
- User model is configured
- KPI models created (Tasks 1-45)
- Alert models created (Tasks 65-80)

### Instructions

1. **Create layout.py model file**
   - Create file at `apps/dashboard/models/dashboard_layout.py`
   - Import necessary Django components

2. **Import required modules**
   - Import Django model fields
   - Import User model (from django.contrib.auth or custom)
   - Import JSONField
   - Import timezone utilities

3. **Define DashboardLayout model class**
   - Inherit from models.Model
   - Add model docstring explaining purpose

4. **Add user field**
   - OneToOneField to User model
   - Ensures one layout per user
   - on_delete=models.CASCADE (delete layout with user)
   - Related_name='dashboard_layout'

5. **Add created_at field**
   - DateTimeField with auto_now_add=True
   - Records when layout was first created
   - Immutable after creation

6. **Add updated_at field**
   - DateTimeField with auto_now=True
   - Tracks last modification time
   - Updates automatically on save

7. **Add Meta class**
   - Set verbose_name and verbose_name_plural
   - Add ordering by user
   - Add index on user field
   - Add db_table name

8. **Add __str__ method**
   - Return descriptive string
   - Format: "Dashboard Layout - [Username]"

9. **Update models/__init__.py**
   - Import DashboardLayout
   - Add to __all__ list

### DashboardLayout Model Structure

```
┌─────────────────────────────────────────────────┐
│           DashboardLayout Model                 │
├─────────────────────────────────────────────────┤
│ Core Fields:                                    │
│  • user (OneToOneField)                         │
│  • created_at (DateTimeField)                   │
│  • updated_at (DateTimeField)                   │
│                                                 │
│ Widget Configuration:                           │
│  • widgets (JSONField) - Added in Task 82       │
└─────────────────────────────────────────────────┘
```

### Model Relationships

```
┌──────────────┐        1:1          ┌────────────────────┐
│     User     │◄────────────────────│ DashboardLayout    │
└──────────────┘                     └────────────────────┘
                                              │
                                              │ Stores
                                              ▼
                                     ┌─────────────────────┐
                                     │  Widget Config JSON │
                                     │  • Positions        │
                                     │  • KPI Codes        │
                                     │  • Display Options  │
                                     └─────────────────────┘
```

### Field Details

| Field | Type | Required | Default | Purpose |
|-------|------|----------|---------|---------|
| user | OneToOneField | Yes | - | User association |
| created_at | DateTimeField | Yes | now() | Creation timestamp |
| updated_at | DateTimeField | Yes | now() | Last update timestamp |

### OneToOne Relationship Behavior

```
User-Layout Relationship
════════════════════════

User A ──────┐
             │ 1:1
             ▼
        DashboardLayout A

User B ──────┐
             │ 1:1
             ▼
        DashboardLayout B

Each user has exactly one layout.
Each layout belongs to exactly one user.
```

### Cascade Deletion Flow

```
User Deletion → Layout Deletion
═══════════════════════════════

DELETE User
    │
    ▼
CASCADE to DashboardLayout
    │
    ▼
Layout automatically deleted
Widget configuration lost
```

### Sri Lankan Business Context

| User Role | Typical Dashboard Needs |
|-----------|------------------------|
| Store Manager | Sales, inventory, cashier performance |
| Accountant | Financial KPIs, payments, expenses |
| HR Manager | Employee metrics, attendance, payroll |
| Owner/Admin | All KPIs with financial focus |
| Branch Supervisor | Branch-specific sales and inventory |

### Expected Outcome
- Functional DashboardLayout model
- One-to-one user relationship
- Automatic timestamp tracking
- Foundation for widget configuration
- Ready for JSON field addition

### Verification Checklist
- [ ] dashboard_layout.py file created
- [ ] DashboardLayout class defined
- [ ] user OneToOneField configured
- [ ] created_at field added
- [ ] updated_at field added
- [ ] Meta class configured
- [ ] __str__ method implemented
- [ ] Model imported in __init__.py
- [ ] Cascade deletion configured

---

## Task 82: Add Layout Widgets JSON

### Overview
Add the widgets JSONField to store dashboard widget configurations. This field holds widget positions, KPI associations, display types, and custom settings in a flexible JSON structure.

### Dependencies
- Task 81: Create DashboardLayout model

### Instructions

1. **Open dashboard_layout.py model file**
   - Navigate to `apps/dashboard/models/dashboard_layout.py`
   - Locate DashboardLayout model class

2. **Add widgets field**
   - JSONField for widget configuration
   - Default to empty dict {}
   - Stores widget array and metadata

3. **Define widget configuration schema**
   - Add docstring documenting JSON structure
   - Explain widget object format
   - List required and optional fields

4. **Document position system**
   - Grid-based layout (x, y coordinates)
   - Width and height in grid units
   - Responsive breakpoints optional

5. **Document KPI code reference**
   - Links widget to KPI definition
   - Uses KPI_CODE from KPIDefinition model
   - Validates against available KPIs

6. **Document widget types**
   - NUMBER: Single metric display
   - CHART: Line, bar, pie visualizations
   - TABLE: Tabular data display
   - GAUGE: Progress/target indicators

7. **Document configuration options**
   - Display preferences per widget type
   - Comparison periods (yesterday, last_week, etc.)
   - Chart type selection
   - Color and styling options

8. **Add validation method**
   - Create validate_widgets method
   - Check JSON structure validity
   - Verify KPI codes exist
   - Validate position conflicts

9. **Update model docstring**
   - Document widgets field purpose
   - Provide JSON example
   - List widget types

### Widgets JSON Structure

```
┌──────────────────────────────────────────────────┐
│           Widgets JSON Schema                    │
├──────────────────────────────────────────────────┤
│ Root Object:                                     │
│  • widgets: Array of widget objects              │
│                                                  │
│ Widget Object:                                   │
│  • id: Unique identifier (string)                │
│  • kpi_code: KPI reference (string)              │
│  • widget_type: Display type (string)            │
│  • position: Coordinates object                  │
│  • config: Display options object                │
└──────────────────────────────────────────────────┘
```

### Complete JSON Example

```json
{
  "widgets": [
    {
      "id": "widget_sales_today",
      "kpi_code": "SALES_TODAY",
      "widget_type": "NUMBER",
      "position": {"x": 0, "y": 0, "w": 2, "h": 1},
      "config": {
        "show_trend": true,
        "comparison": "yesterday",
        "show_percentage": true,
        "currency": "LKR"
      }
    },
    {
      "id": "widget_sales_trend",
      "kpi_code": "SALES_TREND_7D",
      "widget_type": "CHART",
      "position": {"x": 2, "y": 0, "w": 4, "h": 2},
      "config": {
        "chart_type": "line",
        "period": "week",
        "show_comparison": true,
        "color": "#4CAF50"
      }
    }
  ]
}
```

### Position System Details

| Property | Type | Description | Example |
|----------|------|-------------|---------|
| x | Integer | Horizontal grid position (0-based) | 0, 2, 4 |
| y | Integer | Vertical grid position (0-based) | 0, 1, 2 |
| w | Integer | Width in grid units | 2, 4, 6 |
| h | Integer | Height in grid units | 1, 2, 3 |

### Widget Types and Configuration

#### NUMBER Widget
Shows single metric with optional trend indicator.

#### CHART Widget
Displays data visualizations (line, bar, pie charts).

#### TABLE Widget
Shows tabular data with sorting and filtering.

#### GAUGE Widget
Displays progress towards targets or thresholds.

### Validation Rules

| Rule | Description | Error Response |
|------|-------------|----------------|
| Unique IDs | Widget IDs must be unique within layout | "Duplicate widget ID" |
| Valid KPI Codes | KPI code must exist in KPIDefinition | "Invalid KPI code" |
| Position Bounds | x, y, w, h must be positive integers | "Invalid position" |
| Valid Widget Type | Must be NUMBER, CHART, TABLE, or GAUGE | "Invalid widget type" |

### Expected Outcome
- Flexible widget storage
- Grid-based positioning
- Support for multiple widget types
- Comprehensive configuration options
- Validation for data integrity

### Verification Checklist
- [ ] widgets JSONField added
- [ ] Default to empty dict
- [ ] Widget structure documented
- [ ] Position system explained
- [ ] Widget types defined
- [ ] Configuration options documented
- [ ] Validation method created
- [ ] Model docstring updated with examples

---

## Task 83: Run Layout Migrations

### Overview
Generate and apply database migrations for the DashboardLayout model. This task creates the necessary database schema to store user dashboard configurations.

### Dependencies
- Task 82: Add layout widgets JSON

### Instructions

1. **Generate migration file**
   - Open terminal in project root
   - Activate virtual environment
   - Run makemigrations command for dashboard app

2. **Review migration file**
   - Navigate to `apps/dashboard/migrations/`
   - Open newly created migration file
   - Verify DashboardLayout model creation
   - Check field definitions

3. **Verify migration operations**
   - Confirm CreateModel operation exists
   - Check user OneToOneField
   - Verify JSONField for widgets
   - Check timestamp fields

4. **Apply migration**
   - Run migrate command
   - Monitor for errors
   - Verify successful completion

5. **Verify database schema**
   - Connect to database
   - Check dashboard_dashboardlayout table exists
   - Verify column structure
   - Check indexes and constraints

6. **Test model in Django shell**
   - Open Django shell
   - Import DashboardLayout model
   - Create test instance
   - Verify save and retrieval

### Migration Commands

```bash
# Generate migration
python manage.py makemigrations dashboard

# Review migration file
# Check apps/dashboard/migrations/000X_dashboardlayout.py

# Apply migration
python manage.py migrate dashboard

# Verify migration status
python manage.py showmigrations dashboard
```

### Expected Migration File Structure

```python
# Generated migration file: 000X_dashboardlayout.py

operations = [
    migrations.CreateModel(
        name='DashboardLayout',
        fields=[
            ('id', models.BigAutoField(...)),
            ('user', models.OneToOneField(...)),
            ('widgets', models.JSONField(default=dict)),
            ('created_at', models.DateTimeField(auto_now_add=True)),
            ('updated_at', models.DateTimeField(auto_now=True)),
        ],
        options={
            'verbose_name': 'Dashboard Layout',
            'verbose_name_plural': 'Dashboard Layouts',
            'ordering': ['user'],
        },
    ),
]
```

### Database Schema Verification

```sql
-- Expected table structure
CREATE TABLE dashboard_dashboardlayout (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE,
    widgets JSONB NOT NULL DEFAULT '{}',
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    FOREIGN KEY (user_id) REFERENCES auth_user(id) ON DELETE CASCADE
);

-- Expected indexes
CREATE INDEX dashboard_dashboardlayout_user_id_idx 
ON dashboard_dashboardlayout(user_id);
```

### Migration Troubleshooting

| Error | Cause | Solution |
|-------|-------|----------|
| "No changes detected" | Model not in migrations path | Verify app in INSTALLED_APPS |
| "JSONField not found" | PostgreSQL required | Install psycopg2, configure PostgreSQL |
| "Migration conflict" | Parallel migrations | Merge migrations or delete and regenerate |
| "Foreign key error" | User model not migrated | Run migrations for auth app first |

### Expected Outcome
- Migration file generated successfully
- Database schema created
- DashboardLayout table exists with correct structure
- Indexes and constraints applied
- Model functional in Django shell

### Verification Checklist
- [ ] Migration file created
- [ ] Migration file reviewed
- [ ] CreateModel operation present
- [ ] Fields match model definition
- [ ] Migration applied successfully
- [ ] No migration errors
- [ ] Database table exists
- [ ] Columns verified in database
- [ ] Model tested in Django shell
- [ ] Test layout created and saved

---

## Task 84: Create Dashboard Serializers

### Overview
Create DRF serializers for dashboard data serialization. These serializers transform KPI calculator outputs, alert data, and dashboard layouts into JSON responses for API consumption.

### Dependencies
- Task 83: Run layout migrations
- DRF installed and configured
- KPI models and calculators exist

### Instructions

1. **Create serializers directory**
   - Create `serializers/` directory in dashboard app
   - Create `__init__.py` file

2. **Create kpi.py serializer file**
   - Create file at `apps/dashboard/serializers/kpi.py`
   - Import necessary DRF components

3. **Define KPIValueSerializer**
   - Serialize individual KPI metric
   - Fields: code, label, value, unit, trend

4. **Define SalesKPISerializer**
   - Serialize sales KPI group
   - Include all sales metrics
   - Add comparison data

5. **Define InventoryKPISerializer**
   - Serialize inventory KPI group
   - Include stock metrics
   - Add alert thresholds

6. **Define FinancialKPISerializer**
   - Serialize financial KPI group
   - Include revenue and expense data
   - Format currency values

7. **Define HRKPISerializer**
   - Serialize HR KPI group
   - Include employee metrics
   - Add attendance data

8. **Define AlertSerializer**
   - Serialize KPI alert
   - Include alert details and severity
   - Add timestamp information

9. **Define AllKPIsSerializer**
   - Combine all KPI categories
   - Include alerts
   - Add metadata (last_updated, tenant)

10. **Create layout.py serializer file**
    - Create file at `apps/dashboard/serializers/layout.py`
    - Define DashboardLayoutSerializer

11. **Define DashboardLayoutSerializer**
    - ModelSerializer for DashboardLayout
    - Fields: user, widgets, created_at, updated_at
    - Add widget validation

12. **Update serializers/__init__.py**
    - Import all serializers
    - Add to __all__ list

### Serializer File Structure

```
apps/dashboard/serializers/
├── __init__.py
├── kpi.py                    # KPI serializers
└── layout.py                 # Layout serializer
```

### KPIValueSerializer Structure

Individual KPI metric with trend and comparison data.

### SalesKPISerializer Example Response

```json
{
  "today": {
    "code": "SALES_TODAY",
    "label": "Sales Today",
    "value": 245000.00,
    "unit": "LKR",
    "trend": {
      "direction": "up",
      "percentage": 12.5,
      "previous_value": 217778.00
    }
  },
  "mtd": {
    "code": "SALES_MTD",
    "label": "Sales This Month",
    "value": 5670000.00,
    "unit": "LKR"
  }
}
```

### InventoryKPISerializer Example Response

```json
{
  "low_stock_count": {
    "code": "LOW_STOCK_COUNT",
    "label": "Low Stock Items",
    "value": 15,
    "unit": "items",
    "threshold": 20,
    "alert_level": "warning"
  },
  "stock_value": {
    "code": "STOCK_VALUE",
    "label": "Total Stock Value",
    "value": 2450000.00,
    "unit": "LKR"
  }
}
```

### FinancialKPISerializer Example Response

```json
{
  "revenue_mtd": {
    "code": "REVENUE_MTD",
    "label": "Revenue (Month to Date)",
    "value": 5670000.00,
    "unit": "LKR",
    "trend": {"direction": "up", "percentage": 8.5}
  },
  "gross_profit": {
    "code": "GROSS_PROFIT",
    "label": "Gross Profit",
    "value": 2250000.00,
    "unit": "LKR",
    "margin_percentage": 39.68
  }
}
```

### HRKPISerializer Example Response

```json
{
  "active_employees": {
    "code": "ACTIVE_EMPLOYEES",
    "label": "Active Employees",
    "value": 45,
    "unit": "employees"
  },
  "attendance_rate": {
    "code": "ATTENDANCE_RATE",
    "label": "Attendance Rate",
    "value": 94.5,
    "unit": "%",
    "threshold": 90.0,
    "status": "good"
  }
}
```

### AlertSerializer Example Response

```json
{
  "id": 123,
  "kpi_code": "LOW_STOCK_COUNT",
  "severity": "WARNING",
  "title": "Low Stock Alert",
  "message": "15 products are below minimum stock level",
  "current_value": 15,
  "threshold_value": 20,
  "triggered_at": "2026-01-25T08:30:00Z",
  "is_active": true
}
```

### AllKPIsSerializer Example Response

```json
{
  "sales": { /* Sales KPIs */ },
  "inventory": { /* Inventory KPIs */ },
  "financial": { /* Financial KPIs */ },
  "hr": { /* HR KPIs */ },
  "alerts": [ /* Alert list */ ],
  "metadata": {
    "last_updated": "2026-01-25T10:30:00Z",
    "tenant": "lankacommerce_retail",
    "cache_hit": true
  }
}
```

### DashboardLayoutSerializer Example

ModelSerializer for DashboardLayout with validation.

### Layout Serializer Response

```json
{
  "user": 42,
  "widgets": {
    "widgets": [
      {
        "id": "widget_1",
        "kpi_code": "SALES_TODAY",
        "widget_type": "NUMBER",
        "position": {"x": 0, "y": 0, "w": 2, "h": 1},
        "config": {"show_trend": true}
      }
    ]
  },
  "created_at": "2026-01-20T09:00:00Z",
  "updated_at": "2026-01-25T10:30:00Z"
}
```

### Serializer Validation Rules

| Serializer | Validation | Error Message |
|------------|------------|---------------|
| KPIValueSerializer | Value is numeric | "Invalid KPI value format" |
| InventoryKPISerializer | Threshold is positive | "Invalid threshold value" |
| FinancialKPISerializer | Currency format valid | "Invalid currency format" |
| AlertSerializer | Severity in choices | "Invalid severity level" |
| DashboardLayoutSerializer | Valid JSON structure | "Invalid widget configuration" |

### Expected Outcome
- Complete serializer suite for dashboard
- KPI data transformation
- Alert serialization
- Layout persistence
- Validation and error handling

### Verification Checklist
- [ ] serializers/ directory created
- [ ] kpi.py file created
- [ ] KPIValueSerializer defined
- [ ] SalesKPISerializer defined
- [ ] InventoryKPISerializer defined
- [ ] FinancialKPISerializer defined
- [ ] HRKPISerializer defined
- [ ] AlertSerializer defined
- [ ] AllKPIsSerializer defined
- [ ] layout.py file created
- [ ] DashboardLayoutSerializer defined
- [ ] Validation methods implemented
- [ ] __init__.py imports configured

---

## Summary

This document established the foundation of the dashboard API infrastructure:

### Completed Infrastructure
- ✅ DashboardLayout model for user customization
- ✅ Widget JSON configuration system
- ✅ Database migrations applied
- ✅ Comprehensive serializers (KPI, Alert, Layout)

### Key Achievements
1. **User Customization** - Per-user dashboard layouts with widget positioning
2. **Flexible Configuration** - JSON-based widget storage
3. **Data Transformation** - Complete serializer suite
4. **Validation** - Widget and position validation

### Next Steps
Proceed to [02_Tasks-85-86_ViewSet-All-KPIs.md](02_Tasks-85-86_ViewSet-All-KPIs.md) to implement the DashboardViewSet and combined API endpoints.

---

**Document Status:** ✅ Complete  
**Total Tasks:** 4  
**Total Lines:** ~670
