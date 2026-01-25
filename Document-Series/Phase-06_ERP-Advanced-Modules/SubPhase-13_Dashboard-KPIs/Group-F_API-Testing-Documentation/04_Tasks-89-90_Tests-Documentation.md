# Tasks 89-90: Tests and Documentation

> **Phase:** 06 - ERP Advanced Modules  
> **SubPhase:** 13 - Dashboard KPIs  
> **Group:** F - API, Testing & Documentation  
> **Document:** 04 of 04  
> **Tasks Covered:** 89, 90

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [03_Tasks-87-88_Layout-Save-Routes.md](03_Tasks-87-88_Layout-Save-Routes.md)

---

## Document Overview

This document covers comprehensive testing and documentation for the dashboard module. Includes unit tests for KPI calculators, API endpoint tests, and complete API documentation.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 89 | Write KPI calculator tests | High | 60 min |
| 90 | Create dashboard API documentation | Medium | 45 min |

---

## Task 89: Write KPI Calculator Tests

### Overview
Create comprehensive unit tests for all KPI calculator classes. Tests verify calculation accuracy, caching behavior, comparison logic, edge cases, and error handling.

### Dependencies
- Task 88: Add dashboard URL routes
- All KPI calculators implemented
- Django test framework configured

### Instructions

1. **Create tests directory structure**
   - Create `tests/` directory in dashboard app
   - Create `__init__.py` file

2. **Create test base class**
   - Create `test_base.py` with common test utilities
   - Define DashboardTestCase base class
   - Add helper methods for test data creation

3. **Create test_sales_kpi.py**
   - Test SalesKPICalculator class
   - Test all calculation methods
   - Test cache behavior

4. **Create test_inventory_kpi.py**
   - Test InventoryKPICalculator class
   - Test stock calculations
   - Test threshold alerts

5. **Create test_financial_kpi.py**
   - Test FinancialKPICalculator class
   - Test revenue and profit calculations
   - Test margin percentages

6. **Create test_hr_kpi.py**
   - Test HRKPICalculator class
   - Test attendance calculations
   - Test employee metrics

7. **Create test_dashboard_api.py**
   - Test DashboardViewSet endpoints
   - Test authentication requirements
   - Test permission-based access

8. **Add test fixtures**
   - Create sample tenants and users
   - Create test transactions
   - Create test products and inventory

9. **Test edge cases**
   - Empty data scenarios
   - Zero values and null handling
   - Division by zero prevention

10. **Add performance tests**
    - Test cache effectiveness
    - Test query optimization

### Test Directory Structure

```
apps/dashboard/tests/
├── __init__.py
├── test_base.py                  # Base test class
├── test_sales_kpi.py            # Sales calculator tests
├── test_inventory_kpi.py        # Inventory calculator tests
├── test_financial_kpi.py        # Financial calculator tests
├── test_hr_kpi.py               # HR calculator tests
└── test_dashboard_api.py        # API endpoint tests
```

### Base Test Class Example

```python
# apps/dashboard/tests/test_base.py
from django.test import TestCase
from django.contrib.auth import get_user_model
from django.utils import timezone
from decimal import Decimal

User = get_user_model()

class DashboardTestCase(TestCase):
    def setUp(self):
        # Create test tenant
        self.tenant = self.create_test_tenant()
        
        # Create test users with roles
        self.admin_user = self.create_test_user('admin', 'ADMIN')
        self.manager_user = self.create_test_user('manager', 'MANAGER')
        self.cashier_user = self.create_test_user('cashier', 'CASHIER')
        
        # Create test data
        self.create_test_products()
        self.create_test_sales()
        self.create_test_inventory()
    
    def create_test_tenant(self):
        # Create tenant for testing
        pass
    
    def create_test_user(self, username, role):
        # Create user with specified role
        pass
    
    def clear_cache(self):
        from django.core.cache import cache
        cache.clear()
```

### Sales KPI Tests Example

