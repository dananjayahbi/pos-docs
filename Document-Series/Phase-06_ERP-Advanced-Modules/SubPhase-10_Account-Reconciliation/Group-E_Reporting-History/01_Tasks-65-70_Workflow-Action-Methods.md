# Tasks 65-70: Workflow Action Methods

> **Phase:** 06 - ERP Advanced Modules  
> **SubPhase:** 10 - Account Reconciliation  
> **Group:** E - Reporting & History  
> **Document:** 01 of 02  
> **Tasks Covered:** 65, 66, 67, 68, 69, 70

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Group:** [../Group-D_Reconciliation-Workflow/](../Group-D_Reconciliation-Workflow/)
- **→ Next Document:** [02_Tasks-71-76_Reconciliation-Reports.md](02_Tasks-71-76_Reconciliation-Reports.md)

---

## Document Overview

This document covers the workflow action methods for the reconciliation process. These methods handle state transitions, transaction matching/unmatching, adjustment entry creation, and reconciliation completion or cancellation. Each method includes validation, state management, and audit trail creation.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 65 | Add Start Reconciliation Method | Medium | 45 min |
| 66 | Add Match Transaction Method | Medium | 40 min |
| 67 | Add Unmatch Transaction Method | Low | 25 min |
| 68 | Add Create Adjustment Method | High | 60 min |
| 69 | Add Complete Reconciliation Method | Medium | 45 min |
| 70 | Add Cancel Reconciliation Method | Low | 25 min |

---

## Task 65: Add Start Reconciliation Method

### Overview
Implement the `start_reconciliation` method on the AccountReconciliation model. This method validates prerequisites, transitions the reconciliation from DRAFT to IN_PROGRESS status, captures the statement ending balance, and creates an audit trail entry. This is the first action in the reconciliation workflow.

### Dependencies
- AccountReconciliation model exists (Task 56)
- Reconciliation status constants defined (Task 55)
- Statement transactions exist (Tasks 59-60)
- Audit trail model exists (Task 61)

### Instructions

1. **Add start_reconciliation method to model**
   - Define instance method on AccountReconciliation
   - Accept statement_ending_balance parameter (Decimal)
   - Accept optional started_by user parameter
   - Return boolean indicating success

2. **Validate current status**
   - Check current status is DRAFT
   - Raise ValidationError if already started
   - Prevent starting completed/cancelled reconciliations

3. **Validate statement has transactions**
   - Check that statement_transactions queryset is not empty
   - Raise ValidationError if no transactions to reconcile
   - Message: "Cannot start reconciliation without statement transactions"

4. **Validate ending balance provided**
   - Ensure statement_ending_balance is not None
   - Validate balance is a valid Decimal value
   - Check balance is not negative (warning only)

5. **Calculate starting balance**
   - Query for previous completed reconciliation
   - Use ending balance from previous reconciliation
   - Default to 0.00 if no previous reconciliation

6. **Update reconciliation status**
   - Set status to IN_PROGRESS
   - Set statement_ending_balance field
   - Set statement_starting_balance field
   - Set started_at timestamp

7. **Calculate initial differences**
   - Sum all statement transaction amounts
   - Calculate statement_balance_difference
   - Formula: ending_balance - starting_balance - sum(statement_transactions)

8. **Initialize matching counters**
   - Set matched_count to 0
   - Set unmatched_count to count of statement transactions
   - Set system_transaction_count to count of available transactions

9. **Create audit trail entry**
   - Action: "STARTED"
   - Details: Include starting and ending balances
   - Record user if provided
   - Timestamp automatically captured

10. **Save model changes**
    - Call save() to persist all field updates
    - Use update_fields to optimize database write
    - Return True on success

11. **Handle exceptions**
    - Catch ValidationError and re-raise with context
    - Log errors for debugging
    - Ensure transaction rollback on failure

### Start Reconciliation Workflow

```
DRAFT Reconciliation
        │
        ▼
Validate Status = DRAFT ──────► Error if not DRAFT
        │
        ▼
Check Statement Transactions ──► Error if empty
        │
        ▼
Validate Ending Balance ───────► Error if missing
        │
        ▼
Get Previous Ending Balance ───► Starting Balance
        │
        ▼
Update Status = IN_PROGRESS
        │
        ▼
Set Starting & Ending Balances
        │
        ▼
Calculate Initial Difference
        │
        ▼
Initialize Counters
        │
        ▼
Create Audit Trail Entry
        │
        ▼
Save Changes
        │
        ▼
IN_PROGRESS Reconciliation
```

### Starting Balance Calculation

```
┌─────────────────────────────────────────────┐
│    Previous Reconciliation Ending Balance   │
│                     ↓                       │
│         Becomes Starting Balance            │
│            for Current Period               │
└─────────────────────────────────────────────┘

Example:
  Previous Reconciliation (Jan):
    Starting: 100,000.00
    Ending:   125,000.00
    
  Current Reconciliation (Feb):
    Starting: 125,000.00  ← From previous ending
    Ending:   150,000.00  ← From bank statement
```

### Balance Difference Formula

```
Statement Balance Difference = 
    Ending Balance 
    - Starting Balance 
    - Sum(Statement Transactions)

Example:
    Ending:    150,000.00
    Starting: -125,000.00
    Stmt Sum:  -23,500.00
                -----------
    Difference:   1,500.00  ← Unexplained difference
```

### Initial State After Starting

| Field | Value | Source |
|-------|-------|--------|
| status | IN_PROGRESS | Set by method |
| statement_starting_balance | Previous ending | Previous reconciliation |
| statement_ending_balance | User input | Method parameter |
| started_at | Current timestamp | Auto-set |
| matched_count | 0 | Initial state |
| unmatched_count | Count(stmt_txns) | Statement transactions |
| system_transaction_count | Count(sys_txns) | Available system transactions |
| statement_balance_difference | Calculated | Formula above |

### Validation Rules

| Validation | Condition | Error Message |
|-----------|-----------|---------------|
| Status Check | status != DRAFT | "Reconciliation already started or completed" |
| Transactions | statement_transactions.count() == 0 | "Cannot start without statement transactions" |
| Ending Balance | balance is None | "Statement ending balance is required" |
| Balance Type | Not Decimal | "Invalid balance format" |

### Audit Trail Details

The audit trail entry should capture:
- Action: "STARTED"
- Status Change: "DRAFT → IN_PROGRESS"
- Starting Balance: Previous ending balance
- Ending Balance: Provided balance
- Statement Transaction Count: Number of transactions
- User: Who started the reconciliation
- Timestamp: When started

### Sri Lanka Banking Context

#### Common Starting Scenarios

**Scenario 1: First Reconciliation**
- No previous reconciliation exists
- Starting balance: 0.00
- Ending balance: Current bank statement balance
- All transactions are new

**Scenario 2: Monthly Reconciliation**
- Previous reconciliation completed
- Starting balance: Last month's ending
- Ending balance: Current month's statement
- Continuous reconciliation chain

**Scenario 3: After Long Gap**
- Previous reconciliation is old (several months)
- May need to reconcile intermediate periods first
- Starting balance still from last completed reconciliation
- Larger transaction volume expected

#### Sri Lanka Banking Considerations

| Bank | Statement Format | Starting Balance Location |
|------|-----------------|---------------------------|
| Commercial Bank | PDF Statement | Opening Balance section |
| Bank of Ceylon | Paper/Digital | Previous Statement Closing |
| Sampath Bank | Digital Banking | Account Summary page |
| HNB | PDF/Excel | Statement Header |
| NDB | Online Banking | Transaction History start |

