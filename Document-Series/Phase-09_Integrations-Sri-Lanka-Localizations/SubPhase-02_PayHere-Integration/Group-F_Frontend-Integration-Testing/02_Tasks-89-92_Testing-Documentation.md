# Tasks 89-92: Sandbox Testing, Test Cards, E2E Tests, and Documentation

> **Phase:** 09 - Integrations & Sri Lanka Localizations  
> **SubPhase:** 02 - PayHere Integration  
> **Group:** F - Frontend Integration & Testing  
> **Document:** 02 of 02  
> **Tasks Covered:** 89, 90, 91, 92

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-81-88_Types-Hook-Components.md](01_Tasks-81-88_Types-Hook-Components.md)
- **→ Next Group:** None (Last Group)
- **→ Next SubPhase:** [SubPhase-03_WebXPay-Integration](../../SubPhase-03_WebXPay-Integration/)

---

## Document Overview

Implement comprehensive testing for PayHere integration using sandbox environment and test cards. Create end-to-end payment flow tests to validate complete payment cycle. Document integration for future developers and maintainers.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 89 | Create Sandbox Tests | Medium | 45 min |
| 90 | Create Test Cards | Low | 20 min |
| 91 | Create E2E Payment Test | High | 60 min |
| 92 | Create PayHere Documentation | Medium | 40 min |

---

## Task 89: Create Sandbox Tests

### Overview
Create comprehensive test suite for PayHere integration using sandbox environment. Implement tests for payment initiation, webhook handling, payment verification, refunds, and error scenarios. Use PayHere sandbox environment to test without real transactions.

### Dependencies
- Task 80: Verify Refund Processing (backend complete)
- PayHere sandbox account configured
- Test environment setup complete

### Instructions

1. **Create test file**
   - Navigate to `frontend/__tests__/payments/` directory
   - Create file `payhere-sandbox.test.ts`
   - Import testing utilities (Jest, React Testing Library)
   - Import PayHere client and hooks

2. **Set up sandbox environment**
   - Configure sandbox mode in test environment
   - Set PAYHERE_SANDBOX=true
   - Use sandbox merchant ID
   - Use sandbox merchant secret
   - Point to sandbox URLs

3. **Create test setup**
   - Create beforeAll hook to setup test environment
   - Create afterAll hook to cleanup
   - Create beforeEach hook to reset state
   - Mock API responses where needed

4. **Test payment initiation**
   - Create test "should initiate payment in sandbox"
   - Call initiatePayHerePayment with test order
   - Assert response contains payment_intent_id
   - Assert response contains redirect_url
   - Assert redirect_url points to sandbox domain

5. **Test redirect URL format**
   - Create test "should use sandbox URL in sandbox mode"
   - Initiate payment
   - Check redirect_url contains "sandbox.payhere.lk"
   - Verify production URL not used

6. **Test form data generation**
   - Create test "should generate valid form data"
   - Initiate payment
   - Assert form_data contains all required fields
   - Assert merchant_id matches sandbox merchant
   - Assert hash is properly generated
   - Assert amount is formatted correctly

7. **Test webhook signature verification**
   - Create test "should verify webhook signature"
   - Create mock webhook payload
   - Generate valid signature
   - Send webhook request
   - Assert signature validated successfully

8. **Test invalid webhook signature**
   - Create test "should reject invalid webhook signature"
   - Create mock webhook payload
   - Generate invalid signature
   - Send webhook request
   - Assert webhook rejected
   - Assert error logged

9. **Test payment verification**
   - Create test "should verify payment status"
   - Create test payment intent
   - Simulate payment success in sandbox
   - Call verifyPayHerePayment
   - Assert status is SUCCESS
   - Assert payment details correct

10. **Test refund processing**
    - Create test "should process refund in sandbox"
    - Create successful payment
    - Call refundPayHerePayment
    - Assert refund accepted
    - Assert refund ID returned
    - Verify refund in database

11. **Test error scenarios**
    - Create test "should handle payment failure"
    - Simulate failed payment
    - Assert error handled gracefully
    - Assert order status updated correctly

12. **Create test utilities**
    - Create helper function `createTestOrder()`
    - Create helper function `createTestPayment()`
    - Create helper function `generateValidHash()`
    - Create helper function `mockWebhookPayload()`
    - Export utilities for reuse

### Sandbox Test Structure

```
Sandbox Test Suite
│
├─ Setup & Teardown
│  ├─ beforeAll: Setup sandbox environment
│  ├─ afterAll: Cleanup
│  └─ beforeEach: Reset state
│
├─ Payment Initiation Tests
│  ├─ Test: Initiate payment in sandbox
│  ├─ Test: Use sandbox URL
│  ├─ Test: Generate valid form data
│  └─ Test: Handle initiation errors
│
├─ Webhook Tests
│  ├─ Test: Verify valid signature
│  ├─ Test: Reject invalid signature
│  ├─ Test: Parse webhook payload
│  ├─ Test: Handle success status
│  ├─ Test: Handle failed status
│  └─ Test: Handle pending status
│
├─ Verification Tests
│  ├─ Test: Verify payment status
│  ├─ Test: Match payment intent
│  ├─ Test: Handle verification errors
│  └─ Test: Handle missing payment
│
├─ Refund Tests
│  ├─ Test: Process full refund
│  ├─ Test: Process partial refund
│  ├─ Test: Handle refund errors
│  └─ Test: Validate refund amount
│
├─ Error Handling Tests
│  ├─ Test: Network errors
│  ├─ Test: Timeout errors
│  ├─ Test: Invalid data errors
│  └─ Test: API errors
│
└─ Integration Tests
   ├─ Test: Complete payment flow
   ├─ Test: Order status updates
   └─ Test: Transaction records
```

