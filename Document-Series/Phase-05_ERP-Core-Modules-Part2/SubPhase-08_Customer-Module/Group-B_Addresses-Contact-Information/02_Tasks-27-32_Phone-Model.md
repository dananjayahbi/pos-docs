# Tasks 27-32: Phone Model

> **Phase:** 05 - ERP Core Modules Part 2  
> **SubPhase:** 08 - Customer Module  
> **Group:** B - Addresses & Contact Information  
> **Document:** 02 of 03  
> **Tasks Covered:** 27, 28, 29, 30, 31, 32

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-19-26_Address-Model.md](01_Tasks-19-26_Address-Model.md)
- **→ Next Document:** [03_Tasks-33-34_SL-Location-Data.md](03_Tasks-33-34_SL-Location-Data.md)

---

## Document Overview

This document covers the implementation of the CustomerPhone model to support multiple phone numbers per customer with Sri Lanka phone format validation and WhatsApp support.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 27 | Create CustomerPhone Model | Medium | 25 min |
| 28 | Define PhoneType Choices | Low | 15 min |
| 29 | Add Phone Number Fields | Medium | 20 min |
| 30 | Add Phone Validation | Medium | 25 min |
| 31 | Add WhatsApp Indicator | Low | 15 min |
| 32 | Run Phone Migrations | Low | 15 min |

---

## Task 27: Create CustomerPhone Model

### Overview
Create the CustomerPhone model to store multiple phone numbers per customer with type classification and verification status tracking.

### Dependencies
- Customer model exists

### Instructions

1. **Create customer_phone.py model file**
   - Create file at `apps/customers/models/customer_phone.py`

2. **Define CustomerPhone model**
   - Inherit from TimestampMixin
   - Add id (UUIDField)
   - Add customer ForeignKey (related_name='phone_numbers')
   - Add __str__ method

3. **Update models/__init__.py**
   - Import CustomerPhone

### Expected Outcome
- CustomerPhone model foundation
- Customer relationship established

### Verification Checklist
- [ ] customer_phone.py file created
- [ ] CustomerPhone class defined
- [ ] customer ForeignKey added
- [ ] Model imported in __init__.py

---

## Task 28: Define PhoneType Choices

### Overview
Define phone type constants for mobile, landline, WhatsApp, work, and other phone types.

### Dependencies
- Task 27: Create CustomerPhone Model

### Instructions

1. **Open constants.py**
   - Add phone type constants section

2. **Define phone type constants**
   - PHONE_TYPE_MOBILE = 'mobile'
   - PHONE_TYPE_LANDLINE = 'landline'
   - PHONE_TYPE_WHATSAPP = 'whatsapp'
   - PHONE_TYPE_WORK = 'work'
   - PHONE_TYPE_OTHER = 'other'

3. **Create PHONE_TYPE_CHOICES tuple**

4. **Add phone_type field to model**
   - CharField with PHONE_TYPE_CHOICES

### Phone Type Details

| Type | Value | Sri Lanka Use Case |
|------|-------|-------------------|
| MOBILE | 'mobile' | 07X numbers, most common |
| LANDLINE | 'landline' | 01X, 08X, 09X numbers |
| WHATSAPP | 'whatsapp' | WhatsApp-enabled mobile |
| WORK | 'work' | Office phone |
| OTHER | 'other' | Miscellaneous |

### Expected Outcome
- Phone type categorization
- Flexible phone purpose tracking

### Verification Checklist
- [ ] All PHONE_TYPE constants defined
- [ ] phone_type field added to model

---

## Task 29: Add Phone Number Fields

### Overview
Add phone number, primary flag, and verification fields to the CustomerPhone model.

### Dependencies
- Task 28: Define PhoneType Choices

### Instructions

1. **Add phone_number field**
   - CharField, max_length=20
   - Required field
   - Sri Lanka format (+94 XX XXX XXXX)

2. **Add is_primary field**
   - BooleanField, default=False
   - Marks primary phone number

3. **Add is_verified field**
   - BooleanField, default=False
   - Phone verification status

4. **Add verified_at field**
   - DateTimeField, optional
   - Timestamp of verification

5. **Create save method**
   - Ensure only one primary phone per customer

### Phone Number Fields Structure

```
┌─────────────────────────────────────────────────┐
│          CustomerPhone Fields                   │
├─────────────────────────────────────────────────┤
│  • phone_number (CharField, 20)                 │
│  • phone_type (CharField with choices)          │
│  • is_primary (Boolean)                         │
│  • is_verified (Boolean)                        │
│  • verified_at (DateTime, optional)             │
└─────────────────────────────────────────────────┘
```

