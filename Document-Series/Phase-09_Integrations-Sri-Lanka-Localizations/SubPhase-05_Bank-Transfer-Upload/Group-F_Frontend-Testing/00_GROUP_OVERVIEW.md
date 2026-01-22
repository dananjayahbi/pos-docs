# Group F: Frontend & Testing

> **Phase:** 09 - Integrations & Sri Lanka Localizations  
> **SubPhase:** 05 - Bank Transfer with Upload  
> **Group:** F of F  
> **Tasks Covered:** 73-86  
> **Group Goal:** Create frontend bank transfer components and integration testing

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group-E_Admin-Verification-Workflow](../Group-E_Admin-Verification-Workflow/)
- **→ Next Group:** None (Last Group) | **Next SubPhase:** [SubPhase-06_Cash-On-Delivery](../SubPhase-06_Cash-On-Delivery/)

---

## Group Overview

This group creates frontend bank transfer integration. Creates BankTransfer TypeScript types and API client. Creates useBankTransfer hook for payment flow. Creates bank details display component with copy button. Creates countdown timer for expiry. Creates upload component with progress bar and preview. Creates upload success confirmation. Creates pending status page for awaiting verification. Creates BankTransfer payment button. Creates integration tests. Creates bank transfer documentation.

### Key Outcomes

- BankTransfer types (TypeScript)
- BankTransfer API client
- useBankTransfer hook
- Bank details display
- Copy button
- Countdown timer
- Upload component
- Upload progress
- Upload preview
- Upload success
- Pending status page
- BankTransfer button
- Integration tests
- Bank transfer documentation

### Technology Context

- **Frontend:** Next.js, TypeScript
- **Upload:** Drag & drop
- **Timer:** Countdown to expiry
- **Copy:** Clipboard API

---

## Documents in This Group

| # | Document | Description | Tasks Covered |
|---|----------|-------------|---------------|
| 01 | `01_Tasks-73-79_Types-Display-Upload.md` | Create types, display, and upload | 73-79 |
| 02 | `02_Tasks-80-86_Progress-Testing-Docs.md` | Create progress, testing, and documentation | 80-86 |

---

## Task Summary

| Task # | Task Name | Complexity | Dependencies |
|--------|-----------|------------|--------------|
| 73 | Create BankTransfer Types | Low | Task 72 |
| 74 | Create BankTransfer API Client | Medium | Task 73 |
| 75 | Create Payment Hook | Medium | Task 74 |
| 76 | Create Bank Details Display | Medium | Task 74 |
| 77 | Create Copy Button | Low | Task 76 |
| 78 | Create Countdown Timer | Medium | Task 76 |
| 79 | Create Upload Component | Medium | Task 74 |
| 80 | Create Upload Progress | Low | Task 79 |
| 81 | Create Upload Preview | Low | Task 79 |
| 82 | Create Upload Success | Low | Task 79 |
| 83 | Create Pending Status Page | Medium | Task 74 |
| 84 | Create BankTransfer Button | Medium | Task 74 |
| 85 | Create Integration Tests | Medium | Task 72 |
| 86 | Create Documentation | Medium | Task 85 |

---

## Execution Order

```
Task 73: BankTransfer Types
    │
    ▼
Task 74: BankTransfer API Client
    │
    ├────────┬────────┬────────┬────────┐
    ▼        ▼        ▼        ▼        ▼
T-75     T-76     T-79     T-83     T-84
(Hook) (Display)(Upload)(Pending)(Button)
    │        │        │        │        │
    │   ┌────┴────┐   ├────┬───┤        │
    │   ▼         ▼   ▼    ▼   ▼        │
    │ T-77      T-78 T-80  T-81 T-82    │
    │(Copy)  (Timer)(Prog)(Prev)(Succ)  │
    │   │         │   │    │    │       │
    └───┴─────────┴───┴────┴────┴───────┘
                         │
                         ▼
                   Task 85: Integration Tests
                         │
                         ▼
                   Task 86: Documentation
```

---

## Expected Deliverables

```
frontend/
├── lib/
│   └── payments/
│       └── bank-transfer/
│           ├── types.ts
│           ├── client.ts
│           └── hooks.ts
├── components/
│   └── checkout/
│       ├── BankTransferButton.tsx
│       ├── BankDetailsDisplay.tsx
│       ├── PaymentProofUpload.tsx
│       ├── CountdownTimer.tsx
│       └── PendingStatusPage.tsx
└── __tests__/
    └── payments/
        └── bank-transfer.test.ts
```

---

## Notes for AI Agents

### BankTransfer Types (Task 73)
| Type | Fields |
|------|--------|
| BankAccount | name, account_number, branch |
| BankTransferResponse | accounts, reference, expires_at |
| PaymentProof | file, uploaded_at, notes |

### BankTransfer API Client (Task 74)
| Method | Endpoint |
|--------|----------|
| initiate | POST /api/payments/bank-transfer/initiate/ |
| uploadProof | POST /api/payments/{id}/proof/ |
| getStatus | GET /api/payments/{id}/status/ |

### Payment Hook (Task 75)
| Hook | useBankTransfer |
|------|-----------------|
| Return | initiate, uploadProof, status |

### Bank Details Display (Task 76)
| Component | BankDetailsDisplay |
|-----------|---------------------|
| Props | accounts, reference, amount, expiresAt |
| Display | Formatted bank details |

### Copy Button (Task 77)
| Component | CopyButton |
|-----------|------------|
| Feature | Copy to clipboard |
| Feedback | "Copied!" tooltip |

### Countdown Timer (Task 78)
| Component | CountdownTimer |
|-----------|----------------|
| Props | expiresAt |
| Display | HH:MM:SS |
| Warning | Red when < 1 hour |

### Upload Component (Task 79)
| Component | PaymentProofUpload |
|-----------|---------------------|
| Feature | Drag & drop |
| Accept | JPG, PNG, PDF |
| Max size | 5MB |

### Upload Progress (Task 80)
| Component | UploadProgress |
|-----------|----------------|
| Display | Progress bar |
| Percent | 0-100% |

### Upload Preview (Task 81)
| Feature | Preview before upload |
|---------|----------------------|
| Image | Thumbnail |
| PDF | First page or icon |

### Upload Success (Task 82)
| Display | Success message |
|---------|-----------------|
| Message | "Proof uploaded successfully" |
| Icon | Green checkmark |

### Pending Status Page (Task 83)
| Route | /checkout/pending |
|-------|-------------------|
| Display | Awaiting verification |
| Status | Real-time updates |

### BankTransfer Button (Task 84)
| Component | BankTransferButton |
|-----------|---------------------|
| Props | orderId, amount |
| Display | Bank icon + "Bank Transfer" |

### Integration Tests (Task 85)
| Test | Flow |
|------|------|
| 1 | Select bank transfer |
| 2 | View bank details |
| 3 | Upload proof |
| 4 | Admin verifies |
| 5 | Order confirmed |

### Documentation (Task 86)
| Section | Content |
|---------|---------|
| Setup | Bank account config |
| Flow | Customer flow |
| Admin | Verification flow |
| Expiry | Expiry handling |
| Troubleshooting | Common issues |
