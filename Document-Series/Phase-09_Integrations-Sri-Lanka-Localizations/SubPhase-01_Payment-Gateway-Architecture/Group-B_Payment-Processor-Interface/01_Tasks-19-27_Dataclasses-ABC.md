# Tasks 19-27: Dataclasses and Abstract Base Class

> **Phase:** 09 - Integrations & Sri Lanka Localizations  
> **SubPhase:** 01 - Payment Gateway Architecture  
> **Group:** B - Payment Processor Interface  
> **Document:** 01 of 02  
> **Tasks Covered:** 19, 20, 21, 22, 23, 24, 25, 26, 27

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Group:** [Group-A_Payment-Models-Core](../Group-A_Payment-Models-Core/)
- **→ Next Document:** [02_Tasks-28-34_Factory-Exceptions-Verify.md](02_Tasks-28-34_Factory-Exceptions-Verify.md)

---

## Document Overview

This document covers the creation of dataclasses for payment processing results and the abstract base class for payment processors. It establishes the foundational interface that all payment gateway processors will implement, ensuring consistent behavior across different payment providers (PayHere, WebXPay, KOKO, etc.).

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 19 | Create PaymentResult Dataclass | Medium | 25 min |
| 20 | Create PaymentIntent Dataclass | Medium | 30 min |
| 21 | Create RefundResult Dataclass | Medium | 25 min |
| 22 | Create PaymentProcessor ABC | High | 45 min |
| 23 | Create initiate_payment Method | Medium | 30 min |
| 24 | Create verify_payment Method | Medium | 35 min |
| 25 | Create process_refund Method | Medium | 30 min |
| 26 | Create get_status Method | Low | 20 min |
| 27 | Create supports_recurring Method | Low | 15 min |

---

## Task 19: Create PaymentResult Dataclass

### Overview
Create the PaymentResult dataclass to standardize payment processing results across all payment gateways. This dataclass will encapsulate the outcome of payment operations with consistent fields for success status, transaction details, and error handling.

### Dependencies
- Task 18 (Verify Payment Models) must be complete
- Python dataclasses module available
- Payment models are properly verified

### Instructions

1. **Navigate to payment app**
   - Go to `backend/apps/payment/` directory
   - Create `interfaces.py` file for interface definitions

2. **Import required modules**
   - Import dataclass decorator from dataclasses module
   - Import Optional, Dict, Any from typing module
   - Import Decimal for precise monetary calculations
   - Import datetime for timestamp handling

3. **Design PaymentResult structure**
   - success: Boolean field indicating operation success
   - transaction_id: Optional string for gateway transaction reference
   - amount: Decimal field for payment amount
   - currency: String field (default "LKR")
   - status: String field for payment status
   - gateway_response: Dictionary for raw gateway response
   - error_message: Optional string for error details
   - processing_fee: Optional Decimal for gateway fees
   - created_at: datetime field for result timestamp

4. **Add validation constraints**
   - Ensure amount is positive for successful transactions
   - Validate currency format (ISO 4217 standard)
   - Ensure transaction_id exists for successful payments
   - Validate status against known payment statuses

5. **Configure Sri Lankan specifics**
   - Default currency to "LKR"
   - Include support for mobile payment references
   - Handle local bank transaction codes
   - Support KOKO and WebXPay response formats

6. **Add utility methods**
   - is_successful property for quick status check
   - get_display_amount method for currency formatting
   - to_dict method for serialization
   - from_gateway_response class method

---

## Task 20: Create PaymentIntent Dataclass

### Overview
Create the PaymentIntent dataclass to standardize payment initiation requests across all payment gateways. This represents the intent to make a payment before it's processed, containing all necessary information for gateway integration.

### Dependencies
- Task 19 (PaymentResult Dataclass) must be complete
- Payment models structure is established

### Instructions

1. **Add to interfaces.py file**
   - Continue in the same file created in Task 19
   - Import UUID for intent identification

2. **Design PaymentIntent structure**
   - intent_id: UUID field for unique intent identification
   - order_id: String field linking to order
   - amount: Decimal field for payment amount
   - currency: String field (default "LKR")
   - payment_method: String field for gateway type
   - customer_info: Dictionary for customer details
   - merchant_id: String field for tenant identification
   - callback_url: String field for success redirect
   - cancel_url: String field for cancellation redirect
   - webhook_url: String field for gateway callbacks
   - metadata: Dictionary for additional information
   - expires_at: Optional datetime for intent expiration

