# Tasks 07-12: Employee Model Core, Name, User Link, Photo, and NIC

> **Phase:** 06 - ERP Advanced Modules  
> **SubPhase:** 01 - Employee Management  
> **Group:** A - Employee Model & Core Fields  
> **Document:** 02 of 03  
> **Tasks Covered:** 07, 08, 09, 10, 11, 12

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-01-06_App-Setup-Choices.md](01_Tasks-01-06_App-Setup-Choices.md)
- **→ Next Document:** [03_Tasks-13-18_DOB-Gender-ID-Index-Migration.md](03_Tasks-13-18_DOB-Gender-ID-Index-Migration.md)

---

## Document Overview

This document covers the core Employee model creation including foundational fields, name management, user account integration, profile photo handling, and Sri Lankan National Identity Card (NIC) validation. These components form the essential data structure for employee records.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 07 | Create Employee Model Core | Medium | 25 min |
| 08 | Add Employee Name Fields | Medium | 20 min |
| 09 | Add Employee User Link | Medium | 20 min |
| 10 | Add Employee Profile Photo | Medium | 20 min |
| 11 | Add Employee NIC Field | Medium | 20 min |
| 12 | Create NIC Validator | High | 30 min |

---

## Task 07: Create Employee Model Core

### Overview
Create the foundational Employee model with core fields including employee_id, status, and employment_type. This model inherits from TenantAwareMixin and TimestampMixin to ensure proper multi-tenancy support and automatic timestamp tracking.

### Dependencies
- Tasks 01-06: App setup and choice constants completed
- Base model mixins available (TenantAwareMixin, TimestampMixin)
- Django ORM configured

### Instructions

1. **Create employee.py model file**
   - Create file at `apps/employees/models/employee.py`
   - Import necessary Django components

2. **Import required modules**
   - Import Django model and field types
   - Import base model mixins (TenantAwareMixin, TimestampMixin)
   - Import constants from employees.constants
   - Import User model from authentication

3. **Define Employee model class**
   - Inherit from TenantAwareMixin and TimestampMixin
   - Add comprehensive model docstring
   - Document model purpose and relationships

4. **Add employee_id field**
   - CharField with max_length=20
   - unique=True for system-wide uniqueness
   - Will be auto-generated in later task
   - Format: EMP-{SEQUENCE}

5. **Add employment_type field**
   - CharField with choices=EMPLOYMENT_TYPES
   - max_length=20
   - Default to FULL_TIME
   - Required field (cannot be null/blank)

6. **Add status field**
   - CharField with choices=EMPLOYEE_STATUSES
   - max_length=20
   - Default to ACTIVE
   - Required field

7. **Add is_active field**
   - BooleanField, default=True
   - Quick filter for active/inactive
   - Complements status field

8. **Add notes field**
   - TextField, optional (blank=True, null=True)
   - Internal HR notes
   - Not visible to employee

9. **Add Meta class**
   - Set verbose_name and verbose_name_plural
   - Add ordering by employee_id
   - Add indexes (will expand in later task)

10. **Add __str__ method**
    - Return formatted string
    - Include employee_id and name
    - Format: "EMP-0001: John Doe"

11. **Update models/__init__.py**
    - Import Employee model
    - Add to __all__ list

### Employee Model Core Structure

```
┌──────────────────────────────────────────────────────┐
│              Employee Model (Core)                   │
├──────────────────────────────────────────────────────┤
│ Core Fields:                                         │
│  • employee_id (CharField, unique)                   │
│  • employment_type (CharField with choices)          │
│  • status (CharField with choices)                   │
│  • is_active (BooleanField)                          │
│  • notes (TextField, optional)                       │
│                                                      │
│ Inherited from TenantAwareMixin:                     │
│  • tenant (ForeignKey to Tenant)                     │
│                                                      │
│ Inherited from TimestampMixin:                       │
│  • created_at (DateTimeField, auto_now_add)          │
│  • updated_at (DateTimeField, auto_now)              │
└──────────────────────────────────────────────────────┘
```

### Model Relationships

```
Multi-Tenancy Architecture
═════════════════════════

┌──────────────┐         1:N          ┌─────────────────┐
│    Tenant    │◄─────────────────────│    Employee     │
└──────────────┘                      └─────────────────┘
                                              │
                                              │ 1:1 (optional)
                                              │
                                              ▼
                                      ┌──────────────┐
                                      │     User     │
                                      │   (System    │
                                      │    Access)   │
                                      └──────────────┘
```

### Field Details

| Field | Type | Required | Default | Purpose |
|-------|------|----------|---------|---------|
| employee_id | CharField(20) | Yes | Auto | Unique employee identifier |
| employment_type | CharField(20) | Yes | FULL_TIME | Employment category |
| status | CharField(20) | Yes | ACTIVE | Current employment status |
| is_active | BooleanField | Yes | True | Quick active filter |
| notes | TextField | No | null | Internal HR notes |
| tenant | ForeignKey | Yes | - | Tenant association |
| created_at | DateTimeField | Yes | Auto | Record creation timestamp |
| updated_at | DateTimeField | Yes | Auto | Last modification timestamp |

### Status vs is_active Field

