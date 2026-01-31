# Tasks 25-32: Payment Status and Verification

> **Phase:** 09 - Integrations & Sri Lanka Localizations  
> **SubPhase:** 06 - Cash on Delivery (COD)  
> **Group:** B - COD Processor Implementation  
> **Document:** 02 of 02  
> **Tasks Covered:** 25, 26, 27, 28, 29, 30, 31, 32

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-17-24_Processor-Eligibility.md](01_Tasks-17-24_Processor-Eligibility.md)

---

## Document Overview

This document covers the payment verification and status management aspects of the COD processor. It implements transaction record creation, the verify_payment method for confirming cash collection, status updates for successful and failed collections, return-to-sender handling, refund processing, valid status transitions, and comprehensive processor verification.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 25 | Create Pending COD Transaction | Medium | 25 min |
| 26 | Create verify_payment Method | Medium | 30 min |
| 27 | Create Cash Collected | Medium | 25 min |
| 28 | Create Collection Failed | Medium | 25 min |
| 29 | Create Return to Sender | Medium | 25 min |
| 30 | Create process_refund Method | Medium | 30 min |
| 31 | Create Status Transitions | Medium | 25 min |
| 32 | Verify COD Processor | Low | 20 min |

---

## Task 25: Create Pending COD Transaction

### Overview
Implement the transaction record creation that occurs when a COD payment is initiated. Unlike online payments where transactions are created and immediately processed, COD transactions begin in a PENDING state and remain so until the delivery agent confirms cash collection. This task creates the PaymentTransaction record with COD-specific metadata including fees, delivery expectations, and payment instructions.

### Dependencies
- Task 19: Create initiate_payment Method

### Instructions

1. **Prepare transaction data**
   - Extract order details from PaymentIntent
   - Include order ID, customer ID, and order amount
   - Calculate total amount (order + COD fee)
   - Gather timestamp and tenant information

2. **Create PaymentTransaction record**
   - Instantiate PaymentTransaction model
   - Set transaction ID (UUID or auto-generated)
   - Link to order via order_id foreign key
   - Link to customer via customer_id foreign key

3. **Set transaction core fields**
   - Set `status` to TransactionStatus.PENDING
   - Set `payment_type` to PaymentType.COD
   - Set `gateway_type` to PaymentGateway.COD
   - Set `amount` to order amount (base amount)
   - Set `currency` to "LKR"

4. **Set COD-specific fields**
   - Set `cod_fee` field to calculated fee from Task 24
   - Set `total_amount` to amount + cod_fee
   - Set `requires_action` to False (no customer action needed)
   - Set `redirect_url` to None (no external gateway)

5. **Add transaction metadata**
   - Store eligibility check results (pass/fail per check)
   - Store fee calculation details (type, percentage/flat)
   - Store delivery address district for reference
   - Store customer phone for delivery coordination
   - Store expected delivery timeframe

6. **Set timestamps**
   - Set `created_at` to current timestamp
   - Set `initiated_at` to current timestamp
   - Leave `completed_at` as None (not completed yet)
   - Set `expires_at` if applicable (order timeout)

7. **Initialize status tracking fields**
   - Set `collection_attempts` to 0
   - Set `last_attempt_date` to None
   - Set `collected_by` to None (agent ID when collected)
   - Set `collection_date` to None

8. **Save transaction to database**
   - Call transaction.save() to persist record
   - Handle any database errors gracefully
   - Log transaction creation
   - Return transaction object

9. **Create audit log entry**
   - Log transaction creation event
   - Include transaction ID and order ID
   - Record initiating user or system
   - Timestamp the audit entry

10. **Handle transaction creation errors**
    - Catch database integrity errors
    - Handle duplicate transaction attempts
    - Log errors with full context
    - Raise appropriate exception to caller

### Transaction Creation Flow

```
          initiate_payment Method
                   │
                   ▼
        ┌──────────────────────┐
        │ Eligibility Passed   │
        │ Fee Calculated       │
        └──────────────────────┘
                   │
                   ▼
        ┌──────────────────────┐
        │ Prepare Transaction  │
        │ Data                 │
        └──────────────────────┘
                   │
                   ▼
        ┌──────────────────────┐
        │ Create Transaction   │
        │ Record               │
        └──────────────────────┘
                   │
                   ▼
        ┌──────────────────────┐
        │ Set Core Fields      │
        │ • Status: PENDING    │
        │ • Type: COD          │
        │ • Gateway: COD       │
        └──────────────────────┘
                   │
                   ▼
        ┌──────────────────────┐
        │ Set COD Fields       │
        │ • cod_fee            │
        │ • total_amount       │
        └──────────────────────┘
                   │
                   ▼
        ┌──────────────────────┐
        │ Add Metadata         │
        │ • Eligibility data   │
        │ • Delivery info      │
        └──────────────────────┘
                   │
                   ▼
        ┌──────────────────────┐
        │ Save to Database     │
        └──────────────────────┘
                   │
                   ▼
        ┌──────────────────────┐
        │ Create Audit Log     │
        └──────────────────────┘
                   │
                   ▼
        ┌──────────────────────┐
        │ Return Transaction   │
        └──────────────────────┘
```

### PaymentTransaction Fields

| Field | Type | Value (COD) | Description |
|-------|------|-------------|-------------|
| id | UUID | Auto-generated | Transaction ID |
| order | FK | Order object | Related order |
| customer | FK | Customer object | Related customer |
| status | CharField | PENDING | Initial status |
| payment_type | CharField | COD | Payment method |
| gateway_type | CharField | COD | Gateway identifier |
| amount | Decimal | Order amount | Base order amount |
| cod_fee | Decimal | Calculated fee | COD service fee |
| total_amount | Decimal | amount + cod_fee | Total to collect |
| currency | CharField | LKR | Currency code |
| requires_action | Boolean | False | No action needed |
| redirect_url | CharField | None | No redirect |
| created_at | DateTime | Now | Creation timestamp |
| initiated_at | DateTime | Now | Initiation timestamp |
| completed_at | DateTime | None | Not completed |
| expires_at | DateTime | Order timeout | Expiration |

### COD-Specific Fields

| Field | Type | Purpose | Initial Value |
|-------|------|---------|---------------|
| cod_fee | DecimalField | Store COD fee | From Task 24 |
| collection_attempts | IntegerField | Track delivery attempts | 0 |
| last_attempt_date | DateTimeField | Last attempt timestamp | None |
| collected_by | FK (User) | Delivery agent | None |
| collection_date | DateTimeField | Collection timestamp | None |
| collection_notes | TextField | Agent notes | Empty |

### Transaction Metadata Structure

```json
{
  "eligibility_checks": {
    "zone_check": {
      "passed": true,
      "district": "Colombo",
      "zone_max": 100000
    },
    "amount_check": {
      "passed": true,
      "order_amount": 15000,
      "min_limit": 1000,
      "max_limit": 50000,
      "is_first_order": false
    },
    "history_check": {
      "passed": true,
      "is_new_customer": false,
      "risk_level": "low"
    }
  },
  "fee_details": {
    "fee_type": "PERCENTAGE",
    "fee_percentage": 5.0,
    "calculated_fee": 750.00
  },
  "delivery_info": {
    "district": "Colombo",
    "phone": "+94771234567",
    "expected_delivery_days": "3-5"
  },
  "payment_instructions": "Pay cash to delivery agent upon receiving goods"
}
```

### Transaction Status Initial State

```
┌─────────────────────────────────────────┐
│      PaymentTransaction (PENDING)       │
├─────────────────────────────────────────┤
│                                         │
│  Status: PENDING                        │
│  Payment Type: COD                      │
│  Gateway: COD                           │
│                                         │
│  Order Amount: LKR 15,000               │
│  COD Fee: LKR 750                       │
│  Total to Collect: LKR 15,750           │
│                                         │
│  Collection Attempts: 0                 │
│  Last Attempt: None                     │
│  Collected By: None                     │
│  Collection Date: None                  │
│                                         │
│  Created: 2026-01-31 10:00:00           │
│  Initiated: 2026-01-31 10:00:00         │
│  Completed: None                        │
│                                         │
└─────────────────────────────────────────┘
```

### Order State Update

| Order Field | Before Transaction | After Transaction |
|-------------|-------------------|-------------------|
| payment_status | UNPAID | PENDING |
| order_status | PENDING | CONFIRMED |
| payment_method | None | COD |
| payment_transaction | None | Transaction ID |
| total_amount | 15,000 | 15,750 (with fee) |

### Transaction Creation Validation

| Validation | Check | Error if Fails |
|------------|-------|----------------|
| Unique transaction | No duplicate for order | "Transaction exists" |
| Valid order | Order exists and valid | "Invalid order" |
| Valid customer | Customer exists | "Invalid customer" |
| Positive amount | amount > 0 | "Invalid amount" |
| Valid currency | currency == "LKR" | "Invalid currency" |
| Fee calculated | cod_fee ≥ 0 | "Fee not calculated" |

### Audit Log Entry

| Field | Value | Purpose |
|-------|-------|---------|
| event_type | "TRANSACTION_CREATED" | Event identifier |
| transaction_id | UUID | Transaction reference |
| order_id | UUID | Order reference |
| user | System/Admin | Initiator |
| timestamp | Now | Event time |
| metadata | Transaction data | Full context |

### Error Handling

| Error Condition | Action | Response |
|-----------------|--------|----------|
| Database error | Rollback, log, raise | PaymentError exception |
| Duplicate transaction | Return existing | Idempotent behavior |
| Invalid data | Validate, log, raise | ValidationError |
| Timeout | Retry once, log | Retry or fail |

### Expected Outcome
- PaymentTransaction record created with PENDING status
- All core and COD-specific fields populated correctly
- Transaction metadata includes eligibility and fee details
- Order updated to reflect COD payment initiation
- Audit log entry created for transaction creation
- Transaction object returned to caller

### Verification Checklist
- [ ] PaymentTransaction record creation implemented
- [ ] Status set to PENDING
- [ ] Payment type set to COD
- [ ] Gateway type set to COD
- [ ] Order amount and COD fee stored separately
- [ ] Total amount calculated (amount + fee)
- [ ] Currency set to LKR
- [ ] Metadata includes eligibility checks
- [ ] Metadata includes fee details
- [ ] Metadata includes delivery info
- [ ] Collection tracking fields initialized
- [ ] Timestamps set correctly
- [ ] Order state updated appropriately
- [ ] Audit log entry created
- [ ] Error handling implemented
- [ ] Transaction saved to database

---

## Task 26: Create verify_payment Method

### Overview
Implement the verify_payment method which confirms cash collection by the delivery agent. Unlike online payments that are automatically verified by gateway webhooks, COD verification requires manual confirmation from the delivery agent or system. This method updates transaction status based on collection outcome, processes order completion for successful collections, and handles failed collection scenarios.

### Dependencies
- Task 17: Create CODProcessor Class

### Instructions

1. **Define method signature**
   - Method name: `verify_payment`
   - Parameters: transaction_id (UUID), collection_data (dict)
   - Return type: PaymentResult
   - Add type hints and comprehensive docstring

