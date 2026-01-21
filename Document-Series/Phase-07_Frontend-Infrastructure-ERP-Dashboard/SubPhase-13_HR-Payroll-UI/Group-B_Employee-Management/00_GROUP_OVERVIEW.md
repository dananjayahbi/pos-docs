# Group B: Employee Management

> **Phase:** 07 - Frontend Infrastructure & ERP Dashboard  
> **SubPhase:** 13 - HR & Payroll UI  
> **Group:** B of F  
> **Tasks Covered:** 17-34  
> **Group Goal:** Build employee directory with listing, profile views, and org chart visualization

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group-A_HR-Routes-Pages-Structure](../Group-A_HR-Routes-Pages-Structure/)
- **→ Next Group:** [Group-C_Attendance-Management](../Group-C_Attendance-Management/)

---

## Group Overview

This group creates the complete employee management interface. Creates main employees list page with header and add employee action. Builds summary cards for total employees, active employees, and department count. Creates filter bar with search, department filter, and status filter. Creates employee cards grid view with card component and avatar. Creates alternative table view and view toggle. Creates employee details page with profile header. Adds employee tabs for Personal and Employment info. Creates org chart page with hierarchical view and org chart node component.

### Key Outcomes

- Employees list page component
- Employees header with action
- Employee summary cards
- Employee filters toolbar
- Department filter dropdown
- Status filter dropdown
- Employee cards grid
- Employee card component
- Employee avatar component
- Employees table view
- View toggle (cards/table)
- Employee details page
- Employee profile header
- Employee tabs navigation
- Personal info tab
- Employment info tab
- Org chart page
- Org chart node component

### Technology Context

- **Layout:** Cards grid or table view
- **Org Chart:** Hierarchical tree visualization
- **Avatar:** Photo or initials
- **Tabs:** Radix UI tabs

---

## Documents in This Group

| # | Document | Description | Tasks Covered |
|---|----------|-------------|---------------|
| 01 | `01_Tasks-17-27_List-Cards-Table.md` | Create employee list, cards, and table | 17-27 |
| 02 | `02_Tasks-28-34_Profile-OrgChart.md` | Create employee profile and org chart | 28-34 |

---

## Task Summary

| Task # | Task Name | Complexity | Dependencies |
|--------|-----------|------------|--------------|
| 17 | Create Employees List Page | Low | Task 16 |
| 18 | Create Employees Header | Low | Task 17 |
| 19 | Create Employee Summary Cards | Medium | Task 17 |
| 20 | Create Employee Filters | Low | Task 17 |
| 21 | Create Department Filter | Low | Task 20 |
| 22 | Create Status Filter | Low | Task 20 |
| 23 | Create Employee Cards Grid | Medium | Task 17 |
| 24 | Create Employee Card Component | Medium | Task 23 |
| 25 | Create Employee Avatar | Low | Task 24 |
| 26 | Create Employees Table View | Medium | Task 17 |
| 27 | Create View Toggle | Low | Task 26 |
| 28 | Create Employee Details Page | Medium | Task 16 |
| 29 | Create Employee Profile Header | Medium | Task 28 |
| 30 | Create Employee Tabs | Low | Task 28 |
| 31 | Create Personal Info Tab | Medium | Task 30 |
| 32 | Create Employment Info Tab | Medium | Task 30 |
| 33 | Create Org Chart Page | Medium | Task 16 |
| 34 | Create Org Chart Node | Medium | Task 33 |

---

## Execution Order

