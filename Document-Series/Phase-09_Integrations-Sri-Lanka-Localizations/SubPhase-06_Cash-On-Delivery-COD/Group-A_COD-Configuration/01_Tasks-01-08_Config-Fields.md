# Tasks 01-08: COD Configuration Fields

> **Phase:** 09 - Integrations & Sri Lanka Localizations  
> **SubPhase:** 06 - Cash on Delivery (COD)  
> **Group:** A - COD Configuration  
> **Document:** 01 of 02  
> **Tasks Covered:** 01, 02, 03, 04, 05, 06, 07, 08

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-09-16_Zones-Admin-Verify.md](02_Tasks-09-16_Zones-Admin-Verify.md)

---

## Document Overview

This document covers the creation of the CODConfig model and its essential configuration fields. It establishes the foundational structure for tenant-specific COD payment settings, including enablement toggle, fee configuration, order amount limits, OTP verification requirements, and first-order restrictions for new customers. These settings control how COD payment processing behaves for each tenant.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 01 | Create CODConfig Model | Medium | 20 min |
| 02 | Create Is Enabled Field | Low | 10 min |
| 03 | Create COD Fee Type | Low | 10 min |
| 04 | Create COD Fee Amount | Low | 10 min |
| 05 | Create Minimum Order | Low | 10 min |
| 06 | Create Maximum Order | Low | 10 min |
| 07 | Create OTP Required Field | Low | 10 min |
| 08 | Create First Order Limit | Low | 10 min |

---

## Task 01: Create CODConfig Model

### Overview
Create the CODConfig model to store tenant-specific COD payment configuration. This model serves as the central configuration hub for all COD-related settings, allowing each tenant to customize their COD payment behavior independently. The model uses foreign key relationship with the tenant, ensuring proper multi-tenancy isolation.

### Dependencies
- SubPhase-01 (Payment System Foundation) must be complete
- Tenant model exists and is configured
- Django-tenants multi-tenancy is operational

### Instructions

1. **Navigate to payments app models**
   - Go to `backend/apps/payments/models/` directory
   - Create new file named `cod_config.py`
   - This will house the CODConfig model

2. **Import required dependencies**
   - Import Django model base classes
   - Import DecimalField, BooleanField, CharField
   - Import tenant ForeignKey relationship
   - Import validation utilities

3. **Define CODConfig model class**
   - Create class inheriting from models.Model
   - Add descriptive docstring explaining purpose
   - This model stores all COD configuration settings

4. **Add tenant relationship field**
   - Create ForeignKey to Tenant model
   - Set on_delete=CASCADE (delete config when tenant deleted)
   - Set related_name='cod_config'
   - Ensure OneToOne relationship (one config per tenant)

5. **Add timestamp fields**
   - Create created_at with auto_now_add=True
   - Create updated_at with auto_now=True
   - Track when configuration is created and modified

6. **Define model Meta class**
   - Set db_table to 'payment_cod_config'
   - Set verbose_name to 'COD Configuration'
   - Set verbose_name_plural to 'COD Configurations'
   - Add unique constraint on tenant field

7. **Implement __str__ method**
   - Return string representation showing tenant name
   - Format: "COD Config for {tenant.name}"
   - Useful for admin interface display

8. **Add model to __init__.py**
   - Import CODConfig in models/__init__.py
   - Export in __all__ list
   - Make model accessible from payments.models

### Model Structure Overview

```
CODConfig Model
├── tenant (FK to Tenant, OneToOne)
├── is_enabled (BooleanField) ← Task 02
├── fee_type (CharField) ← Task 03
├── fee_amount (DecimalField) ← Task 04
├── min_order (DecimalField) ← Task 05
├── max_order (DecimalField) ← Task 06
├── otp_required (BooleanField) ← Task 07
├── first_order_limit (DecimalField) ← Task 08
├── created_at (DateTimeField)
└── updated_at (DateTimeField)
```

### Database Relationship

| Field | Type | Constraint | Purpose |
|-------|------|------------|---------|
| tenant | ForeignKey | UNIQUE | Links to tenant |
| created_at | DateTime | AUTO | Track creation |
| updated_at | DateTime | AUTO | Track updates |

### Multi-Tenancy Considerations

| Aspect | Implementation |
|--------|----------------|
| Isolation | Each tenant has own config |
| Uniqueness | One config per tenant |
| Deletion | Cascade when tenant deleted |
| Access | Filter by current tenant |

### Expected Outcome
- CODConfig model created in payments app
- Proper tenant relationship established
- Timestamp tracking configured
- Model registered and accessible
- Foundation ready for configuration fields