3. **Add customer information structure**
   - Define expected customer_info fields
   - Include name, email, phone validation
   - Support Sri Lankan phone format (+94 XX XXX XXXX)
   - Handle address information for local delivery

4. **Configure gateway-specific fields**
   - PayHere: merchant_id, merchant_secret reference
   - WebXPay: api_key, signature validation
   - KOKO: partner_id, callback configuration
   - COD: delivery address requirements

5. **Add validation methods**
   - validate_amount for positive values
   - validate_currency for supported currencies
   - validate_urls for proper URL format
   - validate_customer_info for required fields

6. **Include utility functions**
   - generate_intent_id class method
   - is_expired property check
   - to_gateway_request method
   - validate method for complete validation

---

## Task 21: Create RefundResult Dataclass

### Overview
Create the RefundResult dataclass to standardize refund processing results across all payment gateways. This ensures consistent refund handling regardless of the payment provider used.

### Dependencies
- Task 19 (PaymentResult Dataclass) must be complete
- Understanding of refund workflow requirements

### Instructions

1. **Add to interfaces.py file**
   - Continue in the same file
   - Consider refund-specific requirements

2. **Design RefundResult structure**
   - success: Boolean field for refund success status
   - refund_id: String field for gateway refund reference
   - original_transaction_id: String for original payment reference
   - refund_amount: Decimal field for refunded amount
   - currency: String field (default "LKR")
   - refund_status: String field for current refund status
   - gateway_response: Dictionary for raw gateway response
   - processing_fee: Optional Decimal for refund processing fee
   - estimated_settlement: Optional datetime for fund settlement
   - reason: Optional string for refund reason
   - created_at: datetime field for refund timestamp

3. **Configure refund status types**
   - pending: Refund initiated but not processed
   - processing: Refund being processed by gateway
   - completed: Refund successfully processed
   - failed: Refund processing failed
   - cancelled: Refund request cancelled

4. **Add validation constraints**
   - Ensure refund_amount is positive
   - Validate against original transaction amount
   - Check refund_id format per gateway requirements
   - Ensure original_transaction_id exists

5. **Handle Sri Lankan gateway specifics**
   - PayHere refund reference format
   - WebXPay refund processing timeline
   - KOKO partner refund procedures
   - Local bank refund settlement times

6. **Include utility methods**
   - is_successful property for quick status check
   - get_settlement_date method with business day calculation
   - to_dict method for serialization
   - calculate_net_refund method (amount minus fees)

---

## Task 22: Create PaymentProcessor ABC

### Overview
Create the abstract base class that defines the interface all payment gateway processors must implement. This ensures consistent behavior and method signatures across different payment providers while allowing for gateway-specific implementations.

### Dependencies
- Task 21 (RefundResult Dataclass) must be complete
- All dataclasses are properly defined
- ABC module understanding required

### Instructions

1. **Add to interfaces.py file**
   - Import ABC from abc module
   - Import abstractmethod decorator

2. **Design PaymentProcessor abstract class**
   - Inherit from ABC base class
   - Define consistent method signatures
   - Include proper type annotations
   - Document expected behavior for each method

3. **Define required abstract methods**
   - Each method must be marked with @abstractmethod
   - Include comprehensive type hints
   - Add detailed docstrings for implementation guidance
   - Specify expected exceptions

4. **Include gateway configuration**
   - gateway_name: String property for processor identification
   - is_enabled: Boolean property for availability status
   - supported_currencies: List of supported currency codes
   - supported_countries: List of supported country codes
   - configuration: Dict for gateway-specific settings

5. **Add validation requirements**
   - Each abstract method should specify validation requirements
   - Include parameter validation expectations
   - Define expected return value structure
   - Specify error handling requirements

6. **Configure Sri Lankan requirements**
   - Ensure compatibility with local banking systems
   - Include support for mobile payment methods
   - Handle local regulatory compliance requirements
   - Support multi-tenant configuration per gateway

