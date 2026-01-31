# Tasks 94-98: Comprehensive Testing

> **Phase:** 08 - Webstore & E-Commerce Platform  
> **SubPhase:** 07 - Checkout Flow  
> **Group:** F - Order Sidebar & Testing  
> **Document:** 02 of 02 (FINAL DOCUMENT OF SUBPHASE)  
> **Tasks Covered:** 94, 95, 96, 97, 98

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-85-93_Sidebar-API.md](01_Tasks-85-93_Sidebar-API.md)
- **→ Next Document:** None (Final Document) | **Next SubPhase:** [SubPhase-08_Customer-Authentication](../../SubPhase-08_Customer-Authentication/)

---

## Document Overview

This document covers comprehensive testing of the entire checkout flow, ensuring all components, interactions, validation logic, and user flows work correctly across different scenarios. Testing includes unit tests for individual components and utilities, integration tests for multi-step flows and data persistence, end-to-end tests for complete checkout scenarios, performance tests for load times and bundle optimization, and accessibility tests for keyboard navigation and screen reader support.

The testing approach validates both guest and authenticated checkout flows, address cascade functionality (Province→District→City), payment method selection, mobile responsive behavior, cart updates, form validation, and order submission. This ensures a robust, reliable, and user-friendly checkout experience before production deployment.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 94 | Unit Testing Suite | Medium | 90 min |
| 95 | Integration Testing | Medium | 75 min |
| 96 | E2E Testing | High | 120 min |
| 97 | Performance Testing | Medium | 60 min |
| 98 | Accessibility Testing | Medium | 60 min |

---

## Task 94: Unit Testing Suite

### Overview
Implement comprehensive unit tests for all checkout components, validation functions, store logic, and utility helpers. Unit tests focus on testing individual components and functions in isolation, ensuring each piece works correctly before integration. This includes testing component rendering, props handling, user interactions, validation logic, store mutations, and utility functions.

### Dependencies
- Tasks 85-93: All sidebar and API components completed
- Tasks 1-84: All checkout flow components completed
- Testing framework installed (e.g., Vitest, Jest)
- Testing utilities installed (e.g., React Testing Library)

### Instructions

1. **Set up testing environment**
   - Verify testing framework configuration
   - Ensure test runners are properly configured
   - Set up test utilities and helpers
   - Configure coverage reporting

2. **Create test directory structure**
   - Navigate to `frontend/tests/unit/checkout/`
   - Create subdirectories: `components/`, `validation/`, `stores/`, `utils/`
   - Mirror the source code structure for easy navigation
   - Create `__mocks__/` directory for shared mocks

3. **Test checkout step components**
   - Test StepIndicator component rendering
   - Verify step active/completed states display correctly
   - Test step navigation click handlers
   - Verify disabled steps cannot be clicked
   - Test responsive layout on mobile

4. **Test Step 1 (Information) components**
   - Test CustomerInfoForm rendering with empty state
   - Verify email field validation (format, required)
   - Test newsletter checkbox toggle
   - Verify form submission with valid data
   - Test error message display for invalid inputs
   - Mock API calls for email duplicate check

5. **Test shipping address form**
   - Test ShippingAddressForm rendering
   - Verify all form fields render correctly
   - Test required field validation
   - Test address line 1 validation (max 100 chars)
   - Test address line 2 optional field
   - Test postal code format validation
   - Test form state updates on input change

6. **Test address cascade functionality**
   - Test Province select populates correctly
   - Verify District select disabled until province selected
   - Test District select populates based on province
   - Verify City select disabled until district selected
   - Test City select populates based on district
   - Test cascade reset when parent selection changes
   - Verify validation errors clear on selection

7. **Test Step 2 (Shipping) components**
   - Test ShippingMethodList rendering
   - Verify shipping options display correctly
   - Test shipping option selection
   - Verify selected option visual feedback
   - Test shipping cost calculation display
   - Test delivery time estimates display
   - Verify "Free Shipping" badge for eligible orders

8. **Test shipping method calculations**
   - Test standard shipping cost calculation
   - Verify express shipping cost calculation
   - Test free shipping threshold logic (≥LKR 5000)
   - Test shipping cost updates in order summary
   - Verify zone-based shipping rates (if applicable)

9. **Test Step 3 (Payment) components**
   - Test PaymentMethodList rendering
   - Verify payment method options display
   - Test payment method selection
   - Verify selected method visual feedback
   - Test payment method icon display
   - Verify disabled payment methods (if any)

10. **Test Cash on Delivery components**
    - Test CashOnDelivery component rendering
    - Verify COD fee display (LKR 200)
    - Test COD terms acceptance checkbox
    - Verify form cannot proceed without acceptance
    - Test COD limitations display (if any)

11. **Test Bank Transfer components**
    - Test BankTransfer component rendering
    - Verify bank account details display
    - Test account number copy functionality
    - Verify bank name and branch display
    - Test reference number field validation
    - Verify instructions display clearly

12. **Test Card Payment components**
    - Test CardPayment component rendering
    - Verify card number field and formatting
    - Test card number validation (16 digits)
    - Verify expiry date field (MM/YY format)
    - Test expiry date validation (future dates only)
    - Verify CVV field (3-4 digits)
    - Test CVV validation
    - Verify cardholder name field
    - Test supported card types display

13. **Test Step 4 (Review) components**
    - Test ReviewOrder component rendering
    - Verify customer information display
    - Test shipping address display (formatted)
    - Verify shipping method display with cost
    - Test payment method display
    - Verify all cart items display correctly
    - Test edit buttons navigate to correct steps

14. **Test Step 5 (Confirmation) components**
    - Test OrderConfirmation component rendering
    - Verify success message display
    - Test order number display
    - Verify order summary display
    - Test confirmation email message
    - Verify "Continue Shopping" button
    - Test "View Order Details" link

15. **Test Order Sidebar components**
    - Test OrderSidebar rendering on desktop
    - Verify sidebar sticky positioning
    - Test SidebarItemsList renders all cart items
    - Verify SidebarItemRow displays item details
    - Test item thumbnail, name, quantity, price display
    - Verify SidebarSubtotal calculates correctly
    - Test SidebarShipping displays selected shipping cost
    - Verify SidebarDiscount applies coupon correctly
    - Test SidebarTotal calculates grand total correctly
    - Verify LKR currency formatting throughout

16. **Test CollapsibleSidebar (mobile)**
    - Test sidebar collapses on mobile viewports
    - Verify collapse/expand toggle button
    - Test sidebar content hidden when collapsed
    - Verify animation during collapse/expand
    - Test item count badge on collapsed header
    - Verify grand total visible when collapsed

17. **Test validation functions**
    - Test email validation function (valid/invalid formats)
    - Verify required field validation function
    - Test phone number validation (Sri Lankan format)
    - Verify postal code validation
    - Test name validation (min/max length)
    - Verify address validation
    - Test credit card number validation (Luhn algorithm)
    - Verify expiry date validation (format and future date)
    - Test CVV validation (3-4 digits)

18. **Test checkout store**
    - Test initial store state
    - Verify current step state management
    - Test step navigation actions (next, previous, goToStep)
    - Verify customer info state updates
    - Test shipping address state updates
    - Verify shipping method selection state
    - Test payment method selection state
    - Verify cart items state
    - Test cart item quantity updates
    - Verify cart item removal
    - Test subtotal calculation
    - Verify shipping cost updates
    - Test discount application
    - Verify grand total calculation
    - Test form validation state management
    - Verify error state management

