# Tasks 81-88: Serializers, ViewSet, Filtering & Actions

> **Phase:** 06 - ERP Advanced Modules  
> **SubPhase:** 01 - Employee Management  
> **Group:** F - API, Testing & Documentation  
> **Document:** 01 of 02  
> **Tasks Covered:** 81, 82, 83, 84, 85, 86, 87, 88

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-89-92_Document-ViewSet-URLs-Tests-Docs.md](02_Tasks-89-92_Document-ViewSet-URLs-Tests-Docs.md)

---

## Document Overview

This document covers the creation of DRF serializers for all employee-related models, the main EmployeeViewSet with comprehensive CRUD operations, filtering capabilities, and custom actions for employee lifecycle management (activation, deactivation, termination). These components form the API layer for the employee management module.

### Tasks in This Document
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

---

## Task 81: Create EmployeeSerializer

### Overview
Create the main EmployeeSerializer using Django REST Framework to handle serialization of Employee model data. This serializer includes nested serializers for addresses, emergency contacts, and related entities, providing a comprehensive API representation of employee data.

### Dependencies
- Employee model exists
- Department, Designation models exist
- Address, EmergencyContact models exist
- Django REST Framework installed

### Instructions

1. **Create serializers directory structure**
   - Navigate to `apps/employees/` directory
   - Create new directory named `serializers`
   - Create `__init__.py` in serializers directory

2. **Create employee_serializer.py file**
   - Create file at `apps/employees/serializers/employee_serializer.py`
   - Import necessary DRF components
   - Import Employee and related models

3. **Import required modules**
   - Import serializers from rest_framework
   - Import Employee model
   - Import Department, Designation models
   - Import User model (for user field)

4. **Create DepartmentSerializer (nested)**
   - ModelSerializer for Department
   - Include fields: id, name, code
   - Read-only serializer for nested display

5. **Create DesignationSerializer (nested)**
   - ModelSerializer for Designation
   - Include fields: id, title, code, level
   - Read-only serializer for nested display

6. **Create UserSerializer (nested)**
   - ModelSerializer for User
   - Include fields: id, username, email
   - Read-only serializer for linked user account

7. **Create ManagerSerializer (nested)**
   - Simplified Employee serializer for manager field
   - Include fields: id, employee_id, full_name, email
   - Avoid circular reference issues

8. **Define EmployeeSerializer class**
   - Inherit from ModelSerializer
   - Add serializer docstring

9. **Add computed fields**
   - full_name (SerializerMethodField)
   - age (SerializerMethodField)
   - years_of_service (SerializerMethodField)
   - Calculate values from model data

10. **Add nested serializers as fields**
    - department (DepartmentSerializer, read_only=True)
    - designation (DesignationSerializer, read_only=True)
    - manager (ManagerSerializer, read_only=True)
    - user (UserSerializer, read_only=True)

11. **Add writable foreign key ID fields**
    - department_id (PrimaryKeyRelatedField)
    - designation_id (PrimaryKeyRelatedField)
    - manager_id (PrimaryKeyRelatedField, optional)
    - Allow writes while nested shows full object

12. **Configure Meta class**
    - Set model to Employee
    - Define fields list (comprehensive)
    - Add read_only_fields
    - Set extra_kwargs for validations

13. **Add get_full_name method**
    - Calculate full name from first_name, last_name
    - Handle middle name if present
    - Return formatted name string

14. **Add get_age method**
    - Calculate age from date_of_birth
    - Return integer age in years
    - Handle None date_of_birth

15. **Add get_years_of_service method**
    - Calculate years from hire_date to today
    - Return float with decimal precision
    - Handle None hire_date

16. **Add validate method**
    - Cross-field validation
    - Validate hire_date not in future
    - Validate date_of_birth indicates minimum age (18)
    - Validate email uniqueness within tenant

17. **Update serializers/__init__.py**
    - Import EmployeeSerializer
    - Add to __all__ list

### EmployeeSerializer Structure

```
┌─────────────────────────────────────────────────────┐
│            EmployeeSerializer                        │
├─────────────────────────────────────────────────────┤
│ Core Fields:                                         │
│  • id (UUID)                                         │
│  • employee_id (String)                              │
│  • first_name, middle_name, last_name                │
│  • email, phone_number                               │
│  • nic_number, passport_number                       │
│  • date_of_birth, gender, marital_status             │
│  • hire_date, employment_type, status                │
│  • profile_photo (URL)                               │
│                                                      │
│ Computed Fields:                                     │
│  • full_name (method)                                │
│  • age (method)                                      │
│  • years_of_service (method)                         │
│                                                      │
│ Nested Read-Only:                                    │
│  • department (nested object)                        │
│  • designation (nested object)                       │
│  • manager (nested object)                           │
│  • user (nested object)                              │
│                                                      │
│ Writable FK Fields:                                  │
│  • department_id                                     │
│  • designation_id                                    │
│  • manager_id                                        │
└─────────────────────────────────────────────────────┘
```

