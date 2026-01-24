# Tasks 88-90: URLs, Tests, and Documentation

> **Phase:** 06 - ERP Advanced Modules  
> **SubPhase:** 04 - Leave Management  
> **Group:** F - API, Testing & Documentation  
> **Document:** 02 of 02  
> **Tasks Covered:** 88, 89, 90

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-81-87_Serializers-ViewSets.md](01_Tasks-81-87_Serializers-ViewSets.md)

---

## Document Overview

This document covers the final components of the Leave Management API: URL registration, comprehensive testing, and module documentation. These elements complete the API implementation and ensure the module is well-tested, documented, and ready for production use.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 88 | Register Leave API URLs | Low | 20 min |
| 89 | Create Leave Module Tests | High | 45 min |
| 90 | Create Leave Documentation | Medium | 35 min |

---

## Task 88: Register Leave API URLs

### Overview
Configure URL routing for all Leave Management API endpoints. This task sets up the DRF router, registers all viewsets, and defines the complete API URL structure. It includes configuring nested routes, custom action URLs, and integration with the main API URL configuration.

### Dependencies
- Task 85: Create LeaveTypeViewSet
- Task 86: Create LeaveRequestViewSet
- Task 87: Create HolidayViewSet
- Django REST Framework router
- Main API URLs configuration exists

### Instructions

1. **Create urls.py file**
   - Create file at `apps/leave/urls.py`
   - Import necessary DRF router components

2. **Import required modules**
   - Import DefaultRouter from rest_framework.routers
   - Import all viewsets (LeaveTypeViewSet, LeaveRequestViewSet, HolidayViewSet)
   - Import path, include from django.urls

3. **Create router instance**
   - Instantiate DefaultRouter
   - Set app_name for namespacing
   - Configure trailing slash settings if needed

4. **Register LeaveTypeViewSet**
   - Register with router
   - Set basename to 'leave-type'
   - URL prefix: 'types'
   - Results in: /api/v1/leave/types/

5. **Register LeaveRequestViewSet**
   - Register with router
   - Set basename to 'leave-request'
   - URL prefix: 'requests'
   - Results in: /api/v1/leave/requests/

6. **Register HolidayViewSet**
   - Register with router
   - Set basename to 'holiday'
   - URL prefix: 'holidays'
   - Results in: /api/v1/leave/holidays/

7. **Add additional URL patterns**
   - Add any custom URL patterns not handled by router
   - Add calendar views if needed
   - Add dashboard endpoint if needed

8. **Create urlpatterns list**
   - Include router URLs
   - Add custom patterns
   - Add API documentation URLs if applicable

9. **Update main API urls.py**
   - Navigate to main API urls configuration
   - Import leave URLs
   - Include at appropriate path: path('leave/', include('apps.leave.urls'))

10. **Add URL namespace**
    - Set app_name = 'leave'
    - Allows reverse URL lookup with namespace

### URL Structure Overview

```
┌─────────────────────────────────────────────────┐
│         Leave Management API URLs               │
├─────────────────────────────────────────────────┤
│ Base Path: /api/v1/leave/                       │
│                                                 │
│ Leave Types:                                    │
│  • GET    /types/                               │
│  • POST   /types/                               │
│  • GET    /types/{id}/                          │
│  • PUT    /types/{id}/                          │
│  • PATCH  /types/{id}/                          │
│  • DELETE /types/{id}/                          │
│  • POST   /types/{id}/activate/                 │
│  • POST   /types/{id}/deactivate/               │
│  • GET    /types/{id}/usage/                    │
│                                                 │
│ Leave Requests:                                 │
│  • GET    /requests/                            │
│  • POST   /requests/                            │
│  • GET    /requests/{id}/                       │
│  • PUT    /requests/{id}/                       │
│  • PATCH  /requests/{id}/                       │
│  • DELETE /requests/{id}/                       │
│  • POST   /requests/{id}/submit/                │
│  • POST   /requests/{id}/approve/               │
│  • POST   /requests/{id}/reject/                │
│  • POST   /requests/{id}/cancel/                │
│  • POST   /requests/{id}/recall/                │
│  • GET    /requests/pending/                    │
│  • GET    /requests/team/                       │
│  • GET    /requests/calendar/                   │
│  • GET    /requests/{id}/history/               │
│                                                 │
│ Holidays:                                       │
│  • GET    /holidays/                            │
│  • POST   /holidays/                            │
│  • GET    /holidays/{id}/                       │
│  • PUT    /holidays/{id}/                       │
│  • PATCH  /holidays/{id}/                       │
│  • DELETE /holidays/{id}/                       │
│  • GET    /holidays/calendar/                   │
│  • GET    /holidays/upcoming/                   │
│  • GET    /holidays/year/{year}/                │
│  • GET    /holidays/check/                      │
│                                                 │
│ Balances:                                       │
│  • GET    /balances/                            │
│  • GET    /balances/{employee_id}/              │
│  • GET    /balances/summary/                    │
│                                                 │
│ Reports:                                        │
│  • GET    /reports/balance-summary/             │
│  • GET    /reports/history/{id}/                │
│  • GET    /reports/department/{id}/             │
│  • GET    /reports/expiring/                    │
│  • GET    /reports/export/                      │
└─────────────────────────────────────────────────┘
```

