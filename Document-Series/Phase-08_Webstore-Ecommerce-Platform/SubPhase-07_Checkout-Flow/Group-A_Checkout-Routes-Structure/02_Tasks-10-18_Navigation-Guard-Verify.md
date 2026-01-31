# Tasks 10-18: Navigation, Guards, and Structure Verification

> **Phase:** 08 - Webstore & E-Commerce Platform  
> **SubPhase:** 07 - Checkout Flow  
> **Group:** A - Checkout Routes & Structure  
> **Document:** 02 of 02  
> **Tasks Covered:** 10, 11, 12, 13, 14, 15, 16, 17, 18

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-01-09_Routes-Store.md](01_Tasks-01-09_Routes-Store.md)

---

## Document Overview

This document covers the creation of checkout navigation components, type definitions, progress indicators, guard logic, and final verification. It establishes the navigation flow between checkout steps, protects against invalid checkout states, and ensures a complete, functional checkout structure.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 10 | Create Checkout Types | Low | 20 min |
| 11 | Create Step Progress Indicator | Medium | 45 min |
| 12 | Create Step Navigation Logic | Medium | 40 min |
| 13 | Create Back Button | Low | 20 min |
| 14 | Create Continue Button | Low | 20 min |
| 15 | Create Checkout Guard | Medium | 35 min |
| 16 | Create Guest Checkout Check | Low | 25 min |
| 17 | Create Checkout Header | Low | 30 min |
| 18 | Verify Checkout Structure | Low | 25 min |

---

## Task 10: Create Checkout Types

### Overview
Define TypeScript types and interfaces for the checkout flow. These types ensure type safety across the checkout store, components, and navigation logic. They define the structure for contact information, shipping details, payment data, order information, and checkout step management.

### Dependencies
- Task 09: Create Checkout Store (from Document 01)
- TypeScript configuration is complete
- Zustand store structure is defined

### Instructions

1. **Create types file**
   - Navigate to `frontend/types/storefront/` directory
   - Create new file named `checkout.types.ts`
   - This file will house all checkout-related types

2. **Define checkout step enum**
   - Create `CheckoutStep` enum with values 1-5
   - Each value corresponds to a checkout step
   - Use for type-safe step navigation and validation

3. **Define contact information type**
   - Create `ContactInfo` interface
   - Include email, phone, firstName, lastName fields
   - All fields should be strings
   - Mark optional fields appropriately

4. **Define shipping address type**
   - Create `ShippingAddress` interface
   - Include address lines, city, province, postal code, country
   - All fields should be strings
   - Consider validation requirements

5. **Define shipping method type**
   - Create `ShippingMethod` interface
   - Include id, name, description, price, estimated delivery
   - Support multiple shipping carriers

6. **Define payment method type**
   - Create `PaymentMethod` enum or type
   - Include options: credit card, debit card, cash on delivery, bank transfer
   - Consider future payment methods (digital wallets)

7. **Define payment details type**
   - Create `PaymentDetails` interface
   - Include method, card details (if applicable), billing address
   - Keep sensitive data handling in mind

8. **Define order information type**
   - Create `OrderInfo` interface
   - Include order ID, status, total, items count
   - Support order tracking and confirmation

9. **Define checkout store state type**
   - Create `CheckoutState` interface
   - Include all sections: contact, shipping, payment, order, currentStep
   - Add methods for updating each section

10. **Add step validation type**
    - Create `StepValidation` type
    - Define which fields are required for each step
    - Use for navigation guard logic

### Type Definitions Overview

| Type/Interface | Purpose | Key Fields |
|----------------|---------|------------|
| CheckoutStep | Step enumeration | 1-5 (Information to Confirmation) |
| ContactInfo | Customer contact data | email, phone, firstName, lastName |
| ShippingAddress | Delivery address | address1, address2, city, province, postalCode, country |
| ShippingMethod | Delivery method | id, name, description, price, estimatedDays |
| PaymentMethod | Payment type | creditCard, debitCard, cod, bankTransfer |
| PaymentDetails | Payment information | method, cardInfo, billingAddress |
| OrderInfo | Order summary | id, status, total, itemsCount, createdAt |
| CheckoutState | Store state | contact, shipping, payment, order, currentStep |
| StepValidation | Validation rules | requiredFields, validationFn |

### Checkout Step Enumeration

| Step Number | Step Name | Enum Value | Route |
|-------------|-----------|------------|-------|
| 1 | Information | `CheckoutStep.INFORMATION` | /checkout/information |
| 2 | Shipping | `CheckoutStep.SHIPPING` | /checkout/shipping |
| 3 | Payment | `CheckoutStep.PAYMENT` | /checkout/payment |
| 4 | Review | `CheckoutStep.REVIEW` | /checkout/review |
| 5 | Confirmation | `CheckoutStep.CONFIRMATION` | /checkout/confirmation |

### Contact Information Structure

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| email | string | Yes | Valid email format |
| phone | string | Yes | Valid phone number |
| firstName | string | Yes | Min 2 characters |
| lastName | string | Yes | Min 2 characters |

### Shipping Address Structure

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| address1 | string | Yes | Street address line 1 |
| address2 | string | No | Apartment, suite, etc. |
| city | string | Yes | City name |
| province | string | Yes | Province/state |
| postalCode | string | Yes | Postal/zip code |
| country | string | Yes | Country (default: Sri Lanka) |

### Shipping Method Structure

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | string | Yes | Unique method identifier |
| name | string | Yes | Display name |
| description | string | No | Method description |
| price | number | Yes | Shipping cost |
| estimatedDays | number | Yes | Delivery time estimate |
| carrier | string | Yes | Shipping carrier name |

### Payment Method Options

| Method | Value | Description | Availability |
|--------|-------|-------------|--------------|
| Credit Card | `creditCard` | Visa, Mastercard | All customers |
| Debit Card | `debitCard` | Local debit cards | All customers |
| Cash on Delivery | `cod` | Pay at delivery | Selected areas |
| Bank Transfer | `bankTransfer` | Direct bank transfer | All customers |

### Expected Outcome
- Comprehensive TypeScript type definitions for checkout
- Type-safe interfaces for all checkout data
- Enum for checkout steps and payment methods
- Foundation for type-safe checkout implementation

### Verification Checklist
- [ ] `frontend/types/storefront/checkout.types.ts` file created
- [ ] CheckoutStep enum defined with values 1-5
- [ ] ContactInfo interface created
- [ ] ShippingAddress interface created
- [ ] ShippingMethod interface created
- [ ] PaymentMethod type/enum created
- [ ] PaymentDetails interface created
- [ ] OrderInfo interface created
- [ ] CheckoutState interface created
- [ ] All types exported properly
- [ ] No TypeScript errors in file

---

## Task 11: Create Step Progress Indicator

### Overview
Create the StepProgress component that displays a visual progress indicator showing all checkout steps, highlighting the current step, completed steps, and upcoming steps. This component provides users with clear context about their position in the checkout flow and allows quick visual assessment of progress.

### Dependencies
- Task 02: Create Checkout Layout (from Document 01)
- Task 10: Create Checkout Types

### Instructions

1. **Create component directory**
   - Navigate to `frontend/components/storefront/checkout/` directory
   - Create new directory named `CheckoutLayout`
   - This will house layout-related components

2. **Create StepProgress component file**
   - Create `StepProgress.tsx` in `CheckoutLayout/` directory
   - Set up React functional component structure
   - Import checkout types

3. **Define component props**
   - Create `StepProgressProps` interface
   - Include currentStep prop (number 1-5)
   - Include completedSteps prop (array of numbers)
   - Include optional onStepClick handler

