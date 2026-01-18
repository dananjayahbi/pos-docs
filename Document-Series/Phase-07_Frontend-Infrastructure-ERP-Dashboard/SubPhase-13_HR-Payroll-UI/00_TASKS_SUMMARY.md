# SubPhase 13: HR & Payroll UI - Tasks Summary

> **Phase:** 07 - Frontend Infrastructure & ERP Dashboard  
> **SubPhase Index:** 13 of 14  
> **SubPhase Goal:** Build HR management interfaces including employee directory, attendance, leave management, and payroll processing  
> **Total Tasks:** 96 | **Status:** Planning  
> **Estimated Duration:** 10-12 hours

---

## Navigation

- **↑ Parent:** [00_SUBPHASES_SUMMARY.md](../00_SUBPHASES_SUMMARY.md)
- **← Previous SubPhase:** [SubPhase-12_Customer-Vendor-UI](../SubPhase-12_Customer-Vendor-UI/)
- **→ Next SubPhase:** [SubPhase-14_Settings-Configuration-UI](../SubPhase-14_Settings-Configuration-UI/)

---

## SubPhase Overview

This sub-phase creates the complete HR & Payroll module UI for the ERP dashboard. It includes employee directory, attendance management, leave requests, payroll processing, and payslip generation.

### Key Outcomes
- Employee directory with profiles
- Org chart visualization
- Attendance calendar view
- Leave request workflow
- Payroll batch processing
- Payslip PDF generation
- Department management
- Shift scheduling

### Technology Context
- **Data Display:** Tables, calendar, org chart
- **Forms:** React Hook Form + Zod
- **Calendar:** Date-based views
- **PDF:** Payslip PDF generation
- **API:** HR service from SubPhase-04

### HR Concepts
- **Employee:** Staff member with profile
- **Attendance:** Daily check-in/out records
- **Leave:** Time off requests with approval
- **Payroll:** Monthly salary calculation and payment

---

## Task Execution Order

```
TASK GROUP A: HR Routes & Pages Structure (Tasks 01-16)
        │
        ▼
TASK GROUP B: Employee Management (Tasks 17-34)
        │
        ▼
TASK GROUP C: Attendance Management (Tasks 35-52)
        │
        ▼
TASK GROUP D: Leave Management (Tasks 53-68)
        │
        ▼
TASK GROUP E: Payroll Processing (Tasks 69-84)
        │
        ▼
TASK GROUP F: Reports & Testing (Tasks 85-96)
```

---

## Task Index

### Group A: HR Routes & Pages Structure (Tasks 01-16)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 01 | **Create HR Route Directories** | Set up app/(dashboard)/employees/, attendance/, leave/, payroll/ | SubPhase-07 | 🔴 Not Created |
| 02 | **Create Employees List Page Route** | Create employees/page.tsx | Task 01 | 🔴 Not Created |
| 03 | **Create Employee Details Page Route** | Create employees/[id]/page.tsx | Task 01 | 🔴 Not Created |
| 04 | **Create New Employee Page Route** | Create employees/new/page.tsx | Task 01 | 🔴 Not Created |
| 05 | **Create Org Chart Page Route** | Create employees/org-chart/page.tsx | Task 01 | 🔴 Not Created |
| 06 | **Create Attendance Page Route** | Create attendance/page.tsx | Task 01 | 🔴 Not Created |
| 07 | **Create Attendance Report Page Route** | Create attendance/reports/page.tsx | Task 06 | 🔴 Not Created |
| 08 | **Create Leave Page Route** | Create leave/page.tsx | Task 01 | 🔴 Not Created |
| 09 | **Create Leave Request Page Route** | Create leave/request/page.tsx | Task 08 | 🔴 Not Created |
| 10 | **Create Payroll Page Route** | Create payroll/page.tsx | Task 01 | 🔴 Not Created |
| 11 | **Create Payroll Run Page Route** | Create payroll/run/page.tsx | Task 10 | 🔴 Not Created |
| 12 | **Create Payslip Details Page Route** | Create payroll/[id]/page.tsx | Task 10 | 🔴 Not Created |
| 13 | **Configure Page Metadata** | Set up SEO metadata for HR pages | Task 01 | 🔴 Not Created |
| 14 | **Create HR Loading States** | Loading.tsx for HR pages | Task 01 | 🔴 Not Created |
| 15 | **Create HR Error Boundaries** | Error.tsx for HR pages | Task 01 | 🔴 Not Created |
| 16 | **Verify Route Structure** | Test all HR routes are accessible | Task 15 | 🔴 Not Created |

