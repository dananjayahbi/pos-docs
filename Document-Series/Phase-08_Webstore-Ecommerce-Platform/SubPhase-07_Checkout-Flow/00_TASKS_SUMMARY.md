# SubPhase 07: Checkout Flow - Tasks Summary

> **Phase:** 08 - Webstore & E-Commerce Platform  
> **SubPhase Index:** 07 of 14  
> **SubPhase Goal:** Build Sri Lanka optimized 5-step checkout with local payment options and address format  
> **Total Tasks:** 98 | **Status:** Planning  
> **Estimated Duration:** 14-16 hours

---

## Navigation

- **↑ Parent:** [00_SUBPHASES_SUMMARY.md](../00_SUBPHASES_SUMMARY.md)
- **← Previous SubPhase:** [SubPhase-06_Shopping-Cart](../SubPhase-06_Shopping-Cart/)
- **→ Next SubPhase:** [SubPhase-08_Customer-Authentication](../SubPhase-08_Customer-Authentication/)

---

## SubPhase Overview

This sub-phase creates the complete checkout flow optimized for Sri Lankan customers with 5 steps: Information, Shipping, Payment, Review, and Confirmation.

### Key Outcomes
- 5-step checkout wizard
- Contact information (email/phone)
- Sri Lanka address format (Province → District → City)
- Multiple shipping methods
- Local payment options (PayHere, COD, Bank Transfer, KOKO)
- Order review and summary
- Order confirmation with WhatsApp notification
- Guest checkout support

### Checkout Steps
```
1. INFORMATION        2. SHIPPING          3. PAYMENT
   ──────────────       ──────────────       ──────────────
   • Email/Phone        • Province           • PayHere
   • Name               • District           • Card
   • Contact            • City               • Bank Transfer
                        • Address            • COD
                        • Shipping Method    • KOKO (BNPL)

4. REVIEW            5. CONFIRM
   ──────────────       ──────────────
   • Order Summary      • Order Placed
   • Final Total        • Confirmation
   • Place Order        • Email/WhatsApp
```

### Sri Lanka Specific
- Province → District → City (no zip codes)
- WhatsApp as primary contact (+94 format)
- Cash on Delivery option
- Bank transfer with receipt upload
- BNPL options (KOKO, MintPay)

### Technology Context
- **State:** Zustand checkout store
- **Forms:** React Hook Form + Zod
- **Steps:** URL-based step navigation
- **Payments:** Integration in Phase-09

---

## Task Execution Order

```
TASK GROUP A: Checkout Routes & Structure (Tasks 01-18)
        │
        ▼
TASK GROUP B: Step 1 - Information (Tasks 19-34)
        │
        ▼
TASK GROUP C: Step 2 - Shipping (Tasks 35-52)
        │
        ▼
TASK GROUP D: Step 3 - Payment (Tasks 53-68)
        │
        ▼
TASK GROUP E: Step 4 & 5 - Review & Confirm (Tasks 69-84)
        │
        ▼
TASK GROUP F: Order Sidebar & Testing (Tasks 85-98)
```

---

## Task Index

### Group A: Checkout Routes & Structure (Tasks 01-18)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 01 | **Create Checkout Directory** | Set up checkout/ route | SubPhase-06 | 🔴 Not Created |
| 02 | **Create Checkout Layout** | Shared checkout layout | Task 01 | 🔴 Not Created |
| 03 | **Create Checkout Page Route** | checkout/page.tsx (redirect to step 1) | Task 01 | 🔴 Not Created |
| 04 | **Create Step 1 Route** | checkout/information/page.tsx | Task 01 | 🔴 Not Created |
| 05 | **Create Step 2 Route** | checkout/shipping/page.tsx | Task 01 | 🔴 Not Created |
| 06 | **Create Step 3 Route** | checkout/payment/page.tsx | Task 01 | 🔴 Not Created |
| 07 | **Create Step 4 Route** | checkout/review/page.tsx | Task 01 | 🔴 Not Created |
| 08 | **Create Step 5 Route** | checkout/confirmation/page.tsx | Task 01 | 🔴 Not Created |
| 09 | **Create Checkout Store** | Zustand checkout state | Task 01 | 🔴 Not Created |
| 10 | **Create Checkout Types** | TypeScript interfaces | Task 09 | 🔴 Not Created |
| 11 | **Create Step Progress Indicator** | Visual step tracker | Task 02 | 🔴 Not Created |
| 12 | **Create Step Navigation Logic** | Validate before proceed | Task 11 | 🔴 Not Created |
| 13 | **Create Back Button** | Return to previous step | Task 12 | 🔴 Not Created |
| 14 | **Create Continue Button** | Proceed to next step | Task 12 | 🔴 Not Created |
| 15 | **Create Checkout Guard** | Redirect if cart empty | Task 03 | 🔴 Not Created |
| 16 | **Create Guest Checkout Check** | Handle guest vs logged in | Task 15 | 🔴 Not Created |
| 17 | **Create Checkout Header** | Simplified header | Task 02 | 🔴 Not Created |
| 18 | **Verify Checkout Structure** | Test all routes | Task 17 | 🔴 Not Created |

