# Tasks 17-26: Processor, Hash Generation, and Data Builders

> **Phase:** 09 - Integrations & Sri Lanka Localizations  
> **SubPhase:** 02 - PayHere Integration  
> **Group:** B - PayHere Processor Implementation  
> **Document:** 01 of 02  
> **Tasks Covered:** 17, 18, 19, 20, 21, 22, 23, 24, 25, 26

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-27-34_Address-Intent-Verify.md](02_Tasks-27-34_Address-Intent-Verify.md)

---

## Document Overview

Implement PayHereProcessor class with MD5 hash generation and data builder utilities for amounts, currencies, order IDs, items, and customer information.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 17 | Create PayHereProcessor Class | High | 45 min |
| 18 | Create Processor Registration | Low | 10 min |
| 19 | Create Hash Generator | Medium | 30 min |
| 20 | Create Hash Parameters | Low | 15 min |
| 21 | Create Uppercase MD5 | Low | 10 min |
| 22 | Create Amount Formatter | Low | 15 min |
| 23 | Create Currency Validator | Low | 10 min |
| 24 | Create Order ID Generator | Low | 15 min |
| 25 | Create Item Name Builder | Low | 10 min |
| 26 | Create Customer Data Builder | Medium | 25 min |

---

## Task 17: Create PayHereProcessor Class

### Overview
Create the main PayHereProcessor class that extends the PaymentProcessor abstract base class. This processor implements all required abstract methods for PayHere payment gateway integration, handling payment initialization, verification, refunds, and status checks. The processor serves as the primary interface for PayHere payment operations within the payment infrastructure.

### Dependencies
- Task 16: Verify PayHere Configuration (from Group A)
- PaymentProcessor ABC exists (from SubPhase-01)
- PayHere configuration is complete

### Instructions

1. **Create processor module**
   - Navigate to `backend/apps/payments/processors/payhere/` directory
   - Create new file named `processor.py`
   - This will contain the PayHereProcessor class

2. **Import required dependencies**
   - Import PaymentProcessor abstract base class
   - Import PaymentGateway enum from core
   - Import PayHere constants from constants module
   - Import necessary typing hints and exceptions

3. **Define PayHereProcessor class**
   - Create class that extends PaymentProcessor
   - Set class-level attribute `gateway_type = PaymentGateway.PAYHERE`
   - This identifies the processor to the factory

4. **Implement initialization method**
   - Create `__init__` method accepting configuration
   - Store PayHere-specific settings (merchant_id, merchant_secret)
   - Initialize sandbox mode flag
   - Set base URL based on sandbox/production mode

5. **Create abstract method stubs**
   - Implement `initiate_payment()` method (returns payment intent)
   - Implement `verify_payment()` method (checks payment status)
   - Implement `process_refund()` method (handles refunds)
   - Implement `get_payment_status()` method (queries status)
   - Leave detailed implementation for later tasks

6. **Add helper method placeholders**
   - Create `_get_base_url()` method for URL determination
   - Create `_build_payment_data()` method for data formatting
   - Create `_generate_hash()` method stub (implemented in Task 19)
   - These will be implemented in subsequent tasks

7. **Add configuration validation**
   - Create `validate_config()` method
   - Check that merchant_id is present
   - Check that merchant_secret is present
   - Verify currency support (LKR only)

8. **Implement error handling structure**
   - Define custom exceptions for PayHere errors
   - Add try-except blocks in abstract method implementations
   - Ensure proper error messages for debugging

### PayHereProcessor Class Structure

```
┌──────────────────────────────────────┐
│      PayHereProcessor                │
├──────────────────────────────────────┤
│ Attributes:                          │
│  - gateway_type: PAYHERE             │
│  - merchant_id: str                  │
│  - merchant_secret: str              │
│  - sandbox_mode: bool                │
│  - base_url: str                     │
├──────────────────────────────────────┤
│ Abstract Methods (Implemented):      │
│  - initiate_payment()                │
│  - verify_payment()                  │
│  - process_refund()                  │
│  - get_payment_status()              │
├──────────────────────────────────────┤
│ Helper Methods:                      │
│  - _get_base_url()                   │
│  - _build_payment_data()             │
│  - _generate_hash()                  │
│  - validate_config()                 │
└──────────────────────────────────────┘
```

### Processor Inheritance Hierarchy

```
PaymentProcessor (ABC)
        │
        ├─── Abstract Methods
        │    ├── initiate_payment()
        │    ├── verify_payment()
        │    ├── process_refund()
        │    └── get_payment_status()
        │
        ▼
PayHereProcessor
        │
        ├─── Implements All Abstract Methods
        ├─── Adds PayHere-Specific Logic
        └─── Handles PayHere API Communication
```

### Configuration Initialization

| Setting | Source | Required |
|---------|--------|----------|
| merchant_id | Config or Settings | Yes |
| merchant_secret | Config or Settings | Yes |
| sandbox_mode | Config or DEBUG flag | No (default: True) |
| base_url | Auto-determined | Yes (internal) |

### Abstract Methods Implementation Strategy

| Method | Purpose | Returns |
|--------|---------|---------|
| `initiate_payment(order, amount)` | Create payment intent | PaymentIntent object |
| `verify_payment(payment_id, data)` | Verify payment completion | PaymentStatus object |
| `process_refund(payment_id, amount)` | Process refund request | RefundResult object |
| `get_payment_status(payment_id)` | Query payment status | PaymentStatus object |

### PaymentIntent Structure (Returned by initiate_payment)

| Field | Type | Description |
|-------|------|-------------|
| gateway | str | 'PAYHERE' |
| redirect_url | str | PayHere checkout URL |
| payment_data | dict | Form data for redirect |
| transaction_id | str | Internal tracking ID |
| expires_at | datetime | Intent expiration time |

### PaymentStatus Structure (Returned by verify_payment)

| Field | Type | Description |
|-------|------|-------------|
| status | str | SUCCESS/PENDING/FAILED |
| payment_id | str | PayHere payment ID |
| transaction_id | str | Internal transaction ID |
| amount | Decimal | Payment amount |
| currency | str | 'LKR' |
| verified | bool | Hash verification result |

### Error Handling Structure

```
PayHereProcessor Methods
        │
        ├─── Try Block
        │    └── Core Payment Logic
        │
        ├─── Except PayHereAPIError
        │    └── API communication failures
        │
        ├─── Except PayHereValidationError
        │    └── Data validation failures
        │
        └─── Except Exception
             └── Unexpected errors
```

### Expected Outcome
- PayHereProcessor class created extending PaymentProcessor ABC
- All abstract methods implemented (stubs initially)
- Configuration validation in place
- Error handling structure defined
- Foundation for payment operations established