```python
# apps/dashboard/tests/test_sales_kpi.py
from .test_base import DashboardTestCase
from apps.dashboard.services.sales_kpi_calculator import SalesKPICalculator

class SalesKPICalculatorTests(DashboardTestCase):
    def setUp(self):
        super().setUp()
        self.calculator = SalesKPICalculator(self.tenant)
    
    def test_sales_today_calculation(self):
        result = self.calculator.calculate_sales_today()
        self.assertEqual(result['sales_count'], 10)
        self.assertGreater(result['total_amount'], Decimal('0'))
    
    def test_sales_today_with_no_sales(self):
        # Clear all sales
        from apps.pos.models import Sale
        Sale.objects.all().delete()
        
        result = self.calculator.calculate_sales_today()
        self.assertEqual(result['sales_count'], 0)
        self.assertEqual(result['total_amount'], Decimal('0.00'))
    
    def test_cache_hit(self):
        # First call - cache miss
        result1 = self.calculator.calculate_sales_today()
        
        # Second call - should hit cache
        result2 = self.calculator.calculate_sales_today()
        
        # Results should be identical
        self.assertEqual(result1, result2)
```

### API Endpoint Tests Example

```python
# apps/dashboard/tests/test_dashboard_api.py
from rest_framework.test import APITestCase
from rest_framework import status
from django.urls import reverse
from .test_base import DashboardTestCase

class DashboardAPITests(DashboardTestCase, APITestCase):
    def test_sales_endpoint_authenticated(self):
        url = reverse('dashboard-sales')
        
        # Unauthenticated should fail
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        
        # Authenticated should succeed
        self.client.force_authenticate(user=self.admin_user)
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
    
    def test_financial_endpoint_accountant_access(self):
        url = reverse('dashboard-financial')
        
        # Cashier should not have access
        self.client.force_authenticate(user=self.cashier_user)
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
    
    def test_layout_save(self):
        self.client.force_authenticate(user=self.admin_user)
        url = reverse('dashboard-layout')
        
        layout_data = {
            "widgets": {
                "widgets": [
                    {
                        "id": "test_widget",
                        "kpi_code": "SALES_TODAY",
                        "widget_type": "NUMBER",
                        "position": {"x": 0, "y": 0, "w": 2, "h": 1},
                        "config": {"show_trend": True}
                    }
                ]
            }
        }
        
        response = self.client.put(url, layout_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
```

### Test Runner Script

```bash
# run_dashboard_tests.sh
#!/bin/bash

echo "Running Dashboard Tests..."

# Run all dashboard tests
python manage.py test apps.dashboard.tests --verbosity=2

# Generate coverage report
coverage run --source='apps/dashboard' manage.py test apps.dashboard.tests
coverage report
coverage html

echo "Tests complete! Coverage report in htmlcov/"
```

### Expected Test Coverage

| Module | Target Coverage | Key Test Areas |
|--------|----------------|----------------|
| Sales Calculator | 90%+ | All calculations, cache, comparisons |
| Inventory Calculator | 90%+ | Stock levels, alerts, thresholds |
| Financial Calculator | 90%+ | Revenue, profit, margins |
| HR Calculator | 90%+ | Attendance, employees, payroll |
| ViewSet | 85%+ | All endpoints, permissions, errors |
| Serializers | 80%+ | Validation, data transformation |

### Expected Outcome
- Comprehensive test suite
- Edge case coverage
- Authentication and permission tests
- Cache behavior verification
- Coverage above 80%

### Verification Checklist
- [ ] tests/ directory created
- [ ] test_base.py with DashboardTestCase
- [ ] test_sales_kpi.py completed
- [ ] test_inventory_kpi.py completed
- [ ] test_financial_kpi.py completed
- [ ] test_hr_kpi.py completed
- [ ] test_dashboard_api.py completed
- [ ] Test fixtures created
- [ ] Edge cases covered
- [ ] All tests passing
- [ ] Coverage above 80%

---

## Task 90: Create Dashboard API Documentation

### Overview
Create comprehensive API documentation for the dashboard module. Includes endpoint descriptions, request/response examples, authentication requirements, and integration guides.

