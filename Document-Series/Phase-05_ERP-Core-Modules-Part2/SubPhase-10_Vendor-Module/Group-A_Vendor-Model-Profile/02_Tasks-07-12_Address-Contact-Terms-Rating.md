# Tasks 07-12: Address, Contact, Terms, Notes, Rating

> **Phase:** 05 - ERP Core Modules Part 2  
> **SubPhase:** 10 - Vendor Module  
> **Group:** A - Vendor Model & Profile  
> **Document:** 02 of 03  
> **Tasks Covered:** 07, 08, 09, 10, 11, 12

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-01-06_App-Setup-Model-Core.md](01_Tasks-01-06_App-Setup-Model-Core.md)
- **→ Next Document:** [03_Tasks-13-18_Dates-Code-Logo-Index-Migration.md](03_Tasks-13-18_Dates-Code-Logo-Index-Migration.md)

---

## Document Overview

This document adds address, contact, payment terms, lead time, notes, and rating fields to the Vendor model, expanding vendor profile capabilities for operational management.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 07 | Add Vendor Address Fields | Medium | 20 min |
| 08 | Add Vendor Contact Fields | Medium | 20 min |
| 09 | Add Vendor Terms Fields | Medium | 20 min |
| 10 | Add Vendor Lead Time Fields | Medium | 20 min |
| 11 | Add Vendor Notes Fields | Low | 15 min |
| 12 | Add Vendor Rating Fields | Medium | 20 min |

---

## Task 07: Add Vendor Address Fields

### Overview
Add primary address fields to the Vendor model to store vendor location information. Separate VendorAddress model will be created later for multiple addresses, but these fields store the primary address.

### Dependencies
- Task 06: Add Vendor Type Fields

### Instructions

1. **Open vendor.py model file**
   - Navigate to `apps/vendors/models/vendor.py`
   - Add address fields after type fields

2. **Add address_line_1 field**
   - Type: CharField
   - Max length: 255
   - Optional: Can be blank
   - Purpose: Primary street address

3. **Add address_line_2 field**
   - Type: CharField
   - Max length: 255
   - Optional: Can be blank and null
   - Purpose: Additional address line (suite, building)

4. **Add city field**
   - Type: CharField
   - Max length: 100
   - Optional: Can be blank
   - Purpose: City name

5. **Add district field**
   - Type: CharField
   - Max length: 100
   - Optional: Can be blank
   - Purpose: District (important for Sri Lanka)

6. **Add province field**
   - Type: CharField
   - Max length: 100
   - Optional: Can be blank
   - Purpose: Province/state

7. **Add postal_code field**
   - Type: CharField
   - Max length: 20
   - Optional: Can be blank
   - Purpose: Postal/ZIP code

### Address Fields Summary

| Field | Type | Required | Purpose |
|-------|------|----------|---------|
| address_line_1 | CharField(255) | No | Primary address |
| address_line_2 | CharField(255) | No | Secondary address |
| city | CharField(100) | No | City name |
| district | CharField(100) | No | District |
| province | CharField(100) | No | Province/state |
| postal_code | CharField(20) | No | Postal code |

### Sri Lanka Administrative Divisions

#### Provinces (9)
- Western Province
- Central Province
- Southern Province
- Northern Province
- Eastern Province
- North Western Province
- North Central Province
- Uva Province
- Sabaragamuwa Province

#### District Examples
- Colombo (Western)
- Kandy (Central)
- Galle (Southern)
- Jaffna (Northern)

### Expected Outcome
- Primary address storage on vendor
- Support for Sri Lankan address format
- Foundation for address validation

### Verification Checklist
- [ ] All address fields added
- [ ] Proper field lengths set
- [ ] Optional fields allow blank/null
- [ ] Fields logically ordered

---

## Task 08: Add Vendor Contact Fields

### Overview
Add primary contact fields to the Vendor model. These store the main contact information, while separate VendorContact model will handle multiple contacts per vendor.

### Dependencies
- Task 07: Add Vendor Address Fields

### Instructions

1. **Add primary_email field**
   - Type: EmailField
   - Max length: 255
   - Optional: Can be blank
   - Purpose: Primary contact email
   - Indexed: True for search

2. **Add secondary_email field**
   - Type: EmailField
   - Max length: 255
   - Optional: Can be blank and null
   - Purpose: Alternative contact email

3. **Add primary_phone field**
   - Type: CharField
   - Max length: 20
   - Optional: Can be blank
   - Purpose: Main phone number
   - Format: +94 XX XXX XXXX for Sri Lanka

4. **Add secondary_phone field**
   - Type: CharField
   - Max length: 20
   - Optional: Can be blank and null
   - Purpose: Alternative phone number

