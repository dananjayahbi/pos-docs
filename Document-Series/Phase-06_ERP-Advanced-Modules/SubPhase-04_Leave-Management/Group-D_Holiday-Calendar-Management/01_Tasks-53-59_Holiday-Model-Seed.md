# Tasks 53-59: Holiday Model, Migrations, and Sri Lanka Seed

> **Phase:** 06 - ERP Advanced Modules  
> **SubPhase:** 04 - Leave Management  
> **Group:** D - Holiday & Calendar Management  
> **Document:** 01 of 02  
> **Tasks Covered:** 53, 54, 55, 56, 57, 58, 59

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-60-66_Calendar-Service-WorkDays.md](02_Tasks-60-66_Calendar-Service-WorkDays.md)

---

## Document Overview

This document covers the implementation of the Holiday model system, which manages public holidays, bank holidays, company-specific holidays, and optional holidays. It includes comprehensive support for Sri Lankan public holidays, including Poya days (monthly full moon days), national festivals, and regional observances. The system supports recurring holidays, department-specific holidays, and location-based holiday calendars.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 53 | Define HolidayType Choices | Low | 10 min |
| 54 | Create Holiday Model | Medium | 25 min |
| 55 | Add Holiday Core Fields | Low | 15 min |
| 56 | Add Holiday Scope Fields | Medium | 20 min |
| 57 | Add Recurring Holiday Flag | Medium | 20 min |
| 58 | Run Holiday Migrations | Low | 15 min |
| 59 | Create Sri Lanka Holidays Seed | Medium | 25 min |

---

## Task 53: Define HolidayType Choices

### Overview
Define the HolidayType choices that categorize different types of holidays in the system. This classification is essential for Sri Lankan context where there are public holidays (applicable to all), bank holidays, company-specific holidays, and optional/restricted holidays that employees can choose from an allocated quota.

### Dependencies
- Leave application structure exists
- Constants module established

### Instructions

1. **Open or create constants.py file**
   - Navigate to `apps/leave/constants.py`
   - This file should already exist from previous groups
   - Add holiday-related constants section

2. **Add module section comment**
   - Add clear section header for holiday constants
   - Separate from leave type constants

3. **Define HOLIDAY_TYPE_PUBLIC constant**
   - Value: 'PUBLIC'
   - Purpose: National public holidays observed by all
   - Examples: Independence Day, Vesak, Sinhala & Tamil New Year

4. **Define HOLIDAY_TYPE_BANK constant**
   - Value: 'BANK'
   - Purpose: Bank holidays where banks are closed
   - May differ from general public holidays
   - Relevant for financial institutions

5. **Define HOLIDAY_TYPE_COMPANY constant**
   - Value: 'COMPANY'
   - Purpose: Company-specific holidays
   - Examples: Company anniversary, founder's day
   - Set by company management

6. **Define HOLIDAY_TYPE_OPTIONAL constant**
   - Value: 'OPTIONAL'
   - Purpose: Optional or restricted holidays
   - Employees choose from allocated quota
   - Example: 2-3 optional holidays per year from list

7. **Create HOLIDAY_TYPES tuple**
   - Define as Django choices tuple
   - Include all holiday type constants
   - Format: (value, display_name) pairs

8. **Add documentation comments**
   - Explain each holiday type
   - Provide Sri Lankan context examples
   - Note usage in Holiday model

### Holiday Type Categorization

```
┌─────────────────────────────────────────────────────────────┐
│                    Holiday Type Hierarchy                    │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  PUBLIC HOLIDAYS                                            │
│  ├─ National holidays (all employees)                       │
│  ├─ Religious holidays (Vesak, Poya days)                   │
│  └─ Civic holidays (Independence Day, May Day)              │
│                                                              │
│  BANK HOLIDAYS                                              │
│  ├─ Public holidays + additional bank holidays              │
│  └─ Relevant for financial institutions                     │
│                                                              │
│  COMPANY HOLIDAYS                                           │
│  ├─ Company anniversary                                     │
│  ├─ Founder's day                                           │
│  └─ Special company events                                  │
│                                                              │
│  OPTIONAL HOLIDAYS                                          │
│  ├─ Restricted holiday list                                 │
│  ├─ Employee chooses from quota                             │
│  └─ Example: Thai Pongal, Deepavali, Id-ul-Fitr            │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Sri Lankan Holiday Categories

| Holiday Type | Applicable To | Examples | Leave Deduction |
|--------------|---------------|----------|-----------------|
| PUBLIC | All employees | Vesak Poya, Independence Day | No |
| BANK | Bank employees | Public + bank-specific days | No |
| COMPANY | All company employees | Company anniversary | No |
| OPTIONAL | Employees who select | Thai Pongal, Deepavali | Uses optional quota |

### Holiday Type Details

#### PUBLIC Holidays
```
Applicable to: All employees in Sri Lanka
Examples:
- Independence Day (Feb 4)
- Sinhala & Tamil New Year (Apr 13-14)
- May Day (May 1)
- Vesak Poya (May full moon)
- Poson Poya (June full moon)
- Christmas Day (Dec 25)
- All monthly Poya days

Total: ~25-27 public holidays per year in Sri Lanka
```

#### BANK Holidays
```
Applicable to: Banking sector employees
Includes: All public holidays + additional bank holidays
Examples:
- All public holidays
- Bank-specific closure days
- Year-end bank closures

Note: Banks may have additional closure days
```

#### COMPANY Holidays
```
Applicable to: Employees of specific company
Set by: Company management
Examples:
- Company anniversary (e.g., "LankaCommerce Day")
- Founder's birthday
- Company annual day
- Office relocation day
- Special achievement celebration

Typically: 1-3 company holidays per year
```

#### OPTIONAL Holidays
```
Applicable to: Employees who choose to observe
Quota: Typically 2-3 days per year from list
Examples:
- Thai Pongal (Jan 14)
- Maha Sivarathri Day
- Deepavali
- Id-ul-Fitr
- Id-ul-Alha
- Milad-un-Nabi
- Good Friday (if not public holiday)

Process:
1. Company publishes list of optional holidays
2. Employee selects 2-3 from list at year start
3. Selected holidays are observed by that employee
4. Other employees work on those days
```

### Optional Holiday System Flow

```
┌──────────────────────────────────────────────┐
│  Company Publishes Optional Holiday List     │
│  (e.g., 8 optional holidays available)       │
└────────────────┬─────────────────────────────┘
                 │
                 ▼
┌──────────────────────────────────────────────┐
│  Employee Selects 2-3 from List              │
│  (at beginning of year or upon joining)      │
└────────────────┬─────────────────────────────┘
                 │
                 ▼
┌──────────────────────────────────────────────┐
│  System Records Employee's Optional Holidays │
│  (stored in employee preferences)            │
└────────────────┬─────────────────────────────┘
                 │
                 ▼
