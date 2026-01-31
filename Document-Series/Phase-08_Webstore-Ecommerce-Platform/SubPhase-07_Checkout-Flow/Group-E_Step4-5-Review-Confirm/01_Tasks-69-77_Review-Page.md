# Tasks 69-77: Review Page with Summaries and Order Submission

> **Phase:** 08 - Webstore & E-Commerce Platform  
> **SubPhase:** 07 - Checkout Flow  
> **Group:** E - Step 4 & 5 - Review & Confirm  
> **Document:** 01 of 02  
> **Tasks Covered:** 69, 70, 71, 72, 73, 74, 75, 76, 77

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-78-84_Confirmation-Verify.md](02_Tasks-78-84_Confirmation-Verify.md)

---

## Document Overview

This document covers the review page implementation for the final checkout step before order submission. It establishes a comprehensive review interface displaying contact information, shipping address, payment method, and order items. Each section includes edit functionality allowing users to quickly navigate back to respective steps to make changes. The document culminates with the Place Order button and submission logic that validates all data and creates the order through the API.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 69 | Create Review Page | Low | 25 min |
| 70 | Create Contact Summary | Low | 20 min |
| 71 | Create Edit Contact Link | Low | 15 min |
| 72 | Create Shipping Summary | Low | 20 min |
| 73 | Create Edit Shipping Link | Low | 15 min |
| 74 | Create Payment Summary | Low | 20 min |
| 75 | Create Edit Payment Link | Low | 15 min |
| 76 | Create Order Items Review | Low | 25 min |
| 77 | Create Place Order Button | Medium | 35 min |

---

## Task 69: Create Review Page

### Overview
Implement the main review page component that serves as step 4 in the checkout flow. This page provides a comprehensive overview of all order information before final submission, presenting contact details, shipping information, payment method, and cart items in an organized, scannable layout.

### Dependencies
- Task 68: Verify Payment Flow (previous step completed)
- Checkout store with contact, shipping, payment data
- Cart store with items and totals
- Review step UI components library
- Responsive layout system

### Instructions

1. **Create review directory structure**
   - Navigate to `frontend/components/storefront/checkout/`
   - Create `Review/` subdirectory
   - Set up component organization pattern

2. **Create ReviewStep component file**
   - Create `ReviewStep.tsx` in `Review/` directory
   - Import necessary dependencies (React, store hooks)
   - Set up TypeScript interface for component props

3. **Configure step context**
   - Access checkout store to get step state
   - Verify current step is 4 (review)
   - Access all previous step data (contact, shipping, payment)

4. **Create page layout structure**
   - Set up responsive container with max-width
   - Create header section with step indicator
   - Define sections for: contact, shipping, payment, items, totals

5. **Implement section dividers**
   - Use consistent spacing between sections
   - Add visual separators (borders/dividers)
   - Create hierarchy with section headings

6. **Create header with step indicator**
   - Display "Review Order" as main heading
   - Show step 4 of 4 indicator
   - Include descriptive subheading text

7. **Set up section containers**
   - Create wrapper for contact summary section
   - Create wrapper for shipping summary section
   - Create wrapper for payment summary section
   - Create wrapper for items review section
   - Create wrapper for order totals section

8. **Implement scroll behavior**
   - Ensure page scrolls to top on mount
   - Add smooth scroll for long content
   - Consider sticky header if needed

9. **Add loading state handling**
   - Show loading indicator while data loads
   - Handle missing data gracefully
   - Display appropriate empty states

10. **Configure section order**
    - Position contact summary first
    - Position shipping summary second
    - Position payment summary third
    - Position items review fourth
    - Position order totals last
    - Position terms and place order button at bottom

### Component Structure

```
ReviewStep.tsx
├── Header Section
│   ├── Step indicator (4/4)
│   ├── Main heading "Review Order"
│   └── Subtitle "Review your order before placing"
├── Contact Summary Section
│   └── ContactSummary component
├── Shipping Summary Section
│   └── ShippingSummary component
├── Payment Summary Section
│   └── PaymentSummary component
├── Items Review Section
│   └── OrderItemsReview component
├── Order Totals Section
│   ├── Subtotal
│   ├── Shipping fee
│   ├── Service fees
│   └── Total amount
└── Submission Section
    ├── Terms checkbox
    └── PlaceOrderButton component
```

### Layout Specifications

**Container:**
- Max width: 800px
- Centered with auto margins
- Padding: 24px mobile, 32px desktop

**Sections:**
- Background: white cards
- Border: 1px solid gray-200
- Border radius: 8px
- Padding: 20px
- Gap between sections: 16px

**Typography:**
- Page heading: text-2xl, font-semibold
- Section headings: text-lg, font-medium
- Body text: text-base
- Label text: text-sm, text-gray-600

### Data Access

**From Checkout Store:**
- Contact information (email, phone, name)
- Shipping address (full address object)
- Payment method selection
- Current step number

**From Cart Store:**
- Cart items with product details
- Item quantities
- Item prices
- Subtotal
- Shipping fee
- Service fees
- Grand total

### State Management

**Component State:**
- Loading state for data fetching
- Error state for missing data
- Terms checkbox state (managed here or in PlaceOrderButton)

**Store Subscriptions:**
- Subscribe to checkout store updates
- Subscribe to cart store updates
- Re-render on relevant changes

### User Experience Considerations

**Clarity:**
- Clear section labels
- Consistent formatting
- Easy-to-scan layout
- Visual hierarchy

**Completeness:**
- Show all relevant information
- Display nothing is hidden
- Include all costs and fees
- Show items with images

**Trust:**
- Professional appearance
- Secure payment indicators
- Clear terms acceptance
- Obvious edit capabilities

### Accessibility

**Semantic HTML:**
- Use appropriate heading levels (h1, h2, h3)
- Use section elements for sections
- Use list elements for items

**ARIA Labels:**
- Label all interactive elements
- Provide context for screen readers
- Announce section purposes

**Keyboard Navigation:**
- Ensure all edit links are keyboard accessible
- Logical tab order through sections
- Focus indicators visible

### Validation

