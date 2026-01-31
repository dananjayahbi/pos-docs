# Tasks 28-34: Factory Pattern and Exception Hierarchy

> **Phase:** 09 - Integrations & Sri Lanka Localizations  
> **SubPhase:** 01 - Payment Gateway Architecture  
> **Group:** B - Payment Processor Interface  
> **Document:** 02 of 02  
> **Tasks Covered:** 28, 29, 30, 31, 32, 33, 34

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-19-27_Dataclasses-ABC.md](01_Tasks-19-27_Dataclasses-ABC.md)
- **→ Next Group:** [Group-C_Payment-Service-Layer](../Group-C_Payment-Service-Layer/)

---

## Document Overview

This document covers the creation of the factory pattern for payment processor management and the exception hierarchy for payment processing errors. It establishes the processor registry system and comprehensive error handling that ensures robust payment gateway integration.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 28 | Create PaymentProcessorFactory | Medium | 35 min |
| 29 | Create Processor Registry | Medium | 30 min |
| 30 | Create get_processor Method | Medium | 25 min |
| 31 | Create ProcessorConfig Type | Low | 20 min |
| 32 | Create PaymentException Base | Medium | 30 min |
| 33 | Create Specific Exceptions | Medium | 40 min |
| 34 | Verify Processor Interface | Low | 25 min |

---

## Task 28: Create PaymentProcessorFactory

### Overview
Create the PaymentProcessorFactory class that implements the factory pattern for managing payment processor instances. This factory will handle processor instantiation, configuration, and registry management for all supported payment gateways.

### Dependencies
- Task 27 (supports_recurring method) must be complete
- PaymentProcessor ABC is fully defined
- Understanding of factory pattern implementation

### Instructions

1. **Create factory.py file**
   - Navigate to `backend/apps/payment/` directory
   - Create `factory.py` file for factory implementation
   - Import necessary modules for factory pattern

2. **Import required dependencies**
   - Import PaymentProcessor from interfaces module
   - Import Dict, Type, Optional from typing module
   - Import logging for error tracking
   - Import threading for thread-safe operations

3. **Design PaymentProcessorFactory class**
   - Create singleton factory class
   - Implement thread-safe instance creation
   - Include processor registry management
   - Add configuration validation methods

4. **Add class-level attributes**
   - _instance: Class variable for singleton pattern
   - _lock: Threading lock for thread safety
   - _processors: Dictionary for processor registry
   - _initialized: Boolean flag for initialization status

5. **Implement singleton pattern**
   - Override __new__ method for singleton behavior
   - Ensure thread-safe instance creation
   - Include proper initialization checks
   - Handle multiple threading scenarios

6. **Add factory initialization**
   - Create __init__ method with registry setup
   - Initialize empty processor registry
   - Set up logging for factory operations
   - Configure thread-safe operations

7. **Design processor registration**
   - Add register_processor method
   - Accept processor class and gateway name
   - Validate processor implementation
   - Handle registration conflicts

8. **Configure Sri Lankan gateways**
   - Prepare registration for PayHere processor
   - Include WebXPay processor registration
   - Add KOKO processor support
   - Handle COD (Cash on Delivery) registration

9. **Add validation methods**
   - Validate processor class inheritance
   - Check abstract method implementation
   - Verify gateway name uniqueness
   - Ensure configuration compatibility

---

## Task 29: Create Processor Registry

### Overview
Implement the processor registry system within the factory to maintain and manage available payment processors. This registry will store processor classes and their configurations for dynamic processor creation.

### Dependencies
- Task 28 (PaymentProcessorFactory) must be complete
- Factory class structure is established

### Instructions

1. **Design registry data structure**
   - Use dictionary for processor storage
   - Key: gateway name string
   - Value: processor class reference
   - Include metadata for each processor

2. **Add registry management methods**
   - get_registered_processors: Return list of available processors
   - is_processor_registered: Check if processor exists
   - unregister_processor: Remove processor from registry
   - clear_registry: Reset entire registry

