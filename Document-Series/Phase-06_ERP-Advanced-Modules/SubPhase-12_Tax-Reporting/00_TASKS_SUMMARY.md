# SubPhase 12: Tax Reporting - Tasks Summary

> **Phase:** 06 - ERP Advanced Modules  
> **SubPhase Index:** 12 of 14  
> **SubPhase Goal:** Generate Sri Lanka tax compliance reports  
> **Total Tasks:** 88 | **Status:** Planning  
> **Estimated Duration:** 13-15 hours

---

## Navigation

- **↑ Parent:** [00_SUBPHASES_SUMMARY.md](../00_SUBPHASES_SUMMARY.md)
- **← Previous SubPhase:** [SubPhase-11_Financial-Reports](../SubPhase-11_Financial-Reports/)
- **→ Next SubPhase:** [SubPhase-13_Dashboard-KPIs](../SubPhase-13_Dashboard-KPIs/)

---

## SubPhase Overview

This sub-phase implements comprehensive tax reporting for Sri Lanka compliance. Generates VAT returns, PAYE reports, EPF (C-Form) returns, and ETF returns. Includes filing reminders, historical submission tracking, and export formats compatible with regulatory requirements.

### Key Outcomes
- VAT return generation (monthly/quarterly)
- PAYE report generation
- EPF return (C-Form) generation
- ETF return generation
- SVAT (Simplified VAT) support
- Filing deadline reminders
- Submission history tracking
- Export in regulatory formats
- Tax period management

### Technology Context
- **Backend:** Django 5.x with DRF for API
- **Report Generation:** WeasyPrint (PDF), CSV for uploads
- **Scheduling:** Celery Beat for reminders
- **Frontend:** Next.js 14+ with TypeScript
- **Compliance:** Inland Revenue Department formats

### Dependencies
- Phase-06 SubPhase-06: Payroll (EPF/ETF/PAYE data)
- Phase-06 SubPhase-09: Journal Entries (VAT data)
- Phase-06 SubPhase-11: Financial Reports

---

## Task Execution Order

```
TASK GROUP A: Tax Configuration (Tasks 01-16)
        │
        ▼
TASK GROUP B: VAT Return (Tasks 17-34)
        │
        ▼
TASK GROUP C: PAYE Reporting (Tasks 35-50)
        │
        ▼
TASK GROUP D: EPF/ETF Returns (Tasks 51-68)
        │
        ▼
TASK GROUP E: Filing & Reminders (Tasks 69-80)
        │
        ▼
TASK GROUP F: API, Testing & Documentation (Tasks 81-88)
```

---

## Task Index

### Group A: Tax Configuration (Tasks 01-16)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 01 | **Create tax Module** | Add tax reporting module | None | 🔴 Not Created |
| 02 | **Define TaxType Enum** | Create: VAT, PAYE, EPF, ETF, WHT | Task 01 | 🔴 Not Created |
| 03 | **Define TaxPeriod Enum** | Create: MONTHLY, QUARTERLY, ANNUAL | Task 02 | 🔴 Not Created |
| 04 | **Define FilingStatus Enum** | Create: PENDING, GENERATED, FILED, ACCEPTED | Task 03 | 🔴 Not Created |
| 05 | **Create TaxConfiguration Model** | Tenant tax settings | Task 04 | 🔴 Not Created |
| 06 | **Add VAT Registration Number** | Add vat_registration_no field | Task 05 | 🔴 Not Created |
| 07 | **Add SVAT Status** | Add is_svat_registered boolean | Task 05 | 🔴 Not Created |
| 08 | **Add EPF Registration** | Add epf_registration_no field | Task 05 | 🔴 Not Created |
| 09 | **Add ETF Registration** | Add etf_registration_no field | Task 05 | 🔴 Not Created |
| 10 | **Add Employer TIN** | Add tin_number (Tax ID) | Task 05 | 🔴 Not Created |
| 11 | **Add VAT Filing Frequency** | Add vat_filing_period (monthly/quarterly) | Task 05 | 🔴 Not Created |
| 12 | **Run TaxConfig Migrations** | Generate and apply migrations | Task 11 | 🔴 Not Created |
| 13 | **Create TaxPeriodRecord Model** | Track tax periods and deadlines | Task 12 | 🔴 Not Created |
| 14 | **Add Period Date Range** | Add start_date, end_date, due_date | Task 13 | 🔴 Not Created |
| 15 | **Add Period Status** | Add status using FilingStatus | Task 13 | 🔴 Not Created |
| 16 | **Run TaxPeriod Migrations** | Generate and apply migrations | Task 15 | 🔴 Not Created |

