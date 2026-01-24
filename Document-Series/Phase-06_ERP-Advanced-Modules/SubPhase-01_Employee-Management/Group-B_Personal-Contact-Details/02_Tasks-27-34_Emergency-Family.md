# Tasks 27-34: Emergency Contacts and Family Information

> **Phase:** 06 - ERP Advanced Modules  
> **SubPhase:** 01 - Employee Management  
> **Group:** B - Personal & Contact Details  
> **Document:** 02 of 02  
> **Tasks Covered:** 27, 28, 29, 30, 31, 32, 33, 34

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-19-26_Email-Phone-Address.md](01_Tasks-19-26_Email-Phone-Address.md)

---

## Document Overview

This document covers the implementation of emergency contact and family member information for employees. These models enable storing critical contact information for emergencies and maintaining family member records for benefits, insurance, and dependent management.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 27 | Create EmergencyContact Model | Medium | 25 min |
| 28 | Add Emergency Contact Fields | Medium | 20 min |
| 29 | Add Emergency Priority | Low | 15 min |
| 30 | Run EmergencyContact Migrations | Low | 15 min |
| 31 | Create EmployeeFamily Model | Medium | 25 min |
| 32 | Add Family Member Fields | Medium | 20 min |
| 33 | Add Dependent Flag | Low | 15 min |
| 34 | Run EmployeeFamily Migrations | Low | 15 min |

---

## Task 27: Create EmergencyContact Model

### Overview
Create the EmergencyContact model to store emergency contact information for employees. This model maintains details of people to contact in case of emergencies, including their relationship to the employee and contact methods.

### Dependencies
- Employee model exists
- TenantAwareMixin and TimestampMixin available
- Phone validator created (from Task 21)

### Instructions

1. **Create emergency_contact.py model file**
   - Create file at `apps/employees/models/emergency_contact.py`
   - Import necessary Django components
   - Import base model mixins

2. **Import required modules**
   - Import Django model fields
   - Import TenantAwareMixin
   - Import TimestampMixin
   - Import Employee model
   - Import gettext_lazy for translations
   - Import phone validator from employees.validators

3. **Define EmergencyContact model class**
   - Inherit from TenantAwareMixin and TimestampMixin
   - Add model docstring explaining purpose
   - Note: Supports multiple emergency contacts per employee

4. **Add employee foreign key**
   - ForeignKey to Employee model
   - on_delete=models.CASCADE (delete contacts when employee deleted)
   - related_name='emergency_contacts'
   - Allow accessing employee.emergency_contacts.all()

5. **Add model docstring**
   - Document purpose: Emergency contact information
   - Note support for multiple contacts
   - Explain priority system
   - List relationship types

6. **Add Meta class**
   - Set verbose_name to "Emergency Contact"
   - Set verbose_name_plural to "Emergency Contacts"
   - Add ordering by ['employee', 'priority']
   - Add index on (employee, priority)

7. **Add __str__ method**
   - Return string showing name and relationship
   - Format: "Contact Name (Relationship to Employee)"
   - Example: "Jane Doe (Spouse of John Doe)"

8. **Update models/__init__.py**
   - Import EmergencyContact model
   - Add to __all__ list
   - Enable easy imports

### EmergencyContact Model Structure

```
┌────────────────────────────────────────────────┐
│          EmergencyContact Model                 │
├────────────────────────────────────────────────┤
│ Relationship:                                  │
│  • employee (ForeignKey to Employee)           │
│                                                │
│ Contact Info (to be added in Task 28):        │
│  • name (CharField)                            │
│  • relationship (CharField with choices)       │
│  • phone (CharField with validation)           │
│  • email (EmailField, optional)                │
│                                                │
│ Priority (to be added in Task 29):            │
│  • priority (IntegerField)                     │
│  • notes (TextField, optional)                 │
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
│    Employee    │◄─────────────────────│  EmergencyContact    │
│                │                      │                      │
│ • id           │                      │ • employee_id (FK)   │
│ • first_name   │                      │ • name               │
│ • last_name    │                      │ • relationship       │
│ • nic_number   │                      │ • phone              │
│ • mobile       │                      │ • priority           │
└────────────────┘                      └──────────────────────┘

One employee can have multiple emergency contacts:
  • Primary contact (priority 1)
  • Secondary contact (priority 2)
  • Additional contacts (priority 3+)
```

### Emergency Contact Examples

#### Example 1: Single Emergency Contact
```
Employee: John Doe
└── Emergency Contact 1 (Priority 1)
    ├── Name: Jane Doe
    ├── Relationship: Spouse
    ├── Phone: +94 77 123 4567
    └── Email: jane.doe@gmail.com
```

#### Example 2: Multiple Emergency Contacts
```
Employee: Pradeep Silva
├── Emergency Contact 1 (Priority 1)
│   ├── Name: Samanthi Silva
│   ├── Relationship: Spouse
│   ├── Phone: +94 71 234 5678
│   └── Email: samanthi@gmail.com
│
├── Emergency Contact 2 (Priority 2)
│   ├── Name: Ranjith Silva
│   ├── Relationship: Father
│   ├── Phone: +94 11 234 5678
│   └── Email: (none)
│
└── Emergency Contact 3 (Priority 3)
    ├── Name: Nimal Perera
    ├── Relationship: Friend
    ├── Phone: +94 76 987 6543
    └── Email: nimal@example.com
```

#### Example 3: Young Employee
```
Employee: Kasun Fernando (Age 22)
├── Emergency Contact 1 (Priority 1)
│   ├── Name: Sumana Fernando
│   ├── Relationship: Mother
│   ├── Phone: +94 77 555 1234
│   └── Email: sumana@yahoo.com
│
└── Emergency Contact 2 (Priority 2)
    ├── Name: Anil Fernando
    ├── Relationship: Father
    ├── Phone: +94 11 222 3344
    └── Email: anil@gmail.com
```

### Emergency Contact Purpose

```
Why Emergency Contacts Are Critical
═══════════════════════════════════

Medical Emergencies:
✓ Hospital notification
✓ Medical decision authorization
✓ Family notification
✓ Insurance coordination

Workplace Accidents:
✓ Immediate family notification
✓ Transportation arrangement
✓ Medical consent
✓ Incident reporting

Personal Emergencies:
✓ Family crisis communication
✓ Employee absence notification
✓ Welfare checks
✓ Support coordination

Legal Requirements:
✓ Occupational health & safety compliance
✓ Employee welfare regulations
✓ Emergency response procedures
✓ Documentation requirements
```

### Sri Lankan Context

```
Emergency Contact Considerations in Sri Lanka
════════════════════════════════════════════

Cultural Factors:
  • Strong family ties
  • Extended family involvement
  • Community support systems
  • Multi-generational households

Common Contact Patterns:
  • Spouse as primary contact
  • Parents as secondary contacts
  • Siblings as backup contacts
  • Close friends for unmarried employees

Communication Preferences:
  • Mobile phone primary method
  • WhatsApp widely used
  • SMS for critical notifications
  • Voice calls for emergencies

Language Considerations:
  • Contact may prefer Sinhala/Tamil
  • Note language preference
  • Use appropriate interpreter if needed
```

### Emergency Contact Usage Scenarios

#### Scenario 1: Medical Emergency
```
Situation: Employee collapses at work

Action Steps:
1. Call emergency services (1990)
2. Contact primary emergency contact
   └── Phone: +94 77 123 4567 (Spouse)
3. If unreachable, contact secondary
   └── Phone: +94 71 234 5678 (Parent)
4. Inform HR department
5. Arrange hospital transport
6. Coordinate with insurance
```

#### Scenario 2: Workplace Accident
```
Situation: Employee injured in warehouse

Action Steps:
1. Provide first aid
2. Contact primary emergency contact
3. Notify supervisor
4. Document incident
5. Arrange medical care
6. File accident report
7. Insurance claim processing
```

#### Scenario 3: Employee Absence
```
Situation: Employee doesn't report to work

Action Steps:
1. Try employee's mobile
2. Try employee's email
3. Contact primary emergency contact
   └── Check employee welfare
4. Escalate to HR if no response
5. Document communication attempts
```

#### Scenario 4: Family Emergency
```
Situation: Message for employee (family emergency)

Action Steps:
1. Locate employee
2. Provide private space
3. Relay message sensitively
4. Offer support
5. Arrange leave if needed
6. Document incident
```

### Database Schema (Preview)

```
employees_employee              employees_emergency_contact
├── id (PK)                    ├── id (PK)
├── tenant_id (FK)            ├── tenant_id (FK)
├── employee_number           ├── employee_id (FK) ──┐
├── first_name                ├── name               │
├── last_name                 ├── relationship       │
├── mobile                    ├── phone              │
└── ...                       ├── email              │
                              ├── priority           │
      ┌───────────────────────┘
      │
      │ Relationship:
      │ One Employee → Many Emergency Contacts
      └─ employee.emergency_contacts.all()
```

### Expected Outcome
- EmergencyContact model created
- Foreign key to Employee established
- Model inherits tenant awareness and timestamps
- Foundation for contact fields
- Related name allows easy access

### Verification Checklist
- [ ] emergency_contact.py file created
- [ ] Required modules imported
- [ ] EmergencyContact class defined
- [ ] Inherits from TenantAwareMixin
- [ ] Inherits from TimestampMixin
- [ ] employee ForeignKey added
- [ ] on_delete=models.CASCADE set
- [ ] related_name='emergency_contacts' set
- [ ] Model docstring added
- [ ] Meta class defined
- [ ] verbose_name set
- [ ] __str__ method implemented
- [ ] Model imported in __init__.py