```
Status and is_active Relationship
═════════════════════════════════

status = ACTIVE           → is_active = True
status = ON_LEAVE         → is_active = True  (still employed)
status = INACTIVE         → is_active = False
status = TERMINATED       → is_active = False
status = RESIGNED         → is_active = False

Usage:
• status: Detailed employment state
• is_active: Quick boolean filter for queries
• Both fields work together for comprehensive tracking
```

### Employee Model Use Cases

#### Employee Record Creation
1. New employee joins company
2. HR creates employee record
3. System auto-generates employee_id (EMP-0001)
4. Status set to ACTIVE
5. Employment type assigned based on contract

#### Status Tracking
1. Employee requests leave → status changes to ON_LEAVE
2. Employee returns → status changes back to ACTIVE
3. Employee resigns → status changes to RESIGNED
4. is_active automatically updated based on status

#### Query Optimization
```
Common Query Patterns
════════════════════

Active employees only:
  Employee.objects.filter(is_active=True)

Active status specifically:
  Employee.objects.filter(status=ACTIVE)

Full-time active employees:
  Employee.objects.filter(
    is_active=True,
    employment_type=FULL_TIME
  )

Employees with system access:
  Employee.objects.filter(
    is_active=True,
    user__isnull=False
  )
```

### Expected Outcome
- Functional core Employee model
- Multi-tenant support enabled
- Status and type tracking
- Automatic timestamps
- Foundation for additional fields

### Verification Checklist
- [ ] employee.py file created
- [ ] Employee class defined
- [ ] Inherits from TenantAwareMixin and TimestampMixin
- [ ] employee_id field added
- [ ] employment_type field with choices
- [ ] status field with choices
- [ ] is_active field added
- [ ] notes field added
- [ ] Meta class configured
- [ ] __str__ method implemented
- [ ] Model imported in __init__.py

---

## Task 08: Add Employee Name Fields

### Overview
Add name-related fields to the Employee model including first_name, last_name, middle_name, and a computed full_name property. This structure supports flexible name formatting while accommodating various cultural naming conventions common in Sri Lanka.

### Dependencies
- Task 07: Create Employee Model Core

### Instructions

1. **Open employee.py model file**
   - Navigate to `apps/employees/models/employee.py`
   - Locate Employee model class

2. **Add first_name field**
   - CharField with max_length=100
   - Required field (blank=False, null=False)
   - Employee's given name
   - Indexed for search performance

3. **Add last_name field**
   - CharField with max_length=100
   - Required field
   - Employee's family name/surname
   - Indexed for search performance

4. **Add middle_name field**
   - CharField with max_length=100
   - Optional (blank=True, null=True)
   - Middle name or initial
   - Not common in Sri Lankan names

5. **Add preferred_name field**
   - CharField with max_length=100
   - Optional (blank=True, null=True)
   - Nickname or preferred name
   - Used in informal communications

6. **Add full_name property**
   - @property decorator
   - Compute from first_name, middle_name, last_name
   - Return formatted full name
   - Handle middle name if present

7. **Add get_display_name method**
   - Return preferred_name if set
   - Otherwise return full_name
   - Used for UI display

8. **Update __str__ method**
   - Use full_name property
   - Format: "EMP-0001: Full Name"

### Name Field Structure

```
┌──────────────────────────────────────────────────────┐
│              Employee Name Fields                    │
├──────────────────────────────────────────────────────┤
│ Storage Fields:                                      │
│  • first_name (CharField, 100, required)             │
│  • last_name (CharField, 100, required)              │
│  • middle_name (CharField, 100, optional)            │
│  • preferred_name (CharField, 100, optional)         │
│                                                      │
│ Computed Properties:                                 │
│  • full_name (property)                              │
│  • get_display_name() (method)                       │
└──────────────────────────────────────────────────────┘
```

### Name Formatting Examples

#### Standard Full Name
```
first_name = "Kasun"
middle_name = None
last_name = "Perera"

full_name → "Kasun Perera"
```

#### Full Name with Middle Name
```
first_name = "Mohamed"
middle_name = "Imran"
last_name = "Hassan"

full_name → "Mohamed Imran Hassan"
```

#### Full Name with Initial
```
first_name = "Nimal"
middle_name = "S"
last_name = "Fernando"

full_name → "Nimal S Fernando"
```

#### Preferred Name Usage
```
first_name = "Janaka"
last_name = "Bandara"
preferred_name = "Jana"

full_name → "Janaka Bandara"
get_display_name() → "Jana"
```

### Sri Lankan Naming Conventions

#### Sinhala Names
```
Examples:
• Single name: "Bandula" (historically common)
• Two names: "Kasun Rajapaksa"
• Three names: "Mahinda Chinthaka Rajapaksa"
• With initials: "W.A. Silva" (full: Wickramasinghe Arachchige Silva)
```

#### Tamil Names
```
Examples:
• Father's name: "S. Krishnan" (S = father's initial)
• Full format: "Subramaniam Krishnan"
• With family: "Krishnan Subramaniam Kumar"
```

#### Muslim Names
```
Examples:
• Multi-part: "Mohamed Imran Hassan"
• With bin: "Ahmad bin Abdullah"
• Traditional: "Abdul Rahman Mohamed"
```