19. **Test utility functions**
    - Test currency formatting (LKR format)
    - Verify number formatting utilities
    - Test date formatting functions
    - Verify string manipulation utilities
    - Test array manipulation functions
    - Verify object deep cloning utilities
    - Test debounce function
    - Verify throttle function

20. **Test error handling**
    - Test network error handling
    - Verify API error responses handled correctly
    - Test validation error display
    - Verify timeout error handling
    - Test 400 Bad Request handling
    - Verify 404 Not Found handling
    - Test 500 Server Error handling
    - Verify user-friendly error messages display

21. **Configure test coverage**
    - Set up code coverage reporting
    - Configure minimum coverage thresholds (e.g., 80%)
    - Identify untested code paths
    - Add tests for uncovered branches
    - Generate coverage reports (HTML, JSON)
    - Review coverage metrics

22. **Create test mocks and fixtures**
    - Create mock cart data (sample products)
    - Mock customer information data
    - Create mock address data (provinces, districts, cities)
    - Mock shipping methods data
    - Create mock payment methods data
    - Mock API responses (success and error)
    - Create test fixtures for edge cases

23. **Test edge cases**
    - Test empty cart scenario
    - Verify single item cart
    - Test large cart (many items)
    - Verify cart with maximum quantity items
    - Test free shipping threshold boundary (4999, 5000, 5001)
    - Verify discount edge cases (100% off, invalid codes)
    - Test very long customer names/addresses
    - Verify special characters in inputs
    - Test concurrent user interactions

24. **Verify test execution**
    - Run all unit tests
    - Ensure all tests pass
    - Verify no flaky tests (run multiple times)
    - Check test execution time (optimize slow tests)
    - Review test output logs
    - Fix any failing tests

### Expected Deliverables
```
frontend/tests/unit/checkout/
├── components/
│   ├── StepIndicator.test.tsx
│   ├── CustomerInfoForm.test.tsx
│   ├── ShippingAddressForm.test.tsx
│   ├── ShippingMethodList.test.tsx
│   ├── PaymentMethodList.test.tsx
│   ├── CashOnDelivery.test.tsx
│   ├── BankTransfer.test.tsx
│   ├── CardPayment.test.tsx
│   ├── ReviewOrder.test.tsx
│   ├── OrderConfirmation.test.tsx
│   ├── OrderSidebar.test.tsx
│   ├── SidebarItemsList.test.tsx
│   ├── SidebarItemRow.test.tsx
│   ├── CollapsibleSidebar.test.tsx
│   └── ...
├── validation/
│   ├── emailValidation.test.ts
│   ├── phoneValidation.test.ts
│   ├── addressValidation.test.ts
│   ├── cardValidation.test.ts
│   └── ...
├── stores/
│   ├── checkoutStore.test.ts
│   ├── cartStore.test.ts
│   └── ...
├── utils/
│   ├── formatCurrency.test.ts
│   ├── formatDate.test.ts
│   └── ...
└── __mocks__/
    ├── cartData.ts
    ├── addressData.ts
    ├── apiResponses.ts
    └── ...
```

### Acceptance Criteria
- All checkout components have unit tests
- All validation functions have tests covering valid/invalid inputs
- Store actions and state mutations are tested
- Utility functions are tested with various inputs
- Edge cases and boundary conditions are tested
- Test coverage meets minimum threshold (≥80%)
- All tests pass consistently
- No flaky tests
- Mock data is realistic and comprehensive

### Testing Tools
- **Framework:** Vitest or Jest
- **React Testing:** React Testing Library
- **Assertions:** Expect API or Chai
- **Coverage:** Istanbul (c8) or Jest coverage
- **Mocking:** Vitest mock functions or Jest mocks

### Notes
- Focus on testing behavior, not implementation details
- Use React Testing Library best practices (query by role, label, text)
- Avoid testing internal component state directly
- Test user interactions (clicks, typing, form submission)
- Mock external dependencies (API calls, localStorage)
- Keep tests simple, focused, and readable
- Use descriptive test names
- Group related tests with describe blocks
- Test both happy paths and error scenarios

---

## Task 95: Integration Testing

### Overview
Implement integration tests that validate the interaction between multiple components, the flow between checkout steps, data persistence across navigation, API integration, and state synchronization. Integration tests ensure that individual pieces work correctly together as a cohesive system, catching issues that unit tests alone cannot detect.

### Dependencies
- Task 94: Unit testing completed
- All checkout components and stores implemented
- API endpoints available (or mocked)
- Test database or mock server configured

### Instructions

1. **Set up integration test environment**
   - Configure integration test runner
   - Set up test database or mock API server
   - Configure environment variables for testing
   - Ensure test isolation between test runs

2. **Create integration test directory**
   - Navigate to `frontend/tests/integration/checkout/`
   - Create subdirectories: `flows/`, `api/`, `state/`
   - Create `setup.ts` for common test setup
   - Create `teardown.ts` for cleanup

3. **Test checkout flow navigation**
   - Test navigation from Step 1 to Step 2
   - Verify data persists when navigating back from Step 2 to Step 1
   - Test navigation through all 5 steps sequentially
   - Verify cannot skip steps without completing previous
   - Test "Edit" buttons from Review step navigate correctly
   - Verify step indicator updates correctly during navigation

4. **Test customer information flow**
   - Enter email and customer info in Step 1
   - Navigate to Step 2
   - Navigate back to Step 1
   - Verify email and info are still populated
   - Change email
   - Navigate to Step 2 again
   - Verify updated email persists

5. **Test shipping address flow**
   - Complete customer info
   - Navigate to Step 2 (should auto-navigate to shipping address)
   - Fill shipping address form
   - Navigate to Step 3
   - Return to Step 1
   - Verify shipping address data persists
   - Verify address displayed in sidebar

6. **Test address cascade integration**
   - Select a province from Province dropdown
   - Verify District dropdown populates with correct districts
   - Select a district
   - Verify City dropdown populates with correct cities
   - Select a city
   - Verify full address stored correctly in checkout state
   - Navigate to Review step
   - Verify formatted address displays correctly (Province, District, City)
   - Go back and change province
   - Verify District and City reset
   - Complete new cascade selection
   - Verify updated address in Review step

7. **Test shipping method flow**
   - Complete customer info and shipping address
   - Navigate to Shipping Method step
   - Select "Standard Shipping"
   - Verify shipping cost updates in sidebar
   - Verify grand total updates
   - Navigate to Payment step
   - Return to Shipping Method step
   - Change to "Express Shipping"
   - Verify shipping cost updates
   - Verify grand total recalculates
   - Navigate to Review step
   - Verify selected shipping method displays correctly

8. **Test free shipping threshold integration**
   - Start with cart total LKR 4500 (below threshold)
   - Select Standard Shipping
   - Verify shipping cost is charged (e.g., LKR 350)
   - Add item to cart to reach LKR 5200 (above threshold)
   - Verify shipping cost becomes LKR 0
   - Verify "Free Shipping" badge appears
   - Verify grand total reflects free shipping

