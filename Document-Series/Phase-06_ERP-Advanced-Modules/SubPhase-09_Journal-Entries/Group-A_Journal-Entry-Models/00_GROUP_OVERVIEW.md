# Group A: Journal Entry Models

> **Phase:** 06 - ERP Advanced Modules  
> **SubPhase:** 09 - Journal Entries  
> **Group:** A of F  
> **Tasks Covered:** 01-18  
> **Group Goal:** Create core journal entry model with enumerations and essential fields for double-entry bookkeeping

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** None (First Group)
- **→ Next Group:** [Group-B_Double-Entry-Validation](../Group-B_Double-Entry-Validation/)

---

## Group Overview

This group establishes the foundation for journal entry recording in the accounting module. Creates enumerations for entry types (Manual, Auto, Adjusting, Reversing), statuses (Draft, Pending, Approved, Posted, Void), and sources (Sales, Purchase, Payroll, etc.). The JournalEntry model captures all header-level information including auto-generated entry numbers, transaction dates, references, and posting metadata.

### Key Outcomes

- Extend existing accounting app with journal entry module
- JournalEntryType enum (MANUAL, AUTO, ADJUSTING, REVERSING)
- JournalEntryStatus enum (DRAFT, PENDING_APPROVAL, APPROVED, POSTED, VOID)
- JournalSource enum (SALES, PURCHASE, PAYROLL, INVENTORY, MANUAL)
- JournalEntry model with auto-generated entry number (JE-2026-00001)
- Entry date, type, status, and source fields
- Reference field for source document linking
- Description/narration field for entry memo
- Cached total_debit and total_credit fields
- Created by and posted by user tracking
- Self-referential FK for reversal entry linking
- Standard timestamps (created_at, updated_at)

### Technology Context

- **Framework:** Django 5.x with Python 3.12+
- **Enums:** Django TextChoices for type-safe enumeration
- **Auto-numbering:** Year-based sequence (JE-YYYY-NNNNN)
- **Multi-tenancy:** Tenant-isolated entry sequences

---

## Documents in This Group

| # | Document | Description | Tasks Covered |
|---|----------|-------------|---------------|
| 01 | `01_Tasks-01-04_Accounting-Module-Enums.md` | Extend accounting app and define all enumerations | 01-04 |
| 02 | `02_Tasks-05-12_JournalEntry-Core-Fields.md` | Create JournalEntry model with core fields | 05-12 |
| 03 | `03_Tasks-13-18_Entry-Tracking-Migrations.md` | Add total fields, user tracking, reversal FK, migrations | 13-18 |

---

## Task Summary

| Task # | Task Name | Complexity | Dependencies |
|--------|-----------|------------|--------------|
| 01 | Extend accounting App | Low | None |
| 02 | Define JournalEntryType Enum | Low | Task 01 |
| 03 | Define JournalEntryStatus Enum | Low | Task 02 |
| 04 | Define JournalSource Enum | Low | Task 03 |
| 05 | Create JournalEntry Model | Medium | Task 04 |
| 06 | Add Entry Number Field | Medium | Task 05 |
| 07 | Add Entry Date Field | Low | Task 05 |
| 08 | Add Entry Type Field | Low | Task 05 |
| 09 | Add Entry Status Field | Low | Task 05 |
| 10 | Add Entry Source Field | Low | Task 05 |
| 11 | Add Entry Reference Field | Low | Task 05 |
| 12 | Add Entry Description Field | Low | Task 05 |
| 13 | Add Entry Total Fields | Low | Task 05 |
| 14 | Add Entry Created By | Low | Task 05 |
| 15 | Add Entry Posted Fields | Low | Task 05 |
| 16 | Add Entry Reversal FK | Low | Task 05 |
| 17 | Add Entry Timestamps | Low | Task 05 |
| 18 | Run JournalEntry Migrations | Low | Task 17 |

---

## Execution Order

```
Task 01: Extend accounting App
    │
    ▼
Tasks 02-04: Define Enums (sequential)
    │
    ▼
Task 05: Create JournalEntry Model (base)
    │
    ├─────────────────────────────────────────────┐
    ▼                                             ▼
Tasks 06-12: Core Fields                   Tasks 13-17: Tracking Fields
(number, date, type, status, etc.)         (totals, users, reversal, timestamps)
    │                                             │
    └─────────────────┬───────────────────────────┘
                      ▼
                 Task 18: Run Migrations
```

---

## Expected Deliverables

```
apps/accounting/
├── models/
│   ├── __init__.py           # Export JournalEntry
│   ├── enums.py              # Add entry-related enums
│   └── journal_entry.py      # JournalEntry model
├── migrations/
│   └── 0004_journalentry.py  # Journal entry migration
└── tests/
    └── test_journal_entry.py # Basic model tests
```

---

## Notes for AI Agents

### Entry Number Generation
- Format: JE-{YEAR}-{SEQUENCE}
- Example: JE-2026-00001, JE-2026-00002
- Sequence resets each year
- Tenant-isolated numbering

### Entry Status Lifecycle
```
DRAFT → PENDING_APPROVAL → APPROVED → POSTED
                                  │
                                  ▼
                                VOID (creates reversal)
```

### Entry Type Definitions
- MANUAL: User-created entries
- AUTO: System-generated from business transactions
- ADJUSTING: Period-end adjustments (accruals, deferrals)
- REVERSING: Auto-generated to reverse adjusting entries

### Source Types
- SALES: From sales invoices
- PURCHASE: From purchase bills
- PAYROLL: From payroll processing
- INVENTORY: From inventory adjustments
- MANUAL: Direct user entry

### Reversal FK Usage
When an entry is voided, a new reversal entry is created with:
- reversal_of = original entry
- Original entry.status = VOID
- Reversal automatically debits what was credited and vice versa