#### Burgher/Western Names
```
Examples:
• Western style: "John David Smith"
• With hyphen: "Anne-Marie Fernando"
• Multiple middle: "Robert James Peter Brown"
```

### Name Field Best Practices

```
Name Handling Guidelines
═══════════════════════

✓ DO:
  - Store names in original format
  - Support Unicode characters (Sinhala, Tamil)
  - Allow spaces in names
  - Preserve capitalization
  - Support long surnames

✗ DON'T:
  - Force specific format
  - Require middle name
  - Assume name order
  - Restrict characters unnecessarily
  - Auto-format without permission
```

### Unicode Support for Sri Lankan Scripts

#### Sinhala Names
```
first_name = "කසුන්"
last_name = "පෙරේරා"
full_name → "කසුන් පෙරේරා"
```

#### Tamil Names
```
first_name = "குமார்"
last_name = "சுப்ரமணியம்"
full_name → "குமார் சுப்ரமணியம்"
```

### Name Search Considerations

```
Search Scenarios
═══════════════

1. First name search:
   Query: "Kasun"
   Matches: All employees with first_name containing "Kasun"

2. Last name search:
   Query: "Perera"
   Matches: All employees with last_name containing "Perera"

3. Full name search:
   Query: "Kasun Perera"
   Implementation: Search first_name AND last_name

4. Preferred name search:
   Query: "Jana"
   Matches: Employees with preferred_name="Jana"
```

### Display Name Usage Matrix

| Context | Use Field | Example |
|---------|-----------|---------|
| Official documents | full_name | "Kasun Rajitha Perera" |
| System interface | get_display_name() | "Kasun" or "KP" (preferred) |
| Email/notifications | get_display_name() | "Hi Kasun," |
| Reports | full_name | "Kasun Rajitha Perera" |
| Name tags | preferred_name or first_name | "Kasun" |
| Payslips | full_name | "Kasun Rajitha Perera" |

### Expected Outcome
- Flexible name storage
- Support for various naming conventions
- Unicode character support
- Computed full name property
- Preferred name for informal use

### Verification Checklist
- [ ] first_name field added
- [ ] last_name field added
- [ ] middle_name field added (optional)
- [ ] preferred_name field added (optional)
- [ ] full_name property implemented
- [ ] get_display_name() method implemented
- [ ] __str__ method updated
- [ ] Unicode support verified
- [ ] Name formatting tested

---

## Task 09: Add Employee User Link

### Overview
Add an optional OneToOne relationship between Employee and User models. This link is created when an employee needs system access, separating HR employee records from system authentication. Not all employees require user accounts, making this a flexible optional relationship.

### Dependencies
- Task 07: Create Employee Model Core
- User model exists in authentication system

### Instructions

1. **Open employee.py model file**
   - Continue in `apps/employees/models/employee.py`
   - Locate Employee model class

2. **Import User model**
   - Import from Django's auth system or custom user model
   - Add to imports section

3. **Add user field**
   - OneToOneField to User model
   - on_delete=models.SET_NULL
   - null=True, blank=True (optional relationship)
   - related_name='employee'

4. **Add has_system_access property**
   - @property decorator
   - Return True if user is not None
   - Return False otherwise
   - Quick check for system access

5. **Add create_user_account method**
   - Method to create user account for employee
   - Accept username, email, password parameters
   - Create User instance
   - Link to employee
   - Return created user

6. **Add revoke_system_access method**
   - Method to remove user account link
   - Set user field to None
   - Optionally deactivate user account
   - Used when employee leaves or access removed

7. **Update model docstring**
   - Document user relationship
   - Explain optional nature
   - Note access control implications

### User Link Architecture

```
Employee-User Relationship
═════════════════════════

┌─────────────────┐           ┌──────────────┐
│    Employee     │           │     User     │
│   (HR Record)   │           │  (System     │
│                 │    0..1   │   Access)    │
│  • Name         ├───────────┤              │
│  • DOB          │           │  • Username  │
│  • NIC          │           │  • Password  │
│  • Address      │           │  • Email     │
└─────────────────┘           └──────────────┘

Relationship: OneToOne (Optional)
Direction: Employee → User
Cardinality: Zero or One
```

### Employee Types and System Access

| Employee Type | Requires User Account | Purpose |
|--------------|---------------------|---------|
| Store Manager | Yes | Full ERP access, reporting, configurations |
| Cashier | Yes | POS system access only |
| Sales Associate | Yes | Limited inventory, sales access |
| Warehouse Worker | Maybe | Inventory management if needed |
| Delivery Person | Maybe | Mobile app access if needed |
| Office Cleaner | No | No system access required |
| Security Guard | No | Physical security only |
| Contract Worker | Depends | Based on role requirements |

### Access Creation Scenarios

#### Scenario 1: New Employee with System Access
```
Process Flow
═══════════

1. Create Employee Record
   ├─ employee_id: EMP-0001
   ├─ name: "Kasun Perera"
   ├─ status: ACTIVE
   └─ user: None

2. Create User Account
   ├─ username: "kasun.perera"
   ├─ email: "kasun@company.lk"
   └─ password: (set by admin)

3. Link User to Employee
   └─ employee.user = user_instance
```

