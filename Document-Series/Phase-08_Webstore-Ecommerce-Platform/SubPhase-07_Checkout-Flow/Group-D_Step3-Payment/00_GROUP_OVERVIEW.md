# Group D: Step 3 - Payment

> **Phase:** 08 - Webstore & E-Commerce Platform  
> **SubPhase:** 07 - Checkout Flow  
> **Group:** D of F  
> **Tasks Covered:** 53-68  
> **Group Goal:** Create checkout step 3 with Sri Lanka payment options including PayHere, COD, and BNPL

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group-C_Step2-Shipping](../Group-C_Step2-Shipping/)
- **→ Next Group:** [Group-E_Step4-5-Review-Confirm](../Group-E_Step4-5-Review-Confirm/)

---

## Group Overview

This group creates the payment step (step 3). Creates payment page component. Creates payment methods section with method cards. Creates PayHere payment gateway option and card payment option. Creates bank transfer option with bank details display and receipt upload functionality. Creates Cash on Delivery (COD) option with conditions check. Creates BNPL options: KOKO and MintPay. Creates payment selection state tracking, payment method icons, and payment validation. Verifies complete step 3 flow.

### Key Outcomes

- Payment page component
- Payment methods section
- Payment method card
- PayHere option
- Card payment option
- Bank transfer option
- Bank details display
- Receipt upload
- Cash on Delivery option
- COD conditions check
- KOKO BNPL option
- MintPay option
- Payment selection state
- Payment method icons
- Payment validation
- Step 3 flow verified

### Technology Context

- **Gateway:** PayHere (Sri Lanka)
- **COD:** Popular in Sri Lanka
- **BNPL:** KOKO, MintPay
- **Integration:** Stubs for Phase-09

---

## Documents in This Group

| # | Document | Description | Tasks Covered |
|---|----------|-------------|---------------|
| 01 | `01_Tasks-53-60_Methods-Bank-Transfer.md` | Create methods and bank transfer | 53-60 |
| 02 | `02_Tasks-61-68_COD-BNPL-Verify.md` | Create COD, BNPL, and verification | 61-68 |

---

## Task Summary

| Task # | Task Name | Complexity | Dependencies |
|--------|-----------|------------|--------------|
| 53 | Create Payment Page | Low | Task 52 |
| 54 | Create Payment Methods Section | Low | Task 53 |
| 55 | Create Payment Method Card | Low | Task 54 |
| 56 | Create PayHere Option | Medium | Task 55 |
| 57 | Create Card Payment Option | Low | Task 55 |
| 58 | Create Bank Transfer Option | Medium | Task 55 |
| 59 | Create Bank Details Display | Low | Task 58 |
| 60 | Create Receipt Upload | Medium | Task 58 |
| 61 | Create COD Option | Low | Task 55 |
| 62 | Create COD Conditions | Low | Task 61 |
| 63 | Create KOKO BNPL Option | Low | Task 55 |
| 64 | Create MintPay Option | Low | Task 55 |
| 65 | Create Payment Selection State | Low | Task 54 |
| 66 | Create Payment Icons | Low | Task 55 |
| 67 | Create Payment Validation | Low | Task 65 |
| 68 | Verify Step 3 Flow | Low | Task 67 |

---

## Execution Order

```
Task 53: Payment Page
    │
    ▼
Task 54: Payment Methods Section
    │
    ├──────────┬──────────┐
    ▼          ▼          │
Task 55    Task 65       │
(Card)    (State)        │
    │          │          │
    ├──────────┼──────────┼──────────┬──────────┬──────────┐
    ▼          │          ▼          ▼          ▼          │
T-56        │       T-57      T-58      T-61      T-63  T-64
(PayHere)   │      (Card)   (Bank)    (COD)    (KOKO)(Mint)
    │          │          │          │          │     │    │
    │          │          │     ┌────┴────┐     │     │    │
    │          │          │     ▼         ▼     │     │    │
    │          │          │   T-59      T-60    │     │    │
    │          │          │  (Details)(Upload)  │     │    │
    │          │          │     │         │     │     │    │
    │          │          │     └────┬────┘     ▼     │    │
    │          │          │          │       T-62     │    │
    │          │          │          │    (Conditions)│    │
    │          │          │          │          │     │    │
    └──────────┴──────────┴──────────┴──────────┴─────┴────┘
                          │
    ┌─────────────────────┘
    │
    ▼
Task 66: Payment Icons
    │
    ▼
Task 67: Payment Validation
    │
    ▼
Task 68: Verify
```

