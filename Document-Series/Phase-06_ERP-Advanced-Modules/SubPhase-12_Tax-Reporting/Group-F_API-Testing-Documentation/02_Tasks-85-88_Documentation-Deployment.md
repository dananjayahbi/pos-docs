# Tasks 85-88: Documentation & Deployment

> **Phase:** 06 - ERP Advanced Modules  
> **SubPhase:** 12 - Tax Reporting  
> **Group:** F - API, Testing & Documentation  
> **Document:** 02 of 02  
> **Tasks Covered:** 85, 86, 87, 88

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-81-84_Integration-Testing.md](01_Tasks-81-84_Integration-Testing.md)
- **→ Next SubPhase:** [SubPhase-13_Dashboard-KPIs](../../SubPhase-13_Dashboard-KPIs/)

---

## Document Overview

This document covers API documentation creation and deployment configuration for the tax reporting module. Includes comprehensive API documentation for all tax endpoints (configuration, VAT, PAYE, EPF, ETF, submissions, reminders, calendar), Django admin configuration for tax models, URL routing setup, and deployment checklist. Ensures complete module documentation and production readiness.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 85 | Create Tax Admin Configuration | Medium | 40 min |
| 86 | Create Tax Serializers | Medium | 45 min |
| 87 | Create Tax ViewSet and URLs | High | 50 min |
| 88 | Create API Documentation | Medium | 45 min |

---

## Task 85: Create Tax Admin Configuration

### Overview
Configure Django admin interface for tax reporting models to enable administrative management through Django's built-in admin panel. Create custom admin classes for TaxConfiguration, TaxPeriodRecord, VAT/PAYE/EPF/ETF returns, and TaxSubmission. Add inline editors, list filters, search fields, and custom actions. Provides user-friendly interface for finance administrators to manage tax data without direct database access.

### Dependencies
- All tax models created and migrated
- Django admin site configured
- Admin user accounts created

### Instructions

1. **Create or open tax admin file**
   - Navigate to `apps/accounting/admin/` directory
   - Create file named `tax.py` if not exists
   - This contains all tax admin configurations

2. **Add admin imports**
   - Import admin from django.contrib
   - Import all tax models:
     - TaxConfiguration
     - TaxPeriodRecord
     - VATReturn, PAYEReturn, EPFReturn, ETFReturn
     - TaxSubmission
   - Import timezone utilities
   - Import admin helpers (readonly, inlines)

3. **Add module docstring**
   - Document admin configuration purpose
   - Note tax reporting admin interface
   - Explain customization for finance team
   - Reference admin URL path

4. **Create TaxConfigurationAdmin class**
   - Create class inheriting from admin.ModelAdmin
   - Add list_display:
     - tenant (if multi-tenant)
     - vat_enabled
     - vat_registration_number
     - epf_enabled
     - etf_enabled
   - Add fieldsets for organized form layout
   - Group by: VAT Settings, PAYE Settings, EPF Settings, ETF Settings
   - Make registration numbers prominent

5. **Configure VAT section fieldset**
   - Create fieldset titled "VAT Configuration"
   - Include fields:
     - vat_enabled (checkbox)
     - vat_registration_number
     - vat_rate (percentage)
     - vat_payment_terms
   - Add help text for each field

6. **Configure PAYE section fieldset**
   - Create fieldset titled "PAYE Configuration"
   - Include fields:
     - paye_enabled
     - paye_employer_number
     - paye_tax_brackets (JSON field or inline)
   - Add help text explaining brackets

7. **Configure EPF section fieldset**
   - Create fieldset titled "EPF Configuration"
   - Include fields:
     - epf_enabled
     - epf_employer_number
     - epf_employee_rate (default 8%)
     - epf_employer_rate (default 12%)
   - Show rates as percentages

8. **Configure ETF section fieldset**
   - Create fieldset titled "ETF Configuration"
   - Include fields:
     - etf_enabled
     - etf_employer_number
     - etf_rate (default 3%)
   - Note employer-only contribution

9. **Create TaxPeriodRecordAdmin class**
   - Create class for TaxPeriodRecord
   - Add list_display:
     - tax_type
     - period_start
     - period_end
     - status
     - due_date
     - days_remaining
   - Add list_filter: tax_type, status
   - Add search_fields: tax_type
   - Add ordering: ['-period_start']

10. **Add period status actions**
    - Create admin action: finalize_periods
    - Select multiple periods
    - Change status to FINALIZED
    - Add confirmation step
    - Log action

11. **Create VATReturnAdmin class**
    - Create class for VATReturn model
    - Set to read-only (returns generated, not edited)
    - Add list_display:
      - period
      - output_vat
      - input_vat
      - net_vat
      - status
      - generated_at
    - Add list_filter: status, generated_at
    - Add search by period

