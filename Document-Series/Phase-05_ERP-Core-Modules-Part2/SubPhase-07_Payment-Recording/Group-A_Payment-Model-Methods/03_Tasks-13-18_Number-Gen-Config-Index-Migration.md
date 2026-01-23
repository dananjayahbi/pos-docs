# Tasks 13-18: Number Generation, Configuration, Indexes, and Migrations

> **Phase:** 05 - ERP Core Modules Part 2  
> **SubPhase:** 07 - Payment Recording  
> **Group:** A - Payment Model & Methods  
> **Document:** 03 of 03  
> **Tasks Covered:** 13, 14, 15, 16, 17, 18

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [02_Tasks-07-12_Date-Currency-Details-User-Notes.md](02_Tasks-07-12_Date-Currency-Details-User-Notes.md)
- **→ Next Group:** [Group-B_Payment-Recording-Services](../Group-B_Payment-Recording-Services/)

---

## Document Overview

This document completes the Payment model foundation by implementing automatic payment number generation with yearly sequences, creating a PaymentMethod configuration model for tenant-specific settings, adding database indexes for query optimization, implementing model constraints for data integrity, and generating the initial migrations.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 13 | Create Payment Number Generator | Medium | 25 min |
| 14 | Create PaymentMethod Configuration Model | Medium | 25 min |
| 15 | Add Payment Method Settings | Medium | 20 min |
| 16 | Create Payment Model Indexes | Medium | 20 min |
| 17 | Create Payment Model Constraints | Medium | 20 min |
| 18 | Run Initial Payment Migrations | Low | 15 min |

---

## Task 13: Create Payment Number Generator

### Overview
Implement an automatic payment number generation service that creates unique, sequential payment numbers in the format PAY-{YEAR}-{SEQUENCE}. The sequence resets each year, providing organized tracking within accounting periods. The generator must be tenant-aware and thread-safe to handle concurrent payment creation.

### Dependencies
- Task 12: Add Payment Notes Fields
- Payment model exists with payment_number field
- Tenant model and multi-tenancy infrastructure exists

### Instructions

1. **Create number_generator.py service file**
   - Create file at `apps/payments/services/number_generator.py`
   - Import necessary Django and threading modules
   - Import Payment model and Tenant model

2. **Create PaymentNumberGenerator class**
   - Implement as a service class
   - Handle tenant isolation
   - Ensure thread-safety with database locks

3. **Implement get_next_payment_number() method**
   - Accept tenant parameter
   - Get current year
   - Query highest payment number for current year and tenant
   - Extract sequence from payment_number
   - Increment sequence
   - Format as PAY-{YEAR}-{SEQUENCE}
   - Pad sequence with zeros (5 digits)

4. **Implement atomic transaction handling**
   - Use database transaction to prevent duplicate numbers
   - Use select_for_update() or database-level sequence
   - Handle race conditions in concurrent environments

5. **Add sequence reset logic**
   - Detect year change
   - Reset sequence to 00001 for new year
   - Maintain separate sequences per tenant

6. **Add validation and error handling**
   - Validate tenant exists
   - Handle sequence overflow (after 99999)
   - Log generation events for audit

7. **Add helper method for testing**
   - `parse_payment_number()`: Extract year and sequence
   - `get_current_sequence()`: Get current sequence number
   - `preview_next_number()`: Preview without generating

### Generator Implementation Pattern

```python
class PaymentNumberGenerator:
    """
    Generate unique payment numbers in format: PAY-YYYY-NNNNN
    
    Examples:
        PAY-2026-00001 (first payment of 2026)
        PAY-2026-00123 (123rd payment of 2026)
        PAY-2027-00001 (first payment of 2027, sequence resets)
    """
    
    @staticmethod
    def get_next_payment_number(tenant):
        """
        Generate next payment number for tenant
        
        Thread-safe implementation with database lock
        
        Returns:
            str: Payment number in format PAY-YYYY-NNNNN
        """
        # Implementation details in instructions
        pass
    
    @staticmethod
    def parse_payment_number(payment_number):
        """
        Parse payment number into components
        
        Args:
            payment_number: e.g., "PAY-2026-00123"
            
        Returns:
            dict: {'prefix': 'PAY', 'year': 2026, 'sequence': 123}
        """
        pass
```

### Number Format Specification

```
Format: PAY-{YEAR}-{SEQUENCE}

Components:
- Prefix:   PAY (fixed, identifies as payment)
- Year:     YYYY (4-digit year)
- Sequence: NNNNN (5-digit zero-padded number)

Examples:
PAY-2026-00001    First payment of 2026
PAY-2026-00099    99th payment
PAY-2026-01234    1,234th payment
PAY-2026-99999    Last possible payment (sequence limit)
PAY-2027-00001    First payment of 2027 (sequence resets)

Separators: Hyphens for readability
Length: 15 characters (fixed)
```

### Sequence Management

**Yearly Reset:**
```
Year 2025:
├─ PAY-2025-00001
├─ PAY-2025-00002
└─ PAY-2025-99999 (max)

Year 2026 (reset):
├─ PAY-2026-00001 (sequence restarts)
├─ PAY-2026-00002
└─ ...
```

**Per-Tenant Isolation:**
```
Tenant A:
├─ PAY-2026-00001
├─ PAY-2026-00002
└─ PAY-2026-00003

Tenant B (separate sequence):
├─ PAY-2026-00001 (same number, different tenant)
├─ PAY-2026-00002
└─ PAY-2026-00003

Each tenant maintains own sequence
```

### Thread-Safety Implementation

**Problem: Concurrent Payment Creation**
```
Request 1: Get last number PAY-2026-00100
Request 2: Get last number PAY-2026-00100 (same time!)

Request 1: Generate PAY-2026-00101
Request 2: Generate PAY-2026-00101 (duplicate!)

Result: CONFLICT ❌
```