---

### Group B: Step 1 - Information (Tasks 19-34)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 19 | **Create Information Page** | Step 1 page component | Task 18 | 🔴 Not Created |
| 20 | **Create Contact Section** | Contact info section | Task 19 | 🔴 Not Created |
| 21 | **Create Email Input** | Email field | Task 20 | 🔴 Not Created |
| 22 | **Create Phone Input** | Phone with +94 format | Task 20 | 🔴 Not Created |
| 23 | **Create WhatsApp Checkbox** | "Use for WhatsApp updates" | Task 22 | 🔴 Not Created |
| 24 | **Create Login Prompt** | "Already have account?" link | Task 20 | 🔴 Not Created |
| 25 | **Create Personal Info Section** | Name and details | Task 19 | 🔴 Not Created |
| 26 | **Create First Name Input** | First name field | Task 25 | 🔴 Not Created |
| 27 | **Create Last Name Input** | Last name field | Task 25 | 🔴 Not Created |
| 28 | **Create Form Validation** | Zod schema for step 1 | Task 21 | 🔴 Not Created |
| 29 | **Create Email Validation** | Email format check | Task 28 | 🔴 Not Created |
| 30 | **Create Phone Validation** | Sri Lanka phone format | Task 28 | 🔴 Not Created |
| 31 | **Create Error Display** | Field error messages | Task 28 | 🔴 Not Created |
| 32 | **Create Save to Store** | Save info to checkout store | Task 09 | 🔴 Not Created |
| 33 | **Create Pre-fill for Logged In** | Auto-fill from account | Task 16 | 🔴 Not Created |
| 34 | **Verify Step 1 Flow** | Test information step | Task 33 | 🔴 Not Created |

---

### Group C: Step 2 - Shipping (Tasks 35-52)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 35 | **Create Shipping Page** | Step 2 page component | Task 34 | 🔴 Not Created |
| 36 | **Create Address Section** | Shipping address form | Task 35 | 🔴 Not Created |
| 37 | **Create Province Dropdown** | Province selector | Task 36 | 🔴 Not Created |
| 38 | **Create District Dropdown** | District (filtered by province) | Task 37 | 🔴 Not Created |
| 39 | **Create City Dropdown** | City (filtered by district) | Task 38 | 🔴 Not Created |
| 40 | **Create Address Line 1** | Street address | Task 36 | 🔴 Not Created |
| 41 | **Create Address Line 2** | Apartment/unit (optional) | Task 36 | 🔴 Not Created |
| 42 | **Create Landmark Input** | Nearby landmark | Task 36 | 🔴 Not Created |
| 43 | **Create Saved Addresses** | List saved addresses | Task 36 | 🔴 Not Created |
| 44 | **Create Select Saved Address** | Click to use saved | Task 43 | 🔴 Not Created |
| 45 | **Create Add New Address** | Add new address option | Task 43 | 🔴 Not Created |
| 46 | **Create Shipping Methods Section** | Available methods | Task 35 | 🔴 Not Created |
| 47 | **Create Shipping Method Card** | Single method display | Task 46 | 🔴 Not Created |
| 48 | **Create Standard Shipping** | Regular delivery option | Task 47 | 🔴 Not Created |
| 49 | **Create Express Shipping** | Fast delivery option | Task 47 | 🔴 Not Created |
| 50 | **Create Shipping Cost Display** | Cost per method in LKR | Task 47 | 🔴 Not Created |
| 51 | **Create Delivery Estimate** | Estimated days | Task 47 | 🔴 Not Created |
| 52 | **Verify Step 2 Flow** | Test shipping step | Task 51 | 🔴 Not Created |

---

