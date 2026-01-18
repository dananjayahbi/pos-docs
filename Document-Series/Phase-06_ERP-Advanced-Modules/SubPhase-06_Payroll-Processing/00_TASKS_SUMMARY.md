# SubPhase 06: Payroll Processing - Tasks Summary

> **Phase:** 06 - ERP Advanced Modules  
> **SubPhase Index:** 06 of 14  
> **SubPhase Goal:** Process monthly payroll with Sri Lanka EPF/ETF compliance  
> **Total Tasks:** 92 | **Status:** Planning  
> **Estimated Duration:** 14-16 hours

---

## Navigation

- **↑ Parent:** [00_SUBPHASES_SUMMARY.md](../00_SUBPHASES_SUMMARY.md)
- **← Previous SubPhase:** [SubPhase-05_Salary-Structure](../SubPhase-05_Salary-Structure/)
- **→ Next SubPhase:** [SubPhase-07_Payslip-Generation](../SubPhase-07_Payslip-Generation/)

---

## SubPhase Overview

This sub-phase implements the core payroll processing engine. Handles monthly payroll runs with attendance integration, leave deductions, overtime calculation, EPF/ETF/PAYE computation, and approval workflow. Full Sri Lanka labor law compliance.

### Key Outcomes
- Payroll period configuration (monthly)
- Batch payroll processing
- Attendance-based calculations
- Leave deduction integration
- Overtime calculation from attendance
- EPF/ETF computation and reporting
- PAYE tax calculation
- Payroll approval workflow
- Payroll finalization and locking
- Payroll reversal/correction

### Technology Context
- **Backend:** Django 5.x with DRF for API
- **Processing:** Celery for batch processing
- **Calculations:** Decimal precision for currency
- **Frontend:** Next.js 14+ with TypeScript
- **Compliance:** Sri Lanka EPF/ETF Act

### Dependencies
- Phase-06 SubPhase-01: Employee model
- Phase-06 SubPhase-03: Attendance (work days, overtime)
- Phase-06 SubPhase-04: Leave (unpaid leave)
- Phase-06 SubPhase-05: Salary Structure

---

## Task Execution Order

```
TASK GROUP A: Payroll Period Models (Tasks 01-16)
        │
        ▼
TASK GROUP B: Payroll Run & Employee Payroll (Tasks 17-34)
        │
        ▼
TASK GROUP C: Payroll Calculation Engine (Tasks 35-52)
        │
        ▼
TASK GROUP D: EPF/ETF/PAYE Processing (Tasks 53-68)
        │
        ▼
TASK GROUP E: Approval & Finalization (Tasks 69-82)
        │
        ▼
TASK GROUP F: API, Testing & Documentation (Tasks 83-92)
```

---

## Task Index

### Group A: Payroll Period Models (Tasks 01-16)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 01 | **Extend payroll App** | Add payroll processing to existing payroll app | None | 🔴 Not Created |
| 02 | **Define PayrollStatus Choices** | Create enum: DRAFT, PROCESSING, PROCESSED, APPROVED, FINALIZED, REVERSED | Task 01 | 🔴 Not Created |
| 03 | **Create PayrollPeriod Model** | Define monthly payroll period | Task 02 | 🔴 Not Created |
| 04 | **Add Period Date Fields** | Add start_date, end_date, pay_date | Task 03 | 🔴 Not Created |
| 05 | **Add Period Name Field** | Add name (e.g., "January 2026") | Task 03 | 🔴 Not Created |
| 06 | **Add Period Status Field** | Add status using PayrollStatus | Task 03 | 🔴 Not Created |
| 07 | **Add Period Lock Fields** | Add is_locked, locked_at, locked_by | Task 03 | 🔴 Not Created |
| 08 | **Add Period Working Days** | Add total_working_days for period | Task 03 | 🔴 Not Created |
| 09 | **Run PayrollPeriod Migrations** | Generate and apply migrations | Task 08 | 🔴 Not Created |
| 10 | **Create PayrollSettings Model** | Tenant settings for payroll | Task 09 | 🔴 Not Created |
| 11 | **Add Settings Pay Day** | Add default_pay_day (e.g., 25th) | Task 10 | 🔴 Not Created |
| 12 | **Add Settings Cutoff** | Add attendance_cutoff_day | Task 10 | 🔴 Not Created |
| 13 | **Add Settings Approval** | Add require_approval boolean | Task 10 | 🔴 Not Created |
| 14 | **Add Settings Auto Create** | Add auto_create_period boolean | Task 10 | 🔴 Not Created |
| 15 | **Run PayrollSettings Migrations** | Generate and apply migrations | Task 14 | 🔴 Not Created |
| 16 | **Create Period Auto-Generation Task** | Celery task to create monthly periods | Task 15 | 🔴 Not Created |