**Solution: Database Lock**
```python
from django.db import transaction
from django.db.models import F

with transaction.atomic():
    # Lock the last payment record
    last_payment = Payment.objects.select_for_update().filter(
        tenant=tenant,
        payment_number__startswith=f'PAY-{current_year}'
    ).order_by('-payment_number').first()
    
    # Calculate next sequence
    if last_payment:
        sequence = extract_sequence(last_payment.payment_number) + 1
    else:
        sequence = 1
    
    # Format new number
    new_number = f'PAY-{current_year}-{sequence:05d}'
    
    return new_number

Result: Thread-safe, no duplicates ✓
```

### Integration with Payment Model

**Override save() method in Payment:**
```python
class Payment(BaseModel):
    # ... field definitions ...
    
    def save(self, *args, **kwargs):
        """Override save to auto-generate payment number"""
        if not self.payment_number:
            from apps.payments.services.number_generator import PaymentNumberGenerator
            self.payment_number = PaymentNumberGenerator.get_next_payment_number(
                tenant=self.tenant
            )
        super().save(*args, **kwargs)
```

### Edge Cases and Error Handling

**Case 1: Sequence Overflow**
```
Current: PAY-2026-99999
Next: Would be PAY-2026-100000 (6 digits!)

Solution:
- Check if sequence >= 99999
- Raise exception: "Payment sequence limit reached for year"
- Suggest: Extend sequence length or implement sub-sequences
```

**Case 2: Year Change During Generation**
```
Last payment: PAY-2025-00500 (created Dec 31, 2025)
New payment: (created Jan 1, 2026)

Correct: PAY-2026-00001 (detect year change, reset sequence)
```

**Case 3: Manual Number Entry**
```
If payment_number already set:
- Skip auto-generation
- Validate format matches PAY-YYYY-NNNNN
- Ensure uniqueness per tenant
```

### Testing the Generator

**Unit Tests:**
```python
def test_first_payment_of_year():
    number = PaymentNumberGenerator.get_next_payment_number(tenant)
    assert number == f'PAY-{current_year}-00001'

def test_sequential_generation():
    num1 = PaymentNumberGenerator.get_next_payment_number(tenant)
    num2 = PaymentNumberGenerator.get_next_payment_number(tenant)
    assert extract_sequence(num2) == extract_sequence(num1) + 1

def test_tenant_isolation():
    num_a = PaymentNumberGenerator.get_next_payment_number(tenant_a)
    num_b = PaymentNumberGenerator.get_next_payment_number(tenant_b)
    assert num_a == num_b  # Same number, different tenants

def test_year_rollover():
    # Mock year change
    with freeze_time('2025-12-31'):
        num1 = generate_number()
    with freeze_time('2026-01-01'):
        num2 = generate_number()
    assert num2 == 'PAY-2026-00001'  # Sequence reset
```

### Expected Outcome
- Automatic payment number generation
- Yearly sequence reset
- Tenant isolation
- Thread-safe operation
- Ready for payment creation

### Verification Checklist
- [ ] `number_generator.py` created in services/
- [ ] PaymentNumberGenerator class implemented
- [ ] get_next_payment_number() with tenant parameter
- [ ] Thread-safe with database locks
- [ ] Yearly sequence reset logic
- [ ] Integration with Payment.save() method
- [ ] Error handling for edge cases
- [ ] Unit tests written

---

## Task 14: Create PaymentMethod Configuration Model

### Overview
Create a PaymentMethodConfig model that allows each tenant to configure which payment methods are available, set limits, define processing fees, and establish business rules. This enables flexibility where some tenants may only accept cash while others offer full digital payment options.

### Dependencies
- Task 13: Create Payment Number Generator
- Payment model exists
- PaymentMethod choices defined
- Tenant model exists

### Instructions

1. **Create payment_method_config.py model file**
   - Create file at `apps/payments/models/payment_method_config.py`
   - Import necessary Django models
   - Import PaymentMethod choices
   - Import Tenant model

2. **Define PaymentMethodConfig model**
   - Extend BaseModel for tenant isolation
   - One configuration record per payment method per tenant

3. **Add method identification fields**
   - `method`: CharField with PaymentMethod choices
   - `is_enabled`: BooleanField (default False)
   - Unique together: (tenant, method)

4. **Add limit fields**
   - `min_amount`: DecimalField (minimum transaction)
   - `max_amount`: DecimalField (maximum transaction)
   - `daily_limit`: DecimalField (nullable, for fraud prevention)

5. **Add processing fee fields**
   - `processing_fee_type`: Choice (PERCENTAGE or FIXED)
   - `processing_fee_value`: DecimalField
   - Used to calculate fees for card/mobile payments

6. **Add operational fields**
   - `requires_approval`: BooleanField
   - `approval_threshold`: DecimalField (amount requiring approval)
   - `display_order`: IntegerField (sort order in UI)

7. **Add display and messaging fields**
   - `display_name`: CharField (custom name per tenant)
   - `instructions`: TextField (customer instructions)
   - `icon`: CharField (icon identifier for UI)

8. **Add model methods**
   - `is_amount_valid(amount)`: Check if amount within limits
   - `calculate_processing_fee(amount)`: Calculate fee
   - `requires_approval_for_amount(amount)`: Check approval need

9. **Configure model Meta**
   - Unique constraint on (tenant, method)
   - Ordering by display_order
   - Verbose names

### Model Structure

```
PaymentMethodConfig Model
├── id                      [UUID, PK]
├── tenant                  [FK to Tenant]
├── method                  [CharField, PaymentMethod choices]
├── is_enabled              [BooleanField, default=False]
├── min_amount              [DecimalField(15,2), nullable]
├── max_amount              [DecimalField(15,2), nullable]
├── daily_limit             [DecimalField(15,2), nullable]
├── processing_fee_type     [CharField, choices]
├── processing_fee_value    [DecimalField(10,4)]
├── requires_approval       [BooleanField, default=False]
├── approval_threshold      [DecimalField(15,2), nullable]
├── display_order           [IntegerField, default=0]
├── display_name            [CharField(100), nullable]
├── instructions            [TextField, blank]
└── icon                    [CharField(50), nullable]
```

### Configuration Examples

