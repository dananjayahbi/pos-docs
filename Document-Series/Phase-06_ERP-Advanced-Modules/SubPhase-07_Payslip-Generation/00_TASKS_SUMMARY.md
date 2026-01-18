# SubPhase 07: Payslip Generation - Tasks Summary

> **Phase:** 06 - ERP Advanced Modules  
> **SubPhase Index:** 07 of 14  
> **SubPhase Goal:** Generate, distribute, and manage employee payslips  
> **Total Tasks:** 88 | **Status:** Planning  
> **Estimated Duration:** 13-15 hours

---

## Navigation

- **↑ Parent:** [00_SUBPHASES_SUMMARY.md](../00_SUBPHASES_SUMMARY.md)
- **← Previous SubPhase:** [SubPhase-06_Payroll-Processing](../SubPhase-06_Payroll-Processing/)
- **→ Next SubPhase:** [SubPhase-08_Chart-of-Accounts](../SubPhase-08_Chart-of-Accounts/)

---

## SubPhase Overview

This sub-phase implements the complete payslip generation system. Converts processed payroll data into professional PDF payslips, supports bulk generation, email distribution, and employee self-service access. Includes year-to-date (YTD) calculations and Sri Lanka compliance elements.

### Key Outcomes
- Payslip data model with full breakdown
- PDF template design (professional layout)
- Dynamic PDF generation using WeasyPrint
- Bulk generation with Celery
- Email distribution with attachments
- Employee self-service payslip access
- YTD earnings/deductions tracking
- Payslip download history
- Employer contribution visibility

### Technology Context
- **Backend:** Django 5.x with DRF for API
- **PDF Generation:** WeasyPrint (HTML to PDF)
- **Email:** Django email with attachments
- **Processing:** Celery for bulk generation
- **Frontend:** Next.js 14+ with TypeScript
- **Storage:** S3-compatible for PDF storage

### Dependencies
- Phase-06 SubPhase-01: Employee details
- Phase-06 SubPhase-05: Salary components
- Phase-06 SubPhase-06: Payroll processing (source data)

---

## Task Execution Order

```
TASK GROUP A: Payslip Data Models (Tasks 01-16)
        │
        ▼
TASK GROUP B: PDF Template Design (Tasks 17-32)
        │
        ▼
TASK GROUP C: PDF Generation Engine (Tasks 33-48)
        │
        ▼
TASK GROUP D: Bulk Generation & Email (Tasks 49-64)
        │
        ▼
TASK GROUP E: Employee Self-Service (Tasks 65-78)
        │
        ▼
TASK GROUP F: API, Testing & Documentation (Tasks 79-88)
```

---

## Task Index

### Group A: Payslip Data Models (Tasks 01-16)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 01 | **Create payslip App** | Initialize Django app for payslip management | None | 🔴 Not Created |
| 02 | **Register payslip App** | Add to TENANT_APPS in settings | Task 01 | 🔴 Not Created |
| 03 | **Define PayslipStatus Choices** | Create enum: DRAFT, GENERATED, SENT, VIEWED, DOWNLOADED | Task 02 | 🔴 Not Created |
| 04 | **Create Payslip Model** | Core model linking to EmployeePayroll | Task 03 | 🔴 Not Created |
| 05 | **Add Payslip Employee FK** | Add employee foreign key with related_name | Task 04 | 🔴 Not Created |
| 06 | **Add Payslip Period FK** | Add payroll_period foreign key | Task 04 | 🔴 Not Created |
| 07 | **Add Payslip Employee Payroll FK** | Link to EmployeePayroll record | Task 04 | 🔴 Not Created |
| 08 | **Add Payslip Number Field** | Auto-generated unique slip number (PAY-2026-01-001) | Task 04 | 🔴 Not Created |
| 09 | **Add Payslip Status Field** | Add status using PayslipStatus enum | Task 04 | 🔴 Not Created |
| 10 | **Add Payslip Generation Fields** | Add generated_at, generated_by timestamps | Task 04 | 🔴 Not Created |
| 11 | **Add Payslip PDF File Field** | FileField for storing generated PDF | Task 04 | 🔴 Not Created |
| 12 | **Add Payslip Sent Fields** | Add email_sent, sent_at, sent_to fields | Task 04 | 🔴 Not Created |
| 13 | **Add Payslip View Tracking** | Add first_viewed_at, view_count fields | Task 04 | 🔴 Not Created |
| 14 | **Add Payslip Download Tracking** | Add download_count, last_downloaded_at | Task 04 | 🔴 Not Created |
| 15 | **Run Payslip Migrations** | Generate and apply migrations | Task 14 | 🔴 Not Created |
| 16 | **Add Payslip Model Constraints** | Add unique_together (employee, period) | Task 15 | 🔴 Not Created |