### Router Configuration

```
Router Registration Pattern
══════════════════════════

router = DefaultRouter()

router.register(
    prefix='types',
    viewset=LeaveTypeViewSet,
    basename='leave-type'
)

router.register(
    prefix='requests',
    viewset=LeaveRequestViewSet,
    basename='leave-request'
)

router.register(
    prefix='holidays',
    viewset=HolidayViewSet,
    basename='holiday'
)

urlpatterns = [
    path('', include(router.urls)),
    # Additional custom URLs here
]
```

### URL Naming Conventions

| Viewset | Basename | Action | URL Name | Example Reverse |
|---------|----------|--------|----------|-----------------|
| LeaveTypeViewSet | leave-type | list | leave:leave-type-list | reverse('leave:leave-type-list') |
| LeaveTypeViewSet | leave-type | detail | leave:leave-type-detail | reverse('leave:leave-type-detail', args=[id]) |
| LeaveTypeViewSet | leave-type | activate | leave:leave-type-activate | reverse('leave:leave-type-activate', args=[id]) |
| LeaveRequestViewSet | leave-request | list | leave:leave-request-list | reverse('leave:leave-request-list') |
| LeaveRequestViewSet | leave-request | submit | leave:leave-request-submit | reverse('leave:leave-request-submit', args=[id]) |
| HolidayViewSet | holiday | list | leave:holiday-list | reverse('leave:holiday-list') |

### Custom URL Patterns

If needed for views not handled by viewsets:

```
Additional URL Patterns
═════════════════════

Balance Views:
  path('balances/', BalanceListView.as_view(), name='balance-list')
  path('balances/<uuid:employee_id>/', BalanceDetailView.as_view(), name='balance-detail')
  path('balances/summary/', BalanceSummaryView.as_view(), name='balance-summary')

Report Views:
  path('reports/balance-summary/', BalanceSummaryReportView.as_view())
  path('reports/history/<uuid:employee_id>/', LeaveHistoryReportView.as_view())
  path('reports/department/<uuid:dept_id>/', DepartmentReportView.as_view())
  path('reports/expiring/', ExpiringLeavesReportView.as_view())
  path('reports/export/', ExportReportView.as_view())

Dashboard:
  path('dashboard/', DashboardView.as_view(), name='dashboard')

Calendar:
  path('calendar/', CalendarView.as_view(), name='calendar')
  path('calendar/team/', TeamCalendarView.as_view(), name='team-calendar')
  path('calendar/department/<uuid:dept_id>/', DepartmentCalendarView.as_view())
```

### Integration with Main API

```
Main API urls.py Configuration
══════════════════════════════

# In project/urls.py or api/urls.py
from django.urls import path, include

urlpatterns = [
    path('api/v1/', include([
        path('auth/', include('apps.accounts.urls')),
        path('employees/', include('apps.employees.urls')),
        path('leave/', include('apps.leave.urls')),
        # Other app URLs
    ])),
]
```

### API Versioning Considerations

```
Version-Aware URL Structure
═══════════════════════════

If implementing API versioning:

v1 URLs: /api/v1/leave/...
v2 URLs: /api/v2/leave/...

Configure router per version:
  apps/leave/urls_v1.py
  apps/leave/urls_v2.py

Or use URL versioning in viewsets
```

### Expected Outcome
- All Leave API endpoints properly routed
- RESTful URL structure
- Proper URL naming for reverse lookups
- Integration with main API URLs
- Support for custom actions

### Verification Checklist
- [ ] urls.py file created in apps/leave/
- [ ] DefaultRouter instantiated
- [ ] LeaveTypeViewSet registered
- [ ] LeaveRequestViewSet registered
- [ ] HolidayViewSet registered
- [ ] app_name set for namespace
- [ ] urlpatterns list created
- [ ] Custom URL patterns added if needed
- [ ] Leave URLs included in main API urls
- [ ] URL reversing works correctly
- [ ] All custom actions accessible
- [ ] API documentation reflects URL structure

---

## Task 89: Create Leave Module Tests

### Overview
Create comprehensive test suite for the Leave Management module. This includes unit tests for models, service layer tests, workflow tests, API endpoint tests, and integration tests. The test suite ensures all functionality works correctly and catches regressions.

### Dependencies
- All Leave models exist
- All Leave services exist
- All Leave viewsets exist
- Task 88: Register Leave API URLs
- pytest and pytest-django installed
- factory_boy for test data