---

### Group B: Payroll Run & Employee Payroll (Tasks 17-34)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 17 | **Create PayrollRun Model** | Model for each payroll processing run | Task 16 | 🔴 Not Created |
| 18 | **Add Run Period FK** | Add payroll_period ForeignKey | Task 17 | 🔴 Not Created |
| 19 | **Add Run Status Field** | Add status, started_at, completed_at | Task 17 | 🔴 Not Created |
| 20 | **Add Run Summary Fields** | Add total_employees, total_gross, total_net | Task 17 | 🔴 Not Created |
| 21 | **Add Run User Fields** | Add processed_by, approved_by | Task 17 | 🔴 Not Created |
| 22 | **Run PayrollRun Migrations** | Generate and apply migrations | Task 21 | 🔴 Not Created |
| 23 | **Create EmployeePayroll Model** | Individual employee payroll record | Task 22 | 🔴 Not Created |
| 24 | **Add Employee FK** | Add employee ForeignKey | Task 23 | 🔴 Not Created |
| 25 | **Add Payroll Run FK** | Add payroll_run ForeignKey | Task 23 | 🔴 Not Created |
| 26 | **Add Salary Reference** | Add employee_salary FK (snapshot) | Task 23 | 🔴 Not Created |
| 27 | **Add Attendance Fields** | Add days_worked, days_absent, overtime_hours | Task 23 | 🔴 Not Created |
| 28 | **Add Financial Summary Fields** | Add gross_salary, total_deductions, net_salary | Task 23 | 🔴 Not Created |
| 29 | **Add EPF/ETF Fields** | Add epf_employee, epf_employer, etf | Task 23 | 🔴 Not Created |
| 30 | **Add Tax Field** | Add paye_tax | Task 23 | 🔴 Not Created |
| 31 | **Add Bank Fields** | Add bank_account snapshot for payment | Task 23 | 🔴 Not Created |
| 32 | **Add Payment Status** | Add payment_status: PENDING, PAID, FAILED | Task 23 | 🔴 Not Created |
| 33 | **Run EmployeePayroll Migrations** | Generate and apply migrations | Task 32 | 🔴 Not Created |
| 34 | **Create Unique Constraint** | One payroll per employee per period | Task 33 | 🔴 Not Created |

---

### Group C: Payroll Calculation Engine (Tasks 35-52)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 35 | **Create PayrollLineItem Model** | Detailed line items for each component | Task 34 | 🔴 Not Created |
| 36 | **Add Line Item Fields** | Add employee_payroll FK, component FK, amount | Task 35 | 🔴 Not Created |
| 37 | **Add Line Item Type** | Add line_type: EARNING, DEDUCTION, CONTRIBUTION | Task 35 | 🔴 Not Created |
| 38 | **Run PayrollLineItem Migrations** | Generate and apply migrations | Task 37 | 🔴 Not Created |
| 39 | **Create PayrollProcessor Service** | Main payroll processing engine | Task 38 | 🔴 Not Created |
| 40 | **Implement Get Eligible Employees** | Find employees for payroll | Task 39 | 🔴 Not Created |
| 41 | **Implement Fetch Attendance Data** | Get attendance for period | Task 39 | 🔴 Not Created |
| 42 | **Implement Calculate Working Days** | Count actual days worked | Task 39 | 🔴 Not Created |
| 43 | **Implement Calculate Overtime** | Sum overtime hours from attendance | Task 39 | 🔴 Not Created |
| 44 | **Implement Calculate Unpaid Leave** | Count no-pay leave days | Task 39 | 🔴 Not Created |
| 45 | **Implement Calculate Basic Pro-Rata** | Adjust basic for attendance | Task 39 | 🔴 Not Created |
| 46 | **Implement Calculate Earnings** | Sum all earning components | Task 39 | 🔴 Not Created |
| 47 | **Implement Calculate Deductions** | Sum all deduction components | Task 39 | 🔴 Not Created |
| 48 | **Implement Calculate Gross** | Total earnings | Task 39 | 🔴 Not Created |
| 49 | **Implement Calculate Net** | Gross minus deductions | Task 39 | 🔴 Not Created |
| 50 | **Create Batch Processing** | Process all employees in batch | Task 39 | 🔴 Not Created |
| 51 | **Create Processing Celery Task** | Async payroll processing | Task 50 | 🔴 Not Created |
| 52 | **Add Progress Tracking** | Track processing progress | Task 51 | 🔴 Not Created |