---

### Group B: VAT Return (Tasks 17-34)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 17 | **Create VATReturn Model** | VAT return data model | Task 16 | 🔴 Not Created |
| 18 | **Add Return Period FK** | Link to TaxPeriodRecord | Task 17 | 🔴 Not Created |
| 19 | **Add Output VAT Field** | Total VAT on sales | Task 17 | 🔴 Not Created |
| 20 | **Add Input VAT Field** | Total VAT on purchases | Task 17 | 🔴 Not Created |
| 21 | **Add Net VAT Payable** | Output - Input (or refund) | Task 17 | 🔴 Not Created |
| 22 | **Add Return Line Items** | Detailed breakdown JSON | Task 17 | 🔴 Not Created |
| 23 | **Add Filed Date** | Add filed_at, filed_by | Task 17 | 🔴 Not Created |
| 24 | **Run VATReturn Migrations** | Generate and apply migrations | Task 23 | 🔴 Not Created |
| 25 | **Create VATReturnGenerator** | Service to generate VAT return | Task 24 | 🔴 Not Created |
| 26 | **Add Get Sales VAT Method** | Calculate output VAT from sales | Task 25 | 🔴 Not Created |
| 27 | **Add Get Purchase VAT Method** | Calculate input VAT from purchases | Task 26 | 🔴 Not Created |
| 28 | **Add Get Zero-Rated Sales** | Calculate zero-rated transactions | Task 27 | 🔴 Not Created |
| 29 | **Add Get Exempt Sales** | Calculate exempt transactions | Task 28 | 🔴 Not Created |
| 30 | **Add SVAT Calculation** | Handle SVAT adjustments | Task 29 | 🔴 Not Created |
| 31 | **Create VAT Return PDF Template** | IRD-compliant format | Task 30 | 🔴 Not Created |
| 32 | **Create VAT Return CSV Export** | For IRD upload | Task 31 | 🔴 Not Created |
| 33 | **Add VAT Summary by Rate** | Group by VAT rate (8%, 0%) | Task 32 | 🔴 Not Created |
| 34 | **Create VAT Return API Endpoint** | GET/POST /tax/vat-returns/ | Task 33 | 🔴 Not Created |

---

### Group C: PAYE Reporting (Tasks 35-50)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 35 | **Create PAYEReturn Model** | PAYE return data model | Task 34 | 🔴 Not Created |
| 36 | **Add PAYE Period FK** | Link to TaxPeriodRecord | Task 35 | 🔴 Not Created |
| 37 | **Add Total Employees Field** | Count of employees | Task 35 | 🔴 Not Created |
| 38 | **Add Total Remuneration** | Total taxable salaries | Task 35 | 🔴 Not Created |
| 39 | **Add Total PAYE Deducted** | Sum of PAYE deductions | Task 35 | 🔴 Not Created |
| 40 | **Add Employee Details JSON** | Per-employee breakdown | Task 35 | 🔴 Not Created |
| 41 | **Run PAYEReturn Migrations** | Generate and apply migrations | Task 40 | 🔴 Not Created |
| 42 | **Create PAYEReturnGenerator** | Service to generate PAYE return | Task 41 | 🔴 Not Created |
| 43 | **Add Get Payroll Data Method** | Fetch payroll for period | Task 42 | 🔴 Not Created |
| 44 | **Add Calculate Tax Brackets** | Apply PAYE slabs | Task 43 | 🔴 Not Created |
| 45 | **Add Employee Schedule Method** | Generate employee schedule | Task 44 | 🔴 Not Created |
| 46 | **Create PAYE Return PDF Template** | IRD T-10 form format | Task 45 | 🔴 Not Created |
| 47 | **Create PAYE CSV Export** | Employee-level export | Task 46 | 🔴 Not Created |
| 48 | **Add PAYE Summary by Bracket** | Group by tax bracket | Task 47 | 🔴 Not Created |
| 49 | **Add Year-to-Date Tracking** | Cumulative PAYE per employee | Task 48 | 🔴 Not Created |
| 50 | **Create PAYE Return API Endpoint** | GET/POST /tax/paye-returns/ | Task 49 | 🔴 Not Created |