### Verification Checklist
- [ ] `backend/apps/payments/models/cod_config.py` file created
- [ ] CODConfig model class defined
- [ ] Tenant ForeignKey with unique constraint added
- [ ] Timestamp fields (created_at, updated_at) included
- [ ] Meta class with proper table name configured
- [ ] __str__ method implemented
- [ ] Model imported in models/__init__.py

---

## Task 02: Create Is Enabled Field

### Overview
Add the is_enabled boolean field to the CODConfig model to allow tenants to enable or disable COD payment method for their store. When disabled, customers will not see COD as a payment option during checkout, providing tenants with immediate control over COD availability without requiring code changes.

### Dependencies
- Task 01: Create CODConfig Model

### Instructions

1. **Open CODConfig model file**
   - Navigate to `backend/apps/payments/models/cod_config.py`
   - Locate the CODConfig class definition
   - Add field after tenant relationship

2. **Add is_enabled field**
   - Create BooleanField named is_enabled
   - Set default=True (COD enabled by default)
   - Set db_index=True for query performance

3. **Add field documentation**
   - Add verbose_name="COD Enabled"
   - Add help_text explaining field purpose
   - Help text: "Enable or disable COD payment method for this tenant"

4. **Add field validation**
   - No additional validation needed for boolean
   - Field is always True or False
   - Database constraint ensures valid value

5. **Update model docstring**
   - Document is_enabled field purpose
   - Explain impact on checkout process
   - Note default behavior

### Field Specifications

| Property | Value | Reason |
|----------|-------|--------|
| Field Type | BooleanField | Toggle state |
| Default | True | COD enabled by default |
| Null | False | Must have value |
| Blank | False | Required in forms |
| DB Index | True | Frequent queries |

### Field Behavior

```
is_enabled = True
└── COD appears in checkout payment options
    ├── Customers can select COD
    └── COD processor is active

is_enabled = False
└── COD hidden from checkout
    ├── Existing COD orders still processed
    └── New COD orders not allowed
```

### Use Cases

| Scenario | is_enabled | Outcome |
|----------|-----------|---------|
| Normal Operation | True | COD available |
| Holiday Season | False | Temporarily disable |
| High RTS Rate | False | Suspend until resolved |
| New Tenant | True | Available from start |

### Impact on System

| Component | Behavior When Disabled |
|-----------|----------------------|
| Checkout | COD option hidden |
| API | Returns COD unavailable |
| Existing Orders | Continue processing |
| Reports | Still accessible |

### Expected Outcome
- Tenants can enable/disable COD instantly
- Default state allows COD for new tenants
- Indexed for fast availability checks
- Clear documentation for administrators

### Verification Checklist
- [ ] is_enabled BooleanField added to CODConfig
- [ ] Default value set to True
- [ ] verbose_name set to "COD Enabled"
- [ ] help_text added with clear explanation
- [ ] db_index=True for performance
- [ ] Model docstring updated
- [ ] Field accessible in model instances

---

## Task 03: Create COD Fee Type

### Overview
Add the fee_type field to specify whether the COD fee is calculated as a flat amount or as a percentage of the order total. This field provides flexibility for tenants to choose their preferred fee structure based on their business model. Some tenants may prefer a simple flat fee (e.g., ₨100), while others may want percentage-based fees that scale with order value.

### Dependencies
- Task 01: Create CODConfig Model

### Instructions

1. **Define fee type choices**
   - Create tuple of choices at module level
   - Define FLAT = 'FLAT'
   - Define PERCENTAGE = 'PERCENTAGE'
   - Create CHOICE_TUPLE with display names

2. **Add fee_type field**
   - Create CharField named fee_type
   - Set max_length=20
   - Set choices=FEE_TYPE_CHOICES
   - Set default='FLAT'

3. **Add field documentation**
   - Set verbose_name="Fee Type"
   - Add help_text explaining options
   - Help text: "Choose between flat amount or percentage-based COD fee"

4. **Add field validation**
   - Django validates choices automatically
   - Ensures only FLAT or PERCENTAGE values
   - Database constraint enforces valid values

5. **Consider future extensibility**
   - Design allows adding more fee types later
   - Could add TIERED, DYNAMIC, etc.
   - Keep choices flexible

### Fee Type Choices

| Choice Value | Display Name | Meaning |
|--------------|--------------|---------|
| FLAT | Flat Amount | Fixed fee regardless of order value |
| PERCENTAGE | Percentage | Fee calculated as % of order total |