---

### Group D: EPF/ETF/PAYE Processing (Tasks 53-68)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 53 | **Create EPFContribution Model** | Track EPF contributions per month | Task 52 | 🔴 Not Created |
| 54 | **Add EPF Fields** | Add employee_payroll FK, employee_amount, employer_amount | Task 53 | 🔴 Not Created |
| 55 | **Add EPF Base Field** | Add epf_base (applicable earnings) | Task 53 | 🔴 Not Created |
| 56 | **Run EPFContribution Migrations** | Generate and apply migrations | Task 55 | 🔴 Not Created |
| 57 | **Create ETFContribution Model** | Track ETF contributions | Task 56 | 🔴 Not Created |
| 58 | **Add ETF Fields** | Add employee_payroll FK, employer_amount | Task 57 | 🔴 Not Created |
| 59 | **Run ETFContribution Migrations** | Generate and apply migrations | Task 58 | 🔴 Not Created |
| 60 | **Create PAYECalculation Model** | Track PAYE tax calculations | Task 59 | 🔴 Not Created |
| 61 | **Add PAYE Fields** | Add taxable_income, tax_amount, ytd_tax | Task 60 | 🔴 Not Created |
| 62 | **Run PAYECalculation Migrations** | Generate and apply migrations | Task 61 | 🔴 Not Created |
| 63 | **Implement EPF in Processor** | Integrate EPF calculation | Task 62 | 🔴 Not Created |
| 64 | **Implement ETF in Processor** | Integrate ETF calculation | Task 62 | 🔴 Not Created |
| 65 | **Implement PAYE in Processor** | Integrate PAYE tax calculation | Task 62 | 🔴 Not Created |
| 66 | **Create EPF Return Report** | Generate EPF return data | Task 65 | 🔴 Not Created |
| 67 | **Create ETF Return Report** | Generate ETF return data | Task 65 | 🔴 Not Created |
| 68 | **Create PAYE Return Report** | Generate PAYE return data | Task 65 | 🔴 Not Created |

---

### Group E: Approval & Finalization (Tasks 69-82)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 69 | **Create PayrollApprovalService** | Service for approval workflow | Task 68 | 🔴 Not Created |
| 70 | **Implement Submit for Approval** | Submit payroll run for approval | Task 69 | 🔴 Not Created |
| 71 | **Implement Approve Payroll** | Manager/HR approval | Task 69 | 🔴 Not Created |
| 72 | **Implement Reject Payroll** | Reject with reason | Task 69 | 🔴 Not Created |
| 73 | **Create PayrollFinalizationService** | Service for finalization | Task 72 | 🔴 Not Created |
| 74 | **Implement Finalize Payroll** | Lock payroll, prevent edits | Task 73 | 🔴 Not Created |
| 75 | **Implement Generate Bank File** | Create bank transfer file | Task 73 | 🔴 Not Created |
| 76 | **Implement Mark as Paid** | Update payment status | Task 73 | 🔴 Not Created |
| 77 | **Create PayrollReversalService** | Service for corrections | Task 76 | 🔴 Not Created |
| 78 | **Implement Reverse Payroll** | Reverse finalized payroll | Task 77 | 🔴 Not Created |
| 79 | **Implement Correction Entry** | Create correction entries | Task 77 | 🔴 Not Created |
| 80 | **Create PayrollHistory Model** | Audit trail for payroll changes | Task 79 | 🔴 Not Created |
| 81 | **Run PayrollHistory Migrations** | Generate and apply migrations | Task 80 | 🔴 Not Created |
| 82 | **Create Payroll Summary Report** | Summary of payroll run | Task 81 | 🔴 Not Created |

