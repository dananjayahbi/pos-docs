# Tasks 11-15: Session Model & Fields

> **Phase:** 05 - ERP Core Modules Part 2  
> **SubPhase:** 01 - POS Terminal Core  
> **Group:** A - POS Terminal & Session Models  
> **Document:** 03 of 04  
> **Tasks Covered:** 11, 12, 13, 14, 15

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [02_Tasks-06-10_Terminal-Fields-Meta.md](02_Tasks-06-10_Terminal-Fields-Meta.md)
- **→ Next Document:** [04_Tasks-16-18_Session-Methods-Admin.md](04_Tasks-16-18_Session-Methods-Admin.md)

---

## Document Overview

This document covers the creation of the POSSession model, which represents a cashier shift or work session on a POS terminal. Sessions track timing, cash reconciliation, sales totals, and provide the foundation for proper financial accounting and audit trails.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 11 | Create POSSession model | Medium |
| 12 | Add session timing fields | Low |
| 13 | Add opening cash field | Low |
| 14 | Add closing cash fields | Medium |
| 15 | Add session totals | Medium |

---

## Task 11: Create POSSession model

### Overview
Create the POSSession model that represents a cashier shift or work session. Each session is linked to a terminal and a user (cashier), tracking all transactions during that shift period for proper accounting and reconciliation.

### Dependencies
- Task 10: Create POSTerminal Meta class
- Phase-03: User model must exist

### Instructions

1. **Create the session model file**
   - Create `pos_session.py` in `apps/pos/terminal/models/`
   - This file will contain the POSSession model

2. **Import required modules**
   - Import Django model classes and fields
   - Import BaseModel from core mixins
   - Import session status constants from `apps.pos.constants`
   - Import User model from Django auth
   - Import POSTerminal from the same models package

3. **Define the POSSession model class**
   - Create class `POSSession` inheriting from `BaseModel`
   - Add model-level docstring explaining session purpose

4. **Add terminal foreign key**
   - `terminal` field: ForeignKey to POSTerminal model
   - Set on_delete=models.PROTECT to prevent terminal deletion during active session
   - Set related_name='sessions'
   - Add help_text explaining terminal linkage

5. **Add user/cashier foreign key**
   - `user` field: ForeignKey to User model
   - Set on_delete=models.PROTECT to prevent user deletion with active sessions
   - Set related_name='pos_sessions'
   - Add help_text explaining cashier assignment

6. **Add session status field**
   - `status` field: CharField with choices from `SESSION_STATUS_CHOICES`
   - Set max_length=20
   - Set default to `SESSION_STATUS_OPEN`
   - Add help_text explaining current session state
   - Add db_index=True for filtering active sessions

7. **Add session number field**
   - `session_number` field: CharField with max_length=50, unique per tenant
   - Add help_text for human-readable session identifier
   - Format: `SESS-{terminal_code}-{YYYYMMDD}-{sequence}`

8. **Add string representation method**
   - Define `__str__` method returning session number and terminal
   - Format: "Session SESS-T01-20260123-001 on Terminal T01"

### POSSession Field Summary

| Field | Type | Purpose | Constraints |
|-------|------|---------|-------------|
| `terminal` | ForeignKey | Links to POS terminal | PROTECT, required |
| `user` | ForeignKey | Cashier operating session | PROTECT, required |
| `status` | CharField(20) | Current session state | Choices, indexed |
| `session_number` | CharField(50) | Unique session identifier | Unique per tenant |

### Session Lifecycle States

```
     START
       │
       ▼
   ┌────────┐
   │  OPEN  │ ◄──────────────┐
   └───┬────┘                │
       │                     │
       │                     │
   ┌───┴────────┬──────────┐ │
   │            │          │ │
   ▼            ▼          ▼ │
┌──────────┐ ┌────────┐ ┌─────────────┐
│  CLOSED  │ │SUSPEND │ │FORCE_CLOSED │
└──────────┘ └───┬────┘ └─────────────┘
   (END)         │         (END - Error)
                 │
                 └────────────┘
                   (Resume)
```

### Session Number Format

| Component | Description | Example |
|-----------|-------------|---------|
| **Prefix** | Fixed identifier | SESS |
| **Terminal Code** | Terminal identifier | T01 |
| **Date** | Session start date | 20260123 |
| **Sequence** | Daily sequence number | 001, 002, 003 |
| **Full Format** | Complete session number | SESS-T01-20260123-001 |

### Session Number Generation Logic