### Group D: Step 3 - Payment (Tasks 53-68)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 53 | **Create Payment Page** | Step 3 page component | Task 52 | 🔴 Not Created |
| 54 | **Create Payment Methods Section** | Available methods | Task 53 | 🔴 Not Created |
| 55 | **Create Payment Method Card** | Single method display | Task 54 | 🔴 Not Created |
| 56 | **Create PayHere Option** | PayHere gateway | Task 55 | 🔴 Not Created |
| 57 | **Create Card Payment Option** | Credit/debit cards | Task 55 | 🔴 Not Created |
| 58 | **Create Bank Transfer Option** | Bank transfer | Task 55 | 🔴 Not Created |
| 59 | **Create Bank Details Display** | Bank account info | Task 58 | 🔴 Not Created |
| 60 | **Create Receipt Upload** | Upload transfer receipt | Task 58 | 🔴 Not Created |
| 61 | **Create COD Option** | Cash on delivery | Task 55 | 🔴 Not Created |
| 62 | **Create COD Conditions** | COD availability check | Task 61 | 🔴 Not Created |
| 63 | **Create KOKO BNPL Option** | Buy now pay later | Task 55 | 🔴 Not Created |
| 64 | **Create MintPay Option** | MintPay BNPL | Task 55 | 🔴 Not Created |
| 65 | **Create Payment Selection State** | Track selected method | Task 54 | 🔴 Not Created |
| 66 | **Create Payment Icons** | Method logos | Task 55 | 🔴 Not Created |
| 67 | **Create Payment Validation** | Validate selection | Task 65 | 🔴 Not Created |
| 68 | **Verify Step 3 Flow** | Test payment step | Task 67 | 🔴 Not Created |

---

### Group E: Step 4 & 5 - Review & Confirm (Tasks 69-84)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 69 | **Create Review Page** | Step 4 page component | Task 68 | 🔴 Not Created |
| 70 | **Create Contact Summary** | Review contact info | Task 69 | 🔴 Not Created |
| 71 | **Create Edit Contact Link** | Edit button to step 1 | Task 70 | 🔴 Not Created |
| 72 | **Create Shipping Summary** | Review address/method | Task 69 | 🔴 Not Created |
| 73 | **Create Edit Shipping Link** | Edit button to step 2 | Task 72 | 🔴 Not Created |
| 74 | **Create Payment Summary** | Review payment method | Task 69 | 🔴 Not Created |
| 75 | **Create Edit Payment Link** | Edit button to step 3 | Task 74 | 🔴 Not Created |
| 76 | **Create Order Items Review** | Review cart items | Task 69 | 🔴 Not Created |
| 77 | **Create Place Order Button** | Final submit button | Task 69 | 🔴 Not Created |
| 78 | **Create Order Processing State** | Loading during submit | Task 77 | 🔴 Not Created |
| 79 | **Create Confirmation Page** | Step 5 success page | Task 78 | 🔴 Not Created |
| 80 | **Create Order Number Display** | Show order ID | Task 79 | 🔴 Not Created |
| 81 | **Create Success Animation** | Checkmark animation | Task 79 | 🔴 Not Created |
| 82 | **Create WhatsApp Confirm** | WhatsApp notification info | Task 79 | 🔴 Not Created |
| 83 | **Create Continue Shopping CTA** | Back to store button | Task 79 | 🔴 Not Created |
| 84 | **Verify Step 4 & 5 Flow** | Test review and confirm | Task 83 | 🔴 Not Created |

---

### Group F: Order Sidebar & Testing (Tasks 85-98)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 85 | **Create Order Sidebar** | Right sidebar summary | Task 84 | 🔴 Not Created |
| 86 | **Create Sidebar Items List** | Cart items display | Task 85 | 🔴 Not Created |
| 87 | **Create Sidebar Item Row** | Single item row | Task 86 | 🔴 Not Created |
| 88 | **Create Sidebar Subtotal** | Items subtotal | Task 85 | 🔴 Not Created |
| 89 | **Create Sidebar Shipping** | Shipping cost | Task 85 | 🔴 Not Created |
| 90 | **Create Sidebar Discount** | Applied discount | Task 85 | 🔴 Not Created |
| 91 | **Create Sidebar Total** | Grand total in LKR | Task 85 | 🔴 Not Created |
| 92 | **Create Collapsible Sidebar** | Mobile collapse | Task 85 | 🔴 Not Created |
| 93 | **Create Order API Service** | Submit order API | Task 77 | 🔴 Not Created |
| 94 | **Test Guest Checkout** | Full guest flow | Task 84 | 🔴 Not Created |
| 95 | **Test Logged In Checkout** | Logged in flow | Task 84 | 🔴 Not Created |
| 96 | **Test Address Cascade** | Province→District→City | Task 52 | 🔴 Not Created |
| 97 | **Test Payment Selection** | All payment methods | Task 68 | 🔴 Not Created |
| 98 | **Test Mobile Checkout** | Mobile responsiveness | Task 92 | 🔴 Not Created |