---

### Group F: API, Testing & Documentation (Tasks 83-92)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 83 | **Create PayrollPeriodSerializer** | DRF serializer for period | Task 82 | 🔴 Not Created |
| 84 | **Create PayrollRunSerializer** | DRF serializer for run | Task 83 | 🔴 Not Created |
| 85 | **Create EmployeePayrollSerializer** | DRF serializer for employee payroll | Task 83 | 🔴 Not Created |
| 86 | **Create PayrollPeriodViewSet** | ViewSet for period management | Task 85 | 🔴 Not Created |
| 87 | **Create PayrollRunViewSet** | ViewSet with process, approve actions | Task 86 | 🔴 Not Created |
| 88 | **Add Payroll Actions** | Actions: process, approve, finalize, reverse | Task 87 | 🔴 Not Created |
| 89 | **Create Report Endpoints** | Endpoints for EPF/ETF/PAYE reports | Task 87 | 🔴 Not Created |
| 90 | **Register Payroll Processing URLs** | Add all endpoints to URL config | Task 89 | 🔴 Not Created |
| 91 | **Create Payroll Processing Tests** | Unit and integration tests | Task 90 | 🔴 Not Created |
| 92 | **Create Payroll Documentation** | API docs, processing workflow guide | Task 91 | 🔴 Not Created |

---

## Expected File Structure

```
backend/apps/payroll/
├── models/
│   ├── ... (from SubPhase-05)
│   ├── payroll_period.py      # PayrollPeriod model
│   ├── payroll_settings.py    # PayrollSettings model
│   ├── payroll_run.py         # PayrollRun model
│   ├── employee_payroll.py    # EmployeePayroll model
│   ├── payroll_line_item.py   # PayrollLineItem model
│   ├── epf_contribution.py    # EPFContribution model
│   ├── etf_contribution.py    # ETFContribution model
│   ├── paye_calculation.py    # PAYECalculation model
│   └── payroll_history.py     # PayrollHistory model
├── services/
│   ├── ... (from SubPhase-05)
│   ├── payroll_processor.py   # Main processing engine
│   ├── approval_service.py    # Approval workflow
│   ├── finalization_service.py # Finalization
│   ├── reversal_service.py    # Reversal/corrections
│   └── bank_file_service.py   # Bank transfer file
├── serializers/
│   ├── ... (from SubPhase-05)
│   ├── period_serializer.py
│   ├── run_serializer.py
│   └── employee_payroll_serializer.py
├── views/
│   ├── ... (from SubPhase-05)
│   ├── period_viewset.py
│   ├── run_viewset.py
│   └── report_views.py
├── tasks/
│   ├── __init__.py
│   ├── period_tasks.py        # Auto-create periods
│   └── processing_tasks.py    # Batch processing
└── tests/
    ├── ... (from SubPhase-05)
    ├── test_processor.py
    ├── test_approval.py
    └── test_finalization.py
```

---

## Payroll Processing Workflow

```
                        ┌─────────────────────────────┐
                        │    Create Payroll Period    │
                        │    (January 2026)           │
                        └─────────────┬───────────────┘
                                      │
                                      ▼
                              ┌───────────────┐
                              │    DRAFT      │ ← Period created
                              └───────┬───────┘
                                      │ process()
                                      ▼
                              ┌───────────────┐
                              │  PROCESSING   │ ← Celery task running
                              └───────┬───────┘
                                      │ complete
                                      ▼
                              ┌───────────────┐
                              │   PROCESSED   │ ← Review payroll
                              └───────┬───────┘
                                      │ submit_for_approval()
                                      ▼
                              ┌───────────────┐
                              │   APPROVED    │ ← Manager approved
                              └───────┬───────┘
                                      │ finalize()
                                      ▼
                              ┌───────────────┐
                              │   FINALIZED   │ ← Locked, ready for payment
                              └───────────────┘

  REVERSAL (if error found):
  ┌───────────────┐
  │   REVERSED    │ ← Create correction run
  └───────────────┘
```