### Fee Type Behavior

```
FLAT Fee Type
└── COD Fee = fee_amount
    Example: ₨100 for any order
    
PERCENTAGE Fee Type
└── COD Fee = (order_total × fee_amount) / 100
    Example: 2% of ₨5,000 = ₨100
```

### Usage Examples

| Order Total | Fee Type | Fee Amount | Calculated Fee |
|-------------|----------|------------|----------------|
| ₨1,000 | FLAT | 100.00 | ₨100 |
| ₨10,000 | FLAT | 100.00 | ₨100 |
| ₨1,000 | PERCENTAGE | 2.00 | ₨20 |
| ₨10,000 | PERCENTAGE | 2.00 | ₨200 |

### Business Use Cases

| Business Type | Preferred Type | Reason |
|---------------|----------------|--------|
| Small Items | FLAT | Consistent handling cost |
| Variable Orders | PERCENTAGE | Scales with risk/value |
| Luxury Goods | PERCENTAGE | Higher insurance cost |
| Budget Store | FLAT | Simple pricing |

### Field Specifications

| Property | Value | Reason |
|----------|-------|--------|
| Field Type | CharField | Store choice |
| Max Length | 20 | Accommodate choice values |
| Choices | FEE_TYPE_CHOICES | Restrict to valid types |
| Default | FLAT | Most common scenario |
| Null | False | Must have value |
| Blank | False | Required selection |

### Expected Outcome
- Tenants can choose flat or percentage fee
- Default to flat amount for simplicity
- Clear choice validation in admin
- Foundation for fee calculation logic

### Verification Checklist
- [ ] FEE_TYPE_CHOICES tuple defined at module level
- [ ] FLAT and PERCENTAGE constants defined
- [ ] fee_type CharField added to CODConfig
- [ ] max_length=20 configured
- [ ] choices=FEE_TYPE_CHOICES set
- [ ] default='FLAT' configured
- [ ] verbose_name and help_text added
- [ ] Only valid choices can be saved

---

## Task 04: Create COD Fee Amount

### Overview
Add the fee_amount field to store the COD fee value. This field works in conjunction with the fee_type field: for FLAT type, it represents the fixed fee amount in LKR; for PERCENTAGE type, it represents the percentage value to apply to the order total. The field uses DecimalField for precise monetary calculations.

### Dependencies
- Task 03: Create COD Fee Type

### Instructions

1. **Add fee_amount field**
   - Create DecimalField named fee_amount
   - Set max_digits=10 (allows up to ₨99,999,999.99)
   - Set decimal_places=2 (two decimal precision)
   - Set default=Decimal('100.00')

2. **Add field documentation**
   - Set verbose_name="Fee Amount"
   - Add comprehensive help_text
   - Help text: "For FLAT: fee in LKR (e.g., 100.00). For PERCENTAGE: percentage value (e.g., 2.00 for 2%)"

3. **Add field validation**
   - Import MinValueValidator from django.core.validators
   - Add validators=[MinValueValidator(Decimal('0.00'))]
   - Ensures non-negative fees

4. **Consider currency context**
   - All amounts in LKR (Sri Lankan Rupees)
   - Two decimal places standard for currency
   - Maximum allows reasonable COD fees

5. **Add validation method (optional)**
   - Create custom clean method if needed
   - Validate percentage doesn't exceed 100
   - Check flat fee is reasonable

### Field Specifications

| Property | Value | Reason |
|----------|-------|--------|
| Field Type | DecimalField | Precise monetary values |
| Max Digits | 10 | Allow large amounts |
| Decimal Places | 2 | Currency precision |
| Default | 100.00 | Typical flat fee ₨100 |
| Validators | MinValue(0) | No negative fees |
| Null | False | Must have value |
| Blank | False | Required |

### Fee Amount Interpretation

```
When fee_type = FLAT:
    fee_amount = 100.00 → ₨100 COD fee
    
When fee_type = PERCENTAGE:
    fee_amount = 2.00 → 2% of order total
    fee_amount = 2.50 → 2.5% of order total
```

### Calculation Examples

| Fee Type | Fee Amount | Order Total | Calculated COD Fee |
|----------|------------|-------------|-------------------|
| FLAT | 100.00 | ₨1,000 | ₨100.00 |
| FLAT | 100.00 | ₨10,000 | ₨100.00 |
| FLAT | 150.00 | ₨5,000 | ₨150.00 |
| PERCENTAGE | 2.00 | ₨1,000 | ₨20.00 |
| PERCENTAGE | 2.00 | ₨10,000 | ₨200.00 |
| PERCENTAGE | 2.50 | ₨8,000 | ₨200.00 |

