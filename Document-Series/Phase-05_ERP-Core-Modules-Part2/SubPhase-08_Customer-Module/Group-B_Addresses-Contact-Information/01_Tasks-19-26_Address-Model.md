# Tasks 19-26: Address Model

> **Phase:** 05 - ERP Core Modules Part 2  
> **SubPhase:** 08 - Customer Module  
> **Group:** B - Addresses & Contact Information  
> **Document:** 01 of 03  
> **Tasks Covered:** 19, 20, 21, 22, 23, 24, 25, 26

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-27-32_Phone-Model.md](02_Tasks-27-32_Phone-Model.md)

---

## Document Overview

This document covers the implementation of the CustomerAddress model to support multiple addresses per customer with Sri Lanka-specific location fields including districts and provinces.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 19 | Create CustomerAddress Model | Medium | 25 min |
| 20 | Define AddressType Choices | Low | 15 min |
| 21 | Add Address Core Fields | Medium | 20 min |
| 22 | Add Sri Lanka Address Fields | Medium | 25 min |
| 23 | Add Address Postal Fields | Low | 15 min |
| 24 | Add Address Default Flag | Medium | 20 min |
| 25 | Add Address Validation | Medium | 25 min |
| 26 | Run Address Migrations | Low | 15 min |

---

## Task 19: Create CustomerAddress Model

### Overview
Create the CustomerAddress model to store multiple addresses per customer. This model supports various address types (billing, shipping, home, work) and enables customers to maintain multiple address records.

### Dependencies
- Customer model exists
- Base model mixins available

### Instructions

1. **Create customer_address.py model file**
   - Create file at `apps/customers/models/customer_address.py`
   - Import necessary Django components

2. **Import required modules**
   - Import Django model fields
   - Import base model mixins (TimestampMixin)
   - Import Customer model
   - Import UUID for primary key

3. **Define CustomerAddress model class**
   - Inherit from TimestampMixin
   - Add model docstring

4. **Add id field**
   - UUIDField as primary key
   - Default to uuid.uuid4

5. **Add customer relationship field**
   - ForeignKey to Customer model
   - on_delete=CASCADE
   - related_name='addresses'

6. **Add Meta class**
   - Set verbose_name and verbose_name_plural
   - Add ordering by is_default_billing, created_at
   - Prepare for indexes (will add in later tasks)

7. **Add __str__ method**
   - Return formatted address string
   - Include address type and customer name

8. **Update models/__init__.py**
   - Import CustomerAddress
   - Add to __all__ list

### CustomerAddress Model Structure

```
┌─────────────────────────────────────────────────┐
│          CustomerAddress Model                  │
├─────────────────────────────────────────────────┤
│ Core Relationship:                              │
│  • id (UUIDField, primary key)                  │
│  • customer (ForeignKey to Customer)            │
│                                                 │
│ Inherited from TimestampMixin:                  │
│  • created_at (DateTimeField)                   │
│  • updated_at (DateTimeField)                   │
│                                                 │
│ Fields to add in subsequent tasks:              │
│  • address_type                                 │
│  • address lines, city, district, province      │
│  • postal_code, country                         │
│  • default flags                                │
└─────────────────────────────────────────────────┘
```

### Customer-Address Relationship

```
Customer to Address Relationship
═════════════════════════════════

Customer (One)
  │
  ├──► Address 1 (Billing - default)
  ├──► Address 2 (Shipping - default)
  ├──► Address 3 (Home)
  └──► Address 4 (Work)

Relationship Type: One-to-Many
Access Pattern:
  customer.addresses.all()  → QuerySet of addresses
  address.customer          → Customer instance
```

### Expected Outcome
- CustomerAddress model foundation
- Relationship to Customer established
- Timestamping capability
- Ready for additional fields

### Verification Checklist
- [ ] customer_address.py file created
- [ ] CustomerAddress class defined
- [ ] id field added (UUIDField)
- [ ] customer ForeignKey added
- [ ] Meta class configured
- [ ] __str__ method implemented
- [ ] Model imported in __init__.py

---

## Task 20: Define AddressType Choices

### Overview
Define address type constants to categorize addresses based on their purpose. The system supports billing, shipping, home, work, and other address types.