---

## Payroll Calculation Flow

```
FOR EACH EMPLOYEE:
─────────────────────────────────────────────────────────

1. GET SALARY STRUCTURE
   │
   ▼
2. GET ATTENDANCE DATA
   ├── Days Worked
   ├── Days Absent
   ├── Late Arrivals
   └── Overtime Hours
   │
   ▼
3. GET LEAVE DATA
   └── Unpaid Leave Days
   │
   ▼
4. CALCULATE EARNINGS
   ├── Basic Salary (pro-rata for attendance)
   ├── Allowances
   ├── Overtime Pay
   └── Bonus/Commission
   │
   ▼
5. CALCULATE GROSS SALARY
   │
   ▼
6. CALCULATE DEDUCTIONS
   ├── EPF Employee (8%)
   ├── PAYE Tax
   ├── Loan Repayment
   └── No-Pay Deduction
   │
   ▼
7. CALCULATE NET SALARY
   │
   ▼
8. CALCULATE EMPLOYER CONTRIBUTIONS
   ├── EPF Employer (12%)
   └── ETF (3%)
   │
   ▼
9. CREATE PAYROLL RECORD
```

---

## Pro-Rata Calculation Example

```
SCENARIO: Employee joined mid-month
─────────────────────────────────────
Total Working Days in Month: 22
Employee Worked:             15 days
Unpaid Leave:                 2 days
Effective Days:              13 days

Basic Salary:          LKR 100,000
Pro-Rata Factor:       13/22 = 0.59

Pro-Rata Basic:        100,000 × 0.59 = LKR 59,091
```

---

## EPF/ETF Monthly Summary

```
PAYROLL PERIOD: January 2026
TOTAL EMPLOYEES: 50
─────────────────────────────────────────────────────────
                          Amount (LKR)
─────────────────────────────────────────────────────────
Total EPF Base:           5,000,000
EPF Employee (8%):          400,000
EPF Employer (12%):         600,000
TOTAL EPF:                1,000,000

ETF Employer (3%):          150,000
TOTAL ETF:                  150,000
─────────────────────────────────────────────────────────
```

---

## Bank Transfer File Format

```
BANK FILE FORMAT (Sample):
─────────────────────────────────────────────────────────
Batch ID: PAY-202601-001
Company: Lanka Commerce Ltd
Date: 2026-01-25
Total Amount: LKR 4,500,000

TRANSACTIONS:
─────────────────────────────────────────────────────────
Employee ID | Account No      | Bank    | Amount
EMP-0001    | 123456789012   | BOC     | 95,000
EMP-0002    | 234567890123   | Commercial | 85,000
EMP-0003    | 345678901234   | HNB     | 78,000
...
```

---

## Key Business Rules

1. **One Run Per Period:** Cannot reprocess finalized period
2. **Attendance Cutoff:** Process after attendance cutoff date
3. **Approval Required:** Optional approval before finalization
4. **Lock After Finalize:** No edits after finalization
5. **Reversal Trail:** Track all reversals with reason
6. **EPF Ceiling:** Check for EPF contribution ceiling
7. **PAYE YTD:** Track year-to-date for tax calculation
8. **Bank Verification:** Only pay to verified bank accounts

---

## Progress Tracking

| Metric | Count |
|--------|-------|
| Total Tasks | 92 |
| Tasks Completed | 0 |
| Tasks In Progress | 0 |
| Completion Percentage | 0% |

**Last Updated:** 2026-01-17  
**Next Action:** Create Task 01 (Extend payroll App)

---

## Notes for AI Agents

- Payroll processing is critical - ensure accuracy
- Use database transactions for atomicity
- Celery for batch processing with progress tracking
- EPF/ETF returns needed monthly for compliance
- Bank file format varies by bank
- Consider retry mechanism for failed processing
- Audit trail essential for HR compliance
- Integrate with accounting for GL posting

---

*End of SubPhase 06 Tasks Summary*
