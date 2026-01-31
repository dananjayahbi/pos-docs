# Tasks 35-44: Service Layer Implementation and Core Methods

> **Phase:** 09 - Integrations & Sri Lanka Localizations  
> **SubPhase:** 01 - Payment Gateway Architecture  
> **Group:** C - Payment Service Layer  
> **Document:** 01 of 02  
> **Tasks Covered:** 35, 36, 37, 38, 39, 40, 41, 42, 43, 44

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Group:** [Group-B_Payment-Processor-Interface](../Group-B_Payment-Processor-Interface/)
- **→ Next Document:** [02_Tasks-45-52_Validation-Events-Verify.md](02_Tasks-45-52_Validation-Events-Verify.md)

---

## Document Overview

This document covers the creation of the PaymentService class and its core methods for handling payment lifecycle operations. It establishes the high-level service layer that orchestrates payment processing using the processor interface while providing comprehensive logging, order integration, and transaction management.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 35 | Create PaymentService Class | Medium | 40 min |
| 36 | Create get_active_methods | Low | 25 min |
| 37 | Create initiate_payment Method | High | 60 min |
| 38 | Create Payment Logging | Medium | 35 min |
| 39 | Create verify_payment Method | High | 55 min |
| 40 | Create Update Order Status | Medium | 30 min |
| 41 | Create process_refund Method | High | 50 min |
| 42 | Create Partial Refund Logic | Medium | 35 min |
| 43 | Create get_transaction_status | Low | 20 min |
| 44 | Create Transaction History | Low | 25 min |

---

## Task 35: Create PaymentService Class

### Overview
Create the PaymentService class as the main entry point for all payment operations in the system. This service class will orchestrate payment processing by utilizing the payment processor interface while providing high-level business logic for payment handling.

### Dependencies
- Task 34 (Verify Processor Interface) must be complete
- Payment processor interface is fully functional
- Payment models are properly implemented

### Instructions

1. **Create services.py file**
   - Navigate to `backend/apps/payment/` directory
   - Create `services.py` file for service layer implementation
   - Import necessary dependencies and modules

2. **Import required modules**
   - Import PaymentProcessorFactory from factory module
   - Import payment models from models module
   - Import exceptions from exceptions module
   - Import logging for service operation tracking
   - Import Django timezone utilities for timestamp handling

3. **Design PaymentService class structure**
   - Create main PaymentService class
   - Add initialization with tenant context
   - Include factory instance for processor management
   - Add logging configuration for service operations

4. **Initialize service attributes**
   - tenant: Current tenant context for multi-tenancy
   - factory: PaymentProcessorFactory instance
   - logger: Logging instance for service operations
   - default_currency: Default to "LKR" for Sri Lankan context

5. **Add service initialization method**
   - Accept tenant parameter in __init__
   - Initialize processor factory instance
   - Set up service-specific logging
   - Configure tenant-specific settings

6. **Design service configuration**
   - Load tenant-specific payment settings
   - Configure supported payment methods
   - Set up default gateway preferences
   - Initialize service state tracking

7. **Add utility methods**
   - get_tenant_config: Retrieve tenant payment configuration
   - is_gateway_enabled: Check if specific gateway is active
   - get_default_gateway: Return tenant's preferred payment gateway
   - log_service_activity: Centralized logging for service operations

8. **Include Sri Lankan business logic**
   - Configure LKR as default currency
   - Set up local payment method preferences
   - Include regulatory compliance settings
   - Handle local business hour constraints

9. **Add error handling framework**
   - Define service-level exception handling
   - Include retry mechanisms for transient failures
   - Add comprehensive error logging
   - Implement graceful degradation strategies

10. **Configure service monitoring**
    - Add performance metrics tracking
    - Include payment success rate monitoring
    - Set up service health checks
    - Enable transaction volume tracking

---

## Task 36: Create get_active_methods Method

### Overview
Implement the get_active_methods method to retrieve all active payment methods available for the current tenant. This method provides the foundation for payment method selection and availability checking.

### Dependencies
- Task 35 (PaymentService Class) must be complete
- PaymentMethod model is properly implemented

### Instructions

1. **Add to PaymentService class**
   - Implement get_active_methods method
   - Include proper type annotations
   - Add comprehensive docstring

2. **Define method signature**
   - Method name: get_active_methods
   - Parameters: include_disabled (bool, default=False)
   - Return type: List[PaymentMethod]
   - Include optional filtering parameters

