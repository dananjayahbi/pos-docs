# Tasks 19-27: Coupon Input, Badge, and Cart Sections

> **Phase:** 08 - Webstore & E-Commerce Platform  
> **SubPhase:** 14 - Marketing Features  
> **Group:** B - Coupon UI Components  
> **Document:** 01 of 02  
> **Tasks Covered:** 19, 20, 21, 22, 23, 24, 25, 26, 27

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-28-34_Summary-List-Verify.md](02_Tasks-28-34_Summary-List-Verify.md)

---

## Document Overview

This document covers the creation of coupon input components, applied coupon badges, and cart coupon sections. It establishes the foundational UI for coupon application with real-time validation, loading states, error handling, success feedback, and discount display. Includes cart integration for coupon application.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 19 | Create CouponInput Component | Medium | 45 min |
| 20 | Create CouponInput Validation | Medium | 40 min |
| 21 | Create CouponInput Loading | Low | 20 min |
| 22 | Create CouponInput Error | Low | 25 min |
| 23 | Create CouponInput Success | Low | 25 min |
| 24 | Create Applied Coupon Badge | Medium | 35 min |
| 25 | Create Coupon Remove Button | Low | 20 min |
| 26 | Create Discount Display | Low | 30 min |
| 27 | Create Cart Coupon Section | Medium | 45 min |

---

## Task 19: Create CouponInput Component

### Overview
Create the base CouponInput component for entering and applying coupon codes. This component provides an input field with an apply button, handles user input, and triggers coupon validation and application. Supports controlled or uncontrolled form patterns with proper state management.

### Dependencies
- Task 18: Create apply coupon API endpoint (from Group A)
- Form components from previous phases
- Button component from UI library
- Input component from UI library

### Instructions

1. **Create component directory structure**
   - Navigate to `frontend/components/marketing/` directory
   - Create new directory named `coupons`
   - This will house all coupon-related UI components

2. **Create CouponInput component file**
   - Create `CouponInput.tsx` in `components/marketing/coupons/` directory
   - Set up TypeScript React functional component structure

3. **Define component props interface**
   - Create `CouponInputProps` interface
   - Include `onApply` callback function: `(code: string) => void`
   - Include `isLoading` boolean for loading state
   - Include `error` string for error messages
   - Include `success` boolean for success state
   - Include optional `placeholder` string
   - Include optional `disabled` boolean

4. **Implement input field structure**
   - Create input element for coupon code entry
   - Apply uppercase transformation for codes
   - Set placeholder text (default: "Enter coupon code")
   - Bind input value to local state or controlled value

5. **Implement apply button**
   - Create button adjacent to input field
   - Label as "Apply" or "Apply Coupon"
   - Trigger onApply callback with current input value
   - Disable during loading or when input is empty

6. **Add form handling**
   - Wrap input and button in form element
   - Handle form submission to trigger apply action
   - Prevent default form submission behavior
   - Clear input after successful application (optional)

7. **Add input validation rules**
   - Accept alphanumeric characters and hyphens
   - Convert input to uppercase automatically
   - Trim whitespace from input
   - Validate minimum length (e.g., 3 characters)

8. **Apply component styling**
   - Use flexbox for horizontal layout
   - Style input with border and padding
   - Style button with primary brand colors
   - Add focus states for accessibility
   - Ensure responsive design for mobile

### Component Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| onApply | (code: string) => void | Yes | - | Callback when apply is clicked |
| isLoading | boolean | No | false | Loading state indicator |
| error | string \| null | No | null | Error message to display |
| success | boolean | No | false | Success state indicator |
| placeholder | string | No | "Enter coupon code" | Input placeholder text |
| disabled | boolean | No | false | Disable input and button |

### Input Field Specifications

| Property | Value | Purpose |
|----------|-------|---------|
| Type | text | Standard text input |
| Transform | uppercase | Standardize code format |
| Trim | On blur/submit | Remove extra whitespace |
| Pattern | [A-Z0-9-]+ | Alphanumeric and hyphens |
| MaxLength | 20 | Reasonable code length |

### Layout Structure

```
┌─────────────────────────────────────────┐
│  ┌────────────────────┐  ┌──────────┐  │
│  │ ENTER COUPON CODE  │  │  APPLY   │  │
│  └────────────────────┘  └──────────┘  │
└─────────────────────────────────────────┘
```

### State Management

| State | Type | Purpose |
|-------|------|---------|
| inputValue | string | Current input value |
| isFocused | boolean | Focus state for styling |

### Form Submission Flow

```
User Types → Input State Updates
    ↓
Click Apply / Press Enter
    ↓
Validate Input (not empty, valid format)
    ↓
Call onApply(code)
    ↓
Parent handles API call
```

### Expected Outcome
- Functional coupon input component
- Input accepts and formats coupon codes
- Apply button triggers callback with code
- Ready for validation and loading states
- Proper TypeScript typing

### Verification Checklist
- [ ] Component file created at correct location
- [ ] Props interface defined with all required fields
- [ ] Input field accepts and formats text correctly
- [ ] Apply button triggers onApply callback
- [ ] Form submission handled properly
- [ ] Basic styling applied
- [ ] Component exports properly

