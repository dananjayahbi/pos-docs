# SubPhase 02: PayHere Integration - Tasks Summary

> **Phase:** 09 - Integrations & Sri Lanka Localizations  
> **SubPhase Index:** 02 of 12  
> **SubPhase Goal:** Integrate PayHere payment gateway - Sri Lanka's leading payment processor  
> **Total Tasks:** 92 | **Status:** Planning  
> **Estimated Duration:** 12-14 hours

---

## Navigation

- **↑ Parent:** [00_SUBPHASES_SUMMARY.md](../00_SUBPHASES_SUMMARY.md)
- **← Previous SubPhase:** [SubPhase-01_Payment-Gateway-Architecture](../SubPhase-01_Payment-Gateway-Architecture/)
- **→ Next SubPhase:** [SubPhase-03_WebXPay-Integration](../SubPhase-03_WebXPay-Integration/)

---

## SubPhase Overview

This sub-phase integrates PayHere, Sri Lanka's leading payment gateway, supporting card payments (Visa, Master, Amex), online banking, and mobile wallets.

### Key Outcomes
- PayHere processor implementation
- Checkout page redirect flow
- Payment notification webhook
- Payment verification
- Refund processing
- Sandbox/production mode switching

### PayHere Payment Methods
- Visa / Mastercard / Amex
- Commercial Bank iPay
- BOC B-pay
- Sampath Vishwa
- FriMi / HNB SOLO
- genie / iPay

### PayHere Flow
```
Checkout → Initialize Payment → Redirect to PayHere →
Customer Pays → PayHere Redirects → Webhook Notification →
Verify Payment → Update Order
```

### Technology Context
- **Backend:** Django 5.x, DRF
- **PayHere API:** REST-based
- **Security:** MD5 hash signature
- **Sandbox:** sandbox.payhere.lk

---

## Task Execution Order

```
TASK GROUP A: PayHere Configuration (Tasks 01-16)
        │
        ▼
TASK GROUP B: PayHere Processor Implementation (Tasks 17-34)
        │
        ▼
TASK GROUP C: Payment Initialization (Tasks 35-50)
        │
        ▼
TASK GROUP D: Webhook & Notification (Tasks 51-66)
        │
        ▼
TASK GROUP E: Verification & Refunds (Tasks 67-80)
        │
        ▼
TASK GROUP F: Frontend Integration & Testing (Tasks 81-92)
```

---

## Task Index

### Group A: PayHere Configuration (Tasks 01-16)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 01 | **Create PayHere Constants** | API URLs, endpoints | SubPhase-01 | 🔴 Not Created |
| 02 | **Create Sandbox URL Config** | sandbox.payhere.lk | Task 01 | 🔴 Not Created |
| 03 | **Create Production URL Config** | www.payhere.lk | Task 01 | 🔴 Not Created |
| 04 | **Create PayHere Settings** | Django settings module | Task 01 | 🔴 Not Created |
| 05 | **Create Merchant ID Setting** | PAYHERE_MERCHANT_ID | Task 04 | 🔴 Not Created |
| 06 | **Create Merchant Secret Setting** | PAYHERE_MERCHANT_SECRET | Task 04 | 🔴 Not Created |
| 07 | **Create Sandbox Toggle Setting** | PAYHERE_SANDBOX | Task 04 | 🔴 Not Created |
| 08 | **Create Notify URL Setting** | Webhook endpoint URL | Task 04 | 🔴 Not Created |
| 09 | **Create Return URL Setting** | Success redirect URL | Task 04 | 🔴 Not Created |
| 10 | **Create Cancel URL Setting** | Cancel redirect URL | Task 04 | 🔴 Not Created |
| 11 | **Create PayHere Config Model** | Tenant-specific config | Task 04 | 🔴 Not Created |
| 12 | **Create Config Encryption** | Encrypt merchant secret | Task 11 | 🔴 Not Created |
| 13 | **Create Config Validation** | Validate credentials | Task 11 | 🔴 Not Created |
| 14 | **Create Environment Detection** | Auto sandbox/production | Task 07 | 🔴 Not Created |
| 15 | **Create PayHere Client Init** | Initialize API client | Task 14 | 🔴 Not Created |
| 16 | **Verify PayHere Configuration** | Test config loading | Task 15 | 🔴 Not Created |

---