3. **Implement processor metadata**
   - Store processor class reference
   - Include gateway name and description
   - Add supported features information
   - Track registration timestamp

4. **Add registry validation**
   - Validate processor class on registration
   - Check for duplicate gateway names
   - Ensure processor implements required interface
   - Validate configuration requirements

5. **Configure default processors**
   - Define list of default Sri Lankan processors
   - Include PayHere as primary gateway
   - Add WebXPay for alternative processing
   - Include KOKO for mobile payments
   - Register COD for cash transactions

6. **Implement registry persistence**
   - Add method to save registry state
   - Include registry loading capabilities
   - Handle registry configuration changes
   - Manage processor availability updates

7. **Add registry security**
   - Validate processor class authenticity
   - Prevent unauthorized processor registration
   - Include access control for registry modifications
   - Log all registry changes for audit

8. **Include monitoring capabilities**
   - Track processor registration events
   - Monitor processor usage statistics
   - Log registry access patterns
   - Generate registry health reports

---

## Task 30: Create get_processor Method

### Overview
Implement the get_processor method that retrieves and instantiates payment processors based on gateway name and configuration. This method serves as the primary interface for accessing configured payment processors.

### Dependencies
- Task 29 (Processor Registry) must be complete
- Registry system is fully functional

### Instructions

1. **Define method signature**
   - Method name: get_processor
   - Parameters: gateway_name (str), config (Dict[str, Any])
   - Return type: PaymentProcessor
   - Include proper type annotations

2. **Add comprehensive docstring**
   - Document method purpose and usage
   - Explain parameter requirements
   - Describe return value expectations
   - List possible exceptions

3. **Implement processor lookup**
   - Search registry for requested gateway
   - Validate gateway name existence
   - Check processor availability status
   - Handle case-insensitive gateway names

4. **Add configuration validation**
   - Validate required configuration parameters
   - Check gateway-specific settings
   - Ensure API credentials format
   - Validate callback URLs

5. **Implement processor instantiation**
   - Create processor instance with configuration
   - Pass validated config to processor constructor
   - Initialize processor with tenant-specific settings
   - Configure logging for processor instance

6. **Add caching mechanism**
   - Cache processor instances for performance
   - Use gateway name and config hash as cache key
   - Implement cache expiration policies
   - Handle configuration changes

7. **Handle Sri Lankan gateway specifics**
   - PayHere: Validate merchant_id and merchant_secret
   - WebXPay: Check api_key and signature configuration
   - KOKO: Verify partner_id and callback settings
   - COD: Validate delivery configuration parameters

8. **Implement error handling**
   - Handle processor not found errors
   - Manage configuration validation failures
   - Deal with processor instantiation errors
   - Include detailed error messages

9. **Add monitoring and logging**
   - Log processor creation events
   - Track processor usage metrics
   - Monitor configuration access patterns
   - Generate processor access reports

---

## Task 31: Create ProcessorConfig Type

### Overview
Create the ProcessorConfig type definition that standardizes configuration structure across all payment processors. This type ensures consistent configuration handling and validation.

### Dependencies
- Task 28 (PaymentProcessorFactory) must be complete
- Understanding of TypedDict requirements

### Instructions

1. **Add to interfaces.py file**
   - Import TypedDict from typing_extensions
   - Add type definitions for processor configuration
   - Include gateway-specific configuration types

2. **Design base ProcessorConfig**
   - gateway_name: String field for processor identification
   - is_enabled: Boolean field for processor availability
   - api_credentials: Dictionary for authentication data
   - webhook_config: Dictionary for callback configuration
   - fee_config: Dictionary for fee calculation settings

3. **Create gateway-specific configurations**
   - PayHereConfig: merchant_id, merchant_secret, currency
   - WebXPayConfig: api_key, signature_key, environment
   - KOKOConfig: partner_id, api_secret, callback_url
   - CODConfig: delivery_charges, coverage_areas

