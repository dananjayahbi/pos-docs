# Tasks 59-66: Credit Response & Verification

> **Phase:** 09 - Integrations & Sri Lanka Localizations  
> **SubPhase:** 04 - KOKO/MintPay BNPL  
> **Group:** D - Eligibility & Verification  
> **Document:** 02 of 02  
> **Tasks Covered:** 59, 60, 61, 62, 63, 64, 65, 66

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-51-58_Service-NIC-Validation.md](01_Tasks-51-58_Service-NIC-Validation.md)
- **→ Next Document:** [../Group-E_Installment-Management/01_Tasks-67-74_Installment-Schedule.md](../Group-E_Installment-Management/01_Tasks-67-74_Installment-Schedule.md)

---

## Document Overview

This document covers the implementation of credit verification, response handling, and eligibility result caching for the BNPL system. It completes the eligibility verification pipeline with phone validation, age verification, credit score integration, and comprehensive response processing.

The implementation focuses on building robust verification systems with proper error handling, caching strategies for performance optimization, and comprehensive testing to ensure the complete eligibility flow functions correctly across all providers and validation scenarios.

### Tasks in This Document

| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 59 | Create Phone Validation | Low | 35 min |
| 60 | Create Age Verification | Medium | 40 min |
| 61 | Create Credit Score Check | Medium | 55 min |
| 62 | Create Approval Response | Low | 30 min |
| 63 | Create Rejection Response | Low | 35 min |
| 64 | Create Rejection Reasons | Low | 25 min |
| 65 | Create Eligibility Cache | Medium | 50 min |
| 66 | Verify Eligibility Flow | Low | 40 min |

**Total Estimated Time:** ~5 hours 10 minutes

---

## Credit Verification Architecture

### Verification Pipeline

```
Phone Validation
    │
    ▼
Age Verification (from NIC)
    │
    ▼
Credit Score Check
    │
    ├── Approved ──────────► Approval Response
    │                            │
    │                            ▼
    │                      Cache Result
    │
    └── Rejected ──────────► Rejection Response
                                 │
                                 ├── Rejection Reasons
                                 │
                                 ▼
                           Cache Result
```

### Response Processing

```
Provider Response
    │
    ▼
┌─────────────────────┐
│ Response Parser     │
│ - Status extraction │
│ - Reason mapping    │
└─────────────────────┘
    │
    ▼
┌─────────────────────┐
│ Response Formatter  │
│ - Standard format   │
│ - Error handling    │
└─────────────────────┘
    │
    ▼
┌─────────────────────┐
│ Cache Manager       │
│ - Result storage    │
│ - TTL management    │
└─────────────────────┘
    │
    ▼
┌─────────────────────┐
│ Final Response      │
│ - Client format     │
│ - Audit logging     │
└─────────────────────┘
```

### Caching Strategy

```
Redis Cache Structure:

bnpl:eligibility:{tenant}:{customer_id}:{hash}
├── result: "eligible|ineligible|review"
├── provider: "koko|mintpay"
├── amount: order_amount
├── reasons: [rejection_reasons]
├── expires_at: timestamp
├── created_at: timestamp
└── metadata: {...}

Cache Keys:
- Primary: customer + order hash
- Secondary: customer eligibility status
- Invalidation: payment status updates
```

---

## Task 59: Create Phone Validation

### Overview

**Objective:** Implement Sri Lankan phone number validation supporting +94 country code format with mobile and landline number validation according to Telecommunications Regulatory Commission standards.

**Purpose:** Ensures customer contact information meets Sri Lankan telecommunications standards for SMS/call verification and provides consistent phone number formatting across the system.

**Location:** `backend/apps/bnpl/validators/phone_validator.py`

---

### Dependencies

**Validation Requirements:**
- +94 country code mandatory for BNPL applications
- Mobile number prefixes (70, 71, 72, 74, 75, 76, 77, 78)
- Landline area codes and number formats
- International format standardization

**Integration Dependencies:**
- SMS service integration for OTP verification
- Phone number normalization for consistent storage
- Carrier identification for verification routing

---

### Instructions

#### Step 1: Create Phone Validator Class

Create the phone validator at `backend/apps/bnpl/validators/phone_validator.py`.

**Validator Structure:**
- `PhoneValidator` main class with format detection
- Support for multiple input formats (+94, 0094, 94, local format)
- Automatic formatting to international standard (+94XXXXXXXXX)
- Mobile vs landline classification

**Input Format Support:**
- International: +94771234567, 0094771234567
- National: 0771234567
- Local mobile: 771234567
- Error handling for invalid formats

#### Step 2: Implement Mobile Number Validation