### Group B: PayHere Processor Implementation (Tasks 17-34)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 17 | **Create PayHereProcessor Class** | Extend PaymentProcessor | Task 16 | 🔴 Not Created |
| 18 | **Create Processor Registration** | Register with factory | Task 17 | 🔴 Not Created |
| 19 | **Create Hash Generator** | MD5 hash for signature | Task 17 | 🔴 Not Created |
| 20 | **Create Hash Parameters** | merchant_id, order_id, etc | Task 19 | 🔴 Not Created |
| 21 | **Create Uppercase MD5** | PayHere requires uppercase | Task 19 | 🔴 Not Created |
| 22 | **Create Amount Formatter** | Format to 2 decimals | Task 17 | 🔴 Not Created |
| 23 | **Create Currency Validator** | Validate LKR currency | Task 17 | 🔴 Not Created |
| 24 | **Create Order ID Generator** | Unique order reference | Task 17 | 🔴 Not Created |
| 25 | **Create Item Name Builder** | Product names for PayHere | Task 17 | 🔴 Not Created |
| 26 | **Create Customer Data Builder** | First name, last name, etc | Task 17 | 🔴 Not Created |
| 27 | **Create Address Builder** | Billing address format | Task 26 | 🔴 Not Created |
| 28 | **Create Phone Formatter** | +94 format for Sri Lanka | Task 26 | 🔴 Not Created |
| 29 | **Create Email Validator** | Validate customer email | Task 26 | 🔴 Not Created |
| 30 | **Create Delivery Fields** | Delivery address separate | Task 27 | 🔴 Not Created |
| 31 | **Create Custom Fields** | custom_1, custom_2 usage | Task 17 | 🔴 Not Created |
| 32 | **Create Payment Intent Builder** | Build complete intent | Task 31 | 🔴 Not Created |
| 33 | **Create Redirect URL Builder** | Build checkout URL | Task 32 | 🔴 Not Created |
| 34 | **Verify Processor Implementation** | Test processor methods | Task 33 | 🔴 Not Created |

---

### Group C: Payment Initialization (Tasks 35-50)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 35 | **Create initiate_payment Method** | Main payment init | Task 34 | 🔴 Not Created |
| 36 | **Create Payment Form Data** | Form parameters | Task 35 | 🔴 Not Created |
| 37 | **Create Checkout Page URL** | PayHere checkout URL | Task 36 | 🔴 Not Created |
| 38 | **Create Pre-Approval API** | Optional pre-approval | Task 35 | 🔴 Not Created |
| 39 | **Create Payment Token** | Store pending payment | Task 35 | 🔴 Not Created |
| 40 | **Create Expiry Handling** | Token expiry logic | Task 39 | 🔴 Not Created |
| 41 | **Create Duplicate Prevention** | Prevent double payments | Task 39 | 🔴 Not Created |
| 42 | **Create Order Lock** | Lock order during payment | Task 41 | 🔴 Not Created |
| 43 | **Create Payment Logging** | Log initiation attempts | Task 35 | 🔴 Not Created |
| 44 | **Create Error Handling** | Handle PayHere errors | Task 35 | 🔴 Not Created |
| 45 | **Create Retry Logic** | Retry failed init | Task 44 | 🔴 Not Created |
| 46 | **Create Timeout Handling** | Handle API timeouts | Task 44 | 🔴 Not Created |
| 47 | **Create Response Parsing** | Parse PayHere response | Task 35 | 🔴 Not Created |
| 48 | **Create Success Response** | Handle successful init | Task 47 | 🔴 Not Created |
| 49 | **Create Error Response** | Handle failed init | Task 47 | 🔴 Not Created |
| 50 | **Verify Payment Initialization** | Test init flow | Task 49 | 🔴 Not Created |

---

### Group D: Webhook & Notification (Tasks 51-66)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 51 | **Create PayHere Webhook View** | Webhook endpoint | Task 50 | 🔴 Not Created |
| 52 | **Create Webhook URL Config** | /api/webhooks/payhere/ | Task 51 | 🔴 Not Created |
| 53 | **Create Webhook CSRF Exempt** | Exempt from CSRF | Task 51 | 🔴 Not Created |
| 54 | **Create Webhook IP Whitelist** | PayHere server IPs | Task 51 | 🔴 Not Created |
| 55 | **Create Signature Verification** | Verify MD5 hash | Task 51 | 🔴 Not Created |
| 56 | **Create Signature Components** | Build local hash | Task 55 | 🔴 Not Created |
| 57 | **Create Hash Comparison** | Secure compare hashes | Task 55 | 🔴 Not Created |
| 58 | **Create Webhook Parser** | Parse POST parameters | Task 51 | 🔴 Not Created |
| 59 | **Create Status Code Mapping** | Map PayHere status codes | Task 58 | 🔴 Not Created |
| 60 | **Create Success Handler** | status_code = 2 | Task 59 | 🔴 Not Created |
| 61 | **Create Pending Handler** | status_code = 0 | Task 59 | 🔴 Not Created |
| 62 | **Create Failed Handler** | status_code = -1, -2, -3 | Task 59 | 🔴 Not Created |
| 63 | **Create Chargeback Handler** | status_code = -4 | Task 59 | 🔴 Not Created |
| 64 | **Create Order Update** | Update order on payment | Task 60 | 🔴 Not Created |
| 65 | **Create Transaction Record** | Save transaction details | Task 64 | 🔴 Not Created |
| 66 | **Verify Webhook Processing** | Test webhook flow | Task 65 | 🔴 Not Created |

---

