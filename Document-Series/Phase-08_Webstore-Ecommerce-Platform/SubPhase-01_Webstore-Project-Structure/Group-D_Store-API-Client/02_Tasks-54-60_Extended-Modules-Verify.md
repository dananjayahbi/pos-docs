# Phase-08 SubPhase-01 Group-D Document 02
**Tasks 54-60: Extended API Modules & Verification**

---

## Document Metadata
- **Phase:** 08 - Webstore & E-Commerce Platform
- **SubPhase:** 01 - Webstore Project Structure
- **Group:** D - Store API Client
- **Document:** 02 of 02
- **Tasks Covered:** 54-60
- **Focus:** Extended API Modules & Integration Verification

## Navigation
- **Parent:** [Group-D Overview](00_GROUP_OVERVIEW.md)
- **Previous Document:** [Group-D Doc 01](01_Tasks-47-53_Client-Core-Modules.md)
- **Next Document:** [Group-E Doc 01](../Group-E_Store-State-Management/01_Tasks-61-70_State-Stores.md)

---

## Document Overview

This document covers extended API modules for checkout, customer management, orders, reviews, wishlist, search capabilities, and comprehensive integration verification ensuring all modules work seamlessly together.

### Tasks Summary

| Task | Name | Dependencies | Est. Time | Complexity |
|------|------|--------------|-----------|------------|
| 54 | Checkout API Module | Tasks 47-53 | 2 hrs | Medium |
| 55 | Customer/User API Module | Tasks 47-54 | 1.5 hrs | Medium |
| 56 | Orders API Module | Tasks 47-55 | 2 hrs | Medium |
| 57 | Reviews & Ratings API Module | Tasks 47-56 | 1.5 hrs | Low |
| 58 | Wishlist API Module | Tasks 47-57 | 1 hr | Low |
| 59 | Search & Filters API Module | Tasks 47-58 | 2 hrs | Medium |
| 60 | Verify API Client Integration | Tasks 47-59 | 1 hr | Low |

---

## Task 54: Checkout API Module

### Overview
Manages complete checkout process from cart to order submission with shipping address validation, payment method selection (PayHere, Stripe, Bank Transfer, COD), shipping calculation for Sri Lankan delivery zones, and order summary generation with VAT.

### Dependencies
- Tasks 47-53 (API Client, Auth, Products, Categories, Cart)

### Instructions

1. **Create Type Definitions**
   - Define Checkout interface (id, user_id, cart_id, current_step, shipping_address, billing_address, payment_method, shipping_method, order_summary, created_at, updated_at)
   - Define ShippingAddress (full_name, phone +94 format, address lines, city, district, province, postal_code, country LK, is_default, address_type)
   - Define PaymentMethod (type: payhere/stripe/bank_transfer/cod, card details, bank info)
   - Define ShippingMethod (name, code, price LKR, estimated_days, available_zones)
   - Define OrderSummary (subtotal, discount, shipping, tax 8%, total in LKR, item_count)

2. **Create Query Parameters**
   - Define CheckoutQueryParams (expand options for shipping, payment, addresses)
   - Define UpdateCheckoutParams (step, address_id, payment_id, shipping_id, billing_same_as_shipping, notes)

3. **Implement Checkout Initiation**
   - Create initiateCheckout method (POST /api/v1/checkout)
   - Accept cart_id, create new checkout session
   - Return Checkout object with initial step
   - Handle errors (empty cart, invalid items, out of stock)

4. **Implement Shipping Address Methods**
   - Create updateShippingAddress method (PUT /api/v1/checkout/:id/shipping-address)
   - Validate Sri Lankan address format (25 districts, 9 provinces, postal code)
   - Recalculate shipping options based on address
   - Return updated Checkout with shipping options

5. **Implement Payment Method Selection**
   - Create updatePaymentMethod method (PUT /api/v1/checkout/:id/payment-method)
   - Support PayHere, Stripe, bank transfer, COD
   - Validate payment method availability for zone and amount
   - Return updated Checkout

6. **Implement Shipping Calculation**
   - Create getShippingOptions method
   - Define zones (Colombo Metro, Western Province, Other Provinces, Remote Areas)
   - Calculate shipping cost based on weight, dimensions, zone, district
   - Estimate delivery dates (1-2 days Colombo, 2-4 Western, 3-7 other)
   - Apply free shipping rules if applicable

7. **Implement Shipping Method Application**
   - Create applyShippingMethod (PUT /api/v1/checkout/:id/shipping-method)
   - Validate method availability for address
   - Recalculate order summary with shipping cost
   - Update estimated delivery date

8. **Implement Order Summary Generation**
   - Create getOrderSummary method
   - Calculate subtotal from current prices
   - Apply discount codes and promotions
   - Calculate shipping cost
   - Calculate VAT 8% per Sri Lankan tax rules
   - Generate total in LKR with proper formatting (රු 15,450.00)

9. **Implement Checkout Validation**
   - Create validateCheckout method
   - Check shipping address complete and valid
   - Check payment method selected and valid
   - Verify inventory availability for all items
   - Confirm prices haven't changed
   - Validate shipping method available
   - Check terms acceptance
   - Return validation results with error messages

10. **Implement Progress Tracking**
    - Create updateCheckoutStep method
    - Track steps: 1 cart, 2 shipping, 3 payment, 4 review, 5 confirmation
    - Validate required data before progressing
    - Store step completion timestamps
    - Allow backward navigation only
    - Implement getCheckoutProgress utility