#### Scenario 2: Existing Employee Granted Access
```
Process Flow
═══════════

1. Employee Exists (no access)
   ├─ employee_id: EMP-0050
   ├─ name: "Nimal Silva"
   └─ user: None
   └─ has_system_access: False

2. Role Change Requires Access
   └─ Promoted to Supervisor

3. Create and Link User Account
   ├─ Create User: "nimal.silva"
   └─ employee.user = user_instance
   └─ has_system_access: True
```

#### Scenario 3: Employee Leaves - Revoke Access
```
Process Flow
═══════════

1. Active Employee with Access
   ├─ employee_id: EMP-0025
   ├─ status: ACTIVE
   └─ user: linked

2. Employee Resigns
   ├─ status: RESIGNED
   └─ Revoke system access

3. Remove User Link
   ├─ employee.user = None
   ├─ user.is_active = False (deactivate)
   └─ has_system_access: False
```

### User Account Creation Methods

#### Method 1: Admin Creates Account
```
Process:
1. HR creates employee record
2. Admin creates user account manually
3. Admin links user to employee
4. Admin assigns roles/permissions
5. Employee receives login credentials
```

#### Method 2: Automated Creation
```
Process:
1. HR creates employee record
2. System auto-generates username
3. System creates user account
4. System sends welcome email
5. Employee sets password on first login
```

#### Method 3: Self-Service Invitation
```
Process:
1. HR creates employee record
2. Admin sends invitation email
3. Employee clicks link
4. Employee creates own password
5. System links user to employee
```

### Username Generation Patterns

| Pattern | Example | Format |
|---------|---------|--------|
| First.Last | kasun.perera | {first}.{last} |
| First Initial + Last | kperera | {first_initial}{last} |
| Employee ID | emp0001 | emp{id} |
| Email prefix | kasun.p | {email_prefix} |
| Custom format | kperera001 | {custom_logic} |

### Permission and Role Assignment

```
User Account Hierarchy
═════════════════════

User Account
    │
    ├── Username/Password (Authentication)
    │
    ├── Employee Link (HR Data)
    │
    ├── Groups (Role-based permissions)
    │   ├── Managers
    │   ├── Cashiers
    │   ├── Supervisors
    │   └── Warehouse Staff
    │
    └── Permissions (Granular access)
        ├── Can view products
        ├── Can edit inventory
        ├── Can process sales
        └── Can generate reports
```

### Access Control Matrix

| Employee Role | User Account | POS Access | Admin Access | Reports |
|--------------|-------------|-----------|-------------|---------|
| Store Manager | Required | Full | Full | Full |
| Supervisor | Required | Full | Limited | Department |
| Cashier | Required | POS Only | None | Own sales |
| Sales Associate | Optional | Limited | None | None |
| Warehouse Staff | Optional | None | Inventory | Stock |
| Support Staff | Not needed | None | None | None |

### Expected Outcome
- Optional employee-user link
- Flexible access control
- User account creation capability
- Access revocation mechanism
- Clear separation of HR and system access

### Verification Checklist
- [ ] user field added (OneToOneField)
- [ ] Field is optional (null=True, blank=True)
- [ ] on_delete=SET_NULL configured
- [ ] related_name set to 'employee'
- [ ] has_system_access property implemented
- [ ] create_user_account method added
- [ ] revoke_system_access method added
- [ ] Model docstring updated

---

## Task 10: Add Employee Profile Photo

### Overview
Add profile photo capability to the Employee model using Django's ImageField. This includes photo upload, storage configuration, thumbnail generation support, and default image handling. Profile photos enhance user interface and aid in employee identification.

### Dependencies
- Task 07: Create Employee Model Core
- File storage system configured
- PIL/Pillow library installed

### Instructions

1. **Open employee.py model file**
   - Continue in `apps/employees/models/employee.py`
   - Locate Employee model class

2. **Add profile_photo field**
   - ImageField with upload_to parameter
   - upload_to='employee_photos/%Y/%m/'
   - null=True, blank=True (optional photo)
   - help_text for admin guidance

3. **Create upload path function**
   - Define function to generate dynamic upload path
   - Include tenant_id for multi-tenant isolation
   - Include employee_id for organization
   - Format: 'employee_photos/tenant_{id}/EMP-{id}/'

4. **Add photo_url property**
   - @property decorator
   - Return photo URL if exists
   - Return default photo URL if no photo
   - Handle missing file gracefully

5. **Add has_photo property**
   - @property decorator
   - Return True if profile_photo exists
   - Return False otherwise
   - Quick check for photo presence

6. **Add delete_photo method**
   - Method to remove photo file
   - Delete file from storage
   - Set profile_photo field to None
   - Handle file not found errors

7. **Update Meta class**
   - Note photo storage location
   - Document thumbnail generation (if implemented)

### Profile Photo Structure

```
┌──────────────────────────────────────────────────────┐
│           Employee Profile Photo                     │
├──────────────────────────────────────────────────────┤
│ Storage Field:                                       │
│  • profile_photo (ImageField, optional)              │
│                                                      │
│ Computed Properties:                                 │
│  • photo_url (property)                              │
│  • has_photo (property)                              │
│                                                      │
│ Methods:                                             │
│  • delete_photo() - Remove photo file                │
│  • get_upload_path() - Dynamic upload location       │
└──────────────────────────────────────────────────────┘
```

