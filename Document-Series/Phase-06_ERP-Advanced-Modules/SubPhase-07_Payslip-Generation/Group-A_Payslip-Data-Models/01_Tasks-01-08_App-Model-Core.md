# Tasks 01-08: App, Model, and Core Fields

> **Phase:** 06 - ERP Advanced Modules  
> **SubPhase:** 07 - Payslip Generation  
> **Group:** A - Payslip Data Models  
> **Document:** 01 of 02  
> **Tasks Covered:** 01, 02, 03, 04, 05, 06, 07, 08

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-09-16_Status-Tracking-Migrations.md](02_Tasks-09-16_Status-Tracking-Migrations.md)

---

## Document Overview

This document covers the foundational setup for the payslip generation system, including creating the Django app, registering it as a tenant app, defining payslip status constants, and establishing the core Payslip model with employee, period, and payroll relationships. It also includes implementing the auto-generated payslip number field.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 01 | Create payslip App | Low | 15 min |
| 02 | Register payslip App | Low | 10 min |
| 03 | Define PayslipStatus Choices | Low | 10 min |
| 04 | Create Payslip Model | Medium | 25 min |
| 05 | Add Payslip Employee FK | Low | 15 min |
| 06 | Add Payslip Period FK | Low | 15 min |
| 07 | Add Payslip Employee Payroll FK | Low | 15 min |
| 08 | Add Payslip Number Field | Medium | 20 min |

---

## Task 01: Create Payslip App

### Overview
Create the `payslip` Django application to handle all payslip generation, PDF creation, email distribution, and employee self-service functionality. This app will integrate with the payroll module to generate formatted payslip documents for employees.

### Dependencies
- Django project structure established
- Multi-tenancy infrastructure in place
- Payroll app must exist (Phase 06, SubPhase 02)

### Instructions

1. **Navigate to apps directory**
   - Open terminal in project root
   - Navigate to `apps/` directory
   - Prepare to create new Django app

2. **Create Django application**
   - Use Django's startapp command or manually create structure
   - Name the app `payslip`
   - This will handle all payslip-related functionality

3. **Create app configuration file**
   - Create `apps.py` in `apps/payslip/` directory
   - Define PayslipConfig class
   - Set app name and label appropriately

4. **Create models directory structure**
   - Create `models/` directory inside `payslip/`
   - Create `__init__.py` in models directory
   - This will contain all payslip-related models

5. **Create constants module**
   - Create `constants.py` file
   - Will define PayslipStatus choices
   - Will contain other payslip-related constants

6. **Create services directory**
   - Create `services/` directory
   - Create `__init__.py` in services
   - Will contain business logic classes

7. **Create templates directory**
   - Create `templates/payslip/` directory
   - Will contain HTML templates for PDF generation
   - Will contain email templates

8. **Create serializers directory**
   - Create `serializers/` directory
   - Create `__init__.py` in serializers
   - Will contain DRF serializers

9. **Create views directory**
   - Create `views/` directory
   - Create `__init__.py` in views
   - Will contain API views and ViewSets

10. **Create tests directory**
    - Create `tests/` directory
    - Create `__init__.py` in tests
    - Will contain unit and integration tests

### Directory Structure
```
apps/payslip/
├── __init__.py                    # Package initialization
├── apps.py                        # App configuration
├── constants.py                   # Status choices, constants
├── admin.py                       # Django admin configurations
├── urls.py                        # URL routing
├── models/
│   └── __init__.py               # Model imports
├── services/
│   └── __init__.py               # Service classes
├── serializers/
│   └── __init__.py               # DRF serializers
├── views/
│   └── __init__.py               # API views
├── templates/
│   └── payslip/                  # HTML templates
├── tests/
│   └── __init__.py               # Test files
└── migrations/
    └── __init__.py               # Migration files
```

### Module Purpose

| Module | Purpose |
|--------|---------|
| `apps.py` | App configuration and setup |
| `constants.py` | Payslip status choices and constants |
| `models/` | Payslip data models |
| `services/` | PDF generation, email services |
| `serializers/` | API data serialization |
| `views/` | REST API endpoints |
| `templates/` | HTML for PDF and emails |
| `tests/` | Automated testing |
| `admin.py` | Django admin interface |
| `urls.py` | URL routing configuration |

### Expected Outcome
- Clean Django app structure
- Organized directories for all components
- Foundation for payslip generation system
- Ready for model and service implementation