9. **Test payment method flow**
   - Complete Steps 1-3
   - Navigate to Payment Method step
   - Select "Cash on Delivery"
   - Verify COD fee (LKR 200) adds to total
   - Verify COD terms checkbox appears
   - Check terms acceptance checkbox
   - Navigate to Review step
   - Verify payment method displays as "Cash on Delivery"
   - Return to Payment step
   - Change to "Bank Transfer"
   - Verify COD fee removed from total
   - Verify bank details form appears
   - Navigate to Review step
   - Verify payment method updated

10. **Test cart updates during checkout**
    - Start checkout with 3 items in cart
    - Complete Step 1
    - Update cart (change quantity or remove item)
    - Verify sidebar updates immediately
    - Verify subtotal recalculates
    - Verify grand total recalculates
    - Verify shipping cost recalculates if threshold affected
    - Complete checkout
    - Verify order summary reflects updated cart

11. **Test coupon/discount integration**
    - Start checkout
    - Enter valid coupon code in sidebar
    - Verify discount applies to subtotal
    - Verify grand total updates
    - Navigate through steps
    - Verify discount persists across navigation
    - Complete checkout
    - Verify discount included in order confirmation
    - Test invalid coupon code
    - Verify error message displays
    - Verify discount not applied

12. **Test form validation across steps**
    - Attempt to proceed from Step 1 without filling required fields
    - Verify validation errors display
    - Verify cannot navigate to Step 2
    - Fill required fields
    - Verify errors clear
    - Verify can navigate to Step 2
    - Repeat for Steps 2, 3, 4

13. **Test API integration: Cart retrieval**
    - Load checkout page
    - Verify API call to retrieve cart items
    - Verify cart items display in sidebar
    - Test empty cart scenario
    - Verify appropriate message or redirect

14. **Test API integration: Address cascade**
    - Select province
    - Verify API call to fetch districts
    - Verify districts populate correctly
    - Select district
    - Verify API call to fetch cities
    - Verify cities populate correctly
    - Test API error handling (network failure)
    - Verify error message displays to user

15. **Test API integration: Shipping methods**
    - Navigate to Shipping Method step
    - Verify API call to fetch shipping methods
    - Verify shipping options display correctly
    - Test with different cart totals
    - Verify free shipping eligibility calculation
    - Test API error handling

16. **Test API integration: Order submission**
    - Complete all checkout steps
    - Submit order from Review step
    - Verify API call to create order
    - Verify loading state during submission
    - Verify navigation to Confirmation step on success
    - Verify order number displays
    - Test API error (payment failed)
    - Verify error message displays
    - Verify user remains on Review step
    - Verify can retry submission

17. **Test state persistence: localStorage**
    - Complete Step 1 and Step 2
    - Refresh the browser
    - Verify checkout data persists (email, address)
    - Verify current step persists
    - Verify sidebar data persists
    - Complete checkout
    - Verify checkout state clears from localStorage

18. **Test state synchronization: Multiple tabs**
    - Open checkout in Tab 1
    - Add item to cart
    - Open checkout in Tab 2
    - Verify cart updates in Tab 2
    - Update cart in Tab 2
    - Verify cart updates in Tab 1
    - Complete checkout in Tab 1
    - Verify Tab 2 updates appropriately

19. **Test concurrent form submissions**
    - Complete checkout
    - Submit order (Review step)
    - Attempt to submit again before first submission completes
    - Verify duplicate submission prevented
    - Verify loading state prevents second submission
    - Verify only one order created

20. **Test checkout session timeout**
    - Start checkout
    - Wait for session timeout (if applicable)
    - Attempt to submit order
    - Verify session timeout handled gracefully
    - Verify user prompted to re-authenticate or restart
    - Verify data retained if possible

21. **Test error recovery flows**
    - Trigger network error during order submission
    - Verify error message displays
    - Fix network connection
    - Retry order submission
    - Verify successful order creation
    - Verify no duplicate orders

22. **Test logged-in user integration**
    - Log in as existing customer
    - Navigate to checkout
    - Verify customer email pre-filled
    - Verify saved addresses available
    - Select saved shipping address
    - Verify address fields populate
    - Verify saved payment methods available (if applicable)
    - Complete checkout
    - Verify order associated with user account

23. **Test guest checkout integration**
    - Start checkout without logging in
    - Complete all steps as guest
    - Submit order
    - Verify order created successfully
    - Verify order confirmation sent to provided email
    - Verify guest order tracking options (if applicable)

24. **Verify integration test execution**
    - Run all integration tests
    - Ensure all tests pass
    - Verify test database cleanup after each test
    - Review test logs for warnings or errors
    - Check test execution time
    - Fix any failing tests

### Expected Deliverables
```
frontend/tests/integration/checkout/
├── flows/
│   ├── checkoutNavigation.test.ts
│   ├── customerInfoFlow.test.ts
│   ├── shippingAddressFlow.test.ts
│   ├── addressCascade.test.ts
│   ├── shippingMethodFlow.test.ts
│   ├── paymentMethodFlow.test.ts
│   ├── cartUpdates.test.ts
│   ├── couponDiscount.test.ts
│   └── ...
├── api/
│   ├── cartRetrieval.test.ts
│   ├── addressCascadeAPI.test.ts
│   ├── shippingMethodsAPI.test.ts
│   ├── orderSubmission.test.ts
│   └── ...
├── state/
│   ├── statePersistence.test.ts
│   ├── stateSynchronization.test.ts
│   └── ...
├── setup.ts
└── teardown.ts
```

### Acceptance Criteria
- All multi-step flows tested end-to-end
- Data persistence across navigation verified
- API integrations tested with mock or real endpoints
- State synchronization across components verified
- Error handling and recovery flows tested
- Both guest and logged-in checkout flows tested
- Address cascade fully tested with real data
- Cart updates reflect across all components
- All integration tests pass consistently

### Testing Tools
- **Framework:** Vitest or Jest
- **API Mocking:** MSW (Mock Service Worker) or Nock
- **State Management:** Test with actual store implementation
- **Browser Storage:** Mock localStorage/sessionStorage
- **HTTP Client:** Axios or Fetch with interceptors

### Notes
- Integration tests are slower than unit tests - run strategically
- Use real API calls in staging environment when possible
- Mock external services (payment gateways, shipping calculators)
- Test with realistic data volumes
- Verify cleanup between tests to prevent test pollution
- Focus on critical user paths first
- Document test setup requirements clearly

---

## Task 96: E2E Testing

### Overview
Implement end-to-end tests that simulate real user interactions in a browser environment, testing the complete checkout flow from cart to order confirmation. E2E tests validate the entire application stack including frontend, backend, database, and external integrations, ensuring the system works correctly in production-like conditions.

### Dependencies
- Task 95: Integration testing completed
- All checkout features implemented
- Staging or test environment available
- E2E testing framework configured (e.g., Playwright, Cypress)

### Instructions

1. **Set up E2E testing environment**
   - Install E2E testing framework (Playwright recommended)
   - Configure browser automation (Chromium, Firefox, WebKit)
   - Set up test environment URL (localhost or staging)
   - Configure test data and fixtures
   - Set up screenshot and video recording on failure

2. **Create E2E test directory structure**
   - Navigate to `frontend/tests/e2e/`
   - Create `checkout/` directory
   - Create `fixtures/` for test data
   - Create `utils/` for helper functions
   - Create `config/` for environment settings

