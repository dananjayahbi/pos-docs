# Tasks 83-88: API Serializers, ViewSets, and Actions

> **Phase:** 06 - ERP Advanced Modules  
> **SubPhase:** 06 - Payroll Processing  
> **Group:** F - API, Testing & Documentation  
> **Document:** 01 of 02  
> **Tasks Covered:** 83, 84, 85, 86, 87, 88

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-89-92_Reports-Tests-Docs.md](02_Tasks-89-92_Reports-Tests-Docs.md)

---

## Document Overview

This document covers creating Django REST Framework serializers and viewsets for the payroll API, including custom actions for processing, approval, finalization, and reversal operations.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 83 | Create PayrollPeriodSerializer | Medium | 25 min |
| 84 | Create PayrollRunSerializer | Medium | 30 min |
| 85 | Create EmployeePayrollSerializer | High | 35 min |
| 86 | Create PayrollPeriodViewSet | Medium | 25 min |
| 87 | Create PayrollRunViewSet | High | 35 min |
| 88 | Add Payroll Actions | High | 35 min |

---

## Task 83: Create PayrollPeriodSerializer

### Overview
Create DRF serializer for PayrollPeriod model to handle API serialization and deserialization of period data.

### Dependencies
- PayrollPeriod model exists
- Django REST Framework installed

### Instructions

1. **Create serializers directory**
   - Create `serializers/` directory in payroll app
   - Create `__init__.py` file

2. **Create period serializer file**
   - Create `period_serializer.py` file
   - Import DRF serializers and PayrollPeriod model

3. **Define PayrollPeriodSerializer class**
   - Inherit from serializers.ModelSerializer
   - Set model and fields in Meta

4. **Configure Meta class**
   - Set model = PayrollPeriod
   - Set fields = '__all__' or list specific fields
   - Set read_only_fields for auto-generated fields

5. **Add computed fields**
   - Add runs_count SerializerMethodField
   - Calculate number of runs for period
   - Add is_current SerializerMethodField

6. **Add field validation**
   - Validate end_date > start_date
   - Validate pay_date >= end_date
   - Validate period_month and period_year

7. **Add custom representation**
   - Override to_representation if needed
   - Format dates appropriately
   - Include related data

8. **Import in serializers __init__.py**
   - Add import statement
   - Export PayrollPeriodSerializer

### Serializer Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | UUID | Read-only | Primary key |
| name | String | Yes | Period name |
| period_month | Integer | Yes | Month (1-12) |
| period_year | Integer | Yes | Year |
| start_date | Date | Yes | Period start |
| end_date | Date | Yes | Period end |
| pay_date | Date | Yes | Payment date |
| status | Choice | Yes | Period status |
| total_working_days | Integer | Yes | Working days count |
| is_locked | Boolean | Read-only | Lock status |
| runs_count | Integer | Read-only | Number of runs |
| is_current | Boolean | Read-only | Current period flag |

### Expected Outcome
- PayrollPeriodSerializer created
- All fields configured
- Validation implemented
- Computed fields added

### Verification Checklist
- [ ] serializers/ directory created
- [ ] period_serializer.py file created
- [ ] PayrollPeriodSerializer class defined
- [ ] Inherits from ModelSerializer
- [ ] Meta class configured
- [ ] All fields included
- [ ] Read-only fields set
- [ ] runs_count computed field added
- [ ] Field validation added
- [ ] Imported in serializers/__init__.py

---

## Task 84: Create PayrollRunSerializer

### Overview
Create serializer for PayrollRun model with nested period data and financial summaries.

### Dependencies
- Task 83 completed (PayrollPeriodSerializer exists)
- PayrollRun model exists

### Instructions

1. **Create run serializer file**
   - Create `run_serializer.py` file
   - Import required modules

2. **Define PayrollRunSerializer class**
   - Inherit from serializers.ModelSerializer
   - Configure Meta class

3. **Add nested period serializer**
   - Add period field using PayrollPeriodSerializer
   - Set read_only=True for nested data