### Instructions

1. **Create tests directory structure**
   - Navigate to `apps/leave/` directory
   - Create `tests/` directory
   - Create `__init__.py` in tests directory

2. **Create conftest.py**
   - Create file at `apps/leave/tests/conftest.py`
   - Define pytest fixtures
   - Include: authenticated clients, test users, test employees

3. **Create factories.py**
   - Create file at `apps/leave/tests/factories.py`
   - Define factory_boy factories for all models
   - Include: LeaveTypeFactory, LeaveBalanceFactory, LeaveRequestFactory, HolidayFactory

4. **Create test_models.py**
   - Test LeaveType model methods
   - Test LeaveBalance calculations
   - Test LeaveRequest validation
   - Test Holiday model methods
   - Test model constraints and validators

5. **Create test_services.py**
   - Test LeaveAccrualService
   - Test LeaveBalanceService
   - Test CalendarService (working days)
   - Test overlap detection
   - Test balance deduction/restoration

6. **Create test_workflow.py**
   - Test leave request submission
   - Test approval workflow
   - Test rejection workflow
   - Test cancellation workflow
   - Test recall workflow
   - Test state transitions
   - Test notification triggers

7. **Create test_permissions.py**
   - Test owner permissions
   - Test manager permissions
   - Test HR/admin permissions
   - Test action-specific permissions

8. **Create test_api_leave_types.py**
   - Test LeaveType CRUD operations
   - Test filtering and searching
   - Test activate/deactivate actions
   - Test usage statistics endpoint
   - Test permission enforcement

9. **Create test_api_leave_requests.py**
   - Test leave request creation
   - Test leave request listing (own/team)
   - Test workflow actions via API
   - Test pending approvals endpoint
   - Test calendar endpoint
   - Test filtering and date range queries

10. **Create test_api_holidays.py**
    - Test holiday CRUD operations
    - Test calendar view
    - Test upcoming holidays endpoint
    - Test date checking
    - Test year view

11. **Create test_api_balances.py**
    - Test balance listing
    - Test balance summary
    - Test balance calculations
    - Test accrual processing

12. **Create test_integration.py**
    - Test complete leave request flow
    - Test accrual + request + approval flow
    - Test overlap scenarios
    - Test carry forward process
    - Test holiday impact on working days

13. **Create test_sri_lanka_compliance.py**
    - Test Sri Lankan holidays
    - Test statutory leave entitlements
    - Test local business rules
    - Test cultural considerations

14. **Add test documentation**
    - Add docstrings to all test classes
    - Document test scenarios
    - Add comments for complex test logic

### Test Structure Overview

```
┌─────────────────────────────────────────────────┐
│         Leave Module Test Suite                 │
├─────────────────────────────────────────────────┤
│ Test Files:                                     │
│  • conftest.py - Fixtures & configuration       │
│  • factories.py - Test data factories           │
│  • test_models.py - Model tests                 │
│  • test_services.py - Service layer tests       │
│  • test_workflow.py - Workflow tests            │
│  • test_permissions.py - Permission tests       │
│  • test_api_leave_types.py - LeaveType API      │
│  • test_api_leave_requests.py - Request API     │
│  • test_api_holidays.py - Holiday API           │
│  • test_api_balances.py - Balance API           │
│  • test_integration.py - Integration tests      │
│  • test_sri_lanka_compliance.py - Local tests   │
│                                                 │
│ Test Categories:                                │
│  • Unit Tests - Individual components           │
│  • Service Tests - Business logic               │
│  • API Tests - Endpoint functionality           │
│  • Workflow Tests - State transitions           │
│  • Permission Tests - Access control            │
│  • Integration Tests - End-to-end flows         │
│  • Compliance Tests - Sri Lankan requirements   │
└─────────────────────────────────────────────────┘
```

### Test Fixtures (conftest.py)

```
Common Test Fixtures
═══════════════════

@pytest.fixture
def authenticated_client(client, test_user)
  └─ Returns API client with authenticated user

@pytest.fixture
def admin_client(client, admin_user)
  └─ Returns API client with admin user

@pytest.fixture
def manager_client(client, manager_user)
  └─ Returns API client with manager user

@pytest.fixture
def test_employee(db)
  └─ Creates test employee instance

@pytest.fixture
def test_leave_type(db)
  └─ Creates test leave type (Annual Leave)

@pytest.fixture
def test_leave_balance(db, test_employee, test_leave_type)
  └─ Creates leave balance with available days

@pytest.fixture
def test_holiday(db)
  └─ Creates test public holiday

@pytest.fixture
def current_year()
  └─ Returns current year for date calculations
```

### Factory Examples