### Verification Checklist
- [ ] `processor.py` file created in payhere directory
- [ ] PayHereProcessor class extends PaymentProcessor
- [ ] `gateway_type` attribute set to PaymentGateway.PAYHERE
- [ ] `__init__` method accepts and stores configuration
- [ ] All abstract methods implemented (even as stubs)
- [ ] `validate_config()` method checks required settings
- [ ] Helper method placeholders created
- [ ] Error handling structure in place
- [ ] Import statements correct and complete

---

## Task 18: Create Processor Registration

### Overview
Register the PayHereProcessor with the ProcessorFactory to enable automatic processor instantiation based on gateway type. The factory pattern allows the payment system to dynamically select and instantiate the appropriate payment processor without tight coupling, making the system extensible for future payment gateways.

### Dependencies
- Task 17: Create PayHereProcessor Class
- ProcessorFactory exists (from SubPhase-01)

### Instructions

1. **Locate processor factory**
   - Navigate to `backend/apps/payments/processors/factory.py`
   - This is the central processor registry
   - Review existing processor registrations for consistency

2. **Import PayHereProcessor**
   - Add import statement for PayHereProcessor class
   - Use absolute import path
   - Follow existing import conventions in factory

3. **Register processor with factory**
   - Use `ProcessorFactory.register()` method
   - Pass `PaymentGateway.PAYHERE` as the gateway key
   - Pass `PayHereProcessor` class (not instance) as value
   - This creates the mapping for factory lookup

4. **Update processor initialization map**
   - Ensure PayHere configuration is passed during instantiation
   - Map configuration loader for PayHere-specific settings
   - Handle tenant-specific configuration if applicable

5. **Update payhere package init**
   - Open `backend/apps/payments/processors/payhere/__init__.py`
   - Import PayHereProcessor class
   - Export in `__all__` list for clean imports
   - This makes the processor accessible from package level

6. **Add processor discovery**
   - Ensure the processor is discovered during app initialization
   - Add to payment app's ready() method if needed
   - Verify auto-registration works correctly

### Processor Registration Flow

```
Application Startup
        │
        ▼
Payment App Ready Signal
        │
        ▼
Discover Processors
        │
        ├─── Import PayHereProcessor
        ├─── Import StripeProcessor
        └─── Import Other Processors
        │
        ▼
ProcessorFactory.register()
        │
        ├─── Register(PAYHERE, PayHereProcessor)
        ├─── Register(STRIPE, StripeProcessor)
        └─── Register(OTHER, OtherProcessor)
        │
        ▼
Factory Ready for Use
```

### Factory Registration Pattern

| Gateway Type | Processor Class | Registration Key |
|--------------|-----------------|------------------|
| PAYHERE | PayHereProcessor | PaymentGateway.PAYHERE |
| STRIPE | StripeProcessor | PaymentGateway.STRIPE |
| BANK_TRANSFER | BankTransferProcessor | PaymentGateway.BANK_TRANSFER |

### ProcessorFactory.register() Method

| Parameter | Type | Description |
|-----------|------|-------------|
| gateway_type | PaymentGateway enum | Gateway identifier |
| processor_class | Type[PaymentProcessor] | Processor class (not instance) |

### Usage After Registration

```
Runtime Usage Flow:
        │
        ▼
Need Payment Processor
        │
        ▼
Call ProcessorFactory.get_processor(PaymentGateway.PAYHERE)
        │
        ▼
Factory Looks Up PayHereProcessor Class
        │
        ▼
Factory Instantiates PayHereProcessor
        │
        ├─── Load Configuration
        ├─── Pass to __init__
        └─── Return Instance
        │
        ▼
Use Processor Instance
```

### Package __init__.py Structure

```
backend/apps/payments/processors/payhere/__init__.py:
├── from .processor import PayHereProcessor
├── from .constants import *
└── __all__ = ['PayHereProcessor', ...]
```

### Registration Location Options

| Location | When to Use |
|----------|-------------|
| `factory.py` module-level | Simple static registration |
| App `ready()` method | Dynamic discovery of processors |
| Package `__init__.py` | Self-registering processors |

### Expected Outcome
- PayHereProcessor registered with ProcessorFactory
- Factory can instantiate PayHereProcessor by gateway type
- Clean import structure in payhere package
- Processor discoverable by payment system

### Verification Checklist
- [ ] PayHereProcessor imported in factory.py
- [ ] `ProcessorFactory.register()` called with PAYHERE key
- [ ] PayHereProcessor class (not instance) passed to factory
- [ ] payhere/__init__.py exports PayHereProcessor
- [ ] Factory can retrieve processor: `get_processor(PAYHERE)`
- [ ] Configuration properly passed during instantiation
- [ ] Registration tested in development environment

---

## Task 19: Create Hash Generator

### Overview
Create the MD5 hash generator for PayHere payment verification. PayHere requires an MD5 hash of specific payment parameters in a precise order to verify the authenticity and integrity of payment data. This hash is critical for security, preventing tampering with payment amounts or order details during the checkout process.

### Dependencies
- Task 17: Create PayHereProcessor Class
- Python hashlib library (standard library)

### Instructions

1. **Create hash module**
   - Navigate to `backend/apps/payments/processors/payhere/` directory
   - Create new file named `hash.py`
   - This module contains hash generation utilities

2. **Import required libraries**
   - Import `hashlib` for MD5 hashing
   - Import typing hints for function signatures
   - Import Decimal for amount handling

3. **Create hash generation function**
   - Define function `generate_payhere_hash()`
   - Accept parameters: merchant_id, order_id, amount, currency, merchant_secret
   - Return uppercase MD5 hash string

4. **Format amount for hashing**
   - Convert amount to string with 2 decimal places
   - Remove any thousands separators
   - Ensure consistent decimal format (e.g., "1234.56")

5. **Build hash string**
   - Concatenate parameters in exact order required by PayHere
   - First hash the merchant_secret with MD5
   - Combine: merchant_id + order_id + amount + currency + hashed_secret
   - No separators between parameters

6. **Generate MD5 hash**
   - Create MD5 hash object using hashlib
   - Update hash with UTF-8 encoded string
   - Get hexadecimal digest

7. **Convert to uppercase**
   - PayHere requires uppercase hash
   - Convert hex digest to uppercase using `.upper()`
   - Return the uppercase hash string

8. **Add hash verification function**
   - Create function `verify_payhere_hash()`
   - Accept received hash and payment data
   - Regenerate hash and compare
   - Return boolean indicating match

### MD5 Hash Generation Process

