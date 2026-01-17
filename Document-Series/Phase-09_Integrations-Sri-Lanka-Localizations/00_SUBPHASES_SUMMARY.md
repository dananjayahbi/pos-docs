# Phase 09: Integrations & Sri Lanka Localizations - Sub-Phases Summary

> **Phase Index:** 09 of 10  
> **Phase Goal:** Integrate Sri Lanka-specific payment gateways, shipping providers, and communication tools  
> **Total Sub-Phases:** 12 | **Status:** Planning

---

## Navigation

- **↑ Parent:** [00_PHASES_SUMMARY.md](../00_PHASES_SUMMARY.md)
- **← Previous Phase:** [Phase-08](../Phase-08_Webstore-Ecommerce-Platform/)
- **→ Next Phase:** [Phase-10](../Phase-10_AI-Features-Advanced-Capabilities/)

---

## Phase Overview

This phase implements all Sri Lanka-specific integrations that differentiate LankaCommerce Cloud from international competitors. These integrations form the "Sri Lanka Moat" - features that international platforms cannot easily replicate.

### Key Outcomes
- All major Sri Lanka payment gateways integrated
- Local courier APIs for automated shipping
- WhatsApp/Viber communication channels
- District-based shipping zones
- LKR currency and tax compliance
- SVAT/VAT invoice generation

---

## Sub-Phase Index

| # | Sub-Phase Name | Description | Tasks | Status |
|---|----------------|-------------|-------|--------|
| 01 | **Payment Gateway Architecture** | Unified payment processing layer for multiple gateways | TBD | 🔴 Not Created |
| 02 | **PayHere Integration** | Sri Lanka's leading payment gateway | TBD | 🔴 Not Created |
| 03 | **WebXPay Integration** | Alternative payment gateway | TBD | 🔴 Not Created |
| 04 | **KOKO/MintPay BNPL** | Buy Now Pay Later integrations | TBD | 🔴 Not Created |
| 05 | **Bank Transfer with Upload** | Manual bank transfer with proof upload | TBD | 🔴 Not Created |
| 06 | **Cash on Delivery (COD)** | COD workflow and verification | TBD | 🔴 Not Created |
| 07 | **Shipping Zone Configuration** | District-based shipping zones and rates | TBD | 🔴 Not Created |
| 08 | **Koombiyo Courier API** | Leading courier service integration | TBD | 🔴 Not Created |
| 09 | **Domex & Other Couriers** | Additional courier integrations | TBD | 🔴 Not Created |
| 10 | **Waybill Generation** | Automated shipping label creation | TBD | 🔴 Not Created |
| 11 | **WhatsApp Business API** | WhatsApp notifications and chat | TBD | 🔴 Not Created |
| 12 | **SMS Gateway Integration** | SMS notifications for non-WhatsApp users | TBD | 🔴 Not Created |

---

## Sub-Phase Details

### SubPhase-01: Payment Gateway Architecture
**Goal:** Create a unified payment processing layer.

**Architecture:**
```python
# Payment Processor Interface
class PaymentProcessor(ABC):
    @abstractmethod
    def initiate_payment(self, order, amount) -> PaymentIntent
    
    @abstractmethod
    def verify_payment(self, reference) -> PaymentResult
    
    @abstractmethod
    def process_refund(self, payment, amount) -> RefundResult

# Implementations
class PayHereProcessor(PaymentProcessor): ...
class WebXPayProcessor(PaymentProcessor): ...
class KOKOProcessor(PaymentProcessor): ...
```

**Payment Flow:**
```
Checkout → Select Gateway → Redirect/Popup → 
Process → Webhook Callback → Order Update
```

**Models:**
```python
PaymentMethod:
  - name
  - gateway_type
  - is_active
  - configuration (JSONB)
  - display_order

PaymentTransaction:
  - order (FK)
  - gateway
  - amount
  - currency
  - status (pending/success/failed/refunded)
  - gateway_reference
  - gateway_response (JSONB)
  - created_at
```

**Dependencies:** Phase-05 (Orders), Phase-08 (Checkout)

---

### SubPhase-02: PayHere Integration
**Goal:** Integrate PayHere payment gateway.

**PayHere Features:**
- Card payments (Visa, Master, Amex)
- Online banking
- Mobile wallets
- Recurring payments (future)

**Integration Points:**
- Payment initialization API
- Checkout page redirect
- Payment notification webhook
- Payment verification API
- Refund API