### Expected Outcome
- Reconciliation transitioned to IN_PROGRESS status
- Starting and ending balances recorded
- Initial difference calculated
- Counters initialized
- Audit trail created
- Ready for transaction matching

### Verification Checklist
- [ ] start_reconciliation method added to model
- [ ] Status validation implemented
- [ ] Transaction existence check added
- [ ] Ending balance validation included
- [ ] Starting balance calculation works
- [ ] Status updated to IN_PROGRESS
- [ ] Balances saved correctly
- [ ] Difference calculation accurate
- [ ] Counters initialized
- [ ] Audit trail entry created
- [ ] Exception handling implemented
- [ ] Method returns True on success

---

## Task 66: Add Match Transaction Method

### Overview
Implement the `match_transaction` method to manually match a statement transaction with one or more system transactions. This method validates matching rules, creates ReconciliationMatch records, updates the reconciliation status, recalculates differences, and creates an audit trail entry.

### Dependencies
- Task 65: Start Reconciliation Method
- ReconciliationMatch model exists (Task 62)
- Statement and system transactions loaded
- Matching rules defined

### Instructions

1. **Add match_transaction method to model**
   - Define instance method on AccountReconciliation
   - Accept statement_transaction_id parameter
   - Accept system_transaction_ids list parameter
   - Accept optional matched_by user parameter
   - Return created ReconciliationMatch instance

2. **Validate reconciliation status**
   - Check status is IN_PROGRESS
   - Raise ValidationError if not in progress
   - Cannot match in DRAFT, COMPLETED, or CANCELLED states

3. **Validate statement transaction**
   - Check statement_transaction_id exists
   - Verify transaction belongs to this reconciliation
   - Check transaction not already matched
   - Raise ValidationError if invalid

4. **Validate system transactions**
   - Check system_transaction_ids is not empty
   - Verify all IDs exist in account_transactions
   - Check none are already matched
   - Ensure all belong to same tenant

5. **Validate amount matching**
   - Get statement transaction amount
   - Sum system transaction amounts
   - Check amounts match within tolerance
   - Default tolerance: 0.01 (1 cent)

6. **Create ReconciliationMatch record**
   - Link to this reconciliation
   - Set statement_transaction reference
   - Set match_type (manual in this case)
   - Set matched_at timestamp
   - Set matched_by user if provided

7. **Create match detail records**
   - Create ReconciliationMatchDetail for each system transaction
   - Link to ReconciliationMatch
   - Reference system_transaction
   - Set amount_matched

8. **Update statement transaction status**
   - Set is_matched = True
   - Set matched_at timestamp
   - Save statement transaction

9. **Update system transaction statuses**
   - Set is_reconciled = True
   - Set reconciled_at timestamp
   - Save each system transaction

10. **Update reconciliation counters**
    - Increment matched_count by 1
    - Decrement unmatched_count by 1
    - Recalculate system_transaction_count
    - Recalculate balance_difference

11. **Create audit trail entry**
    - Action: "MATCH_CREATED"
    - Details: Transaction IDs and amounts
    - Record user if provided
    - Include match confidence if calculated

12. **Save and return**
    - Save reconciliation model
    - Return created ReconciliationMatch
    - Return None if matching fails

### Manual Matching Workflow

```
Statement Transaction (Unmatched)
        │
        ▼
Validate Status = IN_PROGRESS ─────► Error if not in progress
        │
        ▼
Check Transaction Not Matched ──────► Error if already matched
        │
        ▼
Validate System Transactions ───────► Error if invalid
        │
        ▼
Check Amount Match ─────────────────► Error if mismatch
        │
        ▼
Create ReconciliationMatch
        │
        ▼
Create Match Detail Records
        │
        ▼
Update Transaction Statuses
        │
        ▼
Update Reconciliation Counters
        │
        ▼
Create Audit Trail
        │
        ▼
Matched Transaction Pair
```

### Amount Matching Rules

```
┌─────────────────────────────────────────────┐
│         Amount Matching Tolerance           │
└─────────────────────────────────────────────┘

Rule 1: Exact Match (Preferred)
  Statement:  1,250.00
  System:     1,250.00
  Match:      YES ✓

Rule 2: Within Tolerance (0.01)
  Statement:  1,250.00
  System:     1,250.01
  Difference: 0.01
  Match:      YES ✓ (within tolerance)

Rule 3: Outside Tolerance
  Statement:  1,250.00
  System:     1,250.05
  Difference: 0.05
  Match:      NO ✗ (requires adjustment)

Rule 4: Multiple System Transactions
  Statement:  1,250.00
  System 1:     500.00
  System 2:     750.00
  Sum:        1,250.00
  Match:      YES ✓ (combined match)
```

### Match Type Scenarios

#### One-to-One Match (Simple)
```
Statement Transaction:          System Transaction:
┌──────────────────────┐       ┌──────────────────────┐
│ Date:   2026-01-15   │       │ Date:   2026-01-15   │
│ Desc:   Customer Pay │  ──►  │ Desc:   Invoice #123 │
│ Amount: 25,000.00    │       │ Amount: 25,000.00    │
└──────────────────────┘       └──────────────────────┘
         1 : 1 Match
```

#### One-to-Many Match (Split Payment)
```
Statement Transaction:          System Transactions:
┌──────────────────────┐       ┌──────────────────────┐
│ Date:   2026-01-15   │       │ Invoice #101         │
│ Desc:   Bulk Payment │  ──►  │ Amount: 10,000.00    │
│ Amount: 25,000.00    │       ├──────────────────────┤
└──────────────────────┘       │ Invoice #102         │
                               │ Amount: 8,000.00     │
                               ├──────────────────────┤
                               │ Invoice #103         │
                               │ Amount: 7,000.00     │
                               └──────────────────────┘
         1 : Many Match (Total = 25,000.00)
```

### Match Record Structure

```
┌────────────────────────────────────────────┐
│         ReconciliationMatch                │
├────────────────────────────────────────────┤
│ • reconciliation (FK)                      │
│ • statement_transaction (FK)               │
│ • match_type = 'manual'                    │
│ • matched_at (timestamp)                   │
│ • matched_by (user)                        │
└────────────────────────────────────────────┘
                │
                │ 1:N
                ▼
┌────────────────────────────────────────────┐
│      ReconciliationMatchDetail             │
├────────────────────────────────────────────┤
│ • match (FK)                               │
│ • system_transaction (FK)                  │
│ • amount_matched (Decimal)                 │
└────────────────────────────────────────────┘
```

### Counter Updates

| Counter | Before Match | After Match | Change |
|---------|-------------|-------------|--------|
| matched_count | 5 | 6 | +1 |
| unmatched_count | 15 | 14 | -1 |
| system_transaction_count | 20 | 19 | -1 (or more) |
| balance_difference | Recalculated | New value | Based on remaining |

### Validation Rules

| Validation | Condition | Error Message |
|-----------|-----------|---------------|
| Status | status != IN_PROGRESS | "Cannot match transactions - reconciliation not in progress" |
| Statement Txn | Not found or wrong reconciliation | "Invalid statement transaction" |
| Already Matched | is_matched = True | "Statement transaction already matched" |
| System Txns | Empty list | "At least one system transaction required" |
| System Already Matched | is_reconciled = True | "System transaction already reconciled" |
| Amount Mismatch | Difference > tolerance | "Transaction amounts do not match" |