```
Factory Patterns
═══════════════

LeaveTypeFactory:
  └─ Creates LeaveType with sensible defaults
  └─ Supports custom category, days, rules
  └─ Uses Faker for realistic data

LeaveBalanceFactory:
  └─ Creates balance with associated employee and leave type
  └─ Calculates available_days automatically
  └─ Supports custom year, opening balance

LeaveRequestFactory:
  └─ Creates request with valid date range
  └─ Associates with employee, leave type
  └─ Supports various statuses (DRAFT, PENDING, APPROVED)

HolidayFactory:
  └─ Creates holiday with date in current year
  └─ Supports different types (PUBLIC, RELIGIOUS, etc.)
  └─ Avoids duplicate dates
```

### Model Test Examples

```
Model Test Categories
════════════════════

LeaveType Tests:
✓ Test code uniqueness
✓ Test default values
✓ Test carry forward validation
✓ Test gender applicability
✓ Test is_active filtering
✓ Test __str__ representation

LeaveBalance Tests:
✓ Test available_days calculation
✓ Test balance deduction
✓ Test balance restoration
✓ Test insufficient balance detection
✓ Test carry forward logic
✓ Test year rollover

LeaveRequest Tests:
✓ Test total_days calculation
✓ Test half-day logic
✓ Test overlap detection
✓ Test status transitions
✓ Test validation rules
✓ Test date range validation

Holiday Tests:
✓ Test date uniqueness
✓ Test applicability logic
✓ Test recurring holidays
✓ Test is_upcoming property
✓ Test days_until calculation
```

### Service Test Examples

```
Service Test Categories
══════════════════════

LeaveAccrualService Tests:
✓ Accrue annual leave correctly
✓ Handle pro-rated accrual for mid-year joiners
✓ Process carry forward from previous year
✓ Handle accrual for different leave types
✓ Respect service month requirements

LeaveBalanceService Tests:
✓ Check sufficient balance
✓ Deduct balance on approval
✓ Restore balance on cancellation
✓ Handle pending balance correctly
✓ Calculate available balance accurately

CalendarService Tests:
✓ Calculate working days correctly
✓ Exclude weekends
✓ Exclude holidays
✓ Handle half-day calculations
✓ Sri Lankan weekend (Saturday-Sunday)
```

### Workflow Test Examples

```
Workflow Test Scenarios
══════════════════════

Submit Workflow:
✓ Submit draft request → status becomes PENDING
✓ Cannot submit without sufficient balance
✓ Cannot submit with overlapping dates
✓ Cannot submit if notice period not met
✓ Notification sent to manager on submit

Approve Workflow:
✓ Manager can approve pending request
✓ Balance deducted on approval
✓ Status changes to APPROVED
✓ Employee notified on approval
✓ Cannot approve own request

Reject Workflow:
✓ Manager can reject with reason
✓ Reason is required for rejection
✓ Status changes to REJECTED
✓ Balance not deducted
✓ Employee notified with reason

Cancel Workflow:
✓ Employee can cancel own request
✓ Can cancel PENDING request
✓ Can cancel APPROVED request (before start)
✓ Cannot cancel APPROVED request (after start)
✓ Balance restored on cancellation

Recall Workflow:
✓ Employee can recall within recall period
✓ Balance restored on recall
✓ Status changes back to DRAFT
✓ Cannot recall after recall period expires
✓ Manager notified on recall
```

### API Test Examples

```
API Test Scenarios
═════════════════

LeaveType API:
✓ List returns active leave types
✓ Create requires admin permission
✓ Update requires admin permission
✓ Delete/deactivate requires admin permission
✓ Filtering by category works
✓ Search by name/code works
✓ Usage statistics returns correct count

LeaveRequest API:
✓ List returns own requests for employee
✓ List returns team requests for manager
✓ Create request with valid data succeeds
✓ Create without balance fails
✓ Submit action changes status to PENDING
✓ Approve action requires manager permission
✓ Reject requires reason
✓ Calendar returns correct date range
✓ Pending approvals shows only pending for manager
✓ Filtering by status works
✓ Filtering by date range works

Holiday API:
✓ List returns all holidays
✓ Create requires admin permission
✓ Update requires admin permission
✓ Calendar view groups by month
✓ Upcoming returns next 90 days
✓ Check endpoint identifies holidays
✓ Filtering by year works
```

### Integration Test Examples

```
Integration Test Flows
═════════════════════

Complete Leave Request Flow:
1. Create employee with leave balance
2. Create leave request (DRAFT)
3. Submit request (PENDING)
4. Manager approves (APPROVED)
5. Verify balance deducted
6. Verify notifications sent
7. Verify request appears in calendar

Accrual to Request Flow:
1. Run accrual for employee
2. Verify balance credited
3. Create and submit leave request
4. Approve request
5. Verify balance correctly deducted
6. Verify available balance accurate

Overlap Prevention:
1. Create approved leave request
2. Attempt to create overlapping request
3. Verify overlap error raised
4. Verify first request unaffected

Holiday Impact:
1. Create holiday on specific date
2. Create leave request including holiday
3. Verify working days exclude holiday
4. Verify total_days calculated correctly

Carry Forward Process:
1. Create balance with unused days
2. Run year-end carry forward
3. Verify carried days in new year balance
4. Verify expiry date set correctly
5. Process expiry after deadline
```