---

### Group D: EPF/ETF Returns (Tasks 51-68)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 51 | **Create EPFReturn Model** | EPF return (C-Form) data model | Task 50 | 🔴 Not Created |
| 52 | **Add EPF Period FK** | Link to TaxPeriodRecord | Task 51 | 🔴 Not Created |
| 53 | **Add Total Employee Contrib** | Sum of 8% employee | Task 51 | 🔴 Not Created |
| 54 | **Add Total Employer Contrib** | Sum of 12% employer | Task 51 | 🔴 Not Created |
| 55 | **Add Total Contribution** | Employee + Employer (20%) | Task 51 | 🔴 Not Created |
| 56 | **Add Employee Schedule JSON** | Per-employee EPF details | Task 51 | 🔴 Not Created |
| 57 | **Run EPFReturn Migrations** | Generate and apply migrations | Task 56 | 🔴 Not Created |
| 58 | **Create EPFReturnGenerator** | Service to generate C-Form | Task 57 | 🔴 Not Created |
| 59 | **Add Get EPF Data Method** | Fetch payroll EPF data | Task 58 | 🔴 Not Created |
| 60 | **Add Generate C-Form Method** | Generate C-Form PDF | Task 59 | 🔴 Not Created |
| 61 | **Create C-Form PDF Template** | CBSL format | Task 60 | 🔴 Not Created |
| 62 | **Create EPF CSV Export** | For online submission | Task 61 | 🔴 Not Created |
| 63 | **Create ETFReturn Model** | ETF return data model | Task 62 | 🔴 Not Created |
| 64 | **Add ETF Contribution Fields** | 3% employer contribution | Task 63 | 🔴 Not Created |
| 65 | **Run ETFReturn Migrations** | Generate and apply migrations | Task 64 | 🔴 Not Created |
| 66 | **Create ETFReturnGenerator** | Service to generate ETF return | Task 65 | 🔴 Not Created |
| 67 | **Create ETF PDF Template** | ETF Board format | Task 66 | 🔴 Not Created |
| 68 | **Create ETF API Endpoint** | GET/POST /tax/etf-returns/ | Task 67 | 🔴 Not Created |

---

### Group E: Filing & Reminders (Tasks 69-80)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 69 | **Create TaxSubmission Model** | Track filed submissions | Task 68 | 🔴 Not Created |
| 70 | **Add Submission Reference** | Acknowledgment number | Task 69 | 🔴 Not Created |
| 71 | **Add Submission Date** | Date filed | Task 69 | 🔴 Not Created |
| 72 | **Add Submission Document** | Uploaded confirmation | Task 69 | 🔴 Not Created |
| 73 | **Run TaxSubmission Migrations** | Generate and apply migrations | Task 72 | 🔴 Not Created |
| 74 | **Create Filing Reminder Service** | Calculate deadlines and send reminders | Task 73 | 🔴 Not Created |
| 75 | **Add VAT Due Date Calc** | 20th of following month | Task 74 | 🔴 Not Created |
| 76 | **Add EPF Due Date Calc** | Last day of following month | Task 75 | 🔴 Not Created |
| 77 | **Add PAYE Due Date Calc** | 15th of following month | Task 76 | 🔴 Not Created |
| 78 | **Create Reminder Celery Task** | Daily check for upcoming deadlines | Task 77 | 🔴 Not Created |
| 79 | **Add Email Reminder Method** | Send email notifications | Task 78 | 🔴 Not Created |
| 80 | **Add Dashboard Reminder Widget** | Show pending filings | Task 79 | 🔴 Not Created |