**Mobile Prefixes (Sri Lanka):**
```python
MOBILE_PREFIXES = {
    '70': 'Mobitel',
    '71': 'Mobitel', 
    '72': 'Hutch',
    '74': 'Dialog',
    '75': 'Airtel',
    '76': 'Dialog',
    '77': 'Dialog',
    '78': 'Hutch'
}
```

**Validation Rules:**
- Must start with valid mobile prefix
- Total length: 9 digits after country code
- No spaces or special characters in stored format
- Carrier identification for future SMS routing

#### Step 3: Implement Landline Validation

**Area Codes (Major Cities):**
```python
LANDLINE_AREA_CODES = {
    '11': 'Colombo',
    '31': 'Negombo',
    '33': 'Gampaha', 
    '34': 'Kalutara',
    '36': 'Avissawella',
    '37': 'Panadura',
    '38': 'Horana',
    '45': 'Kegalle',
    '47': 'Nuwara Eliya',
    '51': 'Hatton',
    '52': 'Nuwara Eliya',
    '54': 'Nawalapitiya',
    '57': 'Bandarawela',
    '63': 'Matale',
    '65': 'Dambulla',
    '66': 'Kandy',
    '67': 'Katugastota',
    '81': 'Anuradhapura',
    '91': 'Jaffna'
}
```

**Landline Format:**
- Area code (2 digits) + local number (7 digits)
- Total: +94 + area code + local number
- Business landlines accepted for merchant verification

#### Step 4: Implement Validation and Formatting

**Phone Number Normalization:**
```python
def normalize_phone(phone_input):
    # Remove all non-numeric except +
    # Add +94 prefix if missing
    # Validate against known patterns
    # Return standardized format
    
    examples:
    "0771234567" → "+94771234567"
    "94771234567" → "+94771234567" 
    "+94 77 123 4567" → "+94771234567"
```

**Validation Response:**
```python
{
    "valid": true,
    "formatted": "+94771234567",
    "type": "mobile|landline", 
    "carrier": "Dialog|Mobitel|Hutch|Airtel",
    "area": "colombo|mobile",
    "verification_methods": ["sms", "call"],
    "errors": []
}
```

**Error Handling:**
- Invalid country code errors
- Unrecognized prefix/area code errors
- Invalid length errors
- Format suggestion for common mistakes

---

## Task 60: Create Age Verification

### Overview

**Objective:** Implement age verification logic that extracts birth dates from validated NIC numbers and determines BNPL eligibility based on age requirements for different providers and regulatory compliance.

**Purpose:** Ensures customers meet minimum age requirements for BNPL services while providing age-based risk assessment and regulatory compliance for consumer protection laws.

**Location:** `backend/apps/bnpl/validators/age_validator.py`

---

### Dependencies

**NIC Integration:**
- NIC validation services (both old and new formats)
- Birth date extraction from validated NICs
- Age calculation with precision handling

**Regulatory Requirements:**
- Minimum age: 18 years for BNPL eligibility
- Maximum age: 65 years for certain providers
- Age verification accuracy requirements
- Consumer protection compliance

---

### Instructions

#### Step 1: Create Age Verification Service

Create the age validator at `backend/apps/bnpl/validators/age_validator.py`.

**Service Components:**
- `AgeValidator` class with precise calculation
- Integration with NIC validation results
- Provider-specific age requirement checking
- Age-based risk assessment scoring

**Age Calculation Precision:**
- Years, months, days precision
- Leap year birthday handling
- Timezone considerations (Sri Lanka Standard Time)
- Anniversary date calculation accuracy

#### Step 2: Implement Provider-Specific Requirements

**Age Requirements by Provider:**
```python
PROVIDER_AGE_REQUIREMENTS = {
    "KOKO": {
        "minimum_age": 18,
        "maximum_age": 65, 
        "first_time_minimum": 21,
        "preferred_range": (25, 55)
    },
    "MINTPAY": {
        "minimum_age": 21,
        "maximum_age": 70,
        "first_time_minimum": 23,
        "preferred_range": (28, 60)
    }
}
```

**Risk Assessment by Age Group:**
```python
AGE_RISK_CATEGORIES = {
    "18-24": {
        "risk_level": "HIGH",
        "max_amount": 50000,
        "verification_required": ["employment", "income"]
    },
    "25-35": {
        "risk_level": "MEDIUM",
        "max_amount": 200000,
        "verification_required": ["income"]
    },
    "36-50": {
        "risk_level": "LOW", 
        "max_amount": 500000,
        "verification_required": []
    },
    "51-65": {
        "risk_level": "MEDIUM",
        "max_amount": 300000,
        "verification_required": ["income", "health"]
    },
    "65+": {
        "risk_level": "HIGH",
        "max_amount": 100000,
        "verification_required": ["income", "health", "guarantor"]
    }
}
```

#### Step 3: Implement Birth Date Validation

