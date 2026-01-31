# Tasks 17-24: COD Processor and Eligibility Checks

> **Phase:** 09 - Integrations & Sri Lanka Localizations  
> **SubPhase:** 06 - Cash on Delivery (COD)  
> **Group:** B - COD Processor Implementation  
> **Document:** 01 of 02  
> **Tasks Covered:** 17, 18, 19, 20, 21, 22, 23, 24

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-25-32_Payment-Status-Verify.md](02_Tasks-25-32_Payment-Status-Verify.md)

---

## Document Overview

This document covers the creation and implementation of the CODProcessor class with comprehensive eligibility checking mechanisms. It establishes the processor foundation, registration with the payment factory, and implements multi-layered eligibility verification including zone availability, order amount validation, customer history analysis, and COD fee calculation.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 17 | Create CODProcessor Class | High | 45 min |
| 18 | Create Processor Registration | Low | 10 min |
| 19 | Create initiate_payment Method | Medium | 30 min |
| 20 | Create COD Eligibility Check | Medium | 25 min |
| 21 | Create Zone Availability Check | Low | 15 min |
| 22 | Create Order Amount Check | Low | 15 min |
| 23 | Create Customer History Check | Medium | 25 min |
| 24 | Create COD Fee Calculation | Medium | 25 min |

---

## Task 17: Create CODProcessor Class

### Overview
Create the CODProcessor class that extends the PaymentProcessor abstract base class. This processor handles the Cash on Delivery payment flow, which differs significantly from online payment gateways. COD involves no immediate electronic payment—instead, it manages the payment intent, eligibility verification, order creation, and eventual cash collection upon delivery. The processor must integrate with the existing payment framework while accommodating the unique characteristics of manual cash collection.

### Dependencies
- SubPhase-01 (Payment Gateway Integration) - PaymentProcessor ABC
- Task 16 (Verify COD Configuration) - COD configuration complete

### Instructions

1. **Create processor module structure**
   - Navigate to `backend/apps/payments/processors/` directory
   - Create new directory named `cod`
   - Create `__init__.py` to make it a package
   - Create `processor.py` for main processor class

2. **Import required dependencies**
   - Import PaymentProcessor abstract base class
   - Import PaymentGateway enum with COD type
   - Import PaymentIntent and PaymentResult models
   - Import CODConfig model from Group A
   - Import logging utilities for transaction tracking

3. **Define CODProcessor class structure**
   - Create class named `CODProcessor`
   - Extend `PaymentProcessor` abstract base class
   - Set class-level attribute `gateway_type = PaymentGateway.COD`
   - Define required method signatures from ABC

4. **Implement constructor method**
   - Accept tenant configuration in constructor
   - Load CODConfig settings for the tenant
   - Initialize fee calculator reference
   - Initialize eligibility checker reference
   - Store any required gateway credentials (if applicable)

5. **Override abstract methods**
   - Implement `initiate_payment()` method (detailed in Task 19)
   - Implement `verify_payment()` method (detailed in Task 26)
   - Implement `process_refund()` method (detailed in Task 30)
   - Implement `get_payment_status()` method for status queries
   - Return NotImplemented or raise exceptions for unsupported operations

6. **Add processor metadata methods**
   - Create `get_supported_currencies()` to return ["LKR"]
   - Create `requires_redirect()` to return False (no external gateway)
   - Create `supports_refunds()` to return True (manual refunds supported)
   - Create `get_transaction_fee()` to calculate COD fees

7. **Implement helper methods**
   - Create private method `_load_config()` to fetch tenant COD settings
   - Create private method `_validate_currency()` to ensure LKR only
   - Create method `_log_transaction()` for audit trails
   - Create method `_create_transaction_record()` for database entries

### CODProcessor Architecture

```
┌──────────────────────────────────────────┐
│         CODProcessor Class               │
│  (extends PaymentProcessor ABC)          │
├──────────────────────────────────────────┤
│                                          │
│  Attributes:                             │
│  • gateway_type = COD                    │
│  • tenant_config: CODConfig              │
│  • fee_calculator: CODFeeCalculator      │
│  • eligibility_checker: EligibilityCheck │
│                                          │
│  Core Methods:                           │
│  • initiate_payment()                    │
│  • verify_payment()                      │
│  • process_refund()                      │
│  • get_payment_status()                  │
│                                          │
│  Metadata Methods:                       │
│  • get_supported_currencies()            │
│  • requires_redirect()                   │
│  • supports_refunds()                    │
│                                          │
│  Helper Methods:                         │
│  • _load_config()                        │
│  • _validate_currency()                  │
│  • _log_transaction()                    │
│  • _create_transaction_record()          │
│                                          │
└──────────────────────────────────────────┘
```

### Class Attributes

| Attribute | Type | Description | Value |
|-----------|------|-------------|-------|
| gateway_type | PaymentGateway | Payment gateway identifier | PaymentGateway.COD |
| tenant_config | CODConfig | Tenant-specific COD settings | Loaded in __init__ |
| fee_calculator | CODFeeCalculator | Fee calculation engine | Initialized in __init__ |
| eligibility_checker | EligibilityChecker | Eligibility verification | Initialized in __init__ |

### Method Signatures

| Method | Parameters | Return Type | Purpose |
|--------|------------|-------------|---------|
| `__init__` | tenant, config | None | Initialize processor |
| `initiate_payment` | payment_intent: PaymentIntent | PaymentResult | Start COD payment |
| `verify_payment` | transaction_id, data | PaymentResult | Verify cash collection |
| `process_refund` | transaction_id, amount | RefundResult | Process COD refund |
| `get_payment_status` | transaction_id | PaymentStatus | Query payment status |
| `get_supported_currencies` | None | List[str] | Return ["LKR"] |
| `requires_redirect` | None | bool | Return False |
| `supports_refunds` | None | bool | Return True |

### COD Payment Flow Overview

```
┌─────────────────────────────────────────────────────────┐
│                   COD Payment Flow                       │
└─────────────────────────────────────────────────────────┘
                         │
                         ▼
            ┌────────────────────────┐
            │  initiate_payment()    │
            │  • Eligibility checks  │
            │  • Fee calculation     │
            │  • Create pending txn  │
            └────────────────────────┘
                         │
                         ▼
            ┌────────────────────────┐
            │    Order Processing    │
            │    • Create order      │
            │    • Status: PENDING   │
            │    • Await dispatch    │
            └────────────────────────┘
                         │
                         ▼
            ┌────────────────────────┐
            │   Delivery Attempt     │
            │   • Agent collects     │
            │   • Cash or failure    │
            └────────────────────────┘
                         │
                         ▼
            ┌────────────────────────┐
            │   verify_payment()     │
            │   • Confirm collection │
            │   • Update status      │
            │   • Complete order     │
            └────────────────────────┘
```

### Configuration Loading

| Configuration Item | Source | Usage |
|--------------------|--------|-------|
| COD Enabled | CODConfig.is_enabled | Check if COD is active |
| Fee Type | CODConfig.fee_type | FLAT or PERCENTAGE |
| Fee Amount | CODConfig.fee_amount | COD fee value |
| Minimum Order | CODConfig.minimum_order_amount | Order minimum |
| Maximum Order | CODConfig.maximum_order_amount | Order maximum |
| OTP Required | CODConfig.otp_required | Phone verification |
| First Order Limit | CODConfig.first_order_limit | New customer limit |

### Error Handling Strategy

| Error Type | Action | Response |
|------------|--------|----------|
| Config not found | Raise exception | "COD not configured" |
| Currency invalid | Reject payment | "Only LKR supported" |
| Config disabled | Reject payment | "COD not available" |
| Invalid state | Log and reject | "Invalid payment state" |

### Expected Outcome
- Fully functional CODProcessor class extending PaymentProcessor
- All abstract methods implemented (even if basic)
- Proper configuration loading and validation
- Foundation for eligibility checks and payment processing
- Comprehensive error handling and logging

