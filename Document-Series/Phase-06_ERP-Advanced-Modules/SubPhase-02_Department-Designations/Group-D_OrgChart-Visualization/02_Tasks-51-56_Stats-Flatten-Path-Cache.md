# Tasks 51-56: Statistics, Utilities, and Caching

> **Phase:** 06 - ERP Advanced Modules  
> **SubPhase:** 02 - Department & Designations  
> **Group:** D - Org Chart & Visualization  
> **Document:** 02 of 02  
> **Tasks Covered:** 51, 52, 53, 54, 55, 56

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-45-50_Service-Tree-Aggregation.md](01_Tasks-45-50_Service-Tree-Aggregation.md)

---

## Document Overview

This document covers advanced org chart utilities and optimizations, including department statistics calculation, hierarchy flattening for list views, path-to-root traversal, subtree queries, employee reporting chain retrieval, and Redis-based caching strategies. These features enhance the org chart system with comprehensive analytics and performance optimization.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 51 | Create Department Statistics | Medium | 25 min |
| 52 | Implement Flatten Hierarchy | Medium | 20 min |
| 53 | Implement Path to Root | Medium | 20 min |
| 54 | Implement Subtree Query | Medium | 20 min |
| 55 | Create Reporting Chain Query | Medium | 25 min |
| 56 | Cache Org Chart Data | High | 30 min |

---

## Task 51: Create Department Statistics

### Overview
Implement the get_department_stats method to calculate comprehensive statistics for a department, including employee counts by status, sub-department counts, budget information, average tenure, and open positions. These metrics support organizational analysis and decision-making.

### Dependencies
- Task 45: Create OrgChartService Class
- Task 49: Add Employee Count Aggregation
- Task 50: Add Budget Aggregation
- Department and Employee models with required fields

### Instructions

1. **Open orgchart_service.py file**
   - Navigate to `apps/organization/services/orgchart_service.py`
   - Locate get_department_stats method stub

2. **Implement get_department_stats method**
   - Accept department_id parameter
   - Return dictionary with comprehensive statistics
   - Calculate multiple metrics in efficient queries

3. **Retrieve target department**
   - Get department by ID
   - Verify department exists and belongs to tenant
   - Handle DoesNotExist exception gracefully

4. **Calculate total employee count**
   - Use existing get_employee_count method
   - Include all employees in subtree
   - Count only active employees

5. **Calculate employee status breakdown**
   - Count active employees (is_active=True)
   - Count employees on leave (has active leave)
   - Count inactive employees (is_active=False)
   - Use efficient aggregation queries

6. **Calculate sub-department count**
   - Count immediate children (level = dept.level + 1)
   - Use get_children() method
   - Return count of direct sub-departments

7. **Calculate total budget**
   - Use existing get_total_budget method
   - Include budgets from all descendants
   - Return as Decimal

8. **Calculate average employee tenure**
   - Get all employees in subtree
   - Calculate years from hire_date to today
   - Compute average across all employees
   - Handle None hire_dates gracefully

9. **Count open positions**
   - Query Position or Vacancy model
   - Filter by department subtree
   - Count positions with status='OPEN'
   - Include positions from child departments

10. **Add optional detailed breakdown**
    - Accept include_breakdown parameter
    - If True, include per-department statistics
    - Return nested breakdown structure

11. **Format return dictionary**
    - Use clear, descriptive keys
    - Include department identification
    - Add calculation timestamp
    - Return JSON-serializable types

12. **Add comprehensive docstring**
    - Document all calculated metrics
    - Explain aggregation methods
    - Provide example return structure

### Department Statistics Structure

```python
{
    "department_id": "dept-002",
    "department_name": "Operations",
    "department_code": "DEPT-OPS",
    
    # Employee Statistics
    "total_employees": 45,
    "active_employees": 42,
    "inactive_employees": 1,
    "employees_on_leave": 3,
    
    # Organizational Structure
    "sub_departments": 3,
    "total_descendants": 5,  # All nested children
    "depth_level": 1,
    
    # Financial Information
    "total_budget": "15000000.00",
    "budget_per_employee": "357142.86",
    "currency": "LKR",
    
    # Workforce Analytics
    "avg_tenure_years": 3.5,
    "avg_tenure_months": 42,
    "open_positions": 5,
    "vacancy_rate": "10.64",  # (open / (total + open)) * 100
    
    # Capacity Metrics
    "headcount_capacity": 50,  # Total positions (filled + open)
    "utilization_rate": "90.00",  # (filled / capacity) * 100
    
    # Timestamp
    "calculated_at": "2026-01-24T10:30:00Z",
    "cache_ttl": 3600
}
```

### Statistics Calculation Queries

```
Efficient Multi-Metric Query Strategy:
═════════════════════════════════════

# Single query for employee counts by status
employee_stats = employees_in_subtree.aggregate(
    total=Count('id'),
    active=Count('id', filter=Q(is_active=True)),
    inactive=Count('id', filter=Q(is_active=False)),
    on_leave=Count('id', filter=Q(
        is_active=True,
        leaves__status='APPROVED',
        leaves__start_date__lte=today,
        leaves__end_date__gte=today
    ))
)

# Tenure calculation
from django.db.models import Avg, F, ExpressionWrapper
from django.db.models.functions import ExtractYear, ExtractMonth
from datetime import date

today = date.today()
avg_tenure = employees_in_subtree.annotate(
    tenure_days=(today - F('hire_date')).days
).aggregate(
    avg_years=Avg(F('tenure_days') / 365.25)
)

# Budget per employee
budget_per_emp = total_budget / total_employees if total_employees > 0 else 0
```

### Employee Status Breakdown

```
Status Categories:
═════════════════

Active Employees (is_active=True, not on leave)
├── Working normally
└── Available for assignments

Employees on Leave (is_active=True, has active leave)
├── Annual leave
├── Sick leave
├── Maternity/Paternity leave
└── Other approved absences

Inactive Employees (is_active=False)
├── Resigned
├── Terminated
├── Retired
└── On extended leave

Calculation:
active_count = total - inactive - on_leave
```

### Average Tenure Calculation

```
Tenure Calculation Logic:
════════════════════════

Employee 1: Hired 2020-01-15
  Tenure = 2026-01-24 - 2020-01-15 = 6.03 years

Employee 2: Hired 2023-06-01
  Tenure = 2026-01-24 - 2023-06-01 = 2.65 years

Employee 3: Hired 2024-03-10
  Tenure = 2026-01-24 - 2024-03-10 = 1.87 years

Average Tenure:
  = (6.03 + 2.65 + 1.87) / 3
  = 10.55 / 3
  = 3.52 years

Handle Edge Cases:
- Employees with null hire_date: Exclude from calculation
- Future hire_date: Treat as 0 tenure
- Negative tenure: Data error, log and exclude
```

### Open Positions and Vacancy Rate

```
Vacancy Rate Calculation:
════════════════════════

Filled Positions: 45 employees
Open Positions: 5 vacant roles
Total Capacity: 45 + 5 = 50

Vacancy Rate:
  = (Open / Total Capacity) × 100
  = (5 / 50) × 100
  = 10%

Utilization Rate:
  = (Filled / Total Capacity) × 100
  = (45 / 50) × 100
  = 90%

Position Status Model:
position_status IN ('OPEN', 'FILLED', 'CLOSED', 'PENDING')

Query for Open Positions:
Position.objects.filter(
    department__in=subtree_departments,
    status='OPEN'
).count()
```

### Detailed Breakdown Option