---

## Task 28: Add Emergency Contact Fields

### Overview
Add fields to the EmergencyContact model to store contact person details, including name, relationship, phone number, and optional email address. These fields enable proper identification and communication with emergency contacts.

### Dependencies
- Task 27: Create EmergencyContact Model
- Phone validator available (from Task 21)

### Instructions

1. **Open emergency_contact.py model file**
   - Navigate to `apps/employees/models/emergency_contact.py`
   - Locate EmergencyContact model class

2. **Define RELATIONSHIP_CHOICES constant**
   - Create tuple of relationship choices
   - Include common relationships
   - Format: (value, display_name)

3. **Add name field**
   - CharField with max_length=200
   - Required field (no blank/null)
   - Full name of emergency contact
   - Label: "Full Name"
   - Help text: "Full name of emergency contact person"

4. **Add relationship field**
   - CharField with choices from RELATIONSHIP_CHOICES
   - Max length 20
   - Required field (no blank/null)
   - Describes relationship to employee
   - Label: "Relationship"
   - Help text: "Relationship to employee"

5. **Add phone field**
   - CharField with max_length=20
   - Required field (no blank/null)
   - Use phone validator from Task 21
   - Sri Lankan phone format
   - Label: "Phone Number"
   - Help text: "Phone number in +94 XX XXX XXXX format"

6. **Add email field**
   - EmailField with max_length=255
   - Optional (blank=True, null=True)
   - Backup contact method
   - Label: "Email Address"
   - Help text: "Email address (optional)"

7. **Import validators**
   - Import validate_sri_lanka_phone from employees.validators
   - Add to phone field validators parameter

8. **Update model docstring**
   - Document all contact fields
   - Note required vs optional fields
   - List relationship options

9. **Update __str__ method**
   - Include name and relationship
   - Format: "Name (Relationship)"
   - Example: "Jane Doe (Spouse)"

### Emergency Contact Fields Structure

```
┌────────────────────────────────────────────────┐
│        Emergency Contact Core Fields            │
├────────────────────────────────────────────────┤
│ Identity:                                      │
│  • name (CharField, 200) - Required            │
│    Full name of contact person                 │
│                                                │
│ Relationship:                                  │
│  • relationship (CharField with choices)       │
│    PARENT, SPOUSE, SIBLING, CHILD,             │
│    FRIEND, OTHER                               │
│                                                │
│ Communication:                                 │
│  • phone (CharField, 20) - Required            │
│    Validated Sri Lankan format                 │
│                                                │
│  • email (EmailField, 255) - Optional          │
│    Backup contact method                       │
└────────────────────────────────────────────────┘
```

### Relationship Choices

```python
RELATIONSHIP_CHOICES = (
    ('parent', 'Parent'),
    ('spouse', 'Spouse'),
    ('sibling', 'Sibling'),
    ('child', 'Child'),
    ('friend', 'Friend'),
    ('relative', 'Other Relative'),
    ('other', 'Other'),
)
```

### Relationship Types Details

| Relationship | Code | Common For | Priority Tendency |
|-------------|------|------------|------------------|
| Parent | 'parent' | Young/unmarried employees | High |
| Spouse | 'spouse' | Married employees | Highest |
| Sibling | 'sibling' | Unmarried, close family | Medium |
| Child | 'child' | Older employees | Medium |
| Friend | 'friend' | Backup contacts | Lower |
| Other Relative | 'relative' | Extended family | Medium |
| Other | 'other' | Special cases | Varies |

### Emergency Contact Examples by Relationship

#### Example 1: Married Employee
```
Primary Contact: Spouse
├── Name: Samanthi Perera
├── Relationship: Spouse
├── Phone: +94 77 123 4567
└── Email: samanthi@gmail.com

Secondary Contact: Parent
├── Name: Kamal Fernando
├── Relationship: Father
├── Phone: +94 11 234 5678
└── Email: (none)
```

#### Example 2: Young Unmarried Employee
```
Primary Contact: Parent
├── Name: Sumana Silva
├── Relationship: Mother
├── Phone: +94 71 555 1234
└── Email: sumana@yahoo.com

Secondary Contact: Sibling
├── Name: Niluka Silva
├── Relationship: Sister
├── Phone: +94 76 987 6543
└── Email: niluka@hotmail.com
```

#### Example 3: Senior Employee
```
Primary Contact: Spouse
├── Name: Indrani Jayawardena
├── Relationship: Spouse
├── Phone: +94 77 234 5678
└── Email: indrani@gmail.com

Secondary Contact: Child
├── Name: Chathura Jayawardena
├── Relationship: Son
├── Phone: +94 76 345 6789
└── Email: chathura@outlook.com
```

#### Example 4: Employee Living Alone
```
Primary Contact: Friend
├── Name: Nimal Perera
├── Relationship: Friend
├── Phone: +94 71 777 8888
└── Email: nimal@example.com

Secondary Contact: Sibling
├── Name: Priya Fernando
├── Relationship: Sister (lives abroad)
├── Phone: +94 77 999 0000
└── Email: priya@international.com
```

### Field Validation Rules

```
Name Field Validation
═════════════════════
✓ Required (no blank)
✓ Max length: 200 characters
✓ Should be full name
✓ Accept Sinhala/Tamil characters
✓ Examples:
  • "Jane Doe"
  • "සමන්ති සිල්වා"
  • "கமல் பெர்னாண்டோ"

Relationship Field Validation
═════════════════════════════
✓ Required (no blank)
✓ Must be from choices list
✓ Values: parent, spouse, sibling, child, friend, relative, other

Phone Field Validation
══════════════════════
✓ Required (no blank)
✓ Sri Lankan format validator applied
✓ Format: +94 XX XXX XXXX
✓ Mobile or landline accepted
✓ Examples:
  • +94 77 123 4567 (mobile)
  • +94 11 234 5678 (landline)

Email Field Validation
══════════════════════
✓ Optional (can be blank)
✓ Valid email format if provided
✓ Max length: 255 characters
✓ Examples:
  • contact@gmail.com
  • emergency@yahoo.com
```

### Sri Lankan Name Considerations

```
Multi-Language Name Support
═══════════════════════════

English Names:
  • "John Doe"
  • "Pradeep Fernando"
  • "Kasun Silva"

Sinhala Names:
  • "සමන්ති පෙරේරා"
  • "කමල් ජයවර්ධන"
  • "නිමල් සිල්වා"

Tamil Names:
  • "கமல் பெர்னாண்டோ"
  • "சமந்தி பெரேரா"
  • "நிமல் சில்வா"

Mixed Format:
  • "Pradeep (ප්‍රදීප්) Fernando"
  • Use for clarity when needed
```

### Contact Information Best Practices

```
Phone Number Best Practices
═══════════════════════════

1. Always include country code (+94)
2. Prefer mobile numbers (more reachable)
3. Verify number during onboarding
4. Test call/SMS to confirm
5. Update if changed
6. Include alternate number if available

Email Best Practices
═══════════════════

1. Optional but recommended
2. Personal email (not work email)
3. Verify email address
4. Send test email to confirm
5. Useful for non-urgent notifications
6. Backup to phone communication

Relationship Best Practices
═══════════════════════════

1. Choose most appropriate relationship
2. Use 'relative' for cousins, uncles, etc.
3. Use 'friend' for non-family close contacts
4. Use 'other' only when no fit
5. Document special relationships in notes
```

### Emergency Contact Priority Guidelines

```
Who Should Be Primary Contact?
══════════════════════════════

Married Employees:
  1st Choice: Spouse
  2nd Choice: Parent or sibling
  3rd Choice: Close friend

Unmarried Employees:
  1st Choice: Parent
  2nd Choice: Sibling
  3rd Choice: Close friend

Employees with Children:
  1st Choice: Spouse
  2nd Choice: Adult child
  3rd Choice: Parent or sibling

Employees Living Alone:
  1st Choice: Close friend or sibling
  2nd Choice: Parent
  3rd Choice: Relative
```

### Field Usage in Emergency Scenarios

```
Emergency Communication Flow
═══════════════════════════

Step 1: Attempt Phone Contact
┌─────────────────────────────┐
│ Call primary contact phone  │
│ If no answer: SMS/WhatsApp  │
│ Wait 5-10 minutes           │
└─────────────────────────────┘
              │
              ▼
Step 2: Try Email (if urgent)
┌─────────────────────────────┐
│ Send email with details     │
│ Mark as urgent/important    │
└─────────────────────────────┘
              │
              ▼
Step 3: Contact Secondary
┌─────────────────────────────┐
│ If primary unreachable      │
│ Contact next priority       │
│ Repeat phone/email process  │
└─────────────────────────────┘
              │
              ▼
Step 4: Escalate
┌─────────────────────────────┐
│ Contact all emergency       │
│ contacts simultaneously     │
│ Inform HR/management        │
└─────────────────────────────┘
```

### Expected Outcome
- Emergency contact identity fields added
- Relationship classification in place
- Phone number with validation
- Optional email for backup
- Support for Sri Lankan names and formats

### Verification Checklist
- [ ] RELATIONSHIP_CHOICES constant defined
- [ ] All relationship types included
- [ ] name field added (required)
- [ ] relationship field with choices added
- [ ] phone field added with validator
- [ ] email field added (optional)
- [ ] Phone validator imported
- [ ] Help text added to all fields
- [ ] Labels are clear
- [ ] Model docstring updated
- [ ] __str__ method updated