```
Daily Sequence Reset:
  Terminal T01 on 2026-01-23:
    - First session:  SESS-T01-20260123-001
    - Second session: SESS-T01-20260123-002
    - Third session:  SESS-T01-20260123-003
  
  Terminal T01 on 2026-01-24:
    - First session:  SESS-T01-20260124-001  ◄── Sequence resets
    - Second session: SESS-T01-20260124-002

Multi-Terminal Support:
  Terminal T01: SESS-T01-20260123-001
  Terminal T02: SESS-T02-20260123-001  ◄── Independent sequences
  Terminal T03: SESS-T03-20260123-001
```

### Session-Terminal-User Relationship

```
┌──────────────┐         ┌──────────────┐         ┌──────────────┐
│   Terminal   │         │   Session    │         │     User     │
│              │         │              │         │   (Cashier)  │
│  code: T01   │◄────────│  terminal FK │         │              │
│  name: Main  │    1:N  │  user FK     ├────────►│ John Smith   │
│  Counter     │         │  status      │    N:1  │ Role: Cashier│
│              │         │  session_no  │         │              │
└──────────────┘         └──────────────┘         └──────────────┘
     │                         │                         │
     │                         │                         │
     └─────────────────┬───────┴─────────────────────────┘
                       │
                Multiple sessions per terminal over time
                Multiple sessions per user over time
                One active session per terminal at a time
```

### One Active Session Rule

**Business Rule:** Only one session can be OPEN per terminal at any given time.

| Scenario | Validation | Action |
|----------|------------|--------|
| Open new session on terminal with open session | Fail | Close existing session first |
| Open new session on terminal with closed session | Pass | Create new session |
| Suspend session | Pass | Can open new session or resume |
| Force close session | Pass | Can open new session |

### Expected Outcome
```python
# In apps/pos/terminal/models/pos_session.py

from django.db import models
from apps.core.models import BaseModel
from apps.pos.constants import SESSION_STATUS_CHOICES, SESSION_STATUS_OPEN
from .pos_terminal import POSTerminal

class POSSession(BaseModel):
    """
    Represents a cashier shift or work session on a POS terminal.
    Tracks transactions, cash handling, and provides audit trail.
    """
    
    terminal = models.ForeignKey(
        POSTerminal,
        on_delete=models.PROTECT,
        related_name='sessions'
    )
    user = models.ForeignKey(
        'auth.User',
        on_delete=models.PROTECT,
        related_name='pos_sessions'
    )
    status = models.CharField(
        max_length=20,
        choices=SESSION_STATUS_CHOICES,
        default=SESSION_STATUS_OPEN,
        db_index=True
    )
    session_number = models.CharField(max_length=50, unique=True)
    
    def __str__(self):
        return f"Session {self.session_number} on {self.terminal.name}"
```

### Verification Checklist
- [ ] `pos_session.py` file created in correct location
- [ ] POSSession class inherits from BaseModel
- [ ] Four basic fields defined (terminal, user, status, session_number)
- [ ] Terminal FK has PROTECT deletion behavior
- [ ] User FK has PROTECT deletion behavior
- [ ] Status field uses SESSION_STATUS_CHOICES with index
- [ ] session_number has unique constraint
- [ ] `__str__` method implemented
- [ ] Proper imports included

---

## Task 12: Add session timing fields

### Overview
Add fields to track when the session was opened, closed, and the duration. These timestamps are critical for shift management, payroll, and audit trails.

### Dependencies
- Task 11: Create POSSession model

### Instructions

1. **Add opened_at field**
   - `opened_at` field: DateTimeField with auto_now_add=True
   - Add help_text explaining automatic timestamp on session open
   - This field is automatically set when session is created

2. **Add closed_at field**
   - `closed_at` field: DateTimeField with null=True, blank=True
   - Add help_text explaining timestamp set on session close
   - Remains null until session is closed

3. **Add expected_close_time field (optional)**
   - `expected_close_time` field: DateTimeField with null=True, blank=True
   - Add help_text for planned shift end time
   - Used for shift scheduling and overtime tracking

4. **Add session duration property method**
   - Create `@property` decorated method `duration`
   - Calculate time difference between opened_at and closed_at
   - Return timedelta if closed, else return time since opening
   - Return None if not yet opened

### Session Timing Fields

| Field | Type | Auto-Set | Purpose |
|-------|------|----------|---------|
| **opened_at** | DateTimeField | Yes (creation) | Session start timestamp |
| **closed_at** | DateTimeField | No | Session end timestamp |
| **expected_close_time** | DateTimeField | No | Scheduled shift end |
| **duration** | Property | Calculated | Session length |

