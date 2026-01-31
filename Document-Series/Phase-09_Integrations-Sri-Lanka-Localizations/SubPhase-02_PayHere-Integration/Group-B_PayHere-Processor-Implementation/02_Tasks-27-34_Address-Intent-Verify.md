# Tasks 27-34: Address, Intent Builder, and Verification

> **Phase:** 09 - Integrations & Sri Lanka Localizations  
> **SubPhase:** 02 - PayHere Integration  
> **Group:** B - PayHere Processor Implementation  
> **Document:** 02 of 02  
> **Tasks Covered:** 27, 28, 29, 30, 31, 32, 33, 34

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-17-26_Processor-Hash-Builders.md](01_Tasks-17-26_Processor-Hash-Builders.md)

---

## Document Overview

This document covers the completion of the PayHereProcessor implementation with address formatting, phone number formatting for Sri Lanka (+94), email validation, delivery and custom fields, payment intent construction, redirect URL building, and comprehensive verification of the processor implementation.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 27 | Create Address Builder | Medium | 25 min |
| 28 | Create Phone Formatter | Low | 20 min |
| 29 | Create Email Validator | Low | 15 min |
| 30 | Create Delivery Fields | Low | 15 min |
| 31 | Create Custom Fields | Low | 15 min |
| 32 | Create Payment Intent Builder | Medium | 30 min |
| 33 | Create Redirect URL Builder | Medium | 25 min |
| 34 | Verify Processor Implementation | Low | 20 min |

---

## Task 27: Create Address Builder

### Overview
Create a function to build address data for PayHere payment forms. Billing address information is required by PayHere and must be properly formatted with separate fields for address line, city, and country. The address builder extracts and formats this information from order or customer objects.

### Dependencies
- Task 26: Create Customer Data Builder

### Instructions

1. **Open builders module**
   - Navigate to `backend/apps/payments/processors/payhere/builders.py`
   - Add address builder function

2. **Create address builder function**
   - Define function `build_address_data()`
   - Accept order or address object parameter
   - Return dictionary with address fields
   - Include: address, city, country

3. **Extract address components**
   - Get billing address from order
   - Extract address line 1 (and optionally line 2)
   - Extract city from address
   - Extract country from address

4. **Combine address lines**
   - If multiple address lines exist, combine them
   - Separate with comma and space
   - Example: "123 Main St, Apt 4B"
   - Keep within PayHere's character limit (255)

5. **Set default country**
   - Default to "Sri Lanka" if not specified
   - PayHere is primarily for Sri Lankan merchants
   - Use full country name, not code

6. **Validate required fields**
   - Ensure address is not empty
   - Ensure city is not empty
   - Country defaults to "Sri Lanka"

7. **Handle special characters**
   - Remove or replace unsafe characters
   - Keep alphanumeric, spaces, commas, periods
   - Ensure safe for HTML forms

8. **Create address validation function**
   - Define function `validate_address_data()`
   - Check required fields present
   - Verify field lengths
   - Raise errors for missing data

### Address Building Flow

```
Order Object
        │
        ▼
Extract Billing Address
        │
        billing_address = order.billing_address
        │
        ▼
Extract Components
        │
        ├─── address_line1: "123 Main Street"
        ├─── address_line2: "Apt 4B" (optional)
        ├─── city: "Colombo"
        └─── country: "Sri Lanka"
        │
        ▼
Combine Address Lines
        │
        address = "123 Main Street, Apt 4B"
        │
        ▼
Validate Fields
        │
        ├─── Address not empty
        ├─── City not empty
        └─── Country defaults to "Sri Lanka"
        │
        ▼
Return Address Dict
        │
        {
            "address": "123 Main Street, Apt 4B",
            "city": "Colombo",
            "country": "Sri Lanka"
        }
```

### Address Data Fields

| Field | PayHere Field | Required | Max Length | Default |
|-------|---------------|----------|------------|---------|
| address | address | Yes | 255 | Raise error |
| city | city | Yes | 50 | Raise error |
| country | country | Yes | 50 | "Sri Lanka" |

### Address Field Mapping

| Source | Destination | Transformation |
|--------|-------------|----------------|
| address.line1 + line2 | address | Combine with ", " |
| address.city | city | Direct mapping |
| address.country | country | Full name, default "Sri Lanka" |

### Address Combination Examples

| Line 1 | Line 2 | Combined Address |
|--------|--------|------------------|
| "123 Main St" | "Apt 4B" | "123 Main St, Apt 4B" |
| "456 Galle Road" | "" | "456 Galle Road" |
| "789 Kandy St" | "Floor 2" | "789 Kandy St, Floor 2" |

### Sri Lankan Cities (Common)

| City | District | Province |
|------|----------|----------|
| Colombo | Colombo | Western |
| Kandy | Kandy | Central |
| Galle | Galle | Southern |
| Jaffna | Jaffna | Northern |
| Negombo | Gampaha | Western |

### Country Format

| Format | PayHere Accepts | Example |
|--------|-----------------|---------|
| Full Name | ✓ Yes (Preferred) | "Sri Lanka" |
| ISO Code | ✗ No | "LK" |
| Local Name | ? Maybe | "ශ්‍රී ලංකා" |

### Function Signature

```
Function: build_address_data()
Parameters:
    - order: Order (order object with billing address)
    - use_shipping: bool = False (use shipping address instead)
Returns:
    - dict (address data for PayHere)
Example:
    build_address_data(order)
    → {
        "address": "123 Main Street, Apt 4B",
        "city": "Colombo",
        "country": "Sri Lanka"
      }
```

### Validation Function Signature

```
Function: validate_address_data(address_data: dict) -> None
Validates:
    - address is not empty
    - city is not empty
    - country is not empty
    - Field lengths within limits
Raises:
    - PayHereValidationError if invalid
```

### Address Validation Rules

| Field | Rule | Error Message |
|-------|------|---------------|
| address | Not empty, <= 255 chars | "Address is required" |
| city | Not empty, <= 50 chars | "City is required" |
| country | Not empty, <= 50 chars | "Country is required" |

### Special Character Handling

| Character | Action | Reason |
|-----------|--------|--------|
| Newlines (\n) | Replace with ", " | Address on one line |
| Tabs (\t) | Replace with space | Normalize whitespace |
| Multiple spaces | Collapse to single | Clean formatting |
| HTML entities | Remove/escape | Security |

### Expected Outcome
- Address builder function implemented
- Combines multiple address lines
- Defaults country to "Sri Lanka"
- Validates required fields
- Returns structured dictionary for PayHere

### Verification Checklist
- [ ] `build_address_data()` function created in builders.py
- [ ] Extracts address from order billing address
- [ ] Combines address line 1 and line 2 if both exist
- [ ] Extracts city from address object
- [ ] Sets country to "Sri Lanka" as default
- [ ] `validate_address_data()` function created
- [ ] Validates address not empty
- [ ] Validates city not empty
- [ ] Handles missing address gracefully (error)
- [ ] Test with complete address data
- [ ] Test with single address line
- [ ] Test with multiple address lines
- [ ] Test with missing city (should error)