### Group E: Verification & Refunds (Tasks 67-80)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 67 | **Create verify_payment Method** | Verify payment status | Task 66 | 🔴 Not Created |
| 68 | **Create Verification API Call** | Call PayHere verify API | Task 67 | 🔴 Not Created |
| 69 | **Create Verification Hash** | Hash for verify call | Task 68 | 🔴 Not Created |
| 70 | **Create Verification Response** | Parse verify response | Task 68 | 🔴 Not Created |
| 71 | **Create Payment Reconciliation** | Match with webhook | Task 70 | 🔴 Not Created |
| 72 | **Create process_refund Method** | Process refunds | Task 66 | 🔴 Not Created |
| 73 | **Create Refund API Call** | Call PayHere refund API | Task 72 | 🔴 Not Created |
| 74 | **Create Refund Hash** | Hash for refund call | Task 73 | 🔴 Not Created |
| 75 | **Create Partial Refund** | Support partial refunds | Task 72 | 🔴 Not Created |
| 76 | **Create Refund Validation** | Validate refund amount | Task 75 | 🔴 Not Created |
| 77 | **Create Refund Response** | Parse refund response | Task 73 | 🔴 Not Created |
| 78 | **Create Refund Record** | Save refund details | Task 77 | 🔴 Not Created |
| 79 | **Create Refund Webhook** | Handle refund webhooks | Task 78 | 🔴 Not Created |
| 80 | **Verify Refund Processing** | Test refund flow | Task 79 | 🔴 Not Created |

---

### Group F: Frontend Integration & Testing (Tasks 81-92)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 81 | **Create PayHere Types** | TypeScript interfaces | Task 80 | 🔴 Not Created |
| 82 | **Create PayHere API Client** | Frontend API client | Task 81 | 🔴 Not Created |
| 83 | **Create Initiate Payment Hook** | usePayHerePayment hook | Task 82 | 🔴 Not Created |
| 84 | **Create Redirect Handler** | Handle PayHere redirect | Task 83 | 🔴 Not Created |
| 85 | **Create Success Page** | Payment success page | Task 84 | 🔴 Not Created |
| 86 | **Create Cancel Page** | Payment cancel page | Task 84 | 🔴 Not Created |
| 87 | **Create PayHere Button** | Payment method button | Task 82 | 🔴 Not Created |
| 88 | **Create Loading State** | Payment processing UI | Task 87 | 🔴 Not Created |
| 89 | **Create Sandbox Tests** | Test with sandbox | Task 80 | 🔴 Not Created |
| 90 | **Create Test Cards** | Use PayHere test cards | Task 89 | 🔴 Not Created |
| 91 | **Create E2E Payment Test** | Full payment flow test | Task 90 | 🔴 Not Created |
| 92 | **Create PayHere Documentation** | Integration docs | Task 91 | 🔴 Not Created |

---

## Expected Final Structure

```
backend/
└── apps/
    └── payments/
        ├── processors/
        │   ├── payhere/
        │   │   ├── __init__.py
        │   │   ├── processor.py              # PayHereProcessor (Task 17)
        │   │   ├── config.py                 # Configuration (Task 04)
        │   │   ├── constants.py              # URLs, codes (Task 01)
        │   │   ├── hash.py                   # Hash generation (Task 19)
        │   │   ├── builders.py               # Data builders (Task 26)
        │   │   └── validators.py             # Validators (Task 55)
        │   └── ...
        └── webhooks/
            └── payhere.py                    # Webhook handler (Task 51)

frontend/
└── lib/
    └── payments/
        └── payhere/
            ├── types.ts                      # Types (Task 81)
            ├── client.ts                     # API client (Task 82)
            └── hooks.ts                      # Hooks (Task 83)
└── app/
    └── (storefront)/
        └── checkout/
            ├── success/
            │   └── page.tsx                  # Success page (Task 85)
            └── cancel/
                └── page.tsx                  # Cancel page (Task 86)
└── components/
    └── checkout/
        └── PayHereButton.tsx                 # Button (Task 87)
```

---

## Progress Tracking

| Group | Name | Tasks | Completed | Progress |
|-------|------|-------|-----------|----------|
| A | PayHere Configuration | 16 | 0 | 0% |
| B | PayHere Processor Implementation | 18 | 0 | 0% |
| C | Payment Initialization | 16 | 0 | 0% |
| D | Webhook & Notification | 16 | 0 | 0% |
| E | Verification & Refunds | 14 | 0 | 0% |
| F | Frontend Integration & Testing | 12 | 0 | 0% |
| **Total** | | **92** | **0** | **0%** |

---

## PayHere Status Codes Reference

| Code | Status | Description |
|------|--------|-------------|
| 2 | Success | Payment successful |
| 0 | Pending | Payment pending |
| -1 | Canceled | Customer canceled |
| -2 | Failed | Payment failed |
| -3 | Chargedback | Payment chargedback |

---

## Notes for AI Agents

1. **Execute tasks in order** - Follow Group A → F sequence
2. **MD5 hash uppercase** - PayHere requires uppercase MD5
3. **Sandbox first** - Always test in sandbox mode
4. **Test cards** - Use PayHere provided test cards
5. **Webhook verification** - Always verify MD5 signature
6. **Status codes** - Handle all status codes properly
7. **LKR only** - PayHere processes LKR currency
8. **Merchant secret** - Never expose in frontend
9. **IP whitelist** - Consider whitelisting PayHere IPs
