# SubPhase 01: Employee Management - Tasks Summary

> **Phase:** 06 - ERP Advanced Modules  
> **SubPhase Index:** 01 of 14  
> **SubPhase Goal:** Build comprehensive employee database with personal, job, and payroll details  
> **Total Tasks:** 92 | **Status:** Planning  
> **Estimated Duration:** 14-16 hours

---

## Navigation

- **↑ Parent:** [00_SUBPHASES_SUMMARY.md](../00_SUBPHASES_SUMMARY.md)
- **← Previous Phase:** [Phase-05_ERP-Core-Modules-Part2](../../Phase-05_ERP-Core-Modules-Part2/)
- **→ Next SubPhase:** [SubPhase-02_Department-Designations](../SubPhase-02_Department-Designations/)

---

## SubPhase Overview

This sub-phase implements a complete employee management system for HR operations. Manages employee profiles, personal information, job details, documents, employment history, and bank details for payroll integration.

### Key Outcomes
- Employee model with comprehensive fields
- Employee ID auto-generation (EMP-0001 format)
- User account linking (optional)
- NIC (National Identity Card) validation for Sri Lanka
- Document storage for contracts and certificates
- Employment history tracking
- Bank details for payroll
- Emergency contact information
- Employee directory with search
- Import/Export functionality

### Technology Context
- **Backend:** Django 5.x with DRF for API
- **Document Storage:** Django file fields with S3/local storage
- **NIC Validation:** Sri Lanka NIC format validation
- **Frontend:** Next.js 14+ with TypeScript
- **Employee ID Format:** `EMP-{SEQUENCE}` (e.g., EMP-0001)

### Dependencies
- Phase-03: User model for optional linking

---

## Task Execution Order

```
TASK GROUP A: Employee Model & Core Fields (Tasks 01-18)
        │
        ▼
TASK GROUP B: Personal & Contact Details (Tasks 19-34)
        │
        ▼
TASK GROUP C: Job & Employment Details (Tasks 35-50)
        │
        ▼
TASK GROUP D: Documents & Bank Details (Tasks 51-66)
        │
        ▼
TASK GROUP E: Employee Services & History (Tasks 67-80)
        │
        ▼
TASK GROUP F: API, Testing & Documentation (Tasks 81-92)
```

---

## Task Index

### Group A: Employee Model & Core Fields (Tasks 01-18)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 01 | **Create employees Django App** | Create new Django app for employee management | None | 🔴 Not Created |
| 02 | **Register employees App** | Add employees app to TENANT_APPS in Django settings | Task 01 | 🔴 Not Created |
| 03 | **Define EmploymentType Choices** | Create enum: FULL_TIME, PART_TIME, CONTRACT, INTERN, PROBATION | Task 01 | 🔴 Not Created |
| 04 | **Define EmployeeStatus Choices** | Create enum: ACTIVE, INACTIVE, ON_LEAVE, TERMINATED, RESIGNED | Task 01 | 🔴 Not Created |
| 05 | **Define Gender Choices** | Create enum: MALE, FEMALE, OTHER, PREFER_NOT_TO_SAY | Task 01 | 🔴 Not Created |
| 06 | **Define MaritalStatus Choices** | Create enum: SINGLE, MARRIED, DIVORCED, WIDOWED | Task 01 | 🔴 Not Created |
| 07 | **Create Employee Model Core** | Define Employee with employee_id, status, created_at, updated_at | Task 06 | 🔴 Not Created |
| 08 | **Add Employee Name Fields** | Add first_name, last_name, middle_name, full_name (computed) | Task 07 | 🔴 Not Created |
| 09 | **Add Employee User Link** | Add user FK (optional OneToOne link to User model) | Task 07 | 🔴 Not Created |
| 10 | **Add Employee Profile Photo** | Add profile_photo ImageField with thumbnail | Task 07 | 🔴 Not Created |
| 11 | **Add Employee NIC Field** | Add nic_number with Sri Lanka NIC validation | Task 07 | 🔴 Not Created |
| 12 | **Create NIC Validator** | Custom validator for old (9V) and new (12-digit) NIC formats | Task 11 | 🔴 Not Created |
| 13 | **Add Employee DOB Field** | Add date_of_birth with age calculation | Task 07 | 🔴 Not Created |
| 14 | **Add Employee Gender Field** | Add gender field using Gender choices | Task 07 | 🔴 Not Created |
| 15 | **Add Employee Marital Status** | Add marital_status field | Task 07 | 🔴 Not Created |
| 16 | **Create Employee ID Generator** | Auto-generate employee IDs: EMP-{SEQUENCE} | Task 07 | 🔴 Not Created |
| 17 | **Create Employee Model Indexes** | Add indexes for employee_id, status, nic_number | Task 07 | 🔴 Not Created |
| 18 | **Run Initial Employee Migrations** | Generate and apply migrations for Employee | Task 17 | 🔴 Not Created |