### Verification Checklist
- [ ] `apps/payslip/` directory exists
- [ ] `apps.py` file created with PayslipConfig
- [ ] `models/` directory with `__init__.py` exists
- [ ] `services/` directory with `__init__.py` exists
- [ ] `serializers/` directory with `__init__.py` exists
- [ ] `views/` directory with `__init__.py` exists
- [ ] `templates/payslip/` directory exists
- [ ] `tests/` directory with `__init__.py` exists
- [ ] `constants.py` file created
- [ ] `admin.py` file created
- [ ] `urls.py` file created

---

## Task 02: Register Payslip App

### Overview
Register the payslip app in Django settings as a TENANT_APPS application. This ensures that payslip tables are created in each tenant's schema, allowing multi-tenant isolation of payslip data.

### Dependencies
- Task 01: Create payslip App

### Instructions

1. **Locate Django settings file**
   - Navigate to project settings directory
   - Open the main settings file (settings.py or base.py)
   - Find TENANT_APPS configuration section

2. **Add payslip to TENANT_APPS**
   - Locate the TENANT_APPS list
   - Add 'apps.payslip' to the list
   - Ensure proper ordering (after payroll app)

3. **Verify app path is correct**
   - Confirm the app path matches directory structure
   - Format should be: 'apps.payslip'
   - Ensure no typos in app name

4. **Check app dependencies**
   - Verify payroll app is listed before payslip
   - Verify hr app is listed (for Employee model)
   - Ensure proper dependency order

5. **Document app placement**
   - Add comment explaining payslip app purpose
   - Note dependencies on other apps
   - Document tenant-specific nature

### TENANT_APPS Configuration

The TENANT_APPS configuration should include payslip after related dependencies:

```
TENANT_APPS = [
    # Core tenant apps
    'apps.core',
    
    # HR and Payroll
    'apps.hr',                    # Employee model
    'apps.payroll',               # Payroll processing
    'apps.payslip',               # Payslip generation (NEW)
    
    # Other tenant apps...
]
```

### App Registration Order Importance

The order of apps in TENANT_APPS matters for:

1. **Foreign Key Resolution**
   - Payslip references Employee (hr app)
   - Payslip references PayrollPeriod (payroll app)
   - Payslip references EmployeePayroll (payroll app)

2. **Migration Dependencies**
   - Payslip migrations depend on hr migrations
   - Payslip migrations depend on payroll migrations
   - Proper order prevents migration conflicts

3. **App Loading Sequence**
   - Django loads apps in listed order
   - Later apps can reference earlier apps
   - Improves startup reliability

### Multi-Tenancy Considerations

As a TENANT_APP, payslip will:

1. **Schema Isolation**
   - Each tenant gets separate payslip tables
   - Data is automatically tenant-scoped
   - No cross-tenant data leakage

2. **Automatic Tenant Filtering**
   - Queries automatically filtered by tenant
   - Middleware handles tenant context
   - No manual tenant filtering needed

3. **Tenant-Specific Migrations**
   - Migrations run for each tenant schema
   - Template schema gets base structure
   - New tenants get current schema

### Expected Outcome
- Payslip app registered in TENANT_APPS
- App will create tables in tenant schemas
- Multi-tenant isolation enabled
- Ready for model migrations

### Verification Checklist
- [ ] TENANT_APPS includes 'apps.payslip'
- [ ] Payslip app placed after hr and payroll apps
- [ ] App path correctly formatted
- [ ] No syntax errors in settings file
- [ ] Comments added for documentation

---

## Task 03: Define PayslipStatus Choices

### Overview
Define status choices for tracking the lifecycle of payslip documents from creation through generation, distribution, viewing, and downloading. These status values enable workflow management and reporting.

### Dependencies
- Task 01: Create payslip App

### Instructions

1. **Open constants.py file**
   - Navigate to `apps/payslip/constants.py`
   - Add module docstring explaining purpose
   - Prepare to define status choices

2. **Add module documentation**
   - Document the purpose of payslip constants
   - Explain status lifecycle flow
   - Note usage in models and business logic

3. **Define PayslipStatus class**
   - Use Django's TextChoices or similar pattern
   - Inherit from appropriate base class
   - Provide clear choice values

4. **Define DRAFT status**
   - Value: 'DRAFT'
   - Display: 'Draft'
   - Initial status when payslip record created
   - PDF not yet generated

5. **Define GENERATED status**
   - Value: 'GENERATED'
   - Display: 'Generated'
   - PDF has been created and saved
   - Ready for distribution

6. **Define SENT status**
   - Value: 'SENT'
   - Display: 'Sent'
   - Email sent to employee
   - Awaiting employee action

7. **Define VIEWED status**
   - Value: 'VIEWED'
   - Display: 'Viewed'
   - Employee has viewed payslip
   - Tracks engagement