---

## Task 29: Add Emergency Priority

### Overview
Add priority and notes fields to the EmergencyContact model to establish contact order during emergencies and store additional context about each contact. The priority system ensures proper contact sequence in critical situations.

### Dependencies
- Task 28: Add Emergency Contact Fields

### Instructions

1. **Open emergency_contact.py model file**
   - Continue in `apps/employees/models/emergency_contact.py`
   - Locate EmergencyContact model class

2. **Add priority field**
   - IntegerField
   - Default to 1
   - Required field (no blank/null)
   - Lower number = higher priority (1 = primary)
   - Label: "Priority"
   - Help text: "Contact priority (1=primary, 2=secondary, etc.)"

3. **Add priority validation (optional)**
   - Consider MinValueValidator(1) to ensure positive numbers
   - Consider MaxValueValidator(10) for reasonable limits
   - Import validators if using: from django.core.validators import MinValueValidator, MaxValueValidator

4. **Add notes field**
   - TextField
   - Optional (blank=True, null=True)
   - Additional information about contact
   - Label: "Notes"
   - Help text: "Additional information about this contact (optional)"

5. **Update Meta class ordering**
   - Ensure ordering includes priority
   - Order by: ['employee', 'priority']
   - Shows contacts in priority order

6. **Add index on priority**
   - Add to Meta.indexes if not already present
   - Index on (employee, priority) for fast queries

7. **Update model docstring**
   - Document priority system
   - Explain notes field usage
   - Provide priority guidelines

8. **Consider adding helper method**
   - get_priority_display() if custom display needed
   - is_primary_contact() to check if priority == 1

### Priority and Notes Fields Structure

```
┌────────────────────────────────────────────────┐
│         Priority and Context Fields             │
├────────────────────────────────────────────────┤
│ Priority:                                      │
│  • priority (IntegerField)                     │
│    1 = Primary contact (first to call)         │
│    2 = Secondary contact (backup)              │
│    3+ = Additional contacts                    │
│                                                │
│ Context:                                       │
│  • notes (TextField, optional)                 │
│    Additional information:                     │
│    - Best time to call                         │
│    - Language preference                       │
│    - Special circumstances                     │
│    - Location information                      │
└────────────────────────────────────────────────┘
```

### Priority System Overview

```
Priority Levels
═══════════════

Priority 1: Primary Contact
────────────────────────────
• First person to contact
• Most readily available
• Usually closest relationship
• Most familiar with employee

Priority 2: Secondary Contact
──────────────────────────────
• Contact if primary unreachable
• Alternative decision maker
• May be geographically closer
• Backup authorization

Priority 3+: Additional Contacts
────────────────────────────────
• Extended family or friends
• Special circumstances
• Regional contacts
• Workplace colleagues
```

### Priority Examples by Scenario

#### Scenario 1: Standard Married Employee
```
Employee: Pradeep Fernando

Priority 1: Spouse (Immediate)
├── Name: Samanthi Fernando
├── Relationship: Spouse
├── Phone: +94 77 123 4567
├── Email: samanthi@gmail.com
└── Notes: "Available 24/7, speaks English and Sinhala"

Priority 2: Parent (Backup)
├── Name: Ranjith Fernando
├── Relationship: Father
├── Phone: +94 11 234 5678
├── Email: (none)
└── Notes: "Lives nearby, best to call after 6 PM"

Priority 3: Sibling (Additional)
├── Name: Niluka Silva
├── Relationship: Sister
├── Phone: +94 76 987 6543
├── Email: niluka@gmail.com
└── Notes: "Works in hospital, contact if medical emergency"
```

#### Scenario 2: Young Unmarried Employee
```
Employee: Kasun Perera (Age 23)

Priority 1: Mother (Primary)
├── Name: Sumana Perera
├── Relationship: Mother
├── Phone: +94 71 555 1234
├── Email: sumana@yahoo.com
└── Notes: "Primary caregiver, prefers Sinhala"

Priority 2: Father (Secondary)
├── Name: Anil Perera
├── Relationship: Father
├── Phone: +94 77 666 7777
├── Email: anil@gmail.com
└── Notes: "Works in Kandy, may be difficult to reach during day"

Priority 3: Friend (Backup)
├── Name: Nimal Jayawardena
├── Relationship: Friend
├── Phone: +94 76 888 9999
├── Email: nimal@example.com
└── Notes: "Close friend, lives in same area"
```

#### Scenario 3: Senior Manager
```
Employee: Indrani Wickramasinghe

Priority 1: Husband (Primary)
├── Name: Rohan Wickramasinghe
├── Relationship: Spouse
├── Phone: +94 77 123 4567
├── Email: rohan@company.lk
└── Notes: "CEO of another company, may be in meetings"

Priority 2: Son (Secondary)
├── Name: Chathura Wickramasinghe
├── Relationship: Son
├── Phone: +94 76 234 5678
├── Email: chathura@gmail.com
└── Notes: "Doctor, contact if medical emergency"

Priority 3: Daughter (Additional)
├── Name: Dinuli Wickramasinghe
├── Relationship: Daughter
├── Phone: +94 71 345 6789
├── Email: dinuli@international.com
└── Notes: "Lives abroad (UK), +5.5 hours time difference"
```

#### Scenario 4: Remote Worker
```
Employee: Lahiru Bandara (Works from Jaffna)

Priority 1: Wife (Primary)
├── Name: Priya Bandara
├── Relationship: Spouse
├── Phone: +94 77 777 8888
├── Email: priya@gmail.com
└── Notes: "Teacher, available after 3 PM, speaks Tamil and English"

Priority 2: Local Friend (Secondary)
├── Name: Suresh Kumar
├── Relationship: Friend
├── Phone: +94 21 222 3344
├── Email: suresh@yahoo.com
└── Notes: "Lives in Jaffna, can reach quickly if needed"

Priority 3: Headquarters Contact (Additional)
├── Name: Nimal Silva
├── Relationship: Friend (Manager)
├── Phone: +94 11 555 6677
├── Email: nimal@company.lk
└── Notes: "Direct manager in Colombo office, for work-related emergencies"
```

### Priority Assignment Guidelines

```
How to Assign Priority
══════════════════════

Priority 1 Criteria:
✓ Closest relationship (spouse/parent)
✓ Most readily available
✓ Can make medical decisions
✓ Knows employee's medical history
✓ Lives nearby or easily reachable
✓ Available 24/7

Priority 2 Criteria:
✓ Secondary close relationship
✓ Can make decisions if primary unavailable
✓ May be geographically closer
✓ Alternative authorization
✓ Different contact hours

Priority 3+ Criteria:
✓ Additional family members
✓ Close friends
✓ Work colleagues
✓ Geographically diverse contacts
✓ Special circumstances
```

### Notes Field Usage Examples

```
Effective Notes Examples
════════════════════════

Availability Notes:
  "Available 24/7"
  "Best time to call: after 6 PM"
  "Works night shift, call before noon"
  "Usually in meetings 9 AM - 12 PM"

Language Notes:
  "Speaks English and Sinhala"
  "Prefers Tamil communication"
  "English only"
  "Trilingual (Sinhala/Tamil/English)"

Location Notes:
  "Lives in same building"
  "Lives 5 km away"
  "Lives abroad (Australia, +4.5 hours)"
  "Works nearby, can reach in 15 minutes"

Special Circumstances:
  "Has medical power of attorney"
  "Doctor - contact for medical emergencies"
  "Company HR - for workplace incidents"
  "Knows employee's medical conditions"
  "Authorized decision maker"

Relationship Context:
  "Childhood friend, 20 years"
  "Legal guardian"
  "Next of kin"
  "Lives with employee"
```

### Priority Usage in Emergency Response

```
Emergency Contact Protocol
═════════════════════════

Step 1: Contact Priority 1
┌─────────────────────────────────┐
│ 1. Call primary contact         │
│ 2. If no answer, send SMS       │
│ 3. Wait 5 minutes               │
│ 4. Try again                    │
└─────────────────────────────────┘
              │
              ▼
Step 2: Check Notes
┌─────────────────────────────────┐
│ • Check best time to call       │
│ • Note language preference      │
│ • Consider special circumstances│
└─────────────────────────────────┘
              │
              ▼
Step 3: Contact Priority 2
┌─────────────────────────────────┐
│ If priority 1 unreachable:      │
│ 1. Contact priority 2           │
│ 2. Follow same protocol         │
│ 3. Check their notes            │
└─────────────────────────────────┘
              │
              ▼
Step 4: Escalate if Needed
┌─────────────────────────────────┐
│ • Contact all emergency contacts│
│ • Inform management/HR          │
│ • Document all attempts         │
│ • Seek alternative resources    │
└─────────────────────────────────┘
```

### Priority Validation

```
Priority Field Validation
═════════════════════════

Basic Validation:
✓ Must be positive integer
✓ Typically 1-10 range
✓ No duplicates per employee (optional)
✓ Lower number = higher priority

Advanced Validation (Optional):
✓ MinValueValidator(1)
✓ MaxValueValidator(10)
✓ Unique priority per employee
✓ Auto-renumber on delete

Query Examples:
# Get primary contact
primary = employee.emergency_contacts.filter(priority=1).first()

# Get all contacts ordered by priority
contacts = employee.emergency_contacts.all().order_by('priority')

# Get top 2 contacts
top_two = employee.emergency_contacts.all()[:2]
```

