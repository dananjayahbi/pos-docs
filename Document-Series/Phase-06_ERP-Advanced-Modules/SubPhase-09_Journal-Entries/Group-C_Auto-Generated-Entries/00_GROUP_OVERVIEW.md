# Group C: Auto-Generated Entries

> **Phase:** 06 - ERP Advanced Modules  
> **SubPhase:** 09 - Journal Entries  
> **Group:** C of F  
> **Tasks Covered:** 33-48  
> **Group Goal:** Implement document attachments and automatic journal entry generation from business transactions

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group-B_Double-Entry-Validation](../Group-B_Double-Entry-Validation/)
- **→ Next Group:** [Group-D_Templates-Recurring](../Group-D_Templates-Recurring/)

---

## Group Overview

This group implements document attachment functionality for journal entries and creates the service layer for automatic entry generation from business transactions. Includes file upload with metadata tracking, JournalEntryService for core CRUD operations (create, update, post, void), and AutoEntryGenerator service with specialized methods for sales invoices, purchase bills, payments, payroll processing, and inventory adjustments. Celery integration enables automatic posting triggers.

### Key Outcomes

- JournalEntryAttachment model for document uploads
- File storage with name, size, and uploader metadata
- JournalEntryService for entry operations (create, update, post, void)
- AutoEntryGenerator service for automated entry creation
- Sales invoice entry generator (DR AR, CR Revenue, VAT)
- Purchase bill entry generator (DR Inventory/Expense, CR AP, VAT)
- Payment entry generator (DR AP/Cash, CR Cash/AR)
- Payroll entry generator (DR Expense, CR EPF/ETF/PAYE/Net Payable)
- Inventory adjustment entry generator
- Celery signal triggers for auto-posting

### Technology Context

- **File Storage:** S3-compatible storage for attachments
- **Services:** Service layer pattern for business logic
- **Celery:** Task queue for async processing and triggers
- **Signals:** Django signals for event-driven auto-entries

---

## Documents in This Group

| # | Document | Description | Tasks Covered |
|---|----------|-------------|---------------|
| 01 | `01_Tasks-33-36_Attachment-Model.md` | Create JournalEntryAttachment model with file handling | 33-36 |
| 02 | `02_Tasks-37-41_JournalEntry-Service.md` | Implement JournalEntryService with CRUD and posting operations | 37-41 |
| 03 | `03_Tasks-42-48_AutoEntry-Generator.md` | Create AutoEntryGenerator with business transaction handlers | 42-48 |

---

## Task Summary

| Task # | Task Name | Complexity | Dependencies |
|--------|-----------|------------|--------------|
| 33 | Create JournalEntryAttachment Model | Medium | Task 32 |
| 34 | Add Attachment File Field | Low | Task 33 |
| 35 | Add Attachment Metadata | Low | Task 33 |
| 36 | Run Attachment Migrations | Low | Task 35 |
| 37 | Create JournalEntryService | High | Task 36 |
| 38 | Add Create Entry Method | Medium | Task 37 |
| 39 | Add Update Entry Method | Medium | Task 38 |
| 40 | Add Post Entry Method | High | Task 39 |
| 41 | Add Void Entry Method | High | Task 40 |
| 42 | Create AutoEntryGenerator | High | Task 41 |
| 43 | Add Sales Entry Generator | Medium | Task 42 |
| 44 | Add Purchase Entry Generator | Medium | Task 43 |
| 45 | Add Payment Entry Generator | Medium | Task 44 |
| 46 | Add Payroll Entry Generator | High | Task 45 |
| 47 | Add Inventory Entry Generator | Medium | Task 46 |
| 48 | Create Entry Posting Trigger | Medium | Task 47 |

---

## Execution Order

```
Task 33: Create Attachment Model
    │
    ├──────────────┐
    ▼              ▼
Task 34        Task 35
(file field)   (metadata)
    │              │
    └──────┬───────┘
           ▼
      Task 36: Run Migrations
           │
           ▼
      Task 37: Create JournalEntryService
           │
           ▼
      Task 38: Create Entry Method
           │
           ▼
      Task 39: Update Entry Method
           │
           ▼
      Task 40: Post Entry Method
           │
           ▼
      Task 41: Void Entry Method
           │
           ▼
      Task 42: Create AutoEntryGenerator
           │
           ├───────────────────────────────────────┐
           ▼                                       ▼
      Tasks 43-47: Transaction Generators    (sequential)
      (Sales, Purchase, Payment, Payroll, Inventory)
           │
           ▼
      Task 48: Create Posting Trigger
```

---

## Expected Deliverables

```
apps/accounting/
├── models/
│   ├── __init__.py
│   └── journal_attachment.py  # Attachment model
├── services/
│   ├── __init__.py
│   ├── journal_service.py     # JournalEntryService
│   └── auto_entry.py          # AutoEntryGenerator
├── signals.py                 # Auto-entry triggers
├── tasks.py                   # Celery tasks
└── migrations/
    └── 0006_journalentryattachment.py
```

---

## Notes for AI Agents

### Auto-Entry Generation Examples

**Sales Invoice Entry:**
```
DR Accounts Receivable    1,150.00
    CR Sales Revenue               1,000.00
    CR VAT Output                    150.00
```

**Purchase Bill Entry:**
```
DR Inventory/Expense        800.00
DR VAT Input                120.00
    CR Accounts Payable              920.00
```

**Payment Received Entry:**
```
DR Cash/Bank              1,150.00
    CR Accounts Receivable         1,150.00
```

**Payment Made Entry:**
```
DR Accounts Payable         920.00
    CR Cash/Bank                     920.00
```

**Payroll Entry (Sri Lanka):**
```
DR Salaries Expense     100,000.00
DR EPF Expense (12%)     12,000.00
DR ETF Expense (3%)       3,000.00
    CR EPF Payable (20%)           20,000.00
    CR ETF Payable (3%)             3,000.00
    CR PAYE Payable                 5,000.00
    CR Net Salaries Payable        87,000.00
```

**Inventory Adjustment Entry:**
```
DR Inventory Adjustment     500.00
    CR Inventory                      500.00
```

### Post Entry Logic
1. Validate entry (double-entry rules)
2. Set status = POSTED
3. Set posted_at, posted_by
4. Update account.current_balance for each line
5. Generate entry number if not set

### Void Entry Logic
1. Verify entry is POSTED
2. Create reversal entry (swap debits/credits)
3. Set original entry status = VOID
4. Link reversal_of FK
5. Post reversal entry automatically

### Signal Triggers
Connect to business module signals:
- post_save on SalesInvoice → generate sales entry
- post_save on PurchaseBill → generate purchase entry
- post_save on PayrollRun (when finalized) → generate payroll entry
