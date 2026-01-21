# Group C: PDF Generation Engine

> **Phase:** 06 - ERP Advanced Modules  
> **SubPhase:** 07 - Payslip Generation  
> **Group:** C of F  
> **Tasks Covered:** 33-48  
> **Group Goal:** Implement HTML template and PDF generation with WeasyPrint

---

## Navigation

- **↑ Parent:** [SubPhase-07 Summary](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group B: PDF Template Design](../Group-B_PDF-Template-Design/)
- **→ Next Group:** [Group D: Bulk Generation & Email](../Group-D_Bulk-Generation-Email/)

---

## Group Overview

### Key Outcomes

1. **Install WeasyPrint** - Add weasyprint to requirements
2. **HTML Template Base** - Create payslip_template.html
3. **Header Section** - Company logo, name, payslip title
4. **Employee Details Section** - Name, ID, department, designation
5. **Pay Period Section** - Period dates, pay date, working days
6. **Earnings Table Section** - Earnings breakdown
7. **Deductions Table Section** - Deductions breakdown
8. **Summary Section** - Gross, deductions, net totals
9. **YTD Section** - Year-to-date totals
10. **Employer Contrib Section** - EPF/ETF (optional)
11. **Footer Section** - Disclaimer, generated date
12. **PDF CSS Styles** - Print-friendly CSS
13. **PayslipGenerator Service** - Service class
14. **Generate Single Method** - Generate one PDF
15. **Save PDF Method** - Save to storage
16. **Regenerate Method** - Regenerate existing

### Technology Context

| Technology | Purpose |
|------------|---------|
| WeasyPrint | HTML to PDF conversion |
| Django Templates | HTML rendering |
| CSS | Print-friendly styling |
| S3/Storage | PDF file storage |

---

## Documents in This Group

| # | Document | Tasks | Description |
|---|----------|-------|-------------|
| 01 | `01_Tasks-33-43_HTML-Template-Design.md` | 33-43 | WeasyPrint, HTML sections, CSS |
| 02 | `02_Tasks-44-48_Generator-Service.md` | 44-48 | PayslipGenerator service methods |

---

## Task Summary

| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 33 | Install WeasyPrint Package | Low | 15 min |
| 34 | Create HTML Template Base | Medium | 25 min |
| 35 | Design Template Header Section | Medium | 25 min |
| 36 | Design Employee Details Section | Medium | 20 min |
| 37 | Design Pay Period Section | Low | 15 min |
| 38 | Design Earnings Table Section | Medium | 25 min |
| 39 | Design Deductions Table Section | Medium | 20 min |
| 40 | Design Summary Section | Medium | 20 min |
| 41 | Design YTD Section | Medium | 20 min |
| 42 | Design Employer Contrib Section | Low | 15 min |
| 43 | Design Footer Section | Low | 15 min |
| 44 | Create PDF CSS Styles | High | 30 min |
| 45 | Create PayslipGenerator Service | High | 35 min |
| 46 | Add Generate Single Method | High | 30 min |
| 47 | Add Save PDF Method | Medium | 20 min |
| 48 | Add Regenerate Method | Medium | 20 min |

---

## Execution Order

```
[Tasks 33-43: WeasyPrint, HTML template, sections]
         │
         ▼
[Tasks 44-48: CSS, Generator service]
```

---

## Expected Deliverables

```
apps/payslip/
├── templates/
│   └── payslip/
│       ├── payslip_template.html # Tasks 34-43
│       └── payslip_styles.css    # Task 44
├── services/
│   ├── __init__.py
│   └── generator.py              # Tasks 45-48
└── requirements.txt              # Task 33 (update)
```

---

## Notes for AI Agents

### WeasyPrint Installation
```
pip install weasyprint

Additional system dependencies (Linux):
- libpango-1.0-0
- libcairo2
- libgdk-pixbuf2.0-0

Docker considerations:
- Add dependencies to Dockerfile
```

### HTML Template Structure
```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Payslip - {{ slip_number }}</title>
  <link rel="stylesheet" href="payslip_styles.css">
</head>
<body>
  <div class="payslip">
    <!-- Header Section -->
    <!-- Employee Details -->
    <!-- Pay Period -->
    <!-- Earnings Table -->
    <!-- Deductions Table -->
    <!-- Summary -->
    <!-- YTD (optional) -->
    <!-- Employer Contributions (optional) -->
    <!-- Footer -->
  </div>
</body>
</html>
```