**Pre-submission Checks:**
- Verify contact data exists
- Verify shipping data exists
- Verify payment method selected
- Verify cart is not empty
- Verify all required fields complete

**Error Handling:**
- Show error if data missing
- Provide clear guidance
- Link back to incomplete step
- Prevent submission if invalid

### Testing Scenarios

1. **Complete data display**
   - All sections show correct data
   - Edit links work correctly
   - Items list displays properly

2. **Missing data handling**
   - Redirect if step 1 incomplete
   - Redirect if step 2 incomplete
   - Redirect if step 3 incomplete

3. **Responsive behavior**
   - Mobile layout stacks properly
   - Desktop layout uses space efficiently
   - Touch targets adequate on mobile

---

## Task 70: Create Contact Summary

### Overview
Implement the contact information summary component that displays the customer's email, phone number, and name entered in step 1. This component provides a read-only view of contact details with clear formatting and an edit link to return to the information step if changes are needed.

### Dependencies
- Task 69: Create Review Page (parent container)
- Task 19-27: Information step components (data source)
- Checkout store with contact data
- Icon library for contact icons

### Instructions

1. **Create ContactSummary component**
   - Create `ContactSummary.tsx` in `Review/` directory
   - Set up functional component with TypeScript
   - Import checkout store hook

2. **Access contact data from store**
   - Use checkout store hook to get contact information
   - Extract email, phone, firstName, lastName
   - Handle undefined/null values gracefully

3. **Create component layout**
   - Set up section container with padding
   - Create header row with "Contact Information" title
   - Position edit link in header (handled in Task 71)

4. **Display email information**
   - Show email icon or label
   - Display email address
   - Format with proper spacing
   - Use monospace or standard font

5. **Display phone information**
   - Show phone icon or label
   - Display formatted phone number
   - Format as: +94 7X XXX XXXX
   - Use appropriate phone number formatting

6. **Display name information**
   - Show name icon or label
   - Display full name (firstName + lastName)
   - Handle missing name parts gracefully
   - Format with proper capitalization

7. **Apply consistent styling**
   - Use gray labels for field names
   - Use dark text for values
   - Consistent spacing between fields
   - Left-align content

8. **Add visual indicators**
   - Use icons for each field type
   - Email icon, phone icon, user icon
   - Subtle colors for better scanning
   - Consistent icon size

9. **Handle missing data**
   - Show placeholder if data missing
   - Display "Not provided" message
   - Link to information step to complete
   - Prevent proceeding if required data missing

10. **Ensure readability**
    - Good contrast ratios
    - Adequate font sizes
    - Clear field separation
    - Mobile-friendly layout

### Component Structure

```
ContactSummary
├── Section Container
│   ├── Header Row
│   │   ├── Section Title "Contact Information"
│   │   └── Edit Link (Task 71)
│   └── Fields List
│       ├── Email Field
│       │   ├── Email icon
│       │   ├── Label "Email"
│       │   └── Value (email address)
│       ├── Phone Field
│       │   ├── Phone icon
│       │   ├── Label "Phone"
│       │   └── Value (formatted phone)
│       └── Name Field
│           ├── User icon
│           ├── Label "Name"
│           └── Value (full name)
```

### Data Display Format

**Email:**
```
📧 Email
customer@example.com
```

**Phone:**
```
📱 Phone
+94 77 123 4567
```

**Name:**
```
👤 Name
John Doe
```

### Styling Guidelines

**Container:**
- Background: white or light gray
- Border: subtle border or shadow
- Border radius: 8px
- Padding: 16px

**Field Rows:**
- Gap between fields: 12px
- Vertical layout on mobile
- Optional horizontal layout on desktop

**Labels:**
- Font size: 14px
- Color: gray-600
- Font weight: medium
- Margin bottom: 4px

**Values:**
- Font size: 16px
- Color: gray-900
- Font weight: normal
- Line height: comfortable

### Data Formatting

**Phone Formatting:**
- Input: "771234567"
- Output: "+94 77 123 4567"
- Pattern: "+94 XX XXX XXXX"
- Handle variations gracefully

**Name Formatting:**
- Capitalize first letter of each name
- Trim whitespace
- Handle single name (no last name)
- Handle hyphens and special characters

**Email Formatting:**
- Display as entered (lowercase common)
- No special formatting needed
- Ensure no truncation
- Allow wrapping if very long

### Accessibility

**Labels:**
- Associate labels with values using ARIA
- Use aria-label or aria-describedby
- Provide context for screen readers

**Semantic HTML:**
- Use definition lists (dl, dt, dd) if appropriate
- Use list elements for field groups
- Use span for values

**Focus Management:**
- Edit link should be focusable
- Keyboard accessible navigation
- Clear focus indicators

### Edge Cases

**Missing Data:**
- Show "Not provided" for optional fields
- Show error state for required missing fields
- Provide link to complete information

**Long Values:**
- Wrap long email addresses
- Handle multi-word names
- Prevent overflow

**Special Characters:**
- Handle Unicode in names
- Handle special email characters
- Handle international phone formats

### Validation

**Display Validation:**
- Verify data exists before displaying
- Validate email format matches stored format
- Validate phone format matches stored format
- Show warning if data seems incorrect

**Completeness Check:**
- Ensure all required fields have values
- Highlight missing required data
- Prevent order placement if incomplete

---

## Task 71: Create Edit Contact Link

### Overview
Implement an edit link button in the contact summary section that allows users to navigate back to step 1 (Information) to modify their contact details. This provides a quick way to make changes without manually navigating through the checkout steps.

### Dependencies
- Task 70: Create Contact Summary (parent component)
- Task 69: Create Review Page (review step container)
- Checkout store with step navigation
- Router or navigation system

### Instructions

1. **Add edit link to ContactSummary**
   - Position in header row of contact summary
   - Align to the right opposite the section title
   - Make visually distinct but not overwhelming

2. **Create edit link component**
   - Use button or link element
   - Add "Edit" text label
   - Include edit icon (pencil or similar)
   - Style as secondary/ghost button

3. **Implement click handler**
   - Handle onClick event
   - Call checkout store method to change step
   - Navigate to step 1 (information step)
   - Preserve existing data