---

### Group B: Employee Management (Tasks 17-34)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 17 | **Create Employees List Page** | Main employee directory | Task 16 | 🔴 Not Created |
| 18 | **Create Employees Header** | Header with add employee action | Task 17 | 🔴 Not Created |
| 19 | **Create Employee Summary Cards** | Summary cards (total, active, departments) | Task 17 | 🔴 Not Created |
| 20 | **Create Employee Filters** | Search and filter toolbar | Task 17 | 🔴 Not Created |
| 21 | **Create Department Filter** | Filter by department | Task 20 | 🔴 Not Created |
| 22 | **Create Status Filter** | Filter by active/inactive | Task 20 | 🔴 Not Created |
| 23 | **Create Employee Cards Grid** | Card view of employees | Task 17 | 🔴 Not Created |
| 24 | **Create Employee Card Component** | Single employee card | Task 23 | 🔴 Not Created |
| 25 | **Create Employee Avatar** | Photo or initials avatar | Task 24 | 🔴 Not Created |
| 26 | **Create Employees Table View** | Alternative table view | Task 17 | 🔴 Not Created |
| 27 | **Create View Toggle** | Toggle cards/table | Task 26 | 🔴 Not Created |
| 28 | **Create Employee Details Page** | Employee profile view | Task 16 | 🔴 Not Created |
| 29 | **Create Employee Profile Header** | Photo, name, position | Task 28 | 🔴 Not Created |
| 30 | **Create Employee Tabs** | Personal, Employment, Documents | Task 28 | 🔴 Not Created |
| 31 | **Create Personal Info Tab** | Contact, emergency contact | Task 30 | 🔴 Not Created |
| 32 | **Create Employment Info Tab** | Position, salary, dates | Task 30 | 🔴 Not Created |
| 33 | **Create Org Chart Page** | Organization hierarchy view | Task 16 | 🔴 Not Created |
| 34 | **Create Org Chart Node** | Single employee node | Task 33 | 🔴 Not Created |

---

### Group C: Attendance Management (Tasks 35-52)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 35 | **Create Attendance Page** | Main attendance dashboard | Task 16 | 🔴 Not Created |
| 36 | **Create Attendance Header** | Date selector, actions | Task 35 | 🔴 Not Created |
| 37 | **Create Today Summary Cards** | Present, absent, late counts | Task 35 | 🔴 Not Created |
| 38 | **Create Present Count Card** | Card with present count | Task 37 | 🔴 Not Created |
| 39 | **Create Absent Count Card** | Card with absent count | Task 37 | 🔴 Not Created |
| 40 | **Create Late Count Card** | Card with late arrivals | Task 37 | 🔴 Not Created |
| 41 | **Create Attendance Calendar** | Monthly calendar view | Task 35 | 🔴 Not Created |
| 42 | **Create Calendar Day Cell** | Single day with status | Task 41 | 🔴 Not Created |
| 43 | **Create Attendance Legend** | Color legend for statuses | Task 41 | 🔴 Not Created |
| 44 | **Create Daily Attendance List** | List view for selected day | Task 35 | 🔴 Not Created |
| 45 | **Create Attendance Row** | Employee check-in/out times | Task 44 | 🔴 Not Created |
| 46 | **Create Manual Entry Modal** | Manual attendance entry | Task 44 | 🔴 Not Created |
| 47 | **Create Clock In/Out Button** | Self check-in/out | Task 35 | 🔴 Not Created |
| 48 | **Create Attendance Filters** | Department, status filters | Task 35 | 🔴 Not Created |
| 49 | **Create Attendance Report Page** | Detailed attendance report | Task 16 | 🔴 Not Created |
| 50 | **Create Date Range Selector** | Select report date range | Task 49 | 🔴 Not Created |
| 51 | **Create Attendance Report Table** | Summary report table | Task 49 | 🔴 Not Created |
| 52 | **Create Export Attendance** | Export to CSV/Excel | Task 51 | 🔴 Not Created |

---