### Sri Lanka Banking Match Examples

#### Example 1: Customer Payment Match
```
Statement:
  Date: 15/01/2026
  Description: "CHQ DEP - 001234"
  Amount: 125,500.00 LKR

System:
  Date: 15/01/2026
  Description: "Invoice Payment - Customer ABC"
  Amount: 125,500.00 LKR

Match Type: One-to-One, Exact Amount
Status: Perfect Match ✓
```

#### Example 2: Supplier Payment with Charges
```
Statement:
  Date: 20/01/2026
  Description: "OUTWARD RTGS"
  Amount: -50,250.00 LKR

System:
  Transaction 1: Supplier Payment -50,000.00
  Transaction 2: Bank Charges -250.00
  Total: -50,250.00 LKR

Match Type: One-to-Many
Status: Combined Match ✓
```

#### Example 3: SLIPS Payment
```
Statement:
  Date: 18/01/2026
  Description: "SLIPS CR - Ref 2026011812345"
  Amount: 85,000.00 LKR

System:
  Date: 18/01/2026
  Description: "Customer Payment - SLIPS"
  Amount: 85,000.00 LKR

Match Type: One-to-One
Note: SLIPS (Sri Lanka Interbank Payment System)
```

### Expected Outcome
- Statement transaction matched with system transaction(s)
- ReconciliationMatch record created
- Match details recorded
- Transaction statuses updated
- Reconciliation counters updated
- Audit trail created
- Balance difference recalculated

### Verification Checklist
- [ ] match_transaction method added
- [ ] Status validation implemented
- [ ] Statement transaction validation added
- [ ] System transaction validation included
- [ ] Amount matching logic works
- [ ] ReconciliationMatch created
- [ ] Match detail records created
- [ ] Statement transaction status updated
- [ ] System transaction statuses updated
- [ ] Counters incremented/decremented correctly
- [ ] Balance difference recalculated
- [ ] Audit trail entry created
- [ ] Method returns match instance

---

## Task 67: Add Unmatch Transaction Method

### Overview
Implement the `unmatch_transaction` method to reverse a previously created match. This method allows corrections when transactions were matched incorrectly. It deletes the match records, resets transaction statuses, updates counters, and creates an audit trail entry.

### Dependencies
- Task 66: Match Transaction Method
- ReconciliationMatch and detail records exist
- Transactions have been matched

### Instructions

1. **Add unmatch_transaction method to model**
   - Define instance method on AccountReconciliation
   - Accept statement_transaction_id parameter
   - Accept optional unmatched_by user parameter
   - Return boolean indicating success

2. **Validate reconciliation status**
   - Check status is IN_PROGRESS
   - Raise ValidationError if not in progress
   - Cannot unmatch completed reconciliations

3. **Validate statement transaction**
   - Check statement_transaction_id exists
   - Verify transaction belongs to this reconciliation
   - Check transaction is currently matched
   - Raise ValidationError if not matched

4. **Retrieve match record**
   - Query ReconciliationMatch for this statement transaction
   - Include related match_details
   - Store system transaction IDs for updates

5. **Store match details for audit**
   - Capture matched system transaction IDs
   - Store match amounts
   - Record match type and timestamp
   - Will be logged in audit trail

6. **Delete match detail records**
   - Delete all ReconciliationMatchDetail records
   - Cascade from ReconciliationMatch
   - Or delete explicitly for audit purposes

7. **Update statement transaction status**
   - Set is_matched = False
   - Clear matched_at timestamp
   - Save statement transaction

8. **Update system transaction statuses**
   - For each previously matched system transaction
   - Set is_reconciled = False
   - Clear reconciled_at timestamp
   - Save each system transaction

9. **Delete match record**
   - Delete ReconciliationMatch record
   - Cascade deletes match details if not already deleted
   - Ensure clean removal

10. **Update reconciliation counters**
    - Decrement matched_count by 1
    - Increment unmatched_count by 1
    - Increment system_transaction_count (transactions now available)
    - Recalculate balance_difference

11. **Create audit trail entry**
    - Action: "MATCH_REMOVED"
    - Details: Original match information
    - Record user if provided
    - Include reason if available

12. **Save and return**
    - Save reconciliation model
    - Return True on success
    - Return False if unmatch fails

### Unmatch Workflow

```
Matched Transaction
        │
        ▼
Validate Status = IN_PROGRESS ─────► Error if not in progress
        │
        ▼
Check Transaction Is Matched ───────► Error if not matched
        │
        ▼
Retrieve Match Record
        │
        ▼
Store Match Details (for audit)
        │
        ▼
Delete Match Detail Records
        │
        ▼
Reset Statement Transaction Status
        │
        ▼
Reset System Transaction Statuses
        │
        ▼
Delete Match Record
        │
        ▼
Update Reconciliation Counters
        │
        ▼
Create Audit Trail
        │
        ▼
Unmatched Transaction
```

### Status Reversal Logic

```
Before Unmatch:
┌──────────────────────────────────────────┐
│ Statement Transaction                    │
│   is_matched: True                       │
│   matched_at: 2026-01-15 10:30:00       │
└──────────────────────────────────────────┘
              │ Matched To
              ▼
┌──────────────────────────────────────────┐
│ System Transaction(s)                    │
│   is_reconciled: True                    │
│   reconciled_at: 2026-01-15 10:30:00    │
└──────────────────────────────────────────┘

After Unmatch:
┌──────────────────────────────────────────┐
│ Statement Transaction                    │
│   is_matched: False                      │
│   matched_at: null                       │
└──────────────────────────────────────────┘
              │ No Match
              ▼
┌──────────────────────────────────────────┐
│ System Transaction(s)                    │
│   is_reconciled: False                   │
│   reconciled_at: null                    │
└──────────────────────────────────────────┘
```

### Counter Updates

| Counter | Before Unmatch | After Unmatch | Change |
|---------|---------------|---------------|--------|
| matched_count | 10 | 9 | -1 |
| unmatched_count | 5 | 6 | +1 |
| system_transaction_count | 15 | 16 | +1 (or more) |
| balance_difference | Previous | Recalculated | Based on unmatched |

### Unmatch Scenarios

#### Scenario 1: Incorrect Amount Match
```
Situation: Wrong invoice was matched to payment
Action: Unmatch to select correct invoice

Before:
  Statement: Customer Payment 50,000 LKR ──► Invoice #101 (50,000)
                                             ✗ Wrong invoice!

After Unmatch:
  Statement: Customer Payment 50,000 LKR     (unmatched)
  System:    Invoice #101 (50,000)           (available)
  
Then Rematch:
  Statement: Customer Payment 50,000 LKR ──► Invoice #105 (50,000)
                                             ✓ Correct invoice!
```

#### Scenario 2: Split Payment Error
```
Situation: Combined wrong transactions
Action: Unmatch and recombine correctly

Before:
  Statement: Bulk Payment 100,000 ──► Invoice #1: 60,000
                                      Invoice #2: 40,000
                                      ✗ Wrong combination!

After Unmatch:
  Statement: Bulk Payment 100,000     (unmatched)
  Invoices: #1, #2, #3               (all available)

Correct Match:
  Statement: Bulk Payment 100,000 ──► Invoice #1: 50,000
                                      Invoice #2: 30,000
                                      Invoice #3: 20,000
                                      ✓ Correct split!
```