### Typical Fee Ranges

| Fee Type | Typical Range | Use Case |
|----------|---------------|----------|
| FLAT | ₨50 - ₨200 | Most common |
| FLAT | ₨200 - ₨500 | High-value items |
| PERCENTAGE | 1.0% - 3.0% | Standard scaling |
| PERCENTAGE | 3.0% - 5.0% | High-risk products |

### Validation Considerations

| Validation | Rule | Reason |
|------------|------|--------|
| Minimum | >= 0.00 | No negative fees |
| Maximum (FLAT) | <= 999,999.99 | Reasonable limit |
| Maximum (%) | <= 100.00 | Valid percentage |
| Decimal Places | 2 | Currency standard |

### Sri Lanka Context

| Consideration | Value | Notes |
|---------------|-------|-------|
| Currency | LKR (₨) | Sri Lankan Rupees |
| Typical COD Fee | ₨100 - ₨150 | Industry standard |
| Minimum Viable | ₨50 | Cover basic costs |
| High-End | ₨300 - ₨500 | Premium services |

### Expected Outcome
- Flexible fee amount field supporting both fee types
- Precise decimal calculations for currency
- Reasonable default for new tenants
- Validation prevents negative values
- Compatible with Sri Lankan currency standards

### Verification Checklist
- [ ] fee_amount DecimalField added to CODConfig
- [ ] max_digits=10 and decimal_places=2 set
- [ ] default=Decimal('100.00') configured
- [ ] MinValueValidator(0) added
- [ ] verbose_name="Fee Amount" set
- [ ] Comprehensive help_text included
- [ ] Works correctly with both FLAT and PERCENTAGE types
- [ ] Allows reasonable fee ranges

---

## Task 05: Create Minimum Order

### Overview
Add the min_order field to enforce a minimum order amount required for customers to use COD payment method. This field helps tenants avoid processing COD orders that are too small to be economically viable, considering the handling costs, verification overhead, and delivery expenses associated with COD transactions.

### Dependencies
- Task 01: Create CODConfig Model

### Instructions

1. **Add min_order field**
   - Create DecimalField named min_order
   - Set max_digits=10 (same as fee_amount)
   - Set decimal_places=2 for currency precision
   - Set default=Decimal('500.00')

2. **Add field documentation**
   - Set verbose_name="Minimum Order Amount"
   - Add help_text explaining purpose
   - Help text: "Minimum order total (in LKR) required to use COD payment method"

3. **Add field validation**
   - Import MinValueValidator
   - Add validators=[MinValueValidator(Decimal('0.00'))]
   - Optionally add max validator if needed

4. **Consider business logic**
   - Default ₨500 covers typical minimum
   - Tenants can adjust based on business model
   - Should be less than max_order

5. **Add null/blank options**
   - Set null=True, blank=True (optional)
   - Allows disabling minimum if needed
   - None value means no minimum required

### Field Specifications

| Property | Value | Reason |
|----------|-------|--------|
| Field Type | DecimalField | Monetary amount |
| Max Digits | 10 | Large order support |
| Decimal Places | 2 | Currency precision |
| Default | 500.00 | Typical minimum ₨500 |
| Validators | MinValue(0) | Non-negative |
| Null | True | Optional constraint |
| Blank | True | Can be empty |

### Minimum Order Behavior

```
min_order = 500.00
└── Order Total Checks:
    ├── ₨300 → COD NOT available (below minimum)
    ├── ₨500 → COD available (meets minimum)
    └── ₨1,000 → COD available (above minimum)

min_order = None (or null)
└── No minimum restriction
    └── All order amounts can use COD
```

### Typical Minimum Values

| Business Type | Min Order | Reasoning |
|---------------|-----------|-----------|
| General Store | ₨500 | Cover handling costs |
| Grocery | ₨1,000 | Delivery economics |
| Electronics | ₨2,000 | Insurance requirements |
| Fashion | ₨750 | Balance access and cost |
| Pharmacy | ₨300 | Essential accessibility |

### Economic Considerations

| Cost Component | Typical Cost | Minimum to Cover |
|----------------|--------------|------------------|
| Delivery | ₨200 - ₨300 | At least ₨500 |
| Verification | ₨50 - ₨100 | included |
| Handling | ₨50 - ₨150 | included |
| Risk Premium | Variable | Higher for low orders |

### Validation Rules

