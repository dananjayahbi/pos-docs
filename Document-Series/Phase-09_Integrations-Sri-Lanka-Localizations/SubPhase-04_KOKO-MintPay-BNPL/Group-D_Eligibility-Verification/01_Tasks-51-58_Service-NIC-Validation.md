# Tasks 51-58: Eligibility Service & NIC Validation

> **Phase:** 09 - Integrations & Sri Lanka Localizations  
> **SubPhase:** 04 - KOKO/MintPay BNPL  
> **Group:** D - Eligibility & Verification  
> **Document:** 01 of 02  
> **Tasks Covered:** 51, 52, 53, 54, 55, 56, 57, 58

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [../Group-C_MintPay-Processor-Implementation/02_Tasks-43-50_Transaction-Intent-Verify.md](../Group-C_MintPay-Processor-Implementation/02_Tasks-43-50_Transaction-Intent-Verify.md)
- **→ Next Document:** [02_Tasks-59-66_Credit-Response-Verify.md](02_Tasks-59-66_Credit-Response-Verify.md)

---

## Document Overview

This document covers the implementation of the eligibility service and Sri Lankan NIC validation system for BNPL applications. The service acts as the central hub for determining customer eligibility across both KOKO and MintPay providers, implementing comprehensive validation including order amounts, customer history, and Sri Lankan identity verification.

The implementation focuses on building a robust validation system that supports both old (9-digit + V/X) and new (12-digit) Sri Lankan NIC formats, with automatic age calculation and comprehensive error handling. The service integrates with existing customer management systems while providing a clean API interface for BNPL eligibility checks.

### Tasks in This Document

| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 51 | Create Eligibility Service | High | 90 min |
| 52 | Create KOKO Eligibility API | Medium | 60 min |
| 53 | Create MintPay Eligibility | Medium | 55 min |
| 54 | Create Order Amount Check | Low | 30 min |
| 55 | Create Customer History Check | Medium | 45 min |
| 56 | Create NIC Validation | Medium | 50 min |
| 57 | Create Old NIC Format | Low | 25 min |
| 58 | Create New NIC Format | Low | 25 min |

**Total Estimated Time:** ~6 hours 20 minutes

---

## Eligibility System Architecture

### Service Architecture

```
EligibilityService
    │
    ├── KOKOEligibilityAPI
    │       └── KOKO-specific validation rules
    │
    ├── MintPayEligibilityAPI
    │       └── MintPay-specific validation rules
    │
    ├── OrderAmountValidator
    │       ├── Min/Max amount checking
    │       └── Provider-specific limits
    │
    ├── CustomerHistoryValidator
    │       ├── Previous BNPL status check
    │       ├── Default history check
    │       └── Active installment check
    │
    └── NICValidator
            ├── OldNICValidator (9 digits + V/X)
            ├── NewNICValidator (12 digits)
            └── AgeCalculator (from NIC)
```

### Validation Flow

```
Customer Request
    │
    ▼
┌─────────────────────┐
│ Eligibility Service │
│ Entry Point         │
└─────────────────────┘
    │
    ▼
┌─────────────────────┐
│ Basic Validation    │
│ - Customer exists   │
│ - Order amount     │
└─────────────────────┘
    │
    ▼
┌─────────────────────┐
│ NIC Validation      │
│ - Format check     │
│ - Age calculation  │
└─────────────────────┘
    │
    ▼
┌─────────────────────┐
│ History Check       │
│ - Previous BNPL    │
│ - Default status   │
└─────────────────────┘
    │
    ▼
┌─────────────────────┐
│ Provider API        │
│ - KOKO / MintPay   │
│ - Final approval   │
└─────────────────────┘
    │
    ▼
┌─────────────────────┐
│ Response           │
│ - Approved/Denied  │
│ - Rejection reason │
└─────────────────────┘
```

### NIC Format Support