**Birth Date Reasonableness Checks:**
- Minimum age validation (18 years)
- Maximum age validation (120 years practical limit)
- Future birth date prevention
- Invalid date detection (Feb 30, etc.)

**Precision Requirements:**
- Exact age calculation to the day
- Leap year birthday considerations
- Time zone handling for Sri Lanka
- Anniversary date determination

#### Step 4: Create Age-Based Eligibility Logic

**Eligibility Determination:**
```python
def determine_age_eligibility(age, provider, customer_history):
    # 1. Basic age requirement check
    # 2. Provider-specific rules
    # 3. First-time customer adjustments
    # 4. Risk assessment based on age group
    # 5. Amount limit calculation
    # 6. Additional verification requirements
```

**Response Structure:**
```python
{
    "eligible": true,
    "age_years": 28,
    "age_months": 6,
    "age_days": 15,
    "birth_date": "1995-07-15",
    "risk_category": "MEDIUM",
    "max_amount": 200000,
    "additional_verification": ["income"],
    "age_group": "25-35",
    "provider_eligible": {
        "KOKO": true,
        "MINTPAY": true
    }
}
```

---

## Task 61: Create Credit Score Check

### Overview

**Objective:** Implement credit score integration and assessment logic that evaluates customer creditworthiness through internal scoring and future external credit bureau integration.

**Purpose:** Provides comprehensive credit assessment for BNPL applications using customer payment history, current obligations, and external credit data to make informed lending decisions.

**Location:** `backend/apps/bnpl/services/credit_score_service.py`

---

### Dependencies

**Internal Data Sources:**
- Customer payment history from BNPL transactions
- Current debt obligations and payment performance
- Order history and transaction patterns

**Future External Integrations:**
- Credit Information Bureau (CRIB) Sri Lanka
- Banking transaction history APIs
- Cross-provider BNPL data sharing

---

### Instructions

#### Step 1: Create Credit Score Service

Create the credit score service at `backend/apps/bnpl/services/credit_score_service.py`.

**Service Architecture:**
- `CreditScoreService` main orchestrator
- `InternalScoreCalculator` for historical data
- `ExternalScoreIntegrator` for bureau data (future)
- `ScoreAggregator` for final score computation

**Scoring Components:**
- Payment history (40% weight)
- Current debt levels (30% weight) 
- Credit utilization (15% weight)
- Account age and diversity (15% weight)

#### Step 2: Implement Internal Credit Scoring

**Payment History Analysis:**
```python
PAYMENT_HISTORY_SCORING = {
    "on_time_payments": {
        "100%": 400,  # Perfect payment history
        "95-99%": 350,
        "90-94%": 300,
        "80-89%": 250,
        "70-79%": 200,
        "<70%": 100
    },
    "missed_payments": {
        "0": 100,      # No missed payments
        "1": 80,
        "2": 60,
        "3": 40,
        "4+": 20
    },
    "days_overdue": {
        "never": 100,
        "1-7": 80,
        "8-30": 60,
        "31-60": 30,
        "60+": 0
    }
}
```

**Debt Level Assessment:**
```python
DEBT_LEVEL_SCORING = {
    "debt_to_income": {
        "0-10%": 300,
        "11-20%": 250, 
        "21-30%": 200,
        "31-40%": 150,
        "41-50%": 100,
        ">50%": 50
    },
    "total_outstanding": {
        "0-50000": 200,
        "50001-150000": 150,
        "150001-300000": 100,
        "300001-500000": 50,
        ">500000": 25
    }
}
```

#### Step 3: Implement Score Aggregation

**Final Score Calculation:**
```python
def calculate_credit_score(customer_data):
    payment_score = calculate_payment_history_score()
    debt_score = calculate_debt_level_score()
    utilization_score = calculate_utilization_score()
    history_score = calculate_account_history_score()
    
    final_score = (
        payment_score * 0.40 +
        debt_score * 0.30 +
        utilization_score * 0.15 +
        history_score * 0.15
    )
    
    return normalize_score(final_score, 300, 850)
```

**Score Ranges and Actions:**
```python
CREDIT_SCORE_RANGES = {
    "EXCELLENT": {
        "range": (750, 850),
        "action": "AUTO_APPROVE",
        "max_amount": 500000,
        "interest_rate": "prime"
    },
    "GOOD": {
        "range": (650, 749), 
        "action": "AUTO_APPROVE",
        "max_amount": 300000,
        "interest_rate": "prime + 2%"
    },
    "FAIR": {
        "range": (550, 649),
        "action": "CONDITIONAL_APPROVE", 
        "max_amount": 150000,
        "interest_rate": "prime + 5%"
    },
    "POOR": {
        "range": (450, 549),
        "action": "MANUAL_REVIEW",
        "max_amount": 50000,
        "interest_rate": "prime + 8%"
    },
    "VERY_POOR": {
        "range": (300, 449),
        "action": "AUTO_DECLINE",
        "max_amount": 0,
        "interest_rate": "N/A"
    }
}
```

