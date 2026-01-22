# Group C: Payment Reference & Instructions

> **Phase:** 09 - Integrations & Sri Lanka Localizations  
> **SubPhase:** 05 - Bank Transfer with Upload  
> **Group:** C of F  
> **Tasks Covered:** 29-44  
> **Group Goal:** Create payment reference generation and instructions with reminders

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group-B_Bank-Transfer-Processor](../Group-B_Bank-Transfer-Processor/)
- **→ Next Group:** [Group-D_Proof-Upload-Verification](../Group-D_Proof-Upload-Verification/)

---

## Group Overview

This group creates payment reference and instructions. Creates reference generator with unique format. Creates reference validation. Creates payment instructions text template with customizable model. Creates bank details display and amount display in LKR. Creates expiry display. Creates copy to clipboard functionality. Creates email, WhatsApp, and SMS instructions delivery. Creates payment reminder system with Celery tasks. Creates final reminder before expiry. Verifies instruction flow.

### Key Outcomes

- Reference generator
- Reference format
- Reference validation
- Payment instructions
- Instructions model
- Bank details display
- Amount display (LKR)
- Expiry display
- Copy to clipboard
- Email instructions
- WhatsApp instructions
- SMS instructions
- Payment reminder
- Reminder Celery task
- Final reminder
- Instructions verified

### Technology Context

- **Reference:** Unique per order
- **Channels:** Email, WhatsApp, SMS
- **Reminders:** Celery scheduled
- **Display:** Copy-friendly format

---

## Documents in This Group

| # | Document | Description | Tasks Covered |
|---|----------|-------------|---------------|
| 01 | `01_Tasks-29-37_Reference-Display.md` | Create reference and display | 29-37 |
| 02 | `02_Tasks-38-44_Channels-Reminder-Verify.md` | Create channels and reminders | 38-44 |

---

## Task Summary

| Task # | Task Name | Complexity | Dependencies |
|--------|-----------|------------|--------------|
| 29 | Create Reference Generator | Medium | Task 28 |
| 30 | Create Reference Format | Low | Task 29 |
| 31 | Create Reference Validation | Low | Task 29 |
| 32 | Create Payment Instructions | Medium | Task 28 |
| 33 | Create Instructions Model | Medium | Task 32 |
| 34 | Create Bank Details Display | Low | Task 32 |
| 35 | Create Amount Display | Low | Task 32 |
| 36 | Create Expiry Display | Low | Task 32 |
| 37 | Create Copy to Clipboard | Low | Task 34 |
| 38 | Create Email Instructions | Medium | Task 32 |
| 39 | Create WhatsApp Instructions | Medium | Task 32 |
| 40 | Create SMS Instructions | Low | Task 32 |
| 41 | Create Payment Reminder | Medium | Task 32 |
| 42 | Create Reminder Celery Task | Medium | Task 41 |
| 43 | Create Final Reminder | Low | Task 41 |
| 44 | Verify Instructions | Low | Task 43 |

---

## Execution Order

```
Task 29: Reference Generator
    │
    ├────────┐
    ▼        ▼
T-30     T-31
(Format)(Valid)
    │        │
    └────┬───┘
         │
         ▼
   Task 32: Payment Instructions
         │
    ┌────┼────┬────┬────┬────────┬────────┬────────┐
    ▼    ▼    ▼    ▼    ▼        ▼        ▼        ▼
T-33   T-34  T-35  T-36  T-38    T-39    T-40    T-41
(Model)(Bank)(Amt)(Exp)(Email)(WhatsApp)(SMS)(Remind)
    │    │    │    │    │        │        │        │
    │    ▼    │    │    │        │        │   ┌────┴────┐
    │  T-37  │    │    │        │        │   ▼         ▼
    │ (Copy) │    │    │        │        │ T-42      T-43
    │    │    │    │    │        │        │(Task)   (Final)
    │    │    │    │    │        │        │   │         │
    └────┴────┴────┴────┴────────┴────────┴───┴─────────┘
                         │
                         ▼
                   Task 44: Verify
```

---

## Expected Deliverables

```
backend/
└── apps/
    └── payments/
        └── processors/
            └── bank_transfer/
                ├── reference.py
                └── instructions.py
        └── tasks/
            └── reminder_task.py
```

---

## Notes for AI Agents

### Reference Generator (Task 29)
| Method | generate_reference |
|--------|---------------------|
| Input | order_id |
| Output | Unique reference |

### Reference Format (Task 30)
| Format | ORD-{order_id}-{random} |
|--------|-------------------------|
| Example | ORD-12345-A7B3 |
| Random | 4 alphanumeric chars |

### Reference Validation (Task 31)
| Validate | Pattern match |
|----------|---------------|
| Unique | Check database |
| Format | ORD-XXXXX-XXXX |

### Payment Instructions (Task 32)
| Content | Value |
|---------|-------|
| Bank details | All active accounts |
| Reference | Must include in transfer |
| Amount | Exact amount |
| Deadline | Expiry datetime |

### Instructions Model (Task 33)
| Field | Type |
|-------|------|
| tenant | ForeignKey |
| template | TextField |
| language | Choices (en, si, ta) |

### Bank Details Display (Task 34)
| Format | Value |
|--------|-------|
| Bank | Bank name |
| Account | Account number |
| Name | Account holder |
| Branch | Branch name |

### Amount Display (Task 35)
| Format | ₨ XX,XXX.XX |
|--------|-------------|
| Currency | LKR |
| Thousands | Comma separator |

### Expiry Display (Task 36)
| Format | "Pay before: DD/MM/YYYY HH:MM" |
|--------|--------------------------------|
| Timezone | Asia/Colombo |

### Copy to Clipboard (Task 37)
| Feature | Copy all details |
|---------|------------------|
| Include | Bank, account, amount, reference |
| Format | Plain text |

### Email Instructions (Task 38)
| Template | bank_transfer_instructions.html |
|----------|----------------------------------|
| Subject | "Complete Your Payment - Order #XXX" |
| Include | Full instructions, bank details |

### WhatsApp Instructions (Task 39)
| Format | Text message |
|--------|--------------|
| Include | Bank details, amount, reference |
| Link | Click to copy |

### SMS Instructions (Task 40)
| Format | Short text |
|--------|------------|
| Include | Amount, reference, deadline |
| Limit | 160 characters |

### Payment Reminder (Task 41)
| Trigger | Before expiry |
|---------|---------------|
| Channels | Email, WhatsApp |
| Content | Reminder with details |

### Reminder Celery Task (Task 42)
| Schedule | Every hour |
|----------|------------|
| Query | Pending payments near expiry |
| Action | Send reminder |

### Final Reminder (Task 43)
| Trigger | 6 hours before expiry |
|---------|----------------------|
| Subject | "Last Chance: Payment Expiring Soon" |
| Urgency | High |