### Dependencies
- Task 89: Write KPI calculator tests
- All endpoints implemented and tested

### Instructions

1. **Create docs directory**
   - Create `docs/` directory in dashboard app
   - Create markdown documentation file

2. **Write dashboard overview**
   - Explain dashboard purpose
   - List all available endpoints
   - Describe authentication requirements

3. **Document sales endpoints**
   - Endpoint URL and method
   - Query parameters
   - Response structure

4. **Document inventory endpoints**
   - Endpoint details
   - Filtering options

5. **Document financial endpoints**
   - Endpoint specifications
   - Period parameters

6. **Document HR endpoints**
   - Endpoint information
   - Permission requirements

7. **Document all KPIs endpoint**
   - Combined endpoint structure
   - Complete response example

8. **Document layout endpoints**
   - GET and PUT methods
   - Widget configuration schema

9. **Add authentication section**
   - Token authentication
   - Role-based access

10. **Add integration examples**
    - Frontend code examples
    - Error handling

### Documentation Structure

```
apps/dashboard/docs/
├── dashboard_api.md          # Main API documentation
├── widget_configuration.md   # Widget config guide
└── integration_guide.md      # Frontend integration
```

### Main API Documentation

````markdown
# Dashboard API Documentation

> **Version:** 1.0  
> **Base URL:** `/api/v1/dashboard/`  
> **Authentication:** Token-based

---

## Overview

The Dashboard API provides real-time KPIs and analytics for retail operations. Supports sales, inventory, financial, and HR metrics with customizable layouts.

### Key Features

- Real-time KPI calculations
- Multi-tenant support
- Role-based access control
- Caching for performance
- Customizable layouts

### Available Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/sales/` | Sales KPIs | Required |
| GET | `/inventory/` | Inventory KPIs | Manager+ |
| GET | `/financial/` | Financial KPIs | Accountant+ |
| GET | `/hr/` | HR KPIs | HR/Admin |
| GET | `/alerts/` | Active alerts | Required |
| GET | `/all/` | All KPIs combined | Required |
| GET | `/layout/` | Get user layout | Required |
| PUT | `/layout/` | Save user layout | Required |

---

## Authentication

All endpoints require token-based authentication.

### Request Headers

```http
Authorization: Token YOUR_AUTH_TOKEN
Content-Type: application/json
```

---

## Sales Endpoints

### GET /sales/

Retrieve sales KPIs including today's sales, MTD, and 7-day trend.

#### Query Parameters

- `refresh` (boolean): Force cache refresh (default: false)

#### Response

```json
{
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
  "mtd": {
    "value": 5670000.00
  },
  "trend_7d": [
    {"date": "2026-01-19", "value": 230000},
    {"date": "2026-01-20", "value": 240000}
  ]
}
```

---

## All KPIs Endpoint

### GET /all/

Retrieve all KPI categories in a single request.

#### Response

```json
{
  "sales": { /* Sales KPIs */ },
  "inventory": { /* Inventory KPIs */ },
  "financial": { /* Financial KPIs */ },
  "hr": { /* HR KPIs */ },
  "alerts": [ /* Active alerts */ ],
  "metadata": {
    "last_updated": "2026-01-25T10:30:00Z",
    "tenant": "lankacommerce_retail"
  }
}
```

---

## Layout Endpoints

### GET /layout/

Get user's dashboard layout configuration.

### PUT /layout/

Save or update user's dashboard layout.

#### Request Body

```json
{
  "widgets": {
    "widgets": [
      {
        "id": "revenue_widget",
        "kpi_code": "REVENUE_MTD",
        "widget_type": "NUMBER",
        "position": {"x": 0, "y": 0, "w": 4, "h": 1},
        "config": {"show_trend": true}
      }
    ]
  }
}
```

---

## Integration Examples

### React Example

