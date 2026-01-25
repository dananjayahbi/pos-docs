# Tasks 87-88: Layout Save and URL Routes

> **Phase:** 06 - ERP Advanced Modules  
> **SubPhase:** 13 - Dashboard KPIs  
> **Group:** F - API, Testing & Documentation  
> **Document:** 03 of 04  
> **Tasks Covered:** 87, 88

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [02_Tasks-85-86_ViewSet-All-KPIs.md](02_Tasks-85-86_ViewSet-All-KPIs.md)
- **→ Next Document:** [04_Tasks-89-90_Tests-Documentation.md](04_Tasks-89-90_Tests-Documentation.md)

---

## Document Overview

This document covers layout customization and URL routing for the dashboard module. Includes endpoints to save and retrieve user-specific dashboard layouts, and complete URL configuration for all dashboard endpoints.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 87 | Add save layout endpoint | Medium | 25 min |
| 88 | Add dashboard URL routes | Low | 15 min |

---

## Task 87: Add Save Layout Endpoint

### Overview
Add endpoint to save and retrieve user-specific dashboard layout configurations. This endpoint allows users to persist their widget arrangements and preferences.

### Dependencies
- Task 86: Add all KPIs endpoint

### Instructions

1. **Open dashboard.py view file**
   - Continue in `apps/dashboard/views/dashboard.py`
   - Locate DashboardViewSet class

2. **Import DashboardLayoutSerializer**
   - Import from serializers.layout module
   - Required for layout persistence

3. **Add layout action method**
   - Use @action decorator
   - detail=False, methods=['get', 'put']
   - url_path='layout'

4. **Implement GET handler**
   - Retrieve user's layout
   - Return default if none exists
   - Serialize layout data

5. **Implement PUT handler**
   - Accept widget configuration
   - Validate JSON structure
   - Create or update layout
   - Return saved configuration

6. **Add widget validation**
   - Verify KPI codes exist
   - Check position validity
   - Prevent widget overlaps (optional)

7. **Handle layout creation**
   - Check if user has existing layout
   - Create new if not exists
   - Update existing if present

8. **Add default layout generator**
   - Create method for default widgets
   - Based on user role
   - Return default configuration

9. **Add layout reset functionality**
   - Optional query parameter to reset
   - Restore default layout
   - Clear custom configuration

### Layout Endpoint Flow

```
GET /api/v1/dashboard/layout/
    │
    ▼
Retrieve User's Layout
    │
    ├─ Exists ──► Return Layout
    │
    └─ Not Exists ──► Generate Default ──► Return Default


PUT /api/v1/dashboard/layout/
    │
    ▼
Validate Widget Data
    │
    ├─ Invalid ──► Return 400 Error
    │
    └─ Valid ──► Create/Update Layout ──► Return Saved Layout
```

### Implementation Pattern

```python
@action(detail=False, methods=['get', 'put'], url_path='layout')
def layout(self, request):
    """
    Get or save user's dashboard layout configuration.
    
    GET: Retrieve current layout or default
    PUT: Save new layout configuration
    
    Query Parameters (GET):
    - reset: Reset to default layout (default: false)
    
    Request Body (PUT):
    {
      "widgets": [...]
    }
    
    Returns:
    - Layout configuration with widgets
    """
    if request.method == 'GET':
        return self._get_layout(request)
    elif request.method == 'PUT':
        return self._save_layout(request)

def _get_layout(self, request):
    """Retrieve user's layout or return default"""
    user = request.user
    reset = request.query_params.get('reset', 'false').lower() == 'true'
    
    if reset:
        # Delete existing layout
        DashboardLayout.objects.filter(user=user).delete()
    
    try:
        # Try to get existing layout
        layout = DashboardLayout.objects.get(user=user)
        serializer = DashboardLayoutSerializer(layout)
        return Response(serializer.data)
    except DashboardLayout.DoesNotExist:
        # Return default layout
        default_widgets = self._get_default_layout(request.user)
        return Response({
            'user': user.id,
            'widgets': default_widgets,
            'is_default': True
        })

def _save_layout(self, request):
    """Save or update user's layout"""
    user = request.user
    widgets_data = request.data.get('widgets', {})
    
    # Validate widgets
    validation_errors = self._validate_widgets(widgets_data)
    if validation_errors:
        return Response(
            {'errors': validation_errors},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    # Create or update layout
    layout, created = DashboardLayout.objects.update_or_create(
        user=user,
        defaults={'widgets': widgets_data}
    )
    
    serializer = DashboardLayoutSerializer(layout)
    
    return Response(
        serializer.data,
        status=status.HTTP_201_CREATED if created else status.HTTP_200_OK
    )
```