---

### Group F: API, Testing & Documentation (Tasks 81-88)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 81 | **Create TaxConfig Admin** | Django admin for tax config | Task 80 | 🔴 Not Created |
| 82 | **Create Tax Return Serializers** | DRF serializers for all returns | Task 81 | 🔴 Not Created |
| 83 | **Create Tax ViewSet** | Combined ViewSet for tax reports | Task 82 | 🔴 Not Created |
| 84 | **Add Tax Calendar Endpoint** | GET /tax/calendar/ deadlines | Task 83 | 🔴 Not Created |
| 85 | **Add Tax URL Routes** | Register routes in urls.py | Task 84 | 🔴 Not Created |
| 86 | **Write VAT Return Tests** | Unit tests for VAT | Task 85 | 🔴 Not Created |
| 87 | **Write EPF/ETF Return Tests** | Unit tests for EPF/ETF | Task 86 | 🔴 Not Created |
| 88 | **Create Tax Reporting API Docs** | Document all endpoints | Task 87 | 🔴 Not Created |

---

## Expected File Structure

```
apps/tax/
├── __init__.py
├── admin.py                    # Tax admin configuration
├── apps.py                     # App config
├── models/
│   ├── __init__.py
│   ├── tax_config.py           # TaxConfiguration model
│   ├── tax_period.py           # TaxPeriodRecord model
│   ├── vat_return.py           # VATReturn model
│   ├── paye_return.py          # PAYEReturn model
│   ├── epf_return.py           # EPFReturn model
│   ├── etf_return.py           # ETFReturn model
│   └── tax_submission.py       # TaxSubmission model
├── serializers/
│   ├── __init__.py
│   ├── tax_config.py           # Config serializers
│   ├── vat_return.py           # VAT serializers
│   ├── paye_return.py          # PAYE serializers
│   └── epf_etf_return.py       # EPF/ETF serializers
├── views/
│   ├── __init__.py
│   └── tax.py                  # Tax ViewSet
├── services/
│   ├── __init__.py
│   ├── vat_generator.py        # VAT return generator
│   ├── paye_generator.py       # PAYE return generator
│   ├── epf_generator.py        # EPF return generator
│   ├── etf_generator.py        # ETF return generator
│   └── reminder_service.py     # Filing reminders
├── templates/
│   └── tax/
│       ├── vat_return.html
│       ├── paye_return.html
│       ├── epf_c_form.html
│       └── etf_return.html
├── tasks.py                    # Celery tasks (reminders)
├── urls.py                     # URL routing
├── tests/
│   ├── __init__.py
│   ├── test_vat.py
│   ├── test_paye.py
│   └── test_epf_etf.py
└── migrations/

frontend/src/app/(dashboard)/tax/
├── page.tsx                    # Tax dashboard
├── vat-returns/
│   ├── page.tsx                # VAT returns list
│   ├── [id]/
│   │   └── page.tsx            # VAT return detail
│   └── new/
│       └── page.tsx            # Generate VAT return
├── paye-returns/
│   ├── page.tsx                # PAYE returns list
│   └── [id]/
│       └── page.tsx            # PAYE return detail
├── epf-returns/
│   ├── page.tsx                # EPF returns list
│   └── [id]/
│       └── page.tsx            # EPF C-Form
├── components/
│   ├── TaxCalendar.tsx         # Filing calendar
│   ├── FilingReminder.tsx      # Deadline widget
│   └── TaxReturnSummary.tsx    # Return summary card
└── hooks/
    └── useTaxReturns.ts
```

---

## Progress Tracking

| Group | Tasks | Completed | Percentage |
|-------|-------|-----------|------------|
| Group A: Tax Configuration | 16 | 0 | 0% |
| Group B: VAT Return | 18 | 0 | 0% |
| Group C: PAYE Reporting | 16 | 0 | 0% |
| Group D: EPF/ETF Returns | 18 | 0 | 0% |
| Group E: Filing & Reminders | 12 | 0 | 0% |
| Group F: API, Testing & Documentation | 8 | 0 | 0% |
| **TOTAL** | **88** | **0** | **0%** |

