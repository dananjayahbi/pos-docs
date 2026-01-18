# SubPhase 05: Bank Transfer with Upload - Tasks Summary

> **Phase:** 09 - Integrations & Sri Lanka Localizations  
> **SubPhase Index:** 05 of 12  
> **SubPhase Goal:** Implement manual bank transfer payment workflow with proof of payment upload  
> **Total Tasks:** 86 | **Status:** Planning  
> **Estimated Duration:** 10-12 hours

---

## Navigation

- **↑ Parent:** [00_SUBPHASES_SUMMARY.md](../00_SUBPHASES_SUMMARY.md)
- **← Previous SubPhase:** [SubPhase-04_KOKO-MintPay-BNPL](../SubPhase-04_KOKO-MintPay-BNPL/)
- **→ Next SubPhase:** [SubPhase-06_Cash-On-Delivery](../SubPhase-06_Cash-On-Delivery/)

---

## SubPhase Overview

This sub-phase implements manual bank transfer payment workflow, popular in Sri Lanka for customers without cards or who prefer direct bank payments.

### Key Outcomes
- Bank account configuration per tenant
- Payment reference generation
- Proof of payment upload (image/PDF)
- Admin verification workflow
- Payment expiry and reminders
- Order status management

### Bank Transfer Flow
```
1. Customer selects Bank Transfer
2. Display bank account details:
   Bank: Sampath Bank
   Account: 1234567890
   Name: ABC Company Ltd
   Reference: ORD-12345
   
3. Customer makes transfer
4. Customer uploads payment slip (image/PDF)
5. Admin verifies and confirms
6. Order status updated
```

### Technology Context
- **Backend:** Django 5.x, DRF
- **File Storage:** S3/local storage
- **Uploads:** Images (JPG, PNG) and PDF
- **Notifications:** Email/WhatsApp reminders

---

## Task Execution Order

```
TASK GROUP A: Bank Account Configuration (Tasks 01-14)
        │
        ▼
TASK GROUP B: Bank Transfer Processor (Tasks 15-28)
        │
        ▼
TASK GROUP C: Payment Reference & Instructions (Tasks 29-44)
        │
        ▼
TASK GROUP D: Proof Upload & Verification (Tasks 45-58)
        │
        ▼
TASK GROUP E: Admin Verification Workflow (Tasks 59-72)
        │
        ▼
TASK GROUP F: Frontend & Testing (Tasks 73-86)
```

---

## Task Index

### Group A: Bank Account Configuration (Tasks 01-14)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 01 | **Create BankAccount Model** | Tenant bank accounts | SubPhase-01 | 🔴 Not Created |
| 02 | **Create Bank Name Field** | Bank name (e.g., Sampath) | Task 01 | 🔴 Not Created |
| 03 | **Create Account Number Field** | Bank account number | Task 01 | 🔴 Not Created |
| 04 | **Create Account Name Field** | Account holder name | Task 01 | 🔴 Not Created |
| 05 | **Create Branch Field** | Bank branch name | Task 01 | 🔴 Not Created |
| 06 | **Create Swift Code Field** | Swift/BIC code optional | Task 01 | 🔴 Not Created |
| 07 | **Create Is Active Field** | Active/inactive toggle | Task 01 | 🔴 Not Created |
| 08 | **Create Display Order Field** | Ordering of accounts | Task 01 | 🔴 Not Created |
| 09 | **Create Sri Lanka Banks List** | Common Sri Lanka banks | Task 01 | 🔴 Not Created |
| 10 | **Create Bank Account Admin** | Django admin for banks | Task 01 | 🔴 Not Created |
| 11 | **Create BankTransferConfig** | Transfer settings model | Task 01 | 🔴 Not Created |
| 12 | **Create Payment Expiry Hours** | Time limit for payment | Task 11 | 🔴 Not Created |
| 13 | **Create Reminder Settings** | Reminder intervals | Task 11 | 🔴 Not Created |
| 14 | **Verify Bank Configuration** | Test config | Task 13 | 🔴 Not Created |

---

### Group B: Bank Transfer Processor (Tasks 15-28)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 15 | **Create BankTransferProcessor** | Extend PaymentProcessor | Task 14 | 🔴 Not Created |
| 16 | **Create Processor Registration** | Register with factory | Task 15 | 🔴 Not Created |
| 17 | **Create initiate_payment Method** | Start bank transfer | Task 15 | 🔴 Not Created |
| 18 | **Create Pending Transaction** | Create pending record | Task 17 | 🔴 Not Created |
| 19 | **Create Payment Intent Data** | Bank details response | Task 17 | 🔴 Not Created |
| 20 | **Create verify_payment Method** | Manual verification | Task 15 | 🔴 Not Created |
| 21 | **Create Confirm Payment** | Admin confirms payment | Task 20 | 🔴 Not Created |
| 22 | **Create Reject Payment** | Admin rejects payment | Task 20 | 🔴 Not Created |
| 23 | **Create Expiry Check** | Check if payment expired | Task 15 | 🔴 Not Created |
| 24 | **Create Expiry Celery Task** | Auto-expire old payments | Task 23 | 🔴 Not Created |
| 25 | **Create process_refund Method** | Manual refund process | Task 15 | 🔴 Not Created |
| 26 | **Create Refund Instructions** | Provide refund details | Task 25 | 🔴 Not Created |
| 27 | **Create Status Transitions** | Valid status changes | Task 15 | 🔴 Not Created |
| 28 | **Verify Processor** | Test processor flow | Task 27 | 🔴 Not Created |