### Default Layout Generator

Generate role-specific default dashboard layouts.

#### Admin/Owner Default

```json
{
  "widgets": [
    {
      "id": "sales_today",
      "kpi_code": "SALES_TODAY",
      "widget_type": "NUMBER",
      "position": {"x": 0, "y": 0, "w": 3, "h": 1},
      "config": {"show_trend": true, "comparison": "yesterday"}
    },
    {
      "id": "orders_today",
      "kpi_code": "ORDERS_TODAY",
      "widget_type": "NUMBER",
      "position": {"x": 3, "y": 0, "w": 3, "h": 1},
      "config": {"show_trend": true}
    },
    {
      "id": "gross_profit",
      "kpi_code": "GROSS_PROFIT",
      "widget_type": "NUMBER",
      "position": {"x": 6, "y": 0, "w": 3, "h": 1},
      "config": {"show_trend": true}
    },
    {
      "id": "sales_trend",
      "kpi_code": "SALES_TREND_7D",
      "widget_type": "CHART",
      "position": {"x": 0, "y": 1, "w": 6, "h": 2},
      "config": {"chart_type": "line", "period": "week"}
    }
  ]
}
```

#### Manager Default

```json
{
  "widgets": [
    {
      "id": "sales_today",
      "kpi_code": "SALES_TODAY",
      "widget_type": "NUMBER",
      "position": {"x": 0, "y": 0, "w": 4, "h": 1},
      "config": {"show_trend": true}
    },
    {
      "id": "low_stock",
      "kpi_code": "LOW_STOCK_COUNT",
      "widget_type": "NUMBER",
      "position": {"x": 4, "y": 0, "w": 4, "h": 1},
      "config": {"show_threshold": true}
    },
    {
      "id": "top_products",
      "kpi_code": "TOP_SELLING_PRODUCTS",
      "widget_type": "TABLE",
      "position": {"x": 0, "y": 1, "w": 8, "h": 2},
      "config": {"max_rows": 10}
    }
  ]
}
```

#### Accountant Default

```json
{
  "widgets": [
    {
      "id": "revenue_mtd",
      "kpi_code": "REVENUE_MTD",
      "widget_type": "NUMBER",
      "position": {"x": 0, "y": 0, "w": 3, "h": 1},
      "config": {"show_trend": true}
    },
    {
      "id": "expenses_mtd",
      "kpi_code": "EXPENSES_MTD",
      "widget_type": "NUMBER",
      "position": {"x": 3, "y": 0, "w": 3, "h": 1},
      "config": {"show_trend": true}
    },
    {
      "id": "gross_profit",
      "kpi_code": "GROSS_PROFIT",
      "widget_type": "NUMBER",
      "position": {"x": 6, "y": 0, "w": 3, "h": 1},
      "config": {"show_margin": true}
    },
    {
      "id": "payment_methods",
      "kpi_code": "PAYMENT_METHODS_BREAKDOWN",
      "widget_type": "CHART",
      "position": {"x": 0, "y": 1, "w": 9, "h": 2},
      "config": {"chart_type": "pie"}
    }
  ]
}
```

#### Cashier Default

```json
{
  "widgets": [
    {
      "id": "sales_today",
      "kpi_code": "SALES_TODAY",
      "widget_type": "NUMBER",
      "position": {"x": 0, "y": 0, "w": 6, "h": 1},
      "config": {"show_trend": false}
    },
    {
      "id": "orders_today",
      "kpi_code": "ORDERS_TODAY",
      "widget_type": "NUMBER",
      "position": {"x": 6, "y": 0, "w": 6, "h": 1},
      "config": {"show_trend": false}
    }
  ]
}
```

### Widget Validation