7. **Add documentation standards**
   - Document expected implementation patterns
   - Include examples of proper usage
   - Specify testing requirements for implementations
   - Define configuration validation standards

---

## Task 23: Create initiate_payment Method

### Overview
Define the abstract initiate_payment method that all payment processors must implement. This method handles the initial payment request and returns the necessary information for payment processing.

### Dependencies
- Task 22 (PaymentProcessor ABC) must be complete
- PaymentIntent dataclass is properly defined

### Instructions

1. **Define method signature**
   - Method name: initiate_payment
   - Parameter: payment_intent (PaymentIntent)
   - Return type: PaymentResult
   - Mark as @abstractmethod

2. **Add comprehensive docstring**
   - Describe method purpose and behavior
   - Document parameter requirements
   - Explain return value structure
   - List possible exceptions

3. **Define parameter validation requirements**
   - Validate PaymentIntent completeness
   - Check amount and currency compatibility
   - Verify customer information requirements
   - Validate callback URLs format

4. **Specify expected return behavior**
   - Success case: Return PaymentResult with transaction details
   - Failure case: Return PaymentResult with error information
   - Include gateway-specific transaction reference
   - Provide redirect URLs when applicable

5. **Document gateway integration patterns**
   - Direct API call requirements
   - Redirect-based payment flow handling
   - Webhook configuration expectations
   - Security token/signature handling

6. **Include Sri Lankan gateway specifics**
   - PayHere: Include merchant verification steps
   - WebXPay: Handle API key authentication
   - KOKO: Configure partner callback settings
   - COD: Validate delivery address requirements

7. **Error handling specifications**
   - Network connectivity issues
   - Gateway authentication failures
   - Invalid payment amounts or currencies
   - Customer information validation errors

---

## Task 24: Create verify_payment Method

### Overview
Define the abstract verify_payment method for confirming payment status with the gateway. This method is crucial for ensuring payment integrity and handling gateway callbacks or status checks.

### Dependencies
- Task 22 (PaymentProcessor ABC) must be complete
- PaymentResult dataclass is properly defined

### Instructions

1. **Define method signature**
   - Method name: verify_payment
   - Parameter: transaction_id (str)
   - Return type: PaymentResult
   - Mark as @abstractmethod

2. **Add comprehensive docstring**
   - Explain payment verification purpose
   - Document transaction_id requirements
   - Describe return value expectations
   - List verification scenarios

3. **Define verification requirements**
   - Query gateway for transaction status
   - Validate transaction authenticity
   - Check payment completion status
   - Retrieve final payment amount and fees

4. **Specify return value standards**
   - Return current payment status
   - Include final amount and currency
   - Provide gateway response data
   - Include any processing fees

5. **Document verification patterns**
   - Real-time status checking
   - Webhook verification handling
   - Delayed payment confirmation
   - Failed payment detection

6. **Handle Sri Lankan gateway specifics**
   - PayHere: Status inquiry API integration
   - WebXPay: Payment confirmation endpoints
   - KOKO: Partner transaction verification
   - COD: Manual verification procedures

7. **Error handling requirements**
   - Transaction not found scenarios
   - Gateway communication failures
   - Authentication/authorization errors
   - Timeout handling for slow responses

---

## Task 25: Create process_refund Method

### Overview
Define the abstract process_refund method for handling refund requests across different payment gateways. This method ensures consistent refund processing regardless of the underlying payment provider.

### Dependencies
- Task 22 (PaymentProcessor ABC) must be complete
- RefundResult dataclass is properly defined

### Instructions

1. **Define method signature**
   - Method name: process_refund
   - Parameters: transaction_id (str), refund_amount (Decimal), reason (Optional[str])
   - Return type: RefundResult
   - Mark as @abstractmethod

2. **Add comprehensive docstring**
   - Document refund processing purpose
   - Explain parameter requirements and constraints
   - Describe refund workflow expectations
   - List possible refund outcomes

3. **Define refund validation requirements**
   - Validate original transaction exists and is refundable
   - Check refund amount against original payment
   - Verify refund eligibility (time limits, status)
   - Validate reason format if provided

4. **Specify refund processing patterns**
   - Full refund handling
   - Partial refund calculations
   - Multiple refund support
   - Refund fee calculations