```python
# With include_breakdown=True
{
    # ... main statistics ...
    
    "breakdown_by_department": [
        {
            "department_id": "dept-002",
            "department_name": "Operations",
            "level": 1,
            "direct_employees": 5,
            "total_employees": 45,
            "budget": "15000000.00"
        },
        {
            "department_id": "dept-003",
            "department_name": "Sales",
            "level": 2,
            "direct_employees": 12,
            "total_employees": 12,
            "budget": "8000000.00"
        },
        {
            "department_id": "dept-004",
            "department_name": "Support",
            "level": 2,
            "direct_employees": 8,
            "total_employees": 8,
            "budget": "3000000.00"
        }
    ],
    
    "breakdown_by_designation": [
        {
            "designation": "Operations Manager",
            "count": 3,
            "percentage": "6.67"
        },
        {
            "designation": "Sales Executive",
            "count": 20,
            "percentage": "44.44"
        }
    ],
    
    "breakdown_by_employment_type": {
        "FULL_TIME": 38,
        "PART_TIME": 5,
        "CONTRACT": 2
    }
}
```

### Sri Lankan Workforce Metrics

```
Sri Lanka-Specific Considerations:
═════════════════════════════════

1. Public Holidays:
   - Poya holidays (monthly)
   - National holidays
   - Adjust "working days" calculations

2. Leave Types:
   - Annual leave (14-21 days)
   - Casual leave (7 days)
   - Sick leave (as needed)
   - Maternity leave (84 working days)
   - Paternity leave (3 days)

3. EPF/ETF Tracking:
   - Employee Provident Fund (EPF) - 8%
   - Employer contribution - 12%
   - Employer Trust Fund (ETF) - 3%

4. Wage Board Compliance:
   - Minimum wage requirements
   - Industry-specific regulations
   - Budgeting considerations
```

### Performance Optimization

```
Optimization Strategies:
═══════════════════════

1. Aggregate Queries:
   Use single aggregate query for multiple counts
   Avoid N+1 queries

2. Subquery Optimization:
   Get department subtree once
   Reuse for all calculations

3. Conditional Aggregation:
   Count different statuses in single query
   Use filter parameter in Count()

4. Prefetch Related:
   Prefetch leaves, positions if needed
   Reduce additional queries

5. Query Result Caching:
   Cache statistics for 1 hour
   Invalidate on employee/department changes

Benchmark:
- Without optimization: 15-20 queries
- With optimization: 3-5 queries
- Performance gain: 75-80%
```

### Expected Outcome
- Comprehensive department statistics
- Efficient multi-metric calculation
- Support for organizational analysis
- Optional detailed breakdowns
- Foundation for reporting dashboards

### Verification Checklist
- [ ] get_department_stats method implemented
- [ ] Total employee count calculated
- [ ] Employee status breakdown included
- [ ] Sub-department count calculated
- [ ] Total budget aggregated
- [ ] Average tenure calculated
- [ ] Open positions counted
- [ ] Vacancy rate computed
- [ ] Optional breakdown parameter added
- [ ] Comprehensive docstring added

---

## Task 52: Implement Flatten Hierarchy

### Overview
Implement the flatten_hierarchy method to convert a tree structure into a flat list with level indicators. This utility is useful for displaying hierarchical data in tables, select dropdowns, or other list-based UI components while maintaining visual hierarchy through indentation.

### Dependencies
- Task 45: Create OrgChartService Class
- Task 46: Implement Department Tree Query
- django-mptt for tree traversal

### Instructions

1. **Open orgchart_service.py file**
   - Navigate to `apps/organization/services/orgchart_service.py`
   - Locate flatten_hierarchy method stub

2. **Implement flatten_hierarchy method**
   - Accept optional department_id parameter
   - If None, flatten entire organization
   - Return list of dictionaries with hierarchy info

3. **Get department tree**
   - Use get_department_tree method
   - Pass department_id if provided
   - Get hierarchical queryset

4. **Convert to flat list**
   - Iterate through queryset (already tree-ordered)
   - MPTT maintains hierarchical order automatically
   - Extract relevant information per department

5. **Add level indicators**
   - Use department.level from MPPT
   - Calculate indentation based on level
   - Add visual hierarchy markers

6. **Include department information**
   - Department ID, name, code
   - Manager information (if exists)
   - Employee count
   - Active status

7. **Add indentation helpers**
   - Calculate indent_string (e.g., "  " * level)
   - Add prefixed name (e.g., "  → Sales")
   - Support different indentation styles

8. **Support customization options**
   - Accept indent_char parameter (default "  ")
   - Accept include_prefix parameter (boolean)
   - Accept prefix_char parameter (default "→")

9. **Add optional filtering**
   - Accept is_active_only parameter
   - Filter inactive departments if needed
   - Maintain parent-child relationships

10. **Format return structure**
    - Return list of dictionaries
    - Include all necessary display fields
    - Maintain tree order

11. **Add comprehensive docstring**
    - Document parameters and options
    - Explain use cases
    - Provide example outputs

### Flattened Hierarchy Structure

```python
[
    {
        "id": "dept-001",
        "name": "LankaCommerce Pvt Ltd",
        "code": "DEPT-ROOT",
        "level": 0,
        "indent": "",
        "display_name": "LankaCommerce Pvt Ltd",
        "prefixed_name": "LankaCommerce Pvt Ltd",
        "has_children": True,
        "is_leaf": False,
        "manager": "Nimal Perera",
        "employee_count": 150,
        "is_active": True
    },
    {
        "id": "dept-002",
        "name": "Operations",
        "code": "DEPT-OPS",
        "level": 1,
        "indent": "  ",
        "display_name": "  Operations",
        "prefixed_name": "  → Operations",
        "has_children": True,
        "is_leaf": False,
        "manager": "Saman Silva",
        "employee_count": 45,
        "is_active": True
    },
    {
        "id": "dept-003",
        "name": "Sales",
        "code": "DEPT-SALES",
        "level": 2,
        "indent": "    ",
        "display_name": "    Sales",
        "prefixed_name": "    → Sales",
        "has_children": False,
        "is_leaf": True,
        "manager": "Kasun Rajapaksa",
        "employee_count": 25,
        "is_active": True
    },
    {
        "id": "dept-004",
        "name": "Support",
        "code": "DEPT-SUP",
        "level": 2,
        "indent": "    ",
        "display_name": "    Support",
        "prefixed_name": "    → Support",
        "has_children": False,
        "is_leaf": True,
        "manager": "Dilini Fernando",
        "employee_count": 12,
        "is_active": True
    }
]
```

### Visual Hierarchy Examples

```
HTML Select Dropdown:
═══════════════════

<select name="department">
  <option value="dept-001">LankaCommerce Pvt Ltd</option>
  <option value="dept-002">  → Operations</option>
  <option value="dept-003">    → Sales</option>
  <option value="dept-004">    → Support</option>
  <option value="dept-005">  → Finance</option>
  <option value="dept-006">    → Accounts</option>
</select>

Rendered:
LankaCommerce Pvt Ltd
  → Operations
    → Sales
    → Support
  → Finance
    → Accounts
```

```
Table Display:
═════════════

┌─────────┬────────────────────────────────┬──────────┬───────┐
│ Code    │ Department Name                │ Manager  │ Count │
├─────────┼────────────────────────────────┼──────────┼───────┤
│ ROOT    │ LankaCommerce Pvt Ltd          │ Nimal P. │  150  │
│ DEPT-OPS│   → Operations                 │ Saman S. │   45  │
│ DEPT-SLS│     → Sales                    │ Kasun R. │   25  │
│ DEPT-SUP│     → Support                  │ Dilini F.│   12  │
│ DEPT-FIN│   → Finance                    │ Kumari F.│   30  │
│ DEPT-ACC│     → Accounts                 │ Ruwan P. │   15  │
└─────────┴────────────────────────────────┴──────────┴───────┘
```

```
Terminal/CLI Display:
═══════════════════

LankaCommerce Pvt Ltd (150 employees)
├── Operations (45 employees)
│   ├── Sales (25 employees)
│   └── Support (12 employees)
└── Finance (30 employees)
    └── Accounts (15 employees)

ASCII-style:
LankaCommerce Pvt Ltd
|-- Operations
|   |-- Sales
|   `-- Support
`-- Finance
    `-- Accounts
```

### Indentation Customization

```python
# Default indentation (2 spaces)
flatten_hierarchy(indent_char="  ")
→ "  Operations"
→ "    Sales"