```python
def _validate_widgets(self, widgets_data):
    """
    Validate widget configuration structure.
    
    Checks:
    - Required fields present
    - KPI codes valid
    - Positions valid
    - Widget types valid
    """
    errors = []
    
    if not isinstance(widgets_data, dict):
        return ["Invalid widgets data structure"]
    
    widgets = widgets_data.get('widgets', [])
    
    if not isinstance(widgets, list):
        return ["Widgets must be an array"]
    
    valid_widget_types = ['NUMBER', 'CHART', 'TABLE', 'GAUGE']
    widget_ids = set()
    
    for idx, widget in enumerate(widgets):
        # Check required fields
        required_fields = ['id', 'kpi_code', 'widget_type', 'position']
        for field in required_fields:
            if field not in widget:
                errors.append(f"Widget {idx}: Missing required field '{field}'")
        
        # Check duplicate IDs
        widget_id = widget.get('id')
        if widget_id in widget_ids:
            errors.append(f"Duplicate widget ID: {widget_id}")
        widget_ids.add(widget_id)
        
        # Validate widget type
        widget_type = widget.get('widget_type')
        if widget_type not in valid_widget_types:
            errors.append(
                f"Widget {widget_id}: Invalid widget type '{widget_type}'"
            )
        
        # Validate KPI code
        kpi_code = widget.get('kpi_code')
        if kpi_code:
            if not KPIDefinition.objects.filter(code=kpi_code).exists():
                errors.append(
                    f"Widget {widget_id}: Invalid KPI code '{kpi_code}'"
                )
        
        # Validate position
        position = widget.get('position', {})
        position_fields = ['x', 'y', 'w', 'h']
        for field in position_fields:
            if field not in position:
                errors.append(
                    f"Widget {widget_id}: Missing position field '{field}'"
                )
            elif not isinstance(position[field], int) or position[field] < 0:
                errors.append(
                    f"Widget {widget_id}: Invalid position value for '{field}'"
                )
    
    return errors
```

### GET Layout Response Example

```json
{
  "user": 42,
  "widgets": {
    "widgets": [
      {
        "id": "sales_today",
        "kpi_code": "SALES_TODAY",
        "widget_type": "NUMBER",
        "position": {"x": 0, "y": 0, "w": 3, "h": 1},
        "config": {"show_trend": true, "comparison": "yesterday"}
      }
    ]
  },
  "created_at": "2026-01-20T09:00:00Z",
  "updated_at": "2026-01-25T10:30:00Z",
  "is_default": false
}
```

### PUT Layout Request Example

```json
{
  "widgets": {
    "widgets": [
      {
        "id": "revenue_widget",
        "kpi_code": "REVENUE_MTD",
        "widget_type": "NUMBER",
        "position": {"x": 0, "y": 0, "w": 4, "h": 1},
        "config": {
          "show_trend": true,
          "show_percentage": true,
          "prefix": "LKR"
        }
      }
    ]
  }
}
```

### Validation Error Response Example

```json
{
  "errors": [
    "Widget 0: Missing required field 'position'",
    "Widget sales_invalid: Invalid KPI code 'INVALID_CODE'",
    "Duplicate widget ID: sales_today",
    "Widget chart_1: Invalid widget type 'INVALID_TYPE'"
  ]
}
```

### Expected Outcome
- Layout retrieval endpoint
- Layout save/update endpoint
- Default layout generation
- Widget validation
- Role-based defaults
- Layout reset functionality

### Verification Checklist
- [ ] layout() action added
- [ ] @action decorator configured for GET and PUT
- [ ] _get_layout() method implemented
- [ ] _save_layout() method implemented
- [ ] _get_default_layout() method created
- [ ] _validate_widgets() method implemented
- [ ] DashboardLayoutSerializer imported
- [ ] Role-based default layouts defined
- [ ] Widget validation comprehensive
- [ ] Layout reset functionality added
- [ ] Error handling for invalid data
- [ ] Create and update logic working

---

## Task 88: Add Dashboard URL Routes

### Overview
Configure URL routing for the Dashboard ViewSet, mapping all endpoints to their respective paths. This task connects the ViewSet to the Django URL configuration.

### Dependencies
- Task 87: Add save layout endpoint
- DashboardViewSet complete