### Photo Storage Architecture

```
File Storage Structure
═════════════════════

media/
└── employee_photos/
    ├── tenant_1/
    │   ├── EMP-0001/
    │   │   └── profile.jpg
    │   ├── EMP-0002/
    │   │   └── profile.png
    │   └── EMP-0003/
    │       └── profile.jpg
    ├── tenant_2/
    │   ├── EMP-0001/
    │   │   └── profile.jpg
    │   └── EMP-0005/
    │       └── profile.jpg
    └── defaults/
        └── default_profile.png
```

### Photo Upload Specifications

| Specification | Requirement | Notes |
|--------------|-------------|-------|
| File formats | JPG, PNG, GIF | Common image formats |
| Max file size | 5 MB | Configurable per deployment |
| Min dimensions | 200x200 pixels | Ensure readability |
| Max dimensions | 2000x2000 pixels | Prevent excessive sizes |
| Aspect ratio | 1:1 (square) preferred | Circular display |
| Color space | RGB | Standard web format |

### Photo Processing Workflow

```
Photo Upload Process
═══════════════════

1. User Selects Photo
         │
         ▼
2. Validate File
   ├─ Check format
   ├─ Check size
   └─ Check dimensions
         │
         ▼
3. Generate Upload Path
   └─ tenant_{id}/EMP-{employee_id}/
         │
         ▼
4. Save Original Photo
         │
         ▼
5. (Optional) Generate Thumbnail
   └─ Create smaller version
         │
         ▼
6. Update Database Record
   └─ Save file path
```

### Thumbnail Generation

```
Thumbnail Sizes
══════════════

┌─────────────────────────────────────────────┐
│                                             │
│  Original: 800x800                          │
│  └─ Large: 300x300 (profile pages)          │
│     └─ Medium: 150x150 (lists)              │
│        └─ Small: 50x50 (avatars)            │
│                                             │
└─────────────────────────────────────────────┘

Storage:
• Original: tenant_1/EMP-0001/profile.jpg
• Large: tenant_1/EMP-0001/profile_300x300.jpg
• Medium: tenant_1/EMP-0001/profile_150x150.jpg
• Small: tenant_1/EMP-0001/profile_50x50.jpg
```

### Default Photo Handling

#### No Photo Scenarios
```
Display Logic
════════════

if employee.has_photo:
    display employee.photo_url
else:
    display DEFAULT_PROFILE_PHOTO

Default photo variations:
• Generic avatar icon
• Gender-specific placeholder
• Initial-based avatar (K for Kasun)
• Role-based icon
```

### Photo URL Generation

#### With Photo
```
employee.profile_photo = "employee_photos/tenant_1/EMP-0001/profile.jpg"
employee.photo_url → "https://cdn.example.com/media/employee_photos/tenant_1/EMP-0001/profile.jpg"
```

#### Without Photo
```
employee.profile_photo = None
employee.photo_url → "https://cdn.example.com/static/images/default_profile.png"
```

### Photo Use Cases

| Context | Size | Requirements |
|---------|------|-------------|
| Employee profile page | Large (300x300) | High quality, clear |
| Employee list | Medium (150x150) | Recognizable |
| Dashboard widgets | Medium (150x150) | Quick identification |
| POS cashier view | Small (50x50) | Avatar style |
| Reports (printed) | Original | High resolution |
| Mobile app | Medium (150x150) | Optimized for mobile |
| ID badge generation | Original | Print quality |

### Photo Privacy and Security

```
Access Control
═════════════

✓ Allowed:
  - Tenant employees can view own photos
  - Managers can view team photos
  - HR can view all employee photos
  - System admins can manage all photos

✗ Restricted:
  - Cross-tenant access
  - Unauthenticated access
  - External sharing without permission
  - Modification by non-authorized users
```

### Photo Management Operations

#### Upload New Photo
```
Steps:
1. Employee/HR selects new photo file
2. System validates format and size
3. System generates upload path
4. System saves file to storage
5. (Optional) Generate thumbnails
6. Update employee record with file path
7. Delete old photo if exists
```

#### Replace Existing Photo
```
Steps:
1. Check if existing photo
2. Upload new photo (as above)
3. Delete old photo file
4. Update employee record
```

#### Delete Photo
```
Steps:
1. Retrieve photo file path
2. Delete file from storage
3. Delete thumbnails if exist
4. Set profile_photo field to None
5. Display default photo
```

### Expected Outcome
- Photo upload capability
- Multi-tenant photo isolation
- Dynamic upload path generation
- Default photo fallback
- Photo management methods

### Verification Checklist
- [ ] profile_photo field added (ImageField)
- [ ] upload_to parameter configured
- [ ] Field is optional (null=True, blank=True)
- [ ] get_upload_path function defined
- [ ] photo_url property implemented
- [ ] has_photo property implemented
- [ ] delete_photo method added
- [ ] Default photo handling configured
- [ ] File storage tested

---

## Task 11: Add Employee NIC Field

### Overview
Add the National Identity Card (NIC) number field to the Employee model. In Sri Lanka, the NIC is a critical identification document required for employment, and this field will store and validate both old (9V/X) and new (12-digit) NIC formats.

### Dependencies
- Task 07: Create Employee Model Core