# Tab indentation
flatten_hierarchy(indent_char="\t")
→ "\tOperations"
→ "\t\tSales"

# Dash indentation
flatten_hierarchy(indent_char="- ")
→ "- Operations"
→ "- - Sales"

# No indentation (just prefix)
flatten_hierarchy(indent_char="", include_prefix=True)
→ "→ Operations"
→ "→ Sales"

# Custom prefix
flatten_hierarchy(prefix_char="▶")
→ "  ▶ Operations"
→ "    ▶ Sales"
```

### Use Cases

```
1. Department Selection Dropdown:
   - User-friendly hierarchical view
   - Clear parent-child relationships
   - Easy navigation

2. Transfer/Move Operations:
   - Show available destination departments
   - Prevent circular moves
   - Visual hierarchy helps decision

3. Reporting Filters:
   - Filter by department
   - Show organizational structure
   - Multiple selection support

4. Breadcrumb Generation:
   - Generate navigation paths
   - Show department location
   - Click to navigate

5. Excel/CSV Export:
   - Flatten for spreadsheet
   - Maintain visual hierarchy
   - Import-friendly format

6. Admin Interface:
   - Department list view
   - Inline hierarchy display
   - Quick scanning
```

### Algorithm Implementation

```python
def flatten_hierarchy(
    department_id=None,
    indent_char="  ",
    include_prefix=True,
    prefix_char="→",
    is_active_only=False
):
    # Get hierarchical queryset
    departments = get_department_tree(department_id)
    
    if is_active_only:
        departments = departments.filter(is_active=True)
    
    flat_list = []
    
    for dept in departments:
        # Calculate indentation
        indent = indent_char * dept.level
        
        # Build display names
        display_name = f"{indent}{dept.name}"
        
        if include_prefix and dept.level > 0:
            prefixed_name = f"{indent}{prefix_char} {dept.name}"
        else:
            prefixed_name = display_name
        
        # Build entry
        entry = {
            'id': dept.code,
            'name': dept.name,
            'code': dept.code,
            'level': dept.level,
            'indent': indent,
            'display_name': display_name,
            'prefixed_name': prefixed_name,
            'has_children': dept.get_children_count() > 0,
            'is_leaf': dept.is_leaf_node(),
            'manager': dept.manager.full_name if dept.manager else None,
            'employee_count': dept.employees.count(),
            'is_active': dept.is_active
        }
        
        flat_list.append(entry)
    
    return flat_list
```

### MPTT Advantages for Flattening

```
Why MPTT is Perfect for Flattening:
═══════════════════════════════════

Traditional Approach (Recursive):
1. Get root departments
2. For each root, recursively get children
3. Append to list with calculated level
4. Repeat for each level

Complexity: O(n) queries, complex recursion

MPTT Approach:
1. Single query ordered by lft
2. MPPT automatically maintains hierarchical order
3. Level is already calculated and stored
4. Simple iteration, no recursion needed

Complexity: O(1) query, O(n) iteration

Result:
- Parents always appear before children
- Siblings in correct order
- Level readily available
- No additional sorting needed
```

### Expected Outcome
- Flat list maintaining hierarchy
- Configurable indentation
- Support for various UI components
- Efficient single-query operation
- Multiple display format options

### Verification Checklist
- [ ] flatten_hierarchy method implemented
- [ ] department_id parameter handled
- [ ] Level-based indentation added
- [ ] Display name formatting implemented
- [ ] Prefix support added
- [ ] Customization options (indent_char, prefix_char) added
- [ ] is_active_only filtering supported
- [ ] has_children and is_leaf flags included
- [ ] Manager information included
- [ ] Comprehensive docstring added

---

## Task 53: Implement Path to Root

### Overview
Implement the get_path_to_root method to retrieve the complete path from a given department to the root department. This utility is useful for breadcrumb navigation, showing department lineage, and understanding organizational hierarchy placement.

### Dependencies
- Task 45: Create OrgChartService Class
- django-mptt for ancestor queries
- Department model with tree structure

### Instructions

1. **Open orgchart_service.py file**
   - Navigate to `apps/organization/services/orgchart_service.py`
   - Locate get_path_to_root method stub

2. **Implement get_path_to_root method**
   - Accept department_id parameter
   - Return list of departments from leaf to root
   - Include the starting department

3. **Retrieve target department**
   - Get department by ID
   - Verify department exists and belongs to tenant
   - Handle DoesNotExist exception gracefully

4. **Use MPPT get_ancestors method**
   - Call get_ancestors(include_self=True)
   - Returns all ancestors from root to current
   - Single efficient MPTT query

5. **Order ancestors appropriately**
   - MPTT returns root-to-leaf by default
   - Optionally reverse for leaf-to-root
   - Accept ascending parameter (default True for root-first)

6. **Format path information**
   - Extract department details per node
   - Include ID, name, code, level
   - Add manager information

7. **Add separator for display**
   - Accept separator parameter (default " → ")
   - Provide formatted path string
   - Support customization

8. **Create path string**
   - Join department names with separator
   - Return as single string
   - Useful for display purposes

9. **Support different formats**
   - Return both list and string formats
   - Include path_list and path_string keys
   - Add breadcrumb_items for UI components

10. **Handle root department case**
    - If given department is root, return single item
    - Path is just the root itself
    - Handle gracefully

11. **Add comprehensive docstring**
    - Document parameters and return structure
    - Provide breadcrumb examples
    - Show usage scenarios

### Path to Root Structure

```python
# For department "Sales" (level 2)
{
    "department_id": "dept-003",
    "department_name": "Sales",
    "path_list": [
        {
            "id": "dept-001",
            "name": "LankaCommerce Pvt Ltd",
            "code": "DEPT-ROOT",
            "level": 0,
            "is_current": False,
            "url": "/departments/dept-001/"
        },
        {
            "id": "dept-002",
            "name": "Operations",
            "code": "DEPT-OPS",
            "level": 1,
            "is_current": False,
            "url": "/departments/dept-002/"
        },
        {
            "id": "dept-003",
            "name": "Sales",
            "code": "DEPT-SALES",
            "level": 2,
            "is_current": True,
            "url": "/departments/dept-003/"
        }
    ],
    "path_string": "LankaCommerce Pvt Ltd → Operations → Sales",
    "depth": 2,
    "total_levels": 3
}
```

### Path Visualization Examples

```
Breadcrumb Navigation (HTML):
═══════════════════════════

<nav aria-label="breadcrumb">
  <ol class="breadcrumb">
    <li class="breadcrumb-item">
      <a href="/departments/dept-001/">LankaCommerce Pvt Ltd</a>
    </li>
    <li class="breadcrumb-item">
      <a href="/departments/dept-002/">Operations</a>
    </li>
    <li class="breadcrumb-item active" aria-current="page">
      Sales
    </li>
  </ol>
</nav>

Rendered:
LankaCommerce Pvt Ltd > Operations > Sales
```

```
Terminal/CLI Display:
═══════════════════

Department Location:
  LankaCommerce Pvt Ltd (Root)
    └─ Operations
        └─ Sales (Current)

Path: LankaCommerce Pvt Ltd → Operations → Sales
Level: 2 (depth from root)
```

```
Dropdown Context Display:
════════════════════════

Current Selection: Sales
Full Path: Company → Operations → Sales

Shows department in organizational context
```

### MPTT Ancestor Query

```
MPTT Ancestor Query (Efficient):
═══════════════════════════════

Given: Sales Department (ID=3, lft=5, rght=6, tree_id=1)

Query:
SELECT * FROM department
WHERE tree_id = 1
  AND lft < 5      -- Left boundary before Sales
  AND rght > 6     -- Right boundary after Sales
ORDER BY lft;      -- Root first

Result:
1. LankaCommerce (lft=1, rght=20)  ← Contains Sales
2. Operations (lft=4, rght=11)     ← Contains Sales
3. Sales (lft=5, rght=6)           ← include_self=True

