# SubPhase 06: Cash on Delivery (COD) - Tasks Summary

> **Phase:** 09 - Integrations & Sri Lanka Localizations  
> **SubPhase Index:** 06 of 12  
> **SubPhase Goal:** Implement Cash on Delivery payment workflow with risk management and reconciliation  
> **Total Tasks:** 90 | **Status:** Planning  
> **Estimated Duration:** 11-13 hours

---

## Navigation

- **↑ Parent:** [00_SUBPHASES_SUMMARY.md](../00_SUBPHASES_SUMMARY.md)
- **← Previous SubPhase:** [SubPhase-05_Bank-Transfer-Upload](../SubPhase-05_Bank-Transfer-Upload/)
- **→ Next SubPhase:** [SubPhase-07_Shipping-Zone-Configuration](../SubPhase-07_Shipping-Zone-Configuration/)

---

## SubPhase Overview

This sub-phase implements Cash on Delivery (COD), a critical payment method in Sri Lanka where many customers prefer paying upon delivery.

### Key Outcomes
- COD payment processor
- Zone-based COD availability
- COD fee configuration
- Order limits (min/max)
- Phone/OTP verification
- Delivery agent collection
- COD reconciliation reports

### COD Flow
```
Checkout (COD) → OTP Verification → Order Placed → 
Dispatch → Delivery Attempt → Cash Collected/Failed → 
Reconciliation
```

### Risk Management
- Phone verification (OTP)
- Address verification
- Previous order history check
- COD limit based on history
- Zone-based availability

### Technology Context
- **Backend:** Django 5.x, DRF
- **OTP:** SMS gateway integration
- **Zones:** District-based availability
- **Currency:** LKR (Sri Lankan Rupees)

---

## Task Execution Order

```
TASK GROUP A: COD Configuration (Tasks 01-16)
        │
        ▼
TASK GROUP B: COD Processor Implementation (Tasks 17-32)
        │
        ▼
TASK GROUP C: Risk Management (Tasks 33-48)
        │
        ▼
TASK GROUP D: Delivery & Collection (Tasks 49-62)
        │
        ▼
TASK GROUP E: Reconciliation & Reports (Tasks 63-76)
        │
        ▼
TASK GROUP F: Frontend & Testing (Tasks 77-90)
```

---

## Task Index

### Group A: COD Configuration (Tasks 01-16)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 01 | **Create CODConfig Model** | Tenant COD settings | SubPhase-01 | 🔴 Not Created |
| 02 | **Create Is Enabled Field** | COD enabled/disabled | Task 01 | 🔴 Not Created |
| 03 | **Create COD Fee Type** | Flat/percentage fee | Task 01 | 🔴 Not Created |
| 04 | **Create COD Fee Amount** | Fee amount/percentage | Task 03 | 🔴 Not Created |
| 05 | **Create Minimum Order** | Minimum order for COD | Task 01 | 🔴 Not Created |
| 06 | **Create Maximum Order** | Maximum order for COD | Task 01 | 🔴 Not Created |
| 07 | **Create OTP Required Field** | Require OTP verification | Task 01 | 🔴 Not Created |
| 08 | **Create First Order Limit** | Limit for first COD order | Task 01 | 🔴 Not Created |
| 09 | **Create COD Zones Model** | Zone COD availability | Task 01 | 🔴 Not Created |
| 10 | **Create Zone District Link** | Link to districts | Task 09 | 🔴 Not Created |
| 11 | **Create Zone COD Available** | COD available in zone | Task 09 | 🔴 Not Created |
| 12 | **Create Zone COD Max** | Zone-specific max order | Task 09 | 🔴 Not Created |
| 13 | **Create COD Config Admin** | Django admin for COD | Task 01 | 🔴 Not Created |
| 14 | **Create Zone Config Admin** | Admin for zone COD | Task 09 | 🔴 Not Created |
| 15 | **Create Default COD Settings** | Default tenant settings | Task 01 | 🔴 Not Created |
| 16 | **Verify COD Configuration** | Test config | Task 15 | 🔴 Not Created |

---

### Group B: COD Processor Implementation (Tasks 17-32)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 17 | **Create CODProcessor Class** | Extend PaymentProcessor | Task 16 | 🔴 Not Created |
| 18 | **Create Processor Registration** | Register with factory | Task 17 | 🔴 Not Created |
| 19 | **Create initiate_payment Method** | Start COD payment | Task 17 | 🔴 Not Created |
| 20 | **Create COD Eligibility Check** | Check if COD allowed | Task 19 | 🔴 Not Created |
| 21 | **Create Zone Availability Check** | Check zone allows COD | Task 20 | 🔴 Not Created |
| 22 | **Create Order Amount Check** | Check min/max order | Task 20 | 🔴 Not Created |
| 23 | **Create Customer History Check** | Check past COD orders | Task 20 | 🔴 Not Created |
| 24 | **Create COD Fee Calculation** | Calculate COD fee | Task 17 | 🔴 Not Created |
| 25 | **Create Pending COD Transaction** | Create pending record | Task 19 | 🔴 Not Created |
| 26 | **Create verify_payment Method** | Confirm COD collection | Task 17 | 🔴 Not Created |
| 27 | **Create Cash Collected** | Mark cash collected | Task 26 | 🔴 Not Created |
| 28 | **Create Collection Failed** | Mark collection failed | Task 26 | 🔴 Not Created |
| 29 | **Create Return to Sender** | RTS handling | Task 28 | 🔴 Not Created |
| 30 | **Create process_refund Method** | COD refund (rare) | Task 17 | 🔴 Not Created |
| 31 | **Create Status Transitions** | Valid COD status changes | Task 17 | 🔴 Not Created |
| 32 | **Verify COD Processor** | Test processor flow | Task 31 | 🔴 Not Created |

