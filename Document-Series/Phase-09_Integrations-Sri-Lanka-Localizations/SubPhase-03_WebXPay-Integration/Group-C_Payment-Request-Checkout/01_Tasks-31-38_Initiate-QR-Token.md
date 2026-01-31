# Phase-09 | SubPhase-03 | Group-C | Document 01/02
# Tasks 31-38: Payment Initiation, QR Codes, and Token Management

## Navigation
- **Phase:** [Phase-09 Integrations-Sri-Lanka-Localizations](../../00_SUBPHASES_SUMMARY.md)
- **SubPhase:** [SubPhase-03 WebXPay Integration](../00_SUBPHASES_SUMMARY.md)
- **Previous Group:** [Group-B WebXPay Processor Implementation](../Group-B_WebXPay-Processor-Implementation/02_Tasks-23-30_Testing-Error-Response.md)
- **Current Group:** Group-C Payment Request Checkout
- **Next Document:** [Tasks 39-46: Prevention, Response, and Verification](02_Tasks-39-46_Prevention-Response-Verify.md)

---

## Document Overview

This document covers the implementation of payment initiation workflows with multiple payment methods, QR code generation, checkout URL building, and payment token management within the WebXPay integration system.

### Tasks Covered
- **Task 31:** Create Payment Initiation Method
- **Task 32:** Create Payment Request API
- **Task 33:** Create Card Payment Option  
- **Task 34:** Create QR Payment Option
- **Task 35:** Create Bank Transfer Option
- **Task 36:** Create Checkout URL Builder
- **Task 37:** Create Payment Token Handler
- **Task 38:** Create Token Expiry System

### Technology Stack
- Django 5.x Backend Framework
- WebXPay Payment Gateway API
- QR Code Generation Libraries
- LKR Currency Handling
- Sri Lankan Banking Integration
- Token-based Security System

---

## Task 31: Create Payment Initiation Method

### Objective
Develop a comprehensive payment initiation method that serves as the primary entry point for all WebXPay payment transactions.

### Implementation Requirements

#### Payment Initiation Manager
1. **Create Payment Initiation Service Class**
   - Design `WebXPayInitiationService` in `payments/services/webxpay/`
   - Implement payment flow coordination
   - Handle multi-tenant payment contexts
   - Manage payment state transitions

2. **Payment Session Management**
   - Create secure payment sessions
   - Generate unique payment identifiers
   - Store session data with expiry
   - Link sessions to tenant contexts

3. **Amount Validation and Processing**
   - Validate LKR amounts and formatting
   - Apply Sri Lankan currency rules
   - Handle decimal precision for local currency
   - Convert amounts to WebXPay format specifications

4. **Customer Information Processing**
   - Extract and validate customer details
   - Format data for WebXPay requirements
   - Handle Sri Lankan address formats
   - Process local phone number formats

#### Integration Points
1. **ERP Order Integration**
   - Link with order management system
   - Update order payment status
   - Handle order-to-payment mapping
   - Manage order completion workflows

2. **Tenant Context Management**
   - Ensure proper tenant isolation
   - Handle tenant-specific configurations
   - Apply tenant payment limits
   - Use tenant WebXPay credentials

3. **Audit and Logging**
   - Log all payment initiation attempts
   - Track payment session creation
   - Record customer data processing
   - Maintain compliance audit trails

---

## Task 32: Create Payment Request API

### Objective
Build a robust API endpoint that handles payment requests and orchestrates the entire payment flow for WebXPay integration.

### Implementation Requirements

#### API Endpoint Design
1. **Payment Request Endpoint**
   - Create `POST /api/payments/webxpay/initiate/`
   - Implement proper authentication and authorization
   - Add rate limiting for payment requests
   - Include tenant-based access controls

2. **Request Validation**
   - Validate payment amount and currency
   - Verify customer information completeness
   - Check order validity and availability
   - Ensure tenant permissions for payment processing

3. **Response Structure**
   - Return standardized API responses
   - Include payment session identifiers
   - Provide checkout URLs for different methods
   - Return estimated processing times

#### Payment Flow Orchestration
1. **Request Processing Pipeline**
   - Validate incoming payment requests
   - Initialize payment sessions
   - Prepare WebXPay API calls
   - Handle synchronous response generation

2. **Payment Method Selection**
   - Support multiple payment methods in single request
   - Return available options based on amount
   - Handle method-specific requirements
   - Provide fallback options for failed methods

3. **Error Handling**
   - Implement comprehensive error responses
   - Handle WebXPay API failures gracefully
   - Provide meaningful error messages in English and Sinhala
   - Log errors for troubleshooting