### Verification Checklist
- [ ] CODProcessor class created in `processors/cod/processor.py`
- [ ] Extends PaymentProcessor abstract base class correctly
- [ ] gateway_type set to PaymentGateway.COD
- [ ] Constructor loads CODConfig successfully
- [ ] All abstract methods implemented (even if basic stubs)
- [ ] Metadata methods return correct values
- [ ] Helper methods created for config and logging
- [ ] Class imports without errors
- [ ] Type hints properly defined

---

## Task 18: Create Processor Registration

### Overview
Register the CODProcessor with the ProcessorFactory to enable automatic processor discovery and instantiation. The factory pattern allows the payment system to dynamically select and create the appropriate processor based on the payment gateway type, ensuring loose coupling and extensibility.

### Dependencies
- Task 17: Create CODProcessor Class

### Instructions

1. **Locate processor factory**
   - Navigate to `backend/apps/payments/` directory
   - Find `factory.py` or `processor_factory.py` file
   - Review existing processor registrations

2. **Import CODProcessor**
   - Add import statement for CODProcessor class
   - Import from `processors.cod.processor` module
   - Ensure import path is correct

3. **Register processor with factory**
   - Use ProcessorFactory.register() method
   - Pass PaymentGateway.COD as the key
   - Pass CODProcessor class as the value
   - Registration should occur at module import time

4. **Verify registration pattern**
   - Ensure registration follows existing pattern
   - Confirm decorator usage if applicable
   - Check for any initialization requirements

5. **Test processor retrieval**
   - Verify factory can retrieve CODProcessor by gateway type
   - Confirm processor instantiation works correctly
   - Test with tenant configuration parameter

6. **Update factory exports**
   - Ensure CODProcessor is in `__all__` list if present
   - Update any factory documentation
   - Verify all imports work correctly

### Processor Factory Pattern

```
┌─────────────────────────────────────────┐
│       ProcessorFactory                  │
├─────────────────────────────────────────┤
│                                         │
│  Registry:                              │
│  {                                      │
│    STRIPE: StripeProcessor,             │
│    PAYPAL: PayPalProcessor,             │
│    BANK_TRANSFER: BankTransferProcessor,│
│    COD: CODProcessor  ← New Registration│
│  }                                      │
│                                         │
│  Methods:                               │
│  • register(gateway, processor_class)   │
│  • get_processor(gateway, tenant)       │
│  • list_available_processors()          │
│                                         │
└─────────────────────────────────────────┘
```

### Registration Approaches

| Approach | Syntax | When to Use |
|----------|--------|-------------|
| Direct Registration | `factory.register(COD, CODProcessor)` | Module import |
| Decorator Registration | `@register(PaymentGateway.COD)` | Class definition |
| Configuration-Based | Config file mapping | Advanced scenarios |

### Registration Code Pattern

```python
# Option 1: Direct registration
from payments.processors.cod.processor import CODProcessor
from payments.enums import PaymentGateway

ProcessorFactory.register(
    gateway=PaymentGateway.COD,
    processor_class=CODProcessor
)

# Option 2: Decorator registration
@ProcessorFactory.register(PaymentGateway.COD)
class CODProcessor(PaymentProcessor):
    ...
```

### Factory Usage Flow

```
┌──────────────────────┐
│  Payment Request     │
│  gateway = "COD"     │
└──────────────────────┘
           │
           ▼
┌──────────────────────┐
│  ProcessorFactory    │
│  .get_processor(COD) │
└──────────────────────┘
           │
           ▼
┌──────────────────────┐
│  Lookup in Registry  │
│  registry[COD]       │
└──────────────────────┘
           │
           ▼
┌──────────────────────┐
│  CODProcessor Class  │
│  Instantiate         │
└──────────────────────┘
           │
           ▼
┌──────────────────────┐
│  Return Processor    │
│  Instance            │
└──────────────────────┘
```

### Registration Verification

| Verification Step | Method | Expected Result |
|-------------------|--------|-----------------|
| Import Check | `from factory import ProcessorFactory` | No errors |
| Retrieval Test | `factory.get_processor(PaymentGateway.COD)` | CODProcessor class |
| Instance Test | `processor = factory.get_processor(COD, tenant)` | CODProcessor instance |
| Type Check | `isinstance(processor, CODProcessor)` | True |
| Gateway Check | `processor.gateway_type == PaymentGateway.COD` | True |

### Expected Outcome
- CODProcessor successfully registered with ProcessorFactory
- Processor can be retrieved by PaymentGateway.COD enum
- Factory can instantiate processor with tenant configuration
- Registration follows existing pattern in codebase

### Verification Checklist
- [ ] CODProcessor imported in factory module
- [ ] Registration code added to factory
- [ ] Registration uses PaymentGateway.COD as key
- [ ] Factory can retrieve CODProcessor by gateway type
- [ ] Processor instantiation works with tenant parameter
- [ ] Registration follows existing processor patterns
- [ ] No import or registration errors

---

## Task 19: Create initiate_payment Method

### Overview
Implement the initiate_payment method which serves as the entry point for COD payment processing. Unlike online payment gateways that redirect to external pages, COD initiates a payment intent that remains pending until cash collection during delivery. This method orchestrates eligibility verification, fee calculation, and transaction record creation.

### Dependencies
- Task 17: Create CODProcessor Class

### Instructions

1. **Define method signature**
   - Method name: `initiate_payment`
   - Parameter: `payment_intent` (type: PaymentIntent)
   - Return type: PaymentResult
   - Add appropriate type hints and docstring

2. **Extract payment intent data**
   - Extract order details (amount, currency, items)
   - Extract customer information (ID, phone, address)
   - Extract delivery address details
   - Extract any custom parameters

3. **Validate currency**
   - Check if currency is LKR
   - Reject if not LKR (COD only supports Sri Lankan Rupees)
   - Return error result with appropriate message

4. **Check if COD is enabled**
   - Load tenant COD configuration
   - Verify `is_enabled` flag is True
   - Return error if COD is disabled

5. **Run eligibility checks**
   - Call eligibility checker method (Task 20)
   - Pass order amount, customer, and delivery address
   - Collect all eligibility check results
   - Aggregate any errors or warnings

6. **Calculate COD fee**
   - Call fee calculator method (Task 24)
   - Pass order amount and fee configuration
   - Add COD fee to order total
   - Store fee in transaction metadata

7. **Create pending transaction**
   - Create PaymentTransaction record (Task 25)
   - Set status to PENDING
   - Store payment intent reference
   - Store COD fee and order total
   - Set payment_type to COD

8. **Generate payment result**
   - Create PaymentResult object
   - Set status to PENDING
   - Set success flag to True
   - Include transaction ID
   - Include redirect_url as None (no redirect for COD)
   - Include metadata with COD fee and instructions

9. **Handle errors gracefully**
   - Catch any exceptions during processing
   - Log errors with transaction context
   - Return PaymentResult with error status
   - Include user-friendly error messages

10. **Return payment result**
    - Return successful PaymentResult with PENDING status
    - Include instructions for customer
    - Include delivery expectations

### Method Flow Diagram

```
┌─────────────────────────────────────────────────────┐
│          initiate_payment Method Flow               │
└─────────────────────────────────────────────────────┘
                      │
                      ▼
        ┌─────────────────────────┐
        │  Extract Intent Data    │
        │  • Order amount         │
        │  • Customer info        │
        │  • Delivery address     │
        └─────────────────────────┘
                      │
                      ▼
        ┌─────────────────────────┐
        │   Validate Currency     │
        │   Must be LKR           │
        └─────────────────────────┘
                      │
                      ▼
        ┌─────────────────────────┐
        │  Check COD Enabled      │
        │  tenant.is_enabled      │
        └─────────────────────────┘
                      │
                      ▼
        ┌─────────────────────────┐
        │  Run Eligibility Checks │
        │  • Zone check           │
        │  • Amount check         │
        │  • History check        │
        └─────────────────────────┘
                      │
                      ▼
        ┌─────────────────────────┐
        │  Calculate COD Fee      │
        │  FLAT or PERCENTAGE     │
        └─────────────────────────┘
                      │
                      ▼
        ┌─────────────────────────┐
        │  Create Transaction     │
        │  Status: PENDING        │
        │  Type: COD              │
        └─────────────────────────┘
                      │
                      ▼
        ┌─────────────────────────┐
        │  Generate Result        │
        │  Return PaymentResult   │
        └─────────────────────────┘
```