3. **Test complete guest checkout flow**
   - Navigate to webstore homepage
   - Add product(s) to cart
   - Verify cart icon updates with item count
   - Navigate to cart page
   - Click "Proceed to Checkout"
   - Verify redirect to checkout Step 1
   - Fill customer information (email, newsletter)
   - Click "Continue to Shipping"
   - Verify navigation to shipping address form
   - Fill shipping address (all fields)
   - Select Province from dropdown
   - Wait for District dropdown to populate
   - Select District
   - Wait for City dropdown to populate
   - Select City
   - Click "Continue to Shipping Method"
   - Verify navigation to shipping method step
   - Select "Standard Shipping"
   - Verify shipping cost displays in sidebar
   - Click "Continue to Payment"
   - Verify navigation to payment method step
   - Select "Cash on Delivery"
   - Verify COD fee adds to total
   - Check COD terms acceptance checkbox
   - Click "Continue to Review"
   - Verify all entered data displays correctly
   - Verify order sidebar shows correct totals
   - Click "Place Order"
   - Verify loading state during submission
   - Wait for order confirmation page
   - Verify success message displays
   - Verify order number displays
   - Verify order summary displays
   - Verify "Continue Shopping" button works

4. **Test complete logged-in checkout flow**
   - Log in as existing customer
   - Add product(s) to cart
   - Navigate to checkout
   - Verify email pre-filled with logged-in user email
   - Verify saved addresses available (if any)
   - Select saved address or fill new address
   - Continue through shipping method selection
   - Continue through payment method selection
   - Review order
   - Place order
   - Verify order confirmation
   - Log out
   - Log back in
   - Navigate to order history (if implemented)
   - Verify order appears in order history

5. **Test address cascade E2E**
   - Navigate to checkout
   - Fill customer information
   - Navigate to shipping address
   - Click Province dropdown
   - Verify dropdown opens with provinces list
   - Select "Western Province"
   - Verify District dropdown enables
   - Click District dropdown
   - Verify "Colombo", "Gampaha", "Kalutara" appear
   - Select "Colombo"
   - Verify City dropdown enables
   - Click City dropdown
   - Verify cities in Colombo district appear
   - Select a city
   - Verify address fields complete
   - Change Province to "Central Province"
   - Verify District dropdown resets
   - Verify City dropdown resets and disables
   - Select new District and City
   - Continue to next step
   - Return to address step
   - Verify Province, District, City selections persist

6. **Test shipping method selection E2E**
   - Complete checkout to shipping method step
   - Verify shipping options display with descriptions
   - Verify shipping costs display (LKR format)
   - Verify delivery time estimates display
   - Click "Standard Shipping" option
   - Verify option visually selected
   - Verify sidebar shipping cost updates
   - Verify sidebar grand total updates
   - Click "Express Shipping" option
   - Verify option visually selected
   - Verify sidebar shipping cost updates (higher)
   - Verify sidebar grand total updates
   - Continue to payment step
   - Return to shipping method step
   - Verify previously selected option still selected
   - Continue to review step
   - Verify selected shipping method displays correctly

7. **Test payment method selection E2E**
   - Complete checkout to payment method step
   - Verify payment method options display
   - Click "Cash on Delivery"
   - Verify COD details section appears
   - Verify COD fee (LKR 200) displays
   - Verify COD fee adds to sidebar total
   - Verify terms checkbox appears
   - Attempt to continue without checking terms
   - Verify validation error or disabled button
   - Check terms checkbox
   - Click "Bank Transfer"
   - Verify COD fee removed from sidebar total
   - Verify bank account details display
   - Verify account number, bank name, branch display
   - Test copy account number button
   - Verify copied confirmation message
   - Click "Card Payment" (if implemented)
   - Verify card form appears
   - Enter test card details
   - Verify card number formatting (spaces every 4 digits)
   - Verify real-time validation
   - Continue to review step
   - Verify payment method displays correctly

8. **Test cart modifications during checkout**
   - Start checkout with 3 items
   - Complete Step 1
   - Open cart in new tab or mini-cart
   - Remove one item from cart
   - Switch back to checkout tab
   - Verify sidebar updates (2 items now)
   - Verify subtotal and total update
   - Continue checkout
   - Increase quantity of an item in mini-cart
   - Verify sidebar updates
   - Complete checkout
   - Verify final order reflects updated cart

9. **Test coupon code application E2E**
   - Navigate to checkout
   - Locate coupon code field in sidebar
   - Enter invalid coupon "INVALID123"
   - Click "Apply"
   - Verify error message "Invalid coupon code"
   - Verify discount not applied
   - Enter valid coupon "SAVE10"
   - Click "Apply"
   - Verify success message "Coupon applied"
   - Verify discount displays in sidebar
   - Verify subtotal/total recalculates
   - Continue through checkout
   - Verify discount persists in review step
   - Complete order
   - Verify discount in order confirmation

10. **Test free shipping threshold E2E**
    - Clear cart
    - Add product(s) totaling LKR 4500 (below LKR 5000)
    - Navigate to checkout
    - Complete to shipping method step
    - Verify Standard Shipping cost is charged (e.g., LKR 350)
    - Verify no free shipping badge
    - Go back to cart (or open mini-cart)
    - Add more products to reach LKR 5200
    - Return to checkout
    - Verify Standard Shipping is now LKR 0
    - Verify "Free Shipping" badge appears
    - Verify grand total reflects free shipping
    - Complete order
    - Verify order confirmation shows LKR 0 shipping

11. **Test validation and error handling E2E**
    - Navigate to checkout
    - Leave email field empty
    - Attempt to continue
    - Verify error message "Email is required"
    - Verify cannot proceed
    - Enter invalid email "notanemail"
    - Attempt to continue
    - Verify error "Please enter a valid email"
    - Enter valid email
    - Verify error clears
    - Continue to shipping address
    - Leave First Name empty
    - Attempt to continue
    - Verify validation error
    - Fill all required fields except Postal Code
    - Leave Postal Code empty
    - Attempt to continue
    - Verify Postal Code validation error
    - Fill Postal Code
    - Continue to shipping method
    - Do not select any shipping method
    - Attempt to continue
    - Verify error "Please select a shipping method"
    - Select shipping method
    - Continue successfully

12. **Test mobile responsive checkout E2E**
    - Configure viewport to mobile size (375x667)
    - Navigate to checkout
    - Verify layout adapts to mobile
    - Verify order sidebar collapses to top
    - Verify sidebar toggle button appears
    - Click sidebar toggle
    - Verify sidebar expands
    - Verify order items display
    - Click toggle again
    - Verify sidebar collapses
    - Fill customer information form on mobile
    - Verify form fields are touch-friendly
    - Verify no horizontal scrolling
    - Continue to shipping address
    - Fill address form on mobile
    - Test dropdown selects on mobile
    - Continue through shipping and payment steps
    - Verify step indicator adapts to mobile
    - Complete checkout on mobile
    - Verify confirmation page mobile-friendly

13. **Test browser back/forward navigation**
    - Navigate to checkout Step 1
    - Complete customer info
    - Continue to Step 2
    - Click browser back button
    - Verify return to Step 1
    - Verify data persists
    - Click browser forward button
    - Verify return to Step 2
    - Continue to Step 3
    - Click browser back twice
    - Verify return to Step 1
    - Continue through all steps normally
    - Complete checkout
    - Click browser back button
    - Verify order already placed (prevent re-submission)