---

## Task 20: Create CouponInput Validation

### Overview
Implement real-time validation for the CouponInput component with debounced checking, visual feedback, and validation states. Provides immediate user feedback about coupon code format validity before submission, improving user experience and reducing failed API calls.

### Dependencies
- Task 19: Create CouponInput Component

### Instructions

1. **Add validation state management**
   - Create state for validation status (idle, validating, valid, invalid)
   - Create state for validation message
   - Track previous validation results to avoid duplicate checks

2. **Implement debounced validation**
   - Use debounce hook or utility (500ms delay recommended)
   - Trigger validation after user stops typing
   - Cancel pending validation on input change

3. **Create validation logic**
   - Check minimum code length (e.g., 3 characters)
   - Verify code format (alphanumeric with optional hyphens)
   - Check against excluded characters or patterns
   - Return validation result with message

4. **Add validation API check (optional)**
   - Call API to pre-validate code format
   - Check if code exists without applying it
   - Handle API errors gracefully

5. **Implement visual feedback**
   - Show validation icon (checkmark for valid, X for invalid)
   - Display icon inside or adjacent to input field
   - Add color coding (green for valid, red for invalid)
   - Update border color based on validation state

6. **Display validation messages**
   - Show helper text below input
   - Display format requirements when invalid
   - Show "Valid code" message when format is correct
   - Clear messages during typing

7. **Integrate with apply button**
   - Disable apply button for invalid codes
   - Enable apply button only for valid codes
   - Maintain loading state priority over validation

### Validation States

| State | Visual Indicator | Button State | Message |
|-------|------------------|--------------|---------|
| Idle | None | Enabled if not empty | None |
| Validating | Loading spinner | Disabled | "Checking..." |
| Valid | Green checkmark | Enabled | "Valid format" |
| Invalid | Red X | Disabled | "Invalid code format" |

### Validation Rules

| Rule | Requirement | Error Message |
|------|-------------|---------------|
| Min Length | 3 characters | "Code must be at least 3 characters" |
| Max Length | 20 characters | "Code is too long" |
| Format | A-Z, 0-9, hyphen | "Code can only contain letters, numbers, and hyphens" |
| Empty | Not blank | "Please enter a coupon code" |

### Debounce Timing

```
User Types: A V U R U D U
            ↓ ↓ ↓ ↓ ↓ ↓ ↓
Timer Reset: [500ms timer resets with each keystroke]
            ↓
User Stops:  ← 500ms passed
            ↓
Validate:   Check "AVURUDU"
            ↓
Display:    Show validation result
```

### Validation Flow

```
Input Change
    ↓
Reset Validation State
    ↓
Start Debounce Timer (500ms)
    ↓
Timer Completes
    ↓
Validate Input Format
    ↓
Update Validation State
    ↓
Display Visual Feedback
```

### Visual Feedback Design

| Element | Valid State | Invalid State |
|---------|-------------|---------------|
| Border | border-green-500 | border-red-500 |
| Icon | ✓ (green) | ✗ (red) |
| Text | text-green-600 | text-red-600 |
| Background | bg-green-50 | bg-red-50 |

### Expected Outcome
- Real-time validation with debounced checking
- Visual feedback for valid/invalid codes
- Validation messages guide user input
- Apply button state reflects validation
- Improved user experience with instant feedback

### Verification Checklist
- [ ] Debounced validation implemented (500ms)
- [ ] Validation state managed correctly
- [ ] Visual feedback displays for valid/invalid states
- [ ] Validation messages shown below input
- [ ] Apply button disabled for invalid codes
- [ ] Format validation rules enforced
- [ ] No performance issues with rapid typing

---

## Task 21: Create CouponInput Loading State

### Overview
Implement loading state handling for the CouponInput component during coupon application API calls. Provides visual feedback to users that their coupon is being processed, prevents duplicate submissions, and improves perceived performance.

### Dependencies
- Task 19: Create CouponInput Component

### Instructions

1. **Accept loading prop**
   - Use `isLoading` prop from component interface
   - Prop controlled by parent component during API call
   - Boolean value indicating loading state

2. **Disable input during loading**
   - Set input field `disabled` attribute when loading
   - Prevent user from modifying code during processing
   - Apply disabled styling to input

3. **Disable apply button during loading**
   - Set button `disabled` attribute when loading
   - Prevent multiple concurrent API calls
   - Maintain button visibility for context

4. **Add loading spinner to button**
   - Display spinner icon inside button when loading
   - Replace or accompany button text with spinner
   - Use animated SVG or icon component for spinner

5. **Update button text during loading**
   - Change text from "Apply" to "Applying..."
   - Provide clear feedback about current action
   - Keep text visible alongside spinner (optional)

6. **Apply loading visual styles**
   - Reduce opacity of disabled elements
   - Add subtle animation to loading spinner
   - Maintain accessible cursor (not-allowed or wait)

