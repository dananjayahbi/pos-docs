# Tasks 09-16: KPIDefinition Model and BaseKPICalculator

> **Phase:** 06 - ERP Advanced Modules  
> **SubPhase:** 13 - Dashboard KPIs  
> **Group:** A - KPI Framework  
> **Document:** 02 of 02  
> **Tasks Covered:** 09, 10, 11, 12, 13, 14, 15, 16

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-01-08_Dashboard-App-Enums.md](01_Tasks-01-08_Dashboard-App-Enums.md)
- **→ Next Group:** [Group-B_Sales-KPIs](../../Group-B_Sales-KPIs/)

---

## Document Overview

This document covers the KPIDefinition model which defines available KPIs in the system with their calculation methods, formats, and permission requirements. Also creates the BaseKPICalculator abstract class that all specific KPI calculators will extend, implementing the Strategy pattern for flexible KPI calculations.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 09 | Add KPI Widget Type | Low | 10 min |
| 10 | Add KPI Calculation Method | Low | 10 min |
| 11 | Add KPI Format Field | Low | 10 min |
| 12 | Add KPI Permissions | Low | 15 min |
| 13 | Run KPIDefinition Migrations | Low | 5 min |
| 14 | Create KPI Fixtures | Medium | 30 min |
| 15 | Create BaseKPICalculator | High | 45 min |
| 16 | Add Calculate Method | Medium | 25 min |

---

## Task 09: Add KPI Widget Type

### Overview
Add the widget type field to the KPIDefinition model to specify the default visualization widget for displaying the KPI. This determines how the KPI value will be presented on the dashboard (as a number, chart, table, gauge, or trend indicator).

### Dependencies
- Task 06: Create KPIDefinition Model
- Task 05: Define WidgetType Enum

### Instructions

1. **Open kpi_definition.py model file**
   - Navigate to `apps/dashboard/models/kpi_definition.py`
   - Locate KPIDefinition model class

2. **Import WidgetType enum**
   - Import from dashboard.enums module
   - Ensure proper import path

3. **Add default_widget_type field**
   - CharField with max_length=20
   - Choices from WidgetType enum
   - Required field (no blank/null)
   - Default to WidgetType.NUMBER

4. **Add widget_type help text**
   - Clear description of field purpose
   - Example: "Default widget type for displaying this KPI"
   - Mention that it can be overridden per dashboard

5. **Add field verbose_name**
   - Set to "Default Widget Type"
   - Improves admin interface readability

6. **Update model docstring**
   - Document widget type field
   - Explain widget selection criteria

### Widget Type Field Specifications

```
┌────────────────────────────────────────────────┐
│         Widget Type Configuration              │
├────────────────────────────────────────────────┤
│ Field: default_widget_type                     │
│ Type: CharField(20)                            │
│ Choices: WidgetType enum                       │
│ Default: WidgetType.NUMBER                     │
│ Required: Yes                                  │
│ Purpose: Determines KPI visualization          │
└────────────────────────────────────────────────┘
```

### Widget Type Selection Guide

| Widget Type | Best For | Example KPIs |
|-------------|----------|--------------|
| NUMBER | Single value metrics | Today's Revenue, Active Customers |
| CHART | Time-series trends | Sales Over Time, Inventory Levels |
| TABLE | List of items | Top Products, Best Customers |
| GAUGE | Progress toward goal | Sales Target, Stock Coverage |
| TREND | Quick trend indicator | Revenue Change %, Order Growth |

### Widget Type by KPI Category

| KPI Category | Common Widget Types |
|--------------|---------------------|
| SALES | NUMBER (daily totals), CHART (trends), TABLE (top items) |
| INVENTORY | GAUGE (stock levels), NUMBER (quantities), TABLE (low stock) |
| FINANCIAL | NUMBER (profit/loss), CHART (cash flow), GAUGE (margins) |
| HR | NUMBER (headcount), CHART (attendance), TABLE (top performers) |

### Widget Type Examples for Sri Lankan Context

#### Sales KPIs
```
KPI: "Today's Revenue"
Widget Type: NUMBER
Display: LKR 150,000 ↑ +15%

KPI: "Weekly Sales Trend"
Widget Type: CHART
Display: Bar chart showing daily sales Mon-Sun

KPI: "Top 10 Products Today"
Widget Type: TABLE
Display: List with product name, qty, revenue
```

#### Inventory KPIs
```
KPI: "Stock Coverage Days"
Widget Type: GAUGE
Display: Circular gauge showing 45/60 days

KPI: "Low Stock Items"
Widget Type: TABLE
Display: Items below reorder point

KPI: "Inventory Turnover"
Widget Type: NUMBER
Display: 8.5 times/year ↑ +0.5
```

#### Financial KPIs
```
KPI: "Gross Profit Margin"
Widget Type: GAUGE
Display: 32% (target 30%)

KPI: "Cash Flow"
Widget Type: CHART
Display: Line chart showing monthly inflow/outflow

KPI: "Net Profit This Month"
Widget Type: NUMBER
Display: LKR 450,000 ↑ +12%
```

### Widget Type Rendering Requirements

| Widget Type | Required Data | Display Elements |
|-------------|---------------|------------------|
| NUMBER | Current value, previous value | Large number, trend arrow, percentage change |
| CHART | Time-series data (dates + values) | X-axis (time), Y-axis (values), bars/lines |
| TABLE | List of records | Column headers, rows, sorting |
| GAUGE | Current value, target value | Circular/linear gauge, percentage fill |
| TREND | Series of values | Sparkline, change indicator |

### Expected Outcome
- Widget type field added to model
- Default visualization specified per KPI
- Flexible dashboard presentation
- Support for various data types

### Verification Checklist
- [ ] WidgetType enum imported
- [ ] default_widget_type field added
- [ ] Field has appropriate max_length
- [ ] Choices set to WidgetType enum
- [ ] Default value set to NUMBER
- [ ] Help text added
- [ ] Verbose name configured
- [ ] Model docstring updated

---

## Task 10: Add KPI Calculation Method

### Overview
Add the calculation method reference field to the KPIDefinition model. This field stores the name of the calculator class method that will compute the KPI value, enabling dynamic calculator selection and execution.

### Dependencies
- Task 09: Add KPI Widget Type

### Instructions

1. **Open kpi_definition.py model file**
   - Continue in `apps/dashboard/models/kpi_definition.py`
   - Locate KPIDefinition model class

2. **Add calculation_method field**
   - CharField with max_length=100
   - Required field (no blank/null)
   - Stores method/class reference name
   - Example: "SalesKPICalculator.calculate_daily_revenue"

3. **Add calculation_method help text**
   - Description: "Calculator class method for computing this KPI"
   - Mention format: "CalculatorClass.method_name"
   - Note: Must exist in calculators module

4. **Add field verbose_name**
   - Set to "Calculation Method"
   - Admin interface clarity

5. **Add validation comment**
   - Document that method must be callable
   - Method should accept (tenant, period, filters)
   - Method should return dict with value and metadata

6. **Update model docstring**
   - Explain calculation method resolution
   - Document expected method signature

### Calculation Method Field Structure

```
┌────────────────────────────────────────────────┐
│      Calculation Method Configuration          │
├────────────────────────────────────────────────┤
│ Field: calculation_method                      │
│ Type: CharField(100)                           │
│ Format: "CalculatorClass.method_name"          │
│ Required: Yes                                  │
│ Purpose: Dynamic calculator method reference   │
└────────────────────────────────────────────────┘
```

### Method Reference Format

```
Standard Format:
CalculatorClass.method_name

Examples:
• SalesKPICalculator.calculate_daily_revenue
• InventoryKPICalculator.calculate_stock_value
• FinancialKPICalculator.calculate_gross_margin
• HRKPICalculator.calculate_active_employees
```

### Method Reference by KPI Category

| KPI Category | Calculator Class | Example Methods |
|--------------|-----------------|-----------------|
| SALES | SalesKPICalculator | calculate_daily_revenue, calculate_order_count, calculate_avg_order_value |
| INVENTORY | InventoryKPICalculator | calculate_stock_value, calculate_turnover_rate, calculate_low_stock_count |
| FINANCIAL | FinancialKPICalculator | calculate_gross_profit, calculate_net_margin, calculate_cash_balance |
| HR | HRKPICalculator | calculate_employee_count, calculate_attendance_rate, calculate_productivity |

