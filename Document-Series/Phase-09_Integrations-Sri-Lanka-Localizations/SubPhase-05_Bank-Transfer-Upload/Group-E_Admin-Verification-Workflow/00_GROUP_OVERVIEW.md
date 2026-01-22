# Group E: Admin Verification Workflow

> **Phase:** 09 - Integrations & Sri Lanka Localizations  
> **SubPhase:** 05 - Bank Transfer with Upload  
> **Group:** E of F  
> **Tasks Covered:** 59-72  
> **Group Goal:** Implement admin verification workflow for bank transfer payments

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group-D_Proof-Upload-Verification](../Group-D_Proof-Upload-Verification/)
- **→ Next Group:** [Group-F_Frontend-Testing](../Group-F_Frontend-Testing/)

---

## Group Overview

This group implements admin verification workflow. Creates pending payments view listing all pending bank transfers. Creates payment detail view with full order and transaction details. Creates proof preview with image viewer (zoom/pan) and PDF viewer. Creates verify and reject buttons for admin actions. Creates rejection reason input. Creates verification and rejection APIs. Creates confirmation and rejection emails to customers. Creates verification log for audit trail. Verifies admin workflow.

### Key Outcomes

- Pending payments view
- Payment detail view
- Proof preview
- Image viewer (zoom/pan)
- PDF viewer
- Verify button
- Reject button
- Rejection reason
- Verification API
- Rejection API
- Confirmation email
- Rejection email
- Verification log
- Admin workflow verified

### Technology Context

- **Admin:** ERP dashboard
- **Viewer:** Image zoom/pan
- **Audit:** Log all actions
- **Notify:** Customer on decision

---

## Documents in This Group

| # | Document | Description | Tasks Covered |
|---|----------|-------------|---------------|
| 01 | `01_Tasks-59-65_Views-Proof-Actions.md` | Create views and actions | 59-65 |
| 02 | `02_Tasks-66-72_API-Email-Verify.md` | Create API and notifications | 66-72 |

---

## Task Summary

| Task # | Task Name | Complexity | Dependencies |
|--------|-----------|------------|--------------|
| 59 | Create Pending Payments View | Medium | Task 58 |
| 60 | Create Payment Detail View | Medium | Task 59 |
| 61 | Create Proof Preview | Medium | Task 60 |
| 62 | Create Image Viewer | Medium | Task 61 |
| 63 | Create PDF Viewer | Medium | Task 61 |
| 64 | Create Verify Button | Low | Task 60 |
| 65 | Create Reject Button | Low | Task 60 |
| 66 | Create Rejection Reason | Low | Task 65 |
| 67 | Create Verification API | Medium | Task 64 |
| 68 | Create Rejection API | Medium | Task 65 |
| 69 | Create Confirmation Email | Medium | Task 67 |
| 70 | Create Rejection Email | Medium | Task 68 |
| 71 | Create Verification Log | Medium | Task 67 |
| 72 | Verify Admin Workflow | Low | Task 71 |

---

## Execution Order

```
Task 59: Pending Payments View
    │
    ▼
Task 60: Payment Detail View
    │
    ├────────┬────────┬────────┐
    ▼        ▼        ▼        ▼
T-61     T-64     T-65
(Proof) (Verify)(Reject)
    │        │        │
    ├────┐   │        ▼
    ▼    ▼   │      T-66
T-62   T-63  │    (Reason)
(Img)  (PDF) │        │
    │    │   │        │
    └────┘   │        │
         │   │        │
         ▼   ▼        ▼
      T-67        T-68
   (VerifyAPI) (RejectAPI)
         │        │
         ▼        ▼
      T-69     T-70
   (ConfEmail)(RejEmail)
         │        │
         └────┬───┘
              │
              ▼
        Task 71: Verification Log
              │
              ▼
        Task 72: Verify
```

---

## Expected Deliverables

```
backend/
└── apps/
    └── payments/
        └── api/
            └── verification_views.py
frontend/
└── app/
    └── (erp)/
        └── payments/
            └── bank-transfer/
                ├── page.tsx
                └── [id]/
                    └── page.tsx
```

---

## Notes for AI Agents

### Pending Payments View (Task 59)
| Feature | List pending |
|---------|--------------|
| Filter | Status = PENDING |
| Sort | Oldest first |
| Show | Order ID, amount, date, proof status |

### Payment Detail View (Task 60)
| Show | Full details |
|------|--------------|
| Order | Order details |
| Customer | Customer info |
| Transaction | Transaction details |
| Proofs | Uploaded files |

### Proof Preview (Task 61)
| Feature | View uploaded proofs |
|---------|----------------------|
| Types | Image, PDF |
| Download | Allow download |

### Image Viewer (Task 62)
| Library | react-zoom-pan-pinch |
|---------|----------------------|
| Features | Zoom, pan, rotate |
| Max zoom | 5x |

### PDF Viewer (Task 63)
| Library | react-pdf |
|---------|-----------|
| Features | Page navigation |
| Inline | Yes |

### Verify Button (Task 64)
| Button | "Confirm Payment" |
|--------|-------------------|
| Style | Primary green |
| Confirm | Yes/No dialog |

### Reject Button (Task 65)
| Button | "Reject Payment" |
|--------|------------------|
| Style | Danger red |
| Requires | Rejection reason |

### Rejection Reason (Task 66)
| Input | Textarea |
|-------|----------|
| Required | Yes |
| Options | Predefined reasons |
| Custom | Allow custom reason |

### Verification API (Task 67)
| Endpoint | POST /api/payments/{id}/verify/ |
|----------|----------------------------------|
| Auth | Admin only |
| Action | Update status to CONFIRMED |

### Rejection API (Task 68)
| Endpoint | POST /api/payments/{id}/reject/ |
|----------|----------------------------------|
| Body | { reason: string } |
| Action | Update status to REJECTED |

### Confirmation Email (Task 69)
| Template | payment_confirmed.html |
|----------|------------------------|
| Subject | "Payment Confirmed - Order #XXX" |
| Include | Order details, next steps |

### Rejection Email (Task 70)
| Template | payment_rejected.html |
|----------|----------------------|
| Subject | "Payment Issue - Order #XXX" |
| Include | Rejection reason, retry link |

### Verification Log (Task 71)
| Model | PaymentVerificationLog |
|-------|------------------------|
| Fields | transaction, admin, action, timestamp |
| Use | Audit trail |
