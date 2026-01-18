# SubPhase 03: WebXPay Integration - Tasks Summary

> **Phase:** 09 - Integrations & Sri Lanka Localizations  
> **SubPhase Index:** 03 of 12  
> **SubPhase Goal:** Integrate WebXPay as alternative payment gateway with card and QR payment support  
> **Total Tasks:** 88 | **Status:** Planning  
> **Estimated Duration:** 10-12 hours

---

## Navigation

- **↑ Parent:** [00_SUBPHASES_SUMMARY.md](../00_SUBPHASES_SUMMARY.md)
- **← Previous SubPhase:** [SubPhase-02_PayHere-Integration](../SubPhase-02_PayHere-Integration/)
- **→ Next SubPhase:** [SubPhase-04_KOKO-MintPay-BNPL](../SubPhase-04_KOKO-MintPay-BNPL/)

---

## SubPhase Overview

This sub-phase integrates WebXPay as an alternative payment gateway, providing merchants with payment gateway options and redundancy.

### Key Outcomes
- WebXPay processor implementation
- Card payment processing
- QR payment support
- Bank transfer integration
- Webhook handling
- Sandbox testing

### WebXPay Payment Methods
- Visa / Mastercard
- QR code payments
- Bank transfers
- Mobile wallets

### WebXPay Flow
```
Checkout → Create Payment Request → Redirect to WebXPay →
Customer Pays → Callback → Verify Payment → Update Order
```

### Technology Context
- **Backend:** Django 5.x, DRF
- **WebXPay API:** REST-based
- **Security:** HMAC signature verification
- **Currency:** LKR (Sri Lankan Rupees)

---

## Task Execution Order

```
TASK GROUP A: WebXPay Configuration (Tasks 01-14)
        │
        ▼
TASK GROUP B: WebXPay Processor Implementation (Tasks 15-30)
        │
        ▼
TASK GROUP C: Payment Request & Checkout (Tasks 31-46)
        │
        ▼
TASK GROUP D: Webhook & Callback (Tasks 47-60)
        │
        ▼
TASK GROUP E: Verification & Refunds (Tasks 61-74)
        │
        ▼
TASK GROUP F: Frontend & Testing (Tasks 75-88)
```

---

## Task Index

### Group A: WebXPay Configuration (Tasks 01-14)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 01 | **Create WebXPay Constants** | API URLs and endpoints | SubPhase-01 | 🔴 Not Created |
| 02 | **Create Sandbox URL** | Sandbox API endpoint | Task 01 | 🔴 Not Created |
| 03 | **Create Production URL** | Production API endpoint | Task 01 | 🔴 Not Created |
| 04 | **Create WebXPay Settings** | Django settings module | Task 01 | 🔴 Not Created |
| 05 | **Create API Key Setting** | WEBXPAY_API_KEY | Task 04 | 🔴 Not Created |
| 06 | **Create Secret Key Setting** | WEBXPAY_SECRET_KEY | Task 04 | 🔴 Not Created |
| 07 | **Create Merchant ID Setting** | WEBXPAY_MERCHANT_ID | Task 04 | 🔴 Not Created |
| 08 | **Create Sandbox Toggle** | WEBXPAY_SANDBOX | Task 04 | 🔴 Not Created |
| 09 | **Create Callback URL Setting** | Webhook/callback URL | Task 04 | 🔴 Not Created |
| 10 | **Create WebXPay Config Model** | Tenant-specific config | Task 04 | 🔴 Not Created |
| 11 | **Create Config Validation** | Validate credentials | Task 10 | 🔴 Not Created |
| 12 | **Create Config Encryption** | Encrypt secret key | Task 10 | 🔴 Not Created |
| 13 | **Create API Client Init** | Initialize HTTP client | Task 12 | 🔴 Not Created |
| 14 | **Verify Configuration** | Test config loading | Task 13 | 🔴 Not Created |

---