2. **Retrieve transaction record**
   - Query PaymentTransaction by transaction_id
   - Verify transaction exists
   - Verify transaction is COD type
   - Verify transaction is in appropriate state for verification

3. **Extract collection data**
   - Get collection_status from data (COLLECTED, FAILED, RESCHEDULED)
   - Get collected_amount if successful
   - Get collection_agent_id
   - Get collection_timestamp
   - Get failure_reason if failed
   - Get customer_notes if any

4. **Validate collection data**
   - Ensure collection_status is valid
   - Verify collected_amount matches total_amount (if collected)
   - Validate agent_id exists in system
   - Check timestamp is reasonable (not future, not too old)

5. **Update transaction based on collection status**
   - If COLLECTED: Call Task 27 handler
   - If FAILED: Call Task 28 handler
   - If RESCHEDULED: Update attempt count, schedule retry
   - Other statuses: Handle appropriately

6. **Increment collection attempt counter**
   - Increment `collection_attempts` field
   - Update `last_attempt_date` to current timestamp
   - Track attempt history in metadata

7. **Create verification result**
   - Generate PaymentResult object
   - Set success flag based on outcome
   - Set status (SUCCESS, FAILED, PENDING)
   - Include transaction ID and order ID
   - Add metadata with collection details

8. **Update order status**
   - For COLLECTED: Mark order as PAID
   - For FAILED: Keep order in pending state
   - For RESCHEDULED: No order status change
   - Update order timestamps

9. **Send notifications**
   - Notify customer of collection result
   - For success: Send receipt and tracking
   - For failure: Inform about rescheduling
   - Notify merchant of collection status

10. **Log verification event**
    - Create audit log entry
    - Include transaction ID and outcome
    - Log agent who performed collection
    - Timestamp verification event

11. **Handle verification errors**
    - Catch invalid transaction errors
    - Handle state transition errors
    - Log all errors with context
    - Return error PaymentResult

### Payment Verification Flow

```
        Delivery Agent App/System
                   │
                   ▼
        ┌──────────────────────┐
        │ verify_payment()     │
        │ (transaction_id,     │
        │  collection_data)    │
        └──────────────────────┘
                   │
                   ▼
        ┌──────────────────────┐
        │ Retrieve Transaction │
        │ Validate State       │
        └──────────────────────┘
                   │
                   ▼
        ┌──────────────────────┐
        │ Extract & Validate   │
        │ Collection Data      │
        └──────────────────────┘
                   │
            ┌──────┴──────┬────────┐
            │             │        │
        COLLECTED      FAILED  RESCHEDULED
            │             │        │
            ▼             ▼        ▼
      ┌─────────┐  ┌─────────┐ ┌─────────┐
      │ Task 27 │  │ Task 28 │ │ Update  │
      │ Success │  │ Failed  │ │ Attempt │
      └─────────┘  └─────────┘ └─────────┘
            │             │        │
            └──────┬──────┴────────┘
                   ▼
        ┌──────────────────────┐
        │ Increment Attempts   │
        │ Update Timestamp     │
        └──────────────────────┘
                   │
                   ▼
        ┌──────────────────────┐
        │ Update Order Status  │
        └──────────────────────┘
                   │
                   ▼
        ┌──────────────────────┐
        │ Send Notifications   │
        └──────────────────────┘
                   │
                   ▼
        ┌──────────────────────┐
        │ Return PaymentResult │
        └──────────────────────┘
```

### Collection Data Structure

| Field | Type | Required | Description | Example |
|-------|------|----------|-------------|---------|
| collection_status | str | Yes | COLLECTED/FAILED/RESCHEDULED | "COLLECTED" |
| collected_amount | Decimal | For COLLECTED | Amount collected | 15750.00 |
| agent_id | UUID | Yes | Delivery agent ID | agent_123 |
| timestamp | DateTime | Yes | Collection time | 2026-02-03 14:30 |
| failure_reason | str | For FAILED | Why failed | "Customer unavailable" |
| customer_notes | str | No | Agent notes | "Customer requested..." |
| location_coords | str | No | GPS coordinates | "6.9271,79.8612" |

### Collection Status Types

| Status | Meaning | Next Action | Transaction Status |
|--------|---------|-------------|-------------------|
| COLLECTED | Cash successfully collected | Complete order | SUCCESS |
| FAILED | Delivery attempt failed | Reschedule or RTS | FAILED |
| RESCHEDULED | Customer requested reschedule | Schedule retry | PENDING |
| PARTIAL | Partial payment (rare) | Handle partial | PENDING |

### Verification Validation Rules

| Validation | Rule | Error Message |
|------------|------|---------------|
| Transaction exists | Must find by ID | "Transaction not found" |
| COD transaction | gateway_type == COD | "Not a COD transaction" |
| Valid state | Status allows verification | "Invalid transaction state" |
| Amount match | collected_amount == total_amount | "Amount mismatch" |
| Valid agent | Agent exists in system | "Invalid agent" |
| Valid timestamp | Not future, not too old | "Invalid timestamp" |

### PaymentResult for Verification

| Field | Type | Value (Collected) | Value (Failed) |
|-------|------|-------------------|----------------|
| success | bool | True | False |
| status | str | SUCCESS | FAILED |
| transaction_id | UUID | Transaction ID | Transaction ID |
| order_id | UUID | Order ID | Order ID |
| message | str | "Payment collected" | "Collection failed" |
| requires_action | bool | False | True (reschedule) |
| metadata | dict | Collection details | Failure details |

### Transaction Updates on Verification

```
Before Verification:
├── Status: PENDING
├── Collection Attempts: 1
├── Last Attempt: 2026-02-01
├── Collected By: None
└── Collection Date: None

After Successful Verification:
├── Status: SUCCESS
├── Collection Attempts: 2
├── Last Attempt: 2026-02-03
├── Collected By: agent_123
├── Collection Date: 2026-02-03 14:30
├── Collected Amount: 15,750 LKR
└── Verification Date: 2026-02-03 14:30

After Failed Verification:
├── Status: FAILED (if final attempt)
├── Status: PENDING (if retry allowed)
├── Collection Attempts: 2
├── Last Attempt: 2026-02-03
├── Collected By: None
├── Collection Date: None
├── Failure Reason: "Customer unavailable"
└── Next Retry Date: 2026-02-04
```

### Order Status Updates

| Collection Outcome | Order Status Change | Payment Status |
|--------------------|---------------------|----------------|
| COLLECTED | PROCESSING → COMPLETED | UNPAID → PAID |
| FAILED (retry) | No change | No change |
| FAILED (final) | PROCESSING → CANCELLED | UNPAID → FAILED |
| RESCHEDULED | No change | No change |

### Attempt Counter Logic

```
Attempt Counter Rules:
├── Initial: 0
├── Each attempt: +1
├── Max attempts: 3 (configurable)
│
└── After Max Attempts:
    ├── If not collected: Trigger RTS (Task 29)
    ├── Cancel order
    └── Mark transaction as RETURNED
```

### Notification Strategy

| Event | Recipient | Channel | Message |
|-------|-----------|---------|---------|
| Cash collected | Customer | SMS/Email | "Payment received. Order complete." |
| Collection failed | Customer | SMS | "We couldn't reach you. Rescheduling..." |
| Rescheduled | Customer | SMS | "Delivery rescheduled to [date]" |
| Collection success | Merchant | Dashboard | "COD collected for order #X" |
| Final failure | Merchant | Email | "Order #X - COD collection failed" |

### Audit Log for Verification

| Field | Value | Purpose |
|-------|-------|---------|
| event_type | "PAYMENT_VERIFIED" | Event identifier |
| transaction_id | UUID | Transaction reference |
| collection_status | str | Outcome |
| agent_id | UUID | Agent reference |
| timestamp | DateTime | Verification time |
| metadata | dict | Full details |

### Error Scenarios

| Error Condition | Handling | Response |
|-----------------|----------|----------|
| Transaction not found | Log, return error result | "Invalid transaction" |
| Invalid state | Don't update, return error | "Cannot verify in current state" |
| Amount mismatch | Log alert, flag for review | "Amount discrepancy detected" |
| Invalid agent | Reject verification | "Unauthorized agent" |
| Database error | Rollback, log, retry | Retry or fail |

### Expected Outcome
- Functional verify_payment method accepting collection data
- Transaction status updated based on collection outcome
- Order status updated appropriately
- Collection attempt counter incremented
- Agent and timestamp recorded
- Notifications sent to customer and merchant
- PaymentResult returned with verification details
- Comprehensive error handling

### Verification Checklist
- [ ] verify_payment method signature defined
- [ ] Transaction retrieved and validated
- [ ] Collection data extracted and validated
- [ ] Collection status handled (COLLECTED/FAILED/RESCHEDULED)
- [ ] Integration with Task 27 (cash collected)
- [ ] Integration with Task 28 (collection failed)
- [ ] Collection attempt counter incremented
- [ ] Last attempt date updated
- [ ] Agent and timestamp recorded
- [ ] Order status updated based on outcome
- [ ] Customer notification sent
- [ ] Merchant notification sent
- [ ] PaymentResult generated and returned
- [ ] Audit log created
- [ ] Error handling implemented

---

## Task 27: Create Cash Collected

### Overview
Implement the successful cash collection handler that processes transactions when the delivery agent confirms payment receipt. This handler marks the transaction as successful, updates the order to completed/paid status, records collection details, triggers fulfillment processes, and generates financial records for reconciliation. Success in COD means cash is physically in the delivery agent's possession.

### Dependencies
- Task 26: Create verify_payment Method

### Instructions

1. **Create collection success handler**
   - Method name: `handle_cash_collected`
   - Parameters: transaction (PaymentTransaction), collection_data (dict)
   - Return type: PaymentResult
   - Called by verify_payment when status is COLLECTED

2. **Update transaction to success status**
   - Set transaction.status to TransactionStatus.SUCCESS
   - Set transaction.collected_by to agent_id
   - Set transaction.collection_date to collection timestamp
   - Set transaction.collected_amount to verified amount
   - Set transaction.completed_at to current timestamp

3. **Record collection details**
   - Store collection_notes from agent
   - Store GPS coordinates if provided
   - Store any photographic evidence reference
   - Store signature capture reference (if digital)
   - Add all details to transaction metadata

4. **Update order to paid status**
   - Set order.payment_status to PaymentStatus.PAID
   - Set order.order_status to OrderStatus.COMPLETED
   - Set order.paid_at timestamp
   - Set order.completed_at timestamp
   - Trigger order completion workflow

5. **Generate payment receipt**
   - Create receipt record in database
   - Include transaction ID, order ID, amount
   - Include COD fee breakdown
   - Include collection date and agent
   - Format for customer access

6. **Update inventory if applicable**
   - If order status triggers inventory update
   - Confirm inventory deduction
   - Update stock levels
   - Log inventory movement

7. **Create financial records**
   - Record cash collection in accounting
   - Track COD fee revenue
   - Create agent settlement record
   - Flag for reconciliation with delivery service

8. **Trigger fulfillment workflows**
   - Mark items as delivered
   - Close delivery ticket
   - Archive order from active queue
   - Update delivery agent performance metrics

