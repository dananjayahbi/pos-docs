# Group F: Reports & Testing

> **Phase:** 07 - Frontend Infrastructure & ERP Dashboard  
> **SubPhase:** 13 - HR & Payroll UI  
> **Group:** F of F  
> **Tasks Covered:** 85-96  
> **Group Goal:** Build employee form, department/position management, and final testing

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group-E_Payroll-Processing](../Group-E_Payroll-Processing/)
- **→ Next Group:** None (Last Group) | **Next SubPhase:** [SubPhase-14_Settings-Configuration-UI](../../SubPhase-14_Settings-Configuration-UI/)

---

## Group Overview

This group creates the employee form and management components. Creates employee form page for new/edit employees. Creates Zod schema for employee. Builds form sections: personal info (name, NIC, DOB, gender), contact info (phone, email, address), employment info (position, department, salary), and document upload (NIC copy, contracts). Creates department management CRUD with department modal. Creates position management CRUD with position modal. Creates HR module documentation. Performs final verification testing.

### Key Outcomes

- Employee form page
- Employee form schema
- Personal info section
- Contact info section
- Employment info section
- Document upload section
- Department management
- Department modal
- Position management
- Position modal
- HR module documentation
- Final verification complete

### Technology Context

- **Form:** React Hook Form + Zod
- **Sections:** Multi-section form
- **Upload:** File upload for documents
- **CRUD:** Department/Position management

---

## Documents in This Group

| # | Document | Description | Tasks Covered |
|---|----------|-------------|---------------|
| 01 | `01_Tasks-85-90_Employee-Form.md` | Create employee form and sections | 85-90 |
| 02 | `02_Tasks-91-96_Management-Testing.md` | Create department/position management and testing | 91-96 |

---

## Task Summary

| Task # | Task Name | Complexity | Dependencies |
|--------|-----------|------------|--------------|
| 85 | Create Employee Form Page | Medium | Task 16 |
| 86 | Create Employee Form Schema | Medium | Task 85 |
| 87 | Create Personal Info Section | Medium | Task 86 |
| 88 | Create Contact Info Section | Low | Task 86 |
| 89 | Create Employment Info Section | Medium | Task 86 |
| 90 | Create Document Upload Section | Medium | Task 86 |
| 91 | Create Department Management | Medium | Task 17 |
| 92 | Create Department Modal | Low | Task 91 |
| 93 | Create Position Management | Medium | Task 17 |
| 94 | Create Position Modal | Low | Task 93 |
| 95 | Create HR Module Documentation | Low | Task 94 |
| 96 | Final Verification & Testing | Low | Task 95 |

---

## Execution Order

```
Task 85: Employee Form Page
    │
    ▼
Task 86: Form Schema
    │
    ├──────────┬──────────┬──────────┬──────────┐
    ▼          ▼          ▼          ▼          │
Task 87    Task 88    Task 89    Task 90       │
(Personal) (Contact) (Employment)(Documents)   │
    │          │          │          │          │
    └──────────┴──────────┴──────────┘          │
               │                                │
               ▼                                │
         Task 91: Department Management         │
               │                                │
               ▼                                │
         Task 92: Department Modal              │
               │                                │
               ▼                                │
         Task 93: Position Management           │
               │                                │
               ▼                                │
         Task 94: Position Modal                │
               │                                │
               ▼
         Task 95: Documentation
               │
               ▼
         Task 96: Testing
```

---

## Expected Deliverables

```
frontend/
├── app/
│   └── (dashboard)/
│       └── employees/
│           └── new/
│               └── page.tsx
├── components/
│   └── modules/
│       └── hr/
│           ├── Employees/
│           │   ├── EmployeeForm/
│           │   │   ├── EmployeeForm.tsx
│           │   │   ├── PersonalInfoSection.tsx
│           │   │   ├── ContactInfoSection.tsx
│           │   │   ├── EmploymentInfoSection.tsx
│           │   │   ├── DocumentUploadSection.tsx
│           │   │   └── index.ts
│           │   └── index.ts
│           ├── Settings/
│           │   ├── DepartmentManagement.tsx
│           │   ├── DepartmentModal.tsx
│           │   ├── PositionManagement.tsx
│           │   ├── PositionModal.tsx
│           │   └── index.ts
│           └── index.ts
├── lib/
│   └── validations/
│       └── employee.ts
└── docs/
    └── HR_MODULE.md
```

---

## Notes for AI Agents

### Employee Form Schema (Task 86)
| Field | Type | Validation |
|-------|------|------------|
| first_name | string | Required, 2-100 chars |
| last_name | string | Required, 2-100 chars |
| nic | string | Sri Lankan NIC format |
| dob | date | Required, valid age |
| gender | enum | male/female |
| phone | string | Sri Lankan format |
| email | string | Valid email |
| address | object | Optional |
| department_id | uuid | Required |
| position_id | uuid | Required |
| basic_salary | number | Required, > 0 |
| join_date | date | Required |

### Personal Info Section (Task 87)
| Field | Type |
|-------|------|
| First Name | Text |
| Last Name | Text |
| NIC | Text (Sri Lankan format) |
| Date of Birth | Date picker |
| Gender | Radio (Male/Female) |

### Contact Info Section (Task 88)
| Field | Type |
|-------|------|
| Phone | Phone input (+94) |
| Email | Email input |
| Address Line 1 | Text |
| Address Line 2 | Text |
| City | Text |
| District | Select |
| Emergency Contact | Text |
| Emergency Phone | Phone input |

### Employment Info Section (Task 89)
| Field | Type |
|-------|------|
| Employee ID | Auto-generated |
| Department | Select |
| Position | Select |
| Reports To | Select (manager) |
| Join Date | Date picker |
| Contract Type | Select |
| Basic Salary | Number (LKR) |

### Document Upload Section (Task 90)
| Document | Type | Required |
|----------|------|----------|
| NIC Copy | Image/PDF | Yes |
| Photo | Image | Yes |
| CV | PDF | No |
| Contract | PDF | No |
| Certificates | PDF | No |

### Department Management (Task 91)
| Column | Content |
|--------|---------|
| Name | Department name |
| Head | Department head |
| Employees | Count |
| Actions | Edit, Delete |

### Department Modal (Task 92)
| Field | Type |
|-------|------|
| Name | Text |
| Description | Textarea |
| Head | Employee select |
| Parent | Department select |

### Position Management (Task 93)
| Column | Content |
|--------|---------|
| Title | Position title |
| Department | Department |
| Level | Level/Grade |
| Employees | Count |
| Actions | Edit, Delete |

### Position Modal (Task 94)
| Field | Type |
|-------|------|
| Title | Text |
| Description | Textarea |
| Department | Select |
| Level | Number |
| Min Salary | Number (LKR) |
| Max Salary | Number (LKR) |

### Documentation (Task 95)
| Section | Content |
|---------|---------|
| Components | All HR components |
| Hooks | Custom hooks |
| API | Endpoints used |
| Forms | Validation schemas |
| Payroll | Sri Lankan compliance |

### Final Testing (Task 96)
| Test Case | Scenario |
|-----------|----------|
| Employees | List, profile, create |
| Attendance | Dashboard, clock in/out |
| Leave | Request, approve |
| Payroll | Run, payslip |
| Settings | Departments, positions |