### Database Query Examples

```python
# Get primary emergency contact
primary_contact = employee.emergency_contacts.filter(priority=1).first()

# Get all emergency contacts in order
all_contacts = employee.emergency_contacts.all().order_by('priority')

# Get contacts with notes
contacts_with_notes = employee.emergency_contacts.exclude(
    notes__isnull=True
).exclude(notes='')

# Check if employee has emergency contacts
has_contacts = employee.emergency_contacts.exists()

# Count emergency contacts
contact_count = employee.emergency_contacts.count()
```

### Expected Outcome
- Priority field for contact ordering
- Notes field for additional context
- Proper priority-based sorting
- Flexible emergency contact management
- Support for complex scenarios

### Verification Checklist
- [ ] priority field added
- [ ] priority is IntegerField
- [ ] Default priority set to 1
- [ ] Help text explains priority system
- [ ] notes field added (optional)
- [ ] notes is TextField
- [ ] Meta class ordering includes priority
- [ ] Index on (employee, priority) if applicable
- [ ] Model docstring updated
- [ ] Consider validators for priority range

---

## Task 30: Run EmergencyContact Migrations

### Overview
Create and run Django migrations to apply the EmergencyContact model and all its fields to the database. This task generates the migration file and applies it to create the emergency_contact table with all necessary columns, indexes, and constraints.

### Dependencies
- Task 29: Add Emergency Priority (all emergency contact tasks completed)
- Django migrations framework
- Database connection configured

### Instructions

1. **Verify model is complete**
   - Open `apps/employees/models/emergency_contact.py`
   - Confirm all fields are present:
     - employee (ForeignKey)
     - name, relationship
     - phone, email
     - priority, notes
   - Confirm model is imported in `models/__init__.py`

2. **Create migration file**
   - Open terminal
   - Navigate to project root directory
   - Run makemigrations command
   - Command: `python manage.py makemigrations employees`
   - Django will detect the new EmergencyContact model

3. **Review migration file**
   - Navigate to `apps/employees/migrations/`
   - Open the newly created migration file (e.g., `0003_emergency_contact.py`)
   - Review the migration operations
   - Confirm all fields are included
   - Check foreign key relationship to Employee
   - Verify validators are included

4. **Check migration plan**
   - Run: `python manage.py migrate employees --plan`
   - Review planned operations
   - Confirm no unexpected changes
   - Verify migration number sequence

5. **Run migration**
   - Execute: `python manage.py migrate employees`
   - Django will create the emergency_contact table
   - Apply all field definitions
   - Create indexes and constraints

6. **Verify migration success**
   - Check for "OK" message
   - Confirm no errors in output
   - Note the migration name for reference

7. **Verify database schema**
   - Option A: Use Django shell
     - Run: `python manage.py shell`
     - Import model: `from employees.models import EmergencyContact`
     - Check fields: `EmergencyContact._meta.get_fields()`
   - Option B: Use database client
     - Connect to PostgreSQL
     - Describe table: `\d employees_emergency_contact`
     - Verify columns exist

8. **Test model functionality**
   - Create test emergency contact (via Django shell or admin)
   - Verify foreign key relationship works
   - Test required/optional fields
   - Confirm phone validation works
   - Test priority ordering

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
# Generated file: apps/employees/migrations/0003_emergency_contact.py

from django.db import migrations, models
import django.db.models.deletion
import employees.validators

class Migration(migrations.Migration):
    dependencies = [
        ('employees', '0002_employee_address'),
        ('tenants', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='EmergencyContact',
            fields=[
                ('id', models.BigAutoField(primary_key=True)),
                ('name', models.CharField(max_length=200)),
                ('relationship', models.CharField(max_length=20, choices=[...])),
                ('phone', models.CharField(max_length=20, validators=[employees.validators.validate_sri_lanka_phone])),
                ('email', models.EmailField(max_length=255, blank=True, null=True)),
                ('priority', models.IntegerField(default=1)),
                ('notes', models.TextField(blank=True, null=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('employee', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='emergency_contacts', to='employees.employee')),
                ('tenant', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='tenants.tenant')),
            ],
            options={
                'verbose_name': 'Emergency Contact',
                'verbose_name_plural': 'Emergency Contacts',
                'ordering': ['employee', 'priority'],
            },
        ),
    ]
```

### Database Schema Result

```sql
-- Table: employees_emergency_contact

CREATE TABLE employees_emergency_contact (
    id BIGSERIAL PRIMARY KEY,
    tenant_id BIGINT NOT NULL REFERENCES tenants_tenant(id),
    employee_id BIGINT NOT NULL REFERENCES employees_employee(id) ON DELETE CASCADE,
    name VARCHAR(200) NOT NULL,
    relationship VARCHAR(20) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(255),
    priority INTEGER NOT NULL DEFAULT 1,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL
);

-- Indexes
CREATE INDEX idx_emergency_contact_tenant ON employees_emergency_contact(tenant_id);
CREATE INDEX idx_emergency_contact_employee ON employees_emergency_contact(employee_id);
CREATE INDEX idx_emergency_contact_priority ON employees_emergency_contact(employee_id, priority);
```

### Testing Emergency Contact Creation

```python
# Django Shell Test

from employees.models import Employee, EmergencyContact

# Get an employee
employee = Employee.objects.first()

# Create primary emergency contact (spouse)
primary = EmergencyContact.objects.create(
    tenant=employee.tenant,
    employee=employee,
    name='Samanthi Fernando',
    relationship='spouse',
    phone='+94 77 123 4567',
    email='samanthi@gmail.com',
    priority=1,
    notes='Available 24/7, speaks English and Sinhala'
)

# Create secondary emergency contact (parent)
secondary = EmergencyContact.objects.create(
    tenant=employee.tenant,
    employee=employee,
    name='Ranjith Fernando',
    relationship='parent',
    phone='+94 11 234 5678',
    priority=2,
    notes='Lives nearby, best to call after 6 PM'
)

# Verify creation
print(f"Primary: {primary}")
print(f"Secondary: {secondary}")

# Access via related name
print(employee.emergency_contacts.all())
print(f"Contact count: {employee.emergency_contacts.count()}")

# Get primary contact
primary_contact = employee.emergency_contacts.filter(priority=1).first()
print(f"Primary contact: {primary_contact.name}")

# Get all contacts ordered by priority
for contact in employee.emergency_contacts.all():
    print(f"Priority {contact.priority}: {contact.name} ({contact.get_relationship_display()})")
```

### Troubleshooting Common Issues

```
Issue 1: Phone Validator Import Error
═════════════════════════════════════
Error: "No module named 'employees.validators'"
Solution:
  1. Verify validators/phone_validator.py exists
  2. Check validators/__init__.py has imports
  3. Ensure validator function is defined
  4. Restart Django if needed

Issue 2: Foreign Key Error
══════════════════════════
Error: "Employee model does not exist"
Solution:
  1. Verify Employee model is migrated
  2. Check migration dependencies
  3. Run migrations in order
  4. Use `python manage.py migrate employees`

Issue 3: Duplicate Priority Warning
═══════════════════════════════════
Issue: Multiple contacts with priority=1
Solution:
  1. Add unique_together in Meta (optional)
  2. Handle in application logic
  3. Use save() method to enforce
  4. Add custom validation

Issue 4: Phone Validation Fails
═══════════════════════════════
Error: "Invalid Sri Lankan phone format"
Solution:
  1. Check phone format: +94 XX XXX XXXX
  2. Verify validator is working
  3. Test validator separately
  4. Check allowed prefixes (70-78 for mobile)
```

### Migration Verification Checklist

```
Pre-Migration Checks
═══════════════════
[ ] All model fields defined
[ ] Model imported in __init__.py
[ ] Phone validator exists and imported
[ ] No syntax errors in model file
[ ] Dependencies (Employee model) exist
[ ] RELATIONSHIP_CHOICES defined