7. **Prevent form submission during loading**
   - Block form submit handler when loading
   - Early return from onApply if already loading
   - Avoid nested API calls

### Loading State Behavior

| Element | Loading State | Normal State |
|---------|---------------|--------------|
| Input Field | Disabled, opacity-60 | Enabled, opacity-100 |
| Apply Button | Disabled, shows spinner | Enabled, normal |
| Button Text | "Applying..." | "Apply" |
| Form Submit | Blocked | Allowed |

### Button States Visual

```
Normal State:
┌──────────┐
│  APPLY   │
└──────────┘

Loading State:
┌──────────────┐
│ ⟳ Applying...│
└──────────────┘
```

### Loading Spinner Options

| Type | Implementation | Performance |
|------|----------------|-------------|
| CSS Animation | Rotating border | Excellent |
| SVG Icon | Animated SVG | Good |
| Icon Component | Library spinner | Good |
| Lottie Animation | Complex animation | Moderate |

### Loading Flow

```
User Clicks Apply
    ↓
Parent sets isLoading = true
    ↓
Input disabled
Button shows spinner
    ↓
API call in progress...
    ↓
API returns response
    ↓
Parent sets isLoading = false
    ↓
Component returns to normal state
```

### Accessibility Considerations

| Feature | Implementation |
|---------|----------------|
| Loading Announcement | aria-live region announces "Applying coupon" |
| Button Label | aria-label describes loading state |
| Disabled State | Proper disabled attribute for screen readers |
| Keyboard Users | Focus maintained, submission blocked |

### Expected Outcome
- Loading state clearly communicated to users
- Input and button disabled during processing
- Loading spinner provides visual feedback
- Multiple submissions prevented
- Accessible loading experience

### Verification Checklist
- [ ] Loading prop accepted and handled
- [ ] Input field disabled when loading
- [ ] Apply button disabled when loading
- [ ] Loading spinner displays in button
- [ ] Button text updates to "Applying..."
- [ ] Form submission blocked during loading
- [ ] Loading state accessible to screen readers

---

## Task 22: Create CouponInput Error Display

### Overview
Implement error state handling and display for the CouponInput component. Shows error messages from failed coupon application attempts, including invalid codes, expired coupons, usage limit errors, and API failures. Provides clear, actionable feedback to help users resolve issues.

### Dependencies
- Task 19: Create CouponInput Component

### Instructions

1. **Accept error prop**
   - Use `error` prop from component interface (string | null)
   - Prop controlled by parent component after API response
   - Display when error value is present

2. **Create error message container**
   - Add element below input field for error display
   - Apply error styling (red color, error icon)
   - Show only when error prop has value

3. **Display error message text**
   - Render error message string from prop
   - Use clear, user-friendly language
   - Keep messages concise and actionable

4. **Add error icon**
   - Show error icon (exclamation, X, or warning icon) with message
   - Position icon before or inline with text
   - Use red color for error state

5. **Apply error styling to input**
   - Add red border to input field when error exists
   - Add red focus ring on input focus
   - Optional: light red background tint

6. **Implement error clearance**
   - Clear error when user starts typing new code
   - Reset error state on input change
   - Remove error styling when cleared

7. **Handle different error types**
   - Format-specific errors from validation
   - Business logic errors (expired, used, minimum not met)
   - API/network errors
   - Generic fallback error message

### Error Types and Messages

| Error Type | Example Message |
|------------|-----------------|
| Invalid Code | "Coupon code 'XYZ123' is not valid" |
| Expired | "This coupon expired on Dec 31, 2025" |
| Already Used | "You have already used this coupon" |
| Minimum Not Met | "Cart total must be at least ₨5,000 to use this coupon" |
| Not Applicable | "This coupon is not valid for items in your cart" |
| Network Error | "Unable to apply coupon. Please try again." |

### Error Display Structure

```
┌─────────────────────────────────────┐
│  ┌────────────────┐  ┌──────────┐  │
│  │ ENTER CODE     │  │  APPLY   │  │ ← Red border
│  └────────────────┘  └──────────┘  │
│  ⚠ Coupon code is not valid        │ ← Error message
└─────────────────────────────────────┘
```

### Error Styling Specifications

| Element | Property | Value |
|---------|----------|-------|
| Input Border | border-color | border-red-500 |
| Error Text | color | text-red-600 |
| Error Icon | color | text-red-500 |
| Background | background | bg-red-50 (optional) |
| Font Size | size | text-sm |

### Error Clearance Flow

```
Error Displayed
    ↓
User Types in Input
    ↓
onChange Handler Triggered
    ↓
Clear Error State
    ↓
Remove Error Styling
    ↓
Hide Error Message
```

### Error Message Guidelines

| Guideline | Example |
|-----------|---------|
| Be Specific | "Invalid code" → "Coupon 'SAVE20' not found" |
| Provide Action | "Error" → "Please check the code and try again" |
| Show Context | Include coupon code in message when relevant |
| Be Friendly | Avoid technical jargon |
| Be Concise | One or two sentences maximum |

### Accessibility for Errors