### Header Section
```
┌─────────────────────────────────────────────────────┐
│  [LOGO]  Lanka Commerce Pvt Ltd                     │
│          123, Galle Road, Colombo 03                │
│                                                      │
│                    PAYSLIP                          │
│           Period: January 2026                      │
│           Slip No: PAY-2026-01-001                  │
└─────────────────────────────────────────────────────┘
```

### Employee Details Section
```
┌─────────────────────────────────────────────────────┐
│ Employee Name: John Doe           Employee ID: EMP-0001 │
│ Department: Engineering           Designation: Senior Developer │
│ Date of Joining: 2023-05-15      Bank: BOC - ***1234 │
│ EPF No: EP/123456                                   │
└─────────────────────────────────────────────────────┘
```

### Pay Period Section
```
┌─────────────────────────────────────────────────────┐
│ Pay Period: 01 Jan 2026 - 31 Jan 2026              │
│ Pay Date: 25 Jan 2026                               │
│ Working Days: 22    |    Days Worked: 20           │
│ Overtime Hours: 8.5                                 │
└─────────────────────────────────────────────────────┘
```

### Earnings Table
```
┌───────────────────────────────────────────────┐
│ EARNINGS                                       │
├─────────────────────────────┬─────────────────┤
│ Description                  │ Amount (LKR)    │
├─────────────────────────────┼─────────────────┤
│ Basic Salary                 │      150,000.00 │
│ Transport Allowance          │       15,000.00 │
│ Medical Allowance            │       10,000.00 │
│ Overtime Pay                 │       18,750.00 │
├─────────────────────────────┼─────────────────┤
│ GROSS EARNINGS              │      193,750.00 │
└─────────────────────────────┴─────────────────┘
```

### Deductions Table
```
┌───────────────────────────────────────────────┐
│ DEDUCTIONS                                     │
├─────────────────────────────┬─────────────────┤
│ Description                  │ Amount (LKR)    │
├─────────────────────────────┼─────────────────┤
│ EPF Employee (8%)            │       12,000.00 │
│ PAYE Tax                     │        5,500.00 │
│ Loan Repayment               │        5,000.00 │
├─────────────────────────────┼─────────────────┤
│ TOTAL DEDUCTIONS            │       22,500.00 │
└─────────────────────────────┴─────────────────┘
```

### Summary Section
```
┌───────────────────────────────────────────────┐
│            SALARY SUMMARY                      │
├─────────────────────────────┬─────────────────┤
│ Gross Earnings              │      193,750.00 │
│ Total Deductions            │       22,500.00 │
├─────────────────────────────┼─────────────────┤
│ NET PAY                     │      171,250.00 │
└─────────────────────────────┴─────────────────┘
```

### Print-Friendly CSS
```css
@page {
  size: A4;
  margin: 1cm;
}

body {
  font-family: Arial, sans-serif;
  font-size: 10pt;
  color: #333;
}

.payslip {
  width: 100%;
  max-width: 21cm;
  margin: 0 auto;
}

table {
  width: 100%;
  border-collapse: collapse;
}

/* Avoid flexbox for WeasyPrint */
/* Use tables and floats instead */
```

### PayslipGenerator Service
```
PayslipGenerator:
├── __init__(tenant)
├── generate(payslip_id) → bytes
├── save(payslip_id) → file_path
├── regenerate(payslip_id) → file_path
├── _render_html(context) → str
├── _html_to_pdf(html) → bytes
└── _get_template_context(payslip) → dict
```

### Template Context
```python
context = {
    'company': {
        'name': 'Lanka Commerce Pvt Ltd',
        'logo_url': '...',
        'address': '...',
    },
    'employee': {
        'name': 'John Doe',
        'id': 'EMP-0001',
        'department': 'Engineering',
        'designation': 'Senior Developer',
    },
    'period': {
        'name': 'January 2026',
        'start_date': '2026-01-01',
        'end_date': '2026-01-31',
        'pay_date': '2026-01-25',
    },
    'earnings': [...],
    'deductions': [...],
    'summary': {...},
    'ytd': {...},
    'employer_contributions': [...],
    'slip_number': 'PAY-2026-01-001',
    'generated_at': '2026-01-20 10:00:00',
}
```