9. **Send success notifications**
   - SMS to customer: "Payment received. Thank you!"
   - Email receipt to customer
   - Notify merchant of successful collection
   - Update customer account transaction history

10. **Update customer COD profile**
    - Increment successful COD count
    - Update COD success rate
    - Improve customer risk profile
    - May increase future COD limits

11. **Log success event**
    - Create audit log entry
    - Log "CASH_COLLECTED" event
    - Include all transaction details
    - Timestamp and agent information

12. **Return success result**
    - Create PaymentResult with success=True
    - Include receipt ID and download link
    - Include completion timestamp
    - Return to verify_payment caller

### Cash Collection Flow

```
        verify_payment (COLLECTED)
                   │
                   ▼
        ┌──────────────────────┐
        │ handle_cash_collected│
        └──────────────────────┘
                   │
                   ▼
        ┌──────────────────────┐
        │ Update Transaction   │
        │ Status: SUCCESS      │
        │ Record Agent & Time  │
        └──────────────────────┘
                   │
                   ▼
        ┌──────────────────────┐
        │ Update Order         │
        │ Payment: PAID        │
        │ Status: COMPLETED    │
        └──────────────────────┘
                   │
                   ▼
        ┌──────────────────────┐
        │ Generate Receipt     │
        └──────────────────────┘
                   │
                   ▼
        ┌──────────────────────┐
        │ Update Inventory     │
        │ (if applicable)      │
        └──────────────────────┘
                   │
                   ▼
        ┌──────────────────────┐
        │ Create Financial     │
        │ Records              │
        └──────────────────────┘
                   │
                   ▼
        ┌──────────────────────┐
        │ Trigger Fulfillment  │
        │ Complete Delivery    │
        └──────────────────────┘
                   │
                   ▼
        ┌──────────────────────┐
        │ Send Notifications   │
        │ Customer & Merchant  │
        └──────────────────────┘
                   │
                   ▼
        ┌──────────────────────┐
        │ Update Customer      │
        │ COD Profile          │
        └──────────────────────┘
                   │
                   ▼
        ┌──────────────────────┐
        │ Return Success Result│
        └──────────────────────┘
```

### Transaction State After Collection

```
PaymentTransaction:
├── status: SUCCESS
├── collected_by: agent_123
├── collection_date: 2026-02-03 14:30:00
├── collected_amount: 15,750.00 LKR
├── completed_at: 2026-02-03 14:30:00
├── collection_attempts: 2
├── collection_notes: "Customer paid exact amount"
└── metadata:
    └── collection_details:
        ├── agent_name: "Kasun Perera"
        ├── location: "6.9271,79.8612"
        ├── signature_ref: "sig_abc123"
        └── photo_ref: "photo_xyz789"
```

### Order State After Collection

```
Order:
├── order_status: COMPLETED
├── payment_status: PAID
├── paid_at: 2026-02-03 14:30:00
├── completed_at: 2026-02-03 14:30:00
├── payment_method: COD
├── payment_transaction: txn_cod_12345
└── timeline:
    ├── Created: 2026-01-31 10:00:00
    ├── Confirmed: 2026-01-31 10:00:00
    ├── Dispatched: 2026-02-01 08:00:00
    ├── Out for Delivery: 2026-02-03 10:00:00
    └── Completed: 2026-02-03 14:30:00
```

### Payment Receipt Structure

| Field | Value | Purpose |
|-------|-------|---------|
| receipt_id | UUID | Unique receipt ID |
| order_id | UUID | Order reference |
| transaction_id | UUID | Transaction reference |
| customer | Customer object | Customer details |
| order_amount | 15,000.00 LKR | Base order value |
| cod_fee | 750.00 LKR | COD service fee |
| total_amount | 15,750.00 LKR | Total collected |
| collection_date | DateTime | Collection timestamp |
| collected_by | Agent name | Delivery agent |
| receipt_url | URL | Download link |

### Financial Records Created

```
Accounting Entry:
├── Type: CASH_RECEIPT
├── Amount: 15,750.00 LKR
├── Date: 2026-02-03
├── Category: COD_COLLECTION
├── Order: #12345
├── Agent: agent_123
└── Reconciliation Status: PENDING

Agent Settlement Record:
├── Agent: agent_123
├── Collection Date: 2026-02-03
├── Cash to Remit: 15,000.00 LKR
├── Fee Withheld: 750.00 LKR
├── Settlement Due: 15,000.00 LKR
└── Status: PENDING_REMITTANCE

Revenue Recognition:
├── COD Fee Revenue: 750.00 LKR
├── Order Revenue: 15,000.00 LKR
├── Date: 2026-02-03
└── Status: RECOGNIZED
```

### Fulfillment Workflow Triggers

| Workflow | Action | Purpose |
|----------|--------|---------|
| Delivery Complete | Mark delivery ticket closed | Close logistics |
| Inventory Confirm | Finalize stock deduction | Accounting |
| Archive Order | Move to completed orders | Cleanup |
| Agent Metrics | Update success rate | Performance |
| Customer History | Record successful COD | Trust building |

### Customer Notifications

```
SMS to Customer:
"Dear [Name], your payment of LKR 15,750 has been received. 
Your order #12345 is complete. Receipt: [link]. 
Thank you for shopping with us!"

Email Receipt:
Subject: Payment Receipt - Order #12345

Dear [Name],

We confirm receipt of your Cash on Delivery payment.

Order Number: #12345
Payment Amount: LKR 15,000.00
COD Fee: LKR 750.00
Total Paid: LKR 15,750.00
Collection Date: Feb 3, 2026, 2:30 PM
Collected By: Kasun Perera

Download Receipt: [link]

Thank you for your business!
```

### Merchant Notifications

| Notification | Channel | Content |
|--------------|---------|---------|
| Dashboard Alert | Web | "COD collected for Order #12345" |
| Email Summary | Email | Daily COD collection report |
| Analytics Update | System | Update COD metrics |

### Customer Profile Update

```
Customer COD Profile:
├── total_cod_orders: 6 (+1)
├── successful_cod_orders: 6 (+1)
├── failed_cod_orders: 0
├── cod_success_rate: 100%
├── last_successful_cod: 2026-02-03
├── risk_level: LOW
└── cod_limit: 50,000 LKR (may increase)
```

### Inventory Update Logic

| Scenario | Inventory Action | Reason |
|----------|------------------|--------|
| Stock reserved on order | Confirm deduction | Finalize reservation |
| Stock deducted on dispatch | No action | Already handled |
| Pre-order item | Update delivery status | Track fulfillment |
| Backorder item | No inventory change | Stock wasn't deducted |

### Audit Log Entry

```
Audit Log:
├── event_type: CASH_COLLECTED
├── event_timestamp: 2026-02-03 14:30:00
├── transaction_id: txn_cod_12345
├── order_id: order_12345
├── agent_id: agent_123
├── collected_amount: 15,750.00
├── collection_location: "6.9271,79.8612"
└── metadata:
    └── Full collection details
```

### Success Metrics to Track

| Metric | Value | Purpose |
|--------|-------|---------|
| Collection time | 14:30:00 | Analyze delivery times |
| Attempts before success | 2 | Optimize routing |
| Order value | 15,000 | Revenue tracking |
| COD fee collected | 750 | Fee revenue |
| Agent performance | +1 success | Agent metrics |
| District success | Colombo | Zone analysis |

### Expected Outcome
- Transaction marked as successful with complete collection details
- Order updated to PAID and COMPLETED status
- Payment receipt generated and accessible
- Financial records created for reconciliation
- Customer notified with receipt
- Customer COD profile updated positively
- Agent settlement record created
- Fulfillment workflows triggered
- Comprehensive audit trail

### Verification Checklist
- [ ] handle_cash_collected method created
- [ ] Transaction status updated to SUCCESS
- [ ] Agent ID and collection timestamp recorded
- [ ] Collected amount recorded
- [ ] Collection notes and metadata stored
- [ ] Order payment_status set to PAID
- [ ] Order order_status set to COMPLETED
- [ ] Payment receipt generated
- [ ] Financial records created (accounting, settlement)
- [ ] Customer notification sent (SMS, email)
- [ ] Merchant notification sent
- [ ] Customer COD profile updated
- [ ] Inventory updated if applicable
- [ ] Fulfillment workflows triggered
- [ ] Audit log entry created
- [ ] PaymentResult returned with success

---

## Task 28: Create Collection Failed

### Overview
Implement the collection failure handler that processes transactions when the delivery agent cannot collect cash payment. This handler determines whether the delivery should be reattempted or if the order should proceed to return-to-sender (RTS), updates transaction status appropriately, schedules rescheduling, tracks failure reasons for analytics, and manages customer communication about failed collections.

### Dependencies
- Task 26: Create verify_payment Method

### Instructions

1. **Create collection failure handler**
   - Method name: `handle_collection_failed`
   - Parameters: transaction (PaymentTransaction), failure_data (dict)
   - Return type: PaymentResult
   - Called by verify_payment when status is FAILED

2. **Extract failure information**
   - Get failure_reason from failure_data
   - Get failure_timestamp
   - Get agent_id who attempted delivery
   - Get customer_notes if customer was contacted
   - Get next_attempt_preference if customer wants reschedule

3. **Classify failure reason**
   - Customer unavailable / not home
   - Customer refused delivery
   - Customer has no cash / insufficient funds
   - Address incorrect / cannot locate
   - Customer requested reschedule
   - Security concerns
   - Other reasons

4. **Check collection attempt count**
   - Get current collection_attempts from transaction
   - Check against maximum_attempts configuration (e.g., 3)
   - Determine if retry is allowed
   - Decide between reschedule or RTS

5. **Handle reattempt scenario**
   - If attempts < max_attempts
   - Set transaction.status to PENDING (keep pending)
   - Increment collection_attempts counter
   - Schedule next delivery attempt
   - Calculate next_attempt_date (e.g., +1 day)
   - Store failure reason in transaction metadata

6. **Handle final failure scenario**
   - If attempts >= max_attempts
   - Set transaction.status to FAILED
   - Trigger return-to-sender process (Task 29)
   - Update order status appropriately
   - Record final failure reason

7. **Update transaction fields**
   - Increment collection_attempts
   - Set last_attempt_date to failure timestamp
   - Set last_failure_reason
   - Add failure to attempts_history in metadata
   - Keep collected_by as None

8. **Schedule next delivery attempt**
   - Calculate next_attempt_date based on rules
   - Same-day retry for minor issues (customer coming soon)
   - Next-day retry for unavailable customer
   - 2-3 day delay for insufficient cash
   - Update delivery schedule in logistics system

9. **Update order status for retry**
   - Keep order.payment_status as PENDING
   - Keep order.order_status as PROCESSING or OUT_FOR_DELIVERY
   - Add note to order: "Delivery reattempt scheduled"
   - Update order timeline

10. **Send failure notifications**
    - SMS to customer: "We couldn't reach you. Rescheduling..."
    - Include next attempt date if scheduled
    - Provide contact number for customer to call
    - Email with failure reason (if appropriate)
    - Notify merchant of failed attempt

11. **Log failure event**
    - Create audit log entry
    - Log "COLLECTION_FAILED" event
    - Include failure reason and agent details
    - Track failure patterns for analysis