4. **Configure navigation behavior**
   - Use checkout store's `setCurrentStep(1)` method
   - Ensure step 1 components mount with existing data
   - Maintain review step as "visited" for return
   - Enable "Continue to Review" from step 1

5. **Add visual feedback**
   - Hover state: change color or underline
   - Active state: slight scale or color change
   - Focus state: outline for keyboard users
   - Disabled state: if editing not allowed

6. **Implement accessibility**
   - Use semantic button or link element
   - Add aria-label: "Edit contact information"
   - Ensure keyboard accessible
   - Clear focus indicator

7. **Handle edge cases**
   - Disable if order is processing
   - Disable if data is locked
   - Show tooltip on hover explaining action
   - Prevent double-click issues

8. **Apply consistent styling**
   - Match other edit links in shipping/payment
   - Use same icon across all edit links
   - Consistent positioning across sections
   - Same hover/focus states

### Component Structure

```
Edit Contact Link
├── Button/Link Element
│   ├── Edit Icon (pencil)
│   ├── "Edit" Text
│   └── onClick Handler
│       └── Navigate to Step 1
```

### Visual Design

**Desktop Layout:**
```
Contact Information                    [✏️ Edit]
```

**Mobile Layout:**
```
Contact Information
                                       [✏️ Edit]
```

### Styling Specifications

**Button:**
- Type: text/ghost button
- Color: primary blue or gray-700
- Font size: 14px
- Font weight: medium
- Padding: 4px 8px
- Border radius: 4px

**Icon:**
- Size: 16px
- Position: left of text or text only
- Color: matches text color
- Margin right: 4px if with text

**States:**
- Default: primary-600
- Hover: primary-700, underline
- Active: primary-800
- Focus: ring outline
- Disabled: gray-400, not-allowed cursor

### Interaction Flow

**User Action:**
1. User clicks "Edit" in contact summary
2. Checkout store updates current step to 1
3. Information step component mounts
4. Form pre-fills with existing contact data
5. User makes changes
6. User clicks "Continue to Shipping" or new "Return to Review"
7. Returns to review step with updated data

**State Preservation:**
- Store maintains all entered data
- Review step marked as "visited"
- Enable quick return to review
- Don't lose other step data (shipping/payment)

### Navigation Logic

**Step Change:**
```
Current: Step 4 (Review)
Action: Click Edit Contact
Result: Navigate to Step 1 (Information)
Store State: currentStep = 1, completedSteps = [1,2,3], visitedSteps = [1,2,3,4]
```

**Return Navigation:**
- Show "Continue to Review" button on step 1
- Or show "Continue" which goes to next incomplete step
- User can also use step indicators to jump back

### Accessibility

**Keyboard:**
- Tab to focus on edit link
- Enter or Space to activate
- Maintains focus management

**Screen Readers:**
- Announces: "Edit contact information button"
- Provides context about action
- Confirms navigation after click

**ARIA:**
- role="button" if using non-button element
- aria-label="Edit contact information"
- aria-disabled if disabled state

### Security Considerations

**Data Integrity:**
- Only allow editing before order submission
- Lock editing during processing
- Validate changes before accepting

**State Management:**
- Ensure store updates atomically
- Prevent race conditions
- Maintain data consistency

### Testing Scenarios

1. **Successful edit flow**
   - Click edit link
   - Navigate to step 1
   - Data pre-filled
   - Make changes
   - Return to review
   - Changes reflected

2. **Disabled state**
   - During order processing
   - Edit link is disabled
   - Hover shows disabled cursor

3. **Keyboard navigation**
   - Tab to edit link
   - Press Enter
   - Navigates correctly

---

## Task 72: Create Shipping Summary

### Overview
Implement the shipping address summary component that displays the delivery address entered in step 2. This component shows the formatted shipping address, selected location details, and delivery notes if provided. It presents the information in a clear, scannable format with an edit link for modifications.

### Dependencies
- Task 69: Create Review Page (parent container)
- Task 35-49: Shipping step components (data source)
- Checkout store with shipping data
- Address formatting utilities

### Instructions

1. **Create ShippingSummary component**
   - Create `ShippingSummary.tsx` in `Review/` directory
   - Set up functional component with TypeScript
   - Import checkout store hook

2. **Access shipping data from store**
   - Use checkout store to get shipping information
   - Extract address, district, city, postalCode
   - Get delivery notes if provided
   - Get selected location/area if applicable

3. **Create component layout**
   - Set up section container with padding
   - Create header row with "Shipping Address" title
   - Position edit link in header (handled in Task 73)
   - Create address display area

4. **Format address display**
   - Show street address on first line
   - Show apartment/unit if provided on second line
   - Show city, district, postal code on third line
   - Show Sri Lanka as country on last line

5. **Display delivery notes**
   - Show separate section if notes provided
   - Label as "Delivery Instructions"
   - Display full notes text
   - Allow wrapping for long notes

6. **Add visual indicators**
   - Use location/map pin icon for address
   - Use note icon for delivery instructions
   - Consistent icon sizing and colors
   - Left-align with text

7. **Implement address formatting logic**
   - Create helper function for address formatting
   - Handle missing optional fields (apartment, notes)
   - Capitalize city/district names appropriately
   - Format postal code consistently

8. **Apply consistent styling**
   - Match contact summary styling
   - Use gray labels for field names
   - Use dark text for values
   - Consistent spacing and padding

9. **Handle missing data**
   - Show error if required address fields missing
   - Display placeholder for optional fields
   - Link to shipping step to complete
   - Prevent proceeding if incomplete

10. **Ensure readability**
    - Multi-line address format
    - Clear line breaks
    - Adequate spacing between lines
    - Mobile-friendly layout

### Component Structure

```
ShippingSummary
├── Section Container
│   ├── Header Row
│   │   ├── Section Title "Shipping Address"
│   │   └── Edit Link (Task 73)
│   └── Content Area
│       ├── Address Block
│       │   ├── Location icon
│       │   ├── Street address line 1
│       │   ├── Street address line 2 (if present)
│       │   ├── City, District, Postal Code
│       │   └── Country (Sri Lanka)
│       └── Delivery Notes (if present)
│           ├── Note icon
│           ├── Label "Delivery Instructions"
│           └── Notes text
```