#### Security Implementation
1. **Request Security**
   - Implement request signature validation
   - Add CSRF protection for web requests
   - Use secure headers for API calls
   - Validate request origins and timing

2. **Data Protection**
   - Sanitize customer payment data
   - Encrypt sensitive information in transit
   - Mask payment details in logs
   - Ensure PCI compliance standards

---

## Task 33: Create Card Payment Option

### Objective
Implement card payment functionality that integrates with WebXPay's card processing capabilities while following Sri Lankan banking regulations.

### Implementation Requirements

#### Card Payment Service
1. **Card Payment Handler**
   - Create `WebXPayCardService` class
   - Implement card validation methods
   - Handle card tokenization processes
   - Support local and international cards

2. **Sri Lankan Card Support**
   - Support major local banks (BOC, Commercial Bank, Sampath, etc.)
   - Handle Lanka Pay and Visa/Mastercard
   - Implement card BIN validation for local cards
   - Support installment payment options

3. **Card Security Implementation**
   - Implement CVV validation
   - Handle 3D Secure authentication
   - Manage card tokenization for repeat payments
   - Ensure PCI DSS compliance

#### Payment Processing Flow
1. **Card Data Processing**
   - Validate card number formats
   - Check expiry dates and CVV
   - Handle card holder name validation
   - Process billing address information

2. **WebXPay Card API Integration**
   - Make secure API calls to WebXPay
   - Handle card payment authorization
   - Process payment confirmations
   - Manage declined payment responses

3. **Transaction Management**
   - Create transaction records
   - Update payment status in real-time
   - Handle partial payments and refunds
   - Manage transaction reversals

#### Local Banking Integration
1. **Sri Lankan Banking Features**
   - Support rupee-denominated transactions
   - Handle local bank processing times
   - Implement bank-specific error handling
   - Support weekend and holiday processing

2. **Compliance and Reporting**
   - Generate transaction reports for CBSL
   - Handle foreign exchange regulations
   - Implement anti-money laundering checks
   - Maintain transaction audit trails

---

## Task 34: Create QR Payment Option

### Objective
Develop QR code payment functionality to enable mobile payments through Sri Lankan banking apps and digital wallets.

### Implementation Requirements

#### QR Payment Service
1. **QR Code Generation Service**
   - Create `WebXPayQRService` class
   - Generate dynamic QR codes for payments
   - Include payment amount and merchant details
   - Add expiry times to QR codes

2. **QR Code Standards**
   - Implement Lanka QR standards
   - Support international QR payment formats
   - Include merchant identification codes
   - Add transaction reference numbers

3. **Mobile Payment Integration**
   - Support popular Sri Lankan mobile wallets
   - Integrate with bank mobile applications
   - Handle QR code scanning responses
   - Process mobile payment confirmations

#### QR Code Management
1. **Dynamic QR Generation**
   - Create unique QR codes per transaction
   - Include encrypted payment information
   - Add security tokens to prevent tampering
   - Generate high-resolution QR images

2. **QR Code Display**
   - Provide QR codes in multiple formats (PNG, SVG)
   - Include instructions in local languages
   - Add payment amount and merchant details
   - Display countdown timers for expiry

3. **Payment Confirmation**
   - Monitor for QR payment completions
   - Handle real-time payment notifications
   - Update transaction status automatically
   - Send confirmation messages to customers

#### Mobile Wallet Support
1. **Popular Wallet Integration**
   - Support Dialog Axiata mobile payments
   - Integrate with Mobitel Mcash
   - Handle Hutch payments processing
   - Support bank-specific mobile apps

2. **QR Payment Processing**
   - Validate QR payment transactions
   - Handle payment timeouts and failures
   - Process refunds for QR payments
   - Manage duplicate payment prevention

---

## Task 35: Create Bank Transfer Option

### Objective
Implement direct bank transfer functionality supporting major Sri Lankan banks and real-time payment systems.

### Implementation Requirements

#### Bank Transfer Service
1. **Bank Transfer Handler**
   - Create `WebXPayBankTransferService` class
   - Support multiple Sri Lankan banks
   - Handle real-time bank transfers
   - Implement batch transfer processing

2. **Supported Banking Methods**
   - SLIPS (Sri Lanka Interbank Payment System)
   - Real-Time Gross Settlement (RTGS)
   - Common Electronic Fund Transfer Switch (CEFTS)
   - Individual bank transfer systems

3. **Bank Integration**
   - Connect with major banks APIs
   - Handle bank-specific transfer formats
   - Process bank transfer confirmations
   - Manage transfer status updates

