# Tasks 19-23: VendorContact Model

> **Phase:** 05 - ERP Core Modules Part 2  
> **SubPhase:** 10 - Vendor Module  
> **Group:** B - Contacts & Bank Details  
> **Document:** 01 of 03  
> **Tasks Covered:** 19, 20, 21, 22, 23

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-24-28_Bank-Account-Model.md](02_Tasks-24-28_Bank-Account-Model.md)

---

## Document Overview

This document creates the VendorContact model to manage multiple contact persons per vendor, including contact roles, personal details, and relationship management.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 19 | Create VendorContact Model | Medium | 25 min |
| 20 | Define ContactRole Choices | Low | 15 min |
| 21 | Add Contact Core Fields | Medium | 20 min |
| 22 | Add Contact Role Fields | Medium | 20 min |
| 23 | Run Contact Migrations | Low | 15 min |

---

## Task 19: Create VendorContact Model

### Overview
Create the VendorContact model to store multiple contact persons for each vendor. Each vendor can have multiple contacts with different roles and responsibilities.

### Dependencies
- Group A completed: Vendor model exists

### Instructions

1. **Create vendor_contact.py file**
   - Create at `apps/vendors/models/vendor_contact.py`
   - Add module docstring

2. **Import required modules**
   - Import Django model fields
   - Import BaseModel or TenantAwareModel
   - Import UUID
   - Import Vendor model

3. **Define VendorContact model class**
   - Inherit from appropriate base model
   - Add class docstring
   - Add Meta class

4. **Add id field**
   - Type: UUIDField
   - Primary key: True
   - Default: uuid.uuid4
   - Editable: False

5. **Add vendor field**
   - Type: ForeignKey to Vendor
   - On_delete: CASCADE
   - Related_name: 'contacts'
   - Purpose: Link contact to vendor

6. **Configure Meta class**
   - Table name: vendors_vendor_contact
   - Ordering: ['-is_primary', 'last_name', 'first_name']
   - Verbose names: singular and plural

7. **Add __str__ method**
   - Return: "{first_name} {last_name} ({vendor.company_name})"
   - Include role if available

8. **Update models __init__.py**
   - Import VendorContact
   - Add to __all__ list

### Model Structure

#### Relationships
```
Vendor (1) ──────── (Many) VendorContact

One vendor can have multiple contacts:
- Sales representative
- Accounts manager
- Logistics coordinator
- Technical support
```

#### Cascade Behavior
- Delete vendor → Delete all contacts
- Cannot delete vendor with contacts (optional check)
- Soft delete consideration

### Contact Lifecycle
```
Create Contact → Assign Role → Set Primary → Update Info → Archive
```

### Expected Outcome
- VendorContact model structure ready
- Proper vendor relationship
- Foundation for contact details

### Verification Checklist
- [ ] vendor_contact.py created
- [ ] VendorContact model defined
- [ ] id and vendor fields added
- [ ] Meta class configured
- [ ] __str__ method implemented
- [ ] Model imported in __init__.py

---

## Task 20: Define ContactRole Choices

### Overview
Define standard contact role choices to categorize vendor contacts by their function and responsibility within the vendor organization.

### Dependencies
- Task 19: Create VendorContact Model

### Instructions

1. **Open constants.py file**
   - Navigate to `apps/vendors/constants.py`
   - Add contact role constants

2. **Define CONTACT_ROLE_SALES constant**
   - Value: 'SALES'
   - Purpose: Sales representative
   - Primary contact for orders

3. **Define CONTACT_ROLE_ACCOUNTS constant**
   - Value: 'ACCOUNTS'
   - Purpose: Accounts/finance contact
   - Handle billing and payments

4. **Define CONTACT_ROLE_LOGISTICS constant**
   - Value: 'LOGISTICS'
   - Purpose: Shipping/logistics coordinator
   - Track deliveries and shipments

5. **Define CONTACT_ROLE_MANAGER constant**
   - Value: 'MANAGER'
   - Purpose: General manager
   - Decision maker, escalations

6. **Define CONTACT_ROLE_SUPPORT constant**
   - Value: 'SUPPORT'
   - Purpose: Technical/customer support
   - Product support, troubleshooting

