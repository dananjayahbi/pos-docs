# Tasks 01-09: Checkout Routes and Store Structure

> **Phase:** 08 - Webstore & E-Commerce Platform  
> **SubPhase:** 07 - Checkout Flow  
> **Group:** A - Checkout Routes & Structure  
> **Document:** 01 of 02  
> **Tasks Covered:** 01, 02, 03, 04, 05, 06, 07, 08, 09

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-10-18_Navigation-Guard-Verify.md](02_Tasks-10-18_Navigation-Guard-Verify.md)

---

## Document Overview

This document covers the creation of the checkout route structure with five sequential steps and the Zustand checkout store. It establishes the foundational routing architecture for the complete checkout flow, from initial information collection through order confirmation. The document includes the checkout directory setup, layout component, main redirect page, five step-specific routes (information, shipping, payment, review, confirmation), and the state management store with TypeScript type definitions.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 01 | Create Checkout Directory | Low | 10 min |
| 02 | Create Checkout Layout | Medium | 25 min |
| 03 | Create Checkout Page Route | Low | 15 min |
| 04 | Create Step 1 Route | Low | 15 min |
| 05 | Create Step 2 Route | Low | 15 min |
| 06 | Create Step 3 Route | Low | 15 min |
| 07 | Create Step 4 Route | Low | 15 min |
| 08 | Create Step 5 Route | Low | 15 min |
| 09 | Create Checkout Store | Medium | 30 min |

---

## Task 01: Create Checkout Directory

### Overview
Create the checkout directory within the storefront route group in the Next.js App Router. This directory will house all checkout-related routes including the main checkout page and five step pages. The checkout directory follows Next.js 13+ App Router conventions and sits alongside other storefront routes like products and cart.

### Dependencies
- SubPhase-06 (Product Pages & Cart) must be complete
- Cart functionality is operational
- Storefront route group `(storefront)` exists
- Frontend project is initialized

### Instructions

1. **Navigate to the storefront route group**
   - Go to `frontend/app/(storefront)/` directory
   - This is where all customer-facing routes are organized
   - Verify the directory structure is correct

2. **Create the checkout directory**
   - Create a new directory named `checkout`
   - Path should be: `frontend/app/(storefront)/checkout/`
   - This creates the `/checkout` URL route

3. **Understand routing behavior**
   - `app/(storefront)/checkout/page.tsx` → `/checkout`
   - `app/(storefront)/checkout/information/page.tsx` → `/checkout/information`
   - `app/(storefront)/checkout/shipping/page.tsx` → `/checkout/shipping`
   - All checkout routes are under the `/checkout` path

4. **Plan subdirectory structure**
   - Prepare for five step directories to be created
   - Each step will be a nested route under `/checkout/`
   - Directory names will match step names

### Checkout Directory Purpose

| Feature | Benefit |
|---------|---------|
| Centralized Location | All checkout routes in one place |
| URL Structure | Clean `/checkout/*` paths |
| Shared Layout | Consistent checkout experience |
| Step Organization | Each step isolated in subdirectory |

### Directory Structure
```
frontend/app/
├── (storefront)/
│   ├── checkout/              # Created in Task 01
│   │   ├── layout.tsx         # (Task 02)
│   │   ├── page.tsx           # (Task 03)
│   │   ├── information/       # (Task 04)
│   │   ├── shipping/          # (Task 05)
│   │   ├── payment/           # (Task 06)
│   │   ├── review/            # (Task 07)
│   │   └── confirmation/      # (Task 08)
│   ├── products/
│   └── cart/
└── ...
```

### URL Routing Map

| Directory Path | URL Path | Purpose |
|----------------|----------|---------|
| `checkout/` | `/checkout` | Redirect to first step |
| `checkout/information/` | `/checkout/information` | Step 1: Contact info |
| `checkout/shipping/` | `/checkout/shipping` | Step 2: Shipping details |
| `checkout/payment/` | `/checkout/payment` | Step 3: Payment method |
| `checkout/review/` | `/checkout/review` | Step 4: Order review |
| `checkout/confirmation/` | `/checkout/confirmation` | Step 5: Order success |

### Expected Outcome
- Checkout directory created in correct location
- Foundation for five-step checkout flow
- Organized structure for route separation
- Ready to receive layout and page files

### Verification Checklist
- [ ] `frontend/app/(storefront)/checkout/` directory exists
- [ ] Directory is located under `(storefront)` route group
- [ ] Directory name is lowercase and correct
- [ ] Path structure matches App Router conventions

---

## Task 02: Create Checkout Layout

### Overview
Create the layout component for the checkout route that provides a simplified, distraction-free experience during the checkout process. This layout differs from the main storefront layout by removing unnecessary navigation elements and focusing user attention on completing their purchase. It includes a simplified header with logo and cart icon, the main content area for step pages, and a minimal footer.

### Dependencies
- Task 01: Create Checkout Directory

### Instructions

1. **Create layout.tsx file**
   - Navigate to `frontend/app/(storefront)/checkout/` directory
   - Create new file named `layout.tsx`
   - This layout wraps all checkout pages and steps

2. **Import required dependencies**
   - Import React types (ReactNode)
   - Import CheckoutHeader component (created in Group-A, Task 17)
   - Import any necessary utility functions

3. **Define layout metadata**
   - Export metadata object with page title
   - Set title to "Checkout | LankaCommerce Cloud"
   - Configure description: "Complete your purchase securely"
   - Add robots meta tag to prevent indexing checkout pages

4. **Create layout component structure**
   - Define default export function `CheckoutLayout`
   - Accept `children` prop of type `ReactNode`
   - Return JSX structure with header, main, and footer

5. **Implement simplified header**
   - Use CheckoutHeader component at top
   - Header shows logo (links to home)
   - Header shows secure checkout indicator
   - Header shows cart icon with item count

6. **Create main content area**
   - Wrap children in main semantic element
   - Apply container styling for centering
   - Set maximum width (max-w-7xl)
   - Add padding for spacing

7. **Add minimal footer**
   - Display security badges or payment icons
   - Show help/support link
   - Display copyright information
   - Keep footer content minimal

8. **Apply background styling**
   - Use light neutral background (bg-gray-50)
   - Ensure clean, professional appearance
   - Maintain brand consistency

### Layout Structure

```
┌─────────────────────────────────────────┐
│        CheckoutHeader                   │
│  [Logo]    Secure Checkout    [Cart]   │
├─────────────────────────────────────────┤
│                                         │
│        ┌───────────────────┐           │
│        │                   │           │
│        │    {children}     │           │
│        │   (Step Pages)    │           │
│        │                   │           │
│        └───────────────────┘           │
│                                         │
├─────────────────────────────────────────┤
│           Minimal Footer                │
│     [Security Badge]  [Help]            │
└─────────────────────────────────────────┘
```

### Layout Component Props

| Prop | Type | Description |
|------|------|-------------|
| children | ReactNode | Step page content to render |

### Layout Sections

| Section | Component | Position | Purpose |
|---------|-----------|----------|---------|
| Header | CheckoutHeader | Top | Brand, security indicator |
| Main | children | Center | Step content area |
| Footer | Minimal footer | Bottom | Trust badges, help |

### Metadata Configuration

| Property | Value | Purpose |
|----------|-------|---------|
| title | "Checkout \| LankaCommerce Cloud" | Browser tab title |
| description | "Complete your purchase securely" | SEO description |
| robots | "noindex, nofollow" | Prevent indexing |

### Styling Specifications

| Element | Tailwind Classes | Purpose |
|---------|------------------|---------|
| Container | `min-h-screen flex flex-col` | Full height layout |
| Background | `bg-gray-50` | Clean, neutral tone |
| Main | `flex-grow container max-w-7xl mx-auto px-4 py-8` | Centered content |
| Footer | `bg-white border-t py-4` | Separated footer |

### Simplified Checkout Experience