---

## Notes for AI Agents

### Critical Implementation Details

1. **Sri Lanka Tax Rates (2024):**
   - VAT: 18% (standard rate)
   - SSCL: 2.5% (Social Security Contribution Levy)
   - EPF: 8% employee + 12% employer = 20% total
   - ETF: 3% employer only
   - PAYE: Progressive tax (0%, 6%, 12%, 18%, 24%, 30%)

2. **VAT Filing Deadlines:**
   - Monthly filers: 20th of following month
   - Quarterly filers: 20th of month after quarter ends
   - Threshold: LKR 80 million annual turnover

3. **EPF/ETF Deadlines:**
   - EPF (C-Form): Last working day of following month
   - ETF: Same as EPF
   - Submit to: Central Bank of Sri Lanka

4. **PAYE Deadlines:**
   - Monthly: 15th of following month
   - Annual reconciliation: End of April

### VAT Return Structure

```
VAT RETURN FOR PERIOD: [Month/Quarter Year]

1. Output VAT (Sales)
   a) Standard Rate (18%)         LKR XXX,XXX
   b) Zero-Rated                  LKR 0.00
   c) Exempt                      N/A
   Total Output VAT               LKR XXX,XXX

2. Input VAT (Purchases)
   a) Standard Rate (18%)         LKR XX,XXX
   b) Capital Goods               LKR XX,XXX
   Total Input VAT                LKR XX,XXX

3. Net VAT
   Output - Input                 LKR XX,XXX
   Less: SVAT Credit (if any)     LKR X,XXX
   VAT PAYABLE/REFUND             LKR XX,XXX
```

### EPF C-Form Structure

```
EPF CONTRIBUTION SCHEDULE (FORM C)

Employer: [Company Name]
EPF Registration No: [Number]
Period: [Month Year]

Employee Details:
| NIC No | Name | Basic Salary | Emp 8% | Employer 12% | Total |
|--------|------|--------------|--------|--------------|-------|
| XXXX   | Name | XX,XXX       | X,XXX  | X,XXX        | X,XXX |

SUMMARY:
Total Employees: XX
Total Basic Salary: LKR XXX,XXX
Total Employee Contribution (8%): LKR XX,XXX
Total Employer Contribution (12%): LKR XX,XXX
GRAND TOTAL (20%): LKR XXX,XXX
```

### PAYE Return Structure

```
PAYE RETURN (Form T-10)

Employer: [Company Name]
TIN: [Tax ID Number]
Period: [Month Year]

| Employee NIC | Name | Gross Pay | Taxable | PAYE Deducted |
|--------------|------|-----------|---------|---------------|
| XXXX         | Name | XX,XXX    | XX,XXX  | X,XXX         |

SUMMARY BY TAX BRACKET:
- 0% Bracket: XX employees, LKR 0
- 6% Bracket: XX employees, LKR X,XXX
- 12% Bracket: XX employees, LKR X,XXX
...

TOTAL PAYE DEDUCTED: LKR XX,XXX
```

### Filing Reminders Schedule

| Tax Type | Deadline | Reminder Days Before |
|----------|----------|---------------------|
| VAT | 20th | 10, 5, 2 days |
| EPF | Last day | 10, 5, 2 days |
| ETF | Last day | 10, 5, 2 days |
| PAYE | 15th | 7, 3, 1 day |

---

## Completion Checklist

- [ ] TaxConfiguration model with registration numbers
- [ ] TaxPeriodRecord model
- [ ] VATReturn model and generator
- [ ] VAT output/input calculation
- [ ] SVAT support
- [ ] PAYEReturn model and generator
- [ ] PAYE tax bracket calculation
- [ ] EPFReturn (C-Form) model and generator
- [ ] ETFReturn model and generator
- [ ] TaxSubmission tracking
- [ ] Filing reminder service
- [ ] Celery task for deadline reminders
- [ ] PDF templates for all returns
- [ ] CSV exports for online filing
- [ ] Django admin for tax config
- [ ] DRF serializers and ViewSets
- [ ] Unit tests for all generators
- [ ] API documentation
