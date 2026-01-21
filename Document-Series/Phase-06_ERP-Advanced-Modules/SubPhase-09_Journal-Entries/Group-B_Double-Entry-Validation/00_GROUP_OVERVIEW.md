# Group B: Double-Entry Validation

> **Phase:** 06 - ERP Advanced Modules  
> **SubPhase:** 09 - Journal Entries  
> **Group:** B of F  
> **Tasks Covered:** 19-32  
> **Group Goal:** Create journal entry line items model and implement comprehensive double-entry bookkeeping validation

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group-A_Journal-Entry-Models](../Group-A_Journal-Entry-Models/)
- **→ Next Group:** [Group-C_Auto-Generated-Entries](../Group-C_Auto-Generated-Entries/)

---

## Group Overview

This group implements the JournalEntryLine model for individual debit/credit line items and creates comprehensive validation logic to enforce double-entry bookkeeping rules. Each line links to an account with either a debit or credit amount. Validators ensure total debits equal total credits, minimum two lines per entry, positive amounts only, accounts are active, and entry dates fall within open accounting periods.

### Key Outcomes

- JournalEntryLine model linking to JournalEntry and Account
- Separate debit and credit decimal fields per line
- Line-level description/memo field
- Sort order for display sequencing
- Balance validator ensuring debits = credits
- Zero balance check for entry totals
- Minimum lines check (at least 2 lines required)
- Non-zero/positive amount validation
- Account active status validation
- Entry date period validation (open period required)

### Technology Context

- **Models:** Django ORM with ForeignKey relationships
- **Validation:** Django validators and model clean methods
- **Decimal:** Decimal fields for currency precision
- **Constraints:** Database-level and application-level validation

---

## Documents in This Group

| # | Document | Description | Tasks Covered |
|---|----------|-------------|---------------|
| 01 | `01_Tasks-19-26_JournalEntryLine-Model.md` | Create JournalEntryLine model with all fields and migrations | 19-26 |
| 02 | `02_Tasks-27-32_Double-Entry-Validators.md` | Implement balance, lines, amount, account, and period validators | 27-32 |

---

## Task Summary

| Task # | Task Name | Complexity | Dependencies |
|--------|-----------|------------|--------------|
| 19 | Create JournalEntryLine Model | Medium | Task 18 |
| 20 | Add Line Entry FK | Low | Task 19 |
| 21 | Add Line Account FK | Low | Task 19 |
| 22 | Add Line Debit Field | Low | Task 19 |
| 23 | Add Line Credit Field | Low | Task 19 |
| 24 | Add Line Description | Low | Task 19 |
| 25 | Add Line Sort Order | Low | Task 19 |
| 26 | Run Line Migrations | Low | Task 25 |
| 27 | Create Balance Validator | High | Task 26 |
| 28 | Add Zero Balance Check | Medium | Task 27 |
| 29 | Add Minimum Lines Check | Low | Task 28 |
| 30 | Add Non-Zero Check | Low | Task 29 |
| 31 | Add Account Active Check | Low | Task 30 |
| 32 | Add Entry Period Check | Medium | Task 31 |

---

## Execution Order

```
Task 19: Create JournalEntryLine Model (base)
    │
    ├─────────────────────────────────────┐
    ▼                                     ▼
Tasks 20-21: Foreign Keys          Tasks 22-25: Line Fields
(Entry FK, Account FK)             (debit, credit, description, order)
    │                                     │
    └─────────────┬───────────────────────┘
                  ▼
             Task 26: Run Migrations
                  │
                  ▼
             Task 27: Create Balance Validator
                  │
                  ▼
             Task 28: Zero Balance Check
                  │
                  ▼
             Task 29: Minimum Lines Check
                  │
                  ▼
             Task 30: Non-Zero Check
                  │
                  ▼
             Task 31: Account Active Check
                  │
                  ▼
             Task 32: Entry Period Check
```

---

## Expected Deliverables

```
apps/accounting/
├── models/
│   ├── __init__.py            # Export JournalEntryLine
│   └── journal_line.py        # JournalEntryLine model
├── validators/
│   ├── __init__.py
│   └── entry_validators.py    # All validation logic
├── migrations/
│   └── 0005_journalentryline.py
└── tests/
    ├── test_journal_line.py   # Line model tests
    └── test_validators.py     # Validator tests
```

---

## Notes for AI Agents

### Double-Entry Fundamental Rule
Every journal entry MUST satisfy: Sum(Debits) = Sum(Credits)

### Line Item Constraints
- Each line has EITHER debit OR credit (not both)
- Amount must be positive (no negative values)
- Minimum 2 lines per entry (one debit, one credit at minimum)

### Validation Order
1. Check minimum lines (>= 2)
2. Check all amounts positive (> 0)
3. Check debit/credit exclusivity per line
4. Check total debits = total credits
5. Check all accounts are active
6. Check entry date in open period

### Account Balance Impact
When entry is posted:
- DEBIT normal accounts: balance += debit - credit
- CREDIT normal accounts: balance += credit - debit

### Period Validation
Entries can only be created/modified for dates within:
- An existing AccountingPeriod
- Period status = OPEN
- Closed/Locked periods reject new entries

### Error Handling
Validation errors should provide clear messages:
- "Entry is unbalanced: Debits (X) ≠ Credits (Y)"
- "Entry requires at least 2 line items"
- "Line amount must be positive"
- "Account [code] is not active"
- "Entry date falls in closed period"
