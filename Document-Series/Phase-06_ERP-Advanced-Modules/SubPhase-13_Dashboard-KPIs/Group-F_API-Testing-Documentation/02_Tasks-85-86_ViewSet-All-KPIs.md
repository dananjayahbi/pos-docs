# Tasks 85-86: ViewSet and All KPIs Endpoint

> **Phase:** 06 - ERP Advanced Modules  
> **SubPhase:** 13 - Dashboard KPIs  
> **Group:** F - API, Testing & Documentation  
> **Document:** 02 of 04  
> **Tasks Covered:** 85, 86

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-81-84_Layout-Model-Serializers.md](01_Tasks-81-84_Layout-Model-Serializers.md)
- **→ Next Document:** [03_Tasks-87-88_Layout-Save-Routes.md](03_Tasks-87-88_Layout-Save-Routes.md)

---

## Document Overview

This document covers the core API implementation for the dashboard module, including the DashboardViewSet with individual KPI category endpoints and the combined all-KPIs endpoint for efficient data retrieval.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 85 | Create DashboardViewSet | High | 45 min |
| 86 | Add all KPIs endpoint | Medium | 30 min |

---

## Task 85: Create DashboardViewSet

### Overview
Create the DashboardViewSet to handle all dashboard API endpoints. This ViewSet combines KPI retrieval, layout management, and alert access in a unified API interface.

### Dependencies
- Task 84: Create dashboard serializers
- KPI calculators implemented
- Alert models exist

### Instructions

1. **Create views directory**
   - Create `views/` directory in dashboard app if not exists
   - Create `__init__.py` file

2. **Create dashboard.py view file**
   - Create file at `apps/dashboard/views/dashboard.py`
   - Import necessary DRF components

3. **Import required modules**
   - Import ViewSet, action from rest_framework
   - Import serializers
   - Import KPI calculator services
   - Import permission classes
   - Import cache utilities

4. **Define DashboardViewSet class**
   - Inherit from ViewSet (not ModelViewSet)
   - Add class docstring explaining endpoints

5. **Configure permissions**
   - Set permission_classes (IsAuthenticated, TenantPermission)
   - Verify user has dashboard access

6. **Add get_serializer_class method**
   - Return appropriate serializer per action
   - Map actions to serializers

7. **Implement list method**
   - Placeholder or redirect to all KPIs
   - Return dashboard overview

8. **Add sales KPI action**
   - @action decorator with GET method
   - Retrieve sales KPI data
   - Use SalesKPICalculator
   - Apply caching

9. **Add inventory KPI action**
   - @action for inventory metrics
   - Use InventoryKPICalculator
   - Include alert thresholds

10. **Add financial KPI action**
    - @action for financial data
    - Use FinancialKPICalculator
    - Format currency values

11. **Add HR KPI action**
    - @action for HR metrics
    - Use HRKPICalculator
    - Include attendance data

12. **Add alerts action**
    - @action for active alerts
    - Query KPIAlert model
    - Filter by active status

13. **Update views/__init__.py**
    - Import DashboardViewSet
    - Add to __all__ list

### ViewSet Structure

```
DashboardViewSet
├── sales() - GET /dashboard/sales/
├── inventory() - GET /dashboard/inventory/
├── financial() - GET /dashboard/financial/
├── hr() - GET /dashboard/hr/
├── alerts() - GET /dashboard/alerts/
├── all_kpis() - GET /dashboard/all/ (Task 86)
├── layout() - GET /dashboard/layout/ (Task 87)
└── save_layout() - PUT /dashboard/layout/ (Task 87)
```

### ViewSet Method Patterns

```python
@action(detail=False, methods=['get'])
def sales(self, request):
    """Retrieve sales KPIs"""
    # Get tenant
    # Check cache
    # Calculate KPIs
    # Serialize data
    # Return response
```

### Sales KPI Action Implementation

Retrieve sales KPIs including today, MTD, and 7-day trend.

**Query Parameters:**
- refresh: Force cache refresh (default: false)

**Returns:**
- Sales metrics with comparisons and trends

**Implementation Flow:**
1. Get tenant from request
2. Check cache with tenant-specific key
3. Return cached data if available
4. Calculate KPIs using SalesKPICalculator
5. Serialize data
6. Cache for 5 minutes
7. Return response

### Inventory KPI Action Implementation

Retrieve inventory KPIs including stock levels and alerts.

**Query Parameters:**
- category: Filter by product category
- warehouse: Filter by warehouse

**Returns:**
- Inventory metrics with alert thresholds

**Implementation Flow:**
1. Get tenant and filter parameters
2. Check cache with filters in key
3. Calculate using InventoryKPICalculator
4. Include threshold values
5. Cache for 5 minutes
6. Return response