#### Transfer Processing
1. **Transfer Initiation**
   - Validate bank account details
   - Check transfer limits and restrictions
   - Generate unique transfer references
   - Create transfer instructions

2. **Bank Account Validation**
   - Verify recipient bank account numbers
   - Validate bank codes and branch codes
   - Check account holder name matching
   - Ensure account is active and valid

3. **Transfer Monitoring**
   - Track transfer progress in real-time
   - Handle transfer delays and failures
   - Process transfer completion notifications
   - Update payment status automatically

#### Sri Lankan Banking Features
1. **Local Banking Support**
   - Support all major commercial banks
   - Handle Central Bank regulations
   - Implement transfer limit checks
   - Process transfers during banking hours

2. **Real-Time Processing**
   - Enable instant transfers where supported
   - Handle same-day value transfers
   - Process emergency transfers
   - Support weekend and holiday transfers

---

## Task 36: Create Checkout URL Builder

### Objective
Develop a comprehensive URL building system that creates secure, method-specific checkout URLs for different payment options.

### Implementation Requirements

#### URL Builder Service
1. **Checkout URL Service**
   - Create `WebXPayURLBuilder` class
   - Generate method-specific URLs
   - Include security parameters
   - Handle URL expiry and rotation

2. **URL Construction Logic**
   - Build URLs for card payments
   - Create QR payment URLs
   - Generate bank transfer URLs
   - Include fallback URLs for failures

3. **Security Parameters**
   - Add secure tokens to URLs
   - Include payment session identifiers
   - Embed transaction signatures
   - Set URL expiry timestamps

#### URL Management
1. **Dynamic URL Generation**
   - Create unique URLs per payment session
   - Include customer and order information
   - Add merchant identification
   - Embed return and callback URLs

2. **URL Validation**
   - Validate URL parameters on access
   - Check token authenticity
   - Verify session validity
   - Ensure URL hasn't expired

3. **Redirect Handling**
   - Handle successful payment redirects
   - Process failed payment redirects
   - Manage cancelled payment redirects
   - Handle timeout redirects

#### Multi-Method Support
1. **Payment Method URLs**
   - Generate card payment checkout URLs
   - Create QR code display URLs
   - Build bank transfer instruction URLs
   - Provide method selection URLs

2. **Mobile Optimization**
   - Create mobile-friendly URLs
   - Support deep linking to banking apps
   - Handle mobile browser redirects
   - Optimize for mobile payment flows

---

## Task 37: Create Payment Token Handler

### Objective
Implement a secure payment token management system for handling sensitive payment information and enabling repeat payments.

### Implementation Requirements

#### Token Management Service
1. **Payment Token Service**
   - Create `WebXPayTokenService` class
   - Generate secure payment tokens
   - Handle token lifecycle management
   - Implement token-based security

2. **Token Generation**
   - Create unique tokens per payment session
   - Use cryptographically secure random generation
   - Include payment and customer information
   - Add token validation checksums

3. **Token Storage**
   - Store tokens securely in database
   - Encrypt sensitive token data
   - Implement token indexing for quick retrieval
   - Use tenant-based token isolation

#### Token Security
1. **Token Encryption**
   - Encrypt tokens at rest
   - Use secure encryption algorithms
   - Implement key rotation policies
   - Handle encryption key management

2. **Token Validation**
   - Validate token authenticity
   - Check token expiry status
   - Verify token usage permissions
   - Implement token replay protection

3. **Access Control**
   - Restrict token access by tenant
   - Implement user-based token permissions
   - Log all token access attempts
   - Handle unauthorized token access

#### Repeat Payment Support
1. **Token-Based Payments**
   - Enable repeat payments using tokens
   - Support subscription payments
   - Handle automated billing
   - Manage customer payment preferences

2. **Customer Token Management**
   - Allow customers to view saved tokens
   - Enable token deletion by customers
   - Support multiple tokens per customer
   - Handle token update notifications

---

## Task 38: Create Token Expiry System

### Objective
Develop a comprehensive token expiry management system that handles automatic token cleanup and renewal processes.

### Implementation Requirements

#### Expiry Management Service
1. **Token Expiry Service**
   - Create `WebXPayTokenExpiryService` class
   - Implement automated expiry checking
   - Handle token cleanup processes
   - Manage expiry notifications

2. **Expiry Configuration**
   - Set different expiry times for token types
   - Configure cleanup schedules
   - Handle emergency token revocation
   - Implement expiry extension policies

3. **Automated Cleanup**
   - Run periodic expiry checks
   - Remove expired tokens automatically
   - Clean up associated payment sessions
   - Update related transaction records