### Permission Test Matrix

```
Permission Test Coverage
═══════════════════════

Action: List Leave Types
├─ Employee: ✓ Can list active types
├─ Manager: ✓ Can list all types
├─ Admin: ✓ Can list all types
└─ Unauthenticated: ✗ Denied

Action: Create Leave Type
├─ Employee: ✗ Denied
├─ Manager: ✗ Denied
├─ Admin: ✓ Allowed
└─ HR: ✓ Allowed

Action: Approve Leave Request
├─ Owner: ✗ Cannot approve own
├─ Manager (of employee): ✓ Can approve
├─ Manager (other dept): ✗ Denied
├─ Admin: ✓ Can approve any
└─ HR: ✓ Can approve any

Action: Cancel Leave Request
├─ Owner (DRAFT): ✓ Can cancel
├─ Owner (PENDING): ✓ Can cancel
├─ Owner (APPROVED, before start): ✓ Can cancel
├─ Owner (APPROVED, after start): ✗ Cannot cancel
└─ Manager: ✗ Cannot cancel
```

### Sri Lankan Compliance Tests

```
Local Compliance Tests
═════════════════════

Statutory Leave Entitlements:
✓ Annual Leave: 14 days minimum (Sri Lankan labor law)
✓ Casual Leave: 7 days typical
✓ Medical Leave: 21 days typical
✓ Maternity Leave: 84 days (12 weeks)
✓ Paternity Leave: 3 days

Public Holidays:
✓ All Poya Days recognized (12 per year)
✓ Independence Day (Feb 4)
✓ Sinhala & Tamil New Year (Apr 13-14)
✓ May Day (May 1)
✓ Other religious holidays (Vesak, Deepavali, etc.)

Weekend Handling:
✓ Weekend is Saturday-Sunday
✓ Friday is working day (not like some countries)
✓ Working days exclude weekends correctly

Cultural Considerations:
✓ Support for Sinhala, Tamil, English names
✓ Buddhist, Hindu, Christian, Muslim holidays
✓ Multi-cultural holiday calendar
```

### Test Execution Commands

```
Running Tests
════════════

All Leave Tests:
  pytest apps/leave/tests/

Specific Test File:
  pytest apps/leave/tests/test_api_leave_requests.py

Specific Test Class:
  pytest apps/leave/tests/test_workflow.py::TestApprovalWorkflow

Specific Test Method:
  pytest apps/leave/tests/test_workflow.py::TestApprovalWorkflow::test_manager_can_approve

With Coverage:
  pytest apps/leave/tests/ --cov=apps.leave --cov-report=html

Verbose Output:
  pytest apps/leave/tests/ -v

Failed Tests Only:
  pytest apps/leave/tests/ --lf

Parallel Execution:
  pytest apps/leave/tests/ -n auto
```

### Expected Test Coverage

| Component | Target Coverage | Priority |
|-----------|----------------|----------|
| Models | 95%+ | High |
| Services | 90%+ | High |
| Workflow | 95%+ | Critical |
| API Endpoints | 85%+ | High |
| Permissions | 90%+ | Critical |
| Validation | 95%+ | Critical |

### Expected Outcome
- Comprehensive test suite covering all functionality
- Unit tests for models and services
- API tests for all endpoints
- Workflow tests for state transitions
- Permission tests for access control
- Integration tests for complete flows
- Sri Lankan compliance tests
- High test coverage (85%+)

### Verification Checklist
- [ ] tests/ directory created
- [ ] conftest.py with fixtures
- [ ] factories.py with all factories
- [ ] test_models.py created
- [ ] test_services.py created
- [ ] test_workflow.py created
- [ ] test_permissions.py created
- [ ] test_api_leave_types.py created
- [ ] test_api_leave_requests.py created
- [ ] test_api_holidays.py created
- [ ] test_api_balances.py created
- [ ] test_integration.py created
- [ ] test_sri_lanka_compliance.py created
- [ ] All tests pass
- [ ] Test coverage above 85%
- [ ] No flaky tests
- [ ] Tests run in CI/CD pipeline

---

## Task 90: Create Leave Documentation

### Overview
Create comprehensive documentation for the Leave Management module. This documentation includes module overview, configuration guide, API reference, user guides for employees and managers, Sri Lankan compliance notes, and troubleshooting information. The documentation should be clear, complete, and maintainable.

### Dependencies
- All Leave functionality complete
- Task 88: Register Leave API URLs
- API endpoints are functional

### Instructions