During Migration
═══════════════
[ ] makemigrations runs successfully
[ ] Migration file generated
[ ] Migration file reviewed
[ ] All fields present in migration
[ ] Validators included
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
[ ] Phone validator works
```

### Expected Outcome
- Migration file created successfully
- Database table created with all fields
- Foreign key relationship established
- Phone validator applied
- Indexes and constraints applied
- Model ready for use in application
- Emergency contact data can be stored and retrieved

### Verification Checklist
- [ ] makemigrations command run
- [ ] Migration file created
- [ ] Migration file reviewed
- [ ] All fields present in migration
- [ ] migrate command run successfully
- [ ] No errors in migration output
- [ ] Table exists in database
- [ ] All columns present
- [ ] Foreign keys working
- [ ] Phone validator works
- [ ] Model can be imported
- [ ] Test emergency contact creation works
- [ ] Related name 'emergency_contacts' accessible
- [ ] Priority ordering works

---

## Task 31: Create EmployeeFamily Model

### Overview
Create the EmployeeFamily model to store information about employee family members. This model supports benefits management, insurance coverage, dependent tracking, and emergency contact enrichment.

### Dependencies
- Employee model exists
- TenantAwareMixin and TimestampMixin available
- EmergencyContact model completed (optional but related)

### Instructions

1. **Create employee_family.py model file**
   - Create file at `apps/employees/models/employee_family.py`
   - Import necessary Django components
   - Import base model mixins

2. **Import required modules**
   - Import Django model fields
   - Import TenantAwareMixin
   - Import TimestampMixin
   - Import Employee model
   - Import gettext_lazy for translations

3. **Define EmployeeFamily model class**
   - Inherit from TenantAwareMixin and TimestampMixin
   - Add model docstring explaining purpose
   - Note: Supports multiple family members per employee

4. **Add employee foreign key**
   - ForeignKey to Employee model
   - on_delete=models.CASCADE (delete family records when employee deleted)
   - related_name='family_members'
   - Allow accessing employee.family_members.all()

5. **Add model docstring**
   - Document purpose: Family member information
   - Note support for multiple family members
   - Explain dependent tracking
   - List relationship types
   - Describe use cases: benefits, insurance, tax

6. **Add Meta class**
   - Set verbose_name to "Family Member"
   - Set verbose_name_plural to "Family Members"
   - Add ordering by ['employee', 'relationship']
   - Add index on (employee, is_dependent)

7. **Add __str__ method**
   - Return string showing name and relationship
   - Format: "Family Member Name (Relationship)"
   - Example: "John Jr. (Son of John Doe)"

8. **Update models/__init__.py**
   - Import EmployeeFamily model
   - Add to __all__ list
   - Enable easy imports

### EmployeeFamily Model Structure

```
┌────────────────────────────────────────────────┐
│           EmployeeFamily Model                  │
├────────────────────────────────────────────────┤
│ Relationship:                                  │
│  • employee (ForeignKey to Employee)           │
│                                                │
│ Identity (to be added in Task 32):            │
│  • name (CharField)                            │
│  • relationship (CharField with choices)       │
│  • date_of_birth (DateField)                   │
│  • occupation (CharField, optional)            │
│                                                │
│ Dependent Status (to be added in Task 33):    │
│  • is_dependent (BooleanField)                 │
│  • notes (TextField, optional)                 │
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
│    Employee    │◄─────────────────────│   EmployeeFamily     │
│                │                      │                      │
│ • id           │                      │ • employee_id (FK)   │
│ • first_name   │                      │ • name               │
│ • last_name    │                      │ • relationship       │
│ • nic_number   │                      │ • date_of_birth      │
│ • mobile       │                      │ • is_dependent       │
└────────────────┘                      └──────────────────────┘

One employee can have multiple family members:
  • Spouse
  • Children
  • Parents
  • Siblings
```

### Family Member Examples

#### Example 1: Married Employee with Children
```
Employee: Pradeep Silva

Family Members:
├── Spouse
│   ├── Name: Samanthi Silva
│   ├── Relationship: Spouse
│   ├── DOB: 1985-03-15
│   ├── Occupation: Teacher
│   └── Dependent: Yes
│
├── Child 1
│   ├── Name: Dineth Silva
│   ├── Relationship: Son
│   ├── DOB: 2015-07-20
│   ├── Occupation: Student
│   └── Dependent: Yes
│
└── Child 2
    ├── Name: Nethmi Silva
    ├── Relationship: Daughter
    ├── DOB: 2018-11-10
    ├── Occupation: Student
    └── Dependent: Yes
```

#### Example 2: Unmarried Employee Living with Parents
```
Employee: Kasun Perera

Family Members:
├── Parent 1
│   ├── Name: Anil Perera
│   ├── Relationship: Father
│   ├── DOB: 1960-05-10
│   ├── Occupation: Retired
│   └── Dependent: Yes (elderly)
│
└── Parent 2
    ├── Name: Sumana Perera
    ├── Relationship: Mother
    ├── DOB: 1962-08-25
    ├── Occupation: Housewife
    └── Dependent: Yes (elderly)
```

#### Example 3: Young Professional
```
Employee: Nimal Fernando (Age 25)

Family Members:
├── Parent 1
│   ├── Name: Kamal Fernando
│   ├── Relationship: Father
│   ├── DOB: 1965-03-20
│   ├── Occupation: Businessman
│   └── Dependent: No (financially independent)
│
├── Parent 2
│   ├── Name: Indrani Fernando
│   ├── Relationship: Mother
│   ├── DOB: 1967-07-15
│   ├── Occupation: Teacher
│   └── Dependent: No (working)
│
└── Sibling
    ├── Name: Priya Fernando
    ├── Relationship: Sister
    ├── DOB: 2000-12-05
    ├── Occupation: University Student
    └── Dependent: No (claimed by parents)
```

### Family Member Purpose and Use Cases

```
Why Track Family Members?
════════════════════════

Insurance Coverage:
✓ Health insurance enrollment
✓ Life insurance beneficiaries
✓ Accident insurance coverage
✓ Medical coverage limits
✓ Premium calculations

Benefits Administration:
✓ Family allowances
✓ Education allowances for children
✓ Spouse employment status
✓ Dependent care benefits
✓ Housing allowances

Tax Compliance:
✓ Dependent deductions
✓ Family tax relief
✓ Child tax credits
✓ Elderly care deductions
✓ PAYE calculations

Leave Entitlements:
✓ Maternity/paternity leave
✓ Parental leave
✓ Family care leave
✓ Compassionate leave
✓ Child care leave

Emergency Planning:
✓ Next of kin information
✓ Beneficiary designation
✓ Guardian information
✓ Emergency contacts enrichment
```

### Sri Lankan Context

```
Family Structure in Sri Lanka
════════════════════════════

Common Family Patterns:
  • Nuclear family (parents + children)
  • Extended family households
  • Multi-generational living
  • Elderly parents with adult children
  • Joint family systems

Dependent Categories:
  • Children under 18
  • Full-time students (18-24)
  • Non-working spouse
  • Elderly parents (over 60)
  • Disabled family members

Cultural Considerations:
  • Elderly care responsibility
  • Financial support obligations
  • Extended family support
  • Traditional family values
  • Joint financial decisions
```

### Family Member Tracking Scenarios

#### Scenario 1: New Hire Onboarding
```
During Onboarding:
1. Collect family member information
2. Identify dependents
3. Enroll in insurance
4. Calculate family allowances
5. Setup tax deductions
6. Designate beneficiaries
```

#### Scenario 2: Life Event Update
```
Life Event: Birth of Child

Updates Required:
1. Add new family member
2. Mark as dependent
3. Update insurance coverage
4. Adjust family allowances
5. Update tax deductions
6. Update emergency contacts (optional)
7. Process maternity/paternity leave
```

#### Scenario 3: Annual Benefits Review
```
Annual Review Process:
1. Verify family member information
2. Update dependent status
3. Check age eligibility (children turning 18)
4. Verify student status (18-24)
5. Update insurance coverage
6. Recalculate benefits
7. Adjust tax deductions
```

#### Scenario 4: Retirement Planning
```
Employee Approaching Retirement:
1. Review family member records
2. Identify continuing dependents
3. Plan pension benefits
4. Setup beneficiary distributions
5. Plan medical coverage continuation
6. Estate planning support
```

### Database Schema (Preview)

```
employees_employee              employees_employee_family
├── id (PK)                    ├── id (PK)
├── tenant_id (FK)            ├── tenant_id (FK)
├── employee_number           ├── employee_id (FK) ──┐
├── first_name                ├── name               │
├── last_name                 ├── relationship       │
├── date_of_birth             ├── date_of_birth      │
└── ...                       ├── occupation         │
                              ├── is_dependent       │
      ┌───────────────────────┘
      │
      │ Relationship:
      │ One Employee → Many Family Members
      └─ employee.family_members.all()