**Configuration:**
```python
PAYHERE_CONFIG = {
    'merchant_id': env('PAYHERE_MERCHANT_ID'),
    'merchant_secret': env('PAYHERE_SECRET'),
    'sandbox': env('PAYHERE_SANDBOX', True),
    'notify_url': '/api/webhooks/payhere/',
    'return_url': '/checkout/success/',
    'cancel_url': '/checkout/cancel/'
}
```

**Dependencies:** SubPhase-01

---

### SubPhase-03: WebXPay Integration
**Goal:** Integrate WebXPay as alternative gateway.

**WebXPay Features:**
- Card payments
- Bank transfers
- QR payments

**Integration Steps:**
- API credential setup
- Payment request API
- Callback handling
- Status verification

**Dependencies:** SubPhase-01

---

### SubPhase-04: KOKO/MintPay BNPL
**Goal:** Buy Now Pay Later integration.

**KOKO Payment Split:**
```
Total: ₨10,000
├── Today: ₨2,500 (25%)
├── Month 2: ₨2,500
├── Month 3: ₨2,500
└── Month 4: ₨2,500
```

**BNPL Flow:**
1. Customer selects KOKO/MintPay at checkout
2. Redirect to KOKO for approval
3. Customer enters NIC, phone for verification
4. KOKO approves based on credit score
5. First installment charged
6. Order confirmed
7. Remaining installments auto-charged monthly

**Integration Points:**
- Eligibility check API
- Payment initialization
- Approval callback
- Installment tracking (via KOKO dashboard)

**Dependencies:** SubPhase-01

---

### SubPhase-05: Bank Transfer with Upload
**Goal:** Manual bank transfer workflow.

**Bank Transfer Flow:**
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

**Features:**
- Multiple bank accounts
- Reference number generation
- Upload interface
- Admin verification UI
- Expiry reminder (24-48 hours)

**Dependencies:** SubPhase-01

---

### SubPhase-06: Cash on Delivery (COD)
**Goal:** COD payment workflow.

**COD Flow:**
```
Checkout (COD) → Order Placed → Dispatch → 
Delivery Attempt → Collected/Failed → Reconciliation
```

**Features:**
- COD availability by zone
- Minimum/maximum order limits
- COD fee configuration
- Delivery agent collection
- COD reconciliation report

**Risk Management:**
- Phone verification (OTP)
- Address verification
- Previous order history check
- COD limit based on history

**Dependencies:** SubPhase-01, SubPhase-07

---

### SubPhase-07: Shipping Zone Configuration
**Goal:** District-based shipping zones.

**Sri Lanka Location Hierarchy:**
```
Province (9)
└── District (25)
    └── City/Town (many)
```

**Zone Configuration:**
```python
ShippingZone:
  - name (e.g., "Colombo Metro", "Western Province")
  - districts (M2M)
  - delivery_days
  - is_cod_available

ShippingRate:
  - zone (FK)
  - weight_from
  - weight_to
  - rate
  - free_shipping_threshold
```

**Features:**
- Province/District/City dropdowns
- Zone-based rate calculation
- Free shipping thresholds
- Estimated delivery dates
- COD availability by zone

**Dependencies:** Phase-05 (Shipping model)

---

### SubPhase-08: Koombiyo Courier API
**Goal:** Integrate Koombiyo courier service.

**Koombiyo API Features:**
- Waybill generation
- Pickup scheduling
- Tracking status
- COD collection
- POD (Proof of Delivery)

**Integration Points:**
```python
# Koombiyo API Endpoints
POST /api/v1/waybill/create     # Create shipment
GET  /api/v1/waybill/track      # Track shipment
POST /api/v1/pickup/schedule    # Schedule pickup
GET  /api/v1/cod/report         # COD collection report
```

**Webhook Events:**
- Picked up
- In transit
- Out for delivery
- Delivered
- Failed attempt
- Returned

**Dependencies:** SubPhase-07

---

### SubPhase-09: Domex & Other Couriers
**Goal:** Integrate additional courier services.

**Couriers:**
- Domex
- Prompt X
- Royal Express
- Trance Express

**Unified Shipping Interface:**
```python
class ShippingProvider(ABC):
    @abstractmethod
    def create_shipment(self, order) -> Shipment
    
    @abstractmethod
    def get_rates(self, origin, destination, weight) -> List[Rate]
    
    @abstractmethod
    def track_shipment(self, tracking_number) -> TrackingInfo
    
    @abstractmethod
    def cancel_shipment(self, shipment) -> bool
```