7. **Define CONTACT_ROLE_OTHER constant**
   - Value: 'OTHER'
   - Purpose: Other role not listed
   - Catch-all category

8. **Create CONTACT_ROLE_CHOICES tuple**
   - Format as Django choices
   - Include all role constants
   - Order by common usage

### Contact Role Details

| Constant | Value | Display Name | Responsibility |
|----------|-------|--------------|----------------|
| CONTACT_ROLE_SALES | 'SALES' | Sales Representative | Orders, quotes |
| CONTACT_ROLE_ACCOUNTS | 'ACCOUNTS' | Accounts Manager | Billing, payments |
| CONTACT_ROLE_LOGISTICS | 'LOGISTICS' | Logistics Coordinator | Shipping, delivery |
| CONTACT_ROLE_MANAGER | 'MANAGER' | Manager | Decisions, escalations |
| CONTACT_ROLE_SUPPORT | 'SUPPORT' | Technical Support | Product support |
| CONTACT_ROLE_OTHER | 'OTHER' | Other | Miscellaneous |

### Role Responsibilities

#### Sales Representative
- Process purchase orders
- Provide quotations
- Product information
- Order status updates

#### Accounts Manager
- Invoice processing
- Payment reconciliation
- Credit management
- Financial queries

#### Logistics Coordinator
- Delivery scheduling
- Shipment tracking
- Warehouse coordination
- Delivery confirmations

#### Manager
- Strategic decisions
- Contract negotiations
- Escalation point
- Business relationships

#### Technical Support
- Product specifications
- Technical troubleshooting
- Installation support
- Warranty issues

### Multiple Roles
Single contact can have multiple roles:
- Use primary role in role field
- Add additional roles in notes
- Or create separate contact records

### Expected Outcome
- Clear contact role definitions
- Django-compatible choices tuple
- Foundation for role-based workflows

### Verification Checklist
- [ ] All role constants defined
- [ ] CONTACT_ROLE_CHOICES tuple created
- [ ] Role values follow convention
- [ ] Roles cover common scenarios

---

## Task 21: Add Contact Core Fields

### Overview
Add core personal information fields to the VendorContact model including name, email, and phone contact details.

### Dependencies
- Task 20: Define ContactRole Choices

### Instructions

1. **Open vendor_contact.py file**
   - Navigate to model definition
   - Add core fields after vendor field

2. **Add first_name field**
   - Type: CharField
   - Max length: 100
   - Required: Cannot be blank
   - Purpose: Contact's first name

3. **Add last_name field**
   - Type: CharField
   - Max length: 100
   - Required: Cannot be blank
   - Purpose: Contact's last name

4. **Add email field**
   - Type: EmailField
   - Max length: 255
   - Optional: Can be blank
   - Purpose: Email address
   - Note: Email or phone required (validate)

5. **Add phone field**
   - Type: CharField
   - Max length: 20
   - Optional: Can be blank
   - Purpose: Work phone number

6. **Add mobile field**
   - Type: CharField
   - Max length: 20
   - Optional: Can be blank
   - Purpose: Mobile/cell number

7. **Add whatsapp field**
   - Type: CharField
   - Max length: 20
   - Optional: Can be blank
   - Purpose: WhatsApp number
   - Common in Sri Lanka

8. **Add full_name property**
   - Create property method
   - Return: "{first_name} {last_name}"
   - Use for display purposes

### Core Fields Summary

| Field | Type | Required | Purpose |
|-------|------|----------|---------|
| first_name | CharField(100) | Yes | First name |
| last_name | CharField(100) | Yes | Last name |
| email | EmailField(255) | No* | Email address |
| phone | CharField(20) | No* | Work phone |
| mobile | CharField(20) | No | Mobile number |
| whatsapp | CharField(20) | No | WhatsApp number |

*Either email or phone must be provided

### Contact Information Priority
1. Email (preferred for POs)
2. WhatsApp (quick communication)
3. Mobile (direct contact)
4. Phone (office line)

### Validation Rules
- First name and last name required
- At least one of: email, phone, or mobile
- Valid email format if provided
- Valid phone format if provided

### Name Handling

#### Display Name
```
first_name: "John"
last_name: "Fernando"
full_name: "John Fernando"
```

#### Sorting
- Primary sort: last_name
- Secondary sort: first_name
- Case-insensitive