12. **Return failure result**
    - Create PaymentResult with success=False
    - Set status to PENDING (if retry) or FAILED (if final)
    - Include next attempt date if scheduled
    - Include failure reason in metadata
    - Return to verify_payment caller

### Collection Failure Flow

```
        verify_payment (FAILED)
                   │
                   ▼
        ┌──────────────────────┐
        │ handle_collection_   │
        │      failed          │
        └──────────────────────┘
                   │
                   ▼
        ┌──────────────────────┐
        │ Extract Failure Info │
        │ Classify Reason      │
        └──────────────────────┘
                   │
                   ▼
        ┌──────────────────────┐
        │ Check Attempt Count  │
        │ attempts < max?      │
        └──────────────────────┘
              │           │
             Yes         No
              │           │
              ▼           ▼
     ┌──────────┐   ┌──────────┐
     │ Retry    │   │ Final    │
     │ Allowed  │   │ Failure  │
     └──────────┘   └──────────┘
              │           │
              ▼           ▼
     ┌──────────┐   ┌──────────┐
     │ Status:  │   │ Status:  │
     │ PENDING  │   │ FAILED   │
     └──────────┘   └──────────┘
              │           │
              ▼           ▼
     ┌──────────┐   ┌──────────┐
     │ Schedule │   │ Trigger  │
     │ Next Try │   │ RTS (T29)│
     └──────────┘   └──────────┘
              │           │
              └─────┬─────┘
                    ▼
        ┌──────────────────────┐
        │ Update Transaction   │
        │ Increment Attempts   │
        └──────────────────────┘
                    │
                    ▼
        ┌──────────────────────┐
        │ Send Notifications   │
        └──────────────────────┘
                    │
                    ▼
        ┌──────────────────────┐
        │ Return PaymentResult │
        └──────────────────────┘
```

### Failure Reason Classification

| Reason Code | Description | Retry Strategy | Next Attempt |
|-------------|-------------|----------------|--------------|
| CUSTOMER_UNAVAILABLE | Customer not home | Retry | +1 day |
| CUSTOMER_REFUSED | Customer refused delivery | Final failure | RTS |
| INSUFFICIENT_CASH | Customer has no cash | Retry with notice | +2 days |
| ADDRESS_INCORRECT | Cannot find address | Contact customer | +1 day |
| CUSTOMER_RESCHEDULE | Customer requested later | Retry | Customer choice |
| SECURITY_CONCERN | Unsafe delivery area | Review, possible RTS | Admin decision |
| PHONE_UNREACHABLE | Cannot contact customer | Retry | +1 day |
| OTHER | Other reason | Retry | +1 day |

### Maximum Attempts Configuration

| Parameter | Default Value | Description |
|-----------|---------------|-------------|
| max_collection_attempts | 3 | Maximum delivery attempts |
| retry_interval_days | 1 | Days between retries |
| customer_reschedule_limit | 2 | Max customer reschedules |
| same_day_retry_allowed | True | Allow same-day retry |

### Transaction State After Failed Attempt (Retry)

```
PaymentTransaction:
├── status: PENDING (still pending)
├── collection_attempts: 2 (incremented)
├── last_attempt_date: 2026-02-03 14:00:00
├── last_failure_reason: "CUSTOMER_UNAVAILABLE"
├── next_attempt_date: 2026-02-04 10:00:00
├── collected_by: None
├── collection_date: None
└── metadata:
    └── attempts_history: [
        {
          "attempt": 1,
          "date": "2026-02-02 11:00:00",
          "result": "FAILED",
          "reason": "ADDRESS_INCORRECT",
          "agent": "agent_456"
        },
        {
          "attempt": 2,
          "date": "2026-02-03 14:00:00",
          "result": "FAILED",
          "reason": "CUSTOMER_UNAVAILABLE",
          "agent": "agent_123"
        }
      ]
```

### Transaction State After Final Failure

```
PaymentTransaction:
├── status: FAILED (final failure)
├── collection_attempts: 3 (max reached)
├── last_attempt_date: 2026-02-05 15:00:00
├── last_failure_reason: "CUSTOMER_UNAVAILABLE"
├── next_attempt_date: None
├── return_to_sender_triggered: True
├── rts_initiated_at: 2026-02-05 15:30:00
└── metadata:
    └── final_failure: True
```

### Retry Scheduling Logic

```
Retry Scheduling Rules:
├── Attempt 1 Failed:
│   ├── Reason: CUSTOMER_UNAVAILABLE
│   └── Next Attempt: Tomorrow (same time)
│
├── Attempt 2 Failed:
│   ├── Reason: INSUFFICIENT_CASH
│   └── Next Attempt: 2 days later
│
└── Attempt 3 Failed:
    ├── Max attempts reached
    └── Action: Trigger RTS (Task 29)
```

### Failure Reason Priority

| Priority | Reason | Action |
|----------|--------|--------|
| 1 (Low) | Customer unavailable | Retry tomorrow |
| 2 (Medium) | Insufficient cash | Retry with notice |
| 3 (High) | Customer refused | Consider RTS |
| 4 (Critical) | Address incorrect | Contact customer first |
| 5 (Immediate) | Security concern | Do not retry |

### Customer Notifications for Failure

```
SMS (First Attempt Failed):
"Hi [Name], we tried to deliver your order #12345 today but 
couldn't reach you. We'll try again tomorrow. Please be available 
or call us at [phone] to reschedule. Thank you!"

SMS (Second Attempt Failed):
"Hi [Name], this is our 2nd delivery attempt for order #12345. 
Please be available tomorrow or your order may be returned. 
Contact [phone] to confirm. Thank you!"

SMS (Final Failure):
"Hi [Name], we couldn't deliver your order #12345 after 3 attempts. 
Your order is being returned. Please contact support at [phone]. 
Sorry for the inconvenience."
```

### Order State Updates

| Attempt Status | Order Status | Payment Status | Notes |
|----------------|--------------|----------------|-------|
| Retry allowed | PROCESSING | PENDING | Keep active |
| Final failure | CANCELLED | FAILED | Trigger RTS |

### Failure Analytics Tracking

| Metric | Purpose | Use Case |
|--------|---------|----------|
| Failure reason frequency | Identify patterns | Improve process |
| Failure by district | Geographic analysis | Zone restrictions |
| Failure by time of day | Optimize delivery times | Scheduling |
| Agent failure rate | Performance tracking | Training needs |
| Customer repeat failures | Risk assessment | Blacklist consideration |

### Merchant Notifications

| Event | Notification | Action |
|-------|--------------|--------|
| First failure | Dashboard note | Info only |
| Second failure | Email alert | Review order |
| Final failure | Email + SMS | Order returning |

### Next Attempt Date Calculation

```python
def calculate_next_attempt(failure_reason, attempt_number):
    if failure_reason == "CUSTOMER_UNAVAILABLE":
        return today + 1 day
    elif failure_reason == "INSUFFICIENT_CASH":
        return today + 2 days
    elif failure_reason == "CUSTOMER_RESCHEDULE":
        return customer_preferred_date
    elif failure_reason == "ADDRESS_INCORRECT":
        return today + 1 day (after correction)
    else:
        return today + 1 day (default)
```

### Audit Log Entry

```
Audit Log:
├── event_type: COLLECTION_FAILED
├── event_timestamp: 2026-02-03 14:00:00
├── transaction_id: txn_cod_12345
├── order_id: order_12345
├── agent_id: agent_123
├── attempt_number: 2
├── failure_reason: CUSTOMER_UNAVAILABLE
├── next_attempt_date: 2026-02-04 10:00:00
└── metadata:
    └── Full failure details
```

### Expected Outcome
- Collection failure processed with appropriate status
- Retry scheduled if attempts remain
- Return-to-sender triggered if max attempts reached
- Transaction attempt counter incremented
- Failure reason recorded for analytics
- Customer notified about failure and next steps
- Merchant informed of failure status
- Comprehensive audit trail

### Verification Checklist
- [ ] handle_collection_failed method created
- [ ] Failure information extracted from failure_data
- [ ] Failure reason classified
- [ ] Collection attempt count checked
- [ ] Retry vs. final failure logic implemented
- [ ] Transaction status updated (PENDING for retry, FAILED for final)
- [ ] collection_attempts incremented
- [ ] last_attempt_date updated
- [ ] last_failure_reason stored
- [ ] Failure added to attempts_history metadata
- [ ] Next attempt date calculated and scheduled
- [ ] RTS triggered if max attempts reached (Task 29)
- [ ] Customer notification sent
- [ ] Merchant notification sent
- [ ] Audit log entry created
- [ ] PaymentResult returned with failure details

---

## Task 29: Create Return to Sender

### Overview
Implement the return-to-sender (RTS) process that handles orders when all collection attempts have been exhausted without success. RTS marks the end of the COD payment lifecycle, cancels the order, restocks inventory, processes any applicable fees, updates customer records to reflect the failure, and coordinates logistics for product return. This is the final step for failed COD orders.

### Dependencies
- Task 28: Create Collection Failed

### Instructions

1. **Create RTS handler method**
   - Method name: `trigger_return_to_sender`
   - Parameters: transaction (PaymentTransaction)
   - Return type: RTSResult (custom result object)
   - Called automatically when max attempts reached

2. **Verify RTS eligibility**
   - Check transaction status is FAILED
   - Verify collection_attempts >= max_attempts
   - Ensure RTS not already triggered
   - Validate order is still in valid state for RTS

3. **Update transaction for RTS**
   - Set transaction.status to TransactionStatus.RETURNED
   - Set transaction.rts_initiated_at timestamp
   - Set transaction.rts_reason (usually "MAX_ATTEMPTS_EXCEEDED")
   - Mark completed_at with RTS timestamp
   - Set requires_action to False (no more actions)

4. **Cancel and restock order**
   - Set order.order_status to OrderStatus.CANCELLED
   - Set order.cancellation_reason to "COD_COLLECTION_FAILED"
   - Set order.cancelled_at timestamp
   - Trigger inventory restock for all order items
   - Release any reservations or allocations

5. **Calculate and apply cancellation fees**
   - Check if COD cancellation fee is configured
   - Calculate fee (may be partial COD fee or restocking fee)
   - Create fee record (may be waived)
   - Store in transaction metadata

6. **Update customer COD profile**
   - Increment failed_cod_orders counter
   - Update cod_success_rate (decrease)
   - Increase risk_level (e.g., LOW → MEDIUM)
   - May reduce future COD limits
   - Check if blacklist threshold reached

7. **Check blacklist threshold**
   - Count total failed COD orders
   - If >= blacklist_threshold (e.g., 5), blacklist customer
   - Create CustomerBlacklist record
   - Set blacklist_reason to "EXCESSIVE_COD_FAILURES"
   - Prevent future COD orders

8. **Coordinate logistics return**
   - Create return shipment record
   - Assign to delivery agent or courier
   - Generate return tracking number
   - Schedule pickup from delivery agent
   - Update logistics system

9. **Notify customer of RTS**
   - SMS: Order cancelled and returning
   - Email: Detailed explanation and any fees
   - Apologize for inconvenience
   - Offer alternative payment methods for reorder