---

### Group B: Personal & Contact Details (Tasks 19-34)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 19 | **Add Employee Email Field** | Add email with validation, personal_email (optional) | Task 18 | 🔴 Not Created |
| 20 | **Add Employee Phone Fields** | Add phone, mobile, work_phone with +94 format | Task 18 | 🔴 Not Created |
| 21 | **Create Sri Lanka Phone Validator** | Custom validator for Sri Lanka phone format | Task 20 | 🔴 Not Created |
| 22 | **Create EmployeeAddress Model** | Separate model for address details | Task 18 | 🔴 Not Created |
| 23 | **Add Address Core Fields** | Add line1, line2, city, postal_code | Task 22 | 🔴 Not Created |
| 24 | **Add Address Province/District** | Add province, district (Sri Lanka divisions) | Task 22 | 🔴 Not Created |
| 25 | **Add Address Type Field** | Add address_type: PERMANENT, TEMPORARY, WORK | Task 22 | 🔴 Not Created |
| 26 | **Run EmployeeAddress Migrations** | Generate and apply migrations | Task 25 | 🔴 Not Created |
| 27 | **Create EmergencyContact Model** | Model for emergency contact information | Task 26 | 🔴 Not Created |
| 28 | **Add Emergency Contact Fields** | Add name, relationship, phone, email | Task 27 | 🔴 Not Created |
| 29 | **Add Emergency Priority** | Add priority field for multiple contacts | Task 27 | 🔴 Not Created |
| 30 | **Run EmergencyContact Migrations** | Generate and apply migrations | Task 29 | 🔴 Not Created |
| 31 | **Create EmployeeFamily Model** | Model for family member details (optional) | Task 30 | 🔴 Not Created |
| 32 | **Add Family Member Fields** | Add name, relationship, dob, occupation | Task 31 | 🔴 Not Created |
| 33 | **Add Dependent Flag** | Add is_dependent boolean for benefit eligibility | Task 31 | 🔴 Not Created |
| 34 | **Run EmployeeFamily Migrations** | Generate and apply migrations | Task 33 | 🔴 Not Created |

---