11. **Implement Order Submission**
    - Create submitOrder method (POST /api/v1/checkout/:id/submit)
    - Implement idempotency using idempotency_key
    - Perform final validation
    - Handle payment processing if online payment
    - Clear cart on success
    - Return Order object with order_number
    - Handle errors (payment failure, insufficient inventory, timeout)

12. **Add Payment Integration**
    - Create initializePayHerePayment utility
    - Create initializeStripePayment utility
    - Implement handlePaymentCallback for gateway responses
    - Add verifyPaymentStatus method
    - Handle payment timeouts (auto-cancel after X minutes)
    - Support payment retry for failed transactions

13. **Implement Error Handling**
    - Handle checkout expiration (30 min timeout)
    - Implement resumeCheckout for expired sessions
    - Handle inventory changes during checkout
    - Add price protection logic
    - Implement graceful degradation for shipping calculation failures
    - Add retry logic for transient API failures

14. **Create Checkout Utilities**
    - Implement formatShippingAddress for Sri Lankan display
    - Create getCheckoutStepName with localization (en/si/ta)
    - Implement canProceedToNextStep validation
    - Add calculateDeliveryDate utility
    - Create getPaymentMethodIcon utility
    - Implement formatOrderSummary with LKR formatting

### Expected Outcome
- Complete checkout module with multi-step flow
- Type-safe checkout operations
- Shipping address management with Sri Lankan validation
- Multiple payment gateways supported
- Intelligent shipping calculation for 25 districts
- Real-time order summary with VAT
- Comprehensive validation
- Idempotent order submission
- Payment integration utilities
- Full Sri Lankan localization

### Verification Checklist
- [ ] Checkout types defined with all fields
- [ ] Checkout initiation creates valid session
- [ ] Shipping address validation enforces Sri Lankan format
- [ ] Payment selection supports PayHere, Stripe, Bank, COD
- [ ] Shipping calculation handles all zones correctly
- [ ] Order summary calculates VAT 8% and totals in LKR
- [ ] Checkout validation performs all checks
- [ ] Progress tracking prevents skipping steps
- [ ] Order submission implements idempotency
- [ ] Payment integration initializes correctly
- [ ] Error handling manages edge cases gracefully
- [ ] Utilities format data with Sri Lankan localization

---

## Task 55: Customer/User API Module

### Overview
Manages authenticated user profiles, personal information, saved addresses, and preferences with Sri Lankan localization including phone formatting (+94), language support (en/si/ta), and proper address formatting with district and province.

### Dependencies
- Tasks 47-54 (API Client, Auth, Checkout for address types)

### Instructions

1. **Create Type Definitions**
   - Define Customer interface (id, email, phone +94, username, first_name, last_name, date_of_birth, gender, avatar_url, is_verified)
   - Define UserProfile extending Customer (preferences, addresses, statistics, created_at, updated_at)
   - Define Address interface with Sri Lankan fields
   - Define CustomerPreferences (language en/si/ta, currency LKR, timezone Asia/Colombo, notifications, marketing_consent)
   - Define NotificationSettings (order_updates, promotions, newsletters, wishlist_reminders, back_in_stock)

2. **Create Parameter Interfaces**
   - Define UpdateProfileParams (optional first_name, last_name, phone, date_of_birth, gender)
   - Define AddAddressParams (all required Sri Lankan address fields)
   - Define UpdateAddressParams (optional fields)
   - Define UpdatePreferencesParams (optional preference fields)

3. **Implement Get Current User**
   - Create getCurrentUser method (GET /api/v1/customer/me)
   - Return UserProfile with complete data
   - Include address book and preferences
   - Handle unauthenticated requests (return null)
   - Cache profile with appropriate TTL

4. **Implement Profile Update**
   - Create updateProfile method (PUT /api/v1/customer/me)
   - Validate phone format (+94 XX XXX XXXX)
   - Validate date_of_birth (18+ years)
   - Return updated UserProfile
   - Clear cached profile after update

5. **Implement Get Addresses**
   - Create getAddresses method (GET /api/v1/customer/me/addresses)
   - Return array sorted by default first
   - Filter by type (all/shipping/billing)
   - Include validation status

6. **Implement Add Address**
   - Create addAddress method (POST /api/v1/customer/me/addresses)
   - Validate completeness
   - Validate district against 25 districts
   - Validate province against 9 provinces
   - Format postal code for Sri Lanka
   - Return created Address

7. **Implement Update Address**
   - Create updateAddress (PUT /api/v1/customer/me/addresses/:id)
   - Validate ownership
   - Apply same validations as add
   - Return updated Address

8. **Implement Delete Address**
   - Create deleteAddress (DELETE /api/v1/customer/me/addresses/:id)
   - Prevent deletion of default without replacement
   - Check if used in pending orders
   - Return success status

9. **Implement Set Default Address**
    - Create setDefaultAddress (PUT /api/v1/customer/me/addresses/:id/set-default)
    - Accept type (shipping/billing)
    - Validate ownership
    - Return updated Address with is_default flag

10. **Implement Preference Management**
    - Create updatePreferences (PUT /api/v1/customer/me/preferences)
    - Validate language (en/si/ta)
    - Ensure currency is LKR
    - Validate timezone Asia/Colombo
    - Trigger locale change event

11. **Add Validation Utilities**
    - Create validatePhoneNumber (+94 XX XXX XXXX, operators 70-78)
    - Implement formatPhoneNumber utility
    - Create validateDistrict utility
    - Implement validateProvince utility
    - Add validatePostalCode (5 digits)
    - Create isProfileComplete utility