### Group D: Leave Management (Tasks 53-68)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 53 | **Create Leave Dashboard Page** | Leave management overview | Task 16 | 🔴 Not Created |
| 54 | **Create Leave Header** | Header with request button | Task 53 | 🔴 Not Created |
| 55 | **Create Leave Balance Cards** | Leave balances by type | Task 53 | 🔴 Not Created |
| 56 | **Create Leave Balance Card** | Single leave type balance | Task 55 | 🔴 Not Created |
| 57 | **Create Leave Requests Table** | Table of leave requests | Task 53 | 🔴 Not Created |
| 58 | **Define Leave Request Columns** | Employee, Type, Dates, Status | Task 57 | 🔴 Not Created |
| 59 | **Create Leave Status Badge** | Pending, Approved, Rejected | Task 58 | 🔴 Not Created |
| 60 | **Create Leave Request Page** | New leave request form | Task 16 | 🔴 Not Created |
| 61 | **Create Leave Form Schema** | Zod schema for leave | Task 60 | 🔴 Not Created |
| 62 | **Create Leave Type Select** | Select leave type | Task 61 | 🔴 Not Created |
| 63 | **Create Leave Date Picker** | Start and end date | Task 61 | 🔴 Not Created |
| 64 | **Create Leave Reason Input** | Reason for leave | Task 61 | 🔴 Not Created |
| 65 | **Create Leave Approval Actions** | Approve/Reject buttons | Task 57 | 🔴 Not Created |
| 66 | **Create Approval Modal** | Confirm approval with notes | Task 65 | 🔴 Not Created |
| 67 | **Create Leave Calendar View** | Calendar showing leaves | Task 53 | 🔴 Not Created |
| 68 | **Connect Leave to API** | Use useLeave hook | Task 67 | 🔴 Not Created |

---

### Group E: Payroll Processing (Tasks 69-84)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 69 | **Create Payroll Dashboard Page** | Payroll overview | Task 16 | 🔴 Not Created |
| 70 | **Create Payroll Header** | Header with run payroll action | Task 69 | 🔴 Not Created |
| 71 | **Create Payroll Summary Cards** | Total, pending, processed | Task 69 | 🔴 Not Created |
| 72 | **Create Payroll Periods Table** | List of payroll periods | Task 69 | 🔴 Not Created |
| 73 | **Define Period Table Columns** | Period, Employees, Total, Status | Task 72 | 🔴 Not Created |
| 74 | **Create Period Status Badge** | Draft, Processing, Completed | Task 73 | 🔴 Not Created |
| 75 | **Create Payroll Run Page** | Process payroll wizard | Task 16 | 🔴 Not Created |
| 76 | **Create Period Selection Step** | Select payroll period | Task 75 | 🔴 Not Created |
| 77 | **Create Employee Selection Step** | Select employees to process | Task 75 | 🔴 Not Created |
| 78 | **Create Review Calculations Step** | Review salary calculations | Task 75 | 🔴 Not Created |
| 79 | **Create Confirm Processing Step** | Final confirmation | Task 75 | 🔴 Not Created |
| 80 | **Create Payslip Details Page** | Individual payslip view | Task 16 | 🔴 Not Created |
| 81 | **Create Payslip Header Section** | Employee, period info | Task 80 | 🔴 Not Created |
| 82 | **Create Payslip Earnings Section** | Salary, allowances | Task 80 | 🔴 Not Created |
| 83 | **Create Payslip Deductions Section** | EPF, ETF, taxes | Task 80 | 🔴 Not Created |
| 84 | **Create Download Payslip PDF** | Download/print payslip | Task 83 | 🔴 Not Created |

---

### Group F: Reports & Testing (Tasks 85-96)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 85 | **Create Employee Form Page** | New/Edit employee form | Task 16 | 🔴 Not Created |
| 86 | **Create Employee Form Schema** | Zod schema for employee | Task 85 | 🔴 Not Created |
| 87 | **Create Personal Info Section** | Name, NIC, DOB, gender | Task 86 | 🔴 Not Created |
| 88 | **Create Contact Info Section** | Phone, email, address | Task 86 | 🔴 Not Created |
| 89 | **Create Employment Info Section** | Position, department, salary | Task 86 | 🔴 Not Created |
| 90 | **Create Document Upload Section** | NIC copy, contracts | Task 86 | 🔴 Not Created |
| 91 | **Create Department Management** | CRUD for departments | Task 17 | 🔴 Not Created |
| 92 | **Create Department Modal** | Add/edit department | Task 91 | 🔴 Not Created |
| 93 | **Create Position Management** | CRUD for positions | Task 17 | 🔴 Not Created |
| 94 | **Create Position Modal** | Add/edit position | Task 93 | 🔴 Not Created |
| 95 | **Create HR Module Documentation** | Document all HR components | Task 94 | 🔴 Not Created |
| 96 | **Final Verification & Testing** | Test complete HR module | Task 95 | 🔴 Not Created |

