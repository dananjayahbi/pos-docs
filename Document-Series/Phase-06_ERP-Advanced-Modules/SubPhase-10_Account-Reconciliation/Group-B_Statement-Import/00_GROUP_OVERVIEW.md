# Group B: Statement Import

> **Phase:** 06 - ERP Advanced Modules  
> **SubPhase:** 10 - Account Reconciliation  
> **Group:** B of F  
> **Tasks Covered:** 15-30  
> **Group Goal:** Implement bank statement and statement line models with CSV import functionality

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group-A_Bank-Account-Configuration](../Group-A_Bank-Account-Configuration/)
- **→ Next Group:** [Group-C_Matching-Engine](../Group-C_Matching-Engine/)

---

## Group Overview

This group implements the bank statement import functionality. Creates the BankStatement model for imported statement headers and StatementLine model for individual transactions. Includes statement format enumeration, file upload storage, import status tracking, and a configurable CSV importer service to parse bank statement files with flexible column mapping.

### Key Outcomes

- StatementFormat enum (CSV, OFX, MT940)
- BankStatement model for statement headers
- Statement linked to BankAccount
- Date range fields (start_date, end_date)
- Opening and closing balance fields
- Statement file upload storage
- Import status tracking (PENDING, IMPORTED, FAILED)
- StatementLine model for individual transactions
- Line fields: date, description, debit, credit, reference, running balance
- CSV importer service with configurable column mapping

### Technology Context

- **File Storage:** S3-compatible or local storage for uploads
- **Parsing:** Python CSV library for CSV parsing
- **Formats:** Support for CSV initially, extensible to OFX
- **Mapping:** Configurable column mapping per bank format

---

## Documents in This Group

| # | Document | Description | Tasks Covered |
|---|----------|-------------|---------------|
| 01 | `01_Tasks-15-22_BankStatement-Model.md` | Create BankStatement model with date range, balances, and file | 15-22 |
| 02 | `02_Tasks-23-30_StatementLine-CSV-Importer.md` | Create StatementLine model and CSV importer service | 23-30 |

---

## Task Summary

| Task # | Task Name | Complexity | Dependencies |
|--------|-----------|------------|--------------|
| 15 | Define StatementFormat Enum | Low | Task 14 |
| 16 | Create BankStatement Model | Medium | Task 15 |
| 17 | Add Statement Bank FK | Low | Task 16 |
| 18 | Add Statement Date Range | Low | Task 16 |
| 19 | Add Statement Balances | Low | Task 16 |
| 20 | Add Statement File Field | Low | Task 16 |
| 21 | Add Statement Import Status | Low | Task 16 |
| 22 | Run Statement Migrations | Low | Task 21 |
| 23 | Create StatementLine Model | Medium | Task 22 |
| 24 | Add Line Transaction Date | Low | Task 23 |
| 25 | Add Line Description | Low | Task 23 |
| 26 | Add Line Amount Fields | Low | Task 23 |
| 27 | Add Line Reference | Low | Task 23 |
| 28 | Add Line Balance | Low | Task 23 |
| 29 | Run StatementLine Migrations | Low | Task 28 |
| 30 | Create CSV Importer Service | High | Task 29 |

---

## Execution Order

```
Task 15: Define StatementFormat Enum
    │
    ▼
Task 16: Create BankStatement Model (base)
    │
    ├─────────────────────────────────────────┐
    ▼                                         ▼
Tasks 17-20: Statement Fields          Task 21: Import Status
(bank FK, dates, balances, file)
    │                                         │
    └─────────────┬───────────────────────────┘
                  ▼
             Task 22: Run Migrations
                  │
                  ▼
             Task 23: Create StatementLine Model
                  │
                  ├─────────────────────────────────────┐
                  ▼                                     ▼
             Tasks 24-27: Line Fields            Task 28: Balance
             (date, description, amounts, reference)
                  │                                     │
                  └─────────────┬───────────────────────┘
                                ▼
                           Task 29: Run Migrations
                                │
                                ▼
                           Task 30: CSV Importer Service
```

---

## Expected Deliverables

```
apps/accounting/
├── models/
│   ├── __init__.py
│   ├── enums.py              # Add StatementFormat enum
│   ├── bank_statement.py     # BankStatement model
│   └── statement_line.py     # StatementLine model
├── services/
│   └── importers/
│       ├── __init__.py
│       ├── base.py           # Base importer abstract class
│       └── csv_importer.py   # CSV parser implementation
├── migrations/
│   ├── 0011_bankstatement.py
│   └── 0012_statementline.py
└── tests/
    └── test_importers.py     # Importer tests
```

---

## Notes for AI Agents

### Statement Format Types
- CSV: Comma-separated values (most common for Sri Lankan banks)
- OFX: Open Financial Exchange (standard banking format)
- MT940: SWIFT message format (for international banking)

### Statement Header Fields
- bank_account: FK to BankAccount
- start_date, end_date: Statement period
- opening_balance: Balance at period start
- closing_balance: Balance at period end
- file: Uploaded statement file
- import_status: PENDING → IMPORTED or FAILED
- imported_at, imported_by: Import metadata

### Statement Line Fields
- statement: FK to BankStatement
- transaction_date: Date of transaction
- description: Narration/description
- debit: Withdrawal amount (or null)
- credit: Deposit amount (or null)
- reference: Check number, reference ID
- running_balance: Balance after transaction

### CSV Column Mapping Configuration
Different banks use different CSV formats. Configurable mapping example:
```json
{
  "date_column": 0,
  "description_column": 1,
  "debit_column": 3,
  "credit_column": 4,
  "reference_column": 2,
  "balance_column": 5,
  "date_format": "%d/%m/%Y",
  "skip_rows": 1
}
```

### Sri Lankan Bank CSV Formats
Common format variations:
- Date formats: DD/MM/YYYY, YYYY-MM-DD, DD-MMM-YY
- Single amount column with +/- vs separate debit/credit
- Header row presence varies
- Column order varies by bank