### Sri Lanka Contact Formats

#### Phone Numbers
```
Work: +94 11 234 5678
Mobile: +94 77 123 4567
WhatsApp: +94 77 123 4567 (same as mobile often)
```

#### Email
```
john.fernando@vendor-company.lk
john@vendor-company.com
```

### Expected Outcome
- Complete contact personal information
- Multiple contact methods
- Proper name handling
- Communication flexibility

### Verification Checklist
- [ ] first_name and last_name added
- [ ] email field with EmailField type
- [ ] phone and mobile fields added
- [ ] whatsapp field added
- [ ] full_name property created
- [ ] Required fields enforced

---

## Task 22: Add Contact Role Fields

### Overview
Add role, department, and position fields to categorize contacts by their function and mark primary contacts.

### Dependencies
- Task 21: Add Contact Core Fields

### Instructions

1. **Add role field**
   - Type: CharField
   - Max length: 30
   - Choices: CONTACT_ROLE_CHOICES
   - Default: CONTACT_ROLE_OTHER
   - Purpose: Contact's role/function

2. **Add department field**
   - Type: CharField
   - Max length: 100
   - Optional: Can be blank
   - Purpose: Department name
   - Examples: Sales, Accounts, Logistics

3. **Add job_title field**
   - Type: CharField
   - Max length: 100
   - Optional: Can be blank
   - Purpose: Official job title
   - Examples: Sales Manager, Accountant

4. **Add is_primary field**
   - Type: BooleanField
   - Default: False
   - Purpose: Mark as primary contact
   - Only one primary per vendor

5. **Add is_active field**
   - Type: BooleanField
   - Default: True
   - Purpose: Contact still active
   - Inactive: Left company, no longer available

6. **Add notes field**
   - Type: TextField
   - Optional: Can be blank
   - Purpose: Additional contact notes
   - Preferences, availability, languages

7. **Add created_at and updated_at**
   - Type: DateTimeField
   - Auto timestamps
   - Track contact record lifecycle

8. **Create unique constraint for primary contact**
   - Constraint: Only one is_primary=True per vendor
   - Implemented via Meta.constraints or custom validation

### Role Fields Summary

| Field | Type | Required | Purpose |
|-------|------|----------|---------|
| role | CharField(30) | Yes | Function/role |
| department | CharField(100) | No | Department |
| job_title | CharField(100) | No | Job title |
| is_primary | BooleanField | Yes | Primary contact |
| is_active | BooleanField | Yes | Active status |
| notes | TextField | No | Additional info |
| created_at | DateTimeField | Yes | Creation time |
| updated_at | DateTimeField | Yes | Update time |

### Primary Contact Rules
- Each vendor must have exactly one primary contact
- When setting new primary, unset previous primary
- Primary contact used for:
  - Default PO recipient
  - Main communication point
  - System notifications

### Primary Contact Management
```
Vendor: ABC Electronics
├── John Fernando (PRIMARY, Sales)
├── Sarah Silva (Accounts)
└── Kumar Perera (Logistics)

Set Sarah as primary:
1. Unset John's is_primary
2. Set Sarah's is_primary
3. Save both records
```

### Role vs Job Title

#### Role (System Classification)
- Predefined choices
- Used for filtering/routing
- System understanding

#### Job Title (Actual Title)
- Free text
- Person's actual title
- Display purposes

Example:
```
Role: ACCOUNTS
Job Title: Senior Financial Controller
Department: Finance
```

### Contact Status

#### Active Contact
- Currently working with vendor
- Receives communications
- Included in contact lists

#### Inactive Contact
- No longer with company
- Historical record only
- Not shown in dropdowns

### Expected Outcome
- Complete contact role information
- Primary contact designation
- Department and title tracking
- Contact lifecycle management

### Verification Checklist
- [ ] role field with choices added
- [ ] department and job_title added
- [ ] is_primary field added
- [ ] is_active field added
- [ ] notes field added
- [ ] Timestamp fields added
- [ ] Primary contact constraint planned

---

## Task 23: Run Contact Migrations

### Overview
Generate and apply migrations to create the VendorContact model table in the database.

### Dependencies
- Task 22: Add Contact Role Fields

### Instructions

