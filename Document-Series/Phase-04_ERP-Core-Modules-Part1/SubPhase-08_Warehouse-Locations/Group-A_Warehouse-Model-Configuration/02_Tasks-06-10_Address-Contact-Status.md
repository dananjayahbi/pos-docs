# Tasks 06-10: Address, Contact & Status Fields

> **Phase:** 04 - ERP Core Modules Part 1  
> **SubPhase:** 08 - Warehouse & Locations  
> **Group:** A - Warehouse Model & Configuration  
> **Document:** 02 of 04  
> **Tasks Covered:** 06, 07, 08, 09, 10

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-01-05_App-Structure-Model.md](01_Tasks-01-05_App-Structure-Model.md)
- **→ Next Document:** [03_Tasks-11-14_Hours-Location-Manager.md](03_Tasks-11-14_Hours-Location-Manager.md)

---

## Document Overview

This document covers the addition of warehouse address fields with Sri Lankan district support, contact information, status management, and default warehouse configuration. These fields enable complete warehouse profile management.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 06 | Add warehouse address fields | Low | 20 min |
| 07 | Add Sri Lanka district choices | Low | 15 min |
| 08 | Add warehouse contact fields | Low | 15 min |
| 09 | Add warehouse status field | Low | 15 min |
| 10 | Add is_default field | Low | 15 min |

---

## Task 06: Add Warehouse Address Fields

### Overview
Add comprehensive address fields to the Warehouse model to support Sri Lankan address formats. These fields enable proper location identification and delivery coordination.

### Dependencies
- Task 05: Create Warehouse model

### Instructions

1. **Open the warehouse model file**
   - Navigate to `inventory/warehouses/models/warehouse.py`

2. **Add address line 1 field**
   - **address_line_1:** CharField(max_length=255)
   - Verbose name: Address Line 1
   - Help text: "Street address or P.O. Box"
   - Required field (blank=False)

3. **Add address line 2 field**
   - **address_line_2:** CharField(max_length=255)
   - Verbose name: Address Line 2
   - Help text: "Apartment, suite, building, floor, etc."
   - Optional field (blank=True, null=True)

4. **Add city field**
   - **city:** CharField(max_length=100)
   - Verbose name: City
   - Help text: "e.g., Colombo, Kandy, Galle"
   - Required field
   - Store with title case

5. **Add postal code field**
   - **postal_code:** CharField(max_length=10)
   - Verbose name: Postal Code
   - Help text: "Sri Lankan postal code (5 digits)"
   - Optional field (blank=True, null=True)
   - Add validator for 5-digit format if provided

6. **Add field ordering**
   - Group address fields together in model definition
   - Order: address_line_1, address_line_2, city, district (coming in Task 07), postal_code

### Sri Lankan Address Format

Standard address format in Sri Lanka:
```
[Building/Street Number], [Street Name]
[Area/Landmark]
[City], [District]
[Postal Code]
```

Example:
```
123, Galle Road
Colombo 03
Colombo, Western Province
00300
```

### Address Validation Notes

- **Address Line 1:** Must contain street information
- **Address Line 2:** Optional for additional location details
- **City:** Major cities include Colombo, Kandy, Galle, Jaffna, Negombo
- **Postal Code:** 5-digit format (00000-99999)
- Support for Sinhala characters in future enhancement

### Expected Outcome
Warehouse model with complete address fields supporting Sri Lankan format.

### Verification Checklist
- [ ] address_line_1 field added (required)
- [ ] address_line_2 field added (optional)
- [ ] city field added (required)
- [ ] postal_code field added (optional)
- [ ] Help text explains format
- [ ] Fields grouped logically in model

---

## Task 07: Add Sri Lanka District Choices

### Overview
Add district field with Sri Lankan administrative districts. Sri Lanka has 25 districts across 9 provinces, and district selection enables proper regional reporting and logistics.

### Dependencies
- Task 06: Add warehouse address fields

### Instructions

1. **Define district constants in constants.py**
   - Open `inventory/warehouses/constants.py`
   - Add section header comment for districts

2. **Add district constant values**
   - Create constants for all 25 Sri Lankan districts
   - Use format: DISTRICT_{NAME} = '{name}'
   - Group by province in comments

3. **Create district choices tuple**
   - Define SRI_LANKA_DISTRICTS as tuple of tuples
   - Format: (constant_value, display_label)
   - Group by province with comment separators