4. **Define step configuration**
   - Create array of step objects
   - Each object includes: number, label, icon name, route
   - Use consistent naming with checkout routes

5. **Import required icons**
   - Import icons from Lucide React or chosen icon library
   - User icon for Information step
   - Truck icon for Shipping step
   - CreditCard icon for Payment step
   - ClipboardCheck icon for Review step
   - Check or CheckCircle icon for Confirmation step

6. **Implement step rendering logic**
   - Map over step configuration array
   - Render each step with appropriate styling
   - Apply different styles based on step state

7. **Create step state logic**
   - Determine if step is completed (number < currentStep)
   - Determine if step is current (number === currentStep)
   - Determine if step is upcoming (number > currentStep)
   - Apply conditional styling based on state

8. **Style completed steps**
   - Show filled circle with checkmark
   - Use primary brand color (blue or green)
   - Display step label in normal color
   - Show connecting line in completed color

9. **Style current step**
   - Show outlined circle with step number or icon
   - Use active/accent color with animation
   - Display step label in bold or accent color
   - Add pulse or glow effect for emphasis

10. **Style upcoming steps**
    - Show outlined circle in gray
    - Display step number or icon in muted color
    - Display step label in gray
    - Show connecting line in gray

11. **Add connecting lines**
    - Render lines between step indicators
    - Style lines based on completion status
    - Use flexbox or grid for alignment
    - Ensure lines scale properly

12. **Implement responsive design**
    - Show full labels on desktop
    - Show abbreviated labels on tablet
    - Show icons only on mobile
    - Stack vertically if needed for very small screens

13. **Add accessibility features**
    - Add aria-label to each step
    - Mark current step with aria-current
    - Ensure keyboard navigation support
    - Add screen reader announcements

### Step Progress Visual Structure

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│   ●━━━━●━━━━●━━━━○━━━━○                                       │
│   ✓    ✓    2    3    4                                        │
│  Info Ship  Pay  Rev  Conf                                     │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

Legend:
● Filled = Completed
● Current = Step 2 (outlined, active)
○ Empty = Upcoming
━ Line = Connection
```

### Step Configuration Array

| Step | Number | Label | Icon | Route |
|------|--------|-------|------|-------|
| Information | 1 | Information | User | /checkout/information |
| Shipping | 2 | Shipping | Truck | /checkout/shipping |
| Payment | 3 | Payment | CreditCard | /checkout/payment |
| Review | 4 | Review | ClipboardCheck | /checkout/review |
| Confirmation | 5 | Confirmation | Check | /checkout/confirmation |

### Step State Styling Matrix

| State | Circle | Icon/Number | Label | Line | Color |
|-------|--------|-------------|-------|------|-------|
| Completed | Filled | Checkmark | Normal | Solid | Blue-600 |
| Current | Outlined | Icon/Number | Bold | Solid | Blue-600 |
| Upcoming | Outlined | Icon/Number | Muted | Dashed | Gray-300 |

### Responsive Display Strategy

```
Desktop (> 1024px)
├── Show: Icon + Full Label
├── Layout: Horizontal
└── Spacing: Generous

Tablet (640px - 1024px)
├── Show: Icon + Short Label
├── Layout: Horizontal
└── Spacing: Compact

Mobile (< 640px)
├── Show: Icon Only (with tooltip)
├── Layout: Horizontal (scrollable if needed)
└── Spacing: Minimal
```

### Accessibility Features

| Feature | Implementation |
|---------|----------------|
| Role | `role="progressbar"` on container |
| Aria Labels | Each step has descriptive label |
| Current Step | `aria-current="step"` |
| Keyboard Nav | Tab through steps (if clickable) |
| Screen Reader | Announce "Step X of 5: [Name]" |

### Component Behavior

| Scenario | Behavior |
|----------|----------|
| Click Completed Step | Navigate back (if allowed) |
| Click Current Step | No action (already on page) |
| Click Upcoming Step | Blocked (show tooltip) |
| Hover Step | Show tooltip with step name |

### Expected Outcome
- Visual progress indicator component
- Clear indication of current, completed, and upcoming steps
- Responsive design for all screen sizes
- Accessible to keyboard and screen readers

### Verification Checklist
- [ ] `StepProgress.tsx` created in CheckoutLayout directory
- [ ] Component displays all 5 steps correctly
- [ ] Current step highlighted appropriately
- [ ] Completed steps show checkmark
- [ ] Upcoming steps appear muted
- [ ] Connecting lines render between steps
- [ ] Icons imported and display correctly
- [ ] Responsive design works on mobile, tablet, desktop
- [ ] Accessibility features implemented
- [ ] Component exports properly
- [ ] TypeScript types defined correctly

---

## Task 12: Create Step Navigation Logic

### Overview
Create a custom hook or utility module that manages step navigation logic for the checkout flow. This logic determines which steps are accessible, validates step transitions, handles navigation between steps, and ensures users cannot skip required steps or access invalid checkout states.

### Dependencies
- Task 10: Create Checkout Types
- Task 09: Create Checkout Store (from Document 01)
- Next.js router is configured

### Instructions

1. **Create navigation hook file**
   - Navigate to `frontend/hooks/storefront/` directory (create if needed)
   - Create file named `useCheckoutNavigation.ts`
   - Set up custom React hook structure

2. **Import required dependencies**
   - Import useRouter from Next.js
   - Import checkout store from Task 09
   - Import checkout types from Task 10
   - Import useState, useEffect from React

3. **Define hook return type**
   - Create interface for hook return values
   - Include navigation functions (goToNext, goToPrevious, goToStep)
   - Include validation state (canProceed, canGoBack)
   - Include current step and validation errors

4. **Implement step validation logic**
   - Create validation function for each step
   - Check if required fields are filled
   - Validate data format (email, phone, etc.)
   - Return validation result and error messages

5. **Create step 1 validation (Information)**
   - Validate email format and presence
   - Validate phone number format
   - Validate first name and last name presence
   - Ensure all contact fields are completed

6. **Create step 2 validation (Shipping)**
   - Validate shipping address completeness
   - Validate shipping method selection
   - Ensure address format is correct
   - Verify postal code format

7. **Create step 3 validation (Payment)**
   - Validate payment method selection
   - Validate payment details if applicable
   - Verify billing address if different
   - Check payment provider requirements

8. **Create step 4 validation (Review)**
   - Verify all previous steps completed
   - Check cart is not empty
   - Validate total order information
   - Ensure terms acceptance if required

9. **Implement goToNext function**
   - Validate current step before proceeding
   - If validation passes, increment step
   - Update store with new current step
   - Navigate to next step route using router
   - If validation fails, show error messages

10. **Implement goToPrevious function**
    - Always allow going back (no validation needed)
    - Decrement current step
    - Update store with new current step
    - Navigate to previous step route
    - Ensure cannot go below step 1

11. **Implement goToStep function**
    - Accept target step as parameter
    - Validate all steps between current and target
    - Only allow if all intermediate steps valid
    - Prevent skipping steps
    - Navigate to target step if allowed

12. **Create step accessibility map**
    - Determine which steps are accessible from current position
    - Mark completed steps as accessible
    - Mark current step as accessible
    - Block upcoming steps if prerequisites not met
    - Return accessibility status for each step

13. **Add step completion tracking**
    - Track which steps have been completed
    - Store in checkout store or local state
    - Use for progress indicator
    - Prevent regression (going back clears forward completion)

14. **Implement navigation guards**
    - Prevent navigation if cart is empty
    - Block navigation during API calls
    - Handle edge cases (direct URL access)
    - Redirect to appropriate step if invalid

### Navigation Logic Flow

```
Current Step Validation
         ↓
    [Is Valid?]
    ↙        ↘
  YES         NO
   ↓           ↓