4. **Add validation type definitions**
   - Required fields for each configuration type
   - Optional fields with default values
   - Type constraints for each field
   - Format requirements for specific fields

5. **Define credential structures**
   - API key formats and requirements
   - Secret key handling and validation
   - Certificate configuration for secure gateways
   - Environment-specific settings (sandbox/production)

6. **Include webhook configuration**
   - webhook_url: Callback endpoint for gateway notifications
   - webhook_secret: Secret for webhook authentication
   - webhook_events: List of subscribed events
   - webhook_retry_policy: Retry configuration for failures

7. **Add fee configuration structure**
   - fixed_fee: Fixed amount fee per transaction
   - percentage_fee: Percentage-based fee calculation
   - minimum_fee: Minimum fee amount
   - maximum_fee: Maximum fee limit

8. **Define Sri Lankan specific fields**
   - currency_code: Default to "LKR"
   - supported_banks: List of supported local banks
   - mobile_operators: List of supported mobile payment providers
   - regulatory_compliance: Compliance settings for local regulations

---

## Task 32: Create PaymentException Base

### Overview
Create the base PaymentException class that serves as the parent for all payment processing exceptions. This establishes a consistent exception hierarchy for error handling across the payment system.

### Dependencies
- Task 22 (PaymentProcessor ABC) must be complete
- Understanding of exception hierarchy design

### Instructions

1. **Create exceptions.py file**
   - Navigate to `backend/apps/payment/` directory
   - Create `exceptions.py` file for exception definitions
   - Import necessary base exception classes

2. **Design PaymentException base class**
   - Inherit from built-in Exception class
   - Add custom attributes for payment-specific errors
   - Include error code system for categorization
   - Add context information for debugging

3. **Define base exception attributes**
   - error_code: String identifier for error type
   - message: Human-readable error message
   - details: Dictionary for additional error information
   - gateway_name: Optional gateway identifier
   - transaction_id: Optional transaction reference

4. **Implement base exception methods**
   - __init__: Initialize exception with required parameters
   - __str__: Return formatted error message
   - to_dict: Serialize exception for API responses
   - get_error_code: Return categorized error code

5. **Add error categorization**
   - GATEWAY_ERROR: Issues with payment gateway integration
   - VALIDATION_ERROR: Input validation failures
   - CONFIGURATION_ERROR: Setup and configuration issues
   - NETWORK_ERROR: Connectivity and timeout issues
   - AUTHENTICATION_ERROR: Credential and authorization failures

6. **Include context management**
   - Add method to capture current context
   - Include timestamp for error occurrence
   - Store request/response data for debugging
   - Capture stack trace information

7. **Design error code system**
   - Use hierarchical error codes (e.g., PAY001, PAY002)
   - Include gateway-specific error code mapping
   - Provide error code to message mapping
   - Support localization for error messages

8. **Add logging integration**
   - Automatically log exceptions when created
   - Include structured logging for error tracking
   - Support different log levels based on error severity
   - Enable error correlation across system components

---

## Task 33: Create Specific Exceptions

### Overview
Create specific exception classes that inherit from PaymentException for different error scenarios. These specialized exceptions provide detailed error handling for various payment processing failures.

### Dependencies
- Task 32 (PaymentException Base) must be complete
- Base exception class is fully implemented

### Instructions

1. **Add to exceptions.py file**
   - Continue in the same file
   - Inherit from PaymentException base class

2. **Create PaymentGatewayException**
   - Handle gateway communication failures
   - Include gateway response error codes
   - Add retry-able error identification
   - Include gateway-specific error mapping

3. **Create PaymentValidationException**
   - Handle input validation errors
   - Include field-specific error messages
   - Add validation rule references
   - Support multiple validation errors

