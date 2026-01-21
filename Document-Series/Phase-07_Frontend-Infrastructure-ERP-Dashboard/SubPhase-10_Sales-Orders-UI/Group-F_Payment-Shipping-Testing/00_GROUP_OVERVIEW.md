# Group F: Payment, Shipping & Testing

> **Phase:** 07 - Frontend Infrastructure & ERP Dashboard  
> **SubPhase:** 10 - Sales & Orders UI  
> **Group:** F of F  
> **Tasks Covered:** 81-94  
> **Group Goal:** Build payment recording, shipping label generation, and final testing

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group-E_Quotes-Conversion](../Group-E_Quotes-Conversion/)
- **→ Next Group:** None (Last Group) | **Next SubPhase:** [SubPhase-11_POS-Interface](../../SubPhase-11_POS-Interface/)

---

## Group Overview

This group creates payment recording, shipping functionality, and performs final testing. Creates record payment modal with form schema. Builds payment method select (cash, card, bank transfer), amount input with validation, and reference number input. Implements submit payment action. Creates shipping label modal with carrier selection, tracking number input, and print label action. Adds mark as shipped action to update order status. Creates sales module components index exporting all components. Creates sales module documentation. Performs final verification testing of complete sales module.

### Key Outcomes

- Record payment modal
- Payment form schema
- Payment method select
- Payment amount input
- Payment reference input
- Submit payment action
- Shipping label modal
- Carrier selection
- Tracking number input
- Print shipping label
- Mark as shipped action
- Components index file
- Sales module documentation
- Final verification complete

### Technology Context

- **Form:** React Hook Form + Zod
- **Modals:** Dialog components
- **Payment:** Multiple methods
- **Shipping:** Label generation

---

## Documents in This Group

| # | Document | Description | Tasks Covered |
|---|----------|-------------|---------------|
| 01 | `01_Tasks-81-86_Payment-Recording.md` | Create payment modal and form | 81-86 |
| 02 | `02_Tasks-87-94_Shipping-Testing.md` | Create shipping and final testing | 87-94 |

---

## Task Summary

| Task # | Task Name | Complexity | Dependencies |
|--------|-----------|------------|--------------|
| 81 | Create Record Payment Modal | Medium | Task 50 |
| 82 | Create Payment Form Schema | Medium | Task 81 |
| 83 | Create Payment Method Select | Low | Task 82 |
| 84 | Create Payment Amount Input | Low | Task 82 |
| 85 | Create Payment Reference Input | Low | Task 82 |
| 86 | Create Submit Payment Action | Medium | Task 85 |
| 87 | Create Shipping Label Modal | Medium | Task 50 |
| 88 | Create Carrier Selection | Low | Task 87 |
| 89 | Create Tracking Number Input | Low | Task 87 |
| 90 | Create Print Shipping Label | Low | Task 89 |
| 91 | Create Mark as Shipped Action | Low | Task 90 |
| 92 | Create Sales Module Components Index | Low | Task 91 |
| 93 | Create Sales Module Documentation | Low | Task 92 |
| 94 | Final Verification & Testing | Low | Task 93 |

---

## Execution Order

```
Task 81: Record Payment Modal
    │
    ▼
Task 82: Payment Form Schema
    │
    ├──────────┬──────────┬──────────┐
    ▼          ▼          ▼          │
Task 83    Task 84    Task 85       │
(Method)   (Amount)   (Reference)   │
    │          │          │          │
    └──────────┴──────────┘          │
               │                     │
               ▼                     │
         Task 86: Submit             │
               │                     │
               └─────────────────────┘
                          │
                          ▼
                    Task 87: Shipping Modal
                          │
                    ┌─────┴─────┐
                    ▼           ▼
                 Task 88    Task 89
                (Carrier)  (Tracking)
                    │           │
                    └─────┬─────┘
                          ▼
                    Task 90: Print Label
                          │
                          ▼
                    Task 91: Mark Shipped
                          │
                          ▼
                    Task 92: Components Index
                          │
                          ▼
                    Task 93: Documentation
                          │
                          ▼
                    Task 94: Testing
```

---

## Expected Deliverables

```
frontend/
├── components/
│   └── modules/
│       └── sales/
│           ├── Payments/
│           │   ├── RecordPaymentModal.tsx
│           │   ├── PaymentMethodSelect.tsx
│           │   ├── PaymentAmountInput.tsx
│           │   ├── PaymentReferenceInput.tsx
│           │   ├── PaymentHistory.tsx
│           │   └── index.ts
│           ├── Shipping/
│           │   ├── ShippingLabelModal.tsx
│           │   ├── CarrierSelect.tsx
│           │   ├── TrackingNumberInput.tsx
│           │   ├── PrintShippingLabel.tsx
│           │   └── index.ts
│           └── index.ts
├── lib/
│   └── validations/
│       └── payment.ts
└── docs/
    └── SALES_MODULE.md
```

---

## Notes for AI Agents

### Payment Form Schema (Task 82)
| Field | Type | Validation |
|-------|------|------------|
| order_id | string | Required UUID |
| amount | number | Required, > 0 |
| method | string | Required enum |
| reference | string | Conditional |
| date | date | Required, <= today |
| notes | string | Optional |

### Payment Methods (Task 83)
| Method | Code | Requires Reference |
|--------|------|-------------------|
| Cash | CASH | No |
| Credit Card | CARD | Yes (last 4) |
| Debit Card | DEBIT | Yes (last 4) |
| Bank Transfer | BANK | Yes |
| Cheque | CHEQUE | Yes |

### Payment Amount (Task 84)
| Validation | Rule |
|------------|------|
| Min | 0.01 |
| Max | Order balance |
| Format | 2 decimal places |
| Currency | LKR |

### Payment Reference (Task 85)
| Method | Reference Format |
|--------|-----------------|
| Card | Last 4 digits |
| Bank | Transaction ID |
| Cheque | Cheque number |

### Shipping Carriers (Task 88)
| Carrier | Code |
|---------|------|
| Sri Lanka Post | SLPOST |
| Domex | DOMEX |
| Pronto | PRONTO |
| Fineprint | FINEPRINT |
| Custom | OTHER |

### Tracking Number (Task 89)
| Carrier | Format |
|---------|--------|
| SL Post | EMXXXXXXLK |
| Domex | DXXXXXXXXXXX |
| Custom | Freeform |

### Print Label (Task 90)
| Content | Description |
|---------|-------------|
| From | Business address |
| To | Customer address |
| Order # | Order reference |
| Barcode | Tracking barcode |
| Weight | Package weight |

### Mark Shipped (Task 91)
| Step | Action |
|------|--------|
| 1 | Update order status |
| 2 | Save tracking number |
| 3 | Send notification |
| 4 | Log timeline event |

### Documentation (Task 93)
| Section | Content |
|---------|---------|
| Components | All sales components |
| Hooks | Custom hooks |
| API | Endpoints used |
| Forms | Validation schemas |
| Flows | Order lifecycle |

### Final Testing (Task 94)
| Test Case | Scenario |
|-----------|----------|
| Order List | View, filter, sort |
| Order Details | View, update status |
| Invoices | List, view, send |
| Quotes | Create, convert |
| Payments | Record payment |
| Shipping | Generate label |