| Feature | Standard Layout | Checkout Layout |
|---------|----------------|-----------------|
| Navigation Menu | Full menu | Logo only |
| Search Bar | Visible | Hidden |
| Category Links | Visible | Hidden |
| Footer Links | Extensive | Minimal |
| Promotions | Visible | Hidden |

### Expected Outcome
- Functional checkout layout with simplified design
- Distraction-free checkout experience
- Proper header, content area, and footer structure
- Ready to receive step page children
- Metadata configured for security and SEO

### Verification Checklist
- [ ] `frontend/app/(storefront)/checkout/layout.tsx` file created
- [ ] Layout component exports properly
- [ ] Accepts children prop correctly
- [ ] CheckoutHeader component imported
- [ ] Main content area styled appropriately
- [ ] Minimal footer implemented
- [ ] Background styling applied
- [ ] Metadata configured with noindex
- [ ] TypeScript types defined correctly

---

## Task 03: Create Checkout Page Route

### Overview
Create the main checkout page (`/checkout`) that serves as the entry point to the checkout flow. This page does not display content but instead immediately redirects users to the first step of the checkout process (`/checkout/information`). The redirect ensures users always start at Step 1 and cannot skip required information.

### Dependencies
- Task 01: Create Checkout Directory

### Instructions

1. **Create page.tsx file**
   - Navigate to `frontend/app/(storefront)/checkout/` directory
   - Create new file named `page.tsx`
   - This creates the `/checkout` route

2. **Import redirect utilities**
   - Import `redirect` function from `next/navigation`
   - This is Next.js's built-in server-side redirect
   - No additional libraries needed

3. **Define page metadata**
   - Export metadata object (optional for redirect page)
   - Set title to "Checkout | LankaCommerce Cloud"
   - This metadata rarely displays due to immediate redirect

4. **Create page component**
   - Define default export function `CheckoutPage`
   - No props required for this component
   - Function body executes redirect

5. **Implement redirect logic**
   - Call `redirect('/checkout/information')` immediately
   - This sends users to Step 1 (information page)
   - Redirect happens before any UI rendering

6. **Add optional loading state**
   - Consider brief loading message (rarely seen)
   - Use for edge cases where redirect is delayed
   - Keep minimal since redirect is instant

### Redirect Flow

```
User navigates to /checkout
         │
         ▼
    page.tsx loads
         │
         ▼
  redirect() called
         │
         ▼
/checkout/information
    (Step 1 page)
```

### Page Component Structure

| Element | Implementation | Purpose |
|---------|----------------|---------|
| Function | `export default function CheckoutPage()` | Page component |
| Redirect | `redirect('/checkout/information')` | Send to Step 1 |
| Return | Loading text (optional) | Fallback UI |

### Redirect Reasons

| Reason | Explanation |
|--------|-------------|
| Sequential Flow | Checkout must start at Step 1 |
| Prevent Skipping | Users can't jump to later steps |
| Clean Entry Point | Single URL for checkout start |
| Consistency | All users follow same path |

### Alternative Approaches

| Approach | Pros | Cons | Recommended |
|----------|------|------|-------------|
| Server Redirect | Instant, SEO-friendly | Requires server | ✓ Yes |
| Client Redirect | Works in client components | Slower, flash visible | No |
| Router Push | Programmatic | More complex | No |
| Middleware | Handles at edge | Overkill for this | No |

### URL Behavior

| User Types | Result |
|------------|--------|
| `/checkout` | → `/checkout/information` |
| `/checkout/` | → `/checkout/information` |
| Direct link | → Step 1 immediately |

### Expected Outcome
- Functional redirect from `/checkout` to first step
- Instant navigation without UI flash
- Clean entry point for checkout flow
- Foundation for sequential step progression

### Verification Checklist
- [ ] `frontend/app/(storefront)/checkout/page.tsx` file created
- [ ] Redirect function imported from next/navigation
- [ ] Page component defined and exported
- [ ] Redirect to `/checkout/information` implemented
- [ ] Redirect executes immediately on page load
- [ ] No unnecessary UI elements rendering

---

## Task 04: Create Step 1 Route

### Overview
Create the Step 1 page route for collecting customer contact information. This is the first step in the checkout flow where users provide their email, phone number, first name, and last name. The page includes form fields for information collection, validation, and the ability to proceed to Step 2 or return to cart.

### Dependencies
- Task 01: Create Checkout Directory

### Instructions

1. **Create information directory**
   - Navigate to `frontend/app/(storefront)/checkout/` directory
   - Create new subdirectory named `information`
   - Path: `frontend/app/(storefront)/checkout/information/`

2. **Create page.tsx file**
   - Inside `checkout/information/` directory
   - Create file named `page.tsx`
   - This creates the `/checkout/information` route

3. **Import required dependencies**
   - Import React and necessary hooks (useState, useEffect)
   - Import useCheckoutStore hook (from checkoutStore.ts)
   - Import form components (Input, Button, etc.)
   - Import validation utilities (React Hook Form, Zod)

4. **Define page metadata**
   - Export metadata object with step title
   - Set title to "Contact Information | Checkout"
   - Add description for SEO

5. **Create page component structure**
   - Define default export function `InformationPage`
   - Initialize form with React Hook Form
   - Connect to checkout store for state

6. **Implement form structure**
   - Create form section with proper semantics
   - Add step indicator showing "Step 1 of 5"
   - Include heading: "Contact Information"

7. **Add form fields**
   - Email address field (required, email validation)
   - Phone number field (required, phone validation)
   - First name field (required)
   - Last name field (required)
   - Apply proper labels and placeholders

8. **Implement validation schema**
   - Define Zod schema for information step
   - Validate email format
   - Validate phone number format
   - Ensure all required fields are filled

9. **Add guest checkout option**
   - Display checkbox for "Continue as guest"
   - Show "Already have an account? Sign in" link
   - Handle both authenticated and guest flows

10. **Implement form submission**
    - Handle form submit event
    - Validate all fields
    - Save data to checkout store
    - Navigate to Step 2 (shipping page)

11. **Add navigation buttons**
    - "Back to Cart" button (links to /cart)
    - "Continue to Shipping" button (submit form)
    - Disable continue button if form invalid

### Step 1 Purpose

| Data Collected | Validation | Required |
|----------------|------------|----------|
| Email Address | Email format | Yes |
| Phone Number | Phone format | Yes |
| First Name | Min 2 characters | Yes |
| Last Name | Min 2 characters | Yes |

### Page Structure

```
┌──────────────────────────────────────┐
│   Step 1 of 5                        │
│                                      │
│   Contact Information                │
│                                      │
│   ┌────────────────────────────┐    │
│   │ Email Address              │    │
│   │ [input field]              │    │
│   └────────────────────────────┘    │
│                                      │
│   ┌────────────────────────────┐    │
│   │ Phone Number               │    │
│   │ [input field]              │    │
│   └────────────────────────────┘    │
│                                      │
│   ┌──────────────┐ ┌──────────────┐ │
│   │ First Name   │ │ Last Name    │ │
│   │ [input]      │ │ [input]      │ │
│   └──────────────┘ └──────────────┘ │
│                                      │
│   [ ] Continue as guest              │
│   Already have an account? Sign in   │
│                                      │
│   [Back to Cart] [Continue →]       │
└──────────────────────────────────────┘
```

### Form Field Specifications

| Field | Type | Validation | Placeholder |
|-------|------|------------|-------------|
| Email | text/email | Email regex | "your@email.com" |
| Phone | tel | Phone regex | "+94 71 234 5678" |
| First Name | text | Min 2 chars | "John" |
| Last Name | text | Min 2 chars | "Doe" |

### Validation Rules

| Rule | Implementation | Error Message |
|------|----------------|---------------|
| Email Required | `z.string().email()` | "Valid email required" |
| Phone Required | `z.string().regex()` | "Valid phone number required" |
| Name Required | `z.string().min(2)` | "Name must be at least 2 characters" |
| All Fields | Check on submit | "Please fill all required fields" |

