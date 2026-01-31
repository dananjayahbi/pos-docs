# Tasks 53-60: Payment Methods and Bank Transfer

> **Phase:** 08 - Webstore & E-Commerce Platform  
> **SubPhase:** 07 - Checkout Flow  
> **Group:** D of F  
> **Document:** 01 of 02  
> **Tasks Covered:** 53-60  
> **Document Goal:** Create payment page, methods section, method selector, and bank transfer with Sri Lanka bank details

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-61-68_COD-BNPL-Verify.md](02_Tasks-61-68_COD-BNPL-Verify.md)

---

## Table of Contents

1. [Overview](#overview)
2. [Task 53: Create Payment Page Component](#task-53-create-payment-page-component)
3. [Task 54: Create Payment Methods Section](#task-54-create-payment-methods-section)
4. [Task 55: Create Payment Method Card Component](#task-55-create-payment-method-card-component)
5. [Task 56: Create PayHere Payment Option](#task-56-create-payhere-payment-option)
6. [Task 57: Create Card Payment Option](#task-57-create-card-payment-option)
7. [Task 58: Create Bank Transfer Option](#task-58-create-bank-transfer-option)
8. [Task 59: Create Bank Details Display Component](#task-59-create-bank-details-display-component)
9. [Task 60: Create Receipt Upload Component](#task-60-create-receipt-upload-component)
10. [Testing Strategy](#testing-strategy)
11. [Quality Checklist](#quality-checklist)

---

## Overview

This document covers the creation of the payment step (step 3) of the checkout flow. It establishes the payment page foundation, implements the payment methods section with selectable method cards, and creates the bank transfer payment option with full Sri Lanka bank details display and receipt upload functionality. This document also includes PayHere gateway integration stub and card payment placeholder for future implementation in Phase-09.

### Key Outcomes

- Payment page component with step 3 layout
- Payment methods section with method selection logic
- Reusable payment method card component
- PayHere payment gateway option (stub for Phase-09)
- Card payment option (placeholder for Phase-09)
- Bank transfer option with local bank support
- Bank account details display for Commercial Bank, BOC, Sampath Bank
- Receipt/slip upload with preview and validation
- Payment method icons and branding
- Payment selection state management
- Form validation for payment step

### Technology Stack

- React 18 with TypeScript
- Tailwind CSS for styling
- Lucide React for icons
- React Hook Form for validation
- Custom hooks for state management
- File upload handling

### Sri Lanka Context

This payment step is designed specifically for Sri Lankan e-commerce:

- **PayHere Gateway:** Sri Lanka's leading payment gateway supporting local cards and mobile wallets
- **Bank Transfer:** Common payment method in Sri Lanka with manual verification
- **Popular Banks:** Commercial Bank, Bank of Ceylon (BOC), Sampath Bank are the three main banks
- **Bank Details Format:** Standard Sri Lankan account format with branch information
- **Receipt Upload:** Manual payment verification is standard practice in Sri Lanka
- **Currency:** All amounts shown in Sri Lankan Rupees (₨)

---

## Task 53: Create Payment Page Component

**Complexity:** Low  
**Dependencies:** Task 52 (Shipping page completed)  
**Priority:** Critical Path

### Objective

Create the main payment step component (step 3 of checkout flow) that serves as the container for all payment-related UI and logic. This component integrates with the checkout stepper, manages payment step state, and orchestrates the payment method selection flow.

### Requirements

#### Functional Requirements

1. **Step Integration**
   - Display as step 3 in checkout flow
   - Show "Payment" as step title
   - Integrate with checkout stepper navigation
   - Show step indicator (3 of 5)

2. **Layout Structure**
   - Page header with step title
   - Payment methods section container
   - Order summary sidebar (right side)
   - Navigation buttons (back to shipping, continue to review)
   - Progress indicator

3. **State Management**
   - Track selected payment method
   - Store payment method specific data
   - Validate payment information
   - Integrate with checkout context

4. **Navigation Logic**
   - Back button returns to shipping step
   - Continue button validates payment selection
   - Prevent navigation if payment not selected
   - Prevent navigation if required data missing

5. **Data Flow**
   - Receive order data from checkout context
   - Receive shipping info from previous step
   - Pass payment data to next step
   - Update checkout state on changes

#### Non-Functional Requirements

1. **Responsive Design**
   - Mobile-first layout
   - Stack order summary below on mobile
   - Full width on mobile, sidebar on desktop
   - Touch-friendly interactive elements

2. **Performance**
   - Fast rendering with React.memo
   - Lazy load payment method components
   - Optimize re-renders with proper state management

3. **Accessibility**
   - ARIA labels for step indicator
   - Keyboard navigation support
   - Screen reader announcements
   - Focus management on load

4. **User Experience**
   - Clear visual hierarchy
   - Prominent payment method selection
   - Loading states for async operations
   - Error message display

### Component Structure

#### PaymentStep.tsx Structure

| Section | Purpose |
|---------|---------|
| Step Header | Shows "Step 3: Payment" with icon |
| Instructions | Brief guidance on selecting payment |
| Payment Methods | Container for payment method cards |
| Order Summary | Right sidebar with cart summary |
| Navigation | Back and continue buttons |
| Validation | Error messages and warnings |

#### Component Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| orderId | string | Yes | Current order ID |
| onBack | function | Yes | Navigate to shipping step |
| onContinue | function | Yes | Navigate to review step |
| isLoading | boolean | No | Show loading state |

#### Component State

| State | Type | Default | Description |
|-------|------|---------|-------------|
| selectedMethod | string \| null | null | ID of selected payment method |
| paymentData | object | {} | Method-specific payment data |
| isValid | boolean | false | Whether payment is valid |
| errors | object | {} | Validation error messages |

### Layout Design

#### Desktop Layout (≥768px)

```
┌────────────────────────────────────────────────┐
│ ← Step 3: Payment                              │
├────────────────────────────────┬───────────────┤
│                                │               │
│  Select Payment Method         │  Order        │
│                                │  Summary      │
│  ┌──────────────────────────┐ │               │
│  │ 🏦 PayHere               │ │  Items: 3     │
│  └──────────────────────────┘ │  Subtotal:    │
│                                │  ₨12,500      │
│  ┌──────────────────────────┐ │               │
│  │ 💳 Credit/Debit Card     │ │  Shipping:    │
│  └──────────────────────────┘ │  ₨350         │
│                                │               │
│  ┌──────────────────────────┐ │  Total:       │
│  │ 🏛️ Bank Transfer         │ │  ₨12,850      │
│  └──────────────────────────┘ │               │
│                                │               │
│  ┌──────────────────────────┐ │               │
│  │ 💵 Cash on Delivery      │ │               │
│  └──────────────────────────┘ │               │
│                                │               │
│  [More methods...]             │               │
│                                │               │
├────────────────────────────────┴───────────────┤
│  [← Back to Shipping]    [Continue to Review →]│
└────────────────────────────────────────────────┘
```

#### Mobile Layout (<768px)

```
┌──────────────────────────┐
│ ← Step 3: Payment        │
├──────────────────────────┤
│                          │
│  Select Payment Method   │
│                          │
│  ┌────────────────────┐ │
│  │ 🏦 PayHere         │ │
│  └────────────────────┘ │
│                          │
│  ┌────────────────────┐ │
│  │ 💳 Card            │ │
│  └────────────────────┘ │
│                          │
│  ┌────────────────────┐ │
│  │ 🏛️ Bank Transfer   │ │
│  └────────────────────┘ │
│                          │
│  ┌────────────────────┐ │
│  │ 💵 COD             │ │
│  └────────────────────┘ │
│                          │
│  [More methods...]       │
│                          │
├──────────────────────────┤
│  Order Summary           │
│  Items: 3                │
│  Total: ₨12,850          │
├──────────────────────────┤
│  [← Back]   [Continue →] │
└──────────────────────────┘
```

### Step Indicator Integration

#### Progress Display

```
Step 1: Cart → Step 2: Shipping → Step 3: Payment → Step 4: Review → Step 5: Confirm
                                       ▲ (current)
```

#### Step State

| Step | Label | Status | Clickable |
|------|-------|--------|-----------|
| 1 | Cart | Completed | Yes |
| 2 | Shipping | Completed | Yes |
| 3 | Payment | Current | No |
| 4 | Review | Pending | No |
| 5 | Confirm | Pending | No |

### Payment Selection Flow

#### Selection Logic

1. User clicks on payment method card
2. Card expands to show method-specific fields
3. Other cards collapse
4. selectedMethod state updates
5. Payment-specific component renders
6. User fills required information
7. Validation runs on blur/change
8. Continue button enables when valid

#### State Updates

| Action | State Change | Effect |
|--------|--------------|--------|
| Select method | selectedMethod = methodId | Expand selected card |
| Enter data | paymentData[methodId] = data | Store method data |
| Validate | isValid = validation result | Enable/disable continue |
| Navigate back | Preserve payment state | Return to shipping |
| Navigate forward | Save payment to context | Move to review |

### Validation Rules

#### Pre-Continue Validation

| Check | Rule | Error Message |
|-------|------|---------------|
| Method selected | selectedMethod !== null | "Please select a payment method" |
| Method valid | Method-specific validation passes | Method-specific error |
| Data complete | All required fields filled | "Please complete payment information" |

#### Method-Specific Validation

- **PayHere:** No pre-validation (validated on gateway)
- **Card:** No pre-validation (validated on gateway)
- **Bank Transfer:** Receipt uploaded and valid
- **COD:** Order meets COD conditions
- **BNPL:** Order meets minimum amount

### Error Handling

#### Error Display

| Error Type | Display Location | Style |
|------------|------------------|-------|
| No method selected | Below methods section | Red alert box |
| Invalid method data | Within method card | Red text below field |
| Navigation error | Top of page | Red banner |
| API error | Top of page | Red banner with retry |

#### Error Messages

| Error | Message |
|-------|---------|
| No selection | "Please select a payment method to continue" |
| Invalid bank transfer | "Please upload a valid payment receipt" |
| COD limit exceeded | "Cash on Delivery not available for orders over ₨25,000" |
| BNPL minimum | "This payment method requires a minimum order of ₨1,000" |

### Loading States

#### Loading Scenarios

| Scenario | Indicator | Behavior |
|----------|-----------|----------|
| Initial load | Full page skeleton | Show payment structure |
| Switching methods | Spinner in card | Disable interactions |
| Validating payment | Spinner on button | Disable navigation |
| Saving payment | Loading overlay | Block all interactions |

### Accessibility

#### ARIA Labels

| Element | ARIA Label |
|---------|------------|
| Step header | "Step 3 of 5: Payment" |
| Methods section | "Available payment methods" |
| Method card | "Select [Method Name] payment" |
| Back button | "Return to shipping information" |
| Continue button | "Continue to order review" |

#### Keyboard Navigation

| Key | Action |
|-----|--------|
| Tab | Navigate between payment methods |
| Enter/Space | Select payment method |
| Escape | Collapse expanded method |
| Tab | Navigate through method fields |

#### Screen Reader

- Announce current step on load: "Step 3: Payment"
- Announce method selection: "[Method] payment method selected"
- Announce validation errors clearly
- Announce navigation state changes

### Component File Structure

```
frontend/src/components/storefront/checkout/Payment/
├── PaymentStep.tsx              (Main component)
├── PaymentStep.module.css       (Component-specific styles)
├── PaymentStep.test.tsx         (Component tests)
└── index.ts                     (Export)
```

### Integration Points

#### Checkout Context Integration

| Context Method | Usage |
|----------------|-------|
| getOrderData() | Retrieve order information |
| getShippingInfo() | Get shipping from previous step |
| setPaymentInfo() | Store selected payment method |
| navigateToStep() | Navigate to other steps |

#### Props from Parent

| Prop | Source | Purpose |
|------|--------|---------|
| orderId | Checkout context | Identify current order |
| orderTotal | Checkout context | Display in summary |
| onBack | Parent handler | Navigate to shipping |
| onContinue | Parent handler | Navigate to review |

### Success Criteria

- [ ] Payment step displays correctly in checkout flow
- [ ] Step indicator shows payment as step 3
- [ ] Order summary displays on right sidebar (desktop)
- [ ] Order summary displays below methods (mobile)
- [ ] Back button returns to shipping step
- [ ] Continue button disabled until valid payment selected
- [ ] Payment method selection state managed correctly
- [ ] Responsive layout works on all screen sizes
- [ ] Accessible to keyboard and screen reader users
- [ ] Loading states display during async operations
- [ ] Error messages display clearly and helpfully
- [ ] Component integrates with checkout context

---

## Task 54: Create Payment Methods Section

**Complexity:** Low  
**Dependencies:** Task 53 (Payment page component)  
**Priority:** Critical Path

### Objective

Create the payment methods section component that displays all available payment options, manages the selection of payment methods, and orchestrates the display of method-specific UI. This section serves as the container and controller for all payment method cards.

### Requirements

#### Functional Requirements

1. **Method Display**
   - Show all available payment methods
   - Display methods in priority order
   - Show method icons and names
   - Support method expansion/collapse

2. **Selection Management**
   - Track currently selected method
   - Allow only one method selected at a time
   - Auto-collapse previous selection
   - Emit selection change events

3. **Method Organization**
   - Group methods by category (optional)
   - Show popular methods first
   - Support method filtering/hiding
   - Display method availability status

4. **UI Coordination**
   - Manage expanded/collapsed states
   - Coordinate method card animations
   - Handle method card interactions
   - Show selection indicator

#### Non-Functional Requirements

1. **Performance**
   - Smooth expand/collapse animations
   - Fast method switching
   - Optimized re-renders

2. **Accessibility**
   - Radio group semantics
   - Keyboard navigation
   - Screen reader support

3. **Responsive**
   - Stack methods vertically on mobile
   - Maintain touch-friendly spacing
   - Proper card width on desktop

### Component Structure

#### PaymentMethods.tsx Structure

| Section | Purpose |
|---------|---------|
| Section Header | Title and instructions |
| Methods List | Container for method cards |
| Selection State | Hidden state management |
| Validation | Method selection validation |

#### Component Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| selectedMethod | string \| null | No | Currently selected method ID |
| onMethodChange | function | Yes | Called when method selected |
| orderTotal | number | Yes | Order total for method filtering |
| availableMethods | string[] | No | Filter available methods |

#### Component State

| State | Type | Default | Description |
|-------|------|---------|-------------|
| expandedMethod | string \| null | null | Currently expanded method |
| methodsData | object | {} | Data for each method |

### Payment Methods List

#### Sri Lanka Payment Methods (Priority Order)

| Priority | Method ID | Method Name | Popular | Icon |
|----------|-----------|-------------|---------|------|
| 1 | payhere | PayHere Gateway | ⭐⭐⭐ | 🏦 |
| 2 | card | Credit/Debit Card | ⭐⭐⭐ | 💳 |
| 3 | bank_transfer | Bank Transfer | ⭐⭐ | 🏛️ |
| 4 | cod | Cash on Delivery | ⭐⭐⭐ | 💵 |
| 5 | koko | KOKO (BNPL) | ⭐ | 🔄 |
| 6 | mintpay | MintPay (BNPL) | ⭐ | 💎 |

#### Method Configuration

Each payment method configuration:

```typescript
interface PaymentMethodConfig {
  id: string;
  name: string;
  description: string;
  icon: string;
  popular: boolean;
  enabled: boolean;
  minAmount?: number;
  maxAmount?: number;
  conditions?: string[];
}
```

#### PayHere Configuration

| Property | Value |
|----------|-------|
| ID | payhere |
| Name | PayHere Payment Gateway |
| Description | Pay with cards, mobile wallets, or bank accounts |
| Icon | PayHere logo |
| Popular | Yes |
| Min Amount | ₨100 |
| Max Amount | None |
| Conditions | None |

#### Card Payment Configuration

| Property | Value |
|----------|-------|
| ID | card |
| Name | Credit/Debit Card |
| Description | Visa, Mastercard, Amex accepted |
| Icon | Card icon |
| Popular | Yes |
| Min Amount | ₨100 |
| Max Amount | None |
| Conditions | None |

#### Bank Transfer Configuration

| Property | Value |
|----------|-------|
| ID | bank_transfer |
| Name | Bank Transfer |
| Description | Transfer to our bank and upload receipt |
| Icon | Bank building icon |
| Popular | Moderate |
| Min Amount | ₨500 |
| Max Amount | None |
| Conditions | Manual verification required |

#### COD Configuration

| Property | Value |
|----------|-------|
| ID | cod |
| Name | Cash on Delivery |
| Description | Pay cash when your order is delivered |
| Icon | Cash/money icon |
| Popular | Yes |
| Min Amount | ₨500 |
| Max Amount | ₨25,000 |
| Conditions | Available in Sri Lanka only |

#### KOKO BNPL Configuration

| Property | Value |
|----------|-------|
| ID | koko |
| Name | KOKO |
| Description | Buy now, pay in 3 installments |
| Icon | KOKO logo |
| Popular | Growing |
| Min Amount | ₨1,000 |
| Max Amount | ₨100,000 |
| Conditions | Subject to approval |

#### MintPay Configuration

| Property | Value |
|----------|-------|
| ID | mintpay |
| Name | MintPay |
| Description | Split payment into 3 equal parts |
| Icon | MintPay logo |
| Popular | Growing |
| Min Amount | ₨1,000 |
| Max Amount | ₨50,000 |
| Conditions | Subject to approval |

### Method Filtering

#### Filtering Logic

Filter methods based on order conditions:

| Filter | Check | Example |
|--------|-------|---------|
| Minimum amount | orderTotal >= method.minAmount | BNPL requires ₨1,000 |
| Maximum amount | orderTotal <= method.maxAmount | COD max ₨25,000 |
| Location | User in supported area | COD Sri Lanka only |
| Availability | method.enabled === true | Admin can disable |

#### Filtering Implementation

1. Load all method configurations
2. Apply order total filters
3. Apply location filters
4. Apply availability filters
5. Sort by priority
6. Display filtered methods

### Selection Management

#### Selection States

| State | Description | Visual Indicator |
|-------|-------------|------------------|
| Unselected | Default state | Gray border |
| Selected | Currently selected | Blue border, radio filled |
| Expanded | Selected and showing fields | Blue border, expanded content |
| Disabled | Not available | Gray overlay, no interaction |

#### Selection Flow

1. User clicks unselected method card
2. Previous method collapses (if any)
3. New method becomes selected
4. New method expands to show fields
5. onMethodChange callback fires
6. Parent component updates state

#### Auto-Collapse Logic

When method selection changes:
- Previous method collapses with animation
- New method expands with animation
- Animations coordinated for smooth transition
- State updates propagate to parent

### Layout Design

#### Methods Grid

| Screen Size | Layout | Spacing |
|-------------|--------|---------|
| Mobile (<640px) | 1 column, full width | 12px gap |
| Tablet (640-1024px) | 1 column, max 600px | 16px gap |
| Desktop (≥1024px) | 1 column, max 700px | 20px gap |

#### Section Structure

```
┌────────────────────────────────────────┐
│ Payment Methods                        │
│ Select your preferred payment method   │
├────────────────────────────────────────┤
│                                        │
│ ┌────────────────────────────────────┐│
│ │ ⚪ PayHere Payment Gateway         ││
│ │    Pay with cards or mobile wallet ││
│ └────────────────────────────────────┘│
│                                        │
│ ┌────────────────────────────────────┐│
│ │ ⚪ Credit/Debit Card               ││
│ │    Visa, Mastercard, Amex          ││
│ └────────────────────────────────────┘│
│                                        │
│ ┌────────────────────────────────────┐│
│ │ 🔘 Bank Transfer                   ││
│ │    Transfer and upload receipt     ││
│ │ ╔════════════════════════════════╗ ││
│ │ ║ [Bank details displayed here]  ║ ││
│ │ ║ [Upload receipt section]       ║ ││
│ │ ╚════════════════════════════════╝ ││
│ └────────────────────────────────────┘│
│                                        │
│ ┌────────────────────────────────────┐│
│ │ ⚪ Cash on Delivery                ││
│ │    Pay when delivered              ││
│ └────────────────────────────────────┘│
│                                        │
│ [More methods...]                      │
└────────────────────────────────────────┘
```

### Method Card Interaction

#### Click Behavior

| Area | Action | Result |
|------|--------|--------|
| Card header | Select method | Expand and select |
| Radio button | Select method | Expand and select |
| Expanded content | Interact with fields | No card state change |
| Outside card | No action | No change |

#### Keyboard Behavior

| Key | Action |
|-----|--------|
| Tab | Navigate to next method |
| Shift+Tab | Navigate to previous method |
| Enter/Space | Select focused method |
| Arrow Down | Navigate to next method |
| Arrow Up | Navigate to previous method |

### Animation Specs

#### Expand Animation

| Property | Value |
|----------|-------|
| Duration | 300ms |
| Easing | ease-in-out |
| Properties | max-height, opacity |
| Delay | 0ms |

#### Collapse Animation

| Property | Value |
|----------|-------|
| Duration | 200ms |
| Easing | ease-in |
| Properties | max-height, opacity |
| Delay | 0ms |

#### Stagger Effect

When switching methods:
1. Collapse previous (200ms)
2. Wait 50ms
3. Expand new (300ms)

### Accessibility

#### Semantic Structure

- Use `<fieldset>` for methods group
- Use `<legend>` for section title
- Use radio semantics for selection
- Proper heading hierarchy

#### ARIA Attributes

| Element | ARIA Attribute | Value |
|---------|----------------|-------|
| Methods container | role | radiogroup |
| Section | aria-labelledby | section-title |
| Selected method | aria-checked | true |
| Disabled method | aria-disabled | true |

#### Screen Reader Announcements

- "Payment methods, radio group"
- "[Method name] payment method, [checked/not checked]"
- "Expanded, showing payment details"
- "Collapsed"

### Validation

#### Selection Validation

| Rule | Check | Error Message |
|------|-------|---------------|
| Required | method !== null | "Please select a payment method" |
| Valid | method in availableMethods | "Selected method not available" |
| Conditions | method conditions met | Method-specific message |

#### Method-Specific Validation

Handled by individual method components:
- Bank transfer: Receipt uploaded
- COD: Conditions met
- BNPL: Minimum order met

### Component File Structure

```
frontend/src/components/storefront/checkout/Payment/
├── PaymentMethods.tsx           (Main section component)
├── PaymentMethods.module.css    (Section styles)
├── PaymentMethods.test.tsx      (Section tests)
└── index.ts                     (Export)
```

### Success Criteria

- [ ] All payment methods display in correct order
- [ ] Methods filtered based on order total and conditions
- [ ] Only one method can be selected at a time
- [ ] Selected method expands to show details
- [ ] Previous method collapses when new one selected
- [ ] Smooth animations between expand/collapse
- [ ] Selection state updates correctly
- [ ] Keyboard navigation works properly
- [ ] Screen reader announces method selection
- [ ] Disabled methods shown as unavailable
- [ ] Method availability validated against order
- [ ] Integration with payment step component

---

## Task 55: Create Payment Method Card Component

**Complexity:** Low  
**Dependencies:** Task 54 (Payment methods section)  
**Priority:** Critical Path

### Objective

Create a reusable payment method card component that displays individual payment methods with consistent styling, handles selection state, supports expand/collapse functionality, and contains method-specific payment fields when expanded.

### Requirements

#### Functional Requirements

1. **Card Display**
   - Show method icon/logo
   - Display method name
   - Show brief description
   - Display popular badge (if applicable)

2. **Selection State**
   - Visual indicator for selected/unselected
   - Radio button representation
   - Support disabled state
   - Show selection animation

3. **Expand/Collapse**
   - Expand when selected
   - Show method-specific fields when expanded
   - Collapse when deselected
   - Smooth transition animations

4. **Method Content**
   - Render method-specific component when expanded
   - Pass necessary props to child component
   - Handle child component state
   - Support form validation from child

#### Non-Functional Requirements

1. **Reusability**
   - Work for all payment methods
   - Configurable appearance
   - Flexible content rendering

2. **Performance**
   - Lazy load method components
   - Optimize animations
   - Prevent unnecessary re-renders

3. **Accessibility**
   - Semantic HTML structure
   - ARIA attributes for state
   - Keyboard interaction support

### Component Structure

#### PaymentMethodCard.tsx Structure

| Section | Purpose |
|---------|---------|
| Card Container | Overall card wrapper |
| Card Header | Clickable selection area |
| Method Info | Icon, name, description |
| Selection Indicator | Radio button/checkmark |
| Expanded Content | Method-specific fields |
| Popular Badge | Optional popularity indicator |

#### Component Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| method | PaymentMethodConfig | Yes | Method configuration |
| selected | boolean | Yes | Whether method is selected |
| expanded | boolean | Yes | Whether card is expanded |
| disabled | boolean | No | Whether method is disabled |
| onSelect | function | Yes | Called when card clicked |
| orderTotal | number | Yes | Order total for validation |
| children | ReactNode | No | Method-specific content |

#### PaymentMethodConfig Interface

```typescript
interface PaymentMethodConfig {
  id: string;
  name: string;
  description: string;
  icon: string;          // Icon name or logo URL
  iconType: 'lucide' | 'image';
  popular: boolean;
  minAmount?: number;
  maxAmount?: number;
  badge?: string;        // Optional badge text
  disabledMessage?: string;
}
```

### Card States

#### Visual States

| State | Border | Background | Icon | Radio |
|-------|--------|------------|------|-------|
| Unselected | Gray | White | Gray | Empty circle |
| Hovered | Blue light | Light blue | Gray | Empty circle |
| Selected | Blue | White | Blue | Filled circle |
| Expanded | Blue | White | Blue | Filled circle |
| Disabled | Gray | Light gray | Light gray | Disabled circle |

#### State Combinations

| Selected | Expanded | Interactive |
|----------|----------|-------------|
| false | false | Clickable to select |
| true | false | Clickable to expand |
| true | true | Content interactive |
| disabled | false | Not interactive |

### Card Layout

#### Desktop Card Layout

```
┌────────────────────────────────────────────┐
│ ⚪  [Icon]  Method Name            POPULAR │
│            Brief description               │
└────────────────────────────────────────────┘

(Unselected, Collapsed)
```

```
┌────────────────────────────────────────────┐
│ 🔘  [Icon]  Method Name            POPULAR │
│            Brief description               │
│ ┌────────────────────────────────────────┐ │
│ │                                        │ │
│ │  [Method-specific content here]       │ │
│ │                                        │ │
│ │  [Form fields, buttons, info]         │ │
│ │                                        │ │
│ └────────────────────────────────────────┘ │
└────────────────────────────────────────────┘

(Selected, Expanded)
```

#### Mobile Card Layout

```
┌──────────────────────────┐
│ ⚪ [Icon]        POPULAR │
│                          │
│ Method Name              │
│ Brief description        │
└──────────────────────────┘

(Unselected, Collapsed)
```

```
┌──────────────────────────┐
│ 🔘 [Icon]        POPULAR │
│                          │
│ Method Name              │
│ Brief description        │
│ ╔══════════════════════╗ │
│ ║                      ║ │
│ ║ Method content       ║ │
│ ║                      ║ │
│ ╚══════════════════════╝ │
└──────────────────────────┘

(Selected, Expanded)
```

### Card Header Design

#### Header Elements

| Element | Position | Purpose |
|---------|----------|---------|
| Radio button | Left | Selection indicator |
| Method icon | Left (after radio) | Visual identification |
| Method name | Center-left | Primary label |
| Description | Below name | Brief explanation |
| Popular badge | Top-right | Highlight popular methods |
| Disabled overlay | Full card | Show unavailable |

#### Header Dimensions

| Breakpoint | Height | Padding | Icon Size |
|------------|--------|---------|-----------|
| Mobile | 80px | 16px | 32px |
| Tablet | 72px | 20px | 40px |
| Desktop | 64px | 24px | 48px |

### Icon Display

#### Icon Types

**Lucide Icons** (for generic methods):
- CreditCard (card payment)
- Building (bank transfer)
- Banknote (cash on delivery)
- Repeat (BNPL/installment)

**Image Logos** (for branded methods):
- PayHere logo (PNG/SVG)
- KOKO logo (PNG/SVG)
- MintPay logo (PNG/SVG)
- Bank logos (optional)

#### Icon Styling

| Property | Value |
|----------|-------|
| Size | 40px × 40px (desktop), 32px × 32px (mobile) |
| Border radius | 8px |
| Background | Light gray (for image logos) |
| Padding | 8px (for image logos) |
| Filter | Grayscale when disabled |

### Popular Badge

#### Badge Display

| Condition | Display |
|-----------|---------|
| method.popular === true | Show "POPULAR" badge |
| method.badge !== undefined | Show custom badge text |
| Otherwise | No badge |

#### Badge Styling

| Property | Value |
|----------|-------|
| Background | Gradient blue |
| Text color | White |
| Font size | 10px |
| Font weight | Bold |
| Padding | 4px 8px |
| Border radius | 4px |
| Position | Top-right corner |

### Expanded Content Area

#### Content Container

| Property | Value |
|----------|-------|
| Margin top | 16px |
| Padding | 20px |
| Background | Very light gray (#F9FAFB) |
| Border radius | 8px |
| Border | 1px solid light gray |

#### Content Rendering

1. When card selected and expanded
2. Render children prop (method-specific component)
3. Pass orderTotal and other props to child
4. Child component handles its own state
5. Child validates and emits data

### Disabled State

#### Disabled Reasons

| Reason | Example |
|--------|---------|
| Below minimum | BNPL requires ₨1,000, order is ₨800 |
| Above maximum | COD max ₨25,000, order is ₨30,000 |
| Location restricted | COD not available outside Sri Lanka |
| Temporarily disabled | Admin disabled method |

#### Disabled Display

| Element | Disabled Appearance |
|---------|---------------------|
| Card | Gray overlay, reduced opacity |
| Radio | Disabled state, not clickable |
| Icon | Grayscale filter |
| Text | Gray color |
| Cursor | Not-allowed cursor |
| Message | Show reason for disabled |

#### Disabled Message Display

```
┌────────────────────────────────────────┐
│ ⊘  [Icon]  Cash on Delivery       ✗   │
│            Pay when delivered          │
│                                        │
│ ⚠️  Not available: Order exceeds      │
│     ₨25,000 maximum                   │
└────────────────────────────────────────┘
```

### Animation Specifications

#### Expand Animation

```css
Transition:
  max-height: 0 → auto (300ms ease-in-out)
  opacity: 0 → 1 (300ms ease-in-out)
  margin-top: 0 → 16px (300ms ease-in-out)
```

#### Collapse Animation

```css
Transition:
  max-height: auto → 0 (200ms ease-in)
  opacity: 1 → 0 (200ms ease-in)
  margin-top: 16px → 0 (200ms ease-in)
```

#### Hover Animation

```css
Transition:
  border-color: 200ms ease
  background-color: 200ms ease
  transform: translateY(-2px) (200ms ease)
  box-shadow: 200ms ease
```

### Interaction Behavior

#### Click Handling

| Click Area | Selected | Action |
|------------|----------|--------|
| Card header | false | Select and expand |
| Card header | true | Keep selected (no-op) |
| Expanded content | true | Interact with content |
| Radio button | Any | Select and expand |

#### Keyboard Handling

| Key | Focus on Card | Action |
|-----|---------------|--------|
| Enter | Unselected | Select and expand |
| Space | Unselected | Select and expand |
| Tab | Any | Move to next element |
| Shift+Tab | Any | Move to previous element |

#### Focus Management

1. When card selected via keyboard:
   - Move focus to first field in expanded content
   - If no fields, focus remains on card
2. When card deselected:
   - Focus returns to card radio button

### Responsive Behavior

#### Breakpoint Adjustments

| Breakpoint | Layout Change |
|------------|---------------|
| <640px | Stack icon and name vertically, smaller text |
| 640-1024px | Horizontal layout, medium text |
| ≥1024px | Horizontal layout, full text |

#### Touch Optimization

| Element | Touch Target |
|---------|--------------|
| Card header | Minimum 48px height |
| Radio button | Minimum 44px tap area |
| Expanded fields | Minimum 44px height |

### Accessibility

#### Semantic HTML

```html
<div role="radio" 
     aria-checked="true/false"
     aria-disabled="true/false"
     aria-labelledby="method-name"
     aria-describedby="method-description">
  
  <div id="method-name">Method Name</div>
  <div id="method-description">Description</div>
  
  <div aria-hidden="true/false" aria-expanded="true/false">
    <!-- Expanded content -->
  </div>
</div>
```

#### ARIA Attributes

| Element | Attribute | Value |
|---------|-----------|-------|
| Card | role | radio |
| Card | aria-checked | true/false |
| Card | aria-disabled | true/false |
| Card | tabindex | 0 |
| Content | aria-hidden | true (when collapsed) |
| Content | aria-expanded | true (when expanded) |

#### Keyboard Navigation

- Card focusable with tabindex="0"
- Enter/Space to select
- Tab to navigate within expanded content
- Focus visible indicator

#### Screen Reader

- Announce method name and description
- Announce selected/not selected
- Announce expanded/collapsed
- Announce disabled reason

### Component File Structure

```
frontend/src/components/storefront/checkout/Payment/
├── PaymentMethodCard.tsx        (Main card component)
├── PaymentMethodCard.module.css (Card styles)
├── PaymentMethodCard.test.tsx   (Card tests)
└── index.ts                     (Export)
```

### Success Criteria

- [ ] Card displays method icon, name, and description
- [ ] Popular badge shows for popular methods
- [ ] Selected state visually distinct from unselected
- [ ] Card expands smoothly when selected
- [ ] Card collapses smoothly when deselected
- [ ] Expanded content renders method-specific component
- [ ] Disabled state displayed with reason
- [ ] Hover effects work correctly
- [ ] Click on card header selects method
- [ ] Keyboard navigation fully functional
- [ ] Screen reader announces all states
- [ ] Responsive layout works on all screen sizes
- [ ] Animations smooth and performant
- [ ] Component reusable for all payment methods

---

## Task 56: Create PayHere Payment Option

**Complexity:** Medium  
**Dependencies:** Task 55 (Payment method card)  
**Priority:** High (Popular in Sri Lanka)

### Objective

Create the PayHere payment gateway option component. PayHere is Sri Lanka's leading payment gateway supporting credit/debit cards, mobile wallets, and bank account payments. This component provides a placeholder/stub for PayHere integration (full integration in Phase-09) while establishing the UI foundation and state management.

### Requirements

#### Functional Requirements

1. **Gateway Information Display**
   - Show PayHere logo and branding
   - Display supported payment types
   - Show accepted card brands
   - List supported mobile wallets

2. **Payment Flow Stub**
   - Placeholder for gateway initialization
   - Simulate gateway redirect (stub)
   - Handle success/failure callbacks
   - Store gateway transaction reference

3. **Security Indicators**
   - Show secure payment badges
   - Display SSL/encryption indicators
   - Show PCI compliance badges
   - Trust indicators (verified gateway)

4. **User Guidance**
   - Clear instructions for PayHere flow
   - Explain redirect process
   - Show expected next steps
   - Provide contact information

#### Non-Functional Requirements

1. **Branding**
   - Use PayHere official colors
   - Display PayHere logo correctly
   - Follow PayHere brand guidelines

2. **Trust**
   - Professional appearance
   - Security indicators prominent
   - Clear and transparent process

3. **Integration Readiness**
   - Structure ready for Phase-09 integration
   - Placeholder functions for gateway calls
   - State management prepared

### PayHere Overview

#### About PayHere

PayHere is Sri Lanka's premier payment gateway, providing secure online payment processing for businesses. It's the most widely trusted and used payment gateway in Sri Lanka.

#### Supported Payment Methods

| Category | Methods |
|----------|---------|
| Credit/Debit Cards | Visa, Mastercard, American Express |
| Mobile Wallets | eZ Cash, mCash, Genie |
| Bank Payments | Sampath Bank, Commercial Bank |

#### Key Features

| Feature | Description |
|---------|-------------|
| Secure | PCI DSS Level 1 certified |
| Fast | Instant payment processing |
| Local | Sri Lankan payment methods |
| Trusted | Used by major SL businesses |

### Component Structure

#### PayHereOption.tsx Structure

| Section | Purpose |
|---------|---------|
| Gateway Logo | PayHere branding |
| Info Section | Supported methods |
| Security Badges | Trust indicators |
| Payment Button | Initiate PayHere flow |
| Status Display | Transaction status |

#### Component Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| orderTotal | number | Yes | Amount to charge |
| orderId | string | Yes | Order reference |
| onPaymentComplete | function | Yes | Success callback |
| onPaymentError | function | Yes | Error callback |

#### Component State

| State | Type | Default | Description |
|-------|------|---------|-------------|
| isInitializing | boolean | false | Gateway loading |
| transactionId | string \| null | null | PayHere transaction ID |
| status | string | 'ready' | Payment status |
| errorMessage | string \| null | null | Error details |

### UI Layout

#### Desktop Layout

```
┌─────────────────────────────────────────────────────┐
│ PayHere Payment Gateway                             │
├─────────────────────────────────────────────────────┤
│                                                     │
│  [PayHere Logo]                                     │
│                                                     │
│  Pay securely with PayHere, Sri Lanka's leading     │
│  payment gateway.                                   │
│                                                     │
│  ✓ Credit/Debit Cards (Visa, Mastercard, Amex)    │
│  ✓ Mobile Wallets (eZ Cash, mCash, Genie)         │
│  ✓ Direct Bank Payments                            │
│                                                     │
│  ┌─────────────────────────────────────────────┐  │
│  │ 🔒 Secure Payment | PCI DSS Certified       │  │
│  └─────────────────────────────────────────────┘  │
│                                                     │
│  Amount to Pay: ₨12,850                             │
│                                                     │
│  [ Pay with PayHere → ]                             │
│                                                     │
│  You will be redirected to PayHere secure          │
│  payment page to complete your payment.             │
│                                                     │
└─────────────────────────────────────────────────────┘
```

#### Mobile Layout

```
┌───────────────────────────┐
│ PayHere Payment           │
├───────────────────────────┤
│                           │
│ [PayHere Logo]            │
│                           │
│ Secure payment gateway    │
│                           │
│ ✓ Cards                  │
│ ✓ Wallets                │
│ ✓ Bank                   │
│                           │
│ 🔒 Secure & Encrypted    │
│                           │
│ Amount: ₨12,850           │
│                           │
│ [Pay with PayHere →]      │
│                           │
│ Redirects to secure page  │
│                           │
└───────────────────────────┘
```

### PayHere Logo Display

#### Logo Specifications

| Property | Value |
|----------|-------|
| Format | SVG or PNG |
| Dimensions | 200px × 60px (desktop), 150px × 45px (mobile) |
| Background | White or transparent |
| Position | Centered at top |

#### Brand Colors

| Element | Color Code |
|---------|------------|
| Primary | #F26649 (PayHere orange) |
| Secondary | #2C3E50 (Dark gray) |
| Accent | #3498DB (Blue) |

### Supported Payment Methods Display

#### Payment Methods Grid

```
┌────────────────────────────────────────────┐
│ Accepted Payment Methods:                 │
│                                            │
│ Credit/Debit Cards:                        │
│ [Visa] [Mastercard] [Amex]                │
│                                            │
│ Mobile Wallets:                            │
│ [eZ Cash] [mCash] [Genie]                 │
│                                            │
│ Bank Payments:                             │
│ [Sampath] [Commercial]                     │
└────────────────────────────────────────────┘
```

#### Card Brand Icons

Display card brand logos:
- Visa (blue/white logo)
- Mastercard (red/yellow logo)
- American Express (blue logo)

#### Mobile Wallet Icons

Display wallet logos:
- eZ Cash (orange logo)
- mCash (Dialog red logo)
- Genie (green logo)

### Security Badges

#### Trust Indicators

| Badge | Description | Position |
|-------|-------------|----------|
| PCI DSS | Payment Card Industry certified | Top |
| SSL | 256-bit encryption | Next to amount |
| Verified | PayHere verified merchant | Bottom |
| Money-back | Refund policy indicator | Bottom |

#### Security Message

"Your payment information is encrypted and secure. We never store your card details."

### Payment Flow (Stub Implementation)

#### Flow Steps

1. **Initialization**
   - User clicks "Pay with PayHere"
   - Component enters loading state
   - Prepare payment parameters (stub)

2. **Gateway Redirect (Stub)**
   - In Phase-09: Redirect to PayHere
   - Current: Show simulated loading
   - Display "Redirecting to PayHere..."

3. **Payment Processing (Stub)**
   - In Phase-09: User completes payment on PayHere
   - Current: Simulate 2-second delay
   - Show processing indicator

4. **Callback Handling (Stub)**
   - In Phase-09: PayHere redirects back with result
   - Current: Simulate success response
   - Update component state

5. **Completion**
   - Show success/failure message
   - Call parent callback
   - Store transaction reference

#### Stub Implementation Notes

**Phase-08 (Current):**
- Button shows "Pay with PayHere (Demo)"
- Clicking shows loading for 2 seconds
- Automatically succeeds with dummy transaction ID
- No actual gateway integration

**Phase-09 (Future):**
- Full PayHere SDK integration
- Real gateway redirect
- Actual payment processing
- Proper callback handling
- Transaction verification

### Payment Button

#### Button States

| State | Label | Appearance | Clickable |
|-------|-------|------------|-----------|
| Ready | Pay with PayHere → | Blue, prominent | Yes |
| Loading | Processing... | Blue, spinner | No |
| Success | Payment Successful ✓ | Green | No |
| Error | Payment Failed ✗ | Red | Yes (retry) |

#### Button Styling

| Property | Value |
|----------|-------|
| Background | PayHere orange (#F26649) |
| Text color | White |
| Font weight | Bold |
| Padding | 16px 32px |
| Border radius | 8px |
| Font size | 16px |
| Width | Full width on mobile |

### Amount Display

#### Display Format

```
┌─────────────────────────┐
│ Amount to Pay           │
│                         │
│ ₨12,850.00              │
│                         │
│ (Includes all charges)  │
└─────────────────────────┘
```

#### Amount Breakdown

Optionally show breakdown:
- Subtotal: ₨12,500
- Shipping: ₨350
- Total: ₨12,850

### Instructions Section

#### Before Payment

"Click the button below to securely pay via PayHere. You will be redirected to PayHere's secure payment page where you can choose your preferred payment method."

#### During Payment

"Redirecting to PayHere secure payment page... Please do not close this window."

#### After Payment

**Success:**
"Payment successful! Your order is confirmed. Transaction ID: [ID]"

**Failure:**
"Payment failed. Please try again or choose a different payment method. Error: [Error Message]"

### State Management

#### Payment States

| State | Description | UI Indication |
|-------|-------------|---------------|
| ready | Ready for payment | Show payment button |
| initializing | Preparing gateway | Loading spinner |
| redirecting | Opening PayHere | "Redirecting..." message |
| processing | Payment in progress | Processing indicator |
| success | Payment completed | Success message |
| failed | Payment failed | Error message, retry button |
| cancelled | User cancelled | Return to payment selection |

#### State Transitions

```
ready → initializing → redirecting → processing → success
                                                 → failed
                                                 → cancelled
```

### Error Handling

#### Error Types

| Error | Cause | User Message |
|-------|-------|--------------|
| initialization_failed | Gateway setup failed | "Unable to initialize payment. Please try again." |
| network_error | Connection issue | "Network error. Please check your connection." |
| payment_declined | Card declined | "Payment was declined. Please try another card." |
| timeout | Payment took too long | "Payment timed out. Please try again." |
| cancelled | User cancelled | "Payment cancelled. You can try again." |

#### Error Display

```
┌─────────────────────────────────────┐
│ ⚠️ Payment Error                    │
│                                     │
│ Payment was declined. Please try   │
│ another payment method or contact  │
│ your bank.                          │
│                                     │
│ [Try Again]  [Choose Another Method]│
└─────────────────────────────────────┘
```

### Integration Points (Phase-09)

#### PayHere SDK Integration

```typescript
// Placeholder for Phase-09
interface PayHereSDK {
  initialize: (merchantId: string, secretKey: string) => void;
  createPayment: (params: PaymentParams) => Promise<PaymentResponse>;
  handleCallback: (response: CallbackResponse) => void;
}
```

#### Payment Parameters

| Parameter | Example | Required |
|-----------|---------|----------|
| merchantId | "PAYHERE123456" | Yes |
| orderId | "ORD-2026-001" | Yes |
| amount | 12850.00 | Yes |
| currency | "LKR" | Yes |
| returnUrl | "/checkout/payment-return" | Yes |
| cancelUrl | "/checkout/payment-cancel" | Yes |
| notifyUrl | "/api/payment/notify" | Yes |

### Accessibility

#### ARIA Labels

| Element | Label |
|---------|-------|
| Payment button | "Pay ₨12,850 with PayHere payment gateway" |
| Logo | "PayHere payment gateway logo" |
| Security badge | "PCI DSS certified secure payment" |

#### Keyboard Navigation

- Payment button fully keyboard accessible
- Tab through all interactive elements
- Enter/Space to activate payment

#### Screen Reader

- Announce payment amount clearly
- Announce state changes
- Announce errors clearly
- Provide guidance during redirect

### Component File Structure

```
frontend/src/components/storefront/checkout/Payment/
├── PayHereOption.tsx            (Main component)
├── PayHereOption.module.css     (Component styles)
├── PayHereOption.test.tsx       (Component tests)
├── payhere-stub.ts              (Stub functions for Phase-08)
└── index.ts                     (Export)
```

### Success Criteria

- [ ] PayHere logo displayed correctly
- [ ] Supported payment methods listed clearly
- [ ] Security badges prominent and trustworthy
- [ ] Payment amount displayed correctly
- [ ] Payment button styled appropriately
- [ ] Stub payment flow works (simulated)
- [ ] Loading states display correctly
- [ ] Success state shows transaction ID
- [ ] Error states display helpful messages
- [ ] Instructions clear and helpful
- [ ] Code structure ready for Phase-09 integration
- [ ] Accessible to keyboard and screen readers

---

## Task 57: Create Card Payment Option

**Complexity:** Low  
**Dependencies:** Task 55 (Payment method card)  
**Priority:** Medium

### Objective

Create a card payment option component that serves as a placeholder for direct card payment integration (to be fully implemented in Phase-09). This component provides the UI foundation for credit/debit card payments with card brand recognition and displays a clear message that card payments will be processed through PayHere or other gateways.

### Requirements

#### Functional Requirements

1. **Card Information Display**
   - Show accepted card brands
   - Display card icons (Visa, Mastercard, Amex)
   - Show security indicators
   - Display PCI compliance

2. **Placeholder Form**
   - Card number field (disabled/placeholder)
   - Expiry date field (disabled/placeholder)
   - CVV field (disabled/placeholder)
   - Cardholder name field (disabled/placeholder)

3. **Gateway Integration Notice**
   - Clear message about Phase-09 implementation
   - Redirect to PayHere message
   - Alternative: Show that cards processed via PayHere

4. **Visual Feedback**
   - Card brand detection (visual only)
   - Field validation styling (placeholder)
   - Security badge display

#### Non-Functional Requirements

1. **User Experience**
   - Clear communication about placeholder status
   - Professional appearance
   - Maintains user trust

2. **Security Appearance**
   - Show that card data is secure
   - Display encryption indicators
   - PCI compliance badges

### Component Structure

#### CardPaymentOption.tsx Structure

| Section | Purpose |
|---------|---------|
| Card Brands | Accepted card logos |
| Implementation Notice | Phase-09 message |
| Form Placeholder | Disabled card form |
| Security Indicators | Trust badges |
| PayHere Redirect | Alternative flow |

#### Component Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| orderTotal | number | Yes | Payment amount |
| orderId | string | Yes | Order reference |
| onSelect | function | Yes | Select callback |

### UI Layout

#### Desktop Layout

```
┌─────────────────────────────────────────────────────┐
│ Credit/Debit Card Payment                           │
├─────────────────────────────────────────────────────┤
│                                                     │
│  We Accept: [Visa] [Mastercard] [Amex]             │
│                                                     │
│  ┌───────────────────────────────────────────────┐ │
│  │ ℹ️  Direct card payment integration will be   │ │
│  │    implemented in Phase-09. For now, please   │ │
│  │    use PayHere option above to pay with       │ │
│  │    your card.                                 │ │
│  └───────────────────────────────────────────────┘ │
│                                                     │
│  [Card Form Preview - Coming Soon]                  │
│                                                     │
│  Card Number                                        │
│  [ •••• •••• •••• ••••        [💳] ]               │
│                                                     │
│  Expiry Date          CVV                           │
│  [ MM/YY ]            [ ••• ]                       │
│                                                     │
│  Cardholder Name                                    │
│  [ Full Name on Card ]                              │
│                                                     │
│  🔒 Your card details are encrypted and secure      │
│      We never store your card information           │
│                                                     │
│  [ ← Use PayHere Instead ]                          │
│                                                     │
└─────────────────────────────────────────────────────┘
```

#### Mobile Layout

```
┌─────────────────────────────┐
│ Card Payment                │
├─────────────────────────────┤
│                             │
│ [Visa] [MC] [Amex]          │
│                             │
│ ┌─────────────────────────┐ │
│ │ ℹ️  Coming in Phase-09  │ │
│ │    Use PayHere option   │ │
│ │    to pay with card     │ │
│ └─────────────────────────┘ │
│                             │
│ Card Form Preview:          │
│                             │
│ Card Number                 │
│ [ •••• •••• •••• •••• ]    │
│                             │
│ Expiry        CVV           │
│ [ MM/YY ]   [ ••• ]        │
│                             │
│ Name on Card                │
│ [ Full Name ]               │
│                             │
│ 🔒 Encrypted & Secure       │
│                             │
│ [← Use PayHere]             │
│                             │
└─────────────────────────────┘
```

### Accepted Card Brands

#### Card Brand Display

| Brand | Logo | Color | Displayed |
|-------|------|-------|-----------|
| Visa | Visa logo | Blue/White | Yes |
| Mastercard | MC logo | Red/Yellow | Yes |
| American Express | Amex logo | Blue | Yes |
| Diners | Diners logo | Blue | Optional |
| Discover | Discover logo | Orange | Optional |

#### Card Icons Layout

```
┌──────────────────────────────────────┐
│ We Accept:                           │
│                                      │
│ [VISA]  [mastercard]  [AMEX]         │
│                                      │
│  💳      💳           💳             │
└──────────────────────────────────────┘
```

#### Card Icon Specifications

| Property | Value |
|----------|-------|
| Icon size | 48px × 32px |
| Spacing | 12px between icons |
| Background | White or light gray |
| Border | 1px solid light gray |
| Border radius | 4px |

### Implementation Notice

#### Notice Message Content

**Primary Message:**
"Direct card payment integration will be implemented in Phase-09. For now, please use the PayHere option to securely pay with your credit or debit card."

**Alternative Message:**
"Card payments are processed through PayHere, Sri Lanka's trusted payment gateway. Please select the PayHere option above to pay with your card."

#### Notice Styling

| Property | Value |
|----------|-------|
| Background | Light blue (#EBF5FF) |
| Border | 1px solid blue (#3B82F6) |
| Icon | Info icon (ℹ️) |
| Padding | 16px |
| Border radius | 8px |
| Font size | 14px |

### Placeholder Card Form

#### Form Fields

| Field | Placeholder | Type | Disabled |
|-------|-------------|------|----------|
| Card Number | •••• •••• •••• •••• | text | Yes |
| Expiry Date | MM/YY | text | Yes |
| CVV | ••• | password | Yes |
| Cardholder Name | Full Name on Card | text | Yes |

#### Field Layout

**Card Number:**
- Full width
- Card brand icon on right
- Placeholder dots for security

**Expiry and CVV:**
- Side by side (60% / 40%)
- Expiry: MM/YY format
- CVV: 3-4 dots

**Cardholder Name:**
- Full width
- Text input format

#### Field Styling (Disabled State)

| Property | Value |
|----------|-------|
| Background | Light gray (#F3F4F6) |
| Border | 1px solid gray |
| Cursor | not-allowed |
| Opacity | 0.6 |
| Text color | Gray |

#### Form Visual

```
┌─────────────────────────────────────┐
│ Card Number                         │
│ ┌─────────────────────────────────┐ │
│ │ •••• •••• •••• ••••      [💳]  │ │
│ └─────────────────────────────────┘ │
│                                     │
│ Expiry Date          CVV            │
│ ┌─────────────┐  ┌───────────────┐ │
│ │ MM/YY       │  │ •••           │ │
│ └─────────────┘  └───────────────┘ │
│                                     │
│ Cardholder Name                     │
│ ┌─────────────────────────────────┐ │
│ │ Full Name on Card               │ │
│ └─────────────────────────────────┘ │
└─────────────────────────────────────┘
```

### Card Brand Detection (Visual Only)

#### Detection Logic (Placeholder)

When form becomes active in Phase-09:

| Card Number Start | Brand | Icon |
|-------------------|-------|------|
| 4 | Visa | Visa icon |
| 51-55 | Mastercard | MC icon |
| 34, 37 | American Express | Amex icon |
| 6011, 644-649, 65 | Discover | Discover icon |

#### Visual Feedback

- Show detected card brand icon in card number field
- Highlight corresponding brand logo at top
- Change placeholder to match card format

### Security Indicators

#### Security Messages

```
┌─────────────────────────────────────┐
│ 🔒 SSL Encrypted Connection         │
│                                     │
│ Your card details are protected     │
│ with 256-bit encryption            │
│                                     │
│ We never store your card            │
│ information                         │
│                                     │
│ PCI DSS Compliant                   │
└─────────────────────────────────────┘
```

#### Trust Badges

| Badge | Message |
|-------|---------|
| 🔒 | SSL Encrypted |
| ✓ | PCI Compliant |
| 🛡️ | Bank-level Security |
| 💳 | No Card Details Stored |

### PayHere Redirect Button

#### Button Purpose

Provide clear alternative to select PayHere option instead

#### Button Design

| Property | Value |
|----------|-------|
| Label | ← Use PayHere Instead |
| Style | Secondary button |
| Background | White with blue border |
| Text color | Blue |
| Icon | Left arrow |
| Width | Full width on mobile |

#### Button Action

1. User clicks "Use PayHere Instead"
2. Component deselects card option
3. Component emits event to select PayHere
4. Parent switches to PayHere method card
5. PayHere card expands

### Phase-09 Implementation Notes

#### Future Implementation

When implementing in Phase-09:

1. **Enable Form Fields**
   - Remove disabled state
   - Add real validation
   - Connect to payment processor

2. **Card Brand Detection**
   - Implement live detection
   - Validate card numbers
   - Format card number display

3. **Tokenization**
   - Implement card tokenization
   - Never send raw card data
   - Use secure payment token

4. **Validation**
   - Real-time card validation
   - Luhn algorithm check
   - Expiry date validation
   - CVV validation

5. **Integration Options**
   - Stripe integration
   - Square integration
   - Braintree integration
   - Or continue with PayHere for cards

### Error Handling (Placeholder)

#### Error Types (Future)

| Error | Message |
|-------|---------|
| Invalid card | "Card number is invalid" |
| Expired card | "Card has expired" |
| Invalid CVV | "CVV must be 3 or 4 digits" |
| Processing error | "Unable to process card" |

### Accessibility

#### ARIA Labels

| Element | Label |
|---------|-------|
| Card form | "Credit card payment form (disabled)" |
| Card number | "Card number field (disabled for Phase-08)" |
| Notice | "Implementation notice: Use PayHere for card payments" |
| PayHere button | "Switch to PayHere payment method" |

#### Keyboard Navigation

- All fields focusable but disabled
- PayHere button fully accessible
- Clear focus indicators

#### Screen Reader

- Announce disabled state
- Read implementation notice
- Announce PayHere alternative

### Component File Structure

```
frontend/src/components/storefront/checkout/Payment/
├── CardPaymentOption.tsx        (Main component)
├── CardPaymentOption.module.css (Component styles)
├── CardPaymentOption.test.tsx   (Component tests)
└── index.ts                     (Export)
```

### Success Criteria

- [ ] Card brand logos displayed correctly
- [ ] Implementation notice clear and prominent
- [ ] Placeholder form displays professional layout
- [ ] All form fields properly disabled
- [ ] Security indicators build trust
- [ ] PayHere redirect button works correctly
- [ ] Responsive layout on all screen sizes
- [ ] Accessible to keyboard and screen readers
- [ ] Clear communication about Phase-09 implementation
- [ ] Maintains professional appearance despite placeholder status

---

## Task 58: Create Bank Transfer Option

**Complexity:** Medium  
**Dependencies:** Task 55 (Payment method card)  
**Priority:** High (Popular in Sri Lanka)

### Objective

Create the bank transfer payment option component that displays Sri Lankan bank account details, handles bank selection, shows account information with copy functionality, and includes receipt/slip upload functionality for payment verification. Bank transfer is a common payment method in Sri Lanka for larger orders.

### Requirements

#### Functional Requirements

1. **Bank Selection**
   - Display available banks
   - Support multiple bank accounts
   - Allow user to select destination bank
   - Highlight selected bank

2. **Account Details Display**
   - Show complete bank account information
   - Display bank name, branch, account number
   - Show account holder name
   - Provide copy-to-clipboard functionality

3. **Transfer Instructions**
   - Clear step-by-step instructions
   - Amount to transfer
   - Reference number to include
   - Expected processing time

4. **Receipt Upload**
   - File upload component
   - Accept images and PDFs
   - Show upload preview
   - Validate file type and size

5. **Verification Notice**
   - Explain manual verification process
   - Expected verification timeframe
   - Order will be held pending verification

#### Non-Functional Requirements

1. **User Experience**
   - Clear and easy-to-follow instructions
   - Convenient copy buttons
   - Smooth upload experience

2. **Validation**
   - Require receipt upload
   - Validate file format
   - Check file size limits

3. **Accessibility**
   - Screen reader friendly
   - Keyboard navigation
   - Clear error messages

### Component Structure

#### BankTransferOption.tsx Structure

| Section | Purpose |
|---------|---------|
| Instructions | How to complete payment |
| Bank Selection | Choose destination bank |
| Account Details | Bank account information |
| Amount Display | Amount to transfer |
| Receipt Upload | Upload payment proof |
| Verification Notice | Processing timeline |

#### Component Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| orderTotal | number | Yes | Amount to transfer |
| orderId | string | Yes | Order reference number |
| onReceiptUpload | function | Yes | Receipt uploaded callback |
| onValidationChange | function | Yes | Validation state callback |

#### Component State

| State | Type | Default | Description |
|-------|------|---------|-------------|
| selectedBank | string \| null | null | Selected bank ID |
| uploadedReceipt | File \| null | null | Uploaded receipt file |
| isValid | boolean | false | Whether receipt uploaded |
| uploadError | string \| null | null | Upload error message |

### Available Banks

#### Sri Lankan Banks (Supported)

| Bank | Account Type | Priority |
|------|-------------|----------|
| Commercial Bank | Current | 1 |
| Bank of Ceylon (BOC) | Savings | 2 |
| Sampath Bank | Current | 3 |

#### Bank Configurations

**Commercial Bank:**
- Most popular commercial bank in Sri Lanka
- Wide branch network
- Fast online banking

**Bank of Ceylon (BOC):**
- Government bank
- Largest bank in Sri Lanka
- Trusted and widely used

**Sampath Bank:**
- Leading private bank
- Modern banking services
- Good online banking platform

### Bank Account Details

#### Commercial Bank Account

| Field | Value |
|-------|-------|
| Bank Name | Commercial Bank of Ceylon PLC |
| Branch | Colombo - Fort Branch |
| Account Number | 1234567890 |
| Account Name | Lanka Commerce (Private) Limited |
| Account Type | Current Account |
| Swift Code | CCEYLKLX (for international) |

#### Bank of Ceylon (BOC) Account

| Field | Value |
|-------|-------|
| Bank Name | Bank of Ceylon |
| Branch | Colombo - Main Branch |
| Account Number | 0987654321 |
| Account Name | Lanka Commerce (Private) Limited |
| Account Type | Savings Account |
| Swift Code | BCEYLKLX (for international) |

#### Sampath Bank Account

| Field | Value |
|-------|-------|
| Bank Name | Sampath Bank PLC |
| Branch | Colombo - Duplication Road |
| Account Number | 5551234567 |
| Account Name | Lanka Commerce (Private) Limited |
| Account Type | Current Account |
| Swift Code | BSAMLKLX (for international) |

### UI Layout

#### Desktop Layout

```
┌──────────────────────────────────────────────────────┐
│ Bank Transfer Payment                                │
├──────────────────────────────────────────────────────┤
│                                                      │
│ Step 1: Select Bank                                  │
│                                                      │
│ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ │
│ │ Commercial   │ │ Bank of      │ │ Sampath      │ │
│ │ Bank         │ │ Ceylon       │ │ Bank         │ │
│ │ (Most Used) │ │              │ │              │ │
│ └──────────────┘ └──────────────┘ └──────────────┘ │
│                                                      │
│ Step 2: Transfer to This Account                     │
│                                                      │
│ ┌────────────────────────────────────────────────┐  │
│ │ Bank Name: Commercial Bank of Ceylon PLC      │  │
│ │ Branch: Colombo - Fort Branch                 │  │
│ │ Account Number: 1234567890          [Copy📋]  │  │
│ │ Account Name: Lanka Commerce (Pvt) Ltd        │  │
│ │ Account Type: Current Account                 │  │
│ └────────────────────────────────────────────────┘  │
│                                                      │
│ Amount to Transfer: ₨12,850                          │
│ Reference: ORD-2026-001                     [Copy📋] │
│                                                      │
│ Step 3: Upload Payment Receipt                       │
│                                                      │
│ ┌────────────────────────────────────────────────┐  │
│ │ [Receipt Upload Component]                    │  │
│ └────────────────────────────────────────────────┘  │
│                                                      │
│ ⚠️  Important: Your order will be held until we    │
│     verify your payment (usually within 24 hours)   │
│                                                      │
└──────────────────────────────────────────────────────┘
```

#### Mobile Layout

```
┌─────────────────────────────┐
│ Bank Transfer               │
├─────────────────────────────┤
│                             │
│ Step 1: Select Bank         │
│                             │
│ ┌─────────────────────────┐ │
│ │ Commercial Bank         │ │
│ │ (Most Used)             │ │
│ └─────────────────────────┘ │
│                             │
│ ┌─────────────────────────┐ │
│ │ Bank of Ceylon          │ │
│ └─────────────────────────┘ │
│                             │
│ ┌─────────────────────────┐ │
│ │ Sampath Bank            │ │
│ └─────────────────────────┘ │
│                             │
│ Step 2: Transfer Details    │
│                             │
│ Bank: Commercial Bank       │
│ Branch: Fort                │
│ Account: 1234567890 [Copy]  │
│ Name: Lanka Commerce Ltd    │
│                             │
│ Amount: ₨12,850             │
│ Ref: ORD-2026-001   [Copy]  │
│                             │
│ Step 3: Upload Receipt      │
│                             │
│ [Upload Component]          │
│                             │
│ ⚠️  Verification: 24h       │
│                             │
└─────────────────────────────┘
```

### Bank Selection UI

#### Bank Selection Cards

```
┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
│ 🏦 Commercial   │  │ 🏛️ Bank of     │  │ 🏦 Sampath     │
│    Bank         │  │    Ceylon       │  │    Bank         │
│                 │  │                 │  │                 │
│ Most Popular ⭐ │  │ Government Bank │  │ Private Bank    │
│                 │  │                 │  │                 │
│ [     Select  ] │  │ [     Select  ] │  │ [     Select  ] │
└─────────────────┘  └─────────────────┘  └─────────────────┘
```

#### Selected Bank Visual

```
┌─────────────────┐
│ ✓ Commercial    │
│    Bank         │
│                 │
│ Selected        │
│                 │
│ [   Selected  ] │
└─────────────────┘
```

#### Selection States

| State | Border | Background | Icon |
|-------|--------|------------|------|
| Unselected | Gray | White | Bank icon gray |
| Hovered | Blue light | Light blue | Bank icon gray |
| Selected | Blue solid | Light blue | Check mark + bank icon |

### Account Details Display Component

This is implemented in Task 59 (BankDetailsDisplay). Reference that component for:
- Account information layout
- Copy-to-clipboard functionality
- Responsive design
- Accessibility features

See [Task 59: Create Bank Details Display Component](#task-59-create-bank-details-display-component)

### Transfer Instructions

#### Step-by-Step Guide

**Step 1: Select Bank**
"Choose which bank you'll transfer from. Select the bank where you have an account for fastest processing."

**Step 2: Make Transfer**
"Transfer the exact amount (₨12,850) to the account details shown above. Use online banking, mobile app, or visit a branch."

**Step 3: Upload Receipt**
"Take a photo of your payment receipt or slip and upload it below. We need this to verify your payment."

#### Instructions Panel

```
┌────────────────────────────────────────┐
│ How to Complete Payment:               │
│                                        │
│ 1️⃣  Select your bank above            │
│                                        │
│ 2️⃣  Transfer ₨12,850 to the account  │
│     • Use online banking or mobile app│
│     • Or visit bank branch            │
│     • Include reference: ORD-2026-001 │
│                                        │
│ 3️⃣  Upload your payment slip          │
│     • Photo or screenshot             │
│     • PDF also accepted               │
│     • Must be clear and readable      │
│                                        │
│ 4️⃣  We'll verify within 24 hours      │
│     • Check email for confirmation    │
│     • Order ships after verification  │
└────────────────────────────────────────┘
```

### Amount and Reference Display

#### Amount Display

```
┌─────────────────────────────────────┐
│ Amount to Transfer                  │
│                                     │
│ ₨12,850.00                          │
│                                     │
│ (Include exact amount)              │
└─────────────────────────────────────┘
```

#### Reference Number

```
┌─────────────────────────────────────┐
│ Payment Reference                   │
│                                     │
│ ORD-2026-001            [Copy 📋]  │
│                                     │
│ Include this in transfer remarks    │
└─────────────────────────────────────┘
```

#### Copy Button Behavior

| Action | Result | Feedback |
|--------|--------|----------|
| Click copy (account) | Copy number to clipboard | "Copied!" tooltip |
| Click copy (reference) | Copy reference to clipboard | "Copied!" tooltip |
| Click copy (amount) | Copy amount to clipboard | "Copied!" tooltip |

### Receipt Upload Component

This is implemented in Task 60 (ReceiptUpload). Reference that component for:
- File upload functionality
- Preview display
- Validation rules
- Error handling

See [Task 60: Create Receipt Upload Component](#task-60-create-receipt-upload-component)

### Verification Notice

#### Notice Content

```
┌──────────────────────────────────────────────────┐
│ ⚠️  Payment Verification Required                │
│                                                  │
│ Your order will be held in "Pending Payment"    │
│ status until we verify your bank transfer.       │
│                                                  │
│ ⏱️  Verification usually takes:                  │
│    • 2-4 hours (during business hours)          │
│    • 24 hours (after hours / weekends)          │
│                                                  │
│ 📧  You'll receive email confirmation when       │
│     payment is verified and order is processed.  │
│                                                  │
│ ❓  Questions? Contact: payments@lankastore.lk  │
│                                                  │
└──────────────────────────────────────────────────┘
```

#### Notice Styling

| Property | Value |
|----------|-------|
| Background | Light yellow (#FEF9C3) |
| Border | 1px solid yellow (#EAB308) |
| Icon | Warning icon (⚠️) |
| Padding | 20px |
| Border radius | 8px |

### Validation Rules

#### Selection Validation

| Rule | Check | Error Message |
|------|-------|---------------|
| Bank selected | selectedBank !== null | "Please select a bank" |

#### Receipt Validation

| Rule | Check | Error Message |
|------|-------|---------------|
| Receipt uploaded | uploadedReceipt !== null | "Please upload payment receipt" |
| Valid file type | image/* or application/pdf | "Please upload an image or PDF" |
| File size | ≤ 5MB | "File size must be less than 5MB" |
| Readable file | File opens successfully | "Unable to read file, please try another" |

#### Complete Validation

Bank transfer option is valid when:
- Bank is selected
- Receipt is uploaded and valid
- Both conditions must be true

### State Management

#### Component States

| State | Condition | UI |
|-------|-----------|-----|
| Initial | Nothing selected | Show bank selection |
| Bank selected | Bank chosen | Show account details |
| Receipt uploading | File being uploaded | Show upload progress |
| Complete | Bank + receipt | Enable continue button |
| Error | Upload failed | Show error message |

### Error Handling

#### Error Types

| Error | Cause | Message |
|-------|-------|---------|
| no_bank_selected | No bank chosen | "Please select a bank to transfer to" |
| no_receipt | Receipt not uploaded | "Please upload your payment receipt" |
| invalid_file_type | Wrong file format | "Please upload an image or PDF file" |
| file_too_large | File > 5MB | "File is too large. Maximum size is 5MB" |
| upload_failed | Network/server error | "Upload failed. Please try again" |

### Accessibility

#### ARIA Labels

| Element | Label |
|---------|-------|
| Bank selection | "Select destination bank" |
| Bank card | "Select [Bank Name]" |
| Account details | "Bank account information" |
| Copy button | "Copy [field name] to clipboard" |
| Upload area | "Upload payment receipt" |

#### Keyboard Navigation

- Tab through bank selection cards
- Enter/Space to select bank
- Tab to account details
- Tab to copy buttons
- Tab to upload area
- All interactive elements accessible

#### Screen Reader

- Announce selected bank
- Announce copied confirmation
- Announce upload success/failure
- Read verification notice clearly

### Component File Structure

```
frontend/src/components/storefront/checkout/Payment/
├── BankTransferOption.tsx       (Main component)
├── BankTransferOption.module.css(Component styles)
├── BankTransferOption.test.tsx  (Component tests)
└── index.ts                     (Export)
```

### Success Criteria

- [ ] Three Sri Lankan banks displayed for selection
- [ ] Bank selection works with visual feedback
- [ ] Selected bank's account details display correctly
- [ ] All account information accurate and complete
- [ ] Copy-to-clipboard works for account number and reference
- [ ] Amount and reference displayed prominently
- [ ] Transfer instructions clear and comprehensive
- [ ] Receipt upload component integrated
- [ ] Verification notice displayed clearly
- [ ] Validation prevents continue without receipt
- [ ] Error messages helpful and specific
- [ ] Responsive layout on all screen sizes
- [ ] Accessible to keyboard and screen readers
- [ ] Professional and trustworthy appearance

---

## Task 59: Create Bank Details Display Component

**Complexity:** Low  
**Dependencies:** Task 58 (Bank transfer option)  
**Priority:** Medium

### Objective

Create a reusable component that displays bank account details in a clear, organized format with copy-to-clipboard functionality for easy use. This component is used within the bank transfer payment option to show the destination account information.

### Requirements

#### Functional Requirements

1. **Information Display**
   - Show all bank account fields
   - Clear field labels and values
   - Organized layout
   - Responsive design

2. **Copy Functionality**
   - Copy button for account number
   - Copy button for other relevant fields
   - Visual feedback on copy success
   - Tooltip showing "Copied!"

3. **Formatting**
   - Format account numbers (spacing)
   - Format amounts with currency
   - Proper capitalization
   - Consistent styling

4. **Configurability**
   - Accept bank details as props
   - Support different bank formats
   - Optional fields display
   - Customizable styling

#### Non-Functional Requirements

1. **User Experience**
   - Quick and easy to read
   - Copy buttons prominent
   - Success feedback clear

2. **Accessibility**
   - Screen reader friendly
   - Keyboard accessible copy buttons
   - Clear focus indicators

### Component Structure

#### BankDetailsDisplay.tsx Structure

| Section | Purpose |
|---------|---------|
| Details Container | Overall wrapper |
| Field Rows | Individual field displays |
| Copy Buttons | Clipboard functionality |
| Success Feedback | Copy confirmation |

#### Component Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| bankDetails | BankDetails | Yes | Account information |
| showCopyButtons | boolean | No | Show/hide copy buttons |
| compact | boolean | No | Compact display mode |
| className | string | No | Additional CSS classes |

#### BankDetails Interface

```typescript
interface BankDetails {
  bankName: string;
  branchName: string;
  accountNumber: string;
  accountName: string;
  accountType: string;
  swiftCode?: string;
  routingNumber?: string;
}
```

### UI Layout

#### Desktop Layout

```
┌─────────────────────────────────────────────────┐
│ Bank Account Details                            │
├─────────────────────────────────────────────────┤
│                                                 │
│ Bank Name:                                      │
│ Commercial Bank of Ceylon PLC                   │
│                                                 │
│ Branch:                                         │
│ Colombo - Fort Branch                           │
│                                                 │
│ Account Number:                                 │
│ 1234 5678 90                         [Copy 📋] │
│                                                 │
│ Account Holder:                                 │
│ Lanka Commerce (Private) Limited                │
│                                                 │
│ Account Type:                                   │
│ Current Account                                 │
│                                                 │
│ Swift Code:                                     │
│ CCEYLKLX                             [Copy 📋] │
│                                                 │
└─────────────────────────────────────────────────┘
```

#### Mobile Layout

```
┌───────────────────────────┐
│ Account Details           │
├───────────────────────────┤
│                           │
│ Bank:                     │
│ Commercial Bank           │
│                           │
│ Branch:                   │
│ Colombo - Fort            │
│                           │
│ Account:                  │
│ 1234 5678 90    [Copy 📋]│
│                           │
│ Holder:                   │
│ Lanka Commerce Ltd        │
│                           │
│ Type:                     │
│ Current Account           │
│                           │
│ Swift:                    │
│ CCEYLKLX        [Copy 📋]│
│                           │
└───────────────────────────┘
```

#### Compact Layout

```
┌─────────────────────────────────────────┐
│ Commercial Bank | Colombo - Fort        │
│ Account: 1234 5678 90        [Copy 📋] │
│ Holder: Lanka Commerce (Pvt) Ltd        │
└─────────────────────────────────────────┘
```

### Field Display

#### Field Layout

Each field displayed as:
- Label (bold, smaller font)
- Value (normal weight, larger font)
- Copy button (if applicable)

#### Field Formatting

| Field | Format | Example |
|-------|--------|---------|
| Bank Name | Full name | Commercial Bank of Ceylon PLC |
| Branch | City - Branch Name | Colombo - Fort Branch |
| Account Number | Spaced groups | 1234 5678 90 |
| Account Holder | Full business name | Lanka Commerce (Pvt) Ltd |
| Account Type | Type name | Current Account |
| Swift Code | Uppercase | CCEYLKLX |

### Copy-to-Clipboard Functionality

#### Copy Button Design

| Property | Value |
|----------|-------|
| Icon | Clipboard icon (📋) |
| Size | 32px × 32px |
| Background | Light gray |
| Hover Background | Blue |
| Border | 1px solid gray |
| Border radius | 4px |
| Position | Right aligned |

#### Copy States

| State | Icon | Background | Tooltip |
|-------|------|------------|---------|
| Default | 📋 Clipboard | Light gray | "Copy" |
| Hover | 📋 Clipboard | Blue | "Click to copy" |
| Active | ✓ Check | Green | "Copied!" |
| After Copy | ✓ Check (2s) | Green | "Copied!" |

#### Copy Button Behavior

1. User clicks copy button
2. Button icon changes to checkmark
3. Button background turns green
4. Tooltip shows "Copied!"
5. Text copied to clipboard
6. After 2 seconds, button returns to normal

#### Copy Implementation

```typescript
const handleCopy = async (text: string, fieldName: string) => {
  try {
    await navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  } catch (error) {
    showError('Failed to copy to clipboard');
  }
};
```

### Account Number Formatting

#### Formatting Rules

Sri Lankan bank account numbers:
- Usually 10 digits
- Format with spaces for readability
- Group as: XXXX XXXX XX

#### Formatting Examples

| Raw | Formatted |
|-----|-----------|
| 1234567890 | 1234 5678 90 |
| 0987654321 | 0987 6543 21 |
| 5551234567 | 5551 2345 67 |

#### Implementation

```typescript
const formatAccountNumber = (account: string): string => {
  // Remove spaces
  const cleaned = account.replace(/\s/g, '');
  
  // Format: XXXX XXXX XX
  return cleaned.replace(/(\d{4})(\d{4})(\d{2})/, '$1 $2 $3');
};
```

### Styling

#### Container Styling

| Property | Value |
|----------|-------|
| Background | White |
| Border | 1px solid light gray |
| Border radius | 8px |
| Padding | 24px (desktop), 16px (mobile) |
| Box shadow | Subtle shadow |

#### Field Styling

**Label:**
- Font size: 14px
- Font weight: 600 (semi-bold)
- Color: Gray (#6B7280)
- Margin bottom: 4px

**Value:**
- Font size: 16px
- Font weight: 400 (normal)
- Color: Dark gray (#1F2937)
- Margin bottom: 16px
- Line height: 1.5

#### Responsive Adjustments

| Breakpoint | Padding | Font Size (Value) | Spacing |
|------------|---------|-------------------|---------|
| Mobile (<640px) | 16px | 14px | 12px |
| Tablet (640-1024px) | 20px | 15px | 14px |
| Desktop (≥1024px) | 24px | 16px | 16px |

### Optional Fields

#### Conditional Display

Only show fields if provided:

| Field | Required | Display If |
|-------|----------|-----------|
| Bank Name | Yes | Always |
| Branch | Yes | Always |
| Account Number | Yes | Always |
| Account Name | Yes | Always |
| Account Type | Yes | Always |
| Swift Code | No | swiftCode !== undefined |
| Routing Number | No | routingNumber !== undefined |

#### International Transfers

If Swift Code provided:
- Show "For International Transfers:" section
- Display Swift Code prominently
- Add note about additional fees

### Accessibility

#### Semantic HTML

```html
<div class="bank-details" role="region" aria-label="Bank account details">
  <dl>
    <dt>Bank Name:</dt>
    <dd>Commercial Bank of Ceylon PLC</dd>
    
    <dt>Account Number:</dt>
    <dd>
      1234 5678 90
      <button aria-label="Copy account number to clipboard">
        Copy
      </button>
    </dd>
  </dl>
</div>
```

#### ARIA Labels

| Element | Label |
|---------|-------|
| Container | "Bank account details" |
| Copy button | "Copy [field name] to clipboard" |
| Copied state | "Copied [field name] to clipboard" |

#### Keyboard Navigation

- Copy buttons focusable with Tab
- Enter/Space to activate copy
- Clear focus indicators
- Logical tab order

#### Screen Reader

- Use definition list (<dl>) for field pairs
- Announce copy success
- Read all account details clearly

### Error Handling

#### Missing Required Fields

| Field Missing | Behavior |
|---------------|----------|
| Bank Name | Show placeholder "Bank name not provided" |
| Account Number | Show error "Account number required" |
| Multiple fields | Show general error "Incomplete bank details" |

### Component Variants

#### Standard Variant

- Full details display
- All fields shown
- Copy buttons on right
- Maximum detail

#### Compact Variant

- Condensed layout
- Essential fields only
- Smaller font sizes
- Minimal spacing

#### Inline Variant

- Horizontal layout
- Fields side-by-side
- Copy buttons inline
- For space-constrained areas

### Component File Structure

```
frontend/src/components/storefront/checkout/Payment/
├── BankDetailsDisplay.tsx       (Main component)
├── BankDetailsDisplay.module.css(Component styles)
├── BankDetailsDisplay.test.tsx  (Component tests)
└── index.ts                     (Export)
```

### Usage Example (Reference Only)

```typescript
// Example usage in BankTransferOption component
<BankDetailsDisplay
  bankDetails={{
    bankName: "Commercial Bank of Ceylon PLC",
    branchName: "Colombo - Fort Branch",
    accountNumber: "1234567890",
    accountName: "Lanka Commerce (Private) Limited",
    accountType: "Current Account",
    swiftCode: "CCEYLKLX"
  }}
  showCopyButtons={true}
  compact={false}
/>
```

### Success Criteria

- [ ] All bank account fields display clearly
- [ ] Account number formatted with spaces
- [ ] Copy buttons work for all copyable fields
- [ ] Copy success feedback displays (checkmark + tooltip)
- [ ] Copied text accurately matches field value
- [ ] Optional fields conditionally displayed
- [ ] Responsive layout works on all screen sizes
- [ ] Compact mode displays condensed information
- [ ] Accessible to keyboard and screen readers
- [ ] Clear focus indicators on interactive elements
- [ ] Professional and trustworthy appearance
- [ ] Component reusable across application

---

## Task 60: Create Receipt Upload Component

**Complexity:** Medium  
**Dependencies:** Task 58 (Bank transfer option)  
**Priority:** Medium

### Objective

Create a file upload component specifically for bank transfer payment receipts/slips. Support image and PDF uploads, provide preview functionality, validate file types and sizes, show upload progress, and handle errors gracefully.

### Requirements

#### Functional Requirements

1. **File Upload**
   - Click to upload interaction
   - Drag-and-drop support
   - Browse file dialog
   - Single file upload

2. **File Type Support**
   - Images: JPG, JPEG, PNG, GIF, WebP
   - Documents: PDF
   - Validate file type on selection
   - Reject unsupported formats

3. **File Size Validation**
   - Maximum file size: 5MB
   - Check size before upload
   - Clear error if exceeded
   - Suggest compression if too large

4. **Preview Display**
   - Show thumbnail for images
   - Show PDF icon for PDFs
   - Display file name
   - Show file size
   - Remove/replace option

5. **Upload Progress**
   - Show upload progress bar
   - Display percentage
   - Cancellation option (optional)
   - Success confirmation

6. **Validation**
   - Require file for bank transfer
   - Validate file integrity
   - Check file is readable
   - Emit validation state

#### Non-Functional Requirements

1. **User Experience**
   - Clear instructions
   - Visual feedback
   - Smooth interactions
   - Error recovery

2. **Performance**
   - Efficient file reading
   - Optimized preview generation
   - Fast validation

3. **Accessibility**
   - Screen reader support
   - Keyboard navigation
   - Clear error messages

### Component Structure

#### ReceiptUpload.tsx Structure

| Section | Purpose |
|---------|---------|
| Upload Area | Click/drop zone |
| File Input | Hidden file input |
| Preview | Uploaded file display |
| Progress | Upload progress bar |
| Validation | Error messages |
| Instructions | User guidance |

#### Component Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| onFileUpload | function | Yes | File uploaded callback |
| onValidationChange | function | Yes | Validation state callback |
| maxFileSize | number | No | Max size in bytes (default 5MB) |
| accept | string | No | Accepted file types |

#### Component State

| State | Type | Default | Description |
|-------|------|---------|-------------|
| selectedFile | File \| null | null | Selected file object |
| previewUrl | string \| null | null | Preview image URL |
| uploading | boolean | false | Upload in progress |
| uploadProgress | number | 0 | Upload percentage |
| error | string \| null | null | Error message |
| isValid | boolean | false | Validation state |

### UI Layout

#### Upload Area (No File)

```
┌─────────────────────────────────────────────────┐
│                                                 │
│             📁 Upload Payment Receipt           │
│                                                 │
│         Click to browse or drag & drop          │
│                                                 │
│         Accepted: JPG, PNG, PDF                 │
│         Maximum size: 5MB                       │
│                                                 │
│         [  Browse Files  ]                      │
│                                                 │
└─────────────────────────────────────────────────┘
```

#### Upload Area (During Upload)

```
┌─────────────────────────────────────────────────┐
│                                                 │
│         ⏳ Uploading receipt...                 │
│                                                 │
│         ▓▓▓▓▓▓▓▓▓▓▓▓░░░░░░░  68%              │
│                                                 │
│         payment_slip.jpg (1.2 MB)               │
│                                                 │
└─────────────────────────────────────────────────┘
```

#### Upload Area (File Uploaded)

```
┌─────────────────────────────────────────────────┐
│ ✓ Receipt Uploaded                              │
├─────────────────────────────────────────────────┤
│                                                 │
│  ┌─────────────┐                                │
│  │             │  payment_slip.jpg               │
│  │   [Image]   │  1.2 MB                         │
│  │   Preview   │                                 │
│  │             │  [Change File]  [Remove]        │
│  └─────────────┘                                │
│                                                 │
└─────────────────────────────────────────────────┘
```

#### Mobile Layout

```
┌───────────────────────────┐
│ Upload Receipt            │
├───────────────────────────┤
│                           │
│      📁                   │
│                           │
│  Tap to upload            │
│                           │
│  JPG, PNG, PDF            │
│  Max 5MB                  │
│                           │
│  [Browse]                 │
│                           │
└───────────────────────────┘
```

### Upload Area Design

#### Empty State

| Element | Description |
|---------|-------------|
| Icon | 📁 Large folder/upload icon |
| Title | "Upload Payment Receipt" |
| Instructions | "Click to browse or drag & drop" |
| Accepted Types | "JPG, PNG, PDF" |
| Size Limit | "Maximum size: 5MB" |
| Button | "Browse Files" button |

#### Empty State Styling

| Property | Value |
|----------|-------|
| Border | 2px dashed gray |
| Border radius | 8px |
| Padding | 40px (desktop), 24px (mobile) |
| Background | Light gray (#F9FAFB) |
| Min height | 200px |
| Cursor | pointer |

#### Hover State

| Property | Change |
|----------|--------|
| Border color | Blue |
| Background | Light blue (#EBF5FF) |
| Cursor | pointer |

#### Drag Over State

| Property | Change |
|----------|--------|
| Border color | Blue solid |
| Background | Blue tint |
| Scale | Slightly larger (1.02) |

### File Type Validation

#### Accepted File Types

| Type | Extensions | MIME Types |
|------|------------|------------|
| Images | .jpg, .jpeg, .png, .gif, .webp | image/jpeg, image/png, image/gif, image/webp |
| PDF | .pdf | application/pdf |

#### Validation Rules

```typescript
const ACCEPTED_TYPES = {
  'image/jpeg': ['.jpg', '.jpeg'],
  'image/png': ['.png'],
  'image/gif': ['.gif'],
  'image/webp': ['.webp'],
  'application/pdf': ['.pdf']
};

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
```

#### Type Validation

1. Check file extension
2. Check MIME type
3. Verify file header (magic numbers) for security
4. Reject if doesn't match accepted types

### File Size Validation

#### Size Limits

| Limit | Value | Reason |
|-------|-------|--------|
| Maximum | 5MB | Reasonable size for receipts |
| Recommended | < 2MB | Faster upload |
| Minimum | None | No minimum |

#### Size Validation

```typescript
const validateFileSize = (file: File): boolean => {
  if (file.size > MAX_FILE_SIZE) {
    setError(`File too large. Maximum size is ${MAX_FILE_SIZE / 1024 / 1024}MB`);
    return false;
  }
  return true;
};
```

#### Size Display

Format file size for display:
- < 1KB: "X bytes"
- < 1MB: "X.X KB"
- ≥ 1MB: "X.X MB"

Example: 1,234,567 bytes → "1.2 MB"

### Preview Generation

#### Image Preview

1. Create FileReader instance
2. Read file as DataURL
3. Set as image src
4. Display thumbnail
5. Handle load errors

#### Preview Dimensions

| Layout | Dimensions | Aspect Ratio |
|--------|------------|--------------|
| Desktop | 150px × 150px | Maintain aspect |
| Mobile | 100px × 100px | Maintain aspect |
| Thumbnail | Fit within bounds | Crop if needed |

#### PDF Preview

For PDF files:
- Show PDF icon (no preview generation)
- Display file name
- Show file size
- Indicate it's a PDF document

### Upload Progress

#### Progress Bar Design

```
┌─────────────────────────────────────────┐
│ Uploading...                            │
│                                         │
│ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓░░░░░░░░  68%           │
│                                         │
│ payment_slip.jpg (1.2 MB)               │
└─────────────────────────────────────────┘
```

#### Progress Bar Styling

| Property | Value |
|----------|-------|
| Height | 8px |
| Background | Light gray |
| Fill color | Blue |
| Border radius | 4px |
| Transition | Smooth width transition |

#### Progress States

| Progress | State | Message |
|----------|-------|---------|
| 0% | Starting | "Preparing upload..." |
| 1-99% | Uploading | "Uploading... X%" |
| 100% | Processing | "Processing..." |
| Complete | Done | "Upload complete ✓" |

### Uploaded File Display

#### File Information

Display when file uploaded:
- File preview (image) or icon (PDF)
- File name
- File size
- Upload success indicator
- Change/Remove buttons

#### Preview Display

**Image Preview:**
```
┌─────────────────────────────────────┐
│ ✓ Receipt Uploaded                  │
│                                     │
│ ┌───────────┐                       │
│ │           │ payment_slip.jpg      │
│ │   Photo   │ 1.2 MB                │
│ │  Preview  │                       │
│ │           │ [Change]  [Remove]    │
│ └───────────┘                       │
└─────────────────────────────────────┘
```

**PDF Preview:**
```
┌─────────────────────────────────────┐
│ ✓ Receipt Uploaded                  │
│                                     │
│ 📄 bank_receipt.pdf                 │
│    2.4 MB                           │
│                                     │
│ [Change File]  [Remove]             │
└─────────────────────────────────────┘
```

#### Action Buttons

**Change File:**
- Opens file browser again
- Replaces current file
- Re-validates new file

**Remove:**
- Clears uploaded file
- Returns to empty state
- Updates validation state

### Drag and Drop

#### Drop Zone Behavior

1. **Drag Enter:**
   - Highlight drop zone
   - Change border to blue
   - Show drop indicator

2. **Drag Over:**
   - Prevent default behavior
   - Maintain highlighted state

3. **Drag Leave:**
   - Remove highlighting
   - Return to normal state

4. **Drop:**
   - Get dropped files
   - Validate file
   - Process upload

#### Multiple Files

If user drops multiple files:
- Accept only the first file
- Show message: "Only one file accepted, using first file"

### Error Handling

#### Error Types

| Error | Condition | Message |
|-------|-----------|---------|
| Invalid type | Wrong file format | "Please upload a JPG, PNG, or PDF file" |
| Too large | File > 5MB | "File too large. Maximum size is 5MB. Try compressing the image." |
| Read error | Can't read file | "Unable to read file. Please try another file." |
| Upload failed | Network/server error | "Upload failed. Please check your connection and try again." |
| No file | User selects nothing | No error (return to empty state) |

#### Error Display

```
┌─────────────────────────────────────┐
│ ⚠️ Upload Error                     │
│                                     │
│ File too large. Maximum size is 5MB.│
│ Try compressing the image.          │
│                                     │
│ [Try Again]                         │
└─────────────────────────────────────┘
```

#### Error Styling

| Property | Value |
|----------|-------|
| Background | Light red (#FEE2E2) |
| Border | 1px solid red (#EF4444) |
| Icon | ⚠️ Warning icon |
| Text color | Dark red (#991B1B) |
| Padding | 16px |

### Validation State

#### Validation Rules

| Rule | Check | Valid |
|------|-------|-------|
| File selected | file !== null | Yes |
| Valid type | Type in accepted list | Yes |
| Valid size | Size <= 5MB | Yes |
| Readable | File reads successfully | Yes |

#### Validation Events

Emit validation state to parent:
- When file selected and validated
- When file removed
- When upload completes
- When errors occur

### Accessibility

#### ARIA Labels

| Element | Label |
|---------|-------|
| Upload area | "Upload payment receipt, click to browse or drag and drop" |
| File input | "Choose receipt file" |
| Remove button | "Remove uploaded receipt" |
| Change button | "Change receipt file" |
| Progress bar | "Upload progress: X percent" |

#### Keyboard Navigation

- Upload area focusable
- Enter/Space to open file browser
- Tab to action buttons
- Enter/Space to activate buttons

#### Screen Reader

- Announce upload area instructions
- Announce file selection
- Announce upload progress
- Announce upload success
- Announce errors clearly

### Component File Structure

```
frontend/src/components/storefront/checkout/Payment/
├── ReceiptUpload.tsx            (Main component)
├── ReceiptUpload.module.css     (Component styles)
├── ReceiptUpload.test.tsx       (Component tests)
└── index.ts                     (Export)
```

### Success Criteria

- [ ] Upload area displays with clear instructions
- [ ] Click to browse opens file dialog
- [ ] Drag and drop functionality works
- [ ] File type validation rejects invalid formats
- [ ] File size validation enforces 5MB limit
- [ ] Upload progress displays with percentage
- [ ] Image preview generates and displays
- [ ] PDF files show PDF icon (no preview)
- [ ] File information displays (name, size)
- [ ] Change file button replaces current file
- [ ] Remove button clears file and returns to empty state
- [ ] Errors display with helpful messages
- [ ] Validation state updates correctly
- [ ] Responsive layout on all screen sizes
- [ ] Accessible to keyboard and screen readers
- [ ] Professional and user-friendly appearance

---

## Testing Strategy

### Component Testing

#### Payment Step Component (Task 53)

**Test Cases:**
- Renders payment step with correct step number
- Displays order summary in sidebar (desktop)
- Displays order summary below methods (mobile)
- Back button navigates to shipping step
- Continue button disabled when no method selected
- Continue button enabled when valid method selected
- Integrates with checkout context correctly
- Responsive layout changes at breakpoints
- Keyboard navigation works
- Screen reader announces step correctly

#### Payment Methods Section (Task 54)

**Test Cases:**
- All payment methods display in correct order
- Methods filtered based on order total
- Only one method selected at a time
- Selected method expands automatically
- Previous method collapses when new selected
- Disabled methods show unavailable state
- Method selection emits to parent
- Keyboard navigation between methods works
- Radio group semantics correct
- Screen reader announces selection changes

#### Payment Method Card (Task 55)

**Test Cases:**
- Card displays method info correctly
- Popular badge shows for popular methods
- Selected state visually distinct
- Card expands when selected
- Card collapses when deselected
- Disabled state displays with reason
- Click on header selects method
- Copy buttons work (account details)
- Keyboard Enter/Space selects card
- Screen reader announces card state
- Responsive layout adjusts correctly

#### PayHere Option (Task 56)

**Test Cases:**
- PayHere logo displays correctly
- Supported payment methods listed
- Security badges prominent
- Payment amount displays correctly
- Payment button triggers stub flow
- Loading state shows during processing
- Success state shows transaction ID (stub)
- Error state displays error message
- Retry button available after error
- Instructions clear and helpful

#### Card Payment Option (Task 57)

**Test Cases:**
- Card brand icons display
- Implementation notice displays prominently
- Placeholder form shows correct fields
- All fields properly disabled
- Security indicators displayed
- PayHere redirect button works
- Redirects to PayHere method selection
- Responsive layout on mobile
- Maintains professional appearance

#### Bank Transfer Option (Task 58)

**Test Cases:**
- Three banks display for selection
- Bank selection updates state
- Selected bank account details display
- Account number copy works
- Reference number copy works
- Receipt upload integrates correctly
- Validation requires bank + receipt
- Transfer instructions clear
- Verification notice displays
- Responsive layout on mobile

#### Bank Details Display (Task 59)

**Test Cases:**
- All bank details display correctly
- Account number formatted with spaces
- Copy button copies account number
- Copy button copies swift code
- Copy success feedback shows (checkmark)
- Copied tooltip displays
- Optional fields conditionally displayed
- Responsive layout adjusts
- Keyboard accessible
- Screen reader reads details clearly

#### Receipt Upload (Task 60)

**Test Cases:**
- Upload area displays instructions
- Click opens file browser
- Drag and drop accepts files
- Valid image types accepted
- PDF files accepted
- Invalid types rejected with error
- Files over 5MB rejected with error
- Image preview generates correctly
- PDF shows icon (no preview)
- Upload progress displays
- File info displays (name, size)
- Change button replaces file
- Remove button clears file
- Validation state updates correctly

### Integration Testing

#### Payment Flow Integration

1. **Full Payment Selection Flow:**
   - Navigate to payment step
   - Select PayHere method
   - Verify method expands
   - Switch to bank transfer
   - Verify PayHere collapses, bank transfer expands
   - Select bank
   - Upload receipt
   - Verify continue button enables
   - Click continue
   - Verify payment data passed to next step

2. **Validation Integration:**
   - Select bank transfer without receipt
   - Attempt to continue
   - Verify error displays
   - Upload receipt
   - Verify error clears
   - Verify continue button enables

3. **Responsive Integration:**
   - Test payment step on mobile
   - Verify order summary moves below
   - Test method selection on touch
   - Verify file upload on mobile
   - Test copy buttons on touch

### Accessibility Testing

#### Keyboard Navigation

- Tab through all payment methods
- Select method with Enter/Space
- Tab through method fields
- Activate copy buttons
- Navigate back/continue buttons
- Test focus indicators visible

#### Screen Reader Testing

- Payment step announcement
- Method selection announcement
- Bank selection announcement
- Copy success announcement
- Upload success announcement
- Error announcements

### Performance Testing

- Payment step renders in < 100ms
- Method switching smooth (< 300ms)
- File upload responsive
- Image preview generation fast
- Copy operations instant
- No layout shift during interactions

---

## Quality Checklist

### Code Quality

- [ ] All components use TypeScript with proper types
- [ ] Components follow React best practices
- [ ] State management efficient and minimal
- [ ] Props properly validated
- [ ] No prop drilling (use context where appropriate)
- [ ] Components properly memoized where beneficial
- [ ] Event handlers properly named and bound
- [ ] No memory leaks (cleanup in useEffect)

### User Experience

- [ ] All interactions provide immediate feedback
- [ ] Loading states display for async operations
- [ ] Error messages helpful and actionable
- [ ] Success confirmations clear
- [ ] Copy operations show success feedback
- [ ] File uploads show progress
- [ ] Navigation intuitive and logical
- [ ] Instructions clear and concise

### Visual Design

- [ ] Consistent spacing and padding
- [ ] Proper color contrast for accessibility
- [ ] Icons clear and recognizable
- [ ] Typography hierarchy clear
- [ ] Buttons visually distinct by priority
- [ ] Hover states provide feedback
- [ ] Focus states clearly visible
- [ ] Animations smooth and purposeful

### Responsive Design

- [ ] Mobile layout tested (<640px)
- [ ] Tablet layout tested (640-1024px)
- [ ] Desktop layout tested (≥1024px)
- [ ] Touch targets minimum 44px
- [ ] Text readable on all screen sizes
- [ ] Images scale appropriately
- [ ] No horizontal scrolling
- [ ] Breakpoints transition smoothly

### Accessibility

- [ ] Semantic HTML elements used
- [ ] ARIA labels on interactive elements
- [ ] Heading hierarchy logical
- [ ] Color not sole indicator of state
- [ ] Focus visible on all interactive elements
- [ ] Keyboard navigation complete
- [ ] Screen reader tested
- [ ] Error messages associated with fields

### Security

- [ ] File upload validates types
- [ ] File upload validates sizes
- [ ] No sensitive data in console logs
- [ ] Payment amounts validated
- [ ] User input sanitized
- [ ] Clipboard operations secure

### Performance

- [ ] Components render efficiently
- [ ] Images optimized
- [ ] File previews generated efficiently
- [ ] No unnecessary re-renders
- [ ] Lazy loading where appropriate
- [ ] Bundle size reasonable

### Browser Compatibility

- [ ] Chrome/Edge tested
- [ ] Firefox tested
- [ ] Safari tested
- [ ] Mobile browsers tested
- [ ] Clipboard API fallbacks
- [ ] File API fallbacks

### Documentation

- [ ] Component props documented
- [ ] Complex logic commented
- [ ] Sri Lanka context explained
- [ ] Phase-09 integration notes clear
- [ ] Usage examples provided
- [ ] Accessibility features documented

---

## Summary

This document covers Tasks 53-60, establishing the payment step foundation with a comprehensive payment methods section. The implementation includes:

**Core Components (Tasks 53-55):**
- Payment page component with step integration
- Payment methods section with selection management
- Reusable payment method card component

**Payment Options (Tasks 56-58):**
- PayHere gateway option (stub for Phase-09)
- Card payment option (placeholder for Phase-09)
- Bank transfer option with Sri Lankan bank support

**Supporting Components (Tasks 59-60):**
- Bank details display with copy functionality
- Receipt upload with preview and validation

All components are designed specifically for Sri Lankan e-commerce with local payment methods, proper currency formatting (Sri Lankan Rupees), and culturally appropriate payment flows. The foundation is ready for full payment gateway integration in Phase-09.

**Navigation:**
- **↑ Return to:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **→ Continue to:** [02_Tasks-61-68_COD-BNPL-Verify.md](02_Tasks-61-68_COD-BNPL-Verify.md)

---

*Document complete. Ready for implementation of Tasks 53-60.*