### PaymentIntent Structure

| Field | Type | Description | Required |
|-------|------|-------------|----------|
| order_id | UUID | Order reference | Yes |
| amount | Decimal | Order amount in LKR | Yes |
| currency | str | Currency code (LKR) | Yes |
| customer | Customer | Customer object | Yes |
| delivery_address | Address | Delivery location | Yes |
| phone | str | Contact number | Yes |
| metadata | dict | Additional data | No |

### PaymentResult Structure

| Field | Type | Value (COD) | Description |
|-------|------|-------------|-------------|
| success | bool | True | Payment initiated |
| status | str | "PENDING" | Awaiting collection |
| transaction_id | UUID | Generated ID | Transaction reference |
| redirect_url | str | None | No external redirect |
| requires_action | bool | False | No additional action |
| metadata | dict | COD info | Fee, instructions |
| error_message | str | None | Error if any |

### Eligibility Check Integration

```
┌──────────────────────────────────────┐
│     Eligibility Verification         │
├──────────────────────────────────────┤
│                                      │
│  1. Zone Availability (Task 21)      │
│     ✓ COD available in district?     │
│                                      │
│  2. Order Amount (Task 22)           │
│     ✓ Within min/max limits?         │
│     ✓ First order limit check        │
│                                      │
│  3. Customer History (Task 23)       │
│     ✓ Previous COD success rate      │
│     ✓ Failed delivery count          │
│     ✓ Blacklist check                │
│                                      │
│  Result: Pass/Fail + Error Messages  │
│                                      │
└──────────────────────────────────────┘
```

### Error Handling Cases

| Error Condition | Error Message | HTTP Status |
|-----------------|---------------|-------------|
| Currency not LKR | "COD only supports LKR currency" | 400 |
| COD disabled | "COD is not available for this store" | 400 |
| Zone not allowed | "COD not available in your delivery area" | 400 |
| Amount too low | "Order amount below COD minimum (LKR X)" | 400 |
| Amount too high | "Order amount exceeds COD maximum (LKR X)" | 400 |
| Customer blacklisted | "COD not available for your account" | 403 |
| High failure rate | "Please use alternative payment method" | 403 |

### Metadata Included in Result

| Key | Value | Purpose |
|-----|-------|---------|
| cod_fee | Decimal | COD service fee |
| cod_fee_type | FLAT/PERCENTAGE | Fee calculation type |
| order_total | Decimal | Amount + COD fee |
| payment_instructions | str | Customer instructions |
| delivery_expectations | str | Expected delivery time |

### Customer Instructions Example

```
Payment Instructions:
- Pay cash to delivery agent upon receiving goods
- Total amount: LKR 5,250 (includes LKR 250 COD fee)
- Please keep exact change ready
- Delivery expected in 3-5 business days
- Payment receipt will be provided
```

### Expected Outcome
- Functional initiate_payment method that orchestrates COD payment flow
- Comprehensive validation of currency and COD availability
- Integration with eligibility checks (implemented in Tasks 20-23)
- Proper fee calculation and transaction creation
- Detailed PaymentResult with customer instructions
- Robust error handling and user-friendly messages

### Verification Checklist
- [ ] Method signature matches PaymentProcessor ABC
- [ ] Payment intent data extracted correctly
- [ ] Currency validation (LKR only) implemented
- [ ] COD enabled check performed
- [ ] Eligibility checks integrated (calls Task 20)
- [ ] COD fee calculation integrated (calls Task 24)
- [ ] Transaction creation integrated (calls Task 25)
- [ ] PaymentResult generated with correct structure
- [ ] Error handling covers all failure cases
- [ ] Metadata includes COD fee and instructions
- [ ] Method returns appropriate result in all cases
- [ ] Logging implemented for audit trail

---

## Task 20: Create COD Eligibility Check

### Overview
Implement the comprehensive eligibility verification system that determines whether a customer can use COD for their order. This multi-layered check system ensures risk mitigation by validating zone availability, order amounts, and customer history. The eligibility checker acts as a gatekeeper, preventing high-risk COD transactions while maintaining a positive customer experience.

### Dependencies
- Task 19: Create initiate_payment Method

### Instructions

1. **Create eligibility checker module**
   - Create `eligibility.py` file in `processors/cod/` directory
   - Define `CODEligibilityChecker` class
   - Set up logging for eligibility decisions

2. **Define checker class structure**
   - Create class constructor accepting configuration
   - Store CODConfig reference
   - Store zone configuration reference
   - Initialize any required services (customer service, order service)

3. **Create main eligibility method**
   - Method name: `check_eligibility`
   - Parameters: order_amount, customer, delivery_address
   - Return type: EligibilityResult (success flag + error messages)
   - Orchestrate all sub-checks

4. **Implement check orchestration**
   - Run zone availability check (Task 21)
   - Run order amount check (Task 22)
   - Run customer history check (Task 23)
   - Aggregate results from all checks
   - Collect all error messages

5. **Define EligibilityResult data structure**
   - Field: `is_eligible` (bool) - overall pass/fail
   - Field: `errors` (list) - all error messages
   - Field: `warnings` (list) - non-blocking warnings
   - Field: `metadata` (dict) - additional context

6. **Implement result aggregation logic**
   - If any check fails, set is_eligible to False
   - Collect all error messages from failed checks
   - Collect warnings from passed checks with concerns
   - Add metadata about checks performed

7. **Add logging and monitoring**
   - Log each eligibility check attempt
   - Log final eligibility decision
   - Track failure reasons for analytics
   - Monitor high-risk customer patterns

8. **Handle edge cases**
   - New customers (no history)
   - Missing address details
   - Incomplete customer profiles
   - Temporary zone restrictions

### Eligibility Check Architecture

```
┌───────────────────────────────────────────────────────┐
│            CODEligibilityChecker                      │
├───────────────────────────────────────────────────────┤
│                                                       │
│  check_eligibility(amount, customer, address)        │
│         │                                             │
│         ├──► Zone Check (Task 21)                    │
│         │    • District allowed?                     │
│         │    • Zone-specific limits                  │
│         │                                             │
│         ├──► Amount Check (Task 22)                  │
│         │    • Min/max order amount                  │
│         │    • First order limit                     │
│         │    • Zone-specific max                     │
│         │                                             │
│         ├──► History Check (Task 23)                 │
│         │    • COD success rate                      │
│         │    • Failed deliveries                     │
│         │    • Blacklist status                      │
│         │                                             │
│         └──► Aggregate Results                       │
│              • All passed? Eligible                  │
│              • Any failed? Not eligible              │
│              • Return EligibilityResult              │
│                                                       │
└───────────────────────────────────────────────────────┘
```

### Eligibility Check Flow

```
                    Start Eligibility Check
                            │
                            ▼
                ┌───────────────────────┐
                │   Zone Check (T21)    │
                │   District allowed?   │
                └───────────────────────┘
                     │            │
                  Pass         Fail ───► Add Error
                     │
                     ▼
                ┌───────────────────────┐
                │  Amount Check (T22)   │
                │  Within limits?       │
                └───────────────────────┘
                     │            │
                  Pass         Fail ───► Add Error
                     │
                     ▼
                ┌───────────────────────┐
                │  History Check (T23)  │
                │  Good track record?   │
                └───────────────────────┘
                     │            │
                  Pass         Fail ───► Add Error
                     │
                     ▼
                ┌───────────────────────┐
                │  Aggregate Results    │
                │  Any errors?          │
                └───────────────────────┘
                     │            │
                   Yes          No
                     │            │
                     ▼            ▼
              Not Eligible    Eligible
              (with errors)   (success)
```