### Instructions

1. **Create or open urls.py**
   - Navigate to `apps/dashboard/`
   - Create `urls.py` if not exists

2. **Import required modules**
   - Import Django path and include
   - Import DRF router
   - Import DashboardViewSet

3. **Create router instance**
   - Initialize DefaultRouter
   - Configure trailing slash setting

4. **Register DashboardViewSet**
   - Register with router
   - Set basename to 'dashboard'
   - No prefix needed (handled at project level)

5. **Define urlpatterns**
   - Include router.urls
   - Add any additional paths if needed

6. **Update project urls.py**
   - Include dashboard URLs in main project
   - Set prefix (e.g., 'api/v1/dashboard/')

7. **Add API versioning**
   - Consider API version in URL structure
   - Follow project URL conventions

8. **Document URL patterns**
   - Add comments explaining each endpoint
   - List all available paths

### URL Configuration File

```python
# apps/dashboard/urls.py
"""
Dashboard API URLs

Provides endpoints for:
- KPI retrieval (sales, inventory, financial, HR)
- Alert management
- Dashboard layout customization
"""

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import DashboardViewSet

# Create router
router = DefaultRouter()

# Register DashboardViewSet
# This creates the following endpoints:
# - GET /sales/ - Sales KPIs
# - GET /inventory/ - Inventory KPIs
# - GET /financial/ - Financial KPIs
# - GET /hr/ - HR KPIs
# - GET /alerts/ - Active alerts
# - GET /all/ - All KPIs combined
# - GET /layout/ - Get user layout
# - PUT /layout/ - Save user layout
router.register(r'', DashboardViewSet, basename='dashboard')

# URL patterns
urlpatterns = [
    path('', include(router.urls)),
]
```

### Project-Level URL Integration

```python
# config/urls.py (or main project urls.py)
"""
Main project URL configuration
"""

from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    
    # API v1
    path('api/v1/', include([
        # Dashboard endpoints
        path('dashboard/', include('apps.dashboard.urls')),
        
        # Other app endpoints
        path('pos/', include('apps.pos.urls')),
        path('inventory/', include('apps.inventory.urls')),
        # ... other apps
    ])),
]
```

### Complete Endpoint Mapping

| HTTP Method | Endpoint | ViewSet Action | Description |
|------------|----------|----------------|-------------|
| GET | `/api/v1/dashboard/sales/` | sales() | Sales KPIs |
| GET | `/api/v1/dashboard/inventory/` | inventory() | Inventory KPIs |
| GET | `/api/v1/dashboard/financial/` | financial() | Financial KPIs |
| GET | `/api/v1/dashboard/hr/` | hr() | HR KPIs |
| GET | `/api/v1/dashboard/alerts/` | alerts() | Active alerts |
| GET | `/api/v1/dashboard/all/` | all_kpis() | All KPIs combined |
| GET | `/api/v1/dashboard/layout/` | layout() | Get user layout |
| PUT | `/api/v1/dashboard/layout/` | layout() | Save user layout |

### Router Configuration Options

```python
# Option 1: DefaultRouter (recommended)
from rest_framework.routers import DefaultRouter
router = DefaultRouter()

# Option 2: SimpleRouter (no root view)
from rest_framework.routers import SimpleRouter
router = SimpleRouter()

# Option 3: Custom trailing slash
router = DefaultRouter(trailing_slash=False)
```

### URL Pattern Testing

```bash
# List all URL patterns
python manage.py show_urls

# Or use Django shell
python manage.py shell
from django.urls import get_resolver
resolver = get_resolver()
for pattern in resolver.url_patterns:
    print(pattern)

# Test specific URLs
from django.urls import reverse
reverse('dashboard-sales')
# Output: '/api/v1/dashboard/sales/'

reverse('dashboard-all-kpis')
# Output: '/api/v1/dashboard/all/'

reverse('dashboard-layout')
# Output: '/api/v1/dashboard/layout/'
```

### URL Namespace Configuration

```python
# apps/dashboard/urls.py with namespace
app_name = 'dashboard'

urlpatterns = [
    path('', include(router.urls)),
]

# Usage in code
from django.urls import reverse
url = reverse('dashboard:dashboard-sales')
```