8. **Define DOWNLOADED status**
   - Value: 'DOWNLOADED'
   - Display: 'Downloaded'
   - Employee downloaded PDF
   - Final status in normal flow

### PayslipStatus Details

| Status | Value | Display | Description | When Set |
|--------|-------|---------|-------------|----------|
| DRAFT | 'DRAFT' | Draft | Initial state | When Payslip record created |
| GENERATED | 'GENERATED' | Generated | PDF created | After PDF generation completes |
| SENT | 'SENT' | Sent | Email sent | After email successfully sent |
| VIEWED | 'VIEWED' | Viewed | Employee viewed | When employee opens payslip |
| DOWNLOADED | 'DOWNLOADED' | Downloaded | Employee downloaded | When employee downloads PDF |

### Status Flow Diagram

```
┌─────────┐
│  DRAFT  │  ← Payslip record created
└────┬────┘
     │ Generate PDF
     ▼
┌───────────┐
│ GENERATED │  ← PDF created and saved
└─────┬─────┘
      │ Send email
      ▼
┌─────────┐
│  SENT   │  ← Email delivered
└────┬────┘
     │ Employee opens
     ▼
┌─────────┐
│ VIEWED  │  ← First view tracked
└────┬────┘
     │ Employee downloads
     ▼
┌────────────┐
│ DOWNLOADED │  ← Download tracked
└────────────┘
```

### Alternative Status Flows

#### Direct View (No Email)
```
DRAFT → GENERATED → VIEWED → DOWNLOADED
```
Employee accesses through portal without email.

#### Regeneration Flow
```
GENERATED → DRAFT → GENERATED
```
Admin regenerates PDF (updates existing record).

#### Email Resend Flow
```
SENT → SENT (email_count incremented)
```
Same status, updated sent_at timestamp.

### Status Usage Scenarios

#### DRAFT Status
- Payslip record created from EmployeePayroll
- PDF generation not yet triggered
- Allows for data validation before generation
- Can be bulk generated later

#### GENERATED Status
- PDF successfully created
- File stored in media/payslips/
- Ready for email distribution
- Can be viewed in admin

#### SENT Status
- Email with PDF attachment sent
- Employee notified
- Tracks communication
- Can be resent if needed

#### VIEWED Status
- Employee opened payslip in portal
- Confirms receipt and engagement
- Updates first_viewed_at timestamp
- Increments view_count

#### DOWNLOADED Status
- Employee downloaded PDF file
- Final confirmation of delivery
- Updates download_count
- Updates last_downloaded_at timestamp

### Reporting and Analytics

Status values enable:

1. **Distribution Tracking**
   - How many payslips sent vs pending
   - Email delivery success rate
   - Time from generation to sending

2. **Employee Engagement**
   - View rates after email sent
   - Download rates after viewing
   - Time to first view after email

3. **Processing Metrics**
   - Average time in each status
   - Bottlenecks in workflow
   - Bulk generation completion

4. **Compliance Verification**
   - Confirm all payslips sent
   - Track employee acknowledgment
   - Audit trail for HR

### Expected Outcome
- Clear status lifecycle definition
- Workflow tracking capability
- Foundation for status transitions
- Support for reporting and analytics

### Verification Checklist
- [ ] PayslipStatus class defined
- [ ] DRAFT status constant created
- [ ] GENERATED status constant created
- [ ] SENT status constant created
- [ ] VIEWED status constant created
- [ ] DOWNLOADED status constant created
- [ ] Display names are user-friendly
- [ ] Module docstring explains usage

---

## Task 04: Create Payslip Model

### Overview
Create the core Payslip model that represents a generated payslip document for an employee in a specific payroll period. This model serves as the central entity for payslip generation, tracking, and distribution.

### Dependencies
- Task 01: Create payslip App
- Task 03: Define PayslipStatus Choices
- Employee model exists (hr app)
- PayrollPeriod model exists (payroll app)
- EmployeePayroll model exists (payroll app)

### Instructions

1. **Create payslip model file**
   - Navigate to `apps/payslip/models/`
   - Create file named `payslip.py`
   - Import necessary Django modules

2. **Import required dependencies**
   - Import Django model base classes
   - Import UUID for primary key
   - Import User model for tracking
   - Import Client model for tenant FK

3. **Import related models**
   - Import Employee from hr app
   - Import PayrollPeriod from payroll app
   - Import EmployeePayroll from payroll app
   - Import PayslipStatus from constants

4. **Define Payslip model class**
   - Create class inheriting from Model
   - Add model docstring
   - Define Meta class with options

5. **Add primary key field**
   - Use UUID field as primary key
   - Set default to uuid.uuid4
   - Set editable=False
   - Ensures globally unique identifiers