#### Step 4: Prepare External Integration Framework

**CRIB Integration Preparation:**
- API endpoint configuration for future connection
- Data mapping for CRIB response format
- Score normalization from CRIB scale to internal scale
- Error handling for CRIB service unavailability

**Cross-Provider Data Framework:**
- Data sharing agreement compliance structure
- Privacy and security compliance for data sharing
- Score impact calculation from external BNPL data
- Duplicate detection across providers

---

## Task 62: Create Approval Response

### Overview

**Objective:** Implement standardized approval response formatting and processing that provides consistent approval messages across all providers with proper metadata and next-step instructions.

**Purpose:** Ensures approved BNPL applications receive properly formatted responses with all necessary information for transaction continuation and proper audit trail maintenance.

**Location:** `backend/apps/bnpl/services/approval_response_handler.py`

---

### Dependencies

**Service Integration:**
- Eligibility service result processing
- Provider-specific approval data handling
- Transaction continuation workflow

**Response Requirements:**
- Standardized approval format across providers
- Transaction reference generation
- Expiration time management
- Next-step instruction generation

---

### Instructions

#### Step 1: Create Approval Response Handler

Create the approval response handler at `backend/apps/bnpl/services/approval_response_handler.py`.

**Handler Structure:**
- `ApprovalResponseHandler` main class
- Provider-specific approval processing
- Transaction reference generation
- Response expiration management

**Core Functionality:**
- Approval response standardization
- Transaction ID generation and tracking
- Approval expiration time calculation
- Next-step workflow generation

#### Step 2: Implement Provider Response Mapping

**KOKO Approval Processing:**
```python
KOKO_APPROVAL_MAPPING = {
    "status": "APPROVED",
    "approval_code": "transaction_id",
    "credit_limit": "approved_amount",
    "interest_rate": "rate_percentage",
    "terms": "installment_terms",
    "expires_in": "validity_seconds"
}
```

**MintPay Approval Processing:**
```python
MINTPAY_APPROVAL_MAPPING = {
    "decision": "APPROVED", 
    "reference": "approval_reference",
    "amount": "sanctioned_amount",
    "tenure": "repayment_period",
    "rate": "interest_rate",
    "valid_until": "expiry_timestamp"
}
```

#### Step 3: Generate Standardized Approval Response

**Standard Response Format:**
```python
{
    "status": "APPROVED",
    "provider": "KOKO|MINTPAY",
    "customer_id": "customer_uuid",
    "transaction_reference": "TXN202601310001",
    "approval_details": {
        "approved_amount": 150000.00,
        "credit_limit": 200000.00,
        "interest_rate": 12.5,
        "processing_fee": 1500.00,
        "installment_count": 6,
        "monthly_payment": 26250.00,
        "total_payable": 157500.00
    },
    "terms_and_conditions": {
        "agreement_url": "https://...",
        "terms_version": "v2.1",
        "acceptance_required": true
    },
    "validity": {
        "expires_at": "2026-01-31T18:00:00+05:30",
        "expires_in_seconds": 3600
    },
    "next_steps": [
        {
            "step": "ACCEPT_TERMS",
            "description": "Review and accept terms",
            "url": "/bnpl/accept-terms/TXN202601310001",
            "required": true
        },
        {
            "step": "COMPLETE_PURCHASE",
            "description": "Complete your purchase",
            "url": "/checkout/complete/TXN202601310001",
            "required": true
        }
    ],
    "metadata": {
        "approved_at": "2026-01-31T17:00:00+05:30",
        "decision_time": 2.3,
        "risk_score": 745,
        "approval_confidence": 0.92
    }
}
```

#### Step 4: Implement Approval Workflow

**Post-Approval Processing:**
- Transaction record creation in database
- Approval notification to customer (SMS/email)
- Merchant notification of approved transaction
- Approval expiration timer setup

**Audit Trail Creation:**
- Approval decision logging
- Risk assessment data archival
- Provider response archival
- Customer interaction logging

---

## Task 63: Create Rejection Response

### Overview

**Objective:** Implement standardized rejection response formatting that provides clear, compliant rejection messages with appropriate reasons and alternative suggestions while maintaining regulatory compliance.

**Purpose:** Ensures rejected BNPL applications receive properly formatted responses with clear explanations, compliance with consumer protection regulations, and alternative options where appropriate.

**Location:** `backend/apps/bnpl/services/rejection_response_handler.py`

---

### Dependencies