### Shift Duration Calculation

```
┌────────────────────────────────────────────────┐
│              Session Timeline                  │
├────────────────────────────────────────────────┤
│                                                │
│  opened_at              expected_close_time    │
│     ↓                          ↓               │
│     |──────────────────────────|               │
│  09:00 AM                   05:00 PM           │
│     |──────────────────────────|──────|        │
│                                        ↑        │
│                                   closed_at    │
│                                   06:30 PM     │
│                                                │
│  Planned Duration:   8 hours                   │
│  Actual Duration:    9.5 hours                 │
│  Overtime:           1.5 hours                 │
│                                                │
└────────────────────────────────────────────────┘
```

### Duration Calculation Examples

| Scenario | opened_at | closed_at | Duration | Status |
|----------|-----------|-----------|----------|--------|
| **Normal shift** | 09:00 AM | 05:00 PM | 8 hours | Closed |
| **Overtime** | 09:00 AM | 07:00 PM | 10 hours | Closed |
| **Short shift** | 09:00 AM | 02:00 PM | 5 hours | Closed |
| **Active session** | 09:00 AM | null | 2h 30m (so far) | Open |
| **Force closed** | 09:00 AM | 09:05 AM | 5 minutes | Force Closed |

### Timezone Considerations for Sri Lanka

```python
# All timestamps stored in UTC in database
# Display in Asia/Colombo timezone (UTC+5:30)

opened_at (UTC):     03:30:00
opened_at (Local):   09:00:00  ← Display to users

closed_at (UTC):     11:30:00
closed_at (Local):   05:00:00  ← Display to users
```

### Expected Outcome
```python
# In apps/pos/terminal/models/pos_session.py (add to POSSession)
from django.utils import timezone

opened_at = models.DateTimeField(auto_now_add=True)
closed_at = models.DateTimeField(null=True, blank=True)
expected_close_time = models.DateTimeField(null=True, blank=True)

@property
def duration(self):
    """Calculate session duration."""
    if self.closed_at:
        return self.closed_at - self.opened_at
    elif self.opened_at:
        return timezone.now() - self.opened_at
    return None

@property
def is_overtime(self):
    """Check if session exceeded expected close time."""
    if self.expected_close_time and self.closed_at:
        return self.closed_at > self.expected_close_time
    return False
```

### Shift Management Reports

| Report Type | Uses Timing Fields | Purpose |
|-------------|-------------------|---------|
| **Daily Shift Summary** | opened_at, closed_at | Track all shifts in a day |
| **Cashier Performance** | duration | Average shift length per cashier |
| **Overtime Report** | expected_close_time, closed_at | Calculate overtime hours |
| **Late Opening Report** | opened_at vs scheduled time | Punctuality tracking |
| **Active Sessions** | opened_at, closed_at=null | Currently open sessions |

### Verification Checklist
- [ ] opened_at field with auto_now_add=True
- [ ] closed_at field as optional datetime
- [ ] expected_close_time field for scheduling
- [ ] duration property method implemented
- [ ] is_overtime property method added
- [ ] timezone import added
- [ ] Fields properly handle null values

---

## Task 13: Add opening cash field

### Overview
Add a field to record the amount of cash in the cash drawer at the beginning of the session. This starting balance is essential for accurate cash reconciliation at session close.

### Dependencies
- Task 12: Add session timing fields

### Instructions

1. **Add opening_cash_amount field**
   - `opening_cash_amount` field: DecimalField with max_digits=15, decimal_places=2
   - Set default=Decimal('0.00')
   - Add help_text explaining cash drawer starting balance
   - Add validators: MinValueValidator(0)

2. **Add opening_cash_counted_by field**
   - `opening_cash_counted_by` field: ForeignKey to User model
   - Set on_delete=models.SET_NULL with null=True, blank=True
   - Set related_name='sessions_cash_opened'
   - Add help_text for who counted the opening cash

3. **Add opening_cash_counted_at field**
   - `opening_cash_counted_at` field: DateTimeField with null=True, blank=True
   - Add help_text for when opening cash was counted
   - Typically same as opened_at but can differ if pre-counted

4. **Add opening_cash_notes field**
   - `opening_cash_notes` field: TextField with blank=True, null=True
   - Add help_text for notes about opening cash (e.g., denominations, anomalies)

### Opening Cash Purpose