### EligibilityResult Structure

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| is_eligible | bool | Overall eligibility | False |
| errors | List[str] | Blocking error messages | ["Amount exceeds limit"] |
| warnings | List[str] | Non-blocking warnings | ["First COD order"] |
| metadata | dict | Additional context | {"checks_run": 3} |
| check_details | dict | Individual check results | {"zone": "pass"} |

### Check Execution Strategy

| Strategy | Description | When to Use |
|----------|-------------|-------------|
| Fail-Fast | Stop on first failure | Performance optimization |
| Run-All | Execute all checks | Complete error reporting |
| Weighted | Some checks more critical | Risk-based decisions |

### Error Message Guidelines

| Error Type | Message Format | User-Friendly |
|------------|----------------|---------------|
| Zone | "COD not available in [District]" | Yes |
| Amount Low | "Minimum order: LKR [X]" | Yes |
| Amount High | "Maximum order: LKR [X]" | Yes |
| History | "Payment method unavailable" | Vague (privacy) |
| Blacklist | "Please contact support" | Vague (security) |

### Eligibility Check Matrix

```
┌────────────┬──────────┬──────────┬──────────┬────────────┐
│            │  Zone    │  Amount  │  History │   Result   │
│            │  Check   │  Check   │  Check   │            │
├────────────┼──────────┼──────────┼──────────┼────────────┤
│ Scenario 1 │  ✓ Pass  │  ✓ Pass  │  ✓ Pass  │  ✓ Eligible│
│ Scenario 2 │  ✗ Fail  │  ✓ Pass  │  ✓ Pass  │  ✗ Not     │
│ Scenario 3 │  ✓ Pass  │  ✗ Fail  │  ✓ Pass  │  ✗ Not     │
│ Scenario 4 │  ✓ Pass  │  ✓ Pass  │  ✗ Fail  │  ✗ Not     │
│ Scenario 5 │  ✗ Fail  │  ✗ Fail  │  ✓ Pass  │  ✗ Not     │
│ Scenario 6 │  ⚠ Warn  │  ✓ Pass  │  ✓ Pass  │  ✓ Eligible│
└────────────┴──────────┴──────────┴──────────┴────────────┘
```

### Metadata Included

| Key | Value | Purpose |
|-----|-------|---------|
| checks_performed | List[str] | List of executed checks |
| check_duration_ms | int | Performance tracking |
| zone_checked | str | District verified |
| amount_checked | Decimal | Order amount verified |
| customer_id | UUID | Customer reference |
| risk_level | str | LOW/MEDIUM/HIGH |

### New Customer Handling

| Scenario | Action | Limit |
|----------|--------|-------|
| No order history | Apply first order limit | Use first_order_limit |
| Verified phone | Allow COD | Standard limits |
| Unverified phone | Require OTP | Stricter limits |
| Suspicious pattern | Block COD | Recommend alternative |

### Expected Outcome
- Comprehensive eligibility checker orchestrating multiple validations
- Clear pass/fail decision with detailed error messages
- Integration points for three sub-checks (Tasks 21-23)
- EligibilityResult data structure for consistent responses
- Proper logging and monitoring for risk analysis
- Graceful handling of edge cases and new customers

### Verification Checklist
- [ ] CODEligibilityChecker class created in `eligibility.py`
- [ ] Main check_eligibility method implemented
- [ ] Integration with zone check (Task 21) prepared
- [ ] Integration with amount check (Task 22) prepared
- [ ] Integration with history check (Task 23) prepared
- [ ] EligibilityResult structure defined
- [ ] Result aggregation logic implemented
- [ ] Error message collection working
- [ ] Logging implemented for all checks
- [ ] Edge cases handled (new customers, missing data)
- [ ] Method returns EligibilityResult consistently

---

## Task 21: Create Zone Availability Check

### Overview
Implement the zone-based COD availability verification that determines whether Cash on Delivery is offered in the customer's delivery district. Sri Lanka's geography and infrastructure vary significantly across regions, making some areas unsuitable for COD due to accessibility, reliability concerns, or logistical challenges. This check ensures COD is only offered where feasible and safe.

### Dependencies
- Task 20: Create COD Eligibility Check

### Instructions

1. **Create zone checker method**
   - Method name: `check_zone_availability`
   - Parameters: delivery_address (Address object)
   - Return type: CheckResult (pass/fail + message)
   - Location: Within CODEligibilityChecker class or separate module

2. **Extract district information**
   - Get district from delivery address
   - Normalize district name (handle variations)
   - Handle missing or invalid district data
   - Validate district exists in system

3. **Query CODZones configuration**
   - Load CODZones model for tenant
   - Find configuration for customer's district
   - Check if configuration exists
   - Handle multi-tenant zone settings

4. **Check COD availability flag**
   - Read `cod_available` field for district
   - Return failure if False or not configured
   - Return success if True

5. **Retrieve zone-specific limits**
   - Get zone_cod_max_amount if configured
   - Store in metadata for later amount check
   - This may override global maximum
   - Pass zone-specific data to amount checker

6. **Generate appropriate messages**
   - Success: "COD available in [District]"
   - Failure: "COD not available in [District]"
   - No config: "Please contact support for COD availability"
   - Consider customer-friendly messaging

7. **Handle special cases**
   - Major cities (always available)
   - Remote areas (may be restricted)
   - Temporary restrictions (events, weather)
   - New areas (pending configuration)

8. **Log zone check results**
   - Log district being checked
   - Log check result (pass/fail)
   - Track denied requests by zone for analytics
   - Monitor zone configuration usage

### Zone Availability Check Flow

```
                Customer Order
                     │
                     ▼
        ┌────────────────────────┐
        │  Extract District      │
        │  from Delivery Address │
        └────────────────────────┘
                     │
                     ▼
        ┌────────────────────────┐
        │  Normalize District    │
        │  "Colombo" → "COLOMBO" │
        └────────────────────────┘
                     │
                     ▼
        ┌────────────────────────┐
        │  Query CODZones        │
        │  Filter by District    │
        └────────────────────────┘
                     │
         ┌───────────┴────────────┐
         │                        │
    Config Found           No Config
         │                        │
         ▼                        ▼
    ┌─────────┐          ┌─────────────┐
    │ Check   │          │  Return     │
    │ Enabled │          │  Not Avail. │
    └─────────┘          └─────────────┘
         │
    ┌────┴────┐
    │         │
 Enabled   Disabled
    │         │
    ▼         ▼
  Pass      Fail
(Eligible) (Error)
```

### Sri Lankan Districts

| Province | Districts | COD Strategy |
|----------|-----------|--------------|
| Western | Colombo, Gampaha, Kalutara | High availability |
| Central | Kandy, Matale, Nuwara Eliya | Moderate |
| Southern | Galle, Matara, Hambantota | High availability |
| Northern | Jaffna, Kilinochchi, Mannar, Vavuniya, Mullaitivu | Case-by-case |
| Eastern | Trincomalee, Batticaloa, Ampara | Moderate |
| North Western | Kurunegala, Puttalam | High availability |
| North Central | Anuradhapura, Polonnaruwa | Moderate |
| Uva | Badulla, Monaragala | Low/restricted |
| Sabaragamuwa | Ratnapura, Kegalle | Moderate |

### CODZones Model Structure

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| tenant | FK | Tenant reference | tenant_123 |
| district | CharField | Sri Lankan district | "Colombo" |
| cod_available | BooleanField | COD enabled? | True |
| zone_cod_max_amount | DecimalField | Zone-specific max | 50000.00 |
| notes | TextField | Admin notes | "High reliability" |
| created_at | DateTimeField | Config date | 2026-01-15 |