```
Old NIC Format (Pre-2016):
Format: 9 digits + V/X
Examples: 901234567V, 851234567X
├── First 2 digits: Birth year (90 = 1990, 85 = 1985)
├── Next 3 digits: Day of year (001-366)
├── Next 4 digits: Serial number
└── Last character: V (male) or X (female)

New NIC Format (Post-2016):
Format: 12 digits
Examples: 199012345678, 198512345678
├── First 4 digits: Birth year (1990, 1985)
├── Next 3 digits: Day of year (001-366)
├── Next 4 digits: Serial number
└── Last digit: Check digit

Age Calculation Logic:
- Old NIC: If year ≤ current_year % 100 → 20xx, else 19xx
- New NIC: Direct year extraction
- Day of year conversion to actual birth date
```

---

## Task 51: Create Eligibility Service

### Overview

**Objective:** Create the central eligibility service class that orchestrates all BNPL eligibility checks for both KOKO and MintPay providers. This service acts as the main entry point for eligibility verification.

**Purpose:** Provides a unified interface for eligibility checking with consistent validation logic, error handling, and response formatting across all BNPL providers.

**Location:** `backend/apps/bnpl/services/eligibility_service.py`

---

### Dependencies

**Model Dependencies:**
- Customer model with tenant support
- Order model for amount validation
- BNPL history models for tracking

**Configuration:**
- BNPL provider settings (min/max amounts)
- Age requirements (18+ years)
- History check thresholds

**External Dependencies:**
- Redis for caching eligibility results
- KOKO/MintPay API credentials
- Celery for async processing

---

### Instructions

#### Step 1: Create Service Base Structure

Create the main eligibility service file at `backend/apps/bnpl/services/eligibility_service.py`.

**Service Class Structure:**
- Main `EligibilityService` class with tenant support
- Dependency injection for validators and API clients
- Standardized response format with success/failure states
- Comprehensive logging for audit trails

**Core Methods:**
- `check_eligibility(customer, order_amount, provider)` - Main entry point
- `_validate_basic_requirements(customer, order_amount)` - Basic checks
- `_check_provider_specific(provider, customer, order_amount)` - Provider routing
- `_format_response(result, rejection_reasons)` - Response formatting

#### Step 2: Implement Validation Orchestration

**Validation Pipeline:**
1. Basic validation (customer exists, order amount valid)
2. NIC validation (format and age requirements)
3. Customer history validation (previous BNPL status)
4. Provider-specific validation (KOKO/MintPay rules)
5. Final eligibility determination

**Error Handling:**
- Validation exception handling with specific error codes
- Provider API failure handling with fallback logic
- Database connection error handling
- Rate limiting for repeated checks

#### Step 3: Configure Tenant Support

**Multi-Tenant Considerations:**
- Tenant-specific eligibility rules and limits
- Separate provider configurations per tenant
- Isolated customer history checks within tenant
- Tenant-aware caching with proper key prefixing

**Provider Management:**
- Dynamic provider selection based on tenant configuration
- Provider availability checking before validation
- Provider-specific timeout and retry configurations
- Provider response caching with appropriate TTL

#### Step 4: Implement Response Standardization

**Response Format:**
```python
{
    "eligible": boolean,
    "provider": "koko|mintpay",
    "customer_id": "uuid",
    "order_amount": decimal,
    "rejection_reasons": [list of reasons],
    "recommendation": "approve|review|decline",
    "expires_at": datetime,
    "metadata": {
        "validation_time": float,
        "checks_performed": [list],
        "provider_response_id": "string"
    }
}
```

**Status Codes:**
- `ELIGIBLE`: Customer approved for BNPL
- `INELIGIBLE`: Customer rejected with reasons
- `REQUIRES_REVIEW`: Manual review required
- `PROVIDER_ERROR`: Provider API unavailable
- `VALIDATION_ERROR`: Invalid input data

---

## Task 52: Create KOKO Eligibility API

### Overview

**Objective:** Implement the KOKO-specific eligibility API client that handles communication with KOKO's BNPL eligibility endpoint and processes their specific validation requirements.

**Purpose:** Provides dedicated integration with KOKO's eligibility service while implementing their specific business rules, response handling, and error management.

**Location:** `backend/apps/bnpl/services/koko_eligibility_api.py`

---

### Dependencies

**Service Dependencies:**
- Main eligibility service integration
- HTTP client with SSL certificate validation
- API key management with secure storage