3. **Implement method logic**
   - Query PaymentMethod model for tenant-specific methods
   - Filter by is_enabled status
   - Include gateway availability checking
   - Sort by priority or preference order

4. **Add availability validation**
   - Check gateway processor registration
   - Validate gateway configuration completeness
   - Test gateway connectivity status
   - Filter out misconfigured methods

5. **Include business rule filtering**
   - Apply tenant-specific method restrictions
   - Check minimum/maximum amount limits
   - Validate currency support for each method
   - Apply geographical or regulatory restrictions

6. **Add Sri Lankan payment methods**
   - Prioritize local payment methods (PayHere, WebXPay)
   - Include mobile payment options (KOKO)
   - Support cash on delivery for local orders
   - Handle bank transfer methods for local banks

7. **Implement caching strategy**
   - Cache active methods list for performance
   - Set appropriate cache expiration
   - Handle cache invalidation on configuration changes
   - Include cache warming for frequently accessed data

8. **Add method metadata**
   - Include payment method descriptions
   - Add fee information for each method
   - Include processing time estimates
   - Provide method availability schedules

9. **Include error handling**
   - Handle database connection failures
   - Manage configuration validation errors
   - Deal with gateway connectivity issues
   - Provide fallback method selection

---

## Task 37: Create initiate_payment Method

### Overview
Implement the initiate_payment method as the primary entry point for starting payment processing. This method orchestrates the entire payment initiation process including processor selection, validation, and transaction creation.

### Dependencies
- Task 35 (PaymentService Class) must be complete
- Payment processor interface is available

### Instructions

1. **Add to PaymentService class**
   - Implement initiate_payment method
   - Include comprehensive parameter validation
   - Add detailed docstring with usage examples

2. **Define method signature**
   - Method name: initiate_payment
   - Parameters: order_id (str), payment_method_id (int), customer_info (Dict)
   - Return type: PaymentResult
   - Include optional parameters for customization

3. **Implement payment initialization**
   - Validate order existence and status
   - Check order amount and currency
   - Verify payment method availability
   - Create PaymentIntent with order details

4. **Add processor selection logic**
   - Retrieve payment method configuration
   - Get appropriate processor from factory
   - Validate processor availability
   - Handle processor fallback scenarios

5. **Create payment transaction record**
   - Create new PaymentTransaction instance
   - Link to order and payment method
   - Set initial status to 'pending'
   - Include customer and merchant information

6. **Implement gateway communication**
   - Call processor initiate_payment method
   - Handle gateway-specific requirements
   - Process gateway response
   - Update transaction with gateway reference

7. **Add business logic validation**
   - Validate order payment eligibility
   - Check for duplicate payment attempts
   - Verify customer information completeness
   - Apply payment amount limits and restrictions

8. **Include Sri Lankan specific logic**
   - Handle LKR currency formatting
   - Apply local tax calculations
   - Include delivery address validation for COD
   - Handle mobile payment provider requirements

9. **Implement transaction state management**
   - Update transaction status based on gateway response
   - Handle redirect-based payment flows
   - Manage payment session information
   - Track payment attempt history

10. **Add comprehensive error handling**
    - Handle order validation failures
    - Manage gateway communication errors
    - Deal with configuration issues
    - Provide detailed error messages for debugging

---

## Task 38: Create Payment Logging

### Overview
Implement comprehensive payment logging throughout the payment service to ensure full audit trail and debugging capabilities. This logging system will track all payment activities for compliance and troubleshooting purposes.

### Dependencies
- Task 37 (initiate_payment method) must be complete
- Logging framework is configured

### Instructions

1. **Configure logging structure**
   - Set up payment-specific logger instance
   - Configure log levels for different operations
   - Include structured logging for better parsing
   - Set up log rotation and retention policies

2. **Design log message format**
   - Include timestamp and tenant information
   - Add transaction ID and order reference
   - Include customer information (sanitized)
   - Add gateway and method information

3. **Implement payment initiation logging**
   - Log payment request details
   - Include order and customer information
   - Record selected payment method
   - Log gateway communication attempts

4. **Add transaction lifecycle logging**
   - Log transaction creation events
   - Record status change events
   - Include gateway response logging
   - Track payment completion or failure

5. **Include security and compliance logging**
   - Log authentication and authorization events
   - Record sensitive data access (sanitized)
   - Include fraud detection triggers
   - Log compliance check results

6. **Add performance logging**
   - Track payment processing times
   - Log gateway response times
   - Include database operation performance
   - Record service method execution times