12. **Add VAT export actions**
    - Create admin action: export_vat_pdf
    - Select multiple returns
    - Generate PDF for each
    - Zip if multiple
    - Download bundle

13. **Create PAYEReturnAdmin class**
    - Create class for PAYEReturn model
    - Read-only display
    - Add list_display:
      - period
      - employee_count
      - total_paye_withheld
      - status
      - generated_at
    - Add filters and search

14. **Create EPFReturnAdmin class**
    - Create class for EPFReturn model
    - Read-only display
    - Add list_display:
      - period
      - employee_count
      - total_employee_contribution
      - total_employer_contribution
      - total_contribution
      - status
    - Add action: download_c_form

15. **Create ETFReturnAdmin class**
    - Create class for ETFReturn model
    - Read-only display
    - Add list_display:
      - period
      - employee_count
      - total_etf_contribution
      - status
      - generated_at
    - Simple layout (fewer fields than EPF)

16. **Create TaxSubmissionAdmin class**
    - Create class for TaxSubmission model
    - Add list_display:
      - tax_period
      - submission_reference
      - submitted_at
      - submitted_by
      - status
    - Add list_filter: status, submitted_at
    - Add search by reference number

17. **Add document preview**
    - In TaxSubmissionAdmin
    - Add readonly_fields with document preview
    - Show thumbnail if image
    - Show download link if PDF
    - Display file size and upload date

18. **Register all admin classes**
    - Register TaxConfiguration with TaxConfigurationAdmin
    - Register TaxPeriodRecord with TaxPeriodRecordAdmin
    - Register all return models with their admin classes
    - Register TaxSubmission with TaxSubmissionAdmin
    - Use admin.site.register()

### Admin Interface Sections

| Admin Class | Purpose | Key Features |
|-------------|---------|--------------|
| **TaxConfigurationAdmin** | Tax settings management | Fieldsets, validation, help text |
| **TaxPeriodRecordAdmin** | Period tracking | Filters, status actions |
| **VATReturnAdmin** | VAT return viewing | Export actions, read-only |
| **PAYEReturnAdmin** | PAYE return viewing | Employee counts, read-only |
| **EPFReturnAdmin** | EPF return viewing | C-Form download, read-only |
| **ETFReturnAdmin** | ETF return viewing | Simple display, read-only |
| **TaxSubmissionAdmin** | Submission tracking | Document preview, search |

### Admin Fieldset Example
```python
fieldsets = (
    ('VAT Configuration', {
        'fields': ('vat_enabled', 'vat_registration_number', 'vat_rate'),
        'description': 'Configure VAT settings for Inland Revenue Department',
    }),
    ('PAYE Configuration', {
        'fields': ('paye_enabled', 'paye_employer_number'),
        'description': 'Configure PAYE settings for employee tax withholding',
    }),
    # ... more fieldsets
)
```

### Admin Actions Example
```python
@admin.action(description='Export VAT returns to PDF')
def export_vat_pdf(modeladmin, request, queryset):
    """Export selected VAT returns as PDF."""
    pdf_files = []
    for vat_return in queryset:
        pdf = vat_return.generate_pdf()
        pdf_files.append(pdf)
    
    # Zip and return
    return create_zip_response(pdf_files, 'vat_returns.zip')
```

### Expected Outcome
- Complete Django admin interface for tax module
- Organized fieldsets for easy configuration
- Read-only displays for generated returns
- Custom actions for exports
- Document preview for submissions
- User-friendly admin experience

### Verification Checklist
- [ ] tax.py admin file created in admin directory
- [ ] All admin imports included
- [ ] TaxConfigurationAdmin class created
- [ ] VAT fieldset configured
- [ ] PAYE fieldset configured
- [ ] EPF fieldset configured
- [ ] ETF fieldset configured
- [ ] TaxPeriodRecordAdmin created with filters
- [ ] finalize_periods admin action added
- [ ] VATReturnAdmin created (read-only)
- [ ] export_vat_pdf action implemented
- [ ] PAYEReturnAdmin created
- [ ] EPFReturnAdmin created
- [ ] download_c_form action implemented
- [ ] ETFReturnAdmin created
- [ ] TaxSubmissionAdmin created
- [ ] Document preview added
- [ ] All admin classes registered
- [ ] Admin interface accessible and functional

---

## Task 86: Create Tax Serializers

### Overview
Create Django REST Framework serializers for tax reporting API endpoints. Implement serializers for TaxConfiguration, TaxPeriodRecord, all return types (VAT, PAYE, EPF, ETF), TaxSubmission, and tax calendar views. Add nested representations, validation logic, and read-only fields. Ensures proper data serialization for API responses and request validation.

### Dependencies
- All tax models created
- DRF installed and configured
- Serializer patterns established

### Instructions