┌──────────────────────────────────────────────┐
│  Calendar Excludes Those Days for Employee   │
│  (when calculating working days)             │
└──────────────────────────────────────────────┘
```

### Sri Lankan Legal Context

According to Sri Lankan labor law:
- **Mercantile Establishments**: Entitled to all public holidays
- **Shop & Office Act**: Mandates observance of public holidays
- **Banks Act**: Specifies bank holidays
- **Optional Holidays**: Governed by company policy (typically 2-3 days)

### Expected Outcome
- Clear holiday type categorization
- Support for Sri Lankan holiday system
- Foundation for holiday model
- Enable optional holiday selection

### Verification Checklist
- [ ] HOLIDAY_TYPE_PUBLIC constant defined
- [ ] HOLIDAY_TYPE_BANK constant defined
- [ ] HOLIDAY_TYPE_COMPANY constant defined
- [ ] HOLIDAY_TYPE_OPTIONAL constant defined
- [ ] HOLIDAY_TYPES tuple created with display names
- [ ] Constants follow naming convention
- [ ] Documentation comments added
- [ ] Sri Lankan context considered

---

## Task 54: Create Holiday Model

### Overview
Create the core Holiday model that represents holidays, non-working days, and special observances in the system. This model supports public holidays, bank holidays, company-specific holidays, and optional holidays. It includes features for recurring holidays (like annual observances) and scope-based applicability (company-wide, department-specific, or location-specific).

### Dependencies
- Task 53: Define HolidayType choices
- Leave application exists
- Base model mixins available
- Django ORM configured

### Instructions

1. **Create holiday.py model file**
   - Create file at `apps/leave/models/holiday.py`
   - Import necessary Django components

2. **Import required modules**
   - Import Django model fields
   - Import base model mixins (TenantAwareMixin, TimestampMixin)
   - Import HOLIDAY_TYPES from constants
   - Import Department model (if applicable)

3. **Define Holiday model class**
   - Inherit from TenantAwareMixin and TimestampMixin
   - Add comprehensive model docstring

4. **Add core fields placeholder comment**
   - Add comment: "# Core fields (Task 55)"
   - Indicates where core fields will be added

5. **Add scope fields placeholder comment**
   - Add comment: "# Scope fields (Task 56)"
   - Indicates where scope fields will be added

6. **Add recurring fields placeholder comment**
   - Add comment: "# Recurring fields (Task 57)"
   - Indicates where recurring fields will be added

7. **Add Meta class**
   - Set verbose_name and verbose_name_plural
   - Add ordering by date (descending)
   - Add indexes for common queries
   - Add unique_together constraint (tenant, name, date) for non-recurring

8. **Add __str__ method**
   - Return holiday name with date
   - Format: "Holiday Name (2026-01-14)"
   - Include holiday type in string

9. **Update models/__init__.py**
   - Import Holiday model
   - Add to __all__ list

### Holiday Model Structure

```
┌──────────────────────────────────────────────────────┐
│                   Holiday Model                       │
├──────────────────────────────────────────────────────┤
│ Core Fields (Task 55):                               │
│  • name (CharField)                                   │
│  • date (DateField)                                   │
│  • holiday_type (CharField with choices)             │
│  • description (TextField)                            │
│                                                       │
│ Scope Fields (Task 56):                              │
│  • applies_to (CharField with choices)               │
│  • department (ForeignKey, nullable)                 │
│  • location (CharField, nullable)                    │
│                                                       │
│ Recurring Fields (Task 57):                          │
│  • is_recurring (BooleanField)                       │
│  • recurrence_rule (CharField, nullable)             │
│  • year (IntegerField, nullable)                     │
│                                                       │
│ Status & Metadata:                                   │
│  • is_active (BooleanField)                          │
│                                                       │
│ Inherited from TenantAwareMixin:                     │
│  • tenant (ForeignKey)                               │
│                                                       │
│ Inherited from TimestampMixin:                       │
│  • created_at (DateTimeField)                        │
│  • updated_at (DateTimeField)                        │
└──────────────────────────────────────────────────────┘
```

### Holiday Model Relationships

```
┌────────────┐         1:N          ┌─────────────────┐
│   Tenant   │◄─────────────────────│     Holiday     │
└────────────┘                      └─────────────────┘
                                            │
                                            │ N:1 (optional)
                                            ▼
                                    ┌─────────────────┐
                                    │   Department    │
                                    └─────────────────┘
                                            
                                            
┌─────────────────┐                ┌─────────────────┐
│  LeaveRequest   │                │     Holiday     │
│                 │                │                 │
│  Checks working │───────────────▶│  Excludes from  │
│  days calc      │                │  working days   │
└─────────────────┘                └─────────────────┘
```

### Holiday Model Use Cases

| Use Case | Example | Configuration |
|----------|---------|---------------|
| National holiday | Vesak Poya 2026 | type=PUBLIC, applies_to=ALL |
| Recurring holiday | Christmas (annual) | is_recurring=True, recurrence_rule="YEARLY" |
| Department holiday | IT Dept team building | type=COMPANY, applies_to=DEPARTMENT |
| Location holiday | Colombo office anniversary | type=COMPANY, applies_to=LOCATION |
| Bank holiday | Bank-specific closure | type=BANK, applies_to=ALL |
| Optional holiday | Deepavali | type=OPTIONAL, applies_to=ALL |

### Holiday Data Flow

```
┌─────────────────────────────────────────────────────┐
│             Holiday Creation Process                 │
├─────────────────────────────────────────────────────┤
│                                                      │
│  1. Admin/HR creates holiday                        │
│     ├─ Sets name, date, type                        │
│     ├─ Sets scope (all/dept/location)               │
│     └─ Sets recurring flag if applicable            │
│                                                      │
│  2. System validates holiday                        │
│     ├─ Checks for duplicate holidays                │
│     ├─ Validates date range                         │
│     └─ Verifies tenant ownership                    │
│                                                      │
│  3. Holiday stored in database                      │
│     └─ Available for leave calculations             │
│                                                      │
│  4. Leave system uses holiday                       │
│     ├─ Excludes from working days                   │
│     ├─ Displays in calendar                         │
│     └─ Blocks leave requests if configured          │
│                                                      │
└─────────────────────────────────────────────────────┘
```

### Holiday Model Query Patterns

```python
# Get all public holidays for a tenant in 2026
holidays = Holiday.objects.filter(
    tenant=tenant,
    holiday_type=HOLIDAY_TYPE_PUBLIC,
    date__year=2026,
    is_active=True
)

# Get department-specific holidays
dept_holidays = Holiday.objects.filter(
    tenant=tenant,
    applies_to='DEPARTMENT',
    department=department,
    date__gte=start_date,
    date__lte=end_date
)

# Get all holidays applicable to an employee
employee_holidays = Holiday.objects.filter(
    tenant=tenant,
    date__range=(start_date, end_date),
    is_active=True
).filter(
    Q(applies_to='ALL') |
    Q(applies_to='DEPARTMENT', department=employee.department) |
    Q(applies_to='LOCATION', location=employee.office_location)
)