14. **Test page refresh during checkout**
    - Navigate to checkout
    - Fill customer information
    - Refresh page
    - Verify customer information persists (if using localStorage)
    - Continue to shipping address
    - Fill address partially
    - Refresh page
    - Verify partial data persists or clears (based on design)
    - Complete address
    - Continue to shipping method
    - Select shipping method
    - Refresh page
    - Verify selection persists
    - Complete checkout without refreshing

15. **Test session timeout handling**
    - Start checkout as guest
    - Wait for session timeout (if applicable, or simulate)
    - Attempt to place order
    - Verify appropriate handling (redirect, message, etc.)
    - Verify data can be recovered or re-entered
    - Complete checkout successfully

16. **Test network interruption recovery**
    - Navigate to review step
    - Disconnect network (simulate offline)
    - Attempt to place order
    - Verify error message about network connection
    - Reconnect network
    - Retry order placement
    - Verify successful order creation
    - Verify no duplicate orders

17. **Test cross-browser compatibility**
    - Run checkout flow in Chrome
    - Verify all features work
    - Run checkout flow in Firefox
    - Verify all features work
    - Run checkout flow in Safari (if Mac available)
    - Verify all features work
    - Run checkout flow in Edge
    - Verify all features work
    - Document any browser-specific issues

18. **Test performance on slow network**
    - Configure slow 3G network throttling
    - Navigate to checkout
    - Verify page loads (may be slow)
    - Verify loading indicators appear during API calls
    - Select province (trigger districts API call)
    - Verify loading state during fetch
    - Verify districts populate after delay
    - Complete checkout on slow network
    - Verify no timeouts or failures

19. **Test multiple simultaneous checkouts**
    - Open checkout in Browser 1
    - Open checkout in Browser 2 (different session)
    - Complete checkout in Browser 1
    - Complete checkout in Browser 2
    - Verify both orders created successfully
    - Verify no conflicts or race conditions

20. **Test checkout analytics and tracking**
    - Verify analytics events fire at each step
    - Verify "Begin Checkout" event on Step 1
    - Verify "Add Shipping Info" event on Step 2
    - Verify "Add Payment Info" event on Step 4
    - Verify "Purchase" event on order confirmation
    - Verify correct data passed in events (order value, items, etc.)

21. **Test security measures E2E**
    - Verify HTTPS used for checkout pages
    - Verify sensitive data (card details) handled securely
    - Verify CSRF tokens included in form submissions (if applicable)
    - Verify XSS protections (enter script tags in input fields)
    - Verify inputs sanitized before display
    - Verify cannot access restricted checkout steps directly via URL manipulation

22. **Create test data fixtures**
    - Create fixtures for test users
    - Create fixtures for test products
    - Create fixtures for address data (provinces, districts, cities)
    - Create fixtures for shipping methods
    - Create fixtures for payment methods
    - Create fixtures for discount codes

23. **Configure test reporting**
    - Configure screenshot capture on test failure
    - Configure video recording of test runs
    - Set up HTML test report generation
    - Configure parallel test execution (if supported)
    - Set up CI/CD integration for E2E tests
    - Configure test retry on failure (flaky test handling)

24. **Verify E2E test execution**
    - Run all E2E tests
    - Ensure all tests pass
    - Review test execution time
    - Review screenshots/videos of failures (if any)
    - Fix any failing or flaky tests
    - Document known issues or limitations

### Expected Deliverables
```
frontend/tests/e2e/
├── checkout/
│   ├── guestCheckout.spec.ts
│   ├── loggedInCheckout.spec.ts
│   ├── addressCascade.spec.ts
│   ├── shippingMethod.spec.ts
│   ├── paymentMethod.spec.ts
│   ├── cartModifications.spec.ts
│   ├── couponCode.spec.ts
│   ├── freeShipping.spec.ts
│   ├── validation.spec.ts
│   ├── mobileCheckout.spec.ts
│   ├── browserNavigation.spec.ts
│   ├── networkInterruption.spec.ts
│   └── ...
├── fixtures/
│   ├── users.ts
│   ├── products.ts
│   ├── addresses.ts
│   ├── shippingMethods.ts
│   └── ...
├── utils/
│   ├── checkoutHelpers.ts
│   ├── dataGenerators.ts
│   └── ...
├── config/
│   └── playwright.config.ts
└── README.md
```

### Acceptance Criteria
- Complete guest checkout flow tested end-to-end
- Complete logged-in checkout flow tested end-to-end
- Address cascade tested with real user interactions
- All payment methods tested (COD, Bank Transfer, Card)
- Cart modifications during checkout tested
- Mobile responsive checkout tested
- Browser back/forward navigation tested
- Page refresh behavior tested
- Network interruption recovery tested
- Cross-browser compatibility verified
- All E2E tests pass consistently
- Test failures include screenshots and videos
- Test execution time is reasonable (<10 minutes for full suite)

### Testing Tools
- **Framework:** Playwright (recommended) or Cypress
- **Browsers:** Chromium, Firefox, WebKit (Playwright) or Chrome (Cypress)
- **Reporting:** HTML Reporter, Allure, or Mochawesome
- **CI/CD:** GitHub Actions, GitLab CI, or similar
- **Network Simulation:** Playwright network throttling

### Notes
- E2E tests are the slowest - run on critical paths and pre-deployment
- Use real API and database in test environment
- Ensure test data cleanup after each run
- Use unique identifiers for test data to avoid conflicts
- Consider running E2E tests in parallel to reduce execution time
- Mock external services (payment gateways) if not available in test environment
- Document test environment setup requirements
- Prioritize critical user journeys for E2E coverage

---

## Task 97: Performance Testing

### Overview
Conduct performance testing to ensure the checkout flow loads quickly, responds smoothly to user interactions, and provides an optimal user experience across different network conditions and devices. Performance testing includes measuring page load times, API response times, bundle size analysis, rendering performance, and identifying optimization opportunities.

### Dependencies
- Tasks 94-96: Unit, integration, and E2E testing completed
- All checkout features implemented and tested
- Production build available for testing
- Performance monitoring tools configured

### Instructions

1. **Set up performance testing environment**
   - Configure production build for testing
   - Set up performance monitoring tools (Lighthouse, WebPageTest)
   - Configure browser developer tools for performance profiling
   - Set up bundle analyzer tools
   - Prepare test devices and network conditions

2. **Create performance test directory**
   - Navigate to `frontend/tests/performance/`
   - Create `checkout/` directory
   - Create performance benchmarks document
   - Create performance report template

3. **Test initial page load performance**
   - Build production version of application
   - Clear browser cache
   - Navigate to checkout page
   - Measure Time to First Byte (TTFB)
   - Measure First Contentful Paint (FCP)
   - Measure Largest Contentful Paint (LCP)
   - Measure Time to Interactive (TTI)
   - Measure Total Blocking Time (TBT)
   - Measure Cumulative Layout Shift (CLS)
   - Record all metrics

4. **Establish performance baselines**
   - Define acceptable performance thresholds
   - TTFB: <600ms (good), <1.8s (acceptable)
   - FCP: <1.8s (good), <3s (acceptable)
   - LCP: <2.5s (good), <4s (acceptable)
   - TTI: <3.8s (good), <7.3s (acceptable)
   - TBT: <200ms (good), <600ms (acceptable)
   - CLS: <0.1 (good), <0.25 (acceptable)
   - Document baselines