4. **Create PaymentConfigurationException**
   - Handle processor configuration errors
   - Include missing configuration details
   - Add configuration validation failures
   - Support configuration file references

5. **Create PaymentTimeoutException**
   - Handle gateway timeout errors
   - Include timeout duration information
   - Add retry recommendations
   - Support different timeout scenarios

6. **Create PaymentAuthenticationException**
   - Handle credential and authorization failures
   - Include authentication method references
   - Add credential validation errors
   - Support token expiration scenarios

7. **Create PaymentInsufficientFundsException**
   - Handle insufficient balance errors
   - Include available balance information
   - Add suggested actions for users
   - Support different fund sources

8. **Create PaymentRefundException**
   - Handle refund processing errors
   - Include refund eligibility failures
   - Add refund amount validation errors
   - Support refund policy violations

9. **Add Sri Lankan specific exceptions**
   - LankanBankingException: Local banking integration errors
   - MobilePaymentException: Mobile payment provider errors
   - RegulatoryComplianceException: Local regulation violations
   - CurrencyException: LKR-specific currency handling errors

10. **Include exception utilities**
    - Exception factory methods
    - Error code to exception mapping
    - Exception severity classification
    - Exception recovery suggestions

---

## Task 34: Verify Processor Interface

### Overview
Implement comprehensive verification procedures to ensure the payment processor interface is correctly implemented and all components work together properly. This includes testing the factory pattern, exception handling, and processor contract compliance.

### Dependencies
- Task 33 (Specific Exceptions) must be complete
- All interface components are implemented

### Instructions

1. **Create verification script**
   - Navigate to `backend/apps/payment/` directory
   - Create `verify_interface.py` file
   - Include comprehensive interface testing

2. **Design interface validation tests**
   - Test abstract method implementation
   - Verify method signature compliance
   - Check return type annotations
   - Validate exception handling

3. **Implement factory pattern testing**
   - Test processor registration functionality
   - Verify processor instantiation
   - Check configuration validation
   - Test registry management

4. **Add dataclass validation**
   - Verify PaymentResult structure
   - Test PaymentIntent validation
   - Check RefundResult compliance
   - Validate field type constraints

5. **Create exception hierarchy testing**
   - Test exception inheritance structure
   - Verify error code system
   - Check exception serialization
   - Validate error message formatting

6. **Implement processor contract testing**
   - Test abstract method requirements
   - Verify processor interface compliance
   - Check method parameter validation
   - Test return value structure

7. **Add configuration testing**
   - Test ProcessorConfig type validation
   - Verify gateway-specific configurations
   - Check credential validation
   - Test webhook configuration

8. **Create integration testing**
   - Test processor factory integration
   - Verify exception propagation
   - Check logging integration
   - Test thread-safety features

9. **Add performance testing**
   - Test processor instantiation performance
   - Verify factory caching efficiency
   - Check exception handling overhead
   - Test concurrent access handling

10. **Include verification reporting**
    - Generate verification results
    - Create compliance report
    - Include performance metrics
    - Document any compliance issues

11. **Add automated verification**
    - Create verification command
    - Include in development workflow
    - Add continuous integration testing
    - Support regression testing

---

## Summary

This document completed the payment processor interface implementation with factory pattern and exception handling. The key accomplishments include:

### Completed Components
- PaymentProcessorFactory with singleton pattern
- Processor registry management system
- Dynamic processor instantiation method
- ProcessorConfig type definitions
- Comprehensive exception hierarchy
- Interface verification procedures

### Key Features Implemented
- Thread-safe factory operations
- Gateway-specific configuration support
- Structured error handling system
- Sri Lankan payment gateway compatibility
- Performance optimization with caching
- Comprehensive testing and verification

### Next Steps
The next group will implement the payment service layer that utilizes this processor interface to provide high-level payment operations for the application.

---

**Next:** [Group-C_Payment-Service-Layer](../Group-C_Payment-Service-Layer/)