---

## Expected Final Structure

```
frontend/
└── app/
    └── (storefront)/
        └── checkout/
            ├── layout.tsx                      # Checkout layout (Task 02)
            ├── page.tsx                        # Redirect (Task 03)
            ├── information/
            │   └── page.tsx                    # Step 1 (Task 04)
            ├── shipping/
            │   └── page.tsx                    # Step 2 (Task 05)
            ├── payment/
            │   └── page.tsx                    # Step 3 (Task 06)
            ├── review/
            │   └── page.tsx                    # Step 4 (Task 07)
            └── confirmation/
                └── page.tsx                    # Step 5 (Task 08)
└── components/
    └── storefront/
        └── checkout/
            ├── CheckoutLayout/
            │   ├── CheckoutHeader.tsx          # Header (Task 17)
            │   ├── StepProgress.tsx            # Progress (Task 11)
            │   └── CheckoutGuard.tsx           # Guard (Task 15)
            ├── Information/
            │   ├── InformationStep.tsx         # Step 1 (Task 19)
            │   ├── ContactSection.tsx          # Contact (Task 20)
            │   └── PersonalInfoSection.tsx     # Personal (Task 25)
            ├── Shipping/
            │   ├── ShippingStep.tsx            # Step 2 (Task 35)
            │   ├── AddressForm.tsx             # Address (Task 36)
            │   ├── ProvinceDropdown.tsx        # Province (Task 37)
            │   ├── SavedAddresses.tsx          # Saved (Task 43)
            │   └── ShippingMethods.tsx         # Methods (Task 46)
            ├── Payment/
            │   ├── PaymentStep.tsx             # Step 3 (Task 53)
            │   ├── PaymentMethods.tsx          # Methods (Task 54)
            │   ├── PayHereOption.tsx           # PayHere (Task 56)
            │   ├── BankTransferOption.tsx      # Bank (Task 58)
            │   └── CODOption.tsx               # COD (Task 61)
            ├── Review/
            │   ├── ReviewStep.tsx              # Step 4 (Task 69)
            │   ├── ContactSummary.tsx          # Contact (Task 70)
            │   ├── ShippingSummary.tsx         # Shipping (Task 72)
            │   └── PaymentSummary.tsx          # Payment (Task 74)
            ├── Confirmation/
            │   ├── ConfirmationStep.tsx        # Step 5 (Task 79)
            │   ├── OrderNumber.tsx             # Order ID (Task 80)
            │   └── SuccessAnimation.tsx        # Animation (Task 81)
            └── OrderSidebar/
                ├── OrderSidebar.tsx            # Sidebar (Task 85)
                ├── SidebarItems.tsx            # Items (Task 86)
                └── SidebarSummary.tsx          # Totals (Task 88)
└── stores/
    └── storefront/
        └── checkoutStore.ts                    # Zustand store (Task 09)
└── services/
    └── storefront/
        └── checkout/
            └── orderService.ts                 # Order API (Task 93)
└── types/
    └── storefront/
        └── checkout.types.ts                   # Types (Task 10)
└── data/
    └── srilanka/
        ├── provinces.ts                        # Province list
        ├── districts.ts                        # District mapping
        └── cities.ts                           # City mapping
```

---

## Progress Tracking

| Group | Name | Tasks | Completed | Progress |
|-------|------|-------|-----------|----------|
| A | Checkout Routes & Structure | 18 | 0 | 0% |
| B | Step 1 - Information | 16 | 0 | 0% |
| C | Step 2 - Shipping | 18 | 0 | 0% |
| D | Step 3 - Payment | 16 | 0 | 0% |
| E | Step 4 & 5 - Review & Confirm | 16 | 0 | 0% |
| F | Order Sidebar & Testing | 14 | 0 | 0% |
| **Total** | | **98** | **0** | **0%** |

---

## Notes for AI Agents

1. **Execute tasks in order** - Follow Group A → F sequence
2. **Sri Lanka address** - Province → District → City cascade
3. **No zip codes** - Sri Lanka does not use postal codes commonly
4. **Phone format** - +94 format with WhatsApp support
5. **Payment stubs** - Full payment integration in Phase-09
6. **Guest checkout** - Support checkout without account
7. **LKR currency** - Format all amounts with ₨ symbol
8. **WhatsApp updates** - Order confirmation via WhatsApp
9. **COD conditions** - May have order amount limits
