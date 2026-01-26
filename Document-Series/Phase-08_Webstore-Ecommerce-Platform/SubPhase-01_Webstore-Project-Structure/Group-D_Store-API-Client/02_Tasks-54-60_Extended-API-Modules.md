# Phase-08 SubPhase-01 Group-D Document 02: Extended API Modules & Verification

**Phase:** 08 - Webstore & E-Commerce Platform  
**SubPhase:** 01 - Webstore Project Structure  
**Group:** D - Store API Client  
**Document:** 02 of 02  
**Tasks:** 54-60  
**Total Estimated Time:** 11 hours

---

## Navigation

- **Parent:** [Group-D Overview](00_GROUP_OVERVIEW.md)
- **Previous:** [Group-D Doc 01 - Tasks 47-53: Client Core Modules](01_Tasks-47-53_Client-Core-Modules.md)
- **Next:** [Group-E Doc 01 - Tasks 61-70: State Stores](../Group-E_Store-State-Management/01_Tasks-61-70_State-Stores.md)

---

## Document Overview

This document covers the implementation of extended API modules for the webstore API client, including checkout, customer management, order tracking, reviews & ratings, wishlist functionality, and search capabilities. These modules build upon the core API client infrastructure established in Document 01 (Tasks 47-53) to provide comprehensive e-commerce functionality.

The final task in this document focuses on integration verification, ensuring all API modules work together seamlessly with proper type safety, error handling, and Sri Lankan localization support.

**Key Focus Areas:**
- Complete checkout flow with multi-step validation
- Customer profile and address management
- Order history and tracking system
- Product reviews and rating aggregation
- Wishlist functionality with sync capabilities
- Advanced search with faceted filtering
- End-to-end integration testing

---

## Table of Contents