| Purpose | Description |
|---------|-------------|
| **Cash Float** | Starting cash for making change |
| **Reconciliation Base** | Starting point for cash variance calculation |
| **Audit Trail** | Who counted, when, and how much |
| **Loss Prevention** | Detect shortages from previous shift |

### Opening Cash Workflow

```
┌─────────────────────────────────────────────┐
│         Session Opening Process             │
├─────────────────────────────────────────────┤
│                                             │
│  1. Cashier arrives and logs in             │
│       ↓                                     │
│  2. Count cash drawer contents              │
│       ↓                                     │
│  3. Enter opening_cash_amount               │
│       ↓                                     │
│  4. Record counted_by (automatic)           │
│       ↓                                     │
│  5. Record counted_at timestamp             │
│       ↓                                     │
│  6. Add notes if any discrepancies          │
│       ↓                                     │
│  7. Session status set to OPEN              │
│       ↓                                     │
│  8. Terminal ready for transactions         │
│                                             │
└─────────────────────────────────────────────┘
```

### Typical Opening Cash Amounts by Business Type

| Business Type | Typical Amount | Currency Mix | Reason |
|---------------|----------------|--------------|---------|
| **Supermarket** | ₨ 10,000 - 20,000 | Mixed denominations | High change requirements |
| **Convenience Store** | ₨ 5,000 - 10,000 | Small bills + coins | Frequent small purchases |
| **Restaurant** | ₨ 5,000 - 15,000 | Mixed denominations | Varied transaction sizes |
| **Pharmacy** | ₨ 3,000 - 8,000 | Mixed denominations | Lower cash percentage |
| **Retail Store** | ₨ 8,000 - 15,000 | Mostly bills | Higher transaction amounts |

### Opening Cash Denomination Tracking (Optional)

While not implemented in basic model, businesses may want to track:

```
Opening Cash Breakdown:
  ₨ 5,000 notes  × 2  = ₨ 10,000
  ₨ 1,000 notes  × 5  = ₨  5,000
  ₨  500 notes   × 10 = ₨  5,000
  ₨  100 notes   × 20 = ₨  2,000
  ₨   50 coins   × 20 = ₨  1,000
  ₨   20 coins   × 50 = ₨  1,000
  ₨   10 coins   × 50 = ₨    500
  ₨    5 coins   × 60 = ₨    300
  ₨    2 coins   × 50 = ₨    100
  ₨    1 coins   × 100= ₨    100
  ─────────────────────────────
  Total               = ₨ 25,000
```

### Opening Cash Validation Rules

| Rule | Check | Action |
|------|-------|--------|
| **Minimum amount** | >= ₨ 0 | Reject negative values |
| **Maximum amount** | <= ₨ 100,000 (configurable) | Flag for approval |
| **Previous shortage** | Check last session variance | Warn cashier |
| **Standard float** | Compare to terminal's standard float | Highlight differences |
| **Counted by** | Must be recorded | Required field on open |

### Expected Outcome
```python
# In apps/pos/terminal/models/pos_session.py (add to POSSession)
from decimal import Decimal
from django.core.validators import MinValueValidator

opening_cash_amount = models.DecimalField(
    max_digits=15,
    decimal_places=2,
    default=Decimal('0.00'),
    validators=[MinValueValidator(0)]
)
opening_cash_counted_by = models.ForeignKey(
    'auth.User',
    on_delete=models.SET_NULL,
    null=True,
    blank=True,
    related_name='sessions_cash_opened'
)
opening_cash_counted_at = models.DateTimeField(null=True, blank=True)
opening_cash_notes = models.TextField(blank=True, null=True)
```

### Verification Checklist
- [ ] opening_cash_amount DecimalField with 15 digits, 2 decimals
- [ ] MinValueValidator(0) applied to prevent negative amounts
- [ ] opening_cash_counted_by FK to User model
- [ ] opening_cash_counted_at timestamp field
- [ ] opening_cash_notes for additional information
- [ ] Decimal import added
- [ ] All cash-related fields properly handle null values

---

## Task 14: Add closing cash fields

### Overview
Add fields to record the cash counted at session close, calculate expected vs actual cash, and track variance for reconciliation and audit purposes.

### Dependencies
- Task 13: Add opening cash field

### Instructions

1. **Add expected_cash_amount field (computed)**
   - `expected_cash_amount` field: DecimalField with max_digits=15, decimal_places=2
   - Set blank=True, null=True
   - Add help_text explaining calculated expected cash
   - Formula: opening_cash + cash_sales - cash_refunds