### Group B: WebXPay Processor Implementation (Tasks 15-30)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 15 | **Create WebXPayProcessor Class** | Extend PaymentProcessor | Task 14 | 🔴 Not Created |
| 16 | **Create Processor Registration** | Register with factory | Task 15 | 🔴 Not Created |
| 17 | **Create HMAC Signature** | HMAC-SHA256 signature | Task 15 | 🔴 Not Created |
| 18 | **Create Signature Parameters** | Signature data format | Task 17 | 🔴 Not Created |
| 19 | **Create Amount Formatter** | Format amount for API | Task 15 | 🔴 Not Created |
| 20 | **Create Currency Handler** | LKR currency handling | Task 19 | 🔴 Not Created |
| 21 | **Create Reference Generator** | Unique payment reference | Task 15 | 🔴 Not Created |
| 22 | **Create Description Builder** | Payment description | Task 15 | 🔴 Not Created |
| 23 | **Create Customer Data** | Customer details format | Task 15 | 🔴 Not Created |
| 24 | **Create Phone Formatter** | Sri Lanka phone format | Task 23 | 🔴 Not Created |
| 25 | **Create Address Formatter** | Address format | Task 23 | 🔴 Not Created |
| 26 | **Create Metadata Builder** | Additional metadata | Task 15 | 🔴 Not Created |
| 27 | **Create Request Builder** | Build API request | Task 26 | 🔴 Not Created |
| 28 | **Create Response Parser** | Parse API response | Task 27 | 🔴 Not Created |
| 29 | **Create Error Handler** | Handle API errors | Task 28 | 🔴 Not Created |
| 30 | **Verify Processor** | Test processor methods | Task 29 | 🔴 Not Created |

---

### Group C: Payment Request & Checkout (Tasks 31-46)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 31 | **Create initiate_payment Method** | Payment initiation | Task 30 | 🔴 Not Created |
| 32 | **Create Payment Request API** | POST to WebXPay | Task 31 | 🔴 Not Created |
| 33 | **Create Request Payload** | Build request payload | Task 32 | 🔴 Not Created |
| 34 | **Create Checkout URL** | Get redirect URL | Task 32 | 🔴 Not Created |
| 35 | **Create QR Payment Option** | QR code payment | Task 31 | 🔴 Not Created |
| 36 | **Create QR Code Generator** | Generate QR code | Task 35 | 🔴 Not Created |
| 37 | **Create Bank Transfer Option** | Bank transfer payment | Task 31 | 🔴 Not Created |
| 38 | **Create Payment Token** | Store pending payment | Task 31 | 🔴 Not Created |
| 39 | **Create Expiry Handling** | Token expiry logic | Task 38 | 🔴 Not Created |
| 40 | **Create Duplicate Prevention** | Prevent double payments | Task 38 | 🔴 Not Created |
| 41 | **Create Payment Logging** | Log all attempts | Task 31 | 🔴 Not Created |
| 42 | **Create Timeout Handling** | Handle timeouts | Task 31 | 🔴 Not Created |
| 43 | **Create Retry Logic** | Retry failed requests | Task 42 | 🔴 Not Created |
| 44 | **Create Success Response** | Handle success | Task 31 | 🔴 Not Created |
| 45 | **Create Error Response** | Handle errors | Task 31 | 🔴 Not Created |
| 46 | **Verify Payment Request** | Test payment init | Task 45 | 🔴 Not Created |

---

### Group D: Webhook & Callback (Tasks 47-60)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 47 | **Create WebXPay Webhook View** | Webhook endpoint | Task 46 | 🔴 Not Created |
| 48 | **Create Webhook URL Config** | /api/webhooks/webxpay/ | Task 47 | 🔴 Not Created |
| 49 | **Create CSRF Exempt** | Exempt from CSRF | Task 47 | 🔴 Not Created |
| 50 | **Create Signature Verification** | Verify HMAC signature | Task 47 | 🔴 Not Created |
| 51 | **Create Signature Comparison** | Secure compare | Task 50 | 🔴 Not Created |
| 52 | **Create Payload Parser** | Parse webhook data | Task 47 | 🔴 Not Created |
| 53 | **Create Status Mapping** | Map status codes | Task 52 | 🔴 Not Created |
| 54 | **Create Success Handler** | Handle success status | Task 53 | 🔴 Not Created |
| 55 | **Create Failure Handler** | Handle failure status | Task 53 | 🔴 Not Created |
| 56 | **Create Pending Handler** | Handle pending status | Task 53 | 🔴 Not Created |
| 57 | **Create Order Update** | Update order status | Task 54 | 🔴 Not Created |
| 58 | **Create Transaction Record** | Save transaction | Task 57 | 🔴 Not Created |
| 59 | **Create Webhook Logging** | Log webhooks | Task 47 | 🔴 Not Created |
| 60 | **Verify Webhook** | Test webhook flow | Task 59 | 🔴 Not Created |

---