```
Step 1: Hash Merchant Secret
        │
        merchant_secret → MD5 → uppercase hex
        │
        "abc123secret" → "4C9184F37CFFE..."
        │
        ▼
Step 2: Build Hash String
        │
        merchant_id + order_id + amount + currency + hashed_secret
        │
        "1234567" + "ORD-001" + "1500.00" + "LKR" + "4C9184F37CFFE..."
        │
        ▼
Step 3: Generate Final Hash
        │
        Combined String → MD5 → uppercase hex
        │
        "1234567ORD-0011500.00LKR4C9184F..." → MD5 → uppercase
        │
        ▼
Step 4: Return Hash
        │
        "A1B2C3D4E5F6..." (32-character uppercase hex)
```

### Hash Parameter Order (Critical!)

| Position | Parameter | Example | Notes |
|----------|-----------|---------|-------|
| 1 | merchant_id | "1234567" | From configuration |
| 2 | order_id | "ORD-001" | Unique order identifier |
| 3 | amount | "1500.00" | Formatted to 2 decimals |
| 4 | currency | "LKR" | Always "LKR" for PayHere |
| 5 | merchant_secret_hash | "4C9184F37CFFE..." | MD5 of merchant_secret (uppercase) |

### Amount Formatting Rules

| Input | Formatted Output | Explanation |
|-------|------------------|-------------|
| 1500 | "1500.00" | Add two decimal places |
| 1500.5 | "1500.50" | Pad to two decimals |
| 1500.567 | "1500.57" | Round to two decimals |
| 1,500.00 | "1500.00" | Remove thousands separator |

### Hash Function Signature

```
Function: generate_payhere_hash()
Parameters:
    - merchant_id: str
    - order_id: str
    - amount: Decimal or float
    - currency: str (typically "LKR")
    - merchant_secret: str
Returns:
    - str (32-character uppercase MD5 hash)
```

### Verification Function Signature

```
Function: verify_payhere_hash()
Parameters:
    - received_hash: str (hash received from PayHere)
    - merchant_id: str
    - order_id: str
    - amount: Decimal or float
    - currency: str
    - merchant_secret: str
Returns:
    - bool (True if hashes match, False otherwise)
```

### Hash Security Considerations

| Consideration | Implementation |
|---------------|----------------|
| Secret Protection | Never log merchant_secret or hash in plain text |
| Hash Comparison | Use constant-time comparison to prevent timing attacks |
| Parameter Validation | Validate all parameters before hashing |
| Error Handling | Handle encoding errors gracefully |

### Common Hash Generation Errors

| Error | Cause | Solution |
|-------|-------|----------|
| Hash Mismatch | Wrong parameter order | Follow exact order: merchant_id, order_id, amount, currency, secret |
| Hash Mismatch | Lowercase hash | Convert to uppercase using `.upper()` |
| Hash Mismatch | Amount formatting | Format to exactly 2 decimal places |
| Hash Mismatch | Extra spaces | Remove whitespace from all parameters |

### Expected Outcome
- MD5 hash generation function implemented correctly
- Proper parameter order maintained (critical for PayHere)
- Uppercase conversion applied
- Hash verification function available
- Foundation for secure payment processing

### Verification Checklist
- [ ] `hash.py` file created in payhere directory
- [ ] `generate_payhere_hash()` function implemented
- [ ] Merchant secret hashed first with MD5 and uppercased
- [ ] Parameters concatenated in exact order (merchant_id, order_id, amount, currency, hashed_secret)
- [ ] Final hash converted to uppercase
- [ ] `verify_payhere_hash()` function implemented
- [ ] Amount formatted to 2 decimal places before hashing
- [ ] No separators between concatenated parameters
- [ ] Test with known merchant credentials (sandbox)

---

## Task 20: Create Hash Parameters

### Overview
Define and document the hash parameter structure and ordering for PayHere hash generation. Proper parameter handling ensures consistent hash generation across all payment operations. This task creates a structured approach to managing hash parameters, including validation, formatting, and ordering.

### Dependencies
- Task 19: Create Hash Generator

### Instructions

1. **Create hash parameters data class**
   - In `hash.py`, define a dataclass or named tuple
   - Name it `PayHereHashParams`
   - Include fields: merchant_id, order_id, amount, currency, merchant_secret

2. **Add parameter validation**
   - Create validation method for each parameter
   - Check merchant_id is non-empty string
   - Verify order_id follows expected format
   - Validate amount is positive decimal
   - Ensure currency is "LKR"
   - Confirm merchant_secret is present

3. **Create parameter builder function**
   - Define function `build_hash_params()`
   - Accept order object and configuration
   - Extract required values from order
   - Return PayHereHashParams instance

4. **Add parameter formatting methods**
   - Create method to format amount (2 decimal places)
   - Create method to clean order_id (remove special chars if needed)
   - Ensure consistent string encoding (UTF-8)

5. **Document parameter requirements**
   - Add docstrings explaining each parameter
   - Note the exact order requirement
   - Include examples of valid values

6. **Create parameter extraction helpers**
   - Add helper to extract merchant_id from config
   - Add helper to extract order_id from order object
   - Add helper to get formatted amount from order

### PayHereHashParams Data Structure

```
@dataclass
PayHereHashParams:
    ├── merchant_id: str
    ├── order_id: str
    ├── amount: str (formatted to 2 decimals)
    ├── currency: str (always "LKR")
    └── merchant_secret: str
```

### Parameter Requirements

| Parameter | Type | Format | Example | Validation |
|-----------|------|--------|---------|------------|
| merchant_id | str | Numeric string | "1234567" | Non-empty, alphanumeric |
| order_id | str | Alphanumeric with dashes | "ORD-001" | Max 50 chars |
| amount | str | Decimal with 2 places | "1500.00" | Positive, 2 decimals |
| currency | str | ISO code | "LKR" | Must be "LKR" |
| merchant_secret | str | Secret key | "abc123xyz" | Non-empty |

### Parameter Extraction Flow

```
Order Object + Configuration
        │
        ▼
build_hash_params()
        │
        ├─── Extract merchant_id from config
        ├─── Extract order_id from order
        ├─── Extract amount from order
        ├─── Set currency to "LKR"
        └─── Extract merchant_secret from config
        │
        ▼
Validate Each Parameter
        │
        ├─── Check merchant_id not empty
        ├─── Validate order_id format
        ├─── Verify amount > 0
        ├─── Confirm currency = "LKR"
        └─── Check merchant_secret present
        │
        ▼
Format Parameters
        │
        ├─── Format amount to 2 decimals
        ├─── Clean order_id if needed
        └─── Encode strings as UTF-8
        │
        ▼
Return PayHereHashParams
```

### Parameter Validation Rules

