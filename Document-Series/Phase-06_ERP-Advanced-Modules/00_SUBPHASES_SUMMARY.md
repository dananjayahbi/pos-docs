# Phase 06: ERP Advanced Modules - Sub-Phases Summary

> **Phase Index:** 06 of 10  
> **Phase Goal:** Implement specialized HR, Accounting, and Analytics modules  
> **Total Sub-Phases:** 14 | **Status:** Planning

---

## Navigation

- **↑ Parent:** [00_PHASES_SUMMARY.md](../00_PHASES_SUMMARY.md)
- **← Previous Phase:** [Phase-05](../Phase-05_ERP-Core-Modules-Part2/)
- **→ Next Phase:** [Phase-07](../Phase-07_Frontend-Infrastructure-ERP-Dashboard/)

---

## Phase Overview

This phase implements advanced ERP modules for human resources, payroll (with Sri Lanka EPF/ETF compliance), accounting, and business analytics. These modules are typically Enterprise-tier features.

### Key Outcomes
- Complete HR management system
- Attendance tracking
- Sri Lanka compliant payroll (EPF/ETF)
- Double-entry accounting
- Financial reporting
- Business analytics dashboard

---

## Sub-Phase Index

| # | Sub-Phase Name | Description | Tasks | Status |
|---|----------------|-------------|-------|--------|
| 01 | **Employee Management** | Employee database with personal and job details | TBD | 🔴 Not Created |
| 02 | **Department & Designations** | Organizational structure setup | TBD | 🔴 Not Created |
| 03 | **Attendance System** | Clock in/out, attendance tracking | TBD | 🔴 Not Created |
| 04 | **Leave Management** | Leave types, requests, approvals, balances | TBD | 🔴 Not Created |
| 05 | **Salary Structure** | Pay components, allowances, deductions | TBD | 🔴 Not Created |
| 06 | **Payroll Processing** | Monthly payroll calculation with EPF/ETF | TBD | 🔴 Not Created |
| 07 | **Payslip Generation** | Employee payslips with breakdown | TBD | 🔴 Not Created |
| 08 | **Chart of Accounts** | Account structure for double-entry bookkeeping | TBD | 🔴 Not Created |
| 09 | **Journal Entries** | Manual and automatic journal entries | TBD | 🔴 Not Created |
| 10 | **Account Reconciliation** | Bank reconciliation and account matching | TBD | 🔴 Not Created |
| 11 | **Financial Reports** | P&L, Balance Sheet, Cash Flow | TBD | 🔴 Not Created |
| 12 | **Tax Reporting** | VAT returns, PAYE reports | TBD | 🔴 Not Created |
| 13 | **Dashboard KPIs** | Business performance indicators | TBD | 🔴 Not Created |
| 14 | **Analytics & Reports** | Sales, inventory, financial analytics | TBD | 🔴 Not Created |

---

## Sub-Phase Details

### SubPhase-01: Employee Management
**Goal:** Comprehensive employee database.

**Employee Fields:**
```python
Employee:
  - employee_id (auto-generated)
  - user (FK to User, optional)
  - first_name, last_name
  - email, phone
  - nic_number (National ID)
  - date_of_birth
  - gender
  - address
  - emergency_contact
  - department (FK)
  - designation (FK)
  - manager (FK to Employee)
  - hire_date
  - employment_type (full-time/part-time/contract)
  - status (active/inactive/terminated)
```

**Key Features:**
- Employee directory
- Document storage (contracts, certificates)
- Employment history
- Bank account details (for payroll)

**Dependencies:** Phase-03 (User model)

---

### SubPhase-02: Department & Designations
**Goal:** Define organizational structure.

**Models:**
```python
Department:
  - name
  - code
  - parent (self-referential for hierarchy)
  - manager (FK to Employee)

Designation:
  - title
  - level (for hierarchy)
  - department (FK, optional)
```

**Features:**
- Org chart visualization
- Department budgets (future)
- Designation-based access control

**Dependencies:** SubPhase-01

---

### SubPhase-03: Attendance System
**Goal:** Track employee attendance.