### Zone Configuration Examples

```
District: Colombo
├── cod_available: True
├── zone_cod_max_amount: 100,000 LKR
└── notes: "Capital city - full service"

District: Jaffna
├── cod_available: True
├── zone_cod_max_amount: 30,000 LKR
└── notes: "Limited by logistics"

District: Monaragala
├── cod_available: False
├── zone_cod_max_amount: null
└── notes: "Remote area - high failure rate"
```

### CheckResult Structure

| Field | Type | Description | Value (Pass) | Value (Fail) |
|-------|------|-------------|--------------|--------------|
| passed | bool | Check result | True | False |
| error_message | str | Error if failed | None | "COD not available..." |
| warning_message | str | Warning if any | None | None |
| metadata | dict | Additional data | {district: "Colombo"} | {district: "X"} |

### Error Messages

| Scenario | Error Message | User Action |
|----------|---------------|-------------|
| Zone disabled | "COD not available in [District]" | Use alt payment |
| No config | "COD availability unknown for this area" | Contact support |
| Invalid district | "Invalid delivery location" | Update address |
| Temp restriction | "COD temporarily unavailable in this area" | Try later |

### District Name Normalization

| Input Variation | Normalized | Reason |
|-----------------|------------|--------|
| "colombo" | "COLOMBO" | Case insensitive |
| "Colombo " | "COLOMBO" | Trim spaces |
| "Colombo City" | "COLOMBO" | Remove suffixes |
| "CMB" | "COLOMBO" | Handle abbreviations |

### Zone-Specific Maximum

```
Global COD Max: 50,000 LKR
        │
        ▼
Zone Check: Colombo
        │
        ▼
Zone Max: 100,000 LKR (override)
        │
        ▼
Effective Max: 100,000 LKR (higher limit for reliable zone)

---

Zone Check: Monaragala
        │
        ▼
Zone Max: 20,000 LKR (override)
        │
        ▼
Effective Max: 20,000 LKR (lower limit for risky zone)
```

### Logging Requirements

| Log Level | Event | Data Logged |
|-----------|-------|-------------|
| INFO | Zone check performed | District, result |
| WARNING | Zone not configured | District, tenant |
| ERROR | Invalid address | Address details |
| DEBUG | Zone query | SQL query, result count |

### Expected Outcome
- Functional zone availability check within eligibility checker
- District extraction and normalization from address
- Query and evaluation of CODZones configuration
- Zone-specific maximum amount retrieval
- Clear pass/fail result with appropriate messages
- Proper handling of missing or invalid districts

### Verification Checklist
- [ ] check_zone_availability method created
- [ ] District extracted from delivery address
- [ ] District name normalized (case, spaces)
- [ ] CODZones queried by tenant and district
- [ ] cod_available flag checked correctly
- [ ] Zone-specific maximum retrieved if present
- [ ] CheckResult returned with proper structure
- [ ] Error messages are user-friendly
- [ ] Missing district handled gracefully
- [ ] Logging implemented for zone checks
- [ ] Zone-specific max passed to amount checker

---

## Task 22: Create Order Amount Check

### Overview
Implement the order amount validation that ensures COD orders fall within configured minimum and maximum limits. This check protects merchants from excessive cash handling risks while filtering out very small orders that may not justify COD costs. Special handling applies for first-time COD customers, who may have stricter limits until trust is established.

### Dependencies
- Task 20: Create COD Eligibility Check

### Instructions

1. **Create amount checker method**
   - Method name: `check_order_amount`
   - Parameters: order_amount (Decimal), customer (Customer), zone_max (optional Decimal)
   - Return type: CheckResult (pass/fail + message)
   - Location: Within CODEligibilityChecker class

2. **Load amount limits from configuration**
   - Get minimum_order_amount from CODConfig
   - Get maximum_order_amount from CODConfig
   - Get first_order_limit from CODConfig
   - Handle missing or null configurations

3. **Determine applicable maximum limit**
   - Start with global maximum_order_amount
   - Override with zone_max if provided (from Task 21)
   - Use lower value if both exist
   - Override with first_order_limit for new customers

4. **Identify first-time COD customer**
   - Query customer's order history
   - Check for previous COD orders (status: COMPLETED)
   - If count == 0, customer is first-time COD user
   - Cache this result for performance

5. **Check minimum amount**
   - Compare order_amount >= minimum_order_amount
   - If fails, generate error message
   - Include minimum value in error message

6. **Check maximum amount**
   - Determine applicable max (global/zone/first-order)
   - Compare order_amount <= applicable_maximum
   - If fails, generate error message
   - Specify which limit was exceeded

7. **Generate appropriate messages**
   - Below minimum: "Minimum order for COD: LKR [X]"
   - Above maximum: "Maximum order for COD: LKR [X]"
   - First order exceeded: "First COD order limited to LKR [X]"
   - Success: Include no message or "Amount within limits"

8. **Add metadata to result**
   - Include checked amount
   - Include minimum and maximum values
   - Include limit type (global/zone/first)
   - Flag if first-time customer

9. **Handle edge cases**
   - Zero or negative amounts (reject)
   - Very large amounts (apply maximum)
   - No configured limits (use defaults)
   - Configuration errors (fail safe)

10. **Log amount checks**
    - Log amount being verified
    - Log applicable limits
    - Log check result
    - Track limit violations for analytics

### Amount Check Flow

```
                Order Amount
                     │
                     ▼
        ┌────────────────────────┐
        │  Load COD Limits       │
        │  • Minimum             │
        │  • Maximum             │
        │  • First order limit   │
        └────────────────────────┘
                     │
                     ▼
        ┌────────────────────────┐
        │  Check Customer        │
        │  First COD Order?      │
        └────────────────────────┘
              │            │
             Yes          No
              │            │
              ▼            ▼
        ┌─────────┐  ┌─────────┐
        │ Use     │  │ Use     │
        │ First   │  │ Global  │
        │ Limit   │  │ Max     │
        └─────────┘  └─────────┘
              │            │
              └─────┬──────┘
                    ▼
        ┌────────────────────────┐
        │  Compare with Zone Max │
        │  Use Lower Value       │
        └────────────────────────┘
                    │
                    ▼
        ┌────────────────────────┐
        │  Check Minimum         │
        │  amount >= min?        │
        └────────────────────────┘
              │            │
            Pass         Fail
              │            │
              ▼            ▼
        ┌─────────┐  ┌──────────┐
        │ Check   │  │ Return   │
        │ Maximum │  │ Error    │
        └─────────┘  └──────────┘
              │
         ┌────┴────┐
        Pass      Fail
         │          │
         ▼          ▼
      Success    Error
```

### Amount Limit Configuration

| Limit Type | Field Name | Typical Value | Purpose |
|------------|------------|---------------|---------|
| Minimum Order | minimum_order_amount | 500-1000 LKR | Avoid small orders |
| Maximum Order | maximum_order_amount | 50,000-100,000 LKR | Risk mitigation |
| First Order Limit | first_order_limit | 10,000-20,000 LKR | New customer caution |
| Zone Maximum | zone_cod_max_amount | Varies by district | Location-based risk |

### Limit Priority Hierarchy

```
                Start with Global Max
                    (e.g., 50,000 LKR)
                          │
                          ▼
                ┌─────────────────┐
                │ Zone Max Exists?│
                └─────────────────┘
                    │         │
                   Yes       No
                    │         │
                    ▼         │
            Use Lower of:     │
            Global vs Zone────┘
                    │
                    ▼
                ┌─────────────────┐
                │ First COD Order?│
                └─────────────────┘
                    │         │
                   Yes       No
                    │         │
                    ▼         │
            Use First Limit   │
            (if lower)────────┘
                    │
                    ▼
            Final Applicable Max
```

### First-Time Customer Detection