### Group E: Verification & Refunds (Tasks 61-74)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 61 | **Create verify_payment Method** | Verify payment status | Task 60 | 🔴 Not Created |
| 62 | **Create Status Query API** | Query payment status | Task 61 | 🔴 Not Created |
| 63 | **Create Query Signature** | Sign status query | Task 62 | 🔴 Not Created |
| 64 | **Create Status Response** | Parse status response | Task 62 | 🔴 Not Created |
| 65 | **Create Reconciliation** | Match with webhook | Task 64 | 🔴 Not Created |
| 66 | **Create process_refund Method** | Process refunds | Task 60 | 🔴 Not Created |
| 67 | **Create Refund API Call** | Call refund endpoint | Task 66 | 🔴 Not Created |
| 68 | **Create Refund Signature** | Sign refund request | Task 67 | 🔴 Not Created |
| 69 | **Create Partial Refund** | Partial refund support | Task 66 | 🔴 Not Created |
| 70 | **Create Refund Validation** | Validate refund amount | Task 69 | 🔴 Not Created |
| 71 | **Create Refund Response** | Parse refund response | Task 67 | 🔴 Not Created |
| 72 | **Create Refund Record** | Save refund record | Task 71 | 🔴 Not Created |
| 73 | **Create Refund Webhook** | Handle refund callback | Task 72 | 🔴 Not Created |
| 74 | **Verify Refunds** | Test refund flow | Task 73 | 🔴 Not Created |

---

### Group F: Frontend & Testing (Tasks 75-88)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 75 | **Create WebXPay Types** | TypeScript interfaces | Task 74 | 🔴 Not Created |
| 76 | **Create WebXPay API Client** | Frontend API client | Task 75 | 🔴 Not Created |
| 77 | **Create Payment Hook** | useWebXPayPayment hook | Task 76 | 🔴 Not Created |
| 78 | **Create Redirect Handler** | Handle redirect | Task 77 | 🔴 Not Created |
| 79 | **Create QR Display** | QR code display UI | Task 77 | 🔴 Not Created |
| 80 | **Create WebXPay Button** | Payment method button | Task 76 | 🔴 Not Created |
| 81 | **Create Loading State** | Processing state UI | Task 80 | 🔴 Not Created |
| 82 | **Create Success Page** | Payment success | Task 78 | 🔴 Not Created |
| 83 | **Create Cancel Page** | Payment cancel | Task 78 | 🔴 Not Created |
| 84 | **Create Sandbox Tests** | Sandbox testing | Task 74 | 🔴 Not Created |
| 85 | **Create Test Credentials** | Use test credentials | Task 84 | 🔴 Not Created |
| 86 | **Create E2E Test** | Full flow test | Task 85 | 🔴 Not Created |
| 87 | **Create Gateway Switch UI** | PayHere/WebXPay switch | Task 80 | 🔴 Not Created |
| 88 | **Create Documentation** | Integration docs | Task 87 | 🔴 Not Created |

---

## Expected Final Structure

```
backend/
└── apps/
    └── payments/
        ├── processors/
        │   ├── webxpay/
        │   │   ├── __init__.py
        │   │   ├── processor.py              # WebXPayProcessor (Task 15)
        │   │   ├── config.py                 # Configuration (Task 04)
        │   │   ├── constants.py              # URLs, codes (Task 01)
        │   │   ├── signature.py              # HMAC signature (Task 17)
        │   │   ├── builders.py               # Data builders (Task 23)
        │   │   └── validators.py             # Validators (Task 50)
        │   └── ...
        └── webhooks/
            └── webxpay.py                    # Webhook handler (Task 47)

frontend/
└── lib/
    └── payments/
        └── webxpay/
            ├── types.ts                      # Types (Task 75)
            ├── client.ts                     # API client (Task 76)
            └── hooks.ts                      # Hooks (Task 77)
└── components/
    └── checkout/
        ├── WebXPayButton.tsx                 # Button (Task 80)
        └── QRPaymentDisplay.tsx              # QR display (Task 79)
```

---

## Progress Tracking

| Group | Name | Tasks | Completed | Progress |
|-------|------|-------|-----------|----------|
| A | WebXPay Configuration | 14 | 0 | 0% |
| B | WebXPay Processor Implementation | 16 | 0 | 0% |
| C | Payment Request & Checkout | 16 | 0 | 0% |
| D | Webhook & Callback | 14 | 0 | 0% |
| E | Verification & Refunds | 14 | 0 | 0% |
| F | Frontend & Testing | 14 | 0 | 0% |
| **Total** | | **88** | **0** | **0%** |

---

## Notes for AI Agents

1. **Execute tasks in order** - Follow Group A → F sequence
2. **HMAC signature** - Use HMAC-SHA256 for signatures
3. **Sandbox first** - Test with sandbox credentials
4. **QR payments** - Implement QR code display
5. **Gateway fallback** - Provide PayHere as backup
6. **Signature verification** - Validate all webhooks
7. **LKR currency** - All amounts in Sri Lankan Rupees
8. **Error handling** - Handle all API error cases
9. **Logging** - Log all payment attempts and webhooks
