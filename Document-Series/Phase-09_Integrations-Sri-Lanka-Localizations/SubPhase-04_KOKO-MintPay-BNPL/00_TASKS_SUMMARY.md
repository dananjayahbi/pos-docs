# SubPhase 04: KOKO/MintPay BNPL - Tasks Summary

> **Phase:** 09 - Integrations & Sri Lanka Localizations  
> **SubPhase Index:** 04 of 12  
> **SubPhase Goal:** Integrate Buy Now Pay Later (BNPL) solutions KOKO and MintPay for installment payments  
> **Total Tasks:** 94 | **Status:** Planning  
> **Estimated Duration:** 12-14 hours

---

## Navigation

- **↑ Parent:** [00_SUBPHASES_SUMMARY.md](../00_SUBPHASES_SUMMARY.md)
- **← Previous SubPhase:** [SubPhase-03_WebXPay-Integration](../SubPhase-03_WebXPay-Integration/)
- **→ Next SubPhase:** [SubPhase-05_Bank-Transfer-Upload](../SubPhase-05_Bank-Transfer-Upload/)

---

## SubPhase Overview

This sub-phase integrates Buy Now Pay Later (BNPL) solutions KOKO and MintPay, allowing customers to split payments into installments without interest.

### Key Outcomes
- KOKO processor implementation
- MintPay processor implementation
- Eligibility check before checkout
- Installment plan display
- NIC/phone verification flow
- BNPL payment completion

### KOKO Payment Split Example
```
Total: ₨10,000
├── Today: ₨2,500 (25%)
├── Month 2: ₨2,500
├── Month 3: ₨2,500
└── Month 4: ₨2,500
```

### BNPL Flow
```
Select KOKO/MintPay → Eligibility Check → Redirect to Provider →
Enter NIC/Phone → Credit Check → Approval → First Installment →
Order Confirmed → Monthly Auto-charge
```

### Technology Context
- **Backend:** Django 5.x, DRF
- **BNPL APIs:** KOKO API, MintPay API
- **Verification:** NIC, Phone (+94)
- **Currency:** LKR (Sri Lankan Rupees)

---

## Task Execution Order

```
TASK GROUP A: BNPL Configuration (Tasks 01-16)
        │
        ▼
TASK GROUP B: KOKO Processor Implementation (Tasks 17-34)
        │
        ▼
TASK GROUP C: MintPay Processor Implementation (Tasks 35-50)
        │
        ▼
TASK GROUP D: Eligibility & Verification (Tasks 51-66)
        │
        ▼
TASK GROUP E: Installment Management (Tasks 67-80)
        │
        ▼
TASK GROUP F: Frontend & Testing (Tasks 81-94)
```

---

## Task Index

### Group A: BNPL Configuration (Tasks 01-16)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 01 | **Create BNPL Constants** | KOKO/MintPay URLs | SubPhase-01 | 🔴 Not Created |
| 02 | **Create KOKO Sandbox URL** | KOKO test environment | Task 01 | 🔴 Not Created |
| 03 | **Create KOKO Production URL** | KOKO live environment | Task 01 | 🔴 Not Created |
| 04 | **Create MintPay Sandbox URL** | MintPay test environment | Task 01 | 🔴 Not Created |
| 05 | **Create MintPay Production URL** | MintPay live environment | Task 01 | 🔴 Not Created |
| 06 | **Create KOKO Settings** | KOKO Django settings | Task 01 | 🔴 Not Created |
| 07 | **Create KOKO API Key** | KOKO_API_KEY | Task 06 | 🔴 Not Created |
| 08 | **Create KOKO Merchant ID** | KOKO_MERCHANT_ID | Task 06 | 🔴 Not Created |
| 09 | **Create MintPay Settings** | MintPay Django settings | Task 01 | 🔴 Not Created |
| 10 | **Create MintPay API Key** | MINTPAY_API_KEY | Task 09 | 🔴 Not Created |
| 11 | **Create MintPay Merchant ID** | MINTPAY_MERCHANT_ID | Task 09 | 🔴 Not Created |
| 12 | **Create BNPL Config Model** | Tenant-specific BNPL config | Task 06 | 🔴 Not Created |
| 13 | **Create Min/Max Order Amount** | BNPL order limits | Task 12 | 🔴 Not Created |
| 14 | **Create Installment Plans** | Available plans config | Task 12 | 🔴 Not Created |
| 15 | **Create Config Validation** | Validate BNPL settings | Task 12 | 🔴 Not Created |
| 16 | **Verify BNPL Configuration** | Test config loading | Task 15 | 🔴 Not Created |