| Parameter | Validation Rule | Error Message |
|-----------|-----------------|---------------|
| merchant_id | Not empty | "Merchant ID is required" |
| order_id | Not empty, max 50 chars | "Invalid order ID format" |
| amount | > 0, decimal | "Amount must be positive" |
| currency | Exactly "LKR" | "Only LKR currency supported" |
| merchant_secret | Not empty | "Merchant secret is required" |

### Usage in Hash Generation

```
# Build parameters from order
params = build_hash_params(order, config)

# Use in hash generation
hash_value = generate_payhere_hash(
    merchant_id=params.merchant_id,
    order_id=params.order_id,
    amount=params.amount,
    currency=params.currency,
    merchant_secret=params.merchant_secret
)
```

### Expected Outcome
- Structured parameter handling for hash generation
- Clear parameter requirements documented
- Validation ensures data integrity
- Easy extraction from order objects
- Foundation for consistent hash generation

### Verification Checklist
- [ ] `PayHereHashParams` dataclass or named tuple created
- [ ] All five required parameters included
- [ ] Parameter validation methods implemented
- [ ] `build_hash_params()` function created
- [ ] Amount formatting to 2 decimals enforced
- [ ] Currency validation ensures "LKR" only
- [ ] Parameter extraction from order object works
- [ ] Docstrings explain each parameter requirement
- [ ] Test with sample order data

---

## Task 21: Create Uppercase MD5

### Overview
Implement the uppercase conversion for MD5 hash output to meet PayHere's specific requirement. PayHere expects hash values in uppercase hexadecimal format, and any lowercase characters will cause hash verification to fail. This task ensures all hash outputs are properly formatted.

### Dependencies
- Task 19: Create Hash Generator

### Instructions

1. **Locate hash generation function**
   - Open `backend/apps/payments/processors/payhere/hash.py`
   - Find the `generate_payhere_hash()` function
   - Review current hash generation logic

2. **Ensure MD5 output is uppercase**
   - After generating MD5 hexdigest
   - Apply `.upper()` method to convert to uppercase
   - Verify this happens for both secret hash and final hash

3. **Update merchant secret hashing**
   - In the first step where merchant_secret is hashed
   - Ensure the hex digest is converted to uppercase
   - This uppercase hash is used in the final hash string

4. **Update final hash generation**
   - After generating the final MD5 hash
   - Convert the hexdigest to uppercase
   - Return the uppercase string

5. **Add uppercase verification function**
   - Create helper function `ensure_uppercase_hash()`
   - Accept hash string parameter
   - Verify all characters are uppercase hex (0-9, A-F)
   - Raise error if lowercase characters found

6. **Update hash verification function**
   - In `verify_payhere_hash()` function
   - Convert both hashes to uppercase before comparison
   - This handles cases where received hash might be lowercase

### Uppercase Hash Conversion Flow

```
Generate MD5 Hash
        │
        hash_object = hashlib.md5(data.encode('utf-8'))
        │
        ▼
Get Hexadecimal Digest
        │
        hex_digest = hash_object.hexdigest()
        │
        Result: "a1b2c3d4e5f6..." (lowercase)
        │
        ▼
Convert to Uppercase
        │
        uppercase_hash = hex_digest.upper()
        │
        Result: "A1B2C3D4E5F6..." (uppercase)
        │
        ▼
Return Uppercase Hash
```

### Hash Format Requirements

| Format | PayHere Accepts | Example |
|--------|-----------------|---------|
| Uppercase | ✓ Yes (Required) | `A1B2C3D4E5F6...` |
| Lowercase | ✗ No (Rejected) | `a1b2c3d4e5f6...` |
| Mixed Case | ✗ No (Rejected) | `A1b2C3d4E5f6...` |

### Implementation Points

| Location | Action | Result |
|----------|--------|--------|
| Merchant Secret Hash | MD5 → uppercase | Used in hash string |
| Final Hash | MD5 → uppercase | Sent to PayHere |
| Hash Verification | Both → uppercase | Safe comparison |

### Uppercase Validation

```
Function: ensure_uppercase_hash(hash_value: str) -> bool

Validates:
    - Length is 32 characters
    - All characters in [0-9A-F]
    - No lowercase characters
    
Raises:
    - ValueError if hash is invalid
```

### Hash Comparison Logic

```
Verify Hash:
        │
        ▼
Received Hash from PayHere
        │
        ├─── Convert to uppercase
        │
        ▼
Regenerate Hash
        │
        ├─── Generate with same parameters
        ├─── Ensure uppercase output
        │
        ▼
Compare Both Hashes
        │
        ├─── Both are uppercase
        ├─── Use constant-time comparison
        │
        ▼
Return True/False
```

### Common Uppercase Issues

| Issue | Cause | Solution |
|-------|-------|----------|
| Hash Mismatch | Forgot to uppercase | Add `.upper()` after `.hexdigest()` |
| Verification Fails | Comparing different cases | Uppercase both before comparing |
| Invalid Hash | Wrong characters | Validate hash format |

### Expected Outcome
- All MD5 hashes converted to uppercase
- Merchant secret hash uppercase
- Final payment hash uppercase
- Hash verification handles case conversion
- PayHere hash requirements met

### Verification Checklist
- [ ] Merchant secret MD5 hash converted to uppercase
- [ ] Final payment hash converted to uppercase
- [ ] `ensure_uppercase_hash()` validation function created
- [ ] Hash verification converts both hashes to uppercase
- [ ] Test with known hash values (sandbox credentials)
- [ ] All hash outputs contain only [0-9A-F] characters
- [ ] No lowercase characters in any generated hash
- [ ] Hash length is 32 characters (MD5 standard)

---

## Task 22: Create Amount Formatter

### Overview
Create a utility function to format payment amounts according to PayHere's requirements. Amounts must be formatted to exactly two decimal places without thousands separators or currency symbols. Consistent amount formatting is critical for hash generation and API communication.

### Dependencies
- Task 17: Create PayHereProcessor Class
- Python Decimal library

### Instructions

1. **Create builders module**
   - Navigate to `backend/apps/payments/processors/payhere/` directory
   - Create new file named `builders.py`
   - This module will contain data formatting utilities

2. **Import required libraries**
   - Import Decimal from decimal module for precise arithmetic
   - Import typing hints for function signatures

3. **Create amount formatting function**
   - Define function `format_amount_for_payhere()`
   - Accept amount parameter (Decimal, float, or int)
   - Return string formatted to 2 decimal places

4. **Convert input to Decimal**
   - Handle various input types (int, float, string, Decimal)
   - Convert to Decimal for precision
   - Use Decimal.quantize() for exact decimal places

5. **Format to 2 decimal places**
   - Use Decimal quantize with "0.01" to get 2 decimals
   - Set rounding mode to ROUND_HALF_UP (standard rounding)
   - Convert result to string