6. **Add tenant foreign key**
   - Field name: tenant
   - Links to Client model
   - CASCADE delete behavior
   - Enables multi-tenant isolation

7. **Add timestamp fields**
   - Field: created_at (auto_now_add=True)
   - Field: updated_at (auto_now=True)
   - Tracks record creation and modifications

8. **Define model Meta options**
   - Set verbose_name and verbose_name_plural
   - Define db_table name
   - Set default ordering
   - Add model-level indexes

9. **Add string representation**
   - Implement __str__ method
   - Return slip_number and employee name
   - Make model instances readable

10. **Update models __init__.py**
    - Import Payslip model
    - Export in __all__ list
    - Make model accessible from models package

### Model Base Structure

The Payslip model will serve as the foundation with these base fields:

```
Payslip Model Base:
├── id: UUID (PK)
├── tenant: FK → Client
├── created_at: DateTime
├── updated_at: DateTime
└── [Additional fields in subsequent tasks]
```

### Model Purpose and Scope

The Payslip model:

1. **Document Generation**
   - Represents one payslip document
   - Links to source payroll data
   - Stores PDF file reference

2. **Distribution Tracking**
   - Tracks email sending
   - Records view activity
   - Monitors downloads

3. **Employee Access**
   - Provides self-service access
   - Enables historical viewing
   - Supports mobile access

4. **Compliance and Audit**
   - Maintains generation history
   - Tracks all status changes
   - Provides audit trail

### Relationships Overview

```
Payslip Relationships:
├── tenant (FK → Client)
│   └── Multi-tenant isolation
├── employee (FK → Employee) [Task 05]
│   └── Who the payslip is for
├── payroll_period (FK → PayrollPeriod) [Task 06]
│   └── Which period it covers
├── employee_payroll (FK → EmployeePayroll) [Task 07]
│   └── Source payroll calculation data
└── generated_by (FK → User) [Task 10]
    └── Who generated the PDF
```

### Unique Identification

Each payslip will be uniquely identified by:

1. **UUID Primary Key**
   - Globally unique
   - URL-safe
   - Database-agnostic

2. **Slip Number** (Added in Task 08)
   - Human-readable format
   - Sequential within period
   - Format: PAY-{YEAR}-{MONTH}-{SEQ}

3. **Business Key**
   - Unique per employee per period
   - Constraint: unique_together (Task 16)
   - Prevents duplicate generation

### Expected Outcome
- Core Payslip model created
- Base fields (id, tenant, timestamps) defined
- Model structure ready for additional fields
- Foundation for payslip functionality

### Verification Checklist
- [ ] `models/payslip.py` file created
- [ ] Payslip class defined
- [ ] UUID primary key field added
- [ ] tenant foreign key added
- [ ] created_at and updated_at fields added
- [ ] Meta class defined
- [ ] __str__ method implemented
- [ ] Model imported in models/__init__.py

---

## Task 05: Add Payslip Employee FK

### Overview
Add a foreign key relationship from Payslip to Employee, establishing which employee the payslip belongs to. This relationship enables employee-specific payslip access and filtering.

### Dependencies
- Task 04: Create Payslip Model
- Employee model exists (hr app)

### Instructions

1. **Open payslip model file**
   - Navigate to `apps/payslip/models/payslip.py`
   - Locate Payslip model class
   - Prepare to add employee field

2. **Import Employee model**
   - Add import statement for Employee
   - Import from apps.hr.models
   - Use string reference if needed to avoid circular imports

3. **Add employee foreign key field**
   - Field name: employee
   - ForeignKey to Employee model
   - CASCADE delete behavior
   - Add related_name='payslips'

4. **Configure field options**
   - Set verbose_name='Employee'
   - Add help_text describing purpose
   - Ensure field is required (null=False)

5. **Add database index**
   - Set db_index=True for performance
   - Enables fast employee-based filtering
   - Improves query performance

6. **Document the relationship**
   - Add docstring comment
   - Explain employee relationship
   - Note usage in queries and filtering

### Employee Foreign Key Details

| Property | Value | Purpose |
|----------|-------|---------|
| Field Name | employee | Links to Employee model |
| Model Reference | Employee (hr.models) | Target model |
| Delete Behavior | CASCADE | Delete payslips when employee deleted |
| Related Name | payslips | Access from employee: employee.payslips.all() |
| Null Allowed | False | Every payslip must have employee |
| Database Index | True | Fast lookups by employee |

### Foreign Key Relationship

```
Employee (hr app)
    │
    │ One-to-Many
    │
    ▼
Payslip (payslip app)
    │
    └── Multiple payslips per employee
        (one per payroll period)
```