1. **Create serializers directory structure**
   - Navigate to `apps/accounting/serializers/` directory
   - Create separate files for each return type
   - Organized structure for maintainability

2. **Create tax_configuration serializer**
   - Create file: `tax_configuration.py`
   - Import serializers from rest_framework
   - Import TaxConfiguration model
   - Create TaxConfigurationSerializer class

3. **Define configuration serializer fields**
   - Include all configuration fields
   - Use serializers.ModelSerializer
   - Meta class with model and fields
   - Add read_only_fields for system fields
   - Validate registration number formats

4. **Add configuration validation**
   - Override validate() method
   - Ensure VAT rate between 0 and 100
   - Validate registration number format
   - Check EPF/ETF rates sum correctly
   - Raise ValidationError for invalid data

5. **Create vat_return serializer**
   - Create file: `vat_return.py`
   - Import VATReturn model
   - Create VATReturnSerializer class
   - Include nested period representation

6. **Define VAT serializer fields**
   - Include all VAT return fields:
     - period (nested TaxPeriodRecord)
     - output_vat
     - input_vat
     - svat_adjustment
     - net_vat
     - zero_rated_supplies
     - exempt_supplies
     - status
     - generated_at
   - Use DecimalField for monetary values
   - Set decimal_places=2, max_digits=15

7. **Add VAT export URLs**
   - Add SerializerMethodField for export URLs
   - get_pdf_url() method
   - get_csv_url() method
   - Returns absolute URLs for downloads
   - Use request.build_absolute_uri()

8. **Create paye_return serializer**
   - Create file: `paye_return.py`
   - Import PAYEReturn model
   - Create PAYEReturnSerializer class
   - Include employee breakdown

9. **Define PAYE serializer fields**
   - Include all PAYE fields:
     - period
     - employee_count
     - total_gross_salary
     - total_paye_withheld
     - employees_detail (nested list)
     - status
     - generated_at
   - Add per-employee breakdown

10. **Create employee PAYE detail serializer**
    - Create TaxPAYEEmployeeSerializer
    - Nested serializer for employee detail
    - Fields:
      - employee_name
      - epf_number
      - gross_salary
      - paye_withheld
      - tax_bracket
    - Used in PAYEReturnSerializer

11. **Create epf_return serializer**
    - Create file: `epf_return.py`
    - Import EPFReturn model
    - Create EPFReturnSerializer class
    - Include C-Form download URL

12. **Define EPF serializer fields**
    - Include all EPF fields:
      - period
      - employee_count
      - total_basic_salary
      - total_employee_contribution (8%)
      - total_employer_contribution (12%)
      - total_contribution (20%)
      - c_form_url
      - status
      - generated_at
    - Add employee breakdown if needed

13. **Add C-Form URL method**
    - Add SerializerMethodField for c_form_url
    - get_c_form_url() method
    - Returns URL to download C-Form PDF
    - Build absolute URI

14. **Create etf_return serializer**
    - Create file: `etf_return.py`
    - Import ETFReturn model
    - Create ETFReturnSerializer class
    - Simpler than EPF (employer only)

15. **Define ETF serializer fields**
    - Include all ETF fields:
      - period
      - employee_count
      - total_gross_salary
      - total_etf_contribution (3%)
      - status
      - generated_at
    - Note no employee contribution

16. **Create tax_submission serializer**
    - Create file: `tax_submission.py`
    - Import TaxSubmission model
    - Create TaxSubmissionSerializer class
    - Handle file upload

17. **Define submission serializer fields**
    - Include all submission fields:
      - tax_period (nested)
      - submission_reference
      - submitted_at
      - submitted_by (nested user)
      - confirmation_document
      - status
      - notes
    - FileField for document upload

18. **Add document validation**
    - Override validate_confirmation_document()
    - Check file type (PDF, JPG, PNG)
    - Check file size (max 10MB)
    - Raise ValidationError if invalid

19. **Create tax_calendar serializer**
    - Create file: `tax_calendar.py`
    - Create TaxCalendarSerializer
    - For dashboard calendar view
    - No model (custom data)

20. **Define calendar serializer fields**
    - Serializer fields:
      - current_month
      - deadlines (list of deadline objects)
      - overdue (list)
    - Each deadline:
      - tax_type
      - period
      - due_date
      - status
      - days_remaining
      - urgency

21. **Create deadline detail serializer**
    - Create DeadlineSerializer
    - Nested in TaxCalendarSerializer
    - Fields match deadline structure
    - Add urgency color code

22. **Update serializers __init__.py**
    - Import all serializers
    - Export for easy import
    - Add to __all__ list

### Serializer Structure Overview