# Get recurring holidays (for annual generation)
recurring = Holiday.objects.filter(
    tenant=tenant,
    is_recurring=True,
    is_active=True
)
```

### Expected Outcome
- Functional Holiday model structure
- Tenant-aware holiday management
- Foundation for core, scope, and recurring fields
- Proper model relationships
- Efficient query patterns

### Verification Checklist
- [ ] holiday.py file created
- [ ] Holiday class defined
- [ ] Inherits from TenantAwareMixin and TimestampMixin
- [ ] Placeholder comments for field groups added
- [ ] Meta class configured
- [ ] __str__ method implemented
- [ ] Ordering by date (descending)
- [ ] Model imported in __init__.py
- [ ] Model docstring added

---

## Task 55: Add Holiday Core Fields

### Overview
Add the core fields to the Holiday model: name, date, holiday_type, and description. These fields define the basic information about each holiday and are required for all holiday records.

### Dependencies
- Task 54: Create Holiday model

### Instructions

1. **Open holiday.py model file**
   - Navigate to `apps/leave/models/holiday.py`
   - Locate Holiday model class and "# Core fields" comment

2. **Add name field**
   - CharField with max_length=200
   - Required field (no blank/null)
   - Holiday name (e.g., "Vesak Poya", "Independence Day")
   - Should be clear and descriptive

3. **Add date field**
   - DateField
   - Required field
   - The actual date of the holiday
   - Used for leave calculations and calendar display

4. **Add holiday_type field**
   - CharField with choices from HOLIDAY_TYPES
   - Default to HOLIDAY_TYPE_PUBLIC
   - Categorizes the holiday
   - Used for filtering and reporting

5. **Add description field**
   - TextField
   - Optional (blank=True, null=True)
   - Additional information about the holiday
   - Significance, traditions, or company policy

6. **Add is_active field**
   - BooleanField with default=True
   - Controls holiday visibility
   - Inactive holidays don't affect leave calculations

7. **Update model docstring**
   - Document core field purposes
   - Provide usage examples

### Core Field Structure

```
┌────────────────────────────────────────────────┐
│         Holiday Core Fields                    │
├────────────────────────────────────────────────┤
│ name          : Holiday display name           │
│ date          : Holiday date                   │
│ holiday_type  : PUBLIC/BANK/COMPANY/OPTIONAL   │
│ description   : Additional information         │
│ is_active     : Visibility flag                │
└────────────────────────────────────────────────┘
```

### Field Details

| Field | Type | Required | Default | Max Length | Purpose |
|-------|------|----------|---------|------------|---------|
| name | CharField | Yes | - | 200 | Holiday name |
| date | DateField | Yes | - | - | Holiday date |
| holiday_type | CharField | Yes | PUBLIC | - | Holiday category |
| description | TextField | No | null | - | Additional info |
| is_active | BooleanField | Yes | True | - | Active status |

### Holiday Name Examples

#### Sri Lankan Public Holidays
```
"Independence Day"
"Thai Pongal"
"Sinhala and Tamil New Year"
"May Day"
"Vesak Full Moon Poya Day"
"Poson Full Moon Poya Day"
"Esala Full Moon Poya Day"
"Nikini Full Moon Poya Day"
"Binara Full Moon Poya Day"
"Vap Full Moon Poya Day"
"Il Full Moon Poya Day"
"Unduvap Full Moon Poya Day"
"Duruthu Full Moon Poya Day"
"Navam Full Moon Poya Day"
"Madin Full Moon Poya Day"
"Bak Full Moon Poya Day"
"Christmas Day"
```

#### Religious Holidays (Optional)
```
"Good Friday"
"Deepavali"
"Id-ul-Fitr (Ramazan Festival Day)"
"Id-ul-Alha (Hajj Festival Day)"
"Milad-un-Nabi (Holy Prophet's Birthday)"
"Maha Sivarathri Day"
```

#### Company Holidays
```
"LankaCommerce Anniversary"
"Founder's Day"
"Annual Company Day"
"Year-End Office Closure"
```

### Description Examples

#### Vesak Poya
```
Name: Vesak Full Moon Poya Day
Date: 2026-05-07 (varies by lunar calendar)
Type: PUBLIC
Description: "Vesak commemorates the birth, enlightenment, and passing away 
of Lord Buddha. It is the most important Buddhist festival in Sri Lanka. 
All businesses, shops, and offices are closed. Celebrations include lanterns, 
pandals, dansalas (free food distribution), and religious observances."
```

#### Independence Day
```
Name: Independence Day
Date: 2026-02-04
Type: PUBLIC
Description: "National Day commemorating Sri Lanka's independence from British 
rule on February 4, 1948. Official ceremonies are held in Colombo, and it is 
a public holiday throughout the country."
```

#### Sinhala & Tamil New Year
```
Name: Sinhala and Tamil New Year
Date: 2026-04-13 and 2026-04-14
Type: PUBLIC
Description: "The traditional New Year celebrated by both Sinhala and Tamil 
communities in Sri Lanka. It marks the end of the harvest season and the 
beginning of the new astrological year. Two consecutive public holidays are 
observed. Traditional games, special foods, and family gatherings are common."
```

#### Company Anniversary
```
Name: LankaCommerce 10th Anniversary
Date: 2026-03-15
Type: COMPANY
Description: "Company-wide holiday celebrating 10 years of LankaCommerce 
operations. All offices closed. Annual celebration event at Hilton Colombo 
in the evening (optional attendance)."
```

### Holiday Type Usage

| Holiday Type | Typical Names | Description Style |
|--------------|---------------|-------------------|
| PUBLIC | National/religious observances | Official significance, traditions |
| BANK | Bank closure days | Banking relevance, official notice |
| COMPANY | Company events | Company-specific context |
| OPTIONAL | Religious/cultural festivals | Cultural significance, selection info |

### Date Field Considerations

```
Date Selection:
├─ Fixed Date Holidays
│  └─ Example: Independence Day (Feb 4 every year)
│
├─ Lunar Calendar Holidays
│  └─ Example: Vesak Poya (full moon in May, varies each year)
│
├─ Weekday-Based Holidays
│  └─ Example: (rare in Sri Lanka, but possible for company holidays)
│
└─ Multi-Day Holidays
   └─ Example: Sinhala & Tamil New Year (Apr 13-14)
      Create separate records for each day
```

### Active/Inactive Status Usage

```
is_active = True:
- Holiday appears in calendars
- Excluded from working day calculations
- Visible to employees
- Used in leave request validation

is_active = False:
- Holiday hidden from system
- Not used in calculations
- Historical record preserved
- Can be reactivated if needed

Use Cases for Inactive:
- Past year holidays (archival)
- Cancelled holidays
- Deprecated optional holidays
- Testing/draft holidays
```

### Expected Outcome
- Complete core holiday information
- Clear holiday identification
- Proper date tracking
- Type categorization
- Active status control

### Verification Checklist
- [ ] name field added (CharField, 200)
- [ ] date field added (DateField)
- [ ] holiday_type field added with HOLIDAY_TYPES choices
- [ ] description field added (TextField, optional)
- [ ] is_active field added (BooleanField, default=True)
- [ ] All required fields have no blank/null
- [ ] Optional fields allow blank/null
- [ ] Model docstring updated

---

## Task 56: Add Holiday Scope Fields

### Overview
Add scope fields to the Holiday model that define who the holiday applies to. Holidays can be company-wide (all employees), department-specific, or location-specific. This is essential for organizations with multiple departments or office locations where certain holidays may only apply to specific groups.

### Dependencies
- Task 55: Add Holiday core fields
- Department model exists (from Core modules)

### Instructions

1. **Open holiday.py model file**
   - Navigate to `apps/leave/models/holiday.py`
   - Locate "# Scope fields" comment

2. **Define APPLIES_TO_CHOICES constant**
   - Create tuple of scope choices
   - Options: ALL, DEPARTMENT, LOCATION
   - Place before Holiday model class

3. **Add applies_to field**
   - CharField with APPLIES_TO_CHOICES
   - Default to 'ALL'
   - Determines holiday scope
   - Required field

4. **Add department field**
   - ForeignKey to Department model
   - Optional (blank=True, null=True)
   - Only relevant when applies_to='DEPARTMENT'
   - Related name: 'holidays'
   - on_delete=CASCADE

5. **Add location field**
   - CharField with max_length=100
   - Optional (blank=True, null=True)
   - Only relevant when applies_to='LOCATION'
   - Free-text field for location name
   - Examples: "Colombo", "Kandy", "Galle"

6. **Add clean method for validation**
   - Validate that department is set when applies_to='DEPARTMENT'
   - Validate that location is set when applies_to='LOCATION'
   - Raise ValidationError if constraints violated

7. **Update Meta class**
   - Add index on (tenant, applies_to)
   - Add index on (tenant, department, date)
   - Add index on (tenant, location, date)

8. **Update model docstring**
   - Document scope functionality
   - Provide scope examples

### Holiday Scope Structure

```
┌────────────────────────────────────────────────────┐
│            Holiday Scope Fields                     │
├────────────────────────────────────────────────────┤
│ applies_to   : ALL / DEPARTMENT / LOCATION         │
│ department   : FK to Department (nullable)         │
│ location     : CharField (nullable)                │
│                                                    │
│ Validation:                                        │
│  • applies_to='DEPARTMENT' → department required   │
│  • applies_to='LOCATION' → location required       │
│  • applies_to='ALL' → both should be null          │
└────────────────────────────────────────────────────┘
```

### Scope Choice Details

| Scope Value | Display Name | Department Field | Location Field | Use Case |
|-------------|--------------|------------------|----------------|----------|
| ALL | All Employees | null | null | Company-wide holidays |
| DEPARTMENT | Department Only | required | null | Department-specific days |
| LOCATION | Location Only | null | required | Office location holidays |

### Holiday Scope Examples

#### Company-Wide Holiday (ALL)
```
Name: Vesak Poya
Date: 2026-05-07
Type: PUBLIC
applies_to: ALL
department: null
location: null