### Dependencies
- Task 19: Create CustomerAddress Model
- constants.py file exists

### Instructions

1. **Open constants.py file**
   - Navigate to `apps/customers/constants.py`
   - Add address type constants section

2. **Define ADDRESS_TYPE_BILLING constant**
   - Value: 'billing'
   - Purpose: Invoice and billing address

3. **Define ADDRESS_TYPE_SHIPPING constant**
   - Value: 'shipping'
   - Purpose: Delivery address

4. **Define ADDRESS_TYPE_HOME constant**
   - Value: 'home'
   - Purpose: Residential address

5. **Define ADDRESS_TYPE_WORK constant**
   - Value: 'work'
   - Purpose: Office/work address

6. **Define ADDRESS_TYPE_OTHER constant**
   - Value: 'other'
   - Purpose: Other address types

7. **Define ADDRESS_TYPE_CHOICES tuple**
   - Create tuple of address type choices
   - Follow Django's choices pattern

8. **Open customer_address.py model file**
   - Add address_type field
   - CharField with ADDRESS_TYPE_CHOICES
   - Required field

### Address Type Details

| Constant | Value | Display Name | Use Case |
|----------|-------|--------------|----------|
| ADDRESS_TYPE_BILLING | 'billing' | Billing Address | Invoice, payment |
| ADDRESS_TYPE_SHIPPING | 'shipping' | Shipping Address | Delivery |
| ADDRESS_TYPE_HOME | 'home' | Home Address | Residential |
| ADDRESS_TYPE_WORK | 'work' | Work Address | Office |
| ADDRESS_TYPE_OTHER | 'other' | Other | Miscellaneous |

### Address Type Usage

```
Address Type Scenarios
══════════════════════

B2C Customer:
  • BILLING: Credit card billing address
  • SHIPPING: Home delivery address
  • May be same or different

B2B Customer:
  • BILLING: Company registration address
  • SHIPPING: Warehouse/office delivery address
  • WORK: Office location
  • Often different

Individual:
  • HOME: Personal residence
  • WORK: Office for weekday delivery
  • OTHER: Friend's address, temporary location
```

### Expected Outcome
- Clear address type categorization
- Flexible address purpose tracking
- Support for multiple address uses

### Verification Checklist
- [ ] All ADDRESS_TYPE constants defined
- [ ] ADDRESS_TYPE_CHOICES tuple created
- [ ] address_type field added to model
- [ ] Field has proper choices and default

---

## Task 21: Add Address Core Fields

### Overview
Add core address fields including address lines and city to the CustomerAddress model. These fields capture the primary location information.

### Dependencies
- Task 20: Define AddressType Choices

### Instructions

1. **Open customer_address.py model file**
   - Continue in `apps/customers/models/customer_address.py`

2. **Add address_line_1 field**
   - CharField, max_length=255
   - Required field
   - Main address line (house no, street)

3. **Add address_line_2 field**
   - CharField, max_length=255
   - Optional (blank=True, null=False, default='')
   - Additional address details

4. **Add city field**
   - CharField, max_length=100
   - Required field
   - City or town name

5. **Update __str__ method**
   - Include address_line_1 and city
   - Format: "{address_type} - {address_line_1}, {city}"

### Address Core Fields Structure

```
┌─────────────────────────────────────────────────┐
│          Address Core Fields                    │
├─────────────────────────────────────────────────┤
│  • address_line_1 (CharField, 255, required)    │
│    House number, street name                    │
│                                                 │
│  • address_line_2 (CharField, 255, optional)    │
│    Additional location details                  │
│                                                 │
│  • city (CharField, 100, required)              │
│    City or town name                            │
└─────────────────────────────────────────────────┘
```

### Sri Lanka Address Format Example

```
Address Line Usage
══════════════════

address_line_1: "No. 123, Galle Road"
address_line_2: "Near Temple Junction"
city: "Colombo"

Full Address Display:
  No. 123, Galle Road
  Near Temple Junction
  Colombo 03, Colombo District
  Western Province
  Sri Lanka - 00300
```

### Expected Outcome
- Core address fields implemented
- Support for two-line addresses
- City field for location identification