**KOKO API Requirements:**
- KOKO merchant ID and API credentials
- Request signing with HMAC-SHA256
- Rate limiting compliance (10 requests/minute)
- Sandbox/production environment switching

---

### Instructions

#### Step 1: Configure KOKO API Client

Create the KOKO API client at `backend/apps/bnpl/services/koko_eligibility_api.py`.

**Client Configuration:**
- Base URL management for sandbox/production
- Request timeout configuration (30 seconds)
- SSL certificate verification and pinning
- Request/response logging for debugging

**Authentication Setup:**
- API key storage in environment variables
- Request signing implementation with merchant ID
- Timestamp-based nonce generation for security
- Header construction with required KOKO fields

#### Step 2: Implement Eligibility Request

**Request Payload Structure:**
- Customer information (NIC, phone, email)
- Order details (amount, items, merchant info)
- Risk assessment data (IP address, device info)
- Previous relationship data if available

**Request Validation:**
- Payload size limits (max 10KB)
- Required field validation per KOKO specs
- Data sanitization and encoding (UTF-8)
- Request ID generation for tracking

#### Step 3: Handle KOKO Response Processing

**Response Handling:**
- JSON response parsing with error handling
- Status code interpretation (200, 400, 401, 403, 429, 500)
- KOKO-specific error code mapping to internal codes
- Response signature verification for security

**Eligibility Status Mapping:**
```python
KOKO_STATUS_MAPPING = {
    "APPROVED": "ELIGIBLE",
    "DECLINED": "INELIGIBLE", 
    "PENDING": "REQUIRES_REVIEW",
    "INSUFFICIENT_DATA": "REQUIRES_REVIEW",
    "SYSTEM_ERROR": "PROVIDER_ERROR"
}
```

#### Step 4: Implement Error Handling

**API Error Management:**
- Network timeout handling with retry logic
- Rate limit handling with exponential backoff
- Authentication error handling with token refresh
- Server error handling with circuit breaker pattern

**KOKO-Specific Errors:**
- Invalid merchant configuration errors
- Customer data validation errors from KOKO
- Order amount outside KOKO's accepted range
- Duplicate request handling

---

## Task 53: Create MintPay Eligibility

### Overview

**Objective:** Implement the MintPay-specific eligibility API client that integrates with MintPay's BNPL eligibility service and handles their unique validation requirements.

**Purpose:** Provides dedicated MintPay integration with their specific business rules, response formats, and eligibility criteria while maintaining consistent interface with the main eligibility service.

**Location:** `backend/apps/bnpl/services/mintpay_eligibility_api.py`

---

### Dependencies

**Service Dependencies:**
- Main eligibility service integration
- Secure HTTP client with certificate validation
- OAuth2 token management for MintPay API

**MintPay API Requirements:**
- MintPay partner ID and client credentials
- OAuth2 token refresh mechanism
- Webhook validation for async responses
- Rate limiting compliance (15 requests/minute)

---

### Instructions

#### Step 1: Configure MintPay API Client

Create the MintPay API client at `backend/apps/bnpl/services/mintpay_eligibility_api.py`.

**OAuth2 Configuration:**
- Client credentials flow implementation
- Access token caching with Redis
- Automatic token refresh before expiration
- Token revocation handling on errors

**Request Configuration:**
- Content-Type: application/json
- Authorization header with Bearer token
- User-Agent header with application identification
- Request correlation ID for tracking

#### Step 2: Implement Eligibility Assessment

**Assessment Request Structure:**
- Customer profile (NIC, age, phone, address)
- Financial information (income, employment status)
- Order context (amount, merchant, product category)
- Risk indicators (transaction history, device fingerprint)

**MintPay-Specific Requirements:**
- Minimum age requirement (21 years vs 18 for KOKO)
- Employment verification preference
- Address verification requirements
- Phone number verification with OTP preference

#### Step 3: Handle Async Response Processing

**Synchronous Response:**
- Immediate approval/decline for simple cases
- Pre-approved customer recognition
- Basic validation failure responses
- Rate limit and error responses