Navigate   Show Errors
   ↓
Update Store
   ↓
Router Push
   ↓
New Step Rendered
```

### Step Validation Requirements

| Step | Required Data | Validation Checks |
|------|---------------|-------------------|
| 1. Information | Email, phone, firstName, lastName | Email format, phone format, min length |
| 2. Shipping | Address, shipping method | All address fields, method selected |
| 3. Payment | Payment method, details | Method selected, details valid |
| 4. Review | All above, cart items | Steps 1-3 complete, cart not empty |
| 5. Confirmation | Order created | Order ID exists, payment confirmed |

### Navigation Functions

| Function | Parameters | Returns | Purpose |
|----------|------------|---------|---------|
| goToNext | none | Promise<boolean> | Advance to next step (with validation) |
| goToPrevious | none | void | Return to previous step |
| goToStep | stepNumber: number | Promise<boolean> | Jump to specific step (if allowed) |
| canProceed | none | boolean | Check if can advance |
| canGoBack | none | boolean | Check if can go back |
| validateCurrentStep | none | ValidationResult | Validate current step data |

### Step Accessibility Logic

```
Step 1 (Information)
├── Always Accessible: Yes
└── Requirements: None

Step 2 (Shipping)
├── Accessible If: Step 1 valid
└── Requirements: Contact info complete

Step 3 (Payment)
├── Accessible If: Step 1 & 2 valid
└── Requirements: Shipping selected

Step 4 (Review)
├── Accessible If: Step 1-3 valid
└── Requirements: Payment method chosen

Step 5 (Confirmation)
├── Accessible If: Order submitted
└── Requirements: Order ID exists
```

### Navigation Guard Scenarios

| Scenario | Detection | Action |
|----------|-----------|--------|
| Empty Cart | Check cart items count | Redirect to /cart |
| Invalid Step | URL step > allowed | Redirect to last valid step |
| Direct URL Access | Missing previous step data | Redirect to step 1 |
| Incomplete Data | Validation fails | Block navigation, show errors |
| API Error | Request fails | Show error, stay on step |

### Hook Return Values

| Property | Type | Description |
|----------|------|-------------|
| currentStep | number | Current checkout step (1-5) |
| canProceed | boolean | Whether can advance to next step |
| canGoBack | boolean | Whether can return to previous step |
| goToNext | function | Navigate to next step |
| goToPrevious | function | Navigate to previous step |
| goToStep | function | Navigate to specific step |
| validationErrors | string[] | Current validation error messages |
| isNavigating | boolean | Loading state during navigation |

### Expected Outcome
- Custom hook for managing checkout navigation
- Comprehensive validation for each step
- Navigation functions with proper guards
- Prevention of step skipping or invalid access

### Verification Checklist
- [ ] `useCheckoutNavigation.ts` hook created
- [ ] Hook integrates with checkout store
- [ ] Step validation functions implemented for all steps
- [ ] goToNext function validates before navigation
- [ ] goToPrevious function allows unrestricted back navigation
- [ ] goToStep function validates intermediate steps
- [ ] Cannot skip steps without completing previous ones
- [ ] Navigation updates both store and router
- [ ] Validation errors returned appropriately
- [ ] Hook exports proper TypeScript types
- [ ] Edge cases handled (empty cart, direct URL access)

---

## Task 13: Create Back Button

### Overview
Create a reusable BackButton component that allows users to navigate to the previous checkout step. This button appears on steps 2-5 and uses the navigation logic from Task 12 to safely return to the previous step without validation requirements.

### Dependencies
- Task 12: Create Step Navigation Logic
- Task 10: Create Checkout Types

### Instructions

1. **Create BackButton component file**
   - Navigate to `frontend/components/storefront/checkout/CheckoutLayout/` directory
   - Create file named `BackButton.tsx`
   - Set up React functional component

2. **Import required dependencies**
   - Import Button component from UI library
   - Import ArrowLeft or ChevronLeft icon
   - Import useCheckoutNavigation hook from Task 12
   - Import useRouter for navigation

3. **Define component props (optional)**
   - Create `BackButtonProps` interface
   - Include optional className for custom styling
   - Include optional label prop for custom text
   - Include optional disabled prop

4. **Implement button functionality**
   - Access goToPrevious function from navigation hook
   - Call goToPrevious when button clicked
   - Handle navigation state (loading)
   - Disable button if on first step

5. **Add button styling**
   - Use secondary or ghost button variant
   - Position on left side of button group
   - Add left-pointing arrow icon
   - Style consistently with design system

6. **Implement conditional rendering**
   - Only render button on steps 2-5
   - Hide on step 1 (Information)
   - Hide on step 5 (Confirmation) optionally
   - Check current step from navigation hook

7. **Add loading state**
   - Show loading indicator during navigation
   - Disable button during navigation
   - Prevent multiple clicks
   - Clear state after navigation complete

8. **Implement accessibility features**
   - Add descriptive aria-label
   - Ensure keyboard accessible
   - Add focus styles
   - Provide tooltip on hover

### Button Visual Design

```
┌─────────────────────────┐
│  ←  Back                │
│     to Shipping         │
└─────────────────────────┘

or

┌──────────────┐
│  ← Back      │
└──────────────┘
```

### Button Styling Specifications

| Property | Value | Purpose |
|----------|-------|---------|
| Variant | Secondary or Outline | Less prominent than Continue |
| Size | Medium | Match Continue button |
| Icon | ArrowLeft or ChevronLeft | Indicate backward navigation |
| Position | Left side | Standard placement |
| Width | Auto or Fixed | Depends on layout |

### Button States

| State | Appearance | Behavior |
|-------|------------|----------|
| Default | Outlined, gray | Clickable, hover effect |
| Hover | Slightly darker | Show pointer cursor |
| Active | Pressed appearance | Navigate to previous |
| Disabled | Grayed out | Not clickable (step 1) |
| Loading | Spinner icon | Prevent additional clicks |

### Conditional Display Logic

| Current Step | Display Button | Label Text |
|--------------|----------------|------------|
| 1 (Information) | No | - |
| 2 (Shipping) | Yes | "Back" or "Back to Information" |
| 3 (Payment) | Yes | "Back" or "Back to Shipping" |
| 4 (Review) | Yes | "Back" or "Back to Payment" |
| 5 (Confirmation) | No/Optional | "Back to Shop" (different action) |

### Component Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| className | string | No | "" | Additional CSS classes |
| label | string | No | "Back" | Button text |
| showStepName | boolean | No | false | Show "Back to [Step Name]" |
| disabled | boolean | No | false | Disable button |

### Accessibility Features

| Feature | Implementation |
|---------|----------------|
| Aria Label | "Go back to [previous step name]" |
| Keyboard | Enter and Space to activate |
| Focus | Visible focus ring |
| Tooltip | Show on hover (optional) |

### Expected Outcome
- Reusable back navigation button
- Consistent styling and behavior
- Proper conditional rendering
- Accessible and keyboard-friendly

### Verification Checklist
- [ ] `BackButton.tsx` created in CheckoutLayout directory
- [ ] Button uses navigation hook from Task 12
- [ ] Clicking button navigates to previous step
- [ ] Button hidden on step 1
- [ ] Loading state implemented
- [ ] Icon displayed correctly
- [ ] Styling matches design system
- [ ] Accessibility features implemented
- [ ] Component exports properly
- [ ] TypeScript types defined

---

## Task 14: Create Continue Button

### Overview
Create a reusable ContinueButton component that validates the current step and navigates to the next checkout step. This button appears on steps 1-4, uses validation logic from Task 12, and provides clear feedback about validation status and navigation state.

### Dependencies
- Task 12: Create Step Navigation Logic
- Task 10: Create Checkout Types

### Instructions

1. **Create ContinueButton component file**
   - Navigate to `frontend/components/storefront/checkout/CheckoutLayout/` directory
   - Create file named `ContinueButton.tsx`
   - Set up React functional component

2. **Import required dependencies**
   - Import Button component from UI library
   - Import ArrowRight or ChevronRight icon
   - Import useCheckoutNavigation hook from Task 12
   - Import Loader or Spinner icon for loading state

3. **Define component props**
   - Create `ContinueButtonProps` interface
   - Include optional className for styling
   - Include optional label prop for custom text
   - Include optional onValidationError callback

4. **Implement button functionality**
   - Access goToNext and canProceed from navigation hook
   - Call goToNext when button clicked
   - Handle validation errors
   - Update button state based on validation

5. **Add button styling**
   - Use primary button variant (prominent)
   - Position on right side of button group
   - Add right-pointing arrow icon
   - Use brand primary color

6. **Implement validation feedback**
   - Disable button if canProceed is false
   - Show tooltip on disabled button explaining why
   - Display validation errors near button or in toast
   - Update button state after validation check

7. **Create dynamic button labels**
   - Step 1-3: "Continue" or "Continue to [Next Step]"
   - Step 4: "Place Order" or "Complete Purchase"
   - Show loading text during navigation
   - Update based on current step

8. **Add loading state**
   - Show spinner icon during navigation
   - Change button text to "Processing..."
   - Disable button during navigation
   - Prevent multiple form submissions

9. **Implement error handling**
   - Catch navigation errors
   - Display error messages
   - Reset button state after error
   - Log errors for debugging

10. **Add conditional rendering**
    - Render on steps 1-4
    - Hide on step 5 (Confirmation)
    - Adjust styling for step 4 (Place Order)
    - Different behavior for final step

11. **Implement accessibility features**
    - Add descriptive aria-label
    - Ensure keyboard accessible
    - Add disabled state aria attributes
    - Provide screen reader feedback

### Button Visual Design

```
Default (Steps 1-3)
┌─────────────────────────┐
│  Continue  →            │
└─────────────────────────┘

