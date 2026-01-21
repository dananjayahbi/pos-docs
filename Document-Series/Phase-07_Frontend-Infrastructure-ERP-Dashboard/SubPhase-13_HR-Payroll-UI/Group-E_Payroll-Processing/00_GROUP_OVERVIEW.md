# Group E: Payroll Processing

> **Phase:** 07 - Frontend Infrastructure & ERP Dashboard  
> **SubPhase:** 13 - HR & Payroll UI  
> **Group:** E of F  
> **Tasks Covered:** 69-84  
> **Group Goal:** Build payroll processing with wizard, payslip generation, and PDF download

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group-D_Leave-Management](../Group-D_Leave-Management/)
- **→ Next Group:** [Group-F_Reports-Testing](../Group-F_Reports-Testing/)

---

## Group Overview

This group creates the complete payroll processing interface. Creates payroll dashboard page with header and run payroll action. Builds summary cards for total payroll, pending, and processed. Creates payroll periods table with columns for period, employees, total, and status. Adds period status badge (Draft, Processing, Completed). Creates payroll run page with wizard. Builds wizard steps: period selection, employee selection, review calculations, and confirm processing. Creates payslip details page with header section. Creates earnings section (basic, allowances) and deductions section (EPF, ETF, PAYE). Adds download payslip PDF functionality.

### Key Outcomes

- Payroll dashboard page
- Payroll header with run action
- Payroll summary cards
- Payroll periods table
- Period table columns defined
- Period status badge
- Payroll run page (wizard)
- Period selection step
- Employee selection step
- Review calculations step
- Confirm processing step
- Payslip details page
- Payslip header section
- Payslip earnings section
- Payslip deductions section
- Download payslip PDF

### Technology Context

- **Wizard:** Multi-step form
- **Calculations:** Sri Lankan payroll (EPF/ETF/PAYE)
- **PDF:** Payslip generation
- **Currency:** LKR (Sri Lankan Rupees)

---

## Documents in This Group

| # | Document | Description | Tasks Covered |
|---|----------|-------------|---------------|
| 01 | `01_Tasks-69-79_Dashboard-Wizard.md` | Create payroll dashboard and wizard | 69-79 |
| 02 | `02_Tasks-80-84_Payslip-PDF.md` | Create payslip details and PDF download | 80-84 |

---

## Task Summary

| Task # | Task Name | Complexity | Dependencies |
|--------|-----------|------------|--------------|
| 69 | Create Payroll Dashboard Page | Low | Task 16 |
| 70 | Create Payroll Header | Low | Task 69 |
| 71 | Create Payroll Summary Cards | Medium | Task 69 |
| 72 | Create Payroll Periods Table | Medium | Task 69 |
| 73 | Define Period Table Columns | Medium | Task 72 |
| 74 | Create Period Status Badge | Low | Task 73 |
| 75 | Create Payroll Run Page | Medium | Task 16 |
| 76 | Create Period Selection Step | Low | Task 75 |
| 77 | Create Employee Selection Step | Medium | Task 75 |
| 78 | Create Review Calculations Step | High | Task 75 |
| 79 | Create Confirm Processing Step | Medium | Task 75 |
| 80 | Create Payslip Details Page | Medium | Task 16 |
| 81 | Create Payslip Header Section | Low | Task 80 |
| 82 | Create Payslip Earnings Section | Medium | Task 80 |
| 83 | Create Payslip Deductions Section | Medium | Task 80 |
| 84 | Create Download Payslip PDF | Medium | Task 83 |

---

## Execution Order

```
Task 69: Payroll Dashboard Page
    │
    ├──────────────────────────────────────────────────┐
    ▼                                                  │
Task 70: Payroll Header                                │
    │                                                  │
    ▼                                                  │
Task 71: Summary Cards                                 │
    │                                                  │
    ▼                                                  │
Task 72: Periods Table                                 │
    │                                                  │
    ▼                                                  │
Task 73: Period Columns                                │
    │                                                  │
    ▼                                                  │
Task 74: Status Badge                                  │
    │                                                  │
    └──────────────────────────────────────────────────┘
               │
               ▼
         Task 75: Payroll Run Page
               │
         ┌─────┼─────┬─────┬─────┐
         ▼     ▼     ▼     ▼     │
      Task 76 Task 77 Task 78 Task 79
      (Period)(Employees)(Review)(Confirm)
         │     │     │     │     │
         └─────┴─────┴─────┴─────┘
               │
               ▼
         Task 80: Payslip Details
               │
               ▼
         Task 81: Payslip Header
               │
         ┌─────┴─────┐
         ▼           ▼
      Task 82    Task 83
     (Earnings) (Deductions)
         │           │
         └─────┬─────┘
               ▼
         Task 84: PDF
```