10. **Notify merchant of RTS**
    - Dashboard alert: Order returned
    - Email report with RTS details
    - Include order value and lost revenue
    - Update RTS analytics

11. **Create financial records**
    - Record lost sale in accounting
    - Record any RTS fees charged
    - Update agent settlement (no remittance needed)
    - Track RTS costs for analysis

12. **Log RTS event**
    - Create comprehensive audit log
    - Log "RETURN_TO_SENDER" event
    - Include all attempt history
    - Include failure reasons
    - Timestamp RTS initiation

13. **Return RTS result**
    - Create RTSResult object
    - Include transaction ID and order ID
    - Include RTS tracking information
    - Return to caller

### Return to Sender Flow

```
      Max Collection Attempts Reached
                   │
                   ▼
        ┌──────────────────────┐
        │ trigger_return_to_   │
        │      sender          │
        └──────────────────────┘
                   │
                   ▼
        ┌──────────────────────┐
        │ Verify RTS Eligible  │
        └──────────────────────┘
                   │
                   ▼
        ┌──────────────────────┐
        │ Update Transaction   │
        │ Status: RETURNED     │
        └──────────────────────┘
                   │
                   ▼
        ┌──────────────────────┐
        │ Cancel Order         │
        │ Restock Inventory    │
        └──────────────────────┘
                   │
                   ▼
        ┌──────────────────────┐
        │ Calculate Fees       │
        │ (if applicable)      │
        └──────────────────────┘
                   │
                   ▼
        ┌──────────────────────┐
        │ Update Customer      │
        │ COD Profile          │
        └──────────────────────┘
                   │
                   ▼
        ┌──────────────────────┐
        │ Check Blacklist      │
        │ Threshold            │
        └──────────────────────┘
              │           │
    Threshold Reached  Not Reached
              │           │
              ▼           │
      ┌──────────┐       │
      │Blacklist │       │
      │Customer  │       │
      └──────────┘       │
              │           │
              └─────┬─────┘
                    ▼
        ┌──────────────────────┐
        │ Coordinate Logistics │
        │ Return               │
        └──────────────────────┘
                    │
                    ▼
        ┌──────────────────────┐
        │ Notify Customer      │
        │ & Merchant           │
        └──────────────────────┘
                    │
                    ▼
        ┌──────────────────────┐
        │ Create Financial     │
        │ Records              │
        └──────────────────────┘
                    │
                    ▼
        ┌──────────────────────┐
        │ Log RTS Event        │
        └──────────────────────┘
                    │
                    ▼
        ┌──────────────────────┐
        │ Return RTSResult     │
        └──────────────────────┘
```

### Transaction State After RTS

```
PaymentTransaction:
├── status: RETURNED
├── collection_attempts: 3 (max)
├── last_attempt_date: 2026-02-05 15:00:00
├── rts_initiated_at: 2026-02-05 15:30:00
├── rts_reason: "MAX_ATTEMPTS_EXCEEDED"
├── completed_at: 2026-02-05 15:30:00
├── return_tracking_number: "RTS-12345"
└── metadata:
    └── rts_details:
        ├── total_attempts: 3
        ├── failure_reasons: ["UNAVAILABLE", "UNAVAILABLE", "NO_CASH"]
        ├── rts_fee: 0.00 (waived)
        └── inventory_restocked: True
```

### Order State After RTS

```
Order:
├── order_status: CANCELLED
├── payment_status: FAILED
├── cancellation_reason: "COD_COLLECTION_FAILED"
├── cancelled_at: 2026-02-05 15:30:00
├── payment_method: COD
└── timeline:
    ├── Created: 2026-01-31 10:00:00
    ├── Confirmed: 2026-01-31 10:00:00
    ├── Dispatched: 2026-02-01 08:00:00
    ├── Delivery Attempt 1: 2026-02-02 11:00:00 (Failed)
    ├── Delivery Attempt 2: 2026-02-03 14:00:00 (Failed)
    ├── Delivery Attempt 3: 2026-02-05 15:00:00 (Failed)
    └── RTS Initiated: 2026-02-05 15:30:00
```

### Inventory Restock

| Item | Quantity Ordered | Status Before | Status After | Location |
|------|------------------|---------------|--------------|----------|
| Product A | 2 | Reserved | Available | Warehouse |
| Product B | 1 | Reserved | Available | Warehouse |
| Product C | 3 | Reserved | Available | Warehouse |

### RTS Fee Configuration

| Fee Type | Default | When Applied | Purpose |
|----------|---------|--------------|---------|
| No Fee | 0 LKR | Standard policy | Customer goodwill |
| Partial COD Fee | 50% of COD fee | High-value orders | Recover costs |
| Full COD Fee | 100% of COD fee | Repeat failures | Discourage abuse |
| Restocking Fee | Fixed amount | Large items | Cover handling |

### Customer Profile Update After RTS

```
Before RTS:
├── total_cod_orders: 5
├── successful_cod_orders: 4
├── failed_cod_orders: 0
├── cod_success_rate: 100%
└── risk_level: LOW

After RTS:
├── total_cod_orders: 6
├── successful_cod_orders: 4
├── failed_cod_orders: 1
├── cod_success_rate: 80%
├── risk_level: MEDIUM
└── cod_limit: Reduced to 30,000 LKR
```

### Blacklist Trigger

```
Blacklist Threshold Check:
├── Current failed_cod_orders: 5
├── Blacklist threshold: 5
├── Result: THRESHOLD REACHED
│
└── Action: Create Blacklist Entry
    ├── customer_id: customer_123
    ├── blacklist_reason: "EXCESSIVE_COD_FAILURES"
    ├── blacklisted_at: 2026-02-05 15:30:00
    ├── blacklist_type: COD_ONLY
    ├── can_appeal: True
    └── review_date: 2026-05-05 (90 days)
```

### Customer Notifications for RTS

```
SMS:
"Hi [Name], we couldn't deliver your order #12345 after 3 attempts. 
Your order has been cancelled and is being returned. 
No payment was collected. To reorder, please use online payment. 
Contact [phone] for questions. Sorry for the inconvenience."

Email:
Subject: Order #12345 Cancelled - Return to Sender

Dear [Name],

We're sorry to inform you that we were unable to deliver your order 
#12345 after multiple delivery attempts:

Attempt 1: Feb 2 - Customer unavailable
Attempt 2: Feb 3 - Customer unavailable
Attempt 3: Feb 5 - Customer had insufficient cash

Your order has been cancelled and the items are being returned to 
our warehouse. No payment was collected from you.

Order Details:
- Order Number: #12345
- Order Value: LKR 15,000
- COD Fee: LKR 750 (waived)
- Cancellation Fee: LKR 0

If you'd still like these items, please place a new order using an 
online payment method for faster processing.

We apologize for any inconvenience caused.

Best regards,
[Store Name]
```

### Merchant Notifications

| Notification | Content | Purpose |
|--------------|---------|---------|
| Dashboard Alert | "Order #12345 returned - COD failed" | Immediate awareness |
| Email Report | Daily RTS summary | Management review |
| Analytics Update | RTS metrics updated | Business intelligence |

### Financial Records for RTS

```
Lost Sale Record:
├── order_id: #12345
├── order_value: 15,000 LKR
├── potential_revenue: 750 LKR (COD fee)
├── actual_revenue: 0 LKR
├── rts_costs: 500 LKR (logistics)
├── net_impact: -500 LKR
└── date: 2026-02-05

RTS Cost Tracking:
├── delivery_attempts_cost: 3 × 150 LKR = 450 LKR
├── return_shipping_cost: 200 LKR
├── handling_cost: 100 LKR
├── total_rts_cost: 750 LKR
└── category: OPERATIONAL_LOSS
```

### Logistics Return Coordination

| Step | Action | Responsible | Timeline |
|------|--------|-------------|----------|
| 1. Create Return | Generate RTS ticket | System | Immediate |
| 2. Notify Agent | Alert delivery agent | System | 5 minutes |
| 3. Schedule Pickup | Agent pickup from location | Agent | Same day |
| 4. Return Transit | Ship back to warehouse | Courier | 1-2 days |
| 5. Warehouse Receipt | Receive and inspect | Warehouse | On arrival |
| 6. Restock | Return to inventory | Warehouse | Same day |

### RTSResult Structure

| Field | Type | Value | Description |
|-------|------|-------|-------------|
| success | bool | True | RTS initiated successfully |
| transaction_id | UUID | Transaction ID | Transaction reference |
| order_id | UUID | Order ID | Order reference |
| rts_tracking | str | "RTS-12345" | Return tracking number |
| rts_initiated_at | DateTime | Timestamp | RTS start time |
| expected_return_date | Date | Estimated date | Expected at warehouse |
| inventory_restocked | bool | True/False | Immediate or pending |
| customer_blacklisted | bool | True/False | Blacklist triggered |
| rts_fee_charged | Decimal | Fee amount | Any fee charged |

### Audit Log Entry

```
Audit Log:
├── event_type: RETURN_TO_SENDER
├── event_timestamp: 2026-02-05 15:30:00
├── transaction_id: txn_cod_12345
├── order_id: order_12345
├── rts_reason: MAX_ATTEMPTS_EXCEEDED
├── collection_attempts: 3
├── attempt_history: [...]
├── inventory_restocked: True
├── customer_blacklisted: False
└── metadata:
    └── Complete RTS details
```

### Expected Outcome
- Transaction marked as RETURNED with RTS details
- Order cancelled and inventory restocked
- Customer COD profile updated negatively
- Blacklist checked and applied if threshold reached
- Logistics return coordinated with tracking
- Customer and merchant notified of RTS
- Financial records created for lost sale
- Comprehensive audit trail of entire COD lifecycle

### Verification Checklist
- [ ] trigger_return_to_sender method created
- [ ] RTS eligibility verified
- [ ] Transaction status set to RETURNED
- [ ] RTS timestamps and reason recorded
- [ ] Order status set to CANCELLED
- [ ] Inventory restocked for all items
- [ ] Cancellation fee calculated (if applicable)
- [ ] Customer COD profile updated (failed count, success rate)
- [ ] Blacklist threshold checked
- [ ] Customer blacklisted if threshold reached
- [ ] Logistics return coordinated
- [ ] Return tracking number generated
- [ ] Customer notification sent (SMS, email)
- [ ] Merchant notification sent
- [ ] Financial records created (lost sale, RTS costs)
- [ ] Audit log entry created
- [ ] RTSResult returned with complete details

---

## Task 30: Create process_refund Method

### Overview
Implement the refund processing method for COD transactions. While refunds are rare in COD scenarios (since payment hasn't occurred if cash wasn't collected), they may be necessary for post-delivery issues like defective products, customer returns, or duplicate charges. This method handles the manual refund process, creates refund records, updates transaction status, and coordinates cash return to customers.

### Dependencies
- Task 17: Create CODProcessor Class

### Instructions

1. **Define method signature**
   - Method name: `process_refund`
   - Parameters: transaction_id (UUID), refund_amount (Decimal), refund_reason (str)
   - Return type: RefundResult
   - Override from PaymentProcessor ABC