---

## Task 28: Create Phone Formatter

### Overview
Create a function to format phone numbers to Sri Lankan format (+94) required by PayHere. Sri Lankan phone numbers must be formatted without the leading zero and with the country code 94 (without + symbol in the API). This ensures consistent phone number format for payment processing.

### Dependencies
- Task 26: Create Customer Data Builder

### Instructions

1. **Open builders module**
   - Navigate to `backend/apps/payments/processors/payhere/builders.py`
   - Add phone formatter function

2. **Create phone formatter function**
   - Define function `format_phone_for_payhere()`
   - Accept phone number string parameter
   - Return formatted phone string without + prefix

3. **Clean input phone number**
   - Remove all spaces, dashes, parentheses
   - Remove any non-numeric characters except +
   - Normalize to digits only (keep leading + if present)

4. **Handle +94 prefix**
   - If phone starts with "+94": remove "+" and keep "94"
   - If phone starts with "94": keep as-is
   - If phone starts with "0": replace "0" with "94"
   - If phone has no prefix: add "94" at start

5. **Validate Sri Lankan phone format**
   - Check length is 11 digits (94 + 9 digits)
   - Verify starts with "94"
   - Ensure remaining 9 digits are valid mobile/landline

6. **Remove leading zeros**
   - After country code, phone should not have leading zero
   - Example: "0771234567" → "94771234567" (not "940771234567")

7. **Add phone validation function**
   - Create function `validate_sri_lankan_phone()`
   - Check format: 94XXXXXXXXX (11 digits total)
   - Validate mobile prefixes: 70, 71, 72, 74, 75, 76, 77, 78
   - Return boolean indicating validity

8. **Handle international formats**
   - If phone is international (not Sri Lankan): raise error
   - PayHere expects Sri Lankan numbers only
   - Clear error message for non-LK numbers

### Phone Formatting Flow

```
Input Phone Number
        │
        ├─── "0771234567"
        ├─── "+94771234567"
        ├─── "94771234567"
        ├─── "077 123 4567"
        └─── "(077) 123-4567"
        │
        ▼
Clean Phone Number
        │
        Remove: spaces, dashes, parentheses
        Keep: digits and + sign
        │
        ▼
Normalize to Digits
        │
        Remove + sign: "+94771234567" → "94771234567"
        │
        ▼
Add/Fix Country Code
        │
        ├─── Starts with "0" → Replace with "94"
        ├─── Starts with "94" → Keep as-is
        └─── No prefix → Add "94"
        │
        ▼
Validate Format
        │
        ├─── Length = 11 digits?
        ├─── Starts with "94"?
        └─── Valid mobile prefix?
        │
        ▼
Return Formatted Phone
        │
        "94771234567"
```

### Phone Number Formats

| Input Format | Cleaned | Formatted Output |
|--------------|---------|------------------|
| "0771234567" | "0771234567" | "94771234567" |
| "+94771234567" | "94771234567" | "94771234567" |
| "94771234567" | "94771234567" | "94771234567" |
| "077 123 4567" | "0771234567" | "94771234567" |
| "(077) 123-4567" | "0771234567" | "94771234567" |

### Sri Lankan Mobile Prefixes

| Prefix | Operator | Type |
|--------|----------|------|
| 70 | Mobitel | Mobile |
| 71 | Dialog | Mobile |
| 72 | Hutch/Etisalat | Mobile |
| 74 | Dialog | Mobile |
| 75 | Airtel | Mobile |
| 76 | Dialog | Mobile |
| 77 | Dialog | Mobile |
| 78 | Hutch | Mobile |

### Sri Lankan Landline Prefixes

| Prefix | Region | Type |
|--------|--------|------|
| 11 | Colombo | Landline |
| 81 | Kandy | Landline |
| 91 | Galle | Landline |
| 21 | Jaffna | Landline |
| 31 | Negombo | Landline |

### Phone Validation Rules

| Rule | Check | Valid Example | Invalid Example |
|------|-------|---------------|-----------------|
| Length | 11 digits | "94771234567" | "9477123456" |
| Country Code | Starts with "94" | "94771234567" | "0771234567" |
| Mobile Prefix | 70-78 | "94771234567" | "94991234567" |
| All Digits | Only 0-9 | "94771234567" | "94-77-123456" |

### Function Signature

```
Function: format_phone_for_payhere()
Parameters:
    - phone: str (phone number in various formats)
Returns:
    - str (formatted phone: 94XXXXXXXXX)
Raises:
    - PayHereValidationError if invalid format
Example:
    format_phone_for_payhere("0771234567")
    → "94771234567"
```

### Validation Function Signature

```
Function: validate_sri_lankan_phone(phone: str) -> bool
Parameters:
    - phone: str (formatted phone: 94XXXXXXXXX)
Returns:
    - bool (True if valid Sri Lankan number)
Validates:
    - Starts with "94"
    - Length is 11 digits
    - Valid mobile/landline prefix
```

### Formatting Examples

```
Input: "0771234567"
Step 1: Clean → "0771234567"
Step 2: Remove + → "0771234567"
Step 3: Replace leading 0 → "94771234567"
Output: "94771234567"

Input: "+94 77 123 4567"
Step 1: Clean → "+94771234567"
Step 2: Remove + → "94771234567"
Step 3: Already has 94 → "94771234567"
Output: "94771234567"
```

### Error Handling

| Input | Error | Message |
|-------|-------|---------|
| Empty string | ValueError | "Phone number is required" |
| Non-numeric | ValueError | "Phone must contain only digits" |
| Wrong country | ValueError | "Only Sri Lankan numbers supported" |
| Too short | ValueError | "Invalid phone number length" |
| Too long | ValueError | "Invalid phone number length" |

### Integration with Customer Data

```
Customer Phone: "0771234567"
        │
        ▼
build_customer_data()
        │
        ├─── Extract phone
        │
        ▼
format_phone_for_payhere()
        │
        ├─── Clean and format
        │
        ▼
Output: "94771234567"
        │
        ▼
Include in PayHere form data
```

### Expected Outcome
- Phone formatter function implemented
- Converts to 94XXXXXXXXX format
- Removes leading zero correctly
- Validates Sri Lankan phone numbers
- Rejects non-Sri Lankan numbers

### Verification Checklist
- [ ] `format_phone_for_payhere()` function created in builders.py
- [ ] Removes spaces, dashes, parentheses from input
- [ ] Handles "+94" prefix (removes +)
- [ ] Handles "0" prefix (replaces with "94")
- [ ] Handles "94" prefix (keeps as-is)
- [ ] Output format: 94XXXXXXXXX (no + sign)
- [ ] `validate_sri_lankan_phone()` function created
- [ ] Validates 11-digit length
- [ ] Validates starts with "94"
- [ ] Validates mobile prefix (70-78)
- [ ] Test with "0771234567" → "94771234567"
- [ ] Test with "+94771234567" → "94771234567"
- [ ] Test with "077 123 4567" → "94771234567"
- [ ] Test rejects non-Sri Lankan numbers

---