#### Scenario 3: Duplicate Entry
```
Situation: Transaction matched but was duplicate
Action: Unmatch and mark system transaction as duplicate

Before:
  Statement: Payment 25,000 ──► System: Payment 25,000
                                (Actually already recorded)

After Unmatch:
  Statement: Payment 25,000     (will be marked as duplicate)
  System:    Payment 25,000     (remains as original)
```

### Audit Trail Details

The audit trail entry should capture:
- Action: "MATCH_REMOVED"
- Previous Match ID
- Statement Transaction: ID, date, amount, description
- System Transaction(s): IDs, amounts
- Match Type: manual/automatic
- Original Match Date: When it was matched
- Removed By: User who unmatched
- Removed At: Current timestamp
- Reason: If provided

### Validation Rules

| Validation | Condition | Error Message |
|-----------|-----------|---------------|
| Status | status != IN_PROGRESS | "Cannot unmatch - reconciliation not in progress" |
| Transaction Exists | Not found | "Statement transaction not found" |
| Belongs to Reconciliation | Wrong reconciliation | "Transaction does not belong to this reconciliation" |
| Is Matched | is_matched = False | "Transaction is not currently matched" |
| Match Record | Not found | "Match record not found" |

### Sri Lanka Context - Common Unmatch Reasons

#### Banking Reconciliation
1. **Wrong Customer Payment**: Matched to wrong invoice
2. **Bank Charge Mismatch**: Combined charges incorrectly
3. **SLIPS/CEFT Reference Error**: Wrong reference number
4. **Cheque Deposit Confusion**: Mixed up multiple cheques
5. **Date Discrepancy**: Matched transactions from different dates

#### Typical Correction Flow
```
Day 1: Initial Reconciliation
  - Accountant matches 50 transactions
  - Finds 5 unmatched items

Day 2: Review Process
  - Supervisor identifies 2 incorrect matches
  - Unmatch these 2 transactions
  - Now 7 unmatched items (5 + 2)

Day 3: Final Reconciliation
  - Rematch the 2 transactions correctly
  - Create adjustments for remaining 5
  - Complete reconciliation
```

### Expected Outcome
- Match record deleted
- Match detail records removed
- Statement transaction status reset to unmatched
- System transaction statuses reset to unreconciled
- Reconciliation counters updated
- Transactions available for rematching
- Audit trail preserves unmatch history
- Balance difference recalculated

### Verification Checklist
- [ ] unmatch_transaction method added
- [ ] Status validation implemented
- [ ] Transaction validation included
- [ ] Match record retrieval works
- [ ] Match details stored for audit
- [ ] Match detail records deleted
- [ ] Statement transaction status reset
- [ ] System transaction statuses reset
- [ ] Match record deleted
- [ ] Counters updated correctly
- [ ] Balance difference recalculated
- [ ] Audit trail entry created
- [ ] Method returns True on success
- [ ] Transactions available for rematching

---

## Task 68: Add Create Adjustment Method

### Overview
Implement the `create_adjustment` method to generate journal entries for unexplained differences found during reconciliation. This method creates adjusting entries in the accounting system, links them to the reconciliation, updates the balance difference, and maintains an audit trail. This is a critical method for handling discrepancies.

### Dependencies
- Task 67: Unmatch Transaction Method
- Journal entry models exist (from accounting module)
- Chart of accounts configured
- Adjustment reasons defined

### Instructions

1. **Add create_adjustment method to model**
   - Define instance method on AccountReconciliation
   - Accept adjustment_amount parameter (Decimal)
   - Accept adjustment_reason parameter (text)
   - Accept adjustment_type parameter (DEBIT/CREDIT)
   - Accept optional created_by user parameter
   - Return created journal entry instance

2. **Validate reconciliation status**
   - Check status is IN_PROGRESS
   - Raise ValidationError if not in progress
   - Cannot create adjustments for completed/cancelled

3. **Validate adjustment amount**
   - Check amount is not zero
   - Check amount is positive (sign determined by type)
   - Validate amount is reasonable (configurable limit)
   - Raise ValidationError if invalid

4. **Validate adjustment reason**
   - Check reason is provided
   - Validate reason is not empty
   - Minimum length check (e.g., 10 characters)
   - Required for audit purposes

5. **Determine adjustment accounts**
   - Get bank account from reconciliation
   - Get adjustment account based on type
   - Debit adjustments: Bank Charges, Fees, Errors
   - Credit adjustments: Interest Income, Deposits Not Recorded

6. **Create journal entry header**
   - Set entry_date to reconciliation date
   - Set entry_type to 'adjustment'
   - Set reference to reconciliation number
   - Set description from adjustment_reason
   - Set status to 'draft' or 'posted' based on config

7. **Create journal entry lines**
   - For DEBIT adjustment: Debit bank account, Credit adjustment account
   - For CREDIT adjustment: Debit adjustment account, Credit bank account
   - Both lines with same amount
   - Include reconciliation reference in line description

8. **Link adjustment to reconciliation**
   - Create ReconciliationAdjustment record
   - Link to reconciliation
   - Link to journal_entry
   - Store adjustment_reason
   - Store adjustment_amount and type

9. **Update reconciliation balance difference**
   - Subtract adjustment amount from balance_difference
   - For DEBIT: difference += amount (increases bank balance)
   - For CREDIT: difference -= amount (decreases bank balance)
   - Save reconciliation

10. **Post journal entry (if configured)**
    - Check auto_post_adjustments setting
    - If True, post journal entry immediately
    - If False, leave in draft for review
    - Update posted_at timestamp if posted

11. **Create audit trail entry**
    - Action: "ADJUSTMENT_CREATED"
    - Details: Amount, type, reason, journal entry ID
    - Record user if provided
    - Include account references

12. **Save and return**
    - Save all related models
    - Return created journal entry
    - Return None on failure

### Adjustment Creation Workflow

```
Identify Unexplained Difference
        │
        ▼
Validate Status = IN_PROGRESS ──────► Error if not in progress
        │
        ▼
Validate Adjustment Amount ──────────► Error if invalid
        │
        ▼
Validate Adjustment Reason ──────────► Error if missing
        │
        ▼
Determine Adjustment Accounts
        │
        ▼
Create Journal Entry Header
        │
        ▼
Create Journal Entry Lines (Debit & Credit)
        │
        ▼
Link to Reconciliation (ReconciliationAdjustment)
        │
        ▼
Update Balance Difference
        │
        ▼
Post Entry (if auto-post enabled)
        │
        ▼
Create Audit Trail
        │
        ▼
Adjustment Created & Recorded
```

### Adjustment Types and Accounts

```
┌─────────────────────────────────────────────┐
│          DEBIT Adjustment                   │
│  (Increases Bank Balance)                   │
├─────────────────────────────────────────────┤
│  Dr. Bank Account         XX,XXX.XX         │
│      Cr. Adjustment Account   XX,XXX.XX     │
│                                             │
│  Examples:                                  │
│    • Interest income not recorded           │
│    • Customer deposit received              │
│    • Error - understated deposit            │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│          CREDIT Adjustment                  │
│  (Decreases Bank Balance)                   │
├─────────────────────────────────────────────┤
│  Dr. Adjustment Account   XX,XXX.XX         │
│      Cr. Bank Account         XX,XXX.XX     │
│                                             │
│  Examples:                                  │
│    • Bank charges not recorded              │
│    • Service fees                           │
│    • Cheque dishonor charges                │
│    • Error - overstated deposit             │
└─────────────────────────────────────────────┘
```

### Common Adjustment Scenarios