2. **Add actual_cash_amount field**
   - `actual_cash_amount` field: DecimalField with max_digits=15, decimal_places=2
   - Set blank=True, null=True
   - Add help_text for physically counted cash at close
   - Add validators: MinValueValidator(0)

3. **Add cash_variance field**
   - `cash_variance` field: DecimalField with max_digits=15, decimal_places=2
   - Set default=Decimal('0.00')
   - Add help_text explaining variance calculation
   - Formula: actual_cash - expected_cash
   - Positive = overage, Negative = shortage

4. **Add closing_cash_counted_by field**
   - `closing_cash_counted_by` field: ForeignKey to User model
   - Set on_delete=models.SET_NULL with null=True, blank=True
   - Set related_name='sessions_cash_closed'
   - Add help_text for who counted closing cash

5. **Add closing_cash_counted_at field**
   - `closing_cash_counted_at` field: DateTimeField with null=True, blank=True
   - Add help_text for when closing cash was counted

6. **Add closing_notes field**
   - `closing_notes` field: TextField with blank=True, null=True
   - Add help_text for variance explanations, issues, notes

7. **Add variance reason field**
   - `variance_reason` field: TextField with blank=True, null=True
   - Add help_text for explanation of cash variance
   - Required if variance exceeds threshold

### Cash Reconciliation Formula

```
Expected Cash Calculation:
──────────────────────────────────────────
  Opening Cash               ₨ 10,000.00
  + Cash Sales               ₨ 45,000.00
  - Cash Refunds             ₨  1,500.00
  - Drawer Payouts           ₨    500.00
  + Cash Drop Ins            ₨  5,000.00
  ────────────────────────────────────────
  Expected Cash              ₨ 58,000.00

Actual Count:
──────────────────────────────────────────
  Counted Cash               ₨ 57,950.00

Variance:
──────────────────────────────────────────
  Variance (Actual-Expected) ₨    -50.00
  Variance Type              Shortage
  Variance %                 -0.09%
```

### Variance Analysis

| Variance Type | Amount | Threshold | Action Required |
|---------------|--------|-----------|-----------------|
| **Perfect** | ₨ 0.00 | 0% | None |
| **Acceptable** | ±₨ 50.00 | <0.1% | Log only |
| **Warning** | ±₨ 500.00 | 0.1-1% | Require explanation |
| **Critical** | ±₨ 1,000.00 | >1% | Manager approval + investigation |
| **Severe** | ±₨ 5,000.00 | >5% | Incident report + possible action |

### Closing Cash Workflow

```
┌─────────────────────────────────────────────────┐
│          Session Closing Process                │
├─────────────────────────────────────────────────┤
│                                                 │
│  1. Cashier initiates session close             │
│       ↓                                         │
│  2. System calculates expected_cash             │
│       (opening + sales - refunds)               │
│       ↓                                         │
│  3. Cashier counts actual cash drawer           │
│       ↓                                         │
│  4. Enter actual_cash_amount                    │
│       ↓                                         │
│  5. System calculates variance                  │
│       ↓                                         │
│  6. IF variance > threshold                     │
│       ├─ Require variance_reason                │
│       ├─ Optional manager approval              │
│       └─ Generate variance report               │
│       ↓                                         │
│  7. Record counted_by & counted_at              │
│       ↓                                         │
│  8. Add closing_notes (optional)                │
│       ↓                                         │
│  9. Set status to CLOSED                        │
│       ↓                                         │
│  10. Generate session summary report            │
│                                                 │
└─────────────────────────────────────────────────┘
```

### Variance Reasons (Common Examples)

| Reason Category | Examples |
|----------------|----------|
| **Counting Error** | Miscounted bills, missed coin roll, double-counted |
| **Transaction Error** | Wrong change given, price entry mistake |
| **System Issue** | Transaction not recorded, duplicate entry |
| **Payment Method** | Customer paid cash but recorded as card |
| **Theft/Loss** | Missing cash, counterfeit bill accepted |
| **Denomination Error** | Gave ₨ 1000 instead of ₨ 100 note |
| **Multiple Cashiers** | Shift overlap, shared drawer |
| **Unrecorded Sale** | Sale made but not entered in system |

### Variance Tracking Over Time

```
Cashier Performance - 30 Day History:

Date         Opening    Expected   Actual     Variance   %
──────────────────────────────────────────────────────────
2026-01-01   10,000    58,000     58,000     0          0.00%
2026-01-02   10,000    62,000     62,050     +50        +0.08%
2026-01-03   10,000    55,000     54,950     -50        -0.09%
2026-01-04   10,000    60,000     59,800     -200       -0.33%
...
──────────────────────────────────────────────────────────
Total                               Avg: -₨15   -0.05%
```