---

## Expected Deliverables

```
frontend/
├── app/
│   └── (dashboard)/
│       └── payroll/
│           ├── page.tsx
│           ├── run/
│           │   └── page.tsx
│           └── [id]/
│               └── page.tsx
├── components/
│   └── modules/
│       └── hr/
│           └── Payroll/
│               ├── PayrollDashboard.tsx
│               ├── PayrollHeader.tsx
│               ├── PayrollSummaryCards.tsx
│               ├── PayrollPeriodsTable.tsx
│               ├── PeriodTableColumns.tsx
│               ├── PeriodStatusBadge.tsx
│               ├── PayrollRun/
│               │   ├── PayrollRunPage.tsx
│               │   ├── PeriodSelectionStep.tsx
│               │   ├── EmployeeSelectionStep.tsx
│               │   ├── ReviewCalculationsStep.tsx
│               │   ├── ConfirmProcessingStep.tsx
│               │   └── index.ts
│               ├── Payslip/
│               │   ├── PayslipDetails.tsx
│               │   ├── PayslipHeader.tsx
│               │   ├── PayslipEarnings.tsx
│               │   ├── PayslipDeductions.tsx
│               │   ├── PayslipPDF.tsx
│               │   └── index.ts
│               └── index.ts
└── lib/
    └── validations/
        └── payroll.ts
```

---

## Notes for AI Agents

### Payroll Summary Cards (Task 71)
| Card | Icon | Value |
|------|------|-------|
| Total Payroll | DollarSign | ₨ X,XXX,XXX |
| Pending | Clock | Count pending |
| Processed | CheckCircle | Count processed |

### Period Table Columns (Task 73)
| Column | Width | Sortable |
|--------|-------|----------|
| Period | 120px | Yes |
| Employees | 100px | Yes |
| Total (LKR) | 140px | Yes |
| Status | 100px | Yes |
| Actions | 80px | No |

### Period Status Badge (Task 74)
| Status | Color | Description |
|--------|-------|-------------|
| Draft | Gray | Not started |
| Processing | Yellow | In progress |
| Completed | Green | Fully processed |
| Cancelled | Red | Cancelled |

### Wizard Steps (Tasks 76-79)
| Step | Content |
|------|---------|
| 1. Period | Select month/year |
| 2. Employees | Select who to process |
| 3. Review | Review calculations |
| 4. Confirm | Final confirmation |

### Period Selection (Task 76)
| Field | Type |
|-------|------|
| Month | Select (Jan-Dec) |
| Year | Select |
| Period | Display (1st-last) |

### Employee Selection (Task 77)
| Column | Description |
|--------|-------------|
| Select | Checkbox |
| Employee | Name |
| Department | Department |
| Basic | Basic salary |
| Include | Toggle |

### Review Calculations (Task 78)
| Column | Description |
|--------|-------------|
| Employee | Name |
| Basic | Basic salary |
| Allowances | Total allowances |
| Gross | Gross pay |
| Deductions | Total deductions |
| Net | Net pay |

### Payslip Header (Task 81)
| Element | Content |
|---------|---------|
| Company | Company logo + name |
| Period | Month Year |
| Employee | Name, ID, Department |
| Pay Date | Payment date |

### Payslip Earnings (Task 82)
| Item | Description |
|------|-------------|
| Basic Salary | Monthly basic |
| Attendance | OT, bonus |
| Allowances | Transport, meal, etc. |
| Gross | Total earnings |

### Payslip Deductions (Task 83)
| Item | Rate | Description |
|------|------|-------------|
| EPF (Employee) | 8% | Employee contribution |
| EPF (Employer) | 12% | Employer contribution |
| ETF | 3% | Employer contribution |
| PAYE | Slab | Income tax |
| Other | - | Loans, advances |
| Net Pay | - | Take home |

### PDF Features (Task 84)
| Feature | Description |
|---------|-------------|
| Branding | Company logo |
| Format | A4 portrait |
| Actions | Download, Print |
| Filename | Payslip_EMP-XXX_Month_Year.pdf |