### Sample JSON Response

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "employee_id": "EMP-0001",
  "first_name": "Nuwan",
  "middle_name": "",
  "last_name": "Fernando",
  "full_name": "Nuwan Fernando",
  "email": "nuwan.fernando@company.lk",
  "phone_number": "+94712345678",
  "nic_number": "912345678V",
  "passport_number": null,
  "date_of_birth": "1991-05-15",
  "age": 35,
  "gender": "MALE",
  "marital_status": "MARRIED",
  "employment_type": "FULL_TIME",
  "status": "ACTIVE",
  "hire_date": "2020-01-15",
  "years_of_service": 6.0,
  "probation_end_date": "2020-07-15",
  "profile_photo": "https://storage.example.com/employees/profile-001.jpg",
  "department": {
    "id": "dept-uuid",
    "name": "Sales & Marketing",
    "code": "SM"
  },
  "designation": {
    "id": "desig-uuid",
    "title": "Senior Sales Executive",
    "code": "SSE",
    "level": 3
  },
  "manager": {
    "id": "manager-uuid",
    "employee_id": "EMP-0050",
    "full_name": "Chaminda Silva",
    "email": "chaminda.silva@company.lk"
  },
  "user": {
    "id": "user-uuid",
    "username": "nuwan.fernando",
    "email": "nuwan.fernando@company.lk"
  },
  "created_at": "2020-01-15T10:30:00+05:30",
  "updated_at": "2026-01-24T14:20:00+05:30"
}
```

### Serializer Field Mapping

| Model Field | Serializer Field | Type | Notes |
|-------------|------------------|------|-------|
| first_name | first_name | CharField | Required |
| last_name | last_name | CharField | Required |
| full_name | full_name | Method | Computed |
| email | email | EmailField | Required, unique per tenant |
| phone_number | phone_number | CharField | Sri Lankan format |
| nic_number | nic_number | CharField | Validated |
| date_of_birth | date_of_birth | DateField | Required |
| age | age | Method | Computed from DOB |
| department | department | Nested | Read-only object |
| department_id | department_id | UUID | Write field |

### Validation Rules

| Field | Validation | Error Message |
|-------|------------|---------------|
| email | Unique per tenant | "Employee with this email already exists" |
| nic_number | Valid NIC format | "Invalid NIC number format" |
| date_of_birth | Age >= 18 | "Employee must be at least 18 years old" |
| hire_date | Not future date | "Hire date cannot be in the future" |
| phone_number | Sri Lankan format | "Invalid phone number format" |

### Expected Outcome
- Comprehensive employee serializer
- Nested representations for related objects
- Computed fields for convenience
- Proper validation rules
- Clean write/read separation

### Verification Checklist
- [ ] employee_serializer.py file created
- [ ] DepartmentSerializer defined
- [ ] DesignationSerializer defined
- [ ] UserSerializer defined
- [ ] ManagerSerializer defined
- [ ] EmployeeSerializer class defined
- [ ] full_name computed field added
- [ ] age computed field added
- [ ] years_of_service computed field added
- [ ] Nested serializers configured
- [ ] Writable FK ID fields added
- [ ] Meta class configured
- [ ] get_full_name method implemented
- [ ] get_age method implemented
- [ ] get_years_of_service method implemented
- [ ] validate method implemented
- [ ] Serializer imported in __init__.py

---

## Task 82: Create AddressSerializer

### Overview
Create the AddressSerializer to handle serialization of EmployeeAddress model data. This serializer supports multiple addresses per employee with proper address type handling and Sri Lankan address formats.

### Dependencies
- Task 81: Create EmployeeSerializer
- EmployeeAddress model exists

### Instructions

1. **Create address_serializer.py file**
   - Create file at `apps/employees/serializers/address_serializer.py`
   - Import DRF components
   - Import EmployeeAddress model

2. **Import required modules**
   - Import serializers from rest_framework
   - Import EmployeeAddress model
   - Import address validators if any

3. **Define AddressSerializer class**
   - Inherit from ModelSerializer
   - Add serializer docstring

4. **Add employee_id field**
   - PrimaryKeyRelatedField for writing
   - Links address to employee
   - Required for creation

5. **Configure address type choices**
   - Ensure address_type field shows choices
   - Include: HOME, PERMANENT, MAILING, EMERGENCY

6. **Add is_primary computed field**
   - SerializerMethodField
   - Indicates if this is primary address
   - Based on address_type and is_primary flag

7. **Configure Meta class**
   - Set model to EmployeeAddress
   - Define fields list
   - Add read_only_fields (id, created_at, updated_at)

8. **Add validate method**
   - Validate required fields based on address type
   - Ensure postal_code is valid Sri Lankan code
   - Validate district is valid Sri Lankan district

9. **Add validate_postal_code method**
   - Check postal code format (5 digits)
   - Validate against Sri Lankan postal codes
   - Return cleaned postal code

10. **Update serializers/__init__.py**
    - Import AddressSerializer
    - Add to __all__ list

### AddressSerializer Structure

```
┌─────────────────────────────────────────────────┐
│           AddressSerializer                     │
├─────────────────────────────────────────────────┤
│ Fields:                                         │
│  • id (UUID, read-only)                         │
│  • employee_id (UUID, write-only)               │
│  • address_type (Choice)                        │
│  • address_line_1 (CharField)                   │
│  • address_line_2 (CharField, optional)         │
│  • city (CharField)                             │
│  • district (CharField)                         │
│  • province (CharField)                         │
│  • postal_code (CharField)                      │
│  • country (CharField, default="Sri Lanka")     │
│  • is_primary (Boolean)                         │
│  • created_at (DateTime, read-only)             │
│  • updated_at (DateTime, read-only)             │
└─────────────────────────────────────────────────┘
```

### Sample JSON Response

```json
{
  "id": "addr-uuid",
  "address_type": "HOME",
  "address_line_1": "No. 45, Flower Road",
  "address_line_2": "Colombo 07",
  "city": "Colombo",
  "district": "Colombo",
  "province": "Western",
  "postal_code": "00700",
  "country": "Sri Lanka",
  "is_primary": true,
  "created_at": "2020-01-15T10:30:00+05:30",
  "updated_at": "2020-01-15T10:30:00+05:30"
}
```

### Sri Lankan Address Components

| Component | Description | Example |
|-----------|-------------|---------|
| address_line_1 | House number, street | "No. 45, Flower Road" |
| address_line_2 | Area, neighborhood | "Colombo 07" |
| city | City or town | "Colombo", "Kandy", "Galle" |
| district | Administrative district | "Colombo", "Kandy", "Galle" |
| province | Province | "Western", "Central", "Southern" |
| postal_code | 5-digit postal code | "00700", "20000", "80000" |

### Address Type Handling

| Type | Label | Purpose | Validation |
|------|-------|---------|------------|
| HOME | Home Address | Current residence | Required: all fields |
| PERMANENT | Permanent Address | Permanent residence | Required: all fields |
| MAILING | Mailing Address | Correspondence | Required: minimal |
| EMERGENCY | Emergency Address | Emergency contact location | Optional: some fields |

### Postal Code Validation

```
Valid Sri Lankan Postal Codes
══════════════════════════════
Format: 5 digits (XXXXX)

Examples:
  00100 - Colombo Fort
  00700 - Colombo 07
  20000 - Kandy
  80000 - Galle
  10100 - Borella
  40000 - Jaffna
