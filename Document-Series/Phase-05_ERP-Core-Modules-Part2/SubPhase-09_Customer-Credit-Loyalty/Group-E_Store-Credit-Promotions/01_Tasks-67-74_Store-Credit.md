# Tasks 67-74: Store Credit Management

> **Phase:** 05 - ERP Core Modules Part 2  
> **SubPhase:** 09 - Customer Credit & Loyalty  
> **Group:** E - Store Credit & Promotions  
> **Document:** 01 of 02 (Tasks 67-74)

---

## Navigation

- **↑ Parent:** [Group E Overview](./00_GROUP_OVERVIEW.md)
- **← Previous Document:** [Group D: Loyalty Tiers & Rewards](../Group-D_Loyalty-Tiers-Rewards/)
- **→ Next Document:** [02_Tasks-75-80_Promotions-Dashboard.md](./02_Tasks-75-80_Promotions-Dashboard.md)

---

## Document Overview

### **Purpose**
Implement store credit system for refunds, gift credits, and promotional credits separate from loyalty points.

### **Scope**
- StoreCredit model for tracking customer credit balances
- StoreCreditTransaction model for credit movement history
- Service methods for issuing, redeeming, and checking credit
- Expiry handling for time-limited credits

### **Key Outcomes**
1. ✅ StoreCredit model with balance tracking
2. ✅ Credit source tracking (refund, gift, promotion)
3. ✅ Expiry date management
4. ✅ StoreCreditTransaction model for audit trail
5. ✅ Issue credit functionality
6. ✅ Redeem credit at checkout
7. ✅ Balance check validation
8. ✅ Database migrations applied

---

## Tasks Covered

| Task # | Title | Complexity | Est. Time | Status |
|--------|-------|------------|-----------|--------|
| 67 | Create StoreCredit Model | Medium | 25 min | ⏳ Not Started |
| 68 | Add Store Credit Fields | Medium | 20 min | ⏳ Not Started |
| 69 | Add Store Credit Expiry | Medium | 20 min | ⏳ Not Started |
| 70 | Run Store Credit Migrations | Low | 15 min | ⏳ Not Started |
| 71 | Create StoreCreditTransaction Model | Medium | 25 min | ⏳ Not Started |
| 72 | Implement Store Credit Issue | Medium | 25 min | ⏳ Not Started |
| 73 | Implement Store Credit Redemption | Medium | 25 min | ⏳ Not Started |
| 74 | Implement Store Credit Balance Check | Medium | 20 min | ⏳ Not Started |

---

## Implementation Details

### Task 67: Create StoreCredit Model

**File:** `apps/credit/models/store_credit.py`

#### Dependencies
- `BaseModel` from `apps/common/models/base`
- `Customer` model
- Django `models`, `timezone`
- Decimal field for currency

#### Requirements

1. **Model Structure**
   - Inherit from `BaseModel` (uuid, timestamps, tenant, active)
   - One-to-one relationship with Customer
   - Balance field (Decimal)
   - Source tracking

2. **Key Fields**
   ```
   - customer (OneToOneField, CASCADE)
   - balance (Decimal, max_digits=10, decimal_places=2, default=0.00)
   - total_issued (Decimal, accumulated credits issued)
   - total_used (Decimal, accumulated credits used)
   - currency (CharField, default='LKR')
   - notes (TextField, blank=True)
   ```

3. **Meta Options**
   - `db_table = 'credit_store_credits'`
   - `verbose_name = 'Store Credit'`
   - `verbose_name_plural = 'Store Credits'`
   - `ordering = ['-balance', 'customer']`

4. **String Method**
   - Return: `"Customer: {customer.name} - Balance: Rs. {balance}"`

#### Design Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    StoreCredit Model                        │
├─────────────────────────────────────────────────────────────┤
│  [BaseModel Fields]                                         │
│  - id: UUID (PK)                                            │
│  - tenant: FK → Tenant                                      │
│  - created_at: DateTime                                     │
│  - updated_at: DateTime                                     │
│  - active: Boolean                                          │
│                                                             │
│  [Relationship]                                             │
│  - customer: OneToOneField → Customer (CASCADE)             │
│                                                             │
│  [Balance Fields]                                           │
│  - balance: Decimal(10,2) default 0.00                      │
│  - total_issued: Decimal(10,2) default 0.00                 │
│  - total_used: Decimal(10,2) default 0.00                   │
│  - currency: CharField default 'LKR'                        │
│  - notes: TextField (blank=True)                            │
│                                                             │
│  [Methods]                                                  │
│  - __str__(): Display customer and balance                  │
│  - has_balance(amount): Check if sufficient credit          │
│  - get_available_balance(): Return current balance          │
│                                                             │
│  Relationship to Customer:                                  │
│  Customer ←──(1:1)── StoreCredit                            │
│  - Each customer has at most one store credit account       │
│  - Cascade delete if customer deleted                       │
└─────────────────────────────────────────────────────────────┘
```

#### Instructions

**Step 1:** Create model file
- Location: `apps/credit/models/store_credit.py`
- Import BaseModel, Customer, Django modules

**Step 2:** Define `StoreCredit` class
- Inherit from `BaseModel`
- Add customer OneToOneField with CASCADE
- Add balance, total_issued, total_used as Decimal(10,2)
- Add currency CharField with default 'LKR'
- Add notes TextField

**Step 3:** Add Meta class
- Set db_table, verbose names
- Define ordering by balance DESC
- Add index on customer for fast lookups

**Step 4:** Implement `__str__` method
- Format: "Customer: {name} - Balance: Rs. {balance:.2f}"
- Handle missing customer gracefully

**Step 5:** Add helper methods
```python
def has_balance(self, amount):
    """Check if customer has sufficient credit"""
    return self.balance >= amount

def get_available_balance(self):
    """Return current available balance"""
    return self.balance

@property
def is_zero_balance(self):
    """Check if balance is zero"""
    return self.balance == Decimal('0.00')
```

**Step 6:** Update `models/__init__.py`
- Import and export `StoreCredit`

**Step 7:** Sri Lanka Context
- Currency: Rs. (LKR)
- Example: "Customer: කුමාර සිල්වා - Balance: Rs. 2500.00"
- Common use: Refunds for returns, promotional credits

#### Verification

```bash
# Check model definition
python manage.py check credit