### Calculator Method Signature

```
Standard Method Signature
═════════════════════════

def calculate_metric_name(
    self,
    tenant: Tenant,
    period: KPIPeriod,
    start_date: date,
    end_date: date,
    filters: dict = None
) -> dict:
    """
    Calculate specific KPI metric.
    
    Args:
        tenant: Current tenant
        period: Time period (TODAY, WEEK, MONTH, etc.)
        start_date: Period start date
        end_date: Period end date
        filters: Optional filters (location, category, etc.)
    
    Returns:
        dict: {
            'value': Numeric value,
            'formatted_value': Display string,
            'previous_value': Previous period value,
            'change_percent': Percentage change,
            'trend': 'up', 'down', or 'stable',
            'metadata': Additional context
        }
    """
    pass
```

### Sri Lankan Context Examples

#### Sales Calculator Methods
```
KPI: "Today's Revenue (LKR)"
Method: SalesKPICalculator.calculate_daily_revenue
Returns: {
    'value': 150000.00,
    'formatted_value': 'LKR 150,000.00',
    'previous_value': 130000.00,
    'change_percent': 15.38,
    'trend': 'up',
    'metadata': {'order_count': 45, 'avg_order': 3333.33}
}

KPI: "Orders This Week"
Method: SalesKPICalculator.calculate_weekly_orders
Returns: {
    'value': 312,
    'formatted_value': '312 orders',
    'previous_value': 285,
    'change_percent': 9.47,
    'trend': 'up',
    'metadata': {'avg_per_day': 44.6}
}
```

#### Inventory Calculator Methods
```
KPI: "Total Stock Value (LKR)"
Method: InventoryKPICalculator.calculate_stock_value
Returns: {
    'value': 2500000.00,
    'formatted_value': 'LKR 2.5M',
    'previous_value': 2400000.00,
    'change_percent': 4.17,
    'trend': 'up',
    'metadata': {'item_count': 850, 'categories': 12}
}
```

#### Financial Calculator Methods
```
KPI: "Gross Profit Margin"
Method: FinancialKPICalculator.calculate_gross_margin
Returns: {
    'value': 32.5,
    'formatted_value': '32.5%',
    'previous_value': 30.2,
    'change_percent': 7.62,
    'trend': 'up',
    'metadata': {'revenue': 500000, 'cogs': 337500}
}
```

### Method Resolution Process

```
KPI Calculation Flow
════════════════════

1. Get KPIDefinition record
   └─> calculation_method = "SalesKPICalculator.calculate_daily_revenue"

2. Parse method reference
   └─> Class: SalesKPICalculator
   └─> Method: calculate_daily_revenue

3. Import calculator class
   └─> from dashboard.calculators.sales import SalesKPICalculator

4. Instantiate calculator
   └─> calculator = SalesKPICalculator(kpi_definition, period)

5. Call method
   └─> result = calculator.calculate_daily_revenue(tenant, period, ...)

6. Return formatted result
   └─> Cache and display value
```

### Naming Conventions

| Method Prefix | Purpose | Example |
|--------------|---------|---------|
| calculate_ | Main calculation methods | calculate_daily_revenue |
| get_ | Retrieve supporting data | get_period_sales |
| format_ | Format output values | format_currency_value |
| validate_ | Input validation | validate_date_range |

### Expected Outcome
- Calculation method field added
- Dynamic calculator method resolution
- Flexible KPI calculations
- Support for various calculator classes

### Verification Checklist
- [ ] calculation_method field added
- [ ] Field has max_length=100
- [ ] Field is required
- [ ] Help text added
- [ ] Verbose name configured
- [ ] Model docstring updated
- [ ] Method signature documented

---

## Task 11: Add KPI Format Field

### Overview
Add the format field to the KPIDefinition model to specify how the KPI value should be formatted for display. Supports currency (LKR), number (with thousand separators), and percentage formats tailored for Sri Lankan business context.

### Dependencies
- Task 10: Add KPI Calculation Method

### Instructions

1. **Open kpi_definition.py model file**
   - Continue in `apps/dashboard/models/kpi_definition.py`
   - Locate KPIDefinition model class

2. **Define FORMAT_CHOICES constant**
   - Create tuple with format options
   - Include: 'currency', 'number', 'percent'
   - Follow Django choices pattern

3. **Add FORMAT_CURRENCY constant**
   - Value: 'currency'
   - Display: "Currency (LKR)"
   - For monetary values

4. **Add FORMAT_NUMBER constant**
   - Value: 'number'
   - Display: "Number"
   - For counts and quantities

5. **Add FORMAT_PERCENT constant**
   - Value: 'percent'
   - Display: "Percentage (%)"
   - For ratios and rates

6. **Add value_format field**
   - CharField with max_length=20
   - Choices from FORMAT_CHOICES
   - Default to 'number'
   - Required field

7. **Add decimal_places field**
   - PositiveSmallIntegerField
   - Default to 2
   - Specifies decimal precision
   - Range: 0-4

8. **Add show_thousand_separator field**
   - BooleanField, default=True
   - Adds commas/spaces to large numbers
   - Improves readability

9. **Add field help texts**
   - value_format: "How to format the KPI value for display"
   - decimal_places: "Number of decimal places (0-4)"
   - show_thousand_separator: "Add separators for thousands"

10. **Update model docstring**
    - Document formatting options
    - Provide format examples

### Format Field Structure

```
┌────────────────────────────────────────────────┐
│         KPI Format Configuration               │
├────────────────────────────────────────────────┤
│ Format Type Field:                             │
│  • value_format (CharField)                    │
│    Choices: currency, number, percent          │
│    Default: number                             │
│                                                │
│ Format Options:                                │
│  • decimal_places (0-4)                        │
│  • show_thousand_separator (Boolean)           │
└────────────────────────────────────────────────┘
```

### Format Type Details

| Format | Value | Display Example (LKR Context) | Use Case |
|--------|-------|-------------------------------|----------|
| Currency | 'currency' | LKR 150,000.00 | Revenue, costs, balances |
| Number | 'number' | 1,250 | Quantities, counts, units |
| Percentage | 'percent' | 32.5% | Margins, growth rates, ratios |

### Sri Lankan Currency Formatting

#### Currency Format Examples
```
Value: 150000
Format: currency
decimal_places: 2
Output: LKR 150,000.00

Value: 2500000
Format: currency
decimal_places: 2
Output: LKR 2,500,000.00

Value: 45.50
Format: currency
decimal_places: 2
Output: LKR 45.50
```

#### Large Amount Formatting (Sri Lankan Context)
```
Value: 10000000
Format: currency
Output: LKR 10,000,000.00 (Ten Million)
Alternative: LKR 10M (Million notation)

Value: 100000000
Format: currency
Output: LKR 100,000,000.00 (Hundred Million)
Alternative: LKR 100M
```

### Number Format Examples

#### Integer Counts
```
Value: 1250
Format: number
decimal_places: 0
separator: True
Output: 1,250

Value: 45
Format: number
decimal_places: 0
Output: 45
```

#### Decimal Numbers
```
Value: 8.5
Format: number
decimal_places: 1
Output: 8.5

Value: 123.456
Format: number
decimal_places: 2
Output: 123.46
```

### Percentage Format Examples

#### Margin Percentages
```
Value: 32.5
Format: percent
decimal_places: 1
Output: 32.5%

Value: 0.15
Format: percent
decimal_places: 2
Output: 15.00%
```

#### Growth Rates
```
Value: 125.5
Format: percent
decimal_places: 1
Output: 125.5% (growth)

Value: -5.2
Format: percent
decimal_places: 1
Output: -5.2% (decline)
```

### Format Configuration by KPI Type

| KPI Type | Format | Decimal Places | Separator | Example |
|----------|--------|----------------|-----------|---------|
| Daily Revenue | currency | 2 | Yes | LKR 150,000.00 |
| Order Count | number | 0 | Yes | 1,250 |
| Average Order Value | currency | 2 | Yes | LKR 3,333.33 |
| Stock Quantity | number | 0 | Yes | 5,430 |
| Inventory Turnover | number | 1 | No | 8.5 |
| Gross Margin | percent | 1 | No | 32.5% |
| Growth Rate | percent | 2 | No | 15.75% |
| Employee Count | number | 0 | No | 45 |