## Task 29: Create Email Validator

### Overview
Create a robust email validation function to ensure customer email addresses are properly formatted before submission to PayHere. Email is a required field for PayHere payments and is used for transaction notifications. Proper validation prevents payment failures due to invalid email formats.

### Dependencies
- Task 26: Create Customer Data Builder

### Instructions

1. **Open builders module**
   - Navigate to `backend/apps/payments/processors/payhere/builders.py`
   - Add email validator function

2. **Create email validation function**
   - Define function `validate_email()`
   - Accept email string parameter
   - Return boolean or raise error if invalid

3. **Implement basic format check**
   - Check email is not empty or None
   - Verify email contains exactly one @ symbol
   - Ensure @ is not at start or end

4. **Validate email structure**
   - Split email by @ into local and domain parts
   - Validate local part (before @) is not empty
   - Validate domain part (after @) is not empty

5. **Validate domain structure**
   - Check domain contains at least one period (.)
   - Ensure period is not at start or end of domain
   - Verify domain has valid structure (e.g., example.com)

6. **Check for invalid characters**
   - Validate local part contains valid characters
   - Allow: alphanumeric, dots, hyphens, underscores, plus
   - Disallow: spaces, special chars (except allowed ones)

7. **Validate email length**
   - Check total email length <= 100 characters (PayHere limit)
   - Ensure local part <= 64 characters (RFC standard)
   - Ensure domain part <= 255 characters (RFC standard)

8. **Use regex for comprehensive validation**
   - Import re module for regex
   - Use standard email regex pattern
   - Pattern: `^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$`

9. **Create email sanitization function**
   - Define function `sanitize_email()`
   - Strip whitespace from start/end
   - Convert to lowercase
   - Return cleaned email

### Email Validation Flow

```
Input Email
        │
        "john.doe@example.com"
        │
        ▼
Sanitize Email
        │
        ├─── Strip whitespace
        ├─── Convert to lowercase
        │
        ▼
Basic Checks
        │
        ├─── Not empty?
        ├─── Contains @?
        ├─── Single @ symbol?
        │
        ▼
Structure Validation
        │
        ├─── Split by @
        ├─── Local part not empty?
        ├─── Domain part not empty?
        │
        ▼
Domain Validation
        │
        ├─── Contains period?
        ├─── Valid TLD?
        │
        ▼
Character Validation
        │
        ├─── Valid chars in local part?
        ├─── Valid chars in domain?
        │
        ▼
Length Validation
        │
        ├─── Total <= 100?
        ├─── Local <= 64?
        ├─── Domain <= 255?
        │
        ▼
Return Valid/Invalid
```

### Email Validation Rules

| Rule | Check | Valid Example | Invalid Example |
|------|-------|---------------|-----------------|
| Not Empty | len(email) > 0 | "user@example.com" | "" |
| Contains @ | "@" in email | "user@example.com" | "userexample.com" |
| Single @ | email.count("@") == 1 | "user@example.com" | "user@@example.com" |
| Has Domain | Domain not empty | "user@example.com" | "user@" |
| Has TLD | Domain has period | "user@example.com" | "user@example" |
| Valid Chars | Alphanumeric + allowed | "user.name@example.com" | "user name@example.com" |
| Length | <= 100 chars | "user@example.com" | (very long email) |

### Valid Email Examples

| Email | Valid? | Notes |
|-------|--------|-------|
| "user@example.com" | ✓ Yes | Standard format |
| "john.doe@example.com" | ✓ Yes | Dot in local part |
| "user+tag@example.com" | ✓ Yes | Plus addressing |
| "user_name@example.com" | ✓ Yes | Underscore |
| "user-name@example.com" | ✓ Yes | Hyphen |

### Invalid Email Examples

| Email | Valid? | Reason |
|-------|--------|--------|
| "user@" | ✗ No | Missing domain |
| "@example.com" | ✗ No | Missing local part |
| "userexample.com" | ✗ No | Missing @ |
| "user @example.com" | ✗ No | Space in local part |
| "user@example" | ✗ No | Missing TLD |

### Email Regex Pattern

```
Pattern: ^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$

Breakdown:
    ^                     - Start of string
    [a-zA-Z0-9._%+-]+     - Local part (alphanumeric + allowed chars)
    @                     - Literal @ symbol
    [a-zA-Z0-9.-]+        - Domain name
    \.                    - Literal period
    [a-zA-Z]{2,}          - TLD (at least 2 letters)
    $                     - End of string
```

### Function Signatures

```
Function: validate_email()
Parameters:
    - email: str
Returns:
    - bool (True if valid, False if invalid)
    OR raises PayHereValidationError
Example:
    validate_email("user@example.com")
    → True

Function: sanitize_email()
Parameters:
    - email: str
Returns:
    - str (cleaned email)
Example:
    sanitize_email("  User@Example.COM  ")
    → "user@example.com"
```

### Email Length Limits

| Component | RFC Limit | PayHere Limit | Used Limit |
|-----------|-----------|---------------|------------|
| Total | 254 | 100 | 100 |
| Local Part | 64 | - | 64 |
| Domain | 255 | - | 255 |

### Common Email Validation Errors

| Error | Cause | Solution |
|-------|-------|----------|
| Missing @ | User typed without @ | Check for @ symbol |
| Multiple @ | User error | Count @ symbols |
| Space | Copy-paste with space | Strip whitespace |
| Missing TLD | Incomplete email | Validate domain structure |

### Integration with Customer Data

```
Customer Email: "  John.Doe@Example.COM  "
        │
        ▼
sanitize_email()
        │
        ├─── Strip whitespace
        ├─── Lowercase
        │
        ▼
"john.doe@example.com"
        │
        ▼
validate_email()
        │
        ├─── Check format
        ├─── Validate structure
        │
        ▼
Return Validated Email
```

### Expected Outcome
- Email validation function implemented
- Comprehensive format checking
- Regex-based validation for accuracy
- Email sanitization for consistency
- Clear error messages for invalid emails

### Verification Checklist
- [ ] `validate_email()` function created in builders.py
- [ ] Checks email not empty
- [ ] Validates contains single @ symbol
- [ ] Validates local part exists and is valid
- [ ] Validates domain exists and has TLD
- [ ] Uses regex pattern for comprehensive check
- [ ] Validates email length <= 100 characters
- [ ] `sanitize_email()` function created
- [ ] Strips whitespace from email
- [ ] Converts email to lowercase
- [ ] Test with valid emails (should pass)
- [ ] Test with invalid emails (should fail/raise error)
- [ ] Test with edge cases (spaces, multiple @, etc.)

---

## Task 30: Create Delivery Fields

### Overview
Create a function to build delivery/shipping address fields for PayHere payment forms. While PayHere primarily uses billing address, it also accepts delivery address fields for orders with different shipping addresses. This ensures complete order information is submitted to PayHere.

### Dependencies
- Task 27: Create Address Builder

### Instructions

1. **Open builders module**
   - Navigate to `backend/apps/payments/processors/payhere/builders.py`
   - Add delivery fields builder function