#### Expiry Processing
1. **Token Lifecycle Management**
   - Track token creation and usage
   - Monitor token expiry approaching
   - Handle token renewal requests
   - Process token expiry notifications

2. **Cleanup Operations**
   - Schedule regular cleanup jobs
   - Remove expired payment sessions
   - Clean up temporary payment data
   - Update payment status records

3. **Expiry Notifications**
   - Notify customers of approaching expiry
   - Send token renewal reminders
   - Alert administrators of mass expiry
   - Log expiry-related activities

#### System Integration
1. **Celery Task Integration**
   - Create periodic cleanup tasks
   - Schedule expiry check jobs
   - Handle cleanup failures gracefully
   - Monitor cleanup performance

2. **Database Optimization**
   - Use database-level expiry features
   - Implement efficient cleanup queries
   - Optimize token lookup performance
   - Handle large-scale token cleanup

---

## Implementation Flow Diagram

```
Payment Initiation Flow:
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Customer      │───▶│  Payment Request │───▶│  Method         │
│   Initiates     │    │  API Validation  │    │  Selection      │
│   Payment       │    │                  │    │                 │
└─────────────────┘    └──────────────────┘    └─────────────────┘
                                │                         │
                                ▼                         ▼
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Token         │◀───│  Payment Session │───▶│  Checkout URL   │
│   Generation    │    │  Creation        │    │  Builder        │
│                 │    │                  │    │                 │
└─────────────────┘    └──────────────────┘    └─────────────────┘
         │                        │                         │
         ▼                        ▼                         ▼
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Token Expiry  │    │  Payment         │    │  Method-        │
│   Management    │    │  Processing      │    │  Specific       │
│                 │    │                  │    │  Processing     │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

---

## Security Considerations

### Payment Security
1. **Data Encryption**
   - Encrypt all payment data in transit
   - Use secure storage for sensitive information
   - Implement proper key management
   - Follow PCI DSS requirements

2. **Token Security**
   - Generate cryptographically secure tokens
   - Implement token rotation policies
   - Use secure token validation
   - Prevent token enumeration attacks

### Compliance Requirements
1. **Sri Lankan Regulations**
   - Follow Central Bank of Sri Lanka guidelines
   - Implement anti-money laundering checks
   - Maintain proper transaction records
   - Handle foreign exchange regulations

2. **International Standards**
   - Comply with PCI DSS requirements
   - Follow ISO 27001 security standards
   - Implement proper audit trails
   - Ensure data protection compliance

---

## Testing Strategy

### Unit Testing
1. **Service Testing**
   - Test payment initiation methods
   - Validate token generation and expiry
   - Test URL builder functionality
   - Verify payment method handlers

2. **Integration Testing**
   - Test WebXPay API integration
   - Validate QR code generation
   - Test bank transfer processing
   - Verify card payment flows

### Security Testing
1. **Token Security Testing**
   - Test token generation randomness
   - Validate expiry enforcement
   - Test token validation logic
   - Verify access control implementation

2. **Payment Flow Testing**
   - Test payment request validation
   - Verify secure URL generation
   - Test method-specific security
   - Validate error handling

---

## Performance Considerations

### Scalability
1. **Payment Processing**
   - Optimize token generation performance
   - Implement efficient URL building
   - Handle concurrent payment requests
   - Scale QR code generation

2. **Database Performance**
   - Index payment and token tables
   - Optimize cleanup queries
   - Handle large token volumes
   - Monitor payment session storage

### Monitoring
1. **Payment Metrics**
   - Track payment initiation success rates
   - Monitor token generation performance
   - Measure checkout URL response times
   - Track method-specific success rates

2. **System Health**
   - Monitor token expiry processing
   - Track cleanup job performance
   - Measure API response times
   - Monitor error rates and patterns

---

## Next Steps

This document covers the foundational payment initiation, QR code generation, and token management systems. The next document will focus on:

- **Tasks 39-46:** Payment prevention systems, response handling, and verification processes
- Advanced security implementations
- Error recovery and failover mechanisms
- Comprehensive testing and validation

Proceed to [Tasks 39-46: Prevention, Response, and Verification](02_Tasks-39-46_Prevention-Response-Verify.md) to continue the WebXPay integration implementation.

---

## Summary

Tasks 31-38 establish the core payment initiation infrastructure with:
- ✅ Comprehensive payment initiation method
- ✅ Robust payment request API
- ✅ Multi-method payment support (Card, QR, Bank Transfer)
- ✅ Secure checkout URL building
- ✅ Advanced token management
- ✅ Automated expiry system

The foundation is now ready for prevention, response, and verification implementation in the next document.