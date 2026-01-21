# Group A: Employee Model & Core Fields

> **Phase:** 06 - ERP Advanced Modules  
> **SubPhase:** 01 - Employee Management  
> **Group:** A of F  
> **Tasks Covered:** 01-18  
> **Group Goal:** Create employees Django app with Employee model and core fields

---

## Navigation

- **↑ Parent:** [SubPhase-01 Summary](../00_TASKS_SUMMARY.md)
- **→ Next Group:** [Group B: Personal & Contact Details](../Group-B_Personal-Contact-Details/)

---

## Group Overview

### Key Outcomes

1. **Employees Django App** - New Django app for employee management
2. **App Registration** - Register employees in TENANT_APPS
3. **EmploymentType Choices** - FULL_TIME, PART_TIME, CONTRACT, INTERN, PROBATION
4. **EmployeeStatus Choices** - ACTIVE, INACTIVE, ON_LEAVE, TERMINATED, RESIGNED
5. **Gender Choices** - MALE, FEMALE, OTHER, PREFER_NOT_TO_SAY
6. **MaritalStatus Choices** - SINGLE, MARRIED, DIVORCED, WIDOWED
7. **Employee Model Core** - employee_id, status, created_at, updated_at
8. **Employee Name Fields** - first_name, last_name, middle_name, full_name (computed)
9. **Employee User Link** - Optional OneToOne link to User model
10. **Employee Profile Photo** - ImageField with thumbnail
11. **Employee NIC Field** - Sri Lanka NIC validation
12. **NIC Validator** - Support old (9V) and new (12-digit) formats
13. **Employee DOB Field** - date_of_birth with age calculation
14. **Employee Gender Field** - Gender choices
15. **Employee Marital Status** - marital_status field
16. **Employee ID Generator** - Auto-generate EMP-{SEQUENCE}
17. **Employee Model Indexes** - Indexes for employee_id, status, nic_number
18. **Initial Employee Migrations** - Generate and apply migrations

### Technology Context

| Technology | Purpose |
|------------|---------|
| Django ORM | Employee model definition |
| PostgreSQL | Indexes and constraints |
| ImageField | Profile photo storage |
| Custom Validators | NIC validation |

---

## Documents in This Group

| # | Document | Tasks | Description |
|---|----------|-------|-------------|
| 01 | `01_Tasks-01-06_App-Setup-Choices.md` | 01-06 | Django app, registration, all choice enums |
| 02 | `02_Tasks-07-12_Model-Core-Name-User-NIC.md` | 07-12 | Core fields, name, user link, photo, NIC, validator |
| 03 | `03_Tasks-13-18_DOB-Gender-ID-Index-Migration.md` | 13-18 | DOB, gender, marital status, ID generator, indexes, migrations |

---

## Task Summary

| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 01 | Create employees Django App | Low | 15 min |
| 02 | Register employees App | Low | 10 min |
| 03 | Define EmploymentType Choices | Low | 15 min |
| 04 | Define EmployeeStatus Choices | Low | 15 min |
| 05 | Define Gender Choices | Low | 10 min |
| 06 | Define MaritalStatus Choices | Low | 10 min |
| 07 | Create Employee Model Core | Medium | 25 min |
| 08 | Add Employee Name Fields | Medium | 20 min |
| 09 | Add Employee User Link | Medium | 20 min |
| 10 | Add Employee Profile Photo | Medium | 20 min |
| 11 | Add Employee NIC Field | Medium | 20 min |
| 12 | Create NIC Validator | High | 30 min |
| 13 | Add Employee DOB Field | Medium | 20 min |
| 14 | Add Employee Gender Field | Low | 15 min |
| 15 | Add Employee Marital Status | Low | 15 min |
| 16 | Create Employee ID Generator | Medium | 25 min |
| 17 | Create Employee Model Indexes | Medium | 20 min |
| 18 | Run Initial Employee Migrations | Low | 15 min |

---

## Execution Order

```
[Tasks 01-06: Django app setup, choice enums]
         │
         ▼
[Tasks 07-12: Core model, name, user link, NIC]
         │
         ▼
[Tasks 13-18: DOB, gender, ID generator, migrations]
```

---

## Expected Deliverables

```
apps/employees/
├── __init__.py
├── apps.py                       # Tasks 01-02
├── models/
│   ├── __init__.py
│   └── employee.py               # Tasks 07-17
├── constants.py                  # Tasks 03-06
├── validators/
│   └── nic_validator.py          # Task 12
├── services/
│   └── id_generator.py           # Task 16
└── migrations/
    └── 0001_initial.py           # Task 18
```

---

## Notes for AI Agents

### EmploymentType Choices
- **FULL_TIME**: Permanent full-time employee
- **PART_TIME**: Part-time employee
- **CONTRACT**: Fixed-term contract
- **INTERN**: Internship
- **PROBATION**: Probationary period

### EmployeeStatus Choices
- **ACTIVE**: Currently employed
- **INACTIVE**: Temporarily inactive
- **ON_LEAVE**: Long-term leave
- **TERMINATED**: Employment terminated
- **RESIGNED**: Voluntarily resigned

### Employee ID Format
```
EMP-{SEQUENCE}
Example: EMP-0001, EMP-0150

Sequence is auto-incrementing.
Prefix configurable per tenant.
```

### Sri Lanka NIC Formats
```
OLD FORMAT (Before 2016):
Format: 9 digits + V or X
Example: 912345678V

Breakdown:
- First 2 digits: Year of birth (91 = 1991)
- Next 3 digits: Day of year (001-366)
- Last 4 digits: Sequence
- Suffix: V (general) or X

NEW FORMAT (After 2016):
Format: 12 digits
Example: 199112345678

Breakdown:
- First 4 digits: Year of birth (1991)
- Next 3 digits: Day of year (001-366)
- Last 5 digits: Sequence

Gender Detection:
- Day 001-366: Male
- Day 501-866: Female (500 added)
```

### Employee Key Fields
- employee_id: CharField (unique, auto-generated)
- user: OneToOneField to User (nullable)
- first_name, last_name, middle_name: CharField
- full_name: Computed property
- profile_photo: ImageField
- nic_number: CharField (validated)
- date_of_birth: DateField
- age: Computed property
- gender: Choice field
- marital_status: Choice field
- status: EmployeeStatus

### User Link
```
Employee (1) ── (0..1) User

Not all employees need user accounts.
Link created when employee needs system access.
```

### Database Indexes
- employee_id (unique)
- nic_number (unique per tenant)
- status
- (status, department) composite