---

### Group C: Payment Reference & Instructions (Tasks 29-44)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 29 | **Create Reference Generator** | Unique payment reference | Task 28 | 🔴 Not Created |
| 30 | **Create Reference Format** | ORD-{order_id}-{random} | Task 29 | 🔴 Not Created |
| 31 | **Create Reference Validation** | Validate reference format | Task 29 | 🔴 Not Created |
| 32 | **Create Payment Instructions** | Instructions text template | Task 28 | 🔴 Not Created |
| 33 | **Create Instructions Model** | Customizable instructions | Task 32 | 🔴 Not Created |
| 34 | **Create Bank Details Display** | Format bank details | Task 32 | 🔴 Not Created |
| 35 | **Create Amount Display** | Format LKR amount | Task 32 | 🔴 Not Created |
| 36 | **Create Expiry Display** | Show payment deadline | Task 32 | 🔴 Not Created |
| 37 | **Create Copy to Clipboard** | Copy bank details | Task 34 | 🔴 Not Created |
| 38 | **Create Email Instructions** | Email with bank details | Task 32 | 🔴 Not Created |
| 39 | **Create WhatsApp Instructions** | WhatsApp bank details | Task 32 | 🔴 Not Created |
| 40 | **Create SMS Instructions** | SMS with basic info | Task 32 | 🔴 Not Created |
| 41 | **Create Payment Reminder** | Reminder before expiry | Task 32 | 🔴 Not Created |
| 42 | **Create Reminder Celery Task** | Scheduled reminder | Task 41 | 🔴 Not Created |
| 43 | **Create Final Reminder** | Last reminder before expiry | Task 41 | 🔴 Not Created |
| 44 | **Verify Instructions** | Test instruction flow | Task 43 | 🔴 Not Created |

---

### Group D: Proof Upload & Verification (Tasks 45-58)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 45 | **Create PaymentProof Model** | Store uploaded proofs | Task 44 | 🔴 Not Created |
| 46 | **Create File Field** | Upload file storage | Task 45 | 🔴 Not Created |
| 47 | **Create Upload Timestamp** | When uploaded | Task 45 | 🔴 Not Created |
| 48 | **Create Customer Notes** | Optional customer notes | Task 45 | 🔴 Not Created |
| 49 | **Create Upload Validation** | Validate file type | Task 45 | 🔴 Not Created |
| 50 | **Create Image Validation** | JPG, PNG validation | Task 49 | 🔴 Not Created |
| 51 | **Create PDF Validation** | PDF file validation | Task 49 | 🔴 Not Created |
| 52 | **Create File Size Limit** | Max 5MB file size | Task 49 | 🔴 Not Created |
| 53 | **Create Image Compression** | Compress large images | Task 49 | 🔴 Not Created |
| 54 | **Create Secure Upload URL** | Signed upload URL | Task 45 | 🔴 Not Created |
| 55 | **Create S3 Storage** | S3 bucket for proofs | Task 45 | 🔴 Not Created |
| 56 | **Create Upload API** | POST /api/payments/{id}/proof/ | Task 45 | 🔴 Not Created |
| 57 | **Create Multiple Uploads** | Allow multiple proofs | Task 56 | 🔴 Not Created |
| 58 | **Verify Upload Flow** | Test upload process | Task 57 | 🔴 Not Created |

---

### Group E: Admin Verification Workflow (Tasks 59-72)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 59 | **Create Pending Payments View** | Admin list pending | Task 58 | 🔴 Not Created |
| 60 | **Create Payment Detail View** | View payment details | Task 59 | 🔴 Not Created |
| 61 | **Create Proof Preview** | View uploaded proof | Task 60 | 🔴 Not Created |
| 62 | **Create Image Viewer** | Zoom/pan image | Task 61 | 🔴 Not Created |
| 63 | **Create PDF Viewer** | View PDF inline | Task 61 | 🔴 Not Created |
| 64 | **Create Verify Button** | Confirm payment button | Task 60 | 🔴 Not Created |
| 65 | **Create Reject Button** | Reject payment button | Task 60 | 🔴 Not Created |
| 66 | **Create Rejection Reason** | Reason for rejection | Task 65 | 🔴 Not Created |
| 67 | **Create Verification API** | POST /api/payments/{id}/verify/ | Task 64 | 🔴 Not Created |
| 68 | **Create Rejection API** | POST /api/payments/{id}/reject/ | Task 65 | 🔴 Not Created |
| 69 | **Create Confirmation Email** | Email on confirmation | Task 67 | 🔴 Not Created |
| 70 | **Create Rejection Email** | Email on rejection | Task 68 | 🔴 Not Created |
| 71 | **Create Verification Log** | Log who verified | Task 67 | 🔴 Not Created |
| 72 | **Verify Admin Workflow** | Test admin flow | Task 71 | 🔴 Not Created |