**Regulatory Compliance:**
- Consumer protection law compliance for rejection reasons
- Fair lending practice requirements
- Privacy protection in rejection messaging

**Service Integration:**
- Rejection reason categorization and mapping
- Alternative provider suggestion logic
- Customer appeal process integration

---

### Instructions

#### Step 1: Create Rejection Response Handler

Create the rejection response handler at `backend/apps/bnpl/services/rejection_response_handler.py`.

**Handler Architecture:**
- `RejectionResponseHandler` main processor
- Compliance-aware rejection message generation
- Alternative suggestion engine
- Appeal process integration

**Response Processing:**
- Provider rejection reason parsing
- Internal rejection reason mapping
- Compliance filtering of rejection details
- Alternative option generation

#### Step 2: Implement Compliant Rejection Messaging

**Rejection Categories:**
```python
REJECTION_CATEGORIES = {
    "AGE_REQUIREMENT": {
        "public_message": "Age requirements not met",
        "compliance_note": "Minimum age 18 years required",
        "suggestion": "Apply when you reach minimum age"
    },
    "INCOME_INSUFFICIENT": {
        "public_message": "Income verification incomplete",
        "compliance_note": "Cannot verify sufficient income",
        "suggestion": "Provide additional income documentation"
    },
    "CREDIT_HISTORY": {
        "public_message": "Credit assessment incomplete", 
        "compliance_note": "Cannot establish creditworthiness",
        "suggestion": "Build credit history and reapply"
    },
    "DEBT_TO_INCOME": {
        "public_message": "Current obligations exceed limits",
        "compliance_note": "Debt-to-income ratio too high",
        "suggestion": "Reduce existing debt and reapply"
    },
    "IDENTITY_VERIFICATION": {
        "public_message": "Identity verification incomplete",
        "compliance_note": "Cannot verify provided identity",
        "suggestion": "Ensure NIC details are accurate"
    }
}
```

#### Step 3: Generate Standard Rejection Response

**Rejection Response Format:**
```python
{
    "status": "REJECTED",
    "provider": "KOKO|MINTPAY", 
    "customer_id": "customer_uuid",
    "reference": "REJ202601310001",
    "rejection_details": {
        "primary_reason": "CREDIT_HISTORY",
        "secondary_reasons": ["DEBT_TO_INCOME"],
        "public_message": "We're unable to approve your application at this time",
        "detailed_reasons": [
            "Credit assessment requirements not met",
            "Current debt obligations exceed our guidelines"
        ]
    },
    "improvement_suggestions": [
        {
            "category": "CREDIT_BUILDING",
            "suggestion": "Build payment history with smaller commitments",
            "timeline": "3-6 months"
        },
        {
            "category": "DEBT_REDUCTION", 
            "suggestion": "Reduce existing debt obligations",
            "timeline": "Immediate"
        }
    ],
    "alternatives": {
        "other_providers": [
            {
                "provider": "MintPay",
                "likelihood": "MEDIUM",
                "note": "May have different criteria"
            }
        ],
        "smaller_amount": {
            "available": true,
            "suggested_amount": 50000,
            "note": "Lower amount may be approved"
        }
    },
    "appeal_process": {
        "available": true,
        "deadline": "2026-02-14T23:59:59+05:30",
        "instructions": "Submit additional documentation via customer portal",
        "contact": "appeals@company.com"
    },
    "metadata": {
        "rejected_at": "2026-01-31T17:00:00+05:30",
        "decision_time": 1.8,
        "risk_score": 425,
        "can_reapply_after": "2026-04-30T00:00:00+05:30"
    }
}
```

#### Step 4: Implement Alternative Suggestions

**Provider Routing Logic:**
- If KOKO rejects, suggest MintPay if criteria different
- Amount reduction suggestions based on partial approval
- Timeline suggestions for reapplication
- Credit improvement recommendations

**Compliance Safeguards:**
- No discriminatory language in rejection reasons
- Privacy protection in detailed explanations
- Fair lending practice compliance
- Consumer protection law adherence

---

## Task 64: Create Rejection Reasons

### Overview

**Objective:** Implement comprehensive rejection reason categorization and mapping system that translates provider-specific rejection codes into standardized, compliant, and customer-friendly rejection explanations.

**Purpose:** Provides consistent rejection reason classification across providers while ensuring regulatory compliance, customer understanding, and actionable feedback for improvement.

**Location:** `backend/apps/bnpl/services/rejection_reason_mapper.py`

---

### Dependencies

**Provider Integration:**
- KOKO rejection code mapping
- MintPay rejection code mapping
- Internal validation failure codes

**Compliance Requirements:**
- Consumer protection compliance
- Fair lending practice adherence
- Privacy protection in reason disclosure

---

### Instructions

#### Step 1: Create Rejection Reason Mapper