### State Management

| Store Property | Data Stored | Updated On |
|----------------|-------------|------------|
| `contact.email` | Email address | Form submit |
| `contact.phone` | Phone number | Form submit |
| `contact.firstName` | First name | Form submit |
| `contact.lastName` | Last name | Form submit |
| `currentStep` | Step number (1) | Page load |

### Navigation Logic

| Action | Destination | Condition |
|--------|-------------|-----------|
| Back to Cart | `/cart` | No conditions |
| Continue | `/checkout/shipping` | Form valid |
| Sign In | `/auth/login?redirect=/checkout` | User clicks link |

### Expected Outcome
- Functional Step 1 page for information collection
- Form with four required fields
- Proper validation and error messages
- Data saved to checkout store on submit
- Navigation to Step 2 on successful submission
- Option to return to cart

### Verification Checklist
- [ ] `frontend/app/(storefront)/checkout/information/` directory created
- [ ] `page.tsx` file created in information directory
- [ ] Page component defined and exported
- [ ] Form with email, phone, first name, last name fields
- [ ] Validation schema implemented
- [ ] Checkout store integration working
- [ ] Form submission saves data to store
- [ ] Navigation to Step 2 on success
- [ ] Back to cart button functional
- [ ] Guest checkout option available
- [ ] Sign in link present
- [ ] Metadata configured

---

## Task 05: Create Step 2 Route

### Overview
Create the Step 2 page route for collecting shipping address and selecting shipping method. This step builds on the contact information from Step 1 and allows users to enter their delivery address and choose from available shipping options (standard, express, overnight). The page validates address information and saves selections to the checkout store.

### Dependencies
- Task 01: Create Checkout Directory
- Task 04: Create Step 1 Route (users progress from Step 1)

### Instructions

1. **Create shipping directory**
   - Navigate to `frontend/app/(storefront)/checkout/` directory
   - Create new subdirectory named `shipping`
   - Path: `frontend/app/(storefront)/checkout/shipping/`

2. **Create page.tsx file**
   - Inside `checkout/shipping/` directory
   - Create file named `page.tsx`
   - This creates the `/checkout/shipping` route

3. **Import required dependencies**
   - Import React and necessary hooks
   - Import useCheckoutStore hook
   - Import form components and address fields
   - Import validation utilities

4. **Define page metadata**
   - Export metadata object
   - Set title to "Shipping Information | Checkout"
   - Add appropriate description

5. **Create page component structure**
   - Define default export function `ShippingPage`
   - Initialize form with React Hook Form
   - Load existing contact data from store

6. **Implement address form section**
   - Create section with heading "Shipping Address"
   - Add step indicator showing "Step 2 of 5"
   - Display contact info from Step 1 (read-only)

7. **Add address form fields**
   - Street address line 1 (required)
   - Street address line 2 (optional)
   - City (required)
   - Province/State (required, dropdown)
   - Postal code (required)
   - Country (required, default: Sri Lanka)

8. **Implement shipping method selection**
   - Create section with heading "Shipping Method"
   - Display available shipping methods as radio buttons
   - Show method name, estimated delivery, and price
   - Pre-select default method (standard shipping)

9. **Define shipping method options**
   - Standard Shipping: 5-7 business days, Rs. 500
   - Express Shipping: 2-3 business days, Rs. 1,200
   - Overnight Delivery: Next business day, Rs. 2,500

10. **Implement validation schema**
    - Define Zod schema for shipping step
    - Validate all required address fields
    - Ensure shipping method is selected
    - Validate postal code format

11. **Add save address option**
    - Include checkbox "Save address for future orders"
    - Store preference in checkout store
    - Show only for authenticated users

12. **Implement form submission**
    - Validate all fields on submit
    - Save address data to checkout store
    - Save selected shipping method to store
    - Update store with shipping costs
    - Navigate to Step 3 (payment page)

13. **Add navigation buttons**
    - "Back to Information" button (returns to Step 1)
    - "Continue to Payment" button (submit form)
    - Disable continue if form invalid

### Step 2 Purpose

| Data Collected | Type | Required |
|----------------|------|----------|
| Address Line 1 | Text | Yes |
| Address Line 2 | Text | No |
| City | Text | Yes |
| Province | Dropdown | Yes |
| Postal Code | Text | Yes |
| Country | Dropdown | Yes |
| Shipping Method | Radio | Yes |

### Page Structure

```
┌────────────────────────────────────────┐
│   Step 2 of 5                          │
│                                        │
│   Shipping Information                 │
│                                        │
│   Contact: john.doe@email.com          │
│   ─────────────────────────────────    │
│                                        │
│   ┌──────────────────────────────┐    │
│   │ Address Line 1               │    │
│   │ [input]                      │    │
│   │ Address Line 2 (optional)    │    │
│   │ [input]                      │    │
│   └──────────────────────────────┘    │
│                                        │
│   ┌────────┐ ┌──────────┐ ┌────────┐  │
│   │ City   │ │Province  │ │Postal  │  │
│   │[input] │ │[dropdown]│ │[input] │  │
│   └────────┘ └──────────┘ └────────┘  │
│                                        │
│   Shipping Method                      │
│   ○ Standard (5-7 days) - Rs. 500      │
│   ○ Express (2-3 days) - Rs. 1,200     │
│   ○ Overnight (1 day) - Rs. 2,500      │
│                                        │
│   [ ] Save address for future orders   │
│                                        │
│   [← Back] [Continue to Payment →]    │
└────────────────────────────────────────┘
```

### Address Fields Specifications

| Field | Type | Validation | Placeholder |
|-------|------|------------|-------------|
| Address Line 1 | text | Required, min 5 | "123 Main Street" |
| Address Line 2 | text | Optional | "Apartment 4B" |
| City | text | Required, min 2 | "Colombo" |
| Province | select | Required | Select from list |
| Postal Code | text | Required, regex | "00100" |
| Country | select | Required | "Sri Lanka" (default) |

### Sri Lankan Provinces

| Province | Code |
|----------|------|
| Western | WP |
| Central | CP |
| Southern | SP |
| Northern | NP |
| Eastern | EP |
| North Western | NWP |
| North Central | NCP |
| Uva | UVA |
| Sabaragamuwa | SGM |

### Shipping Method Details

| Method | Delivery Time | Cost | Description |
|--------|--------------|------|-------------|
| Standard | 5-7 business days | Rs. 500 | Regular delivery |
| Express | 2-3 business days | Rs. 1,200 | Faster delivery |
| Overnight | Next business day | Rs. 2,500 | Premium speed |

### State Management

| Store Property | Data Stored |
|----------------|-------------|
| `shipping.address.line1` | Street address |
| `shipping.address.line2` | Additional address |
| `shipping.address.city` | City name |
| `shipping.address.province` | Province code |
| `shipping.address.postalCode` | Postal code |
| `shipping.address.country` | Country (Sri Lanka) |
| `shipping.method.id` | Selected method ID |
| `shipping.method.name` | Method name |
| `shipping.method.cost` | Method cost |
| `shipping.method.deliveryTime` | Estimated time |
| `currentStep` | Step number (2) |

### Validation Rules

| Field | Rule | Error Message |
|-------|------|---------------|
| Address Line 1 | Min 5 characters | "Address required" |
| City | Min 2 characters | "City required" |
| Province | Must select | "Province required" |
| Postal Code | Regex pattern | "Valid postal code required" |
| Shipping Method | Must select | "Please select shipping method" |

### Navigation Logic

| Action | Destination | Condition |
|--------|-------------|-----------|
| Back | `/checkout/information` | No validation |
| Continue | `/checkout/payment` | Form valid |

### Expected Outcome
- Functional Step 2 page for shipping information
- Address form with all required fields
- Province dropdown with Sri Lankan provinces
- Shipping method selection with three options
- Proper validation and error handling
- Data saved to checkout store
- Navigation to Step 3 on success