### Address Display Format

**Full Address:**
```
📍 Shipping Address

123 Galle Road, Colombo 3
Apartment 5B
Colombo, Western Province 00300
Sri Lanka
```

**With Delivery Notes:**
```
📍 Shipping Address

123 Galle Road, Colombo 3
Colombo, Western Province 00300
Sri Lanka

📝 Delivery Instructions
Please leave with security if not home
```

**Minimal Address:**
```
📍 Shipping Address

456 Kandy Road
Kandy, Central Province 20000
Sri Lanka
```

### Styling Guidelines

**Container:**
- Background: white or light gray
- Border: subtle border or shadow
- Border radius: 8px
- Padding: 16px
- Margin top: 16px (separation from contact)

**Address Block:**
- Line height: 1.6
- Font size: 16px
- Color: gray-900
- Max width: 100% (wrap as needed)

**Labels:**
- Font size: 14px
- Color: gray-600
- Font weight: medium
- Margin bottom: 4px

**Delivery Notes:**
- Margin top: 12px
- Padding top: 12px
- Border top: 1px solid gray-200
- Font size: 14px
- Color: gray-700
- Line height: 1.5

### Data Formatting Logic

**Address Formatting:**
```
Line 1: streetAddress
Line 2: apartment/unit (if provided)
Line 3: city, district/province, postalCode
Line 4: "Sri Lanka"
```

**District Names:**
- Capitalize properly: "Western Province", "Central Province"
- Handle variations: "Colombo" district vs "Colombo" city

**Postal Code:**
- Format: 5 digits (00300, 20000, etc.)
- Pad with zeros if needed
- No spaces or hyphens

### Accessibility

**Semantic HTML:**
- Use address element for postal address
- Use p elements for each line
- Use span for inline components

**ARIA:**
- aria-label="Shipping address"
- Proper labels for icons
- Context for screen readers

**Keyboard Navigation:**
- Edit link keyboard accessible
- Tab order logical
- Focus indicators clear

### Edge Cases

**Incomplete Address:**
- Show error state if required fields missing
- Highlight missing information
- Provide link to complete shipping step

**Long Address:**
- Wrap text appropriately
- Don't truncate
- Maintain readability
- Mobile-responsive

**Special Characters:**
- Handle Unicode in street names
- Handle numbers and symbols
- Preserve original formatting

**No Delivery Notes:**
- Don't show notes section if empty
- Collapse space appropriately
- Clean layout without notes

### Validation

**Display Validation:**
- Verify all required fields present
- Check address format validity
- Validate postal code format
- Confirm district/city consistency

**Completeness:**
- Street address required
- City required
- District required
- Postal code required
- Apartment optional
- Notes optional

### Testing Scenarios

1. **Full address with notes**
   - All fields populated
   - Notes displayed correctly
   - Proper formatting

2. **Minimal address**
   - Required fields only
   - No notes section
   - Clean appearance

3. **Long address values**
   - Long street names wrap
   - Long notes wrap
   - No overflow

---

## Task 73: Create Edit Shipping Link

### Overview
Implement an edit link button in the shipping summary section that allows users to navigate back to step 2 (Shipping) to modify their delivery address. This provides quick access to change shipping details without losing data from other steps.

### Dependencies
- Task 72: Create Shipping Summary (parent component)
- Task 69: Create Review Page (review step container)
- Checkout store with step navigation

### Instructions

1. **Add edit link to ShippingSummary**
   - Position in header row of shipping summary
   - Align to the right opposite section title
   - Match styling of contact edit link (Task 71)

2. **Implement click handler**
   - Handle onClick event
   - Call checkout store's setCurrentStep(2)
   - Navigate to step 2 (shipping step)
   - Preserve all existing data

3. **Configure navigation behavior**
   - Set current step to 2
   - Ensure shipping form pre-fills with data
   - Maintain review step as visited
   - Enable return to review after changes

4. **Apply consistent styling**
   - Match edit link from Task 71
   - Same icon (pencil)
   - Same button styling
   - Same hover/focus states

5. **Implement accessibility**
   - aria-label="Edit shipping address"
   - Keyboard accessible
   - Clear focus indicator
   - Screen reader friendly

6. **Handle edge cases**
   - Disable during order processing
   - Prevent navigation if data locked
   - Show hover tooltip
   - Prevent double-clicks

### Component Structure

```
Edit Shipping Link
├── Button Element
│   ├── Edit Icon
│   ├── "Edit" Text
│   └── onClick Handler
│       └── Navigate to Step 2
```

### Visual Design

```
Shipping Address                       [✏️ Edit]
```

### Interaction Flow

**Navigation:**
1. User clicks "Edit" in shipping summary
2. Store updates currentStep to 2
3. Shipping step component mounts
4. Address form pre-fills with data
5. User makes changes
6. User continues to review
7. Changes reflected in shipping summary

### Styling

**Match Task 71:**
- Same button type and color
- Same font size and weight
- Same padding and spacing
- Same states (hover, focus, active, disabled)

### Accessibility

**ARIA:**
- aria-label="Edit shipping address"
- role="button"
- aria-disabled if disabled

**Keyboard:**
- Tab to focus
- Enter/Space to activate
- Maintains logical focus order

### Testing

1. **Edit flow**
   - Click edit
   - Navigate to step 2
   - Data pre-filled
   - Make changes
   - Return to review
   - See updated address

2. **Disabled state**
   - Disabled during processing
   - Cannot click
   - Shows disabled styling

---

## Task 74: Create Payment Summary

### Overview
Implement the payment method summary component that displays the selected payment method from step 3. This component shows whether the user selected Cash on Delivery or Card Payment, displays relevant payment details, and includes an edit link for changing the payment method.

### Dependencies
- Task 69: Create Review Page (parent container)
- Task 50-68: Payment step components (data source)
- Checkout store with payment data
- Payment method icons/images

### Instructions

1. **Create PaymentSummary component**
   - Create `PaymentSummary.tsx` in `Review/` directory
   - Set up functional component with TypeScript
   - Import checkout store hook

