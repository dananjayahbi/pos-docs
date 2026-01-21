# Group F: API, Testing & Documentation

> **Phase:** 06 - ERP Advanced Modules  
> **SubPhase:** 01 - Employee Management  
> **Group:** F of F  
> **Tasks Covered:** 81-92  
> **Group Goal:** Create API endpoints, tests, and module documentation

---

## Navigation

- **↑ Parent:** [SubPhase-01 Summary](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group E: Employee Services & History](../Group-E_Employee-Services-History/)

---

## Group Overview

### Key Outcomes

1. **EmployeeSerializer** - DRF serializer with nested relations
2. **AddressSerializer** - DRF serializer for EmployeeAddress
3. **EmergencyContactSerializer** - DRF serializer for EmergencyContact
4. **DocumentSerializer** - DRF serializer for EmployeeDocument
5. **BankAccountSerializer** - DRF serializer for bank details (masked)
6. **EmployeeViewSet** - ViewSet with CRUD, status actions
7. **Employee Filtering** - Filter by status, department, type
8. **Employee Custom Actions** - activate, deactivate, terminate
9. **DocumentViewSet** - ViewSet for document upload/download
10. **API URL Registration** - All employee endpoints
11. **Employee Module Tests** - Unit and integration tests
12. **Module Documentation** - API docs, employee management guide

### Technology Context

| Technology | Purpose |
|------------|---------|
| Django REST Framework | API serializers/views |
| django-filter | Filtering capabilities |
| pytest | Testing framework |
| OpenAPI | API documentation |

---

## Documents in This Group

| # | Document | Tasks | Description |
|---|----------|-------|-------------|
| 01 | `01_Tasks-81-88_Serializers-ViewSet-Actions.md` | 81-88 | Serializers, EmployeeViewSet, filtering, actions |
| 02 | `02_Tasks-89-92_Document-ViewSet-URLs-Tests-Docs.md` | 89-92 | DocumentViewSet, URLs, tests, documentation |

---

## Task Summary

| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 81 | Create EmployeeSerializer | Medium | 30 min |
| 82 | Create AddressSerializer | Medium | 20 min |
| 83 | Create EmergencyContactSerializer | Medium | 20 min |
| 84 | Create DocumentSerializer | Medium | 20 min |
| 85 | Create BankAccountSerializer | Medium | 25 min |
| 86 | Create EmployeeViewSet | High | 35 min |
| 87 | Implement Employee Filtering | Medium | 25 min |
| 88 | Add Employee Custom Actions | High | 30 min |
| 89 | Create DocumentViewSet | Medium | 30 min |
| 90 | Register Employee API URLs | Low | 20 min |
| 91 | Create Employee Module Tests | High | 45 min |
| 92 | Create Employee Module Documentation | Medium | 35 min |

---

## Execution Order

```
[Tasks 81-88: Serializers, employee viewset, actions]
         │
         ▼
[Tasks 89-92: Document viewset, URLs, tests, docs]
```

---

## Expected Deliverables

```
apps/employees/
├── serializers/
│   ├── __init__.py
│   ├── employee_serializer.py    # Task 81
│   ├── address_serializer.py     # Task 82
│   ├── emergency_serializer.py   # Task 83
│   ├── document_serializer.py    # Task 84
│   └── bank_serializer.py        # Task 85
├── views/
│   ├── __init__.py
│   ├── employee_viewset.py       # Tasks 86, 88
│   └── document_viewset.py       # Task 89
├── filters.py                    # Task 87
├── urls.py                       # Task 90
├── tests/
│   ├── __init__.py
│   ├── test_models.py
│   ├── test_validators.py
│   ├── test_services.py
│   └── test_api.py               # Task 91
└── docs/
    └── README.md                 # Task 92
```

---

## Notes for AI Agents