2. **Create delivery fields builder**
   - Define function `build_delivery_fields()`
   - Accept order object parameter
   - Return dictionary with delivery fields or None
   - Include: delivery_address, delivery_city, delivery_country

3. **Check for shipping address**
   - Get shipping address from order
   - If no shipping address: return None (use billing)
   - If shipping same as billing: return None
   - Only return if different from billing

4. **Extract delivery components**
   - Extract delivery address (combine line 1 and 2)
   - Extract delivery city
   - Extract delivery country
   - Use same logic as billing address builder

5. **Reuse address building logic**
   - Call `build_address_data()` with shipping address
   - Rename keys to delivery_* format
   - Map: address → delivery_address, city → delivery_city, etc.

6. **Set appropriate defaults**
   - Default delivery_country to "Sri Lanka"
   - Validate delivery fields if present
   - Ensure consistency with billing address format

7. **Create delivery validation function**
   - Define function `validate_delivery_fields()`
   - Check field formats if delivery fields present
   - Validate lengths and required data

### Delivery Fields Building Flow

```
Order Object
        │
        ▼
Check Shipping Address
        │
        ├─── Has shipping address?
        │    │
        │    No → Return None (use billing)
        │    │
        │    Yes
        │    ▼
        │    Same as billing?
        │    │
        │    Yes → Return None
        │    │
        │    No
        │    ▼
        └─── Extract Delivery Address
        │
        ▼
Build Delivery Data
        │
        ├─── Use build_address_data()
        ├─── Rename keys to delivery_*
        │
        ▼
Return Delivery Dict
        │
        {
            "delivery_address": "456 Shipping St",
            "delivery_city": "Kandy",
            "delivery_country": "Sri Lanka"
        }
```

### Delivery Fields Mapping

| PayHere Field | Source | Required | Default |
|---------------|--------|----------|---------|
| delivery_address | shipping_address.lines | No | None (use billing) |
| delivery_city | shipping_address.city | No | None (use billing) |
| delivery_country | shipping_address.country | No | "Sri Lanka" |

### Billing vs Delivery Address

| Scenario | Billing Address | Delivery Address | Action |
|----------|-----------------|------------------|--------|
| Same address | Provided | Not provided | Use billing for both |
| Same address | Provided | Same as billing | Use billing, omit delivery |
| Different | Provided | Different | Provide both |
| Gift order | Buyer's address | Recipient's address | Provide both |

### Function Signature

```
Function: build_delivery_fields()
Parameters:
    - order: Order (order object)
Returns:
    - Optional[dict] (delivery fields or None)
Example:
    build_delivery_fields(order)
    → {
        "delivery_address": "456 Shipping Street",
        "delivery_city": "Kandy",
        "delivery_country": "Sri Lanka"
      }
    OR
    → None (if same as billing)
```

### Key Renaming Logic

```
billing_data = build_address_data(billing_address)
    {
        "address": "123 Main St",
        "city": "Colombo",
        "country": "Sri Lanka"
    }

delivery_data = {
    "delivery_address": billing_data["address"],
    "delivery_city": billing_data["city"],
    "delivery_country": billing_data["country"]
}
```

### Delivery Fields Structure

```
delivery_fields = {
    "delivery_address": str,   # Full delivery address
    "delivery_city": str,      # Delivery city
    "delivery_country": str,   # Delivery country (default: "Sri Lanka")
}
```

### When to Include Delivery Fields

| Condition | Include Delivery? | Reason |
|-----------|-------------------|--------|
| No shipping address | No | Use billing address |
| Shipping == Billing | No | Redundant information |
| Shipping != Billing | Yes | Different delivery location |
| Gift order | Yes | Deliver to recipient |

### Validation for Delivery Fields

| Field | Validation | Error Message |
|-------|------------|---------------|
| delivery_address | <= 255 chars | "Delivery address too long" |
| delivery_city | <= 50 chars | "Delivery city too long" |
| delivery_country | <= 50 chars | "Delivery country too long" |

### Expected Outcome
- Delivery fields builder function implemented
- Reuses address building logic
- Only includes delivery fields when different from billing
- Proper key naming (delivery_* prefix)
- Integration with payment form builder

### Verification Checklist
- [ ] `build_delivery_fields()` function created in builders.py
- [ ] Returns None if no shipping address
- [ ] Returns None if shipping == billing
- [ ] Extracts shipping address when different
- [ ] Uses `build_address_data()` for consistency
- [ ] Renames keys to delivery_address, delivery_city, delivery_country
- [ ] Defaults delivery_country to "Sri Lanka"
- [ ] Test with order having same billing/shipping
- [ ] Test with order having different billing/shipping
- [ ] Test with order having no shipping address

---

## Task 31: Create Custom Fields

### Overview
Create a function to build custom fields for PayHere payment forms. PayHere allows custom fields (custom_1, custom_2) to pass additional data that will be returned in the payment notification. These fields are useful for tracking internal order IDs, tenant IDs, and other metadata.

### Dependencies
- Task 17: Create PayHereProcessor Class

### Instructions

1. **Open builders module**
   - Navigate to `backend/apps/payments/processors/payhere/builders.py`
   - Add custom fields builder function

2. **Create custom fields builder**
   - Define function `build_custom_fields()`
   - Accept order and tenant parameters
   - Return dictionary with custom_1 and custom_2
   - These fields will be echoed back in PayHere notifications

3. **Define custom field usage**
   - custom_1: Internal order ID (from your system)
   - custom_2: Tenant ID (for multi-tenancy)
   - Both fields limited to 100 characters each

4. **Extract order ID**
   - Get internal order ID from order object
   - Store in custom_1 field
   - This allows matching PayHere payment to internal order

5. **Extract tenant ID**
   - Get tenant ID from request or order
   - Store in custom_2 field
   - Essential for multi-tenant systems

6. **Add custom field validation**
   - Ensure each field <= 100 characters
   - Convert values to strings
   - Handle None values (convert to empty string)

7. **Create optional custom field support**
   - Allow passing additional custom data
   - Support custom_1 and custom_2 overrides
   - Document what can be stored in these fields

8. **Add custom field parser**
   - Create function `parse_custom_fields()`
   - Extract custom fields from PayHere response
   - Return as dictionary for easy access

### Custom Fields Building Flow

```
Order + Tenant
        │
        ▼
Extract IDs
        │
        ├─── internal_order_id: order.id (UUID)
        ├─── tenant_id: tenant.id
        │
        ▼
Build Custom Fields
        │
        ├─── custom_1 = str(internal_order_id)
        ├─── custom_2 = str(tenant_id)
        │
        ▼
Validate Lengths
        │
        ├─── custom_1 <= 100 chars
        ├─── custom_2 <= 100 chars
        │
        ▼
Return Custom Dict
        │
        {
            "custom_1": "order-uuid-12345",
            "custom_2": "tenant_123"
        }
```

### Custom Field Usage

| Field | Recommended Use | Example | Max Length |
|-------|-----------------|---------|------------|
| custom_1 | Internal Order ID | "order-uuid-abc123" | 100 chars |
| custom_2 | Tenant ID | "tenant_xyz" | 100 chars |