2. **Access payment data from store**
   - Use checkout store to get payment method
   - Extract payment type (COD or Card)
   - Get card details if card payment selected
   - Get any payment-related notes

3. **Create component layout**
   - Set up section container with padding
   - Create header row with "Payment Method" title
   - Position edit link in header (handled in Task 75)
   - Create payment display area

4. **Display Cash on Delivery**
   - Show COD icon or cash icon
   - Display "Cash on Delivery" label
   - Show description: "Pay with cash upon delivery"
   - Highlight as selected method

5. **Display Card Payment**
   - Show card icon (credit card image)
   - Display "Card Payment" label
   - Show card details if stored (last 4 digits)
   - Show card brand if available (Visa, Mastercard)
   - Show description: "Pay securely with your card"

6. **Add visual indicators**
   - Use payment method icons
   - Show checkmark or indicator for selected method
   - Consistent icon sizing
   - Professional appearance

7. **Format payment details**
   - For COD: simple label and description
   - For Card: card brand, ending digits
   - Example: "Visa ending in 1234"
   - Keep card details secure (masked)

8. **Apply consistent styling**
   - Match contact and shipping summary styling
   - Use gray labels for field names
   - Use dark text for values
   - Consistent spacing

9. **Handle missing data**
   - Show error if payment method not selected
   - Display placeholder message
   - Link to payment step to complete
   - Prevent order placement if missing

10. **Ensure security**
    - Never display full card numbers
    - Only show last 4 digits if needed
    - Use secure badges if card payment
    - Show payment security messaging

### Component Structure

```
PaymentSummary
├── Section Container
│   ├── Header Row
│   │   ├── Section Title "Payment Method"
│   │   └── Edit Link (Task 75)
│   └── Payment Display
│       ├── Payment Icon
│       ├── Payment Method Name
│       ├── Payment Description
│       └── Card Details (if applicable)
│           ├── Card brand
│           └── Last 4 digits
```

### Payment Display Formats

**Cash on Delivery:**
```
💵 Payment Method

Cash on Delivery
Pay with cash when your order is delivered
```

**Card Payment:**
```
💳 Payment Method

Card Payment
Visa ending in 1234
Pay securely with your card
```

**Card Payment (No Details):**
```
💳 Payment Method

Card Payment
Pay securely with your card
```

### Styling Guidelines

**Container:**
- Background: white or light gray
- Border: subtle border or shadow
- Border radius: 8px
- Padding: 16px
- Margin top: 16px

**Payment Icon:**
- Size: 24px or 32px
- Position: left of text or above on mobile
- Color: matches payment type theme
- Margin: 0 8px 0 0 (or adjust for layout)

**Method Name:**
- Font size: 16px
- Font weight: medium or semibold
- Color: gray-900
- Line height: 1.5

**Description:**
- Font size: 14px
- Color: gray-600
- Line height: 1.5
- Margin top: 4px

**Card Details:**
- Font size: 14px
- Color: gray-700
- Font style: normal
- Margin top: 4px

### Data Formatting

**Payment Type:**
- "cash_on_delivery" → "Cash on Delivery"
- "card_payment" → "Card Payment"
- Capitalize properly

**Card Brand:**
- "visa" → "Visa"
- "mastercard" → "Mastercard"
- "amex" → "American Express"
- Use proper branding

**Card Number:**
- Only show last 4 digits
- Format: "•••• 1234" or "ending in 1234"
- Never show full number
- Maintain PCI compliance

### Security Considerations

**Card Data:**
- Never store full card numbers in frontend
- Only display masked/partial data
- Use tokenization if storing
- Follow PCI-DSS standards

**Display Rules:**
- Last 4 digits maximum
- Card brand/type only
- No CVV ever displayed
- No expiry date displayed

**Secure Badges:**
- Show SSL/security badges for card payments
- Display "Secure Payment" indicator
- Build customer trust
- Professional appearance

### Accessibility

**Semantic HTML:**
- Use appropriate elements for payment info
- Label all visual indicators
- Provide text alternatives for icons

**ARIA:**
- aria-label="Selected payment method"
- Describe payment type to screen readers
- Context for card details

**Keyboard:**
- Edit link keyboard accessible
- Tab order logical
- Focus indicators clear

### Edge Cases

**No Payment Selected:**
- Show error state
- Display "Please select payment method"
- Link to payment step
- Prevent order placement

**Stored Payment Methods:**
- Handle saved card display
- Show multiple saved cards if applicable
- Indicate which is selected
- Mask all sensitive data

**Payment Processing:**
- Show pending state if payment processing
- Display confirmation once processed
- Handle payment failures
- Update display accordingly

### Validation

**Required Selection:**
- Verify payment method is selected
- Check selection is valid type
- Ensure data is complete
- Validate before order placement

**Card Validation:**
- If card payment, ensure card data exists
- Verify token/reference is valid
- Check card is not expired
- Confirm payment can process

### Testing Scenarios

1. **COD selected**
   - Shows COD label and description
   - Displays correctly
   - Edit link works

2. **Card payment selected**
   - Shows card payment label
   - Displays card brand and last 4 digits
   - Secure appearance

3. **No payment selected**
   - Shows error state
   - Prevents proceeding
   - Links to payment step

---

## Task 75: Create Edit Payment Link

### Overview
Implement an edit link button in the payment summary section that allows users to navigate back to step 3 (Payment) to modify their payment method selection. This provides quick access to change payment options while preserving all other checkout data.

### Dependencies
- Task 74: Create Payment Summary (parent component)
- Task 69: Create Review Page (review step container)
- Checkout store with step navigation

### Instructions

1. **Add edit link to PaymentSummary**
   - Position in header row of payment summary
   - Align to the right opposite section title
   - Match styling of previous edit links (Tasks 71, 73)

2. **Implement click handler**
   - Handle onClick event
   - Call checkout store's setCurrentStep(3)
   - Navigate to step 3 (payment step)
   - Preserve all existing data

3. **Configure navigation behavior**
   - Set current step to 3
   - Ensure payment selection pre-fills
   - Maintain review step as visited
   - Enable return to review after changes