→ Applies to all employees in all departments and locations
```

#### Department-Specific Holiday (DEPARTMENT)
```
Name: IT Department Team Building
Date: 2026-06-15
Type: COMPANY
applies_to: DEPARTMENT
department: IT Department
location: null

→ Only IT department is off, other departments work normally
```

#### Location-Specific Holiday (LOCATION)
```
Name: Colombo Office Anniversary
Date: 2026-09-01
Type: COMPANY
applies_to: LOCATION
department: null
location: "Colombo"

→ Only Colombo office employees are off, Kandy/Galle offices work
```

### Multi-Location Organization Example

```
Organization: LankaCommerce (Pvt) Ltd
├─ Colombo Head Office
│  ├─ Finance Department
│  ├─ IT Department
│  └─ Sales Department
│
├─ Kandy Branch
│  ├─ Sales Department
│  └─ Support Department
│
└─ Galle Branch
   └─ Sales Department

Holiday Scenarios:
═══════════════════

1. Independence Day (PUBLIC, ALL)
   → All locations, all departments

2. Colombo Office 15th Anniversary (COMPANY, LOCATION="Colombo")
   → Colombo only, all departments in Colombo

3. IT Department Training Day (COMPANY, DEPARTMENT="IT")
   → IT department only, Colombo location (where IT is based)

4. Kandy Esala Perahera (COMPANY, LOCATION="Kandy")
   → Kandy branch only (local cultural significance)
```

### Scope Validation Logic

```
Validation Rules:
═════════════════

applies_to = 'ALL':
  ✓ department must be null
  ✓ location must be null
  Example: Public holidays

applies_to = 'DEPARTMENT':
  ✓ department must be set
  ✓ location must be null
  Example: Department team building

applies_to = 'LOCATION':
  ✓ department must be null
  ✓ location must be set
  Example: Branch-specific holidays

Invalid Combinations:
  ✗ applies_to='ALL' with department set
  ✗ applies_to='ALL' with location set
  ✗ applies_to='DEPARTMENT' without department
  ✗ applies_to='LOCATION' without location
  ✗ applies_to='DEPARTMENT' with location set
  ✗ applies_to='LOCATION' with department set
```

### Query Patterns for Scoped Holidays

```python
# Get all holidays applicable to an employee
def get_employee_holidays(employee, start_date, end_date):
    """
    Returns all holidays applicable to the given employee
    within the specified date range.
    """
    from django.db.models import Q
    
    return Holiday.objects.filter(
        tenant=employee.tenant,
        date__range=(start_date, end_date),
        is_active=True
    ).filter(
        Q(applies_to='ALL') |  # Company-wide holidays
        Q(applies_to='DEPARTMENT', department=employee.department) |  # Dept holidays
        Q(applies_to='LOCATION', location=employee.office_location)  # Location holidays
    ).order_by('date')

# Get department-specific holidays
def get_department_holidays(department, year):
    """
    Returns all holidays specific to a department in a given year.
    """
    return Holiday.objects.filter(
        tenant=department.tenant,
        applies_to='DEPARTMENT',
        department=department,
        date__year=year,
        is_active=True
    ).order_by('date')

# Get location-specific holidays
def get_location_holidays(tenant, location, year):
    """
    Returns all holidays specific to a location in a given year.
    """
    return Holiday.objects.filter(
        tenant=tenant,
        applies_to='LOCATION',
        location=location,
        date__year=year,
        is_active=True
    ).order_by('date')
```

### Sri Lankan Context Examples

#### Multi-Branch Retail Chain
```
Organization: QuickMart Supermarkets

Branches:
- Colombo (Head Office + 5 stores)
- Kandy (2 stores)
- Galle (1 store)
- Jaffna (1 store)

Holiday Setup:
1. All Public Holidays → applies_to='ALL'
2. Colombo Head Office Anniversary → applies_to='LOCATION', location='Colombo'
3. Jaffna Thai Pongal Celebration → applies_to='LOCATION', location='Jaffna'
   (Additional to public holiday, extended celebration)
4. Kandy Esala Festival → applies_to='LOCATION', location='Kandy'
5. Finance Dept Year-End → applies_to='DEPARTMENT', department='Finance'
```

#### Banking Institution
```
Organization: Lanka National Bank

Locations:
- Colombo Main Branch
- Fort Branch
- Kandy Branch
- Regional offices

Holiday Setup:
1. All Bank Holidays → type='BANK', applies_to='ALL'
2. Colombo Head Office Training → applies_to='LOCATION', location='Colombo Main'
3. Fort Branch Renovation → applies_to='LOCATION', location='Fort'
4. Treasury Department → applies_to='DEPARTMENT', department='Treasury'
```

### Location Field Guidelines

```
Location Naming Standards:
═════════════════════════

Format: Use city/area name consistently

Good Examples:
✓ "Colombo"
✓ "Kandy"
✓ "Galle"
✓ "Colombo 03"
✓ "Colombo Head Office"

Bad Examples:
✗ "colombo" (inconsistent capitalization)
✗ "Cmb" (abbreviation)
✗ "Office 1" (not descriptive)

Recommendations:
- Use full location names
- Be consistent across system
- Match employee.office_location field
- Consider creating a Location choice field in future
```

### Expected Outcome
- Flexible holiday scoping
- Department-specific holidays
- Location-specific holidays
- Proper validation of scope fields
- Efficient querying for applicable holidays

### Verification Checklist
- [ ] APPLIES_TO_CHOICES constant defined
- [ ] applies_to field added with choices
- [ ] department field added (ForeignKey, optional)
- [ ] location field added (CharField, optional)
- [ ] clean() method implemented with validation
- [ ] Meta indexes added for scope queries
- [ ] Model docstring updated with scope examples
- [ ] Validation prevents invalid combinations

---

## Task 57: Add Recurring Holiday Flag

### Overview
Add recurring holiday functionality to the Holiday model. Many holidays occur annually on the same date (like Christmas) or according to a pattern (like Easter or Poya days). The recurring holiday feature allows defining a holiday once and automatically generating instances for multiple years.

### Dependencies
- Task 56: Add Holiday scope fields

### Instructions

1. **Open holiday.py model file**
   - Navigate to `apps/leave/models/holiday.py`
   - Locate "# Recurring fields" comment

2. **Add is_recurring field**
   - BooleanField with default=False
   - Indicates if holiday recurs annually
   - Most public holidays are recurring

3. **Add recurrence_rule field**
   - CharField with max_length=500
   - Optional (blank=True, null=True)
   - Stores RRULE format string (RFC 5545)
   - Used for complex recurrence patterns
   - Example: "RRULE:FREQ=YEARLY;BYMONTH=12;BYMONTHDAY=25"

4. **Add year field**
   - IntegerField
   - Optional (blank=True, null=True)
   - Specific year for non-recurring or instance of recurring
   - If null, applies to all years (when is_recurring=True)

5. **Update Meta class**
   - Modify unique_together constraint
   - Allow duplicate names if recurring (differentiate by year)
   - Add index on (tenant, is_recurring)

6. **Add method: generate_instances_for_year**
   - Class method to generate holiday instances for a specific year
   - Only for recurring holidays
   - Creates new Holiday records with is_recurring=False
   - Used in annual holiday generation task

7. **Update model docstring**
   - Document recurring holiday functionality
   - Provide RRULE examples
   - Explain year field usage

### Recurring Holiday Structure

```
┌────────────────────────────────────────────────────┐
│         Recurring Holiday Fields                   │
├────────────────────────────────────────────────────┤
│ is_recurring     : Boolean (default=False)         │
│ recurrence_rule  : RRULE string (nullable)         │
│ year             : Integer (nullable)              │
│                                                    │
│ Logic:                                             │
│  • is_recurring=True, year=null → Template         │
│  • is_recurring=False, year=set → Instance         │
└────────────────────────────────────────────────────┘
```

### Recurring Holiday Patterns

#### Pattern 1: Fixed Date (Simple)
```
Holiday: Christmas Day
Date: December 25
is_recurring: True
recurrence_rule: "RRULE:FREQ=YEARLY;BYMONTH=12;BYMONTHDAY=25"
year: null (template)