Complexity: O(1) - Single query regardless of depth
```

### Path Query Comparison

```
Traditional Recursive Approach:
═══════════════════════════════

function get_path(dept):
    path = [dept]
    current = dept
    
    while current.parent is not None:
        current = current.parent
        path.insert(0, current)  # Prepend
    
    return path

Queries: 1 per level (N queries for depth N)
Example: Depth 5 = 5 queries

MPTT Approach:
═════════════

function get_path(dept):
    return dept.get_ancestors(include_self=True)

Queries: 1 (regardless of depth)
Example: Depth 5 = 1 query

Performance: 5x to 20x faster for typical hierarchies
```

### Use Cases and Applications

```
1. Breadcrumb Navigation:
   ═══════════════════════
   Show user current location in org hierarchy
   Click any level to navigate up
   
   Home / Departments / Operations / Sales

2. Department Context Display:
   ═══════════════════════════
   Show where department fits
   Understanding reporting structure
   
   Sales is under Operations, which is under Company

3. Authorization Checks:
   ══════════════════════
   Check if user has access to parent departments
   Inherit permissions from ancestors
   
   if user.can_access(any(path_departments)):
       allow_access()

4. Transfer Validation:
   ═══════════════════
   Prevent circular transfers
   Can't move department under its own descendant
   
   if target in source.get_descendants():
       raise ValidationError("Circular reference")

5. Budget Roll-up Display:
   ════════════════════════
   Show budget allocation path
   From leaf to root accumulation
   
   Sales (8M) → Operations (15M) → Company (50M)

6. Reporting Path:
   ══════════════
   Show reporting hierarchy
   Manager chain visualization
   
   Sales Manager → Operations Director → CEO
```

### Path String Formatting

```python
# Default separator (arrow)
path_string = " → ".join(names)
→ "LankaCommerce Pvt Ltd → Operations → Sales"

# Forward slash (web-style)
path_string = " / ".join(names)
→ "LankaCommerce Pvt Ltd / Operations / Sales"

# Greater than (breadcrumb style)
path_string = " > ".join(names)
→ "LankaCommerce Pvt Ltd > Operations > Sales"

# Pipe separator
path_string = " | ".join(names)
→ "LankaCommerce Pvt Ltd | Operations | Sales"

# Code-based path
path_string = ".".join(codes)
→ "DEPT-ROOT.DEPT-OPS.DEPT-SALES"

# With emoji indicators
path_string = " 🏢 ".join(names)
→ "LankaCommerce Pvt Ltd 🏢 Operations 🏢 Sales"
```

### Reverse Path (Leaf to Root)

```python
# Root to Leaf (Default, ascending=True)
path = get_path_to_root(dept_id, ascending=True)
→ ["Company", "Operations", "Sales"]

# Leaf to Root (ascending=False)
path = get_path_to_root(dept_id, ascending=False)
→ ["Sales", "Operations", "Company"]

Use Cases:
- Ascending: Breadcrumbs, hierarchy display
- Descending: Drill-down navigation, tree building
```

### Algorithm Implementation

```python
def get_path_to_root(department_id, ascending=True, separator=" → "):
    # Get department
    try:
        dept = Department.objects.get(
            id=department_id,
            tenant=self.tenant
        )
    except Department.DoesNotExist:
        return None
    
    # Get ancestors (includes self)
    ancestors = dept.get_ancestors(
        include_self=True,
        ascending=ascending
    ).select_related('manager', 'manager__user')
    
    # Build path list
    path_list = []
    for ancestor in ancestors:
        path_list.append({
            'id': ancestor.code,
            'name': ancestor.name,
            'code': ancestor.code,
            'level': ancestor.level,
            'is_current': ancestor.id == dept.id,
            'url': f'/departments/{ancestor.code}/',
            'manager': ancestor.manager.full_name if ancestor.manager else None
        })
    
    # Build path string
    names = [item['name'] for item in path_list]
    path_string = separator.join(names)
    
    return {
        'department_id': dept.code,
        'department_name': dept.name,
        'path_list': path_list,
        'path_string': path_string,
        'depth': dept.level,
        'total_levels': len(path_list)
    }
```

### Expected Outcome
- Efficient path retrieval using MPTT
- Support for both list and string formats
- Customizable separators
- Breadcrumb-ready data structure
- Root and leaf to root options

### Verification Checklist
- [ ] get_path_to_root method implemented
- [ ] department_id parameter handled
- [ ] MPTT get_ancestors used
- [ ] Path list with details created
- [ ] Path string with separator generated
- [ ] ascending parameter supported
- [ ] separator parameter supported
- [ ] Breadcrumb data structure included
- [ ] Root department case handled
- [ ] Comprehensive docstring added

---

## Task 54: Implement Subtree Query

### Overview
Implement the get_subtree method to retrieve all departments under a specific department (including the department itself). This utility is useful for department-scoped operations, mass updates, reporting on divisions, and understanding organizational segments.

### Dependencies
- Task 45: Create OrgChartService Class
- Task 46: Implement Department Tree Query
- django-mptt for subtree queries

### Instructions

1. **Open orgchart_service.py file**
   - Navigate to `apps/organization/services/orgchart_service.py`
   - Locate get_subtree method stub

2. **Implement get_subtree method**
   - Accept department_id parameter
   - Return queryset of all descendant departments
   - Include the starting department by default

3. **Retrieve target department**
   - Get department by ID
   - Verify department exists and belongs to tenant
   - Handle DoesNotExist exception gracefully

4. **Use MPTT get_descendants method**
   - Call get_descendants(include_self=True)
   - Returns all descendants efficiently
   - Single MPTT query

5. **Add include_self parameter**
   - Accept include_self boolean (default True)
   - Controls whether root is included
   - Pass to get_descendants

6. **Apply optimizations**
   - Add select_related for manager
   - Add select_related for parent
   - Optimize for common use cases

7. **Add filtering options**
   - Accept is_active_only parameter
   - Filter by active status if needed
   - Accept max_depth parameter

8. **Implement depth limiting**
   - Limit descendants to certain depth
   - Use level field for filtering
   - Support shallow subtree queries

9. **Order results**
   - Order by tree_id and lft (hierarchical)
   - Maintain parent-before-children order
   - Support alternative ordering

10. **Return department statistics**
    - Optionally include counts
    - Add total departments in subtree
    - Include depth information

11. **Add comprehensive docstring**
    - Document all parameters
    - Explain use cases
    - Provide query examples

### Subtree Query Results

```python
# Get Operations subtree
subtree = get_subtree('dept-002')

# Returns QuerySet:
<QuerySet [
    <Department: Operations (DEPT-OPS)>,      # Level 1
    <Department: Sales (DEPT-SALES)>,         # Level 2
    <Department: Support (DEPT-SUP)>,         # Level 2
    <Department: Marketing (DEPT-MKT)>        # Level 2
]>

# With statistics:
{
    'root_department': {
        'id': 'dept-002',
        'name': 'Operations',
        'level': 1
    },
    'subtree': QuerySet(...),
    'total_departments': 4,
    'max_depth': 2,
    'total_employees': 45,
    'total_budget': '15000000.00'
}
```

### Subtree Visualization

```
Company (DEPT-ROOT)
├── Operations (DEPT-OPS)  ← get_subtree(DEPT-OPS)
│   ├── Sales              ↓ These departments
│   ├── Support            ↓ are returned
│   └── Marketing          ↓
└── Finance
    └── Accounts

Subtree Result:
┌──────────────┐
│  Operations  │ (include_self=True)
├──────────────┤
│  Sales       │
│  Support     │
│  Marketing   │
└──────────────┘
```

### MPTT Subtree Query

```
Efficient Subtree Query with MPTT:
══════════════════════════════════

Department: Operations
- lft: 4
- rght: 11
- tree_id: 1
- level: 1

SQL Query:
SELECT * FROM department
WHERE tree_id = 1
  AND lft >= 4      -- Operations' left
  AND rght <= 11    -- Operations' right