4. **Add computed financial fields**
   - total_gross SerializerMethodField
   - total_deductions SerializerMethodField
   - total_net SerializerMethodField
   - total_epf_employee SerializerMethodField
   - total_epf_employer SerializerMethodField
   - total_etf SerializerMethodField
   - total_paye SerializerMethodField

5. **Add user fields**
   - processed_by nested user serializer
   - approved_by nested user serializer
   - finalized_by nested user serializer
   - Use SlugRelatedField or nested serializer

6. **Add status display field**
   - Add get_status_display method
   - Return human-readable status

7. **Add duration field**
   - Calculate processing duration
   - completed_at - started_at

8. **Add validation**
   - Validate period exists
   - Validate status transitions

9. **Import in serializers __init__.py**
   - Export PayrollRunSerializer

### Serializer Fields

| Field | Type | Description |
|-------|------|-------------|
| id | UUID | Primary key |
| period | Nested | PayrollPeriod details |
| run_number | Integer | Run sequence |
| status | Choice | Run status |
| started_at | DateTime | Processing start |
| completed_at | DateTime | Processing end |
| total_employees | Integer | Employee count |
| error_count | Integer | Error count |
| processed_by | User | Processing user |
| approved_by | User | Approving user |
| finalized_by | User | Finalizing user |
| total_gross | Decimal | Sum of gross |
| total_deductions | Decimal | Sum of deductions |
| total_net | Decimal | Sum of net |
| total_epf_employee | Decimal | Total EPF employee |
| total_epf_employer | Decimal | Total EPF employer |
| total_etf | Decimal | Total ETF |
| total_paye | Decimal | Total PAYE |
| duration | String | Processing duration |

### Expected Outcome
- PayrollRunSerializer created
- Nested period data included
- Financial totals computed
- User information included

### Verification Checklist
- [ ] run_serializer.py file created
- [ ] PayrollRunSerializer class defined
- [ ] Meta class configured
- [ ] Nested period serializer added
- [ ] Computed financial fields added
- [ ] User fields added
- [ ] Status display method added
- [ ] Duration calculation added
- [ ] Validation added
- [ ] Imported in serializers/__init__.py

---

## Task 85: Create EmployeePayrollSerializer

### Overview
Create comprehensive serializer for EmployeePayroll with nested employee data, line items, and statutory contribution details.

### Dependencies
- Tasks 83-84 completed
- EmployeePayroll model exists
- PayrollLineItem model exists

### Instructions

1. **Create employee payroll serializer file**
   - Create `employee_payroll_serializer.py` file
   - Import required modules

2. **Create PayrollLineItemSerializer**
   - Create nested serializer for line items
   - Include component details
   - Show amounts and descriptions

3. **Define EmployeePayrollSerializer class**
   - Inherit from ModelSerializer
   - Configure comprehensive fields

4. **Add nested employee data**
   - Add employee field with nested serializer
   - Include employee_id, name, department

5. **Add nested payroll run data**
   - Add payroll_run field
   - Include basic run information

6. **Add line items**
   - Add line_items field
   - Use PayrollLineItemSerializer(many=True)
   - Separate earnings and deductions

7. **Add EPF contribution details**
   - Nest EPFContribution serializer
   - Include EPF amounts and base

8. **Add ETF contribution details**
   - Nest ETFContribution serializer
   - Include ETF amount and base

9. **Add PAYE calculation details**
   - Nest PAYECalculation serializer
   - Include taxable income and tax amount

10. **Add computed fields**
    - earning_line_items SerializerMethodField
    - deduction_line_items SerializerMethodField
    - employer_cost SerializerMethodField

11. **Add validation**
    - Validate gross = sum of earnings
    - Validate net = gross - deductions

12. **Import in serializers __init__.py**
    - Export all serializers

### EmployeePayrollSerializer Fields