### Custom Field Limitations

| Limitation | PayHere Behavior |
|------------|------------------|
| Max Length | 100 characters per field |
| Number of Fields | Only 2 custom fields (custom_1, custom_2) |
| Data Type | String only |
| Echo Back | Returned in payment notification |

### Why Custom Fields are Important

| Scenario | Custom Field Use | Benefit |
|----------|------------------|---------|
| Multi-Tenancy | Store tenant_id | Route payment to correct tenant |
| Order Matching | Store internal_order_id | Match PayHere payment to order |
| Tracking | Store campaign_id | Track marketing campaigns |
| Debugging | Store request_id | Trace payment flow |

### Function Signature

```
Function: build_custom_fields()
Parameters:
    - order: Order (order object)
    - tenant_id: str (tenant identifier)
Returns:
    - dict (custom fields)
Example:
    build_custom_fields(order, "tenant_123")
    → {
        "custom_1": "order-abc123",
        "custom_2": "tenant_123"
      }
```

### Parser Function Signature

```
Function: parse_custom_fields()
Parameters:
    - payment_data: dict (PayHere payment notification data)
Returns:
    - dict (extracted custom fields)
Example:
    parse_custom_fields({"custom_1": "order-123", "custom_2": "tenant_1"})
    → {
        "order_id": "order-123",
        "tenant_id": "tenant_1"
      }
```

### Custom Fields Validation

| Validation | Check | Error Message |
|------------|-------|---------------|
| Length | <= 100 chars | "Custom field exceeds 100 characters" |
| Type | String | "Custom field must be string" |
| Not None | Has value | Convert None to "" |

### PayHere Custom Fields Flow

```
Payment Initiation
        │
        ├─── custom_1: "order-123"
        ├─── custom_2: "tenant_xyz"
        │
        ▼
Send to PayHere
        │
        ▼
PayHere Processing
        │
        ▼
Payment Notification (IPN)
        │
        ├─── Includes custom_1: "order-123"
        ├─── Includes custom_2: "tenant_xyz"
        │
        ▼
Match Payment to Order
        │
        ├─── Look up order by custom_1
        ├─── Verify tenant by custom_2
```

### Alternative Custom Field Uses

| Use Case | custom_1 | custom_2 |
|----------|----------|----------|
| Standard | Order ID | Tenant ID |
| Campaign Tracking | Order ID | Campaign ID |
| User Tracking | Order ID | User ID |
| Session Tracking | Order ID | Session ID |

### Expected Outcome
- Custom fields builder function implemented
- Stores internal order ID and tenant ID
- Validates field lengths
- Returns PayHere-compatible dictionary
- Foundation for payment matching

### Verification Checklist
- [ ] `build_custom_fields()` function created in builders.py
- [ ] Extracts internal order ID from order object
- [ ] Extracts tenant ID from parameter
- [ ] Stores order ID in custom_1
- [ ] Stores tenant ID in custom_2
- [ ] Validates each field <= 100 characters
- [ ] Converts values to strings
- [ ] Handles None values (converts to empty string)
- [ ] `parse_custom_fields()` function created (optional)
- [ ] Test with valid order and tenant IDs
- [ ] Test with long order IDs (should validate/truncate)

---

## Task 32: Create Payment Intent Builder

### Overview
Create the payment intent builder that combines all data builders into a complete PayHere payment form data structure. The payment intent includes all required fields (merchant ID, order ID, amount, currency, hash) and optional fields (customer, address, delivery, custom fields) formatted correctly for PayHere's checkout form.

### Dependencies
- All previous tasks (17-31)
- Hash generator, amount formatter, customer builder, address builder, etc.

### Instructions

1. **Open processor module**
   - Navigate to `backend/apps/payments/processors/payhere/processor.py`
   - Locate the `initiate_payment()` method (created in Task 17)
   - Implement the full payment intent building logic

2. **Create payment intent builder function**
   - Define function `build_payment_intent()`
   - Accept order and configuration parameters
   - Return complete payment data dictionary

3. **Build core payment fields**
   - Get merchant_id from configuration
   - Generate order_id using `generate_order_id()`
   - Format amount using `format_amount_for_payhere()`
   - Set currency to "LKR" (validate with `validate_currency()`)

4. **Build customer fields**
   - Call `build_customer_data()` to get customer info
   - Add first_name, last_name, email to payment data
   - Format phone using `format_phone_for_payhere()`
   - Add phone to payment data

5. **Build address fields**
   - Call `build_address_data()` to get billing address
   - Add address, city, country to payment data

6. **Build optional delivery fields**
   - Call `build_delivery_fields()` to get shipping address
   - Only add if different from billing
   - Include delivery_address, delivery_city, delivery_country if present

7. **Build item name**
   - Call `build_item_name()` to get order description
   - Add items field to payment data

8. **Build custom fields**
   - Call `build_custom_fields()` to get tracking data
   - Add custom_1 and custom_2 to payment data

9. **Generate payment hash**
   - Build hash parameters from payment data
   - Call `generate_payhere_hash()` with proper parameters
   - Add hash to payment data

10. **Add callback URLs**
    - Add return_url (success page)
    - Add cancel_url (cancellation page)
    - Add notify_url (webhook endpoint)
    - Get URLs from configuration

11. **Create PaymentIntent object**
    - Create PaymentIntent instance with all data
    - Set gateway to PaymentGateway.PAYHERE
    - Set redirect_url to PayHere checkout
    - Set payment_data to the built dictionary

12. **Validate complete payment data**
    - Verify all required fields present
    - Validate field formats
    - Ensure hash is correct
    - Return validated PaymentIntent

### Payment Intent Building Flow

```
Order + Configuration
        │
        ▼
Core Fields
        │
        ├─── merchant_id (from config)
        ├─── order_id (generate_order_id)
        ├─── amount (format_amount_for_payhere)
        ├─── currency (validate_currency)
        │
        ▼
Customer Fields
        │
        ├─── build_customer_data()
        ├─── first_name, last_name, email
        ├─── phone (format_phone_for_payhere)
        │
        ▼
Address Fields
        │
        ├─── build_address_data()
        ├─── address, city, country
        │
        ▼
Optional Fields
        │
        ├─── build_delivery_fields() (if different)
        ├─── build_item_name()
        ├─── build_custom_fields()
        │
        ▼
Callback URLs
        │
        ├─── return_url (from config)
        ├─── cancel_url (from config)
        ├─── notify_url (from config)
        │
        ▼
Generate Hash
        │
        ├─── generate_payhere_hash()
        ├─── Add hash to payment data
        │
        ▼
Create PaymentIntent
        │
        ├─── gateway: PAYHERE
        ├─── redirect_url: PayHere checkout
        ├─── payment_data: complete dict
        │
        ▼
Return PaymentIntent
```

### Complete Payment Data Structure