| Method | Query | Result |
|--------|-------|--------|
| Count COD Orders | `Orders.filter(customer, payment_type=COD, status=COMPLETED)` | 0 = First time |
| Cache Result | Store in request context | Avoid multiple queries |
| Include Pending | Consider pending COD orders? | Decision point |

### Limit Comparison Examples

```
Example 1: Regular Customer, Standard Zone
├── Order Amount: 25,000 LKR
├── Minimum: 1,000 LKR ✓
├── Global Max: 50,000 LKR ✓
├── Zone Max: Not set
├── First Order Limit: N/A (not first order)
└── Result: PASS

Example 2: First-Time Customer
├── Order Amount: 15,000 LKR
├── Minimum: 1,000 LKR ✓
├── Global Max: 50,000 LKR ✓
├── Zone Max: Not set
├── First Order Limit: 10,000 LKR ✗
└── Result: FAIL - "First COD order limited to LKR 10,000"

Example 3: Remote Zone
├── Order Amount: 60,000 LKR
├── Minimum: 1,000 LKR ✓
├── Global Max: 100,000 LKR ✓
├── Zone Max: 30,000 LKR ✗
├── First Order Limit: N/A
└── Result: FAIL - "Maximum COD in your area: LKR 30,000"

Example 4: Below Minimum
├── Order Amount: 500 LKR
├── Minimum: 1,000 LKR ✗
└── Result: FAIL - "Minimum COD order: LKR 1,000"
```

### Error Messages by Scenario

| Scenario | Error Message | Recommended Action |
|----------|---------------|-------------------|
| Below minimum | "Minimum order for COD: LKR 1,000" | Add more items |
| Above global max | "Maximum COD order: LKR 50,000" | Use online payment |
| Above zone max | "Maximum COD in [District]: LKR 30,000" | Reduce order or use online |
| Above first order | "First COD order limited to LKR 10,000" | Reduce order or use online |
| Invalid amount | "Invalid order amount" | Contact support |

### CheckResult Metadata

| Key | Value | Purpose |
|-----|-------|---------|
| order_amount | Decimal | Amount checked |
| minimum_limit | Decimal | Min threshold |
| maximum_limit | Decimal | Max threshold |
| applicable_max | Decimal | Effective max used |
| limit_type | str | "global"/"zone"/"first_order" |
| is_first_order | bool | First-time COD customer |

### Edge Case Handling

| Edge Case | Handling | Rationale |
|-----------|----------|-----------|
| Amount = 0 | Reject with error | Invalid order |
| Negative amount | Reject with error | Invalid order |
| No minimum set | Use 0 (allow all) | Permissive default |
| No maximum set | Use system max (e.g., 1M) | Safety limit |
| Min > Max | Log error, use max | Config error |
| Zone max > Global | Use zone max | Zone override allowed |

### Expected Outcome
- Functional order amount validation within eligibility checker
- Multi-tiered limit checking (minimum, maximum, zone, first-order)
- Correct identification of first-time COD customers
- Limit hierarchy properly applied
- Clear error messages indicating which limit was violated
- Metadata capturing all limit details for transparency

### Verification Checklist
- [ ] check_order_amount method created
- [ ] Minimum and maximum limits loaded from CODConfig
- [ ] First order limit loaded from CODConfig
- [ ] Zone maximum parameter accepted and used
- [ ] First-time COD customer detection implemented
- [ ] Limit hierarchy applied correctly (global → zone → first)
- [ ] Minimum amount check implemented
- [ ] Maximum amount check implemented
- [ ] Error messages generated for each failure type
- [ ] CheckResult includes metadata (amount, limits, type)
- [ ] Edge cases handled (zero, negative, missing config)
- [ ] Logging implemented for amount checks

---

## Task 23: Create Customer History Check

### Overview
Implement customer history verification that analyzes past COD behavior to assess risk. This check protects merchants from customers with patterns of failed deliveries, excessive returns, or payment avoidance. The system tracks COD success rates, failed delivery counts, and blacklist status to make informed decisions. For new customers, the check applies more lenient rules while monitoring for suspicious patterns.

### Dependencies
- Task 20: Create COD Eligibility Check

### Instructions

1. **Create history checker method**
   - Method name: `check_customer_history`
   - Parameters: customer (Customer object)
   - Return type: CheckResult (pass/fail + message)
   - Location: Within CODEligibilityChecker class

2. **Query customer order history**
   - Find all orders for customer with payment_type=COD
   - Count total COD orders
   - Separate by status (COMPLETED, FAILED, RETURNED)
   - Calculate date range (first order to now)

3. **Calculate COD success rate**
   - Formula: successful_orders / total_orders
   - Successful: orders with status COMPLETED
   - Failed: orders with FAILED or RETURNED status
   - Express as percentage

4. **Load risk thresholds from configuration**
   - Get minimum_success_rate (e.g., 70%)
   - Get maximum_failed_count (e.g., 3)
   - Get blacklist_threshold (e.g., 5 failures)
   - Define in CODConfig or separate RiskConfig

5. **Check blacklist status**
   - Query customer blacklist table
   - Check if customer is blacklisted for COD
   - If blacklisted, immediately fail with generic message
   - Log blacklist check for security monitoring

6. **Evaluate success rate**
   - If total orders < minimum_orders (e.g., 3), skip rate check
   - Compare success_rate >= minimum_success_rate
   - If fails, reject with appropriate message
   - Consider grace period for slight violations

7. **Evaluate failed delivery count**
   - Count consecutive failed deliveries
   - Count total failed deliveries
   - Compare against maximum_failed_count
   - Recent failures weigh more than old failures

8. **Handle new customers**
   - If total_orders == 0, customer is new
   - Apply new customer policy (allow with restrictions)
   - Flag for closer monitoring
   - May require phone verification

9. **Check for suspicious patterns**
   - Multiple orders to different addresses
   - High frequency of order cancellations
   - Pattern of ordering high-value items then refusing
   - Geographic hopping (different cities)

10. **Generate result with appropriate messaging**
    - Success: Allow with no message or info message
    - Low success rate: "Payment method unavailable"
    - Too many failures: "Please use alternative payment"
    - Blacklisted: "Please contact support"
    - Keep messages vague for privacy and security

11. **Add metadata to result**
    - Include total orders count
    - Include success rate
    - Include failed count
    - DO NOT expose sensitive data to frontend

12. **Log history check results**
    - Log customer ID and check result
    - Track denial reasons for analytics
    - Monitor high-risk patterns
    - Maintain audit trail

### Customer History Check Flow

```
                Customer Object
                     │
                     ▼
        ┌────────────────────────┐
        │  Query Order History   │
        │  COD Orders Only       │
        └────────────────────────┘
                     │
                     ▼
        ┌────────────────────────┐
        │  Calculate Metrics     │
        │  • Total orders        │
        │  • Success rate        │
        │  • Failed count        │
        └────────────────────────┘
                     │
                     ▼
        ┌────────────────────────┐
        │  Check Blacklist       │
        │  Is Blacklisted?       │
        └────────────────────────┘
              │            │
             Yes          No
              │            │
              ▼            │
        ┌─────────┐       │
        │ REJECT  │       │
        │ (Block) │       │
        └─────────┘       │
                          ▼
        ┌────────────────────────┐
        │  Sufficient History?   │
        │  min 3 orders          │
        └────────────────────────┘
              │            │
             Yes          No
              │            │
              ▼            ▼
        ┌─────────┐  ┌─────────┐
        │ Check   │  │ Allow   │
        │ Success │  │ (New)   │
        │ Rate    │  └─────────┘
        └─────────┘
              │
         ┌────┴────┐
        Pass      Fail
         │          │
         ▼          ▼
   ┌─────────┐ ┌─────────┐
   │ Check   │ │ REJECT  │
   │ Failed  │ │ (Rate)  │
   │ Count   │ └─────────┘
   └─────────┘
         │
    ┌────┴────┐
   Pass      Fail
    │          │
    ▼          ▼
 Success   REJECT
           (Fails)
```