| Field | Type | Description |
|-------|------|-------------|
| id | UUID | Primary key |
| employee | Nested | Employee details |
| payroll_run | Nested | Run summary |
| days_worked | Integer | Days worked |
| days_absent | Integer | Days absent |
| overtime_hours | Decimal | Overtime hours |
| basic_salary | Decimal | Basic amount |
| overtime_amount | Decimal | Overtime pay |
| gross_salary | Decimal | Total gross |
| total_deductions | Decimal | Total deductions |
| net_salary | Decimal | Net pay |
| payment_status | Choice | Payment status |
| line_items | Array | All line items |
| earning_line_items | Array | Earnings only |
| deduction_line_items | Array | Deductions only |
| epf_contribution | Nested | EPF details |
| etf_contribution | Nested | ETF details |
| paye_calculation | Nested | PAYE details |
| employer_cost | Decimal | Total employer cost |

### PayrollLineItemSerializer Fields

| Field | Type | Description |
|-------|------|-------------|
| id | UUID | Primary key |
| component | String | Component name |
| line_type | Choice | EARNING/DEDUCTION |
| base_amount | Decimal | Base amount |
| calculated_amount | Decimal | Calculated |
| adjustment_amount | Decimal | Adjustment |
| final_amount | Decimal | Final amount |
| description | String | Description |

### Expected Outcome
- EmployeePayrollSerializer created
- Comprehensive nested data
- Line items separated by type
- Statutory details included

### Verification Checklist
- [ ] employee_payroll_serializer.py created
- [ ] PayrollLineItemSerializer defined
- [ ] EmployeePayrollSerializer defined
- [ ] Nested employee data added
- [ ] Nested run data added
- [ ] Line items serializer added
- [ ] EPF contribution nested
- [ ] ETF contribution nested
- [ ] PAYE calculation nested
- [ ] Computed fields added
- [ ] Validation added
- [ ] Imported in serializers/__init__.py

---

## Task 86: Create PayrollPeriodViewSet

### Overview
Create DRF viewset for PayrollPeriod with CRUD operations and custom actions for period management.

### Dependencies
- Task 83 completed (PayrollPeriodSerializer exists)

### Instructions

1. **Create views directory**
   - Create `views/` directory in payroll app
   - Create `__init__.py` file

2. **Create period viewset file**
   - Create `period_viewset.py` file
   - Import DRF viewsets and serializers

3. **Define PayrollPeriodViewSet class**
   - Inherit from viewsets.ModelViewSet
   - Configure queryset and serializer

4. **Set queryset**
   - Query PayrollPeriod.objects.all()
   - Order by period_year, period_month DESC
   - Optimize with select_related

5. **Set serializer class**
   - Set serializer_class = PayrollPeriodSerializer

6. **Add permission classes**
   - Set IsAuthenticated
   - Add custom payroll permissions

7. **Add filterset fields**
   - Filter by period_year
   - Filter by period_month
   - Filter by status
   - Filter by is_locked

8. **Add search fields**
   - Search by name
   - Enable search functionality

9. **Add ordering fields**
   - Allow ordering by period_year
   - Allow ordering by period_month
   - Allow ordering by created_at

10. **Add custom action for current period**
    - @action(detail=False, methods=['get'])
    - def current(self, request)
    - Return current active period

11. **Add custom action to close period**
    - @action(detail=True, methods=['post'])
    - def close(self, request, pk=None)
    - Close period and prevent new runs

12. **Import in views __init__.py**
    - Export PayrollPeriodViewSet

### ViewSet Configuration

```
PayrollPeriodViewSet:
├── queryset: All periods ordered by date
├── serializer_class: PayrollPeriodSerializer
├── permission_classes: [IsAuthenticated, HasPayrollPermission]
├── filterset_fields: ['period_year', 'period_month', 'status']
├── search_fields: ['name']
├── ordering_fields: ['period_year', 'period_month']
└── actions:
    ├── list: GET /periods/
    ├── create: POST /periods/
    ├── retrieve: GET /periods/{id}/
    ├── update: PUT /periods/{id}/
    ├── destroy: DELETE /periods/{id}/
    ├── current: GET /periods/current/
    └── close: POST /periods/{id}/close/
```