6. **Remove thousands separators**
   - Ensure no commas in output (e.g., not "1,500.00")
   - Simply convert Decimal to string (no formatting)
   - PayHere expects plain decimal number

7. **Validate formatted output**
   - Verify output matches pattern: digits + "." + two digits
   - Example: "1500.00", "99.99", "0.50"
   - Add validation function if needed

8. **Add edge case handling**
   - Handle zero amounts (return "0.00")
   - Handle very small amounts (< 0.01)
   - Handle very large amounts (ensure no scientific notation)
   - Raise error for negative amounts

### Amount Formatting Process

```
Input Amount
        │
        ├─── int: 1500
        ├─── float: 1500.5
        ├─── str: "1500.50"
        └─── Decimal: Decimal("1500.50")
        │
        ▼
Convert to Decimal
        │
        amount = Decimal(str(input_amount))
        │
        ▼
Quantize to 2 Decimals
        │
        formatted = amount.quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)
        │
        ▼
Convert to String
        │
        result = str(formatted)
        │
        ▼
Output: "1500.00"
```

### Formatting Examples

| Input | Type | Output | Explanation |
|-------|------|--------|-------------|
| 1500 | int | "1500.00" | Add decimal places |
| 1500.5 | float | "1500.50" | Pad to 2 decimals |
| 1500.567 | float | "1500.57" | Round to 2 decimals |
| "1500" | str | "1500.00" | Parse and format |
| 0.5 | float | "0.50" | Pad single decimal |
| 0 | int | "0.00" | Zero with decimals |

### Edge Cases

| Case | Input | Output | Handling |
|------|-------|--------|----------|
| Zero | 0 | "0.00" | Return formatted zero |
| Small | 0.001 | "0.00" | Round down |
| Large | 9999999.99 | "9999999.99" | No scientific notation |
| Negative | -100 | Error | Raise ValueError |
| None | None | Error | Raise TypeError |

### Rounding Behavior

| Input | Rounded Output | Rule |
|-------|----------------|------|
| 1.234 | "1.23" | Round down |
| 1.235 | "1.24" | Round up (half up) |
| 1.236 | "1.24" | Round up |
| 1.995 | "2.00" | Round up |

### Function Signature

```
Function: format_amount_for_payhere()
Parameters:
    - amount: Union[int, float, str, Decimal]
    - strict: bool = True (raise error on negative amounts)
Returns:
    - str (formatted amount with 2 decimals)
Raises:
    - ValueError: If amount is negative (when strict=True)
    - TypeError: If amount is not a valid numeric type
```

### Validation Patterns

| Pattern | Valid Examples | Invalid Examples |
|---------|----------------|------------------|
| Correct Format | "1500.00", "99.99", "0.50" | "1500", "1500.0", "1,500.00" |
| No Separators | "1500.00" | "1,500.00" |
| Exactly 2 Decimals | "1500.00" | "1500.0", "1500.000" |

### Integration with Hash Generation

```
Order Amount: 1500.567

        ▼

format_amount_for_payhere(1500.567)

        ▼

Output: "1500.57"

        ▼

Used in hash generation:
merchant_id + order_id + "1500.57" + currency + secret_hash
```

### Expected Outcome
- Amount formatting function implemented
- Outputs exactly 2 decimal places
- No thousands separators
- Proper rounding (half up)
- Negative amount validation
- Foundation for payment data building

### Verification Checklist
- [ ] `builders.py` file created in payhere directory
- [ ] `format_amount_for_payhere()` function implemented
- [ ] Accepts int, float, str, Decimal inputs
- [ ] Converts to Decimal for precision
- [ ] Quantizes to exactly 2 decimal places
- [ ] Uses ROUND_HALF_UP rounding mode
- [ ] Returns string (not Decimal)
- [ ] No thousands separators in output
- [ ] Validates and rejects negative amounts
- [ ] Test with various input types and values

---

## Task 23: Create Currency Validator

### Overview
Create a currency validation function to ensure only LKR (Sri Lankan Rupee) is accepted for PayHere transactions. PayHere only supports LKR currency for Sri Lankan merchants, and any other currency must be rejected early in the payment process to prevent API errors.

### Dependencies
- Task 17: Create PayHereProcessor Class

### Instructions

1. **Open builders module**
   - Navigate to `backend/apps/payments/processors/payhere/builders.py`
   - Add currency validation function below amount formatter

2. **Define supported currency constant**
   - In constants.py, ensure `CURRENCY_LKR = "LKR"` is defined
   - Import this constant into builders.py

3. **Create currency validation function**
   - Define function `validate_currency()`
   - Accept currency parameter (string)
   - Raise exception if not "LKR"

4. **Implement case-insensitive check**
   - Convert input currency to uppercase
   - Compare against "LKR"
   - Handle None or empty string inputs

5. **Add descriptive error messages**
   - Raise PayHereCurrencyError with clear message
   - Include: "PayHere only supports LKR currency"
   - Mention the received currency in error message

6. **Create currency normalizer function**
   - Define function `normalize_currency()`
   - Convert to uppercase
   - Strip whitespace
   - Return normalized currency string

7. **Add currency display helper**
   - Create function `get_currency_symbol()`
   - Return "Rs" or "LKR" symbol
   - Useful for UI display

### Currency Validation Flow

```
Input Currency
        │
        ├─── "LKR"
        ├─── "lkr"
        ├─── " LKR "
        ├─── "USD" (invalid)
        └─── None (invalid)
        │
        ▼
Normalize Currency
        │
        ├─── Convert to uppercase
        ├─── Strip whitespace
        │
        ▼
Validate Against "LKR"
        │
        ├─── If "LKR" → Valid ✓
        └─── If not "LKR" → Raise Error ✗
```

### Supported vs Unsupported Currencies

| Currency | Code | PayHere Support | Action |
|----------|------|-----------------|--------|
| Sri Lankan Rupee | LKR | ✓ Supported | Accept |
| US Dollar | USD | ✗ Not Supported | Reject |
| Euro | EUR | ✗ Not Supported | Reject |
| Indian Rupee | INR | ✗ Not Supported | Reject |
| British Pound | GBP | ✗ Not Supported | Reject |

### Validation Cases

| Input | Normalized | Valid? | Result |
|-------|------------|--------|--------|
| "LKR" | "LKR" | ✓ Yes | Accept |
| "lkr" | "LKR" | ✓ Yes | Accept |
| " LKR " | "LKR" | ✓ Yes | Accept |
| "USD" | "USD" | ✗ No | Raise Error |
| None | N/A | ✗ No | Raise Error |
| "" | "" | ✗ No | Raise Error |