```
payment_data = {
    # Core fields (required)
    "merchant_id": "1234567",
    "order_id": "ORD-tenant123-abc456",
    "amount": "1500.00",
    "currency": "LKR",
    "hash": "A1B2C3D4E5F6...",
    
    # Customer fields (required)
    "first_name": "John",
    "last_name": "Doe",
    "email": "john@example.com",
    "phone": "94771234567",
    
    # Address fields (required)
    "address": "123 Main Street",
    "city": "Colombo",
    "country": "Sri Lanka",
    
    # Item field (required)
    "items": "Order #ORD-123 (3 items)",
    
    # Callback URLs (required)
    "return_url": "https://domain.com/checkout/success/",
    "cancel_url": "https://domain.com/checkout/cancel/",
    "notify_url": "https://domain.com/api/webhooks/payhere/",
    
    # Delivery fields (optional)
    "delivery_address": "456 Shipping St",
    "delivery_city": "Kandy",
    "delivery_country": "Sri Lanka",
    
    # Custom fields (optional but recommended)
    "custom_1": "order-uuid-abc123",
    "custom_2": "tenant_xyz"
}
```

### Required vs Optional Fields

| Field | Required | Source | Validator |
|-------|----------|--------|-----------|
| merchant_id | Yes | Configuration | Non-empty |
| order_id | Yes | generate_order_id() | Format check |
| amount | Yes | format_amount_for_payhere() | 2 decimals |
| currency | Yes | "LKR" | validate_currency() |
| hash | Yes | generate_payhere_hash() | 32 chars uppercase |
| first_name | Yes | build_customer_data() | Non-empty |
| last_name | No | build_customer_data() | Optional |
| email | Yes | build_customer_data() | validate_email() |
| phone | Yes | format_phone_for_payhere() | 94XXXXXXXXX |
| address | Yes | build_address_data() | Non-empty |
| city | Yes | build_address_data() | Non-empty |
| country | Yes | build_address_data() | Default: "Sri Lanka" |
| items | Yes | build_item_name() | Non-empty |
| return_url | Yes | Configuration | Valid URL |
| cancel_url | Yes | Configuration | Valid URL |
| notify_url | Yes | Configuration | Valid URL |
| delivery_* | No | build_delivery_fields() | If different |
| custom_1 | No | build_custom_fields() | Tracking |
| custom_2 | No | build_custom_fields() | Tracking |

### PaymentIntent Object Structure

```
PaymentIntent {
    gateway: PaymentGateway.PAYHERE
    redirect_url: "https://sandbox.payhere.lk/pay/checkout"
    payment_data: {
        # All payment fields from above
    }
    transaction_id: "txn-uuid-xyz"
    created_at: datetime
    expires_at: datetime (created_at + 15 minutes)
}
```

### Hash Generation Parameters

```
Hash Parameters (in exact order):
    1. merchant_id
    2. order_id
    3. amount (formatted)
    4. currency
    5. merchant_secret_hash (MD5 uppercase)

Example:
    merchant_id = "1234567"
    order_id = "ORD-123"
    amount = "1500.00"
    currency = "LKR"
    secret_hash = "4C9184F37CFFE..." (MD5 of merchant_secret, uppercase)
    
    Combined: "1234567ORD-1231500.00LKR4C9184F37CFFE..."
    MD5 Hash: "A1B2C3D4E5F6..." (uppercase)
```

### Callback URL Configuration

| URL Type | Purpose | Example |
|----------|---------|---------|
| return_url | Success redirect | "https://domain.com/checkout/success/" |
| cancel_url | Cancel redirect | "https://domain.com/checkout/cancel/" |
| notify_url | Payment notification (IPN) | "https://domain.com/api/webhooks/payhere/" |

### Expected Outcome
- Complete payment intent builder implemented
- Combines all data builders correctly
- Generates proper PayHere hash
- Returns structured PaymentIntent object
- Ready for redirect to PayHere checkout

### Verification Checklist
- [ ] `build_payment_intent()` function created in processor.py
- [ ] Calls all data builder functions
- [ ] Core fields: merchant_id, order_id, amount, currency, hash
- [ ] Customer fields: first_name, last_name, email, phone
- [ ] Address fields: address, city, country
- [ ] Item field: items (from build_item_name)
- [ ] Callback URLs: return_url, cancel_url, notify_url
- [ ] Optional delivery fields added if different
- [ ] Custom fields added for tracking
- [ ] Hash generated with correct parameters
- [ ] Hash is uppercase 32-character MD5
- [ ] PaymentIntent object created and returned
- [ ] All required fields validated before return
- [ ] Test with complete order object

---

## Task 33: Create Redirect URL Builder

### Overview
Create a function to build the redirect URL for PayHere checkout. PayHere uses an HTML form POST redirect to initiate payment, so this function constructs the form data and redirect URL. The redirect URL points to PayHere's checkout endpoint where the customer completes the payment.

### Dependencies
- Task 32: Create Payment Intent Builder

### Instructions

1. **Open processor module**
   - Navigate to `backend/apps/payments/processors/payhere/processor.py`
   - Add redirect URL builder function

2. **Create redirect URL builder**
   - Define function `build_redirect_url()`
   - Accept payment data dictionary
   - Return redirect URL and form method

3. **Determine base URL**
   - Check sandbox mode flag
   - If sandbox: use `SANDBOX_BASE_URL`
   - If production: use `PRODUCTION_BASE_URL`
   - Get from configuration or environment

4. **Append checkout endpoint**
   - Add `CHECKOUT_ENDPOINT` to base URL
   - Example: `https://sandbox.payhere.lk/pay/checkout`
   - Use URL joining to ensure proper format

5. **Prepare form data**
   - Payment data will be submitted as POST form
   - Ensure all values are strings
   - PayHere expects form-encoded data

6. **Set form method**
   - PayHere requires POST method
   - Not GET (data too large, security concern)
   - HTML form will auto-submit with JavaScript

7. **Create form rendering helper (optional)**
   - Create function to render HTML form
   - Include all payment data as hidden fields
   - Add auto-submit JavaScript
   - Useful for direct integration

8. **Add URL validation**
   - Verify redirect URL is valid HTTPS
   - Check environment matches (sandbox vs production)
   - Warn if using sandbox in production

### Redirect URL Building Flow

```
Payment Intent + Configuration
        │
        ▼
Determine Environment
        │
        ├─── Sandbox mode?
        │    │
        │    Yes → SANDBOX_BASE_URL
        │    │
        │    No → PRODUCTION_BASE_URL
        │
        ▼
Build Checkout URL
        │
        base_url + CHECKOUT_ENDPOINT
        │
        Example: "https://sandbox.payhere.lk/pay/checkout"
        │
        ▼
Prepare Form Data
        │
        ├─── Convert all values to strings
        ├─── Ensure proper encoding
        │
        ▼
Return Redirect URL + Form Data
```

### Environment-Based URLs

| Environment | Base URL | Checkout URL |
|-------------|----------|--------------|
| Sandbox | `https://sandbox.payhere.lk` | `https://sandbox.payhere.lk/pay/checkout` |
| Production | `https://www.payhere.lk` | `https://www.payhere.lk/pay/checkout` |

### Form Method