### Group C: Job & Employment Details (Tasks 35-50)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 35 | **Add Department FK** | Add department ForeignKey (to be linked in SubPhase-02) | Task 34 | 🔴 Not Created |
| 36 | **Add Designation FK** | Add designation ForeignKey (to be linked in SubPhase-02) | Task 34 | 🔴 Not Created |
| 37 | **Add Manager FK** | Add manager self-referential FK to Employee | Task 34 | 🔴 Not Created |
| 38 | **Add Employment Type Field** | Add employment_type using EmploymentType choices | Task 34 | 🔴 Not Created |
| 39 | **Add Hire Date Field** | Add hire_date, probation_end_date | Task 34 | 🔴 Not Created |
| 40 | **Add Confirmation Date** | Add confirmation_date for post-probation | Task 39 | 🔴 Not Created |
| 41 | **Add Work Location Fields** | Add work_location, work_from_home_eligible | Task 34 | 🔴 Not Created |
| 42 | **Add Termination Fields** | Add termination_date, termination_reason, exit_interview_notes | Task 34 | 🔴 Not Created |
| 43 | **Add Resignation Fields** | Add resignation_date, resignation_reason, notice_period | Task 34 | 🔴 Not Created |
| 44 | **Run Job Fields Migrations** | Generate migrations for job-related fields | Task 43 | 🔴 Not Created |
| 45 | **Create EmploymentHistory Model** | Track job changes within company | Task 44 | 🔴 Not Created |
| 46 | **Add History Core Fields** | Add effective_date, department, designation, manager | Task 45 | 🔴 Not Created |
| 47 | **Add History Change Reason** | Add change_type (PROMOTION, TRANSFER, DEMOTION), notes | Task 45 | 🔴 Not Created |
| 48 | **Add History Salary Change** | Add previous_salary, new_salary (optional) | Task 45 | 🔴 Not Created |
| 49 | **Run EmploymentHistory Migrations** | Generate and apply migrations | Task 48 | 🔴 Not Created |
| 50 | **Create Employment History Signal** | Auto-create history on department/designation change | Task 49 | 🔴 Not Created |

---

### Group D: Documents & Bank Details (Tasks 51-66)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 51 | **Define DocumentType Choices** | Create enum: CONTRACT, RESUME, NIC_COPY, CERTIFICATE, OTHER | Task 50 | 🔴 Not Created |
| 52 | **Create EmployeeDocument Model** | Model for employee document storage | Task 51 | 🔴 Not Created |
| 53 | **Add Document File Field** | Add file FileField with upload path | Task 52 | 🔴 Not Created |
| 54 | **Add Document Metadata Fields** | Add title, document_type, description, uploaded_by | Task 52 | 🔴 Not Created |
| 55 | **Add Document Expiry Fields** | Add issue_date, expiry_date for certificates | Task 52 | 🔴 Not Created |
| 56 | **Add Document Visibility** | Add is_sensitive, visible_to_employee flags | Task 52 | 🔴 Not Created |
| 57 | **Run EmployeeDocument Migrations** | Generate and apply migrations | Task 56 | 🔴 Not Created |
| 58 | **Create EmployeeBankAccount Model** | Model for payroll bank details | Task 57 | 🔴 Not Created |
| 59 | **Add Bank Core Fields** | Add bank_name, branch_name, account_number | Task 58 | 🔴 Not Created |
| 60 | **Add Bank SWIFT/Branch Code** | Add swift_code, branch_code for transfers | Task 58 | 🔴 Not Created |
| 61 | **Add Account Type Field** | Add account_type: SAVINGS, CURRENT | Task 58 | 🔴 Not Created |
| 62 | **Add Primary Account Flag** | Add is_primary for multiple accounts | Task 58 | 🔴 Not Created |
| 63 | **Add Bank Account Verification** | Add verified, verified_by, verified_at fields | Task 58 | 🔴 Not Created |
| 64 | **Run EmployeeBankAccount Migrations** | Generate and apply migrations | Task 63 | 🔴 Not Created |
| 65 | **Create Sri Lanka Banks List** | Reference data for Sri Lanka banks | Task 64 | 🔴 Not Created |
| 66 | **Create Bank Account Encryption** | Encrypt sensitive bank details at rest | Task 64 | 🔴 Not Created |

---