7. **Implement error and exception logging**
   - Log all exception occurrences with stack traces
   - Include context information for debugging
   - Record error recovery attempts
   - Log escalation triggers

8. **Add Sri Lankan compliance logging**
   - Log regulatory compliance checks
   - Record local tax calculations
   - Include banking regulation compliance
   - Log mobile payment provider interactions

9. **Configure log aggregation**
   - Set up centralized logging for multi-tenant system
   - Include tenant-specific log segregation
   - Configure log search and filtering
   - Set up alerting for critical errors

10. **Implement log security**
    - Sanitize sensitive information (credit card numbers, etc.)
    - Encrypt logs containing sensitive data
    - Control access to payment logs
    - Include log integrity verification

---

## Task 39: Create verify_payment Method

### Overview
Implement the verify_payment method to confirm payment status with gateways and update transaction records. This method handles payment verification, status updates, and order processing based on payment outcomes.

### Dependencies
- Task 35 (PaymentService Class) must be complete
- Payment logging system is functional

### Instructions

1. **Add to PaymentService class**
   - Implement verify_payment method
   - Include comprehensive parameter validation
   - Add detailed error handling

2. **Define method signature**
   - Method name: verify_payment
   - Parameters: transaction_id (str), gateway_reference (Optional[str])
   - Return type: PaymentResult
   - Include verification source parameter

3. **Implement transaction lookup**
   - Retrieve PaymentTransaction by ID or gateway reference
   - Validate transaction existence and status
   - Check transaction verification eligibility
   - Handle concurrent verification attempts

4. **Add processor verification**
   - Get appropriate processor based on transaction
   - Call processor verify_payment method
   - Handle gateway-specific verification requirements
   - Process and validate gateway response

5. **Implement status update logic**
   - Compare gateway status with current transaction status
   - Update transaction status based on verification result
   - Handle status transition validation
   - Track status change history

6. **Add payment confirmation handling**
   - Process successful payment confirmations
   - Update transaction amounts with final values
   - Record gateway fees and charges
   - Handle currency conversion if applicable

7. **Include business logic processing**
   - Trigger order fulfillment for successful payments
   - Handle partial payment scenarios
   - Process payment completion workflows
   - Update inventory and stock levels

8. **Implement failure handling**
   - Process failed payment notifications
   - Update transaction with failure reasons
   - Trigger payment retry workflows if applicable
   - Handle fraud detection notifications

9. **Add Sri Lankan gateway specifics**
   - Handle PayHere verification responses
   - Process WebXPay confirmation formats
   - Manage KOKO mobile payment confirmations
   - Validate local bank transfer confirmations

10. **Include comprehensive logging**
    - Log verification request details
    - Record gateway response information
    - Track status change events
    - Log business logic processing results

---

## Task 40: Create Update Order Status Method

### Overview
Implement the order status update functionality that synchronizes order status with payment verification results. This method ensures proper order lifecycle management based on payment outcomes.

### Dependencies
- Task 39 (verify_payment method) must be complete
- Order model integration is available

### Instructions

1. **Add to PaymentService class**
   - Implement update_order_status method
   - Include order status transition logic
   - Add comprehensive validation

2. **Define method signature**
   - Method name: update_order_status
   - Parameters: order_id (str), payment_status (str), transaction_result (PaymentResult)
   - Return type: bool
   - Include optional status transition parameters

3. **Implement order status mapping**
   - Map payment statuses to order statuses
   - Define valid status transitions
   - Handle edge cases and exceptions
   - Include tenant-specific status customization

4. **Add status transition validation**
   - Validate current order status before update
   - Check status transition permissions
   - Ensure business rule compliance
   - Handle concurrent status update attempts

5. **Implement payment success processing**
   - Update order to 'confirmed' or 'paid' status
   - Trigger inventory reservation
   - Initialize fulfillment workflows
   - Send customer confirmation notifications

6. **Add payment failure processing**
   - Revert order to 'pending payment' status
   - Release any reserved inventory
   - Cancel time-sensitive reservations
   - Trigger payment retry workflows if applicable

7. **Include partial payment handling**
   - Update order with partial payment information
   - Calculate remaining payment amount
   - Handle partial fulfillment scenarios
   - Manage payment installment tracking

8. **Add business workflow integration**
   - Trigger post-payment business processes
   - Update customer account information
   - Process loyalty points or rewards
   - Handle subscription activation if applicable

9. **Include Sri Lankan business logic**
   - Handle COD order confirmation
   - Process local delivery arrangements
   - Update tax and regulatory compliance records
   - Manage local banking reconciliation