Create the rejection reason mapper at `backend/apps/bnpl/services/rejection_reason_mapper.py`.

**Mapper Architecture:**
- `RejectionReasonMapper` main class
- Provider-specific code translation
- Compliance filtering for public disclosure
- Reason priority and categorization

**Mapping Components:**
- Provider code to internal reason mapping
- Internal reason to public message mapping
- Improvement suggestion generation
- Alternative option identification

#### Step 2: Implement Provider Code Mapping

**KOKO Rejection Codes:**
```python
KOKO_REJECTION_CODES = {
    "E001": {
        "internal_code": "AGE_REQUIREMENT",
        "category": "ELIGIBILITY",
        "severity": "HIGH",
        "public_safe": True
    },
    "E002": {
        "internal_code": "IDENTITY_VERIFICATION_FAILED", 
        "category": "VERIFICATION",
        "severity": "HIGH",
        "public_safe": True
    },
    "E003": {
        "internal_code": "INSUFFICIENT_INCOME",
        "category": "FINANCIAL",
        "severity": "MEDIUM", 
        "public_safe": False
    },
    "E004": {
        "internal_code": "CREDIT_SCORE_LOW",
        "category": "CREDITWORTHINESS",
        "severity": "MEDIUM",
        "public_safe": False
    },
    "E005": {
        "internal_code": "DEBT_TO_INCOME_HIGH",
        "category": "FINANCIAL",
        "severity": "MEDIUM",
        "public_safe": True
    }
}
```

**MintPay Rejection Codes:**
```python
MINTPAY_REJECTION_CODES = {
    "DECLINED_AGE": {
        "internal_code": "AGE_REQUIREMENT",
        "category": "ELIGIBILITY", 
        "severity": "HIGH",
        "public_safe": True
    },
    "DECLINED_VERIFICATION": {
        "internal_code": "IDENTITY_VERIFICATION_FAILED",
        "category": "VERIFICATION",
        "severity": "HIGH", 
        "public_safe": True
    },
    "DECLINED_CREDIT": {
        "internal_code": "CREDIT_ASSESSMENT_FAILED",
        "category": "CREDITWORTHINESS",
        "severity": "MEDIUM",
        "public_safe": False
    },
    "DECLINED_POLICY": {
        "internal_code": "POLICY_VIOLATION",
        "category": "COMPLIANCE",
        "severity": "HIGH",
        "public_safe": False
    }
}
```

#### Step 3: Create Public Message Templates

**Customer-Friendly Messages:**
```python
PUBLIC_REASON_TEMPLATES = {
    "AGE_REQUIREMENT": {
        "message": "Age requirements for BNPL services not met",
        "explanation": "You must be at least 18 years old to apply",
        "suggestion": "Please apply once you meet the minimum age requirement",
        "improvable": False
    },
    "IDENTITY_VERIFICATION_FAILED": {
        "message": "Identity verification could not be completed",
        "explanation": "We couldn't verify the provided identity information",
        "suggestion": "Please ensure NIC details are correct and try again", 
        "improvable": True
    },
    "INSUFFICIENT_INCOME": {
        "message": "Income verification requirements not met",
        "explanation": "We couldn't verify sufficient income for the requested amount",
        "suggestion": "Provide additional income documentation or reduce amount",
        "improvable": True
    },
    "CREDIT_ASSESSMENT_FAILED": {
        "message": "Credit assessment could not be completed favorably",
        "explanation": "Current credit profile doesn't meet approval criteria",
        "suggestion": "Build credit history and apply again in 3-6 months",
        "improvable": True
    },
    "DEBT_TO_INCOME_HIGH": {
        "message": "Current debt obligations exceed guidelines",
        "explanation": "Existing financial commitments are too high for additional credit",
        "suggestion": "Reduce existing debt and reapply",
        "improvable": True
    }
}
```

#### Step 4: Implement Reason Prioritization

**Priority System:**
```python
REASON_PRIORITY = {
    1: ["POLICY_VIOLATION", "FRAUD_SUSPECTED"],
    2: ["AGE_REQUIREMENT", "IDENTITY_VERIFICATION_FAILED"],
    3: ["CREDIT_SCORE_LOW", "CREDIT_ASSESSMENT_FAILED"],
    4: ["DEBT_TO_INCOME_HIGH", "INSUFFICIENT_INCOME"],
    5: ["AMOUNT_EXCEEDS_LIMIT", "EMPLOYMENT_VERIFICATION"]
}
```

**Multiple Reason Handling:**
- Display primary reason prominently
- Include secondary reasons if customer-actionable
- Limit total reasons to avoid overwhelming customer
- Prioritize actionable reasons over fixed constraints

