# 01_Tasks-15-22_Processor-Signature-Builders.md

## Phase-09: Integrations-Sri-Lanka-Localizations
### SubPhase-03: WebXPay-Integration  
### Group-B: WebXPay-Processor-Implementation
### Document: 01 of 02

---

## Navigation Links

**Phase Navigation:**
- [← Previous Phase: Phase-08 Webstore Ecommerce Platform](../../Phase-08_Webstore-Ecommerce-Platform/)
- [→ Next Phase: Phase-10 AI Features Advanced Capabilities](../../Phase-10_AI-Features-Advanced-Capabilities/)

**SubPhase Navigation:**
- [← Previous SubPhase: SubPhase-02 Ceylon Bank Integration](../SubPhase-02_Ceylon-Bank-Integration/)
- [→ Next SubPhase: SubPhase-04 Government API Integration](../SubPhase-04_Government-API-Integration/)

**Group Navigation:**
- [← Previous Group: Group-A WebXPay Configuration](../Group-A_WebXPay-Configuration/)
- [→ Next Group: Group-C WebXPay Response Processing](../Group-C_WebXPay-Response-Processing/)

**Document Navigation:**
- [→ Next Document: 02_Tasks-23-30_Customer-Request-Verify.md](02_Tasks-23-30_Customer-Request-Verify.md)

---

## Document Overview

### Purpose
This document covers the implementation of the core WebXPayProcessor class and its supporting components for secure payment processing with WebXPay gateway. The focus is on building the processor foundation, signature generation, and data builders for Sri Lankan market requirements.

### Scope: Tasks 15-22
- **Task 15:** Create WebXPayProcessor Class
- **Task 16:** Create HMAC Signature Method  
- **Task 17:** Create Parameter Ordering
- **Task 18:** Create Amount Formatter
- **Task 19:** Create Reference Generator
- **Task 20:** Create Customer Data Builder
- **Task 21:** Create Phone Number Formatter
- **Task 22:** Create Request Builder

### Technology Stack
- **Framework:** Django 5.x
- **Security:** HMAC-SHA256 signatures
- **Payment Gateway:** WebXPay API
- **Localization:** Sri Lankan phone format (+94), LKR currency
- **Architecture:** Abstract Base Class pattern

---

## Task 15: Create WebXPayProcessor Class

### Overview
Implement the main WebXPayProcessor class that extends the PaymentProcessor abstract base class to provide WebXPay-specific payment processing capabilities.

### Implementation Requirements

#### Class Structure
1. **Inheritance Setup**
   - Extend the PaymentProcessor abstract base class
   - Import required dependencies for WebXPay integration
   - Set up class-level configuration constants

2. **Configuration Management**
   - Initialize WebXPay merchant credentials
   - Configure API endpoints and timeouts
   - Set up environment-specific settings (sandbox vs production)

3. **Core Attributes**
   - Define processor name and display name
   - Set supported currencies (focus on LKR)
   - Configure supported payment methods

4. **Initialization Method**
   - Accept configuration parameters
   - Validate required credentials
   - Initialize internal state and dependencies

#### Integration Points
- Connect with WebXPay configuration from Group-A
- Integrate with payment processing infrastructure
- Set up logging and error handling mechanisms

#### Validation Rules
- Ensure all required WebXPay credentials are present
- Validate merchant ID format and structure
- Confirm API endpoint accessibility

---

## Task 16: Create HMAC Signature Method

### Overview
Implement secure HMAC-SHA256 signature generation for WebXPay API requests to ensure request integrity and authenticity.

### Implementation Requirements

#### Signature Generation Process
1. **Parameter Preparation**
   - Collect all request parameters
   - Remove empty or None values
   - Convert all values to string format

2. **String Construction**
   - Order parameters according to WebXPay specification
   - Create concatenated parameter string
   - Include merchant secret in signature calculation

3. **HMAC Creation**
   - Use HMAC-SHA256 algorithm
   - Apply merchant secret as the key
   - Generate hexadecimal digest

4. **Signature Verification**
   - Implement signature validation for responses
   - Compare calculated vs received signatures
   - Handle signature mismatch scenarios

#### Security Considerations
- Protect merchant secret in memory
- Use secure string comparison methods
- Log security events without exposing sensitive data

#### Error Handling
- Handle invalid parameter types
- Manage missing secret key scenarios
- Provide clear error messages for signature failures

---

## Task 17: Create Parameter Ordering

### Overview
Implement the specific parameter ordering algorithm required by WebXPay API for consistent signature generation.

### Implementation Requirements