5. **Test API response times**
   - Measure cart retrieval API response time (target: <500ms)
   - Measure province/district/city API response times (target: <300ms each)
   - Measure shipping methods API response time (target: <400ms)
   - Measure order submission API response time (target: <1000ms)
   - Measure coupon validation API response time (target: <500ms)
   - Test API performance under load (multiple concurrent requests)
   - Identify slow APIs for optimization

6. **Analyze JavaScript bundle size**
   - Build production bundle
   - Use bundle analyzer (e.g., webpack-bundle-analyzer)
   - Identify bundle size: Total, Parsed, Gzipped
   - Target: Total bundle <500KB, Gzipped <150KB
   - Identify largest dependencies in bundle
   - Identify unused code (tree-shaking opportunities)
   - Check for duplicate dependencies
   - Analyze code splitting effectiveness

7. **Test component rendering performance**
   - Use React DevTools Profiler
   - Navigate through checkout steps
   - Measure rendering time for each step component
   - Identify components with slow render times (>100ms)
   - Measure re-render frequency
   - Identify unnecessary re-renders
   - Test OrderSidebar render performance (should update quickly)
   - Test address cascade dropdown render performance

8. **Test form input responsiveness**
   - Type in email field
   - Measure input lag (target: <50ms)
   - Type in address fields
   - Measure input lag
   - Type in card number field with formatting
   - Measure input lag with formatting logic
   - Test dropdown select performance
   - Measure time to open dropdown (target: <100ms)
   - Test checkbox toggle responsiveness

9. **Test scroll performance**
   - Scroll through checkout page
   - Measure scroll smoothness (should be 60fps)
   - Test sticky sidebar scroll performance
   - Measure frames per second during scroll
   - Identify any jank or stuttering
   - Test scroll performance on mobile devices

10. **Test network performance on different connections**
    - Configure Fast 3G throttling (100ms latency, 1.6Mbps down)
    - Navigate to checkout
    - Measure load time (should still be usable)
    - Complete checkout flow
    - Record performance metrics
    - Configure Slow 3G throttling (300ms latency, 400Kbps down)
    - Repeat checkout flow
    - Record metrics
    - Verify acceptable user experience on slow connections

11. **Test mobile device performance**
    - Test on actual mobile device (or emulator)
    - Use low-end device profile (e.g., Moto G4)
    - Navigate to checkout
    - Measure performance metrics
    - Test scroll performance
    - Test dropdown interactions
    - Measure battery impact (if possible)
    - Compare to high-end device performance

12. **Identify performance bottlenecks**
    - Review performance metrics
    - Identify slowest operations
    - Identify largest bundle chunks
    - Identify slow-rendering components
    - Identify API bottlenecks
    - Identify network waterfall issues
    - Document all bottlenecks

13. **Implement performance optimizations**
    - Code splitting: Split checkout steps into separate chunks
    - Lazy load non-critical components
    - Optimize images: Use WebP format, responsive images
    - Implement caching: Cache API responses (provinces, districts, cities)
    - Debounce validation functions (e.g., email validation)
    - Throttle scroll event listeners
    - Use React.memo for pure components (OrderSidebar items)
    - Use useMemo for expensive calculations (order totals)
    - Use useCallback to prevent unnecessary re-renders
    - Minimize bundle size: Remove unused dependencies
    - Enable tree-shaking
    - Enable gzip/brotli compression on server

14. **Test image loading performance**
    - Measure product thumbnail load times in sidebar
    - Implement lazy loading for images below fold
    - Use modern image formats (WebP, AVIF)
    - Implement responsive images (srcset)
    - Test placeholder loading states
    - Measure LCP improvement after optimization

15. **Test font loading performance**
    - Measure font load time
    - Implement font-display: swap or optional
    - Preload critical fonts
    - Subset fonts (include only used characters for custom fonts)
    - Measure FOUT (Flash of Unstyled Text) impact
    - Optimize font delivery

16. **Test CSS performance**
    - Measure CSS bundle size
    - Remove unused CSS (PurgeCSS or similar)
    - Inline critical CSS for above-fold content
    - Defer non-critical CSS
    - Test CSS animation performance (60fps)
    - Optimize CSS selectors

17. **Test caching effectiveness**
    - Clear cache and load checkout page (cold load)
    - Measure load time
    - Revisit checkout page (warm load)
    - Measure load time improvement
    - Verify static assets cached (images, fonts, scripts)
    - Verify API responses cached appropriately
    - Test cache invalidation on updates

18. **Test memory usage**
    - Use browser DevTools Memory profiler
    - Navigate through checkout steps
    - Measure memory usage at each step
    - Identify memory leaks (increasing memory over time)
    - Test memory usage after completing checkout
    - Verify memory released appropriately
    - Identify components with high memory consumption

19. **Test Progressive Web App (PWA) performance (if applicable)**
    - Verify Service Worker registered
    - Test offline functionality (if supported)
    - Measure app shell load time
    - Test background sync (if implemented)
    - Measure PWA install time
    - Test performance on installed PWA

20. **Run Lighthouse audits**
    - Run Lighthouse audit on checkout page
    - Review Performance score (target: 90+)
    - Review Accessibility score (target: 90+)
    - Review Best Practices score (target: 90+)
    - Review SEO score (target: 90+)
    - Review PWA score (if applicable)
    - Address failing audits

21. **Compare performance against competitors**
    - Identify 3-5 competitor checkout flows
    - Run Lighthouse audits on competitor checkouts
    - Compare load times
    - Compare bundle sizes
    - Compare user experience smoothness
    - Document competitive insights
    - Identify areas for improvement

22. **Create performance budget**
    - Define performance budget for checkout page
    - Total bundle size: <500KB
    - JavaScript bundle: <350KB
    - CSS bundle: <50KB
    - Images: <100KB
    - LCP: <2.5s
    - TTI: <3.8s
    - TBT: <200ms
    - Configure CI/CD to enforce budget

23. **Document performance optimization results**
    - Create before/after comparison
    - Document all optimizations applied
    - Document performance improvements
    - Document metrics improvement percentage
    - Create performance report
    - Share with development team

24. **Set up continuous performance monitoring**
    - Configure performance monitoring in production (e.g., New Relic, Datadog)
    - Set up Real User Monitoring (RUM)
    - Configure performance alerts (LCP >3s, etc.)
    - Set up automated Lighthouse CI
    - Create performance dashboard
    - Review performance metrics regularly

### Expected Deliverables
```
frontend/tests/performance/
├── checkout/
│   ├── loadPerformance.test.ts
│   ├── apiPerformance.test.ts
│   ├── renderingPerformance.test.ts
│   └── ...
├── reports/
│   ├── lighthouse-report.html
│   ├── bundle-analysis.html
│   ├── performance-summary.md
│   └── optimization-results.md
├── benchmarks/
│   └── performance-baselines.json
└── config/
    └── lighthouse.config.js
```

### Acceptance Criteria
- Lighthouse Performance score ≥90
- LCP <2.5s on desktop, <3s on mobile
- TTI <3.8s on desktop, <5s on mobile
- TBT <200ms
- CLS <0.1
- Bundle size <500KB (gzipped <150KB)
- API response times <500ms average
- Smooth 60fps scrolling and animations
- Acceptable performance on Slow 3G
- Performance budget defined and enforced
- Performance monitoring configured