5. **Add mobile field**
   - Type: CharField
   - Max length: 20
   - Optional: Can be blank and null
   - Purpose: Mobile/cell number

6. **Add fax field**
   - Type: CharField
   - Max length: 20
   - Optional: Can be blank and null
   - Purpose: Fax number (if applicable)

7. **Add website field**
   - Type: URLField
   - Max length: 255
   - Optional: Can be blank and null
   - Purpose: Company website

### Contact Fields Summary

| Field | Type | Required | Purpose |
|-------|------|----------|---------|
| primary_email | EmailField(255) | No | Main email |
| secondary_email | EmailField(255) | No | Alt email |
| primary_phone | CharField(20) | No | Main phone |
| secondary_phone | CharField(20) | No | Alt phone |
| mobile | CharField(20) | No | Mobile number |
| fax | CharField(20) | No | Fax number |
| website | URLField(255) | No | Company website |

### Sri Lanka Phone Formats

#### Landline
```
+94 11 234 5678 (Colombo)
+94 81 234 5678 (Kandy)
011-2345678 (Alternative)
```

#### Mobile
```
+94 77 123 4567
+94 71 123 4567
077-1234567 (Alternative)
```

#### Fax
```
+94 11 234 5679
```

### Contact Field Priority
1. primary_email (most important)
2. primary_phone
3. mobile
4. website
5. secondary_email/phone
6. fax (legacy)

### Expected Outcome
- Multiple contact methods stored
- Email validation built-in
- Support for Sri Lankan phone formats

### Verification Checklist
- [ ] All contact fields added
- [ ] Email fields use EmailField type
- [ ] Website uses URLField type
- [ ] Phone fields have adequate length
- [ ] primary_email indexed

---

## Task 09: Add Vendor Terms Fields

### Overview
Add payment terms and credit limit fields to manage vendor financial arrangements. These fields control payment schedules and purchasing limits.

### Dependencies
- Task 08: Add Vendor Contact Fields

### Instructions

1. **Add payment_terms_days field**
   - Type: IntegerField
   - Default: 30
   - Purpose: Payment due days after invoice
   - Common values: 0, 15, 30, 45, 60, 90

2. **Add payment_terms_description field**
   - Type: CharField
   - Max length: 100
   - Optional: Can be blank
   - Purpose: Human-readable terms description
   - Examples: "Net 30", "COD", "CIA"

3. **Add credit_limit field**
   - Type: DecimalField
   - Max digits: 15
   - Decimal places: 2
   - Optional: Can be blank and null
   - Purpose: Maximum outstanding amount allowed

4. **Add currency field**
   - Type: CharField
   - Max length: 3
   - Default: "LKR"
   - Purpose: Vendor's preferred currency
   - Format: ISO 4217 currency codes

5. **Add requires_purchase_order field**
   - Type: BooleanField
   - Default: True
   - Purpose: Whether PO required before ordering

6. **Add accepts_returns field**
   - Type: BooleanField
   - Default: True
   - Purpose: Whether vendor accepts product returns

### Terms Fields Summary

| Field | Type | Required | Purpose |
|-------|------|----------|---------|
| payment_terms_days | IntegerField | Yes | Payment due days |
| payment_terms_description | CharField(100) | No | Terms description |
| credit_limit | DecimalField(15,2) | No | Credit limit |
| currency | CharField(3) | Yes | Currency code |
| requires_purchase_order | BooleanField | Yes | PO requirement |
| accepts_returns | BooleanField | Yes | Return policy |

### Payment Terms Standards

| Term | Days | Description |
|------|------|-------------|
| CIA | 0 | Cash in Advance |
| COD | 0 | Cash on Delivery |
| Net 15 | 15 | Payment within 15 days |
| Net 30 | 30 | Payment within 30 days |
| Net 45 | 45 | Payment within 45 days |
| Net 60 | 60 | Payment within 60 days |
| Net 90 | 90 | Payment within 90 days |

### Currency Codes (ISO 4217)

| Code | Currency | Region |
|------|----------|--------|
| LKR | Sri Lankan Rupee | Sri Lanka |
| USD | US Dollar | International |
| EUR | Euro | Europe |
| GBP | British Pound | UK |
| INR | Indian Rupee | India |

### Credit Limit Management
```
Credit Limit: Rs. 1,000,000
Current Outstanding: Rs. 750,000
Available Credit: Rs. 250,000

Block new POs if outstanding exceeds limit
```

### Expected Outcome
- Payment terms clearly defined
- Credit limit tracking enabled
- Multi-currency support
- Return policy clarity