Generated Instances:
- Christmas Day 2026 (date=2026-12-25, year=2026)
- Christmas Day 2027 (date=2027-12-25, year=2027)
- Christmas Day 2028 (date=2028-12-25, year=2028)
```

#### Pattern 2: Fixed Date (Independence Day)
```
Holiday: Independence Day
Date: February 4
is_recurring: True
recurrence_rule: "RRULE:FREQ=YEARLY;BYMONTH=2;BYMONTHDAY=4"
year: null (template)

Generated Instances:
- Independence Day 2026 (date=2026-02-04, year=2026)
- Independence Day 2027 (date=2027-02-04, year=2027)
```

#### Pattern 3: Multi-Day Holiday (New Year)
```
Holiday Template 1: Sinhala & Tamil New Year Day 1
Date: April 13
is_recurring: True
recurrence_rule: "RRULE:FREQ=YEARLY;BYMONTH=4;BYMONTHDAY=13"

Holiday Template 2: Sinhala & Tamil New Year Day 2
Date: April 14
is_recurring: True
recurrence_rule: "RRULE:FREQ=YEARLY;BYMONTH=4;BYMONTHDAY=14"

Note: Create separate templates for each day
```

#### Pattern 4: Lunar Calendar (Poya Days)
```
Holiday: Vesak Poya (template)
Date: May full moon (varies)
is_recurring: True
recurrence_rule: null (calculated separately)
year: null

Note: Poya days require lunar calendar calculation
Cannot use simple RRULE, need external calculation
Seed data provides specific dates annually
```

### Recurring vs. Non-Recurring Holidays

| Aspect | Recurring Holiday | Non-Recurring Holiday |
|--------|------------------|----------------------|
| is_recurring | True | False |
| year | null (template) | Set (specific instance) |
| recurrence_rule | Set (if applicable) | null |
| Purpose | Template for generation | Actual holiday instance |
| Visibility | Usually hidden from UI | Shown in calendars |
| Examples | "Christmas (template)" | "Christmas 2026" |

### Holiday Generation Flow

```
┌──────────────────────────────────────────────────┐
│  Annual Holiday Generation Process               │
├──────────────────────────────────────────────────┤
│                                                   │
│  1. Query all recurring holiday templates        │
│     (is_recurring=True, year=null)               │
│                                                   │
│  2. For target year (e.g., 2027):                │
│     ├─ Parse recurrence_rule                     │
│     ├─ Calculate date for year                   │
│     └─ Check if instance exists                  │
│                                                   │
│  3. Create holiday instance if not exists:       │
│     ├─ Copy all fields from template             │
│     ├─ Set is_recurring=False                    │
│     ├─ Set year=2027                             │
│     ├─ Set calculated date                       │
│     └─ Save new holiday record                   │
│                                                   │
│  4. Repeat for all recurring templates           │
│                                                   │
└──────────────────────────────────────────────────┘
```

### RRULE Examples (RFC 5545)

```
Fixed Annual Date:
RRULE:FREQ=YEARLY;BYMONTH=12;BYMONTHDAY=25
→ Every December 25

Fixed Date with Multiple Years:
RRULE:FREQ=YEARLY;BYMONTH=5;BYMONTHDAY=1;COUNT=5
→ Every May 1 for 5 years

Weekday-Based (rare in Sri Lanka):
RRULE:FREQ=YEARLY;BYMONTH=11;BYDAY=4TH;BYDAY=TH
→ Fourth Thursday of November (US Thanksgiving style)

Note: For Poya days (lunar calendar), RRULE is not used.
Dates are calculated separately and seeded annually.
```

### Sri Lankan Recurring Holidays

#### Fixed Date Holidays (Use RRULE)
```
✓ Independence Day (Feb 4)
✓ May Day (May 1)
✓ Christmas Day (Dec 25)
✓ Thai Pongal (Jan 14/15 - Tamil calendar, approximately fixed)
```

#### Lunar Calendar Holidays (No RRULE, Manual Seed)
```
⊗ Vesak Poya (May full moon - varies)
⊗ Poson Poya (June full moon - varies)
⊗ Esala Poya (July full moon - varies)
⊗ All monthly Poya days (12 per year - varies)
⊗ Id-ul-Fitr (Islamic calendar - varies)
⊗ Id-ul-Alha (Islamic calendar - varies)
⊗ Milad-un-Nabi (Islamic calendar - varies)
⊗ Deepavali (Hindu calendar - varies)

Note: These require annual seeding with calculated dates
```

### Year Field Usage

```
┌─────────────────────────────────────────────────┐
│  Year Field Scenarios                            │
├─────────────────────────────────────────────────┤
│                                                  │
│  Scenario 1: Recurring Template                 │
│  ├─ is_recurring=True                           │
│  ├─ year=null                                   │
│  └─ Hidden from calendar, used for generation   │
│                                                  │
│  Scenario 2: Generated Instance                 │
│  ├─ is_recurring=False                          │
│  ├─ year=2026 (or specific year)                │
│  └─ Visible in calendar, used in calculations   │
│                                                  │
│  Scenario 3: One-Time Holiday                   │
│  ├─ is_recurring=False                          │
│  ├─ year=2026                                   │
│  └─ Single occurrence, not generated            │
│     Example: Company's 25th anniversary         │
│                                                  │
└─────────────────────────────────────────────────┘
```

### Recurring Holiday Management

```
Admin Interface Actions:
═══════════════════════

1. Create Recurring Template:
   - Set name, holiday_type, description
   - Set is_recurring=True
   - Set recurrence_rule (if applicable)
   - Leave year=null
   - Save as template

2. Generate Holidays for Year:
   - Run management command: generate_holidays --year=2027
   - System creates instances from templates
   - Populates calendar for upcoming year

3. Edit Template:
   - Changes apply to future generations only
   - Existing instances unchanged
   - Re-generate if needed

4. Deactivate Template:
   - Set is_active=False on template
   - Stop generating future instances
   - Existing instances remain active
```

### Expected Outcome
- Support for recurring holidays
- Template-based holiday generation
- RRULE format for complex patterns
- Year-specific holiday instances
- Foundation for annual holiday seeding

### Verification Checklist
- [ ] is_recurring field added (BooleanField)
- [ ] recurrence_rule field added (CharField, optional)
- [ ] year field added (IntegerField, optional)
- [ ] Meta class updated for recurring logic
- [ ] generate_instances_for_year method stub created
- [ ] Model docstring updated with recurring examples
- [ ] RRULE format documented

---

## Task 58: Run Holiday Migrations

### Overview
Create and apply database migrations for the Holiday model. This task generates the migration file that creates the `leave_holiday` table with all fields defined in Tasks 54-57, and applies it to the database.

### Dependencies
- Task 57: Add recurring holiday flag
- All Holiday model fields complete
- Database configured and accessible

### Instructions

1. **Review Holiday model**
   - Open `apps/leave/models/holiday.py`
   - Verify all fields are properly defined
   - Check Meta class configuration
   - Ensure imports are correct

2. **Check model registration**
   - Open `apps/leave/models/__init__.py`
   - Verify Holiday is imported
   - Verify Holiday is in __all__ list

3. **Generate migration file**
   - Open terminal in project root
   - Activate virtual environment
   - Run: `python manage.py makemigrations leave`
   - Django generates migration file

4. **Review generated migration**
   - Navigate to `apps/leave/migrations/`
   - Open newly created migration file (e.g., `0005_holiday.py`)
   - Verify all fields are included
   - Check field types and options
   - Review indexes and constraints

5. **Check for migration issues**
   - Look for warnings in makemigrations output
   - Address any field conflicts
   - Resolve any circular dependencies

6. **Apply migration to database**
   - Run: `python manage.py migrate leave`
   - Verify migration applies successfully
   - Check for any errors

7. **Verify database table**
   - Access database (psql or pgAdmin)
   - Verify `leave_holiday` table exists
   - Check all columns are created
   - Verify indexes are created

8. **Test model in Django shell**
   - Run: `python manage.py shell`
   - Import Holiday model
   - Create test holiday instance
   - Verify all fields work correctly

### Expected Migration File Structure

```python
# Generated migration file: 0005_holiday.py