1. [Task 54: Checkout API Module](#task-54-checkout-api-module)
2. [Task 55: Customer/User API Module](#task-55-customeruser-api-module)
3. [Task 56: Orders API Module](#task-56-orders-api-module)
4. [Task 57: Reviews & Ratings API Module](#task-57-reviews--ratings-api-module)
5. [Task 58: Wishlist API Module](#task-58-wishlist-api-module)
6. [Task 59: Search & Filters API Module](#task-59-search--filters-api-module)
7. [Task 60: Verify API Client Integration](#task-60-verify-api-client-integration)
8. [Summary and Next Steps](#summary-and-next-steps)

---

## Task 54: Checkout API Module

**Estimated Time:** 2 hours  
**Priority:** Medium  
**Complexity:** Medium

### Overview

The Checkout API Module manages the complete checkout process from cart to order submission. It handles shipping address validation, payment method selection, shipping option calculation for Sri Lankan delivery zones, order summary generation, and final order submission with idempotency. The module supports multiple payment gateways including PayHere (local), Stripe, bank transfers, and cash on delivery (COD), with multi-step checkout progress tracking.

### Dependencies

- Task 47: API Client Foundation
- Task 48: API Configuration & Environment
- Task 49: Authentication Module
- Task 50: Products API Module
- Task 51: Categories API Module
- Task 52: Cart API Module
- Task 53: Inventory API Module

### Checkout Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    Checkout Flow Process                     │
└─────────────────────────────────────────────────────────────┘

Step 1: CART REVIEW           Step 2: SHIPPING INFO
┌──────────────────┐          ┌──────────────────┐
│ - View cart      │          │ - Enter address  │
│ - Update qty     │ ────────>│ - Select zone    │
│ - Apply coupon   │          │ - Calculate ship │
└──────────────────┘          └──────────────────┘
                                       │
                                       v
Step 3: PAYMENT METHOD        Step 4: ORDER REVIEW
┌──────────────────┐          ┌──────────────────┐
│ - PayHere        │          │ - Verify details │
│ - Stripe         │<─────────│ - View summary   │
│ - Bank Transfer  │          │ - Accept terms   │
│ - Cash on Del.   │          └──────────────────┘
└──────────────────┘                   │
                                       v
                            Step 5: CONFIRMATION
                            ┌──────────────────┐
                            │ - Submit order   │
                            │ - Get order #    │
                            │ - Show tracking  │
                            └──────────────────┘
```

### Instructions

1. **Create Type Definitions File**
   - Define Checkout interface with id, user_id, cart_id, current_step, shipping_address, billing_address, payment_method, shipping_method, order_summary, metadata, created_at, updated_at fields
   - Define ShippingAddress interface with id, customer_id, full_name, phone (format +94 XX XXX XXXX), address_line1, address_line2, city, district, province, postal_code, country (default LK), is_default, address_type (home/work/other) fields
   - Define PaymentMethod interface with id, type (payhere/stripe/bank_transfer/cod), card_last_four, card_brand, bank_name, account_holder, is_default, expires_at fields
   - Define ShippingMethod interface with id, name, code, price (LKR), estimated_days, available_for_zones, description fields
   - Define OrderSummary interface with subtotal, discount, shipping_cost, tax (VAT 8% in Sri Lanka), total (all in LKR), item_count, currency (LKR), payment_breakdown fields

2. **Create Query Parameters Interface**
   - Define CheckoutQueryParams with optional expand fields (shipping_options, payment_methods, available_addresses)
   - Define UpdateCheckoutParams with step, shipping_address_id, payment_method_id, shipping_method_id, billing_same_as_shipping, notes fields
   - Define ValidateCheckoutParams for pre-submission validation checks

3. **Implement Checkout Initiation Method**
   - Create initiateCheckout method that accepts cart_id parameter
   - Call POST /api/v1/checkout endpoint to create new checkout session
   - Return Checkout object with initial step set to cart_review
   - Handle error cases (empty cart, invalid items, out of stock)
   - Store checkout_id in session for subsequent operations

4. **Implement Shipping Address Methods**
   - Create updateShippingAddress method accepting address_id or new address data
   - Validate address format for Sri Lankan addresses (district must be one of 25 districts, province required, postal code format)
   - Call PUT /api/v1/checkout/:id/shipping-address endpoint
   - Return updated Checkout object with shipping options recalculated
   - Implement validateAddress utility to check completeness and format

5. **Implement Payment Method Selection**
   - Create updatePaymentMethod method accepting payment_method_id or new payment details
   - Support PayHere integration (local Sri Lankan payment gateway)
   - Support Stripe for international cards
   - Support bank transfer with account details
   - Support Cash on Delivery with availability rules (max amount, zones)
   - Call PUT /api/v1/checkout/:id/payment-method endpoint
   - Validate payment method availability for current cart value and zone

6. **Implement Shipping Calculation Utilities**
   - Create getShippingOptions method that fetches available shipping methods based on address
   - Define Sri Lankan shipping zones (Colombo Metro, Western Province, Other Provinces, Remote Areas)
   - Implement calculateShipping utility considering weight, dimensions, zone, and district
   - Handle express shipping availability (limited to main cities)
   - Calculate estimated delivery dates based on zone (1-2 days Colombo, 2-4 days Western, 3-7 days other)
   - Apply free shipping rules if applicable (order value threshold in LKR)

7. **Implement Shipping Method Application**
   - Create applyShippingMethod method accepting shipping_method_id
   - Call PUT /api/v1/checkout/:id/shipping-method endpoint
   - Recalculate order summary with new shipping cost
   - Validate shipping method availability for selected address
   - Update estimated delivery date in checkout object

8. **Implement Order Summary Generation**
   - Create getOrderSummary method that fetches current checkout totals
   - Calculate subtotal from cart items with current prices
   - Apply discount codes and promotional rules
   - Calculate shipping cost based on selected method
   - Calculate VAT (8% on eligible items per Sri Lankan tax rules)
   - Generate total in LKR with proper currency formatting (රු or LKR prefix)
   - Return breakdown of all cost components

9. **Implement Checkout Validation Method**
   - Create validateCheckout method performing pre-submission checks
   - Validate shipping address is complete and properly formatted
   - Validate payment method is selected and valid
   - Check inventory availability for all cart items
   - Verify prices haven't changed since cart creation
   - Confirm shipping method is available for address
   - Check user acceptance of terms and conditions
   - Return validation results with specific error messages for each failed check

10. **Implement Progress Tracking System**
    - Create updateCheckoutStep method to advance through checkout stages
    - Track step 1 (cart), step 2 (shipping), step 3 (payment), step 4 (review), step 5 (confirmation)
    - Validate required data before allowing step progression
    - Store step completion timestamps
    - Allow backward navigation but not forward without validation
    - Implement getCheckoutProgress utility returning current step, completed steps, next step, completion percentage

11. **Implement Order Submission Method**
    - Create submitOrder method performing final submission
    - Implement idempotency using idempotency_key (prevent duplicate orders on retry)
    - Call POST /api/v1/checkout/:id/submit endpoint
    - Perform final validation before submission
    - Handle payment processing if online payment selected
    - Clear cart upon successful order creation
    - Return Order object with order_number, confirmation details
    - Handle submission errors gracefully (payment failure, inventory insufficient, timeout)

12. **Add Payment Integration Utilities**
    - Create initializePayHerePayment utility for PayHere gateway integration
    - Create initializeStripePayment utility for Stripe payment intent
    - Implement handlePaymentCallback for processing payment gateway responses
    - Add verifyPaymentStatus method to check payment completion
    - Handle payment timeout scenarios (auto-cancel after X minutes)
    - Support payment retry logic for failed transactions

13. **Implement Error Handling and Recovery**
    - Add checkout expiration handling (session timeout after 30 minutes of inactivity)
    - Implement resumeCheckout method to restore expired sessions
    - Handle inventory changes during checkout (item out of stock, price change)
    - Add price protection logic (honor cart price vs. current price for X minutes)
    - Implement graceful degradation for shipping calculation failures
    - Add retry logic for transient API failures during submission

14. **Create Checkout Utilities Module**
    - Implement formatShippingAddress utility for Sri Lankan address display format
    - Create getCheckoutStepName utility returning localized step names (en/si/ta)
    - Implement canProceedToNextStep validation utility
    - Add calculateDeliveryDate utility based on zone and method
    - Create getPaymentMethodIcon utility for UI display
    - Implement formatOrderSummary utility with proper LKR formatting (රු 1,234.56)

### Expected Outcome

After completing this task, the following will be achieved:

- Complete checkout API module with multi-step flow management
- Type-safe interfaces for all checkout-related data structures
- Shipping address management with Sri Lankan format validation
- Payment method selection supporting multiple gateways (PayHere, Stripe, Bank, COD)
- Intelligent shipping calculation for 25 Sri Lankan districts across 9 provinces
- Real-time order summary generation with VAT and discount calculations
- Comprehensive checkout validation preventing invalid submissions
- Progress tracking system with step-by-step validation
- Idempotent order submission preventing duplicate orders
- Payment integration utilities for multiple payment gateways
- Error recovery mechanisms for common checkout issues
- Full Sri Lankan localization (LKR currency, phone format, address format)

### Verification Checklist

- [ ] Checkout type definitions created with all required fields
- [ ] Checkout initiation creates valid session from cart
- [ ] Shipping address validation enforces Sri Lankan format (25 districts, proper phone format)
- [ ] Payment method selection supports all required gateways (PayHere, Stripe, Bank Transfer, COD)
- [ ] Shipping calculation correctly handles all zones with appropriate costs and delivery times
- [ ] Order summary accurately calculates subtotal, shipping, VAT (8%), discount, and total in LKR
- [ ] Checkout validation performs all required checks before submission
- [ ] Progress tracking prevents skipping steps without required data
- [ ] Order submission implements idempotency preventing duplicate orders
- [ ] Payment integration initializes correctly for PayHere and Stripe
- [ ] Error handling manages inventory changes, timeouts, and payment failures gracefully
- [ ] Checkout utilities format data correctly with Sri Lankan localization (LKR රු format, +94 phone)

---

## Task 55: Customer/User API Module

**Estimated Time:** 1.5 hours  
**Priority:** Medium  
**Complexity:** Medium

### Overview

The Customer/User API Module manages authenticated user profiles, personal information, saved addresses, and customer preferences. It provides functionality for profile updates, address book management, and user preference configuration with support for Sri Lankan localization requirements including phone number formatting (+94 XX XXX XXXX), language preferences (English, Sinhala, Tamil), and proper address formatting with district and province.

### Dependencies

- Task 47: API Client Foundation
- Task 48: API Configuration & Environment
- Task 49: Authentication Module
- Task 54: Checkout API Module (for address types compatibility)

### Customer Data Structure

```
┌───────────────────────────────────────────────────────┐
│                    Customer Profile                    │
├───────────────────────────────────────────────────────┤
│  User Identity                                        │
│  ├─ id: UUID                                          │
│  ├─ email: string                                     │
│  ├─ phone: +94 XX XXX XXXX                           │
│  └─ username: string                                  │
├───────────────────────────────────────────────────────┤
│  Personal Information                                 │
│  ├─ first_name: string                               │
│  ├─ last_name: string                                │
│  ├─ date_of_birth: date (optional)                   │
│  └─ gender: M/F/Other (optional)                     │
├───────────────────────────────────────────────────────┤
│  Preferences                                          │
│  ├─ language: en/si/ta                               │
│  ├─ currency: LKR                                    │
│  ├─ timezone: Asia/Colombo                           │
│  ├─ notification_preferences: object                 │
│  └─ marketing_consent: boolean                       │
├───────────────────────────────────────────────────────┤
│  Address Book                                         │
│  ├─ addresses: Array<Address>                        │
│  ├─ default_shipping_address_id: UUID                │
│  └─ default_billing_address_id: UUID                 │
├───────────────────────────────────────────────────────┤
│  Metadata                                             │
│  ├─ created_at: timestamp                            │
│  ├─ updated_at: timestamp                            │
│  ├─ last_login: timestamp                            │
│  └─ account_status: active/suspended/deleted         │
└───────────────────────────────────────────────────────┘
```

### Instructions

1. **Create Type Definitions File**
   - Define Customer interface with id, email, phone, username, first_name, last_name, date_of_birth, gender, avatar_url, is_verified fields
   - Define UserProfile interface extending Customer with preferences, addresses, statistics (total_orders, total_spent, loyalty_points), created_at, updated_at fields
   - Define Address interface (can extend from Checkout module) with full Sri Lankan address fields
   - Define CustomerPreferences interface with language (en/si/ta), currency (LKR), timezone (Asia/Colombo), email_notifications, sms_notifications, push_notifications, marketing_consent fields
   - Define NotificationSettings interface with order_updates, promotions, newsletters, wishlist_reminders, back_in_stock_alerts fields

2. **Create Parameter Interfaces**
   - Define UpdateProfileParams with optional first_name, last_name, phone, date_of_birth, gender fields
   - Define AddAddressParams with all required Sri Lankan address fields (full_name, phone, address_line1, city, district, province, postal_code, address_type)
   - Define UpdateAddressParams extending AddAddressParams with optional fields
   - Define UpdatePreferencesParams with optional preference fields

3. **Implement Get Current User Method**
   - Create getCurrentUser method fetching authenticated user profile
   - Call GET /api/v1/customer/me endpoint
   - Return UserProfile object with complete customer data
   - Include address book and preferences in response
   - Handle unauthenticated requests returning null
   - Cache user profile data with appropriate TTL

4. **Implement Profile Update Method**
   - Create updateProfile method accepting UpdateProfileParams
   - Validate phone number format (+94 followed by valid Sri Lankan mobile number)
   - Validate date_of_birth is valid date and user is 18+ years old
   - Call PUT /api/v1/customer/me endpoint
   - Return updated UserProfile object
   - Trigger profile updated event for dependent modules
   - Clear cached profile data after update

5. **Implement Get Addresses Method**
   - Create getAddresses method fetching all saved addresses
   - Call GET /api/v1/customer/me/addresses endpoint
   - Return array of Address objects sorted by default addresses first
   - Filter addresses by type (all/shipping/billing) using optional parameter
   - Include address validation status (complete/incomplete)

6. **Implement Add Address Method**
   - Create addAddress method accepting AddAddressParams
   - Validate address completeness (all required fields present)
   - Validate district against list of 25 Sri Lankan districts
   - Validate province against 9 provinces (Central, Eastern, North Central, Northern, North Western, Sabaragamuwa, Southern, Uva, Western)
   - Format postal code correctly for Sri Lanka
   - Call POST /api/v1/customer/me/addresses endpoint
   - Return created Address object with generated id
   - Optionally set as default address if specified

7. **Implement Update Address Method**
   - Create updateAddress method accepting address_id and UpdateAddressParams
   - Validate address exists and belongs to current user
   - Apply same validation as addAddress for updated fields
   - Call PUT /api/v1/customer/me/addresses/:id endpoint
   - Return updated Address object
   - Update checkout sessions using this address if applicable

8. **Implement Delete Address Method**
   - Create deleteAddress method accepting address_id
   - Prevent deletion of default addresses without replacement
   - Check if address is used in any pending orders/checkouts
   - Call DELETE /api/v1/customer/me/addresses/:id endpoint
   - Return success status
   - If default address deleted, prompt to set new default

9. **Implement Set Default Address Method**
   - Create setDefaultAddress method accepting address_id and type (shipping/billing)
   - Validate address exists and belongs to current user
   - Call PUT /api/v1/customer/me/addresses/:id/set-default endpoint with type parameter
   - Update UserProfile with new default address IDs
   - Return updated Address object with is_default flag set

10. **Implement Preference Management Methods**
    - Create updatePreferences method accepting UpdatePreferencesParams
    - Validate language is one of supported options (en/si/ta)
    - Ensure currency is LKR for Sri Lankan store
    - Validate timezone is Asia/Colombo or compatible
    - Call PUT /api/v1/customer/me/preferences endpoint
    - Return updated CustomerPreferences object
    - Trigger locale change event for UI updates

11. **Add Customer Validation Utilities**
    - Create validatePhoneNumber utility checking format (+94 XX XXX XXXX where XX is operator code: 70-78)
    - Implement formatPhoneNumber utility converting various formats to standard format
    - Create validateDistrict utility checking against valid Sri Lankan districts list
    - Implement validateProvince utility for 9 provinces
    - Add validatePostalCode utility for Sri Lankan postal code format (5 digits)
    - Create isProfileComplete utility checking required fields

12. **Implement Address Formatting Utilities**
    - Create formatAddressForDisplay utility generating multi-line formatted address in Sri Lankan style
    - Implement formatAddressForShipping utility for shipping label format
    - Add formatAddressSingleLine utility for compact display
    - Create getDistrictProvince utility returning correct province for given district
    - Implement getAddressType utility returning localized type label (Home/වැඩ බිම/Work)

13. **Add Customer Account Utilities**
    - Create getFullName utility combining first_name and last_name
    - Implement getInitials utility for avatar placeholder
    - Add formatCustomerDisplay utility for various display contexts
    - Create getAccountAge utility calculating days since account creation
    - Implement getCustomerTier utility based on total_spent or orders (Bronze/Silver/Gold/Platinum)
    - Add hasCompleteProfile utility checking all recommended fields filled

14. **Implement Notification Preference Methods**
    - Create updateNotificationSettings method for granular notification control
    - Implement toggleNotification utility for quick enable/disable
    - Add getEnabledNotifications utility returning active notification types
    - Create shouldNotify utility checking if specific notification type is enabled
    - Handle email verification requirement for email notifications
    - Validate phone verification for SMS notifications

### Expected Outcome

After completing this task, the following will be achieved:

- Complete customer/user API module with profile management
- Type-safe interfaces for customer data, addresses, and preferences
- Profile update functionality with Sri Lankan phone validation (+94 format)
- Comprehensive address book management for shipping/billing addresses
- Address validation ensuring correct Sri Lankan format (25 districts, 9 provinces)
- Default address management for shipping and billing
- Customer preference management (language en/si/ta, timezone Asia/Colombo)
- Notification settings with granular control
- Phone number validation and formatting utilities for Sri Lankan mobile numbers
- Address formatting utilities for display and shipping labels
- Customer account utilities for display and tier calculation
- Profile completeness checking for encouraging complete information
- Sri Lankan localization throughout (district/province validation, phone format, currency LKR)

### Verification Checklist

- [ ] Customer and UserProfile type definitions created with all fields
- [ ] getCurrentUser method retrieves authenticated user profile
- [ ] Profile update validates phone number in +94 XX XXX XXXX format
- [ ] Address CRUD operations work correctly (create, read, update, delete)
- [ ] Address validation enforces 25 valid districts and 9 provinces
- [ ] Default address management prevents invalid operations (deleting only default)
- [ ] Customer preferences support language selection (en/si/ta) and Asia/Colombo timezone
- [ ] Phone validation utility correctly validates Sri Lankan mobile operator codes (70-78)
- [ ] Address formatting utilities produce correct Sri Lankan address format
- [ ] Customer utilities (getFullName, getInitials, getTier) work correctly
- [ ] Notification preferences can be updated granularly
- [ ] All validations and formatting respect Sri Lankan localization requirements

---

## Task 56: Orders API Module

**Estimated Time:** 2 hours  
**Priority:** Medium  
**Complexity:** Medium

### Overview

The Orders API Module manages the complete order lifecycle from creation to fulfillment and returns. It provides functionality for order listing, detailed order retrieval, tracking, cancellation, return requests, and reordering. The module supports comprehensive order status tracking through various fulfillment stages and includes Sri Lankan-specific features like LKR currency formatting, local delivery tracking, and invoice generation.

### Dependencies

- Task 47: API Client Foundation
- Task 48: API Configuration & Environment
- Task 49: Authentication Module
- Task 54: Checkout API Module
- Task 55: Customer/User API Module

### Order Status Lifecycle

```
┌─────────────────────────────────────────────────────────────┐
│                    Order Status Flow                         │
└─────────────────────────────────────────────────────────────┘

[PENDING] ──────> [PAYMENT_PENDING] ──────> [CONFIRMED]
    │                                            │
    │ (Auto-cancel                              │
    │  after 24h)                               │
    └─────────────────┐                         v
                      │                    [PROCESSING]
                      v                         │
              [CANCELLED]                       │
                                                v
                                         [READY_TO_SHIP]
                                                │
                                                v
                   [REFUNDED] <──────── [SHIPPED] ─────┐
                        ^                       │       │
                        │                       v       │
                        │                 [OUT_FOR_    │
                        │                  DELIVERY]    │
                        │                       │       │
                        │                       v       │
                        └────── [RETURN_      [DELIVERED]
                               REQUESTED]       │
                                    ^           │
                                    │           │
                                    └───────────┘
                                   (Return Window:
                                    7-14 days)
```

### Instructions

1. **Create Type Definitions File**
   - Define Order interface with id, order_number, user_id, status, order_date, items, subtotal, shipping_cost, tax, discount, total (all amounts in LKR), currency (LKR), shipping_address, billing_address, payment_method, payment_status, tracking_info, notes, created_at, updated_at fields
   - Define OrderItem interface with id, order_id, product_id, product_name, product_sku, variant_id, quantity, unit_price, line_total (in LKR), thumbnail_url, product_url fields
   - Define OrderStatus enum with values: PENDING, PAYMENT_PENDING, CONFIRMED, PROCESSING, READY_TO_SHIP, SHIPPED, OUT_FOR_DELIVERY, DELIVERED, CANCELLED, RETURN_REQUESTED, RETURNED, REFUNDED
   - Define OrderTracking interface with status, status_label, timestamp, location, notes, courier_name, tracking_number, estimated_delivery fields
   - Define PaymentStatus enum with values: PENDING, AUTHORIZED, PAID, FAILED, REFUNDED, PARTIALLY_REFUNDED

2. **Create Query Parameters Interface**
   - Define OrderQueryParams with optional status filter (single or array), date_range (from/to dates), search (order number or product name), sort (date_desc, date_asc, total_desc, total_asc), page, limit fields
   - Define OrderDetailParams with expand options (items, tracking, invoices, returns)
   - Define CancelOrderParams with cancellation_reason, notes fields
   - Define ReturnRequestParams with order_item_ids, return_reason, return_type (refund/exchange), description, images fields

3. **Implement List Orders Method**
   - Create listOrders method accepting OrderQueryParams
   - Call GET /api/v1/customer/orders endpoint with query parameters
   - Support filtering by status (show only specific statuses)
   - Support date range filtering (orders between two dates)
   - Support search by order number or product name
   - Implement sorting options (newest first, oldest first, highest value, lowest value)
   - Return paginated list of Order objects
   - Include pagination metadata (total_count, page, page_size, has_more)

4. **Implement Get Order By ID Method**
   - Create getOrderById method accepting order UUID
   - Call GET /api/v1/customer/orders/:id endpoint
   - Return detailed Order object with all fields populated
   - Include expanded items array with full product details
   - Include tracking information if available
   - Handle order not found error gracefully
   - Validate order belongs to authenticated user

5. **Implement Get Order By Number Method**
   - Create getOrderByNumber method accepting order_number string
   - Order numbers follow format: ORD-YYYYMMDD-XXXX (e.g., ORD-20260126-0042)
   - Call GET /api/v1/customer/orders/by-number/:number endpoint
   - Return same detailed Order object as getOrderById
   - Allow guest order lookup with email verification
   - Cache recently viewed orders for quick access

6. **Implement Track Order Method**
   - Create trackOrder method accepting order_id or order_number
   - Call GET /api/v1/customer/orders/:id/tracking endpoint
   - Return array of OrderTracking objects sorted by timestamp
   - Include current status and estimated delivery date
   - Show courier information and tracking number for shipped orders
   - Display location updates for out-for-delivery status
   - Format timestamps in Asia/Colombo timezone
   - Support public tracking (guest with order number and email)

7. **Implement Order Cancellation Method**
   - Create cancelOrder method accepting order_id and CancelOrderParams
   - Validate order can be cancelled (only PENDING, PAYMENT_PENDING, CONFIRMED, PROCESSING statuses)
   - Check cancellation window (cannot cancel after READY_TO_SHIP)
   - Call POST /api/v1/customer/orders/:id/cancel endpoint
   - Handle payment refund initiation if already paid
   - Return updated Order object with CANCELLED status
   - Send cancellation confirmation notification
   - Include refund timeline information (5-7 business days)

8. **Implement Return Request Method**
   - Create requestReturn method accepting order_id and ReturnRequestParams
   - Validate order is eligible for return (DELIVERED status, within return window 7-14 days)
   - Support full order return or specific items return
   - Require return reason selection (wrong item, damaged, defective, not as described, changed mind)
   - Call POST /api/v1/customer/orders/:id/return endpoint
   - Upload return images as evidence (optional but recommended)
   - Return updated Order object with RETURN_REQUESTED status
   - Provide return shipping instructions and label download
   - Specify refund or exchange preference

9. **Implement Reorder Method**
   - Create reorder method accepting order_id
   - Fetch original order items and details
   - Validate all items are still available for purchase
   - Check if any items are discontinued or out of stock
   - Add available items to cart with current prices
   - Call POST /api/v1/customer/orders/:id/reorder endpoint
   - Return cart object with added items
   - Show price comparison if prices changed since original order
   - Handle unavailable items gracefully (skip or suggest alternatives)

10. **Implement Order Status Tracking Utilities**
    - Create getOrderStatus utility returning current OrderStatus
    - Implement getOrderStatusLabel utility with localized status names (English/Sinhala/Tamil)
    - Add getOrderStatusColor utility for UI display (pending: yellow, processing: blue, shipped: purple, delivered: green, cancelled: red)
    - Create isOrderActive utility checking if order is in active fulfillment
    - Implement getNextStatus utility predicting next status transition
    - Add getStatusProgress utility returning completion percentage (0-100%)

11. **Implement Order Action Utilities**
    - Create canCancelOrder utility checking if cancellation is allowed
    - Implement canReturnOrder utility validating return eligibility with return window check
    - Add isReorderable utility checking if all items can be reordered
    - Create hasTracking utility checking if tracking info is available
    - Implement canDownloadInvoice utility validating invoice generation completion
    - Add getRefundTimeline utility estimating refund completion date

12. **Implement Order Details Utilities**
    - Create getOrderTotal utility calculating total in LKR with proper formatting (රු 12,456.78)
    - Implement getOrderItems utility extracting and formatting item list
    - Add getOrderItemsCount utility returning total quantity of items
    - Create formatOrderDate utility with localized date format and Asia/Colombo timezone
    - Implement getPaymentMethodDisplay utility formatting payment method for display
    - Add getShippingMethodDisplay utility showing shipping method name and cost

13. **Implement Invoice and Receipt Methods**
    - Create downloadInvoice method generating PDF invoice
    - Call GET /api/v1/customer/orders/:id/invoice endpoint
    - Return downloadable file URL or base64 PDF data
   - Include company details, order details, itemized list, totals in LKR
    - Format invoice per Sri Lankan business requirements (VAT registration if applicable)
    - Implement downloadReceipt method for payment receipt
    - Support email invoice sending as alternative to download

14. **Implement Order History Filtering and Sorting**
    - Create filterOrdersByStatus utility for client-side filtering
    - Implement filterOrdersByDateRange utility for date-based filtering
    - Add sortOrders utility with multiple sort strategies
    - Create searchOrders utility for client-side search
    - Implement groupOrdersByMonth utility for timeline display
    - Add getRecentOrders utility returning last N orders

### Expected Outcome

After completing this task, the following will be achieved:

- Complete orders API module with full lifecycle management
- Type-safe interfaces for orders, items, statuses, and tracking
- Order listing with filtering, searching, and sorting capabilities
- Detailed order retrieval by ID or order number
- Real-time order tracking with courier and location information
- Order cancellation with refund handling and validation
- Return request system with item selection and reason capture
- Reorder functionality with availability checking
- Order status tracking utilities with localized labels (en/si/ta)
- Order action validation (can cancel, can return, is reorderable)
- Order details formatting utilities with proper LKR formatting
- Invoice and receipt generation and download
- Comprehensive order history management with filtering and sorting
- Sri Lankan localization (LKR currency, Asia/Colombo timezone, local delivery tracking)

### Verification Checklist

- [ ] Order type definitions created with all required fields including LKR amounts
- [ ] listOrders method supports filtering by status, date range, and sorting
- [ ] getOrderById and getOrderByNumber retrieve correct order details
- [ ] trackOrder returns accurate tracking history with timestamps in Asia/Colombo timezone
- [ ] cancelOrder validates cancellation eligibility and processes correctly
- [ ] requestReturn validates return window (7-14 days) and captures required information
- [ ] reorder method checks availability and adds items to cart with current prices
- [ ] Order status utilities return correct status labels in supported languages (en/si/ta)
- [ ] Order action utilities accurately determine available actions (cancel, return, reorder)
- [ ] Order total calculations format correctly in LKR with රු symbol
- [ ] Invoice download generates proper PDF with Sri Lankan business format
- [ ] Order history filtering and sorting work correctly with various parameters

---

## Task 57: Reviews & Ratings API Module

**Estimated Time:** 1.5 hours  
**Priority:** Low  
**Complexity:** Low

### Overview

The Reviews & Ratings API Module enables customers to leave product reviews and ratings, providing valuable feedback for other shoppers. It includes functionality for creating, updating, and deleting reviews, viewing reviews by product, rating aggregation, verified purchase badges, and helpful voting. The module enforces one review per product per customer and includes filtering capabilities for verified purchases, rating levels, and date ranges.

### Dependencies

- Task 47: API Client Foundation
- Task 48: API Configuration & Environment
- Task 49: Authentication Module
- Task 55: Customer/User API Module
- Task 56: Orders API Module (for verified purchase validation)

### Review and Rating Structure

```
┌───────────────────────────────────────────────────────────┐
│                 Product Review Ecosystem                   │
└───────────────────────────────────────────────────────────┘

Product Reviews
├── Individual Reviews
│   ├── Review ID: UUID
│   ├── Rating: 1-5 stars (★★★★★)
│   ├── Title: string (max 100 chars)
│   ├── Content: text (max 1000 chars)
│   ├── Author: User (first_name, avatar)
│   ├── Verified Purchase: boolean ✓
│   ├── Created Date: timestamp
│   ├── Helpful Votes: count
│   └── Images: Array<url> (max 5)
│
├── Rating Distribution
│   ├── 5 Stars: count (█████████████ 65%)
│   ├── 4 Stars: count (████████      20%)
│   ├── 3 Stars: count (███           10%)
│   ├── 2 Stars: count (█              3%)
│   └── 1 Star:  count (█              2%)
│
└── Aggregated Stats
    ├── Average Rating: 4.5 (weighted)
    ├── Total Reviews: count
    ├── Verified Purchases: percentage
    ├── Recommended: percentage
    └── Recent Trend: improving/declining

Filter Options:
- Verified Purchases Only
- Rating Level (5★, 4★, 3★, 2★, 1★)
- Most Recent / Most Helpful
- With Images Only
```

### Instructions

1. **Create Type Definitions File**
   - Define Review interface with id, product_id, user_id, order_item_id (for verification), rating (1-5), title, content, is_verified_purchase, helpful_count, not_helpful_count, images, response (store response to review), created_at, updated_at fields
   - Define Rating type as number (1, 2, 3, 4, or 5) with constraint
   - Define ReviewStats interface with average_rating, total_reviews, rating_distribution (object with keys 1-5 and counts), verified_purchase_percentage, recommendation_percentage fields
   - Define ReviewAuthor interface with user_id, first_name, last_name, avatar_url, review_count, is_verified_buyer fields
   - Define ReviewWithAuthor interface extending Review with author field

2. **Create Query and Mutation Parameters**
   - Define ReviewQueryParams with product_id (required for product reviews), rating_filter (1-5 or array), verified_only boolean, sort (recent, helpful, rating_high, rating_low), page, limit, include_images_only boolean fields
   - Define CreateReviewParams with product_id, order_item_id (optional for verification), rating (1-5), title, content, images (array of URLs or upload handles), recommend boolean fields
   - Define UpdateReviewParams with optional rating, title, content, images fields
   - Define VoteParams with review_id, vote_type (helpful/not_helpful) fields

3. **Implement Get Product Reviews Method**
   - Create getProductReviews method accepting product_id and ReviewQueryParams
   - Call GET /api/v1/products/:id/reviews endpoint
   - Support filtering by rating (show only 5-star, 4-star, etc.)
   - Support verified purchase filter (show only verified buyers)
   - Support images filter (show only reviews with images)
   - Implement sorting (most recent, most helpful, highest rating, lowest rating)
   - Return paginated array of ReviewWithAuthor objects
   - Include pagination metadata (total, page, has_more)

4. **Implement Get Review Statistics Method**
   - Create getReviewStats method accepting product_id
   - Call GET /api/v1/products/:id/reviews/stats endpoint
   - Return ReviewStats object with aggregated data
   - Calculate average rating with proper weighting
   - Generate rating distribution (count of each rating level)
   - Calculate verified purchase percentage
   - Calculate recommendation percentage (from recommend boolean)
   - Use cached stats with short TTL (5 minutes) for performance

5. **Implement Create Review Method**
   - Create createReview method accepting CreateReviewParams
   - Validate user is authenticated
   - Check if user has purchased product (verify order_item_id if provided)
   - Validate rating is between 1 and 5
   - Validate title length (max 100 characters)
   - Validate content length (max 1000 characters)
   - Validate images count (max 5 images)
   - Call POST /api/v1/reviews endpoint
   - Return created Review object with is_verified_purchase flag
   - Clear product review cache after creation

6. **Implement Update Review Method**
   - Create updateReview method accepting review_id and UpdateReviewParams
   - Validate review belongs to authenticated user
   - Check if review edit window is still open (e.g., 30 days from creation)
   - Apply same validation as create for updated fields
   - Call PUT /api/v1/reviews/:id endpoint
   - Return updated Review object
   - Mark review as edited with updated_at timestamp
   - Clear product review cache after update

7. **Implement Delete Review Method**
   - Create deleteReview method accepting review_id
   - Validate review belongs to authenticated user
   - Call DELETE /api/v1/reviews/:id endpoint
   - Return success status
   - Clear product review cache after deletion
   - Handle references in helpful votes (clean up)

8. **Implement Get My Reviews Method**
   - Create getMyReviews method for authenticated user's reviews
   - Call GET /api/v1/customer/reviews endpoint
   - Support filtering by product, rating, date range
   - Return array of Review objects with product information
   - Include helpful vote counts for each review
   - Sort by most recent first by default

9. **Implement Can Review Check Method**
   - Create canReview method accepting product_id
   - Check if user is authenticated
   - Check if user has already reviewed this product (one review per product rule)
   - Optionally check if user has purchased product
   - Call GET /api/v1/products/:id/can-review endpoint or compute client-side
   - Return boolean and reason if cannot review
   - Use for enabling/disabling review form

10. **Implement Helpful Voting Methods**
    - Create markReviewHelpful method accepting review_id
    - Call POST /api/v1/reviews/:id/vote endpoint with vote_type: helpful
    - Increment helpful_count for the review
    - Prevent multiple votes from same user
    - Return updated helpful_count
    - Create markReviewNotHelpful method with vote_type: not_helpful
    - Implement removeVote method to undo vote
    - Track user's votes to show which reviews they've voted on

11. **Implement Review Validation Utilities**
    - Create validateRating utility ensuring value is 1-5 integer
    - Implement validateReviewTitle utility checking length and content
    - Add validateReviewContent utility checking length, profanity (basic), spam patterns
    - Create canEditReview utility checking edit window and ownership
    - Implement canDeleteReview utility validating deletion permission
    - Add hasUserReviewed utility checking if user has existing review for product

12. **Implement Rating Aggregation Utilities**
    - Create getAverageRating utility calculating weighted average from distribution
    - Implement getRatingDistribution utility formatting distribution for charts
    - Add getRatingPercentage utility calculating percentage for each rating level
    - Create getReviewCount utility returning total review count
    - Implement formatRating utility displaying rating as stars (★★★★☆) or number
    - Add getRatingColor utility for UI (1-2: red, 3: yellow, 4-5: green)

13. **Implement Review Filtering Utilities**
    - Create filterByRating utility for client-side rating filtering
    - Implement filterByVerifiedPurchase utility showing only verified reviews
    - Add filterByImages utility showing reviews with images
    - Create sortByHelpful utility sorting by helpful vote count
    - Implement sortByDate utility sorting by creation date
    - Add hasImages utility checking if review has uploaded images

14. **Implement Review Display Utilities**
    - Create formatReviewDate utility with relative time (2 days ago) and absolute date
    - Implement truncateReviewContent utility for preview display (e.g., first 200 chars)
    - Add getReviewExcerpt utility extracting meaningful preview
    - Create formatAuthorName utility displaying reviewer name (First N. for privacy)
    - Implement getVerifiedBadge utility returning verified purchase indicator text/icon
    - Add getRecommendedBadge utility showing recommendation status

### Expected Outcome

After completing this task, the following will be achieved:

- Complete reviews and ratings API module with full CRUD operations
- Type-safe interfaces for reviews, ratings, statistics, and authors
- Product review retrieval with filtering by rating, verified purchase, and images
- Review statistics calculation with average rating and distribution
- Review creation with verified purchase validation and image support
- Review update and deletion with ownership validation
- My reviews listing for authenticated users
- Can review validation enforcing one review per product rule
- Helpful voting system preventing duplicate votes
- Review validation utilities for rating, title, and content
- Rating aggregation utilities for statistics and display
- Review filtering and sorting utilities for client-side operations
- Review display utilities with formatting and privacy considerations
- Verified purchase badges enhancing review credibility

### Verification Checklist

- [ ] Review type definitions created with all required fields
- [ ] getProductReviews retrieves reviews with filtering and sorting options
- [ ] getReviewStats calculates correct average rating and distribution
- [ ] createReview validates all inputs and marks verified purchases correctly
- [ ] updateReview enforces ownership and edit window (30 days)
- [ ] deleteReview removes review and clears cache appropriately
- [ ] getMyReviews returns authenticated user's reviews
- [ ] canReview correctly validates one review per product rule
- [ ] Helpful voting prevents duplicate votes from same user
- [ ] Rating validation ensures values are 1-5 integers
- [ ] Rating aggregation utilities calculate correct averages and distributions
- [ ] Review display utilities format dates and content appropriately

---

## Task 58: Wishlist API Module

**Estimated Time:** 1 hour  
**Priority:** Low  
**Complexity:** Low

### Overview

The Wishlist API Module enables customers to save products for future purchase consideration. It provides functionality for adding/removing items, viewing the wishlist, clearing the wishlist, moving items to cart, and checking product wishlist status. The module implements cross-device sync for authenticated users while using localStorage for guest sessions, with automatic migration when guests log in.

### Dependencies

- Task 47: API Client Foundation
- Task 48: API Configuration & Environment
- Task 49: Authentication Module (optional for guest wishlists)
- Task 50: Products API Module
- Task 52: Cart API Module (for move to cart feature)

### Wishlist Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Wishlist System                       │
└─────────────────────────────────────────────────────────┘

Guest User                    Authenticated User
┌──────────────┐              ┌──────────────┐
│ localStorage │              │   Backend    │
│   Wishlist   │              │   Wishlist   │
│              │              │              │
│ - Product IDs│──Login──────>│ - Merge      │
│ - Timestamps │  Migration   │ - Sync       │
│ - No sync    │              │ - Multi-dev  │
└──────────────┘              └──────────────┘
                                     │
                              ┌──────┴──────┐
                              │             │
                         Device 1      Device 2
                        (Desktop)      (Mobile)
                            ↕              ↕
                        [Synced Wishlist]

Wishlist Item States:
┌─────────────────────────────────────┐
│ ✓ In Stock       → Add to Cart      │
│ ✗ Out of Stock   → Notify Me        │
│ ⚠ Low Stock      → Add to Cart (X)  │
│ ⓘ Price Drop     → Show Old Price   │
│ 🔥 On Sale       → Show Discount    │
└─────────────────────────────────────┘
```

### Instructions

1. **Create Type Definitions File**
   - Define Wishlist interface with id (for auth users), user_id, items, created_at, updated_at fields
   - Define WishlistItem interface with id, wishlist_id, product_id, product (full product object), variant_id, added_at, notification_enabled (for back-in-stock alerts) fields
   - Define WishlistSummary interface with item_count, total_value (sum of product prices in LKR), available_count (in stock items), out_of_stock_count fields
   - Define LocalWishlist interface for guest storage with product_ids array and timestamps object

2. **Implement Get Wishlist Method**
   - Create getWishlist method with no parameters
   - For authenticated users, call GET /api/v1/customer/wishlist endpoint
   - For guest users, retrieve from localStorage key 'wishlist'
   - Return Wishlist object with full product details for each item
   - Include product availability status for each item
   - Include price information in LKR for value calculation
   - Sort items by most recently added first

3. **Implement Add to Wishlist Method**
   - Create addToWishlist method accepting product_id and optional variant_id
   - For authenticated users, call POST /api/v1/customer/wishlist/items endpoint
   - For guest users, add to localStorage wishlist array
   - Prevent duplicate additions (check if product already in wishlist)
   - Return updated Wishlist or success status
   - Trigger wishlist updated event for UI updates
   - Show confirmation notification with product name

4. **Implement Remove from Wishlist Method**
   - Create removeFromWishlist method accepting product_id or wishlist_item_id
   - For authenticated users, call DELETE /api/v1/customer/wishlist/items/:id endpoint
   - For guest users, remove from localStorage wishlist array
   - Return updated Wishlist or success status
   - Trigger wishlist updated event
   - Show removal confirmation with undo option

5. **Implement Clear Wishlist Method**
   - Create clearWishlist method with no parameters
   - For authenticated users, call DELETE /api/v1/customer/wishlist endpoint
   - For guest users, clear localStorage wishlist
   - Require confirmation before clearing (modal/dialog)
   - Return success status
   - Trigger wishlist cleared event

6. **Implement Move to Cart Method**
   - Create moveToCart method accepting wishlist_item_id or product_id
   - Check product availability and stock status
   - If available, add to cart using Cart API module (Task 52)
   - After successful cart addition, remove from wishlist
   - For variant products, open variant selector if variant_id not specified
   - Handle out-of-stock gracefully (show notification, offer alternative)
   - Return cart object with added item

7. **Implement Check Wishlist Status Method**
   - Create checkIfInWishlist method (or isInWishlist) accepting product_id
   - For authenticated users, check against backend wishlist
   - For guest users, check localStorage wishlist
   - Return boolean indicating presence
   - Cache wishlist state for performance
   - Use for toggling wishlist icon state in product cards

8. **Implement Wishlist Sync for Authentication**
   - Create syncWishlist method called after user login
   - Retrieve guest wishlist from localStorage
   - Merge with backend wishlist (avoid duplicates)
   - Call POST /api/v1/customer/wishlist/sync endpoint with guest items
   - Clear localStorage wishlist after successful sync
   - Return merged Wishlist object
   - Show notification about merged items count

9. **Implement Wishlist Notification Methods**
   - Create enableNotifications method accepting wishlist_item_id
   - Enable back-in-stock alerts for out-of-stock wishlist items
   - Call PUT /api/v1/customer/wishlist/items/:id/notify endpoint
   - Set notification_enabled flag to true
   - Return updated WishlistItem
   - Create disableNotifications method to turn off alerts

10. **Implement Wishlist Count Utility**
    - Create getWishlistCount utility returning total item count
    - For authenticated users, use backend count
    - For guest users, count localStorage items
    - Cache count with short TTL for performance
    - Subscribe to wishlist events to keep count updated
    - Use for badge display in navigation (e.g., ♥ 5)

11. **Implement Wishlist Validation Utilities**
    - Create isInWishlist utility checking product presence
    - Implement canAddToWishlist utility validating addition
    - Add getWishlistLimit utility if wishlist size is limited
    - Create isWishlistFull utility checking against limit
    - Implement validateWishlistItem utility ensuring valid product

12. **Implement Wishlist Formatting Utilities**
    - Create formatWishlist utility for display with grouping options
    - Implement getAvailableItems utility filtering in-stock items
    - Add getOutOfStockItems utility filtering unavailable items
    - Create getWishlistValue utility calculating total value in LKR
    - Implement sortWishlist utility with sort options (date added, price, name, availability)
    - Add formatWishlistSummary utility generating summary text

13. **Implement Local Storage Management**
    - Create saveWishlistToLocal utility for guest wishlist persistence
    - Implement loadWishlistFromLocal utility retrieving stored wishlist
    - Add clearWishlistFromLocal utility removing localStorage data
    - Create mergeWishlists utility combining guest and user wishlists (remove duplicates)
    - Implement migrateGuestWishlist utility for post-login migration
    - Handle localStorage quota exceeded errors gracefully

14. **Implement Wishlist Product Updates**
    - Create updateWishlistPrices method refreshing product prices
    - Detect price drops since addition (compare added_price vs current_price)
    - Detect products on sale (apply discount highlighting)
    - Update availability status for all items
    - Call GET /api/v1/customer/wishlist/refresh endpoint
    - Show notifications for significant price drops
    - Highlight sale items in wishlist view

### Expected Outcome

After completing this task, the following will be achieved:

- Complete wishlist API module with cross-device sync
- Type-safe interfaces for wishlist, items, and summaries
- Wishlist retrieval for both authenticated and guest users
- Add to wishlist with duplicate prevention
- Remove from wishlist with confirmation and undo
- Clear wishlist with confirmation dialog
- Move to cart functionality with availability checking
- Wishlist status checking for product cards
- Guest-to-user wishlist sync on login with merge logic
- Back-in-stock notification opt-in for wishlist items
- Wishlist count utility for navigation badge
- Wishlist validation utilities for business rules
- Wishlist formatting utilities for display and sorting
- localStorage management for guest wishlists
- Price drop and sale detection for wishlist items
- Sri Lankan localization with LKR formatting for wishlist value

### Verification Checklist

- [ ] Wishlist type definitions created with required fields
- [ ] getWishlist retrieves correct wishlist for authenticated/guest users
- [ ] addToWishlist prevents duplicates and updates correctly
- [ ] removeFromWishlist removes item from appropriate storage
- [ ] clearWishlist clears all items after confirmation
- [ ] moveToCart checks availability and adds to cart correctly
- [ ] isInWishlist accurately checks product presence
- [ ] syncWishlist merges guest and user wishlists on login without duplicates
- [ ] Notification methods enable/disable back-in-stock alerts
- [ ] getWishlistCount returns accurate count for badge display
- [ ] Wishlist utilities correctly filter available/out-of-stock items
- [ ] localStorage management handles storage and retrieval correctly

---

## Task 59: Search & Filters API Module

**Estimated Time:** 2 hours  
**Priority:** Medium  
**Complexity:** Medium

### Overview

The Search & Filters API Module provides comprehensive search functionality across products, categories, and content with advanced filtering capabilities. It includes faceted search with dynamic filter options, autocomplete suggestions, search history tracking, and result highlighting. The module supports full-text search, category filtering, price ranges in LKR, rating filters, brand filters, and availability filters to help customers find products efficiently.

### Dependencies

- Task 47: API Client Foundation
- Task 48: API Configuration & Environment
- Task 49: Authentication Module (optional for search history)
- Task 50: Products API Module
- Task 51: Categories API Module

### Search Architecture

```
┌──────────────────────────────────────────────────────────┐
│                    Search System Flow                     │
└──────────────────────────────────────────────────────────┘

User Input: "laptop under 150000"
     │
     v
┌─────────────────┐
│  Query Parser   │ → Extracts: term="laptop", 
│                 │             price_max=150000 LKR
└─────────────────┘
     │
     v
┌─────────────────┐
│  Autocomplete   │ → Suggestions:
│   Engine        │   - laptop computers
└─────────────────┘   - laptop bags
     │                - gaming laptops
     v
┌─────────────────┐
│ Search Backend  │ → ElasticSearch / Postgres FTS
│  (Full-Text)    │   
└─────────────────┘
     │
     v
┌─────────────────┐
│  Apply Facets   │ → Category: Electronics
│   & Filters     │   Brand: [Dell, HP, Lenovo...]
└─────────────────┘   Price: [0-50K, 50-100K, 100-150K]
     │                Rating: [4+ stars, 3+, all]
     v                Stock: [In Stock, Pre-order]
┌─────────────────┐
│ Rank Results    │ → Score by:
│                 │   - Relevance (TF-IDF)
└─────────────────┘   - Popularity (sales)
     │                - Rating (stars)
     v                - Recency (new products)
┌─────────────────┐
│ Return Results  │ → Products: [{...}, {...}]
│  with Facets    │   Facets: {categories, brands...}
└─────────────────┘   Suggestions: ["related terms"]
                      Total: 156 results

Faceted Search Example:
┌────────────────────────────────────────┐
│ Search Results for: "laptop"          │
├────────────────────────────────────────┤
│ Filters Applied:                       │
│ ☑ Electronics > Computers > Laptops   │
│ ☑ Price: රු 100,000 - 150,000         │
│ ☑ Rating: 4+ stars                    │
│ ☐ Brand: Dell (42)                    │
│ ☐ Brand: HP (38)                      │
│ ☐ Brand: Lenovo (29)                  │
│ ☑ In Stock Only                       │
│                                        │
│ 45 products found                      │
└────────────────────────────────────────┘
```

### Instructions

1. **Create Type Definitions File**
   - Define SearchResult interface with items (array of products/categories), total_count, page, page_size, has_more, facets (available filters), query, suggestions fields
   - Define SearchFilters interface with categories (array), brands (array), price_min (LKR), price_max (LKR), rating_min (1-5), in_stock_only (boolean), on_sale_only (boolean), sort_by (relevance/price_asc/price_desc/rating/newest) fields
   - Define SearchFacet interface with field_name, display_name, options (array of FacetOption with value, label, count) fields
   - Define SearchSuggestion interface with text, type (product/category/brand), url, highlight fields
   - Define SearchHistoryItem interface with id, query, filters, timestamp, result_count fields

2. **Create Search Parameters Interface**
   - Define SearchParams with query (search term), filters (SearchFilters object), facets (array of facet fields to return), page, limit (results per page), highlight (boolean for highlighting matches) fields
   - Define AutocompleteParams with query (partial term), limit (max suggestions), types (filter suggestion types) fields
   - Define ProductSearchParams extending SearchParams with product-specific filters
   - Define CategorySearchParams for category search

3. **Implement Universal Search Method**
   - Create searchAll method accepting query string and optional filters
   - Call GET /api/v1/search endpoint with query parameters
   - Search across multiple content types (products, categories, brands, content pages)
   - Return mixed SearchResult with grouped items by type
   - Include relevance scoring with most relevant results first
   - Support typo tolerance and fuzzy matching
   - Handle empty query (return popular/trending items)

4. **Implement Product Search Method**
   - Create searchProducts method accepting query and SearchParams
   - Call GET /api/v1/search/products endpoint
   - Search product names, descriptions, SKUs, brands
   - Apply filters from SearchParams (categories, price range in LKR, ratings, brands, stock status)
   - Return SearchResult with Product objects
   - Include available facets for further filtering
   - Implement search term highlighting in results

5. **Implement Category Search Method**
   - Create searchCategories method accepting query string
   - Call GET /api/v1/search/categories endpoint
   - Search category names and descriptions
   - Return array of Category objects matching query
   - Include product count for each category
   - Use for category filtering UI

6. **Implement Faceted Search Support**
   - Create getFacets method accepting current search query and filters
   - Return available facets with option counts for current result set
   - Support dynamic facets (facet options change based on applied filters)
   - Generate facets for categories (hierarchical), brands (alphabetical), price ranges (in LKR intervals), ratings (4+, 3+, all), availability (in stock, pre-order, all)
   - Include "clear all filters" functionality
   - Implement single vs. multi-select facet behavior

7. **Implement Filter Application Methods**
   - Create applyFilter method accepting filter_type and filter_value
   - Update current SearchParams with new filter
   - Re-execute search with updated filters
   - Return new SearchResult with updated facets
   - Create removeFilter method to remove specific filter
   - Create clearAllFilters method to reset all filters
   - Maintain filter state in search session

8. **Implement Autocomplete/Suggestions Method**
   - Create getSearchSuggestions method accepting partial query string
   - Call GET /api/v1/search/suggestions endpoint
   - Return array of SearchSuggestion objects ordered by relevance
   - Include product name suggestions, category suggestions, brand suggestions
   - Limit suggestions (e.g., max 10 suggestions)
   - Highlight matching portion of suggestion text
   - Include thumbnail images for product suggestions
   - Implement debouncing on client side (wait for user to stop typing)

9. **Implement Search History Methods**
   - Create saveSearchHistory method accepting query and filters
   - For authenticated users, call POST /api/v1/customer/search-history endpoint
   - For guest users, save to localStorage (max 20 recent searches)
   - Store query, applied filters, timestamp, result count
   - Return success status
   - Create getSearchHistory method returning recent searches
   - Call GET /api/v1/customer/search-history endpoint for auth users
   - Retrieve from localStorage for guests
   - Return array of SearchHistoryItem objects

10. **Implement Clear Search History Method**
    - Create clearSearchHistory method with optional search_id parameter
    - If search_id provided, delete specific history entry
    - If no parameter, clear all history
    - For authenticated users, call DELETE /api/v1/customer/search-history endpoint
    - For guest users, clear from localStorage
    - Return success status
    - Implement clear confirmation dialog

11. **Implement Search Validation Utilities**
    - Create validateSearchQuery utility checking minimum length (2-3 characters)
    - Implement sanitizeSearchQuery utility removing special characters, excessive spaces
    - Add isPriceRangeValid utility checking min <= max and reasonable ranges in LKR
    - Create isRatingValid utility ensuring rating is 1-5
    - Implement hasActiveFilters utility checking if any filters applied
    - Add getActiveFilterCount utility returning count of active filters

12. **Implement Search Result Utilities**
    - Create highlightMatches utility applying highlight markup to search term occurrences
    - Implement formatSearchResults utility organizing results for display
    - Add getSearchFacets utility extracting facets from SearchResult
    - Create groupResultsByCategory utility grouping products by category
    - Implement extractSearchMetadata utility getting query metadata (result count, time, etc.)
    - Add hasMoreResults utility checking pagination state

13. **Implement Facet Utilities**
    - Create formatFacetOptions utility sorting and formatting facet options
    - Implement getPriceRangeFacets utility generating price range buckets in LKR (e.g., 0-25K, 25-50K, 50-100K, 100-150K, 150K+)
    - Add getRatingFacets utility creating rating filter options (5★, 4★+, 3★+, All)
    - Create getCategoryFacets utility formatting hierarchical category facets
    - Implement getBrandFacets utility sorting brands alphabetically with counts
    - Add getAvailabilityFacets utility for stock status filters

14. **Implement Search Analytics Utilities**
    - Create trackSearch method logging search event for analytics
    - Implement trackSearchClick method logging result click for relevance tuning
    - Add getPopularSearches utility returning trending searches
    - Create getRecentSearches utility (last N searches by user)
    - Implement formatSearchHistory utility for display
    - Add getSearchSuggestionFromHistory utility using history for suggestions

### Expected Outcome

After completing this task, the following will be achieved:

- Complete search and filters API module with faceted search
- Type-safe interfaces for search results, filters, facets, and suggestions
- Universal search across products, categories, and brands
- Product-specific search with comprehensive filtering
- Category search functionality
- Faceted search with dynamic facet generation based on results
- Filter application and removal with state management
- Autocomplete suggestions with query highlighting
- Search history tracking for authenticated and guest users
- Search history clearing and management
- Search validation utilities for query and filters
- Search result formatting utilities with highlighting
- Facet utilities for price ranges (LKR), ratings, categories, brands
- Search analytics tracking for optimization
- Sri Lankan localization with LKR price ranges and proper formatting

### Verification Checklist

- [ ] Search type definitions created with all required fields
- [ ] searchAll performs universal search across multiple content types
- [ ] searchProducts applies filters correctly (category, price LKR, rating, brand, stock)
- [ ] Faceted search returns dynamic facets with accurate counts
- [ ] Filter application updates search results and facets appropriately
- [ ] getSearchSuggestions returns relevant autocomplete suggestions
- [ ] Search history saves to backend (auth) or localStorage (guest)
- [ ] clearSearchHistory removes history entries correctly
- [ ] Search validation utilities enforce minimum query length and valid filters
- [ ] highlightMatches correctly marks search term occurrences
- [ ] Price range facets use appropriate LKR buckets (0-25K, 25-50K, etc.)
- [ ] Search analytics tracking records search events and clicks

---

## Task 60: Verify API Client Integration

**Estimated Time:** 1 hour  
**Priority:** Low  
**Complexity:** Low

### Overview

This final task focuses on comprehensive verification of the complete API client system, ensuring all modules work together seamlessly with proper type safety, error handling, authentication flow, retry logic, and Sri Lankan localization. It involves testing individual modules, integration workflows (cart to checkout to order), performance validation, and multi-tenant support verification if applicable.

### Dependencies

- Task 47: API Client Foundation
- Task 48: API Configuration & Environment
- Task 49: Authentication Module
- Task 50: Products API Module
- Task 51: Categories API Module
- Task 52: Cart API Module
- Task 53: Inventory API Module
- Task 54: Checkout API Module
- Task 55: Customer/User API Module
- Task 56: Orders API Module
- Task 57: Reviews & Ratings API Module
- Task 58: Wishlist API Module
- Task 59: Search & Filters API Module

### Integration Test Scenarios

```
┌──────────────────────────────────────────────────────────┐
│              End-to-End Integration Flows                 │
└──────────────────────────────────────────────────────────┘

Flow 1: Guest Browsing → Purchase
┌────────────────────────────────────────────┐
│ 1. Search products → Results              │
│ 2. View product details → Loaded          │
│ 3. Add to cart (guest) → localStorage     │
│ 4. View cart → Items displayed            │
│ 5. Proceed to checkout → Login prompt     │
│ 6. Register/Login → Auth token received   │
│ 7. Cart migration → Backend cart updated  │
│ 8. Enter shipping → Address validated     │
│ 9. Select payment → Method saved          │
│ 10. Submit order → Order created          │
│ 11. View order → Tracking active          │
└────────────────────────────────────────────┘

Flow 2: Authenticated User → Reorder
┌────────────────────────────────────────────┐
│ 1. Login → Token stored                   │
│ 2. View order history → Orders loaded     │
│ 3. Select order → Details displayed       │
│ 4. Click reorder → Items added to cart    │
│ 5. Review cart → Prices updated           │
│ 6. Checkout → Saved address used          │
│ 7. Payment → Saved method selected        │
│ 8. Submit → New order created             │
└────────────────────────────────────────────┘

Flow 3: Wishlist → Purchase
┌────────────────────────────────────────────┐
│ 1. Browse products → View products        │
│ 2. Add to wishlist → Wishlist updated     │
│ 3. Check wishlist → Items listed          │
│ 4. Price drop notification → Received    │
│ 5. Move to cart → Cart updated            │
│ 6. Checkout → Standard flow              │
└────────────────────────────────────────────┘

Flow 4: Post-Purchase → Review
┌────────────────────────────────────────────┐
│ 1. Order delivered → Status updated       │
│ 2. Review prompt → Can review verified    │
│ 3. Write review → Rating & content        │
│ 4. Upload images → Images attached        │
│ 5. Submit review → Review created         │
│ 6. View on product → Review displayed     │
│ 7. Other users vote → Helpful count up    │
└────────────────────────────────────────────┘
```

### Instructions

1. **Test Individual API Modules**
   - Test Products API Module: Fetch products list, get product by ID/slug, check variant selection
   - Test Categories API Module: Fetch category tree, get category products, validate hierarchy
   - Test Cart API Module: Add items (guest & auth), update quantities, remove items, clear cart, apply coupons
   - Test Inventory API Module: Check stock levels, validate availability, test low stock warnings
   - Test Checkout API Module: Initiate checkout, update address, select payment, calculate shipping, submit order
   - Test Customer API Module: Get profile, update profile with +94 phone validation, manage addresses (CRUD)
   - Test Orders API Module: List orders, get order details, track order, cancel order, request return
   - Test Reviews API Module: Get product reviews, create review, update review, vote helpful
   - Test Wishlist API Module: Get wishlist, add/remove items, move to cart, sync on login
   - Test Search API Module: Search products with query, apply faceted filters, get suggestions
   - Document any failures or unexpected behavior

2. **Verify Type Safety Across All Modules**
   - Ensure all API methods have proper TypeScript types defined
   - Verify request parameter types are strictly typed (no 'any' types)
   - Check response types match expected interfaces
   - Validate generic types for paginated responses (PaginatedResponse<Product>)
   - Test type inference works correctly (IDE autocomplete)
   - Verify union types for status fields (OrderStatus, PaymentStatus)
   - Check optional vs. required fields are correctly defined
   - Ensure type guards are implemented where needed (isProduct, isOrder, etc.)

3. **Test Error Handling for Each Endpoint**
   - Test 400 Bad Request errors (invalid parameters)
   - Test 401 Unauthorized errors (missing/expired token)
   - Test 403 Forbidden errors (insufficient permissions)
   - Test 404 Not Found errors (product/order doesn't exist)
   - Test 409 Conflict errors (duplicate review, cart conflicts)
   - Test 429 Rate Limit errors (too many requests)
   - Test 500 Internal Server errors (server issues)
   - Test network errors (offline, timeout)
   - Verify error messages are user-friendly and localized
   - Check error logging captures necessary details
   - Ensure errors don't expose sensitive information

4. **Verify Authentication Flow End-to-End**
   - Test user registration with email/phone validation (+94 format)
   - Test login with credentials (email/username + password)
   - Verify token storage in secure location (localStorage/sessionStorage)
   - Test token refresh logic before expiration
   - Verify token inclusion in authenticated requests (Authorization header)
   - Test logout clears tokens and auth state
   - Verify 401 handling redirects to login
   - Test guest-to-user transition (cart/wishlist migration)
   - Check multi-tab synchronization of auth state
   - Verify "remember me" functionality if implemented

5. **Test Retry Logic with Network Failures**
   - Simulate network offline scenarios (disable internet)
   - Verify automatic retry for failed requests (with exponential backoff)
   - Test retry limits (max 3 retries by default)
   - Check requests are not retried for 4xx errors (except 408, 429)
   - Verify POST/PUT/DELETE requests use idempotency where appropriate
   - Test timeout handling (request timeout after 30s)
   - Check network recovery auto-resumes pending requests
   - Verify user feedback during retry attempts (loading indicators)
   - Test offline queue for critical operations
   - Ensure data consistency after network recovery

6. **Validate Cart Operations Workflow**
   - Test add to cart for simple product (no variants)
   - Test add to cart for product with variants (size, color)
   - Verify cart persistence for guest users (localStorage)
   - Test cart sync for authenticated users (backend storage)
   - Verify cart migration on login (guest → user)
   - Test update quantity with inventory validation
   - Test remove item from cart
   - Verify cart totals calculation (subtotal, discount, tax, total in LKR)
   - Test coupon code application and removal
   - Check cart expiration handling (old items, price changes)
   - Verify cart clearing functionality

7. **Test Checkout Complete Flow**
   - Start checkout from cart (initiate checkout session)
   - Step 1: Verify cart items and totals
   - Step 2: Add/select shipping address (validate Sri Lankan format with district/province)
   - Verify shipping calculation for selected zone
   - Step 3: Select payment method (PayHere/Stripe/Bank/COD)
   - Verify payment method availability rules
   - Step 4: Review order summary (all costs in LKR)
   - Verify terms acceptance requirement
   - Step 5: Submit order with idempotency key
   - Verify order creation and order number generation (ORD-YYYYMMDD-XXXX)
   - Check cart clearing after successful order
   - Verify confirmation email/notification
   - Test checkout error recovery (inventory out during checkout)

8. **Verify Multi-Tenant Support (If Applicable)**
   - Test tenant identification from domain or header
   - Verify tenant isolation (cannot access other tenant's data)
   - Test tenant-specific configuration loading
   - Verify tenant-specific product catalog
   - Check tenant-specific pricing and currency (all LKR for Sri Lankan tenants)
   - Test tenant-specific payment gateways
   - Verify tenant-specific email templates
   - Check tenant-specific branding/theme application
   - Test cross-tenant operations are blocked

9. **Check Performance Metrics**
   - Measure API response times (target < 500ms for most endpoints)
   - Test caching effectiveness (product details, categories cached)
   - Verify cache invalidation works correctly (after updates)
   - Check lazy loading for large lists (pagination, infinite scroll)
   - Test concurrent request handling (multiple products loading)
   - Measure bundle size of API client module
   - Verify tree-shaking removes unused code
   - Test memory usage (check for memory leaks)
   - Benchmark search performance with large result sets
   - Check database query optimization (n+1 query issues)

10. **Verify Sri Lankan Localization Throughout**
    - Verify currency formatting uses LKR or රු symbol
    - Check price formatting: රු 1,234.56 format
    - Validate phone numbers enforce +94 XX XXX XXXX format
    - Test district validation against 25 Sri Lankan districts
    - Verify province validation against 9 provinces
    - Check timezone is Asia/Colombo for all timestamps
    - Verify language support (en/si/ta) where applicable
    - Test address formatting uses Sri Lankan style
    - Check VAT calculation uses 8% rate (where applicable)
    - Verify shipping zones use Sri Lankan geography
    - Test payment gateways include PayHere (local gateway)
    - Check date/time formatting uses en-LK locale

11. **Test Request and Response Interceptors**
    - Verify request interceptor adds authentication token
    - Check request interceptor adds tenant identifier if needed
    - Test request interceptor adds correlation ID for tracing
    - Verify response interceptor handles token refresh
    - Check response interceptor normalizes error responses
    - Test response interceptor logs errors appropriately
    - Verify response interceptor updates loading states
    - Check response interceptor triggers global error handlers
    - Test interceptor chaining works correctly
    - Verify interceptor error handling doesn't break request flow

12. **Validate Data Consistency and State Management**
    - Test cart quantity matches inventory availability
    - Verify order totals match checkout summary
    - Check product prices are consistent across modules
    - Test user profile data consistency (same across calls)
    - Verify wishlist state syncs across devices (auth users)
    - Check cart state syncs across tabs (auth users)
    - Test optimistic updates with rollback on failure
    - Verify event-driven updates propagate correctly
    - Check data refresh intervals are appropriate
    - Test stale data handling (show "outdated" indicator)

13. **Test Edge Cases and Boundary Conditions**
    - Test empty cart checkout (should prevent)
    - Test ordering out-of-stock item (should prevent)
    - Test maximum cart quantity per item (e.g., 99)
    - Test maximum cart items (e.g., 100 items)
    - Test very long product names (truncation)
    - Test special characters in search queries
    - Test maximum wishlist size if limited
    - Test expired checkout sessions (30 min timeout)
    - Test concurrent cart updates (race conditions)
    - Test extremely large order values (pricing overflow)
    - Test minimum order value requirements
    - Test free shipping threshold calculations

14. **Document Integration Test Results**
    - Create comprehensive test report with pass/fail for each test
    - Document any bugs discovered during testing
    - Note performance bottlenecks identified
    - Record API response times for all endpoints
    - Document error handling gaps
    - List recommended improvements or optimizations
    - Note Sri Lankan localization compliance status
    - Document type safety validation results
    - Create integration test checklist for future use
    - Prepare handoff documentation for next phase (State Management)

### Expected Outcome

After completing this task, the following will be achieved:

- All individual API modules tested and verified functional
- Type safety confirmed across all modules with proper TypeScript typing
- Error handling validated for all error scenarios (4xx, 5xx, network)
- Authentication flow verified end-to-end with token management
- Retry logic tested with network failure simulation
- Complete cart workflow validated (add, update, remove, checkout)
- Full checkout flow tested from cart to order confirmation
- Multi-tenant support verified (if applicable)
- Performance metrics documented with response times and caching effectiveness
- Sri Lankan localization validated throughout (LKR, +94 phone, districts, VAT)
- Request/response interceptors verified working correctly
- Data consistency validated across modules and operations
- Edge cases and boundary conditions tested
- Comprehensive integration test report documenting results
- API client ready for state management integration (Group-E)

### Verification Checklist

- [ ] All API modules (Products, Categories, Cart, Inventory, Checkout, Customer, Orders, Reviews, Wishlist, Search) tested individually
- [ ] Type safety verified with strict TypeScript compilation and no 'any' types
- [ ] Error handling tested for all HTTP status codes (400, 401, 403, 404, 409, 429, 500) and network errors
- [ ] Authentication flow works end-to-end with token storage, refresh, and logout
- [ ] Retry logic functions correctly with exponential backoff and retry limits
- [ ] Cart operations workflow validated (add, update, remove, sync, migrate)
- [ ] Complete checkout flow tested from initiation to order confirmation
- [ ] Multi-tenant support verified with proper isolation (if applicable)
- [ ] Performance metrics meet targets (< 500ms response times, effective caching)
- [ ] Sri Lankan localization validated (LKR formatting රු 1,234.56, +94 XX XXX XXXX phone, 25 districts, 9 provinces, Asia/Colombo timezone, 8% VAT)
- [ ] Request/response interceptors add required headers and handle token refresh
- [ ] Data consistency maintained across modules (cart totals, order summaries, profile data)
- [ ] Edge cases handled gracefully (empty cart, out of stock, max quantities, expired sessions)
- [ ] Integration test report completed with results and recommendations

---

## Summary and Next Steps

### Completed Tasks Overview

This document covered **seven critical tasks (Tasks 54-60)** that extend the webstore API client with comprehensive e-commerce functionality:

**Task 54: Checkout API Module** - Implemented complete multi-step checkout flow with shipping address management, payment method selection (PayHere, Stripe, Bank Transfer, COD), shipping calculation for 25 Sri Lankan districts, order summary generation with VAT (8%), checkout validation, progress tracking, and idempotent order submission.

**Task 55: Customer/User API Module** - Developed customer profile management with CRUD operations, Sri Lankan phone number validation (+94 XX XXX XXXX), address book management with district/province validation, customer preferences (language en/si/ta, timezone Asia/Colombo), and notification settings.

**Task 56: Orders API Module** - Created order lifecycle management with listing, filtering, and sorting capabilities, detailed order retrieval, real-time tracking, cancellation with refund handling, return request processing, reorder functionality, and invoice generation with LKR formatting.

**Task 57: Reviews & Ratings API Module** - Built product review system with CRUD operations, rating aggregation, verified purchase badges, helpful voting system, review filtering and sorting, and validation rules (one review per product per customer).

**Task 58: Wishlist API Module** - Implemented wishlist functionality with cross-device sync for authenticated users, localStorage for guests, guest-to-user migration on login, move to cart capability, back-in-stock notifications, and wishlist value calculation in LKR.

**Task 59: Search & Filters API Module** - Developed advanced search with faceted filtering (categories, brands, price ranges in LKR, ratings, availability), autocomplete suggestions, search history tracking for authenticated and guest users, and search analytics.

**Task 60: Verify API Client Integration** - Conducted comprehensive integration testing of all API modules, validating type safety, error handling, authentication flow, retry logic, performance metrics, Sri Lankan localization compliance, and complete end-to-end workflows (cart to order).

### Key Deliverables

**API Client Modules:**
- Checkout API Module with multi-step flow management
- Customer/User API Module with profile and address management
- Orders API Module with complete lifecycle support
- Reviews & Ratings API Module with aggregation and voting
- Wishlist API Module with cross-device synchronization
- Search & Filters API Module with faceted search capabilities
- Comprehensive integration verification

**Type Safety:**
- Strict TypeScript interfaces for all data structures
- Type-safe request parameters and query params
- Properly typed API responses with generics
- Type guards and validation utilities

**Sri Lankan Localization:**
- Currency formatting in LKR with රු symbol (රු 1,234.56)
- Phone number validation and formatting (+94 XX XXX XXXX)
- Address validation (25 districts, 9 provinces)
- Timezone standardization (Asia/Colombo)
- VAT calculation (8% rate)
- Payment gateway integration (PayHere for local payments)
- Shipping zone calculations for Sri Lankan geography

**Utilities and Helpers:**
- Validation utilities (phone, address, price ranges, ratings)
- Formatting utilities (currency, dates, addresses, phone numbers)
- Status utilities (order status, payment status, checkout progress)
- Action utilities (can cancel, can return, can reorder, can review)
- Aggregation utilities (rating distribution, wishlist value, order totals)
- Search utilities (highlighting, facet generation, history management)

### Integration Points

The API modules work together to provide seamless e-commerce functionality:

1. **Products → Cart → Checkout → Orders:** Products browsed are added to cart, cart proceeds to checkout with address/payment selection, checkout submits order, order appears in order history with tracking.

2. **Authentication → Cart/Wishlist Migration:** Guest users browse and add to cart/wishlist using localStorage, upon login cart and wishlist migrate to backend storage and sync across devices.

3. **Orders → Reviews:** After order delivery, customers can write reviews for purchased products with verified purchase badges, reviews include rating and optional images.

4. **Search → Products → Wishlist/Cart:** Search helps discover products with filters, products can be added to wishlist for later or cart for immediate purchase.

5. **Customer → Checkout:** Customer profile stores addresses and payment methods, checkout uses saved addresses/payment methods for faster processing.

6. **Inventory → Cart → Checkout:** Inventory module validates availability when adding to cart and during checkout, prevents ordering out-of-stock items.

### Performance Considerations

**Caching Strategy:**
- Cache product details, categories, and static content with appropriate TTL
- Implement cache invalidation after updates (product changes, inventory updates)
- Use optimistic updates for cart operations with rollback on failure
- Cache user profile and preferences with short TTL

**Request Optimization:**
- Implement request debouncing for search autocomplete (300ms delay)
- Use pagination for large lists (orders, reviews, search results)
- Implement lazy loading for product images and media
- Batch related requests where possible (product + inventory + reviews)
- Use server-side filtering and sorting instead of client-side where possible

**Loading States:**
- Implement skeleton screens for initial loads
- Show loading indicators during operations
- Provide optimistic UI updates with rollback on error
- Cache recently viewed items for instant display

**Bundle Size:**
- Ensure tree-shaking removes unused API modules
- Consider code splitting for rarely-used modules
- Minimize dependencies in API client
- Use lightweight HTTP client library

### Security Measures

**Authentication:**
- Store tokens securely (HttpOnly cookies preferred over localStorage)
- Implement automatic token refresh before expiration
- Clear tokens completely on logout
- Validate token on each authenticated request

**Data Validation:**
- Validate all user inputs client-side before sending
- Sanitize search queries and user-generated content
- Validate file uploads (type, size) before sending
- Implement rate limiting on client side to prevent abuse

**Sensitive Data:**
- Never log sensitive information (tokens, passwords, payment details)
- Mask payment card numbers (show last 4 digits only)
- Use HTTPS for all API communications
- Implement CSRF protection for state-changing operations

**Error Handling:**
- Don't expose internal error details to users
- Log detailed errors for debugging but show friendly messages
- Handle authentication errors gracefully (redirect to login)
- Implement proper error boundaries

### Testing Recommendations

**Unit Testing:**
- Test each API module method individually with mocked HTTP client
- Test all validation utilities with various inputs (valid, invalid, edge cases)
- Test formatting utilities for correct output
- Test error handling for each error scenario
- Aim for 80%+ code coverage

**Integration Testing:**
- Test complete workflows (search → product → cart → checkout → order)
- Test authentication flow with token management
- Test cart/wishlist migration on login
- Test error recovery scenarios
- Test network failure handling with retry logic

**End-to-End Testing:**
- Automate critical user journeys (guest purchase, authenticated reorder)
- Test across different browsers and devices
- Test offline/online transitions
- Test concurrent operations (multiple tabs)
- Include Sri Lankan localization validation in all tests

**Performance Testing:**
- Load test API endpoints for response times
- Stress test with large carts and orders
- Test caching effectiveness
- Benchmark search with large datasets
- Test memory usage and potential leaks

**Accessibility Testing:**
- Ensure loading states are announced to screen readers
- Validate error messages are accessible
- Test keyboard navigation through forms
- Check color contrast for status indicators

### Next Steps: Proceed to Group-E State Management

With the API client fully implemented and verified, the next phase focuses on **State Management** for the webstore frontend:

**Group-E: Store State Management (Tasks 61-70)**
- Task 61-63: State store architecture and configuration (Zustand/Pinia/Redux)
- Task 64: Products and categories state management
- Task 65: Cart state management with persistence
- Task 66: Checkout state management with multi-step flow
- Task 67: User and authentication state management
- Task 68: Orders and wishlist state management
- Task 69: UI state management (modals, toasts, loading)
- Task 70: State integration with API client and verification

**Integration with API Client:**
- State stores will consume API client modules (Tasks 47-59)
- API methods will be wrapped in state actions/mutations
- Loading and error states will be managed in stores
- Cache management will be implemented in state layer
- Optimistic updates will be coordinated through state

**Key Focus Areas:**
- Centralized state management for predictable data flow
- Reactive state updates for UI synchronization
- State persistence (cart, wishlist, auth tokens)
- State hydration on app initialization
- Dev tools integration for debugging
- TypeScript strict mode for type safety
- Performance optimization (selectors, memoization)

**Preparation:**
- Review state management library documentation (Zustand for React, Pinia for Vue, Redux Toolkit for React)
- Understand reactive programming concepts
- Review API client interfaces for state shape design
- Plan state normalization strategy for relational data
- Consider state composition patterns (nested vs. flat)

**Documentation Reference:**
- **Previous:** [Group-D Doc 01 - Tasks 47-53: Client Core Modules](01_Tasks-47-53_Client-Core-Modules.md)
- **Current:** Group-D Doc 02 - Tasks 54-60: Extended API Modules (this document)
- **Next:** [Group-E Doc 01 - Tasks 61-70: State Stores](../Group-E_Store-State-Management/01_Tasks-61-70_State-Stores.md)

---

**Document Status:** Complete  
**Ready for Implementation:** Yes  
**Estimated Implementation Time:** 11 hours for all tasks (54-60)  
**Prerequisites:** Tasks 47-53 completed (API Client Foundation)  
**Next Document:** Group-E Doc 01 - State Stores

---

*This document is part of Phase-08: Webstore & E-Commerce Platform*  
*For questions or clarifications, refer to the Phase-08 overview documentation*