### Usage Scenarios

#### Filtering Payslips by Employee
```
Query all payslips for specific employee:
- Payslip.objects.filter(employee=employee_obj)
- Payslip.objects.filter(employee_id=employee_uuid)
- employee.payslips.all()
```

#### Employee Self-Service
```
Employee portal access:
1. Authenticate employee user
2. Get associated Employee record
3. Filter payslips: employee.payslips.all()
4. Display in date order
```

#### Bulk Generation
```
For payroll period:
1. Get all EmployeePayroll records
2. For each, get associated Employee
3. Create/update Payslip with employee FK
4. Generate PDF for employee
```

### Related Model Queries

#### From Employee to Payslips
```
Access employee's payslips:
- employee.payslips.all()
- employee.payslips.filter(status='SENT')
- employee.payslips.order_by('-created_at')
```

#### From Payslip to Employee
```
Access payslip's employee:
- payslip.employee
- payslip.employee.name
- payslip.employee.email
```

### Cascade Delete Behavior

When an Employee is deleted:

1. **Automatic Deletion**
   - All associated payslips deleted
   - CASCADE behavior in database
   - No orphaned payslip records

2. **Consider Implications**
   - Payslips are historical records
   - May want soft delete instead
   - Consider archiving before deletion

3. **Alternative Approaches**
   - Use PROTECT to prevent deletion
   - Implement soft delete on Employee
   - Archive payslips before employee removal

### Performance Considerations

1. **Database Index**
   - db_index=True on employee field
   - Speeds up filtering by employee
   - Important for self-service queries

2. **Query Optimization**
   - Use select_related('employee')
   - Reduces database queries
   - Improves list view performance

3. **Bulk Operations**
   - Filter by employee efficiently
   - Use in bulk_create operations
   - Optimize for large datasets

### Expected Outcome
- Employee foreign key added to Payslip
- Relationship enables employee-specific filtering
- Foundation for self-service access
- Performance optimized with index

### Verification Checklist
- [ ] employee field added to Payslip model
- [ ] ForeignKey references Employee model
- [ ] on_delete=CASCADE configured
- [ ] related_name='payslips' set
- [ ] db_index=True for performance
- [ ] Field is required (null=False)
- [ ] Docstring comments added

---

## Task 06: Add Payslip Period FK

### Overview
Add a foreign key relationship from Payslip to PayrollPeriod, establishing which payroll period the payslip covers. This relationship enables period-based filtering and reporting.

### Dependencies
- Task 04: Create Payslip Model
- PayrollPeriod model exists (payroll app)

### Instructions

1. **Open payslip model file**
   - Navigate to `apps/payslip/models/payslip.py`
   - Locate Payslip model class
   - Prepare to add payroll_period field

2. **Import PayrollPeriod model**
   - Add import statement for PayrollPeriod
   - Import from apps.payroll.models
   - Use string reference if needed

3. **Add payroll_period foreign key field**
   - Field name: payroll_period
   - ForeignKey to PayrollPeriod model
   - CASCADE delete behavior
   - Add related_name='payslips'

4. **Configure field options**
   - Set verbose_name='Payroll Period'
   - Add help_text describing purpose
   - Ensure field is required (null=False)

5. **Add database index**
   - Set db_index=True for performance
   - Enables fast period-based filtering
   - Improves reporting queries

6. **Document the relationship**
   - Add docstring comment
   - Explain period relationship
   - Note usage in bulk generation

### PayrollPeriod Foreign Key Details

| Property | Value | Purpose |
|----------|-------|---------|
| Field Name | payroll_period | Links to PayrollPeriod model |
| Model Reference | PayrollPeriod (payroll.models) | Target model |
| Delete Behavior | CASCADE | Delete payslips when period deleted |
| Related Name | payslips | Access from period: period.payslips.all() |
| Null Allowed | False | Every payslip must have period |
| Database Index | True | Fast lookups by period |

### Foreign Key Relationship

```
PayrollPeriod (payroll app)
    │
    │ One-to-Many
    │
    ▼
Payslip (payslip app)
    │
    └── Multiple payslips per period
        (one per employee in period)
```

### Usage Scenarios

#### Bulk Generation for Period
```
Generate all payslips for period:
1. Select PayrollPeriod
2. Get all EmployeePayroll for period
3. Create Payslip for each with period FK
4. Generate PDFs in batch
```

#### Period-Based Reporting
```
Report queries:
- period.payslips.count()
- period.payslips.filter(status='SENT').count()
- period.payslips.aggregate(Sum('amount'))
```