---

## Expected Final Structure

```
frontend/
├── app/
│   └── (dashboard)/
│       ├── employees/
│       │   ├── page.tsx              # Employee directory
│       │   ├── loading.tsx
│       │   ├── error.tsx
│       │   ├── new/
│       │   │   └── page.tsx          # New employee
│       │   ├── org-chart/
│       │   │   └── page.tsx          # Org chart
│       │   └── [id]/
│       │       └── page.tsx          # Employee profile
│       ├── attendance/
│       │   ├── page.tsx              # Attendance dashboard
│       │   └── reports/
│       │       └── page.tsx          # Attendance reports
│       ├── leave/
│       │   ├── page.tsx              # Leave management
│       │   └── request/
│       │       └── page.tsx          # New leave request
│       └── payroll/
│           ├── page.tsx              # Payroll dashboard
│           ├── run/
│           │   └── page.tsx          # Run payroll
│           └── [id]/
│               └── page.tsx          # Payslip details
├── components/
│   └── modules/
│       └── hr/
│           ├── Employees/
│           │   ├── EmployeesList.tsx
│           │   ├── EmployeeCard.tsx
│           │   ├── EmployeeProfile.tsx
│           │   ├── EmployeeForm.tsx
│           │   ├── OrgChart.tsx
│           │   └── index.ts
│           ├── Attendance/
│           │   ├── AttendanceDashboard.tsx
│           │   ├── AttendanceCalendar.tsx
│           │   ├── DailyAttendance.tsx
│           │   ├── ManualEntryModal.tsx
│           │   └── index.ts
│           ├── Leave/
│           │   ├── LeaveDashboard.tsx
│           │   ├── LeaveBalances.tsx
│           │   ├── LeaveRequests.tsx
│           │   ├── LeaveRequestForm.tsx
│           │   ├── LeaveCalendar.tsx
│           │   └── index.ts
│           ├── Payroll/
│           │   ├── PayrollDashboard.tsx
│           │   ├── PayrollRun.tsx
│           │   ├── PayslipDetails.tsx
│           │   ├── PayslipPDF.tsx
│           │   └── index.ts
│           └── index.ts
└── lib/
    └── validations/
        ├── employee.ts
        ├── attendance.ts
        ├── leave.ts
        └── payroll.ts
```

---

## Leave Request Status Flow

```
┌─────────┐    ┌──────────┐    ┌──────────┐
│ Pending │ -> │ Approved │ -> │ Completed│
└─────────┘    └──────────┘    └──────────┘
     │
     ▼
┌──────────┐
│ Rejected │
└──────────┘
```

---

## Attendance Status Colors

| Status | Color | Description |
|--------|-------|-------------|
| Present | Green | Normal attendance |
| Absent | Red | No attendance record |
| Late | Yellow | Arrived after start time |
| Half Day | Orange | Partial day worked |
| Leave | Blue | On approved leave |
| Holiday | Purple | Public holiday |

---

## Progress Tracking

| Metric | Count |
|--------|-------|
| Total Tasks | 96 |
| Tasks Completed | 0 |
| Tasks In Progress | 0 |
| Tasks Not Started | 96 |

**Last Updated:** 2026-01-17  
**Current Status:** Ready for task document creation

---

## Notes for AI Agents

1. **Execution Order:** Tasks must be executed in numerical order within each group
2. **Sri Lankan Compliance:** EPF (8%/12%), ETF (3%), PAYE tax
3. **LKR Currency:** All salaries in Sri Lankan Rupees
4. **NIC Format:** Sri Lankan National Identity Card format
5. **Leave Types:** Annual, Casual, Sick, Maternity, Paternity
6. **Payroll Period:** Monthly (1st to last day)
7. **Dependencies:** This sub-phase depends on SubPhase-07 and Phase-06 HR APIs
8. **No Code Snippets in Tasks:** Individual task documents should focus on descriptions, not implementation code
9. **Org Chart:** Hierarchical view based on reporting structure
10. **Attendance:** Support biometric/manual entry
11. **Forms:** Use React Hook Form with Zod for all forms
12. **PDF Generation:** Payslip PDF with company branding