**Retail Store (All Methods):**
```python
# Cash Configuration
PaymentMethodConfig(
    tenant=retail_store,
    method='CASH',
    is_enabled=True,
    min_amount=0,
    max_amount=None,  # No limit
    processing_fee_type='FIXED',
    processing_fee_value=0,  # No fee
    requires_approval=False,
    display_order=1,
    display_name='Cash',
    icon='cash-icon'
)

# Card Configuration
PaymentMethodConfig(
    tenant=retail_store,
    method='CARD',
    is_enabled=True,
    min_amount=100,  # Rs. 100 minimum
    max_amount=500000,  # Rs. 500,000 maximum
    processing_fee_type='PERCENTAGE',
    processing_fee_value=2.5,  # 2.5% fee
    requires_approval=True,
    approval_threshold=100000,  # Above Rs. 100,000
    display_order=2,
    display_name='Credit/Debit Card',
    instructions='Visa and MasterCard accepted',
    icon='card-icon'
)
```

**Small Business (Limited Methods):**
```python
# Only Cash and Mobile
PaymentMethodConfig(
    tenant=small_business,
    method='CASH',
    is_enabled=True,
    # ... cash settings
)

PaymentMethodConfig(
    tenant=small_business,
    method='MOBILE',
    is_enabled=True,
    min_amount=50,
    max_amount=50000,
    processing_fee_type='PERCENTAGE',
    processing_fee_value=1.0,  # 1% fee
    # ... other settings
)

# Card, Bank Transfer, Check: Not configured (disabled)
```

### Processing Fee Types

| Fee Type | Description | Calculation | Example |
|----------|-------------|-------------|---------|
| PERCENTAGE | % of amount | amount × (fee_value / 100) | Rs. 10,000 × 2.5% = Rs. 250 |
| FIXED | Fixed amount | fee_value | Rs. 50 per transaction |

**Fee Calculation Examples:**
```
Payment: Rs. 10,000
Fee Type: PERCENTAGE
Fee Value: 2.5
Calculated Fee: Rs. 10,000 × 0.025 = Rs. 250
Customer Pays: Rs. 10,250

Payment: Rs. 5,000
Fee Type: FIXED
Fee Value: Rs. 50
Calculated Fee: Rs. 50
Customer Pays: Rs. 5,050
```

### Amount Validation

```python
def is_amount_valid(self, amount):
    """
    Validate payment amount against configured limits
    """
    if not self.is_enabled:
        return False, "Payment method not enabled"
    
    if self.min_amount and amount < self.min_amount:
        return False, f"Minimum amount is Rs. {self.min_amount}"
    
    if self.max_amount and amount > self.max_amount:
        return False, f"Maximum amount is Rs. {self.max_amount}"
    
    return True, "Valid"

# Usage
config = PaymentMethodConfig.objects.get(tenant=tenant, method='CARD')
is_valid, message = config.is_amount_valid(5000)
if not is_valid:
    raise ValidationError(message)
```

### Daily Limit Tracking

```python
def check_daily_limit(self, amount):
    """
    Check if payment would exceed daily limit
    """
    if not self.daily_limit:
        return True, "No daily limit"
    
    from datetime import date
    today_total = Payment.objects.filter(
        tenant=self.tenant,
        method=self.method,
        payment_date=date.today(),
        status='COMPLETED'
    ).aggregate(total=Sum('amount'))['total'] or 0
    
    if today_total + amount > self.daily_limit:
        return False, f"Daily limit of Rs. {self.daily_limit} would be exceeded"
    
    return True, "Within daily limit"
```

### Display Customization

```
Default Display Names vs Custom:

Method: CASH
Default: "Cash"
Custom: "Cash Payment (LKR only)"

Method: MOBILE
Default: "Mobile Payment"
Custom: "FriMi / eZ Cash / mCash"

Method: CARD
Default: "Card"
Custom: "Visa/MasterCard (2.5% fee applies)"
```

### Expected Outcome
- Tenant-specific payment method configuration
- Flexible limits and fees per method
- Approval workflow configuration
- Custom display names and instructions

### Verification Checklist
- [ ] `payment_method_config.py` model file created
- [ ] PaymentMethodConfig model defined
- [ ] Method and enabled fields added
- [ ] Limit fields (min, max, daily) added
- [ ] Processing fee fields added
- [ ] Approval fields added
- [ ] Display fields added
- [ ] Validation methods implemented
- [ ] Unique constraint on (tenant, method)

---

## Task 15: Add Payment Method Settings

### Overview
Extend the PaymentMethodConfig model with additional settings for operational control, including gateway configuration, reconciliation settings, receipt customization, and method-specific business rules. These settings provide fine-grained control over how each payment method operates.

### Dependencies
- Task 14: Create PaymentMethod Configuration Model
- PaymentMethodConfig model exists

### Instructions

1. **Open payment_method_config.py model file**
   - Continue editing the PaymentMethodConfig model

2. **Add gateway/processor fields**
   - `gateway_name`: CharField (nullable) - e.g., "Stripe", "PayHere"
   - `gateway_merchant_id`: CharField (nullable, encrypted)
   - `gateway_api_key_reference`: CharField (nullable) - reference to secure storage

3. **Add reconciliation fields**
   - `auto_reconcile`: BooleanField (default False)
   - `reconciliation_account`: CharField (GL account code)
   - `settlement_period_days`: IntegerField (how long until settled)

4. **Add receipt customization fields**
   - `show_on_receipt`: BooleanField (default True)
   - `receipt_label`: CharField (how to display on receipt)
   - `receipt_message`: TextField (additional message for this method)

5. **Add method-specific rules**
   - `allow_partial_payment`: BooleanField (default True)
   - `allow_split_payment`: BooleanField (can be combined with others)
   - `allow_refund`: BooleanField (can be refunded)
   - `refund_within_days`: IntegerField (nullable, refund window)

6. **Add check-specific settings**
   - `check_clearing_days`: IntegerField (default 3)
   - `allow_post_dated_checks`: BooleanField (default False)
   - `max_post_dated_days`: IntegerField (nullable)

7. **Add card-specific settings**
   - `accepted_card_types`: JSONField (list of VISA, MASTERCARD, AMEX)
   - `require_cvv`: BooleanField (default True)
   - `require_billing_address`: BooleanField (default False)