### Expected Outcome
```python
# In apps/pos/terminal/models/pos_session.py (add to POSSession)

expected_cash_amount = models.DecimalField(
    max_digits=15,
    decimal_places=2,
    blank=True,
    null=True
)
actual_cash_amount = models.DecimalField(
    max_digits=15,
    decimal_places=2,
    blank=True,
    null=True,
    validators=[MinValueValidator(0)]
)
cash_variance = models.DecimalField(
    max_digits=15,
    decimal_places=2,
    default=Decimal('0.00')
)
closing_cash_counted_by = models.ForeignKey(
    'auth.User',
    on_delete=models.SET_NULL,
    null=True,
    blank=True,
    related_name='sessions_cash_closed'
)
closing_cash_counted_at = models.DateTimeField(null=True, blank=True)
closing_notes = models.TextField(blank=True, null=True)
variance_reason = models.TextField(blank=True, null=True)

@property
def variance_percentage(self):
    """Calculate variance as percentage of expected cash."""
    if self.expected_cash_amount and self.expected_cash_amount > 0:
        return (self.cash_variance / self.expected_cash_amount) * 100
    return Decimal('0.00')

@property
def is_variance_acceptable(self):
    """Check if variance is within acceptable threshold (0.1%)."""
    return abs(self.variance_percentage) <= Decimal('0.1')
```

### Verification Checklist
- [ ] expected_cash_amount DecimalField added
- [ ] actual_cash_amount DecimalField with MinValueValidator
- [ ] cash_variance DecimalField for difference tracking
- [ ] closing_cash_counted_by FK to User
- [ ] closing_cash_counted_at timestamp
- [ ] closing_notes and variance_reason text fields
- [ ] variance_percentage property method
- [ ] is_variance_acceptable property method
- [ ] All fields handle null values appropriately

---

## Task 15: Add session totals

### Overview
Add fields to track session-level transaction summaries including total sales, refunds, transaction counts, and payment method breakdowns. These aggregated totals provide quick session performance insights.

### Dependencies
- Task 14: Add closing cash fields

### Instructions

1. **Add total sales amount field**
   - `total_sales_amount` field: DecimalField with max_digits=15, decimal_places=2
   - Set default=Decimal('0.00')
   - Add help_text for total sales value during session
   - Add validators: MinValueValidator(0)

2. **Add total refunds amount field**
   - `total_refunds_amount` field: DecimalField with max_digits=15, decimal_places=2
   - Set default=Decimal('0.00')
   - Add help_text for total refunds value during session
   - Add validators: MinValueValidator(0)

3. **Add net sales amount field**
   - `net_sales_amount` field: DecimalField with max_digits=15, decimal_places=2
   - Set default=Decimal('0.00')
   - Add help_text explaining net sales calculation
   - Formula: total_sales - total_refunds

4. **Add transaction count field**
   - `transaction_count` field: PositiveIntegerField with default=0
   - Add help_text for number of transactions during session

5. **Add refund count field**
   - `refund_count` field: PositiveIntegerField with default=0
   - Add help_text for number of refund transactions

6. **Add cash sales amount field**
   - `cash_sales_amount` field: DecimalField with max_digits=15, decimal_places=2
   - Set default=Decimal('0.00')
   - Add help_text for sales paid with cash
   - Add validators: MinValueValidator(0)

7. **Add card sales amount field**
   - `card_sales_amount` field: DecimalField with max_digits=15, decimal_places=2
   - Set default=Decimal('0.00')
   - Add help_text for sales paid with card
   - Add validators: MinValueValidator(0)

8. **Add other payment amount field**
   - `other_payment_amount` field: DecimalField with max_digits=15, decimal_places=2
   - Set default=Decimal('0.00')
   - Add help_text for other payment methods (mobile, wallet, etc.)
   - Add validators: MinValueValidator(0)

9. **Add average transaction value property**
   - Create `@property` method `average_transaction_value`
   - Calculate total_sales / transaction_count
   - Return Decimal('0.00') if transaction_count is 0

10. **Add items sold count field**
    - `items_sold_count` field: PositiveIntegerField with default=0
    - Add help_text for total items sold (line item quantity sum)

### Session Totals Summary

