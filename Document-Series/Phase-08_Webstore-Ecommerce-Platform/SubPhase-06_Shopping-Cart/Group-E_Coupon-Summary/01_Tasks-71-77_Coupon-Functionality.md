# Tasks 71-77: Coupon Functionality

> **Phase:** 08 - Webstore & E-Commerce Platform  
> **SubPhase:** 06 - Shopping Cart  
> **Group:** E - Coupon & Summary  
> **Document:** 01 of 02  
> **Tasks Covered:** 71, 72, 73, 74, 75, 76, 77

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-78-84_Summary-Checkout.md](02_Tasks-78-84_Summary-Checkout.md)

---

## Document Overview

This document covers the creation of coupon functionality for the shopping cart. It establishes the coupon input system, validation logic, success/error displays, and removal functionality, allowing customers to apply discount codes to their orders.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 71 | Create Coupon Section | Low | 20 min |
| 72 | Create Coupon Input | Low | 20 min |
| 73 | Create Apply Coupon Button | Low | 15 min |
| 74 | Create Coupon Validation | Medium | 35 min |
| 75 | Create Coupon Success | Low | 20 min |
| 76 | Create Coupon Error | Low | 20 min |
| 77 | Create Remove Coupon | Low | 20 min |

---

## Task 71: Create Coupon Section

### Overview
Create the CouponSection component that serves as a container for all coupon-related functionality. This section provides a dedicated area in the cart where customers can enter and apply discount codes, view applied coupons, and see validation messages.

### Dependencies
- Group-D (Cart Item Management) must be complete
- Cart state management is established
- UI component library available

### Instructions

1. **Create coupon components directory**
   - Navigate to `frontend/components/storefront/cart/` directory
   - Create new directory named `Coupon`
   - This will house all coupon-related components

2. **Create CouponSection component file**
   - Create `CouponSection.tsx` in `components/storefront/cart/Coupon/` directory
   - Set up TypeScript React functional component structure

3. **Define section structure**
   - Create container div with proper semantic HTML
   - Add heading or label for section identification
   - Plan layout for input, button, and message display

4. **Apply section styling**
   - Set background color (bg-gray-50 or bg-white)
   - Add padding for internal spacing (p-4 to p-6)
   - Add border or border-radius for definition
   - Ensure visual separation from other cart sections

5. **Add section heading**
   - Include text like "Have a Coupon Code?"
   - Style heading appropriately (text-sm to text-base)
   - Position above coupon input area

6. **Create placeholder for child components**
   - Add comments indicating where CouponInput will be placed
   - Add comments indicating where ApplyCouponButton will be placed
   - Add comments indicating where success/error messages will display

7. **Implement responsive layout**
   - Stack elements vertically on mobile
   - Consider horizontal layout for input and button on desktop
   - Adjust spacing for different screen sizes

### Section Layout Structure

```
┌─────────────────────────────────────────┐
│  Have a Coupon Code?                    │
│                                         │
│  ┌─────────────────┐  ┌─────────┐     │
│  │  Coupon Input   │  │  Apply  │     │
│  └─────────────────┘  └─────────┘     │
│                                         │
│  [Success/Error Message Display]       │
└─────────────────────────────────────────┘
```

### Section Styling Specifications

| Property | Value | Purpose |
|----------|-------|---------|
| Background | `bg-gray-50` | Visual separation |
| Padding | `p-4 md:p-6` | Breathing room |
| Border | `border border-gray-200` or `rounded-lg` | Definition |
| Margin | `mb-6` | Spacing from summary |

### Component Props (Optional)

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| className | string | No | "" | Additional CSS classes |

### Responsive Behavior

```
Mobile (< 768px)
├── Input: Full width
├── Button: Full width
└── Stack: Vertical

Desktop (≥ 768px)
├── Input: flex-grow
├── Button: Auto width
└── Layout: Horizontal with gap
```

### Expected Outcome
- Container component for coupon functionality
- Clear visual separation from other cart sections
- Properly labeled section with heading
- Ready to receive child components