ORDER BY lft;

Result Set:
Operations   (lft=4,  rght=11, level=1)
├─ Sales     (lft=5,  rght=6,  level=2)
├─ Support   (lft=7,  rght=8,  level=2)
└─ Marketing (lft=9,  rght=10, level=2)

Complexity: O(1) - Single query
Performance: Same speed for 10 or 10,000 descendants
```

### Depth Limiting

```python
# Get only immediate children (depth = 1)
subtree = get_subtree('dept-002', max_depth=1)

Operations (level=1)
├── Sales (level=2)      ← Included (1 level down)
├── Support (level=2)    ← Included (1 level down)
└── Marketing (level=2)  ← Included (1 level down)

# Get up to 2 levels deep
subtree = get_subtree('dept-001', max_depth=2)

Company (level=0)
├── Operations (level=1)      ← Included (1 level)
│   ├── Sales (level=2)       ← Included (2 levels)
│   └── Support (level=2)     ← Included (2 levels)
└── Finance (level=1)         ← Included (1 level)
    └── Accounts (level=2)    ← Included (2 levels)

Implementation:
if max_depth is not None:
    max_level = dept.level + max_depth
    subtree = subtree.filter(level__lte=max_level)
```

### Use Cases

```
1. Mass Department Operations:
   ═══════════════════════════
   - Deactivate entire division
   - Update budget across departments
   - Apply policy changes
   
   operations_dept = get_subtree('DEPT-OPS')
   operations_dept.update(is_active=False)

2. Scoped Reporting:
   ═════════════════
   - Generate division reports
   - Calculate divisional metrics
   - Export department structure
   
   dept_ids = get_subtree('DEPT-OPS').values_list('id')
   employees = Employee.filter(department_id__in=dept_ids)

3. Permission Checking:
   ═══════════════════
   - User has access to department and children
   - Hierarchical permission inheritance
   
   accessible_depts = get_subtree(user.primary_department_id)
   if target_dept in accessible_depts:
       grant_access()

4. Organizational Restructuring:
   ═══════════════════════════
   - Move entire division
   - Merge department trees
   - Split departments
   
   subtree = get_subtree('DEPT-OPS')
   subtree.update(parent=new_parent)

5. Budget Allocation:
   ══════════════════
   - Distribute budget across subtree
   - Calculate department shares
   - Track allocation
   
   total = get_subtree('DEPT-OPS').aggregate(Sum('budget'))

6. Employee Transfer Restrictions:
   ═══════════════════════════════
   - Can't transfer outside division
   - Must stay within subtree
   
   valid_targets = get_subtree(employee.department.parent_id)
```

### Exclude Self Option

```python
# With self (default)
subtree = get_subtree('dept-002', include_self=True)
→ [Operations, Sales, Support, Marketing]  # 4 departments

# Without self
subtree = get_subtree('dept-002', include_self=False)
→ [Sales, Support, Marketing]  # 3 departments (children only)

Use Cases:
- include_self=True: Division-wide operations
- include_self=False: Affect only children, not parent
```

### Active-Only Filtering

```python
# All departments in subtree
subtree = get_subtree('dept-002')
→ Operations, Sales (inactive), Support, Marketing

# Active only
subtree = get_subtree('dept-002', is_active_only=True)
→ Operations, Support, Marketing  # Sales excluded

Maintains hierarchy structure:
Operations (active)
├── Sales (inactive)  ← EXCLUDED
├── Support (active)
└── Marketing (active)
```

### Algorithm Implementation

```python
def get_subtree(
    department_id,
    include_self=True,
    is_active_only=False,
    max_depth=None,
    include_stats=False
):
    # Get root department
    try:
        dept = Department.objects.get(
            id=department_id,
            tenant=self.tenant
        )
    except Department.DoesNotExist:
        return None
    
    # Get descendants
    subtree = dept.get_descendants(include_self=include_self)
    
    # Apply filters
    if is_active_only:
        subtree = subtree.filter(is_active=True)
    
    if max_depth is not None:
        max_level = dept.level + max_depth
        subtree = subtree.filter(level__lte=max_level)
    
    # Apply optimizations
    subtree = subtree.select_related(
        'manager',
        'manager__user',
        'parent'
    ).order_by('tree_id', 'lft')
    
    # Return with stats if requested
    if include_stats:
        return {
            'root_department': {
                'id': dept.code,
                'name': dept.name,
                'level': dept.level
            },
            'subtree': subtree,
            'total_departments': subtree.count(),
            'max_depth': subtree.aggregate(
                Max('level')
            )['level__max'] - dept.level if include_self else 0,
            'total_employees': Employee.objects.filter(
                department__in=subtree
            ).count(),
            'total_budget': subtree.aggregate(
                Sum('budget')
            )['budget__sum'] or Decimal('0.00')
        }
    
    return subtree
```

### Performance Considerations

```
Query Performance:
═════════════════

Scenario: Get subtree of department with 100 descendants

Traditional Recursive:
- 1 query to get root
- 1 query per level to get children
- For 5 levels: 6 queries
- Total: O(depth) queries

MPTT Subtree:
- 1 query to get all descendants
- All levels in single query
- Total: O(1) query

Performance Improvement:
- 85-95% reduction in queries
- 10-50x faster for large subtrees
- Constant time regardless of depth
```

### Expected Outcome
- Efficient subtree retrieval
- Single MPTT query optimization
- Flexible filtering options
- Depth limiting support
- Optional statistics inclusion

### Verification Checklist
- [ ] get_subtree method implemented
- [ ] department_id parameter handled
- [ ] MPTT get_descendants used
- [ ] include_self parameter added
- [ ] is_active_only filtering supported
- [ ] max_depth limiting implemented
- [ ] Query optimizations applied
- [ ] include_stats option added
- [ ] Hierarchical ordering maintained
- [ ] Comprehensive docstring added

---

## Task 55: Create Reporting Chain Query

### Overview
Implement the get_reporting_chain method to retrieve an employee's complete reporting chain from the employee to the CEO. This utility visualizes the management hierarchy, showing all managers in the chain of command, useful for approval workflows, escalation paths, and organizational clarity.

### Dependencies
- Task 45: Create OrgChartService Class
- Employee model with manager field (self-referencing)
- User model for employee details

### Instructions

1. **Open orgchart_service.py file**
   - Navigate to `apps/organization/services/orgchart_service.py`
   - Locate get_reporting_chain method stub

2. **Implement get_reporting_chain method**
   - Accept employee_id parameter
   - Return list of employees in reporting chain
   - Order from employee to top management

3. **Retrieve target employee**
   - Get employee by ID
   - Verify employee exists and belongs to tenant
   - Handle DoesNotExist exception gracefully

4. **Build reporting chain**
   - Start with target employee
   - Follow manager relationships
   - Stop at employee with no manager (CEO/top)

5. **Implement iterative traversal**
   - Use iterative approach (not recursive)
   - Prevent infinite loops (circular references)
   - Track visited employees

6. **Add select_related optimization**
   - Fetch all manager relationships in one query
   - Use select_related('manager__user')
   - Include designation and department

7. **Format chain information**
   - Include employee ID, name, designation
   - Add department information
   - Include contact details if needed
   - Mark current employee

8. **Add chain metadata**
   - Include total chain length
   - Add levels to top (distance to CEO)
   - Include direct manager info

9. **Handle edge cases**
   - Employee with no manager (is CEO)
   - Circular manager references (data error)
   - Inactive managers in chain

10. **Support reverse order**
    - Accept ascending parameter (default False)
    - False: Employee to CEO (bottom-up)
    - True: CEO to Employee (top-down)

11. **Add comprehensive docstring**
    - Document parameters and return structure
    - Explain chain direction
    - Provide approval workflow example

### Reporting Chain Structure

```python
# For employee: Junior Developer (emp-050)
{
    "employee_id": "emp-050",
    "employee_name": "Tharaka Wijesinghe",
    "designation": "Junior Developer",
    "department": "Engineering",
    
    "chain": [
        {
            "id": "emp-050",
            "name": "Tharaka Wijesinghe",
            "designation": "Junior Developer",
            "department": "Engineering",
            "level_in_chain": 0,
            "is_current": True,
            "is_direct_manager": False,
            "email": "tharaka@company.lk",
            "phone": "+94 77 234 5678"
        },
        {
            "id": "emp-030",
            "name": "Ruwan Kumara",
            "designation": "Senior Developer",
            "department": "Engineering",
            "level_in_chain": 1,
            "is_current": False,
            "is_direct_manager": True,
            "email": "ruwan@company.lk",
            "phone": "+94 77 123 4567"
        },
        {
            "id": "emp-010",
            "name": "Kasun Silva",
            "designation": "Engineering Manager",
            "department": "Engineering",
            "level_in_chain": 2,
            "is_current": False,
            "is_direct_manager": False
        },
        {
            "id": "emp-003",
            "name": "Saman Fernando",
            "designation": "Chief Technology Officer",
            "department": "Executive",
            "level_in_chain": 3,
            "is_current": False,
            "is_direct_manager": False
        },
        {
            "id": "emp-001",
            "name": "Nimal Perera",
            "designation": "Chief Executive Officer",
            "department": "Executive",
            "level_in_chain": 4,
            "is_current": False,
            "is_direct_manager": False,
            "is_top": True
        }
    ],
    
    "chain_length": 5,
    "levels_to_top": 4,
    "direct_manager": "Ruwan Kumara",
    "top_executive": "Nimal Perera"
}
```

### Reporting Chain Visualization

```
Employee Reporting Chain:
════════════════════════