### Testing Tools
- **Lighthouse:** Google Lighthouse CLI or Chrome DevTools
- **WebPageTest:** webpagetest.org for detailed analysis
- **Bundle Analyzer:** webpack-bundle-analyzer or Vite plugin
- **React Profiler:** React DevTools Profiler
- **Network Throttling:** Chrome DevTools Network tab
- **Monitoring:** New Relic, Datadog, Sentry, or Google Analytics

### Notes
- Test on real devices when possible, not just emulators
- Performance testing should be ongoing, not one-time
- Prioritize user-perceived performance (LCP, TTI) over technical metrics
- Balance performance with feature richness and maintainability
- Test on various network conditions and devices
- Document all performance decisions and trade-offs
- Regularly review and update performance budgets

---

## Task 98: Accessibility Testing

### Overview
Conduct comprehensive accessibility testing to ensure the checkout flow is usable by all users, including those with disabilities. Accessibility testing validates keyboard navigation, screen reader compatibility, WCAG 2.1 AA compliance, color contrast, focus management, and assistive technology support, ensuring an inclusive user experience.

### Dependencies
- Tasks 94-97: All testing completed
- All checkout features implemented
- Accessibility tools configured
- Screen reader software available for testing

### Instructions

1. **Set up accessibility testing environment**
   - Install accessibility testing tools (axe DevTools, WAVE, Lighthouse)
   - Install screen reader software (NVDA on Windows, VoiceOver on Mac)
   - Install keyboard testing utilities
   - Configure automated accessibility testing in CI/CD
   - Review WCAG 2.1 AA guidelines

2. **Create accessibility test directory**
   - Navigate to `frontend/tests/accessibility/`
   - Create `checkout/` directory
   - Create `reports/` for accessibility audit reports
   - Create accessibility checklist document

3. **Test keyboard navigation**
   - Navigate to checkout page
   - Tab through all interactive elements
   - Verify tab order is logical (top to bottom, left to right)
   - Verify all interactive elements receive focus
   - Verify focus visible indicator (outline or custom style)
   - Test Shift+Tab (reverse tab order)
   - Verify Tab does not get trapped in any component
   - Test Enter key on buttons and links
   - Verify form submission works with Enter key
   - Test Space key on checkboxes and radio buttons
   - Test Arrow keys on radio button groups
   - Test Arrow keys on dropdown selects (if custom)
   - Test Escape key closes modals/dropdowns
   - Complete entire checkout flow using only keyboard

4. **Test focus management**
   - Navigate to Step 1
   - Continue to Step 2
   - Verify focus moves to appropriate element (e.g., first input)
   - Navigate back to Step 1
   - Verify focus returns appropriately
   - Open collapsible sidebar (mobile)
   - Verify focus moves into sidebar
   - Close sidebar
   - Verify focus returns to toggle button
   - Submit form with validation errors
   - Verify focus moves to first error field
   - Open modal (if any)
   - Verify focus trapped in modal
   - Close modal
   - Verify focus returns to trigger element

5. **Test screen reader compatibility (NVDA/JAWS on Windows)**
   - Start NVDA or JAWS
   - Navigate to checkout page
   - Verify page title announced
   - Verify landmark regions announced (header, main, aside, footer)
   - Navigate through step indicator
   - Verify step numbers and labels announced
   - Verify current step announced as "current"
   - Navigate through form fields
   - Verify labels announced for each field
   - Verify required fields announced
   - Verify field descriptions announced (if any)
   - Fill form with validation errors
   - Verify error messages announced
   - Verify error associated with correct field
   - Navigate through OrderSidebar
   - Verify item names, quantities, prices announced
   - Verify subtotal, shipping, discount, total announced
   - Select shipping method
   - Verify selection announced
   - Verify shipping cost update announced (or use live region)
   - Select payment method
   - Verify selection announced
   - Complete checkout
   - Verify success message announced

6. **Test screen reader compatibility (VoiceOver on Mac/iOS)**
   - Start VoiceOver
   - Repeat all screen reader tests from Step 5
   - Test mobile Safari with VoiceOver on iOS device
   - Verify touch screen gestures work (swipe left/right to navigate)
   - Verify all content accessible via VoiceOver rotor
   - Verify headings navigation works

7. **Test ARIA attributes**
   - Verify form fields have proper labels (for attribute or aria-label)
   - Verify required fields have aria-required="true"
   - Verify invalid fields have aria-invalid="true"
   - Verify error messages have aria-describedby linking to field
   - Verify live regions use aria-live for dynamic updates (cart updates, totals)
   - Verify buttons have descriptive aria-label if text not visible
   - Verify custom dropdowns have proper ARIA (aria-expanded, aria-haspopup)
   - Verify step indicator has aria-current="step" on active step
   - Verify collapsible sections use aria-expanded
   - Verify icon-only buttons have aria-label
   - Verify hidden content has aria-hidden="true"

8. **Test semantic HTML**
   - Verify proper heading hierarchy (h1, h2, h3 - no skipped levels)
   - Verify form uses <form> element
   - Verify form fields use <label> elements
   - Verify buttons use <button> elements (not divs)
   - Verify links use <a> elements with href
   - Verify lists use <ul>/<ol> and <li>
   - Verify tables use <table>, <th>, <td> (if applicable)
   - Verify landmark regions: <header>, <main>, <aside>, <footer>
   - Verify <nav> for navigation elements

9. **Test color contrast**
   - Use axe DevTools or WAVE to check color contrast
   - Verify text meets WCAG AA contrast ratio (4.5:1 for normal text, 3:1 for large text)
   - Verify links meet contrast ratio
   - Verify button text meets contrast ratio
   - Verify error messages meet contrast ratio (often red - check carefully)
   - Verify success messages meet contrast ratio
   - Verify placeholder text meets contrast ratio (3:1 minimum)
   - Verify focus indicators meet contrast ratio (3:1 against background)
   - Test in light mode and dark mode (if implemented)

10. **Test without color perception**
    - Install color blindness simulator (e.g., Chrome extension)
    - Test checkout flow with protanopia simulation
    - Verify all information conveyed with color also has non-color indicator
    - Verify error states indicated by icon or text, not just red color
    - Verify success states indicated by icon or text, not just green color
    - Test with deuteranopia simulation
    - Test with tritanopia simulation
    - Test in grayscale
    - Verify all UI elements distinguishable without color

11. **Test form validation accessibility**
    - Leave required field empty and submit
    - Verify error message displayed visually
    - Verify error message announced by screen reader
    - Verify error message associated with field (aria-describedby)
    - Verify field marked invalid (aria-invalid="true")
    - Verify focus moved to first error field
    - Fill field with invalid data (e.g., invalid email)
    - Verify validation error message descriptive ("Please enter a valid email" not just "Error")
    - Correct error
    - Verify error message removed
    - Verify aria-invalid removed
    - Verify success feedback provided (if applicable)

12. **Test dynamic content updates**
    - Add item to cart during checkout
    - Verify sidebar updates announced by screen reader (use aria-live)
    - Apply coupon code
    - Verify discount update announced
    - Change shipping method
    - Verify shipping cost update announced
    - Verify total update announced
    - Test loading states
    - Verify loading indicator visible and announced
    - Verify "Loading" or "Please wait" message present

13. **Test error recovery accessibility**
    - Trigger network error during order submission
    - Verify error message displayed prominently
    - Verify error message announced by screen reader
    - Verify error message describes problem and solution
    - Verify "Retry" button keyboard accessible
    - Retry successfully
    - Verify success message announced