| Serializer | Purpose | Key Features |
|------------|---------|--------------|
| **TaxConfigurationSerializer** | Config management | Validation, format checking |
| **VATReturnSerializer** | VAT return data | Export URLs, nested period |
| **PAYEReturnSerializer** | PAYE return data | Employee breakdown, nested detail |
| **TaxPAYEEmployeeSerializer** | Employee PAYE detail | Per-employee tax data |
| **EPFReturnSerializer** | EPF return data | C-Form URL, contributions |
| **ETFReturnSerializer** | ETF return data | Simple employer contribution |
| **TaxSubmissionSerializer** | Filing submissions | File upload, validation |
| **TaxCalendarSerializer** | Calendar view | Deadlines, urgency |
| **DeadlineSerializer** | Deadline detail | Nested in calendar |

### Serializer Example Structure
```python
class VATReturnSerializer(serializers.ModelSerializer):
    """Serializer for VAT return data."""
    
    period = TaxPeriodRecordSerializer(read_only=True)
    pdf_url = serializers.SerializerMethodField()
    csv_url = serializers.SerializerMethodField()
    
    class Meta:
        model = VATReturn
        fields = [
            'id', 'period', 'output_vat', 'input_vat', 
            'net_vat', 'status', 'pdf_url', 'csv_url'
        ]
        read_only_fields = ['id', 'generated_at']
    
    def get_pdf_url(self, obj):
        """Get PDF export URL."""
        request = self.context.get('request')
        path = reverse('vat-return-pdf', args=[obj.id])
        return request.build_absolute_uri(path)
```

### Expected Outcome
- Complete serializer suite for tax API
- Proper validation for all inputs
- Nested representations for related data
- Export URLs for downloads
- File upload handling
- Calendar data serialization

### Verification Checklist
- [ ] Serializers directory structure created
- [ ] tax_configuration.py serializer created
- [ ] Configuration validation implemented
- [ ] vat_return.py serializer created
- [ ] VAT export URLs added
- [ ] paye_return.py serializer created
- [ ] TaxPAYEEmployeeSerializer created
- [ ] Employee breakdown included
- [ ] epf_return.py serializer created
- [ ] C-Form URL method added
- [ ] etf_return.py serializer created
- [ ] tax_submission.py serializer created
- [ ] Document validation implemented
- [ ] tax_calendar.py serializer created
- [ ] DeadlineSerializer created
- [ ] All serializers imported in __init__.py
- [ ] Decimal precision configured (2 places)
- [ ] Read-only fields marked appropriately

---

## Task 87: Create Tax ViewSet and URLs

### Overview
Create unified DRF ViewSet for all tax reporting API endpoints. Implement actions for configuration management, return generation, period management, submission recording, and calendar views. Configure URL routing with appropriate HTTP methods. Add permissions, filtering, and pagination. Provides complete REST API for tax reporting functionality.

### Dependencies
- All serializers created
- Tax services implemented (generators, reminder service)
- DRF routers configured

### Instructions

1. **Create or open tax views file**
   - Navigate to `apps/accounting/views/` directory
   - Open `tax.py` or create if not exists
   - This contains tax API views

2. **Add view imports**
   - Import ViewSet from rest_framework
   - Import Response, status from rest_framework
   - Import action decorator from rest_framework.decorators
   - Import all serializers
   - Import all services (generators, FilingReminderService)
   - Import permissions

3. **Add module docstring**
   - Document tax API views
   - Note RESTful endpoints
   - Explain ViewSet organization
   - Reference API documentation

4. **Create TaxViewSet class**
   - Create class inheriting from ViewSet
   - Add docstring explaining unified tax API
   - Set permission_classes
   - Define get_queryset method

5. **Add configuration endpoints**
   - Add @action(detail=False, methods=['get', 'put'])
   - Action name: configuration
   - GET: Returns current TaxConfiguration
   - PUT: Updates TaxConfiguration
   - Use TaxConfigurationSerializer

6. **Implement configuration GET**
   - Retrieve TaxConfiguration for tenant
   - Serialize with TaxConfigurationSerializer
   - Return Response with data
   - Handle not found (create default)

7. **Implement configuration PUT**
   - Deserialize request data
   - Validate with serializer
   - Save updated configuration
   - Return updated data
   - Handle validation errors

8. **Add periods list endpoint**
   - Add @action(detail=False, methods=['get'])
   - Action name: periods
   - List all TaxPeriodRecord instances
   - Filter by tax_type, status, date range
   - Use query parameters
   - Paginate results

9. **Add VAT return endpoints**
   - Add @action(detail=False, methods=['get'])
   - Action name: vat_returns
   - List all VAT returns
   - Filter by period, status
   - Use VATReturnSerializer

10. **Add VAT generation endpoint**
    - Add @action(detail=True, methods=['post'])
    - Action name: generate_vat
    - Expects period_id in request data
    - Call VATReturnGenerator
    - Return generated VATReturn
    - Handle generation errors