Step 4 (Review)
┌─────────────────────────┐
│  Place Order  →         │
└─────────────────────────┘

Loading State
┌─────────────────────────┐
│  ⟳ Processing...        │
└─────────────────────────┘
```

### Button Styling Specifications

| Property | Value | Purpose |
|----------|-------|---------|
| Variant | Primary | Most prominent button |
| Color | Brand Blue | Call to action |
| Size | Medium/Large | Easy to click |
| Icon | ArrowRight | Indicate forward movement |
| Position | Right side | Standard placement |
| Width | Auto or Full | Depends on layout |

### Button States Matrix

| State | Appearance | Icon | Behavior |
|-------|------------|------|----------|
| Enabled | Primary blue | Arrow → | Clickable, validates on click |
| Disabled | Grayed out | Arrow → | Not clickable, show tooltip |
| Loading | Primary blue | Spinner ⟳ | Not clickable, processing |
| Error | Primary blue | Alert ⚠ | Clickable, retry action |
| Success | Success green | Check ✓ | Brief feedback, then navigate |

### Dynamic Label Logic

| Current Step | Button Label | Alternative Label |
|--------------|--------------|-------------------|
| 1 (Information) | "Continue" | "Continue to Shipping" |
| 2 (Shipping) | "Continue" | "Continue to Payment" |
| 3 (Payment) | "Continue" | "Continue to Review" |
| 4 (Review) | "Place Order" | "Complete Purchase" |
| 5 (Confirmation) | Hidden | - |

### Validation Feedback Scenarios

| Scenario | Button State | User Feedback |
|----------|--------------|---------------|
| All Valid | Enabled | Ready to proceed |
| Missing Email | Disabled | Tooltip: "Email required" |
| Invalid Phone | Disabled | Tooltip: "Invalid phone number" |
| No Shipping | Disabled | Tooltip: "Select shipping method" |
| API Error | Enabled | Toast: "Error occurred, try again" |

### Component Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| className | string | No | "" | Additional CSS classes |
| label | string | No | Auto | Custom button text |
| showNextStep | boolean | No | false | Show "Continue to [Step]" |
| onValidationError | function | No | undefined | Callback for validation errors |
| fullWidth | boolean | No | false | Full width button |

### Loading State Behavior

| Phase | Duration | Display |
|-------|----------|---------|
| Initial Click | Instant | Spinner appears |
| Validation | 100-500ms | "Validating..." |
| Navigation | 200-500ms | "Processing..." |
| Complete | Instant | Redirect to next page |

### Accessibility Features

| Feature | Implementation |
|---------|----------------|
| Aria Label | "Continue to [next step name]" or "Place order" |
| Disabled State | `aria-disabled="true"` when validation fails |
| Loading State | `aria-busy="true"` during processing |
| Error | `aria-describedby` pointing to error message |
| Keyboard | Enter to activate (when focused) |

### Expected Outcome
- Primary call-to-action button for checkout
- Validation before navigation
- Clear feedback on validation status
- Loading states during processing

### Verification Checklist
- [ ] `ContinueButton.tsx` created in CheckoutLayout directory
- [ ] Button uses navigation hook from Task 12
- [ ] Validates current step before proceeding
- [ ] Disabled when validation fails
- [ ] Shows loading state during navigation
- [ ] Dynamic label based on current step
- [ ] Step 4 shows "Place Order" instead of "Continue"
- [ ] Error handling implemented
- [ ] Tooltip shows validation errors
- [ ] Icon changes during loading
- [ ] Accessibility features implemented
- [ ] Component exports properly
- [ ] TypeScript types defined

---

## Task 15: Create Checkout Guard

### Overview
Create a CheckoutGuard component that protects the checkout flow from invalid access. This guard checks if the cart contains items, verifies step access permissions, redirects users to appropriate pages when conditions aren't met, and ensures users can only access checkout steps they're eligible for.

### Dependencies
- Task 09: Create Checkout Store (from Document 01)
- Task 10: Create Checkout Types
- Cart store from SubPhase-06

### Instructions

1. **Create CheckoutGuard component file**
   - Navigate to `frontend/components/storefront/checkout/CheckoutLayout/` directory
   - Create file named `CheckoutGuard.tsx`
   - Set up React functional component

2. **Import required dependencies**
   - Import useRouter from Next.js
   - Import useEffect, useRef from React
   - Import cart store (useCartStore)
   - Import checkout store
   - Import checkout types

3. **Define component props**
   - Create `CheckoutGuardProps` interface
   - Include children prop (ReactNode)
   - Include optional redirectTo prop (default: '/cart')
   - Include optional currentStep prop

4. **Implement cart validation**
   - Access cart items from cart store
   - Check if cart has at least one item
   - Verify cart items are valid (in stock, etc.)
   - Calculate if cart meets minimum order requirements

5. **Create empty cart check**
   - If cart is empty, redirect to cart page
   - Show optional notification: "Your cart is empty"
   - Prevent rendering checkout content
   - Clear any checkout data in store

6. **Implement step access validation**
   - Verify user can access requested step
   - Check if previous steps are completed
   - Validate step-specific requirements
   - Redirect to last valid step if access denied

7. **Create step validation logic**
   - Step 1: Always accessible (if cart not empty)
   - Step 2: Requires Step 1 data complete
   - Step 3: Requires Step 1 & 2 data complete
   - Step 4: Requires Step 1-3 data complete
   - Step 5: Requires order ID (successful submission)

8. **Implement redirect logic**
   - Use router to perform redirects
   - Add query parameters if needed (e.g., ?redirect=checkout)
   - Show loading state during redirect
   - Prevent flash of unauthorized content

9. **Add loading state**
   - Show loading spinner during validation
   - Prevent rendering content before checks complete
   - Handle async validation (if any API calls)
   - Smooth transition after validation

10. **Create permission check function**
    - Accept current step as parameter
    - Return boolean indicating access permission
    - Check checkout store for completed steps
    - Validate required data for each step

11. **Implement component mounting behavior**
    - Run validation on component mount
    - Use useEffect for initial check
    - Re-validate if dependencies change
    - Clean up on unmount if needed

12. **Add edge case handling**
    - Handle direct URL access to checkout steps
    - Handle browser back button navigation
    - Handle expired checkout sessions
    - Handle cart modifications during checkout

13. **Add error boundaries**
    - Wrap component in error boundary if needed
    - Handle unexpected errors gracefully
    - Log errors for debugging
    - Show fallback UI for errors

### Guard Logic Flow

```
User Accesses Checkout
        ↓