#### Employee Period History
```
View employee's payslip for specific period:
- Payslip.objects.get(employee=emp, payroll_period=period)
- Unique constraint ensures one per employee-period
```

### Related Model Queries

#### From PayrollPeriod to Payslips
```
Access period's payslips:
- period.payslips.all()
- period.payslips.filter(status='GENERATED')
- period.payslips.select_related('employee')
```

#### From Payslip to Period
```
Access payslip's period:
- payslip.payroll_period
- payslip.payroll_period.start_date
- payslip.payroll_period.end_date
- payslip.payroll_period.name
```

### Cascade Delete Considerations

When a PayrollPeriod is deleted:

1. **Automatic Deletion**
   - All associated payslips deleted
   - CASCADE behavior in database
   - Removes historical records

2. **Production Considerations**
   - Periods rarely deleted in production
   - Historical data preservation important
   - Consider PROTECT instead of CASCADE

3. **Alternative Approaches**
   - Use on_delete=PROTECT
   - Prevent accidental period deletion
   - Require explicit payslip cleanup

### Period-Based Features

1. **Bulk Operations**
   - Generate all payslips for period
   - Send all emails for period
   - Track completion by period

2. **Filtering and Search**
   - Filter by month/year
   - Filter by period status
   - Historical period access

3. **Reporting**
   - Period distribution statistics
   - Employee engagement by period
   - Trend analysis across periods

### Expected Outcome
- payroll_period foreign key added to Payslip
- Relationship enables period-based operations
- Foundation for bulk generation
- Performance optimized with index

### Verification Checklist
- [ ] payroll_period field added to Payslip model
- [ ] ForeignKey references PayrollPeriod model
- [ ] on_delete=CASCADE configured
- [ ] related_name='payslips' set
- [ ] db_index=True for performance
- [ ] Field is required (null=False)
- [ ] Docstring comments added

---

## Task 07: Add Payslip Employee Payroll FK

### Overview
Add a foreign key relationship from Payslip to EmployeePayroll, linking the payslip document to the source payroll calculation data. This relationship provides access to all salary components, deductions, and calculations used to generate the payslip.

### Dependencies
- Task 04: Create Payslip Model
- EmployeePayroll model exists (payroll app)

### Instructions

1. **Open payslip model file**
   - Navigate to `apps/payslip/models/payslip.py`
   - Locate Payslip model class
   - Prepare to add employee_payroll field

2. **Import EmployeePayroll model**
   - Add import statement for EmployeePayroll
   - Import from apps.payroll.models
   - Use string reference if needed

3. **Add employee_payroll foreign key field**
   - Field name: employee_payroll
   - ForeignKey to EmployeePayroll model
   - CASCADE delete behavior
   - Add related_name='payslips'

4. **Configure field options**
   - Set verbose_name='Employee Payroll'
   - Add help_text describing purpose
   - Ensure field is required (null=False)

5. **Add database index**
   - Set db_index=True for performance
   - Enables fast payroll-based lookups
   - Improves PDF generation queries

6. **Configure uniqueness**
   - Typically one payslip per employee_payroll
   - Consider unique=True
   - Or use unique_together with employee/period

7. **Document the relationship**
   - Add docstring comment
   - Explain data source relationship
   - Note usage in PDF generation

### EmployeePayroll Foreign Key Details

| Property | Value | Purpose |
|----------|-------|---------|
| Field Name | employee_payroll | Links to EmployeePayroll model |
| Model Reference | EmployeePayroll (payroll.models) | Target model |
| Delete Behavior | CASCADE | Delete payslip when payroll deleted |
| Related Name | payslips | Access from payroll: payroll.payslips.all() |
| Null Allowed | False | Every payslip needs payroll data |
| Database Index | True | Fast lookups by payroll |

### Foreign Key Relationship

```
EmployeePayroll (payroll app)
    │
    │ One-to-One (typically)
    │
    ▼
Payslip (payslip app)
    │
    └── One payslip per payroll record
        (may regenerate, updating same payslip)
```

### Data Flow Architecture

```
EmployeePayroll (Source Data)
├── Basic salary
├── Allowances (transport, medical, etc.)
├── Overtime calculations
├── EPF/ETF/PAYE deductions
├── Other deductions
├── Net salary calculation
│
└──→ Used to Generate ─→ Payslip (Document)
                         ├── PDF with formatted data
                         ├── Email distribution
                         └── Employee self-service access
```

### Usage Scenarios

#### PDF Generation
```
Generate payslip PDF:
1. Get Payslip record
2. Access payslip.employee_payroll
3. Extract all salary components
4. Format earnings table
5. Format deductions table
6. Calculate totals
7. Render HTML template
8. Convert to PDF
```