---

### Group B: PDF Template Design (Tasks 17-32)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 17 | **Create PayslipEarning Model** | Store individual earning line items | Task 16 | 🔴 Not Created |
| 18 | **Add Earning Component Name** | Add component_name, component_code | Task 17 | 🔴 Not Created |
| 19 | **Add Earning Amount Fields** | Add amount, ytd_amount (year-to-date) | Task 17 | 🔴 Not Created |
| 20 | **Add Earning Sort Order** | Add display_order for template | Task 17 | 🔴 Not Created |
| 21 | **Create PayslipDeduction Model** | Store individual deduction line items | Task 20 | 🔴 Not Created |
| 22 | **Add Deduction Component Name** | Add component_name, component_code | Task 21 | 🔴 Not Created |
| 23 | **Add Deduction Amount Fields** | Add amount, ytd_amount | Task 21 | 🔴 Not Created |
| 24 | **Add Deduction Sort Order** | Add display_order for template | Task 21 | 🔴 Not Created |
| 25 | **Create PayslipEmployerContribution** | Store employer contributions (EPF/ETF) | Task 24 | 🔴 Not Created |
| 26 | **Add Employer Contribution Fields** | Add component_name, amount, ytd_amount | Task 25 | 🔴 Not Created |
| 27 | **Run Line Item Migrations** | Generate and apply migrations | Task 26 | 🔴 Not Created |
| 28 | **Create PayslipTemplate Model** | Tenant-configurable template settings | Task 27 | 🔴 Not Created |
| 29 | **Add Template Company Details** | Add company_name, logo, address fields | Task 28 | 🔴 Not Created |
| 30 | **Add Template Footer Fields** | Add footer_text, disclaimer_text | Task 28 | 🔴 Not Created |
| 31 | **Add Template Style Fields** | Add primary_color, show_employer_contrib | Task 28 | 🔴 Not Created |
| 32 | **Run Template Migrations** | Generate and apply migrations | Task 31 | 🔴 Not Created |

---

### Group C: PDF Generation Engine (Tasks 33-48)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 33 | **Install WeasyPrint Package** | Add weasyprint to requirements | Task 32 | 🔴 Not Created |
| 34 | **Create HTML Template Base** | Create payslip_template.html base layout | Task 33 | 🔴 Not Created |
| 35 | **Design Template Header Section** | Company logo, name, payslip title | Task 34 | 🔴 Not Created |
| 36 | **Design Employee Details Section** | Employee name, ID, department, designation | Task 35 | 🔴 Not Created |
| 37 | **Design Pay Period Section** | Period dates, pay date, working days | Task 36 | 🔴 Not Created |
| 38 | **Design Earnings Table Section** | Earnings breakdown with amounts | Task 37 | 🔴 Not Created |
| 39 | **Design Deductions Table Section** | Deductions breakdown with amounts | Task 38 | 🔴 Not Created |
| 40 | **Design Summary Section** | Gross, deductions, net pay totals | Task 39 | 🔴 Not Created |
| 41 | **Design YTD Section** | Year-to-date totals | Task 40 | 🔴 Not Created |
| 42 | **Design Employer Contrib Section** | EPF/ETF employer contributions (optional) | Task 41 | 🔴 Not Created |
| 43 | **Design Footer Section** | Disclaimer, generated date | Task 42 | 🔴 Not Created |
| 44 | **Create PDF CSS Styles** | Print-friendly CSS for WeasyPrint | Task 43 | 🔴 Not Created |
| 45 | **Create PayslipGenerator Service** | Service class for PDF generation | Task 44 | 🔴 Not Created |
| 46 | **Add Generate Single Method** | Method to generate one payslip PDF | Task 45 | 🔴 Not Created |
| 47 | **Add Save PDF Method** | Method to save PDF to storage | Task 46 | 🔴 Not Created |
| 48 | **Add Regenerate Method** | Method to regenerate existing payslip | Task 47 | 🔴 Not Created |

---