2. **Retrieve and validate transaction**
   - Query PaymentTransaction by transaction_id
   - Verify transaction is COD type
   - Verify transaction status is SUCCESS (payment collected)
   - Verify transaction not already refunded
   - Check refund_amount <= original collected_amount

3. **Determine refund type**
   - Full refund: refund_amount == collected_amount
   - Partial refund: refund_amount < collected_amount
   - Store refund type in refund record

4. **Create refund record**
   - Create PaymentRefund model instance
   - Link to original transaction
   - Set refund amount
   - Set refund reason
   - Set refund_type (FULL or PARTIAL)
   - Set refund_method (manual cash return)
   - Set initiated_at timestamp
   - Set status to PENDING

5. **Update transaction status**
   - If full refund: Set transaction.status to REFUNDED
   - If partial refund: Set transaction.status to PARTIALLY_REFUNDED
   - Update transaction.refunded_amount field
   - Add refund reference to transaction metadata

6. **Create manual refund workflow**
   - COD refunds are manual (cash to be returned)
   - Create task for finance team
   - Set refund_method to "MANUAL_CASH"
   - Assign to customer service for coordination
   - Store in workflow system

7. **Calculate refund breakdown**
   - Determine if COD fee is refunded
   - Policy: Refund order amount, may retain COD fee
   - Or: Refund total including COD fee for full refund
   - Calculate net refund amount

8. **Update order status**
   - Set order.refund_status to REFUND_PENDING or REFUNDED
   - Add refund note to order
   - Update order financial totals
   - Trigger return/exchange workflow if applicable

9. **Create financial records**
   - Record refund in accounting system
   - Debit revenue accounts
   - Create liability (cash owed to customer)
   - Update merchant balance

10. **Notify customer of refund**
    - SMS: Refund approved, cash return details
    - Email: Detailed refund information
    - Provide contact for refund collection
    - Estimated refund timeline

11. **Notify merchant of refund**
    - Dashboard alert: Refund requested
    - Email: Refund details and action needed
    - Update refund analytics

12. **Log refund event**
    - Create audit log entry
    - Log "REFUND_INITIATED" event
    - Include refund amount and reason
    - Timestamp refund request

13. **Return refund result**
    - Create RefundResult object
    - Include refund_id and status
    - Include refund method and timeline
    - Return to caller

### Refund Process Flow

```
       Customer Requests Refund
                   │
                   ▼
        ┌──────────────────────┐
        │ process_refund()     │
        └──────────────────────┘
                   │
                   ▼
        ┌──────────────────────┐
        │ Retrieve Transaction │
        │ Validate for Refund  │
        └──────────────────────┘
                   │
                   ▼
        ┌──────────────────────┐
        │ Determine Refund Type│
        │ Full or Partial      │
        └──────────────────────┘
                   │
                   ▼
        ┌──────────────────────┐
        │ Create Refund Record │
        │ Status: PENDING      │
        └──────────────────────┘
                   │
                   ▼
        ┌──────────────────────┐
        │ Update Transaction   │
        │ Status: REFUNDED     │
        └──────────────────────┘
                   │
                   ▼
        ┌──────────────────────┐
        │ Calculate Breakdown  │
        │ Amount + Fee?        │
        └──────────────────────┘
                   │
                   ▼
        ┌──────────────────────┐
        │ Create Manual Refund │
        │ Workflow             │
        └──────────────────────┘
                   │
                   ▼
        ┌──────────────────────┐
        │ Update Order         │
        │ Refund Status        │
        └──────────────────────┘
                   │
                   ▼
        ┌──────────────────────┐
        │ Create Financial     │
        │ Records              │
        └──────────────────────┘
                   │
                   ▼
        ┌──────────────────────┐
        │ Notify Customer      │
        │ & Merchant           │
        └──────────────────────┘
                   │
                   ▼
        ┌──────────────────────┐
        │ Return RefundResult  │
        └──────────────────────┘
```

### COD Refund Scenarios

| Scenario | Reason | Refund Amount | Timeline |
|----------|--------|---------------|----------|
| Defective Product | Product damaged/faulty | Full + COD fee | 7-14 days |
| Wrong Item Delivered | Fulfillment error | Full + COD fee | 7-14 days |
| Customer Return | Change of mind | Order amount only | 14-30 days |
| Partial Return | Return some items | Prorated amount | 14-30 days |
| Double Payment | System error | Duplicate amount | 3-7 days |
| Service Issue | Poor service | Goodwill refund | 7-14 days |

### Refund Validation Rules

| Validation | Check | Error if Fails |
|------------|-------|----------------|
| Transaction exists | Find by ID | "Transaction not found" |
| COD transaction | gateway_type == COD | "Not a COD transaction" |
| Payment collected | status == SUCCESS | "No payment to refund" |
| Not already refunded | status != REFUNDED | "Already refunded" |
| Valid amount | 0 < amount <= collected | "Invalid refund amount" |
| Refund window | Within policy period | "Refund window expired" |

### PaymentRefund Model Fields

| Field | Type | Value | Description |
|-------|------|-------|-------------|
| id | UUID | Auto-generated | Refund ID |
| transaction | FK | Original transaction | Link to payment |
| refund_amount | Decimal | Amount to refund | Refund value |
| refund_reason | TextField | Customer reason | Why refunding |
| refund_type | CharField | FULL/PARTIAL | Type of refund |
| refund_method | CharField | MANUAL_CASH | How refunded |
| status | CharField | PENDING | Refund status |
| initiated_at | DateTime | Now | Request time |
| processed_at | DateTime | None | Completion time |
| processed_by | FK (User) | None | Staff who processed |
| customer_notified | Boolean | False | Notification sent |

### Refund Amount Calculation

```
Original Transaction:
├── Order Amount: 15,000 LKR
├── COD Fee: 750 LKR
└── Total Collected: 15,750 LKR

Full Refund (Defective Product):
├── Refund Amount: 15,750 LKR
├── Includes COD Fee: Yes
└── Customer Receives: 15,750 LKR

Partial Refund (Return 1 of 3 items):
├── Item Value: 5,000 LKR
├── Prorated COD Fee: 250 LKR
├── Refund Amount: 5,250 LKR
└── Customer Receives: 5,250 LKR

Return Refund (Change of Mind):
├── Refund Amount: 15,000 LKR
├── COD Fee: Not refunded (policy)
└── Customer Receives: 15,000 LKR
```

### Transaction State After Refund

```
PaymentTransaction (Full Refund):
├── status: REFUNDED
├── original_amount: 15,000 LKR
├── cod_fee: 750 LKR
├── collected_amount: 15,750 LKR
├── refunded_amount: 15,750 LKR
├── net_amount: 0 LKR
└── metadata:
    └── refund_details:
        ├── refund_id: refund_123
        ├── refund_reason: "Defective product"
        ├── refund_type: "FULL"
        ├── refunded_at: 2026-02-10
        └── refund_method: "MANUAL_CASH"

PaymentTransaction (Partial Refund):
├── status: PARTIALLY_REFUNDED
├── collected_amount: 15,750 LKR
├── refunded_amount: 5,250 LKR
├── net_amount: 10,500 LKR
└── refund_references: [refund_123]
```

### Manual Refund Workflow

| Step | Action | Responsible | Timeline |
|------|--------|-------------|----------|
| 1. Request | Customer requests refund | Customer | Day 0 |
| 2. Review | Review refund eligibility | CS Team | Day 1 |
| 3. Approve | Approve refund | Manager | Day 2 |
| 4. Coordinate | Contact customer for details | CS Team | Day 3 |
| 5. Disburse | Arrange cash return | Finance | Day 7 |
| 6. Confirm | Customer confirms receipt | Customer | Day 7 |
| 7. Close | Mark refund complete | System | Day 7 |

### Refund Methods for COD

| Method | Description | Timeline | Preference |
|--------|-------------|----------|------------|
| Cash Return | Agent returns cash | 7-14 days | High |
| Bank Transfer | Transfer to account | 3-7 days | Medium |
| Store Credit | Credit for future purchase | Immediate | Low |
| Delivery Agent | Collect from customer | Same day | Low (logistics) |

### Order State After Refund

```
Order:
├── order_status: COMPLETED (or RETURNED)
├── payment_status: REFUNDED
├── refund_status: REFUNDED
├── refund_amount: 15,750 LKR
├── refunded_at: 2026-02-10
└── refund_reason: "Defective product"
```

### Customer Notifications

```
SMS:
"Your refund of LKR 15,750 for order #12345 has been approved. 
Our team will contact you within 2 days to arrange cash return. 
Thank you!"

Email:
Subject: Refund Approved - Order #12345

Dear [Name],

Your refund request has been approved.

Order Number: #12345
Refund Amount: LKR 15,750
Refund Reason: Defective product
Refund Method: Cash return

Our customer service team will contact you within 2 business days 
to arrange the cash refund. Please ensure you have the original 
items and packaging ready for collection.

Expected Refund Timeline: 7-14 business days

Thank you for your patience.

Best regards,
[Store Name]
```

### Financial Records

```
Refund Accounting Entry:
├── Type: REFUND
├── Amount: 15,750 LKR
├── Date: 2026-02-10
├── Order: #12345
├── Transaction: txn_cod_12345
├── Debit: Revenue Account (15,000 LKR)
├── Debit: Fee Revenue (750 LKR)
├── Credit: Cash Liability (15,750 LKR)
└── Status: PENDING_DISBURSEMENT
```

### RefundResult Structure

| Field | Type | Value | Description |
|-------|------|-------|-------------|
| success | bool | True | Refund initiated |
| refund_id | UUID | Refund ID | Refund reference |
| status | str | PENDING | Refund status |
| refund_amount | Decimal | Amount | Refund value |
| refund_method | str | MANUAL_CASH | How refunded |
| estimated_timeline | str | "7-14 days" | Expected completion |
| requires_action | bool | True | Customer action needed |
| action_instructions | str | Contact info | What to do |

### Audit Log Entry

```
Audit Log:
├── event_type: REFUND_INITIATED
├── event_timestamp: 2026-02-10 10:00:00
├── transaction_id: txn_cod_12345
├── order_id: order_12345
├── refund_id: refund_123
├── refund_amount: 15,750 LKR
├── refund_type: FULL
├── refund_reason: "Defective product"
├── initiated_by: admin_user
└── metadata:
    └── Complete refund details
```

### Expected Outcome
- Functional process_refund method for COD transactions
- Refund record created with PENDING status
- Transaction status updated (REFUNDED or PARTIALLY_REFUNDED)
- Manual refund workflow initiated
- Order refund status updated
- Financial records created for refund
- Customer and merchant notified
- Comprehensive audit trail

### Verification Checklist
- [ ] process_refund method signature defined
- [ ] Transaction retrieved and validated
- [ ] Refund amount validated (≤ collected amount)
- [ ] Refund type determined (FULL or PARTIAL)
- [ ] PaymentRefund record created
- [ ] Transaction status updated appropriately
- [ ] Refund amount calculation implemented
- [ ] COD fee refund policy applied
- [ ] Manual refund workflow created
- [ ] Order refund status updated
- [ ] Financial records created
- [ ] Customer notification sent
- [ ] Merchant notification sent
- [ ] Audit log entry created
- [ ] RefundResult returned with details

