# Group A: HR Routes & Pages Structure

> **Phase:** 07 - Frontend Infrastructure & ERP Dashboard  
> **SubPhase:** 13 - HR & Payroll UI  
> **Group:** A of F  
> **Tasks Covered:** 01-16  
> **Group Goal:** Set up HR module route structure with all pages, loading states, and error boundaries

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** None (First Group)
- **→ Next Group:** [Group-B_Employee-Management](../Group-B_Employee-Management/)

---

## Group Overview

This group creates the complete route structure for the HR module. Sets up four main directories: employees/, attendance/, leave/, and payroll/. Creates employee list, details ([id]), new employee, and org-chart routes. Creates attendance dashboard and reports routes. Creates leave dashboard and request routes. Creates payroll dashboard, run, and payslip details routes. Configures SEO metadata for all HR pages. Creates loading states and error boundaries. Verifies all routes are accessible.

### Key Outcomes

- HR route directories created (employees, attendance, leave, payroll)
- Employees list page route
- Employee details page route
- New employee page route
- Org chart page route
- Attendance page route
- Attendance report page route
- Leave dashboard page route
- Leave request page route
- Payroll dashboard page route
- Payroll run page route
- Payslip details page route
- Page metadata configured
- Loading states created
- Error boundaries created
- Route structure verified

### Technology Context

- **Routing:** Next.js App Router
- **Dynamic Routes:** [id] for details pages
- **Loading:** Suspense with loading.tsx
- **Error:** Error boundary components

---

## Documents in This Group

| # | Document | Description | Tasks Covered |
|---|----------|-------------|---------------|
| 01 | `01_Tasks-01-08_Employee-Leave-Routes.md` | Create employee and leave routes | 01-08 |
| 02 | `02_Tasks-09-16_Payroll-Routes-Verify.md` | Create payroll routes, loading, and verification | 09-16 |

---

## Task Summary

| Task # | Task Name | Complexity | Dependencies |
|--------|-----------|------------|--------------|
| 01 | Create HR Route Directories | Low | SubPhase-07 |
| 02 | Create Employees List Page Route | Low | Task 01 |
| 03 | Create Employee Details Page Route | Low | Task 01 |
| 04 | Create New Employee Page Route | Low | Task 01 |
| 05 | Create Org Chart Page Route | Low | Task 01 |
| 06 | Create Attendance Page Route | Low | Task 01 |
| 07 | Create Attendance Report Page Route | Low | Task 06 |
| 08 | Create Leave Page Route | Low | Task 01 |
| 09 | Create Leave Request Page Route | Low | Task 08 |
| 10 | Create Payroll Page Route | Low | Task 01 |
| 11 | Create Payroll Run Page Route | Low | Task 10 |
| 12 | Create Payslip Details Page Route | Low | Task 10 |
| 13 | Configure Page Metadata | Low | Task 01 |
| 14 | Create HR Loading States | Low | Task 01 |
| 15 | Create HR Error Boundaries | Low | Task 01 |
| 16 | Verify Route Structure | Low | Task 15 |

---

## Execution Order

```
Task 01: Create HR Route Directories
    │
    ├──────────────────────────────────────────────────┐
    ▼                                                  │
Task 02: Employees List Route                          │
    │                                                  │
    ├──────────┬──────────┬──────────┐                 │
    ▼          ▼          ▼          │                 │
Task 03    Task 04    Task 05       │                 │
(Details)  (New)      (Org Chart)   │                 │
    │          │          │          │                 │
    └──────────┴──────────┘          │                 │
               │                     │                 │
               ▼                     │                 │
         Task 06: Attendance Route   │                 │
               │                     │                 │
               ▼                     │                 │
         Task 07: Attendance Reports │                 │
               │                     │                 │
               ▼                     │                 │
         Task 08: Leave Route        │                 │
               │                     │                 │
               ▼                     │                 │
         Task 09: Leave Request      │                 │
               │                     │                 │
               ▼                     │                 │
         Task 10: Payroll Route      │                 │
               │                     │                 │
         ┌─────┴─────┐               │                 │
         ▼           ▼               │                 │
      Task 11    Task 12             │                 │
      (Run)      (Payslip)           │                 │
         │           │               │                 │
         └─────┬─────┘               │                 │
               │                     │                 │
               └─────────────────────┘                 │
                          │                            │
                    ┌─────┴─────┬─────┐                │
                    ▼           ▼     ▼                │
              Task 13     Task 14   Task 15            │
             (Metadata)  (Loading) (Error)             │
                    │           │     │                │
                    └─────┬─────┴─────┘                │
                          ▼
                    Task 16: Verify
```

---

## Expected Deliverables

```
frontend/
└── app/
    └── (dashboard)/
        ├── employees/
        │   ├── page.tsx
        │   ├── loading.tsx
        │   ├── error.tsx
        │   ├── new/
        │   │   └── page.tsx
        │   ├── org-chart/
        │   │   └── page.tsx
        │   └── [id]/
        │       └── page.tsx
        ├── attendance/
        │   ├── page.tsx
        │   ├── loading.tsx
        │   ├── error.tsx
        │   └── reports/
        │       └── page.tsx
        ├── leave/
        │   ├── page.tsx
        │   ├── loading.tsx
        │   ├── error.tsx
        │   └── request/
        │       └── page.tsx
        └── payroll/
            ├── page.tsx
            ├── loading.tsx
            ├── error.tsx
            ├── run/
            │   └── page.tsx
            └── [id]/
                └── page.tsx
```

---

## Notes for AI Agents

### Employee Routes (Tasks 02-05)
| Route | Page | Description |
|-------|------|-------------|
| /employees | List | Employee directory |
| /employees/new | Create | New employee form |
| /employees/[id] | Profile | Employee profile |
| /employees/org-chart | Org Chart | Organization hierarchy |

### Attendance Routes (Tasks 06-07)
| Route | Page | Description |
|-------|------|-------------|
| /attendance | Dashboard | Attendance overview |
| /attendance/reports | Reports | Attendance reports |

### Leave Routes (Tasks 08-09)
| Route | Page | Description |
|-------|------|-------------|
| /leave | Dashboard | Leave management |
| /leave/request | Request | New leave request |

### Payroll Routes (Tasks 10-12)
| Route | Page | Description |
|-------|------|-------------|
| /payroll | Dashboard | Payroll overview |
| /payroll/run | Run | Process payroll |
| /payroll/[id] | Payslip | Payslip details |

### Page Metadata (Task 13)
| Page | Title |
|------|-------|
| Employees | Employees - LCC |
| Attendance | Attendance - LCC |
| Leave | Leave Management - LCC |
| Payroll | Payroll - LCC |