12. **Implement Address Formatting**
    - Create formatAddressForDisplay (multi-line Sri Lankan style)
    - Implement formatAddressForShipping (label format)
    - Add formatAddressSingleLine (compact)
    - Create getDistrictProvince utility
    - Implement getAddressType with localization

13. **Add Account Utilities**
    - Create getFullName utility
    - Implement getInitials for avatar
    - Add formatCustomerDisplay utility
    - Create getAccountAge utility
    - Implement getCustomerTier (Bronze/Silver/Gold/Platinum)
    - Add hasCompleteProfile utility

14. **Implement Notification Preferences**
    - Create updateNotificationSettings method
    - Implement toggleNotification utility
    - Add getEnabledNotifications utility
    - Create shouldNotify utility
    - Handle email/phone verification requirements

### Expected Outcome
- Complete customer API module
- Type-safe customer operations
- Profile update with +94 phone validation
- Comprehensive address book management
- Address validation for 25 districts, 9 provinces
- Customer preferences (language, timezone)
- Phone and address formatting utilities
- Account utilities for display
- Sri Lankan localization throughout

### Verification Checklist
- [ ] Customer types defined
- [ ] getCurrentUser retrieves profile
- [ ] Profile update validates +94 phone format
- [ ] Address CRUD works correctly
- [ ] Address validation enforces 25 districts, 9 provinces
- [ ] Default address management prevents invalid ops
- [ ] Preferences support en/si/ta and Asia/Colombo
- [ ] Phone validation checks operator codes 70-78
- [ ] Address formatting uses Sri Lankan format
- [ ] Account utilities work correctly
- [ ] Notification preferences update granularly
- [ ] All validations respect Sri Lankan requirements

---

## Task 56: Orders API Module

### Overview
Manages complete order lifecycle from creation to fulfillment, providing order listing, tracking, cancellation, return requests, and reordering with Sri Lankan-specific features like LKR currency, local delivery tracking, and invoice generation.

### Dependencies
- Tasks 47-55 (API Client, Auth, Checkout, Customer)

### Instructions

1. **Create Type Definitions**
   - Define Order interface (id, order_number ORD-YYYYMMDD-XXXX, user_id, status, order_date, items, amounts in LKR, addresses, payment_method, payment_status, tracking_info, created_at, updated_at)
   - Define OrderItem (id, order_id, product_id, product_name, sku, variant_id, quantity, unit_price, line_total in LKR, thumbnail_url)
   - Define OrderStatus enum (PENDING, PAYMENT_PENDING, CONFIRMED, PROCESSING, READY_TO_SHIP, SHIPPED, OUT_FOR_DELIVERY, DELIVERED, CANCELLED, RETURN_REQUESTED, RETURNED, REFUNDED)
   - Define OrderTracking (status, status_label, timestamp, location, courier_name, tracking_number, estimated_delivery)
   - Define PaymentStatus enum (PENDING, AUTHORIZED, PAID, FAILED, REFUNDED, PARTIALLY_REFUNDED)

2. **Create Query Parameters**
   - Define OrderQueryParams (status filter, date_range, search, sort, page, limit)
   - Define OrderDetailParams (expand: items, tracking, invoices, returns)
   - Define CancelOrderParams (cancellation_reason, notes)
   - Define ReturnRequestParams (order_item_ids, return_reason, return_type refund/exchange, description, images)

3. **Implement List Orders**
   - Create listOrders method (GET /api/v1/customer/orders)
   - Support filtering by status, date range
   - Support search by order number or product name
   - Implement sorting (date desc/asc, total desc/asc)
   - Return paginated orders with metadata

4. **Implement Get Order By ID**
   - Create getOrderById (GET /api/v1/customer/orders/:id)
   - Return detailed Order with all fields
   - Include expanded items with product details
   - Include tracking information
   - Validate ownership

5. **Implement Get Order By Number**
   - Create getOrderByNumber (GET /api/v1/customer/orders/by-number/:number)
   - Format: ORD-YYYYMMDD-XXXX
   - Return detailed Order
   - Allow guest lookup with email verification

6. **Implement Track Order**
   - Create trackOrder (GET /api/v1/customer/orders/:id/tracking)
   - Return OrderTracking array sorted by timestamp
   - Include current status and estimated delivery
   - Show courier information for shipped orders
   - Format timestamps in Asia/Colombo timezone
   - Support public tracking

7. **Implement Order Cancellation**
   - Create cancelOrder (POST /api/v1/customer/orders/:id/cancel)
   - Validate cancellation allowed (before READY_TO_SHIP)
   - Handle payment refund initiation
   - Return updated Order with CANCELLED status
   - Include refund timeline (5-7 business days)

8. **Implement Return Request**
   - Create requestReturn (POST /api/v1/customer/orders/:id/return)
   - Validate eligibility (DELIVERED, within 7-14 days)
   - Support full or partial return
   - Require return reason
   - Upload return images
   - Return updated Order with RETURN_REQUESTED
   - Provide return shipping instructions

9. **Implement Reorder**
   - Create reorder method (POST /api/v1/customer/orders/:id/reorder)
   - Fetch original order items
   - Validate availability
   - Add available items to cart with current prices
   - Handle unavailable items gracefully
   - Show price comparison if changed

10. **Implement Status Tracking Utilities**
    - Create getOrderStatus utility
    - Implement getOrderStatusLabel (en/si/ta)
    - Add getOrderStatusColor for UI
    - Create isOrderActive utility
    - Implement getNextStatus utility
    - Add getStatusProgress (0-100%)