8. **Add mobile payment settings**
   - `supported_providers`: JSONField (FriMi, eZ Cash, mCash)
   - `provider_merchant_ids`: JSONField (dict of provider→merchant_id)

### Extended Model Structure

```
PaymentMethodConfig (Extended Settings)
├── [Previous Fields from Task 14]
│
├── Gateway/Processor:
│   ├── gateway_name              [CharField(100), nullable]
│   ├── gateway_merchant_id       [CharField(100), nullable]
│   └── gateway_api_key_reference [CharField(100), nullable]
│
├── Reconciliation:
│   ├── auto_reconcile            [BooleanField, default=False]
│   ├── reconciliation_account    [CharField(50), nullable]
│   └── settlement_period_days    [IntegerField, default=1]
│
├── Receipt Customization:
│   ├── show_on_receipt           [BooleanField, default=True]
│   ├── receipt_label             [CharField(100), nullable]
│   └── receipt_message           [TextField, blank]
│
├── Business Rules:
│   ├── allow_partial_payment     [BooleanField, default=True]
│   ├── allow_split_payment       [BooleanField, default=True]
│   ├── allow_refund              [BooleanField, default=True]
│   └── refund_within_days        [IntegerField, nullable]
│
├── Check Settings:
│   ├── check_clearing_days       [IntegerField, default=3]
│   ├── allow_post_dated_checks   [BooleanField, default=False]
│   └── max_post_dated_days       [IntegerField, nullable]
│
├── Card Settings:
│   ├── accepted_card_types       [JSONField, default=list]
│   ├── require_cvv               [BooleanField, default=True]
│   └── require_billing_address   [BooleanField, default=False]
│
└── Mobile Payment Settings:
    ├── supported_providers       [JSONField, default=list]
    └── provider_merchant_ids     [JSONField, default=dict]
```

### Gateway Configuration Example

```python
# Card payment with PayHere gateway
PaymentMethodConfig(
    method='CARD',
    gateway_name='PayHere',
    gateway_merchant_id='1234567',
    gateway_api_key_reference='vault:payhere_api_key',  # Reference to secure vault
    settlement_period_days=2,  # Funds settle in 2 days
    accepted_card_types=['VISA', 'MASTERCARD'],
    require_cvv=True
)

# Mobile payment with FriMi
PaymentMethodConfig(
    method='MOBILE',
    supported_providers=['FriMi', 'eZ Cash'],
    provider_merchant_ids={
        'FriMi': 'FRIMI-MERCHANT-123',
        'eZ Cash': 'EZ-MERCHANT-456'
    },
    settlement_period_days=1
)
```

### Receipt Customization Examples

```
Standard Receipt Display:
Payment Method: Card

Custom Receipt Display with receipt_label and receipt_message:
Payment Method: Visa/MasterCard
Note: A 2.5% processing fee has been applied to this transaction.
Please retain this receipt for your records.
```

### Business Rules Configuration

**Retail Store (Flexible):**
```python
PaymentMethodConfig(
    method='CASH',
    allow_partial_payment=True,   # Can pay partially
    allow_split_payment=True,     # Can combine with other methods
    allow_refund=True,             # Can be refunded
    refund_within_days=30          # 30-day refund window
)
```

**B2B Sales (Restricted):**
```python
PaymentMethodConfig(
    method='BANK_TRANSFER',
    allow_partial_payment=False,  # Must pay in full
    allow_split_payment=False,    # Single method only
    allow_refund=True,
    refund_within_days=90         # 90-day refund window
)
```

### Check-Specific Configuration

```python
# Conservative check policy
PaymentMethodConfig(
    method='CHECK',
    check_clearing_days=5,           # 5 business days to clear
    allow_post_dated_checks=True,    # Accept post-dated
    max_post_dated_days=90,          # Max 90 days in future
    requires_approval=True,           # Always require approval
    approval_threshold=0              # All checks need approval
)

# Liberal check policy
PaymentMethodConfig(
    method='CHECK',
    check_clearing_days=3,           # 3 business days
    allow_post_dated_checks=False,   # Current dated only
    requires_approval=True,
    approval_threshold=50000         # Only > Rs. 50,000
)
```

### Card Type Configuration

```python
PaymentMethodConfig(
    method='CARD',
    accepted_card_types=['VISA', 'MASTERCARD', 'AMEX'],
    require_cvv=True,                # Must provide CVV
    require_billing_address=False,    # No address needed
    processing_fee_type='PERCENTAGE',
    processing_fee_value=2.5          # 2.5% fee
)

# Validation logic
def validate_card_type(card_type, config):
    if card_type not in config.accepted_card_types:
        raise ValidationError(
            f"{card_type} not accepted. "
            f"Accepted: {', '.join(config.accepted_card_types)}"
        )
```

### Mobile Provider Configuration

```python
PaymentMethodConfig(
    method='MOBILE',
    supported_providers=['FriMi', 'eZ Cash', 'mCash'],
    provider_merchant_ids={
        'FriMi': 'MERCHANT-FRIMI-789',
        'eZ Cash': 'EZ-MERCHANT-123',
        'mCash': 'MCASH-456'
    },
    min_amount=50,      # Rs. 50 minimum
    max_amount=200000,  # Rs. 200,000 maximum
    processing_fee_type='PERCENTAGE',
    processing_fee_value=1.0  # 1% fee
)

# Provider selection
def get_merchant_id_for_provider(config, provider):
    return config.provider_merchant_ids.get(provider)
```

### Reconciliation Settings

```
Payment Method: BANK_TRANSFER
- auto_reconcile: False (manual verification required)
- reconciliation_account: "1010-BANK-CBL" (GL account)
- settlement_period_days: 1 (next business day)

Daily Reconciliation Process:
1. Get all COMPLETED bank transfers from yesterday
2. Match with bank statement entries
3. Post to reconciliation_account "1010-BANK-CBL"
4. Mark as reconciled
```

### Expected Outcome
- Comprehensive payment method configuration
- Gateway integration settings
- Business rule enforcement
- Method-specific settings (check, card, mobile)
- Receipt customization per method