Junior Developer (Tharaka)
    ↑ reports to
Senior Developer (Ruwan)
    ↑ reports to
Engineering Manager (Kasun)
    ↑ reports to
CTO (Saman)
    ↑ reports to
CEO (Nimal) ← Top of chain


Chain Diagram:
═════════════

┌─────────────────────────────┐
│ CEO (Nimal Perera)          │ Level 4 (Top)
└──────────────┬──────────────┘
               │
┌──────────────▼──────────────┐
│ CTO (Saman Fernando)        │ Level 3
└──────────────┬──────────────┘
               │
┌──────────────▼──────────────┐
│ Eng Manager (Kasun Silva)   │ Level 2
└──────────────┬──────────────┘
               │
┌──────────────▼──────────────┐
│ Sr Developer (Ruwan Kumara) │ Level 1 (Direct Manager)
└──────────────┬──────────────┘
               │
┌──────────────▼──────────────┐
│ Jr Developer (Tharaka)      │ Level 0 (Current)
└─────────────────────────────┘
```

### Query Optimization

```
Naive Approach (N+1 Queries):
═════════════════════════════

emp = Employee.objects.get(id=employee_id)
chain = [emp]

while emp.manager is not None:
    emp = emp.manager  # ← Database query each iteration
    chain.append(emp)

Queries: 1 + N (where N = chain length)
Example: 5-level chain = 6 queries


Optimized Approach (Single Query):
══════════════════════════════════

# Pre-fetch all possible managers
employees = Employee.objects.filter(
    tenant=tenant
).select_related(
    'manager',
    'manager__user',
    'manager__designation',
    'manager__department'
)

# Build lookup dictionary
emp_lookup = {e.id: e for e in employees}

# Traverse using cached data
emp = emp_lookup[employee_id]
chain = [emp]

while emp.manager_id is not None:
    emp = emp_lookup[emp.manager_id]  # ← In-memory lookup
    chain.append(emp)

Queries: 1 (single fetch with relationships)
Performance: 5-10x faster
```

### Circular Reference Detection

```python
def get_reporting_chain(employee_id):
    # Track visited to detect cycles
    visited = set()
    chain = []
    
    emp = Employee.objects.select_related(
        'manager', 'user', 'designation', 'department'
    ).get(id=employee_id)
    
    while emp is not None:
        # Check for circular reference
        if emp.id in visited:
            raise ValueError(
                f"Circular manager reference detected: "
                f"Employee {emp.name} appears twice in chain"
            )
        
        visited.add(emp.id)
        chain.append(emp)
        
        # Move to manager
        emp = emp.manager
    
    return chain
```

### Use Cases

```
1. Approval Workflows:
   ═══════════════════
   Leave Request:
   Employee → Direct Manager → Department Head → HR → CEO
   
   chain = get_reporting_chain(employee_id)
   for approver in chain[1:]:  # Skip employee
       send_approval_request(approver, request)

2. Escalation Paths:
   ═════════════════
   Support Ticket Escalation:
   L1 Agent → L2 Agent → Team Lead → Manager → Director
   
   if not resolved:
       next_level = chain[current_level + 1]
       escalate_to(next_level)

3. Notification Distribution:
   ═════════════════════════
   Important Announcement:
   Notify employee and all managers in chain
   
   recipients = [emp.email for emp in get_reporting_chain(emp_id)]
   send_notification(recipients, message)

4. Access Control:
   ═══════════════
   Manager can access subordinate data
   Check if manager is in employee's chain
   
   chain_ids = [emp.id for emp in get_reporting_chain(employee_id)]
   if manager_id in chain_ids:
       grant_access()

5. Organizational Insights:
   ════════════════════════
   Average chain length in organization
   Identify reporting bottlenecks
   
   avg_chain = mean([len(get_reporting_chain(e.id)) for e in employees])

6. Delegation Rules:
   ═════════════════
   When manager absent, delegate to next in chain
   
   if manager.is_on_leave:
       chain = get_reporting_chain(employee_id)
       next_approver = chain[2]  # Skip employee and direct manager
```

### Chain Order Options

```python
# Bottom-up (Employee to CEO) - Default
chain = get_reporting_chain(emp_id, ascending=False)
→ [Junior Dev, Senior Dev, Manager, CTO, CEO]

# Top-down (CEO to Employee)
chain = get_reporting_chain(emp_id, ascending=True)
→ [CEO, CTO, Manager, Senior Dev, Junior Dev]

Use Cases:
- Bottom-up: Approval workflows (escalate up)
- Top-down: Delegation flows (delegate down)
```

### Algorithm Implementation

```python
def get_reporting_chain(employee_id, ascending=False):
    # Get employee with optimized relationships
    try:
        employee = Employee.objects.select_related(
            'user',
            'designation',
            'department',
            'manager',
            'manager__user',
            'manager__designation',
            'manager__department'
        ).get(id=employee_id, tenant=self.tenant)
    except Employee.DoesNotExist:
        return None
    
    # Build chain
    chain = []
    current = employee
    visited = set()
    level = 0
    
    while current is not None:
        # Detect circular reference
        if current.id in visited:
            raise ValueError(f"Circular reference at {current.name}")
        
        visited.add(current.id)
        
        # Add to chain
        chain.append({
            'id': current.employee_code,
            'name': current.full_name,
            'designation': current.designation.title if current.designation else None,
            'department': current.department.name if current.department else None,
            'level_in_chain': level,
            'is_current': current.id == employee.id,
            'is_direct_manager': current.id == employee.manager_id,
            'is_top': current.manager is None,
            'email': current.user.email,
            'phone': current.phone
        })
        
        # Move to next
        current = current.manager
        level += 1
    
    # Reverse if top-down
    if ascending:
        chain.reverse()
        # Re-calculate levels
        for i, item in enumerate(chain):
            item['level_in_chain'] = i
    
    # Build response
    return {
        'employee_id': employee.employee_code,
        'employee_name': employee.full_name,
        'designation': employee.designation.title if employee.designation else None,
        'department': employee.department.name if employee.department else None,
        'chain': chain,
        'chain_length': len(chain),
        'levels_to_top': len(chain) - 1,
        'direct_manager': chain[1]['name'] if len(chain) > 1 else None,
        'top_executive': chain[-1]['name']
    }