11. **Implement Order Action Utilities**
    - Create canCancelOrder utility
    - Implement canReturnOrder (7-14 day window)
    - Add isReorderable utility
    - Create hasTracking utility
    - Implement canDownloadInvoice utility
    - Add getRefundTimeline utility

12. **Implement Order Details Utilities**
    - Create getOrderTotal (LKR formatting රු 12,456.78)
    - Implement getOrderItems utility
    - Add getOrderItemsCount utility
    - Create formatOrderDate (Asia/Colombo)
    - Implement getPaymentMethodDisplay utility
    - Add getShippingMethodDisplay utility

13. **Implement Invoice Methods**
    - Create downloadInvoice (GET /api/v1/customer/orders/:id/invoice)
    - Return PDF URL or base64 data
    - Format per Sri Lankan business requirements
    - Include VAT if applicable
    - Implement downloadReceipt for payment receipt
    - Support email invoice sending

14. **Implement Order History Utilities**
    - Create filterOrdersByStatus utility
    - Implement filterOrdersByDateRange utility
    - Add sortOrders utility
    - Create searchOrders utility
    - Implement groupOrdersByMonth utility
    - Add getRecentOrders utility

### Expected Outcome
- Complete orders API module
- Type-safe order operations
- Order listing with filtering and sorting
- Detailed order retrieval
- Real-time tracking with courier info
- Order cancellation with refund handling
- Return request system
- Reorder functionality
- Status tracking utilities with localization
- Order action validation
- Invoice generation with LKR formatting
- Order history management
- Sri Lankan localization throughout

### Verification Checklist
- [ ] Order types defined with LKR amounts
- [ ] listOrders supports filtering and sorting
- [ ] getOrderById/ByNumber retrieve correct details
- [ ] trackOrder returns tracking with Asia/Colombo timezone
- [ ] cancelOrder validates eligibility and processes correctly
- [ ] requestReturn validates 7-14 day window
- [ ] reorder checks availability and uses current prices
- [ ] Status utilities return localized labels (en/si/ta)
- [ ] Action utilities accurately determine permissions
- [ ] Order totals format correctly in LKR with රු
- [ ] Invoice generates proper PDF with Sri Lankan format
- [ ] Order history utilities work with various parameters

---

## Task 57: Reviews & Ratings API Module

### Overview
Enables customers to leave product reviews and ratings with verified purchase badges, helpful voting, rating aggregation, and filtering capabilities enforcing one review per product per customer.

### Dependencies
- Tasks 47-56 (API Client, Auth, Customer, Orders)

### Instructions

1. **Create Type Definitions**
   - Define Review interface (id, product_id, user_id, order_item_id, rating 1-5, title, content, is_verified_purchase, helpful_count, not_helpful_count, images, response, created_at, updated_at)
   - Define Rating type (1-5)
   - Define ReviewStats (average_rating, total_reviews, rating_distribution, verified_purchase_percentage, recommendation_percentage)
   - Define ReviewAuthor (user_id, first_name, last_name, avatar_url, review_count, is_verified_buyer)

2. **Create Parameters**
   - Define ReviewQueryParams (product_id, rating_filter, verified_only, sort, page, limit, include_images_only)
   - Define CreateReviewParams (product_id, order_item_id, rating 1-5, title, content, images, recommend)
   - Define UpdateReviewParams (optional rating, title, content, images)
   - Define VoteParams (review_id, vote_type helpful/not_helpful)

3. **Implement Get Product Reviews**
   - Create getProductReviews (GET /api/v1/products/:id/reviews)
   - Support filtering by rating, verified purchases, images
   - Implement sorting (recent, helpful, rating high/low)
   - Return paginated ReviewWithAuthor array

4. **Implement Get Review Statistics**
   - Create getReviewStats (GET /api/v1/products/:id/reviews/stats)
   - Return ReviewStats with aggregated data
   - Calculate average rating with weighting
   - Generate rating distribution
   - Calculate verified purchase percentage
   - Use cached stats (5 min TTL)

5. **Implement Create Review**
   - Create createReview (POST /api/v1/reviews)
   - Validate authentication
   - Verify product purchased if order_item_id provided
   - Validate rating 1-5, title max 100 chars, content max 1000 chars
   - Validate images max 5
   - Return Review with is_verified_purchase flag

6. **Implement Update Review**
   - Create updateReview (PUT /api/v1/reviews/:id)
   - Validate ownership
   - Check edit window (30 days)
   - Apply same validation as create
   - Mark as edited with updated_at

7. **Implement Delete Review**
   - Create deleteReview (DELETE /api/v1/reviews/:id)
   - Validate ownership
   - Clean up helpful votes

8. **Implement Get My Reviews**
   - Create getMyReviews (GET /api/v1/customer/reviews)
   - Support filtering by product, rating, date
   - Return Review array with product info
   - Sort by most recent

9. **Implement Can Review Check**
   - Create canReview method
   - Check authentication
   - Check existing review (one per product)
   - Optionally check purchase status
   - Return boolean and reason

10. **Implement Helpful Voting**
    - Create markReviewHelpful (POST /api/v1/reviews/:id/vote with type: helpful)
    - Prevent multiple votes from same user
    - Return updated helpful_count
    - Create markReviewNotHelpful (vote_type: not_helpful)
    - Implement removeVote to undo