### Verification Checklist
- [ ] `frontend/components/storefront/cart/Coupon/CouponSection.tsx` file created
- [ ] Section has clear heading or label
- [ ] Container styled with background and padding
- [ ] Responsive layout structure defined
- [ ] Placeholder comments for child components added
- [ ] Component exports properly

---

## Task 72: Create Coupon Input

### Overview
Create the CouponInput component that provides a text input field for customers to enter their coupon codes. This component handles input state, validation formatting, and user feedback for code entry.

### Dependencies
- Task 71: Create Coupon Section

### Instructions

1. **Create CouponInput component file**
   - Create `CouponInput.tsx` in `components/storefront/cart/Coupon/` directory
   - Set up React functional component structure

2. **Define component props interface**
   - Create `CouponInputProps` interface
   - Include `value` prop (string) for controlled input
   - Include `onChange` prop (function) for state updates
   - Include `disabled` prop (boolean) for loading states
   - Include optional `error` prop (boolean) for error styling

3. **Implement input element**
   - Create HTML input element with type="text"
   - Set placeholder text ("Enter coupon code")
   - Connect value prop to input value
   - Connect onChange prop to input onChange event

4. **Apply input styling**
   - Set border and border-radius
   - Add padding for comfortable input area
   - Apply focus styles (focus ring)
   - Set font size and text transform (uppercase)

5. **Add error state styling**
   - Change border color to red when error prop is true
   - Add error icon or indicator (optional)
   - Update focus ring color to match error state

6. **Implement disabled state**
   - Reduce opacity when disabled
   - Change cursor to not-allowed
   - Disable input interaction

7. **Add input validation**
   - Convert input to uppercase automatically
   - Trim whitespace from input
   - Optionally limit character length
   - Remove special characters if needed

### Component Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| value | string | Yes | - | Current input value |
| onChange | (value: string) => void | Yes | - | Value change handler |
| disabled | boolean | No | false | Disable input during loading |
| error | boolean | No | false | Show error styling |
| placeholder | string | No | "Enter coupon code" | Input placeholder |

### Input Styling Specifications

| State | Border Color | Background | Cursor |
|-------|--------------|------------|--------|
| Normal | `border-gray-300` | `bg-white` | `text` |
| Focus | `border-blue-500 ring-2 ring-blue-200` | `bg-white` | `text` |
| Error | `border-red-500` | `bg-white` | `text` |
| Disabled | `border-gray-200` | `bg-gray-100` | `not-allowed` |

### Input Format Rules

| Rule | Implementation | Purpose |
|------|----------------|---------|
| Uppercase | Convert on input | Consistent format |
| Trim Spaces | Remove leading/trailing | Clean input |
| Max Length | Limit to 20 characters | Prevent abuse |
| Alphanumeric | Allow only letters/numbers | Valid codes only |

### Input Validation Flow

```
User Types → onChange Event
    │
    ▼
Convert to Uppercase
    │
    ▼
Trim Whitespace
    │
    ▼
Validate Format (Optional)
    │
    ▼
Update Parent State
```

### Accessibility Features

| Feature | Implementation |
|---------|----------------|
| Label | Associate with label element or aria-label |
| Placeholder | Provide clear placeholder text |
| Error Message | Link error message with aria-describedby |
| Disabled State | Properly disable and communicate state |

### Expected Outcome
- Functional text input for coupon codes
- Automatic uppercase conversion
- Error state styling capability
- Disabled state during validation

### Verification Checklist
- [ ] `frontend/components/storefront/cart/Coupon/CouponInput.tsx` file created
- [ ] Component accepts required props (value, onChange)
- [ ] Input converts text to uppercase automatically
- [ ] Input trims whitespace from values
- [ ] Error styling applies when error prop is true
- [ ] Disabled state works correctly
- [ ] Focus styles applied properly
- [ ] Accessibility features implemented

---

## Task 73: Create Apply Coupon Button

### Overview
Create the ApplyCouponButton component that triggers coupon validation when clicked. This button provides clear visual feedback for loading states and disabled states, ensuring users understand when they can apply a coupon code.

### Dependencies
- Task 72: Create Coupon Input

### Instructions

1. **Create ApplyCouponButton component file**
   - Create `ApplyCouponButton.tsx` in `components/storefront/cart/Coupon/` directory
   - Set up React functional component structure