### Verification Checklist
- [ ] payment_terms_days added with default
- [ ] credit_limit uses DecimalField
- [ ] currency field with ISO codes
- [ ] Boolean policy fields added
- [ ] Proper decimal precision (15,2)

---

## Task 10: Add Vendor Lead Time Fields

### Overview
Add lead time and minimum order value fields to manage procurement planning and ordering requirements.

### Dependencies
- Task 09: Add Vendor Terms Fields

### Instructions

1. **Add default_lead_time_days field**
   - Type: IntegerField
   - Default: 7
   - Purpose: Standard delivery lead time in days
   - Used for inventory planning

2. **Add minimum_order_value field**
   - Type: DecimalField
   - Max digits: 15
   - Decimal places: 2
   - Optional: Can be blank and null
   - Purpose: Minimum order amount required

3. **Add minimum_order_quantity field**
   - Type: IntegerField
   - Optional: Can be blank and null
   - Purpose: Minimum quantity requirement
   - Applied across all products

4. **Add order_multiple field**
   - Type: IntegerField
   - Optional: Can be blank and null
   - Purpose: Orders must be in multiples of this value
   - Example: 10 (order in multiples of 10 units)

### Lead Time Fields Summary

| Field | Type | Required | Purpose |
|-------|------|----------|---------|
| default_lead_time_days | IntegerField | Yes | Standard lead time |
| minimum_order_value | DecimalField(15,2) | No | Minimum order amount |
| minimum_order_quantity | IntegerField | No | Minimum quantity |
| order_multiple | IntegerField | No | Order multiple |

### Lead Time Examples

#### Local Vendors
```
Colombo-based: 1-2 days
Outstation: 3-5 days
Custom orders: 7-14 days
```

#### International Vendors
```
India: 7-10 days
China: 14-21 days
Europe: 21-30 days
US: 21-35 days
```

### Order Requirements Examples

#### Minimum Order Value
```
Vendor requires Rs. 50,000 minimum
Order total: Rs. 45,000 → Rejected
Order total: Rs. 55,000 → Accepted
```

#### Minimum Order Quantity
```
MOQ: 100 units
Order: 80 units → Rejected
Order: 150 units → Accepted
```

#### Order Multiple
```
Multiple: 12
Order: 50 units → Rejected (not multiple of 12)
Order: 48 units → Accepted (4 × 12)
Order: 60 units → Accepted (5 × 12)
```

### Expected Outcome
- Lead time planning capability
- Order requirement validation
- Inventory planning support

### Verification Checklist
- [ ] default_lead_time_days added
- [ ] minimum_order_value uses DecimalField
- [ ] minimum_order_quantity added
- [ ] order_multiple added
- [ ] All have appropriate defaults/nullability

---

## Task 11: Add Vendor Notes Fields

### Overview
Add notes and tags fields for storing additional vendor information, internal notes, and categorization tags.

### Dependencies
- Task 10: Add Vendor Lead Time Fields

### Instructions

1. **Add notes field**
   - Type: TextField
   - Optional: Can be blank
   - Purpose: Public notes visible to all users
   - Contains general vendor information

2. **Add internal_notes field**
   - Type: TextField
   - Optional: Can be blank
   - Purpose: Internal staff notes (not shown to vendor)
   - Contains sensitive information, issues, warnings

3. **Add tags field**
   - Type: JSONField
   - Default: list (empty list)
   - Purpose: Flexible tagging system
   - Format: Array of strings

### Notes Fields Summary

| Field | Type | Required | Purpose |
|-------|------|----------|---------|
| notes | TextField | No | Public notes |
| internal_notes | TextField | No | Internal notes |
| tags | JSONField | Yes | Tags array |

### Tags Usage Examples

#### Category Tags
```json
["electronics", "wholesale", "premium"]
```

#### Performance Tags
```json
["fast-delivery", "quality-issues", "reliable"]
```

#### Specialty Tags
```json
["custom-manufacturing", "bulk-discounts", "international"]
```

#### Status Tags
```json
["preferred-vendor", "requires-approval", "high-volume"]
```

### Tags vs Categories
- **vendor_type**: Official classification (one value)
- **tags**: Flexible, multiple characteristics
- Tags searchable and filterable
- Tags can be added/removed dynamically

### Internal Notes Examples
```
"Previous quality issues with Product X - resolved Jan 2025"
"Contact John only - Sarah difficult to work with"
"Always ships late - add 3 days to lead time"
"Negotiated 5% discount on orders >Rs.100,000"
```

### Public Notes Examples
```
"Authorized distributor for Samsung Electronics"
"Ships from Colombo warehouse"
"Specializes in LED lighting solutions"
"ISO 9001 certified facility"
```