### Financial KPI Action Implementation

Retrieve financial KPIs including revenue, expenses, and profit.

**Query Parameters:**
- period: Month, quarter, year (default: month)

**Returns:**
- Financial metrics with trend analysis

**Implementation Flow:**
1. Get tenant and period parameter
2. Check cache
3. Calculate using FinancialKPICalculator
4. Format currency values (LKR)
5. Cache for 10 minutes (longer for financial data)
6. Return response

### HR KPI Action Implementation

Retrieve HR KPIs including employees, attendance, and payroll.

**Permissions:**
- Requires HR or Admin role

**Returns:**
- HR metrics with attendance rates

**Implementation Flow:**
1. Check user has HR permissions
2. Return 403 if unauthorized
3. Get tenant
4. Check cache
5. Calculate using HRKPICalculator
6. Cache for 5 minutes
7. Return response

### Alerts Action Implementation

Retrieve active KPI alerts.

**Query Parameters:**
- severity: Filter by severity (INFO, WARNING, CRITICAL)
- category: Filter by KPI category

**Returns:**
- List of active alerts

**Implementation Flow:**
1. Get tenant
2. Query KPIAlert model
3. Filter by active status
4. Apply severity filter if provided
5. Apply category filter if provided
6. Order by severity and date
7. Serialize and return

### Caching Strategy

| Endpoint | Cache Duration | Cache Key Pattern |
|----------|---------------|-------------------|
| /sales/ | 5 minutes | `dashboard_sales_{tenant_id}` |
| /inventory/ | 5 minutes | `dashboard_inventory_{tenant_id}_{filters}` |
| /financial/ | 10 minutes | `dashboard_financial_{tenant_id}_{period}` |
| /hr/ | 5 minutes | `dashboard_hr_{tenant_id}` |
| /alerts/ | No cache | - (real-time) |

### Permission Matrix

| Endpoint | Required Permission | Role Access |
|----------|-------------------|-------------|
| /sales/ | dashboard.view_sales | All users |
| /inventory/ | dashboard.view_inventory | Manager+ |
| /financial/ | dashboard.view_financial | Accountant, Admin |
| /hr/ | hr.view_dashboard | HR, Admin |
| /alerts/ | dashboard.view_alerts | All users |

### Error Handling Pattern

```python
try:
    calculator = SalesKPICalculator(tenant)
    data = calculator.get_all_sales_kpis()
except CalculationError as e:
    return Response(
        {"error": f"KPI calculation failed: {str(e)}"},
        status=status.HTTP_500_INTERNAL_SERVER_ERROR
    )
except Exception as e:
    logger.error(f"Dashboard error: {str(e)}")
    return Response(
        {"error": "An unexpected error occurred"},
        status=status.HTTP_500_INTERNAL_SERVER_ERROR
    )
```

### Expected Outcome
- Functional DashboardViewSet
- Individual KPI category endpoints
- Alert retrieval endpoint
- Proper caching implementation
- Permission-based access control
- Error handling

### Verification Checklist
- [ ] views/ directory created
- [ ] dashboard.py file created
- [ ] DashboardViewSet class defined
- [ ] Permissions configured
- [ ] sales() action implemented
- [ ] inventory() action implemented
- [ ] financial() action implemented
- [ ] hr() action implemented
- [ ] alerts() action implemented
- [ ] Caching applied
- [ ] Error handling added
- [ ] __init__.py imports configured

---

## Task 86: Add All KPIs Endpoint

### Overview
Add a combined endpoint that returns all KPI categories in a single response. This endpoint reduces API calls and provides a complete dashboard snapshot for frontend applications.

### Dependencies
- Task 85: Create DashboardViewSet

### Instructions

1. **Open dashboard.py view file**
   - Navigate to `apps/dashboard/views/dashboard.py`
   - Locate DashboardViewSet class

2. **Import AllKPIsSerializer**
   - Import from serializers.kpi module
   - Required for response serialization

3. **Add all_kpis action method**
   - Use @action decorator
   - detail=False, methods=['get']
   - url_path='all'

4. **Retrieve tenant**
   - Get tenant from request
   - Verify tenant access

5. **Check global cache**
   - Build cache key for all KPIs
   - Check if cached data exists
   - Return cached if available and not stale

6. **Calculate sales KPIs**
   - Initialize SalesKPICalculator
   - Get all sales metrics
   - Handle calculation errors

7. **Calculate inventory KPIs**
   - Initialize InventoryKPICalculator
   - Get inventory metrics
   - Include alert thresholds