4. **Apply consistent styling**
   - Match edit links from Tasks 71 and 73
   - Same icon (pencil)
   - Same button styling
   - Same hover/focus states

5. **Implement accessibility**
   - aria-label="Edit payment method"
   - Keyboard accessible
   - Clear focus indicator
   - Screen reader friendly

6. **Handle edge cases**
   - Disable during order processing
   - Disable during payment processing
   - Prevent navigation if locked
   - Show hover tooltip

### Component Structure

```
Edit Payment Link
├── Button Element
│   ├── Edit Icon
│   ├── "Edit" Text
│   └── onClick Handler
│       └── Navigate to Step 3
```

### Visual Design

```
Payment Method                         [✏️ Edit]
```

### Interaction Flow

**Navigation:**
1. User clicks "Edit" in payment summary
2. Store updates currentStep to 3
3. Payment step component mounts
4. Payment selection pre-filled
5. User changes payment method
6. User continues to review
7. Changes reflected in payment summary

### Styling

**Consistency:**
- Match Tasks 71 and 73 exactly
- Same button type, color, size
- Same states and interactions
- Professional appearance

### Accessibility

**ARIA:**
- aria-label="Edit payment method"
- role="button"
- aria-disabled if needed

**Keyboard:**
- Tab to focus
- Enter/Space to activate
- Logical focus order

### Testing

1. **Edit flow**
   - Click edit
   - Navigate to step 3
   - Selection pre-filled
   - Change method
   - Return to review
   - See updated payment

2. **Disabled states**
   - Disabled during order processing
   - Disabled during payment processing
   - Shows disabled styling

---

## Task 76: Create Order Items Review

### Overview
Implement the order items review component that displays all cart items with product details, quantities, and prices. This component provides a final review of what the customer is purchasing, showing product images, names, variants, quantities, and line item totals before order placement.

### Dependencies
- Task 69: Create Review Page (parent container)
- Cart store with items data
- Product data and images
- Price formatting utilities

### Instructions

1. **Create OrderItemsReview component**
   - Create `OrderItemsReview.tsx` in `Review/` directory
   - Set up functional component with TypeScript
   - Import cart store hook

2. **Access cart data from store**
   - Use cart store to get all cart items
   - Extract product details, quantities, prices
   - Calculate line item totals
   - Get product images and variants

3. **Create component layout**
   - Set up section container with padding
   - Create header with "Order Items" title
   - Create scrollable items list if many items
   - Add item count (e.g., "3 items")

4. **Create item row layout**
   - Product image on left
   - Product details in middle
   - Quantity and price on right
   - Responsive layout for mobile

5. **Display product image**
   - Show product thumbnail (64x64 or 80x80)
   - Use responsive image loading
   - Handle missing images with placeholder
   - Border radius and styling

6. **Display product information**
   - Product name as primary text
   - Variant details if applicable (size, color, etc.)
   - SKU or product code if relevant
   - Clear typography hierarchy

7. **Display quantity**
   - Show quantity label and value
   - Format: "Qty: 2" or "x2"
   - Non-editable (view only)
   - Clear and prominent

8. **Display pricing**
   - Show unit price
   - Show line item total (quantity × price)
   - Format currency: Rs. 1,500.00
   - Right-aligned for easy scanning

9. **Handle multiple items**
   - List all cart items vertically
   - Separate items with dividers
   - Consistent spacing between items
   - Group if needed (future: by vendor, category)

10. **Calculate and display item count**
    - Count total items in cart
    - Display in section header
    - Example: "Order Items (3)"
    - Update dynamically if cart changes

### Component Structure

```
OrderItemsReview
├── Section Container
│   ├── Header Row
│   │   ├── Section Title "Order Items"
│   │   └── Item Count "(3 items)"
│   └── Items List
│       ├── Item Row 1
│       │   ├── Product Image
│       │   ├── Product Details
│       │   │   ├── Product Name
│       │   │   └── Variant Info
│       │   ├── Quantity
│       │   └── Line Total
│       ├── Divider
│       ├── Item Row 2
│       │   └── [Same structure]
│       └── Item Row N
│           └── [Same structure]
```

### Item Row Layout

**Desktop:**
```
[Image] Product Name                     Qty: 2    Rs. 3,000.00
        Color: Blue, Size: L
        Unit: Rs. 1,500.00
```

**Mobile (Stacked):**
```
[Image]  Product Name
         Color: Blue, Size: L
         Qty: 2 × Rs. 1,500.00 = Rs. 3,000.00
```

### Styling Guidelines

**Container:**
- Background: white or light gray
- Border: subtle border or shadow
- Border radius: 8px
- Padding: 16px
- Margin top: 16px

**Item Rows:**
- Padding: 12px 0
- Border bottom: 1px solid gray-200 (except last)
- Hover: slight background change (optional)
- Gap between elements: 12px

**Product Image:**
- Size: 64px × 64px (mobile), 80px × 80px (desktop)
- Border radius: 4px
- Object fit: cover
- Border: 1px solid gray-200

**Product Name:**
- Font size: 16px
- Font weight: medium
- Color: gray-900
- Line height: 1.5

**Variant Info:**
- Font size: 14px
- Color: gray-600
- Margin top: 4px
- Comma-separated if multiple variants

**Quantity:**
- Font size: 14px
- Color: gray-700
- Format: "Qty: 2" or "×2"

**Prices:**
- Font size: 16px
- Font weight: semibold
- Color: gray-900
- Right-aligned
- Currency: Rs. format

### Data Formatting

**Product Names:**
- Truncate if very long (use ellipsis)
- Max 2 lines on mobile
- Full name on hover tooltip

**Variant Display:**
- Format: "Color: Blue, Size: L"
- Capitalize values appropriately
- Show all relevant variant attributes

**Price Formatting:**
- Currency: "Rs." prefix
- Thousands separator: comma
- Decimals: always 2 places (.00)
- Example: "Rs. 1,500.00"

**Quantity:**
- Integer only
- Min: 1
- Format: "×2" or "Qty: 2"

### Cart Data Structure