```

### Expected Outcome
- EmployeeFamily model created
- Foreign key to Employee established
- Model inherits tenant awareness and timestamps
- Foundation for family member fields
- Related name allows easy access

### Verification Checklist
- [ ] employee_family.py file created
- [ ] Required modules imported
- [ ] EmployeeFamily class defined
- [ ] Inherits from TenantAwareMixin
- [ ] Inherits from TimestampMixin
- [ ] employee ForeignKey added
- [ ] on_delete=models.CASCADE set
- [ ] related_name='family_members' set
- [ ] Model docstring added
- [ ] Meta class defined
- [ ] verbose_name set
- [ ] __str__ method implemented
- [ ] Model imported in __init__.py

---

## Task 32: Add Family Member Fields

### Overview
Add fields to the EmployeeFamily model to store family member details, including name, relationship, date of birth, and occupation. These fields enable proper identification and management of employee family members for benefits and compliance.

### Dependencies
- Task 31: Create EmployeeFamily Model

### Instructions

1. **Open employee_family.py model file**
   - Navigate to `apps/employees/models/employee_family.py`
   - Locate EmployeeFamily model class

2. **Define FAMILY_RELATIONSHIP_CHOICES constant**
   - Create tuple of family relationship choices
   - Include: SPOUSE, CHILD, PARENT, SIBLING
   - Format: (value, display_name)

3. **Add name field**
   - CharField with max_length=200
   - Required field (no blank/null)
   - Full name of family member
   - Label: "Full Name"
   - Help text: "Full name of family member"

4. **Add relationship field**
   - CharField with choices from FAMILY_RELATIONSHIP_CHOICES
   - Max length 20
   - Required field (no blank/null)
   - Describes relationship to employee
   - Label: "Relationship"
   - Help text: "Relationship to employee"

5. **Add date_of_birth field**
   - DateField
   - Optional (blank=True, null=True)
   - Important for age-based calculations
   - Label: "Date of Birth"
   - Help text: "Date of birth (for age calculation and eligibility)"

6. **Add occupation field**
   - CharField with max_length=100
   - Optional (blank=True, null=True)
   - Current occupation or status
   - Label: "Occupation"
   - Help text: "Current occupation or status (e.g., Student, Retired, Employed)"

7. **Update model docstring**
   - Document all family member fields
   - Note required vs optional fields
   - List relationship options
   - Explain field purposes

8. **Update __str__ method**
   - Include name and relationship
   - Format: "Name (Relationship)"
   - Example: "John Jr. (Son)"

### Family Member Fields Structure

```
┌────────────────────────────────────────────────┐
│        Family Member Core Fields                │
├────────────────────────────────────────────────┤
│ Identity:                                      │
│  • name (CharField, 200) - Required            │
│    Full name of family member                  │
│                                                │
│ Relationship:                                  │
│  • relationship (CharField with choices)       │
│    SPOUSE, CHILD, PARENT, SIBLING              │
│                                                │
│ Age Information:                               │
│  • date_of_birth (DateField) - Optional        │
│    For age calculations and eligibility        │
│                                                │
│ Employment Status:                             │
│  • occupation (CharField, 100) - Optional      │
│    Current work or study status                │
└────────────────────────────────────────────────┘
```

### Family Relationship Choices

```python
FAMILY_RELATIONSHIP_CHOICES = (
    ('spouse', 'Spouse'),
    ('child', 'Child'),
    ('parent', 'Parent'),
    ('sibling', 'Sibling'),
)
```

### Relationship Types Details

| Relationship | Code | Common Dependent | Typical Age Range |
|-------------|------|------------------|-------------------|
| Spouse | 'spouse' | If not working | Any adult |
| Child | 'child' | Yes (if under 18 or student) | 0-24 |
| Parent | 'parent' | Yes (if elderly or disabled) | 55+ |
| Sibling | 'sibling' | Rare | Any |

### Family Member Examples by Relationship

#### Example 1: Spouse
```
Family Member: Spouse
├── Name: Samanthi Fernando
├── Relationship: Spouse
├── Date of Birth: 1985-03-15 (Age: 40)
├── Occupation: Teacher
├── Is Dependent: No (employed)
└── Notes: "Works full-time, has own income"

Family Member: Non-Working Spouse
├── Name: Indrani Silva
├── Relationship: Spouse
├── Date of Birth: 1988-07-20 (Age: 37)
├── Occupation: Housewife
├── Is Dependent: Yes
└── Notes: "Full-time homemaker, manages household"
```

#### Example 2: Children
```
Family Member: Young Child
├── Name: Dineth Silva
├── Relationship: Child (Son)
├── Date of Birth: 2015-07-20 (Age: 10)
├── Occupation: Student (Grade 5)
├── Is Dependent: Yes
└── Notes: "Attends local school"

Family Member: University Student
├── Name: Chathura Fernando
├── Relationship: Child (Son)
├── Date of Birth: 2003-12-10 (Age: 22)
├── Occupation: University Student
├── Is Dependent: Yes (full-time student)
└── Notes: "Studying Engineering at University of Moratuwa"

Family Member: Working Adult Child
├── Name: Priya Jayawardena
├── Relationship: Child (Daughter)
├── Date of Birth: 1998-05-15 (Age: 27)
├── Occupation: Software Engineer
├── Is Dependent: No (employed)
└── Notes: "Working professional, financially independent"
```

#### Example 3: Parents
```
Family Member: Elderly Parent
├── Name: Kamal Fernando
├── Relationship: Parent (Father)
├── Date of Birth: 1955-04-10 (Age: 70)
├── Occupation: Retired
├── Is Dependent: Yes
└── Notes: "Retired, lives with employee, requires medical care"

Family Member: Working Parent
├── Name: Sumana Perera
├── Relationship: Parent (Mother)
├── Date of Birth: 1962-08-25 (Age: 63)
├── Occupation: Teacher (still working)
├── Is Dependent: No
└── Notes: "Still employed, not requiring support"
```

#### Example 4: Siblings
```
Family Member: Minor Sibling
├── Name: Nethmi Silva
├── Relationship: Sibling (Sister)
├── Date of Birth: 2008-11-20 (Age: 17)
├── Occupation: Student (A/L)
├── Is Dependent: Yes (if employee is guardian)
└── Notes: "Under employee's care due to parents' passing"

Family Member: Adult Sibling
├── Name: Nimal Perera
├── Relationship: Sibling (Brother)
├── Date of Birth: 1992-02-15 (Age: 33)
├── Occupation: Businessman
├── Is Dependent: No
└── Notes: "Listed for emergency contact purposes only"
```

### Field Usage Guidelines

```
Name Field Guidelines
════════════════════

Format:
✓ Full legal name
✓ First name and last name
✓ Can include Sinhala/Tamil characters
✓ Match official documents

Examples:
  • "Samanthi Fernando"
  • "සමන්ති ප්‍රනාන්දු"
  • "சமந்தி பெர்னாண்டோ"
  • "Dineth Silva"

Relationship Field Guidelines
═════════════════════════════

Selection:
✓ Choose most specific relationship
✓ Use "Child" for sons/daughters
✓ Use "Parent" for father/mother
✓ Use "Sibling" for brothers/sisters
✓ Use "Spouse" for husband/wife

Date of Birth Guidelines
═══════════════════════

Importance:
✓ Required for dependent calculations
✓ Determines eligibility for benefits
✓ Used for age-based rules
✓ Important for child education benefits

Key Ages:
  • Under 18: Automatic dependent
  • 18-24: Student dependent
  • Over 60: Elderly parent dependent

Occupation Field Guidelines
═══════════════════════════

Common Values:
  • "Student" (children)
  • "Teacher" (employed spouse)
  • "Retired" (elderly parents)
  • "Housewife/Househusband" (homemaker)
  • "Software Engineer" (working adult)
  • "Unemployed" (seeking work)
  • "Self-employed" (business owner)
```

### Age-Based Dependent Rules

```
Automatic Dependent by Age
═════════════════════════

Children (Age 0-17):
✓ Automatically dependent
✓ Full benefits eligibility
✓ Education allowances
✓ Medical coverage

Young Adults (Age 18-24):
✓ Dependent if full-time student
✓ Requires proof of enrollment
✓ Limited benefits
✓ Medical coverage continues

Working Age (Age 25-59):
✗ Generally not dependent
✓ Exception: Disabled
✓ Exception: Non-working spouse

Elderly (Age 60+):
✓ Dependent if retired
✓ Medical benefits
✓ Elderly care allowances
✓ Subject to income verification
```

### Occupation-Based Dependent Rules

```
Dependent Status by Occupation
══════════════════════════════

Student:
✓ Usually dependent (if under 24)
✓ Requires enrollment proof
✓ Full-time study required

Employed:
✗ Not dependent
✓ Exception: Low income
✓ Verify employment status

Retired:
✓ Usually dependent (elderly)
✓ No other income
✓ Under employee's care

Housewife/Househusband:
✓ Usually dependent
✓ No separate income
✓ Full-time homemaker

Unemployed:
✓ May be dependent
✓ Verify circumstances
✓ Time-limited

Self-Employed:
✗ Usually not dependent
✓ Exception: Low income
✓ Verify business income
```

### Database Query Examples

```python
# Get all family members
family = employee.family_members.all()

# Get spouse
spouse = employee.family_members.filter(relationship='spouse').first()

# Get children
children = employee.family_members.filter(relationship='child')

# Get children under 18
from datetime import date, timedelta
eighteen_years_ago = date.today() - timedelta(days=18*365)
minor_children = employee.family_members.filter(
    relationship='child',
    date_of_birth__gt=eighteen_years_ago
)

# Get dependent family members
dependents = employee.family_members.filter(is_dependent=True)

# Calculate ages
from dateutil.relativedelta import relativedelta
for member in employee.family_members.all():
    if member.date_of_birth:
        age = relativedelta(date.today(), member.date_of_birth).years
        print(f"{member.name}: {age} years old")

# Count dependents by type
spouse_count = employee.family_members.filter(
    relationship='spouse', is_dependent=True
).count()
child_count = employee.family_members.filter(
    relationship='child', is_dependent=True
).count()
```

### Expected Outcome
- Family member identity fields added
- Relationship classification in place
- Date of birth for age calculations
- Occupation field for status tracking
- Support for various family structures

### Verification Checklist
- [ ] FAMILY_RELATIONSHIP_CHOICES constant defined
- [ ] All relationship types included
- [ ] name field added (required)
- [ ] relationship field with choices added
- [ ] date_of_birth field added (optional)
- [ ] occupation field added (optional)
- [ ] Help text added to all fields
- [ ] Labels are clear
- [ ] Model docstring updated
- [ ] __str__ method updated

---

## Task 33: Add Dependent Flag

### Overview
Add the is_dependent boolean field and notes field to the EmployeeFamily model. The dependent flag identifies family members who qualify for benefits, insurance coverage, and tax deductions, while notes provide additional context.

### Dependencies
- Task 32: Add Family Member Fields

### Instructions

1. **Open employee_family.py model file**
   - Continue in `apps/employees/models/employee_family.py`
   - Locate EmployeeFamily model class

2. **Add is_dependent field**
   - BooleanField
   - Default to False
   - Required field (no blank/null)
   - Indicates if family member is a dependent
   - Label: "Is Dependent"
   - Help text: "Check if this family member is a dependent for benefits and tax purposes"

3. **Add notes field**
   - TextField
   - Optional (blank=True, null=True)
   - Additional information about family member
   - Label: "Notes"
   - Help text: "Additional information (medical conditions, special circumstances, etc.)"

4. **Update Meta class**
   - Add index on (employee, is_dependent)
   - Optimize queries for dependent lists
   - Update ordering if needed

5. **Add dependent calculation helper method (optional)**
   - Consider adding age calculation method
   - Consider adding automatic dependent check
   - Based on age and occupation

6. **Update model docstring**
   - Document dependent definition
   - Explain when to mark as dependent
   - List dependent criteria
   - Note impact on benefits and tax

7. **Consider save method override (optional)**
   - Auto-set is_dependent based on age
   - Check occupation status
   - Validate dependent rules

### Dependent Flag Structure

```
┌────────────────────────────────────────────────┐
│         Dependent Status Fields                 │
├────────────────────────────────────────────────┤
│ Dependent Flag:                                │
│  • is_dependent (BooleanField)                 │
│    True = Qualifies for benefits               │
│    False = Not a dependent                     │
│                                                │
│ Context:                                       │
│  • notes (TextField, optional)                 │
│    Medical conditions                          │
│    Special circumstances                       │
│    Custody arrangements                        │
│    Student status details                      │
└────────────────────────────────────────────────┘
```

### Dependent Definition

```
What is a Dependent?
═══════════════════