```

### Expected Outcome
- Complete reporting chain retrieval
- Circular reference detection
- Optimized query with relationships
- Support for bottom-up and top-down
- Approval workflow ready

### Verification Checklist
- [ ] get_reporting_chain method implemented
- [ ] employee_id parameter handled
- [ ] Iterative traversal implemented
- [ ] Circular reference detection added
- [ ] select_related optimization applied
- [ ] Chain metadata included
- [ ] ascending parameter supported
- [ ] Direct manager flagged
- [ ] Top executive identified
- [ ] Comprehensive docstring added

---

## Task 56: Cache Org Chart Data

### Overview
Implement Redis-based caching for org chart data to improve performance and reduce database load. Org chart queries can be expensive, especially for large organizations, and the data doesn't change frequently. Caching provides significant performance gains while maintaining data freshness through strategic cache invalidation.

### Dependencies
- Task 45: Create OrgChartService Class
- Tasks 46-55: All org chart query methods
- Redis server configured
- Django cache framework setup

### Instructions

1. **Create cache utility module**
   - Create `cache/` directory in `apps/organization/`
   - Create `orgchart_cache.py` file
   - Create cache helper class

2. **Import required modules**
   - Import Django cache utilities
   - Import Redis client if needed
   - Import serialization utilities (JSON, pickle)
   - Import logging for cache operations

3. **Define cache key patterns**
   - Create constants for key prefixes
   - Include tenant_id in all keys
   - Add version support for cache invalidation
   - Document key structure

4. **Implement cache key generator**
   - Create method to generate consistent keys
   - Include tenant, type, and parameters
   - Support key variations for different queries
   - Format: `orgchart:{tenant_id}:{type}:{params}`

5. **Add cache get method**
   - Accept cache key
   - Return cached data if exists and valid
   - Return None if cache miss
   - Log cache hits/misses

6. **Add cache set method**
   - Accept key, data, and TTL
   - Serialize data appropriately
   - Store in Redis
   - Set expiration time

7. **Implement cache invalidation**
   - Create invalidate_cache method
   - Support full invalidation (all org chart data)
   - Support partial invalidation (specific queries)
   - Support pattern-based invalidation

8. **Add cache decorators**
   - Create @cache_orgchart decorator
   - Automatically cache method results
   - Handle cache key generation
   - Support TTL configuration

9. **Integrate with service methods**
   - Apply caching to expensive queries
   - Cache department tree
   - Cache employee tree
   - Cache generated JSON
   - Cache statistics

10. **Implement cache warming**
    - Create warm_cache method
    - Pre-populate commonly used data
    - Run on tenant creation
    - Schedule periodic warming

11. **Add cache monitoring**
    - Log cache operations
    - Track hit/miss rates
    - Monitor cache size
    - Alert on issues

12. **Configure invalidation triggers**
    - Invalidate on department changes
    - Invalidate on employee changes
    - Invalidate on manager changes
    - Use Django signals

13. **Add comprehensive docstring**
    - Document caching strategy
    - Explain key patterns
    - List invalidation triggers
    - Provide configuration examples

### Cache Key Structure

```
Cache Key Patterns:
══════════════════

Department Tree:
orgchart:{tenant_id}:department:tree:{root_id}

Employee Tree:
orgchart:{tenant_id}:employee:tree:{root_employee_id}

Org Chart JSON:
orgchart:{tenant_id}:json:{type}:{root_id}

Department Statistics:
orgchart:{tenant_id}:stats:{department_id}

Flattened Hierarchy:
orgchart:{tenant_id}:flatten:{department_id}

Path to Root:
orgchart:{tenant_id}:path:{department_id}

Reporting Chain:
orgchart:{tenant_id}:chain:{employee_id}

Employee Count:
orgchart:{tenant_id}:count:{department_id}

Budget Total:
orgchart:{tenant_id}:budget:{department_id}

Examples:
- orgchart:tenant-001:department:tree:dept-002
- orgchart:tenant-001:json:department:root
- orgchart:tenant-001:stats:dept-005
- orgchart:tenant-001:chain:emp-050
```

### Cache Configuration

```python
# settings.py
CACHES = {
    'default': {
        'BACKEND': 'django_redis.cache.RedisCache',
        'LOCATION': 'redis://127.0.0.1:6379/1',
        'OPTIONS': {
            'CLIENT_CLASS': 'django_redis.client.DefaultClient',
            'PARSER_CLASS': 'redis.connection.HiredisParser',
            'SERIALIZER': 'django_redis.serializers.json.JSONSerializer',
        },
        'KEY_PREFIX': 'lankacommerce',
        'TIMEOUT': 3600,  # 1 hour default
    }
}

# Org Chart Specific Cache Settings
ORGCHART_CACHE_CONFIG = {
    'department_tree_ttl': 3600,      # 1 hour
    'employee_tree_ttl': 3600,        # 1 hour
    'orgchart_json_ttl': 3600,        # 1 hour
    'statistics_ttl': 1800,           # 30 minutes
    'flatten_hierarchy_ttl': 3600,    # 1 hour
    'path_to_root_ttl': 7200,         # 2 hours (rarely changes)
    'reporting_chain_ttl': 3600,      # 1 hour
    'employee_count_ttl': 1800,       # 30 minutes
    'budget_total_ttl': 1800,         # 30 minutes
}
```

### Cache Utility Class

```python
# apps/organization/cache/orgchart_cache.py

from django.core.cache import cache
from django.conf import settings
import logging

logger = logging.getLogger(__name__)

class OrgChartCache:
    """Cache management for organization chart data."""
    
    # Cache key prefixes
    PREFIX = 'orgchart'
    VERSION = 'v1'
    
    # TTL values (seconds)
    DEFAULT_TTL = 3600  # 1 hour
    
    def __init__(self, tenant_id):
        self.tenant_id = tenant_id
    
    def _make_key(self, cache_type, *args):
        """Generate cache key."""
        key_parts = [
            self.PREFIX,
            self.VERSION,
            str(self.tenant_id),
            cache_type
        ]
        key_parts.extend([str(arg) for arg in args if arg is not None])
        key = ':'.join(key_parts)
        return key
    
    def get(self, cache_type, *args):
        """Get cached data."""
        key = self._make_key(cache_type, *args)
        data = cache.get(key)
        
        if data is not None:
            logger.debug(f"Cache HIT: {key}")
        else:
            logger.debug(f"Cache MISS: {key}")
        
        return data
    
    def set(self, cache_type, data, *args, ttl=None):
        """Set cached data."""
        key = self._make_key(cache_type, *args)
        ttl = ttl or self.DEFAULT_TTL
        
        cache.set(key, data, ttl)
        logger.debug(f"Cache SET: {key} (TTL: {ttl}s)")
    
    def invalidate(self, cache_type=None, *args):
        """Invalidate cached data."""
        if cache_type is None:
            # Invalidate all org chart cache for tenant
            pattern = self._make_key('*')
            self._delete_pattern(pattern)
            logger.info(f"Invalidated all org chart cache for tenant {self.tenant_id}")
        else:
            # Invalidate specific cache
            key = self._make_key(cache_type, *args)
            cache.delete(key)
            logger.debug(f"Invalidated cache: {key}")
    
    def _delete_pattern(self, pattern):
        """Delete keys matching pattern."""
        # Redis-specific pattern deletion
        from django_redis import get_redis_connection
        conn = get_redis_connection("default")
        
        keys = conn.keys(pattern)
        if keys:
            conn.delete(*keys)
            logger.info(f"Deleted {len(keys)} cache keys matching {pattern}")
```

### Caching Decorator

```python
from functools import wraps