### Function Signatures

```
Function: validate_currency(currency: str) -> None
    Validates that currency is "LKR"
    Raises PayHereCurrencyError if not
    
Function: normalize_currency(currency: str) -> str
    Converts to uppercase and strips whitespace
    Returns normalized currency code
    
Function: get_currency_symbol() -> str
    Returns "Rs" for display purposes
```

### Error Messages

| Scenario | Error Message |
|----------|---------------|
| Wrong currency | "PayHere only supports LKR currency. Received: {currency}" |
| None currency | "Currency is required for PayHere payments" |
| Empty currency | "Currency cannot be empty for PayHere payments" |

### Integration with Payment Processing

```
Process Payment Request
        │
        ▼
Extract Currency from Order
        │
        currency = order.currency
        │
        ▼
Validate Currency
        │
        validate_currency(currency)
        │
        ├─── If LKR → Continue
        └─── If not → Raise Error (stop processing)
        │
        ▼
Proceed with Payment
```

### PayHere Currency Requirements

| Requirement | Description |
|-------------|-------------|
| Only LKR | No multi-currency support |
| Uppercase | "LKR" (all caps) |
| ISO 4217 | Standard currency code |
| No Symbol | Don't use "Rs" in API calls |

### Expected Outcome
- Currency validation function implemented
- Only LKR currency accepted
- Clear error messages for unsupported currencies
- Case-insensitive validation
- Foundation for payment data validation

### Verification Checklist
- [ ] `validate_currency()` function created in builders.py
- [ ] Accepts only "LKR" currency (case-insensitive)
- [ ] Raises PayHereCurrencyError for non-LKR currencies
- [ ] Error message includes received currency value
- [ ] Handles None and empty string inputs
- [ ] `normalize_currency()` helper function created
- [ ] Case-insensitive comparison implemented
- [ ] Test with various currency codes (LKR, USD, EUR, etc.)
- [ ] Currency constant imported from constants.py

---

## Task 24: Create Order ID Generator

### Overview
Create a function to generate unique order IDs for PayHere transactions. Order IDs must be unique across all tenants and must be recognizable for tracking purposes. A well-structured order ID includes tenant identification and ensures no collisions in the payment system.

### Dependencies
- Task 17: Create PayHereProcessor Class
- UUID library (standard library)

### Instructions

1. **Open builders module**
   - Navigate to `backend/apps/payments/processors/payhere/builders.py`
   - Add order ID generation function

2. **Import required libraries**
   - Import uuid for unique ID generation
   - Import datetime for timestamp (if using timestamp format)

3. **Create order ID generation function**
   - Define function `generate_order_id()`
   - Accept tenant parameter (for multi-tenancy)
   - Accept order object or ID (optional)
   - Return unique string order ID

4. **Define order ID format**
   - Pattern: `ORD-{tenant_id}-{uuid}`
   - Example: `ORD-tenant123-a1b2c3d4`
   - Keep it under 50 characters for PayHere compatibility

5. **Generate unique component**
   - Use uuid.uuid4() for guaranteed uniqueness
   - Take first 8 characters of UUID for brevity
   - Or use full UUID if length not a concern

6. **Include tenant identifier**
   - Extract tenant ID from request or order
   - Include in order ID for tracking
   - Format: use lowercase alphanumeric

7. **Add order ID validation function**
   - Create function `validate_order_id()`
   - Check format matches pattern
   - Verify length is within limits
   - Ensure no special characters except dash

8. **Handle order ID regeneration**
   - Create function to extract UUID from order ID
   - Useful for idempotency checks
   - Parse order ID components

### Order ID Generation Flow

```
Generate Order ID Request
        │
        ├─── Tenant: "tenant_123"
        ├─── Order: Order object (optional)
        │
        ▼
Extract Components
        │
        ├─── Tenant ID: "tenant123"
        ├─── UUID: uuid.uuid4().hex[:8]
        │
        ▼
Format Order ID
        │
        pattern = f"ORD-{tenant_id}-{uuid_part}"
        │
        ▼
Return Order ID
        │
        Example: "ORD-tenant123-a1b2c3d4"
```

### Order ID Format Options

| Format | Pattern | Example | Length |
|--------|---------|---------|--------|
| With UUID | `ORD-{tenant}-{uuid8}` | `ORD-ten1-a1b2c3d4` | ~25 chars |
| With Timestamp | `ORD-{tenant}-{timestamp}` | `ORD-ten1-20260131-001` | ~30 chars |
| Simple Counter | `ORD-{tenant}-{counter}` | `ORD-ten1-000001` | ~20 chars |

### Order ID Components

| Component | Description | Example | Required |
|-----------|-------------|---------|----------|
| Prefix | Identifies as order | "ORD" | Yes |
| Tenant ID | Multi-tenant identifier | "tenant123" | Yes |
| Unique ID | UUID or timestamp | "a1b2c3d4" | Yes |
| Separator | Dash separator | "-" | Yes |

### Order ID Requirements

| Requirement | Description | Example |
|-------------|-------------|---------|
| Uniqueness | Must be unique across all orders | No duplicates |
| Length | Max 50 characters (PayHere limit) | Under 50 chars |
| Characters | Alphanumeric and dash only | A-Z, a-z, 0-9, - |
| Readability | Human-readable format | ORD-ten1-a1b2 |

### UUID Handling

```
Generate UUID:
    uuid.uuid4()
    → UUID('12345678-1234-5678-1234-567812345678')
    
Convert to Hex:
    uuid.uuid4().hex
    → '12345678123456781234567812345678'
    
Take First 8 Characters:
    uuid.uuid4().hex[:8]
    → '12345678'
```

### Function Signature

```
Function: generate_order_id()
Parameters:
    - tenant_id: str (tenant identifier)
    - order: Optional[Order] (order object, if available)
    - prefix: str = "ORD" (customizable prefix)
Returns:
    - str (unique order ID)
Example:
    generate_order_id("tenant_123")
    → "ORD-tenant123-a1b2c3d4"
```

### Validation Function Signature

```
Function: validate_order_id(order_id: str) -> bool
Validates:
    - Starts with "ORD-"
    - Contains alphanumeric and dashes only
    - Length <= 50 characters
    - Has at least 3 parts (prefix, tenant, unique)
Returns:
    - bool (True if valid, False otherwise)
```

### Order ID Parsing

```
Order ID: "ORD-tenant123-a1b2c3d4"
        │
        ▼
Split by Dash
        │
        ├─── Part 0: "ORD" (prefix)
        ├─── Part 1: "tenant123" (tenant)
        └─── Part 2: "a1b2c3d4" (unique ID)
        │
        ▼
Extract Components
        │
        ├─── prefix = "ORD"
        ├─── tenant_id = "tenant123"
        └─── unique_id = "a1b2c3d4"
```