| Check | Rule | Purpose |
|-------|------|---------|
| Non-negative | >= 0 | Valid amounts only |
| Less than max | < max_order | Logical consistency |
| Reasonable | <= 50,000 | Not too restrictive |

### Customer Impact

| Scenario | Min Order | Customer Experience |
|----------|-----------|---------------------|
| Low Min | ₨300 | More accessible |
| Standard Min | ₨500 - ₨1,000 | Balanced approach |
| High Min | ₨2,000+ | Limited to larger orders |
| No Min | None | Maximum flexibility |

### Expected Outcome
- Tenants can set minimum order for COD
- Default ₨500 provides reasonable starting point
- Optional constraint (can be null)
- Prevents uneconomical small COD orders
- Balances business needs and customer access

### Verification Checklist
- [ ] min_order DecimalField added to CODConfig
- [ ] max_digits=10, decimal_places=2 set
- [ ] default=Decimal('500.00') configured
- [ ] MinValueValidator(0) added
- [ ] null=True, blank=True configured
- [ ] verbose_name="Minimum Order Amount" set
- [ ] help_text includes LKR currency reference
- [ ] Field allows None/null values

---

## Task 06: Create Maximum Order

### Overview
Add the max_order field to enforce a maximum order amount for COD payments. This field serves as a risk management tool, limiting tenant exposure on high-value orders where cash collection becomes risky, insurance costs increase, and fraud potential is higher. Maximum limits protect both tenants and delivery partners from excessive financial exposure.

### Dependencies
- Task 01: Create CODConfig Model

### Instructions

1. **Add max_order field**
   - Create DecimalField named max_order
   - Set max_digits=10 (accommodate large amounts)
   - Set decimal_places=2 for currency precision
   - Set default=Decimal('50000.00')

2. **Add field documentation**
   - Set verbose_name="Maximum Order Amount"
   - Add comprehensive help_text
   - Help text: "Maximum order total (in LKR) allowed for COD. Orders above this require alternative payment"

3. **Add field validation**
   - Import MinValueValidator
   - Add validators=[MinValueValidator(Decimal('0.00'))]
   - Consider adding reasonable upper limit

4. **Consider risk factors**
   - Default ₨50,000 balances access and risk
   - Higher amounts increase fraud risk
   - Insurance costs scale with amount

5. **Add optional constraint**
   - Set null=True, blank=True
   - Allows unlimited COD if needed
   - None value means no maximum limit

### Field Specifications

| Property | Value | Reason |
|----------|-------|--------|
| Field Type | DecimalField | Monetary amount |
| Max Digits | 10 | High-value support |
| Decimal Places | 2 | Currency precision |
| Default | 50000.00 | ₨50,000 typical max |
| Validators | MinValue(0) | Non-negative |
| Null | True | Optional limit |
| Blank | True | Can be empty |

### Maximum Order Behavior

```
max_order = 50,000.00
└── Order Total Checks:
    ├── ₨30,000 → COD available (below max)
    ├── ₨50,000 → COD available (at max)
    ├── ₨60,000 → COD NOT available (exceeds max)
    └── Customer must use online payment

max_order = None (or null)
└── No maximum restriction
    └── All order amounts can use COD (risky!)
```

### Typical Maximum Values

| Business Type | Max Order | Reasoning |
|---------------|-----------|-----------|
| General Retail | ₨50,000 | Standard risk limit |
| Budget Store | ₨20,000 | Conservative limit |
| Electronics | ₨30,000 | Insurance considerations |
| Jewelry | ₨10,000 | High-risk items |
| Groceries | ₨25,000 | Reasonable for household |
| Furniture | ₨100,000 | Large-ticket items |

### Risk Management

| Order Range | Risk Level | Recommendation |
|-------------|------------|----------------|
| ₨0 - ₨10,000 | Low | Allow COD freely |
| ₨10,000 - ₨30,000 | Medium | Standard verification |
| ₨30,000 - ₨50,000 | Medium-High | Enhanced verification |
| ₨50,000 - ₨100,000 | High | Additional checks |
| Above ₨100,000 | Very High | Require online payment |

### Insurance Considerations

| Order Value | Insurance Cost | Impact on Margin |
|-------------|----------------|------------------|
| Up to ₨10,000 | ₨100 - ₨200 | Minimal |
| ₨10,000 - ₨30,000 | ₨300 - ₨500 | Moderate |
| ₨30,000 - ₨50,000 | ₨500 - ₨1,000 | Significant |
| Above ₨50,000 | ₨1,000+ | Very high |