| Feature | Implementation |
|---------|----------------|
| ARIA Live Region | Announce error to screen readers |
| Error ID | Link input to error with aria-describedby |
| Error Role | Use role="alert" for error container |
| Focus Management | Keep focus on input after error |

### Expected Outcome
- Clear error messages displayed below input
- Error styling applied to input field
- Error icon provides visual indicator
- Error clears when user types
- Accessible error announcements
- Helpful, actionable error messages

### Verification Checklist
- [ ] Error prop accepted and handled
- [ ] Error message displays below input
- [ ] Error icon shown with message
- [ ] Input border turns red when error exists
- [ ] Error clears on input change
- [ ] Error messages are clear and helpful
- [ ] Error accessible to screen readers

---

## Task 23: Create CouponInput Success State

### Overview
Implement success state handling for the CouponInput component after successful coupon application. Provides positive visual feedback, displays success message, and optionally transitions to the applied coupon badge display. Creates a smooth, satisfying user experience for successful coupon application.

### Dependencies
- Task 19: Create CouponInput Component

### Instructions

1. **Accept success prop**
   - Use `success` prop from component interface (boolean)
   - Prop controlled by parent after successful API response
   - Triggers success state display

2. **Display success message**
   - Show success message below or near input
   - Use message like "Coupon applied successfully!"
   - Display temporarily (2-3 seconds) before clearing

3. **Add success icon**
   - Show success icon (checkmark) with message
   - Use green color for success state
   - Position icon before or inline with text

4. **Apply success styling to input**
   - Add green border to input field when success
   - Add green background tint (optional)
   - Apply success state only briefly before transition

5. **Implement success animation**
   - Add fade-in animation for success message
   - Consider checkmark bounce or scale animation
   - Keep animations subtle and quick (200-300ms)

6. **Clear or disable input after success**
   - Option A: Clear input value for next coupon
   - Option B: Keep value and disable input
   - Option C: Hide input and show badge only

7. **Transition to applied badge**
   - After brief success display, hide input component
   - Show AppliedCouponBadge component instead
   - Use fade transition between states
   - Coordinate with parent component state

8. **Handle success clearance**
   - Auto-clear success message after 2-3 seconds
   - Reset success state for next application
   - Prepare component for reuse if needed

### Success States

| State | Display | Duration | Next State |
|-------|---------|----------|------------|
| Applying | Loading spinner | Variable | Success or Error |
| Success Message | "Coupon applied!" | 2-3 seconds | Badge Display |
| Badge Display | Applied badge | Persistent | Until removed |

### Success Display Structure

```
Initial:
┌─────────────────────────────────────┐
│  ┌────────────────┐  ┌──────────┐  │
│  │ AVURUDU20      │  │  APPLY   │  │
│  └────────────────┘  └──────────┘  │
└─────────────────────────────────────┘

Success (2 seconds):
┌─────────────────────────────────────┐
│  ┌────────────────┐  ┌──────────┐  │
│  │ AVURUDU20      │  │  APPLY   │  │ ← Green border
│  └────────────────┘  └──────────┘  │
│  ✓ Coupon applied successfully!     │ ← Green text
└─────────────────────────────────────┘

After Transition:
┌─────────────────────────────────────┐
│  ┌─────────────────────────────┐   │
│  │ AVURUDU20  ₨500 off  [×]   │   │ ← Badge component
│  └─────────────────────────────┘   │
└─────────────────────────────────────┘
```

### Success Styling Specifications

| Element | Property | Value |
|---------|----------|-------|
| Input Border | border-color | border-green-500 |
| Success Text | color | text-green-600 |
| Success Icon | color | text-green-500 |
| Background | background | bg-green-50 (optional) |
| Animation | transition | 200ms ease-in-out |

### Success Flow Diagram

```
Apply Button Clicked
    ↓
isLoading = true
    ↓
API Call Succeeds
    ↓
isLoading = false
success = true
    ↓
Display Success Message (2-3s)
    ↓
Transition to Badge
    ↓
Hide Input Component
Show AppliedCouponBadge
```

### Animation Timing

| Phase | Duration | Description |
|-------|----------|-------------|
| Success Appear | 200ms | Fade in success message |
| Success Display | 2-3s | Show success state |
| Success Fade | 300ms | Fade out input component |
| Badge Appear | 300ms | Fade in applied badge |

### Success Message Options

| Message Type | Text | Use Case |
|--------------|------|----------|
| Basic | "Coupon applied!" | Simple confirmation |
| Detailed | "₨500 discount applied!" | Show discount amount |
| With Code | "AVURUDU20 applied successfully!" | Confirm specific code |

### Expected Outcome
- Success state clearly communicated
- Positive visual feedback with green styling
- Success message displays briefly
- Smooth transition to applied badge
- Satisfying user experience

### Verification Checklist
- [ ] Success prop accepted and handled
- [ ] Success message displays with icon
- [ ] Green styling applied to input
- [ ] Success animation plays smoothly
- [ ] Success state auto-clears after 2-3 seconds
- [ ] Transition to badge component works
- [ ] Success accessible to screen readers

---

## Task 24: Create Applied Coupon Badge