### Sandbox Configuration

Document sandbox configuration:

**Environment Variables**
```
PAYHERE_SANDBOX=true
PAYHERE_MERCHANT_ID=1234567
PAYHERE_MERCHANT_SECRET=sandbox_secret_key
PAYHERE_NOTIFY_URL=https://testdomain.com/api/webhooks/payhere/
PAYHERE_RETURN_URL=https://testdomain.com/checkout/success
PAYHERE_CANCEL_URL=https://testdomain.com/checkout/cancel
```

**Sandbox URLs**
```
Checkout URL: https://sandbox.payhere.lk/pay
Verify URL: https://sandbox.payhere.lk/api/v2/payment/verify
Refund URL: https://sandbox.payhere.lk/api/v2/payment/refund
```

**Sandbox Merchant**
- Merchant ID: Use test merchant ID from PayHere
- Merchant Secret: Use test merchant secret
- Available in PayHere sandbox dashboard

### Test Examples

Provide test code examples:

**Example 1: Payment Initiation Test**
```
describe('PayHere Sandbox - Payment Initiation', () => {
  it('should initiate payment in sandbox mode', async () => {
    const order = createTestOrder();
    
    const response = await initiatePayHerePayment({
      order_id: order.id,
      gateway: 'payhere'
    });
    
    expect(response.success).toBe(true);
    expect(response.payment_intent_id).toBeDefined();
    expect(response.redirect_url).toContain('sandbox.payhere.lk');
    expect(response.form_data.merchant_id).toBe(SANDBOX_MERCHANT_ID);
  });
  
  it('should generate valid MD5 hash', async () => {
    const order = createTestOrder();
    const response = await initiatePayHerePayment({
      order_id: order.id,
      gateway: 'payhere'
    });
    
    const { form_data } = response;
    const expectedHash = generateValidHash(form_data);
    
    expect(form_data.hash).toBe(expectedHash);
    expect(form_data.hash).toHaveLength(32);
    expect(form_data.hash).toMatch(/^[A-F0-9]{32}$/);
  });
});
```

**Example 2: Webhook Signature Test**
```
describe('PayHere Sandbox - Webhook Signature', () => {
  it('should accept valid webhook signature', async () => {
    const payload = mockWebhookPayload({
      order_id: 'TEST-001',
      status_code: 2,
      payhere_amount: '5000.00'
    });
    
    const validSignature = generateValidHash(payload);
    payload.md5sig = validSignature;
    
    const response = await POST('/api/webhooks/payhere/', payload);
    
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
  });
  
  it('should reject invalid webhook signature', async () => {
    const payload = mockWebhookPayload({
      order_id: 'TEST-001',
      status_code: 2
    });
    
    payload.md5sig = 'INVALID_SIGNATURE';
    
    const response = await POST('/api/webhooks/payhere/', payload);
    
    expect(response.status).toBe(200); // Still 200 to prevent retries
    expect(response.body.success).toBe(false);
    expect(response.body.error).toContain('signature');
  });
});
```

**Example 3: End-to-End Flow Test**
```
describe('PayHere Sandbox - E2E Flow', () => {
  it('should complete full payment flow', async () => {
    // 1. Create order
    const order = await createTestOrder();
    
    // 2. Initiate payment
    const initResponse = await initiatePayHerePayment({
      order_id: order.id,
      gateway: 'payhere'
    });
    
    expect(initResponse.success).toBe(true);
    
    // 3. Simulate webhook notification
    const webhookPayload = mockWebhookPayload({
      order_id: order.id,
      status_code: 2,
      payment_id: '320012345678'
    });
    
    await POST('/api/webhooks/payhere/', webhookPayload);
    
    // 4. Verify payment
    const verifyResponse = await verifyPayHerePayment({
      order_id: order.id,
      payment_intent_id: initResponse.payment_intent_id
    });
    
    expect(verifyResponse.success).toBe(true);
    expect(verifyResponse.status).toBe(PayHereStatus.SUCCESS);
    
    // 5. Check order status
    const updatedOrder = await fetchOrder(order.id);
    expect(updatedOrder.status).toBe('paid');
    expect(updatedOrder.payment_id).toBe('320012345678');
  });
});
```

### Test Utilities

Create reusable test utilities:

**createTestOrder()**
```
function createTestOrder(overrides = {}) {
  return {
    id: `TEST-${Date.now()}`,
    total: 5000,
    currency: 'LKR',
    customer: {
      first_name: 'John',
      last_name: 'Doe',
      email: 'john@test.com',
      phone: '+94771234567',
      address: '123 Test St',
      city: 'Colombo',
      country: 'Sri Lanka'
    },
    items: [
      {
        name: 'Test Product',
        quantity: 1,
        price: 5000
      }
    ],
    ...overrides
  };
}
```

**mockWebhookPayload()**
```
function mockWebhookPayload(overrides = {}) {
  const payload = {
    merchant_id: SANDBOX_MERCHANT_ID,
    order_id: 'TEST-001',
    payhere_amount: '5000.00',
    payhere_currency: 'LKR',
    status_code: 2,
    payment_id: '320012345678',
    method: 'VISA',
    card_holder_name: 'John Doe',
    card_no: '************1234',
    ...overrides
  };
  
  // Generate valid signature
  payload.md5sig = generateValidHash(payload);
  
  return payload;
}
```

**generateValidHash()**
```
function generateValidHash(data) {
  const {
    merchant_id,
    order_id,
    payhere_amount,
    payhere_currency,
    status_code
  } = data;
  
  const hashString = `${merchant_id}${order_id}${payhere_amount}${payhere_currency}${status_code}${SANDBOX_MERCHANT_SECRET}`;
  
  return crypto.createHash('md5').update(hashString).digest('hex').toUpperCase();
}
```