### Formatting Logic Flow

```
Format Value Process
════════════════════

Input: value = 150000, format = 'currency', decimals = 2

Step 1: Round to decimal places
└─> 150000.00

Step 2: Apply thousand separators
└─> 150,000.00

Step 3: Add format-specific prefix/suffix
└─> LKR 150,000.00

Output: "LKR 150,000.00"
```

### Decimal Places Guidelines

| Decimal Places | Use Case | Example |
|---------------|----------|---------|
| 0 | Whole numbers, counts | 1,250 items |
| 1 | Simple decimals, ratios | 8.5 times |
| 2 | Currency, precise measurements | LKR 150,000.00 |
| 3 | Scientific values | 0.125 ratio |
| 4 | High precision calculations | 1.2345% |

### Thousand Separator Considerations

#### With Separator (Recommended for Large Values)
```
1,000
10,000
100,000
1,000,000
```

#### Without Separator (Small Values)
```
45
125
850
```

### Sri Lankan Number Formats

#### Lakh and Crore System (Informational)
```
Western: 1,000,000
Indian: 10,00,000 (10 Lakhs)
Display: LKR 10,00,000 or LKR 10L

Western: 10,000,000
Indian: 1,00,00,000 (1 Crore)
Display: LKR 1,00,00,000 or LKR 1Cr
```

Note: System uses international format (1,000,000) but can display in lakh/crore notation as alternative.

### Expected Outcome
- Format field added to model
- Support for currency, number, percent
- Configurable decimal places
- Thousand separator option
- LKR currency formatting

### Verification Checklist
- [ ] FORMAT_CHOICES constant defined
- [ ] FORMAT_CURRENCY constant created
- [ ] FORMAT_NUMBER constant created
- [ ] FORMAT_PERCENT constant created
- [ ] value_format field added
- [ ] decimal_places field added
- [ ] show_thousand_separator field added
- [ ] All fields have help text
- [ ] Model docstring updated
- [ ] LKR currency support noted

---

## Task 12: Add KPI Permissions

### Overview
Add permission requirements to the KPIDefinition model to control which user roles can view specific KPIs. Integrates with the role-based permission system to ensure sensitive business metrics are only visible to authorized users.

### Dependencies
- Task 11: Add KPI Format Field
- Core permission system (Phase 03, SubPhase 05)

### Instructions

1. **Open kpi_definition.py model file**
   - Continue in `apps/dashboard/models/kpi_definition.py`
   - Locate KPIDefinition model class

2. **Import Permission model**
   - From django.contrib.auth.models
   - Or from custom auth app if customized

3. **Add required_permission field**
   - ForeignKey to Permission model
   - Optional (blank=True, null=True)
   - on_delete=SET_NULL
   - No permission means accessible to all

4. **Add field related_name**
   - Set to 'kpi_definitions'
   - Allows reverse lookup from Permission

5. **Add field help text**
   - Description: "Permission required to view this KPI"
   - Note: "Leave empty for public KPIs"

6. **Add field verbose_name**
   - Set to "Required Permission"
   - Admin interface clarity

7. **Add permission check method**
   - Create has_permission(user) method
   - Returns True if user can view KPI
   - Check required_permission if set

8. **Add permission cache comment**
   - Document that permission checks are cached
   - Cache key format: "kpi_perm:{kpi_id}:{user_id}"
   - Cache TTL: 300 seconds (5 minutes)

9. **Update model docstring**
   - Document permission system integration
   - List common permission requirements

### Permission Field Structure

```
┌────────────────────────────────────────────────┐
│         KPI Permission Configuration           │
├────────────────────────────────────────────────┤
│ Field: required_permission                     │
│ Type: ForeignKey(Permission)                   │
│ Optional: Yes (null=True, blank=True)          │
│ On Delete: SET_NULL                            │
│ Purpose: Control KPI visibility by role        │
│                                                │
│ Method: has_permission(user)                   │
│ Returns: Boolean                               │
│ Purpose: Check if user can view KPI            │
└────────────────────────────────────────────────┘
```

### Permission Check Logic

```
KPI Permission Check Flow
═════════════════════════

1. Get KPIDefinition record
   └─> required_permission field

2. Check if permission is set
   └─> If null/empty: KPI is public (return True)
   └─> If set: Proceed to permission check

3. Check user permissions
   └─> user.has_perm(required_permission.codename)

4. Check user role permissions
   └─> role.permissions.filter(id=required_permission.id).exists()

5. Return permission status
   └─> True: User can view KPI
   └─> False: KPI hidden from user
```

### Common KPI Permissions by Category

| KPI Category | Permission Codename | Description | Typical Roles |
|--------------|---------------------|-------------|---------------|
| SALES | view_sales_kpis | View sales metrics | Manager, Sales, Admin |
| SALES | view_revenue_details | View detailed revenue | Manager, Admin, Owner |
| INVENTORY | view_inventory_kpis | View inventory metrics | Manager, Inventory, Admin |
| INVENTORY | view_stock_value | View total stock value | Manager, Admin, Owner |
| FINANCIAL | view_financial_kpis | View financial metrics | Admin, Accountant, Owner |
| FINANCIAL | view_profit_margins | View profit details | Admin, Owner |
| FINANCIAL | view_cost_breakdown | View cost details | Admin, Accountant, Owner |
| HR | view_hr_kpis | View HR metrics | HR Manager, Admin |
| HR | view_employee_salaries | View salary information | HR Manager, Owner |

### Permission Requirements by KPI (Sri Lankan Context)

#### Public KPIs (No Permission Required)
```
KPI: "Today's Order Count"
Permission: None
Visible to: All users
Reason: General operational metric

KPI: "Active Products"
Permission: None
Visible to: All users
Reason: Non-sensitive inventory info

KPI: "Customer Count"
Permission: None
Visible to: All users
Reason: General business metric
```

#### Manager-Level KPIs
```
KPI: "Daily Revenue (LKR)"
Permission: view_sales_kpis
Visible to: Manager, Admin, Owner
Reason: Financial sensitivity

KPI: "Average Order Value"
Permission: view_sales_kpis
Visible to: Manager, Admin, Owner
Reason: Revenue analysis

KPI: "Total Stock Value (LKR)"
Permission: view_inventory_kpis
Visible to: Inventory Manager, Admin, Owner
Reason: Asset value information
```

#### Admin/Owner-Only KPIs
```
KPI: "Gross Profit Margin"
Permission: view_profit_margins
Visible to: Admin, Owner
Reason: Highly sensitive financial data

KPI: "Net Profit (LKR)"
Permission: view_profit_margins
Visible to: Admin, Owner
Reason: Bottom-line financial data

KPI: "Cost of Goods Sold (COGS)"
Permission: view_cost_breakdown
Visible to: Admin, Accountant, Owner
Reason: Detailed cost information

KPI: "Employee Salary Costs"
Permission: view_employee_salaries
Visible to: HR Manager, Owner
Reason: Confidential HR data
```

### Permission Matrix

| Role | Sales KPIs | Revenue Details | Inventory KPIs | Stock Value | Financial KPIs | Profit Margins | HR KPIs |
|------|------------|-----------------|----------------|-------------|----------------|----------------|---------|
| Cashier | ✅ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Sales Rep | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Inventory Manager | ✅ | ❌ | ✅ | ✅ | ❌ | ❌ | ❌ |
| Store Manager | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ |
| Accountant | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ |
| HR Manager | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |
| Admin | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Owner | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |

### has_permission Method Implementation

```
Method Signature:
def has_permission(self, user) -> bool

Method Logic:
1. If required_permission is null/empty:
   └─> Return True (public KPI)

2. If user is superuser:
   └─> Return True (full access)

3. If user has specific permission:
   └─> Return True (authorized)

4. If user's role has permission:
   └─> Return True (role-based access)

5. Otherwise:
   └─> Return False (not authorized)
```

### Permission Caching Strategy

| Cache Key Format | TTL | Invalidation Trigger |
|-----------------|-----|---------------------|
| kpi_perm:{kpi_id}:{user_id} | 300s (5 min) | User role change |
| kpi_list:{user_id} | 300s (5 min) | Permission change |
| user_perms:{user_id} | 600s (10 min) | User update |