**Asynchronous Processing:**
- Webhook endpoint for delayed decisions
- Response correlation using request ID
- Timeout handling for delayed responses (5 minutes)
- Status polling as backup mechanism

#### Step 4: Implement MintPay Response Mapping

**Response Status Codes:**
```python
MINTPAY_STATUS_MAPPING = {
    "INSTANT_APPROVAL": "ELIGIBLE",
    "CONDITIONAL_APPROVAL": "REQUIRES_REVIEW",
    "DECLINED": "INELIGIBLE",
    "REVIEW_REQUIRED": "REQUIRES_REVIEW",
    "PROCESSING": "REQUIRES_REVIEW",
    "ERROR": "PROVIDER_ERROR"
}
```

**Rejection Reason Mapping:**
- Age-related rejections
- Income verification failures
- Credit history concerns
- Existing debt obligations
- Geographic restrictions

---

## Task 54: Create Order Amount Check

### Overview

**Objective:** Implement order amount validation logic that enforces minimum and maximum BNPL limits per provider and ensures compliance with regulatory requirements.

**Purpose:** Validates order amounts against provider-specific limits and regulatory constraints before proceeding with eligibility checks, preventing unnecessary API calls for invalid amounts.

**Location:** `backend/apps/bnpl/validators/amount_validator.py`

---

### Dependencies

**Configuration Dependencies:**
- Provider-specific amount limits in settings
- Tenant-specific overrides for amount limits
- Currency conversion rates for multi-currency support

**Validation Requirements:**
- KOKO limits: LKR 5,000 - LKR 250,000
- MintPay limits: LKR 3,000 - LKR 500,000
- Tenant-specific limit overrides
- Regulatory compliance limits

---

### Instructions

#### Step 1: Create Amount Validator Class

Create the amount validator at `backend/apps/bnpl/validators/amount_validator.py`.

**Validator Structure:**
- `OrderAmountValidator` class with provider-specific validation
- Static limit configuration with runtime overrides
- Currency validation and conversion support
- Decimal precision handling for LKR amounts

**Validation Methods:**
- `validate_amount(amount, provider, tenant)` - Main validation
- `get_provider_limits(provider, tenant)` - Dynamic limit retrieval
- `format_amount(amount)` - Standardized formatting
- `get_validation_errors(amount, limits)` - Error generation

#### Step 2: Configure Provider Limits

**KOKO Amount Configuration:**
- Minimum order: LKR 5,000
- Maximum order: LKR 250,000
- Maximum total exposure: LKR 500,000 per customer
- Installment period limits affecting amounts

**MintPay Amount Configuration:**
- Minimum order: LKR 3,000
- Maximum order: LKR 500,000
- First-time customer limit: LKR 50,000
- Returning customer higher limits

#### Step 3: Implement Dynamic Limit Adjustment

**Tenant-Specific Overrides:**
- Tenant configuration for custom limits
- Business type considerations (B2B vs B2C)
- Merchant category-based adjustments
- Seasonal limit modifications

**Customer-Specific Adjustments:**
- Customer credit history impact on limits
- Previous successful BNPL completion bonuses
- Risk assessment-based limit reductions
- VIP customer limit increases

#### Step 4: Add Regulatory Compliance

**Central Bank Compliance:**
- Consumer protection amount limits
- Debt-to-income ratio considerations
- Maximum installment period impact on amounts
- Interest rate cap compliance

**Error Response Formatting:**
```python
{
    "valid": false,
    "errors": [
        {
            "code": "AMOUNT_TOO_LOW",
            "message": "Order amount below minimum limit",
            "min_amount": 5000,
            "provided_amount": 2500
        }
    ],
    "suggestions": [
        "Increase order amount to minimum LKR 5,000",
        "Consider different BNPL provider"
    ]
}
```

---

## Task 55: Create Customer History Check

### Overview

**Objective:** Implement comprehensive customer history validation that checks previous BNPL usage, payment behavior, and current obligations to determine eligibility for new BNPL applications.

**Purpose:** Prevents over-lending and identifies customers with poor payment history or excessive current BNPL debt, ensuring responsible lending practices and regulatory compliance.

**Location:** `backend/apps/bnpl/validators/customer_history_validator.py`

