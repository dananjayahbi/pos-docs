# Tasks 22-27: Service & Aging

> **Phase:** 05 - ERP Core Modules Part 2  
> **SubPhase:** 09 - Customer Credit & Loyalty  
> **Group:** B - Credit Transactions & Aging  
> **Tasks:** 22-27 of 90  
> **Complexity:** Medium to High  
> **Estimated Time:** 2 hours 35 minutes

---

## Navigation

- **↑ Parent:** [Group B Overview](./00_GROUP_OVERVIEW.md)
- **← Previous Document:** [Tasks 17-21: Transaction Model](./01_Tasks-17-21_Transaction-Model.md)
- **→ Next Document:** [Tasks 28-32: Statements, Reminders & Suspension](./03_Tasks-28-32_Statements-Reminders-Suspension.md)

---

## Table of Contents

1. [Overview](#overview)
2. [Task 22: Create CreditService Class](#task-22-create-creditservice-class)
3. [Task 23: Implement Credit Purchase](#task-23-implement-credit-purchase)
4. [Task 24: Implement Credit Payment](#task-24-implement-credit-payment)
5. [Task 25: Implement Credit Limit Check](#task-25-implement-credit-limit-check)
6. [Task 26: Implement Credit Balance Calculator](#task-26-implement-credit-balance-calculator)
7. [Task 27: Create Aging Buckets Calculator](#task-27-create-aging-buckets-calculator)
8. [Validation Checklist](#validation-checklist)
9. [Service Layer Architecture](#service-layer-architecture)

---

## Overview

### Purpose

This document covers the creation of the `CreditService` class that encapsulates all business logic for credit operations, including purchases, payments, balance calculations, and aging analysis.

### Key Deliverables

```
apps/credit/
├── services/
│   ├── __init__.py
│   └── credit_service.py          # Tasks 22-27
└── tests/
    └── test_credit_service.py     # Test cases
```

### Prerequisites

- CreditTransaction model complete
- CustomerCredit model complete
- Understanding of credit business rules
- Familiarity with service layer pattern

### Technology Stack

- **Service Layer:** Business logic separation
- **Django ORM:** Database queries
- **Transactions:** Atomic operations
- **Decimal:** Precise calculations

---

## Task 22: Create CreditService Class

**Complexity:** High  
**Estimated Time:** 30 minutes

### Objective

Create the main `CreditService` class that will handle all credit-related business operations, ensuring data consistency and enforcing business rules.

### Instructions

#### Step 1: Create Service Directory

Create `apps/credit/services/` directory with `__init__.py`.

#### Step 2: Create Service File

Create `apps/credit/services/credit_service.py`.

#### Step 3: Define CreditService Class

Create main service class structure:

**Class Attributes:**
- Class-level configuration if needed
- Constants for business rules

**Instance Initialization:**
- Accept `credit_account` in `__init__`
- Store reference to CustomerCredit instance
- Initialize any caching if needed

#### Step 4: Add Transaction Number Generator

**Method: `generate_transaction_number()`**

Logic:
1. Get current year
2. Query for highest sequence number this year
3. Increment sequence
4. Format as: `CT-{YEAR}-{SEQUENCE:05d}`
5. Return transaction number

**Example Output:**
- CT-2026-00001
- CT-2026-00002
- CT-2026-01234

#### Step 5: Add Validation Helper Methods

**Method: `_validate_amount(amount)`**
- Ensure amount > 0
- Ensure amount is Decimal type
- Raise ValueError if invalid

**Method: `_validate_credit_account()`**
- Ensure account exists
- Ensure account is ACTIVE
- Raise exception if suspended/closed

**Method: `_get_current_user()`**
- Get current user from request context
- Return User instance or None

#### Step 6: Add Database Transaction Wrapper

**Method: `_execute_in_transaction(func)`**
- Decorator for atomic database operations
- Ensures data consistency
- Rollback on errors

#### Step 7: Add Export to Init

Update `apps/credit/services/__init__.py` to export `CreditService`.

### Service Class Structure

```
┌──────────────────────────────────────────────────────────────┐
│  CreditService Class Architecture                            │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  CreditService                                               │
│  ├─ __init__(credit_account)                                 │
│  │                                                           │
│  ├─ Transaction Management:                                  │
│  │  ├─ generate_transaction_number()                         │
│  │  ├─ record_purchase()                [Task 23]            │
│  │  ├─ record_payment()                 [Task 24]            │
│  │  └─ record_adjustment()                                   │
│  │                                                           │
│  ├─ Balance Operations:                                      │
│  │  ├─ calculate_balance()              [Task 26]            │
│  │  ├─ check_credit_limit()             [Task 25]            │
│  │  └─ update_credit_account()                               │
│  │                                                           │
│  ├─ Aging & Analysis:                                        │
│  │  ├─ calculate_aging_buckets()        [Task 27]            │
│  │  ├─ get_overdue_amount()                                  │
│  │  └─ get_statement()                  [Next doc]           │
│  │                                                           │
│  ├─ Validation Helpers:                                      │
│  │  ├─ _validate_amount()                                    │
│  │  ├─ _validate_credit_account()                            │
│  │  └─ _get_current_user()                                   │
│  │                                                           │
│  └─ Utility Methods:                                         │
│     ├─ _execute_in_transaction()                             │
│     └─ _apply_payment_to_invoices()                          │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

### Important Design Principles

**Single Responsibility:**
- CreditService handles only credit operations
- Separate services for loyalty, inventory, etc.

**Transaction Safety:**
- All state-changing operations atomic
- Use `@transaction.atomic` decorator
- Rollback on any error

**Validation First:**
- Validate all inputs before processing
- Fail fast with clear error messages
- Don't assume data is valid

**Logging:**
- Log all credit operations
- Include user, amount, result
- Aid in auditing and debugging

### Validation

- [ ] Service directory created
- [ ] `credit_service.py` file created
- [ ] CreditService class defined
- [ ] Constructor accepts credit_account
- [ ] Transaction number generator implemented
- [ ] Validation helper methods created
- [ ] Service exported in `__init__.py`

---

## Task 23: Implement Credit Purchase

**Complexity:** Medium  
**Estimated Time:** 25 minutes

### Objective

Implement the `record_purchase()` method that records a purchase made on credit, creates a transaction, and updates the credit account.

### Instructions

#### Step 1: Define Method Signature

**Method: `record_purchase(amount, reference_type, reference_id, notes='')`**

**Parameters:**
- `amount`: Decimal - Purchase amount
- `reference_type`: str - Type of document (Order, Invoice)
- `reference_id`: UUID - ID of reference document
- `notes`: str - Additional notes

**Returns:**
- CreditTransaction instance if successful
- Raises exception on error

#### Step 2: Implement Validation

Validate:
1. Amount is positive Decimal
2. Credit account is ACTIVE
3. Sufficient available credit
4. Reference information provided

#### Step 3: Calculate Due Date

Calculate due date:
- Get payment_terms_days from credit account
- due_date = today + payment_terms_days
- Consider business days if needed

#### Step 4: Create Transaction

Create CreditTransaction:
- Generate transaction_number
- Set transaction_type = CREDIT_PURCHASE
- Set amount
- Calculate balance_after = current_balance + amount
- Set transaction_date = now
- Set due_date
- Set reference fields
- Set processed_by = current user

#### Step 5: Update Credit Account

Update CustomerCredit:
- outstanding_balance += amount
- available_credit -= amount
- last_purchase_date = today
- Recalculate utilization

#### Step 6: Log Operation

Log the purchase:
- Log level: INFO
- Include customer, amount, new balance
- Include transaction number

#### Step 7: Return Transaction

Return created transaction instance.

### Purchase Flow Diagram

```
┌──────────────────────────────────────────────────────────────┐
│  Credit Purchase Process                                     │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  Input:                                                      │
│  • amount: Rs. 15,000                                        │
│  • reference_type: "Order"                                   │
│  • reference_id: order_uuid                                  │
│                                                              │
│  ┌────────────────────────────────────────┐                  │
│  │ 1. Validate Input                      │                  │
│  │    ✓ amount > 0                        │                  │
│  │    ✓ credit account ACTIVE             │                  │
│  │    ✓ available_credit >= amount        │                  │
│  └────────────────────────────────────────┘                  │
│                    │                                         │
│                    ▼                                         │
│  ┌────────────────────────────────────────┐                  │
│  │ 2. Calculate Dates                     │                  │
│  │    transaction_date = now              │                  │
│  │    due_date = today + 30 days          │                  │
│  └────────────────────────────────────────┘                  │
│                    │                                         │
│                    ▼                                         │
│  ┌────────────────────────────────────────┐                  │
│  │ 3. Begin Database Transaction          │                  │
│  │    START ATOMIC                        │                  │
│  └────────────────────────────────────────┘                  │
│                    │                                         │
│                    ▼                                         │
│  ┌────────────────────────────────────────┐                  │
│  │ 4. Create CreditTransaction            │                  │
│  │    • CT-2026-00045                     │                  │
│  │    • Type: CREDIT_PURCHASE             │                  │
│  │    • Amount: Rs. 15,000                │                  │
│  │    • Balance After: Rs. 35,000         │                  │
│  │    • Due: 2026-02-24                   │                  │
│  └────────────────────────────────────────┘                  │
│                    │                                         │
│                    ▼                                         │
│  ┌────────────────────────────────────────┐                  │
│  │ 5. Update CustomerCredit               │                  │
│  │    • outstanding += Rs. 15,000         │                  │
│  │    • available -= Rs. 15,000           │                  │
│  │    • last_purchase_date = today        │                  │
│  │                                        │                  │
│  │    Before: Balance Rs. 20,000          │                  │
│  │            Available Rs. 80,000        │                  │
│  │    After:  Balance Rs. 35,000          │                  │
│  │            Available Rs. 65,000        │                  │
│  └────────────────────────────────────────┘                  │
│                    │                                         │
│                    ▼                                         │
│  ┌────────────────────────────────────────┐                  │
│  │ 6. COMMIT Transaction                  │                  │
│  └────────────────────────────────────────┘                  │
│                    │                                         │
│                    ▼                                         │
│  ┌────────────────────────────────────────┐                  │
│  │ 7. Log Operation                       │                  │
│  │    INFO: Purchase Rs. 15,000           │                  │
│  │          for Customer X                │                  │
│  │          Transaction CT-2026-00045     │                  │
│  └────────────────────────────────────────┘                  │
│                    │                                         │
│                    ▼                                         │
│             Return Transaction                               │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

### Error Handling

**Insufficient Credit:**
```
If available_credit < amount:
    Raise InsufficientCreditError(
        f"Insufficient credit. Available: {available_credit}, 
         Required: {amount}"
    )
```

**Account Suspended:**
```
If credit_account.status == CreditStatus.SUSPENDED:
    Raise CreditAccountSuspendedError(
        f"Credit account is suspended. 
         Reason: {credit_account.suspended_reason}"
    )
```

### Validation

- [ ] Method signature defined
- [ ] Input validation implemented
- [ ] Due date calculation works
- [ ] Transaction creation works
- [ ] Credit account update works
- [ ] Atomic transaction wrapper used
- [ ] Logging implemented
- [ ] Error handling for edge cases

---

## Task 24: Implement Credit Payment

**Complexity:** Medium  
**Estimated Time:** 25 minutes

### Objective

Implement the `record_payment()` method that records a payment received from a customer, applies it to outstanding invoices, and updates the credit account.

### Instructions

#### Step 1: Define Method Signature

**Method: `record_payment(amount, payment_method, payment_reference='', notes='')`**

**Parameters:**
- `amount`: Decimal - Payment amount
- `payment_method`: str - CASH, BANK_TRANSFER, CHEQUE, etc.
- `payment_reference`: str - Cheque number, transaction ID
- `notes`: str - Additional notes

**Returns:**
- CreditTransaction instance

#### Step 2: Implement Validation

Validate:
1. Amount is positive Decimal
2. Amount <= outstanding_balance (can't overpay)
3. Payment method is valid
4. Credit account exists

#### Step 3: Create Payment Transaction

Create CreditTransaction:
- Generate transaction_number
- Set transaction_type = PAYMENT
- Set amount (positive value)
- Calculate balance_after = current_balance - amount
- Set transaction_date = now
- Set paid_date = today
- Set payment_method
- Set payment_reference
- Set processed_by

#### Step 4: Update Credit Account

Update CustomerCredit:
- outstanding_balance -= amount
- available_credit += amount
- last_payment_date = today
- Increment total_payments_made
- Recalculate on_time_payment_percentage

#### Step 5: Apply Payment to Invoices (FIFO)

Apply payment to oldest unpaid transactions:
1. Get unpaid CREDIT_PURCHASE transactions ordered by due_date
2. Apply payment starting from oldest
3. Mark transactions as paid when fully covered
4. Track partial payments

#### Step 6: Check for Risk Score Improvement

After payment:
- Recalculate risk score
- If improved significantly, consider unsuspending
- Update risk assessment date

#### Step 7: Log and Return

Log payment and return transaction.

### Payment Application Flow

```
┌──────────────────────────────────────────────────────────────┐
│  Payment Application (FIFO Method)                           │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  Outstanding Invoices:                                       │
│  ┌─────────────────────────────────────────────────┐         │
│  │ Invoice 1  │ Rs. 10,000 │ Due: 2026-01-15       │         │
│  │ Invoice 2  │ Rs. 15,000 │ Due: 2026-01-20       │         │
│  │ Invoice 3  │ Rs.  8,000 │ Due: 2026-01-25       │         │
│  └─────────────────────────────────────────────────┘         │
│                                                              │
│  Total Outstanding: Rs. 33,000                               │
│                                                              │
│  Payment Received: Rs. 20,000                                │
│                                                              │
│  Application Process:                                        │
│  ┌────────────────────────────────────────┐                  │
│  │ Step 1: Apply to Invoice 1             │                  │
│  │         Amount: Rs. 10,000             │                  │
│  │         Remaining: Rs. 10,000          │                  │
│  │         Invoice 1: PAID ✓              │                  │
│  └────────────────────────────────────────┘                  │
│                    │                                         │
│                    ▼                                         │
│  ┌────────────────────────────────────────┐                  │
│  │ Step 2: Apply to Invoice 2             │                  │
│  │         Amount: Rs. 10,000             │                  │
│  │         Remaining: Rs. 0               │                  │
│  │         Invoice 2: PARTIAL (Rs. 5K)    │                  │
│  └────────────────────────────────────────┘                  │
│                    │                                         │
│                    ▼                                         │
│  ┌────────────────────────────────────────┐                  │
│  │ Step 3: Stop (Payment Exhausted)       │                  │
│  │         Invoice 3: UNPAID              │                  │
│  └────────────────────────────────────────┘                  │
│                                                              │
│  Result:                                                     │
│  • Total Paid: Rs. 20,000                                    │
│  • Outstanding: Rs. 13,000                                   │
│  • Invoices Cleared: 1                                       │
│  • Invoices Partial: 1                                       │
│  • Invoices Unpaid: 1                                        │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

### Payment Timing Analysis

```
Update on_time_payment_percentage:

on_time_count = payments made before (due_date + grace_period)
total_count = all payments made

on_time_percentage = (on_time_count / total_count) × 100

Example:
• Total payments: 20
• On-time: 18
• Percentage: 90%

This affects:
• Risk score (positively)
• Future credit limit increases
• Auto-approval eligibility
```

### Validation

- [ ] Method signature defined
- [ ] Input validation works
- [ ] Payment transaction created
- [ ] Credit account updated
- [ ] Payment applied to invoices (FIFO)
- [ ] Risk score recalculated
- [ ] Logging implemented

---

## Task 25: Implement Credit Limit Check

**Complexity:** Medium  
**Estimated Time:** 20 minutes

### Objective

Implement the `check_credit_limit()` method that validates whether a purchase amount can be accommodated within the available credit.

### Instructions

#### Step 1: Define Method Signature

**Method: `check_credit_limit(amount)`**

**Parameters:**
- `amount`: Decimal - Proposed purchase amount

**Returns:**
- Dictionary with check results

#### Step 2: Gather Credit Information

Collect:
- Current credit_limit
- Current outstanding_balance
- Current available_credit
- Credit utilization percentage
- Credit account status

#### Step 3: Perform Checks

**Check 1: Account Status**
- Is account ACTIVE?
- Is account not SUSPENDED?

**Check 2: Sufficient Credit**
- Is available_credit >= amount?

**Check 3: Utilization Threshold**
- Will utilization exceed safe threshold (e.g., 90%)?

**Check 4: Risk Assessment**
- Is risk score acceptable?
- Any recent late payments?

#### Step 4: Build Response Dictionary

Return structure:
```python
{
    'approved': bool,
    'available_credit': Decimal,
    'required_amount': Decimal,
    'shortage': Decimal (if any),
    'utilization_after': Decimal,
    'warnings': List[str],
    'errors': List[str]
}
```

#### Step 5: Add Warning Logic

Warnings for:
- Utilization will exceed 80%
- Close to credit limit
- Recent late payment
- Risk score elevated

#### Step 6: Create Helper Property

Add property to CustomerCredit model:
**can_purchase(amount):**
- Quick boolean check
- Returns True if purchase allowed

### Credit Limit Check Flow

```
┌──────────────────────────────────────────────────────────────┐
│  Credit Limit Check Process                                  │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  Input: Requested Amount = Rs. 25,000                        │
│                                                              │
│  Current State:                                              │
│  • Credit Limit: Rs. 100,000                                 │
│  • Outstanding: Rs. 60,000                                   │
│  • Available: Rs. 40,000                                     │
│  • Utilization: 60%                                          │
│  • Status: ACTIVE                                            │
│  • Risk Score: 45 (Medium)                                   │
│                                                              │
│  ┌────────────────────────────────────────┐                  │
│  │ Check 1: Account Status                │                  │
│  │   ✓ Status is ACTIVE                   │                  │
│  │   ✓ Not SUSPENDED                      │                  │
│  └────────────────────────────────────────┘                  │
│                    │                                         │
│                    ▼                                         │
│  ┌────────────────────────────────────────┐                  │
│  │ Check 2: Available Credit              │                  │
│  │   Available: Rs. 40,000                │                  │
│  │   Required:  Rs. 25,000                │                  │
│  │   ✓ Sufficient (Rs. 15,000 margin)     │                  │
│  └────────────────────────────────────────┘                  │
│                    │                                         │
│                    ▼                                         │
│  ┌────────────────────────────────────────┐                  │
│  │ Check 3: Utilization After             │                  │
│  │   Current: 60%                         │                  │
│  │   After: 85% (60K + 25K = 85K)         │                  │
│  │   ⚠ Warning: High utilization (>80%)   │                  │
│  └────────────────────────────────────────┘                  │
│                    │                                         │
│                    ▼                                         │
│  ┌────────────────────────────────────────┐                  │
│  │ Check 4: Risk Assessment               │                  │
│  │   Risk Score: 45 (Medium)              │                  │
│  │   ✓ Acceptable                         │                  │
│  └────────────────────────────────────────┘                  │
│                    │                                         │
│                    ▼                                         │
│  ┌────────────────────────────────────────┐                  │
│  │ Result: APPROVED with WARNING          │                  │
│  │                                        │                  │
│  │ {                                      │                  │
│  │   'approved': True,                    │                  │
│  │   'available_credit': 40000,           │                  │
│  │   'required_amount': 25000,            │                  │
│  │   'shortage': 0,                       │                  │
│  │   'utilization_after': 85.0,           │                  │
│  │   'warnings': [                        │                  │
│  │     'Utilization will exceed 80%'      │                  │
│  │   ],                                   │                  │
│  │   'errors': []                         │                  │
│  │ }                                      │                  │
│  └────────────────────────────────────────┘                  │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

### Validation

- [ ] Method defined
- [ ] All checks implemented
- [ ] Response dictionary structure correct
- [ ] Warning logic works
- [ ] Error handling for edge cases

---

## Task 26: Implement Credit Balance Calculator

**Complexity:** Medium  
**Estimated Time:** 25 minutes

### Objective

Implement the `calculate_balance()` method that accurately calculates the outstanding balance from all transactions, ensuring data consistency.

### Instructions

#### Step 1: Define Method Signature

**Method: `calculate_balance(as_of_date=None)`**

**Parameters:**
- `as_of_date`: Date - Calculate balance as of this date (optional)

**Returns:**
- Dictionary with balance details

#### Step 2: Query Transactions

Get all transactions for the credit account:
- Filter by credit_account
- If as_of_date provided, filter `transaction_date <= as_of_date`
- Exclude REVERSED transactions
- Order by transaction_date

#### Step 3: Calculate Balance

Iterate through transactions:
- Start with opening_balance = 0
- For each transaction:
  - If increases balance: add amount
  - If decreases balance: subtract amount
  - Track running balance

#### Step 4: Breakdown by Type

Calculate totals by transaction type:
- Total purchases
- Total payments
- Total interest
- Total adjustments
- Total write-offs

#### Step 5: Verify Against Stored Balance

Compare calculated balance with `outstanding_balance` field:
- If match: data consistent
- If mismatch: flag for reconciliation

#### Step 6: Return Detailed Response

```python
{
    'calculated_balance': Decimal,
    'stored_balance': Decimal,
    'is_consistent': bool,
    'discrepancy': Decimal,
    'total_purchases': Decimal,
    'total_payments': Decimal,
    'total_interest': Decimal,
    'total_adjustments': Decimal,
    'transaction_count': int,
    'last_transaction_date': datetime
}
```

### Balance Calculation Example

```
┌──────────────────────────────────────────────────────────────┐
│  Balance Calculation Timeline                                │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  Opening Balance: Rs. 0                                      │
│                                                              │
│  Transaction History:                                        │
│  ┌──────────────────────────────────────────────────────┐    │
│  │ Date       │ Type         │ Amount      │ Balance    │    │
│  ├──────────────────────────────────────────────────────┤    │
│  │ 2026-01-05 │ PURCHASE     │ +10,000     │ 10,000     │    │
│  │ 2026-01-10 │ PURCHASE     │ +15,000     │ 25,000     │    │
│  │ 2026-01-15 │ PAYMENT      │ -8,000      │ 17,000     │    │
│  │ 2026-01-20 │ PURCHASE     │ +12,000     │ 29,000     │    │
│  │ 2026-01-25 │ PAYMENT      │ -10,000     │ 19,000     │    │
│  │ 2026-01-31 │ INTEREST     │ +500        │ 19,500     │    │
│  └──────────────────────────────────────────────────────┘    │
│                                                              │
│  Calculated Balance: Rs. 19,500                              │
│  Stored Balance:     Rs. 19,500                              │
│  Status: ✓ CONSISTENT                                        │
│                                                              │
│  Breakdown:                                                  │
│  • Total Purchases:  Rs. 37,000                              │
│  • Total Payments:   Rs. 18,000                              │
│  • Total Interest:   Rs. 500                                 │
│  • Net Balance:      Rs. 19,500                              │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

### Reconciliation Process

```
If calculated_balance != stored_balance:
    
    1. Log discrepancy with details
    2. Investigate cause:
       - Missing transactions?
       - Incorrect reversal?
       - Data corruption?
    
    3. Options:
       a) Trust transactions → Update stored_balance
       b) Trust stored → Investigate transactions
       c) Manual review required
    
    4. Create reconciliation report
    5. Notify admin if discrepancy > threshold
```

### Validation

- [ ] Method defined
- [ ] Transaction querying works
- [ ] Balance calculation correct
- [ ] Breakdown by type works
- [ ] Consistency check implemented
- [ ] Response structure complete

---

## Task 27: Create Aging Buckets Calculator

**Complexity:** High  
**Estimated Time:** 30 minutes

### Objective

Implement the `calculate_aging_buckets()` method that categorizes outstanding balance by how many days overdue, providing critical information for credit management.

### Instructions

#### Step 1: Define Method Signature

**Method: `calculate_aging_buckets(as_of_date=None)`**

**Parameters:**
- `as_of_date`: Date - Calculate aging as of this date (defaults to today)

**Returns:**
- Dictionary with aging breakdown

#### Step 2: Define Aging Buckets

Standard buckets:
- **Current:** Not yet due (0 days)
- **1-30 Days:** 1-30 days overdue
- **31-60 Days:** 31-60 days overdue
- **61-90 Days:** 61-90 days overdue
- **90+ Days:** More than 90 days overdue

#### Step 3: Query Unpaid Transactions

Get CREDIT_PURCHASE transactions:
- Filter by credit_account
- Exclude fully paid transactions
- Filter `due_date` is not null
- Include INTEREST charges

#### Step 4: Calculate Days Overdue

For each transaction:
```python
if due_date <= as_of_date:
    days_overdue = (as_of_date - due_date).days
else:
    days_overdue = 0  # Not yet due
```

#### Step 5: Categorize Into Buckets

Categorize each outstanding amount:
```python
if days_overdue == 0:
    current += amount
elif 1 <= days_overdue <= 30:
    days_1_30 += amount
elif 31 <= days_overdue <= 60:
    days_31_60 += amount
elif 61 <= days_overdue <= 90:
    days_61_90 += amount
else:  # > 90
    days_90_plus += amount
```

#### Step 6: Calculate Totals and Percentages

Calculate:
- Total outstanding
- Percentage in each bucket
- Weighted average days overdue
- Oldest unpaid transaction date

#### Step 7: Build Response Dictionary

```python
{
    'as_of_date': date,
    'total_outstanding': Decimal,
    'aging': {
        'current': Decimal,
        'days_1_30': Decimal,
        'days_31_60': Decimal,
        'days_61_90': Decimal,
        'days_90_plus': Decimal
    },
    'percentages': {
        'current': float,
        'days_1_30': float,
        'days_31_60': float,
        'days_61_90': float,
        'days_90_plus': float
    },
    'transaction_count': int,
    'oldest_unpaid_date': date,
    'weighted_average_days': int
}
```

### Aging Buckets Visualization

```
┌──────────────────────────────────────────────────────────────┐
│  Aging Buckets Analysis - Customer ABC Ltd                   │
│  As of Date: 2026-01-31                                      │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  Total Outstanding: Rs. 50,000                               │
│                                                              │
│  Aging Breakdown:                                            │
│  ┌────────────────────────────────────────────────────┐      │
│  │ Bucket      │ Amount      │ %     │ Status        │      │
│  ├────────────────────────────────────────────────────┤      │
│  │ Current     │ Rs. 20,000  │ 40%   │ ✓ Good        │      │
│  │ 1-30 days   │ Rs. 15,000  │ 30%   │ ⚠ Monitor     │      │
│  │ 31-60 days  │ Rs. 10,000  │ 20%   │ ⚠ Warning     │      │
│  │ 61-90 days  │ Rs.  5,000  │ 10%   │ ⚠️ Critical    │      │
│  │ 90+ days    │ Rs.      0  │  0%   │ ❌ Default     │      │
│  └────────────────────────────────────────────────────┘      │
│                                                              │
│  Visual Distribution:                                        │
│  Current     ████████░░░░░░░░░░ 40%                          │
│  1-30 days   ██████░░░░░░░░░░░░ 30%                          │
│  31-60 days  ████░░░░░░░░░░░░░░ 20%                          │
│  61-90 days  ██░░░░░░░░░░░░░░░░ 10%                          │
│  90+ days    ░░░░░░░░░░░░░░░░░░  0%                          │
│                                                              │
│  Analysis:                                                   │
│  • Weighted Average: 24 days overdue                         │
│  • Oldest Transaction: 2025-11-15 (77 days ago)              │
│  • Risk Level: MEDIUM                                        │
│  • Action: Send reminder, monitor closely                    │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

### Aging Analysis Matrix

| Aging Profile | Risk Level | Action Required |
|---------------|------------|-----------------|
| 80%+ Current, <10% overdue | LOW | Normal monitoring |
| 50-80% Current, 10-30% overdue | MEDIUM | Send reminders |
| <50% Current, 30-50% overdue | HIGH | Restrict credit, urgent follow-up |
| Any 90+ days | CRITICAL | Suspend credit, collection action |

### Validation

- [ ] Method defined
- [ ] Bucket definitions correct
- [ ] Days overdue calculation works
- [ ] Categorization logic correct
- [ ] Percentages calculated accurately
- [ ] Response structure complete
- [ ] Handles edge cases (no transactions, all paid)

---

## Validation Checklist

### CreditService Class

- [ ] Class created and structured properly
- [ ] Constructor accepts credit_account
- [ ] Transaction number generator works
- [ ] Validation helpers implemented
- [ ] Transaction wrapper for atomicity

### Credit Purchase

- [ ] record_purchase() method complete
- [ ] Input validation works
- [ ] Transaction creation successful
- [ ] Credit account updates correctly
- [ ] Due date calculation accurate
- [ ] Atomic operation guaranteed

### Credit Payment

- [ ] record_payment() method complete
- [ ] Payment transaction created
- [ ] FIFO application to invoices
- [ ] Credit account updates correctly
- [ ] Risk score recalculated

### Credit Limit Check

- [ ] check_credit_limit() method works
- [ ] All validation checks perform correctly
- [ ] Warning system operational
- [ ] Response structure complete

### Balance Calculator

- [ ] calculate_balance() method works
- [ ] Accurate balance calculation
- [ ] Breakdown by type correct
- [ ] Consistency check functional

### Aging Buckets

- [ ] calculate_aging_buckets() method complete
- [ ] Bucket categorization correct
- [ ] Percentages calculated accurately
- [ ] Visual representation data provided

---

## Service Layer Architecture

### Service Layer Benefits

```
┌──────────────────────────────────────────────────────────────┐
│  Why Service Layer Pattern?                                  │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  WITHOUT Service Layer:                                      │
│  ┌────────────┐        ┌────────────┐        ┌──────────┐   │
│  │    View    │───────►│   Model    │───────►│    DB    │   │
│  └────────────┘        └────────────┘        └──────────┘   │
│       │                      │                               │
│       │  Business logic      │  Business logic               │
│       │  in views           │  in models                    │
│       │  (scattered)        │  (mixed concerns)             │
│                                                              │
│  WITH Service Layer:                                         │
│  ┌────────────┐        ┌────────────┐        ┌──────────┐   │
│  │    View    │───────►│  Service   │───────►│  Model   │   │
│  └────────────┘        └────────────┘        └──────────┘   │
│       │                      │                     │         │
│       │  Presentation       │  Business Logic     │  Data    │
│       │  only              │  centralized        │  only    │
│                                                              │
│  Advantages:                                                 │
│  ✓ Single location for business logic                       │
│  ✓ Easier to test                                            │
│  ✓ Reusable across views/APIs                               │
│  ✓ Transaction management centralized                        │
│  ✓ Clearer separation of concerns                            │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

### Usage Example

```python
# In view or API endpoint
from apps.credit.services import CreditService
from apps.credit.models import CustomerCredit

def checkout_view(request, order_id):
    order = Order.objects.get(id=order_id)
    customer = order.customer
    
    # Get credit account
    credit_account = customer.credit_account
    
    # Initialize service
    credit_service = CreditService(credit_account)
    
    # Check if purchase allowed
    check_result = credit_service.check_credit_limit(order.total)
    
    if not check_result['approved']:
        return JsonResponse({
            'error': 'Insufficient credit',
            'details': check_result
        }, status=400)
    
    # Record purchase
    try:
        transaction = credit_service.record_purchase(
            amount=order.total,
            reference_type='Order',
            reference_id=order.id,
            notes=f'Order #{order.order_number}'
        )
        
        return JsonResponse({
            'success': True,
            'transaction_id': str(transaction.id),
            'new_balance': str(credit_account.outstanding_balance)
        })
    except Exception as e:
        return JsonResponse({
            'error': str(e)
        }, status=500)
```

---

## Next Steps

After completing Tasks 22-27, proceed to:

→ **[Tasks 28-32: Statements, Reminders & Suspension](./03_Tasks-28-32_Statements-Reminders-Suspension.md)**

This will implement:
- Customer credit statements
- Interest calculation
- Payment reminder tasks
- Overdue alert tasks
- Auto-suspension logic

---

## References

### Design Patterns
- Service Layer Pattern
- Repository Pattern
- SOLID Principles

### Django Resources
- Database Transactions: https://docs.djangoproject.com/en/stable/topics/db/transactions/
- QuerySet API: https://docs.djangoproject.com/en/stable/ref/models/querysets/

### Project Resources
- CreditTransaction Model: `apps/credit/models/credit_transaction.py`
- CustomerCredit Model: `apps/credit/models/customer_credit.py`

---

**Document Version:** 1.0  
**Last Updated:** 2026-01-24  
**Status:** Ready for Implementation