**Expected Item Object:**
```
{
  id: string
  productId: string
  name: string
  image: string
  price: number
  quantity: number
  variant: {
    color?: string
    size?: string
    [key: string]: any
  }
  sku?: string
  subtotal: number
}
```

### Calculations

**Line Item Total:**
- Formula: quantity × unit price
- Display: formatted currency
- Example: 2 × Rs. 1,500.00 = Rs. 3,000.00

**Item Count:**
- Sum of all quantities
- Or count of unique products
- Display in header

### Accessibility

**Semantic HTML:**
- Use list elements (ul, li) for items
- Use img with alt text for product images
- Use proper heading levels

**ARIA:**
- aria-label for item list
- Describe each item to screen readers
- Provide price context

**Keyboard:**
- Items should not be focusable (view only)
- Ensure parent component handles navigation
- No interactive elements within items

### Edge Cases

**Empty Cart:**
- Should not render if cart is empty
- Parent should handle empty state
- Redirect to cart if no items

**Out of Stock:**
- Show indicator if item out of stock
- Warning message if applicable
- Prevent order placement

**Price Changes:**
- Detect if prices changed since adding to cart
- Show notification if prices differ
- Confirm with user before proceeding

**Missing Images:**
- Use placeholder image
- Show product initials or icon
- Maintain layout consistency

**Long Product Names:**
- Truncate with ellipsis
- Show full name on hover
- Ensure mobile readability

**Many Items:**
- Scroll if more than 5 items
- Show item count prominently
- Consider pagination if needed

### Validation

**Cart Validation:**
- Verify all items still available
- Check quantities are valid
- Confirm prices are current
- Ensure no items were removed

**Display Validation:**
- All images load correctly
- All prices display properly
- Quantities are correct
- Totals calculate accurately

### Testing Scenarios

1. **Single item**
   - Displays correctly
   - Image, name, quantity, price shown
   - Layout proper

2. **Multiple items**
   - All items listed
   - Dividers between items
   - Count is accurate

3. **Item with variants**
   - Variant info displays
   - Clear and readable
   - Proper formatting

4. **Long product name**
   - Truncates appropriately
   - Doesn't break layout
   - Tooltip shows full name

---

## Task 77: Create Place Order Button

### Overview
Implement the Place Order button component that initiates order submission. This button includes terms and conditions acceptance, validates all checkout data, handles the order submission API call, manages loading states, and processes success/error responses. This is the final action in the checkout flow.

### Dependencies
- Task 69: Create Review Page (parent container)
- Tasks 70-76: All summary components (data sources)
- Checkout store with all step data
- Cart store with items and totals
- Order API endpoint
- Terms and conditions content

### Instructions

1. **Create PlaceOrderButton component**
   - Create `PlaceOrderButton.tsx` in `Review/` directory
   - Set up functional component with TypeScript
   - Import necessary hooks and stores

2. **Create order totals section**
   - Display subtotal (sum of all items)
   - Display shipping fee
   - Display service/processing fees if applicable
   - Display grand total
   - Format all amounts as currency

3. **Create terms acceptance checkbox**
   - Add checkbox for terms and conditions
   - Add label with link to terms page
   - Required: must be checked to proceed
   - Track checked state in component

4. **Create Place Order button**
   - Large, prominent primary button
   - Label: "Place Order" or "Complete Order"
   - Position at bottom of review page
   - Full width on mobile, auto width on desktop

5. **Implement validation logic**
   - Verify contact information is complete
   - Verify shipping address is complete
   - Verify payment method is selected
   - Verify cart has items
   - Verify terms are accepted
   - Disable button if validation fails

6. **Implement click handler**
   - Prevent double clicks (debounce)
   - Run pre-submission validation
   - Show loading state
   - Call order submission API
   - Handle response

7. **Create order payload**
   - Collect contact information from store
   - Collect shipping address from store
   - Collect payment method from store
   - Collect cart items from store
   - Include totals and fees
   - Format for API requirements

8. **Handle API submission**
   - Make POST request to order API
   - Include all order data in payload
   - Include authentication token if logged in
   - Set appropriate headers
   - Handle timeout scenarios

9. **Implement loading state**
   - Show loading spinner on button
   - Change button text to "Processing..."
   - Disable all edit links during processing
   - Show overlay to prevent interactions
   - Maintain loading until response received

10. **Handle success response**
    - Parse order ID from response
    - Store order data in checkout store
    - Clear cart store
    - Navigate to confirmation page (Task 78)
    - Show success feedback

11. **Handle error response**
    - Parse error message from API
    - Display user-friendly error message
    - Keep button enabled for retry
    - Log error for debugging
    - Suggest corrective actions

12. **Create order totals display**
    - Show all cost components clearly
    - Highlight grand total
    - Use table or list layout
    - Right-align amounts
    - Bold total amount

### Component Structure

```
PlaceOrderButton
├── Order Totals Section
│   ├── Subtotal Row
│   │   ├── Label "Subtotal"
│   │   └── Amount
│   ├── Shipping Row
│   │   ├── Label "Shipping"
│   │   └── Amount
│   ├── Fees Row (if applicable)
│   │   ├── Label "Service Fee"
│   │   └── Amount
│   ├── Divider
│   └── Total Row
│       ├── Label "Total"
│       └── Amount (bold)
├── Terms Acceptance
│   ├── Checkbox
│   └── Label with Link
│       └── "I agree to the terms and conditions"
└── Place Order Button
    ├── Button Text
    ├── Loading Spinner (if processing)
    └── Click Handler
        └── Submit Order
```

### Order Totals Layout

```
Subtotal                           Rs. 15,000.00
Shipping                              Rs. 500.00
Service Fee                           Rs. 250.00
─────────────────────────────────────────────────
Total                             Rs. 15,750.00
```

### Styling Guidelines

**Order Totals:**
- Background: light gray or white
- Border: subtle border
- Border radius: 8px
- Padding: 16px
- Margin bottom: 16px

**Totals Rows:**
- Display: flex, justify-between
- Padding: 8px 0
- Font size: 16px
- Color: gray-700

**Total Row:**
- Font size: 20px
- Font weight: bold
- Color: gray-900
- Border top: 2px solid gray-300
- Padding top: 12px
- Margin top: 8px