1. **Verify model completeness**
   - Review all fields from Tasks 19-22
   - Check imports and relationships
   - Verify Meta class configuration

2. **Generate migration**
   - Run makemigrations for vendors app
   - Review generated migration file
   - Check foreign key to Vendor
   - Verify all fields included

3. **Review migration file**
   - Open migration in migrations/
   - Check VendorContact definition
   - Verify CASCADE delete behavior
   - Check choices definitions

4. **Apply migration**
   - Run migrate command
   - Apply to tenant schemas
   - Verify successful completion

5. **Verify database table**
   - Check vendors_vendor_contact table exists
   - Verify all columns present
   - Check foreign key constraint
   - Test indexes

6. **Test model operations**
   - Create test contact
   - Link to vendor
   - Query contacts for vendor
   - Test primary contact logic

7. **Test contact queries**
   - Get all contacts for vendor
   - Filter by role
   - Find primary contact
   - Order by name

### Migration Commands

#### Generate
```bash
python manage.py makemigrations vendors
```

#### Apply
```bash
python manage.py migrate vendors
```

#### Verify
```bash
python manage.py showmigrations vendors
```

### Testing Contact Creation

#### Create Contact
- Vendor: existing vendor instance
- First name: "John"
- Last name: "Fernando"
- Email: "john@vendor.com"
- Role: SALES
- is_primary: True

#### Query Contacts
- vendor.contacts.all()
- vendor.contacts.filter(is_primary=True)
- vendor.contacts.filter(role='SALES')
- vendor.contacts.filter(is_active=True)

### Primary Contact Validation

#### Pre-Save Signal Option
- Check if another primary exists
- If yes, unset that contact's is_primary
- Then save current contact

#### Clean Method Option
- Override clean() method
- Validate only one primary
- Raise ValidationError if violated

### Multi-Tenancy

#### Table Creation
- Table in each tenant schema
- vendor FK references tenant's vendor table
- Contacts isolated per tenant

### Expected Outcome
- VendorContact table created
- All fields and relationships functional
- Primary contact logic working
- Contact queries successful

### Verification Checklist
- [ ] Migration generated successfully
- [ ] Migration file reviewed
- [ ] Migration applied successfully
- [ ] Database table created
- [ ] Foreign key constraint exists
- [ ] Test contact created
- [ ] Contact queries work
- [ ] Primary contact logic tested

---

## Notes for AI Agents

### Contact Management Best Practices

#### Data Quality
- Verify email addresses
- Validate phone numbers
- Keep contacts up-to-date
- Remove inactive contacts

#### Communication
- Use primary contact for official comms
- CC other relevant roles
- Track communication history
- Note preferred contact method

### Primary Contact Logic

#### Setting Primary
```
# Pseudo-logic
def set_primary(contact):
    # Unset all other primary contacts for this vendor
    VendorContact.objects.filter(
        vendor=contact.vendor,
        is_primary=True
    ).exclude(id=contact.id).update(is_primary=False)
    
    # Set this contact as primary
    contact.is_primary = True
    contact.save()
```

#### Validation
- Ensure vendor always has one primary
- Don't allow deletion of primary without replacement
- Auto-set first contact as primary

### Contact Roles in Workflows

#### Purchase Order
- Send to PRIMARY or SALES role
- CC ACCOUNTS for payment terms
- CC LOGISTICS for delivery

#### Payment
- Send to ACCOUNTS role
- CC PRIMARY for awareness

#### Delivery Issues
- Contact LOGISTICS role
- Escalate to MANAGER if needed

### Contact Search and Display

#### Search Fields
- first_name
- last_name
- email
- phone
- department
- job_title

#### Display Format
```
John Fernando (Sales)
john@vendor.com | +94 77 123 4567
ABC Electronics
```

### Inactive Contact Handling
- Keep in database (historical)
- Don't show in dropdowns
- Don't send communications
- Show in "All Contacts" with indicator
- Allow reactivation if returns

### WhatsApp Integration
- Popular in Sri Lanka
- Quick communication
- Can send order updates
- Can request quotes
- Store WhatsApp number separately
- May differ from mobile

### Performance Optimization
- Index vendor_id (ForeignKey auto-indexed)
- Index is_primary for primary contact queries
- Index role for role filtering
- Index is_active for active filtering