# Verify in shell
python manage.py shell
>>> from apps.credit.models import StoreCredit
>>> StoreCredit._meta.get_fields()
>>> StoreCredit._meta.db_table
```

**Expected:**
- Model imports successfully
- OneToOneField to Customer exists
- Decimal fields have correct precision
- Helper methods work

---

### Task 68: Add Store Credit Fields

**File:** `apps/credit/models/store_credit.py` (extend)

#### Dependencies
- Task 67 (StoreCredit model base)
- Django `models.TextChoices` for source types

#### Requirements

1. **Source Tracking**
   - Track where credit originated (refund, gift, adjustment)
   - Use TextChoices for type safety
   - Store reference to source transaction

2. **New Fields**
   ```
   - created_from (CharField with choices)
   - source_reference (CharField, order/invoice reference)
   - issued_by (FK to User, null/blank for system)
   - last_transaction_at (DateTime, auto-update)
   ```

3. **CreditSource Choices**
   ```
   REFUND = 'REFUND', 'Refund'
   GIFT = 'GIFT', 'Gift Credit'
   PROMOTIONAL = 'PROMOTIONAL', 'Promotional Credit'
   ADJUSTMENT = 'ADJUSTMENT', 'Manual Adjustment'
   COMPENSATION = 'COMPENSATION', 'Compensation'
   LOYALTY_CONVERSION = 'LOYALTY_CONVERSION', 'Loyalty Points Conversion'
   ```

#### Design Diagram

```
┌─────────────────────────────────────────────────────────────┐
│              Store Credit Source Types                      │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Credit Sources:                                            │
│  ┌──────────────┐     ┌───────────────┐                     │
│  │   REFUND     │     │     GIFT      │                     │
│  │ Return item  │     │ Birthday gift │                     │
│  │ Rs. 5000     │     │ Rs. 1000      │                     │
│  └──────────────┘     └───────────────┘                     │
│                                                             │
│  ┌──────────────┐     ┌───────────────┐                     │
│  │ PROMOTIONAL  │     │  ADJUSTMENT   │                     │
│  │ Campaign     │     │ Admin fix     │                     │
│  │ Rs. 500      │     │ Rs. -200      │                     │
│  └──────────────┘     └───────────────┘                     │
│                                                             │
│  ┌──────────────┐     ┌───────────────┐                     │
│  │COMPENSATION  │     │LOYALTY_CONV   │                     │
│  │ Service fail │     │ Points→Credit │                     │
│  │ Rs. 2000     │     │ 5000pts→500Rs │                     │
│  └──────────────┘     └───────────────┘                     │
│                                                             │
│  StoreCredit Record Example:                                │
│  ┌───────────────────────────────────────────────────┐      │
│  │ customer: "John Silva"                            │      │
│  │ balance: Rs. 8500.00                              │      │
│  │ total_issued: Rs. 10000.00                        │      │
│  │ total_used: Rs. 1500.00                           │      │
│  │ created_from: REFUND                              │      │
│  │ source_reference: "INV-2024-0001"                 │      │
│  │ issued_by: admin_user                             │      │
│  │ last_transaction_at: 2024-01-15 10:30:00          │      │
│  └───────────────────────────────────────────────────┘      │
└─────────────────────────────────────────────────────────────┘
```

#### Instructions

**Step 1:** Define `CreditSource` choices class
```python
class CreditSource(models.TextChoices):
    REFUND = 'REFUND', 'Refund'
    GIFT = 'GIFT', 'Gift Credit'
    PROMOTIONAL = 'PROMOTIONAL', 'Promotional Credit'
    ADJUSTMENT = 'ADJUSTMENT', 'Manual Adjustment'
    COMPENSATION = 'COMPENSATION', 'Compensation'
    LOYALTY_CONVERSION = 'LOYALTY_CONVERSION', 'Loyalty Points Conversion'
```

**Step 2:** Add fields to StoreCredit model
```python
created_from = models.CharField(
    max_length=20,
    choices=CreditSource.choices,
    default=CreditSource.ADJUSTMENT,
    help_text="Source of the credit"
)
source_reference = models.CharField(
    max_length=100,
    blank=True,
    help_text="Reference to source (order ID, invoice, etc.)"
)
issued_by = models.ForeignKey(
    'users.User',
    null=True,
    blank=True,
    on_delete=models.SET_NULL,
    related_name='issued_credits',
    help_text="User who issued this credit"
)
last_transaction_at = models.DateTimeField(
    null=True,
    blank=True,
    help_text="Last credit transaction timestamp"
)
```

**Step 3:** Add index on created_from
- Add to Meta class: `indexes = [models.Index(fields=['created_from'])]`

**Step 4:** Update __str__ method
- Include source: `"Customer: {name} - Balance: Rs. {balance} ({created_from})"`

**Step 5:** Add property for source display
```python
@property
def source_display(self):
    return self.get_created_from_display()
```

**Step 6:** Sri Lanka Context
- Common refund scenario: "Return during Vesak sale"
- Gift credit: "අලුත් අවුරුදු තෑග" (New Year gift)
- Promotional: "Colombo store opening special credit"

#### Verification

```python
# Test credit source tracking
credit = StoreCredit.objects.create(
    customer=customer,
    balance=Decimal('5000.00'),
    created_from=StoreCredit.CreditSource.REFUND,
    source_reference='INV-2024-0001',
    issued_by=admin_user
)