**Terms Checkbox:**
- Margin: 16px 0
- Display: flex, align-items-center
- Gap: 8px
- Font size: 14px

**Terms Link:**
- Color: primary-600
- Underline on hover
- Opens in new tab

**Place Order Button:**
- Size: large (padding: 16px 32px)
- Width: full on mobile, auto on desktop
- Min width: 200px
- Background: primary-600
- Color: white
- Font size: 18px
- Font weight: semibold
- Border radius: 8px
- Shadow: subtle elevation

**Button States:**
- Default: primary-600
- Hover: primary-700, scale(1.02)
- Active: primary-800
- Disabled: gray-400, cursor not-allowed
- Loading: primary-600, show spinner

### Validation Logic

**Pre-submission Checks:**
```
1. Terms accepted? → If no, show error
2. Contact complete? → If no, scroll to contact
3. Shipping complete? → If no, scroll to shipping
4. Payment selected? → If no, scroll to payment
5. Cart not empty? → If no, redirect to cart
6. All required fields valid? → If no, show errors
```

**Validation Messages:**
- "Please accept the terms and conditions"
- "Please complete your contact information"
- "Please provide a shipping address"
- "Please select a payment method"
- "Your cart is empty"

### Order Submission Flow

**Steps:**
1. User checks terms checkbox
2. User clicks "Place Order"
3. Validate all data
4. If invalid, show errors and stop
5. If valid, set loading state
6. Prepare order payload
7. Call order API
8. Wait for response
9. If success, navigate to confirmation
10. If error, show error message

**API Payload Example:**
```
{
  contact: {
    email: "customer@example.com",
    phone: "+94771234567",
    firstName: "John",
    lastName: "Doe"
  },
  shipping: {
    address: "123 Galle Road",
    apartment: "5B",
    city: "Colombo",
    district: "Western Province",
    postalCode: "00300",
    country: "Sri Lanka",
    notes: "Please call before delivery"
  },
  payment: {
    method: "cash_on_delivery" | "card_payment",
    cardToken?: "token_xyz123" // if card payment
  },
  items: [
    {
      productId: "prod_123",
      variantId: "var_456",
      quantity: 2,
      price: 1500.00
    }
  ],
  totals: {
    subtotal: 15000.00,
    shipping: 500.00,
    fees: 250.00,
    total: 15750.00
  }
}
```

### Loading State

**Visual Feedback:**
- Button shows spinner icon
- Button text changes to "Processing Order..."
- Button remains disabled
- Overlay prevents page interactions
- Cursor changes to wait/progress

**Duration:**
- Typical: 2-5 seconds
- Timeout: 30 seconds
- Show error if timeout exceeded

### Error Handling

**Error Types:**
- Network error: "Unable to connect. Please check your internet."
- Validation error: "Please check your information and try again."
- Server error: "Something went wrong. Please try again."
- Timeout error: "Request timed out. Please try again."
- Payment error: "Payment processing failed. Please try again."

**Error Display:**
- Show error message above button
- Red background, white text
- Dismissible with X button
- Auto-dismiss after 10 seconds
- Allow retry after error

**Error Logging:**
- Log error to console
- Send to error tracking service (Sentry, etc.)
- Include order data (without sensitive info)
- Include user context

### Success Handling

**Actions on Success:**
1. Store order ID in checkout store
2. Store order data for confirmation page
3. Clear cart in cart store
4. Clear checkout data (or mark completed)
5. Navigate to confirmation page
6. Show success animation (handled in Task 81)

**Order ID:**
- Receive from API response
- Format: "ORD-123456" or similar
- Store in checkout store
- Pass to confirmation page

### Accessibility

**Keyboard:**
- Checkbox keyboard accessible
- Button keyboard accessible (Enter/Space)
- Tab order logical
- Focus visible

**ARIA:**
- Button: aria-label="Place order"
- Checkbox: aria-label="Accept terms and conditions"
- Loading: aria-busy="true"
- Disabled: aria-disabled="true"

**Screen Readers:**
- Announce terms requirement
- Announce validation errors
- Announce loading state
- Announce success/error

### Security

**Data Handling:**
- Never log sensitive data (full card numbers)
- Use HTTPS for API calls
- Include CSRF token if needed
- Sanitize inputs before submission

**Rate Limiting:**
- Prevent rapid repeated submissions
- Debounce button clicks
- Lock after submission until response
- Show error if rate limited

### Testing Scenarios

1. **Successful order**
   - All data complete
   - Terms accepted
   - Click Place Order
   - Loading state shows
   - Order created
   - Navigate to confirmation

2. **Validation errors**
   - Terms not accepted
   - Click Place Order
   - Error message shows
   - Button remains enabled

3. **API error**
   - Network failure
   - Error message shows
   - Button re-enabled for retry

4. **Loading state**
   - Click Place Order
   - Button shows spinner
   - Button disabled
   - Cannot click again

5. **Terms link**
   - Click terms link
   - Opens in new tab
   - Terms page displays

---

## Summary

This document covered the implementation of the review page (step 4) in the checkout flow, including:

- **Task 69:** Review page structure and layout
- **Task 70:** Contact information summary display
- **Task 71:** Edit contact link for quick modifications
- **Task 72:** Shipping address summary display
- **Task 73:** Edit shipping link for address changes
- **Task 74:** Payment method summary display
- **Task 75:** Edit payment link for method changes
- **Task 76:** Order items review with products and pricing
- **Task 77:** Place Order button with validation and submission

These tasks create a comprehensive review interface that allows customers to verify all order details before final submission. The page provides clear summaries of contact information, shipping address, payment method, and cart items. Edit links enable quick navigation back to previous steps for changes. The Place Order button validates all data, manages the submission process, and handles success/error scenarios.

The implementation follows consistent design patterns, maintains accessibility standards, and provides excellent user experience through clear information display, easy editing capabilities, and robust error handling.

---

## Next Steps

Continue to [02_Tasks-78-84_Confirmation-Verify.md](02_Tasks-78-84_Confirmation-Verify.md) to implement the order confirmation page with order number display, success animation, WhatsApp notification information, and complete flow verification.