| Field | Type | Purpose | Updates |
|-------|------|---------|---------|
| **total_sales_amount** | Decimal | Gross sales | After each sale |
| **total_refunds_amount** | Decimal | Total refunds | After each refund |
| **net_sales_amount** | Decimal | Net revenue | Calculated |
| **transaction_count** | Integer | Number of transactions | After each transaction |
| **refund_count** | Integer | Number of refunds | After each refund |
| **cash_sales_amount** | Decimal | Cash payments | After cash sale |
| **card_sales_amount** | Decimal | Card payments | After card sale |
| **other_payment_amount** | Decimal | Other payments | After other payment |
| **items_sold_count** | Integer | Total items | Sum of quantities |

### Session Summary Report Example

```
┌─────────────────────────────────────────────────┐
│          POS SESSION SUMMARY REPORT             │
├─────────────────────────────────────────────────┤
│  Session: SESS-T01-20260123-001                 │
│  Terminal: T01 - Main Counter                   │
│  Cashier: John Smith                            │
│  Opened: 2026-01-23 09:00:00                    │
│  Closed: 2026-01-23 17:30:00                    │
│  Duration: 8h 30m                               │
├─────────────────────────────────────────────────┤
│  SALES SUMMARY                                  │
│  ─────────────────────────────────────────────  │
│  Total Sales:              ₨ 125,000.00         │
│  Total Refunds:            ₨   2,500.00         │
│  Net Sales:                ₨ 122,500.00         │
│                                                 │
│  Transactions:             85                   │
│  Refund Transactions:      3                    │
│  Items Sold:               234                  │
│  Avg Transaction Value:    ₨  1,441.18          │
├─────────────────────────────────────────────────┤
│  PAYMENT BREAKDOWN                              │
│  ─────────────────────────────────────────────  │
│  Cash:                     ₨  65,000.00  52.0%  │
│  Card:                     ₨  55,000.00  44.0%  │
│  Other (Mobile/Wallet):    ₨   5,000.00   4.0%  │
│  Total:                    ₨ 125,000.00 100.0%  │
├─────────────────────────────────────────────────┤
│  CASH RECONCILIATION                            │
│  ─────────────────────────────────────────────  │
│  Opening Cash:             ₨  10,000.00         │
│  Cash Sales:               ₨  65,000.00         │
│  Cash Refunds:             ₨   1,000.00         │
│  Expected Cash:            ₨  74,000.00         │
│  Actual Cash:              ₨  73,950.00         │
│  Variance:                 ₨     -50.00 (0.07%) │
│  Status:                   ✓ Acceptable         │
└─────────────────────────────────────────────────┘
```

### Payment Method Distribution Analysis

```
Payment Mix Chart:
────────────────────────────────────────────
Cash        ████████████████████████ 52.0%
Card        ███████████████████ 44.0%
Other       ██ 4.0%
────────────────────────────────────────────
            0%    25%    50%    75%   100%
```

### Session Performance Metrics

| Metric | Formula | Interpretation |
|--------|---------|----------------|
| **Average Transaction Value** | total_sales / transaction_count | Customer spending level |
| **Items Per Transaction** | items_sold / transaction_count | Basket size |
| **Refund Rate** | (refund_count / transaction_count) × 100 | Customer satisfaction indicator |
| **Cash Preference** | (cash_sales / total_sales) × 100 | Payment method preference |
| **Hourly Sales** | total_sales / session_hours | Productivity metric |
| **Variance Rate** | (variance / expected_cash) × 100 | Cash handling accuracy |

### Real-Time Total Updates

Session totals are updated in real-time as transactions occur:

```
Transaction Flow:
─────────────────────────────────────────────────
1. Sale completed (₨ 1,500, paid cash)
   ├─ total_sales_amount += 1500
   ├─ cash_sales_amount += 1500
   ├─ transaction_count += 1
   └─ items_sold_count += 3 (if 3 items in cart)

2. Refund processed (₨ 500, cash refund)
   ├─ total_refunds_amount += 500
   ├─ refund_count += 1
   └─ net_sales_amount recalculated

3. Session close triggered
   ├─ expected_cash = opening + cash_sales - cash_refunds
   ├─ variance = actual - expected
   └─ Session locked for modifications
```