```
Task 17: Employees List Page
    │
    ├──────────────────────────────────────────────────┐
    ▼                                                  │
Task 18: Employees Header                              │
    │                                                  │
    ▼                                                  │
Task 19: Summary Cards                                 │
    │                                                  │
    ▼                                                  │
Task 20: Employee Filters                              │
    │                                                  │
    ├──────────┬──────────┐                            │
    ▼          ▼          │                            │
Task 21    Task 22       │                            │
(Dept)     (Status)       │                            │
    │          │          │                            │
    └──────────┘          │                            │
               │          │                            │
               ▼          │                            │
         Task 23: Cards Grid                           │
               │          │                            │
               ▼          │                            │
         Task 24: Employee Card                        │
               │          │                            │
               ▼          │                            │
         Task 25: Avatar                               │
               │          │                            │
               ▼          │                            │
         Task 26: Table View                           │
               │          │                            │
               ▼          │                            │
         Task 27: View Toggle                          │
               │          │                            │
               └──────────┘                            │
                          │                            │
                          ▼                            │
                    Task 28: Details Page              │
                          │                            │
                          ▼                            │
                    Task 29: Profile Header            │
                          │                            │
                          ▼                            │
                    Task 30: Employee Tabs             │
                          │                            │
                    ┌─────┴─────┐                      │
                    ▼           ▼                      │
              Task 31     Task 32                      │
             (Personal) (Employment)                   │
                    │           │                      │
                    └─────┬─────┘                      │
                          │                            │
                          ▼                            │
                    Task 33: Org Chart Page            │
                          │                            │
                          ▼
                    Task 34: Org Node
```

---

## Expected Deliverables

```
frontend/
└── components/
    └── modules/
        └── hr/
            └── Employees/
                ├── EmployeesList.tsx
                ├── EmployeesHeader.tsx
                ├── EmployeeSummaryCards.tsx
                ├── EmployeeFilters.tsx
                ├── DepartmentFilter.tsx
                ├── StatusFilter.tsx
                ├── EmployeeCardsGrid.tsx
                ├── EmployeeCard.tsx
                ├── EmployeeAvatar.tsx
                ├── EmployeesTable.tsx
                ├── ViewToggle.tsx
                ├── EmployeeProfile/
                │   ├── EmployeeDetails.tsx
                │   ├── EmployeeProfileHeader.tsx
                │   ├── EmployeeTabs.tsx
                │   ├── PersonalInfoTab.tsx
                │   ├── EmploymentInfoTab.tsx
                │   └── index.ts
                ├── OrgChart/
                │   ├── OrgChartPage.tsx
                │   ├── OrgChartNode.tsx
                │   └── index.ts
                └── index.ts
```

---

## Notes for AI Agents

### Summary Cards (Task 19)
| Card | Icon | Value |
|------|------|-------|
| Total Employees | Users | Count of all employees |
| Active | UserCheck | Count with active status |
| Departments | Building2 | Count of departments |

### Department Filter (Task 21)
| Option | Value |
|--------|-------|
| All Departments | - |
| Sales | sales |
| Operations | operations |
| HR | hr |
| Finance | finance |
| IT | it |

### Status Filter (Task 22)
| Option | Value |
|--------|-------|
| All Status | - |
| Active | active |
| On Leave | on_leave |
| Inactive | inactive |

### Employee Card (Task 24)
| Element | Content |
|---------|---------|
| Avatar | Photo or initials |
| Name | Full name |
| Position | Job title |
| Department | Department name |
| Actions | View, Edit |

### Avatar (Task 25)
| Type | Display |
|------|---------|
| Photo | Employee photo |
| Initials | First/Last initials |
| Color | Based on name hash |

### Employee Tabs (Task 30)
| Tab | Content |
|-----|---------|
| Personal | Personal info |
| Employment | Job info |
| Documents | Uploaded docs |

### Personal Info Tab (Task 31)
| Field | Display |
|-------|---------|
| Full Name | Name |
| NIC | National ID |
| DOB | Date of Birth |
| Gender | Male/Female |
| Phone | +94 format |
| Email | Email address |
| Address | Full address |
| Emergency Contact | Name + Phone |

### Employment Info Tab (Task 32)
| Field | Display |
|-------|---------|
| Employee ID | EMP-XXXX |
| Position | Job title |
| Department | Department name |
| Join Date | Date joined |
| Contract Type | Full-time/Part-time |
| Basic Salary | ₨ X,XXX |
| Reports To | Manager name |

### Org Chart Node (Task 34)
| Element | Content |
|---------|---------|
| Avatar | Employee photo |
| Name | Full name |
| Position | Job title |
| Children | Direct reports |