from django.db import migrations, models
import django.db.models.deletion

class Migration(migrations.Migration):

    dependencies = [
        ('leave', '0004_previous_migration'),
        ('core', 'XXXX_department'),  # If Department dependency
    ]

    operations = [
        migrations.CreateModel(
            name='Holiday',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                
                # Core fields
                ('name', models.CharField(max_length=200)),
                ('date', models.DateField()),
                ('holiday_type', models.CharField(max_length=20, choices=[...])),
                ('description', models.TextField(blank=True, null=True)),
                ('is_active', models.BooleanField(default=True)),
                
                # Scope fields
                ('applies_to', models.CharField(max_length=20, choices=[...])),
                ('location', models.CharField(max_length=100, blank=True, null=True)),
                
                # Recurring fields
                ('is_recurring', models.BooleanField(default=False)),
                ('recurrence_rule', models.CharField(max_length=500, blank=True, null=True)),
                ('year', models.IntegerField(blank=True, null=True)),
                
                # Foreign keys
                ('tenant', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='core.tenant')),
                ('department', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='holidays', to='core.department')),
            ],
            options={
                'verbose_name': 'Holiday',
                'verbose_name_plural': 'Holidays',
                'ordering': ['-date'],
            },
        ),
        
        migrations.AddIndex(
            model_name='holiday',
            index=models.Index(fields=['tenant', 'date'], name='leave_holi_tenant_date_idx'),
        ),
        
        migrations.AddIndex(
            model_name='holiday',
            index=models.Index(fields=['tenant', 'is_active'], name='leave_holi_tenant_active_idx'),
        ),
        
        # Additional indexes...
    ]
```

### Database Table Structure

```sql
-- leave_holiday table structure

CREATE TABLE leave_holiday (
    id                  BIGSERIAL PRIMARY KEY,
    created_at          TIMESTAMP WITH TIME ZONE NOT NULL,
    updated_at          TIMESTAMP WITH TIME ZONE NOT NULL,
    
    -- Core fields
    name                VARCHAR(200) NOT NULL,
    date                DATE NOT NULL,
    holiday_type        VARCHAR(20) NOT NULL,
    description         TEXT NULL,
    is_active           BOOLEAN NOT NULL DEFAULT TRUE,
    
    -- Scope fields
    applies_to          VARCHAR(20) NOT NULL DEFAULT 'ALL',
    location            VARCHAR(100) NULL,
    
    -- Recurring fields
    is_recurring        BOOLEAN NOT NULL DEFAULT FALSE,
    recurrence_rule     VARCHAR(500) NULL,
    year                INTEGER NULL,
    
    -- Foreign keys
    tenant_id           BIGINT NOT NULL REFERENCES core_tenant(id) ON DELETE CASCADE,
    department_id       BIGINT NULL REFERENCES core_department(id) ON DELETE CASCADE,
    
    -- Indexes
    INDEX idx_tenant_date (tenant_id, date),
    INDEX idx_tenant_active (tenant_id, is_active),
    INDEX idx_tenant_applies_to (tenant_id, applies_to),
    INDEX idx_tenant_dept_date (tenant_id, department_id, date),
    INDEX idx_tenant_recurring (tenant_id, is_recurring)
);
```

### Migration Verification Steps

```bash
# Step 1: Check model is ready
python manage.py check leave

# Step 2: Generate migration
python manage.py makemigrations leave

# Expected output:
# Migrations for 'leave':
#   leave/migrations/0005_holiday.py
#     - Create model Holiday
#     - Add index Holiday [tenant, date]
#     - Add index Holiday [tenant, is_active]

# Step 3: Check migration plan
python manage.py showmigrations leave

# Step 4: Apply migration
python manage.py migrate leave

# Expected output:
# Running migrations:
#   Applying leave.0005_holiday... OK

# Step 5: Verify in database
python manage.py dbshell
# Then in psql:
\dt leave_holiday
\d leave_holiday
```

### Testing in Django Shell

```python
# Start Django shell
python manage.py shell

# Import required models
from apps.leave.models import Holiday
from apps.core.models import Tenant
from datetime import date

# Get or create a tenant (for testing)
tenant = Tenant.objects.first()

# Create a test holiday
holiday = Holiday.objects.create(
    tenant=tenant,
    name="Test Independence Day",
    date=date(2026, 2, 4),
    holiday_type='PUBLIC',
    description="Test holiday for verification",
    applies_to='ALL',
    is_active=True,
    is_recurring=True,
    recurrence_rule="RRULE:FREQ=YEARLY;BYMONTH=2;BYMONTHDAY=4",
    year=2026
)

# Verify creation
print(f"Holiday created: {holiday}")
print(f"Holiday ID: {holiday.id}")
print(f"Holiday name: {holiday.name}")
print(f"Holiday date: {holiday.date}")

# Query holidays
holidays = Holiday.objects.filter(tenant=tenant)
print(f"Total holidays: {holidays.count()}")

# Clean up test data
holiday.delete()
print("Test holiday deleted")
```

### Common Migration Issues

| Issue | Cause | Solution |
|-------|-------|----------|
| Model not detected | Not in __init__.py | Add to models/__init__.py |
| No migrations created | No changes detected | Check model syntax |
| Foreign key error | Referenced model missing | Check dependencies |
| Unique constraint error | Existing data conflicts | Adjust unique_together |
| Index name too long | Long field names | Use custom index name |

### Rollback Plan

```bash
# If migration fails or needs to be rolled back:

# Step 1: Check current migration status
python manage.py showmigrations leave

# Step 2: Roll back to previous migration
python manage.py migrate leave 0004_previous_migration

# Step 3: Delete problematic migration file
rm apps/leave/migrations/0005_holiday.py

# Step 4: Fix model issues

# Step 5: Regenerate migration
python manage.py makemigrations leave