### COD Order History Metrics

| Metric | Calculation | Typical Threshold |
|--------|-------------|-------------------|
| Total Orders | Count of all COD orders | N/A (informational) |
| Successful Orders | Status = COMPLETED | N/A |
| Failed Orders | Status = FAILED/RETURNED | ≤ 3 |
| Success Rate | (Successful / Total) × 100 | ≥ 70% |
| Consecutive Failures | Recent failed orders in a row | ≤ 2 |
| Days Since Last Failure | Date calculation | ≥ 30 days |

### Order Status for History

| Status | Meaning | Impact on Success Rate |
|--------|---------|------------------------|
| COMPLETED | Successfully delivered and paid | Positive |
| PENDING | Not yet delivered | Not counted |
| DISPATCHED | In transit | Not counted |
| FAILED | Delivery failed, cash not collected | Negative |
| RETURNED | Returned to sender | Negative |
| CANCELLED | Customer cancelled before dispatch | Not counted |

### Risk Threshold Configuration

| Threshold | Default Value | Description |
|-----------|---------------|-------------|
| minimum_success_rate | 70% | Required success percentage |
| maximum_failed_count | 3 | Max failed deliveries allowed |
| minimum_orders_for_rate | 3 | Min orders before rate check |
| blacklist_threshold | 5 | Failures leading to blacklist |
| grace_period_days | 90 | Ignore failures older than this |

### Customer Segments

```
┌────────────────────────────────────────────┐
│            Customer Segments               │
├────────────────────────────────────────────┤
│                                            │
│  1. New Customer (0 orders)                │
│     Action: Allow with first-order limits  │
│     Risk: Medium (unproven)                │
│                                            │
│  2. Good Customer (rate ≥ 80%)             │
│     Action: Allow with standard limits     │
│     Risk: Low                              │
│                                            │
│  3. Average Customer (rate 70-79%)         │
│     Action: Allow with standard limits     │
│     Risk: Medium                           │
│                                            │
│  4. Poor Customer (rate < 70%)             │
│     Action: Reject COD                     │
│     Risk: High                             │
│                                            │
│  5. Blacklisted Customer                   │
│     Action: Reject COD                     │
│     Risk: Very High                        │
│                                            │
└────────────────────────────────────────────┘
```

### History Check Examples

```
Customer A: Established, Good Record
├── Total Orders: 15
├── Completed: 14
├── Failed: 1
├── Success Rate: 93.3%
├── Blacklisted: No
└── Result: PASS ✓

Customer B: New Customer
├── Total Orders: 0
├── Completed: 0
├── Failed: 0
├── Success Rate: N/A
├── Blacklisted: No
└── Result: PASS ✓ (New customer policy)

Customer C: Poor Track Record
├── Total Orders: 10
├── Completed: 6
├── Failed: 4
├── Success Rate: 60%
├── Blacklisted: No
└── Result: FAIL ✗ (Below 70% threshold)

Customer D: High Failure Count
├── Total Orders: 8
├── Completed: 5
├── Failed: 3
├── Success Rate: 62.5%
├── Consecutive Fails: 3
├── Blacklisted: No
└── Result: FAIL ✗ (Too many failures)

Customer E: Blacklisted
├── Total Orders: 12
├── Failed: 8
├── Blacklisted: Yes (too many failures)
└── Result: FAIL ✗ (Blacklisted)
```

### Suspicious Pattern Detection

| Pattern | Description | Action |
|---------|-------------|--------|
| Address Hopping | Different addresses for each order | Flag for review |
| High Cancellation | Frequent cancellations before dispatch | Reduce limits |
| Value Pattern | Always orders max allowed amount | Monitor closely |
| Timing Pattern | Orders only during sale periods | Low risk (normal) |
| Return Pattern | High return rate after delivery | Flag for review |

### Error Messages (Privacy-Conscious)

| Internal Reason | User Message | Rationale |
|-----------------|--------------|-----------|
| Low success rate | "Payment method unavailable" | Don't reveal metrics |
| Too many failures | "Please use alternative payment method" | Generic |
| Blacklisted | "Please contact customer support" | Don't reveal blacklist |
| Suspicious pattern | "Payment method unavailable" | Security |

### CheckResult Metadata (Internal Only)

| Key | Value | Exposed to Frontend |
|-----|-------|---------------------|
| total_orders | int | No |
| success_rate | float | No |
| failed_count | int | No |
| blacklisted | bool | No |
| risk_level | str | No |
| is_new_customer | bool | Yes (info) |

### Blacklist Management

| Trigger | Action | Duration |
|---------|--------|----------|
| 5+ failed COD orders | Auto-blacklist | Permanent |
| 3 consecutive failures | Temporary restriction | 60 days |
| Fraud pattern detected | Immediate blacklist | Permanent |
| Admin action | Manual blacklist | Admin-defined |
| Appeal approved | Remove from blacklist | Immediate |

### New Customer Policy

| Aspect | Policy | Rationale |
|--------|--------|-----------|
| Eligibility | Allow COD | Give chance |
| Limits | Apply first_order_limit | Reduce risk |
| Verification | Require OTP | Verify phone |
| Monitoring | Flag for close watch | Track behavior |

### Expected Outcome
- Comprehensive customer history evaluation within eligibility checker
- Risk-based decision making using success rate and failure count
- Blacklist enforcement for high-risk customers
- Appropriate handling of new customers
- Privacy-conscious error messaging
- Metadata for internal risk analysis

### Verification Checklist
- [ ] check_customer_history method created
- [ ] Order history queried for customer (COD orders only)
- [ ] Success rate calculated correctly
- [ ] Failed delivery count tracked
- [ ] Blacklist status checked
- [ ] Risk thresholds loaded from configuration
- [ ] Success rate compared against threshold
- [ ] Failed count compared against threshold
- [ ] New customer handling implemented
- [ ] Error messages are generic (privacy-focused)
- [ ] CheckResult includes internal metadata
- [ ] Logging implemented for history checks
- [ ] Suspicious patterns detected (optional)

---

## Task 24: Create COD Fee Calculation

### Overview
Implement the COD fee calculation system that determines the service charge applied to Cash on Delivery orders. COD fees compensate merchants for the additional risk, handling, and reconciliation costs associated with manual cash collection. The system supports two fee types: flat fees (fixed amount) and percentage-based fees (portion of order total), configured per tenant.

### Dependencies
- Task 17: Create CODProcessor Class

### Instructions

1. **Create fee calculator module**
   - Create `fee_calculator.py` in `processors/cod/` directory
   - Define `CODFeeCalculator` class
   - Set up initialization with configuration

2. **Load fee configuration**
   - Accept CODConfig in constructor
   - Extract `fee_type` field (FLAT or PERCENTAGE)
   - Extract `fee_amount` field (amount or percentage value)
   - Validate configuration values

3. **Create main calculation method**
   - Method name: `calculate_fee`
   - Parameters: order_amount (Decimal)
   - Return type: Decimal (calculated fee)
   - Handle both fee types in single method

4. **Implement flat fee calculation**
   - If fee_type == FeeType.FLAT
   - Return fee_amount directly
   - No calculation needed
   - Example: LKR 250 regardless of order amount

5. **Implement percentage fee calculation**
   - If fee_type == FeeType.PERCENTAGE
   - Calculate: (order_amount × fee_amount) / 100
   - Round to 2 decimal places
   - Example: 5% of LKR 10,000 = LKR 500

6. **Apply minimum and maximum fee limits (optional)**
   - Load min_fee and max_fee from config (if present)
   - For percentage fees, ensure result ≥ min_fee
   - For percentage fees, ensure result ≤ max_fee
   - This prevents very low or very high fees

7. **Handle zero or negative amounts**
   - If order_amount ≤ 0, return 0
   - Log warning about invalid amount
   - Don't charge fee on invalid orders