### Running Sandbox Tests

**Test Commands**
```
# Run all PayHere sandbox tests
npm test payhere-sandbox

# Run with coverage
npm test payhere-sandbox -- --coverage

# Run in watch mode
npm test payhere-sandbox -- --watch

# Run specific test file
npm test payhere-sandbox.test.ts
```

**Environment Setup**
```
# Set sandbox environment variables
export PAYHERE_SANDBOX=true
export PAYHERE_MERCHANT_ID=1234567
export PAYHERE_MERCHANT_SECRET=test_secret

# Run tests
npm test
```

### Expected Output

After completing this task:
- File `frontend/__tests__/payments/payhere-sandbox.test.ts` created
- Sandbox environment configured
- Payment initiation tests implemented
- Webhook signature tests implemented
- Payment verification tests implemented
- Refund processing tests implemented
- Error handling tests implemented
- Test utilities created
- All tests passing
- Test coverage > 80%

---

## Task 90: Create Test Cards

### Overview
Document PayHere test cards for sandbox testing. Create test card reference with card numbers, CVVs, expiry dates, and expected outcomes. Enable developers to test different payment scenarios including success, failure, insufficient funds, and card decline.

### Dependencies
- Task 89: Create Sandbox Tests (sandbox configured)
- PayHere sandbox documentation reviewed

### Instructions

1. **Create test cards documentation file**
   - Navigate to `frontend/docs/` or project documentation directory
   - Create file `payhere-test-cards.md`
   - Document all available test cards

2. **Document PayHere test cards**
   - List all test card numbers provided by PayHere
   - Include card type (Visa, Mastercard, Amex)
   - Include test CVV codes
   - Include test expiry dates
   - Include expected outcomes

3. **Create success test cards**
   - Document cards that result in successful payment
   - Include Visa test card
   - Include Mastercard test card
   - Include Amex test card (if supported)
   - Specify expected behavior

4. **Create failure test cards**
   - Document cards that result in payment failure
   - Include reason for failure
   - Include declined card
   - Include insufficient funds card
   - Include invalid card

5. **Document test card usage**
   - Explain how to use test cards
   - Explain sandbox limitations
   - Explain test vs production behavior
   - Provide usage examples

6. **Create test scenarios**
   - Scenario 1: Successful Visa payment
   - Scenario 2: Successful Mastercard payment
   - Scenario 3: Declined payment
   - Scenario 4: Insufficient funds
   - Scenario 5: Invalid card details

7. **Document test customer data**
   - Document test names for card holder
   - Document test addresses
   - Document test phone numbers
   - Document test email addresses

8. **Add test OTP codes**
   - Document OTP codes for 3D Secure (if applicable)
   - Document successful OTP
   - Document failed OTP

9. **Create test card table**
   - Create comprehensive table of test cards
   - Include all relevant information
   - Make easy to reference
   - Keep updated with PayHere changes

10. **Add warnings and notes**
    - Note that test cards only work in sandbox
    - Note that real cards will fail in sandbox
    - Note rate limiting in sandbox
    - Note any sandbox limitations

11. **Include in developer documentation**
    - Link from main documentation
    - Add to testing guide
    - Add to integration guide
    - Make easily discoverable

12. **Keep documentation updated**
    - Note date of last update
    - Note source of information
    - Add contact for questions
    - Plan periodic review

### Test Cards Reference

Document all PayHere test cards:

#### Success Test Cards

| Card Type | Card Number | CVV | Expiry | Expected Result |
|-----------|-------------|-----|--------|-----------------|
| Visa | 4111 1111 1111 1111 | 123 | 12/25 | Payment Success |
| Mastercard | 5123 4567 8901 2346 | 123 | 12/25 | Payment Success |
| Amex | 3782 822463 10005 | 1234 | 12/25 | Payment Success |

#### Failure Test Cards

| Card Type | Card Number | CVV | Expiry | Expected Result | Reason |
|-----------|-------------|-----|--------|-----------------|--------|
| Visa | 4000 0000 0000 0002 | 123 | 12/25 | Payment Declined | Card Declined |
| Visa | 4000 0000 0000 9995 | 123 | 12/25 | Payment Failed | Insufficient Funds |
| Visa | 4000 0000 0000 0127 | 123 | 12/25 | Payment Failed | Invalid CVV |
| Visa | 4000 0000 0000 0069 | 123 | 01/20 | Payment Failed | Card Expired |

#### 3D Secure Test Cards (if applicable)

| Card Type | Card Number | CVV | Expiry | OTP | Result |
|-----------|-------------|-----|--------|-----|--------|
| Visa 3DS | 4000 0000 0000 3220 | 123 | 12/25 | 1234 | Success with 3DS |
| Visa 3DS Failed | 4000 0000 0000 3063 | 123 | 12/25 | - | 3DS Auth Failed |

### Test Customer Data

Document test customer information:

**Test Card Holder Names**
- Success: John Doe
- Success: Jane Smith
- Decline: DECLINE TEST
- Insufficient Funds: NO FUNDS

**Test Billing Addresses**
```
Street: 123 Test Street
City: Colombo
Country: Sri Lanka
Postal Code: 10100
```

**Test Contact Information**
```
Email: test@payhere.lk
Phone: +94771234567
```

### Test Scenarios

Provide detailed test scenarios:

**Scenario 1: Successful Visa Payment**
```
Card Number: 4111 1111 1111 1111
CVV: 123
Expiry: 12/25
Name: John Doe
Amount: LKR 5,000.00

Expected Result:
- Payment initiated successfully
- Redirect to PayHere sandbox
- Payment processed successfully
- Webhook sent with status_code = 2
- Order marked as paid
```