14. **Test responsive design accessibility**
    - Test on mobile viewport (375px width)
    - Verify all touch targets ≥44x44 pixels (WCAG 2.1 AA)
    - Verify no horizontal scrolling (except for scrollable content)
    - Verify text resizable to 200% without loss of functionality
    - Test with browser zoom at 200%
    - Verify layout does not break
    - Verify no content overlaps
    - Verify all functionality still accessible

15. **Test with browser extensions disabled**
    - Disable JavaScript
    - Verify critical content still accessible (forms may not work)
    - Verify no JavaScript errors
    - Enable JavaScript
    - Disable CSS
    - Verify content still readable and ordered logically
    - Enable CSS

16. **Test language and reading level**
    - Review all text content for clarity
    - Verify plain language used (avoid jargon)
    - Verify instructions are clear and concise
    - Verify error messages are helpful and actionable
    - Verify labels descriptive ("Email Address" not just "Email")
    - Verify proper language attribute on <html> tag (lang="en")

17. **Test skip navigation links**
    - Navigate to checkout page
    - Press Tab (first focus should be "Skip to main content" link if implemented)
    - Activate skip link
    - Verify focus moves to main content area
    - Test "Skip to navigation" or similar links (if implemented)

18. **Test modal/dialog accessibility**
    - Open any modal (if present in checkout)
    - Verify focus trapped in modal (Tab does not leave modal)
    - Verify Escape key closes modal
    - Verify close button keyboard accessible
    - Close modal
    - Verify focus returns to trigger element
    - Verify modal has proper ARIA (role="dialog", aria-labelledby, aria-describedby)
    - Verify modal overlay prevents interaction with background content

19. **Test form autocomplete**
    - Verify form fields have appropriate autocomplete attributes
    - Email: autocomplete="email"
    - Name: autocomplete="name" or "given-name" "family-name"
    - Address: autocomplete="address-line1", "address-line2"
    - City: autocomplete="address-level2"
    - Postal code: autocomplete="postal-code"
    - Country: autocomplete="country"
    - Card number: autocomplete="cc-number"
    - CVV: autocomplete="cc-csc"
    - Expiry: autocomplete="cc-exp"
    - Test browser autofill works correctly

20. **Run automated accessibility audits**
    - Run axe DevTools audit on checkout page
    - Review all violations
    - Prioritize critical and serious issues
    - Run Lighthouse accessibility audit
    - Aim for Lighthouse Accessibility score ≥95
    - Run WAVE (WebAIM) audit
    - Review all errors and alerts
    - Run Pa11y or similar automated tool
    - Document all issues

21. **Test with assistive technologies**
    - Test with browser zoom (up to 400%)
    - Test with Windows High Contrast Mode
    - Test with browser Reader Mode
    - Test with voice control (e.g., Dragon NaturallySpeaking, Voice Control on Mac)
    - Verify all actions can be performed via voice commands
    - Test with switch control (if possible)

22. **Create WCAG 2.1 compliance checklist**
    - Review WCAG 2.1 Level AA success criteria
    - Create checklist for checkout flow
    - Test each criterion
    - Document compliance status
    - Document non-compliant areas
    - Create remediation plan for non-compliant areas

23. **Document accessibility issues**
    - Create accessibility audit report
    - Document all issues found
    - Categorize by severity (Critical, High, Medium, Low)
    - Assign each issue to developer
    - Track issue resolution
    - Re-test after fixes applied

24. **Fix accessibility issues and retest**
    - Address critical issues first
    - Fix all WCAG 2.1 AA violations
    - Add missing ARIA attributes
    - Improve focus management
    - Fix color contrast issues
    - Improve error message quality
    - Add missing labels
    - Fix heading hierarchy
    - Re-run automated audits
    - Re-test with screen readers
    - Re-test keyboard navigation
    - Verify all issues resolved
    - Document final accessibility status

### Expected Deliverables
```
frontend/tests/accessibility/
├── checkout/
│   ├── keyboardNavigation.test.ts
│   ├── screenReader.test.ts
│   ├── ariaAttributes.test.ts
│   ├── colorContrast.test.ts
│   └── ...
├── reports/
│   ├── axe-report.json
│   ├── lighthouse-a11y-report.html
│   ├── wave-report.pdf
│   ├── accessibility-audit.md
│   └── wcag-checklist.md
└── config/
    └── axe-config.js
```

### Acceptance Criteria
- Lighthouse Accessibility score ≥95
- Zero critical or serious axe violations
- Complete keyboard navigation support (entire checkout flow)
- Screen reader compatible (NVDA, JAWS, VoiceOver)
- WCAG 2.1 AA compliant
- Color contrast ratios meet AA standards (4.5:1)
- All form fields properly labeled
- Error messages descriptive and announced
- Focus management correct throughout flow
- Responsive design accessible at 200% zoom
- All touch targets ≥44x44 pixels on mobile
- ARIA attributes used correctly
- Semantic HTML used throughout

### Testing Tools
- **Automated:** axe DevTools, Lighthouse, WAVE, Pa11y
- **Screen Readers:** NVDA (Windows), JAWS (Windows), VoiceOver (Mac/iOS)
- **Contrast:** Colour Contrast Analyser, axe DevTools
- **Keyboard:** Manual testing
- **Color Blindness:** Chrome DevTools Vision Deficiency Simulator
- **Browser Extensions:** WAVE Extension, axe DevTools Extension

### Notes
- Accessibility is not optional - it's required by law in many jurisdictions (ADA, Section 508)
- Test with actual users with disabilities when possible
- Automated tools catch only ~30% of accessibility issues - manual testing essential
- Involve accessibility experts for comprehensive audit
- Prioritize keyboard navigation and screen reader support
- Consider accessibility from the beginning, not as an afterthought
- Document all accessibility decisions and rationale
- Provide accessibility training to development team

---

## Summary

This document covered Tasks 94-98, establishing a comprehensive testing strategy for the checkout flow:

- **Task 94 - Unit Testing:** Tested individual components, validation functions, stores, and utilities in isolation
- **Task 95 - Integration Testing:** Validated multi-component interactions, data persistence, and API integrations
- **Task 96 - E2E Testing:** Simulated complete user flows in real browser environments
- **Task 97 - Performance Testing:** Measured and optimized load times, bundle size, and rendering performance
- **Task 98 - Accessibility Testing:** Ensured keyboard navigation, screen reader support, and WCAG compliance

### Testing Coverage
- ✅ Unit tests for all components
- ✅ Integration tests for checkout flows
- ✅ E2E tests for guest and logged-in scenarios
- ✅ Performance optimized (Lighthouse 90+)
- ✅ Accessibility compliant (WCAG 2.1 AA)

### Quality Metrics
- Unit test coverage: ≥80%
- Integration test pass rate: 100%
- E2E test pass rate: 100%
- Lighthouse Performance: ≥90
- Lighthouse Accessibility: ≥95
- LCP: <2.5s, TTI: <3.8s, CLS: <0.1
- WCAG 2.1 AA: Compliant

### Next Steps
With comprehensive testing completed, the checkout flow is production-ready. The next SubPhase (SubPhase-08_Customer-Authentication) will implement user registration, login, password recovery, and account management features.

---

**End of Document**  
**End of Group F: Order Sidebar & Testing**  
**End of SubPhase 07: Checkout Flow**