### Dashboard Filtering by Permission

```
Dashboard KPI Display Logic
════════════════════════════

1. Get all KPIDefinitions for dashboard
   └─> kpis = KPIDefinition.objects.filter(is_active=True)

2. Filter by user permissions
   └─> For each KPI:
       └─> if kpi.has_permission(request.user):
           └─> Include in dashboard
       └─> else:
           └─> Exclude from dashboard

3. Display authorized KPIs
   └─> Render visible KPIs in appropriate widgets

Result: Users only see KPIs they're authorized to view
```

### Permission Denial Handling

#### Option 1: Hide KPI Completely
```
Dashboard Display:
[Visible KPI 1]  [Visible KPI 2]  [Visible KPI 3]

Hidden KPIs not shown at all
```

#### Option 2: Show Placeholder
```
Dashboard Display:
[Visible KPI 1]  [Visible KPI 2]
[🔒 Restricted]  [Visible KPI 3]

Placeholder indicates restricted access
```

### Expected Outcome
- Permission field added to model
- Role-based KPI visibility control
- has_permission method for checks
- Support for public and restricted KPIs
- Integration with core permission system

### Verification Checklist
- [ ] Permission model imported
- [ ] required_permission field added
- [ ] Field is optional (null=True, blank=True)
- [ ] on_delete=SET_NULL configured
- [ ] related_name set to 'kpi_definitions'
- [ ] Help text added
- [ ] Verbose name configured
- [ ] has_permission method created
- [ ] Permission caching documented
- [ ] Model docstring updated

---

## Task 13: Run KPIDefinition Migrations

### Overview
Create and run Django migrations for the KPIDefinition model. This generates the database schema for storing KPI definitions with all configured fields including name, category, widget type, calculation method, format, and permissions.

### Dependencies
- Task 12: Add KPI Permissions
- All KPIDefinition model fields complete
- PostgreSQL tenant schemas configured

### Instructions

1. **Verify model is complete**
   - Open `apps/dashboard/models/kpi_definition.py`
   - Confirm all fields from Tasks 06-12 are present
   - Verify imports are correct

2. **Check model is imported**
   - Open `apps/dashboard/models/__init__.py`
   - Ensure KPIDefinition is imported
   - Add to __all__ list if needed

3. **Verify app is registered**
   - Open Django settings file
   - Check TENANT_APPS includes 'dashboard'
   - Confirm app configuration

4. **Create migration files**
   - Open terminal in project root
   - Activate virtual environment
   - Run: python manage.py makemigrations dashboard
   - Verify migration file created

5. **Review migration file**
   - Open generated migration file
   - Check all fields are included
   - Verify field types and constraints
   - Review foreign key relationships

6. **Run migrations for public schema**
   - Execute: python manage.py migrate_schemas --shared
   - Creates table in public schema
   - Verify no errors

7. **Run migrations for tenant schemas**
   - Execute: python manage.py migrate_schemas
   - Or: python manage.py migrate_schemas --tenant
   - Creates table in all tenant schemas
   - Monitor output for errors

8. **Verify database schema**
   - Connect to PostgreSQL database
   - Check public schema for table
   - Check tenant schema for table
   - Verify all columns exist

9. **Test model creation**
   - Open Django shell: python manage.py shell
   - Import KPIDefinition model
   - Create test instance
   - Verify save successful

### Migration Command Summary

| Command | Purpose | Target |
|---------|---------|--------|
| makemigrations dashboard | Generate migration file | Development |
| migrate_schemas --shared | Apply to public schema | Public tables |
| migrate_schemas | Apply to all tenant schemas | Tenant tables |
| migrate_schemas --tenant | Apply to tenant schemas only | Tenant tables |
| showmigrations dashboard | Show migration status | Verification |

### Expected Migration File Structure

```
apps/dashboard/migrations/
└── 0001_initial.py or 0002_kpidefinition.py

Migration file contents:
- Create model: KPIDefinition
- Fields: All fields from Tasks 06-12
- Indexes: tenant, category, code
- Unique constraints: (tenant, code)
- Foreign keys: required_permission
```

### Generated Database Schema

```
Table: dashboard_kpidefinition
═══════════════════════════════

Columns:
├── id (BigAutoField, PK)
├── tenant_id (BigInteger, FK)
├── name (VARCHAR 100)
├── code (VARCHAR 50, Unique per tenant)
├── description (TEXT)
├── category (VARCHAR 20)
├── default_widget_type (VARCHAR 20)
├── calculation_method (VARCHAR 100)
├── value_format (VARCHAR 20)
├── decimal_places (SmallInteger)
├── show_thousand_separator (Boolean)
├── required_permission_id (BigInteger, FK, Nullable)
├── is_active (Boolean)
├── created_at (Timestamp)
└── updated_at (Timestamp)

Indexes:
├── PRIMARY KEY (id)
├── INDEX (tenant_id)
├── INDEX (category)
├── UNIQUE (tenant_id, code)
└── INDEX (required_permission_id)

Foreign Keys:
├── tenant_id → tenants.tenant(id)
└── required_permission_id → auth.permission(id)
```

### Multi-Tenancy Considerations

```
Schema Distribution
═══════════════════

Public Schema:
└── No KPIDefinition table (TENANT_APPS only)

Tenant Schema: tenant_1
└── dashboard_kpidefinition table
    └── Contains KPIs for tenant_1

Tenant Schema: tenant_2
└── dashboard_kpidefinition table
    └── Contains KPIs for tenant_2

Each tenant has isolated KPI definitions
```

### Migration Verification Steps

1. **Check Migration File Created**
   ```
   Expected output:
   Migrations for 'dashboard':
     apps/dashboard/migrations/0002_kpidefinition.py
       - Create model KPIDefinition
   ```

2. **Verify Public Schema Migration**
   ```
   Expected output:
   Running migrations:
     No migrations to apply (dashboard is in TENANT_APPS)
   ```

3. **Verify Tenant Schema Migration**
   ```
   Expected output:
   Tenant: demo-tenant (demo.example.com)
   Running migrations:
     Applying dashboard.0002_kpidefinition... OK
   
   Tenant: retail-store (retail.example.com)
   Running migrations:
     Applying dashboard.0002_kpidefinition... OK
   ```

### Database Verification Queries

```sql
-- Check table exists in tenant schema
SET search_path TO tenant_demo;
\dt dashboard_kpidefinition

-- Verify columns
\d dashboard_kpidefinition

-- Check indexes
\di dashboard_kpidefinition*

-- Test insert
INSERT INTO dashboard_kpidefinition (
    tenant_id, name, code, category,
    default_widget_type, calculation_method,
    value_format, decimal_places,
    show_thousand_separator, is_active,
    created_at, updated_at
) VALUES (
    1, 'Test KPI', 'TEST_KPI', 'SALES',
    'NUMBER', 'TestCalculator.calculate',
    'number', 2, true, true,
    NOW(), NOW()
);

-- Verify insert
SELECT * FROM dashboard_kpidefinition;
```

### Troubleshooting Common Issues

| Issue | Cause | Solution |
|-------|-------|----------|
| "No migrations to apply" | App not in TENANT_APPS | Add 'dashboard' to TENANT_APPS |
| "Table already exists" | Previous migration not cleaned | Drop table or use --fake |
| "Foreign key constraint fails" | Permission table missing | Run auth app migrations first |
| "Column does not exist" | Migration out of sync | Delete migration file and recreate |
| "Relation does not exist" | Wrong schema context | Set correct search_path |

### Expected Outcome
- Migration files created for KPIDefinition
- Database schema created in tenant schemas
- All fields and indexes present
- Foreign key constraints established
- Multi-tenancy support verified

### Verification Checklist
- [ ] Model complete and imported
- [ ] App registered in TENANT_APPS
- [ ] Migration file created successfully
- [ ] Migration file reviewed for correctness
- [ ] Public schema migration status checked
- [ ] Tenant schema migrations applied
- [ ] Database table exists in tenant schemas
- [ ] All columns present and correct
- [ ] Indexes created
- [ ] Foreign keys established
- [ ] Test record created successfully

---

## Task 14: Create KPI Fixtures

### Overview
Create JSON fixture files containing default KPI definitions for initial system setup. Includes common KPIs for sales, inventory, financial, and HR categories with appropriate Sri Lankan context (LKR currency, local business practices).