**Scenario 2: Declined Payment**
```
Card Number: 4000 0000 0000 0002
CVV: 123
Expiry: 12/25
Name: DECLINE TEST
Amount: LKR 5,000.00

Expected Result:
- Payment initiated successfully
- Redirect to PayHere sandbox
- Payment declined
- Webhook sent with status_code = -2
- Order remains unpaid
- Error message shown
```

**Scenario 3: Insufficient Funds**
```
Card Number: 4000 0000 0000 9995
CVV: 123
Expiry: 12/25
Name: NO FUNDS
Amount: LKR 5,000.00

Expected Result:
- Payment initiated successfully
- Redirect to PayHere sandbox
- Payment failed due to insufficient funds
- Webhook sent with status_code = -2
- Order remains unpaid
- Error message: "Insufficient funds"
```

**Scenario 4: User Cancels Payment**
```
Card Number: Any test card
Action: Click "Cancel" on PayHere page

Expected Result:
- Redirect to cancel URL
- Order remains in pending status
- No webhook sent
- User can retry payment
```

### Usage Instructions

**How to Use Test Cards**

1. **Enable Sandbox Mode**
   - Set PAYHERE_SANDBOX=true in environment
   - Use sandbox merchant credentials
   - Verify sandbox URLs are used

2. **Create Test Order**
   - Create order in application
   - Proceed to checkout
   - Select PayHere payment method

3. **Enter Test Card Details**
   - Use card number from test cards table
   - Enter corresponding CVV
   - Enter valid future expiry date
   - Enter test card holder name

4. **Complete Payment**
   - Submit payment form
   - Redirected to PayHere sandbox
   - Enter card details again on PayHere page
   - Confirm payment

5. **Verify Result**
   - Wait for redirect back to application
   - Check success or cancel page
   - Verify order status updated
   - Check webhook received
   - Verify transaction record created

### Important Notes

**Sandbox Limitations**
- Test cards only work in sandbox environment
- Real cards will fail in sandbox mode
- Production cards will not work in sandbox
- Sandbox has rate limits
- Sandbox may have delayed processing
- Some features may not be available in sandbox

**Testing Best Practices**
- Always test success scenarios first
- Test all failure scenarios
- Test edge cases (expired cards, invalid CVV)
- Test user cancellation
- Test timeout scenarios
- Test webhook retry mechanism
- Test concurrent payments

**Switching to Production**
- Change PAYHERE_SANDBOX to false
- Update merchant credentials to production
- Update URLs to production
- Test with real small amount first
- Monitor first transactions closely
- Have rollback plan ready

### Documentation Structure

```
payhere-test-cards.md
│
├─ Introduction
│  └─ Purpose of test cards
│
├─ Success Test Cards
│  ├─ Visa
│  ├─ Mastercard
│  └─ Amex
│
├─ Failure Test Cards
│  ├─ Declined
│  ├─ Insufficient Funds
│  ├─ Invalid CVV
│  └─ Expired
│
├─ 3D Secure Test Cards
│  ├─ Success with 3DS
│  └─ Failed 3DS
│
├─ Test Customer Data
│  ├─ Names
│  ├─ Addresses
│  └─ Contact Info
│
├─ Test Scenarios
│  ├─ Scenario 1: Success
│  ├─ Scenario 2: Decline
│  ├─ Scenario 3: Insufficient Funds
│  └─ Scenario 4: Cancellation
│
├─ Usage Instructions
│  └─ Step-by-step guide
│
├─ Important Notes
│  ├─ Sandbox limitations
│  ├─ Best practices
│  └─ Production migration
│
└─ References
   └─ PayHere documentation links
```

### Expected Output

After completing this task:
- File `frontend/docs/payhere-test-cards.md` created
- All PayHere test cards documented
- Success test cards listed
- Failure test cards listed
- Test customer data documented
- Test scenarios provided
- Usage instructions included
- Important notes added
- Documentation linked from main docs
- Easy to reference and use

---

## Task 91: Create E2E Payment Test

### Overview
Create comprehensive end-to-end test for complete PayHere payment flow. Implement automated test that simulates user journey from cart to successful payment, including checkout, PayHere redirect, payment processing, webhook handling, and order confirmation. Use Playwright or similar E2E testing framework.

### Dependencies
- Task 90: Create Test Cards (test cards available)
- Task 89: Create Sandbox Tests (sandbox configured)
- E2E testing framework installed (Playwright/Cypress)

### Instructions

1. **Set up E2E testing framework**
   - Install Playwright or Cypress
   - Configure E2E testing environment
   - Set up test database
   - Configure sandbox environment variables

2. **Create E2E test file**
   - Navigate to `frontend/e2e/` or `__tests__/e2e/` directory
   - Create file `payhere-payment-flow.spec.ts`
   - Import testing utilities
   - Import test helpers

3. **Create test setup**
   - Create beforeAll hook
   - Seed test database with products
   - Create test user account
   - Set up API mocks if needed
   - Configure browser for testing

4. **Implement test: Add products to cart**
   - Navigate to product page
   - Click "Add to Cart" button
   - Verify cart count updated
   - Verify cart contains product
   - Proceed to checkout

5. **Implement test: Checkout process**
   - Fill in shipping address
   - Fill in contact information
   - Verify order summary displayed
   - Verify total amount correct
   - Proceed to payment

6. **Implement test: Select PayHere payment**
   - Verify payment methods displayed
   - Click PayHere payment option
   - Verify PayHere selected
   - Click "Pay Now" button
   - Wait for payment initiation