1. **Create docs directory**
   - Navigate to `apps/leave/` directory
   - Create `docs/` directory
   - Create documentation structure

2. **Create README.md**
   - Main documentation entry point
   - Include module overview
   - Link to all other documentation

3. **Create API_REFERENCE.md**
   - Document all API endpoints
   - Include request/response examples
   - Document query parameters
   - List error responses
   - Include authentication requirements

4. **Create CONFIGURATION.md**
   - Document leave type configuration
   - Document leave policy settings
   - Document accrual configuration
   - Document carry forward rules
   - Document notification settings

5. **Create USER_GUIDE.md**
   - Employee guide for requesting leave
   - Manager guide for approving leave
   - HR guide for configuration
   - Screenshots or diagrams where helpful

6. **Create WORKFLOW.md**
   - Document leave request workflow
   - State transition diagram
   - Approval process
   - Cancellation and recall processes
   - Notification flow

7. **Create BALANCE_MANAGEMENT.md**
   - Document balance accrual
   - Document carry forward process
   - Document balance calculations
   - Document expiry rules

8. **Create HOLIDAY_CALENDAR.md**
   - Document holiday management
   - List Sri Lankan public holidays
   - Document department-specific holidays
   - Document recurring holidays

9. **Create SRI_LANKA_COMPLIANCE.md**
   - Document statutory leave entitlements
   - Document labor law requirements
   - Document public holiday observances
   - Document cultural considerations

10. **Create TROUBLESHOOTING.md**
    - Common issues and solutions
    - Error messages and fixes
    - FAQ section
    - Support contact information

11. **Create CHANGELOG.md**
    - Version history
    - Feature additions
    - Bug fixes
    - Breaking changes

12. **Create installation/setup guide**
    - Add INSTALLATION.md
    - Document dependencies
    - Document database migrations
    - Document initial data setup

13. **Add code documentation**
    - Ensure all models have docstrings
    - Ensure all services have docstrings
    - Ensure all viewsets have docstrings
    - Document complex business logic

14. **Generate API schema**
    - Use DRF's schema generation
    - Generate OpenAPI/Swagger documentation
    - Include schema in documentation

### Documentation Structure

```
┌─────────────────────────────────────────────────┐
│         Leave Module Documentation              │
├─────────────────────────────────────────────────┤
│ docs/                                           │
│  ├── README.md                                  │
│  │   └── Module overview & quick start          │
│  │                                              │
│  ├── API_REFERENCE.md                           │
│  │   └── Complete API endpoint documentation    │
│  │                                              │
│  ├── CONFIGURATION.md                           │
│  │   └── Configuration & setup guide            │
│  │                                              │
│  ├── USER_GUIDE.md                              │
│  │   ├── Employee guide                         │
│  │   ├── Manager guide                          │
│  │   └── HR admin guide                         │
│  │                                              │
│  ├── WORKFLOW.md                                │
│  │   └── Leave request workflow details         │
│  │                                              │
│  ├── BALANCE_MANAGEMENT.md                      │
│  │   └── Balance accrual & management           │
│  │                                              │
│  ├── HOLIDAY_CALENDAR.md                        │
│  │   └── Holiday management & calendar          │
│  │                                              │
│  ├── SRI_LANKA_COMPLIANCE.md                    │
│  │   └── Local compliance requirements          │
│  │                                              │
│  ├── TROUBLESHOOTING.md                         │
│  │   └── Common issues & solutions              │
│  │                                              │
│  ├── CHANGELOG.md                               │
│  │   └── Version history                        │
│  │                                              │
│  └── INSTALLATION.md                            │
│      └── Installation & setup                   │
└─────────────────────────────────────────────────┘
```

### README.md Structure

```markdown
# Leave Management Module

## Overview
Brief description of the module purpose and features.

## Features
- Leave type configuration
- Leave request workflow
- Balance management and accrual
- Holiday calendar
- Multi-level approval
- Sri Lankan compliance

## Quick Start
Quick steps to get started using the module.

## Documentation
Links to all documentation sections:
- [API Reference](API_REFERENCE.md)
- [Configuration Guide](CONFIGURATION.md)
- [User Guide](USER_GUIDE.md)
- [Workflow Documentation](WORKFLOW.md)
- [Balance Management](BALANCE_MANAGEMENT.md)
- [Holiday Calendar](HOLIDAY_CALENDAR.md)
- [Sri Lanka Compliance](SRI_LANKA_COMPLIANCE.md)
- [Troubleshooting](TROUBLESHOOTING.md)
- [Installation](INSTALLATION.md)

## Requirements
- Django 4.2+
- Django REST Framework 3.14+
- PostgreSQL 14+
- Python 3.11+

## License
Project license information
```

### API Reference Structure