### Verification Checklist
- [ ] Gateway fields added (name, merchant_id, api_key_reference)
- [ ] Reconciliation fields added (auto_reconcile, account, settlement_period)
- [ ] Receipt customization fields added
- [ ] Business rule fields added (partial, split, refund)
- [ ] Check-specific fields added
- [ ] Card-specific fields added (card_types, cvv, address)
- [ ] Mobile payment fields added (providers, merchant_ids)
- [ ] Default values set appropriately

---

## Task 16: Create Payment Model Indexes

### Overview
Add database indexes to the Payment model to optimize query performance for common operations like filtering by status, method, customer, date ranges, and reference lookups. Proper indexing is critical for financial reporting and payment reconciliation performance.

### Dependencies
- Task 15: Add Payment Method Settings
- Payment model complete with all fields
- PostgreSQL database

### Instructions

1. **Open payment.py model file**
   - Edit the Payment model Meta class
   - Add indexes list

2. **Add single-column indexes**
   - `payment_number`: Unique index (already created via unique=True)
   - `status`: Frequent filtering by status
   - `method`: Frequent filtering by payment method
   - `payment_date`: Date range queries
   - `reference_number`: Lookup for reconciliation

3. **Add foreign key indexes**
   - `invoice_id`: Django auto-creates, verify
   - `order_id`: Django auto-creates, verify
   - `customer_id`: Django auto-creates, verify
   - `received_by_id`: User performance reports
   - `approved_by_id`: Approval tracking

4. **Add composite indexes**
   - `(customer_id, payment_date)`: Customer payment history
   - `(status, method)`: Payment reports by status and method
   - `(payment_date, status)`: Date-based status reports
   - `(tenant_id, created_at)`: Tenant timeline queries

5. **Add partial indexes (PostgreSQL)**
   - Index on `(method)` WHERE `status = 'PENDING'`: Pending payments
   - Index on `(payment_date)` WHERE `status = 'COMPLETED'`: Completed payment dates

6. **Configure index names**
   - Use descriptive names: `idx_payments_status`, `idx_payments_method`
   - Follow naming convention: `idx_{table}_{field}` or `idx_{table}_{field1}_{field2}`

7. **Add index documentation**
   - Document purpose of each index
   - Note query patterns that benefit
   - Estimate query performance improvement

### Index Configuration

```python
class Payment(BaseModel):
    # ... field definitions ...
    
    class Meta:
        db_table = 'payments'
        verbose_name = 'Payment'
        verbose_name_plural = 'Payments'
        ordering = ['-created_at']
        
        indexes = [
            # Single-column indexes
            models.Index(fields=['status'], name='idx_payments_status'),
            models.Index(fields=['method'], name='idx_payments_method'),
            models.Index(fields=['payment_date'], name='idx_payments_date'),
            models.Index(fields=['reference_number'], name='idx_payments_reference'),
            models.Index(fields=['currency'], name='idx_payments_currency'),
            
            # Foreign key indexes (verified)
            models.Index(fields=['customer'], name='idx_payments_customer'),
            models.Index(fields=['invoice'], name='idx_payments_invoice'),
            models.Index(fields=['order'], name='idx_payments_order'),
            models.Index(fields=['received_by'], name='idx_payments_received_by'),
            models.Index(fields=['approved_by'], name='idx_payments_approved_by'),
            
            # Composite indexes
            models.Index(
                fields=['customer', 'payment_date'],
                name='idx_payments_customer_date'
            ),
            models.Index(
                fields=['status', 'method'],
                name='idx_payments_status_method'
            ),
            models.Index(
                fields=['payment_date', 'status'],
                name='idx_payments_date_status'
            ),
            models.Index(
                fields=['created_at', 'status'],
                name='idx_payments_created_status'
            ),
        ]
        
        constraints = [
            # Constraints added in Task 17
        ]
```

### Query Patterns and Index Usage

**Pattern 1: Filter by Status**
```python
# Query: Get all completed payments
Payment.objects.filter(status='COMPLETED')

# Index used: idx_payments_status
# Performance: O(log n) with index vs O(n) without
```

**Pattern 2: Customer Payment History**
```python
# Query: Get customer's recent payments
Payment.objects.filter(
    customer_id=customer_id,
    payment_date__gte=start_date
).order_by('-payment_date')

# Index used: idx_payments_customer_date
# Composite index optimizes both filter and sort
```

**Pattern 3: Payment Reports by Method**
```python
# Query: Cash payments today
Payment.objects.filter(
    method='CASH',
    payment_date=today,
    status='COMPLETED'
)

# Indexes used:
# - idx_payments_method (filter by method)
# - idx_payments_date (filter by date)
# - idx_payments_status (filter by status)
```

**Pattern 4: Reference Lookup (Reconciliation)**
```python
# Query: Find payment by bank reference
Payment.objects.filter(reference_number='CBL/TRF/2026/012345')

# Index used: idx_payments_reference
# Critical for bank reconciliation performance
```

**Pattern 5: Daily Cash Collection Report**
```python
# Query: Today's cash payments by cashier
Payment.objects.filter(
    method='CASH',
    payment_date=today,
    received_by=cashier
).aggregate(total=Sum('amount'))

# Indexes used:
# - idx_payments_method
# - idx_payments_date
# - idx_payments_received_by
```

### Index Performance Impact

| Query Type | Without Index | With Index | Improvement |
|------------|---------------|------------|-------------|
| Status filter (100K records) | 250ms | 5ms | 50x faster |
| Customer history | 180ms | 8ms | 22x faster |
| Reference lookup | 300ms | 2ms | 150x faster |
| Date range | 400ms | 15ms | 26x faster |

### Index Maintenance Considerations

**Index Size:**
```
Estimated index sizes (1M payment records):
- Single column (int/UUID): ~50 MB
- Single column (varchar): ~75 MB
- Composite (2 columns): ~100 MB
- Total index overhead: ~500 MB

Trade-off: Storage vs query performance
Benefit: Queries 20-150x faster
```

