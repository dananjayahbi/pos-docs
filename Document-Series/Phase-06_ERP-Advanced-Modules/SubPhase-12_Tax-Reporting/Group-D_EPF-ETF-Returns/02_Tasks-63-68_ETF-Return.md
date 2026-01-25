# Tasks 63-68: ETF Return Generator

> **Phase:** 06 - ERP Advanced Modules  
> **SubPhase:** 12 - Tax Reporting  
> **Group:** D - EPF/ETF Returns  
> **Document:** 02 of 02  
> **Tasks Covered:** 63, 64, 65, 66, 67, 68

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-51-62_EPF-Return-CForm.md](01_Tasks-51-62_EPF-Return-CForm.md)

---

## Document Overview

This document covers the implementation of ETF (Employees' Trust Fund) return generation for Sri Lanka statutory compliance. Includes the ETFReturn model for 3% employer-only contribution data, the ETFReturnGenerator service class, ETF PDF generation in ETF Board compliant format, and API endpoint for return submission.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 63 | Create ETFReturn model | Medium | 30 min |
| 64 | Add ETF contribution fields | Low | 15 min |
| 65 | Run ETFReturn migrations | Low | 10 min |
| 66 | Create ETFReturnGenerator class | Medium | 40 min |
| 67 | Create ETF PDF template | Medium | 35 min |
| 68 | Create ETF API endpoint | Low | 20 min |

---

## Task 63: Create ETFReturn Model

### Overview
Create the ETFReturn model to store ETF (Employees' Trust Fund) return data for submission to the ETF Board. This model captures the employer-only 3% contribution calculated on gross salary. ETF is distinct from EPF and has no employee contribution component.

### Dependencies
- Accounting application (`apps/accounting/`) must exist
- TaxPeriod model must exist (from VAT implementation)
- Django project structure is established
- Task 62: EPF CSV export completed

### Instructions

1. **Create ETF return model file**
   - Navigate to `apps/accounting/models/` directory
   - Create new file named `etf_return.py`
   - This will contain the ETFReturn model

2. **Add necessary imports**
   - Import Django model base classes
   - Import DecimalField, JSONField, DateField, CharField
   - Import TaxPeriod model
   - Import BaseModel from core mixins

3. **Create ETFReturn model class**
   - Inherit from BaseModel
   - Define model docstring explaining ETF return purpose
   - Set appropriate Meta options

4. **Configure model metadata**
   - Set `db_table = 'accounting_etf_returns'`
   - Set `verbose_name = 'ETF Return'`
   - Set `verbose_name_plural = 'ETF Returns'`
   - Set `ordering = ['-period__start_date']`

5. **Add model __str__ method**
   - Return format: "ETF Return - {period} - {employer_reg_no}"
   - Provide clear identification of return

6. **Register model in models package**
   - Open `apps/accounting/models/__init__.py`
   - Import ETFReturn
   - Add to `__all__` list

### ETF Return Purpose

| Purpose | Details |
|---------|---------|
| Authority | Employees' Trust Fund Board |
| Form Name | ETF Monthly Return |
| Frequency | Monthly |
| Employee Contribution | 0% (No employee contribution) |
| Employer Contribution | 3% of gross salary |
| Total Contribution | 3% of gross salary |

### ETF Contribution Breakdown

```
Gross Salary: 100,000 LKR

Employer Contribution (3%):    3,000 LKR
TOTAL ETF CONTRIBUTION:        3,000 LKR
```

### Model Design Considerations

| Aspect | Approach |
|--------|----------|
| Period tracking | Foreign key to TaxPeriod |
| Contribution amount | DecimalField with high precision |
| Employee schedule | JSONField for detailed breakdown |
| Employer info | CharField for registration number |
| Status tracking | CharField for submission status |

### Expected Outcome
- ETFReturn model defined in `etf_return.py`
- Model registered in models package
- Foundation for ETF return generation
- Ready for field definitions in Task 64

### Verification Checklist
- [ ] `apps/accounting/models/etf_return.py` file created
- [ ] ETFReturn model class defined
- [ ] Inherits from BaseModel
- [ ] Model docstring added
- [ ] Meta class configured
- [ ] `__str__` method implemented
- [ ] Model imported in `__init__.py`
- [ ] Added to `__all__` list

---

## Task 64: Add ETF Contribution Fields

### Overview
Add all necessary fields to the ETFReturn model to capture ETF contribution data. This includes the tax period reference, employer registration number, contribution calculations, employee schedule, and return status fields. ETF is 3% employer-only contribution.

### Dependencies
- Task 63: Create ETFReturn model

### Instructions

1. **Add period foreign key**
   - Field name: `period`
   - Type: ForeignKey to TaxPeriod
   - `on_delete=models.PROTECT`
   - `related_name='etf_returns'`
   - Help text: "Tax period for this ETF return"

2. **Add employer registration number**
   - Field name: `employer_reg_no`
   - Type: CharField
   - Max length: 50
   - Help text: "ETF Board employer registration number (format: ETF/XXXXXX)"

3. **Add total contribution field**
   - Field name: `total_contribution`
   - Type: DecimalField
   - `max_digits=15, decimal_places=2`
   - Default: 0
   - Help text: "Total employer ETF contribution (3% of gross salary)"

4. **Add total gross salary field**
   - Field name: `total_gross_salary`
   - Type: DecimalField
   - `max_digits=15, decimal_places=2`
   - Default: 0
   - Help text: "Total gross salary for all employees"

5. **Add total employees count**
   - Field name: `total_employees`
   - Type: IntegerField
   - Default: 0
   - Help text: "Total number of employees in this return"

6. **Add employee schedule JSONField**
   - Field name: `employee_schedule`
   - Type: JSONField
   - Default: dict
   - Help text: "Detailed breakdown of employee ETF contributions"

7. **Add return status field**
   - Field name: `status`
   - Type: CharField
   - Max length: 20
   - Choices: DRAFT, SUBMITTED, PAID, REJECTED
   - Default: 'DRAFT'
   - Help text: "Current status of ETF return"

8. **Add submission date field**
   - Field name: `submission_date`
   - Type: DateField
   - `null=True, blank=True`
   - Help text: "Date when return was submitted to ETF Board"

9. **Add payment date field**
   - Field name: `payment_date`
   - Type: DateField
   - `null=True, blank=True`
   - Help text: "Date when ETF contribution was paid"

10. **Add notes field**
    - Field name: `notes`
    - Type: TextField
    - `blank=True`
    - Help text: "Additional notes or remarks about this return"

### ETF Field Structure

| Field | Type | Purpose |
|-------|------|---------|
| period | FK | Links to tax period |
| employer_reg_no | CharField | ETF registration ID |
| total_contribution | DecimalField | 3% employer contribution |
| total_gross_salary | DecimalField | Base for calculation |
| total_employees | IntegerField | Employee count |
| employee_schedule | JSONField | Detailed breakdown |
| status | CharField | Return workflow status |
| submission_date | DateField | Submission tracking |
| payment_date | DateField | Payment tracking |
| notes | TextField | Additional information |

### ETF Status Workflow

```
DRAFT → SUBMITTED → PAID
           ↓
        REJECTED
```

| Status | Description |
|--------|-------------|
| DRAFT | Return being prepared |
| SUBMITTED | Submitted to ETF Board |
| PAID | Contribution payment completed |
| REJECTED | Return rejected by ETF Board |

### Employee Schedule JSON Structure

```json
{
  "employees": [
    {
      "employee_id": "EMP001",
      "nic": "199012345678",
      "name": "Kasun Perera",
      "gross_salary": 100000.00,
      "etf_contribution": 3000.00
    },
    {
      "employee_id": "EMP002",
      "nic": "198512345679",
      "name": "Nimal Silva",
      "gross_salary": 150000.00,
      "etf_contribution": 4500.00
    }
  ],
  "summary": {
    "total_employees": 2,
    "total_gross_salary": 250000.00,
    "total_contribution": 7500.00,
    "calculation_date": "2026-01-31"
  }
}
```

### Calculation Logic

```
For each employee:
    ETF Contribution = Gross Salary × 3%

Total ETF Contribution = Sum of all employee ETF contributions
```

### Validation Rules

| Rule | Validation |
|------|------------|
| Period uniqueness | One return per period |
| Employer reg format | Must match ETF/XXXXXX pattern |
| Contribution accuracy | Must equal 3% of gross salary |
| Employee count | Must match schedule count |
| Status transitions | Must follow workflow |

### Expected Outcome
- All fields added to ETFReturn model
- Model ready for migrations
- Comprehensive ETF data capture
- Status workflow support

### Verification Checklist
- [ ] Period foreign key added
- [ ] Employer registration number added
- [ ] Total contribution field added
- [ ] Total gross salary field added
- [ ] Total employees field added
- [ ] Employee schedule JSONField added
- [ ] Status field with choices added
- [ ] Submission date field added
- [ ] Payment date field added
- [ ] Notes field added
- [ ] All help texts provided
- [ ] Field constraints defined

---

## Task 65: Run ETFReturn Migrations

### Overview
Generate and apply Django migrations for the ETFReturn model to create the database table and fields. This task ensures the model is properly registered in the database schema.

### Dependencies
- Task 64: Add ETF contribution fields

### Instructions

1. **Generate migration file**
   - Open terminal in project root
   - Activate virtual environment
   - Run: `python manage.py makemigrations accounting`
   - Review generated migration file

2. **Verify migration content**
   - Check `apps/accounting/migrations/` directory
   - Find new migration file (e.g., `0022_etfreturn.py`)
   - Verify all fields are included
   - Check field types and constraints

3. **Apply migration**
   - Run: `python manage.py migrate accounting`
   - Confirm successful table creation
   - Verify no errors in output

4. **Verify database table**
   - Connect to database
   - Check `accounting_etf_returns` table exists
   - Verify column definitions
   - Check indexes and constraints

### Migration Checklist

| Item | Status |
|------|--------|
| Migration file generated | Check |
| All fields present | Check |
| Field types correct | Check |
| Foreign keys defined | Check |
| Migration applied | Check |
| Table created | Check |

### Expected Migration Operations

```
CreateModel:
    name='ETFReturn'
    fields=[
        ('id', models.BigAutoField(primary_key=True)),
        ('created_at', models.DateTimeField(auto_now_add=True)),
        ('updated_at', models.DateTimeField(auto_now=True)),
        ('period', models.ForeignKey('TaxPeriod')),
        ('employer_reg_no', models.CharField(max_length=50)),
        ('total_contribution', models.DecimalField()),
        ('total_gross_salary', models.DecimalField()),
        ('total_employees', models.IntegerField()),
        ('employee_schedule', models.JSONField()),
        ('status', models.CharField(max_length=20)),
        ('submission_date', models.DateField(null=True)),
        ('payment_date', models.DateField(null=True)),
        ('notes', models.TextField(blank=True)),
    ]
```

### Troubleshooting

| Issue | Solution |
|-------|----------|
| Migration conflicts | Resolve merge conflicts |
| Missing dependencies | Check TaxPeriod model exists |
| JSONField error | Ensure PostgreSQL database |
| Foreign key error | Verify related model |

### Expected Outcome
- Migration file created successfully
- Database table created
- All fields and constraints applied
- Model ready for use

### Verification Checklist
- [ ] Migration file generated
- [ ] Migration file reviewed
- [ ] Migration applied successfully
- [ ] Database table exists
- [ ] All columns present
- [ ] Constraints applied
- [ ] Foreign key relationship created
- [ ] No migration warnings

---

## Task 66: Create ETFReturnGenerator Class

### Overview
Create the ETFReturnGenerator service class to handle ETF return generation, data aggregation from payroll, and PDF generation. This class encapsulates all business logic for creating ETF returns with 3% employer contributions.

### Dependencies
- Task 65: Run ETFReturn migrations
- PayrollPeriod and PayrollEntry models must exist
- PDF generation utilities available

### Instructions

1. **Create ETF return generator file**
   - Navigate to `apps/accounting/tax/generators/` directory
   - Create new file named `etf_return.py`
   - This will contain the ETFReturnGenerator class

2. **Add necessary imports**
   - Import ETFReturn model
   - Import TaxPeriod model
   - Import PayrollPeriod, PayrollEntry models
   - Import timezone utilities
   - Import Decimal for calculations

3. **Create ETFReturnGenerator class**
   - Define class with proper docstring
   - Initialize with tenant and tax period
   - Set up class attributes

4. **Add get_etf_data method**
   - Fetch payroll data for period
   - Aggregate gross salaries
   - Calculate 3% contributions
   - Return structured data dictionary

5. **Add calculate_etf_contribution method**
   - Accept gross salary amount
   - Apply 3% rate
   - Return contribution amount
   - Handle rounding properly

6. **Add build_employee_schedule method**
   - Iterate through payroll entries
   - Extract employee details
   - Calculate individual contributions
   - Build JSON structure

7. **Add generate_return method**
   - Orchestrate data gathering
   - Create or update ETFReturn instance
   - Populate all fields
   - Return ETFReturn object

8. **Add validate_return method**
   - Check calculation accuracy
   - Verify employee count matches
   - Validate contribution totals
   - Return validation result

9. **Register generator in package**
   - Open `apps/accounting/tax/generators/__init__.py`
   - Import ETFReturnGenerator
   - Add to `__all__` list

### ETFReturnGenerator Architecture

| Component | Purpose |
|-----------|---------|
| `__init__` | Initialize with period and tenant |
| `get_etf_data` | Aggregate payroll data |
| `calculate_etf_contribution` | Apply 3% rate |
| `build_employee_schedule` | Create JSON breakdown |
| `generate_return` | Main orchestration method |
| `validate_return` | Verify calculations |

### ETF Calculation Flow

```
1. Get Tax Period
2. Find Matching Payroll Period
3. Fetch Payroll Entries
4. For Each Employee:
   - Get Gross Salary
   - Calculate ETF = Gross × 3%
   - Add to Employee Schedule
5. Sum Total Contributions
6. Create ETFReturn Record
7. Validate Calculations
8. Return ETFReturn Object
```

### Data Aggregation Logic

| Step | Action |
|------|--------|
| 1 | Query payroll entries for period |
| 2 | Filter by tenant |
| 3 | Extract gross salary per employee |
| 4 | Calculate 3% for each |
| 5 | Sum all contributions |
| 6 | Build employee schedule JSON |
| 7 | Populate ETFReturn fields |

### ETF Contribution Formula

```
ETF Contribution = Gross Salary × 0.03

Example:
Employee Gross Salary: 100,000 LKR
ETF Contribution: 100,000 × 0.03 = 3,000 LKR
```

### Employee Schedule Building

```python
employee_schedule = {
    "employees": [],
    "summary": {}
}

for payroll_entry in payroll_entries:
    gross_salary = payroll_entry.gross_salary
    etf_amount = gross_salary * Decimal('0.03')
    
    employee_schedule["employees"].append({
        "employee_id": payroll_entry.employee.employee_id,
        "nic": payroll_entry.employee.nic,
        "name": payroll_entry.employee.full_name,
        "gross_salary": float(gross_salary),
        "etf_contribution": float(etf_amount)
    })

employee_schedule["summary"] = {
    "total_employees": len(payroll_entries),
    "total_gross_salary": float(total_gross),
    "total_contribution": float(total_etf),
    "calculation_date": period.end_date.isoformat()
}
```

### Validation Rules

| Validation | Check |
|------------|-------|
| Period match | Payroll and tax periods align |
| Calculation accuracy | 3% of gross salary |
| Employee count | Matches schedule length |
| Total contribution | Sum of individual amounts |
| Data completeness | All required fields populated |

### Error Handling

| Error | Handling |
|-------|----------|
| No payroll data | Return empty return with zero amounts |
| Missing employee data | Skip and log warning |
| Calculation mismatch | Raise validation error |
| Invalid period | Raise ValueError |

### Expected Outcome
- ETFReturnGenerator class created
- Data aggregation methods implemented
- ETF calculation logic working
- Employee schedule generation functional
- Validation rules enforced

### Verification Checklist
- [ ] `etf_return.py` file created in generators/
- [ ] ETFReturnGenerator class defined
- [ ] `__init__` method implemented
- [ ] `get_etf_data` method added
- [ ] `calculate_etf_contribution` method added
- [ ] `build_employee_schedule` method added
- [ ] `generate_return` method added
- [ ] `validate_return` method added
- [ ] Generator registered in package
- [ ] Comprehensive docstrings added

---

## Task 67: Create ETF PDF Template

### Overview
Create the ETF return PDF template in ETF Board compliant format for generating printable ETF returns. This template includes employer details, contribution summary, and employee schedule following the official ETF Board format specifications.

### Dependencies
- Task 66: Create ETFReturnGenerator class
- PDF rendering utilities available
- Template system configured

### Instructions

1. **Create ETF template file**
   - Navigate to `apps/accounting/templates/tax/` directory
   - Create new file named `etf_return.html`
   - This will contain the ETF return template

2. **Add template structure**
   - Define HTML structure for ETF return
   - Include header with ETF Board branding
   - Add employer information section
   - Include contribution summary

3. **Add employer details section**
   - Display employer registration number
   - Show company name and address
   - Include contact information
   - Add return period information

4. **Add contribution summary section**
   - Display total gross salary
   - Show total ETF contribution (3%)
   - Include total employee count
   - Add calculation date

5. **Add employee schedule table**
   - Create table with employee columns
   - Include: Employee ID, NIC, Name
   - Include: Gross Salary, ETF Contribution
   - Add row numbering

6. **Add footer section**
   - Include declaration statement
   - Add authorized signatory fields
   - Include submission date
   - Add ETF Board contact information

7. **Add print styling**
   - Define print-friendly CSS
   - Set page margins and sizes
   - Configure table formatting
   - Add page break controls

8. **Add PDF generation method to generator**
   - Open `apps/accounting/tax/generators/etf_return.py`
   - Add `generate_pdf` method
   - Implement template rendering
   - Return PDF response

### ETF Return Template Structure

| Section | Content |
|---------|---------|
| Header | ETF Board logo and title |
| Employer Info | Registration, company details |
| Period Info | Month and year |
| Summary | Total amounts and counts |
| Employee Schedule | Detailed employee list |
| Footer | Declaration and signature |

### ETF Board Format Specifications

```
EMPLOYEES' TRUST FUND BOARD
Monthly Contribution Return

Employer Registration No: ETF/XXXXXX
Company Name: ABC Company (Pvt) Ltd
Return Period: January 2026

CONTRIBUTION SUMMARY
Total Number of Employees: 50
Total Gross Salary: LKR 5,000,000.00
Total ETF Contribution (3%): LKR 150,000.00

EMPLOYEE SCHEDULE (See attached)
```

### Employee Schedule Table Format

| # | Employee ID | NIC | Name | Gross Salary | ETF (3%) |
|---|-------------|-----|------|--------------|----------|
| 1 | EMP001 | 199012345678 | Kasun Perera | 100,000.00 | 3,000.00 |
| 2 | EMP002 | 198512345679 | Nimal Silva | 150,000.00 | 4,500.00 |

### Declaration Section

```
DECLARATION

I declare that the information provided in this return is true and correct 
to the best of my knowledge and belief.

Authorized Signatory: ___________________

Name: ___________________

Designation: ___________________

Date: ___________________

Company Seal:
```

### Print Styling Considerations

| Aspect | Specification |
|--------|---------------|
| Page size | A4 |
| Orientation | Portrait |
| Margins | 20mm all sides |
| Font size | 10pt body, 12pt headers |
| Line spacing | 1.2 |
| Table borders | 1px solid black |

### CSS Print Styles

```css
@media print {
    @page {
        size: A4;
        margin: 20mm;
    }
    
    .etf-return {
        font-family: Arial, sans-serif;
        font-size: 10pt;
    }
    
    .header {
        text-align: center;
        margin-bottom: 20px;
    }
    
    .summary-table {
        width: 100%;
        border-collapse: collapse;
        margin: 20px 0;
    }
    
    .employee-table {
        width: 100%;
        border-collapse: collapse;
        font-size: 9pt;
    }
    
    .page-break {
        page-break-after: always;
    }
}
```

### Template Variables

| Variable | Source |
|----------|--------|
| etf_return | ETFReturn model instance |
| employer_reg_no | etf_return.employer_reg_no |
| company_name | tenant.company_name |
| period | etf_return.period |
| total_contribution | etf_return.total_contribution |
| total_gross_salary | etf_return.total_gross_salary |
| total_employees | etf_return.total_employees |
| employee_schedule | etf_return.employee_schedule |

### PDF Generation Integration

```python
def generate_pdf(self, etf_return):
    """
    Generate PDF for ETF return.
    
    Args:
        etf_return: ETFReturn instance
    
    Returns:
        PDF file response
    """
    context = {
        'etf_return': etf_return,
        'company_name': self.tenant.company_name,
        'generation_date': timezone.now().date()
    }
    
    template = get_template('tax/etf_return.html')
    html = template.render(context)
    
    # Generate PDF using rendering library
    pdf = render_to_pdf(html)
    
    return pdf
```

### Expected Outcome
- ETF return PDF template created
- ETF Board compliant format
- Employee schedule included
- PDF generation method added
- Print-friendly styling applied

### Verification Checklist
- [ ] `etf_return.html` template created
- [ ] Header section implemented
- [ ] Employer details section added
- [ ] Contribution summary section added
- [ ] Employee schedule table created
- [ ] Footer with declaration added
- [ ] Print CSS styles defined
- [ ] PDF generation method added to generator
- [ ] Template variables properly referenced
- [ ] ETF Board format compliance verified

---

## Task 68: Create ETF API Endpoint

### Overview
Create REST API endpoint for ETF return generation and retrieval. This endpoint allows clients to generate new ETF returns, retrieve existing returns, update return status, and download PDF reports for submission to the ETF Board.

### Dependencies
- Task 67: Create ETF PDF template
- Django REST Framework configured
- Authentication middleware active

### Instructions

1. **Open tax views file**
   - Navigate to `apps/accounting/views/tax.py`
   - This file contains tax-related API endpoints

2. **Add necessary imports**
   - Import ETFReturn model
   - Import ETFReturnGenerator
   - Import serializers and viewsets
   - Import Response, status codes

3. **Create ETFReturn serializer**
   - Define ETFReturnSerializer class
   - Include all model fields
   - Add read-only fields for calculations
   - Add validation methods

4. **Create generate ETF return endpoint**
   - Define `POST /api/accounting/etf-returns/generate/`
   - Accept tax period ID in request
   - Call ETFReturnGenerator
   - Return generated ETF return data

5. **Create list ETF returns endpoint**
   - Define `GET /api/accounting/etf-returns/`
   - Support filtering by period, status
   - Support pagination
   - Return list of ETF returns

6. **Create retrieve ETF return endpoint**
   - Define `GET /api/accounting/etf-returns/{id}/`
   - Fetch specific ETF return
   - Include employee schedule
   - Return full ETF return data

7. **Create update ETF return status endpoint**
   - Define `PATCH /api/accounting/etf-returns/{id}/status/`
   - Accept new status value
   - Validate status transition
   - Update and return ETF return

8. **Create download ETF PDF endpoint**
   - Define `GET /api/accounting/etf-returns/{id}/pdf/`
   - Call ETFReturnGenerator.generate_pdf()
   - Return PDF file response
   - Set appropriate content type

9. **Add endpoint documentation**
   - Add docstrings to all endpoints
   - Document request/response formats
   - Add usage examples
   - Document error responses

10. **Register URLs**
    - Open `apps/accounting/urls.py`
    - Add ETF return URL patterns
    - Include viewset routes
    - Test URL configuration

### API Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/accounting/etf-returns/generate/` | Generate new ETF return |
| GET | `/api/accounting/etf-returns/` | List all ETF returns |
| GET | `/api/accounting/etf-returns/{id}/` | Retrieve specific return |
| PATCH | `/api/accounting/etf-returns/{id}/status/` | Update return status |
| GET | `/api/accounting/etf-returns/{id}/pdf/` | Download ETF PDF |

### Generate ETF Return Request

```json
POST /api/accounting/etf-returns/generate/

{
  "period_id": 12,
  "employer_reg_no": "ETF/000123"
}
```

### Generate ETF Return Response

```json
{
  "id": 45,
  "period": {
    "id": 12,
    "start_date": "2026-01-01",
    "end_date": "2026-01-31",
    "period_type": "MONTHLY"
  },
  "employer_reg_no": "ETF/000123",
  "total_contribution": "150000.00",
  "total_gross_salary": "5000000.00",
  "total_employees": 50,
  "status": "DRAFT",
  "submission_date": null,
  "payment_date": null,
  "employee_schedule": {
    "employees": [...],
    "summary": {...}
  },
  "created_at": "2026-01-25T10:30:00Z",
  "updated_at": "2026-01-25T10:30:00Z"
}
```

### List ETF Returns Request

```
GET /api/accounting/etf-returns/?period=12&status=SUBMITTED
```

### List ETF Returns Response

```json
{
  "count": 2,
  "next": null,
  "previous": null,
  "results": [
    {
      "id": 45,
      "period": {...},
      "employer_reg_no": "ETF/000123",
      "total_contribution": "150000.00",
      "status": "SUBMITTED",
      "submission_date": "2026-02-15"
    },
    {...}
  ]
}
```

### Update Status Request

```json
PATCH /api/accounting/etf-returns/45/status/

{
  "status": "SUBMITTED",
  "submission_date": "2026-02-15"
}
```

### Download PDF Request

```
GET /api/accounting/etf-returns/45/pdf/
```

### Download PDF Response

```
Content-Type: application/pdf
Content-Disposition: attachment; filename="ETF_Return_Jan_2026.pdf"

[PDF binary data]
```

### Serializer Structure

```python
class ETFReturnSerializer(serializers.ModelSerializer):
    period = TaxPeriodSerializer(read_only=True)
    period_id = serializers.IntegerField(write_only=True)
    
    class Meta:
        model = ETFReturn
        fields = [
            'id', 'period', 'period_id',
            'employer_reg_no', 'total_contribution',
            'total_gross_salary', 'total_employees',
            'employee_schedule', 'status',
            'submission_date', 'payment_date',
            'notes', 'created_at', 'updated_at'
        ]
        read_only_fields = [
            'total_contribution', 'total_gross_salary',
            'total_employees', 'employee_schedule'
        ]
```

### Status Transition Validation

| From | To | Valid |
|------|-----|-------|
| DRAFT | SUBMITTED | Yes |
| SUBMITTED | PAID | Yes |
| SUBMITTED | REJECTED | Yes |
| REJECTED | DRAFT | Yes |
| PAID | Any | No |

### Error Responses

| Error | Status Code | Response |
|-------|-------------|----------|
| Period not found | 404 | Period does not exist |
| Invalid period | 400 | No payroll data for period |
| Duplicate return | 400 | Return already exists for period |
| Invalid status | 400 | Invalid status transition |
| Permission denied | 403 | Not authorized |

### Authentication & Permissions

| Endpoint | Permission |
|----------|------------|
| Generate | `accounting.add_etfreturn` |
| List | `accounting.view_etfreturn` |
| Retrieve | `accounting.view_etfreturn` |
| Update status | `accounting.change_etfreturn` |
| Download PDF | `accounting.view_etfreturn` |

### Expected Outcome
- ETF return API endpoints created
- Generate, list, retrieve, update, download functionality
- Proper validation and error handling
- ETF Board submission ready

### Verification Checklist
- [ ] ETFReturnSerializer created
- [ ] Generate ETF return endpoint implemented
- [ ] List ETF returns endpoint implemented
- [ ] Retrieve ETF return endpoint implemented
- [ ] Update status endpoint implemented
- [ ] Download PDF endpoint implemented
- [ ] URL patterns registered
- [ ] Endpoint documentation added
- [ ] Authentication configured
- [ ] Permissions checked
- [ ] Error handling implemented
- [ ] Status validation working

---

## Notes for AI Agents

### ETF Contribution Rate
```
Employer Contribution: 3% of Gross Salary
Employee Contribution: 0% (No employee contribution)
```

### Calculation Example
```
Employee 1: Gross Salary = 100,000 LKR
  → ETF = 100,000 × 0.03 = 3,000 LKR

Employee 2: Gross Salary = 150,000 LKR
  → ETF = 150,000 × 0.03 = 4,500 LKR

Total ETF Contribution = 3,000 + 4,500 = 7,500 LKR
```

### ETF vs EPF Comparison

| Aspect | EPF | ETF |
|--------|-----|-----|
| Employee Contribution | 8% | 0% |
| Employer Contribution | 12% | 3% |
| Total Rate | 20% | 3% |
| Authority | Central Bank (CBSL) | ETF Board |
| Form Name | C-Form | ETF Monthly Return |

### ETF Filing Requirements

| Requirement | Details |
|-------------|---------|
| Frequency | Monthly |
| Due Date | Last day of following month |
| Submission Method | Online portal or physical form |
| Payment Method | Bank transfer to ETF Board |
| Late Penalty | Interest on late payment |

### ETF Board Details
```
Employees' Trust Fund Board
No. 40, Nawam Mawatha
Colombo 02, Sri Lanka

Phone: +94 11 2446000
Website: www.etfb.lk
Email: info@etfb.lk
```

### Employee Eligibility
```
All private sector employees covered under:
- EPF Act No. 15 of 1958
- Employees registered with EPF

Exceptions:
- Government employees
- Employees of certain statutory bodies
- Casual workers (case by case)
```

### Return Format Summary
```
Section 1: Employer Information
  - Registration number
  - Company name and address
  - Contact details

Section 2: Period Information
  - Month and year
  - Number of working days

Section 3: Contribution Summary
  - Total gross salary
  - Total ETF contribution (3%)
  - Number of employees

Section 4: Employee Schedule
  - Individual employee details
  - NIC numbers
  - Gross salaries
  - ETF contributions

Section 5: Declaration
  - Authorized signatory
  - Company seal
  - Submission date
```

### Common Pitfalls

| Pitfall | Avoidance |
|---------|-----------|
| Including employee contribution | ETF is employer-only (3%) |
| Using wrong rate | Always 3%, not variable |
| Missing employees | Include all EPF members |
| Incorrect NIC | Validate NIC format |
| Late submission | Track deadlines |

### Integration Points

| System | Integration |
|--------|-------------|
| Payroll | Source of gross salary data |
| Employee Management | Employee details and NIC |
| Tax Periods | Period definition |
| PDF Generation | Return printing |
| API | External access |

---

## End of Document

**Document Status:** Complete  
**Total Tasks:** 6  
**Task Range:** 63-68  
**Estimated Total Time:** 2.5 hours