### Expected Outcome
- PayrollPeriodViewSet created
- CRUD operations available
- Custom actions for period management
- Filtering and search enabled

### Verification Checklist
- [ ] views/ directory created
- [ ] period_viewset.py file created
- [ ] PayrollPeriodViewSet class defined
- [ ] Queryset configured
- [ ] Serializer class set
- [ ] Permission classes added
- [ ] Filterset fields configured
- [ ] Search fields added
- [ ] Ordering fields added
- [ ] current action added
- [ ] close action added
- [ ] Imported in views/__init__.py

---

## Task 87: Create PayrollRunViewSet

### Overview
Create comprehensive viewset for PayrollRun with actions for processing, approval, finalization, and status retrieval.

### Dependencies
- Task 84 completed (PayrollRunSerializer exists)
- Task 86 completed (ViewSet pattern established)

### Instructions

1. **Create run viewset file**
   - Create `run_viewset.py` file
   - Import required modules

2. **Define PayrollRunViewSet class**
   - Inherit from viewsets.ModelViewSet
   - Configure queryset and serializer

3. **Set queryset**
   - Query PayrollRun.objects.all()
   - Include select_related for period
   - Include prefetch_related for employee_payrolls
   - Order by created_at DESC

4. **Set serializer class**
   - Set serializer_class = PayrollRunSerializer

5. **Add permission classes**
   - IsAuthenticated required
   - Custom permissions per action

6. **Add filterset fields**
   - Filter by period
   - Filter by status
   - Filter by run_number

7. **Add custom queryset filters**
   - Override get_queryset if needed
   - Filter by user permissions
   - Apply tenant filtering

8. **Prepare for custom actions**
   - Will add in Task 88
   - Plan action structure

9. **Add get_permissions method**
   - Override for action-specific permissions
   - Different permissions for approve vs view

10. **Import in views __init__.py**
    - Export PayrollRunViewSet

### ViewSet Configuration

```
PayrollRunViewSet:
├── queryset: All runs with related data
├── serializer_class: PayrollRunSerializer
├── permission_classes: [IsAuthenticated]
├── filterset_fields: ['period', 'status', 'run_number']
└── actions (to be added in Task 88):
    ├── list: GET /runs/
    ├── retrieve: GET /runs/{id}/
    ├── process: POST /runs/process/
    ├── status: GET /runs/{id}/status/
    ├── submit: POST /runs/{id}/submit/
    ├── approve: POST /runs/{id}/approve/
    ├── reject: POST /runs/{id}/reject/
    ├── finalize: POST /runs/{id}/finalize/
    ├── reverse: POST /runs/{id}/reverse/
    └── summary: GET /runs/{id}/summary/
```

### Expected Outcome
- PayrollRunViewSet created
- Basic CRUD configured
- Ready for custom actions
- Permission structure prepared

### Verification Checklist
- [ ] run_viewset.py file created
- [ ] PayrollRunViewSet class defined
- [ ] Queryset configured with optimizations
- [ ] Serializer class set
- [ ] Permission classes added
- [ ] Filterset fields configured
- [ ] get_queryset method customized
- [ ] get_permissions prepared
- [ ] Imported in views/__init__.py

---

## Task 88: Add Payroll Actions

### Overview
Add custom actions to PayrollRunViewSet for processing, approval workflow, finalization, and reversal operations.

### Dependencies
- Task 87 completed (PayrollRunViewSet exists)
- All service classes exist (processor, approval, finalization, reversal)

### Instructions

1. **Add process action**
   - @action(detail=False, methods=['post'])
   - Accept period_id in request data
   - Trigger async payroll processing
   - Return task_id and initial status

2. **Add status action**
   - @action(detail=True, methods=['get'])
   - Return processing progress from Redis
   - Include percentage, current employee
   - Real-time status updates

3. **Add submit action**
   - @action(detail=True, methods=['post'])
   - Submit for approval
   - Call PayrollApprovalService.submit_for_approval
   - Return updated run