**Features:**
- Clock in / Clock out
- Multiple check-in methods (web, mobile, biometric API)
- Late arrival tracking
- Early departure tracking
- Overtime calculation
- Attendance reports

**Models:**
```python
AttendanceRecord:
  - employee (FK)
  - date
  - clock_in
  - clock_out
  - status (present/absent/late/half-day)
  - work_hours (calculated)
  - overtime_hours
```

**Dependencies:** SubPhase-01

---

### SubPhase-04: Leave Management
**Goal:** Handle employee leave requests.

**Leave Types (Sri Lanka):**
- Annual Leave
- Casual Leave
- Sick Leave
- Maternity/Paternity Leave
- No-Pay Leave

**Features:**
- Leave type configuration
- Annual leave balance
- Leave request workflow
- Manager approval
- Leave calendar view
- Holiday calendar

**Workflow:**
```
Request → Pending → Approved/Rejected → Balance Updated
```

**Dependencies:** SubPhase-01, SubPhase-02

---

### SubPhase-05: Salary Structure
**Goal:** Define pay components for payroll.

**Salary Components:**
```
EARNINGS:
  - Basic Salary
  - Allowances (Transport, Medical, etc.)
  - Overtime Pay
  - Bonus
  - Commission

DEDUCTIONS:
  - EPF Employee (8%)
  - Loan Repayment
  - Advance Deduction
  - No-Pay Deduction

EMPLOYER CONTRIBUTIONS:
  - EPF Employer (12%)
  - ETF (3%)
```

**Features:**
- Salary template creation
- Employee salary assignment
- Effective date tracking
- Salary history

**Dependencies:** SubPhase-01

---

### SubPhase-06: Payroll Processing
**Goal:** Monthly payroll calculation with Sri Lanka compliance.

**Payroll Calculation:**
```
Gross Salary = Basic + Allowances + Overtime + Bonus
Total Deductions = EPF_Employee + Loans + No_Pay
Net Salary = Gross - Deductions

Employer Cost = Gross + EPF_Employer + ETF
```

**Sri Lanka Compliance:**
- EPF: Employee 8%, Employer 12%
- ETF: Employer 3%
- PAYE (Pay As You Earn) tax calculation

**Features:**
- Payroll period setup (monthly)
- Batch processing
- Attendance integration
- Leave deduction
- Payroll approval workflow
- Payroll reversal

**Dependencies:** SubPhase-03, SubPhase-04, SubPhase-05

---

### SubPhase-07: Payslip Generation
**Goal:** Generate employee payslips.

**Payslip Contents:**
- Employee details
- Pay period
- Earnings breakdown
- Deductions breakdown
- Employer contributions (for records)
- Net pay
- Year-to-date totals

**Features:**
- PDF generation
- Bulk generation
- Email distribution
- Employee self-service access

**Dependencies:** SubPhase-06

---

### SubPhase-08: Chart of Accounts
**Goal:** Set up double-entry bookkeeping foundation.

**Account Types:**
```
ASSETS (1xxx)
  ├── Current Assets (11xx)
  │   ├── Cash (1100)
  │   ├── Bank (1110)
  │   ├── Accounts Receivable (1200)
  │   └── Inventory (1300)
  └── Fixed Assets (12xx)
      └── Equipment (1500)

LIABILITIES (2xxx)
  ├── Current Liabilities (21xx)
  │   ├── Accounts Payable (2100)
  │   └── EPF/ETF Payable (2200)
  └── Long-term Liabilities (22xx)

EQUITY (3xxx)
  ├── Owner's Equity (3000)
  └── Retained Earnings (3100)

REVENUE (4xxx)
  ├── Sales Revenue (4100)
  └── Service Revenue (4200)

EXPENSES (5xxx)
  ├── Cost of Goods Sold (5100)
  ├── Salaries Expense (5200)
  └── Rent Expense (5300)
```

**Features:**
- Pre-configured chart of accounts
- Custom account creation
- Account hierarchy
- Account types and sub-types

**Dependencies:** Phase-03

---

### SubPhase-09: Journal Entries
**Goal:** Record financial transactions.

**Entry Types:**
- Manual journal entries
- Auto-generated entries (from sales, purchases)
- Adjusting entries
- Reversing entries