### Expected Outcome
- Order ID generation function implemented
- Unique IDs for every order
- Tenant identification included
- Format consistent and readable
- Validation function for order IDs

### Verification Checklist
- [ ] `generate_order_id()` function created in builders.py
- [ ] UUID generation for uniqueness
- [ ] Tenant ID included in order ID
- [ ] Format: `ORD-{tenant}-{uuid}`
- [ ] Order ID length under 50 characters
- [ ] Only alphanumeric and dash characters
- [ ] `validate_order_id()` function created
- [ ] Test generates unique IDs every time
- [ ] Test with different tenant IDs
- [ ] Order ID parsing function implemented (optional)

---

## Task 25: Create Item Name Builder

### Overview
Create a function to build the item name field for PayHere payment forms. The item name provides a description of what the customer is purchasing and appears in PayHere's checkout interface. For multi-item orders, create a concise summary that fits within PayHere's field limits.

### Dependencies
- Task 17: Create PayHereProcessor Class

### Instructions

1. **Open builders module**
   - Navigate to `backend/apps/payments/processors/payhere/builders.py`
   - Add item name builder function

2. **Create item name builder function**
   - Define function `build_item_name()`
   - Accept order object parameter
   - Return string suitable for PayHere item name field
   - Keep within 255 character limit

3. **Implement simple order format**
   - For single-item orders: use product name
   - For multi-item orders: create summary
   - Format: "Order #{order_id}" or "{product_name}"

4. **Handle multi-item orders**
   - If multiple items: use generic description
   - Option 1: "Order #{order_id}"
   - Option 2: "Purchase from {store_name}"
   - Option 3: "{item_count} items"

5. **Add item count for clarity**
   - Include item count in description
   - Example: "Order #123 (3 items)"
   - Helps customer identify the purchase

6. **Truncate long names**
   - Limit to 255 characters (PayHere max)
   - Truncate with ellipsis if needed
   - Example: "Very long product name tha..."

7. **Add special character handling**
   - Remove or replace special characters
   - Keep only alphanumeric, spaces, dashes, parentheses
   - Ensure safe for HTML forms

8. **Create detailed item name function (optional)**
   - For single items: include product name and quantity
   - Example: "Widget Pro x 2"
   - Only if within character limit

### Item Name Building Logic

```
Order Object
        │
        ▼
Check Item Count
        │
        ├─── Single Item?
        │    │
        │    ▼
        │    Use Product Name
        │    "Wireless Headphones"
        │
        └─── Multiple Items?
             │
             ▼
             Build Summary
             "Order #ORD-123 (3 items)"
        │
        ▼
Validate Length
        │
        ├─── If <= 255 chars → Return as-is
        └─── If > 255 chars → Truncate with "..."
        │
        ▼
Return Item Name
```

### Item Name Formats

| Scenario | Format | Example |
|----------|--------|---------|
| Single item | Product name | "Wireless Headphones" |
| Multiple items | Order with count | "Order #ORD-123 (3 items)" |
| With quantity | Product with qty | "Widget Pro x 2" |
| Generic | Store purchase | "Purchase from MyStore" |
| Fallback | Simple order | "Order #ORD-123" |

### Character Limits

| Limit | Value | Action if Exceeded |
|-------|-------|-------------------|
| PayHere Max | 255 characters | Truncate with ellipsis |
| Recommended | 100 characters | Better UX |
| Minimum | 10 characters | Add generic text |

### Special Character Handling