### Dependencies
- Task 13: Run KPIDefinition Migrations
- Understanding of common business KPIs
- Fixture file format knowledge

### Instructions

1. **Create fixtures directory**
   - Navigate to `apps/dashboard/`
   - Create `fixtures/` subdirectory
   - This will store fixture JSON files

2. **Create kpi_definitions.json file**
   - Create file at `apps/dashboard/fixtures/kpi_definitions.json`
   - Initialize as JSON array

3. **Define sales KPIs**
   - Daily Revenue (currency, NUMBER widget)
   - Weekly Revenue (currency, CHART widget)
   - Monthly Revenue (currency, CHART widget)
   - Order Count Today (number, NUMBER widget)
   - Average Order Value (currency, NUMBER widget)
   - Top Products Today (table, TABLE widget)

4. **Define inventory KPIs**
   - Total Stock Value (currency, NUMBER widget)
   - Low Stock Items Count (number, TABLE widget)
   - Inventory Turnover Rate (number, GAUGE widget)
   - Stock Coverage Days (number, GAUGE widget)
   - Out of Stock Items (number, NUMBER widget)

5. **Define financial KPIs**
   - Gross Profit Margin (percent, GAUGE widget)
   - Net Profit This Month (currency, NUMBER widget)
   - Cash Balance (currency, NUMBER widget)
   - Revenue Growth (percent, TREND widget)
   - Operating Expenses (currency, CHART widget)

6. **Define HR KPIs**
   - Active Employee Count (number, NUMBER widget)
   - Attendance Rate Today (percent, GAUGE widget)
   - Average Shift Hours (number, NUMBER widget)

7. **Set appropriate permissions**
   - Public KPIs: no permission required
   - Sales KPIs: view_sales_kpis
   - Financial KPIs: view_financial_kpis
   - HR KPIs: view_hr_kpis

8. **Configure format settings**
   - Currency KPIs: format='currency', decimal_places=2
   - Count KPIs: format='number', decimal_places=0
   - Percentage KPIs: format='percent', decimal_places=1

9. **Add Sri Lankan context**
   - Use LKR for currency descriptions
   - Reference local business practices
   - Include common Sri Lankan metrics

10. **Validate JSON syntax**
    - Check for valid JSON structure
    - Verify all required fields present
    - Ensure comma placement correct

11. **Add fixture loading command**
    - Document: python manage.py loaddata kpi_definitions
    - Note: Must be run per tenant schema

### Fixture File Structure

```
apps/dashboard/fixtures/
└── kpi_definitions.json
    ├── Sales KPIs (6 definitions)
    ├── Inventory KPIs (5 definitions)
    ├── Financial KPIs (5 definitions)
    └── HR KPIs (3 definitions)

Total: 19 default KPI definitions
```

### Fixture Record Format

```json
{
    "model": "dashboard.kpidefinition",
    "pk": null,
    "fields": {
        "name": "KPI Display Name",
        "code": "UNIQUE_CODE",
        "description": "Detailed description",
        "category": "SALES",
        "default_widget_type": "NUMBER",
        "calculation_method": "CalculatorClass.method_name",
        "value_format": "currency",
        "decimal_places": 2,
        "show_thousand_separator": true,
        "required_permission": null,
        "is_active": true
    }
}
```

### Sales KPI Definitions

| KPI Name | Code | Widget | Format | Permission |
|----------|------|--------|--------|------------|
| Today's Revenue (LKR) | SALES_REVENUE_TODAY | NUMBER | currency | view_sales_kpis |
| This Week's Revenue | SALES_REVENUE_WEEK | CHART | currency | view_sales_kpis |
| This Month's Revenue | SALES_REVENUE_MONTH | CHART | currency | view_sales_kpis |
| Orders Today | SALES_ORDERS_TODAY | NUMBER | number | None (public) |
| Average Order Value | SALES_AVG_ORDER_VALUE | NUMBER | currency | view_sales_kpis |
| Top 10 Products Today | SALES_TOP_PRODUCTS | TABLE | number | None (public) |

### Inventory KPI Definitions

| KPI Name | Code | Widget | Format | Permission |
|----------|------|--------|--------|------------|
| Total Stock Value (LKR) | INV_STOCK_VALUE_TOTAL | NUMBER | currency | view_inventory_kpis |
| Low Stock Items | INV_LOW_STOCK_COUNT | TABLE | number | None (public) |
| Inventory Turnover Rate | INV_TURNOVER_RATE | GAUGE | number | view_inventory_kpis |
| Stock Coverage (Days) | INV_STOCK_COVERAGE_DAYS | GAUGE | number | view_inventory_kpis |
| Out of Stock Items | INV_OUT_OF_STOCK | NUMBER | number | None (public) |

### Financial KPI Definitions

| KPI Name | Code | Widget | Format | Permission |
|----------|------|--------|--------|------------|
| Gross Profit Margin (%) | FIN_GROSS_MARGIN | GAUGE | percent | view_financial_kpis |
| Net Profit This Month | FIN_NET_PROFIT_MONTH | NUMBER | currency | view_financial_kpis |
| Cash Balance (LKR) | FIN_CASH_BALANCE | NUMBER | currency | view_financial_kpis |
| Revenue Growth (%) | FIN_REVENUE_GROWTH | TREND | percent | view_financial_kpis |
| Operating Expenses | FIN_OPERATING_EXPENSES | CHART | currency | view_financial_kpis |

### HR KPI Definitions

| KPI Name | Code | Widget | Format | Permission |
|----------|------|--------|--------|------------|
| Active Employees | HR_EMPLOYEE_COUNT | NUMBER | number | view_hr_kpis |
| Attendance Rate Today | HR_ATTENDANCE_RATE | GAUGE | percent | view_hr_kpis |
| Average Shift Hours | HR_AVG_SHIFT_HOURS | NUMBER | number | view_hr_kpis |

### Sample Fixture Records (Sri Lankan Context)

#### Sales KPI Example
```json
{
    "model": "dashboard.kpidefinition",
    "pk": null,
    "fields": {
        "name": "Today's Revenue (LKR)",
        "code": "SALES_REVENUE_TODAY",
        "description": "Total sales revenue for the current day in Sri Lankan Rupees. Updates in real-time as sales are completed. Essential for daily cash flow monitoring.",
        "category": "SALES",
        "default_widget_type": "NUMBER",
        "calculation_method": "SalesKPICalculator.calculate_daily_revenue",
        "value_format": "currency",
        "decimal_places": 2,
        "show_thousand_separator": true,
        "required_permission": null,
        "is_active": true
    }
}
```

#### Inventory KPI Example
```json
{
    "model": "dashboard.kpidefinition",
    "pk": null,
    "fields": {
        "name": "Total Stock Value (LKR)",
        "code": "INV_STOCK_VALUE_TOTAL",
        "description": "Total value of all inventory at current cost prices. Includes all active products across all locations. Critical for asset management and insurance purposes.",
        "category": "INVENTORY",
        "default_widget_type": "NUMBER",
        "calculation_method": "InventoryKPICalculator.calculate_total_stock_value",
        "value_format": "currency",
        "decimal_places": 2,
        "show_thousand_separator": true,
        "required_permission": null,
        "is_active": true
    }
}
```

#### Financial KPI Example
```json
{
    "model": "dashboard.kpidefinition",
    "pk": null,
    "fields": {
        "name": "Gross Profit Margin (%)",
        "code": "FIN_GROSS_MARGIN",
        "description": "Percentage of revenue remaining after deducting cost of goods sold (COGS). Key profitability indicator for pricing strategy and product mix optimization.",
        "category": "FINANCIAL",
        "default_widget_type": "GAUGE",
        "calculation_method": "FinancialKPICalculator.calculate_gross_margin",
        "value_format": "percent",
        "decimal_places": 1,
        "show_thousand_separator": false,
        "required_permission": null,
        "is_active": true
    }
}
```

### Fixture Loading Commands

```bash
# Load fixtures into specific tenant
python manage.py loaddata kpi_definitions --schema=tenant_demo

# Load fixtures into all tenants
python manage.py tenant_command loaddata kpi_definitions

# Verify loaded data
python manage.py shell
>>> from dashboard.models import KPIDefinition
>>> KPIDefinition.objects.count()
19  # Should match fixture count
```