---

### Dependencies

**Model Dependencies:**
- BNPLHistory model for tracking applications
- PaymentHistory model for payment tracking
- CustomerDefault model for default tracking

**External Data:**
- Credit bureau integration (future)
- Inter-provider data sharing (future)
- Banking transaction history integration

---

### Instructions

#### Step 1: Create History Validator

Create the customer history validator at `backend/apps/bnpl/validators/customer_history_validator.py`.

**Validator Components:**
- `CustomerHistoryValidator` main class
- Database query optimization for history checks
- Caching layer for frequently accessed customer data
- Scoring algorithm for history-based decisions

**Validation Categories:**
- Payment history analysis
- Current debt obligations
- Default and delinquency records
- Frequency of BNPL applications

#### Step 2: Implement Payment History Analysis

**Payment Performance Metrics:**
- On-time payment percentage (last 12 months)
- Average days late for overdue payments
- Number of missed payments
- Early payment behavior tracking

**Scoring Criteria:**
- Excellent: 95%+ on-time, no missed payments
- Good: 90-94% on-time, max 1 missed payment
- Fair: 80-89% on-time, max 2 missed payments
- Poor: <80% on-time or 3+ missed payments

#### Step 3: Check Current Obligations

**Active BNPL Tracking:**
- Current outstanding principal amounts
- Number of active installment plans
- Monthly payment obligation totals
- Provider distribution of current debt

**Debt Limits:**
- Maximum 3 active BNPL plans per customer
- Maximum total outstanding: LKR 300,000
- Maximum monthly payment: 30% of declared income
- Provider-specific exposure limits

#### Step 4: Implement Default Detection

**Default Indicators:**
- Payments overdue by 60+ days
- Written-off debt in last 24 months
- Legal action or collection activity
- Bankruptcy or insolvency records

**Risk Assessment:**
```python
RISK_CATEGORIES = {
    "LOW": {
        "score_range": (800, 1000),
        "max_exposure": 500000,
        "approval": "AUTO_APPROVE"
    },
    "MEDIUM": {
        "score_range": (600, 799),
        "max_exposure": 200000,
        "approval": "CONDITIONAL"
    },
    "HIGH": {
        "score_range": (400, 599),
        "max_exposure": 50000,
        "approval": "MANUAL_REVIEW"
    },
    "VERY_HIGH": {
        "score_range": (0, 399),
        "max_exposure": 0,
        "approval": "AUTO_DECLINE"
    }
}
```

---

## Task 56: Create NIC Validation

### Overview

**Objective:** Implement comprehensive Sri Lankan National Identity Card (NIC) validation supporting both old format (9 digits + V/X) and new format (12 digits) with automatic format detection and age calculation.

**Purpose:** Ensures customer identity verification meets Sri Lankan standards while extracting demographic information (age, gender) for eligibility assessment and regulatory compliance.

**Location:** `backend/apps/bnpl/validators/nic_validator.py`

---

### Dependencies

**Validation Libraries:**
- Regular expression libraries for pattern matching
- Date calculation libraries for age computation
- Unicode handling for proper character encoding

**Reference Data:**
- Valid NIC format specifications from Department of Registration
- Leap year calculation for accurate date validation
- Age calculation considering Sri Lankan calendar system

---

### Instructions

#### Step 1: Create Base NIC Validator

Create the main NIC validator at `backend/apps/bnpl/validators/nic_validator.py`.

**Validator Architecture:**
- `NICValidator` base class with format detection
- `OldNICValidator` for 9-digit + V/X format
- `NewNICValidator` for 12-digit format  
- `NICParser` for extracting birth information

**Format Detection Logic:**
- Automatic detection between old/new formats
- Input sanitization (remove spaces, convert case)
- Checksum validation for new format
- Format-specific validation routing

#### Step 2: Implement Common Validation Logic

**Input Sanitization:**
- Trim whitespace and convert to uppercase
- Remove common separators (spaces, dashes)
- Validate character encoding (ASCII only)
- Length validation before format detection

**Birth Date Extraction:**
- Day-of-year conversion to actual date
- Leap year handling for accurate dates
- Invalid date detection (day 366 in non-leap years)
- Century determination for old format NICs