**Features:**
- Double-entry validation (debits = credits)
- Multi-line entries
- Attachments/documents
- Entry templates
- Recurring entries
- Entry approval workflow

**Dependencies:** SubPhase-08

---

### SubPhase-10: Account Reconciliation
**Goal:** Match records with bank statements.

**Features:**
- Bank statement import (CSV)
- Automatic matching
- Manual matching
- Reconciliation report
- Unreconciled items list

**Dependencies:** SubPhase-09

---

### SubPhase-11: Financial Reports
**Goal:** Generate standard financial statements.

**Reports:**
1. **Profit & Loss Statement** (Income Statement)
   - Revenue - Expenses = Net Income

2. **Balance Sheet**
   - Assets = Liabilities + Equity

3. **Cash Flow Statement**
   - Operating, Investing, Financing activities

4. **Trial Balance**
   - All accounts with balances

**Features:**
- Date range selection
- Comparative periods
- PDF/Excel export
- Drill-down to transactions

**Dependencies:** SubPhase-09

---

### SubPhase-12: Tax Reporting
**Goal:** Generate tax compliance reports.

**Sri Lanka Tax Reports:**
- VAT Return (monthly/quarterly)
- PAYE Report
- EPF Return (C form)
- ETF Return

**Features:**
- Report generation
- Filing reminders
- Historical submissions

**Dependencies:** SubPhase-11

---

### SubPhase-13: Dashboard KPIs
**Goal:** Real-time business performance metrics.

**KPI Categories:**
```
SALES:
  - Today's Sales
  - Monthly Sales
  - Sales Growth %
  - Average Order Value

INVENTORY:
  - Stock Value
  - Low Stock Items
  - Fast Moving Products
  - Dead Stock

FINANCIAL:
  - Revenue vs Expenses
  - Gross Profit Margin
  - Net Profit Margin
  - Accounts Receivable Aging

HR:
  - Employee Count
  - Attendance Rate
  - Leave Balance Summary
```

**Features:**
- Real-time updates
- Customizable dashboard
- Role-based visibility
- Alert thresholds

**Dependencies:** Previous phases data

---

### SubPhase-14: Analytics & Reports
**Goal:** Business intelligence and reporting.

**Report Categories:**
- Sales Reports (by product, customer, period)
- Inventory Reports (stock, movement, valuation)
- Purchase Reports (by vendor, category)
- Customer Reports (acquisition, retention)
- Staff Reports (attendance, performance)

**Features:**
- Report builder
- Scheduled reports
- Email distribution
- Export formats (PDF, Excel, CSV)

**Dependencies:** SubPhase-13

---

## Progress Tracking

| Metric | Count |
|--------|-------|
| Total Sub-Phases | 14 |
| Sub-Phases Created | 0 |
| Task Documents Created | 0 |

**Last Updated:** 2026-01-17  
**Current Status:** Awaiting approval to create Sub-Phase folders

---

## Execution Order

```
HR MODULE:
SubPhase-01 (Employee) ──→ SubPhase-02 (Dept/Designation)
       │                           │
       ├──→ SubPhase-03 (Attendance) ──┐
       │                               │
       └──→ SubPhase-04 (Leave) ──────┤
                                       ▼
       SubPhase-05 (Salary) ──→ SubPhase-06 (Payroll) ──→ SubPhase-07 (Payslip)

ACCOUNTING MODULE:
SubPhase-08 (CoA) ──→ SubPhase-09 (Journal) ──→ SubPhase-10 (Reconciliation)
                              │
                              └──→ SubPhase-11 (Reports) ──→ SubPhase-12 (Tax)

ANALYTICS:
SubPhase-13 (KPIs) ──→ SubPhase-14 (Reports)
```

---

## Next Steps

1. ✅ Sub-Phases Summary Document Created (This file)
2. ⏳ Awaiting user review via flow.py
3. ⏳ Create 14 Sub-Phase folders
4. ⏳ Create Task summary for each Sub-Phase
5. ⏳ Create individual Task documents

---

*AI Agents: EPF/ETF calculations are critical for Sri Lanka compliance. Ensure accuracy in payroll module.*