[Is Cart Empty?]
   ↙        ↘
 YES         NO
  ↓           ↓
Redirect   [Step Valid?]
to Cart      ↙        ↘
          YES         NO
           ↓           ↓
        Allow      Redirect to
        Access     Valid Step
```

### Cart Validation Checks

| Check | Condition | Action if Fail |
|-------|-----------|----------------|
| Cart Not Empty | items.length > 0 | Redirect to /cart |
| Items In Stock | All items available | Redirect to /cart with message |
| Valid Quantities | Qty > 0, within limits | Redirect to /cart |
| Price Valid | Prices loaded successfully | Retry or redirect |
| Minimum Order | Total meets minimum | Show error, stay on cart |

### Step Access Matrix

| Current Step | Required Data | Redirect If Invalid |
|--------------|---------------|---------------------|
| 1 (Information) | Cart items | /cart |
| 2 (Shipping) | Contact info (Step 1) | /checkout/information |
| 3 (Payment) | Contact + Address (Steps 1-2) | /checkout/shipping |
| 4 (Review) | Contact + Address + Payment (Steps 1-3) | /checkout/payment |
| 5 (Confirmation) | Order ID | /checkout/review |

### Redirect Scenarios

| Scenario | Detection | Redirect To | Message |
|----------|-----------|-------------|---------|
| Empty Cart | items.length === 0 | /cart | "Your cart is empty" |
| Skipped Step 1 | No contact info, on step 2 | /checkout/information | "Complete contact information" |
| Skipped Step 2 | No shipping, on step 3 | /checkout/shipping | "Select shipping method" |
| Skipped Step 3 | No payment, on step 4 | /checkout/payment | "Choose payment method" |
| Invalid Order | No order ID, on step 5 | /checkout/review | "Complete your order first" |
| Direct URL | Accessing step without prerequisite | First valid step | "Please complete all steps" |

### Component Structure

```typescript
CheckoutGuard
├── Validation Logic
│   ├── Cart Check
│   ├── Step Access Check
│   └── Data Completeness Check
├── Redirect Logic
│   ├── Determine Redirect Target
│   ├── Execute Redirect
│   └── Show Feedback
└── Render Children
    ├── If All Valid: Render
    └── If Invalid: Loading/Redirect
```

### Component Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| children | ReactNode | Yes | - | Content to protect |
| currentStep | number | No | Auto-detect | Current checkout step |
| redirectTo | string | No | "/cart" | Redirect target for empty cart |
| showLoading | boolean | No | true | Show loading during validation |

### Loading States

| State | Display | Duration |
|-------|---------|----------|
| Initial Load | Spinner | Until validation complete |
| Redirecting | "Redirecting..." message | 100-300ms |
| Validated | Children render | - |

### Edge Cases to Handle

| Edge Case | Detection | Handling |
|-----------|-----------|----------|
| Browser Back Button | Navigation event | Re-validate on page load |
| Cart Modified During Checkout | Cart store subscription | Re-validate, redirect if invalid |
| Expired Session | Check timestamp | Clear data, redirect to start |
| Concurrent Tabs | Storage event listener | Sync state across tabs |
| Direct URL Access | Missing required data | Redirect to earliest valid step |

### Accessibility Considerations

| Feature | Implementation |
|---------|----------------|
| Screen Reader | Announce redirects and errors |
| Focus Management | Focus first element after redirect |
| Loading State | Announce "Loading checkout..." |
| Error Messages | Clear, descriptive messages |

### Expected Outcome
- Protected checkout flow preventing invalid access
- Automatic redirects when conditions not met
- Smooth user experience with clear feedback
- Prevention of checkout errors from invalid states

### Verification Checklist
- [ ] `CheckoutGuard.tsx` created in CheckoutLayout directory
- [ ] Component wraps checkout pages
- [ ] Empty cart redirects to /cart
- [ ] Step access validation works correctly
- [ ] Cannot skip steps by URL manipulation
- [ ] Redirects happen smoothly without flash
- [ ] Loading state shows during validation
- [ ] Error messages display appropriately
- [ ] Browser back button handled correctly
- [ ] Direct URL access to invalid steps redirects
- [ ] Component exports properly
- [ ] TypeScript types defined

---

## Task 16: Create Guest Checkout Check

### Overview
Create logic to detect if the user is logged in or checking out as a guest. This check determines whether to pre-fill contact information from the user account or show a login prompt. It supports guest checkout flow while encouraging account creation and provides seamless experience for returning customers.

### Dependencies
- Task 09: Create Checkout Store (from Document 01)
- Authentication store or context (from Phase-07)
- User profile data access

### Instructions

1. **Create guest checkout utility file**
   - Navigate to `frontend/lib/storefront/` directory (create if needed)
   - Create file named `guestCheckout.ts`
   - Set up utility functions for guest detection

2. **Create guest detection function**
   - Check if user is authenticated
   - Access authentication state from auth store/context
   - Return boolean indicating guest status
   - Cache result for performance

3. **Implement user data pre-fill logic**
   - If user logged in, fetch user profile data
   - Extract email, phone, name from user profile
   - Extract saved addresses if available
   - Pre-populate checkout store with user data

4. **Create guest checkout hook**
   - Create `useGuestCheckout.ts` in hooks directory
   - Combine detection and pre-fill logic
   - Return guest status and user data
   - Expose function to trigger pre-fill

5. **Implement login prompt component**
   - Create `GuestCheckoutPrompt.tsx` component
   - Show at top of checkout or step 1
   - Display message: "Have an account? Sign in for faster checkout"
   - Include sign-in button/link

6. **Add guest checkout benefits display**
   - Show benefits of creating account
   - List: Order history, saved addresses, faster checkout
   - Display after checkout completion for guests
   - Include "Create Account" CTA

7. **Implement returning customer flow**
   - Detect if guest email matches existing account
   - Show prompt: "We found an account with this email"
   - Offer to sign in to access saved information
   - Allow continuing as guest if preferred

8. **Create pre-fill behavior**
   - Auto-fill contact form if logged in
   - Auto-populate shipping addresses
   - Show saved payment methods
   - Allow editing pre-filled data

9. **Add guest data handling**
   - Store guest data in checkout store only
   - Don't persist to database until order complete
   - Clear guest data after checkout abandonment
   - Optionally save email for marketing (with consent)

10. **Implement post-checkout account creation**
    - After successful order, offer account creation
    - Pre-fill registration with checkout data
    - Set order to user account if they register
    - Send welcome email with order details

11. **Add guest checkout analytics**
    - Track guest vs logged-in checkouts
    - Monitor conversion rates for each
    - Track account creation post-checkout
    - Identify friction points

### Guest Detection Logic

```
Check User Authentication
        ↓