---

## Task 31: Create Status Transitions

### Overview
Define and implement the valid status transition rules for COD transactions. This task creates a state machine that governs allowed transitions, prevents invalid state changes, validates transitions before execution, logs all state changes, and provides clear error messages for invalid transitions. Proper status management ensures data integrity and enables reliable tracking of the COD payment lifecycle.

### Dependencies
- Task 17: Create CODProcessor Class

### Instructions

1. **Define COD transaction statuses**
   - PENDING: Payment initiated, awaiting collection
   - DISPATCHED: Order dispatched for delivery
   - OUT_FOR_DELIVERY: Delivery agent en route
   - COLLECTED: Cash successfully collected (SUCCESS)
   - FAILED: Collection failed, may retry
   - RETURNED: Returned to sender after max failures
   - REFUNDED: Payment refunded to customer
   - PARTIALLY_REFUNDED: Partial refund processed

2. **Create status transition map**
   - Define dictionary/class mapping current status to allowed next statuses
   - Structure: `{current_status: [allowed_next_statuses]}`
   - Cover all possible valid transitions
   - Ensure no invalid transitions possible

3. **Implement transition validation method**
   - Method name: `validate_status_transition`
   - Parameters: current_status (str), next_status (str)
   - Return type: bool
   - Check if transition is allowed per map

4. **Create transition execution method**
   - Method name: `transition_status`
   - Parameters: transaction (PaymentTransaction), new_status (str), reason (str)
   - Validate transition is allowed
   - Update transaction status
   - Log transition with reason
   - Update related timestamps

5. **Define status-specific side effects**
   - ON_DISPATCHED: Update order status, notify customer
   - ON_OUT_FOR_DELIVERY: Send delivery notification
   - ON_COLLECTED: Complete order, generate receipt (Task 27)
   - ON_FAILED: Increment attempts, schedule retry (Task 28)
   - ON_RETURNED: Cancel order, restock (Task 29)
   - ON_REFUNDED: Process refund workflow (Task 30)

6. **Implement transition middleware**
   - Pre-transition checks (permissions, eligibility)
   - Execute transition
   - Post-transition actions (notifications, workflows)
   - Handle transaction failures (rollback)

7. **Add transition history tracking**
   - Create TransactionStatusHistory model or use metadata
   - Record each transition with timestamp
   - Store old status, new status, reason
   - Store user/system that initiated transition

8. **Create transition error handling**
   - Catch invalid transition attempts
   - Generate descriptive error messages
   - Log invalid transition attempts
   - Return error result to caller

9. **Implement status query methods**
   - `can_transition_to(status)`: Check if transition allowed
   - `get_allowed_transitions()`: Return list of allowed next statuses
   - `get_current_status()`: Return current transaction status
   - `is_terminal_status()`: Check if status is final

10. **Add transition guards**
    - COLLECTED requires attempt count > 0
    - RETURNED requires attempt count >= max
    - REFUNDED requires status == COLLECTED
    - Additional business logic validation

11. **Create transition triggers**
    - Automatic transitions based on events
    - Time-based transitions (e.g., auto-expire)
    - Event-based transitions (e.g., delivery scan)
    - Manual transitions (admin actions)

12. **Document transition rules**
    - Create comprehensive transition diagram
    - Document each status and allowed transitions
    - Explain transition conditions
    - Provide examples

### Status Transition Map

```
COD Transaction Status Transitions:

PENDING → [DISPATCHED, CANCELLED]
    └── Payment initiated, awaiting dispatch

DISPATCHED → [OUT_FOR_DELIVERY, CANCELLED]
    └── Order dispatched to delivery network

OUT_FOR_DELIVERY → [COLLECTED, FAILED, RETURNED]
    └── Delivery agent attempting collection

COLLECTED (SUCCESS) → [REFUNDED, PARTIALLY_REFUNDED]
    └── Cash successfully collected (terminal unless refund)

FAILED → [OUT_FOR_DELIVERY, RETURNED]
    └── Collection failed, retry or RTS

RETURNED → []
    └── Returned to sender (terminal)

REFUNDED → []
    └── Fully refunded (terminal)

PARTIALLY_REFUNDED → [REFUNDED]
    └── Partial refund, may fully refund later
```

### Transition Rules Table

| From Status | To Status | Condition | Side Effects |
|-------------|-----------|-----------|--------------|
| PENDING | DISPATCHED | Order ready | Update order status |
| PENDING | CANCELLED | Admin/customer action | Cancel order |
| DISPATCHED | OUT_FOR_DELIVERY | Delivery started | Send notification |
| DISPATCHED | CANCELLED | Before delivery | Cancel order |
| OUT_FOR_DELIVERY | COLLECTED | Cash collected | Task 27 (success) |
| OUT_FOR_DELIVERY | FAILED | Collection failed | Task 28 (failed) |
| OUT_FOR_DELIVERY | RETURNED | Max attempts | Task 29 (RTS) |
| FAILED | OUT_FOR_DELIVERY | Retry scheduled | Reschedule delivery |
| FAILED | RETURNED | Max attempts | Task 29 (RTS) |
| COLLECTED | REFUNDED | Refund approved | Task 30 (refund) |
| COLLECTED | PARTIALLY_REFUNDED | Partial refund | Task 30 (partial) |
| PARTIALLY_REFUNDED | REFUNDED | Full refund | Task 30 (complete) |

### Status Transition Diagram

```
                    ┌─────────┐
              ┌────►│CANCELLED│
              │     └─────────┘
              │
        ┌─────────┐
        │ PENDING │
        └─────────┘
              │
              ▼
        ┌──────────┐
        │DISPATCHED│
        └──────────┘
              │
              ▼
     ┌──────────────────┐
     │ OUT_FOR_DELIVERY │
     └──────────────────┘
              │
      ┌───────┼───────┐
      │       │       │
      ▼       ▼       ▼
┌─────────┐ ┌────┐ ┌────────┐
│COLLECTED│ │FAIL│ │RETURNED│ (Terminal)
└─────────┘ └────┘ └────────┘
      │       │
      │       └───► (Retry)
      │
      ▼
┌──────────────────┐
│PARTIALLY_REFUNDED│
└──────────────────┘
      │
      ▼
┌─────────┐
│ REFUNDED│ (Terminal)
└─────────┘
```

### Transition Validation Code Structure

```python
class CODStatusTransitions:
    TRANSITION_MAP = {
        TransactionStatus.PENDING: [
            TransactionStatus.DISPATCHED,
            TransactionStatus.CANCELLED
        ],
        TransactionStatus.DISPATCHED: [
            TransactionStatus.OUT_FOR_DELIVERY,
            TransactionStatus.CANCELLED
        ],
        TransactionStatus.OUT_FOR_DELIVERY: [
            TransactionStatus.COLLECTED,
            TransactionStatus.FAILED,
            TransactionStatus.RETURNED
        ],
        TransactionStatus.FAILED: [
            TransactionStatus.OUT_FOR_DELIVERY,
            TransactionStatus.RETURNED
        ],
        TransactionStatus.COLLECTED: [
            TransactionStatus.REFUNDED,
            TransactionStatus.PARTIALLY_REFUNDED
        ],
        TransactionStatus.PARTIALLY_REFUNDED: [
            TransactionStatus.REFUNDED
        ],
        TransactionStatus.RETURNED: [],
        TransactionStatus.REFUNDED: []
    }
    
    @classmethod
    def can_transition(cls, from_status, to_status):
        allowed = cls.TRANSITION_MAP.get(from_status, [])
        return to_status in allowed
```

### Transition Execution Flow

```
      transition_status(txn, new_status, reason)
                   │
                   ▼
        ┌──────────────────────┐
        │ Validate Transition  │
        │ Allowed?             │
        └──────────────────────┘
              │           │
            Yes          No
              │           │
              ▼           ▼
     ┌──────────┐   ┌──────────┐
     │ Execute  │   │ Raise    │
     │ Pre-     │   │ Error    │
     │ Checks   │   └──────────┘
     └──────────┘
              │
              ▼
     ┌──────────────────────┐
     │ Update Transaction   │
     │ Status               │
     └──────────────────────┘
              │
              ▼
     ┌──────────────────────┐
     │ Record in History    │
     └──────────────────────┘
              │
              ▼
     ┌──────────────────────┐
     │ Execute Side Effects │
     └──────────────────────┘
              │
              ▼
     ┌──────────────────────┐
     │ Send Notifications   │
     └──────────────────────┘
              │
              ▼
     ┌──────────────────────┐
     │ Return Success       │
     └──────────────────────┘
```

### Status History Tracking

```json
TransactionStatusHistory:
[
  {
    "from_status": "PENDING",
    "to_status": "DISPATCHED",
    "transitioned_at": "2026-02-01T08:00:00Z",
    "reason": "Order dispatched to delivery agent",
    "initiated_by": "system",
    "metadata": {"agent_id": "agent_123"}
  },
  {
    "from_status": "DISPATCHED",
    "to_status": "OUT_FOR_DELIVERY",
    "transitioned_at": "2026-02-03T10:00:00Z",
    "reason": "Delivery agent started route",
    "initiated_by": "agent_123",
    "metadata": {"location": "6.9271,79.8612"}
  },
  {
    "from_status": "OUT_FOR_DELIVERY",
    "to_status": "COLLECTED",
    "transitioned_at": "2026-02-03T14:30:00Z",
    "reason": "Cash successfully collected",
    "initiated_by": "agent_123",
    "metadata": {"collected_amount": 15750}
  }
]
```

### Terminal Statuses

| Status | Terminal | Can Transition | Description |
|--------|----------|----------------|-------------|
| COLLECTED | Yes* | To refund only | Success state |
| RETURNED | Yes | No | Final failure |
| REFUNDED | Yes | No | Refund complete |
| PARTIALLY_REFUNDED | No | To REFUNDED | May continue |

### Transition Guards

| Guard | Check | Purpose |
|-------|-------|---------|
| attempt_count | attempts > 0 before COLLECTED | Prevent premature success |
| max_attempts | attempts >= max before RETURNED | Enforce RTS trigger |
| payment_collected | status == COLLECTED before REFUNDED | Only refund collected payments |
| admin_permission | User has permission | Secure admin actions |

### Error Messages

| Invalid Transition | Error Message |
|-------------------|---------------|
| PENDING → COLLECTED | "Cannot collect without delivery attempt" |
| DISPATCHED → REFUNDED | "Cannot refund before collection" |
| RETURNED → COLLECTED | "Cannot collect after RTS" |
| REFUNDED → COLLECTED | "Cannot collect after refund" |
| Any → Invalid | "Invalid status transition: {from} → {to}" |

### Expected Outcome
- Comprehensive status transition map defined
- Transition validation preventing invalid state changes
- Status history tracking for audit trail
- Side effects triggered on status changes
- Terminal statuses properly enforced
- Clear error messages for invalid transitions

### Verification Checklist
- [ ] All COD transaction statuses defined
- [ ] Transition map created with all valid transitions
- [ ] validate_status_transition method implemented
- [ ] transition_status method implemented
- [ ] Status-specific side effects defined
- [ ] Transition history tracking implemented
- [ ] Error handling for invalid transitions
- [ ] Transition guards implemented
- [ ] Terminal status logic enforced
- [ ] Query methods implemented (can_transition_to, etc.)
- [ ] Transition documentation complete
- [ ] Transition diagram created