8. **Calculate financial KPIs**
   - Initialize FinancialKPICalculator
   - Get financial metrics
   - Apply currency formatting

9. **Calculate HR KPIs**
   - Check user has HR permissions
   - Initialize HRKPICalculator if permitted
   - Get HR metrics or return empty

10. **Retrieve active alerts**
    - Query KPIAlert model
    - Filter by tenant and active status
    - Limit to recent alerts (e.g., last 20)

11. **Combine all data**
    - Build combined dictionary
    - Include all KPI categories
    - Add alerts array
    - Add metadata (timestamp, tenant)

12. **Serialize response**
    - Use AllKPIsSerializer
    - Validate data structure

13. **Cache combined response**
    - Cache for appropriate duration (3-5 minutes)
    - Store in cache with tenant-specific key

14. **Return response**
    - Return serialized data
    - Include cache metadata

### All KPIs Endpoint Flow

```
Request: GET /api/v1/dashboard/all/
    │
    ▼
Check Cache
    │
    ├─ Hit  ──► Return Cached Data
    │
    └─ Miss ──► Calculate All KPIs
                    │
                    ├── Sales KPIs
                    ├── Inventory KPIs
                    ├── Financial KPIs
                    ├── HR KPIs (if permitted)
                    └── Active Alerts
                    │
                    ▼
                Combine Data
                    │
                    ▼
                Serialize
                    │
                    ▼
                Cache Result
                    │
                    ▼
                Return Response
```

### Implementation Pattern

```python
@action(detail=False, methods=['get'], url_path='all')
def all_kpis(self, request):
    """
    Retrieve all KPIs and alerts in a single response.
    
    This endpoint combines sales, inventory, financial, and HR KPIs
    along with active alerts to provide a complete dashboard snapshot.
    
    Query Parameters:
    - refresh: Force cache refresh (default: false)
    
    Returns:
    - Combined KPI data with metadata
    """
    # Step 1: Get tenant
    tenant = request.tenant
    
    # Step 2: Check cache
    cache_key = f'dashboard_all_kpis_{tenant.id}'
    refresh = request.query_params.get('refresh', 'false').lower() == 'true'
    
    if not refresh:
        cached_data = cache.get(cache_key)
        if cached_data:
            return Response(cached_data)
    
    # Step 3: Calculate all KPIs
    try:
        # Sales KPIs
        sales_calculator = SalesKPICalculator(tenant)
        sales_data = sales_calculator.get_all_sales_kpis()
        
        # Inventory KPIs
        inventory_calculator = InventoryKPICalculator(tenant)
        inventory_data = inventory_calculator.get_inventory_kpis()
        
        # Financial KPIs
        financial_calculator = FinancialKPICalculator(tenant)
        financial_data = financial_calculator.get_financial_kpis()
        
        # HR KPIs (permission-based)
        hr_data = {}
        if request.user.has_perm('hr.view_dashboard'):
            hr_calculator = HRKPICalculator(tenant)
            hr_data = hr_calculator.get_hr_kpis()
        
        # Active Alerts
        alerts = KPIAlert.objects.filter(
            tenant=tenant,
            is_active=True
        ).order_by('-severity', '-triggered_at')[:20]
        
        # Step 4: Combine data
        combined_data = {
            'sales': sales_data,
            'inventory': inventory_data,
            'financial': financial_data,
            'hr': hr_data,
            'alerts': AlertSerializer(alerts, many=True).data,
            'metadata': {
                'last_updated': timezone.now(),
                'tenant': tenant.name,
                'cache_hit': False
            }
        }
        
        # Step 5: Serialize
        serializer = AllKPIsSerializer(combined_data)
        
        # Step 6: Cache for 3 minutes
        cache.set(cache_key, serializer.data, 180)
        
        # Step 7: Return
        return Response(serializer.data)
        
    except Exception as e:
        logger.error(f"All KPIs calculation error: {str(e)}")
        return Response(
            {"error": "Failed to retrieve dashboard data"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
```

### Complete Response Structure

```json
{
  "sales": {
    "today": {
      "code": "SALES_TODAY",
      "label": "Sales Today",
      "value": 245000.00,
      "unit": "LKR",
      "trend": {
        "direction": "up",
        "percentage": 12.5
      }
    },
    "mtd": {},
    "trend_7d": []
  },
  "inventory": {
    "low_stock_count": {},
    "out_of_stock_count": {},
    "stock_value": {},
    "top_selling": []
  },
  "financial": {
    "revenue_mtd": {},
    "expenses_mtd": {},
    "gross_profit": {},
    "payment_methods": []
  },
  "hr": {
    "active_employees": {},
    "attendance_rate": {},
    "leave_requests": {},
    "payroll_mtd": {}
  },
  "alerts": [
    {
      "id": 123,
      "kpi_code": "LOW_STOCK_COUNT",
      "severity": "WARNING",
      "title": "Low Stock Alert",
      "message": "15 products below minimum",
      "triggered_at": "2026-01-25T08:30:00Z"
    }
  ],
  "metadata": {
    "last_updated": "2026-01-25T10:30:00Z",
    "tenant": "lankacommerce_retail",
    "cache_hit": false,
    "permissions": {
      "can_view_hr": true,
      "can_view_financial": true
    }
  }
}
```

