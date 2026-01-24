# Tasks 19-26: Email, Phone, and Address Information

> **Phase:** 06 - ERP Advanced Modules  
> **SubPhase:** 01 - Employee Management  
> **Group:** B - Personal & Contact Details  
> **Document:** 01 of 02  
> **Tasks Covered:** 19, 20, 21, 22, 23, 24, 25, 26

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-27-34_Emergency-Family.md](02_Tasks-27-34_Emergency-Family.md)

---

## Document Overview

This document covers the implementation of employee contact information, including email fields, phone number fields with Sri Lankan validation, and a separate address model for managing employee residential addresses. These elements enable proper communication channels and address tracking for employees.

### Tasks in This Document
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

---

## Task 19: Add Employee Email Field

### Overview
Add email fields to the Employee model to store work email and optional personal email addresses. The work email is required and serves as the primary communication channel, while the personal email is optional for backup contact purposes.

### Dependencies
- Employee model exists (`apps/employees/models/employee.py`)
- Group A tasks completed (Employee model created)

### Instructions

1. **Open employee.py model file**
   - Navigate to `apps/employees/models/employee.py`
   - Locate the Employee model class

2. **Add email field**
   - EmailField with max_length=255
   - Required field (no blank/null)
   - Unique within tenant scope
   - Used for system login and official communication
   - Label: "Work Email"
   - Help text: "Official work email address"

3. **Add personal_email field**
   - EmailField with max_length=255
   - Optional (blank=True, null=True)
   - Not unique (can be shared)
   - Used for emergency or personal communication
   - Label: "Personal Email"
   - Help text: "Personal email address (optional)"

4. **Add email validation**
   - Ensure email format is valid
   - Django EmailField handles basic validation
   - Consider adding custom validator for company domain if needed

5. **Update model docstring**
   - Document email field purposes
   - Note uniqueness requirement for work email

6. **Add email-related methods (optional)**
   - Consider adding `get_primary_email()` method
   - Consider adding `get_all_emails()` method for bulk communication

### Email Field Structure

```
┌────────────────────────────────────────────────┐
│            Employee Email Fields                │
├────────────────────────────────────────────────┤
│ Work Email:                                    │
│  • email (EmailField)                          │
│  • Required, unique per tenant                 │
│  • Used for login and official communication   │
│                                                │
│ Personal Email:                                │
│  • personal_email (EmailField)                 │
│  • Optional, not unique                        │
│  • Backup communication channel                │
└────────────────────────────────────────────────┘
```

### Email Usage Scenarios

| Email Type | Purpose | Examples |
|------------|---------|----------|
| Work Email | System login, official notices, payslips | john.doe@company.lk |
| Personal Email | Emergency contact, personal notices | john.personal@gmail.com |

### Email Validation Rules

```
Work Email Validation
═════════════════════
✓ Valid format: user@domain.tld
✓ Unique per tenant
✓ Required field
✓ Max length: 255 characters
✓ Lowercase storage recommended

Personal Email Validation
═════════════════════════
✓ Valid format: user@domain.tld
✓ Not unique (multiple employees can share)
✓ Optional field
✓ Max length: 255 characters
```

### Sri Lankan Email Examples

| Scenario | Work Email | Personal Email |
|----------|------------|----------------|
| Corporate | pradeep.silva@lankacommerce.lk | pradeep.s@gmail.com |
| SME | kasun@quickmart.lk | kasun123@yahoo.com |
| Retail | nimal.store@fashionplus.lk | nimal.retail@hotmail.com |
| Remote | remote.dev@techsolutions.lk | devguy@protonmail.com |

### Email Best Practices

1. **Work Email Standards**
   - Use firstname.lastname@domain.lk format
   - Maintain consistent naming convention
   - Assign work email during onboarding
   - Deactivate when employee leaves