[Is Logged In?]
   ↙        ↘
 YES         NO
  ↓           ↓
Load User   Guest Mode
Profile       ↓
  ↓      Show Login
Pre-fill    Prompt
Data          ↓
           Continue
           as Guest
```

### User State Matrix

| User State | Detected By | Checkout Behavior | Data Pre-fill |
|------------|-------------|-------------------|---------------|
| Logged In | Auth token exists | Standard flow | All user data |
| Guest | No auth token | Show login prompt | None |
| Returning Email | Email matches DB | Show login suggestion | Email only |
| New Guest | Email not in DB | Standard guest | None |

### Login Prompt Placement

| Location | Visibility | Message |
|----------|------------|---------|
| Top of Checkout | High | "Sign in for faster checkout" |
| Information Step | High | "Have an account? Sign in" |
| Review Step | Medium | "Create account to save this order" |
| Confirmation Step | High | "Create account to track your order" |

### Data Pre-fill Strategy

| Data Type | Logged In | Guest | Source |
|-----------|-----------|-------|--------|
| Email | Auto-filled | Manual entry | User profile |
| Phone | Auto-filled | Manual entry | User profile |
| Name | Auto-filled | Manual entry | User profile |
| Address | Dropdown of saved | Manual entry | Address book |
| Payment | Saved methods | Manual entry | Payment tokens |

### Guest Checkout Benefits Display

```
┌─────────────────────────────────────────┐
│  Why Create an Account?                 │
│                                          │
│  ✓ Track your order                     │
│  ✓ View order history                   │
│  ✓ Save addresses                       │
│  ✓ Faster future checkouts              │
│  ✓ Exclusive offers                     │
│                                          │
│  [ Create Account ]  [ Continue Guest ] │
└─────────────────────────────────────────┘
```

### Returning Customer Flow

| Step | Condition | Display | Action |
|------|-----------|---------|--------|
| 1 | Email entered | Check DB | Search for account |
| 2 | Account found | Show prompt | "Sign in to use saved info" |
| 3 | User chooses | Two options | Sign in OR continue guest |
| 4 | If sign in | Authenticate | Pre-fill all data |
| 5 | If guest | Continue | Manual entry |

### Post-Checkout Account Creation

| Element | Implementation |
|---------|----------------|
| Timing | Show after order confirmation |
| Data | Pre-fill with checkout data |
| Password | User creates password only |
| Benefits | Link order to new account |
| Email | Send welcome + order details |

### Guest Data Storage

| Data | Storage Location | Persistence | Clear When |
|------|------------------|-------------|------------|
| Contact Info | Checkout store | Session only | Order complete or abandoned |
| Shipping Address | Checkout store | Session only | Order complete or abandoned |
| Cart Items | Cart store | Local storage | Order complete |
| Order ID | Checkout store | Until confirmed | After confirmation viewed |

### Guest vs Logged-In Comparison

| Feature | Guest | Logged In |
|---------|-------|-----------|
| Checkout Speed | Slower (manual entry) | Faster (pre-filled) |
| Data Entry | All manual | Mostly auto-filled |
| Order Tracking | Email link only | Account dashboard |
| Saved Addresses | No | Yes |
| Order History | No | Yes |
| Reorder | No | Yes |

### Analytics Tracking Points

| Event | Metric | Purpose |
|-------|--------|---------|
| Guest Checkout Started | Count | Track guest preference |
| Login Prompt Shown | Impressions | Measure visibility |
| Login Prompt Clicked | Clicks | Measure effectiveness |
| Guest Checkout Completed | Conversion | Compare to logged-in |
| Account Created Post-Checkout | Conversion | Measure account growth |

### Hook Return Values

| Property | Type | Description |
|----------|------|-------------|
| isGuest | boolean | Whether user is guest |
| isLoggedIn | boolean | Whether user authenticated |
| userData | UserProfile \| null | User data if logged in |
| prefillCheckout | function | Pre-fill checkout with user data |
| showLoginPrompt | boolean | Whether to show login CTA |

### Expected Outcome
- Seamless guest checkout experience
- Pre-filled data for logged-in users
- Login prompts encouraging account use
- Post-checkout account creation flow

### Verification Checklist
- [ ] Guest detection utility created
- [ ] useGuestCheckout hook implemented
- [ ] Guest status detected correctly
- [ ] Logged-in users have data pre-filled
- [ ] Guest users see login prompts
- [ ] Returning customer flow works
- [ ] Login prompt displays appropriately
- [ ] Post-checkout account creation offered
- [ ] Guest data stored temporarily only
- [ ] Analytics tracking implemented
- [ ] Component/utility exports properly
- [ ] TypeScript types defined

---

## Task 17: Create Checkout Header

### Overview
Create a simplified CheckoutHeader component specifically for the checkout layout. This header is minimal and distraction-free, featuring only the store logo and step progress indicator. It removes the full navigation menu, search bar, and mini cart to keep users focused on completing their purchase.

### Dependencies
- Task 02: Create Checkout Layout (from Document 01)
- Task 11: Create Step Progress Indicator
- Store logo asset

### Instructions

1. **Create CheckoutHeader component file**
   - Navigate to `frontend/components/storefront/checkout/CheckoutLayout/` directory
   - Create file named `CheckoutHeader.tsx`
   - Set up React functional component

2. **Import required dependencies**
   - Import Link from Next.js
   - Import Image component for logo
   - Import StepProgress component from Task 11
   - Import any layout utilities

3. **Define component props**
   - Create `CheckoutHeaderProps` interface
   - Include currentStep prop (number)
   - Include optional showSteps prop (boolean)
   - Include optional showBackToStore prop (boolean)

4. **Create header structure**
   - Top section: Full-width container
   - Left side: Store logo (linked to home)
   - Center: Step progress indicator
   - Right side: Optional elements (help link, security badge)

5. **Implement logo section**
   - Import store logo image
   - Use Next.js Link to wrap logo
   - Link to homepage (/) or store (/products)
   - Size logo appropriately (smaller than main header)

6. **Add step progress integration**
   - Import StepProgress component from Task 11
   - Pass currentStep prop
   - Center in header
   - Show on all checkout steps except confirmation

7. **Style header container**
   - Fixed or sticky positioning at top
   - White background with bottom border
   - Shadow for depth separation
   - Appropriate padding and height

8. **Add optional right-side elements**
   - Help/Support link (icon + text)
   - Security badge (lock icon + "Secure Checkout")
   - Keep minimal and non-distracting

9. **Implement responsive design**
   - Desktop: Logo (left) + Steps (center) + Help (right)
   - Tablet: Logo (left) + Steps (center)
   - Mobile: Logo (top center) + Steps (below)

10. **Add sticky/fixed behavior**
    - Keep header visible while scrolling
    - Use position: sticky or fixed
    - Ensure z-index above content
    - Smooth scroll behavior

11. **Create minimal design**
    - Remove main navigation menu
    - Remove search bar
    - Remove mini cart icon
    - Remove user account dropdown
    - Keep only essential elements

12. **Add accessibility features**
    - Semantic header element
    - Skip to content link
    - Proper heading hierarchy
    - Keyboard navigation support

### Header Visual Layout

```
Desktop:
┌─────────────────────────────────────────────────────┐
│  [Logo]    [●━━●━━○━━○━━○]           [🔒 Secure]   │
│            Step Progress                            │
└─────────────────────────────────────────────────────┘