### Overview
Create the AppliedCouponBadge component to display successfully applied coupons with the coupon code, discount information, and remove button. This component replaces the input field after successful coupon application and provides clear visibility of active discounts in the cart.

### Dependencies
- Task 19: Create CouponInput Component
- Task 23: Create CouponInput Success State

### Instructions

1. **Create AppliedCouponBadge component file**
   - Create `AppliedCouponBadge.tsx` in `components/marketing/coupons/` directory
   - Set up TypeScript React functional component structure

2. **Define component props interface**
   - Create `AppliedCouponBadgeProps` interface
   - Include `code` string for coupon code
   - Include `discount` string or number for discount amount
   - Include `discountType` enum (percentage, fixed, freeShipping)
   - Include `onRemove` callback function
   - Include optional `className` for custom styling

3. **Implement badge layout**
   - Create container with flex layout
   - Display coupon code prominently
   - Show discount information
   - Add remove button on the right

4. **Display coupon code**
   - Show code in bold or emphasized text
   - Use uppercase formatting
   - Apply brand colors or accent color
   - Make code stand out visually

5. **Implement discount display**
   - Format discount based on type (percentage, fixed)
   - Show "20% off" for percentage discounts
   - Show "₨500 off" for fixed discounts
   - Show "Free Shipping" for shipping discounts
   - Use smaller text than code, but still readable

6. **Add remove button**
   - Create button with X icon or "Remove" text
   - Position on right side of badge
   - Trigger onRemove callback when clicked
   - Style as icon button or text button

7. **Apply badge styling**
   - Use colored background (light green, blue, or brand color)
   - Add border for definition
   - Apply rounded corners
   - Add padding for spacing
   - Ensure contrast for readability

8. **Add hover and interaction states**
   - Highlight remove button on hover
   - Add cursor pointer to remove button
   - Consider subtle hover effect on badge
   - Ensure touch-friendly size for mobile

### Component Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| code | string | Yes | - | Coupon code to display |
| discount | string \| number | Yes | - | Discount value |
| discountType | 'percentage' \| 'fixed' \| 'freeShipping' | Yes | - | Type of discount |
| onRemove | () => void | Yes | - | Callback when remove is clicked |
| className | string | No | "" | Additional CSS classes |

### Badge Layout Structure

```
┌──────────────────────────────────────────┐
│  AVURUDU20  •  ₨500 off         [×]     │
└──────────────────────────────────────────┘
   ↑ Code        ↑ Discount        ↑ Remove
```

### Badge Styling Specifications

| Property | Value | Purpose |
|----------|-------|---------|
| Background | bg-green-50 | Positive color |
| Border | border-green-200 | Subtle definition |
| Text Color | text-green-800 | Readable contrast |
| Padding | px-4 py-2 | Breathing room |
| Border Radius | rounded-md | Modern look |
| Font Weight | font-semibold (code) | Emphasis |

### Discount Formatting

| Type | Input | Display |
|------|-------|---------|
| Percentage | 20 | "20% off" |
| Fixed | 500 | "₨500 off" |
| Free Shipping | null | "Free Shipping" |
| Fixed (LKR) | 1500 | "₨1,500 off" |

### Remove Button Options

| Style | Appearance | Use Case |
|-------|------------|----------|
| Icon Only | [×] | Compact design |
| Icon + Text | [×] Remove | Explicit action |
| Text Only | Remove | Text-heavy design |

### Badge Color Schemes

| Scheme | Background | Border | Text | Use Case |
|--------|------------|--------|------|----------|
| Success Green | bg-green-50 | border-green-200 | text-green-800 | Default |
| Brand Blue | bg-blue-50 | border-blue-200 | text-blue-800 | Brand consistency |
| Accent Purple | bg-purple-50 | border-purple-200 | text-purple-800 | Premium feel |

### Component Hierarchy

```
AppliedCouponBadge
├── Container (flex, styled)
│   ├── Code Display (bold text)
│   ├── Separator (•)
│   ├── Discount Display (formatted)
│   └── Remove Button (icon/text)
```

### Expected Outcome
- Functional applied coupon badge component
- Clear display of coupon code and discount
- Remove button triggers callback
- Professional, polished appearance
- Responsive design for all devices

### Verification Checklist
- [ ] Component file created at correct location
- [ ] Props interface defined with all fields
- [ ] Badge displays coupon code prominently
- [ ] Discount formatted correctly by type
- [ ] Remove button functional
- [ ] Badge styling applied
- [ ] Component exports properly

---

## Task 25: Create Coupon Remove Button

### Overview
Implement the remove functionality for applied coupons, allowing users to easily remove a coupon from their cart. Handles the remove action, provides confirmation if needed, updates cart state, and provides feedback to the user.

### Dependencies
- Task 24: Create Applied Coupon Badge

### Instructions

1. **Implement remove button in badge**
   - Button already created in Task 24
   - Ensure proper click handler attached
   - Trigger onRemove callback from props

2. **Handle remove callback in parent**
   - Accept onRemove callback in parent component
   - Call API to remove coupon from cart
   - Update local cart state to reflect removal