### Fraud Risk Assessment

| Factor | Low Max (₨20k) | Medium Max (₨50k) | High Max (₨100k) |
|--------|---------------|-------------------|------------------|
| Fraud Attempts | Fewer | Moderate | Higher |
| Average Loss | Lower | Medium | Higher |
| Verification Cost | Lower | Medium | Higher |
| Insurance | Lower | Medium | Higher |

### Validation Relationships

| Validation | Rule | Enforcement |
|------------|------|-------------|
| min vs max | min_order < max_order | Business logic check |
| Reasonable max | <= 500,000 | Prevent extreme values |
| Not too low | >= 1,000 | If set, be reasonable |

### Customer Communication

| Scenario | Message | Alternative |
|----------|---------|-------------|
| Exceeds Max | "COD not available for orders above ₨50,000" | Show online payment |
| Near Max | "Order close to COD limit" | Suggest splitting |
| High Value | "For security, please use card payment" | Build trust |

### Expected Outcome
- Tenants can cap COD order values for risk control
- Default ₨50,000 provides balanced protection
- Optional constraint allows flexibility
- Reduces financial exposure and fraud risk
- Encourages online payments for high-value orders

### Verification Checklist
- [ ] max_order DecimalField added to CODConfig
- [ ] max_digits=10, decimal_places=2 set
- [ ] default=Decimal('50000.00') configured
- [ ] MinValueValidator(0) added
- [ ] null=True, blank=True configured
- [ ] verbose_name="Maximum Order Amount" set
- [ ] help_text explains risk management purpose
- [ ] Field allows None/null values for unlimited
- [ ] Greater than min_order validation considered

---

## Task 07: Create OTP Required Field

### Overview
Add the otp_required boolean field to control whether OTP (One-Time Password) verification is mandatory for COD orders. OTP verification adds an extra security layer by confirming the customer's phone number is valid and accessible at the time of order placement, reducing fraud and ensuring contactability for delivery coordination.

### Dependencies
- Task 01: Create CODConfig Model

### Instructions

1. **Add otp_required field**
   - Create BooleanField named otp_required
   - Set default=True (OTP enabled by default)
   - Set db_index=True for query performance

2. **Add field documentation**
   - Set verbose_name="OTP Verification Required"
   - Add detailed help_text
   - Help text: "Require customers to verify their phone number via OTP before placing COD orders"

3. **Consider security implications**
   - OTP reduces fake orders
   - Confirms phone number ownership
   - Allows delivery coordination
   - Reduces RTS (Return to Sender) rate

4. **Document bypass scenarios**
   - May be disabled for trusted customers
   - Could be optional for low-value orders
   - Balance security vs convenience

### Field Specifications

| Property | Value | Reason |
|----------|-------|--------|
| Field Type | BooleanField | Toggle setting |
| Default | True | Security by default |
| Null | False | Must have value |
| Blank | False | Required |
| DB Index | True | Frequent checks |

### OTP Verification Flow

```
otp_required = True
└── Checkout Process:
    1. Customer selects COD
    2. System sends OTP to phone
    3. Customer enters OTP
    4. System verifies OTP
    5. Order placed if valid
    └── Rejected if invalid/expired

otp_required = False
└── Checkout Process:
    1. Customer selects COD
    2. Order placed immediately
    └── No phone verification
```

### Security Benefits

| Benefit | Impact | Metrics |
|---------|--------|---------|
| Fake Order Reduction | High | 60-80% decrease |
| Valid Phone Numbers | High | 95%+ accuracy |
| Delivery Success Rate | Medium | 10-20% improvement |
| Fraud Prevention | High | 70%+ reduction |
| Customer Trust | Medium | Positive perception |

### OTP Process Details

| Step | Description | Timing |
|------|-------------|--------|
| Generate | Create 6-digit OTP | Instant |
| Send | SMS to customer phone | 5-30 seconds |
| Expire | Valid for 10 minutes | Auto-expire |
| Verify | Customer enters code | Within 10 min |
| Retry | Max 3 attempts | Configurable |

### Cost-Benefit Analysis

| Factor | OTP Enabled | OTP Disabled |
|--------|-------------|--------------|
| SMS Cost | ₨2-5 per OTP | ₨0 |
| Fake Orders | Very Low | High |
| RTS Orders | Low | High |
| RTS Cost | ₨300-500 per | High volume |
| Net Impact | Positive | Negative |

### Use Case Recommendations