### Expected Outcome
- Flexible note storage
- Tag-based categorization
- Internal information tracking

### Verification Checklist
- [ ] notes field added as TextField
- [ ] internal_notes field added
- [ ] tags field as JSONField
- [ ] tags default to empty list
- [ ] Fields allow blank where appropriate

---

## Task 12: Add Vendor Rating Fields

### Overview
Add rating and performance metric fields to track vendor quality and business volume. These are denormalized fields updated periodically for quick access.

### Dependencies
- Task 11: Add Vendor Notes Fields

### Instructions

1. **Add rating field**
   - Type: DecimalField
   - Max digits: 3
   - Decimal places: 2
   - Default: 0.00
   - Purpose: Overall vendor rating (0.00-5.00 stars)
   - Calculated from performance metrics

2. **Add total_orders field**
   - Type: IntegerField
   - Default: 0
   - Purpose: Count of purchase orders placed
   - Denormalized for quick access

3. **Add total_spend field**
   - Type: DecimalField
   - Max digits: 18
   - Decimal places: 2
   - Default: 0.00
   - Purpose: Total amount spent with vendor
   - Denormalized for reporting

4. **Add last_rating_update field**
   - Type: DateTimeField
   - Optional: Can be blank and null
   - Purpose: When rating was last calculated
   - Used to determine if recalculation needed

5. **Add is_preferred_vendor field**
   - Type: BooleanField
   - Default: False
   - Purpose: Mark as preferred vendor
   - Used in product sourcing decisions

### Rating Fields Summary

| Field | Type | Required | Purpose |
|-------|------|----------|---------|
| rating | DecimalField(3,2) | Yes | Overall rating (0-5) |
| total_orders | IntegerField | Yes | Order count |
| total_spend | DecimalField(18,2) | Yes | Total spent |
| last_rating_update | DateTimeField | No | Last calculation |
| is_preferred_vendor | BooleanField | Yes | Preferred status |

### Rating Scale
```
5.00 ★★★★★ Excellent
4.00 ★★★★☆ Good
3.00 ★★★☆☆ Average
2.00 ★★☆☆☆ Below Average
1.00 ★☆☆☆☆ Poor
0.00 ☆☆☆☆☆ Not Rated
```

### Rating Calculation Components
- On-time delivery rate: 40%
- Quality score: 30%
- Response time: 15%
- Price competitiveness: 15%

### Total Spend Tracking
```
Currency: LKR
Total: Sum of all completed PO amounts

Example:
PO-001: Rs. 100,000
PO-002: Rs. 250,000
PO-003: Rs. 150,000
Total: Rs. 500,000
```

### Preferred Vendor Logic
Automatic preferred vendor when:
- Rating ≥ 4.5 stars
- Total orders ≥ 10
- On-time delivery rate ≥ 95%
- Quality score ≥ 98%

Or manually set by management

### Denormalization Strategy
These fields are denormalized:
- Updated via Celery task (nightly)
- Updated on PO completion
- Improves query performance
- Reduces join complexity

### Expected Outcome
- Vendor performance tracking
- Quick rating access
- Business volume metrics
- Preferred vendor identification

### Verification Checklist
- [ ] rating field with proper precision
- [ ] total_orders field added
- [ ] total_spend with adequate precision
- [ ] last_rating_update field added
- [ ] is_preferred_vendor field added
- [ ] All defaults set appropriately

---

## Notes for AI Agents

### Field Organization
Group related fields:
1. Core identification (Tasks 05-06)
2. Address (Task 07)
3. Contact (Task 08)
4. Payment terms (Task 09)
5. Lead time (Task 10)
6. Notes/tags (Task 11)
7. Rating/metrics (Task 12)

### Required Fields Summary
**Must provide:**
- company_name
- vendor_type

**Should provide:**
- primary_email or primary_phone
- address_line_1
- city, province

**Auto-generated:**
- vendor_code
- rating (defaults to 0)
- total_orders (defaults to 0)
- total_spend (defaults to 0)

### Tags Best Practices
- Use lowercase
- Hyphen-separated for multi-word
- Keep concise
- Standardize common tags
- Regular cleanup of unused tags

### Internal Notes Security
- Never expose via public API
- Restrict to managers/admin
- Log access for auditing
- Encrypt if containing sensitive data

### Performance Considerations
- Index primary_email for search
- Don't index notes/internal_notes
- tags field searchable via JSON operators
- rating indexed for sorting

### Multi-Currency Handling
- Store currency code on vendor
- Convert to base currency for total_spend
- Consider exchange rate fluctuations
- Separate report for multi-currency analysis