11. **Add VAT PDF export endpoint**
    - Add @action(detail=True, methods=['get'])
    - Action name: vat_pdf
    - Generate PDF for VAT return
    - Return FileResponse
    - Set Content-Type: application/pdf
    - Set Content-Disposition: attachment

12. **Add VAT CSV export endpoint**
    - Add @action(detail=True, methods=['get'])
    - Action name: vat_csv
    - Generate CSV for VAT return
    - Return HttpResponse with CSV
    - Set Content-Type: text/csv

13. **Add PAYE endpoints**
    - Similar structure to VAT:
      - paye_returns (list)
      - generate_paye (generation)
      - paye_pdf (export)
    - Use PAYEReturnGenerator
    - Use PAYEReturnSerializer

14. **Add EPF endpoints**
    - Similar structure:
      - epf_returns (list)
      - generate_epf (generation)
      - epf_c_form (C-Form PDF)
    - Use EPFReturnGenerator
    - Use EPFReturnSerializer

15. **Add ETF endpoints**
    - Similar structure:
      - etf_returns (list)
      - generate_etf (generation)
    - Use ETFReturnGenerator
    - Use ETFReturnSerializer

16. **Add submission endpoints**
    - Add @action(detail=False, methods=['post'])
    - Action name: submit_return
    - Record tax submission
    - Use TaxSubmissionSerializer
    - Handle document upload

17. **Add calendar endpoint**
    - Add @action(detail=False, methods=['get'])
    - Action name: calendar
    - Call FilingReminderService
    - Get upcoming deadlines
    - Use TaxCalendarSerializer

18. **Add reminders endpoint**
    - Add @action(detail=False, methods=['get'])
    - Action name: reminders
    - Same as TaxRemindersWidgetView (Task 80)
    - Return pending filings
    - Use for dashboard widget

19. **Configure URL routing**
    - Open `apps/accounting/urls.py`
    - Import TaxViewSet
    - Create router instance
    - Register TaxViewSet: router.register('tax', TaxViewSet, basename='tax')
    - Include router.urls in urlpatterns

20. **Add URL namespace**
    - Set app_name for URL namespacing
    - Enables reverse('accounting:tax-configuration')
    - Organize URLs logically
    - Add to main urls.py

21. **Add API versioning**
    - Configure URL prefix: /api/v1/tax/
    - Version in path for future compatibility
    - Document version in API docs
    - Plan for v2 if needed

### API Endpoint Structure

| HTTP Method | Endpoint | Description | Action Name |
|-------------|----------|-------------|-------------|
| GET | `/api/v1/tax/configuration/` | Get tax configuration | configuration |
| PUT | `/api/v1/tax/configuration/` | Update configuration | configuration |
| GET | `/api/v1/tax/periods/` | List tax periods | periods |
| GET | `/api/v1/tax/calendar/` | Tax filing calendar | calendar |
| GET | `/api/v1/tax/reminders/` | Pending reminders | reminders |
| GET | `/api/v1/tax/vat-returns/` | List VAT returns | vat_returns |
| POST | `/api/v1/tax/vat-returns/generate/` | Generate VAT | generate_vat |
| GET | `/api/v1/tax/vat-returns/{id}/pdf/` | Export VAT PDF | vat_pdf |
| GET | `/api/v1/tax/vat-returns/{id}/csv/` | Export VAT CSV | vat_csv |
| GET | `/api/v1/tax/paye-returns/` | List PAYE returns | paye_returns |
| POST | `/api/v1/tax/paye-returns/generate/` | Generate PAYE | generate_paye |
| GET | `/api/v1/tax/epf-returns/` | List EPF returns | epf_returns |
| POST | `/api/v1/tax/epf-returns/generate/` | Generate EPF | generate_epf |
| GET | `/api/v1/tax/epf-returns/{id}/c-form/` | Download C-Form | epf_c_form |
| GET | `/api/v1/tax/etf-returns/` | List ETF returns | etf_returns |
| POST | `/api/v1/tax/etf-returns/generate/` | Generate ETF | generate_etf |
| POST | `/api/v1/tax/submissions/` | Record submission | submit_return |

### ViewSet Action Example
```python
@action(detail=False, methods=['post'])
def generate_vat(self, request):
    """Generate VAT return for specified period."""
    period_id = request.data.get('period_id')
    
    try:
        period = TaxPeriodRecord.objects.get(id=period_id)
        generator = VATReturnGenerator(period)
        vat_return = generator.generate()
        
        serializer = VATReturnSerializer(vat_return, context={'request': request})
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    except TaxPeriodRecord.DoesNotExist:
        return Response(
            {'error': 'Tax period not found'},
            status=status.HTTP_404_NOT_FOUND
        )
    except Exception as e:
        return Response(
            {'error': str(e)},
            status=status.HTTP_400_BAD_REQUEST
        )
```