assert credit.source_display == 'Refund'
assert credit.created_from == 'REFUND'
```

**Expected:**
- All source types available
- Source reference stored correctly
- Issued by user tracked
- Display methods work

---

### Task 69: Add Store Credit Expiry

**File:** `apps/credit/models/store_credit.py` (extend)

#### Dependencies
- Task 67-68 (StoreCredit model with fields)
- Django `timezone`

#### Requirements

1. **Expiry Fields**
   - Expiry date for time-limited credits
   - Flag for expired status
   - Grace period support

2. **New Fields**
   ```
   - expiry_date (DateField, null/blank for non-expiring)
   - is_expired (Boolean, computed property)
   - grace_period_days (Integer, default 0)
   - expiry_reminder_sent (Boolean, default False)
   ```

3. **Expiry Logic**
   - Check if current date > expiry_date + grace_period
   - Automatically mark credits as expired
   - Send reminder before expiry

#### Design Diagram

```
┌─────────────────────────────────────────────────────────────┐
│               Store Credit Expiry Timeline                  │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Credit Issued           Reminder          Expires          │
│  ──────┬─────────────────────┬──────────────────┬───────    │
│        │                     │                  │           │
│    2024-01-01           2024-06-24          2024-07-01      │
│                                                             │
│        ├─────── 180 days ────┤─ 7 days ─┤                  │
│        │                     │  reminder │                  │
│        │                     │  window   │                  │
│        │ Valid Period        │           │                  │
│                                          │                  │
│                                          ├─ grace period ─┤ │
│                                          │    30 days      │ │
│                                          │                 │ │
│                                     2024-07-31             │ │
│                                     (Final Expiry)         │ │
│                                                             │
│  Expiry Check Logic:                                        │
│  ┌───────────────────────────────────────────────────┐     │
│  │ def is_expired(self):                             │     │
│  │     if not self.expiry_date:                      │     │
│  │         return False  # No expiry                 │     │
│  │     today = date.today()                          │     │
│  │     grace_end = expiry_date + grace_period_days   │     │
│  │     return today > grace_end                      │     │
│  └───────────────────────────────────────────────────┘     │
│                                                             │
│  Use Cases:                                                 │
│  1. Refund credit: No expiry (expiry_date = None)          │
│  2. Promotional credit: 90 days expiry                      │
│  3. Gift credit: 180 days expiry, 30 days grace            │
│  4. Compensation: 1 year expiry                             │
└─────────────────────────────────────────────────────────────┘
```

#### Instructions

**Step 1:** Add expiry fields to StoreCredit
```python
expiry_date = models.DateField(
    null=True,
    blank=True,
    help_text="Date when credit expires (null = never expires)"
)
grace_period_days = models.IntegerField(
    default=0,
    help_text="Days of grace period after expiry date"
)
expiry_reminder_sent = models.BooleanField(
    default=False,
    help_text="Whether expiry reminder email has been sent"
)
```

**Step 2:** Add `is_expired` property
```python
@property
def is_expired(self):
    """Check if credit has expired"""
    if not self.expiry_date:
        return False  # No expiry date means never expires
    
    today = date.today()
    final_expiry = self.expiry_date + timedelta(days=self.grace_period_days)
    return today > final_expiry

@property
def days_until_expiry(self):
    """Calculate days until expiry"""
    if not self.expiry_date:
        return None
    
    today = date.today()
    delta = self.expiry_date - today
    return delta.days
```

**Step 3:** Add expiry warning method
```python
def should_send_expiry_reminder(self, days_before=7):
    """Check if reminder should be sent"""
    if not self.expiry_date or self.expiry_reminder_sent:
        return False
    
    days_left = self.days_until_expiry
    return days_left is not None and 0 < days_left <= days_before
```

**Step 4:** Add method to get available (non-expired) balance
```python
def get_available_balance(self):
    """Return balance only if not expired"""
    if self.is_expired:
        return Decimal('0.00')
    return self.balance
```

**Step 5:** Override save to auto-set expiry for promotional credits
```python
def save(self, *args, **kwargs):
    # Auto-set expiry for promotional credits if not set
    if self.created_from == self.CreditSource.PROMOTIONAL and not self.expiry_date:
        self.expiry_date = date.today() + timedelta(days=90)
    
    super().save(*args, **kwargs)
```

**Step 6:** Add manager method to get expired credits
```python
class StoreCreditManager(models.Manager):
    def expired(self):
        """Get all expired credits"""
        today = date.today()
        return self.filter(
            expiry_date__isnull=False,
            expiry_date__lt=today
        ).filter(
            models.Q(grace_period_days=0) |
            models.Q(expiry_date__lt=today - models.F('grace_period_days'))
        )
    
    def expiring_soon(self, days=7):
        """Get credits expiring within days"""
        today = date.today()
        future_date = today + timedelta(days=days)
        return self.filter(
            expiry_date__gte=today,
            expiry_date__lte=future_date,
            expiry_reminder_sent=False
        )

# Add to model
objects = StoreCreditManager()
```

**Step 7:** Sri Lanka Context
- Promotional credits: "අලුත් අවුරුදු වට්ටම් ණය - දින 90 කින් කල් ඉකුත් වේ"
- Refund credits: No expiry (local practice)
- Grace period: 30 days common in Sri Lankan retail

#### Verification

```python
# Test expiry logic
credit = StoreCredit.objects.create(
    customer=customer,
    balance=Decimal('1000.00'),
    created_from='PROMOTIONAL',
    expiry_date=date.today() + timedelta(days=10)
)

# Not expired yet
assert not credit.is_expired
assert credit.days_until_expiry == 10
assert credit.get_available_balance() == Decimal('1000.00')

# Should send reminder
credit.expiry_date = date.today() + timedelta(days=5)
assert credit.should_send_expiry_reminder(days_before=7)

# Test expired
credit.expiry_date = date.today() - timedelta(days=1)
assert credit.is_expired
assert credit.get_available_balance() == Decimal('0.00')
```

**Expected:**
- Expiry logic works correctly
- Grace period considered
- Available balance returns 0 for expired credits
- Reminder check works
- Manager methods return correct querysets

---

### Task 70: Run Store Credit Migrations

**Command:** `python manage.py makemigrations credit`  
**Command:** `python manage.py migrate credit`

#### Dependencies
- Tasks 67-69 (StoreCredit model complete)
- PostgreSQL database running

#### Requirements

1. **Migration Creation**
   - Generate migration for StoreCredit model
   - Include all fields and constraints

2. **Migration Review**
   - Check foreign keys
   - Verify indexes
   - Check decimal precision

3. **Migration Application**
   - Apply to development database
   - Verify table created

#### Instructions

**Step 1:** Generate migrations
```bash
python manage.py makemigrations credit
```

**Expected Output:**
```
Migrations for 'credit':
  apps/credit/migrations/0008_storecredit.py
    - Create model StoreCredit
```

**Step 2:** Review migration file
- Location: `apps/credit/migrations/0008_storecredit.py`
- Check OneToOneField to Customer
- Verify Decimal fields: max_digits=10, decimal_places=2
- Check indexes on customer, created_from

**Step 3:** Check SQL (optional)
```bash
python manage.py sqlmigrate credit 0008
```

**Step 4:** Apply migration
```bash
python manage.py migrate credit
```

**Expected Output:**
```
Running migrations:
  Applying credit.0008_storecredit... OK
```

**Step 5:** Verify in database
```sql
\d credit_store_credits
-- Check columns, types, constraints
```

#### Verification

```bash
python manage.py check credit