### Verification Checklist
- [ ] address_line_1 field added
- [ ] address_line_2 field added
- [ ] city field added
- [ ] __str__ method updated

---

## Task 22: Add Sri Lanka Address Fields

### Overview
Add Sri Lanka-specific address fields including district and province. These fields are essential for proper address management and logistics in Sri Lanka.

### Dependencies
- Task 21: Add Address Core Fields

### Instructions

1. **Open customer_address.py model file**
   - Continue in model file

2. **Add district field**
   - CharField, max_length=100
   - Required field
   - Sri Lanka district name (25 districts)

3. **Add province field**
   - CharField, max_length=100
   - Required field
   - Sri Lanka province name (9 provinces)

4. **Add help text to fields**
   - district help_text: "Sri Lanka District (e.g., Colombo District)"
   - province help_text: "Sri Lanka Province (e.g., Western Province)"

### Sri Lanka Administrative Divisions

```
Sri Lanka Geographic Structure
═══════════════════════════════

9 Provinces:
  1. Western Province
  2. Central Province
  3. Southern Province
  4. Northern Province
  5. Eastern Province
  6. North Western Province
  7. North Central Province
  8. Uva Province
  9. Sabaragamuwa Province

25 Districts:
  Western Province:
    • Colombo District
    • Gampaha District
    • Kalutara District
  
  Central Province:
    • Kandy District
    • Matale District
    • Nuwara Eliya District
  
  (And 19 more districts)
```

### District-Province Mapping

| Province | Districts |
|----------|-----------|
| Western | Colombo, Gampaha, Kalutara |
| Central | Kandy, Matale, Nuwara Eliya |
| Southern | Galle, Matara, Hambantota |
| Northern | Jaffna, Kilinochchi, Mannar, Mullaitivu, Vavuniya |
| Eastern | Batticaloa, Ampara, Trincomalee |
| North Western | Kurunegala, Puttalam |
| North Central | Anuradhapura, Polonnaruwa |
| Uva | Badulla, Monaragala |
| Sabaragamuwa | Ratnapura, Kegalle |

### Expected Outcome
- Sri Lanka district field
- Sri Lanka province field
- Proper geographic categorization

### Verification Checklist
- [ ] district field added
- [ ] province field added
- [ ] Help text added to both fields

---

## Task 23: Add Address Postal Fields

### Overview
Add postal code and country fields to complete the address structure. The country field defaults to "Sri Lanka" but allows international addresses.

### Dependencies
- Task 22: Add Sri Lanka Address Fields

### Instructions

1. **Open customer_address.py model file**
   - Continue in model file

2. **Add postal_code field**
   - CharField, max_length=10
   - Optional (blank=True, null=False, default='')
   - Sri Lanka postal codes are 5 digits

3. **Add country field**
   - CharField, max_length=100
   - Default to "Sri Lanka"
   - Required field

### Sri Lanka Postal Code System

```
Sri Lanka Postal Codes
══════════════════════

Format: 5-digit number

Major Cities:
  • Colombo 01: 00100
  • Colombo 03: 00300
  • Kandy: 20000
  • Galle: 80000
  • Jaffna: 40000

Structure:
  First 2 digits: Postal region
  Last 3 digits: Specific area
```

### Expected Outcome
- Postal code support
- Default country as Sri Lanka
- International address capability

### Verification Checklist
- [ ] postal_code field added
- [ ] country field added with default
- [ ] Fields properly configured

---

## Task 24: Add Address Default Flag

### Overview
Add boolean flags to mark default billing and shipping addresses. Only one address per customer can be the default for each type.

### Dependencies
- Task 23: Add Address Postal Fields

### Instructions

1. **Open customer_address.py model file**
   - Continue in model file

2. **Add is_default_billing field**
   - BooleanField, default=False
   - Marks default billing address

3. **Add is_default_shipping field**
   - BooleanField, default=False
   - Marks default shipping address

4. **Create save method override**
   - Before saving, if is_default_billing=True
   - Unset is_default_billing on other addresses
   - Same logic for is_default_shipping

5. **Add property: is_default**
   - Return True if either default flag is True

### Default Address Logic