#### Ordering Algorithm
1. **Sort Rules**
   - Implement case-sensitive alphabetical sorting
   - Handle special characters in parameter names
   - Maintain consistent ordering across requests

2. **Parameter Processing**
   - Filter out signature-related parameters
   - Handle nested objects and arrays
   - Convert complex types to sortable strings

3. **Validation Logic**
   - Verify parameter completeness
   - Check for required WebXPay parameters
   - Validate parameter value formats

#### Implementation Details
- Create dedicated parameter ordering utility
- Support both request and response parameter ordering
- Implement debug logging for ordering verification

#### Integration
- Connect with HMAC signature generation
- Support request builder parameter ordering
- Enable signature verification workflows

---

## Task 18: Create Amount Formatter

### Overview
Implement Sri Lankan Rupee (LKR) amount formatting according to WebXPay specifications and local conventions.

### Implementation Requirements

#### Amount Processing
1. **Format Conversion**
   - Convert decimal amounts to WebXPay format
   - Handle currency precision requirements
   - Support both integer and decimal inputs

2. **LKR Formatting**
   - Apply Sri Lankan currency formatting rules
   - Handle decimal places correctly (2 decimal places)
   - Implement thousand separators where appropriate

3. **Validation Rules**
   - Enforce minimum and maximum amount limits
   - Validate amount precision
   - Check for negative amounts and edge cases

#### WebXPay Compliance
- Format amounts according to API specifications
- Handle currency code requirements
- Support amount rounding rules

#### Error Handling
- Manage invalid amount inputs
- Handle currency conversion errors
- Provide meaningful error messages

---

## Task 19: Create Reference Generator

### Overview
Implement unique reference number generation for WebXPay transactions with proper formatting and collision prevention.

### Implementation Requirements

#### Reference Generation Logic
1. **Format Structure**
   - Create merchant-specific reference format
   - Include timestamp components
   - Add unique identifier elements

2. **Uniqueness Guarantee**
   - Implement collision detection
   - Use UUID components where appropriate
   - Include merchant identifier in references

3. **Format Compliance**
   - Follow WebXPay reference format requirements
   - Ensure character set compatibility
   - Maintain reference length limits

#### Integration Points
- Connect with transaction tracking system
- Support duplicate detection mechanisms
- Enable reference validation workflows

#### Persistence
- Store generated references for tracking
- Implement reference lookup capabilities
- Support reference history maintenance

---

## Task 20: Create Customer Data Builder

### Overview
Implement customer data structure builder for WebXPay API requests with Sri Lankan market-specific formatting.

### Implementation Requirements

#### Data Structure Building
1. **Customer Information**
   - Build customer name and contact details
   - Format customer address information
   - Include customer identification data

2. **Address Formatting**
   - Support Sri Lankan address formats
   - Handle postal code formatting
   - Include district and province information

3. **Contact Information**
   - Format email addresses correctly
   - Process phone numbers with Sri Lankan formatting
   - Include alternative contact methods

#### Validation Rules
- Validate email format and domain
- Check phone number format compliance
- Verify address completeness

#### Data Privacy
- Implement data sanitization
- Support data masking for logging
- Handle PII data securely

---

## Task 21: Create Phone Number Formatter

### Overview
Implement Sri Lankan phone number formatting according to local standards and WebXPay requirements.

### Implementation Requirements

#### Phone Number Processing
1. **Format Detection**
   - Identify Sri Lankan mobile numbers
   - Detect landline number formats
   - Handle international format inputs

2. **Standardization**
   - Convert to +94 international format
   - Remove unnecessary characters
   - Standardize digit groupings

3. **Validation Logic**
   - Verify Sri Lankan mobile prefixes (70, 71, 72, 75, 76, 77, 78)
   - Check landline area codes
   - Validate number length requirements

#### Format Conversion
- Support multiple input formats
- Convert to WebXPay required format
- Handle format error scenarios

#### Error Handling
- Manage invalid number formats
- Provide format correction suggestions
- Log formatting errors appropriately

---

## Task 22: Create Request Builder

### Overview
Implement the request builder that assembles all components into properly formatted WebXPay API requests.

### Implementation Requirements

#### Request Assembly
1. **Component Integration**
   - Combine processor data with customer data
   - Include formatted amounts and references
   - Add signature and authentication data

2. **Request Structure**
   - Build WebXPay API-compliant request structure
   - Include all required parameters
   - Format request according to API specifications

3. **Validation Process**
   - Validate complete request structure
   - Check parameter completeness
   - Verify signature integrity