### Performance Optimization

| Strategy | Implementation | Benefit |
|----------|---------------|---------|
| Combined cache | Single cache key for all KPIs | Reduces cache lookups |
| Parallel calculation | Calculate KPIs concurrently (optional) | Faster response time |
| Selective loading | Load only permitted categories | Reduces computation |
| Alert limit | Return only recent 20 alerts | Smaller payload |
| Eager loading | Use select_related/prefetch_related | Fewer queries |

### Cache Invalidation Triggers

| Event | Action | Cache Keys to Clear |
|-------|--------|-------------------|
| New sale | Clear sales cache | `dashboard_sales_*`, `dashboard_all_kpis_*` |
| Stock update | Clear inventory cache | `dashboard_inventory_*`, `dashboard_all_kpis_*` |
| Payment received | Clear financial cache | `dashboard_financial_*`, `dashboard_all_kpis_*` |
| Employee update | Clear HR cache | `dashboard_hr_*`, `dashboard_all_kpis_*` |
| Alert created | No cache clear | Alerts not cached |

### Role-Based Response Filtering

```python
# Modify combined_data based on user role
if request.user.role == 'CASHIER':
    # Cashiers see only sales
    combined_data = {
        'sales': sales_data,
        'inventory': {},
        'financial': {},
        'hr': {},
        'alerts': []
    }
elif request.user.role == 'ACCOUNTANT':
    # Accountants see sales and financial
    combined_data = {
        'sales': sales_data,
        'inventory': {},
        'financial': financial_data,
        'hr': {},
        'alerts': alerts_data
    }
# ... other roles
```

### Error Handling by Category

```python
# Handle individual calculator failures gracefully
kpi_data = {}

try:
    kpi_data['sales'] = sales_calculator.get_all_sales_kpis()
except CalculationError:
    kpi_data['sales'] = {'error': 'Sales data temporarily unavailable'}

try:
    kpi_data['inventory'] = inventory_calculator.get_inventory_kpis()
except CalculationError:
    kpi_data['inventory'] = {'error': 'Inventory data temporarily unavailable'}

# Continue for other categories
```

### Sri Lankan Context Examples

#### Retail Store Dashboard
All KPIs focused on daily operations and inventory management.

#### Restaurant Dashboard
Sales trends, inventory (food items), and HR (staff schedules).

#### Wholesale Business Dashboard
High-volume sales, bulk inventory tracking, and payment methods.

### Expected Outcome
- Single endpoint for all dashboard data
- Combined KPI categories
- Included active alerts
- Efficient caching strategy
- Role-based filtering
- Graceful error handling

### Verification Checklist
- [ ] all_kpis() action added
- [ ] @action decorator configured
- [ ] Tenant retrieval implemented
- [ ] Cache check implemented
- [ ] Sales KPIs calculated
- [ ] Inventory KPIs calculated
- [ ] Financial KPIs calculated
- [ ] HR KPIs calculated (with permissions)
- [ ] Alerts retrieved
- [ ] Data combined correctly
- [ ] AllKPIsSerializer used
- [ ] Response cached
- [ ] Error handling added
- [ ] Metadata included

---

## Summary

This document implemented the core API infrastructure:

### Completed Infrastructure
- ✅ Complete DashboardViewSet
- ✅ Individual KPI category endpoints
- ✅ Combined all-KPIs endpoint
- ✅ Efficient caching strategy
- ✅ Permission-based access control

### Key Achievements
1. **Unified API** - Single ViewSet for all dashboard operations
2. **Individual Endpoints** - Granular KPI category access
3. **Combined Endpoint** - Efficient all-KPIs response
4. **Caching** - Strategic caching for performance
5. **Security** - Role-based access control

### Next Steps
Proceed to [03_Tasks-87-88_Layout-Save-Routes.md](03_Tasks-87-88_Layout-Save-Routes.md) to implement layout save/load endpoints and URL routing.

---

**Document Status:** ✅ Complete  
**Total Tasks:** 2  
**Total Lines:** ~675