---

## Expected Deliverables

```
frontend/
├── components/
│   └── storefront/
│       └── checkout/
│           └── Payment/
│               ├── PaymentStep.tsx
│               ├── PaymentMethods.tsx
│               ├── PaymentMethodCard.tsx
│               ├── PayHereOption.tsx
│               ├── CardPaymentOption.tsx
│               ├── BankTransferOption.tsx
│               ├── BankDetailsDisplay.tsx
│               ├── ReceiptUpload.tsx
│               ├── CODOption.tsx
│               ├── KOKOOption.tsx
│               ├── MintPayOption.tsx
│               ├── PaymentIcons.tsx
│               └── index.ts
└── hooks/
    └── store/
        └── usePaymentSelection.ts
```

---

## Notes for AI Agents

### Payment Methods Section (Task 54)
| Order | Method | Popular |
|-------|--------|---------|
| 1 | PayHere | Yes |
| 2 | Credit/Debit Card | Yes |
| 3 | Bank Transfer | Common |
| 4 | Cash on Delivery | Very common |
| 5 | KOKO (BNPL) | Growing |
| 6 | MintPay (BNPL) | Growing |

### Payment Method Card (Task 55)
| Element | Description |
|---------|-------------|
| Radio | Selection indicator |
| Icon | Payment logo |
| Name | Method name |
| Description | Brief info |
| Expanded | Additional fields |

### PayHere Option (Task 56)
| Feature | Description |
|---------|-------------|
| Gateway | Sri Lanka's payment gateway |
| Cards | Visa, Mastercard, Amex |
| Mobile | Dialog, Mobitel, Hutch |
| Logo | PayHere logo |

### Bank Transfer Option (Task 58)
| Feature | Description |
|---------|-------------|
| Type | Manual bank transfer |
| Details | Show bank account info |
| Receipt | Upload payment slip |
| Verify | Manual verification |

### Bank Details Display (Task 59)
| Field | Example |
|-------|---------|
| Bank | Commercial Bank |
| Branch | Colombo |
| Account | 1234567890 |
| Name | Lanka Commerce (Pvt) Ltd |
| Copy | Copy button |

### Receipt Upload (Task 60)
| Feature | Value |
|---------|-------|
| Accept | Image, PDF |
| Size | Max 5MB |
| Preview | Show thumbnail |
| Required | Yes for bank transfer |

### COD Option (Task 61)
| Feature | Description |
|---------|-------------|
| Name | Cash on Delivery |
| Icon | Cash/money icon |
| Popular | Very popular in SL |
| Note | Pay when delivered |

### COD Conditions (Task 62)
| Condition | Limit |
|-----------|-------|
| Max Order | ₨25,000 |
| Min Order | ₨500 |
| Location | Sri Lanka only |
| Note | Show conditions |

### KOKO BNPL (Task 63)
| Feature | Description |
|---------|-------------|
| Type | Buy Now Pay Later |
| Split | 3 payments |
| Interest | 0% if on time |
| Logo | KOKO logo |

### MintPay Option (Task 64)
| Feature | Description |
|---------|-------------|
| Type | Buy Now Pay Later |
| Split | 3 payments |
| Min | ₨1,000 order |
| Logo | MintPay logo |

### Payment Validation (Task 67)
| Rule | Check |
|------|-------|
| Selection | Method selected |
| Bank | Receipt uploaded |
| COD | Conditions met |
| BNPL | Min order met |