| Method | PayHere Support | Reason |
|--------|-----------------|--------|
| POST | ✓ Yes (Required) | Secure, handles large data |
| GET | ✗ No | URL length limits, security risk |

### HTML Form Structure (for reference)

```html
<form method="POST" action="https://sandbox.payhere.lk/pay/checkout" id="payhere-form">
    <input type="hidden" name="merchant_id" value="1234567" />
    <input type="hidden" name="order_id" value="ORD-123" />
    <input type="hidden" name="amount" value="1500.00" />
    <input type="hidden" name="currency" value="LKR" />
    <input type="hidden" name="hash" value="A1B2C3D4E5F6..." />
    <!-- All other payment fields as hidden inputs -->
</form>

<script>
    // Auto-submit form
    document.getElementById('payhere-form').submit();
</script>
```

### Function Signature

```
Function: build_redirect_url()
Parameters:
    - payment_data: dict (complete payment data)
    - sandbox_mode: bool (use sandbox or production)
Returns:
    - tuple: (redirect_url: str, form_method: str, form_data: dict)
Example:
    build_redirect_url(payment_data, sandbox_mode=True)
    → (
        "https://sandbox.payhere.lk/pay/checkout",
        "POST",
        {payment_data}
      )
```

### Redirect URL Construction

```
Base URL: "https://sandbox.payhere.lk"
Endpoint: "/pay/checkout"
        │
        ▼
Join URL
        │
        ▼
Redirect URL: "https://sandbox.payhere.lk/pay/checkout"
```

### Form Data Preparation

| Field | Value | Type |
|-------|-------|------|
| merchant_id | "1234567" | string |
| order_id | "ORD-123" | string |
| amount | "1500.00" | string |
| All others | ... | string |

### URL Validation Checks

| Check | Purpose | Action if Fails |
|-------|---------|-----------------|
| HTTPS | Security | Raise error |
| Valid domain | Correct PayHere URL | Raise error |
| Environment match | Sandbox vs production | Warn or raise error |

### Integration with Payment Flow

```
Initiate Payment
        │
        ▼
build_payment_intent()
        │
        ├─── Build all payment data
        ├─── Generate hash
        │
        ▼
build_redirect_url()
        │
        ├─── Determine environment
        ├─── Build checkout URL
        │
        ▼
Create HTML Form
        │
        ├─── Add all payment fields
        ├─── Auto-submit JavaScript
        │
        ▼
Redirect Customer to PayHere
        │
        ▼
Customer Completes Payment on PayHere
```

### Expected Outcome
- Redirect URL builder function implemented
- Correctly determines sandbox vs production URL
- Returns checkout URL and POST method
- Form data prepared for submission
- Ready for customer redirect

### Verification Checklist
- [ ] `build_redirect_url()` function created in processor.py
- [ ] Determines environment (sandbox vs production)
- [ ] Uses correct base URL (SANDBOX_BASE_URL or PRODUCTION_BASE_URL)
- [ ] Appends CHECKOUT_ENDPOINT correctly
- [ ] Returns tuple: (url, method, form_data)
- [ ] Method is "POST"
- [ ] URL is valid HTTPS
- [ ] Test in sandbox mode (should use sandbox URL)
- [ ] Test in production mode (should use production URL)
- [ ] Form data includes all payment fields

---

## Task 34: Verify Processor Implementation

### Overview
Perform comprehensive verification of the complete PayHereProcessor implementation. This task ensures all components work together correctly, validates data flows, tests hash generation, and confirms the processor is ready for integration testing with PayHere sandbox.

### Dependencies
- All previous tasks (17-33)

### Instructions

1. **Create verification test suite**
   - Create test file for PayHereProcessor
   - Set up test fixtures (sample orders, customers, config)
   - Use sandbox credentials for testing

2. **Test processor initialization**
   - Verify PayHereProcessor instantiates correctly
   - Check configuration is loaded properly
   - Validate sandbox mode detection works

3. **Test processor registration**
   - Verify processor is registered with factory
   - Test factory can retrieve PayHereProcessor by gateway type
   - Confirm gateway_type attribute is correct

4. **Test hash generation**
   - Create test cases with known merchant credentials
   - Generate hash with test parameters
   - Verify hash matches expected value (from PayHere docs)
   - Test uppercase conversion

5. **Test data builders**
   - Test amount formatting (various amounts)
   - Test currency validation (LKR valid, others invalid)
   - Test order ID generation (uniqueness)
   - Test item name building (single and multi-item)
   - Test customer data building (complete and partial data)

6. **Test address formatting**
   - Test billing address building
   - Test delivery address building (same and different)
   - Test address validation

7. **Test phone formatting**
   - Test with various phone formats (0-prefixed, +94, etc.)
   - Verify output is always 94XXXXXXXXX format
   - Test validation of Sri Lankan numbers

8. **Test email validation**
   - Test with valid emails (should pass)
   - Test with invalid emails (should fail)
   - Test email sanitization

9. **Test custom fields**
   - Verify custom_1 and custom_2 are populated
   - Test with tenant ID and order ID
   - Validate field lengths

10. **Test payment intent building**
    - Create complete order with all fields
    - Build payment intent
    - Verify all required fields present
    - Validate hash is correct
    - Check optional fields (delivery, custom)

11. **Test redirect URL building**
    - Test sandbox URL construction
    - Test production URL construction
    - Verify POST method is returned
    - Validate form data structure

12. **Test error handling**
    - Test with missing required fields
    - Test with invalid email format
    - Test with non-LKR currency
    - Test with invalid phone format
    - Verify appropriate errors are raised

13. **Test end-to-end flow**
    - Create order → Build intent → Build redirect
    - Verify complete payment data structure
    - Validate all fields are correct
    - Check hash is valid

14. **Manual verification with PayHere**
    - Use sandbox credentials
    - Build payment intent for test order
    - Submit to PayHere sandbox checkout
    - Verify payment form displays correctly
    - Complete test payment
    - Verify hash is accepted by PayHere

### Verification Test Structure

```
Test Suite: PayHereProcessor
│
├── Test Initialization
│   ├── test_processor_instantiation
│   ├── test_configuration_loading
│   └── test_sandbox_detection
│
├── Test Registration
│   ├── test_factory_registration
│   └── test_gateway_type_attribute
│
├── Test Hash Generation
│   ├── test_hash_with_known_values
│   ├── test_hash_uppercase
│   └── test_hash_verification
│
├── Test Data Builders
│   ├── test_amount_formatting
│   ├── test_currency_validation
│   ├── test_order_id_generation
│   ├── test_item_name_building
│   └── test_customer_data_building
│
├── Test Address Formatting
│   ├── test_billing_address
│   ├── test_delivery_address
│   └── test_address_validation
│
├── Test Phone Formatting
│   ├── test_phone_with_zero_prefix
│   ├── test_phone_with_plus94
│   └── test_phone_validation
│
├── Test Email Validation
│   ├── test_valid_emails
│   ├── test_invalid_emails
│   └── test_email_sanitization
│
├── Test Custom Fields
│   ├── test_custom_fields_population
│   └── test_custom_fields_validation
│
├── Test Payment Intent
│   ├── test_complete_intent_building
│   ├── test_required_fields_present
│   └── test_hash_correctness
│
├── Test Redirect URL
│   ├── test_sandbox_url
│   ├── test_production_url
│   └── test_form_data_structure
│
├── Test Error Handling
│   ├── test_missing_required_fields
│   ├── test_invalid_formats
│   └── test_error_messages
│
└── Test End-to-End
    ├── test_complete_payment_flow
    └── test_payhere_submission
```