---

### Group C: Risk Management (Tasks 33-48)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 33 | **Create OTP Verification Service** | OTP for COD orders | Task 32 | 🔴 Not Created |
| 34 | **Create OTP Generate** | Generate 6-digit OTP | Task 33 | 🔴 Not Created |
| 35 | **Create OTP Send SMS** | Send OTP via SMS | Task 34 | 🔴 Not Created |
| 36 | **Create OTP Verify** | Verify entered OTP | Task 33 | 🔴 Not Created |
| 37 | **Create OTP Expiry** | OTP valid for 10 mins | Task 33 | 🔴 Not Created |
| 38 | **Create OTP Retry Limit** | Max 3 attempts | Task 33 | 🔴 Not Created |
| 39 | **Create Phone Validation** | Validate Sri Lanka phone | Task 33 | 🔴 Not Created |
| 40 | **Create Address Verification** | Basic address check | Task 32 | 🔴 Not Created |
| 41 | **Create Blacklist Check** | Check blocked customers | Task 32 | 🔴 Not Created |
| 42 | **Create CODBlacklist Model** | Blacklisted phones/addresses | Task 41 | 🔴 Not Created |
| 43 | **Create Previous COD Check** | Check past COD history | Task 32 | 🔴 Not Created |
| 44 | **Create Success Rate Check** | COD success rate | Task 43 | 🔴 Not Created |
| 45 | **Create Dynamic COD Limit** | Limit based on history | Task 44 | 🔴 Not Created |
| 46 | **Create Risk Score** | Calculate COD risk | Task 45 | 🔴 Not Created |
| 47 | **Create Risk Threshold** | Block high-risk COD | Task 46 | 🔴 Not Created |
| 48 | **Verify Risk Management** | Test risk checks | Task 47 | 🔴 Not Created |

---

### Group D: Delivery & Collection (Tasks 49-62)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 49 | **Create CODCollection Model** | Track COD collection | Task 48 | 🔴 Not Created |
| 50 | **Create Collection Order FK** | Link to order | Task 49 | 🔴 Not Created |
| 51 | **Create Collection Amount** | Expected collection amount | Task 49 | 🔴 Not Created |
| 52 | **Create Collected Amount** | Actual collected amount | Task 49 | 🔴 Not Created |
| 53 | **Create Collection Status** | pending/collected/failed | Task 49 | 🔴 Not Created |
| 54 | **Create Collection Date** | When collected | Task 49 | 🔴 Not Created |
| 55 | **Create Agent Reference** | Delivery agent ID | Task 49 | 🔴 Not Created |
| 56 | **Create Collection Notes** | Notes from agent | Task 49 | 🔴 Not Created |
| 57 | **Create Delivery Attempt Model** | Track delivery attempts | Task 48 | 🔴 Not Created |
| 58 | **Create Attempt Status** | delivered/failed/rescheduled | Task 57 | 🔴 Not Created |
| 59 | **Create Failure Reason** | Why delivery failed | Task 58 | 🔴 Not Created |
| 60 | **Create Max Attempts** | Max delivery attempts (3) | Task 57 | 🔴 Not Created |
| 61 | **Create Reschedule Logic** | Allow customer reschedule | Task 60 | 🔴 Not Created |
| 62 | **Verify Delivery Collection** | Test collection flow | Task 61 | 🔴 Not Created |

---

### Group E: Reconciliation & Reports (Tasks 63-76)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 63 | **Create CODReconciliation Model** | Daily reconciliation | Task 62 | 🔴 Not Created |
| 64 | **Create Reconciliation Date** | Reconciliation date | Task 63 | 🔴 Not Created |
| 65 | **Create Total Expected** | Total expected COD | Task 63 | 🔴 Not Created |
| 66 | **Create Total Collected** | Total collected COD | Task 63 | 🔴 Not Created |
| 67 | **Create Total Failed** | Total failed deliveries | Task 63 | 🔴 Not Created |
| 68 | **Create Variance** | Expected vs collected | Task 63 | 🔴 Not Created |
| 69 | **Create Reconciliation Status** | pending/reconciled | Task 63 | 🔴 Not Created |
| 70 | **Create Courier Reconciliation** | Per-courier breakdown | Task 63 | 🔴 Not Created |
| 71 | **Create Reconciliation Report** | Generate report | Task 63 | 🔴 Not Created |
| 72 | **Create Daily Report Celery** | Auto-generate daily | Task 71 | 🔴 Not Created |
| 73 | **Create COD Summary Report** | Summary statistics | Task 71 | 🔴 Not Created |
| 74 | **Create Success Rate Report** | COD success rate | Task 71 | 🔴 Not Created |
| 75 | **Create Export to Excel** | Export reports | Task 71 | 🔴 Not Created |
| 76 | **Verify Reconciliation** | Test reconciliation | Task 75 | 🔴 Not Created |