```

### Expected Outcome
- Functional address serializer
- Sri Lankan address format support
- Postal code validation
- Multiple address types
- Primary address handling

### Verification Checklist
- [ ] address_serializer.py file created
- [ ] AddressSerializer class defined
- [ ] employee_id field configured
- [ ] address_type field with choices
- [ ] All address fields included
- [ ] is_primary field added
- [ ] Meta class configured
- [ ] validate method implemented
- [ ] validate_postal_code method implemented
- [ ] Serializer imported in __init__.py

---

## Task 83: Create EmergencyContactSerializer

### Overview
Create the EmergencyContactSerializer to handle serialization of EmergencyContact model data. This serializer manages emergency contact information with proper relationship and priority handling.

### Dependencies
- Task 81: Create EmployeeSerializer
- EmergencyContact model exists

### Instructions

1. **Create emergency_serializer.py file**
   - Create file at `apps/employees/serializers/emergency_serializer.py`
   - Import DRF components
   - Import EmergencyContact model

2. **Import required modules**
   - Import serializers from rest_framework
   - Import EmergencyContact model
   - Import phone number validators

3. **Define EmergencyContactSerializer class**
   - Inherit from ModelSerializer
   - Add serializer docstring

4. **Add employee_id field**
   - PrimaryKeyRelatedField for writing
   - Links contact to employee
   - Required for creation

5. **Configure relationship choices**
   - Ensure relationship field shows choices
   - Include all common relationships

6. **Add priority field**
   - IntegerField with validation
   - 1 = Primary contact, 2 = Secondary, etc.
   - Default to 1

7. **Configure Meta class**
   - Set model to EmergencyContact
   - Define fields list
   - Add read_only_fields

8. **Add validate_phone_number method**
   - Validate Sri Lankan phone format
   - Support mobile: +94 7X XXX XXXX
   - Support landline: +94 XX XXX XXXX
   - Return cleaned phone number

9. **Add validate method**
   - Ensure at least one contact method (phone or email)
   - Validate relationship is valid
   - Check priority uniqueness per employee

10. **Update serializers/__init__.py**
    - Import EmergencyContactSerializer
    - Add to __all__ list

### EmergencyContactSerializer Structure

```
┌─────────────────────────────────────────────────┐
│      EmergencyContactSerializer                 │
├─────────────────────────────────────────────────┤
│ Fields:                                         │
│  • id (UUID, read-only)                         │
│  • employee_id (UUID, write-only)               │
│  • name (CharField)                             │
│  • relationship (Choice)                        │
│  • phone_number (CharField)                     │
│  • alternative_phone (CharField, optional)      │
│  • email (EmailField, optional)                 │
│  • address (TextField, optional)                │
│  • priority (IntegerField)                      │
│  • notes (TextField, optional)                  │
│  • created_at (DateTime, read-only)             │
│  • updated_at (DateTime, read-only)             │
└─────────────────────────────────────────────────┘
```

### Sample JSON Response

```json
{
  "id": "contact-uuid",
  "name": "Kumari Fernando",
  "relationship": "SPOUSE",
  "phone_number": "+94712345678",
  "alternative_phone": "+94112345678",
  "email": "kumari@example.com",
  "address": "No. 45, Flower Road, Colombo 07",
  "priority": 1,
  "notes": "Available 24/7",
  "created_at": "2020-01-15T10:30:00+05:30",
  "updated_at": "2020-01-15T10:30:00+05:30"
}
```

### Relationship Types

| Value | Display Name | Description |
|-------|--------------|-------------|
| SPOUSE | Spouse | Married partner |
| PARENT | Parent | Father or mother |
| CHILD | Child | Son or daughter |
| SIBLING | Sibling | Brother or sister |
| PARTNER | Partner | Unmarried partner |
| FRIEND | Friend | Close friend |
| GUARDIAN | Guardian | Legal guardian |
| OTHER | Other | Other relationship |

### Sri Lankan Phone Number Formats

```
Mobile Numbers
══════════════
Format: +94 7X XXX XXXX
Examples:
  +94712345678
  +94771234567
  +94702345678

Landline Numbers
════════════════
Format: +94 XX XXX XXXX
Examples:
  +94112345678 (Colombo)
  +94812345678 (Kandy)
  +94912345678 (Galle)
```

### Priority System

| Priority | Label | Purpose |
|----------|-------|---------|
| 1 | Primary | First person to contact |
| 2 | Secondary | Contact if primary unavailable |
| 3+ | Additional | Additional emergency contacts |

### Emergency Contact Best Practices

```
┌────────────────────────────────────────┐
│     Emergency Contact Guidelines        │
├────────────────────────────────────────┤
│                                        │
│ 1. At least 2 contacts recommended    │
│ 2. Different phone numbers preferred   │
│ 3. Include 24-hour contact method      │
│ 4. Update contact info regularly       │
│ 5. Verify numbers during onboarding    │
│                                        │
└────────────────────────────────────────┘
```

### Expected Outcome
- Functional emergency contact serializer
- Sri Lankan phone validation
- Priority handling
- Multiple contact support
- Relationship categorization

### Verification Checklist
- [ ] emergency_serializer.py file created
- [ ] EmergencyContactSerializer class defined
- [ ] employee_id field configured
- [ ] relationship field with choices
- [ ] phone_number field validated
- [ ] priority field added
- [ ] Meta class configured
- [ ] validate_phone_number method implemented
- [ ] validate method implemented
- [ ] Serializer imported in __init__.py

---

## Task 84: Create DocumentSerializer

### Overview
Create the DocumentSerializer to handle serialization of EmployeeDocument model data. This serializer manages document upload, download, and metadata with proper access control and file handling.

### Dependencies
- Task 81: Create EmployeeSerializer
- EmployeeDocument model exists
- File storage configured

### Instructions

1. **Create document_serializer.py file**
   - Create file at `apps/employees/serializers/document_serializer.py`
   - Import DRF components
   - Import EmployeeDocument model

2. **Import required modules**
   - Import serializers from rest_framework
   - Import EmployeeDocument model
   - Import file validators

3. **Define DocumentSerializer class**
   - Inherit from ModelSerializer
   - Add serializer docstring

4. **Add employee_id field**
   - PrimaryKeyRelatedField for writing
   - Links document to employee
   - Required for creation

5. **Add uploaded_by field**
   - Nested UserSerializer
   - Read-only display of uploader
   - Show username and email

6. **Add file_url field**
   - SerializerMethodField
   - Generate secure download URL
   - Temporary signed URL if needed

7. **Add file_size_display field**
   - SerializerMethodField
   - Format file size in human-readable format
   - KB, MB, GB

8. **Configure document_type choices**
   - Ensure document_type field shows choices
   - Include all common document types

9. **Configure Meta class**
   - Set model to EmployeeDocument
   - Define fields list
   - Add read_only_fields
   - Configure extra_kwargs for file field

10. **Add get_file_url method**
    - Generate download URL for file
    - Use storage backend URL method
    - Return absolute URL

11. **Add get_file_size_display method**
    - Convert bytes to human-readable format
    - Return formatted string (e.g., "2.5 MB")

12. **Add validate_file method**
    - Validate file size (max 10MB)
    - Validate file type/extension
    - Check for malicious content if needed

13. **Add validate method**
    - Ensure document_type matches file type
    - Validate expiry_date is future date
    - Check required fields based on type

14. **Update serializers/__init__.py**
    - Import DocumentSerializer
    - Add to __all__ list

### DocumentSerializer Structure

```
┌─────────────────────────────────────────────────┐
│          DocumentSerializer                     │
├─────────────────────────────────────────────────┤
│ Fields:                                         │
│  • id (UUID, read-only)                         │
│  • employee_id (UUID, write-only)               │
│  • document_type (Choice)                       │
│  • document_name (CharField)                    │
│  • document_number (CharField, optional)        │
│  • file (FileField)                             │
│  • file_url (Method, read-only)                 │
│  • file_size (Integer, read-only)               │
│  • file_size_display (Method, read-only)        │
│  • issue_date (DateField, optional)             │
│  • expiry_date (DateField, optional)            │
│  • is_verified (Boolean)                        │
│  • verified_by (User, read-only)                │
│  • verified_at (DateTime, read-only)            │
│  • uploaded_by (User nested, read-only)         │
│  • notes (TextField, optional)                  │
│  • created_at (DateTime, read-only)             │
└─────────────────────────────────────────────────┘
```

### Sample JSON Response

```json
{
  "id": "doc-uuid",
  "document_type": "NIC",
  "document_name": "National Identity Card",
  "document_number": "912345678V",
  "file": "/media/employee-documents/nic-001.pdf",
  "file_url": "https://storage.example.com/employee-documents/nic-001.pdf",
  "file_size": 524288,
  "file_size_display": "512.0 KB",
  "issue_date": "2009-05-20",
  "expiry_date": null,
  "is_verified": true,
  "verified_by": {
    "id": "user-uuid",
    "username": "hr.admin",
    "email": "hr@company.lk"
  },
  "verified_at": "2020-01-16T09:00:00+05:30",
  "uploaded_by": {
    "id": "user-uuid",
    "username": "nuwan.fernando",
    "email": "nuwan.fernando@company.lk"
  },
  "notes": "Original document verified by HR",
  "created_at": "2020-01-15T10:30:00+05:30"
}
```

### Document Types

| Type | Label | Requires Number | Requires Expiry |
|------|-------|-----------------|-----------------|
| NIC | National Identity Card | Yes | No |
| PASSPORT | Passport | Yes | Yes |
| BIRTH_CERT | Birth Certificate | Yes | No |
| MARRIAGE_CERT | Marriage Certificate | Yes | No |
| EDUCATIONAL | Educational Certificate | No | No |
| PROFESSIONAL | Professional Certificate | Optional | Optional |
| CONTRACT | Employment Contract | No | No |
| OFFER_LETTER | Offer Letter | No | No |
| MEDICAL | Medical Certificate | No | Optional |
| POLICE_REPORT | Police Report | Optional | Optional |
| OTHER | Other Document | No | No |

### File Size Formatting

```python
File Size Display Examples
═══════════════════════════

  512 bytes    → "512 B"
  1024 bytes   → "1.0 KB"
  524288       → "512.0 KB"
  1048576      → "1.0 MB"
  2621440      → "2.5 MB"
  10485760     → "10.0 MB"
