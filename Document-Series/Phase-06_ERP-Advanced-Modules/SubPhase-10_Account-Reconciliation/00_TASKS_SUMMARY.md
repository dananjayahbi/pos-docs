# SubPhase 10: Account Reconciliation - Tasks Summary

> **Phase:** 06 - ERP Advanced Modules  
> **SubPhase Index:** 10 of 14  
> **SubPhase Goal:** Match accounting records with bank statements  
> **Total Tasks:** 84 | **Status:** Planning  
> **Estimated Duration:** 12-14 hours

---

## Navigation

- **↑ Parent:** [00_SUBPHASES_SUMMARY.md](../00_SUBPHASES_SUMMARY.md)
- **← Previous SubPhase:** [SubPhase-09_Journal-Entries](../SubPhase-09_Journal-Entries/)
- **→ Next SubPhase:** [SubPhase-11_Financial-Reports](../SubPhase-11_Financial-Reports/)

---

## SubPhase Overview

This sub-phase implements the account reconciliation system, primarily focused on bank reconciliation. Enables import of bank statements, automatic and manual matching of transactions, reconciliation workflows, and comprehensive reporting on unreconciled items.

### Key Outcomes
- Bank account configuration
- Bank statement import (CSV, OFX formats)
- Automatic transaction matching
- Manual matching interface
- Reconciliation session management
- Adjusting entry creation from reconciliation
- Reconciliation reports
- Unreconciled items tracking
- Reconciliation history

### Technology Context
- **Backend:** Django 5.x with DRF for API
- **Import:** CSV/OFX parsing libraries
- **Matching:** Rule-based matching engine
- **Frontend:** Next.js 14+ with TypeScript
- **UI:** Interactive matching interface

### Dependencies
- Phase-06 SubPhase-08: Chart of Accounts (bank accounts)
- Phase-06 SubPhase-09: Journal Entries (transactions)

---

## Task Execution Order

```
TASK GROUP A: Bank Account Configuration (Tasks 01-14)
        │
        ▼
TASK GROUP B: Statement Import (Tasks 15-30)
        │
        ▼
TASK GROUP C: Matching Engine (Tasks 31-48)
        │
        ▼
TASK GROUP D: Reconciliation Workflow (Tasks 49-64)
        │
        ▼
TASK GROUP E: Reporting & History (Tasks 65-76)
        │
        ▼
TASK GROUP F: API, Testing & Documentation (Tasks 77-84)
```

---

## Task Index

### Group A: Bank Account Configuration (Tasks 01-14)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 01 | **Extend accounting App** | Add reconciliation module to accounting app | None | 🔴 Not Created |
| 02 | **Define BankAccountType Enum** | Create: CHECKING, SAVINGS, CREDIT_CARD, CASH | Task 01 | 🔴 Not Created |
| 03 | **Create BankAccount Model** | Bank account configuration | Task 02 | 🔴 Not Created |
| 04 | **Add Bank Account Name** | Add account_name (e.g., "BOC Business") | Task 03 | 🔴 Not Created |
| 05 | **Add Bank Account Number** | Add account_number field | Task 03 | 🔴 Not Created |
| 06 | **Add Bank Name Field** | Add bank_name (e.g., "Bank of Ceylon") | Task 03 | 🔴 Not Created |
| 07 | **Add Bank Branch Field** | Add branch_name, branch_code | Task 03 | 🔴 Not Created |
| 08 | **Add GL Account FK** | Link to Chart of Accounts | Task 03 | 🔴 Not Created |
| 09 | **Add Account Type Field** | Add type using BankAccountType | Task 03 | 🔴 Not Created |
| 10 | **Add Currency Field** | Add currency code (LKR default) | Task 03 | 🔴 Not Created |
| 11 | **Add Last Reconciled Date** | Track last reconciliation date | Task 03 | 🔴 Not Created |
| 12 | **Add Last Reconciled Balance** | Store last reconciled balance | Task 03 | 🔴 Not Created |
| 13 | **Add Active Flag** | Add is_active boolean | Task 03 | 🔴 Not Created |
| 14 | **Run BankAccount Migrations** | Generate and apply migrations | Task 13 | 🔴 Not Created |