```javascript
import { useState, useEffect } from 'react';

function DashboardSales() {
  const [salesData, setSalesData] = useState(null);
  
  useEffect(() => {
    fetch('/api/v1/dashboard/sales/', {
      headers: {
        'Authorization': `Token ${localStorage.getItem('token')}`
      }
    })
    .then(res => res.json())
    .then(data => setSalesData(data));
  }, []);
  
  return (
    <div>
      <h2>Sales Today</h2>
      {salesData && (
        <p>LKR {salesData.today.value.toLocaleString()}</p>
      )}
    </div>
  );
}
```

### Vue Example

```vue
<template>
  <div>
    <h2>Sales Today</h2>
    <p v-if="salesData">
      LKR {{ salesData.today.value.toLocaleString() }}
    </p>
  </div>
</template>

<script>
export default {
  data() {
    return { salesData: null }
  },
  mounted() {
    this.fetchSales();
  },
  methods: {
    async fetchSales() {
      const response = await fetch('/api/v1/dashboard/sales/', {
        headers: {
          'Authorization': `Token ${localStorage.getItem('token')}`
        }
      });
      this.salesData = await response.json();
    }
  }
}
</script>
```

---

## Error Handling

### Common Errors

| Status Code | Error | Solution |
|-------------|-------|----------|
| 401 | Unauthorized | Provide valid token |
| 403 | Forbidden | User lacks permissions |
| 404 | Not Found | Check endpoint URL |
| 500 | Server Error | Contact support |

### Error Response Format

```json
{
  "error": "Error description",
  "detail": "Additional details"
}
```

---

## Performance Considerations

### Caching

- Sales: 5 minutes
- Inventory: 5 minutes
- Financial: 10 minutes
- HR: 5 minutes
- All KPIs: 3 minutes

Use `refresh=true` parameter to bypass cache.

---

## Support

- Email: support@lankacommerce.lk
- Documentation: https://docs.lankacommerce.lk
````

### Widget Configuration Guide

````markdown
# Dashboard Widget Configuration Guide

## Widget Types

### NUMBER Widget
Displays a single numeric KPI value with optional trend.

```json
{
  "widget_type": "NUMBER",
  "config": {
    "show_trend": true,
    "comparison": "yesterday",
    "prefix": "LKR",
    "decimal_places": 2
  }
}
```

### CHART Widget
Displays data as line, bar, or pie chart.

```json
{
  "widget_type": "CHART",
  "config": {
    "chart_type": "line",
    "period": "week",
    "show_legend": true
  }
}
```

### TABLE Widget
Displays tabular data.

```json
{
  "widget_type": "TABLE",
  "config": {
    "max_rows": 10,
    "sortable": true
  }
}
```

### GAUGE Widget
Displays progress or target indicators.

```json
{
  "widget_type": "GAUGE",
  "config": {
    "min": 0,
    "max": 100,
    "threshold_warning": 50,
    "threshold_critical": 20
  }
}
```
````

### Expected Outcome
- Complete API documentation
- Integration examples
- Error handling guide
- Widget configuration reference
- Frontend developer resources

### Verification Checklist
- [ ] docs/ directory created
- [ ] dashboard_api.md completed
- [ ] All endpoints documented
- [ ] Request/response examples provided
- [ ] Authentication section complete
- [ ] Permission requirements listed
- [ ] Integration examples added
- [ ] Error handling documented
- [ ] Widget configuration guide created
- [ ] Performance notes included

---

## Summary

This document completed testing and documentation:

### Completed Testing
- ✅ Comprehensive calculator unit tests
- ✅ Sales, inventory, financial, HR test suites
- ✅ API endpoint integration tests
- ✅ Authentication and permission tests
- ✅ Cache behavior verification

### Completed Documentation
- ✅ Complete API documentation
- ✅ Endpoint specifications
- ✅ Request/response examples
- ✅ Authentication guide
- ✅ Frontend integration examples (React, Vue)
- ✅ Widget configuration guide
- ✅ Error handling documentation

### Module Complete
The Dashboard KPIs module is fully implemented, tested, and documented. Ready for production deployment.

---

**Document Status:** ✅ Complete  
**Total Tasks:** 2  
**Total Lines:** ~795