7. **Implement test: PayHere redirect**
   - Verify redirect to PayHere sandbox
   - Verify URL contains "sandbox.payhere.lk"
   - Verify order amount displayed correctly
   - Verify merchant name displayed
   - Wait for PayHere page load

8. **Implement test: Enter card details**
   - Wait for card form to load
   - Fill in test card number
   - Fill in test CVV
   - Fill in test expiry date
   - Fill in card holder name
   - Click "Pay" button on PayHere

9. **Implement test: Payment processing**
   - Wait for payment processing
   - Handle loading states
   - Wait for redirect back to application
   - Verify redirected to success page

10. **Implement test: Success page verification**
    - Verify success page URL
    - Verify success message displayed
    - Verify order number displayed
    - Verify payment confirmed message
    - Verify order summary shown

11. **Implement test: Webhook verification**
    - Wait for webhook processing (may need delay)
    - Verify order status updated in database
    - Verify payment record created
    - Verify transaction saved
    - Verify customer notified

12. **Create failure scenario tests**
    - Test payment decline
    - Test user cancellation
    - Test timeout
    - Test network errors
    - Verify error handling

### E2E Test Flow Diagram

```
E2E Payment Test Flow
│
├─ Setup
│  ├─ Start browser
│  ├─ Seed database
│  ├─ Create test user
│  └─ Set sandbox mode
│
├─ Step 1: Add to Cart
│  ├─ Navigate to product page
│  ├─ Click "Add to Cart"
│  ├─ Verify cart updated
│  └─ Go to cart
│
├─ Step 2: Checkout
│  ├─ Click "Checkout"
│  ├─ Fill shipping address
│  ├─ Fill contact info
│  ├─ Verify order summary
│  └─ Continue to payment
│
├─ Step 3: Select PayHere
│  ├─ Verify payment methods
│  ├─ Select PayHere
│  ├─ Click "Pay Now"
│  └─ Wait for redirect
│
├─ Step 4: PayHere Payment
│  ├─ Verify on PayHere domain
│  ├─ Wait for form load
│  ├─ Enter test card
│  ├─ Enter CVV and expiry
│  ├─ Click "Pay"
│  └─ Wait for processing
│
├─ Step 5: Return to Site
│  ├─ Wait for redirect
│  ├─ Verify success URL
│  ├─ Verify success message
│  └─ Verify order details
│
├─ Step 6: Verify Backend
│  ├─ Check order status (paid)
│  ├─ Check payment record
│  ├─ Check transaction record
│  └─ Check webhook received
│
└─ Cleanup
   ├─ Close browser
   └─ Clean test data
```

### Test Implementation

Provide E2E test code structure:

**Main Test Suite**
```
describe('PayHere E2E Payment Flow', () => {
  let page: Page;
  let orderId: string;
  
  beforeAll(async () => {
    // Setup browser and database
    page = await browser.newPage();
    await seedDatabase();
  });
  
  afterAll(async () => {
    await page.close();
    await cleanupDatabase();
  });
  
  it('should complete full payment flow', async () => {
    // Test implementation
  });
});
```

**Step 1: Add Product to Cart**
```
// Navigate to product page
await page.goto('http://localhost:3000/products/test-product');

// Add to cart
await page.click('[data-testid="add-to-cart"]');

// Verify cart updated
await page.waitForSelector('[data-testid="cart-count"]');
const cartCount = await page.textContent('[data-testid="cart-count"]');
expect(cartCount).toBe('1');

// Go to cart
await page.click('[data-testid="cart-icon"]');
await page.waitForSelector('[data-testid="cart-page"]');
```

**Step 2: Checkout Process**
```
// Click checkout
await page.click('[data-testid="checkout-button"]');
await page.waitForSelector('[data-testid="checkout-form"]');

// Fill shipping address
await page.fill('[name="firstName"]', 'John');
await page.fill('[name="lastName"]', 'Doe');
await page.fill('[name="email"]', 'john@test.com');
await page.fill('[name="phone"]', '+94771234567');
await page.fill('[name="address"]', '123 Test St');
await page.fill('[name="city"]', 'Colombo');

// Continue to payment
await page.click('[data-testid="continue-to-payment"]');
await page.waitForSelector('[data-testid="payment-methods"]');
```

**Step 3: Select PayHere Payment**
```
// Select PayHere
await page.click('[data-testid="payment-method-payhere"]');

// Verify selected
const selected = await page.getAttribute(
  '[data-testid="payment-method-payhere"]',
  'data-selected'
);
expect(selected).toBe('true');

// Click Pay Now
await page.click('[data-testid="pay-now-button"]');

// Wait for redirect
await page.waitForNavigation({ timeout: 10000 });
```

**Step 4: PayHere Payment**
```
// Verify on PayHere domain
const url = page.url();
expect(url).toContain('sandbox.payhere.lk');

// Wait for PayHere form
await page.waitForSelector('#card_number', { timeout: 15000 });

// Fill card details
await page.fill('#card_number', '4111111111111111');
await page.fill('#cvv', '123');
await page.fill('#expiry_month', '12');
await page.fill('#expiry_year', '2025');
await page.fill('#card_holder_name', 'John Doe');

// Submit payment
await page.click('#submit_payment');

// Wait for processing and redirect
await page.waitForNavigation({ timeout: 30000 });
```

**Step 5: Verify Success**
```
// Verify success URL
const successUrl = page.url();
expect(successUrl).toContain('/checkout/success');

// Verify success message
const heading = await page.textContent('h1');
expect(heading).toContain('Payment Successful');

// Verify order number displayed
await page.waitForSelector('[data-testid="order-number"]');
const orderNumber = await page.textContent('[data-testid="order-number"]');
expect(orderNumber).toBeTruthy();
orderId = orderNumber;

// Verify order total
const total = await page.textContent('[data-testid="order-total"]');
expect(total).toBeTruthy();
```