```

### File Validation Rules

| Validation | Rule | Error Message |
|------------|------|---------------|
| File size | Max 10 MB | "File size exceeds 10 MB limit" |
| File type | PDF, JPG, PNG | "Invalid file type" |
| File name | Sanitized | "Invalid characters in filename" |
| Virus scan | Clean | "File failed security scan" |

### Document Access Control

```
┌──────────────────────────────────────────────┐
│         Document Visibility Matrix            │
├──────────────────────────────────────────────┤
│                                              │
│ Employee:     Own documents only             │
│ Manager:      Team documents only            │
│ HR:           All documents                  │
│ Admin:        All documents                  │
│                                              │
│ Public Docs:  Everyone (if marked)           │
│ Verified:     Show verification badge        │
│                                              │
└──────────────────────────────────────────────┘
```

### Expected Outcome
- Functional document serializer
- File upload handling
- Secure URL generation
- File size formatting
- Document type validation

### Verification Checklist
- [ ] document_serializer.py file created
- [ ] DocumentSerializer class defined
- [ ] employee_id field configured
- [ ] uploaded_by nested field added
- [ ] file_url computed field added
- [ ] file_size_display computed field added
- [ ] document_type field with choices
- [ ] Meta class configured
- [ ] get_file_url method implemented
- [ ] get_file_size_display method implemented
- [ ] validate_file method implemented
- [ ] validate method implemented
- [ ] Serializer imported in __init__.py

---

## Task 85: Create BankAccountSerializer

### Overview
Create the BankAccountSerializer to handle serialization of EmployeeBankAccount model data. This serializer implements account number masking for security and supports Sri Lankan banking institutions.

### Dependencies
- Task 81: Create EmployeeSerializer
- EmployeeBankAccount model exists

### Instructions

1. **Create bank_serializer.py file**
   - Create file at `apps/employees/serializers/bank_serializer.py`
   - Import DRF components
   - Import EmployeeBankAccount model

2. **Import required modules**
   - Import serializers from rest_framework
   - Import EmployeeBankAccount model
   - Import bank validators

3. **Define BankAccountSerializer class**
   - Inherit from ModelSerializer
   - Add serializer docstring

4. **Add employee_id field**
   - PrimaryKeyRelatedField for writing
   - Links bank account to employee
   - Required for creation

5. **Add account_number_masked field**
   - SerializerMethodField
   - Shows masked account number (e.g., ****5678)
   - Security feature

6. **Add verified_by field**
   - Nested UserSerializer
   - Read-only display of verifier
   - Show who verified account

7. **Configure bank_name choices**
   - Field with Sri Lankan banks
   - Major commercial banks included

8. **Configure account_type choices**
   - SAVINGS, CURRENT, CORPORATE
   - Standard account types

9. **Configure Meta class**
   - Set model to EmployeeBankAccount
   - Define fields list
   - Add read_only_fields
   - Set write_only for account_number

10. **Add get_account_number_masked method**
    - Mask account number for security
    - Show last 4 digits only
    - Format: ****5678

11. **Add to_representation method override**
    - Remove full account_number from response
    - Show only masked version
    - Admins/HR can see full number via permission

12. **Add validate_account_number method**
    - Validate account number format
    - Check length (typically 10-15 digits)
    - Return cleaned account number

13. **Add validate method**
    - Ensure only one primary account per employee
    - Validate bank details combination
    - Check branch code if provided

14. **Update serializers/__init__.py**
    - Import BankAccountSerializer
    - Add to __all__ list

### BankAccountSerializer Structure

```
┌─────────────────────────────────────────────────┐
│        BankAccountSerializer                    │
├─────────────────────────────────────────────────┤
│ Fields:                                         │
│  • id (UUID, read-only)                         │
│  • employee_id (UUID, write-only)               │
│  • bank_name (Choice)                           │
│  • branch_name (CharField)                      │
│  • branch_code (CharField, optional)            │
│  • account_number (CharField, write-only)       │
│  • account_number_masked (Method, read-only)    │
│  • account_holder_name (CharField)              │
│  • account_type (Choice)                        │
│  • swift_code (CharField, optional)             │
│  • is_primary (Boolean)                         │
│  • is_verified (Boolean)                        │
│  • verified_by (User nested, read-only)         │
│  • verified_at (DateTime, read-only)            │
│  • notes (TextField, optional)                  │
│  • created_at (DateTime, read-only)             │
└─────────────────────────────────────────────────┘
```

### Sample JSON Response

```json
{
  "id": "bank-uuid",
  "bank_name": "Commercial Bank",
  "branch_name": "Colombo Main Branch",
  "branch_code": "001",
  "account_number_masked": "****5678",
  "account_holder_name": "Nuwan Fernando",
  "account_type": "SAVINGS",
  "swift_code": "CCEYLKLX",
  "is_primary": true,
  "is_verified": true,
  "verified_by": {
    "id": "user-uuid",
    "username": "hr.admin",
    "email": "hr@company.lk"
  },
  "verified_at": "2020-01-16T11:00:00+05:30",
  "notes": "Verified with bank statement",
  "created_at": "2020-01-15T10:30:00+05:30"
}
```

### Sri Lankan Banks

| Bank Name | SWIFT Code | Typical Account Length |
|-----------|------------|----------------------|
| Commercial Bank | CCEYLKLX | 12 digits |
| Bank of Ceylon | BCEYLKLX | 10 digits |
| Hatton National Bank | HBLILKLX | 12 digits |
| Sampath Bank | SAMBBLKLX | 12 digits |
| Nations Trust Bank | NTBCLKLX | 11 digits |
| Seylan Bank | SEYLLKLX | 12 digits |
| DFCC Bank | DFCCLKLX | 10 digits |
| Pan Asia Bank | PABLBKLX | 12 digits |
| Union Bank | UBOBLKLX | 12 digits |
| People's Bank | PEBKLKLX | 10 digits |

### Account Number Masking

```
Account Number Masking Logic
═════════════════════════════