11. **Implement Validation Utilities**
    - Create validateRating (1-5 integer)
    - Implement validateReviewTitle (length, content)
    - Add validateReviewContent (length, profanity, spam)
    - Create canEditReview (edit window, ownership)
    - Implement hasUserReviewed utility

12. **Implement Aggregation Utilities**
    - Create getAverageRating utility
    - Implement getRatingDistribution for charts
    - Add getRatingPercentage utility
    - Create getReviewCount utility
    - Implement formatRating (★★★★☆ or number)
    - Add getRatingColor (1-2 red, 3 yellow, 4-5 green)

13. **Implement Filtering Utilities**
    - Create filterByRating utility
    - Implement filterByVerifiedPurchase utility
    - Add filterByImages utility
    - Create sortByHelpful utility
    - Implement sortByDate utility
    - Add hasImages utility

14. **Implement Display Utilities**
    - Create formatReviewDate (relative and absolute)
    - Implement truncateReviewContent (preview 200 chars)
    - Add getReviewExcerpt utility
    - Create formatAuthorName (First N. for privacy)
    - Implement getVerifiedBadge utility
    - Add getRecommendedBadge utility

### Expected Outcome
- Complete reviews API module
- Type-safe review operations
- Product review retrieval with filtering
- Review statistics with aggregation
- Review CRUD with verified purchase validation
- My reviews listing
- Can review validation (one per product)
- Helpful voting system
- Review validation utilities
- Rating aggregation utilities
- Review filtering and sorting
- Review display utilities with privacy

### Verification Checklist
- [ ] Review types defined
- [ ] getProductReviews filters and sorts correctly
- [ ] getReviewStats calculates average and distribution
- [ ] createReview validates inputs and marks verified purchases
- [ ] updateReview enforces 30-day edit window
- [ ] deleteReview removes and clears cache
- [ ] getMyReviews returns user's reviews
- [ ] canReview validates one-per-product rule
- [ ] Helpful voting prevents duplicate votes
- [ ] Rating validation ensures 1-5 integers
- [ ] Aggregation utilities calculate correctly
- [ ] Display utilities format appropriately

---

## Task 58: Wishlist API Module

### Overview
Enables customers to save products for future purchase with cross-device sync for authenticated users, localStorage for guests, and automatic migration on login.

### Dependencies
- Tasks 47-57 (API Client, Auth, Products, Cart)

### Instructions

1. **Create Type Definitions**
   - Define Wishlist (id, user_id, items, created_at, updated_at)
   - Define WishlistItem (id, wishlist_id, product_id, product, variant_id, added_at, notification_enabled)
   - Define WishlistSummary (item_count, total_value LKR, available_count, out_of_stock_count)
   - Define LocalWishlist for guest storage (product_ids array, timestamps)

2. **Implement Get Wishlist**
   - Create getWishlist method
   - For authenticated: GET /api/v1/customer/wishlist
   - For guests: retrieve from localStorage 'wishlist'
   - Return Wishlist with full product details
   - Include availability status
   - Sort by most recent first

3. **Implement Add to Wishlist**
   - Create addToWishlist method
   - For authenticated: POST /api/v1/customer/wishlist/items
   - For guests: add to localStorage
   - Prevent duplicates
   - Show confirmation notification

4. **Implement Remove from Wishlist**
   - Create removeFromWishlist method
   - For authenticated: DELETE /api/v1/customer/wishlist/items/:id
   - For guests: remove from localStorage
   - Show removal confirmation with undo

5. **Implement Clear Wishlist**
   - Create clearWishlist method
   - For authenticated: DELETE /api/v1/customer/wishlist
   - For guests: clear localStorage
   - Require confirmation

6. **Implement Move to Cart**
   - Create moveToCart method
   - Check availability and stock
   - Add to cart using Cart API
   - Remove from wishlist after success
   - Handle variants with selector

7. **Implement Check Wishlist Status**
   - Create checkIfInWishlist/isInWishlist method
   - Check against backend or localStorage
   - Return boolean
   - Use for wishlist icon state

8. **Implement Wishlist Sync**
   - Create syncWishlist method (after login)
   - Retrieve guest wishlist from localStorage
   - Merge with backend (POST /api/v1/customer/wishlist/sync)
   - Clear localStorage after sync
   - Show merged count notification

9. **Implement Notification Methods**
   - Create enableNotifications (PUT /api/v1/customer/wishlist/items/:id/notify)
   - Enable back-in-stock alerts for out-of-stock items
   - Create disableNotifications method

10. **Implement Wishlist Count**
    - Create getWishlistCount utility
    - Use backend count for auth, localStorage for guests
    - Cache with short TTL
    - Subscribe to wishlist events
    - Use for navigation badge (♥ 5)

11. **Implement Validation Utilities**
    - Create isInWishlist utility
    - Implement canAddToWishlist utility
    - Add getWishlistLimit utility
    - Create isWishlistFull utility
    - Implement validateWishlistItem utility

12. **Implement Formatting Utilities**
    - Create formatWishlist for display
    - Implement getAvailableItems utility
    - Add getOutOfStockItems utility
    - Create getWishlistValue (total in LKR)
    - Implement sortWishlist utility
    - Add formatWishlistSummary utility

13. **Implement localStorage Management**
    - Create saveWishlistToLocal utility
    - Implement loadWishlistFromLocal utility
    - Add clearWishlistFromLocal utility
    - Create mergeWishlists (remove duplicates)
    - Implement migrateGuestWishlist for post-login
    - Handle localStorage quota exceeded