python manage.py shell
>>> from apps.credit.models import StoreCredit
>>> StoreCredit._meta.db_table
'credit_store_credits'
```

**Expected:**
- Migration applied successfully
- Table exists with correct structure
- Decimal fields have 2 decimal places

---

### Task 71: Create StoreCreditTransaction Model

**File:** `apps/credit/models/store_credit_transaction.py`

#### Dependencies
- Task 67-70 (StoreCredit model)
- Django models
- User model for tracking

#### Requirements

1. **Transaction Model**
   - Track all credit movements
   - Link to StoreCredit account
   - Store transaction type, amount, reference

2. **Key Fields**
   ```
   - store_credit (FK to StoreCredit, CASCADE)
   - transaction_type (ISSUE, REDEEM, EXPIRE, ADJUST)
   - amount (Decimal, can be negative for redemptions)
   - balance_before (Decimal)
   - balance_after (Decimal)
   - reference (CharField, order/invoice ID)
   - performed_by (FK to User, null/blank)
   - notes (TextField)
   ```

3. **Transaction Types**
   ```
   ISSUE = 'ISSUE', 'Issue Credit'
   REDEEM = 'REDEEM', 'Redeem Credit'
   EXPIRE = 'EXPIRE', 'Expire Credit'
   ADJUST = 'ADJUST', 'Manual Adjustment'
   ```

#### Design Diagram

```
┌─────────────────────────────────────────────────────────────┐
│           StoreCreditTransaction Model                      │
├─────────────────────────────────────────────────────────────┤
│  [BaseModel Fields]                                         │
│  - id: UUID                                                 │
│  - tenant: FK → Tenant                                      │
│  - created_at: DateTime                                     │
│  - updated_at: DateTime                                     │
│                                                             │
│  [Relationship]                                             │
│  - store_credit: FK → StoreCredit (CASCADE)                 │
│  - performed_by: FK → User (SET_NULL)                       │
│                                                             │
│  [Transaction Details]                                      │
│  - transaction_type: CharField (choices)                    │
│  - amount: Decimal(10,2)                                    │
│  - balance_before: Decimal(10,2)                            │
│  - balance_after: Decimal(10,2)                             │
│  - reference: CharField(100) [Order/Invoice ID]             │
│  - notes: TextField                                         │
│                                                             │
│  Example Transaction Flow:                                  │
│  ┌───────────────────────────────────────────────────┐     │
│  │ 1. ISSUE - Rs. 5000 (Refund INV-001)              │     │
│  │    Balance: Rs. 0 → Rs. 5000                      │     │
│  ├───────────────────────────────────────────────────┤     │
│  │ 2. REDEEM - Rs. -2000 (Order ORD-123)             │     │
│  │    Balance: Rs. 5000 → Rs. 3000                   │     │
│  ├───────────────────────────────────────────────────┤     │
│  │ 3. ISSUE - Rs. 1000 (Promotional)                 │     │
│  │    Balance: Rs. 3000 → Rs. 4000                   │     │
│  ├───────────────────────────────────────────────────┤     │
│  │ 4. REDEEM - Rs. -4000 (Order ORD-456)             │     │
│  │    Balance: Rs. 4000 → Rs. 0                      │     │
│  └───────────────────────────────────────────────────┘     │
└─────────────────────────────────────────────────────────────┘
```

#### Instructions

**Step 1:** Create model file
- Location: `apps/credit/models/store_credit_transaction.py`
- Import BaseModel, StoreCredit, User

**Step 2:** Define `TransactionType` choices
```python
class TransactionType(models.TextChoices):
    ISSUE = 'ISSUE', 'Issue Credit'
    REDEEM = 'REDEEM', 'Redeem Credit'
    EXPIRE = 'EXPIRE', 'Expire Credit'
    ADJUST = 'ADJUST', 'Manual Adjustment'
    REFUND = 'REFUND', 'Refund to Original Payment'
```

**Step 3:** Define `StoreCreditTransaction` model
- Inherit from BaseModel
- Add all required fields
- Use Decimal(10, 2) for amounts
- ForeignKeys with appropriate on_delete

**Step 4:** Add Meta class
```python
class Meta:
    db_table = 'credit_store_credit_transactions'
    verbose_name = 'Store Credit Transaction'
    verbose_name_plural = 'Store Credit Transactions'
    ordering = ['-created_at']
    indexes = [
        models.Index(fields=['store_credit', '-created_at']),
        models.Index(fields=['transaction_type']),
        models.Index(fields=['reference']),
    ]
```

**Step 5:** Implement __str__ method
```python
def __str__(self):
    return f"{self.transaction_type} - Rs. {self.amount} ({self.created_at.date()})"
```

**Step 6:** Add helper methods
```python
@property
def is_positive(self):
    """Check if transaction added credit"""
    return self.amount > 0

@property
def is_negative(self):
    """Check if transaction reduced credit"""
    return self.amount < 0
```

**Step 7:** Update `models/__init__.py`
- Import and export `StoreCreditTransaction`

**Step 8:** Add migration
```bash
python manage.py makemigrations credit
python manage.py migrate credit
```

#### Verification

```python
from apps.credit.models import StoreCreditTransaction

# Create test transaction
txn = StoreCreditTransaction.objects.create(
    store_credit=credit,
    transaction_type='ISSUE',
    amount=Decimal('1000.00'),
    balance_before=Decimal('0.00'),
    balance_after=Decimal('1000.00'),
    reference='INV-001'
)