4. **Add district field to Warehouse model**
   - **district:** CharField(max_length=50)
   - Verbose name: District
   - Choices from SRI_LANKA_DISTRICTS
   - Required field
   - Indexed field (db_index=True)

### Sri Lanka Districts by Province

**Western Province:**
- Colombo
- Gampaha
- Kalutara

**Central Province:**
- Kandy
- Matale
- Nuwara Eliya

**Southern Province:**
- Galle
- Matara
- Hambantota

**Northern Province:**
- Jaffna
- Kilinochchi
- Mannar
- Vavuniya
- Mullaitivu

**Eastern Province:**
- Batticaloa
- Ampara
- Trincomalee

**North Western Province:**
- Kurunegala
- Puttalam

**North Central Province:**
- Anuradhapura
- Polonnaruwa

**Uva Province:**
- Badulla
- Monaragala

**Sabaragamuwa Province:**
- Ratnapura
- Kegalle

### District Selection Benefits

- **Regional Reporting:** Aggregate warehouse capacity by district
- **Transfer Routing:** Calculate inter-district transfers
- **Delivery Zones:** Map delivery areas to districts
- **Compliance:** Align with government administrative divisions

### Expected Outcome
- Constants file with all 25 districts
- District choices tuple
- District field in Warehouse model

### Verification Checklist
- [ ] All 25 districts defined in constants
- [ ] Districts grouped by province
- [ ] SRI_LANKA_DISTRICTS tuple created
- [ ] district field added to model
- [ ] Field is indexed for queries

---

## Task 08: Add Warehouse Contact Fields

### Overview
Add contact information fields including phone number, email, and manager name. These fields enable communication with warehouse staff and operational coordination.

### Dependencies
- Task 05: Create Warehouse model

### Instructions

1. **Add phone field**
   - **phone:** CharField(max_length=20)
   - Verbose name: Phone Number
   - Help text: "Format: +94 XX XXX XXXX"
   - Required field
   - Add validator for Sri Lankan phone format

2. **Add email field**
   - **email:** EmailField
   - Verbose name: Email Address
   - Help text: "Warehouse contact email"
   - Optional field (blank=True, null=True)
   - Lowercase storage

3. **Add manager name field**
   - **manager_name:** CharField(max_length=200)
   - Verbose name: Manager Name
   - Help text: "Warehouse manager or supervisor"
   - Optional field (blank=True, null=True)

4. **Create phone validator**
   - Create validators directory if not exists
   - Create custom validator for Sri Lankan phone format
   - Pattern: +94 followed by 9 digits
   - Allow spaces and hyphens in input
   - Store in standardized format

5. **Group contact fields**
   - Place all contact fields together in model
   - Order: phone, email, manager_name

### Sri Lankan Phone Format

**Standard Format:** +94 XX XXX XXXX

**Mobile Patterns:**
- Dialog: +94 77, +94 76
- Mobitel: +94 71, +94 70
- Hutch: +94 78
- Airtel: +94 75
- Etisalat: +94 72

**Landline Patterns:**
- Colombo: +94 11
- Kandy: +94 81
- Galle: +94 91
- Regional: +94 XX (various area codes)

### Validation Rules

1. **Phone Number:**
   - Must start with +94
   - Followed by 9 digits total
   - Can include spaces/hyphens for readability
   - Store in consistent format: +94XXXXXXXXX

2. **Email:**
   - Standard email format validation
   - Optional but recommended
   - Use for notifications and reports

3. **Manager Name:**
   - Optional field
   - Support for Sinhala/Tamil names in future
   - Store full name with title if provided

### Expected Outcome
Warehouse model with contact fields and Sri Lankan phone validation.

### Verification Checklist
- [ ] phone field added with validator
- [ ] email field added (EmailField)
- [ ] manager_name field added
- [ ] Phone validator created
- [ ] Help text explains format
- [ ] Contact fields grouped together

---

## Task 09: Add Warehouse Status Field

### Overview
Add the status field to track warehouse operational state. This field uses the status constants defined earlier to manage warehouse lifecycle.

### Dependencies
- Task 03: Define warehouse status constants
- Task 05: Create Warehouse model

### Instructions

1. **Add status field to Warehouse model**
   - **status:** CharField(max_length=20)
   - Verbose name: Status
   - Choices from WAREHOUSE_STATUS_CHOICES
   - Default to WAREHOUSE_STATUS_ACTIVE
   - Indexed field (db_index=True)
   - Required field

2. **Add status change tracking**
   - Consider adding status_changed_at field (DateTimeField)
   - Consider adding status_changed_by field (FK to User)
   - These fields optional but useful for audit