#### Data Access from Payslip
```
From payslip, access all payroll data:
- payslip.employee_payroll.basic_salary
- payslip.employee_payroll.gross_salary
- payslip.employee_payroll.net_salary
- payslip.employee_payroll.epf_employee
- payslip.employee_payroll.get_all_earnings()
- payslip.employee_payroll.get_all_deductions()
```

#### Regeneration Workflow
```
Regenerate payslip:
1. Locate existing Payslip record
2. employee_payroll FK unchanged
3. Generate new PDF from same data
4. Update PDF file field
5. Update generated_at timestamp
```

### Relationship to Other Foreign Keys

```
Payslip Model Foreign Keys:
├── employee (FK → Employee)
│   └── Quick access to employee info
├── payroll_period (FK → PayrollPeriod)
│   └── Quick access to period info
└── employee_payroll (FK → EmployeePayroll)
    └── Access to full payroll calculation
    
Note: employee and payroll_period are denormalized
      (also accessible via employee_payroll)
      but stored directly for query efficiency
```

### Denormalization Rationale

```
Why store employee and period separately?

1. Query Performance
   - Avoid joins for common queries
   - Filter by employee without join
   - Filter by period without join

2. Historical Integrity
   - Direct reference preserved
   - Independent of payroll changes
   - Audit trail maintained

3. API Response Efficiency
   - Return employee info without join
   - Return period info without join
   - Faster list views
```

### Cascade Delete Implications

When an EmployeePayroll is deleted:

1. **Automatic Deletion**
   - Associated payslip(s) deleted
   - PDF files may become orphaned
   - Consider cleanup tasks

2. **Production Considerations**
   - Payroll records rarely deleted
   - Historical preservation important
   - Consider PROTECT instead

3. **Regeneration Handling**
   - If payroll recalculated
   - Update EmployeePayroll in place
   - Keep same payslip, regenerate PDF

### Expected Outcome
- employee_payroll foreign key added to Payslip
- Relationship links to source payroll data
- Foundation for PDF generation
- Data access optimized

### Verification Checklist
- [ ] employee_payroll field added to Payslip model
- [ ] ForeignKey references EmployeePayroll model
- [ ] on_delete=CASCADE configured
- [ ] related_name='payslips' set
- [ ] db_index=True for performance
- [ ] Field is required (null=False)
- [ ] Docstring comments added

---

## Task 08: Add Payslip Number Field

### Overview
Add an auto-generated, human-readable payslip number field that uniquely identifies each payslip document. The format follows the pattern PAY-{YEAR}-{MONTH}-{SEQUENCE}, providing easy reference and organization.

### Dependencies
- Task 04: Create Payslip Model
- Task 06: Add Payslip Period FK

### Instructions

1. **Open payslip model file**
   - Navigate to `apps/payslip/models/payslip.py`
   - Locate Payslip model class
   - Prepare to add slip_number field

2. **Add slip_number CharField**
   - Field name: slip_number
   - Type: CharField
   - Max length: 50 characters
   - Set unique=True
   - Set blank=True for auto-generation

3. **Configure field options**
   - Set verbose_name='Slip Number'
   - Add help_text with format example
   - Set editable=False (auto-generated)
   - Add db_index=True

4. **Create number generation method**
   - Add _generate_slip_number() method
   - Extract year and month from period
   - Query existing payslips for month
   - Calculate next sequence number
   - Format with leading zeros

5. **Override save method**
   - Check if slip_number is empty
   - Call _generate_slip_number()
   - Assign to slip_number field
   - Call super().save()

6. **Add format documentation**
   - Document number format in docstring
   - Explain generation logic
   - Provide examples

7. **Implement retry logic**
   - Handle race conditions
   - Retry if unique constraint violated
   - Maximum retry attempts

8. **Update __str__ method**
   - Return slip_number as string representation
   - Makes payslip instances readable
   - Useful in admin and debugging

### Slip Number Format

```
Format: PAY-{YEAR}-{MONTH}-{SEQUENCE}

Components:
├── Prefix: PAY
├── Year: 4-digit year (2026)
├── Month: 2-digit month (01-12)
└── Sequence: 3-digit sequence (001-999)

Examples:
├── PAY-2026-01-001  (First payslip of January 2026)
├── PAY-2026-01-002  (Second payslip of January 2026)
├── PAY-2026-02-001  (First payslip of February 2026)
└── PAY-2026-12-150  (150th payslip of December 2026)
```

### Number Generation Logic