**Compliance Filtering:**
- Filter sensitive financial details
- Avoid discriminatory language
- Protect privacy in reason explanations
- Ensure constructive tone in suggestions

---

## Task 65: Create Eligibility Cache

### Overview

**Objective:** Implement Redis-based caching system for eligibility results to improve performance, reduce provider API calls, and provide consistent eligibility decisions within validity periods.

**Purpose:** Optimizes eligibility checking performance while ensuring cache consistency, proper expiration, and invalidation strategies for changed customer circumstances.

**Location:** `backend/apps/bnpl/services/eligibility_cache_service.py`

---

### Dependencies

**Infrastructure Dependencies:**
- Redis server configuration for caching
- Cache key management and namespace isolation
- TTL management and automatic expiration

**Data Dependencies:**
- Customer data change detection
- Order amount variation handling
- Provider availability status

---

### Instructions

#### Step 1: Create Cache Service Architecture

Create the eligibility cache service at `backend/apps/bnpl/services/eligibility_cache_service.py`.

**Cache Service Components:**
- `EligibilityCacheService` main manager
- Cache key generation with proper namespacing
- TTL management with business rule alignment
- Cache invalidation trigger system

**Cache Strategy:**
- Primary cache: Full eligibility results
- Secondary cache: Partial validation results
- Negative cache: Recent rejections to prevent retry spam
- Performance cache: Frequently accessed customer data

#### Step 2: Implement Cache Key Strategy

**Cache Key Structure:**
```python
CACHE_KEY_PATTERNS = {
    "eligibility_result": "bnpl:eligibility:{tenant}:{customer_id}:{amount_hash}",
    "customer_profile": "bnpl:customer:{tenant}:{customer_id}",
    "negative_cache": "bnpl:rejected:{tenant}:{customer_id}",
    "provider_status": "bnpl:provider:{provider}:status",
    "rate_limit": "bnpl:ratelimit:{customer_id}:{provider}"
}
```

**Hash Generation:**
```python
def generate_cache_key(tenant, customer_id, order_amount, provider):
    # Create deterministic hash from order details
    order_hash = hashlib.md5(
        f"{order_amount}:{provider}:{datetime.now().strftime('%Y-%m-%d')}"
        .encode()
    ).hexdigest()[:8]
    
    return f"bnpl:eligibility:{tenant}:{customer_id}:{order_hash}"
```

#### Step 3: Configure Cache TTL Management

**TTL Configuration by Result Type:**
```python
CACHE_TTL_SETTINGS = {
    "approved_result": {
        "ttl_seconds": 3600,  # 1 hour for approvals
        "extend_on_hit": False,
        "invalidate_on_payment_update": True
    },
    "rejected_result": {
        "ttl_seconds": 86400,  # 24 hours for rejections
        "extend_on_hit": False,
        "invalidate_on_profile_update": True
    },
    "customer_profile": {
        "ttl_seconds": 1800,  # 30 minutes for profile data
        "extend_on_hit": True,
        "invalidate_on_update": True
    },
    "provider_limits": {
        "ttl_seconds": 21600,  # 6 hours for provider settings
        "extend_on_hit": True,
        "invalidate_on_config_change": True
    }
}
```

**Dynamic TTL Calculation:**
- Approval results: Shorter TTL for high-risk customers
- Rejection results: Longer TTL to prevent retry spam
- Profile data: Variable TTL based on data freshness
- Provider data: Configuration-driven TTL

#### Step 4: Implement Cache Invalidation

**Invalidation Triggers:**
```python
INVALIDATION_TRIGGERS = {
    "customer_payment_status_change": [
        "eligibility_result",
        "customer_profile", 
        "negative_cache"
    ],
    "customer_profile_update": [
        "eligibility_result",
        "customer_profile"
    ],
    "provider_settings_change": [
        "eligibility_result",
        "provider_status"
    ],
    "manual_invalidation": [
        "eligibility_result",
        "customer_profile",
        "negative_cache"
    ]
}
```

**Cache Warming Strategy:**
- Pre-populate frequently accessed customer profiles
- Background refresh of expiring eligibility results
- Predictive caching based on browsing patterns
- Bulk cache refresh during low-traffic periods

**Cache Monitoring:**
- Hit/miss ratio monitoring per cache type
- Cache size and memory usage tracking
- TTL distribution analysis
- Invalidation frequency monitoring

---

## Task 66: Verify Eligibility Flow

### Overview

**Objective:** Implement comprehensive end-to-end testing and verification of the complete eligibility flow including all validation steps, provider integrations, caching, and response handling.

**Purpose:** Ensures the entire eligibility system functions correctly across all scenarios, edge cases, and provider combinations while meeting performance and reliability requirements.

**Location:** `backend/apps/bnpl/tests/test_eligibility_flow.py`

---