```
Default Address Management
══════════════════════════

Rule: Only one default per type per customer

Customer has 3 addresses:
  Address 1: is_default_billing=True, is_default_shipping=False
  Address 2: is_default_billing=False, is_default_shipping=True
  Address 3: is_default_billing=False, is_default_shipping=False

When setting Address 3 as default billing:
  1. Address 3.is_default_billing = True
  2. Address 3.save()
  3. Address 1.is_default_billing = False (automatic)
  4. Address 3 becomes the default billing address
```

### Expected Outcome
- Default billing address support
- Default shipping address support
- Automatic default management

### Verification Checklist
- [ ] is_default_billing field added
- [ ] is_default_shipping field added
- [ ] save method overridden
- [ ] is_default property added

---

## Task 25: Add Address Validation

### Overview
Create validation logic to ensure district-province mapping is correct and addresses are properly formatted. Use Django validators and model clean method.

### Dependencies
- Task 24: Add Address Default Flag

### Instructions

1. **Create validators.py file**
   - Create `apps/customers/validators.py`
   - Import ValidationError

2. **Define validate_district_province function**
   - Accept district and province parameters
   - Check if district belongs to province
   - Raise ValidationError if mismatch

3. **Create district-province mapping dict**
   - Map each province to list of districts
   - Use for validation lookup

4. **Add clean method to CustomerAddress**
   - Override clean() method
   - Call validate_district_province
   - Validate postal code format (5 digits)

5. **Add postal code validator**
   - Create validate_postal_code function
   - Check 5-digit format for Sri Lanka addresses

### District-Province Validation

```
Validation Rules
════════════════

Rule 1: District must belong to Province
  Example:
    district = "Colombo District"
    province = "Western Province"
    → Valid ✅
    
    district = "Colombo District"
    province = "Central Province"
    → Invalid ❌ (Colombo is in Western, not Central)

Rule 2: Postal code format
  • 5 digits for Sri Lanka
  • Optional for international

Rule 3: Required fields
  • address_line_1 must not be empty
  • city must not be empty
```

### Expected Outcome
- District-province validation
- Postal code format validation
- Data integrity assurance

### Verification Checklist
- [ ] validators.py file created
- [ ] validate_district_province function implemented
- [ ] District-province mapping dict created
- [ ] clean method added to model
- [ ] validate_postal_code function implemented

---

## Task 26: Run Address Migrations

### Overview
Generate and apply migrations for the CustomerAddress model. This creates the database table with all fields, relationships, and indexes.

### Dependencies
- Task 25: Add Address Validation
- All CustomerAddress fields defined

### Instructions

1. **Make migrations**
   - Run makemigrations command
   - Review generated migration file

2. **Apply migrations**
   - Run migrate command
   - Verify table creation

3. **Test address creation**
   - Create test customer address
   - Verify all fields work
   - Test default address logic
   - Test validation

4. **Verify database structure**
   - Check customers_customeraddress table
   - Verify all columns present
   - Check foreign key to customer

### Expected Outcome
- Database table created
- All fields functional
- Foreign key relationship established
- Validation working

### Verification Checklist
- [ ] makemigrations executed
- [ ] Migration file generated
- [ ] migrate executed successfully
- [ ] Table created in database
- [ ] Test address creation successful
- [ ] Default logic working
- [ ] Validation functioning

---

## Summary

This document implemented the CustomerAddress model:

### Completed Features
- ✅ CustomerAddress model with customer relationship
- ✅ Address type choices (billing, shipping, home, work, other)
- ✅ Core address fields (lines, city)
- ✅ Sri Lanka-specific fields (district, province)
- ✅ Postal fields (postal code, country)
- ✅ Default address flags
- ✅ District-province validation
- ✅ Database migrations applied

### Key Achievements
1. **Multi-Address Support** - Customers can have multiple addresses
2. **Type Classification** - Clear address purpose categorization
3. **Sri Lanka Integration** - District and province fields
4. **Default Management** - Automatic default address handling
5. **Data Validation** - Geographic integrity checks

### Next Steps
Proceed to [02_Tasks-27-32_Phone-Model.md](02_Tasks-27-32_Phone-Model.md) to implement multiple phone numbers per customer with Sri Lanka phone format validation.

---

**Document Status:** ✅ Complete  
**Total Tasks:** 8  
**Total Lines:** ~950