3. **Add loading state for removal**
   - Show loading indicator during removal API call
   - Disable remove button during processing
   - Prevent duplicate removal requests

4. **Implement removal API call**
   - Call backend endpoint to remove coupon
   - Send cart ID and coupon code
   - Handle success and error responses

5. **Update UI after removal**
   - Remove badge from display
   - Show input component again for new coupon
   - Update cart totals immediately
   - Recalculate discount amounts

6. **Add removal confirmation (optional)**
   - Consider confirmation modal for accidental clicks
   - Show "Remove coupon?" message
   - Include "Yes, remove" and "Cancel" buttons
   - Skip confirmation for simple interactions

7. **Provide removal feedback**
   - Show toast notification "Coupon removed"
   - Update order summary immediately
   - Animate badge fade-out
   - Transition back to input component smoothly

8. **Handle removal errors**
   - Display error message if removal fails
   - Keep badge visible on error
   - Show retry option
   - Log error for debugging

### Remove Flow Diagram

```
User Clicks Remove Button
    ↓
onRemove Callback Triggered
    ↓
Set Loading State
Disable Remove Button
    ↓
Call Remove Coupon API
    ↓
API Responds
    ↓
Success Branch              Error Branch
    ↓                           ↓
Update Cart State          Show Error Message
Remove Badge               Keep Badge Visible
Show Input Again           Enable Remove Button
Update Totals              Offer Retry
Show Success Toast
```

### Remove Button States

| State | Display | Interaction |
|-------|---------|-------------|
| Normal | [×] | Clickable |
| Hover | [×] with highlight | Indicates clickable |
| Loading | [⟳] | Disabled |
| Disabled | [×] grayed | Not clickable |

### API Integration

| Endpoint | Method | Payload |
|----------|--------|---------|
| /api/cart/coupon/remove | POST | { cartId, couponCode } |
| /api/cart/{cartId}/coupon | DELETE | { couponCode } |

### UI Transition After Removal

```
Before (Badge Shown):
┌─────────────────────────────────────┐
│  AVURUDU20  •  ₨500 off     [×]    │
└─────────────────────────────────────┘

During (Removal):
┌─────────────────────────────────────┐
│  AVURUDU20  •  ₨500 off     [⟳]    │
└─────────────────────────────────────┘

After (Input Shown):
┌─────────────────────────────────────┐
│  ┌────────────────┐  ┌──────────┐  │
│  │ Enter Coupon   │  │  Apply   │  │
│  └────────────────┘  └──────────┘  │
└─────────────────────────────────────┘
```

### Confirmation Modal (Optional)

| Element | Content |
|---------|---------|
| Title | "Remove Coupon?" |
| Message | "Are you sure you want to remove AVURUDU20? You will lose your ₨500 discount." |
| Primary Action | "Yes, Remove" (destructive) |
| Secondary Action | "Cancel" |

### Error Handling

| Error Type | User Message | Action |
|------------|--------------|--------|
| Network Error | "Unable to remove coupon. Please try again." | Show retry button |
| Server Error | "Something went wrong. Please try again later." | Keep badge, enable retry |
| Invalid State | "Coupon already removed." | Remove badge |

### Expected Outcome
- Remove button functional in badge
- Coupon removed from cart on click
- Cart totals updated after removal
- Smooth transition back to input
- Error handling for failed removal
- Optional confirmation for safety

### Verification Checklist
- [ ] Remove button triggers removal flow
- [ ] API call to remove coupon implemented
- [ ] Loading state shown during removal
- [ ] Badge removed after successful removal
- [ ] Cart totals recalculated
- [ ] Input component shown after removal
- [ ] Error handling implemented
- [ ] Success feedback provided

---

## Task 26: Create Discount Display

### Overview
Create a reusable DiscountDisplay component to show discount information in various contexts throughout the cart and checkout flow. Formats discounts by type (percentage, fixed amount, free shipping), displays amounts in Sri Lankan Rupees (₨), and provides consistent styling across the application.

### Dependencies
- Task 24: Create Applied Coupon Badge

### Instructions

1. **Create DiscountDisplay component file**
   - Create `DiscountDisplay.tsx` in `components/marketing/coupons/` directory
   - Set up TypeScript React functional component structure

2. **Define component props interface**
   - Create `DiscountDisplayProps` interface
   - Include `discount` number for discount value
   - Include `discountType` enum (percentage, fixed, freeShipping)
   - Include optional `size` prop (small, medium, large)
   - Include optional `showLabel` boolean
   - Include optional `className` for custom styling

3. **Implement discount formatting logic**
   - Create helper function to format discount based on type
   - Format percentage: "20% off"
   - Format fixed: "₨500 off" or "-₨500"
   - Format free shipping: "Free Shipping"
   - Handle number formatting for large amounts (₨1,500)

4. **Create display variants**
   - Inline format: "₨500 off"
   - Badge format: "Save 20%"
   - Negative format: "-₨500" (for order summaries)
   - With label: "Discount: ₨500"