**Write Performance:**
```
Impact on INSERT operations:
- Without indexes: 1ms per insert
- With 10 indexes: 1.5-2ms per insert
- Trade-off acceptable for read-heavy workload
```

**Index Monitoring:**
```sql
-- Check index usage (PostgreSQL)
SELECT 
    schemaname,
    tablename,
    indexname,
    idx_scan,  -- Number of index scans
    idx_tup_read,  -- Tuples read
    idx_tup_fetch  -- Tuples fetched
FROM pg_stat_user_indexes
WHERE tablename = 'payments'
ORDER BY idx_scan DESC;

-- Identify unused indexes
SELECT * FROM pg_stat_user_indexes
WHERE idx_scan = 0 AND tablename = 'payments';
```

### Expected Outcome
- Optimized query performance for common patterns
- Fast lookups for reconciliation
- Efficient customer and date-based reporting
- Minimal impact on write performance

### Verification Checklist
- [ ] Single-column indexes added (status, method, date, reference)
- [ ] FK indexes verified (customer, invoice, order, users)
- [ ] Composite indexes added (customer+date, status+method, date+status)
- [ ] Index names follow naming convention
- [ ] Documentation of query patterns included
- [ ] Index performance monitored

---

## Task 17: Create Payment Model Constraints

### Overview
Add database-level constraints to enforce business rules and data integrity. Constraints prevent invalid data from being saved, ensure consistency, and provide clear error messages when violations occur. Critical for financial data accuracy.

### Dependencies
- Task 16: Create Payment Model Indexes
- Payment model complete with all fields

### Instructions

1. **Open payment.py model file**
   - Edit the Payment model Meta class
   - Add constraints list

2. **Add positive amount constraint**
   - Ensure amount > 0
   - Prevent zero or negative payments
   - Use CheckConstraint with Q object

3. **Add exchange rate constraint**
   - If foreign currency (currency != 'LKR'), exchange_rate must be set
   - Use CheckConstraint with conditional logic

4. **Add date consistency constraints**
   - processed_at must be >= created_at (if set)
   - cancelled_at must be >= created_at (if set)
   - payment_date should not be too far in future (except post-dated checks)

5. **Add status transition constraints**
   - Cannot have both processed_at and cancelled_at set
   - If status = COMPLETED, processed_at must be set
   - If status = CANCELLED, cancelled_at must be set

6. **Add reference validation constraints**
   - At least one of invoice or order must be set (or validate in service layer)
   - If method = CHECK, reference_number should be set

7. **Add unique constraints**
   - payment_number unique per tenant (handled by model field unique=True)
   - Composite unique if needed

### Constraint Implementation

```python
from django.db import models
from django.db.models import Q, CheckConstraint, UniqueConstraint

class Payment(BaseModel):
    # ... field definitions ...
    
    class Meta:
        db_table = 'payments'
        # ... other meta options ...
        
        constraints = [
            # Positive amount constraint
            CheckConstraint(
                check=Q(amount__gt=0),
                name='payment_amount_positive'
            ),
            
            # Foreign currency must have exchange rate
            CheckConstraint(
                check=(
                    Q(currency='LKR') |  # LKR doesn't need rate
                    Q(exchange_rate__isnull=False)  # Foreign needs rate
                ),
                name='payment_foreign_currency_rate_required'
            ),
            
            # Exchange rate must be positive
            CheckConstraint(
                check=(
                    Q(exchange_rate__isnull=True) |  # Nullable
                    Q(exchange_rate__gt=0)  # Or positive
                ),
                name='payment_exchange_rate_positive'
            ),
            
            # Processed date after creation
            CheckConstraint(
                check=(
                    Q(processed_at__isnull=True) |  # Not processed yet
                    Q(processed_at__gte=F('created_at'))  # Or after creation
                ),
                name='payment_processed_after_created'
            ),
            
            # Cancelled date after creation
            CheckConstraint(
                check=(
                    Q(cancelled_at__isnull=True) |
                    Q(cancelled_at__gte=F('created_at'))
                ),
                name='payment_cancelled_after_created'
            ),
            
            # Cannot be both processed and cancelled
            CheckConstraint(
                check=(
                    Q(processed_at__isnull=True) |
                    Q(cancelled_at__isnull=True)
                ),
                name='payment_not_both_processed_cancelled'
            ),
            
            # Processing fee must be non-negative
            CheckConstraint(
                check=Q(processing_fee__gte=0),
                name='payment_processing_fee_non_negative'
            ),
        ]
```

### Constraint Violation Examples

**Violation 1: Negative Amount**
```python
# Attempt to create payment with negative amount
payment = Payment(
    amount=-1000,  # ❌ Negative
    method='CASH'
)
payment.save()

# Error:
# IntegrityError: constraint "payment_amount_positive" violated
# amount must be greater than 0
```

**Violation 2: Foreign Currency Without Rate**
```python
# USD payment without exchange rate
payment = Payment(
    amount=100,
    currency='USD',
    exchange_rate=None  # ❌ Missing for foreign currency
)
payment.save()

# Error:
# IntegrityError: constraint "payment_foreign_currency_rate_required" violated
# exchange_rate required for foreign currency payments
```

**Violation 3: Invalid Date Sequence**
```python
# Processed before created
payment = Payment(
    created_at=datetime(2026, 1, 23, 10, 0),
    processed_at=datetime(2026, 1, 23, 9, 0),  # ❌ Before created_at
)

# Error:
# IntegrityError: constraint "payment_processed_after_created" violated
# processed_at must be >= created_at
```

**Violation 4: Both Processed and Cancelled**
```python
# Both timestamps set
payment = Payment(
    processed_at=datetime(2026, 1, 23, 10, 0),  # ❌ Both set
    cancelled_at=datetime(2026, 1, 23, 11, 0),  # ❌ Invalid
)

# Error:
# IntegrityError: constraint "payment_not_both_processed_cancelled" violated
# payment cannot be both processed and cancelled
```

### Business Rule Enforcement

**Rule 1: Positive Amounts Only**
```
Invalid: amount = 0 or amount < 0
Valid: amount > 0

Rationale: Zero-amount payments have no meaning
           Negative amounts should use refund records
```