#### Step 3: Create Age Calculation System

**Age Calculation Logic:**
- Current date comparison with birth date
- Precise age in years, months, days
- Age validation for BNPL eligibility (18+ years)
- Leap year birthday handling

**Age-Based Eligibility:**
- Minimum age: 18 years for BNPL applications
- Maximum age: 70 years for certain providers
- Age verification accuracy requirements
- Birth date reasonableness validation

#### Step 4: Implement Comprehensive Error Handling

**Validation Error Types:**
- Invalid format errors with specific messages
- Invalid birth date errors
- Age requirement failures
- Checksum validation failures for new format

**Error Response Structure:**
```python
{
    "valid": false,
    "format_detected": "old|new|invalid",
    "errors": [
        {
            "code": "INVALID_FORMAT",
            "field": "nic_number",
            "message": "NIC format not recognized"
        }
    ],
    "extracted_data": {
        "birth_date": "1990-05-15",
        "age_years": 35,
        "gender": "male|female",
        "format": "old|new"
    }
}
```

---

## Task 57: Create Old NIC Format

### Overview

**Objective:** Implement validation logic specifically for Sri Lankan old format NICs (9 digits + V/X) used before 2016, including accurate birth date extraction and gender identification.

**Purpose:** Supports legacy NIC format validation with proper century calculation and gender determination for customers who haven't updated to new format NICs.

**Location:** `backend/apps/bnpl/validators/old_nic_validator.py`

---

### Dependencies

**Base Dependencies:**
- Base NIC validator class extension
- Date manipulation libraries for century calculation
- Regular expression patterns for format validation

**Format Specifications:**
- 9 digits followed by V (male) or X (female)
- First 2 digits represent birth year
- Next 3 digits represent day of year (001-366)
- Next 4 digits are serial number

---

### Instructions

#### Step 1: Implement Old Format Pattern Matching

Create the old NIC validator at `backend/apps/bnpl/validators/old_nic_validator.py`.

**Pattern Validation:**
- Regular expression: `^[0-9]{9}[VX]$`
- Case-insensitive matching (v/x accepted)
- Digit validation for numeric portions
- V/X validation for gender indicator

**Format Components:**
- Year extraction (positions 0-1)
- Day of year extraction (positions 2-4)
- Serial number extraction (positions 5-8)
- Gender indicator extraction (position 9)

#### Step 2: Implement Century Calculation

**Century Determination Logic:**
```python
def calculate_birth_year(two_digit_year, current_year):
    # Example: If current year is 2026
    # Years 00-26 → 2000-2026 (born in 2000s)
    # Years 27-99 → 1927-1999 (born in 1900s)
    current_two_digit = current_year % 100
    
    if two_digit_year <= current_two_digit:
        return 2000 + two_digit_year
    else:
        return 1900 + two_digit_year
```

**Edge Cases:**
- Year 00 handling (year 2000 vs 1900)
- Transition year considerations
- Future date prevention
- Maximum age validation (150 years)

#### Step 3: Implement Day-of-Year Conversion

**Calendar Conversion:**
- Day 001-031: January (days 1-31)
- Day 032-059: February (days 1-28/29)
- Day 060-090: March (days 1-31)
- Continue through December (day 366)

**Leap Year Handling:**
- Leap year detection for birth year
- Day 366 validation (only valid in leap years)
- February 29th handling
- Invalid day-of-year error handling

#### Step 4: Gender and Validation Rules

**Gender Determination:**
- V suffix indicates male
- X suffix indicates female
- Case-insensitive validation
- Gender extraction for demographic data

**Serial Number Validation:**
- 4-digit serial number (positions 5-8)
- No specific validation rules for serial
- Used for uniqueness within same birth date
- Extracted for completeness

**Complete Validation Flow:**
```python
def validate_old_nic(nic_string):
    # 1. Pattern matching
    # 2. Component extraction
    # 3. Year century calculation
    # 4. Day-of-year validation
    # 5. Birth date construction
    # 6. Age calculation
    # 7. Gender determination
    # 8. Return structured result
```