# Step 6: Apply again
python manage.py migrate leave
```

### Expected Outcome
- Migration file generated successfully
- Holiday table created in database
- All fields, indexes, and constraints in place
- Model ready for data entry
- No migration errors

### Verification Checklist
- [ ] `python manage.py check` passes
- [ ] `python manage.py makemigrations leave` successful
- [ ] Migration file created (0005_holiday.py or similar)
- [ ] Migration file reviewed and correct
- [ ] `python manage.py migrate leave` successful
- [ ] Database table `leave_holiday` exists
- [ ] All columns present in database
- [ ] Indexes created successfully
- [ ] Foreign key constraints working
- [ ] Test holiday creation successful

---

## Task 59: Create Sri Lanka Holidays Seed

### Overview
Create a management command to seed Sri Lankan public holidays into the database. This includes national holidays, Poya days (monthly full moon days), religious festivals, and important cultural observances. The seed data should cover multiple years and include both recurring holiday templates and specific year instances.

### Dependencies
- Task 58: Run Holiday migrations
- Holiday model fully functional
- Management commands structure exists

### Instructions

1. **Create management command file**
   - Navigate to `apps/leave/management/commands/`
   - Create file: `seed_holidays.py`
   - If management/commands directories don't exist, create them

2. **Create __init__.py files**
   - Create `apps/leave/management/__init__.py` (empty)
   - Create `apps/leave/management/commands/__init__.py` (empty)

3. **Import required modules**
   - Import Django BaseCommand
   - Import Holiday model
   - Import Tenant model
   - Import date utilities
   - Import HOLIDAY_TYPE constants

4. **Define Command class**
   - Inherit from BaseCommand
   - Add help text describing command purpose

5. **Add command arguments**
   - Add --year argument (optional, default to current year)
   - Add --tenant argument (optional, seed for specific tenant)
   - Add --all-tenants flag (seed for all tenants)

6. **Create fixed-date holidays method**
   - Method: `create_fixed_holidays(tenant, year)`
   - Create non-Poya public holidays
   - Independence Day, May Day, New Year, Christmas, etc.

7. **Create Poya holidays method**
   - Method: `create_poya_holidays(tenant, year)`
   - Create all 12 monthly Poya days for the year
   - Include exact dates for the specified year
   - Poya dates must be researched for accuracy

8. **Create optional holidays method**
   - Method: `create_optional_holidays(tenant, year)`
   - Create religious/cultural optional holidays
   - Deepavali, Thai Pongal, religious observances

9. **Create recurring templates method**
   - Method: `create_recurring_templates(tenant)`
   - Create recurring holiday templates
   - Fixed-date holidays with recurrence rules
   - Set is_recurring=True, year=null

10. **Implement handle method**
    - Determine target tenants
    - Get target year
    - Call holiday creation methods
    - Display progress and summary
    - Handle errors gracefully

11. **Add data validation**
    - Check for duplicate holidays before creation
    - Use get_or_create for idempotency
    - Log skipped duplicates

12. **Add comprehensive Sri Lankan holidays**
    - Include all public holidays per Sri Lankan government
    - Include accurate Poya dates
    - Include regional/religious holidays
    - Add descriptions in English (and optionally Sinhala/Tamil)

### Sri Lankan Public Holidays (2026)

#### Fixed Date Holidays

| Date | Holiday Name | Type | Description |
|------|--------------|------|-------------|
| Jan 14 | Thai Pongal | PUBLIC | Tamil harvest festival |
| Feb 4 | Independence Day | PUBLIC | National Day of Sri Lanka |
| Apr 13 | Sinhala & Tamil New Year (Day 1) | PUBLIC | Traditional New Year |
| Apr 14 | Sinhala & Tamil New Year (Day 2) | PUBLIC | Traditional New Year |
| May 1 | May Day | PUBLIC | International Workers' Day |
| Dec 25 | Christmas Day | PUBLIC | Christian festival |

#### Poya Days (Full Moon) - 2026

| Month | Date | Poya Name | Description |
|-------|------|-----------|-------------|
| January | Jan 4 | Duruthu Poya | Commemorates Buddha's first visit to Sri Lanka |
| February | Feb 3 | Navam Poya | Appointment of chief disciples |
| March | Mar 4 | Madin Poya | Buddha's first visit to his father's palace |
| April | Apr 3 | Bak Poya | Buddha's second visit to Sri Lanka |
| May | May 3 | Vesak Poya | **Most important - Birth, Enlightenment, Death of Buddha** |
| June | Jun 1 | Poson Poya | Introduction of Buddhism to Sri Lanka |
| July | Jul 1 | Esala Poya | Buddha's first sermon |
| August | Jul 31 | Nikini Poya | First Buddhist Council |
| September | Aug 29 | Binara Poya | Buddha's visit to heaven |
| October | Sep 28 | Vap Poya | End of Rainy Season retreat |
| November | Oct 27 | Il Poya | Buddha's preaching of Abhidharma |
| December | Nov 26 | Unduvap Poya | Arrival of Sanghamitta Theri with Bodhi sapling |

*Note: Poya dates are based on lunar calendar and may vary. These are approximate for 2026.*

#### Optional/Restricted Holidays (2026)

| Date (Approx) | Holiday Name | Religion/Community | Type |
|---------------|--------------|-------------------|------|
| Mar 14 | Maha Sivarathri Day | Hindu | OPTIONAL |
| Apr 18 | Good Friday | Christian | OPTIONAL |
| Oct 22 | Deepavali | Hindu | OPTIONAL |
| TBD | Id-ul-Fitr (Ramadan) | Islamic | OPTIONAL |
| TBD | Id-ul-Alha (Hajj) | Islamic | OPTIONAL |
| TBD | Milad-un-Nabi | Islamic | OPTIONAL |

*Note: Islamic holidays depend on lunar sightings and vary each year.*

### Management Command Structure

```python
# apps/leave/management/commands/seed_holidays.py

from django.core.management.base import BaseCommand
from apps.leave.models import Holiday
from apps.core.models import Tenant
from apps.leave.constants import HOLIDAY_TYPE_PUBLIC, HOLIDAY_TYPE_OPTIONAL
from datetime import date

class Command(BaseCommand):
    help = 'Seed Sri Lankan public holidays into the database'
    
    def add_arguments(self, parser):
        parser.add_argument(
            '--year',
            type=int,
            default=2026,
            help='Year to seed holidays for (default: 2026)'
        )
        parser.add_argument(
            '--tenant',
            type=int,
            help='Tenant ID to seed holidays for (optional)'
        )
        parser.add_argument(
            '--all-tenants',
            action='store_true',
            help='Seed holidays for all tenants'
        )
    
    def handle(self, *args, **options):
        # Implementation in next section
        pass
```

### Holiday Creation Example

```python
def create_fixed_holidays(self, tenant, year):
    """Create fixed-date public holidays for Sri Lanka"""
    
    fixed_holidays = [
        {
            'name': 'Thai Pongal',
            'date': date(year, 1, 14),
            'holiday_type': HOLIDAY_TYPE_PUBLIC,
            'description': 'Tamil harvest festival. Celebrated by the Tamil community throughout Sri Lanka.',
            'applies_to': 'ALL',
        },
        {
            'name': 'Independence Day',
            'date': date(year, 2, 4),
            'holiday_type': HOLIDAY_TYPE_PUBLIC,
            'description': 'National Day commemorating independence from British rule on February 4, 1948.',
            'applies_to': 'ALL',
        },
        {
            'name': 'Sinhala and Tamil New Year Day 1',
            'date': date(year, 4, 13),
            'holiday_type': HOLIDAY_TYPE_PUBLIC,
            'description': 'Traditional New Year celebrated by both Sinhala and Tamil communities.',
            'applies_to': 'ALL',
        },
        {
            'name': 'Sinhala and Tamil New Year Day 2',
            'date': date(year, 4, 14),
            'holiday_type': HOLIDAY_TYPE_PUBLIC,
            'description': 'Second day of traditional New Year celebrations.',
            'applies_to': 'ALL',
        },
        {
            'name': 'May Day',
            'date': date(year, 5, 1),
            'holiday_type': HOLIDAY_TYPE_PUBLIC,
            'description': 'International Workers Day. Public holiday in Sri Lanka.',
            'applies_to': 'ALL',
        },
        {
            'name': 'Christmas Day',
            'date': date(year, 12, 25),
            'holiday_type': HOLIDAY_TYPE_PUBLIC,
            'description': 'Christian festival celebrating the birth of Jesus Christ.',
            'applies_to': 'ALL',
        },
    ]
    
    created_count = 0
    for holiday_data in fixed_holidays:
        holiday, created = Holiday.objects.get_or_create(
            tenant=tenant,
            name=holiday_data['name'],
            date=holiday_data['date'],
            defaults={
                'holiday_type': holiday_data['holiday_type'],
                'description': holiday_data['description'],
                'applies_to': holiday_data['applies_to'],
                'is_active': True,
                'is_recurring': False,
                'year': year,
            }
        )
        if created:
            created_count += 1
            self.stdout.write(self.style.SUCCESS(f'  ✓ Created: {holiday.name}'))
        else:
            self.stdout.write(f'  - Skipped: {holiday.name} (already exists)')
    
    return created_count