#### Scenario 1: Bank Charges (CREDIT)
```
Situation:
  Statement shows: Service Charge Rs. 500.00
  System has no record of this charge

Adjustment:
  Type: CREDIT (reduces bank balance)
  Amount: 500.00
  Reason: "Monthly bank service charges - January 2026"
  
Journal Entry:
  Dr. Bank Charges Expense        500.00
      Cr. Bank Account                500.00
```

#### Scenario 2: Interest Income (DEBIT)
```
Situation:
  Statement shows: Interest Credit Rs. 2,500.00
  System has no record of this income

Adjustment:
  Type: DEBIT (increases bank balance)
  Amount: 2,500.00
  Reason: "Interest income for Q4 2025"
  
Journal Entry:
  Dr. Bank Account               2,500.00
      Cr. Interest Income            2,500.00
```

#### Scenario 3: Dishonored Cheque Charges (CREDIT)
```
Situation:
  Statement shows: Dishonor Charges Rs. 1,000.00
  Customer cheque bounced, charges applied

Adjustment:
  Type: CREDIT (reduces bank balance)
  Amount: 1,000.00
  Reason: "Cheque dishonor charges - Cheque #123456"
  
Journal Entry:
  Dr. Bank Charges Expense       1,000.00
      Cr. Bank Account               1,000.00
```

#### Scenario 4: Deposit Not Recorded (DEBIT)
```
Situation:
  Statement shows: Deposit Rs. 50,000.00
  System has no matching transaction

Adjustment:
  Type: DEBIT (increases bank balance)
  Amount: 50,000.00
  Reason: "Customer deposit received but not recorded - Customer ABC"
  
Journal Entry:
  Dr. Bank Account              50,000.00
      Cr. Customer Deposits          50,000.00
```

### Balance Difference Impact

```
Initial State:
  Statement Balance:        150,000.00
  System Balance:           148,500.00
  Difference:                 1,500.00  ← To be explained

After CREDIT Adjustment (500.00):
  Adjusted System Balance:  148,000.00
  Remaining Difference:       2,000.00  ← Increased difference

After DEBIT Adjustment (2,000.00):
  Adjusted System Balance:  150,000.00
  Remaining Difference:           0.00  ← Reconciled!
```

### Adjustment Account Mapping

| Adjustment Type | Debit Account | Credit Account | Common Reasons |
|----------------|---------------|----------------|----------------|
| Bank Charge | Bank Charges Expense | Bank Account | Monthly fees, transaction charges |
| Interest Income | Bank Account | Interest Income | Interest earned, promotional bonus |
| NSF Charge | Bank Charges Expense | Bank Account | Non-sufficient funds fee |
| Wire Transfer Fee | Bank Charges Expense | Bank Account | SWIFT, SLIPS charges |
| Error Correction | Depends on error | Depends on error | Recording mistakes |
| Unrecorded Deposit | Bank Account | Relevant Income | Missing transaction |
| Unrecorded Withdrawal | Relevant Expense | Bank Account | Missing transaction |

### Sri Lanka-Specific Adjustments

#### Common Bank Charges (Sri Lanka)
| Charge Type | Typical Amount (LKR) | Frequency |
|------------|---------------------|-----------|
| Monthly Maintenance | 100 - 500 | Monthly |
| Cheque Book | 200 - 1,000 | As needed |
| SLIPS Transfer | 50 - 200 | Per transaction |
| CEFT Transfer | 25 - 100 | Per transaction |
| RTGS Transfer | 500 - 2,000 | Per transaction |
| SMS Alerts | 50 - 100 | Monthly |
| Debit Card Annual Fee | 500 - 1,500 | Annually |
| Statement Charges | 50 - 200 | Per statement |
| Overdraft Interest | Variable | Monthly |
| Dishonor Charges | 500 - 1,500 | Per cheque |

#### Interest Income Patterns
- **Savings Account**: Calculated monthly, credited quarterly
- **Fixed Deposit**: Interest rates 8-12%, credited at maturity or monthly
- **Call Deposit**: Higher rates, flexible withdrawals
- **Statement Timing**: Interest may appear after month-end closing

#### SLIPS/CEFT Considerations
```
Adjustment Reason Example:
  "SLIPS transfer charges for 3 transactions
   Ref: 2026011812345, 2026011912346, 2026012012347
   Total charges: Rs. 450.00 (3 × Rs. 150.00)"
```

### Validation Rules

| Validation | Condition | Error Message |
|-----------|-----------|---------------|
| Status | status != IN_PROGRESS | "Cannot create adjustment - reconciliation not in progress" |
| Amount Zero | amount == 0 | "Adjustment amount cannot be zero" |
| Amount Negative | amount < 0 | "Adjustment amount must be positive" |
| Amount Limit | amount > configured limit | "Adjustment amount exceeds approval limit" |
| Reason Missing | reason is empty | "Adjustment reason is required" |
| Reason Too Short | len(reason) < 10 | "Adjustment reason must be at least 10 characters" |
| Type Invalid | type not in [DEBIT, CREDIT] | "Invalid adjustment type" |

### Auto-Post Configuration

| Setting | Value | Behavior |
|---------|-------|----------|
| auto_post_adjustments | True | Journal entries posted immediately |
| auto_post_adjustments | False | Journal entries remain in draft |
| adjustment_approval_required | True | Requires supervisor approval |
| adjustment_limit | Amount | Over limit requires approval |

### Expected Outcome
- Journal entry created for adjustment
- Proper debit and credit entries recorded
- ReconciliationAdjustment link created
- Balance difference updated
- Entry posted if configured
- Audit trail created
- System accounts updated

### Verification Checklist
- [ ] create_adjustment method added
- [ ] Status validation implemented
- [ ] Amount validation included
- [ ] Reason validation added
- [ ] Adjustment accounts determined correctly
- [ ] Journal entry header created
- [ ] Journal entry lines created (debit & credit)
- [ ] ReconciliationAdjustment record created
- [ ] Balance difference updated correctly
- [ ] Auto-post logic implemented
- [ ] Audit trail entry created
- [ ] Method returns journal entry
- [ ] Handles DEBIT and CREDIT types
- [ ] Validates amount limits
- [ ] Reason length validation works

---

## Task 69: Add Complete Reconciliation Method

### Overview
Implement the `complete_reconciliation` method to finalize the reconciliation process. This method validates that all discrepancies are resolved, transitions the status to COMPLETED, finalizes all balances, posts any pending adjustments, closes the reconciliation period, and creates a comprehensive audit trail entry.

### Dependencies
- Task 68: Create Adjustment Method
- All transactions matched or accounted for
- Adjustments created for differences
- Balance difference resolved

### Instructions

1. **Add complete_reconciliation method to model**
   - Define instance method on AccountReconciliation
   - Accept optional completed_by user parameter
   - Accept optional notes parameter
   - Return boolean indicating success

2. **Validate reconciliation status**
   - Check status is IN_PROGRESS
   - Raise ValidationError if not in progress
   - Cannot complete DRAFT, COMPLETED, or CANCELLED

3. **Validate balance difference resolved**
   - Check balance_difference is zero or within tolerance
   - Default tolerance: 0.01 (1 cent)
   - Raise ValidationError if significant difference remains
   - Suggest creating adjustment if needed

4. **Validate no pending issues**
   - Check for any flagged transactions
   - Verify all required matches are complete
   - Ensure no incomplete adjustment entries
   - Validate minimum match percentage if configured

5. **Calculate final statistics**
   - Count total statement transactions
   - Count matched transactions
   - Count unmatched transactions
   - Count adjustment entries created
   - Calculate match percentage