### Group D: Bulk Generation & Email (Tasks 49-64)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 49 | **Create Bulk Generation Celery Task** | Celery task for batch generation | Task 48 | 🔴 Not Created |
| 50 | **Add Period-Based Generation** | Generate all payslips for a period | Task 49 | 🔴 Not Created |
| 51 | **Add Generation Progress Tracking** | Track progress via Redis | Task 50 | 🔴 Not Created |
| 52 | **Add Generation Error Handling** | Handle individual failures gracefully | Task 51 | 🔴 Not Created |
| 53 | **Create PayslipBatch Model** | Track bulk generation batches | Task 52 | 🔴 Not Created |
| 54 | **Add Batch Status Fields** | Add total_count, success_count, failed_count | Task 53 | 🔴 Not Created |
| 55 | **Add Batch Timing Fields** | Add started_at, completed_at | Task 53 | 🔴 Not Created |
| 56 | **Run Batch Migrations** | Generate and apply migrations | Task 55 | 🔴 Not Created |
| 57 | **Create Email Template** | HTML email template for payslip notification | Task 56 | 🔴 Not Created |
| 58 | **Add Email Subject Configuration** | Tenant-configurable email subject | Task 57 | 🔴 Not Created |
| 59 | **Create PayslipEmailer Service** | Service class for email distribution | Task 58 | 🔴 Not Created |
| 60 | **Add Send Single Email Method** | Send email with PDF attachment | Task 59 | 🔴 Not Created |
| 61 | **Add Bulk Email Celery Task** | Celery task for batch email sending | Task 60 | 🔴 Not Created |
| 62 | **Add Email Throttling** | Rate limit email sending (avoid spam) | Task 61 | 🔴 Not Created |
| 63 | **Add Email Status Tracking** | Update Payslip.email_sent on success | Task 62 | 🔴 Not Created |
| 64 | **Add Email Failure Handling** | Log failed emails, retry mechanism | Task 63 | 🔴 Not Created |

---

### Group E: Employee Self-Service (Tasks 65-78)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 65 | **Create Payslip Admin Config** | Django admin for Payslip model | Task 64 | 🔴 Not Created |
| 66 | **Add Admin List Display** | Show slip number, employee, period, status | Task 65 | 🔴 Not Created |
| 67 | **Add Admin Filters** | Filter by period, status, email_sent | Task 66 | 🔴 Not Created |
| 68 | **Add Admin Actions** | Generate PDF, Send Email actions | Task 67 | 🔴 Not Created |
| 69 | **Create PayslipSerializer** | DRF serializer for Payslip | Task 68 | 🔴 Not Created |
| 70 | **Add Nested Earnings Serializer** | Include earnings breakdown | Task 69 | 🔴 Not Created |
| 71 | **Add Nested Deductions Serializer** | Include deductions breakdown | Task 70 | 🔴 Not Created |
| 72 | **Create Employee Payslip ViewSet** | ViewSet for employee self-service | Task 71 | 🔴 Not Created |
| 73 | **Add List My Payslips Action** | List logged-in employee's payslips | Task 72 | 🔴 Not Created |
| 74 | **Add View Payslip Detail** | Get single payslip with breakdown | Task 73 | 🔴 Not Created |
| 75 | **Add Download PDF Endpoint** | Stream PDF file to employee | Task 74 | 🔴 Not Created |
| 76 | **Add View Tracking Logic** | Update first_viewed_at, view_count | Task 75 | 🔴 Not Created |
| 77 | **Add Download Tracking Logic** | Update download_count, last_downloaded_at | Task 76 | 🔴 Not Created |
| 78 | **Add Payslip URL Routes** | Register routes in urls.py | Task 77 | 🔴 Not Created |

---

### Group F: API, Testing & Documentation (Tasks 79-88)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 79 | **Create Admin Payslip ViewSet** | Admin API for generation/distribution | Task 78 | 🔴 Not Created |
| 80 | **Add Generate Single Endpoint** | POST to generate single payslip | Task 79 | 🔴 Not Created |
| 81 | **Add Bulk Generate Endpoint** | POST to trigger bulk generation | Task 80 | 🔴 Not Created |
| 82 | **Add Send Email Endpoint** | POST to send payslip email | Task 81 | 🔴 Not Created |
| 83 | **Add Bulk Send Email Endpoint** | POST to send all emails for period | Task 82 | 🔴 Not Created |
| 84 | **Add Generation Status Endpoint** | GET bulk generation progress | Task 83 | 🔴 Not Created |
| 85 | **Write Payslip Model Tests** | Unit tests for Payslip model | Task 84 | 🔴 Not Created |
| 86 | **Write PDF Generation Tests** | Test PDF output validity | Task 85 | 🔴 Not Created |
| 87 | **Write Email Distribution Tests** | Test email sending with mocks | Task 86 | 🔴 Not Created |
| 88 | **Create Payslip API Documentation** | Document all endpoints with examples | Task 87 | 🔴 Not Created |

---

## Expected File Structure