```
Generation Steps:

1. Extract Period Information
   - Get payroll_period from Payslip
   - Extract year from period.start_date
   - Extract month from period.start_date

2. Find Existing Payslips
   - Query Payslips for same tenant
   - Filter by year and month in slip_number
   - Count existing payslips

3. Calculate Sequence
   - Count existing + 1
   - Handle gaps from deletions
   - Ensure unique sequence

4. Format Number
   - Combine: f"PAY-{year}-{month:02d}-{seq:03d}"
   - Example: PAY-2026-01-001

5. Validate Uniqueness
   - Check against existing slip_numbers
   - Retry if duplicate (race condition)
   - Maximum 5 retry attempts
```

### Generation Method Implementation

The _generate_slip_number() method should:

1. **Extract Date Components**
   - Get year from payroll_period.start_date
   - Get month from payroll_period.start_date
   - Handle timezone considerations

2. **Query Existing Numbers**
   - Filter by tenant
   - Filter by year-month pattern in slip_number
   - Use regex or LIKE query
   - Count results

3. **Calculate Next Sequence**
   - Start from 1
   - Increment for each existing payslip
   - Format with leading zeros (001, 002, ...)

4. **Handle Edge Cases**
   - Missing payroll_period (raise exception)
   - Deleted payslips (sequence has gaps)
   - Concurrent generation (race conditions)

### Save Method Override

```
Override save() to auto-generate number:

1. Check Conditions
   - If slip_number is empty/blank
   - And payroll_period is set

2. Generate Number
   - Call _generate_slip_number()
   - Assign to self.slip_number

3. Handle Errors
   - Catch uniqueness violations
   - Retry with updated sequence
   - Maximum retry limit

4. Call Super
   - super().save(*args, **kwargs)
   - Complete normal save process
```

### Uniqueness and Indexing

| Property | Configuration | Purpose |
|----------|--------------|---------|
| unique=True | Enforce at database level | Prevent duplicate numbers |
| db_index=True | Create database index | Fast lookup by number |
| editable=False | Hide from admin forms | Prevent manual editing |
| blank=True | Allow empty on creation | Enable auto-generation |

### Usage Scenarios

#### Display in Lists
```
Admin list view:
- PAY-2026-01-001 | John Doe | January 2026
- PAY-2026-01-002 | Jane Smith | January 2026
```

#### API Responses
```json
{
  "slip_number": "PAY-2026-01-001",
  "employee": "John Doe",
  "period": "January 2026"
}
```

#### PDF Generation
```
Header of PDF document:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
      PAYSLIP
  PAY-2026-01-001
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

#### Search and Filter
```
Search by slip number:
- Exact match: PAY-2026-01-001
- Partial match: PAY-2026-01
- Range search: PAY-2026-01-001 to PAY-2026-01-050
```

### Race Condition Handling

```
Concurrent Generation Scenario:

Time | User A | User B
-----|--------|--------
T1   | Query count: 5 | Query count: 5
T2   | Generate: PAY-2026-01-006 | Generate: PAY-2026-01-006
T3   | Save → Success | Save → Unique constraint error
T4   | - | Retry: Query count: 6
T5   | - | Generate: PAY-2026-01-007
T6   | - | Save → Success

Solution: Retry with updated sequence on constraint violation
```

### Expected Outcome
- slip_number field added to Payslip model
- Auto-generation on save implemented
- Unique, human-readable identifiers
- Foundation for document referencing

### Verification Checklist
- [ ] slip_number CharField added
- [ ] unique=True and db_index=True set
- [ ] _generate_slip_number() method created
- [ ] save() method overridden
- [ ] Number format: PAY-YYYY-MM-SSS
- [ ] Uniqueness enforced
- [ ] Race condition handling implemented
- [ ] __str__ method updated to return slip_number

---

## Summary

This document established the foundational elements of the payslip generation system:

1. **App Structure** - Created payslip Django app with organized directories
2. **App Registration** - Registered as TENANT_APP for multi-tenant support
3. **Status Choices** - Defined PayslipStatus workflow (DRAFT → GENERATED → SENT → VIEWED → DOWNLOADED)
4. **Core Model** - Created Payslip model with base fields
5. **Employee Link** - Added employee FK for ownership and access control
6. **Period Link** - Added payroll_period FK for period-based operations
7. **Payroll Data Link** - Added employee_payroll FK to source calculation data
8. **Slip Number** - Implemented auto-generated human-readable identifiers

The Payslip model now has:
- Multi-tenant isolation via tenant FK
- Employee relationship for self-service access
- Period relationship for bulk operations
- Payroll data relationship for PDF generation
- Unique slip number for document identification
- Status tracking capability

Next document will add status fields, PDF file storage, email tracking, view/download tracking, and apply migrations.