| Character | Action | Reason |
|-----------|--------|--------|
| Quotes (") | Remove or replace | HTML form safety |
| Angle brackets (<>) | Remove | XSS prevention |
| Ampersand (&) | Replace with "and" | HTML entity issues |
| Emoji | Remove | May not render properly |

### Function Signature

```
Function: build_item_name()
Parameters:
    - order: Order (order object with items)
    - max_length: int = 255 (character limit)
    - include_count: bool = True (include item count)
Returns:
    - str (item name for PayHere)
Example:
    build_item_name(order)
    → "Order #ORD-123 (3 items)"
```

### Item Name Examples

| Order Type | Item Name | Character Count |
|------------|-----------|-----------------|
| 1 item | "Wireless Headphones" | 19 |
| 3 items | "Order #ORD-123 (3 items)" | 24 |
| Gift card | "Gift Card - Rs 5000" | 20 |
| Subscription | "Premium Membership - Monthly" | 28 |
| Long name | "Very long product name tha..." | 30 (truncated) |

### Truncation Logic

```
Item Name: "This is a very long product name that exceeds the maximum limit"

        ▼

Check Length: 65 characters

        ▼

Exceeds Max (255)? No, but let's say max_length=30

        ▼

Truncate to 27 characters

        ▼

Add Ellipsis: "This is a very long prod..."

        ▼

Final Length: 30 characters
```

### Expected Outcome
- Item name builder function implemented
- Handles single and multi-item orders
- Respects 255 character limit
- Safe special character handling
- Clear, customer-friendly descriptions

### Verification Checklist
- [ ] `build_item_name()` function created in builders.py
- [ ] Handles single-item orders (uses product name)
- [ ] Handles multi-item orders (uses order summary)
- [ ] Includes item count for multi-item orders
- [ ] Truncates to 255 characters if exceeded
- [ ] Removes or replaces unsafe special characters
- [ ] Returns non-empty string always
- [ ] Test with various order types
- [ ] Test with long product names
- [ ] Test with special characters in product names

---

## Task 26: Create Customer Data Builder

### Overview
Create a function to build customer data fields required for PayHere payment forms. Customer information including first name, last name, email, and phone number must be formatted correctly and validated before submission to PayHere. This ensures proper communication and payment processing.

### Dependencies
- Task 17: Create PayHereProcessor Class

### Instructions

1. **Open builders module**
   - Navigate to `backend/apps/payments/processors/payhere/builders.py`
   - Add customer data builder function

2. **Create customer data builder function**
   - Define function `build_customer_data()`
   - Accept order or customer object parameter
   - Return dictionary with customer fields
   - Include: first_name, last_name, email, phone

3. **Extract customer information**
   - Get customer from order object
   - Extract first_name from customer.first_name
   - Extract last_name from customer.last_name
   - Extract email from customer.email
   - Extract phone from customer.phone

4. **Handle missing names**
   - If no first_name: use "Customer" as default
   - If no last_name: use "" (empty string)
   - PayHere requires first_name, last_name is optional

5. **Validate email format**
   - Check email is not empty
   - Validate email format (basic regex check)
   - Ensure email contains @ and domain

6. **Validate phone number**
   - Check phone is not empty
   - Remove spaces and special characters
   - Prepare for +94 formatting (Task 28)

7. **Create customer data structure**
   - Return dictionary with keys matching PayHere fields
   - Keys: first_name, last_name, email, phone
   - Values: validated and formatted strings

8. **Add customer data validation function**
   - Create function `validate_customer_data()`
   - Check all required fields present
   - Validate formats
   - Raise errors for invalid data

### Customer Data Building Flow

```
Order Object
        │
        ▼
Extract Customer
        │
        customer = order.customer
        │
        ▼
Extract Fields
        │
        ├─── first_name: customer.first_name or "Customer"
        ├─── last_name: customer.last_name or ""
        ├─── email: customer.email
        └─── phone: customer.phone
        │
        ▼
Validate Fields
        │
        ├─── Email: Check format
        ├─── Phone: Check not empty
        │
        ▼
Return Customer Dict
        │
        {
            "first_name": "John",
            "last_name": "Doe",
            "email": "john@example.com",
            "phone": "0771234567"
        }
```

### Customer Data Fields

| Field | PayHere Field | Required | Max Length | Default |
|-------|---------------|----------|------------|---------|
| first_name | first_name | Yes | 50 | "Customer" |
| last_name | last_name | No | 50 | "" |
| email | email | Yes | 100 | N/A (error) |
| phone | phone | Yes | 20 | N/A (error) |

### Data Extraction Sources

| Data | Source | Fallback |
|------|--------|----------|
| First Name | customer.first_name | "Customer" |
| Last Name | customer.last_name | "" |
| Email | customer.email | Raise error (required) |
| Phone | customer.phone | Raise error (required) |

### Email Validation Rules

| Rule | Check | Example Valid | Example Invalid |
|------|-------|---------------|-----------------|
| Not empty | len(email) > 0 | "a@b.com" | "" |
| Contains @ | "@" in email | "user@domain.com" | "userdomain.com" |
| Has domain | "." after @ | "user@example.com" | "user@example" |
| Max length | len <= 100 | "user@example.com" | (very long email) |

### Phone Number Preprocessing

| Input | Cleaned | Notes |
|-------|---------|-------|
| "077 123 4567" | "0771234567" | Remove spaces |
| "(077) 123-4567" | "0771234567" | Remove special chars |
| "+94 77 123 4567" | "+94771234567" | Keep + prefix |
| "0771234567" | "0771234567" | Already clean |

### Function Signature

```
Function: build_customer_data()
Parameters:
    - order: Order (order object with customer)
Returns:
    - dict (customer data for PayHere)
Example:
    build_customer_data(order)
    → {
        "first_name": "John",
        "last_name": "Doe",
        "email": "john@example.com",
        "phone": "0771234567"
      }
```

### Validation Function Signature

```
Function: validate_customer_data(customer_data: dict) -> None
Validates:
    - first_name is not empty
    - email is valid format
    - phone is not empty
Raises:
    - PayHereValidationError if invalid
```

### Customer Data Dictionary Structure

```
customer_data = {
    "first_name": str,   # Required, max 50 chars
    "last_name": str,    # Optional, max 50 chars
    "email": str,        # Required, valid email format
    "phone": str,        # Required, will be formatted to +94
}
```

### Error Handling

| Error | Condition | Message |
|-------|-----------|---------|
| Missing Email | email is None or empty | "Customer email is required" |
| Invalid Email | email format invalid | "Invalid email format" |
| Missing Phone | phone is None or empty | "Customer phone is required" |
| Missing Name | first_name is None or empty | Use "Customer" as default |

### Expected Outcome
- Customer data builder function implemented
- Extracts all required customer fields
- Validates email and phone formats
- Provides sensible defaults for optional fields
- Returns structured dictionary for PayHere

### Verification Checklist
- [ ] `build_customer_data()` function created in builders.py
- [ ] Extracts first_name with "Customer" fallback
- [ ] Extracts last_name with "" fallback
- [ ] Extracts and validates email
- [ ] Extracts and cleans phone number
- [ ] Returns dictionary with correct keys
- [ ] `validate_customer_data()` function created
- [ ] Email validation checks format
- [ ] Phone validation checks not empty
- [ ] Test with complete customer data
- [ ] Test with missing optional fields (last_name)
- [ ] Test with invalid email format
- [ ] Test with various phone formats

---

## Summary

This document established the PayHereProcessor class implementation, secure MD5 hash generation, and data builder utilities. These components form the core processing layer for PayHere payment integration, handling processor registration, hash verification, and proper data formatting for amounts, currencies, order IDs, items, and customer information.

### Completed Tasks
1. ✓ Created PayHereProcessor class extending PaymentProcessor ABC
2. ✓ Registered processor with ProcessorFactory
3. ✓ Created MD5 hash generator with proper algorithm
4. ✓ Defined hash parameters structure and ordering
5. ✓ Implemented uppercase MD5 conversion (PayHere requirement)
6. ✓ Created amount formatter (2 decimal places)
7. ✓ Created currency validator (LKR only)
8. ✓ Created order ID generator (unique identifiers)
9. ✓ Created item name builder (checkout description)
10. ✓ Created customer data builder (name, email, phone)

### Implementation Summary

| Component | Status | Purpose |
|-----------|--------|---------|
| PayHereProcessor | ✓ Complete | Main processor class |
| Processor Registration | ✓ Complete | Factory integration |
| Hash Generator | ✓ Complete | MD5 hash for verification |
| Hash Parameters | ✓ Complete | Parameter structure |
| Uppercase MD5 | ✓ Complete | PayHere format requirement |
| Amount Formatter | ✓ Complete | 2 decimal formatting |
| Currency Validator | ✓ Complete | LKR validation |
| Order ID Generator | ✓ Complete | Unique ID creation |
| Item Name Builder | ✓ Complete | Checkout description |
| Customer Data Builder | ✓ Complete | Customer info extraction |

### File Structure After Tasks 17-26

```
backend/apps/payments/processors/payhere/
├── __init__.py
├── constants.py (from Group A)
├── config.py (from Group A)
├── processor.py (Task 17-18)
├── hash.py (Task 19-21)
└── builders.py (Task 22-26)
```

### Next Steps
Proceed to [02_Tasks-27-34_Address-Intent-Verify.md](02_Tasks-27-34_Address-Intent-Verify.md) to create address builder, phone formatter, email validator, delivery fields, custom fields, payment intent builder, redirect URL builder, and verify the complete processor implementation.

---

**Document Status:** Complete  
**Tasks Covered:** 17-26  
**Next Document:** [02_Tasks-27-34_Address-Intent-Verify.md](02_Tasks-27-34_Address-Intent-Verify.md)