2. **Define component props interface**
   - Create `ApplyCouponButtonProps` interface
   - Include `onClick` prop (function) for click handler
   - Include `disabled` prop (boolean) for disabled state
   - Include `loading` prop (boolean) for loading state

3. **Implement button element**
   - Create HTML button element with type="button"
   - Set button text ("Apply" or "Apply Coupon")
   - Connect onClick prop to button click event
   - Set disabled attribute based on disabled prop

4. **Apply button styling**
   - Use primary brand color (bg-blue-600)
   - Set text color to white
   - Add padding for comfortable click target
   - Add border-radius for rounded corners
   - Apply hover effect (bg-blue-700)

5. **Implement loading state**
   - Show loading spinner when loading prop is true
   - Change button text to "Applying..." during loading
   - Disable button interaction during loading
   - Replace text with spinner icon (optional)

6. **Implement disabled state**
   - Reduce opacity when disabled
   - Change cursor to not-allowed
   - Remove hover effects when disabled
   - Use gray background color

7. **Add transition effects**
   - Smooth transition for background color changes
   - Smooth transition for opacity changes
   - Add subtle scale effect on hover (optional)

### Component Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| onClick | () => void | Yes | - | Click handler function |
| disabled | boolean | No | false | Disable button |
| loading | boolean | No | false | Show loading state |
| children | ReactNode | No | "Apply" | Button text |

### Button State Styling

| State | Background | Text | Cursor | Opacity |
|-------|------------|------|--------|---------|
| Normal | `bg-blue-600` | `text-white` | `pointer` | `100%` |
| Hover | `bg-blue-700` | `text-white` | `pointer` | `100%` |
| Loading | `bg-blue-600` | `text-white` | `wait` | `100%` |
| Disabled | `bg-gray-400` | `text-white` | `not-allowed` | `60%` |

### Button Content by State

```
Normal State
├── Text: "Apply"
└── Icon: None

Loading State
├── Text: "Applying..."
└── Icon: Spinner (optional)

Disabled State
├── Text: "Apply"
└── Icon: None (grayed out)
```

### Button Sizing

| Size | Padding | Font Size | Use Case |
|------|---------|-----------|----------|
| Default | `px-4 py-2` | `text-sm` | Mobile |
| Medium | `px-6 py-2.5` | `text-base` | Desktop |

### Loading Indicator Options

| Type | Implementation | Visual |
|------|----------------|--------|
| Text Only | Change text to "Applying..." | Simple |
| Spinner | SVG or CSS spinner animation | Professional |
| Dots | Animated dot sequence | Minimal |

### Expected Outcome
- Functional button to trigger coupon application
- Clear loading state feedback
- Disabled state when input is empty or invalid
- Smooth hover and transition effects

### Verification Checklist
- [ ] `frontend/components/storefront/cart/Coupon/ApplyCouponButton.tsx` file created
- [ ] Button accepts onClick, disabled, and loading props
- [ ] Loading state shows spinner or "Applying..." text
- [ ] Disabled state prevents interaction
- [ ] Hover effect applied when enabled
- [ ] Button styled with brand colors
- [ ] Transitions smooth and performant
- [ ] Component exports properly

---

## Task 74: Create Coupon Validation

### Overview
Create the coupon validation logic that communicates with the backend API to verify coupon codes. This includes API integration, error handling, state management, and triggering appropriate success or error displays based on validation results.

### Dependencies
- Task 73: Create Apply Coupon Button
- Backend coupon validation endpoint available

### Instructions

1. **Create validation utility file**
   - Create `validateCoupon.ts` or similar in `lib/api/` directory
   - Alternatively, add validation logic directly to cart state management

2. **Define coupon validation function**
   - Create async function that accepts coupon code as parameter
   - Function should return validation result (success/error)
   - Include discount amount and type in success response

3. **Implement API call**
   - Make POST request to `/api/coupons/validate` endpoint
   - Send coupon code in request body
   - Include cart items or subtotal for validation (if required)
   - Set appropriate headers (Content-Type, Authorization)