Legal Definition:
  A family member who relies on the employee
  for financial support and qualifies for
  benefits under employment policies and tax law.

Qualification Criteria:
✓ Financial dependence on employee
✓ Lives with or supported by employee
✓ Meets age or status requirements
✓ Not independently employed (or low income)
✓ Qualifies under company/tax policy
```

### Dependent Qualification Rules

```
Automatic Dependent Status
═════════════════════════

Children Under 18:
✓ Automatic dependent
✓ Full benefits eligibility
✓ No employment check needed
✓ Medical, education benefits

Full-Time Students (18-24):
✓ Dependent if enrolled
✓ Proof of enrollment required
✓ Must be full-time student
✓ Limited employment allowed

Non-Working Spouse:
✓ Dependent if no income
✓ Homemaker status
✓ Medical benefits
✓ Family allowances

Elderly Parents (60+):
✓ Dependent if retired
✓ No other income source
✓ Living with or supported by employee
✓ Medical benefits

Disabled Family Members:
✓ Dependent regardless of age
✓ Unable to work
✓ Requires care
✓ Full benefits
```

### Not Dependent Scenarios

```
When Family Member is NOT Dependent
═══════════════════════════════════

Working Spouse:
✗ Has own employment
✗ Own income source
✗ Independent medical coverage
✗ May still be listed for records

Adult Children (25+):
✗ Finished education
✗ Financially independent
✗ Own employment
✗ Listed for emergency contact only

Working Parents:
✗ Still employed
✗ Own retirement/savings
✗ Independent income
✗ Not requiring support

Adult Siblings:
✗ Living independently
✗ Own employment
✗ Not under employee's care
✗ Listed for records only
```

### Dependent Examples by Scenario

#### Scenario 1: Standard Family
```
Employee: Pradeep Silva (Age 35, Married, 2 children)

Family Members:
├── Samanthi Silva (Spouse)
│   ├── Age: 33
│   ├── Occupation: Teacher
│   ├── Is Dependent: NO
│   └── Reason: Employed, own income
│
├── Dineth Silva (Child)
│   ├── Age: 10
│   ├── Occupation: Student
│   ├── Is Dependent: YES
│   └── Reason: Minor child
│
└── Nethmi Silva (Child)
    ├── Age: 7
    ├── Occupation: Student
    ├── Is Dependent: YES
    └── Reason: Minor child

Dependent Count: 2 (2 children)
```

#### Scenario 2: Single Income Family
```
Employee: Kasun Perera (Age 38, Married, 3 children)

Family Members:
├── Sumana Perera (Spouse)
│   ├── Age: 35
│   ├── Occupation: Housewife
│   ├── Is Dependent: YES
│   └── Reason: No separate income
│
├── Child 1
│   ├── Age: 15
│   ├── Is Dependent: YES
│   └── Reason: Minor
│
├── Child 2
│   ├── Age: 12
│   ├── Is Dependent: YES
│   └── Reason: Minor
│
└── Child 3
    ├── Age: 8
    ├── Is Dependent: YES
    └── Reason: Minor

Dependent Count: 4 (spouse + 3 children)
```

#### Scenario 3: With University Student
```
Employee: Nimal Fernando (Age 45)

Family Members:
├── Spouse
│   ├── Age: 43
│   ├── Occupation: Nurse
│   ├── Is Dependent: NO
│   └── Reason: Employed
│
├── Chathura (Son)
│   ├── Age: 22
│   ├── Occupation: University Student
│   ├── Is Dependent: YES
│   ├── Reason: Full-time student
│   └── Notes: "Engineering student, University of Moratuwa"
│
└── Priya (Daughter)
    ├── Age: 16
    ├── Occupation: School Student
    ├── Is Dependent: YES
    └── Reason: Minor

Dependent Count: 2 (university student + minor child)
```

#### Scenario 4: With Elderly Parents
```
Employee: Indrani Jayawardena (Age 50)

Family Members:
├── Spouse
│   ├── Age: 52
│   ├── Occupation: Manager
│   ├── Is Dependent: NO
│   └── Reason: Employed
│
├── Father
│   ├── Age: 75
│   ├── Occupation: Retired
│   ├── Is Dependent: YES
│   ├── Reason: Elderly, retired, lives with employee
│   └── Notes: "Requires regular medical care, diabetes"
│
└── Mother
    ├── Age: 72
    ├── Occupation: Retired
    ├── Is Dependent: YES
    ├── Reason: Elderly, retired, lives with employee
    └── Notes: "Blood pressure medication, monthly checkups"

Dependent Count: 2 (both elderly parents)
```

### Notes Field Usage Examples

```
Effective Notes Examples
════════════════════════

Medical Information:
  "Diabetic, requires insulin"
  "Asthma, regular inhaler needed"
  "Special diet requirements"
  "Allergic to penicillin"

Student Status:
  "Full-time student at University of Colombo"
  "Engineering degree, Year 3 of 4"
  "Expected graduation: June 2027"
  "Student visa expires: December 2026"

Care Requirements:
  "Requires wheelchair accessibility"
  "Daily medication schedule"
  "Regular physiotherapy needed"
  "Special education program"

Custody/Legal:
  "Joint custody with ex-spouse"
  "Lives with employee full-time"
  "Court-ordered support obligation"
  "Legal guardian since 2020"

Insurance Notes:
  "Pre-existing condition declared"
  "Requires premium plan coverage"
  "No dental coverage needed"
  "Covered under spouse's policy"
```

### Benefits Impact

```
How Dependent Status Affects Benefits
════════════════════════════════════

Medical Insurance:
✓ Dependents covered under employee plan
✓ Premium based on dependent count
✓ Age affects premium calculation
✓ Pre-existing conditions noted

Family Allowances:
✓ Monthly allowance per dependent
✓ Different rates for children vs spouse
✓ Age-based allowance tiers
✓ Education allowances for students

Tax Deductions:
✓ Tax relief per dependent
✓ Reduces taxable income
✓ Different rates by relationship
✓ Proof of dependency required

Life Insurance:
✓ Dependents as beneficiaries
✓ Coverage amount calculation
✓ Distribution percentages
✓ Nominee designation
```

### Tax Implications in Sri Lanka

```
Sri Lankan Tax Relief for Dependents
═══════════════════════════════════

Individual Income Tax Act:
  • Relief for children under 18
  • Relief for disabled dependents
  • Relief for elderly parents (60+)
  • Relief for spouse (if not employed)

Relief Amounts (Example - verify current rates):
  • Per child under 18: Rs. 50,000
  • Disabled dependent: Rs. 75,000
  • Elderly parent (60+): Rs. 50,000
  • Non-working spouse: Rs. 50,000

Documentation Required:
  • Birth certificates for children
  • Marriage certificate for spouse
  • Medical certificates for disabled
  • Proof of parent's age
  • Proof of financial support
```

### Database Query Examples

```python
# Get all dependents
dependents = employee.family_members.filter(is_dependent=True)

# Count dependents
dependent_count = employee.family_members.filter(is_dependent=True).count()

# Get dependent children
dependent_children = employee.family_members.filter(
    relationship='child',
    is_dependent=True
)

# Get dependent spouse
dependent_spouse = employee.family_members.filter(
    relationship='spouse',
    is_dependent=True
).first()

# Calculate tax relief
child_relief = employee.family_members.filter(
    relationship='child',
    is_dependent=True
).count() * 50000  # Rs. 50,000 per child