### URL Configuration Example
```python
# apps/accounting/urls.py
from rest_framework.routers import DefaultRouter
from .views.tax import TaxViewSet

router = DefaultRouter()
router.register(r'tax', TaxViewSet, basename='tax')

app_name = 'accounting'

urlpatterns = [
    # Other URLs...
]

urlpatterns += router.urls
```

### Expected Outcome
- Complete REST API for tax reporting
- Unified ViewSet for all tax operations
- URL routing configured
- Generation endpoints functional
- Export endpoints working
- Submission recording enabled
- Calendar and reminder APIs active

### Verification Checklist
- [ ] tax.py views file created/updated
- [ ] All view imports included
- [ ] TaxViewSet class created
- [ ] configuration action implemented (GET/PUT)
- [ ] periods action implemented
- [ ] vat_returns action implemented
- [ ] generate_vat action implemented
- [ ] vat_pdf export action implemented
- [ ] vat_csv export action implemented
- [ ] paye_returns action implemented
- [ ] generate_paye action implemented
- [ ] epf_returns action implemented
- [ ] generate_epf action implemented
- [ ] epf_c_form action implemented
- [ ] etf_returns action implemented
- [ ] generate_etf action implemented
- [ ] submit_return action implemented
- [ ] calendar action implemented
- [ ] reminders action implemented
- [ ] URL routing configured in urls.py
- [ ] Router registered with TaxViewSet
- [ ] API versioning configured (/api/v1/)
- [ ] All endpoints accessible and functional

---

## Task 88: Create API Documentation

### Overview
Create comprehensive API documentation for the tax reporting module. Document all endpoints with request/response examples, authentication requirements, query parameters, error codes, and usage examples. Include Sri Lankan tax context, calculation explanations, and compliance notes. Provides complete reference for frontend developers and API consumers.

### Dependencies
- All API endpoints implemented
- Serializers configured
- drf-spectacular or similar documentation tool

### Instructions

1. **Create documentation file**
   - Navigate to `apps/accounting/docs/` directory
   - Create file: `tax_reporting_api.md`
   - Markdown format for readability

2. **Add document header**
   - Title: "Tax Reporting API Documentation"
   - Subtitle: "Sri Lankan Tax Compliance Module"
   - Version: 1.0
   - Last Updated: Date
   - Author: ERP Development Team