### Group E: Employee Services & History (Tasks 67-80)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 67 | **Create EmployeeService Class** | Main service for employee business operations | Task 66 | 🔴 Not Created |
| 68 | **Implement Create Employee** | Create new employee with validation | Task 67 | 🔴 Not Created |
| 69 | **Implement Update Employee** | Update employee details with history | Task 67 | 🔴 Not Created |
| 70 | **Implement Employee Status Change** | Activate, deactivate, terminate, resign | Task 67 | 🔴 Not Created |
| 71 | **Implement Link User Account** | Create/link user account for employee | Task 67 | 🔴 Not Created |
| 72 | **Create EmployeeSearchService** | Service for employee directory search | Task 67 | 🔴 Not Created |
| 73 | **Implement Full-Text Search** | Search by name, email, employee_id | Task 72 | 🔴 Not Created |
| 74 | **Implement Filter by Department** | Filter employees by department | Task 72 | 🔴 Not Created |
| 75 | **Implement Filter by Status** | Filter by employment status | Task 72 | 🔴 Not Created |
| 76 | **Create EmployeeImportService** | Import employees from CSV/Excel | Task 67 | 🔴 Not Created |
| 77 | **Create Import Validation** | Validate import data before creating | Task 76 | 🔴 Not Created |
| 78 | **Create EmployeeExportService** | Export employees to CSV/Excel | Task 67 | 🔴 Not Created |
| 79 | **Implement Export Filtering** | Export with filters (dept, status) | Task 78 | 🔴 Not Created |
| 80 | **Create Employee Reporting** | Generate employee summary reports | Task 78 | 🔴 Not Created |

---

### Group F: API, Testing & Documentation (Tasks 81-92)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 81 | **Create EmployeeSerializer** | DRF serializer for Employee with nested relations | Task 80 | 🔴 Not Created |
| 82 | **Create AddressSerializer** | DRF serializer for EmployeeAddress | Task 81 | 🔴 Not Created |
| 83 | **Create EmergencyContactSerializer** | DRF serializer for EmergencyContact | Task 81 | 🔴 Not Created |
| 84 | **Create DocumentSerializer** | DRF serializer for EmployeeDocument | Task 81 | 🔴 Not Created |
| 85 | **Create BankAccountSerializer** | DRF serializer for bank details (masked) | Task 81 | 🔴 Not Created |
| 86 | **Create EmployeeViewSet** | ViewSet with CRUD, status actions | Task 85 | 🔴 Not Created |
| 87 | **Implement Employee Filtering** | Filter by status, department, employment type | Task 86 | 🔴 Not Created |
| 88 | **Add Employee Custom Actions** | Actions: activate, deactivate, terminate | Task 86 | 🔴 Not Created |
| 89 | **Create DocumentViewSet** | ViewSet for document upload/download | Task 86 | 🔴 Not Created |
| 90 | **Register Employee API URLs** | Add all employee endpoints to URL config | Task 89 | 🔴 Not Created |
| 91 | **Create Employee Module Tests** | Unit and integration tests for all modules | Task 90 | 🔴 Not Created |
| 92 | **Create Employee Module Documentation** | API docs, employee management guide | Task 91 | 🔴 Not Created |

---

## Expected File Structure

```
backend/apps/employees/
├── __init__.py
├── admin.py                    # Admin for Employee, Documents
├── apps.py                     # App configuration
├── models/
│   ├── __init__.py
│   ├── employee.py            # Employee model
│   ├── employee_address.py    # EmployeeAddress model
│   ├── emergency_contact.py   # EmergencyContact model
│   ├── employee_family.py     # EmployeeFamily model
│   ├── employee_document.py   # EmployeeDocument model
│   ├── employee_bank.py       # EmployeeBankAccount model
│   └── employment_history.py  # EmploymentHistory model
├── services/
│   ├── __init__.py
│   ├── employee_service.py    # Main employee operations
│   ├── search_service.py      # Employee search
│   ├── import_service.py      # CSV/Excel import
│   └── export_service.py      # CSV/Excel export
├── serializers/
│   ├── __init__.py
│   ├── employee_serializer.py
│   ├── address_serializer.py
│   ├── document_serializer.py
│   └── bank_serializer.py
├── views/
│   ├── __init__.py
│   ├── employee_viewset.py    # Employee CRUD ViewSet
│   └── document_viewset.py    # Document ViewSet
├── validators/
│   ├── __init__.py
│   ├── nic_validator.py       # Sri Lanka NIC validator
│   └── phone_validator.py     # Sri Lanka phone validator
├── filters.py                  # Employee filtering
├── urls.py                     # URL routing
├── signals.py                  # Employment history signals
├── permissions.py              # Employee-specific permissions
├── tests/
│   ├── __init__.py
│   ├── test_models.py
│   ├── test_validators.py
│   ├── test_services.py
│   └── test_api.py
└── migrations/
```