```markdown
# Leave Management API Reference

## Base URL
`/api/v1/leave/`

## Authentication
All endpoints require authentication via JWT token.

## Leave Types

### List Leave Types
**GET** `/api/v1/leave/types/`

Returns list of all leave types.

**Query Parameters:**
- `is_active` (boolean) - Filter by active status
- `category` (string) - Filter by category
- `search` (string) - Search by name or code
- `ordering` (string) - Order results

**Response:**
[Include full response example with JSON]

**Error Responses:**
- 401: Unauthorized
- 403: Forbidden

### Create Leave Type
[Document each endpoint similarly]

## Leave Requests

### Create Leave Request
[Full documentation]

### Submit Leave Request
[Full documentation]

### Approve Leave Request
[Full documentation]

[Continue for all endpoints...]
```

### Configuration Guide Structure

```markdown
# Leave Management Configuration Guide

## Initial Setup

### 1. Configure Leave Types
Instructions for setting up leave types:
- Annual Leave
- Casual Leave
- Medical Leave
- Maternity Leave
- Paternity Leave
- No-Pay Leave

### 2. Configure Leave Policies
- Default days per year
- Carry forward rules
- Accrual frequency
- Service requirements

### 3. Configure Approvers
- Manager hierarchy
- Approval chains
- Delegation settings

### 4. Configure Notifications
- Email templates
- Notification triggers
- Recipients

### 5. Configure Holidays
- Import Sri Lankan public holidays
- Add company holidays
- Configure department holidays

## Leave Type Configuration

### Annual Leave Example
[Detailed configuration with screenshots/examples]

### Medical Leave Example
[Detailed configuration]

[Continue for all leave types...]
```

### User Guide Structure

```markdown
# Leave Management User Guide

## For Employees

### Requesting Leave

#### Step 1: Check Your Balance
[Instructions with screenshots]

#### Step 2: Create Leave Request
[Instructions]

#### Step 3: Submit Request
[Instructions]

#### Step 4: Track Request Status
[Instructions]

### Cancelling Leave
[Instructions]

### Viewing Leave History
[Instructions]

## For Managers

### Viewing Pending Approvals
[Instructions]

### Approving Leave Requests
[Instructions]

### Rejecting Leave Requests
[Instructions]

### Viewing Team Calendar
[Instructions]

## For HR Administrators

### Managing Leave Types
[Instructions]

### Configuring Policies
[Instructions]

### Running Accrual
[Instructions]

### Managing Carry Forward
[Instructions]

### Generating Reports
[Instructions]
```

### Workflow Documentation

```markdown
# Leave Request Workflow

## Overview
Description of the leave request workflow.

## State Diagram
[Include ASCII or image diagram of state transitions]

## Workflow States

### DRAFT
- Initial state when request is created
- Employee can edit or delete
- Not visible to manager
- No balance impact

### PENDING
- State after submission
- Awaiting manager approval
- Employee cannot edit
- Balance marked as pending

### APPROVED
- Manager has approved
- Balance deducted
- Leave is confirmed
- Can be cancelled before start date

### REJECTED
- Manager has rejected with reason
- Balance released
- Employee can create new request

### CANCELLED
- Employee or manager cancelled
- Balance restored
- Cannot be uncancelled

### RECALLED
- Employee recalled approved request
- Balance restored
- Returns to DRAFT state

## Workflow Actions

### Submit
[Detailed documentation]

### Approve
[Detailed documentation]

### Reject
[Detailed documentation]

### Cancel
[Detailed documentation]

### Recall
[Detailed documentation]

## Notifications
[Document when notifications are sent and to whom]
```

### Sri Lankan Compliance Documentation

```markdown
# Sri Lankan Labor Law Compliance

## Statutory Leave Entitlements

### Annual Leave
- **Minimum:** 14 days per year
- **Basis:** Shops and Office Employees Act
- **Eligibility:** After 180 days continuous service
- **Accrual:** Can be monthly or annual
- **Carry Forward:** Typically allowed

### Casual Leave
- **Typical:** 7 days per year
- **Purpose:** Short-term absences
- **Notice:** Usually minimal notice
- **Accumulation:** May not carry forward

### Medical Leave
- **Typical:** 21 days per year
- **Documentation:** Medical certificate required
- **Purpose:** Illness or injury
- **Payment:** Full pay typically

### Maternity Leave
- **Duration:** 84 days (12 weeks)
- **Eligibility:** Female employees
- **Payment:** Full pay
- **Documentation:** Medical certificate
- **Legal Basis:** Shop and Office Employees Act

### Paternity Leave
- **Duration:** 3 days
- **Eligibility:** Male employees
- **Timing:** Around childbirth
- **Payment:** Full pay

## Public Holidays

### Poya Days
Sri Lanka observes 12 Full Moon Poya Days annually:
- Duruthu Poya (January)
- Navam Poya (February)
- Madin Poya (March)
- Bak Poya (April)
- Vesak Poya (May) - Most important
- Poson Poya (June)
- Esala Poya (July)
- Nikini Poya (August)
- Binara Poya (September)
- Vap Poya (October)
- Il Poya (November)
- Unduvap Poya (December)

### National Holidays
- Independence Day (February 4)
- Sinhala & Tamil New Year (April 13-14)
- May Day (May 1)

### Religious Holidays
- Thai Pongal (Hindu)
- Maha Shivarathri (Hindu)
- Good Friday (Christian)
- Christmas (December 25)
- Deepavali (Hindu)
- Eid-ul-Fitr (Muslim)
- Eid-ul-Adha (Muslim)
- Milad-un-Nabi (Muslim)

## Weekend
- Saturday and Sunday
- Some businesses have alternative schedules

## Compliance Checklist
- [ ] All statutory leave types configured
- [ ] Minimum days per year met
- [ ] All Poya Days in calendar
- [ ] National holidays in calendar
- [ ] Religious holidays in calendar
- [ ] Maternity leave configured correctly
- [ ] Documentation requirements set
- [ ] Weekend configuration correct
```