6. **Post pending journal entries**
   - Find all draft adjustment entries for this reconciliation
   - Post each journal entry
   - Update posted_at timestamps
   - Validate posting successful

7. **Update reconciliation status**
   - Set status to COMPLETED
   - Set completed_at timestamp
   - Set completed_by user if provided
   - Store completion_notes if provided

8. **Finalize balance fields**
   - Confirm statement_starting_balance
   - Confirm statement_ending_balance
   - Confirm final balance_difference (should be ~0)
   - Set reconciled_balance to ending_balance

9. **Lock matched transactions**
   - Mark all matched transactions as locked
   - Prevent further modifications
   - Set is_locked flag on matches

10. **Calculate next reconciliation starting balance**
    - Current ending_balance becomes next starting_balance
    - Used for next reconciliation period
    - Ensures continuity in reconciliation chain

11. **Create completion audit trail**
    - Action: "COMPLETED"
    - Status Change: "IN_PROGRESS → COMPLETED"
    - Final statistics: matches, adjustments, etc.
    - Completion notes if provided
    - User who completed
    - Timestamp

12. **Generate completion report (optional)**
    - Create reconciliation report record
    - Generate PDF summary
    - Store report file reference
    - Will be detailed in Task 71

13. **Send notifications (optional)**
    - Notify accountant of completion
    - Notify supervisor if approval required
    - Email reconciliation summary
    - Based on system configuration

14. **Save and return**
    - Save all model changes
    - Return True on successful completion
    - Return False if validation fails

### Completion Workflow

```
IN_PROGRESS Reconciliation
        │
        ▼
Validate Status = IN_PROGRESS ──────► Error if wrong status
        │
        ▼
Check Balance Difference ≈ 0 ────────► Error if not resolved
        │
        ▼
Validate No Pending Issues ──────────► Error if issues remain
        │
        ▼
Calculate Final Statistics
        │
        ▼
Post Pending Journal Entries
        │
        ▼
Update Status = COMPLETED
        │
        ▼
Set Completion Timestamp
        │
        ▼
Finalize All Balances
        │
        ▼
Lock Matched Transactions
        │
        ▼
Calculate Next Starting Balance
        │
        ▼
Create Completion Audit Trail
        │
        ▼
Generate Completion Report (optional)
        │
        ▼
Send Notifications (optional)
        │
        ▼
COMPLETED Reconciliation
```

### Balance Resolution Check

```
┌─────────────────────────────────────────────┐
│         Balance Difference Check            │
└─────────────────────────────────────────────┘

Scenario 1: Fully Reconciled
  Balance Difference: 0.00
  Status: ✓ Ready to complete

Scenario 2: Within Tolerance
  Balance Difference: 0.01
  Tolerance: 0.01
  Status: ✓ Ready to complete (minor rounding)

Scenario 3: Small Unresolved Difference
  Balance Difference: 5.00
  Status: ✗ Cannot complete
  Action: Create adjustment entry

Scenario 4: Large Unresolved Difference
  Balance Difference: 1,500.00
  Status: ✗ Cannot complete
  Action: Review transactions, create adjustments
```

### Final Statistics Calculation

```
┌────────────────────────────────────────────┐
│      Reconciliation Final Statistics       │
├────────────────────────────────────────────┤
│ Total Statement Transactions:    125      │
│ Matched Transactions:            120      │
│ Unmatched Transactions:            5      │
│ Adjustment Entries Created:        3      │
│ Match Percentage:               96.0%     │
│                                            │
│ Starting Balance:         1,250,000.00    │
│ Ending Balance:           1,375,000.00    │
│ Balance Difference:                0.00    │
│ Status:                      COMPLETED    │
└────────────────────────────────────────────┘
```

### Match Percentage Calculation

```
Match Percentage = (Matched Count / Total Count) × 100

Example:
  Matched: 120 transactions
  Total:   125 transactions
  Percentage: (120 / 125) × 100 = 96.0%

Typical Standards:
  - Excellent:  95-100%
  - Good:       90-95%
  - Acceptable: 85-90%
  - Review:     < 85%
```

### Transaction Locking Logic

```
Before Completion:
┌──────────────────────────────────────────┐
│ ReconciliationMatch                      │
│   is_locked: False                       │
│   can_unmatch: True                      │
│   can_modify: True                       │
└──────────────────────────────────────────┘

After Completion:
┌──────────────────────────────────────────┐
│ ReconciliationMatch                      │
│   is_locked: True                        │
│   can_unmatch: False                     │
│   can_modify: False                      │
└──────────────────────────────────────────┘

Purpose:
  - Preserve audit trail integrity
  - Prevent changes to completed reconciliation
  - Maintain historical accuracy
  - Required for audit compliance
```

### Reconciliation Chain Continuity

```
Month 1 (December 2025):
  Starting Balance:  1,000,000.00
  Ending Balance:    1,250,000.00
  Status:            COMPLETED ✓
            │
            │ Ending becomes Starting
            ▼
Month 2 (January 2026):
  Starting Balance:  1,250,000.00  ← From previous
  Ending Balance:    1,375,000.00
  Status:            COMPLETED ✓
            │
            │ Ending becomes Starting
            ▼
Month 3 (February 2026):
  Starting Balance:  1,375,000.00  ← From previous
  Ending Balance:    1,425,000.00
  Status:            IN_PROGRESS
```

### Validation Rules

| Validation | Condition | Error Message |
|-----------|-----------|---------------|
| Status | status != IN_PROGRESS | "Reconciliation is not in progress" |
| Balance Difference | difference > tolerance | "Balance difference not resolved: Rs. X.XX remaining" |
| Pending Adjustments | Draft entries exist | "Post or delete pending adjustment entries" |
| Minimum Matches | match_pct < configured | "Match percentage too low: X% (minimum Y%)" |
| Flagged Items | Unresolved flags exist | "Resolve all flagged items before completing" |

### Post-Completion State

| Field | Value | Description |
|-------|-------|-------------|
| status | COMPLETED | Final status |
| completed_at | Timestamp | When completed |
| completed_by | User | Who completed |
| matched_count | Final count | Number of matches |
| unmatched_count | Final count | Remaining unmatched |
| adjustment_count | Final count | Adjustments created |
| balance_difference | ~0.00 | Should be zero |
| reconciled_balance | Ending balance | Confirmed balance |
| is_locked | True | No further changes |

### Sri Lanka Compliance Considerations

#### Accounting Standards
- **SLFRS/LKAS Compliance**: Reconciliation supports proper bank balance reporting
- **Audit Requirements**: Complete audit trail maintained
- **Tax Compliance**: Accurate bank records for tax filing
- **Documentation**: Reports available for authorities

#### Bank Reconciliation Standards
```
Monthly Reconciliation Requirements:
  ✓ All transactions matched or explained
  ✓ Adjustments properly documented
  ✓ Balance difference resolved
  ✓ Supervisor review (if required)
  ✓ Documentation retained for audit

Sri Lanka Companies Act Requirements:
  - Maintain proper accounting records
  - Bank reconciliations monthly
  - Documentation retained 7+ years
  - Available for inspection
```

#### Common Completion Scenarios

**Scenario 1: Clean Reconciliation**
```
120 transactions matched automatically
3 transactions matched manually
2 bank charges adjusted
Balance difference: 0.00
Status: Ready to complete ✓
```