14. **Implement Product Updates**
    - Create updateWishlistPrices method
    - Detect price drops since addition
    - Detect products on sale
    - Update availability status
    - Show price drop notifications

### Expected Outcome
- Complete wishlist API module
- Type-safe wishlist operations
- Cross-device sync for authenticated users
- Add/remove with duplicate prevention
- Clear with confirmation
- Move to cart with availability check
- Wishlist status checking
- Guest-to-user sync on login
- Back-in-stock notifications
- Wishlist count utility
- Validation utilities
- Formatting utilities
- localStorage management
- Price drop and sale detection
- LKR formatting for wishlist value

### Verification Checklist
- [ ] Wishlist types defined
- [ ] getWishlist retrieves for auth/guest
- [ ] addToWishlist prevents duplicates
- [ ] removeFromWishlist removes correctly
- [ ] clearWishlist clears after confirmation
- [ ] moveToCart checks availability and adds
- [ ] isInWishlist checks accurately
- [ ] syncWishlist merges without duplicates
- [ ] Notification methods enable/disable alerts
- [ ] getWishlistCount returns accurate count
- [ ] Utilities filter available/out-of-stock items
- [ ] localStorage handles storage correctly

---

## Task 59: Search & Filters API Module

### Overview
Provides comprehensive search functionality with faceted filtering, autocomplete suggestions, search history tracking, and result highlighting supporting full-text search across products, categories, and content.

### Dependencies
- Tasks 47-58 (API Client, Auth, Products, Categories)

### Instructions

1. **Create Type Definitions**
   - Define SearchResult (items, total_count, page, page_size, has_more, facets, query, suggestions)
   - Define SearchFilters (categories, brands, price_min/max LKR, rating_min, in_stock_only, on_sale_only, sort_by)
   - Define SearchFacet (field_name, display_name, options with value/label/count)
   - Define SearchSuggestion (text, type product/category/brand, url, highlight)
   - Define SearchHistoryItem (id, query, filters, timestamp, result_count)

2. **Create Parameters**
   - Define SearchParams (query, filters, facets, page, limit, highlight)
   - Define AutocompleteParams (query, limit, types)
   - Define ProductSearchParams extending SearchParams
   - Define CategorySearchParams

3. **Implement Universal Search**
   - Create searchAll method (GET /api/v1/search)
   - Search across products, categories, brands, content
   - Return mixed SearchResult grouped by type
   - Include relevance scoring
   - Support typo tolerance and fuzzy matching
   - Handle empty query (return popular/trending)

4. **Implement Product Search**
   - Create searchProducts (GET /api/v1/search/products)
   - Search names, descriptions, SKUs, brands
   - Apply filters (categories, price LKR, ratings, brands, stock)
   - Return SearchResult with Product objects
   - Include available facets
   - Implement term highlighting

5. **Implement Category Search**
   - Create searchCategories (GET /api/v1/search/categories)
   - Search category names and descriptions
   - Return Category array with product counts

6. **Implement Faceted Search**
   - Create getFacets method
   - Return available facets with option counts
   - Support dynamic facets (change with filters)
   - Generate facets for categories, brands, price ranges LKR, ratings, availability
   - Implement single vs. multi-select behavior

7. **Implement Filter Application**
   - Create applyFilter method
   - Update SearchParams with new filter
   - Re-execute search with updated filters
   - Return new SearchResult with updated facets
   - Create removeFilter and clearAllFilters methods

8. **Implement Autocomplete**
   - Create getSearchSuggestions (GET /api/v1/search/suggestions)
   - Return SearchSuggestion array by relevance
   - Include product, category, brand suggestions
   - Limit suggestions (max 10)
   - Highlight matching portion
   - Include thumbnail images
   - Implement client-side debouncing

9. **Implement Search History**
   - Create saveSearchHistory method
   - For authenticated: POST /api/v1/customer/search-history
   - For guests: localStorage (max 20 recent)
   - Store query, filters, timestamp, result_count
   - Create getSearchHistory (GET for auth, localStorage for guests)
   - Return SearchHistoryItem array

10. **Implement Clear Search History**
    - Create clearSearchHistory method
    - Accept optional search_id for specific entry
    - For authenticated: DELETE /api/v1/customer/search-history
    - For guests: clear from localStorage
    - Implement confirmation dialog

11. **Implement Validation Utilities**
    - Create validateSearchQuery (min 2-3 chars)
    - Implement sanitizeSearchQuery (remove special chars, spaces)
    - Add isPriceRangeValid (min <= max in LKR)
    - Create isRatingValid (1-5)
    - Implement hasActiveFilters utility
    - Add getActiveFilterCount utility

12. **Implement Result Utilities**
    - Create highlightMatches utility
    - Implement formatSearchResults utility
    - Add getSearchFacets utility
    - Create groupResultsByCategory utility
    - Implement extractSearchMetadata utility
    - Add hasMoreResults utility

13. **Implement Facet Utilities**
    - Create formatFacetOptions utility
    - Implement getPriceRangeFacets (0-25K, 25-50K, 50-100K, 100-150K, 150K+)
    - Add getRatingFacets (5★, 4★+, 3★+, All)
    - Create getCategoryFacets (hierarchical)
    - Implement getBrandFacets (alphabetical)
    - Add getAvailabilityFacets (stock status)

14. **Implement Analytics Utilities**
    - Create trackSearch for analytics
    - Implement trackSearchClick for relevance
    - Add getPopularSearches utility
    - Create getRecentSearches utility
    - Implement formatSearchHistory for display
    - Add getSearchSuggestionFromHistory utility