### Test Data Setup

```python
# Sample test configuration
test_config = {
    'merchant_id': '1234567',
    'merchant_secret': 'test_secret_key',
    'sandbox': True,
    'return_url': 'https://test.com/success/',
    'cancel_url': 'https://test.com/cancel/',
    'notify_url': 'https://test.com/webhook/',
}

# Sample test order
test_order = {
    'id': 'order-uuid-123',
    'total': Decimal('1500.00'),
    'currency': 'LKR',
    'customer': {
        'first_name': 'John',
        'last_name': 'Doe',
        'email': 'john@example.com',
        'phone': '0771234567'
    },
    'billing_address': {
        'line1': '123 Main Street',
        'city': 'Colombo',
        'country': 'Sri Lanka'
    }
}
```

### Hash Verification Test

```
Test Hash Generation:
    merchant_id = "1234567"
    order_id = "ORD-TEST-001"
    amount = "1500.00"
    currency = "LKR"
    merchant_secret = "test_secret"
    
    Expected Hash Process:
        1. Hash secret: MD5("test_secret").upper()
           → "098F6BCD4621D373CADE4E832627B4F6"
        
        2. Combine: "1234567ORD-TEST-0011500.00LKR098F6BCD4621D373CADE4E832627B4F6"
        
        3. Hash combined: MD5(combined).upper()
           → (calculate expected hash)
    
    Verify: generated hash == expected hash
```

### Required Field Validation

| Field | Check | Test |
|-------|-------|------|
| merchant_id | Present | Raise error if missing |
| order_id | Format correct | Test with valid/invalid IDs |
| amount | 2 decimals | Test with various amounts |
| currency | Is "LKR" | Test with USD (should fail) |
| hash | 32 chars uppercase | Verify length and case |
| email | Valid format | Test with invalid emails |
| phone | 94XXXXXXXXX | Test with various formats |

### Error Testing Scenarios

| Scenario | Expected Error | Error Message |
|----------|----------------|---------------|
| Missing email | PayHereValidationError | "Customer email is required" |
| Invalid currency | PayHereCurrencyError | "Only LKR currency supported" |
| Invalid phone | PayHereValidationError | "Invalid phone number format" |
| Missing merchant_id | PayHereConfigError | "Merchant ID not configured" |

### Manual PayHere Sandbox Test Checklist

- [ ] Build payment intent with test order
- [ ] Print payment data (verify all fields)
- [ ] Open PayHere sandbox in browser
- [ ] Submit payment form (POST to checkout URL)
- [ ] Verify payment page displays correctly
- [ ] Check amount shows correctly
- [ ] Check customer name displays
- [ ] Check order description displays
- [ ] Use test card: 4916217501611292
- [ ] Complete test payment
- [ ] Verify payment success
- [ ] Check webhook received (if implemented)

### Integration Test Flow

```
1. Create Test Order
        │
        ▼
2. Initialize PayHereProcessor
        │
        ▼
3. Build Payment Intent
        │
        ├─── Verify all fields present
        ├─── Print payment data
        │
        ▼
4. Build Redirect URL
        │
        ├─── Verify URL is sandbox
        │
        ▼
5. Generate HTML Form (optional)
        │
        ├─── Include all payment fields
        │
        ▼
6. Submit to PayHere Sandbox
        │
        ▼
7. Complete Test Payment
        │
        ▼
8. Verify Payment Success
```

### Expected Outcome
- Complete processor implementation verified
- All data builders tested and working
- Hash generation validated
- End-to-end payment flow confirmed
- Processor ready for integration

### Verification Checklist
- [ ] Test suite created for PayHereProcessor
- [ ] All unit tests passing (data builders, formatters)
- [ ] Hash generation test with known values passing
- [ ] Payment intent building test passing
- [ ] Redirect URL building test passing
- [ ] Error handling tests passing
- [ ] End-to-end test passing
- [ ] Manual PayHere sandbox test successful
- [ ] Payment form displays correctly on PayHere
- [ ] Test payment completes successfully
- [ ] All required fields validated
- [ ] All optional fields working correctly
- [ ] Documentation updated with test results
- [ ] Processor ready for Group C (payment initialization)

---

## Summary

This document completed the PayHereProcessor implementation with address formatting, phone number formatting for Sri Lankan numbers, email validation, delivery and custom fields, payment intent building, redirect URL construction, and comprehensive verification. The processor is now fully functional and ready for payment initialization.

### Completed Tasks
1. ✓ Created address builder with billing address support
2. ✓ Created phone formatter for +94 Sri Lankan format
3. ✓ Created email validator with comprehensive checks
4. ✓ Created delivery fields builder for shipping addresses
5. ✓ Created custom fields builder for tracking data
6. ✓ Created payment intent builder combining all components
7. ✓ Created redirect URL builder for PayHere checkout
8. ✓ Verified complete processor implementation

### Implementation Summary

| Component | Status | Purpose |
|-----------|--------|---------|
| Address Builder | ✓ Complete | Billing/delivery address formatting |
| Phone Formatter | ✓ Complete | +94 format conversion |
| Email Validator | ✓ Complete | Email format validation |
| Delivery Fields | ✓ Complete | Shipping address support |
| Custom Fields | ✓ Complete | Tracking data (order/tenant IDs) |
| Payment Intent Builder | ✓ Complete | Complete payment data assembly |
| Redirect URL Builder | ✓ Complete | PayHere checkout URL |
| Verification | ✓ Complete | Testing and validation |

### Final File Structure

```
backend/apps/payments/processors/payhere/
├── __init__.py
├── constants.py (from Group A)
├── config.py (from Group A)
├── processor.py (Tasks 17-18, 32-33)
├── hash.py (Tasks 19-21)
└── builders.py (Tasks 22-31)
```

### PayHere Integration Ready

The PayHereProcessor is now fully implemented with:
- ✓ Proper class structure extending PaymentProcessor ABC
- ✓ Factory registration for automatic discovery
- ✓ Secure MD5 hash generation (uppercase)
- ✓ All data formatters (amount, phone, email, address)
- ✓ Complete payment intent building
- ✓ Redirect URL construction
- ✓ Comprehensive validation
- ✓ Error handling
- ✓ Tested with PayHere sandbox

### Next Steps
Proceed to Group C (Payment Initialization) to implement the actual payment initiation API endpoint, handle customer checkout flow, process payment redirects, and integrate with the webstore checkout process.

---

**Document Status:** Complete  
**Tasks Covered:** 27-34  
**Next Group:** [Group-C_Payment-Initialization](../Group-C_Payment-Initialization/)