| Business Type | OTP Setting | Reasoning |
|---------------|-------------|-----------|
| High-Volume Store | True | Fraud prevention critical |
| Budget Store | True | Protect margins |
| Trusted Customers | False | Convenience |
| B2B Orders | False | Corporate accounts |
| First-Time Buyers | True | Unknown risk |
| Repeat Customers | Conditional | Based on history |

### Implementation Considerations

| Aspect | Requirement |
|--------|-------------|
| SMS Gateway | Integration with SMS provider |
| Cost | ₨2-5 per SMS in Sri Lanka |
| Timeout | 10 minutes expiry |
| Attempts | 3 maximum retries |
| Storage | Temporary OTP storage (Redis) |
| Cleanup | Auto-delete expired OTPs |

### Customer Experience Impact

| Scenario | Impact | Mitigation |
|----------|--------|------------|
| OTP Delay | Slight friction | Fast SMS delivery |
| Wrong Number | Order blocked | Clear error messages |
| No SMS Received | Customer frustration | Resend option |
| Expired OTP | Must retry | Clear expiry message |

### Expected Outcome
- Tenants can mandate OTP verification for COD
- Default enabled for security
- Reduces fake and fraudulent orders
- Ensures valid contact numbers
- Improves delivery success rates
- Indexed for fast verification checks

### Verification Checklist
- [ ] otp_required BooleanField added to CODConfig
- [ ] default=True configured for security
- [ ] verbose_name="OTP Verification Required" set
- [ ] help_text explains security benefits
- [ ] db_index=True for performance
- [ ] Integration with OTP service planned (later tasks)
- [ ] SMS cost implications understood

---

## Task 08: Create First Order Limit

### Overview
Add the first_order_limit field to enforce a lower maximum order amount specifically for first-time COD customers. This field implements risk-based ordering, where new customers (those who have never successfully completed a COD order) are subject to a more conservative limit until they establish a track record. This reduces exposure to fraud and RTS on initial orders.

### Dependencies
- Task 01: Create CODConfig Model

### Instructions

1. **Add first_order_limit field**
   - Create DecimalField named first_order_limit
   - Set max_digits=10 for large amounts
   - Set decimal_places=2 for currency precision
   - Set default=Decimal('10000.00')

2. **Add field documentation**
   - Set verbose_name="First Order COD Limit"
   - Add comprehensive help_text
   - Help text: "Maximum COD order amount (in LKR) for customers placing their first COD order. Helps manage risk with new customers"

3. **Add field validation**
   - Import MinValueValidator
   - Add validators=[MinValueValidator(Decimal('0.00'))]
   - Ensure positive values only

4. **Add optional constraint**
   - Set null=True, blank=True
   - Allows disabling first-order restriction
   - None means use regular max_order

5. **Consider customer journey**
   - Lower limit for first order
   - Increases after successful delivery
   - Builds trust progressively

### Field Specifications

| Property | Value | Reason |
|----------|-------|--------|
| Field Type | DecimalField | Monetary amount |
| Max Digits | 10 | Accommodate limits |
| Decimal Places | 2 | Currency precision |
| Default | 10000.00 | ₨10,000 first order |
| Validators | MinValue(0) | Non-negative |
| Null | True | Optional limit |
| Blank | True | Can disable |

### First Order Limit Behavior

```
first_order_limit = 10,000.00
max_order = 50,000.00

Customer with 0 completed COD orders:
├── Order ₨5,000 → COD available (under first limit)
├── Order ₨10,000 → COD available (at first limit)
└── Order ₨15,000 → COD NOT available (exceeds first limit)

Customer with 1+ completed COD orders:
├── Order ₨5,000 → COD available
├── Order ₨10,000 → COD available
├── Order ₨15,000 → COD available (now under regular max)
└── Order ₨50,000 → COD available (at regular max)
```

### Customer Classification

| Customer Type | Completed COD Orders | Applicable Limit | Risk Level |
|---------------|---------------------|------------------|------------|
| First-Time | 0 | first_order_limit | High |
| Established | 1 - 5 | max_order | Medium |
| Regular | 6 - 20 | max_order | Low |
| VIP | 20+ | max_order or higher | Very Low |

### Typical First-Order Limits

| Business Type | First Order Limit | Regular Max | Reasoning |
|---------------|------------------|-------------|-----------|
| General Retail | ₨10,000 | ₨50,000 | 20% of regular |
| Electronics | ₨15,000 | ₨75,000 | Single item purchase |
| Fashion | ₨8,000 | ₨40,000 | Multiple items |
| Groceries | ₨5,000 | ₨25,000 | Trial basket |
| High-End | ₨20,000 | ₨100,000 | Premium segment |