---

### Group F: Frontend & Testing (Tasks 73-86)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 73 | **Create BankTransfer Types** | TypeScript interfaces | Task 72 | 🔴 Not Created |
| 74 | **Create BankTransfer API Client** | Frontend API client | Task 73 | 🔴 Not Created |
| 75 | **Create Payment Hook** | useBankTransfer hook | Task 74 | 🔴 Not Created |
| 76 | **Create Bank Details Display** | Show bank details UI | Task 74 | 🔴 Not Created |
| 77 | **Create Copy Button** | Copy details button | Task 76 | 🔴 Not Created |
| 78 | **Create Countdown Timer** | Time until expiry | Task 76 | 🔴 Not Created |
| 79 | **Create Upload Component** | File upload component | Task 74 | 🔴 Not Created |
| 80 | **Create Upload Progress** | Upload progress bar | Task 79 | 🔴 Not Created |
| 81 | **Create Upload Preview** | Preview before upload | Task 79 | 🔴 Not Created |
| 82 | **Create Upload Success** | Success confirmation | Task 79 | 🔴 Not Created |
| 83 | **Create Pending Status Page** | Awaiting verification | Task 74 | 🔴 Not Created |
| 84 | **Create BankTransfer Button** | Payment method button | Task 74 | 🔴 Not Created |
| 85 | **Create Integration Tests** | Test full flow | Task 72 | 🔴 Not Created |
| 86 | **Create Documentation** | Bank transfer docs | Task 85 | 🔴 Not Created |

---

## Expected Final Structure

```
backend/
└── apps/
    └── payments/
        ├── processors/
        │   └── bank_transfer/
        │       ├── __init__.py
        │       ├── processor.py              # BankTransferProcessor (Task 15)
        │       ├── config.py                 # Configuration (Task 11)
        │       ├── reference.py              # Reference generator (Task 29)
        │       └── instructions.py           # Instructions builder (Task 32)
        ├── models/
        │   ├── bank_account.py               # BankAccount model (Task 01)
        │   └── payment_proof.py              # PaymentProof model (Task 45)
        ├── api/
        │   ├── bank_transfer_views.py        # Bank transfer APIs (Task 56)
        │   └── verification_views.py         # Admin verification (Task 67)
        └── tasks/
            ├── expiry_task.py                # Expiry Celery task (Task 24)
            └── reminder_task.py              # Reminder Celery task (Task 42)

frontend/
└── lib/
    └── payments/
        └── bank-transfer/
            ├── types.ts                      # Types (Task 73)
            ├── client.ts                     # API client (Task 74)
            └── hooks.ts                      # Hooks (Task 75)
└── components/
    └── checkout/
        ├── BankTransferButton.tsx            # Button (Task 84)
        ├── BankDetailsDisplay.tsx            # Details (Task 76)
        ├── PaymentProofUpload.tsx            # Upload (Task 79)
        ├── CountdownTimer.tsx                # Timer (Task 78)
        └── PendingStatusPage.tsx             # Pending (Task 83)
```

---

## Progress Tracking

| Group | Name | Tasks | Completed | Progress |
|-------|------|-------|-----------|----------|
| A | Bank Account Configuration | 14 | 0 | 0% |
| B | Bank Transfer Processor | 14 | 0 | 0% |
| C | Payment Reference & Instructions | 16 | 0 | 0% |
| D | Proof Upload & Verification | 14 | 0 | 0% |
| E | Admin Verification Workflow | 14 | 0 | 0% |
| F | Frontend & Testing | 14 | 0 | 0% |
| **Total** | | **86** | **0** | **0%** |

---

## Sri Lanka Banks Reference

| Bank | Account Format |
|------|----------------|
| Bank of Ceylon | 10-digit |
| People's Bank | 10-digit |
| Commercial Bank | 12-digit |
| Sampath Bank | 12-digit |
| Hatton National Bank | 14-digit |
| Seylan Bank | 13-digit |
| Nations Trust Bank | 12-digit |
| DFCC Bank | 10-digit |

---

## Notes for AI Agents

1. **Execute tasks in order** - Follow Group A → F sequence
2. **Multiple banks** - Support multiple bank accounts
3. **Reference required** - Customer must include reference
4. **Expiry handling** - Auto-expire unpaid orders
5. **File validation** - Strict image/PDF validation
6. **File size limit** - Max 5MB uploads
7. **Admin verification** - Manual confirmation required
8. **Notifications** - Send reminders before expiry
9. **Rejection reasons** - Provide clear rejection reasons