Original:  1234567890
Masked:    ****567890  (last 6 digits)

Original:  123456789012
Masked:    ****9012     (last 4 digits)

Security Rules:
- Always mask in API responses
- Show full number only to HR/Admin
- Log access to full account numbers
- Mask in logs and error messages
```

### Account Types

| Type | Description | Common Use |
|------|-------------|------------|
| SAVINGS | Savings Account | Personal savings, salary deposits |
| CURRENT | Current Account | Business transactions |
| CORPORATE | Corporate Account | Company accounts |

### Account Verification Process

```
┌────────────────────────────────────────────┐
│      Bank Account Verification Flow        │
├────────────────────────────────────────────┤
│                                            │
│ 1. Employee submits bank details           │
│ 2. Employee uploads bank statement/slip    │
│ 3. HR reviews documents                    │
│ 4. HR verifies account details             │
│ 5. System marks as verified                │
│ 6. Account ready for salary payments       │
│                                            │
└────────────────────────────────────────────┘
```

### Primary Account Rules

```
Only one primary account per employee
══════════════════════════════════════

Employee A:
  ├── Account 1 (is_primary=True)   ← Salary deposits
  ├── Account 2 (is_primary=False)  ← Alternative
  └── Account 3 (is_primary=False)  ← Savings

When Account 2 is set as primary:
  ├── Account 1 (is_primary=False)  ← Auto-unset
  ├── Account 2 (is_primary=True)   ← New primary
  └── Account 3 (is_primary=False)
```

### Expected Outcome
- Secure bank account serializer
- Account number masking
- Sri Lankan bank support
- Verification tracking
- Primary account management

### Verification Checklist
- [ ] bank_serializer.py file created
- [ ] BankAccountSerializer class defined
- [ ] employee_id field configured
- [ ] account_number_masked field added
- [ ] verified_by nested field added
- [ ] bank_name field with Sri Lankan banks
- [ ] account_type field with choices
- [ ] Meta class configured
- [ ] get_account_number_masked method implemented
- [ ] to_representation method overridden
- [ ] validate_account_number method implemented
- [ ] validate method implemented
- [ ] Serializer imported in __init__.py

---

## Task 86: Create EmployeeViewSet

### Overview
Create the main EmployeeViewSet using Django REST Framework to provide comprehensive CRUD operations for employees. This ViewSet includes list, create, retrieve, update, and delete operations with proper permissions, filtering, and tenant isolation.

### Dependencies
- Task 81: Create EmployeeSerializer
- Employee model and all serializers exist
- DRF ViewSets configured

### Instructions

1. **Create views directory structure**
   - Navigate to `apps/employees/` directory
   - Create new directory named `views`
   - Create `__init__.py` in views directory

2. **Create employee_viewset.py file**
   - Create file at `apps/employees/views/employee_viewset.py`
   - Import DRF components
   - Import Employee model and serializers

3. **Import required modules**
   - Import viewsets from rest_framework
   - Import permissions, filters, pagination
   - Import Employee model
   - Import EmployeeSerializer and related serializers
   - Import employee service functions

4. **Define EmployeeViewSet class**
   - Inherit from ModelViewSet
   - Add ViewSet docstring

5. **Configure queryset**
   - Set queryset to Employee.objects.all()
   - Include select_related for foreign keys
   - Include prefetch_related for reverse relations
   - Order by employee_id

6. **Configure serializer_class**
   - Set to EmployeeSerializer
   - Add get_serializer_class method if multiple serializers needed

7. **Configure permission_classes**
   - Use IsAuthenticated
   - Add custom TenantPermission
   - Add role-based permissions (HR, Manager)

8. **Configure filter_backends**
   - Add DjangoFilterBackend
   - Add SearchFilter
   - Add OrderingFilter

9. **Configure filterset_fields**
   - status, employment_type
   - department, designation
   - manager, hire_date range

10. **Configure search_fields**
    - employee_id, first_name, last_name
    - email, phone_number, nic_number

11. **Configure ordering_fields**
    - employee_id, first_name, last_name
    - hire_date, created_at

12. **Configure pagination_class**
    - Use PageNumberPagination
    - Set page_size to 25

13. **Override get_queryset method**
    - Apply tenant filtering
    - Apply role-based filtering (managers see team only)
    - Apply soft delete filter (exclude deleted)

14. **Override perform_create method**
    - Set tenant from request
    - Set created_by from request.user
    - Call employee creation service
    - Generate employee_id automatically

15. **Override perform_update method**
    - Set updated_by from request.user
    - Call employee update service
    - Log change history

16. **Override perform_destroy method**
    - Implement soft delete
    - Set is_deleted=True
    - Set deleted_at timestamp
    - Do not permanently delete

17. **Add list method customization (optional)**
    - Add statistics to response
    - Include counts by status
    - Include department distribution

18. **Add retrieve method customization (optional)**
    - Include additional details
    - Include recent history
    - Include linked documents count

19. **Update views/__init__.py**
    - Import EmployeeViewSet
    - Add to __all__ list

### EmployeeViewSet Structure

```
┌─────────────────────────────────────────────────┐
│            EmployeeViewSet                      │
├─────────────────────────────────────────────────┤
│ Configuration:                                  │
│  • queryset (with select/prefetch)              │
│  • serializer_class (EmployeeSerializer)        │
│  • permission_classes (Auth + Tenant)           │
│  • filter_backends (Filter, Search, Order)      │
│  • filterset_fields (status, dept, etc.)        │
│  • search_fields (name, email, etc.)            │
│  • ordering_fields (name, date, etc.)           │
│  • pagination_class (25 per page)               │
│                                                 │
│ Standard Actions:                               │
│  • list() - GET /employees/                     │
│  • create() - POST /employees/                  │
│  • retrieve() - GET /employees/{id}/            │
│  • update() - PUT /employees/{id}/              │
│  • partial_update() - PATCH /employees/{id}/    │
│  • destroy() - DELETE /employees/{id}/          │
│                                                 │
│ Overridden Methods:                             │
│  • get_queryset() - Tenant + role filtering     │
│  • perform_create() - Service integration       │
│  • perform_update() - Change tracking           │
│  • perform_destroy() - Soft delete              │
└─────────────────────────────────────────────────┘
```

### ViewSet Method Flow

```
List Employees (GET /employees/)
════════════════════════════════
1. list() called
2. get_queryset() → Apply tenant filter
3. Apply filterset (status, dept)
4. Apply search (name, email)
5. Apply ordering (employee_id)
6. Paginate results
7. Serialize queryset
8. Return paginated response