Mobile:
┌─────────────────────┐
│      [Logo]         │
│  [●━━●━━○━━○━━○]   │
│   Step Progress     │
└─────────────────────┘
```

### Header Sections

| Section | Content | Position | Responsive Behavior |
|---------|---------|----------|---------------------|
| Logo | Store logo + link | Left (Desktop), Top (Mobile) | Smaller on mobile |
| Progress | Step indicator | Center | Full width on mobile |
| Security | Lock icon + text | Right (Desktop) | Hidden on mobile |

### Component Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| currentStep | number | Yes | - | Current checkout step (1-5) |
| showSteps | boolean | No | true | Show/hide step progress |
| showBackToStore | boolean | No | false | Show "Back to Store" link |
| className | string | No | "" | Additional CSS classes |

### Header Styling Specifications

| Property | Value | Purpose |
|----------|-------|---------|
| Position | sticky top-0 | Keep visible during scroll |
| Background | bg-white | Clean, neutral |
| Border | border-b border-gray-200 | Subtle separation |
| Shadow | shadow-sm | Elevation effect |
| Height | h-16 md:h-20 | Appropriate size |
| Padding | px-4 md:px-8 | Responsive spacing |
| Z-Index | z-40 | Above content |

### Logo Specifications

| Attribute | Value | Responsive |
|-----------|-------|------------|
| Width | 120px | 100px (mobile) |
| Height | 40px | 32px (mobile) |
| Link | / (homepage) | Same |
| Alt Text | "[Store Name] Logo" | Same |

### Step Progress Display

| Viewport | Display | Position |
|----------|---------|----------|
| Desktop (>1024px) | Full steps with labels | Center of header |
| Tablet (640-1024px) | Steps with short labels | Center of header |
| Mobile (<640px) | Steps with icons only | Below logo |

### Security Badge

```
┌─────────────────────┐
│  🔒  Secure         │
│      Checkout       │
└─────────────────────┘

or

🔒 Secure Checkout
```

### Optional Elements Display

| Element | Desktop | Tablet | Mobile | Purpose |
|---------|---------|--------|--------|---------|
| Logo | Show | Show | Show | Branding |
| Step Progress | Show | Show | Show | Orientation |
| Security Badge | Show | Show | Hide | Trust signal |
| Help Link | Show | Hide | Hide | Support access |

### Comparison: Main Header vs Checkout Header

| Element | Main Header | Checkout Header |
|---------|-------------|-----------------|
| Navigation Menu | ✓ | ✗ |
| Search Bar | ✓ | ✗ |
| Mini Cart | ✓ | ✗ |
| User Account | ✓ | ✗ |
| Logo | ✓ | ✓ |
| Category Links | ✓ | ✗ |
| Step Progress | ✗ | ✓ |
| Minimal Design | ✗ | ✓ |

### Accessibility Features

| Feature | Implementation |
|---------|----------------|
| Landmark | `<header role="banner">` |
| Skip Link | "Skip to checkout content" |
| Logo Link | Descriptive aria-label |
| Help Link | Clear link text |
| Focus | Visible focus indicators |

### Expected Outcome
- Clean, minimal checkout header
- Store logo with home link
- Integrated step progress indicator
- Responsive across all devices
- Distraction-free experience

### Verification Checklist
- [ ] `CheckoutHeader.tsx` created in CheckoutLayout directory
- [ ] Logo displays and links to homepage
- [ ] Step progress indicator integrated
- [ ] Header has clean, minimal design
- [ ] No navigation menu or search bar
- [ ] No mini cart or user dropdown
- [ ] Optional security badge added
- [ ] Sticky/fixed positioning works
- [ ] Responsive on mobile, tablet, desktop
- [ ] Accessibility features implemented
- [ ] Component exports properly
- [ ] TypeScript types defined

---

## Task 18: Verify Checkout Structure

### Overview
Perform comprehensive verification of the complete checkout structure. This task ensures all routes, components, store, types, and navigation logic are properly implemented, integrated, and functioning correctly. It validates the entire checkout flow end-to-end and confirms readiness for implementing individual step content.

### Dependencies
- All previous tasks (01-17) must be completed
- Checkout routes, store, and components exist
- Development server is running

### Instructions

1. **Verify directory structure**
   - Check all checkout directories exist
   - Confirm proper file naming conventions
   - Validate folder organization matches spec
   - Ensure no missing directories

2. **Verify route files**
   - Confirm all 6 route files exist
   - Check main page.tsx redirects to step 1
   - Verify all 5 step pages exist
   - Test each route is accessible

3. **Verify checkout layout**
   - Confirm layout.tsx wraps all steps
   - Check layout renders correctly
   - Verify CheckoutGuard is applied
   - Test layout with different step contents

4. **Verify Zustand store**
   - Check checkoutStore.ts exists
   - Confirm all store sections defined
   - Verify store methods work
   - Test state updates persist

5. **Verify TypeScript types**
   - Check checkout.types.ts exists
   - Confirm all types exported
   - Verify no TypeScript errors
   - Test type imports in components

6. **Verify StepProgress component**
   - Check component exists and renders
   - Test displays all 5 steps
   - Verify current step highlights correctly
   - Test completed steps show checkmarks

7. **Verify navigation logic**
   - Check useCheckoutNavigation hook exists
   - Test goToNext validates before navigation
   - Test goToPrevious allows back navigation
   - Verify cannot skip steps

8. **Verify Back button**
   - Check BackButton component exists
   - Test button appears on steps 2-5
   - Verify button hidden on step 1
   - Test click navigates to previous step

9. **Verify Continue button**
   - Check ContinueButton component exists
   - Test button appears on steps 1-4
   - Verify validation blocks invalid progression
   - Test dynamic labels per step

10. **Verify checkout guard**
    - Check CheckoutGuard component exists
    - Test empty cart redirects to /cart
    - Verify invalid step access redirects
    - Test direct URL navigation protection

11. **Verify guest checkout logic**
    - Check guest detection works
    - Test logged-in users get pre-filled data
    - Verify guest users see login prompt
    - Test guest can complete checkout

12. **Verify checkout header**
    - Check CheckoutHeader component exists
    - Test header shows logo and progress
    - Verify header is minimal (no nav/cart)
    - Test responsive behavior

13. **Test complete checkout flow**
    - Start at /checkout, verify redirects to step 1
    - Enter data on step 1, proceed to step 2
    - Navigate back to step 1, data persists
    - Try to skip to step 4, blocked appropriately
    - Complete all steps sequentially

14. **Test edge cases**
    - Access checkout with empty cart
    - Access step 3 directly via URL
    - Modify cart during checkout
    - Refresh page during checkout
    - Use browser back/forward buttons

15. **Verify component exports**
    - Check index.ts files exist
    - Verify all components export properly
    - Test imports work from other files
    - Confirm no circular dependencies

16. **Test responsive design**
    - View checkout on mobile device
    - Test on tablet screen size
    - Verify desktop layout
    - Check all breakpoints work

17. **Test accessibility**
    - Navigate with keyboard only
    - Test with screen reader
    - Verify focus indicators visible
    - Check color contrast ratios

18. **Document any issues**
    - Create list of bugs found
    - Note any missing features
    - Document inconsistencies
    - Prioritize fixes needed

### Verification Checklist

#### Directory Structure
- [ ] `app/(storefront)/checkout/` directory exists
- [ ] `app/(storefront)/checkout/information/` directory exists
- [ ] `app/(storefront)/checkout/shipping/` directory exists
- [ ] `app/(storefront)/checkout/payment/` directory exists
- [ ] `app/(storefront)/checkout/review/` directory exists
- [ ] `app/(storefront)/checkout/confirmation/` directory exists
- [ ] `components/storefront/checkout/CheckoutLayout/` directory exists
- [ ] `stores/storefront/` directory exists
- [ ] `types/storefront/` directory exists

#### Route Files
- [ ] `app/(storefront)/checkout/layout.tsx` exists
- [ ] `app/(storefront)/checkout/page.tsx` exists (redirects to step 1)
- [ ] `app/(storefront)/checkout/information/page.tsx` exists
- [ ] `app/(storefront)/checkout/shipping/page.tsx` exists
- [ ] `app/(storefront)/checkout/payment/page.tsx` exists
- [ ] `app/(storefront)/checkout/review/page.tsx` exists
- [ ] `app/(storefront)/checkout/confirmation/page.tsx` exists

#### Store and Types
- [ ] `stores/storefront/checkoutStore.ts` exists
- [ ] Store has contact, shipping, payment, order sections
- [ ] Store has currentStep state
- [ ] Store has update methods for each section
- [ ] `types/storefront/checkout.types.ts` exists
- [ ] All necessary types/interfaces exported
- [ ] No TypeScript compilation errors

#### Components
- [ ] `CheckoutLayout/StepProgress.tsx` exists and renders
- [ ] `CheckoutLayout/BackButton.tsx` exists and works
- [ ] `CheckoutLayout/ContinueButton.tsx` exists and validates
- [ ] `CheckoutLayout/CheckoutGuard.tsx` exists and protects routes
- [ ] `CheckoutLayout/CheckoutHeader.tsx` exists and displays
- [ ] `CheckoutLayout/index.ts` exports all components

#### Navigation
- [ ] `hooks/storefront/useCheckoutNavigation.ts` exists
- [ ] Hook returns goToNext, goToPrevious, goToStep functions
- [ ] goToNext validates current step before navigation
- [ ] goToPrevious allows unrestricted back navigation
- [ ] Cannot skip steps by URL manipulation
- [ ] Navigation updates both store and router

#### Checkout Guard
- [ ] Empty cart redirects to /cart page
- [ ] Step 2 without Step 1 data redirects to Step 1
- [ ] Step 3 without Step 2 data redirects to Step 2
- [ ] Step 4 without Step 3 data redirects to Step 3
- [ ] Direct URL access to invalid step redirects appropriately
- [ ] Guard doesn't flash unauthorized content

#### Guest Checkout
- [ ] Guest detection logic implemented
- [ ] Logged-in users see pre-filled data
- [ ] Guest users see login prompt
- [ ] Guest users can complete checkout without account
- [ ] Post-checkout account creation offered to guests

#### User Experience
- [ ] Checkout flow works start to finish
- [ ] Data persists when navigating between steps
- [ ] Progress indicator updates correctly
- [ ] Back button appears on appropriate steps
- [ ] Continue button validates and enables/disables
- [ ] Error messages display clearly
- [ ] Loading states show during navigation

#### Responsive Design
- [ ] Checkout layout works on mobile (< 640px)
- [ ] Checkout layout works on tablet (640-1024px)
- [ ] Checkout layout works on desktop (> 1024px)
- [ ] Step progress adapts to screen size
- [ ] Header is minimal and responsive
- [ ] Buttons stack properly on mobile

#### Accessibility
- [ ] All interactive elements keyboard accessible
- [ ] Focus indicators visible
- [ ] Proper semantic HTML used
- [ ] ARIA labels where appropriate
- [ ] Screen reader friendly
- [ ] Color contrast meets WCAG AA standards

#### Integration
- [ ] Checkout integrates with cart store
- [ ] Authentication state checked correctly
- [ ] User data loaded for logged-in users
- [ ] No console errors or warnings
- [ ] All imports resolve correctly
- [ ] No circular dependencies

### Expected Directory Structure

```
frontend/
├── app/
│   └── (storefront)/
│       └── checkout/
│           ├── layout.tsx ✓
│           ├── page.tsx ✓
│           ├── information/
│           │   └── page.tsx ✓
│           ├── shipping/
│           │   └── page.tsx ✓
│           ├── payment/
│           │   └── page.tsx ✓
│           ├── review/
│           │   └── page.tsx ✓
│           └── confirmation/
│               └── page.tsx ✓
├── components/
│   └── storefront/
│       └── checkout/
│           └── CheckoutLayout/
│               ├── CheckoutHeader.tsx ✓
│               ├── StepProgress.tsx ✓
│               ├── BackButton.tsx ✓
│               ├── ContinueButton.tsx ✓
│               ├── CheckoutGuard.tsx ✓
│               └── index.ts ✓
├── hooks/
│   └── storefront/
│       └── useCheckoutNavigation.ts ✓
├── lib/
│   └── storefront/
│       └── guestCheckout.ts ✓
├── stores/
│   └── storefront/
│       └── checkoutStore.ts ✓
└── types/
    └── storefront/
        └── checkout.types.ts ✓