```

### Poya Holidays Creation

```python
def create_poya_holidays(self, tenant, year):
    """Create Poya (full moon) holidays for Sri Lanka"""
    
    # Poya dates for 2026 (based on lunar calendar)
    poya_holidays = [
        {
            'name': 'Duruthu Full Moon Poya Day',
            'date': date(2026, 1, 4),
            'description': 'Commemorates the Buddha\'s first visit to Sri Lanka, nine months after Enlightenment.',
        },
        {
            'name': 'Navam Full Moon Poya Day',
            'date': date(2026, 2, 3),
            'description': 'Commemorates the appointment of the Buddha\'s two chief disciples.',
        },
        {
            'name': 'Madin Full Moon Poya Day',
            'date': date(2026, 3, 4),
            'description': 'Commemorates the Buddha\'s first visit to his father\'s palace after Enlightenment.',
        },
        {
            'name': 'Bak Full Moon Poya Day',
            'date': date(2026, 4, 3),
            'description': 'Commemorates the Buddha\'s second visit to Sri Lanka.',
        },
        {
            'name': 'Vesak Full Moon Poya Day',
            'date': date(2026, 5, 3),
            'description': 'The most important Buddhist festival. Commemorates the birth, enlightenment, and death of Lord Buddha. Celebrated with lanterns, pandals, and dansalas.',
        },
        {
            'name': 'Poson Full Moon Poya Day',
            'date': date(2026, 6, 1),
            'description': 'Commemorates the introduction of Buddhism to Sri Lanka by Arahant Mahinda.',
        },
        {
            'name': 'Esala Full Moon Poya Day',
            'date': date(2026, 7, 1),
            'description': 'Commemorates the Buddha\'s first sermon (Dhammacakkappavattana Sutta).',
        },
        {
            'name': 'Nikini Full Moon Poya Day',
            'date': date(2026, 7, 31),
            'description': 'Commemorates the first Buddhist Council.',
        },
        {
            'name': 'Binara Full Moon Poya Day',
            'date': date(2026, 8, 29),
            'description': 'Commemorates the Buddha\'s visit to heaven to preach the Abhidharma.',
        },
        {
            'name': 'Vap Full Moon Poya Day',
            'date': date(2026, 9, 28),
            'description': 'Commemorates the end of the three-month Rainy Season retreat.',
        },
        {
            'name': 'Il Full Moon Poya Day',
            'date': date(2026, 10, 27),
            'description': 'Commemorates the Buddha preaching the Abhidharma Pitaka.',
        },
        {
            'name': 'Unduvap Full Moon Poya Day',
            'date': date(2026, 11, 26),
            'description': 'Commemorates the arrival of Sanghamitta Theri with the sacred Bodhi sapling.',
        },
    ]
    
    created_count = 0
    for poya_data in poya_holidays:
        holiday, created = Holiday.objects.get_or_create(
            tenant=tenant,
            name=poya_data['name'],
            date=poya_data['date'],
            defaults={
                'holiday_type': HOLIDAY_TYPE_PUBLIC,
                'description': poya_data['description'],
                'applies_to': 'ALL',
                'is_active': True,
                'is_recurring': False,
                'year': year,
            }
        )
        if created:
            created_count += 1
            self.stdout.write(self.style.SUCCESS(f'  ✓ Created: {holiday.name}'))
        else:
            self.stdout.write(f'  - Skipped: {holiday.name} (already exists)')
    
    return created_count
```

### Command Execution

```bash
# Seed holidays for all tenants (current year 2026)
python manage.py seed_holidays --all-tenants

# Seed holidays for specific year
python manage.py seed_holidays --year=2027 --all-tenants

# Seed holidays for specific tenant
python manage.py seed_holidays --tenant=1 --year=2026

# Expected output:
# Seeding holidays for Tenant: LankaCommerce (ID: 1)
# Creating fixed-date holidays for 2026...
#   ✓ Created: Thai Pongal
#   ✓ Created: Independence Day
#   ✓ Created: Sinhala and Tamil New Year Day 1
#   ✓ Created: Sinhala and Tamil New Year Day 2
#   ✓ Created: May Day
#   ✓ Created: Christmas Day
# 
# Creating Poya holidays for 2026...
#   ✓ Created: Duruthu Full Moon Poya Day
#   ✓ Created: Navam Full Moon Poya Day
#   ...
# 
# ✅ Successfully seeded 18 public holidays for 2026
```

### Multi-Year Seeding

```python
def handle(self, *args, **options):
    """Main command handler"""
    
    # Get target year
    year = options['year']
    
    # Determine tenants to seed
    if options['all_tenants']:
        tenants = Tenant.objects.filter(is_active=True)
        self.stdout.write(self.style.SUCCESS(f'Seeding holidays for all active tenants'))
    elif options['tenant']:
        tenants = [Tenant.objects.get(id=options['tenant'])]
    else:
        self.stdout.write(self.style.ERROR('Please specify --tenant or --all-tenants'))
        return
    
    # Seed for each tenant
    total_created = 0
    for tenant in tenants:
        self.stdout.write(f'\nSeeding holidays for Tenant: {tenant.name} (ID: {tenant.id})')
        
        self.stdout.write('Creating fixed-date holidays...')
        fixed_count = self.create_fixed_holidays(tenant, year)
        
        self.stdout.write('Creating Poya holidays...')
        poya_count = self.create_poya_holidays(tenant, year)
        
        self.stdout.write('Creating optional holidays...')
        optional_count = self.create_optional_holidays(tenant, year)
        
        tenant_total = fixed_count + poya_count + optional_count
        total_created += tenant_total
        
        self.stdout.write(self.style.SUCCESS(
            f'✅ Seeded {tenant_total} holidays for {tenant.name}'
        ))
    
    self.stdout.write(self.style.SUCCESS(
        f'\n🎉 Total holidays created: {total_created}'
    ))
```

### Expected Outcome
- Management command created and functional
- Sri Lankan public holidays seeded for target year
- All 12 Poya days included with accurate dates
- Fixed-date holidays included
- Optional holidays included
- Idempotent execution (can run multiple times safely)
- Support for multi-tenant seeding

### Verification Checklist
- [ ] `seed_holidays.py` management command created
- [ ] `__init__.py` files in management structure
- [ ] Command arguments (--year, --tenant, --all-tenants) implemented
- [ ] `create_fixed_holidays` method implemented
- [ ] `create_poya_holidays` method implemented
- [ ] `create_optional_holidays` method implemented
- [ ] All 2026 holidays included with accurate dates
- [ ] Poya days researched and dates verified
- [ ] Command executable: `python manage.py seed_holidays`
- [ ] Holidays created successfully in database
- [ ] Duplicate prevention working (get_or_create)
- [ ] Multi-tenant support working
- [ ] Comprehensive holiday descriptions added

---

## Summary

This document established the Holiday model and seed data for Sri Lankan holidays:

### Completed Infrastructure
- ✅ HolidayType choices (PUBLIC, BANK, COMPANY, OPTIONAL)
- ✅ Holiday model with core fields (name, date, type, description)
- ✅ Holiday scope fields (applies_to, department, location)
- ✅ Recurring holiday support (is_recurring, recurrence_rule, year)
- ✅ Database migrations applied
- ✅ Sri Lanka holidays seed command with 18+ holidays

### Key Achievements
1. **Comprehensive Holiday System** - Support for all holiday types
2. **Sri Lankan Context** - All public holidays and Poya days included
3. **Flexible Scoping** - Company-wide, department, or location-specific
4. **Recurring Holidays** - Template-based annual generation
5. **Seed Data** - Ready-to-use Sri Lankan holidays for 2026+

### Next Steps
Proceed to [02_Tasks-60-66_Calendar-Service-WorkDays.md](02_Tasks-60-66_Calendar-Service-WorkDays.md) to implement the LeaveCalendarService, team/department calendars, holiday calendar integration, and working days calculation logic.

---

**Document Status:** ✅ Complete  
**Total Tasks:** 7  
**Total Lines:** ~1380
