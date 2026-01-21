# Group D: Documents & Bank Details

> **Phase:** 06 - ERP Advanced Modules  
> **SubPhase:** 01 - Employee Management  
> **Group:** D of F  
> **Tasks Covered:** 51-66  
> **Group Goal:** Implement document storage and bank account details for payroll

---

## Navigation

- **↑ Parent:** [SubPhase-01 Summary](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group C: Job & Employment Details](../Group-C_Job-Employment-Details/)
- **→ Next Group:** [Group E: Employee Services & History](../Group-E_Employee-Services-History/)

---

## Group Overview

### Key Outcomes

1. **DocumentType Choices** - CONTRACT, RESUME, NIC_COPY, CERTIFICATE, OTHER
2. **EmployeeDocument Model** - Document storage for employees
3. **Document File Field** - FileField with upload path
4. **Document Metadata Fields** - title, document_type, description, uploaded_by
5. **Document Expiry Fields** - issue_date, expiry_date for certificates
6. **Document Visibility** - is_sensitive, visible_to_employee flags
7. **EmployeeDocument Migrations** - Apply migrations
8. **EmployeeBankAccount Model** - Bank details for payroll
9. **Bank Core Fields** - bank_name, branch_name, account_number
10. **Bank SWIFT/Branch Code** - swift_code, branch_code for transfers
11. **Account Type Field** - SAVINGS, CURRENT
12. **Primary Account Flag** - is_primary for multiple accounts
13. **Bank Account Verification** - verified, verified_by, verified_at
14. **EmployeeBankAccount Migrations** - Apply migrations
15. **Sri Lanka Banks List** - Reference data for banks
16. **Bank Account Encryption** - Encrypt sensitive details at rest

### Technology Context

| Technology | Purpose |
|------------|---------|
| Django ORM | Document, BankAccount models |
| FileField | Document storage |
| django-fernet-fields | Bank account encryption |
| S3/Local Storage | File storage backend |

---

## Documents in This Group

| # | Document | Tasks | Description |
|---|----------|-------|-------------|
| 01 | `01_Tasks-51-57_Document-Model.md` | 51-57 | EmployeeDocument model, fields, migrations |
| 02 | `02_Tasks-58-66_Bank-Account-Model.md` | 58-66 | EmployeeBankAccount, verification, encryption |

---

## Task Summary

| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 51 | Define DocumentType Choices | Low | 15 min |
| 52 | Create EmployeeDocument Model | Medium | 25 min |
| 53 | Add Document File Field | Medium | 20 min |
| 54 | Add Document Metadata Fields | Medium | 20 min |
| 55 | Add Document Expiry Fields | Low | 15 min |
| 56 | Add Document Visibility | Low | 15 min |
| 57 | Run EmployeeDocument Migrations | Low | 15 min |
| 58 | Create EmployeeBankAccount Model | Medium | 25 min |
| 59 | Add Bank Core Fields | Medium | 20 min |
| 60 | Add Bank SWIFT/Branch Code | Medium | 20 min |
| 61 | Add Account Type Field | Low | 15 min |
| 62 | Add Primary Account Flag | Low | 15 min |
| 63 | Add Bank Account Verification | Medium | 20 min |
| 64 | Run EmployeeBankAccount Migrations | Low | 15 min |
| 65 | Create Sri Lanka Banks List | Medium | 25 min |
| 66 | Create Bank Account Encryption | High | 30 min |

---

## Execution Order

```
[Tasks 51-57: EmployeeDocument model]
         │
         ▼
[Tasks 58-66: EmployeeBankAccount model, encryption]
```

---

## Expected Deliverables

```
apps/employees/
├── models/
│   ├── __init__.py
│   ├── employee_document.py      # Tasks 52-56
│   └── employee_bank.py          # Tasks 58-63, 66
├── constants.py                  # Tasks 51, 65
├── utils/
│   └── encryption.py             # Task 66
└── migrations/
    ├── 0007_document.py          # Task 57
    └── 0008_bank.py              # Task 64
```

---

## Notes for AI Agents

### DocumentType Choices
- **CONTRACT**: Employment contract
- **RESUME**: CV/Resume
- **NIC_COPY**: NIC scan copy
- **CERTIFICATE**: Educational/professional certificates
- **OTHER**: Other documents

### EmployeeDocument Fields
- employee: FK to Employee
- document_type: DocumentType choice
- title: CharField
- description: TextField
- file: FileField
- file_size: Integer (bytes)
- file_type: CharField (mime type)
- issue_date: DateField (nullable)
- expiry_date: DateField (nullable)
- is_sensitive: Boolean
- visible_to_employee: Boolean
- uploaded_by: FK to User
- uploaded_at: DateTimeField

### Document Upload Path
```
documents/employees/{employee_id}/{document_type}/{filename}

Example:
documents/employees/EMP-0001/contract/employment_contract_2026.pdf
```

### EmployeeBankAccount Fields
- employee: FK to Employee
- bank_name: CharField
- bank_code: CharField
- branch_name: CharField
- branch_code: CharField
- account_number: EncryptedCharField
- account_type: Choice (SAVINGS, CURRENT)
- swift_code: CharField (for international)
- is_primary: Boolean
- is_verified: Boolean
- verified_by: FK to User
- verified_at: DateTimeField
- verification_notes: TextField

### Sri Lanka Major Banks
| Code | Bank Name |
|------|-----------|
| BOC | Bank of Ceylon |
| PB | People's Bank |
| HNB | Hatton National Bank |
| COM | Commercial Bank of Ceylon |
| SAMPATH | Sampath Bank |
| SEYLAN | Seylan Bank |
| NDB | National Development Bank |
| NSB | National Savings Bank |
| DFCC | DFCC Bank |
| PAN | Pan Asia Banking Corporation |

### Bank Account Verification
```
Verification Required Before:
1. First payroll run
2. Account change
3. Large salary payment

Verification Steps:
1. Employee submits bank statement/passbook copy
2. HR verifies account number and name
3. verified_by and verified_at set
4. is_verified = True
```

### Account Encryption
```
Encrypted Fields:
- account_number

Encryption: Fernet symmetric encryption
Key: Stored in environment variable
Decryption: Only for payroll processing
```

### Document Retention Policy
```
Active Employee:
├── All documents retained

Terminated/Resigned Employee:
├── Keep for legal compliance period
├── Contract: 7 years
├── NIC Copy: 3 years
├── Payroll: 10 years
└── Other: 3 years
```

### Sensitive Documents
```
is_sensitive = True for:
- Medical records
- Disciplinary documents
- Performance reviews
- Salary letters

Access: Only HR and managers
```