3. **Add status query methods**
   - Consider helper methods for status checks
   - is_active() method returns True if status is ACTIVE
   - is_operational() method returns True if not INACTIVE

4. **Add status validation**
   - Validate status transitions if needed
   - MAINTENANCE → ACTIVE allowed
   - INACTIVE → ACTIVE requires approval
   - Document any transition rules

### Status Lifecycle

```
┌─────────────────┐
│  ACTIVE         │ ←──┐
│  (operational)  │    │
└────────┬────────┘    │
         │             │
         ↓             │
┌─────────────────┐    │
│  MAINTENANCE    │ ───┘
│  (temporary)    │
└─────────────────┘

         ↓
┌─────────────────┐
│  INACTIVE       │
│  (deactivated)  │
└─────────────────┘
```

### Status Impact on Operations

| Status | Receiving | Shipping | Transfers | Inventory Count |
|--------|-----------|----------|-----------|-----------------|
| ACTIVE | ✓ | ✓ | ✓ | ✓ |
| MAINTENANCE | Limited | Limited | No | ✓ |
| INACTIVE | ✗ | ✗ | ✗ | Read-only |

### Expected Outcome
Warehouse model with status field and lifecycle management.

### Verification Checklist
- [ ] status field added with choices
- [ ] Default value set to ACTIVE
- [ ] Field is indexed
- [ ] Helper methods added
- [ ] Status validation implemented

---

## Task 10: Add is_default Field

### Overview
Add the is_default field to designate one warehouse as the default for POS operations and automatic selections. Only one warehouse per tenant can be marked as default.

### Dependencies
- Task 05: Create Warehouse model

### Instructions

1. **Add is_default field**
   - **is_default:** BooleanField
   - Verbose name: Default Warehouse
   - Help text: "Default warehouse for POS and automatic operations"
   - Default value: False
   - Indexed field (db_index=True)

2. **Plan for constraint**
   - Note that database constraint will be added later (Task 15)
   - Constraint ensures only one is_default=True per tenant
   - Document this requirement in model docstring

3. **Add query convenience**
   - Consider adding to custom manager (coming in Task 14)
   - get_default() method to retrieve default warehouse
   - Common query pattern across the system

4. **Document use cases**
   - Add comments explaining when is_default is used
   - POS terminal operations use default warehouse
   - Stock inquiries default to main warehouse
   - New product creation assigns to default location

### Default Warehouse Behavior

**Automatic Selection Scenarios:**
1. **POS Sales:** Use default warehouse for stock deduction
2. **Stock Inquiries:** Show default warehouse stock first
3. **Product Creation:** Assign initial stock to default location
4. **Mobile Apps:** Default warehouse for delivery driver apps
5. **Quick Actions:** Skip warehouse selection in common workflows

**Constraint Rules:**
- Exactly one warehouse can be is_default=True per tenant
- When setting new default, old default automatically unset
- Cannot delete default warehouse without reassigning
- Cannot set INACTIVE warehouse as default

### Set Default Workflow

```
User Action: Set Warehouse as Default
    │
    ▼
Check: Warehouse is ACTIVE?
    │
    ▼ (Yes)
Find: Current default warehouse
    │
    ▼
Transaction Start:
    │
    ├─ Set old default: is_default = False
    │
    └─ Set new default: is_default = True
    │
    ▼
Transaction Commit
    │
    ▼
Notify: Default warehouse changed
```

### Expected Outcome
Warehouse model with is_default field and behavior documentation.

### Verification Checklist
- [ ] is_default field added (BooleanField)
- [ ] Default value is False
- [ ] Field is indexed
- [ ] Help text explains purpose
- [ ] Use cases documented in comments
- [ ] Constraint planned for Task 15

---

## Summary

These five tasks added comprehensive warehouse profile fields:

1. **Address fields** with Sri Lankan format support (line 1, line 2, city, postal code)
2. **District field** with all 25 Sri Lankan districts organized by province
3. **Contact fields** with phone validation (+94 format), email, and manager name
4. **Status field** for operational state management (ACTIVE, INACTIVE, MAINTENANCE)
5. **is_default field** for POS and automatic warehouse selection

### What's Next?

The next document covers operating hours, GPS coordinates, Meta class configuration, and custom model manager.

**→ Continue to:** [03_Tasks-11-14_Hours-Location-Manager.md](03_Tasks-11-14_Hours-Location-Manager.md)