---

### Group B: KOKO Processor Implementation (Tasks 17-34)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 17 | **Create KOKOProcessor Class** | Extend PaymentProcessor | Task 16 | 🔴 Not Created |
| 18 | **Create Processor Registration** | Register with factory | Task 17 | 🔴 Not Created |
| 19 | **Create API Client** | KOKO HTTP client | Task 17 | 🔴 Not Created |
| 20 | **Create Authentication** | API authentication | Task 19 | 🔴 Not Created |
| 21 | **Create Request Signing** | Sign API requests | Task 20 | 🔴 Not Created |
| 22 | **Create Amount Formatter** | Format for KOKO API | Task 17 | 🔴 Not Created |
| 23 | **Create Order Data Builder** | Build order payload | Task 17 | 🔴 Not Created |
| 24 | **Create Customer Data Builder** | Build customer data | Task 23 | 🔴 Not Created |
| 25 | **Create NIC Formatter** | Format NIC number | Task 24 | 🔴 Not Created |
| 26 | **Create Phone Formatter** | Format +94 phone | Task 24 | 🔴 Not Created |
| 27 | **Create Item List Builder** | Cart items for KOKO | Task 23 | 🔴 Not Created |
| 28 | **Create Shipping Data** | Shipping address format | Task 23 | 🔴 Not Created |
| 29 | **Create initiate_payment** | Start KOKO payment | Task 28 | 🔴 Not Created |
| 30 | **Create Checkout Redirect** | Redirect to KOKO | Task 29 | 🔴 Not Created |
| 31 | **Create Callback Handler** | Handle KOKO callback | Task 29 | 🔴 Not Created |
| 32 | **Create Status Mapping** | Map KOKO status codes | Task 31 | 🔴 Not Created |
| 33 | **Create Error Handling** | Handle KOKO errors | Task 31 | 🔴 Not Created |
| 34 | **Verify KOKO Processor** | Test KOKO flow | Task 33 | 🔴 Not Created |

---

### Group C: MintPay Processor Implementation (Tasks 35-50)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 35 | **Create MintPayProcessor Class** | Extend PaymentProcessor | Task 34 | 🔴 Not Created |
| 36 | **Create Processor Registration** | Register with factory | Task 35 | 🔴 Not Created |
| 37 | **Create MintPay API Client** | MintPay HTTP client | Task 35 | 🔴 Not Created |
| 38 | **Create MintPay Auth** | API authentication | Task 37 | 🔴 Not Created |
| 39 | **Create MintPay Signing** | Request signing | Task 38 | 🔴 Not Created |
| 40 | **Create MintPay Amount** | Format amounts | Task 35 | 🔴 Not Created |
| 41 | **Create MintPay Order** | Order payload builder | Task 35 | 🔴 Not Created |
| 42 | **Create MintPay Customer** | Customer data builder | Task 41 | 🔴 Not Created |
| 43 | **Create MintPay Items** | Cart items builder | Task 41 | 🔴 Not Created |
| 44 | **Create MintPay initiate** | Start MintPay payment | Task 43 | 🔴 Not Created |
| 45 | **Create MintPay Redirect** | Redirect to MintPay | Task 44 | 🔴 Not Created |
| 46 | **Create MintPay Callback** | Handle callback | Task 44 | 🔴 Not Created |
| 47 | **Create MintPay Status** | Status code mapping | Task 46 | 🔴 Not Created |
| 48 | **Create MintPay Errors** | Error handling | Task 46 | 🔴 Not Created |
| 49 | **Create Provider Abstraction** | Unified BNPL interface | Task 48 | 🔴 Not Created |
| 50 | **Verify MintPay Processor** | Test MintPay flow | Task 49 | 🔴 Not Created |