### Verification Checklist
- [ ] `frontend/app/(storefront)/checkout/shipping/` directory created
- [ ] `page.tsx` file created in shipping directory
- [ ] Page component defined and exported
- [ ] Address form with all required fields
- [ ] Province dropdown with Sri Lankan provinces
- [ ] Shipping method selection with radio buttons
- [ ] Shipping costs displayed correctly
- [ ] Validation schema implemented
- [ ] Checkout store integration working
- [ ] Form submission saves address and method
- [ ] Navigation to Step 3 on success
- [ ] Back button returns to Step 1
- [ ] Save address option for authenticated users
- [ ] Metadata configured

---

## Task 06: Create Step 3 Route

### Overview
Create the Step 3 page route for payment method selection. This step allows users to choose their preferred payment method from available options including cash on delivery, card payment (online), and bank transfer. The page validates payment method selection and securely handles sensitive payment information if required. For card payments, integrate with payment gateway UI components.

### Dependencies
- Task 01: Create Checkout Directory
- Task 05: Create Step 2 Route (users progress from Step 2)

### Instructions

1. **Create payment directory**
   - Navigate to `frontend/app/(storefront)/checkout/` directory
   - Create new subdirectory named `payment`
   - Path: `frontend/app/(storefront)/checkout/payment/`

2. **Create page.tsx file**
   - Inside `checkout/payment/` directory
   - Create file named `page.tsx`
   - This creates the `/checkout/payment` route

3. **Import required dependencies**
   - Import React and necessary hooks
   - Import useCheckoutStore hook
   - Import payment method components
   - Import validation utilities
   - Import payment gateway SDK (if applicable)

4. **Define page metadata**
   - Export metadata object
   - Set title to "Payment Method | Checkout"
   - Add security-related description

5. **Create page component structure**
   - Define default export function `PaymentPage`
   - Initialize payment form state
   - Load order summary from store

6. **Display order summary section**
   - Show contact information (from Step 1)
   - Show shipping address (from Step 2)
   - Show shipping method and cost (from Step 2)
   - Display subtotal, shipping, and total
   - Add step indicator showing "Step 3 of 5"

7. **Implement payment method selection**
   - Create section with heading "Payment Method"
   - Display available payment methods as cards
   - Show method icon, name, and description
   - Implement radio button selection

8. **Define payment method options**
   - Cash on Delivery: Pay when order arrives
   - Credit/Debit Card: Secure online payment
   - Bank Transfer: Direct bank deposit

9. **Add Cash on Delivery option**
   - Display COD icon and description
   - Show any additional COD charges if applicable
   - Indicate payment on delivery

10. **Add Card Payment option**
    - Display card payment form when selected
    - Include card number field (masked)
    - Add expiry date field (MM/YY)
    - Add CVV field (masked)
    - Add cardholder name field
    - Display accepted card logos (Visa, Mastercard)

11. **Add Bank Transfer option**
    - Display bank account details
    - Show account number, bank name, branch
    - Provide transfer reference instructions
    - Add upload receipt field (optional)

12. **Implement payment validation**
    - Validate payment method is selected
    - For card payment: validate all card fields
    - For bank transfer: validate reference number
    - Ensure secure data handling

13. **Add security indicators**
    - Display SSL/secure payment badges
    - Show payment provider logos
    - Add "Your payment is secure" message
    - Display privacy policy link

14. **Implement form submission**
    - Validate payment method selected
    - For card payment: tokenize card data
    - Save payment method to checkout store
    - Save payment details (tokenized)
    - Navigate to Step 4 (review page)

15. **Add navigation buttons**
    - "Back to Shipping" button (returns to Step 2)
    - "Continue to Review" button (submit form)
    - Disable continue if no payment method selected

### Step 3 Purpose

| Data Collected | Type | Required |
|----------------|------|----------|
| Payment Method | Radio | Yes |
| Card Number | Text (masked) | If card selected |
| Expiry Date | Text (MM/YY) | If card selected |
| CVV | Text (masked) | If card selected |
| Cardholder Name | Text | If card selected |
| Bank Reference | Text | If transfer selected |

### Page Structure

```
┌──────────────────────────────────────────┐
│   Step 3 of 5                            │
│                                          │
│   Payment Method                         │
│                                          │
│   Order Summary                          │
│   ├─ Contact: john@email.com             │
│   ├─ Shipping: 123 Main St, Colombo     │
│   └─ Shipping Method: Standard Rs. 500  │
│                                          │
│   Subtotal: Rs. 15,000                   │
│   Shipping: Rs. 500                      │
│   Total: Rs. 15,500                      │
│   ──────────────────────────────────     │
│                                          │
│   Select Payment Method                  │
│                                          │
│   ○ ┌────────────────────────────────┐  │
│     │ Cash on Delivery               │  │
│     │ Pay when order arrives         │  │
│     └────────────────────────────────┘  │
│                                          │
│   ○ ┌────────────────────────────────┐  │
│     │ Credit/Debit Card              │  │
│     │ Secure online payment          │  │
│     └────────────────────────────────┘  │
│       (Card form shown when selected)    │
│                                          │
│   ○ ┌────────────────────────────────┐  │
│     │ Bank Transfer                  │  │
│     │ Direct bank deposit            │  │
│     └────────────────────────────────┘  │
│                                          │
│   🔒 Your payment is secure              │
│                                          │
│   [← Back] [Continue to Review →]       │
└──────────────────────────────────────────┘
```

### Payment Method Options

| Method | Icon | Description | Processing |
|--------|------|-------------|------------|
| Cash on Delivery | 💵 | Pay when order arrives | No immediate processing |
| Credit/Debit Card | 💳 | Secure online payment | Payment gateway |
| Bank Transfer | 🏦 | Direct bank deposit | Manual verification |

### Card Payment Fields

| Field | Type | Validation | Placeholder |
|-------|------|------------|-------------|
| Card Number | text | Luhn algorithm | "1234 5678 9012 3456" |
| Expiry Date | text | MM/YY format | "12/25" |
| CVV | text | 3-4 digits | "123" |
| Cardholder | text | Min 3 characters | "John Doe" |

### Bank Transfer Details

| Bank Detail | Value |
|-------------|-------|
| Bank Name | Commercial Bank of Ceylon |
| Account Name | LankaCommerce Cloud (Pvt) Ltd |
| Account Number | 1234567890 |
| Branch | Colombo 03 |
| SWIFT Code | CCEYLKLX |

### Order Summary Display

| Item | Source | Display Format |
|------|--------|----------------|
| Contact Email | Step 1 store | "john@email.com" |
| Shipping Address | Step 2 store | "123 Main St, Colombo, WP" |
| Shipping Method | Step 2 store | "Standard (5-7 days)" |
| Subtotal | Cart store | "Rs. 15,000" |
| Shipping Cost | Step 2 store | "Rs. 500" |
| Total | Calculated | "Rs. 15,500" |

### State Management

| Store Property | Data Stored |
|----------------|-------------|
| `payment.method` | Selected method (cod/card/bank) |
| `payment.cardToken` | Tokenized card data |
| `payment.bankReference` | Transfer reference number |
| `payment.isProcessed` | Payment status |
| `currentStep` | Step number (3) |

### Card Payment Security

| Security Measure | Implementation |
|------------------|----------------|
| Tokenization | Use payment gateway tokenization |
| No Storage | Never store raw card numbers |
| SSL/TLS | All data encrypted in transit |
| PCI Compliance | Use PCI-compliant gateway |
| CVV | Never store CVV |

### Validation Rules

| Field | Rule | Error Message |
|-------|------|---------------|
| Payment Method | Must select | "Please select a payment method" |
| Card Number | Luhn valid | "Invalid card number" |
| Expiry Date | Future date | "Card expired" |
| CVV | 3-4 digits | "Invalid CVV" |
| Cardholder | Min 3 chars | "Name required" |

### Navigation Logic

| Action | Destination | Condition |
|--------|-------------|-----------|
| Back | `/checkout/shipping` | No validation |
| Continue | `/checkout/review` | Payment method selected |