assert txn.is_positive
assert str(txn).startswith('ISSUE')
```

**Expected:**
- Model creates successfully
- Transaction types work
- Foreign keys proper
- Indexes created

---

### Task 72: Implement Store Credit Issue

**File:** `apps/credit/services/store_credit_service.py`

#### Dependencies
- Tasks 67-71 (StoreCredit and Transaction models)
- Django transaction support
- User model

#### Requirements

1. **Issue Credit Method**
   - Create or update StoreCredit for customer
   - Add amount to balance
   - Create transaction record
   - Support different sources (refund, gift, promo)

2. **Parameters**
   ```
   - customer_id: UUID
   - amount: Decimal
   - source: CreditSource
   - reference: str (order/invoice ID)
   - issued_by: User
   - expiry_days: int (optional, for promotional)
   - notes: str (optional)
   ```

3. **Validation**
   - Amount must be positive
   - Customer must exist
   - Source must be valid

4. **Atomic Operation**
   - Use database transaction
   - Create credit record if doesn't exist
   - Update balance
   - Create transaction record
   - All or nothing

#### Design Diagram

```
┌─────────────────────────────────────────────────────────────┐
│              Issue Store Credit Flow                        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Input: customer, amount, source, reference                 │
│  ┌────────────────────────────────────────────┐             │
│  │  1. Validate inputs                        │             │
│  │     - Amount > 0                           │             │
│  │     - Customer exists                      │             │
│  │     - Valid source type                    │             │
│  └───────────────────┬────────────────────────┘             │
│                      │                                      │
│                      ▼                                      │
│  ┌────────────────────────────────────────────┐             │
│  │  2. Start database transaction             │             │
│  └───────────────────┬────────────────────────┘             │
│                      │                                      │
│                      ▼                                      │
│  ┌────────────────────────────────────────────┐             │
│  │  3. Get or create StoreCredit              │             │
│  │     - OneToOne with customer               │             │
│  │     - Set created_from, issued_by          │             │
│  └───────────────────┬────────────────────────┘             │
│                      │                                      │
│                      ▼                                      │
│  ┌────────────────────────────────────────────┐             │
│  │  4. Record balance before                  │             │
│  │     balance_before = credit.balance        │             │
│  └───────────────────┬────────────────────────┘             │
│                      │                                      │
│                      ▼                                      │
│  ┌────────────────────────────────────────────┐             │
│  │  5. Update balances                        │             │
│  │     credit.balance += amount               │             │
│  │     credit.total_issued += amount          │             │
│  │     credit.last_transaction_at = now()     │             │
│  └───────────────────┬────────────────────────┘             │
│                      │                                      │
│                      ▼                                      │
│  ┌────────────────────────────────────────────┐             │
│  │  6. Set expiry if promotional              │             │
│  │     If source==PROMOTIONAL and expiry_days │             │
│  │     credit.expiry_date = today + days      │             │
│  └───────────────────┬────────────────────────┘             │
│                      │                                      │
│                      ▼                                      │
│  ┌────────────────────────────────────────────┐             │
│  │  7. Create transaction record              │             │
│  │     - type: ISSUE                          │             │
│  │     - amount: +amount                      │             │
│  │     - balance_before                       │             │
│  │     - balance_after                        │             │
│  │     - reference                            │             │
│  └───────────────────┬────────────────────────┘             │
│                      │                                      │
│                      ▼                                      │
│  ┌────────────────────────────────────────────┐             │
│  │  8. Save credit and transaction            │             │
│  └───────────────────┬────────────────────────┘             │
│                      │                                      │
│                      ▼                                      │
│  ┌────────────────────────────────────────────┐             │
│  │  9. Commit transaction                     │             │
│  └───────────────────┬────────────────────────┘             │
│                      │                                      │
│                      ▼                                      │
│  ┌────────────────────────────────────────────┐             │
│  │  10. Send notification email               │             │
│  │      "Rs. 5000 credit added"               │             │
│  └────────────────────────────────────────────┘             │
│                                                             │
│  Return: {                                                  │
│    success: True,                                           │
│    credit: StoreCreditobject,                               │
│    transaction: Transaction object,                         │
│    new_balance: Decimal                                     │
│  }                                                          │
└─────────────────────────────────────────────────────────────┘
```

#### Instructions

**Step 1:** Create service file
- Location: `apps/credit/services/store_credit_service.py`
- Import models, transaction, Decimal

**Step 2:** Create `StoreCreditService` class
```python
class StoreCreditService:
    @staticmethod
    def issue_credit(customer_id, amount, source, reference='', 
                     issued_by=None, expiry_days=None, notes=''):
        """Issue store credit to customer"""
        pass
```

**Step 3:** Implement validation
```python
# Validate amount
if amount <= 0:
    return {'success': False, 'error': 'Amount must be positive'}

# Validate customer
try:
    customer = Customer.objects.get(id=customer_id)
except Customer.DoesNotExist:
    return {'success': False, 'error': 'Customer not found'}

# Validate source
if source not in [choice[0] for choice in StoreCredit.CreditSource.choices]:
    return {'success': False, 'error': 'Invalid source type'}
```

**Step 4:** Implement credit issuance with transaction
```python
from django.db import transaction as db_transaction

with db_transaction.atomic():
    # Get or create store credit
    credit, created = StoreCredit.objects.get_or_create(
        customer=customer,
        defaults={
            'balance': Decimal('0.00'),
            'created_from': source,
            'issued_by': issued_by,
        }
    )
    
    # Record balance before
    balance_before = credit.balance
    
    # Update balance
    credit.balance += amount
    credit.total_issued += amount
    credit.last_transaction_at = timezone.now()
    
    # Set expiry for promotional credits
    if source == StoreCredit.CreditSource.PROMOTIONAL and expiry_days:
        credit.expiry_date = date.today() + timedelta(days=expiry_days)
    
    credit.save()
    
    # Create transaction record
    txn = StoreCreditTransaction.objects.create(
        store_credit=credit,
        transaction_type='ISSUE',
        amount=amount,
        balance_before=balance_before,
        balance_after=credit.balance,
        reference=reference,
        performed_by=issued_by,
        notes=notes
    )
    
    return {
        'success': True,
        'credit': credit,
        'transaction': txn,
        'new_balance': credit.balance,
        'message': f'Successfully issued Rs. {amount} credit'
    }
```

**Step 5:** Add notification
```python
# After transaction commits
send_email(
    to=customer.email,
    subject='Store Credit Added',
    template='emails/credit_issued.html',
    context={
        'customer_name': customer.first_name,
        'amount': amount,
        'source': credit.get_source_display(),
        'new_balance': credit.balance,
        'expiry_date': credit.expiry_date
    }
)
```

**Step 6:** Sri Lanka Context
- Email in Sinhala/Tamil/English
- Example: "ගබඩා ණය රු. 5000ක් එකතු කර ඇත"
- Support for Daraz-style credit notifications

#### Verification

```python
from apps.credit.services import StoreCreditService

result = StoreCreditService.issue_credit(
    customer_id=customer.id,
    amount=Decimal('5000.00'),
    source='REFUND',
    reference='INV-2024-001',
    issued_by=admin_user,
    notes='Refund for returned item'
)

assert result['success'] == True
assert result['new_balance'] == Decimal('5000.00')