4. **Handle API response**
   - Parse success response with coupon details
   - Extract discount type (percentage or fixed amount)
   - Extract discount value (e.g., 10% or ₨500)
   - Extract coupon metadata (expiry, description, etc.)

5. **Handle API errors**
   - Catch network errors and connection issues
   - Parse validation errors (expired, invalid, already used)
   - Return user-friendly error messages
   - Handle 400, 404, and 500 status codes appropriately

6. **Integrate with cart state**
   - Update cart state with applied coupon on success
   - Store coupon code, discount amount, and type
   - Trigger recalculation of cart totals
   - Update UI to show applied coupon

7. **Add loading state management**
   - Set loading state before API call
   - Clear loading state after response
   - Disable input and button during validation
   - Show loading indicator to user

8. **Implement validation rules (client-side)**
   - Check if coupon code is not empty
   - Validate code format before API call
   - Prevent duplicate applications
   - Check if another coupon is already applied

### Validation Flow Diagram

```
User Clicks Apply
    │
    ▼
Validate Input Format
    │
    ├─── Invalid Format
    │       │
    │       ▼
    │   Show Error Message
    │
    ▼
Set Loading State
    │
    ▼
Make API Call
    │
    ├─────────────┬─────────────┐
    ▼             ▼             ▼
Success       Invalid        Error
    │             │             │
    ▼             ▼             ▼
Update State  Show Error    Show Error
    │
    ▼
Show Success
    │
    ▼
Recalculate Totals
```

### API Endpoint Specifications

| Method | Endpoint | Request Body | Response |
|--------|----------|--------------|----------|
| POST | `/api/coupons/validate` | `{ code: string, cartTotal?: number }` | `{ valid: boolean, discount: object, message: string }` |

### Request Example

```
POST /api/coupons/validate
Content-Type: application/json

{
  "code": "WELCOME10",
  "cartTotal": 5000
}
```

### Success Response Structure

```
{
  "valid": true,
  "coupon": {
    "code": "WELCOME10",
    "discountType": "percentage",
    "discountValue": 10,
    "description": "10% off your first order"
  },
  "message": "Coupon applied successfully!"
}
```

### Error Response Structure

```
{
  "valid": false,
  "error": "COUPON_EXPIRED",
  "message": "This coupon has expired"
}

OR

{
  "valid": false,
  "error": "COUPON_INVALID",
  "message": "Invalid coupon code"
}

OR

{
  "valid": false,
  "error": "MINIMUM_NOT_MET",
  "message": "Minimum order value of ₨1,000 required"
}
```

### Error Code Mappings

| Error Code | User Message | Action |
|------------|--------------|--------|
| COUPON_INVALID | "Invalid coupon code. Please check and try again." | Show error message |
| COUPON_EXPIRED | "This coupon has expired." | Show error message |
| COUPON_USED | "You have already used this coupon." | Show error message |
| MINIMUM_NOT_MET | "Minimum order value of ₨X required." | Show error with minimum |
| ALREADY_APPLIED | "A coupon is already applied to this cart." | Show error message |
| NETWORK_ERROR | "Unable to validate coupon. Please try again." | Show error, retry option |

### State Management Updates

| State Property | Type | Update On |
|----------------|------|-----------|
| appliedCoupon | Coupon object \| null | Success |
| couponError | string \| null | Error |
| isValidatingCoupon | boolean | During API call |
| discountAmount | number | Success |

### Client-Side Validation Rules

| Rule | Check | Error Message |
|------|-------|---------------|
| Empty Code | `code.trim() === ""` | "Please enter a coupon code" |
| Already Applied | `appliedCoupon !== null` | "Remove current coupon to apply new one" |
| Format | Regex pattern match | "Invalid coupon format" |

### Expected Outcome
- Functional API integration for coupon validation
- Proper error handling and user feedback
- State management updates on success
- Loading states during validation

### Verification Checklist
- [ ] Validation function created and exported
- [ ] API endpoint integrated correctly
- [ ] Success response parsed and stored
- [ ] Error responses handled appropriately
- [ ] Loading state managed during API call
- [ ] Cart state updated on successful validation
- [ ] Client-side validation rules implemented
- [ ] Error messages user-friendly and clear
- [ ] Network error handling implemented

---