### Expected Outcome
- Functional Step 3 page for payment selection
- Three payment method options displayed
- Card payment form (conditional rendering)
- Bank transfer details (conditional rendering)
- Order summary with totals
- Secure payment handling
- Data saved to checkout store
- Navigation to Step 4 on success

### Verification Checklist
- [ ] `frontend/app/(storefront)/checkout/payment/` directory created
- [ ] `page.tsx` file created in payment directory
- [ ] Page component defined and exported
- [ ] Order summary section displays correctly
- [ ] Three payment methods available
- [ ] Cash on Delivery option working
- [ ] Card payment form with validation
- [ ] Bank transfer option with details
- [ ] Payment method selection saves to store
- [ ] Card data tokenization implemented
- [ ] Security badges displayed
- [ ] Navigation to Step 4 on success
- [ ] Back button returns to Step 2
- [ ] Metadata configured
- [ ] Validation working for all payment types

---

## Task 07: Create Step 4 Route

### Overview
Create the Step 4 page route for order review and confirmation. This is the final step before order submission where users review all information collected from previous steps: contact details, shipping address and method, payment method, and cart items. Users can edit any section if needed or proceed to submit the order. This page provides a comprehensive summary before final commitment.

### Dependencies
- Task 01: Create Checkout Directory
- Task 06: Create Step 3 Route (users progress from Step 3)

### Instructions

1. **Create review directory**
   - Navigate to `frontend/app/(storefront)/checkout/` directory
   - Create new subdirectory named `review`
   - Path: `frontend/app/(storefront)/checkout/review/`

2. **Create page.tsx file**
   - Inside `checkout/review/` directory
   - Create file named `page.tsx`
   - This creates the `/checkout/review` route

3. **Import required dependencies**
   - Import React and necessary hooks
   - Import useCheckoutStore hook
   - Import useCartStore hook (for items)
   - Import loading state components

4. **Define page metadata**
   - Export metadata object
   - Set title to "Review Order | Checkout"
   - Add description about final review

5. **Create page component structure**
   - Define default export function `ReviewPage`
   - Load all data from checkout store
   - Load cart items from cart store
   - Initialize loading and error states

6. **Implement step indicator**
   - Display "Step 4 of 5"
   - Show page heading "Review Your Order"
   - Add instructions text

7. **Create contact information section**
   - Display section heading "Contact Information"
   - Show email and phone number (from Step 1)
   - Add "Edit" link that returns to Step 1

8. **Create shipping information section**
   - Display section heading "Shipping Information"
   - Show full shipping address (from Step 2)
   - Show shipping method and delivery time
   - Show shipping cost
   - Add "Edit" link that returns to Step 2

9. **Create payment method section**
   - Display section heading "Payment Method"
   - Show selected payment method (from Step 3)
   - For card: show last 4 digits only
   - For bank transfer: show reference number
   - Add "Edit" link that returns to Step 3

10. **Create order items section**
    - Display section heading "Order Items"
    - Show all cart items with images
    - Display item name, SKU, quantity, price
    - Show subtotal for each item
    - Add "Edit" link that returns to cart

11. **Create order summary section**
    - Display section heading "Order Summary"
    - Show subtotal (sum of all items)
    - Show shipping cost
    - Show any taxes or fees
    - Show total amount (prominent display)
    - Use table or list format

12. **Add terms and conditions**
    - Display checkbox for terms acceptance
    - Add link to full terms and conditions
    - Add privacy policy link
    - Make checkbox required for submission

13. **Implement order submission**
    - Add "Place Order" button (primary CTA)
    - Disable button until terms accepted
    - Show loading state during submission
    - Handle submission to backend API
    - Create order record in database
    - Process payment (if applicable)
    - Clear cart on success
    - Navigate to Step 5 (confirmation)

14. **Add error handling**
    - Display error messages if submission fails
    - Handle payment processing errors
    - Handle network errors
    - Allow retry on failure

15. **Add navigation buttons**
    - "Back to Payment" button (returns to Step 3)
    - "Place Order" button (submit order)
    - Disable Place Order if terms not accepted

### Step 4 Purpose

| Section | Data Displayed | Source |
|---------|---------------|--------|
| Contact | Email, phone, name | Step 1 store |
| Shipping | Address, method | Step 2 store |
| Payment | Method, details | Step 3 store |
| Items | Products, quantities | Cart store |
| Summary | Totals | Calculated |

### Page Structure

```
┌──────────────────────────────────────────┐
│   Step 4 of 5                            │
│                                          │
│   Review Your Order                      │
│   Please review before placing order     │
│                                          │
│   Contact Information         [Edit]     │
│   ├─ john.doe@email.com                  │
│   └─ +94 71 234 5678                     │
│                                          │
│   Shipping Information       [Edit]      │
│   ├─ 123 Main Street, Apt 4B             │
│   ├─ Colombo, Western Province           │
│   └─ Standard Shipping - Rs. 500         │
│                                          │
│   Payment Method            [Edit]       │
│   └─ Credit Card ending in 3456          │
│                                          │
│   Order Items               [Edit]       │
│   ┌────────────────────────────────┐    │
│   │ [Image] Product Name           │    │
│   │         SKU: ABC-123           │    │
│   │         Qty: 2 × Rs. 5,000     │    │
│   │         Subtotal: Rs. 10,000   │    │
│   └────────────────────────────────┘    │
│   (More items...)                        │
│                                          │
│   Order Summary                          │
│   ├─ Subtotal:     Rs. 15,000           │
│   ├─ Shipping:     Rs. 500              │
│   ├─ Tax:          Rs. 0                │
│   └─ Total:        Rs. 15,500           │
│                                          │
│   [ ] I agree to terms and conditions    │
│                                          │
│   [← Back] [Place Order →]              │
└──────────────────────────────────────────┘
```

### Review Sections Layout

| Section | Content | Edit Action |
|---------|---------|-------------|
| Contact | Email, phone, name | → Step 1 |
| Shipping | Address, method, cost | → Step 2 |
| Payment | Method, masked details | → Step 3 |
| Items | Product list, quantities | → Cart |
| Summary | Subtotal, shipping, total | Read-only |

### Order Items Display

| Column | Data | Format |
|--------|------|--------|
| Image | Product thumbnail | 80x80px |
| Name | Product name | Text link |
| SKU | Product SKU | Small text |
| Quantity | Items ordered | "Qty: 2" |
| Price | Unit price | "Rs. 5,000" |
| Subtotal | Quantity × Price | "Rs. 10,000" |

### Order Summary Calculation

| Line Item | Calculation | Display |
|-----------|-------------|---------|
| Subtotal | Sum of all item subtotals | "Rs. 15,000" |
| Shipping | From shipping method | "Rs. 500" |
| Tax | Calculate if applicable | "Rs. 0" |
| Discount | Apply if coupon used | "- Rs. 0" |
| **Total** | **Sum of above** | **"Rs. 15,500"** |

### State Management

| Store Action | When | Effect |
|--------------|------|--------|
| Load contact | On page load | Display Step 1 data |
| Load shipping | On page load | Display Step 2 data |
| Load payment | On page load | Display Step 3 data |
| Load cart items | On page load | Display product list |
| Submit order | On Place Order | Create order record |
| Clear cart | On success | Empty cart store |
| Set order ID | On success | Save order reference |
| Update step | On success | Set to Step 5 |

### Order Submission Flow

```
User clicks "Place Order"
         │
         ▼
   Validate terms accepted
         │
         ▼
   Show loading state
         │
         ▼
   Call API: POST /api/orders
         │
    ┌────┴────┐
    │         │
Success     Error
    │         │
    ▼         ▼
Process   Display
payment   error
    │         │
    ▼         │
Clear     Allow
cart      retry
    │         │
    ▼         │
Save      End
order ID
    │
    ▼
Navigate to
Step 5
```

### API Order Submission