**Step 6: Backend Verification**
```
// Wait for webhook processing
await new Promise(resolve => setTimeout(resolve, 2000));

// Verify order status in database
const order = await getOrder(orderId);
expect(order.status).toBe('paid');
expect(order.payment_method).toBe('payhere');
expect(order.payment_id).toBeTruthy();

// Verify payment record
const payment = await getPaymentByOrderId(orderId);
expect(payment).toBeTruthy();
expect(payment.status).toBe('success');
expect(payment.gateway).toBe('payhere');

// Verify transaction record
const transaction = await getTransactionByOrderId(orderId);
expect(transaction).toBeTruthy();
expect(transaction.amount).toBe(order.total);
```

### Failure Scenario Tests

**Test: Payment Decline**
```
it('should handle payment decline', async () => {
  // Setup and navigate to payment
  await setupPaymentFlow();
  
  // Use decline test card
  await fillCardDetails({
    cardNumber: '4000000000000002',
    cvv: '123',
    expiry: '12/25',
    name: 'DECLINE TEST'
  });
  
  // Submit payment
  await page.click('#submit_payment');
  
  // Wait for error or cancel redirect
  await page.waitForNavigation({ timeout: 30000 });
  
  // Verify on cancel page or error shown
  const url = page.url();
  expect(url).toMatch(/\/(cancel|error)/);
  
  // Verify order still pending
  const order = await getOrder(orderId);
  expect(order.status).toBe('pending');
});
```

**Test: User Cancellation**
```
it('should handle user cancellation', async () => {
  await setupPaymentFlow();
  
  // Click cancel on PayHere page
  await page.click('#cancel_payment');
  
  // Wait for redirect to cancel page
  await page.waitForNavigation();
  
  // Verify on cancel page
  expect(page.url()).toContain('/checkout/cancel');
  
  // Verify cancellation message
  const message = await page.textContent('h1');
  expect(message).toContain('Payment Canceled');
  
  // Verify order status
  const order = await getOrder(orderId);
  expect(order.status).toBe('pending');
});
```

### Test Configuration

**Playwright Configuration**
```
// playwright.config.ts
export default {
  testDir: './e2e',
  timeout: 60000,
  use: {
    baseURL: 'http://localhost:3000',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
};
```

**Environment Variables**
```
# .env.test
NEXT_PUBLIC_API_URL=http://localhost:8000
PAYHERE_SANDBOX=true
PAYHERE_MERCHANT_ID=test_merchant
PAYHERE_MERCHANT_SECRET=test_secret
DATABASE_URL=postgresql://test:test@localhost:5432/testdb
```

### Running E2E Tests

**Test Commands**
```
# Run all E2E tests
npm run test:e2e

# Run in headed mode (see browser)
npm run test:e2e -- --headed

# Run specific test
npm run test:e2e -- payhere-payment-flow

# Debug mode
npm run test:e2e -- --debug

# Generate HTML report
npm run test:e2e -- --reporter=html
```

**CI/CD Integration**
```
# .github/workflows/e2e-tests.yml
name: E2E Tests

on: [push, pull_request]

jobs:
  e2e:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
      - run: npm install
      - run: npm run build
      - run: npm run test:e2e
```

### Expected Output

After completing this task:
- File `frontend/e2e/payhere-payment-flow.spec.ts` created
- E2E testing framework configured
- Full payment flow test implemented
- Add to cart step tested
- Checkout process tested
- PayHere redirect tested
- Payment processing tested
- Success verification tested
- Backend verification tested
- Failure scenarios tested
- Test configuration complete
- Tests passing in CI/CD
- Test reports generated

---

## Task 92: Create PayHere Documentation

### Overview
Create comprehensive documentation for PayHere integration. Document architecture, setup process, configuration, API usage, testing procedures, troubleshooting, and maintenance. Provide clear guide for developers to understand, implement, and maintain PayHere payment gateway integration.

### Dependencies
- Task 91: Create E2E Payment Test (integration complete)
- All previous tasks complete
- Integration tested and verified

### Instructions

1. **Create main documentation file**
   - Navigate to `docs/integrations/` directory
   - Create file `payhere-integration.md`
   - Structure comprehensive documentation
   - Use clear headings and sections

2. **Write overview section**
   - Explain what PayHere is
   - Explain why we use PayHere
   - List supported payment methods
   - List supported features
   - Explain integration approach

3. **Document architecture**
   - Create architecture diagram
   - Explain component structure
   - Explain data flow
   - Explain backend components
   - Explain frontend components

4. **Document setup process**
   - Prerequisites and requirements
   - PayHere account setup
   - Merchant configuration
   - Environment variables
   - Database migrations
   - Dependencies installation

5. **Document configuration**
   - Environment variables reference
   - Configuration file structure
   - Sandbox vs production settings
   - Security best practices
   - Credential management

6. **Document backend implementation**
   - PayHereProcessor class
   - Payment initiation flow
   - Webhook handling
   - Signature verification
   - Payment verification
   - Refund processing

7. **Document frontend implementation**
   - TypeScript types
   - API client usage
   - React hooks usage
   - Component integration
   - Redirect flow
   - Success/cancel pages

8. **Document API endpoints**
   - POST /api/payments/initiate/
   - POST /api/payments/verify/
   - POST /api/payments/refund/
   - POST /api/webhooks/payhere/
   - Include request/response examples

9. **Document testing procedures**
   - Sandbox testing guide
   - Test cards reference
   - Unit testing
   - Integration testing
   - E2E testing
   - Manual testing checklist

