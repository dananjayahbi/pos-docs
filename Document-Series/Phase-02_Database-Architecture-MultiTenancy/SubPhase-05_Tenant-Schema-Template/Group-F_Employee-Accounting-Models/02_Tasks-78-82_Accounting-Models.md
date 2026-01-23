# Tasks 78-82: Accounting Models

> **Phase:** 02 - Database Architecture & Multi-Tenancy  
> **SubPhase:** 05 - Tenant Schema Template  
> **Group:** F - Employee & Accounting Models  
> **Document:** 02 of 03  
> **Tasks Covered:** 78, 79, 80, 81, 82

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-73-77_Employee-Model.md](01_Tasks-73-77_Employee-Model.md)
- **→ Next Document:** [03_Tasks-83-84_Audit-Log.md](03_Tasks-83-84_Audit-Log.md)

---

## Document Overview

This document defines the chart of accounts and journal entry models.

### Tasks in This Document

| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 78 | Create Account Model | Medium |
| 79 | Add Account Code Field | Simple |
| 80 | Add Account Type Field | Simple |
| 81 | Create JournalEntry Model | Medium |
| 82 | Add Entry Debit/Credit Fields | Simple |

---

## Task 78: Create Account Model

### Overview
Create the Account model for chart of accounts.

### Dependencies
- Task 11: Register in TENANT_APPS

### Instructions

1. **Define Account model**
   - Capture standard chart of accounts

2. **Document usage**
   - Note how accounts are referenced in entries

### Expected Outcome
- Account model documented

### Verification Checklist
- [ ] Account model documented
- [ ] Usage noted

---

## Task 79: Add Account Code Field

### Overview
Add an account code field for standardized account numbering.

### Dependencies
- Task 78: Create Account Model

### Instructions

1. **Add account code field**
   - Align with standard chart of accounts

2. **Document constraints**
   - Note uniqueness per tenant

### Expected Outcome
- Account code documented

### Verification Checklist
- [ ] Account code documented
- [ ] Constraints noted

---

## Task 80: Add Account Type Field

### Overview
Add a type field for asset, liability, equity, revenue, and expense.

### Dependencies
- Task 78: Create Account Model

### Instructions

1. **Add account type field**
   - Use standard accounting types

2. **Document usage**
   - Note reporting implications

### Expected Outcome
- Account type documented

### Verification Checklist
- [ ] Account type documented
- [ ] Usage noted

---

## Task 81: Create JournalEntry Model

### Overview
Create the JournalEntry model for double-entry accounting.

### Dependencies
- Task 80: Add Account Type Field

### Instructions

1. **Define JournalEntry model**
   - Capture debit and credit details

2. **Document double-entry rule**
   - Ensure debits equal credits

### Expected Outcome
- JournalEntry documented

### Verification Checklist
- [ ] JournalEntry documented
- [ ] Double-entry rule noted

---

## Task 82: Add Entry Debit/Credit Fields

### Overview
Add debit and credit fields for journal entries.

### Dependencies
- Task 81: Create JournalEntry Model

### Instructions

1. **Add debit and credit fields**
   - Capture amounts in LKR (₨)

2. **Document validation**
   - Note balance validation rules

### Expected Outcome
- Debit/credit fields documented

### Verification Checklist
- [ ] Debit/credit fields documented
- [ ] Validation noted

---

## Summary

### Tasks Completed in This Document

| Task # | Task Name | Key Deliverable |
|--------|-----------|-----------------|
| 78 | Create Account Model | Account model documented |
| 79 | Add Account Code Field | Account code documented |
| 80 | Add Account Type Field | Account type documented |
| 81 | Create JournalEntry Model | JournalEntry documented |
| 82 | Add Entry Debit/Credit Fields | Debit/credit documented |

### Next Steps
- Continue with [03_Tasks-83-84_Audit-Log.md](03_Tasks-83-84_Audit-Log.md)

---

## Notes for AI Agents

1. **Execution Order:** Complete tasks 78 through 82 in sequence
2. **Double-Entry:** Debits must equal credits
3. **No Code Snippets:** Avoid fenced code blocks in documentation