**Scenario 2: With Minor Issues**
```
115 transactions matched
5 small differences (under Rs. 100 each)
Created adjustment for combined difference
Balance difference: 0.00
Notes: "Small rounding differences adjusted"
Status: Ready to complete ✓
```

**Scenario 3: Requires Review**
```
100 transactions matched
25 unmatched (20% unmatched rate)
Large balance difference: Rs. 50,000
Status: Cannot complete ✗
Action: Senior accountant review required
```

### Expected Outcome
- Reconciliation status set to COMPLETED
- All balances finalized and locked
- Matched transactions locked from changes
- Pending adjustments posted
- Final statistics calculated
- Next period starting balance set
- Completion audit trail created
- Report generated (if configured)
- Notifications sent (if configured)

### Verification Checklist
- [ ] complete_reconciliation method added
- [ ] Status validation implemented
- [ ] Balance difference check included
- [ ] Pending issues validation added
- [ ] Final statistics calculated
- [ ] Pending journal entries posted
- [ ] Status updated to COMPLETED
- [ ] Completion timestamp set
- [ ] Balance fields finalized
- [ ] Transactions locked
- [ ] Next starting balance calculated
- [ ] Completion audit trail created
- [ ] Method returns True on success
- [ ] Validation prevents premature completion
- [ ] Tolerance check configurable

---

## Task 70: Add Cancel Reconciliation Method

### Overview
Implement the `cancel_reconciliation` method to abort a reconciliation in progress. This method reverses all matches, deletes adjustment entries, resets transaction statuses, transitions to CANCELLED status, and creates an audit trail entry. Used when reconciliation needs to be restarted or is no longer needed.

### Dependencies
- Task 69: Complete Reconciliation Method
- Reconciliation in DRAFT or IN_PROGRESS status
- Ability to reverse matches and adjustments

### Instructions

1. **Add cancel_reconciliation method to model**
   - Define instance method on AccountReconciliation
   - Accept cancellation_reason parameter (required)
   - Accept optional cancelled_by user parameter
   - Return boolean indicating success

2. **Validate reconciliation status**
   - Check status is DRAFT or IN_PROGRESS
   - Raise ValidationError if already COMPLETED
   - Cannot cancel completed reconciliations
   - May require special permission to cancel

3. **Validate cancellation reason**
   - Check reason is provided
   - Validate reason is not empty
   - Minimum length check (e.g., 20 characters)
   - Required for audit compliance

4. **Check for posted adjustments**
   - Find all adjustment entries for reconciliation
   - Check if any are posted (status = POSTED)
   - Warn if posted entries exist
   - May require approval to cancel with posted entries

5. **Reverse all matches**
   - Retrieve all ReconciliationMatch records
   - For each match, unmatch transactions
   - Reset statement transaction statuses
   - Reset system transaction statuses
   - Delete match and match detail records

6. **Handle adjustment entries**
   - Retrieve all ReconciliationAdjustment records
   - For draft entries: Delete immediately
   - For posted entries: Reverse with reversal entry
   - Update journal entry statuses
   - Clear reconciliation links

7. **Reset reconciliation fields**
   - Clear statement_starting_balance
   - Clear statement_ending_balance
   - Reset matched_count to 0
   - Reset unmatched_count to 0
   - Clear balance_difference

8. **Update cancellation fields**
   - Set status to CANCELLED
   - Set cancelled_at timestamp
   - Set cancelled_by user if provided
   - Store cancellation_reason

9. **Delete statement transactions (optional)**
   - Based on configuration
   - If delete_statement_on_cancel = True
   - Delete all statement transactions
   - Otherwise keep for reference

10. **Create cancellation audit trail**
    - Action: "CANCELLED"
    - Status Change: "DRAFT/IN_PROGRESS → CANCELLED"
    - Cancellation reason
    - Counts: Matches removed, adjustments reversed
    - User who cancelled
    - Timestamp

11. **Send notifications (optional)**
    - Notify accountant of cancellation
    - Alert supervisor if required
    - Include cancellation reason
    - Based on system configuration

12. **Save and return**
    - Save model changes
    - Return True on successful cancellation
    - Return False if cancellation blocked

### Cancellation Workflow

```
DRAFT or IN_PROGRESS Reconciliation
        │
        ▼
Validate Status ─────────────────────► Error if COMPLETED
        │
        ▼
Validate Cancellation Reason ────────► Error if missing
        │
        ▼
Check Posted Adjustments ─────────────► Warn if posted entries
        │
        ▼
Reverse All Matches
        │
        ▼
Unmatch Statement Transactions
        │
        ▼
Unmatch System Transactions
        │
        ▼
Delete Match Records
        │
        ▼
Handle Adjustment Entries
  ├─► Draft: Delete
  └─► Posted: Reverse
        │
        ▼
Reset Reconciliation Fields
        │
        ▼
Update Status = CANCELLED
        │
        ▼
Set Cancellation Timestamp & Reason
        │
        ▼
Delete Statement Transactions (optional)
        │
        ▼
Create Cancellation Audit Trail
        │
        ▼
Send Notifications (optional)
        │
        ▼
CANCELLED Reconciliation
```

### Match Reversal Process

```
Before Cancellation:
┌────────────────────────────────────────┐
│ 50 ReconciliationMatch records         │
│   - 50 statement transactions matched  │
│   - 75 system transactions matched     │
│   - 50 match detail groups             │
└────────────────────────────────────────┘

Cancellation Process:
  ► Iterate through all matches
  ► Reset statement transaction status
  ► Reset system transaction statuses
  ► Delete match detail records
  ► Delete match records

After Cancellation:
┌────────────────────────────────────────┐
│ 0 ReconciliationMatch records          │
│   - 50 statement transactions reset    │
│   - 75 system transactions reset       │
│   - All match records deleted          │
└────────────────────────────────────────┘
```

### Adjustment Entry Handling

```
┌─────────────────────────────────────────────┐
│        Draft Adjustment Entries             │
│  (Status: DRAFT, not yet posted)            │
├─────────────────────────────────────────────┤
│  Action: Delete immediately                 │
│  Reason: Not yet in ledger                  │
│  Impact: No reversal needed                 │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│        Posted Adjustment Entries            │
│  (Status: POSTED, in ledger)                │
├─────────────────────────────────────────────┤
│  Action: Create reversal entry              │
│  Reason: Already in ledger                  │
│  Impact: Reversal entry balances original   │
└─────────────────────────────────────────────┘

Reversal Entry Example:
  Original Entry (Bank Charge):
    Dr. Bank Charges      500.00
        Cr. Bank Account      500.00
  
  Reversal Entry:
    Dr. Bank Account      500.00
        Cr. Bank Charges      500.00
  
  Net Effect: Zero impact on accounts
```

### Field Reset Values

| Field | Value Before | Value After Cancel |
|-------|-------------|-------------------|
| status | IN_PROGRESS | CANCELLED |
| statement_starting_balance | 1,250,000.00 | null or 0.00 |
| statement_ending_balance | 1,375,000.00 | null or 0.00 |
| matched_count | 50 | 0 |
| unmatched_count | 25 | 0 |
| balance_difference | 1,500.00 | 0.00 |
| cancelled_at | null | 2026-01-25 14:30:00 |
| cancelled_by | null | User instance |
| cancellation_reason | null | "Incorrect statement imported" |

### Cancellation Reason Examples

#### Technical Issues
```
Reason: "Incorrect bank statement file imported. 
         Need to re-upload correct December 2025 statement 
         instead of November 2025."

Length: 98 characters ✓
Clarity: Explains what went wrong and what needs to be done
```