10. **Document deployment process**
    - Pre-deployment checklist
    - Environment configuration
    - Production setup
    - Monitoring setup
    - Rollback procedures

11. **Create troubleshooting guide**
    - Common issues and solutions
    - Error messages reference
    - Debugging tips
    - Support contacts
    - FAQ section

12. **Add maintenance section**
    - Monitoring recommendations
    - Performance optimization
    - Security updates
    - PayHere API updates
    - Version compatibility

### Documentation Structure

```
payhere-integration.md
│
├─ 1. Overview
│  ├─ What is PayHere
│  ├─ Why PayHere
│  ├─ Features
│  └─ Payment Methods
│
├─ 2. Architecture
│  ├─ System Diagram
│  ├─ Component Overview
│  ├─ Data Flow
│  └─ Security Model
│
├─ 3. Setup & Installation
│  ├─ Prerequisites
│  ├─ PayHere Account
│  ├─ Backend Setup
│  ├─ Frontend Setup
│  └─ Configuration
│
├─ 4. Backend Implementation
│  ├─ PayHere Processor
│  ├─ Payment Initiation
│  ├─ Webhook Handler
│  ├─ Signature Verification
│  ├─ Payment Verification
│  └─ Refund Processing
│
├─ 5. Frontend Implementation
│  ├─ TypeScript Types
│  ├─ API Client
│  ├─ React Hooks
│  ├─ Payment Button
│  ├─ Redirect Flow
│  └─ Success/Cancel Pages
│
├─ 6. API Reference
│  ├─ Initiate Payment
│  ├─ Verify Payment
│  ├─ Process Refund
│  └─ Webhook Endpoint
│
├─ 7. Testing
│  ├─ Sandbox Setup
│  ├─ Test Cards
│  ├─ Unit Tests
│  ├─ E2E Tests
│  └─ Manual Testing
│
├─ 8. Deployment
│  ├─ Pre-Deployment
│  ├─ Production Setup
│  ├─ Monitoring
│  └─ Rollback
│
├─ 9. Troubleshooting
│  ├─ Common Issues
│  ├─ Error Reference
│  ├─ Debugging
│  └─ FAQ
│
└─ 10. Maintenance
   ├─ Monitoring
   ├─ Performance
   ├─ Security
   └─ Updates
```

### Documentation Content Examples

**Overview Section**
```
# PayHere Integration Documentation

## Overview

PayHere is Sri Lanka's leading online payment gateway, enabling businesses to accept payments via credit/debit cards, online banking, and mobile wallets. This integration allows our webstore to process payments securely through PayHere's hosted checkout page.

### Supported Payment Methods
- Visa / Mastercard / Amex
- Commercial Bank iPay
- BOC B-pay
- Sampath Vishwa
- FriMi / HNB SOLO
- genie / iPay

### Features
- Secure hosted checkout
- Real-time payment notifications (webhooks)
- Payment verification
- Refund processing
- Sandbox testing environment
- Comprehensive error handling

### Integration Type
This is a redirect-based integration where:
1. Customer initiates payment on our site
2. Customer is redirected to PayHere's secure payment page
3. Customer completes payment on PayHere
4. Customer is redirected back to our site
5. PayHere sends webhook notification
6. We verify and complete the order
```

**Architecture Diagram**
```
Payment Flow Architecture

┌─────────────┐
│   Customer  │
└──────┬──────┘
       │ 1. Checkout
       ▼
┌─────────────────────┐
│   Our Webstore      │
│  (Frontend)         │
└──────┬──────────────┘
       │ 2. Initiate Payment
       ▼
┌─────────────────────┐
│   Payment API       │
│   (Backend)         │
└──────┬──────────────┘
       │ 3. Create Payment Intent
       │ 4. Return Form Data
       ▼
┌─────────────────────┐
│   Customer Browser  │
│   (Form POST)       │
└──────┬──────────────┘
       │ 5. Redirect to PayHere
       ▼
┌─────────────────────┐
│   PayHere Checkout  │
│   (sandbox/prod)    │
└──────┬──────────────┘
       │ 6. Process Payment
       ├─► 7a. Success → Return URL
       ├─► 7b. Cancel → Cancel URL
       └─► 7c. Webhook → Notify URL
              │
              ▼
       ┌─────────────────────┐
       │  Webhook Handler    │
       │  (Backend)          │
       └──────┬──────────────┘
              │ 8. Verify Signature
              │ 9. Update Order
              ▼
       ┌─────────────────────┐
       │  Database           │
       └─────────────────────┘
```

**Environment Variables**
```
## Environment Configuration

### Backend (.env)
```
# PayHere Configuration
PAYHERE_SANDBOX=true
PAYHERE_MERCHANT_ID=your_merchant_id
PAYHERE_MERCHANT_SECRET=your_merchant_secret

# URLs
PAYHERE_NOTIFY_URL=https://yourdomain.com/api/webhooks/payhere/
PAYHERE_RETURN_URL=https://yourdomain.com/checkout/success
PAYHERE_CANCEL_URL=https://yourdomain.com/checkout/cancel
```

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=https://yourdomain.com
```

### Security Notes
- Never expose PAYHERE_MERCHANT_SECRET to frontend
- Use environment-specific credentials
- Rotate secrets periodically
- Use secrets manager in production
```

**API Endpoint Documentation**
```
## API Endpoints

### POST /api/payments/initiate/

Initiate a PayHere payment for an order.

**Request Body:**
```json
{
  "order_id": "ORD-2026-00123",
  "gateway": "payhere",
  "return_url": "/checkout/success",
  "cancel_url": "/checkout/cancel"
}
```