### Troubleshooting Guide

```markdown
# Leave Management Troubleshooting

## Common Issues

### Issue: Cannot Submit Leave Request
**Symptoms:**
- Submit button is disabled
- Error message about insufficient balance

**Possible Causes:**
1. Insufficient leave balance
2. Overlapping leave request exists
3. Minimum notice period not met
4. Holiday falls on requested dates

**Solutions:**
1. Check leave balance: [Instructions]
2. Check for overlapping requests: [Instructions]
3. Verify notice period: [Instructions]
4. Adjust dates to avoid issues

### Issue: Manager Cannot See Pending Requests
[Documentation]

### Issue: Balance Not Updated After Approval
[Documentation]

### Issue: Holiday Not Excluding from Working Days
[Documentation]

### Issue: Carry Forward Not Working
[Documentation]

## Error Messages

### "Insufficient leave balance"
[Explanation and solution]

### "Leave request overlaps with existing request"
[Explanation and solution]

### "Minimum notice period not met"
[Explanation and solution]

### "You cannot approve your own leave request"
[Explanation and solution]

## FAQ

### How is leave balance calculated?
[Detailed explanation]

### When is leave accrued?
[Detailed explanation]

### How does carry forward work?
[Detailed explanation]

### Can I cancel approved leave?
[Detailed explanation]

### How are holidays handled?
[Detailed explanation]

## Getting Help
- Email: support@example.com
- Internal helpdesk: [URL]
- Documentation: [URL]
```

### Expected Outcome
- Complete module documentation
- Clear API reference with examples
- User guides for all roles
- Configuration instructions
- Workflow documentation
- Sri Lankan compliance guide
- Troubleshooting information
- Maintainable documentation structure

### Verification Checklist
- [ ] docs/ directory created
- [ ] README.md created
- [ ] API_REFERENCE.md created
- [ ] CONFIGURATION.md created
- [ ] USER_GUIDE.md created
- [ ] WORKFLOW.md created
- [ ] BALANCE_MANAGEMENT.md created
- [ ] HOLIDAY_CALENDAR.md created
- [ ] SRI_LANKA_COMPLIANCE.md created
- [ ] TROUBLESHOOTING.md created
- [ ] CHANGELOG.md created
- [ ] INSTALLATION.md created
- [ ] All endpoints documented
- [ ] All features explained
- [ ] Examples provided
- [ ] Diagrams included where helpful
- [ ] Code docstrings complete
- [ ] OpenAPI schema generated
- [ ] Documentation reviewed for clarity
- [ ] Links between documents work

---

## Summary

This document completed the Leave Management API implementation:

### Completed Components
- ✅ URL routing for all endpoints
- ✅ Comprehensive test suite
- ✅ Complete module documentation

### Key Achievements
1. **URL Configuration** - All endpoints properly routed
2. **Test Coverage** - Extensive tests for all functionality
3. **Documentation** - Complete guides for all users
4. **API Reference** - Detailed endpoint documentation
5. **Compliance** - Sri Lankan requirements documented
6. **Troubleshooting** - Common issues addressed

### Leave Management Module Complete

The Leave Management module is now complete with:
- ✅ Models for leave types, balances, requests, holidays
- ✅ Service layer for business logic
- ✅ Workflow engine for approvals
- ✅ Calendar integration
- ✅ Balance accrual and management
- ✅ Complete REST API
- ✅ Comprehensive tests
- ✅ Full documentation
- ✅ Sri Lankan compliance

### Next Phase
The Leave Management module (SubPhase-04) is complete. Ready to proceed to the next SubPhase or Phase as defined in the project plan.

---

**Document Status:** ✅ Complete  
**Total Tasks:** 3  
**Total Lines:** ~1194  
**Module Status:** ✅ Production Ready