---

### Group B: Statement Import (Tasks 15-30)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 15 | **Define StatementFormat Enum** | Create: CSV, OFX, MT940 | Task 14 | 🔴 Not Created |
| 16 | **Create BankStatement Model** | Imported statement header | Task 15 | 🔴 Not Created |
| 17 | **Add Statement Bank FK** | Link to BankAccount | Task 16 | 🔴 Not Created |
| 18 | **Add Statement Date Range** | Add start_date, end_date | Task 16 | 🔴 Not Created |
| 19 | **Add Statement Balances** | Add opening_balance, closing_balance | Task 16 | 🔴 Not Created |
| 20 | **Add Statement File Field** | Store uploaded file | Task 16 | 🔴 Not Created |
| 21 | **Add Statement Import Status** | Add status (PENDING, IMPORTED, FAILED) | Task 16 | 🔴 Not Created |
| 22 | **Run Statement Migrations** | Generate and apply migrations | Task 21 | 🔴 Not Created |
| 23 | **Create StatementLine Model** | Individual statement transactions | Task 22 | 🔴 Not Created |
| 24 | **Add Line Transaction Date** | Add date field | Task 23 | 🔴 Not Created |
| 25 | **Add Line Description** | Add description/narration | Task 23 | 🔴 Not Created |
| 26 | **Add Line Amount Fields** | Add debit, credit amounts | Task 23 | 🔴 Not Created |
| 27 | **Add Line Reference** | Add reference/check number | Task 23 | 🔴 Not Created |
| 28 | **Add Line Balance** | Add running_balance | Task 23 | 🔴 Not Created |
| 29 | **Run StatementLine Migrations** | Generate and apply migrations | Task 28 | 🔴 Not Created |
| 30 | **Create CSV Importer Service** | Parse CSV bank statements | Task 29 | 🔴 Not Created |

---

### Group C: Matching Engine (Tasks 31-48)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 31 | **Create OFX Importer Service** | Parse OFX format statements | Task 30 | 🔴 Not Created |
| 32 | **Create Statement Parser Factory** | Factory for format-specific parsers | Task 31 | 🔴 Not Created |
| 33 | **Add Column Mapping Config** | Configurable CSV column mapping | Task 32 | 🔴 Not Created |
| 34 | **Define MatchStatus Enum** | Create: UNMATCHED, MATCHED, PARTIAL, EXCLUDED | Task 33 | 🔴 Not Created |
| 35 | **Add Line Match Status** | Add match_status to StatementLine | Task 34 | 🔴 Not Created |
| 36 | **Add Line Matched Entry FK** | Link to matched JournalEntry | Task 35 | 🔴 Not Created |
| 37 | **Run Match Fields Migrations** | Generate and apply migrations | Task 36 | 🔴 Not Created |
| 38 | **Create MatchingRule Model** | Configurable matching rules | Task 37 | 🔴 Not Created |
| 39 | **Add Rule Name Field** | Add rule_name, priority | Task 38 | 🔴 Not Created |
| 40 | **Add Rule Match Criteria** | Add amount_tolerance, date_range | Task 38 | 🔴 Not Created |
| 41 | **Add Rule Pattern Match** | Add description pattern regex | Task 38 | 🔴 Not Created |
| 42 | **Run MatchingRule Migrations** | Generate and apply migrations | Task 41 | 🔴 Not Created |
| 43 | **Create MatchingEngine Service** | Core matching logic | Task 42 | 🔴 Not Created |
| 44 | **Add Exact Match Method** | Match by amount and date | Task 43 | 🔴 Not Created |
| 45 | **Add Fuzzy Match Method** | Match with tolerance | Task 44 | 🔴 Not Created |
| 46 | **Add Reference Match Method** | Match by reference number | Task 45 | 🔴 Not Created |
| 47 | **Add Auto-Match Batch Method** | Auto-match all unmatched lines | Task 46 | 🔴 Not Created |
| 48 | **Add Match Suggestion Method** | Suggest possible matches | Task 47 | 🔴 Not Created |