---

## Task 58: Create New NIC Format

### Overview

**Objective:** Implement validation logic for Sri Lankan new format NICs (12 digits) introduced in 2016, including checksum validation and direct birth date extraction.

**Purpose:** Supports current NIC format validation with enhanced security through checksum verification and simplified birth date extraction without century calculation complexity.

**Location:** `backend/apps/bnpl/validators/new_nic_validator.py`

---

### Dependencies

**Base Dependencies:**
- Base NIC validator class extension
- Checksum calculation algorithms
- Date validation libraries

**Format Specifications:**
- 12 digits total
- First 4 digits represent birth year (1900-2099)
- Next 3 digits represent day of year (001-366)
- Next 4 digits are serial number
- Last digit is checksum for validation

---

### Instructions

#### Step 1: Implement New Format Pattern Matching

Create the new NIC validator at `backend/apps/bnpl/validators/new_nic_validator.py`.

**Pattern Validation:**
- Regular expression: `^[0-9]{12}$`
- All numeric validation
- Exact 12-digit length requirement
- No alphabetic characters allowed

**Format Components:**
- Birth year extraction (positions 0-3)
- Day of year extraction (positions 4-6)
- Serial number extraction (positions 7-10)
- Checksum digit extraction (position 11)

#### Step 2: Implement Checksum Validation

**Checksum Algorithm:**
The new NIC format includes a checksum digit calculated using a specific algorithm provided by the Department of Registration of Persons.

**Calculation Steps:**
1. Extract first 11 digits
2. Apply weighting factors to each digit
3. Calculate sum of weighted values
4. Apply modulo operation
5. Compare with provided checksum digit

**Validation Process:**
- Calculate expected checksum from first 11 digits
- Compare with actual 12th digit
- Reject NICs with invalid checksums
- Handle edge cases in checksum calculation

#### Step 3: Implement Direct Date Extraction

**Birth Year Processing:**
- Direct 4-digit year extraction (no century calculation)
- Year range validation (1900-2099)
- Future birth date prevention
- Maximum age validation (125 years)

**Day-of-Year Processing:**
- Same calendar conversion as old format
- Leap year validation for birth year
- Day 366 validation in non-leap years
- Month/day calculation and validation

#### Step 4: Enhanced Validation Features

**Serial Number Analysis:**
- 4-digit serial number extraction
- Potential gender indication (odd/even patterns)
- Regional coding possibilities (future enhancement)
- Uniqueness validation within birth date

**Advanced Validation:**
```python
def validate_new_nic(nic_string):
    # 1. Length and pattern validation
    # 2. Checksum calculation and verification
    # 3. Birth year extraction and validation
    # 4. Day-of-year extraction and validation
    # 5. Birth date construction
    # 6. Age calculation and eligibility
    # 7. Serial number analysis
    # 8. Return comprehensive result
```

**Enhanced Error Reporting:**
- Checksum mismatch errors
- Invalid year range errors
- Invalid day-of-year errors
- Comprehensive validation status
- Suggestions for common input errors

**Gender Determination:**
While the new NIC format doesn't explicitly encode gender, analysis of serial number patterns may provide gender indication as an optional feature for future enhancement.

---

## Summary

This document has covered the implementation of the core eligibility service and NIC validation system for BNPL applications. The next document will cover credit score integration, response handling, and verification flows to complete the eligibility system.

### Key Deliverables Completed

1. **Central Eligibility Service** - Unified eligibility checking across providers
2. **Provider API Integration** - KOKO and MintPay specific implementations  
3. **Order Amount Validation** - Provider-specific limit enforcement
4. **Customer History Checking** - Comprehensive payment history analysis
5. **NIC Validation System** - Support for both old and new Sri Lankan formats
6. **Age Verification** - Automatic age calculation from NIC data

### Integration Points

The services created in this document integrate with:
- Customer management system for profile data
- Order management system for amount validation  
- Payment history tracking for eligibility decisions
- Provider APIs for final approval decisions
- Caching layer for performance optimization
- Logging system for audit and compliance

These components form the foundation for comprehensive BNPL eligibility checking with proper validation, security, and compliance measures.