### Expected Outcome
- Complete search and filters API module
- Type-safe search operations
- Universal search across content types
- Product search with comprehensive filtering
- Category search functionality
- Faceted search with dynamic facets
- Filter application and state management
- Autocomplete suggestions with highlighting
- Search history tracking (auth and guest)
- Search validation utilities
- Result formatting utilities
- Facet utilities with LKR price ranges
- Search analytics tracking
- Sri Lankan localization with LKR

### Verification Checklist
- [ ] Search types defined
- [ ] searchAll performs universal search
- [ ] searchProducts applies filters (category, price LKR, rating, brand, stock)
- [ ] Faceted search returns dynamic facets with counts
- [ ] Filter application updates results and facets
- [ ] getSearchSuggestions returns relevant autocomplete
- [ ] Search history saves to backend/localStorage
- [ ] clearSearchHistory removes entries correctly
- [ ] Validation utilities enforce minimum query length
- [ ] highlightMatches marks search terms
- [ ] Price range facets use LKR buckets (0-25K, 25-50K, etc.)
- [ ] Search analytics tracks events and clicks

---

## Task 60: Verify API Client Integration

### Overview
Comprehensive verification of complete API client system ensuring all modules work seamlessly with proper type safety, error handling, authentication flow, retry logic, and Sri Lankan localization through individual module tests and integration workflows.

### Dependencies
- Tasks 47-59 (All API modules)

### Instructions

1. **Test Individual API Modules**
   - Test Products API: fetch lists, get by ID/slug, check variants
   - Test Categories API: fetch tree, get category products, validate hierarchy
   - Test Cart API: add items (guest & auth), update, remove, clear, apply coupons
   - Test Checkout API: initiate, update address, select payment, calculate shipping, submit
   - Test Customer API: get profile, update with +94 validation, manage addresses
   - Test Orders API: list, get details, track, cancel, request return
   - Test Reviews API: get product reviews, create, update, vote
   - Test Wishlist API: get, add/remove, move to cart, sync on login
   - Test Search API: search with query, apply facets, get suggestions
   - Document failures and unexpected behavior

2. **Verify Type Safety**
   - Ensure all methods have proper TypeScript types (no 'any')
   - Verify request parameter types strictly typed
   - Check response types match interfaces
   - Validate generic types for paginated responses
   - Test type inference works (IDE autocomplete)
   - Verify union types for status fields
   - Check optional vs. required fields
   - Ensure type guards implemented