Create Employee (POST /employees/)
═══════════════════════════════════
1. create() called
2. Validate data with serializer
3. perform_create() called
4. Set tenant, created_by
5. Call employee_service.create_employee()
6. Generate employee_id
7. Save employee
8. Return serialized employee (201)

Update Employee (PUT /employees/{id}/)
═══════════════════════════════════════
1. update() called
2. Retrieve employee via get_queryset()
3. Validate data with serializer
4. perform_update() called
5. Set updated_by
6. Call employee_service.update_employee()
7. Log changes
8. Save employee
9. Return serialized employee (200)

Delete Employee (DELETE /employees/{id}/)
══════════════════════════════════════════
1. destroy() called
2. Retrieve employee via get_queryset()
3. perform_destroy() called
4. Set is_deleted=True
5. Set deleted_at=now()
6. Save employee (soft delete)
7. Return 204 No Content
```

### Query Optimization

```python
Optimized Queryset Example
══════════════════════════

queryset = Employee.objects.filter(
    tenant=request.user.tenant,
    is_deleted=False
).select_related(
    'department',
    'designation',
    'manager',
    'user'
).prefetch_related(
    'addresses',
    'emergency_contacts',
    'documents'
).order_by('employee_id')

Benefits:
- Reduces database queries
- Faster list operations
- Efficient detail views
```

### Permission Matrix

| Role | List | Create | View | Update | Delete | Actions |
|------|------|--------|------|--------|--------|---------|
| Employee | Team | No | Self | Self | No | Self |
| Manager | Team | Yes | Team | Team | No | Team |
| HR | All | Yes | All | All | Yes | All |
| Admin | All | Yes | All | All | Yes | All |

### Expected Outcome
- Functional employee ViewSet
- CRUD operations working
- Tenant isolation enforced
- Role-based access control
- Query optimization applied
- Soft delete implemented

### Verification Checklist
- [ ] employee_viewset.py file created
- [ ] EmployeeViewSet class defined
- [ ] queryset configured with optimization
- [ ] serializer_class set
- [ ] permission_classes configured
- [ ] filter_backends added
- [ ] filterset_fields defined
- [ ] search_fields defined
- [ ] ordering_fields defined
- [ ] pagination_class set
- [ ] get_queryset method overridden
- [ ] perform_create method overridden
- [ ] perform_update method overridden
- [ ] perform_destroy method overridden
- [ ] ViewSet imported in __init__.py

---

## Task 87: Implement Employee Filtering

### Overview
Implement comprehensive filtering capabilities for the Employee API using django-filter. This includes filters for status, employment type, department, designation, date ranges, and custom filters for complex queries.

### Dependencies
- Task 86: Create EmployeeViewSet
- django-filter package installed

### Instructions

1. **Create filters.py file**
   - Create file at `apps/employees/filters.py`
   - Import django-filter components
   - Import Employee model

2. **Import required modules**
   - Import filters from django_filters
   - Import Employee model
   - Import Q for complex queries

3. **Define EmployeeFilter class**
   - Inherit from FilterSet
   - Add filter docstring

4. **Add status filter**
   - MultipleChoiceFilter for status
   - Allow filtering by multiple statuses
   - Choices from EMPLOYEE_STATUS_CHOICES

5. **Add employment_type filter**
   - MultipleChoiceFilter for employment type
   - Allow filtering by multiple types
   - Choices from EMPLOYMENT_TYPE_CHOICES

6. **Add department filter**
   - ModelMultipleChoiceFilter
   - Allow filtering by multiple departments
   - Queryset: Department.objects.all()

7. **Add designation filter**
   - ModelMultipleChoiceFilter
   - Allow filtering by multiple designations
   - Queryset: Designation.objects.all()

8. **Add manager filter**
   - ModelChoiceFilter
   - Filter by direct manager
   - Queryset: Employee.objects.filter(is_manager=True)

9. **Add hire_date_from filter**
   - DateFilter
   - Filter employees hired on or after date
   - Field: hire_date, lookup: gte

10. **Add hire_date_to filter**
    - DateFilter
    - Filter employees hired on or before date
    - Field: hire_date, lookup: lte

11. **Add age_min filter**
    - NumberFilter
    - Filter by minimum age
    - Custom method for calculation

12. **Add age_max filter**
    - NumberFilter
    - Filter by maximum age
    - Custom method for calculation

13. **Add has_user_account filter**
    - BooleanFilter
    - Filter employees with/without user account
    - Method: filter_has_user_account

14. **Add is_on_probation filter**
    - BooleanFilter
    - Filter employees currently on probation
    - Method: filter_is_on_probation

15. **Add search filter**
    - CharFilter
    - Custom search across multiple fields
    - Method: filter_search

16. **Configure Meta class**
    - Set model to Employee
    - Define fields dictionary
    - Set filter_overrides if needed

17. **Implement filter_has_user_account method**
    - Check if user field is not null
    - Return filtered queryset

18. **Implement filter_is_on_probation method**
    - Check if today <= probation_end_date
    - Return filtered queryset

19. **Implement filter_search method**
    - Search across employee_id, name, email, NIC
    - Use Q objects for OR conditions
    - Return filtered queryset

20. **Update EmployeeViewSet**
    - Set filterset_class to EmployeeFilter
    - Remove filterset_fields (use filter class instead)

### EmployeeFilter Structure

```
┌─────────────────────────────────────────────────┐
│            EmployeeFilter                       │
├─────────────────────────────────────────────────┤
│ Status & Type Filters:                          │
│  • status (MultipleChoice)                      │
│  • employment_type (MultipleChoice)             │
│                                                 │
│ Organizational Filters:                         │
│  • department (ModelMultipleChoice)             │
│  • designation (ModelMultipleChoice)            │
│  • manager (ModelChoice)                        │
│                                                 │
│ Date Range Filters:                             │
│  • hire_date_from (Date, gte)                   │
│  • hire_date_to (Date, lte)                     │
│                                                 │
│ Age Filters:                                    │
│  • age_min (Number, custom)                     │
│  • age_max (Number, custom)                     │
│                                                 │
│ Boolean Filters:                                │
│  • has_user_account (Boolean, custom)           │
│  • is_on_probation (Boolean, custom)            │
│                                                 │
│ Search Filter:                                  │
│  • search (Char, custom multi-field)            │
└─────────────────────────────────────────────────┘
```

### Filter Query Examples

```
Filter by Status
════════════════
GET /api/v1/employees/?status=ACTIVE
GET /api/v1/employees/?status=ACTIVE,INACTIVE

