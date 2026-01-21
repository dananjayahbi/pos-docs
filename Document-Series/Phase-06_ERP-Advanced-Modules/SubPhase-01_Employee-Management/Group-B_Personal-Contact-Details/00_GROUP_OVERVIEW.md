# Group B: Personal & Contact Details

> **Phase:** 06 - ERP Advanced Modules  
> **SubPhase:** 01 - Employee Management  
> **Group:** B of F  
> **Tasks Covered:** 19-34  
> **Group Goal:** Add personal, address, and emergency contact information

---

## Navigation

- **↑ Parent:** [SubPhase-01 Summary](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group A: Employee Model & Core Fields](../Group-A_Employee-Model-Core-Fields/)
- **→ Next Group:** [Group C: Job & Employment Details](../Group-C_Job-Employment-Details/)

---

## Group Overview

### Key Outcomes

1. **Employee Email Field** - Work email with personal_email (optional)
2. **Employee Phone Fields** - phone, mobile, work_phone with +94 format
3. **Sri Lanka Phone Validator** - Custom validator for Sri Lanka format
4. **EmployeeAddress Model** - Separate model for address details
5. **Address Core Fields** - line1, line2, city, postal_code
6. **Address Province/District** - Sri Lanka provinces and districts
7. **Address Type Field** - PERMANENT, TEMPORARY, WORK
8. **EmployeeAddress Migrations** - Apply migrations
9. **EmergencyContact Model** - Emergency contact information
10. **Emergency Contact Fields** - name, relationship, phone, email
11. **Emergency Priority** - Priority for multiple contacts
12. **EmergencyContact Migrations** - Apply migrations
13. **EmployeeFamily Model** - Family member details (optional)
14. **Family Member Fields** - name, relationship, dob, occupation
15. **Dependent Flag** - is_dependent for benefit eligibility
16. **EmployeeFamily Migrations** - Apply migrations

### Technology Context

| Technology | Purpose |
|------------|---------|
| Django ORM | Address, Contact, Family models |
| Custom Validators | Phone format validation |
| ForeignKey | Link to Employee |
| Choices | Sri Lanka provinces |

---

## Documents in This Group

| # | Document | Tasks | Description |
|---|----------|-------|-------------|
| 01 | `01_Tasks-19-26_Email-Phone-Address.md` | 19-26 | Email, phone fields, validator, address model |
| 02 | `02_Tasks-27-34_Emergency-Family.md` | 27-34 | EmergencyContact, EmployeeFamily models |

---

## Task Summary

| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 19 | Add Employee Email Field | Low | 15 min |
| 20 | Add Employee Phone Fields | Medium | 20 min |
| 21 | Create Sri Lanka Phone Validator | Medium | 25 min |
| 22 | Create EmployeeAddress Model | Medium | 25 min |
| 23 | Add Address Core Fields | Medium | 20 min |
| 24 | Add Address Province/District | Medium | 20 min |
| 25 | Add Address Type Field | Low | 15 min |
| 26 | Run EmployeeAddress Migrations | Low | 15 min |
| 27 | Create EmergencyContact Model | Medium | 25 min |
| 28 | Add Emergency Contact Fields | Medium | 20 min |
| 29 | Add Emergency Priority | Low | 15 min |
| 30 | Run EmergencyContact Migrations | Low | 15 min |
| 31 | Create EmployeeFamily Model | Medium | 25 min |
| 32 | Add Family Member Fields | Medium | 20 min |
| 33 | Add Dependent Flag | Low | 15 min |
| 34 | Run EmployeeFamily Migrations | Low | 15 min |

---

## Execution Order

```
[Tasks 19-26: Email, phone, address]
         │
         ▼
[Tasks 27-34: Emergency contact, family]
```

---

## Expected Deliverables

```
apps/employees/
├── models/
│   ├── __init__.py
│   ├── employee.py               # Tasks 19-20
│   ├── employee_address.py       # Tasks 22-25
│   ├── emergency_contact.py      # Tasks 27-29
│   └── employee_family.py        # Tasks 31-33
├── validators/
│   ├── __init__.py
│   ├── nic_validator.py
│   └── phone_validator.py        # Task 21
└── migrations/
    ├── 0002_address.py           # Task 26
    ├── 0003_emergency.py         # Task 30
    └── 0004_family.py            # Task 34
```

---

## Notes for AI Agents

### Sri Lanka Phone Format
```
Format: +94 XX XXX XXXX
Mobile Prefixes: 70, 71, 72, 74, 75, 76, 77, 78
Landline: 011, 021, 031, 041, etc.

Examples:
- +94 71 234 5678 (Mobile)
- +94 11 234 5678 (Colombo landline)
```

### EmployeeAddress Fields
- employee: FK to Employee
- address_type: Choice (PERMANENT, TEMPORARY, WORK)
- line1: CharField (required)
- line2: CharField (optional)
- city: CharField
- postal_code: CharField
- province: Choice field
- district: CharField
- is_primary: Boolean

### Sri Lanka Provinces
| Code | Province |
|------|----------|
| WP | Western Province |
| CP | Central Province |
| SP | Southern Province |
| NW | North Western Province |
| NC | North Central Province |
| UV | Uva Province |
| SB | Sabaragamuwa Province |
| EP | Eastern Province |
| NP | Northern Province |

### EmergencyContact Fields
- employee: FK to Employee
- name: CharField
- relationship: Choice (PARENT, SPOUSE, SIBLING, CHILD, FRIEND, OTHER)
- phone: CharField (validated)
- email: EmailField (optional)
- priority: Integer (1 = primary)
- notes: TextField

### EmployeeFamily Fields
- employee: FK to Employee
- name: CharField
- relationship: Choice (SPOUSE, CHILD, PARENT, SIBLING)
- date_of_birth: DateField
- occupation: CharField
- is_dependent: Boolean
- notes: TextField

### Dependent Definition
```
is_dependent = True if:
- Children under 18
- Non-working spouse
- Elderly parents
- Disabled family members

Used for:
- Insurance coverage
- Tax deductions
- Allowance calculations
```

### Address Type Usage
| Type | Purpose |
|------|---------|
| PERMANENT | Legal address, NIC address |
| TEMPORARY | Current residence |
| WORK | Office/branch location |