# Check transaction created
assert StoreCreditTransaction.objects.filter(
    store_credit=result['credit'],
    transaction_type='ISSUE'
).exists()
```

**Expected:**
- Credit issued successfully
- Balance updated correctly
- Transaction recorded
- Email sent
- Atomic operation (rollback on error)

---

### Task 73: Implement Store Credit Redemption

**File:** `apps/credit/services/store_credit_service.py` (extend)

#### Dependencies
- Task 72 (Issue credit implementation)
- Order/checkout system integration

#### Requirements

1. **Redeem Credit Method**
   - Validate sufficient balance
   - Deduct amount from balance
   - Create redemption transaction
   - Link to order

2. **Parameters**
   ```
   - customer_id: UUID
   - amount: Decimal
   - order_id: UUID
   - performed_by: User (optional)
   ```

3. **Validation**
   - Customer has store credit
   - Sufficient available balance (not expired)
   - Amount positive
   - Order exists

4. **Checkout Integration**
   - Calculate available credit
   - Apply to order total
   - Remaining balance after redemption

#### Design Diagram

```
┌─────────────────────────────────────────────────────────────┐
│           Redeem Store Credit Flow                          │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Order Checkout: Total Rs. 8000                             │
│  Customer Credit: Rs. 5000 available                        │
│                                                             │
│  ┌────────────────────────────────────────────┐             │
│  │  1. Validate redemption request            │             │
│  │     - Credit account exists                │             │
│  │     - Not expired                          │             │
│  │     - Sufficient balance                   │             │
│  │     - Order exists                         │             │
│  └───────────────────┬────────────────────────┘             │
│                      │                                      │
│                      ▼                                      │
│  ┌────────────────────────────────────────────┐             │
│  │  2. Calculate redemption amount            │             │
│  │     requested: Rs. 5000                    │             │
│  │     available: Rs. 5000                    │             │
│  │     to_redeem: min(requested, available)   │             │
│  └───────────────────┬────────────────────────┘             │
│                      │                                      │
│                      ▼                                      │
│  ┌────────────────────────────────────────────┐             │
│  │  3. Start database transaction             │             │
│  └───────────────────┬────────────────────────┘             │
│                      │                                      │
│                      ▼                                      │
│  ┌────────────────────────────────────────────┐             │
│  │  4. Deduct from balance                    │             │
│  │     balance_before: Rs. 5000               │             │
│  │     amount: -Rs. 5000                      │             │
│  │     balance_after: Rs. 0                   │             │
│  └───────────────────┬────────────────────────┘             │
│                      │                                      │
│                      ▼                                      │
│  ┌────────────────────────────────────────────┐             │
│  │  5. Update credit record                   │             │
│  │     credit.balance -= amount               │             │
│  │     credit.total_used += amount            │             │
│  │     credit.last_transaction_at = now()     │             │
│  └───────────────────┬────────────────────────┘             │
│                      │                                      │
│                      ▼                                      │
│  ┌────────────────────────────────────────────┐             │
│  │  6. Create REDEEM transaction              │             │
│  │     - type: REDEEM                         │             │
│  │     - amount: -5000 (negative)             │             │
│  │     - reference: order_id                  │             │
│  └───────────────────┬────────────────────────┘             │
│                      │                                      │
│                      ▼                                      │
│  ┌────────────────────────────────────────────┐             │
│  │  7. Update order payment                   │             │
│  │     order.credit_applied = Rs. 5000        │             │
│  │     order.remaining_total = Rs. 3000       │             │
│  └───────────────────┬────────────────────────┘             │
│                      │                                      │
│                      ▼                                      │
│  ┌────────────────────────────────────────────┐             │
│  │  8. Commit transaction                     │             │
│  └────────────────────────────────────────────┘             │
│                                                             │
│  Order Payment Breakdown:                                   │
│  Total: Rs. 8000                                            │
│  Store Credit: -Rs. 5000                                    │
│  Remaining: Rs. 3000 (pay via card/cash)                    │
└─────────────────────────────────────────────────────────────┘
```

#### Instructions

**Step 1:** Add redeem method to StoreCreditService
```python
@staticmethod
def redeem_credit(customer_id, amount, order_id, performed_by=None, notes=''):
    """Redeem store credit for an order"""
    pass
```

**Step 2:** Implement validation
```python
# Validate amount
if amount <= 0:
    return {'success': False, 'error': 'Amount must be positive'}

# Get credit account
try:
    credit = StoreCredit.objects.select_for_update().get(customer_id=customer_id)
except StoreCredit.DoesNotExist:
    return {'success': False, 'error': 'No store credit account found'}

# Check not expired
if credit.is_expired:
    return {'success': False, 'error': 'Store credit has expired'}

# Check sufficient balance
available_balance = credit.get_available_balance()
if amount > available_balance:
    return {
        'success': False,
        'error': f'Insufficient credit. Available: Rs. {available_balance}'
    }
```

**Step 3:** Implement redemption with transaction
```python
with db_transaction.atomic():
    # Record balance before
    balance_before = credit.balance
    
    # Deduct amount
    credit.balance -= amount
    credit.total_used += amount
    credit.last_transaction_at = timezone.now()
    credit.save()
    
    # Create transaction (amount is negative)
    txn = StoreCreditTransaction.objects.create(
        store_credit=credit,
        transaction_type='REDEEM',
        amount=-amount,  # Negative for redemption
        balance_before=balance_before,
        balance_after=credit.balance,
        reference=str(order_id),
        performed_by=performed_by,
        notes=notes or f'Redeemed for order {order_id}'
    )
    
    return {
        'success': True,
        'credit': credit,
        'transaction': txn,
        'redeemed_amount': amount,
        'remaining_balance': credit.balance,
        'message': f'Successfully redeemed Rs. {amount} credit'
    }
```

**Step 4:** Add partial redemption support
```python
@staticmethod
def calculate_max_redemption(customer_id, order_total):
    """Calculate maximum credit that can be applied to order"""
    try:
        credit = StoreCredit.objects.get(customer_id=customer_id)
        available = credit.get_available_balance()
        return min(available, order_total)
    except StoreCredit.DoesNotExist:
        return Decimal('0.00')
```

**Step 5:** Add checkout integration helper
```python
@staticmethod
def apply_credit_to_order(order_id, credit_amount=None):
    """Apply store credit to order (full or partial)"""
    order = Order.objects.get(id=order_id)
    customer = order.customer
    
    if credit_amount is None:
        # Use maximum available
        credit_amount = StoreCreditService.calculate_max_redemption(
            customer.id,
            order.total_amount
        )
    
    if credit_amount == 0:
        return {'success': False, 'error': 'No credit available'}
    
    # Redeem credit
    result = StoreCreditService.redeem_credit(
        customer_id=customer.id,
        amount=credit_amount,
        order_id=order.id,
        notes=f'Applied to order {order.order_number}'
    )
    
    if result['success']:
        # Update order
        order.credit_applied = credit_amount
        order.remaining_total = order.total_amount - credit_amount
        order.save()
    
    return result
```

**Step 6:** Sri Lanka Context
- Common in Sri Lankan e-commerce (Daraz, Pickme)
- Display: "ගබඩා ණය භාවිතා කරන්න - රු. 5000 ලබා ගත හැකිය"
- Partial redemption common practice

#### Verification

```python
# Setup
credit = StoreCredit.objects.create(
    customer=customer,
    balance=Decimal('5000.00')
)

order = Order.objects.create(
    customer=customer,
    total_amount=Decimal('8000.00')
)

# Redeem credit
result = StoreCreditService.redeem_credit(
    customer_id=customer.id,
    amount=Decimal('5000.00'),
    order_id=order.id
)

assert result['success'] == True
assert result['redeemed_amount'] == Decimal('5000.00')
assert result['remaining_balance'] == Decimal('0.00')