### Instructions

1. **Open employee.py model file**
   - Continue in `apps/employees/models/employee.py`
   - Locate Employee model class

2. **Add nic_number field**
   - CharField with max_length=12
   - Required field (blank=False, null=False)
   - unique=True for tenant scope
   - help_text explaining NIC format

3. **Add field documentation**
   - Document both NIC formats (old and new)
   - Explain validation requirements
   - Note uniqueness constraint

4. **Add get_nic_type method**
   - Determine if NIC is old format (9V/X) or new (12-digit)
   - Return 'old' or 'new'
   - Used for format-specific processing

5. **Add extract_dob_from_nic method**
   - Extract date of birth from NIC number
   - Handle both old and new formats
   - Return datetime.date object
   - Handle invalid NIC gracefully

6. **Add extract_gender_from_nic method**
   - Extract gender from NIC number
   - Based on day-of-year encoding
   - Return MALE, FEMALE, or None
   - Handle both formats

7. **Update Meta class**
   - Add unique_together constraint (tenant, nic_number)
   - Ensure NIC uniqueness within tenant only

### NIC Field Structure

```
┌──────────────────────────────────────────────────────┐
│         Employee NIC (National Identity Card)        │
├──────────────────────────────────────────────────────┤
│ Storage Field:                                       │
│  • nic_number (CharField, 12, required, unique)      │
│                                                      │
│ Methods:                                             │
│  • get_nic_type() - Determine format (old/new)       │
│  • extract_dob_from_nic() - Get date of birth        │
│  • extract_gender_from_nic() - Get gender            │
│                                                      │
│ Constraints:                                         │
│  • unique_together: (tenant, nic_number)             │
│  • Validator: validate_sri_lanka_nic (Task 12)       │
└──────────────────────────────────────────────────────┘
```

### Sri Lanka NIC Formats

#### Old Format (Before 2016)
```
Format: 9 digits + V or X
Example: 912345678V

Structure:
┌──┬───┬────┬─┐
│91│234│5678│V│
└──┴───┴────┴─┘
 │   │    │   │
 │   │    │   └─ Suffix (V=general, X=special)
 │   │    └───── Sequence number (4 digits)
 │   └────────── Day of year (3 digits)
 └────────────── Year of birth (2 digits)

Examples:
• 912345678V → Born 1991, Day 234
• 856789012V → Born 1985, Day 678 (Female: 678-500=178)
• 701234567X → Born 1970, Day 123, Special suffix
```

#### New Format (After 2016)
```
Format: 12 digits
Example: 199112345678

Structure:
┌────┬───┬─────┐
│1991│123│45678│
└────┴───┴─────┘
  │    │    │
  │    │    └─── Sequence number (5 digits)
  │    └──────── Day of year (3 digits)
  └───────────── Year of birth (4 digits)

Examples:
• 199112345678 → Born 1991, Day 123
• 198567812345 → Born 1985, Day 678 (Female: 678-500=178)
• 200205612345 → Born 2002, Day 056
```

### Gender Encoding in NIC

```
Day of Year Gender Encoding
════════════════════════════

Male: Day 001-366
  • Day 001 = January 1
  • Day 032 = February 1
  • Day 365 = December 31

Female: Day 501-866
  • Day 501 = January 1 (001 + 500)
  • Day 532 = February 1 (032 + 500)
  • Day 865 = December 31 (365 + 500)

Calculation:
  if day_of_year <= 366:
      gender = MALE
      actual_day = day_of_year
  else:
      gender = FEMALE
      actual_day = day_of_year - 500
```

### Date of Birth Extraction

#### Old Format (912345678V)
```
Extraction Process:
1. Extract year: "91" → 1991
   - Determine century (1900s or 2000s)
   - If year > current_year_2digit: 1900s
   - Else: 2000s

2. Extract day: "234"
   - If day > 500: Female (subtract 500)
   - Else: Male

3. Calculate date:
   - Start from January 1 of year
   - Add (day - 1) days
   - Result: Actual birth date

Example: 912345678V
- Year: 1991
- Day: 234
- Gender: Male
- Date: August 22, 1991 (1991-01-01 + 233 days)
```

#### New Format (199112345678)
```
Extraction Process:
1. Extract year: "1991" (4 digits)

2. Extract day: "123"
   - If day > 500: Female (subtract 500)
   - Else: Male

3. Calculate date:
   - Start from January 1 of year
   - Add (day - 1) days
   - Result: Actual birth date

Example: 199112345678
- Year: 1991
- Day: 123
- Gender: Male
- Date: May 3, 1991 (1991-01-01 + 122 days)
```

### NIC Validation Examples

#### Valid NICs
```
Old Format:
✓ 912345678V - Valid old format
✓ 856789012V - Valid with female day
✓ 701234567X - Valid with X suffix
✓ 952341234V - Valid 1995 birth

New Format:
✓ 199112345678 - Valid new format
✓ 198567812345 - Valid with female day
✓ 200205612345 - Valid 2002 birth
✓ 195012345678 - Valid 1950 birth
```