**Response:**
```json
{
  "success": true,
  "payment_intent_id": "pi_1234567890",
  "redirect_url": "https://sandbox.payhere.lk/pay",
  "form_data": {
    "merchant_id": "1234567",
    "order_id": "ORD-2026-00123",
    "amount": "5000.00",
    "currency": "LKR",
    "hash": "ABC123...",
    // ... other fields
  },
  "expires_at": "2026-01-31T10:15:00Z"
}
```

**Error Response:**
```json
{
  "success": false,
  "error": "Order not found",
  "code": "ORDER_NOT_FOUND"
}
```

**Usage Example:**
```typescript
const response = await fetch('/api/payments/initiate/', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    order_id: orderId,
    gateway: 'payhere'
  })
});

const data = await response.json();
if (data.success) {
  redirectToPayHere(data.form_data);
}
```
```

**Testing Guide**
```
## Testing Guide

### Sandbox Testing

1. **Enable Sandbox Mode**
   ```
   PAYHERE_SANDBOX=true
   ```

2. **Use Test Credentials**
   - Merchant ID: (provided by PayHere)
   - Merchant Secret: (provided by PayHere)

3. **Use Test Cards**
   - Success: 4111 1111 1111 1111
   - Decline: 4000 0000 0000 0002
   - See full list in payhere-test-cards.md

### Manual Testing Checklist

- [ ] Create order in application
- [ ] Proceed to checkout
- [ ] Select PayHere payment
- [ ] Verify redirect to PayHere sandbox
- [ ] Enter test card details
- [ ] Complete payment
- [ ] Verify redirect to success page
- [ ] Verify order status updated
- [ ] Verify webhook received
- [ ] Verify payment record created
- [ ] Test cancellation flow
- [ ] Test declined payment
- [ ] Test timeout scenario

### Automated Tests

Run unit tests:
```bash
npm test -- payhere
```

Run E2E tests:
```bash
npm run test:e2e -- payhere-payment-flow
```
```

**Troubleshooting Section**
```
## Troubleshooting

### Common Issues

#### Issue: Payment initiation fails with "Invalid hash"
**Cause:** Hash generation incorrect or using wrong merchant secret

**Solution:**
1. Verify PAYHERE_MERCHANT_SECRET is correct
2. Check hash generation logic uses uppercase MD5
3. Verify all hash parameters are included
4. Check parameter order matches PayHere requirements

#### Issue: Webhook signature verification fails
**Cause:** Signature calculation mismatch

**Solution:**
1. Log incoming webhook signature
2. Log calculated signature
3. Compare signatures (case-sensitive)
4. Verify merchant secret is correct
5. Check all signature components included

#### Issue: Redirect to PayHere fails
**Cause:** Form POST not working or invalid form data

**Solution:**
1. Check browser console for errors
2. Verify form_data contains all required fields
3. Check redirect_url is correct
4. Verify browser allows form submission
5. Check for CORS issues

#### Issue: Customer not redirected back after payment
**Cause:** Return URL or cancel URL incorrect

**Solution:**
1. Verify return_url is accessible
2. Check return_url is properly encoded
3. Verify domain is whitelisted in PayHere
4. Check for HTTPS requirement

### Error Codes Reference

| Code | Message | Solution |
|------|---------|----------|
| ORDER_NOT_FOUND | Order not found | Verify order ID exists |
| INVALID_AMOUNT | Invalid amount | Check amount > 0 |
| INVALID_CURRENCY | Invalid currency | Use 'LKR' for PayHere |
| HASH_GENERATION_FAILED | Hash generation failed | Check merchant secret |
| WEBHOOK_VERIFICATION_FAILED | Webhook verification failed | Check signature calculation |

### Getting Help

- **PayHere Support:** support@payhere.lk
- **Developer Guide:** https://support.payhere.lk/api-&-intergrations
- **Internal Team:** payments-team@yourcompany.com
```

### Expected Output

After completing this task:
- File `docs/integrations/payhere-integration.md` created
- Comprehensive documentation written
- Overview section complete
- Architecture documented with diagrams
- Setup process documented
- Configuration reference provided
- Backend implementation documented
- Frontend implementation documented
- API endpoints documented
- Testing guide included
- Deployment process documented
- Troubleshooting guide added
- Maintenance section included
- Code examples provided
- Screenshots/diagrams included
- Easy to follow and understand
- Linked from main documentation

---

## Summary

This document covered Tasks 89-92 for PayHere integration testing and documentation:

### Completed Tasks
1. **Task 89** - Sandbox Tests: Created comprehensive sandbox test suite
2. **Task 90** - Test Cards: Documented PayHere test cards and scenarios
3. **Task 91** - E2E Payment Test: Created end-to-end payment flow test
4. **Task 92** - PayHere Documentation: Created complete integration documentation

### Key Deliverables
- Comprehensive sandbox test suite
- Test cards reference documentation
- End-to-end automated tests
- Complete integration documentation
- Troubleshooting guide
- API reference
- Deployment guide
- Maintenance procedures

### PayHere Integration Complete

All 92 tasks for PayHere integration are now complete:
- ✅ Group A: PayHere Configuration (Tasks 01-16)
- ✅ Group B: PayHere Processor Implementation (Tasks 17-34)
- ✅ Group C: Payment Initialization (Tasks 35-50)
- ✅ Group D: Webhook & Notification (Tasks 51-66)
- ✅ Group E: Verification & Refunds (Tasks 67-80)
- ✅ Group F: Frontend Integration & Testing (Tasks 81-92)

### Next SubPhase

Proceed to **SubPhase-03: WebXPay Integration** to implement the second payment gateway for Sri Lanka market.

---

**Document Status:** ✅ Complete | **Tasks:** 89-92 of 92 | **Progress:** 100% | **SubPhase Complete!** 🎉