8. **Add fee transparency method**
   - Create `explain_fee` method
   - Return human-readable explanation
   - Example: "COD Fee: LKR 250 (Flat)" or "COD Fee: LKR 500 (5% of order)"
   - Used for customer communication

9. **Create fee validation method**
   - Validate COD configuration is valid
   - Check fee_type is FLAT or PERCENTAGE
   - Check fee_amount > 0
   - Raise exception if invalid

10. **Log fee calculations**
    - Log order amount and calculated fee
    - Track fee type used
    - Monitor fee revenue for analytics
    - Audit trail for financial records

### Fee Calculator Architecture

```
┌────────────────────────────────────────┐
│       CODFeeCalculator Class           │
├────────────────────────────────────────┤
│                                        │
│  Attributes:                           │
│  • config: CODConfig                   │
│  • fee_type: FeeType (FLAT/PERCENTAGE) │
│  • fee_amount: Decimal                 │
│  • min_fee: Decimal (optional)         │
│  • max_fee: Decimal (optional)         │
│                                        │
│  Methods:                              │
│  • calculate_fee(order_amount)         │
│  • explain_fee(order_amount)           │
│  • validate_config()                   │
│  • _calculate_flat_fee()               │
│  • _calculate_percentage_fee(amount)   │
│  • _apply_fee_limits(fee)              │
│                                        │
└────────────────────────────────────────┘
```

### Fee Type Configuration

| Fee Type | Description | Configuration | Example |
|----------|-------------|---------------|---------|
| FLAT | Fixed amount per order | fee_amount = 250.00 | LKR 250 per order |
| PERCENTAGE | Percentage of order total | fee_amount = 5.0 | 5% of order amount |

### Fee Calculation Logic

```
              Order Amount
                   │
                   ▼
        ┌──────────────────┐
        │  Load CODConfig  │
        │  fee_type        │
        │  fee_amount      │
        └──────────────────┘
                   │
            ┌──────┴──────┐
            │             │
         FLAT       PERCENTAGE
            │             │
            ▼             ▼
    ┌──────────┐  ┌──────────────┐
    │ Return   │  │ Calculate    │
    │ fee_amt  │  │ amount × %   │
    └──────────┘  └──────────────┘
            │             │
            └──────┬──────┘
                   ▼
        ┌──────────────────┐
        │  Apply Limits?   │
        │  min_fee, max_fee│
        └──────────────────┘
                   │
                   ▼
        ┌──────────────────┐
        │  Return Final Fee│
        └──────────────────┘
```

### Calculation Examples

```
Configuration: FLAT Fee
├── fee_type: FLAT
├── fee_amount: 250.00 LKR
│
├── Order 1: 5,000 LKR
│   └── COD Fee: 250 LKR (flat)
│
├── Order 2: 20,000 LKR
│   └── COD Fee: 250 LKR (flat)
│
└── Order 3: 100,000 LKR
    └── COD Fee: 250 LKR (flat)

---

Configuration: PERCENTAGE Fee
├── fee_type: PERCENTAGE
├── fee_amount: 5.0 (5%)
│
├── Order 1: 5,000 LKR
│   └── COD Fee: 250 LKR (5% of 5,000)
│
├── Order 2: 20,000 LKR
│   └── COD Fee: 1,000 LKR (5% of 20,000)
│
└── Order 3: 100,000 LKR
    └── COD Fee: 5,000 LKR (5% of 100,000)

---

Configuration: PERCENTAGE with Limits
├── fee_type: PERCENTAGE
├── fee_amount: 5.0 (5%)
├── min_fee: 200 LKR
├── max_fee: 1,000 LKR
│
├── Order 1: 2,000 LKR
│   ├── Calculated: 100 LKR (5%)
│   └── Applied: 200 LKR (min_fee)
│
├── Order 2: 10,000 LKR
│   ├── Calculated: 500 LKR (5%)
│   └── Applied: 500 LKR (within limits)
│
└── Order 3: 30,000 LKR
    ├── Calculated: 1,500 LKR (5%)
    └── Applied: 1,000 LKR (max_fee)
```

### Fee Limits (Optional Configuration)

| Limit | Purpose | When to Use |
|-------|---------|-------------|
| min_fee | Ensure minimum revenue | For percentage fees on small orders |
| max_fee | Cap maximum charge | For percentage fees on large orders |
| Combined | Balance fairness and revenue | Most percentage configurations |

### Fee Transparency

| Method | Output | Usage |
|--------|--------|-------|
| calculate_fee | Decimal value | Internal processing |
| explain_fee | Human-readable string | Customer display |
| Example | "COD Fee: LKR 500 (5%)" | Order summary |

### Fee Integration in Payment Flow

```
Order Total: 10,000 LKR
      │
      ▼
┌──────────────────┐
│ Calculate COD Fee│
│ Fee: 5% = 500 LKR│
└──────────────────┘
      │
      ▼
┌──────────────────┐
│ Add Fee to Total │
│ New Total: 10,500│
└──────────────────┘
      │
      ▼
┌──────────────────┐
│ Create Transaction
│ amount: 10,000   │
│ cod_fee: 500     │
│ total: 10,500    │
└──────────────────┘
```

### Configuration Validation

| Validation Rule | Check | Error if Fails |
|-----------------|-------|----------------|
| Fee type present | fee_type in [FLAT, PERCENTAGE] | "Invalid fee type" |
| Fee amount positive | fee_amount > 0 | "Fee must be positive" |
| Percentage range | 0 < fee_amount ≤ 100 | "Invalid percentage" |
| Min ≤ Max | min_fee ≤ max_fee | "Min exceeds max" |

### Edge Cases

| Edge Case | Behavior | Rationale |
|-----------|----------|-----------|
| Order amount = 0 | Return fee = 0 | No fee on invalid order |
| Negative amount | Return fee = 0 | Invalid order |
| Percentage > 100% | Allow but log warning | May be intentional |
| Min fee > Max fee | Raise error | Configuration error |
| No fee configured | Raise error | Must have fee |

### Expected Outcome
- Functional COD fee calculator supporting flat and percentage fees
- Accurate calculation based on order amount and fee type
- Optional min/max fee limit application
- Fee explanation for customer transparency
- Configuration validation to prevent errors
- Proper handling of edge cases

### Verification Checklist
- [ ] CODFeeCalculator class created in `fee_calculator.py`
- [ ] Constructor loads CODConfig (fee_type, fee_amount)
- [ ] calculate_fee method implemented
- [ ] Flat fee calculation returns fee_amount directly
- [ ] Percentage fee calculation: (amount × percentage) / 100
- [ ] Percentage result rounded to 2 decimal places
- [ ] Optional min_fee and max_fee applied if configured
- [ ] Zero/negative order amount returns 0 fee
- [ ] explain_fee method provides human-readable output
- [ ] Configuration validation implemented
- [ ] Edge cases handled gracefully
- [ ] Logging implemented for fee calculations

---

## Summary

This document established the CODProcessor foundation and comprehensive eligibility verification system. The processor extends the PaymentProcessor abstract base class, integrates with the payment factory, and implements initiate_payment with multi-layered checks including zone availability, order amount limits, customer history evaluation, and dynamic fee calculation.

### Completed Tasks
1. ✓ Created CODProcessor class extending PaymentProcessor ABC
2. ✓ Registered processor with ProcessorFactory for gateway=COD
3. ✓ Implemented initiate_payment method orchestrating COD flow
4. ✓ Created comprehensive eligibility checker framework
5. ✓ Implemented zone-based COD availability verification
6. ✓ Implemented order amount validation with multi-tier limits
7. ✓ Implemented customer history evaluation with risk analysis
8. ✓ Created COD fee calculator supporting flat and percentage fees

### Next Steps
Proceed to [02_Tasks-25-32_Payment-Status-Verify.md](02_Tasks-25-32_Payment-Status-Verify.md) to implement payment verification, status transitions, and refund handling for the COD payment lifecycle.
