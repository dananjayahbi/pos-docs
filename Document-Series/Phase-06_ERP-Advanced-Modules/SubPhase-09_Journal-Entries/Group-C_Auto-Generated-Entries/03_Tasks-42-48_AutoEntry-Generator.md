# Tasks 42-48: Auto-Generated Entry Generator Service

**Document**: `03_Tasks-42-48_AutoEntry-Generator.md`  
**Phase**: Phase 06 - ERP Advanced Modules  
**SubPhase**: SubPhase-09 - Journal Entries  
**Group**: Group-C - Auto-Generated Entries  
**Tasks**: 42-48 (7 tasks)  
**Estimated Total Time**: 250 minutes (4 hours 10 minutes)

---

## Navigation

- **Parent**: [00_GROUP_OVERVIEW.md](./00_GROUP_OVERVIEW.md)
- **Previous**: [02_Tasks-37-41_JournalEntry-Service.md](./02_Tasks-37-41_JournalEntry-Service.md)
- **Next Group**: [../Group-D_Templates-Recurring/](../Group-D_Templates-Recurring/)

---

## Table of Contents

1. [Overview](#overview)
2. [Task Summary Table](#task-summary-table)
3. [Architecture Overview](#architecture-overview)
4. [Task 42: Create AutoEntryGenerator](#task-42-create-autoentrygenerator)
5. [Task 43: Add Sales Entry Generator](#task-43-add-sales-entry-generator)
6. [Task 44: Add Purchase Entry Generator](#task-44-add-purchase-entry-generator)
7. [Task 45: Add Payment Entry Generator](#task-45-add-payment-entry-generator)
8. [Task 46: Add Payroll Entry Generator](#task-46-add-payroll-entry-generator)
9. [Task 47: Add Inventory Entry Generator](#task-47-add-inventory-entry-generator)
10. [Task 48: Create Entry Posting Trigger](#task-48-create-entry-posting-trigger)
11. [Integration Patterns](#integration-patterns)
12. [Testing Strategy](#testing-strategy)
13. [Validation Rules](#validation-rules)

---

## Overview

This document covers the implementation of automated journal entry generation services that create accounting entries from business transactions across various ERP modules. The auto-entry generator ensures accounting accuracy, maintains audit trails, and eliminates manual data entry errors.

### Key Features

- **Automated Entry Creation**: Generates journal entries from business transactions
- **Multi-Module Support**: Handles sales, purchases, payments, payroll, inventory
- **Sri Lanka Compliance**: Supports EPF, ETF, PAYE, VAT calculations
- **Signal-Based Triggers**: Uses Django signals for event-driven entry generation
- **Validation & Rollback**: Ensures accounting equation balance and data integrity
- **Audit Trail**: Maintains complete history of auto-generated entries
- **Configurable Rules**: Tenant-specific account mapping and entry rules

### Business Value

- Reduces manual accounting entry time by 90%
- Eliminates data entry errors and mispostings
- Ensures real-time financial position accuracy
- Maintains compliance with accounting standards
- Provides instant financial reporting data
- Supports multi-currency and tax calculations

---

## Task Summary Table

| Task # | Task Name | Dependencies | Complexity | Est. Time | Priority | Assignee |
|--------|-----------|--------------|------------|-----------|----------|----------|
| 42 | Create AutoEntryGenerator | Task 41 | High | 40 min | High | Backend Dev |
| 43 | Add Sales Entry Generator | Task 42 | Medium | 35 min | High | Backend Dev |
| 44 | Add Purchase Entry Generator | Task 43 | Medium | 35 min | High | Backend Dev |
| 45 | Add Payment Entry Generator | Task 44 | Medium | 30 min | High | Backend Dev |
| 46 | Add Payroll Entry Generator | Task 45 | High | 45 min | High | Backend Dev |
| 47 | Add Inventory Entry Generator | Task 46 | Medium | 30 min | Medium | Backend Dev |
| 48 | Create Entry Posting Trigger | Task 47 | Medium | 35 min | High | Backend Dev |

**Total Estimated Time**: 250 minutes (4 hours 10 minutes)

---

## Architecture Overview

### Auto-Entry Generation Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│                     AUTO-ENTRY GENERATION SYSTEM                     │
└─────────────────────────────────────────────────────────────────────┘

┌──────────────┐         ┌──────────────┐         ┌──────────────┐
│   Business   │         │    Signal    │         │ Entry Queue  │
│  Transaction │────────▶│   Trigger    │────────▶│  (Celery)    │
│  (Save/Post) │         │  (post_save) │         │              │
└──────────────┘         └──────────────┘         └──────┬───────┘
                                                          │
                                                          ▼
┌──────────────────────────────────────────────────────────────────────┐
│                      AUTO ENTRY GENERATOR                             │
│  ┌────────────────────────────────────────────────────────────┐     │
│  │  Base Generator (AutoEntryGenerator)                        │     │
│  │  - Validate source transaction                              │     │
│  │  - Load account mapping rules                               │     │
│  │  - Generate entry lines (DR/CR)                             │     │
│  │  - Validate accounting equation                             │     │
│  │  - Create journal entry                                     │     │
│  │  - Link to source transaction                               │     │
│  └────────────────────────────────────────────────────────────┘     │
│                                                                       │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐           │
│  │  Sales   │  │ Purchase │  │ Payment  │  │ Payroll  │           │
│  │Generator │  │Generator │  │Generator │  │Generator │           │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘           │
│       │              │              │              │                 │
│       └──────────────┴──────────────┴──────────────┘                │
│                           │                                          │
└───────────────────────────┼──────────────────────────────────────────┘
                            ▼
              ┌──────────────────────────┐
              │   Journal Entry Service  │
              │  - Create entry header   │
              │  - Create entry lines    │
              │  - Validate balance      │
              │  - Post if configured    │
              └──────────────────────────┘
                            │
                            ▼
              ┌──────────────────────────┐
              │    Journal Entry Model   │
              │  - Entry saved           │
              │  - Lines created         │
              │  - Audit trail updated   │
              └──────────────────────────┘
```

### Generator Class Hierarchy

```
┌─────────────────────────────────────┐
│      AutoEntryGenerator             │
│      (Base Class)                   │
│  ────────────────────────────────   │
│  + validate_source()                │
│  + load_account_mapping()           │
│  + generate_entry()                 │
│  + create_entry_lines()             │
│  + validate_balance()               │
│  + post_entry()                     │
│  # get_debit_lines()    [abstract]  │
│  # get_credit_lines()   [abstract]  │
└─────────────┬───────────────────────┘
              │
      ┌───────┴───────────────────────────────┐
      │                                       │
┌─────▼──────────┐                  ┌────────▼─────────┐
│ SalesEntryGen  │                  │ PurchaseEntryGen │
│ ─────────────  │                  │ ───────────────  │
│ DR: AR         │                  │ DR: Inventory    │
│ CR: Revenue    │                  │ DR: VAT Input    │
│ CR: VAT Output │                  │ CR: AP           │
└────────────────┘                  └──────────────────┘
      │                                       │
      │            ┌──────────────┐           │
      └───────────▶│ PaymentGen   │◀──────────┘
                   │ ───────────  │
                   │ DR: AP/Cash  │
                   │ CR: AR/Cash  │
                   └──────┬───────┘
                          │
              ┌───────────┴───────────┐
              │                       │
     ┌────────▼────────┐    ┌────────▼──────────┐
     │ PayrollEntryGen │    │ InventoryEntryGen │
     │ ──────────────  │    │ ────────────────  │
     │ DR: Salary Exp  │    │ DR: Inv Adj Exp   │
     │ DR: EPF Exp     │    │ CR: Inventory     │
     │ CR: EPF Payable │    └───────────────────┘
     │ CR: ETF Payable │
     │ CR: PAYE Pay    │
     │ CR: Net Salary  │
     └─────────────────┘
```

### Account Mapping Configuration

```
┌───────────────────────────────────────────────────────────────┐
│              ACCOUNT MAPPING RULES (per Tenant)               │
├───────────────────────────────────────────────────────────────┤
│                                                               │
│  Transaction Type      │  Debit Account       │ Credit Acct  │
│  ─────────────────────────────────────────────────────────── │
│  SALES_INVOICE         │  1200 - AR           │ 4000 - Sales │
│                        │                      │ 2100 - VAT   │
│  ─────────────────────────────────────────────────────────── │
│  PURCHASE_BILL         │  1300 - Inventory    │ 2000 - AP    │
│                        │  1500 - VAT Input    │              │
│  ─────────────────────────────────────────────────────────── │
│  PAYMENT_RECEIVED      │  1000 - Cash         │ 1200 - AR    │
│  ─────────────────────────────────────────────────────────── │
│  PAYMENT_MADE          │  2000 - AP           │ 1000 - Cash  │
│  ─────────────────────────────────────────────────────────── │
│  PAYROLL_RUN           │  5100 - Salaries     │ 2200 - EPF   │
│                        │  5101 - EPF Exp      │ 2201 - ETF   │
│                        │  5102 - ETF Exp      │ 2202 - PAYE  │
│                        │                      │ 2100 - Net   │
│  ─────────────────────────────────────────────────────────── │
│  INVENTORY_ADJUSTMENT  │  5200 - Inv Adj      │ 1300 - Inv   │
│                                                               │
└───────────────────────────────────────────────────────────────┘
```

---

## Task 42: Create AutoEntryGenerator

**Duration**: 40 minutes  
**Complexity**: High  
**Dependencies**: Task 41 (JournalEntry Service)  
**Priority**: High

### Objective

Create the base AutoEntryGenerator service class that provides common functionality for all transaction-specific entry generators. This class handles validation, account mapping, entry creation, and balance verification.

### Requirements

#### Functional Requirements

1. **Base Generator Class**
   - Abstract base class for all entry generators
   - Provides common generation workflow
   - Defines abstract methods for subclasses
   - Handles transaction validation
   - Manages account mapping lookup
   - Creates journal entry via service
   - Validates accounting equation balance

2. **Account Mapping Service**
   - Load account mapping rules per tenant
   - Support transaction type-specific rules
   - Handle default account fallbacks
   - Validate account existence
   - Cache mapping rules for performance

3. **Entry Generation Workflow**
   - Accept source transaction object
   - Validate transaction state
   - Load applicable account mappings
   - Generate debit line items
   - Generate credit line items
   - Validate debit = credit totals
   - Create journal entry via service
   - Link entry to source transaction
   - Handle multi-currency conversions
   - Return created entry object

4. **Validation Logic**
   - Verify source transaction is valid
   - Check transaction not already converted
   - Validate all required accounts exist
   - Ensure debit total equals credit total
   - Verify currency consistency
   - Check date validity
   - Validate amount precision

5. **Error Handling**
   - Custom exception for entry generation errors
   - Rollback on validation failures
   - Log all generation attempts
   - Capture error context for debugging
   - Send alerts for critical failures

### Implementation Steps

#### Step 1: Create Base Generator Class (15 min)

Create service file at `backend/apps/accounting/services/auto_entry_generator.py`:

1. **Define AutoEntryGenerator base class**
   - Add class docstring explaining purpose
   - Define initialization with transaction parameter
   - Store reference to source transaction
   - Initialize tenant context
   - Set up logger instance

2. **Add validation methods**
   - Implement `validate_source()` method
   - Check transaction exists and is valid
   - Verify transaction is posted/approved
   - Ensure not already converted to entry
   - Validate required fields present
   - Return validation result

3. **Implement account mapping loader**
   - Create `load_account_mapping()` method
   - Accept transaction type parameter
   - Query AccountMapping model by type
   - Filter by tenant
   - Return mapping dictionary
   - Handle missing mappings gracefully

4. **Add entry generation orchestrator**
   - Implement `generate_entry()` main method
   - Execute validation
   - Load account mappings
   - Call abstract line generation methods
   - Validate debit = credit
   - Create entry via JournalEntryService
   - Link to source transaction
   - Return created entry

5. **Define abstract methods**
   - Create abstract `get_debit_lines()` method
   - Create abstract `get_credit_lines()` method
   - Both return list of line dictionaries
   - Line dict includes account, amount, description
   - Subclasses must implement these

#### Step 2: Implement Balance Validation (10 min)

1. **Add balance validator**
   - Create `validate_balance()` method
   - Accept debit_lines and credit_lines
   - Sum all debit amounts
   - Sum all credit amounts
   - Compare with precision tolerance
   - Raise error if not balanced
   - Log validation result

2. **Handle multi-currency**
   - Add `convert_to_base_currency()` method
   - Accept amount and currency parameters
   - Look up exchange rate
   - Convert to tenant base currency
   - Return converted amount
   - Cache exchange rates

3. **Add precision handling**
   - Define DECIMAL_PRECISION constant
   - Use Decimal type for all amounts
   - Round to configured precision
   - Handle rounding differences
   - Balance rounding adjustments

#### Step 3: Implement Entry Creation (10 min)

1. **Add entry creation logic**
   - Create `create_entry()` method
   - Build entry header data
   - Set entry date from transaction
   - Set entry type as AUTO_GENERATED
   - Set reference to source transaction
   - Add description from transaction
   - Call JournalEntryService.create_entry()
   - Return created entry

2. **Add line creation helper**
   - Implement `create_entry_lines()` method
   - Iterate through debit lines
   - Create JournalEntryLine instances
   - Set line type as DEBIT
   - Iterate through credit lines
   - Set line type as CREDIT
   - Link all lines to entry
   - Bulk create for performance

3. **Add transaction linking**
   - Implement `link_to_source()` method
   - Store entry ID on source model
   - Use GenericForeignKey if available
   - Update source transaction status
   - Mark as "converted to entry"
   - Save transaction object

#### Step 4: Add Error Handling (5 min)

1. **Define custom exceptions**
   - Create `EntryGenerationError` exception
   - Add `AccountMappingError` exception
   - Add `BalanceValidationError` exception
   - Include error details in message
   - Store transaction context

2. **Implement error logging**
   - Wrap generation in try/except
   - Log all errors with context
   - Include transaction details
   - Capture stack trace
   - Send error notifications

3. **Add rollback logic**
   - Use database transaction wrapper
   - Rollback on any error
   - Clean up partial entries
   - Reset transaction state
   - Log rollback event

### Entry Generation Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│           AUTO ENTRY GENERATION WORKFLOW                     │
└─────────────────────────────────────────────────────────────┘

                    ┌──────────────┐
                    │   START      │
                    │ generate()   │
                    └──────┬───────┘
                           │
                           ▼
                  ┌────────────────┐
                  │  Validate      │
                  │  Source Txn    │
                  └────────┬───────┘
                           │
                    ┌──────▼──────┐
                    │   Valid?    │
                    └──────┬──────┘
                           │
                 ┌─────────┴─────────┐
                 │ NO                │ YES
                 ▼                   ▼
          ┌──────────┐      ┌────────────────┐
          │  Raise   │      │ Load Account   │
          │  Error   │      │ Mapping Rules  │
          └──────────┘      └────────┬───────┘
                                     │
                                     ▼
                           ┌──────────────────┐
                           │ Call get_debit_  │
                           │ lines() abstract │
                           └─────────┬────────┘
                                     │
                                     ▼
                           ┌──────────────────┐
                           │ Call get_credit_ │
                           │ lines() abstract │
                           └─────────┬────────┘
                                     │
                                     ▼
                          ┌───────────────────┐
                          │ Validate Balance  │
                          │ (DR total = CR)   │
                          └─────────┬─────────┘
                                    │
                          ┌─────────┴──────────┐
                          │ NO                 │ YES
                          ▼                    ▼
                   ┌──────────┐      ┌──────────────────┐
                   │  Raise   │      │ Create Journal   │
                   │  Error   │      │ Entry (Service)  │
                   └──────────┘      └─────────┬────────┘
                                               │
                                               ▼
                                     ┌──────────────────┐
                                     │ Create Entry     │
                                     │ Lines (DR + CR)  │
                                     └─────────┬────────┘
                                               │
                                               ▼
                                     ┌──────────────────┐
                                     │ Link to Source   │
                                     │ Transaction      │
                                     └─────────┬────────┘
                                               │
                                               ▼
                                     ┌──────────────────┐
                                     │ Update Source    │
                                     │ Status (posted)  │
                                     └─────────┬────────┘
                                               │
                                               ▼
                                     ┌──────────────────┐
                                     │  Return Entry    │
                                     │     Object       │
                                     └──────────────────┘
```

### Account Mapping Model Structure

```
┌──────────────────────────────────────────────────────────────┐
│                   AccountMapping Model                        │
├──────────────────────────────────────────────────────────────┤
│  Fields:                                                      │
│  - id (UUID)                                                  │
│  - tenant (FK)                                                │
│  - transaction_type (CharField, choices)                      │
│      * SALES_INVOICE                                          │
│      * PURCHASE_BILL                                          │
│      * PAYMENT_RECEIVED                                       │
│      * PAYMENT_MADE                                           │
│      * PAYROLL_RUN                                            │
│      * INVENTORY_ADJUSTMENT                                   │
│  - debit_account (FK to Account)                              │
│  - credit_account (FK to Account)                             │
│  - additional_accounts (JSONField)                            │
│      * For complex entries (VAT, EPF, ETF, etc.)              │
│  - is_active (Boolean)                                        │
│  - priority (Integer, for multiple rules)                     │
│  - conditions (JSONField)                                     │
│      * Optional matching conditions                           │
│  - created_at, updated_at                                     │
│                                                               │
│  Methods:                                                     │
│  - get_accounts_for_transaction()                             │
│  - validate_accounts_exist()                                  │
│  - apply_conditions()                                         │
└───────────────────────────────────────────────────────────────┘
```

### Validation Rules

| Validation Check | Condition | Error Message |
|-----------------|-----------|---------------|
| Source Exists | transaction is not None | "Source transaction is required" |
| Source Posted | transaction.status == 'posted' | "Transaction must be posted" |
| Not Converted | transaction.journal_entry_id is None | "Entry already generated" |
| Accounts Exist | All accounts in mapping exist | "Account {code} not found" |
| Balance Valid | sum(debits) == sum(credits) | "Entry not balanced: DR={} CR={}" |
| Currency Match | All lines same currency | "Currency mismatch in lines" |
| Date Valid | entry_date <= today | "Entry date cannot be future" |
| Amount Positive | All amounts > 0 | "Amount must be positive" |

### Testing Checklist

- [ ] Base class instantiates correctly
- [ ] validate_source() catches invalid transactions
- [ ] load_account_mapping() returns correct mapping
- [ ] validate_balance() detects unbalanced entries
- [ ] create_entry() calls JournalEntryService
- [ ] link_to_source() updates transaction
- [ ] Abstract methods raise NotImplementedError
- [ ] Error handling rolls back transactions
- [ ] Multi-currency conversion works
- [ ] Decimal precision handled correctly
- [ ] Account mapping caching functions
- [ ] Missing mapping raises error

---

## Task 43: Add Sales Entry Generator

**Duration**: 35 minutes  
**Complexity**: Medium  
**Dependencies**: Task 42 (AutoEntryGenerator)  
**Priority**: High

### Objective

Implement SalesEntryGenerator that creates journal entries from sales invoices, handling accounts receivable, sales revenue, and VAT output accounts with multi-line item support.

### Requirements

#### Functional Requirements

1. **Sales Invoice Entry Generation**
   - Generate entries from SalesInvoice model
   - Debit: Accounts Receivable (total with VAT)
   - Credit: Sales Revenue (net amount)
   - Credit: VAT Output (tax amount)
   - Support multi-line invoices
   - Handle invoice discounts
   - Process multi-currency invoices

2. **Line Item Processing**
   - Iterate through invoice line items
   - Calculate net amount per line
   - Calculate VAT per line
   - Aggregate by revenue account
   - Support different VAT rates
   - Handle tax-exempt items

3. **VAT Calculation**
   - Apply Sri Lanka VAT rate (configurable)
   - Calculate VAT on taxable items
   - Separate VAT by rate if multiple
   - Round VAT to 2 decimal places
   - Support zero-rated items

4. **Customer Integration**
   - Link to customer account
   - Use customer-specific AR account if set
   - Apply customer currency
   - Handle customer credit terms
   - Track customer balance

### Implementation Steps

#### Step 1: Create Sales Generator Class (15 min)

1. **Define SalesEntryGenerator class**
   - Inherit from AutoEntryGenerator
   - Add class docstring
   - Override initialization if needed
   - Store sales invoice reference
   - Set transaction type

2. **Implement get_debit_lines() method**
   - Create method returning debit lines list
   - Get AR account from mapping
   - Calculate total invoice amount (including VAT)
   - Create single debit line for AR
   - Set amount to invoice total
   - Set description: "Sales Invoice {number}"
   - Add customer reference
   - Return list with one debit line

3. **Implement get_credit_lines() method**
   - Create method returning credit lines list
   - Initialize empty credit lines list
   - Process invoice line items
   - Group by revenue account
   - Calculate net amount per account
   - Create credit line per account
   - Add VAT credit line if applicable
   - Return complete credit lines list

#### Step 2: Process Invoice Line Items (10 min)

1. **Add line item processor**
   - Create `process_line_items()` helper method
   - Iterate through invoice.line_items.all()
   - For each line item:
     - Get product/service
     - Determine revenue account
     - Calculate line net amount (qty × price)
     - Apply line discount if any
     - Calculate line VAT
     - Accumulate by revenue account
   - Return aggregated lines dictionary

2. **Handle discounts**
   - Check invoice-level discount
   - Check line-level discounts
   - Calculate net after discount
   - Reduce revenue proportionally
   - Adjust VAT calculation base
   - Document discount in description

3. **Support multiple revenue accounts**
   - Use product category mapping
   - Allow line-specific account override
   - Aggregate same-account lines
   - Create separate credit line per account
   - Include line items in description

#### Step 3: Calculate VAT (5 min)

1. **Implement VAT calculator**
   - Create `calculate_vat()` helper method
   - Accept net amount and VAT rate
   - Multiply net × rate
   - Round to 2 decimal places
   - Return VAT amount

2. **Handle multiple VAT rates**
   - Group lines by VAT rate
   - Calculate VAT per rate group
   - Create separate VAT lines if needed
   - Use different VAT liability accounts
   - Label VAT line with rate

3. **Process tax-exempt items**
   - Check if item is tax-exempt
   - Skip VAT calculation if exempt
   - No VAT credit line for exempt
   - Note tax-exempt in description

#### Step 4: Add Customer Integration (5 min)

1. **Link to customer**
   - Get customer from invoice
   - Use customer-specific AR account if configured
   - Fall back to default AR account
   - Store customer ID in entry memo
   - Link for reporting

2. **Handle customer currency**
   - Get invoice currency
   - Match to customer preferred currency
   - Convert if different from base
   - Store original currency amount
   - Store exchange rate used

### Sales Entry Generation Flow

```
┌─────────────────────────────────────────────────────────────┐
│            SALES INVOICE ENTRY GENERATION                    │
└─────────────────────────────────────────────────────────────┘

          ┌──────────────────────┐
          │  Sales Invoice       │
          │  ─────────────────   │
          │  Number: INV-001     │
          │  Customer: ABC Ltd   │
          │  Date: 2026-01-25    │
          │  ─────────────────   │
          │  Line 1: Product A   │
          │    Qty: 10           │
          │    Price: 50.00      │
          │    Subtotal: 500.00  │
          │    VAT 15%: 75.00    │
          │  ─────────────────   │
          │  Line 2: Product B   │
          │    Qty: 5            │
          │    Price: 100.00     │
          │    Subtotal: 500.00  │
          │    VAT 15%: 75.00    │
          │  ─────────────────   │
          │  Net: 1,000.00       │
          │  VAT: 150.00         │
          │  Total: 1,150.00     │
          └──────────┬───────────┘
                     │
                     ▼
          ┌──────────────────────┐
          │ SalesEntryGenerator  │
          └──────────┬───────────┘
                     │
        ┌────────────┴────────────┐
        │                         │
        ▼                         ▼
┌───────────────┐        ┌────────────────┐
│ get_debit_    │        │ get_credit_    │
│ lines()       │        │ lines()        │
└───────┬───────┘        └────────┬───────┘
        │                         │
        ▼                         ▼
┌───────────────┐        ┌────────────────┐
│ Debit Lines:  │        │ Credit Lines:  │
│               │        │                │
│ Account: 1200 │        │ 1) Account: 4000│
│ (AR)          │        │    (Revenue)    │
│ Amount: 1,150 │        │    Amount: 1,000│
│ Desc: "Sales  │        │    Desc: "Sales"│
│  INV-001"     │        │                │
└───────────────┘        │ 2) Account: 2100│
                         │    (VAT Output) │
                         │    Amount: 150  │
                         │    Desc: "VAT"  │
                         └─────────────────┘
                                  │
                                  ▼
                    ┌──────────────────────┐
                    │  Journal Entry       │
                    │  ─────────────────   │
                    │  Date: 2026-01-25    │
                    │  Type: AUTO_SALES    │
                    │  Ref: INV-001        │
                    │  ─────────────────   │
                    │  DR  1200  1,150.00  │
                    │  CR  4000  1,000.00  │
                    │  CR  2100    150.00  │
                    │  ─────────────────   │
                    │  Balance: OK ✓       │
                    └──────────────────────┘
```

### Sales Entry Scenarios

#### Scenario 1: Simple Single-Item Invoice

```
Invoice Details:
- Invoice: INV-001
- Customer: ABC Company
- Item: Widget
- Quantity: 10
- Unit Price: 100.00
- Net Amount: 1,000.00
- VAT (15%): 150.00
- Total: 1,150.00

Generated Entry:
┌──────────┬─────────────────────┬──────────┬─────────┐
│ Date     │ Account             │ Debit    │ Credit  │
├──────────┼─────────────────────┼──────────┼─────────┤
│ 25-Jan   │ 1200 - AR (ABC)     │ 1,150.00 │         │
│ 25-Jan   │ 4000 - Sales        │          │ 1,000.00│
│ 25-Jan   │ 2100 - VAT Output   │          │   150.00│
└──────────┴─────────────────────┴──────────┴─────────┘
```

#### Scenario 2: Multi-Item with Different Revenue Accounts

```
Invoice Details:
- Invoice: INV-002
- Customer: XYZ Ltd
- Item 1: Product (Revenue Account: 4000-Sales)
  - Qty: 5, Price: 200.00
  - Net: 1,000.00, VAT: 150.00
- Item 2: Service (Revenue Account: 4100-Service Revenue)
  - Qty: 1, Price: 500.00
  - Net: 500.00, VAT: 75.00
- Total Net: 1,500.00
- Total VAT: 225.00
- Total: 1,725.00

Generated Entry:
┌──────────┬─────────────────────┬──────────┬─────────┐
│ Date     │ Account             │ Debit    │ Credit  │
├──────────┼─────────────────────┼──────────┼─────────┤
│ 25-Jan   │ 1200 - AR (XYZ)     │ 1,725.00 │         │
│ 25-Jan   │ 4000 - Sales        │          │ 1,000.00│
│ 25-Jan   │ 4100 - Service Rev  │          │   500.00│
│ 25-Jan   │ 2100 - VAT Output   │          │   225.00│
└──────────┴─────────────────────┴──────────┴─────────┘
```

#### Scenario 3: Invoice with Discount

```
Invoice Details:
- Invoice: INV-003
- Customer: DEF Corp
- Item: Product
- Quantity: 10
- Unit Price: 100.00
- Subtotal: 1,000.00
- Discount (10%): -100.00
- Net Amount: 900.00
- VAT (15%): 135.00
- Total: 1,035.00

Generated Entry:
┌──────────┬─────────────────────┬──────────┬─────────┐
│ Date     │ Account             │ Debit    │ Credit  │
├──────────┼─────────────────────┼──────────┼─────────┤
│ 25-Jan   │ 1200 - AR (DEF)     │ 1,035.00 │         │
│ 25-Jan   │ 4000 - Sales        │          │   900.00│
│ 25-Jan   │ 2100 - VAT Output   │          │   135.00│
└──────────┴─────────────────────┴──────────┴─────────┘
Note: Discount applied before VAT calculation
```

### Validation Rules

| Check | Rule | Error |
|-------|------|-------|
| Invoice Posted | status == 'posted' | "Invoice not posted" |
| Has Customer | customer is not None | "Customer required" |
| Has Line Items | line_items.count() > 0 | "No line items" |
| Positive Amounts | all amounts > 0 | "Invalid amount" |
| AR Account Exists | ar_account exists | "AR account missing" |
| Revenue Accounts | all revenue accounts exist | "Revenue account missing" |
| VAT Account | vat_account exists | "VAT account missing" |
| Total Matches | calculated = invoice.total | "Amount mismatch" |

### Testing Checklist

- [ ] Single-item invoice generates correctly
- [ ] Multi-item invoice aggregates by account
- [ ] VAT calculated correctly
- [ ] Discount handled properly
- [ ] Tax-exempt items skip VAT
- [ ] Multiple VAT rates supported
- [ ] Customer AR account used
- [ ] Multi-currency converted
- [ ] Entry balances (DR = CR)
- [ ] Entry links to invoice
- [ ] Description includes invoice number
- [ ] Zero-amount lines excluded

---

## Task 44: Add Purchase Entry Generator

**Duration**: 35 minutes  
**Complexity**: Medium  
**Dependencies**: Task 43 (Sales Entry Generator)  
**Priority**: High

### Objective

Implement PurchaseEntryGenerator that creates journal entries from purchase bills, handling inventory/expense accounts, VAT input, and accounts payable with vendor management.

### Requirements

#### Functional Requirements

1. **Purchase Bill Entry Generation**
   - Generate entries from PurchaseBill model
   - Debit: Inventory or Expense (net amount)
   - Debit: VAT Input (tax amount)
   - Credit: Accounts Payable (total with VAT)
   - Support multi-line bills
   - Handle bill payment terms
   - Process multi-currency bills

2. **Inventory vs Expense Determination**
   - Check if purchased item is inventory
   - Debit Inventory account if stockable
   - Debit Expense account if non-stockable
   - Support mixed bills (both types)
   - Use product type to determine
   - Allow manual override

3. **VAT Input Processing**
   - Calculate VAT on purchases
   - Debit VAT Input account
   - Support VAT recovery
   - Handle non-recoverable VAT
   - Apply to expenses if non-recoverable

4. **Vendor Integration**
   - Link to vendor account
   - Use vendor-specific AP account if set
   - Apply vendor currency
   - Handle vendor payment terms
   - Track vendor balance

### Implementation Steps

#### Step 1: Create Purchase Generator Class (15 min)

1. **Define PurchaseEntryGenerator class**
   - Inherit from AutoEntryGenerator
   - Add class docstring
   - Store purchase bill reference
   - Set transaction type
   - Initialize vendor context

2. **Implement get_debit_lines() method**
   - Create method returning debit lines list
   - Initialize debit lines list
   - Process purchase line items
   - Determine inventory vs expense
   - Group by account type
   - Calculate line net amounts
   - Add VAT input debit line
   - Return complete debit lines list

3. **Implement get_credit_lines() method**
   - Create method returning credit lines list
   - Get AP account from mapping
   - Calculate total bill amount (including VAT)
   - Create single credit line for AP
   - Set amount to bill total
   - Set description: "Purchase Bill {number}"
   - Add vendor reference
   - Return list with one credit line

#### Step 2: Process Line Items (10 min)

1. **Add line item processor**
   - Create `process_purchase_lines()` helper
   - Iterate through bill.line_items.all()
   - For each line:
     - Get product/service
     - Check if inventory item
     - Determine account (inventory/expense)
     - Calculate line net amount
     - Calculate line VAT input
     - Accumulate by account
   - Return lines grouped by account

2. **Determine inventory vs expense**
   - Create `get_account_for_item()` helper
   - Check product.type field
   - If type == 'product': use inventory account
   - If type == 'service': use expense account
   - Allow category-specific accounts
   - Use default if not specified
   - Return appropriate account

3. **Handle mixed bills**
   - Support both inventory and expense items
   - Create separate debit lines per type
   - Aggregate same-type items
   - Label lines clearly
   - Calculate VAT separately if needed

#### Step 3: Process VAT Input (5 min)

1. **Calculate VAT input**
   - Create `calculate_vat_input()` helper
   - Sum VAT from all taxable lines
   - Get VAT input account from mapping
   - Create debit line for VAT
   - Handle recoverable vs non-recoverable
   - Add VAT to expense if non-recoverable

2. **Support VAT recovery rules**
   - Check tenant VAT recovery settings
   - If fully recoverable: debit VAT Input
   - If non-recoverable: add to expense
   - If partial: split between VAT and expense
   - Apply recovery percentage
   - Document in line description

#### Step 4: Add Vendor Integration (5 min)

1. **Link to vendor**
   - Get vendor from bill
   - Use vendor-specific AP account if set
   - Fall back to default AP account
   - Store vendor ID in entry memo
   - Link for vendor reports

2. **Handle vendor currency**
   - Get bill currency
   - Match vendor preferred currency
   - Convert if different from base
   - Store original currency amount
   - Store exchange rate

### Purchase Entry Generation Flow

```
┌─────────────────────────────────────────────────────────────┐
│           PURCHASE BILL ENTRY GENERATION                     │
└─────────────────────────────────────────────────────────────┘

          ┌──────────────────────┐
          │  Purchase Bill       │
          │  ─────────────────   │
          │  Number: BILL-001    │
          │  Vendor: XYZ Supplies│
          │  Date: 2026-01-25    │
          │  ─────────────────   │
          │  Line 1: Product A   │
          │    Type: Inventory   │
          │    Qty: 10           │
          │    Price: 50.00      │
          │    Subtotal: 500.00  │
          │    VAT 15%: 75.00    │
          │  ─────────────────   │
          │  Line 2: Service B   │
          │    Type: Expense     │
          │    Qty: 1            │
          │    Price: 300.00     │
          │    Subtotal: 300.00  │
          │    VAT 15%: 45.00    │
          │  ─────────────────   │
          │  Net: 800.00         │
          │  VAT: 120.00         │
          │  Total: 920.00       │
          └──────────┬───────────┘
                     │
                     ▼
        ┌────────────────────────┐
        │ PurchaseEntryGenerator │
        └──────────┬───────────────┘
                   │
      ┌────────────┴────────────┐
      │                         │
      ▼                         ▼
┌─────────────┐        ┌────────────────┐
│ get_debit_  │        │ get_credit_    │
│ lines()     │        │ lines()        │
└──────┬──────┘        └────────┬───────┘
       │                        │
       ▼                        ▼
┌──────────────┐       ┌────────────────┐
│ Debit Lines: │       │ Credit Lines:  │
│              │       │                │
│ 1) Acct: 1300│       │ Account: 2000  │
│    (Inv)     │       │ (AP)           │
│    Amt: 500  │       │ Amount: 920    │
│    Desc:"Inv"│       │ Desc: "Purchase│
│              │       │  BILL-001"     │
│ 2) Acct: 5000│       └────────────────┘
│    (Exp)     │
│    Amt: 300  │
│    Desc:"Svc"│
│              │
│ 3) Acct: 1500│
│    (VAT In)  │
│    Amt: 120  │
│    Desc:"VAT"│
└──────────────┘
       │
       ▼
┌──────────────────────┐
│  Journal Entry       │
│  ─────────────────   │
│  Date: 2026-01-25    │
│  Type: AUTO_PURCHASE │
│  Ref: BILL-001       │
│  ─────────────────   │
│  DR  1300    500.00  │
│  DR  5000    300.00  │
│  DR  1500    120.00  │
│  CR  2000    920.00  │
│  ─────────────────   │
│  Balance: OK ✓       │
└──────────────────────┘
```

### Purchase Entry Scenarios

#### Scenario 1: Inventory Purchase

```
Bill Details:
- Bill: BILL-001
- Vendor: ABC Suppliers
- Item: Raw Material (Inventory)
- Quantity: 100
- Unit Price: 10.00
- Net Amount: 1,000.00
- VAT (15%): 150.00
- Total: 1,150.00

Generated Entry:
┌──────────┬─────────────────────┬──────────┬─────────┐
│ Date     │ Account             │ Debit    │ Credit  │
├──────────┼─────────────────────┼──────────┼─────────┤
│ 25-Jan   │ 1300 - Inventory    │ 1,000.00 │         │
│ 25-Jan   │ 1500 - VAT Input    │   150.00 │         │
│ 25-Jan   │ 2000 - AP (ABC)     │          │ 1,150.00│
└──────────┴─────────────────────┴──────────┴─────────┘
```

#### Scenario 2: Expense Purchase (Non-Recoverable VAT)

```
Bill Details:
- Bill: BILL-002
- Vendor: Service Provider
- Item: Consulting Service (Expense)
- Quantity: 1
- Unit Price: 5,000.00
- Net Amount: 5,000.00
- VAT (15%): 750.00 (Non-Recoverable)
- Total: 5,750.00

Generated Entry:
┌──────────┬─────────────────────┬──────────┬─────────┐
│ Date     │ Account             │ Debit    │ Credit  │
├──────────┼─────────────────────┼──────────┼─────────┤
│ 25-Jan   │ 5100 - Consult Exp  │ 5,750.00 │         │
│ 25-Jan   │ 2000 - AP (Svc)     │          │ 5,750.00│
└──────────┴─────────────────────┴──────────┴─────────┘
Note: VAT included in expense (non-recoverable)
```

#### Scenario 3: Mixed Inventory and Expense

```
Bill Details:
- Bill: BILL-003
- Vendor: XYZ Supplies
- Item 1: Inventory (Product)
  - Qty: 50, Price: 20.00
  - Net: 1,000.00, VAT: 150.00
- Item 2: Expense (Service)
  - Qty: 1, Price: 500.00
  - Net: 500.00, VAT: 75.00
- Total Net: 1,500.00
- Total VAT: 225.00
- Total: 1,725.00

Generated Entry:
┌──────────┬─────────────────────┬──────────┬─────────┐
│ Date     │ Account             │ Debit    │ Credit  │
├──────────┼─────────────────────┼──────────┼─────────┤
│ 25-Jan   │ 1300 - Inventory    │ 1,000.00 │         │
│ 25-Jan   │ 5000 - Expense      │   500.00 │         │
│ 25-Jan   │ 1500 - VAT Input    │   225.00 │         │
│ 25-Jan   │ 2000 - AP (XYZ)     │          │ 1,725.00│
└──────────┴─────────────────────┴──────────┴─────────┘
```

### Validation Rules

| Check | Rule | Error |
|-------|------|-------|
| Bill Posted | status == 'posted' | "Bill not posted" |
| Has Vendor | vendor is not None | "Vendor required" |
| Has Line Items | line_items.count() > 0 | "No line items" |
| Positive Amounts | all amounts > 0 | "Invalid amount" |
| AP Account Exists | ap_account exists | "AP account missing" |
| Inventory/Expense Accounts | accounts exist | "Account missing" |
| VAT Account | vat_input_account exists | "VAT account missing" |
| Total Matches | calculated = bill.total | "Amount mismatch" |

### Testing Checklist

- [ ] Inventory purchase generates correctly
- [ ] Expense purchase generates correctly
- [ ] Mixed bill has separate debit lines
- [ ] VAT input calculated correctly
- [ ] Non-recoverable VAT added to expense
- [ ] Vendor AP account used
- [ ] Multi-currency converted
- [ ] Entry balances (DR = CR)
- [ ] Entry links to bill
- [ ] Description includes bill number
- [ ] Product type determines account
- [ ] Zero-amount lines excluded

---

## Task 45: Add Payment Entry Generator

**Duration**: 30 minutes  
**Complexity**: Medium  
**Dependencies**: Task 44 (Purchase Entry Generator)  
**Priority**: High

### Objective

Implement PaymentEntryGenerator that creates journal entries from payment transactions, handling both payment received (from customers) and payment made (to vendors) scenarios.

### Requirements

#### Functional Requirements

1. **Payment Received Entry Generation**
   - Generate entries from PaymentReceived model
   - Debit: Cash/Bank account
   - Credit: Accounts Receivable
   - Link to customer invoice
   - Handle partial payments
   - Support payment discounts

2. **Payment Made Entry Generation**
   - Generate entries from PaymentMade model
   - Debit: Accounts Payable
   - Credit: Cash/Bank account
   - Link to vendor bill
   - Handle partial payments
   - Support payment discounts

3. **Payment Method Handling**
   - Support multiple payment methods
   - Use specific bank accounts per method
   - Handle cash payments
   - Process bank transfers
   - Support credit card payments
   - Handle check payments

4. **Discount Processing**
   - Apply early payment discounts
   - Create discount expense/income line
   - Adjust payment amount
   - Update receivable/payable balance
   - Document discount in description

### Implementation Steps

#### Step 1: Create Payment Generator Class (10 min)

1. **Define PaymentEntryGenerator class**
   - Inherit from AutoEntryGenerator
   - Add class docstring
   - Store payment reference
   - Determine payment direction (received/made)
   - Set transaction type accordingly

2. **Add payment type detector**
   - Create `get_payment_type()` method
   - Check payment model type
   - Return 'received' or 'made'
   - Store in instance variable
   - Use in line generation

3. **Implement get_debit_lines() method**
   - Check payment type
   - If received: return cash/bank debit
   - If made: return AP debit
   - Get appropriate account from mapping
   - Set amount to payment amount
   - Add payment method in description
   - Add discount line if applicable
   - Return debit lines list

4. **Implement get_credit_lines() method**
   - Check payment type
   - If received: return AR credit
   - If made: return cash/bank credit
   - Get appropriate account from mapping
   - Set amount to payment amount
   - Add payment method in description
   - Add discount line if applicable
   - Return credit lines list

#### Step 2: Handle Payment Methods (10 min)

1. **Add payment method mapper**
   - Create `get_bank_account()` method
   - Accept payment_method parameter
   - Map method to specific account:
     - CASH → Petty Cash account
     - BANK → specific bank account
     - CARD → credit card clearing account
     - CHECK → bank account
   - Return appropriate account
   - Handle missing method gracefully

2. **Support multiple bank accounts**
   - Check if payment has bank_account_id
   - Use specific account if provided
   - Fall back to default bank account
   - Validate account exists
   - Use account currency

#### Step 3: Process Payment Discounts (5 min)

1. **Calculate discount amount**
   - Check if payment has discount
   - Get discount amount or percentage
   - Calculate discount value
   - Reduce payment from full amount
   - Create discount account line

2. **Create discount lines**
   - If payment received with discount:
     - Debit: Discount Allowed (expense)
     - Total debits = payment + discount
   - If payment made with discount:
     - Credit: Discount Received (income)
     - Total credits = payment + discount
   - Balance with AR/AP full amount

#### Step 4: Handle Partial Payments (5 min)

1. **Link to invoice/bill**
   - Store reference to source invoice/bill
   - Calculate remaining balance
   - Update invoice/bill payment status
   - Track partial payment sequence
   - Allow multiple payments per invoice

2. **Calculate allocation**
   - If payment < total: mark as partial
   - Create entry for payment amount only
   - Leave remaining AR/AP balance
   - Link payment to specific invoice
   - Allow payment application

### Payment Entry Generation Flow

```
┌─────────────────────────────────────────────────────────────┐
│              PAYMENT ENTRY GENERATION                        │
└─────────────────────────────────────────────────────────────┘

PAYMENT RECEIVED FLOW:
─────────────────────

    ┌─────────────────┐
    │ Payment Received│
    │ ────────────    │
    │ From: Customer  │
    │ Amount: 1,150   │
    │ Method: Bank    │
    │ Ref: PMT-001    │
    │ Invoice: INV-001│
    └────────┬────────┘
             │
             ▼
    ┌────────────────┐
    │ PaymentEntry   │
    │ Generator      │
    └────────┬───────┘
             │
    ┌────────┴────────┐
    │                 │
    ▼                 ▼
┌─────────┐      ┌──────────┐
│ Debit:  │      │ Credit:  │
│ Bank    │      │ AR       │
│ 1,150   │      │ 1,150    │
└─────────┘      └──────────┘

Journal Entry:
DR  1000 - Bank         1,150.00
CR  1200 - AR           1,150.00

────────────────────────────────────

PAYMENT MADE FLOW:
──────────────────

    ┌─────────────────┐
    │ Payment Made    │
    │ ────────────    │
    │ To: Vendor      │
    │ Amount: 920     │
    │ Method: Bank    │
    │ Ref: PMT-002    │
    │ Bill: BILL-001  │
    └────────┬────────┘
             │
             ▼
    ┌────────────────┐
    │ PaymentEntry   │
    │ Generator      │
    └────────┬───────┘
             │
    ┌────────┴────────┐
    │                 │
    ▼                 ▼
┌─────────┐      ┌──────────┐
│ Debit:  │      │ Credit:  │
│ AP      │      │ Bank     │
│ 920     │      │ 920      │
└─────────┘      └──────────┘

Journal Entry:
DR  2000 - AP           920.00
CR  1000 - Bank         920.00
```

### Payment Entry Scenarios

#### Scenario 1: Payment Received (Full)

```
Payment Details:
- Payment: PMT-001
- Type: Received
- Customer: ABC Company
- Invoice: INV-001
- Invoice Amount: 1,150.00
- Payment Amount: 1,150.00
- Method: Bank Transfer
- Bank Account: Main Bank

Generated Entry:
┌──────────┬─────────────────────┬──────────┬─────────┐
│ Date     │ Account             │ Debit    │ Credit  │
├──────────┼─────────────────────┼──────────┼─────────┤
│ 25-Jan   │ 1000 - Bank Account │ 1,150.00 │         │
│ 25-Jan   │ 1200 - AR (ABC)     │          │ 1,150.00│
└──────────┴─────────────────────┴──────────┴─────────┘
Memo: Payment received PMT-001 for invoice INV-001
```

#### Scenario 2: Payment Received with Discount

```
Payment Details:
- Payment: PMT-002
- Type: Received
- Customer: XYZ Ltd
- Invoice: INV-002 (Amount: 1,000.00)
- Payment Amount: 980.00
- Discount: 20.00 (2% early payment)
- Method: Cash

Generated Entry:
┌──────────┬─────────────────────┬──────────┬─────────┐
│ Date     │ Account             │ Debit    │ Credit  │
├──────────┼─────────────────────┼──────────┼─────────┤
│ 25-Jan   │ 1010 - Cash         │   980.00 │         │
│ 25-Jan   │ 5300 - Disc Allowed │    20.00 │         │
│ 25-Jan   │ 1200 - AR (XYZ)     │          │ 1,000.00│
└──────────┴─────────────────────┴──────────┴─────────┘
Memo: Payment PMT-002 for INV-002 with 2% discount
```

#### Scenario 3: Payment Made (Full)

```
Payment Details:
- Payment: PMT-003
- Type: Made
- Vendor: ABC Suppliers
- Bill: BILL-001
- Bill Amount: 1,150.00
- Payment Amount: 1,150.00
- Method: Bank Transfer
- Bank Account: Main Bank

Generated Entry:
┌──────────┬─────────────────────┬──────────┬─────────┐
│ Date     │ Account             │ Debit    │ Credit  │
├──────────┼─────────────────────┼──────────┼─────────┤
│ 25-Jan   │ 2000 - AP (ABC)     │ 1,150.00 │         │
│ 25-Jan   │ 1000 - Bank Account │          │ 1,150.00│
└──────────┴─────────────────────┴──────────┴─────────┘
Memo: Payment made PMT-003 for bill BILL-001
```

#### Scenario 4: Partial Payment

```
Payment Details:
- Payment: PMT-004
- Type: Received
- Customer: DEF Corp
- Invoice: INV-003 (Amount: 5,000.00)
- Payment Amount: 2,000.00 (Partial)
- Remaining: 3,000.00
- Method: Check

Generated Entry:
┌──────────┬─────────────────────┬──────────┬─────────┐
│ Date     │ Account             │ Debit    │ Credit  │
├──────────┼─────────────────────┼──────────┼─────────┤
│ 25-Jan   │ 1000 - Bank (Check) │ 2,000.00 │         │
│ 25-Jan   │ 1200 - AR (DEF)     │          │ 2,000.00│
└──────────┴─────────────────────┴──────────┴─────────┘
Memo: Partial payment PMT-004 for INV-003 (2,000/5,000)
Note: Remaining AR balance: 3,000.00
```

### Validation Rules

| Check | Rule | Error |
|-------|------|-------|
| Payment Posted | status == 'posted' | "Payment not posted" |
| Has Amount | amount > 0 | "Amount required" |
| Has Method | payment_method is not None | "Payment method required" |
| Bank Account | bank account exists | "Bank account missing" |
| AR/AP Account | account exists | "AR/AP account missing" |
| Amount Valid | amount <= invoice total | "Amount exceeds invoice" |
| Not Duplicate | not already converted | "Entry already exists" |
| Discount Valid | discount <= amount | "Invalid discount" |

### Testing Checklist

- [ ] Payment received generates correctly
- [ ] Payment made generates correctly
- [ ] Cash payment uses cash account
- [ ] Bank payment uses bank account
- [ ] Check payment handled
- [ ] Early payment discount processed
- [ ] Partial payment creates correct entry
- [ ] Entry links to payment
- [ ] Entry links to invoice/bill
- [ ] Entry balances (DR = CR)
- [ ] Description includes payment ref
- [ ] Multiple payments per invoice work

---

## Task 46: Add Payroll Entry Generator

**Duration**: 45 minutes  
**Complexity**: High  
**Dependencies**: Task 45 (Payment Entry Generator)  
**Priority**: High

### Objective

Implement PayrollEntryGenerator that creates journal entries from payroll runs, handling Sri Lanka-specific statutory deductions including EPF (Employee Provident Fund), ETF (Employee Trust Fund), PAYE (Pay As You Earn tax), and net salary payables.

### Requirements

#### Functional Requirements

1. **Payroll Run Entry Generation**
   - Generate entries from PayrollRun model
   - Debit: Salaries Expense (gross salary)
   - Debit: EPF Employer Contribution (12%)
   - Debit: ETF Employer Contribution (3%)
   - Credit: EPF Payable (Employee 8% + Employer 12%)
   - Credit: ETF Payable (Employer 3%)
   - Credit: PAYE Payable (income tax)
   - Credit: Net Salaries Payable
   - Support multiple employees
   - Handle salary components

2. **Sri Lanka EPF Calculations**
   - Employee contribution: 8% of basic salary
   - Employer contribution: 12% of basic salary
   - Total EPF: 20% (8% + 12%)
   - Credit EPF Payable for total 20%
   - Debit only employer portion as expense
   - Employee portion deducted from net pay

3. **Sri Lanka ETF Calculations**
   - Employer contribution: 3% of basic salary
   - No employee contribution
   - Credit ETF Payable for 3%
   - Debit as employer expense

4. **PAYE Tax Calculations**
   - Calculate based on annual income
   - Apply progressive tax rates
   - Consider tax-free threshold
   - Deduct monthly PAYE
   - Credit PAYE Payable
   - Employee portion (deducted from salary)

5. **Net Salary Calculation**
   - Start with gross salary
   - Subtract employee EPF (8%)
   - Subtract PAYE tax
   - Subtract other deductions
   - Add allowances
   - Result is net pay
   - Credit Net Salaries Payable

### Implementation Steps

#### Step 1: Create Payroll Generator Class (15 min)

1. **Define PayrollEntryGenerator class**
   - Inherit from AutoEntryGenerator
   - Add class docstring for Sri Lanka payroll
   - Store payroll run reference
   - Set transaction type
   - Initialize payroll calculations

2. **Add payroll calculator helpers**
   - Create `calculate_epf()` method
     - Accept basic salary
     - Calculate employee portion (8%)
     - Calculate employer portion (12%)
     - Return tuple (employee, employer, total)
   - Create `calculate_etf()` method
     - Accept basic salary
     - Calculate employer portion (3%)
     - Return employer amount
   - Create `calculate_paye()` method
     - Accept gross salary
     - Apply tax slabs
     - Calculate monthly PAYE
     - Return PAYE amount
   - Create `calculate_net_salary()` method
     - Start with gross
     - Subtract employee deductions
     - Return net amount

#### Step 2: Implement Debit Lines Generation (15 min)

1. **Implement get_debit_lines() method**
   - Initialize debit lines list
   - Process salary expense line
   - Process EPF employer contribution line
   - Process ETF employer contribution line
   - Return complete debit lines

2. **Create salary expense line**
   - Get salaries expense account
   - Sum gross salaries for all employees
   - Create debit line for total gross
   - Description: "Salaries for {period}"
   - Include employee count

3. **Create EPF employer expense line**
   - Get EPF expense account
   - Calculate total employer EPF (12%)
   - Create debit line for employer EPF
   - Description: "EPF Employer Contribution 12%"
   - Sum for all employees

4. **Create ETF employer expense line**
   - Get ETF expense account
   - Calculate total employer ETF (3%)
   - Create debit line for employer ETF
   - Description: "ETF Employer Contribution 3%"
   - Sum for all employees

#### Step 3: Implement Credit Lines Generation (10 min)

1. **Implement get_credit_lines() method**
   - Initialize credit lines list
   - Create EPF payable line (20% total)
   - Create ETF payable line (3%)
   - Create PAYE payable line
   - Create net salaries payable line
   - Return complete credit lines

2. **Create EPF payable line**
   - Get EPF payable account (liability)
   - Calculate employee portion (8%)
   - Add employer portion (12%)
   - Total = 20% of basic salaries
   - Description: "EPF Payable (Employee 8% + Employer 12%)"

3. **Create ETF payable line**
   - Get ETF payable account (liability)
   - Calculate employer portion (3%)
   - Description: "ETF Payable (Employer 3%)"

4. **Create PAYE payable line**
   - Get PAYE payable account (liability)
   - Sum PAYE for all employees
   - Description: "PAYE Tax Payable"

5. **Create net salaries payable line**
   - Get net salaries payable account
   - Calculate for all employees:
     - Gross - Employee EPF - PAYE - Other deductions
   - Description: "Net Salaries Payable"

#### Step 4: Process Multiple Employees (5 min)

1. **Iterate through payroll lines**
   - Get all payroll_lines from run
   - For each employee line:
     - Extract salary components
     - Calculate EPF amounts
     - Calculate ETF amounts
     - Calculate PAYE
     - Calculate net pay
     - Accumulate totals

2. **Aggregate by account**
   - Sum all gross salaries
   - Sum all EPF employer amounts
   - Sum all ETF employer amounts
   - Sum all EPF payable (20%)
   - Sum all ETF payable (3%)
   - Sum all PAYE amounts
   - Sum all net pay amounts

### Payroll Entry Generation Flow

```
┌─────────────────────────────────────────────────────────────┐
│          PAYROLL RUN ENTRY GENERATION (SRI LANKA)            │
└─────────────────────────────────────────────────────────────┘

        ┌────────────────────────┐
        │    Payroll Run         │
        │    ──────────────      │
        │    Period: Jan 2026    │
        │    Employees: 10       │
        │    ──────────────      │
        │    Gross: 1,000,000    │
        │    EPF Emp(8%): 80,000 │
        │    EPF Empr(12%):120,000│
        │    ETF Empr(3%): 30,000│
        │    PAYE: 50,000        │
        │    Net Pay: 870,000    │
        └───────────┬────────────┘
                    │
                    ▼
        ┌────────────────────────┐
        │ PayrollEntryGenerator  │
        └───────────┬────────────┘
                    │
        ┌───────────┴────────────┐
        │                        │
        ▼                        ▼
┌───────────────┐      ┌─────────────────┐
│ Debit Lines:  │      │ Credit Lines:   │
│               │      │                 │
│ 1) Salaries   │      │ 1) EPF Payable  │
│    Expense    │      │    (20%)        │
│    1,000,000  │      │    200,000      │
│               │      │                 │
│ 2) EPF Exp    │      │ 2) ETF Payable  │
│    (Empr 12%) │      │    (3%)         │
│    120,000    │      │    30,000       │
│               │      │                 │
│ 3) ETF Exp    │      │ 3) PAYE Payable │
│    (Empr 3%)  │      │    50,000       │
│    30,000     │      │                 │
│               │      │ 4) Net Salaries │
│               │      │    Payable      │
│               │      │    870,000      │
└───────────────┘      └─────────────────┘
        │                       │
        └───────────┬───────────┘
                    ▼
        ┌────────────────────────┐
        │   Journal Entry        │
        │   ─────────────────    │
        │   Date: 31-Jan-2026    │
        │   Type: AUTO_PAYROLL   │
        │   Ref: PAY-202601      │
        │   ─────────────────    │
        │   DR 5100 1,000,000.00 │
        │   DR 5101   120,000.00 │
        │   DR 5102    30,000.00 │
        │   CR 2200   200,000.00 │
        │   CR 2201    30,000.00 │
        │   CR 2202    50,000.00 │
        │   CR 2100   870,000.00 │
        │   ─────────────────    │
        │   Total: 1,150,000 each│
        │   Balance: OK ✓        │
        └────────────────────────┘
```

### Payroll Entry Scenarios

#### Scenario 1: Single Employee Payroll

```
Employee: John Doe
Basic Salary: 100,000.00

Calculations:
- Gross Salary: 100,000.00
- Employee EPF (8%): 8,000.00
- Employer EPF (12%): 12,000.00
- Total EPF (20%): 20,000.00
- Employer ETF (3%): 3,000.00
- PAYE Tax: 5,000.00
- Net Salary: 100,000 - 8,000 - 5,000 = 87,000.00

Generated Entry:
┌──────────┬─────────────────────────┬──────────┬─────────┐
│ Date     │ Account                 │ Debit    │ Credit  │
├──────────┼─────────────────────────┼──────────┼─────────┤
│ 31-Jan   │ 5100 - Salaries Expense │ 100,000  │         │
│ 31-Jan   │ 5101 - EPF Expense      │  12,000  │         │
│ 31-Jan   │ 5102 - ETF Expense      │   3,000  │         │
│ 31-Jan   │ 2200 - EPF Payable      │          │  20,000 │
│ 31-Jan   │ 2201 - ETF Payable      │          │   3,000 │
│ 31-Jan   │ 2202 - PAYE Payable     │          │   5,000 │
│ 31-Jan   │ 2100 - Net Sal Payable  │          │  87,000 │
└──────────┴─────────────────────────┴──────────┴─────────┘
Total Debits: 115,000  Total Credits: 115,000
```

#### Scenario 2: Multiple Employees Payroll

```
Payroll Run: January 2026
Employees: 5

Employee Summary:
1. Employee A: Basic 100,000
2. Employee B: Basic 80,000
3. Employee C: Basic 120,000
4. Employee D: Basic 90,000
5. Employee E: Basic 110,000
Total Basic: 500,000

Calculations:
- Total Gross: 500,000.00
- Employee EPF (8%): 40,000.00
- Employer EPF (12%): 60,000.00
- Total EPF (20%): 100,000.00
- Employer ETF (3%): 15,000.00
- Total PAYE: 25,000.00
- Total Net: 500,000 - 40,000 - 25,000 = 435,000.00

Generated Entry:
┌──────────┬─────────────────────────┬──────────┬─────────┐
│ Date     │ Account                 │ Debit    │ Credit  │
├──────────┼─────────────────────────┼──────────┼─────────┤
│ 31-Jan   │ 5100 - Salaries Expense │ 500,000  │         │
│ 31-Jan   │ 5101 - EPF Expense      │  60,000  │         │
│ 31-Jan   │ 5102 - ETF Expense      │  15,000  │         │
│ 31-Jan   │ 2200 - EPF Payable      │          │ 100,000 │
│ 31-Jan   │ 2201 - ETF Payable      │          │  15,000 │
│ 31-Jan   │ 2202 - PAYE Payable     │          │  25,000 │
│ 31-Jan   │ 2100 - Net Sal Payable  │          │ 435,000 │
└──────────┴─────────────────────────┴──────────┴─────────┘
Total Debits: 575,000  Total Credits: 575,000
```

### Sri Lanka Payroll Components

```
┌─────────────────────────────────────────────────────────────┐
│              SRI LANKA PAYROLL DEDUCTIONS                    │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Component              Rate    Paid By     Account Type    │
│  ───────────────────────────────────────────────────────    │
│  EPF - Employee         8%      Employee    Deduction       │
│  EPF - Employer        12%      Employer    Expense         │
│  EPF - Total           20%      Both        Liability       │
│  ───────────────────────────────────────────────────────    │
│  ETF - Employer         3%      Employer    Expense         │
│  ───────────────────────────────────────────────────────    │
│  PAYE Tax          Variable     Employee    Deduction       │
│    (Based on annual income and tax slabs)                   │
│  ───────────────────────────────────────────────────────    │
│  Net Salary        Gross - Employee Deductions              │
│                                                              │
└──────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                  PAYROLL CALCULATION FLOW                    │
└─────────────────────────────────────────────────────────────┘

Gross Salary (Basic + Allowances)
        │
        ├──────► Employer EPF (12%) ──► Debit Expense
        │
        ├──────► Employer ETF (3%)  ──► Debit Expense
        │
        ├──────► Employee EPF (8%)  ──► Deduct from Gross
        │                              Credit Liability (with Employer)
        │
        ├──────► PAYE Tax           ──► Deduct from Gross
        │                              Credit Liability
        │
        └──────► Net Salary         ──► Credit Liability
                 (Gross - Employee EPF - PAYE)
```

### Validation Rules

| Check | Rule | Error |
|-------|------|-------|
| Run Posted | status == 'approved' | "Payroll not approved" |
| Has Employees | employees.count() > 0 | "No employees" |
| Positive Amounts | all amounts > 0 | "Invalid salary amount" |
| EPF Calculation | epf_total = employee + employer | "EPF mismatch" |
| ETF Calculation | etf = 3% of basic | "ETF mismatch" |
| Net Calculation | net = gross - deductions | "Net salary mismatch" |
| Accounts Exist | all payroll accounts exist | "Account missing" |
| Balance Valid | total debits = total credits | "Entry not balanced" |

### Testing Checklist

- [ ] Single employee payroll generates correctly
- [ ] Multiple employees aggregated properly
- [ ] EPF calculated correctly (8% + 12%)
- [ ] ETF calculated correctly (3%)
- [ ] PAYE calculated based on tax slabs
- [ ] Net salary calculated correctly
- [ ] Entry balances (DR = CR)
- [ ] All payroll accounts used
- [ ] Entry links to payroll run
- [ ] Description includes period
- [ ] Decimal precision maintained
- [ ] Zero salaries excluded

---

## Task 47: Add Inventory Entry Generator

**Duration**: 30 minutes  
**Complexity**: Medium  
**Dependencies**: Task 46 (Payroll Entry Generator)  
**Priority**: Medium

### Objective

Implement InventoryEntryGenerator that creates journal entries from inventory adjustments, handling stock write-offs, damaged goods, theft losses, and inventory revaluations.

### Requirements

#### Functional Requirements

1. **Inventory Adjustment Entry Generation**
   - Generate entries from InventoryAdjustment model
   - Handle increase adjustments (positive)
   - Handle decrease adjustments (negative)
   - Debit/Credit: Inventory Account
   - Debit/Credit: Inventory Adjustment Account
   - Support adjustment reasons
   - Track adjustment types

2. **Adjustment Types**
   - **Stock Write-Off**: Damaged/expired goods
   - **Loss/Theft**: Missing inventory
   - **Revaluation**: Price adjustments
   - **Physical Count Adjustment**: Reconciliation
   - **Return to Supplier**: Credit adjustments
   - Each type may use different expense account

3. **Product-Specific Accounts**
   - Use product category accounts if configured
   - Support warehouse-specific accounts
   - Handle product valuation methods
   - Track by location if applicable

4. **Cost Calculation**
   - Use weighted average cost
   - Support FIFO/LIFO if applicable
   - Calculate total adjustment value
   - Handle unit cost changes
   - Round to appropriate precision

### Implementation Steps

#### Step 1: Create Inventory Generator Class (10 min)

1. **Define InventoryEntryGenerator class**
   - Inherit from AutoEntryGenerator
   - Add class docstring
   - Store inventory adjustment reference
   - Set transaction type
   - Initialize cost calculator

2. **Add adjustment type detector**
   - Create `get_adjustment_type()` method
   - Read adjustment.type field
   - Return adjustment type enum
   - Map to appropriate accounts
   - Use in account selection

3. **Implement get_debit_lines() method**
   - Check if adjustment increases or decreases
   - If increase: debit Inventory
   - If decrease: debit Inventory Adjustment Expense
   - Calculate adjustment value (qty × cost)
   - Group by product/category if multiple
   - Return debit lines list

4. **Implement get_credit_lines() method**
   - Check if adjustment increases or decreases
   - If increase: credit Inventory Adjustment Income
   - If decrease: credit Inventory
   - Calculate adjustment value
   - Group by product/category if multiple
   - Return credit lines list

#### Step 2: Handle Adjustment Types (10 min)

1. **Map adjustment types to accounts**
   - Create `get_adjustment_account()` method
   - Accept adjustment_type parameter
   - Return appropriate account based on type:
     - WRITE_OFF → Cost of Goods Sold or Write-Off Expense
     - LOSS_THEFT → Loss/Theft Expense
     - REVALUATION → Inventory Revaluation (equity)
     - PHYSICAL_COUNT → Inventory Adjustment
     - RETURN → Inventory or AP adjustment
   - Use tenant-specific mapping
   - Fall back to default adjustment account

2. **Handle positive adjustments**
   - Increase in inventory quantity
   - Debit: Inventory account
   - Credit: Inventory Adjustment Income or AP
   - Used for found items, corrections

3. **Handle negative adjustments**
   - Decrease in inventory quantity
   - Debit: Inventory Adjustment Expense
   - Credit: Inventory account
   - Used for losses, damages, write-offs

#### Step 3: Calculate Adjustment Value (5 min)

1. **Implement cost calculator**
   - Create `calculate_adjustment_value()` method
   - Get product unit cost
   - Multiply by adjustment quantity
   - Use weighted average cost method
   - Handle cost override if provided
   - Return total adjustment value

2. **Handle multiple products**
   - Iterate through adjustment lines
   - Calculate value per line
   - Sum for entry creation
   - Group by account if needed
   - Create separate lines per product/category

#### Step 4: Add Warehouse Support (5 min)

1. **Handle warehouse-specific accounts**
   - Check if adjustment has warehouse
   - Use warehouse-specific inventory account
   - Fall back to general inventory account
   - Support multi-warehouse scenarios

2. **Add location tracking**
   - Store warehouse/location in entry memo
   - Link to adjustment record
   - Support location-based reporting
   - Track inter-warehouse transfers separately

### Inventory Adjustment Entry Flow

```
┌─────────────────────────────────────────────────────────────┐
│         INVENTORY ADJUSTMENT ENTRY GENERATION                │
└─────────────────────────────────────────────────────────────┘

NEGATIVE ADJUSTMENT (Write-Off):
────────────────────────────────

    ┌──────────────────────┐
    │ Inventory Adjustment │
    │ ──────────────────── │
    │ Type: WRITE_OFF      │
    │ Product: Widget A    │
    │ Qty: -10             │
    │ Unit Cost: 50.00     │
    │ Total: -500.00       │
    │ Reason: Damaged      │
    └──────────┬───────────┘
               │
               ▼
    ┌──────────────────────┐
    │ InventoryEntryGen    │
    └──────────┬───────────┘
               │
      ┌────────┴─────────┐
      │                  │
      ▼                  ▼
┌──────────┐      ┌─────────────┐
│ Debit:   │      │ Credit:     │
│ Inv Adj  │      │ Inventory   │
│ Expense  │      │ 500.00      │
│ 500.00   │      └─────────────┘
└──────────┘

Journal Entry:
DR  5200 - Inventory Adj Expense   500.00
CR  1300 - Inventory                500.00

────────────────────────────────────────────

POSITIVE ADJUSTMENT (Found):
────────────────────────────

    ┌──────────────────────┐
    │ Inventory Adjustment │
    │ ──────────────────── │
    │ Type: PHYSICAL_COUNT │
    │ Product: Widget B    │
    │ Qty: +5              │
    │ Unit Cost: 40.00     │
    │ Total: +200.00       │
    │ Reason: Count Surplus│
    └──────────┬───────────┘
               │
               ▼
    ┌──────────────────────┐
    │ InventoryEntryGen    │
    └──────────┬───────────┘
               │
      ┌────────┴─────────┐
      │                  │
      ▼                  ▼
┌──────────┐      ┌─────────────┐
│ Debit:   │      │ Credit:     │
│Inventory │      │ Inv Adj Inc │
│ 200.00   │      │ 200.00      │
└──────────┘      └─────────────┘

Journal Entry:
DR  1300 - Inventory                200.00
CR  4900 - Inventory Adj Income     200.00
```

### Inventory Entry Scenarios

#### Scenario 1: Stock Write-Off (Damaged Goods)

```
Adjustment Details:
- Adjustment: ADJ-001
- Type: WRITE_OFF
- Product: Widget A
- Quantity: -10
- Unit Cost: 50.00
- Total Value: 500.00
- Reason: Water damaged

Generated Entry:
┌──────────┬─────────────────────────┬──────────┬─────────┐
│ Date     │ Account                 │ Debit    │ Credit  │
├──────────┼─────────────────────────┼──────────┼─────────┤
│ 25-Jan   │ 5200 - Inv Adj Expense  │   500.00 │         │
│ 25-Jan   │ 1300 - Inventory        │          │   500.00│
└──────────┴─────────────────────────┴──────────┴─────────┘
Memo: Write-off ADJ-001 - Water damaged inventory
```

#### Scenario 2: Inventory Loss (Theft)

```
Adjustment Details:
- Adjustment: ADJ-002
- Type: LOSS_THEFT
- Product: Product B
- Quantity: -5
- Unit Cost: 100.00
- Total Value: 500.00
- Reason: Stock discrepancy

Generated Entry:
┌──────────┬─────────────────────────┬──────────┬─────────┐
│ Date     │ Account                 │ Debit    │ Credit  │
├──────────┼─────────────────────────┼──────────┼─────────┤
│ 25-Jan   │ 5210 - Loss/Theft Exp   │   500.00 │         │
│ 25-Jan   │ 1300 - Inventory        │          │   500.00│
└──────────┴─────────────────────────┴──────────┴─────────┘
Memo: Inventory loss ADJ-002 - Stock discrepancy
```

#### Scenario 3: Physical Count Surplus

```
Adjustment Details:
- Adjustment: ADJ-003
- Type: PHYSICAL_COUNT
- Product: Widget C
- Quantity: +8
- Unit Cost: 75.00
- Total Value: 600.00
- Reason: Found during stocktake

Generated Entry:
┌──────────┬─────────────────────────┬──────────┬─────────┐
│ Date     │ Account                 │ Debit    │ Credit  │
├──────────┼─────────────────────────┼──────────┼─────────┤
│ 25-Jan   │ 1300 - Inventory        │   600.00 │         │
│ 25-Jan   │ 4900 - Inv Adj Income   │          │   600.00│
└──────────┴─────────────────────────┴──────────┴─────────┘
Memo: Inventory surplus ADJ-003 - Found during stocktake
```

#### Scenario 4: Multi-Product Adjustment

```
Adjustment Details:
- Adjustment: ADJ-004
- Type: PHYSICAL_COUNT
- Product A: Qty -3, Cost 50.00, Value -150.00
- Product B: Qty +2, Cost 100.00, Value +200.00
- Net Adjustment: +50.00

Generated Entry:
┌──────────┬─────────────────────────┬──────────┬─────────┐
│ Date     │ Account                 │ Debit    │ Credit  │
├──────────┼─────────────────────────┼──────────┼─────────┤
│ 25-Jan   │ 1300 - Inventory (B)    │   200.00 │         │
│ 25-Jan   │ 1300 - Inventory (A)    │          │   150.00│
│ 25-Jan   │ 4900 - Inv Adj Income   │          │    50.00│
└──────────┴─────────────────────────┴──────────┴─────────┘
Memo: Mixed adjustment ADJ-004 - Physical count
```

### Validation Rules

| Check | Rule | Error |
|-------|------|-------|
| Adjustment Approved | status == 'approved' | "Adjustment not approved" |
| Has Product | product is not None | "Product required" |
| Valid Quantity | quantity != 0 | "Quantity cannot be zero" |
| Valid Cost | unit_cost > 0 | "Cost must be positive" |
| Inventory Account | inventory_account exists | "Inventory account missing" |
| Adjustment Account | adjustment_account exists | "Adjustment account missing" |
| Sufficient Stock | if negative, qty available | "Insufficient stock" |

### Testing Checklist

- [ ] Negative adjustment (write-off) generates correctly
- [ ] Positive adjustment (found) generates correctly
- [ ] Loss/theft uses correct expense account
- [ ] Physical count adjustments work
- [ ] Multi-product adjustments handled
- [ ] Cost calculated using weighted average
- [ ] Warehouse-specific accounts used if configured
- [ ] Entry balances (DR = CR)
- [ ] Entry links to adjustment
- [ ] Description includes adjustment type
- [ ] Zero adjustments excluded
- [ ] Decimal precision maintained

---

## Task 48: Create Entry Posting Trigger

**Duration**: 35 minutes  
**Complexity**: Medium  
**Dependencies**: Task 47 (Inventory Entry Generator)  
**Priority**: High

### Objective

Implement Celery signal triggers that automatically invoke entry generators when business transactions are posted, using Django signals and Celery tasks for asynchronous processing.

### Requirements

#### Functional Requirements

1. **Django Signal Handlers**
   - Listen to post_save signals on transaction models
   - Register signals for:
     - SalesInvoice
     - PurchaseBill
     - PaymentReceived
     - PaymentMade
     - PayrollRun
     - InventoryAdjustment
   - Check transaction status before processing
   - Prevent duplicate entries

2. **Celery Task Integration**
   - Create Celery task for each generator
   - Queue tasks for async processing
   - Handle task failures gracefully
   - Implement task retry logic
   - Log task execution
   - Send notifications on errors

3. **Conditional Triggering**
   - Only trigger when transaction is posted/approved
   - Check if auto-entry is enabled in tenant settings
   - Verify entry doesn't already exist
   - Validate transaction completeness
   - Skip if manual entry flag set

4. **Error Recovery**
   - Catch and log all exceptions
   - Send error notifications
   - Preserve transaction state
   - Allow manual retry
   - Create error audit trail

### Implementation Steps

#### Step 1: Create Signal Handlers (15 min)

1. **Create signals module**
   - Create file `backend/apps/accounting/signals/auto_entry_signals.py`
   - Import necessary Django signals
   - Import all transaction models
   - Import entry generator classes
   - Import Celery task decorators

2. **Define signal handler functions**
   - Create `handle_sales_invoice_post_save()`
     - Accept sender, instance, created, kwargs
     - Check if instance.status == 'posted'
     - Check if entry not already generated
     - Call celery task: `generate_sales_entry.delay(instance.id)`
   - Create `handle_purchase_bill_post_save()`
     - Similar pattern for purchase bills
     - Call `generate_purchase_entry.delay()`
   - Create handlers for payment, payroll, inventory

3. **Register signal handlers**
   - Connect each handler to appropriate model
   - Use `post_save` signal
   - Set dispatch_uid to prevent duplicates
   - Register in AppConfig.ready() method

4. **Add signal configuration**
   - Create `apps.py` signal registration
   - Import signals in `__init__.py`
   - Ensure signals loaded on app startup

#### Step 2: Create Celery Tasks (10 min)

1. **Create Celery tasks module**
   - Create file `backend/apps/accounting/tasks/auto_entry_tasks.py`
   - Import Celery app
   - Import entry generators
   - Import transaction models

2. **Define entry generation tasks**
   - Create `@shared_task` for each generator:
   
   **Task: generate_sales_entry**
   - Accept invoice_id parameter
   - Query SalesInvoice by ID
   - Instantiate SalesEntryGenerator
   - Call generator.generate_entry()
   - Handle exceptions
   - Return entry ID if successful
   - Log result

   **Task: generate_purchase_entry**
   - Similar pattern for purchase bills
   - Use PurchaseEntryGenerator

   **Task: generate_payment_entry**
   - Handle both received and made payments
   - Use PaymentEntryGenerator

   **Task: generate_payroll_entry**
   - Handle payroll runs
   - Use PayrollEntryGenerator

   **Task: generate_inventory_entry**
   - Handle inventory adjustments
   - Use InventoryEntryGenerator

3. **Add task configuration**
   - Set task name
   - Set max_retries = 3
   - Set default_retry_delay = 60 seconds
   - Set bind=True for self reference
   - Set autoretry_for specific exceptions

#### Step 3: Implement Conditional Logic (5 min)

1. **Add condition checker**
   - Create `should_generate_entry()` helper
   - Check tenant auto_entry_enabled setting
   - Check transaction status is posted/approved
   - Check journal_entry_id is None
   - Check manual_entry flag is False
   - Return boolean

2. **Integrate condition checker**
   - Call in each signal handler
   - Only queue task if returns True
   - Log when skipping
   - Document skip reason

3. **Handle tenant settings**
   - Query tenant settings for auto_entry
   - Support per-module toggles
   - Allow disabling specific generators
   - Cache settings for performance

#### Step 4: Add Error Handling (5 min)

1. **Implement error handling in tasks**
   - Wrap generation in try/except
   - Catch EntryGenerationError
   - Catch all Exception as fallback
   - Log error with traceback
   - Create error notification
   - Mark transaction with error flag

2. **Add retry logic**
   - Use Celery's retry mechanism
   - Retry on temporary errors
   - Don't retry on validation errors
   - Increment retry counter
   - Log retry attempts

3. **Create error notification**
   - Send email to accounting team
   - Create system notification
   - Include transaction details
   - Include error message
   - Provide retry button

### Signal and Task Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│           AUTO ENTRY GENERATION TRIGGER FLOW                 │
└─────────────────────────────────────────────────────────────┘

User Action:
┌──────────────────┐
│ Post Sales       │
│ Invoice          │
│ (via API/UI)     │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ SalesInvoice     │
│ .save()          │
│ status='posted'  │
└────────┬─────────┘
         │
         ▼ Django post_save signal
┌────────────────────────────────────┐
│ Signal Handler                     │
│ handle_sales_invoice_post_save()   │
│                                    │
│ 1. Check status == 'posted'        │
│ 2. Check not already converted     │
│ 3. Check auto_entry enabled        │
│ 4. If all OK:                      │
│    → Queue Celery task             │
└────────┬───────────────────────────┘
         │
         ▼
┌────────────────────────────────────┐
│ Celery Task Queue                  │
│ Task: generate_sales_entry         │
│ Args: invoice_id                   │
└────────┬───────────────────────────┘
         │
         ▼ Async execution
┌────────────────────────────────────┐
│ Celery Worker                      │
│                                    │
│ 1. Fetch invoice from DB           │
│ 2. Instantiate SalesEntryGen       │
│ 3. Call generate_entry()           │
│ 4. Handle result                   │
└────────┬───────────────────────────┘
         │
    ┌────┴────┐
    │         │
    ▼         ▼
┌────────┐ ┌──────────┐
│Success │ │  Error   │
│        │ │          │
│- Entry │ │- Log err │
│created │ │- Notify  │
│- Link  │ │- Retry?  │
│  saved │ │          │
└────────┘ └──────────┘
```

### Multi-Transaction Signal Registration

```
┌─────────────────────────────────────────────────────────────┐
│              SIGNAL REGISTRATION MAPPING                     │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Model              Signal       Handler                    │
│  ──────────────────────────────────────────────────────     │
│  SalesInvoice       post_save    handle_sales_post_save     │
│                                   → generate_sales_entry     │
│  ──────────────────────────────────────────────────────     │
│  PurchaseBill       post_save    handle_purchase_post_save  │
│                                   → generate_purchase_entry  │
│  ──────────────────────────────────────────────────────     │
│  PaymentReceived    post_save    handle_payment_rcv_post    │
│                                   → generate_payment_entry   │
│  ──────────────────────────────────────────────────────     │
│  PaymentMade        post_save    handle_payment_made_post   │
│                                   → generate_payment_entry   │
│  ──────────────────────────────────────────────────────     │
│  PayrollRun         post_save    handle_payroll_post_save   │
│                                   → generate_payroll_entry   │
│  ──────────────────────────────────────────────────────     │
│  InventoryAdjust    post_save    handle_inventory_post_save │
│                                   → generate_inventory_entry │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

### Signal Handler Implementation Pattern

```
Signal Handler Structure:
─────────────────────────

@receiver(post_save, sender=SalesInvoice, dispatch_uid="auto_sales_entry")
def handle_sales_invoice_post_save(sender, instance, created, **kwargs):
    """
    Generate journal entry when sales invoice is posted.
    """
    
    # Step 1: Check if should process
    if not should_generate_entry(instance, 'sales'):
        return
    
    # Step 2: Validate transaction state
    if instance.status != 'posted':
        return
    
    # Step 3: Check not already generated
    if instance.journal_entry_id:
        return
    
    # Step 4: Queue Celery task (async)
    try:
        generate_sales_entry.delay(instance.id)
        logger.info(f"Queued sales entry generation for {instance.number}")
    except Exception as e:
        logger.error(f"Failed to queue sales entry: {e}")
        # Don't raise - allow transaction to complete


Celery Task Structure:
──────────────────────

@shared_task(bind=True, max_retries=3, default_retry_delay=60)
def generate_sales_entry(self, invoice_id):
    """
    Celery task to generate journal entry from sales invoice.
    """
    
    try:
        # Step 1: Fetch transaction
        invoice = SalesInvoice.objects.get(id=invoice_id)
        
        # Step 2: Double-check not already generated
        if invoice.journal_entry_id:
            return {'status': 'skipped', 'reason': 'already_generated'}
        
        # Step 3: Generate entry
        generator = SalesEntryGenerator(invoice)
        entry = generator.generate_entry()
        
        # Step 4: Update transaction
        invoice.journal_entry_id = entry.id
        invoice.save(update_fields=['journal_entry_id'])
        
        # Step 5: Return success
        return {
            'status': 'success',
            'entry_id': str(entry.id),
            'invoice_number': invoice.number
        }
        
    except SalesInvoice.DoesNotExist:
        logger.error(f"Invoice {invoice_id} not found")
        return {'status': 'error', 'reason': 'not_found'}
        
    except EntryGenerationError as e:
        logger.error(f"Entry generation failed: {e}")
        # Don't retry on validation errors
        return {'status': 'error', 'reason': str(e)}
        
    except Exception as e:
        logger.error(f"Unexpected error: {e}", exc_info=True)
        # Retry on unexpected errors
        raise self.retry(exc=e)
```

### Tenant Settings Configuration

```
┌─────────────────────────────────────────────────────────────┐
│                  TENANT AUTO-ENTRY SETTINGS                  │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Setting Name                    Value    Description       │
│  ──────────────────────────────────────────────────────     │
│  auto_entry_enabled              True     Master switch     │
│  auto_entry_sales                True     Sales invoices    │
│  auto_entry_purchases            True     Purchase bills    │
│  auto_entry_payments             True     Payments          │
│  auto_entry_payroll              True     Payroll runs      │
│  auto_entry_inventory            False    Inventory adj     │
│  auto_entry_post_immediately     False    Auto-post entries │
│  auto_entry_notify_on_error      True     Email on error    │
│  auto_entry_retry_failed         True     Auto-retry        │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

### Error Scenarios and Handling

| Error Type | Retry? | Notification | Action |
|------------|--------|--------------|--------|
| Account Missing | No | Yes | Manual fix required |
| Balance Error | No | Yes | Review transaction |
| Network Error | Yes | After 3 retries | Auto-retry |
| Database Lock | Yes | No | Wait and retry |
| Validation Error | No | Yes | Fix source data |
| Transaction Not Found | No | Yes | Check deletion |
| Permission Error | No | Yes | Check user roles |
| Duplicate Entry | No | No | Skip silently |

### Validation Rules

| Check | Rule | Error |
|-------|------|-------|
| Status Check | status in ['posted', 'approved'] | "Transaction not posted" |
| Duplicate Check | journal_entry_id is None | "Entry already exists" |
| Settings Check | tenant.auto_entry_enabled == True | "Auto-entry disabled" |
| Model Exists | transaction object exists | "Transaction not found" |
| Task Queue | Celery available | "Task queue unavailable" |

### Testing Checklist

- [ ] Signal handlers registered correctly
- [ ] Signal triggers only when posted
- [ ] Duplicate entries prevented
- [ ] Celery tasks execute successfully
- [ ] Tasks retry on failure
- [ ] Error notifications sent
- [ ] Tenant settings respected
- [ ] Manual entry flag honored
- [ ] All transaction types supported
- [ ] Async processing works
- [ ] Task results logged
- [ ] Failed tasks can be manually retried

---

## Integration Patterns

### End-to-End Integration Flow

```
┌─────────────────────────────────────────────────────────────────┐
│         COMPLETE AUTO-ENTRY INTEGRATION WORKFLOW                 │
└─────────────────────────────────────────────────────────────────┘

1. SALES ORDER TO CASH FLOW
───────────────────────────

Sales Order → Sales Invoice → Payment Received
     │              │                │
     │              ▼                ▼
     │    [Auto Entry #1]    [Auto Entry #2]
     │    DR AR 1,150        DR Bank 1,150
     │    CR Sales 1,000     CR AR 1,150
     │    CR VAT 150
     │
     └───► Inventory Deduction → [Auto Entry #3]
                                  DR COGS 800
                                  CR Inventory 800


2. PURCHASE TO PAY FLOW
───────────────────────

Purchase Order → Purchase Bill → Payment Made
      │               │                │
      │               ▼                ▼
      │      [Auto Entry #1]    [Auto Entry #2]
      │      DR Inventory 800   DR AP 920
      │      DR VAT In 120      CR Bank 920
      │      CR AP 920


3. PAYROLL CYCLE
────────────────

Payroll Run → [Auto Entry] → Payment Made → [Auto Entry]
      │             │               │              │
      ▼             ▼               ▼              ▼
   Approve      DR Salaries     Pay Staff    DR Net Sal Pay
                DR EPF Exp                   CR Bank
                DR ETF Exp
                CR EPF Pay
                CR ETF Pay
                CR PAYE Pay
                CR Net Pay


4. INVENTORY MANAGEMENT
───────────────────────

Stock Receipt → Purchase → [Auto Entry] → Stock Issue → [Auto Entry]
      │            │             │             │              │
      ▼            ▼             ▼             ▼              ▼
   Receive      Approve    DR Inventory    Issue to     DR COGS
   Goods                   CR AP            Prod         CR Inventory
```

### Generator Interaction Matrix

```
┌───────────────────────────────────────────────────────────────┐
│           GENERATOR DEPENDENCIES & INTERACTIONS                │
├───────────────────────────────────────────────────────────────┤
│                                                                │
│  Generator         Triggers           Updates                 │
│  ────────────────────────────────────────────────────────     │
│  Sales             → AR increases     → Customer balance       │
│                    → Revenue records  → Revenue recognition    │
│                    → VAT liability    → Tax reports            │
│  ────────────────────────────────────────────────────────     │
│  Purchase          → AP increases     → Vendor balance         │
│                    → Inventory up     → Stock valuation        │
│                    → VAT asset        → Tax recovery           │
│  ────────────────────────────────────────────────────────     │
│  Payment Rcvd      → AR decreases     → Customer balance       │
│                    → Cash increases   → Bank reconciliation    │
│  ────────────────────────────────────────────────────────     │
│  Payment Made      → AP decreases     → Vendor balance         │
│                    → Cash decreases   → Bank reconciliation    │
│  ────────────────────────────────────────────────────────     │
│  Payroll           → Expense records  → Labor costs            │
│                    → Liabilities up   → Statutory obligations  │
│                    → Net pay pending  → Staff payments         │
│  ────────────────────────────────────────────────────────     │
│  Inventory Adj     → Inventory change → Stock valuation        │
│                    → Expense/Income   → P&L adjustment         │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

---

## Testing Strategy

### Unit Testing

#### Test Coverage Requirements

- Each generator class: 90%+ coverage
- Signal handlers: 100% coverage
- Celery tasks: 90%+ coverage
- Validation logic: 100% coverage
- Error handling: 100% coverage

#### Generator Test Cases

**AutoEntryGenerator Base Class**
- Test validate_source with valid transaction
- Test validate_source with invalid transaction
- Test load_account_mapping returns correct mapping
- Test validate_balance with balanced entry
- Test validate_balance with unbalanced entry
- Test create_entry calls service correctly
- Test link_to_source updates transaction
- Test abstract methods raise NotImplementedError
- Test error handling and rollback

**SalesEntryGenerator**
- Test single-item invoice entry generation
- Test multi-item invoice with aggregation
- Test VAT calculation accuracy
- Test discount handling
- Test tax-exempt items
- Test multi-currency conversion
- Test customer AR account usage
- Test entry balance validation
- Test entry linking to invoice

**PurchaseEntryGenerator**
- Test inventory item purchase entry
- Test expense item purchase entry
- Test mixed inventory and expense
- Test VAT input calculation
- Test non-recoverable VAT handling
- Test vendor AP account usage
- Test entry balance validation

**PaymentEntryGenerator**
- Test payment received entry
- Test payment made entry
- Test payment with discount
- Test partial payment
- Test different payment methods
- Test bank account selection

**PayrollEntryGenerator**
- Test single employee payroll
- Test multiple employees aggregation
- Test EPF calculation (8% + 12%)
- Test ETF calculation (3%)
- Test PAYE calculation
- Test net salary calculation
- Test entry balance with all components

**InventoryEntryGenerator**
- Test negative adjustment (write-off)
- Test positive adjustment (found)
- Test different adjustment types
- Test multi-product adjustments
- Test warehouse-specific accounts

### Integration Testing

#### Signal Integration Tests

- Test signal triggers on transaction post
- Test signal skips if already processed
- Test signal respects tenant settings
- Test signal handles errors gracefully
- Test signal doesn't block transaction save

#### Celery Task Tests

- Test task queues successfully
- Test task executes and creates entry
- Test task retries on failure
- Test task sends error notifications
- Test task updates transaction link

### End-to-End Testing

#### Complete Transaction Flows

**Sales-to-Cash Flow**
1. Create and post sales invoice
2. Verify auto-entry created
3. Verify AR balance updated
4. Create and post payment received
5. Verify payment entry created
6. Verify AR balance cleared

**Purchase-to-Pay Flow**
1. Create and approve purchase bill
2. Verify auto-entry created
3. Verify AP balance updated
4. Verify inventory increased
5. Create and post payment made
6. Verify payment entry created
7. Verify AP balance cleared

**Payroll Processing Flow**
1. Create and approve payroll run
2. Verify auto-entry with all components
3. Verify all liability accounts updated
4. Create payment for net salaries
5. Verify payment entry created

### Performance Testing

- Test generation time for single transaction: < 1 second
- Test bulk generation for 100 transactions: < 30 seconds
- Test concurrent generation: no deadlocks
- Test queue processing throughput
- Test database query optimization

### Error Scenario Testing

- Test missing account mapping handling
- Test unbalanced entry detection
- Test duplicate entry prevention
- Test transaction not found handling
- Test permission errors
- Test network failures and retries
- Test database lock handling

---

## Validation Rules

### Pre-Generation Validation

| Validation | Check | Error Message |
|------------|-------|---------------|
| Transaction Status | Must be posted/approved | "Transaction not ready for entry generation" |
| Required Fields | All mandatory fields populated | "Missing required field: {field}" |
| Account Mapping | All accounts exist in mapping | "Account mapping not found for {type}" |
| Amounts Valid | All amounts positive | "Amount must be positive" |
| Balance Check | DR total = CR total (pre-check) | "Entry would not balance" |

### Post-Generation Validation

| Validation | Check | Error Message |
|------------|-------|---------------|
| Entry Created | Entry object exists | "Failed to create entry" |
| Entry Balanced | DR sum = CR sum | "Entry not balanced: DR={} CR={}" |
| Lines Created | Line count > 0 | "No entry lines created" |
| Link Established | Transaction linked to entry | "Failed to link entry" |
| Amounts Match | Entry total = Transaction total | "Entry amount mismatch" |

### Business Rule Validation

| Rule | Validation | Action |
|------|------------|--------|
| Duplicate Prevention | Check journal_entry_id is None | Skip generation |
| Tenant Setting | Check auto_entry_enabled | Skip if disabled |
| Account Exists | Verify all accounts in chart | Error if missing |
| Currency Consistency | All lines same currency | Convert if needed |
| Date Validity | Entry date <= today | Error if future |
| Status Required | Transaction status check | Error if not posted |

---

## Conclusion

This document has provided comprehensive instructions for implementing the Auto-Generated Entry Generator system, covering seven critical tasks:

1. **Task 42**: Base AutoEntryGenerator with validation and balance checking
2. **Task 43**: SalesEntryGenerator for AR, revenue, and VAT output
3. **Task 44**: PurchaseEntryGenerator for inventory/expense, VAT input, and AP
4. **Task 45**: PaymentEntryGenerator for cash/bank and AR/AP
5. **Task 46**: PayrollEntryGenerator for Sri Lanka EPF, ETF, PAYE, and net pay
6. **Task 47**: InventoryEntryGenerator for stock adjustments
7. **Task 48**: Signal triggers and Celery tasks for automated processing

The auto-entry generation system significantly reduces manual accounting work, eliminates errors, and ensures real-time financial accuracy across all business modules.

### Key Implementation Points

- Use abstract base class pattern for generator hierarchy
- Implement comprehensive validation at each step
- Handle Sri Lanka-specific statutory requirements
- Support multi-currency and multi-tenant scenarios
- Use Celery for asynchronous processing
- Implement robust error handling and retry logic
- Maintain complete audit trails
- Respect tenant configuration settings

### Next Steps

1. Proceed to [Group-D Templates & Recurring Entries](../Group-D_Templates-Recurring/)
2. Implement recurring entry generation
3. Create entry templates for common transactions
4. Build scheduled entry processing

---

**Document Control**
- Version: 1.0
- Last Updated: 2026-01-25
- Author: LankaCommerce Documentation Team
- Status: Complete
- Total Lines: 994