## Task 75: Create Coupon Success

### Overview
Create the AppliedCoupon component that displays successfully applied coupon information, including the coupon code, discount description, and savings amount. This provides clear feedback to users about their applied discount.

### Dependencies
- Task 74: Create Coupon Validation

### Instructions

1. **Create AppliedCoupon component file**
   - Create `AppliedCoupon.tsx` in `components/storefront/cart/Coupon/` directory
   - Set up React functional component structure

2. **Define component props interface**
   - Create `AppliedCouponProps` interface
   - Include `coupon` prop (object with code, discountType, discountValue)
   - Include `savings` prop (number) for calculated savings amount
   - Include `onRemove` prop (function) for remove button handler

3. **Implement success message container**
   - Create styled div for success display
   - Use green color scheme for success indication
   - Add border or background for visual distinction

4. **Display coupon code**
   - Show applied coupon code prominently
   - Format code in uppercase or bold text
   - Add code icon or badge (optional)

5. **Display discount description**
   - Show human-readable discount description
   - Format: "10% off" or "₨500 off"
   - Use secondary text color and size

6. **Display savings amount**
   - Show calculated savings in LKR (₨)
   - Format: "You save: ₨500"
   - Use success green color for emphasis

7. **Add remove button**
   - Include small remove/close button or link
   - Position in top-right corner or at end
   - Connect to onRemove handler
   - Style as text link or icon button

8. **Add success icon**
   - Include checkmark or success icon
   - Position before coupon code or at start
   - Use green color to match theme

### Component Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| coupon | `{ code: string, discountType: string, discountValue: number }` | Yes | Coupon details |
| savings | number | Yes | Calculated savings in LKR |
| onRemove | () => void | Yes | Remove coupon handler |

### Success Display Structure

```
┌─────────────────────────────────────────┐
│ ✓ WELCOME10                         ✕  │
│   10% discount applied                  │
│   You save: ₨500                       │
└─────────────────────────────────────────┘
```

### Styling Specifications

| Element | Styling | Purpose |
|---------|---------|---------|
| Container | `bg-green-50 border-green-200` | Success indication |
| Code | `text-green-800 font-semibold` | Emphasis |
| Description | `text-green-700 text-sm` | Secondary info |
| Savings | `text-green-800 font-medium` | Highlight savings |
| Icon | `text-green-600` | Visual confirmation |

### Discount Description Formatting

| Discount Type | Value | Display Format |
|---------------|-------|----------------|
| Percentage | 10 | "10% discount applied" |
| Fixed Amount | 500 | "₨500 discount applied" |
| Free Shipping | - | "Free shipping applied" |

### Remove Button Options

| Style | Implementation | Visual |
|-------|----------------|--------|
| Text Link | "Remove" text with hover | Minimal |
| Icon Button | X icon button | Clean |
| Text + Icon | "Remove" with X icon | Clear |

### Layout Variations

```
Horizontal Layout (Desktop)
┌─────────────────────────────────────────┐
│ ✓ CODE  |  Description  |  Savings  [X] │
└─────────────────────────────────────────┘

Vertical Layout (Mobile)
┌───────────────────────┐
│ ✓ CODE            [X] │
│ Description           │
│ Savings              │
└───────────────────────┘
```

### Expected Outcome
- Clear visual feedback for applied coupon
- Display of coupon code and discount details
- Prominent display of savings amount
- Easy removal option for users

### Verification Checklist
- [ ] `frontend/components/storefront/cart/Coupon/AppliedCoupon.tsx` file created
- [ ] Component accepts coupon, savings, and onRemove props
- [ ] Coupon code displayed prominently
- [ ] Discount description formatted correctly
- [ ] Savings amount shown in LKR (₨)
- [ ] Success icon included
- [ ] Remove button functional
- [ ] Green success color scheme applied
- [ ] Responsive layout for mobile and desktop

---

## Task 76: Create Coupon Error

### Overview
Create the CouponError component that displays validation errors and other error messages related to coupon application. This component provides clear, user-friendly error feedback with appropriate styling and optional retry actions.

### Dependencies
- Task 74: Create Coupon Validation

### Instructions