### Dependencies

**Testing Requirements:**
- Complete eligibility service implementation
- Provider API test environments (sandbox)
- Test data sets covering all scenarios
- Performance benchmarking tools

**Integration Testing:**
- Database test fixtures
- Redis cache testing setup
- Mock provider API responses
- End-to-end scenario testing

---

### Instructions

#### Step 1: Create Comprehensive Test Suite

Create the eligibility flow test suite at `backend/apps/bnpl/tests/test_eligibility_flow.py`.

**Test Categories:**
- Unit tests for individual validators
- Integration tests for service interactions
- End-to-end flow testing
- Performance and load testing
- Error handling and recovery testing

**Test Data Setup:**
- Valid customer profiles for each scenario
- Invalid data sets for negative testing
- Provider response mocks for all cases
- Performance baseline data

#### Step 2: Implement Happy Path Testing

**Successful Eligibility Flow:**
```python
def test_complete_approval_flow():
    # 1. Valid customer with good credit
    # 2. Valid NIC (both old and new format)
    # 3. Valid phone number (+94)
    # 4. Age requirements met
    # 5. Order amount within limits
    # 6. Clean payment history
    # 7. Provider approval
    # 8. Cache storage
    # 9. Response formatting
```

**Test Scenarios:**
- First-time customer approval
- Returning customer with good history
- Maximum amount approval
- Minimum amount approval
- Cross-provider approvals

#### Step 3: Implement Error and Edge Case Testing

**Validation Failures:**
```python
def test_validation_failures():
    # Age validation failures
    test_under_age_rejection()
    test_over_age_rejection()
    
    # NIC validation failures  
    test_invalid_old_nic_format()
    test_invalid_new_nic_format()
    test_invalid_checksum()
    
    # Phone validation failures
    test_invalid_phone_format()
    test_non_sri_lankan_phone()
    
    # Amount validation failures
    test_amount_below_minimum()
    test_amount_above_maximum()
    
    # History validation failures
    test_poor_payment_history()
    test_excessive_current_debt()
```

**Provider Integration Failures:**
```python
def test_provider_failures():
    # API connectivity issues
    test_provider_timeout()
    test_provider_service_unavailable()
    test_network_connection_failure()
    
    # Authentication failures
    test_invalid_api_credentials()
    test_expired_tokens()
    
    # Rate limiting
    test_rate_limit_exceeded()
    test_concurrent_request_limits()
```

#### Step 4: Performance and Load Testing

**Performance Benchmarks:**
```python
PERFORMANCE_BENCHMARKS = {
    "eligibility_check_response_time": {
        "target": "< 3 seconds",
        "maximum": "< 10 seconds",
        "timeout": "30 seconds"
    },
    "cache_hit_ratio": {
        "target": "> 80%",
        "minimum": "> 60%"
    },
    "concurrent_requests": {
        "target": "100 requests/second",
        "maximum": "500 requests/second"
    }
}
```

**Load Testing Scenarios:**
- Concurrent eligibility checks
- Cache performance under load
- Provider API rate limiting behavior
- Database query performance
- Memory usage optimization

**Monitoring and Alerts:**
- Response time monitoring
- Error rate tracking
- Cache performance metrics
- Provider API health monitoring
- System resource utilization

---

## Summary

This document has completed the implementation of the credit verification, response handling, and caching systems for BNPL eligibility verification. The comprehensive testing ensures reliability and performance across all scenarios.

### Key Deliverables Completed

1. **Phone Validation** - Sri Lankan +94 format validation with carrier identification
2. **Age Verification** - NIC-based age calculation with provider-specific requirements
3. **Credit Score Integration** - Internal scoring with external integration framework
4. **Approval Response Handling** - Standardized approval formatting across providers
5. **Rejection Response System** - Compliant rejection messaging with improvement suggestions
6. **Rejection Reason Mapping** - Provider code translation to customer-friendly messages
7. **Eligibility Caching** - Redis-based performance optimization with proper invalidation
8. **End-to-End Verification** - Comprehensive testing covering all scenarios and edge cases

### System Integration

The completed eligibility system provides:
- **Unified Interface**: Single entry point for all BNPL eligibility checks
- **Multi-Provider Support**: Seamless integration with KOKO and MintPay
- **Sri Lankan Compliance**: NIC validation, phone formats, and regulatory adherence
- **Performance Optimization**: Intelligent caching with proper invalidation strategies
- **Comprehensive Validation**: Age, identity, credit, and financial verification
- **Audit Trail**: Complete logging and monitoring for compliance and debugging
- **Error Recovery**: Robust error handling with graceful degradation
- **Customer Experience**: Clear messaging and actionable feedback for all outcomes

The eligibility verification system is now ready for integration with the installment management system in Group-E.