5. **Implement size variants**
   - Small: text-sm, compact spacing
   - Medium: text-base, standard spacing
   - Large: text-lg, emphasized

6. **Apply discount styling**
   - Use green color for savings (text-green-600)
   - Use bold or semibold font weight
   - Add optional icon (percentage, tag, or gift icon)
   - Ensure readability with proper contrast

7. **Handle edge cases**
   - Zero discount: hide or show "No discount"
   - Negative values: display as positive savings
   - Null/undefined: graceful fallback
   - Very large numbers: format with commas

8. **Add optional tooltip**
   - Show discount details on hover
   - Explain discount calculation
   - Display coupon code if applicable

### Component Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| discount | number | Yes | - | Discount value |
| discountType | 'percentage' \| 'fixed' \| 'freeShipping' | Yes | - | Type of discount |
| size | 'small' \| 'medium' \| 'large' | No | 'medium' | Display size |
| showLabel | boolean | No | false | Show "Discount:" label |
| className | string | No | "" | Additional CSS classes |
| format | 'inline' \| 'badge' \| 'negative' | No | 'inline' | Display format |

### Discount Formatting Examples

| Type | Value | Output (inline) | Output (negative) |
|------|-------|-----------------|-------------------|
| Percentage | 20 | "20% off" | "-20%" |
| Fixed | 500 | "₨500 off" | "-₨500" |
| Fixed | 1500 | "₨1,500 off" | "-₨1,500" |
| Free Shipping | 0 | "Free Shipping" | "Free Shipping" |

### Size Variants

| Size | Font Size | Font Weight | Use Case |
|------|-----------|-------------|----------|
| Small | text-sm | font-medium | Badge, compact views |
| Medium | text-base | font-semibold | Standard display |
| Large | text-lg | font-bold | Emphasized savings |

### Display Format Examples

```
Inline Format:
₨500 off

Badge Format:
┌──────────┐
│ Save 20% │
└──────────┘

Negative Format (Order Summary):
-₨500

With Label:
Discount: ₨500 off
```

### Styling Specifications

| Element | Class | Purpose |
|---------|-------|---------|
| Container | flex items-center gap-1 | Horizontal layout |
| Text | text-green-600 | Savings indicator |
| Icon | text-green-500 | Visual accent |
| Font | font-semibold | Emphasis |

### Currency Formatting

| Amount | Formatted | Logic |
|--------|-----------|-------|
| 100 | ₨100 | No comma |
| 1000 | ₨1,000 | Comma separator |
| 5000 | ₨5,000 | Comma separator |
| 12500 | ₨12,500 | Comma separator |

### Component Usage Examples

| Context | Props | Display |
|---------|-------|---------|
| Badge | discount={500}, discountType="fixed" | "₨500 off" |
| Order Summary | discount={500}, format="negative" | "-₨500" |
| Product Card | discount={20}, discountType="percentage", size="small" | "20% off" |
| Cart Header | discount={1500}, showLabel={true} | "Discount: ₨1,500 off" |

### Expected Outcome
- Reusable discount display component
- Consistent formatting across contexts
- Multiple size and format variants
- Proper currency formatting (LKR ₨)
- Clean, readable styling

### Verification Checklist
- [ ] Component file created at correct location
- [ ] Props interface defined
- [ ] Discount formatting logic implemented
- [ ] All discount types handled (percentage, fixed, free shipping)
- [ ] Size variants working
- [ ] Currency formatted correctly with ₨ symbol
- [ ] Negative format for order summaries
- [ ] Component exports properly

---

## Task 27: Create Cart Coupon Section

### Overview
Create the CartCouponSection component to integrate coupon functionality into the shopping cart page. Combines CouponInput and AppliedCouponBadge components into a cohesive section, manages coupon application state, and updates cart totals when coupons are applied or removed.

### Dependencies
- Task 19: Create CouponInput Component
- Task 20: Create CouponInput Validation
- Task 24: Create Applied Coupon Badge
- Task 26: Create Discount Display
- Cart page components from previous phases

### Instructions

1. **Create CartCouponSection component file**
   - Create `CartCouponSection.tsx` in `components/marketing/coupons/` directory
   - Set up TypeScript React functional component structure

2. **Define component props interface**
   - Create `CartCouponSectionProps` interface
   - Include `cartId` string for cart identification
   - Include `appliedCoupon` object or null for current coupon state
   - Include `onCouponApplied` callback for successful application
   - Include `onCouponRemoved` callback for removal

3. **Implement state management**
   - Create state for loading during API calls
   - Create state for error messages
   - Create state for success messages
   - Track whether coupon is applied

4. **Integrate CouponInput component**
   - Render CouponInput when no coupon is applied
   - Pass necessary props (onApply, isLoading, error)
   - Handle apply button click

5. **Integrate AppliedCouponBadge component**
   - Render AppliedCouponBadge when coupon is applied
   - Pass coupon code, discount, and onRemove callback
   - Hide CouponInput when badge is showing

6. **Implement apply coupon logic**
   - Create handler function for coupon application
   - Call API to apply coupon to cart
   - Handle success: show badge, update cart
   - Handle error: display error message