---

### Group D: Reconciliation Workflow (Tasks 49-64)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 49 | **Define ReconciliationStatus Enum** | Create: IN_PROGRESS, COMPLETED, CANCELLED | Task 48 | 🔴 Not Created |
| 50 | **Create Reconciliation Model** | Reconciliation session | Task 49 | 🔴 Not Created |
| 51 | **Add Reconciliation Bank FK** | Link to BankAccount | Task 50 | 🔴 Not Created |
| 52 | **Add Reconciliation Statement FK** | Link to BankStatement | Task 50 | 🔴 Not Created |
| 53 | **Add Reconciliation Date Fields** | Add reconciliation_date, period | Task 50 | 🔴 Not Created |
| 54 | **Add Reconciliation Balances** | Add statement_balance, book_balance | Task 50 | 🔴 Not Created |
| 55 | **Add Reconciliation Difference** | Add calculated difference | Task 50 | 🔴 Not Created |
| 56 | **Add Reconciliation Status** | Add status field | Task 50 | 🔴 Not Created |
| 57 | **Add Completed Fields** | Add completed_at, completed_by | Task 50 | 🔴 Not Created |
| 58 | **Run Reconciliation Migrations** | Generate and apply migrations | Task 57 | 🔴 Not Created |
| 59 | **Create ReconciliationItem Model** | Track matched pairs | Task 58 | 🔴 Not Created |
| 60 | **Add Item Statement Line FK** | Link to StatementLine | Task 59 | 🔴 Not Created |
| 61 | **Add Item Journal Entry FK** | Link to JournalEntry/Line | Task 59 | 🔴 Not Created |
| 62 | **Add Item Match Type** | Add match_type (AUTO, MANUAL) | Task 59 | 🔴 Not Created |
| 63 | **Run ReconciliationItem Migrations** | Generate and apply migrations | Task 62 | 🔴 Not Created |
| 64 | **Create Reconciliation Service** | Workflow management service | Task 63 | 🔴 Not Created |

---

### Group E: Reporting & History (Tasks 65-76)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 65 | **Add Start Reconciliation Method** | Create new reconciliation session | Task 64 | 🔴 Not Created |
| 66 | **Add Match Transaction Method** | Manually match items | Task 65 | 🔴 Not Created |
| 67 | **Add Unmatch Transaction Method** | Remove match | Task 66 | 🔴 Not Created |
| 68 | **Add Create Adjustment Method** | Create adjusting entry from difference | Task 67 | 🔴 Not Created |
| 69 | **Add Complete Reconciliation Method** | Finalize and lock | Task 68 | 🔴 Not Created |
| 70 | **Add Cancel Reconciliation Method** | Cancel in-progress session | Task 69 | 🔴 Not Created |
| 71 | **Create Reconciliation Report** | Summary report generation | Task 70 | 🔴 Not Created |
| 72 | **Add Matched Items Section** | List matched transactions | Task 71 | 🔴 Not Created |
| 73 | **Add Unmatched Items Section** | List unmatched items | Task 72 | 🔴 Not Created |
| 74 | **Add Adjustments Section** | List adjusting entries | Task 73 | 🔴 Not Created |
| 75 | **Add Summary Totals** | Calculate totals and difference | Task 74 | 🔴 Not Created |
| 76 | **Add PDF Export Method** | Generate PDF report | Task 75 | 🔴 Not Created |

---