10. **Implement audit and logging**
    - Log all order status changes
    - Record status transition reasons
    - Track user/system initiating changes
    - Include timestamp and context information

---

## Task 41: Create process_refund Method

### Overview
Implement the process_refund method to handle refund requests through appropriate payment gateways. This method manages the complete refund lifecycle including validation, processing, and status tracking.

### Dependencies
- Task 35 (PaymentService Class) must be complete
- Refund models are properly implemented

### Instructions

1. **Add to PaymentService class**
   - Implement process_refund method
   - Include comprehensive refund validation
   - Add detailed error handling and logging

2. **Define method signature**
   - Method name: process_refund
   - Parameters: transaction_id (str), refund_amount (Decimal), reason (str)
   - Return type: RefundResult
   - Include optional parameters for refund customization

3. **Implement refund eligibility validation**
   - Verify transaction exists and is refundable
   - Check refund amount against original payment
   - Validate refund timing constraints
   - Ensure sufficient refundable balance

4. **Add business rule validation**
   - Check tenant refund policies
   - Validate refund reason requirements
   - Apply refund time limits
   - Handle partial refund restrictions

5. **Create refund transaction record**
   - Create new PaymentRefund instance
   - Link to original transaction
   - Set initial refund status
   - Include refund reason and requester information

6. **Implement gateway refund processing**
   - Get appropriate processor from factory
   - Call processor process_refund method
   - Handle gateway-specific refund requirements
   - Process gateway refund response

7. **Add refund status management**
   - Update refund status based on gateway response
   - Handle asynchronous refund processing
   - Track refund processing timeline
   - Manage refund completion notifications

8. **Include order impact handling**
   - Update original order refund information
   - Adjust order totals and balances
   - Handle order status changes due to refunds
   - Process inventory returns if applicable

9. **Add Sri Lankan gateway specifics**
   - Handle PayHere refund API requirements
   - Process WebXPay refund procedures
   - Manage KOKO mobile payment refunds
   - Handle local bank refund processes

10. **Implement comprehensive logging**
    - Log refund request details
    - Record refund processing steps
    - Track gateway communication
    - Log refund completion or failure events

---

## Task 42: Create Partial Refund Logic

### Overview
Implement sophisticated partial refund logic that handles complex refund scenarios including multiple partial refunds, refund calculations, and balance tracking. This ensures accurate financial reconciliation for partial refund scenarios.

### Dependencies
- Task 41 (process_refund method) must be complete
- Refund calculation requirements are understood

### Instructions

1. **Add to PaymentService class**
   - Extend process_refund method with partial refund logic
   - Add helper methods for refund calculations
   - Include refund balance tracking

2. **Implement refund amount validation**
   - Calculate total previous refunds for transaction
   - Validate new refund amount against remaining balance
   - Check minimum and maximum refund limits
   - Handle currency precision and rounding

3. **Add refund balance calculations**
   - Calculate original payment amount
   - Sum all previous refunds
   - Determine remaining refundable amount
   - Handle fee adjustments and calculations

4. **Implement multiple refund tracking**
   - Track individual refund instances
   - Maintain running refund total
   - Handle refund sequence numbering
   - Support refund reference linking

5. **Add refund fee calculations**
   - Calculate refund processing fees
   - Handle fee distribution across partial refunds
   - Apply tenant-specific fee structures
   - Include gateway-specific fee handling

6. **Include complex refund scenarios**
   - Handle refunds with different reasons
   - Support refunds to different payment methods
   - Manage refunds across order line items
   - Handle promotional discount refund calculations

7. **Implement refund timeline management**
   - Track refund processing timelines
   - Handle delayed refund confirmations
   - Manage refund settlement dates
   - Include business day calculations for Sri Lankan banks

8. **Add refund reconciliation**
   - Validate refund totals against payments
   - Handle refund discrepancy detection
   - Include automatic reconciliation checks
   - Generate refund summary reports

9. **Include Sri Lankan specific logic**
   - Handle LKR currency precision (2 decimal places)
   - Apply local tax refund calculations
   - Include banking settlement timeframes
   - Handle mobile payment refund limitations

10. **Add comprehensive reporting**
    - Generate partial refund summaries
    - Track refund patterns and analytics
    - Include refund performance metrics
    - Support audit and compliance reporting

---

## Task 43: Create get_transaction_status Method

### Overview
Implement the get_transaction_status method to provide real-time transaction status information. This method serves as the primary interface for checking transaction status across all payment processing stages.