| Field | Source | Required |
|-------|--------|----------|
| customerEmail | Step 1 store | Yes |
| customerPhone | Step 1 store | Yes |
| customerName | Step 1 store | Yes |
| shippingAddress | Step 2 store | Yes |
| shippingMethod | Step 2 store | Yes |
| paymentMethod | Step 3 store | Yes |
| paymentDetails | Step 3 store | Yes |
| items | Cart store | Yes |
| subtotal | Calculated | Yes |
| shippingCost | Step 2 store | Yes |
| total | Calculated | Yes |

### Terms Acceptance

| Element | Implementation | Required |
|---------|----------------|----------|
| Checkbox | Controlled input | Yes |
| Label | "I agree to terms and conditions" | Yes |
| Terms Link | Opens terms in new tab | Yes |
| Privacy Link | Opens privacy in new tab | Yes |
| Validation | Checked before submit | Yes |

### Error Handling

| Error Type | Display | Action |
|------------|---------|--------|
| Network Error | "Connection failed" | Retry button |
| Validation Error | Field-specific message | Highlight field |
| Payment Error | "Payment processing failed" | Return to Step 3 |
| Server Error | "Please try again" | Retry button |

### Navigation Logic

| Action | Destination | Condition |
|--------|-------------|-----------|
| Back | `/checkout/payment` | No validation |
| Place Order | `/checkout/confirmation` | Order submitted |
| Edit Contact | `/checkout/information` | Any time |
| Edit Shipping | `/checkout/shipping` | Any time |
| Edit Payment | `/checkout/payment` | Any time |
| Edit Cart | `/cart` | Any time |

### Expected Outcome
- Functional Step 4 page for complete order review
- All previous step data displayed clearly
- Edit links for each section
- Order items list with images and details
- Order summary with calculated totals
- Terms acceptance checkbox
- Place Order button with loading state
- Error handling for failed submissions
- Navigation to Step 5 on success

### Verification Checklist
- [ ] `frontend/app/(storefront)/checkout/review/` directory created
- [ ] `page.tsx` file created in review directory
- [ ] Page component defined and exported
- [ ] Contact information section displays
- [ ] Shipping information section displays
- [ ] Payment method section displays
- [ ] Order items section displays all products
- [ ] Order summary calculates correctly
- [ ] Edit links return to correct steps
- [ ] Terms acceptance checkbox implemented
- [ ] Place Order button functional
- [ ] Loading state during submission
- [ ] API integration for order creation
- [ ] Error handling implemented
- [ ] Cart cleared on success
- [ ] Navigation to Step 5 on success
- [ ] Back button returns to Step 3
- [ ] Metadata configured

---

## Task 08: Create Step 5 Route

### Overview
Create the Step 5 page route for order confirmation and success. This is the final page in the checkout flow, displayed after successful order submission. It confirms the order placement, displays the order number, provides order summary, shows next steps, and offers options to continue shopping or view order details. This page reassures customers their order was received.

### Dependencies
- Task 01: Create Checkout Directory
- Task 07: Create Step 4 Route (order submitted from Step 4)

### Instructions

1. **Create confirmation directory**
   - Navigate to `frontend/app/(storefront)/checkout/` directory
   - Create new subdirectory named `confirmation`
   - Path: `frontend/app/(storefront)/checkout/confirmation/`

2. **Create page.tsx file**
   - Inside `checkout/confirmation/` directory
   - Create file named `page.tsx`
   - This creates the `/checkout/confirmation` route

3. **Import required dependencies**
   - Import React and necessary hooks
   - Import useCheckoutStore hook
   - Import useRouter for navigation
   - Import success icons and components

4. **Define page metadata**
   - Export metadata object
   - Set title to "Order Confirmed | Checkout"
   - Add description about order success

5. **Create page component structure**
   - Define default export function `ConfirmationPage`
   - Load order ID from checkout store
   - Load order details from store
   - Initialize page state

6. **Add protection logic**
   - Check if order ID exists in store
   - If no order ID, redirect to cart or home
   - Prevent accessing confirmation without order
   - Clear checkout data after displaying

7. **Implement success header**
   - Display large success icon (checkmark)
   - Show "Order Confirmed!" heading
   - Display "Thank you for your order" message
   - Add encouraging sub-message

8. **Display order number section**
   - Create prominent order number display
   - Show "Order Number: #ORD-12345" (from store)
   - Add "Order Date: January 31, 2026" (current date)
   - Style order number prominently

9. **Create order summary section**
   - Display section heading "Order Summary"
   - Show customer email for confirmation
   - Show shipping address
   - Show estimated delivery date
   - Show order total

10. **Add order items section**
    - Display section heading "Items Ordered"
    - Show list of ordered products
    - Display product name, quantity, price
    - Keep list compact (no images needed)

11. **Create next steps section**
    - Display section heading "What's Next?"
    - Add numbered list of next steps
    - "1. Confirmation email sent to your email"
    - "2. Order processing begins"
    - "3. Shipping notification when dispatched"
    - "4. Track order in your account"

12. **Add email confirmation notice**
    - Display prominent notice box
    - Message: "Order confirmation sent to [email]"
    - Add note to check spam folder
    - Show customer service contact if needed

13. **Create action buttons**
    - Add "View Order Details" button (links to order page)
    - Add "Continue Shopping" button (links to home)
    - Add "Track Order" button (links to tracking)
    - Style primary button prominently

14. **Add customer support section**
    - Display "Need Help?" section
    - Show customer service email
    - Show customer service phone number
    - Show business hours
    - Add FAQ link

15. **Implement cleanup logic**
    - Clear checkout store after page render
    - Preserve order ID for session
    - Reset current step to 1
    - Clear payment sensitive data

### Step 5 Purpose

| Information | Source | Purpose |
|-------------|--------|---------|
| Order Number | API response | Reference for customer |
| Order Date | Current date | Timestamp record |
| Order Summary | Checkout store | Confirmation details |
| Email Sent | System | Reassurance |
| Next Steps | Static | Guide customer |

### Page Structure

```
┌──────────────────────────────────────────┐
│                                          │
│           ✓ Success Icon                 │
│                                          │
│        Order Confirmed!                  │
│   Thank you for your order               │
│                                          │
│   Order Number: #ORD-12345               │
│   Order Date: January 31, 2026           │
│                                          │
│   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━    │
│                                          │
│   Order Summary                          │
│   ├─ Email: john.doe@email.com           │
│   ├─ Ship To: 123 Main St, Colombo      │
│   ├─ Delivery: Feb 5-7, 2026            │
│   └─ Total: Rs. 15,500                   │
│                                          │
│   Items Ordered (3 items)                │
│   • Product Name × 2 - Rs. 10,000        │
│   • Product Name × 1 - Rs. 5,000         │
│                                          │
│   What's Next?                           │
│   1. Confirmation email sent             │
│   2. Order processing begins             │
│   3. Shipping notification               │
│   4. Track in your account               │
│                                          │
│   📧 Confirmation sent to your email     │
│      Check spam folder if not received   │
│                                          │
│   [View Order] [Continue Shopping]       │
│                                          │
│   Need Help? Contact support             │
│   📧 support@lankacommerce.lk            │
│   📞 +94 11 234 5678                     │
│                                          │
└──────────────────────────────────────────┘
```

### Success Header Design

| Element | Styling | Purpose |
|---------|---------|---------|
| Icon | Large checkmark, green | Visual success |
| Heading | H1, bold, 3xl | Main confirmation |
| Subheading | H2, gray, xl | Thank you message |
| Spacing | Generous padding | Prominence |

### Order Number Display

| Element | Format | Example |
|---------|--------|---------|
| Label | "Order Number:" | Fixed text |
| Order ID | "#ORD-" + ID | "#ORD-12345" |
| Date | "Order Date:" + date | "January 31, 2026" |
| Styling | Large, bold, monospace | Prominent display |

### Order Summary Display