Filter by Department
════════════════════
GET /api/v1/employees/?department=dept-uuid-1
GET /api/v1/employees/?department=dept-uuid-1,dept-uuid-2

Filter by Employment Type
═════════════════════════
GET /api/v1/employees/?employment_type=FULL_TIME
GET /api/v1/employees/?employment_type=FULL_TIME,CONTRACT

Filter by Hire Date Range
═════════════════════════
GET /api/v1/employees/?hire_date_from=2020-01-01
GET /api/v1/employees/?hire_date_to=2023-12-31
GET /api/v1/employees/?hire_date_from=2020-01-01&hire_date_to=2023-12-31

Filter by Age Range
═══════════════════
GET /api/v1/employees/?age_min=25
GET /api/v1/employees/?age_max=60
GET /api/v1/employees/?age_min=25&age_max=60

Filter by User Account Status
══════════════════════════════
GET /api/v1/employees/?has_user_account=true
GET /api/v1/employees/?has_user_account=false

Filter by Probation Status
═══════════════════════════
GET /api/v1/employees/?is_on_probation=true
GET /api/v1/employees/?is_on_probation=false

Search
══════
GET /api/v1/employees/?search=john
GET /api/v1/employees/?search=912345678V
GET /api/v1/employees/?search=EMP-0001

Combined Filters
════════════════
GET /api/v1/employees/?status=ACTIVE&department=dept-uuid&employment_type=FULL_TIME
GET /api/v1/employees/?hire_date_from=2020-01-01&is_on_probation=true
GET /api/v1/employees/?search=silva&status=ACTIVE,INACTIVE
```

### Custom Filter Methods

```python
has_user_account Filter Logic
══════════════════════════════
If value is True:
  Filter employees WHERE user IS NOT NULL
If value is False:
  Filter employees WHERE user IS NULL

is_on_probation Filter Logic
════════════════════════════════
If value is True:
  Filter employees WHERE
    probation_end_date IS NOT NULL AND
    probation_end_date >= today
If value is False:
  Filter employees WHERE
    probation_end_date IS NULL OR
    probation_end_date < today

search Filter Logic
═══════════════════
Search in:
  - employee_id (exact or icontains)
  - first_name (icontains)
  - last_name (icontains)
  - email (icontains)
  - nic_number (exact or icontains)
  - phone_number (icontains)

Combined with OR (Q objects)
```

### Filter Response Example

```json
{
  "count": 45,
  "next": "http://api.example.com/employees/?page=2&status=ACTIVE",
  "previous": null,
  "results": [
    {
      "id": "uuid-1",
      "employee_id": "EMP-0001",
      "full_name": "Nuwan Fernando",
      "status": "ACTIVE",
      "department": {
        "name": "Sales & Marketing"
      },
      ...
    },
    ...
  ]
}
```

### Expected Outcome
- Comprehensive filter class
- Multiple filter types supported
- Custom filter methods working
- Combined filtering capability
- Search functionality integrated

### Verification Checklist
- [ ] filters.py file created
- [ ] EmployeeFilter class defined
- [ ] status filter added
- [ ] employment_type filter added
- [ ] department filter added
- [ ] designation filter added
- [ ] manager filter added
- [ ] hire_date_from filter added
- [ ] hire_date_to filter added
- [ ] age_min filter added
- [ ] age_max filter added
- [ ] has_user_account filter added
- [ ] is_on_probation filter added
- [ ] search filter added
- [ ] Meta class configured
- [ ] Custom filter methods implemented
- [ ] EmployeeViewSet updated with filterset_class

---

## Task 88: Add Employee Custom Actions

### Overview
Add custom actions to the EmployeeViewSet for employee lifecycle management including activate, deactivate, terminate, resign, and link user account. These actions provide specific operations beyond standard CRUD operations.

### Dependencies
- Task 86: Create EmployeeViewSet
- Employee service functions exist

### Instructions

1. **Open employee_viewset.py file**
   - Navigate to `apps/employees/views/employee_viewset.py`
   - Locate EmployeeViewSet class

2. **Import required modules**
   - Import action decorator from rest_framework.decorators
   - Import Response from rest_framework.response
   - Import status from rest_framework
   - Import employee service functions

3. **Add activate action**
   - Use @action decorator with detail=True, methods=['post']
   - Define activate method
   - Call employee_service.activate_employee()
   - Return success response

4. **Add deactivate action**
   - Use @action decorator with detail=True, methods=['post']
   - Define deactivate method
   - Require reason in request data
   - Call employee_service.deactivate_employee()
   - Return success response

5. **Add terminate action**
   - Use @action decorator with detail=True, methods=['post']
   - Define terminate method
   - Require termination_date and reason
   - Call employee_service.terminate_employee()
   - Return success response

6. **Add resign action**
   - Use @action decorator with detail=True, methods=['post']
   - Define resign method
   - Require resignation_date and last_working_date
   - Call employee_service.record_resignation()
   - Return success response

7. **Add link_user action**
   - Use @action decorator with detail=True, methods=['post']
   - Define link_user method
   - Accept username, email, password (optional)
   - Call employee_service.link_user_account()
   - Return user details

8. **Add addresses action**
   - Use @action decorator with detail=True, methods=['get', 'post']
   - Define addresses method
   - GET: Return employee addresses
   - POST: Create new address
   - Use AddressSerializer

9. **Add emergency_contacts action**
   - Use @action decorator with detail=True, methods=['get', 'post']
   - Define emergency_contacts method
   - GET: Return emergency contacts
   - POST: Create new contact
   - Use EmergencyContactSerializer

10. **Add family_members action**
    - Use @action decorator with detail=True, methods=['get', 'post']
    - Define family_members method
    - GET: Return family members
    - POST: Create new family member
    - Use FamilyMemberSerializer

11. **Add documents action**
    - Use @action decorator with detail=True, methods=['get', 'post']
    - Define documents method
    - GET: Return employee documents
    - POST: Upload new document
    - Use DocumentSerializer

12. **Add bank_accounts action**
    - Use @action decorator with detail=True, methods=['get', 'post']
    - Define bank_accounts method
    - GET: Return bank accounts
    - POST: Add new bank account
    - Use BankAccountSerializer

13. **Add history action**
    - Use @action decorator with detail=True, methods=['get']
    - Define history method
    - Return employment history log
    - Include status changes, promotions, etc.

14. **Add permission_classes to actions**
    - Different permissions per action
    - terminate: HR or Admin only
    - activate/deactivate: HR or Admin
    - link_user: HR or Admin

15. **Add validation to actions**
    - Check current status before action
    - Validate required fields
    - Handle edge cases

16. **Add error handling**
    - Try-except blocks
    - Return appropriate error responses
    - Log errors

### Custom Actions Structure

```
┌─────────────────────────────────────────────────┐
│         EmployeeViewSet Custom Actions          │
├─────────────────────────────────────────────────┤
│ Lifecycle Actions:                              │
│  • POST /employees/{id}/activate/               │
│  • POST /employees/{id}/deactivate/             │
│  • POST /employees/{id}/terminate/              │
│  • POST /employees/{id}/resign/                 │
│                                                 │
│ Account Management:                             │
│  • POST /employees/{id}/link_user/              │
│                                                 │
│ Related Resources:                              │
│  • GET/POST /employees/{id}/addresses/          │
│  • GET/POST /employees/{id}/emergency_contacts/ │
│  • GET/POST /employees/{id}/family_members/     │
│  • GET/POST /employees/{id}/documents/          │
│  • GET/POST /employees/{id}/bank_accounts/      │
│                                                 │
│ Information:                                    │
│  • GET /employees/{id}/history/                 │
└─────────────────────────────────────────────────┘
```

### Action Request/Response Examples

#### Activate Employee
```
POST /api/v1/employees/{id}/activate/
{
  "effective_date": "2026-01-24"
}