### Expected Outcome
- Complete phone number storage
- Primary phone designation
- Verification tracking

### Verification Checklist
- [ ] phone_number field added
- [ ] is_primary field added
- [ ] is_verified field added
- [ ] verified_at field added
- [ ] save method overridden

---

## Task 30: Add Phone Validation

### Overview
Implement Sri Lanka phone format validation using regex patterns for mobile and landline numbers.

### Dependencies
- Task 29: Add Phone Number Fields

### Instructions

1. **Update validators.py**
   - Add validate_phone_number function

2. **Define validation patterns**
   - Mobile: ^\\+94\\s?7[0-8]\\s?\\d{3}\\s?\\d{4}$
   - Landline: ^\\+94\\s?\\d{2}\\s?\\d{3}\\s?\\d{4}$
   - Also accept 0XX format

3. **Add clean method to CustomerPhone**
   - Validate phone format
   - Normalize phone number storage

4. **Add help text**
   - phone_number help_text: "Format: +94 77 123 4567"

### Sri Lanka Phone Formats

```
Mobile Numbers
══════════════
Format: +94 7X XXX XXXX
Prefixes: 70, 71, 72, 75, 76, 77, 78
Example: +94 77 123 4567
Alternative: 0771234567

Landline Numbers
════════════════
Format: +94 XX XXX XXXX
Colombo: +94 11 XXX XXXX
Kandy: +94 81 XXX XXXX
Galle: +94 91 XXX XXXX
Example: +94 11 234 5678
Alternative: 0112345678
```

### Expected Outcome
- Sri Lanka phone format validation
- Standardized phone number storage

### Verification Checklist
- [ ] validate_phone_number function created
- [ ] Regex patterns defined
- [ ] clean method added
- [ ] Help text added

---

## Task 31: Add WhatsApp Indicator

### Overview
Add a boolean field to indicate if a phone number has WhatsApp, enabling WhatsApp-based communication.

### Dependencies
- Task 30: Add Phone Validation

### Instructions

1. **Add is_whatsapp field**
   - BooleanField, default=False
   - Indicates WhatsApp availability

2. **Update model docstring**
   - Document WhatsApp indicator purpose

### WhatsApp Usage

```
WhatsApp in Sri Lanka
═════════════════════

Popularity:
  • Extremely popular messaging platform
  • Used for orders, customer service
  • Alternative to SMS

Use Cases:
  • Order confirmations via WhatsApp
  • Customer support chat
  • Promotional messages
  • Product catalog sharing
```

### Expected Outcome
- WhatsApp capability tracking
- Enable WhatsApp-based features

### Verification Checklist
- [ ] is_whatsapp field added
- [ ] Model docstring updated

---

## Task 32: Run Phone Migrations

### Overview
Generate and apply migrations for the CustomerPhone model.

### Dependencies
- Task 31: Add WhatsApp Indicator

### Instructions

1. **Make migrations**
   - Run makemigrations command

2. **Apply migrations**
   - Run migrate command

3. **Test phone creation**
   - Create test phone numbers
   - Verify validation works
   - Test primary phone logic

### Expected Outcome
- Database table created
- All fields functional
- Validation working

### Verification Checklist
- [ ] makemigrations executed
- [ ] migrate executed
- [ ] Table created
- [ ] Test phone creation successful

---

## Summary

This document implemented the CustomerPhone model:

### Completed Features
- ✅ CustomerPhone model with customer relationship
- ✅ Phone type choices (mobile, landline, WhatsApp, work, other)
- ✅ Phone number fields with primary flag
- ✅ Sri Lanka phone format validation
- ✅ WhatsApp indicator
- ✅ Verification tracking
- ✅ Database migrations applied

### Key Achievements
1. **Multi-Phone Support** - Multiple numbers per customer
2. **Type Classification** - Clear phone purpose categorization
3. **Sri Lanka Formats** - Mobile and landline validation
4. **WhatsApp Integration** - WhatsApp capability tracking
5. **Primary Management** - Automatic primary phone handling

### Next Steps
Proceed to [03_Tasks-33-34_SL-Location-Data.md](03_Tasks-33-34_SL-Location-Data.md) to create Sri Lanka provinces and districts reference data.

---

**Document Status:** ✅ Complete  
**Total Tasks:** 6  
**Total Lines:** ~670