3. **Add overview section**
   - Explain tax reporting module purpose
   - List supported tax types:
     - VAT (Value Added Tax)
     - PAYE (Pay As You Earn)
     - EPF (Employees' Provident Fund)
     - ETF (Employees' Trust Fund)
   - Note Sri Lankan context (IRD, CBSL, ETF Board)

4. **Add authentication section**
   - Document authentication requirements
   - All endpoints require authentication
   - Token-based authentication
   - Example header: `Authorization: Bearer {token}`
   - Permissions: Finance role required

5. **Add base URL section**
   - Document base URL: `/api/v1/tax/`
   - Full URL example: `https://erp.example.com/api/v1/tax/`
   - Note API versioning
   - SSL required in production

6. **Document configuration endpoints**
   - Section: "Tax Configuration"
   - GET `/tax/configuration/`
     - Description: Retrieve current tax settings
     - Authentication: Required
     - Response: TaxConfiguration object
     - Example response JSON
   - PUT `/tax/configuration/`
     - Description: Update tax settings
     - Request body: TaxConfiguration fields
     - Validation rules
     - Example request/response

7. **Document tax periods endpoints**
   - Section: "Tax Periods"
   - GET `/tax/periods/`
     - Description: List all tax periods
     - Query parameters:
       - tax_type: Filter by type
       - status: Filter by status
       - date_from: Start date filter
       - date_to: End date filter
     - Pagination: page, page_size
     - Example request
     - Example response

8. **Document VAT endpoints**
   - Section: "VAT Returns"
   - GET `/tax/vat-returns/`
     - List VAT returns
     - Filters, pagination
     - Example response
   - POST `/tax/vat-returns/generate/`
     - Generate VAT return
     - Request body: {period_id}
     - Response: Generated VATReturn
     - Example calculation
   - GET `/tax/vat-returns/{id}/pdf/`
     - Export VAT return as PDF
     - Response: PDF file
     - Content-Type: application/pdf
   - GET `/tax/vat-returns/{id}/csv/`
     - Export VAT return as CSV
     - Response: CSV file

9. **Add VAT calculation explanation**
   - Subsection: "VAT Calculation Logic"
   - Output VAT: Sales * 18%
   - Input VAT: Purchases * 18%
   - Net VAT: Output - Input
   - SVAT adjustments
   - Zero-rated supplies
   - Exempt transactions
   - Example calculation with numbers

10. **Document PAYE endpoints**
    - Section: "PAYE Returns"
    - GET `/tax/paye-returns/`
    - POST `/tax/paye-returns/generate/`
    - Include employee breakdown structure
    - Example response with employees

11. **Add PAYE tax brackets table**
    - Subsection: "Sri Lankan PAYE Tax Brackets (2026)"
    - Table with brackets:
      - Annual income range
      - Tax rate
      - Tax on band
    - Example calculation
    - Progressive tax explanation

12. **Document EPF endpoints**
    - Section: "EPF Returns"
    - GET `/tax/epf-returns/`
    - POST `/tax/epf-returns/generate/`
    - GET `/tax/epf-returns/{id}/c-form/`
      - Download C-Form PDF
      - Description of C-Form
      - Required by CBSL

13. **Add EPF contribution breakdown**
    - Subsection: "EPF Contribution Structure"
    - Employee: 8% of basic salary
    - Employer: 12% of basic salary
    - Total: 20% of basic salary
    - Note: Allowances excluded
    - Example calculation

14. **Document ETF endpoints**
    - Section: "ETF Returns"
    - GET `/tax/etf-returns/`
    - POST `/tax/etf-returns/generate/`
    - Note: Employer-only contribution

15. **Add ETF contribution explanation**
    - Subsection: "ETF Contribution Structure"
    - Employer: 3% of gross salary
    - Employee: No contribution
    - Note: Gross includes basic + allowances
    - Difference from EPF base
    - Example calculation

16. **Document submission endpoints**
    - Section: "Tax Submissions"
    - POST `/tax/submissions/`
      - Record filing submission
      - Request body:
        - tax_period_id
        - submission_reference
        - confirmation_document (file)
      - File upload format
      - Example request

17. **Document calendar endpoint**
    - Section: "Tax Calendar"
    - GET `/tax/calendar/`
      - Description: Upcoming deadlines
      - Response structure
      - Urgency levels
      - Example response

18. **Document reminders endpoint**
    - Section: "Filing Reminders"
    - GET `/tax/reminders/`
      - Description: Dashboard widget data
      - Response structure
      - Summary counts
      - Recent submissions
      - Example response

19. **Add error codes section**
    - Section: "Error Codes"
    - List common errors:
      - 400: Validation error
      - 401: Unauthorized
      - 403: Permission denied
      - 404: Not found
      - 500: Server error
    - Example error response format
    - Error message structure

20. **Add usage examples section**
    - Section: "Usage Examples"
    - Example workflows:
      - Generating VAT return
      - Generating PAYE return
      - Recording submission
      - Checking deadlines
    - Include curl examples
    - Include JavaScript fetch examples

21. **Add Sri Lankan compliance notes**
    - Section: "Compliance Notes"
    - VAT: IRD regulations
    - PAYE: Tax brackets as of 2026
    - EPF: CBSL requirements
    - ETF: ETF Board requirements
    - Filing deadlines
    - Penalty information

22. **Add OpenAPI/Swagger integration**
    - Install drf-spectacular
    - Configure in Django settings
    - Add schema view
    - Generate OpenAPI schema
    - Access at `/api/schema/`
    - Swagger UI at `/api/docs/`

### Documentation Sections

| Section | Content | Purpose |
|---------|---------|---------|
| **Overview** | Module introduction | Context and scope |
| **Authentication** | Auth requirements | Security |
| **Configuration** | Settings endpoints | Tax setup |
| **VAT Returns** | VAT API and calculations | VAT compliance |
| **PAYE Returns** | PAYE API and brackets | Employee tax |
| **EPF Returns** | EPF API and contributions | Provident fund |
| **ETF Returns** | ETF API and contributions | Trust fund |
| **Submissions** | Filing records | Audit trail |
| **Calendar** | Deadline tracking | Compliance monitoring |
| **Reminders** | Dashboard widget | Proactive alerts |
| **Errors** | Error codes and handling | Troubleshooting |
| **Examples** | Usage workflows | Developer guidance |
| **Compliance** | Sri Lankan regulations | Legal context |

### API Documentation Example
```markdown
## Generate VAT Return

**Endpoint:** `POST /api/v1/tax/vat-returns/generate/`

**Description:** Generate VAT return for specified tax period. Calculates output VAT from sales, input VAT from purchases, and net VAT payable to Inland Revenue Department.

**Authentication:** Required (Bearer token)

**Request Body:**
```json
{
  "period_id": 123
}
```

**Response (201 Created):**
```json
{
  "id": 456,
  "period": {
    "id": 123,
    "tax_type": "VAT",
    "period_start": "2026-01-01",
    "period_end": "2026-01-31"
  },
  "output_vat": "180000.00",
  "input_vat": "90000.00",
  "svat_adjustment": "0.00",
  "net_vat": "90000.00",
  "zero_rated_supplies": "50000.00",
  "exempt_supplies": "0.00",
  "status": "FINALIZED",
  "generated_at": "2026-02-10T10:30:00Z",
  "pdf_url": "/api/v1/tax/vat-returns/456/pdf/",
  "csv_url": "/api/v1/tax/vat-returns/456/csv/"
}
```

**Calculation:**
- Sales (January): LKR 1,000,000
- Output VAT (18%): LKR 180,000
- Purchases (January): LKR 500,000
- Input VAT (18%): LKR 90,000
- Net VAT Payable: LKR 90,000

**Due Date:** February 20, 2026 (20th of following month)
```

### Expected Outcome
- Complete API documentation
- All endpoints documented
- Request/response examples
- Calculation explanations
- Sri Lankan compliance context
- OpenAPI/Swagger integration
- Developer-friendly format

### Verification Checklist
- [ ] tax_reporting_api.md file created
- [ ] Document header with title and version
- [ ] Overview section written
- [ ] Authentication section documented
- [ ] Base URL and versioning explained
- [ ] Configuration endpoints documented
- [ ] Tax periods endpoints documented
- [ ] VAT endpoints fully documented
- [ ] VAT calculation explanation added
- [ ] PAYE endpoints documented
- [ ] PAYE tax brackets table included
- [ ] EPF endpoints documented
- [ ] EPF contribution breakdown added
- [ ] ETF endpoints documented
- [ ] ETF contribution explanation added
- [ ] Submission endpoints documented
- [ ] Calendar endpoint documented
- [ ] Reminders endpoint documented
- [ ] Error codes section added
- [ ] Usage examples provided
- [ ] Sri Lankan compliance notes added
- [ ] OpenAPI/Swagger configured
- [ ] Documentation accessible and complete

---

## Notes for AI Agents

### Documentation Best Practices
- Use clear, concise language
- Include practical examples
- Show both request and response
- Explain calculations with numbers
- Note Sri Lankan regulatory context
- Keep updated as API evolves

### Admin Configuration Purpose
Django admin provides non-technical interface for finance staff to:
- Configure tax settings
- View generated returns
- Export returns for filing
- Track submissions
- Monitor deadlines

### Serializer Design Principles
- Use explicit field definitions (don't rely on defaults)
- Validate at serializer level (not just model)
- Provide helpful error messages
- Use nested serializers for related data
- Add SerializerMethodFields for computed values

### ViewSet Organization
Unified TaxViewSet simplifies routing and provides consistent API structure. Alternative: Separate ViewSets per tax type. Chosen approach balances organization with simplicity.

### URL Design Considerations
- RESTful conventions
- Versioned API (/api/v1/)
- Logical grouping
- Predictable patterns
- Support for future expansion

### OpenAPI/Swagger Benefits
- Auto-generated documentation
- Interactive API explorer
- Client code generation
- API testing interface
- Always in sync with code

### Common Documentation Pitfalls
- **Don't** document outdated endpoints
- **Do** keep examples current
- **Don't** assume reader knowledge
- **Do** explain Sri Lankan context
- **Don't** skip error scenarios
- **Do** provide complete request/response

### Testing Documentation
- Test all documented endpoints
- Verify examples work
- Check links aren't broken
- Validate JSON syntax
- Ensure calculations accurate

### Multi-Tenant Considerations
If implementing multi-tenant system:
- Document tenant header requirement
- Explain data isolation
- Note cross-tenant restrictions
- Show tenant-specific examples

### Performance Optimization
For large datasets:
- Document pagination
- Note filtering options
- Explain query optimization
- Mention caching strategy
- Provide performance tips

### Security Considerations
- Document authentication thoroughly
- Explain permission model
- Note rate limiting
- Mention HTTPS requirement
- Warn about sensitive data

### Deployment Checklist
Before deploying tax reporting module:
- [ ] All migrations applied
- [ ] Celery Beat configured for reminders
- [ ] Email settings configured
- [ ] File storage configured (confirmations)
- [ ] Admin users created
- [ ] Tax configuration completed
- [ ] Test data cleared
- [ ] API documentation published
- [ ] Frontend integration tested
- [ ] Backup procedures in place
- [ ] Monitoring configured
- [ ] Error tracking enabled

### Post-Deployment Tasks
After deployment:
- Train finance staff on admin interface
- Train users on API usage
- Configure filing reminders
- Set up monitoring dashboards
- Schedule backup verification
- Plan for tax law updates
- Document support procedures

### Maintenance Considerations
Tax module requires ongoing maintenance:
- Update tax rates annually (IRD announcements)
- Adjust tax brackets when changed
- Monitor regulatory changes
- Update documentation
- Refine calculations based on feedback
- Optimize performance as data grows

### Future Enhancement Ideas
- Automated IRD filing integration
- OCR for document scanning
- Predictive tax liability
- Multi-currency support
- Advanced analytics
- Mobile app
- Real-time validation
- AI-powered compliance checks