---

## Employee Status Flow Diagram

```
                    ┌───────────────┐
                    │    ACTIVE     │ ← Normal working state
                    └───────┬───────┘
                            │
          ┌─────────────────┼─────────────────┐
          │                 │                 │
          ▼                 ▼                 ▼
  ┌───────────────┐ ┌───────────────┐ ┌───────────────┐
  │   ON_LEAVE    │ │   INACTIVE    │ │  TERMINATED   │
  │ (Long leave)  │ │   (Suspend)   │ │   (Fired)     │
  └───────┬───────┘ └───────┬───────┘ └───────────────┘
          │                 │
          └────────┬────────┘
                   │
                   ▼
           ┌───────────────┐
           │    ACTIVE     │ ← Can be reactivated
           └───────────────┘

  RESIGNATION:
  ┌───────────────┐
  │   RESIGNED    │ ← Voluntary departure
  └───────────────┘
```

---

## Sri Lanka NIC Formats

```
OLD FORMAT (Before 2016):
─────────────────────────────────
Format: 9 digits + V or X
Example: 912345678V

Breakdown:
- First 2 digits: Year of birth (91 = 1991)
- Next 3 digits: Day of year (001-366)
- Last 4 digits: Sequence
- Suffix: V (general) or X

NEW FORMAT (After 2016):
─────────────────────────────────
Format: 12 digits
Example: 199112345678

Breakdown:
- First 4 digits: Year of birth (1991)
- Next 3 digits: Day of year (001-366)
- Last 5 digits: Sequence

Validation Rule:
- Day 001-366 for males
- Day 501-866 for females (500 added)
```

---

## Employee ID Format

```
EMP-{SEQUENCE}

Examples:
- EMP-0001   (First employee)
- EMP-0150   (150th employee)
- EMP-1000   (1000th employee)

Sequence is auto-incrementing.
Prefix configurable per tenant.
```

---

## Key Business Rules

1. **Unique NIC:** NIC number must be unique per tenant
2. **Employee ID:** Auto-generated, immutable after creation
3. **User Link Optional:** Not all employees need user accounts
4. **Manager Hierarchy:** Prevent circular manager references
5. **Bank Verification:** Bank details require verification before payroll
6. **Document Retention:** Keep terminated employee documents for legal compliance
7. **Status Transitions:** Only allowed transitions (can't directly terminate from ON_LEAVE)

---

## Sri Lanka Specific Considerations

- **NIC Validation:** Support both old and new NIC formats
- **Phone Format:** +94 XX XXX XXXX
- **Provinces:** 9 provinces of Sri Lanka
- **Banks:** Major Sri Lankan banks for payroll
- **EPF Number:** Store employee EPF member number
- **ETF:** Linked to EPF number

---

## Progress Tracking

| Metric | Count |
|--------|-------|
| Total Tasks | 92 |
| Tasks Completed | 0 |
| Tasks In Progress | 0 |
| Completion Percentage | 0% |

**Last Updated:** 2026-01-17  
**Next Action:** Create Task 01 (employees Django App)

---

## Notes for AI Agents

- Employee module is foundation for all HR operations
- NIC validation critical for Sri Lanka compliance
- Bank details encryption important for security
- Employment history auto-tracking via signals
- Consider GDPR/privacy for personal data
- Prepare for integration with attendance, leave, payroll
- Profile photo thumbnails for performance
- Bulk import for initial data migration

---

*End of SubPhase 01 Tasks Summary*