# Get family members with medical notes
medical_notes = employee.family_members.exclude(
    notes__isnull=True
).exclude(notes='')
```

### Expected Outcome
- Dependent flag for benefit qualification
- Notes field for additional context
- Support for benefits calculations
- Enable tax relief processing
- Flexible dependent management

### Verification Checklist
- [ ] is_dependent field added
- [ ] is_dependent is BooleanField
- [ ] Default set to False
- [ ] Help text explains dependent criteria
- [ ] notes field added (optional)
- [ ] notes is TextField
- [ ] Index on (employee, is_dependent) added
- [ ] Model docstring updated with dependent definition
- [ ] Consider auto-calculation in save method

---

## Task 34: Run EmployeeFamily Migrations

### Overview
Create and run Django migrations to apply the EmployeeFamily model and all its fields to the database. This task generates the migration file and applies it to create the employee_family table with all necessary columns, indexes, and constraints.

### Dependencies
- Task 33: Add Dependent Flag (all family model tasks completed)
- Django migrations framework
- Database connection configured

### Instructions

1. **Verify model is complete**
   - Open `apps/employees/models/employee_family.py`
   - Confirm all fields are present:
     - employee (ForeignKey)
     - name, relationship
     - date_of_birth, occupation
     - is_dependent, notes
   - Confirm model is imported in `models/__init__.py`

2. **Create migration file**
   - Open terminal
   - Navigate to project root directory
   - Run makemigrations command
   - Command: `python manage.py makemigrations employees`
   - Django will detect the new EmployeeFamily model

3. **Review migration file**
   - Navigate to `apps/employees/migrations/`
   - Open the newly created migration file (e.g., `0004_employee_family.py`)
   - Review the migration operations
   - Confirm all fields are included
   - Check foreign key relationship to Employee
   - Verify choices and defaults

4. **Check migration plan**
   - Run: `python manage.py migrate employees --plan`
   - Review planned operations
   - Confirm no unexpected changes
   - Verify migration number sequence

5. **Run migration**
   - Execute: `python manage.py migrate employees`
   - Django will create the employee_family table
   - Apply all field definitions
   - Create indexes and constraints

6. **Verify migration success**
   - Check for "OK" message
   - Confirm no errors in output
   - Note the migration name for reference

7. **Verify database schema**
   - Option A: Use Django shell
     - Run: `python manage.py shell`
     - Import model: `from employees.models import EmployeeFamily`
     - Check fields: `EmployeeFamily._meta.get_fields()`
   - Option B: Use database client
     - Connect to PostgreSQL
     - Describe table: `\d employees_employee_family`
     - Verify columns exist

8. **Test model functionality**
   - Create test family member (via Django shell or admin)
   - Verify foreign key relationship works
   - Test required/optional fields
   - Test dependent flag
   - Test date field

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
# Generated file: apps/employees/migrations/0004_employee_family.py

from django.db import migrations, models
import django.db.models.deletion

class Migration(migrations.Migration):
    dependencies = [
        ('employees', '0003_emergency_contact'),
        ('tenants', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='EmployeeFamily',
            fields=[
                ('id', models.BigAutoField(primary_key=True)),
                ('name', models.CharField(max_length=200)),
                ('relationship', models.CharField(max_length=20, choices=[...])),
                ('date_of_birth', models.DateField(blank=True, null=True)),
                ('occupation', models.CharField(max_length=100, blank=True, null=True)),
                ('is_dependent', models.BooleanField(default=False)),
                ('notes', models.TextField(blank=True, null=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('employee', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='family_members', to='employees.employee')),
                ('tenant', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='tenants.tenant')),
            ],
            options={
                'verbose_name': 'Family Member',
                'verbose_name_plural': 'Family Members',
                'ordering': ['employee', 'relationship'],
            },
        ),
        migrations.AddIndex(
            model_name='employeefamily',
            index=models.Index(fields=['employee', 'is_dependent'], name='employee_family_dependent_idx'),
        ),
    ]
```

### Database Schema Result

```sql
-- Table: employees_employee_family

CREATE TABLE employees_employee_family (
    id BIGSERIAL PRIMARY KEY,
    tenant_id BIGINT NOT NULL REFERENCES tenants_tenant(id),
    employee_id BIGINT NOT NULL REFERENCES employees_employee(id) ON DELETE CASCADE,
    name VARCHAR(200) NOT NULL,
    relationship VARCHAR(20) NOT NULL,
    date_of_birth DATE,
    occupation VARCHAR(100),
    is_dependent BOOLEAN NOT NULL DEFAULT FALSE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL
);

-- Indexes
CREATE INDEX idx_employee_family_tenant ON employees_employee_family(tenant_id);
CREATE INDEX idx_employee_family_employee ON employees_employee_family(employee_id);
CREATE INDEX idx_employee_family_dependent ON employees_employee_family(employee_id, is_dependent);
CREATE INDEX idx_employee_family_relationship ON employees_employee_family(relationship);
```

### Testing Family Member Creation

```python
# Django Shell Test

from employees.models import Employee, EmployeeFamily
from datetime import date

# Get an employee
employee = Employee.objects.first()

# Create spouse (dependent)
spouse = EmployeeFamily.objects.create(
    tenant=employee.tenant,
    employee=employee,
    name='Samanthi Fernando',
    relationship='spouse',
    date_of_birth=date(1985, 3, 15),
    occupation='Housewife',
    is_dependent=True,
    notes='Full-time homemaker'
)

# Create child (dependent)
child = EmployeeFamily.objects.create(
    tenant=employee.tenant,
    employee=employee,
    name='Dineth Fernando',
    relationship='child',
    date_of_birth=date(2015, 7, 20),
    occupation='Student',
    is_dependent=True,
    notes='Grade 5 at local school'
)

# Create elderly parent (dependent)
parent = EmployeeFamily.objects.create(
    tenant=employee.tenant,
    employee=employee,
    name='Kamal Fernando',
    relationship='parent',
    date_of_birth=date(1955, 4, 10),
    occupation='Retired',
    is_dependent=True,
    notes='Retired, requires medical care'
)

# Verify creation
print(f"Spouse: {spouse}")
print(f"Child: {child}")
print(f"Parent: {parent}")

# Access via related name
print(employee.family_members.all())
print(f"Family member count: {employee.family_members.count()}")

# Get only dependents
dependents = employee.family_members.filter(is_dependent=True)
print(f"Dependent count: {dependents.count()}")

# Calculate ages
from dateutil.relativedelta import relativedelta
for member in employee.family_members.all():
    if member.date_of_birth:
        age = relativedelta(date.today(), member.date_of_birth).years
        print(f"{member.name}: {age} years old - {'Dependent' if member.is_dependent else 'Not Dependent'}")
```

### Troubleshooting Common Issues

```
Issue 1: Date Field Error
═════════════════════════
Error: "Invalid date format"
Solution:
  1. Use Python date objects
  2. Format: date(year, month, day)
  3. Import: from datetime import date
  4. Example: date(2015, 7, 20)

Issue 2: Foreign Key Error
══════════════════════════
Error: "Employee model does not exist"
Solution:
  1. Verify Employee model is migrated
  2. Check migration dependencies
  3. Run migrations in order
  4. Use correct migration sequence

Issue 3: Relationship Choice Error
══════════════════════════════════
Error: "Invalid choice for relationship"
Solution:
  1. Use lowercase values: 'spouse', 'child', etc.
  2. Verify FAMILY_RELATIONSHIP_CHOICES defined
  3. Check choices in migration file
  4. Match exact choice values

Issue 4: Dependent Flag Default
═══════════════════════════════
Issue: All family members showing as not dependent
Solution:
  1. Check default value is set to False
  2. Explicitly set is_dependent=True for dependents
  3. Add validation in save method if needed
  4. Review dependent criteria
```

### Migration Verification Checklist

```
Pre-Migration Checks
═══════════════════
[ ] All model fields defined
[ ] Model imported in __init__.py
[ ] No syntax errors in model file
[ ] Dependencies (Employee model) exist
[ ] FAMILY_RELATIONSHIP_CHOICES defined
[ ] Date field properly configured

During Migration
═══════════════
[ ] makemigrations runs successfully
[ ] Migration file generated
[ ] Migration file reviewed
[ ] All fields present in migration
[ ] Choices defined correctly
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
[ ] Choices work correctly
```

### Expected Outcome
- Migration file created successfully
- Database table created with all fields
- Foreign key relationship established
- Indexes and constraints applied
- Model ready for use in application
- Family member data can be stored and retrieved
- Dependent tracking functional

### Verification Checklist
- [ ] makemigrations command run
- [ ] Migration file created
- [ ] Migration file reviewed
- [ ] All fields present in migration
- [ ] migrate command run successfully
- [ ] No errors in migration output
- [ ] Table exists in database
- [ ] All columns present
- [ ] Foreign keys working
- [ ] Date field works
- [ ] is_dependent field functional
- [ ] Model can be imported
- [ ] Test family member creation works
- [ ] Related name 'family_members' accessible
- [ ] Dependent filtering works

---

## Summary

This document established the employee emergency contact and family member management system:

### Completed Infrastructure
- ✅ EmergencyContact model with priority system
- ✅ Emergency contact fields (name, relationship, phone, email)
- ✅ Priority-based contact ordering
- ✅ EmployeeFamily model for family member tracking
- ✅ Family member fields (name, relationship, DOB, occupation)
- ✅ Dependent flag for benefits management
- ✅ Database migrations applied for both models

### Key Achievements
1. **Emergency Preparedness** - Structured emergency contact system with priority ordering
2. **Contact Validation** - Phone number validation using Sri Lankan format
3. **Family Tracking** - Comprehensive family member information management
4. **Dependent Management** - Support for benefits, insurance, and tax calculations
5. **Flexible Relationships** - Support for various family structures and relationships
6. **Notes System** - Additional context for contacts and family members

### Use Cases Enabled
- Emergency response and notification
- Medical insurance enrollment
- Benefits administration
- Tax relief calculations
- Leave entitlement management
- Next of kin tracking
- Beneficiary designation

---

**Document Status:** ✅ Complete  
**Total Tasks:** 8 (Tasks 27-34)  
**Total Lines:** ~1397