**Rule 2: Foreign Currency Requirements**
```
If currency != 'LKR':
    - exchange_rate must be provided
    - exchange_rate must be > 0
    - amount_in_base_currency should be calculated

Example:
currency='USD', amount=100
exchange_rate=325.50 ✓
amount_in_base_currency=32550 ✓
```

**Rule 3: Temporal Consistency**
```
Timeline must make sense:
created_at → processed_at → reconciled_at

Impossible scenarios blocked:
- Payment processed before creation
- Payment cancelled before creation
- Payment both processed and cancelled
```

### Constraint Error Handling

```python
from django.db import IntegrityError

def create_payment(data):
    try:
        payment = Payment(**data)
        payment.save()
        return payment
    except IntegrityError as e:
        error_msg = str(e)
        
        if 'payment_amount_positive' in error_msg:
            raise ValidationError("Payment amount must be greater than zero")
        elif 'payment_foreign_currency_rate_required' in error_msg:
            raise ValidationError("Exchange rate required for foreign currency")
        elif 'payment_processed_after_created' in error_msg:
            raise ValidationError("Invalid timestamp sequence")
        else:
            raise ValidationError(f"Database constraint violation: {error_msg}")
```

### Model-Level vs Database-Level Validation

**Model-Level (Python):**
```python
def clean(self):
    if self.amount <= 0:
        raise ValidationError("Amount must be positive")
    
    if self.currency != 'LKR' and not self.exchange_rate:
        raise ValidationError("Exchange rate required for foreign currency")
```

**Database-Level (Constraints):**
```sql
ALTER TABLE payments
ADD CONSTRAINT payment_amount_positive
CHECK (amount > 0);
```

**Best Practice:** Use both
- Model validation: User-friendly errors, pre-save checks
- Database constraints: Ultimate safety, protects against bulk operations and direct SQL

### Expected Outcome
- Data integrity enforced at database level
- Invalid data prevented from being saved
- Clear constraint names for error identification
- Business rules consistently applied

### Verification Checklist
- [ ] Positive amount constraint added
- [ ] Foreign currency rate requirement constraint added
- [ ] Date consistency constraints added (processed_at, cancelled_at)
- [ ] Status transition constraints added
- [ ] All constraints have descriptive names
- [ ] Constraint violation error handling implemented
- [ ] Model clean() method also validates rules

---

## Task 18: Run Initial Payment Migrations

### Overview
Generate and apply Django migrations for all payment-related models created in this group, including the Payment model with all fields, PaymentMethodConfig model, indexes, and constraints. This task finalizes the database schema for payment recording.

### Dependencies
- Task 17: Create Payment Model Constraints
- All models complete (Payment, PaymentMethodConfig)
- All indexes and constraints defined
- Database connection configured

### Instructions

1. **Verify all models are complete**
   - Payment model with all fields (Tasks 05-12)
   - PaymentMethodConfig model (Tasks 14-15)
   - All indexes configured (Task 16)
   - All constraints defined (Task 17)

2. **Update models/__init__.py**
   - Import Payment model
   - Import PaymentMethodConfig model
   - Ensure models are discoverable by Django

3. **Check for migration conflicts**
   - Ensure no pending migrations in dependent apps
   - Verify customer, order, invoice apps migrated
   - Check for naming conflicts

4. **Generate migrations**
   - Run: `python manage.py makemigrations payments`
   - Review generated migration file
   - Verify all fields, indexes, and constraints included

5. **Review migration file**
   - Check migration dependencies (customers, orders, invoices)
   - Verify field types and attributes
   - Confirm index definitions
   - Verify constraint definitions
   - Check for any warnings

6. **Test migration in development**
   - Create backup of development database
   - Run: `python manage.py migrate payments`
   - Verify tables created: `payments`, `payment_method_configs`
   - Check indexes created
   - Verify constraints active

7. **Test migration rollback**
   - Test: `python manage.py migrate payments zero`
   - Verify clean rollback
   - Re-apply: `python manage.py migrate payments`

8. **Document migration**
   - Record migration number
   - Document what was created
   - Note any manual steps required

### Migration File Structure

```python
# Generated: apps/payments/migrations/0001_initial.py

from django.db import migrations, models
import django.db.models.deletion
import uuid

class Migration(migrations.Migration):
    initial = True
    
    dependencies = [
        ('tenants', '0001_initial'),
        ('customers', '0001_initial'),
        ('orders', '0001_initial'),
        ('invoices', '0001_initial'),
        ('auth', '0012_alter_user_first_name_max_length'),
    ]
    
    operations = [
        # Create Payment model
        migrations.CreateModel(
            name='Payment',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, primary_key=True)),
                ('payment_number', models.CharField(max_length=30, unique=True)),
                ('method', models.CharField(max_length=20, choices=[...])),
                ('status', models.CharField(max_length=20, default='PENDING')),
                ('amount', models.DecimalField(max_digits=15, decimal_places=2)),
                ('payment_date', models.DateField(null=True)),
                ('processed_at', models.DateTimeField(null=True)),
                ('cancelled_at', models.DateTimeField(null=True)),
                ('currency', models.CharField(max_length=3, default='LKR')),
                ('exchange_rate', models.DecimalField(max_digits=12, decimal_places=6, null=True)),
                ('amount_in_base_currency', models.DecimalField(max_digits=15, decimal_places=2, null=True)),
                ('method_details', models.JSONField(default=dict, null=True)),
                ('reference_number', models.CharField(max_length=100, null=True)),
                ('notes', models.TextField(blank=True, null=True)),
                ('internal_notes', models.TextField(blank=True, null=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                # Foreign keys
                ('tenant', models.ForeignKey(...)),
                ('customer', models.ForeignKey(..., null=True)),
                ('invoice', models.ForeignKey(..., null=True)),
                ('order', models.ForeignKey(..., null=True)),
                ('received_by', models.ForeignKey(..., null=True)),
                ('approved_by', models.ForeignKey(..., null=True)),
            ],
            options={
                'db_table': 'payments',
                'verbose_name': 'Payment',
                'verbose_name_plural': 'Payments',
                'ordering': ['-created_at'],
            },
        ),
        
        # Create PaymentMethodConfig model
        migrations.CreateModel(
            name='PaymentMethodConfig',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, primary_key=True)),
                ('method', models.CharField(max_length=20)),
                ('is_enabled', models.BooleanField(default=False)),
                ('min_amount', models.DecimalField(max_digits=15, decimal_places=2, null=True)),
                # ... all other fields
                ('tenant', models.ForeignKey(...)),
            ],
        ),
        
        # Add indexes
        migrations.AddIndex(
            model_name='payment',
            index=models.Index(fields=['status'], name='idx_payments_status'),
        ),
        # ... all other indexes
        
        # Add constraints
        migrations.AddConstraint(
            model_name='payment',
            constraint=models.CheckConstraint(
                check=models.Q(amount__gt=0),
                name='payment_amount_positive'
            ),
        ),
        # ... all other constraints
    ]
```