1. **Create CouponError component file**
   - Create `CouponError.tsx` in `components/storefront/cart/Coupon/` directory
   - Set up React functional component structure

2. **Define component props interface**
   - Create `CouponErrorProps` interface
   - Include `message` prop (string) for error message text
   - Include optional `onDismiss` prop (function) for close button
   - Include optional `errorType` prop for different error styles

3. **Implement error message container**
   - Create styled div for error display
   - Use red color scheme for error indication
   - Add border or background for visual distinction

4. **Display error icon**
   - Include error or warning icon
   - Position before error message
   - Use red color to match theme
   - Consider using alert circle or X icon

5. **Display error message**
   - Show clear, user-friendly error text
   - Format message for readability
   - Use appropriate text size and weight

6. **Add dismiss button (optional)**
   - Include small close button or X icon
   - Position in top-right corner
   - Connect to onDismiss handler
   - Auto-hide after timeout (optional)

7. **Implement error types (optional)**
   - Warning style (yellow/orange) for soft errors
   - Error style (red) for hard errors
   - Info style (blue) for informational messages

### Component Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| message | string | Yes | - | Error message text |
| onDismiss | () => void | No | undefined | Dismiss handler |
| errorType | "error" \| "warning" \| "info" | No | "error" | Error severity type |

### Error Display Structure

```
┌─────────────────────────────────────────┐
│ ⚠ Invalid coupon code. Please check    │
│   and try again.                    ✕  │
└─────────────────────────────────────────┘
```

### Error Type Styling

| Type | Background | Border | Icon Color | Text Color |
|------|------------|--------|------------|------------|
| Error | `bg-red-50` | `border-red-200` | `text-red-600` | `text-red-800` |
| Warning | `bg-yellow-50` | `border-yellow-200` | `text-yellow-600` | `text-yellow-800` |
| Info | `bg-blue-50` | `border-blue-200` | `text-blue-600` | `text-blue-800` |

### Common Error Messages

| Scenario | Message |
|----------|---------|
| Invalid Code | "Invalid coupon code. Please check and try again." |
| Expired | "This coupon has expired." |
| Already Used | "You have already used this coupon." |
| Minimum Not Met | "Minimum order value of ₨X required for this coupon." |
| Network Error | "Unable to validate coupon. Please check your connection and try again." |

### Error Message Formatting

```
Short Error
├── Single line message
└── Icon + Text + Dismiss

Long Error
├── Multi-line message
├── Icon at top
└── Text wrapped, dismiss at top-right
```

### Auto-Dismiss Behavior (Optional)

| Duration | Use Case |
|----------|----------|
| 5 seconds | Temporary errors (network issues) |
| 10 seconds | Important errors (invalid code) |
| No auto-dismiss | Critical errors requiring action |

### Accessibility Features

| Feature | Implementation |
|---------|----------------|
| Role | `role="alert"` for screen readers |
| Icon Alt | Descriptive alt text for error icon |
| Focus Management | Focus dismiss button when shown |
| Color Independence | Don't rely solely on color |

### Expected Outcome
- Clear error message display with red styling
- User-friendly error text
- Optional dismiss functionality
- Proper visual distinction from success state

### Verification Checklist
- [ ] `frontend/components/storefront/cart/Coupon/CouponError.tsx` file created
- [ ] Component accepts message prop
- [ ] Error icon displayed before message
- [ ] Red error color scheme applied
- [ ] Dismiss button functional (if included)
- [ ] Error text readable and clear
- [ ] Accessibility features implemented
- [ ] Component exports properly

---

## Task 77: Create Remove Coupon

### Overview
Implement the remove coupon functionality that allows users to deapply an active coupon from their cart. This includes updating cart state, recalculating totals, and providing appropriate UI feedback when a coupon is removed.

### Dependencies
- Task 75: Create Coupon Success

### Instructions

1. **Create remove coupon function**
   - Add function to cart state management or context
   - Name function `removeCoupon` or similar
   - Function should clear applied coupon from state

2. **Update cart state**
   - Set appliedCoupon to null
   - Clear coupon discount amount
   - Clear coupon-related error messages
   - Reset coupon input field value