5. **Document return value standards**
   - Return RefundResult with processing status
   - Include refund reference information
   - Provide estimated settlement timeline
   - Include any refund processing fees

6. **Handle Sri Lankan gateway specifics**
   - PayHere: Refund API integration requirements
   - WebXPay: Refund processing limitations
   - KOKO: Partner refund procedures
   - COD: Manual refund handling requirements

7. **Error handling specifications**
   - Invalid transaction references
   - Refund amount exceeds original payment
   - Gateway refund processing failures
   - Refund eligibility violations

---

## Task 26: Create get_status Method

### Overview
Define the abstract get_status method for checking current processor availability and configuration status. This method helps determine if a payment processor is operational and properly configured.

### Dependencies
- Task 22 (PaymentProcessor ABC) must be complete
- Understanding of processor status requirements

### Instructions

1. **Define method signature**
   - Method name: get_status
   - Parameters: None
   - Return type: Dict[str, Any]
   - Mark as @abstractmethod

2. **Add comprehensive docstring**
   - Document status checking purpose
   - Explain return value structure
   - Describe status check scenarios
   - List possible status indicators

3. **Define status information structure**
   - is_operational: Boolean for processor availability
   - configuration_valid: Boolean for setup validation
   - last_successful_transaction: Optional datetime
   - error_message: Optional string for issues
   - supported_features: List of available features

4. **Specify status check requirements**
   - Test gateway connectivity
   - Validate configuration parameters
   - Check authentication credentials
   - Verify webhook endpoints

5. **Document feature availability**
   - Payment initiation support
   - Refund processing capability
   - Recurring payment support
   - Webhook callback handling

6. **Handle Sri Lankan gateway specifics**
   - PayHere: API connectivity and merchant validation
   - WebXPay: Authentication and rate limit status
   - KOKO: Partner account verification
   - COD: Configuration validation only

7. **Include monitoring information**
   - Recent transaction success rates
   - Average processing times
   - Error frequency tracking
   - Performance metrics

---

## Task 27: Create supports_recurring Method

### Overview
Define the abstract supports_recurring method to indicate whether the payment processor supports recurring payment functionality. This method helps determine payment method availability for subscription-based services.

### Dependencies
- Task 22 (PaymentProcessor ABC) must be complete
- Understanding of recurring payment requirements

### Instructions

1. **Define method signature**
   - Method name: supports_recurring
   - Parameters: None
   - Return type: bool
   - Mark as @abstractmethod

2. **Add comprehensive docstring**
   - Document recurring payment support purpose
   - Explain return value meaning
   - Describe recurring payment capabilities
   - List implementation considerations

3. **Define recurring support criteria**
   - Token-based payment support
   - Subscription management capabilities
   - Automatic payment processing
   - Customer consent handling

4. **Specify implementation expectations**
   - Return True if gateway supports recurring payments
   - Return False for one-time payment only gateways
   - Consider regulatory compliance requirements
   - Include customer authorization requirements

5. **Document recurring payment features**
   - Payment token creation and storage
   - Scheduled payment processing
   - Subscription modification support
   - Customer notification requirements

6. **Handle Sri Lankan gateway specifics**
   - PayHere: Recurring payment API availability
   - WebXPay: Subscription service support
   - KOKO: Partner recurring payment capabilities
   - COD: Not applicable (return False)

7. **Include compliance considerations**
   - Sri Lankan banking regulations
   - Customer consent requirements
   - PCI compliance for token storage
   - Data protection regulations

---

## Summary

This document established the foundational dataclasses and abstract base class for the payment processor interface. The key accomplishments include:

### Completed Components
- PaymentResult dataclass for standardized payment outcomes
- PaymentIntent dataclass for payment initiation requests
- RefundResult dataclass for refund processing results
- PaymentProcessor abstract base class with consistent interface
- Five abstract methods defining processor contract

### Key Features Implemented
- Sri Lankan payment gateway compatibility
- Type-safe dataclass structures
- Comprehensive validation requirements
- Error handling specifications
- Gateway-specific configuration support

### Next Steps
The next document will implement the factory pattern for processor management, exception handling hierarchy, and interface verification procedures.

---

**Next:** [02_Tasks-28-34_Factory-Exceptions-Verify.md](02_Tasks-28-34_Factory-Exceptions-Verify.md)