4. **Add approve action**
   - @action(detail=True, methods=['post'])
   - Accept optional notes in request
   - Check approval permission
   - Call PayrollApprovalService.approve
   - Return approved run

5. **Add reject action**
   - @action(detail=True, methods=['post'])
   - Require reason in request data
   - Check approval permission
   - Call PayrollApprovalService.reject
   - Return rejected run

6. **Add finalize action**
   - @action(detail=True, methods=['post'])
   - Check finalization permission
   - Call PayrollFinalizationService.finalize
   - Return finalized run

7. **Add reverse action**
   - @action(detail=True, methods=['post'])
   - Require reason in request data
   - Check reversal permission (high-level)
   - Call PayrollReversalService.reverse
   - Return reversed run

8. **Add summary action**
   - @action(detail=True, methods=['get'])
   - Return comprehensive payroll summary
   - Include all financial totals
   - Include statutory breakdowns

9. **Add bank_file action**
   - @action(detail=True, methods=['get'])
   - Accept bank_code parameter
   - Generate bank file
   - Return file download response

10. **Add error handling**
    - Wrap actions in try-except
    - Return appropriate HTTP status codes
    - Return error messages

11. **Add action permissions**
    - Override get_permissions for each action
    - Require specific permissions per action

### Action Implementations

**Process Action:**
```python
@action(detail=False, methods=['post'])
def process(self, request):
    period_id = request.data.get('period_id')
    # Validate period
    # Trigger Celery task
    task = process_payroll_task.delay(period_id)
    return Response({
        'task_id': task.id,
        'status': 'PROCESSING',
        'message': 'Payroll processing started'
    })
```

**Status Action:**
```python
@action(detail=True, methods=['get'])
def status(self, request, pk=None):
    run = self.get_object()
    progress = get_processing_progress(run.id)
    return Response(progress)
```

**Approve Action:**
```python
@action(detail=True, methods=['post'])
def approve(self, request, pk=None):
    run = self.get_object()
    notes = request.data.get('notes', '')
    service = PayrollApprovalService()
    updated_run = service.approve(run.id, request.user, notes)
    serializer = self.get_serializer(updated_run)
    return Response(serializer.data)
```

### Action Permissions

| Action | Permission Required |
|--------|---------------------|
| process | payroll.process_payroll |
| status | payroll.view_payroll |
| submit | payroll.submit_payroll |
| approve | payroll.approve_payroll |
| reject | payroll.approve_payroll |
| finalize | payroll.finalize_payroll |
| reverse | payroll.reverse_payroll |
| summary | payroll.view_payroll |
| bank_file | payroll.finalize_payroll |

### Expected Outcome
- All custom actions added
- Service integration complete
- Proper permission checking
- Error handling implemented

### Verification Checklist
- [ ] process action added
- [ ] status action added
- [ ] submit action added
- [ ] approve action added
- [ ] reject action added
- [ ] finalize action added
- [ ] reverse action added
- [ ] summary action added
- [ ] bank_file action added
- [ ] Error handling added
- [ ] Permission checking added
- [ ] All actions return proper responses

---

## Summary

This document covered API serializers, viewsets, and actions:

**Serializers (Tasks 83-85):**
- PayrollPeriodSerializer for period data
- PayrollRunSerializer with financial totals
- EmployeePayrollSerializer with nested details
- Comprehensive field coverage
- Computed fields for summaries

**ViewSets (Tasks 86-87):**
- PayrollPeriodViewSet for period management
- PayrollRunViewSet for run operations
- CRUD operations enabled
- Filtering and search configured
- Permission structure prepared

**Custom Actions (Task 88):**
- Process action for starting payroll
- Status action for progress tracking
- Submit, approve, reject for workflow
- Finalize action for locking
- Reverse action for corrections
- Summary and bank_file actions
- Permission-based access control

**Key Outcomes:**
- Complete REST API for payroll
- Service layer integration
- Action-based workflow
- Real-time status tracking
- Proper permission handling
- Ready for frontend integration

These implementations provide a comprehensive API interface for the payroll processing module.