### Group F: API, Testing & Documentation (Tasks 77-84)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 77 | **Create BankAccount Admin** | Django admin for bank accounts | Task 76 | 🔴 Not Created |
| 78 | **Create Reconciliation Admin** | Django admin for reconciliations | Task 77 | 🔴 Not Created |
| 79 | **Create Reconciliation Serializers** | DRF serializers | Task 78 | 🔴 Not Created |
| 80 | **Create ReconciliationViewSet** | Full workflow ViewSet | Task 79 | 🔴 Not Created |
| 81 | **Add Import Statement Endpoint** | POST to import statement | Task 80 | 🔴 Not Created |
| 82 | **Add URL Routes** | Register routes in urls.py | Task 81 | 🔴 Not Created |
| 83 | **Write Reconciliation Tests** | Unit and integration tests | Task 82 | 🔴 Not Created |
| 84 | **Create Reconciliation API Docs** | Document all endpoints | Task 83 | 🔴 Not Created |

---

## Expected File Structure

```
apps/accounting/
├── models/
│   ├── bank_account.py         # BankAccount model
│   ├── bank_statement.py       # BankStatement model
│   ├── statement_line.py       # StatementLine model
│   ├── matching_rule.py        # MatchingRule model
│   ├── reconciliation.py       # Reconciliation model
│   └── reconciliation_item.py  # ReconciliationItem model
├── serializers/
│   ├── bank_account.py         # Bank account serializers
│   ├── bank_statement.py       # Statement serializers
│   └── reconciliation.py       # Reconciliation serializers
├── views/
│   ├── bank_account.py         # Bank account ViewSet
│   ├── bank_statement.py       # Statement ViewSet
│   └── reconciliation.py       # Reconciliation ViewSet
├── services/
│   ├── importers/
│   │   ├── __init__.py
│   │   ├── base.py             # Base importer class
│   │   ├── csv_importer.py     # CSV parser
│   │   ├── ofx_importer.py     # OFX parser
│   │   └── factory.py          # Parser factory
│   ├── matching_engine.py      # Matching logic
│   └── reconciliation_service.py # Workflow service
├── tests/
│   ├── test_bank_account.py
│   ├── test_importers.py
│   ├── test_matching.py
│   └── test_reconciliation.py
└── migrations/

frontend/src/app/(dashboard)/accounting/
├── bank-accounts/
│   ├── page.tsx                # Bank account list
│   ├── [id]/
│   │   └── page.tsx            # Bank account detail
│   └── new/
│       └── page.tsx            # Add bank account
├── reconciliation/
│   ├── page.tsx                # Reconciliation list
│   ├── [id]/
│   │   └── page.tsx            # Reconciliation session
│   ├── new/
│   │   └── page.tsx            # Start reconciliation
│   └── import/
│       └── page.tsx            # Import statement
├── components/
│   ├── ReconciliationWorkspace.tsx # Main matching UI
│   ├── StatementLineList.tsx   # Statement lines
│   ├── BookTransactionList.tsx # Book transactions
│   ├── MatchingPair.tsx        # Matched pair display
│   ├── DragDropMatcher.tsx     # Drag-drop matching
│   └── ReconciliationSummary.tsx # Balance summary
└── hooks/
    ├── useReconciliation.ts
    ├── useBankAccounts.ts
    └── useMatching.ts
```

---

## Progress Tracking

| Group | Tasks | Completed | Percentage |
|-------|-------|-----------|------------|
| Group A: Bank Account Configuration | 14 | 0 | 0% |
| Group B: Statement Import | 16 | 0 | 0% |
| Group C: Matching Engine | 18 | 0 | 0% |
| Group D: Reconciliation Workflow | 16 | 0 | 0% |
| Group E: Reporting & History | 12 | 0 | 0% |
| Group F: API, Testing & Documentation | 8 | 0 | 0% |
| **TOTAL** | **84** | **0** | **0%** |

---

## Notes for AI Agents

### Critical Implementation Details