#### Invalid NICs
```
✗ 12345678V - Too short
✗ 9123456789 - Missing suffix
✗ 991234567V - Invalid year (99)
✗ 919995678V - Invalid day (999)
✗ 91234567V - Incorrect length
✗ 912345678A - Invalid suffix (must be V or X)
✗ 19911234567 - Invalid length (11 digits)
✗ 1991999678 - Invalid day (999)
```

### NIC Usage Scenarios

| Use Case | Purpose |
|----------|---------|
| Employee onboarding | Verify identity, extract DOB |
| Payroll (EPF/ETF) | Legal requirement for contributions |
| Bank account setup | Bank requires NIC for account |
| Leave validation | Verify age for leave eligibility |
| Retirement calculation | Calculate retirement date |
| Background verification | Cross-check with official records |

### Expected Outcome
- NIC field for Sri Lankan identification
- Support for both old and new formats
- DOB extraction capability
- Gender extraction capability
- Uniqueness within tenant

### Verification Checklist
- [ ] nic_number field added
- [ ] Field is required
- [ ] Max length set to 12
- [ ] help_text added
- [ ] get_nic_type method implemented
- [ ] extract_dob_from_nic method implemented
- [ ] extract_gender_from_nic method implemented
- [ ] unique_together constraint added
- [ ] Field documentation complete

---

## Task 12: Create NIC Validator

### Overview
Create a comprehensive validator for Sri Lankan National Identity Card (NIC) numbers. This validator will check format correctness, validate date components, ensure proper suffix usage for old format, and verify the overall structure for both old and new NIC formats.

### Dependencies
- Task 11: Add Employee NIC Field
- Django validators framework

### Instructions

1. **Create nic_validator.py file**
   - Create at `apps/employees/validators/nic_validator.py`
   - Import Django's ValidationError
   - Import datetime for date validation

2. **Add validator docstring**
   - Document both NIC formats
   - Explain validation rules
   - Provide usage examples

3. **Define validate_sri_lanka_nic function**
   - Main validator function
   - Accept NIC number as parameter
   - Raise ValidationError if invalid
   - Return True if valid

4. **Validate format structure**
   - Check if old format: 9 digits + V/X
   - Check if new format: 12 digits
   - Reject if neither format matches

5. **Validate old format NIC**
   - Check 9 digits followed by V or X
   - Validate year (00-99)
   - Validate day of year (001-366 or 501-866)
   - Validate sequence (0001-9999)

6. **Validate new format NIC**
   - Check exactly 12 digits
   - Validate year (1900-current year)
   - Validate day of year (001-366 or 501-866)
   - Validate sequence (00001-99999)

7. **Validate day of year**
   - Check if day is in valid range
   - Account for leap years
   - Handle female day offset (500)

8. **Create helper functions**
   - is_leap_year(year) - Check leap year
   - is_valid_day_of_year(day, year) - Validate day
   - extract_nic_components(nic) - Parse NIC parts

9. **Add unit tests**
   - Test valid old format NICs
   - Test valid new format NICs
   - Test invalid formats
   - Test edge cases

10. **Update validators/__init__.py**
    - Import validate_sri_lanka_nic
    - Add to __all__ list

11. **Apply validator to model**
    - Add validators=[validate_sri_lanka_nic] to nic_number field
    - Test validation in model save

### NIC Validator Architecture

```
┌──────────────────────────────────────────────────────┐
│          NIC Validation Flow                         │
├──────────────────────────────────────────────────────┤
│                                                      │
│  Input: NIC Number String                            │
│         │                                            │
│         ▼                                            │
│  1. Format Detection                                 │
│     ├─ Old format? (9 digits + V/X)                  │
│     └─ New format? (12 digits)                       │
│         │                                            │
│         ▼                                            │
│  2. Component Extraction                             │
│     ├─ Year                                          │
│     ├─ Day of Year                                   │
│     └─ Sequence                                      │
│         │                                            │
│         ▼                                            │
│  3. Validation Checks                                │
│     ├─ Year range valid?                             │
│     ├─ Day valid for year?                           │
│     ├─ Leap year handling                            │
│     └─ Suffix valid? (old format)                    │
│         │                                            │
│         ▼                                            │
│  Result: Valid ✓ or Invalid ✗                        │
│                                                      │
└──────────────────────────────────────────────────────┘
```

### Validation Rules

#### Old Format Validation
```
Pattern: ^\d{9}[VvXx]$

Components:
1. Year (2 digits): 00-99
   - 00-24 → 2000-2024
   - 25-99 → 1925-1999

2. Day (3 digits): 001-366 or 501-866
   - 001-366: Male
   - 501-866: Female (subtract 500 for actual day)

3. Sequence (4 digits): 0001-9999

4. Suffix: V, v, X, or x
   - Usually V (general cases)
   - X for special circumstances

Validation:
✓ Length exactly 10 characters
✓ First 9 characters are digits
✓ Last character is V, v, X, or x
✓ Day is valid for year (leap year check)
✓ Year is reasonable (not future)
```

#### New Format Validation
```
Pattern: ^\d{12}$

Components:
1. Year (4 digits): 1900-current year
   - Full 4-digit year
   - Must not be in future

2. Day (3 digits): 001-366 or 501-866
   - Same encoding as old format
   - 001-366: Male
   - 501-866: Female

3. Sequence (5 digits): 00001-99999
   - Increased capacity vs old format

Validation:
✓ Length exactly 12 characters
✓ All characters are digits
✓ Year not in future
✓ Day is valid for year (leap year check)
```