#### Data Errors
```
Reason: "Found duplicate transactions in system data. 
         Cancelling to fix duplicates before re-reconciling. 
         Duplicates: Txn #1234, #1235, #1236"

Length: 127 characters ✓
Clarity: Identifies specific issue and transaction references
```

#### Process Changes
```
Reason: "Supervisor requested use of different reconciliation 
         method. Will restart with updated matching rules 
         and tolerance levels."

Length: 113 characters ✓
Clarity: Explains management decision
```

#### Business Reasons
```
Reason: "Bank provided corrected statement with additional 
         transactions not in original statement. 
         Cancelling to reconcile with complete data."

Length: 118 characters ✓
Clarity: Explains external factor requiring restart
```

### Cancellation Scenarios

#### Scenario 1: Wrong Statement Imported (Early Stage)
```
Status: DRAFT
Matches: 0
Adjustments: 0
Statement Transactions: 100

Action: Cancel immediately
Impact: Delete statement transactions
Reason: "Wrong month's statement imported"
Effort: Minimal - nothing to reverse
```

#### Scenario 2: Partially Reconciled (Mid-Process)
```
Status: IN_PROGRESS
Matches: 50 (out of 100)
Adjustments: 3 (all draft)
Statement Transactions: 100

Action: Cancel with reason
Impact: 
  - Unmatch 50 transactions
  - Delete 3 draft adjustments
  - Reset 50 statement transactions
  - Reset 75 system transactions
Reason: "Found error in transaction data"
Effort: Moderate - significant reversal work
```

#### Scenario 3: Nearly Complete (Late Stage)
```
Status: IN_PROGRESS
Matches: 95 (out of 100)
Adjustments: 5 (3 posted, 2 draft)
Balance Difference: 500.00

Action: Cancel with approval
Impact:
  - Unmatch 95 transactions
  - Reverse 3 posted entries
  - Delete 2 draft entries
  - Reset 95 statement transactions
  - Reset 140 system transactions
Reason: "Supervisor identified systematic matching error"
Effort: High - extensive reversal needed
Approval: Required due to posted adjustments
```

### Validation Rules

| Validation | Condition | Error Message |
|-----------|-----------|---------------|
| Status | status == COMPLETED | "Cannot cancel completed reconciliation" |
| Reason Missing | reason is empty | "Cancellation reason is required" |
| Reason Too Short | len(reason) < 20 | "Cancellation reason must be at least 20 characters" |
| Posted Entries | Has posted & no approval | "Approval required to cancel with posted adjustments" |
| Locked | is_locked = True | "Reconciliation is locked and cannot be cancelled" |

### Sri Lanka Business Context

#### Common Cancellation Reasons

**Banking Issues**
- Wrong bank account reconciled
- Incorrect statement period
- Bank provided corrected statement
- Statement data incomplete

**System Issues**
- Software upgrade during reconciliation
- Data import errors
- Duplicate transactions found
- Database synchronization issues

**Process Issues**
- Supervisor requested different approach
- Matching rules need adjustment
- Training session interrupted work
- Month-end closing timing changed

**Compliance Reasons**
- Audit requirement changes
- Updated accounting policies
- Tax regulation changes
- Internal control updates

#### Approval Requirements

```
Cancellation Approval Matrix:
┌────────────────────┬──────────────┬────────────────┐
│ Situation          │ Approval     │ Authority      │
├────────────────────┼──────────────┼────────────────┤
│ DRAFT, no matches  │ None         │ Accountant     │
│ In progress, <25%  │ Supervisor   │ Accountant Mgr │
│ In progress, >25%  │ Manager      │ Finance Mgr    │
│ Posted adjustments │ Manager      │ Finance Mgr    │
│ >3 posted entries  │ Director     │ Finance Dir    │
└────────────────────┴──────────────┴────────────────┘
```

### Audit Trail Details

The audit trail entry should capture:
- Action: "CANCELLED"
- Previous Status: DRAFT or IN_PROGRESS
- New Status: CANCELLED
- Cancellation Reason: Full text
- Statistics Before Cancel:
  - Matches count
  - Adjustments count (draft and posted)
  - Balance difference
- Reversal Actions:
  - Matches removed
  - Adjustments reversed
  - Transactions reset
- Cancelled By: User
- Cancelled At: Timestamp
- Approval: If required, who approved

### Expected Outcome
- Reconciliation status set to CANCELLED
- All matches reversed and deleted
- Statement transaction statuses reset
- System transaction statuses reset
- Draft adjustments deleted
- Posted adjustments reversed
- Reconciliation fields reset
- Cancellation reason recorded
- Audit trail created
- Notifications sent (if configured)
- Ready for deletion or restart

### Verification Checklist
- [ ] cancel_reconciliation method added
- [ ] Status validation implemented
- [ ] Reason validation included
- [ ] Posted adjustment check added
- [ ] All matches reversed successfully
- [ ] Statement transaction statuses reset
- [ ] System transaction statuses reset
- [ ] Match records deleted
- [ ] Draft adjustments deleted
- [ ] Posted adjustments reversed
- [ ] Reconciliation fields reset
- [ ] Status updated to CANCELLED
- [ ] Cancellation timestamp set
- [ ] Cancellation reason stored
- [ ] Audit trail entry created
- [ ] Method returns True on success
- [ ] Approval logic implemented (if required)
- [ ] Cannot cancel completed reconciliation

---

## Summary

This document established the workflow action methods for account reconciliation:

### Completed Infrastructure
- ✅ Start reconciliation method with validation and initialization
- ✅ Match transaction method for manual matching with tolerance
- ✅ Unmatch transaction method for corrections
- ✅ Create adjustment method with journal entry generation
- ✅ Complete reconciliation method with finalization and locking
- ✅ Cancel reconciliation method with reversal logic

### Key Achievements
1. **State Management** - Proper status transitions through workflow
2. **Transaction Matching** - Manual matching with amount validation
3. **Error Correction** - Unmatch capability for fixing mistakes
4. **Difference Resolution** - Adjustment entries for unexplained differences
5. **Completion Logic** - Comprehensive validation before finalizing
6. **Cancellation Safety** - Proper reversal of all changes

### Workflow State Transitions
```
DRAFT
  │
  ├──► start_reconciliation() ──► IN_PROGRESS
  └──► cancel_reconciliation() ──► CANCELLED

IN_PROGRESS
  │
  ├──► match_transaction() ─────► IN_PROGRESS (with matches)
  ├──► unmatch_transaction() ───► IN_PROGRESS (correction)
  ├──► create_adjustment() ─────► IN_PROGRESS (with adjustments)
  ├──► complete_reconciliation() ► COMPLETED
  └──► cancel_reconciliation() ──► CANCELLED

COMPLETED
  │
  └──► (no further transitions - locked)

CANCELLED
  │
  └──► (can be deleted or restarted)
```

### Sri Lanka Banking Context
- Support for local bank statement formats
- SLIPS/CEFT/RTGS transaction handling
- Common bank charges and fees
- Interest income patterns
- Multi-language support (Sinhala, Tamil, English)
- Compliance with Sri Lankan accounting standards

### Next Steps
Proceed to [02_Tasks-71-76_Reconciliation-Reports.md](02_Tasks-71-76_Reconciliation-Reports.md) to implement reconciliation report generation with matched items, unmatched items, adjustments sections, summary totals, and PDF export functionality.

---

**Document Status:** ✅ Complete  
**Total Tasks:** 6  
**Total Lines:** ~980