#### Request Types
- Support payment request building
- Handle refund request structure
- Build status inquiry requests

#### Quality Assurance
- Implement request validation
- Support request debugging
- Enable request logging for troubleshooting

---

## Architecture Diagrams

### WebXPayProcessor Class Structure

```
┌─────────────────────────────────────┐
│         PaymentProcessor             │
│         (Abstract Base)             │
└─────────────────┬───────────────────┘
                  │ (inheritance)
┌─────────────────▼───────────────────┐
│        WebXPayProcessor             │
├─────────────────────────────────────┤
│ + merchant_id                       │
│ + merchant_secret                   │
│ + api_endpoints                     │
├─────────────────────────────────────┤
│ + process_payment()                 │
│ + generate_signature()              │
│ + build_request()                   │
│ + format_amount()                   │
└─────────────────────────────────────┘
```

### Signature Generation Flow

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Parameters    │───▶│  Order & Filter  │───▶│  String Build   │
│   Collection    │    │   Parameters     │    │   & Concat      │
└─────────────────┘    └──────────────────┘    └─────────────────┘
                                                          │
┌─────────────────┐    ┌──────────────────┐    ┌─────────▼─────────┐
│   HMAC-SHA256   │◄───│  Merchant Secret │◄───│  Signature Base  │
│   Generation    │    │    Addition      │    │     String       │
└─────────────────┘    └──────────────────┘    └───────────────────┘
```

### Data Builder Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Raw Customer  │───▶│   Phone Number   │───▶│   Formatted     │
│      Data       │    │    Formatter     │    │  Customer Data  │
└─────────────────┘    └──────────────────┘    └─────────────────┘
         │                        │                        │
         ▼                        ▼                        ▼
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Amount Data   │───▶│   Amount Format  │───▶│  Request Build  │
│  & References   │    │   & Reference    │    │   Assembly      │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

---

## Implementation Guidelines

### Development Approach
1. **Test-Driven Development**
   - Write unit tests for each component
   - Test signature generation with known values
   - Validate formatting with Sri Lankan data samples

2. **Security First**
   - Implement secure credential handling
   - Use secure random number generation
   - Apply proper input validation and sanitization

3. **Error Handling**
   - Implement comprehensive exception handling
   - Provide meaningful error messages
   - Log errors with appropriate detail levels

### Code Quality Standards
- Follow Django coding conventions
- Implement proper documentation strings
- Use type hints for method signatures
- Apply consistent naming conventions

### Testing Requirements
- Unit tests for all public methods
- Integration tests with WebXPay sandbox
- Mock external API dependencies
- Test Sri Lankan specific formatting

---

## Integration Points

### Dependencies
- PaymentProcessor abstract base class
- WebXPay configuration from Group-A
- Django settings and logging framework
- Cryptographic libraries for HMAC

### Outputs to Next Document
- Functional WebXPayProcessor class
- Signature generation capabilities
- Data formatting utilities
- Request building infrastructure

### Quality Gates
- All unit tests passing
- Code coverage above 90%
- Security review completed
- Integration with existing payment infrastructure verified

---

## Risk Mitigation

### Security Risks
- **Risk:** Signature generation errors
- **Mitigation:** Comprehensive testing with WebXPay test vectors

### Integration Risks
- **Risk:** Payment processor interface compatibility
- **Mitigation:** Thorough testing with existing payment workflows

### Localization Risks
- **Risk:** Sri Lankan formatting requirements
- **Mitigation:** Validation with local market examples

---

## Success Criteria

### Functional Requirements
- [ ] WebXPayProcessor class successfully extends PaymentProcessor
- [ ] HMAC signature generation matches WebXPay requirements
- [ ] Parameter ordering follows WebXPay specifications
- [ ] Amount formatting complies with LKR standards
- [ ] Reference generation produces unique, valid references
- [ ] Customer data builder formats Sri Lankan data correctly
- [ ] Phone number formatter handles +94 format properly
- [ ] Request builder assembles valid WebXPay requests

### Technical Requirements
- [ ] All unit tests pass
- [ ] Code follows Django best practices
- [ ] Proper error handling implemented
- [ ] Security best practices applied
- [ ] Integration with configuration system working

### Documentation Requirements
- [ ] API documentation completed
- [ ] Usage examples provided
- [ ] Error handling documented
- [ ] Configuration requirements specified

---

**Next Steps:** Proceed to [02_Tasks-23-30_Customer-Request-Verify.md](02_Tasks-23-30_Customer-Request-Verify.md) for customer request handling and verification implementation.