### Dependencies
- Task 35 (PaymentService Class) must be complete
- Transaction status tracking is implemented

### Instructions

1. **Add to PaymentService class**
   - Implement get_transaction_status method
   - Include comprehensive status information
   - Add caching for performance optimization

2. **Define method signature**
   - Method name: get_transaction_status
   - Parameters: transaction_id (str), include_details (bool, default=False)
   - Return type: Dict[str, Any]
   - Include optional parameters for detail level

3. **Implement status retrieval**
   - Query PaymentTransaction by ID
   - Include related refund information
   - Add gateway status synchronization
   - Handle transaction not found scenarios

4. **Add comprehensive status information**
   - Current transaction status
   - Payment amount and currency
   - Gateway reference and details
   - Customer and merchant information
   - Processing timestamps

5. **Include real-time gateway status**
   - Check current status with payment gateway
   - Compare local status with gateway status
   - Handle status synchronization discrepancies
   - Update local status if necessary

6. **Add transaction timeline**
   - Include transaction creation timestamp
   - Add status change history
   - Include processing milestones
   - Provide estimated completion times

7. **Include financial information**
   - Payment amount and currency
   - Gateway fees and charges
   - Refund amounts and balance
   - Net transaction amount

8. **Add related information**
   - Order details and status
   - Customer payment history
   - Related transactions (refunds, etc.)
   - Payment method information

9. **Include Sri Lankan specifics**
   - LKR currency formatting
   - Local business hour considerations
   - Banking settlement information
   - Mobile payment provider details

10. **Implement caching strategy**
    - Cache frequently accessed status information
    - Set appropriate cache expiration times
    - Handle cache invalidation on status changes
    - Include cache warming for active transactions

---

## Task 44: Create Transaction History Method

### Overview
Implement the transaction history method to provide comprehensive transaction tracking and reporting capabilities. This method supports both customer-facing transaction history and administrative transaction management.

### Dependencies
- Task 35 (PaymentService Class) must be complete
- Transaction data model is properly structured

### Instructions

1. **Add to PaymentService class**
   - Implement get_transaction_history method
   - Include flexible filtering and sorting options
   - Add pagination support for large datasets

2. **Define method signature**
   - Method name: get_transaction_history
   - Parameters: customer_id (Optional[str]), order_id (Optional[str]), filters (Dict)
   - Return type: List[Dict[str, Any]]
   - Include pagination parameters

3. **Implement flexible filtering**
   - Filter by customer, order, or merchant
   - Include date range filtering
   - Support status-based filtering
   - Add amount range filtering

4. **Add sorting and pagination**
   - Sort by creation date (default descending)
   - Support custom sorting options
   - Include pagination with limit and offset
   - Add total count information

5. **Include comprehensive transaction data**
   - Transaction basic information (ID, amount, status)
   - Payment method and gateway details
   - Customer and order information
   - Timestamps and processing history

6. **Add related information**
   - Include refund information
   - Add order fulfillment status
   - Include customer communication history
   - Add dispute and chargeback information

7. **Implement privacy and security**
   - Sanitize sensitive customer information
   - Apply data access permissions
   - Include audit trail for history access
   - Handle customer data protection requirements

8. **Add analytics and metrics**
   - Calculate success rates
   - Include average processing times
   - Add payment method usage statistics
   - Generate trend analysis data

9. **Include Sri Lankan specifics**
   - Format LKR amounts consistently
   - Include local payment method details
   - Add banking settlement information
   - Handle mobile payment transaction details

10. **Add export capabilities**
    - Support CSV export for reporting
    - Include PDF generation for statements
    - Add API endpoint for external systems
    - Support batch data export for analytics

---

## Summary

This document established the core PaymentService class and its primary methods for payment lifecycle management. The key accomplishments include:

### Completed Components
- PaymentService class with tenant context
- Active payment methods retrieval
- Payment initiation with comprehensive validation
- Payment logging and audit trail
- Payment verification and status management
- Order status synchronization
- Refund processing with partial refund support
- Transaction status checking
- Transaction history and reporting

### Key Features Implemented
- Sri Lankan payment gateway integration
- LKR currency handling and formatting
- Multi-tenant payment configuration
- Comprehensive error handling and logging
- Business rule validation and enforcement
- Real-time status synchronization
- Performance optimization with caching

### Next Steps
The next document will implement validation, events, analytics, and service verification to complete the payment service layer.

---

**Next:** [02_Tasks-45-52_Validation-Events-Verify.md](02_Tasks-45-52_Validation-Events-Verify.md)