# Check transaction
txn = StoreCreditTransaction.objects.get(id=result['transaction'].id)
assert txn.transaction_type == 'REDEEM'
assert txn.amount == Decimal('-5000.00')  # Negative

# Test insufficient balance
credit.balance = Decimal('100.00')
credit.save()

result = StoreCreditService.redeem_credit(
    customer_id=customer.id,
    amount=Decimal('500.00'),
    order_id=order.id
)

assert result['success'] == False
assert 'Insufficient' in result['error']
```

**Expected:**
- Redemption succeeds with sufficient balance
- Balance decremented correctly
- Transaction created with negative amount
- Order updated with credit applied
- Fails gracefully with insufficient balance

---

### Task 74: Implement Store Credit Balance Check

**File:** `apps/credit/services/store_credit_service.py` (extend)

#### Dependencies
- Tasks 72-73 (Issue and redeem implementations)

#### Requirements

1. **Balance Check Method**
   - Get current available balance
   - Consider expiry
   - Return detailed breakdown

2. **Breakdown Information**
   ```
   - current_balance: Decimal
   - expired_amount: Decimal (if any)
   - available_balance: Decimal (current - expired)
   - total_issued: Decimal
   - total_used: Decimal
   - expiry_date: Date (if applicable)
   - days_until_expiry: int (if applicable)
   ```

3. **Quick Checks**
   - has_credit(): Boolean
   - can_redeem(amount): Boolean
   - needs_expiry_reminder(): Boolean

#### Design Diagram

```
┌─────────────────────────────────────────────────────────────┐
│              Credit Balance Breakdown                       │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  StoreCredit for "කුමාර සිල්වා":                             │
│  ┌───────────────────────────────────────────────────┐      │
│  │ Total Issued (Lifetime): Rs. 15,000               │      │
│  │   - Refunds: Rs. 10,000                           │      │
│  │   - Gifts: Rs. 2,000                              │      │
│  │   - Promotional: Rs. 3,000                        │      │
│  ├───────────────────────────────────────────────────┤      │
│  │ Total Used (Lifetime): Rs. 8,500                  │      │
│  │   - 5 orders redeemed                             │      │
│  ├───────────────────────────────────────────────────┤      │
│  │ Current Balance: Rs. 6,500                        │      │
│  │   - Active (no expiry): Rs. 5,000                 │      │
│  │   - Expiring in 15 days: Rs. 1,500                │      │
│  ├───────────────────────────────────────────────────┤      │
│  │ Expired Amount: Rs. 0                             │      │
│  ├───────────────────────────────────────────────────┤      │
│  │ Available to Use: Rs. 6,500                       │      │
│  └───────────────────────────────────────────────────┘      │
│                                                             │
│  Quick Checks:                                              │
│  ✅ has_credit() = True (balance > 0)                       │
│  ✅ can_redeem(Rs. 3000) = True (3000 <= 6500)              │
│  ❌ can_redeem(Rs. 7000) = False (7000 > 6500)              │
│  ⚠️  needs_expiry_reminder() = True (15 days < 30)          │
│                                                             │
│  Balance Calculation:                                       │
│  available_balance = current_balance - expired_amount       │
│  If expiry_date passed:                                     │
│      available_balance = 0                                  │
└─────────────────────────────────────────────────────────────┘
```

#### Instructions

**Step 1:** Add balance check method
```python
@staticmethod
def get_balance_breakdown(customer_id):
    """Get detailed credit balance breakdown"""
    try:
        credit = StoreCredit.objects.get(customer_id=customer_id)
    except StoreCredit.DoesNotExist:
        return {
            'has_credit': False,
            'current_balance': Decimal('0.00'),
            'available_balance': Decimal('0.00'),
            'total_issued': Decimal('0.00'),
            'total_used': Decimal('0.00'),
        }
    
    available = credit.get_available_balance()
    
    breakdown = {
        'has_credit': credit.balance > 0,
        'current_balance': credit.balance,
        'available_balance': available,
        'total_issued': credit.total_issued,
        'total_used': credit.total_used,
        'is_expired': credit.is_expired,
        'expiry_date': credit.expiry_date,
        'days_until_expiry': credit.days_until_expiry,
        'source': credit.get_source_display(),
        'last_transaction': credit.last_transaction_at,
    }
    
    return breakdown
```

**Step 2:** Add quick check methods
```python
@staticmethod
def has_credit(customer_id):
    """Check if customer has any available credit"""
    try:
        credit = StoreCredit.objects.get(customer_id=customer_id)
        return credit.get_available_balance() > 0
    except StoreCredit.DoesNotExist:
        return False

@staticmethod
def can_redeem(customer_id, amount):
    """Check if customer can redeem specified amount"""
    try:
        credit = StoreCredit.objects.get(customer_id=customer_id)
        available = credit.get_available_balance()
        return amount <= available
    except StoreCredit.DoesNotExist:
        return False

@staticmethod
def needs_expiry_reminder(customer_id, days_threshold=30):
    """Check if customer should receive expiry reminder"""
    try:
        credit = StoreCredit.objects.get(customer_id=customer_id)
        return credit.should_send_expiry_reminder(days_before=days_threshold)
    except StoreCredit.DoesNotExist:
        return False
```

**Step 3:** Add transaction history method
```python
@staticmethod
def get_transaction_history(customer_id, limit=10):
    """Get recent credit transactions"""
    try:
        credit = StoreCredit.objects.get(customer_id=customer_id)
        transactions = StoreCreditTransaction.objects.filter(
            store_credit=credit
        ).order_by('-created_at')[:limit]
        
        return {
            'success': True,
            'transactions': [
                {
                    'type': txn.transaction_type,
                    'amount': txn.amount,
                    'balance_after': txn.balance_after,
                    'reference': txn.reference,
                    'date': txn.created_at,
                    'notes': txn.notes
                }
                for txn in transactions
            ]
        }
    except StoreCredit.DoesNotExist:
        return {'success': False, 'error': 'No credit account found'}
```

**Step 4:** Add API view helper (for frontend)
```python
@staticmethod
def get_checkout_display(customer_id, order_total):
    """Get credit info formatted for checkout display"""
    breakdown = StoreCreditService.get_balance_breakdown(customer_id)
    
    if not breakdown['has_credit']:
        return {
            'has_credit': False,
            'message': 'No store credit available'
        }
    
    available = breakdown['available_balance']
    max_applicable = min(available, order_total)
    remaining_order_total = order_total - max_applicable
    
    return {
        'has_credit': True,
        'available_credit': available,
        'max_applicable': max_applicable,
        'remaining_order_total': remaining_order_total,
        'can_cover_full_order': max_applicable >= order_total,
        'expiry_warning': breakdown['days_until_expiry'] if breakdown['days_until_expiry'] and breakdown['days_until_expiry'] < 30 else None
    }