```
apps/payslip/
├── __init__.py
├── admin.py                # Payslip admin configuration
├── apps.py                 # App config
├── models/
│   ├── __init__.py
│   ├── payslip.py          # Payslip model
│   ├── payslip_line.py     # Earning/Deduction/Contribution models
│   ├── payslip_template.py # Template settings model
│   └── payslip_batch.py    # Batch tracking model
├── serializers/
│   ├── __init__.py
│   ├── payslip.py          # Payslip serializers
│   └── payslip_line.py     # Line item serializers
├── views/
│   ├── __init__.py
│   ├── employee.py         # Employee self-service views
│   └── admin.py            # Admin management views
├── services/
│   ├── __init__.py
│   ├── generator.py        # PDF generation service
│   └── emailer.py          # Email distribution service
├── templates/
│   └── payslip/
│       ├── payslip_template.html
│       ├── payslip_styles.css
│       └── email_template.html
├── tasks.py                # Celery tasks
├── urls.py                 # URL routing
├── tests/
│   ├── __init__.py
│   ├── test_models.py
│   ├── test_generator.py
│   ├── test_emailer.py
│   └── test_api.py
└── migrations/

frontend/src/app/(dashboard)/payslips/
├── page.tsx                # Employee payslip list
├── [id]/
│   └── page.tsx            # Payslip detail view
├── components/
│   ├── PayslipList.tsx
│   ├── PayslipCard.tsx
│   └── PayslipViewer.tsx
└── hooks/
    └── usePayslips.ts

frontend/src/app/(dashboard)/admin/payslips/
├── page.tsx                # Admin payslip management
├── generate/
│   └── page.tsx            # Bulk generation interface
└── components/
    ├── GenerationProgress.tsx
    └── EmailDistribution.tsx
```

---

## Progress Tracking

| Group | Tasks | Completed | Percentage |
|-------|-------|-----------|------------|
| Group A: Payslip Data Models | 16 | 0 | 0% |
| Group B: PDF Template Design | 16 | 0 | 0% |
| Group C: PDF Generation Engine | 16 | 0 | 0% |
| Group D: Bulk Generation & Email | 16 | 0 | 0% |
| Group E: Employee Self-Service | 14 | 0 | 0% |
| Group F: API, Testing & Documentation | 10 | 0 | 0% |
| **TOTAL** | **88** | **0** | **0%** |

---

## Notes for AI Agents

### Critical Implementation Details

1. **PDF Generation Technology:**
   - Use WeasyPrint for HTML-to-PDF conversion
   - CSS must be print-friendly (avoid flexbox issues)
   - Include proper page size (@page { size: A4 })

2. **YTD Calculation:**
   - Year-to-date calculations require querying all prior payslips in fiscal year
   - Fiscal year may differ from calendar year (configure per tenant)
   - Cache YTD values on generation for performance

3. **File Storage:**
   - Store PDFs in tenant-isolated S3 buckets/paths
   - Use signed URLs for secure download
   - Set appropriate file permissions

4. **Email Best Practices:**
   - Use tenant's configured SMTP or shared service
   - Rate limit sending (avoid blacklisting)
   - Track delivery status if possible
   - Include plaintext alternative

5. **Security:**
   - Employees can ONLY access their own payslips
   - Admin permissions for generation/distribution
   - Audit log for all payslip access

6. **Payslip Number Format:**
   - PAY-{YEAR}-{MONTH}-{SEQUENCE}
   - Example: PAY-2026-01-001
   - Reset sequence monthly per tenant

### Sri Lanka Specific

1. **Compliance Display:**
   - Show EPF Employee contribution (8%)
   - Optional: Show EPF Employer (12%) + ETF (3%)
   - Include EPF registration number

2. **PAYE Tax:**
   - Show PAYE deduction if applicable
   - Include tax bracket information (optional)

3. **Currency:**
   - Format: LKR 1,234.56
   - Use proper decimal precision

### Workflow Summary

```
Payroll Finalized (SubPhase-06)
        │
        ▼
Payslips Generated (Batch or Individual)
        │
        ▼
PDF Files Stored (S3/Storage)
        │
        ▼
Emails Sent (Optional, with PDF attachment)
        │
        ▼
Employee Self-Service Access
        │
        ▼
View/Download Tracking Updated
```

---

## Completion Checklist

- [ ] Payslip model with all tracking fields
- [ ] Line item models (earnings, deductions, contributions)
- [ ] Template configuration model
- [ ] HTML template with professional design
- [ ] WeasyPrint PDF generation
- [ ] Celery bulk generation task
- [ ] Email distribution with attachments
- [ ] Employee self-service API
- [ ] Admin management API
- [ ] YTD calculations
- [ ] Download/view tracking
- [ ] Unit and integration tests
- [ ] API documentation