```

### Testing Scenarios

| Scenario | Steps | Expected Result |
|----------|-------|-----------------|
| Normal Flow | Navigate through all steps with valid data | Success, reach confirmation |
| Empty Cart | Access /checkout with no items | Redirect to /cart |
| Skip Step | Try to access step 3 directly | Redirect to step 1 |
| Invalid Data | Try to continue with missing fields | Blocked, errors shown |
| Back Navigation | Click back on step 3 | Return to step 2, data persists |
| URL Manipulation | Manually change URL to step 5 | Redirect to valid step |
| Page Refresh | Refresh page on step 2 | Stay on step 2, data persists |
| Browser Back | Use browser back button | Navigate to previous step |

### Common Issues and Solutions

| Issue | Cause | Solution |
|-------|-------|----------|
| Routes not rendering | Incorrect directory structure | Verify parentheses in (storefront) |
| Store not updating | State mutation | Use immutable update patterns |
| Navigation not working | Router not configured | Import and use useRouter correctly |
| TypeScript errors | Missing type exports | Export all types from index |
| Validation not working | Missing dependencies | Check hook dependencies array |
| Guard not redirecting | Async timing | Use useEffect with proper deps |

### Performance Checks

| Metric | Target | How to Check |
|--------|--------|--------------|
| Initial Load | < 2s | Browser DevTools Network tab |
| Navigation Speed | < 300ms | Time between steps |
| Store Updates | < 50ms | React DevTools Profiler |
| No Memory Leaks | Stable | Check memory over time |

### Expected Outcome
- Fully functional checkout structure
- All routes accessible and protected
- Complete navigation system working
- Store managing state correctly
- All components rendering properly
- End-to-end flow tested and verified

### Final Verification Statement

After completing all checks, the checkout structure should be:
- ✅ Fully implemented with all files in place
- ✅ Navigation working with proper validation
- ✅ Guards protecting against invalid access
- ✅ Store managing state across steps
- ✅ Components rendering and functioning
- ✅ Responsive on all device sizes
- ✅ Accessible with keyboard and screen readers
- ✅ Ready for step content implementation

If all checklist items are marked complete, the checkout structure is verified and ready for Group B (Step 1 - Information) implementation.

---

## Summary

This document established the navigation, guard logic, and structure verification for the checkout flow. All checkout types are defined, progress indicator created, navigation components implemented, and the complete structure verified. The checkout is now protected against invalid access and ready for step-specific content implementation.

### Completed Tasks
1. ✓ Created comprehensive TypeScript types for checkout
2. ✓ Created step progress indicator with visual feedback
3. ✓ Created step navigation logic with validation
4. ✓ Created back button for step navigation
5. ✓ Created continue button with validation
6. ✓ Created checkout guard for route protection
7. ✓ Created guest checkout detection and handling
8. ✓ Created minimal checkout header
9. ✓ Verified complete checkout structure

### Next Steps
Proceed to **Group B: Step 1 - Information** to implement the contact information collection step, including form components, validation, and data handling.