```

**Step 5:** Add admin dashboard aggregations
```python
@staticmethod
def get_credit_statistics(tenant_id=None):
    """Get aggregate credit statistics for admin dashboard"""
    query = StoreCredit.objects.all()
    if tenant_id:
        query = query.filter(tenant_id=tenant_id)
    
    from django.db.models import Sum, Count, Avg
    
    stats = query.aggregate(
        total_customers_with_credit=Count('id'),
        total_balance=Sum('balance'),
        total_issued=Sum('total_issued'),
        total_used=Sum('total_used'),
        avg_balance=Avg('balance')
    )
    
    # Get expiring soon count
    expiring_soon = query.filter(
        expiry_date__lte=date.today() + timedelta(days=30),
        expiry_date__gte=date.today()
    ).count()
    
    stats['expiring_soon_count'] = expiring_soon
    
    return stats
```

**Step 6:** Sri Lanka Context
- Display formats: "ඔබට රු. 6500ක ණය ශේෂයක් ඇත"
- Checkout message: "Rs. 6500 store credit available - Apply to order?"
- Expiry warning: "ඔබේ ණය දින 15කින් කල් ඉකුත් වේ!"

#### Verification

```python
# Setup test data
credit = StoreCredit.objects.create(
    customer=customer,
    balance=Decimal('6500.00'),
    total_issued=Decimal('15000.00'),
    total_used=Decimal('8500.00'),
    expiry_date=date.today() + timedelta(days=15)
)

# Test balance breakdown
breakdown = StoreCreditService.get_balance_breakdown(customer.id)
assert breakdown['has_credit'] == True
assert breakdown['current_balance'] == Decimal('6500.00')
assert breakdown['available_balance'] == Decimal('6500.00')
assert breakdown['days_until_expiry'] == 15

# Test quick checks
assert StoreCreditService.has_credit(customer.id) == True
assert StoreCreditService.can_redeem(customer.id, Decimal('3000.00')) == True
assert StoreCreditService.can_redeem(customer.id, Decimal('7000.00')) == False
assert StoreCreditService.needs_expiry_reminder(customer.id, days_threshold=30) == True

# Test checkout display
order_total = Decimal('5000.00')
checkout = StoreCreditService.get_checkout_display(customer.id, order_total)
assert checkout['has_credit'] == True
assert checkout['max_applicable'] == Decimal('5000.00')
assert checkout['can_cover_full_order'] == True
assert checkout['remaining_order_total'] == Decimal('0.00')

# Test with expired credit
credit.expiry_date = date.today() - timedelta(days=1)
credit.save()

breakdown = StoreCreditService.get_balance_breakdown(customer.id)
assert breakdown['is_expired'] == True
assert breakdown['available_balance'] == Decimal('0.00')
assert StoreCreditService.can_redeem(customer.id, Decimal('100.00')) == False
```

**Expected:**
- Balance breakdown accurate
- Quick checks work correctly
- Expiry considered in calculations
- Checkout display formatted properly
- Statistics aggregations correct

---

## Summary

### Completed Tasks

| Task # | Status | Component | Notes |
|--------|--------|-----------|-------|
| 67 | ✅ | StoreCredit Model | OneToOne with Customer |
| 68 | ✅ | Credit Fields | Source tracking, issued_by |
| 69 | ✅ | Credit Expiry | Expiry date, grace period |
| 70 | ✅ | Migrations | Database schema applied |
| 71 | ✅ | Transaction Model | Audit trail for credit movements |
| 72 | ✅ | Issue Credit | Service method for adding credit |
| 73 | ✅ | Redeem Credit | Service method for using credit |
| 74 | ✅ | Balance Check | Detailed breakdown and validations |

### Key Deliverables

1. **StoreCredit Model**
   - File: `apps/credit/models/store_credit.py`
   - Features: Balance tracking, expiry, source tracking
   - OneToOne with Customer
   - Currency support (LKR)

2. **StoreCreditTransaction Model**
   - File: `apps/credit/models/store_credit_transaction.py`
   - Complete audit trail
   - Tracks balance before/after
   - Links to orders

3. **StoreCreditService**
   - File: `apps/credit/services/store_credit_service.py`
   - Methods: issue_credit, redeem_credit, get_balance_breakdown
   - Atomic transactions
   - Email notifications

### Technical Highlights

**Atomic Operations:**
- All credit operations use database transactions
- Rollback on any failure
- Consistent state guaranteed

**Expiry Management:**
- Flexible expiry dates
- Grace period support
- Automated expiry checks
- Reminder system

**Audit Trail:**
- Every credit movement tracked
- Balance before/after recorded
- User attribution
- Order references

### Sri Lanka Context

**Currency:**
- LKR (Rs.) throughout
- Decimal precision for rupees

**Use Cases:**
- Refund credits for returns (no expiry)
- Gift credits for birthdays/festivals
- Promotional credits (90-day expiry)
- Compensation for service issues

**Local Practices:**
- Common in e-commerce (Daraz style)
- Gift credits popular for festivals
- Partial redemption standard

### Testing Checklist

- [ ] StoreCredit model creates successfully
- [ ] Source types work correctly
- [ ] Expiry logic calculates properly
- [ ] Grace period considered
- [ ] Transaction model records all movements
- [ ] Issue credit adds balance atomically
- [ ] Redeem credit deducts correctly
- [ ] Insufficient balance handled
- [ ] Expired credit rejected
- [ ] Balance breakdown accurate
- [ ] Quick check methods work
- [ ] Checkout integration functions
- [ ] Email notifications sent

### Next Steps

1. **Continue to Next Document:**
   - [02_Tasks-75-80_Promotions-Dashboard.md](./02_Tasks-75-80_Promotions-Dashboard.md)
   - Tasks 75-80: Points promotions and dashboard

2. **Optional Enhancements:**
   - Bulk credit operations
   - Credit transfer between customers
   - Scheduled credit grants
   - Credit usage analytics

---

## Navigation

- **↑ Parent:** [Group E Overview](./00_GROUP_OVERVIEW.md)
- **← Previous Document:** [Group D: Loyalty Tiers & Rewards](../Group-D_Loyalty-Tiers-Rewards/)
- **→ Next Document:** [02_Tasks-75-80_Promotions-Dashboard.md](./02_Tasks-75-80_Promotions-Dashboard.md)

---

**Document End** - Tasks 67-74 Complete ✅