### Expected Outcome
```python
# In apps/pos/terminal/models/pos_session.py (add to POSSession)

total_sales_amount = models.DecimalField(
    max_digits=15,
    decimal_places=2,
    default=Decimal('0.00'),
    validators=[MinValueValidator(0)]
)
total_refunds_amount = models.DecimalField(
    max_digits=15,
    decimal_places=2,
    default=Decimal('0.00'),
    validators=[MinValueValidator(0)]
)
net_sales_amount = models.DecimalField(
    max_digits=15,
    decimal_places=2,
    default=Decimal('0.00')
)
transaction_count = models.PositiveIntegerField(default=0)
refund_count = models.PositiveIntegerField(default=0)
cash_sales_amount = models.DecimalField(
    max_digits=15,
    decimal_places=2,
    default=Decimal('0.00'),
    validators=[MinValueValidator(0)]
)
card_sales_amount = models.DecimalField(
    max_digits=15,
    decimal_places=2,
    default=Decimal('0.00'),
    validators=[MinValueValidator(0)]
)
other_payment_amount = models.DecimalField(
    max_digits=15,
    decimal_places=2,
    default=Decimal('0.00'),
    validators=[MinValueValidator(0)]
)
items_sold_count = models.PositiveIntegerField(default=0)

@property
def average_transaction_value(self):
    """Calculate average value per transaction."""
    if self.transaction_count > 0:
        return self.total_sales_amount / self.transaction_count
    return Decimal('0.00')

@property
def items_per_transaction(self):
    """Calculate average items per transaction."""
    if self.transaction_count > 0:
        return self.items_sold_count / self.transaction_count
    return 0

@property
def refund_rate(self):
    """Calculate refund rate as percentage."""
    if self.transaction_count > 0:
        return (self.refund_count / self.transaction_count) * 100
    return Decimal('0.00')
```

### Verification Checklist
- [ ] Ten session total fields added
- [ ] All amount fields use DecimalField(15, 2)
- [ ] MinValueValidator(0) applied to amount fields
- [ ] Default values set to 0 or Decimal('0.00')
- [ ] transaction_count and items_sold_count are PositiveIntegers
- [ ] average_transaction_value property implemented
- [ ] items_per_transaction property implemented
- [ ] refund_rate property implemented
- [ ] All calculated properties handle division by zero

---

## Summary

### Tasks Completed in This Document
| Task # | Task Name | Key Deliverable |
|--------|-----------|-----------------|
| 11 | Create POSSession model | Basic session model with terminal and user links |
| 12 | Add session timing fields | opened_at, closed_at, duration tracking |
| 13 | Add opening cash field | Opening cash amount and counting details |
| 14 | Add closing cash fields | Closing cash, variance calculation, reconciliation |
| 15 | Add session totals | Sales totals, payment breakdowns, transaction counts |

### POSSession Model Complete Field Count

| Category | Fields | Count |
|----------|--------|-------|
| **Identification** | terminal, user, status, session_number | 4 |
| **Timing** | opened_at, closed_at, expected_close_time | 3 |
| **Opening Cash** | opening_cash_amount, opening_cash_counted_by, opening_cash_counted_at, opening_cash_notes | 4 |
| **Closing Cash** | expected_cash, actual_cash, cash_variance, closing_counted_by, closing_counted_at, closing_notes, variance_reason | 7 |
| **Sales Totals** | total_sales, total_refunds, net_sales, transaction_count, refund_count, items_sold_count | 6 |
| **Payment Breakdown** | cash_sales, card_sales, other_payment | 3 |
| **From BaseModel** | id, tenant, created_at, updated_at, created_by, updated_by | 6 |
| **Properties** | duration, variance_percentage, average_transaction_value, etc. | ~8 |
| **Total Fields** | | **33 fields** |

### Next Steps
Proceed to [04_Tasks-16-18_Session-Methods-Admin.md](04_Tasks-16-18_Session-Methods-Admin.md) to add:
- open_session() method with validations
- close_session() method with reconciliation
- Admin interface for terminal and session management

---

## Notes for AI Agents

1. **Cash Reconciliation:** The variance calculation is critical for loss prevention and cashier accountability
2. **Payment Breakdown:** Ensures totals match when cash + card + other = total_sales
3. **Real-Time Updates:** Session totals are updated incrementally as transactions occur
4. **Decimal Precision:** Always use Decimal type for currency to avoid floating-point errors
5. **Property Methods:** Calculated properties (duration, variance_percentage, etc.) are not stored in DB
6. **Timezone Handling:** All timestamps stored in UTC, displayed in Asia/Colombo timezone
7. **Audit Trail:** counted_by and counted_at fields provide accountability for cash handling
8. **Variance Threshold:** Configurable thresholds determine when manager approval is required
9. **Session Locking:** Once closed, session fields should become read-only to preserve audit trail