1. **Reconciliation Concept:**
   ```
   Statement Balance (from bank)
   + Outstanding Deposits (in books, not in statement)
   - Outstanding Checks (in books, not in statement)
   = Book Balance (calculated)
   
   If Book Balance ≠ Ledger Balance → Difference needs adjustment
   ```

2. **Matching Criteria:**
   - Exact: Same amount, same date, same reference
   - Fuzzy: Amount within tolerance, date within range
   - Pattern: Description matching regex

3. **Reconciliation Workflow:**
   ```
   Import Statement
        │
        ▼
   Auto-Match Transactions
        │
        ▼
   Review & Manual Match
        │
        ▼
   Create Adjustments (if needed)
        │
        ▼
   Complete Reconciliation
        │
        ▼
   Update Last Reconciled Date/Balance
   ```

4. **Statement Import Formats:**
   - CSV: Configurable column mapping
   - OFX: Standard bank format
   - MT940: SWIFT format (future)

5. **Outstanding Items:**
   - Deposits in Transit: In books, not in statement
   - Outstanding Checks: In books, not cleared
   - Bank Charges: In statement, not in books

### Sri Lanka Specific

1. **Local Banks:**
   - Bank of Ceylon (BOC)
   - People's Bank
   - Commercial Bank
   - Hatton National Bank (HNB)
   - Sampath Bank

2. **Common Charges:**
   - Bank charges (monthly fee)
   - SMS alert charges
   - Cheque book charges
   - SLIPS/CEFT charges

3. **Statement Formats:**
   - Most Sri Lankan banks provide CSV exports
   - Format varies by bank (need column mapping)

### Matching Rules Examples

1. **Exact Match Rule:**
   - Amount: Exact
   - Date: ±0 days
   - Priority: 1

2. **Same Day Match:**
   - Amount: Exact
   - Date: ±2 days
   - Priority: 2

3. **Reference Match:**
   - Reference: Exact
   - Amount: Exact
   - Date: ±5 days
   - Priority: 3

### Reconciliation Report Structure

```
BANK RECONCILIATION STATEMENT
=============================
Bank: [Bank Name]
Account: [Account Number]
Period: [Start Date] to [End Date]
Reconciliation Date: [Date]

STATEMENT BALANCE (as per bank): LKR XXX,XXX.XX

Add: Deposits in Transit
  - [Date] [Description] LKR XXX.XX
  - [Date] [Description] LKR XXX.XX
  Total Deposits in Transit: LKR X,XXX.XX

Less: Outstanding Checks
  - [Check#] [Date] [Payee] LKR XXX.XX
  - [Check#] [Date] [Payee] LKR XXX.XX
  Total Outstanding Checks: LKR X,XXX.XX

ADJUSTED BANK BALANCE: LKR XXX,XXX.XX

BOOK BALANCE (as per ledger): LKR XXX,XXX.XX

Add/Less: Adjustments
  - Bank Charges: (LKR XXX.XX)
  - Interest Earned: LKR XXX.XX
  Total Adjustments: (LKR XXX.XX)

ADJUSTED BOOK BALANCE: LKR XXX,XXX.XX

DIFFERENCE: LKR 0.00 ✓
```

---

## Completion Checklist

- [ ] BankAccount model with configuration
- [ ] BankStatement model
- [ ] StatementLine model with match tracking
- [ ] CSV importer service
- [ ] OFX importer service (optional)
- [ ] MatchingRule model
- [ ] MatchingEngine service
- [ ] Reconciliation session model
- [ ] ReconciliationItem model
- [ ] Reconciliation workflow service
- [ ] Start/Complete/Cancel methods
- [ ] Create adjustment from reconciliation
- [ ] Reconciliation report generation
- [ ] PDF export
- [ ] Django admin for all models
- [ ] DRF serializers and ViewSets
- [ ] Unit and integration tests
- [ ] API documentation