---

## Task 32: Verify COD Processor

### Overview
Perform comprehensive verification and testing of the CODProcessor implementation to ensure all components work correctly together. This task validates processor registration, eligibility checks, payment initiation, status transitions, cash collection, failure handling, return-to-sender, refunds, and overall payment lifecycle. Testing should cover happy paths, edge cases, and error scenarios.

### Dependencies
- Task 31: Create Status Transitions
- All previous Group B tasks

### Instructions

1. **Verify processor registration**
   - Check ProcessorFactory contains CODProcessor
   - Test processor retrieval by PaymentGateway.COD
   - Verify processor instantiation with tenant config
   - Confirm gateway_type is correctly set

2. **Test initiate_payment flow**
   - Create test PaymentIntent with valid data
   - Call initiate_payment method
   - Verify eligibility checks execute
   - Confirm transaction created with PENDING status
   - Validate PaymentResult returned

3. **Verify eligibility checks**
   - Test zone availability check (allowed and blocked zones)
   - Test order amount check (min, max, first-order limits)
   - Test customer history check (new customer, good record, poor record)
   - Confirm all checks pass for eligible order
   - Confirm appropriate rejection for ineligible order

4. **Test fee calculation**
   - Verify flat fee calculation
   - Verify percentage fee calculation
   - Test fee min/max limits
   - Confirm fee added to transaction

5. **Verify payment verification flow**
   - Create test transaction
   - Call verify_payment with COLLECTED status
   - Verify Task 27 handler called (cash collected)
   - Confirm transaction updated to SUCCESS
   - Validate order marked as PAID

6. **Test collection failure handling**
   - Call verify_payment with FAILED status
   - Verify attempt counter incremented
   - Confirm retry scheduled if attempts < max
   - Verify RTS triggered if attempts >= max
   - Test Task 28 and Task 29 integration

7. **Verify return-to-sender process**
   - Create transaction with max attempts
   - Trigger RTS
   - Verify transaction status changed to RETURNED
   - Confirm order cancelled
   - Validate inventory restocked
   - Check blacklist logic for repeat failures

8. **Test refund processing**
   - Create successful transaction (COLLECTED)
   - Call process_refund method
   - Verify refund record created
   - Confirm transaction status updated
   - Validate RefundResult returned

9. **Verify status transitions**
   - Test all valid transitions
   - Attempt invalid transitions and confirm rejection
   - Verify transition history recorded
   - Test side effects triggered correctly

10. **Test error handling**
    - Invalid payment intent (wrong currency, negative amount)
    - Invalid transaction ID
    - Invalid state transitions
    - Configuration errors (COD disabled, missing limits)
    - Database errors

11. **Verify notifications and logging**
    - Confirm customer notifications sent
    - Verify merchant notifications
    - Check audit logs created for all major events
    - Validate log content completeness

12. **Performance testing**
    - Test with multiple concurrent transactions
    - Verify database query efficiency
    - Check for N+1 query issues
    - Validate caching if implemented

13. **Integration testing**
    - Test with Order model integration
    - Verify Customer model updates
    - Test Inventory system integration
    - Confirm Notification system integration

14. **Create test scenarios documentation**
    - Document all test cases
    - Create test data fixtures
    - Provide step-by-step testing guide
    - Include expected results for each test

15. **Generate verification report**
    - List all tests performed
    - Document pass/fail results
    - Note any issues discovered
    - Provide recommendations

### Verification Test Matrix

| Component | Test Case | Expected Result | Status |
|-----------|-----------|-----------------|--------|
| Registration | Retrieve from factory | CODProcessor instance | ☐ |
| Initiate Payment | Valid intent | PaymentResult, PENDING | ☐ |
| Zone Check | Allowed zone | Pass | ☐ |
| Zone Check | Blocked zone | Fail with error | ☐ |
| Amount Check | Within limits | Pass | ☐ |
| Amount Check | Below minimum | Fail with error | ☐ |
| Amount Check | Above maximum | Fail with error | ☐ |
| Amount Check | First order over limit | Fail with error | ☐ |
| History Check | New customer | Pass with info | ☐ |
| History Check | Good record | Pass | ☐ |
| History Check | Poor record | Fail with error | ☐ |
| History Check | Blacklisted | Fail with error | ☐ |
| Fee Calc | Flat fee | Correct amount | ☐ |
| Fee Calc | Percentage fee | Correct calculation | ☐ |
| Verify Payment | COLLECTED | SUCCESS status | ☐ |
| Verify Payment | FAILED (retry) | PENDING, scheduled | ☐ |
| Verify Payment | FAILED (final) | RTS triggered | ☐ |
| RTS | Max attempts | Order cancelled, stocked | ☐ |
| RTS | Blacklist trigger | Customer blacklisted | ☐ |
| Refund | Full refund | REFUNDED status | ☐ |
| Refund | Partial refund | PARTIALLY_REFUNDED | ☐ |
| Transition | Valid transition | Success | ☐ |
| Transition | Invalid transition | Error raised | ☐ |

### Test Scenarios

```
Scenario 1: Successful COD Flow (Happy Path)
1. Customer places order with COD
2. initiate_payment called
3. All eligibility checks pass
4. Transaction created (PENDING)
5. Order dispatched (DISPATCHED)
6. Out for delivery (OUT_FOR_DELIVERY)
7. Cash collected (COLLECTED → SUCCESS)
8. Order completed (PAID)
9. Receipt generated
Expected: Full success, order completed

Scenario 2: First-Time Customer, High Order
1. New customer, 0 COD history
2. Order amount: 25,000 LKR
3. First order limit: 10,000 LKR
4. initiate_payment called
5. Amount check fails
Expected: Payment rejected, error message

Scenario 3: Collection Failure with Retry
1. Successful initiation
2. Delivery attempt 1: FAILED (customer unavailable)
3. Retry scheduled for next day
4. Delivery attempt 2: COLLECTED
Expected: Success after retry

Scenario 4: Multiple Failures Leading to RTS
1. Delivery attempt 1: FAILED
2. Delivery attempt 2: FAILED
3. Delivery attempt 3: FAILED
4. RTS triggered automatically
5. Order cancelled, inventory restocked
Expected: RTS process complete

Scenario 5: Successful Collection then Refund
1. Cash successfully collected
2. Customer reports defective product
3. Refund requested and approved
4. Manual refund workflow initiated
Expected: Refund pending, workflow active

Scenario 6: Blacklist Trigger
1. Customer with 4 previous COD failures
2. New order attempted and fails (5th failure)
3. Blacklist threshold (5) reached
4. Customer blacklisted
Expected: Customer cannot use COD anymore
```

### Testing Checklist

**Processor Setup:**
- [ ] CODProcessor imported and registered
- [ ] Factory retrieves processor correctly
- [ ] Processor instantiates with config
- [ ] gateway_type is COD

**Payment Initiation:**
- [ ] Valid payment intent accepted
- [ ] Invalid currency rejected (non-LKR)
- [ ] COD disabled tenant rejected
- [ ] Transaction created with correct data
- [ ] PaymentResult returned properly

**Eligibility Checks:**
- [ ] Zone check passes for allowed district
- [ ] Zone check fails for blocked district
- [ ] Amount check passes within limits
- [ ] Amount check fails below minimum
- [ ] Amount check fails above maximum
- [ ] First-order limit enforced
- [ ] New customer handled correctly
- [ ] Good customer history passes
- [ ] Poor customer history fails
- [ ] Blacklisted customer rejected

**Fee Calculation:**
- [ ] Flat fee calculated correctly
- [ ] Percentage fee calculated correctly
- [ ] Min/max fee limits applied
- [ ] Fee stored in transaction

**Payment Verification:**
- [ ] COLLECTED status processes correctly
- [ ] FAILED status handled appropriately
- [ ] Attempt counter incremented
- [ ] Agent and timestamp recorded
- [ ] Order status updated

**Collection Failure:**
- [ ] Retry scheduled for < max attempts
- [ ] RTS triggered at max attempts
- [ ] Failure reason recorded
- [ ] Customer notified

**Return to Sender:**
- [ ] Transaction status set to RETURNED
- [ ] Order cancelled
- [ ] Inventory restocked
- [ ] Blacklist checked and applied if needed
- [ ] Logistics return coordinated

**Refund Processing:**
- [ ] Full refund creates correct record
- [ ] Partial refund handled
- [ ] Transaction status updated
- [ ] Manual workflow created
- [ ] Notifications sent

**Status Transitions:**
- [ ] All valid transitions work
- [ ] Invalid transitions rejected
- [ ] Transition history recorded
- [ ] Side effects execute

**Notifications:**
- [ ] Customer SMS sent
- [ ] Customer email sent
- [ ] Merchant notifications sent

**Logging:**
- [ ] Audit logs created for all events
- [ ] Log content complete and accurate

### Expected Outcome
- All CODProcessor components verified and tested
- Happy path flows work correctly
- Edge cases handled appropriately
- Error scenarios fail gracefully
- Integration with other systems confirmed
- Complete test documentation
- Verification report generated

### Verification Checklist
- [ ] Processor registration verified
- [ ] Payment initiation tested (success and failure)
- [ ] All eligibility checks tested individually
- [ ] Fee calculation verified (both types)
- [ ] Payment verification flow tested
- [ ] Collection success handler tested
- [ ] Collection failure handler tested
- [ ] Return-to-sender process tested
- [ ] Refund processing tested
- [ ] Status transitions validated
- [ ] Error handling verified
- [ ] Notifications confirmed sent
- [ ] Audit logging verified
- [ ] Integration with Order system tested
- [ ] Integration with Customer system tested
- [ ] Integration with Inventory tested
- [ ] Test documentation created
- [ ] Verification report generated

---

## Summary

This document completed the COD processor implementation with payment verification, status management, and lifecycle handling. The verify_payment method confirms cash collection, status handlers process successful and failed collections, return-to-sender manages final failures, refund processing handles rare COD refunds, status transitions ensure data integrity, and comprehensive verification confirms all components work correctly.

### Completed Tasks
1. ✓ Created pending COD transaction record in initiate_payment
2. ✓ Implemented verify_payment method for collection confirmation
3. ✓ Created cash collected handler for successful collections
4. ✓ Implemented collection failed handler with retry logic
5. ✓ Created return-to-sender process for max failure scenarios
6. ✓ Implemented process_refund for post-collection refunds
7. ✓ Defined status transition rules and state machine
8. ✓ Performed comprehensive CODProcessor verification

### COD Processor Complete
The CODProcessor is now fully implemented with:
- Eligibility verification (zone, amount, customer history)
- Dynamic fee calculation (flat and percentage)
- Payment lifecycle management (initiate → verify → complete)
- Risk management (attempt limits, blacklisting)
- Financial tracking (transactions, refunds, reconciliation)
- Comprehensive status transitions
- Complete audit trail

### Next Steps
Proceed to Group-C (Risk Management) to implement additional COD risk controls, fraud detection, customer verification, and monitoring systems.
