# Group D: EPF/ETF Returns

> **Phase:** 06 - ERP Advanced Modules  
> **SubPhase:** 12 - Tax Reporting  
> **Group:** D of F  
> **Tasks Covered:** 51-68  
> **Group Goal:** Implement EPF C-Form and ETF return generation for Sri Lanka statutory contributions

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group-C_PAYE-Reporting](../Group-C_PAYE-Reporting/)
- **→ Next Group:** [Group-E_Filing-Reminders](../Group-E_Filing-Reminders/)

---

## Group Overview

This group implements EPF (Employees' Provident Fund) and ETF (Employees' Trust Fund) return generation for Sri Lanka statutory compliance. Creates EPFReturn model for C-Form data with employee (8%) and employer (12%) contributions totaling 20%. Creates ETFReturn model for 3% employer contribution. Implements generators for both returns with CBSL and ETF Board compliant formats.

### Key Outcomes

- EPFReturn model (C-Form data)
- EPF period foreign key
- Total employee contribution (8%)
- Total employer contribution (12%)
- Total contribution field (20%)
- Employee schedule JSONField
- EPFReturnGenerator service class
- Get EPF data from payroll
- Generate C-Form method
- C-Form PDF template (CBSL format)
- EPF CSV export for online submission
- ETFReturn model
- ETF contribution fields (3%)
- ETFReturnGenerator service class
- ETF PDF template (ETF Board format)
- ETF API endpoint

### Technology Context

- **EPF Authority:** Central Bank of Sri Lanka (CBSL)
- **ETF Authority:** Employees' Trust Fund Board
- **Contribution Rates:** EPF 20% (8%+12%), ETF 3%
- **Payroll Integration:** Data from Payroll Processing

---

## Documents in This Group

| # | Document | Description | Tasks Covered |
|---|----------|-------------|---------------|
| 01 | `01_Tasks-51-62_EPF-Return-CForm.md` | Create EPFReturn model and C-Form generator | 51-62 |
| 02 | `02_Tasks-63-68_ETF-Return.md` | Create ETFReturn model and generator | 63-68 |

---

## Task Summary

| Task # | Task Name | Complexity | Dependencies |
|--------|-----------|------------|--------------|
| 51 | Create EPFReturn Model | Medium | Task 50 |
| 52 | Add EPF Period FK | Low | Task 51 |
| 53 | Add Total Employee Contrib | Low | Task 51 |
| 54 | Add Total Employer Contrib | Low | Task 51 |
| 55 | Add Total Contribution | Low | Task 51 |
| 56 | Add Employee Schedule JSON | Medium | Task 51 |
| 57 | Run EPFReturn Migrations | Low | Task 56 |
| 58 | Create EPFReturnGenerator | High | Task 57 |
| 59 | Add Get EPF Data Method | Medium | Task 58 |
| 60 | Add Generate C-Form Method | Medium | Task 59 |
| 61 | Create C-Form PDF Template | Medium | Task 60 |
| 62 | Create EPF CSV Export | Medium | Task 61 |
| 63 | Create ETFReturn Model | Medium | Task 62 |
| 64 | Add ETF Contribution Fields | Low | Task 63 |
| 65 | Run ETFReturn Migrations | Low | Task 64 |
| 66 | Create ETFReturnGenerator | Medium | Task 65 |
| 67 | Create ETF PDF Template | Medium | Task 66 |
| 68 | Create ETF API Endpoint | Low | Task 67 |

---

## Execution Order

```
Task 51: Create EPFReturn Model
    │
    ├─────────────────────────────────────────────┐
    ▼                                             ▼
Task 52: Period FK    Tasks 53-56: EPF Fields
    │                 (Employee, Employer, Total,
    │                  Employee Schedule)
    │                         │
    └─────────────────────────┘
                  │
                  ▼
             Task 57: Run EPFReturn Migrations
                  │
                  ▼
             Task 58: Create EPFReturnGenerator
                  │
                  ▼
             Task 59: Get EPF Data Method
                  │
                  ▼
             Task 60: Generate C-Form Method
                  │
                  ▼
             Task 61: C-Form PDF Template
                  │
                  ▼
             Task 62: EPF CSV Export
                  │
                  ▼
             Task 63: Create ETFReturn Model
                  │
                  ▼
             Task 64: Add ETF Contribution Fields
                  │
                  ▼
             Task 65: Run ETFReturn Migrations
                  │
                  ▼
             Task 66: Create ETFReturnGenerator
                  │
                  ▼
             Task 67: ETF PDF Template
                  │
                  ▼
             Task 68: Create ETF API Endpoint
```

---

## Expected Deliverables

```
apps/accounting/
├── tax/
│   └── generators/
│       ├── __init__.py
│       ├── vat_return.py
│       ├── paye_return.py
│       ├── epf_return.py      # EPFReturnGenerator
│       └── etf_return.py      # ETFReturnGenerator
├── models/
│   ├── vat_return.py
│   ├── paye_return.py
│   ├── epf_return.py          # EPFReturn model
│   └── etf_return.py          # ETFReturn model
├── templates/
│   └── tax/
│       ├── vat_return.html
│       ├── paye_return.html
│       ├── c_form.html        # EPF C-Form template
│       └── etf_return.html    # ETF return template
├── views/
│   └── tax.py                 # Add EPF/ETF endpoints
└── migrations/
    ├── 0021_epfreturn.py
    └── 0022_etfreturn.py
```

---

## Notes for AI Agents

### EPF Contribution Rates
| Contributor | Rate | Base |
|-------------|------|------|
| Employee | 8% | Gross Salary |
| Employer | 12% | Gross Salary |
| **Total** | **20%** | |

### ETF Contribution Rate
| Contributor | Rate | Base |
|-------------|------|------|
| Employer | 3% | Gross Salary |

### EPF C-Form Structure
```
C-FORM - EMPLOYEES' PROVIDENT FUND

Employer Registration No: E/XXXXXX
Month: January 2026

SUMMARY
Total Number of Members: 50
Total Employee Contribution (8%): 400,000
Total Employer Contribution (12%): 600,000
TOTAL CONTRIBUTION: 1,000,000

MEMBER SCHEDULE (Attached)
```

### Employee Schedule JSON Structure (EPF)
```json
{
  "members": [
    {
      "member_no": "M12345",
      "nic": "XXXXXXXXXX",
      "name": "Employee Name",
      "gross_salary": 100000,
      "employee_contrib": 8000,
      "employer_contrib": 12000,
      "total_contrib": 20000
    }
  ]
}
```

### Filing Deadlines
- EPF: Last day of the following month
- ETF: Last day of the following month
- Example: January contributions due by February 28/29

### Online Submission
- EPF: CBSL online portal (epf.cbsl.lk)
- ETF: ETF Board portal
- CSV format required for bulk upload

### Special Considerations
- New employees: Register for EPF membership
- Departing employees: Final contribution + R-Form
- Multiple employers: Combined contributions