---

### Group D: Eligibility & Verification (Tasks 51-66)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 51 | **Create Eligibility Service** | Check BNPL eligibility | Task 50 | 🔴 Not Created |
| 52 | **Create KOKO Eligibility API** | KOKO eligibility check | Task 51 | 🔴 Not Created |
| 53 | **Create MintPay Eligibility** | MintPay eligibility check | Task 51 | 🔴 Not Created |
| 54 | **Create Order Amount Check** | Min/max order check | Task 51 | 🔴 Not Created |
| 55 | **Create Customer History Check** | Previous BNPL check | Task 51 | 🔴 Not Created |
| 56 | **Create NIC Validation** | Validate Sri Lanka NIC | Task 51 | 🔴 Not Created |
| 57 | **Create Old NIC Format** | 9-digit NIC validation | Task 56 | 🔴 Not Created |
| 58 | **Create New NIC Format** | 12-digit NIC validation | Task 56 | 🔴 Not Created |
| 59 | **Create Phone Validation** | Validate +94 phone | Task 51 | 🔴 Not Created |
| 60 | **Create Age Verification** | Age from NIC | Task 56 | 🔴 Not Created |
| 61 | **Create Credit Score Check** | BNPL credit check | Task 51 | 🔴 Not Created |
| 62 | **Create Approval Response** | Handle approval | Task 61 | 🔴 Not Created |
| 63 | **Create Rejection Response** | Handle rejection | Task 61 | 🔴 Not Created |
| 64 | **Create Rejection Reasons** | Display rejection reason | Task 63 | 🔴 Not Created |
| 65 | **Create Eligibility Cache** | Cache eligibility result | Task 51 | 🔴 Not Created |
| 66 | **Verify Eligibility Flow** | Test eligibility | Task 65 | 🔴 Not Created |

---

### Group E: Installment Management (Tasks 67-80)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 67 | **Create Installment Calculator** | Calculate installments | Task 66 | 🔴 Not Created |
| 68 | **Create Plan Options** | 3, 4, 6 month plans | Task 67 | 🔴 Not Created |
| 69 | **Create First Payment** | Initial installment | Task 67 | 🔴 Not Created |
| 70 | **Create Monthly Amounts** | Remaining installments | Task 67 | 🔴 Not Created |
| 71 | **Create Due Dates** | Installment due dates | Task 67 | 🔴 Not Created |
| 72 | **Create Installment Display** | Display breakdown UI | Task 67 | 🔴 Not Created |
| 73 | **Create BNPLOrder Model** | Track BNPL orders | Task 66 | 🔴 Not Created |
| 74 | **Create Installment Model** | Individual installments | Task 73 | 🔴 Not Created |
| 75 | **Create Payment Schedule** | Store schedule | Task 74 | 🔴 Not Created |
| 76 | **Create Status Tracking** | Track installment status | Task 74 | 🔴 Not Created |
| 77 | **Create Installment Webhook** | Update on payment | Task 73 | 🔴 Not Created |
| 78 | **Create Overdue Handling** | Handle missed payments | Task 76 | 🔴 Not Created |
| 79 | **Create BNPL Reports** | BNPL reporting | Task 73 | 🔴 Not Created |
| 80 | **Verify Installments** | Test installment flow | Task 79 | 🔴 Not Created |

---