### Fixture Loading Strategy

| Loading Method | Command | Use Case |
|---------------|---------|----------|
| Single tenant | loaddata --schema=tenant_name | Development, testing |
| All tenants | tenant_command loaddata | Production deployment |
| Public schema | loaddata (N/A for TENANT_APPS) | Not applicable |

### Permission Reference Requirements

Note: Fixture assumes permissions exist. If permission codenames are used:
- view_sales_kpis
- view_inventory_kpis
- view_financial_kpis
- view_hr_kpis

These must be created first through permission fixtures or migrations.

### Expected Outcome
- Fixture file created with 19 default KPIs
- All KPI categories represented
- Sri Lankan context (LKR currency)
- Appropriate permissions assigned
- Proper formatting configuration
- Valid JSON syntax

### Verification Checklist
- [ ] fixtures/ directory created
- [ ] kpi_definitions.json file created
- [ ] 6 Sales KPIs defined
- [ ] 5 Inventory KPIs defined
- [ ] 5 Financial KPIs defined
- [ ] 3 HR KPIs defined
- [ ] All KPIs have unique codes
- [ ] Currency format uses LKR context
- [ ] Permissions appropriately assigned
- [ ] JSON syntax valid
- [ ] Fixture loading commands documented
- [ ] Can load fixtures successfully

---

## Task 15: Create BaseKPICalculator

### Overview
Create the abstract BaseKPICalculator class that serves as the parent class for all specific KPI calculators. Implements common functionality for period date calculation, value formatting, trend analysis, and caching. Uses the Strategy pattern to enable flexible calculator implementations.

### Dependencies
- Task 14: Create KPI Fixtures
- KPIDefinition model complete
- KPIPeriod enum defined
- Redis caching configured

### Instructions

1. **Create calculators directory**
   - Navigate to `apps/dashboard/`
   - Create `calculators/` subdirectory
   - Create `__init__.py` in calculators/

2. **Create base.py module**
   - Create file at `apps/dashboard/calculators/base.py`
   - Add module docstring explaining calculator pattern

3. **Import required modules**
   - ABC (Abstract Base Class) from abc module
   - abstractmethod decorator
   - datetime, date, timedelta
   - Decimal for precise calculations
   - KPIDefinition model
   - KPIPeriod enum
   - Django cache framework

4. **Define BaseKPICalculator class**
   - Inherit from ABC (Abstract Base Class)
   - Add comprehensive class docstring
   - Explain Strategy pattern usage

5. **Add __init__ method**
   - Accept kpi_definition parameter
   - Accept period parameter (KPIPeriod)
   - Accept tenant parameter
   - Store as instance variables
   - Initialize cache key prefix

6. **Add get_period_dates method**
   - Calculate start_date and end_date for period
   - Handle TODAY, WEEK, MONTH, QUARTER, YEAR
   - Consider Sri Lankan fiscal year (Apr-Mar)
   - Return tuple of (start_date, end_date)

7. **Add abstract calculate method**
   - Decorated with @abstractmethod
   - Accept filters parameter (dict, optional)
   - Return dict with value and metadata
   - Must be implemented by subclasses

8. **Add format_value method**
   - Accept numeric value parameter
   - Use kpi_definition.value_format
   - Apply decimal_places
   - Add thousand separators if configured
   - Return formatted string

9. **Add get_comparison_data method**
   - Calculate previous period dates
   - Get previous period value
   - Calculate change amount and percentage
   - Determine trend direction
   - Return comparison dict

10. **Add get_trend_indicator method**
    - Accept current and previous values
    - Calculate percentage change
    - Determine trend: 'up', 'down', 'stable'
    - Consider threshold for 'stable' (e.g., ±1%)
    - Return trend string

11. **Add get_cache_key method**
    - Generate cache key for KPI value
    - Format: "kpi:{code}:{tenant_id}:{period}:{filters_hash}"
    - Return cache key string

12. **Add cache KPI value method**
    - Cache calculated value
    - Use period-appropriate TTL
    - Store value and metadata

13. **Add get_cached_value method**
    - Retrieve cached KPI value
    - Check cache validity
    - Return cached value or None

14. **Update calculators/__init__.py**
    - Import BaseKPICalculator
    - Add to __all__ list

### BaseKPICalculator Class Structure

```
┌────────────────────────────────────────────────┐
│         BaseKPICalculator (Abstract)           │
├────────────────────────────────────────────────┤
│ Initialization:                                │
│  • __init__(kpi_definition, period, tenant)    │
│                                                │
│ Period Management:                             │
│  • get_period_dates() → (start, end)           │
│                                                │
│ Core Calculation (Abstract):                   │
│  • calculate(filters=None) → dict              │
│                                                │
│ Value Formatting:                              │
│  • format_value(value) → str                   │
│                                                │
│ Comparison & Trends:                           │
│  • get_comparison_data() → dict                │
│  • get_trend_indicator(current, prev) → str    │
│                                                │
│ Caching:                                       │
│  • get_cache_key() → str                       │
│  • cache_value(value, ttl)                     │
│  • get_cached_value() → dict | None            │
└────────────────────────────────────────────────┘
```

### Class Inheritance Pattern

```
BaseKPICalculator (Abstract)
    │
    ├── SalesKPICalculator
    │   ├── calculate_daily_revenue()
    │   ├── calculate_weekly_revenue()
    │   └── calculate_average_order_value()
    │
    ├── InventoryKPICalculator
    │   ├── calculate_total_stock_value()
    │   ├── calculate_turnover_rate()
    │   └── calculate_stock_coverage_days()
    │
    ├── FinancialKPICalculator
    │   ├── calculate_gross_margin()
    │   ├── calculate_net_profit()
    │   └── calculate_cash_balance()
    │
    └── HRKPICalculator
        ├── calculate_employee_count()
        ├── calculate_attendance_rate()
        └── calculate_average_shift_hours()
```

### Period Date Calculation Logic

| Period | Start Date | End Date | Example (Today: 2026-01-25) |
|--------|------------|----------|------------------------------|
| TODAY | Today | Today | 2026-01-25 to 2026-01-25 |
| WEEK | Monday of current week | Sunday of current week | 2026-01-19 to 2026-01-25 |
| MONTH | 1st of current month | Last day of current month | 2026-01-01 to 2026-01-31 |
| QUARTER | 1st of quarter | Last day of quarter | 2026-01-01 to 2026-03-31 |
| YEAR | April 1st (fiscal) | March 31st (fiscal) | 2025-04-01 to 2026-03-31 |

### Sri Lankan Fiscal Year Considerations

```
Fiscal Year 2025/2026
═════════════════════

Start: April 1, 2025
End: March 31, 2026

Quarter Breakdown:
Q1: Apr-Jun 2025
Q2: Jul-Sep 2025
Q3: Oct-Dec 2025
Q4: Jan-Mar 2026

Calendar Year vs Fiscal Year:
Calendar: Jan 1 - Dec 31
Fiscal: Apr 1 - Mar 31

Period calculation should use fiscal year for:
- YEAR period
- QUARTER period

Calendar year for:
- MONTH period
- WEEK period
- TODAY period
```

### Calculate Method Return Format

```json
{
    "value": 150000.00,
    "formatted_value": "LKR 150,000.00",
    "previous_value": 130000.00,
    "previous_formatted": "LKR 130,000.00",
    "change_amount": 20000.00,
    "change_percent": 15.38,
    "trend": "up",
    "period": "TODAY",
    "start_date": "2026-01-25",
    "end_date": "2026-01-25",
    "metadata": {
        "order_count": 45,
        "avg_order_value": 3333.33,
        "top_product": "Product ABC",
        "calculation_time": "2026-01-25 14:30:00"
    }
}
```

### Format Value Implementation

```
Format Value Logic
══════════════════

Input: value=150000.00, format='currency', decimals=2

Step 1: Round to decimal places
└─> 150000.00

Step 2: Add thousand separators (if enabled)
└─> 150,000.00

Step 3: Apply format-specific prefix/suffix
└─> Currency: "LKR 150,000.00"
└─> Number: "150,000.00"
└─> Percent: "150,000.00%"

Step 4: Return formatted string
└─> "LKR 150,000.00"
```

### Trend Indicator Logic