3. **Recalculate cart totals**
   - Remove discount amount from total
   - Recalculate subtotal, tax, and grand total
   - Update displayed amounts in UI
   - Trigger state update for dependent components

4. **Update UI display**
   - Hide AppliedCoupon component
   - Show CouponInput and ApplyCouponButton again
   - Clear any success or error messages
   - Reset input field to empty state

5. **Add confirmation (optional)**
   - Show confirmation dialog before removing
   - "Are you sure you want to remove this coupon?"
   - Provide "Yes, Remove" and "Cancel" options
   - Skip confirmation for better UX (recommended)

6. **Handle remove errors (optional)**
   - Catch any state update errors
   - Show error message if removal fails
   - Log errors for debugging
   - Provide retry option

7. **Add analytics tracking (optional)**
   - Track coupon removal events
   - Log coupon code and reason
   - Send to analytics service
   - Use for improving coupon strategy

### Remove Coupon Flow

```
User Clicks Remove
    │
    ▼
Clear Applied Coupon from State
    │
    ▼
Recalculate Cart Totals
    │
    ▼
Update UI Display
    │
    ├─────────────┬─────────────┐
    ▼             ▼             ▼
Hide Success   Show Input   Clear Messages
    │             │             │
    └─────────────┴─────────────┘
              │
              ▼
         Show Default UI
```

### State Updates

| Property | Before Remove | After Remove |
|----------|---------------|--------------|
| appliedCoupon | `{ code: "...", ... }` | `null` |
| discountAmount | `500` | `0` |
| couponError | May have message | `null` |
| inputValue | "WELCOME10" | `""` |

### Calculation Updates

```
Before Remove
├── Subtotal: ₨5,000
├── Discount: -₨500
└── Total: ₨4,500

After Remove
├── Subtotal: ₨5,000
├── Discount: ₨0
└── Total: ₨5,000
```

### UI State Transitions

| Component | Visible Before | Visible After |
|-----------|----------------|---------------|
| CouponInput | Hidden | Visible |
| ApplyCouponButton | Hidden | Visible |
| AppliedCoupon | Visible | Hidden |
| CouponError | May be visible | Hidden |

### Remove Coupon Function Signature

```
removeCoupon(): void

OR (with confirmation)

removeCoupon(confirmed: boolean): void
```

### Confirmation Dialog (Optional)

```
┌──────────────────────────────────┐
│  Remove Coupon?                  │
│                                  │
│  Are you sure you want to remove │
│  the coupon "WELCOME10"?         │
│  You'll lose ₨500 discount.     │
│                                  │
│  [Cancel]  [Yes, Remove]        │
└──────────────────────────────────┘
```

### Analytics Event (Optional)

```
Event: coupon_removed
Properties: {
  couponCode: "WELCOME10",
  discountAmount: 500,
  cartTotal: 5000,
  timestamp: "2026-01-26T10:30:00Z"
}
```

### Expected Outcome
- Functional remove coupon capability
- Proper state cleanup when coupon removed
- Recalculated cart totals without discount
- UI returns to default coupon input state

### Verification Checklist
- [ ] Remove coupon function implemented
- [ ] Applied coupon cleared from state
- [ ] Discount amount removed from calculations
- [ ] Cart totals recalculated correctly
- [ ] AppliedCoupon component hidden after removal
- [ ] CouponInput and button shown again
- [ ] Input field reset to empty
- [ ] No error messages displayed after removal
- [ ] Function accessible from AppliedCoupon component

---

## Summary

This document established the complete coupon functionality for the shopping cart, including input, validation, success display, error handling, and removal capabilities. Customers can now apply discount codes to their orders and receive clear feedback throughout the process.

### Completed Tasks
1. ✓ Created CouponSection container component
2. ✓ Created CouponInput with validation and styling
3. ✓ Created ApplyCouponButton with loading states
4. ✓ Implemented coupon validation API integration
5. ✓ Created AppliedCoupon success display
6. ✓ Created CouponError message display
7. ✓ Implemented remove coupon functionality

### Next Steps
Proceed to [02_Tasks-78-84_Summary-Checkout.md](02_Tasks-78-84_Summary-Checkout.md) to create the cart summary box with totals breakdown and checkout button.