def cache_orgchart(cache_type, ttl=None):
    """
    Decorator to cache org chart method results.
    
    Usage:
        @cache_orgchart('department_tree', ttl=3600)
        def get_department_tree(self, root_id=None):
            # Method implementation
            pass
    """
    def decorator(func):
        @wraps(func)
        def wrapper(self, *args, **kwargs):
            # Get tenant from service instance
            tenant_id = getattr(self, 'tenant_id', None)
            if not tenant_id:
                # No tenant, don't cache
                return func(self, *args, **kwargs)
            
            # Create cache instance
            cache_mgr = OrgChartCache(tenant_id)
            
            # Try to get from cache
            cache_key_args = args + tuple(sorted(kwargs.items()))
            cached_data = cache_mgr.get(cache_type, *cache_key_args)
            
            if cached_data is not None:
                return cached_data
            
            # Cache miss, execute function
            result = func(self, *args, **kwargs)
            
            # Cache result
            cache_mgr.set(cache_type, result, *cache_key_args, ttl=ttl)
            
            return result
        
        return wrapper
    return decorator
```

### Service Method Integration

```python
# In OrgChartService class

from .cache.orgchart_cache import OrgChartCache, cache_orgchart

class OrgChartService:
    def __init__(self, tenant):
        self.tenant = tenant
        self.tenant_id = tenant.id if tenant else None
        self.cache = OrgChartCache(self.tenant_id) if self.tenant_id else None
    
    @cache_orgchart('department_tree', ttl=3600)
    def get_department_tree(self, root_id=None):
        """Get department tree (cached)."""
        # Implementation...
        pass
    
    @cache_orgchart('employee_tree', ttl=3600)
    def get_employee_tree(self, root_employee_id=None):
        """Get employee tree (cached)."""
        # Implementation...
        pass
    
    @cache_orgchart('orgchart_json', ttl=3600)
    def generate_orgchart_json(self, type='department', root_id=None):
        """Generate org chart JSON (cached)."""
        # Implementation...
        pass
    
    @cache_orgchart('stats', ttl=1800)
    def get_department_stats(self, department_id):
        """Get department statistics (cached)."""
        # Implementation...
        pass
    
    def invalidate_cache(self, cache_type=None, *args):
        """Invalidate org chart cache."""
        if self.cache:
            self.cache.invalidate(cache_type, *args)
```

### Cache Invalidation Signals

```python
# apps/organization/signals.py

from django.db.models.signals import post_save, post_delete, pre_save
from django.dispatch import receiver
from .models import Department, Employee
from .cache.orgchart_cache import OrgChartCache

@receiver([post_save, post_delete], sender=Department)
def invalidate_department_cache(sender, instance, **kwargs):
    """Invalidate cache when department changes."""
    cache = OrgChartCache(instance.tenant_id)
    cache.invalidate()  # Invalidate all for simplicity
    
    logger.info(
        f"Invalidated org chart cache for tenant {instance.tenant_id} "
        f"due to department {instance.name} change"
    )

@receiver([post_save, post_delete], sender=Employee)
def invalidate_employee_cache(sender, instance, **kwargs):
    """Invalidate cache when employee changes."""
    cache = OrgChartCache(instance.tenant_id)
    cache.invalidate()
    
    logger.info(
        f"Invalidated org chart cache for tenant {instance.tenant_id} "
        f"due to employee {instance.full_name} change"
    )

@receiver(pre_save, sender=Employee)
def invalidate_on_manager_change(sender, instance, **kwargs):
    """Invalidate cache when employee's manager changes."""
    if instance.pk:
        try:
            old_instance = Employee.objects.get(pk=instance.pk)
            if old_instance.manager_id != instance.manager_id:
                # Manager changed, invalidate reporting chain
                cache = OrgChartCache(instance.tenant_id)
                cache.invalidate('chain', instance.employee_code)
                logger.info(
                    f"Invalidated reporting chain cache for {instance.full_name}"
                )
        except Employee.DoesNotExist:
            pass
```

### Cache Warming Strategy

```python
def warm_orgchart_cache(tenant):
    """Pre-populate org chart cache."""
    service = OrgChartService(tenant)
    
    logger.info(f"Warming org chart cache for tenant {tenant.name}")
    
    # Warm department tree
    service.get_department_tree()
    logger.debug("Cached full department tree")
    
    # Warm employee tree from CEO
    ceo = Employee.objects.filter(
        tenant=tenant,
        manager__isnull=True
    ).first()
    
    if ceo:
        service.get_employee_tree(ceo.id)
        logger.debug("Cached employee tree from CEO")
    
    # Warm org chart JSON
    service.generate_orgchart_json('department')
    service.generate_orgchart_json('employee')
    logger.debug("Cached org chart JSON")
    
    # Warm root department stats
    root_dept = Department.objects.filter(
        tenant=tenant,
        parent__isnull=True
    ).first()
    
    if root_dept:
        service.get_department_stats(root_dept.id)
        logger.debug("Cached root department stats")
    
    logger.info("Cache warming completed")

# Schedule with Celery
from celery import shared_task

@shared_task
def warm_all_tenant_caches():
    """Warm cache for all active tenants."""
    from apps.tenants.models import Tenant
    
    for tenant in Tenant.objects.filter(is_active=True):
        warm_orgchart_cache(tenant)
```

### Cache Performance Monitoring

```python
class CacheMonitor:
    """Monitor cache performance."""
    
    @staticmethod
    def get_cache_stats():
        """Get cache hit/miss statistics."""
        from django_redis import get_redis_connection
        conn = get_redis_connection("default")
        
        info = conn.info('stats')
        
        return {
            'keyspace_hits': info.get('keyspace_hits', 0),
            'keyspace_misses': info.get('keyspace_misses', 0),
            'hit_rate': calculate_hit_rate(
                info.get('keyspace_hits', 0),
                info.get('keyspace_misses', 0)
            ),
            'total_keys': conn.dbsize(),
            'memory_used': info.get('used_memory_human', 'N/A')
        }
    
    @staticmethod
    def get_orgchart_keys_count(tenant_id):
        """Count org chart cache keys for tenant."""
        from django_redis import get_redis_connection
        conn = get_redis_connection("default")
        
        pattern = f"orgchart:*:{tenant_id}:*"
        keys = conn.keys(pattern)
        
        return len(keys)

def calculate_hit_rate(hits, misses):
    """Calculate cache hit rate percentage."""
    total = hits + misses
    if total == 0:
        return 0.0
    return (hits / total) * 100
```

### Expected Outcome
- Redis-based caching implementation
- Significant performance improvement
- Automatic cache invalidation
- Cache warming capabilities
- Performance monitoring

### Verification Checklist
- [ ] orgchart_cache.py module created
- [ ] OrgChartCache class implemented
- [ ] Cache key patterns defined
- [ ] Get/set/invalidate methods added
- [ ] Cache decorator created
- [ ] Service methods integrated with caching
- [ ] Invalidation signals configured
- [ ] Cache warming implemented
- [ ] Performance monitoring added
- [ ] TTL configuration documented
- [ ] Comprehensive docstring added

---

## Summary

This document completed the advanced org chart features:

### Completed Features
- ✅ Department statistics with comprehensive metrics
- ✅ Flatten hierarchy for list displays
- ✅ Path to root for breadcrumb navigation
- ✅ Subtree queries for scoped operations
- ✅ Reporting chain for approval workflows
- ✅ Redis-based caching for performance

### Key Achievements
1. **Statistics** - Comprehensive department analytics
2. **Utilities** - Flexible hierarchy manipulation tools
3. **Performance** - Redis caching with strategic invalidation
4. **Integration** - Signal-based cache management
5. **Monitoring** - Cache performance tracking

### Performance Impact
- **Query Reduction:** 75-95% fewer database queries with caching
- **Response Time:** 10-50x faster for cached data
- **Scalability:** Support for large organizations (1000+ departments)
- **TTL Strategy:** Balanced freshness vs. performance

### Complete Group D Deliverables
All tasks (45-56) now complete:
- OrgChartService with 12 methods
- MPTT-optimized tree queries
- JSON generation for frontend
- Aggregation and statistics
- Utility methods for various use cases
- Comprehensive Redis caching

---

**Document Status:** ✅ Complete  
**Total Tasks:** 6  
**Estimated Time:** 2 hours 20 minutes  
**Total Group Time:** 5 hours 5 minutes (All 12 tasks)