7. **Implement remove coupon logic**
   - Create handler function for coupon removal
   - Call API to remove coupon from cart
   - Update state to show input again
   - Trigger parent callback to update cart totals

8. **Add section styling and layout**
   - Position section above or below cart items
   - Add border or background for separation
   - Include section title "Have a coupon code?"
   - Add collapsible functionality (optional)

9. **Integrate with cart context**
   - Access cart context if using context API
   - Update cart totals when coupon applied/removed
   - Synchronize coupon state across cart components

10. **Add mobile responsiveness**
    - Adjust layout for mobile screens
    - Ensure input and badge stack properly
    - Maintain usability on small screens

### Component Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| cartId | string | Yes | - | Cart identifier |
| appliedCoupon | AppliedCoupon \| null | No | null | Current coupon state |
| onCouponApplied | (coupon: AppliedCoupon) => void | Yes | - | Callback after apply |
| onCouponRemoved | () => void | Yes | - | Callback after removal |

### AppliedCoupon Type

| Field | Type | Description |
|-------|------|-------------|
| code | string | Coupon code |
| discount | number | Discount amount |
| discountType | string | Type of discount |

### Section Layout

```
┌─────────────────────────────────────────┐
│  Have a coupon code?                    │
│                                         │
│  ┌────────────────┐  ┌──────────┐     │
│  │ Enter Code     │  │  Apply   │     │
│  └────────────────┘  └──────────┘     │
└─────────────────────────────────────────┘

OR (when applied):

┌─────────────────────────────────────────┐
│  Coupon Applied                          │
│                                         │
│  ┌───────────────────────────────────┐ │
│  │ AVURUDU20  •  ₨500 off     [×]   │ │
│  └───────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

### Section Placement in Cart

| Option | Location | Pros | Cons |
|--------|----------|------|------|
| Above Items | Top of cart | Immediate visibility | Takes priority over items |
| Below Items | Before totals | Logical flow | May be missed |
| In Totals | Order summary section | Contextual | Crowded |
| Collapsible | Expandable section | Clean when unused | Requires extra click |

### Apply Coupon Flow

```
User Enters Code
    ↓
Click Apply
    ↓
Validate Format
    ↓
Set isLoading = true
    ↓
Call API: POST /api/cart/{cartId}/coupon
Payload: { code: "AVURUDU20" }
    ↓
API Response
    ↓
Success                    Error
    ↓                       ↓
Save Coupon Data       Display Error
Show Badge             Keep Input Visible
Update Cart Totals     Clear isLoading
Call onCouponApplied   
Clear isLoading        
```

### State Management Structure

| State | Type | Purpose |
|-------|------|---------|
| isLoading | boolean | API call in progress |
| error | string \| null | Error message to display |
| showInput | boolean | Toggle input/badge display |

### Collapsible Section (Optional)

```
Collapsed:
┌─────────────────────────────────────┐
│  Have a coupon code?  [+]           │
└─────────────────────────────────────┘

Expanded:
┌─────────────────────────────────────┐
│  Have a coupon code?  [-]           │
│                                     │
│  ┌────────────────┐  ┌──────────┐ │
│  │ Enter Code     │  │  Apply   │ │
│  └────────────────┘  └──────────┘ │
└─────────────────────────────────────┘
```

### Integration with Cart

| Cart Update | Trigger | Action |
|-------------|---------|--------|
| Subtotal | Coupon applied | No change |
| Discount | Coupon applied | Show discount row |
| Total | Coupon applied | Recalculate with discount |
| Discount | Coupon removed | Remove discount row |
| Total | Coupon removed | Recalculate without discount |

### Expected Outcome
- Functional coupon section in cart
- CouponInput for entering codes
- AppliedCouponBadge for active coupons
- Smooth state transitions
- Integration with cart totals
- Mobile-responsive design

### Verification Checklist
- [ ] Component file created at correct location
- [ ] Props interface defined
- [ ] CouponInput integrated and functional
- [ ] AppliedCouponBadge shown when coupon applied
- [ ] Apply coupon API call implemented
- [ ] Remove coupon API call implemented
- [ ] State management working correctly
- [ ] Section styling and layout applied
- [ ] Cart totals update on coupon apply/remove
- [ ] Mobile responsive
- [ ] Component exports properly

---

## Final Document Notes

### Component Files Created
```
frontend/components/marketing/coupons/
├── CouponInput.tsx                    (Task 19)
├── AppliedCouponBadge.tsx            (Task 24)
├── DiscountDisplay.tsx               (Task 26)
└── CartCouponSection.tsx             (Task 27)
```

### API Endpoints Required
| Endpoint | Method | Purpose |
|----------|--------|---------|
| /api/cart/{cartId}/coupon | POST | Apply coupon to cart |
| /api/cart/{cartId}/coupon | DELETE | Remove coupon from cart |
| /api/coupons/validate | POST | Validate coupon format (optional) |

### Next Steps
Continue to Document 02 for checkout integration, order summary discount, available coupons list, and verification.

---