**Dependencies:** SubPhase-08 (same architecture)

---

### SubPhase-10: Waybill Generation
**Goal:** Automated shipping label creation.

**Waybill Contents:**
```
┌─────────────────────────────────────────────────────────────┐
│ [COURIER LOGO]                      [BARCODE: WB123456]     │
├─────────────────────────────────────────────────────────────┤
│ FROM:                              TO:                      │
│ Seller Name                        Customer Name            │
│ 123 Main Street                    456 Oak Avenue           │
│ Colombo 03                         Kandy                    │
│ +94 77 123 4567                    +94 71 987 6543          │
├─────────────────────────────────────────────────────────────┤
│ Order: #ORD-12345                  Weight: 1.5 kg           │
│ Items: 3                           COD: ₨5,500              │
├─────────────────────────────────────────────────────────────┤
│ [QR CODE]                          [LARGE BARCODE]          │
│ Tracking: KB1234567890                                      │
└─────────────────────────────────────────────────────────────┘
```

**Features:**
- Auto-generate from order
- Batch printing
- PDF/thermal printer format
- Label size options (A4, A6, 4x6)

**Dependencies:** SubPhase-08, SubPhase-09

---

### SubPhase-11: WhatsApp Business API
**Goal:** WhatsApp notifications and chat.

**WhatsApp Use Cases:**
- Order confirmation
- Shipping updates
- Delivery notification
- Payment reminders
- Customer support chat

**Message Templates:**
```
ORDER_CONFIRMATION:
"Hi {{name}}! Your order #{{order_id}} has been confirmed. 
Total: ₨{{amount}}. Track: {{tracking_link}}"

SHIPPING_UPDATE:
"Your order #{{order_id}} is on the way! 
Tracking: {{tracking_number}}. Expected: {{date}}"
```

**Integration Options:**
- WhatsApp Business API (official)
- Third-party providers (Dialog, Twilio)

**Dependencies:** Phase-05 (Order events)

---

### SubPhase-12: SMS Gateway Integration
**Goal:** SMS notifications for non-WhatsApp users.

**SMS Providers (Sri Lanka):**
- Dialog SMS Gateway
- Mobitel Enterprise SMS
- Notify.lk
- TextIt

**SMS Use Cases:**
- OTP verification
- Order updates (fallback from WhatsApp)
- Password reset
- Promotional messages (with opt-in)

**Integration:**
```python
class SMSProvider(ABC):
    @abstractmethod
    def send_sms(self, phone, message) -> SMSResult

class DialogSMS(SMSProvider): ...
class NotifyLK(SMSProvider): ...
```

**Dependencies:** Phase-03 (Celery for async)

---

## Progress Tracking

| Metric | Count |
|--------|-------|
| Total Sub-Phases | 12 |
| Sub-Phases Created | 0 |
| Task Documents Created | 0 |

**Last Updated:** 2026-01-17  
**Current Status:** Awaiting approval to create Sub-Phase folders

---

## Execution Order

```
PAYMENTS:
SubPhase-01 (Architecture)
       │
       ├──→ SubPhase-02 (PayHere)
       ├──→ SubPhase-03 (WebXPay)
       ├──→ SubPhase-04 (BNPL)
       ├──→ SubPhase-05 (Bank Transfer)
       └──→ SubPhase-06 (COD)

SHIPPING:
SubPhase-07 (Zones) ──→ SubPhase-08 (Koombiyo)
                              │
                              ├──→ SubPhase-09 (Other Couriers)
                              │
                              └──→ SubPhase-10 (Waybills)

COMMUNICATION:
SubPhase-11 (WhatsApp)
SubPhase-12 (SMS)
```

---

## Critical Notes

### Payment Security
- Never store full card details
- Use gateway tokenization
- PCI DSS compliance awareness
- Webhook signature verification

### Sri Lanka Specific
- All amounts in LKR (no decimals in display)
- Phone format: +94 XX XXX XXXX
- NIC format validation
- District/City naming consistency

---

## Next Steps

1. ✅ Sub-Phases Summary Document Created (This file)
2. ⏳ Awaiting user review via flow.py
3. ⏳ Create 12 Sub-Phase folders
4. ⏳ Create Task summary for each Sub-Phase
5. ⏳ Create individual Task documents

---

*AI Agents: Payment integrations require careful testing. Use sandbox/test modes extensively.*