### Group F: Frontend & Testing (Tasks 81-94)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 81 | **Create BNPL Types** | TypeScript interfaces | Task 80 | 🔴 Not Created |
| 82 | **Create BNPL API Client** | Frontend API client | Task 81 | 🔴 Not Created |
| 83 | **Create Eligibility Hook** | useBNPLEligibility hook | Task 82 | 🔴 Not Created |
| 84 | **Create Payment Hook** | useBNPLPayment hook | Task 82 | 🔴 Not Created |
| 85 | **Create KOKO Button** | KOKO payment button | Task 82 | 🔴 Not Created |
| 86 | **Create MintPay Button** | MintPay payment button | Task 82 | 🔴 Not Created |
| 87 | **Create Installment Preview** | Show payment schedule | Task 82 | 🔴 Not Created |
| 88 | **Create BNPL Badge** | Product page badge | Task 82 | 🔴 Not Created |
| 89 | **Create NIC Input** | NIC input component | Task 82 | 🔴 Not Created |
| 90 | **Create Eligibility Modal** | Check eligibility modal | Task 83 | 🔴 Not Created |
| 91 | **Create Approval Screen** | Approval confirmation | Task 84 | 🔴 Not Created |
| 92 | **Create Rejection Screen** | Rejection with reason | Task 84 | 🔴 Not Created |
| 93 | **Create Sandbox Tests** | BNPL sandbox testing | Task 80 | 🔴 Not Created |
| 94 | **Create Documentation** | BNPL integration docs | Task 93 | 🔴 Not Created |

---

## Expected Final Structure

```
backend/
└── apps/
    └── payments/
        ├── processors/
        │   ├── koko/
        │   │   ├── __init__.py
        │   │   ├── processor.py              # KOKOProcessor (Task 17)
        │   │   ├── config.py                 # Configuration (Task 06)
        │   │   ├── client.py                 # API client (Task 19)
        │   │   ├── eligibility.py            # Eligibility check (Task 52)
        │   │   └── validators.py             # NIC/phone validation (Task 56)
        │   ├── mintpay/
        │   │   ├── __init__.py
        │   │   ├── processor.py              # MintPayProcessor (Task 35)
        │   │   ├── config.py                 # Configuration (Task 09)
        │   │   └── client.py                 # API client (Task 37)
        │   └── bnpl/
        │       ├── __init__.py
        │       ├── base.py                   # BNPL base class (Task 49)
        │       ├── eligibility.py            # Eligibility service (Task 51)
        │       └── installments.py           # Installment calculator (Task 67)
        └── models/
            ├── bnpl_order.py                 # BNPLOrder model (Task 73)
            └── installment.py                # Installment model (Task 74)

frontend/
└── lib/
    └── payments/
        └── bnpl/
            ├── types.ts                      # Types (Task 81)
            ├── client.ts                     # API client (Task 82)
            └── hooks.ts                      # Hooks (Task 83)
└── components/
    └── checkout/
        ├── KOKOButton.tsx                    # KOKO button (Task 85)
        ├── MintPayButton.tsx                 # MintPay button (Task 86)
        ├── InstallmentPreview.tsx            # Preview (Task 87)
        ├── BNPLBadge.tsx                     # Badge (Task 88)
        ├── NICInput.tsx                      # NIC input (Task 89)
        └── EligibilityModal.tsx              # Modal (Task 90)
```

---

## Progress Tracking

| Group | Name | Tasks | Completed | Progress |
|-------|------|-------|-----------|----------|
| A | BNPL Configuration | 16 | 0 | 0% |
| B | KOKO Processor Implementation | 18 | 0 | 0% |
| C | MintPay Processor Implementation | 16 | 0 | 0% |
| D | Eligibility & Verification | 16 | 0 | 0% |
| E | Installment Management | 14 | 0 | 0% |
| F | Frontend & Testing | 14 | 0 | 0% |
| **Total** | | **94** | **0** | **0%** |

---

## NIC Format Reference

| Format | Pattern | Example |
|--------|---------|---------|
| Old (9-digit) | XXXXXXXXV/X | 901234567V |
| New (12-digit) | XXXXXXXXXXXX | 199012345678 |

---

## Notes for AI Agents

1. **Execute tasks in order** - Follow Group A → F sequence
2. **NIC validation** - Support both old and new formats
3. **Eligibility first** - Check eligibility before payment
4. **Min/Max orders** - Respect BNPL order limits
5. **Installment display** - Show breakdown clearly
6. **Sandbox testing** - Use test credentials
7. **Provider abstraction** - Unified BNPL interface
8. **Credit check** - Handle approval/rejection gracefully
9. **Age verification** - Derive age from NIC