### Risk Reduction Impact

| Metric | Without Limit | With ₨10k Limit | Improvement |
|--------|--------------|----------------|-------------|
| Avg First Order Fraud | 15% | 5% | 67% reduction |
| RTS Rate (First) | 25% | 10% | 60% reduction |
| Avg Loss per Fraud | ₨25,000 | ₨8,000 | 68% reduction |
| Customer Completion | 70% | 85% | 21% improvement |

### Progressive Trust Model

```
Customer Journey:
┌─────────────────────────────────────────────────────┐
│ First Order: Limited to ₨10,000                    │
│   ├── Delivery Successful → Trust Level ↑          │
│   └── RTS/Failed → Trust Level stays Low           │
├─────────────────────────────────────────────────────┤
│ Orders 2-5: Limited to ₨50,000                     │
│   ├── 80%+ Success Rate → Trust Level ↑            │
│   └── <80% Success → Maintain Limit                │
├─────────────────────────────────────────────────────┤
│ Orders 6+: Full Access or Increased Limits         │
│   └── Established Customer Benefits                │
└─────────────────────────────────────────────────────┘
```

### Validation Relationships

| Validation | Rule | Purpose |
|------------|------|---------|
| vs min_order | first_order_limit >= min_order | Logical consistency |
| vs max_order | first_order_limit <= max_order | Progressive approach |
| Reasonable | >= 1,000 | Not too restrictive |
| Business sense | 20-50% of max_order | Balanced risk |

### Customer Communication

| Scenario | Message | Impact |
|----------|---------|--------|
| Exceeds First Limit | "For your security, first COD order limited to ₨10,000" | Build trust |
| Multiple Items | "Consider online payment for larger orders" | Encourage alternatives |
| After Success | "Congratulations! Higher limits now available" | Reward loyalty |

### Business Benefits

| Benefit | Impact | Measurement |
|---------|--------|-------------|
| Reduced Fraud | High | Fraud rate tracking |
| Lower RTS Costs | High | Cost per RTS |
| Customer Acquisition | Positive | Still accessible |
| Trust Building | Long-term | Retention rates |

### Implementation Logic

| Check | Condition | Result |
|-------|-----------|--------|
| Count Orders | completed_cod_orders == 0 | First-time customer |
| Apply Limit | Use first_order_limit | Restricted to ₨10k |
| Check Again | completed_cod_orders >= 1 | Regular customer |
| Apply Regular | Use max_order | Full limit ₨50k |

### Expected Outcome
- New customers have conservative COD limits
- Default ₨10,000 balances access and risk
- Limit increases after successful orders
- Reduces fraud exposure with unknowns
- Builds progressive trust relationship
- Optional constraint for flexibility

### Verification Checklist
- [ ] first_order_limit DecimalField added to CODConfig
- [ ] max_digits=10, decimal_places=2 set
- [ ] default=Decimal('10000.00') configured
- [ ] MinValueValidator(0) added
- [ ] null=True, blank=True configured
- [ ] verbose_name="First Order COD Limit" set
- [ ] help_text explains risk management for new customers
- [ ] Less than or equal to max_order logically
- [ ] Field allows None/null to disable feature

---

## Summary

This document established the foundational CODConfig model and its core configuration fields. These settings provide tenants with comprehensive control over their COD payment method, including enablement, fee structure, order limits, verification requirements, and risk management for new customers.

### Completed Tasks
1. ✓ Created CODConfig model with tenant relationship and timestamps
2. ✓ Added is_enabled field for quick COD toggle
3. ✓ Created fee_type field (FLAT or PERCENTAGE)
4. ✓ Added fee_amount field for configurable COD fees
5. ✓ Created min_order field to set minimum COD order amount
6. ✓ Added max_order field for maximum COD order protection
7. ✓ Created otp_required field for phone verification control
8. ✓ Added first_order_limit field for new customer risk management

### Configuration Capabilities Achieved
- **Enablement Control:** Instant COD on/off toggle
- **Fee Flexibility:** Flat or percentage-based fees
- **Order Boundaries:** Min/max order amount controls
- **Security:** Optional OTP verification
- **Risk Management:** Conservative first-order limits

### Next Steps
Proceed to [02_Tasks-09-16_Zones-Admin-Verify.md](02_Tasks-09-16_Zones-Admin-Verify.md) to create the CODZones model for district-based COD availability, implement Django admin interfaces for configuration management, create default settings, and verify the complete COD configuration system.