```
Trend Determination
═══════════════════

Threshold: ±1% (configurable)

If change_percent > 1%:
    └─> trend = 'up' (↑)

If change_percent < -1%:
    └─> trend = 'down' (↓)

If -1% <= change_percent <= 1%:
    └─> trend = 'stable' (→)

Examples:
• +15.38% → 'up'
• -5.20% → 'down'
• +0.75% → 'stable'
• -0.50% → 'stable'
```

### Caching Strategy by Period

| Period | Cache TTL | Rationale |
|--------|-----------|-----------|
| TODAY | 300 seconds (5 min) | Frequent updates during business hours |
| WEEK | 3600 seconds (1 hour) | Less frequent changes |
| MONTH | 21600 seconds (6 hours) | Stable throughout day |
| QUARTER | 86400 seconds (24 hours) | Rarely changes |
| YEAR | 86400 seconds (24 hours) | Very stable |

### Cache Key Format

```
Cache Key Structure
═══════════════════

Format: "kpi:{code}:{tenant_id}:{period}:{filters_hash}"

Examples:
• "kpi:SALES_REVENUE_TODAY:123:TODAY:none"
• "kpi:INV_STOCK_VALUE:123:MONTH:loc_5"
• "kpi:FIN_GROSS_MARGIN:123:QUARTER:none"

Filters Hash:
• If no filters: "none"
• If filters: MD5 hash of sorted filter dict
  Example: filters={'location_id': 5, 'category': 'Electronics'}
  Hash: md5("category=Electronics&location_id=5")
```

### Comparison Data Calculation

```
Comparison Calculation Flow
═══════════════════════════

Current Period: 2026-01-25 (TODAY)
└─> Value: 150,000

Previous Period: 2026-01-24 (YESTERDAY)
└─> Value: 130,000

Change Calculation:
└─> change_amount = 150,000 - 130,000 = 20,000
└─> change_percent = (20,000 / 130,000) * 100 = 15.38%
└─> trend = 'up' (15.38% > 1%)

Return Dict:
{
    "previous_value": 130000.00,
    "change_amount": 20000.00,
    "change_percent": 15.38,
    "trend": "up"
}
```

### Abstract Method Requirements

```python
Subclass Implementation Requirements
════════════════════════════════════

class SalesKPICalculator(BaseKPICalculator):
    """
    Must implement:
    - calculate(filters=None) → dict
    """
    
    def calculate(self, filters=None):
        """
        Implementation logic:
        1. Get period dates from get_period_dates()
        2. Query database for sales data
        3. Calculate KPI value
        4. Get comparison data
        5. Format value
        6. Return result dict
        """
        start_date, end_date = self.get_period_dates()
        
        # Calculate current value
        value = self._query_and_calculate(start_date, end_date, filters)
        
        # Get comparison data
        comparison = self.get_comparison_data()
        
        # Format value
        formatted = self.format_value(value)
        
        return {
            'value': value,
            'formatted_value': formatted,
            **comparison
        }
```

### Expected Outcome
- BaseKPICalculator abstract class created
- Period date calculation implemented
- Abstract calculate method defined
- Value formatting utility
- Trend analysis capability
- Caching infrastructure
- Comparison data generation
- Foundation for specific calculators

### Verification Checklist
- [ ] calculators/ directory created
- [ ] base.py module created
- [ ] BaseKPICalculator class defined
- [ ] Class inherits from ABC
- [ ] __init__ method implemented
- [ ] get_period_dates method created
- [ ] calculate method marked @abstractmethod
- [ ] format_value method implemented
- [ ] get_comparison_data method created
- [ ] get_trend_indicator method implemented
- [ ] get_cache_key method created
- [ ] cache_value method implemented
- [ ] get_cached_value method created
- [ ] Sri Lankan fiscal year logic included
- [ ] Module imported in __init__.py
- [ ] Class docstring comprehensive

---

## Task 16: Add Calculate Method

### Overview
Document the abstract calculate method in BaseKPICalculator with comprehensive specifications for implementation by subclasses. Defines the contract that all specific KPI calculators must follow, including method signature, return format, error handling, and Sri Lankan business context considerations.

### Dependencies
- Task 15: Create BaseKPICalculator

### Instructions

1. **Open base.py module**
   - Navigate to `apps/dashboard/calculators/base.py`
   - Locate BaseKPICalculator class

2. **Add comprehensive method docstring**
   - Explain method purpose and usage
   - Document all parameters
   - Document return value structure
   - Include implementation guidelines

3. **Define method signature**
   - Decorated with @abstractmethod
   - Accept self parameter
   - Accept filters parameter (dict, optional, default=None)
   - Return type hint: dict

4. **Document filters parameter structure**
   - Optional filtering criteria
   - Common filters: location_id, category_id, product_id
   - Sri Lankan context: province, district, branch
   - Format as dictionary

5. **Document return value structure**
   - Required keys: value, formatted_value
   - Optional keys: previous_value, change_percent, trend
   - Metadata key for additional context
   - All keys must be present in return dict

6. **Add implementation guidelines**
   - Step 1: Get period dates
   - Step 2: Query database with filters
   - Step 3: Perform calculations
   - Step 4: Get comparison data
   - Step 5: Format value
   - Step 6: Cache result
   - Step 7: Return result dict

7. **Document error handling**
   - Handle database query errors
   - Handle division by zero in calculations
   - Handle missing data (return 0 or null)
   - Raise CalculationError for critical issues

8. **Add caching recommendations**
   - Check cache before calculating
   - Use get_cached_value() method
   - Cache result after calculation
   - Use period-appropriate TTL

9. **Document performance considerations**
   - Use select_related and prefetch_related
   - Optimize database queries
   - Consider query complexity for large datasets
   - Use aggregation in database

10. **Add Sri Lankan business context notes**
    - LKR currency handling
    - Fiscal year considerations
    - Local holidays impact on KPIs
    - Multi-location considerations

11. **Provide implementation examples**
    - Simple numeric KPI (count)
    - Currency KPI (revenue)
    - Percentage KPI (margin)
    - Complex KPI (ratio)

### Calculate Method Structure

```python
@abstractmethod
def calculate(self, filters: dict = None) -> dict:
    """
    Abstract method that must be implemented by subclasses.
    Calculates the KPI value for the configured period.
    
    Args:
        filters (dict, optional): Filter criteria for calculation
            Common filters:
            - location_id: Filter by location
            - category_id: Filter by product category
            - product_id: Specific product
            - employee_id: Specific employee
            - branch_id: Specific branch (Sri Lankan context)
            - province: Sri Lankan province filter
    
    Returns:
        dict: Calculation result with structure:
            {
                'value': float/int,
                'formatted_value': str,
                'previous_value': float/int,
                'previous_formatted': str,
                'change_amount': float/int,
                'change_percent': float,
                'trend': str ('up', 'down', 'stable'),
                'period': str,
                'start_date': str (ISO format),
                'end_date': str (ISO format),
                'metadata': dict (additional context)
            }
    
    Implementation Guidelines:
        1. Check cache for existing value
        2. Get period dates using get_period_dates()
        3. Query database with filters applied
        4. Perform KPI calculation
        5. Get comparison data from previous period
        6. Format value using format_value()
        7. Cache result with appropriate TTL
        8. Return complete result dict
    
    Raises:
        CalculationError: If calculation fails critically
    """
    pass
```

### Filters Parameter Structure

| Filter Key | Type | Purpose | Example |
|-----------|------|---------|---------|
| location_id | int | Filter by location | {'location_id': 5} |
| category_id | int | Filter by product category | {'category_id': 12} |
| product_id | int | Specific product | {'product_id': 350} |
| branch_id | int | Specific branch | {'branch_id': 3} |
| province | str | Sri Lankan province | {'province': 'Western'} |
| district | str | Sri Lankan district | {'district': 'Colombo'} |
| customer_type | str | Customer segment | {'customer_type': 'wholesale'} |
| payment_method | str | Payment type | {'payment_method': 'cash'} |

### Return Value Structure Requirements