| Field | Source | Display Format |
|-------|--------|----------------|
| Email | Step 1 store | "john.doe@email.com" |
| Shipping | Step 2 store | "123 Main St, Colombo" |
| Delivery | Calculated | "Feb 5-7, 2026" |
| Total | Order total | "Rs. 15,500" |

### Items Ordered List

| Display | Format |
|---------|--------|
| Product name | "Product Name" |
| Quantity | "× 2" |
| Price | "Rs. 10,000" |
| Format | Bullet list, compact |

### What's Next Steps

| Step # | Message | Icon |
|--------|---------|------|
| 1 | Confirmation email sent to your email | ✉️ |
| 2 | Order processing begins immediately | ⚙️ |
| 3 | Shipping notification when dispatched | 📦 |
| 4 | Track order in your account dashboard | 🔍 |

### Email Confirmation Notice

| Element | Content |
|---------|---------|
| Icon | Email icon |
| Message | "Order confirmation sent to [email]" |
| Note | "Please check spam folder" |
| Styling | Info box, blue background |

### Action Buttons

| Button | Destination | Style |
|--------|-------------|-------|
| View Order Details | `/account/orders/[orderId]` | Primary (blue) |
| Continue Shopping | `/` (home page) | Secondary (outline) |
| Track Order | `/account/orders/[orderId]/track` | Secondary |

### Customer Support Section

| Information | Display |
|-------------|---------|
| Heading | "Need Help?" |
| Email | "support@lankacommerce.lk" |
| Phone | "+94 11 234 5678" |
| Hours | "Mon-Fri, 9AM-6PM" |
| FAQ Link | "Visit our FAQ" |

### State Management

| Store Action | When | Effect |
|--------------|------|--------|
| Load order ID | On mount | Display order number |
| Load order data | On mount | Show order details |
| Clear checkout | After render | Clean up store |
| Reset step | After render | Back to step 1 |
| Clear payment | After render | Remove sensitive data |

### Page Protection Logic

```
Page loads
    │
    ▼
Check for order ID in store
    │
    ├─ Yes ────────┐
    │              │
    No             ▼
    │         Display
    ▼         confirmation
Redirect      page
to /cart      │
              ▼
         Clear checkout
         data after 5s
```

### Cleanup Process

| Data | Action | Timing |
|------|--------|--------|
| Order ID | Preserve | Keep for session |
| Contact info | Clear | After 5 seconds |
| Shipping info | Clear | After 5 seconds |
| Payment info | Clear | Immediately |
| Current step | Reset | After 5 seconds |
| Cart items | Already cleared | Step 4 |

### Delivery Date Calculation

| Shipping Method | Days to Add | Calculation |
|----------------|-------------|-------------|
| Standard | 5-7 days | Current + 5-7 |
| Express | 2-3 days | Current + 2-3 |
| Overnight | 1 day | Current + 1 |

### Navigation Logic

| Action | Destination | Notes |
|--------|-------------|-------|
| View Order | `/account/orders/[orderId]` | If authenticated |
| Continue Shopping | `/` | Home page |
| Track Order | `/account/orders/[orderId]/track` | If authenticated |
| No Order ID | `/cart` | Protection redirect |

### Expected Outcome
- Functional Step 5 confirmation page
- Success message with order number
- Order summary and items list
- Next steps guide for customer
- Email confirmation notice
- Action buttons for navigation
- Customer support information
- Protected page (requires order ID)
- Cleanup of checkout data

### Verification Checklist
- [ ] `frontend/app/(storefront)/checkout/confirmation/` directory created
- [ ] `page.tsx` file created in confirmation directory
- [ ] Page component defined and exported
- [ ] Success icon and heading displayed
- [ ] Order number prominently shown
- [ ] Order date displayed
- [ ] Order summary section complete
- [ ] Items ordered list displays
- [ ] What's Next steps listed
- [ ] Email confirmation notice shown
- [ ] View Order button functional
- [ ] Continue Shopping button functional
- [ ] Track Order button functional
- [ ] Customer support section complete
- [ ] Page protection logic implemented
- [ ] Checkout store cleanup working
- [ ] Redirect if no order ID
- [ ] Metadata configured

---

## Task 09: Create Checkout Store

### Overview
Create the Zustand checkout store to manage state throughout the five-step checkout process. This store centralizes all checkout data including contact information, shipping details, payment method, order status, and current step tracking. It provides actions to update each section and persist data across step navigation. The store ensures data consistency and enables easy state access from any checkout component.

### Dependencies
- Task 01: Create Checkout Directory
- Zustand library installed in project

### Instructions

1. **Create stores directory structure**
   - Navigate to `frontend/` directory
   - Check if `stores/` directory exists, create if needed
   - Create subdirectory `storefront/` inside `stores/`
   - Path: `frontend/stores/storefront/`

2. **Create checkoutStore.ts file**
   - Inside `frontend/stores/storefront/` directory
   - Create file named `checkoutStore.ts`
   - This will contain the Zustand store definition

3. **Import required dependencies**
   - Import `create` from 'zustand'
   - Import `persist` middleware from 'zustand/middleware'
   - Import TypeScript types (created in next task)

4. **Define contact information interface**
   - Create `ContactInfo` interface
   - Include: email, phone, firstName, lastName
   - All fields string type

5. **Define shipping information interface**
   - Create `ShippingInfo` interface
   - Include nested `address` object
   - Address fields: line1, line2, city, province, postalCode, country
   - Include `method` object
   - Method fields: id, name, cost, deliveryTime

6. **Define payment information interface**
   - Create `PaymentInfo` interface
   - Include: method (cod/card/bank)
   - Include: cardToken (optional, for tokenized card)
   - Include: bankReference (optional, for transfer)
   - Include: isProcessed (boolean)

7. **Define order information interface**
   - Create `OrderInfo` interface
   - Include: id (order number)
   - Include: status (pending/processing/completed)
   - Include: createdAt (date)
   - Include: total (number)

8. **Define checkout store state interface**
   - Create `CheckoutState` interface
   - Include: contact (ContactInfo | null)
   - Include: shipping (ShippingInfo | null)
   - Include: payment (PaymentInfo | null)
   - Include: order (OrderInfo | null)
   - Include: currentStep (number, 1-5)
   - Include: isLoading (boolean)
   - Include: error (string | null)

9. **Define checkout store actions interface**
   - Create `CheckoutActions` interface
   - Include action methods:
     - `setContactInfo(contact: ContactInfo): void`
     - `setShippingInfo(shipping: ShippingInfo): void`
     - `setPaymentInfo(payment: PaymentInfo): void`
     - `setOrderInfo(order: OrderInfo): void`
     - `setCurrentStep(step: number): void`
     - `setLoading(loading: boolean): void`
     - `setError(error: string | null): void`
     - `clearCheckout(): void`
     - `resetStep(): void`

10. **Create Zustand store**
    - Use `create<CheckoutState & CheckoutActions>()(...)` pattern
    - Wrap with `persist` middleware for localStorage
    - Set store name: 'checkout-store'

11. **Implement initial state**
    - Set contact: null
    - Set shipping: null
    - Set payment: null
    - Set order: null
    - Set currentStep: 1
    - Set isLoading: false
    - Set error: null

12. **Implement setContactInfo action**
    - Accept ContactInfo parameter
    - Update contact state
    - Log action for debugging (optional)

13. **Implement setShippingInfo action**
    - Accept ShippingInfo parameter
    - Update shipping state
    - Validate address fields (optional)

14. **Implement setPaymentInfo action**
    - Accept PaymentInfo parameter
    - Update payment state
    - Ensure sensitive data is tokenized

15. **Implement setOrderInfo action**
    - Accept OrderInfo parameter
    - Update order state
    - Set currentStep to 5

16. **Implement setCurrentStep action**
    - Accept step number (1-5)
    - Validate step range
    - Update currentStep state

17. **Implement setLoading action**
    - Accept boolean parameter
    - Update isLoading state
    - Use during async operations