### Day of Year Validation

#### Leap Year Handling
```
Leap Year Rules:
• Divisible by 4: Leap year
• Exception: Divisible by 100: Not leap year
• Exception to exception: Divisible by 400: Leap year

Examples:
• 2000: Leap year (divisible by 400)
• 1900: Not leap year (divisible by 100, not 400)
• 2004: Leap year (divisible by 4)
• 2001: Not leap year

Day 366 (or 866 for females):
✓ Valid in leap years only
✗ Invalid in non-leap years
```

#### Day Range Validation
```
Male Days: 001-366
  001-031: January (31 days)
  032-060: February (29 in leap, 28 in non-leap)
  061-091: March (31 days)
  ...
  336-366: December (31 days)

Female Days: 501-866 (add 500)
  501-531: January
  532-560: February
  561-591: March
  ...
  836-866: December
```

### Validation Error Messages

```
Error Message Examples
═════════════════════

Invalid format:
"Invalid NIC format. Expected 9 digits + V/X or 12 digits."

Invalid year:
"Invalid year in NIC. Year cannot be in the future."

Invalid day:
"Invalid day of year in NIC. Day 366 not valid in non-leap year."

Invalid suffix:
"Invalid NIC suffix. Expected V or X."

Invalid length:
"Invalid NIC length. Expected 10 or 12 characters."
```

### Test Cases

#### Valid Test Cases
```
Old Format:
✓ validate_sri_lanka_nic("912345678V")
✓ validate_sri_lanka_nic("856789012v")
✓ validate_sri_lanka_nic("701234567X")
✓ validate_sri_lanka_nic("952341234V")

New Format:
✓ validate_sri_lanka_nic("199112345678")
✓ validate_sri_lanka_nic("198567812345")
✓ validate_sri_lanka_nic("200205612345")
```

#### Invalid Test Cases
```
Format Errors:
✗ validate_sri_lanka_nic("12345678V")     → Too short
✗ validate_sri_lanka_nic("9123456789")    → Missing suffix
✗ validate_sri_lanka_nic("912345678A")    → Invalid suffix
✗ validate_sri_lanka_nic("19911234567")   → Wrong length

Content Errors:
✗ validate_sri_lanka_nic("919995678V")    → Day 999 invalid
✗ validate_sri_lanka_nic("911005678V")    → Day 100 OK, but year 91 in future (if current year < 2091)
✗ validate_sri_lanka_nic("190236612345")  → Day 366 in non-leap year
```

### Integration with Model

```
Model Field Configuration
════════════════════════

from apps.employees.validators import validate_sri_lanka_nic

class Employee(TenantAwareMixin, TimestampMixin):
    nic_number = models.CharField(
        max_length=12,
        validators=[validate_sri_lanka_nic],
        help_text="Sri Lankan NIC (9V/X or 12 digits)"
    )
```

### Validator Usage Flow

```
Save Employee with NIC
═════════════════════

1. User enters NIC: "912345678V"
         │
         ▼
2. Django calls validator
         │
         ▼
3. validate_sri_lanka_nic("912345678V")
   ├─ Format check: ✓ Pass
   ├─ Year check: ✓ 91 = 1991
   ├─ Day check: ✓ 234 valid
   └─ Suffix check: ✓ V valid
         │
         ▼
4. Validation passes
         │
         ▼
5. Employee saved to database
```

### Expected Outcome
- Comprehensive NIC validation
- Support for both formats
- Proper error messages
- Leap year handling
- Model field integration

### Verification Checklist
- [ ] nic_validator.py file created
- [ ] validate_sri_lanka_nic function defined
- [ ] Old format validation implemented
- [ ] New format validation implemented
- [ ] Day of year validation
- [ ] Leap year check
- [ ] Helper functions created
- [ ] Error messages clear and helpful
- [ ] Unit tests written
- [ ] Validator applied to model field
- [ ] Validation tested

---

## Summary

This document established the core Employee model with essential identification and access fields:

### Completed Infrastructure
- ✅ Employee model core with status and employment type
- ✅ Name fields (first, last, middle, preferred) with full_name property
- ✅ Optional user account linking for system access
- ✅ Profile photo with upload and management
- ✅ NIC field with DOB and gender extraction
- ✅ Comprehensive NIC validator for Sri Lankan formats

### Key Achievements
1. **Flexible Employee Model** - Core structure with tenant awareness
2. **Name Management** - Support for various cultural naming conventions
3. **Access Control** - Optional user link separates HR from system access
4. **Visual Identity** - Profile photos with multi-tenant isolation
5. **Sri Lankan Compliance** - NIC validation for both old and new formats
6. **Data Extraction** - Automatic DOB and gender from NIC

### Next Steps
Proceed to [03_Tasks-13-18_DOB-Gender-ID-Index-Migration.md](03_Tasks-13-18_DOB-Gender-ID-Index-Migration.md) to add date of birth, gender, marital status fields, implement employee ID generator, create database indexes, and run initial migrations.

---

**Document Status:** ✅ Complete  
**Total Tasks:** 6  
**Estimated Implementation Time:** 2 hours 15 minutes