3. **Test Error Handling**
   - Test 400 Bad Request (invalid parameters)
   - Test 401 Unauthorized (missing/expired token)
   - Test 403 Forbidden (insufficient permissions)
   - Test 404 Not Found (resource doesn't exist)
   - Test 409 Conflict (duplicate review, cart conflicts)
   - Test 429 Rate Limit (too many requests)
   - Test 500 Internal Server (server issues)
   - Test network errors (offline, timeout)
   - Verify error messages user-friendly and localized
   - Check error logging captures details
   - Ensure errors don't expose sensitive data

4. **Verify Authentication Flow**
   - Test registration with email/phone validation (+94)
   - Test login with credentials
   - Verify token storage in secure location
   - Test token refresh before expiration
   - Verify token in authenticated requests
   - Test logout clears tokens
   - Verify 401 handling redirects to login
   - Test guest-to-user transition (cart/wishlist migration)
   - Check multi-tab auth synchronization
   - Verify "remember me" functionality

5. **Test Retry Logic**
   - Simulate network offline scenarios
   - Verify automatic retry with exponential backoff
   - Test retry limits (max 3 retries)
   - Check requests not retried for 4xx (except 408, 429)
   - Verify POST/PUT/DELETE use idempotency
   - Test timeout handling (30s timeout)
   - Check network recovery auto-resumes requests
   - Verify user feedback during retries
   - Test offline queue for critical operations
   - Ensure data consistency after recovery

6. **Validate Cart Operations**
   - Test add to cart (simple product, variants)
   - Verify guest cart persistence (localStorage)
   - Test authenticated cart sync (backend)
   - Verify cart migration on login
   - Test update quantity with inventory validation
   - Test remove item
   - Verify totals calculation (subtotal, discount, tax, total LKR)
   - Test coupon application and removal
   - Check cart expiration handling
   - Verify cart clearing

7. **Test Checkout Flow**
   - Start checkout from cart
   - Step 1: Verify cart items and totals
   - Step 2: Add/select shipping address (validate Sri Lankan format)
   - Verify shipping calculation for zone
   - Step 3: Select payment method (PayHere/Stripe/Bank/COD)
   - Verify payment availability rules
   - Step 4: Review order summary (costs in LKR)
   - Verify terms acceptance
   - Step 5: Submit order with idempotency key
   - Verify order creation and number (ORD-YYYYMMDD-XXXX)
   - Check cart clearing after success
   - Verify confirmation notification
   - Test error recovery (inventory out during checkout)

8. **Verify Multi-Tenant Support (If Applicable)**
   - Test tenant identification from domain/header
   - Verify tenant isolation (no cross-tenant data access)
   - Test tenant-specific configuration
   - Verify tenant-specific product catalog
   - Check tenant-specific pricing (all LKR for Sri Lankan)
   - Test tenant-specific payment gateways
   - Verify tenant-specific email templates
   - Check tenant-specific branding
   - Test cross-tenant operations blocked

9. **Check Performance Metrics**
   - Measure API response times (target < 500ms)
   - Test caching effectiveness
   - Verify cache invalidation works
   - Check lazy loading for large lists
   - Test concurrent request handling
   - Measure bundle size of API client
   - Verify tree-shaking removes unused code
   - Test memory usage (check for leaks)
   - Benchmark search with large results
   - Check database query optimization

10. **Verify Sri Lankan Localization**
    - Verify currency uses LKR or රු symbol
    - Check price format: රු 1,234.56
    - Validate phone numbers enforce +94 XX XXX XXXX
    - Test district validation (25 districts)
    - Verify province validation (9 provinces)
    - Check timezone Asia/Colombo for timestamps
    - Verify language support (en/si/ta)
    - Test address formatting (Sri Lankan style)
    - Check VAT calculation (8% rate)
    - Verify shipping zones (Sri Lankan geography)
    - Test payment gateways include PayHere
    - Check date/time formatting (en-LK locale)

11. **Test Request/Response Interceptors**
    - Verify request interceptor adds auth token
    - Check request interceptor adds tenant ID
    - Test request interceptor adds correlation ID
    - Verify response interceptor handles token refresh
    - Check response interceptor normalizes errors
    - Test response interceptor logs errors
    - Verify response interceptor updates loading states
    - Check response interceptor triggers global handlers
    - Test interceptor chaining works
    - Verify interceptor error handling doesn't break flow

12. **Validate Data Consistency**
    - Test cart quantity matches inventory
    - Verify order totals match checkout summary
    - Check product prices consistent across modules
    - Test user profile data consistency
    - Verify wishlist syncs across devices (auth)
    - Check cart syncs across tabs (auth)
    - Test optimistic updates with rollback
    - Verify event-driven updates propagate
    - Check data refresh intervals appropriate
    - Test stale data handling

13. **Test Edge Cases**
    - Test empty cart checkout (should prevent)
    - Test ordering out-of-stock item (should prevent)
    - Test maximum cart quantity per item (99)
    - Test maximum cart items (100 items)
    - Test very long product names (truncation)
    - Test special characters in search
    - Test maximum wishlist size if limited
    - Test expired checkout sessions (30 min)
    - Test concurrent cart updates (race conditions)
    - Test extremely large order values
    - Test minimum order value requirements
    - Test free shipping threshold calculations

14. **Document Integration Results**
    - Create comprehensive test report (pass/fail)
    - Document bugs discovered
    - Note performance bottlenecks
    - Record API response times
    - Document error handling gaps
    - List recommended improvements
    - Note Sri Lankan localization compliance
    - Document type safety validation
    - Create integration test checklist
    - Prepare handoff documentation for next phase

### Expected Outcome
- All API modules tested and verified functional
- Type safety confirmed with proper TypeScript typing
- Error handling validated for all scenarios
- Authentication flow verified end-to-end
- Retry logic tested with network failures
- Complete cart workflow validated
- Full checkout flow tested
- Multi-tenant support verified (if applicable)
- Performance metrics documented
- Sri Lankan localization validated (LKR, +94, districts, VAT)
- Request/response interceptors verified
- Data consistency validated
- Edge cases tested
- Comprehensive integration test report
- API client ready for state management (Group-E)

### Verification Checklist
- [ ] All API modules tested individually
- [ ] Type safety verified (no 'any' types)
- [ ] Error handling tested (all HTTP status codes, network errors)
- [ ] Authentication flow works end-to-end
- [ ] Retry logic functions with exponential backoff
- [ ] Cart operations validated (add, update, remove, sync)
- [ ] Complete checkout flow tested
- [ ] Multi-tenant support verified with isolation (if applicable)
- [ ] Performance metrics meet targets (< 500ms, effective caching)
- [ ] Sri Lankan localization validated (LKR රු 1,234.56, +94 XX XXX XXXX, 25 districts, 9 provinces, Asia/Colombo, 8% VAT)
- [ ] Request/response interceptors work correctly
- [ ] Data consistency maintained across modules
- [ ] Edge cases handled gracefully
- [ ] Integration test report completed

---

## Summary

This document completed **Tasks 54-60**, extending the API client with:

**Task 54:** Checkout API with multi-step flow, Sri Lankan shipping zones, payment gateways (PayHere, Stripe, Bank, COD), and VAT calculation  
**Task 55:** Customer/User API with profile management, +94 phone validation, address book (25 districts, 9 provinces)  
**Task 56:** Orders API with lifecycle management, tracking, cancellation, returns, and LKR invoice generation  
**Task 57:** Reviews API with CRUD operations, verified purchase badges, rating aggregation, and helpful voting  
**Task 58:** Wishlist API with cross-device sync, guest-to-user migration, and back-in-stock notifications  
**Task 59:** Search API with faceted filtering, autocomplete, search history, and LKR price ranges  
**Task 60:** Integration verification validating all modules, type safety, error handling, and Sri Lankan localization

### Key Deliverables

- Six complete API modules with full CRUD operations
- Type-safe interfaces for all data structures
- Comprehensive Sri Lankan localization (LKR රු, +94 phone, 25 districts, 9 provinces, Asia/Colombo, 8% VAT)
- Payment gateway integration (PayHere, Stripe, Bank Transfer, COD)
- Utilities for validation, formatting, and display
- Integration verification with end-to-end workflow testing

### Next Steps: Group-E State Management

Proceed to **[Group-E Doc 01](../Group-E_Store-State-Management/01_Tasks-61-70_State-Stores.md)** to implement state management layer consuming these API modules with reactive updates, persistence, and optimistic UI.

---

**End of Document 02**