```json
Required Keys (Always Present):
{
    "value": 150000.00,
    "formatted_value": "LKR 150,000.00"
}

Full Response (Recommended):
{
    "value": 150000.00,
    "formatted_value": "LKR 150,000.00",
    "previous_value": 130000.00,
    "previous_formatted": "LKR 130,000.00",
    "change_amount": 20000.00,
    "change_percent": 15.38,
    "trend": "up",
    "period": "TODAY",
    "start_date": "2026-01-25",
    "end_date": "2026-01-25",
    "metadata": {
        "order_count": 45,
        "avg_order_value": 3333.33,
        "top_product": "Product ABC",
        "calculation_time": "2026-01-25T14:30:00+05:30"
    }
}
```

### Implementation Pattern (Sales Revenue Example)

```
Implementation Steps for SalesKPICalculator.calculate_daily_revenue()
═════════════════════════════════════════════════════════════════════

Step 1: Check Cache
└─> cache_key = self.get_cache_key()
└─> cached = self.get_cached_value()
└─> if cached: return cached

Step 2: Get Period Dates
└─> start_date, end_date = self.get_period_dates()

Step 3: Build Query with Filters
└─> query = Order.objects.filter(
        tenant=self.tenant,
        order_date__gte=start_date,
        order_date__lte=end_date,
        status='completed'
    )
└─> if filters and 'location_id' in filters:
        query = query.filter(location_id=filters['location_id'])

Step 4: Calculate Value
└─> value = query.aggregate(
        total=Sum('total_amount')
    )['total'] or 0

Step 5: Get Comparison Data
└─> comparison = self.get_comparison_data()

Step 6: Format Value
└─> formatted = self.format_value(value)

Step 7: Build Result Dict
└─> result = {
        'value': value,
        'formatted_value': formatted,
        **comparison,
        'period': self.period.value,
        'start_date': start_date.isoformat(),
        'end_date': end_date.isoformat(),
        'metadata': {
            'order_count': query.count(),
            'calculation_time': timezone.now().isoformat()
        }
    }

Step 8: Cache Result
└─> self.cache_value(result, ttl=300)  # 5 minutes for TODAY

Step 9: Return Result
└─> return result
```

### Implementation Example: Simple Count KPI

```
KPI: "Orders Today"
Calculator: SalesKPICalculator.calculate_daily_orders()

Implementation Logic:
1. Get period dates (today)
2. Query: Order.objects.filter(
       tenant=tenant,
       order_date__date=today,
       status='completed'
   ).count()
3. No previous period comparison needed (optional)
4. Format: number with 0 decimals
5. Return: {
       'value': 45,
       'formatted_value': '45',
       'metadata': {'avg_per_hour': 5.6}
   }
```

### Implementation Example: Currency KPI

```
KPI: "Today's Revenue (LKR)"
Calculator: SalesKPICalculator.calculate_daily_revenue()

Implementation Logic:
1. Get period dates (today)
2. Query: Order.objects.filter(
       tenant=tenant,
       order_date__date=today,
       status='completed'
   ).aggregate(total=Sum('total_amount'))
3. Get previous day for comparison
4. Format: currency with 2 decimals, LKR prefix
5. Return: {
       'value': 150000.00,
       'formatted_value': 'LKR 150,000.00',
       'previous_value': 130000.00,
       'change_percent': 15.38,
       'trend': 'up'
   }
```

### Implementation Example: Percentage KPI

```
KPI: "Gross Profit Margin (%)"
Calculator: FinancialKPICalculator.calculate_gross_margin()

Implementation Logic:
1. Get period dates (month)
2. Query: Get total revenue and COGS
   revenue = Order.objects.filter(...).aggregate(Sum('total'))
   cogs = OrderItem.objects.filter(...).aggregate(Sum('cost'))
3. Calculate: margin = ((revenue - cogs) / revenue) * 100
4. Handle division by zero: if revenue == 0: return 0
5. Format: percent with 1 decimal
6. Return: {
       'value': 32.5,
       'formatted_value': '32.5%',
       'previous_value': 30.2,
       'change_percent': 7.62,
       'trend': 'up'
   }
```

### Error Handling Guidelines

| Error Type | Handling Strategy | Return Value |
|-----------|------------------|--------------|
| No data found | Return zero value | {'value': 0, 'formatted_value': '0'} |
| Division by zero | Check before dividing | {'value': 0, 'formatted_value': 'N/A'} |
| Database error | Log error, return cached or zero | Use cached value or {'value': 0} |
| Invalid filters | Ignore invalid filters | Calculate without invalid filters |
| Calculation error | Raise CalculationError | Exception propagates to caller |

### Performance Optimization Guidelines

```
Query Optimization
══════════════════

1. Use select_related for foreign keys
   ✓ Order.objects.select_related('customer', 'location')
   ✗ Order.objects.all() (causes N+1 queries)

2. Use prefetch_related for many-to-many
   ✓ Order.objects.prefetch_related('items')
   ✗ for order in orders: order.items.all()

3. Use aggregation in database
   ✓ Order.objects.aggregate(Sum('total'))
   ✗ sum([order.total for order in orders])

4. Use values() for specific fields
   ✓ Order.objects.values('id', 'total')
   ✗ Order.objects.all() (loads all fields)

5. Add database indexes
   ✓ db_index=True on filtered fields
   ✗ Full table scan on unindexed columns
```

### Sri Lankan Business Context Considerations

#### Currency Handling (LKR)
```
- All currency values in Sri Lankan Rupees (LKR)
- Format: LKR 150,000.00 (not Rs. 150,000.00)
- Large amounts: Use Million/Billion notation
  Example: LKR 10M instead of LKR 10,000,000.00
```

#### Fiscal Year
```
- Fiscal year: April 1 - March 31
- Use fiscal year for YEAR and QUARTER periods
- Calendar year for other periods
```

#### Local Holidays
```
- Consider Poya days (monthly Buddhist holiday)
- Consider Sinhala/Tamil New Year (April)
- Consider Christmas, Eid holidays
- Impact on sales KPIs, attendance KPIs
```

#### Multi-Location
```
- Support for multiple branches across provinces
- Province filters: Western, Southern, Central, etc.
- District filters: Colombo, Gampaha, Kandy, etc.
- City filters: Colombo, Galle, Kandy, Jaffna, etc.
```

#### Customer Segments (Sri Lankan Context)
```
- Retail customers (individual buyers)
- Wholesale customers (bulk buyers)
- Corporate customers (B2B)
- Government customers (tender-based)
```

### Expected Outcome
- Abstract calculate method fully documented
- Clear implementation contract defined
- Return value structure specified
- Error handling guidelines provided
- Performance optimization noted
- Sri Lankan context integrated
- Foundation for specific calculators

### Verification Checklist
- [ ] Method signature defined with type hints
- [ ] @abstractmethod decorator applied
- [ ] Comprehensive docstring added
- [ ] Filters parameter documented
- [ ] Return value structure specified
- [ ] Implementation guidelines provided
- [ ] Error handling documented
- [ ] Caching recommendations included
- [ ] Performance considerations noted
- [ ] Sri Lankan context considerations added
- [ ] Implementation examples provided
- [ ] Query optimization guidelines included

---

## Summary

This document established the KPIDefinition model and BaseKPICalculator framework:

### Completed Infrastructure
- ✅ Widget type field for visualization selection
- ✅ Calculation method reference for dynamic calculator selection
- ✅ Format fields for currency, number, percentage display
- ✅ Permission requirements for role-based access
- ✅ Django migrations for database schema
- ✅ KPI fixtures with 19 default definitions
- ✅ BaseKPICalculator abstract class with Strategy pattern
- ✅ Abstract calculate method contract

### Key Achievements
1. **Flexible Visualization** - Widget type configuration per KPI
2. **Dynamic Calculations** - Method reference enables calculator selection
3. **Sri Lankan Context** - LKR currency, fiscal year, local business practices
4. **Security** - Role-based permission system integration
5. **Reusable Framework** - BaseKPICalculator provides common functionality
6. **Caching Strategy** - Period-appropriate cache TTLs
7. **Trend Analysis** - Comparison with previous periods
8. **Fixture Data** - 19 default KPIs for quick setup

### Next Steps
Proceed to [Group-B_Sales-KPIs](../../Group-B_Sales-KPIs/) to implement specific sales KPI calculators (daily revenue, weekly orders, average order value, top products) that extend BaseKPICalculator.

---

**Document Status:** ✅ Complete  
**Total Tasks:** 8  
**Total Lines:** ~970