Response 200:
{
  "success": true,
  "message": "Employee activated successfully",
  "employee": {
    "id": "uuid",
    "employee_id": "EMP-0001",
    "status": "ACTIVE",
    ...
  }
}
```

#### Deactivate Employee
```
POST /api/v1/employees/{id}/deactivate/
{
  "reason": "Temporary leave",
  "effective_date": "2026-01-24"
}

Response 200:
{
  "success": true,
  "message": "Employee deactivated successfully",
  "employee": {
    "id": "uuid",
    "status": "INACTIVE",
    ...
  }
}
```

#### Terminate Employee
```
POST /api/v1/employees/{id}/terminate/
{
  "termination_date": "2026-01-31",
  "reason": "Position eliminated",
  "termination_type": "COMPANY_INITIATED",
  "notice_served": true,
  "final_settlement_due": "2026-02-15"
}

Response 200:
{
  "success": true,
  "message": "Employee terminated successfully",
  "employee": {
    "id": "uuid",
    "status": "TERMINATED",
    "termination_date": "2026-01-31",
    ...
  }
}
```

#### Record Resignation
```
POST /api/v1/employees/{id}/resign/
{
  "resignation_date": "2026-01-15",
  "last_working_date": "2026-02-15",
  "reason": "Better opportunity",
  "notice_period_served": 30
}

Response 200:
{
  "success": true,
  "message": "Resignation recorded successfully",
  "employee": {
    "id": "uuid",
    "status": "RESIGNED",
    "resignation_date": "2026-01-15",
    "last_working_date": "2026-02-15",
    ...
  }
}
```

#### Link User Account
```
POST /api/v1/employees/{id}/link_user/
{
  "username": "nuwan.fernando",
  "email": "nuwan.fernando@company.lk",
  "password": "SecurePass123!",
  "create_new": true
}

Response 200:
{
  "success": true,
  "message": "User account linked successfully",
  "user": {
    "id": "user-uuid",
    "username": "nuwan.fernando",
    "email": "nuwan.fernando@company.lk"
  },
  "employee": {
    "id": "uuid",
    "user": {...}
  }
}
```

### Action Permission Matrix

| Action | Employee | Manager | HR | Admin |
|--------|----------|---------|----|----|
| activate | No | No | Yes | Yes |
| deactivate | No | No | Yes | Yes |
| terminate | No | No | Yes | Yes |
| resign | Self | No | Yes | Yes |
| link_user | No | No | Yes | Yes |
| addresses | Self | Team | All | All |
| emergency_contacts | Self | No | All | All |
| documents | Self | Limited | All | All |
| bank_accounts | Self | No | All | All |
| history | Self | Team | All | All |

### Status Transition Validation

```
Valid Status Transitions
════════════════════════

ACTIVE:
  → INACTIVE (deactivate)
  → ON_LEAVE (system)
  → TERMINATED (terminate)
  → RESIGNED (resign)

INACTIVE:
  → ACTIVE (activate)
  → TERMINATED (terminate)

ON_LEAVE:
  → ACTIVE (return from leave)

TERMINATED:
  → No transitions (final)

RESIGNED:
  → No transitions (final)

PROBATION:
  → ACTIVE (confirm)
  → TERMINATED (fail probation)
```

### Expected Outcome
- Custom actions implemented
- Lifecycle management working
- Nested resource actions available
- Proper permission enforcement
- Validation and error handling

### Verification Checklist
- [ ] activate action added
- [ ] deactivate action added
- [ ] terminate action added
- [ ] resign action added
- [ ] link_user action added
- [ ] addresses action added
- [ ] emergency_contacts action added
- [ ] family_members action added
- [ ] documents action added
- [ ] bank_accounts action added
- [ ] history action added
- [ ] Permission classes set per action
- [ ] Validation implemented
- [ ] Error handling added
- [ ] All actions tested

---

## Summary

This document established the API layer for employee management:

### Completed Components
- ✅ EmployeeSerializer with nested objects
- ✅ AddressSerializer for Sri Lankan addresses
- ✅ EmergencyContactSerializer with validation
- ✅ DocumentSerializer with file handling
- ✅ BankAccountSerializer with masking
- ✅ EmployeeViewSet with CRUD operations
- ✅ Comprehensive filtering system
- ✅ Custom lifecycle actions

### Key Achievements
1. **Complete API Coverage** - All employee operations available via API
2. **Nested Serialization** - Related objects included in responses
3. **Security** - Account number masking, permission controls
4. **Sri Lankan Context** - Address formats, banks, phone validation
5. **Filtering** - Comprehensive search and filter capabilities
6. **Lifecycle Management** - Activate, deactivate, terminate, resign actions
7. **Tenant Isolation** - All operations tenant-aware

### Next Steps
Proceed to [02_Tasks-89-92_Document-ViewSet-URLs-Tests-Docs.md](02_Tasks-89-92_Document-ViewSet-URLs-Tests-Docs.md) to implement DocumentViewSet, register URLs, create tests, and write module documentation.

---

**Document Status:** ✅ Complete  
**Total Tasks:** 8  
**Total Lines:** ~1390