18. **Implement setError action**
    - Accept string or null parameter
    - Update error state
    - Clear error when null passed

19. **Implement clearCheckout action**
    - Reset all data to initial state
    - Preserve order ID if needed
    - Clear sensitive payment data
    - Reset currentStep to 1

20. **Implement resetStep action**
    - Reset currentStep to 1
    - Don't clear other data
    - Use after order completion

21. **Configure persist options**
    - Set storage to localStorage
    - Define name: 'checkout-store'
    - Exclude sensitive payment data from persistence
    - Set partialize to exclude payment.cardToken

22. **Add TypeScript strict typing**
    - Ensure all interfaces exported
    - Add proper return types
    - Enable strict null checks

23. **Export store hook**
    - Export default useCheckoutStore
    - This hook is used in components

### Store Structure

```typescript
CheckoutStore
├── State
│   ├── contact: ContactInfo | null
│   ├── shipping: ShippingInfo | null
│   ├── payment: PaymentInfo | null
│   ├── order: OrderInfo | null
│   ├── currentStep: number (1-5)
│   ├── isLoading: boolean
│   └── error: string | null
└── Actions
    ├── setContactInfo()
    ├── setShippingInfo()
    ├── setPaymentInfo()
    ├── setOrderInfo()
    ├── setCurrentStep()
    ├── setLoading()
    ├── setError()
    ├── clearCheckout()
    └── resetStep()
```

### Contact Information Structure

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| email | string | Email address | "john@email.com" |
| phone | string | Phone number | "+94 71 234 5678" |
| firstName | string | First name | "John" |
| lastName | string | Last name | "Doe" |

### Shipping Information Structure

| Field | Type | Description |
|-------|------|-------------|
| address.line1 | string | Street address |
| address.line2 | string | Apartment, suite |
| address.city | string | City name |
| address.province | string | Province code |
| address.postalCode | string | Postal code |
| address.country | string | Country name |
| method.id | string | Shipping method ID |
| method.name | string | Method name |
| method.cost | number | Shipping cost |
| method.deliveryTime | string | Estimated delivery |

### Payment Information Structure

| Field | Type | Description |
|-------|------|-------------|
| method | string | 'cod' \| 'card' \| 'bank' |
| cardToken | string | Tokenized card data |
| bankReference | string | Transfer reference |
| isProcessed | boolean | Payment status |

### Order Information Structure

| Field | Type | Description |
|-------|------|-------------|
| id | string | Order number |
| status | string | Order status |
| createdAt | string | ISO date string |
| total | number | Order total amount |

### Store Actions Usage

| Action | When to Call | Example |
|--------|-------------|---------|
| setContactInfo | Step 1 submit | After form validation |
| setShippingInfo | Step 2 submit | After address valid |
| setPaymentInfo | Step 3 submit | After method selected |
| setOrderInfo | Step 4 submit | After order created |
| setCurrentStep | Step navigation | Track progress |
| setLoading | API calls | Show loading state |
| setError | Error occurs | Display error |
| clearCheckout | Order complete | Clean up data |
| resetStep | New checkout | Start over |

### Persist Configuration

| Option | Value | Purpose |
|--------|-------|---------|
| name | 'checkout-store' | localStorage key |
| storage | localStorage | Persistence layer |
| partialize | Exclude cardToken | Security |
| version | 1 | Migration support |

### Data Flow Example

```
Step 1: Contact Info
    │
    ▼
setContactInfo({ email, phone, firstName, lastName })
    │
    ▼
Store updated → contact: { ... }
    │
    ▼
setCurrentStep(2)
    │
    ▼
Navigate to Step 2

Step 2: Shipping
    │
    ▼
setShippingInfo({ address, method })
    │
    ▼
Store updated → shipping: { ... }
    │
    ▼
setCurrentStep(3)
    │
(Continue through steps...)
```

### Store Hook Usage in Components

```typescript
// In Step 1 component
const { contact, setContactInfo, setCurrentStep } = useCheckoutStore();

// In Step 2 component
const { shipping, setShippingInfo } = useCheckoutStore();

// In Step 3 component
const { payment, setPaymentInfo } = useCheckoutStore();

// In Step 4 component
const { contact, shipping, payment, setOrderInfo } = useCheckoutStore();

// In Step 5 component
const { order, clearCheckout } = useCheckoutStore();
```

### Security Considerations

| Concern | Solution |
|---------|----------|
| Card Data | Never store raw card numbers |
| Tokenization | Use payment gateway tokens |
| Persistence | Exclude sensitive data from localStorage |
| Clear Data | Clear payment info after use |
| Encryption | Use HTTPS for all requests |

### Expected Outcome
- Functional Zustand store for checkout state
- Complete TypeScript interfaces and types
- All state properties defined
- All action methods implemented
- Persist middleware configured
- Security measures in place
- Ready to use in checkout components

### Verification Checklist
- [ ] `frontend/stores/storefront/` directory created
- [ ] `checkoutStore.ts` file created
- [ ] Zustand imported correctly
- [ ] ContactInfo interface defined
- [ ] ShippingInfo interface defined
- [ ] PaymentInfo interface defined
- [ ] OrderInfo interface defined
- [ ] CheckoutState interface defined
- [ ] CheckoutActions interface defined
- [ ] Store created with create()
- [ ] Persist middleware configured
- [ ] Initial state defined
- [ ] setContactInfo action implemented
- [ ] setShippingInfo action implemented
- [ ] setPaymentInfo action implemented
- [ ] setOrderInfo action implemented
- [ ] setCurrentStep action implemented
- [ ] setLoading action implemented
- [ ] setError action implemented
- [ ] clearCheckout action implemented
- [ ] resetStep action implemented
- [ ] TypeScript types exported
- [ ] useCheckoutStore hook exported
- [ ] Security measures implemented
- [ ] Store tested with sample data

---

## Summary

This document established the foundational routing structure for the five-step checkout flow along with the centralized Zustand state management store. It created the checkout directory with a simplified layout, implemented the main checkout page with redirect logic, created five step-specific routes (information, shipping, payment, review, confirmation), and set up the checkout store to manage state across all steps.

### Completed Tasks
1. ✓ Created checkout directory in storefront route group
2. ✓ Created checkout layout with simplified design
3. ✓ Created checkout page route with redirect to Step 1
4. ✓ Created Step 1 route for contact information collection
5. ✓ Created Step 2 route for shipping address and method
6. ✓ Created Step 3 route for payment method selection
7. ✓ Created Step 4 route for complete order review
8. ✓ Created Step 5 route for order confirmation
9. ✓ Created Zustand checkout store with state and actions

### File Structure Created
```
frontend/
├── app/
│   └── (storefront)/
│       └── checkout/
│           ├── layout.tsx
│           ├── page.tsx
│           ├── information/
│           │   └── page.tsx
│           ├── shipping/
│           │   └── page.tsx
│           ├── payment/
│           │   └── page.tsx
│           ├── review/
│           │   └── page.tsx
│           └── confirmation/
│               └── page.tsx
└── stores/
    └── storefront/
        └── checkoutStore.ts
```

### Checkout Flow Summary

| Step | Route | Purpose | Store Updates |
|------|-------|---------|---------------|
| 1 | `/checkout/information` | Contact info | contact |
| 2 | `/checkout/shipping` | Address & method | shipping |
| 3 | `/checkout/payment` | Payment method | payment |
| 4 | `/checkout/review` | Review & submit | order |
| 5 | `/checkout/confirmation` | Success | cleanup |

### Next Steps
Proceed to [02_Tasks-10-18_Navigation-Guard-Verify.md](02_Tasks-10-18_Navigation-Guard-Verify.md) to create the remaining checkout infrastructure: TypeScript types, step progress indicator, step navigation logic with back and continue buttons, checkout guard to protect empty cart access, guest checkout verification, checkout header component, and final structure verification.

---

**Document Complete** | Tasks 01-09 ✓ | Ready for Implementation