### Employee API Endpoints
```
/api/v1/employees/
├── GET /                         # List employees
├── POST /                        # Create employee
├── GET /{id}/                    # Get employee detail
├── PUT /{id}/                    # Update employee
├── DELETE /{id}/                 # Delete employee (soft)
├── GET /{id}/addresses/          # Get addresses
├── POST /{id}/addresses/         # Add address
├── PUT /{id}/addresses/{aid}/    # Update address
├── DELETE /{id}/addresses/{aid}/ # Remove address
├── GET /{id}/contacts/           # Get emergency contacts
├── POST /{id}/contacts/          # Add contact
├── GET /{id}/family/             # Get family members
├── POST /{id}/family/            # Add family member
├── GET /{id}/documents/          # Get documents
├── POST /{id}/documents/         # Upload document
├── GET /{id}/documents/{did}/    # Download document
├── DELETE /{id}/documents/{did}/ # Delete document
├── GET /{id}/bank-accounts/      # Get bank accounts
├── POST /{id}/bank-accounts/     # Add bank account
├── POST /{id}/bank-accounts/{bid}/verify/ # Verify account
├── GET /{id}/history/            # Get employment history
├── POST /{id}/activate/          # Activate employee
├── POST /{id}/deactivate/        # Deactivate employee
├── POST /{id}/terminate/         # Terminate employment
├── POST /{id}/resign/            # Record resignation
├── POST /{id}/link-user/         # Link user account
├── POST /import/                 # Import from CSV/Excel
├── GET /export/                  # Export to CSV/Excel
├── GET /directory/               # Employee directory
├── GET /reports/headcount/       # Headcount report
├── GET /reports/turnover/        # Turnover report
```

### Employee Filtering Options
```
GET /?status=ACTIVE
GET /?department={dept_id}
GET /?designation={desig_id}
GET /?employment_type=FULL_TIME
GET /?manager={manager_id}
GET /?search=john
GET /?hire_date_from=2026-01-01
```

### Employee Actions
| Action | Method | Description |
|--------|--------|-------------|
| activate | POST /activate/ | Set status to ACTIVE |
| deactivate | POST /deactivate/ | Set status to INACTIVE |
| terminate | POST /terminate/ | Terminate employment |
| resign | POST /resign/ | Record resignation |
| link-user | POST /link-user/ | Create/link user account |

### EmployeeSerializer Nested Structure
```json
{
  "id": "uuid",
  "employee_id": "EMP-0001",
  "first_name": "John",
  "last_name": "Doe",
  "full_name": "John Doe",
  "email": "john.doe@company.com",
  "phone": "+94712345678",
  "nic_number": "912345678V",
  "date_of_birth": "1991-05-15",
  "age": 35,
  "gender": "MALE",
  "marital_status": "MARRIED",
  "profile_photo": "https://...",
  "department": {...},
  "designation": {...},
  "manager": {...},
  "employment_type": "FULL_TIME",
  "status": "ACTIVE",
  "hire_date": "2020-01-15",
  "addresses": [...],
  "emergency_contacts": [...],
  "user": {...},
  "created_at": "2020-01-15T10:00:00"
}
```

### BankAccountSerializer (Masked)
```json
{
  "id": "uuid",
  "bank_name": "Commercial Bank",
  "branch_name": "Colombo Main",
  "account_number": "****5678",
  "account_type": "SAVINGS",
  "is_primary": true,
  "is_verified": true,
  "verified_at": "2026-01-10"
}
```

### Test Categories
| Category | Tests |
|----------|-------|
| Model Tests | Employee, Address, Contact, Bank |
| Validator Tests | NIC, Phone validation |
| Service Tests | Create, update, status change |
| Import Tests | CSV parsing, validation |
| Export Tests | CSV/Excel generation |
| API Tests | All endpoints, permissions |
| Integration | End-to-end workflows |

### Documentation Sections
1. **Overview** - Module introduction
2. **Employee Lifecycle** - Status flow diagram
3. **Creating Employees** - Manual and import
4. **User Account Linking** - When and how
5. **Document Management** - Upload, visibility
6. **Bank Account Setup** - Verification process
7. **API Reference** - All endpoints
8. **Configuration** - Settings reference