### Migration Verification

**Check Tables Created:**
```sql
-- Connect to database
psql -U postgres -d erp_dev

-- List payment tables
\dt payments*

-- Expected output:
-- payments
-- payment_method_configs
```

**Check Indexes:**
```sql
-- List indexes on payments table
SELECT indexname, indexdef
FROM pg_indexes
WHERE tablename = 'payments';

-- Expected: ~10-12 indexes
```

**Check Constraints:**
```sql
-- List constraints
SELECT conname, contype, pg_get_constraintdef(oid)
FROM pg_constraint
WHERE conrelid = 'payments'::regclass;

-- Expected: 6-8 check constraints
```

**Test Insert:**
```sql
-- Test valid insert
INSERT INTO payments (
    id, tenant_id, payment_number, method, status, amount, created_at, updated_at
) VALUES (
    gen_random_uuid(),
    'tenant-uuid-here',
    'PAY-2026-00001',
    'CASH',
    'PENDING',
    1000.00,
    NOW(),
    NOW()
);

-- Should succeed ✓

-- Test constraint violation
INSERT INTO payments (
    id, tenant_id, payment_number, method, status, amount, created_at, updated_at
) VALUES (
    gen_random_uuid(),
    'tenant-uuid-here',
    'PAY-2026-00002',
    'CASH',
    'PENDING',
    -100.00,  -- Negative amount
    NOW(),
    NOW()
);

-- Should fail with constraint error ✓
```

### Common Migration Issues

**Issue 1: Dependency Not Found**
```
Error: No such migration: invoices.0001_initial

Solution:
1. Check that invoice app is migrated first
2. Add dependency in migration file
3. Re-run makemigrations
```

**Issue 2: Constraint Name Conflict**
```
Error: Constraint "payment_amount_positive" already exists

Solution:
1. Choose unique constraint name
2. Or drop existing constraint first
3. Re-run migration
```

**Issue 3: Index Creation Failed**
```
Error: Could not create index "idx_payments_status"

Solution:
1. Check index name is unique
2. Verify table exists
3. Check field exists and is correct type
```

### Post-Migration Tasks

**1. Verify Models Accessible:**
```python
from apps.payments.models import Payment, PaymentMethodConfig

# Should not raise ImportError
print(Payment.objects.count())  # Should return 0
print(PaymentMethodConfig.objects.count())  # Should return 0
```

**2. Register in Admin:**
```python
# apps/payments/admin.py
from django.contrib import admin
from .models import Payment, PaymentMethodConfig

@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = ['payment_number', 'method', 'status', 'amount', 'customer', 'created_at']
    list_filter = ['status', 'method', 'payment_date']
    search_fields = ['payment_number', 'reference_number']

@admin.register(PaymentMethodConfig)
class PaymentMethodConfigAdmin(admin.ModelAdmin):
    list_display = ['method', 'is_enabled', 'min_amount', 'max_amount', 'processing_fee_type']
    list_filter = ['method', 'is_enabled']
```

**3. Create Initial PaymentMethodConfig Records:**
```python
# Create default configurations for new tenants
def create_default_payment_configs(tenant):
    configs = [
        {'method': 'CASH', 'is_enabled': True, 'display_order': 1},
        {'method': 'CARD', 'is_enabled': True, 'display_order': 2},
        {'method': 'BANK_TRANSFER', 'is_enabled': False, 'display_order': 3},
        {'method': 'MOBILE', 'is_enabled': False, 'display_order': 4},
        {'method': 'CHECK', 'is_enabled': False, 'display_order': 5},
        {'method': 'STORE_CREDIT', 'is_enabled': True, 'display_order': 6},
    ]
    
    for config in configs:
        PaymentMethodConfig.objects.create(tenant=tenant, **config)
```

### Expected Outcome
- Payment and PaymentMethodConfig tables created
- All indexes in place
- All constraints active
- Models accessible in Python
- Ready for payment recording implementation

### Verification Checklist
- [ ] models/__init__.py updated with imports
- [ ] `makemigrations payments` executed successfully
- [ ] Migration file reviewed and validated
- [ ] `migrate payments` executed successfully
- [ ] Tables created in database
- [ ] Indexes created and active
- [ ] Constraints active and tested
- [ ] Models accessible in Django shell
- [ ] Admin registration complete
- [ ] Migration documented

---

## Summary

This document completed the Payment model foundation:

1. ✅ **Payment Number Generator** (Task 13): Automatic PAY-{YEAR}-{SEQ} generation, tenant-isolated, thread-safe
2. ✅ **PaymentMethodConfig Model** (Task 14): Tenant-specific payment method configuration with limits and fees
3. ✅ **Payment Method Settings** (Task 15): Extended settings for gateways, reconciliation, business rules
4. ✅ **Payment Model Indexes** (Task 16): Optimized query performance with strategic indexing
5. ✅ **Payment Model Constraints** (Task 17): Data integrity enforcement at database level
6. ✅ **Initial Migrations** (Task 18): Database schema created and verified

**Group A Complete!** The Payment model infrastructure is ready for payment recording services.

**Next Steps:** Proceed to [Group-B_Payment-Recording-Services](../Group-B_Payment-Recording-Services/) to implement payment recording business logic for all payment methods.