### Query Parameter Documentation

| Endpoint | Parameter | Type | Description |
|----------|-----------|------|-------------|
| /sales/ | refresh | boolean | Force cache refresh |
| /inventory/ | category | string | Filter by category |
| /inventory/ | warehouse | string | Filter by warehouse |
| /financial/ | period | string | month/quarter/year |
| /alerts/ | severity | string | Filter by severity |
| /alerts/ | category | string | Filter by KPI category |
| /all/ | refresh | boolean | Force cache refresh |
| /layout/ | reset | boolean | Reset to default layout |

### URL Testing Script

```python
# test_dashboard_urls.py
"""Test script to verify all dashboard URLs"""

from django.test import TestCase
from django.urls import reverse, resolve

class DashboardURLTests(TestCase):
    def test_sales_url(self):
        url = reverse('dashboard-sales')
        self.assertEqual(url, '/api/v1/dashboard/sales/')
        
        resolver = resolve(url)
        self.assertEqual(resolver.view_name, 'dashboard-sales')
    
    def test_inventory_url(self):
        url = reverse('dashboard-inventory')
        self.assertEqual(url, '/api/v1/dashboard/inventory/')
    
    def test_financial_url(self):
        url = reverse('dashboard-financial')
        self.assertEqual(url, '/api/v1/dashboard/financial/')
    
    def test_hr_url(self):
        url = reverse('dashboard-hr')
        self.assertEqual(url, '/api/v1/dashboard/hr/')
    
    def test_alerts_url(self):
        url = reverse('dashboard-alerts')
        self.assertEqual(url, '/api/v1/dashboard/alerts/')
    
    def test_all_kpis_url(self):
        url = reverse('dashboard-all-kpis')
        self.assertEqual(url, '/api/v1/dashboard/all/')
    
    def test_layout_url(self):
        url = reverse('dashboard-layout')
        self.assertEqual(url, '/api/v1/dashboard/layout/')
```

### CORS Configuration (if needed)

```python
# If dashboard is accessed from different frontend domain
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",  # React dev server
    "http://localhost:8080",  # Vue dev server
    "https://dashboard.lankacommerce.lk",  # Production
]

CORS_ALLOW_METHODS = [
    'GET',
    'PUT',
    'OPTIONS',
]

CORS_ALLOW_HEADERS = [
    'accept',
    'accept-encoding',
    'authorization',
    'content-type',
    'dnt',
    'origin',
    'user-agent',
    'x-csrftoken',
    'x-requested-with',
]
```

### API Documentation URL

```python
# Add API documentation endpoint
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView

urlpatterns = [
    # Dashboard API
    path('api/v1/dashboard/', include('apps.dashboard.urls')),
    
    # API Schema
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    
    # Swagger UI
    path('api/docs/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
]
```

### Expected Outcome
- Complete URL routing configured
- All endpoints accessible
- Proper URL naming
- Integration with project URLs
- API versioning in place

### Verification Checklist
- [ ] urls.py created in dashboard app
- [ ] DefaultRouter imported and initialized
- [ ] DashboardViewSet registered
- [ ] urlpatterns defined
- [ ] Dashboard URLs included in project urls.py
- [ ] API versioning applied
- [ ] All endpoints accessible
- [ ] URL patterns tested
- [ ] Query parameters documented
- [ ] CORS configured if needed
- [ ] API documentation URL added

---

## Summary

This document completed layout customization and URL routing:

### Completed Infrastructure
- ✅ Layout save/load endpoints
- ✅ Role-based default layouts
- ✅ Widget validation
- ✅ Complete URL routing configuration
- ✅ API versioning structure

### Key Achievements
1. **User Customization** - Save and retrieve personal dashboard layouts
2. **Default Layouts** - Role-specific starting configurations
3. **Validation** - Comprehensive widget and position validation
4. **URL Structure** - Clean, RESTful URL patterns
5. **Integration** - Complete API routing setup

### Next Steps
Proceed to [04_Tasks-89-90_Tests-Documentation.md](04_Tasks-89-90_Tests-Documentation.md) to implement comprehensive testing and API documentation.

---

**Document Status:** ✅ Complete  
**Total Tasks:** 2  
**Total Lines:** ~710