2. **Personal Email Usage**
   - Collect during onboarding
   - Use for emergency notifications
   - Respect privacy (don't use for marketing)
   - Allow employee to update anytime

3. **Data Privacy**
   - Store emails securely
   - Don't share personal emails externally
   - Follow GDPR/data protection guidelines
   - Allow employee access to their data

### Expected Outcome
- Employee model has email fields
- Work email is required and unique
- Personal email is optional
- Proper email validation in place
- Clear distinction between work and personal email

### Verification Checklist
- [ ] email field added to Employee model
- [ ] email field is required (no blank/null)
- [ ] email field has unique constraint
- [ ] personal_email field added
- [ ] personal_email is optional (blank=True, null=True)
- [ ] Both fields use EmailField type
- [ ] Help text added to both fields
- [ ] Model docstring updated

---

## Task 20: Add Employee Phone Fields

### Overview
Add phone number fields to the Employee model to store various contact numbers including mobile phone, landline, and work phone. These fields support Sri Lankan phone number formats with proper country code handling.

### Dependencies
- Task 19: Add Employee Email Field
- Employee model exists

### Instructions

1. **Open employee.py model file**
   - Continue in `apps/employees/models/employee.py`
   - Locate the Employee model class

2. **Add mobile field**
   - CharField with max_length=20
   - Required field (no blank/null)
   - Primary contact number
   - Format: +94 XX XXX XXXX
   - Label: "Mobile Phone"
   - Help text: "Mobile number in +94 XX XXX XXXX format"

3. **Add phone field**
   - CharField with max_length=20
   - Optional (blank=True, null=True)
   - Home/landline number
   - Format: +94 XX XXX XXXX
   - Label: "Phone (Landline)"
   - Help text: "Home or landline number (optional)"

4. **Add work_phone field**
   - CharField with max_length=20
   - Optional (blank=True, null=True)
   - Direct work extension or office number
   - Format: +94 XX XXX XXXX or extension
   - Label: "Work Phone"
   - Help text: "Office phone or extension (optional)"

5. **Add phone_extension field**
   - CharField with max_length=10
   - Optional (blank=True, null=True)
   - Internal extension number
   - Label: "Extension"
   - Help text: "Internal phone extension"

6. **Plan for validator integration**
   - Note that validators will be added in Task 21
   - Fields will be updated to include validators
   - Prepare for future validation

7. **Update model docstring**
   - Document phone field purposes
   - Note Sri Lankan format requirements
   - List all phone field types

### Phone Field Structure

```
┌────────────────────────────────────────────────┐
│            Employee Phone Fields                │
├────────────────────────────────────────────────┤
│ Mobile Phone (Required):                       │
│  • mobile (CharField, 20)                      │
│  • Format: +94 7X XXX XXXX                     │
│  • Primary contact method                      │
│                                                │
│ Landline (Optional):                           │
│  • phone (CharField, 20)                       │
│  • Format: +94 XX XXX XXXX                     │
│  • Home or alternate number                    │
│                                                │
│ Work Phone (Optional):                         │
│  • work_phone (CharField, 20)                  │
│  • Format: +94 XX XXX XXXX or ext              │
│  • Office direct line                          │
│                                                │
│ Extension (Optional):                          │
│  • phone_extension (CharField, 10)             │
│  • Internal extension only                     │
└────────────────────────────────────────────────┘
```

### Sri Lankan Phone Number Format

```
Mobile Numbers
══════════════
Format: +94 7X XXX XXXX
Prefixes: 70, 71, 72, 74, 75, 76, 77, 78

Examples:
  +94 71 234 5678  (Dialog)
  +94 77 987 6543  (Dialog)
  +94 76 555 1234  (Hutch)
  +94 75 444 9876  (Airtel)
  +94 72 333 8765  (Mobitel)

Landline Numbers
════════════════
Format: +94 XX XXX XXXX
Area Codes:
  11 - Colombo
  21 - Kandy
  31 - Negombo
  41 - Matara
  47 - Kalutara
  52 - Nuwara Eliya
  81 - Anuradhapura
  91 - Jaffna

Examples:
  +94 11 234 5678  (Colombo)
  +94 21 222 3344  (Kandy)
  +94 81 567 8900  (Anuradhapura)
  +94 91 234 5678  (Jaffna)
```

### Phone Field Usage Matrix

| Field | Required | Format | Purpose | Example |
|-------|----------|--------|---------|---------|
| mobile | Yes | +94 7X XXX XXXX | Primary contact | +94 71 234 5678 |
| phone | No | +94 XX XXX XXXX | Home/landline | +94 11 234 5678 |
| work_phone | No | +94 XX XXX XXXX | Office line | +94 11 555 6677 |
| phone_extension | No | XXXX | Internal ext | 2405 |

### Phone Number Scenarios

#### Scenario 1: Basic Employee
```
Mobile: +94 71 234 5678     (Required)
Phone: -                     (Not provided)
Work Phone: -                (Not provided)
Extension: -                 (Not provided)
```

#### Scenario 2: Employee with Landline
```
Mobile: +94 76 555 1234     (Required)
Phone: +94 11 234 5678      (Home landline)
Work Phone: -                (Not provided)
Extension: -                 (Not provided)
```

#### Scenario 3: Office-Based Employee
```
Mobile: +94 77 987 6543     (Required)
Phone: +94 21 222 3344      (Home in Kandy)
Work Phone: +94 11 555 6677 (Office direct)
Extension: 2405              (Internal)
```

#### Scenario 4: Remote Employee
```
Mobile: +94 72 333 8765     (Required)
Phone: -                     (No landline)
Work Phone: -                (Works remotely)
Extension: -                 (Not applicable)
```

### Phone Number Storage Format

```
Storage Recommendation
══════════════════════
Format: +94 XX XXX XXXX (with spaces)

Benefits:
✓ Easy to read
✓ Consistent format
✓ International standard
✓ Copy-paste friendly

Alternative: +94XXXXXXXXX (no spaces)
✓ Database efficient
✓ Search friendly
⚠ Less readable
```

### Phone Field Validation (Preview)

Note: Full validation will be implemented in Task 21.

```
Validation Rules (To Be Implemented)
════════════════════════════════════
Mobile:
  ✓ Must start with +94 7X
  ✓ Total length: 14 chars (+94 XX XXX XXXX)
  ✓ Valid prefixes: 70-78
  
Landline:
  ✓ Must start with +94 XX (not 7X)
  ✓ Total length: 14 chars
  ✓ Valid area codes

Work Phone:
  ✓ Same as landline/mobile OR
  ✓ Extension format (digits only)
```

### Expected Outcome
- Employee model has phone fields
- Mobile is required, others optional
- Fields accommodate Sri Lankan formats
- Clear field purposes and labels
- Ready for validator integration

### Verification Checklist
- [ ] mobile field added (required)
- [ ] phone field added (optional)
- [ ] work_phone field added (optional)
- [ ] phone_extension field added (optional)
- [ ] All phone fields are CharField(20)
- [ ] Extension field is CharField(10)
- [ ] Help text added to all fields
- [ ] Labels are clear and descriptive
- [ ] Model docstring updated

---

## Task 21: Create Sri Lanka Phone Validator

### Overview
Create a custom validator for Sri Lankan phone numbers that validates mobile and landline formats according to Sri Lanka telecom standards. This validator ensures data quality and prevents invalid phone numbers from being stored.

### Dependencies
- Task 20: Add Employee Phone Fields
- Django validators framework

### Instructions

1. **Create validators directory**
   - Navigate to `apps/employees/` directory
   - Create new directory named `validators` if not exists
   - This will contain custom validators

2. **Create validators package initialization**
   - Create `__init__.py` in `validators/` directory
   - Will import validators for easy access

3. **Create phone_validator.py file**
   - Create file at `apps/employees/validators/phone_validator.py`
   - Import Django validation components
   - Import regular expressions module

4. **Import required modules**
   - Import `ValidationError` from django.core.exceptions
   - Import `RegexValidator` from django.core.validators
   - Import `re` module for pattern matching

5. **Define MOBILE_PREFIXES constant**
   - Tuple of valid mobile prefixes
   - Values: ('70', '71', '72', '74', '75', '76', '77', '78')
   - Used for mobile number validation

6. **Define AREA_CODES constant**
   - Tuple of valid landline area codes
   - Common codes: '11', '21', '31', '41', '47', '52', '81', '91'
   - Include all Sri Lankan area codes
   - Used for landline validation

7. **Create validate_sri_lanka_phone function**
   - Accept phone number as parameter
   - Validate format: +94 XX XXX XXXX
   - Return True if valid, raise ValidationError if invalid
   - Handle both mobile and landline formats

8. **Add mobile validation logic**
   - Check if number starts with +94 7X
   - Validate prefix against MOBILE_PREFIXES
   - Check total length
   - Validate digit placement

9. **Add landline validation logic**
   - Check if number starts with +94 (not 7X)
   - Validate area code against AREA_CODES
   - Check total length
   - Validate format

10. **Add format checking**
    - Accept formats with or without spaces
    - Normalize input for validation
    - Handle different spacing patterns
    - Example: "+94712345678" or "+94 71 234 5678"

11. **Create error messages**
    - Clear error message for invalid format
    - Specific message for invalid prefix
    - Example format in error message
    - User-friendly language

12. **Create SriLankaPhoneValidator class**
    - Inherit from object or RegexValidator
    - Callable validator class
    - Can be used in model field validators
    - Reusable across models

13. **Add class __call__ method**
    - Accept value parameter
    - Call validate_sri_lanka_phone function
    - Handle ValidationError appropriately

14. **Update validators/__init__.py**
    - Import validate_sri_lanka_phone
    - Import SriLankaPhoneValidator
    - Add to __all__ list
    - Enable easy imports

15. **Update employee.py to use validator**
    - Import validator from employees.validators
    - Add validators parameter to mobile field
    - Add validators parameter to phone field (if applicable)
    - Add validators parameter to work_phone field (if applicable)

16. **Add validator documentation**
    - Docstring explaining validator purpose
    - List valid formats
    - Provide usage examples
    - Note Sri Lankan telecom standards

### Validator Directory Structure

```
apps/employees/validators/
├── __init__.py                    # Package initialization
└── phone_validator.py             # Phone validation logic
```

### Phone Validation Logic Flow

```
┌─────────────────────────────────────────────┐
│         Phone Number Input                  │
│         "+94 71 234 5678"                   │
└─────────────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────────┐
│    Step 1: Normalize Format                 │
│    Remove spaces, keep +94                  │
│    Result: "+94712345678"                   │
└─────────────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────────┐
│    Step 2: Check Country Code               │
│    Must start with +94                      │
│    ✓ Pass or ✗ Fail                         │
└─────────────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────────┐
│    Step 3: Identify Type                    │
│    Check if mobile (7X) or landline         │
└─────────────────────────────────────────────┘
            │                    │
            ▼                    ▼
    ┌────────────┐      ┌────────────┐
    │   Mobile   │      │  Landline  │
    │  7X prefix │      │  Area code │
    └────────────┘      └────────────┘
            │                    │
            ▼                    ▼
┌─────────────────┐    ┌─────────────────┐
│ Validate prefix │    │ Validate area   │
│ against list    │    │ code list       │
└─────────────────┘    └─────────────────┘
            │                    │
            ▼                    ▼
┌─────────────────────────────────────────────┐
│    Step 4: Check Length                     │
│    Must be 12 digits (excluding +)          │
│    ✓ Pass or ✗ Fail                         │
└─────────────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────────┐
│    Step 5: Return Result                    │
│    ✓ Valid or ✗ ValidationError             │
└─────────────────────────────────────────────┘
```

### Validation Rules

```
Sri Lanka Mobile Number Validation
══════════════════════════════════
Pattern: +94 7X XXX XXXX

Rules:
✓ Must start with +94
✓ Followed by space (optional)
✓ Next digit must be 7
✓ Third digit must be 0-8 (valid prefix)
✓ Total of 9 digits after +94
✓ Valid prefixes: 70, 71, 72, 74, 75, 76, 77, 78

Valid Examples:
  ✓ +94 71 234 5678
  ✓ +94 77 987 6543
  ✓ +94712345678 (no spaces)
  ✓ +94 76 555 1234

Invalid Examples:
  ✗ 0712345678 (missing +94)
  ✗ +94 79 123 4567 (invalid prefix 79)
  ✗ +94 81 234 5678 (landline format for mobile)
  ✗ 94 71 234 5678 (missing +)

Sri Lanka Landline Number Validation
════════════════════════════════════
Pattern: +94 XX XXX XXXX

Rules:
✓ Must start with +94
✓ Followed by space (optional)
✓ Next two digits = area code
✓ Area code must NOT be 7X (that's mobile)
✓ Total of 9 digits after +94
✓ Valid area codes: 11, 21, 31, 41, 47, 52, 81, 91, etc.

Valid Examples:
  ✓ +94 11 234 5678 (Colombo)
  ✓ +94 21 222 3344 (Kandy)
  ✓ +94 81 567 8900 (Anuradhapura)
  ✓ +94112345678 (no spaces)

Invalid Examples:
  ✗ 0112345678 (missing +94)
  ✗ +94 71 234 5678 (mobile format for landline)
  ✗ +94 99 123 4567 (invalid area code)
  ✗ 94 11 234 5678 (missing +)
```

### Mobile Prefixes Reference

| Prefix | Operator | Type |
|--------|----------|------|
| 70 | Mobitel | Mobile |
| 71 | Dialog | Mobile |
| 72 | Hutch/Etisalat | Mobile |
| 74 | Dialog | Mobile |
| 75 | Airtel | Mobile |
| 76 | Dialog | Mobile |
| 77 | Dialog | Mobile |
| 78 | Hutch/Etisalat | Mobile |

### Landline Area Codes Reference

| Area Code | Region |
|-----------|--------|
| 11 | Colombo |
| 21 | Kandy |
| 31 | Negombo |
| 33 | Gampaha |
| 34 | Kelaniya |
| 36 | Avissawella |
| 38 | Panadura |
| 41 | Matara |
| 45 | Ratnapura |
| 47 | Kalutara |
| 52 | Nuwara Eliya |
| 54 | Nawalapitiya |
| 55 | Hatton |
| 57 | Bandarawela |
| 63 | Ampara |
| 65 | Batticaloa |
| 66 | Matale |
| 81 | Anuradhapura |
| 91 | Jaffna |

### Validator Usage Example (Preview)

```python
# In employee.py model

from employees.validators import validate_sri_lanka_phone

class Employee(TenantAwareMixin, TimestampMixin, models.Model):
    mobile = models.CharField(
        max_length=20,
        validators=[validate_sri_lanka_phone],
        help_text="Mobile number in +94 XX XXX XXXX format"
    )
```

### Error Messages

| Error Type | Message | Example |
|------------|---------|---------|
| Missing country code | "Phone number must start with +94" | "0712345678" |
| Invalid format | "Invalid Sri Lankan phone format. Use +94 XX XXX XXXX" | "+94 1234" |
| Invalid mobile prefix | "Invalid mobile prefix. Use 70-78 (excluding 73)" | "+94 79 123 4567" |
| Invalid length | "Phone number must be 12 digits (including +94)" | "+94 71 234 56" |
| Invalid area code | "Invalid area code for landline" | "+94 99 123 4567" |

### Expected Outcome
- Custom phone validator created
- Validates Sri Lankan mobile formats
- Validates Sri Lankan landline formats
- Clear error messages
- Reusable across application
- Employee phone fields use validator

### Verification Checklist
- [ ] validators/ directory created
- [ ] validators/__init__.py created
- [ ] phone_validator.py file created
- [ ] MOBILE_PREFIXES constant defined
- [ ] AREA_CODES constant defined
- [ ] validate_sri_lanka_phone function created
- [ ] Mobile validation logic implemented
- [ ] Landline validation logic implemented
- [ ] Format normalization handled
- [ ] SriLankaPhoneValidator class created
- [ ] __call__ method implemented
- [ ] Validator imported in __init__.py
- [ ] Employee model updated to use validator
- [ ] Error messages are clear
- [ ] Documentation added

---

## Task 22: Create EmployeeAddress Model

### Overview
Create a separate EmployeeAddress model to store employee residential and work addresses. This model uses a foreign key relationship to Employee, allowing multiple addresses per employee (permanent, temporary, work) with proper Sri Lankan address formatting.

### Dependencies
- Employee model exists
- Task 19-21 completed (contact information added)
- TenantAwareMixin and TimestampMixin available

### Instructions

1. **Create employee_address.py model file**
   - Create file at `apps/employees/models/employee_address.py`
   - Import necessary Django components
   - Import base model mixins

2. **Import required modules**
   - Import Django model fields
   - Import TenantAwareMixin
   - Import TimestampMixin
   - Import Employee model
   - Import gettext_lazy for translations

3. **Define EmployeeAddress model class**
   - Inherit from TenantAwareMixin and TimestampMixin
   - Add model docstring explaining purpose
   - Note: Allows multiple addresses per employee

4. **Add employee foreign key**
   - ForeignKey to Employee model
   - on_delete=models.CASCADE (delete addresses when employee deleted)
   - related_name='addresses'
   - Allow accessing employee.addresses.all()

5. **Add model docstring**
   - Document purpose: Store employee addresses
   - Note support for multiple address types
   - List address types: PERMANENT, TEMPORARY, WORK
   - Explain Sri Lankan address format

6. **Add Meta class**
   - Set verbose_name to "Employee Address"
   - Set verbose_name_plural to "Employee Addresses"
   - Add ordering by ['employee', 'address_type']
   - Add index on (employee, address_type)
   - Add unique_together for (employee, address_type) if one per type

7. **Add __str__ method**
   - Return string showing employee and address type
   - Format: "Employee Name - Address Type"
   - Example: "John Doe - Permanent Address"

8. **Update models/__init__.py**
   - Import EmployeeAddress model
   - Add to __all__ list
   - Enable easy imports

### EmployeeAddress Model Structure

```
┌────────────────────────────────────────────────┐
│           EmployeeAddress Model                 │
├────────────────────────────────────────────────┤
│ Relationship:                                  │
│  • employee (ForeignKey to Employee)           │
│                                                │
│ Core Fields (to be added in Task 23):         │
│  • line1 (CharField)                           │
│  • line2 (CharField, optional)                 │
│  • city (CharField)                            │
│  • postal_code (CharField)                     │
│                                                │
│ Location Fields (to be added in Task 24):     │
│  • province (CharField with choices)           │
│  • district (CharField)                        │
│                                                │
│ Classification (to be added in Task 25):      │
│  • address_type (CharField with choices)       │
│  • is_primary (BooleanField)                   │
│                                                │
│ Inherited from TenantAwareMixin:               │
│  • tenant (ForeignKey)                         │
│                                                │
│ Inherited from TimestampMixin:                 │
│  • created_at (DateTimeField)                  │
│  • updated_at (DateTimeField)                  │
└────────────────────────────────────────────────┘
```

### Model Relationships

```
┌────────────────┐         1:N          ┌──────────────────────┐
│    Employee    │◄─────────────────────│  EmployeeAddress     │
│                │                      │                      │
│ • id           │                      │ • employee_id (FK)   │
│ • first_name   │                      │ • address_type       │
│ • last_name    │                      │ • line1, line2       │
│ • nic_number   │                      │ • city, province     │
└────────────────┘                      └──────────────────────┘

One employee can have multiple addresses:
  • One permanent address
  • One or more temporary addresses
  • One or more work addresses
```

### Address Relationship Examples

#### Example 1: Employee with One Address
```
Employee: John Doe
└── Permanent Address
    ├── No. 123, Galle Road
    ├── Colombo 03
    └── Western Province
```

#### Example 2: Employee with Multiple Addresses
```
Employee: Priya Fernando
├── Permanent Address
│   ├── 45/2, Temple Road
│   ├── Kandy
│   └── Central Province
│
├── Temporary Address
│   ├── Apt 5B, Lake View
│   ├── Colombo 07
│   └── Western Province
│
└── Work Address
    ├── 100, Office Complex
    ├── Colombo 01
    └── Western Province
```

#### Example 3: Remote Employee
```
Employee: Kasun Perera
├── Permanent Address
│   ├── 78, Sea View
│   ├── Matara
│   └── Southern Province
│
└── Work Address (Same as permanent)
    └── [Not applicable - remote worker]
```

### Address Types Overview (Preview for Task 25)

| Address Type | Purpose | Required | Usage |
|-------------|---------|----------|-------|
| PERMANENT | Legal address, NIC address | Yes | Official correspondence |
| TEMPORARY | Current residence | Optional | Current contact location |
| WORK | Office/branch location | Optional | Work-related mail |

### Sri Lankan Address Format

```
Standard Sri Lankan Address Format
══════════════════════════════════

Line 1: House/Building Number and Street
Line 2: Area/Suburb (optional)
City: City or Town name
District: Administrative district
Province: One of 9 provinces
Postal Code: 5-digit code

Example 1: Colombo Residence
────────────────────────────
123, Galle Road
Bambalapitiya
Colombo 04
Colombo District
Western Province
Postal Code: 00400

Example 2: Kandy Residence
──────────────────────────
45/2, Temple Road
Kandy
Kandy District
Central Province
Postal Code: 20000

Example 3: Rural Address
────────────────────────
"Green Valley"
Nawalapitiya Road
Hatton
Nuwara Eliya District
Central Province
Postal Code: 22000
```

### Address Storage Benefits

```
Separate Address Model Benefits
═══════════════════════════════

✓ Multiple Addresses
  - Permanent residence
  - Temporary accommodation
  - Work location

✓ Address History
  - Track address changes
  - Audit trail via timestamps

✓ Data Organization
  - Clean data structure
  - Easy to query
  - No null fields in Employee model

✓ Flexibility
  - Add/remove addresses
  - Update independently
  - No schema changes to Employee

✓ Reporting
  - Employee location analysis
  - Province/district distribution
  - Postal code grouping
```

### Database Schema (Preview)

```
employees_employee                employees_employee_address
├── id (PK)                      ├── id (PK)
├── tenant_id (FK)              ├── tenant_id (FK)
├── employee_number             ├── employee_id (FK) ──┐
├── first_name                  ├── address_type       │
├── last_name                   ├── line1              │
├── nic_number                  ├── line2              │
├── email                       ├── city               │
├── mobile                      ├── postal_code        │
└── ...                         ├── province           │
                                ├── district           │
                                ├── is_primary         │
       ┌────────────────────────┘
       │
       │ Relationship:
       │ One Employee → Many Addresses
       └─ employee.addresses.all()
```

### Expected Outcome
- EmployeeAddress model created
- Foreign key to Employee established
- Model inherits tenant awareness and timestamps
- Foundation for address fields
- Related name allows easy access

### Verification Checklist
- [ ] employee_address.py file created
- [ ] Required modules imported
- [ ] EmployeeAddress class defined
- [ ] Inherits from TenantAwareMixin
- [ ] Inherits from TimestampMixin
- [ ] employee ForeignKey added
- [ ] on_delete=models.CASCADE set
- [ ] related_name='addresses' set
- [ ] Model docstring added
- [ ] Meta class defined
- [ ] verbose_name set
- [ ] __str__ method implemented
- [ ] Model imported in __init__.py

---

## Task 23: Add Address Core Fields

### Overview
Add core address fields to the EmployeeAddress model, including address lines, city, and postal code. These fields store the basic components of a Sri Lankan address in a structured format.

### Dependencies
- Task 22: Create EmployeeAddress Model

### Instructions

1. **Open employee_address.py model file**
   - Navigate to `apps/employees/models/employee_address.py`
   - Locate EmployeeAddress model class

2. **Add line1 field**
   - CharField with max_length=255
   - Required field (no blank/null)
   - First line of address (street, house number)
   - Label: "Address Line 1"
   - Help text: "House/building number and street name"

3. **Add line2 field**
   - CharField with max_length=255
   - Optional (blank=True, null=True)
   - Second line of address (area, suburb)
   - Label: "Address Line 2"
   - Help text: "Area, suburb, or additional address details (optional)"

4. **Add city field**
   - CharField with max_length=100
   - Required field (no blank/null)
   - City or town name
   - Label: "City/Town"
   - Help text: "City or town name"

5. **Add postal_code field**
   - CharField with max_length=10
   - Required field (no blank/null)
   - 5-digit Sri Lankan postal code
   - Label: "Postal Code"
   - Help text: "5-digit postal code"

6. **Update model docstring**
   - Document address field structure
   - Note Sri Lankan address format
   - List all core address fields

### Address Core Fields Structure

```
┌────────────────────────────────────────────────┐
│           Address Core Fields                   │
├────────────────────────────────────────────────┤
│ Address Lines:                                 │
│  • line1 (CharField, 255) - Required           │
│    Examples: "123, Galle Road"                 │
│              "45/2, Temple Road"               │
│              "Unit 5B, Lake View Apartments"   │
│                                                │
│  • line2 (CharField, 255) - Optional           │
│    Examples: "Bambalapitiya"                   │
│              "Near Central Market"             │
│              "Behind Post Office"              │
│                                                │
│ Location:                                      │
│  • city (CharField, 100) - Required            │
│    Examples: "Colombo", "Kandy", "Galle"       │
│                                                │
│  • postal_code (CharField, 10) - Required      │
│    Examples: "00400", "20000", "80000"         │
└────────────────────────────────────────────────┘
```

### Sri Lankan Address Examples

#### Example 1: Urban Residential Address
```
line1: 123, Galle Road
line2: Bambalapitiya
city: Colombo 04
postal_code: 00400

Full Address:
123, Galle Road
Bambalapitiya
Colombo 04
00400
```

#### Example 2: Rural Address with Property Name
```
line1: "Green Valley", Nawalapitiya Road
line2: (empty)
city: Hatton
postal_code: 22000

Full Address:
"Green Valley", Nawalapitiya Road
Hatton
22000
```

#### Example 3: Apartment Address
```
line1: Apartment 5B, Lake View Residencies
line2: 321, Braybrooke Place
city: Colombo 02
postal_code: 00200

Full Address:
Apartment 5B, Lake View Residencies
321, Braybrooke Place
Colombo 02
00200
```

#### Example 4: Office Address
```
line1: 10th Floor, World Trade Center
line2: Echelon Square
city: Colombo 01
postal_code: 00100

Full Address:
10th Floor, World Trade Center
Echelon Square
Colombo 01
00100
```

### Address Line Guidelines

```
Line 1 (Required) - Primary Address
════════════════════════════════════
Contents:
✓ House/building number
✓ Street name
✓ Apartment/unit number
✓ Building name (if applicable)

Examples:
  • "123, Galle Road"
  • "45/2, Temple Road"
  • "Unit 5B, Lake View"
  • "No. 78, Main Street"

Line 2 (Optional) - Secondary Details
═════════════════════════════════════
Contents:
✓ Area/suburb name
✓ Landmark references
✓ Additional building details
✓ Compound/complex name

Examples:
  • "Bambalapitiya"
  • "Near Police Station"
  • "Behind Central Hospital"
  • "Palm Grove Estate"
```

### Postal Code Format

```
Sri Lankan Postal Codes
═══════════════════════
Format: XXXXX (5 digits)

Structure:
  • First 2 digits: Main postal region
  • Last 3 digits: Specific area

Major Postal Codes:
┌───────────┬─────────────┬──────────┐
│ City      │ Area        │ Code     │
├───────────┼─────────────┼──────────┤
│ Colombo   │ Fort        │ 00100    │
│ Colombo   │ Slave Isl.  │ 00200    │
│ Colombo   │ Colpetty    │ 00300    │
│ Colombo   │ Bambalapiti │ 00400    │
│ Colombo   │ Havelock T. │ 00500    │
│ Colombo   │ Wellawatte  │ 00600    │
│ Colombo   │ Dehiwala    │ 10350    │
│ Kandy     │ City        │ 20000    │
│ Galle     │ City        │ 80000    │
│ Jaffna    │ City        │ 40000    │
│ Matara    │ City        │ 81000    │
│ Negombo   │ City        │ 11500    │
└───────────┴─────────────┴──────────┘
```

### Address Field Validation

```
Field Validation Rules
══════════════════════

line1:
✓ Required (cannot be empty)
✓ Max length: 255 characters
✓ Should contain house/street info
⚠ Should not contain city or postal code

line2:
✓ Optional (can be empty)
✓ Max length: 255 characters
✓ Additional address details
⚠ Not for province/district

city:
✓ Required (cannot be empty)
✓ Max length: 100 characters
✓ City or town name only
✓ Can include area code (e.g., "Colombo 04")

postal_code:
✓ Required (cannot be empty)
✓ Max length: 10 characters
✓ Should be 5 digits for Sri Lanka
✓ Validate against known postal codes
```

### Address Display Formats

#### Format 1: Full Address
```
123, Galle Road
Bambalapitiya
Colombo 04
Western Province
Colombo District
00400
```

#### Format 2: Compact Address
```
123, Galle Road, Bambalapitiya, Colombo 04 - 00400
```

#### Format 3: Mailing Label
```
Mr. John Doe
123, Galle Road
Bambalapitiya
Colombo 04
00400
Sri Lanka
```

### Address Data Entry Tips

```
Best Practices for Address Entry
═════════════════════════════════

1. Use Proper Capitalization
   ✓ "Galle Road" not "galle road"
   ✓ "Colombo" not "COLOMBO"

2. Include Proper Punctuation
   ✓ "45/2, Temple Road" (use comma)
   ✓ 'No. 123' or '123' (consistent format)

3. Avoid Abbreviations (when possible)
   ✓ "Road" not "Rd"
   ✓ "Street" not "St"
   ⚠ Exception: "No." for Number is acceptable

4. Be Specific
   ✓ "Behind Central Hospital" (specific)
   ✗ "Near hospital" (too vague)

5. Consistent Format
   ✓ Use same format across all addresses
   ✓ Maintain organizational standards
```

### Expected Outcome
- EmployeeAddress has core address fields
- line1 and line2 for address lines
- city field for location
- postal_code for postal identification
- Fields support Sri Lankan address formats
- Proper validation and constraints

### Verification Checklist
- [ ] line1 field added (required)
- [ ] line2 field added (optional)
- [ ] city field added (required)
- [ ] postal_code field added (required)
- [ ] Max lengths appropriate for Sri Lankan addresses
- [ ] Help text added to all fields
- [ ] Labels are clear
- [ ] Model docstring updated

---

## Task 24: Add Address Province/District

### Overview
Add province and district fields to the EmployeeAddress model to categorize addresses by Sri Lankan administrative divisions. This enables location-based filtering, reporting, and compliance with local address standards.

### Dependencies
- Task 23: Add Address Core Fields

### Instructions

1. **Open employee_address.py model file**
   - Continue in `apps/employees/models/employee_address.py`
   - Locate EmployeeAddress model class

2. **Define PROVINCE_CHOICES constant**
   - Create tuple of Sri Lankan provinces
   - Use province codes as values
   - Include all 9 provinces
   - Format: (code, display_name)

3. **Add province field**
   - CharField with choices from PROVINCE_CHOICES
   - Max length 50
   - Required field (no blank/null)
   - Label: "Province"
   - Help text: "Province of residence"

4. **Add district field**
   - CharField with max_length=100
   - Required field (no blank/null)
   - Free text field (not choices due to 25 districts)
   - Label: "District"
   - Help text: "District within the province"

5. **Update model docstring**
   - Document province and district fields
   - Note Sri Lankan administrative structure
   - List all provinces

6. **Consider adding district validation**
   - Optional: Create validator for districts
   - Validate district belongs to selected province
   - Can be future enhancement

### Province and District Structure

```
┌────────────────────────────────────────────────┐
│        Sri Lankan Administrative Fields         │
├────────────────────────────────────────────────┤
│ Province (Required):                           │
│  • province (CharField with choices)           │
│  • 9 provinces in Sri Lanka                    │
│  • Dropdown selection                          │
│                                                │
│ District (Required):                           │
│  • district (CharField)                        │
│  • 25 districts in Sri Lanka                   │
│  • Free text entry                             │
│  • Should match selected province              │
└────────────────────────────────────────────────┘
```

### Sri Lankan Provinces

```
PROVINCE_CHOICES = (
    ('WP', 'Western Province'),
    ('CP', 'Central Province'),
    ('SP', 'Southern Province'),
    ('NP', 'Northern Province'),
    ('EP', 'Eastern Province'),
    ('NW', 'North Western Province'),
    ('NC', 'North Central Province'),
    ('UV', 'Uva Province'),
    ('SB', 'Sabaragamuwa Province'),
)
```

### Province Details

| Code | Province | Capital | Districts |
|------|----------|---------|-----------|
| WP | Western Province | Colombo | 3 districts |
| CP | Central Province | Kandy | 3 districts |
| SP | Southern Province | Galle | 3 districts |
| NP | Northern Province | Jaffna | 5 districts |
| EP | Eastern Province | Trincomalee | 3 districts |
| NW | North Western Province | Kurunegala | 2 districts |
| NC | North Central Province | Anuradhapura | 2 districts |
| UV | Uva Province | Badulla | 2 districts |
| SB | Sabaragamuwa Province | Ratnapura | 2 districts |

### Districts by Province

#### Western Province (WP)
```
Districts:
  1. Colombo
  2. Gampaha
  3. Kalutara

Major Cities:
  • Colombo (Colombo District)
  • Negombo (Gampaha District)
  • Kalutara (Kalutara District)
```

#### Central Province (CP)
```
Districts:
  1. Kandy
  2. Matale
  3. Nuwara Eliya

Major Cities:
  • Kandy (Kandy District)
  • Matale (Matale District)
  • Nuwara Eliya (Nuwara Eliya District)
```

#### Southern Province (SP)
```
Districts:
  1. Galle
  2. Matara
  3. Hambantota

Major Cities:
  • Galle (Galle District)
  • Matara (Matara District)
  • Hambantota (Hambantota District)
```

#### Northern Province (NP)
```
Districts:
  1. Jaffna
  2. Kilinochchi
  3. Mannar
  4. Vavuniya
  5. Mullaitivu

Major Cities:
  • Jaffna (Jaffna District)
  • Vavuniya (Vavuniya District)
```

#### Eastern Province (EP)
```
Districts:
  1. Batticaloa
  2. Ampara
  3. Trincomalee

Major Cities:
  • Trincomalee (Trincomalee District)
  • Batticaloa (Batticaloa District)
  • Ampara (Ampara District)
```

#### North Western Province (NW)
```
Districts:
  1. Kurunegala
  2. Puttalam

Major Cities:
  • Kurunegala (Kurunegala District)
  • Puttalam (Puttalam District)
  • Chilaw (Puttalam District)
```

#### North Central Province (NC)
```
Districts:
  1. Anuradhapura
  2. Polonnaruwa

Major Cities:
  • Anuradhapura (Anuradhapura District)
  • Polonnaruwa (Polonnaruwa District)
```

#### Uva Province (UV)
```
Districts:
  1. Badulla
  2. Monaragala

Major Cities:
  • Badulla (Badulla District)
  • Monaragala (Monaragala District)
  • Bandarawela (Badulla District)
```

#### Sabaragamuwa Province (SB)
```
Districts:
  1. Ratnapura
  2. Kegalle

Major Cities:
  • Ratnapura (Ratnapura District)
  • Kegalle (Kegalle District)
```

### Complete Address Example

```
Full Address with Province/District
═══════════════════════════════════

Address Line 1: 123, Galle Road
Address Line 2: Bambalapitiya
City: Colombo 04
District: Colombo
Province: Western Province (WP)
Postal Code: 00400

Visual Representation:
┌─────────────────────────────────┐
│ 123, Galle Road                 │
│ Bambalapitiya                   │
│ Colombo 04                      │
│ Colombo District                │
│ Western Province                │
│ 00400                           │
└─────────────────────────────────┘
```

### Province/District Validation

```
Validation Considerations
═════════════════════════

Current Implementation:
✓ Province: Dropdown (choices field)
✓ District: Free text entry

Future Enhancement Option:
┌──────────────────────────────────────┐
│ Create district validator function   │
│                                      │
│ def validate_district_province():    │
│     Check if district belongs to     │
│     the selected province            │
│                                      │
│ Benefits:                            │
│  ✓ Data consistency                  │
│  ✓ Prevent mismatches                │
│  ✓ Better reporting                  │
└──────────────────────────────────────┘
```

### Province/District Usage Scenarios

#### Scenario 1: Employee Location Analysis
```
Query: How many employees in Western Province?
Result: Group by province, count employees

Query: Employees in Colombo District?
Result: Filter by district = "Colombo"
```

#### Scenario 2: Regional Reporting
```
Report: Employee Distribution by Province
┌────────────────┬───────────┐
│ Province       │ Count     │
├────────────────┼───────────┤
│ Western (WP)   │ 145       │
│ Central (CP)   │ 67        │
│ Southern (SP)  │ 43        │
│ Others         │ 25        │
└────────────────┴───────────┘
```

#### Scenario 3: Allowance Calculation
```
Business Rule: Location Allowance

If province == "WP" and district == "Colombo":
    allowance = base * 1.2  (20% extra)
    
If province == "CP" and district == "Kandy":
    allowance = base * 1.1  (10% extra)
    
Else:
    allowance = base
```

### Address Hierarchy

```
Sri Lankan Address Hierarchy
═══════════════════════════

Country: Sri Lanka
    │
    ├─ Province (9 provinces)
    │   │
    │   ├─ District (25 districts)
    │   │   │
    │   │   ├─ City/Town
    │   │   │   │
    │   │   │   ├─ Postal Area (postal code)
    │   │   │   │   │
    │   │   │   │   ├─ Street/Road
    │   │   │   │   │   │
    │   │   │   │   │   └─ House/Building Number

Example Path:
Sri Lanka → Western Province → Colombo District 
    → Colombo 04 → 00400 → Galle Road → No. 123
```

### Expected Outcome
- Province field with dropdown choices
- District field for free text entry
- Support for all 9 Sri Lankan provinces
- Enables location-based filtering
- Foundation for regional reporting

### Verification Checklist
- [ ] PROVINCE_CHOICES constant defined
- [ ] All 9 provinces included
- [ ] Province codes (WP, CP, etc.) used as values
- [ ] province field added with choices
- [ ] district field added as CharField
- [ ] Both fields are required
- [ ] Help text added to fields
- [ ] Model docstring updated
- [ ] Consider future district validation

---

## Task 25: Add Address Type Field

### Overview
Add address type classification to the EmployeeAddress model to distinguish between permanent, temporary, and work addresses. This allows employees to maintain multiple addresses for different purposes and designate a primary address.

### Dependencies
- Task 24: Add Address Province/District

### Instructions

1. **Open employee_address.py model file**
   - Continue in `apps/employees/models/employee_address.py`
   - Locate EmployeeAddress model class

2. **Define ADDRESS_TYPE_CHOICES constant**
   - Create tuple of address type choices
   - Include: PERMANENT, TEMPORARY, WORK
   - Format: (value, display_name)

3. **Add address_type field**
   - CharField with choices from ADDRESS_TYPE_CHOICES
   - Max length 20
   - Default to 'permanent'
   - Required field (no blank/null)
   - Label: "Address Type"
   - Help text: "Type of address (Permanent, Temporary, or Work)"

4. **Add is_primary field**
   - BooleanField, default=False
   - Indicates primary address for communication
   - Only one primary address per employee recommended
   - Label: "Primary Address"
   - Help text: "Mark as primary address for official communication"

5. **Add notes field**
   - TextField
   - Optional (blank=True, null=True)
   - Additional address information
   - Label: "Notes"
   - Help text: "Additional information about this address (optional)"

6. **Update Meta class**
   - Add unique_together constraint
   - Consider: (employee, address_type) if limiting one per type
   - Or allow multiple addresses of same type

7. **Update __str__ method**
   - Include address type in string representation
   - Format: "Employee Name - Address Type"
   - Example: "John Doe - Permanent Address"

8. **Update model docstring**
   - Document address types
   - Explain primary address concept
   - Note usage scenarios

### Address Type Structure

```
┌────────────────────────────────────────────────┐
│           Address Type Fields                   │
├────────────────────────────────────────────────┤
│ Classification:                                │
│  • address_type (CharField with choices)       │
│    Options: PERMANENT, TEMPORARY, WORK         │
│                                                │
│ Priority:                                      │
│  • is_primary (BooleanField)                   │
│    True = primary communication address        │
│    False = alternate address                   │
│                                                │
│ Additional Info:                               │
│  • notes (TextField, optional)                 │
│    Free text for address details               │
└────────────────────────────────────────────────┘
```

### Address Type Choices

```python
ADDRESS_TYPE_CHOICES = (
    ('permanent', 'Permanent Address'),
    ('temporary', 'Temporary Address'),
    ('work', 'Work Address'),
)
```

### Address Type Details

| Type | Code | Purpose | Usage |
|------|------|---------|-------|
| Permanent | 'permanent' | Legal residence, NIC address | Official documents, legal correspondence |
| Temporary | 'temporary' | Current residence if different | Day-to-day communication, parcels |
| Work | 'work' | Office/branch location | Work-related mail, visitors |

### Address Type Use Cases

#### Use Case 1: Local Employee
```
Employee: Pradeep Silva

Permanent Address (Primary)
├── Type: PERMANENT
├── Primary: YES
├── 123, Temple Road
├── Kandy
└── Used for: Official docs, payslip, legal notices

Work Address
├── Type: WORK
├── Primary: NO
├── 10th Floor, Office Complex
├── Colombo 01
└── Used for: Work mail, visitors
```

#### Use Case 2: Relocated Employee
```
Employee: Nimal Fernando

Permanent Address (Not Primary)
├── Type: PERMANENT
├── Primary: NO
├── 45, Sea View
├── Galle
└── Used for: Legal address, NIC address

Temporary Address (Primary)
├── Type: TEMPORARY
├── Primary: YES
├── Apartment 3B, City Tower
├── Colombo 07
└── Used for: Current communication, parcels

Work Address
├── Type: WORK
├── Primary: NO
├── Branch Office, Main Street
├── Colombo 03
└── Used for: Office location
```

#### Use Case 3: Remote Worker
```
Employee: Kasun Perera

Permanent Address (Primary)
├── Type: PERMANENT
├── Primary: YES
├── 78, Lake Road
├── Kurunegala
└── Used for: All communication (works from home)

Note: No separate work address (remote worker)
```

#### Use Case 4: Temporary Assignment
```
Employee: Priya Jayawardena

Permanent Address
├── Type: PERMANENT
├── Primary: NO
├── 321, Main Road
├── Jaffna
└── Home address

Temporary Address (Primary)
├── Type: TEMPORARY
├── Primary: YES
├── Hotel Residence, Room 405
├── Colombo 03
├── Notes: "6-month project assignment in Colombo"
└── Used for: Duration of project

Work Address
├── Type: WORK
├── Primary: NO
├── Project Site, Building B
├── Colombo 01
└── Project location
```

### Primary Address Logic

```
Primary Address Rules
═══════════════════════

Rule 1: One Primary Per Employee (Recommended)
┌──────────────────────────────────────┐
│ When setting an address as primary:  │
│  1. Unset other primary flags        │
│  2. Set selected address as primary  │
│  3. Update via save method           │
└──────────────────────────────────────┘

Rule 2: Primary Address Selection
┌──────────────────────────────────────┐
│ Priority Order:                       │
│  1. Address marked is_primary=True    │
│  2. If none, use Permanent address    │
│  3. If none, use first address        │
└──────────────────────────────────────┘

Rule 3: Address Type Priority (when no primary)
┌──────────────────────────────────────┐
│ 1. Permanent Address (default)        │
│ 2. Temporary Address                  │
│ 3. Work Address                       │
└──────────────────────────────────────┘
```

### Address Type Scenarios

#### Scenario A: Standard Employee
```
Addresses: 1 Permanent (Primary)
└── All communication to permanent address
```

#### Scenario B: Temporarily Relocated
```
Addresses: 
├── 1 Permanent (not primary)
└── 1 Temporary (Primary) ← Communication goes here
```

#### Scenario C: Multiple Locations
```
Addresses:
├── 1 Permanent (Primary) ← Official communication
├── 1 Temporary (not primary)
└── 1 Work (not primary)
```

### Address Type Validation

```
Validation Rules
════════════════

Address Type:
✓ Must be one of: permanent, temporary, work
✓ Required field (no null)
✓ Default: permanent

Primary Flag:
✓ Boolean field (True/False)
✓ Default: False
✓ Recommended: Only one primary per employee
⚠ System should enforce via save method

Notes:
✓ Optional field
✓ Free text (no length limit for TextField)
✓ Used for context: "Temporary relocation", "Project site"
```

### Address Notes Examples

```
Useful Notes Examples
═══════════════════════

Temporary Address:
  "6-month assignment in Colombo branch"
  "Rented apartment during project period"
  "Valid until December 2026"

Work Address:
  "Main branch office"
  "Use reception for deliveries"
  "Available Monday-Friday 9 AM - 5 PM"

Permanent Address:
  "Shared with parents"
  "Use WhatsApp before visit"
  "Gate code: 1234"
```

### Database Query Examples

```python
# Get employee's primary address
primary = employee.addresses.filter(is_primary=True).first()

# Get all permanent addresses
permanent_addrs = employee.addresses.filter(address_type='permanent')

# Get address for mailing
mailing_addr = (
    employee.addresses.filter(is_primary=True).first() or
    employee.addresses.filter(address_type='permanent').first() or
    employee.addresses.first()
)
```

### Expected Outcome
- Address type classification in place
- Support for permanent, temporary, work addresses
- Primary address designation
- Optional notes for context
- Flexible address management

### Verification Checklist
- [ ] ADDRESS_TYPE_CHOICES constant defined
- [ ] Three address types included
- [ ] address_type field added with choices
- [ ] Default set to 'permanent'
- [ ] is_primary field added
- [ ] is_primary defaults to False
- [ ] notes field added (optional)
- [ ] Meta class updated if needed
- [ ] __str__ method updated
- [ ] Model docstring updated
- [ ] Help text added to fields

---

## Task 26: Run EmployeeAddress Migrations

### Overview
Create and run Django migrations to apply the EmployeeAddress model and all its fields to the database. This task generates the migration file and applies it to create the employee_address table with all necessary columns and constraints.

### Dependencies
- Task 25: Add Address Type Field (all address model tasks completed)
- Django migrations framework
- Database connection configured

### Instructions

1. **Verify model is complete**
   - Open `apps/employees/models/employee_address.py`
   - Confirm all fields are present:
     - employee (ForeignKey)
     - line1, line2, city, postal_code
     - province, district
     - address_type, is_primary, notes
   - Confirm model is imported in `models/__init__.py`

2. **Create migration file**
   - Open terminal
   - Navigate to project root directory
   - Run makemigrations command
   - Command: `python manage.py makemigrations employees`
   - Django will detect the new EmployeeAddress model

3. **Review migration file**
   - Navigate to `apps/employees/migrations/`
   - Open the newly created migration file (e.g., `0002_employee_address.py`)
   - Review the migration operations
   - Confirm all fields are included
   - Check foreign key relationship to Employee

4. **Check migration plan**
   - Run: `python manage.py migrate employees --plan`
   - Review planned operations
   - Confirm no unexpected changes
   - Verify migration number sequence

5. **Run migration**
   - Execute: `python manage.py migrate employees`
   - Django will create the employee_address table
   - Apply all field definitions
   - Create indexes and constraints

6. **Verify migration success**
   - Check for "OK" message
   - Confirm no errors in output
   - Note the migration name for reference

7. **Verify database schema**
   - Option A: Use Django shell
     - Run: `python manage.py shell`
     - Import model: `from employees.models import EmployeeAddress`
     - Check fields: `EmployeeAddress._meta.get_fields()`
   - Option B: Use database client
     - Connect to PostgreSQL
     - Describe table: `\d employees_employee_address`
     - Verify columns exist

8. **Test model functionality**
   - Create test address instance (via Django shell or admin)
   - Verify foreign key relationship works
   - Test required/optional fields
   - Confirm validation works

9. **Document migration**
   - Note migration file name
   - Record any issues encountered
   - Update documentation if needed

### Migration Command Reference

```bash
# Create migration file
python manage.py makemigrations employees

# Show migration plan (dry run)
python manage.py migrate employees --plan

# Apply migrations
python manage.py migrate employees

# Show migration status
python manage.py showmigrations employees

# Reverse migration (if needed)
python manage.py migrate employees <previous_migration_name>
```

### Expected Migration File Structure

```python
# Generated file: apps/employees/migrations/0002_employee_address.py

from django.db import migrations, models
import django.db.models.deletion

class Migration(migrations.Migration):
    dependencies = [
        ('employees', '0001_initial'),
        ('tenants', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='EmployeeAddress',
            fields=[
                ('id', models.BigAutoField(primary_key=True)),
                ('line1', models.CharField(max_length=255)),
                ('line2', models.CharField(max_length=255, blank=True, null=True)),
                ('city', models.CharField(max_length=100)),
                ('postal_code', models.CharField(max_length=10)),
                ('province', models.CharField(max_length=50, choices=[...])),
                ('district', models.CharField(max_length=100)),
                ('address_type', models.CharField(max_length=20, choices=[...], default='permanent')),
                ('is_primary', models.BooleanField(default=False)),
                ('notes', models.TextField(blank=True, null=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('employee', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='addresses', to='employees.employee')),
                ('tenant', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='tenants.tenant')),
            ],
            options={
                'verbose_name': 'Employee Address',
                'verbose_name_plural': 'Employee Addresses',
                'ordering': ['employee', 'address_type'],
            },
        ),
    ]
```

### Database Schema Result

```sql
-- Table: employees_employee_address

CREATE TABLE employees_employee_address (
    id BIGSERIAL PRIMARY KEY,
    tenant_id BIGINT NOT NULL REFERENCES tenants_tenant(id),
    employee_id BIGINT NOT NULL REFERENCES employees_employee(id) ON DELETE CASCADE,
    line1 VARCHAR(255) NOT NULL,
    line2 VARCHAR(255),
    city VARCHAR(100) NOT NULL,
    postal_code VARCHAR(10) NOT NULL,
    province VARCHAR(50) NOT NULL,
    district VARCHAR(100) NOT NULL,
    address_type VARCHAR(20) NOT NULL DEFAULT 'permanent',
    is_primary BOOLEAN NOT NULL DEFAULT FALSE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL
);

-- Indexes
CREATE INDEX idx_employee_address_tenant ON employees_employee_address(tenant_id);
CREATE INDEX idx_employee_address_employee ON employees_employee_address(employee_id);
CREATE INDEX idx_employee_address_type ON employees_employee_address(employee_id, address_type);
```

### Migration Verification Checklist

```
Pre-Migration Checks
═══════════════════
[ ] All model fields defined
[ ] Model imported in __init__.py
[ ] No syntax errors in model file
[ ] Dependencies (Employee model) exist

During Migration
═══════════════
[ ] makemigrations runs successfully
[ ] Migration file generated
[ ] Migration file reviewed
[ ] No unexpected operations

Post-Migration Checks
════════════════════
[ ] migrate command successful
[ ] No errors in output
[ ] Table created in database
[ ] All columns present
[ ] Foreign keys established
[ ] Indexes created
[ ] Default values set
```

### Testing Address Creation

```python
# Django Shell Test

from employees.models import Employee, EmployeeAddress

# Get an employee
employee = Employee.objects.first()

# Create a permanent address
address = EmployeeAddress.objects.create(
    tenant=employee.tenant,
    employee=employee,
    address_type='permanent',
    line1='123, Galle Road',
    line2='Bambalapitiya',
    city='Colombo 04',
    postal_code='00400',
    province='WP',
    district='Colombo',
    is_primary=True
)

# Verify creation
print(address)
print(f"Employee: {address.employee}")
print(f"Type: {address.get_address_type_display()}")
print(f"Primary: {address.is_primary}")

# Access via related name
print(employee.addresses.all())
print(employee.addresses.count())
```

### Troubleshooting Common Issues

```
Issue 1: Migration Conflict
═══════════════════════════
Error: "Conflicting migrations detected"
Solution:
  1. Check for multiple migration files
  2. Merge migrations if needed
  3. Run: python manage.py migrate --merge

Issue 2: Missing Dependency
═══════════════════════════
Error: "No such table: employees_employee"
Solution:
  1. Ensure Employee model migrated first
  2. Check migration dependencies
  3. Run: python manage.py migrate employees

Issue 3: Database Connection
═══════════════════════════
Error: "Could not connect to database"
Solution:
  1. Check database settings
  2. Verify PostgreSQL is running
  3. Test connection manually

Issue 4: Permission Error
═════════════════════════
Error: "Permission denied"
Solution:
  1. Check database user permissions
  2. Grant necessary privileges
  3. Verify user can create tables
```

### Expected Outcome
- Migration file created successfully
- Database table created with all fields
- Foreign key relationship established
- Indexes and constraints applied
- Model ready for use in application
- Address data can be stored and retrieved

### Verification Checklist
- [ ] makemigrations command run
- [ ] Migration file created
- [ ] Migration file reviewed
- [ ] migrate command run successfully
- [ ] No errors in migration output
- [ ] Table exists in database
- [ ] All columns present
- [ ] Foreign keys working
- [ ] Model can be imported
- [ ] Test address creation works
- [ ] Related name 'addresses' accessible

---

## Summary

This document established the employee contact information and address management system:

### Completed Infrastructure
- ✅ Employee email fields (work and personal)
- ✅ Employee phone fields (mobile, landline, work phone, extension)
- ✅ Sri Lankan phone number validator
- ✅ Separate EmployeeAddress model
- ✅ Address core fields (line1, line2, city, postal code)
- ✅ Province and district fields (9 provinces, 25 districts)
- ✅ Address type classification (permanent, temporary, work)
- ✅ Database migrations applied

### Key Achievements
1. **Contact Management** - Email and phone fields with Sri Lankan format support
2. **Phone Validation** - Custom validator for mobile and landline formats
3. **Address Structure** - Separate model for multiple addresses per employee
4. **Location Tracking** - Province and district fields for regional analysis
5. **Address Classification** - Support for permanent, temporary, and work addresses
6. **Primary Address** - Designation of primary communication address

### Next Steps
Proceed to [02_Tasks-27-34_Emergency-Family.md](02_Tasks-27-34_Emergency-Family.md) to implement emergency contacts and family member information.

---

**Document Status:** ✅ Complete  
**Total Tasks:** 8 (Tasks 19-26)  
**Total Lines:** ~1383