---

### Group F: Frontend & Testing (Tasks 77-90)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 77 | **Create COD Types** | TypeScript interfaces | Task 76 | 🔴 Not Created |
| 78 | **Create COD API Client** | Frontend API client | Task 77 | 🔴 Not Created |
| 79 | **Create Eligibility Hook** | useCODEligibility hook | Task 78 | 🔴 Not Created |
| 80 | **Create Payment Hook** | useCODPayment hook | Task 78 | 🔴 Not Created |
| 81 | **Create COD Button** | COD payment button | Task 78 | 🔴 Not Created |
| 82 | **Create COD Fee Display** | Show COD fee | Task 81 | 🔴 Not Created |
| 83 | **Create OTP Input** | OTP verification input | Task 78 | 🔴 Not Created |
| 84 | **Create OTP Timer** | Countdown to resend | Task 83 | 🔴 Not Created |
| 85 | **Create OTP Resend** | Resend OTP button | Task 83 | 🔴 Not Created |
| 86 | **Create Not Available Message** | COD not available UI | Task 79 | 🔴 Not Created |
| 87 | **Create Limit Message** | COD limit reached UI | Task 79 | 🔴 Not Created |
| 88 | **Create Admin Reconciliation** | Admin reconciliation UI | Task 76 | 🔴 Not Created |
| 89 | **Create Integration Tests** | Test COD flow | Task 76 | 🔴 Not Created |
| 90 | **Create Documentation** | COD documentation | Task 89 | 🔴 Not Created |

---

## Expected Final Structure

```
backend/
└── apps/
    └── payments/
        ├── processors/
        │   └── cod/
        │       ├── __init__.py
        │       ├── processor.py              # CODProcessor (Task 17)
        │       ├── config.py                 # Configuration (Task 01)
        │       ├── eligibility.py            # Eligibility check (Task 20)
        │       ├── fee_calculator.py         # Fee calculation (Task 24)
        │       └── risk.py                   # Risk scoring (Task 46)
        ├── models/
        │   ├── cod_config.py                 # CODConfig model (Task 01)
        │   ├── cod_zones.py                  # COD zones (Task 09)
        │   ├── cod_collection.py             # Collection model (Task 49)
        │   ├── delivery_attempt.py           # Attempt model (Task 57)
        │   ├── cod_blacklist.py              # Blacklist model (Task 42)
        │   └── cod_reconciliation.py         # Reconciliation (Task 63)
        ├── services/
        │   ├── otp_service.py                # OTP service (Task 33)
        │   └── reconciliation_service.py     # Reconciliation (Task 71)
        └── tasks/
            └── reconciliation_task.py        # Daily report (Task 72)

frontend/
└── lib/
    └── payments/
        └── cod/
            ├── types.ts                      # Types (Task 77)
            ├── client.ts                     # API client (Task 78)
            └── hooks.ts                      # Hooks (Task 79)
└── components/
    └── checkout/
        ├── CODButton.tsx                     # Button (Task 81)
        ├── CODFeeDisplay.tsx                 # Fee display (Task 82)
        ├── OTPInput.tsx                      # OTP input (Task 83)
        └── CODNotAvailable.tsx               # Not available (Task 86)
```

---

## Progress Tracking

| Group | Name | Tasks | Completed | Progress |
|-------|------|-------|-----------|----------|
| A | COD Configuration | 16 | 0 | 0% |
| B | COD Processor Implementation | 16 | 0 | 0% |
| C | Risk Management | 16 | 0 | 0% |
| D | Delivery & Collection | 14 | 0 | 0% |
| E | Reconciliation & Reports | 14 | 0 | 0% |
| F | Frontend & Testing | 14 | 0 | 0% |
| **Total** | | **90** | **0** | **0%** |

---

## COD Status Flow

```
PENDING → DISPATCHED → OUT_FOR_DELIVERY → 
  ├── COLLECTED (success)
  └── FAILED (failed delivery)
        ├── RESCHEDULED
        └── RETURNED_TO_SENDER
```

---

## Notes for AI Agents

1. **Execute tasks in order** - Follow Group A → F sequence
2. **OTP verification** - Required for first-time COD
3. **Zone-based** - COD availability varies by zone
4. **Risk scoring** - Block high-risk COD orders
5. **Blacklist** - Check phone/address blacklist
6. **Max attempts** - 3 delivery attempts max
7. **Daily reconciliation** - Auto-generate reports
8. **COD fee** - Flat or percentage based
9. **First order limit** - Lower limit for new customers
